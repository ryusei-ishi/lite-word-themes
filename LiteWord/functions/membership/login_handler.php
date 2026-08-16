<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定ページのログイン画面
 * =============================================================== */

/**
 * 会員限定ページを「閲覧させない」状態にする。
 *
 * @param string|null $reason 'login'  … 未ログイン。ログインフォームを出す
 *                            'denied' … ログイン済みだが権限が足りない。理由を出す
 *                            null     … 現在の状態を取得するだけ
 * @return string 現在の状態（''＝制限なし）
 */
function lw_membership_block( $reason = null ) {
    static $current = '';

    if ( $reason !== null ) {
        $current = $reason;

        // 本文の代わりにログイン画面を出す
        add_filter( 'template_include', 'lw_membership_login_template' );

        // 会員限定ページの中身をキャッシュ・インデックスさせない
        nocache_headers();
        add_filter( 'wp_robots', 'wp_robots_no_robots' );

        /* -----------------------------------------------------------
         * 🚨 本文の流出止め
         * テンプレートを差し替えても、wp_head() で出る構造化データ(JSON-LD)や
         * SEO の meta description に本文の抜粋が入ってしまう。
         * 以前の実装はリダイレクトして exit していたため表面化しなかった。
         * ここを消し忘れると、未ログインでもソースを見れば本文が読める。
         * --------------------------------------------------------- */
        remove_action( 'wp_head', 'output_json_dl' );              // functions/json-ld/index.php
        remove_action( 'wp_head', 'lw_output_seo_meta_tags', 90 ); // functions/seo/head_put.php

        // 保険：他のどこかで本文・抜粋が使われても空にする
        add_filter( 'the_content', '__return_empty_string', 999 );
        add_filter( 'get_the_excerpt', '__return_empty_string', 999 );
        add_filter( 'the_excerpt', '__return_empty_string', 999 );
    }

    return $current;
}

/**
 * いま会員限定でブロックしているページの URL を返す。
 * ログイン後の戻り先・パスワード再発行リンクの戻り先に使う。
 *
 * 🚨 カテゴリー一覧ページでは get_permalink() を使ってはいけない。
 *    get_queried_object_id() が返すのは term ID なので、それを投稿 ID として
 *    渡すと「たまたま同じ ID の投稿」の URL になるか false になる。
 */
function lw_membership_current_url() {

	if ( is_category() ) {
		$link = get_term_link( get_queried_object_id(), 'category' );
		return is_wp_error( $link ) ? home_url( '/' ) : $link;
	}

	$link = get_permalink( get_queried_object_id() );
	return $link ? $link : home_url( '/' );
}

/**
 * 投稿のタイトル部分（FV）を残すか
 *
 * ONなら、投稿のアイキャッチ・タイトル・日付・カテゴリーを出したまま、
 * 本文の位置にログイン画面を出す。本文と抜粋は lw_membership_block() が空にしている。
 *
 * 強い順に  投稿ごとの上書き → カスタマイザーの全体設定。
 * 固定ページとカテゴリー一覧には FV が無いので常に false。
 *
 * @return bool
 */
function lw_membership_keep_post_fv() {

	if ( ! is_singular( 'post' ) ) {
		return false;
	}

	// 投稿ごとの上書き（'' = 全体設定に従う）
	$override = get_post_meta( get_queried_object_id(), '_lw_keep_post_fv', true );
	if ( $override === 'on' ) {
		return true;
	}
	if ( $override === 'off' ) {
		return false;
	}

	return Lw_theme_mod_set( 'lw_membership_keep_post_fv', '' ) === 'on';
}

/**
 * ログイン画面の見出しタグ
 *
 * FV を残しているときは投稿タイトルが h1 なので、ログイン画面側は h2 にする
 * （1ページに h1 が2つ出ないようにするため）。
 *
 * @return string 'h1' or 'h2'
 */
function lw_membership_title_tag() {
	return lw_membership_keep_post_fv() ? 'h2' : 'h1';
}

/**
 * テンプレートを会員限定ページ用のものに差し替える。
 * 子テーマに member-login.php があればそちらが優先される（locate_template）。
 */
function lw_membership_login_template( $template ) {
    $found = locate_template( 'member-login.php' );
    return $found ? $found : $template;
}

/**
 * ログインに失敗したとき、元の会員限定ページに戻してエラーを表示する。
 *
 * ⚠ このテーマのフォームから来た時だけ処理する（hidden の lw_member_login で判定）。
 *   これが無いと wp-login.php や他プラグインのログイン失敗まで巻き込む。
 */
add_action( 'wp_login_failed', 'lw_membership_login_failed' );
function lw_membership_login_failed( $username ) {

    if ( empty( $_POST['lw_member_login'] ) ) {
        return; // 会員限定ページのフォーム以外は一切触らない
    }

    $redirect = isset( $_POST['redirect_to'] ) ? wp_unslash( $_POST['redirect_to'] ) : '';
    $redirect = wp_validate_redirect( $redirect, home_url( '/' ) ); // 外部ドメインへは飛ばさない

    wp_safe_redirect( add_query_arg( 'lw_login', 'failed', remove_query_arg( 'lw_login', $redirect ) ) );
    exit;
}
