<?php
/**
 * サイトマップ管理機能 総合テストファイル
 * 全機能の動作確認
 */

if (!defined('ABSPATH')) {
    exit;
}


echo "<div class='wrap'>";
echo "<h1>サイトマップ管理機能 総合テスト</h1>";
echo "<pre style='background: #f5f5f5; padding: 20px; border: 1px solid #ddd; overflow: auto; max-height: 1000px;'>";
echo "========================================\n";
echo "実行時刻: " . date('Y-m-d H:i:s') . "\n";
echo "========================================\n\n";

// テスト結果を格納
$test_results = [];

// ========================================
// 【1. クラスとメソッドの存在確認】
// ========================================
echo "【1. クラスとメソッドの存在確認】\n";

// LW_Sitemap_Settings クラス
$sitemap_methods = [
    'get_settings',
    'save_settings',
    'get_defaults',
    'generate_llms_txt',
    'clear_cache',
    'send_ping'
];

echo "◆ LW_Sitemap_Settings クラス:\n";
$class_exists = class_exists('LW_Sitemap_Settings');
echo "  クラス存在: " . ($class_exists ? '✓' : '✗') . "\n";

if ($class_exists) {
    foreach ($sitemap_methods as $method) {
        $exists = method_exists('LW_Sitemap_Settings', $method);
        echo "  - {$method}: " . ($exists ? '✓' : '✗') . "\n";
        $test_results["LW_Sitemap_Settings::{$method}"] = $exists;
    }
}

// LW_SEO_Sitemap_Control クラス
$control_methods = [
    'init',
    'rebuild_noindex_cache',
    'get_noindex_cache',
    'is_post_noindex',
    'is_category_noindex',
    'is_user_noindex',
    'exclude_noindex_posts_from_query',
    'exclude_noindex_categories_from_query',
    'exclude_noindex_users_from_query'
];

echo "\n◆ LW_SEO_Sitemap_Control クラス:\n";
$class_exists = class_exists('LW_SEO_Sitemap_Control');
echo "  クラス存在: " . ($class_exists ? '✓' : '✗') . "\n";

if ($class_exists) {
    foreach ($control_methods as $method) {
        $exists = method_exists('LW_SEO_Sitemap_Control', $method);
        echo "  - {$method}: " . ($exists ? '✓' : '✗') . "\n";
        $test_results["LW_SEO_Sitemap_Control::{$method}"] = $exists;
    }
}

// ========================================
// 【2. 設定の読み書きテスト】
// ========================================
echo "\n【2. 設定の読み書きテスト】\n";

// 現在の設定を取得
$current_settings = LW_Sitemap_Settings::get_settings();
echo "現在の設定取得: ✓\n";

// デフォルト設定との比較
$defaults = LW_Sitemap_Settings::get_defaults();
$required_keys = ['changefreq', 'priority', 'exclude', 'images', 'ping', 'cache', 'advanced', 'llms'];

echo "必須設定キーの確認:\n";
foreach ($required_keys as $key) {
    $exists = isset($current_settings[$key]);
    echo "  - {$key}: " . ($exists ? '✓' : '✗') . "\n";
    $test_results["settings_{$key}"] = $exists;
}

// テスト用設定の保存と読み込み
$test_value = 'test_' . time();
$test_settings = $current_settings;
$test_settings['test_key'] = $test_value;
LW_Sitemap_Settings::save_settings($test_settings);

$reloaded = LW_Sitemap_Settings::get_settings();
$save_success = ($reloaded['test_key'] ?? '') === $test_value;
echo "\n設定保存/読み込みテスト: " . ($save_success ? '✓ 成功' : '✗ 失敗') . "\n";
$test_results['settings_save'] = $save_success;

// 元の設定に戻す
LW_Sitemap_Settings::save_settings($current_settings);

// ========================================
// 【3. noindexキャッシュ機能テスト】
// ========================================
echo "\n【3. noindexキャッシュ機能テスト】\n";

// キャッシュ取得
$cache = LW_SEO_Sitemap_Control::get_noindex_cache();
echo "キャッシュ取得: " . (!empty($cache) ? '✓' : '✗') . "\n";

if (!empty($cache)) {
    echo "キャッシュ内容:\n";
    echo "  - バージョン: " . ($cache['version'] ?? 'なし') . "\n";
    echo "  - 更新日時: " . ($cache['updated_at'] ?? 'なし') . "\n";
    echo "  - noindex投稿数: " . count($cache['posts'] ?? []) . "\n";
    echo "  - noindexカテゴリー数: " . count($cache['categories'] ?? []) . "\n";
    echo "  - noindexユーザー数: " . count($cache['users'] ?? []) . "\n";
}

// キャッシュ再構築テスト
echo "\nキャッシュ再構築テスト...\n";
$rebuild_result = LW_SEO_Sitemap_Control::rebuild_noindex_cache();
echo "再構築: " . (!empty($rebuild_result) ? '✓ 成功' : '✗ 失敗') . "\n";
$test_results['cache_rebuild'] = !empty($rebuild_result);

// ========================================
// 【4. Ajax処理の登録確認】
// ========================================
echo "\n【4. Ajax処理の登録確認】\n";

$ajax_actions = [
    'lw_save_noindex' => 'noindex保存',
    'lw_preview_llms_txt' => 'llms.txtプレビュー',
    'lw_generate_llms_txt' => 'llms.txt生成'
];

global $wp_filter;
foreach ($ajax_actions as $action => $label) {
    $hook = 'wp_ajax_' . $action;
    $exists = isset($wp_filter[$hook]);
    echo "  {$label} ({$action}): " . ($exists ? '✓' : '✗') . "\n";
    $test_results["ajax_{$action}"] = $exists;
}

// ========================================
// 【5. Ping送信機能テスト】
// ========================================
echo "\n【5. Ping送信機能テスト】\n";

$settings = LW_Sitemap_Settings::get_settings();
echo "Ping設定:\n";
echo "  - Google Ping: " . ($settings['ping']['google_ping'] ? '有効' : '無効') . "\n";
echo "  - Bing Ping: " . ($settings['ping']['bing_ping'] ? '有効' : '無効') . "\n";
echo "  - 自動Ping: " . ($settings['ping']['auto_ping'] ? '有効' : '無効') . "\n";
echo "  - 投稿公開時Ping: " . ($settings['ping']['ping_on_publish'] ? '有効' : '無効') . "\n";

// Ping送信テスト（実際には送信しない）
echo "\nPing送信関数の存在: ";
$ping_exists = method_exists('LW_Sitemap_Settings', 'send_ping');
echo $ping_exists ? '✓' : '✗';
echo "\n";
$test_results['ping_function'] = $ping_exists;

// ========================================
// 【6. メタデータの確認】
// ========================================
echo "\n【6. メタデータの確認】\n";

// テスト用投稿を取得
$test_post = get_posts(['numberposts' => 1, 'post_status' => 'publish']);
if (!empty($test_post)) {
    $post_id = $test_post[0]->ID;
    $noindex_value = get_post_meta($post_id, 'seo_noindex', true);
    echo "テスト投稿ID {$post_id} のnoindex設定: " . ($noindex_value ?: 'なし') . "\n";
}

// テスト用カテゴリーを取得
$test_category = get_categories(['number' => 1]);
if (!empty($test_category)) {
    $cat_id = $test_category[0]->term_id;
    $noindex_value = get_term_meta($cat_id, 'category_noindex', true);
    echo "テストカテゴリーID {$cat_id} のnoindex設定: " . ($noindex_value ?: 'なし') . "\n";
}

// テスト用ユーザーを取得
$test_user = get_users(['number' => 1]);
if (!empty($test_user)) {
    $user_id = $test_user[0]->ID;
    $noindex_value = get_user_meta($user_id, 'user_noindex', true);
    echo "テストユーザーID {$user_id} のnoindex設定: " . ($noindex_value ?: 'デフォルト(noindex)') . "\n";
}

// ========================================
// 【7. サイトマップURLの確認】
// ========================================
echo "\n【7. サイトマップURLの確認】\n";

$sitemap_urls = [
    'メイン' => home_url('/wp-sitemap.xml'),
    '投稿' => home_url('/wp-sitemap-posts-post-1.xml'),
    '固定ページ' => home_url('/wp-sitemap-posts-page-1.xml'),
    'カテゴリー' => home_url('/wp-sitemap-taxonomies-category-1.xml'),
    'タグ' => home_url('/wp-sitemap-taxonomies-post_tag-1.xml'),
    '投稿者' => home_url('/wp-sitemap-users-1.xml')
];

foreach ($sitemap_urls as $label => $url) {
    echo "  {$label}: {$url}\n";
    
    // URLアクセス可能性チェック（HEADリクエスト）
    $response = wp_remote_head($url);
    if (!is_wp_error($response)) {
        $status = wp_remote_retrieve_response_code($response);
        echo "    → ステータス: {$status}\n";
    }
}

// ========================================
// 【8. フィルターフックの確認】
// ========================================
echo "\n【8. フィルターフックの確認】\n";

$filters_to_check = [
    'wp_sitemaps_posts_query_args' => '投稿除外フィルター',
    'wp_sitemaps_taxonomies_query_args' => 'タクソノミー除外フィルター',
    'wp_sitemaps_users_query_args' => 'ユーザー除外フィルター'
];

foreach ($filters_to_check as $filter => $label) {
    $has_filter = has_filter($filter);
    echo "  {$label}: " . ($has_filter ? '✓ 登録済み' : '✗ 未登録') . "\n";
    $test_results["filter_{$filter}"] = $has_filter !== false;
}

// ========================================
// 【9. llms.txt生成テスト】
// ========================================
echo "\n【9. llms.txt生成テスト】\n";

$llms_file = ABSPATH . 'llms.txt';
$llms_exists_before = file_exists($llms_file);
echo "llms.txt存在（生成前）: " . ($llms_exists_before ? 'あり' : 'なし') . "\n";

// llms.txt生成
$result = LW_Sitemap_Settings::generate_llms_txt();
echo "生成実行: " . ($result ? '✓ 成功' : '✗ 失敗') . "\n";
$test_results['llms_generation'] = $result;

if ($result && file_exists($llms_file)) {
    $content = file_get_contents($llms_file);
    echo "生成ファイルサイズ: " . strlen($content) . " bytes\n";
    
    // キーワードチェック
    $checks = [
        'User-agent' => strpos($content, 'User-agent') !== false,
        'Allow/Disallow' => (strpos($content, 'Allow:') !== false || strpos($content, 'Disallow:') !== false),
        'Sitemap' => strpos($content, 'Sitemap:') !== false
    ];
    
    echo "内容検証:\n";
    foreach ($checks as $check => $result) {
        echo "  - {$check}: " . ($result ? '✓' : '✗') . "\n";
    }
}

// ========================================
// 【10. 総合診断】
// ========================================
echo "\n【10. 総合診断】\n";

$passed = 0;
$failed = 0;
$critical_issues = [];

foreach ($test_results as $test => $result) {
    if ($result) {
        $passed++;
    } else {
        $failed++;
        if (strpos($test, 'ajax_') === 0 || strpos($test, 'filter_') === 0) {
            $critical_issues[] = $test;
        }
    }
}

echo "テスト結果サマリー:\n";
echo "  ✓ 成功: {$passed}\n";
echo "  ✗ 失敗: {$failed}\n";
echo "  合計: " . ($passed + $failed) . "\n";

if (!empty($critical_issues)) {
    echo "\n⚠ 重要な問題:\n";
    foreach ($critical_issues as $issue) {
        echo "  - {$issue}\n";
    }
}

if ($failed === 0) {
    echo "\n✅ すべてのテストに合格しました！\n";
} else {
    echo "\n⚠ 一部のテストに失敗しました。上記の詳細を確認してください。\n";
}

echo "\n========================================\n";
echo "テスト完了\n";
echo "========================================\n";
echo "</pre>";
echo "</div>";
?>