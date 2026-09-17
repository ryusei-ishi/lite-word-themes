<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 管理画面（ユーザー > 会員限定のファイル）
 * =============================================================== */

get_template_part( './functions/membership/protect_files/admin/messages' );
get_template_part( './functions/membership/protect_files/admin/notice' );
get_template_part( './functions/membership/protect_files/admin/view' );
get_template_part( './functions/membership/protect_files/admin/view-lists' );

add_action( 'admin_menu', 'lw_member_files_admin_menu' );
function lw_member_files_admin_menu() {
	$state = lw_member_files_state();
	if ( ! lw_member_files_enabled() && ! $state['active'] && $state['error'] === '' ) {
		return;   // 使っていないサイトにはメニューを出さない
	}
	add_users_page( '会員限定のファイル', '会員限定のファイル', 'manage_options', 'lw-member-files', 'lw_member_files_admin_render' );
}

/** この画面の URL */
function lw_member_files_admin_url( $args = [] ) {
	return add_query_arg( array_merge( [ 'page' => 'lw-member-files' ], $args ), admin_url( 'users.php' ) );
}

/* 「作り直して、もう一度点検する」 */
add_action( 'admin_post_lw_member_files_recheck', 'lw_member_files_admin_recheck' );
function lw_member_files_admin_recheck() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( '権限がありません。' );
	}
	check_admin_referer( 'lw_member_files_recheck' );

	lw_member_files_apply_setting( true, true );

	wp_safe_redirect( lw_member_files_admin_url( [ 'lw_msg' => 'rechecked' ] ) );
	exit;
}
