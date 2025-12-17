<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定表示機能（フロント）
 * =============================================================== */

/**
 * フロント側：アクセス制御
 */
add_action( 'template_redirect', 'lw_protect_view_by_role' );
function lw_protect_view_by_role() {
    /* ---------- 適用対象を絞る ---------- */
    if ( ! is_singular( [ 'post', 'page' ] ) ) {
        return;
    }

    $post_id = get_queried_object_id();
    
    /* ---------- キャッシュから取得(DBクエリ削減) ---------- */
    $cache_key = 'lw_allowed_roles_' . $post_id;
    $allowed_roles = wp_cache_get($cache_key);
    
    if ($allowed_roles === false) {
        $allowed_roles = array_values( array_filter(
            (array) get_post_meta( $post_id, '_lw_allowed_roles', true ),
            'strlen'
        ) );
        wp_cache_set($cache_key, $allowed_roles, '', 3600); // 1時間キャッシュ
    }

    /* ---------- 無選択なら全員閲覧可(早期リターン) ---------- */
    if ( empty( $allowed_roles ) ) {
        return;
    }

    /* ---------- ここから権限チェック(必要な時だけ) ---------- */
    
    /* ---------- 管理者は常に閲覧可 ---------- */
    if ( current_user_can( 'administrator' ) ) {
        return;
    }

    /* ---------- 未ログイン → リダイレクト ---------- */
    if ( ! is_user_logged_in() ) {
        wp_redirect( home_url() );
        exit;
    }

    /* ---------- ロールが一致しなければリダイレクト ---------- */
    $user = wp_get_current_user();
    if ( ! array_intersect( $user->roles, $allowed_roles ) ) {
        wp_redirect( home_url() );
        exit;
    }
}