<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_5_set_custom' );
function follow_bottom_cta_ptn_5_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_5_set';
    $set_ttl = ' - パターン５の設定';
    $sec = 'follow_bottom_cta_ptn_5_sec';
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_5'),
        'description_hidden' => false,
    ]);
    $items = [];
    $items[] = [
        ['text', "status_text", "", '<h2 class="ctm_ttl_ptn_1">受付状況の設定</h2>状況テキスト（例：只今受付中）'],
        ['text', "hours_text", "", '営業時間テキスト'],
        ['color', "color_dot", "", '状況アイコンの色'],
    ];
    $items[] = [
        ['text', "tel_text", "", '<h2 class="ctm_ttl_ptn_1">電話ボタンの設定</h2>表示テキスト'],
        ['text', "tel_link", "", 'リンク先（例：tel:000-0000-0000）'],
        ['color', "tel_color_bg", "", '背景色'],
    ];
    $items[] = [
        ['text', "line_text", "", '<h2 class="ctm_ttl_ptn_1">LINEボタンの設定</h2>表示テキスト'],
        ['text', "line_link", "", 'リンク先URL'],
        ['color', "line_color_bg", "", '背景色'],
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
