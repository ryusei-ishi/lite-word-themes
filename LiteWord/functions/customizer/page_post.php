<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'page_post_custom' );
function page_post_custom( $wp_customize ) {
    
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $panel = 'page_post';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'デザイン設定 - 固定ページ',
            'priority' => 120,
        )
    );
    // -----------------------
    // layout
    // -----------------------
    $set_ttl = 'レイアウト'; // セクションタイトル
    $sec = 'page_post_layout_sec'; // セクションID
    $set = 'page_post_layout'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    // コントロール
    $items = [
        [
            ['select', 'max_width_clm_1', '', '最大横幅', ctm_max_width_arr()],
          
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);   
    // -----------------------
    // 見出し
    // -----------------------
    $set_ttl = '見出し設定'; // セクションタイトル
    $sec = 'page_post_layout_heading_sec'; // セクションID
    $set = 'page_post_layout'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    // コントロール
    $items = [
        [
            ['select', 'heading_2', '■ 見出し2', 'デザインパターンの選択', ctm_heading_arr()],
            ['select', 'heading_3', '■ 見出し3', 'デザインパターンの選択', ctm_heading_arr()],
            ['select', 'heading_4', '■ 見出し4', 'デザインパターンの選択', ctm_heading_arr()],
          
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);   
}