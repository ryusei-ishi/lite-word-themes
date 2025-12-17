<?php
if ( !defined( 'ABSPATH' ) ) exit; 
 $description = get_bloginfo('description');
$header_all_bg_color = get_theme_mod('header_ptn_3_set_all_bg_color', 'var(--color-main)');
?>
<header class="lw_header_main header_ptn_3" itemscope itemtype="http://schema.org/WPHeader">
    <?php lw_information_bar_put([
        "location" => "header",
        "ptn" => "ptn_3",
        "df_switch" => "off",
    ])?>
    <div class="inner" style="background-color: <?= esc_attr($header_all_bg_color) ?>;">
        <div class="logo">
            <?php Lw_logo_set(
                [
                    "location" => "header",
                    "ptn" => "ptn_3",
                    "df_logo_switch" => "logo_img",
                    "df_logo_text_color" => "#fff",
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
                "ptn" => "ptn_3",
                "df_menu_current_text_color" => "",
                "df_menu_current_bg_color" => "",
                "df_menu_1st_layer_text_color" => "#fff",
                "df_menu_1st_layer_hover_text_color" => "#fff",
                "df_menu_1st_layer_hover_bg_color" => "var(--color-accent)",
                "df_menu_2st_layer_bg_color" => "#222",
            ]);?>
            <?php Lw_cta_btn_1_set([
                "location" => "header",
                "ptn" => "ptn_3",
                "df_cta_btn_switch" => "on",
                "df_cta_btn_text" => "ご予約はこちら",
                "df_cta_btn_link" => "#",
                "df_cta_btn_bg_color" => "var(--color-accent)",
                "df_cta_btn_text_color" => "#fff",
                "df_cta_btn_border_radius" => "0",
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
    "ptn" => "ptn_3",
]);?>
