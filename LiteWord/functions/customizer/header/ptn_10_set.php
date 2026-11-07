<?php
if ( !defined( 'ABSPATH' ) ) exit;
// パターン10「斜めカットCTA」の設定（プレミアム限定・functions/customizer/index.php が契約のあるときだけ読む）
add_action( 'customize_register', 'header_ptn_10_set_custom' );
function header_ptn_10_set_custom( $wp_customize ) {
    $panel = 'header_set';
    $set = 'header_ptn_10_set';
    // 設定
    $set_ttl = ' - パターン１０の設定（斜めカットCTA）'; // セクションタイトル
    $sec = 'header_ptn_10_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items[] = ctm_header_follow_switch_arr();
    $items[] = ctm_information_bar_custom_arr();
    $items[] = ctm_logo_custom_arr();
    $items[] = ctm_header_menu_custom_arr();
    $items[] = [
        ['color', 'all_bg_color', '', '<h2 class="ctm_ttl_ptn_1">全体の背景色</h2>未選択はメインカラー。文字は白なので、濃い色にする'],
    ];
    // 右端の斜めのボタン（共通のボタンの部品）。スマホでは同じ色の斜めの部分にメールのアイコン（ボタンのリンク先）と ☰ が入る
    $items[] = ctm_cta_btn_1_arr();
    customize_set($items, $set, $sec, $wp_customize);
}
