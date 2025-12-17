<div class="lw_loading_anime lw_loading_ptn_1">
    <div class="spinner"></div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_1 {
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
    .lw_loading_ptn_1.off {
        opacity: 0;
        pointer-events: none;
    }

    /* 回転する円 */
    .lw_loading_ptn_1 .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--color-main, #3498db);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    /* 回転アニメーション */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_1 .loading-text {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
        font-family: Arial, sans-serif;
    }
</style>