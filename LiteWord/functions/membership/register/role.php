<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：登録した人に付ける権限（ロール）
 *
 * 「権限（ロール）の設定」（functions/membership/roles_admin/）で
 * 作ったロールもここに並ぶ。ただし危険な権限を持つものは外す。
 * =============================================================== */

/**
 * 会員に付けてはいけない権限
 *
 * 🚨 いちばん大事なのは unfiltered_html。
 *    これを持つロール（編集者・管理者ベース）を会員に配ると、
 *    登録した人が記事に任意の HTML・JavaScript を書けるようになる。
 *    「メールアドレスだけで誰でも取れる権限」に付けてよいものではない。
 *
 * @return string[]
 */
function lw_member_register_denied_caps() {
	return [
		'unfiltered_html',
		'manage_options',
		'edit_users',
		'promote_users',
		'create_users',
		'delete_users',
		'list_users',
		'edit_theme_options',
		'switch_themes',
		'install_plugins',
		'activate_plugins',
		'edit_plugins',
		'install_themes',
		'edit_themes',
		'edit_files',
		'update_core',
		'update_plugins',
		'update_themes',
		'unfiltered_upload',
		'import',
		'export',
	];
}

/**
 * このロールを会員に付けてよいか
 *
 * @param string $slug
 * @return bool
 */
function lw_member_register_role_is_safe( $slug ) {

	if ( $slug === 'administrator' ) {
		return false;
	}

	$roles = wp_roles()->roles;
	if ( ! isset( $roles[ $slug ] ) ) {
		return false;
	}

	$caps = (array) ( $roles[ $slug ]['capabilities'] ?? [] );
	foreach ( lw_member_register_denied_caps() as $cap ) {
		if ( ! empty( $caps[ $cap ] ) ) {
			return false;
		}
	}

	return true;
}

/**
 * 登録時に付けられる権限の一覧（カスタマイザーの選択肢）
 *
 * ⚠️ 画面から消すだけでは制限にならないので、実際に付けるとき
 *    （lw_member_register_role()）も同じ判定を通している。
 *
 * @return array スラッグ => 表示名
 */
function lw_member_register_role_choices() {

	$choices = [];

	foreach ( wp_roles()->roles as $slug => $role ) {

		if ( ! lw_member_register_role_is_safe( $slug ) ) {
			continue;
		}

		// WP標準ロールは英語名で保存されているので表示時に翻訳する
		// （「権限（ロール）の設定」で改名済みなら日本語のまま返る）
		$choices[ $slug ] = translate_user_role( (string) ( $role['name'] ?? $slug ) );
	}

	return $choices;
}

/**
 * 実際に付ける権限（ロール）
 *
 * 設定値が安全でなければ購読者に落とす。
 * カスタマイザーで選んだあとにそのロールが削除された場合や、
 * 別プラグインが後から危険な権限を足した場合もここで止まる。
 *
 * @return string
 */
function lw_member_register_role() {

	$role = (string) Lw_theme_mod_set( 'lw_membership_register_role', '' );

	return lw_member_register_role_is_safe( $role ) ? $role : 'subscriber';
}
