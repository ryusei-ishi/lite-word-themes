<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * ヘッダーパターン7「浮遊カプセル」（プレミアム限定・2026-11-07）
 * 白い角丸のカプセルにロゴ・メニュー・ボタンを入れて浮かせる。
 * 「写真に重ねる」ページでは .is_overlay を付け、カプセルの帯のぶんだけ下の本文を引き上げて、ページの一番上の写真の上に浮かせる（CSS）。
 * ボタンは nav の外に置く（1080px 以下でメニューが消えても、ボタンと ☰ はカプセルに残る）。
 */
$overlay = Lw_theme_mod_set("header_ptn_7_set_overlay", "front");
$is_overlay = ( $overlay === "all" ) || ( $overlay === "front" && is_front_page() );
$capsule_bg_color = Lw_theme_mod_set("header_ptn_7_set_capsule_bg_color", "#ffffff");
$band_bg_color = $is_overlay ? "" : Lw_theme_mod_set("header_ptn_7_set_band_bg_color", "");
// ☰ の線はメニューの文字色にそろえる（カプセルを濃い色にしても見えるように）
$menu_text_color = Lw_theme_mod_set("header_ptn_7_set_menu_1st_layer_text_color", "#222");
?>
<header class="lw_header_main header_ptn_7<?= $is_overlay ? ' is_overlay' : '' ?>" itemscope itemtype="http://schema.org/WPHeader"<?php if ( !empty($band_bg_color) ): ?> style="background-color: <?= esc_attr($band_bg_color) ?>;"<?php endif; ?>>
    <?php lw_information_bar_put([
        "location" => "header",
        "ptn" => "ptn_7",
        "df_switch" => "off",
    ])?>
    <div class="capsule_area">
        <div class="inner" style="background-color: <?= esc_attr($capsule_bg_color) ?>;">
            <div class="logo">
                <?php Lw_logo_set(
                    [
                        "location" => "header",
                        "ptn" => "ptn_7",
                        "df_logo_switch" => "logo_img",
                        "df_logo_text_color" => "#111",
                        "df_logo_text_font" => "mincho",
                        "df_logo_text_size_pc" => "28",
                        "df_logo_text_size_tb" => "24",
                        "df_logo_text_size_sp" => "20",
                        "df_logo_img_size_pc" => "40",
                        "df_logo_img_size_tb" => "36",
                        "df_logo_img_size_sp" => "30",
                    ]
                ); ?>
            </div>
            <nav class="header_nav" aria-label="メインナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
                <?php Lw_header_menu_put([
                    "location" => "header",
                    "ptn" => "ptn_7",
                    "df_menu_1st_layer_text_color" => "#222",
                    "df_menu_current_text_color" => "",
                    "df_menu_current_bg_color" => "var(--color-main)",
                    "df_menu_1st_layer_hover_text_color" => "var(--color-main)",
                    "df_menu_1st_layer_hover_bg_color" => "var(--color-main)",
                ]);?>
            </nav>
            <?php Lw_cta_btn_1_set([
                "location" => "header",
                "ptn" => "ptn_7",
                "df_cta_btn_switch" => "on",
                "df_cta_btn_text" => "予約する",
                "df_cta_btn_link" => "#",
                "df_cta_btn_bg_color" => "var(--color-main)",
                "df_cta_btn_text_color" => "#ffffff",
                "df_cta_btn_bd_color" => "var(--color-main)",
                "df_cta_btn_border_radius" => "100",
            ])?>
            <div class="ham_btn drawer_nav_open">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
    <style>
        .header_ptn_7 .ham_btn div {
            background: <?= esc_attr($menu_text_color) ?>;
        }
    </style>
</header>
<?php Lw_follow_menu_put([
    "location" => "header",
    "ptn" => "ptn_7",
]);?>
