<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord サイト構造ページ — 読み取り系AJAX＋共通ヘルパー
 *
 * 固定ページ・投稿・カテゴリーを1つのマインドマップとして表現する。
 * ノードID表記は "page-123" / "cat-4" / "post-56" の複合ID（旧page-tree実装を踏襲）。
 * 書き込み系（親子付け替え・詳細更新・座標保存・新規ページ作成）は ajax-write.php。
 */

// 複合ID（page-123 等）を種別と実IDに分解
function lw_ss_parse_node_id( $composite_id ) {
    if ( !preg_match( '/^(page|cat|post)-(\d+)$/', (string) $composite_id, $m ) ) {
        return null;
    }
    return array( 'type' => $m[1], 'raw_id' => intval( $m[2] ) );
}

// 保存済みの自由配置座標を読む（無ければ null＝ツリー自動配置に委ねる）
function lw_ss_get_pos( $type, $raw_id ) {
    $raw = ( $type === 'cat' )
        ? get_term_meta( $raw_id, '_lw_sitestructure_pos', true )
        : get_post_meta( $raw_id, '_lw_sitestructure_pos', true );

    if ( empty( $raw ) ) {
        return null;
    }

    $pos = json_decode( $raw, true );
    if ( !is_array( $pos ) || !isset( $pos['x'], $pos['y'] ) ) {
        return null;
    }

    return array( 'x' => floatval( $pos['x'] ), 'y' => floatval( $pos['y'] ) );
}

// Ajax: サイト構造データを取得（固定ページ + カテゴリー + 投稿）
add_action( 'wp_ajax_lw_get_site_structure', 'lw_ss_ajax_get_site_structure' );
function lw_ss_ajax_get_site_structure() {
    check_ajax_referer( LW_SITE_STRUCTURE_NONCE_ACTION, 'nonce' );

    if ( !current_user_can( 'edit_pages' ) ) {
        wp_send_json_error( '権限がありません' );
    }

    $front_page_id = get_option( 'page_on_front' );
    $posts_page_id = get_option( 'page_for_posts' );

    $all_pages = get_posts( array(
        'post_type'      => 'page',
        'post_status'    => array( 'publish', 'draft', 'private', 'pending' ),
        'posts_per_page' => -1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    ) );

    $pages_data = array();
    foreach ( $all_pages as $page ) {
        $pages_data[] = array(
            'id'            => 'page-' . $page->ID,
            'raw_id'        => $page->ID,
            'title'         => $page->post_title ?: '(タイトルなし)',
            'slug'          => $page->post_name,
            'status'        => $page->post_status,
            'parent_id'     => $page->post_parent ? 'page-' . $page->post_parent : '',
            'type'          => 'page',
            'edit_url'      => get_edit_post_link( $page->ID, 'raw' ),
            'is_front'      => ( $page->ID == $front_page_id ),
            'is_posts_page' => ( $page->ID == $posts_page_id ),
            'pos'           => lw_ss_get_pos( 'page', $page->ID ),
        );
    }

    $categories = get_categories( array(
        'hide_empty' => false,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ) );

    $categories_data = array();
    foreach ( $categories as $cat ) {
        $categories_data[] = array(
            'id'         => 'cat-' . $cat->term_id,
            'raw_id'     => $cat->term_id,
            'title'      => $cat->name,
            'slug'       => $cat->slug,
            'status'     => 'publish',
            'parent_id'  => $cat->parent ? 'cat-' . $cat->parent : '',
            'type'       => 'category',
            'edit_url'   => get_edit_term_link( $cat->term_id, 'category' ),
            'post_count' => $cat->count,
            'pos'        => lw_ss_get_pos( 'cat', $cat->term_id ),
        );
    }

    $all_posts = get_posts( array(
        'post_type'      => 'post',
        'post_status'    => array( 'publish', 'draft', 'private', 'pending' ),
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ) );

    $posts_data = array();
    foreach ( $all_posts as $post ) {
        $post_cats     = wp_get_post_categories( $post->ID );
        $parent_cat_id = !empty( $post_cats ) ? 'cat-' . $post_cats[0] : '';

        $posts_data[] = array(
            'id'         => 'post-' . $post->ID,
            'raw_id'     => $post->ID,
            'title'      => $post->post_title ?: '(タイトルなし)',
            'slug'       => $post->post_name,
            'status'     => $post->post_status,
            'parent_id'  => $parent_cat_id,
            'type'       => 'post',
            'edit_url'   => get_edit_post_link( $post->ID, 'raw' ),
            'categories' => $post_cats,
            'pos'        => lw_ss_get_pos( 'post', $post->ID ),
        );
    }

    $show_on_front  = get_option( 'show_on_front' );
    $has_front_page = ( $show_on_front === 'page' && $front_page_id > 0 );

    wp_send_json_success( array(
        'pages'          => $pages_data,
        'categories'     => $categories_data,
        'posts'          => $posts_data,
        'front_page_id'  => $front_page_id ? 'page-' . $front_page_id : '',
        'posts_page_id'  => $posts_page_id ? 'page-' . $posts_page_id : '',
        'has_front_page' => $has_front_page,
        'totals'         => array(
            'pages'      => count( $pages_data ),
            'categories' => count( $categories_data ),
            'posts'      => count( $posts_data ),
        ),
    ) );
}
