<?php
// footer_widget_area_all は常に表示
if ( is_active_sidebar( 'footer_widget_area_all' ) ) :
    echo '<aside class="footer_widget_area_all" style="background-color: #fff;">';
    dynamic_sidebar( 'footer_widget_area_all' );
    echo '</aside>';
endif;
// 他のフッターウィジェットは設定に従う
$widget_switch = Lw_theme_mod_set("footer_ptn_4_set_widget_switch", "off");
if($widget_switch === "on") get_template_part( 'templates/footer/widget' );

$short_code = Lw_theme_mod_set("footer_ptn_short_code_set_put");
if(!empty($short_code)){
    echo do_shortcode($short_code);
}