<?php
if ( !defined( 'ABSPATH' ) ) exit;

// CSSの読み込み
wp_enqueue_style('post_fv_2_style', get_template_directory_uri() . '/templates/post_fv/fv_ptn_3/style.min.css', array(), css_version(), 'all');

// インラインスタイルの追加
$custom_css = "
    .post_fv_ptn_3 .image_thumbnail::after {
        background-color: ".Lw_put_color('fv_filter_color', '#000').";
        opacity: ".Lw_put_range('fv_filter_opacity', '30')."%;
    }
";
wp_add_inline_style('post_fv_2_style', $custom_css);
?>
<header class="post_fv_ptn_3">
    <?php 
    $thumbnail_url = Lw_put_text("fv_image");
    if(empty($thumbnail_url)){
        $thumbnail_url = get_the_post_thumbnail_url();
    }else{
        $lw_fv_src = wp_get_attachment_image_src($thumbnail_url, 'full');
        $thumbnail_url = is_array($lw_fv_src) ? $lw_fv_src[0] : '';
    }
    // 属性に入れる前に必ず URL として整える（2026-11-02 の点検 T1）
    ?>
    <div class="image_thumbnail" style="background-image: url(<?= lw_css_url( (string) $thumbnail_url ) ?>);" itemprop="image">
        <div class="ttl_wrap_in">
            <h1 class="post_title" itemprop="headline">
                <?=brSt(Lw_put_text("ttl_main",get_the_title()))?>
            </h1>
            <p><?=brSt(Lw_put_text("ttl_sub",""))?></p>
        </div>
    </div>
</header>
