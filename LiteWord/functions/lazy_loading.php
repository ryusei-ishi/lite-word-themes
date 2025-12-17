<?php
if ( !defined( 'ABSPATH' ) ) exit;

function add_lazy_loading_to_content_images($content) {
    // 投稿コンテンツ内のすべての画像タグを対象に正規表現で置換
    $content = preg_replace_callback(
        '/<img(.*?)>/i',
        function($matches) {
            // すでにloading属性がない場合のみ追加
            if (strpos($matches[1], 'loading=') === false) {
                return '<img' . $matches[1] . ' loading="lazy">';
            }
            return $matches[0];
        },
        $content
    );
    return $content;
}

// 投稿コンテンツに適用
add_filter('the_content', 'add_lazy_loading_to_content_images');

// ウィジェット内の画像に適用
add_filter('widget_text', 'add_lazy_loading_to_content_images');
add_filter('widget_text_content', 'add_lazy_loading_to_content_images');

