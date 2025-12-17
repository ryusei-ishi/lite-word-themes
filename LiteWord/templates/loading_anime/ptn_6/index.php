<div class="lw_loading_anime lw_loading_ptn_6">
    <div class="hexagon-container">
        <div class="hexagon hex1"></div>
        <div class="hexagon hex2"></div>
        <div class="hexagon hex3"></div>
        <div class="hexagon hex4"></div>
        <div class="hexagon hex5"></div>
        <div class="hexagon hex6"></div>
    </div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_6 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease-out;
    }

    /* offクラスが付いたら非表示 */
    .lw_loading_ptn_6.off {
        opacity: 0;
        pointer-events: none;
    }

    /* 六角形コンテナ */
    .lw_loading_ptn_6 .hexagon-container {
        position: relative;
        width: 100px;
        height: 100px;
    }

    /* 六角形 */
    .lw_loading_ptn_6 .hexagon {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: rgba(255, 255, 255, 0.9);
        transform: rotate(45deg);
        border-radius: 3px;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    }

    /* 六角形の配置 */
    .lw_loading_ptn_6 .hex1 { top: 0; left: 35px; }
    .lw_loading_ptn_6 .hex2 { top: 25px; left: 60px; }
    .lw_loading_ptn_6 .hex3 { top: 50px; left: 35px; }
    .lw_loading_ptn_6 .hex4 { top: 50px; left: 10px; }
    .lw_loading_ptn_6 .hex5 { top: 25px; left: 10px; }
    .lw_loading_ptn_6 .hex6 { top: 25px; left: 35px; }

    /* 各六角形のアニメーション */
    .lw_loading_ptn_6 .hex1 {
        animation: glow 2s ease-in-out infinite;
        animation-delay: 0s;
    }
    .lw_loading_ptn_6 .hex2 {
        animation: glow 2s ease-in-out infinite;
        animation-delay: 0.3s;
    }
    .lw_loading_ptn_6 .hex3 {
        animation: glow 2s ease-in-out infinite;
        animation-delay: 0.6s;
    }
    .lw_loading_ptn_6 .hex4 {
        animation: glow 2s ease-in-out infinite;
        animation-delay: 0.9s;
    }
    .lw_loading_ptn_6 .hex5 {
        animation: glow 2s ease-in-out infinite;
        animation-delay: 1.2s;
    }
    .lw_loading_ptn_6 .hex6 {
        animation: glow 2s ease-in-out infinite;
        animation-delay: 1.5s;
    }

    /* 光るアニメーション */
    @keyframes glow {
        0%, 100% {
            background-color: rgba(255, 255, 255, 0.3);
            transform: rotate(45deg) scale(0.8);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        50% {
            background-color: rgba(255, 255, 255, 1);
            transform: rotate(45deg) scale(1.2);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
        }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_6 .loading-text {
        margin-top: 40px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        font-family: Arial, sans-serif;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
</style>