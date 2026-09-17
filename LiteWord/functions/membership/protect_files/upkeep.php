<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 予約の処理と、管理画面を開いたときの手入れ
 * =============================================================== */

/* ---------- 予約（毎日の見回り・裏での作り直し・準備） ---------- */

add_action( 'lw_member_files_daily', 'lw_member_files_daily_check' );
function lw_member_files_daily_check() {
	if ( ! lw_member_files_is_active() ) {
		wp_clear_scheduled_hook( 'lw_member_files_daily' );
		return;
	}
	lw_member_files_rebuild();
	lw_member_files_ensure_rules();
	lw_member_files_run_check( false );
}

add_action( 'lw_member_files_setup_event', 'lw_member_files_setup_in_background' );
function lw_member_files_setup_in_background() {
	if ( lw_member_files_enabled() && ! lw_member_files_state()['active'] ) {
		lw_member_files_turn_on( false );
	}
}

/* ---------- 管理画面を開いたときの手入れ ---------- */

add_action( 'admin_init', 'lw_member_files_admin_upkeep' );
function lw_member_files_admin_upkeep() {
	// カスタマイザーの画面では、保存済みの下書きの値（まだ公開していない OFF など）で判断してしまうので何もしない
	if ( wp_doing_ajax() || is_customize_preview() || ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$state = lw_member_files_state();
	$env   = lw_member_files_env();

	if ( ! lw_member_files_enabled() ) {
		if ( $state['active'] ) {
			lw_member_files_turn_off();   // カスタマイザー以外の方法で OFF にされた
		}
		return;
	}
	if ( ! $state['active'] ) {
		// カスタマイザー以外の方法で ON にされた・構成の問題が直った。画面は待たせず裏で準備する
		if ( $env['error'] === '' && ( $state['error'] === '' || lw_member_files_is_env_error( $state['error'] ) ) ) {
			lw_member_files_schedule_setup();
		}
		return;
	}
	if ( $env['error'] !== '' ) {
		// ON にした後で構成が変わった（メディアの URL を CDN に向けた など）。ルールを残すと会員にもファイルが出ないので外す
		lw_member_files_turn_off();
		if ( lw_member_files_state()['error'] !== 'htaccess_remove_failed' ) {
			lw_member_files_save_state( false, $env['error'] );
		}
		return;
	}
	// 他のプラグインなどに .htaccess を書き換えられた。書けないサイトで毎回待たせないよう、試すのは10分に1回
	if ( ! lw_member_files_htaccess_is_current() && ! get_transient( 'lw_member_files_repair_wait' ) ) {
		set_transient( 'lw_member_files_repair_wait', 1, 10 * MINUTE_IN_SECONDS );
		if ( lw_member_files_ensure_rules() ) {
			lw_member_files_run_check( false );
		}
	}
	if ( ! wp_next_scheduled( 'lw_member_files_daily' ) ) {
		wp_schedule_event( time() + DAY_IN_SECONDS, 'daily', 'lw_member_files_daily' );
	}
}
