<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_06_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_6/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_6_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

// リボン・訴求文・期限は、入れたときだけ出す（前は既定で「今だけ」「初回限定 50%OFF」「今月末まで」が出ていた。実在しない割引や期限を公開ページに出さない・2026-11-07）
$ribbon_text = Lw_theme_mod_set("follow_bottom_cta_ptn_6_set_ribbon_text","");
$main_text   = Lw_theme_mod_set("follow_bottom_cta_ptn_6_set_main_text","");
$sub_text    = Lw_theme_mod_set("follow_bottom_cta_ptn_6_set_sub_text","");
$btn_text    = Lw_theme_mod_set("follow_bottom_cta_ptn_6_set_btn_text","詳しくみる");
$btn_link    = Lw_theme_mod_set("follow_bottom_cta_ptn_6_set_btn_link","");
$color_bg    = Lw_theme_mod_set("follow_bottom_cta_ptn_6_set_color_bg","");
?>
<div class="follow_bottom_cta_06 follow_bottom_cta<?= $responsive_class ?>" style="background-color:<?=$color_bg?>;">
    <?php if (!empty($ribbon_text)) : ?>
    <span class="follow_bottom_cta_06__ribbon"><?= esc_html($ribbon_text) ?></span>
    <?php endif; ?>
    <?php if (!empty($main_text) || !empty($sub_text)) : ?>
    <div class="follow_bottom_cta_06__copy">
        <?php if (!empty($main_text)) : ?><strong><?= esc_html($main_text) ?></strong><?php endif; ?>
        <?php if (!empty($sub_text)) : ?><span><?= esc_html($sub_text) ?></span><?php endif; ?>
    </div>
    <?php endif; ?>
    <a href="<?= esc_url($btn_link) ?>" class="follow_bottom_cta_06__btn" style="color:<?=$color_bg?>;"><?= esc_html($btn_text) ?></a>
</div>
<style>
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>
