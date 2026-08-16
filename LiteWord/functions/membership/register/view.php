<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：表示側で使う小道具
 *
 * テンプレート（templates/membership/register/）から呼ぶ。
 * デザインパターンを増やしても同じ判定を書き直さなくていいように、
 * 「いまどの画面を出すか」「どこに送るか」「どのエラーを出すか」を
 * ここに集めている。
 * =============================================================== */

/**
 * いま出すべき画面
 *
 *   'off'       … 受け付けていない（管理者にだけ理由を出す）
 *   'logged_in' … すでにログインしている
 *   'done'      … 登録が終わった直後
 *   'code'      … 認証番号の入力待ち（仮登録が生きている）
 *   'form'      … 入力フォーム
 *
 * ⚠️ 番号を5回間違えると仮登録が消えるので、'code' から 'form' に戻る。
 *    そのときの理由は全般エラーとして画面に出る。
 *
 * @return string
 */
function lw_member_register_view_state() {

	if ( ! lw_member_register_enabled() ) {
		return 'off';
	}

	if ( is_user_logged_in() ) {
		return 'logged_in';
	}

	if ( lw_member_register_is_done() ) {
		return 'done';
	}

	if ( lw_member_register_token() !== '' ) {
		return 'code';
	}

	return 'form';
}

/**
 * いま手続き中の仮登録トークン
 *
 * URL（?t=）か、番号を間違えて戻ってきたときの POST から拾う。
 * 仮登録が生きているものだけを返す。
 *
 * @return string 無ければ空文字
 */
function lw_member_register_token() {

	static $token = null;

	if ( $token !== null ) {
		return $token;
	}

	$raw = isset( $_POST['lw_reg_token'] )
		? wp_unslash( $_POST['lw_reg_token'] )
		: ( $_GET['t'] ?? '' );

	$candidate = lw_member_register_sanitize_token( $raw );

	$token = ( $candidate !== '' && lw_member_register_get_pending( $candidate ) ) ? $candidate : '';

	return $token;
}

/**
 * 認証番号フォームの送信先
 *
 * 🚨 こちらは ?lw_reg=code&t= を付けたままにする。
 *    番号を間違えて戻ってきたあとに再読み込みされても、
 *    手続きの続きから始められるようにするため。
 *
 * @return string
 */
function lw_member_register_code_form_action() {

	return add_query_arg(
		[ 'lw_reg' => 'code', 't' => lw_member_register_token() ],
		lw_member_register_form_action()
	);
}

/**
 * フォームの送信先（＝いま表示しているページ）
 *
 * 同じページに POST し、template_redirect で受ける。
 * ?lw_reg=done が付いたままだと完了画面が出続けるので外しておく。
 *
 * @return string
 */
function lw_member_register_form_action() {

	$url = is_singular() ? get_permalink( get_queried_object_id() ) : '';

	if ( ! $url ) {
		$url = lw_member_register_page_url();
	}
	if ( ! $url ) {
		$url = home_url( '/' );
	}

	return remove_query_arg( 'lw_reg', $url );
}

/**
 * 入力欄に紐づくエラーコード（これ以外は「全般エラー」として上にまとめて出す）
 *
 * @return string[]
 */
function lw_member_register_field_codes() {
	return [ 'email', 'name', 'login', 'consent', 'code', 'password' ];
}

/**
 * 入力欄ごとのエラー文
 *
 * @param string $code lw_member_register_field_codes() のいずれか
 * @return string 無ければ空文字
 */
function lw_member_register_field_error( $code ) {

	$state  = lw_member_register_state();
	$errors = $state['errors'];

	if ( ! is_wp_error( $errors ) ) {
		return '';
	}

	$messages = $errors->get_error_messages( $code );

	return $messages ? (string) $messages[0] : '';
}

/**
 * 入力欄に紐づかないエラー文（nonce切れ・回数制限・reCAPTCHA など）
 *
 * @return string[]
 */
function lw_member_register_general_errors() {

	$state  = lw_member_register_state();
	$errors = $state['errors'];

	if ( ! is_wp_error( $errors ) ) {
		return [];
	}

	$field_codes = lw_member_register_field_codes();
	$messages    = [];

	foreach ( $errors->get_error_codes() as $code ) {
		if ( in_array( $code, $field_codes, true ) ) {
			continue;
		}
		foreach ( $errors->get_error_messages( $code ) as $message ) {
			$messages[] = (string) $message;
		}
	}

	return $messages;
}

/**
 * 入力し直しのときに戻す値
 *
 * @param string $key 'email' / 'name' / 'login'
 * @return string
 */
function lw_member_register_old_value( $key ) {

	$state = lw_member_register_state();

	return isset( $state['values'][ $key ] ) ? (string) $state['values'][ $key ] : '';
}
