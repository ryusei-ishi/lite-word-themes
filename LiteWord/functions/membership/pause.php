<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定ページの一時停止（サービス開始前など）
 *
 * カスタマイザー「会員限定ページ設定 > 会員限定ページを一時停止する」を
 * 「停止中の文言を出す」にすると、会員限定のページ（投稿・固定ページ・カテゴリー一覧）を
 * 開いた人に、ログイン画面の代わりに「停止中の見出し・文言」を出す。
 *
 * 停止中に中身を見られる人は2通りから選ぶ（■ 停止中に中身を見られる人）。
 *   'all'   … 管理者だけ（既定）。ログインしている会員にも停止中の画面を出す
 *   'login' … 管理者と、見る権限のある会員（ログイン画面だけ差し替える）
 *
 * 止めているのは roles.php の lw_check_view_permission()（理由 'paused' を返す）。
 * 判定の関数1か所で止めるので、'all' のときはページだけでなく REST API・RSS・
 * 一覧の抜粋・関連記事・写真 PDF の窓口もそろって止まる。
 * ただし、記事を編集できる人は REST で本文を読める（restrict_api.php・ブロックエディタのため）。
 * 写真 PDF の窓口も、メディアを扱える人（upload_files）には今までどおり渡す（protect_files/serve.php）。
 * 画面は templates/membership/login/ptn_*（'paused' の分岐）。
 *
 * 仕様 → sl_management/knowledge/products/liteword/doc/specs/membership-pause.md
 * =============================================================== */

/**
 * 一時停止の設定を1つ読む
 *
 * 🚨 Lw_theme_mod_set() は使わない。あちらは値を1時間キャッシュしていて、
 *    グループごと消せない永続キャッシュの環境では、保存しても最大1時間ふるい値が返る
 *    （functions/index.php の lw_clear_theme_mods_cache() の保険の一覧に、会員まわりのキーは無い）。
 *    サービスを始める日にスイッチを戻しても1時間ログイン画面が出てこない、とならないよう、
 *    ここは get_theme_mod() を直接読む（保存した直後から新しい値が返る）。
 *
 * @param string $key テーマMODのキー
 * @return string
 */
function lw_membership_pause_setting( $key ) {
	$value = get_theme_mod( $key, '' );
	return is_string( $value ) ? $value : '';
}

/**
 * 一時停止の状態
 *
 * @return string ''      … 停止していない（既定）
 *                'all'   … 停止中。管理者以外は全員止める
 *                'login' … 停止中。ログイン画面だけ差し替える（見る権限のある会員は見られる）
 */
function lw_membership_pause_mode() {

	if ( lw_membership_pause_setting( 'lw_membership_pause' ) !== 'on' ) {
		return '';
	}

	return lw_membership_pause_setting( 'lw_membership_pause_scope' ) === 'login' ? 'login' : 'all';
}

/**
 * 停止中に出す見出し（エスケープ済み）
 *
 * @return string
 */
function lw_membership_pause_title() {

	$title = trim( lw_membership_pause_setting( 'lw_membership_pause_title' ) );

	return esc_html( $title !== '' ? $title : 'サービス開始前です' );
}

/**
 * 停止中に出す文言
 *
 * 改行はそのまま <br> にする。「お知らせはこちら」のようにリンクを張れるよう <a> を許可する
 * （同意チェックの文言 lw_member_register_consent_text() と同じ考え方）。
 * カスタマイザーは保存時に何も落とさないので、表示のたびに wp_kses で絞ってから出す。
 *
 * @return string HTML（許可タグのみ）
 */
function lw_membership_pause_message() {

	$text = trim( lw_membership_pause_setting( 'lw_membership_pause_message' ) );
	if ( $text === '' ) {
		// 1文ずつ、スマホ幅（390px）のカード型でも1行に収まる長さにしてある（長いと「す。」だけ次の行に落ちる）
		$text = "サービスの開始後にご覧いただけます。\n開始まで今しばらくお待ちください。";
	}

	$text = wp_kses(
		$text,
		[
			'a'      => [ 'href' => [], 'target' => [], 'rel' => [] ],
			'br'     => [],
			'strong' => [],
		]
	);

	return nl2br( $text, false );
}

/* ---------------------------------------------------------------
 * 停止中の画面をページキャッシュに残さない
 *
 * 🚨 停止中の画面にはフォームが無い。LiteWord Cache（plugins/lw-cache）は「<form を含むページ」だけ
 *    保存を見送る作りなので（ログイン画面はフォームがあるので保存されなかった）、何もしないと
 *    停止中の画面が静的な HTML として保存され、停止を戻しても未ログインの人に出続ける
 *    （＝サービスを始める日に、会員限定のページからログインできない）。
 *    LiteWord Cache は nocache のヘッダーも DONOTCACHEPAGE も見ず、応答が 200 番台のときだけ保存するので、
 *    保存のための取得（User-Agent: LiteWord-Cache-Generator。全ページ生成・毎日の生成・キャッシュが無いときの
 *    自動生成のどれも同じ）にだけ 503 を返す。ページを開いた人には今までどおり 200 で出す。
 *    DONOTCACHEPAGE は、それを見るほかのキャッシュ系プラグイン向け。
 *    どちらも停止中の画面のときだけ。ログイン画面（停止していないとき）の扱いは変えていない。
 * ------------------------------------------------------------- */
add_action( 'template_redirect', 'lw_membership_pause_keep_out_of_cache', 11 ); // 判定（restrict_front.php・既定の10）の後
function lw_membership_pause_keep_out_of_cache() {

	if ( ! function_exists( 'lw_membership_block' ) || lw_membership_block() !== 'paused' ) {
		return;
	}

	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );
	}

	$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? (string) wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) : '';
	if ( strpos( $ua, 'LiteWord-Cache-Generator' ) !== false ) {
		status_header( 503 );
	}
}
