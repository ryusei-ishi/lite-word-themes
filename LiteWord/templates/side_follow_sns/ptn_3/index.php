<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('side_follow_sns_ptn_3_style', get_template_directory_uri() . '/templates/side_follow_sns/ptn_3/style.min.css', array(), css_version(), 'all');
$set_id = "side_follow_sns_ptn_3_set";
$position = Lw_theme_mod_set("{$set_id}_position", "right");
$responsive = Lw_theme_mod_set("{$set_id}_responsive_switch", "sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_side_sns_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_side_sns_pc_only';
$icon_color = Lw_theme_mod_set("{$set_id}_sns_icon_color", "var(--color-main)");
$bg_color = Lw_theme_mod_set("{$set_id}_sns_bg_color", "#ffffff");
$tab_text = Lw_theme_mod_set("{$set_id}_tab_text", "");
if(empty($tab_text)) $tab_text = "SNS";
?>
<div class="side_follow_sns side_follow_sns_ptn_3 pos-<?=esc_attr($position)?><?=$responsive_class?>">
    <button type="button" class="side_follow_sns_ptn_3__tab" aria-expanded="false">
        <span><?=esc_html($tab_text)?></span>
    </button>
    <nav class="sns_links">
        <ul>
            <?php lw_side_follow_sns_render_icons($set_id, 6, false); ?>
        </ul>
    </nav>
</div>
<style>
    .side_follow_sns_ptn_3 .sns_links ul,
    .side_follow_sns_ptn_3__tab{
        background: <?=esc_attr($bg_color)?>;
    }
    .side_follow_sns_ptn_3 .sns_links ul li a svg{
        fill: <?=esc_attr($icon_color)?> !important;
    }
    .side_follow_sns_ptn_3__tab span{
        color: <?=esc_attr($icon_color)?>;
    }
</style>
<script>
'use strict';
{
    document.addEventListener('click', function(e){
        var tab = e.target.closest('.side_follow_sns_ptn_3__tab');
        if(!tab) return;
        var wrap = tab.closest('.side_follow_sns_ptn_3');
        if(!wrap) return;
        var open = wrap.classList.toggle('is_open');
        tab.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
}
</script>
