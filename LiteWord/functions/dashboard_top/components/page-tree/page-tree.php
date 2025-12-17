<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord 固定ページツリー（マインドマップ風）
 *
 * 機能:
 * - jsPlumbを使用した放射状マインドマップ表示
 * - トップページを中心に配置
 * - 直線で接続
 * - ドラッグ&ドロップで親子関係変更
 * - 動的読み込み（モーダルオープン時）
 */

// ウィジェット表示（モーダル内のコンテナのみ）
function lw_page_tree_widget() {
    ?>
    <div class="lw-mindmap-container" id="lw-mindmap-container">
        <div class="lw-mindmap-loading">
            <span class="spinner is-active"></span>
            <p>読み込み中...</p>
        </div>
    </div>
    <?php
}

// ページツリーモーダル全体を出力
function lw_render_page_tree_modal() {
    ?>
    <!-- ページツリー モーダル -->
    <div class="lw-modal-overlay" id="lw-page-tree-modal">
        <div class="lw-modal">
            <div class="lw-modal-header">
                <h2>
                    <span class="dashicons dashicons-networking"></span>
                    固定ページ構造
                </h2>
                <button type="button" class="lw-modal-close" id="lw-modal-close">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <!-- トップページ未設定の警告 -->
            <div class="lw-front-page-warning" id="lw-front-page-warning" style="display: none;">
                <span class="dashicons dashicons-warning"></span>
                <span class="lw-warning-text">トップページが設定されていません。</span>
                <span class="lw-help-icon" id="lw-front-page-help">
                    <span class="dashicons dashicons-editor-help"></span>
                    <div class="lw-help-tooltip">
                        <strong>トップページとは？</strong>
                        <p>サイトのURL（例：https://example.com/）にアクセスしたときに最初に表示されるページです。</p>
                        <p>通常は「ホーム」「TOP」「トップページ」などの名前の固定ページを設定します。</p>
                        <p>設定しない場合、最新の投稿一覧が表示されます。</p>
                    </div>
                </span>
                <select id="lw-tree-front-page-select">
                    <option value="">-- 固定ページを選択 --</option>
                </select>
                <button type="button" class="lw-btn-set-front" id="lw-btn-set-front">設定</button>
            </div>
            <div class="lw-modal-toolbar">
                <div class="lw-filter-buttons">
                    <button type="button" class="lw-filter-btn active" data-filter="page" title="固定ページ">
                        <span class="dashicons dashicons-admin-page"></span>
                        <span class="lw-filter-label">固定ページ</span>
                    </button>
                    <button type="button" class="lw-filter-btn active" data-filter="post" title="投稿">
                        <span class="dashicons dashicons-admin-post"></span>
                        <span class="lw-filter-label">投稿</span>
                    </button>
                    <button type="button" class="lw-filter-btn active" data-filter="draft" title="下書き">
                        <span class="dashicons dashicons-edit"></span>
                        <span class="lw-filter-label">下書き</span>
                    </button>
                </div>
                <div class="lw-toolbar-right">
                    <div class="lw-zoom-controls">
                        <button type="button" id="lw-zoom-out" title="縮小">
                            <span class="dashicons dashicons-minus"></span>
                        </button>
                        <span id="lw-zoom-level">100%</span>
                        <button type="button" id="lw-zoom-in" title="拡大">
                            <span class="dashicons dashicons-plus"></span>
                        </button>
                        <button type="button" id="lw-zoom-reset" title="リセット">
                            <span class="dashicons dashicons-image-rotate"></span>
                        </button>
                    </div>
                    <div class="lw-zoom-hint">Ctrl + ホイールでもズーム可能</div>
                </div>
            </div>
            <div class="lw-modal-body">
                <?php lw_page_tree_widget(); ?>
            </div>
        </div>
    </div>
    <?php
}

// Ajax: ページ階層データを取得
add_action('wp_ajax_lw_get_pages_data', 'lw_ajax_get_pages_data');
function lw_ajax_get_pages_data() {
    check_ajax_referer('lw_page_tree_nonce', 'nonce');

    $front_page_id = get_option('page_on_front');

    $all_pages = get_posts(array(
        'post_type' => 'page',
        'post_status' => array('publish', 'draft', 'private', 'pending'),
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC'
    ));

    $pages_data = array();

    foreach ($all_pages as $page) {
        $pages_data[] = array(
            'id' => $page->ID,
            'title' => $page->post_title,
            'slug' => $page->post_name,
            'status' => $page->post_status,
            'parent_id' => $page->post_parent,
            'menu_order' => $page->menu_order,
            'edit_url' => get_edit_post_link($page->ID, 'raw'),
            'is_front' => ($page->ID == $front_page_id)
        );
    }

    wp_send_json_success(array(
        'pages' => $pages_data,
        'front_page_id' => $front_page_id,
        'total' => count($pages_data)
    ));
}

// Ajax: ページの親・順序を更新
add_action('wp_ajax_lw_update_page_order', 'lw_ajax_update_page_order');
function lw_ajax_update_page_order() {
    check_ajax_referer('lw_page_tree_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = isset($_POST['page_id']) ? intval($_POST['page_id']) : 0;
    $new_parent_id = isset($_POST['new_parent_id']) ? intval($_POST['new_parent_id']) : 0;
    $new_order = isset($_POST['new_order']) ? intval($_POST['new_order']) : 0;

    if (!$page_id) {
        wp_send_json_error('ページIDが指定されていません');
    }

    // 循環参照チェック
    if ($new_parent_id) {
        $parent = get_post($new_parent_id);
        while ($parent) {
            if ($parent->ID == $page_id) {
                wp_send_json_error('循環参照になるため変更できません');
            }
            $parent = $parent->post_parent ? get_post($parent->post_parent) : null;
        }
    }

    // ページを更新
    $result = wp_update_post(array(
        'ID' => $page_id,
        'post_parent' => $new_parent_id,
        'menu_order' => $new_order
    ));

    if (is_wp_error($result)) {
        wp_send_json_error($result->get_error_message());
    }

    wp_send_json_success(array(
        'message' => '更新しました',
        'page_id' => $page_id,
        'new_parent_id' => $new_parent_id
    ));
}

// ステータスラベルを取得
function lw_get_status_label($status) {
    $labels = array(
        'publish' => '公開',
        'draft' => '下書き',
        'private' => '非公開',
        'pending' => '承認待ち'
    );
    return isset($labels[$status]) ? $labels[$status] : $status;
}

// Ajax: 構造変更を一括保存
add_action('wp_ajax_lw_save_structure_changes', 'lw_ajax_save_structure_changes');
function lw_ajax_save_structure_changes() {
    check_ajax_referer('lw_page_tree_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $changes = isset($_POST['changes']) ? json_decode(stripslashes($_POST['changes']), true) : array();

    if (empty($changes)) {
        wp_send_json_error('変更がありません');
    }

    $errors = array();
    $success_count = 0;

    foreach ($changes as $change) {
        $node_id = sanitize_text_field($change['nodeId']);
        $node_type = sanitize_text_field($change['nodeType']);
        $new_parent_id = sanitize_text_field($change['newParentId']);

        // IDから数値を取り出す（page-123 → 123）
        $raw_id = intval(preg_replace('/^(page|cat|post)-/', '', $node_id));
        $raw_parent_id = intval(preg_replace('/^(page|cat|post)-/', '', $new_parent_id));

        $result = false;

        switch ($node_type) {
            case 'page':
                // 固定ページの親を更新
                $result = wp_update_post(array(
                    'ID' => $raw_id,
                    'post_parent' => $raw_parent_id
                ));
                break;

            case 'category':
                // カテゴリーの親を更新
                $result = wp_update_term($raw_id, 'category', array(
                    'parent' => $raw_parent_id
                ));
                break;

            case 'post':
                // 投稿のカテゴリーを変更
                // 既存のカテゴリーを削除して新しいカテゴリーを設定
                $result = wp_set_post_categories($raw_id, array($raw_parent_id));
                break;
        }

        if (is_wp_error($result)) {
            $errors[] = $node_id . ': ' . $result->get_error_message();
        } elseif ($result === false) {
            $errors[] = $node_id . ': 更新に失敗しました';
        } else {
            $success_count++;
        }
    }

    if (!empty($errors)) {
        wp_send_json_error(implode(', ', $errors));
    }

    wp_send_json_success(array(
        'message' => $success_count . '件の変更を保存しました',
        'count' => $success_count
    ));
}

// Ajax: ノード詳細を更新（タイトル、スラッグ、ステータス）
add_action('wp_ajax_lw_update_node_details', 'lw_ajax_update_node_details');
function lw_ajax_update_node_details() {
    check_ajax_referer('lw_page_tree_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $node_id = sanitize_text_field($_POST['node_id']);
    $node_type = sanitize_text_field($_POST['node_type']);
    $title = sanitize_text_field($_POST['title']);
    $slug = sanitize_title($_POST['slug']);
    $status = sanitize_text_field($_POST['status']);

    // IDから数値を取り出す
    $raw_id = intval(preg_replace('/^(page|cat|post)-/', '', $node_id));

    if (!$raw_id) {
        wp_send_json_error('無効なIDです');
    }

    $result = false;

    switch ($node_type) {
        case 'page':
        case 'post':
            // 固定ページ・投稿の更新
            $result = wp_update_post(array(
                'ID' => $raw_id,
                'post_title' => $title,
                'post_name' => $slug,
                'post_status' => $status
            ));
            break;

        case 'category':
            // カテゴリーの更新（ステータスは適用されない）
            $result = wp_update_term($raw_id, 'category', array(
                'name' => $title,
                'slug' => $slug
            ));
            break;
    }

    if (is_wp_error($result)) {
        wp_send_json_error($result->get_error_message());
    }

    if ($result === false || $result === 0) {
        wp_send_json_error('更新に失敗しました');
    }

    wp_send_json_success(array(
        'message' => '保存しました',
        'node_id' => $node_id
    ));
}

// Ajax: サイト構造データを取得（固定ページ + カテゴリー + 投稿）
add_action('wp_ajax_lw_get_site_structure', 'lw_ajax_get_site_structure');
function lw_ajax_get_site_structure() {
    check_ajax_referer('lw_page_tree_nonce', 'nonce');

    $front_page_id = get_option('page_on_front');
    $posts_page_id = get_option('page_for_posts');

    // 固定ページを取得
    $all_pages = get_posts(array(
        'post_type' => 'page',
        'post_status' => array('publish', 'draft', 'private', 'pending'),
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC'
    ));

    $pages_data = array();
    foreach ($all_pages as $page) {
        $pages_data[] = array(
            'id' => 'page-' . $page->ID,
            'raw_id' => $page->ID,
            'title' => $page->post_title ?: '(タイトルなし)',
            'slug' => $page->post_name,
            'status' => $page->post_status,
            'parent_id' => $page->post_parent ? 'page-' . $page->post_parent : '',
            'type' => 'page',
            'edit_url' => get_edit_post_link($page->ID, 'raw'),
            'is_front' => ($page->ID == $front_page_id),
            'is_posts_page' => ($page->ID == $posts_page_id)
        );
    }

    // カテゴリーを取得
    $categories = get_categories(array(
        'hide_empty' => false,
        'orderby' => 'name',
        'order' => 'ASC'
    ));

    $categories_data = array();
    foreach ($categories as $cat) {
        $categories_data[] = array(
            'id' => 'cat-' . $cat->term_id,
            'raw_id' => $cat->term_id,
            'title' => $cat->name,
            'slug' => $cat->slug,
            'status' => 'publish',
            'parent_id' => $cat->parent ? 'cat-' . $cat->parent : '',
            'type' => 'category',
            'edit_url' => get_edit_term_link($cat->term_id, 'category'),
            'post_count' => $cat->count
        );
    }

    // 投稿を取得
    $all_posts = get_posts(array(
        'post_type' => 'post',
        'post_status' => array('publish', 'draft', 'private', 'pending'),
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC'
    ));

    $posts_data = array();
    foreach ($all_posts as $post) {
        // 投稿のカテゴリーを取得（最初のカテゴリーを親とする）
        $post_cats = wp_get_post_categories($post->ID);
        $parent_cat_id = !empty($post_cats) ? 'cat-' . $post_cats[0] : '';

        $posts_data[] = array(
            'id' => 'post-' . $post->ID,
            'raw_id' => $post->ID,
            'title' => $post->post_title ?: '(タイトルなし)',
            'slug' => $post->post_name,
            'status' => $post->post_status,
            'parent_id' => $parent_cat_id,
            'type' => 'post',
            'edit_url' => get_edit_post_link($post->ID, 'raw'),
            'categories' => $post_cats
        );
    }

    // show_on_front が 'page' かつ page_on_front が設定されているかチェック
    $show_on_front = get_option('show_on_front');
    $has_front_page = ($show_on_front === 'page' && $front_page_id > 0);

    wp_send_json_success(array(
        'pages' => $pages_data,
        'categories' => $categories_data,
        'posts' => $posts_data,
        'front_page_id' => $front_page_id ? 'page-' . $front_page_id : '',
        'posts_page_id' => $posts_page_id ? 'page-' . $posts_page_id : '',
        'has_front_page' => $has_front_page,
        'totals' => array(
            'pages' => count($pages_data),
            'categories' => count($categories_data),
            'posts' => count($posts_data)
        )
    ));
}

