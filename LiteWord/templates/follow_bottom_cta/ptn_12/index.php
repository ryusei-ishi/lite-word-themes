<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_12_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_12/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_12_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$handle_text = Lw_theme_mod_set("follow_bottom_cta_ptn_12_set_handle_text","お問い合わせ方法を見る");
$color_main  = Lw_theme_mod_set("follow_bottom_cta_ptn_12_set_color_main","");

$row_defaults = [
    1 => ['text' => '電話をかける', 'icon' => 'tel'],
    2 => ['text' => 'LINEで相談する', 'icon' => 'line'],
    3 => ['text' => 'メールを送る', 'icon' => 'mail'],
    4 => ['text' => 'アクセス・地図を見る', 'icon' => 'map'],
];
?>
<div class="follow_bottom_cta_12 follow_bottom_cta<?= $responsive_class ?>" data-lw_drawer_toggle>
    <div class="follow_bottom_cta_12__panel">
        <?php foreach ($row_defaults as $i => $d) :
            $switch = Lw_theme_mod_set("follow_bottom_cta_ptn_12_set_{$i}_switch","on");
            if ($switch === 'off') continue;
            $text = Lw_theme_mod_set("follow_bottom_cta_ptn_12_set_{$i}_text", $d['text']);
            if (empty($text)) continue;
            $icon = Lw_theme_mod_set("follow_bottom_cta_ptn_12_set_{$i}_icon", $d['icon']);
            $link = Lw_theme_mod_set("follow_bottom_cta_ptn_12_set_{$i}_link","");
        ?>
        <a href="<?= esc_url($link) ?>" class="follow_bottom_cta_12__row">
            <span class="follow_bottom_cta_12__icon" style="background-color:<?=$color_main?>;">
                <?php if (!empty($icon)) get_template_part( "assets/image/icon/{$icon}" ); ?>
            </span>
            <span><?= esc_html($text) ?></span>
            <svg class="follow_bottom_cta_12__chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <?php endforeach; ?>
    </div>
    <button type="button" class="follow_bottom_cta_12__handle" style="background-color:<?=$color_main?>;" data-lw_drawer_btn aria-expanded="false">
        <span><?= esc_html($handle_text) ?></span>
        <svg class="follow_bottom_cta_12__chev_up" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
    document.querySelectorAll('[data-lw_drawer_toggle]').forEach(function(root){
        var btn = root.querySelector('[data-lw_drawer_btn]');
        if (!btn) return;
        btn.addEventListener('click', function(){
            var open = root.classList.toggle('is_open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });
}
</script>
