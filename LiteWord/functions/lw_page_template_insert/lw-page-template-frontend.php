<?php
/**
 * LiteWord ページテンプレート挿入 - フロント用
 * REST API機能
 */

if (!defined('ABSPATH')) exit;

/**
 * プレビューモード時にinitフックでプレミアムブロックを登録
 * ブロック登録はinitで行われるため、それより前に検出が必要
 */
add_action('init', 'lw_maybe_register_premium_blocks_for_preview', 5);
function lw_maybe_register_premium_blocks_for_preview() {
    // プレビューモードかチェック
    if (!isset($_GET['lw_template_preview']) || $_GET['lw_template_preview'] !== '1') {
        return;
    }

    // プレビュー用のグローバルフラグを設定
    global $lw_is_template_preview;
    $lw_is_template_preview = true;

    // 管理バーを非表示
    add_filter('show_admin_bar', '__return_false');

    // プレミアムブロックを登録
    lw_register_premium_blocks_for_preview();
}

/**
 * プレビュー用：プレミアムブロックを一時的に登録
 * wdl_get_all_premium_paid_blocks() を使用
 */
function lw_register_premium_blocks_for_preview() {
    // 既存の関数からプレミアムブロック一覧を取得
    if (!function_exists('wdl_get_all_premium_paid_blocks')) {
        return;
    }

    $premium_blocks = wdl_get_all_premium_paid_blocks();

    foreach ($premium_blocks as $block_name) {
        if (WP_Block_Type_Registry::get_instance()->is_registered("wdl/{$block_name}")) {
            continue;
        }

        $block_dir = "/my-blocks/build/{$block_name}/";
        $style_css_file = get_theme_file_path("{$block_dir}style.css");

        if (file_exists($style_css_file)) {
            wp_register_style(
                "wdl-{$block_name}-style",
                get_theme_file_uri("{$block_dir}style.css"),
                [],
                filemtime($style_css_file)
            );
        }

        register_block_type(
            "wdl/{$block_name}",
            [
                'style' => null,
                'render_callback' => function ($attributes, $content) use ($block_name, $style_css_file) {
                    static $loaded_styles = [];
                    if (file_exists($style_css_file) && !in_array($block_name, $loaded_styles, true)) {
                        wp_enqueue_style("wdl-{$block_name}-style");
                        $loaded_styles[] = $block_name;
                    }
                    return $content;
                },
            ]
        );
    }
}

add_action('rest_api_init', function() {
    register_rest_route('lw-template/v1', '/get-template', array(
        'methods' => 'POST',
        'callback' => 'lw_get_template_content',
        'permission_callback' => function() {
            return current_user_can('edit_pages');
        }
    ));

    register_rest_route('lw-template/v1', '/render-template', array(
        'methods' => 'POST',
        'callback' => 'lw_render_template_preview',
        'permission_callback' => function() {
            return current_user_can('edit_pages');
        }
    ));
});

/**
 * プレビュー用ページ（iframe srcで直接アクセス）
 */
add_action('template_redirect', 'lw_handle_template_preview_page');
function lw_handle_template_preview_page() {
    if (!isset($_GET['lw_template_preview']) || $_GET['lw_template_preview'] !== '1') {
        return;
    }

    if (!current_user_can('edit_pages')) {
        wp_die('権限がありません', 'エラー', array('response' => 403));
    }

    if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'lw_template_preview')) {
        wp_die('セキュリティチェックに失敗しました', 'エラー', array('response' => 403));
    }

    $template_path = isset($_GET['template_path']) ? sanitize_text_field($_GET['template_path']) : '';

    if (empty($template_path)) {
        wp_die('テンプレートパスが指定されていません', 'エラー', array('response' => 400));
    }

    $template_path = str_replace('..', '', $template_path);
    $file_path = get_template_directory() . '/' . $template_path;

    if (!file_exists($file_path)) {
        wp_die('テンプレートファイルが見つかりません', 'エラー', array('response' => 404));
    }

    $content = file_get_contents($file_path);

    if ($content === false) {
        wp_die('ファイルの読み込みに失敗しました', 'エラー', array('response' => 500));
    }

    // $lw_is_template_preview は init フックで既に設定済み

    $rendered_content = do_blocks($content);

    $page_content_shadow = function_exists('Lw_put_text') ? Lw_put_text("page_content_shadow", "off") : "off";
    $page_content_shadow = ($page_content_shadow === "on") ? "shadow" : "";

    $color_page_bg_pc_opacity = function_exists('Lw_put_text') ? Lw_put_text("color_page_bg_pc_opacity", "100") : "100";
    $lw_custom_css = function_exists('Lw_put_text') ? Lw_put_text("lw_custom_css", "") : "";
    $head_set_before = function_exists('Lw_theme_mod_set') ? Lw_theme_mod_set("head_set_before") : "";
    $head_set_after = function_exists('Lw_theme_mod_set') ? Lw_theme_mod_set("head_set_after") : "";

    ?>
<!DOCTYPE html>
<html lang="ja">
<head class="lw_head">
    <meta charset="UTF-8">
    <script>
        window.LW_HAS_SUBSCRIPTION = true;
        window.LW_IS_TEMPLATE_PREVIEW = true;
        window.MyThemeSettings = {
            home_Url: '<?php echo esc_js(home_url()); ?>',
            homeUrl: '<?php echo esc_js(home_url()); ?>',
            theme_Url: '<?php echo esc_js(get_template_directory_uri()); ?>',
            themeUrl: '<?php echo esc_js(get_template_directory_uri()); ?>',
            adminUrl: '<?php echo esc_js(admin_url()); ?>'
        };

        // プレビュー用サンプルデータ
        window.LW_SAMPLE_POSTS = [
            {
                title: { rendered: 'サンプル記事タイトル１' },
                date: new Date().toISOString(),
                link: '#',
                excerpt: { rendered: 'これはサンプルの記事です。実際の投稿がない場合にプレビュー用として表示されます。' },
                _embedded: {
                    'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/post1/800/600' }],
                    'wp:term': [[{ name: 'お知らせ' }]]
                }
            },
            {
                title: { rendered: 'サンプル記事タイトル２' },
                date: new Date(Date.now() - 86400000).toISOString(),
                link: '#',
                excerpt: { rendered: 'ブログ記事のサンプルテキストです。記事の概要がここに表示されます。' },
                _embedded: {
                    'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/post2/800/600' }],
                    'wp:term': [[{ name: 'ブログ' }]]
                }
            },
            {
                title: { rendered: 'サンプル記事タイトル３' },
                date: new Date(Date.now() - 172800000).toISOString(),
                link: '#',
                excerpt: { rendered: 'お客様に役立つ情報をお届けします。詳細はこちらからご覧ください。' },
                _embedded: {
                    'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/post3/800/600' }],
                    'wp:term': [[{ name: 'コラム' }]]
                }
            },
            {
                title: { rendered: 'サンプル記事タイトル４' },
                date: new Date(Date.now() - 259200000).toISOString(),
                link: '#',
                excerpt: { rendered: '新しいサービスのご案内です。皆様のご利用をお待ちしております。' },
                _embedded: {
                    'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/post4/800/600' }],
                    'wp:term': [[{ name: 'サービス' }]]
                }
            },
            {
                title: { rendered: 'サンプル記事タイトル５' },
                date: new Date(Date.now() - 345600000).toISOString(),
                link: '#',
                excerpt: { rendered: 'イベント開催のお知らせです。多くの方のご参加をお待ちしております。' },
                _embedded: {
                    'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/post5/800/600' }],
                    'wp:term': [[{ name: 'イベント' }]]
                }
            },
            {
                title: { rendered: 'サンプル記事タイトル６' },
                date: new Date(Date.now() - 432000000).toISOString(),
                link: '#',
                excerpt: { rendered: '最新のニュースをお届けします。今後ともよろしくお願いいたします。' },
                _embedded: {
                    'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/post6/800/600' }],
                    'wp:term': [[{ name: 'ニュース' }]]
                }
            }
        ];

        // fetch をオーバーライドしてサンプルデータを即座に返す（API呼び出しをスキップ）
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            // REST API の投稿取得リクエストをインターセプト
            if (typeof url === 'string' && url.includes('/wp-json/wp/v2/posts')) {
                const perPageMatch = url.match(/per_page=(\d+)/);
                const perPage = perPageMatch ? parseInt(perPageMatch[1]) : 6;
                const sampleData = window.LW_SAMPLE_POSTS.slice(0, perPage);
                // 即座にサンプルデータを返す（API呼び出しなし）
                return Promise.resolve(new Response(JSON.stringify(sampleData), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            return originalFetch(url, options);
        };
    </script>
    <?php echo $head_set_before; ?>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php
    $blocks_dir = get_template_directory() . '/my-blocks/build';
    if (is_dir($blocks_dir)) {
        $block_dirs = glob($blocks_dir . '/*', GLOB_ONLYDIR);
        foreach ($block_dirs as $block_dir) {
            $block_name = basename($block_dir);
            $style_css_file = $block_dir . '/style.css';
            if (file_exists($style_css_file)) {
                $css_url = get_template_directory_uri() . "/my-blocks/build/{$block_name}/style.css";
                $version = filemtime($style_css_file);
                echo '<link rel="stylesheet" href="' . esc_url($css_url) . '?ver=' . $version . '">' . "\n";
            }
        }
    }
    ?>

    <?php wp_head(); ?>
    <?php echo $head_set_after; ?>
    <style>
        body:after{
            opacity: <?php echo esc_attr($color_page_bg_pc_opacity); ?>%;
        }
        <?php if (!empty($lw_custom_css)) { echo $lw_custom_css; } ?>
    </style>
</head>
<body <?php body_class('w-admin page lw-template-preview'); ?> id="body">
    <?php wp_body_open(); ?>

    <main>
        <div class="lw_content_wrap page">
            <div class="main_content">
                <section class="post_content">
                    <div class="post_style page <?php echo esc_attr($page_content_shadow); ?>">
                        <div class="first_content"></div>
                        <?php echo $rendered_content; ?>
                        <div class="last_content"></div>
                    </div>
                </section>
            </div>
        </div>
    </main>

    <?php get_template_part('templates/page_bg_image/index'); ?>

    <?php wp_footer(); ?>
</body>
</html>
    <?php
    exit;
}

function lw_get_template_content($request) {
    $template_path = $request->get_param('template_path');
    
    if (empty($template_path)) {
        return new WP_Error('missing_path', 'テンプレートパスが指定されていません', array('status' => 400));
    }
    
    $template_path = str_replace('..', '', $template_path);
    $file_path = get_template_directory() . '/' . $template_path;
    
    if (!file_exists($file_path)) {
        return new WP_Error('not_found', 'テンプレートファイルが見つかりません', array('status' => 404));
    }
    
    $content = file_get_contents($file_path);
    
    if ($content === false) {
        return new WP_Error('read_error', 'ファイルの読み込みに失敗しました', array('status' => 500));
    }
    
    $auto_recovery_script = '
<!-- wp:html -->
<script class="lw-auto-recovery-script">
(function() {
    setTimeout(function() {
        var recoverButtons = document.querySelectorAll(".block-editor-warning__action button");
        recoverButtons.forEach(function(button) {
            if (button.textContent.includes("復旧") || 
                button.textContent.includes("ブロックの復旧") ||
                button.textContent.includes("Attempt Block Recovery")) {
                button.click();
                console.log("ブロックを自動復旧しました");
            }
        });
        
        var selfScript = document.querySelector(".lw-auto-recovery-script");
        if (selfScript && selfScript.parentElement) {
            var blockId = selfScript.closest("[data-block]");
            if (blockId) {
                var clientId = blockId.getAttribute("data-block");
                if (wp && wp.data && clientId) {
                    wp.data.dispatch("core/block-editor").removeBlock(clientId);
                }
            }
        }
    }, 500);
})();
</script>
<!-- /wp:html -->';
    
    $content = $content . "\n\n" . $auto_recovery_script;
    
    return array(
        'success' => true,
        'content' => $content
    );
}

/**
 * テンプレートをレンダリングしてHTMLとして返す（プレビュー用）
 */
function lw_render_template_preview($request) {
    $template_path = $request->get_param('template_path');
    
    if (empty($template_path)) {
        return new WP_Error('missing_path', 'テンプレートパスが指定されていません', array('status' => 400));
    }
    
    $template_path = str_replace('..', '', $template_path);
    $file_path = get_template_directory() . '/' . $template_path;
    
    if (!file_exists($file_path)) {
        return new WP_Error('not_found', 'テンプレートファイルが見つかりません', array('status' => 404));
    }
    
    $content = file_get_contents($file_path);
    
    if ($content === false) {
        return new WP_Error('read_error', 'ファイルの読み込みに失敗しました', array('status' => 500));
    }
    
    global $lw_is_template_preview;
    $lw_is_template_preview = true;
    
    $rendered_content = do_blocks($content);
    
    $page_content_shadow = function_exists('Lw_put_text') ? Lw_put_text("page_content_shadow", "off") : "off";
    $page_content_shadow = ($page_content_shadow === "on") ? "shadow" : "";
    
    $color_page_bg_pc_opacity = function_exists('Lw_put_text') ? Lw_put_text("color_page_bg_pc_opacity", "100") : "100";
    $lw_custom_css = function_exists('Lw_put_text') ? Lw_put_text("lw_custom_css", "") : "";
    $head_set_before = function_exists('Lw_theme_mod_set') ? Lw_theme_mod_set("head_set_before") : "";
    $head_set_after = function_exists('Lw_theme_mod_set') ? Lw_theme_mod_set("head_set_after") : "";
    
    add_filter('wp_enqueue_scripts', function() {
        wp_dequeue_script('lw-analytics-tracker');
        wp_deregister_script('lw-analytics-tracker');
    }, 999);
    
    ob_start();
    ?>
<!DOCTYPE html>
<html lang="ja">
<head class="lw_head">
    <meta charset="UTF-8">
    <?php echo $head_set_before; ?>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <?php
    // すべてのブロックCSSを読み込み
    $blocks_dir = get_template_directory() . '/my-blocks/build';
    if (is_dir($blocks_dir)) {
        $block_dirs = glob($blocks_dir . '/*', GLOB_ONLYDIR);
        
        foreach ($block_dirs as $block_dir) {
            $block_name = basename($block_dir);
            $style_css_file = $block_dir . '/style.css';
            
            if (file_exists($style_css_file)) {
                $css_url = get_template_directory_uri() . "/my-blocks/build/{$block_name}/style.css";
                $version = filemtime($style_css_file);
                echo '<link rel="stylesheet" href="' . esc_url($css_url) . '?ver=' . $version . '">' . "\n";
            }
        }
    }
    ?>
    
    <?php wp_head(); ?>
    <?php echo $head_set_after; ?>
    <style>
        body:after{
            opacity: <?php echo esc_attr($color_page_bg_pc_opacity); ?>%;
        }
        <?php if (!empty($lw_custom_css)) { echo $lw_custom_css; } ?>
    </style>
</head>
<body <?php body_class('w-admin page'); ?> id="body">
    <?php wp_body_open(); ?>
    
    <main>
        <div class="lw_content_wrap page">
            <div class="main_content">
                <section class="post_content">
                    <div class="post_style page <?php echo esc_attr($page_content_shadow); ?>">
                        <div class="first_content"></div>
                        <?php echo $rendered_content; ?>
                        <div class="last_content"></div>
                    </div>
                </section>
            </div>
        </div>
    </main>
    
    <?php if ( is_active_sidebar( 'page_bottom' ) ) : ?>
        <aside class="page_bottom">
            <?php dynamic_sidebar( 'page_bottom' ); ?>
        </aside>
    <?php endif; ?>
    
    <?php get_template_part('templates/page_bg_image/index'); ?>
    
    <?php wp_footer(); ?>
</body>
</html>
    <?php
    
    $html = ob_get_clean();
    
    $lw_is_template_preview = false;
    
    return array(
        'success' => true,
        'html' => $html
    );
}