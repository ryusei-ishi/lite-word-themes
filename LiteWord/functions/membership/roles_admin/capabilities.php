<?php
/**
 * 権限（ロール）の設定 — できること（capabilities）の決め方
 *
 * 権限を1つずつ選ばせず、既存ロールを「ベース」に選んで丸ごとコピーする方式。
 * administrator をベースに選べないようにし、さらに管理系の権限は必ず落とすことで
 * 「うっかり強い権限を配る」事故を二重に防いでいる。
 *
 * 🚨 作ったあとでもベースを選び直せる（lw_change_role_base）。
 *    変更はそのロールを持っているユーザー全員に即座に効くので、
 *    画面側で人数を見せて確認を取ること。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/** 新規ロールのベースに選べるロール（administrator は入れない） */
function lw_role_base_choices() {
	return [ 'subscriber', 'contributor', 'author', 'editor' ];
}

/** ベースロールの説明文 */
function lw_role_base_notes() {
	return [
		'subscriber'  => '読むだけ',
		'contributor' => '下書きが書ける',
		'author'      => '自分の記事を公開できる',
		'editor'      => '全記事を編集できる',
	];
}

/**
 * この画面から作るロールには絶対に付けない権限
 *
 * ベースの4つ（購読者〜編集者）は WordPress 標準ではどれも持っていないが、
 * 他のプラグインがあとから編集者などに管理系の権限を足す可能性がある。
 * コピー元がそうなっていても、ここを通して必ず落とす。
 *
 * ⚠️ unfiltered_html は入れていない。編集者が標準で持つ権限で、
 *    これを外すと「編集者と同じ」が編集者と違う挙動になるため。
 *    （＝編集者ベースのロールは記事に任意の HTML を書ける。WP標準どおり）
 */
function lw_role_forbidden_caps() {
	return [
		'manage_options', 'edit_users', 'promote_users', 'create_users', 'delete_users', 'list_users',
		'edit_plugins', 'edit_themes', 'edit_files', 'install_plugins', 'install_themes',
		'activate_plugins', 'switch_themes', 'delete_plugins', 'delete_themes',
		'update_core', 'update_plugins', 'update_themes', 'unfiltered_upload',
		'export', 'import', 'manage_network', 'setup_network',
	];
}

/**
 * ベースロールの権限をコピーするときに通す（管理系は必ず落とす）
 *
 * @param string $base ベースロールのスラッグ
 * @return array|WP_Error capabilities
 */
function lw_role_caps_from_base( $base ) {

	$base_role = get_role( $base );
	if ( ! $base_role ) {
		return new WP_Error( 'lw_role_bad_base', 'ベースにする権限が見つかりません。' );
	}

	$caps = $base_role->capabilities;
	foreach ( lw_role_forbidden_caps() as $cap ) {
		unset( $caps[ $cap ] );
	}
	return $caps;
}

/**
 * 今の権限がどのベースと同じかを判定する
 *
 * ベースを保存せず、そのつど中身を突き合わせている。
 * 他プラグインが後から権限を足した場合も「どれとも一致しない」と正直に出せるため。
 *
 * @return string ベースのスラッグ。どれとも一致しなければ空文字
 */
function lw_detect_role_base( $slug ) {

	$caps = wp_roles()->roles[ $slug ]['capabilities'] ?? null;
	if ( ! is_array( $caps ) ) {
		return '';
	}
	// 値が false の権限（明示的に禁止）は無視して比べる
	$caps = array_filter( $caps );

	foreach ( lw_role_base_choices() as $base ) {
		// 作成・変更と同じ経路（管理系を落としたあと）で比べる。
		// get_role() の生の権限と比べると、他プラグインが管理系を足した瞬間に
		// 「作った直後なのにカスタム扱い」になってしまう
		$base_caps = lw_role_caps_from_base( $base );
		if ( is_wp_error( $base_caps ) ) {
			continue;
		}
		// 連想配列の == はキーと値の組を順不同で比べる
		if ( array_filter( $base_caps ) == $caps ) {
			return $base;
		}
	}
	return '';
}

/**
 * あとから権限レベル（ベース）を変える
 *
 * 🚨 そのロールを持っているユーザー全員に即座に効く。
 *    上げる方向（購読者 → 編集者 等）は特に危ないので、画面側で人数を見せて確認を取ること。
 *
 * add_cap() / remove_cap() を1つずつ呼ぶとその回数だけ update_option が走るので、
 * 名前の変更（lw_write_role_name）と同じくオプションをまとめて1回で更新する。
 *
 * @return true|WP_Error
 */
function lw_change_role_base( $slug, $base ) {

	if ( ! lw_is_custom_role( $slug ) ) {
		// WP標準・他プラグインのロールは触らせない（権限を剥がすと向こうの機能が壊れる）
		return new WP_Error( 'lw_role_not_editable', 'このロールは LiteWord で作ったものではないため権限を変更できません。' );
	}
	if ( ! in_array( $base, lw_role_base_choices(), true ) ) {
		return new WP_Error( 'lw_role_bad_base', 'ベースにする権限の指定が不正です。' );
	}

	$wp_roles = wp_roles();
	if ( ! isset( $wp_roles->roles[ $slug ] ) ) {
		return new WP_Error( 'lw_role_missing', 'その権限は存在しません。' );
	}

	// 足すのではなく丸ごと差し替える。
	// 足すだけだと level_N（旧来の権限レベル）が前のまま残って辻褄が合わなくなる。
	$caps = lw_role_caps_from_base( $base );
	if ( is_wp_error( $caps ) ) {
		return $caps;
	}

	$wp_roles->roles[ $slug ]['capabilities'] = $caps;
	$wp_roles->role_objects[ $slug ]          = new WP_Role( $slug, $caps );
	update_option( $wp_roles->role_key, $wp_roles->roles );

	return true;
}
