<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — チャット履歴DB操作
 */

/**
 * チャット履歴を取得（REST API）
 */
function lw_ai_chat_get_history($request) {
    global $wpdb;
    $table   = $wpdb->prefix . 'lw_ai_chat_history';
    $user_id = get_current_user_id();

    lw_ai_chat_maybe_create_table();

    $limit = min(intval($request->get_param('limit') ?: 10), 50);
    $rows  = $wpdb->get_results($wpdb->prepare(
        "SELECT question, answer, created_at FROM $table WHERE user_id = %d ORDER BY id DESC LIMIT %d",
        $user_id, $limit
    ), ARRAY_A);

    return ['history' => array_reverse($rows)];
}

/**
 * ローカルDBにチャット履歴を保存（ユーザーごとに最新50件保持）
 */
function lw_ai_chat_save_local($user_id, $question, $answer) {
    global $wpdb;
    $table = $wpdb->prefix . 'lw_ai_chat_history';

    lw_ai_chat_maybe_create_table();

    $wpdb->insert($table, [
        'user_id'    => $user_id,
        'question'   => $question,
        'answer'     => $answer,
        'created_at' => current_time('mysql'),
    ]);

    // 50件超過分を削除
    $count = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table WHERE user_id = %d", $user_id
    ));
    if ($count > 50) {
        $cutoff_id = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE user_id = %d ORDER BY id DESC LIMIT 1 OFFSET 49",
            $user_id
        ));
        if ($cutoff_id) {
            $wpdb->query($wpdb->prepare(
                "DELETE FROM $table WHERE user_id = %d AND id < %d",
                $user_id, $cutoff_id
            ));
        }
    }
}

/**
 * テーブル作成（毎回テーブル存在+カラムを確認）
 */
function lw_ai_chat_maybe_create_table() {
    global $wpdb;
    $table = $wpdb->prefix . 'lw_ai_chat_history';

    static $checked = false;
    if ($checked) return;
    $checked = true;

    $exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table));

    if ($exists) {
        $has_question = $wpdb->get_var("SHOW COLUMNS FROM `{$table}` LIKE 'question'");
        if ($has_question) return;
        $wpdb->query("DROP TABLE IF EXISTS `{$table}`");
    }

    $wpdb->query("CREATE TABLE `{$table}` (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT UNSIGNED NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_user_created (user_id, created_at)
    ) {$wpdb->get_charset_collate()};");
}
