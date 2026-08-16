<?php
/**
 * 会員限定ページのログイン画面 ― デザインパターンの振り分け
 *
 * 実体は templates/membership/login/{ptn_*}/index.php。
 * どれを使うかはカスタマイザー「会員限定ページ設定 > ログイン画面のデザイン」。
 * （templates/post_fv/index.php と同じ考え方）
 *
 * ⚠️ get_template_part() は呼び出し元のローカル変数を渡さない。
 *    表示に必要な値（理由・戻り先URL・失敗フラグ）は各ファイルが自分で取る。
 *      理由     … lw_membership_block()
 *      戻り先   … lw_membership_current_url()
 *      失敗判定 … $_GET['lw_login'] === 'failed'
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/* ---------- 使うパターンを決める ---------- */
$lw_ptn = Lw_theme_mod_set( 'lw_membership_login_ptn', 'ptn_1' );

// 🚨 テーマMODの値をそのままパスに使わない（念のためのパストラバーサル対策）
$lw_ptn = preg_replace( '/[^a-z0-9_]/', '', (string) $lw_ptn );

// 存在しないパターンが入っていたらカード型に戻す
// （ディレクトリの有無で見ているので、パターンを増やすときはここを直さなくてよい）
if ( $lw_ptn === '' || ! file_exists( get_theme_file_path( "/templates/membership/login/{$lw_ptn}/index.php" ) ) ) {
    $lw_ptn = 'ptn_1';
}

/* ---------- そのパターンのCSSだけ読む ---------- */
wp_enqueue_style(
    "lw_member_login_{$lw_ptn}_style",
    get_theme_file_uri( "/templates/membership/login/{$lw_ptn}/style.css" ),
    array(),
    css_version(),
    'all'
);

get_template_part( "templates/membership/login/{$lw_ptn}/index" );
