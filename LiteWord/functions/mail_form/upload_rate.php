<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * お問い合わせフォーム：添付ファイルの流量制限
 *
 * 🔒 匿名（wp_ajax_nopriv）で叩ける送信口なので、添付ファイルの受理には
 *    回数と累積バイト数の上限を掛ける。ただし「問い合わせ自体を止めない」ことが
 *    最優先で、上限に当たったときも送信は成功させ、添付だけを落とす（soft-drop）。
 *
 * 🚨 ここで掛ける制限は多層防御の最外層であって主防御ではない。
 *    IP は共有（企業NAT・CGNAT・リバースプロキシ）でも回転（IPv6・プロキシ）でも変わるため、
 *    実効的な防御は upload_guard.php / upload_types.php の
 *    「定義済み画像欄のみ・実データ検証・サイズ／件数上限」。
 *    したがって閾値は「正当な訪問者を弾かない」側に振り、
 *    ディスク増加の最終的な歯止めは "サイト全体の日次バイト上限" に置いている。
 *
 * 制限の3層（すべて soft-drop）
 *   ① IP別の連続回数     … lw_mail_form_upload_rate_limit（既定 30回 / 10分）
 *   ② IP別の日次バイト   … lw_mail_form_upload_daily_bytes（既定 200MB / 日）
 *   ③ サイト全体の日次   … lw_mail_form_upload_daily_bytes_site（既定 500MB / 日）
 *                          ★IPが取れない・共有IPに潰れている環境でも効く唯一の層
 *----------------------------------------------------------------*/

/**
 * 制限の対象外か（サイト所有者のテスト送信を止めないため）。
 *
 * @return bool
 */
function lw_mail_form_upload_limit_exempt() {

	return function_exists( 'current_user_can' ) && current_user_can( 'manage_options' );
}

/**
 * 制限のキーに使うクライアントIPを返す（取得できなければ空文字）。
 *
 * 🚨 CF-Connecting-IP / X-Forwarded-For などのヘッダを既定で信用してはいけない。
 *    偽装できるヘッダをキーにすると、
 *      ① 攻撃者は自分の制限を無条件に回避できる
 *      ② 他人のIPを名乗ってその枠を使い切り、正当な訪問者の添付を24時間落とせる
 *    という2つの被害が同時に成立する（②の方が悪い）。
 *    Cloudflare 等の配下で訪問者IPを復元したいサイトは
 *    `lw_mail_form_client_ip` フィルタで自分の環境に合わせて差し替える。
 *
 * 🚨 空文字を返したときは①②の制限を掛けない（fail open）。
 *    プライベート／予約レンジが見えている＝内部プロキシで訪問者IPが潰れている状態で、
 *    そのまま制限すると「サイト全体で1つのカウンタ」になり問い合わせが止まるため。
 *    その場合の歯止めは③（サイト全体の日次バイト上限）が受け持つ。
 *
 * @return string 正規化済みIP（IPv6 は /64 に丸める）。判定不能なら ''
 */
function lw_mail_form_client_ip() {

	$ip = ( ! empty( $_SERVER['REMOTE_ADDR'] ) && is_string( $_SERVER['REMOTE_ADDR'] ) )
		? trim( $_SERVER['REMOTE_ADDR'] )
		: '';

	$ip = apply_filters( 'lw_mail_form_client_ip', $ip );

	if ( ! is_string( $ip ) || $ip === '' ) {
		return '';
	}
	if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
		return '';
	}
	if ( ! filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) ) {
		return ''; // プロキシ配下＝訪問者を区別できないので個別制限はしない
	}

	/* IPv6 は /64（一般に1契約）に丸める。/128 のままだと同一利用者が毎回別カウンタになる */
	if ( strpos( $ip, ':' ) !== false && function_exists( 'inet_pton' ) ) {
		$packed = @inet_pton( $ip );
		if ( $packed !== false && strlen( $packed ) === 16 ) {
			return 'v6-' . bin2hex( substr( $packed, 0, 8 ) );
		}
	}

	return $ip;
}

/**
 * IP別の回数カウンタのキー（IPが取れなければ空文字）。
 *
 * ★キーに form_set_no・post_id・User-Agent など攻撃者が自由に変えられる値を含めないこと。
 *   含めると値を変えるだけでカウンタが無限に増えて制限が無意味になる。
 *
 * @return string
 */
function lw_mail_form_upload_rate_key() {

	$ip = lw_mail_form_client_ip();

	return ( $ip === '' ) ? '' : 'lw_mf_up_' . md5( $ip );
}

/**
 * 添付ファイルを含む送信の回数上限を判定する（読み取りのみ・加算しない）。
 *
 * 加算は lw_mail_form_count_upload_submission() で別に行う。
 * 判定と加算を分けているのは、この後に走る reCAPTCHA 検証で落ちるリクエストの分まで
 * カウンタを消費させないため（共有IPでは他人の枠を削ることになる）。
 *
 * @return bool 受理してよければ true
 */
function lw_mail_form_upload_rate_ok() {

	if ( lw_mail_form_upload_limit_exempt() ) {
		return true;
	}
	$key = lw_mail_form_upload_rate_key();
	if ( $key === '' ) {
		return true; // fail open
	}
	$limit = (int) apply_filters( 'lw_mail_form_upload_rate_limit', 30 );
	if ( $limit <= 0 ) {
		return true; // フィルタで無効化された
	}

	return ( (int) get_transient( $key ) ) < $limit;
}

/**
 * 添付ファイルを含む送信を1回として数える（実際に受理処理へ進むときに呼ぶ）。
 *
 * ⚠ transient は read-modify-write で原子性が無いため、同時送信では上限を数倍超え得る。
 *   ここは「素朴なbot・事故的な連投を止める」ための層と割り切っている。
 *
 * @return void
 */
function lw_mail_form_count_upload_submission() {

	if ( lw_mail_form_upload_limit_exempt() ) {
		return;
	}
	$key = lw_mail_form_upload_rate_key();
	if ( $key === '' ) {
		return;
	}
	$limit = (int) apply_filters( 'lw_mail_form_upload_rate_limit', 30 );
	if ( $limit <= 0 ) {
		return;
	}
	$window = (int) apply_filters( 'lw_mail_form_upload_rate_window', 10 * MINUTE_IN_SECONDS );
	if ( $window <= 0 ) {
		return;
	}

	set_transient( $key, ( (int) get_transient( $key ) ) + 1, $window );
}

/**
 * 日次の累積受理バイト数を予約する（判定と同時に加算する）。
 *
 * ディスク枯渇（M3 の主要な被害）に対する実質的な歯止め。
 * 回数上限だけでは「1送信ごとに上限サイズ×画像欄数」が延々と積めるため必要。
 *
 * ★キーに日付（UTC）を含めているので、送信が続いても窓が延び続けない（日次で必ずリセット）。
 * ★実際に保存する直前に呼ぶこと。形式で拒否されるファイルの分を予算から引いてはいけない。
 *
 * @param int $bytes これから受理しようとしているバイト数
 * @return bool 受理してよければ true
 */
function lw_mail_form_reserve_upload_bytes( $bytes ) {

	if ( lw_mail_form_upload_limit_exempt() ) {
		return true;
	}

	$bytes = max( 0, (int) $bytes );
	$day   = gmdate( 'Ymd' );

	/* ③ サイト全体の日次上限。IPが取れない／共有IPに潰れている環境でも効く最後の歯止め。 */
	$site_limit = (int) apply_filters( 'lw_mail_form_upload_daily_bytes_site', 500 * 1024 * 1024 );
	$site_key   = 'lw_mf_upday_site_' . $day;
	if ( $site_limit > 0 && ( (int) get_transient( $site_key ) ) >= $site_limit ) {
		return false;
	}

	/* ② IP別の日次上限。1つのIPがサイト全体の予算を食い潰さないようにする。 */
	$ip_limit = (int) apply_filters( 'lw_mail_form_upload_daily_bytes', 200 * 1024 * 1024 );
	$ip       = lw_mail_form_client_ip();
	$ip_key   = ( $ip === '' ) ? '' : 'lw_mf_upday_' . $day . '_' . md5( $ip );
	if ( $ip_limit > 0 && $ip_key !== '' && ( (int) get_transient( $ip_key ) ) >= $ip_limit ) {
		return false;
	}

	if ( $site_limit > 0 ) {
		set_transient( $site_key, ( (int) get_transient( $site_key ) ) + $bytes, DAY_IN_SECONDS );
	}
	if ( $ip_limit > 0 && $ip_key !== '' ) {
		set_transient( $ip_key, ( (int) get_transient( $ip_key ) ) + $bytes, DAY_IN_SECONDS );
	}

	return true;
}
