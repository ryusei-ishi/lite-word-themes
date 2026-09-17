<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― ON / OFF の切り替え
 *
 * オプション lw_member_files_state
 *   active … 目印を保っている（ルールを書けなかったときも、手で書けば効くよう保つ）
 *   error  … 使えない・書けなかった理由のコード（admin/messages.php で文章にする）
 * =============================================================== */

/** @return array{active:bool,error:string} */
function lw_member_files_state() {
	$state = get_option( 'lw_member_files_state', [] );
	return array_merge( [ 'active' => false, 'error' => '' ], is_array( $state ) ? $state : [] );
}

function lw_member_files_save_state( $active, $error ) {
	update_option( 'lw_member_files_state', [ 'active' => (bool) $active, 'error' => (string) $error ] );
}

/** ON にされていて、準備も済んでいるか */
function lw_member_files_is_active() {
	return lw_member_files_enabled() && lw_member_files_state()['active'];
}

/**
 * カスタマイザーの設定に合わせる
 *
 * @param bool $as_current_user 点検のとき、ログイン中の人としても確かめるか
 * @param bool $force           準備済みでも作り直して点検し直すか（「もう一度点検する」）
 * @return void
 */
function lw_member_files_apply_setting( $as_current_user, $force = false ) {
	$state = lw_member_files_state();

	if ( ! lw_member_files_enabled() ) {
		if ( $state['active'] || $state['error'] !== '' || is_dir( lw_member_files_marker_root() ) ) {
			lw_member_files_turn_off();
		}
		return;
	}

	if ( $state['active'] && ! $force ) {
		lw_member_files_ensure_rules();
		lw_member_files_request_rebuild( 'now' );
		return;
	}

	lw_member_files_turn_on( $as_current_user );
}

/**
 * ON にする: 準備済みにする → 目印を作る → ルールを書く → 点検する
 *
 * 先に「準備済み」にしておく。記事が多すぎて作り直しが時間切れで落ちても、
 * 管理画面を開くたびに最初からやり直して、管理画面ごと開けなくなることがないように。
 *
 * @param bool $as_current_user
 * @return void
 */
function lw_member_files_turn_on( $as_current_user ) {
	$env = lw_member_files_env();
	if ( $env['error'] !== '' ) {
		lw_member_files_save_state( false, $env['error'] );
		return;
	}

	lw_member_files_save_state( true, '' );
	if ( ! wp_next_scheduled( 'lw_member_files_daily' ) ) {
		wp_schedule_event( time() + DAY_IN_SECONDS, 'daily', 'lw_member_files_daily' );
	}

	lw_member_files_rebuild();
	lw_member_files_ensure_rules();
	lw_member_files_run_check( $as_current_user );
}

/**
 * ON なのに準備していないときは、裏の予約で準備する（1時間に1回まで）
 *
 * @return void
 */
function lw_member_files_schedule_setup() {
	if ( get_transient( 'lw_member_files_setup_wait' ) || wp_next_scheduled( 'lw_member_files_setup_event' ) ) {
		return;
	}
	set_transient( 'lw_member_files_setup_wait', 1, HOUR_IN_SECONDS );
	wp_schedule_single_event( time(), 'lw_member_files_setup_event' );
}

/**
 * OFF にする: ルールを消す → 目印を消す → 一覧・点検の結果・予約を消す
 *
 * @return void
 */
function lw_member_files_turn_off() {
	$removed = lw_member_files_remove_htaccess();

	lw_member_files_delete_all_markers();
	foreach ( [ 'lw_member_files_index', 'lw_member_files_check', 'lw_member_files_pending', 'lw_member_files_building', 'lw_member_files_failed', 'lw_member_files_db_error' ] as $option ) {
		delete_option( $option );
	}
	foreach ( [ 'lw_member_files_daily', 'lw_member_files_rebuild_event', 'lw_member_files_setup_event' ] as $hook ) {
		wp_clear_scheduled_hook( $hook );
	}

	if ( is_wp_error( $removed ) ) {
		lw_member_files_save_state( false, 'htaccess_remove_failed' );
	} else {
		delete_option( 'lw_member_files_state' );
	}
}

/**
 * ルールが消えていたり古かったりしたら書き直す
 *
 * @return bool いまのルールが入っているか
 */
function lw_member_files_ensure_rules() {
	if ( lw_member_files_htaccess_is_current() ) {
		$state = lw_member_files_state();
		if ( ! $state['active'] || $state['error'] !== '' ) {
			lw_member_files_save_state( true, '' );
		}
		return true;
	}
	$written = lw_member_files_write_htaccess();
	lw_member_files_save_state( true, is_wp_error( $written ) ? $written->get_error_code() : '' );
	return ! is_wp_error( $written );
}
