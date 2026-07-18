<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — REST APIコールバック（同意・モード切替）
 */

/**
 * 同意状態を保存
 */
function lw_ai_chat_save_consent($request) {
    $user_id = get_current_user_id();

    if ((bool) $request->get_param('agreed')) {
        update_user_meta($user_id, 'lw_ai_chat_consent', '1');
        update_user_meta($user_id, 'lw_ai_chat_consent_at', current_time('mysql'));
    } else {
        delete_user_meta($user_id, 'lw_ai_chat_consent');
        delete_user_meta($user_id, 'lw_ai_chat_consent_at');
    }

    return ['success' => true];
}

/**
 * APIモード切り替え（公式サーバー ↔ 自前キー）
 * ユーザーごとに保存（マルチユーザー対応）
 */
function lw_ai_chat_set_mode($request) {
    $user_id = get_current_user_id();
    $mode = sanitize_text_field($request->get_param('mode') ?: '');

    if ($mode === 'own') {
        if (!lw_ai_chat_is_premium()) {
            return new WP_Error('not_premium', 'プレミアムプランが必要です', ['status' => 403]);
        }
        if (!lw_ai_chat_has_own_key()) {
            return new WP_Error('no_key', 'AI Studioの設定でAPIキーを登録してください', ['status' => 400]);
        }
        update_user_meta($user_id, 'lw_ai_chat_use_own_key', '1');
    } else {
        update_user_meta($user_id, 'lw_ai_chat_use_own_key', '0');
    }

    return ['success' => true, 'mode' => $mode === 'own' ? 'own' : 'server'];
}

/**
 * AIモデル切り替え（flash / pro）
 * ユーザーごとに保存
 */
function lw_ai_chat_set_model($request) {
    $user_id = get_current_user_id();
    $model = sanitize_text_field($request->get_param('model') ?: 'flash');

    if (!in_array($model, ['flash', 'pro'])) {
        return new WP_Error('invalid_model', '無効なモデルです', ['status' => 400]);
    }

    update_user_meta($user_id, 'lw_ai_chat_ai_model', $model);
    return ['success' => true, 'model' => $model];
}
