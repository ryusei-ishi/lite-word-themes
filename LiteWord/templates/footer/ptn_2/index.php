<?php if ( !defined( 'ABSPATH' ) ) exit; ?>
<link rel="stylesheet" href="<?=get_template_directory_uri()?>/templates/footer/ptn_2/style.css">
<footer class="lw_footer_main footer_ptn_2">
    <?php 
        // ウィジェット
        $widget_switch = Lw_theme_mod_set("footer_ptn_2_set_widget_switch", "off");
        if($widget_switch === "on") get_template_part( 'templates/footer/widget' );
    
    ?>
    <div class="inner">
        <div class="logo">
        <?php Lw_logo_set(
            [
                "location" => "footer",
                "ptn" => "ptn_2",
                "df_logo_switch" => "logo_text",
                "df_logo_text_color" => "#fff",
                "df_logo_text_font" => "mincho",
                "df_logo_text_size_pc" => "48",
                "df_logo_text_size_tb" => "40",
                "df_logo_text_size_sp" => "36",
                "df_logo_img_size_pc" => "40",
                "df_logo_img_size_tb" => "32",
                "df_logo_img_size_sp" => "28",
            ]
        ); ?>
        </div>
        <?php
            $logo_bottom_text = Lw_theme_mod_set("footer_ptn_2_set_logo_bottom_text", "");
            if(!empty($logo_bottom_text)):
        ?>
            <div class="logo_bottom text_in">
                <?=brSt($logo_bottom_text)?>
            </div>
            <?php endif; ?>
        <?php Lw_sns_icon_1_set([
            "location" => "footer",
            "ptn" => "ptn_2",
            "number_of_items" => "4",
            "icon_color" => "#fff",
        ])?>
        <nav class="footer_nav" aria-label="フッターナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
            <?php lw_footer_menu("ptn_2");?>
        </nav>
        <?php Lw_copyright_1_set([
            "location" => "footer",
            "ptn" => "ptn_2",
            "color_text" => "#fff",
        ])?>
    </div>
</footer>
<style>
    .footer_ptn_2 .inner{
        background-color: <?=Lw_theme_mod_set("footer_ptn_2_set_bg_color", "var(--color-main)")?>;
    }
</style>