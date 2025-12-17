<?php 
if ( !defined( 'ABSPATH' ) ) exit;
/*
Template Name: サイドバー有
*/
// カテゴリーのレイアウト設定値を取得する関数
function get_category_layout_setting($post_id) {
    $categories = get_the_category($post_id);
    if (!empty($categories)) {
        // 最初のカテゴリーのIDを取得
        $category_id = $categories[0]->term_id;
        // カテゴリーメタデータからレイアウト設定を取得
        $layout = get_term_meta($category_id, 'category_layout', true);
        return $layout ? $layout : ""; // 未設定の場合はデフォルトを返す
    }
    return ""; // カテゴリーがない場合のデフォルト値
}
$clm_set = get_category_layout_setting(get_the_ID());
if(empty($clm_set)){
    $clm_set = Lw_theme_mod_set("single_post_layout_clm","clm_2_right");
}
get_header(); 
get_template_part( "templates/loading_anime/index" );
get_template_part( 'templates/header/index' );
get_template_part('templates/drawer/index');
?>
<div class="lw_content_wrap single <?=$clm_set?>" itemscope itemtype="http://schema.org/WebPage">
    <?php 
        //パンクズリストを表示（フロントページではない場合）
        if(!is_front_page() && !is_home()){
            get_template_part('templates/breadcrumbs/index');
        }
        
    ?>
    <div class="main_content">
        <main itemscope itemprop="mainEntity" itemtype="http://schema.org/BlogPosting">
            <article class="post_content">
                <?php 
                    // 投稿のタイトルを表示（固定ページではない場合）
                    if(!is_page()){
                        get_template_part('templates/post_fv/index'); 
                    }
                ?>
                <?php 
                    $share_button_title_btm_switch = Lw_theme_mod_set( 'single_post_layout_share_button_title_btm_switch', 'off' );
                    if($share_button_title_btm_switch == "on"){
                        get_template_part( "templates/share_button/index", ""  , "title_btm" );
                    }
                ?>

                <div class="post_style single" itemprop="articleBody">
                    <?php 
                        // 固定ページではない場合
                        if(!is_page()){
                            echo '<div class="first_content"></div>';
                        }else {
                            echo '<div class="page_first_content"></div>';
                        }
                    ?>
                    <?php the_content()?>
                    <div class="last_content"></div>
                    <?php if ( is_active_sidebar( 'post_padding_bottom' ) ) : ?>
                        <aside>
                            <div class="post_padding_bottom">
                                <?php dynamic_sidebar( 'post_padding_bottom' ); ?>
                            </div>
                        </aside>
                    <?php endif; ?>
                </div>
                <?php get_template_part( "templates/post_nav/index");?>
            </article>
            <?php 
                $share_button_post_btm_switch = Lw_theme_mod_set( 'single_post_layout_share_button_post_btm_switch', 'off' );
                if($share_button_post_btm_switch == "on"){
                    get_template_part( "templates/share_button/index", ""  , "post_btm" );
                }
            ?>
            <?php get_template_part('templates/comment/index'); ?>
        </main>
        <?php if ( is_active_sidebar( 'post_bottom' ) ) : ?>
            <aside>
                <div class="post_bottom">
                    <?php dynamic_sidebar( 'post_bottom' ); ?>
                </div>
            </aside>
        <?php endif; ?>
    </div>
    <?php if ( is_active_sidebar( 'sidebar_pc' ) && $clm_set !== "clm_1") : ?>
        <aside id="sidebar_pc" class="sidebar_pc" itemscope itemtype="http://schema.org/WPSideBar">
            <?php dynamic_sidebar( 'sidebar_pc' ); ?>
        </aside>
    <?php endif; ?>
</div>

<aside><?php get_template_part('templates/post_list_related/1/index'); ?></aside>
<?php 
//目次（固定ページではない場合）
if(!is_page()){
    get_template_part('templates/toc/index');
}
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


