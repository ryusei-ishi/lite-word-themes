<?php
/**
 * SEOセルフチェック機能
 *
 * SEO対策の実施状況を自己チェックできる機能
 */

if (!defined('ABSPATH')) exit;

/**
 * SEOチェックデータの取得
 */
function lw_get_seo_check_data() {
    $user_id = get_current_user_id();
    $data = get_user_meta($user_id, 'lw_seo_check_data', true);
    return is_array($data) ? $data : array();
}

/**
 * SEOチェックデータの保存
 */
function lw_save_seo_check_data($data) {
    $user_id = get_current_user_id();
    update_user_meta($user_id, 'lw_seo_check_data', $data);
}

/**
 * SEOチェック項目の定義
 */
function lw_get_seo_check_items() {
    return array(
        'domain_server' => array(
            'title' => 'ドメイン・サーバー関連',
            'icon' => 'dashicons-admin-site-alt3',
            'description' => 'SEOの土台となる基盤設定です。特にSSL化は必須です。',
            'items' => array(
                'whois' => array(
                    'label' => 'Whois情報の正確な設定',
                    'description' => 'ドメインの所有者情報が正確に設定されているか確認しましょう。'
                ),
                'ssl' => array(
                    'label' => 'SSL証明書の導入（https化）',
                    'description' => 'サイトがhttpsで表示されることを確認。Googleの検索ランキング要因の一つです。'
                ),
                'server_speed' => array(
                    'label' => 'サーバーの応答速度が十分か確認',
                    'description' => 'TTFB（Time To First Byte）が200ms以下が理想的です。'
                ),
                'uptime' => array(
                    'label' => 'サーバーの稼働率（99.9%以上推奨）',
                    'description' => 'サーバーダウンが頻発するとSEOに悪影響があります。'
                ),
                'domain_history' => array(
                    'label' => 'ドメインの信頼性確認',
                    'description' => '中古ドメインの場合はペナルティ履歴がないか確認しましょう。'
                ),
            )
        ),
        'wp_initial' => array(
            'title' => 'WordPress初期設定',
            'icon' => 'dashicons-wordpress',
            'description' => 'WordPressの基本設定です。サイト公開前に必ず確認してください。',
            'items' => array(
                'permalink' => array(
                    'label' => 'パーマリンク設定（投稿名推奨）',
                    'description' => '「投稿名」設定がSEOに最適です。ウィザードのステップ3で設定できます。'
                ),
                'site_title' => array(
                    'label' => 'サイトタイトルとキャッチフレーズの設定',
                    'description' => '検索結果に表示される重要な情報です。ウィザードのステップ2で設定できます。'
                ),
                'search_visibility' => array(
                    'label' => '検索エンジンでの表示設定',
                    'description' => '「検索エンジンがサイトをインデックスしないようにする」がOFFになっていることを確認。'
                ),
                'timezone' => array(
                    'label' => 'タイムゾーン・日付形式の設定',
                    'description' => '日本向けサイトなら「Asia/Tokyo」に設定。ウィザードのステップ2で設定できます。'
                ),
                'www_redirect' => array(
                    'label' => 'wwwあり/なしの統一',
                    'description' => 'どちらかに統一してリダイレクト設定をしましょう。重複コンテンツ防止になります。'
                ),
            )
        ),
        'technical_seo' => array(
            'title' => '技術的SEO',
            'icon' => 'dashicons-admin-tools',
            'description' => '検索エンジンがサイトを正しく理解するための技術的な設定です。',
            'items' => array(
                'robots_txt' => array(
                    'label' => 'robots.txtの設置と最適化',
                    'description' => 'クローラーに対する指示ファイル。サイトルートに設置します。'
                ),
                'sitemap' => array(
                    'label' => 'XMLサイトマップの生成と送信',
                    'description' => 'LiteWordのSEO機能で自動生成されます。Search Consoleに送信しましょう。'
                ),
                'search_console' => array(
                    'label' => 'Google Search Consoleへの登録',
                    'description' => '検索パフォーマンスの確認やインデックス状況の把握に必須のツールです。'
                ),
                'analytics' => array(
                    'label' => 'Google Analyticsの導入',
                    'description' => 'アクセス解析ツール。ウィザードのステップ16で設定できます。'
                ),
                'core_web_vitals' => array(
                    'label' => 'ページ表示速度の最適化',
                    'description' => 'Core Web Vitals（LCP、FID、CLS）のスコアを改善しましょう。'
                ),
                'mobile_friendly' => array(
                    'label' => 'モバイルフレンドリー対応',
                    'description' => 'LiteWordはレスポンシブ対応済みですが、カスタマイズ時は注意が必要です。'
                ),
                'structured_data' => array(
                    'label' => '構造化データ（JSON-LD）の実装',
                    'description' => 'リッチスニペット表示に必要。LiteWordのSEO機能で基本対応済みです。'
                ),
                'canonical' => array(
                    'label' => 'canonical URLの設定',
                    'description' => '重複コンテンツ問題を防ぐための設定。LiteWordで自動設定されます。'
                ),
                'error_404' => array(
                    'label' => '404エラーページのカスタマイズ',
                    'description' => 'ユーザーが迷子にならないよう、適切な404ページを用意しましょう。'
                ),
            )
        ),
        'security' => array(
            'title' => 'セキュリティ関連',
            'icon' => 'dashicons-shield',
            'description' => 'セキュリティ問題はSEOにも悪影響を与えます。',
            'items' => array(
                'wp_update' => array(
                    'label' => 'WordPress本体の最新バージョン維持',
                    'description' => 'セキュリティパッチが含まれる更新は速やかに適用しましょう。'
                ),
                'plugin_update' => array(
                    'label' => 'プラグイン・テーマの定期更新',
                    'description' => '脆弱性対策のため、定期的な更新が重要です。'
                ),
                'spam_protection' => array(
                    'label' => 'スパム対策',
                    'description' => 'コメントスパムなどの対策を行いましょう。'
                ),
                'security_plugin' => array(
                    'label' => '不正アクセス対策',
                    'description' => 'ウィザードのステップ17でセキュリティプラグインを導入できます。'
                ),
                'backup' => array(
                    'label' => '定期バックアップの設定',
                    'description' => '万が一の時に復旧できるよう、定期バックアップを設定しましょう。'
                ),
            )
        ),
        'content_structure' => array(
            'title' => 'コンテンツ構造',
            'icon' => 'dashicons-category',
            'description' => 'サイト構造を整理し、ユーザーと検索エンジンにわかりやすくします。',
            'items' => array(
                'category' => array(
                    'label' => '適切なカテゴリー設計',
                    'description' => '論理的なカテゴリー構造を設計し、コンテンツを整理しましょう。'
                ),
                'tag' => array(
                    'label' => 'タグの設計方針決定',
                    'description' => 'タグの使い方を決め、一貫性を持たせましょう。'
                ),
                'breadcrumb' => array(
                    'label' => 'パンくずリストの実装',
                    'description' => 'ユーザビリティとSEO両方に効果的です。LiteWordで対応済みです。'
                ),
                'site_search' => array(
                    'label' => 'サイト内検索機能の設置',
                    'description' => 'ユーザーが目的のコンテンツを見つけやすくなります。'
                ),
                'related_posts' => array(
                    'label' => '関連記事表示機能',
                    'description' => '回遊率向上とページビュー増加に効果的です。'
                ),
            )
        ),
        'page_seo' => array(
            'title' => '各ページ・投稿のSEO設定',
            'icon' => 'dashicons-admin-page',
            'description' => '個別ページのSEO設定です。ウィザードのステップ14で設定できます。',
            'items' => array(
                'title_tag' => array(
                    'label' => 'titleタグの最適化（32文字前後）',
                    'description' => '検索結果に表示されるタイトル。簡潔でキーワードを含めましょう。'
                ),
                'meta_description' => array(
                    'label' => 'meta descriptionの設定（120文字前後）',
                    'description' => '検索結果に表示される説明文。クリック率に影響します。'
                ),
                'heading_structure' => array(
                    'label' => '見出しタグ（H1〜H6）の適切な階層構造',
                    'description' => 'H1は1ページ1つ、以降は論理的な階層で使用しましょう。'
                ),
                'image_alt' => array(
                    'label' => '画像のalt属性設定',
                    'description' => '画像の内容を説明するテキストを設定しましょう。'
                ),
                'image_optimization' => array(
                    'label' => '画像の圧縮・WebP対応',
                    'description' => 'ページ速度改善のため、画像を最適化しましょう。'
                ),
                'internal_link' => array(
                    'label' => '内部リンクの設計',
                    'description' => '関連するページ同士をリンクで繋ぎ、サイト構造を強化しましょう。'
                ),
                'ogp' => array(
                    'label' => 'OGP（Open Graph Protocol）設定',
                    'description' => 'SNSでシェアされた時の表示を最適化します。LiteWordのSEO機能で設定可能。'
                ),
            )
        ),
        'index_management' => array(
            'title' => 'インデックス管理',
            'icon' => 'dashicons-visibility',
            'description' => '検索エンジンにインデックスさせるページを適切に管理します。',
            'items' => array(
                'noindex' => array(
                    'label' => 'noindex設定が必要なページの特定',
                    'description' => '検索結果ページ、タグアーカイブなど、インデックス不要なページを特定。'
                ),
                'duplicate_content' => array(
                    'label' => '重複コンテンツの排除',
                    'description' => '同じ内容のページが複数存在しないか確認しましょう。'
                ),
                'low_quality' => array(
                    'label' => '低品質ページの整理',
                    'description' => '内容の薄いページは統合または削除を検討しましょう。'
                ),
            )
        ),
        'external' => array(
            'title' => '外部連携',
            'icon' => 'dashicons-share',
            'description' => '外部サービスとの連携設定です。',
            'items' => array(
                'sns' => array(
                    'label' => 'SNSアカウントとの連携設定',
                    'description' => 'SNSからの流入を増やし、認知度を向上させましょう。'
                ),
                'bing' => array(
                    'label' => 'Bingウェブマスターツールへの登録',
                    'description' => 'Bing検索からの流入も見込める場合は登録しましょう。'
                ),
            )
        ),
        'measurement' => array(
            'title' => '計測・分析準備',
            'icon' => 'dashicons-chart-bar',
            'description' => '効果測定のための準備です。',
            'items' => array(
                'conversion' => array(
                    'label' => 'コンバージョン計測の設定',
                    'description' => '問い合わせや購入などの目標達成を計測できるようにしましょう。'
                ),
                'event_tracking' => array(
                    'label' => 'イベントトラッキングの設定',
                    'description' => 'ボタンクリックやスクロールなどのユーザー行動を計測しましょう。'
                ),
            )
        ),
    );
}

/**
 * AJAXハンドラ：SEOチェックデータの取得
 */
add_action('wp_ajax_lw_get_seo_check', 'lw_ajax_get_seo_check');
function lw_ajax_get_seo_check() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    $data = lw_get_seo_check_data();
    wp_send_json_success($data);
}

/**
 * AJAXハンドラ：SEOチェックデータの保存
 */
add_action('wp_ajax_lw_save_seo_check', 'lw_ajax_save_seo_check');
function lw_ajax_save_seo_check() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    $category = sanitize_text_field($_POST['category'] ?? '');
    $item = sanitize_text_field($_POST['item'] ?? '');
    $checked = $_POST['checked'] === 'true';

    if (empty($category) || empty($item)) {
        wp_send_json_error('Invalid parameters');
    }

    $data = lw_get_seo_check_data();

    if (!isset($data[$category])) {
        $data[$category] = array();
    }

    $data[$category][$item] = array(
        'checked' => $checked,
        'updated_at' => current_time('mysql')
    );

    lw_save_seo_check_data($data);

    // 進捗率を計算
    $items = lw_get_seo_check_items();
    $total = 0;
    $completed = 0;

    foreach ($items as $cat_key => $category_data) {
        foreach ($category_data['items'] as $item_key => $item_data) {
            $total++;
            if (!empty($data[$cat_key][$item_key]['checked'])) {
                $completed++;
            }
        }
    }

    $progress = $total > 0 ? round(($completed / $total) * 100) : 0;

    wp_send_json_success(array(
        'progress' => $progress,
        'completed' => $completed,
        'total' => $total
    ));
}

/**
 * SEOチェックモーダルのHTML出力
 */
function lw_render_seo_check_modal() {
    $items = lw_get_seo_check_items();
    $data = lw_get_seo_check_data();

    // 進捗計算
    $total = 0;
    $completed = 0;
    foreach ($items as $cat_key => $category) {
        foreach ($category['items'] as $item_key => $item) {
            $total++;
            if (!empty($data[$cat_key][$item_key]['checked'])) {
                $completed++;
            }
        }
    }
    $progress = $total > 0 ? round(($completed / $total) * 100) : 0;
    ?>
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-seo-check-modal">
        <div class="lw-wizard-popup lw-wizard-popup-lg">
            <div class="lw-wizard-popup-header">
                <h3>
                    <span class="dashicons dashicons-yes-alt"></span>
                    SEOセルフチェック
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-seo-check-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body lw-seo-check-body">
                <div class="lw-seo-check-header">
                    <p class="lw-modal-intro">サイトのSEO対策状況をチェックしましょう。チェックした項目は自動保存されます。</p>
                    <div class="lw-seo-progress-summary">
                        <div class="lw-seo-progress-bar">
                            <div class="lw-seo-progress-fill" id="lw-seo-progress-fill" style="width: <?php echo $progress; ?>%;"></div>
                        </div>
                        <div class="lw-seo-progress-text">
                            <span id="lw-seo-completed"><?php echo $completed; ?></span> / <span id="lw-seo-total"><?php echo $total; ?></span> 項目完了
                            （<span id="lw-seo-percent"><?php echo $progress; ?></span>%）
                        </div>
                    </div>
                </div>

                <div class="lw-seo-check-categories">
                    <?php foreach ($items as $cat_key => $category) : ?>
                        <?php
                        $cat_total = count($category['items']);
                        $cat_completed = 0;
                        foreach ($category['items'] as $item_key => $item) {
                            if (!empty($data[$cat_key][$item_key]['checked'])) {
                                $cat_completed++;
                            }
                        }
                        $cat_progress = $cat_total > 0 ? round(($cat_completed / $cat_total) * 100) : 0;
                        $is_complete = $cat_completed === $cat_total;
                        ?>
                        <div class="lw-seo-category <?php echo $is_complete ? 'is-complete' : ''; ?>" data-category="<?php echo esc_attr($cat_key); ?>">
                            <div class="lw-seo-category-header">
                                <div class="lw-seo-category-title">
                                    <span class="dashicons <?php echo esc_attr($category['icon']); ?>"></span>
                                    <span><?php echo esc_html($category['title']); ?></span>
                                    <span class="lw-seo-category-count"><?php echo $cat_completed; ?>/<?php echo $cat_total; ?></span>
                                </div>
                                <div class="lw-seo-category-toggle">
                                    <span class="dashicons dashicons-arrow-down-alt2"></span>
                                </div>
                            </div>
                            <div class="lw-seo-category-body" style="display: none;">
                                <p class="lw-seo-category-desc"><?php echo esc_html($category['description']); ?></p>
                                <div class="lw-seo-items">
                                    <?php foreach ($category['items'] as $item_key => $item) :
                                        $is_checked = !empty($data[$cat_key][$item_key]['checked']);
                                    ?>
                                        <div class="lw-seo-item <?php echo $is_checked ? 'is-checked' : ''; ?>">
                                            <label class="lw-seo-item-label">
                                                <input type="checkbox"
                                                    class="lw-seo-checkbox"
                                                    data-category="<?php echo esc_attr($cat_key); ?>"
                                                    data-item="<?php echo esc_attr($item_key); ?>"
                                                    <?php checked($is_checked); ?>>
                                                <span class="lw-seo-checkbox-custom"></span>
                                                <span class="lw-seo-item-text"><?php echo esc_html($item['label']); ?></span>
                                            </label>
                                            <p class="lw-seo-item-desc"><?php echo esc_html($item['description']); ?></p>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    <?php
}
