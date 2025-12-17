<?php 
if ( !defined( 'ABSPATH' ) ) exit;
get_header(); 
get_template_part( "templates/loading_anime/index" );
get_template_part( 'templates/header/index' );
get_template_part('templates/drawer/index');
?>
<main>
    <?php get_template_part('templates/archive/fv/index'); ?>
    <?php get_template_part('templates/archive/cat_common_content/index'); ?>
    <?php get_template_part('templates/archive/body/index'); ?>
    <?php get_template_part('templates/archive/post_list/index'); ?>
</main>
<?php 
get_template_part( "templates/footer/index" );
get_template_part( "templates/return_top/index" );
Lw_theme_mod_set("body_set_after");
get_template_part( "templates/follow_bottom_cta/index" );
get_template_part( "templates/deadline_setting/index" );
get_template_part( "templates/creator_comment/index" );
$lw_custom_css = Lw_put_text("lw_custom_css","");
if( !empty($lw_custom_css) ) {
    echo "<style>{$lw_custom_css}</style>";
}
get_footer(); 