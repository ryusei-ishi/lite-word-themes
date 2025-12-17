<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* ------------------------------------------------------------
 * カテゴリー長文説明を the_archive_description() に上書き
 * ------------------------------------------------------------ */
add_filter( 'get_the_archive_description', 'lw_filter_category_long_description', 20 );

function lw_filter_category_long_description( $description ) {

	/* カテゴリーアーカイブ以外は処理しない */
	if ( ! is_category() ) {
		return $description;
	}

	$term_id      = get_queried_object_id();
	$long_content = get_term_meta( $term_id, 'category_long_description', true );

	if ( $long_content ) {
		// ブロック展開・ショートコード・自動 <p> 付与
		return apply_filters( 'the_content', $long_content );
	}

	// 未入力時は空文字だけ返す
	return '';
}

if ( have_posts() ) : ?>

    <?php
        /* --- 追加：長文説明を取得 --- */
        $desc = get_the_archive_description(); // 空なら ""

        if ( $desc ) : ?>
            <section class="archive_body post_style">
                <div class="first_content"></div>
                    <?php echo $desc; // フィルター済み HTML ?>
                <div class="last_content"></div>
            </section>
        <?php endif; ?>
	<?php
endif;
?>




