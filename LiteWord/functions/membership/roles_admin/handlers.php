<?php
/**
 * 権限（ロール）の設定 — 保存処理
 *
 * どれも admin-post.php 経由。権限は manage_options 固定（ロールを触るのは重い操作のため）。
 * 結果は URL のクエリで戻し、画面側の lw_roles_admin_notice() が表示する。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/** この画面を触れる権限 */
function lw_roles_admin_cap() {
	return 'manage_options';
}

/** 一覧に戻る URL（メッセージ付き） */
function lw_roles_admin_redirect( $args = [] ) {
	wp_safe_redirect( add_query_arg(
		array_merge( [ 'page' => 'lw-roles' ], $args ),
		admin_url( 'users.php' )
	) );
	exit;
}

/** 一覧の「元に戻す」等に使うリンク（nonce 付き） */
function lw_roles_admin_action_url( $action, $slug, $nonce_action ) {
	return wp_nonce_url(
		add_query_arg(
			[ 'action' => $action, 'role' => $slug ],
			admin_url( 'admin-post.php' )
		),
		$nonce_action
	);
}

/** 共通の入口チェック */
function lw_roles_admin_guard( $nonce_action ) {
	if ( ! current_user_can( lw_roles_admin_cap() ) ) {
		wp_die( '権限がありません。' );
	}
	check_admin_referer( $nonce_action );
}

/* ==============================================================
 * 一覧の一括保存（名前 ＋ できること）
 * ============================================================== */
add_action( 'admin_post_lw_roles_save', function () {

	lw_roles_admin_guard( 'lw_roles_save' );

	$error = '';

	/* ---------- ① 名前 ---------- */
	$names = isset( $_POST['lw_role_names'] ) ? (array) wp_unslash( $_POST['lw_role_names'] ) : [];
	$renamed = 0;

	foreach ( $names as $slug => $name ) {
		$slug = sanitize_key( $slug );
		if ( ! isset( wp_roles()->roles[ $slug ] ) ) {
			continue;
		}
		// 画面には翻訳後の名前を出しているので、変わっていない行は触らない
		if ( translate_user_role( wp_roles()->roles[ $slug ]['name'] ) === trim( (string) $name ) ) {
			continue;
		}

		$result = lw_rename_role( $slug, $name );
		if ( is_wp_error( $result ) ) {
			$error = $result->get_error_message();
			break;
		}
		$renamed++;
	}

	/* ---------- ② できること（ベースの選び直し） ---------- */
	$bases   = isset( $_POST['lw_role_bases'] ) ? (array) wp_unslash( $_POST['lw_role_bases'] ) : [];
	$leveled = 0;

	if ( ! $error ) {
		foreach ( $bases as $slug => $base ) {
			$slug = sanitize_key( $slug );
			$base = sanitize_key( $base );
			if ( $base === '' ) {
				continue;   // 「カスタム（変更しない）」
			}
			if ( lw_detect_role_base( $slug ) === $base ) {
				continue;   // 変わっていない
			}

			$result = lw_change_role_base( $slug, $base );
			if ( is_wp_error( $result ) ) {
				$error = $result->get_error_message();
				break;
			}
			$leveled++;
		}
	}

	if ( $error ) {
		lw_roles_admin_redirect( [ 'lw_msg' => 'error', 'lw_detail' => rawurlencode( $error ) ] );
	}
	lw_roles_admin_redirect( [ 'lw_msg' => 'saved', 'lw_count' => $renamed, 'lw_leveled' => $leveled ] );
} );

/* ==============================================================
 * 名前を元に戻す
 * ============================================================== */
add_action( 'admin_post_lw_roles_reset_name', function () {

	$slug = isset( $_GET['role'] ) ? sanitize_key( wp_unslash( $_GET['role'] ) ) : '';
	lw_roles_admin_guard( 'lw_roles_reset_name_' . $slug );

	$result = lw_reset_role_name( $slug );
	if ( is_wp_error( $result ) ) {
		lw_roles_admin_redirect( [ 'lw_msg' => 'error', 'lw_detail' => rawurlencode( $result->get_error_message() ) ] );
	}
	lw_roles_admin_redirect( [ 'lw_msg' => 'reset' ] );
} );

/* ==============================================================
 * 新しい権限を追加
 * ============================================================== */
add_action( 'admin_post_lw_roles_create', function () {

	lw_roles_admin_guard( 'lw_roles_create' );

	$result = lw_create_role(
		isset( $_POST['lw_new_role_name'] ) ? wp_unslash( $_POST['lw_new_role_name'] ) : '',
		isset( $_POST['lw_new_role_slug'] ) ? wp_unslash( $_POST['lw_new_role_slug'] ) : '',
		isset( $_POST['lw_new_role_base'] ) ? sanitize_key( wp_unslash( $_POST['lw_new_role_base'] ) ) : 'subscriber'
	);

	if ( is_wp_error( $result ) ) {
		lw_roles_admin_redirect( [ 'lw_msg' => 'error', 'lw_detail' => rawurlencode( $result->get_error_message() ) ] );
	}
	lw_roles_admin_redirect( [ 'lw_msg' => 'created', 'lw_detail' => rawurlencode( $result ) ] );
} );

/* ==============================================================
 * 削除
 * ============================================================== */
add_action( 'admin_post_lw_roles_delete', function () {

	$slug = isset( $_POST['role'] ) ? sanitize_key( wp_unslash( $_POST['role'] ) ) : '';
	lw_roles_admin_guard( 'lw_roles_delete_' . $slug );

	$result = lw_delete_role(
		$slug,
		isset( $_POST['lw_move_to'] ) ? sanitize_key( wp_unslash( $_POST['lw_move_to'] ) ) : 'subscriber',
		! empty( $_POST['lw_strip_meta'] )
	);

	if ( is_wp_error( $result ) ) {
		lw_roles_admin_redirect( [ 'lw_msg' => 'error', 'lw_detail' => rawurlencode( $result->get_error_message() ) ] );
	}
	lw_roles_admin_redirect( [
		'lw_msg'   => 'deleted',
		'lw_users' => (int) $result['users'],
		'lw_meta'  => (int) $result['meta'],
	] );
} );