<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_8_set_custom' );
function follow_bottom_cta_ptn_8_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_8_set';
    $set_ttl = ' - パターン８の設定';
    $sec = 'follow_bottom_cta_ptn_8_sec';
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_8'),
        'description_hidden' => false,
    ]);
    $items = [];
    $sides = ['a' => '左（1つ目）', 'b' => '右（2つ目）'];
    foreach ($sides as $key => $label) {
        $items[] = [
            ['text', "{$key}_main", "", "<h2 class=\"ctm_ttl_ptn_1\">{$label}の設定</h2>メインテキスト"],
            ['text', "{$key}_sub", "", 'サブテキスト（空欄で非表示）'],
            ['icon_select', "{$key}_icon", "", 'アイコン', ctm_cta_icon_arr()],
            ['text', "{$key}_link", "", 'リンク先URL'],
            ['color', "{$key}_color_bg", "", '背景色'],
        ];
    }
    $items[] =  [
        ["radio" , "responsive_switch","",'<h2 class="ctm_ttl_ptn_1">レスポンシブ設定</h2>表示デバイス',[
            'sp_pc' => 'スマホとPCの両方で表示',
            'sp_only' => 'スマホの時のみ表示',
            'pc_only' => 'PCの時のみ表示',
        ]],
    ];
    customize_set($items, $set, $sec, $wp_customize);
}
