<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 公開の場所で使っているかを調べる
 *
 * 公開の場所
 *   ・公開中で会員限定ではない、表示に使う投稿タイプの本文・抜粋・メタ、メニュー、埋め込んだパーツ
 *     （書いた人が記事を書ける人のものだけ。問い合わせの保存などで外部の人が書いた URL は数えない）
 *   ・アイキャッチ画像と SEO プラグインの OGP 画像（会員限定の記事も、一覧や SNS のカードに出るので含める）
 *   ・テーマの設定（ロゴなど）・OGP の既定画像・カテゴリーの画像・サイトアイコン・ウィジェット（settings_usage.php）
 * =============================================================== */

/**
 * 候補のうち、公開の場所でも使っているもの
 *
 * @param array           $lookup     [ 'file' => [ パス => キー ], 'attachment' => [ メディアID => キー ] ]
 * @param array<int,bool> $restricted 会員限定の記事
 * @return array<string,string[]> キー => 使っている場所（'post:12' 'menu:34' 'thumbnail:12' 'ogp:12' 'theme_mod' など。最大5件）
 */
function lw_member_files_public_usage( array $lookup, array $restricted ) {
	$found = [];
	$types = "'" . implode( "','", array_map( 'esc_sql', lw_member_files_public_post_types() ) ) . "'";

	lw_member_files_public_in_posts( $lookup, $restricted, $types, $found );
	lw_member_files_public_in_meta( $lookup, $restricted, $types, $found );
	lw_member_files_public_thumbnails( $lookup, $types, $found );
	lw_member_files_public_in_settings( $lookup, $found );

	foreach ( $found as $key => $labels ) {
		$found[ $key ] = array_slice( array_keys( $labels ), 0, 5 );
	}
	return $found;
}

/**
 * 拾った参照（埋め込んだパーツの中身も）のうち候補に当たるものに、場所の名前を付ける
 *
 * @return void
 */
function lw_member_files_mark_public( array $lookup, array $refs, $label, array &$found ) {
	$refs = lw_member_files_expand_parts( $refs );
	foreach ( array_keys( $refs['paths'] ) as $rel ) {
		if ( isset( $lookup['file'][ $rel ] ) ) {
			$found[ $lookup['file'][ $rel ] ][ $label ] = true;
		}
	}
	foreach ( array_keys( $refs['ids'] ) as $id ) {
		if ( isset( $lookup['attachment'][ $id ] ) ) {
			$found[ $lookup['attachment'][ $id ] ][ $label ] = true;
		}
	}
}

/** 公開中の記事の本文・抜粋 */
function lw_member_files_public_in_posts( array $lookup, array $restricted, $types, array &$found ) {
	global $wpdb;

	$word      = esc_sql( $wpdb->esc_like( lw_member_files_uploads_word() ) );
	$last      = 0;
	$galleries = [];

	do {
		$rows = (array) $wpdb->get_results( $wpdb->prepare(
			"SELECT ID, post_type, post_author, post_content, post_excerpt FROM {$wpdb->posts}"
			. " WHERE ID > %d AND post_status = 'publish' AND post_type IN ( {$types} )"
			. " AND ( post_content LIKE '%%{$word}%%' OR post_excerpt LIKE '%%{$word}%%' OR post_content LIKE '%%wp-image-%%'"
			. " OR post_content LIKE '%%[gallery%%' OR post_content LIKE '%%[playlist%%'"
			. " OR post_content LIKE '%%my_parts_content%%' OR post_content LIKE '%%partsId%%' OR post_content LIKE '%%wp:block%%' )"
			. ' ORDER BY ID ASC LIMIT 200',
			$last
		) );
		lw_member_files_db_check();
		foreach ( $rows as $row ) {
			$last = (int) $row->ID;
			if ( isset( $restricted[ $last ] ) || ! lw_member_files_counts_as_public( $row->post_type, $row->post_author ) ) {
				continue;
			}
			$refs = lw_member_files_refs_from_text( $row->post_content . "\n" . $row->post_excerpt );
			lw_member_files_mark_public( $lookup, $refs, 'post:' . $last, $found );
			if ( $refs['attached_gallery'] ) {
				$galleries[] = $last;
			}
		}
	} while ( count( $rows ) === 200 );

	// ids の無い [gallery] は、その記事にアップロードしたものを並べる
	foreach ( array_chunk( $galleries, 200 ) as $chunk ) {
		$rows = (array) $wpdb->get_results( "SELECT ID, post_parent FROM {$wpdb->posts} WHERE post_type = 'attachment' AND post_parent IN ( " . implode( ',', $chunk ) . ' )' );
		lw_member_files_db_check();
		foreach ( $rows as $row ) {
			if ( isset( $lookup['attachment'][ (int) $row->ID ] ) ) {
				$found[ $lookup['attachment'][ (int) $row->ID ] ][ 'post:' . (int) $row->post_parent ] = true;
			}
		}
	}
}

/**
 * 公開中の記事のメタ（OGP 画像・コードで作ったページの HTML・メニューのリンク先など）
 *
 * SEO プラグインの OGP 画像は、会員限定の記事のものでも SNS のカードに出るので公開の場所に数える。
 */
function lw_member_files_public_in_meta( array $lookup, array $restricted, $types, array &$found ) {
	global $wpdb;

	$word = esc_sql( $wpdb->esc_like( lw_member_files_uploads_word() ) );
	$ogp  = lw_member_files_ogp_meta_keys();
	$last = 0;

	do {
		$rows = (array) $wpdb->get_results( $wpdb->prepare(
			"SELECT pm.meta_id, pm.post_id, pm.meta_key, p.post_type, p.post_author, pm.meta_value FROM {$wpdb->postmeta} pm"
			. " INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id"
			. " WHERE pm.meta_id > %d AND p.post_status = 'publish' AND p.post_type IN ( {$types} )"
			. " AND ( pm.meta_value LIKE '%%{$word}%%' OR pm.meta_value LIKE '%%my_parts_content%%' OR pm.meta_value LIKE '%%wp:block%%' )"
			. lw_member_files_meta_key_filter( 'pm.meta_key' )
			. ' ORDER BY pm.meta_id ASC LIMIT 500',
			$last
		) );
		lw_member_files_db_check();
		foreach ( $rows as $row ) {
			$last     = (int) $row->meta_id;
			$is_ogp   = in_array( $row->meta_key, $ogp, true );
			$post_id  = (int) $row->post_id;
			if ( ( isset( $restricted[ $post_id ] ) && ! $is_ogp ) || ! lw_member_files_counts_as_public( $row->post_type, $row->post_author ) ) {
				continue;
			}
			$label = $is_ogp ? 'ogp:' . $post_id : ( ( $row->post_type === 'nav_menu_item' ? 'menu:' : 'post:' ) . $post_id );
			lw_member_files_mark_public( $lookup, lw_member_files_refs_from_text( $row->meta_value ), $label, $found );
		}
	} while ( count( $rows ) === 500 );
}

/** 公開中の記事のアイキャッチ */
function lw_member_files_public_thumbnails( array $lookup, $types, array &$found ) {
	global $wpdb;

	foreach ( array_chunk( array_keys( $lookup['attachment'] ), 200 ) as $chunk ) {
		$values = "'" . implode( "','", array_map( 'intval', $chunk ) ) . "'";
		$rows   = (array) $wpdb->get_results(
			"SELECT pm.post_id, pm.meta_key, p.post_type, p.post_author, pm.meta_value FROM {$wpdb->postmeta} pm INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id"
			. " WHERE pm.meta_key IN ( '_thumbnail_id', '" . implode( "', '", array_map( 'esc_sql', lw_member_files_ogp_meta_keys() ) ) . "' )"
			. " AND p.post_status = 'publish' AND p.post_type IN ( {$types} ) AND pm.meta_value IN ( {$values} )"
		);
		lw_member_files_db_check();
		foreach ( $rows as $row ) {
			if ( lw_member_files_counts_as_public( $row->post_type, $row->post_author ) ) {
				$label = ( $row->meta_key === '_thumbnail_id' ? 'thumbnail:' : 'ogp:' ) . (int) $row->post_id;
				$found[ $lookup['attachment'][ (int) $row->meta_value ] ][ $label ] = true;
			}
		}
	}
}

/**
 * SEO の OGP 画像を持つメタのキー（URL か メディアの ID）
 *
 * LiteWord 自身の seo_og_image は入れない。会員限定の記事では、見る権限の無い人に og:image を出さないため
 * （login_handler.php の lw_membership_block() が lw_output_seo_meta_tags を外す）。
 *
 * @return string[]
 */
function lw_member_files_ogp_meta_keys() {
	return [
		'_yoast_wpseo_opengraph-image', '_yoast_wpseo_opengraph-image-id', '_yoast_wpseo_twitter-image', '_yoast_wpseo_twitter-image-id',
		'rank_math_facebook_image', 'rank_math_facebook_image_id', 'rank_math_twitter_image', 'rank_math_twitter_image_id',
		'_seopress_social_fb_img', '_seopress_social_twitter_img',
	];
}
