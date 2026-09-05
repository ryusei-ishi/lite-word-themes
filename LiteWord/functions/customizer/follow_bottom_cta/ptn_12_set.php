<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_12_set_custom' );
function follow_bottom_cta_ptn_12_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_12_set';
    $set_ttl = ' - パターン１２の設定';
    $sec = 'follow_bottom_cta_ptn_12_sec';
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_12'),
        'description_hidden' => false,
    ]);
    $items = [];
    for ($i = 1; $i <= 4; $i++) {
        $items[] = [
            ['radio', "{$i}_switch", '', '<h2 class="ctm_ttl_ptn_1">連絡先'.$i.'つ目の設定</h2>', ctm_switch_array_2()],
            ['text', "{$i}_text", "", '表示テキスト'],
            ['icon_select', "{$i}_icon", "", 'アイコン', ctm_cta_icon_arr()],
            ['text', "{$i}_link", "", 'リンク先URL'],
        ];
    }
    $items[] = [
        ['text', "handle_text", "", '<h2 class="ctm_ttl_ptn_1">ハンドル（閉じた状態のバー）の設定</h2>表示テキスト'],
        ['color', "color_main", "", 'メインカラー'],
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
