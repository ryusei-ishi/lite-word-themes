<div class="lw_loading_anime lw_loading_ptn_5">
    <div class="morphing-square"></div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_5 {
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
    .lw_loading_ptn_5.off {
        opacity: 0;
        pointer-events: none;
    }

    /* 変形する四角形 */
    .lw_loading_ptn_5 .morphing-square {
        width: 50px;
        height: 50px;
        background-color: var(--color-main, #3498db);
        animation: morphRotate 2s ease-in-out infinite;
    }

    /* 回転と変形アニメーション */
    @keyframes morphRotate {
        0% {
            transform: rotate(0deg) scale(1);
            border-radius: 0%;
        }
        25% {
            transform: rotate(90deg) scale(0.8);
            border-radius: 20%;
        }
        50% {
            transform: rotate(180deg) scale(1);
            border-radius: 50%;
        }
        75% {
            transform: rotate(270deg) scale(0.8);
            border-radius: 20%;
        }
        100% {
            transform: rotate(360deg) scale(1);
            border-radius: 0%;
        }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_5 .loading-text {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
        font-family: Arial, sans-serif;
    }
</style>