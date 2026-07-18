<?php
if ( !defined( 'ABSPATH' ) ) exit;

add_action( 'customize_register', 'breadcrumb_custom' );
function breadcrumb_custom( $wp_customize ) {
    $set_ttl = 'パンくずリスト';
    $sec = 'lw_breadcrumb_sec';
    $set = 'lw_breadcrumb';
    $wp_customize->add_section($sec, [
        'title'    => $set_ttl,
        'priority' => 180,
    ]);
    // コントロール
    $items = [
        [
            //トップページの表記
            ['select', 'home_text', 'トップページの表記', '', [
                    'home' => 'HOME',
                    'page_title' => 'ページタイトル',
                    'custom_text' => 'テキスト入力',
                ]
            ],
            ['text', 'home_custom_text', '', '※「テキスト入力」選択時に表示するテキスト'],
        ]
    ];

    customize_set($items, $set, $sec, $wp_customize);
}