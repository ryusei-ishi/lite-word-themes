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
 * ⚠️ 一覧（アーカイブ・検索・新着ブロック・RSS）からの除外は行っていない。
 *    会員限定の記事もタイトルとサムネイルは一覧に出る（開くとログイン画面）。
 *    REST API から本文が読める穴も未対応。どちらも既知・Ryuichi 判断で見送り。
 *    → doc/specs/membership-restriction.md
 */
add_action( 'template_redirect', 'lw_protect_view_by_role' );
function lw_protect_view_by_role() {

	/* ---------- 適用対象を絞り、適用する閲覧権限を決める ---------- */
	if ( is_singular( [ 'post', 'page' ] ) ) {
		$allowed_roles = lw_get_allowed_roles_for_post( get_queried_object_id() );

	} elseif ( is_category() ) {
		// 適用範囲が「投稿だけ」のカテゴリーは、一覧ページを制限しない
		$allowed_roles = lw_get_effective_term_roles( get_queried_object_id(), 'archive' );

	} else {
		return;
	}

	/* ---------- 判定（無選択なら全員可・管理者は常に可） ---------- */
	$reason = lw_check_view_permission( $allowed_roles );

	if ( $reason !== '' ) {
		lw_membership_block( $reason );
	}
}
