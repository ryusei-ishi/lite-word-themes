<div class="lw_loading_anime lw_loading_ptn_2">
    <div class="progress-bar">
        <div class="progress-fill"></div>
    </div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_2 {
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
    .lw_loading_ptn_2.off {
        opacity: 0;
        pointer-events: none;
    }

    /* プログレスバーコンテナ */
    .lw_loading_ptn_2 .progress-bar {
        width: 200px;
        height: 6px;
        background-color: #f3f3f3;
        border-radius: 3px;
        overflow: hidden;
    }

    /* プログレスバーの塗り */
    .lw_loading_ptn_2 .progress-fill {
        height: 100%;
        background-color: var(--color-main, #3498db);
        animation: fillBar 2s ease-in-out infinite;
    }

    /* バーが増えていくアニメーション */
    @keyframes fillBar {
        0% {
            width: 0%;
            transform: translateX(0);
        }
        50% {
            width: 100%;
            transform: translateX(0);
        }
        100% {
            width: 100%;
            transform: translateX(100%);
        }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_2 .loading-text {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
        font-family: Arial, sans-serif;
    }
</style>