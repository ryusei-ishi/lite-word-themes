<?php
/**
 * 権限（ロール）の設定 — ローダーとメニュー登録
 *
 * 「ユーザー」メニューの中に画面を1つ足すだけ。
 * 会員限定機能（membership）の一部なので LW_EXPANSION_BASE の中で読まれる。
 *
 * ⚠️ ロールは `wp_user_roles` オプション（＝サイト全体・テーマを変えても残る）。
 *    詳細と注意点は store.php の冒頭を参照。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

get_template_part( './functions/membership/roles_admin/store' );
get_template_part( './functions/membership/roles_admin/capabilities' );
get_template_part( './functions/membership/roles_admin/create' );
get_template_part( './functions/membership/roles_admin/usage' );
get_template_part( './functions/membership/roles_admin/handlers' );
get_template_part( './functions/membership/roles_admin/notice' );
get_template_part( './functions/membership/roles_admin/view-list' );
get_template_part( './functions/membership/roles_admin/view-delete' );

add_action( 'admin_menu', function () {
	add_users_page(
		'権限（ロール）の設定',
		'権限（ロール）の設定',
		lw_roles_admin_cap(),
		'lw-roles',
		'lw_roles_admin_render'
	);
} );

/** 画面の振り分け（一覧 / 削除確認） */
function lw_roles_admin_render() {

	if ( ! current_user_can( lw_roles_admin_cap() ) ) {
		wp_die( '権限がありません。' );
	}

	$view = isset( $_GET['lw_view'] ) ? sanitize_key( wp_unslash( $_GET['lw_view'] ) ) : '';

	if ( $view === 'delete' ) {
		lw_roles_admin_render_delete();
		return;
	}
	lw_roles_admin_render_list();
}
