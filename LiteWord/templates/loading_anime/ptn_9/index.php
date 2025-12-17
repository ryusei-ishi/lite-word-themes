<div class="lw_loading_anime lw_loading_ptn_9">
    <div class="wave-container">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
    </div>
    <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
    </div>
    <div class="center-orb">
        <div class="orb-core"></div>
        <div class="orb-glow"></div>
    </div>
    <div class="loading-text">loading中...</div>
</div>
<style>
    /* ローディングコンテナ */
    .lw_loading_ptn_9 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at center, #0f0c29 0%, #302b63 50%, #24243e 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease-out;
        overflow: hidden;
    }

    /* offクラスが付いたら非表示 */
    .lw_loading_ptn_9.off {
        opacity: 0;
        pointer-events: none;
    }

    /* 波のコンテナ */
    .lw_loading_ptn_9 .wave-container {
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        transform-origin: center;
        animation: rotate 20s linear infinite;
    }

    /* 波 */
    .lw_loading_ptn_9 .wave {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 45%;
        opacity: 0.3;
    }

    .lw_loading_ptn_9 .wave1 {
        background: linear-gradient(45deg, transparent, var(--color-main, #00d4ff), transparent);
        animation: wave-morph 8s ease-in-out infinite;
    }

    .lw_loading_ptn_9 .wave2 {
        background: linear-gradient(45deg, transparent, #ff00ff, transparent);
        animation: wave-morph 8s ease-in-out infinite;
        animation-delay: 2s;
    }

    .lw_loading_ptn_9 .wave3 {
        background: linear-gradient(45deg, transparent, #00ff88, transparent);
        animation: wave-morph 8s ease-in-out infinite;
        animation-delay: 4s;
    }

    /* 波の変形アニメーション */
    @keyframes wave-morph {
        0%, 100% {
            transform: scale(0.8) rotate(0deg);
            border-radius: 45%;
        }
        25% {
            transform: scale(1.2) rotate(90deg);
            border-radius: 35%;
        }
        50% {
            transform: scale(1) rotate(180deg);
            border-radius: 45%;
        }
        75% {
            transform: scale(0.9) rotate(270deg);
            border-radius: 40%;
        }
    }

    /* 全体回転 */
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* パーティクル */
    .lw_loading_ptn_9 .particles {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .lw_loading_ptn_9 .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        opacity: 0.8;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }

    /* 各パーティクルの位置とアニメーション */
    .lw_loading_ptn_9 .particle:nth-child(1) {
        top: 20%;
        left: 30%;
        animation: float 6s ease-in-out infinite;
    }
    .lw_loading_ptn_9 .particle:nth-child(2) {
        top: 40%;
        left: 70%;
        animation: float 6s ease-in-out infinite 0.5s;
    }
    .lw_loading_ptn_9 .particle:nth-child(3) {
        top: 60%;
        left: 20%;
        animation: float 6s ease-in-out infinite 1s;
    }
    .lw_loading_ptn_9 .particle:nth-child(4) {
        top: 80%;
        left: 60%;
        animation: float 6s ease-in-out infinite 1.5s;
    }
    .lw_loading_ptn_9 .particle:nth-child(5) {
        top: 30%;
        left: 80%;
        animation: float 6s ease-in-out infinite 2s;
    }
    .lw_loading_ptn_9 .particle:nth-child(6) {
        top: 70%;
        left: 40%;
        animation: float 6s ease-in-out infinite 2.5s;
    }
    .lw_loading_ptn_9 .particle:nth-child(7) {
        top: 50%;
        left: 50%;
        animation: float 6s ease-in-out infinite 3s;
    }
    .lw_loading_ptn_9 .particle:nth-child(8) {
        top: 25%;
        left: 50%;
        animation: float 6s ease-in-out infinite 3.5s;
    }

    /* パーティクルの浮遊アニメーション */
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
        }
        25% {
            transform: translate(-30px, -30px) scale(1.5);
            opacity: 1;
        }
        50% {
            transform: translate(30px, -50px) scale(1);
            opacity: 0.6;
        }
        75% {
            transform: translate(-20px, 30px) scale(0.8);
            opacity: 0.9;
        }
    }

    /* 中心のオーブ */
    .lw_loading_ptn_9 .center-orb {
        position: relative;
        width: 80px;
        height: 80px;
        animation: breathe 4s ease-in-out infinite;
    }

    .lw_loading_ptn_9 .orb-core {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(0, 212, 255, 0.6) 50%, transparent 70%);
        border-radius: 50%;
        animation: pulse-core 2s ease-in-out infinite;
    }

    .lw_loading_ptn_9 .orb-glow {
        position: absolute;
        width: 120%;
        height: 120%;
        top: -10%;
        left: -10%;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 60%);
        border-radius: 50%;
        filter: blur(20px);
        animation: glow 3s ease-in-out infinite;
    }

    /* オーブの呼吸アニメーション */
    @keyframes breathe {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    /* コアのパルスアニメーション */
    @keyframes pulse-core {
        0%, 100% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(1);
        }
    }

    /* 光のアニメーション */
    @keyframes glow {
        0%, 100% {
            opacity: 0.5;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.5);
        }
    }

    /* ローディングテキスト */
    .lw_loading_ptn_9 .loading-text {
        position: relative;
        margin-top: 40px;
        font-size: 18px;
        color: rgba(255, 255, 255, 0.9);
        font-family: Arial, sans-serif;
        letter-spacing: 3px;
        text-transform: uppercase;
        text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
        animation: text-glow 2s ease-in-out infinite;
    }

    /* テキストの光るアニメーション */
    @keyframes text-glow {
        0%, 100% {
            opacity: 0.7;
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
        }
        50% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(0, 212, 255, 1), 0 0 50px rgba(0, 212, 255, 0.6);
        }
    }
</style>