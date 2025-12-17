<div class="lw_loading_anime lw_loading_ptn_4">
    <div class="pulse-container">
        <div class="pulse-ring"></div>
        <div class="pulse-ring"></div>
        <div class="pulse-ring"></div>
    </div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_4 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease-out;
    }

    /* offクラスが付いたら非表示 */
    .lw_loading_ptn_4.off {
        opacity: 0;
        pointer-events: none;
    }

    /* パルスコンテナ */
    .lw_loading_ptn_4 .pulse-container {
        position: relative;
        width: 60px;
        height: 60px;
    }

    /* パルスリング */
    .lw_loading_ptn_4 .pulse-ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 3px solid var(--color-main, #3498db);
        border-radius: 50%;
        animation: pulse 2.5s ease-out infinite;
    }

    /* 各リングのアニメーション遅延 */
    .lw_loading_ptn_4 .pulse-ring:nth-child(1) {
        animation-delay: 0s;
    }

    .lw_loading_ptn_4 .pulse-ring:nth-child(2) {
        animation-delay: 0.8s;
    }

    .lw_loading_ptn_4 .pulse-ring:nth-child(3) {
        animation-delay: 1.6s;
    }

    /* パルスアニメーション */
    @keyframes pulse {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_4 .loading-text {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
        font-family: Arial, sans-serif;
    }
</style>