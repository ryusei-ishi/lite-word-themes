<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 守れていないときの警告（管理画面の上部）
 * =============================================================== */

add_action( 'admin_notices', 'lw_member_files_admin_notice' );
function lw_member_files_admin_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$screen = get_current_screen();
	if ( $screen && $screen->id === 'users_page_lw-member-files' ) {
		return;   // この画面では本文の中に出す
	}

	$problems = lw_member_files_problems();
	foreach ( $problems as $problem ) {
		printf(
			'<div class="notice notice-%1$s"><p><strong>会員限定の記事の写真・PDF を守る設定：</strong>%2$s <a href="%3$s">詳しく見る</a></p></div>',
			esc_attr( $problem[0] ),
			esc_html( $problem[1] ),
			esc_url( lw_member_files_admin_url() )
		);
	}
}

/**
 * いま知らせるべきこと
 *
 * @return array<int,array{0:string,1:string}> [ notice の種類, 文章 ]
 */
function lw_member_files_problems() {
	$state    = lw_member_files_state();
	$problems = [];

	if ( $state['error'] !== '' ) {
		$problems[] = [ 'error', lw_member_files_error_text( $state['error'] ) ];
	} elseif ( lw_member_files_enabled() && ! $state['active'] ) {
		$problems[] = [ 'warning', 'ON になっていますが、準備がまだ終わっていません（サーバーの予約処理が動いていない可能性があります）。「ユーザー > 会員限定のファイル」の「一覧を作り直して、もう一度点検する」を押してください。' ];
	}
	if ( lw_member_files_is_active() ) {
		$check = lw_member_files_get_check();
		if ( ! empty( $check['result'] ) && $check['result'] !== 'ok' ) {
			$problems[] = lw_member_files_check_text( $check['result'] );
		}
		$failed = (int) get_option( 'lw_member_files_failed', 0 );
		if ( $failed ) {
			$problems[] = [ 'error', sprintf( '目印のファイルを %d 個書けませんでした（メディアの置き場所の権限）。そのファイルは守れていません。', $failed ) ];
		}
		if ( get_option( 'lw_member_files_db_error' ) ) {
			$problems[] = [ 'error', '守るファイルの一覧を作り直すときに、データベースのエラーが出ています。前の一覧のまま守っていますが、新しく載せたファイルは守られていないことがあります。' ];
		}
		$building = (int) get_option( 'lw_member_files_building', 0 );
		if ( $building && $building < time() - 15 * MINUTE_IN_SECONDS ) {
			$problems[] = [ 'error', '守るファイルの一覧の作り直しが、途中で止まっています（記事やメディアが多く、サーバーの制限時間内に終わらなかった可能性があります）。新しく載せたファイルが守られていないことがあります。' ];
		}
	}
	return $problems;
}
