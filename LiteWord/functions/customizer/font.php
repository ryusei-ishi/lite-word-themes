<?php
if ( !defined( 'ABSPATH' ) ) exit;

add_action( 'customize_register', 'font_custom' );
function font_custom( $wp_customize ) {
    $set_ttl = '共通設定 - フォント'; 
    $sec = 'font_sec'; 
    $set = 'font'; 
    $wp_customize->add_section($sec, [
        'title'    => $set_ttl,
        'priority' => 110, 
    ]);
    // コントロール
    $items = [
        [
            //body
            ['select', 'body','', '<h2 class="ctm_ttl_ptn_1">サイト全体（デフォルト）</h2>フォント', ctm_font_family_arr()],
            ['select', 'body_weight', '', '文字の太さ', ctm_font_weight_arr()],
            //page
            ['select', 'page', '','<h2 class="ctm_ttl_ptn_1">固定ページ</h2>フォント',  ctm_font_family_arr()],
            ['select', 'page_weight', '', '文字の太さ', ctm_font_weight_arr()],
            ['select', 'page_size_pc', '', '文字サイズ パソコンの時', ctm_font_size_arr()],
            ['select', 'page_size_tb', '', '文字サイズ タブレットの時', ctm_font_size_arr()],
            ['select', 'page_size_sp', '', '文字サイズ スマホの時', ctm_font_size_arr()],
            //single
            ['select', 'single', '','<h2 class="ctm_ttl_ptn_1">投稿ページ</h2>フォント',  ctm_font_family_arr()],
            ['select', 'single_weight', '', '文字の太さ', ctm_font_weight_arr()],
            ['select', 'single_size_pc', '', '文字サイズ パソコンの時', ctm_font_size_arr()],
            ['select', 'single_size_tb', '', '文字サイズ タブレットの時', ctm_font_size_arr()],
            ['select', 'single_size_sp', '', '文字サイズ スマホの時', ctm_font_size_arr()],
        ]
    ];
    
    customize_set($items, $set, $sec, $wp_customize);    
}