<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：送られてきた内容の確認
 *
 * ここを通らないと1人もユーザーは作られない。
 * 「入口の門番」なので、判定はすべてサーバー側で行うこと。
 * 画面（HTML）の required や maxlength は親切のためだけで、
 * 制限にはならない。
 *
 * いたずら送信への備え（ハニーポット・回数制限・reCAPTCHA）→ spam.php
 * =============================================================== */

/**
 * POST された内容を確かめる
 *
 * エラーは1つの WP_Error にまとめて返す。画面では全部並べて出したいので、
 * 最初の1件で打ち切らない（ただし門前払いの3つだけは即返す）。
 *
 * @return array|WP_Error 通れば ['login'=>, 'email'=>, 'name'=>]
 */
function lw_member_register_validate() {

	/* ---------- 門前払い（ここは1件でも駄目なら即終了） ---------- */

	if ( ! lw_member_register_enabled() ) {
		return new WP_Error( 'lw_register_off', '現在、会員登録を受け付けていません。' );
	}

	if ( is_user_logged_in() ) {
		return new WP_Error( 'lw_register_logged_in', 'すでにログインしています。' );
	}

	// 🚨 nonce。フォーム以外から投げられた POST をここで落とす
	$nonce = isset( $_POST['lw_member_register_nonce'] ) ? (string) wp_unslash( $_POST['lw_member_register_nonce'] ) : '';
	if ( ! wp_verify_nonce( $nonce, 'lw_member_register' ) ) {
		return new WP_Error( 'lw_register_nonce', 'ページを開いてから時間が経っています。もう一度お試しください。' );
	}

	// ハニーポット。人には見えない欄が埋まっている＝ボット
	if ( lw_member_register_honeypot_filled() ) {
		return new WP_Error( 'lw_register_bot', '送信内容を確認できませんでした。' );
	}

	$rate = lw_member_register_rate_ok();
	if ( is_wp_error( $rate ) ) {
		return $rate;
	}

	// ここから先は1回分として数える（失敗しても数える）
	lw_member_register_count_submission();

	$recaptcha = lw_member_register_recaptcha_ok();
	if ( is_wp_error( $recaptcha ) ) {
		return $recaptcha;
	}

	/* ---------- 入力内容（まとめて確認する） ---------- */

	$errors = new WP_Error();
	$values = lw_member_register_posted_values();

	/* メールアドレス */
	if ( $values['email'] === '' ) {
		$errors->add( 'email', 'メールアドレスを入力してください。' );
	} elseif ( ! is_email( $values['email'] ) ) {
		$errors->add( 'email', 'メールアドレスの形式が正しくありません。' );
	} elseif ( email_exists( $values['email'] ) ) {
		$errors->add( 'email', 'このメールアドレスはすでに登録されています。' );
	}

	/* お名前 */
	if ( lw_member_register_ask_name() && $values['name'] === '' ) {
		$errors->add( 'name', 'お名前を入力してください。' );
	}

	/* ユーザー名（欄を出しているときだけ。出していなければメールから作る） */
	if ( lw_member_register_ask_login() ) {
		if ( $values['login'] === '' ) {
			$errors->add( 'login', 'ユーザー名を入力してください。' );
		} elseif ( ! validate_username( $values['login'] ) ) {
			$errors->add( 'login', 'ユーザー名に使えない文字が含まれています。' );
		} elseif ( username_exists( $values['login'] ) ) {
			$errors->add( 'login', 'このユーザー名はすでに使われています。' );
		}
	}

	/* 同意チェック */
	if ( lw_member_register_ask_consent() && empty( $_POST['lw_reg_consent'] ) ) {
		$errors->add( 'consent', '内容をご確認のうえ、同意にチェックを入れてください。' );
	}

	if ( $errors->has_errors() ) {
		return $errors;
	}

	/* 欄を出していないときは、メールアドレスからユーザー名を作る */
	if ( $values['login'] === '' ) {
		$values['login'] = lw_member_register_build_login( $values['email'] );
	}

	/* 他のプラグインの登録チェックも通す
	 * 🚨 WordPress 標準の register_new_user() が使うフィルタと同じもの。
	 *    LiteWord は自分でユーザーを作る（番号認証のあとに作るため）ので、
	 *    ここで明示的に呼ばないと、登録を制限するプラグインが素通りになる。 */
	$plugin_errors = apply_filters( 'registration_errors', new WP_Error(), $values['login'], $values['email'] );
	if ( is_wp_error( $plugin_errors ) && $plugin_errors->has_errors() ) {
		return $plugin_errors;
	}

	return $values;
}

/**
 * POST された値を取り出して整える
 *
 * エラーで戻したときの再表示にも使うので、検証とは分けている。
 *
 * @return array
 */
function lw_member_register_posted_values() {

	$get = function ( $key ) {
		return isset( $_POST[ $key ] ) ? trim( sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) ) : '';
	};

	return [
		'email' => $get( 'lw_reg_email' ),
		'name'  => $get( 'lw_reg_name' ),
		'login' => lw_member_register_ask_login() ? $get( 'lw_reg_login' ) : '',
	];
}

/**
 * メールアドレスからユーザー名を作る
 *
 * ユーザー名欄を出していないとき用。
 * ⚠️ ユーザー名は WordPress の作りとして外から見えることがある。
 *    メールの「@より前」だけを使い、ドメインは使わない。
 * ⚠️ 会員はメールアドレスでもログインできる（WordPress 標準）。
 *    なので自動で作った名前を本人が覚える必要はない。
 *
 * @param string $email
 * @return string
 */
function lw_member_register_build_login( $email ) {

	$local = (string) strstr( $email, '@', true );
	$base  = strtolower( sanitize_user( $local, true ) );
	$base  = trim( $base, '._-' );

	if ( strlen( $base ) < 3 ) {
		$base = 'member';
	}
	if ( strlen( $base ) > 40 ) {
		$base = substr( $base, 0, 40 );
	}

	$login = $base;

	for ( $i = 2; $i <= 50; $i++ ) {
		if ( ! username_exists( $login ) && validate_username( $login ) ) {
			return $login;
		}
		$login = $base . '_' . $i;
	}

	// ここまで来ることはまず無いが、無限に粘らず乱数で決着させる
	return $base . '_' . strtolower( wp_generate_password( 8, false ) );
}
