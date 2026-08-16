<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：いたずら送信への備え
 *
 * 「誰でも登録できる」入口はボットに必ず見つかる。ここで3段構えにする。
 *   ① ハニーポット  … 人には見えない欄。埋まっていたら捨てる
 *   ② 送信の間隔と回数 … 同じ相手からの連投を止める
 *   ③ reCAPTCHA v3   … メールフォームの設定を使い回す（任意・既定OFF／recaptcha.php）
 *
 * ⚠️ ③ はメールフォーム拡張がONのときだけ使える。
 *    キーの入力画面が functions/mail_form/form_recaptcha_set.php にあるため。
 *    OFFのサイトでは ①② だけで動く（止めない）。
 * =============================================================== */

/* ---------------------------------------------------------------
 * ① ハニーポット
 * ------------------------------------------------------------- */

/**
 * ハニーポットの項目名
 *
 * ボットが埋めたくなる名前にしておく（本物の入力欄には使わない名前）。
 *
 * @return string
 */
function lw_member_register_honeypot_name() {
	return 'lw_reg_website';
}

/**
 * ハニーポットが埋まっているか
 *
 * @return bool 埋まっていたら true（＝ボット）
 */
function lw_member_register_honeypot_filled() {

	$name = lw_member_register_honeypot_name();

	return isset( $_POST[ $name ] ) && trim( (string) wp_unslash( $_POST[ $name ] ) ) !== '';
}

/* ---------------------------------------------------------------
 * ② 送信の間隔と回数
 * ------------------------------------------------------------- */

/**
 * 送信元のIPアドレス
 *
 * 🚨 X-Forwarded-For は送信側で自由に名乗れるので既定では見ない。
 *    リバースプロキシ配下のサイトはフィルタで差し替えること。
 *
 * @return string 取れなければ空文字
 */
function lw_member_register_client_ip() {

	$ip = isset( $_SERVER['REMOTE_ADDR'] ) && is_string( $_SERVER['REMOTE_ADDR'] )
		? trim( $_SERVER['REMOTE_ADDR'] )
		: '';

	$ip = apply_filters( 'lw_member_register_client_ip', $ip );

	if ( ! is_string( $ip ) || ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
		return '';
	}

	return $ip;
}

/**
 * transient のキー
 *
 * @param string $kind 'wait'（間隔）か 'count'（回数）
 * @return string IPが取れなければ空文字
 */
function lw_member_register_rate_key( $kind ) {

	$ip = lw_member_register_client_ip();
	if ( $ip === '' ) {
		return '';
	}

	return 'lw_reg_' . $kind . '_' . md5( $ip );
}

/**
 * いま送信を受け付けてよいか
 *
 * ⚠️ transient は読んで書くだけで原子性が無いので、同時送信では
 *    上限を少し超え得る。ここは「素朴なボットと事故的な連投を止める」
 *    層と割り切っている（厳密な制限が要るならサーバー側で行うこと）。
 *
 * @return true|WP_Error
 */
function lw_member_register_rate_ok() {

	$wait_key = lw_member_register_rate_key( 'wait' );
	if ( $wait_key === '' ) {
		return true;   // IPが取れないときは止めない
	}

	if ( get_transient( $wait_key ) ) {
		return new WP_Error(
			'lw_register_too_fast',
			'送信の間隔が短すぎます。1分ほどおいてからもう一度お試しください。'
		);
	}

	$count_key = lw_member_register_rate_key( 'count' );
	$limit     = (int) apply_filters( 'lw_member_register_hourly_limit', 5 );

	if ( $limit > 0 && (int) get_transient( $count_key ) >= $limit ) {
		return new WP_Error(
			'lw_register_too_many',
			'送信回数が上限に達しました。しばらく時間をおいてからお試しください。'
		);
	}

	return true;
}

/**
 * 1回分を数える（受け付けた時点で呼ぶ。成功・失敗どちらでも数える）
 *
 * 失敗も数えるのは、当てずっぽうで何度も投げてくる相手を止めるため。
 *
 * @return void
 */
function lw_member_register_count_submission() {

	$wait_key = lw_member_register_rate_key( 'wait' );
	if ( $wait_key === '' ) {
		return;
	}

	/* 🚨 set_transient() の第3引数 0 は「すぐ消える」ではなく「期限なし」。
	 *    フィルタで 0 以下にされたときに書き込むと、その相手が永久に
	 *    登録できなくなる。0 以下は「間隔の制限をしない」と解釈する。 */
	$wait = (int) apply_filters( 'lw_member_register_wait_seconds', 60 );
	if ( $wait > 0 ) {
		set_transient( $wait_key, 1, $wait );
	}

	$count_key = lw_member_register_rate_key( 'count' );
	set_transient( $count_key, (int) get_transient( $count_key ) + 1, HOUR_IN_SECONDS );
}
