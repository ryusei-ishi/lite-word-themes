<?php
if ( ! defined( 'ABSPATH' ) ) {exit;}
// メニュー追加
add_action('admin_menu', 'lw_seo_settings_menu');
function lw_seo_settings_menu() {
    add_menu_page('Lw SEO設定', 'Lw SEO設定', 'manage_options', 'lw_seo_settings_menu_management', 'lw_seo_settings_menu_page_index', 'dashicons-admin-generic', 23);
    //add_submenu_page('lw_seo_settings_menu_management', '基本設定', '基本設定', 'manage_options', 'lw_seo_settings_menu_page_base_set', 'lw_seo_settings_menu_page_base_set');
    add_submenu_page('lw_seo_settings_menu_management', 'ページ毎の設定', 'ページ毎の設定', 'manage_options', 'lw_seo_settings_menu_page_individual_set', 'lw_seo_settings_menu_page_individual_set');
    add_submenu_page('lw_seo_settings_menu_management', 'OGP共通設定', 'OGP共通設定', 'manage_options', 'lw_seo_settings_menu_ogp_set', 'lw_seo_settings_menu_ogp_set');
    add_submenu_page('lw_seo_settings_menu_management', 'アクセス解析設定', 'アクセス解析設定', 'manage_options', 'lw_seo_settings_menu_analysis_set', 'lw_seo_settings_menu_analysis_set');
    add_submenu_page('lw_seo_settings_menu_management', 'サイトマップ設定', 'サイトマップ設定', 'manage_options', 'lw_seo_settings_menu_sitemap_control', 'lw_seo_settings_menu_sitemap_control');
    //add_submenu_page('lw_seo_settings_menu_management', 'サイトマップ設定（テスト）', 'サイトマップ設定（テスト）', 'manage_options', 'lw_seo_settings_menu_sitemap_control_test', 'lw_seo_settings_menu_sitemap_control_test');
}
function lw_seo_settings_menu_page_index() {
    get_template_part('./functions/seo/base_setting');
}
// 一覧
function lw_seo_settings_menu_page_individual_set() {
    get_template_part('./functions/seo/page_index');
}

// OGP設定
function lw_seo_settings_menu_ogp_set() {
    get_template_part('./functions/seo/ogp_setting');
}
// アクセス解析
function lw_seo_settings_menu_analysis_set() {
    get_template_part('./functions/seo/analysis_setting');

}
// サイトマップ設定
function lw_seo_settings_menu_sitemap_control() {
    get_template_part('./functions/seo/sitemap_control_setting');
}

// サイトマップ設定
// function lw_seo_settings_menu_sitemap_control_test() {
//     get_template_part('./functions/seo/sitemap_control_setting_test');
// }
