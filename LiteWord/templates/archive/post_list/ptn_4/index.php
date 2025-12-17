<?php
/**
 *  テンプレート : カテゴリー一覧＋投稿リスト（ptn-4）
 *  ----------------------------------------------------
 *  ・トップレベル     …  全トップカテゴリ（親 = 0）
 *  ・カテゴリーArchive …  直下の子カテゴリ。子が無ければ現在カテゴリ自身
 *  ・各カテゴリ配下に “公開済み” の投稿をすべて列挙
 *
 *  ※ style.min.css は既に読み込んでいる想定
 */
if ( ! defined( 'ABSPATH' ) ) exit;

// CSS の読み込み
wp_enqueue_style(
	'post_list_ptn_4_style',
	get_template_directory_uri() . '/templates/archive/post_list/ptn_4/style.min.css',
	array(),
	css_version(),
	'all'
);

/*--------------------------------------------------------------
 * 1) 表示対象のカテゴリを取得
 *-------------------------------------------------------------*/
if ( is_category() ) {

	/*--- カテゴリーアーカイブ ---*/
	$current_cat = get_queried_object(); // 現在表示中のカテゴリー

	// 直下の子カテゴリ（並び順は後で usort で調整）
	$categories = get_categories( array(
		'parent'      => $current_cat->term_id,
		'hide_empty'  => false,
	) );

	// 子が無い場合は自身だけ
	if ( empty( $categories ) ) {
		$categories = array( $current_cat );
	}

} else {

	/*--- ブログ一覧や固定ページなど ---*/
	$categories = get_categories( array(
		'parent'      => 0,           // トップレベル
		'hide_empty'  => false,
	) );
}

/*--------------------------------------------------------------
 * 2) 並び順（category_sort_order → 名前）でソート
 *    未設定は 999 扱いで最後尾へ
 *-------------------------------------------------------------*/
usort( $categories, function ( $a, $b ) {
	$oa = get_term_meta( $a->term_id, 'category_sort_order', true );
	$ob = get_term_meta( $b->term_id, 'category_sort_order', true );
	$oa = ( $oa === '' ) ? 999 : intval( $oa );
	$ob = ( $ob === '' ) ? 999 : intval( $ob );

	// 数値が同じ場合だけ 名前順で安定化
	if ( $oa === $ob ) {
		return strnatcasecmp( $a->name, $b->name );
	}
	return $oa - $ob; // 昇順
});
?>

<section class="lw_post_list post_list_ptn_4">
	<ul class="category_parent">
	<?php foreach ( $categories as $category ) :

		/*----------------------------------------------------------
		 * 3) 各カテゴリに属する公開投稿を取得
		 *---------------------------------------------------------*/
		$posts = get_posts( array(
			'post_status'    => 'publish',
			'posts_per_page' => -1,      // すべて
			'orderby'        => 'title', // ★ タイトル順
			'order'          => 'ASC',   // ★ 昇順（A→Z / あ→ん）
			'cat'            => $category->term_id,
		) );

		// 投稿が無いカテゴリはスキップ
		if ( empty( $posts ) ) {
			continue;
		}
	?>
		<li>
			<a href="<?php echo esc_url( get_category_link( $category->term_id ) ); ?>">
				<?php echo esc_html( $category->name ); ?>
			</a>

			<ul>
			<?php foreach ( $posts as $post ) : setup_postdata( $post ); ?>
				<li>
					<a href="<?php the_permalink(); ?>">
						<?php the_title(); ?>
					</a>
				</li>
			<?php endforeach; wp_reset_postdata(); ?>
			</ul>
		</li>
	<?php endforeach; ?>
	</ul>
</section>
