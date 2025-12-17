<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'header_ptn_3_set_custom' );
function header_ptn_3_set_custom( $wp_customize ) {
    $panel = 'header_set';
    $set = 'header_ptn_3_set'; 
    // 設定
    $set_ttl = ' - パターン３の設定'; // セクションタイトル
    $sec = 'header_ptn_3_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items[] =  ctm_header_follow_switch_arr();
    $items[] =  ctm_information_bar_custom_arr();  
    $items[] =  ctm_logo_custom_arr();    
    $items[] =  ctm_header_menu_custom_arr();
    $items[] =  [
        ["color", "all_bg_color", "", "<h2 class='ctm_ttl_ptn_1'>全体の背景色</h2>"],
    ];
    $items[] = ctm_cta_btn_1_arr(); 
    customize_set($items, $set, $sec, $wp_customize);    
}