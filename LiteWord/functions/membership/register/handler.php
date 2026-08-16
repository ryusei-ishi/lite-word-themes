<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：登録処理（2段階）
 *
 * フォームは自分が置かれているページに POST する。
 * それを template_redirect（画面を描き始める前）で受ける。
 *
 *   1段目 … お名前・メール等 → 🚨 まだ誰も作らない。
 *           6桁の番号をメールで送り、内容は仮登録（transient）に預ける
 *   2段目 … 番号＋パスワード → 合っていれば、ここで初めてユーザーを作る
 *
 * 失敗したときはそのままページを描画してフォームにエラーを出す。
 * 成功したときは ?lw_reg=... を付けてリダイレクトする（再読み込みで
 * 二重に処理されないようにするため）。
 * =============================================================== */

add_action( 'template_redirect', 'lw_member_register_handle' );

/**
 * 会員登録の POST を受ける
 *
 * @return void
 */
function lw_member_register_handle() {

	if ( ! empty( $_POST['lw_member_register'] ) ) {
		lw_member_register_handle_entry();
		return;
	}

	if ( ! empty( $_POST['lw_member_register_code'] ) ) {
		lw_member_register_handle_code();
	}
}

/**
 * 1段目 ― 入力内容を預けて、認証番号を送る
 *
 * @return void
 */
function lw_member_register_handle_entry() {

	$values = lw_member_register_validate();

	if ( is_wp_error( $values ) ) {
		lw_member_register_state( [ 'errors' => $values, 'values' => lw_member_register_posted_values() ] );
		return;
	}

	$pending = lw_member_register_create_pending( $values, lw_member_register_collect_profile_fields() );

	if ( ! lw_member_register_send_code( $values['email'], $values['name'], $pending['code'] ) ) {

		// 送れなかったら仮登録も消す。番号を知らせずに残しても意味がない
		lw_member_register_delete_pending( $pending['token'] );

		lw_member_register_state( [
			'errors' => new WP_Error( 'lw_register_mail_failed', '認証番号のメールを送れませんでした。お手数ですが、時間をおいてもう一度お試しください。' ),
			'values' => $values,
		] );
		return;
	}

	wp_safe_redirect( add_query_arg(
		[ 'lw_reg' => 'code', 't' => $pending['token'] ],
		lw_member_register_return_url()
	) );
	exit;
}

/**
 * 2段目 ― 番号が合っていればユーザーを作る
 *
 * @return void
 */
function lw_member_register_handle_code() {

	$checked = lw_member_register_validate_code();

	if ( is_wp_error( $checked ) ) {
		lw_member_register_state( [ 'errors' => $checked, 'values' => [] ] );
		return;
	}

	$user_id = lw_member_register_create_user( $checked['pending'], $checked['password'] );

	if ( is_wp_error( $user_id ) ) {
		lw_member_register_state( [ 'errors' => $user_id, 'values' => [] ] );
		return;
	}

	lw_member_register_delete_pending( $checked['token'] );

	wp_safe_redirect( add_query_arg( 'lw_reg', 'done', lw_member_register_return_url() ) );
	exit;
}

/**
 * 登録後に戻る先
 *
 * フォームが置かれていたページへ戻す。
 * 🚨 POST の値をそのまま使わない。wp_validate_redirect() で
 *    自サイト内かどうかを確かめてから使う（外部サイトへ飛ばさない）。
 *
 * @return string
 */
function lw_member_register_return_url() {

	$url = isset( $_POST['lw_reg_redirect'] ) ? (string) wp_unslash( $_POST['lw_reg_redirect'] ) : '';
	$url = wp_validate_redirect( $url, '' );

	if ( $url === '' ) {
		$url = lw_member_register_page_url();
	}
	if ( $url === '' ) {
		$url = home_url( '/' );
	}

	return remove_query_arg( [ 'lw_reg', 't' ], $url );
}

/* ---------------------------------------------------------------
 * 画面に渡す状態
 * ------------------------------------------------------------- */

/**
 * エラーと入力内容の受け渡し
 *
 * ⚠️ get_template_part() は呼び出し元のローカル変数を渡さないので、
 *    lw_membership_block() と同じく静的変数で持ち回る。
 *
 * @param array|null $set 設定するとき配列を渡す
 * @return array ['errors'=>WP_Error|null, 'values'=>array]
 */
function lw_member_register_state( $set = null ) {

	static $state = [ 'errors' => null, 'values' => [] ];

	if ( is_array( $set ) ) {
		$state = $set;
	}

	return $state;
}

/**
 * 登録が終わった直後の表示か（?lw_reg=done）
 *
 * @return bool
 */
function lw_member_register_is_done() {
	return isset( $_GET['lw_reg'] ) && $_GET['lw_reg'] === 'done';
}
