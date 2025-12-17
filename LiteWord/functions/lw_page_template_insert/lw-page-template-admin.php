<?php
/**
 * LiteWord ページテンプレート挿入 - 管理画面用
 * 管理メニュー、テンプレート一覧画面など
 */

if (!defined('ABSPATH')) exit;


/**
 * 管理メニューの追加
 */
add_action('admin_menu', 'lw_page_template_insert_menu');

function lw_page_template_insert_menu() {
    add_submenu_page(
        'edit.php?post_type=page',           // 親メニューのスラッグ（固定ページ）
        '固定ページサンプルテンプレート挿入',         // ページタイトル
        'テンプレートの挿入',                   // メニュータイトル
        'edit_pages',                         // 権限
        'lw_page_template_insert',            // スラッグ
        'lw_page_template_insert_page'        // コールバック関数
    );
}

/**
 * 固定ページ一覧にテンプレート挿入ボタンを追加
 */
add_action('admin_head-edit.php', 'lw_add_template_button_to_page_list');

function lw_add_template_button_to_page_list() {
    global $typenow;
    
    // 固定ページ一覧の場合のみ実行
    if ($typenow != 'page') {
        return;
    }
    ?>
    <style>
    .lw-template-insert-button {

    }
    .lw-template-insert-button:hover {

    }
    .lw-template-insert-button:focus {

    }
    </style>
    <script>
    jQuery(document).ready(function($) {
        // テンプレート挿入ボタンを作成
        var templateButton = '<a href="<?php echo admin_url('edit.php?post_type=page&page=lw_page_template_insert'); ?>" class="page-title-action lw-template-insert-button">Lw専用 固定ページテンプレートの挿入</a>';
        
        // 「固定ページを追加」ボタンの後に追加
        $('.page-title-action').first().after(templateButton);
    });
    </script>
    <?php
}

/**
 * 統合されたテンプレート設定
 */
function lw_get_integrated_template_configs() {
    return [
        'standard-page' => [
            'label' => 'サンプルページ',
            'items' => [
                'top' => [
                    'label' => 'トップページ',
                    'templates' => [
                        [
                            'name' => 'トップページ サンプル',
                            'description' => '動画ヘッダーとブログ一覧などが表示される<br>シンプルなトップページ',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'トップページ カメラマン系 01',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_2.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'トップページ カメラマン系 02',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_2_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ パターン3',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_3.php',
                            'public' => false,
                        ],
                          [
                            'name' => 'トップページ パターン4',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_4.php',
                            'public' => false,
                        ],
                          [
                            'name' => 'トップページ 税理士系ブログ',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_5.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 美容室系1-1',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_6.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 美容室系1-2',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_6_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ ブログ系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_7.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ カフェ系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_8.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 動物病院系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_9.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ インテリア系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_10.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ ヘアーサロン系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_11.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ ショップ系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_12.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ アウトドア系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_13.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ リフォーム系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_15.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 法律事務所系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_16.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ お米農家系',
                            'description' => '',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_17.php',
                            'public' => false,
                        ],
                    ]
                ],
                 'service' => [
                    'label' => 'サービス紹介',
                    'templates' => [
                        [
                            'name' => 'サービス紹介ページ 01',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'サービス紹介ページ 施術メニュー',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'サービス紹介ページ 法律事務所',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'サービス紹介ページ 会計事務所',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_4.php',
                            'public' => false,
                        ],
                    ]
                ],
                'company' => [
                    'label' => '会社情報',
                    'templates' => [
                        [
                            'name' => '会社概要ページ 01',
                            'description' => '会社情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/company/ptn_1.php',
                            'public' => true,
                        ],
                         [
                            'name' => '会社概要ページ 02',
                            'description' => '会社情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/company/ptn_2.php',
                            'public' => false,
                        ],
                         [
                            'name' => '会社概要ページ クリニック系',
                            'description' => '会社情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/company/ptn_3.php',
                            'public' => false,
                        ],
                    ]
                ],
                'contact' => [
                    'label' => 'お問合わせページ',
                    'templates' => [
                        [
                            'name' => 'お問合わせページ 01',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_1/',
                            'path' => 'page_template/contact/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'お問合わせページ 02',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_2/',
                            'path' => 'page_template/contact/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'お問合わせページ 03',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_3/',
                            'path' => 'page_template/contact/ptn_3.php',
                            'public' => false,
                        ],
                         [
                            'name' => 'お問合わせページ 04',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_4/',
                            'path' => 'page_template/contact/ptn_4.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'お問合わせページ 05',
                            'description' => 'LiteWordで実際に使用しているお問合わせフォームのページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_5/',
                            'path' => 'page_template/contact/ptn_5.php',
                            'public' => false,
                        ],
                         [
                            'name' => 'お問合わせページ 06',
                            'description' => 'LiteWordで実際に使用しているお問合わせフォームのページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_6/',
                            'path' => 'page_template/contact/ptn_6.php',
                            'public' => false,
                        ],
                         
                    ]
                ],
                'profile' => [
                    'label' => '自己紹介・プロフィール',
                    'templates' => [
                        [
                            'name' => '自己紹介ページ 01',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => '自己紹介ページ 02',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => '自己紹介ページ 占い師系',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => '自己紹介ページ 税理士系',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_4.php',
                            'public' => false,
                        ],
                        [
                            'name' => '自己紹介ページ 英会話教室系',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_5.php',
                            'public' => false,
                        ],
                    ]
                ],
                'access' => [
                    'label' => 'アクセス・地図',
                    'templates' => [
                        [
                            'name' => 'アクセスページ 01',
                            'description' => 'アクセス情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/access/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'アクセスページ 02',
                            'description' => 'アクセス情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/access/ptn_2.php',
                            'public' => false,
                        ],
                    ]
                ],
                 'recruit' => [
                    'label' => '採用情報',
                    'templates' => [
                        [
                            'name' => '採用情報ページ スタートアップ企業',
                            'description' => '採用情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/recruit/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => '採用情報ページ 不動産系',
                            'description' => '採用情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/recruit/ptn_3.php',
                            'public' => false,
                        ],
                    ]
                ],
                'pricing' => [
                    'label' => '料金表',
                    'templates' => []
                ],
                'cases' => [
                    'label' => '実績・事例',
                    'templates' => []
                ],
                'news' => [
                    'label' => 'お知らせ一覧',
                    'templates' => []
                ],
            ]
        ],
        'sales-framework' => [
            'label' => 'セールス系フレームワーク',
            'items' => [
                'aidma' => [
                    'label' => 'AIDMA（認知→行動）',
                    'templates' => []
                ],
                'aisas' => [
                    'label' => 'AISAS（検索型購買）',
                    'templates' => []
                ],
                'pasona' => [
                    'label' => 'PASONA（問題解決型）',
                    'templates' => []
                ],
                'pas' => [
                    'label' => 'PAS（シンプル訴求）',
                    'templates' => []
                ],
                'quest' => [
                    'label' => 'QUEST（教育型セールス）',
                    'templates' => []
                ],
                'fab' => [
                    'label' => 'FAB（機能→利益変換）',
                    'templates' => []
                ],
            ]
        ],
        'content-type' => [
            'label' => 'コンテンツ構成別',
            'items' => [
                'video-cta' => [
                    'label' => '動画メイン + CTA',
                    'templates' => []
                ],
                'story' => [
                    'label' => 'ストーリー型（起承転結）',
                    'templates' => []
                ],
                'comparison' => [
                    'label' => '比較表メイン',
                    'templates' => []
                ],
                'faq' => [
                    'label' => 'FAQ中心型',
                    'templates' => []
                ],
                'testimonial' => [
                    'label' => 'お客様の声メイン',
                    'templates' => []
                ],
                'before-after' => [
                    'label' => 'ビフォーアフター型',
                    'templates' => []
                ],
            ]
        ],
        'lead-generation' => [
            'label' => 'リード獲得特化',
            'items' => [
                'whitepaper' => [
                    'label' => 'ホワイトペーパーDL',
                    'templates' => []
                ],
                'webinar' => [
                    'label' => 'ウェビナー登録',
                    'templates' => []
                ],
                'consultation' => [
                    'label' => '無料相談予約',
                    'templates' => []
                ],
                'document' => [
                    'label' => '資料請求',
                    'templates' => []
                ],
                'newsletter' => [
                    'label' => 'メルマガ登録',
                    'templates' => []
                ],
                'assessment' => [
                    'label' => '無料診断・査定',
                    'templates' => []
                ],
            ]
        ],
        'industry' => [
            'label' => '業種別テンプレート',
            'items' => [
                'realestate' => [
                    'label' => '不動産（物件紹介）',
                    'templates' => []
                ],
                'beauty' => [
                    'label' => '美容・エステ',
                    'templates' => []
                ],
                'professional' => [
                    'label' => '士業（弁護士・税理士）',
                    'templates' => []
                ],
                'medical' => [
                    'label' => '医療・クリニック',
                    'templates' => []
                ],
                'school' => [
                    'label' => 'スクール・教室',
                    'templates' => []
                ],
                'saas' => [
                    'label' => 'SaaS・IT',
                    'templates' => []
                ],
                'ec' => [
                    'label' => 'ECサイト',
                    'templates' => []
                ],
            ]
        ],
        'campaign' => [
            'label' => 'キャンペーン型',
            'items' => [
                'limited-offer' => [
                    'label' => '期間限定オファー',
                    'templates' => []
                ],
                'countdown' => [
                    'label' => 'カウントダウン付',
                    'templates' => []
                ],
                'early-discount' => [
                    'label' => '早期割引',
                    'templates' => []
                ],
                'seasonal' => [
                    'label' => '季節イベント',
                    'templates' => []
                ],
                'launch' => [
                    'label' => 'プロダクトローンチ',
                    'templates' => []
                ],
            ]
        ],
    ];
}

/**
 * 現在選択されているテンプレートを取得
 */
function lw_get_current_templates() {
    $configs = lw_get_integrated_template_configs();
    $category = isset($_GET['lw_category']) ? sanitize_text_field($_GET['lw_category']) : '';
    $item = isset($_GET['lw_item']) ? sanitize_text_field($_GET['lw_item']) : '';
    
    if (empty($category) || empty($item)) {
        foreach ($configs as $cat_key => $cat_data) {
            foreach ($cat_data['items'] as $item_key => $item_data) {
                if (!empty($item_data['templates'])) {
                    return $item_data['templates'];
                }
            }
        }
        return [];
    }
    
    if (isset($configs[$category]['items'][$item]['templates'])) {
        return $configs[$category]['items'][$item]['templates'];
    }
    
    return [];
}

/**
 * テンプレートファイル取得エンドポイント
 */

function lw_replace_content_with_preview($content) {
    global $lw_preview_content;
    if (!empty($lw_preview_content)) {
        return do_blocks($lw_preview_content);
    }
    return $content;
}

/**
 * Ajax: ページ作成処理
 */
add_action('wp_ajax_lw_create_page_from_template', 'lw_create_page_from_template');

function lw_create_page_from_template() {
    if (!current_user_can('edit_pages')) {
        wp_die('権限がありません');
    }
    
    check_ajax_referer('lw_template_nonce', 'nonce');
    
    $template_path = sanitize_text_field($_POST['template_path']);
    $template_name = sanitize_text_field($_POST['template_name']);
    
    $has_subscription = defined('LW_HAS_SUBSCRIPTION') ? LW_HAS_SUBSCRIPTION : false;
    
    if (!$has_subscription) {
        $configs = lw_get_integrated_template_configs();
        $is_public = false;
        
        foreach ($configs as $category) {
            foreach ($category['items'] as $item) {
                foreach ($item['templates'] as $template) {
                    if ($template['path'] === $template_path) {
                        $is_public = isset($template['public']) && $template['public'] === true;
                        break 3;
                    }
                }
            }
        }
        
        if (!$is_public) {
            wp_send_json_error('このテンプレートはプレミアムプラン限定です');
            return;
        }
    }
    
    $template_path = str_replace('..', '', $template_path);
    $file_path = get_template_directory() . '/' . $template_path;
    
    if (!file_exists($file_path)) {
        wp_send_json_error('テンプレートファイルが見つかりません');
        return;
    }
    
    $content = file_get_contents($file_path);
    
    if ($content === false) {
        wp_send_json_error('ファイルの読み込みに失敗しました');
        return;
    }
    
    $title = $template_name . ' - ' . date('Y/m/d H:i');
    
    global $wpdb;
    
    $post_data = array(
        'post_author' => get_current_user_id(),
        'post_date' => current_time('mysql'),
        'post_date_gmt' => current_time('mysql', 1),
        'post_content' => $content,
        'post_title' => $title,
        'post_status' => 'draft',
        'comment_status' => 'closed',
        'ping_status' => 'closed',
        'post_name' => sanitize_title($title),
        'post_modified' => current_time('mysql'),
        'post_modified_gmt' => current_time('mysql', 1),
        'post_type' => 'page'
    );
    
    $wpdb->insert($wpdb->posts, $post_data);
    $page_id = $wpdb->insert_id;
    
    if ($page_id) {
        update_post_meta($page_id, '_lw_template_source', $template_name);
        update_post_meta($page_id, '_lw_template_path', $template_path);
        
        wp_send_json_success(array(
            'page_id' => $page_id,
            'title' => $title,
            'edit_link' => admin_url('post.php?post=' . $page_id . '&action=edit')
        ));
    } else {
        wp_send_json_error('ページの作成に失敗しました');
    }
}

/**
 * サイドナビゲーション生成
 */
function lw_template_side_nav() {
    $configs = lw_get_integrated_template_configs();
    $current_category = isset($_GET['lw_category']) ? sanitize_text_field($_GET['lw_category']) : '';
    $current_item = isset($_GET['lw_item']) ? sanitize_text_field($_GET['lw_item']) : '';
    
    ?>
    <div class="lw-template-side-nav">
        <ul>
            <?php foreach ($configs as $category_key => $category) : 
                $has_templates_in_category = false;
                foreach ($category['items'] as $item) {
                    if (!empty($item['templates'])) {
                        $has_templates_in_category = true;
                        break;
                    }
                }
                
                if (!$has_templates_in_category) {
                    continue;
                }
            ?>
                <li>
                    <div class="a"><?php echo esc_html($category['label']); ?></div>
                    <ul>
                        <?php foreach ($category['items'] as $item_key => $item) : 
                            if (empty($item['templates'])) {
                                continue;
                            }
                            
                            $url = admin_url('admin.php?page=lw_page_template_insert&lw_category=' . $category_key . '&lw_item=' . $item_key);
                            $is_active = ($current_category === $category_key && $current_item === $item_key);
                            $template_count = count($item['templates']);
                            $count_display = ' (' . $template_count . ')';
                        ?>
                            <li>
                                <a href="<?php echo esc_url($url); ?>" 
                                   class="<?php echo $is_active ? 'active' : ''; ?>">
                                    <?php echo esc_html($item['label'] . $count_display); ?>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php
}

/**
 * 管理画面ページ
 */
function lw_page_template_insert_page() {
    $templates = lw_get_current_templates();
    $nonce = wp_create_nonce('lw_template_nonce');
    $rest_nonce = wp_create_nonce('wp_rest');
    $has_subscription = defined('LW_HAS_SUBSCRIPTION') ? LW_HAS_SUBSCRIPTION : false;
    ?>
    <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri() . '/functions/lw_page_template_insert/style.css'); ?>">
    <?=lw_template_side_nav()?>
    <div class="wrap lw-template-wrapper">
        <div class="none_plugin_message"></div>

        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>

        <div class="site-navigation">
            <div class="nav-dots"></div>
        </div>

        <div class="main-container"></div>
        
        <div class="lw-popup-overlay" id="lw-loading-popup">
            <div class="lw-popup-box">
                <div class="lw-popup-spinner"></div>
                <h3>処理中...</h3>
                <p>しばらくお待ちください</p>
            </div>
        </div>
        
        <div class="lw-popup-overlay" id="lw-success-popup">
            <div class="lw-popup-box lw-success">
                <div class="lw-popup-icon">✓</div>
                <h3>作成完了！</h3>
                <p id="lw-success-message"></p>
                <div class="lw-popup-actions">
                    <button class="lw-btn lw-btn-primary" id="lw-edit-page">
                        編集画面を開く
                    </button>
                    <button class="lw-btn lw-btn-secondary" onclick="closePopup('lw-success-popup')">
                        閉じる
                    </button>
                </div>
            </div>
        </div>
        
        <div class="lw-popup-overlay" id="lw-error-popup">
            <div class="lw-popup-box lw-error">
                <div class="lw-popup-icon">✕</div>
                <h3>エラー</h3>
                <p id="lw-error-message"></p>
                <div class="lw-popup-actions">
                    <button class="lw-btn lw-btn-primary" onclick="closePopup('lw-error-popup')">
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    </div>
    <style>
        .lw-admin-notice-info{
            display: none;
        }
    </style>
    
    <script>
        function closePopup(popupId) {
            document.getElementById(popupId).classList.remove('show');
        }
        
        jQuery(document).ready(function($) {
            const templates = <?php echo json_encode($templates); ?>;
            const ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
            const restUrl = '<?php echo get_rest_url(null, 'lw-template/v1/get-template'); ?>';
            const restRenderUrl = '<?php echo get_rest_url(null, 'lw-template/v1/render-template'); ?>';
            const nonce = '<?php echo $nonce; ?>';
            const restNonce = '<?php echo $rest_nonce; ?>';
            const previewNonce = '<?php echo wp_create_nonce('lw_template_preview'); ?>';
            const siteUrl = '<?php echo home_url(); ?>';
            const hasSubscription = <?php echo $has_subscription ? 'true' : 'false'; ?>;
            
            const isBlockEditor = typeof wp !== 'undefined' && wp.blocks;
            const currentUrl = window.location.href;
            const isNewPage = currentUrl.includes('post-new.php') && currentUrl.includes('post_type=page');
            
            class TemplateManager {
                constructor() {
                    this.currentTemplate = 0;
                    this.isScrolling = false;
                    this.container = document.querySelector('.main-container');
                    this.progressBar = document.querySelector('.progress-fill');
                    this.navDots = document.querySelector('.nav-dots');
                    
                    this.init();
                }
                
                init() {
                    this.createTemplateSections();
                    this.createNavigation();
                    this.setupEventListeners();
                    this.setupIntersectionObserver();
                    this.showTemplate(0);
                }
                
                createTemplateSections() {
                    templates.forEach((template, index) => {
                        const isAccessible = hasSubscription || template.public !== false;
                        const isPremiumOnly = !hasSubscription && template.public === false;
                        const hasPreviewUrl = template.preview_url && template.preview_url.trim() !== '';
                        
                        const sectionHTML = `
                            <div class="site-section ${isPremiumOnly ? 'premium-only' : ''}" data-index="${index}">
                                <div class="site-info">
                                    <h2>${template.name}</h2>
                                    <p>${template.description}</p>
                                    ${isPremiumOnly ? '<p class="premium-badge">🔒 プレミアムプラン限定</p>' : ''}
                                </div>
                                <div class="preview-container">
                                    <div class="device-preview desktop-preview">
                                        <div class="device-header">
                                            <span class="device-label">Desktop (1400px)</span>
                                        </div>
                                        <div class="thumbnail-preview">
                                            <div class="loading-state">
                                                <div class="spinner"></div>
                                                <p>Loading...</p>
                                            </div>
                                            ${hasPreviewUrl 
                                                ? `<iframe data-src="${template.preview_url}" data-type="url" frameborder="0" style="display: none;"></iframe>`
                                                : `<iframe data-path="${template.path}" data-type="render" frameborder="0" style="display: none;"></iframe>`
                                            }
                                        </div>
                                    </div>
                                    <div class="device-preview mobile-preview">
                                        <div class="device-header">
                                            <span class="device-label">Mobile (375px)</span>
                                        </div>
                                        <div class="phone-frame">
                                            <div class="phone-screen">
                                                <div class="loading-state">
                                                    <div class="spinner"></div>
                                                    <p>Loading...</p>
                                                </div>
                                                ${hasPreviewUrl 
                                                    ? `<iframe data-src="${template.preview_url}" data-type="url" frameborder="0" style="display: none;"></iframe>`
                                                    : `<iframe data-path="${template.path}" data-type="render" frameborder="0" style="display: none;"></iframe>`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="action-buttons">
                                    ${hasPreviewUrl ? `
                                        <button class="open-site-button" onclick="window.open('${template.preview_url}', '_blank')">
                                            フルサイトを開く
                                        </button>
                                    ` : ''}
                                    ${isNewPage && isBlockEditor && isAccessible ? `
                                        <button class="insert-template-button" 
                                                data-path="${template.path}" 
                                                data-name="${template.name}">
                                            エディタに挿入
                                        </button>
                                    ` : ''}
                                    ${isAccessible ? `
                                        <button class="use-template-button new-page" 
                                                data-path="${template.path}" 
                                                data-name="${template.name}">
                                            新規ページを作成
                                        </button>
                                    ` : `
                                        <button class="premium-locked-button" disabled>
                                            🔒 プレミアムプラン限定
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                        this.container.innerHTML += sectionHTML;
                    });
                    
                    this.setupTemplateButtons();
                }
                
                setupTemplateButtons() {
                    $('.use-template-button').on('click', function() {
                        const templatePath = $(this).data('path');
                        const templateName = $(this).data('name');
                        const $btn = $(this);
                        
                        $btn.prop('disabled', true).text('処理中...');
                        $('#lw-loading-popup').addClass('show');
                        
                        $.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'lw_create_page_from_template',
                                template_path: templatePath,
                                template_name: templateName,
                                nonce: nonce
                            },
                            success: function(response) {
                                $('#lw-loading-popup').removeClass('show');
                                
                                if (response.success) {
                                    $('#lw-success-message').html(`
                                        タイトル: <strong>${response.data.title}</strong>
                                    `);
                                    $('#lw-edit-page').off('click').on('click', function() {
                                        window.location.href = response.data.edit_link;
                                    });
                                    $('#lw-success-popup').addClass('show');
                                } else {
                                    $('#lw-error-message').text(response.data || 'エラーが発生しました');
                                    $('#lw-error-popup').addClass('show');
                                }
                                
                                $btn.prop('disabled', false).text('新規ページを作成');
                            },
                            error: function(xhr, status, error) {
                                $('#lw-loading-popup').removeClass('show');
                                $('#lw-error-message').text('通信エラー: ' + error);
                                $('#lw-error-popup').addClass('show');
                                $btn.prop('disabled', false).text('新規ページを作成');
                            }
                        });
                    });
                    
                    $('.insert-template-button').on('click', function() {
                        const templatePath = $(this).data('path');
                        const templateName = $(this).data('name');
                        const $btn = $(this);
                        
                        $btn.prop('disabled', true).text('取得中...');
                        
                        fetch(restUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-WP-Nonce': restNonce
                            },
                            body: JSON.stringify({
                                template_path: templatePath
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                insertIntoBlockEditor(data.content);
                                showNotification('テンプレートを挿入しました', 'success');
                            } else {
                                showNotification('テンプレートの取得に失敗しました', 'error');
                            }
                            $btn.prop('disabled', false).text('エディタに挿入');
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            showNotification('エラーが発生しました', 'error');
                            $btn.prop('disabled', false).text('エディタに挿入');
                        });
                    });
                }
                
                createNavigation() {
                    templates.forEach((_, index) => {
                        const dot = document.createElement('div');
                        dot.className = 'nav-dot';
                        dot.addEventListener('click', () => this.goToTemplate(index));
                        this.navDots.appendChild(dot);
                    });
                }
                
                setupEventListeners() {
                    this.container.addEventListener('wheel', (e) => {
                        e.preventDefault();
                        
                        if (this.isScrolling) return;
                        
                        const delta = e.deltaY;
                        if (delta > 0 && this.currentTemplate < templates.length - 1) {
                            this.nextTemplate();
                        } else if (delta < 0 && this.currentTemplate > 0) {
                            this.prevTemplate();
                        }
                    });
                    
                    document.addEventListener('keydown', (e) => {
                        if (this.isScrolling) return;
                        
                        switch(e.key) {
                            case 'ArrowDown':
                            case 'PageDown':
                                e.preventDefault();
                                this.nextTemplate();
                                break;
                            case 'ArrowUp':
                            case 'PageUp':
                                e.preventDefault();
                                this.prevTemplate();
                                break;
                        }
                    });
                    
                    let startY = 0;
                    this.container.addEventListener('touchstart', (e) => {
                        startY = e.touches[0].clientY;
                    });
                    
                    this.container.addEventListener('touchend', (e) => {
                        if (this.isScrolling) return;
                        
                        const endY = e.changedTouches[0].clientY;
                        const diff = startY - endY;
                        
                        if (Math.abs(diff) > 50) {
                            if (diff > 0) {
                                this.nextTemplate();
                            } else {
                                this.prevTemplate();
                            }
                        }
                    });
                }
                
                setupIntersectionObserver() {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const index = parseInt(entry.target.dataset.index);
                                this.loadTemplateContent(index);
                                entry.target.classList.add('visible');
                            }
                        });
                    }, {
                        threshold: 0.5
                    });
                    
                    document.querySelectorAll('.site-section').forEach(section => {
                        observer.observe(section);
                    });
                }
                
                loadTemplateContent(index) {
                    const section = document.querySelector(`[data-index="${index}"]`);
                    const iframes = section.querySelectorAll('iframe[data-src], iframe[data-path]');

                    iframes.forEach(iframe => {
                        if (iframe.src) return;

                        const type = iframe.dataset.type;

                        if (type === 'url') {
                            iframe.src = iframe.dataset.src;
                            iframe.onload = () => {
                                iframe.style.display = 'block';
                                const loadingState = iframe.parentElement.querySelector('.loading-state');
                                if (loadingState) {
                                    loadingState.style.display = 'none';
                                }
                            };
                        } else if (type === 'render') {
                            const templatePath = iframe.dataset.path;
                            // srcdocではなくURLで直接読み込む
                            const previewUrl = `${siteUrl}/?lw_template_preview=1&template_path=${encodeURIComponent(templatePath)}&_wpnonce=${previewNonce}`;
                            iframe.src = previewUrl;
                            iframe.onload = () => {
                                iframe.style.display = 'block';
                                const loadingState = iframe.parentElement.querySelector('.loading-state');
                                if (loadingState) {
                                    loadingState.style.display = 'none';
                                }
                            };
                            iframe.onerror = () => {
                                console.error('テンプレートの読み込みに失敗しました');
                                const loadingState = iframe.parentElement.querySelector('.loading-state');
                                if (loadingState) {
                                    loadingState.innerHTML = '<p style="color: red;">読み込みエラー</p>';
                                }
                            };
                        }
                    });
                }
                
                nextTemplate() {
                    if (this.currentTemplate < templates.length - 1) {
                        this.showTemplate(this.currentTemplate + 1);
                    }
                }
                
                prevTemplate() {
                    if (this.currentTemplate > 0) {
                        this.showTemplate(this.currentTemplate - 1);
                    }
                }
                
                goToTemplate(index) {
                    if (index >= 0 && index < templates.length && index !== this.currentTemplate) {
                        this.showTemplate(index);
                    }
                }
                
                showTemplate(index) {
                    this.isScrolling = true;
                    this.currentTemplate = index;
                    
                    const targetY = index * window.innerHeight;
                    
                    this.container.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                    
                    const progress = (index / (templates.length - 1)) * 100;
                    this.progressBar.style.width = progress + '%';
                    
                    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                    
                    document.querySelectorAll('.site-section').forEach((section, i) => {
                        section.classList.toggle('active', i === index);
                    });
                    
                    setTimeout(() => {
                        this.isScrolling = false;
                    }, 800);
                    
                    this.loadTemplateContent(index);
                }
            }
            
            function insertIntoBlockEditor(content) {
                if (!wp || !wp.blocks || !wp.data) {
                    alert('ブロックエディタが利用できません');
                    return;
                }
                
                const { resetBlocks, insertBlocks } = wp.data.dispatch('core/block-editor');
                const blocks = wp.blocks.parse(content);
                const currentBlocks = wp.data.select('core/block-editor').getBlocks();
                
                if (currentBlocks.length > 0) {
                    if (window.confirm('現在の内容を置き換えますか？\n（「キャンセル」で追加挿入）')) {
                        resetBlocks(blocks);
                    } else {
                        insertBlocks(blocks);
                    }
                } else {
                    insertBlocks(blocks);
                }
            }
            
            function showNotification(message, type = 'info') {
                if (wp && wp.data && wp.data.dispatch('core/notices')) {
                    wp.data.dispatch('core/notices').createNotice(
                        type,
                        message,
                        {
                            isDismissible: true,
                            type: 'snackbar'
                        }
                    );
                } else {
                    alert(message);
                }
            }
            
            if (templates.length > 0) {
                new TemplateManager();
            } else {
                $('.main-container').html('<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 18px; color: #999;">このカテゴリーにはテンプレートがまだ登録されていません。</div>');
                $('.progress-bar, .site-navigation').hide();
            }
        });
    </script>
    <?php
}