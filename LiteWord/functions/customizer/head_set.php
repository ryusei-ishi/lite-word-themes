<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'head_set_custom' );
function head_set_custom( $wp_customize ) {
    
    //_パーツスイッチ
    $panel = 'head_set';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'コードの追記（head内など）',
            'priority' => 200,
        )
    );
   
    
    //head内 - 前半部分
    $set_ttl = 'head内（前半部分）'; 
    $sec = 'head_set_in_before_sec'; 
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $set = 'head_set'; // 入力ID
    $items = [
        [
            ['textarea', 'before', '', ''],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);   

    //head内 - 後半部分
    $set_ttl = 'head内（後半部分）';
    $sec = 'head_set_in_after_sec';
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $set = 'head_set'; // 入力ID
    $items = [
        [
            ['textarea', 'after', '', ''],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);

    //body内 - 前半部分
    $set_ttl = 'body内（前半部分）';
    $sec = 'head_set_body_before_sec';
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $set = 'body_set'; // 入力ID
    $items = [
        [
            ['textarea', 'before', '', ''],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);

    //body内 - 後半部分
    $set_ttl = 'body内（後半部分）';
    $sec = 'head_set_body_after_sec';
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $set = 'body_set'; // 入力ID
    $items = [
        [
            ['textarea', 'after', '', ''],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);
}