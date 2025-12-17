<?php 
if ( !defined( 'ABSPATH' ) ) exit;

// ページのコンテンツの影の有無を取得
$page_content_shadow = Lw_put_text("page_content_shadow","off");
if($page_content_shadow === "on") {
    $page_content_shadow = "shadow";
} else {
    $page_content_shadow = "";
}

get_header(); 
get_template_part( "templates/loading_anime/index" );
get_template_part( 'templates/header/index' );
get_template_part('templates/drawer/index');
?>

<main>
    <div class="lw_content_wrap page">
        <div class="main_content">
            <section class="post_content">
                <div class="post_style page <?=$page_content_shadow?>">
                    <div class="first_content"></div>
                    <?php the_content()?>
                    <div class="last_content"></div>
                </div>
            </section>
        </div>
    </div>
</main>

<?php if ( is_active_sidebar( 'page_bottom' ) ) : ?>
    <aside class="page_bottom">
        <?php dynamic_sidebar( 'page_bottom' ); ?>
    </aside>
<?php endif; ?>

<style>
    <?php
    $color_page_bg_pc_opacity = Lw_put_text("color_page_bg_pc_opacity", "100");
    ?>
    body:after{
        opacity: <?=esc_attr($color_page_bg_pc_opacity)?>%;
    }
</style>

<?php 
get_template_part('templates/page_bg_image/index'); 
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
