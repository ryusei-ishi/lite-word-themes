<?php
if ( ! defined( 'ABSPATH' ) ) exit;

$short_code = Lw_theme_mod_set("archive_ptn_short_code_set_fv_put");
if(!empty($short_code)){
    echo do_shortcode($short_code);
}
