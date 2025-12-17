<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'single_post_custom' );
function single_post_custom( $wp_customize ) {
    
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $panel = 'single_post';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'デザイン設定 - 投稿ページ',
            'priority' => 120,
        )
    );

    // -----------------------
    // カラム設定
    // -----------------------
    $set_ttl = 'カラム設定'; // セクションタイトル
    $sec = 'single_post_layout_clm_sec'; // セクションID
    $set = 'single_post_layout'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);

    // コントロール
    $items = [
        [
            ['radio', 'clm', '', 'カラム設定', ['clm_1' => '1カラム', '' => '2カラム（右サイドバー）','clm_2_left' => '2カラム（左サイドバー）']],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);  

     // -----------------------
    // パンくずリスト
    // -----------------------
    $set_ttl = 'パンくずリスト設定'; // セクションタイトル
    $sec = 'single_post_breadcrumb_sec'; // セクションID
    $set = 'single_post_layout'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);

    // コントロール
    $items = [
        [
            ['radio', 'breadcrumb_ptn', '', 'パターンの選択', 
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

    // -----------------------
    // ファーストビュー
    // -----------------------
    $set_ttl = 'ファーストビュー設定'; // セクションタイトル
    $sec = 'single_post_layout_fv_sec'; // セクションID
    $set = 'single_post_layout'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);

    // コントロール
    $items = [
        [
            ['radio', 'fv_ptn', '', 'FVパターンの選択', [''=>'パターン１', 'fv_ptn_2' => 'パターン２']],
            ['radio', 'fv_date', '', '投稿日時', [''=>'表示', 'none' => '非表示']],
            ['radio', 'fv_date_update', '', '更新日時', [''=>'表示', 'none' => '非表示']],
            ['radio', 'fv_category', '', 'カテゴリー', [''=>'表示', 'none' => '非表示']],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);   
    
    // -----------------------
    // 見出し
    // -----------------------
    $set_ttl = '見出し設定'; // セクションタイトル
    $sec = 'single_post_layout_heading_sec'; // セクションID
    $set = 'single_post_layout'; // 入力ID
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

    // -----------------------
    // 目次
    // -----------------------
    $set_ttl = '目次設定'; // セクションタイトル
    $sec = 'single_post_layout_toc_sec'; // セクションID
    $set = 'single_post_layout'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    // コントロール
    $items = [
        [
            ['radio', 'toc_switch', '', '', ctm_switch_array_2()],
          
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);   

    // -----------------------
    // シェアボタンの設定
    // -----------------------
    $set_ttl = 'シェアボタンの設定'; // セクションタイトル
    $sec = 'single_post_layout_share_button_sec'; // セクションID
    $set = 'single_post_layout_share_button'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    // コントロール
    $items = [
        [
            ['radio', 'title_btm_switch', '','<h2 class="ctm_ttl_ptn_1">タイトル下（記事冒頭）</h2>',  ctm_switch_array_2()],
            ['select', 'title_btm_sns_1', '','<h3 class="ctm_ttl_ptn_2">シェア先の選択</h3>',  ctm_sns_share_icon_arr()],
            ['select', 'title_btm_sns_2', '','',  ctm_sns_share_icon_arr()],
            ['select', 'title_btm_sns_3', '','',  ctm_sns_share_icon_arr()],
            ['select', 'title_btm_sns_4', '','',  ctm_sns_share_icon_arr()],
            ['select', 'title_btm_sns_5', '','',  ctm_sns_share_icon_arr()],
            ['radio', 'post_btm_switch', '','<br><br><h2 class="ctm_ttl_ptn_1">投稿下</h2>',  ctm_switch_array_2()],
            ['select', 'post_btm_sns_1', '','<h3 class="ctm_ttl_ptn_2">シェア先の選択</h3>',  ctm_sns_share_icon_arr()],
            ['select', 'post_btm_sns_2', '','',  ctm_sns_share_icon_arr()],
            ['select', 'post_btm_sns_3', '','',  ctm_sns_share_icon_arr()],
            ['select', 'post_btm_sns_4', '','',  ctm_sns_share_icon_arr()],
            ['select', 'post_btm_sns_5', '','',  ctm_sns_share_icon_arr()],
          
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);  
}