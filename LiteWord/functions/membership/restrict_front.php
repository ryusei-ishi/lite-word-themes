<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定表示機能（フロント）
 * =============================================================== */

/**
 * フロント側：アクセス制御
 *
 * 閲覧できない場合はトップへ飛ばさず、ログインフォーム（または理由）を表示する。
 * 実際の差し替えは functions/membership/login_handler.php の lw_membership_block() が行う。
 *
 * 守る対象は2つ。
 *   ① 投稿・固定ページ … 投稿個別の設定。空なら所属カテゴリーの設定（roles.php）
 *   ② カテゴリー一覧ページ … そのカテゴリーの設定（無ければ親から継ぐ）
 *
 * ⚠️ 一覧（アーカイブ・検索・新着ブロック・RSS）からの除外は行っていない（Ryuichi 判断で見送り）。
 *    会員限定の記事もタイトルとサムネイルは一覧に出る（開くとログイン画面）。
 *    ページ以外の経路（REST API・RSS・メディア一覧）で本文が出ないようにするのは restrict_api.php。
 *    一覧の抜粋・関連記事は、それぞれのテンプレートが lw_membership_can_view_post() で見ている。
 *    → doc/specs/membership-restriction.md
 */
add_action( 'template_redirect', 'lw_protect_view_by_role' );
function lw_protect_view_by_role() {

	/* ---------- 適用対象を絞り、適用する閲覧権限を決める ---------- */
	$allowed_roles = lw_membership_queried_allowed_roles();
	if ( $allowed_roles === false ) {
		return;
	}

	/* ---------- 判定（無選択なら全員可・管理者は常に可） ---------- */
	$reason = lw_check_view_permission( $allowed_roles );

	if ( $reason !== '' ) {
		lw_membership_block( $reason );
	}
}

/**
 * いま開いているページに適用する閲覧権限
 *
 * 会員用のログアウト（functions/membership/logout/box.php）も、ボタンを出すかの判定に使う。
 * 守る側と出す側で「どのページが会員限定か」を食い違わせないため、ここ1か所で決める。
 *
 * 🚨 対象外の目印は false（null にしない）。lw_get_allowed_roles_for_post() はキャッシュの値をそのまま返すので、
 *    壊れたキャッシュが null を返したとき「対象外」と取り違えて素通しにしないため。
 *    配列以外が来たら、切り出す前と同じく lw_check_view_permission()（array 型）で止まる。
 *
 * @return array|false 対象外のページなら false。対象でも制限が無ければ空配列
 */
function lw_membership_queried_allowed_roles() {

	if ( is_singular( [ 'post', 'page' ] ) ) {
		return lw_get_allowed_roles_for_post( get_queried_object_id() );
	}

	if ( is_category() ) {
		// 適用範囲が「投稿だけ」のカテゴリーは、一覧ページを制限しない
		return lw_get_effective_term_roles( get_queried_object_id(), 'archive' );
	}

	return false;
}
