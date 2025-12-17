<div class="lw_loading_anime lw_loading_ptn_8">
    <div class="orbit-container">
        <div class="center-dot"></div>
        <div class="orbit orbit1">
            <div class="planet"></div>
        </div>
        <div class="orbit orbit2">
            <div class="planet"></div>
        </div>
        <div class="orbit orbit3">
            <div class="planet"></div>
        </div>
    </div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_8 {
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
    .lw_loading_ptn_8.off {
        opacity: 0;
        pointer-events: none;
    }

    /* 軌道コンテナ */
    .lw_loading_ptn_8 .orbit-container {
        position: relative;
        width: 100px;
        height: 100px;
    }

    /* 中心の点 */
    .lw_loading_ptn_8 .center-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        background-color: var(--color-main, #3498db);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: pulse-center 2s ease-in-out infinite;
    }

    /* 軌道 */
    .lw_loading_ptn_8 .orbit {
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        border: 1px solid rgba(52, 152, 219, 0.2);
    }

    .lw_loading_ptn_8 .orbit1 {
        width: 40px;
        height: 40px;
        margin: -20px 0 0 -20px;
        animation: rotate 2s linear infinite;
    }

    .lw_loading_ptn_8 .orbit2 {
        width: 60px;
        height: 60px;
        margin: -30px 0 0 -30px;
        animation: rotate 3s linear infinite reverse;
    }

    .lw_loading_ptn_8 .orbit3 {
        width: 80px;
        height: 80px;
        margin: -40px 0 0 -40px;
        animation: rotate 4s linear infinite;
    }

    /* 惑星 */
    .lw_loading_ptn_8 .planet {
        position: absolute;
        top: -3px;
        left: 50%;
        width: 6px;
        height: 6px;
        background-color: var(--color-main, #3498db);
        border-radius: 50%;
        transform: translateX(-50%);
    }

    /* 回転アニメーション */
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* 中心のパルスアニメーション */
    @keyframes pulse-center {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.3); }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_8 .loading-text {
        margin-top: 30px;
        font-size: 16px;
        color: #333;
        font-family: Arial, sans-serif;
    }
</style>