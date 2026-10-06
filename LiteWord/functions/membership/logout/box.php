<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員用のログアウト：会員限定ページの中
 *
 * 会員限定のページ（投稿・固定ページ・カテゴリーの一覧）を、ログインして見られているときだけ、
 * 本文の下（または上）に「ログイン中です」とログアウトのボタンを出す。
 * 見られない人には出ない（ログイン画面・閲覧できません・一時停止中の画面にテンプレートごと差し替わる）。
 *
 * 置き場所は、テーマのテンプレート（single.php・page.php・index.php）が
 * lw_membership_logout_box( 'top' ) ／ lw_membership_logout_box( 'bottom' ) を呼んで決めている。
 * 子テーマでそれらのテンプレートを上書きしているときは、同じ呼び出しを足せば出る。
 * 見た目 → templates/membership/logout/（style.scss が正本・style.css は書き出したもの）
 * =============================================================== */

/**
 * いま見ているページに、ログアウトのボタンを出すか
 *
 * 会員限定で（閲覧権限が付いていて）、いまの人がそのページを見られるときだけ。
 * 「どのページが会員限定か」は restrict_front.php と同じ関数で決める（守る側と食い違わせない）。
 *
 * @return bool
 */
function lw_membership_logout_box_visible() {

	if ( ! is_user_logged_in() || lw_membership_logout_box_position() === '' ) {
		return false;
	}

	$allowed_roles = function_exists( 'lw_membership_queried_allowed_roles' ) ? lw_membership_queried_allowed_roles() : false;

	// 配列でないもの（対象外の false・壊れたキャッシュ）と空の配列（会員限定でない）には出さない
	return is_array( $allowed_roles ) && $allowed_roles && lw_check_view_permission( $allowed_roles ) === '';
}

/**
 * テンプレートから呼ぶ：ログアウトのボタンを出す
 *
 * カスタマイザーの設定と場所が合うときだけ出す（「上と下の両方」ならどちらでも）。
 *
 * @param string $position 'top'＝本文の上 ／ 'bottom'＝本文の下
 * @return void
 */
function lw_membership_logout_box( $position ) {

	if ( ! in_array( $position, [ 'top', 'bottom' ], true ) ) {
		return;
	}

	$setting = lw_membership_logout_box_position();
	if ( $setting !== 'both' && $setting !== $position ) {
		return;
	}

	if ( ! lw_membership_logout_box_visible() ) {
		return;
	}

	lw_membership_logout_keep_out_of_cache();

	get_template_part(
		'templates/membership/logout/index',
		null,
		[
			'position' => $position,
			'wide'     => lw_membership_logout_box_is_wide(),
		]
	);
}

/**
 * 本文の枠（左右の余白）の外に置くか
 *
 * カテゴリーの一覧には本文の枠が無い。固定ページ（page.php）で「左右の余白」を OFF にしたページも余白が無い
 * （functions/css_js_set/index.php が .post_style.page の余白を 0 にする）。
 * そのときはボタンの側で幅を決める（templates/membership/logout/ の type_wide）。
 *
 * @return bool
 */
function lw_membership_logout_box_is_wide() {

	if ( is_category() ) {
		return true;
	}

	return is_page()
		&& ! is_page_template( 'single.php' )
		&& get_post_meta( get_queried_object_id(), 'padding_lr_set', true ) === 'off';
}

/* ---------------------------------------------------------------
 * 見た目の CSS は、ボタンを出すページでだけ読む（<head> で読むので、出た瞬間に崩れて見えない）
 * 優先度 20 … テーマの CSS（functions/css_js_set/front.php・既定の 10）より後ろに出す。
 *            会員まわりはテーマの CSS より先に読み込まれるので、既定のままだと前に出てしまう
 * ------------------------------------------------------------- */
add_action( 'wp_enqueue_scripts', 'lw_membership_logout_enqueue', 20 );
function lw_membership_logout_enqueue() {

	if ( ! lw_membership_logout_box_visible() ) {
		return;
	}

	wp_enqueue_style(
		'lw_member_logout_style',
		get_theme_file_uri( '/templates/membership/logout/style.css' ),
		array(),
		css_version(),
		'all'
	);
}
