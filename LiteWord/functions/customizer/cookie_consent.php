<?php
if ( !defined( 'ABSPATH' ) ) exit;

add_action( 'customize_register', 'cookie_consent_custom' );
function cookie_consent_custom( $wp_customize ) {
    $set_ttl = 'クッキーの同意設定'; 
    $sec = 'cookie_consent_sec'; 
    $set = 'cookie_consent'; 
    $wp_customize->add_section($sec, [
        'title'    => $set_ttl,
        'priority' => 190,  
    ]);

    // コントロール
    $items = [
        [
            ['radio', 'switch', '', '',[
                "on" => '表示する',
                "off" => '表示しない',
            ]],
            ["color", "bg_color", ""],
        ]
    ];
    
    customize_set($items, $set, $sec, $wp_customize);    
}