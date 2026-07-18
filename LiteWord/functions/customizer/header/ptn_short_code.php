<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'header_ptn_short_code_set_custom' );
function header_ptn_short_code_set_custom( $wp_customize ) {
    $panel = 'header_set';
    $set = 'header_ptn_short_code_set'; 
    // 設定
    $set_ttl = ' - ショートコードの設定'; // セクションタイトル
    $sec = 'header_ptn_short_code_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items = [
        [
            ['text', 'put', '', 'ショートコードを入力してください'],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);    
}