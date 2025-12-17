<?php
if ( !defined( 'ABSPATH' ) ) exit;
function register_custom_block_categories($categories, $post) {
    // カスタムカテゴリーを配列で定義
    $custom_categories = array(
        array(
            'slug'  => 'lw-heading',
            'title' => 'LW 見出し・タイトル',
            'icon'  => 'heading',
        ),
        array(
            'slug'  => 'lw-firstview',
            'title' => 'LW ファーストビュー',
            'icon'  => 'format-image',
        ),
        array(
            'slug'  => 'lw-button',
            'title' => 'LW リンクボタン',
            'icon'  => 'button',
        ),
        array(
            'slug'  => 'lw-cta',
            'title' => 'LW CTA・コンバージョン',
            'icon'  => 'megaphone',
        ),
        array(
            'slug'  => 'lw-list',
            'title' => 'LW リスト・一覧',
            'icon'  => 'list-view',
        ),
        array(
            'slug'  => 'lw-post',
            'title' => 'LW 記事一覧・ニュース',
            'icon'  => 'admin-post',
        ),
        array(
            'slug'  => 'lw-contact',
            'title' => 'LW お問い合わせ・フォーム',
            'icon'  => 'email',
        ),
        array(
            'slug'  => 'lw-company',
            'title' => 'LW 会社概要',
            'icon'  => 'building',
        ),
        array(
            'slug'  => 'lw-table',
            'title' => 'LW その他テーブル・表系',
            'icon'  => 'editor-table',
        ),
        array(
            'slug'  => 'lw-media',
            'title' => 'LW 画像・メディア',
            'icon'  => 'format-gallery',
        ),
        array(
            'slug'  => 'lw-banner',
            'title' => 'LW バナー・ギャラリー',
            'icon'  => 'images-alt2',
        ),
        array(
            'slug'  => 'lw-profile',
            'title' => 'LW 自己紹介・プロフィール',
            'icon'  => 'admin-users',
        ),
        array(
            'slug'  => 'lw-voice',
            'title' => 'LW お客様の声・ビフォーアフター',
            'icon'  => 'format-quote',
        ),
        array(
            'slug'  => 'lw-content',
            'title' => 'LW コンテンツ・説明',
            'icon'  => 'text-page',
        ),
        array(
            'slug'  => 'lw-step',
            'title' => 'LW ステップ・フロー',
            'icon'  => 'editor-ol',
        ),
        array(
            'slug'  => 'lw-faq',
            'title' => 'LW FAQ・Q&A',
            'icon'  => 'editor-help',
        ),
        array(
            'slug'  => 'lw-service',
            'title' => 'LW ソリューション・サービス',
            'icon'  => 'lightbulb',
        ),
        array(
            'slug'  => 'lw-comment',
            'title' => 'LW コメント・注釈',
            'icon'  => 'format-chat',
        ),
        array(
            'slug'  => 'lw-calendar',
            'title' => 'LW カレンダー',
            'icon'  => 'calendar-alt',
        ),
        array(
            'slug'  => 'lw-shop',
            'title' => 'LW 店舗・ショップ',
            'icon'  => 'store',
        ),
        array(
            'slug'  => 'lw-utility',
            'title' => 'LW その他・ユーティリティ',
            'icon'  => 'admin-generic',
        ),
    );

    // カテゴリーを「デザイン」の下に挿入
    $design_category_index = array_search('design', array_column($categories, 'slug'));

    if ($design_category_index !== false) {
        // 「デザイン」カテゴリーの次にカスタムカテゴリーを挿入
        array_splice($categories, $design_category_index + 1, 0, $custom_categories);
    } else {
        // 「デザイン」カテゴリーが存在しない場合、カスタムカテゴリーを末尾に追加
        $categories = array_merge($categories, $custom_categories);
    }

    return $categories;
}
add_filter('block_categories_all', 'register_custom_block_categories', 10, 2);
