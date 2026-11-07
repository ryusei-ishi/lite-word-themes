<?php
if ( !defined( 'ABSPATH' ) ) exit;
// パターン7「浮遊カプセル」の設定（プレミアム限定・functions/customizer/index.php が契約のあるときだけ読む）
add_action( 'customize_register', 'header_ptn_7_set_custom' );
function header_ptn_7_set_custom( $wp_customize ) {
    $panel = 'header_set';
    $set = 'header_ptn_7_set';
    // 設定
    $set_ttl = ' - パターン７の設定（浮遊カプセル）'; // セクションタイトル
    $sec = 'header_ptn_7_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items[] = ctm_header_follow_switch_arr();
    $items[] = [
        ['radio', 'overlay', '', '<h2 class="ctm_ttl_ptn_1">写真に重ねる</h2>ページの一番上の写真（ファーストビュー）の上にカプセルを浮かせるページ。<br>未選択のときは「トップページだけ」。写真で始まらないページで重ねると、本文の頭がカプセルに隠れます。', [
            'front' => 'トップページだけ重ねる',
            'all'   => '全ページで重ねる',
            'off'   => '重ねない（ページの上の帯に浮かせる）',
        ]],
        ['color', 'capsule_bg_color', '', '<h2 class="ctm_ttl_ptn_1">カプセルの色</h2>カプセルの背景色（未選択は白）'],
        ['color', 'band_bg_color', '', '重ねないときの帯の背景色（未選択は透明）'],
    ];
    $items[] = ctm_information_bar_custom_arr();
    $items[] = ctm_logo_custom_arr();
    $items[] = ctm_header_menu_custom_arr();
    $items[] = ctm_cta_btn_1_arr();
    customize_set($items, $set, $sec, $wp_customize);
}
