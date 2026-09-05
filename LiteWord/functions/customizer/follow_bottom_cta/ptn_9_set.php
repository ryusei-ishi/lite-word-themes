<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_9_set_custom' );
function follow_bottom_cta_ptn_9_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_9_set';
    $set_ttl = ' - パターン９の設定';
    $sec = 'follow_bottom_cta_ptn_9_sec';
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_9'),
        'description_hidden' => false,
    ]);
    $items = [];
    $items[] = [
        ['text', "text", "", '<h2 class="ctm_ttl_ptn_1">テキストの設定</h2>表示テキスト'],
        ['color', "color_bar", "", '進捗バーの色'],
    ];
    $items[] = [
        ['text', "btn_text", "", '<h2 class="ctm_ttl_ptn_1">ボタンの設定</h2>表示テキスト'],
        ['text', "btn_link", "", 'リンク先URL'],
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
