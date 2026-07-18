<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — HTML出力（ボタン・ポップアップ・FAB）
 */

/**
 * アセット読み込み（全管理画面ページ）
 */
add_action('admin_enqueue_scripts', 'lw_ai_chat_enqueue_assets');
function lw_ai_chat_enqueue_assets($hook) {
    $css_ver = LW_AI_CHAT_VERSION . '.' . filemtime(LW_AI_CHAT_PATH . 'css/chat-widget.css');
    $js_ver  = LW_AI_CHAT_VERSION . '.' . filemtime(LW_AI_CHAT_PATH . 'js/chat-widget.js');
    wp_enqueue_style('lw-ai-chat', LW_AI_CHAT_URL . 'css/chat-widget.css', [], $css_ver);
    wp_enqueue_script('lw-ai-chat', LW_AI_CHAT_URL . 'js/chat-widget.js', [], $js_ver, true);

    $user = wp_get_current_user();

    wp_localize_script('lw-ai-chat', 'lwAiChat', [
        'userName'       => $user->display_name ?: $user->user_login,
        'apiUrl'         => rest_url('liteword/v1/ai-chat'),
        'consentUrl'     => rest_url('liteword/v1/ai-chat-consent'),
        'historyUrl'     => rest_url('liteword/v1/ai-chat-history'),
        'modeUrl'        => rest_url('liteword/v1/ai-chat-mode'),
        'settingsUrl'    => admin_url('options-general.php?page=lw-ai-generator-settings'),
        'nonce'          => wp_create_nonce('wp_rest'),
        'avatarUrl'      => LW_AI_CHAT_URL . 'img/neko-bot.svg',
        'hasConsent'     => get_user_meta($user->ID, 'lw_ai_chat_consent', true) === '1',
        'isPremium'      => lw_ai_chat_is_premium(),
        'hasOwnKey'      => lw_ai_chat_has_own_key(),
        'useOwnKey'      => lw_ai_chat_use_own_key(),
        'usageUrl'       => rest_url('lw-ai-generator/v1/usage-stats'),
        'settingsApiUrl' => rest_url('liteword/v1/site-settings'),
        'modelUrl'       => rest_url('liteword/v1/ai-chat-model'),
        'manualUrl'      => 'https://lite-word.com/manual/',
        'generatePageUrl' => rest_url('lw-ai-generator/v1/generate-page'),
        'dailyLimit'     => lw_ai_chat_is_premium() ? 15 : 3,
    ]);
}

/**
 * ダッシュボードの「AIに相談する」大きなボタン
 */
function lw_ai_chat_render_dashboard_button() {
    $avatar_url  = esc_url(LW_AI_CHAT_URL . 'img/neko-bot.svg');
    $use_own_key = lw_ai_chat_use_own_key();
    ?>
    <div id="lw-ai-chat-trigger-wrap">
        <button type="button" id="lw-ai-chat-trigger" class="lw-ai-chat-trigger-btn">
            <img src="<?php echo $avatar_url; ?>" alt="" class="lw-ai-chat-trigger-avatar">
            <span class="lw-ai-chat-trigger-text">
                <strong>AIに相談する</strong>
                <span><?php echo $use_own_key ? 'プライベートAI — 無制限' : 'LiteWordの使い方、なんでも聞いてね'; ?></span>
            </span>
            <span class="lw-ai-chat-trigger-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
        </button>
    </div>
    <?php
}

/**
 * フルスクリーンポップアップ + FAB（admin_footer で出力）
 */
add_action('admin_footer', 'lw_ai_chat_render_popup');
function lw_ai_chat_render_popup() {
    if (!is_admin()) return;

    $is_premium  = lw_ai_chat_is_premium();
    $has_own_key = lw_ai_chat_has_own_key();
    $use_own_key = lw_ai_chat_use_own_key();
    $avatar_url  = esc_url(LW_AI_CHAT_URL . 'img/neko-bot.svg');

    $status_label = 'フリープラン';
    if ($use_own_key) $status_label = 'プライベートAI';
    elseif ($is_premium) $status_label = 'Premium';
    ?>
    <div id="lw-ai-chat-overlay" class="<?php echo $use_own_key ? 'lw-ai-power-mode' : ''; ?>">
        <div class="lw-ai-chat-screen">

            <!-- 閉じるボタン -->
            <button type="button" id="lw-ai-chat-close" class="lw-ai-chat-close-btn" aria-label="閉じる">&times;</button>

            <!-- メインエリア（左: チャット、右: キャラクター） -->
            <div class="lw-ai-chat-main">

                <!-- 左カラム: チャット -->
                <div class="lw-ai-chat-left">

                    <!-- 同意画面 -->
                    <div class="lw-ai-chat-consent" id="lw-ai-chat-consent">
                        <div class="lw-ai-chat-consent-chat">
                            <div class="lw-ai-msg-row lw-ai-msg-row-ai">
                                <img src="<?php echo $avatar_url; ?>" alt="" class="lw-ai-msg-avatar">
                                <div class="lw-ai-msg lw-ai-msg-ai">
                                    はじめまして！<strong><?php
                                        $current_user = wp_get_current_user();
                                        echo esc_html($current_user->display_name ?: $current_user->user_login);
                                    ?></strong>さん！<br><br>
                                    僕は <strong>LiteWordのAIサポート</strong> だにゃ！<br>
                                    LiteWordの使い方で困ったことがあったら、なんでも聞いてにゃ！<br><br>
                                    質問に答えるために <strong>質問内容を lite-word.com に送信する</strong> 必要があるにゃ。
                                    個人情報は一切収集しないから安心してにゃ！
                                </div>
                            </div>
                        </div>
                        <div class="lw-ai-chat-consent-actions">
                            <button type="button" class="lw-ai-chat-consent-btn" id="lw-ai-chat-consent-agree">同意して使ってみる！</button>
                            <a href="#" id="lw-ai-chat-privacy-link" class="lw-ai-chat-consent-privacy">プライバシーポリシーを確認</a>
                        </div>
                    </div>

                    <!-- チャットエリア -->
                    <div class="lw-ai-chat-body" id="lw-ai-chat-body" style="display:none;">
                        <div class="lw-ai-chat-messages" id="lw-ai-chat-messages"></div>
                    </div>

                </div>

                <!-- 右カラム: キャラクター -->
                <div class="lw-ai-chat-right">
                    <p class="lw-ai-chat-right-label">何でも聞いてね</p>
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/functions/lw_ai_system/assets/img/setup/neko-happy.png'); ?>" alt="AIサポート" class="lw-ai-chat-right-avatar">
                    <p class="lw-ai-chat-right-status"><?php echo esc_html($status_label); ?></p>
                    <?php if (!$use_own_key) : ?>
                    <p class="lw-ai-chat-right-limit" id="lw-ai-chat-limit-text"></p>
                    <?php endif; ?>
                    <button type="button" id="lw-ai-chat-history-btn" class="lw-ai-chat-history-btn" onclick="lwAiChatShowHistory()">履歴を見る</button>
                    <?php if ($use_own_key) : ?>
                    <span class="lw-ai-chat-power-badge">パワーモード</span>
                    <div class="lw-ai-chat-usage-bar" id="lw-ai-chat-usage-bar">
                        <div class="lw-ai-chat-usage-text" id="lw-ai-chat-usage-text">使用量を読み込み中...</div>
                        <select id="lw-ai-chat-model-select" class="lw-ai-chat-model-select">
                            <?php $current_model = get_option('lw_ai_chat_ai_model', 'flash'); ?>
                            <option value="flash" <?php selected($current_model, 'flash'); ?>>Flash</option>
                            <option value="pro" <?php selected($current_model, 'pro'); ?>>Pro</option>
                        </select>
                    </div>
                    <?php endif; ?>
                </div>

            </div>

            <!-- 下部固定: 入力バー -->
            <div class="lw-ai-chat-input-bar">
                <div class="lw-ai-chat-input-wrap">
                    <textarea id="lw-ai-chat-input" class="lw-ai-chat-input" rows="2" placeholder="例: ロゴの変え方は？ヘッダーを消したい"></textarea>
                    <input type="text" name="website" class="lw-ai-chat-honeypot" tabindex="-1" autocomplete="off">
                    <button type="button" id="lw-ai-chat-voice" class="lw-ai-chat-voice-btn" aria-label="音声入力">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </button>
                    <button type="button" id="lw-ai-chat-send" class="lw-ai-chat-send-btn" aria-label="送信">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>

            <!-- モード切替バー -->
            <?php if ($is_premium) : ?>
            <?php if ($use_own_key) : ?>
            <?php /* モード戻しボタンなし */ ?>
            <?php else : ?>
            <div class="lw-ai-chat-mode-bar" id="lw-ai-chat-mode-bar">
                <button type="button" class="lw-ai-chat-mode-btn lw-ai-chat-mode-eco active" data-mode="server">
                    <span class="lw-ai-chat-mode-btn-inner">
                        <span class="lw-ai-chat-mode-btn-title">&#x1F33F; 省エネモード</span>
                        <span class="lw-ai-chat-mode-btn-desc">無料で使える</span>
                    </span>
                </button>
                <?php if ($has_own_key) : ?>
                <button type="button" class="lw-ai-chat-mode-btn lw-ai-chat-mode-power" data-mode="own">
                    <span class="lw-ai-chat-mode-btn-inner">
                        <span class="lw-ai-chat-mode-btn-title">&#x26A1; パワーモード <span class="lw-ai-chat-recommend">おススメ</span></span>
                        <span class="lw-ai-chat-mode-btn-tags">
                            <span class="lw-ai-chat-tag lw-ai-chat-tag-gold">&#x2728; 無制限</span>
                            <span class="lw-ai-chat-tag lw-ai-chat-tag-gold">&#x1F512; プライベート</span>
                        </span>
                    </span>
                </button>
                <?php else : ?>
                <button type="button" class="lw-ai-chat-mode-btn lw-ai-chat-mode-power lw-ai-chat-mode-btn-setup" id="lw-ai-chat-setup-guide">
                    <span class="lw-ai-chat-mode-btn-inner">
                        <span class="lw-ai-chat-mode-btn-title">&#x26A1; パワーモード <span class="lw-ai-chat-recommend">おススメ</span></span>
                        <span class="lw-ai-chat-mode-btn-tags">
                            <span class="lw-ai-chat-tag lw-ai-chat-tag-gold">&#x2728; 無制限</span>
                            <span class="lw-ai-chat-tag lw-ai-chat-tag-gold">&#x1F512; プライベート</span>
                        </span>
                        <span class="lw-ai-chat-mode-btn-desc">タップして設定（無料・2分）→</span>
                    </span>
                </button>
                <?php endif; ?>
            </div>
            <?php endif; ?>
            <?php endif; ?>

        </div>
    </div>

    <!-- ウェルカム画面（1日1回表示） -->
    <?php
    /**
     * お知らせ取得（lite-word.com の静的JSON + Cloudflareキャッシュ）
     *
     * ■ 仕組み:
     *   1. lite-word.com/api/announcement.json を6時間ごとに取得（transientキャッシュ）
     *   2. Cloudflareがキャッシュするのでサーバー負荷ほぼゼロ
     *   3. ユーザー側はlocalStorageにお知らせIDを記録 → 同じIDは二度と表示しない
     *   4. 新しいお知らせを出すには、JSONのidを変えるだけ
     *   5. お知らせを消すには、JSONを {} にするだけ
     *
     * ■ JSONフォーマット（lite-word.com/api/announcement.json）:
     *   {
     *     "id": "2026-03-18-page-builder",
     *     "message": "🎉 AIページビルダーがリリース！",
     *     "link": "https://lite-word.com/news/page-builder",
     *     "link_text": "詳しく見る →"
     *   }
     *   - id: 必須。変更すると新しいお知らせとして全ユーザーに表示
     *   - message: 必須。お知らせ本文（HTML可）
     *   - link: 任意。リンクURL
     *   - link_text: 任意。リンク文言（デフォルト「詳しく見る →」）
     *
     * ■ 管理方法:
     *   lite-word.com のドキュメントルート/api/announcement.json を編集するだけ
     *   Cloudflareキャッシュは自動更新（TTLに従う）or 手動パージ
     *
     * ■ ナレッジ:
     *   sl_management/knowledge/projects/liteword-data-integration/welcome-announcement.md
     */
    $announcement = null;
    $cached = get_transient('lw_ai_chat_announcement');
    if ($cached !== false) {
        $announcement = $cached;
    } else {
        $response = wp_remote_get('https://lite-word.com/api/announcement.json', [
            'timeout' => 5,
            'sslverify' => true,
        ]);
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
            if (is_array($data) && !empty($data['id']) && !empty($data['message'])) {
                $announcement = $data;
            }
        }
        // リモート取得失敗 → WPオプションをフォールバック
        if (!$announcement) {
            $fallback = get_option('lw_ai_chat_announcement', '');
            if ($fallback) {
                $data = json_decode($fallback, true);
                if (is_array($data) && !empty($data['id']) && !empty($data['message'])) {
                    $announcement = $data;
                }
            }
        }
        // 成功でも失敗でも6時間キャッシュ（失敗時はnull → リクエスト抑制）
        set_transient('lw_ai_chat_announcement', $announcement, 6 * HOUR_IN_SECONDS);
    }
    ?>
    <div id="lw-ai-chat-welcome" class="lw-ai-chat-welcome-overlay"
         <?php if ($announcement) : ?>data-announce-id="<?php echo esc_attr($announcement['id']); ?>"<?php endif; ?>>
        <div class="lw-ai-chat-welcome-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/functions/lw_ai_system/assets/img/setup/neko-happy.png'); ?>" alt="ねこアシスタント" class="lw-ai-chat-welcome-img">
            <div class="lw-ai-chat-welcome-text">
                <span class="lw-ai-chat-welcome-name"><?php
                    $current_user = wp_get_current_user();
                    echo esc_html($current_user->display_name ?: $current_user->user_login);
                ?></span>さん、おかえりなさい！
            </div>
            <div class="lw-ai-chat-welcome-sub">今日も頑張ろうにゃ！<br>分からないことがあったら、いつでも僕を呼び出してにゃ！</div>
            <?php if ($announcement && !empty($announcement['message'])) : ?>
            <div class="lw-ai-chat-welcome-announce" id="lw-ai-chat-announce">
                <div class="lw-ai-chat-welcome-announce-text"><?php echo wp_kses_post($announcement['message']); ?></div>
                <?php if (!empty($announcement['link'])) : ?>
                <a href="<?php echo esc_url($announcement['link']); ?>" class="lw-ai-chat-welcome-announce-link" target="_blank">
                    <?php echo esc_html($announcement['link_text'] ?? '詳しく見る →'); ?>
                </a>
                <?php endif; ?>
            </div>
            <?php endif; ?>
            <button type="button" class="lw-ai-chat-welcome-btn" id="lw-ai-chat-welcome-close">OK！</button>
        </div>
    </div>

    <?php
    // ダッシュボード以外の全管理画面ページにFABボタンを表示
    $screen = get_current_screen();
    if (!$screen || $screen->id !== 'dashboard') :
    ?>
    <button type="button" id="lw-ai-chat-trigger" class="lw-ai-chat-fab" title="AIに相談する">
        <img src="<?php echo $avatar_url; ?>" alt="" class="lw-ai-chat-fab-avatar">
    </button>
    <?php endif; ?>
    <?php
}
