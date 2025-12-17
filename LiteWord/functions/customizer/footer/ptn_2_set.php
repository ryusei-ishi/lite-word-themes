<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'footer_ptn_2_set_custom' );
function footer_ptn_2_set_custom( $wp_customize ) {
    $panel = 'footer_set';
    $set = 'footer_ptn_2_set'; 
    // 設定
    $set_ttl = ' - パターン２の設定'; // セクションタイトル
    $sec = 'footer_ptn_2_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items[] = [
        ['radio', 'widget_switch', '', '<h2 class="ctm_ttl_ptn_1" style="margin-top:-18px;">ウィジェットエリア部分</h2>', ctm_switch_array_2()], 
    ];
    $items[] =  ctm_logo_custom_arr();  
    $items[] = [
        ['textarea', 'logo_bottom_text', '', '<h2 class="ctm_ttl_ptn_1">ロゴ下のテキスト</h2>'],
    ];
    $items[] =  ctm_footer_menu_custom_arr();
    $items[] = ctm_sns_icon_set_custom_arr([
        "number_of_items" => 4,
        "sns_bg_color_switch" => "off",
        "icon_color_switch" => "off",
    ]);
    $items[] = ctm_copyright_custom_arr();
    customize_set($items, $set, $sec, $wp_customize);    
}