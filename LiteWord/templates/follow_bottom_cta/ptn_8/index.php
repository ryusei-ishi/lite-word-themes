<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_08_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_8/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_8_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$defaults = [
    'a' => ['main' => 'はじめての方', 'sub' => '無料体験はこちら', 'icon' => 'turn-up'],
    'b' => ['main' => '在校生の方', 'sub' => 'マイページへ', 'icon' => 'user'],
];
?>
<div class="follow_bottom_cta_08 follow_bottom_cta<?= $responsive_class ?>">
    <?php foreach ($defaults as $key => $d) :
        $main = Lw_theme_mod_set("follow_bottom_cta_ptn_8_set_{$key}_main", $d['main']);
        $sub  = Lw_theme_mod_set("follow_bottom_cta_ptn_8_set_{$key}_sub", $d['sub']);
        $icon = Lw_theme_mod_set("follow_bottom_cta_ptn_8_set_{$key}_icon", $d['icon']);
        $link = Lw_theme_mod_set("follow_bottom_cta_ptn_8_set_{$key}_link", "");
        $color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_8_set_{$key}_color_bg", "");
    ?>
    <a href="<?= esc_url($link) ?>" class="follow_bottom_cta_08__half follow_bottom_cta_08__half--<?=$key?>" style="background-color:<?=$color_bg?>;">
        <?php if (!empty($icon)) get_template_part( "assets/image/icon/{$icon}" ); ?>
        <span class="main"><?= esc_html($main) ?></span>
        <?php if (!empty($sub)) : ?><span class="sub"><?= esc_html($sub) ?></span><?php endif; ?>
    </a>
    <?php endforeach; ?>
</div>
<style>
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>
