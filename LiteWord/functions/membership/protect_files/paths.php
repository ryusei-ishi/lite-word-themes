<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 設定と場所
 * =============================================================== */

/**
 * カスタマイザーで ON にされているか（既定 OFF）
 *
 * 守るかどうかの判断に使うので、1時間キャッシュする Lw_theme_mod_set() ではなく直接読む。
 *
 * @return bool
 */
function lw_member_files_enabled() {
	return get_theme_mod( 'lw_membership_protect_files', '' ) === 'on';
}

/**
 * SQL の絞り込みに使う語（uploads のフォルダ名）
 *
 * JSON の中では / が \/ になるので、スラッシュを含まない最後のフォルダ名で探す。
 *
 * @return string
 */
function lw_member_files_uploads_word() {
	$word = basename( lw_member_files_env()['uploads_rel'] );
	return $word !== '' ? $word : 'uploads';
}

/** 目印ファイルを置くフォルダ（uploads の直下） */
function lw_member_files_marker_dirname() {
	return 'lw-member-files';
}

/** 点検用のファイルを一時的に置くフォルダ（uploads の直下） */
function lw_member_files_check_dirname() {
	return 'lw-member-files-check';
}

/**
 * uploads の場所と、この機能が使える構成かどうか
 *
 * error が空でなければ使えない。理由のコードは admin/messages.php で文章にする。
 *
 * @return array{error:string,basedir:string,baseurl:string,home_path:string,uploads_path:string,uploads_rel:string}
 */
function lw_member_files_env() {
	static $env = null;
	if ( $env !== null ) {
		return $env;
	}

	$uploads  = wp_upload_dir( null, false );
	$home     = wp_parse_url( home_url( '/' ) );
	$base     = wp_parse_url( (string) $uploads['baseurl'] );
	$home_dir = ! empty( $home['path'] ) ? trailingslashit( $home['path'] ) : '/';
	$base_dir = ! empty( $base['path'] ) ? trailingslashit( $base['path'] ) : '';

	$env = [
		'error'        => '',
		'basedir'      => wp_normalize_path( untrailingslashit( (string) $uploads['basedir'] ) ),
		'baseurl'      => untrailingslashit( (string) $uploads['baseurl'] ),
		'home_path'    => $home_dir,  // 例 /demo_08/
		'uploads_path' => $base_dir,  // 例 /demo_08/wp-content/uploads/
		'uploads_rel'  => '',         // 例 wp-content/uploads
	];

	if ( is_multisite() ) {
		$env['error'] = 'multisite';
	} elseif ( ! empty( $uploads['error'] ) ) {
		$env['error'] = 'uploads_error';
	} elseif ( empty( $home['host'] ) || empty( $base['host'] ) || strtolower( $home['host'] ) !== strtolower( $base['host'] ) ) {
		$env['error'] = 'uploads_other_host';
	} elseif ( $base_dir === '' || $base_dir === $home_dir || strpos( $base_dir, $home_dir ) !== 0 ) {
		$env['error'] = 'uploads_outside_home';
	} elseif ( ! preg_match( '#^/[A-Za-z0-9._/~-]*$#', $home_dir ) ) {
		$env['error'] = 'unusual_path';
	} else {
		$rel = trim( substr( $base_dir, strlen( $home_dir ) ), '/' );
		if ( ! preg_match( '~^[A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)*$~', $rel ) || substr( $env['basedir'], -strlen( $rel ) - 1 ) !== '/' . $rel ) {
			$env['error'] = 'unusual_path';
		} else {
			$env['uploads_rel'] = $rel;
		}
	}

	return $env;
}

/**
 * 構成の問題（直れば使えるようになるもの）のエラーコードか
 *
 * @param string $code
 * @return bool
 */
function lw_member_files_is_env_error( $code ) {
	return in_array( $code, [ 'multisite', 'uploads_error', 'uploads_other_host', 'uploads_outside_home', 'unusual_path' ], true );
}

/**
 * uploads からの相対パスとして扱ってよいか
 *
 * 空・隠しファイル・親フォルダへの移動・制御文字・目印フォルダの中は認めない。
 *
 * @param string $rel
 * @return bool
 */
function lw_member_files_is_safe_rel( $rel ) {
	$rel = (string) $rel;
	if ( $rel === '' || strlen( $rel ) > 1024 || preg_match( '~[\x00-\x1F\x7F\\\\:*?"<>|]~', $rel ) ) {
		return false;
	}
	$segments = explode( '/', $rel );
	foreach ( $segments as $segment ) {
		if ( $segment === '' || $segment[0] === '.' ) {
			return false;
		}
	}
	return $segments[0] !== lw_member_files_marker_dirname();
}

/**
 * 開かれた URL が uploads の中のファイルなら、uploads からの相対パス（違えば空文字）
 *
 * .htaccess が index.php に回しても REQUEST_URI は元の URL のまま。
 *
 * @return string
 */
function lw_member_files_request_rel() {
	$env = lw_member_files_env();
	if ( $env['error'] !== '' || $env['uploads_path'] === '' || empty( $_SERVER['REQUEST_URI'] ) ) {
		return '';
	}

	$uri  = explode( '?', (string) wp_unslash( $_SERVER['REQUEST_URI'] ), 2 );
	$path = rawurldecode( $uri[0] );
	if ( strpos( $path, $env['uploads_path'] ) !== 0 ) {
		return '';
	}

	$rel = substr( $path, strlen( $env['uploads_path'] ) );
	return lw_member_files_is_safe_rel( $rel ) ? $rel : '';
}

/** .htaccess から回ってきた「ファイルのリクエスト」か（窓口を読み込むかの判定） */
function lw_member_files_is_file_request() {
	return lw_member_files_request_rel() !== '';
}

/**
 * 目印ファイルの場所
 *
 * @param string $rel uploads からの相対パス
 * @return string
 */
function lw_member_files_marker_path( $rel ) {
	return lw_member_files_env()['basedir'] . '/' . lw_member_files_marker_dirname() . '/' . $rel;
}

/**
 * ファイルの URL（日本語などはエンコードする）
 *
 * @param string $rel
 * @return string
 */
function lw_member_files_url( $rel ) {
	return lw_member_files_env()['baseurl'] . '/' . implode( '/', array_map( 'rawurlencode', explode( '/', (string) $rel ) ) );
}

/**
 * このサイトを指すホスト名（www あり・なし、ポート付きも）
 *
 * @return array<string,bool>
 */
function lw_member_files_site_hosts() {
	static $hosts = null;
	if ( $hosts !== null ) {
		return $hosts;
	}

	$hosts = [];
	foreach ( [ home_url(), site_url(), lw_member_files_env()['baseurl'] ] as $url ) {
		$parts = wp_parse_url( $url );
		if ( empty( $parts['host'] ) ) {
			continue;
		}
		$host = preg_replace( '~^www\.~', '', strtolower( $parts['host'] ) ) . ( isset( $parts['port'] ) ? ':' . $parts['port'] : '' );
		$hosts[ $host ]          = true;
		$hosts[ 'www.' . $host ] = true;
	}
	return $hosts;
}
