<?php
/**
 * 権限（ロール）の設定 — 使用状況の集計と削除
 *
 * 「そのロールを消してよいか」を判断するための材料を集める。
 *   ① そのロールのユーザー数
 *   ② 会員限定の設定（post meta / term meta `_lw_allowed_roles`）で使われている数
 *
 * ⚠️ ロールを消しただけだと `_lw_allowed_roles` にスラッグが残り、
 *    「誰も見られない記事」ができてしまう。削除時に必ず一緒に片付ける。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/** そのロールのユーザー数 */
function lw_count_users_with_role( $slug ) {
	$q = new WP_User_Query( [
		'role'        => $slug,
		'number'      => 1,
		'count_total' => true,
		'fields'      => 'ID',
	] );
	return (int) $q->get_total();
}

/**
 * シリアライズされた配列の中からスラッグを探すための LIKE 用の断片
 *
 * `_lw_allowed_roles` は配列なので meta_value は a:1:{i:0;s:6:"editor";} のような形。
 * s:<長さ>:"<スラッグ>" を狙い撃ちすれば、部分一致の誤検出を避けられる。
 */
function lw_role_meta_needle( $slug ) {
	return 's:' . strlen( $slug ) . ':"' . $slug . '"';
}

/**
 * 会員限定の設定でそのロールを使っている投稿ID・タームID
 *
 * @return array{posts:int[], terms:int[]}
 */
function lw_find_membership_usage( $slug ) {
	global $wpdb;

	$like = '%' . $wpdb->esc_like( lw_role_meta_needle( $slug ) ) . '%';

	$posts = $wpdb->get_col( $wpdb->prepare(
		"SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_lw_allowed_roles' AND meta_value LIKE %s",
		$like
	) );
	$terms = $wpdb->get_col( $wpdb->prepare(
		"SELECT term_id FROM {$wpdb->termmeta} WHERE meta_key = '_lw_allowed_roles' AND meta_value LIKE %s",
		$like
	) );

	return [
		'posts' => array_map( 'intval', (array) $posts ),
		'terms' => array_map( 'intval', (array) $terms ),
	];
}

/** 会員限定の設定で使われている箇所数 */
function lw_count_membership_usage( $slug ) {
	$usage = lw_find_membership_usage( $slug );
	return count( $usage['posts'] ) + count( $usage['terms'] );
}

/**
 * 会員限定の設定からそのロールを外す
 *
 * @return int 直した箇所数
 */
function lw_strip_role_from_membership( $slug ) {

	$usage = lw_find_membership_usage( $slug );
	$fixed = 0;

	foreach ( $usage['posts'] as $post_id ) {
		$roles = lw_normalize_allowed_roles( get_post_meta( $post_id, '_lw_allowed_roles', true ) );
		$next  = array_values( array_diff( $roles, [ $slug ] ) );
		if ( $next === $roles ) {
			continue;
		}
		if ( $next ) {
			update_post_meta( $post_id, '_lw_allowed_roles', $next );
		} else {
			delete_post_meta( $post_id, '_lw_allowed_roles' );
		}
		$fixed++;
	}

	foreach ( $usage['terms'] as $term_id ) {
		$roles = lw_normalize_allowed_roles( get_term_meta( $term_id, '_lw_allowed_roles', true ) );
		$next  = array_values( array_diff( $roles, [ $slug ] ) );
		if ( $next === $roles ) {
			continue;
		}
		if ( $next ) {
			update_term_meta( $term_id, '_lw_allowed_roles', $next );
		} else {
			delete_term_meta( $term_id, '_lw_allowed_roles' );
		}
		$fixed++;
	}

	if ( $fixed ) {
		lw_bump_allowed_roles_cache_version();
	}
	return $fixed;
}

/**
 * ロールを削除する
 *
 * @param string $slug        消すロール
 * @param string $move_to     そのロールのユーザーの移動先
 * @param bool   $strip_meta  会員限定の設定からも外すか
 * @return array|WP_Error ['users'=>移動した人数, 'meta'=>直した箇所数]
 */
function lw_delete_role( $slug, $move_to, $strip_meta ) {

	if ( ! lw_is_custom_role( $slug ) ) {
		// WP標準・他プラグインのロールは消させない（消すと向こうの機能が壊れる）
		return new WP_Error( 'lw_role_not_deletable', 'このロールは LiteWord で作ったものではないため削除できません。' );
	}
	if ( ! isset( wp_roles()->roles[ $slug ] ) ) {
		return new WP_Error( 'lw_role_missing', 'その権限は存在しません。' );
	}
	if ( $move_to === $slug || ! isset( wp_roles()->roles[ $move_to ] ) ) {
		return new WP_Error( 'lw_role_bad_move_to', 'ユーザーの移動先が不正です。' );
	}
	// 🚨 画面の選択肢から外すだけでは制限にならないので、ここでも弾く。
	//    まとめて管理者になる事故を防ぐため（本当に必要ならユーザー編集画面から1人ずつ）。
	if ( $move_to === 'administrator' ) {
		return new WP_Error( 'lw_role_move_to_admin', 'ユーザーの移動先に管理者は選べません。' );
	}

	// ① ユーザーを移す（先に移さないと権限のないユーザーが残る）
	$moved = 0;
	$users = get_users( [ 'role' => $slug, 'fields' => 'ID', 'number' => -1 ] );
	foreach ( $users as $user_id ) {
		$user = new WP_User( $user_id );
		$user->remove_role( $slug );
		// ほかのロールを持っていない人だけ移動先を付ける
		if ( empty( $user->roles ) ) {
			$user->add_role( $move_to );
		}
		$moved++;
	}

	// ② 会員限定の設定から外す
	$fixed = $strip_meta ? lw_strip_role_from_membership( $slug ) : 0;

	// ③ ロール本体を消す
	remove_role( $slug );

	$custom = array_values( array_diff( lw_get_custom_role_slugs(), [ $slug ] ) );
	update_option( 'lw_custom_roles', $custom );

	$originals = (array) get_option( 'lw_role_name_originals', [] );
	unset( $originals[ $slug ] );
	update_option( 'lw_role_name_originals', $originals );

	return [ 'users' => $moved, 'meta' => $fixed ];
}
