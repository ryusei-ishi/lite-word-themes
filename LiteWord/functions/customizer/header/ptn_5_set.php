<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'header_ptn_5_set_custom' );
function header_ptn_5_set_custom( $wp_customize ) {
    $panel = 'header_set';
    $set = 'header_ptn_5_set'; 
    // 設定
    $set_ttl = ' - パターン５の設定'; // セクションタイトル
    $sec = 'header_ptn_5_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items[] =  ctm_header_follow_switch_arr();
    $items[] =  ctm_information_bar_custom_arr();  
    $items[] =  ctm_logo_custom_arr();    
    $items[] = [
        ['textarea', "explanation_pc", '', '<h2 class="ctm_ttl_ptn_1">右側の説明テキスト</h2>PCの時'],
        ['textarea', "explanation_sp", '', 'スマホCの時'],
    ];
    $items[] =  ctm_header_menu_custom_arr();

    $items[] = [
        ['radio', "pickup_menu_page_switch", "" , "<h2 class='ctm_ttl_ptn_1'>ピックアップメニュー</h2>表示箇所",
            [
                'off'=> '表示しない',
                'all'=> '全てのページに表示する',
                'top_only'=> 'トップページのみ表示する',
                'page_only'=> '固定ページのみ表示する',
                'page_none'=> '固定ページのみ表示しない',
                'single_only'=> '投稿ページのみ表示する',
                'single_none'=> '投稿ページのみ表示しない',
                'archive_only'=> 'アーカイブページのみ表示する',
                'archive_none'=> 'アーカイブページのみ表示しない',
            ]
        ],
        ['radio', "pickup_menu_responsive", "", "レスポンシブ",
            [
                "sp_pc" => "スマホとPCの両方で表示",
                'sp_only' => 'スマホの時のみ表示',
                'pc_only' => 'PCの時のみ表示',
            ],
        ],
        ["color", "pickup_menu_bg_color", "", "背景色"],
        ['text', "pickup_menu_1_text", '', "<h3 class='ctm_ttl_ptn_2'>項目 1</h3>テキスト"],
        ['text', "pickup_menu_1_url", '', "リンク先URL"],
        ['select', "pickup_menu_1_icon", '', 'アイコン', ctm_cta_icon_arr()],
        ['text', "pickup_menu_2_text", '', "<h3 class='ctm_ttl_ptn_2'>項目 2</h3>テキスト"],
        ['text', "pickup_menu_2_url", '', "リンク先URL"],
        ['select', "pickup_menu_2_icon", '', 'アイコン', ctm_cta_icon_arr()],
        ['text', "pickup_menu_3_text", '', "<h3 class='ctm_ttl_ptn_2'>項目 3</h3>テキスト"],
        ['text', "pickup_menu_3_url", '', "リンク先URL"],
        ['select', "pickup_menu_3_icon", '', 'アイコン', ctm_cta_icon_arr()],
        ['text', "pickup_menu_4_text", '', "<h3 class='ctm_ttl_ptn_2'>項目 4</h3>テキスト"],
        ['text', "pickup_menu_4_url", '', "リンク先URL"],
        ['select', "pickup_menu_4_icon", '', 'アイコン', ctm_cta_icon_arr()],
    ];
    
    customize_set($items, $set, $sec, $wp_customize);    
}