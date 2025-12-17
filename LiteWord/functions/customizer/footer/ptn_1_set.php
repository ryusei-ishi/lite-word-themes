<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'footer_ptn_1_set_custom' );
function footer_ptn_1_set_custom( $wp_customize ) {
    $panel = 'footer_set';
    $set = 'footer_ptn_1_set'; 
    // 設定
    $set_ttl = ' - パターン１の設定'; // セクションタイトル
    $sec = 'footer_ptn_1_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items = [];
    $items[] = [
        ['radio', 'widget_switch', '', '<h2 class="ctm_ttl_ptn_1" style="margin-top:-18px;">ウィジェットエリア部分</h2>', ctm_switch_array_2()],
    ];
    $items[] = ctm_sns_icon_set_custom_arr([
        "number_of_items" => 4,
    ]);
    $items[] = ctm_copyright_custom_arr();
    customize_set($items, $set, $sec, $wp_customize);    
}