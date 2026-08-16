<?php
/**
 * 権限（ロール）の設定 — 新しいロールを作る
 *
 * できること（capabilities）の決め方は capabilities.php。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * 新しいロールを作る
 *
 * @param string $name       表示名
 * @param string $slug_input スラッグ（空なら自動採番）
 * @param string $base       ベースにするロール（権限をコピーする）
 * @return string|WP_Error 作られたスラッグ
 */
function lw_create_role( $name, $slug_input, $base ) {

	$name = lw_sanitize_role_name( $name );
	if ( $name === '' ) {
		return new WP_Error( 'lw_role_name_empty', '表示名を入力してください。' );
	}
	if ( mb_strlen( $name ) > 50 ) {
		return new WP_Error( 'lw_role_name_long', '表示名は50文字以内にしてください。' );
	}
	if ( ! in_array( $base, lw_role_base_choices(), true ) ) {
		return new WP_Error( 'lw_role_bad_base', 'ベースにする権限の指定が不正です。' );
	}

	$slug = lw_build_role_slug( $slug_input );
	if ( is_wp_error( $slug ) ) {
		return $slug;
	}
	if ( isset( wp_roles()->roles[ $slug ] ) ) {
		return new WP_Error( 'lw_role_exists', 'スラッグ「' . $slug . '」はすでに使われています。別の名前にしてください。' );
	}

	$caps = lw_role_caps_from_base( $base );
	if ( is_wp_error( $caps ) ) {
		return $caps;
	}

	add_role( $slug, $name, $caps );

	$custom   = lw_get_custom_role_slugs();
	$custom[] = $slug;
	update_option( 'lw_custom_roles', array_values( array_unique( $custom ) ) );

	return $slug;
}

/**
 * スラッグを組み立てる
 *
 * 頭に `lw_` を付けて、他プラグインが後から同じ名前のロールを作ってもぶつからないようにする。
 *
 * @return string|WP_Error
 */
function lw_build_role_slug( $input ) {

	$slug = sanitize_key( (string) $input );

	if ( $slug === '' ) {
		// 未入力なら自動採番
		$n = 1;
		while ( isset( wp_roles()->roles[ 'lw_role_' . $n ] ) ) {
			$n++;
			if ( $n > 500 ) {
				return new WP_Error( 'lw_role_slug_fail', 'スラッグを自動で作れませんでした。手入力してください。' );
			}
		}
		return 'lw_role_' . $n;
	}

	if ( strpos( $slug, 'lw_' ) !== 0 ) {
		$slug = 'lw_' . $slug;
	}
	if ( strlen( $slug ) > 60 ) {
		return new WP_Error( 'lw_role_slug_long', 'スラッグが長すぎます（半角60文字以内）。' );
	}
	return $slug;
}
