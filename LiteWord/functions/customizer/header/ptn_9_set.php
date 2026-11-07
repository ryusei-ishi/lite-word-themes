<?php
if ( !defined( 'ABSPATH' ) ) exit;
// パターン9「受付案内と予約」の設定（プレミアム限定・functions/customizer/index.php が契約のあるときだけ読む）
add_action( 'customize_register', 'header_ptn_9_set_custom' );
function header_ptn_9_set_custom( $wp_customize ) {
    $panel = 'header_set';
    $set = 'header_ptn_9_set';
    // 設定
    $set_ttl = ' - パターン９の設定（受付案内と予約）'; // セクションタイトル
    $sec = 'header_ptn_9_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items[] = ctm_header_follow_switch_arr();
    $items[] = ctm_information_bar_custom_arr();
    $items[] = ctm_logo_custom_arr();
    $items[] = ctm_header_menu_custom_arr();
    $items[] = [
        ['text', 'hours_text', '', '<h2 class="ctm_ttl_ptn_1">受付時間の帯</h2>帯に出す文字（例: 診療時間 9:00〜18:00　休診 木・日）。<br>入れたときだけ、ヘッダーの下に時計のアイコンつきの帯を出します'],
        ['color', 'hours_bg_color', '', '帯の背景色（未選択はメインカラーを薄くした色）'],
        ['color', 'hours_text_color', '', '帯の文字色（未選択は濃いグレー）'],
        ['radio', 'access_switch', '', '<h2 class="ctm_ttl_ptn_1">アクセスのボタン</h2>表示（未選択は表示。リンク先を入れたときだけ出ます）', [
            'on'  => '表示する',
            'off' => '表示しない',
        ]],
        ['text', 'access_text', '', 'ボタンの文字（未入力は「アクセス」）'],
        ['text', 'access_url', '', 'リンク先のURL（アクセスのページや Google マップ）'],
    ];
    // 予約のボタン（共通のボタンの部品。スマホではヘッダーの一番下に幅いっぱいで出る）
    $items[] = ctm_cta_btn_1_arr();
    customize_set($items, $set, $sec, $wp_customize);
}
