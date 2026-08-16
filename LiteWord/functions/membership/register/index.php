<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録
 *
 * 固定ページにショートコード [lw_member_register] を置いて使う。
 * 見た目は templates/membership/register/ptn_* から選ぶ。
 *
 * ファイルの分担
 * 🚨 登録は2段階。フォームを送信しただけでは wp_users に1行も作らない。
 *    メールで送った6桁の番号が合って初めてユーザーができる
 *    （迷惑登録でユーザー一覧が埋まらないようにするため）。
 *
 * ファイルの分担
 *   settings.php      … カスタマイザーの設定を読む（管理画面でも使う）
 *   role.php          … 登録した人に付ける権限
 *   spam.php          … ハニーポット・連投の制限
 *   recaptcha.php     … reCAPTCHA v3（メールフォームの設定を使い回す・任意）
 *   validate.php      … 1段目（お名前・メール等）の確認
 *   pending.php       … 仮登録と認証番号（transient）
 *   mail.php          … 認証番号のメール
 *   validate_code.php … 2段目（番号・パスワード）の確認
 *   fields.php        … プロフィール項目
 *   handler.php       … 受け口（template_redirect で POST を受ける）
 *   create.php        … ユーザーを作る（番号が合ったときだけ）
 *   view.php          … 表示側で使う小道具（どの画面を出すか・エラー文）
 *   assets.php        … CSS・JS の読み込み
 *
 * 仕様 → sl_management/knowledge/products/liteword/doc/specs/membership-restriction.md
 * =============================================================== */

/* 設定と権限だけは管理画面（カスタマイザーの選択肢作り）でも使う */
get_template_part( './functions/membership/register/settings' );
get_template_part( './functions/membership/register/role' );

if ( ! is_admin() ) {

	get_template_part( './functions/membership/register/spam' );
	get_template_part( './functions/membership/register/recaptcha' );
	get_template_part( './functions/membership/register/validate' );
	get_template_part( './functions/membership/register/pending' );
	get_template_part( './functions/membership/register/mail' );
	get_template_part( './functions/membership/register/validate_code' );
	get_template_part( './functions/membership/register/fields' );
	get_template_part( './functions/membership/register/handler' );
	get_template_part( './functions/membership/register/create' );
	get_template_part( './functions/membership/register/view' );
	get_template_part( './functions/membership/register/assets' );

	add_shortcode( 'lw_member_register', 'lw_member_register_shortcode' );
}

/**
 * ショートコード [lw_member_register]
 *
 * 属性
 *   ptn … デザインを1か所だけ変えたいときに指定する（例: ptn="ptn_2"）。
 *         省略するとカスタマイザーの設定を使う。
 *
 * 🚨 付ける権限をショートコードの属性で変えられるようにはしない。
 *    記事を書ける人なら誰でも「管理者になれる登録フォーム」を
 *    作れてしまうため。権限はカスタマイザー（管理者だけ）で決める。
 *
 * @param array $atts
 * @return string
 */
function lw_member_register_shortcode( $atts ) {

	$atts = shortcode_atts( [ 'ptn' => '' ], $atts, 'lw_member_register' );

	lw_member_register_ptn_override( $atts['ptn'] );

	ob_start();
	get_template_part( 'templates/membership/register/index' );
	$html = ob_get_clean();

	// 同じページに2つ置かれたときに前の指定が残らないよう戻す
	lw_member_register_ptn_override( '' );

	return $html;
}
