<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― サイトの設定で使っている画像（公開の場所）
 *
 * どれも管理者が決めるもので、公開ページに出る。
 * =============================================================== */

/** サイトの設定を公開の場所として数えるときに見る LiteWord のオプション（OGP の既定画像・トップの OGP 画像） */
function lw_member_files_public_option_names() {
	return [ 'lw_og_default_image', 'lw_front_og_image', 'site_icon' ];
}

/** テーマの設定・OGP の既定画像・サイトアイコン・カテゴリーの画像・ウィジェット */
function lw_member_files_public_in_settings( array $lookup, array &$found ) {
	global $wpdb;

	$mods = get_theme_mods();
	if ( is_array( $mods ) ) {
		$refs = lw_member_files_refs_from_text( maybe_serialize( $mods ) );
		if ( ! empty( $mods['custom_logo'] ) ) {
			$refs['ids'][ (int) $mods['custom_logo'] ] = true;
		}
		$header = isset( $mods['header_image_data'] ) ? (array) $mods['header_image_data'] : [];
		if ( ! empty( $header['attachment_id'] ) ) {
			$refs['ids'][ (int) $header['attachment_id'] ] = true;
		}
		lw_member_files_mark_public( $lookup, $refs, 'theme_mod', $found );
	}

	foreach ( lw_member_files_public_option_names() as $name ) {
		$value = get_option( $name, '' );
		$refs  = lw_member_files_refs_from_text( is_string( $value ) ? $value : '' );
		if ( is_numeric( $value ) && (int) $value > 0 ) {
			$refs['ids'][ (int) $value ] = true;   // サイトアイコンはメディアの ID
		}
		lw_member_files_mark_public( $lookup, $refs, $name === 'site_icon' ? 'site_icon' : 'seo_setting', $found );
	}

	// カテゴリーの画像（category_thumbnail_id はメディアの ID、category_og_image などは URL）
	$word = esc_sql( $wpdb->esc_like( lw_member_files_uploads_word() ) );
	$rows = (array) $wpdb->get_results( "SELECT meta_key, meta_value FROM {$wpdb->termmeta} WHERE meta_key = 'category_thumbnail_id' OR meta_value LIKE '%{$word}%'" );
	lw_member_files_db_check();
	foreach ( $rows as $row ) {
		$refs = lw_member_files_refs_from_text( $row->meta_value );
		if ( $row->meta_key === 'category_thumbnail_id' && (int) $row->meta_value > 0 ) {
			$refs['ids'][ (int) $row->meta_value ] = true;
		}
		lw_member_files_mark_public( $lookup, $refs, 'category', $found );
	}

	// ウィジェット（画像ウィジェットの attachment_id・マイパーツ呼び出しの parts_id を含む）
	$widgets = (array) $wpdb->get_col( "SELECT option_value FROM {$wpdb->options} WHERE option_name LIKE 'widget\\_%'" );
	lw_member_files_db_check();
	foreach ( $widgets as $value ) {
		$refs = lw_member_files_refs_from_text( $value );
		if ( preg_match_all( '~"attachment_id";i:(\d+);~', $value, $hits ) ) {
			foreach ( $hits[1] as $id ) {
				$refs['ids'][ (int) $id ] = true;
			}
		}
		lw_member_files_mark_public( $lookup, $refs, 'widget', $found );
	}
}
