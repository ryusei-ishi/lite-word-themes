<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員用のログアウト：設定の読み取り
 *
 * カスタマイザー「会員限定ページ設定」の4項目を、使う側が検証しなくていい形にして返す。
 *   lw_membership_logout_box      … 会員限定ページの中のどこに出すか
 *   lw_membership_logout_menu     … どのメニューに足すか
 *   lw_membership_logout_label    … 文言
 *   lw_membership_logout_redirect … ログアウトしたあとに開く固定ページ（ID）
 *
 * 🚨 Lw_theme_mod_set() は使わない（pause.php と同じ理由）。あちらは値を1時間キャッシュしていて、
 *    グループごと消せない永続キャッシュの環境では、保存しても最大1時間ふるい値が返る。
 * =============================================================== */

/**
 * 設定を1つ読む
 *
 * @param string $key テーマMODのキー
 * @return string 文字か数でなければ空
 */
function lw_membership_logout_setting( $key ) {
	$value = get_theme_mod( $key, '' );
	return is_scalar( $value ) ? (string) $value : '';
}

/**
 * 会員限定ページの中のどこに出すか
 *
 * @return string ''＝出さない（既定）／ 'bottom'＝本文の下 ／ 'top'＝本文の上 ／ 'both'＝上と下
 */
function lw_membership_logout_box_position() {
	$value = lw_membership_logout_setting( 'lw_membership_logout_box' );
	return in_array( $value, [ 'bottom', 'top', 'both' ], true ) ? $value : '';
}

/**
 * どのメニューに足すか
 *
 * @return string[] 'header'（PC のヘッダー・追従メニュー）／ 'drawer'（スマホのメニュー）。空＝足さない（既定）
 */
function lw_membership_logout_menu_areas() {
	switch ( lw_membership_logout_setting( 'lw_membership_logout_menu' ) ) {
		case 'both':
			return [ 'header', 'drawer' ];
		case 'header':
			return [ 'header' ];
		case 'drawer':
			return [ 'drawer' ];
	}
	return [];
}

/**
 * ボタンとメニューに出す文言（エスケープ済み）
 *
 * @return string
 */
function lw_membership_logout_label() {
	$label = trim( lw_membership_logout_setting( 'lw_membership_logout_label' ) );
	return esc_html( $label !== '' ? $label : 'ログアウト' );
}

/**
 * ログアウトしたあとに開くページの URL
 *
 * 固定ページの ID で持つので、ドメインが変わっても（テスト環境から本番へ移しても）切れない。
 * 未選択・公開していない・固定ページでない（あとで非公開にした・削除した）ときはトップページ。
 * 選べるのはサイトの中の固定ページだけなので、外のサイトへは飛ばない
 * （受け取る wp-login.php の側も wp_safe_redirect() で、自分のサイト以外を拒む）。
 *
 * @return string
 */
function lw_membership_logout_redirect_url() {

	$page_id = absint( lw_membership_logout_setting( 'lw_membership_logout_redirect' ) );

	if ( $page_id > 0 ) {
		$page = get_post( $page_id );
		if ( $page && $page->post_type === 'page' && $page->post_status === 'publish' ) {
			$url = get_permalink( $page );
			if ( $url ) {
				return $url;
			}
		}
	}

	return home_url( '/' );
}

/**
 * ログアウトのリンク（ノンス付き＝確認画面を出さずにすぐログアウトする）
 *
 * ノンスは人ごと・ログインごとに違う。このリンクを含むページをほかの人に使い回させないこと
 * （→ lw_membership_logout_keep_out_of_cache()）。
 * wp_logout_url() は & を &amp; にして返す（wp_nonce_url() の仕様）。メニューの項目の url と同じく
 * そのままの & で持つため戻す（nav_menu_link_attributes などで URL を扱うコードが「amp;redirect_to」を見ないように）。
 * HTML に出すときは esc_url() を通す。
 *
 * @return string
 */
function lw_membership_logout_url() {
	return str_replace( '&amp;', '&', wp_logout_url( lw_membership_logout_redirect_url() ) );
}

/**
 * ログアウトを出したページを、ページキャッシュに残さない
 *
 * ログインしている人のページは、もともと WordPress 本体が no-store・private を返し、
 * LiteWord Cache もログイン中の Cookie があれば保存しない。
 * それでも「ログインしている人のページも保存する」設定のキャッシュ系プラグインのために DONOTCACHEPAGE を立てる。
 *
 * @return void
 */
function lw_membership_logout_keep_out_of_cache() {
	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );
	}
}

/**
 * カスタマイザーの選択肢：ログアウトしたあとに開くページ
 *
 * 公開中の固定ページ（get_pages() の既定）。並びは会員登録ページの選択肢と同じ。
 *
 * @return array ID => タイトル（先頭は「トップページ（既定）」）
 */
function lw_membership_logout_page_choices() {

	$choices = [ '' => 'トップページ（既定）' ];

	foreach ( get_pages( [ 'sort_column' => 'menu_order,post_title' ] ) as $page ) {
		$choices[ (string) $page->ID ] = $page->post_title !== '' ? $page->post_title : "（無題 #{$page->ID}）";
	}

	return $choices;
}
