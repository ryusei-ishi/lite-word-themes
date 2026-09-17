<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― .htaccess のルール
 *
 * WordPress のルールと同じ .htaccess（サイトのフォルダ）に、
 * 「# BEGIN LiteWord Member Files」〜「# END LiteWord Member Files」で囲んで書く。
 * uploads の中には置かない（そこに書き換えルールを置くと、上の階層のルールが
 * uploads に効かなくなり、公開ファイルの配り方まで変わるため）。
 * =============================================================== */

function lw_member_files_htaccess_marker() {
	return 'LiteWord Member Files';
}

/**
 * 書き込むルール
 *
 *   1. 目印のフォルダは開かせない
 *   2. 実在するファイルのうち、同じパスの目印があるものだけ index.php に回す（URL は変わらない）
 *
 * @return string[]
 */
function lw_member_files_htaccess_lines() {
	$env    = lw_member_files_env();
	$rel    = preg_quote( $env['uploads_rel'] );
	$marker = lw_member_files_marker_dirname();

	return [
		'# LiteWord テーマの「会員限定の記事の写真・PDF を守る」が書いています。設定を OFF にすると消えます。',
		'<IfModule mod_rewrite.c>',
		'RewriteEngine On',
		'RewriteRule ^' . $rel . '/' . $marker . '(/|$) - [F,L]',
		'RewriteCond %{REQUEST_FILENAME} -f',
		'RewriteCond %{REQUEST_FILENAME} ^(.+?/' . $rel . '/)(.+)$',
		'RewriteCond %1' . $marker . '/%2 -f',
		'RewriteRule ^' . $rel . '/ ' . $env['home_path'] . 'index.php?lw_member_file=1 [L,QSA]',
		'</IfModule>',
	];
}

/** .htaccess の場所（WordPress のルールを置くフォルダ） */
function lw_member_files_htaccess_path() {
	if ( ! function_exists( 'get_home_path' ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
	}
	return get_home_path() . '.htaccess';
}

/**
 * ルールを書く（WordPress のルールの直前。無ければ最後）
 *
 * @return true|WP_Error
 */
function lw_member_files_write_htaccess() {
	$env = lw_member_files_env();
	if ( $env['error'] !== '' ) {
		return new WP_Error( $env['error'] );
	}
	if ( ! function_exists( 'insert_with_markers' ) ) {
		require_once ABSPATH . 'wp-admin/includes/misc.php';
	}

	$path = lw_member_files_htaccess_path();

	// ルールは相対パスで書くので、uploads が「サイトのフォルダ ＋ URL と同じ位置」にあること
	$expected = untrailingslashit( wp_normalize_path( get_home_path() ) ) . '/' . $env['uploads_rel'];
	$real_a   = realpath( $expected );
	$real_b   = realpath( $env['basedir'] );
	if ( $expected !== $env['basedir'] && ( ! $real_a || $real_a !== $real_b ) ) {
		return new WP_Error( 'unusual_path' );
	}

	if ( file_exists( $path ) ? ! is_writable( $path ) : ! is_writable( dirname( $path ) ) ) {
		return new WP_Error( 'htaccess_not_writable' );
	}

	// 囲みを1つにそろえて（重複していたら消して）から、中身を insert_with_markers() に書かせる
	$placed = lw_member_files_htaccess_edit( $path, function ( $content ) {
		return lw_member_files_htaccess_place( lw_member_files_htaccess_strip( $content ) );
	} );
	if ( ! $placed || ! insert_with_markers( $path, lw_member_files_htaccess_marker(), lw_member_files_htaccess_lines() ) ) {
		return new WP_Error( 'htaccess_not_writable' );
	}
	return true;
}

/**
 * ルールを消す（このテーマが書いた囲みの中だけ。囲みの行と直後の空行1つも消す）
 *
 * @return true|WP_Error
 */
function lw_member_files_remove_htaccess() {
	$path = lw_member_files_htaccess_path();
	if ( ! is_file( $path ) || strpos( (string) file_get_contents( $path ), '# BEGIN ' . lw_member_files_htaccess_marker() ) === false ) {
		return true;
	}
	if ( ! is_writable( $path ) || ! lw_member_files_htaccess_edit( $path, 'lw_member_files_htaccess_strip' ) ) {
		return new WP_Error( 'htaccess_not_writable' );
	}
	return true;
}

/**
 * .htaccess に、いまの版のルールが1つだけ入っているか
 *
 * @return bool
 */
function lw_member_files_htaccess_is_current() {
	if ( ! function_exists( 'extract_from_markers' ) ) {
		require_once ABSPATH . 'wp-admin/includes/misc.php';
	}
	$path = lw_member_files_htaccess_path();
	if ( ! is_readable( $path ) || substr_count( (string) file_get_contents( $path ), '# BEGIN ' . lw_member_files_htaccess_marker() ) !== 1 ) {
		return false;
	}

	$existing = array_map( 'rtrim', extract_from_markers( $path, lw_member_files_htaccess_marker() ) );
	$rules    = array_values( array_filter( lw_member_files_htaccess_lines(), function ( $line ) {
		return $line[0] !== '#';
	} ) );
	return array_values( array_intersect( $existing, $rules ) ) === $rules;
}
