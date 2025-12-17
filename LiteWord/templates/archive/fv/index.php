<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * デフォルト（カスタマイザーで指定）を取得
 * 未設定なら ptn_1
 */
$ptn = Lw_theme_mod_set( 'archive_page_layout_fv_ptn_df', 'ptn_1' );

/**
 * カテゴリーアーカイブページの場合だけ
 * タームメタ category_archive_fv_ptn が空でなければ上書き
 */
if ( is_category() ) {
	$term = get_queried_object();               // 今表示しているカテゴリー
	if ( $term && ! is_wp_error( $term ) ) {
		$term_ptn = get_term_meta( $term->term_id, 'category_archive_fv_ptn', true );
		if ( ! empty( $term_ptn ) ) {
			$ptn = sanitize_key( $term_ptn );    // 念のためサニタイズ
		}
	}
}

// 取得したパターンでテンプレート呼び出し
get_template_part( "templates/archive/fv/{$ptn}/index" );
