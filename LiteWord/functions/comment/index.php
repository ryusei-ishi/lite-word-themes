<?php
/* ----------------------------------------
 * テーマ初期化：HTML5 コメントマークアップ対応
 * -------------------------------------- */
function mytheme_setup() {
    // 既に書いてある場合は重複不可
    add_theme_support( 'html5', [ 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'style', 'script' ] );
}
add_action( 'after_setup_theme', 'mytheme_setup' );

/* ----------------------------------------
 * スレッドコメント用 JS（comment-reply.js）読込
 * -------------------------------------- */
function mytheme_enqueue_comment_reply() {
    if ( is_singular()               // 投稿 or 固定ページ
         && comments_open()          // コメント受付中
         && get_option( 'thread_comments' ) // 管理画面「ディスカッション設定」で有効
    ) {
        wp_enqueue_script( 'comment-reply' ); // WordPress 同梱スクリプト
    }
}
add_action( 'wp_enqueue_scripts', 'mytheme_enqueue_comment_reply' );
