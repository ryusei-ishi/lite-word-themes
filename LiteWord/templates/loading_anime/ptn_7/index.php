<div class="lw_loading_anime lw_loading_ptn_7">
    <div class="gradient-bar">
        <div class="gradient-flow"></div>
    </div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_7 {
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
    .lw_loading_ptn_7.off {
        opacity: 0;
        pointer-events: none;
    }

    /* グラデーションバー */
    .lw_loading_ptn_7 .gradient-bar {
        width: 200px;
        height: 8px;
        background-color: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    }

    /* 流れるグラデーション */
    .lw_loading_ptn_7 .gradient-flow {
        position: absolute;
        top: 0;
        left: -200px;
        width: 200px;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent,
            var(--color-main, #3498db) 20%,
            #9b59b6 50%,
            #e74c3c 80%,
            transparent
        );
        animation: flow 2s linear infinite;
    }

    /* グラデーションが流れるアニメーション */
    @keyframes flow {
        0% {
            left: -200px;
        }
        100% {
            left: 200px;
        }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_7 .loading-text {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
        font-family: Arial, sans-serif;
        background: linear-gradient(90deg, #3498db, #9b59b6, #e74c3c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradientShift 3s ease-in-out infinite;
        background-size: 200% auto;
    }

    /* テキストグラデーションアニメーション */
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
</style>