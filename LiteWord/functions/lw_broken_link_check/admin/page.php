<?php
/**
 * リンク一覧ページ — 表示だけを持つ。
 *
 * CSS  … admin/assets/link-list.css
 * JS   … admin/assets/link-list.js（PHP から渡す値は wp_localize_script の lwLinkList）
 * 登録 … admin/enqueue.php
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// データベース状態を取得
$has_data     = lw_link_list_has_data();
$last_updated = lw_link_list_get_last_updated();
$is_full      = ( 'full' === lw_link_list_get_scan_mode() );
?>

<div class="wrap lw-link-list-wrap">
    <h1>リンク一覧</h1>
    <p>サイト内の全ての&lt;a&gt;タグを調査し、投稿タイプ・ページ別にグループ分けして表示します。</p>


    <!-- コントロール -->
    <div class="lw-link-list-controls">
        <div class="lw-scan-modes">
            <button type="button" id="lw-start-crawl" class="button button-primary lw-scan-button">
                <span class="dashicons dashicons-admin-site-alt3"></span>
                <span class="lw-scan-button-labels">
                    <span class="lw-scan-button-title">ページを開いて全部調べる</span>
                    <span class="lw-scan-button-sub">ヘッダー・フッター・メニューも含む／数分かかります</span>
                </span>
            </button>

            <button type="button" id="lw-start-scan" class="button lw-scan-button" data-has-data="<?php echo $has_data ? '1' : '0'; ?>">
                <span class="dashicons dashicons-search"></span>
                <span class="lw-scan-button-labels">
                    <span class="lw-scan-button-title">本文だけ調べる</span>
                    <span class="lw-scan-button-sub">ヘッダー・フッターは含みません／数秒で終わります</span>
                </span>
            </button>

            <?php if ( $has_data && $last_updated ) : ?>
            <span id="lw-last-updated" class="lw-last-updated">
                最終更新: <?php echo esc_html( date_i18n( 'Y年n月j日 H:i', strtotime( $last_updated ) ) ); ?>
            </span>
            <?php endif; ?>
        </div>

        <p class="lw-scan-modes-help">
            迷ったら <strong>「ページを開いて全部調べる」</strong> を押してください。
            公開ページを実際に読みに行くので、<strong>訪問者に見えているリンクがそのまま出ます</strong>。<br>
            <strong>「本文だけ調べる」</strong> は、記事を直した直後に手早く見直したいときに使います。
            サイトの中だけで済ませるぶん速いかわりに、ヘッダー・フッター・メニューのリンクは出ません。
        </p>

        <!-- いまの一覧がどちらで採られたか（JS が埋める） -->
        <div id="lw-scan-mode-badge" class="lw-scan-mode-badge"></div>

        <!-- 読めなかったページ・上限で外したページ（JS が埋める） -->
        <div id="lw-crawl-notice" class="lw-crawl-notice"></div>

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
            <span class="lw-check-stat lw-check-stat-unverified" title="相手のサイトが自動での確認を断っています（403・429・503など）。リンクが切れているわけではなく、ブラウザでは開けることがほとんどです。">？ 確認できず: <strong id="lw-check-unverified">0</strong></span>
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
