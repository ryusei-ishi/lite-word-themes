<?php
/**
 * Plugin Name: LiteWord Manual Viewer
 * Description: LiteWordテーマの操作マニュアルを表示
 * Version: 2.4
 */

// ダッシュボードにメニューを追加
add_action('admin_menu', 'lw_manual_add_menu');

function lw_manual_add_menu() {
    add_menu_page(
        'LiteWord操作マニュアル',
        '旧）マニュアル',
        'manage_options',
        'lw-manual-viewer',
        'lw_manual_display_page',
        'dashicons-book-alt',
        3
    );
}

// プレミアムユーザーかどうかを判定する関数（試用期間を除外）
function lw_is_premium_user_excluding_trial() {
    // LW_HAS_SUBSCRIPTIONが定義されていない場合はfalse
    if (!defined('LW_HAS_SUBSCRIPTION') || !LW_HAS_SUBSCRIPTION) {
        return false;
    }
    
    // 試用期間中かどうかをチェック
    if (class_exists('LwTemplateSetting')) {
        $templateSetting = new LwTemplateSetting();
        
        // paid-lw-parts-sub-hbjkjhkljhをチェック
        $paid_sub = $templateSetting->get_template_setting_by_id('paid-lw-parts-sub-hbjkjhkljh');
        if ($paid_sub && intval($paid_sub['active_flag']) === 1) {
            return true;
        }
        
        // sub_pre_setをチェック
        $sub_pre_set = $templateSetting->get_template_setting_by_id('sub_pre_set');
        if ($sub_pre_set && intval($sub_pre_set['active_flag']) === 1) {
            return true;
        }
    }
    
    return false;
}

// マニュアルページの設定を取得する関数
function lw_manual_get_pages() {
    return array(
        'getting-started' => array(
            'title' => '1.導入編',
            'description' => '',
            'id' => null,  // nullの場合はローカルファイルから読み込む
            'path' => '/functions/manual/pages/1.php',  // テーマディレクトリからの相対パス
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'theme-settings' => array(
            'title' => '2.共通デザイン基本設定',
            'description' => '',
            'id' => null,
            'path' => '/functions/manual/pages/2.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'performance' => array(
            'title' => '3.固定ページの編集方法',
            'description' => '各固定ページごとのデザインの方法を詳しく解説',
            'id' => null,
            'path' => '/functions/manual/pages/3.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'troubleshooting' => array(
            'title' => '5.投稿ページのレイアウト設定',
            'description' => '投稿ページのレイアウトやデザインの設定方法',
            'id' => null,
            'path' => '/functions/manual/pages/4.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'archive-settings' => array(
            'title' => '6.アーカイブページの設定',
            'description' => 'カテゴリーページ、タグページのデザインなどの設定方法',
            'id' => null,
            'path' => '/functions/manual/pages/5.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'contact-form' => array(
            'title' => '7.お問合わせフォームの設置',
            'description' => 'お問合わせフォームの設置方法について解説',
            'id' => null,
            'path' => '/functions/manual/pages/6.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'seo-settings' => array(
            'title' => '8.SEO設定',
            'description' => '検索エンジン最適化のための設定方法',
            'id' => null,
            'path' => '/functions/manual/pages/7.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'useful-features' => array(
            'title' => '9.その他の便利な設定',
            'description' => 'マイパーツの使い方やカウントダウンタイマーなどの便利機能',
            'id' => null,
            'path' => '/functions/manual/pages/8.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'gtm-integration' => array(
            'title' => 'GTM連携ガイド',
            'description' => 'Googleタグマネージャーとの連携方法について解説',
            'id' => null,
            'path' => '/functions/manual/pages/gtm-integration.php',
            'post_type' => 'lw_my_parts',
            'premium' => false
        ),
        'web-marketing-1' => array(
            'title' => 'サイト制作の流れ',
            'description' => '',
            'id' => null,
            'path' => '/functions/manual/pages/web_strategy_1.php',
            'post_type' => 'lw_my_parts',
            'premium' => true
        ),
         'web-marketing-2' => array(
            'title' => 'WordPressを活用したWEB集客の基礎',
            'description' => '',
            'id' => null,
            'path' => '/functions/manual/pages/web_strategy_2.php',
            'post_type' => 'lw_my_parts',
            'premium' => true
        ),
         'web-marketing-3' => array(
            'title' => 'WordPress教室が良い理由と戦略について',
            'description' => '',
            'id' => null,
            'path' => '/functions/manual/pages/wp_school_1.php',
            'post_type' => 'lw_my_parts',
            'premium' => true
        ),
    );
}

// メインの表示関数
function lw_manual_display_page() {
    $pages = lw_manual_get_pages();
    $current_page = isset($_GET['manual_page']) ? sanitize_text_field($_GET['manual_page']) : '';
    $is_premium_user = lw_is_premium_user_excluding_trial();
    
    ?>
    <link rel="stylesheet" href="<?= get_template_directory_uri(); ?>/assets/css/reset.css">
    <link rel="stylesheet" href="<?= get_template_directory_uri(); ?>/assets/css/common.css">
    <link rel="stylesheet" href="<?= get_template_directory_uri(); ?>/assets/css/page.css">
    <link rel="stylesheet" href="<?= get_template_directory_uri(); ?>/assets/css/page-additional.css">
    <link rel="stylesheet" href="<?= get_template_directory_uri(); ?>/assets/css/register_block.css">

    <style>
        /* ===== 基本リセット ===== */
        #wpbody-content { padding-bottom: 0; }
        #wpcontent { padding-left: 0; }
        #wpfooter { display: none; }
        .wp-menu-name { font-size: 0.9em; }

        /* ===== ページ全体 ===== */
        .lw-manual-page {
            min-height: 100vh;
            padding: 40px 40px 80px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* ===== ラッパー ===== */
        .lw-manual-wrapper {
            max-width: 1100px;
            margin: 0 auto;
        }

        /* ===== ヘッダー ===== */
        .lw-manual-page-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .lw-manual-page-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #2b72b5, #3d8fd1);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(43, 114, 181, 0.3);
        }

        .lw-manual-page-icon .dashicons {
            font-size: 40px;
            width: 40px;
            height: 40px;
            color: #fff;
        }

        .lw-manual-page-title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 8px;
        }

        .lw-manual-page-subtitle {
            font-size: 15px;
            color: #6b7280;
            margin: 0;
        }

        /* ===== カードグリッド ===== */
        .lw-manual-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        /* ===== マニュアルカード ===== */
        .lw-manual-button {
            background: #fff;
            border: none;
            border-radius: 16px;
            padding: 24px;
            text-decoration: none;
            color: #1f2937;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            line-height: 1.5;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .lw-manual-button.active h3{
            color: #fff;
        } 
        .lw-manual-button::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #2b72b5, #3d8fd1);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .lw-manual-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(43, 114, 181, 0.15);
            color: #1f2937;
        }

        .lw-manual-button:hover::before {
            opacity: 1;
        }

        .lw-manual-button.active {
            background: linear-gradient(135deg, #2b72b5, #3d8fd1);
            color: #fff;
            box-shadow: 0 8px 25px rgba(43, 114, 181, 0.3);
        }

        .lw-manual-button.active::before {
            opacity: 0;
        }

        .lw-manual-button.premium-locked {
            background: #f9fafb;
        }

        .lw-manual-button.premium-locked::after {
            content: 'Premium';
            position: absolute;
            bottom: 12px;
            right: 12px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            letter-spacing: 0.5px;
        }

        .lw-manual-button h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            line-height: 1.4;
        }



        .lw-manual-button p {
            margin: 0;
            font-size: 13px;
            opacity: 0.7;
            line-height: 1.5;
        }

        .lw-manual-button.active p {
            opacity: 0.9;
        }

        /* ===== コンテンツエリア ===== */
        .lw-manual-content {
            background: #fff;
            padding: 48px 56px;
            border-radius: 20px;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
            position: relative;
        }

        .lw-manual-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }

        /* ===== コンテンツヘッダー ===== */
        .lw-manual-header {
            border-bottom: none;
            padding-bottom: 24px;
            margin-bottom: 32px;
            position: relative;
        }

        .lw-manual-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #2b72b5, #3d8fd1);
            border-radius: 2px;
        }

        .lw-manual-header h2 {
            margin: 0 0 8px 0;
            font-size: 26px;
            font-weight: 700;
            color: #1f2937;
            line-height: 1.4;
        }

        .lw-manual-header p {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
        }

        /* ===== ローディング ===== */
        .lw-manual-loading {
            text-align: center;
            padding: 60px 40px;
            color: #6b7280;
        }

        .lw-manual-loading .spinner {
            margin-bottom: 16px;
        }

        .lw-manual-loading p {
            margin: 0;
            font-size: 14px;
        }

        /* ===== プレミアム通知 ===== */
        .premium-notice {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: none;
            border-left: 4px solid #f59e0b;
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.15);
        }

        .premium-notice h3 {
            color: #92400e;
            margin: 0 0 12px 0;
            font-size: 18px;
            font-weight: 600;
        }

        .premium-notice p {
            color: #b45309;
            margin: 0 0 20px 0;
            font-size: 14px;
            line-height: 1.6;
        }

        .premium-notice a {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #fff;
            padding: 12px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .premium-notice a:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
            color: #fff;
        }

        /* ===== 更新ボタン ===== */
        .lw-manual-footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
        }

        .lw-manual-refresh-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #f3f4f6;
            border: none;
            border-radius: 10px;
            color: #4b5563;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .lw-manual-refresh-btn:hover {
            background: #e5e7eb;
            color: #1f2937;
        }

        .lw-manual-refresh-btn .dashicons {
            font-size: 16px;
            width: 16px;
            height: 16px;
        }

        /* ===== 画像スタイル ===== */
        .is-style-image_w_100 img {
            height: auto;
            width: 100%;
        }

        /* ===== アンカーリンクのスクロールオフセット ===== */
        #lw-manual-body h2[id],
        #lw-manual-body h3[id] {
            scroll-margin-top: 52px; /* 管理バー(32px) + 余白(20px) */
        }

        /* ===== 戻るリンク ===== */
        .lw-manual-back {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 24px;
            color: #6b7280;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s ease;
        }

        .lw-manual-back:hover {
            color: #2b72b5;
        }

        .lw-manual-back .dashicons {
            font-size: 16px;
            width: 16px;
            height: 16px;
        }

        /* ===== レスポンシブ ===== */
        @media (max-width: 782px) {
            .lw-manual-page {
                padding: 24px 16px 60px;
            }

            .lw-manual-content {
                padding: 32px 24px;
            }

            .lw-manual-buttons {
                grid-template-columns: 1fr;
            }

            .lw-manual-header h2 {
                font-size: 22px;
            }
        }
    </style>
    <div class="none_plugin_message"></div>
    <div class="lw-manual-page">
        <div class="lw-manual-wrapper">
            <!-- ページヘッダー -->
            <div class="lw-manual-page-header">
                <div class="lw-manual-page-icon">
                    <span class="dashicons dashicons-book-alt"></span>
                </div>
                <h1 class="lw-manual-page-title">LiteWord 操作マニュアル</h1>
                <p class="lw-manual-page-subtitle">表示したいマニュアルを選択してください</p>
                <div style="margin-top: 20px; padding: 16px 24px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; text-align: left; max-width: 700px; margin-left: auto; margin-right: auto;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.7;">
                        <strong>お知らせ：</strong>LiteWordは2025年12月15日に管理画面を大幅リニューアルいたしました。<br>
                        新しい管理画面に対応したマニュアルは現在制作中です。完成までしばらくお待ちください。
                    </p>
                </div>
            </div>

            <!-- ボタン一覧 -->
            <div class="lw-manual-buttons">
                <?php foreach ($pages as $key => $page):
                    $is_premium_content = isset($page['premium']) && $page['premium'] === true;
                    $is_locked = $is_premium_content && !$is_premium_user;
                ?>
                    <a href="<?php echo admin_url('admin.php?page=lw-manual-viewer&manual_page=' . $key); ?>"
                       class="lw-manual-button <?php echo ($current_page === $key) ? 'active' : ''; ?> <?php echo $is_locked ? 'premium-locked' : ''; ?>">
                        <h3><?php echo esc_html($page['title']); ?></h3>
                        <p><?php echo esc_html($page['description']); ?></p>
                    </a>
                <?php endforeach; ?>
            </div>
        
            <!-- コンテンツ表示エリア -->
            <?php if ($current_page && isset($pages[$current_page])):
                $is_premium_content = isset($pages[$current_page]['premium']) && $pages[$current_page]['premium'] === true;
            ?>
                <!-- 戻るリンク -->
                <a href="<?php echo admin_url('admin.php?page=lw-manual-viewer'); ?>" class="lw-manual-back">
                    <span class="dashicons dashicons-arrow-left-alt2"></span>
                    マニュアル一覧に戻る
                </a>

                <div class="lw-manual-content">
                    <div class="lw-manual-header">
                        <h2><?php echo esc_html($pages[$current_page]['title']); ?></h2>
                        <p><?php echo esc_html($pages[$current_page]['description']); ?></p>
                    </div>

                    <div id="lw-manual-body" class="post_style" style="padding:0;">
                        <div class="lw-manual-loading">
                            <span class="spinner is-active" style="float: none;"></span>
                            <p>マニュアルを読み込んでいます...</p>
                        </div>
                    </div>

                    <!-- 更新ボタン -->
                    <div class="lw-manual-footer">
                        <button id="lw-manual-refresh" class="lw-manual-refresh-btn">
                            <span class="dashicons dashicons-update"></span>
                            再読み込み
                        </button>
                    </div>
                </div>

            <script>
            jQuery(document).ready(function($) {
                var isPremiumContent = <?php echo json_encode($is_premium_content); ?>;
                var isPremiumUser = <?php echo json_encode($is_premium_user); ?>;
                
                // 現在のページが選択されているか確認
                var currentPage = '<?php echo $current_page; ?>';
                
                // ページが選択されている場合のみコンテンツを読み込み
                if (currentPage) {
                    lw_manual_load_content();
                }
                
                function lw_manual_load_content() {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'lw_manual_get_content',
                            page_id: <?php echo isset($pages[$current_page]['id']) && !empty($pages[$current_page]['id']) ? $pages[$current_page]['id'] : 'null'; ?>,
                            path: '<?php echo isset($pages[$current_page]['path']) ? esc_js($pages[$current_page]['path']) : ''; ?>',
                            post_type: '<?php echo isset($pages[$current_page]) ? $pages[$current_page]['post_type'] : 'page'; ?>',
                            is_premium_content: isPremiumContent,
                            nonce: '<?php echo wp_create_nonce('lw_manual_nonce'); ?>'
                        },
                        success: function(response) {
                            if (response.success) {
                                var content = response.data;
                                
                                // コンテンツを一時的なdivに入れて処理
                                var $tempDiv = $('<div>').html(content);
                                
                                // APIから来た既存の目次を削除
                                $tempDiv.find('.toc_content').remove();
                                
                                // クリーンなコンテンツを設定
                                $('#lw-manual-body').html($tempDiv.html());

                                // 画像が多いので、少し長めに待機してから処理
                                setTimeout(function() {
                                    processContent();
                                }, 2000); // 2秒待機
                                
                            } else {
                                $('#lw-manual-body').html(
                                    '<div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 5px;">' +
                                    '<h3 style="color: #dc2626;">読み込みエラー</h3>' +
                                    '<p>' + response.data + '</p>' +
                                    '</div>'
                                );
                            }
                        },
                        error: function() {
                            $('#lw-manual-body').html(
                                '<div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 5px;">' +
                                '<h3 style="color: #dc2626;">通信エラー</h3>' +
                                '<p>マニュアルの取得に失敗しました。</p>' +
                                '</div>'
                            );
                        }
                    });
                }
                
                // コンテンツを処理
                function processContent() {
                    // プレミアム制限を先に適用（目次生成前に非表示にする）
                    if (isPremiumContent && !isPremiumUser) {
                        lw_add_premium_restriction();
                    }

                    // 目次を生成（表示されている見出しのみ対象）
                    lw_generate_toc('#lw-manual-body');
                }
                
                // プレミアム制限を追加（修正版）
                function lw_add_premium_restriction() {
                    var $content = $('#lw-manual-body');
                    var $toc = $content.find('.toc_content').first();
                    var $firstH2 = $content.find('h2').not('.toc_content h2').first();
                    
                    if ($firstH2.length > 0) {
                        var premiumNotice = '<div class="premium-notice" id="premium-restriction">' +
                            '<h3>🔒 ここから先はプレミアム契約者限定のコンテンツです</h3>' +
                            '<p>このマニュアルの続きを読むには、LiteWordプレミアムプランへのご契約が必要です。</p>' +
                            '<p>プレミアムプランでは、全てのマニュアルへのアクセスが可能です。</p>' +
                            '<a href="https://lite-word.com/yuryo-plan/" target="_blank">プレミアムプランの詳細はこちら</a>' +
                            '</div>';
                        
                        // プレミアム案内を最初のh2の直前に挿入
                        $(premiumNotice).insertBefore($firstH2);
                        
                        // 最初のh2から後ろのすべての要素を非表示
                        var hideElements = false;
                        $content.children().each(function() {
                            var $elem = $(this);
                            
                            // 最初のh2に到達したら、それ以降を非表示にする
                            if ($elem.is($firstH2)) {
                                hideElements = true;
                            }
                            
                            // 非表示フラグが立っていて、目次でもプレミアム案内でもない要素は非表示
                            if (hideElements && !$elem.hasClass('toc_content') && !$elem.hasClass('premium-notice')) {
                                $elem.hide();
                            }
                        });
                    }
                }
                
                // 目次を生成する関数（修正版）
                function lw_generate_toc(contentSelector) {
                    var $content = $(contentSelector);

                    // コンテンツ内のh2とh3を取得（表示されているもののみ）
                    var $h2headings = $content.find('h2:visible').not('.toc_content h2, .premium-notice h2');

                    // h2が3つ未満の場合は目次を生成しない
                    if ($h2headings.length < 3) {
                        return;
                    }

                    var $headings = $content.find('h2:visible, h3:visible').not('.toc_content h2, .toc_content h3, .premium-notice h2, .premium-notice h3');
                    
                    var tocHTML = '<div class="toc_content">';
                    tocHTML += '<div class="ttl">INDEX</div>';
                    tocHTML += '<ul class="toc_list">';
                    
                    var headingIndex = 0;
                    var currentH2Index = -1;
                    var h3Buffer = [];
                    
                    $headings.each(function() {
                        var $heading = $(this);
                        var headingText = $heading.text();
                        
                        // IDを設定
                        var uniqueId = 'lw-heading-' + headingIndex;
                        $heading.attr('id', uniqueId);
                        
                        if ($heading.is('h2')) {
                            // 前のh2に紐づくh3があれば追加
                            if (currentH2Index >= 0) {
                                if (h3Buffer.length > 0) {
                                    tocHTML += '<ul class="toc_list_sub">';
                                    tocHTML += h3Buffer.join('');
                                    tocHTML += '</ul>';
                                } else {
                                    tocHTML += '<ul class="toc_list_sub"></ul>';
                                }
                                tocHTML += '</li>';
                                h3Buffer = [];
                            }
                            
                            tocHTML += '<li>';
                            tocHTML += '<a href="#' + uniqueId + '" class="toc-link">';
                            tocHTML += '<div class="text">' + escapeHtml(headingText) + '</div>';
                            tocHTML += '</a>';
                            
                            currentH2Index = headingIndex;
                        } else if ($heading.is('h3')) {
                            var h3Item = '<li>';
                            h3Item += '<a href="#' + uniqueId + '" class="toc-link">';
                            h3Item += '<div class="text">' + escapeHtml(headingText) + '</div>';
                            h3Item += '</a>';
                            h3Item += '</li>';
                            h3Buffer.push(h3Item);
                        }
                        
                        headingIndex++;
                    });
                    
                    // 最後のh2に紐づくh3を追加
                    if (currentH2Index >= 0) {
                        if (h3Buffer.length > 0) {
                            tocHTML += '<ul class="toc_list_sub">';
                            tocHTML += h3Buffer.join('');
                            tocHTML += '</ul>';
                        } else {
                            tocHTML += '<ul class="toc_list_sub"></ul>';
                        }
                        tocHTML += '</li>';
                    }
                    
                    tocHTML += '</ul>';
                    tocHTML += '</div>';
                    
                    // 最初のh2を探す
                    var $firstH2 = $content.find('h2').not('.toc_content h2').first();
                    
                    if ($firstH2.length > 0) {
                        // 目次を最初のh2の直前に挿入
                        $(tocHTML).insertBefore($firstH2);
                    } else {
                        // h2がない場合は最初に挿入
                        $content.prepend(tocHTML);
                    }

                    // イベントを設定
                    bindTocEvents();
                }
                
                // 目次のイベントをバインド
                function bindTocEvents() {
                    $(document).off('click', '.toc-link').on('click', '.toc-link', function(e) {
                        e.preventDefault();

                        var href = $(this).attr('href');
                        var targetId = href.replace('#', '');
                        var $target = $('#' + targetId);

                        if ($target.length > 0) {
                            // ターゲットが非表示（プレミアム制限など）の場合はスクロールしない
                            if (!$target.is(':visible')) {
                                // プレミアム案内までスクロール
                                var $premiumNotice = $('#premium-restriction');
                                if ($premiumNotice.length > 0) {
                                    var adminBarHeight = $('#wpadminbar').outerHeight() || 0;
                                    var bodyScrollTop = $('body').scrollTop();
                                    var scrollTo = $premiumNotice.offset().top + bodyScrollTop - adminBarHeight - 20;
                                    $('body').animate({ scrollTop: scrollTo }, 600);
                                }
                                return false;
                            }

                            var adminBarHeight = $('#wpadminbar').outerHeight() || 0;
                            // bodyがスクロールコンテナの場合、offset()は現在のスクロール位置を考慮しないため加算
                            var bodyScrollTop = $('body').scrollTop();
                            var targetOffsetTop = $target.offset().top + bodyScrollTop;

                            // 固定オフセット（管理バー + 余白）
                            var offset = adminBarHeight + 20;
                            var scrollTo = targetOffsetTop - offset;

                            // bodyをスクロール
                            $('body').animate({
                                scrollTop: scrollTo
                            }, 600);
                        }

                        return false;
                    });
                }
                
                // HTMLエスケープ用関数
                function escapeHtml(text) {
                    var map = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#039;'
                    };
                    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
                }
                
                // 再読み込みボタン
                $('#lw-manual-refresh').on('click', function() {
                    $('#lw-manual-body').html(
                        '<div class="lw-manual-loading">' +
                        '<span class="spinner is-active" style="float: none;"></span>' +
                        '<p>マニュアルを再読み込みしています...</p>' +
                        '</div>'
                    );
                    
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'lw_manual_clear_cache',
                            page_id: <?php echo isset($pages[$current_page]['id']) && !empty($pages[$current_page]['id']) ? $pages[$current_page]['id'] : 'null'; ?>,
                            path: '<?php echo isset($pages[$current_page]['path']) ? esc_js($pages[$current_page]['path']) : ''; ?>',
                            post_type: '<?php echo isset($pages[$current_page]) ? $pages[$current_page]['post_type'] : 'page'; ?>',
                            nonce: '<?php echo wp_create_nonce('lw_manual_nonce'); ?>'
                        },
                        success: function() {
                            lw_manual_load_content();
                        }
                    });
                });
            });
            </script>
            
            <?php elseif (!empty($current_page)): ?>
                <div class="lw-manual-content">
                    <p style="color: #dc2626;">指定されたマニュアルページが見つかりません。</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

// Ajaxハンドラー：コンテンツ取得
add_action('wp_ajax_lw_manual_get_content', 'lw_manual_ajax_get_content');
function lw_manual_ajax_get_content() {
    // nonce確認
    if (!wp_verify_nonce($_POST['nonce'], 'lw_manual_nonce')) {
        wp_die('セキュリティチェックに失敗しました');
    }
    
    $page_id = isset($_POST['page_id']) && $_POST['page_id'] !== 'null' ? intval($_POST['page_id']) : null;
    $path = isset($_POST['path']) && !empty($_POST['path']) ? sanitize_text_field($_POST['path']) : null;
    $post_type = isset($_POST['post_type']) ? sanitize_text_field($_POST['post_type']) : 'page';
    
    $content = lw_manual_fetch_page_content($page_id, $post_type, $path);
    
    if ($content !== false) {
        wp_send_json_success($content);
    } else {
        wp_send_json_error('マニュアルの取得に失敗しました。ページが非公開になっているか、IDが正しくない可能性があります。');
    }
}

// Ajaxハンドラー：キャッシュクリア
add_action('wp_ajax_lw_manual_clear_cache', 'lw_manual_ajax_clear_cache');
function lw_manual_ajax_clear_cache() {
    if (!wp_verify_nonce($_POST['nonce'], 'lw_manual_nonce')) {
        wp_die('セキュリティチェックに失敗しました');
    }
    
    $page_id = isset($_POST['page_id']) && $_POST['page_id'] !== 'null' ? intval($_POST['page_id']) : null;
    $path = isset($_POST['path']) && !empty($_POST['path']) ? sanitize_text_field($_POST['path']) : null;
    $post_type = isset($_POST['post_type']) ? sanitize_text_field($_POST['post_type']) : 'page';
    
    // キャッシュキーを生成して削除
    if ($path) {
        $cache_key = 'lw_manual_content_local_' . md5($path);
    } else {
        $cache_key = 'lw_manual_content_' . $post_type . '_' . $page_id;
    }
    
    delete_transient($cache_key);
    
    wp_send_json_success();
}

// 外部ページコンテンツまたはローカルファイルを取得する関数
function lw_manual_fetch_page_content($page_id = null, $post_type = 'page', $path = null) {
    // pathが指定されている場合はローカルファイルから読み込む
    if ($path) {
        return lw_manual_fetch_local_content($path);
    }
    
    // page_idが指定されている場合はAPIから取得
    if ($page_id) {
        return lw_manual_fetch_api_content($page_id, $post_type);
    }
    
    return false;
}

// ローカルファイルからコンテンツを取得する関数
function lw_manual_fetch_local_content($path) {
    // キャッシュキーを生成（pathのハッシュを使用）
    $cache_key = 'lw_manual_content_local_' . md5($path);
    $cached = get_transient($cache_key);
    
    if ($cached !== false) {
        return $cached;
    }
    
    // テーマディレクトリのパスを取得
    $file_path = get_template_directory() . $path;
    
    // ファイルの存在確認
    if (!file_exists($file_path)) {
        error_log('LiteWord Manual: ファイルが見つかりません: ' . $file_path);
        return false;
    }
    
    // ファイルの読み込み
    $content = file_get_contents($file_path);
    
    if ($content === false) {
        error_log('LiteWord Manual: ファイルの読み込みに失敗しました: ' . $file_path);
        return false;
    }
    
    // キャッシュに保存（24時間）
    set_transient($cache_key, $content, 24 * HOUR_IN_SECONDS);
    
    return $content;
}

// APIからコンテンツを取得する関数（元のlw_manual_fetch_page_contentの処理）
function lw_manual_fetch_api_content($page_id, $post_type = 'page') {
    // キャッシュキーに投稿タイプを含める
    $cache_key = 'lw_manual_content_' . $post_type . '_' . $page_id;
    $cached = get_transient($cache_key);
    
    if ($cached !== false) {
        return $cached;
    }
    
    // 投稿タイプに応じたエンドポイントを設定
    $endpoint_type = ($post_type === 'page') ? 'pages' : $post_type;
    
    // エンドポイントの配列
    $endpoints = array(
        'https://lite-word.com/wp-json/wp/v2/' . $endpoint_type . '/' . $page_id,
        'https://lite-word.com/wp-json/wp/v2/' . $endpoint_type . '?include=' . $page_id,
        'https://lite-word.com/?rest_route=/wp/v2/' . $endpoint_type . '/' . $page_id,
    );
    
    $args = array(
        'timeout'     => 30,
        'redirection' => 5,
        'httpversion' => '1.1',
        'user-agent'  => 'WordPress/' . get_bloginfo('version') . '; ' . get_bloginfo('url'),
        'blocking'    => true,
        'headers'     => array(
            'Accept' => 'application/json',
        ),
        'cookies'     => array(),
        // 🔒 lite-word.com から取得した本文は wp-admin 上に描画されるため必ず検証する。
        //    外すと MITM でマニュアルHTMLを差し替えられ、管理者権限のXSSになる。
        'sslverify'   => true,
    );
    
    foreach ($endpoints as $url) {
        $response = wp_remote_get($url, $args);
        
        if (!is_wp_error($response)) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
            
            // 配列形式で返ってきた場合
            if (is_array($data) && isset($data[0]['content']['rendered'])) {
                $content = $data[0]['content']['rendered'];
                // キャッシュ時間を12時間に延長（負荷削減）
                set_transient($cache_key, $content, 12 * HOUR_IN_SECONDS);
                return $content;
            }
            
            // 単体オブジェクトで返ってきた場合
            if (isset($data['content']['rendered'])) {
                $content = $data['content']['rendered'];
                // キャッシュ時間を12時間に延長（負荷削減）
                set_transient($cache_key, $content, 12 * HOUR_IN_SECONDS);
                return $content;
            }
        }
    }
    
    return false;
}