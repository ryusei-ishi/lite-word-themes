<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：CSS と JavaScript の読み込み
 *
 * ショートコードの中で wp_enqueue_style() を呼ぶと wp_head() を
 * 過ぎているためフッターに出て、一瞬だけ素の見た目が見える。
 * そこで「そのページにショートコードがあるか」を先に調べて、
 * wp_enqueue_scripts（wp_head の前）で読んでおく。
 *
 * ⚠️ ショートコードの ptn 属性でカスタマイザーと違うデザインを
 *    指定した場合だけは、ここで先読みできない（属性はまだ読めない）。
 *    そのときは表示側 templates/membership/register/index.php が
 *    自分で読む。ハンドル名が同じなら二重には読まれない。
 * =============================================================== */

add_action( 'wp_enqueue_scripts', 'lw_member_register_enqueue' );

/**
 * 会員登録フォームのあるページで CSS・JS を読む
 *
 * @return void
 */
function lw_member_register_enqueue() {

	if ( ! lw_member_register_page_has_form() ) {
		return;
	}

	/* 🚨 受け付けていないときは何も読まない。
	 *    ショートコードだけ先に貼って公開を待っているページで、
	 *    CSS と Google の reCAPTCHA を読み込むのは無駄なうえ、
	 *    訪問者の通信が外部に飛ぶ。
	 *    管理者には案内文を出すので、CSS だけは読む。 */
	if ( ! lw_member_register_enabled() ) {
		if ( current_user_can( 'manage_options' ) ) {
			lw_member_register_enqueue_style( lw_member_register_ptn() );
		}
		return;
	}

	lw_member_register_enqueue_style( lw_member_register_ptn() );
	lw_member_register_enqueue_recaptcha();
}

/**
 * いま表示しているページに会員登録フォームがあるか
 *
 * @return bool
 */
function lw_member_register_page_has_form() {

	if ( ! is_singular() ) {
		return false;
	}

	$post = get_post();

	return $post && has_shortcode( (string) $post->post_content, 'lw_member_register' );
}

/**
 * デザインパターンの CSS を読む
 *
 * @param string $ptn 検証済みのパターン名
 * @return void
 */
function lw_member_register_enqueue_style( $ptn ) {

	wp_enqueue_style(
		"lw_member_register_{$ptn}_style",
		get_theme_file_uri( "/templates/membership/register/{$ptn}/style.css" ),
		[],
		css_version(),
		'all'
	);
}

/**
 * reCAPTCHA v3（設定されているサイトだけ）
 *
 * 🚨 トークンは発行から2分ほどで切れる。会員登録は入力に時間がかかるので、
 *    ページを開いた時点ではなく「送信ボタンを押した瞬間」に取り直す。
 *    （メールフォーム側は読み込み時に1回取る作りなので、そこは真似ていない）
 *
 * @return void
 */
function lw_member_register_enqueue_recaptcha() {

	if ( ! lw_member_register_can_use_recaptcha() ) {
		return;
	}

	$site_key = get_option( 'lw_form_recaptcha_site_key', '' );
	$handle   = 'lw-recaptcha-v3-register';

	wp_enqueue_script(
		$handle,
		'https://www.google.com/recaptcha/api.js?render=' . rawurlencode( $site_key ),
		[],
		null,
		true
	);

	$key_js = wp_json_encode( $site_key );

	wp_add_inline_script( $handle, <<<JS
document.addEventListener('DOMContentLoaded', function () {
	if (typeof grecaptcha === 'undefined') { return; }

	document.querySelectorAll('form.lw_member_register_form').forEach(function (form) {
		form.addEventListener('submit', function (event) {

			// 2回目（トークンを入れ終わってからの送信）はそのまま通す
			if (form.dataset.lwRecaptchaDone === '1') { return; }
			event.preventDefault();

			grecaptcha.ready(function () {
				grecaptcha.execute({$key_js}, { action: 'register' }).then(function (token) {
					var input = form.querySelector('input[name="g-recaptcha-response"]');
					if (!input) {
						input = document.createElement('input');
						input.type = 'hidden';
						input.name = 'g-recaptcha-response';
						form.appendChild(input);
					}
					input.value = token;
					form.dataset.lwRecaptchaDone = '1';
					form.submit();
				});
			});
		});
	});
});
JS
	, 'after' );
}
