<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_1_set_custom' );
function follow_bottom_cta_ptn_1_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_1_set'; 
    // 設定
    $set_ttl = ' - パターン１の設定'; // セクションタイトル
    $sec = 'follow_bottom_cta_ptn_1_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items = [];
    for ($i = 1; $i <= 2; $i++) { 
        $items[] = [
            ['radio', "{$i}_switch", '', '<h2 class="ctm_ttl_ptn_1">リンクボタン'.$i.'つ目の設定</h2>', ctm_switch_array_2()],
            ['text', "{$i}_text", "", '表示テキスト'],
            ['select', "{$i}_icon", "", 'アイコン', ctm_cta_icon_arr()],
            ['text', "{$i}_link", "", 'リンク先URL'],
            ['color', "{$i}_color_bg", "", '背景色'],
            ['color', "{$i}_color_text", "", '文字の色'],
        ];
    }
    $items[] =  [
        ["select" , "font_family","",'<h2 class="ctm_ttl_ptn_1">デザイン共通設定</h2><br>フォントの種類',ctm_font_family_arr()],
        ["select", "font_weight","","フォントの太さ",ctm_font_weight_arr()],
        ['color', "bg_color", "", '背景の色'],
        ['range', "bg_op", "", '背景の透明度'],
        ['range', "range", "", 'リンクボタンの角丸'],
    ];
    customize_set($items, $set, $sec, $wp_customize);    
}


