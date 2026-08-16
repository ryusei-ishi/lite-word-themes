<?php
if ( ! defined( 'ABSPATH' ) ) exit;

$short_code = Lw_theme_mod_set("single_post_layout_fv_ptn_short_code_put");
if(!empty($short_code)){
    echo do_shortcode($short_code);
}
