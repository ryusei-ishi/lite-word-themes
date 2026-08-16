<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：2段目（認証番号とパスワード）の確認
 *
 * 1段目（validate.php）はまだ誰も作らない。この画面を通って初めて
 * ユーザーができる。
 *
 * 🚨 総当たり対策は「1つの仮登録につき5回まで」（pending.php）で行う。
 *    仮登録を作るには1段目を通る必要があり、そちらは同じ相手から
 *    1時間5回までなので、1時間に試せるのは最大25通り。
 *    番号は100万通りあるので現実的に当てられない。
 * =============================================================== */

/** パスワードの最低文字数 */
const LW_MEMBER_REGISTER_PASS_MIN = 8;

/** パスワードの最大文字数（極端に長いものを受け取らないため） */
const LW_MEMBER_REGISTER_PASS_MAX = 200;

/**
 * 認証番号とパスワードを確かめる
 *
 * @return array|WP_Error 通れば ['token'=>, 'pending'=>, 'password'=>]
 */
function lw_member_register_validate_code() {

	if ( ! lw_member_register_enabled() ) {
		return new WP_Error( 'lw_register_off', '現在、会員登録を受け付けていません。' );
	}

	if ( is_user_logged_in() ) {
		return new WP_Error( 'lw_register_logged_in', 'すでにログインしています。' );
	}

	$nonce = isset( $_POST['lw_member_register_code_nonce'] )
		? (string) wp_unslash( $_POST['lw_member_register_code_nonce'] )
		: '';

	if ( ! wp_verify_nonce( $nonce, 'lw_member_register_code' ) ) {
		return new WP_Error( 'lw_register_nonce', 'ページを開いてから時間が経っています。もう一度お試しください。' );
	}

	$token = lw_member_register_sanitize_token( $_POST['lw_reg_token'] ?? '' );
	if ( $token === '' ) {
		return new WP_Error( 'lw_register_expired', '登録の手続きが確認できませんでした。お手数ですが、最初からやり直してください。' );
	}

	/* 番号の照合。間違えた回数はここで数えられる（5回で仮登録ごと無効） */
	$pending = lw_member_register_check_code( $token, $_POST['lw_reg_code'] ?? '' );
	if ( is_wp_error( $pending ) ) {
		return $pending;
	}

	$password = lw_member_register_validate_password();
	if ( is_wp_error( $password ) ) {
		return $password;
	}

	return [
		'token'    => $token,
		'pending'  => $pending,
		'password' => $password,
	];
}

/**
 * パスワードを確かめる
 *
 * ⚠️ パスワードだけは sanitize_text_field を通さない。
 *    記号や全角が勝手に削られると、本人が入力したものと違うものが
 *    保存されてしまう。生の値をそのまま使い、長さと一致だけ見る。
 *
 * @return string|WP_Error
 */
function lw_member_register_validate_password() {

	$password = isset( $_POST['lw_reg_password'] ) ? (string) wp_unslash( $_POST['lw_reg_password'] ) : '';
	$confirm  = isset( $_POST['lw_reg_password_2'] ) ? (string) wp_unslash( $_POST['lw_reg_password_2'] ) : '';

	if ( $password === '' ) {
		return new WP_Error( 'password', 'パスワードを入力してください。' );
	}

	if ( mb_strlen( $password ) < LW_MEMBER_REGISTER_PASS_MIN ) {
		return new WP_Error( 'password', sprintf( 'パスワードは%d文字以上で入力してください。', LW_MEMBER_REGISTER_PASS_MIN ) );
	}

	if ( mb_strlen( $password ) > LW_MEMBER_REGISTER_PASS_MAX ) {
		return new WP_Error( 'password', sprintf( 'パスワードは%d文字以内で入力してください。', LW_MEMBER_REGISTER_PASS_MAX ) );
	}

	if ( ! hash_equals( $password, $confirm ) ) {
		return new WP_Error( 'password', '確認用のパスワードが一致しません。' );
	}

	return $password;
}
