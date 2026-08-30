<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/* ====================================================================
 * 旧 URL → 新 URL へ 301 リダイレクト
 *   ├─ 投稿・固定ページ : postmeta  → seo_301_redirect_url
 *   └─ カテゴリー　　　: termmeta → category_redirect_from_url
 *      ※ meta_value は「,」区切りで複数 URL を登録可能
 * ================================================================= */

/* WordPress 標準の「404 → 似た slug への推測リダイレクト」を無効化。
 *   例: /overnotes/post-2 でアクセス → post-25 が近いslugとして推測され
 *       /overnotes/post-25/ へ勝手にリダイレクトされる問題を防ぐ。
 *   末尾スラッシュ・https・www の正規化リダイレクトは維持される（WP 5.9+）。 */
add_filter( 'do_redirect_guess_404_permalink', '__return_false' );

/* --------------------------------------------------------------------
 * 逆引きの索引（キャッシュ）
 * --------------------------------------------------------------------
 * この処理は template_redirect の優先度 0＝**全ページ・全リクエスト**で走る。
 * 以前は毎回 LOWER(meta_value) LIKE '%…%' を2本投げていたが、
 * 先頭ワイルドカードの LIKE はインデックスが効かず postmeta の全表走査になる。
 * 旧URLの登録は多くのサイトで0件なので、索引を1度だけ作って autoload の
 * オプションに置き、当たったときだけ本処理に入る（通常はクエリ0本）。
 *
 * 🚨 postmeta / termmeta の該当キーを書き換えたら索引を捨てること。
 *    下の lw_301_flush_map_on_meta() が6つのフックで自動的に捨てるが、
 *    直接 SQL で書き換えた場合はフックが鳴らない。その保険として TTL を置いてある。
 * ------------------------------------------------------------------ */
define( 'LW_301_MAP_OPTION', 'lw_301_url_map' );
define( 'LW_301_MAP_TTL', 12 * HOUR_IN_SECONDS ); // 取りこぼしの保険（この間隔で作り直す）
define( 'LW_301_MAP_MAX', 2000 );                 // これを超える登録がある場合は索引を作らない

/**
 * URL を比較用に正規化する（末尾スラッシュ除去・スキーム除去・小文字化）
 */
function lw_301_normalize_url( $url ) {
	$url = untrailingslashit( trim( (string) $url ) );
	$url = preg_replace( '#^https?:\/\/#i', '', $url );
	return strtolower( $url );
}

/**
 * 索引を作る
 *
 * @return array|null 正規化した旧URL => [ ['p', post_id], ['t', term_id], ... ]
 *                    登録が多すぎる場合は null（＝索引を使わず従来の LIKE で引く）
 */
function lw_301_build_map() {
	global $wpdb;

	$map   = array();
	$count = 0;

	/* 投稿・固定ページを先に入れる（従来の処理順＝投稿が優先） */
	$post_rows = $wpdb->get_results( $wpdb->prepare(
		"SELECT post_id, meta_value
		   FROM {$wpdb->postmeta}
		  WHERE meta_key = %s
		  ORDER BY meta_id ASC",
		'seo_301_redirect_url'
	) );

	foreach ( $post_rows as $row ) {
		foreach ( explode( ',', (string) $row->meta_value ) as $url ) {
			$key = lw_301_normalize_url( $url );
			if ( $key === '' ) {
				continue;
			}
			if ( ++$count > LW_301_MAP_MAX ) {
				return null;
			}
			$map[ $key ][] = array( 'p', (int) $row->post_id );
		}
	}

	/* カテゴリー */
	$term_rows = $wpdb->get_results( $wpdb->prepare(
		"SELECT term_id, meta_value
		   FROM {$wpdb->termmeta}
		  WHERE meta_key = %s
		  ORDER BY meta_id ASC",
		'category_redirect_from_url'
	) );

	foreach ( $term_rows as $row ) {
		foreach ( explode( ',', (string) $row->meta_value ) as $url ) {
			$key = lw_301_normalize_url( $url );
			if ( $key === '' ) {
				continue;
			}
			if ( ++$count > LW_301_MAP_MAX ) {
				return null;
			}
			$map[ $key ][] = array( 't', (int) $row->term_id );
		}
	}

	return $map;
}

/**
 * 索引を取り出す（無ければ作って保存する）
 *
 * @return array|null 索引。null は「登録が多すぎるので従来の LIKE で引く」の意味
 */
function lw_301_get_map() {
	static $memo    = null;
	static $fetched = false;

	if ( $fetched ) {
		return $memo;
	}

	$stored = get_option( LW_301_MAP_OPTION );
	if ( is_array( $stored )
		&& array_key_exists( 'map', $stored )
		&& isset( $stored['built'] )
		&& ( time() - (int) $stored['built'] ) < LW_301_MAP_TTL
	) {
		$memo    = $stored['map'];
		$fetched = true;
		return $memo;
	}

	$map = lw_301_build_map();
	update_option( LW_301_MAP_OPTION, array( 'built' => time(), 'map' => $map ), true );

	$memo    = $map;
	$fetched = true;
	return $memo;
}

/**
 * 索引を捨てる
 */
function lw_301_flush_map() {
	delete_option( LW_301_MAP_OPTION );
}

/**
 * 該当するメタキーが書き換わったら索引を捨てる
 */
function lw_301_flush_map_on_meta( $meta_id, $object_id, $meta_key, $meta_value = null ) {
	if ( 'seo_301_redirect_url' === $meta_key || 'category_redirect_from_url' === $meta_key ) {
		lw_301_flush_map();
	}
}
foreach ( array(
	'added_post_meta', 'updated_post_meta', 'deleted_post_meta',
	'added_term_meta', 'updated_term_meta', 'deleted_term_meta',
) as $lw_301_hook ) {
	add_action( $lw_301_hook, 'lw_301_flush_map_on_meta', 10, 4 );
}
unset( $lw_301_hook );

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
	$needle      = lw_301_normalize_url( $request_url );

	/* ------------------------------------------------------------
	 * 2) 索引で引く（通常はここでクエリ0本のまま終わる）
	 * ---------------------------------------------------------- */
	$map = lw_301_get_map();

	if ( is_array( $map ) ) {
		if ( empty( $map[ $needle ] ) ) {
			return; // 登録なし → 通常表示（または通常の404）
		}

		foreach ( $map[ $needle ] as $hit ) {
			if ( 'p' === $hit[0] ) {
				$target = get_permalink( $hit[1] );
				if ( ! $target ) {
					continue;
				}
			} else {
				$target = get_term_link( $hit[1], 'category' );
				if ( is_wp_error( $target ) || ! $target ) {
					continue;
				}
			}

			/* 無限ループ防止 */
			if ( lw_301_normalize_url( $target ) !== $needle ) {
				wp_redirect( esc_url_raw( $target ), 301 );
				exit;
			}
		}

		return;
	}

	/* ================================================================
	 * 3) 登録が LW_301_MAP_MAX を超えるサイトは従来どおり LIKE で引く
	 * ============================================================== */
	global $wpdb;

	$like = '%' . $wpdb->esc_like( $needle ) . '%';

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
			if ( lw_301_normalize_url( $url ) === $needle ) {
				$target = get_permalink( $row->post_id );

				/* 無限ループ防止 */
				if ( $target && lw_301_normalize_url( $target ) !== $needle ) {
					wp_redirect( esc_url_raw( $target ), 301 );
					exit;
				}
			}
		}
	}

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
			if ( lw_301_normalize_url( $url ) === $needle ) {
				$target = get_term_link( (int) $row->term_id, 'category' );

				if ( is_wp_error( $target ) ) {
					continue;
				}

				/* 無限ループ防止 */
				if ( lw_301_normalize_url( $target ) !== $needle ) {
					wp_redirect( esc_url_raw( $target ), 301 );
					exit;
				}
			}
		}
	}

	/* 投稿にもカテゴリーにもマッチしなければ通常 404 */
}
