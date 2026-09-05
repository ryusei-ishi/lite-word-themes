<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_07_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_7/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$tip_switch = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_tip_switch","on");
$tip_text   = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_tip_text","ご質問はこちら");
$fab_color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_fab_color_bg","");
$badge_text = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_badge_text","1");

$menu_defaults = [
    1 => ['text' => '電話する', 'icon' => 'tel'],
    2 => ['text' => 'LINEで相談', 'icon' => 'line'],
    3 => ['text' => 'メールを送る', 'icon' => 'mail'],
];
?>
<div class="follow_bottom_cta_07 follow_bottom_cta<?= $responsive_class ?>" data-lw_chat_toggle>
    <div class="follow_bottom_cta_07__menu">
        <?php for ($i = 3; $i >= 1; $i--) :
            $switch = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_{$i}_switch","on");
            if ($switch === 'off') continue;
            $text = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_{$i}_text", $menu_defaults[$i]['text']);
            if (empty($text)) continue;
            $icon = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_{$i}_icon", $menu_defaults[$i]['icon']);
            $link = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_{$i}_link","");
            $color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_7_set_{$i}_color_bg","");
        ?>
        <a href="<?= esc_url($link) ?>" class="follow_bottom_cta_07__item">
            <span class="follow_bottom_cta_07__label"><?= esc_html($text) ?></span>
            <span class="follow_bottom_cta_07__icon" style="background-color:<?=$color_bg?>;">
                <?php if (!empty($icon)) get_template_part( "assets/image/icon/{$icon}" ); ?>
            </span>
        </a>
        <?php endfor; ?>
    </div>
    <?php if ($tip_switch !== 'off' && !empty($tip_text)) : ?>
    <span class="follow_bottom_cta_07__tip"><?= esc_html($tip_text) ?></span>
    <?php endif; ?>
    <button type="button" class="follow_bottom_cta_07__fab" style="background-color:<?=$fab_color_bg?>;" data-lw_chat_btn aria-expanded="false" aria-label="お問い合わせメニューを開く">
        <span class="follow_bottom_cta_07__icon-open"><?php get_template_part( "assets/image/icon/message" ); ?></span>
        <svg class="follow_bottom_cta_07__icon-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
        <?php if (!empty($badge_text)) : ?><span class="follow_bottom_cta_07__badge"><?= esc_html($badge_text) ?></span><?php endif; ?>
    </button>
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
    document.querySelectorAll('[data-lw_chat_toggle]').forEach(function(root){
        var btn = root.querySelector('[data-lw_chat_btn]');
        if (!btn) return;
        btn.addEventListener('click', function(){
            var open = root.classList.toggle('is_open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });
}
</script>
