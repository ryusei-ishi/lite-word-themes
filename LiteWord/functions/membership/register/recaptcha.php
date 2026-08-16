<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：reCAPTCHA v3
 *
 * メールフォーム拡張の設定（キー・ON/OFF）をそのまま使い回す。
 * 拡張がOFFのサイトでは can_use_recaptcha() が存在しないので使わない。
 * =============================================================== */

/* ---------------------------------------------------------------
 * ③ reCAPTCHA v3（メールフォームの設定を使い回す）
 * ------------------------------------------------------------- */

/**
 * reCAPTCHA を使える状態か
 *
 * メールフォーム拡張がOFFのサイトでは can_use_recaptcha() が
 * 存在しないので、そのときは使わない（登録を止めない）。
 *
 * @return bool
 */
function lw_member_register_can_use_recaptcha() {

	if ( ! function_exists( 'can_use_recaptcha' ) || ! can_use_recaptcha() ) {
		return false;
	}

	return get_option( 'lw_form_recaptcha_site_key', '' ) !== ''
		&& get_option( 'lw_form_recaptcha_secret_key', '' ) !== '';
}

/**
 * reCAPTCHA の検証
 *
 * @return true|WP_Error
 */
function lw_member_register_recaptcha_ok() {

	if ( ! lw_member_register_can_use_recaptcha() ) {
		return true;
	}

	$token = isset( $_POST['g-recaptcha-response'] )
		? sanitize_text_field( wp_unslash( $_POST['g-recaptcha-response'] ) )
		: '';

	if ( $token === '' ) {
		return new WP_Error( 'lw_register_recaptcha', 'reCAPTCHA の確認ができませんでした。ページを再読み込みしてお試しください。' );
	}

	$verify = wp_remote_get(
		add_query_arg(
			[
				'secret'   => get_option( 'lw_form_recaptcha_secret_key', '' ),
				'response' => $token,
			],
			'https://www.google.com/recaptcha/api/siteverify'
		)
	);

	$body = json_decode( wp_remote_retrieve_body( $verify ), true );

	if ( empty( $body['success'] ) || ( isset( $body['score'] ) && $body['score'] < 0.5 ) ) {
		return new WP_Error( 'lw_register_recaptcha', 'reCAPTCHA の検証に失敗しました。' );
	}

	return true;
}
