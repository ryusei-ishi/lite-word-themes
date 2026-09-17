<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― どのファイルを守るかを決める
 *
 * 守る     … 会員限定の記事で使っていて（member_usage.php）、公開の場所では使っていないもの
 * 守らない … 公開の場所でも使っているもの（public_usage.php。守ると公開ページの表示が崩れるため）
 * =============================================================== */

/**
 * 守るもの・守らないものを集める
 *
 * キーはメディアなら "a:ID"、メディアに登録されていないファイルなら "f:パス"。
 *
 * @return array{protected:array<string,array>,skipped:array<string,array>}
 */
function lw_member_files_collect() {
	$restricted = lw_member_files_restricted_post_ids();
	$usage      = lw_member_files_member_usage( $restricted );

	$items  = [];
	$lookup = [ 'file' => [], 'attachment' => [] ];

	foreach ( $usage['attachments'] as $attachment_id => $posts ) {
		$files = lw_member_files_attachment_files( $attachment_id );
		if ( ! $files ) {
			continue;
		}
		// 同じファイルを持つメディア（翻訳プラグインの複製など）は、いちばん小さい ID のまとまりに集める
		$siblings = lw_member_files_attachment_siblings( $attachment_id );
		$key      = 'a:' . min( $siblings );
		if ( isset( $items[ $key ] ) ) {
			$items[ $key ]['files'] = array_values( array_unique( array_merge( $items[ $key ]['files'], $files ) ) );
			$items[ $key ]['posts'] = array_values( array_unique( array_merge( $items[ $key ]['posts'], $posts ) ) );
		} else {
			$items[ $key ] = [ 'attachment' => min( $siblings ), 'siblings' => $siblings, 'files' => $files, 'posts' => $posts ];
		}
		foreach ( $siblings as $sibling ) {
			$lookup['attachment'][ $sibling ] = $key;
		}
		foreach ( $files as $file ) {
			$lookup['file'][ $file ] = $key;
		}
	}

	foreach ( $usage['files'] as $rel => $posts ) {
		if ( isset( $lookup['file'][ $rel ] ) ) {
			$key                    = $lookup['file'][ $rel ];
			$items[ $key ]['posts'] = array_values( array_unique( array_merge( $items[ $key ]['posts'], $posts ) ) );
			continue;
		}
		$key                    = 'f:' . $rel;
		$items[ $key ]          = [ 'attachment' => 0, 'files' => [ $rel ], 'posts' => $posts ];
		$lookup['file'][ $rel ] = $key;
	}

	$public  = $items ? lw_member_files_public_usage( $lookup, $restricted ) : [];
	$basedir = lw_member_files_env()['basedir'];
	$result  = [ 'protected' => [], 'skipped' => [] ];

	foreach ( $items as $key => $item ) {
		$item['files'] = array_values( array_filter( $item['files'], function ( $rel ) use ( $basedir ) {
			return is_file( $basedir . '/' . $rel );
		} ) );
		if ( ! $item['files'] ) {
			continue;
		}
		if ( isset( $public[ $key ] ) ) {
			$item['public']            = $public[ $key ];
			$result['skipped'][ $key ] = $item;
		} else {
			$result['protected'][ $key ] = $item;
		}
	}

	return $result;
}

/**
 * 公開ページの表示に使う投稿タイプ（公開の場所として数える）
 *
 * 表示できる投稿タイプ ＋ メニュー・テンプレート・追加 CSS など。マイパーツと同期パターンは、埋め込んだ側の一部として数える（parts.php）。
 * 問い合わせの保存先のような「表示しない投稿タイプ」は数えない（外部の人が書いた URL で守りが外れないように）。
 *
 * @return string[]
 */
function lw_member_files_public_post_types() {
	$types = [ 'nav_menu_item', 'wp_template', 'wp_template_part', 'wp_navigation', 'custom_css', 'wp_global_styles' ];
	foreach ( get_post_types() as $type ) {
		if ( $type !== 'attachment' && ! in_array( $type, lw_member_files_part_post_types(), true ) && is_post_type_viewable( $type ) ) {
			$types[] = $type;
		}
	}
	return array_values( array_unique( $types ) );
}

/**
 * メディアを扱える人（サイトを運営する側）か。会員限定の下書きを数えるかの判定に使う
 *
 * @param int $user_id
 * @return bool
 */
function lw_member_files_is_staff( $user_id ) {
	return lw_member_files_user_can( $user_id, 'upload_files' );
}

/**
 * 公開の場所として数える記事か
 *
 * メニュー・テンプレート・追加 CSS などは管理者しか作れないので、書いた人を問わない
 * （インポートや WP-CLI で作ると書いた人が 0 になる）。
 * それ以外は、記事を書ける人（edit_posts）が書いたものだけ。会員や外部の人が書いた投稿の URL で、守りを外せないように。
 *
 * @param string $post_type
 * @param int    $author
 * @return bool
 */
function lw_member_files_counts_as_public( $post_type, $author ) {
	if ( in_array( $post_type, [ 'nav_menu_item', 'wp_template', 'wp_template_part', 'wp_navigation', 'custom_css', 'wp_global_styles' ], true ) ) {
		return true;
	}
	return lw_member_files_user_can( $author, 'edit_posts' );
}

/** 権限の判定（同じ人を何度も調べない） */
function lw_member_files_user_can( $user_id, $capability ) {
	static $memo = [];
	$user_id = (int) $user_id;
	$key     = $user_id . ':' . $capability;
	if ( ! isset( $memo[ $key ] ) ) {
		$memo[ $key ] = $user_id > 0 && user_can( $user_id, $capability );
	}
	return $memo[ $key ];
}

/**
 * メタを走査するときに外すキー（メディア自身の情報とアイキャッチ）の SQL 条件
 *
 * @param string $column 例 meta_key / pm.meta_key
 * @return string
 */
function lw_member_files_meta_key_filter( $column = 'meta_key' ) {
	return " AND {$column} NOT IN ( '" . implode( "', '", lw_member_files_skip_meta_keys() ) . "' )";
}

/** 参照を探さないメタのキー（メディア自身の情報・アイキャッチ・編集中の印） */
function lw_member_files_skip_meta_keys() {
	return [ '_wp_attached_file', '_wp_attachment_metadata', '_wp_attachment_backup_sizes', '_thumbnail_id', '_edit_lock', '_edit_last' ];
}

/**
 * 投稿に効く閲覧権限（キャッシュを通さない）
 *
 * lw_get_allowed_roles_for_post() は結果を1時間キャッシュし、クイック編集でカテゴリーを移しても版が上がらない。
 * 永続オブジェクトキャッシュのサイトで古い判定を使わないよう、同じ順番で直接求める。
 *
 * @param int $post_id
 * @return string[]
 */
function lw_member_files_post_roles( $post_id ) {
	if ( lw_post_ignores_category_roles( $post_id ) ) {
		return [];
	}
	$roles = lw_get_post_allowed_roles( $post_id );
	return $roles ? $roles : lw_get_category_allowed_roles_for_post( $post_id );
}

/**
 * データベースのエラーが出たか（出た回の作り直しでは、目印を消さずに前のまま残す）
 *
 * @param bool|null $failed true で記録・false で消す・省略で読むだけ
 * @return bool
 */
function lw_member_files_db_failed( $failed = null ) {
	static $state = false;
	if ( $failed !== null ) {
		$state = (bool) $failed;
	}
	return $state;
}

/** 直前の問い合わせでエラーが出ていたら記録する */
function lw_member_files_db_check() {
	global $wpdb;
	if ( $wpdb->last_error !== '' ) {
		lw_member_files_db_failed( true );
	}
}
