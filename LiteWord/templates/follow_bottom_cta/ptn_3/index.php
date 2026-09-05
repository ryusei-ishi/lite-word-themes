<?php
if ( !defined( 'ABSPATH' ) ) exit;
// css, jsの読み込み
wp_enqueue_style('follow_bottom_cta_03_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_3/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$tip_switch = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_tip_switch","on");
$tip_text   = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_tip_text","オンラインで相談受付中");
$btn_text   = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_btn_text","お問い合わせ");
$btn_icon   = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_btn_icon","message");
$btn_link   = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_btn_link","");
$color_bg   = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_color_bg","");
$color_text = Lw_theme_mod_set("follow_bottom_cta_ptn_3_set_color_text","");
?>
<div class="follow_bottom_cta_03 follow_bottom_cta<?= $responsive_class ?>">
    <?php if ($tip_switch !== 'off' && !empty($tip_text)) : ?>
    <span class="follow_bottom_cta_03__tip"><?= esc_html($tip_text) ?></span>
    <?php endif; ?>
    <a href="<?= esc_url($btn_link) ?>" class="follow_bottom_cta_03__btn" style="background-color:<?=$color_bg?>; color:<?=$color_text?>;">
        <?php if (!empty($btn_icon)) get_template_part( "assets/image/icon/{$btn_icon}" ); ?>
        <span class="follow_bottom_cta_03__label"><?= esc_html($btn_text) ?></span>
    </a>
</div>
<style>
    .follow_bottom_cta_03__btn svg{ fill:<?=$color_text?> !important; }
    /* レスポンシブ表示切替 */
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>
