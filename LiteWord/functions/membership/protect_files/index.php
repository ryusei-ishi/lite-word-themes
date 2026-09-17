<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員限定の記事に入れた写真・PDF のファイルを守る
 *
 * カスタマイザー「会員限定ページ設定 > 会員限定の記事の写真・PDF を守る」（既定 OFF）
 * 仕様 → sl_management/knowledge/products/liteword/doc/specs/membership-protect-files.md
 * =============================================================== */

get_template_part( './functions/membership/protect_files/paths' );           // 設定と場所
get_template_part( './functions/membership/protect_files/refs' );            // 文字列からファイルへの参照を拾う
get_template_part( './functions/membership/protect_files/parts' );           // 埋め込んだマイパーツ・同期パターンの中身
get_template_part( './functions/membership/protect_files/attachments' );     // メディア1件のファイル
get_template_part( './functions/membership/protect_files/collect' );         // 守るもの・守らないものを決める
get_template_part( './functions/membership/protect_files/member_usage' );    // 会員限定の記事で使っているもの
get_template_part( './functions/membership/protect_files/public_usage' );    // 公開の記事で使っているもの
get_template_part( './functions/membership/protect_files/settings_usage' );  // サイトの設定で使っているもの
get_template_part( './functions/membership/protect_files/markers' );         // 目印ファイルと一覧
get_template_part( './functions/membership/protect_files/rebuild' );         // 作り直し
get_template_part( './functions/membership/protect_files/htaccess' );        // .htaccess のルール
get_template_part( './functions/membership/protect_files/htaccess_edit' );   // .htaccess の中身の書き換え
get_template_part( './functions/membership/protect_files/self_test' );       // 守れているかの点検
get_template_part( './functions/membership/protect_files/state' );           // ON / OFF
get_template_part( './functions/membership/protect_files/related' );         // 変更が守るファイルに関係するか
get_template_part( './functions/membership/protect_files/hooks' );           // いつ動くか
get_template_part( './functions/membership/protect_files/upkeep' );          // 予約の処理・管理画面を開いたときの手入れ

// .htaccess から回ってきたファイルのリクエストだけ（uploads の URL で、目印の印が付いているもの）
if ( isset( $_GET['lw_member_file'] ) && lw_member_files_is_file_request() ) {
	get_template_part( './functions/membership/protect_files/serve' );
	get_template_part( './functions/membership/protect_files/send' );
}

if ( is_admin() ) {
	get_template_part( './functions/membership/protect_files/admin/index' );
}
