<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 文字列からファイルへの参照を拾う
 * =============================================================== */

/** 空の参照 */
function lw_member_files_empty_refs() {
	return [ 'paths' => [], 'ids' => [], 'attached_gallery' => false, 'parts' => [] ];
}

/**
 * 本文・抜粋・メタの値などから、このサイトの uploads のファイルへの参照を拾う
 *
 * 拾うもの
 *   ・URL とパス（https://サイト/wp-content/uploads/… と /wp-content/uploads/…）
 *   ・画像のクラス wp-image-123
 *   ・[gallery ids="1,2"] [playlist ids="…"]（ids の無い形は、その記事にアップロードしたもの）
 *   ・埋め込んだマイパーツ・同期パターンの ID（中身は parts.php で展開する）
 *
 * @param string $text
 * @return array{paths:array<string,bool>,ids:array<int,bool>,attached_gallery:bool,parts:array<int,bool>}
 */
function lw_member_files_refs_from_text( $text ) {
	$refs = lw_member_files_empty_refs();
	$text = (string) $text;
	$env  = lw_member_files_env();
	if ( $text === '' || $env['error'] !== '' ) {
		return $refs;
	}

	// ブロックの属性（JSON）の中では / が \/ になっていることがある
	$text = str_replace( '\\/', '/', $text );

	if ( strpos( $text, $env['uploads_path'] ) !== false ) {
		lw_member_files_collect_paths( $text, $env['uploads_path'], $refs );
	}

	if ( strpos( $text, 'wp-image-' ) !== false && preg_match_all( '~\bwp-image-(\d+)\b~', $text, $hits ) ) {
		foreach ( $hits[1] as $id ) {
			$refs['ids'][ (int) $id ] = true;
		}
	}

	if ( strpos( $text, '[' ) !== false && preg_match_all( '~\[(gallery|playlist)\b([^\]]*)\]~', $text, $codes, PREG_SET_ORDER ) ) {
		foreach ( $codes as $code ) {
			if ( preg_match( '~\b(?:ids|include)\s*=\s*["\']?([0-9,\s]+)~', $code[2], $list ) ) {
				foreach ( preg_split( '~[,\s]+~', $list[1], -1, PREG_SPLIT_NO_EMPTY ) as $id ) {
					$refs['ids'][ (int) $id ] = true;
				}
			} else {
				$refs['attached_gallery'] = true;
			}
		}
	}

	lw_member_files_collect_part_ids( $text, $refs );
	return $refs;
}

/**
 * URL・パスを拾う
 *
 * ホスト付きはこのサイトのホストだけ。ホスト無しは「/」の直前が区切り文字のときだけ
 * （https://別サイト/sub/wp-content/uploads/… の途中を、このサイトのパスと取り違えないため）。
 *
 * @param string $text
 * @param string $uploads_path 例 /demo_08/wp-content/uploads/
 * @param array  $refs
 * @return void
 */
function lw_member_files_collect_paths( $text, $uploads_path, array &$refs ) {
	$pattern = '~(?:(?:https?:)?//([^/\s"\'<>]+)|(?<![^\s"\'(=,;>]))'
		. preg_quote( $uploads_path, '~' )
		. '([^\s"\'<>()\\\\,;?#&|*]+)~';

	if ( ! preg_match_all( $pattern, $text, $hits, PREG_SET_ORDER ) ) {
		return;
	}

	$hosts = lw_member_files_site_hosts();
	foreach ( $hits as $hit ) {
		$host = preg_replace( '~^www\.~', '', strtolower( $hit[1] ) );
		if ( $host !== '' && ! isset( $hosts[ $host ] ) ) {
			continue;
		}
		$rel = rtrim( rawurldecode( html_entity_decode( $hit[2], ENT_QUOTES, 'UTF-8' ) ), '.' );
		if ( lw_member_files_is_safe_rel( $rel ) ) {
			$refs['paths'][ $rel ] = true;
		}
	}
}

/**
 * マイパーツ（ショートコード・埋め込みブロック・ウィジェット）と同期パターンの ID を拾う
 *
 * @param string $text
 * @param array  $refs
 * @return void
 */
function lw_member_files_collect_part_ids( $text, array &$refs ) {
	$patterns = [
		'my_parts_content' => '~\[my_parts_content\b[^\]]*?\bid\s*=\s*["\']?(\d+)~',
		'partsId'          => '~"partsId"\s*:\s*(\d+)~',
		'wp:block'         => '~<!--\s*wp:block\s+\{[^}]*"ref"\s*:\s*(\d+)~',
		'parts_id'         => '~"parts_id";(?:i:(\d+)|s:\d+:"(\d+)")~',
	];
	foreach ( $patterns as $needle => $pattern ) {
		if ( strpos( $text, $needle ) === false || ! preg_match_all( $pattern, $text, $hits, PREG_SET_ORDER ) ) {
			continue;
		}
		foreach ( $hits as $hit ) {
			$id = (int) ( ! empty( $hit[1] ) ? $hit[1] : ( isset( $hit[2] ) ? $hit[2] : 0 ) );
			if ( $id > 0 ) {
				$refs['parts'][ $id ] = true;
			}
		}
	}
}

/**
 * 参照をまとめる
 *
 * @param array $into
 * @param array $refs
 * @return array
 */
function lw_member_files_merge_refs( array $into, array $refs ) {
	$into['paths']            += $refs['paths'];
	$into['ids']              += $refs['ids'];
	$into['parts']            += $refs['parts'];
	$into['attached_gallery']  = $into['attached_gallery'] || $refs['attached_gallery'];
	return $into;
}
