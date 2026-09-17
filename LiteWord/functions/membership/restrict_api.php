<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定表示機能（ページ以外の経路）
 *
 * restrict_front.php は「ページとして開いたとき」しか止めていない。
 * 同じ本文が REST API と RSS からはログインなしで読めていたので、ここで塞ぐ。
 *   ① REST API  … /wp/v2/posts・/wp/v2/pages（単体・一覧・_embed）の content と excerpt を空にする
 *   ② RSS/Atom … content:encoded・description（抜粋）を空にする
 *   ③ メディア  … /wp/v2/media の一覧から、会員限定の記事に添付されたものを外す
 *
 * 判定はページ表示と同じ lw_membership_can_view_post()（roles.php）。
 * 題名と URL は今までどおり出す（一覧から外すかは別の判断・2026-08-12 に見送り）。
 * =============================================================== */

/**
 * REST で本文を返してよいか
 *
 * 🚨 ブロックエディタは REST（context=edit）で本文を読み書きする。
 *    その投稿を編集できる人まで空にすると、編集画面で本文が消えて保存で上書きされる。
 *    だから「見る権限」に加えて「編集できる人」も通す。
 *
 * ⚠️ REST はノンス（X-WP-Nonce）が無いリクエストを未ログインとして扱う。
 *    一覧ブロックの JS は fetch にノンスを付けていないので、会員が見ても未ログインと同じ結果になる。
 *
 * @param WP_Post $post
 * @return bool
 */
function lw_membership_rest_can_read( $post ) {
	return lw_membership_can_view_post( $post ) || current_user_can( 'edit_post', $post->ID );
}

/* ---------- ① REST API ---------- */
add_filter( 'rest_prepare_post', 'lw_membership_rest_hide_content', 10, 2 );
add_filter( 'rest_prepare_page', 'lw_membership_rest_hide_content', 10, 2 );
function lw_membership_rest_hide_content( $response, $post ) {

	if ( ! ( $response instanceof WP_REST_Response ) || lw_membership_rest_can_read( $post ) ) {
		return $response;
	}

	$data = $response->get_data();
	foreach ( [ 'content', 'excerpt' ] as $field ) {
		if ( ! isset( $data[ $field ] ) || ! is_array( $data[ $field ] ) ) {
			continue;   // _fields で外されている
		}
		foreach ( [ 'rendered', 'raw' ] as $key ) {
			if ( isset( $data[ $field ][ $key ] ) ) {
				$data[ $field ][ $key ] = '';
			}
		}
	}
	$response->set_data( $data );

	return $response;
}

/* ---------- ② RSS / Atom / RDF ---------- */
add_filter( 'the_content_feed', 'lw_membership_feed_hide_text', 999 );
add_filter( 'the_excerpt_rss', 'lw_membership_feed_hide_text', 999 );
function lw_membership_feed_hide_text( $text ) {
	return lw_membership_can_view_post( get_post() ) ? $text : '';
}

/* ---------- ③ メディアの一覧 ---------- */
/**
 * 会員限定の記事に添付されたメディアを /wp/v2/media の一覧から外す
 *
 * ⚠️ 外すのは「一覧」だけ。/wp/v2/media/<ID> の単体は今までどおり開ける（2026-09-16 Ryuichi 判断）。
 *    /wp-content/uploads/ のファイルそのものは、カスタマイザー「会員限定の記事の写真・PDF を守る」を
 *    ON にしたときだけ守る（protect_files/。サーバーによっては機能しない）。
 * ⚠️ 「添付」＝その記事の編集画面でアップロードしたもの（post_parent）。
 *    メディアライブラリから直接入れて記事に貼っただけの画像は、どの記事にも属さないので外れない。
 */
add_filter( 'rest_attachment_query', 'lw_membership_rest_hide_attachments' );
function lw_membership_rest_hide_attachments( $args ) {
	global $wpdb;

	// 管理者は常にすべて見られる（lw_check_view_permission() と同じ）
	if ( current_user_can( 'administrator' ) ) {
		return $args;
	}

	/*
	 * 🚨 添付を持つ記事を全部読んで1件ずつ判定すると、記事の多いサイトでこの一覧を開くたびに重くなる
	 *    （未ログインでも叩ける）。先に SQL で「制限がかかりうる記事」だけに絞ってから、正確な判定をする。
	 *    絞り込みの条件は「投稿自身に権限がある」か「制限のあるカテゴリーに入っている」。
	 *    例外（誰でも閲覧できる）の記事も候補に入るが、そこは下の判定で通すので漏れも取りこぼしも出ない。
	 */
	$restricted_cats = lw_membership_restricted_category_ids();
	$conditions      = [
		"EXISTS ( SELECT 1 FROM {$wpdb->postmeta} m WHERE m.post_id = p.ID AND m.meta_key = '_lw_allowed_roles' AND m.meta_value NOT IN ( '', 'a:0:{}' ) )",
	];
	if ( $restricted_cats ) {
		$conditions[] = "EXISTS ( SELECT 1 FROM {$wpdb->term_relationships} tr"
			. " INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
			. " WHERE tr.object_id = p.ID AND tt.taxonomy = 'category' AND tt.term_id IN ( " . implode( ',', array_map( 'intval', $restricted_cats ) ) . ' ) )';
	}

	$parent_ids = array_map( 'intval', $wpdb->get_col(
		"SELECT DISTINCT a.post_parent FROM {$wpdb->posts} a"
		. " INNER JOIN {$wpdb->posts} p ON p.ID = a.post_parent AND p.post_type IN ( 'post', 'page' )"
		. " WHERE a.post_type = 'attachment' AND a.post_parent > 0 AND ( " . implode( ' OR ', $conditions ) . ' )'
	) );
	if ( ! $parent_ids ) {
		return $args;
	}
	_prime_post_caches( $parent_ids, true, true );   // 候補だけ。1件ずつメタとタームを読みに行かない

	$hidden = [];
	foreach ( $parent_ids as $parent_id ) {
		$parent = get_post( (int) $parent_id );
		if ( $parent && ! lw_membership_rest_can_read( $parent ) ) {
			$hidden[] = $parent->ID;
		}
	}

	if ( $hidden ) {
		$current                     = isset( $args['post_parent__not_in'] ) ? (array) $args['post_parent__not_in'] : [];
		$args['post_parent__not_in'] = array_merge( $current, $hidden );
	}

	return $args;
}
