<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直アクセス防止
}

/* ==========================================================
 * 1. マイパーツ – カスタム投稿タイプ登録（完全非公開）
 * ======================================================= */
add_action( 'init', 'lw_register_my_parts_post_type', 5 );
function lw_register_my_parts_post_type() {

	$labels = [
		'name'          => 'Lwマイパーツ',
		'singular_name' => 'Lwマイパーツ',
		'add_new'       => '新規追加',
		'add_new_item'  => '新規マイパーツ制作',
		'edit_item'     => 'マイパーツを編集',
		'new_item'      => '新規マイパーツ',
		'view_item'     => 'マイパーツを表示',
		'search_items'  => 'マイパーツを検索',
		'not_found'     => '投稿が見つかりませんでした',
		'not_found_in_trash' => 'ゴミ箱内に投稿がありません',
		'all_items'     => 'マイパーツ一覧',
		'menu_name'     => 'Lwマイパーツ',
	];

	$args = [
		'label'               => 'Lwマイパーツ',
		'labels'              => $labels,
		'public'              => false, // 完全非公開
		'show_ui'             => true,  // 管理画面に表示
		'show_in_menu'        => true,
		'menu_position'       => 20,
		'menu_icon'           => 'dashicons-layout',
		'show_in_rest'        => true,  // Gutenberg 対応
		'capability_type'     => 'post',
		'map_meta_cap'        => true,
		'publicly_queryable'  => true,  // プレビュー有効化（管理者のみ）
		'exclude_from_search' => true,
		'has_archive'         => false,
		'rewrite'             => false,
		'supports'            => [ 'title', 'editor', 'revisions' ],
	];
	register_post_type( 'lw_my_parts', $args );
}

/* ==========================================================
 * 1-2. ★ 管理者のみプレビュー可能にする
 * ======================================================= */
add_action( 'template_redirect', 'lw_my_parts_access_control' );
function lw_my_parts_access_control() {
	// マイパーツの単一ページ表示時のみチェック
	if ( ! is_singular( 'lw_my_parts' ) ) {
		return;
	}

	// 管理者はアクセス可能
	if ( current_user_can( 'administrator' ) ) {
		return;
	}

	// プレビュー時で編集権限がある場合は許可
	if ( is_preview() && current_user_can( 'edit_post', get_the_ID() ) ) {
		return;
	}

	// それ以外は404
	global $wp_query;
	$wp_query->set_404();
	status_header( 404 );
	nocache_headers();
	include( get_query_template( '404' ) );
	exit;
}

/* ==========================================================
 * 2. ★ パーツカテゴリー – タクソノミー登録（管理画面専用）
 * ======================================================= */
add_action( 'init', 'lw_register_parts_category_taxonomy', 6 );
function lw_register_parts_category_taxonomy() {

	$labels = [
		'name'              => 'パーツカテゴリー',
		'singular_name'     => 'パーツカテゴリー',
		'search_items'      => 'カテゴリーを検索',
		'all_items'         => 'すべてのカテゴリー',
		'parent_item'       => '親カテゴリー',
		'parent_item_colon' => '親カテゴリー：',
		'edit_item'         => 'カテゴリーを編集',
		'update_item'       => 'カテゴリーを更新',
		'add_new_item'      => '新規カテゴリーを追加',
		'new_item_name'     => '新規カテゴリー名',
		'menu_name'         => 'パーツカテゴリー',
	];

	$args = [
		'labels'             => $labels,
		'hierarchical'       => true,   // category 型
		'public'             => false,  // 非公開
		'show_ui'            => true,   // 管理画面に表示
		'show_admin_column'  => true,   // 一覧画面に列追加
		'show_in_rest'       => true,   // Gutenberg 用
		'show_in_quick_edit' => true,
		'show_tagcloud'      => false,
		'show_in_nav_menus'  => false,
		'query_var'          => false,
		'rewrite'            => false,  // パーマリンク無効
	];
	register_taxonomy( 'lw_parts_cat', [ 'lw_my_parts' ], $args );
}

/* ==========================================================
 * 3. サイトマップ除外（投稿タイプ＋タクソノミー）
 * ======================================================= */
/** ─ WordPress コア XML サイトマップ ─ **/
add_filter( 'wp_sitemaps_post_types', function ( $post_types ) {
	unset( $post_types['lw_my_parts'] );       // 投稿タイプ
	return $post_types;
} );
add_filter( 'wp_sitemaps_taxonomies', function ( $taxonomies ) {
	unset( $taxonomies['lw_parts_cat'] );      // ★タクソノミー
	return $taxonomies;
} );

/** ─ Yoast SEO サイトマップ除外 ─ **/
add_filter( 'wpseo_sitemap_exclude_post_type', function ( $value, $post_type ) {
	return ( 'lw_my_parts' === $post_type ) ? true : $value;
}, 10, 2 );
add_filter( 'wpseo_sitemap_exclude_taxonomy', function ( $value, $taxonomy ) {
	return ( 'lw_parts_cat' === $taxonomy ) ? true : $value;
}, 10, 2 );

/* ==========================================================
 * 4. メタボックス – テンプレートパーツ呼び出しのみ
 * ======================================================= */
add_action( 'add_meta_boxes', 'lw_add_my_parts_metabox' );
function lw_add_my_parts_metabox() {
	add_meta_box(
		'lw_my_parts_settings',
		'マイパーツ編集エリア',
		'lw_render_my_parts_metabox',
		'lw_my_parts',
		'normal',
		'default'
	);
}
function lw_render_my_parts_metabox() {
	// 任意の UI をテンプレートパーツで読み込む
	get_template_part( 'functions/custom_post/lw_block_insert' );
}

/* ==========================================================
 * REST APIにマイパーツのメタデータを追加
 * ======================================================= */
add_action( 'rest_api_init', 'lw_register_my_parts_meta_fields' );
function lw_register_my_parts_meta_fields() {
	// エディタモード
	register_rest_field( 'lw_my_parts', 'editor_mode', array(
		'get_callback' => function( $object ) {
			return get_post_meta( $object['id'], '_lw_editor_mode', true );
		},
		'schema' => array(
			'type' => 'string',
			'context' => array( 'view', 'edit' ),
		),
	));
	
	// カスタムHTML
	register_rest_field( 'lw_my_parts', 'custom_html', array(
		'get_callback' => function( $object ) {
			return get_post_meta( $object['id'], '_lw_custom_html', true );
		},
		'schema' => array(
			'type' => 'string',
			'context' => array( 'view', 'edit' ),
		),
	));
	
	// カスタムCSS
	register_rest_field( 'lw_my_parts', 'custom_css', array(
		'get_callback' => function( $object ) {
			return get_post_meta( $object['id'], '_lw_custom_css', true );
		},
		'schema' => array(
			'type' => 'string',
			'context' => array( 'view', 'edit' ),
		),
	));
	
	// 全幅設定
	register_rest_field( 'lw_my_parts', 'full_width', array(
		'get_callback' => function( $object ) {
			return get_post_meta( $object['id'], '_lw_full_width', true );
		},
		'schema' => array(
			'type' => 'string',
			'context' => array( 'view', 'edit' ),
		),
	));
}