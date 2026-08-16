<?php
/**
 * 会員登録フォーム ― デザインパターンの振り分け
 *
 * 実体は templates/membership/register/{ptn_*}/index.php。
 * どれを使うかは カスタマイザー「会員限定ページ設定 > 会員登録フォームのデザイン」、
 * またはショートコードの ptn 属性（[lw_member_register ptn="ptn_2"]）。
 * （templates/membership/login/index.php と同じ考え方）
 *
 * ⚠️ get_template_part() は呼び出し元のローカル変数を渡さない。
 *    表示に必要な値は各ファイルが自分で取る。
 *      どの画面を出すか … lw_member_register_view_state()
 *      入力エラー       … lw_member_register_field_error() / lw_member_register_general_errors()
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/* 🚨 受け付けていないときは、訪問者には何も出さない。CSSも読まない。
 *    ここで止めないと、空の <section> がCSSの余白ぶんだけページに残る。
 *    「出すか出さないか」の判断はこの1か所だけ。パターン側は書かない。
 *    原因が分かるよう、管理者にだけは案内を出す（下の各 ptn_* が出す）。 */
if ( lw_member_register_view_state() === 'off' && ! current_user_can( 'manage_options' ) ) {
    return;
}

$lw_ptn = lw_member_register_ptn();

/* CSS は functions/membership/register/assets.php が wp_head の前に読んでいる。
   ショートコードの ptn 属性でそれと違うパターンを指定したときだけ、ここで読む。
   ハンドル名が同じなので二重にはならない。 */
lw_member_register_enqueue_style( $lw_ptn );

get_template_part( "templates/membership/register/{$lw_ptn}/index" );
