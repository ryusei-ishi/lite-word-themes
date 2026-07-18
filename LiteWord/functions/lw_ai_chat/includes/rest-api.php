<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — REST API ルート登録
 */

add_action('rest_api_init', 'lw_ai_chat_register_routes');
function lw_ai_chat_register_routes() {
    $ns = 'liteword/v1';

    // チャット送信（プロキシ）
    register_rest_route($ns, '/ai-chat', [
        'methods'             => 'POST',
        'callback'            => 'lw_ai_chat_proxy',
        'permission_callback' => function() { return current_user_can('edit_posts'); },
    ]);

    // チャット履歴取得
    register_rest_route($ns, '/ai-chat-history', [
        'methods'             => 'GET',
        'callback'            => 'lw_ai_chat_get_history',
        'permission_callback' => function() { return current_user_can('edit_posts'); },
    ]);

    // 同意状態の保存
    register_rest_route($ns, '/ai-chat-consent', [
        'methods'             => 'POST',
        'callback'            => 'lw_ai_chat_save_consent',
        'permission_callback' => function() { return is_user_logged_in(); },
    ]);

    // サイト設定取得（プライベートAIモード用）
    register_rest_route($ns, '/site-settings', [
        'methods'             => 'GET',
        'callback'            => 'lw_ai_chat_get_site_settings',
        'permission_callback' => function() { return current_user_can('manage_options'); },
    ]);

    // サイト設定変更（Phase 2）
    register_rest_route($ns, '/site-settings', [
        'methods'             => 'POST',
        'callback'            => 'lw_ai_chat_update_site_settings',
        'permission_callback' => function() { return current_user_can('manage_options'); },
    ]);

    // AIモデル切り替え
    register_rest_route($ns, '/ai-chat-model', [
        'methods'             => 'POST',
        'callback'            => 'lw_ai_chat_set_model',
        'permission_callback' => function() { return current_user_can('manage_options'); },
    ]);

    // APIモード切り替え
    register_rest_route($ns, '/ai-chat-mode', [
        'methods'             => 'POST',
        'callback'            => 'lw_ai_chat_set_mode',
        'permission_callback' => function() { return current_user_can('manage_options'); },
    ]);
}
