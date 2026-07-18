<?php
$short_code = Lw_theme_mod_set("header_ptn_short_code_set_put");
if(!empty($short_code)){
    echo do_shortcode($short_code);
}