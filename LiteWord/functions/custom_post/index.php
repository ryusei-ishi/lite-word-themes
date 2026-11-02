<?php
if ( !defined( 'ABSPATH' ) ) exit;
//投稿メタの守り（標準のカスタムフィールド・XML-RPC から書けなくする・出すときの確かめ。表側でも使うので最初に読む。2026-11-02 再チェック R1）
get_template_part('./functions/custom_post/meta_guard');
//出力用関数
get_template_part('./functions/custom_post/function_put');
get_template_part('./functions/custom_post/page_template_arr/index');
get_template_part('./functions/custom_post/custom_code');
add_action( 'init', function () {
// 抜粋を固定ページで使えるようにする
if ( ! post_type_supports( 'page', 'excerpt' ) ) {
		add_post_type_support( 'page', 'excerpt' );
	}
} );
if (is_admin()) {
    //インプット用関数
    get_template_part('./functions/custom_post/function_input');
    //投稿ページ
    get_template_part('./functions/custom_post/post');
    //固定ページ
    get_template_part('./functions/custom_post/page');
    get_template_part('./functions/custom_post/page_template_popup');
    //共通の設定
    get_template_part('./functions/custom_post/common');
    //ブロックの配列
    get_template_part('./functions/custom_post/lw_block_arr');

}
