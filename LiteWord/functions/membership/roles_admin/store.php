<?php
/**
 * 権限（ロール）の設定 — 取得と名前の変更
 *
 * ロールは WordPress の `wp_user_roles` オプション1つに入っている（＝サイト全体の設定）。
 * テーマ固有の保存先ではないので、次の2点に注意すること。
 *
 *   ⚠️ ここでの変更は WooCommerce 等ほかのプラグインの画面にも出る。
 *   ⚠️ テーマを切り替えても残る（LiteWord を外しても消えない）。
 *
 * 追加でこのテーマが持つオプションは2つだけ。
 *   `lw_custom_roles`        … この画面から作ったロールのスラッグ（＝削除してよいもの）
 *   `lw_role_name_originals` … 名前を変える前の元の名前（「元に戻す」用）
 *
 * 新規作成は create.php、使用状況と削除は usage.php。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * ロールの表示名を整える（作成・変更で共通）
 *
 * ロール名は WordPress 本体だけでなく、他のプラグインの画面にも出る。
 * こちらの画面では全て esc_html / esc_attr を通しているが、
 * 出力側がエスケープを忘れていても壊れないよう、記号は保存の時点で落としておく。
 *
 * ・wp_strip_all_tags() … <script> は中身ごと消える
 * ・そのあと < > " ' も落とす（ロール名に使う理由がない）
 *
 * @return string 整えた名前（空になることもある）
 */
function lw_sanitize_role_name( $name ) {
	$name = wp_strip_all_tags( (string) $name );
	$name = str_replace( [ '<', '>', '"', "'", '`' ], '', $name );
	return trim( $name );
}

/** この画面から作ったロールのスラッグ一覧 */
function lw_get_custom_role_slugs() {
	return array_values( array_filter( (array) get_option( 'lw_custom_roles', [] ), 'is_string' ) );
}

/** そのロールはこの画面から作ったもの（＝削除してよい）か */
function lw_is_custom_role( $slug ) {
	return in_array( $slug, lw_get_custom_role_slugs(), true );
}

/** 名前を変える前の元の名前（無ければ空文字） */
function lw_get_role_original_name( $slug ) {
	$originals = (array) get_option( 'lw_role_name_originals', [] );
	return isset( $originals[ $slug ] ) ? (string) $originals[ $slug ] : '';
}

/** そのロールの名前は変更されているか */
function lw_role_name_is_changed( $slug ) {
	$original = lw_get_role_original_name( $slug );
	$current  = wp_roles()->roles[ $slug ]['name'] ?? '';
	return $original !== '' && $original !== $current;
}

/**
 * ロールの表示名を変更する
 *
 * WP 標準の5つは英語（'Subscriber'）で保存され、表示のたびに translate_user_role() で
 * 翻訳されている。日本語を書き込むと翻訳が見つからずそのまま出るので、これで名前が変わる。
 * 元の英語名を戻せば翻訳も元どおりになる。
 *
 * 🚨 WordPress 本体を更新しても名前は戻らない。
 *    populate_roles() は add_role() を呼ぶが、add_role() は既存ロールがあれば何もしないため。
 *
 * @return true|WP_Error
 */
function lw_rename_role( $slug, $new_name ) {

	$wp_roles = wp_roles();
	if ( ! isset( $wp_roles->roles[ $slug ] ) ) {
		return new WP_Error( 'lw_role_missing', 'その権限は存在しません。' );
	}

	$new_name = lw_sanitize_role_name( $new_name );
	if ( $new_name === '' ) {
		return new WP_Error( 'lw_role_name_empty', '名前を入力してください。' );
	}
	if ( mb_strlen( $new_name ) > 50 ) {
		return new WP_Error( 'lw_role_name_long', '名前は50文字以内にしてください。' );
	}

	$current = (string) $wp_roles->roles[ $slug ]['name'];
	if ( $current === $new_name ) {
		return true;   // 変更なし
	}

	// 最初に変えたときだけ元の名前を控える（2回目以降で上書きしない）
	$originals = (array) get_option( 'lw_role_name_originals', [] );
	if ( ! isset( $originals[ $slug ] ) ) {
		$originals[ $slug ] = $current;
		update_option( 'lw_role_name_originals', $originals );
	}

	lw_write_role_name( $slug, $new_name );
	return true;
}

/**
 * 名前を元に戻す
 *
 * @return true|WP_Error
 */
function lw_reset_role_name( $slug ) {

	$original = lw_get_role_original_name( $slug );
	if ( $original === '' ) {
		return new WP_Error( 'lw_role_no_original', 'このロールは名前を変更していません。' );
	}
	if ( ! isset( wp_roles()->roles[ $slug ] ) ) {
		return new WP_Error( 'lw_role_missing', 'その権限は存在しません。' );
	}

	lw_write_role_name( $slug, $original );

	$originals = (array) get_option( 'lw_role_name_originals', [] );
	unset( $originals[ $slug ] );
	update_option( 'lw_role_name_originals', $originals );

	return true;
}

/**
 * `wp_user_roles` オプションに名前を書き込む（メモリ上の WP_Roles も合わせる）
 *
 * WP_Roles には名前を変更する API が無いのでオプションを直接更新する。
 */
function lw_write_role_name( $slug, $name ) {
	$wp_roles = wp_roles();
	$wp_roles->roles[ $slug ]['name'] = $name;
	$wp_roles->role_names[ $slug ]    = $name;
	update_option( $wp_roles->role_key, $wp_roles->roles );
}
