<?php
if ( !defined( 'ABSPATH' ) ) exit;
// パターン8「ショップ」の設定（プレミアム限定・functions/customizer/index.php が契約のあるときだけ読む）
add_action( 'customize_register', 'header_ptn_8_set_custom' );
function header_ptn_8_set_custom( $wp_customize ) {
    $panel = 'header_set';
    $set = 'header_ptn_8_set';
    // 設定
    $set_ttl = ' - パターン８の設定（ショップ）'; // セクションタイトル
    $sec = 'header_ptn_8_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items[] = ctm_header_follow_switch_arr();
    $items[] = ctm_information_bar_custom_arr();
    $items[] = ctm_logo_custom_arr();
    $items[] = [
        ['text', 'search_placeholder', '', '<h2 class="ctm_ttl_ptn_1">検索窓</h2>検索窓に薄く出す文字（未入力は「商品を探す」）'],
        ['radio', 'search_target', '', '探す対象（未選択のときは「自動」）', [
            'auto'    => '自動（WooCommerce を使っていれば商品、使っていなければサイト全体）',
            'site'    => 'サイト全体',
            'product' => '商品だけ（WooCommerce を使っているときだけ効く）',
        ]],
        ['radio', 'mypage_switch', '', '<h2 class="ctm_ttl_ptn_1">マイページとカート</h2>マイページ（未選択は表示）', [
            'on'  => '表示する',
            'off' => '表示しない',
        ]],
        ['text', 'mypage_text', '', 'マイページの文字（未入力は「マイページ」）'],
        ['text', 'mypage_url', '', 'マイページのURL（未入力なら WooCommerce のマイアカウント。どちらも無いときは出しません）'],
        ['radio', 'cart_switch', '', 'カート（未選択は表示）', [
            'on'  => '表示する',
            'off' => '表示しない',
        ]],
        ['text', 'cart_text', '', 'カートの文字（未入力は「カート」）'],
        ['text', 'cart_url', '', 'カートのURL（未入力なら WooCommerce のカート。BASE や STORES などのお店のURLも入れられます）'],
    ];
    // 下の段のカテゴリは、ヘッダーのメニューを使う
    $items[] = ctm_header_menu_custom_arr();
    customize_set($items, $set, $sec, $wp_customize);
}
