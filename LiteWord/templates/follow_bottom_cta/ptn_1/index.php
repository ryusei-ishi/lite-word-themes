<?php
if ( !defined( 'ABSPATH' ) ) exit;
// css, jsの読み込み
wp_enqueue_style('follow_bottom_cta_01_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_1/style.min.css', array(), css_version(), 'all');
$switch = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_1_switch","none");
$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';
?>
<div class="follow_bottom_cta_01 follow_bottom_cta<?= $responsive_class ?>">
    <ul>
        <?php 
            $font_family = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_font_family","");
            $font_weight = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_font_weight","500");
            for ($i=1; $i <=2 ; $i++) :
                $switch = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_{$i}_switch","on");
                if($switch == "off") continue;
                $text = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_{$i}_text","メールで問合せ");
                $icon = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_{$i}_icon","");
                $link = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_{$i}_link","");
                $color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_{$i}_color_bg","");
                $color_text = Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_{$i}_color_text","");
        ?>
        <li>
            <a href="<?=$link?>" class="fw-<?=$font_weight?>" data-lw_font_set="<?=$font_family?>" style="background-color:<?=$color_bg?>; color:<?=$color_text?>;">
                <?php get_template_part( "assets/image/icon/{$icon}" ); ?>
                <p><?=$text?></p>
            </a>
        </li>
        <?php endfor; ?>
    </ul>
</div>
<style>
    .follow_bottom_cta_01:after{
        opacity: <?=Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_bg_op","90")?>%;
        background: <?=Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_bg_color","#ffffff")?>;
    }
    .follow_bottom_cta_01>ul li a{
        border-radius: <?=Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_range","100")?>px;

    }
    .follow_bottom_cta_01>ul li:nth-of-type(1) a svg{
        fill: <?=Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_1_color_text","")?> !important;
    }
    .follow_bottom_cta_01>ul li:nth-of-type(2) a svg{
        fill: <?=Lw_theme_mod_set("follow_bottom_cta_ptn_1_set_2_color_text","")?> !important;
    }
    /* レスポンシブ表示切替 */
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>