<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* カスタマイザー側のデフォルト（未設定時は ptn_1） */
$ptn = Lw_theme_mod_set( 'archive_page_layout_post_list_ptn_df', 'ptn_1' );

/* カテゴリーアーカイブの場合のみタームメタを優先 */
if ( is_category() ) {
	$term = get_queried_object();            // 表示中のカテゴリー
	if ( $term && ! is_wp_error( $term ) ) {
		$term_ptn = get_term_meta( $term->term_id, 'category_archive_list_ptn', true );
		if ( ! empty( $term_ptn ) ) {
			$ptn = sanitize_key( $term_ptn ); // 念のためサニタイズ
		}
	}
}

/* パターン別テンプレートを呼び出し */
get_template_part( "templates/archive/post_list/{$ptn}/index" );
