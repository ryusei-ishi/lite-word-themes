<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* -------------------------------------------
CSSとJavaScriptを読み込む
自由にカスタマイズしてください
-------------------------------------------*/
function liteword_child_enqueue_assets() {
    // 子テーマのCSSを読み込む
    wp_enqueue_style(
        'liteword-child-custom-style', // ハンドル名（ユニークな名前）
        get_stylesheet_directory_uri() . '/assets/css/custom-style.css', // ファイルのパス
        array(), // 依存関係
        '1.0', // バージョン番号
        'all' // メディアタイプ
    );

    // 子テーマのJavaScriptを読み込む
    wp_enqueue_script(
        'liteword-child-custom-script', // ハンドル名
        get_stylesheet_directory_uri() . '/assets/js/custom-script.js', // ファイルのパス
        array('jquery'), // 依存関係（例: jQuery）
        '1.0', // バージョン番号
        true // フッターで読み込む
    );
}
add_action('wp_enqueue_scripts', 'liteword_child_enqueue_assets');
/* -------------------------------------------
ここより下には、自由に関数等を追加してください
-------------------------------------------*/