<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('side_follow_sns_ptn_1_style', get_template_directory_uri() . '/templates/side_follow_sns/ptn_1/style.min.css', array(), css_version(), 'all');
$set_id = "side_follow_sns_ptn_1_set";
$position = Lw_theme_mod_set("{$set_id}_position", "right");
$responsive = Lw_theme_mod_set("{$set_id}_responsive_switch", "sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_side_sns_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_side_sns_pc_only';
$icon_color = Lw_theme_mod_set("{$set_id}_sns_icon_color", "var(--color-main)");
$bg_color = Lw_theme_mod_set("{$set_id}_sns_bg_color", "#ffffff");
?>
<div class="side_follow_sns side_follow_sns_ptn_1 pos-<?=esc_attr($position)?><?=$responsive_class?>">
    <nav class="sns_links">
        <ul>
            <?php lw_side_follow_sns_render_icons($set_id, 6, false); ?>
        </ul>
    </nav>
</div>
<style>
    .side_follow_sns_ptn_1 .sns_links ul{
        background: <?=esc_attr($bg_color)?>;
    }
    .side_follow_sns_ptn_1 .sns_links ul li a svg{
        fill: <?=esc_attr($icon_color)?> !important;
    }
</style>
