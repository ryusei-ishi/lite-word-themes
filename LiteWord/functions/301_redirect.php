<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/* ====================================================================
 * 旧 URL → 新 URL へ 301 リダイレクト
 *   ├─ 投稿・固定ページ : postmeta  → seo_301_redirect_url
 *   └─ カテゴリー　　　: termmeta → category_redirect_from_url
 *      ※ meta_value は「,」区切りで複数 URL を登録可能
 * ================================================================= */
add_action( 'template_redirect', 'lw_reverse_lookup_301_redirect', 0 );
function lw_reverse_lookup_301_redirect() {

	/* ▼ 除外：管理画面・AJAX・Cron・プレビュー --------------------- */
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || isset( $_GET['preview'] ) ) {
		return;
	}

	/* ------------------------------------------------------------
	 * 1) 今アクセスされた URL を正規化
	 * ---------------------------------------------------------- */
	$request_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

	$normalize = function ( $url ) {
		$url = untrailingslashit( $url );                          // 末尾スラッシュ除去
		$url = preg_replace( '#^https?:\/\/#i', '', $url );       // スキーム除去
		return strtolower( $url );
	};

	$needle = $normalize( $request_url );                         // 検索キー（正規化済み）
	$like   = '%' . $GLOBALS['wpdb']->esc_like( $needle ) . '%';  // LIKE 句用

	/* ------------------------------------------------------------
	 * 2-A) 投稿 / 固定ページ側の逆引き
	 * ---------------------------------------------------------- */
	global $wpdb;

	$post_rows = $wpdb->get_results( $wpdb->prepare(
		"SELECT post_id, meta_value
		   FROM {$wpdb->postmeta}
		  WHERE meta_key   = %s
		    AND LOWER(meta_value) LIKE %s",
		'seo_301_redirect_url',
		$like
	) );

	foreach ( $post_rows as $row ) {
		foreach ( explode( ',', $row->meta_value ) as $url ) {
			if ( $normalize( trim( $url ) ) === $needle ) {
				$target = get_permalink( $row->post_id );

				/* 無限ループ防止 */
				if ( $target && $normalize( $target ) !== $needle ) {
					wp_redirect( esc_url_raw( $target ), 301 );
					exit;
				}
			}
		}
	}

	/* ------------------------------------------------------------
	 * 2-B) カテゴリー側の逆引き（投稿でヒットしなかった場合）
	 * ---------------------------------------------------------- */
	$term_rows = $wpdb->get_results( $wpdb->prepare(
		"SELECT term_id, meta_value
		   FROM {$wpdb->termmeta}
		  WHERE meta_key   = %s
		    AND LOWER(meta_value) LIKE %s",
		'category_redirect_from_url',
		$like
	) );

	foreach ( $term_rows as $row ) {
		foreach ( explode( ',', $row->meta_value ) as $url ) {
			if ( $normalize( trim( $url ) ) === $needle ) {
				$target = get_term_link( (int) $row->term_id, 'category' );

				if ( is_wp_error( $target ) ) {
					continue;
				}

				/* 無限ループ防止 */
				if ( $normalize( $target ) !== $needle ) {
					wp_redirect( esc_url_raw( $target ), 301 );
					exit;
				}
			}
		}
	}

	/* 投稿にもカテゴリーにもマッチしなければ通常 404 */
}
