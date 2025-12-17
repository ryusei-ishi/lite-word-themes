<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'drawer_ptn_1_set_custom' );
function drawer_ptn_1_set_custom( $wp_customize ) {
    $panel = 'drawer_set';
    $set = 'drawer_ptn_1_set'; 
    // 設定
    $set_ttl = ' - パターン１の設定'; // セクションタイトル
    $sec = 'drawer_ptn_1_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット 
    $items  = [];
    $items[] =  ctm_drawer_menu_custom_arr();
    $items[] = ctm_cta_btn_1_arr();
    customize_set($items, $set, $sec, $wp_customize);    
}