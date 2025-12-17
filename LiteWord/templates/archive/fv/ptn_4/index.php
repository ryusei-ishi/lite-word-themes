<?php
if ( !defined( 'ABSPATH' ) ) exit;

// css, jsの読み込み
wp_enqueue_style('archive_fv_ptn_4_style', get_template_directory_uri() . '/templates/archive/fv/ptn_4/style.min.css', array(), css_version(), 'all');
$fv_data = LwTitlePut();
$bg_img = $fv_data["thumbnail"];
if(empty($bg_img)){
    $bg_img = Lw_theme_mod_set("archive_page_layout_fv_df_image");
}
?>
<section id="archive_fv_ptn_4" class="archive_fv_ptn_4" itemscope itemtype="http://schema.org/WebPage">
    <div class="inner">
        <h1 class="title" data-lw_font_set="<?=Lw_theme_mod_set("archive_page_layout_fv_df_font", "mincho")?>" itemprop="headline"><?php echo esc_html($fv_data["title"]); ?></h1>
        <?php if (is_category() && !empty($fv_data["category_description"])) : ?>
            <p itemprop="description"><?=$fv_data["category_description"]?></p>
        <?php elseif (is_404()) : ?>
            <p itemprop="description">申し訳ありませんが、お探しのページは見つかりませんでした。</p>
        <?php elseif (is_search()) : ?>
            <p itemprop="description"><?php echo get_search_query(); ?> の検索結果です。</p>
        <?php elseif (!empty($fv_data["catchphrase"])) : ?>
            <p itemprop="description"><?php echo wp_kses_post($fv_data["catchphrase"]); ?></p>
        <?php elseif (!empty($fv_data["page_sub_title"])) : ?>
            <p itemprop="description"><?php echo wp_kses_post($fv_data["page_sub_title"]); ?></p>
        <?php endif; ?>
        <div class="bg_img lazyload"  data-bg="<?php echo esc_url($bg_img); ?>" itemprop="image"></div>
    </div>
    <?php if(!empty($bg_img)):?>
        <div class="bg_img" src="<?php echo esc_url($bg_img); ?>" itemprop="image"></div>
    <?php endif?>
</section>
<style>
    .archive_fv_ptn_4{
        min-height: 280px;
        background-color: <?=Lw_theme_mod_set("archive_page_layout_fv_df_bg_color", "var(--color-main)")?>;
        color: <?=Lw_theme_mod_set("archive_page_layout_fv_df_text_color", "#000")?>;
    }
    .archive_fv_ptn_4 h1.title{
        font-weight: <?=Lw_theme_mod_set("archive_page_layout_fv_df_font_weight", "700")?>;
    }
    @media (max-width: 980px) {
        .archive_fv_ptn_4{
            min-height: 240px;
        }
    }
    @media (max-width: 600px) {
        .archive_fv_ptn_4{
            min-height: 200px;
        }
    }
    @media (max-width: 500px) {
        .archive_fv_ptn_4{
            min-height: 180px;
        }
    }
    .archive_fv_ptn_4 .bg_img::after{
        <?php
            $filter_color = Lw_theme_mod_set("archive_page_layout_fv_df_image_filter_color", "#000000");
            if($filter_color == "#939393"){
                $filter_color = "#000000";
            }
        ?>
        background: <?=$filter_color?>;
        opacity: <?=Lw_theme_mod_set("archive_page_layout_fv_df_image_filter_op", "30")?>%;
    }
</style>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const bgImg = document.querySelector('.archive_fv_ptn_4 .bg_img.lazyload');
        if (!bgImg) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bgUrl = bgImg.getAttribute('data-bg');
                    if (bgUrl) {
                        bgImg.style.backgroundImage = `url(${bgUrl})`;
                        observer.unobserve(bgImg); // 一度読み込んだら監視を解除
                    }
                }
            });
        });

        observer.observe(bgImg);
    });
</script>

<div class="archive_fv_ptn_4_breadcrumbs">
    <?php get_template_part('templates/breadcrumbs/index'); ?>
</div>