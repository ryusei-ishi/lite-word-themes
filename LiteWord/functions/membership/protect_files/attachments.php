<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― メディア1件が持つファイル
 * =============================================================== */

/**
 * メディア1件のファイルを uploads からの相対パスで返す
 *
 * 本体・大きい画像の元画像（-scaled の前）・各サイズ・別形式（WebP など）・
 * 画像編集前の控え・PDF のプレビュー画像。1枚でも公開の場所で使われていれば、
 * このまとまりごと守らない（srcset で別のサイズが読まれるため）。
 *
 * @param int        $attachment_id
 * @param array|null $meta 更新前後の比較で使うとき、メタデータを渡す
 * @return string[]
 */
function lw_member_files_attachment_files( $attachment_id, $meta = null ) {
	$file = lw_member_files_attached_rel( (string) get_post_meta( $attachment_id, '_wp_attached_file', true ) );
	if ( $file === '' ) {
		return [];
	}

	$dir   = dirname( $file );
	$dir   = ( $dir === '.' ) ? '' : $dir . '/';
	$files = [ $file => true ];
	$meta  = is_array( $meta ) ? $meta : wp_get_attachment_metadata( $attachment_id, true );

	if ( is_array( $meta ) ) {
		if ( ! empty( $meta['original_image'] ) ) {
			$files[ $dir . $meta['original_image'] ] = true;
		}
		$source_lists = [ isset( $meta['sources'] ) ? $meta['sources'] : [] ];
		if ( ! empty( $meta['sizes'] ) && is_array( $meta['sizes'] ) ) {
			foreach ( $meta['sizes'] as $size ) {
				if ( ! empty( $size['file'] ) ) {
					$files[ $dir . $size['file'] ] = true;
				}
				if ( ! empty( $size['sources'] ) ) {
					$source_lists[] = $size['sources'];
				}
			}
		}
		foreach ( $source_lists as $sources ) {
			foreach ( (array) $sources as $source ) {
				if ( is_array( $source ) && ! empty( $source['file'] ) ) {
					$files[ $dir . $source['file'] ] = true;
				}
			}
		}
	}

	$backups = get_post_meta( $attachment_id, '_wp_attachment_backup_sizes', true );
	if ( is_array( $backups ) ) {
		foreach ( $backups as $backup ) {
			if ( ! empty( $backup['file'] ) ) {
				$files[ $dir . $backup['file'] ] = true;
			}
		}
	}

	return array_values( array_filter( array_keys( $files ), 'lw_member_files_is_safe_rel' ) );
}

/**
 * _wp_attached_file の値を uploads からの相対パスにそろえる（使えない値は空文字）
 *
 * @param string $value
 * @return string
 */
function lw_member_files_attached_rel( $value ) {
	$value = wp_normalize_path( $value );
	if ( $value === '' ) {
		return '';
	}
	// 古いサイトには絶対パスで入っていることがある
	if ( $value[0] === '/' || preg_match( '~^[A-Za-z]:/~', $value ) ) {
		$base = lw_member_files_env()['basedir'] . '/';
		if ( strpos( $value, $base ) !== 0 ) {
			return '';
		}
		$value = substr( $value, strlen( $base ) );
	}
	return lw_member_files_is_safe_rel( $value ) ? $value : '';
}

/**
 * サイズ違い・別形式・編集後の名前から、元の名前（フォルダ付き・拡張子なし）を出す
 *
 * photo-300x200.jpg / photo-scaled.jpg / photo-e1695000000000-300x200.jpg /
 * photo-300x200-jpg.webp / document-pdf-212x300.jpg → photo / document
 *
 * @param string $rel
 * @return string
 */
function lw_member_files_stem( $rel ) {
	$dir  = dirname( $rel );
	$dir  = ( $dir === '.' ) ? '' : $dir . '/';
	$name = pathinfo( $rel, PATHINFO_FILENAME );
	$type = '~-(?:jpe?g|png|gif|webp|avif|heic|pdf)$~i';

	$name = preg_replace( $type, '', $name );
	$name = preg_replace( '~-\d+x\d+$~', '', $name );
	$name = preg_replace( $type, '', $name );
	$name = preg_replace( '~-(?:scaled|rotated)$~', '', $name );
	$name = preg_replace( '~-e\d{13}$~', '', $name );

	return $dir . $name;
}

/**
 * すべてのメディアの本体ファイルの表（作り直し1回につき1度だけ読む）
 *
 * @param bool $reset 作り直しの始めに true（前の回の表を使わない）
 * @return array{by_file:array<string,int[]>,by_stem:array<string,int[]>}
 */
function lw_member_files_attached_table( $reset = false ) {
	static $table = null;
	if ( $reset ) {
		$table = null;
	}
	if ( $table !== null ) {
		return $table;
	}
	global $wpdb;

	$table = [ 'by_file' => [], 'by_stem' => [] ];
	$rows  = (array) $wpdb->get_results( "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = '_wp_attached_file'" );
	lw_member_files_db_check();
	foreach ( $rows as $row ) {
		$rel = lw_member_files_attached_rel( (string) $row->meta_value );
		if ( $rel === '' ) {
			continue;
		}
		$table['by_file'][ $rel ][]                         = (int) $row->post_id;
		$table['by_stem'][ lw_member_files_stem( $rel ) ][] = (int) $row->post_id;
	}
	return $table;
}

/**
 * 同じ本体ファイルを持つメディア（翻訳プラグインの複製など）
 *
 * @param int $attachment_id
 * @return int[] 自分を含む
 */
function lw_member_files_attachment_siblings( $attachment_id ) {
	$rel   = lw_member_files_attached_rel( (string) get_post_meta( $attachment_id, '_wp_attached_file', true ) );
	$table = lw_member_files_attached_table();
	return ( $rel !== '' && isset( $table['by_file'][ $rel ] ) ) ? $table['by_file'][ $rel ] : [ (int) $attachment_id ];
}

/**
 * ファイルのパスから、それを持っているメディアを探す
 *
 * @param string[] $paths uploads からの相対パス
 * @return array<string,int> パス => メディアの ID（見つからなかったパスは入らない）
 */
function lw_member_files_find_attachments( array $paths ) {
	$table = lw_member_files_attached_table();
	$ids   = [];
	foreach ( $paths as $path ) {
		$stem = lw_member_files_stem( $path );
		foreach ( isset( $table['by_stem'][ $stem ] ) ? $table['by_stem'][ $stem ] : [] as $id ) {
			$ids[ $id ] = true;
		}
	}
	if ( ! $ids ) {
		return [];
	}

	update_meta_cache( 'post', array_keys( $ids ) );
	lw_member_files_db_check();

	$owner = [];
	foreach ( array_keys( $ids ) as $id ) {
		foreach ( lw_member_files_attachment_files( $id ) as $file ) {
			if ( ! isset( $owner[ $file ] ) ) {
				$owner[ $file ] = $id;
			}
		}
	}

	$result = [];
	foreach ( $paths as $path ) {
		if ( isset( $owner[ $path ] ) ) {
			$result[ $path ] = $owner[ $path ];
		}
	}
	return $result;
}
