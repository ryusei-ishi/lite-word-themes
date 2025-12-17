<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord 指示・コメント機能
 *
 * 固定ページごとに指示を追加・管理できる機能
 * 専用テーブル: wp_lw_instructions
 * ※プレミアムプラン限定機能
 */

/**
 * プレミアムプラン判定
 */
function lw_is_premium_user() {
    return defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true;
}

/**
 * プレミアムチェック（AJAX用）
 */
function lw_check_premium_ajax() {
    if (!lw_is_premium_user()) {
        wp_send_json_error('この機能はプレミアムプラン限定です');
    }
}

// テーマ有効化時にテーブル作成
add_action('after_switch_theme', 'lw_create_instructions_table');
add_action('admin_init', 'lw_maybe_create_instructions_table');
add_action('admin_init', 'lw_maybe_upgrade_instructions_table');

/**
 * 専用テーブルを作成
 */
function lw_create_instructions_table() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'lw_instructions';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        page_id bigint(20) UNSIGNED NOT NULL,
        parent_id bigint(20) UNSIGNED DEFAULT NULL,
        content text NOT NULL,
        image_path varchar(255) DEFAULT NULL,
        status varchar(20) NOT NULL DEFAULT 'not-started',
        assigned_to bigint(20) UNSIGNED DEFAULT NULL,
        custom_title varchar(255) DEFAULT NULL,
        link_url varchar(500) DEFAULT NULL,
        sort_order int(11) NOT NULL DEFAULT 0,
        created_by bigint(20) UNSIGNED NOT NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY page_id (page_id),
        KEY parent_id (parent_id),
        KEY status (status),
        KEY assigned_to (assigned_to),
        KEY sort_order (sort_order)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    // バージョン保存
    update_option('lw_instructions_db_version', '1.3');
}

/**
 * テーブルアップグレード
 */
function lw_maybe_upgrade_instructions_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';
    $db_version = get_option('lw_instructions_db_version', '1.0');

    // v1.1: assigned_to列追加
    if (version_compare($db_version, '1.1', '<')) {
        $column_exists = $wpdb->get_results("SHOW COLUMNS FROM $table_name LIKE 'assigned_to'");
        if (empty($column_exists)) {
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN assigned_to bigint(20) UNSIGNED DEFAULT NULL AFTER status");
            $wpdb->query("ALTER TABLE $table_name ADD KEY assigned_to (assigned_to)");
        }
        update_option('lw_instructions_db_version', '1.1');
        $db_version = '1.1';
    }

    // v1.2: custom_title列追加
    if (version_compare($db_version, '1.2', '<')) {
        $column_exists = $wpdb->get_results("SHOW COLUMNS FROM $table_name LIKE 'custom_title'");
        if (empty($column_exists)) {
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN custom_title varchar(255) DEFAULT NULL AFTER assigned_to");
        }
        update_option('lw_instructions_db_version', '1.2');
        $db_version = '1.2';
    }

    // v1.3: link_url列追加
    if (version_compare($db_version, '1.3', '<')) {
        $column_exists = $wpdb->get_results("SHOW COLUMNS FROM $table_name LIKE 'link_url'");
        if (empty($column_exists)) {
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN link_url varchar(500) DEFAULT NULL AFTER custom_title");
        }
        update_option('lw_instructions_db_version', '1.3');
    }
}

/**
 * テーブルが存在しなければ作成
 */
function lw_maybe_create_instructions_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';

    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        lw_create_instructions_table();
    }
}

/**
 * 画像保存用ディレクトリを取得・作成
 */
function lw_get_instructions_upload_dir() {
    $upload_dir = wp_upload_dir();
    $instructions_dir = $upload_dir['basedir'] . '/lw-instructions';

    if (!file_exists($instructions_dir)) {
        wp_mkdir_p($instructions_dir);
        // .htaccessで直接アクセス制限（セキュリティ）
        $htaccess = $instructions_dir . '/.htaccess';
        if (!file_exists($htaccess)) {
            file_put_contents($htaccess, "Options -Indexes\n");
        }
    }

    return array(
        'path' => $instructions_dir,
        'url' => $upload_dir['baseurl'] . '/lw-instructions'
    );
}

/**
 * 指示一覧を取得（ページID指定）
 */
function lw_get_instructions($page_id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';

    // 親指示のみ取得（sort_order順）
    $instructions = $wpdb->get_results($wpdb->prepare(
        "SELECT i.*, u.display_name as author_name, a.display_name as assigned_name
         FROM $table_name i
         LEFT JOIN {$wpdb->users} u ON i.created_by = u.ID
         LEFT JOIN {$wpdb->users} a ON i.assigned_to = a.ID
         WHERE i.page_id = %d AND i.parent_id IS NULL
         ORDER BY i.sort_order ASC, i.created_at ASC",
        $page_id
    ), ARRAY_A);

    // 各指示に返信を取得
    foreach ($instructions as &$instruction) {
        $instruction['replies'] = $wpdb->get_results($wpdb->prepare(
            "SELECT i.*, u.display_name as author_name, a.display_name as assigned_name
             FROM $table_name i
             LEFT JOIN {$wpdb->users} u ON i.created_by = u.ID
             LEFT JOIN {$wpdb->users} a ON i.assigned_to = a.ID
             WHERE i.parent_id = %d
             ORDER BY i.created_at ASC",
            $instruction['id']
        ), ARRAY_A);

        // 画像URLを追加
        if ($instruction['image_path']) {
            $upload_dir = lw_get_instructions_upload_dir();
            $instruction['image_url'] = $upload_dir['url'] . '/' . $instruction['image_path'];
        }

        foreach ($instruction['replies'] as &$reply) {
            if ($reply['image_path']) {
                $upload_dir = lw_get_instructions_upload_dir();
                $reply['image_url'] = $upload_dir['url'] . '/' . $reply['image_path'];
            }
        }
    }

    return $instructions;
}

/**
 * ページごとの未完了指示件数を取得（ステータス別）
 */
function lw_get_incomplete_instruction_counts() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';

    // テーブル存在チェック
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        return array();
    }

    // ステータス別にカウント
    $results = $wpdb->get_results(
        "SELECT page_id, status, COUNT(*) as count
         FROM $table_name
         WHERE parent_id IS NULL AND status != 'completed'
         GROUP BY page_id, status",
        ARRAY_A
    );

    $counts = array();
    foreach ($results as $row) {
        $page_id = $row['page_id'];
        $status = $row['status'];
        $count = intval($row['count']);

        if (!isset($counts[$page_id])) {
            $counts[$page_id] = array(
                'work' => 0,        // 作業（未着手）
                'check' => 0        // チェック依頼
            );
        }

        if ($status === 'check-requested') {
            $counts[$page_id]['check'] += $count;
        } else {
            // not-started やその他の未完了ステータスは作業扱い
            $counts[$page_id]['work'] += $count;
        }
    }

    return $counts;
}

/**
 * 指示を追加
 */
function lw_add_instruction($page_id, $content, $image_path = null, $parent_id = null, $status = 'not-started', $assigned_to = null, $custom_title = null, $link_url = null) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';

    // 最大sort_orderを取得
    $max_order = $wpdb->get_var($wpdb->prepare(
        "SELECT MAX(sort_order) FROM $table_name WHERE page_id = %d AND parent_id IS NULL",
        $page_id
    ));
    $sort_order = $max_order !== null ? intval($max_order) + 1 : 0;

    $result = $wpdb->insert(
        $table_name,
        array(
            'page_id' => $page_id,
            'parent_id' => $parent_id,
            'content' => $content,
            'image_path' => $image_path,
            'status' => $status,
            'assigned_to' => $assigned_to,
            'custom_title' => $custom_title,
            'link_url' => $link_url,
            'sort_order' => $parent_id ? 0 : $sort_order,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ),
        array('%d', '%d', '%s', '%s', '%s', '%d', '%s', '%s', '%d', '%d', '%s', '%s')
    );

    if ($result) {
        return $wpdb->insert_id;
    }
    return false;
}

/**
 * 指示を更新
 */
function lw_update_instruction($id, $data) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';

    $update_data = array('updated_at' => current_time('mysql'));
    $format = array('%s');

    if (isset($data['content'])) {
        $update_data['content'] = $data['content'];
        $format[] = '%s';
    }
    if (isset($data['status'])) {
        $update_data['status'] = $data['status'];
        $format[] = '%s';
    }
    if (array_key_exists('assigned_to', $data)) {
        $update_data['assigned_to'] = $data['assigned_to'];
        $format[] = '%d';
    }
    if (isset($data['image_path'])) {
        $update_data['image_path'] = $data['image_path'];
        $format[] = '%s';
    }
    if (isset($data['sort_order'])) {
        $update_data['sort_order'] = $data['sort_order'];
        $format[] = '%d';
    }

    return $wpdb->update($table_name, $update_data, array('id' => $id), $format, array('%d'));
}

/**
 * 指示を削除（画像も削除）
 */
function lw_delete_instruction($id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';

    // 指示情報を取得
    $instruction = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $id
    ), ARRAY_A);

    if (!$instruction) {
        return false;
    }

    // 画像があれば削除
    if ($instruction['image_path']) {
        $upload_dir = lw_get_instructions_upload_dir();
        $file_path = $upload_dir['path'] . '/' . $instruction['image_path'];
        if (file_exists($file_path)) {
            unlink($file_path);
        }
    }

    // 返信も削除（返信の画像も削除）
    $replies = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $table_name WHERE parent_id = %d",
        $id
    ), ARRAY_A);

    foreach ($replies as $reply) {
        if ($reply['image_path']) {
            $upload_dir = lw_get_instructions_upload_dir();
            $file_path = $upload_dir['path'] . '/' . $reply['image_path'];
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }
    }

    // 返信を削除
    $wpdb->delete($table_name, array('parent_id' => $id), array('%d'));

    // 本体を削除
    return $wpdb->delete($table_name, array('id' => $id), array('%d'));
}

/**
 * 画像をアップロード
 */
function lw_upload_instruction_image($file) {
    $upload_dir = lw_get_instructions_upload_dir();

    // ファイルタイプチェック
    $allowed_types = array('image/jpeg', 'image/png', 'image/gif', 'image/webp');
    if (!in_array($file['type'], $allowed_types)) {
        return new WP_Error('invalid_type', '許可されていないファイル形式です');
    }

    // ファイルサイズチェック（5MB）
    if ($file['size'] > 5 * 1024 * 1024) {
        return new WP_Error('too_large', 'ファイルサイズが大きすぎます（最大5MB）');
    }

    // ユニークなファイル名を生成
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('inst_') . '_' . time() . '.' . $ext;
    $filepath = $upload_dir['path'] . '/' . $filename;

    // ファイルを移動
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return $filename;
    }

    return new WP_Error('upload_failed', 'アップロードに失敗しました');
}

// ===========================================
// Ajax ハンドラー
// ===========================================

// 指示一覧を取得
add_action('wp_ajax_lw_get_instructions', 'lw_ajax_get_instructions');
function lw_ajax_get_instructions() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = intval($_POST['page_id']);
    if (!$page_id) {
        wp_send_json_error('ページIDが指定されていません');
    }

    $instructions = lw_get_instructions($page_id);

    wp_send_json_success(array(
        'instructions' => $instructions,
        'page_id' => $page_id
    ));
}

// 指示を追加
add_action('wp_ajax_lw_add_instruction', 'lw_ajax_add_instruction');
function lw_ajax_add_instruction() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = intval($_POST['page_id']);
    $content = sanitize_textarea_field($_POST['content']);
    $parent_id = !empty($_POST['parent_id']) ? intval($_POST['parent_id']) : null;
    $status = !empty($_POST['status']) ? sanitize_text_field($_POST['status']) : 'not-started';
    $assigned_to = !empty($_POST['assigned_to']) ? intval($_POST['assigned_to']) : null;
    $custom_title = !empty($_POST['custom_title']) ? sanitize_text_field($_POST['custom_title']) : null;
    $link_url = !empty($_POST['link_url']) ? esc_url_raw($_POST['link_url']) : null;

    // ステータスバリデーション
    $valid_statuses = array('not-started', 'check-requested', 'completed');
    if (!in_array($status, $valid_statuses)) {
        $status = 'not-started';
    }

    // page_idが0の場合はcustom_titleが必須
    if ($page_id === 0 && empty($custom_title)) {
        wp_send_json_error('タイトルを入力してください');
    }

    if ($page_id === 0 && empty($content)) {
        wp_send_json_error('依頼内容を入力してください');
    }

    if ($page_id > 0 && empty($content)) {
        wp_send_json_error('必須項目が入力されていません');
    }

    // 画像アップロード処理
    $image_path = null;
    if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $result = lw_upload_instruction_image($_FILES['image']);
        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }
        $image_path = $result;
    }

    $instruction_id = lw_add_instruction($page_id, $content, $image_path, $parent_id, $status, $assigned_to, $custom_title, $link_url);

    if ($instruction_id) {
        wp_send_json_success(array(
            'message' => '追加しました',
            'instruction_id' => $instruction_id
        ));
    } else {
        wp_send_json_error('追加に失敗しました');
    }
}

// 指示のステータスを更新
add_action('wp_ajax_lw_update_instruction_status', 'lw_ajax_update_instruction_status');
function lw_ajax_update_instruction_status() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $instruction_id = intval($_POST['instruction_id']);
    $status = isset($_POST['status']) ? sanitize_text_field($_POST['status']) : '';
    $assigned_to = isset($_POST['assigned_to']) ? (intval($_POST['assigned_to']) ?: null) : null;

    $valid_statuses = array('not-started', 'check-requested', 'completed');
    if (empty($status) || !in_array($status, $valid_statuses)) {
        wp_send_json_error('無効なステータスです: ' . $status);
    }

    $update_data = array('status' => $status);

    // チェック依頼の場合は担当者を設定、完了・未着手の場合はクリア
    if ($status === 'check-requested') {
        $update_data['assigned_to'] = $assigned_to;
    } else {
        $update_data['assigned_to'] = null;
    }

    $result = lw_update_instruction($instruction_id, $update_data);

    if ($result !== false) {
        wp_send_json_success(array('message' => '更新しました'));
    } else {
        wp_send_json_error('更新に失敗しました');
    }
}

// 指示を編集（内容・画像）
add_action('wp_ajax_lw_update_instruction', 'lw_ajax_update_instruction_content');
function lw_ajax_update_instruction_content() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $instruction_id = intval($_POST['instruction_id']);
    $content = sanitize_textarea_field($_POST['content']);
    $remove_image = isset($_POST['remove_image']) && $_POST['remove_image'] === '1';

    if (!$instruction_id) {
        wp_send_json_error('指示IDが指定されていません');
    }

    if (empty($content)) {
        wp_send_json_error('内容を入力してください');
    }

    // 現在の指示情報を取得
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';
    $instruction = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $instruction_id
    ), ARRAY_A);

    if (!$instruction) {
        wp_send_json_error('指示が見つかりません');
    }

    $update_data = array('content' => $content);

    // 画像削除フラグがある場合
    if ($remove_image && $instruction['image_path']) {
        $upload_dir = lw_get_instructions_upload_dir();
        $file_path = $upload_dir['path'] . '/' . $instruction['image_path'];
        if (file_exists($file_path)) {
            unlink($file_path);
        }
        $update_data['image_path'] = null;
    }

    // 新しい画像がアップロードされた場合
    if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        // 古い画像を削除
        if ($instruction['image_path']) {
            $upload_dir = lw_get_instructions_upload_dir();
            $file_path = $upload_dir['path'] . '/' . $instruction['image_path'];
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }

        // 新しい画像をアップロード
        $result = lw_upload_instruction_image($_FILES['image']);
        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }
        $update_data['image_path'] = $result;
    }

    $result = lw_update_instruction($instruction_id, $update_data);

    if ($result !== false) {
        wp_send_json_success(array('message' => '保存しました'));
    } else {
        wp_send_json_error('保存に失敗しました');
    }
}

// 指示の順序を更新
add_action('wp_ajax_lw_update_instruction_order', 'lw_ajax_update_instruction_order');
function lw_ajax_update_instruction_order() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $order = isset($_POST['order']) ? json_decode(stripslashes($_POST['order']), true) : array();

    if (empty($order)) {
        wp_send_json_error('順序データがありません');
    }

    foreach ($order as $index => $instruction_id) {
        lw_update_instruction(intval($instruction_id), array('sort_order' => $index));
    }

    wp_send_json_success(array('message' => '順序を更新しました'));
}

// 指示を削除
add_action('wp_ajax_lw_delete_instruction', 'lw_ajax_delete_instruction');
function lw_ajax_delete_instruction() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $instruction_id = intval($_POST['instruction_id']);

    if (!$instruction_id) {
        wp_send_json_error('指示IDが指定されていません');
    }

    $result = lw_delete_instruction($instruction_id);

    if ($result) {
        wp_send_json_success(array('message' => '削除しました'));
    } else {
        wp_send_json_error('削除に失敗しました');
    }
}

// 未完了件数を取得（ページ一覧用）
add_action('wp_ajax_lw_get_instruction_counts', 'lw_ajax_get_instruction_counts');
function lw_ajax_get_instruction_counts() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    $counts = lw_get_incomplete_instruction_counts();

    wp_send_json_success(array('counts' => $counts));
}

// 全ページの未完了依頼一覧を取得
add_action('wp_ajax_lw_get_all_pending_instructions', 'lw_ajax_get_all_pending_instructions');
function lw_ajax_get_all_pending_instructions() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_instructions';

    // テーブル存在チェック
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        wp_send_json_success(array(
            'instructions' => array(),
            'counts' => array('all' => 0, 'work' => 0, 'check' => 0)
        ));
        return;
    }

    // 未完了の指示を取得（ページ情報含む）
    $results = $wpdb->get_results(
        "SELECT i.*,
                u.display_name as author_name,
                a.display_name as assigned_to_name,
                p.post_title as page_title
         FROM $table_name i
         LEFT JOIN {$wpdb->users} u ON i.created_by = u.ID
         LEFT JOIN {$wpdb->users} a ON i.assigned_to = a.ID
         LEFT JOIN {$wpdb->posts} p ON i.page_id = p.ID
         WHERE i.parent_id IS NULL AND i.status != 'completed'
         ORDER BY
            CASE i.status
                WHEN 'check-requested' THEN 1
                ELSE 2
            END,
            i.created_at DESC",
        ARRAY_A
    );

    $instructions = array();
    $counts = array('all' => 0, 'work' => 0, 'check' => 0);

    foreach ($results as $row) {
        $counts['all']++;
        if ($row['status'] === 'check-requested') {
            $counts['check']++;
        } else {
            $counts['work']++;
        }

        // タイトルの決定: custom_title > page_title > デフォルト
        $title = '';
        if (!empty($row['custom_title'])) {
            $title = $row['custom_title'];
        } elseif (!empty($row['page_title'])) {
            $title = $row['page_title'];
        } else {
            $title = '（削除されたページ）';
        }

        $instructions[] = array(
            'id' => intval($row['id']),
            'page_id' => intval($row['page_id']),
            'page_title' => $title,
            'custom_title' => $row['custom_title'],
            'content' => $row['content'],
            'image_path' => $row['image_path'],
            'status' => $row['status'],
            'assigned_to' => $row['assigned_to'] ? intval($row['assigned_to']) : null,
            'assigned_to_name' => $row['assigned_to_name'],
            'author_name' => $row['author_name'],
            'link_url' => $row['link_url'],
            'created_at' => $row['created_at']
        );
    }

    wp_send_json_success(array(
        'instructions' => $instructions,
        'counts' => $counts
    ));
}

// 固定ページ・投稿一覧を取得（依頼ターゲット選択用）
add_action('wp_ajax_lw_get_post_list', 'lw_ajax_get_post_list');
function lw_ajax_get_post_list() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $post_type = isset($_POST['post_type']) ? sanitize_text_field($_POST['post_type']) : 'page';

    // 許可するポストタイプのみ
    if (!in_array($post_type, array('page', 'post'))) {
        wp_send_json_error('無効な投稿タイプです');
    }

    $args = array(
        'post_type' => $post_type,
        'post_status' => array('publish', 'draft', 'pending', 'private'),
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC'
    );

    // 固定ページの場合は階層を考慮
    if ($post_type === 'page') {
        $args['orderby'] = 'menu_order title';
    }

    $posts = get_posts($args);
    $result = array();

    foreach ($posts as $post) {
        $item = array(
            'id' => $post->ID,
            'title' => $post->post_title ?: '（タイトルなし）',
            'status' => $post->post_status
        );

        // 固定ページの場合は親情報も追加
        if ($post_type === 'page' && $post->post_parent) {
            $parent = get_post($post->post_parent);
            if ($parent) {
                $item['parent_title'] = $parent->post_title;
            }
        }

        $result[] = $item;
    }

    wp_send_json_success(array('posts' => $result));
}

// 編集者以上のユーザー一覧を取得
add_action('wp_ajax_lw_get_editors', 'lw_ajax_get_editors');
function lw_ajax_get_editors() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');
    lw_check_premium_ajax();

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    // 編集者以上の権限を持つユーザーを取得
    $users = get_users(array(
        'role__in' => array('administrator', 'editor'),
        'orderby' => 'display_name',
        'order' => 'ASC'
    ));

    $result = array();
    foreach ($users as $user) {
        $result[] = array(
            'id' => $user->ID,
            'name' => $user->display_name
        );
    }

    wp_send_json_success(array('users' => $result));
}
