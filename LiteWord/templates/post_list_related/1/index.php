<?php
if ( !defined( 'ABSPATH' ) ) exit;

// CSSの読み込み（css_version()が定義されているか確認）
$css_version = function_exists('css_version') ? css_version() : wp_get_theme()->get('Version');
wp_enqueue_style('post_list_related_1_style', get_template_directory_uri() . '/templates/post_list_related/1/style.min.css', array(), $css_version, 'all');

$current_post_id = get_the_ID();
$current_categories = wp_get_post_categories($current_post_id);

if ($current_categories) {
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => 6,
        'post__not_in' => array($current_post_id),
        'category__in' => $current_categories,
        'orderby' => 'rand',
        'no_found_rows' => true, // ページネーション不要なら追加でパフォーマンス向上
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false
    );
    $related_posts = new WP_Query($args);

    if ($related_posts->have_posts()): ?>
        <section class="post_list_related_1" itemscope itemtype="http://schema.org/ItemList">
            <h2>関連記事</h2>
            <div class="post_list_put">
                <?php while ($related_posts->have_posts()): $related_posts->the_post(); ?>
                    <article class="post_item" itemscope itemprop="itemListElement" itemtype="http://schema.org/BlogPosting">
                        <a href="<?php the_permalink(); ?>" itemprop="url">
                            <?php if(has_post_thumbnail()): ?>
                            <figure>
                                <?php 
                                // alt属性を確実に設定
                                the_post_thumbnail('thumbnail', array(
                                    'alt' => esc_attr(get_the_title()),
                                    'loading' => 'lazy' // ネイティブ遅延読み込み
                                )); 
                                ?>
                            </figure>
                            <?php else: ?>
                            <div class="no_image" aria-label="画像なし"></div>
                            <?php endif; ?>
                            
                            <div class="text_in">
                                <h3 class="post_title" itemprop="headline">
                                    <?php 
                                    echo esc_html( mb_strimwidth( get_the_title(), 0, 68, '…', 'UTF-8' ) );
                                    ?>
                                </h3>
                                <?php
                                $categories = get_the_category();
                                if (!empty($categories)):
                                    $first_category = $categories[0];
                                    ?>
                                    <div class="post_category" itemprop="articleSection">
                                        <?php echo esc_html($first_category->name); ?>
                                    </div>
                                <?php endif; ?>
                                <time class="public_date" datetime="<?php echo get_the_date('c'); ?>" itemprop="datePublished">
                                    <?php echo get_the_date('Y.m.d'); ?>
                                </time>
                            </div>
                        </a>
                    </article>
                <?php endwhile; ?>
            </div>
        </section>
    <?php
    endif;
    wp_reset_postdata();
}
?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // すべてのプレースホルダー画像を探して実際の画像を遅延読み込み
    const lazyImages = document.querySelectorAll('.post_list_related_1 img.lazyload');

    lazyImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
            img.setAttribute('src', src);
            img.removeAttribute('data-src');
        }
    });
});
</script>
