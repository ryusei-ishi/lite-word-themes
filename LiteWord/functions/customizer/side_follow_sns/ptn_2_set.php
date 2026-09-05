<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'side_follow_sns_ptn_2_set_custom' );
function side_follow_sns_ptn_2_set_custom( $wp_customize ) {
    $panel = 'side_follow_sns_set';
    $set = 'side_follow_sns_ptn_2_set';
    $set_ttl = ' - パターン２の設定';
    $sec = 'side_follow_sns_ptn_2_sec';
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_side_follow_sns_preview_description('ptn_2'),
        'description_hidden' => false,
    ]);
    $items = [];
    $items[] = [
        ['radio', 'position', '', '<h2 class="ctm_ttl_ptn_1">表示位置</h2>', [
            'left' => '画面の左',
            'right' => '画面の右',
        ]],
    ];
    $items[] = ctm_sns_icon_set_custom_arr([
        "number_of_items" => 6,
    ]);
    $items[] = [
        ["radio" , "responsive_switch","",'<h2 class="ctm_ttl_ptn_1">レスポンシブ設定</h2>表示デバイス',[
            'sp_pc' => 'スマホとPCの両方で表示',
            'sp_only' => 'スマホの時のみ表示',
            'pc_only' => 'PCの時のみ表示',
        ]],
    ];
    customize_set($items, $set, $sec, $wp_customize);
}
