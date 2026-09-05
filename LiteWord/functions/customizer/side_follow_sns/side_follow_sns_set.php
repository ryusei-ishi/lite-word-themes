<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'side_follow_sns_set_custom' );
function side_follow_sns_set_custom( $wp_customize ) {

    // パネル設定
    $panel = 'side_follow_sns_set';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => '画面横の追従SNSリンク',
            'priority' => 121,
        )
    );
    // 入力ID（共通）
    $set = 'side_follow_sns_set';

    // パターンの選択
    $set_ttl = 'パターンの選択';
    $sec = 'side_follow_sns_set_ptn_sec';
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items = [
        [
            ['radio', 'ptn_df', '', '<h2 class="ctm_ttl_ptn_1" >表示するパターン</h2>', side_follow_sns_arr()],
        ]
    ];

    customize_set($items, $set, $sec, $wp_customize);
}

/**
 * 「ホームページ設定」（WPコア標準のstatic_front_pageセクション。既定priority=120）を
 * このパネル（priority 121）より後ろへ押し出す。
 * 追従CTA(120)・追従トップに戻るボタン(120)・画面横の追従SNSリンク(121)の「追従」系パネルを
 * 隣接させ、その間にホームページ設定が割り込まないようにするため
 * （2026-09-04 Ryuichi「追従をまとめないと駄目だよね」）。
 * customize_registerの遅いpriorityで実行（static_front_pageはWPコアがcustomize_register
 * 発火前に登録済みなので、既定priority10でも間に合うが念のため）。
 */
add_action( 'customize_register', 'lw_push_back_static_front_page_section', 20 );
function lw_push_back_static_front_page_section( $wp_customize ) {
    $section = $wp_customize->get_section( 'static_front_page' );
    if ( $section ) {
        $section->priority = 122;
    }
}

/* ==========================================================
 * 各パターンの完成イメージ（画像＋用途の説明）
 * ------------------------------------------------------------
 * 追従CTA（follow_bottom_cta_set.php）と全く同じ仕組みを踏襲する。
 * クリックで拡大するオーバーレイCSS/JSは lw_follow_bottom_cta_preview_admin_assets()
 * が customize_controls_enqueue_scripts で既に読み込み済み（customize.php全体に効く）
 * ので、ここで再登録しない。クラス名（lw_cta_preview 等）だけ共用する。
 * 画像は functions/customizer/side_follow_sns/preview/ptn_N.png（無ければ文章のみ表示）。
 * ======================================================= */
function lw_side_follow_sns_preview_meta(){
    return [
        'ptn_1' => ['title' => 'シンプル型',           'desc' => '丸いアイコンを縦に並べただけの、業種を選ばない基本形。'],
        'ptn_2' => ['title' => 'ラベル付き型',          'desc' => 'アイコンの下に「Facebook」「Instagram」など短い文字ラベルを添えるタイプ。何のアイコンか伝わりやすい。'],
        'ptn_3' => ['title' => 'タブ展開型',            'desc' => '普段は画面端に小さいタブとして隠れていて、クリック/タップすると開く。スマホでも場所を取らない。'],
        'ptn_4' => ['title' => 'フローティングボタン型', 'desc' => 'アイコン1つ1つが独立した丸ボタンとして少し離れて浮く（影付き）。目を引きたいサイト向け。'],
    ];
}
function lw_side_follow_sns_preview_description($ptn){
    $meta = lw_side_follow_sns_preview_meta();
    if(!isset($meta[$ptn])){
        return '';
    }
    $title    = $meta[$ptn]['title'];
    $desc     = $meta[$ptn]['desc'];
    $img_path = get_template_directory() . "/functions/customizer/side_follow_sns/preview/{$ptn}.jpg";
    if(!file_exists($img_path)){
        return '<p class="lw_cta_preview__desc">' . esc_html($desc) . '</p>';
    }
    $img_url = get_template_directory_uri() . "/functions/customizer/side_follow_sns/preview/{$ptn}.jpg";
    $html  = '<div class="lw_cta_preview">';
    $html .= '<img src="' . esc_url($img_url) . '" alt="' . esc_attr($title . 'の完成イメージ') . '" class="lw_cta_preview__img">';
    $html .= '<p class="lw_cta_preview__title">' . esc_html($title) . '</p>';
    $html .= '<p class="lw_cta_preview__desc">' . esc_html($desc) . '</p>';
    $html .= '</div>';
    return $html;
}
