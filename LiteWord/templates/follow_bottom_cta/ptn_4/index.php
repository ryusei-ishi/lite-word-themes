<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_04_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_4/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_4_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$price       = Lw_theme_mod_set("follow_bottom_cta_ptn_4_set_price","980");
$price_unit  = Lw_theme_mod_set("follow_bottom_cta_ptn_4_set_price_unit","/月（税込）");
$badge_text  = Lw_theme_mod_set("follow_bottom_cta_ptn_4_set_badge_text","今なら初月無料");
$btn_text    = Lw_theme_mod_set("follow_bottom_cta_ptn_4_set_btn_text","今すぐ申し込む");
$btn_link    = Lw_theme_mod_set("follow_bottom_cta_ptn_4_set_btn_link","");
$color_accent = Lw_theme_mod_set("follow_bottom_cta_ptn_4_set_color_accent","");
?>
<div class="follow_bottom_cta_04 follow_bottom_cta<?= $responsive_class ?>" style="border-top-color:<?=$color_accent?>;">
    <div class="follow_bottom_cta_04__price">
        <span class="follow_bottom_cta_04__yen">¥</span><?= esc_html($price) ?><span class="follow_bottom_cta_04__unit"><?= esc_html($price_unit) ?></span>
    </div>
    <?php if (!empty($badge_text)) : ?>
    <div class="follow_bottom_cta_04__divider"></div>
    <div class="follow_bottom_cta_04__badge" style="color:<?=$color_accent?>;"><?= esc_html($badge_text) ?></div>
    <?php endif; ?>
    <a href="<?= esc_url($btn_link) ?>" class="follow_bottom_cta_04__btn" style="background-color:<?=$color_accent?>;"><?= esc_html($btn_text) ?></a>
</div>
<style>
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>
