<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：設定の読み取り
 *
 * カスタマイザー「会員限定ページ設定」で決めた値を、使う側が毎回
 * 検証しなくていいように、ここで整えてから返す。
 *
 * 🚨 管理画面（カスタマイザーの選択肢作り）とフロント（フォーム表示・
 *    登録処理）の両方から使うので、settings.php と role.php だけは
 *    is_admin() の外で読み込む。
 *
 * 付与するロールまわり → 同じディレクトリの role.php
 * =============================================================== */

/**
 * 会員登録を受け付けるか
 *
 * 既定はOFF。約450サイトに配るテーマなので、更新しただけで
 * 誰でも登録できる状態にはしない。
 *
 * @return bool
 */
function lw_member_register_enabled() {
	return Lw_theme_mod_set( 'lw_membership_register_switch', '' ) === 'on';
}

/* ---------------------------------------------------------------
 * デザインパターン
 * ------------------------------------------------------------- */

/**
 * 会員登録フォームのデザインパターン一覧（カスタマイザーの選択肢）
 *
 * 増やすときは templates/membership/register/{キー}/index.php と
 * style.css も作ること。表示側はディレクトリの有無で見ているので、
 * ここに足すだけで動く。
 *
 * @return array
 */
function lw_member_register_ptn_arr() {
	return [
		'ptn_1' => 'パターン1（カード型）',
		'ptn_2' => 'パターン2（シンプル）',
		'ptn_3' => 'パターン3（横並び）',
	];
}

/**
 * ショートコードの ptn 属性による上書き
 *
 * ⚠️ get_template_part() は呼び出し元のローカル変数を渡さないので、
 *    lw_membership_block() と同じく静的変数で受け渡す。
 *
 * @param string|null $set 設定するとき値を渡す
 * @return string
 */
function lw_member_register_ptn_override( $set = null ) {

	static $ptn = '';

	if ( $set !== null ) {
		$ptn = (string) $set;
	}

	return $ptn;
}

/**
 * 使うデザインパターンを決める
 *
 * 強い順に ショートコードの ptn 属性 → カスタマイザー → ptn_1。
 * 🚨 値をそのままパスに使わないよう記号を落としてから、
 *    ディレクトリの実在も確かめる（パストラバーサル対策）。
 *
 * @return string
 */
function lw_member_register_ptn() {

	$ptn = lw_member_register_ptn_override();
	if ( $ptn === '' ) {
		$ptn = (string) Lw_theme_mod_set( 'lw_membership_register_ptn', 'ptn_1' );
	}

	$ptn = preg_replace( '/[^a-z0-9_]/', '', $ptn );

	if ( $ptn === '' || ! file_exists( get_theme_file_path( "/templates/membership/register/{$ptn}/index.php" ) ) ) {
		$ptn = 'ptn_1';
	}

	return $ptn;
}

/* ---------------------------------------------------------------
 * 会員登録ページ（ショートコードを置いた固定ページ）
 * ------------------------------------------------------------- */

/**
 * カスタマイザーの選択肢用の固定ページ一覧
 *
 * @return array ID => タイトル
 */
function lw_member_register_page_choices() {

	$choices = [ '' => '未選択' ];

	foreach ( get_pages( [ 'sort_column' => 'menu_order,post_title' ] ) as $page ) {
		$choices[ (string) $page->ID ] = $page->post_title !== '' ? $page->post_title : "（無題 #{$page->ID}）";
	}

	return $choices;
}

/**
 * 会員登録ページのURL
 *
 * ログイン画面の「新規登録はこちら」のリンク先に使う。
 * 未選択・公開されていないページなら空文字（リンクを出さない）。
 *
 * @return string
 */
function lw_member_register_page_url() {

	$page_id = (int) Lw_theme_mod_set( 'lw_membership_register_page', 0 );
	if ( $page_id <= 0 ) {
		return '';
	}

	$page = get_post( $page_id );
	if ( ! $page || $page->post_status !== 'publish' ) {
		return '';
	}

	$url = get_permalink( $page_id );
	return $url ? $url : '';
}

/* ---------------------------------------------------------------
 * 入力してもらう項目
 * ------------------------------------------------------------- */

/** お名前欄を出すか（既定ON） */
function lw_member_register_ask_name() {
	return Lw_theme_mod_set( 'lw_membership_register_name', '' ) !== 'off';
}

/** ユーザー名欄を出すか（既定OFF＝メールアドレスから自動で作る） */
function lw_member_register_ask_login() {
	return Lw_theme_mod_set( 'lw_membership_register_login', '' ) === 'on';
}

/** プロフィール項目も入力してもらうか（既定OFF） */
function lw_member_register_ask_profile() {
	return Lw_theme_mod_set( 'lw_membership_register_profile', '' ) === 'on';
}

/** 同意チェックを出すか（既定OFF） */
function lw_member_register_ask_consent() {
	return Lw_theme_mod_set( 'lw_membership_register_consent', '' ) === 'on';
}

/**
 * 同意チェックの文言
 *
 * 「〜規約に同意します」のようにリンクを張りたいので <a> を許可する。
 * 表示のたびに wp_kses で絞ってから出す。
 *
 * @return string HTML（許可タグのみ）
 */
function lw_member_register_consent_text() {

	$text = (string) Lw_theme_mod_set( 'lw_membership_register_consent_text', '' );
	if ( trim( $text ) === '' ) {
		$text = '個人情報の取り扱いに同意します';
	}

	return wp_kses(
		$text,
		[
			'a'      => [ 'href' => [], 'target' => [], 'rel' => [] ],
			'br'     => [],
			'strong' => [],
			'span'   => [],
		]
	);
}
