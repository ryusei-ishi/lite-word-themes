<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_4_set_custom' );
function follow_bottom_cta_ptn_4_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_4_set';
    $set_ttl = ' - パターン４の設定';
    $sec = 'follow_bottom_cta_ptn_4_sec';
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_4'),
        'description_hidden' => false,
    ]);
    $items = [];
    $items[] = [
        ['text', "price", "", '<h2 class="ctm_ttl_ptn_1">価格の設定</h2>価格（数字のみ）'],
        ['text', "price_unit", "", '価格のあとに続くテキスト'],
        ['text', "badge_text", "", '補足バッジ（空欄で非表示）'],
    ];
    $items[] = [
        ['text', "btn_text", "", '<h2 class="ctm_ttl_ptn_1">ボタンの設定</h2>表示テキスト'],
        ['text', "btn_link", "", 'リンク先URL'],
        ['color', "color_accent", "", 'メインカラー（上の線・ボタン背景）'],
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
