<?php
if (!defined('ABSPATH')) exit;
// フロントエンド用のCSSおよびJSファイルの読み込み
function add_files() {
    if (!is_admin()) {
        // jQueryを登録して確実に使用
        wp_enqueue_script('jquery');
        
        // JSとCSSの読み込み
        wp_enqueue_script('swiper-cdn', get_template_directory_uri() . '/assets/js/swiper_cdn.js', array(), null, true);
        wp_enqueue_script('common_js', get_template_directory_uri() . '/assets/js/common.js', array('jquery'), css_version(), true);
        wp_enqueue_script('font_cdn_js', get_template_directory_uri() . '/assets/js/font_cdn.js', array(), css_version(), true); 
        wp_enqueue_script('font_js', get_template_directory_uri() . '/assets/js/font.js', array('common_js'), css_version(), true); 
        
        
        wp_enqueue_style('style_reset', get_template_directory_uri() . '/assets/css/reset.min.css', array(), css_version(), 'all');
        wp_enqueue_style('style_common', get_template_directory_uri() . '/assets/css/common.min.css', array(), css_version(), 'all');
        wp_enqueue_style('style_page', get_template_directory_uri() . '/assets/css/page.min.css', array(), css_version(), 'all');
        wp_enqueue_style('register_block', get_template_directory_uri() . '/assets/css/register_block.min.css', array(), css_version(), 'all');
        wp_enqueue_style('style_sidebar', get_template_directory_uri() . '/assets/css/sidebar.min.css', array(), css_version(), 'all');
        wp_enqueue_style('style_font', get_template_directory_uri() . '/assets/css/font_style.min.css', array(), css_version(), 'all');
        $lw_animation_switch = Lw_theme_mod_set("lw_extensions_animation_switch", "off");
        $lw_page_animation_switch = get_post_meta(get_the_ID(), 'lw_page_animation_switch', true);
        if($lw_animation_switch === "on" && LW_EXPANSION_BASE || $lw_page_animation_switch === "on"){
            wp_enqueue_script('animation-front', get_template_directory_uri() . '/assets/js/animation-front.js', array(), css_version(), true); 
            wp_enqueue_style('style_anime', get_template_directory_uri() . '/assets/css/anime.min.css', array(), css_version(), 'all');
        }
        // WooCommerce用CSSの条件付き読み込み（WooCommerceが有効な場合のみ）
        if (class_exists('WooCommerce')) {
            wp_enqueue_style('style_woocommerce_common', get_template_directory_uri() . '/assets/css/woocommerce/common.min.css', array(), css_version(), 'all');
            if (function_exists('is_woocommerce') && is_woocommerce()) {
                wp_enqueue_style('style_woocommerce', get_template_directory_uri() . '/assets/css/woocommerce/style.min.css', array(), css_version(), 'all');
            }
        }
        //header
        $header_set_ptn_df = Lw_theme_mod_set("header_set_ptn_df", "ptn_1");
        if(is_page()){
            $header_ptn_set = Lw_put_text("header_select");
            if(empty($header_ptn_set)){
                $header_ptn_set = Lw_theme_mod_set("header_set_ptn_page", $header_set_ptn_df);
            }
            wp_enqueue_style('style_header', get_template_directory_uri() . '/assets/css/header/'.$header_ptn_set.'/style.min.css', array(), css_version(), 'all');
        }
        else if(is_single()){
            wp_enqueue_style('style_header', get_template_directory_uri() . '/assets/css/header/'.Lw_theme_mod_set("header_set_ptn_post", $header_set_ptn_df).'/style.min.css', array(), css_version(), 'all');
        }
        else if(is_archive()){
            wp_enqueue_style('style_header', get_template_directory_uri() . '/assets/css/header/'.Lw_theme_mod_set("header_set_ptn_archive", $header_set_ptn_df).'/style.min.css', array(), css_version(), 'all');
        }
        else{
            wp_enqueue_style('style_header', get_template_directory_uri() . '/assets/css/header/'.$header_set_ptn_df.'/style.min.css', array(), css_version(), 'all');
        }
        wp_enqueue_style('style_header_sub_menu', get_template_directory_uri() . '/assets/css/header/sub_menu/style.min.css', array(), css_version(), 'all');
        // インラインCSSでCSS変数を適用
        wp_add_inline_style('style_common', lw_generate_css_variables());

        // 遅延読み込みCSS
        echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/common-additional.min.css' . css_version() . '" media="print" onload="this.media=\'all\'">';
        echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/page-additional.min.css' . css_version() . '" media="print" onload="this.media=\'all\'">';
        echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/sidebar-additional.min.css' . css_version() . '" media="print" onload="this.media=\'all\'">';
        echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/footer-additional.min.css' . css_version() . '" media="print" onload="this.media=\'all\'">';
    }
}
add_action('wp_enqueue_scripts', 'add_files');