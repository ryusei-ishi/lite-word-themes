<?php
/**
 * リンク一覧機能
 *
 * @package LiteWord
 */

if (!defined('ABSPATH')) {
    exit;
}

// 定数定義
if (!defined('LW_BROKEN_LINK_CHECK_PATH')) {
    define('LW_BROKEN_LINK_CHECK_PATH', get_template_directory() . '/functions/lw_broken_link_check/');
}
if (!defined('LW_BROKEN_LINK_CHECK_URL')) {
    define('LW_BROKEN_LINK_CHECK_URL', get_template_directory_uri() . '/functions/lw_broken_link_check/');
}

// スキャナークラスを読み込み
$scanner_file = LW_BROKEN_LINK_CHECK_PATH . 'class-scanner.php';
if (file_exists($scanner_file)) {
    require_once $scanner_file;
}

// チェッカークラスを読み込み
$checker_file = LW_BROKEN_LINK_CHECK_PATH . 'class-checker.php';
if (file_exists($checker_file)) {
    require_once $checker_file;
}

/**
 * テーブル名を取得
 */
function lw_link_list_get_table_name() {
    global $wpdb;
    return $wpdb->prefix . 'lw_link_list';
}

/**
 * データベーステーブル作成
 */
function lw_link_list_create_table() {
    global $wpdb;

    $table_name = lw_link_list_get_table_name();
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        post_id bigint(20) UNSIGNED NOT NULL,
        post_type varchar(50) NOT NULL,
        post_title varchar(255) NOT NULL,
        links_json longtext NOT NULL,
        ids_json longtext,
        link_count int(11) NOT NULL DEFAULT 0,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY post_id (post_id),
        KEY post_type (post_type)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

/**
 * データベースにデータがあるか確認
 */
function lw_link_list_has_data() {
    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    // テーブルが存在するかチェック
    $table_exists = $wpdb->get_var($wpdb->prepare(
        "SHOW TABLES LIKE %s",
        $table_name
    ));

    if (!$table_exists) {
        return false;
    }

    // データ件数をチェック
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    return $count > 0;
}

/**
 * データベースからリンク情報を取得
 *
 * @return array ['links' => リンク配列, 'pages' => 全ページ情報配列]
 */
function lw_link_list_get_from_db() {
    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    $results = $wpdb->get_results(
        "SELECT * FROM $table_name ORDER BY post_type, post_id",
        ARRAY_A
    );

    if (!$results) {
        return array(
            'links' => array(),
            'pages' => array(),
        );
    }

    $all_links = array();
    $all_pages = array();

    foreach ($results as $row) {
        $post_id = (int) $row['post_id'];
        $edit_link = get_edit_post_link($post_id, 'raw');

        // id属性リストを取得
        $ids = array();
        if (!empty($row['ids_json'])) {
            $ids = json_decode($row['ids_json'], true);
            if (!is_array($ids)) {
                $ids = array();
            }
        }

        // ページ情報を記録（リンクの有無に関わらず）
        $all_pages[] = array(
            'post_id' => $post_id,
            'post_type' => $row['post_type'],
            'post_title' => $row['post_title'],
            'link_count' => (int) $row['link_count'],
            'edit_link' => $edit_link,
            'ids' => $ids,
        );

        // リンク情報を展開
        $links = json_decode($row['links_json'], true);
        if (is_array($links) && count($links) > 0) {
            foreach ($links as $link) {
                $link['source_type'] = 'post';
                $link['source_id'] = $post_id;
                $link['source_title'] = $row['post_title'];
                $link['post_type'] = $row['post_type'];
                $link['edit_link'] = $edit_link;
                $all_links[] = $link;
            }
        }
    }

    return array(
        'links' => $all_links,
        'pages' => $all_pages,
    );
}

/**
 * スキャン結果をデータベースに保存
 *
 * @param array $links リンク情報配列
 * @param array $all_pages 全ページ情報配列（リンクがないページも含む）
 */
function lw_link_list_save_to_db($links, $all_pages = array()) {
    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    // テーブル作成（存在しなければ）
    lw_link_list_create_table();

    // 既存データを削除
    $wpdb->query("TRUNCATE TABLE $table_name");

    // 全ページをベースにデータを構築
    $pages = array();

    // まず、全ページを初期化（リンクなしとして）
    foreach ($all_pages as $page_info) {
        $post_id = $page_info['post_id'];
        $pages[$post_id] = array(
            'post_id' => $post_id,
            'post_type' => $page_info['post_type'],
            'post_title' => $page_info['post_title'],
            'links' => array(),
            'ids' => isset($page_info['ids']) ? $page_info['ids'] : array(),
        );
    }

    // リンク情報を追加
    foreach ($links as $link) {
        if ($link['source_type'] !== 'post') {
            continue;
        }

        $post_id = $link['source_id'];

        // ページがまだなければ追加（後方互換性のため）
        if (!isset($pages[$post_id])) {
            $pages[$post_id] = array(
                'post_id' => $post_id,
                'post_type' => $link['post_type'],
                'post_title' => $link['source_title'],
                'links' => array(),
            );
        }

        // リンク情報（DB保存用に不要なフィールドを除く）
        $pages[$post_id]['links'][] = array(
            'href' => $link['href'],
            'text' => $link['text'],
            'source_field' => $link['source_field'],
        );
    }

    // データベースに挿入（リンクがないページも含む）
    foreach ($pages as $page) {
        $wpdb->insert(
            $table_name,
            array(
                'post_id' => $page['post_id'],
                'post_type' => $page['post_type'],
                'post_title' => $page['post_title'],
                'links_json' => json_encode($page['links'], JSON_UNESCAPED_UNICODE),
                'ids_json' => json_encode(isset($page['ids']) ? $page['ids'] : array(), JSON_UNESCAPED_UNICODE),
                'link_count' => count($page['links']),
            ),
            array('%d', '%s', '%s', '%s', '%s', '%d')
        );
    }

    return count($pages);
}

/**
 * 最終更新日時を取得
 */
function lw_link_list_get_last_updated() {
    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    // テーブルが存在するかチェック
    $table_exists = $wpdb->get_var($wpdb->prepare(
        "SHOW TABLES LIKE %s",
        $table_name
    ));

    if (!$table_exists) {
        return null;
    }

    $last_updated = $wpdb->get_var("SELECT MAX(updated_at) FROM $table_name");
    return $last_updated;
}

/**
 * 管理メニュー登録
 */
function lw_broken_link_check_admin_menu() {
    add_menu_page(
        'リンク一覧',
        'リンク一覧',
        'manage_options',
        'lw_link_list',
        'lw_broken_link_check_all_links_page',
        'dashicons-admin-links',
        25
    );
}
add_action('admin_menu', 'lw_broken_link_check_admin_menu');

/**
 * リンク一覧ページ表示
 */
function lw_broken_link_check_all_links_page() {
    require_once LW_BROKEN_LINK_CHECK_PATH . 'admin-page-all-links.php';
}

/**
 * AJAXハンドラー: リンクスキャン（データベースに保存）
 */
function lw_link_list_scan_ajax() {
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => '権限がありません。'));
    }

    // スキャン実行
    $scan_result = LW_Broken_Link_Check_Scanner::scan_all_links();
    $links = $scan_result['links'];
    $pages = $scan_result['pages'];

    // データベースに保存（全ページ情報も含む）
    $saved_pages = lw_link_list_save_to_db($links, $pages);

    // 編集リンクを追加
    foreach ($links as &$link) {
        if ($link['source_type'] === 'post') {
            $link['edit_link'] = get_edit_post_link($link['source_id'], 'raw');
        }
    }

    // 全ページに編集リンクを追加（idsは既にスキャン時に含まれている）
    foreach ($pages as &$page) {
        $page['edit_link'] = get_edit_post_link($page['post_id'], 'raw');
    }

    wp_send_json_success(array(
        'links' => $links,
        'pages' => $pages,
        'total' => count($links),
        'pages_saved' => $saved_pages,
    ));
}
add_action('wp_ajax_lw_link_list_scan', 'lw_link_list_scan_ajax');

/**
 * AJAXハンドラー: データベースからリンク取得
 */
function lw_link_list_load_ajax() {
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => '権限がありません。'));
    }

    $data = lw_link_list_get_from_db();
    $links = $data['links'];
    $pages = $data['pages'];

    wp_send_json_success(array(
        'links' => $links,
        'pages' => $pages,
        'total' => count($links),
    ));
}
add_action('wp_ajax_lw_link_list_load', 'lw_link_list_load_ajax');

/**
 * AJAXハンドラー: データベース状態チェック
 */
function lw_link_list_status_ajax() {
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => '権限がありません。'));
    }

    $has_data = lw_link_list_has_data();
    $last_updated = lw_link_list_get_last_updated();

    wp_send_json_success(array(
        'has_data' => $has_data,
        'last_updated' => $last_updated,
    ));
}
add_action('wp_ajax_lw_link_list_status', 'lw_link_list_status_ajax');

/**
 * AJAXハンドラー: リンク有効性チェック（バッチ処理）
 */
function lw_link_list_check_batch_ajax() {
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => '権限がありません。'));
    }

    // URLリストを取得
    $urls = isset($_POST['urls']) ? $_POST['urls'] : array();

    if (empty($urls) || !is_array($urls)) {
        wp_send_json_error(array('message' => 'URLが指定されていません。'));
    }

    // バッチサイズ制限（最大20件）
    $urls = array_slice($urls, 0, 20);

    // チェック実行
    $results = LW_Broken_Link_Check_Checker::check_batch($urls);

    wp_send_json_success(array(
        'results' => $results,
        'checked' => count($results),
    ));
}
add_action('wp_ajax_lw_link_list_check_batch', 'lw_link_list_check_batch_ajax');

/**
 * AJAXハンドラー: チェック対象URLリストを取得
 */
function lw_link_list_get_checkable_urls_ajax() {
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => '権限がありません。'));
    }

    $data = lw_link_list_get_from_db();
    $links = $data['links'];

    error_log('[LW Link Check] === チェック対象URL取得開始 ===');
    error_log('[LW Link Check] DB内リンク数: ' . count($links));
    error_log('[LW Link Check] ページ数: ' . (isset($data['pages']) ? count($data['pages']) : 0));

    // デバッグ情報
    $debug = array(
        'links_count' => count($links),
        'pages_count' => isset($data['pages']) ? count($data['pages']) : 0,
    );

    // チェック可能なURLのみ抽出（重複排除）
    $checkable_urls = array();
    $seen = array();
    $skipped = array();

    foreach ($links as $link) {
        $href = isset($link['href']) ? $link['href'] : '';
        $source_id = isset($link['source_id']) ? $link['source_id'] : 0;

        // 空はスキップ
        if (empty($href)) {
            $skipped[] = array('reason' => 'empty', 'href' => $href);
            continue;
        }

        // mailto、tel、javascriptはスキップ
        if (stripos($href, 'mailto:') === 0) {
            $skipped[] = array('reason' => 'mailto', 'href' => $href);
            continue;
        }
        if (stripos($href, 'tel:') === 0) {
            $skipped[] = array('reason' => 'tel', 'href' => $href);
            continue;
        }
        if (stripos($href, 'javascript:') === 0) {
            $skipped[] = array('reason' => 'javascript', 'href' => $href);
            continue;
        }

        // アンカーリンク（#で始まる）はソースページのURLを付与
        if (strpos($href, '#') === 0) {
            if ($source_id > 0) {
                $page_url = get_permalink($source_id);
                if ($page_url) {
                    // ページURLの末尾の/を削除してアンカーを付与
                    $href = rtrim($page_url, '/') . $href;
                } else {
                    $skipped[] = array('reason' => 'no_permalink', 'href' => $href);
                    continue;
                }
            } else {
                $skipped[] = array('reason' => 'no_source_id', 'href' => $href);
                continue;
            }
        }

        // 重複チェック
        if (isset($seen[$href])) {
            continue;
        }
        $seen[$href] = true;

        $checkable_urls[] = $href;
    }

    $debug['skipped_count'] = count($skipped);
    $debug['skipped_sample'] = array_slice($skipped, 0, 5);
    $debug['checkable_count'] = count($checkable_urls);

    error_log('[LW Link Check] スキップ数: ' . count($skipped));
    error_log('[LW Link Check] チェック対象URL数: ' . count($checkable_urls));
    if (count($checkable_urls) > 0) {
        error_log('[LW Link Check] チェック対象URLサンプル: ' . implode(', ', array_slice($checkable_urls, 0, 5)));
    }
    if (count($skipped) > 0) {
        error_log('[LW Link Check] スキップサンプル: ' . print_r(array_slice($skipped, 0, 5), true));
    }
    error_log('[LW Link Check] === チェック対象URL取得完了 ===');

    wp_send_json_success(array(
        'urls' => $checkable_urls,
        'total' => count($checkable_urls),
        'debug' => $debug,
    ));
}
add_action('wp_ajax_lw_link_list_get_checkable_urls', 'lw_link_list_get_checkable_urls_ajax');

/**
 * AJAXハンドラー: JavaScriptからのデバッグログをdebug.logに出力
 */
function lw_link_list_debug_log_ajax() {
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error();
    }

    $message = isset($_POST['message']) ? sanitize_text_field($_POST['message']) : '';
    $data = isset($_POST['data']) ? $_POST['data'] : null;

    if (!empty($message)) {
        if ($data !== null) {
            error_log('[LW Link Check] ' . $message . ': ' . print_r($data, true));
        } else {
            error_log('[LW Link Check] ' . $message);
        }
    }

    wp_send_json_success();
}
add_action('wp_ajax_lw_link_list_debug_log', 'lw_link_list_debug_log_ajax');

/**
 * AJAXハンドラー: リンクURLを直接編集
 */
function lw_link_list_update_href_ajax() {
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => '権限がありません。'));
    }

    // パラメータ取得
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $old_href = isset($_POST['old_href']) ? $_POST['old_href'] : '';
    $new_href = isset($_POST['new_href']) ? $_POST['new_href'] : '';
    $link_text = isset($_POST['link_text']) ? $_POST['link_text'] : '';
    $link_index = isset($_POST['link_index']) ? intval($_POST['link_index']) : 0;

    if ($post_id <= 0) {
        wp_send_json_error(array('message' => '投稿IDが無効です。'));
    }

    // 投稿を取得
    $post = get_post($post_id);
    if (!$post) {
        wp_send_json_error(array('message' => '投稿が見つかりません。'));
    }

    $content = $post->post_content;

    // aタグの開始タグの位置を全て取得（DOMDocumentと同じ順序で）
    $replaced = false;
    $a_tag_positions = array();

    // 全てのaタグ開始タグを検索（<a で始まり > で終わる部分）
    if (preg_match_all('/<a\s[^>]*>/i', $content, $matches, PREG_OFFSET_CAPTURE)) {
        foreach ($matches[0] as $match) {
            $a_tag_positions[] = array(
                'tag' => $match[0],
                'pos' => $match[1],
            );
        }
    }

    // 指定されたインデックスのaタグを置換
    if (isset($a_tag_positions[$link_index])) {
        $target = $a_tag_positions[$link_index];
        $old_tag = $target['tag'];
        $pos = $target['pos'];

        // href属性があるか確認
        if (preg_match('/\shref\s*=\s*(["\'])([^\1]*?)\1/i', $old_tag)) {
            // href属性を置換
            $new_tag = preg_replace(
                '/(\shref\s*=\s*["\'])([^"\']*)(["\']\s*)/i',
                '${1}' . esc_attr($new_href) . '${3}',
                $old_tag
            );
        } else {
            // href属性がない場合は追加
            $new_tag = preg_replace('/^<a\s/i', '<a href="' . esc_attr($new_href) . '" ', $old_tag);
        }

        if ($new_tag !== $old_tag) {
            $content = substr_replace($content, $new_tag, $pos, strlen($old_tag));
            $replaced = true;
        }
    }

    if (!$replaced) {
        wp_send_json_error(array(
            'message' => '該当するリンクが見つかりませんでした。',
            'debug' => array(
                'old_href' => $old_href,
                'link_text' => $link_text,
                'link_index' => $link_index,
                'total_a_tags' => count($a_tag_positions),
            )
        ));
    }

    // 投稿を更新
    $result = wp_update_post(array(
        'ID' => $post_id,
        'post_content' => $content,
    ), true);

    if (is_wp_error($result)) {
        wp_send_json_error(array('message' => '投稿の更新に失敗しました: ' . $result->get_error_message()));
    }

    // DB内のリンク情報も更新（再スキャン）
    $post = get_post($post_id);
    $filtered_content = apply_filters('the_content', $post->post_content);
    $page_ids = LW_Broken_Link_Check_Scanner::extract_all_ids($filtered_content);
    $links = LW_Broken_Link_Check_Scanner::extract_all_a_tags($post->post_content);

    // DBを更新
    global $wpdb;
    $table_name = lw_link_list_get_table_name();
    $wpdb->update(
        $table_name,
        array(
            'links_json' => json_encode($links, JSON_UNESCAPED_UNICODE),
            'ids_json' => json_encode($page_ids, JSON_UNESCAPED_UNICODE),
            'link_count' => count($links),
        ),
        array('post_id' => $post_id),
        array('%s', '%s', '%d'),
        array('%d')
    );

    wp_send_json_success(array(
        'message' => 'リンクを更新しました。',
        'new_href' => $new_href,
        'links' => $links,
    ));
}
add_action('wp_ajax_lw_link_list_update_href', 'lw_link_list_update_href_ajax');
