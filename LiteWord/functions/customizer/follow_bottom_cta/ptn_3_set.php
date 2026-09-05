<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_3_set_custom' );
function follow_bottom_cta_ptn_3_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_3_set';
    // 設定
    $set_ttl = ' - パターン３の設定'; // セクションタイトル
    $sec = 'follow_bottom_cta_ptn_3_sec'; // セクションID
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_3'),
        'description_hidden' => false,
    ]);
    $items = [];
    $items[] = [
        ["radio", "tip_switch", "", '<h2 class="ctm_ttl_ptn_1">吹き出しの設定</h2>表示する', ctm_switch_array_2()],
        ["text", "tip_text", "", '吹き出しテキスト'],
    ];
    $items[] = [
        ['text', "btn_text", "", '<h2 class="ctm_ttl_ptn_1">ボタンの設定</h2>表示テキスト'],
        ['icon_select', "btn_icon", "", 'アイコン', ctm_cta_icon_arr()],
        ['text', "btn_link", "", 'リンク先URL'],
        ['color', "color_bg", "", '背景色'],
        ['color', "color_text", "", '文字・アイコンの色'],
    ];
    $items[] =  [
        ["radio" , "responsive_switch","",'<h2 class="ctm_ttl_ptn_1">レスポンシブ設定</h2>表示デバイス',[
            'sp_pc' => 'スマホとPCの両方で表示',
            'sp_only' => 'スマホの時のみ表示',
            'pc_only' => 'PCの時のみ表示',
        ]],
    ];
    customize_set($items, $set, $sec, $wp_customize);
}
