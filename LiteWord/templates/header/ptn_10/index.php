<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * ヘッダーパターン10「斜めカットCTA」（プレミアム限定・2026-11-07）
 * 濃い色の帯に、ロゴ・メニュー（白い文字）・右端に左側を斜めに切ったボタン（共通のボタンの部品・矢印つき）。
 * 1080px 以下: ロゴと、ボタンと同じ色の斜めの部分（メールのアイコン＝ボタンのリンク先・☰）。
 * 斜めの形は、ボタンの背景（::after）とスマホの斜めの部分の背景（::before）を clip-path で切って作る（CSS）。
 */
$set_id = 'header_ptn_10_set';
$is_color = function ( $c ) { return !function_exists( 'lw_is_safe_css_color' ) || lw_is_safe_css_color( $c ); };
// 全体の背景色（文字は白）
$all_bg_color = Lw_theme_mod_set( "{$set_id}_all_bg_color", 'var(--color-main)' );
if ( !$is_color( $all_bg_color ) ) $all_bg_color = 'var(--color-main)';
// 右端のボタン（共通のボタンの部品に渡す既定。スマホの斜めの部分も同じ設定を読む）
$cta_df = [
    'text'  => 'お問い合わせ',
    'link'  => '#',
    'bg'    => '#d6f431',
    'color' => '#111111',
];
$cta_args = [
    "location" => "header",
    "ptn" => "ptn_10",
    "df_cta_btn_switch" => "on",
    "df_cta_btn_text" => $cta_df['text'],
    "df_cta_btn_link" => $cta_df['link'],
    "df_cta_btn_bg_color" => $cta_df['bg'],
    "df_cta_btn_text_color" => $cta_df['color'],
    "df_cta_btn_bd_color" => $cta_df['bg'],
    "df_cta_btn_border_radius" => "0",
];
$cta_on = Lw_theme_mod_set( "{$set_id}_cta_btn_switch", 'on' ) === 'on';
$cta_text = Lw_theme_mod_set( "{$set_id}_cta_btn_text", $cta_df['text'] );
$cta_link = Lw_theme_mod_set( "{$set_id}_cta_btn_link", $cta_df['link'] );
$cta_bg = Lw_theme_mod_set( "{$set_id}_cta_btn_bg_color", $cta_df['bg'] );
$cta_bg = Lw_put_color( "header_page_cta_color_bg", "", "", $cta_bg ); // 固定ページごとのボタン色（共通のボタンの部品と同じ）
$cta_color = Lw_theme_mod_set( "{$set_id}_cta_btn_text_color", $cta_df['color'] );
if ( !$is_color( $cta_bg ) ) $cta_bg = $cta_df['bg'];
if ( !$is_color( $cta_color ) ) $cta_color = $cta_df['color'];
?>
<header class="lw_header_main header_ptn_10" style="background-color: <?= esc_attr( $all_bg_color ) ?>;" itemscope itemtype="http://schema.org/WPHeader">
    <?php lw_information_bar_put([
        "location" => "header",
        "ptn" => "ptn_10",
        "df_switch" => "off",
    ])?>
    <div class="inner">
        <div class="logo">
            <?php Lw_logo_set(
                [
                    "location" => "header",
                    "ptn" => "ptn_10",
                    "df_logo_switch" => "logo_img",
                    "df_logo_text_color" => "#ffffff",
                    "df_logo_text_font" => "gothic",
                    "df_font_weight" => "700",
                    "df_logo_text_size_pc" => "26",
                    "df_logo_text_size_tb" => "22",
                    "df_logo_text_size_sp" => "20",
                    "df_logo_img_size_pc" => "34",
                    "df_logo_img_size_tb" => "30",
                    "df_logo_img_size_sp" => "26",
                ]
            ); ?>
        </div>
        <nav class="header_nav" aria-label="メインナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
            <?php Lw_header_menu_put([
                "location" => "header",
                "ptn" => "ptn_10",
                "df_menu_1st_layer_text_color" => "#ffffff",
                "df_menu_current_text_color" => "",
                "df_menu_current_bg_color" => $cta_df['bg'],
                "df_menu_1st_layer_hover_text_color" => "#ffffff",
                "df_menu_1st_layer_hover_bg_color" => $cta_df['bg'],
            ]);?>
        </nav>
        <?php Lw_cta_btn_1_set( $cta_args ); ?>
        <div class="sp_actions" style="--ptn10-cta-bg: <?= esc_attr( $cta_bg ) ?>; color: <?= esc_attr( $cta_color ) ?>;">
            <?php if ( $cta_on && !empty( $cta_link ) ): ?>
            <a class="sp_mail" href="<?= esc_url( $cta_link ) ?>" aria-label="<?= esc_attr( $cta_text ) ?>">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>
            </a>
            <?php endif; ?>
            <div class="ham_btn drawer_nav_open">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</header>
<?php Lw_follow_menu_put([
    "location" => "header",
    "ptn" => "ptn_10",
]);?>
