<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — サイト設定の取得・変更
 *
 * Phase 1: 読み取り（GET /liteword/v1/site-settings）
 * Phase 2: 変更（POST /liteword/v1/site-settings）
 */

/**
 * 変更可能な設定キーのホワイトリスト
 * セキュリティのため、ここにないキーは変更できない
 */
function lw_ai_chat_get_allowed_settings() {
    return [
        // WordPress基本設定（option）
        'blogname'             => ['type' => 'option', 'label' => 'サイト名'],
        'blogdescription'      => ['type' => 'option', 'label' => 'キャッチフレーズ'],
        'permalink_structure'  => ['type' => 'option', 'label' => 'パーマリンク構造'],

        // カラー（theme_mod）
        'color_main'           => ['type' => 'theme_mod', 'label' => 'メインカラー'],
        'color_accent'         => ['type' => 'theme_mod', 'label' => 'アクセントカラー'],
        'color_text'           => ['type' => 'theme_mod', 'label' => '文字色'],
        'color_link_common'    => ['type' => 'theme_mod', 'label' => 'リンク色'],
        'color_1'              => ['type' => 'theme_mod', 'label' => 'カラー1'],
        'color_2'              => ['type' => 'theme_mod', 'label' => 'カラー2'],
        'color_3'              => ['type' => 'theme_mod', 'label' => 'カラー3'],

        // フォント（theme_mod）
        'font_body'            => ['type' => 'theme_mod', 'label' => 'サイト全体のフォント'],
        'font_body_weight'     => ['type' => 'theme_mod', 'label' => 'サイト全体の文字太さ'],
        'font_page'            => ['type' => 'theme_mod', 'label' => '固定ページのフォント'],
        'font_page_weight'     => ['type' => 'theme_mod', 'label' => '固定ページの文字太さ'],
        'font_page_size_pc'    => ['type' => 'theme_mod', 'label' => '固定ページの文字サイズ（PC）'],
        'font_page_size_tb'    => ['type' => 'theme_mod', 'label' => '固定ページの文字サイズ（タブ）'],
        'font_page_size_sp'    => ['type' => 'theme_mod', 'label' => '固定ページの文字サイズ（SP）'],
        'font_single'          => ['type' => 'theme_mod', 'label' => '投稿ページのフォント'],
        'font_single_weight'   => ['type' => 'theme_mod', 'label' => '投稿ページの文字太さ'],
        'font_single_size_pc'  => ['type' => 'theme_mod', 'label' => '投稿ページの文字サイズ（PC）'],
        'font_single_size_tb'  => ['type' => 'theme_mod', 'label' => '投稿ページの文字サイズ（タブ）'],
        'font_single_size_sp'  => ['type' => 'theme_mod', 'label' => '投稿ページの文字サイズ（SP）'],

        // ヘッダー・フッター（theme_mod）
        'header_set_ptn_df'    => ['type' => 'theme_mod', 'label' => 'ヘッダーパターン（全ページ共通）'],
        'header_set_ptn_page'  => ['type' => 'theme_mod', 'label' => 'ヘッダーパターン（固定ページ）'],
        'header_set_ptn_post'  => ['type' => 'theme_mod', 'label' => 'ヘッダーパターン（投稿ページ）'],
        'footer_set_ptn_df'    => ['type' => 'theme_mod', 'label' => 'フッターパターン（全ページ共通）'],
        'footer_set_ptn_page'  => ['type' => 'theme_mod', 'label' => 'フッターパターン（固定ページ）'],
        'footer_set_ptn_post'  => ['type' => 'theme_mod', 'label' => 'フッターパターン（投稿ページ）'],

        // 投稿ページ（theme_mod）
        'single_post_layout_clm'              => ['type' => 'theme_mod', 'label' => '投稿ページのカラム'],
        'single_post_layout_breadcrumb_ptn'   => ['type' => 'theme_mod', 'label' => 'パンくずリスト'],
        'single_post_layout_fv_ptn'           => ['type' => 'theme_mod', 'label' => 'ファーストビュー'],
        'single_post_layout_fv_date'          => ['type' => 'theme_mod', 'label' => '投稿日時の表示'],
        'single_post_layout_fv_date_update'   => ['type' => 'theme_mod', 'label' => '更新日時の表示'],
        'single_post_layout_heading_2'        => ['type' => 'theme_mod', 'label' => '見出しH2デザイン'],
        'single_post_layout_heading_3'        => ['type' => 'theme_mod', 'label' => '見出しH3デザイン'],
        'single_post_layout_heading_4'        => ['type' => 'theme_mod', 'label' => '見出しH4デザイン'],
        'single_post_layout_toc_switch'       => ['type' => 'theme_mod', 'label' => '目次の表示'],
        'single_post_layout_toc_ptn'          => ['type' => 'theme_mod', 'label' => '目次のパターン'],

        // 拡張機能（theme_mod）
        'lw_extensions_mail_form_switch_all'   => ['type' => 'theme_mod', 'label' => 'メールフォーム'],
        'lw_extensions_animation_switch'       => ['type' => 'theme_mod', 'label' => 'アニメーション'],
        'lw_extensions_seo_functions_switch'   => ['type' => 'theme_mod', 'label' => 'SEO機能'],
        'lw_extensions_comment_functions_switch' => ['type' => 'theme_mod', 'label' => 'コメント機能'],

        // CTA・ローディング（theme_mod）
        'follow_bottom_cta_set_ptn_df'        => ['type' => 'theme_mod', 'label' => '追従CTAパターン'],
        'loading_anime_ptn_df'                => ['type' => 'theme_mod', 'label' => 'ローディングパターン'],

        // Google Analytics（theme_mod）
        'seo_set_google_analytics_id'         => ['type' => 'theme_mod', 'label' => 'Google Analytics ID'],
        'seo_set_gtm_id'                      => ['type' => 'theme_mod', 'label' => 'Google Tag Manager ID'],
    ];
}

/**
 * サイト設定を取得（GET）
 */
function lw_ai_chat_get_site_settings() {
    $settings = [];

    // WordPress基本設定
    $settings['site'] = [
        'name'        => get_option('blogname', ''),
        'description' => get_option('blogdescription', ''),
        'url'         => home_url(),
        'permalink'   => get_option('permalink_structure', ''),
        'is_premium'  => lw_ai_chat_is_premium(),
    ];

    // カラー設定
    $settings['colors'] = [
        'main'    => get_theme_mod('color_main', ''),
        'accent'  => get_theme_mod('color_accent', ''),
        'text'    => get_theme_mod('color_text', ''),
        'link'    => get_theme_mod('color_link_common', ''),
        'color_1' => get_theme_mod('color_1', ''),
        'color_2' => get_theme_mod('color_2', ''),
        'color_3' => get_theme_mod('color_3', ''),
    ];

    // フォント設定
    $settings['fonts'] = [
        'body'             => get_theme_mod('font_body', ''),
        'body_weight'      => get_theme_mod('font_body_weight', ''),
        'page'             => get_theme_mod('font_page', ''),
        'page_weight'      => get_theme_mod('font_page_weight', ''),
        'page_size_pc'     => get_theme_mod('font_page_size_pc', ''),
        'page_size_sp'     => get_theme_mod('font_page_size_sp', ''),
        'single'           => get_theme_mod('font_single', ''),
        'single_weight'    => get_theme_mod('font_single_weight', ''),
        'single_size_pc'   => get_theme_mod('font_single_size_pc', ''),
        'single_size_sp'   => get_theme_mod('font_single_size_sp', ''),
    ];

    // ヘッダー
    $settings['header'] = [
        'pattern_default'  => get_theme_mod('header_set_ptn_df', ''),
        'pattern_page'     => get_theme_mod('header_set_ptn_page', ''),
        'pattern_post'     => get_theme_mod('header_set_ptn_post', ''),
        'pattern_archive'  => get_theme_mod('header_set_ptn_archive', ''),
    ];

    // フッター
    $settings['footer'] = [
        'pattern_default'  => get_theme_mod('footer_set_ptn_df', ''),
        'pattern_page'     => get_theme_mod('footer_set_ptn_page', ''),
        'pattern_post'     => get_theme_mod('footer_set_ptn_post', ''),
    ];

    // 投稿ページ
    $settings['single_post'] = [
        'column'           => get_theme_mod('single_post_layout_clm', ''),
        'breadcrumb'       => get_theme_mod('single_post_layout_breadcrumb_ptn', ''),
        'fv_pattern'       => get_theme_mod('single_post_layout_fv_ptn', ''),
        'date_display'     => get_theme_mod('single_post_layout_fv_date', ''),
        'heading_h2'       => get_theme_mod('single_post_layout_heading_2', ''),
        'toc_switch'       => get_theme_mod('single_post_layout_toc_switch', ''),
    ];

    // 拡張機能
    $settings['extensions'] = [
        'mail_form'        => get_theme_mod('lw_extensions_mail_form_switch_all', 'off'),
        'animation'        => get_theme_mod('lw_extensions_animation_switch', 'off'),
        'seo'              => get_theme_mod('lw_extensions_seo_functions_switch', 'off'),
        'comment'          => get_theme_mod('lw_extensions_comment_functions_switch', 'off'),
    ];

    // アーカイブ
    $settings['archive'] = [
        'fv_pattern'        => get_theme_mod('archive_page_layout_fv_ptn_df', ''),
        'post_list_pattern' => get_theme_mod('archive_page_layout_post_list_ptn_df', ''),
    ];

    // 追従CTA・ローディング
    $settings['follow_cta'] = ['pattern_default' => get_theme_mod('follow_bottom_cta_set_ptn_df', '')];
    $settings['loading']    = ['pattern_default' => get_theme_mod('loading_anime_ptn_df', '')];

    // Google Analytics
    $settings['analytics'] = [
        'ga_id'  => get_theme_mod('seo_set_google_analytics_id', ''),
        'gtm_id' => get_theme_mod('seo_set_gtm_id', ''),
    ];

    // カスタマイザー直リンク
    $base = admin_url('customize.php');
    $settings['customizer_links'] = [
        'colors'       => $base . '?autofocus[section]=color_sec',
        'fonts'        => $base . '?autofocus[section]=font_sec',
        'header'       => $base . '?autofocus[panel]=header_set',
        'footer'       => $base . '?autofocus[panel]=footer_set',
        'single_post'  => $base . '?autofocus[panel]=single_post',
        'page_post'    => $base . '?autofocus[panel]=page_post',
        'archive'      => $base . '?autofocus[panel]=archive_page',
        'follow_cta'   => $base . '?autofocus[panel]=follow_bottom_cta_set',
        'loading'      => $base . '?autofocus[section]=loading_anime_sec',
        'extensions'   => $base . '?autofocus[section]=lw_extensions_sec',
        'analytics'    => $base . '?autofocus[section]=seo_set_google_sec',
    ];

    return $settings;
}

/**
 * サイト設定を変更（POST）— Phase 2
 *
 * リクエスト例: { "changes": [ { "key": "color_main", "value": "#FF0000" } ] }
 */
function lw_ai_chat_update_site_settings($request) {
    // プライベートAIモード限定
    if (!lw_ai_chat_use_own_key()) {
        return new WP_Error('not_private_mode', 'サイト設定の変更はプライベートAIモードでのみ利用可能です', ['status' => 403]);
    }

    $changes = $request->get_param('changes');
    if (empty($changes) || !is_array($changes)) {
        return new WP_Error('no_changes', '変更内容がありません', ['status' => 400]);
    }

    $allowed  = lw_ai_chat_get_allowed_settings();
    $results  = [];
    $log_entries = [];

    foreach ($changes as $change) {
        $key   = sanitize_text_field($change['key'] ?? '');
        $value = $change['value'] ?? '';

        // ホワイトリストチェック
        if (!isset($allowed[$key])) {
            $results[] = ['key' => $key, 'success' => false, 'message' => '変更が許可されていない設定キーです'];
            continue;
        }

        $setting = $allowed[$key];
        $old_value = ($setting['type'] === 'option')
            ? get_option($key, '')
            : get_theme_mod($key, '');

        // 値をサニタイズ
        $value = sanitize_text_field($value);

        // 設定を変更
        if ($setting['type'] === 'option') {
            update_option($key, $value);
        } else {
            set_theme_mod($key, $value);
        }

        // パーマリンク変更時はリライトルールをフラッシュ
        if ($key === 'permalink_structure') {
            flush_rewrite_rules();
        }

        $results[] = [
            'key'     => $key,
            'label'   => $setting['label'],
            'success' => true,
            'old'     => $old_value,
            'new'     => $value,
        ];

        $log_entries[] = [
            'key'       => $key,
            'label'     => $setting['label'],
            'old_value' => $old_value,
            'new_value' => $value,
        ];
    }

    // 変更ログをDBに保存
    if (!empty($log_entries)) {
        lw_ai_chat_save_change_log($log_entries);
    }

    // CSSキャッシュをクリア（カラー・フォント変更時）
    if (function_exists('lw_clear_css_transients')) {
        lw_clear_css_transients();
    }

    return ['success' => true, 'results' => $results];
}

/**
 * 変更ログをDBに保存（ロールバック用）
 */
function lw_ai_chat_save_change_log($entries) {
    global $wpdb;
    $table = $wpdb->prefix . 'lw_ai_chat_change_log';

    // テーブル作成（初回のみ）
    static $table_checked = false;
    if (!$table_checked) {
        $table_checked = true;
        $exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table));
        if (!$exists) {
            $wpdb->query("CREATE TABLE `{$table}` (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT UNSIGNED NOT NULL,
                setting_key VARCHAR(255) NOT NULL,
                setting_label VARCHAR(255) NOT NULL DEFAULT '',
                old_value TEXT,
                new_value TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY idx_user_created (user_id, created_at)
            ) {$wpdb->get_charset_collate()};");
        }
    }

    $user_id = get_current_user_id();
    foreach ($entries as $entry) {
        $wpdb->insert($table, [
            'user_id'       => $user_id,
            'setting_key'   => $entry['key'],
            'setting_label' => $entry['label'],
            'old_value'     => $entry['old_value'],
            'new_value'     => $entry['new_value'],
            'created_at'    => current_time('mysql'),
        ]);
    }
}
