<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * AI生成機能のアクセス制御
 *
 * 【方針】（Ryuichi・2026-07-25）
 *   ・ページ生成などの AI 生成機能は「プレミアム契約中」または「14日試用中」だけ。
 *     Gemini は従量課金で、キーはサイトオーナー自身のものなので、
 *     無料プランで動いてしまうと想定外の課金が発生する。
 *   ・マニュアルのAIチャット（質問）は無料でも使える。あちらは別モジュール
 *     （functions/lw_ai_chat）でこのファイルの対象外。
 *
 * 🚨 従来はプレミアム判定が JavaScript だけだった（ボタンをグレーにして
 *    「プレミアムプラン限定」バッジを出すだけ）。REST エンドポイントは素通しで、
 *      ① 無料プランでも開発者ツールから直接叩けば生成できた
 *      ② プレミアムを解約しても APIキーは option に残るため生成が動き続けた
 *    ため、サーバ側で必ず確認する。
 *
 * 🚨 エンドポイントは「課金が発生するもの（Geminiを呼ぶ）」と
 *    「データ操作だけのもの」に分けて扱う。解約後も過去のデータ（保存した構成案・
 *    カスタムプロンプト・セッション）は閲覧・削除できる必要があるため、
 *    データ操作系は契約状態で止めない。
 *----------------------------------------------------------------*/

/**
 * AI生成を許可してよい契約状態か。
 *
 * LW_HAS_SUBSCRIPTION は有料サブスク／sub_pre_set／**14日試用**のいずれかが
 * アクティブなら true（lw_template_management/lw_template_functions.php:101-131）。
 * したがってこの判定でも「14日間の無料お試し」は従来どおり生成できる。
 *
 * ⚠ 判定元はローカルDBのアクティベート記録なので、通信障害では false にならない。
 *   ただしアクティベート記録が消えた／やり直し中は false になり得るため、
 *   フィルタで一時的に上書きできる逃げ道を用意している。
 *
 * @return bool
 */
function lw_ai_system_has_subscription() {

	$has = defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true;

	return (bool) apply_filters( 'lw_ai_system_has_subscription', $has );
}

/**
 * 1ユーザー・1日あたりの AI 呼び出し回数のカウンタキー。
 *
 * 日付は current_time()＝サイトのタイムゾーン基準。gmdate() にすると
 * 「日付が変わるとリセット」という案内と実際のリセット時刻がずれる
 * （日本時間なら朝9時リセットになってしまう）。
 *
 * @param int $user_id
 * @return string
 */
function lw_ai_system_call_quota_key( $user_id ) {

	return 'lw_ai_calls_' . current_time( 'Ymd' ) . '_' . (int) $user_id;
}

/**
 * 1ユーザー・1日あたりの AI 呼び出し回数の上限を判定する（読み取りのみ）。
 *
 * ページ生成そのものには別に「1日3回（無料）/15回（プレミアム）」のセッション上限が
 * ある（LW_AI_Session_Manager::check_daily_limit）。こちらは言い換え・誤字チェック・
 * マーカー付けのような軽い操作も含めた全体の歯止めで、
 * **サイト内の寄稿者・投稿者がオーナーの Gemini 課金を使い切るのを防ぐ**のが目的。
 *
 * 管理者（manage_options）は対象外。自分のAPIキーの使い方はオーナーの裁量。
 *
 * ⚠ 数えているのは「リクエスト数」で、Gemini の呼び出し回数そのものではない。
 *   全自動のページ生成は1回で 2N+2 本前後のリクエストを使う（Nはセクション数）ので、
 *   セッション上限 15回/日 を使い切れる余裕を持たせた既定値にしてある。
 *   1リクエスト内の画像生成枚数には別途上限が無い（issue-log に別案件として記録）。
 *
 * ⚠ 既定値を変えるフィルタで 0 以下を返すと「禁止」ではなく「無制限」になる。
 *   AI生成そのものを止めたい場合は lw_ai_system_has_subscription フィルタで false を返す。
 *
 * @param int $user_id 省略時は現在のユーザー
 * @return array { allowed: bool, used: int, limit: int }
 */
function lw_ai_system_check_call_quota( $user_id = 0 ) {

	if ( ! $user_id ) {
		$user_id = get_current_user_id();
	}

	$limit = apply_filters( 'lw_ai_system_daily_call_limit', 1000, $user_id );
	$limit = is_numeric( $limit ) ? (int) $limit : 1000; // フィルタが変な値を返しても壊れないように

	if ( $limit <= 0 || user_can( $user_id, 'manage_options' ) ) {
		return array( 'allowed' => true, 'used' => 0, 'limit' => -1 );
	}

	$used = (int) get_transient( lw_ai_system_call_quota_key( $user_id ) );

	return array(
		'allowed' => $used < $limit,
		'used'    => $used,
		'limit'   => $limit,
	);
}

/**
 * AI 呼び出しを1回として数える。
 *
 * ⚠ 加算は概算。get→set の間に排他が無いので、同時リクエストでは取りこぼす
 *   （上限が少し緩くなる方向）。上限を厳しくする方向に見直すときは
 *   wp_cache_incr 等の原子的な手段に置き換えること。
 *
 * @param int $user_id 省略時は現在のユーザー
 * @return void
 */
function lw_ai_system_count_call( $user_id = 0 ) {

	if ( ! $user_id ) {
		$user_id = get_current_user_id();
	}
	if ( user_can( $user_id, 'manage_options' ) ) {
		return;
	}

	$key = lw_ai_system_call_quota_key( $user_id );
	set_transient( $key, ( (int) get_transient( $key ) ) + 1, DAY_IN_SECONDS );
}

/**
 * データ操作系エンドポイントの権限（従来どおり）。
 *
 * 保存済みの構成案・カスタムプロンプト・セッションの参照や削除。
 * Gemini を呼ばない＝課金が発生しないので、契約状態では止めない。
 *
 * @return bool
 */
function lw_ai_system_can_manage_data() {

	return current_user_can( 'edit_posts' );
}

/**
 * 生成系（Gemini を呼ぶ＝課金が発生する）エンドポイントの権限。
 *
 * 権限 → 契約状態 → 回数上限 の順に確認する。
 * WP_Error を返すと、そのステータスとメッセージがそのままレスポンスになるため、
 * 「なぜ使えないのか」を利用者に伝えられる（false だと汎用の 401/403 になる）。
 *
 * 🚨 この関数に副作用を持たせてはいけない（判定だけにすること）。
 *    WordPress は permission_callback を **1リクエストで2回** 呼ぶ。
 *      ① class-wp-rest-server.php:1259-1260（コールバック実行前の権限確認）
 *      ② wp-includes/rest-api.php:875-909 の rest_send_allow_header
 *         （同:253 で rest_post_dispatch に登録済み。Allow ヘッダを組み立てるために再実行する）
 *    さらに必須パラメータ不足で 400 になるリクエストでは ① が飛ばされ ② だけが走る。
 *    そのため回数の加算はここではなく rest_dispatch_request（1回だけ・実行直前）で行う。
 *
 * ★新しく生成系エンドポイントを追加するときは、必ずこの関数を
 *   permission_callback に指定すること。指定を忘れると無料プランで課金が発生する。
 *   回数の加算もこの指定を目印に自動で行われる。
 *
 * @return true|false|WP_Error
 */
function lw_ai_system_can_generate() {

	if ( ! current_user_can( 'edit_posts' ) ) {
		return false; // 未ログイン・権限なしは WP 標準の応答に任せる
	}

	if ( ! lw_ai_system_has_subscription() ) {
		return new WP_Error(
			'lw_ai_premium_required',
			'AI生成機能はプレミアムプラン限定です。ご契約中の場合は、管理画面の「Lwデータ反映処理」から再度アクティベートしてください。',
			array( 'status' => 403 )
		);
	}

	$quota = lw_ai_system_check_call_quota();
	if ( ! $quota['allowed'] ) {
		return new WP_Error(
			'lw_ai_quota_exceeded',
			'本日のAI利用回数の上限（' . $quota['limit'] . '回）に達しました。日付が変わるとリセットされます。',
			array( 'status' => 429 )
		);
	}

	return true;
}

/**
 * 生成系エンドポイントの実行を1回として数える。
 *
 * rest_dispatch_request は「権限確認を通過し、これからコールバックを実行する」直前に
 * **1リクエストにつき1回だけ** 走る（class-wp-rest-server.php:1287）。
 * permission_callback は2回呼ばれるうえ 400 応答でも走るため、加算はこちらで行う。
 *
 * 目印は permission_callback が lw_ai_system_can_generate であること。
 * 新しい生成系エンドポイントを足しても、その指定さえすれば自動で数えられる。
 *
 * @param mixed           $dispatch_result そのまま返す（null を返すと通常どおりコールバックが動く）
 * @param WP_REST_Request $request
 * @param string          $route
 * @param array           $handler
 * @return mixed
 */
function lw_ai_system_count_dispatched_call( $dispatch_result, $request, $route, $handler ) {

	if ( isset( $handler['permission_callback'] )
		&& 'lw_ai_system_can_generate' === $handler['permission_callback'] ) {
		lw_ai_system_count_call();
	}

	return $dispatch_result;
}
add_filter( 'rest_dispatch_request', 'lw_ai_system_count_dispatched_call', 10, 4 );
