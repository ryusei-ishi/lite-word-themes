<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 埋め込んだマイパーツ・同期パターンの中身
 *
 * マイパーツ（lw_my_parts）と同期パターン（wp_block）は、それ単体では表示されない。
 * 埋め込んだ記事・ウィジェット・テーマの設定の「一部」として数える
 * （会員限定の記事だけに埋め込んだパーツの PDF は守り、公開の場所にも埋め込んでいれば守らない）。
 * =============================================================== */

/** 中身を展開する投稿タイプ */
function lw_member_files_part_post_types() {
	return [ 'lw_my_parts', 'wp_block' ];
}

/**
 * 参照に含まれるパーツの中身を展開して足す（入れ子は3段まで）
 *
 * @param array $refs lw_member_files_refs_from_text() の戻り値
 * @return array
 */
function lw_member_files_expand_parts( array $refs ) {
	if ( ! $refs['parts'] ) {
		return $refs;
	}
	return lw_member_files_merge_refs( $refs, lw_member_files_refs_of_parts( array_keys( $refs['parts'] ), 0 ) );
}

/**
 * パーツの本文・メタにある参照（パーツの中の [gallery] は数えない）
 *
 * @param int[] $part_ids
 * @param int   $depth
 * @param bool  $reset 作り直しの始めに true
 * @return array
 */
function lw_member_files_refs_of_parts( array $part_ids, $depth, $reset = false ) {
	static $memo = [];
	if ( $reset ) {
		$memo = [];
	}

	$refs = lw_member_files_empty_refs();
	if ( $depth > 3 ) {
		return $refs;
	}

	foreach ( $part_ids as $part_id ) {
		$part_id = (int) $part_id;
		if ( ! isset( $memo[ $part_id ] ) ) {
			$memo[ $part_id ] = lw_member_files_empty_refs();   // 先に入れて、パーツどうしの循環を止める
			$part             = get_post( $part_id );
			if ( $part && lw_member_files_part_is_shown( $part ) ) {
				$found                    = lw_member_files_refs_from_text( $part->post_content . "\n" . lw_member_files_meta_text( $part_id ) );
				$found['attached_gallery'] = false;
				$inner                    = lw_member_files_refs_of_parts( array_keys( $found['parts'] ), $depth + 1 );
				$memo[ $part_id ]         = lw_member_files_merge_refs( $found, $inner );
			}
		}
		$refs = lw_member_files_merge_refs( $refs, $memo[ $part_id ] );
	}
	return $refs;
}

/**
 * 埋め込んだ側で実際に表示されるパーツか
 *
 * マイパーツのショートコードは、ゴミ箱や非公開のパーツも表示する（show_draft="false" の下書きだけ出さない）。
 * 同期パターンは公開中のものだけ表示される。
 *
 * @param WP_Post $part
 * @return bool
 */
function lw_member_files_part_is_shown( WP_Post $part ) {
	if ( $part->post_type === 'lw_my_parts' ) {
		return $part->post_status !== 'auto-draft';
	}
	return $part->post_type === 'wp_block' && $part->post_status === 'publish';
}

/**
 * 記事のメタのうち、uploads を含む文字列をつないで返す（コードで書いたパーツの HTML・CSS など）
 *
 * @param int $post_id
 * @return string
 */
function lw_member_files_meta_text( $post_id ) {
	$skip = lw_member_files_skip_meta_keys();
	$text = '';
	foreach ( (array) get_post_meta( $post_id ) as $key => $values ) {
		if ( in_array( $key, $skip, true ) ) {
			continue;
		}
		foreach ( (array) $values as $value ) {
			if ( is_string( $value ) && strpos( $value, lw_member_files_uploads_word() ) !== false ) {
				$text .= "\n" . $value;
			}
		}
	}
	return $text;
}
