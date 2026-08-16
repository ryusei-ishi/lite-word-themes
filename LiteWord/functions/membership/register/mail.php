<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：認証番号のメール
 *
 * 文面はフィルタで差し替えられるようにしてある。
 *   lw_member_register_code_mail_subject … 件名
 *   lw_member_register_code_mail_body    … 本文
 *
 * ⚠️ このメールが届かないと誰も登録できない。
 *    サーバーからメールが出ない環境では、SMTPプラグイン等の設定が要る。
 * =============================================================== */

/**
 * サイト名（メールの差出人表記に使う）
 *
 * @return string
 */
function lw_member_register_site_name() {
	return wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
}

/**
 * 認証番号のメールを送る
 *
 * @param string $email 宛先
 * @param string $name  お名前（空でもよい）
 * @param string $code  6桁の番号
 * @return bool 送れたか
 */
function lw_member_register_send_code( $email, $name, $code ) {

	$site    = lw_member_register_site_name();
	$minutes = (int) round( LW_MEMBER_REGISTER_PENDING_TTL / MINUTE_IN_SECONDS );

	$subject = sprintf( '【%s】会員登録の認証番号', $site );

	$greeting = $name !== '' ? sprintf( "%s 様\n\n", $name ) : '';

	$body = $greeting
		. sprintf( "%s の会員登録ありがとうございます。\n\n", $site )
		. "登録画面に、次の認証番号を入力してください。\n\n"
		. sprintf( "    認証番号： %s\n\n", $code )
		. sprintf( "この番号は %d 分で使えなくなります。\n", $minutes )
		. "番号を続けて間違えた場合も、最初からやり直しになります。\n\n"
		. "──────────\n"
		. "このメールに心当たりがない場合は、どなたかがメールアドレスを\n"
		. "間違えて入力した可能性があります。番号を入力しなければ\n"
		. "登録されることはありませんので、そのまま破棄してください。\n"
		. "──────────\n\n"
		. sprintf( "%s\n%s\n", $site, home_url( '/' ) );

	/**
	 * 認証番号メールの件名
	 *
	 * @param string $subject
	 * @param string $email
	 */
	$subject = apply_filters( 'lw_member_register_code_mail_subject', $subject, $email );

	/**
	 * 認証番号メールの本文
	 *
	 * @param string $body
	 * @param string $email
	 * @param string $code
	 */
	$body = apply_filters( 'lw_member_register_code_mail_body', $body, $email, $code );

	return (bool) wp_mail( $email, $subject, $body );
}
