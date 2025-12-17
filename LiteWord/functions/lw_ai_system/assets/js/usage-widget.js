/**
 * API使用量ウィジェット
 * ダッシュボード右下に固定表示
 */

(function() {
    'use strict';

    // 管理画面でのみ動作
    if (typeof lwAiUsageWidgetData === 'undefined') {
        return;
    }

    // プレミアムプランでない場合は表示しない
    if (!lwAiUsageWidgetData.isPremium) {
        return;
    }

    let isPopupOpen = false;
    let cachedStats = null;
    let lastFetch = 0;
    const CACHE_DURATION = 60000; // 1分間キャッシュ

    /**
     * ウィジェットを初期化
     */
    function init() {
        createWidget();
    }

    /**
     * ウィジェットを作成
     */
    function createWidget() {
        // 固定ボタン
        const button = document.createElement('button');
        button.id = 'lw-ai-usage-button';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
            </svg>
            <span class="lw-ai-usage-label">AI</span>
        `;
        button.title = 'AI使用量を確認';
        button.addEventListener('click', togglePopup);
        document.body.appendChild(button);

        // ポップアップ
        const popup = document.createElement('div');
        popup.id = 'lw-ai-usage-popup';
        popup.innerHTML = `
            <div class="lw-ai-popup-header">
                <h3>AI使用量</h3>
                <button class="lw-ai-popup-close" title="閉じる">&times;</button>
            </div>
            <div class="lw-ai-popup-content">
                <div class="lw-ai-loading">読み込み中...</div>
            </div>
        `;
        document.body.appendChild(popup);

        // 閉じるボタン
        popup.querySelector('.lw-ai-popup-close').addEventListener('click', closePopup);

        // ポップアップ外クリックで閉じる
        document.addEventListener('click', function(e) {
            if (isPopupOpen && !popup.contains(e.target) && e.target !== button && !button.contains(e.target)) {
                closePopup();
            }
        });
    }

    /**
     * ポップアップを開閉
     */
    function togglePopup() {
        if (isPopupOpen) {
            closePopup();
        } else {
            openPopup();
        }
    }

    /**
     * ポップアップを開く
     */
    function openPopup() {
        const popup = document.getElementById('lw-ai-usage-popup');
        popup.classList.add('open');
        isPopupOpen = true;
        fetchStats();
    }

    /**
     * ポップアップを閉じる
     */
    function closePopup() {
        const popup = document.getElementById('lw-ai-usage-popup');
        popup.classList.remove('open');
        isPopupOpen = false;
    }

    /**
     * 使用統計を取得
     */
    async function fetchStats() {
        const content = document.querySelector('#lw-ai-usage-popup .lw-ai-popup-content');

        // キャッシュがあれば使用
        if (cachedStats && (Date.now() - lastFetch) < CACHE_DURATION) {
            renderStats(cachedStats);
            return;
        }

        content.innerHTML = '<div class="lw-ai-loading">読み込み中...</div>';

        try {
            const response = await fetch(lwAiUsageWidgetData.restUrl + 'usage-stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': lwAiUsageWidgetData.restNonce
                }
            });

            const data = await response.json();

            if (data.success) {
                cachedStats = data.stats;
                lastFetch = Date.now();
                renderStats(data.stats);
            } else {
                content.innerHTML = '<div class="lw-ai-error">データの取得に失敗しました</div>';
            }
        } catch (err) {
            console.error('[LW AI Usage] Error:', err);
            content.innerHTML = '<div class="lw-ai-error">通信エラーが発生しました</div>';
        }
    }

    /**
     * 統計を描画
     */
    function renderStats(stats) {
        const content = document.querySelector('#lw-ai-usage-popup .lw-ai-popup-content');

        const today = stats.today || {};
        const month = stats.month || {};

        // 数値をフォーマット
        const formatNumber = (num) => {
            num = parseFloat(num) || 0;
            if (num >= 1000000) {
                return (num / 1000000).toFixed(2) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        };

        const formatCost = (usd, jpy) => {
            usd = parseFloat(usd) || 0;
            jpy = parseFloat(jpy) || 0;
            return `$${usd.toFixed(4)} (約${Math.round(jpy)}円)`;
        };

        content.innerHTML = `
            <div class="lw-ai-stats-section">
                <h4>今日</h4>
                <div class="lw-ai-stats-grid">
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${today.request_count || 0}</span>
                        <span class="lw-ai-stat-label">リクエスト</span>
                    </div>
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${today.total_images || 0}</span>
                        <span class="lw-ai-stat-label">画像生成</span>
                    </div>
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${formatNumber(today.total_input_tokens)}</span>
                        <span class="lw-ai-stat-label">入力トークン</span>
                    </div>
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${formatNumber(today.total_output_tokens)}</span>
                        <span class="lw-ai-stat-label">出力トークン</span>
                    </div>
                </div>
                <div class="lw-ai-cost">
                    <span class="lw-ai-cost-label">推定コスト:</span>
                    <span class="lw-ai-cost-value">${formatCost(today.total_cost_usd, today.total_cost_jpy)}</span>
                </div>
            </div>

            <div class="lw-ai-stats-section">
                <h4>今月</h4>
                <div class="lw-ai-stats-grid">
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${month.request_count || 0}</span>
                        <span class="lw-ai-stat-label">リクエスト</span>
                    </div>
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${month.total_images || 0}</span>
                        <span class="lw-ai-stat-label">画像生成</span>
                    </div>
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${formatNumber(month.total_input_tokens)}</span>
                        <span class="lw-ai-stat-label">入力トークン</span>
                    </div>
                    <div class="lw-ai-stat">
                        <span class="lw-ai-stat-value">${formatNumber(month.total_output_tokens)}</span>
                        <span class="lw-ai-stat-label">出力トークン</span>
                    </div>
                </div>
                <div class="lw-ai-cost lw-ai-cost-total">
                    <span class="lw-ai-cost-label">推定コスト:</span>
                    <span class="lw-ai-cost-value">${formatCost(month.total_cost_usd, month.total_cost_jpy)}</span>
                </div>
            </div>

            <div class="lw-ai-stats-notice">
                <p>※ 上記は推定値です。正確な使用量は<a href="https://aistudio.google.com/app/billing" target="_blank" rel="noopener noreferrer">Google AI Studio</a>でご確認ください。</p>
            </div>

            <div class="lw-ai-stats-footer">
                <small>最終更新: ${stats.last_update || '-'}</small>
                <button class="lw-ai-refresh-btn" title="更新">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6"/>
                        <path d="M1 20v-6h6"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                </button>
            </div>
        `;

        // 更新ボタン
        content.querySelector('.lw-ai-refresh-btn').addEventListener('click', function() {
            cachedStats = null;
            lastFetch = 0;
            fetchStats();
        });
    }

    // DOM準備完了で初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
