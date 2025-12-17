<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'return_top_custom' );
function return_top_custom( $wp_customize ) {
    
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $panel = 'return_top';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'ページ下の追従トップに戻るボタン',
            'priority' => 120,
        )
    );

     // -----------------------
    // パターンの選択
    // -----------------------
    $set_ttl = 'パターンの選択'; // セクションタイトル
    $sec = 'return_top_ptn_sec'; // セクションID
    $set = 'return_top'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);

    // コントロール
    $items = [
        [
            ['radio', 'ptn', '', 'パターンの選択', 
                [
                    ''=>'未選択',
                    'ptn_1'=>'パターン１', 
                    'ptn_2' => 'パターン２',
                    'none' => '非表示'
                ],
            ],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);    
}