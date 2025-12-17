<div class="lw_loading_anime lw_loading_ptn_3">
    <div class="dots-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_3 {
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
    .lw_loading_ptn_3.off {
        opacity: 0;
        pointer-events: none;
    }

    /* ドットコンテナ */
    .lw_loading_ptn_3 .dots-container {
        display: flex;
        gap: 8px;
    }

    /* ドット */
    .lw_loading_ptn_3 .dot {
        width: 12px;
        height: 12px;
        background-color: var(--color-main, #3498db);
        border-radius: 50%;
        animation: wave 1.4s ease-in-out infinite;
    }

    /* 各ドットのアニメーション遅延 */
    .lw_loading_ptn_3 .dot:nth-child(1) {
        animation-delay: 0s;
    }

    .lw_loading_ptn_3 .dot:nth-child(2) {
        animation-delay: 0.15s;
    }

    .lw_loading_ptn_3 .dot:nth-child(3) {
        animation-delay: 0.3s;
    }

    /* 波打つアニメーション */
    @keyframes wave {
        0%, 60%, 100% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        30% {
            transform: translateY(-15px) scale(1.2);
            opacity: 0.8;
        }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_3 .loading-text {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
        font-family: Arial, sans-serif;
    }
</style>