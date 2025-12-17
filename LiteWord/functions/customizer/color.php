<?php
if ( !defined( 'ABSPATH' ) ) exit;

add_action( 'customize_register', 'color_custom' );
function color_custom( $wp_customize ) {
    $set_ttl = '共通設定 - カラー（色）'; 
    $sec = 'color_sec'; 
    $set = 'color'; 
    $wp_customize->add_section($sec, [
        'title'    => $set_ttl,
        'priority' => 110,  
    ]);

    // コントロール
    $items = [
        [
            ['color', 'main', '', 'メインカラー'],
            // ['color', 'sub', '', 'サブカラー'],
            ['color', 'accent', '', 'アクセントカラー'],
            ['color', 'text', '', '通常の文字の色'],
            ['color', 'link_common', '', 'リンクテキストの色'],
            ['color', '1', '', 'カラー１'],
            ['color', '2', '', 'カラー２'],
            ['color', '3', '', 'カラー３'],
        ]
    ];
    
    customize_set($items, $set, $sec, $wp_customize);    
}