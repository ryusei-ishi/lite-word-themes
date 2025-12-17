<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'return_top_ptn_2_set_custom' );
function return_top_ptn_2_set_custom( $wp_customize ) {
    $panel = 'return_top';
    $set = 'return_top_ptn_2_set'; 
    // 設定
    $set_ttl = ' - パターン２の設定'; // セクションタイトル
    $sec = 'return_top_ptn_2_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items = [];
    $items[] = [
        ['color','color_main','','メインカラー' ],
    ];
 
    customize_set($items, $set, $sec, $wp_customize);    
}