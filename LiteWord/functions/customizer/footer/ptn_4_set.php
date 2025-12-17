<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'footer_ptn_4_set_custom' );
function footer_ptn_4_set_custom( $wp_customize ) {
    $panel = 'footer_set';
    $set = 'footer_ptn_4_set'; 
    // 設定
    $set_ttl = ' - パターン４の設定'; // セクションタイトル
    $sec = 'footer_ptn_4_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items[] = [
        ['radio', 'widget_switch', '', '<h2 class="ctm_ttl_ptn_1" style="margin-top:-18px;">ウィジェットエリア部分</h2>', ctm_switch_array_2()], 
    ];
    $items[] =  ctm_logo_custom_arr();  
    $items[] = [
        ['textarea', 'logo_bottom_text', '', '<h2 class="ctm_ttl_ptn_1">ロゴ下のテキスト</h2>'],
    ];
    $items[] =  ctm_footer_menu_custom_arr();
    $items[] = ctm_copyright_custom_arr();
    $items[] = [
        ['color', 'color_bg_all', '', '<h2 class="ctm_ttl_ptn_1">色の設定</h2>背景色'],
        ['color', 'color_text_all', '', '文字色'],
    ];
    customize_set($items, $set, $sec, $wp_customize);    
}