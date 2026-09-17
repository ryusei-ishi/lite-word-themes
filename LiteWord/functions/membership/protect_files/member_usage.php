<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 会員限定の記事で使っているものを集める
 * =============================================================== */

/**
 * 会員限定の投稿・固定ページの ID
 *
 * 下書き・予約・非公開・ゴミ箱も含める（ゴミ箱に入れた記事の写真を、その時点で公開に戻さないため）。
 * ただし寄稿者の下書き・レビュー待ちは数えない（メディアを扱えない人の下書きで、何でも守らせられないように）。
 *
 * @return array<int,bool>
 */
function lw_member_files_restricted_post_ids() {
	global $wpdb;

	$cats  = [];
	$terms = get_terms( [ 'taxonomy' => 'category', 'hide_empty' => false, 'update_term_meta_cache' => true ] );
	if ( is_wp_error( $terms ) ) {
		lw_member_files_db_failed( true );
		return [];
	}
	foreach ( $terms as $term ) {
		if ( lw_get_effective_term_roles( $term->term_id, 'single' ) ) {
			$cats[] = (int) $term->term_id;
		}
	}

	$conditions = [ "EXISTS ( SELECT 1 FROM {$wpdb->postmeta} m WHERE m.post_id = p.ID AND m.meta_key = '_lw_allowed_roles' AND m.meta_value NOT IN ( '', 'a:0:{}' ) )" ];
	if ( $cats ) {
		$conditions[] = "EXISTS ( SELECT 1 FROM {$wpdb->term_relationships} tr"
			. " INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
			. " WHERE tr.object_id = p.ID AND tt.taxonomy = 'category' AND tt.term_id IN ( " . implode( ',', $cats ) . ' ) )';
	}

	$rows = $wpdb->get_results(
		"SELECT p.ID, p.post_author, p.post_status FROM {$wpdb->posts} p WHERE p.post_type IN ( 'post', 'page' )"
		. " AND p.post_status IN ( 'publish', 'future', 'draft', 'pending', 'private', 'trash' )"
		. ' AND ( ' . implode( ' OR ', $conditions ) . ' )'
	);
	lw_member_files_db_check();
	if ( ! $rows ) {
		return [];
	}
	_prime_post_caches( array_map( 'intval', wp_list_pluck( $rows, 'ID' ) ), true, true );
	lw_member_files_db_check();

	$restricted = [];
	foreach ( $rows as $row ) {
		$id = (int) $row->ID;
		if ( lw_member_files_counts_as_member_post( $id, $row->post_author, $row->post_status ) && lw_member_files_post_roles( $id ) ) {
			$restricted[ $id ] = true;
		}
	}
	return $restricted;
}

/**
 * 会員限定の記事として数えるか（公開・予約・非公開、またはメディアを扱える人の記事）
 *
 * @param int    $post_id
 * @param int    $author
 * @param string $status
 * @return bool
 */
function lw_member_files_counts_as_member_post( $post_id, $author, $status ) {
	$published = [ 'publish', 'future', 'private' ];
	if ( in_array( $status, $published, true ) || lw_member_files_is_staff( $author ) ) {
		return true;
	}
	return $status === 'trash' && in_array( get_post_meta( $post_id, '_wp_trash_meta_status', true ), $published, true );
}

/**
 * 会員限定の記事で使われているメディアとファイル
 *
 * 本文・抜粋・メタ（コードで作ったページの HTML など）・埋め込んだマイパーツで参照しているもの ＋
 * その記事の編集画面でアップロードしたもの（本文から外しても、その記事のものとして守る）。
 *
 * @param array<int,bool> $restricted
 * @return array{attachments:array<int,int[]>,files:array<string,int[]>}
 */
function lw_member_files_member_usage( array $restricted ) {
	global $wpdb;

	$paths = [];   // パス => 記事ID
	$ids   = [];   // メディアID => 記事ID

	foreach ( array_chunk( array_keys( $restricted ), 100 ) as $chunk ) {
		$in = implode( ',', array_map( 'intval', $chunk ) );

		$rows = (array) $wpdb->get_results( "SELECT ID, post_content, post_excerpt FROM {$wpdb->posts} WHERE ID IN ( {$in} )" );
		lw_member_files_db_check();
		foreach ( $rows as $row ) {
			lw_member_files_note_refs( $paths, $ids, (int) $row->ID, lw_member_files_refs_from_text( $row->post_content . "\n" . $row->post_excerpt ) );
		}

		$rows = (array) $wpdb->get_results( "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE post_id IN ( {$in} ) AND meta_value LIKE '%" . esc_sql( $wpdb->esc_like( lw_member_files_uploads_word() ) ) . "%'" . lw_member_files_meta_key_filter() );
		lw_member_files_db_check();
		foreach ( $rows as $row ) {
			lw_member_files_note_refs( $paths, $ids, (int) $row->post_id, lw_member_files_refs_from_text( $row->meta_value ) );
		}

		$rows = (array) $wpdb->get_results( "SELECT ID, post_parent FROM {$wpdb->posts} WHERE post_type = 'attachment' AND post_parent IN ( {$in} )" );
		lw_member_files_db_check();
		foreach ( $rows as $row ) {
			$ids[ (int) $row->ID ][] = (int) $row->post_parent;
		}
	}

	$owners = $paths ? lw_member_files_find_attachments( array_keys( $paths ) ) : [];
	$files  = [];
	foreach ( $paths as $rel => $posts ) {
		if ( isset( $owners[ $rel ] ) ) {
			$id         = $owners[ $rel ];
			$ids[ $id ] = array_merge( isset( $ids[ $id ] ) ? $ids[ $id ] : [], $posts );
		} else {
			$files[ $rel ] = array_values( array_unique( $posts ) );
		}
	}

	// wp-image-123 などで指していても、メディアでなければ落とす
	$attachments = [];
	if ( $ids ) {
		$real = array_map( 'intval', (array) $wpdb->get_col( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'attachment' AND ID IN ( " . implode( ',', array_map( 'intval', array_keys( $ids ) ) ) . ' )' ) );
		lw_member_files_db_check();
		foreach ( $real as $id ) {
			$attachments[ $id ] = array_values( array_unique( $ids[ $id ] ) );
		}
	}

	return [ 'attachments' => $attachments, 'files' => $files ];
}

/**
 * 拾った参照を「どの記事で使っているか」の表に足す
 *
 * @param array $paths
 * @param array $ids
 * @param int   $post_id
 * @param array $refs lw_member_files_refs_from_text() の戻り値
 * @return void
 */
function lw_member_files_note_refs( array &$paths, array &$ids, $post_id, array $refs ) {
	$refs = lw_member_files_expand_parts( $refs );
	foreach ( array_keys( $refs['paths'] ) as $rel ) {
		$paths[ $rel ][] = $post_id;
	}
	foreach ( array_keys( $refs['ids'] ) as $id ) {
		$ids[ $id ][] = $post_id;
	}
}
