<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — ヘルパー関数
 */

/**
 * ext-chat API のベースURL（ローカル/本番自動切り替え）
 */
function lw_ai_chat_api_url() {
    if (defined('WP_DEBUG') && WP_DEBUG && strpos(home_url(), 'localhost') !== false) {
        return 'http://localhost/SUPPORT_LOUNGE/LiteWord/wp-json/lw-manual/v1/ext-chat';
    }
    return 'https://lite-word.com/wp-json/lw-manual/v1/ext-chat';
}

/**
 * 外部への wp_remote_* で TLS 証明書を検証するか。
 *
 * 🔒 原則 true。検証を外すと MITM で
 *   ・lite-word.com から取得したマニュアルHTMLを差し替えられ、wp-admin 上で管理者権限のXSSになる
 *   ・Gemini API へのリクエストに載る API キーを傍受される
 * ローカル開発（localhost）だけ例外にしている。以前は WP_DEBUG だけで判定していたため、
 * 本番で WP_DEBUG を有効にしているサイトでも検証が外れていた。
 *
 * @return bool
 */
function lw_ai_chat_sslverify() {

    if ( defined( 'WP_DEBUG' ) && WP_DEBUG && strpos( home_url(), 'localhost' ) !== false ) {
        return false;
    }

    return true;
}

/**
 * サイトキーを取得（なければ生成して保存）
 */
function lw_ai_chat_get_site_key() {
    $key = get_option('lw_ai_chat_site_key', '');
    if (empty($key)) {
        $key = wp_generate_password(40, false);
        update_option('lw_ai_chat_site_key', $key, false);
    }
    return $key;
}

/**
 * プレミアム判定
 */
function lw_ai_chat_is_premium() {
    return defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true;
}

/**
 * 自前APIキーの有無を判定
 */
function lw_ai_chat_has_own_key() {
    return lw_ai_chat_is_premium()
        && class_exists('LW_AI_Generator_Admin_Settings')
        && !empty(LW_AI_Generator_Admin_Settings::get_api_key());
}

/**
 * 選択中のGeminiモデル名を返す（ユーザーごと）
 */
function lw_ai_chat_get_model_name() {
    $user_id = get_current_user_id();
    $model = $user_id ? get_user_meta($user_id, 'lw_ai_chat_ai_model', true) : '';
    if (empty($model)) $model = 'flash';
    $models = [
        'flash' => 'gemini-2.5-flash',
        'pro'   => 'gemini-2.5-pro-preview-05-06',
    ];
    return $models[$model] ?? 'gemini-2.5-flash';
}

/**
 * 自前キーモードが有効か（ユーザーごと + プレミアム + キー設定済み）
 */
function lw_ai_chat_use_own_key() {
    $user_id = get_current_user_id();
    if (!$user_id) return false;

    $use_own = get_user_meta($user_id, 'lw_ai_chat_use_own_key', true);
    if ($use_own !== '1') return false;

    if (!lw_ai_chat_has_own_key()) {
        update_user_meta($user_id, 'lw_ai_chat_use_own_key', '0');
        return false;
    }
    return true;
}
