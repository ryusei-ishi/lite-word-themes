<?php
if ( !defined( 'ABSPATH' ) ) exit; 
 $description = get_bloginfo('description');
?>
<header class="lw_header_main header_ptn_4" itemscope itemtype="http://schema.org/WPHeader">
    <?php lw_information_bar_put([
        "location" => "header",
        "ptn" => "ptn_4",
        "df_switch" => "off",
    ])?>
    <div class="inner">
        <div class="logo">
            <?php Lw_logo_set(
                [
                    "location" => "header",
                    "ptn" => "ptn_4",
                    "df_logo_switch" => "logo_img",
                    "df_logo_text_color" => "#111",
                    "df_logo_text_font" => "mincho",
                    "df_logo_text_size_pc" => "30",
                    "df_logo_text_size_tb" => "34",
                    "df_logo_text_size_sp" => "38",
                    "df_logo_img_size_pc" => "30",
                    "df_logo_img_size_tb" => "34",
                    "df_logo_img_size_sp" => "38",
                ]
            ); ?>
        </div>
        <nav class="header_nav" aria-label="メインナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
            <?php  Lw_header_menu_put([
                "location" => "header",
                "ptn" => "ptn_4",
                "df_menu_current_text_color" => "",
                "df_menu_current_bg_color" => "",
                "df_menu_1st_layer_hover_text_color" => "#555",
                "df_menu_1st_layer_hover_bg_color" => "var(--color-accent)",
            ]);?>
            <?php Lw_cta_btn_1_set([
                "location" => "header",
                "ptn" => "ptn_4",
                "df_cta_btn_switch" => "on",
                "df_cta_btn_text" => "お問い合わせ",
                "df_cta_btn_link" => "#",
                "df_cta_btn_bg_color" => "var(--color-main)",
                "df_cta_btn_text_color" => "#ffffff",
                "df_cta_btn_bd_color" => "var(--color-main)",
                "df_cta_btn_bd_width" => "1",
                "df_cta_btn_border_radius" => "100",
                "df_cta_btn_hover_bg_color" => "#ffffff",
                "df_cta_btn_hover_text_color" => "var(--color-main)",

            ])?>
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
    "ptn" => "ptn_4",
]);?>
