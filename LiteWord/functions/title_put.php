<?php
if ( !defined( 'ABSPATH' ) ) exit;

function LwTitlePut() {
    // 背景画像の設定
    $thumbnail = "";
    
    if (is_category()) {
        $title = single_cat_title('', false);
    
        // カテゴリーの情報を取得
        $term = get_queried_object(); // 現在のクエリオブジェクトを取得
        if ($term && isset($term->term_id)) {
            $term_id = $term->term_id;

            // カテゴリーのアイキャッチ画像を取得
            $category_thumbnail_id = get_term_meta($term_id, 'category_thumbnail_id', true);
            if ($category_thumbnail_id) {
                $thumbnail_url = wp_get_attachment_image_url($category_thumbnail_id, 'full');
                if (!empty($thumbnail_url)) {
                    $thumbnail = $thumbnail_url; // アイキャッチ画像が設定されていれば上書き
                }
            }
        } 
    } elseif (is_tag()) {
        $title = single_tag_title('', false);
    } elseif (is_author()) {
        $title = get_the_author();
    } elseif (is_day()) {
        $title = get_the_date();
    } elseif (is_month()) {
        $title = get_the_date('F Y');
    } elseif (is_year()) {
        $title = get_the_date('Y');
    } elseif (is_search()) {
        $title = '検索結果: ' . get_search_query();
    } elseif (is_home() && !is_front_page()) {
        $title = get_the_title(get_option('page_for_posts', true));
    } elseif (is_singular()) {
        $page_id = get_the_ID();
        $thumbnail_url = get_the_post_thumbnail_url($page_id, 'full');
        if (!empty($thumbnail_url)) {
            $thumbnail = $thumbnail_url;
        }
        $title = get_the_title();
        $page_sub_title = get_post_meta($page_id, 'page_sub_title', true);
    } elseif (is_archive() || is_paged()) { // アーカイブページやページネーションがある場合
        $title = "記事一覧";
    } elseif (is_404()) {
        $title = 'ページが見つかりません';
    } else {
        $title = get_bloginfo('name');
    }

    // 初期化していない場合の対策
    if (!isset($page_sub_title)) {
        $page_sub_title = ''; // 空の文字列で初期化
    }

    // カテゴリーの説明を取得
    $category_description = is_category() ? category_description() : '';
    
    // サイトのキャッチフレーズを取得（トップページの時だけ）
    $catchphrase = is_front_page() ? get_bloginfo('description') : '';
    
    return array(
        'title' => $title,
        'category_description' => $category_description,
        'catchphrase' => $catchphrase,
        'thumbnail' => $thumbnail,
        'page_sub_title' => $page_sub_title
    );
}
