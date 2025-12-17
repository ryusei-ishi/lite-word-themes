<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* -------------------------------------------------
 * ダッシュボード以外では不要
 * ------------------------------------------------- */
if ( ! is_admin() ) {
    return;
}

/* =================================================
 * 管理画面共通（エディタ以外）の CSS / JS
 * ================================================= */
function add_admin_style() {

    /* ---------- JS ---------- */
    wp_enqueue_script(
        'admin_js',
        get_template_directory_uri() . '/assets/js/admin.js',
        [],
        css_version(),
        true
    );

    /* ---------- CSS ---------- */
    wp_enqueue_style(
        '_css',
        get_template_directory_uri() . '/assets/css/admin.min.css',
        [],
        css_version()
    );

    /* CSS 変数をインラインで追加 */
    wp_add_inline_style( '_css', lw_generate_css_variables() );
}
add_action( 'admin_enqueue_scripts', 'add_admin_style' );

/* =================================================
 * Gutenberg エディタ専用の CSS / JS
 * ================================================= */
function enqueue_block_editor_assets() {

    /* ---------- JS ---------- */
    wp_enqueue_script(
        'font-js',
        get_template_directory_uri() . '/assets/js/font.js',
        [],
        css_version(),
        true
    );
    wp_enqueue_script(
        'font_cdn_js',
        get_template_directory_uri() . '/assets/js/font_cdn.js',
        [],
        css_version(),
        true
    );
    wp_enqueue_script(
        'font_set_js',
        get_template_directory_uri() . '/assets/js/font_set.js',
        ['wp-dom-ready'],
        css_version()
    );
    wp_enqueue_script(
        'disable-spacer-block',
        get_template_directory_uri() . '/assets/js/disable-spacer-block.js',
        ['wp-blocks', 'wp-dom-ready'],
        css_version(),
        true
    );
     wp_enqueue_script(
        'liteword-image-radius',
        get_template_directory_uri() . '/assets/js/image-radius-control.js',
        ['wp-data', 'wp-blocks', 'wp-dom-ready', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-hooks'],
        css_version(),
        true
    );
    /* ---------- CSS ---------- */
    wp_enqueue_style(
        'swiper_css',
        get_template_directory_uri() . '/assets/css/swiper.css',
        [],
        css_version(),
        'all'
    );
    wp_enqueue_style(
        'style_font',
        get_template_directory_uri() . '/assets/css/font_style.min.css',
        [],
        css_version(),
        'all'
    );
    wp_enqueue_style(
        'register_block',
        get_template_directory_uri() . '/assets/css/register_block.min.css',
        [],
        css_version(),
        'all'
    );
    /* CSS 変数をGutenbergエディタに適用 */
    wp_add_inline_style( 'register_block', lw_generate_css_variables() );
    //ブロックのスタイル用のjsの読み込み
    wp_enqueue_script(
        'block_style_js',
        get_template_directory_uri() . '/assets/js/block_style.js',
        ['wp-data', 'wp-blocks', 'wp-dom-ready', 'wp-hooks', 'wp-block-editor'],
        css_version(),
        true
    );
    // block_style.js にブロックCSSのURLパターンを渡す    wp_localize_script( 'block_style_js', 'MyThemeSettings', array(        'themeUrl' => get_template_directory_uri(),    ) );
     wp_enqueue_script(
        'block_check_js',
        get_template_directory_uri() . '/assets/js/block_check.js',
        ['wp-data', 'wp-blocks', 'wp-dom-ready'],
        css_version(),
        true
    );
}
add_action( 'enqueue_block_editor_assets', 'enqueue_block_editor_assets' );

/* =================================================
 * ブロック自動復旧スクリプト
 * 親フレームからiframe内の復旧ボタンを監視してクリック
 * ================================================= */
function lw_enqueue_block_auto_recovery() {
    // 管理画面の投稿編集画面でのみ実行
    global $pagenow;
    if ( ! is_admin() || ! in_array( $pagenow, [ 'post.php', 'post-new.php' ] ) ) {
        return;
    }

    $auto_recovery_script = "
(function() {
    if (typeof wp === 'undefined') return;

    function clickRecoveryButtons(doc) {
        var buttons = doc.querySelectorAll('button.is-primary');
        buttons.forEach(function(btn) {
            var text = btn.textContent || '';
            if ((text.indexOf('復旧') !== -1 || text.indexOf('Attempt') !== -1) && !btn.dataset.lwClicked) {
                btn.dataset.lwClicked = '1';
                btn.click();
                console.log('LiteWord: ブロックを自動復旧しました');
            }
        });
    }

    function setupObserver(doc) {
        var observer = new MutationObserver(function() {
            clickRecoveryButtons(doc);
        });
        observer.observe(doc.body, { childList: true, subtree: true });
        // 初回チェック
        clickRecoveryButtons(doc);
    }

    function checkIframe() {
        var iframe = document.querySelector('iframe[name=\"editor-canvas\"]');
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
            if (!iframe.dataset.lwObserving) {
                iframe.dataset.lwObserving = '1';
                setupObserver(iframe.contentDocument);
            }
        }
        // 親ドキュメントも監視（iframe無しの場合）
        if (!document.body.dataset.lwObserving) {
            document.body.dataset.lwObserving = '1';
            setupObserver(document);
        }
    }

    // 定期的にiframeをチェック
    setInterval(checkIframe, 500);

    // 初回実行
    if (document.readyState === 'complete') {
        checkIframe();
    } else {
        window.addEventListener('load', checkIframe);
    }
})();
";

    wp_add_inline_script( 'wp-edit-post', $auto_recovery_script );
}
add_action( 'enqueue_block_editor_assets', 'lw_enqueue_block_auto_recovery' );

/* =================================================
 * 編集画面（Gutenberg & クラシック）の追加読み込み
 * ================================================= */
function add_gutenberg_editor_scripts( $hook ) {

    /* post.php / post-new.php 以外では処理しない */
    if ( $hook !== 'post.php' && $hook !== 'post-new.php' ) {
        return;
    }

    /* ---------- 共通スタイル（Gutenberg & クラシック） ---------- */
    wp_enqueue_style(
        'editor_style',
        get_template_directory_uri() . '/assets/css/editor_style.min.css',
        [],
        css_version()
    );
    wp_enqueue_style(
        'editor_block_side',
        get_template_directory_uri() . '/assets/css/editor_block_side.min.css',
        [],
        css_version()
    );

    /* ---------- 各種スクリプト ---------- */
    wp_enqueue_script(
        'my-custom-paragraph-controls',
        get_template_directory_uri() . '/assets/js/custom-paragraph-controls.js',
        [ 'wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-hooks', 'wp-i18n' ],
        css_version(),
        true
    );

    wp_enqueue_script(
        'editor-pc-sp-toggle',
        get_template_directory_uri() . '/assets/js/editor-pc-sp-toggle.js',
        [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-compose', 'wp-data' ],
        css_version(),
        true
    );

    /* ---------- アニメーション関連 ---------- */
    $lw_animation_switch      = Lw_theme_mod_set( 'lw_extensions_animation_switch', 'off' );
    $lw_page_animation_switch = get_post_meta( get_the_ID(), 'lw_page_animation_switch', true );

    if ( ( $lw_animation_switch === 'on' && defined( 'LW_EXPANSION_BASE' ) && LW_EXPANSION_BASE ) || $lw_page_animation_switch === 'on' ) {

        wp_enqueue_script(
            'animation-controls',
            get_template_directory_uri() . '/assets/js/animation-controls.js',
            [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-compose', 'wp-data' ],
            css_version(),
            true
        );

        wp_enqueue_script(
            'custom-font-anime-select-script',
            get_template_directory_uri() . '/my-blocks/build/font-anime-select/font-anime-select.js',
            [ 'wp-rich-text', 'wp-block-editor', 'wp-element', 'wp-components' ],
            css_version(),
            true
        );
    }
    /* ---------- 期限設定 ---------- */
    if(LW_EXPANSION_BASE){
        //deadline_setting
        wp_enqueue_script(
            'custom-deadline-setting-script',
            get_template_directory_uri() . '/my-blocks/build/deadline-setting/deadline-setting.js',
            [ 'wp-rich-text', 'wp-block-editor', 'wp-element', 'wp-components' ],
            css_version(),
            true
        );
    }
    /* ---------- フォント／改行／余白調整など ---------- */
    wp_enqueue_script(
        'custom-font-weight-script',
        get_template_directory_uri() . '/my-blocks/build/font-select/font-select.js',
        [ 'wp-rich-text', 'wp-block-editor', 'wp-element', 'wp-components' ],
        css_version(),
        true
    );

    wp_enqueue_script(
        'custom-br-on-none-script',
        get_template_directory_uri() . '/my-blocks/build/br-on-none/br-on-none.js',
        [ 'wp-rich-text', 'wp-block-editor', 'wp-element', 'wp-components' ],
        css_version(),
        true
    );
    wp_enqueue_script(
        'block-background-controls',
        get_template_directory_uri() . '/assets/js/block-background-controls.js',
        [ 'wp-blocks', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-element' ],
        css_version(),
        true
    );
    wp_enqueue_script(
        'block-margin-controls',
        get_template_directory_uri() . '/assets/js/block-margin-controls.js',
        [ 'wp-blocks', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-element' ],
        css_version(),
        true
    );

    wp_enqueue_script(
        'block-padding-controls',
        get_template_directory_uri() . '/assets/js/block-padding-controls.js',
        [ 'wp-blocks', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-element' ],
        css_version(),
        true
    );

    wp_enqueue_script(
        'block-width-controls',
        get_template_directory_uri() . '/assets/js/block-width-controls.js',
        [ 'wp-blocks', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-element' ],
        css_version(),
        true
    );

    wp_enqueue_script(
        'block-radius-controls',
        get_template_directory_uri() . '/assets/js/block-radius-controls.js',
        [ 'wp-blocks', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-element' ],
        css_version(),
        true
    );
    wp_enqueue_script(
        'block-border-controls',
        get_template_directory_uri() . '/assets/js/block-border-controls.js',
        [ 'wp-blocks', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-element' ],
        css_version(),
        true
    );
    wp_enqueue_script(
        'block-scroll-controls',
        get_template_directory_uri() . '/assets/js/block-scroll-controls.js',
        [ 'wp-blocks', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-element' ],
        css_version(),
        true
    );
    wp_enqueue_script(
        'block-furigana',
        get_template_directory_uri() . '/assets/js/block_furigana.js',
        [ 'wp-rich-text', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-hooks' ],
        css_version(),
        true
    );
}
add_action( 'admin_enqueue_scripts', 'add_gutenberg_editor_scripts' );

/* =================================================
 * フリガナ（ルビ）変換フィルター
 * ================================================= */

/**
 * 保存時: data-rt属性を<rt>タグに変換
 */
function lw_convert_furigana_on_save( $content ) {
    // <ruby data-rt="xxx">text</ruby> を <ruby>text<rt>xxx</rt></ruby> に変換
    $pattern = '/<ruby\s+data-rt="([^"]*)">(.*?)<\/ruby>/s';
    $replacement = '<ruby>$2<rt>$1</rt></ruby>';
    return preg_replace( $pattern, $replacement, $content );
}
add_filter( 'content_save_pre', 'lw_convert_furigana_on_save' );

/**
 * エディタ読み込み時: <rt>タグをdata-rt属性に変換
 */
function lw_convert_furigana_for_editor( $content ) {
    // <ruby>text<rt>xxx</rt></ruby> を <ruby data-rt="xxx">text</ruby> に変換
    $pattern = '/<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/s';
    $replacement = '<ruby data-rt="$2">$1</ruby>';
    return preg_replace( $pattern, $replacement, $content );
}
add_filter( 'the_editor_content', 'lw_convert_furigana_for_editor' );

/**
 * エディタ内でのフリガナ表示用CSS
 */
function lw_furigana_editor_styles() {
    $css = '
        /* ふりがなポップアップ */
        .lw-furigana-popover .components-popover__content {
            padding: 0 !important;
            min-width: 280px;
        }
        .lw-furigana-popover-content {
            padding: 16px;
        }
        .lw-furigana-popover-content .components-base-control {
            margin-bottom: 0;
        }
        .lw-furigana-popover-content .components-text-control__input {
            width: 100%;
            padding: 8px 12px;
            font-size: 14px;
        }
        .lw-furigana-popover-content .components-select-control__input {
            width: 100%;
            padding: 8px 12px;
            font-size: 14px;
            min-height: 36px;
        }
        .lw-furigana-popover-content .components-base-control__label {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 6px;
            display: block;
        }
        .lw-furigana-popover-content .components-button {
            min-height: 32px;
            padding: 6px 12px;
        }

        /* ふりがな表示（エディタ内） */
        ruby[data-rt] {
            position: relative;
            display: inline-block;
        }
        ruby[data-rt]::after {
            content: attr(data-rt);
            position: absolute;
            left: 0;
            right: 0;
            font-size: 0.5em;
            text-align: center;
            line-height: 1;
            white-space: nowrap;
        }
        /* 上（デフォルト） */
        ruby[data-rt]:not([data-rt-position="under"])::after {
            top: -1.2em;
        }
        /* 下 */
        ruby[data-rt-position="under"]::after {
            bottom: -1.2em;
            top: auto;
        }
        ruby rt {
            font-size: 0.5em;
        }
    ';
    wp_add_inline_style( 'register_block', $css );
}
add_action( 'enqueue_block_editor_assets', 'lw_furigana_editor_styles' );
