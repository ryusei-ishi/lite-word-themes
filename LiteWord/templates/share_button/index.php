<?php 
get_template_part( "templates/share_button/ptn_1/index", ""  , $args );
wp_enqueue_script('lw_share', get_template_directory_uri() . '/assets/js/lw_share.js', array(), css_version(), true); 
?>
