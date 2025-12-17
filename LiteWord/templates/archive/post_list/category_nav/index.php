<?php
// カテゴリーアーカイブ  または  投稿ページ（ブログ一覧）のときだけ実行
if ( is_category() || is_home() ) :

	// CSS を読み込み
	wp_enqueue_style(
		'lw_category_nav_style_ptn_1',
		get_template_directory_uri() . '/templates/archive/post_list/category_nav/ptn_1.min.css',
		array(),
		css_version(),
		'all'
	);

	/*--------------------------------------------------------------
	 * ■ 並び替え用コールバック
	 *    category_sort_order が空なら 9999 扱いで後ろへ
	 *-------------------------------------------------------------*/
	$lw_sort_categories_cb = function ( $a, $b ) {
		$oa = get_term_meta( $a->term_id, 'category_sort_order', true );
		$ob = get_term_meta( $b->term_id, 'category_sort_order', true );
		$oa = ( $oa === '' ) ? 9999 : intval( $oa );
		$ob = ( $ob === '' ) ? 9999 : intval( $ob );
		// 数値が同じ時は名前順で安定化
		return ( $oa === $ob ) ? strnatcasecmp( $a->name, $b->name ) : ( $oa - $ob );
	};
?>
<nav class="lw_category_nav ptn_1">
<?php
	/*----------------------------------
	 * ■ カテゴリーアーカイブの場合
	 *---------------------------------*/
	if ( is_category() ) :

		$current_category = get_queried_object(); // いま表示しているカテゴリ
		if ( $current_category instanceof WP_Term ) :

			// 直下の子カテゴリを取得（並び順は後で usort）
			$child_categories = get_categories( array(
				'parent'      => $current_category->term_id,
				'hide_empty'  => false,
			) );

			// category_sort_order → 名前 の順で並び替え
			if ( $child_categories ) {
				usort( $child_categories, $lw_sort_categories_cb );
			}

			if ( $child_categories ) : ?>
				<ul class="category_links">
				<?php foreach ( $child_categories as $category ) :
					if ( $category->count > 0 ) : // 投稿があるカテゴリだけ
				?>
					<li>
						<a href="<?php echo esc_url( get_category_link( $category->term_id ) ); ?>">
							<?php echo esc_html( $category->name ); ?>
						</a>
					</li>
				<?php
					endif;
				endforeach; ?>
				</ul>
			<?php endif;
		endif;

	/*----------------------------------
	 * ■ 投稿ページ（ブログ一覧）の場合
	 *---------------------------------*/
	else :

		// トップレベルカテゴリを取得（並び順は後で usort）
		$top_level_categories = get_categories( array(
			'parent'      => 0,
			'hide_empty'  => false,
		) );

		// 並び替え
		if ( $top_level_categories ) {
			usort( $top_level_categories, $lw_sort_categories_cb );
		}

		if ( $top_level_categories ) : ?>
			<ul class="category_links">
			<?php foreach ( $top_level_categories as $category ) :
				if ( $category->count > 0 ) : ?>
					<li>
						<a href="<?php echo esc_url( get_category_link( $category->term_id ) ); ?>">
							<?php echo esc_html( $category->name ); ?>
						</a>
					</li>
				<?php endif;
			endforeach; ?>
			</ul>
		<?php endif;

	endif; ?>
</nav>
<?php endif; ?>
