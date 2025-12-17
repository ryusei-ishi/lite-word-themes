<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('lw_share_buttons_ptn_1_style', get_template_directory_uri() . '/templates/share_button/ptn_1/style.min.css', array(), css_version(), 'all');
?>
<div class="lw_share_buttons ptn_1">
	<?php
	for ($i=1; $i <= 5 ; $i++) { 
		$set =  Lw_theme_mod_set("single_post_layout_share_button_{$args}_sns_{$i}","off");
		if($set !== "off"){
			echo lw_render_share_button( $set );
		}
	}
	?>
	<span class="lw_share_copy_feedback" style="display:none;"><div>コピーしました！</div></span>
</div>
