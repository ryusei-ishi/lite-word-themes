<?php
if (!defined('ABSPATH')) exit;

/**
 * コメント機能の完全無効化
 *
 * カスタマイザーで「投稿下のコメント機能」がOFFの場合に読み込まれる。
 * フロントエンドの表示だけでなく、API経由のコメント投稿も防ぐ。
 */

/**
 * 1. 全投稿のコメント受付を閉じる
 */
add_filter('comments_open', '__return_false', 20, 2);
add_filter('pings_open', '__return_false', 20, 2);

/**
 * 2. 既存コメントを非表示にする
 */
add_filter('comments_array', '__return_empty_array', 10, 2);

/**
 * 3. REST API: コメントエンドポイントを無効化
 */
add_filter('rest_endpoints', 'lw_disable_comments_rest_endpoint');
function lw_disable_comments_rest_endpoint($endpoints) {
    unset($endpoints['/wp/v2/comments']);
    unset($endpoints['/wp/v2/comments/(?P<id>[\\d]+)']);
    return $endpoints;
}

/**
 * 4. XML-RPC: コメント関連メソッドを無効化
 */
add_filter('xmlrpc_methods', 'lw_disable_comments_xmlrpc');
function lw_disable_comments_xmlrpc($methods) {
    unset($methods['wp.newComment']);
    unset($methods['wp.getCommentCount']);
    unset($methods['wp.getComment']);
    unset($methods['wp.getComments']);
    unset($methods['wp.deleteComment']);
    unset($methods['wp.editComment']);
    unset($methods['wp.getCommentStatusList']);
    return $methods;
}

/**
 * 5. 管理画面: コメントメニューを非表示
 */
add_action('admin_menu', 'lw_disable_comments_admin_menu', 999);
function lw_disable_comments_admin_menu() {
    remove_menu_page('edit-comments.php');
}

/**
 * 6. 管理バー: コメントアイコンを非表示
 */
add_action('wp_before_admin_bar_render', 'lw_disable_comments_admin_bar');
function lw_disable_comments_admin_bar() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('comments');
}

/**
 * 7. ダッシュボード: コメントウィジェットを削除
 */
add_action('wp_dashboard_setup', 'lw_disable_comments_dashboard');
function lw_disable_comments_dashboard() {
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
}

/**
 * 8. wp-comments-post.php への直接POSTをブロック
 */
add_action('comment_post', 'lw_block_comment_post', 0);
function lw_block_comment_post() {
    wp_die(
        'コメント機能は無効になっています。',
        'コメント無効',
        ['response' => 403, 'back_link' => true]
    );
}

/**
 * 9. 新規投稿のデフォルトコメントステータスを closed に
 */
add_filter('default_comment_status', '__return_false');
