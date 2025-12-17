<?php
if ( !defined( 'ABSPATH' ) ) exit;
// head内のカスタムコード出力
function lw_output_custom_head_code() {
    if (!is_singular()) return;

    global $post;
    $custom_head = get_post_meta($post->ID, 'seo_custom_head', true);

    if (!empty($custom_head)) {
        echo "\n<!-- ▼ カスタムheadコード（seo_custom_head） -->\n";
        echo $custom_head . "\n";
        echo "<!-- ▲ カスタムheadコード -->\n";
    }
}
add_action('wp_head', 'lw_output_custom_head_code', 99);


// フッター手前に出力するカスタムコード
function lw_output_custom_footer_code() {
    if (!is_singular()) return;

    global $post;
    $custom_footer = get_post_meta($post->ID, 'seo_custom_footer', true);

    if (!empty($custom_footer)) {
        echo "\n<!-- ▼ カスタムfooterコード（seo_custom_footer） -->\n";
        echo $custom_footer . "\n";
        echo "<!-- ▲ カスタムfooterコード -->\n";
    }
}
add_action('wp_footer', 'lw_output_custom_footer_code', 99);