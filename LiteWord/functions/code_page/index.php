<?php
if (!defined('ABSPATH')) exit;

// プラグイン版が有効な場合はテーマ版を無効化
if (defined('LWCP_PLUGIN_ACTIVE')) {
    return;
}

get_template_part('./functions/code_page/limitation');

/* ==========================================================
 * コード専用ページ（lw_code_page）
 * - テーマのCSS/JSを一切読み込まない完全独立ページ
 * - HTML/CSS/JavaScriptを直接記述可能
 * - URL構造: home_url()/slug/
 * ======================================================= */

/* ==========================================================
 * 1. カスタム投稿タイプの登録
 * ======================================================= */
add_action('init', 'lw_register_code_page_post_type');
function lw_register_code_page_post_type() {
    $labels = array(
        'name'               => 'コード専用ページ',
        'singular_name'      => 'コード専用ページ',
        'menu_name'          => 'コード専用ページ',
        'add_new'            => '新規追加',
        'add_new_item'       => '新規コード専用ページを追加',
        'edit_item'          => 'コード専用ページを編集',
        'new_item'           => '新規コード専用ページ',
        'view_item'          => 'コード専用ページを表示',
        'search_items'       => 'コード専用ページを検索',
        'not_found'          => 'コード専用ページが見つかりません',
        'not_found_in_trash' => 'ゴミ箱にコード専用ページはありません',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => false, // 独自のparse_requestで処理
        'capability_type'    => 'page',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 20,
        'menu_icon'          => 'dashicons-editor-code',
        'supports'           => array('title'),
        'show_in_rest'       => false, // Gutenbergを無効化
    );

    register_post_type('lw_code_page', $args);
}

/* ==========================================================
 * 2. パーマリンク構造の設定（固定ページと同じ /slug/ 形式）
 * ======================================================= */
add_filter('post_type_link', 'lw_code_page_permalink', 10, 2);
function lw_code_page_permalink($permalink, $post) {
    if ($post->post_type !== 'lw_code_page') {
        return $permalink;
    }
    return home_url('/' . $post->post_name . '/');
}


/* ==========================================================
 * 3. メタボックス（HTML/CSS/JavaScript入力欄）
 * ======================================================= */
add_action('add_meta_boxes', 'lw_code_page_add_meta_boxes');
function lw_code_page_add_meta_boxes() {
    add_meta_box(
        'lw_code_page_editor',
        '📝 コードエディタ',
        'lw_code_page_render_editor',
        'lw_code_page',
        'normal',
        'high'
    );

    // スラッグ編集用メタボックス
    add_meta_box(
        'lw_code_page_slug',
        '🔗 URL（スラッグ）',
        'lw_code_page_render_slug_editor',
        'lw_code_page',
        'side',
        'high'
    );
}

// スラッグ編集メタボックスの表示
function lw_code_page_render_slug_editor($post) {
    $slug = $post->post_name;
    $home_url = home_url('/');
    $full_url = home_url('/' . $slug . '/');
    ?>
    <div class="lw-slug-editor">
        <div class="lw-slug-preview">
            <span class="lw-slug-base"><?php echo esc_html($home_url); ?></span><strong class="lw-slug-value"><?php echo esc_html($slug); ?></strong><span>/</span>
        </div>
        <div class="lw-slug-input-wrap">
            <input type="text" id="lw_code_page_slug" name="lw_code_page_slug" value="<?php echo esc_attr($slug); ?>" class="lw-slug-input" placeholder="スラッグを入力">
        </div>
        <?php if ($post->post_status === 'publish' || $post->post_status === 'draft') : ?>
        <div class="lw-slug-actions">
            <a href="<?php echo esc_url($full_url); ?>" target="_blank" class="button button-small">
                <span class="dashicons dashicons-external" style="font-size: 14px; line-height: 1.8;"></span> 表示
            </a>
        </div>
        <?php endif; ?>
    </div>
    <style>
    .lw-slug-editor {
        margin: -6px -12px -12px -12px;
        padding: 12px;
    }
    .lw-slug-preview {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
        word-break: break-all;
        background: #f6f7f7;
        padding: 8px 10px;
        border-radius: 4px;
    }
    .lw-slug-base {
        color: #999;
    }
    .lw-slug-value {
        color: #0073aa;
    }
    .lw-slug-input-wrap {
        margin-bottom: 10px;
    }
    .lw-slug-input {
        width: 100%;
        padding: 8px 10px;
        font-size: 14px;
    }
    .lw-slug-actions {
        text-align: right;
    }
    .lw-slug-actions .dashicons {
        vertical-align: middle;
    }
    </style>
    <script>
    jQuery(document).ready(function($) {
        // スラッグ入力時にプレビューを更新
        $('#lw_code_page_slug').on('input', function() {
            var slug = $(this).val().trim();
            $('.lw-slug-value').text(slug || 'slug');
        });
    });
    </script>
    <?php
}

function lw_code_page_render_editor($post) {
    wp_nonce_field('lw_code_page_save', 'lw_code_page_nonce');

    $html_content = get_post_meta($post->ID, '_lw_code_page_html', true);
    $css_content  = get_post_meta($post->ID, '_lw_code_page_css', true);
    ?>
    <div class="lw-code-page-editor-wrap">
        <!-- タブナビゲーション -->
        <div class="lw-code-tabs">
            <button type="button" class="lw-code-tab active" data-tab="html">HTML</button>
            <button type="button" class="lw-code-tab" data-tab="css">CSS</button>
        </div>

        <!-- HTML エディタ -->
        <div class="lw-code-panel active" data-panel="html">
            <div class="lw-code-panel-header">
                <span>📄 HTML（DOCTYPE から全て記述）</span>
            </div>
            <textarea id="lw_code_page_html" name="lw_code_page_html" rows="30"><?php echo esc_textarea($html_content); ?></textarea>
        </div>

        <!-- CSS エディタ -->
        <div class="lw-code-panel" data-panel="css">
            <div class="lw-code-panel-header">
                <span>🎨 CSS（自動的に &lt;style&gt; タグで囲まれます）</span>
            </div>
            <textarea id="lw_code_page_css" name="lw_code_page_css" rows="30"><?php echo esc_textarea($css_content); ?></textarea>
        </div>

        <div class="lw-code-info">
            <strong>💡 出力について</strong><br>
            ・HTMLはそのまま出力されます（DOCTYPE, html, head, body を全て記述してください）<br>
            ・CSSは <code>&lt;/head&gt;</code> の直前に <code>&lt;style&gt;</code> タグとして挿入されます
        </div>
    </div>

    <style>
    .lw-code-page-editor-wrap {
        margin: -6px -12px -12px -12px;
    }
    .lw-code-tabs {
        display: flex;
        background: #f0f0f1;
        border-bottom: 1px solid #c3c4c7;
        padding: 0 10px;
    }
    .lw-code-tab {
        padding: 12px 20px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #50575e;
        border-bottom: 3px solid transparent;
        margin-bottom: -1px;
        transition: all 0.2s;
    }
    .lw-code-tab:hover {
        color: #0073aa;
    }
    .lw-code-tab.active {
        color: #0073aa;
        border-bottom-color: #0073aa;
        background: #fff;
    }
    .lw-code-panel {
        display: none;
        padding: 0;
    }
    .lw-code-panel.active {
        display: block;
    }
    .lw-code-panel-header {
        padding: 10px 15px;
        background: #f6f7f7;
        border-bottom: 1px solid #ddd;
        font-size: 13px;
        color: #50575e;
    }
    .lw-code-panel textarea {
        width: 100%;
        min-height: 500px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.6;
        padding: 15px;
        border: none;
        border-radius: 0;
        resize: vertical;
        tab-size: 4;
    }
    .lw-code-info {
        padding: 15px;
        background: #f0f6fc;
        border-top: 1px solid #c3c4c7;
        font-size: 13px;
        line-height: 1.8;
    }
    .lw-code-info code {
        background: #e5e5e5;
        padding: 2px 6px;
        border-radius: 3px;
    }
    /* CodeMirror調整 */
    .lw-code-panel .CodeMirror {
        height: 500px;
        border: none;
        font-size: 14px;
    }
    </style>

    <script>
    jQuery(document).ready(function($) {
        // タブ切り替え
        $('.lw-code-tab').on('click', function() {
            var tab = $(this).data('tab');

            $('.lw-code-tab').removeClass('active');
            $(this).addClass('active');

            $('.lw-code-panel').removeClass('active');
            $('.lw-code-panel[data-panel="' + tab + '"]').addClass('active');

            // CodeMirrorのリフレッシュ
            if (window.lwCodeEditors && window.lwCodeEditors[tab]) {
                setTimeout(function() {
                    window.lwCodeEditors[tab].refresh();
                }, 10);
            }
        });

        // CodeMirror初期化
        window.lwCodeEditors = {};

        if (typeof wp.codeEditor !== 'undefined') {
            // HTML
            var htmlEditor = wp.codeEditor.initialize($('#lw_code_page_html'), {
                codemirror: {
                    mode: 'htmlmixed',
                    lineNumbers: true,
                    lineWrapping: false,
                    indentUnit: 4,
                    tabSize: 4,
                    indentWithTabs: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    autoCloseTags: true,
                    styleActiveLine: true,
                    lint: false,
                    gutters: ['CodeMirror-linenumbers']
                }
            });
            if (htmlEditor) {
                window.lwCodeEditors.html = htmlEditor.codemirror;
            }

            // CSS
            var cssEditor = wp.codeEditor.initialize($('#lw_code_page_css'), {
                codemirror: {
                    mode: 'css',
                    lineNumbers: true,
                    lineWrapping: false,
                    indentUnit: 4,
                    tabSize: 4,
                    indentWithTabs: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    styleActiveLine: true,
                    lint: false,
                    gutters: ['CodeMirror-linenumbers']
                }
            });
            if (cssEditor) {
                window.lwCodeEditors.css = cssEditor.codemirror;
            }
        }
    });
    </script>
    <?php
}

/* ==========================================================
 * 4. メタデータの保存
 * ======================================================= */
add_action('save_post_lw_code_page', 'lw_code_page_save_meta');
function lw_code_page_save_meta($post_id) {
    // nonceチェック
    if (!isset($_POST['lw_code_page_nonce']) || !wp_verify_nonce($_POST['lw_code_page_nonce'], 'lw_code_page_save')) {
        return;
    }

    // 自動保存はスキップ
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // 権限チェック
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // HTML（サニタイズなし - 完全なHTMLを許可）
    if (isset($_POST['lw_code_page_html'])) {
        update_post_meta($post_id, '_lw_code_page_html', wp_unslash($_POST['lw_code_page_html']));
    }

    // CSS
    if (isset($_POST['lw_code_page_css'])) {
        update_post_meta($post_id, '_lw_code_page_css', wp_unslash($_POST['lw_code_page_css']));
    }

    // スラッグの保存
    if (isset($_POST['lw_code_page_slug']) && !empty($_POST['lw_code_page_slug'])) {
        $new_slug = sanitize_title($_POST['lw_code_page_slug']);
        $post = get_post($post_id);

        if ($post && $new_slug !== $post->post_name) {
            // 重複チェック
            $new_slug = wp_unique_post_slug($new_slug, $post_id, $post->post_status, 'lw_code_page', 0);

            // 無限ループ防止のためフックを一時的に削除
            remove_action('save_post_lw_code_page', 'lw_code_page_save_meta');

            wp_update_post(array(
                'ID' => $post_id,
                'post_name' => $new_slug
            ));

            // フックを再追加
            add_action('save_post_lw_code_page', 'lw_code_page_save_meta');
        }
    }
}

/* ==========================================================
 * 5. CodeMirrorアセットの読み込み
 * ======================================================= */
add_action('admin_enqueue_scripts', 'lw_code_page_enqueue_assets');
function lw_code_page_enqueue_assets($hook) {
    global $post_type;

    if ($post_type !== 'lw_code_page') {
        return;
    }

    if (!in_array($hook, array('post.php', 'post-new.php'))) {
        return;
    }

    // CodeMirror
    wp_enqueue_code_editor(array('type' => 'text/html'));
    wp_enqueue_code_editor(array('type' => 'text/css'));

    wp_enqueue_style('wp-codemirror');
    wp_enqueue_script('wp-codemirror');
}

/* ==========================================================
 * 6. フロントエンド出力（テーマを完全にバイパス）
 * ======================================================= */
add_action('wp', 'lw_code_page_output', 1);
function lw_code_page_output() {
    // 静的フラグで重複実行を防止
    static $already_run = false;
    if ($already_run) {
        return;
    }

    // 管理画面では実行しない
    if (is_admin()) {
        return;
    }

    $post_id = null;

    // プレビュー処理（preview_id または p パラメータ）
    if (isset($_GET['preview'])) {
        $preview_id = isset($_GET['preview_id']) ? intval($_GET['preview_id']) : (isset($_GET['p']) ? intval($_GET['p']) : 0);
        if ($preview_id) {
            $preview_post = get_post($preview_id);
            if ($preview_post && $preview_post->post_type === 'lw_code_page' && current_user_can('edit_post', $preview_id)) {
                $post_id = $preview_id;
            }
        }
    }

    // 通常の表示
    if (!$post_id) {
        // URLからスラッグを取得して判定
        $request_uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

        // サブディレクトリインストールの場合を考慮
        $home_path = trim(parse_url(home_url(), PHP_URL_PATH) ?? '', '/');
        if (!empty($home_path) && strpos($request_uri, $home_path) === 0) {
            $request_uri = trim(substr($request_uri, strlen($home_path)), '/');
        }

        // スラッシュが含まれる場合は階層ページなのでスキップ
        if (strpos($request_uri, '/') === false && !empty($request_uri)) {
            $found_post = get_page_by_path($request_uri, OBJECT, 'lw_code_page');
            if ($found_post && $found_post->post_type === 'lw_code_page') {
                // 公開済み、または編集権限がある場合
                if ($found_post->post_status === 'publish' || current_user_can('edit_post', $found_post->ID)) {
                    $post_id = $found_post->ID;
                }
            }
        }
    }

    // 出力
    if ($post_id) {
        $already_run = true;
        lw_code_page_render_output($post_id);
    }
}

// 出力処理を関数に分離
function lw_code_page_render_output($post_id) {
    // 出力バッファを全てクリア
    while (ob_get_level()) {
        ob_end_clean();
    }

    $html_content = get_post_meta($post_id, '_lw_code_page_html', true);
    $css_content  = get_post_meta($post_id, '_lw_code_page_css', true);

    // </head> の直前に挿入するコンテンツを準備
    $head_insert = '';

    // WordPressのnoindex設定を反映（blog_public が 0 の場合）
    if (get_option('blog_public') == '0') {
        $head_insert .= '<meta name="robots" content="noindex, nofollow">' . "\n";
    }

    // CSSを追加
    if (!empty($css_content)) {
        $head_insert .= "<style>\n" . $css_content . "\n</style>\n";
    }

    // </head> の直前に挿入
    if (!empty($head_insert)) {
        $pos = stripos($html_content, '</head>');
        if ($pos !== false) {
            $html_content = substr($html_content, 0, $pos) . $head_insert . substr($html_content, $pos);
        }
    }

    // テーマを完全にバイパスして出力
    echo $html_content;
    die();
}

/* ==========================================================
 * 7. 固定ページとのスラッグ重複を防ぐ
 * ======================================================= */
add_filter('wp_unique_post_slug', 'lw_code_page_unique_slug', 10, 6);
function lw_code_page_unique_slug($slug, $post_ID, $post_status, $post_type, $post_parent, $original_slug) {
    if ($post_type !== 'lw_code_page') {
        return $slug;
    }

    // 固定ページと同じスラッグがあるかチェック
    $page = get_page_by_path($slug);
    if ($page) {
        $slug = $slug . '-code';
    }

    return $slug;
}

/* ==========================================================
 * 8. 投稿一覧にスラッグ列を追加
 * ======================================================= */
add_filter('manage_lw_code_page_posts_columns', 'lw_code_page_columns');
function lw_code_page_columns($columns) {
    $new_columns = array();
    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;
        if ($key === 'title') {
            $new_columns['slug'] = 'スラッグ';
            $new_columns['url'] = 'URL';
        }
    }
    return $new_columns;
}

add_action('manage_lw_code_page_posts_custom_column', 'lw_code_page_column_content', 10, 2);
function lw_code_page_column_content($column, $post_id) {
    $post = get_post($post_id);

    if ($column === 'slug') {
        echo '<code>' . esc_html($post->post_name) . '</code>';
    }

    if ($column === 'url') {
        $url = home_url('/' . $post->post_name . '/');
        echo '<a href="' . esc_url($url) . '" target="_blank">' . esc_html($url) . '</a>';
    }
}
