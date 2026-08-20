<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定表示機能：閲覧権限の取得・判定
 *              （管理画面／フロントの両方から使う）
 *
 * 設定は2か所にある。
 *   ① 投稿・固定ページ … post meta `_lw_allowed_roles`（restrict_admin.php）
 *   ② カテゴリー       … term meta `_lw_allowed_roles`（restrict_category.php）
 *
 * 🚨 投稿側に設定があれば、そちらを優先する（カテゴリーの設定は見ない）。
 *    投稿側が空のときだけカテゴリー側を使う。
 *
 * 🚨 さらに「この記事だけ誰でも見せたい」ための例外がある。
 *    投稿メタ `_lw_ignore_category_roles` が '1' なら、カテゴリーが会員限定でも
 *    その投稿は全員閲覧可になる（いちばん強い設定）。
 * =============================================================== */

/**
 * ロールキーの配列に整える（空文字・重複を落とす）
 *
 * @param mixed $roles get_post_meta / get_term_meta の戻り値（配列 or 空文字）
 * @return array
 */
function lw_normalize_allowed_roles( $roles ) {
	return array_values( array_unique( array_filter( (array) $roles, 'strlen' ) ) );
}

/**
 * 投稿・固定ページに直接設定された閲覧権限
 *
 * @param int $post_id
 * @return array
 */
function lw_get_post_allowed_roles( $post_id ) {
	return lw_normalize_allowed_roles( get_post_meta( $post_id, '_lw_allowed_roles', true ) );
}

/**
 * カテゴリー（ターム）に設定された閲覧権限
 *
 * @param int $term_id
 * @return array
 */
function lw_get_term_allowed_roles( $term_id ) {
	return lw_normalize_allowed_roles( get_term_meta( $term_id, '_lw_allowed_roles', true ) );
}

/**
 * カテゴリーの制限をどこに効かせるか
 *
 *   'both'    … そのカテゴリーの投稿とカテゴリー一覧ページの両方（既定）
 *   'single'  … 投稿だけ（カテゴリー一覧は誰でも見られる）
 *   'archive' … カテゴリー一覧だけ（投稿は誰でも見られる）
 *
 * @param int $term_id
 * @return string
 */
function lw_get_term_restrict_scope( $term_id ) {
	$scope = (string) get_term_meta( $term_id, '_lw_restrict_scope', true );
	return in_array( $scope, [ 'both', 'single', 'archive' ], true ) ? $scope : 'both';
}

/**
 * 適用範囲を踏まえたカテゴリーの閲覧権限
 *
 * @param int    $term_id
 * @param string $target 'single'＝投稿を開いたとき / 'archive'＝カテゴリー一覧を開いたとき
 * @return array 対象外なら空配列（＝制限しない）
 */
function lw_get_term_allowed_roles_for( $term_id, $target ) {

	$scope = lw_get_term_restrict_scope( $term_id );
	if ( $scope !== 'both' && $scope !== $target ) {
		return [];
	}

	return lw_get_term_allowed_roles( $term_id );
}


/* ---------------------------------------------------------------
 * カテゴリーの階層（親から子への継承）
 *
 * 🚨 2026-08-20 に修正。それまでは「親の設定は子に継承しない」作りだったため、
 *    親を会員限定にしても、子カテゴリーの一覧と、子だけに入れた投稿が
 *    未ログインで丸ごと読めていた（実機で確認）。
 *    WordPress は子カテゴリーに入れても親には自動で入らないので、
 *    階層で整理した人ほど中身が全部公開になるという逆転が起きていた。
 *
 * 決め方は3つ。term meta `_lw_role_mode` に持つ。
 *   'inherit' … 親の設定に従う（既定。メタを持たない状態がこれ）
 *   'public'  … 制限しない。親が会員限定でも、このカテゴリーは全員が見られる
 *   'custom'  … このカテゴリーで指定した権限だけ（`_lw_allowed_roles`）
 *
 * 探し方は「いちばん近い設定が勝つ」。自分から親へ順にたどり、
 * public か custom が見つかった時点で打ち止め。誰も設定していなければ制限なし。
 * ------------------------------------------------------------- */

/**
 * カテゴリーの閲覧権限の決め方
 *
 * ⚠️ 既存データ（`_lw_role_mode` を持たない）の扱い:
 *    権限が入っていれば custom、入っていなければ inherit とみなす。
 *    これにより、今まで制限をかけていたカテゴリーの挙動は変わらない。
 *
 * @param int $term_id
 * @return string inherit|public|custom
 */
function lw_get_term_role_mode( $term_id ) {

	$mode = (string) get_term_meta( $term_id, '_lw_role_mode', true );
	if ( in_array( $mode, [ 'inherit', 'public', 'custom' ], true ) ) {
		return $mode;
	}
	return lw_get_term_allowed_roles( $term_id ) ? 'custom' : 'inherit';
}

/**
 * 親をたどって実際に効く閲覧権限を求める
 *
 * @param int    $term_id
 * @param string $target 'single'（投稿）か 'archive'（カテゴリー一覧）
 * @return array 空配列なら制限なし
 */
function lw_get_effective_term_roles( $term_id, $target ) {

	$term_id = (int) $term_id;
	if ( $term_id <= 0 ) {
		return [];
	}

	$chain = array_merge( [ $term_id ], get_ancestors( $term_id, 'category' ) );

	foreach ( $chain as $id ) {
		$mode = lw_get_term_role_mode( $id );

		if ( $mode === 'public' ) {
			return [];   // ここで打ち止め。上の親が会員限定でも公開する
		}
		if ( $mode === 'custom' ) {
			// 適用範囲（投稿だけ／一覧だけ）を踏まえて返す。
			// 対象外なら空＝制限なし。ここで打ち止めにするのは
			// 「いちばん近い設定が勝つ」を分かりやすく保つため。
			return lw_get_term_allowed_roles_for( $id, $target );
		}
	}

	return [];   // 自分も親も誰も設定していない
}

/**
 * このカテゴリーが親から受け継いでいる設定（管理画面の表示用）
 *
 * @param int $term_id
 * @return array{term_id:int,roles:array}|null 継いでいる元が無ければ null
 */
function lw_get_inherited_term_setting( $term_id ) {

	foreach ( get_ancestors( (int) $term_id, 'category' ) as $id ) {
		$mode = lw_get_term_role_mode( $id );
		if ( $mode === 'public' ) {
			return [ 'term_id' => $id, 'roles' => [] ];
		}
		if ( $mode === 'custom' ) {
			return [ 'term_id' => $id, 'roles' => lw_get_term_allowed_roles( $id ) ];
		}
	}
	return null;
}

/**
 * 投稿が属するカテゴリー側の閲覧権限（複数カテゴリーなら和集合）
 *
 * 1つでも設定のあるカテゴリーに属していれば制限がかかる。
 * ⚠️ 親カテゴリーの設定も継承する（2026-08-20〜）。いちばん近い設定が勝つ。
 *    子で「制限しない」を選べば、親が会員限定でもそのカテゴリーは公開できる。
 * ⚠️ 適用範囲が「アーカイブだけ」のカテゴリーは、ここでは無視する。
 *
 * @param int $post_id
 * @return array
 */
function lw_get_category_allowed_roles_for_post( $post_id ) {

	$terms = get_the_terms( $post_id, 'category' );
	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return [];
	}

	$roles = [];
	foreach ( $terms as $term ) {
		$roles = array_merge( $roles, lw_get_effective_term_roles( $term->term_id, 'single' ) );
	}

	return lw_normalize_allowed_roles( $roles );
}

/**
 * この投稿は「カテゴリーの設定を無視して誰でも閲覧可」か
 *
 * カテゴリーを会員限定にしたうえで、その中の特定の記事だけ公開したいときに使う。
 *
 * @param int $post_id
 * @return bool
 */
function lw_post_ignores_category_roles( $post_id ) {
	return get_post_meta( $post_id, '_lw_ignore_category_roles', true ) === '1';
}

/**
 * この投稿・固定ページに適用される閲覧権限を決める
 *
 * 強い順に
 *   ① 「誰でも閲覧できるようにする」がON → 制限なし
 *   ② 投稿にチェックがある               → それを使う
 *   ③ どちらも無い                        → 所属カテゴリーの設定
 *
 * @param int $post_id
 * @return array 空配列なら制限なし
 */
function lw_get_allowed_roles_for_post( $post_id ) {

	$cache_key = 'lw_allowed_roles_' . $post_id . '_v' . lw_allowed_roles_cache_version();
	$cached    = wp_cache_get( $cache_key );
	if ( $cached !== false ) {
		return $cached;
	}

	if ( lw_post_ignores_category_roles( $post_id ) ) {
		$roles = [];   // ① いちばん強い。カテゴリーが会員限定でも公開する
	} else {
		// ② 投稿側が優先。空のときだけ ③ カテゴリー側を見る
		$roles = lw_get_post_allowed_roles( $post_id );
		if ( empty( $roles ) ) {
			$roles = lw_get_category_allowed_roles_for_post( $post_id );
		}
	}

	wp_cache_set( $cache_key, $roles, '', 3600 );
	return $roles;
}

/**
 * 今のユーザーがこの閲覧権限を満たすか
 *
 * @param array $allowed_roles 空配列なら誰でも閲覧可
 * @return string ''＝閲覧可 ／ 'login'＝未ログイン ／ 'denied'＝ログイン済みだが権限不足
 */
function lw_check_view_permission( array $allowed_roles ) {

	if ( empty( $allowed_roles ) ) {
		return '';
	}

	// 管理者は常に閲覧可
	if ( current_user_can( 'administrator' ) ) {
		return '';
	}

	if ( ! is_user_logged_in() ) {
		return 'login';
	}

	$user = wp_get_current_user();
	return array_intersect( $user->roles, $allowed_roles ) ? '' : 'denied';
}

/* ---------------------------------------------------------------
 * キャッシュのバージョン
 *
 * 🚨 lw_get_allowed_roles_for_post() は結果を wp_cache に1時間入れている。
 *    カテゴリー側の設定を変えても、そのカテゴリーに属する投稿のキャッシュキーは
 *    変わらないので、永続オブジェクトキャッシュ（Redis 等）が入ったサイトでは
 *    「会員限定にしたのに1時間見えたまま」になる。
 *    そこで設定を保存するたびに番号を上げ、キャッシュキーに混ぜて一斉に無効化する。
 *    （WordPress 標準の wp_cache はリクエスト単位なので、その環境では元々影響なし）
 * ------------------------------------------------------------- */

/**
 * 現在のキャッシュ版番号
 *
 * @return int
 */
function lw_allowed_roles_cache_version() {
	return (int) get_option( 'lw_allowed_roles_version', 0 );
}

/**
 * 閲覧権限の設定を保存したときに呼ぶ（キャッシュを一斉に無効化する）
 */
function lw_bump_allowed_roles_cache_version() {
	update_option( 'lw_allowed_roles_version', lw_allowed_roles_cache_version() + 1 );
}
