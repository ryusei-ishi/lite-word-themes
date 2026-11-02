<?php
/**
 * お問い合わせのサンクスメール（自動返信）が、迷惑メールの踏み台にならないようにする（2026-11-02 の点検 T5）。
 *
 * それまでの作り:
 *   送信先のテンプレート（既定 [your_mail]）に訪問者の入力をそのまま入れ、カンマ・セミコロンで区切って全員に送っていた。
 *   件数の上限も回数の制限も無く、reCAPTCHA は既定で無効なので、1回の送信で多くの宛先へ、
 *   お客さんのドメインから「件名・本文に訪問者の文が入ったメール」を出せた。
 *
 * ここでの守り（どれも「送信自体は失敗させない」＝問い合わせは管理者に届く。CLAUDE.md の soft-drop の考え方）:
 *   1. 宛先のテンプレートに入る訪問者の値は「正しいメールアドレス1つ」のときだけ使う（区切り文字・空白・形の違いは空）。
 *      管理者がテンプレートに直接書いた固定の宛先（例 "[your_mail], staff@example.com"）は今までどおり送る
 *   2. 接続元ごとの回数（既定 1時間に5通）と、サイト全体の1日の上限（既定 300通）。超えたらサンクスメールだけ送らない
 *   3. 差出人の名前に改行を入れさせない（ヘッダーの差し込み）。差出人のアドレスが正しくなければ既定に戻す
 *
 * 接続元の取り方・管理者の扱いは upload_rate.php と同じ（偽れるヘッダーは見ない・IP が取れなければ数えない）。
 * 既定値はフィルタで1行変更できる:
 *   lw_mail_form_thanks_rate_limit（0以下で無制限）/ lw_mail_form_thanks_rate_window / lw_mail_form_thanks_daily_site_limit（0以下で無制限）
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * 宛先のテンプレートに入れる訪問者の値を整える。
 *
 * @param mixed $value 訪問者の入力（チェックボックスなどは配列）
 * @return string 正しいメールアドレス1つならそのアドレス、それ以外は ''
 */
function lw_mail_form_thanks_recipient_value( $value ) {
	if ( ! is_scalar( $value ) ) {
		return '';
	}
	$value = trim( (string) $value );
	if ( $value === '' || preg_match( '/[,;\s]/', $value ) ) {
		return '';
	}
	$email = sanitize_email( $value );
	if ( $email === '' || $email !== $value || ! is_email( $email ) ) {
		return '';
	}
	return $email;
}

/**
 * 接続元ごとの回数のキー（IP が取れなければ ''）。
 *
 * @return string
 */
function lw_mail_form_thanks_rate_key() {
	$ip = function_exists( 'lw_mail_form_client_ip' ) ? lw_mail_form_client_ip() : '';
	return ( $ip === '' ) ? '' : 'lw_mf_thx_' . md5( $ip );
}

/**
 * サイト全体の、今日の通数のキー（サイトの時刻で日付を切る）。
 *
 * @return string
 */
function lw_mail_form_thanks_site_key() {
	return 'lw_mf_thx_site_' . wp_date( 'Ymd' );
}

/**
 * この送信でサンクスメールを送ってよいか（読むだけ・数えない）。
 *
 * @return bool
 */
function lw_mail_form_thanks_mail_allowed() {
	// 管理者のテスト送信は止めない（upload_rate.php と同じ）
	if ( function_exists( 'lw_mail_form_upload_limit_exempt' ) && lw_mail_form_upload_limit_exempt() ) {
		return true;
	}

	$site_limit = (int) apply_filters( 'lw_mail_form_thanks_daily_site_limit', 300 );
	if ( $site_limit > 0 && (int) get_transient( lw_mail_form_thanks_site_key() ) >= $site_limit ) {
		return false;
	}

	$key = lw_mail_form_thanks_rate_key();
	if ( $key === '' ) {
		return true; // IP が取れない（プロキシ配下など）＝個別には数えない。サイト全体の上限が歯止め
	}
	$limit = (int) apply_filters( 'lw_mail_form_thanks_rate_limit', 5 );
	if ( $limit <= 0 ) {
		return true;
	}
	return (int) get_transient( $key ) < $limit;
}

/**
 * サンクスメールを送った送信を1回として数える（1回の送信で何パターン送っても1回）。
 *
 * ⚠ transient は原子的でないので、同時の送信では上限を少し超えうる（upload_rate.php と同じ割り切り）。
 *
 * @return void
 */
function lw_mail_form_count_thanks_mail() {
	if ( function_exists( 'lw_mail_form_upload_limit_exempt' ) && lw_mail_form_upload_limit_exempt() ) {
		return;
	}

	$site_key = lw_mail_form_thanks_site_key();
	set_transient( $site_key, (int) get_transient( $site_key ) + 1, DAY_IN_SECONDS + HOUR_IN_SECONDS );

	$key = lw_mail_form_thanks_rate_key();
	if ( $key === '' ) {
		return;
	}
	$window = (int) apply_filters( 'lw_mail_form_thanks_rate_window', HOUR_IN_SECONDS );
	if ( $window <= 0 ) {
		return;
	}
	set_transient( $key, (int) get_transient( $key ) + 1, $window );
}

/**
 * 差出人の名前を整える（改行を消す・長すぎる名前を切る）。
 *
 * @param string $name
 * @return string
 */
function lw_mail_form_clean_header_name( $name ) {
	$name = preg_replace( '/[\r\n\t]+/', ' ', (string) $name );
	$name = trim( str_replace( array( '<', '>', '"' ), '', $name ) );
	if ( function_exists( 'mb_substr' ) ) {
		$name = mb_substr( $name, 0, 100 );
	}
	return $name;
}
