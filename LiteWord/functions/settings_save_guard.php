<?php
/**
 * 設定画面の保存の確かめ（なりすまし送信よけ）
 *
 * Lw_theme_mod_text / _select / _radio / _media（customizer/functions.php）と
 * Lw_opt_text / _select / _editor（various_functions.php）は、画面を描くときに
 * $_POST に自分の名前があれば保存する作り。2026-11-02 までは送り元を確かめていなかったため、
 * ログイン中の管理者に罠のページを開かせるだけで、GTM の ID・問い合わせの通知先などを書き換えられた。
 *
 * - 各ヘルパーは入力欄と一緒に lw_settings_nonce_field() で nonce を出す（同じフォームに何度出ても同じ値）
 * - 保存する前に lw_settings_save_allowed() で「POST・nonce・権限」を確かめる。通らなければ保存しない
 * - 権限の既定は manage_options（今これらのヘルパーを使う画面は、Lw SEO設定・Lwお問い合わせ とも manage_options）。
 *   ほかの権限の画面で使うときは lw_settings_save_capability フィルタで変える
 */
if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! defined( 'LW_SETTINGS_NONCE_ACTION' ) ) {
	define( 'LW_SETTINGS_NONCE_ACTION', 'lw_settings_save' );
}
if ( ! defined( 'LW_SETTINGS_NONCE_FIELD' ) ) {
	define( 'LW_SETTINGS_NONCE_FIELD', '_lw_settings_nonce' );
}

/**
 * フォームに nonce を出す。
 * ヘルパーごとに出すので、1つのフォームに同じ値が何度か入る（id は付けない＝重複しない）。
 */
function lw_settings_nonce_field() {
	echo '<input type="hidden" name="' . esc_attr( LW_SETTINGS_NONCE_FIELD ) . '" value="' . esc_attr( wp_create_nonce( LW_SETTINGS_NONCE_ACTION ) ) . '">';
}

/**
 * このリクエストで設定を保存してよいか（1リクエストにつき1回だけ確かめる）。
 *
 * @return bool
 */
function lw_settings_save_allowed() {
	static $allowed = null;
	if ( null !== $allowed ) {
		return $allowed;
	}
	$allowed = false;

	if ( ! isset( $_SERVER['REQUEST_METHOD'] ) || 'POST' !== strtoupper( (string) $_SERVER['REQUEST_METHOD'] ) ) {
		return $allowed;
	}
	if ( ! isset( $_POST[ LW_SETTINGS_NONCE_FIELD ] ) || ! is_string( $_POST[ LW_SETTINGS_NONCE_FIELD ] ) ) {
		return $allowed;
	}
	$nonce = sanitize_text_field( wp_unslash( $_POST[ LW_SETTINGS_NONCE_FIELD ] ) );
	if ( ! wp_verify_nonce( $nonce, LW_SETTINGS_NONCE_ACTION ) ) {
		return $allowed;
	}
	$capability = apply_filters( 'lw_settings_save_capability', 'manage_options' );
	if ( ! current_user_can( $capability ) ) {
		return $allowed;
	}

	$allowed = true;
	return $allowed;
}

/**
 * 送られた値を1つ取り出す（文字列だけ・スラッシュを外す）。配列などは null。
 *
 * @param string $name 欄の名前
 * @return string|null
 */
function lw_settings_posted_string( $name ) {
	if ( ! isset( $_POST[ $name ] ) || ! is_scalar( $_POST[ $name ] ) ) {
		return null;
	}
	return (string) wp_unslash( $_POST[ $name ] );
}

/**
 * URL を入れる欄か（名前の末尾が _url）。
 * お問い合わせの「サンクスページの URL」「同意欄のリンク先」がこれに当たる。
 *
 * @param string $name 欄の名前
 * @return bool
 */
function lw_settings_is_url_field( $name ) {
	return (bool) preg_match( '/_url$/', (string) $name );
}

/**
 * URL の欄の値を整える（http・https とサイト内の相対パスだけ。javascript: などは空にする）。
 *
 * @param string $value 値
 * @return string
 */
function lw_settings_sanitize_url( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	return esc_url_raw( $value, array( 'http', 'https' ) );
}
