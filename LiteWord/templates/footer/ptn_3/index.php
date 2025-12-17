<?php if ( !defined( 'ABSPATH' ) ) exit; ?>
<link rel="stylesheet" href="<?=get_template_directory_uri()?>/templates/footer/ptn_3/style.css">
<footer class="lw_footer_main footer_ptn_3">
    <?php 
        // ウィジェット
        $widget_switch = Lw_theme_mod_set("footer_ptn_3_set_widget_switch", "off");
        if($widget_switch === "on") get_template_part( 'templates/footer/widget' );
    
    ?>
    <div class="inner">
        <div class="left">
            <div class="logo">
                <?php Lw_logo_set(
                    [
                        "location" => "footer",
                        "ptn" => "ptn_3",
                        "df_logo_switch" => "logo_text",
                        "df_logo_text_color" => "#000",
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
                $logo_bottom_text = Lw_theme_mod_set("footer_ptn_3_set_logo_bottom_text", "");
                if(!empty($logo_bottom_text)):
            ?>
            <div class="text_in">
                <?=brSt($logo_bottom_text)?>
            </div>
            <?php endif; ?>
        </div>
        <div class="right">
            <nav class="footer_nav" aria-label="フッターナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
                <?php lw_footer_menu("ptn_3");?>
                <ul class="sub">
                    <?php
                        for ($i=1; $i <= 3; $i++) :
                            $text = Lw_theme_mod_set("footer_ptn_3_set_sub_menu_item_{$i}_text", "");
                            $url = Lw_theme_mod_set("footer_ptn_3_set_sub_menu_item_{$i}_url", "");
                            if(!empty($text)):
                    ?>
                            <li><a href="<?=$url?>"><?=$text?></a></li>
                    <?php endif;endfor; ?>
                </ul>
            </nav>

        </div>
    </div>
    <?php Lw_copyright_1_set([
        "location" => "footer",
        "ptn" => "ptn_3",
        "color_text" => Lw_theme_mod_set("footer_ptn_3_set_color_text_all", "#C6C6C6"),
    ])?>
</footer>
<style>
    .footer_ptn_3{
        background-color: <?=Lw_theme_mod_set("footer_ptn_3_set_color_bg_all", "#fff")?>;
    }
    .footer_ptn_3 .logo a .text,
    .footer_ptn_3 .inner .right .footer_nav > ul li a,
    .footer_ptn_3 .inner .left .text_in,
    .footer_ptn_3 .inner .left .text_in a
    .footer_ptn_3 .copyright p{
        color: <?=Lw_theme_mod_set("footer_ptn_3_set_color_text_all", "#000")?>;
    }
</style>