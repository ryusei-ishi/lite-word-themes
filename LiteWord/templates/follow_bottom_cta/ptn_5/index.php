<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_05_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_5/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$status_text   = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_status_text","只今受付中");
$hours_text    = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_hours_text","本日 9:00〜18:00");
$color_dot     = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_color_dot","");
$tel_text      = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_tel_text","電話する");
$tel_link      = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_tel_link","");
$tel_color_bg  = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_tel_color_bg","");
$line_text     = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_line_text","LINEで相談");
$line_link     = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_line_link","");
$line_color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_5_set_line_color_bg","");
?>
<div class="follow_bottom_cta_05 follow_bottom_cta<?= $responsive_class ?>">
    <div class="follow_bottom_cta_05__info">
        <span class="follow_bottom_cta_05__dot" style="background-color:<?=$color_dot?>;"></span>
        <div class="follow_bottom_cta_05__text">
            <strong><?= esc_html($status_text) ?></strong>
            <?php if (!empty($hours_text)) : ?><span><?= esc_html($hours_text) ?></span><?php endif; ?>
        </div>
    </div>
    <div class="follow_bottom_cta_05__actions">
        <?php if (!empty($tel_text)) : ?>
        <a href="<?= esc_url($tel_link) ?>" class="follow_bottom_cta_05__btn" style="background-color:<?=esc_attr($tel_color_bg)?>;">
            <?php get_template_part( "assets/image/icon/tel" ); ?>
            <span><?= esc_html($tel_text) ?></span>
        </a>
        <?php endif; ?>
        <?php if (!empty($line_text)) : ?>
        <a href="<?= esc_url($line_link) ?>" class="follow_bottom_cta_05__btn follow_bottom_cta_05__btn--line" style="background-color:<?=$line_color_bg?>;">
            <?php get_template_part( "assets/image/icon/line" ); ?>
            <span><?= esc_html($line_text) ?></span>
        </a>
        <?php endif; ?>
    </div>
</div>
<style>
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>
