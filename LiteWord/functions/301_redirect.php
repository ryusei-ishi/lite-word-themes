<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/* ====================================================================
 * 旧 URL → 新 URL へ 301 リダイレクト
 *   ├─ 投稿・固定ページ : postmeta  → seo_301_redirect_url
 *   └─ カテゴリー　　　: termmeta → category_redirect_from_url
 *      ※ meta_value は「,」区切りで複数 URL を登録可能
 *      ※ https:// から始まる URL でも、/old-page のようなパスだけでも登録できる
 *        （パスだけ＝ドメインのあとに続く部分。どのドメインで来ても当たる）
 *
 * 照合の順番（2026-10-14〜）
 *   ① ? 以降まで含めて一致する登録（今までどおり。転送先に ? 以降は付けない）
 *   ② ? の前だけで一致する登録（転送先に ? 以降を引き継ぐ）
 *      例: /old.html?gclid=xxx → /new/?gclid=xxx
 *      ②に当たるのは ? 無しで登録した旧URLだけ。? 込みで登録した旧URLは①でしか当たらない。
 *      トップに ? が付いたアクセス（?s= の検索・?p= の短縮URL・フィードなど）は②で引かない。
 *      引き継ぐ ? 以降からは、WordPress が意味を持たせる値（?p= ?s= ?page_id= など）を外す。
 *   ①②それぞれ「ドメイン＋パス」→「パスだけ」の順に引く。
 *   2026-10-13 までの形（ドメイン＋今のURLそのまま）以外で当たったときは、
 *   WordPress がそのアクセスを 404 にしたときだけ転送する（今ある公開ページを奪わない）。
 *   広告や検索から来るアクセスには ?gclid= などが付くことがあり、
 *   以前は ? 込みのまま比べていたため、登録した旧URLでも 404 になっていた。
 * ================================================================= */

/* WordPress 標準の「404 → 似た slug への推測リダイレクト」を無効化。
 *   例: /news/post-2 でアクセス → post-25 が近いslugとして推測され
 *       /news/post-25/ へ勝手にリダイレクトされる問題を防ぐ。
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
 *
 * 🚨 この形を変えると、保存済みの索引（lw_301_url_map）のキーと合わなくなる。
 *    変えるときは LW_301_MAP_OPTION の名前も変えて、索引を作り直させること。
 *    リンク切れ診断の lw_site_rule_normalize_url()（r15-redirect.php）は、
 *    この関数があればこれを呼び、無いときだけ同じ形の写しを使う。写しも一緒に直すこと。
 */
function lw_301_normalize_url( $url ) {
	$url = untrailingslashit( trim( (string) $url ) );
	$url = preg_replace( '#^https?:\/\/#i', '', $url );
	return strtolower( $url );
}

/**
 * 索引を作る
 *
 * @param string[] $like_patterns 空なら全件で作る（保存する索引用）。
 *                                指定すると LIKE で当たった行だけで作る
 *                                （登録が LW_301_MAP_MAX を超えるサイトで、そのアクセスの分だけ引く用）
 * @return array|null 正規化した旧URL => [ ['p', post_id], ['t', term_id], ... ]
 *                    全件で作るときに登録が多すぎる場合は null（＝索引を使わず LIKE で引く）
 */
function lw_301_build_map( $like_patterns = array() ) {
	global $wpdb;

	$map   = array();
	$count = 0;

	/* 投稿・固定ページを先に入れる → カテゴリー
	 * （同じ旧URLが両方に登録されていたら投稿が優先＝従来の処理順。候補の順はこれより先に効く） */
	$sources = array(
		array( 'p', $wpdb->postmeta, 'post_id', 'seo_301_redirect_url' ),
		array( 't', $wpdb->termmeta, 'term_id', 'category_redirect_from_url' ),
	);

	foreach ( $sources as $source ) {
		list( $type, $table, $id_column, $meta_key ) = $source;

		$sql  = "SELECT {$id_column} AS object_id, meta_value FROM {$table} WHERE meta_key = %s";
		$args = array( $meta_key );

		if ( $like_patterns ) {
			$sql .= ' AND ( ' . implode( ' OR ', array_fill( 0, count( $like_patterns ), 'LOWER(meta_value) LIKE %s' ) ) . ' )';
			$args = array_merge( $args, $like_patterns );
		}

		$rows = $wpdb->get_results( $wpdb->prepare( $sql . ' ORDER BY meta_id ASC', $args ) );

		foreach ( $rows as $row ) {
			foreach ( explode( ',', (string) $row->meta_value ) as $url ) {
				$key = lw_301_normalize_url( $url );
				if ( $key === '' ) {
					continue;
				}
				if ( ! $like_patterns && ++$count > LW_301_MAP_MAX ) {
					return null;
				}
				$map[ $key ][] = array( $type, (int) $row->object_id );
			}
		}
	}

	return $map;
}

/**
 * 索引を取り出す（無ければ作って保存する）
 *
 * @return array|null 索引。null は「登録が多すぎるので LIKE で引く」の意味
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

/* --------------------------------------------------------------------
 * 照合
 * --------------------------------------------------------------------
 * リンク切れ診断（lw_broken_link_check/rules/r15-redirect.php）も
 * lw_301_request_candidates() を使って同じ順で引く。照合を変えるときは両方を見ること。
 * ------------------------------------------------------------------ */

/**
 * 今のアクセスから、旧URLと比べる候補を優先順に作る
 *
 * @param string $host        アクセスされたホスト名（HTTP_HOST）
 * @param string $request_uri アクセスされたパス（REQUEST_URI・? 以降を含む）
 * @param string $home_path   サイトのトップのパス（home_url( '/' ) のパス。サブディレクトリに入れたサイトは /blog/ など）
 * @return array[] 各要素 array(
 *                   'key'       => 比べる文字列（正規化済み）,
 *                   'query'     => 転送先に付ける ? 以降（付けないときは空）,
 *                   'self'      => 無限ループ防止で比べる今のURL（正規化済み。②では ? の前まで）,
 *                   'path_form' => true ならパスだけの形（self もパスだけ。転送先もドメインを外して比べる）,
 *                   'only_404'  => true なら、WordPress が 404 にしたアクセスでだけ使う
 *                                  （2026-10-13 までの形＝ドメイン＋今のURLそのまま、以外の候補）,
 *                 )
 */
function lw_301_request_candidates( $host, $request_uri, $home_path = '/' ) {
	$host        = (string) $host;
	$request_uri = (string) $request_uri;

	$q_pos = strpos( $request_uri, '?' );
	$path  = ( false === $q_pos ) ? $request_uri : substr( $request_uri, 0, $q_pos );
	$query = ( false === $q_pos ) ? '' : substr( $request_uri, $q_pos + 1 );

	$self_full = lw_301_normalize_url( $host . $request_uri );
	$self_path = lw_301_normalize_url( $host . $path );

	$forms = array();

	/* ① ? 以降まで含めて一致（今までどおり。? 以降は引き継がない） */
	if ( false !== $q_pos ) {
		$forms[] = array( 'url' => $host . $request_uri, 'query' => '', 'self' => $self_full, 'path_form' => false );
		$forms[] = array( 'url' => $request_uri, 'query' => '', 'self' => lw_301_normalize_url( $request_uri ), 'path_form' => true );
	}

	/* ② ? の前だけで一致（? 以降を転送先に引き継ぐ）
	 *   トップに ? が付いたアクセスは引かない。?s= の検索・?p= の短縮URL・フィード・
	 *   カスタマイザーのプレビューなど WordPress 本体の機能がトップの ? を使うため、
	 *   トップを旧URLに登録したサイトで、それらまで転送しないようにする（2026-10-13 までと同じ動き） */
	$is_home_with_query = ( false !== $q_pos )
		&& lw_301_normalize_url( $path ) === lw_301_normalize_url( $home_path );

	if ( ! $is_home_with_query ) {
		$forms[] = array( 'url' => $host . $path, 'query' => $query, 'self' => $self_path, 'path_form' => false );
		$forms[] = array( 'url' => $path, 'query' => $query, 'self' => lw_301_normalize_url( $path ), 'path_form' => true );
	}

	$candidates = array();
	foreach ( $forms as $form ) {
		$key = lw_301_normalize_url( $form['url'] );
		if ( '' === $key || isset( $candidates[ $key ] ) ) {
			continue;
		}
		$candidates[ $key ] = array(
			'key'       => $key,
			'query'     => $form['query'],
			'self'      => $form['self'],
			'path_form' => $form['path_form'],
			'only_404'  => ( $key !== $self_full ),
		);
	}

	return array_values( $candidates );
}

/**
 * 候補を LIKE の条件にする（登録が LW_301_MAP_MAX を超えるサイト用）
 *   正規化は前後の空白・先頭のスキーム・末尾のスラッシュを落として小文字にするだけなので、
 *   候補は「登録された元の文字列を小文字にしたもの」の中に必ずそのまま含まれる
 *
 * @param array[] $candidates lw_301_request_candidates() の戻り値
 * @return string[]
 */
function lw_301_like_patterns( $candidates ) {
	global $wpdb;

	$patterns = array();
	foreach ( $candidates as $candidate ) {
		$patterns[] = '%' . $wpdb->esc_like( $candidate['key'] ) . '%';
	}
	return $patterns;
}

/**
 * 索引の1件（['p', post_id] / ['t', term_id]）を、今の URL にする
 *
 * @param array $hit array( 'p' か 't', ID )
 * @return string URL。引けなければ空文字
 */
function lw_301_hit_url( $hit ) {
	if ( 'p' === $hit[0] ) {
		$url = get_permalink( $hit[1] );
	} else {
		$url = get_term_link( $hit[1], 'category' );
		if ( is_wp_error( $url ) ) {
			return '';
		}
	}
	return $url ? (string) $url : '';
}

/**
 * URL の後ろに ? 以降を付け足す（URL がもともと ? を持っていれば & でつなぐ）
 *
 * @param string $url   転送先の URL
 * @param string $query 付け足す ? 以降（? は含めない。空なら何もしない）
 * @return string
 */
function lw_301_append_query( $url, $query ) {
	if ( '' === $query ) {
		return $url;
	}

	/* wp_redirect() が消してしまう文字（{ } | ^ ' $ \ や空白など）は、先に %XX にして中身を変えずに渡す */
	$query = preg_replace_callback(
		'/[^A-Za-z0-9\-~+_.?=&;,\/:%!*\[\]()@]/',
		function ( $m ) {
			return rawurlencode( $m[0] );
		},
		$query
	);

	return $url . ( false === strpos( $url, '?' ) ? '?' : '&' ) . $query;
}

/**
 * 転送先に引き継ぐ ? 以降から、WordPress が意味を持たせる値（?p= ?s= ?page_id= など）を外す
 *   旧サイトの ?p=12（商品番号など）を引き継ぐと、転送先で WordPress が投稿ID 12 を出してしまうため。
 *   広告・計測の値（gclid・utm_* など）は、元の書き方のまま残る。
 *
 * @param string   $query    ? 以降（? は含めない）
 * @param string[] $reserved 外す名前（WordPress の公開クエリ変数 $wp->public_query_vars）
 * @return string
 */
function lw_301_filter_query( $query, $reserved ) {
	if ( '' === $query || ! $reserved ) {
		return $query;
	}

	$keep = array();
	foreach ( explode( '&', $query ) as $pair ) {
		if ( '' === $pair ) {
			continue;
		}
		/* 名前は PHP が $_GET を作るときと同じ読み方で取る
		 * （page.id → page_id、a[]=1 → a、先頭の空白や閉じない [ も PHP と同じに読む） */
		$parsed = array();
		parse_str( $pair, $parsed );
		if ( array_intersect( array_map( 'strval', array_keys( $parsed ) ), $reserved ) ) {
			continue;
		}
		$keep[] = $pair;
	}

	return implode( '&', $keep );
}

/**
 * URL からスキームとドメインを外して、パス（と ? 以降）だけにする
 *
 * @param string $url URL
 * @return string 例: https://example.com/new/?a=1 → /new/?a=1
 */
function lw_301_url_path( $url ) {
	$path = preg_replace( '#^(?:[a-z][a-z0-9+.\-]*:)?//[^/?\#]*#i', '', (string) $url );
	return ( '' === $path ) ? '/' : $path;
}

/**
 * 候補を優先順に索引で引き、転送先の URL を返す
 *
 * @param array    $map        lw_301_build_map() の形の索引
 * @param array[]  $candidates lw_301_request_candidates() の戻り値
 * @param string[] $reserved   引き継ぐ ? 以降から外す名前（lw_301_filter_query() を参照）
 * @return string 転送先の URL。転送しないときは空文字
 */
function lw_301_find_location( $map, $candidates, $reserved = array() ) {
	foreach ( $candidates as $candidate ) {
		if ( empty( $map[ $candidate['key'] ] ) ) {
			continue;
		}

		$query = lw_301_filter_query( $candidate['query'], $reserved );

		foreach ( $map[ $candidate['key'] ] as $hit ) {
			$target = lw_301_hit_url( $hit );
			if ( '' === $target ) {
				continue;
			}

			/* 無限ループ防止（今いる場所へは転送しない）
			 *   パスだけの形は、転送先もドメインを外して比べる（Host がサイトのドメインと違う環境でも止まるように）。
			 *   ? 以降を引き継ぐときは、転送先の ? の前だけで比べる。
			 *   転送先が ?page_id=12 のような URL でも、同じ場所へ ? を足しながら
			 *   転送し続けないようにするため */
			$compare = $candidate['path_form'] ? lw_301_url_path( $target ) : $target;
			$t_pos   = strpos( $compare, '?' );
			if ( '' !== $query && false !== $t_pos ) {
				$compare = substr( $compare, 0, $t_pos );
			}
			if ( lw_301_normalize_url( $compare ) === $candidate['self'] ) {
				continue;
			}

			return lw_301_append_query( $target, $query );
		}
	}

	return '';
}

add_action( 'template_redirect', 'lw_reverse_lookup_301_redirect', 0 );
function lw_reverse_lookup_301_redirect() {

	/* ▼ 除外：管理画面・AJAX・Cron・プレビュー --------------------- */
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || isset( $_GET['preview'] ) ) {
		return;
	}

	/* ------------------------------------------------------------
	 * 1) 今アクセスされた URL から、照合の候補を作る
	 * ---------------------------------------------------------- */
	$host        = isset( $_SERVER['HTTP_HOST'] ) ? (string) $_SERVER['HTTP_HOST'] : '';
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
	$home_path   = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	$candidates  = lw_301_request_candidates( $host, $request_uri, $home_path );

	/* ? の前だけ・パスだけの形は、WordPress が 404 にしたアクセスでだけ使う。
	 *   旧URLはふつう 404 になるので、それで足りる。今ある公開ページを、
	 *   パスだけで登録した（前は効いていなかった）旧URLが奪わないようにする */
	if ( ! is_404() ) {
		foreach ( $candidates as $i => $candidate ) {
			if ( $candidate['only_404'] ) {
				unset( $candidates[ $i ] );
			}
		}
	}
	if ( ! $candidates ) {
		return; // 引くものが無い（Host も無いトップへのアクセスなど。LIKE の道で全件を読まないため）
	}

	/* ------------------------------------------------------------
	 * 2) 索引で引く（通常はここでクエリ0本のまま終わる）
	 *    登録が LW_301_MAP_MAX を超えるサイトは、候補で LIKE を引いて
	 *    そのアクセスの分だけの小さな索引をその場で作る
	 * ---------------------------------------------------------- */
	$map = lw_301_get_map();
	if ( ! is_array( $map ) ) {
		$map = lw_301_build_map( lw_301_like_patterns( $candidates ) );
	}

	global $wp;
	$reserved = ( isset( $wp->public_query_vars ) && is_array( $wp->public_query_vars ) ) ? $wp->public_query_vars : array();

	$location = lw_301_find_location( $map, $candidates, $reserved );
	if ( '' !== $location ) {
		/* 404 のアクセスからの転送は、CDN やブラウザに貯めさせない（? 以降を引き継いだ 301 が他の人に配られないように）。
		 *   WordPress は handle_404() で no-cache を付けるが、?p=-1 のように WP_Query が自分で 404 にした形では付かない */
		if ( is_404() ) {
			nocache_headers();
		}
		wp_redirect( esc_url_raw( $location ), 301 );
		exit;
	}

	/* 投稿にもカテゴリーにもマッチしなければ通常表示（または通常の404） */
}
