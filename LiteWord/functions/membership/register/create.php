<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：ユーザーを作る
 *
 * 呼ばれるのは、メールに送った認証番号が合ったときだけ。
 * 受け口は handler.php の lw_member_register_handle_code()。
 * =============================================================== */

/**
 * ユーザーを作る
 *
 * 🚨 WordPress 標準の register_new_user() は使わない。
 *    あちらはパスワードを自動生成して「設定リンク」をメールで送る作りで、
 *    こちらは本人がこの画面でパスワードを決めているため。
 *    代わりに、あちらが呼ぶチェック（registration_errors フィルタ）は
 *    validate.php で明示的に通してある。
 *
 * @param array  $pending  仮登録の中身
 * @param string $password 本人が決めたパスワード
 * @return int|WP_Error
 */
function lw_member_register_create_user( $pending, $password ) {

	/* 番号を待っている間に、同じメール・同じ名前で誰かが登録しているかもしれない */
	if ( email_exists( $pending['email'] ) ) {
		return new WP_Error( 'lw_register_taken', 'このメールアドレスは、すでに登録されています。' );
	}

	$login = (string) $pending['login'];
	if ( username_exists( $login ) ) {
		$login = lw_member_register_build_login( (string) $pending['email'] );
	}

	$user_id = wp_create_user( $login, $password, (string) $pending['email'] );

	if ( is_wp_error( $user_id ) || ! $user_id ) {
		return new WP_Error(
			'lw_register_failed',
			'登録できませんでした。お手数ですが、しばらく時間をおいてからもう一度お試しください。'
		);
	}

	/* 権限（ロール）。wp_create_user は「設定 > 一般」の既定値を使うので上書きする */
	$user = get_user_by( 'id', $user_id );
	if ( $user ) {
		$user->set_role( lw_member_register_role() );
	}

	if ( (string) $pending['name'] !== '' ) {
		wp_update_user( [
			'ID'           => $user_id,
			'display_name' => (string) $pending['name'],
			'nickname'     => (string) $pending['name'],
		] );
	}

	lw_member_register_apply_profile_fields( $user_id, $pending['profile'] ?? [] );

	/* 管理者にだけ「新しい会員が登録されました」を送る。
	   本人宛のパスワード設定メールは要らない（もう決めてもらっている） */
	wp_new_user_notification( $user_id, null, 'admin' );

	/**
	 * 会員登録が終わったとき
	 *
	 * @param int   $user_id
	 * @param array $pending 仮登録の中身
	 */
	do_action( 'lw_member_registered', $user_id, $pending );

	return $user_id;
}
