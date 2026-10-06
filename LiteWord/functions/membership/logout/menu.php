<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員用のログアウト：メニュー
 *
 * ログインしている人にだけ、選んだメニューの最後に「ログアウト」を1項目足す。
 * ログインしていない人には HTML にも出さない。
 *
 * 🚨 HTML の文字列（wp_nav_menu_items）ではなく、メニューの項目（wp_nav_menu_objects）として足す。
 *    サイト側が nav_menu_item_args などで各項目にアイコンを付けていても、ほかの項目と同じ姿になるため。
 *
 * どのメニューかは2通りで見分ける（lw_membership_logout_menu_area()）。
 *   ① wp_nav_menu() の引数 lw_menu_area … テーマのヘッダー・追従メニュー・ドロワーが渡している。
 *      🚨 カスタマイザーでメニューを選ぶと、テーマは theme_location を空にして menu を直接渡す。
 *         場所の名前だけで見分けると、その設定のサイトでは出ない
 *   ② theme_location が header / drawer … ヘッダーを自前で描く（ショートコード型など）サイトが場所の名前で呼ぶとき
 * フッターや、ウィジェットのメニューには足さない。
 * =============================================================== */

/**
 * 足す項目の ID
 *
 * 存在しない投稿を指す負の数。0 にすると、the_title などのフィルターが get_post( 0 ) で
 * 「いま表示中の記事」を引いてしまう。
 * 🚨 絶対値も実在しえない大きさにしておく。項目に無いプロパティを読むと WP_Post は投稿メタを見に行き、
 *    get_post_meta() は ID を absint() で正の数にするので、-9001 だと「投稿 9001 のメタ」を読んでしまう。
 */
if ( ! defined( 'LW_MEMBERSHIP_LOGOUT_MENU_ITEM_ID' ) ) {
	define( 'LW_MEMBERSHIP_LOGOUT_MENU_ITEM_ID', -2147483647 );
}

add_filter( 'wp_nav_menu_objects', 'lw_membership_logout_menu_item', 20, 2 );

/**
 * メニューの最後に「ログアウト」を足す
 *
 * @param array         $items 並べ替え済みのメニュー項目
 * @param stdClass|null $args  wp_nav_menu() の引数（引数1つで呼ぶプラグインがあっても止まらないよう既定値を付けた）
 * @return array
 */
function lw_membership_logout_menu_item( $items, $args = null ) {

	if ( ! is_array( $items ) || ! is_user_logged_in() ) {
		return $items;
	}

	$area = lw_membership_logout_menu_area( $args );
	if ( $area === '' || ! in_array( $area, lw_membership_logout_menu_areas(), true ) ) {
		return $items;
	}

	// 並び順は今いちばん大きい番号の次（menu_order には欠番がありうる。あとで並べ直すプラグインでも最後に来るように）
	$order = 0;
	foreach ( $items as $menu_item ) {
		if ( isset( $menu_item->menu_order ) ) {
			$order = max( $order, (int) $menu_item->menu_order );
		}
	}

	$items[] = lw_membership_logout_menu_object( $order + 1 );

	lw_membership_logout_keep_out_of_cache();

	return $items;
}

/**
 * この wp_nav_menu() がどのメニューか
 *
 * @param stdClass|null $args wp_nav_menu() の引数
 * @return string 'header' ／ 'drawer' ／ ''（それ以外）
 */
function lw_membership_logout_menu_area( $args ) {

	if ( isset( $args->lw_menu_area ) && is_string( $args->lw_menu_area ) && $args->lw_menu_area !== '' ) {
		return $args->lw_menu_area;
	}

	$location = isset( $args->theme_location ) && is_string( $args->theme_location ) ? $args->theme_location : '';

	return in_array( $location, [ 'header', 'drawer' ], true ) ? $location : '';
}

/**
 * 足す「ログアウト」の項目
 *
 * wp_get_nav_menu_items() が返すのと同じ形（WP_Post ＋ wp_setup_nav_menu_item() が足す値）にする。
 * stdClass にしないのは、項目を WP_Post と型で受け取るフィルターがあると致命的なエラーになるため。
 *
 * @param int $order 並び順
 * @return WP_Post
 */
function lw_membership_logout_menu_object( $order ) {

	$label = lw_membership_logout_label();

	$item = new WP_Post( (object) [
		'ID'          => LW_MEMBERSHIP_LOGOUT_MENU_ITEM_ID,
		'post_title'  => $label,
		'post_type'   => 'nav_menu_item',
		'post_status' => 'publish',
		'menu_order'  => (int) $order,
		'filter'      => 'raw',
	] );

	$item->db_id                 = LW_MEMBERSHIP_LOGOUT_MENU_ITEM_ID;
	$item->menu_item_parent      = '0';
	$item->object_id             = (string) LW_MEMBERSHIP_LOGOUT_MENU_ITEM_ID;
	$item->object                = 'custom';
	$item->type                  = 'custom';
	$item->type_label            = 'カスタムリンク';
	$item->title                 = $label;
	$item->url                   = lw_membership_logout_url();
	$item->target                = '';
	$item->attr_title            = '';
	$item->description           = '';
	$item->classes               = [ 'menu-item', 'menu-item-type-custom', 'menu-item-object-custom', 'lw_menu_logout' ];
	$item->xfn                   = 'nofollow'; // 押すとログアウトするリンク。先読みするプラグインに踏ませない
	$item->current               = false;
	$item->current_item_ancestor = false;
	$item->current_item_parent   = false;

	return $item;
}

/* ---------------------------------------------------------------
 * ヘッダーの子メニューの開く向きを、足す前とそろえる
 *
 * 🚨 assets/css/header/sub_menu/style.scss は「最後から3つ」の項目の子メニューを左へ開く
 *    （画面の右端からはみ出さないため）。最後にログアウトを足すと、元の「最後から3つ目」が4つ目にずれて、
 *    その子メニューが右へ開き、画面からはみ出す。
 *    ログアウトが最後にあるメニューに限って、4つ目にも同じ指定を足す（:has() を読めない古いブラウザでは今までどおり）。
 *    ログアウトはログイン中にしか出ないので、この CSS もログイン中で、ヘッダーに足す設定のときだけ出す。
 *    その CSS（style_header_sub_menu・functions/css_js_set/front.php が優先度 10 で読む）のすぐ後ろに添える。
 *    子テーマなどがそれを外しているページでは、補正も要らないので何もしない。
 * ------------------------------------------------------------- */
add_action( 'wp_enqueue_scripts', 'lw_membership_logout_menu_enqueue', 20 );
function lw_membership_logout_menu_enqueue() {

	if ( ! is_user_logged_in() || ! in_array( 'header', lw_membership_logout_menu_areas(), true ) ) {
		return;
	}

	if ( ! wp_style_is( 'style_header_sub_menu', 'enqueued' ) ) {
		return;
	}

	$menu = '.header_menu_pc:has(> li.lw_menu_logout:last-child) > li:nth-last-of-type(4) > ul';

	wp_add_inline_style(
		'style_header_sub_menu',
		"{$menu}{left:initial;right:-20px;}{$menu} ul{padding:0;left:initial;right:100%;}"
	);
}
