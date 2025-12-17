<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord ダッシュボードカスタマイズ
 *
 * コンポーネント構成:
 * - components/news-widget/  : お知らせウィジェット
 * - components/page-tree/    : 固定ページツリー（ポップアップ表示）
 * - css/                     : 共通CSS
 * - js/                      : 共通JS
 */

define('LW_DASHBOARD_PATH', get_template_directory() . '/functions/dashboard_top/');
define('LW_DASHBOARD_URL', get_template_directory_uri() . '/functions/dashboard_top/');

// コンポーネント読み込み
require_once LW_DASHBOARD_PATH . 'components/news-widget/news-widget.php';
require_once LW_DASHBOARD_PATH . 'components/page-tree/page-tree.php';
require_once LW_DASHBOARD_PATH . 'components/instructions/instructions.php';
require_once LW_DASHBOARD_PATH . 'components/seo-check/seo-check.php';

// ダッシュボードウィジェットのカスタマイズ
add_action('wp_dashboard_setup', 'lw_dashboard_customize', 999);
function lw_dashboard_customize() {
    // 不要なウィジェットを削除
    remove_meta_box('dashboard_primary', 'dashboard', 'side');      // WordPress イベントとニュース
    remove_meta_box('dashboard_right_now', 'dashboard', 'normal');  // 概要
    remove_meta_box('dashboard_activity', 'dashboard', 'normal');   // アクティビティ
    remove_meta_box('dashboard_quick_press', 'dashboard', 'side');  // クイックドラフト
    remove_meta_box('dashboard_site_health', 'dashboard', 'normal'); // サイトヘルス

    // LiteWordお知らせウィジェットは削除（サイドバーに移行）
}

// ダッシュボードのCSS/JSを読み込み
add_action('admin_enqueue_scripts', 'lw_dashboard_enqueue_assets');
function lw_dashboard_enqueue_assets($hook) {
    if ($hook !== 'index.php') {
        return;
    }

    // メディアアップローダー用
    wp_enqueue_media();

    // 共通CSS
    wp_enqueue_style(
        'lw-dashboard-common',
        LW_DASHBOARD_URL . 'css/dashboard-common.css',
        array(),
        filemtime(LW_DASHBOARD_PATH . 'css/dashboard-common.css')
    );

    // ページツリーCSS
    wp_enqueue_style(
        'lw-page-tree',
        LW_DASHBOARD_URL . 'components/page-tree/page-tree.css',
        array('lw-dashboard-common'),
        filemtime(LW_DASHBOARD_PATH . 'components/page-tree/page-tree.css')
    );

    // お知らせウィジェットCSS
    wp_enqueue_style(
        'lw-news-widget',
        LW_DASHBOARD_URL . 'components/news-widget/news-widget.css',
        array('lw-dashboard-common'),
        filemtime(LW_DASHBOARD_PATH . 'components/news-widget/news-widget.css')
    );

    // ページツリーJS
    wp_enqueue_script(
        'lw-page-tree',
        LW_DASHBOARD_URL . 'components/page-tree/page-tree.js',
        array('jquery', 'jquery-ui-draggable', 'jquery-ui-droppable', 'jquery-ui-sortable'),
        filemtime(LW_DASHBOARD_PATH . 'components/page-tree/page-tree.js'),
        true
    );

    // JSに渡すデータ
    wp_localize_script('lw-page-tree', 'lwPageTree', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('lw_page_tree_nonce'),
        'editUrl' => admin_url('post.php?post=%d&action=edit')
    ));

    // ウィザードJS
    wp_enqueue_script(
        'lw-wizard',
        LW_DASHBOARD_URL . 'js/wizard.js',
        array('jquery', 'jquery-ui-sortable'),
        filemtime(LW_DASHBOARD_PATH . 'js/wizard.js') . '.5',
        true
    );

    // アクティベート状態をチェック
    $current_user_id = get_current_user_id();
    $access_token = get_user_meta($current_user_id, 'lw_target_shop_token', true);
    $is_activated = !empty($access_token);

    wp_localize_script('lw-wizard', 'lwWizard', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'adminUrl' => admin_url(),
        'nonce' => wp_create_nonce('lw_wizard_nonce'),
        'isPremium' => defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true,
        'isActivated' => $is_activated,
        'activateUrl' => admin_url('admin.php?page=lw_template_management'),
        'extensions' => array(
            'seo' => get_theme_mod('lw_extensions_seo_functions_switch', 'off') === 'on',
            'mailForm' => get_theme_mod('lw_extensions_mail_form_switch_all', 'off') === 'on'
        )
    ));

    // SEOチェックCSS
    wp_enqueue_style(
        'lw-seo-check',
        LW_DASHBOARD_URL . 'components/seo-check/seo-check.css',
        array('lw-dashboard-common'),
        filemtime(LW_DASHBOARD_PATH . 'components/seo-check/seo-check.css')
    );

    // SEOチェックJS
    wp_enqueue_script(
        'lw-seo-check',
        LW_DASHBOARD_URL . 'components/seo-check/seo-check.js',
        array('jquery', 'lw-wizard'),
        filemtime(LW_DASHBOARD_PATH . 'components/seo-check/seo-check.js'),
        true
    );
}

// ダッシュボードにサイドバーとモーダルHTMLを追加
add_action('admin_footer', 'lw_dashboard_sidebar_and_modals');
function lw_dashboard_sidebar_and_modals() {
    $screen = get_current_screen();
    if (!$screen || $screen->id !== 'dashboard') {
        return;
    }

    // ダッシュボードを開いた時にテーブルが無ければ作成
    lw_maybe_create_instructions_table();
    lw_maybe_upgrade_instructions_table();

    $site_health_url = admin_url('site-health.php');
    ?>
    <!-- ダッシュボードサイドバー -->
    <div class="lw-dashboard-sidebar" id="lw-dashboard-sidebar">
        <div class="lw-sidebar-inner">

            <!-- サイト構造ボタン -->
            <button type="button" class="lw-sidebar-btn" id="lw-page-tree-trigger">
                <span class="dashicons dashicons-networking"></span>
                <span class="lw-sidebar-btn-text">サイト構造</span>
            </button>
            <!-- マニュアルリンク -->
            <a href="<?php echo admin_url('admin.php?page=lw-manual-viewer'); ?>" class="lw-sidebar-btn lw-sidebar-link">
                <span class="dashicons dashicons-book-alt"></span>
                <span class="lw-sidebar-btn-text">旧）操作マニュアル</span>
            </a>
            <!-- 依頼一覧ボタン（プレミアム限定） -->
            <?php $is_premium = defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true; ?>
            <button type="button" class="lw-sidebar-btn<?php echo !$is_premium ? ' lw-premium-disabled' : ''; ?>" id="lw-tasklist-trigger" <?php echo !$is_premium ? 'data-premium-only="true"' : ''; ?>>
                <span class="dashicons dashicons-clipboard"></span>
                <span class="lw-sidebar-btn-text">タスク管理</span>
                <?php if ($is_premium) : ?>
                <span class="lw-tasklist-badge" id="lw-tasklist-badge" style="display: none;">0</span>
                <?php else : ?>
                <span class="lw-premium-label" style="height: 17px; position: absolute; top:0; bottom:0; margin:auto; right: 8px; align-items: center; display:flex;" >Premium</span>
                <?php endif; ?>
            </button>
            <!-- サイトヘルスリンク -->
            <a href="<?php echo esc_url($site_health_url); ?>" class="lw-sidebar-btn lw-sidebar-link">
                <span class="dashicons dashicons-heart"></span>
                <span class="lw-sidebar-btn-text">サイトヘルス</span>
            </a>
            <!-- SEOセルフチェック -->
            <?php
            $seo_check_data = lw_get_seo_check_data();
            $seo_items = lw_get_seo_check_items();
            $seo_total = 0;
            $seo_completed = 0;
            foreach ($seo_items as $cat_key => $category) {
                foreach ($category['items'] as $item_key => $item) {
                    $seo_total++;
                    if (!empty($seo_check_data[$cat_key][$item_key]['checked'])) {
                        $seo_completed++;
                    }
                }
            }
            $seo_progress = $seo_total > 0 ? round(($seo_completed / $seo_total) * 100) : 0;
            ?>
            <button type="button" class="lw-sidebar-btn" id="lw-seo-check-trigger">
                <span class="dashicons dashicons-yes-alt"></span>
                <span class="lw-sidebar-btn-text">SEOセルフチェック</span>
                <span class="lw-seo-badge <?php echo $seo_progress === 100 ? 'is-complete' : ''; ?>" id="lw-seo-check-badge"><?php echo $seo_progress; ?>%</span>
            </button>

            <?php
            // トライアルボタンを表示（サブスク契約者以外、かつトライアル可能な場合のみ）
            if (function_exists('lw_is_subscription_active') && !lw_is_subscription_active()) {
                $show_trial_button = false;
                $is_trial_active = function_exists('lw_is_trial_active') ? lw_is_trial_active() : false;

                if (!$is_trial_active) {
                    // トライアル中でない場合、開始可能かチェック
                    if (class_exists('LwTemplateSetting')) {
                        $templateSetting = new LwTemplateSetting();
                        $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');

                        if (!$trial_setting) {
                            // 初回：トライアル未経験
                            $show_trial_button = true;
                        } else {
                            // 60日経過後かチェック
                            $last_timestamp = strtotime($trial_setting['timestamp']);
                            $days_elapsed = floor((time() - $last_timestamp) / (60 * 60 * 24));
                            if ($trial_setting['active_flag'] == 0 && $days_elapsed >= 60) {
                                $show_trial_button = true;
                            }
                        }
                    }
                }

                if ($show_trial_button) :
            ?>
            <!-- トライアル開始ボタン -->
            <button type="button" class="lw-sidebar-btn lw-trial-sparkle-btn" id="lw-trial-start-trigger">
                <span class="lw-sparkle-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </span>
                <span class="lw-sidebar-btn-text">無料トライアル</span>
                <span class="lw-trial-badge-free">14日間</span>
            </button>
            <?php
                endif;
            }
            ?>

            <?php
            // プレミアムプラン契約ボタン（サブスク契約者以外に表示）
            if (function_exists('lw_is_subscription_active') && !lw_is_subscription_active()) :
            ?>
            <!-- プレミアムプラン契約ボタン -->
            <button type="button" class="lw-sidebar-btn lw-premium-plan-btn" id="lw-premium-plan-trigger">
                <span class="lw-sidebar-btn-text">プレミアムプラン</span>
                <span class="lw-premium-plan-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </span>
            </button>
            <?php endif; ?>
        </div>
    </div>

    <!-- カスタムコンテンツエリア -->
    <div class="lw-dashboard-content" id="lw-dashboard-content">
        <?php
        // LiteWordテーマ更新通知
        if ( function_exists( 'lw_get_theme_update_notice_html' ) ) {
            echo lw_get_theme_update_notice_html();
        }
        ?>
        <h2 class="lw-wizard-title">サイト制作ウィザード</h2>
        <p class="lw-wizard-desc">ステップに沿って、SEOに強いサイトを作りましょう。</p>

        <?php
        $wizard_data = get_option('lw_wizard_status', array());

        // アクティベート状態をチェック
        // アクセストークンが保存されていればアクティベート完了とみなす
        $current_user_id = get_current_user_id();
        $access_token = get_user_meta($current_user_id, 'lw_target_shop_token', true);
        $is_activated = !empty($access_token);

        // アクティベートが完了していれば自動的に完了
        $step_1_completed = $is_activated;
        $step_1_warning = !$is_activated;

        // 完了ステップ数をカウント
        $total_steps = 18;
        $completed_steps = 0;
        if ($step_1_completed) $completed_steps++;
        for ($i = 2; $i <= $total_steps; $i++) {
            if (!empty($wizard_data['step_' . $i]['ok'])) $completed_steps++;
        }
        $progress_percent = ($completed_steps / $total_steps) * 100;
        ?>

        <!-- プログレスバー -->
        <div class="lw-wizard-progress">
            <div class="lw-progress-bar">
                <div class="lw-progress-fill" style="width: <?php echo $progress_percent; ?>%;"></div>
            </div>
            <div class="lw-progress-text">
                <span><?php echo $completed_steps; ?></span> / <?php echo $total_steps; ?> 完了
            </div>
        </div>

        <div class="lw-wizard-steps<?php echo !$is_activated ? ' lw-not-activated' : ''; ?>">
            <!-- ステップ1: アクティベート設定 -->
            <div class="lw-wizard-step-wrapper <?php echo $step_1_completed ? 'completed' : ''; ?> <?php echo $step_1_warning ? 'warning' : ''; ?>" data-step="1">
                <a href="<?php echo admin_url('admin.php?page=lw_template_management'); ?>" target="_blank" class="lw-wizard-step">
                    <span class="lw-step-number">1</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">アクティベート設定</span>
                        <span class="lw-step-desc"><?php echo $step_1_warning ? 'アクティベートが必要です' : 'データ反映処理・テンプレート管理'; ?></span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="1" <?php checked($step_1_completed); ?> <?php echo $step_1_warning ? 'disabled' : ''; ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo $step_1_completed ? '完了' : ($step_1_warning ? '要設定' : '未完了'); ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="1" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_1']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="1" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_1']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ2: サイト基本情報 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_2']['ok']) ? 'completed' : ''; ?>" data-step="2">
                <button type="button" class="lw-wizard-step" id="lw-step-site-info">
                    <span class="lw-step-number">2</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">サイト基本情報</span>
                        <span class="lw-step-desc">サイト名・キャッチフレーズ・ロゴ</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="2" <?php checked(!empty($wizard_data['step_2']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_2']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="2" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_2']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="2" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_2']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ3: パーマリンク設定 -->
            <?php $is_permalink_plain = empty(get_option('permalink_structure')); ?>
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_3']['ok']) ? 'completed' : ''; ?>" data-step="3">
                <button type="button" class="lw-wizard-step" id="lw-step-permalink">
                    <span class="lw-step-number">3<?php if ($is_permalink_plain): ?><span class="lw-step-warning-badge">!</span><?php endif; ?></span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">パーマリンク設定</span>
                        <span class="lw-step-desc">URLの形式を設定（SEOに重要）</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="3" <?php checked(!empty($wizard_data['step_3']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_3']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="3" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_3']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="3" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_3']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ4: カラー・フォント設定 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_4']['ok']) ? 'completed' : ''; ?>" data-step="4">
                <button type="button" class="lw-wizard-step" id="lw-step-color-font">
                    <span class="lw-step-number">4</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">カラー・フォント設定</span>
                        <span class="lw-step-desc">メインカラー・アクセントカラー・デフォルトフォント</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="4" <?php checked(!empty($wizard_data['step_4']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_4']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="4" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_4']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="4" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_4']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ5: ヘッダーパターンの選択 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_5']['ok']) ? 'completed' : ''; ?>" data-step="5">
                <button type="button" class="lw-wizard-step" id="lw-step-header">
                    <span class="lw-step-number">5</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">ヘッダーパターンの選択</span>
                        <span class="lw-step-desc">サイトヘッダーのデザインを選択</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="5" <?php checked(!empty($wizard_data['step_5']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_5']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="5" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_5']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="5" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_5']['comment'] ?? ''); ?></textarea>
                </div>
            </div>


            <!-- ステップ6: ヘッダー詳細設定 -->
            <?php
            $current_header_ptn = get_theme_mod('header_set_ptn_df', 'ptn_1');
            $header_detail_url = admin_url('customize.php?autofocus[control]=header_' . $current_header_ptn . '_set_logo_switch');
            ?>
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_6']['ok']) ? 'completed' : ''; ?>" data-step="6">
                <a href="<?php echo esc_url($header_detail_url); ?>" target="_blank" class="lw-wizard-step" id="lw-header-detail-step">
                    <span class="lw-step-number">6</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">ヘッダー詳細設定</span>
                        <span class="lw-step-desc">ロゴ・電話番号・ボタンなどの設定</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="6" <?php checked(!empty($wizard_data['step_6']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_6']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="6" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_6']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="6" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_6']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ7: フッターパターンの選択 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_7']['ok']) ? 'completed' : ''; ?>" data-step="7">
                <button type="button" class="lw-wizard-step" id="lw-step-footer">
                    <span class="lw-step-number">7</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">フッターパターンの選択</span>
                        <span class="lw-step-desc">サイトフッターのデザインを選択</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="7" <?php checked(!empty($wizard_data['step_7']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_7']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="7" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_7']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="7" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_7']['comment'] ?? ''); ?></textarea>
                </div>
            </div>


            <!-- ステップ8: フッター詳細設定 -->
            <?php
            $current_footer_ptn = get_theme_mod('footer_set_ptn_df', 'ptn_1');
            $footer_detail_url = admin_url('customize.php?autofocus[control]=footer_' . $current_footer_ptn . '_set_widget_switch');
            ?>
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_8']['ok']) ? 'completed' : ''; ?>" data-step="8">
                <a href="<?php echo esc_url($footer_detail_url); ?>" target="_blank" class="lw-wizard-step" id="lw-footer-detail-step">
                    <span class="lw-step-number">8</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">フッター詳細設定</span>
                        <span class="lw-step-desc">ウィジェット・コピーライトなどの設定</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="8" <?php checked(!empty($wizard_data['step_8']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_8']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="8" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_8']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="8" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_8']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ9: 固定ページ制作 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_9']['ok']) ? 'completed' : ''; ?>" data-step="9">
                <button type="button" class="lw-wizard-step" id="lw-step-pages">
                    <span class="lw-step-number">9</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">固定ページ制作</span>
                        <span class="lw-step-desc">サイトに必要なページを作成</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="9" <?php checked(!empty($wizard_data['step_9']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_9']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="9" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_9']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="9" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_9']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ10: ナビゲーションメニュー -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_10']['ok']) ? 'completed' : ''; ?>" data-step="10">
                <a href="<?php echo admin_url('nav-menus.php'); ?>" target="_blank" class="lw-wizard-step">
                    <span class="lw-step-number">10</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">ナビゲーションメニュー</span>
                        <span class="lw-step-desc">ヘッダー・フッターのメニューを設定</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="10" <?php checked(!empty($wizard_data['step_10']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_10']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="10" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_10']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="10" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_10']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ11: お問い合わせフォーム -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_11']['ok']) ? 'completed' : ''; ?>" data-step="11">
                <a href="<?php echo admin_url('admin.php?page=lw_mail_form_set'); ?>" target="_blank" class="lw-wizard-step">
                    <span class="lw-step-number">11</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">お問い合わせフォーム</span>
                        <span class="lw-step-desc">フォームの項目・送信先を設定</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="11" <?php checked(!empty($wizard_data['step_11']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_11']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="11" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_11']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="11" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_11']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ12: プライバシーポリシー -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_12']['ok']) ? 'completed' : ''; ?>" data-step="12">
                <button type="button" class="lw-wizard-step" id="lw-step-privacy">
                    <span class="lw-step-number">12</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">プライバシーポリシー</span>
                        <span class="lw-step-desc">個人情報保護方針・利用規約の確認</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="12" <?php checked(!empty($wizard_data['step_12']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_12']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="12" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_12']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="12" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_12']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ13: SEO設定 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_13']['ok']) ? 'completed' : ''; ?>" data-step="13">
                <a href="<?php echo admin_url('admin.php?page=lw_seo_settings_menu_management'); ?>" target="_blank" class="lw-wizard-step">
                    <span class="lw-step-number">13</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">SEO設定</span>
                        <span class="lw-step-desc">フロントページのメタディスクリプション</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="13" <?php checked(!empty($wizard_data['step_13']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_13']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="13" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_13']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="13" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_13']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ14: 各ページSEO設定 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_14']['ok']) ? 'completed' : ''; ?>" data-step="14">
                <a href="<?php echo admin_url('admin.php?page=lw_seo_settings_menu_page_individual_set&type=page&sort=date_desc'); ?>" target="_blank" class="lw-wizard-step">
                    <span class="lw-step-number">14</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">各ページSEO設定</span>
                        <span class="lw-step-desc">固定ページのメタディスクリプション</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="14" <?php checked(!empty($wizard_data['step_14']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_14']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="14" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_14']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="14" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_14']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ15: 公開設定 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_15']['ok']) ? 'completed' : ''; ?>" data-step="15">
                <button type="button" class="lw-wizard-step" id="lw-step-publish">
                    <span class="lw-step-number">15</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">公開設定</span>
                        <span class="lw-step-desc">検索エンジンへのインデックス設定</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="15" <?php checked(!empty($wizard_data['step_15']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_15']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="15" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_15']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="15" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_15']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ16: アクセス解析設定 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_16']['ok']) ? 'completed' : ''; ?>" data-step="16">
                <a href="<?php echo admin_url('admin.php?page=lw_seo_settings_menu_analysis_set'); ?>" target="_blank" class="lw-wizard-step">
                    <span class="lw-step-number">16</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">アクセス解析設定</span>
                        <span class="lw-step-desc">Googleアナリティクス等の設定</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-external"></span>
                </a>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="16" <?php checked(!empty($wizard_data['step_16']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_16']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="16" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_16']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="16" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_16']['comment'] ?? ''); ?></textarea>
                </div>
            </div>

            <!-- ステップ17: セキュリティプラグインの導入 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_17']['ok']) ? 'completed' : ''; ?>" data-step="17">
                <button type="button" class="lw-wizard-step" id="lw-step-security-plugin">
                    <span class="lw-step-number">17</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">セキュリティプラグインの導入</span>
                        <span class="lw-step-desc">サイトを不正アクセスから保護</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="17" <?php checked(!empty($wizard_data['step_17']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_17']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="17" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_17']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="17" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_17']['comment'] ?? ''); ?></textarea>
                </div>
            </div>


            <!-- ステップ18: ファビコン設定 -->
            <div class="lw-wizard-step-wrapper <?php echo !empty($wizard_data['step_18']['ok']) ? 'completed' : ''; ?>" data-step="18">
                <button type="button" class="lw-wizard-step" id="lw-step-favicon">
                    <span class="lw-step-number">18</span>
                    <div class="lw-step-content">
                        <span class="lw-step-title">ファビコン設定</span>
                        <span class="lw-step-desc">ブラウザタブに表示されるアイコン</span>
                    </div>
                    <span class="lw-step-status dashicons dashicons-arrow-right-alt2"></span>
                </button>
                <div class="lw-step-check">
                    <label class="lw-toggle">
                        <input type="checkbox" class="lw-step-toggle" data-step="18" <?php checked(!empty($wizard_data['step_18']['ok'])); ?>>
                        <span class="lw-toggle-slider"></span>
                        <span class="lw-toggle-label"><?php echo !empty($wizard_data['step_18']['ok']) ? '完了' : '未完了'; ?></span>
                    </label>
                    <button type="button" class="lw-step-comment-btn" data-step="18" title="コメント">
                        <span class="dashicons dashicons-admin-comments"></span>
                        <?php if (!empty($wizard_data['step_18']['comment'])): ?>
                            <span class="lw-comment-dot"></span>
                        <?php endif; ?>
                    </button>
                </div>
                <div class="lw-step-comment-area" data-step="18" style="display: none;">
                    <textarea class="lw-step-comment" placeholder="メモやコメントを入力..."><?php echo esc_textarea($wizard_data['step_18']['comment'] ?? ''); ?></textarea>
                </div>
            </div>
        </div>
    </div>

    <!-- 依頼一覧ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-tasklist-modal">
        <div class="lw-wizard-popup lw-wizard-popup-md">
            <div class="lw-wizard-popup-header">
                <h3>
                    <span class="dashicons dashicons-clipboard"></span>
                    依頼一覧
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-tasklist-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <!-- フィルタータブと新規追加ボタン -->
                <div class="lw-tasklist-header-row">
                    <div class="lw-tasklist-tabs">
                        <button type="button" class="lw-tasklist-tab active" data-filter="all">
                            すべて <span class="lw-tasklist-tab-count" id="lw-tasklist-count-all">0</span>
                        </button>
                        <button type="button" class="lw-tasklist-tab" data-filter="work">
                            <span class="dashicons dashicons-edit"></span> 作業
                            <span class="lw-tasklist-tab-count" id="lw-tasklist-count-work">0</span>
                        </button>
                        <button type="button" class="lw-tasklist-tab" data-filter="check">
                            <span class="dashicons dashicons-visibility"></span> チェック依頼
                            <span class="lw-tasklist-tab-count" id="lw-tasklist-count-check">0</span>
                        </button>
                    </div>
                    <button type="button" class="lw-btn lw-btn-primary lw-btn-sm" id="lw-tasklist-add-btn">
                        <span class="dashicons dashicons-plus-alt2"></span> 新規追加
                    </button>
                </div>

                <div class="lw-modal-loading" id="lw-tasklist-loading">
                    <span class="spinner is-active"></span>
                    <p>読み込み中...</p>
                </div>

                <div class="lw-tasklist-empty" id="lw-tasklist-empty" style="display: none;">
                    <span class="dashicons dashicons-yes-alt"></span>
                    <p>未完了の依頼はありません</p>
                </div>

                <div class="lw-tasklist-list" id="lw-tasklist-list"></div>
            </div>
        </div>
    </div>

    <!-- 新規依頼追加ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-tasklist-new-modal">
        <div class="lw-wizard-popup lw-wizard-popup-md">
            <div class="lw-wizard-popup-header">
                <h3>
                    <span class="dashicons dashicons-plus-alt2"></span>
                    新規依頼を追加
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-tasklist-new-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <!-- ターゲットタイプ選択 -->
                <div class="lw-form-group">
                    <label>依頼の対象</label>
                    <div class="lw-target-type-selector">
                        <label class="lw-target-type-option">
                            <input type="radio" name="lw-target-type" value="page" checked>
                            <span class="lw-target-type-label">
                                <span class="dashicons dashicons-admin-page"></span>
                                固定ページ
                            </span>
                        </label>
                        <label class="lw-target-type-option">
                            <input type="radio" name="lw-target-type" value="post">
                            <span class="lw-target-type-label">
                                <span class="dashicons dashicons-admin-post"></span>
                                投稿
                            </span>
                        </label>
                        <label class="lw-target-type-option">
                            <input type="radio" name="lw-target-type" value="custom">
                            <span class="lw-target-type-label">
                                <span class="dashicons dashicons-edit-page"></span>
                                自分で入力
                            </span>
                        </label>
                    </div>
                </div>

                <!-- ページ/投稿選択エリア -->
                <div class="lw-form-group" id="lw-target-select-group">
                    <label id="lw-target-select-label">固定ページを選択</label>
                    <div class="lw-target-search-box">
                        <span class="dashicons dashicons-search"></span>
                        <input type="text" id="lw-target-search" class="lw-form-input" placeholder="検索...">
                    </div>
                    <div class="lw-target-list-container">
                        <div class="lw-modal-loading" id="lw-target-loading">
                            <span class="spinner is-active"></span>
                        </div>
                        <div class="lw-target-list" id="lw-target-list"></div>
                    </div>
                    <input type="hidden" id="lw-target-id" value="">
                    <div class="lw-target-selected" id="lw-target-selected" style="display: none;">
                        <span class="dashicons dashicons-yes-alt"></span>
                        <span id="lw-target-selected-title"></span>
                        <button type="button" class="lw-target-clear" id="lw-target-clear">
                            <span class="dashicons dashicons-no-alt"></span>
                        </button>
                    </div>
                </div>

                <!-- カスタム入力エリア -->
                <div class="lw-form-group" id="lw-custom-title-group" style="display: none;">
                    <label for="lw-custom-title">タイトル（対象名）</label>
                    <input type="text" id="lw-custom-title" class="lw-form-input" placeholder="例: トップページのヘッダー部分">
                </div>

                <!-- 依頼内容 -->
                <div class="lw-form-group">
                    <label for="lw-tasklist-new-content">依頼内容 <span class="required">*</span></label>
                    <textarea id="lw-tasklist-new-content" class="lw-form-textarea" rows="4" placeholder="依頼の内容を入力してください"></textarea>
                </div>

                <!-- 画像添付 -->
                <div class="lw-form-group">
                    <label>画像添付（任意）</label>
                    <div class="lw-image-upload-area">
                        <input type="file" id="lw-tasklist-new-image" accept="image/*" style="display:none;">
                        <button type="button" class="lw-btn lw-btn-outline" id="lw-tasklist-new-image-btn">
                            <span class="dashicons dashicons-format-image"></span> 画像を選択
                        </button>
                        <span class="lw-image-name" id="lw-tasklist-new-image-name"></span>
                    </div>
                </div>

                <!-- ステータスと担当者 -->
                <div class="lw-instruction-add-status-row">
                    <div class="lw-form-group">
                        <label for="lw-tasklist-new-status">ステータス</label>
                        <select id="lw-tasklist-new-status" class="lw-form-select">
                            <option value="not-started">未着手</option>
                            <option value="check-requested">チェック依頼</option>
                        </select>
                    </div>
                    <div class="lw-form-group" id="lw-tasklist-new-assigned-group">
                        <label for="lw-tasklist-new-assigned">担当者</label>
                        <select id="lw-tasklist-new-assigned" class="lw-form-select">
                            <option value="">選択してください</option>
                        </select>
                    </div>
                </div>

                <!-- リンクURL -->
                <div class="lw-form-group">
                    <label for="lw-tasklist-new-link-url">リンクURL（任意）</label>
                    <input type="url" id="lw-tasklist-new-link-url" class="lw-form-input" placeholder="https://...">
                    <p class="lw-form-help">対象のページへのリンクを設定できます。新しいタブで開きます。</p>
                </div>
            </div>
            <div class="lw-wizard-popup-footer">
                <button type="button" class="lw-btn lw-btn-outline" data-modal-close="lw-tasklist-new-modal">キャンセル</button>
                <button type="button" class="lw-btn lw-btn-primary" id="lw-tasklist-new-save">
                    <span class="dashicons dashicons-saved"></span> 依頼を作成
                </button>
            </div>
        </div>
    </div>

    <!-- 公開設定ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-publish-modal">
        <div class="lw-wizard-popup">
            <div class="lw-wizard-popup-header">
                <h3>公開設定</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-publish-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-modal-loading" id="lw-publish-loading">
                    <span class="spinner is-active"></span>
                    <p>読み込み中...</p>
                </div>
                <form id="lw-publish-form" style="display:none;">
                    <div class="lw-form-group">
                        <label>検索エンジンでの表示</label>
                        <p class="lw-form-hint">サイトをGoogleなどの検索エンジンに表示させるかどうかを設定します。</p>
                        <div class="lw-publish-options">
                            <label class="lw-publish-option">
                                <input type="radio" name="blog_public" value="1">
                                <span class="lw-publish-option-content">
                                    <span class="lw-publish-option-title">
                                        <span class="dashicons dashicons-visibility"></span>
                                        検索エンジンにインデックスさせる
                                    </span>
                                    <span class="lw-publish-option-desc">サイトが検索結果に表示されます（推奨）</span>
                                </span>
                            </label>
                            <label class="lw-publish-option">
                                <input type="radio" name="blog_public" value="0">
                                <span class="lw-publish-option-content">
                                    <span class="lw-publish-option-title">
                                        <span class="dashicons dashicons-hidden"></span>
                                        検索エンジンにインデックスさせない
                                    </span>
                                    <span class="lw-publish-option-desc">サイトが検索結果に表示されません（開発中はこちら）</span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="lw-form-actions">
                        <button type="button" class="lw-btn-cancel" data-modal="lw-publish-modal">キャンセル</button>
                        <button type="submit" class="lw-btn">保存する</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 拡張機能有効化確認ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-extension-confirm-modal">
        <div class="lw-wizard-popup lw-wizard-popup-sm">
            <div class="lw-wizard-popup-header">
                <h3>機能が無効になっています</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-extension-confirm-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-extension-confirm-content">
                    <div class="lw-extension-confirm-icon">
                        <span class="dashicons dashicons-warning"></span>
                    </div>
                    <p class="lw-extension-confirm-message" id="lw-extension-confirm-message">
                        この機能を使用するには、LiteWordの拡張機能を有効にする必要があります。
                    </p>
                    <p class="lw-extension-confirm-sub">
                        有効にしますか？
                    </p>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-extension-confirm-modal">キャンセル</button>
                    <button type="button" class="lw-btn" id="lw-extension-enable-btn">有効にする</button>
                </div>
            </div>
        </div>
    </div>

    <!-- アクティベート確認ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-activate-confirm-modal">
        <div class="lw-wizard-popup lw-wizard-popup-sm">
            <div class="lw-wizard-popup-header">
                <h3>アクティベートが必要です</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-activate-confirm-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-extension-confirm-content">
                    <div class="lw-extension-confirm-icon">
                        <span class="dashicons dashicons-lock"></span>
                    </div>
                    <p class="lw-extension-confirm-message">
                        LiteWordの機能を使用するには、まずStep1のアクティベート設定を完了してください。
                    </p>
                    <p class="lw-extension-confirm-sub">
                        アクティベート設定ページに移動しますか？
                    </p>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-activate-confirm-modal">キャンセル</button>
                    <a href="<?php echo admin_url('admin.php?page=lw_template_management'); ?>" class="lw-btn">設定する</a>
                </div>
            </div>
        </div>
    </div>

    <!-- サイト基本情報ポップアップ -->
    <?php
    $custom_logo_id = get_theme_mod('custom_logo');
    // SVG Supportプラグインの状態をチェック
    $svg_support_file = 'svg-support/svg-support.php';
    $svg_support_installed = file_exists(WP_PLUGIN_DIR . '/' . $svg_support_file);
    $svg_support_active = is_plugin_active($svg_support_file);
    ?>
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-site-info-modal">
        <div class="lw-wizard-popup">
            <div class="lw-wizard-popup-header">
                <h3>サイト基本情報</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-site-info-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-modal-loading" id="lw-site-info-loading">
                    <span class="spinner is-active"></span>
                    <p>読み込み中...</p>
                </div>
                <form id="lw-site-info-form" style="display:none;">
                    <div class="lw-form-group">
                        <label for="lw-site-title">サイト名（ロゴテキスト）</label>
                        <input type="text" id="lw-site-title" name="site_title" value="">
                        <p class="lw-form-hint">※サイトタイトルになります。ロゴ画像を使用する場合でも必ず入力してください</p>
                    </div>
                    <div class="lw-form-group">
                        <label for="lw-site-tagline">キャッチフレーズ</label>
                        <input type="text" id="lw-site-tagline" name="site_tagline" value="">
                        <p class="lw-form-hint">サイトの簡単な説明文です</p>
                    </div>
                    <div class="lw-form-group">
                        <label>ロゴ画像</label>
                        <div class="lw-logo-upload">
                            <div class="lw-logo-preview" id="lw-logo-preview">
                                <span class="lw-no-logo">ロゴ未設定</span>
                            </div>
                            <input type="hidden" id="lw-logo-id" name="logo_id" value="">
                            <div class="lw-logo-buttons">
                                <button type="button" class="lw-btn-secondary" id="lw-logo-select">画像を選択</button>
                                <button type="button" class="lw-btn-text" id="lw-logo-remove" style="display:none;">削除</button>
                            </div>
                        </div>
                        <!-- SVGサポート案内 -->
                        <div class="lw-svg-support-box <?php echo $svg_support_active ? 'is-active' : ''; ?>">
                            <div class="lw-svg-support-icon">
                                <span class="dashicons dashicons-format-image"></span>
                            </div>
                            <div class="lw-svg-support-content">
                                <p class="lw-svg-support-title">SVG画像を使用したい場合</p>
                                <?php if ($svg_support_active): ?>
                                    <p class="lw-svg-support-status"><span class="dashicons dashicons-yes-alt"></span> SVG Supportプラグインが有効です。SVG画像をアップロードできます。</p>
                                <?php else: ?>
                                    <p class="lw-svg-support-desc">WordPressはセキュリティ上、標準ではSVG画像のアップロードに対応していません。SVGロゴを使用するには「SVG Support」プラグインのインストールが必要です。</p>
                                    <div class="lw-svg-support-actions">
                                        <?php if ($svg_support_installed): ?>
                                            <button type="button" class="lw-btn lw-btn-sm lw-btn-success" id="lw-svg-activate-btn">
                                                <span class="dashicons dashicons-yes"></span> 有効化する
                                            </button>
                                        <?php else: ?>
                                            <button type="button" class="lw-btn lw-btn-sm lw-btn-primary" id="lw-svg-install-btn">
                                                <span class="dashicons dashicons-download"></span> インストール
                                            </button>
                                        <?php endif; ?>
                                        <span class="lw-svg-status" id="lw-svg-status"></span>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>

                    <!-- タイムゾーン・日付形式 -->
                    <div class="lw-form-section-divider"></div>
                    <div class="lw-form-group">
                        <label for="lw-timezone">タイムゾーン</label>
                        <select id="lw-timezone" name="timezone">
                            <option value="Asia/Tokyo">Asia/Tokyo（日本標準時）</option>
                            <option value="UTC">UTC（協定世界時）</option>
                            <option value="America/New_York">America/New_York（米国東部）</option>
                            <option value="America/Los_Angeles">America/Los_Angeles（米国西部）</option>
                            <option value="Europe/London">Europe/London（イギリス）</option>
                            <option value="Europe/Paris">Europe/Paris（フランス）</option>
                            <option value="Asia/Shanghai">Asia/Shanghai（中国）</option>
                            <option value="Asia/Seoul">Asia/Seoul（韓国）</option>
                        </select>
                        <p class="lw-form-hint">日本国内向けサイトは「Asia/Tokyo」を選択してください</p>
                    </div>
                    <div class="lw-form-group">
                        <label for="lw-date-format">日付形式</label>
                        <div class="lw-radio-group">
                            <label class="lw-radio-item">
                                <input type="radio" name="date_format" value="Y年n月j日" checked>
                                <span class="lw-radio-label">Y年n月j日</span>
                                <span class="lw-radio-example">例: <?php echo date('Y年n月j日'); ?></span>
                            </label>
                            <label class="lw-radio-item">
                                <input type="radio" name="date_format" value="Y/m/d">
                                <span class="lw-radio-label">Y/m/d</span>
                                <span class="lw-radio-example">例: <?php echo date('Y/m/d'); ?></span>
                            </label>
                            <label class="lw-radio-item">
                                <input type="radio" name="date_format" value="Y-m-d">
                                <span class="lw-radio-label">Y-m-d</span>
                                <span class="lw-radio-example">例: <?php echo date('Y-m-d'); ?></span>
                            </label>
                            <label class="lw-radio-item">
                                <input type="radio" name="date_format" value="F j, Y">
                                <span class="lw-radio-label">F j, Y</span>
                                <span class="lw-radio-example">例: <?php echo date('F j, Y'); ?></span>
                            </label>
                        </div>
                    </div>
                    <div class="lw-form-group">
                        <label for="lw-time-format">時刻形式</label>
                        <div class="lw-radio-group lw-radio-inline">
                            <label class="lw-radio-item">
                                <input type="radio" name="time_format" value="H:i" checked>
                                <span class="lw-radio-label">24時間表記</span>
                                <span class="lw-radio-example">例: <?php echo date('H:i'); ?></span>
                            </label>
                            <label class="lw-radio-item">
                                <input type="radio" name="time_format" value="g:i A">
                                <span class="lw-radio-label">12時間表記</span>
                                <span class="lw-radio-example">例: <?php echo date('g:i A'); ?></span>
                            </label>
                        </div>
                    </div>

                    <div class="lw-form-actions">
                        <button type="button" class="lw-btn-cancel" data-modal="lw-site-info-modal">キャンセル</button>
                        <button type="submit" class="lw-btn">保存する</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- カラー・フォント設定ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-color-font-modal">
        <div class="lw-wizard-popup">
            <div class="lw-wizard-popup-header">
                <h3>カラー・フォント設定</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-color-font-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-modal-loading" id="lw-color-font-loading">
                    <span class="spinner is-active"></span>
                    <p>読み込み中...</p>
                </div>
                <form id="lw-color-font-form" style="display:none;">
                    <div class="lw-form-group">
                        <label for="lw-color-main">メインカラー</label>
                        <p class="lw-form-hint">見出しの色など、サイトのイメージを決める色</p>
                        <input type="color" id="lw-color-main" name="color_main" value="#1a72ad">
                    </div>
                    <div class="lw-form-group">
                        <label for="lw-color-accent">アクセントカラー</label>
                        <p class="lw-form-hint">ボタンなど、目立つ部分の色</p>
                        <input type="color" id="lw-color-accent" name="color_accent" value="#d34a4a">
                    </div>
                    <div class="lw-form-group">
                        <label for="lw-font-body">デフォルトフォント</label>
                        <select id="lw-font-body" name="font_body">
                            <!-- オプションはJavaScriptで動的に追加 -->
                        </select>
                        <p class="lw-form-hint">※日本語を綺麗に表示するには「Noto Sans JP」がおススメ！</p>
                    </div>
                    <div class="lw-form-actions">
                        <button type="button" class="lw-btn-cancel" data-modal="lw-color-font-modal">キャンセル</button>
                        <button type="submit" class="lw-btn">保存する</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- ヘッダーパターン設定ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-header-modal">
        <div class="lw-wizard-popup lw-wizard-popup-pattern">
            <div class="lw-wizard-popup-header">
                <h3>ヘッダーパターンの選択</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-header-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-modal-loading" id="lw-header-loading">
                    <span class="spinner is-active"></span>
                    <p>読み込み中...</p>
                </div>
                <form id="lw-header-form" style="display:none;">
                    <div class="lw-pattern-grid" id="lw-header-patterns">
                        <!-- パターンはJavaScriptで動的に追加 -->
                    </div>
                    <div class="lw-form-actions">
                        <button type="button" class="lw-btn-cancel" data-modal="lw-header-modal">キャンセル</button>
                        <button type="submit" class="lw-btn">保存する</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- フッターパターン設定ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-footer-modal">
        <div class="lw-wizard-popup lw-wizard-popup-pattern">
            <div class="lw-wizard-popup-header">
                <h3>フッターパターンの選択</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-footer-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-modal-loading" id="lw-footer-loading">
                    <span class="spinner is-active"></span>
                    <p>読み込み中...</p>
                </div>
                <form id="lw-footer-form" style="display:none;">
                    <div class="lw-pattern-grid" id="lw-footer-patterns">
                        <!-- パターンはJavaScriptで動的に追加 -->
                    </div>
                    <div class="lw-form-actions">
                        <button type="button" class="lw-btn-cancel" data-modal="lw-footer-modal">キャンセル</button>
                        <button type="submit" class="lw-btn">保存する</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 固定ページ制作ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-pages-modal">
        <div class="lw-wizard-popup lw-wizard-popup-wide">
            <div class="lw-wizard-popup-header">
                <h3>固定ページ制作</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-pages-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <p class="lw-pages-intro">サイトに必要な固定ページを追加してください。ドラッグ&ドロップで階層構造を変更できます。</p>

                <!-- トップページ設定 -->
                <div class="lw-front-page-setting">
                    <label for="lw-front-page-select">
                        <span class="dashicons dashicons-admin-home"></span>
                        トップページ設定:
                    </label>
                    <select id="lw-front-page-select">
                        <option value="0">— 最新の投稿 —</option>
                        <!-- オプションはJavaScriptで追加 -->
                    </select>
                </div>

                <!-- ページ追加ボタン -->
                <div class="lw-page-add-form">
                    <button type="button" id="lw-open-add-page-btn" class="lw-btn">
                        <span class="dashicons dashicons-plus-alt2"></span>
                        新規ページを追加
                    </button>
                </div>

                <!-- ページリスト -->
                <div class="lw-pages-list-container">
                    <ul class="lw-pages-list" id="lw-pages-list">
                        <!-- ページはJavaScriptで動的に追加 -->
                    </ul>
                </div>

                <div class="lw-form-actions">
                    <a href="<?php echo admin_url('edit.php?post_type=page'); ?>" target="_blank" class="lw-btn-detail">
                        <span class="dashicons dashicons-admin-page"></span>
                        固定ページ一覧
                    </a>
                    <div class="lw-form-actions-right">
                        <button type="button" class="lw-btn-cancel" data-modal="lw-pages-modal">閉じる</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ページ編集ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-page-edit-modal">
        <div class="lw-wizard-popup">
            <div class="lw-wizard-popup-header">
                <h3>ページ情報を編集</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-page-edit-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <input type="hidden" id="lw-edit-page-id">
                <div class="lw-form-group">
                    <label for="lw-edit-page-title">ページタイトル</label>
                    <input type="text" id="lw-edit-page-title" class="lw-form-input">
                </div>
                <div class="lw-form-group">
                    <label for="lw-edit-page-slug">スラッグ（URL）</label>
                    <input type="text" id="lw-edit-page-slug" class="lw-form-input">
                    <p class="lw-form-hint">※半角英数字とハイフンのみ使用可能</p>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-page-edit-modal">キャンセル</button>
                    <button type="button" id="lw-save-page-edit" class="lw-btn">保存する</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ステータス変更ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-status-modal">
        <div class="lw-wizard-popup lw-wizard-popup-small">
            <div class="lw-wizard-popup-header">
                <h3>公開ステータス</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-status-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <input type="hidden" id="lw-status-page-id">
                <div class="lw-form-group">
                    <label for="lw-status-select">ステータス</label>
                    <select id="lw-status-select" class="lw-form-select">
                        <option value="publish">公開</option>
                        <option value="draft">下書き</option>
                        <option value="pending">レビュー待ち</option>
                        <option value="private">非公開</option>
                        <option value="future">予約投稿</option>
                    </select>
                </div>
                <div class="lw-form-group lw-schedule-group" id="lw-schedule-group" style="display:none;">
                    <label for="lw-schedule-date">公開日時</label>
                    <div class="lw-schedule-inputs">
                        <input type="date" id="lw-schedule-date" class="lw-form-input">
                        <input type="time" id="lw-schedule-time" class="lw-form-input" value="09:00">
                    </div>
                    <p class="lw-form-hint">※指定した日時に自動で公開されます</p>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-status-modal">キャンセル</button>
                    <button type="button" id="lw-save-status" class="lw-btn">変更する</button>
                </div>
            </div>
        </div>
    </div>

    <!-- タスクステータス変更ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-task-status-modal">
        <div class="lw-wizard-popup lw-wizard-popup-small">
            <div class="lw-wizard-popup-header">
                <h3>作業進捗</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-task-status-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <input type="hidden" id="lw-task-status-page-id">
                <div class="lw-form-group">
                    <label for="lw-task-status-select">進捗ステータス</label>
                    <select id="lw-task-status-select" class="lw-form-select">
                        <option value="not-started">未着手</option>
                        <option value="waiting-copy">原稿待ち</option>
                        <option value="waiting-material">素材待ち</option>
                        <option value="in-progress">作業中</option>
                        <option value="internal-review">社内確認中</option>
                        <option value="revising">修正中</option>
                        <option value="client-review">先方確認中</option>
                        <option value="revision-requested">修正依頼</option>
                        <option value="approved">承認済み</option>
                        <option value="completed">完了</option>
                    </select>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-task-status-modal">キャンセル</button>
                    <button type="button" id="lw-save-task-status" class="lw-btn">変更する</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 指示一覧ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-instructions-modal">
        <div class="lw-wizard-popup lw-wizard-popup-instructions">
            <div class="lw-wizard-popup-header">
                <h3><span class="dashicons dashicons-format-chat"></span> <span id="lw-instructions-page-title">ページ名</span> の指示</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-instructions-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <input type="hidden" id="lw-instructions-page-id">

                <!-- 指示追加フォーム -->
                <div class="lw-instruction-add-form">
                    <div class="lw-instruction-add-header">
                        <span class="dashicons dashicons-plus-alt2"></span> 新しい指示を追加
                    </div>
                    <div class="lw-instruction-add-body">
                        <textarea id="lw-instruction-content" class="lw-form-textarea" placeholder="指示内容を入力..."></textarea>
                        <div class="lw-instruction-add-options">
                            <label class="lw-instruction-image-label">
                                <input type="file" id="lw-instruction-image" accept="image/*" style="display:none;">
                                <span class="lw-btn-secondary"><span class="dashicons dashicons-format-image"></span> 画像を添付</span>
                            </label>
                            <span id="lw-instruction-image-name" class="lw-instruction-image-name"></span>
                            <button type="button" id="lw-instruction-image-clear" class="lw-btn-icon" style="display:none;" title="画像を取り消し">
                                <span class="dashicons dashicons-no"></span>
                            </button>
                        </div>
                        <div class="lw-instruction-add-status-row">
                            <div class="lw-instruction-add-status-item">
                                <label for="lw-add-instruction-status">ステータス</label>
                                <select id="lw-add-instruction-status" class="lw-form-select lw-form-select-sm">
                                    <option value="not-started">未着手</option>
                                    <option value="check-requested">チェック依頼</option>
                                    <option value="completed">完了</option>
                                </select>
                            </div>
                            <div class="lw-instruction-add-status-item" id="lw-add-assigned-to-group">
                                <label for="lw-add-assigned-to">担当者</label>
                                <select id="lw-add-assigned-to" class="lw-form-select lw-form-select-sm">
                                    <option value="">選択してください</option>
                                </select>
                            </div>
                        </div>
                        <div class="lw-instruction-add-link-row">
                            <label for="lw-add-instruction-link-url">リンクURL（任意）</label>
                            <input type="url" id="lw-add-instruction-link-url" class="lw-form-input lw-form-input-sm" placeholder="https://...">
                        </div>
                        <div class="lw-instruction-add-actions">
                            <button type="button" id="lw-add-instruction-btn" class="lw-btn">
                                <span class="dashicons dashicons-plus"></span> 指示を追加
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 指示一覧 -->
                <div class="lw-instructions-list-container">
                    <div class="lw-instructions-list-header">
                        <span>指示一覧</span>
                        <span class="lw-instructions-count">（<span id="lw-instructions-total">0</span>件）</span>
                    </div>
                    <div class="lw-modal-loading" id="lw-instructions-loading">
                        <span class="spinner is-active"></span>
                        <p>読み込み中...</p>
                    </div>
                    <ul class="lw-instructions-list" id="lw-instructions-list">
                        <!-- 指示がここに動的に追加される -->
                    </ul>
                    <div class="lw-instructions-empty" id="lw-instructions-empty" style="display:none;">
                        <span class="dashicons dashicons-clipboard"></span>
                        <p>まだ指示がありません</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 返信追加ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-reply-modal">
        <div class="lw-wizard-popup lw-wizard-popup-small">
            <div class="lw-wizard-popup-header">
                <h3>返信を追加</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-reply-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <input type="hidden" id="lw-reply-parent-id">
                <div class="lw-form-group">
                    <label for="lw-reply-content">返信内容</label>
                    <textarea id="lw-reply-content" class="lw-form-textarea" placeholder="返信を入力..."></textarea>
                </div>
                <div class="lw-form-group">
                    <label class="lw-instruction-image-label">
                        <input type="file" id="lw-reply-image" accept="image/*" style="display:none;">
                        <span class="lw-btn-secondary"><span class="dashicons dashicons-format-image"></span> 画像を添付</span>
                    </label>
                    <span id="lw-reply-image-name" class="lw-instruction-image-name"></span>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-reply-modal">キャンセル</button>
                    <button type="button" id="lw-save-reply-btn" class="lw-btn">返信する</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 指示編集ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-edit-instruction-modal">
        <div class="lw-wizard-popup lw-wizard-popup-small">
            <div class="lw-wizard-popup-header">
                <h3>指示を編集</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-edit-instruction-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <input type="hidden" id="lw-edit-instruction-id">
                <div class="lw-form-group">
                    <label for="lw-edit-instruction-content">指示内容</label>
                    <textarea id="lw-edit-instruction-content" class="lw-form-textarea" placeholder="指示内容を入力..."></textarea>
                </div>
                <div class="lw-form-group">
                    <div id="lw-edit-instruction-current-image" class="lw-edit-current-image"></div>
                    <label class="lw-instruction-image-label">
                        <input type="file" id="lw-edit-instruction-image" accept="image/*" style="display:none;">
                        <span class="lw-btn-secondary"><span class="dashicons dashicons-format-image"></span> 画像を変更</span>
                    </label>
                    <span id="lw-edit-instruction-image-name" class="lw-instruction-image-name"></span>
                    <button type="button" id="lw-edit-instruction-image-remove" class="lw-btn-secondary lw-btn-danger" style="display:none;">
                        <span class="dashicons dashicons-trash"></span> 画像を削除
                    </button>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-edit-instruction-modal">キャンセル</button>
                    <button type="button" id="lw-save-edit-instruction-btn" class="lw-btn">保存する</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ステータス変更ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-status-change-modal">
        <div class="lw-wizard-popup lw-wizard-popup-sm">
            <div class="lw-wizard-popup-header">
                <h3>ステータスを変更</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-status-change-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <input type="hidden" id="lw-inst-status-instruction-id" value="">
                <div class="lw-form-group">
                    <label for="lw-inst-status-select">ステータス</label>
                    <select id="lw-inst-status-select" class="lw-form-select">
                        <option value="not-started">未着手</option>
                        <option value="check-requested">チェック依頼</option>
                        <option value="completed">完了</option>
                    </select>
                </div>
                <div class="lw-form-group" id="lw-inst-assigned-to-group" style="display: none;">
                    <label for="lw-inst-assigned-to-select">担当者（誰に依頼しますか？）</label>
                    <select id="lw-inst-assigned-to-select" class="lw-form-select">
                        <option value="">選択してください</option>
                    </select>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-status-change-modal">キャンセル</button>
                    <button type="button" id="lw-inst-save-status-btn" class="lw-btn">変更する</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ページ追加ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-add-page-modal">
        <div class="lw-wizard-popup lw-wizard-popup-small">
            <div class="lw-wizard-popup-header">
                <h3>新規ページを追加</h3>
                <button type="button" class="lw-modal-close" data-modal="lw-add-page-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <div class="lw-form-group">
                    <label for="lw-add-page-title">
                        ページタイトル
                        <span class="lw-char-count">（<span id="lw-add-title-count">0</span>文字）</span>
                    </label>
                    <input type="text" id="lw-add-page-title" class="lw-form-input" placeholder="例：会社概要、お問い合わせ">
                </div>
                <div class="lw-form-group">
                    <label for="lw-add-page-slug">スラッグ（URL）</label>
                    <input type="text" id="lw-add-page-slug" class="lw-form-input" placeholder="例：about、contact">
                    <p class="lw-form-hint lw-form-hint-info">
                        <span class="dashicons dashicons-info-outline"></span>
                        スラッグとはページのURLの一部です。<br>
                        意味のある名前を<strong>半角英数字</strong>で入力してください。<br>
                        <span class="lw-slug-example">例：「会社概要」→ <code>about</code>、「お問い合わせ」→ <code>contact</code></span>
                    </p>
                </div>
                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-add-page-modal">キャンセル</button>
                    <button type="button" id="lw-add-page-btn" class="lw-btn">ページを作成</button>
                </div>
            </div>
        </div>
    </div>

    <!-- プレミアム限定メッセージモーダル -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-premium-modal">
        <div class="lw-wizard-popup lw-wizard-popup-small">
            <div class="lw-wizard-popup-header lw-premium-header">
                <h3>
                    <span class="dashicons dashicons-star-filled"></span>
                    プレミアム限定機能
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-premium-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body lw-premium-body">
                <p class="lw-premium-message">この機能は<strong>LiteWordプレミアムプラン</strong>限定です。</p>
                <p class="lw-premium-description">プレミアムプランでは、チーム間での依頼管理・指示コメント機能をご利用いただけます。</p>
                <div class="lw-premium-actions">
                    <a href="<?php echo esc_url(function_exists('lw_premium_info_link') ? lw_premium_info_link() : '#'); ?>" target="_blank" class="lw-btn lw-btn-premium">
                        <span class="dashicons dashicons-external"></span>
                        プレミアムプランの詳細
                    </a>
                    <button type="button" class="lw-btn lw-btn-outline" data-modal-close="lw-premium-modal">閉じる</button>
                </div>
            </div>
        </div>
    </div>


    <!-- プレミアムプラン紹介ポップアップ -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-premium-intro-modal">
        <div class="lw-wizard-popup lw-wizard-popup-sm">
            <div class="lw-wizard-popup-header lw-premium-intro-header">
                <h3>
                    <span class="dashicons dashicons-star-filled"></span>
                    LiteWord プレミアムプラン
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-premium-intro-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body lw-premium-intro-body">
                <p class="lw-premium-intro-lead">プレミアムプランでは以下の機能がご利用いただけます</p>
                <ul class="lw-premium-intro-features">
                    <li>
                        <span class="dashicons dashicons-yes-alt"></span>
                        <span>デザインパーツを40種類以上追加</span>
                    </li>
                    <li>
                        <span class="dashicons dashicons-yes-alt"></span>
                        <span>AIサポートシステムの活用利用権利</span>
                    </li>
                    <li>
                        <span class="dashicons dashicons-yes-alt"></span>
                        <span>プレミアム限定の多くの機能の利用制限の解除</span>
                    </li>
                </ul>
                <div class="lw-premium-intro-actions">
                    <a href="<?php echo esc_url(function_exists('lw_premium_info_link') ? lw_premium_info_link() : '#'); ?>" target="_blank" class="lw-btn lw-btn-outline lw-btn-block">
                        <span class="dashicons dashicons-info-outline"></span>
                        まずは詳細を確認
                    </a>
                    <a href="#" class="lw-btn lw-btn-premium lw-btn-block" data-lw-shop-action="login" data-redirect="/purchase-premium/" data-lw-shop-text="プレミアムプランへの変更はLiteWord Studioへのログインが必要です">
                        <span class="dashicons dashicons-cart"></span>
                        今すぐ契約する
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- セキュリティプラグイン選択ポップアップ -->
    <?php
    // プラグインの状態を取得
    $security_plugins = array(
        'cloudsecure-wp-security' => array(
            'name' => 'CloudSecure WP Security',
            'slug' => 'cloudsecure-wp-security',
            'file' => 'cloudsecure-wp-security/cloudsecure-wp.php',
            'desc' => '国産の高機能セキュリティプラグイン。ログイン保護、WAF機能、不正アクセス防止に加え、2段階認証の設定も可能です。総合的なセキュリティ対策におすすめです。',
            'recommended' => true,
            'note' => '※一部のレンタルサーバー（特にWAF機能が標準搭載されているサーバー）では、機能が競合する場合があります。導入後に不具合が発生した場合は、サーバー側のWAF設定を確認するか、別のプラグインをお試しください。'
        ),
        'siteguard' => array(
            'name' => 'SiteGuard WP Plugin',
            'slug' => 'siteguard',
            'file' => 'siteguard/siteguard.php',
            'desc' => '日本製のセキュリティプラグイン。ログインページのURL変更、画像認証、ログインロックなど、不正ログイン対策に特化しています。',
            'recommended' => false,
            'note' => '※ログインURLが変更されるため、変更後のURLを必ずメモしておいてください。'
        ),
        'all-in-one-wp-security-and-firewall' => array(
            'name' => 'All In One WP Security',
            'slug' => 'all-in-one-wp-security-and-firewall',
            'file' => 'all-in-one-wp-security-and-firewall/wp-security.php',
            'desc' => '総合的なセキュリティプラグイン。ファイアウォール、ログイン保護、データベースセキュリティなど幅広い機能を備えています。',
            'recommended' => false,
            'note' => '※設定項目が多いため、初心者の方は基本設定のみの利用をおすすめします。'
        )
    );

    // 各プラグインの状態をチェック
    include_once(ABSPATH . 'wp-admin/includes/plugin.php');
    foreach ($security_plugins as $key => &$plugin) {
        $plugin['installed'] = file_exists(WP_PLUGIN_DIR . '/' . $plugin['file']);
        $plugin['active'] = is_plugin_active($plugin['file']);
    }
    unset($plugin);
    ?>
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-security-plugin-modal">
        <div class="lw-wizard-popup lw-wizard-popup-md">
            <div class="lw-wizard-popup-header">
                <h3>
                    <span class="dashicons dashicons-shield-alt"></span>
                    セキュリティプラグインの導入
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-security-plugin-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <p class="lw-security-intro">サイトを不正アクセスやハッキングから守るため、セキュリティプラグインの導入をおすすめします。<br>以下から1つお選びください。</p>
                
                <div class="lw-security-plugin-list">
                    <?php foreach ($security_plugins as $key => $plugin): ?>
                    <label class="lw-security-plugin-item <?php echo $plugin['active'] ? 'is-active' : ''; ?> <?php echo $plugin['recommended'] ? 'is-recommended' : ''; ?>">
                        <div class="lw-security-plugin-radio">
                            <input type="radio" name="security_plugin" value="<?php echo esc_attr($key); ?>" 
                                data-slug="<?php echo esc_attr($plugin['slug']); ?>"
                                data-file="<?php echo esc_attr($plugin['file']); ?>"
                                data-installed="<?php echo $plugin['installed'] ? '1' : '0'; ?>"
                                data-active="<?php echo $plugin['active'] ? '1' : '0'; ?>"
                                <?php echo $plugin['active'] ? 'disabled' : ''; ?>>
                        </div>
                        <div class="lw-security-plugin-info">
                            <div class="lw-security-plugin-header">
                                <span class="lw-security-plugin-name"><?php echo esc_html($plugin['name']); ?></span>
                                <?php if ($plugin['recommended']): ?>
                                    <span class="lw-security-plugin-badge lw-badge-recommended">おすすめ</span>
                                <?php endif; ?>
                                <?php if ($plugin['active']): ?>
                                    <span class="lw-security-plugin-badge lw-badge-active">有効化済み</span>
                                <?php elseif ($plugin['installed']): ?>
                                    <span class="lw-security-plugin-badge lw-badge-installed">インストール済み</span>
                                <?php endif; ?>
                            </div>
                            <p class="lw-security-plugin-desc"><?php echo esc_html($plugin['desc']); ?></p>
                            <?php if ($plugin['note']): ?>
                                <p class="lw-security-plugin-note"><?php echo esc_html($plugin['note']); ?></p>
                            <?php endif; ?>
                        </div>
                    </label>
                    <?php endforeach; ?>
                </div>

                <div class="lw-security-action-area">
                    <div class="lw-security-status" id="lw-security-status" style="display: none;">
                        <span class="spinner"></span>
                        <span class="lw-security-status-text"></span>
                    </div>
                    <div class="lw-security-buttons">
                        <button type="button" class="lw-btn lw-btn-secondary" data-modal-close="lw-security-plugin-modal">キャンセル</button>
                        <button type="button" class="lw-btn lw-btn-primary" id="lw-security-install-btn" disabled>
                            <span class="dashicons dashicons-download"></span>
                            インストール
                        </button>
                        <button type="button" class="lw-btn lw-btn-success" id="lw-security-activate-btn" style="display: none;">
                            <span class="dashicons dashicons-yes"></span>
                            有効化する
                        </button>
                    </div>
                </div>

                <div class="lw-security-note-box">
                    <p><strong>ご注意：</strong></p>
                    <ul>
                        <li>セキュリティプラグインは1つだけ有効にすることをおすすめします。複数を同時に有効にすると競合する場合があります。</li>
                        <li>プラグイン導入後は、各プラグインの設定画面で詳細設定を行ってください。</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- パーマリンク設定ポップアップ -->
    <?php $current_permalink = get_option('permalink_structure', ''); ?>
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-permalink-modal">
        <div class="lw-wizard-popup lw-wizard-popup-sm">
            <div class="lw-wizard-popup-header">
                <h3>
                    <span class="dashicons dashicons-admin-links"></span>
                    パーマリンク設定
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-permalink-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <p class="lw-modal-intro">パーマリンクはページのURL形式を決定します。SEO対策として「投稿名」の使用をおすすめします。</p>

                <div class="lw-permalink-options">
                    <label class="lw-permalink-item <?php echo $current_permalink === '/%postname%/' ? 'is-selected' : ''; ?>">
                        <input type="radio" name="permalink_structure" value="/%postname%/" <?php checked($current_permalink, '/%postname%/'); ?>>
                        <div class="lw-permalink-info">
                            <span class="lw-permalink-name">投稿名</span>
                            <span class="lw-permalink-badge lw-badge-recommended">おすすめ</span>
                            <span class="lw-permalink-example"><?php echo home_url('/sample-post/'); ?></span>
                        </div>
                    </label>
                    <label class="lw-permalink-item <?php echo $current_permalink === '/archives/%post_id%' ? 'is-selected' : ''; ?>">
                        <input type="radio" name="permalink_structure" value="/archives/%post_id%" <?php checked($current_permalink, '/archives/%post_id%'); ?>>
                        <div class="lw-permalink-info">
                            <span class="lw-permalink-name">数字ベース</span>
                            <span class="lw-permalink-example"><?php echo home_url('/archives/123'); ?></span>
                        </div>
                    </label>
                    <label class="lw-permalink-item <?php echo $current_permalink === '/%year%/%monthnum%/%postname%/' ? 'is-selected' : ''; ?>">
                        <input type="radio" name="permalink_structure" value="/%year%/%monthnum%/%postname%/" <?php checked($current_permalink, '/%year%/%monthnum%/%postname%/'); ?>>
                        <div class="lw-permalink-info">
                            <span class="lw-permalink-name">日付と投稿名</span>
                            <span class="lw-permalink-example"><?php echo home_url('/2024/12/sample-post/'); ?></span>
                        </div>
                    </label>
                    <label class="lw-permalink-item lw-permalink-not-recommended <?php echo $current_permalink === '' ? 'is-selected' : ''; ?>" id="lw-permalink-basic">
                        <input type="radio" name="permalink_structure" value="" <?php checked($current_permalink, ''); ?>>
                        <div class="lw-permalink-info">
                            <span class="lw-permalink-name">基本</span>
                            <span class="lw-permalink-badge lw-badge-not-recommended">非推奨</span>
                            <span class="lw-permalink-example"><?php echo home_url('/?p=123'); ?></span>
                        </div>
                    </label>
                </div>

                <!-- 基本設定選択時の警告 -->
                <div class="lw-permalink-warning" id="lw-permalink-basic-warning" style="display: none;">
                    <p><span class="dashicons dashicons-warning"></span> <strong>警告：</strong>「基本」設定はLiteWordでは非推奨です。LiteWordはAPI経由での操作が中心のため、基本設定にすると多くの機能が正常に動作しなくなります。特別な理由がない限り「投稿名」をお選びください。</p>
                </div>

                <div class="lw-permalink-note">
                    <p><span class="dashicons dashicons-info"></span> <strong>注意：</strong>サイト公開後にパーマリンクを変更すると、既存ページのURLが変わりSEOに悪影響を及ぼす可能性があります。公開前に設定することをおすすめします。</p>
                </div>

                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-permalink-modal">キャンセル</button>
                    <button type="button" class="lw-btn lw-btn-primary" id="lw-permalink-save">
                        <span class="dashicons dashicons-yes"></span> 保存する
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ファビコン設定ポップアップ -->
    <?php $site_icon_id = get_option('site_icon', 0); ?>
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-favicon-modal">
        <div class="lw-wizard-popup lw-wizard-popup-sm">
            <div class="lw-wizard-popup-header">
                <h3>
                    <span class="dashicons dashicons-format-image"></span>
                    ファビコン設定
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-favicon-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <p class="lw-modal-intro">ファビコン（サイトアイコン）はブラウザのタブやブックマークに表示される小さなアイコンです。</p>

                <div class="lw-favicon-upload">
                    <div class="lw-favicon-preview" id="lw-favicon-preview">
                        <?php if ($site_icon_id): ?>
                            <img src="<?php echo esc_url(wp_get_attachment_image_url($site_icon_id, 'thumbnail')); ?>" alt="ファビコン">
                        <?php else: ?>
                            <span class="lw-no-favicon">
                                <span class="dashicons dashicons-format-image"></span>
                                <span>未設定</span>
                            </span>
                        <?php endif; ?>
                    </div>
                    <input type="hidden" id="lw-favicon-id" value="<?php echo esc_attr($site_icon_id); ?>">
                    <div class="lw-favicon-buttons">
                        <button type="button" class="lw-btn lw-btn-secondary" id="lw-favicon-select">
                            <span class="dashicons dashicons-upload"></span> 画像を選択
                        </button>
                        <button type="button" class="lw-btn-text" id="lw-favicon-remove" <?php echo !$site_icon_id ? 'style="display:none;"' : ''; ?>>削除</button>
                    </div>
                </div>

                <div class="lw-favicon-requirements">
                    <p><strong>推奨サイズ:</strong> 512×512ピクセル以上の正方形画像</p>
                    <p><strong>対応形式:</strong> PNG, ICO, GIF（透過PNG推奨）</p>
                </div>

                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-favicon-modal">キャンセル</button>
                    <button type="button" class="lw-btn lw-btn-primary" id="lw-favicon-save">
                        <span class="dashicons dashicons-yes"></span> 保存する
                    </button>
                </div>
            </div>
        </div>
    </div>
    <?php lw_render_seo_check_modal(); ?>

    <!-- プライバシーポリシー確認モーダル -->
    <div class="lw-modal-overlay lw-wizard-modal" id="lw-privacy-modal">
        <div class="lw-wizard-popup lw-wizard-popup-md">
            <div class="lw-wizard-popup-header">
                <h3>
                    <span class="dashicons dashicons-shield"></span>
                    プライバシーポリシー・利用規約の確認
                </h3>
                <button type="button" class="lw-modal-close" data-modal="lw-privacy-modal">
                    <span class="dashicons dashicons-no-alt"></span>
                </button>
            </div>
            <div class="lw-wizard-popup-body">
                <p class="lw-modal-intro">サイトの運営内容に応じて、必要な法的ページを確認しましょう。該当する項目にチェックを入れてください。</p>

                <!-- サイト運営内容の確認 -->
                <div class="lw-privacy-section">
                    <h4 class="lw-privacy-section-title">
                        <span class="dashicons dashicons-clipboard"></span>
                        サイトの運営内容
                    </h4>
                    <div class="lw-privacy-checklist">
                        <label class="lw-privacy-check-item">
                            <input type="checkbox" id="lw-privacy-contact-form" class="lw-privacy-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-check-text">お問い合わせフォームを設置している</span>
                        </label>
                        <label class="lw-privacy-check-item">
                            <input type="checkbox" id="lw-privacy-ec" class="lw-privacy-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-check-text">ECサイトとして商品を販売している</span>
                        </label>
                        <label class="lw-privacy-check-item">
                            <input type="checkbox" id="lw-privacy-membership" class="lw-privacy-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-check-text">会員登録機能がある</span>
                        </label>
                        <label class="lw-privacy-check-item">
                            <input type="checkbox" id="lw-privacy-analytics" class="lw-privacy-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-check-text">アクセス解析（Google Analytics等）を使用している</span>
                        </label>
                        <label class="lw-privacy-check-item">
                            <input type="checkbox" id="lw-privacy-ads" class="lw-privacy-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-check-text">広告（Google AdSense等）を掲載している</span>
                        </label>
                        <label class="lw-privacy-check-item">
                            <input type="checkbox" id="lw-privacy-newsletter" class="lw-privacy-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-check-text">メルマガ・ニュースレター登録機能がある</span>
                        </label>
                    </div>
                </div>

                <!-- 必要なページの表示 -->
                <div class="lw-privacy-section">
                    <h4 class="lw-privacy-section-title">
                        <span class="dashicons dashicons-media-document"></span>
                        必要な法的ページ
                    </h4>
                    <div class="lw-privacy-requirements" id="lw-privacy-requirements">
                        <p class="lw-privacy-hint">上記の項目にチェックを入れると、必要なページが表示されます。</p>
                    </div>
                </div>

                <!-- ページ作成状況の確認 -->
                <div class="lw-privacy-section">
                    <h4 class="lw-privacy-section-title">
                        <span class="dashicons dashicons-yes-alt"></span>
                        ページ作成状況の確認
                    </h4>
                    <div class="lw-privacy-status-list" id="lw-privacy-status-list">
                        <label class="lw-privacy-status-item">
                            <input type="checkbox" id="lw-privacy-done-policy" class="lw-privacy-done-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-status-text">プライバシーポリシーを作成した</span>
                        </label>
                        <label class="lw-privacy-status-item" id="lw-privacy-status-terms" style="display: none;">
                            <input type="checkbox" id="lw-privacy-done-terms" class="lw-privacy-done-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-status-text">利用規約を作成した</span>
                        </label>
                        <label class="lw-privacy-status-item" id="lw-privacy-status-law" style="display: none;">
                            <input type="checkbox" id="lw-privacy-done-law" class="lw-privacy-done-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-status-text">特定商取引法に基づく表記を作成した</span>
                        </label>
                        <label class="lw-privacy-status-item" id="lw-privacy-status-cookie" style="display: none;">
                            <input type="checkbox" id="lw-privacy-done-cookie" class="lw-privacy-done-checkbox">
                            <span class="lw-privacy-checkbox-custom"></span>
                            <span class="lw-privacy-status-text">Cookieポリシーを作成した</span>
                        </label>
                    </div>
                </div>

                <div class="lw-privacy-note">
                    <p><span class="dashicons dashicons-info"></span> <strong>注意：</strong>法的ページの内容は、弁護士や専門家に確認することをおすすめします。テンプレートをそのまま使用する場合も、サイトの実態に合わせて内容を調整してください。</p>
                </div>

                <div class="lw-form-actions">
                    <button type="button" class="lw-btn-cancel" data-modal="lw-privacy-modal">閉じる</button>
                    <button type="button" class="lw-btn lw-btn-primary" id="lw-privacy-complete">
                        <span class="dashicons dashicons-yes"></span> 確認完了
                    </button>
                </div>
            </div>
        </div>
    </div>

    <?php lw_render_page_tree_modal(); ?>

    <?php
    // トライアル開始モーダル（ボタンが表示されている場合のみ）
    if (function_exists('lw_is_subscription_active') && !lw_is_subscription_active()) {
        $show_trial_modal = false;
        $is_trial_active = function_exists('lw_is_trial_active') ? lw_is_trial_active() : false;

        if (!$is_trial_active && class_exists('LwTemplateSetting')) {
            $templateSetting = new LwTemplateSetting();
            $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');

            if (!$trial_setting) {
                $show_trial_modal = true;
            } else {
                $last_timestamp = strtotime($trial_setting['timestamp']);
                $days_elapsed = floor((time() - $last_timestamp) / (60 * 60 * 24));
                if ($trial_setting['active_flag'] == 0 && $days_elapsed >= 60) {
                    $show_trial_modal = true;
                }
            }
        }

        if ($show_trial_modal) :
    ?>
    <!-- トライアル開始モーダル -->
    <div class="lw-trial-modal-overlay" id="lw-trial-modal-overlay">
        <div class="lw-trial-modal">
            <button type="button" class="lw-trial-modal-close" id="lw-trial-modal-close">&times;</button>

            <div class="lw-trial-modal-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </div>

            <h3><span class="highlight">プレミアム機能</span>を14日間無料でお試し</h3>
            <p class="lw-trial-modal-subtitle">すべての有料デザインパーツをご利用いただけます</p>

            <div class="lw-trial-modal-features">
                <div class="lw-trial-modal-feature">
                    <div class="lw-trial-modal-feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    </div>
                    <div class="lw-trial-modal-feature-text">40種類以上の<br>デザインパーツ</div>
                </div>
                <div class="lw-trial-modal-feature">
                    <div class="lw-trial-modal-feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                    <div class="lw-trial-modal-feature-text">プロ仕様の<br>カスタマイズ</div>
                </div>
                <div class="lw-trial-modal-feature">
                    <div class="lw-trial-modal-feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div class="lw-trial-modal-feature-text">制限なしで<br>14日間利用</div>
                </div>
            </div>

            <p class="lw-trial-modal-note">
                <span>クレジットカード不要</span>
                <span>自動課金なし</span>
            </p>

            <div class="lw-trial-modal-buttons">
                <button type="button" class="lw-trial-modal-btn lw-trial-modal-btn-yes" id="lw-trial-modal-yes">
                    無料で試してみる
                </button>
                <button type="button" class="lw-trial-modal-btn lw-trial-modal-btn-no" id="lw-trial-modal-no">
                    後で
                </button>
            </div>

            <div class="lw-trial-modal-message" id="lw-trial-modal-message"></div>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        // トライアルボタンクリックでモーダル表示
        $('#lw-trial-start-trigger').on('click', function() {
            $('#lw-trial-modal-overlay').addClass('active');
        });

        // モーダルを閉じる
        $('#lw-trial-modal-close, #lw-trial-modal-no').on('click', function() {
            $('#lw-trial-modal-overlay').removeClass('active');
        });

        // オーバーレイクリックで閉じる
        $('#lw-trial-modal-overlay').on('click', function(e) {
            if (e.target.id === 'lw-trial-modal-overlay') {
                $(this).removeClass('active');
            }
        });

        // トライアル開始
        $('#lw-trial-modal-yes').on('click', function() {
            var $btn = $(this);
            var $message = $('#lw-trial-modal-message');

            $btn.prop('disabled', true).text('⏳ 処理中...');

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'lw_activate_trial',
                    nonce: '<?php echo wp_create_nonce('lw_trial_nonce'); ?>'
                },
                success: function(response) {
                    if (response.success) {
                        $message.removeClass('error').addClass('success')
                            .text('🎊 試用期間が開始されました！ページを再読み込みします...');

                        setTimeout(function() {
                            location.reload();
                        }, 1500);
                    } else {
                        $message.removeClass('success').addClass('error')
                            .text('エラーが発生しました。もう一度お試しください。');
                        $btn.prop('disabled', false).text('🚀 今すぐ始める');
                    }
                },
                error: function() {
                    $message.removeClass('success').addClass('error')
                        .text('通信エラーが発生しました。');
                    $btn.prop('disabled', false).text('🚀 今すぐ始める');
                }
            });
        });
    });
    </script>
    <?php
        endif;
    }
    ?>
    <?php
}

// Welcome Panel を完全に無効化
add_filter('get_user_metadata', 'lw_force_hide_welcome_panel', 10, 4);
function lw_force_hide_welcome_panel($value, $object_id, $meta_key, $single) {
    if ($meta_key === 'show_welcome_panel') {
        return $single ? 0 : array(0);
    }
    return $value;
}

// Ajax: サイト基本情報を取得
add_action('wp_ajax_lw_get_site_info', 'lw_ajax_get_site_info');
function lw_ajax_get_site_info() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    $logo_id = get_theme_mod('custom_logo', 0);
    $logo_url = $logo_id ? wp_get_attachment_image_url($logo_id, 'medium') : '';

    wp_send_json_success(array(
        'site_title' => get_bloginfo('name'),
        'site_tagline' => get_bloginfo('description'),
        'logo_id' => $logo_id,
        'logo_url' => $logo_url,
        'timezone' => get_option('timezone_string', 'Asia/Tokyo'),
        'date_format' => get_option('date_format', 'Y年n月j日'),
        'time_format' => get_option('time_format', 'H:i')
    ));
}

// Ajax: サイト基本情報を保存
add_action('wp_ajax_lw_save_site_info', 'lw_ajax_save_site_info');
function lw_ajax_save_site_info() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $site_title = sanitize_text_field($_POST['site_title']);
    $site_tagline = sanitize_text_field($_POST['site_tagline']);
    $logo_id = intval($_POST['logo_id']);

    update_option('blogname', $site_title);
    update_option('blogdescription', $site_tagline);

    // ロゴを保存（テーマカスタマイザーの設定と同期）
    if ($logo_id > 0) {
        set_theme_mod('custom_logo', $logo_id);
    } else {
        remove_theme_mod('custom_logo');
    }

    // タイムゾーン・日付形式を保存
    if (isset($_POST['timezone'])) {
        update_option('timezone_string', sanitize_text_field($_POST['timezone']));
    }
    if (isset($_POST['date_format'])) {
        update_option('date_format', sanitize_text_field($_POST['date_format']));
    }
    if (isset($_POST['time_format'])) {
        update_option('time_format', sanitize_text_field($_POST['time_format']));
    }

    wp_send_json_success(array(
        'message' => '保存しました'
    ));
}

// Ajax: カラー・フォント設定を取得
add_action('wp_ajax_lw_get_color_font', 'lw_ajax_get_color_font');
function lw_ajax_get_color_font() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    // フォント配列を取得
    $fonts = ctm_font_family_arr();
    $font_options = array();
    foreach ($fonts as $value => $label) {
        $font_options[] = array(
            'value' => $value,
            'label' => $label
        );
    }

    wp_send_json_success(array(
        'color_main' => get_theme_mod('color_main', '#1a72ad'),
        'color_accent' => get_theme_mod('color_accent', '#d34a4a'),
        'font_body' => get_theme_mod('font_body', 'gothic'),
        'font_options' => $font_options
    ));
}

// Ajax: カラー・フォント設定を保存
add_action('wp_ajax_lw_save_color_font', 'lw_ajax_save_color_font');
function lw_ajax_save_color_font() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $color_main = sanitize_hex_color($_POST['color_main']);
    $color_accent = sanitize_hex_color($_POST['color_accent']);
    $font_body = sanitize_text_field($_POST['font_body']);

    set_theme_mod('color_main', $color_main);
    set_theme_mod('color_accent', $color_accent);
    set_theme_mod('font_body', $font_body);

    wp_send_json_success(array(
        'message' => '保存しました'
    ));
}

// Ajax: ヘッダーパターンを取得
add_action('wp_ajax_lw_get_header_pattern', 'lw_ajax_get_header_pattern');
function lw_ajax_get_header_pattern() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    $current_ptn = get_theme_mod('header_set_ptn_df', 'ptn_1');
    $patterns = array();
    $base_url = get_template_directory_uri() . '/assets/image/lw_header_sample/';

    // ptn_4は特定テンプレート購入者のみ利用可能
    $has_ptn4_access = function_exists('templateSettingCheck') &&
        (templateSettingCheck("shin_gas_station_01") || templateSettingCheck("template_001"));

    for ($i = 1; $i <= 6; $i++) {
        $ptn_value = 'ptn_' . $i;
        $is_locked = ($i === 4 && !$has_ptn4_access);

        $patterns[] = array(
            'value' => $ptn_value,
            'label' => 'パターン ' . $i,
            'image' => $base_url . $ptn_value . '.webp',
            'locked' => $is_locked,
            'locked_message' => $is_locked ? '特定テンプレートの購入が必要です' : ''
        );
    }

    wp_send_json_success(array(
        'current' => $current_ptn,
        'patterns' => $patterns,
        'customize_url' => admin_url('customize.php?autofocus[control]=header_ptn_')
    ));
}

// Ajax: ヘッダーパターンを保存
add_action('wp_ajax_lw_save_header_pattern', 'lw_ajax_save_header_pattern');
function lw_ajax_save_header_pattern() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $header_ptn = sanitize_text_field($_POST['header_ptn']);

    // パターン値のバリデーション
    $valid_patterns = array('ptn_1', 'ptn_2', 'ptn_3', 'ptn_4', 'ptn_5', 'ptn_6');
    if (!in_array($header_ptn, $valid_patterns)) {
        wp_send_json_error('無効なパターンです');
    }

    set_theme_mod('header_set_ptn_df', $header_ptn);

    wp_send_json_success(array(
        'message' => '保存しました'
    ));
}

// Ajax: フッターパターンを取得
add_action('wp_ajax_lw_get_footer_pattern', 'lw_ajax_get_footer_pattern');
function lw_ajax_get_footer_pattern() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    $current_ptn = get_theme_mod('footer_set_ptn_df', 'ptn_1');
    $patterns = array();
    $base_url = get_template_directory_uri() . '/assets/image/lw_footer_sample/';

    // ptn_3は特定テンプレート購入者のみ利用可能
    $has_ptn3_access = function_exists('templateSettingCheck') &&
        (templateSettingCheck("shin_gas_station_01") || templateSettingCheck("template_001"));

    for ($i = 1; $i <= 4; $i++) {
        $ptn_value = 'ptn_' . $i;
        $is_locked = ($i === 3 && !$has_ptn3_access);

        $patterns[] = array(
            'value' => $ptn_value,
            'label' => 'パターン ' . $i,
            'image' => $base_url . $ptn_value . '.webp',
            'locked' => $is_locked,
            'locked_message' => $is_locked ? '特定テンプレートの購入が必要です' : ''
        );
    }

    wp_send_json_success(array(
        'current' => $current_ptn,
        'patterns' => $patterns,
        'customize_url' => admin_url('customize.php?autofocus[control]=footer_ptn_')
    ));
}

// Ajax: フッターパターンを保存
add_action('wp_ajax_lw_save_footer_pattern', 'lw_ajax_save_footer_pattern');
function lw_ajax_save_footer_pattern() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $footer_ptn = sanitize_text_field($_POST['footer_ptn']);

    // パターン値のバリデーション
    $valid_patterns = array('ptn_1', 'ptn_2', 'ptn_3', 'ptn_4');
    if (!in_array($footer_ptn, $valid_patterns)) {
        wp_send_json_error('無効なパターンです');
    }

    set_theme_mod('footer_set_ptn_df', $footer_ptn);

    wp_send_json_success(array(
        'message' => '保存しました'
    ));
}

// Ajax: 公開設定を取得
add_action('wp_ajax_lw_get_publish_settings', 'lw_ajax_get_publish_settings');
function lw_ajax_get_publish_settings() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $blog_public = get_option('blog_public', '1');

    wp_send_json_success(array(
        'blog_public' => $blog_public
    ));
}

// Ajax: 公開設定を保存
add_action('wp_ajax_lw_save_publish_settings', 'lw_ajax_save_publish_settings');
function lw_ajax_save_publish_settings() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $blog_public = isset($_POST['blog_public']) && $_POST['blog_public'] === '1' ? '1' : '0';

    update_option('blog_public', $blog_public);

    wp_send_json_success(array(
        'message' => '保存しました'
    ));
}

// Ajax: 拡張機能を有効化
add_action('wp_ajax_lw_enable_extension', 'lw_ajax_enable_extension');
function lw_ajax_enable_extension() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $type = sanitize_text_field($_POST['type']);

    if ($type === 'seo') {
        set_theme_mod('lw_extensions_seo_functions_switch', 'on');
    } elseif ($type === 'mailForm') {
        set_theme_mod('lw_extensions_mail_form_switch_all', 'on');
    } else {
        wp_send_json_error('無効なタイプです');
    }

    wp_send_json_success(array(
        'message' => '有効にしました'
    ));
}

// Ajax: 固定ページ一覧を取得
add_action('wp_ajax_lw_get_pages', 'lw_ajax_get_pages');
function lw_ajax_get_pages() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $pages = get_pages(array(
        'sort_column' => 'menu_order,post_title',
        'sort_order' => 'ASC',
        'post_status' => array('publish', 'draft', 'pending'),
        'hierarchical' => true
    ));

    $front_page_id = get_option('page_on_front');

    $result = array();
    foreach ($pages as $page) {
        $result[] = array(
            'id' => $page->ID,
            'title' => $page->post_title,
            'slug' => $page->post_name,
            'status' => $page->post_status,
            'parent' => $page->post_parent,
            'order' => $page->menu_order,
            'url' => get_permalink($page->ID),
            'depth' => lw_get_page_depth($page->ID),
            'is_front' => ($page->ID == $front_page_id),
            'task_status' => get_post_meta($page->ID, '_lw_task_status', true) ?: 'not-started'
        );
    }

    wp_send_json_success(array(
        'pages' => $result,
        'front_page_id' => intval($front_page_id)
    ));
}

// ページの階層深度を取得
function lw_get_page_depth($page_id) {
    $depth = 0;
    $parent_id = wp_get_post_parent_id($page_id);
    while ($parent_id) {
        $depth++;
        $parent_id = wp_get_post_parent_id($parent_id);
    }
    return $depth;
}

// Ajax: タスクステータスを更新
add_action('wp_ajax_lw_update_task_status', 'lw_ajax_update_task_status');
function lw_ajax_update_task_status() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = intval($_POST['page_id']);
    $task_status = sanitize_text_field($_POST['task_status']);

    // バリデーション
    $valid_statuses = array(
        'not-started',
        'waiting-copy',
        'waiting-material',
        'in-progress',
        'internal-review',
        'revising',
        'client-review',
        'revision-requested',
        'approved',
        'completed'
    );
    if (!in_array($task_status, $valid_statuses)) {
        wp_send_json_error('無効なステータスです');
    }

    if (!$page_id || get_post_type($page_id) !== 'page') {
        wp_send_json_error('無効なページIDです');
    }

    // ポストメタに保存
    update_post_meta($page_id, '_lw_task_status', $task_status);

    wp_send_json_success(array(
        'message' => '保存しました',
        'page_id' => $page_id,
        'task_status' => $task_status
    ));
}

// Ajax: 固定ページを追加
add_action('wp_ajax_lw_add_page', 'lw_ajax_add_page');
function lw_ajax_add_page() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $title = sanitize_text_field($_POST['title']);
    $slug = isset($_POST['slug']) ? sanitize_title($_POST['slug']) : '';

    if (empty($title)) {
        wp_send_json_error('タイトルを入力してください');
    }

    $post_data = array(
        'post_title' => $title,
        'post_type' => 'page',
        'post_status' => 'draft',
        'post_content' => ''
    );

    // スラッグが指定されている場合は設定
    if (!empty($slug)) {
        $post_data['post_name'] = $slug;
    }

    $page_id = wp_insert_post($post_data);

    if (is_wp_error($page_id)) {
        wp_send_json_error('ページの作成に失敗しました');
    }

    // 作成されたページの情報を取得
    $page = get_post($page_id);

    wp_send_json_success(array(
        'page_id' => $page_id,
        'title' => $page->post_title,
        'slug' => $page->post_name,
        'message' => 'ページを作成しました'
    ));
}

// Ajax: 固定ページを削除（ゴミ箱へ）
add_action('wp_ajax_lw_delete_page', 'lw_ajax_delete_page');
function lw_ajax_delete_page() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('delete_pages')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = intval($_POST['page_id']);

    if (!$page_id) {
        wp_send_json_error('無効なページIDです');
    }

    $result = wp_trash_post($page_id);

    if (!$result) {
        wp_send_json_error('削除に失敗しました');
    }

    wp_send_json_success(array('message' => '削除しました'));
}

// Ajax: 固定ページの順序を一括更新（ウィザード用）
add_action('wp_ajax_lw_wizard_update_page_order', 'lw_ajax_wizard_update_page_order');
function lw_ajax_wizard_update_page_order() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $order = json_decode(stripslashes($_POST['order']), true);

    if (!is_array($order)) {
        wp_send_json_error('無効なデータです');
    }

    foreach ($order as $item) {
        wp_update_post(array(
            'ID' => intval($item['id']),
            'menu_order' => intval($item['order']),
            'post_parent' => intval($item['parent'])
        ));
    }

    wp_send_json_success(array('message' => '順序を更新しました'));
}

// Ajax: ステップ状態を保存
add_action('wp_ajax_lw_save_step_status', 'lw_ajax_save_step_status');
function lw_ajax_save_step_status() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $step = intval($_POST['step']);
    $ok = intval($_POST['ok']);
    $comment = sanitize_textarea_field($_POST['comment']);

    $wizard_data = get_option('lw_wizard_status', array());

    $wizard_data['step_' . $step] = array(
        'ok' => $ok,
        'comment' => $comment
    );

    update_option('lw_wizard_status', $wizard_data);

    wp_send_json_success(array(
        'message' => '保存しました'
    ));
}

// Ajax: ページ情報を更新（タイトル・スラッグ）
add_action('wp_ajax_lw_update_page_info', 'lw_ajax_update_page_info');
function lw_ajax_update_page_info() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = intval($_POST['page_id']);
    $title = sanitize_text_field($_POST['title']);
    $slug = sanitize_title($_POST['slug']);

    if (!$page_id) {
        wp_send_json_error('無効なページIDです');
    }

    if (empty($title)) {
        wp_send_json_error('タイトルを入力してください');
    }

    $result = wp_update_post(array(
        'ID' => $page_id,
        'post_title' => $title,
        'post_name' => $slug
    ));

    if (is_wp_error($result)) {
        wp_send_json_error($result->get_error_message());
    }

    // 更新後のスラッグを取得（WPが自動調整する場合があるため）
    $updated_page = get_post($page_id);

    wp_send_json_success(array(
        'message' => '保存しました',
        'page_id' => $page_id,
        'title' => $updated_page->post_title,
        'slug' => $updated_page->post_name
    ));
}

// Ajax: トップページを設定
add_action('wp_ajax_lw_set_front_page', 'lw_ajax_set_front_page');
function lw_ajax_set_front_page() {
    // wizard または page_tree どちらのnonceでも受け付ける
    $nonce = isset($_POST['nonce']) ? sanitize_text_field($_POST['nonce']) : '';
    if (!wp_verify_nonce($nonce, 'lw_wizard_nonce') && !wp_verify_nonce($nonce, 'lw_page_tree_nonce')) {
        wp_send_json_error('セキュリティチェックに失敗しました');
    }

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = intval($_POST['page_id']);

    if ($page_id === 0) {
        // 最新の投稿を表示する設定に戻す
        update_option('show_on_front', 'posts');
        update_option('page_on_front', 0);
    } else {
        // 固定ページをトップページに設定
        $page = get_post($page_id);
        if (!$page || $page->post_type !== 'page') {
            wp_send_json_error('無効なページです');
        }

        update_option('show_on_front', 'page');
        update_option('page_on_front', $page_id);

        // トップページのmenu_orderを0にして最初に表示
        wp_update_post(array(
            'ID' => $page_id,
            'menu_order' => 0,
            'post_parent' => 0  // 親ページも解除
        ));
    }

    wp_send_json_success(array(
        'message' => 'トップページを設定しました',
        'front_page_id' => $page_id
    ));
}

// Ajax: ページステータスを更新
add_action('wp_ajax_lw_update_page_status', 'lw_ajax_update_page_status');
function lw_ajax_update_page_status() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('edit_pages')) {
        wp_send_json_error('権限がありません');
    }

    $page_id = intval($_POST['page_id']);
    $status = sanitize_text_field($_POST['status']);
    $schedule_date = isset($_POST['schedule_date']) ? sanitize_text_field($_POST['schedule_date']) : '';

    if (!$page_id) {
        wp_send_json_error('無効なページIDです');
    }

    // 許可されたステータスのみ
    $allowed_statuses = array('publish', 'draft', 'pending', 'private', 'future');
    if (!in_array($status, $allowed_statuses)) {
        wp_send_json_error('無効なステータスです');
    }

    $post_data = array(
        'ID' => $page_id,
        'post_status' => $status
    );

    // 予約投稿の場合は日時を設定
    if ($status === 'future' && !empty($schedule_date)) {
        $post_data['post_date'] = $schedule_date;
        $post_data['post_date_gmt'] = get_gmt_from_date($schedule_date);
    }

    $result = wp_update_post($post_data);

    if (is_wp_error($result)) {
        wp_send_json_error($result->get_error_message());
    }

    // ステータスラベルを取得
    $status_labels = array(
        'publish' => '公開',
        'draft' => '下書き',
        'pending' => 'レビュー待ち',
        'private' => '非公開',
        'future' => '予約'
    );

    wp_send_json_success(array(
        'message' => 'ステータスを更新しました',
        'page_id' => $page_id,
        'status' => $status,
        'status_label' => isset($status_labels[$status]) ? $status_labels[$status] : $status
    ));
}


// セキュリティプラグインのインストール
add_action('wp_ajax_lw_install_security_plugin', 'lw_ajax_install_security_plugin');
function lw_ajax_install_security_plugin() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('install_plugins')) {
        wp_send_json_error('プラグインをインストールする権限がありません');
    }

    $plugin_slug = sanitize_text_field($_POST['plugin_slug']);
    
    if (empty($plugin_slug)) {
        wp_send_json_error('プラグインが指定されていません');
    }

    include_once(ABSPATH . 'wp-admin/includes/plugin-install.php');
    include_once(ABSPATH . 'wp-admin/includes/class-wp-upgrader.php');
    include_once(ABSPATH . 'wp-admin/includes/file.php');

    // プラグイン情報を取得
    $api = plugins_api('plugin_information', array(
        'slug' => $plugin_slug,
        'fields' => array(
            'sections' => false
        )
    ));

    if (is_wp_error($api)) {
        wp_send_json_error('プラグイン情報の取得に失敗しました: ' . $api->get_error_message());
    }

    // サイレントインストール
    $skin = new WP_Ajax_Upgrader_Skin();
    $upgrader = new Plugin_Upgrader($skin);
    $result = $upgrader->install($api->download_link);

    if (is_wp_error($result)) {
        wp_send_json_error('インストールに失敗しました: ' . $result->get_error_message());
    }

    if ($result === false) {
        wp_send_json_error('インストールに失敗しました');
    }

    wp_send_json_success(array(
        'message' => 'インストールが完了しました',
        'plugin_slug' => $plugin_slug
    ));
}

// セキュリティプラグインの有効化
add_action('wp_ajax_lw_activate_security_plugin', 'lw_ajax_activate_security_plugin');
function lw_ajax_activate_security_plugin() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('activate_plugins')) {
        wp_send_json_error('プラグインを有効化する権限がありません');
    }

    $plugin_file = sanitize_text_field($_POST['plugin_file']);
    
    if (empty($plugin_file)) {
        wp_send_json_error('プラグインが指定されていません');
    }

    // プラグインを有効化
    $result = activate_plugin($plugin_file);

    if (is_wp_error($result)) {
        wp_send_json_error('有効化に失敗しました: ' . $result->get_error_message());
    }

    wp_send_json_success(array(
        'message' => 'プラグインを有効化しました',
        'plugin_file' => $plugin_file
    ));
}

// セキュリティプラグインの状態取得
add_action('wp_ajax_lw_get_security_plugin_status', 'lw_ajax_get_security_plugin_status');
function lw_ajax_get_security_plugin_status() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    $plugin_file = sanitize_text_field($_POST['plugin_file']);
    
    include_once(ABSPATH . 'wp-admin/includes/plugin.php');

    $installed = file_exists(WP_PLUGIN_DIR . '/' . $plugin_file);
    $active = is_plugin_active($plugin_file);

    wp_send_json_success(array(
        'installed' => $installed,
        'active' => $active
    ));
}

// SVG Supportプラグインのインストール
add_action('wp_ajax_lw_install_svg_support', 'lw_ajax_install_svg_support');
function lw_ajax_install_svg_support() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('install_plugins')) {
        wp_send_json_error('プラグインをインストールする権限がありません');
    }

    include_once(ABSPATH . 'wp-admin/includes/plugin-install.php');
    include_once(ABSPATH . 'wp-admin/includes/class-wp-upgrader.php');
    include_once(ABSPATH . 'wp-admin/includes/file.php');

    $api = plugins_api('plugin_information', array(
        'slug' => 'svg-support',
        'fields' => array('sections' => false)
    ));

    if (is_wp_error($api)) {
        wp_send_json_error('プラグイン情報の取得に失敗しました');
    }

    $skin = new WP_Ajax_Upgrader_Skin();
    $upgrader = new Plugin_Upgrader($skin);
    $result = $upgrader->install($api->download_link);

    if (is_wp_error($result) || $result === false) {
        wp_send_json_error('インストールに失敗しました');
    }

    wp_send_json_success(array('message' => 'インストール完了'));
}

// SVG Supportプラグインの有効化
add_action('wp_ajax_lw_activate_svg_support', 'lw_ajax_activate_svg_support');
function lw_ajax_activate_svg_support() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('activate_plugins')) {
        wp_send_json_error('プラグインを有効化する権限がありません');
    }

    $result = activate_plugin('svg-support/svg-support.php');

    if (is_wp_error($result)) {
        wp_send_json_error('有効化に失敗しました: ' . $result->get_error_message());
    }

    wp_send_json_success(array('message' => 'SVG Supportを有効化しました'));
}

// パーマリンク設定を保存
add_action('wp_ajax_lw_save_permalink', 'lw_ajax_save_permalink');
function lw_ajax_save_permalink() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $structure = sanitize_text_field($_POST['permalink_structure']);

    // パーマリンク構造を更新
    update_option('permalink_structure', $structure);

    // リライトルールをフラッシュ
    flush_rewrite_rules();

    wp_send_json_success(array('message' => 'パーマリンク設定を保存しました'));
}

// ファビコン設定を保存
add_action('wp_ajax_lw_save_favicon', 'lw_ajax_save_favicon');
function lw_ajax_save_favicon() {
    check_ajax_referer('lw_wizard_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    $icon_id = intval($_POST['icon_id']);

    if ($icon_id > 0) {
        update_option('site_icon', $icon_id);
    } else {
        delete_option('site_icon');
    }

    wp_send_json_success(array('message' => 'ファビコンを保存しました'));
}
