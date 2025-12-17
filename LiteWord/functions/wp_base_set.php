<?php
if ( !defined( 'ABSPATH' ) ) exit;

// WordPress標準機能
function my_setup() {
    add_theme_support( 'title-tag' ); /* タイトルタグ自動生成 */
    add_theme_support( 'html5', array( /* HTML5のタグで出力 */
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'script',
        'style'
    ) );
}
add_action( 'after_setup_theme', 'my_setup' );

// アイキャッチ画像の有効化
add_theme_support( 'post-thumbnails' );

// カスタムロゴの有効化
function theme_setup() {
    add_theme_support('custom-logo');
}
add_action('after_setup_theme', 'theme_setup');

// 404ページにnoindexを追加
add_action( 'wp_head', 'add_noindex_to_404', 1 );
function add_noindex_to_404() {
    if ( is_404() ) {
        echo '<meta name="robots" content="noindex, nofollow">' . "\n";
    }
}

// WordPress 5.7以降のRobots API対応（両方設定しておくと確実）
add_filter( 'wp_robots', 'add_noindex_to_404_robots' );
function add_noindex_to_404_robots( $robots ) {
    if ( is_404() ) {
        $robots['noindex'] = true;
        $robots['nofollow'] = true;
    }
    return $robots;
}