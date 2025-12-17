<?php
if ( !defined( 'ABSPATH' ) ) exit; 
$tel_cta_switch = Lw_theme_mod_set("header_ptn_1_set_cta_tel_switch", "off");
$cta_btn_switch = Lw_theme_mod_set("header_ptn_1_set_cta_btn_switch", "off");
if ( $tel_cta_switch === "on" || $cta_btn_switch === "on" ) {
    $tel_cta = "tel_on";
} else {
    $tel_cta = "";
}
?>
<header class="lw_header_main header_ptn_1" itemscope itemtype="http://schema.org/WPHeader">
    <?php lw_information_bar_put()?>

    <div class="header_inner <?=$tel_cta?>">
        <div class="logo">
            <?php Lw_logo_set(
                [
                    "location" => "header",
                    "ptn" => "ptn_1",
                    "df_logo_switch" => "logo_img",
                    "df_logo_text_color" => "#111",
                    "df_logo_text_font" => "mincho",
                    "df_logo_text_size_pc" => "34",
                    "df_logo_text_size_tb" => "28",
                    "df_logo_text_size_sp" => "24",
                    "df_logo_img_size_pc" => "30",
                    "df_logo_img_size_tb" => "28",
                    "df_logo_img_size_sp" => "24",
                ]
            ); ?>
        </div>
        <div class="cta_wrap">
            <?php Lw_cta_tel_set([
                "location" => "header",
                "ptn" => "ptn_1",
                "class" => "",
                "switch" => "off",
                "number_text" => "03-1234-5678",
                "number_color" => "var(--color-main)",
                "number_font" => "",
                "number_font_weight" => "600",
                "sub_text" => "受付時間 9:00〜18:00（年中無休）",
                "sub_text_color" => "var(--color-black)",
                "sub_text_font" => "",
                "sub_text_font_weight" => "400",
                "icon_select" => "tel",
                "icon_color" => "var(--color-main)",
            ])?>
            <?php Lw_cta_btn_1_set([
                "location" => "header",
                "ptn" => "ptn_1",
                "df_cta_btn_switch" => "off",
                "df_cta_btn_text" => "ご予約はこちら",
                "df_cta_btn_link" => "#",
                "df_cta_btn_bg_color" => "var(--color-main)",
                "df_cta_btn_text_color" => "#ffffff",
                "df_cta_btn_border_radius" => "0",
            ])?>
        </div>
        <nav class="header_nav" aria-label="メインナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
            <?php Lw_header_menu_put();?>
        </nav>
        <div class="ham_btn drawer_nav_open">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</header>
<?php Lw_follow_menu_put([
    "location" => "header",
    "ptn" => "ptn_1",
]);?>
