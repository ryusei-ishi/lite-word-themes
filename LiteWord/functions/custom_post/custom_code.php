<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * カスタムコード（seo_custom_head・seo_custom_footer）を出してよい形にする。
 *
 * この欄は GA・Meta ピクセルなどの <script> を入れるためのもので、生のまま出す。
 * ただし生の HTML を書いてよいのは unfiltered_html を持つ人（管理者・編集者）だけ（保存の側 custom_post/common.php と同じ境界）。
 * 最後にこの投稿を保存した人（無ければ投稿者）が unfiltered_html を持っていなければ、出すときにも wp_kses_post() を通す。
 * （2026-11-02 再チェック R1）2.6.0 までは、寄稿者が WordPress 標準のカスタムフィールドからこの欄に <script> を入れられ、
 * 管理者がプレビューした画面でそのまま動いた。入口は custom_post/meta_guard.php で閉じたが、それより前に入っていた値もここで止める。
 *
 * @param WP_Post $post
 * @param string  $code
 * @return string
 */
function lw_custom_code_for_output( $post, $code ) {
    $code = (string) $code;
    if ( $code === '' || ! ( $post instanceof WP_Post ) ) {
        return $code;
    }
    $editor_id = (int) get_post_meta( $post->ID, '_edit_last', true );
    if ( $editor_id <= 0 ) {
        $editor_id = (int) $post->post_author;
    }
    if ( $editor_id > 0 && user_can( $editor_id, 'unfiltered_html' ) ) {
        return $code;
    }
    return wp_kses_post( $code );
}

// head内のカスタムコード出力
function lw_output_custom_head_code() {
    if (!is_singular()) return;

    global $post;
    $custom_head = lw_custom_code_for_output( $post, get_post_meta($post->ID, 'seo_custom_head', true) );

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
    $custom_footer = lw_custom_code_for_output( $post, get_post_meta($post->ID, 'seo_custom_footer', true) );

    if (!empty($custom_footer)) {
        echo "\n<!-- ▼ カスタムfooterコード（seo_custom_footer） -->\n";
        echo $custom_footer . "\n";
        echo "<!-- ▲ カスタムfooterコード -->\n";
    }
}
add_action('wp_footer', 'lw_output_custom_footer_code', 99);
