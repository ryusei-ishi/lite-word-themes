<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * AI画像生成の枚数上限（Gemini/Imagen 課金の歯止め）
 *
 * 【背景】（2026-08-07）
 *   access-control.php の「1日1000リクエスト」は **リクエスト数** の上限であって
 *   枚数の上限ではない。画像は1枚 $0.04（Imagen 4）かかるうえ、1リクエストで
 *   生成する枚数は「AIが返したブロックツリーに画像スロットが何個あったか」で決まり、
 *   どこにも上限が無かった。1リクエスト10枚なら 1000リクエスト＝10,000枚＝$400/日 が通る。
 *   APIキーはサイトオーナー自身のものなので、費用は全額オーナー負担になる。
 *
 * 🚨 生成を叩けるのは edit_posts ＋契約中。つまり **寄稿者がオーナーのキーを焼ける**。
 *
 * 【方針】（Ryuichi・2026-08-07）2層でかける。
 *   ① 1リクエストあたりの枚数上限（既定30枚）… 管理者にも適用する。
 *      これは権限の話ではなく「暴走・不具合の歯止め」なので、オーナー自身も守る。
 *   ② 1日あたりの枚数上限（既定300枚 ≒ $12/日）… 管理者は免除。
 *      access-control.php の回数上限と同じ扱い（自分のキーの使い方はオーナーの裁量）。
 *
 * ⚠ 上限を超えた分は **エラーにしない**。生成せずに元のプロンプト文字列を残す＝
 *   既存の「生成に失敗した1枚」と全く同じ状態にする。ページ生成そのものは成功させ、
 *   足りない画像はあとから個別に生成し直せる。
 *
 * 回数（リクエスト数）の上限 → access-control.php
 *----------------------------------------------------------------*/

/**
 * 1リクエストで生成してよい画像の枚数。
 *
 * ⚠ 0以下を返すと「禁止」ではなく **無制限** になる（access-control.php と同じ約束）。
 *   画像生成そのものを止めたい場合は lw_ai_system_has_subscription フィルタで false を返す。
 *
 * @return int
 */
function lw_ai_system_max_images_per_request() {

	$limit = apply_filters( 'lw_ai_system_max_images_per_request', 30 );

	return is_numeric( $limit ) ? (int) $limit : 30; // フィルタが変な値を返しても壊れないように
}

/**
 * 1ユーザー・1日あたりに生成してよい画像の枚数。
 *
 * ⚠ 0以下を返すと無制限（上記と同じ約束）。
 *
 * @return int
 */
function lw_ai_system_daily_image_limit() {

	$limit = apply_filters( 'lw_ai_system_daily_image_limit', 300 );

	return is_numeric( $limit ) ? (int) $limit : 300;
}

/**
 * 1ユーザー・1日あたりの生成枚数カウンタのキー。
 *
 * 日付は current_time()＝サイトのタイムゾーン基準。gmdate() にすると
 * 「日付が変わるとリセット」という案内と実際のリセット時刻がずれる。
 * （access-control.php の lw_ai_system_call_quota_key と同じ理由・同じ作り）
 *
 * @param int $user_id
 * @return string
 */
function lw_ai_system_image_quota_key( $user_id ) {

	return 'lw_ai_images_' . current_time( 'Ymd' ) . '_' . (int) $user_id;
}

/**
 * これから生成する画像の枠を確保し、実際に生成してよい枚数を返す。
 *
 * 「確認してから数える」ではなく **確保（予約）** にしてある。生成の成否を待って
 * から数えると、失敗が続いたときに何度でも再挑戦できてしまい歯止めにならない
 * （Gemini 側は試行そのものに課金され得る）。mail_form の
 * lw_mail_form_reserve_upload_bytes と同じ考え方。
 *
 * ⚠ 加算は概算。get→set の間に排他が無いので同時リクエストでは取りこぼす
 *   （上限が少し緩くなる方向）。厳密にするなら wp_cache_incr 等に置き換えること。
 *
 * @param int $wanted  生成したい枚数
 * @param int $user_id 省略時は現在のユーザー
 * @return int 実際に生成してよい枚数（0 なら1枚も生成しない）
 */
function lw_ai_system_reserve_image_slots( $wanted, $user_id = 0 ) {

	static $used_this_request = 0;

	$wanted = (int) $wanted;
	if ( $wanted <= 0 ) {
		return 0;
	}
	if ( ! $user_id ) {
		$user_id = get_current_user_id();
	}

	$granted = $wanted;

	/* ① 1リクエスト上限（管理者にも適用） */
	$per_request = lw_ai_system_max_images_per_request();
	if ( $per_request > 0 ) {
		$granted = min( $granted, max( 0, $per_request - $used_this_request ) );
	}

	/* ② 1日上限（管理者は免除） */
	$daily = lw_ai_system_daily_image_limit();
	if ( $granted > 0 && $daily > 0 && ! user_can( $user_id, 'manage_options' ) ) {
		$key        = lw_ai_system_image_quota_key( $user_id );
		$used_today = (int) get_transient( $key );

		$granted = min( $granted, max( 0, $daily - $used_today ) );
		if ( $granted > 0 ) {
			set_transient( $key, $used_today + $granted, DAY_IN_SECONDS );
		}
	}

	$used_this_request += $granted;

	return $granted;
}

/**
 * 画像枚数の残量（画面表示・デバッグ用。副作用なし）。
 *
 * @param int $user_id 省略時は現在のユーザー
 * @return array { used: int, limit: int, remaining: int, per_request: int }
 *               limit = -1 は無制限（管理者・またはフィルタで解除）
 */
function lw_ai_system_image_quota_status( $user_id = 0 ) {

	if ( ! $user_id ) {
		$user_id = get_current_user_id();
	}

	$per_request = lw_ai_system_max_images_per_request();
	$daily       = lw_ai_system_daily_image_limit();

	if ( $daily <= 0 || user_can( $user_id, 'manage_options' ) ) {
		return array(
			'used'        => 0,
			'limit'       => -1,
			'remaining'   => -1,
			'per_request' => $per_request,
		);
	}

	$used = (int) get_transient( lw_ai_system_image_quota_key( $user_id ) );

	return array(
		'used'        => $used,
		'limit'       => $daily,
		'remaining'   => max( 0, $daily - $used ),
		'per_request' => $per_request,
	);
}
