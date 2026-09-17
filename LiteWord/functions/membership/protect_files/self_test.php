<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 本当に守れているかを、サイト自身が確かめる
 *
 * 点検用のファイルを2つ置き、片方にだけ目印を付けて、ログインしていない状態で取りに行く。
 *   目印あり … 中身が返ってこなければよい（403）
 *   目印なし … 今までどおりサーバーがそのまま返せばよい
 * 管理画面から操作したときは、目印ありのファイルが管理者には見えることも確かめる（https のサイトだけ）。
 * =============================================================== */

/**
 * 点検して結果を保存する
 *
 * @param bool $as_current_user ログイン中の人としても取りに行くか
 * @return array{result:string,detail:string,checked_at:int}
 */
function lw_member_files_run_check( $as_current_user ) {
	$check = lw_member_files_self_test( $as_current_user );
	update_option( 'lw_member_files_check', $check, false );
	return $check;
}

/** 保存してある点検の結果 */
function lw_member_files_get_check() {
	$check = get_option( 'lw_member_files_check', [] );
	return is_array( $check ) ? $check : [];
}

/**
 * @param bool $as_current_user
 * @return array{result:string,detail:string,checked_at:int}
 */
function lw_member_files_self_test( $as_current_user ) {
	$env = lw_member_files_env();
	if ( $env['error'] !== '' ) {
		return [ 'result' => 'unsupported', 'detail' => $env['error'], 'checked_at' => time() ];
	}

	$token  = wp_generate_password( 24, false, false );
	$body   = 'lw-member-files-check-' . $token;
	$dir    = lw_member_files_check_dirname();
	$locked = $dir . '/protected-' . $token . '.jpg';
	$open   = $dir . '/public-' . $token . '.jpg';
	$marker = lw_member_files_marker_path( $locked );

	$ready = wp_mkdir_p( $env['basedir'] . '/' . $dir )
		&& lw_member_files_prepare_marker_root()
		&& wp_mkdir_p( dirname( $marker ) )
		&& file_put_contents( $env['basedir'] . '/' . $locked, $body ) !== false
		&& file_put_contents( $env['basedir'] . '/' . $open, $body ) !== false
		&& file_put_contents( $marker, '{"posts":[]}' ) !== false;

	$verdict = [ 'cannot_write', '' ];
	if ( $ready ) {
		$scheme = (string) wp_parse_url( home_url(), PHP_URL_SCHEME );
		$url    = function ( $rel ) use ( $scheme ) {
			return set_url_scheme( lw_member_files_url( $rel ), $scheme );
		};
		$args   = [
			'timeout'     => 8,
			'redirection' => 0,
			'sslverify'   => apply_filters( 'https_local_ssl_verify', false ),
			'headers'     => [ 'Accept' => '*/*' ],
		];
		$guest  = wp_remote_get( $url( $locked ), $args );
		$public = wp_remote_get( $url( $open ), $args );

		// ログイン中の人としても確かめる。送るのはログインの Cookie 1つだけ、https のときだけ
		$member = null;
		if ( $as_current_user && $scheme === 'https' && is_user_logged_in() && isset( $_COOKIE[ LOGGED_IN_COOKIE ] ) ) {
			$member = wp_remote_get( $url( $locked ), $args + [ 'cookies' => [ LOGGED_IN_COOKIE => wp_unslash( $_COOKIE[ LOGGED_IN_COOKIE ] ) ] ] );
		}
		$verdict = lw_member_files_judge( $guest, $public, $member, $body );
		if ( $verdict[0] === 'ok' && lw_member_files_offload_suspected() ) {
			$verdict = [ 'offloaded', '' ];
		}
	}

	@unlink( $env['basedir'] . '/' . $locked );
	@unlink( $env['basedir'] . '/' . $open );
	@unlink( $marker );
	@rmdir( dirname( $marker ) );
	@rmdir( $env['basedir'] . '/' . $dir );

	return [ 'result' => $verdict[0], 'detail' => $verdict[1], 'checked_at' => time() ];
}

/**
 * 取りに行った結果を判定する
 *
 * @param array|WP_Error      $guest  目印ありをログインせずに
 * @param array|WP_Error      $public 目印なしをログインせずに
 * @param array|WP_Error|null $member 目印ありをログイン中の人として（確かめないときは null）
 * @param string              $body   点検用ファイルの中身
 * @return array{0:string,1:string} [ 結果, 詳しいこと ]
 */
function lw_member_files_judge( $guest, $public, $member, $body ) {
	if ( is_wp_error( $public ) || is_wp_error( $guest ) ) {
		$error = is_wp_error( $public ) ? $public : $guest;
		return [ 'unknown', $error->get_error_message() ];
	}

	$public_code = (int) wp_remote_retrieve_response_code( $public );
	if ( wp_remote_retrieve_header( $public, 'x-lw-member-file' ) !== '' ) {
		return [ 'public_broken', 'public ' . $public_code ];
	}
	if ( $public_code !== 200 || wp_remote_retrieve_body( $public ) !== $body ) {
		return [ 'unknown', 'public ' . $public_code ];   // 自分自身に届いていない（認証・WAF など）
	}

	$guest_code = (int) wp_remote_retrieve_response_code( $guest );
	if ( strpos( (string) wp_remote_retrieve_body( $guest ), $body ) !== false ) {
		return [ 'leak', 'guest ' . $guest_code ];
	}
	if ( wp_remote_retrieve_header( $guest, 'x-lw-member-file' ) !== 'denied' ) {
		return [ 'broken', 'guest ' . $guest_code ];
	}

	if ( $member !== null && ! is_wp_error( $member ) ) {
		$member_code = (int) wp_remote_retrieve_response_code( $member );
		if ( $member_code !== 200 || wp_remote_retrieve_body( $member ) !== $body ) {
			return [ 'members_broken', 'member ' . $member_code ];
		}
	}

	return [ 'ok', 'guest ' . $guest_code ];
}

/**
 * メディアの URL が uploads と違う場所（CDN・外部のストレージ）に向いていないか
 *
 * 点検用のファイルは uploads の URL で取りに行くので、配り先が別だと「守れている」と出てしまう。
 * 守っているメディアのうち1件の URL で確かめる。
 *
 * @return bool
 */
function lw_member_files_offload_suspected() {
	$index = lw_member_files_get_index();
	$base  = set_url_scheme( lw_member_files_env()['baseurl'], 'http' ) . '/';

	foreach ( array_keys( isset( $index['attachments'] ) ? $index['attachments'] : [] ) as $attachment_id ) {
		$url = (string) wp_get_attachment_url( $attachment_id );
		if ( $url !== '' ) {
			return strpos( set_url_scheme( $url, 'http' ), $base ) !== 0;
		}
	}
	return false;
}
