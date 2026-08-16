<?php
if ( !defined( 'ABSPATH' ) ) exit;

// 閲覧権限の取得・判定（管理画面／フロントの両方で使う）
get_template_part('./functions/membership/roles');

// 会員登録（ショートコード [lw_member_register]）。中で管理画面／フロントを分けている
get_template_part('./functions/membership/register/index');

// 会員を管理画面から締め出す（管理バーを消す＋wp-adminを開かせない）
// ⚠️ 管理バーはフロント・締め出しは管理画面で効くので、is_admin() の外で読み込む
get_template_part('./functions/membership/lock_admin');

if(is_admin()){
    get_template_part('./functions/membership/restrict_admin');
    // カテゴリー単位の設定（カテゴリー編集画面・一覧の列）
    get_template_part('./functions/membership/restrict_category');
    // 権限（ロール）の名前変更・追加・削除（ユーザーメニュー内）
    get_template_part('./functions/membership/roles_admin/index');
}else{
    get_template_part('./functions/membership/restrict_front');
    // ログイン画面の差し替えとログイン失敗時の処理（wp-login.php でも読み込まれる）
    get_template_part('./functions/membership/login_handler');
}
