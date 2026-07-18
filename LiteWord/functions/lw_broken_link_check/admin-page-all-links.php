<?php
/**
 * 全リンク一覧ページ
 *
 * @package LiteWord
 *
 * ========================================
 * 開発履歴
 * ========================================
 *
 * 【2024-12-20】
 * ■ 実装完了:
 *   - リンク一覧機能の基本実装（投稿タイプ・ページ別グループ表示）
 *   - データベーステーブル（wp_lw_link_list）によるリンク情報保存
 *   - 「リンクを調べる」ボタンで全ページのaタグをスキャン
 *   - 「リンク有効性をチェック」ボタンでHTTPステータスチェック（バッチ処理）
 *   - アンカーリンク（#で始まるリンク）をソースページURLと結合してチェック対象に含める
 *   - デバッグログをdebug.logに出力する仕組み
 *   - href="#" のみのリンクに警告マーク（▲）と「無効」バッジを表示
 *   - 無効なアンカー（##, # など）も警告対象に追加
 *   - アンカーリンクの存在チェック（ページ内のid属性をスキャン時に抽出・DB保存）
 *   - ID不在のアンカーリンクに ✗ マークと「ID不在」バッジを表示
 *   - 統計に「無効#」「ID不在」カウントを追加
 *   - リンク一覧画面で直接URL編集機能（インライン編集）
 *     - 各行に「編集」ボタン追加、クリックでテキスト入力表示
 *     - 「保存」ボタンで投稿のpost_contentを直接更新（wp_update_post）
 *     - DBリンク情報も自動更新、Enter/Escapeキー対応
 *
 * 【次回やること】
 *   1. リンク有効性チェック結果をデータベースに保存する
 *      - 現在はメモリ上のみで、ページリロードで消える
 *
 * ========================================
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<style>
.lw-link-list-wrap {
    max-width: 1600px;
}

.lw-link-list-controls {
    margin: 20px 0;
    padding: 20px;
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
}

.lw-link-list-controls .button-primary {
    font-size: 14px;
    padding: 8px 20px;
    height: auto;
}

.lw-link-list-loading {
    display: none;
    margin-top: 15px;
    padding: 20px;
    background: #f0f6fc;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    text-align: center;
}

.lw-link-list-loading .spinner {
    float: none;
    margin: 0 10px 0 0;
    vertical-align: middle;
}

.lw-link-list-loading-text {
    font-size: 14px;
    color: #333;
}

.lw-link-list-stats {
    display: none;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.lw-link-list-stat {
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
    padding: 10px 15px;
    text-align: center;
    min-width: 80px;
}

.lw-link-list-stat-number {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: #333;
}

.lw-link-list-stat-label {
    display: block;
    font-size: 11px;
    color: #666;
    margin-top: 3px;
}

.lw-link-type {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
}

.lw-link-empty { background: #f8d7da; color: #721c24; }
.lw-link-anchor { background: #e2e3e5; color: #383d41; }
.lw-link-internal { background: #d4edda; color: #155724; }
.lw-link-external { background: #cce5ff; color: #004085; }
.lw-link-relative { background: #d1ecf1; color: #0c5460; }
.lw-link-mailto { background: #fff3cd; color: #856404; }
.lw-link-tel { background: #d4edda; color: #155724; }
.lw-link-js { background: #f5c6cb; color: #721c24; }
.lw-link-other { background: #e9ecef; color: #6c757d; }

.lw-link-list-results {
    display: none;
}

/* タブナビゲーション */
.lw-link-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    margin-bottom: 0;
    border-bottom: 1px solid #ccd0d4;
    background: #f6f7f7;
    padding: 0 10px;
}

.lw-link-tab {
    padding: 12px 20px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #50575e;
    transition: all 0.2s;
    margin-bottom: -1px;
}

.lw-link-tab:hover {
    color: #2271b1;
    background: #fff;
}

.lw-link-tab.active {
    color: #2271b1;
    background: #fff;
    border-bottom-color: #2271b1;
}

.lw-link-tab-count {
    display: inline-block;
    background: #e0e0e0;
    color: #50575e;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    margin-left: 6px;
}

.lw-link-tab.active .lw-link-tab-count {
    background: #2271b1;
    color: #fff;
}

.lw-link-tab-content {
    display: none;
    background: #fff;
    border: 1px solid #ccd0d4;
    border-top: none;
    padding: 20px;
}

.lw-link-tab-content.active {
    display: block;
}

/* グループセクション */
.lw-link-group {
    margin-bottom: 30px;
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
}

.lw-link-group-header {
    padding: 15px 20px;
    background: #f6f7f7;
    border-bottom: 1px solid #ccd0d4;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lw-link-group-header:hover {
    background: #f0f0f1;
}

.lw-link-group-title {
    font-size: 15px;
    font-weight: 600;
    color: #1d2327;
    margin: 0;
}

.lw-link-group-count {
    font-size: 13px;
    color: #666;
    background: #e0e0e0;
    padding: 2px 10px;
    border-radius: 10px;
}

.lw-link-group-content {
    padding: 0;
}

.lw-link-group.collapsed .lw-link-group-content {
    display: none;
}

.lw-link-group-toggle {
    font-size: 18px;
    color: #666;
    transition: transform 0.2s;
}

.lw-link-group.collapsed .lw-link-group-toggle {
    transform: rotate(-90deg);
}

/* ページ単位のサブグループ */
.lw-link-page {
    border-bottom: 1px solid #e5e5e5;
}

.lw-link-page:last-child {
    border-bottom: none;
}

.lw-link-page-header {
    padding: 12px 20px;
    background: #fafafa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.lw-link-page-header:hover {
    background: #f5f5f5;
}

.lw-link-page-title {
    font-size: 13px;
    font-weight: 500;
    color: #2271b1;
}

.lw-link-page-title a {
    text-decoration: none;
}

.lw-link-page-title a:hover {
    text-decoration: underline;
}

.lw-link-page-count {
    font-size: 12px;
    color: #999;
}

.lw-link-page-links {
    padding: 0 20px 15px;
}

.lw-link-page.collapsed .lw-link-page-links {
    display: none;
}

/* リンクテーブル */
.lw-link-list-table {
    margin: 0;
    border: none;
    box-shadow: none;
}

.lw-link-list-table th,
.lw-link-list-table td {
    padding: 8px 10px;
}

.lw-link-list-table .column-href {
    width: 40%;
    word-break: break-all;
}

.lw-link-list-table .column-type {
    width: 10%;
}

.lw-link-list-table .column-text {
    width: 35%;
}

.lw-link-list-table .column-action {
    width: 15%;
    text-align: center;
}

.lw-href-value {
    font-family: monospace;
    font-size: 12px;
    color: #333;
    word-break: break-all;
}

.lw-href-value.empty {
    color: #dc3232;
    font-style: italic;
}

.lw-link-text {
    color: #666;
    font-size: 12px;
}

.lw-link-list-filters {
    margin: 15px 0;
    padding: 10px 15px;
    background: #f6f7f7;
    border: 1px solid #dcdcde;
    border-radius: 4px;
}

.lw-link-list-filters label {
    margin-right: 15px;
    cursor: pointer;
}

.lw-link-list-filters input[type="checkbox"] {
    margin-right: 5px;
}

.lw-link-list-search {
    margin: 15px 0;
}

.lw-link-list-search input[type="search"] {
    width: 300px;
    padding: 5px 10px;
}

.lw-no-links {
    padding: 20px;
    color: #666;
    font-style: italic;
}

/* リンクチェック関連 */
.lw-link-check-controls {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #dcdcde;
}

.lw-link-check-progress {
    display: none;
    margin-top: 15px;
    padding: 15px;
    background: #f0f6fc;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
}

.lw-progress-bar-container {
    background: #e0e0e0;
    border-radius: 4px;
    height: 24px;
    overflow: hidden;
    margin-bottom: 10px;
}

.lw-progress-bar {
    background: linear-gradient(90deg, #2271b1, #135e96);
    height: 100%;
    width: 0%;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
}

.lw-progress-text {
    text-align: center;
    color: #666;
    font-size: 13px;
}

.lw-check-results-summary {
    display: none;
    margin-top: 15px;
    padding: 15px;
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
}

.lw-check-results-summary h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
}

.lw-check-stat {
    display: inline-block;
    margin-right: 20px;
    font-size: 13px;
}

.lw-check-stat-ok { color: #46b450; }
.lw-check-stat-redirect { color: #ffb900; }
.lw-check-stat-error { color: #dc3232; }
.lw-check-stat-timeout { color: #826eb4; }
.lw-check-stat-skip { color: #999; }

/* ステータスバッジ */
.lw-link-status {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    margin-left: 8px;
}

.lw-status-ok { background: #d4edda; color: #155724; }
.lw-status-redirect { background: #fff3cd; color: #856404; }
.lw-status-not_found { background: #f8d7da; color: #721c24; }
.lw-status-client_error { background: #f8d7da; color: #721c24; }
.lw-status-server_error { background: #f8d7da; color: #721c24; }
.lw-status-timeout { background: #e2e3e5; color: #383d41; }
.lw-status-error { background: #f8d7da; color: #721c24; }
.lw-status-skip { background: #e9ecef; color: #6c757d; }
.lw-status-checking { background: #cce5ff; color: #004085; }

/* 警告マーク（href="#" のみのリンク用） */
.lw-link-warning {
    display: inline-block;
    color: #d63638;
    font-weight: bold;
    margin-left: 6px;
    cursor: help;
}

.lw-link-warning-badge {
    display: inline-block;
    background: #fcf0f1;
    border: 1px solid #d63638;
    color: #d63638;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    margin-left: 8px;
}

/* エラーマーク（アンカーID不在用） */
.lw-link-error {
    display: inline-block;
    color: #dc3232;
    font-weight: bold;
    margin-left: 6px;
    cursor: help;
}

.lw-link-error-badge {
    display: inline-block;
    background: #f8d7da;
    border: 1px solid #dc3232;
    color: #dc3232;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    margin-left: 8px;
}

/* インライン編集機能 */
.lw-edit-btn {
    padding: 2px 8px;
    font-size: 11px;
    margin-left: 8px;
    cursor: pointer;
    background: #f0f0f1;
    border: 1px solid #c3c4c7;
    border-radius: 3px;
    color: #2271b1;
}

.lw-edit-btn:hover {
    background: #e5e5e5;
    border-color: #999;
}

.lw-edit-form {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.lw-edit-input {
    flex: 1;
    min-width: 200px;
    padding: 4px 8px;
    font-family: monospace;
    font-size: 12px;
    border: 1px solid #2271b1;
    border-radius: 3px;
}

.lw-edit-input:focus {
    outline: none;
    border-color: #007cba;
    box-shadow: 0 0 0 1px #007cba;
}

.lw-save-btn {
    padding: 4px 12px;
    font-size: 12px;
    background: #2271b1;
    border: 1px solid #2271b1;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
}

.lw-save-btn:hover {
    background: #135e96;
    border-color: #135e96;
}

.lw-save-btn:disabled {
    background: #a0a5aa;
    border-color: #a0a5aa;
    cursor: not-allowed;
}

.lw-cancel-btn {
    padding: 4px 12px;
    font-size: 12px;
    background: #f0f0f1;
    border: 1px solid #c3c4c7;
    border-radius: 3px;
    color: #50575e;
    cursor: pointer;
}

.lw-cancel-btn:hover {
    background: #e5e5e5;
    border-color: #999;
}

.lw-edit-saving {
    color: #2271b1;
    font-size: 12px;
}

.lw-edit-success {
    color: #46b450;
    font-size: 12px;
}

.lw-edit-error {
    color: #dc3232;
    font-size: 12px;
}
</style>

<?php
// データベース状態を取得
$has_data = lw_link_list_has_data();
$last_updated = lw_link_list_get_last_updated();
?>

<!-- 開発履歴 -->
<div style="background: #f0f0f1; border-left: 4px solid #2271b1; padding: 12px 15px; margin: 20px 0; max-width: 800px;">
    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #1d2327;">開発履歴・TODO</h3>
    <p style="margin: 0 0 8px 0; font-size: 13px; color: #50575e;"><strong>【2024-12-20 実装完了】</strong></p>
    <ul style="margin: 0 0 12px 20px; padding: 0; font-size: 12px; color: #50575e;">
        <li>リンク一覧機能（投稿タイプ・ページ別グループ表示）</li>
        <li>データベース保存（wp_lw_link_list）</li>
        <li>リンク有効性チェック（HTTPステータス確認・バッチ処理）</li>
        <li>アンカーリンク対応（ソースページURL結合）</li>
        <li style="color: #46b450;"><strong>✓ 無効なアンカー（#のみ、##など）に警告マーク（▲）と「無効」バッジを表示</strong></li>
        <li style="color: #46b450;"><strong>✓ アンカーリンクの存在チェック（ページ内id属性をスキャン・DB保存）</strong></li>
        <li style="color: #46b450;"><strong>✓ ID不在のアンカーに ✗ マークと「ID不在」バッジを表示</strong></li>
        <li style="color: #46b450;"><strong>✓ 統計に「無効#」「ID不在」カウントを追加</strong></li>
        <li style="color: #46b450;"><strong>✓ リンク一覧画面で直接URL編集機能（インライン編集、Enter/Escape対応）</strong></li>
    </ul>
    <p style="margin: 0 0 8px 0; font-size: 13px; color: #d63638;"><strong>【次回やること】</strong></p>
    <ol style="margin: 0 0 0 20px; padding: 0; font-size: 12px; color: #50575e;">
        <li>リンク有効性チェック結果をデータベースに保存する（現在はメモリ上のみ）</li>
        <li>他のページの読込が遅くならないか確認・修正</li>
        <li>プレミアムプランユーザーのみ利用可能にする</li>
    </ol>
</div>

<div class="wrap lw-link-list-wrap">
    <h1>リンク一覧</h1>
    <p>サイト内の全ての&lt;a&gt;タグを調査し、投稿タイプ・ページ別にグループ分けして表示します。</p>


    <!-- コントロール -->
    <div class="lw-link-list-controls">
        <button type="button" id="lw-start-scan" class="button button-primary" data-has-data="<?php echo $has_data ? '1' : '0'; ?>">
            <span class="dashicons dashicons-search" style="vertical-align: middle; margin-right: 5px;"></span>
            <span class="lw-btn-text"><?php echo $has_data ? 'リンクを再生成' : 'リンクを調べる'; ?></span>
        </button>

        <?php if ($has_data && $last_updated): ?>
        <span id="lw-last-updated" class="lw-last-updated" style="margin-left: 15px; color: #666; font-size: 13px;">
            最終更新: <?php echo esc_html(date_i18n('Y年n月j日 H:i', strtotime($last_updated))); ?>
        </span>
        <?php endif; ?>

        <div id="lw-loading" class="lw-link-list-loading">
            <span class="spinner is-active"></span>
            <span class="lw-link-list-loading-text">リンクを調査中...</span>
        </div>

        <!-- リンク有効性チェック -->
        <div class="lw-link-check-controls" id="lw-check-controls" style="<?php echo $has_data ? '' : 'display:none;'; ?>">
            <button type="button" id="lw-start-check" class="button button-secondary">
                <span class="dashicons dashicons-yes-alt" style="vertical-align: middle; margin-right: 5px;"></span>
                <span class="lw-check-btn-text">リンク有効性をチェック</span>
            </button>
            <button type="button" id="lw-stop-check" class="button" style="display: none; margin-left: 10px;">
                <span class="dashicons dashicons-no" style="vertical-align: middle; margin-right: 5px;"></span>
                中止
            </button>
        </div>

        <!-- プログレスバー -->
        <div id="lw-check-progress" class="lw-link-check-progress">
            <div class="lw-progress-bar-container">
                <div class="lw-progress-bar" id="lw-progress-bar">0%</div>
            </div>
            <div class="lw-progress-text" id="lw-progress-text">準備中...</div>
        </div>

        <!-- チェック結果サマリー -->
        <div id="lw-check-results-summary" class="lw-check-results-summary">
            <h4>チェック結果</h4>
            <span class="lw-check-stat lw-check-stat-ok">✓ 有効: <strong id="lw-check-ok">0</strong></span>
            <span class="lw-check-stat lw-check-stat-redirect">⟳ リダイレクト: <strong id="lw-check-redirect">0</strong></span>
            <span class="lw-check-stat lw-check-stat-error">✗ リンク切れ: <strong id="lw-check-error">0</strong></span>
            <span class="lw-check-stat lw-check-stat-timeout">⏱ タイムアウト: <strong id="lw-check-timeout">0</strong></span>
            <span class="lw-check-stat lw-check-stat-skip">○ スキップ: <strong id="lw-check-skip">0</strong></span>
        </div>
    </div>

    <!-- 統計サマリー -->
    <div id="lw-stats" class="lw-link-list-stats"></div>

    <!-- 結果エリア -->
    <div id="lw-results" class="lw-link-list-results">
        <!-- フィルター -->
        <div class="lw-link-list-filters">
            <strong>フィルター:</strong>
            <label><input type="checkbox" class="lw-filter" value="empty" checked> 未設定</label>
            <label><input type="checkbox" class="lw-filter" value="anchor" checked> アンカー</label>
            <label><input type="checkbox" class="lw-filter" value="internal" checked> 内部</label>
            <label><input type="checkbox" class="lw-filter" value="external" checked> 外部</label>
            <label><input type="checkbox" class="lw-filter" value="relative" checked> 相対</label>
            <label><input type="checkbox" class="lw-filter" value="mailto" checked> メール</label>
            <label><input type="checkbox" class="lw-filter" value="tel" checked> 電話</label>
            <label><input type="checkbox" class="lw-filter" value="javascript" checked> JavaScript</label>
        </div>

        <!-- 検索 -->
        <div class="lw-link-list-search">
            <input type="search" id="lw-search" placeholder="URL / テキスト / ページ名で検索...">
        </div>

        <!-- タブナビゲーション -->
        <div id="lw-tabs" class="lw-link-tabs"></div>

        <!-- タブコンテンツ -->
        <div id="lw-tab-contents"></div>

        <p id="lw-count" style="margin-top: 10px; color: #666;"></p>
    </div>

</div>

<script>
jQuery(document).ready(function($) {
    var allLinks = [];
    var allPages = [];
    var groupedData = {};
    var homeUrl = '<?php echo esc_js(home_url()); ?>';
    var hasDataAttr = $('#lw-start-scan').attr('data-has-data');
    var hasData = hasDataAttr === '1';

    // 投稿タイプのラベル
    var postTypeLabels = <?php
        $labels = array();
        $post_types = get_post_types(array('public' => true), 'objects');
        foreach ($post_types as $slug => $obj) {
            $labels[$slug] = $obj->label;
        }
        echo json_encode($labels);
    ?>;

    // リンク種別を判定
    function getLinkType(href) {
        if (!href || href.trim() === '') return 'empty';
        if (/^#/.test(href)) return 'anchor';
        if (/^mailto:/i.test(href)) return 'mailto';
        if (/^tel:/i.test(href)) return 'tel';
        if (/^javascript:/i.test(href)) return 'javascript';
        if (/^https?:\/\//.test(href)) {
            return href.indexOf(homeUrl) !== -1 ? 'internal' : 'external';
        }
        if (/^\//.test(href)) return 'relative';
        return 'other';
    }

    // 種別ラベルを取得
    function getTypeLabel(type) {
        var labels = {
            'empty': '<span class="lw-link-type lw-link-empty">未設定</span>',
            'anchor': '<span class="lw-link-type lw-link-anchor">アンカー</span>',
            'internal': '<span class="lw-link-type lw-link-internal">内部</span>',
            'external': '<span class="lw-link-type lw-link-external">外部</span>',
            'relative': '<span class="lw-link-type lw-link-relative">相対</span>',
            'mailto': '<span class="lw-link-type lw-link-mailto">メール</span>',
            'tel': '<span class="lw-link-type lw-link-tel">電話</span>',
            'javascript': '<span class="lw-link-type lw-link-js">JavaScript</span>',
            'other': '<span class="lw-link-type lw-link-other">その他</span>'
        };
        return labels[type] || labels['other'];
    }

    // HTMLエスケープ
    function escapeHtml(text) {
        if (!text) return '';
        return $('<div>').text(text).html();
    }

    // フィルター条件を取得
    function getActiveFilters() {
        var filters = [];
        $('.lw-filter:checked').each(function() {
            filters.push($(this).val());
        });
        return filters;
    }

    // 検索クエリを取得
    function getSearchQuery() {
        return $('#lw-search').val().toLowerCase();
    }

    // リンクがフィルター条件に合うかチェック
    function matchesFilter(link, activeFilters, searchQuery) {
        var type = getLinkType(link.href);

        // 種別フィルター
        if (activeFilters.indexOf(type) === -1) return false;

        // 検索
        if (searchQuery) {
            var searchTarget = (link.href + ' ' + link.text + ' ' + link.source_title).toLowerCase();
            if (searchTarget.indexOf(searchQuery) === -1) return false;
        }

        return true;
    }

    // 全ページ情報を使ってグループ化されたデータを構築
    function buildGroupedData() {
        groupedData = {};

        // まず全ページで初期化（リンクがないページも含む）
        allPages.forEach(function(page) {
            var postType = page.post_type || 'unknown';
            var postId = page.post_id;

            if (!groupedData[postType]) {
                groupedData[postType] = {
                    label: postTypeLabels[postType] || postType,
                    pages: {}
                };
            }

            groupedData[postType].pages[postId] = {
                title: page.post_title,
                edit_link: page.edit_link,
                link_count: page.link_count || 0,
                links: [],
                ids: page.ids || []
            };
        });

        // リンク情報を追加
        allLinks.forEach(function(link) {
            if (link.source_type !== 'post') return;

            var postType = link.post_type || 'unknown';
            var postId = link.source_id;

            if (groupedData[postType] && groupedData[postType].pages[postId]) {
                groupedData[postType].pages[postId].links.push(link);
            }
        });
    }

    // 現在のアクティブタブ
    var activeTab = null;

    // タブを描画
    function renderTabs() {
        var $tabsContainer = $('#lw-tabs');
        var $contentsContainer = $('#lw-tab-contents');

        $tabsContainer.empty();
        $contentsContainer.empty();

        // 投稿タイプの表示順序（固定ページ、投稿、その他カスタム投稿）
        var typeOrder = ['page', 'post'];
        var otherTypes = Object.keys(groupedData).filter(function(t) {
            return typeOrder.indexOf(t) === -1;
        }).sort(function(a, b) {
            var labelA = postTypeLabels[a] || a;
            var labelB = postTypeLabels[b] || b;
            return labelA.localeCompare(labelB, 'ja');
        });
        var orderedTypes = typeOrder.concat(otherTypes);

        // 有効なタブのみをフィルタリング
        var validTypes = orderedTypes.filter(function(postType) {
            return groupedData[postType] && Object.keys(groupedData[postType].pages).length > 0;
        });

        if (validTypes.length === 0) {
            $tabsContainer.html('<p style="padding: 15px; color: #666;">データがありません。</p>');
            return;
        }

        // アクティブタブが無効になった場合、最初のタブをアクティブに
        if (!activeTab || validTypes.indexOf(activeTab) === -1) {
            activeTab = validTypes[0];
        }

        // タブを生成
        validTypes.forEach(function(postType) {
            var group = groupedData[postType];
            var pageCount = Object.keys(group.pages).length;
            var linkCount = 0;

            Object.keys(group.pages).forEach(function(pageId) {
                linkCount += group.pages[pageId].links.length;
            });

            var isActive = postType === activeTab;
            var tabHtml = '<button type="button" class="lw-link-tab' + (isActive ? ' active' : '') + '" data-post-type="' + postType + '">' +
                escapeHtml(group.label) +
                '<span class="lw-link-tab-count">' + linkCount + '</span>' +
                '</button>';
            $tabsContainer.append(tabHtml);

            // タブコンテンツを生成
            var contentHtml = '<div class="lw-link-tab-content' + (isActive ? ' active' : '') + '" data-post-type="' + postType + '">' +
                '<div class="lw-tab-pages"></div>' +
                '</div>';
            $contentsContainer.append(contentHtml);
        });

        // アクティブタブのコンテンツを描画
        renderTabContent(activeTab);
    }

    // 特定のタブのコンテンツを描画
    function renderTabContent(postType) {
        var $content = $('.lw-link-tab-content[data-post-type="' + postType + '"]');
        var $pagesContainer = $content.find('.lw-tab-pages');
        var activeFilters = getActiveFilters();
        var searchQuery = getSearchQuery();
        var totalVisible = 0;

        $pagesContainer.empty();

        if (!groupedData[postType]) return;

        var group = groupedData[postType];
        var pagesHtml = '';

        // ページIDでソート（タイトル順にソート）
        var pageIdList = Object.keys(group.pages).sort(function(a, b) {
            return group.pages[a].title.localeCompare(group.pages[b].title, 'ja');
        });

        pageIdList.forEach(function(pageId) {
            var page = group.pages[pageId];
            var pageTitle = page.edit_link ?
                '<a href="' + page.edit_link + '" target="_blank">' + escapeHtml(page.title) + '</a>' :
                escapeHtml(page.title);

            // ページが検索に一致するかチェック
            if (searchQuery) {
                var pageSearchTarget = page.title.toLowerCase();
                var linksMatchSearch = page.links.some(function(link) {
                    return (link.href + ' ' + link.text).toLowerCase().indexOf(searchQuery) !== -1;
                });
                if (pageSearchTarget.indexOf(searchQuery) === -1 && !linksMatchSearch) {
                    return; // このページはスキップ
                }
            }

            // リンクがないページ
            if (page.links.length === 0) {
                pagesHtml += '<div class="lw-link-page lw-no-links-page" data-page-id="' + pageId + '">' +
                    '<div class="lw-link-page-header">' +
                    '<span class="lw-link-page-title">' + pageTitle + '</span>' +
                    '<span class="lw-link-page-count" style="color: #999; font-style: italic;">リンク設定なし</span>' +
                    '</div>' +
                    '</div>';
            } else {
                // リンクがあるページ
                var linksHtml = '';
                var pageLinkCount = 0;

                page.links.forEach(function(link) {
                    if (!matchesFilter(link, activeFilters, searchQuery)) return;

                    pageLinkCount++;
                    totalVisible++;

                    var type = getLinkType(link.href);
                    var hrefDisplay = link.href ?
                        '<span class="lw-href-value">' + escapeHtml(link.href) + '</span>' :
                        '<span class="lw-href-value empty">(空 - href未設定)</span>';

                    // アンカーリンクのチェック
                    var warningMark = '';
                    if (link.href && /^#/.test(link.href)) {
                        // #を全て除去して、残りをtrimし、空なら警告
                        var anchorId = link.href.replace(/^#+/, '').trim();
                        if (anchorId === '' || /^\s*$/.test(anchorId) || /^#/.test(anchorId)) {
                            // 無効なアンカー（#のみ、##など）
                            warningMark = '<span class="lw-link-warning" title="有効なアンカーID（#の後の文字列）が設定されていません。正しいリンク先を設定してください。">▲</span>' +
                                '<span class="lw-link-warning-badge">無効</span>';
                        } else {
                            // 有効なアンカーIDがあるので、ページ内にそのidが存在するかチェック
                            var pageIdsList = page.ids || [];
                            if (pageIdsList.indexOf(anchorId) === -1) {
                                // ページ内にidが存在しない
                                warningMark = '<span class="lw-link-error" title="アンカー先のid=&quot;' + escapeHtml(anchorId) + '&quot; がこのページ内に存在しません。">✗</span>' +
                                    '<span class="lw-link-error-badge">ID不在</span>';
                            }
                        }
                    }

                    var textDisplay = link.text ?
                        escapeHtml(link.text) :
                        '<em style="color:#999;">(テキストなし)</em>';

                    // 編集ボタン用のデータ属性（link_indexを追加）
                    var linkIndex = link.link_index !== undefined ? link.link_index : 0;
                    var dataAttrs = 'data-post-id="' + pageId + '" ' +
                        'data-href="' + escapeHtml(link.href || '') + '" ' +
                        'data-text="' + escapeHtml(link.text || '') + '" ' +
                        'data-link-index="' + linkIndex + '"';

                    linksHtml += '<tr class="lw-link-row" ' + dataAttrs + '>' +
                        '<td class="column-href"><span class="lw-href-display">' + hrefDisplay + warningMark + '</span></td>' +
                        '<td class="column-type">' + getTypeLabel(type) + '</td>' +
                        '<td class="column-text"><span class="lw-link-text">' + textDisplay + '</span></td>' +
                        '<td class="column-action"><button type="button" class="lw-edit-btn">編集</button></td>' +
                        '</tr>';
                });

                if (pageLinkCount > 0 || !searchQuery) {
                    pagesHtml += '<div class="lw-link-page" data-page-id="' + pageId + '">' +
                        '<div class="lw-link-page-header">' +
                        '<span class="lw-link-page-title">' + pageTitle + '</span>' +
                        '<span class="lw-link-page-count">' + pageLinkCount + ' 件</span>' +
                        '</div>' +
                        '<div class="lw-link-page-links">' +
                        (pageLinkCount > 0 ?
                            '<table class="wp-list-table widefat fixed striped lw-link-list-table">' +
                            '<thead><tr>' +
                            '<th class="column-href">href属性値</th>' +
                            '<th class="column-type">種別</th>' +
                            '<th class="column-text">リンクテキスト</th>' +
                            '<th class="column-action">操作</th>' +
                            '</tr></thead>' +
                            '<tbody>' + linksHtml + '</tbody>' +
                            '</table>' :
                            '<p style="color: #999; font-style: italic; margin: 10px 0;">フィルター条件に一致するリンクがありません</p>'
                        ) +
                        '</div>' +
                        '</div>';
                }
            }
        });

        if (pagesHtml) {
            $pagesContainer.html(pagesHtml);
        } else {
            $pagesContainer.html('<div class="lw-no-links">該当するページがありません。</div>');
        }

        // 合計を更新（現在のタブのみ）
        updateTabCount();
    }

    // タブの件数表示を更新（全タブのカウントバッジと合計表示を更新）
    function updateTabCount() {
        var activeFilters = getActiveFilters();
        var searchQuery = getSearchQuery();
        var totalVisible = 0;

        // 各タブの件数を更新
        $('.lw-link-tab').each(function() {
            var $tab = $(this);
            var postType = $tab.data('post-type');
            var tabLinkCount = 0;

            if (groupedData[postType]) {
                Object.keys(groupedData[postType].pages).forEach(function(pageId) {
                    var page = groupedData[postType].pages[pageId];
                    page.links.forEach(function(link) {
                        if (matchesFilter(link, activeFilters, searchQuery)) {
                            tabLinkCount++;
                        }
                    });
                });
            }

            $tab.find('.lw-link-tab-count').text(tabLinkCount);

            if (postType === activeTab) {
                totalVisible = tabLinkCount;
            }
        });

        $('#lw-count').text('表示: ' + totalVisible + ' リンク / 全 ' + allLinks.length + ' リンク');
    }

    // グループを描画（タブ形式）
    function renderGroups() {
        renderTabs();

        // 結果エリアを表示
        $('#lw-results').show();
    }

    // タブクリックイベント
    $(document).on('click', '.lw-link-tab', function() {
        var $tab = $(this);
        var postType = $tab.data('post-type');

        if (postType === activeTab) return;

        // タブの切り替え
        $('.lw-link-tab').removeClass('active');
        $tab.addClass('active');

        $('.lw-link-tab-content').removeClass('active');
        $('.lw-link-tab-content[data-post-type="' + postType + '"]').addClass('active');

        activeTab = postType;

        // コンテンツを描画
        renderTabContent(postType);
    })

    // 統計を表示（buildGroupedData後に呼ぶこと）
    function renderStats() {
        var stats = {
            total: allLinks.length,
            pages: allPages.length,
            empty: 0, anchor: 0, internal: 0, external: 0,
            relative: 0, mailto: 0, tel: 0, javascript: 0,
            hashOnly: 0,  // 無効なアンカーリンク数（#のみ、##など）
            idMissing: 0  // ID不在のアンカーリンク数
        };

        // ページIDからidsを取得するマップを作成
        var pageIdsMap = {};
        allPages.forEach(function(page) {
            pageIdsMap[page.post_id] = page.ids || [];
        });

        allLinks.forEach(function(link) {
            var type = getLinkType(link.href);
            if (stats[type] !== undefined) stats[type]++;

            // アンカーリンクのチェック
            if (link.href && /^#/.test(link.href)) {
                var anchorId = link.href.replace(/^#+/, '').trim();
                if (anchorId === '' || /^\s*$/.test(anchorId) || /^#/.test(anchorId)) {
                    // 無効なアンカー（#のみ、##など）
                    stats.hashOnly++;
                } else {
                    // 有効なアンカーIDがあるので、ページ内にそのidが存在するかチェック
                    var pageIds = pageIdsMap[link.source_id] || [];
                    if (pageIds.indexOf(anchorId) === -1) {
                        stats.idMissing++;
                    }
                }
            }
        });

        var html = '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number">' + stats.pages + '</span><span class="lw-link-list-stat-label">総ページ数</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number">' + stats.total + '</span><span class="lw-link-list-stat-label">総リンク数</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#dc3232;">' + stats.empty + '</span><span class="lw-link-list-stat-label">未設定</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#d63638;">' + stats.hashOnly + '</span><span class="lw-link-list-stat-label">▲ 無効#</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#dc3232;">' + stats.idMissing + '</span><span class="lw-link-list-stat-label">✗ ID不在</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#666;">' + stats.anchor + '</span><span class="lw-link-list-stat-label">アンカー</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#46b450;">' + stats.internal + '</span><span class="lw-link-list-stat-label">内部</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#0073aa;">' + stats.external + '</span><span class="lw-link-list-stat-label">外部</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#17a2b8;">' + stats.relative + '</span><span class="lw-link-list-stat-label">相対</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#856404;">' + stats.mailto + '</span><span class="lw-link-list-stat-label">メール</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#28a745;">' + stats.tel + '</span><span class="lw-link-list-stat-label">電話</span></div>';

        $('#lw-stats').html(html).css('display', 'flex');
    }

    // DBからデータを読み込んで表示
    function loadFromDatabase() {
        $('#lw-loading').show();
        $('#lw-loading .lw-link-list-loading-text').text('データを読み込み中...');

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lw_link_list_load'
            },
            success: function(response) {
                if (response.success) {
                    allLinks = response.data.links || [];
                    allPages = response.data.pages || [];
                    buildGroupedData();
                    renderStats();
                    renderGroups();
                    $('#lw-results').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
            },
            complete: function() {
                $('#lw-loading').hide();
                $('#lw-loading .lw-link-list-loading-text').text('リンクを調査中...');
            }
        });
    }

    // ページ読み込み時にDBにデータがあれば自動表示
    if (hasData) {
        loadFromDatabase();
    }

    // スキャン開始（新規/再生成）
    $('#lw-start-scan').on('click', function() {
        var $btn = $(this);
        $btn.prop('disabled', true);
        $('#lw-loading').show();
        $('#lw-loading .lw-link-list-loading-text').text('リンクを調査中...');
        $('#lw-results').hide();
        $('#lw-stats').hide();

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lw_link_list_scan'
            },
            success: function(response) {
                if (response.success) {
                    allLinks = response.data.links || [];
                    allPages = response.data.pages || [];
                    buildGroupedData();
                    renderStats();
                    renderGroups();
                    $('#lw-results').show();

                    // ボタンテキストを「再生成」に変更
                    $btn.find('.lw-btn-text').text('リンクを再生成');
                    $btn.data('has-data', 1);

                    // チェックボタンを表示
                    $('#lw-check-controls').show();

                    // チェック結果をリセット
                    checkResults = {};
                    $('#lw-check-progress').hide();
                    $('#lw-check-results-summary').hide();

                    // 最終更新日時を更新
                    var now = new Date();
                    var dateStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' +
                        ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
                    if ($('#lw-last-updated').length) {
                        $('#lw-last-updated').text('最終更新: ' + dateStr);
                    } else {
                        $btn.after('<span id="lw-last-updated" class="lw-last-updated" style="margin-left: 15px; color: #666; font-size: 13px;">最終更新: ' + dateStr + '</span>');
                    }
                } else {
                    alert('エラー: ' + (response.data.message || '不明なエラー'));
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                alert('通信エラーが発生しました。');
            },
            complete: function() {
                $btn.prop('disabled', false);
                $('#lw-loading').hide();
            }
        });
    });

    // グループの開閉
    $(document).on('click', '.lw-link-group-header', function() {
        $(this).closest('.lw-link-group').toggleClass('collapsed');
    });

    // ページの開閉
    $(document).on('click', '.lw-link-page-header', function(e) {
        if ($(e.target).is('a')) return; // リンククリックは除外
        $(this).closest('.lw-link-page').toggleClass('collapsed');
    });

    // フィルター変更（現在のタブのみ再描画）
    $('.lw-filter').on('change', function() {
        if (activeTab) {
            renderTabContent(activeTab);
        }
    });

    // 検索（現在のタブのみ再描画）
    var searchTimer;
    $('#lw-search').on('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            if (activeTab) {
                renderTabContent(activeTab);
            }
        }, 300);
    });

    // ========================================
    // リンク有効性チェック機能
    // ========================================

    var checkResults = {};  // URL => 結果
    var isChecking = false;
    var checkAborted = false;
    var batchSize = 20;

    // ステータスラベルを取得
    function getStatusLabel(status, statusCode) {
        var labels = {
            'ok': '有効',
            'redirect': 'リダイレクト',
            'not_found': 'リンク切れ',
            'client_error': 'エラー',
            'server_error': 'サーバーエラー',
            'timeout': 'タイムアウト',
            'error': '接続エラー',
            'skip': 'スキップ',
        };
        var label = labels[status] || status;
        if (statusCode) {
            label += ' (' + statusCode + ')';
        }
        return label;
    }

    // ステータスバッジHTMLを生成
    function getStatusBadge(status, statusCode) {
        var label = getStatusLabel(status, statusCode);
        return '<span class="lw-link-status lw-status-' + status + '">' + label + '</span>';
    }

    // プログレス更新
    function updateProgress(checked, total) {
        var percent = total > 0 ? Math.round((checked / total) * 100) : 0;
        $('#lw-progress-bar').css('width', percent + '%').text(percent + '%');
        $('#lw-progress-text').text('チェック中: ' + checked + ' / ' + total + ' URL');
    }

    // 結果サマリー更新
    function updateResultsSummary() {
        var stats = { ok: 0, redirect: 0, error: 0, timeout: 0, skip: 0 };

        for (var url in checkResults) {
            var result = checkResults[url];
            if (result.status === 'ok') {
                stats.ok++;
            } else if (result.status === 'redirect') {
                stats.redirect++;
            } else if (result.status === 'not_found' || result.status === 'client_error' || result.status === 'server_error' || result.status === 'error') {
                stats.error++;
            } else if (result.status === 'timeout') {
                stats.timeout++;
            } else if (result.status === 'skip') {
                stats.skip++;
            }
        }

        $('#lw-check-ok').text(stats.ok);
        $('#lw-check-redirect').text(stats.redirect);
        $('#lw-check-error').text(stats.error);
        $('#lw-check-timeout').text(stats.timeout);
        $('#lw-check-skip').text(stats.skip);
    }

    // テーブル内のリンクにステータスを表示
    function updateLinkStatusInTable() {
        $('.lw-href-value').each(function() {
            var $href = $(this);
            var url = $href.text();

            // 既存のステータスバッジを削除
            $href.siblings('.lw-link-status').remove();

            if (checkResults[url]) {
                var result = checkResults[url];
                $href.after(getStatusBadge(result.status, result.status_code));
            }
        });
    }

    // バッチチェック実行
    function runBatchCheck(urls, index, total) {
        if (checkAborted || index >= urls.length) {
            // 完了
            isChecking = false;
            $('#lw-start-check').prop('disabled', false).find('.lw-check-btn-text').text('リンク有効性をチェック');
            $('#lw-stop-check').hide();
            $('#lw-progress-text').text(checkAborted ? 'チェックを中止しました' : 'チェック完了!');
            updateResultsSummary();
            updateLinkStatusInTable();
            return;
        }

        // バッチ取得
        var batch = urls.slice(index, index + batchSize);

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lw_link_list_check_batch',
                urls: batch
            },
            success: function(response) {
                if (response.success && response.data.results) {
                    // 結果を保存
                    response.data.results.forEach(function(result) {
                        checkResults[result.url] = result;
                    });

                    // プログレス更新
                    var checked = Math.min(index + batchSize, urls.length);
                    updateProgress(checked, total);
                    updateResultsSummary();

                    // リアルタイムでテーブル更新
                    updateLinkStatusInTable();

                    // 次のバッチ
                    runBatchCheck(urls, index + batchSize, total);
                } else {
                    // エラーでも次のバッチへ
                    runBatchCheck(urls, index + batchSize, total);
                }
            },
            error: function(xhr, status, error) {
                // エラーでも次のバッチへ
                runBatchCheck(urls, index + batchSize, total);
            }
        });
    }

    // チェック開始
    $('#lw-start-check').on('click', function() {
        if (isChecking) return;

        var $btn = $(this);
        $btn.prop('disabled', true).find('.lw-check-btn-text').text('準備中...');

        // チェック対象URLを取得
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lw_link_list_get_checkable_urls'
            },
            success: function(response) {
                if (response.success && response.data.urls && response.data.urls.length > 0) {
                    var urls = response.data.urls;

                    // 初期化
                    checkResults = {};
                    isChecking = true;
                    checkAborted = false;

                    // UI更新
                    $btn.find('.lw-check-btn-text').text('チェック中...');
                    $('#lw-stop-check').show();
                    $('#lw-check-progress').show();
                    $('#lw-check-results-summary').show();
                    updateProgress(0, urls.length);

                    // 結果サマリーリセット
                    $('#lw-check-ok, #lw-check-redirect, #lw-check-error, #lw-check-timeout, #lw-check-skip').text('0');

                    // バッチチェック開始
                    runBatchCheck(urls, 0, urls.length);
                } else {
                    var debugMsg = '';
                    if (response.data && response.data.debug) {
                        debugMsg = '\n\nデバッグ情報:\n' +
                            'DB内リンク数: ' + response.data.debug.links_count + '\n' +
                            'ページ数: ' + response.data.debug.pages_count + '\n' +
                            'チェック可能URL数: ' + response.data.debug.checkable_count + '\n' +
                            'スキップ数: ' + response.data.debug.skipped_count;
                    }
                    alert('チェック対象のURLがありません。先に「リンクを調べる」を実行してください。' + debugMsg);
                    $btn.prop('disabled', false).find('.lw-check-btn-text').text('リンク有効性をチェック');
                }
            },
            error: function(xhr, status, error) {
                alert('通信エラーが発生しました。');
                $btn.prop('disabled', false).find('.lw-check-btn-text').text('リンク有効性をチェック');
            }
        });
    });

    // チェック中止
    $('#lw-stop-check').on('click', function() {
        checkAborted = true;
        $(this).prop('disabled', true).text('中止中...');
    });

    // ========================================
    // インライン編集機能
    // ========================================

    // 編集ボタンクリック
    $(document).on('click', '.lw-edit-btn', function(e) {
        e.stopPropagation();

        var $row = $(this).closest('.lw-link-row');
        var $hrefCell = $row.find('.column-href');
        var $actionCell = $row.find('.column-action');

        // 既に編集中の行があればキャンセル
        $('.lw-link-row.editing').each(function() {
            cancelEdit($(this));
        });

        // 現在の値を取得
        var currentHref = $row.data('href') || '';

        // 編集モードに切り替え
        $row.addClass('editing');

        // href表示を入力フォームに置換
        var $display = $hrefCell.find('.lw-href-display');
        $display.hide();

        var formHtml = '<div class="lw-edit-form">' +
            '<input type="text" class="lw-edit-input" value="' + escapeHtml(currentHref) + '" placeholder="URLを入力">' +
            '</div>';
        $hrefCell.append(formHtml);

        // 操作ボタンを保存/キャンセルに置換
        $actionCell.html(
            '<button type="button" class="lw-save-btn">保存</button> ' +
            '<button type="button" class="lw-cancel-btn">取消</button>'
        );

        // 入力欄にフォーカス
        $hrefCell.find('.lw-edit-input').focus().select();
    });

    // 編集キャンセル
    function cancelEdit($row) {
        $row.removeClass('editing');
        $row.find('.lw-edit-form').remove();
        $row.find('.lw-href-display').show();
        $row.find('.column-action').html('<button type="button" class="lw-edit-btn">編集</button>');
    }

    // キャンセルボタンクリック
    $(document).on('click', '.lw-cancel-btn', function(e) {
        e.stopPropagation();
        var $row = $(this).closest('.lw-link-row');
        cancelEdit($row);
    });

    // 保存ボタンクリック
    $(document).on('click', '.lw-save-btn', function(e) {
        e.stopPropagation();

        var $btn = $(this);
        var $row = $btn.closest('.lw-link-row');
        var $actionCell = $row.find('.column-action');
        var $input = $row.find('.lw-edit-input');

        var postId = $row.data('post-id');
        var oldHref = $row.data('href') || '';
        var newHref = $input.val();
        var linkText = $row.data('text') || '';
        var linkIndex = $row.data('link-index') || 0;

        // 変更がない場合
        if (oldHref === newHref) {
            cancelEdit($row);
            return;
        }

        // 保存中の表示
        $btn.prop('disabled', true);
        $actionCell.find('.lw-cancel-btn').prop('disabled', true);
        $actionCell.append('<span class="lw-edit-saving"> 保存中...</span>');

        // AJAX送信
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lw_link_list_update_href',
                post_id: postId,
                old_href: oldHref,
                new_href: newHref,
                link_text: linkText,
                link_index: linkIndex
            },
            success: function(response) {
                if (response.success) {
                    // 成功 - 表示を更新
                    $row.data('href', newHref);

                    // href表示を更新
                    var newHrefDisplay = newHref ?
                        '<span class="lw-href-value">' + escapeHtml(newHref) + '</span>' :
                        '<span class="lw-href-value empty">(空 - href未設定)</span>';

                    // 警告マークを再計算
                    var warningMark = '';
                    if (newHref && /^#/.test(newHref)) {
                        var anchorId = newHref.replace(/^#+/, '').trim();
                        if (anchorId === '' || /^\s*$/.test(anchorId) || /^#/.test(anchorId)) {
                            warningMark = '<span class="lw-link-warning" title="有効なアンカーID（#の後の文字列）が設定されていません。">▲</span>' +
                                '<span class="lw-link-warning-badge">無効</span>';
                        }
                    }

                    $row.find('.lw-href-display').html(newHrefDisplay + warningMark);

                    // 種別を更新
                    var newType = getLinkType(newHref);
                    $row.find('.column-type').html(getTypeLabel(newType));

                    // 編集モード終了
                    cancelEdit($row);

                    // 成功メッセージ（一時表示）
                    $row.find('.column-action').append('<span class="lw-edit-success"> ✓</span>');
                    setTimeout(function() {
                        $row.find('.lw-edit-success').fadeOut(function() {
                            $(this).remove();
                        });
                    }, 2000);

                    // メモリ上のallLinksも更新
                    allLinks.forEach(function(link) {
                        if (link.source_id == postId && link.href === oldHref && link.text === linkText) {
                            link.href = newHref;
                        }
                    });

                } else {
                    // エラー
                    $actionCell.find('.lw-edit-saving').remove();
                    $actionCell.append('<span class="lw-edit-error"> ' + (response.data.message || 'エラー') + '</span>');
                    $btn.prop('disabled', false);
                    $actionCell.find('.lw-cancel-btn').prop('disabled', false);

                    setTimeout(function() {
                        $actionCell.find('.lw-edit-error').fadeOut(function() {
                            $(this).remove();
                        });
                    }, 3000);
                }
            },
            error: function(xhr, status, error) {
                $actionCell.find('.lw-edit-saving').remove();
                $actionCell.append('<span class="lw-edit-error"> 通信エラー</span>');
                $btn.prop('disabled', false);
                $actionCell.find('.lw-cancel-btn').prop('disabled', false);

                setTimeout(function() {
                    $actionCell.find('.lw-edit-error').fadeOut(function() {
                        $(this).remove();
                    });
                }, 3000);
            }
        });
    });

    // Enterキーで保存、Escapeキーでキャンセル
    $(document).on('keydown', '.lw-edit-input', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $(this).closest('.lw-link-row').find('.lw-save-btn').click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            var $row = $(this).closest('.lw-link-row');
            cancelEdit($row);
        }
    });
});
</script>
