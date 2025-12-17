<?php
if ( !defined( 'ABSPATH' ) ) exit;
// CSSの読み込み
wp_enqueue_style(
	'post_fv_1_style',
	get_template_directory_uri() . '/templates/post_fv/fv_ptn_1/style.min.css',
	array(),
	css_version(),
	'all'
);
?>
<header class="post_fv_ptn_1">
	<?php
	$thumbnail_url = Lw_put_text( 'fv_image' );
    $fv_image_ratio = Lw_put_text( 'fv_image_ratio', '16 / 8' );
	if ( empty( $thumbnail_url ) ) {
		$thumbnail_url = get_the_post_thumbnail_url();
	}
	if ( $thumbnail_url ) :
	?>
        <?php if ( $fv_image_ratio !== 'auto' ) : ?>
            <div class="image_thumbnail" style="background-image:url(<?= esc_url( $thumbnail_url ); ?>); aspect-ratio: <?=$fv_image_ratio?>;" itemprop="image"></div>
        <?php else : ?>
            <div class="image_thumbnail" style="aspect-ratio: initial;">
                <img src="<?= esc_url( $thumbnail_url ); ?>" alt="<?= esc_attr( get_the_title() ); ?>" itemprop="image" style="width: 100%; height: auto;">
            </div>
        <?php endif; ?>  
	<?php endif; ?>

	<div class="ttl_wrap">
		<div class="post_data">
            <div class="flex">
                <?php
                /* ───────────────────────────────
                 * 公開日
                 * ─────────────────────────────── */
                $fv_date = Lw_theme_mod_set( 'single_post_layout_fv_date', 'active' );
                
                if ( $fv_date === 'active' ) :
                ?>
                    <time class="post_date_time"
                        datetime="<?= get_the_date( 'Y-m-d' ); ?>"
                        itemprop="datePublished">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" hight="12" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z"/></svg>
                        <?= get_the_date( 'Y.m.d' ); ?>
                    </time>
                <?php
                endif;
    
                /* ───────────────────────────────
                 * 更新日（公開日と異なる場合のみ表示）
                 * ─────────────────────────────── */
                $fv_date_update = Lw_theme_mod_set( 'single_post_layout_fv_date_update', 'active' );
                $published = get_the_date( 'Ymd' );
                $modified  = get_the_modified_date( 'Ymd' );

                if ( $modified !== $published && $fv_date_update === 'active' ) : ?>
                    <time class="post_modified_time post_date_time"
                        datetime="<?= get_the_modified_date( 'Y-m-d' ); ?>"
                        itemprop="dateModified">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" hight="12"  viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/></svg>
                        <?= get_the_modified_date( 'Y.m.d' ); ?>
                    </time>
                <?php endif; ?>
                <!-- 追加部分 ここまで -->
            </div>

			<?php
			/* ───────────────────────────────
			 * カテゴリー
			 * ─────────────────────────────── */
			$fv_category = Lw_theme_mod_set( 'single_post_layout_fv_category', 'active' );
			if ( $fv_category === 'active' ) :
			?>
				<div class="post_category" itemprop="articleSection">
					<?php the_category(); ?>
				</div>
			<?php endif; ?>
		</div>

		<h1 class="post_title" itemprop="headline">
			<?= brSt( Lw_put_text( 'ttl_main', get_the_title() ) ); ?>
		</h1>
	</div>
</header>
