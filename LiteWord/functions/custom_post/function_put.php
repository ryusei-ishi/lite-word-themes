<?php
if ( !defined( 'ABSPATH' ) ) exit;
//put_text(出力先の処理)
function Lw_put_text($value,$ex = "",$page_id = ""){
    if (is_admin() ){return;}
    if(empty($page_id)){
        $page_id = get_the_ID();
    }

    // オブジェクトキャッシュを使用してパフォーマンスを向上
    $cache_key = 'lw_put_text_' . $page_id . '_' . $value;
    $cache_group = 'lw_post_meta';

    $cached_value = wp_cache_get($cache_key, $cache_group);
    if ($cached_value !== false) {
        return $cached_value === '__EMPTY__' ? $ex : $cached_value;
    }

    $put_text = get_post_meta($page_id,$value,true);

    // 空の値も含めてキャッシュ（再クエリを防ぐため）
    $cache_value = !empty($put_text) ? $put_text : '__EMPTY__';
    wp_cache_set($cache_key, $cache_value, $cache_group, 3600); // 1時間キャッシュ

    if (!empty($put_text)) {
        return $put_text;
    }else{
        return $ex;
    }
}
//put_color(出力先の処理)
function Lw_put_color($value, $ex = "#ada993", $page_id = "" ,$df = "") {
    if (is_admin()) { return; }

    if (empty($page_id)) {
        $page_id = get_the_ID();
    }

    // オブジェクトキャッシュを使用してパフォーマンスを向上
    $cache_key = 'lw_put_color_' . $page_id . '_' . $value;
    $cache_group = 'lw_post_meta';

    $cached_value = wp_cache_get($cache_key, $cache_group);
    if ($cached_value !== false) {
        if ($cached_value === "" || $cached_value === "#ada993") {
            return $df;
        }
        return $cached_value;
    }

    $put_color = get_post_meta($page_id, $value, true);

    // キャッシュに保存
    wp_cache_set($cache_key, $put_color, $cache_group, 3600); // 1時間キャッシュ

    if ($put_color === "" || $put_color === "#ada993") {
        return $df;
    }

    return $put_color;
}

//put_range（出力先の処理）
function Lw_put_range($value, $ex = "16", $page_id = "") {
    if (is_admin()) { return; }

    if (empty($page_id)) {
        $page_id = get_the_ID();
    }

    // オブジェクトキャッシュを使用してパフォーマンスを向上
    $cache_key = 'lw_put_range_' . $page_id . '_' . $value;
    $cache_group = 'lw_post_meta';

    $cached_value = wp_cache_get($cache_key, $cache_group);
    if ($cached_value !== false) {
        if ($cached_value !== "" && $cached_value !== "100") {
            return $cached_value;
        }
        return $ex;
    }

    $put_range = get_post_meta($page_id, $value, true);

    // キャッシュに保存
    wp_cache_set($cache_key, $put_range, $cache_group, 3600); // 1時間キャッシュ

    if ($put_range !== "" && $put_range !== "100") {
        return $put_range;
    }

    return $ex;
}

// 投稿が更新された時にキャッシュをクリアする
function lw_clear_post_meta_cache($post_id) {
    // wp_cache_delete_group()は標準関数ではないため、
    // キャッシュは1時間で自動的に期限切れになります
    // 即座にクリアが必要な場合は、投稿IDを使って個別削除も可能

    // オプション：よく使われるメタキーのキャッシュを個別削除
    $common_meta_keys = [
        'color_main', 'color_sub', 'color_accent',
        'color_page_bg_pc', 'color_page_bg_sp',
        'color_content_bg_pc', 'color_content_bg_sp',
        'color_1', 'color_2', 'color_3', 'color_text',
        'max_width_clm_1', 'font_body', 'font_body_weight',
        'font_size_pc', 'font_size_tb', 'font_size_sp',
        'loading_anime_page_switch', 'page_title_display'
    ];

    foreach ($common_meta_keys as $key) {
        wp_cache_delete('lw_put_text_' . $post_id . '_' . $key, 'lw_post_meta');
        wp_cache_delete('lw_put_color_' . $post_id . '_' . $key, 'lw_post_meta');
        wp_cache_delete('lw_put_range_' . $post_id . '_' . $key, 'lw_post_meta');
    }

    // CSS・フォント設定のトランジェントも削除
    global $wpdb;
    $wpdb->query($wpdb->prepare(
        "DELETE FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
        '_transient_lw_css_vars_' . $post_id . '_%',
        '_transient_lw_font_sets_' . $post_id . '_%'
    ));
}
add_action('save_post', 'lw_clear_post_meta_cache');
add_action('deleted_post', 'lw_clear_post_meta_cache');
