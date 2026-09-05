<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_09_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_9/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_9_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$text        = Lw_theme_mod_set("follow_bottom_cta_ptn_9_set_text","続きが気になる方へ");
$color_bar   = Lw_theme_mod_set("follow_bottom_cta_ptn_9_set_color_bar","");
$btn_text    = Lw_theme_mod_set("follow_bottom_cta_ptn_9_set_btn_text","無料相談する");
$btn_link    = Lw_theme_mod_set("follow_bottom_cta_ptn_9_set_btn_link","");
?>
<div class="follow_bottom_cta_09 follow_bottom_cta<?= $responsive_class ?>">
    <div class="follow_bottom_cta_09__track"><div class="follow_bottom_cta_09__fill" style="background-color:<?=$color_bar?>;" data-lw_read_fill></div></div>
    <div class="follow_bottom_cta_09__row">
        <span class="follow_bottom_cta_09__text"><?= esc_html($text) ?></span>
        <a href="<?= esc_url($btn_link) ?>" class="follow_bottom_cta_09__btn" style="background-color:<?=$color_bar?>;"><?= esc_html($btn_text) ?></a>
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
<script>
'use strict';
{
    var fillEl = document.querySelector('[data-lw_read_fill]');
    if (fillEl) {
        var ticking = false;
        var update = function(){
            var doc = document.documentElement;
            var max = doc.scrollHeight - doc.clientHeight;
            var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            if (pct < 0) pct = 0;
            if (pct > 100) pct = 100;
            fillEl.style.width = pct + '%';
            ticking = false;
        };
        window.addEventListener('scroll', function(){
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }
}
</script>
