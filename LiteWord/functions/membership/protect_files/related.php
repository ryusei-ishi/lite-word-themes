<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 変更が守るファイルに関係するか
 *
 * 返す値
 *   'now'   … このリクエストの最後に作り直す（放っておくと、守るべきファイルが守られないままになる変更）
 *   'later' … 裏の予約で作り直す（守りを外す側の変更。公開ページの画像が少しの間出ないことがあるだけ）
 *   ''      … 作り直さない
 * =============================================================== */

/** 一覧に何か載っているか（載っていなければ、公開の場所の変更で作り直す必要はない） */
function lw_member_files_has_index() {
	$index = lw_member_files_get_index();
	return ! empty( $index['protected'] ) || ! empty( $index['skipped'] );
}

/**
 * 保存された記事
 *
 * @param WP_Post $post
 * @return string
 */
function lw_member_files_post_change( WP_Post $post ) {
	$text = $post->post_content . "\n" . $post->post_excerpt . "\n" . lw_member_files_meta_text( $post->ID );

	if ( in_array( $post->post_type, lw_member_files_part_post_types(), true ) ) {
		$refs = lw_member_files_expand_parts( lw_member_files_refs_from_text( $text ) );
		return ( $refs['paths'] || $refs['ids'] || lw_member_files_has_index() ) ? 'now' : '';   // 会員限定の記事に埋め込んだパーツかもしれない
	}
	if ( in_array( $post->post_type, [ 'post', 'page' ], true ) && lw_member_files_post_roles( $post->ID ) ) {
		return 'now';
	}
	if ( ! lw_member_files_has_index() ) {
		return '';
	}

	$index = lw_member_files_get_index();
	if ( isset( $index['posts'][ $post->ID ] ) ) {
		return 'later';   // 会員限定だった記事が公開に戻った・公開の場所だった記事が変わった
	}
	if ( ! in_array( $post->post_type, lw_member_files_public_post_types(), true ) || ! lw_member_files_counts_as_public( $post->post_type, $post->post_author ) ) {
		return '';        // 公開の場所として数えない記事（問い合わせの保存など）
	}

	$refs = lw_member_files_expand_parts( lw_member_files_refs_from_text( $text ) );
	foreach ( array_keys( $refs['paths'] ) as $rel ) {
		if ( isset( $index['files'][ $rel ] ) ) {
			return 'later';
		}
	}
	foreach ( array_keys( $refs['ids'] ) + [ -1 => (int) get_post_thumbnail_id( $post ) ] as $id ) {
		if ( isset( $index['attachments'][ $id ] ) ) {
			return 'later';
		}
	}
	return '';
}

/**
 * アップロード・サイズ違いの作り直し
 *
 * @param int        $attachment_id
 * @param array|null $new_meta  更新後のメタデータ（ファイルの顔ぶれが変わっていなければ作り直さない）
 * @param int        $parent_id 新しい親（メディア一覧の「添付」ではキャッシュの親が古いため渡す）
 * @return string
 */
function lw_member_files_attachment_change( $attachment_id, $new_meta = null, $parent_id = 0 ) {
	$index = lw_member_files_get_index();
	if ( isset( $index['attachments'][ $attachment_id ] ) ) {
		if ( ! is_array( $new_meta ) ) {
			return 'now';
		}
		$before = lw_member_files_attachment_files( $attachment_id );
		$after  = lw_member_files_attachment_files( $attachment_id, $new_meta );
		sort( $before );
		sort( $after );
		return $before === $after ? '' : 'now';   // 画像の最適化プラグインがメタデータだけ書き換えた、などは作り直さない
	}

	$parent = $parent_id > 0 ? (int) $parent_id : (int) wp_get_post_parent_id( $attachment_id );
	return ( $parent > 0 && in_array( get_post_type( $parent ), [ 'post', 'page' ], true ) && lw_member_files_post_roles( $parent ) ) ? 'now' : '';
}

/**
 * 記事のメタの変更
 *
 * @param string $meta_key
 * @return string
 */
function lw_member_files_post_meta_change( $meta_key ) {
	if ( in_array( $meta_key, [ '_lw_allowed_roles', '_lw_ignore_category_roles' ], true ) ) {
		return 'now';
	}
	if ( ( $meta_key === '_thumbnail_id' || in_array( $meta_key, lw_member_files_ogp_meta_keys(), true ) ) && lw_member_files_has_index() ) {
		return 'later';
	}
	return '';
}

/**
 * カテゴリーのメタの変更
 *
 * @param string $meta_key
 * @return string
 */
function lw_member_files_term_meta_change( $meta_key ) {
	if ( in_array( $meta_key, [ '_lw_allowed_roles', '_lw_role_mode', '_lw_restrict_scope' ], true ) ) {
		return 'now';
	}
	if ( in_array( $meta_key, [ 'category_thumbnail_id', 'category_og_image' ], true ) && lw_member_files_has_index() ) {
		return 'later';
	}
	return '';
}

/**
 * オプションの変更（ウィジェット・サイトアイコン・テーマの設定・OGP の既定画像）
 *
 * @param string $option
 * @return string
 */
function lw_member_files_option_change( $option ) {
	$watch = strpos( $option, 'widget_' ) === 0
		|| $option === 'theme_mods_' . get_stylesheet()
		|| in_array( $option, lw_member_files_public_option_names(), true );
	return ( $watch && lw_member_files_has_index() ) ? 'later' : '';
}
