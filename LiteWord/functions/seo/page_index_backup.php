<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/*--------------------------------------------------------------
 * 定数
 *------------------------------------------------------------*/
const LW_SEO_MENU_SLUG = 'lw_seo_settings_menu_page_individual_set';   // メニュー slug


/*--------------------------------------------------------------
 * 1) Walker クラス（投稿行チェックボックス）
 *------------------------------------------------------------*/
if ( ! class_exists( 'LW_Bulk_Edit_Category_Walker' ) ) :
class LW_Bulk_Edit_Category_Walker extends Walker_Category {
	protected int $post_id;
	public function __construct( int $post_id ) { $this->post_id = $post_id; }
	public function start_el( &$o, $cat, $depth = 0, $args = [], $id = 0 ) {
		$checked = in_array( $cat->term_id, $args['selected_cats'] ?? [], true ) ? ' checked' : '';
		$o .= sprintf(
			'<label style="display:block;margin-left:%1$dpx;margin-bottom:3px;">' .
				'<input type="checkbox" name="post_category[%2$d][]" value="%3$d"%4$s> %5$s' .
			'</label>',
			$depth * 16, $this->post_id, $cat->term_id, $checked, esc_html( $cat->name )
		);
	}
	public function start_lvl( &$o,$d=0,$a=[] ){}
	public function end_lvl(   &$o,$d=0,$a=[] ){}
	public function end_el(    &$o,$c,$d=0,$a=[] ){}
}
endif;



/*--------------------------------------------------------------
 * 2) カテゴリー + 投稿タイトル ツリー生成
 *------------------------------------------------------------*/
function lw_build_category_tree(
	array  $cats,
	bool   $show_posts,
	int    $current_cat,
	string $sort_param,
	int    $depth = 0
) : string {

	$html = '<ul class="lw-cat-level-' . $depth . '">';

	foreach ( $cats as $cat ) {

		$li_class = 'cat-level-' . $depth;
		if ( $cat->term_id === $current_cat ) $li_class .= ' current-cat';

		$url = add_query_arg(
			[
				'page'       => LW_SEO_MENU_SLUG,
				'type'       => 'post',
				'cat'        => $cat->term_id,
				'sort'       => $sort_param,
				'show_posts' => $show_posts ? '1' : '0'
			],
			admin_url( 'admin.php' )
		);

		$html .= '<li class="' . esc_attr( $li_class ) . '"><a href="' . esc_url( $url ) . '">' .
		         esc_html( $cat->name ) . ' (' . $cat->count . ')</a>';

		/* ── 投稿タイトル（※子カテゴリの記事は含めない） ── */
		if ( $show_posts ) {
			// パフォーマンス最適化：100件に制限
			$posts = get_posts( [
				'posts_per_page' => 100,
				'fields'         => 'ids',
				'orderby'        => 'title',
				'order'          => 'ASC',
				'tax_query'      => [
					[
						'taxonomy'         => 'category',
						'field'            => 'term_id',
						'terms'            => $cat->term_id,
						'include_children' => false,
					],
				],
			] );

			if ( $posts ) {
				$html .= '<ul class="lw-cat-level-' . ( $depth + 1 ) . ' post-titles">';
				foreach ( $posts as $p_id ) {
					$html .= '<li class="cat-post-title cat-level-' . ( $depth + 1 ) . '">' .
					         '<a href="' . esc_url( get_permalink( $p_id ) ) . '" target="_blank" rel="noopener noreferrer">' .
					         esc_html( get_the_title( $p_id ) ) . '</a></li>';
				}
				// 100件以上ある場合の通知
				if ( count( $posts ) === 100 ) {
					$html .= '<li class="cat-post-title cat-level-' . ( $depth + 1 ) . ' more-items">...（最初の100件のみ表示）</li>';
				}
				$html .= '</ul>';
			}
		}

		/* 子カテゴリ再帰 */
		$children = get_categories( [
			'hide_empty' => 0,
			'parent'     => $cat->term_id,
			'orderby'    => 'term_order',
			'order'      => 'ASC',
		] );
		if ( $children ) {
			$html .= lw_build_category_tree( $children, $show_posts, $current_cat, $sort_param, $depth + 1 );
		}

		$html .= '</li>';
	}
	return $html . '</ul>';
}



/*--------------------------------------------------------------
 * 2') 固定ページ階層ツリー生成（子を持たないページはリンクなし）
 *------------------------------------------------------------*/
function lw_build_page_tree(
	array  $pages,
	int    $current_parent,
	string $sort_param,
	int    $depth = 0,
	array  $children_cache = []
) : string {

	// 最初の呼び出し時に、全ページの子を一括取得してキャッシュ
	static $page_children_map = null;
	if ( $depth === 0 && empty( $children_cache ) ) {
		$page_children_map = [];
		$all_pages = get_pages( [ 'sort_column' => 'menu_order,post_title' ] );
		foreach ( $all_pages as $p ) {
			if ( $p->post_parent > 0 ) {
				if ( ! isset( $page_children_map[ $p->post_parent ] ) ) {
					$page_children_map[ $p->post_parent ] = [];
				}
				$page_children_map[ $p->post_parent ][] = $p;
			}
		}
	}

	$html = '<ul class="lw-page-level-' . $depth . '">';

	foreach ( $pages as $page ) {

		$li_class = 'page-level-' . $depth;
		if ( $page->ID === $current_parent ) {
			$li_class .= ' current-page';
		}

		/* ---------- 子ページの有無を判定（キャッシュを使用） ---------- */
		$children = $page_children_map[ $page->ID ] ?? [];
		$has_children = ! empty( $children );

		/* ---------- タイトル部分 ---------- */
		if ( $has_children ) {
			/* 子ページがある場合のみリンクを付与 */
			$url = add_query_arg(
				[
					'page'   => LW_SEO_MENU_SLUG,
					'type'   => 'page',
					'parent' => $page->ID,
					'sort'   => $sort_param,
				],
				admin_url( 'admin.php' )
			);
			$title_html = '<a href="' . esc_url( $url ) . '">' . esc_html( $page->post_title ) . '</a>';
		} else {
			/* 子ページが無いページはリンクなし */
			$title_html = esc_html( $page->post_title );
		}

		/* ---------- リスト出力 ---------- */
		$html .= '<li class="' . esc_attr( $li_class ) . '">' . $title_html;

		/* 再帰（子を持つ場合のみ） */
		if ( $has_children ) {
			$html .= lw_build_page_tree( $children, $current_parent, $sort_param, $depth + 1, $page_children_map );
		}

		$html .= '</li>';
	}

	return $html . '</ul>';
}



/*--------------------------------------------------------------
 * 3) 画面描画 & 保存処理
 *------------------------------------------------------------*/
function lw_seo_bulk_edit_page() {

	$base_admin = admin_url( 'admin.php?page=' . LW_SEO_MENU_SLUG );

	/* ---------- CSS ---------- */
	wp_enqueue_style(
		'lw_seo_bulk_edit',
		get_template_directory_uri().'/functions/seo/css/lw_seo_bulk_edit.css',
		[],
		css_version(),
		'all'
	);

	/* ---------- URL パラメータ ---------- */
	$type_param    = $_GET['type'] ?? '';   // '', 'post', 'page'
	$current_type  = $type_param === 'page' ? 'page' : ( $type_param === 'post' ? 'post' : '' );
	$cat_filter    = isset( $_GET['cat']    ) ? intval( $_GET['cat']    ) : 0;
	$parent_filter = isset( $_GET['parent'] ) ? intval( $_GET['parent'] ) : 0;
	$sort_param    = $_GET['sort'] ?? 'date_desc';
	$show_posts    = isset( $_GET['show_posts'] ) && $_GET['show_posts'] === '1';

	/* ---------- ページタイトル ---------- */
	$page_title = 'SEO 一括編集';
	if ( $current_type === 'page' && $parent_filter ) {
		$page_title = '固定ページ『' . get_the_title( $parent_filter ) . '』直下 SEO 一括編集';
	} elseif ( $current_type === 'post' && $cat_filter ) {
		$page_title = '投稿ページ ' . get_cat_name( $cat_filter ) . ' SEO 一括編集';
	}

	/* ---------- 並び替え定義 ---------- */
	$sort_opts = [
		'date_desc' => ['orderby'=>'date',  'order'=>'DESC','label'=>'投稿日 新→旧'],
		'date_asc'  => ['orderby'=>'date',  'order'=>'ASC', 'label'=>'投稿日 旧→新'],
		'name_asc'  => ['orderby'=>'title', 'order'=>'ASC', 'label'=>'タイトル A→Z'],
		'name_desc' => ['orderby'=>'title', 'order'=>'DESC','label'=>'タイトル Z→A'],
	];
	if ( ! isset( $sort_opts[$sort_param] ) ) $sort_param = 'date_desc';
	$orderby = $sort_opts[$sort_param]['orderby'];
	$order   = $sort_opts[$sort_param]['order'];



	/* ---------- 投稿カテゴリーツリー ---------- */
	$root_cats = get_categories([
		'hide_empty' => 0,
		'parent'     => 0,
		'orderby'    => 'term_order',
		'order'      => 'ASC',
	]);

	$total_posts_all = (int) wp_count_posts( 'post' )->publish;

	$cat_list  = '<ul class="lw-cat-level-0">';
	$cat_list .= '<li'.( $cat_filter === 0 ? ' class="current-cat"' : '' ).'><a href="'.
	             esc_url( add_query_arg( ['type'=>'post','sort'=>$sort_param,'show_posts'=>$show_posts?'1':'0'], $base_admin ) ).
	             '">全件 ('.$total_posts_all.')</a></li>';
	$cat_list .= lw_build_category_tree( $root_cats, $show_posts, $cat_filter, $sort_param, 1 );
	$cat_list .= '</ul>';

	$toggle_url   = esc_url( add_query_arg( ['type'=>'post','sort'=>$sort_param,'cat'=>$cat_filter?:null,'show_posts'=>$show_posts?'0':'1'], $base_admin ) );
	$toggle_label = $show_posts ? '投稿タイトルを隠す' : '投稿タイトルを表示';



	/* ---------- 固定ページ階層ツリー ---------- */
	$root_pages = get_pages([
		'parent'      => 0,
		'sort_column' => 'menu_order,post_title',
		'sort_order'  => 'ASC',
	]);

	$page_list  = '<ul class="lw-page-level-0">';
	$page_list .= '<li'.( $parent_filter === 0 ? ' class="current-page"' : '' ).'><a href="'.
	              esc_url( add_query_arg( ['type'=>'page','sort'=>$sort_param], $base_admin ) ).
	              '">全件</a></li>';
	$page_list .= lw_build_page_tree( $root_pages, $parent_filter, $sort_param, 1 );
	$page_list .= '</ul>';



	/*──────────────────────────────────────────
	 * (1) 変更分のみ保存
	 *──────────────────────────────────────────*/
	if ( $current_type && isset( $_POST['lw_seo_save'] ) && check_admin_referer( 'lw_seo_bulk_edit' ) ) {

		foreach ( (array) $_POST['post_title'] as $post_id => $title_new_raw ) {

			$post_id  = (int) $post_id;
			$post_old = get_post( $post_id );

			/* 変更チェック */
			$title_new  = sanitize_text_field( $title_new_raw );
			$slug_new   = rawurlencode( trim( $_POST['post_slug'][$post_id] ?? '' ) );
			$status_new = sanitize_key( $_POST['post_status'][$post_id] ?? 'publish' );
			$date_raw   = trim( $_POST['post_date'][$post_id] ?? '' );
			$date_new   = $date_raw ? date( 'Y-m-d H:i:s', strtotime( $date_raw ) ) : $post_old->post_date;

			if ( $title_new !== $post_old->post_title ||
			     $slug_new  !== $post_old->post_name  ||
			     $status_new!== $post_old->post_status||
			     $date_new  !== $post_old->post_date ) {
				wp_update_post([
					'ID'         => $post_id,
					'post_title' => $title_new,
					'post_name'  => $slug_new,
					'post_status'=> $status_new,
					'post_date'  => $date_new,
				]);
			}

			/* カテゴリー差分 */
			if ( $post_old->post_type === 'post' ) {
				$cats_new = isset( $_POST['post_category'][$post_id] )
					? array_map( 'intval', (array) $_POST['post_category'][$post_id] ) : [];
				$cats_old = wp_get_post_categories( $post_id );
				sort( $cats_new ); sort( $cats_old );
				if ( $cats_new !== $cats_old ) {
					wp_set_post_categories( $post_id, $cats_new );
				}
			}

			/* アイキャッチ差分 */
			$feat_new = intval( $_POST['feat_image_id'][$post_id] ?? 0 );
			$feat_old = get_post_thumbnail_id( $post_id );
			if ( $feat_new !== $feat_old ) {
				$feat_new ? set_post_thumbnail( $post_id, $feat_new ) : delete_post_thumbnail( $post_id );
			}

			/* メタ差分 */
			foreach ( [ 'seo_title', 'seo_description', 'seo_noindex', 'seo_og_image' ] as $meta_key ) {
				if ( ! isset( $_POST[$meta_key][$post_id] ) ) continue;

				$new_val = $meta_key === 'seo_description'
					? sanitize_textarea_field( $_POST[$meta_key][$post_id] )
					: sanitize_text_field( $_POST[$meta_key][$post_id] );

				if ( $meta_key === 'seo_noindex' ) {
					$new_val = $new_val === 'noindex' ? 'noindex' : 'follow';
				}
				$old_val = get_post_meta( $post_id, $meta_key, true );

				if ( $new_val !== $old_val ) {
					$new_val !== '' ? update_post_meta( $post_id, $meta_key, $new_val )
					                : delete_post_meta( $post_id, $meta_key );
				}
			}
		}
		echo '<div class="updated notice is-dismissible"><p>変更されたデータのみ保存しました。</p></div>';
	}



	/*──────────────────────────────────────────
	 * (2) 初期画面（投稿タイプ未選択）
	 *──────────────────────────────────────────*/
	if ( ! $current_type ) : ?>
		<div class="none_plugin_message"></div>
		<div class="lw-seo-type-select">
			<div class="lw-seo-type-header">
				<span class="dashicons dashicons-edit-page"></span>
				<h1><?php echo esc_html( $page_title ); ?></h1>
			</div>
			<p class="lw-seo-type-desc">編集したい投稿タイプを選択してください。</p>

			<div class="lw-seo-type-cards">
				<a class="lw-seo-type-card" href="<?php echo esc_url( add_query_arg(['type'=>'post','sort'=>$sort_param,'show_posts'=>$show_posts?'1':'0'], $base_admin) ); ?>">
					<div class="lw-seo-type-icon">
						<span class="dashicons dashicons-admin-post"></span>
					</div>
					<div class="lw-seo-type-info">
						<span class="lw-seo-type-title">投稿</span>
						<span class="lw-seo-type-count"><?php echo number_format( $total_posts_all ); ?> 件</span>
					</div>
					<span class="lw-seo-type-arrow dashicons dashicons-arrow-right-alt2"></span>
				</a>

				<a class="lw-seo-type-card" href="<?php echo esc_url( add_query_arg(['type'=>'page','sort'=>$sort_param], $base_admin) ); ?>">
					<div class="lw-seo-type-icon lw-seo-type-icon-page">
						<span class="dashicons dashicons-admin-page"></span>
					</div>
					<div class="lw-seo-type-info">
						<span class="lw-seo-type-title">固定ページ</span>
						<span class="lw-seo-type-count"><?php echo number_format( wp_count_posts('page')->publish ); ?> 件</span>
					</div>
					<span class="lw-seo-type-arrow dashicons dashicons-arrow-right-alt2"></span>
				</a>
			</div>
		</div>

		<style>
		.lw-seo-type-select {
			max-width: 600px;
			margin: 40px auto;
			padding: 0 20px;
		}
		.lw-seo-type-header {
			display: flex;
			align-items: center;
			gap: 16px;
			margin-bottom: 12px;
		}
		.lw-seo-type-header > .dashicons {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 56px;
			height: 56px;
			background: linear-gradient(135deg, #2b72b5 0%, #3d8fd1 100%);
			border-radius: 14px;
			color: #fff;
			font-size: 28px;
			box-shadow: 0 4px 15px rgba(43, 114, 181, 0.3);
		}
		.lw-seo-type-header h1 {
			margin: 0;
			font-size: 28px;
			font-weight: 700;
			color: #1e3a5f;
		}
		.lw-seo-type-desc {
			margin: 0 0 24px;
			font-size: 15px;
			color: #64748b;
		}
		.lw-seo-type-cards {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}
		.lw-seo-type-card {
			display: flex;
			align-items: center;
			gap: 20px;
			padding: 24px;
			background: #fff;
			border: 2px solid #e2e8f0;
			border-radius: 16px;
			text-decoration: none;
			transition: all 0.25s ease;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		}
		.lw-seo-type-card:hover {
			border-color: #2b72b5;
			box-shadow: 0 8px 24px rgba(43, 114, 181, 0.15);
			transform: translateY(-2px);
		}
		.lw-seo-type-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 64px;
			height: 64px;
			background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
			border-radius: 14px;
			flex-shrink: 0;
			transition: all 0.25s ease;
		}
		.lw-seo-type-icon .dashicons {
			font-size: 32px;
			width: 32px;
			height: 32px;
			color: #2b72b5;
		}
		.lw-seo-type-card:hover .lw-seo-type-icon {
			background: linear-gradient(135deg, #2b72b5 0%, #3d8fd1 100%);
		}
		.lw-seo-type-card:hover .lw-seo-type-icon .dashicons {
			color: #fff;
		}
		.lw-seo-type-icon-page {
			background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		}
		.lw-seo-type-icon-page .dashicons {
			color: #16a34a;
		}
		.lw-seo-type-card:hover .lw-seo-type-icon-page {
			background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
		}
		.lw-seo-type-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 4px;
		}
		.lw-seo-type-title {
			font-size: 18px;
			font-weight: 600;
			color: #1e293b;
		}
		.lw-seo-type-count {
			font-size: 14px;
			color: #64748b;
		}
		.lw-seo-type-arrow {
			font-size: 24px;
			width: 24px;
			height: 24px;
			color: #cbd5e1;
			transition: all 0.25s ease;
		}
		.lw-seo-type-card:hover .lw-seo-type-arrow {
			color: #2b72b5;
			transform: translateX(4px);
		}
		@media (max-width: 600px) {
			.lw-seo-type-select {
				margin: 20px auto;
			}
			.lw-seo-type-header h1 {
				font-size: 22px;
			}
			.lw-seo-type-card {
				padding: 18px;
				gap: 16px;
			}
			.lw-seo-type-icon {
				width: 52px;
				height: 52px;
			}
			.lw-seo-type-icon .dashicons {
				font-size: 26px;
				width: 26px;
				height: 26px;
			}
		}
		</style>
		<?php return;
	endif;



	/*──────────────────────────────────────────
	 * (3) 一覧取得
	 *──────────────────────────────────────────*/
	$per_page = 100;
	$paged    = max( 1, intval( $_GET['paged'] ?? 1 ) );
	$offset   = ( $paged - 1 ) * $per_page;

	$query_args = [
		'post_type'      => $current_type ?: 'post',
		'posts_per_page' => $per_page,
		'offset'         => $offset,
		'post_status'    => 'any',
		'orderby'        => $orderby,
		'order'          => $order,
	];
	if ( $current_type === 'post' && $cat_filter ) {
		$query_args['cat'] = $cat_filter;
	} elseif ( $current_type === 'page' && $parent_filter ) {
		$query_args['post_parent'] = $parent_filter;
	}

	$posts = get_posts( $query_args );

	$total_posts = ( $current_type === 'post' && $cat_filter ) || ( $current_type === 'page' && $parent_filter )
		? ( new WP_Query( array_merge( $query_args, [ 'posts_per_page'=>-1, 'fields'=>'ids' ] ) ) )->found_posts
		: wp_count_posts( $current_type ?: 'post' )->publish;
	$total_pages = ceil( $total_posts / $per_page );

	$status_lbl = [
		'publish' => '公開',
		'draft'   => '下書き',
		'pending' => 'レビュー待ち',
		'private' => '非公開',
	];

	/* ---------- ソートリンク ---------- */
	$sort_links = '';
	foreach ( $sort_opts as $key => $opt ) {
		$url_params = ['type'=>$current_type,'sort'=>$key];
		if ( $current_type === 'post' ) {
			$url_params['cat'] = $cat_filter ?: null;
			$url_params['show_posts'] = $show_posts ? '1' : '0';
		} elseif ( $current_type === 'page' ) {
			$url_params['parent'] = $parent_filter ?: null;
		}
		$url   = add_query_arg( $url_params, $base_admin );
		$class = $key === $sort_param ? ' class="current-sort"' : '';
		$sort_links .= '<a'.$class.' href="'.esc_url($url).'">'.$opt['label'].'</a> | ';
	}
	$sort_links = rtrim( $sort_links, ' | ' );



	/*──────────────────────────────────────────
	 * (4) 一覧出力
	 *──────────────────────────────────────────*/ ?>
	<div class="wrap">
		<h1 class="wp-heading-inline"><?php echo esc_html( $page_title ); ?></h1>

		<p><strong>表示切替：</strong>
			<a href="<?php echo esc_url( add_query_arg(['type'=>'post','cat'=>null,'sort'=>$sort_param,'show_posts'=>$show_posts?'1':'0'], $base_admin) ); ?>" class="<?php echo $current_type==='post'?'current':''; ?>">投稿</a> |
			<a href="<?php echo esc_url( add_query_arg(['type'=>'page','parent'=>null,'sort'=>$sort_param], $base_admin) ); ?>" class="<?php echo $current_type==='page'?'current':''; ?>">固定ページ</a>
		</p>

		<p><strong>並び替え：</strong><?php echo $sort_links; ?></p>

		<?php if ( $current_type === 'post' ) : ?>
			<p>
				<strong>カテゴリー：</strong><div class="lw-cat-list_wrap reset"><?php echo $cat_list; ?></div>
				<a href="<?php echo $toggle_url; ?>"><?php echo esc_html( $toggle_label ); ?></a>
			</p>
		<?php else : ?>
			<p>
				<strong>ページ階層：</strong><div class="lw-cat-list_wrap reset"><?php echo $page_list; ?></div>
			</p>
		<?php endif; ?>

		<form method="post">
			<?php wp_nonce_field( 'lw_seo_bulk_edit' ); ?>

			<?php foreach ( $posts as $post ) :
				$permalink = get_permalink( $post->ID );
				$edit_url  = get_edit_post_link( $post->ID );
				$seo_title = get_post_meta( $post->ID, 'seo_title',       true );
				$seo_desc  = get_post_meta( $post->ID, 'seo_description', true );
				$seo_noidx = get_post_meta( $post->ID, 'seo_noindex',     true ) ?: 'follow';
				$ogp_url   = get_post_meta( $post->ID, 'seo_og_image',    true );

				$feat_id  = get_post_thumbnail_id( $post->ID );
				$feat_url = $feat_id ? wp_get_attachment_image_url( $feat_id, 'thumbnail' ) : '';

				$post_date_local = date( 'Y-m-d\TH:i', strtotime( $post->post_date ) );

				$cat_html = '';
				if ( $post->post_type === 'post' ) {
					$cat_html = ( new LW_Bulk_Edit_Category_Walker( $post->ID ) )
						->walk( get_categories([ 'hide_empty'=>0,'orderby'=>'term_order','order'=>'ASC' ]), 0, ['selected_cats' => wp_get_post_categories( $post->ID )] );
				}

				$slug_disp   = urldecode( $post->post_name );
				$ogp_target  = 'seo_og_image_' . $post->ID;
				$feat_target = 'feat_image_'   . $post->ID;
			?>
				<div class="lw_seo_page_item_wrap">
					<div class="lw_seo_page_item">
						<div class="column main">
							<div><label><a href="<?=$edit_url?>" target="_blank" rel="noopener noreferrer">タイトル</a></label><input name="post_title[<?php echo $post->ID; ?>]" value="<?php echo esc_attr($post->post_title); ?>"></div>
							<div><label>SEOタイトル</label><input name="seo_title[<?php echo $post->ID; ?>]" value="<?php echo esc_attr($seo_title); ?>"></div>
							<div>
								<label>メタディスクリプション</label>
								<textarea name="seo_description[<?php echo $post->ID; ?>]" rows="2"><?php echo esc_textarea($seo_desc); ?></textarea>
							</div>
						</div>

						<div class="column sub">
							<div><label>スラッグ</label><input name="post_slug[<?php echo $post->ID; ?>]" value="<?php echo esc_attr($slug_disp); ?>"></div>
							<div><label>公開日時</label><input type="datetime-local" name="post_date[<?php echo $post->ID; ?>]" value="<?php echo esc_attr($post_date_local); ?>"></div>
							<div><label>公開ステータス</label>
								<select name="post_status[<?php echo $post->ID; ?>]">
									<?php foreach ( $status_lbl as $k=>$lbl ) {
										printf( '<option value="%1$s"%2$s>%3$s</option>', $k, selected( $post->post_status, $k, false ), $lbl );
									} ?>
								</select>
							</div>
							<div><label>noindex設定</label>
								<select name="seo_noindex[<?php echo $post->ID; ?>]">
									<option value="follow"  <?php selected( $seo_noidx, 'follow' ); ?>>follow</option>
									<option value="noindex" <?php selected( $seo_noidx, 'noindex' ); ?>>noindex</option>
								</select>
							</div>
						</div>

						<?php if ( $post->post_type === 'post' ) : ?>
							<div class="column"><div><label>カテゴリー</label><div class="lw_post_cat_wrap"><?php echo $cat_html; ?></div></div></div>
						<?php endif; ?>

						<div class="column">
							<div><label>アイキャッチ</label>
								<div class="costom_post_media_select">
									<input type="hidden" id="<?php echo $feat_target; ?>_url" value="<?php echo esc_attr($feat_url); ?>">
									<input type="hidden" id="<?php echo $feat_target; ?>_id" name="feat_image_id[<?php echo $post->ID; ?>]" value="<?php echo esc_attr($feat_id); ?>">

									<div id="<?php echo $feat_target; ?>_preview" class="preview_on">
										<?php echo $feat_url ? '<img src="'.esc_url($feat_url).'" loading="lazy">' : '<div class="no_image"></div>'; ?>
									</div>

									<button type="button" class="button add_upload_media"
											data-targetid="<?php echo $feat_target; ?>"
											data-title="アイキャッチを選択"
											data-library="image"
											data-frame="select"
											data-button="選択"
											data-multiple="false"
											data-preview="true">画像を選択</button>
									<button type="button" class="button remove_upload_media"
											data-targetid="<?php echo $feat_target; ?>">削除</button>
								</div>
							</div>
						</div>

						<div class="column">
							<div><label>OGP画像</label>
								<div class="costom_post_media_select">
									<input type="hidden" id="<?php echo $ogp_target; ?>_url" name="seo_og_image[<?php echo $post->ID; ?>]" value="<?php echo esc_attr($ogp_url); ?>">
									<input type="hidden" id="<?php echo $ogp_target; ?>_id" value="">

									<div id="<?php echo $ogp_target; ?>_preview">
										<?php echo $ogp_url ? '<img src="'.esc_url($ogp_url).'" loading="lazy">' : '<div class="no_image"></div>'; ?>
									</div>

									<button type="button" class="button add_upload_media"
											data-targetid="<?php echo $ogp_target; ?>"
											data-title="OGP画像を選択"
											data-library="image"
											data-frame="select"
											data-button="選択"
											data-multiple="false"
											data-preview="true">画像を選択</button>
									<button type="button" class="button remove_upload_media"
											data-targetid="<?php echo $ogp_target; ?>">削除</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			<?php endforeach; ?>

			<div class="lw_seo_page_submit_wrap">
				<?php submit_button( '変更内容を保存する', 'lw_seo_save', 'lw_seo_save', false ); ?>
			</div>

			<?php if ( $total_pages > 1 ) :
				$page_base_args = [
					'page'  => LW_SEO_MENU_SLUG,
					'type'  => $current_type,
					'sort'  => $sort_param,
					'paged' => '%#%',
				];
				if ( $current_type === 'post' ) {
					$page_base_args['cat']        = $cat_filter ?: null;
					$page_base_args['show_posts'] = $show_posts ? '1' : '0';
				} elseif ( $current_type === 'page' ) {
					$page_base_args['parent'] = $parent_filter ?: null;
				}
				$page_base = add_query_arg( $page_base_args, admin_url( 'admin.php' ) );
				echo '<div class="tablenav"><div class="tablenav-pages">';
				echo paginate_links([
					'base'      => $page_base,
					'format'    => '',
					'current'   => $paged,
					'total'     => $total_pages,
					'prev_text' => '«',
					'next_text' => '»',
				]);
				echo '</div></div>';
			endif; ?>
		</form>
	</div>
<?php
}

lw_seo_bulk_edit_page();
