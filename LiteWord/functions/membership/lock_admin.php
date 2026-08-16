<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員を管理画面から締め出す
 *
 * 会員登録した人（購読者など）に対して
 *   ① フロントの管理バー（上の黒いバー）を出さない
 *   ② /wp-admin/ を開いてもトップページに戻す
 *
 * 会員サイトの「会員」に WordPress の管理画面を見せる理由は無く、
 * 見えていると「押したら怒られる」画面になって不親切なので、
 * 既定でONにしている。
 *
 * 誰を締め出すか＝**記事を書けない人**（`edit_posts` を持たない人）。
 * 購読者と、購読者ベースで作ったカスタムロールが該当する。
 * 寄稿者・投稿者・編集者は記事を書くために管理画面が要るので対象外。
 *
 * ⚠️ パスワードの変更は塞がらない。`wp-login.php`（「パスワードをお忘れの方」
 *    → メールのリンク → 新しいパスワードを設定）は wp-admin の外にあるため。
 *
 * 設定 → カスタマイザー「会員限定ページ設定 > 会員を管理画面に入れない」
 * =============================================================== */

/**
 * この機能を使うか（既定ON）
 *
 * @return bool
 */
function lw_membership_lock_admin_enabled() {
	return Lw_theme_mod_set( 'lw_membership_lock_admin', '' ) !== 'off';
}

/**
 * いまのユーザーを管理画面から締め出すか
 *
 * @return bool
 */
function lw_membership_is_locked_out() {

	if ( ! is_user_logged_in() || ! lw_membership_lock_admin_enabled() ) {
		return false;
	}

	// 記事を書けない人＝会員とみなす（管理者・編集者・投稿者・寄稿者は対象外）
	return ! current_user_can( 'edit_posts' );
}

/* ---------------------------------------------------------------
 * ① フロントの管理バーを出さない
 * ------------------------------------------------------------- */

add_filter( 'show_admin_bar', 'lw_membership_hide_admin_bar' );

/**
 * @param bool $show
 * @return bool
 */
function lw_membership_hide_admin_bar( $show ) {
	return lw_membership_is_locked_out() ? false : $show;
}

/* ---------------------------------------------------------------
 * ② 管理画面を開かせない
 * ------------------------------------------------------------- */

add_action( 'admin_init', 'lw_membership_block_admin_access' );

/**
 * 会員が /wp-admin/ を開いたらトップページへ戻す
 *
 * 🚨 admin-ajax.php と admin-post.php は止めないこと。
 *    どちらも「管理画面のファイル」だが、フロントから呼ばれる窓口でもある。
 *    メールフォームの送信・AIチャット・他プラグインの機能が全部死ぬ。
 *    この2つは、それぞれの処理側で権限を見る作りになっている。
 *
 * @return void
 */
function lw_membership_block_admin_access() {

	if ( wp_doing_ajax() ) {
		return;
	}

	$script = isset( $_SERVER['SCRIPT_NAME'] ) ? basename( (string) $_SERVER['SCRIPT_NAME'] ) : '';
	if ( $script === 'admin-ajax.php' || $script === 'admin-post.php' ) {
		return;
	}

	if ( ! lw_membership_is_locked_out() ) {
		return;
	}

	wp_safe_redirect( home_url( '/' ) );
	exit;
}

/* ---------------------------------------------------------------
 * ③ ログイン直後に管理画面へ飛ばさない
 * ------------------------------------------------------------- */

add_filter( 'login_redirect', 'lw_membership_login_redirect', 20, 3 );

/**
 * 会員がログインしたときの行き先をトップページにする
 *
 * WordPress の既定はログイン後 `/wp-admin/`。会員はそこに入れないので、
 * そのままだと「管理画面へ行く → 追い返される」と1往復して見える。
 * パスワードを変えたあとのログインでも必ず通る道なので、ここで直す。
 *
 * ⚠️ 会員限定ページのログインフォームは戻り先にそのページのURLを入れている。
 *    それを潰さないよう、**行き先が管理画面のときだけ**差し替える。
 * ⚠️ current_user_can() はまだ切り替わっていないので user_can() で見る。
 *
 * @param string           $redirect_to
 * @param string           $requested
 * @param WP_User|WP_Error $user
 * @return string
 */
function lw_membership_login_redirect( $redirect_to, $requested, $user ) {

	if ( ! ( $user instanceof WP_User ) || ! lw_membership_lock_admin_enabled() ) {
		return $redirect_to;
	}

	if ( user_can( $user, 'edit_posts' ) ) {
		return $redirect_to;
	}

	if ( $redirect_to === '' || strpos( (string) $redirect_to, admin_url() ) === 0 ) {
		return home_url( '/' );
	}

	return $redirect_to;
}
