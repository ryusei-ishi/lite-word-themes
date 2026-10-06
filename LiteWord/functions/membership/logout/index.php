<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員用のログアウト（会員限定ページの中＋メニュー）
 *
 * ログインしている人にだけ「ログアウト」を出す。出す場所は2つで、どちらも既定は出さない。
 *   ① 会員限定ページの中 … 本文の下・上・両方（box.php ＋ templates/membership/logout/）
 *   ② メニュー           … PC のヘッダー・スマホのメニューの最後に1項目（menu.php）
 * 押すと確認画面を出さずにログアウトし、カスタマイザーで選んだ固定ページ（既定はトップページ）に戻る。
 *
 * 設定 → カスタマイザー「会員限定ページ設定」（functions/customizer/membership.php）
 * 仕様 → sl_management/knowledge/products/liteword/doc/specs/membership-logout.md
 * =============================================================== */

// 設定の読み取り。カスタマイザーの選択肢作り（管理画面）でも使うので常に読む
get_template_part( './functions/membership/logout/settings' );

// 出すのはサイトの表側だけ（カスタマイザーのプレビューも表側）
if ( ! is_admin() ) {
	get_template_part( './functions/membership/logout/menu' );
	get_template_part( './functions/membership/logout/box' );
}
