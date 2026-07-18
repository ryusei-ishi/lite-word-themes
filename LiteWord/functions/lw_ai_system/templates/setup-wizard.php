<?php
/**
 * AIセットアップウィザード — 白紙ページ（テーマCSS/JSなし）
 *
 * @package LiteWord_AI_Page_Generator
 */
if ( ! defined( 'ABSPATH' ) ) exit;
if ( ! current_user_can( 'edit_posts' ) ) { wp_redirect( wp_login_url() ); exit; }

$img_base      = LW_AI_SYSTEM_URL . 'assets/img/setup/';
$api_key_exists = ! empty( LW_AI_Generator_Admin_Settings::get_api_key() );
$has_agreed    = LW_AI_Generator_Admin_Settings::has_agreed_terms();
$ajax_url      = admin_url( 'admin-ajax.php' );
$nonce         = wp_create_nonce( 'lw_ai_admin_settings_nonce' );
$dashboard_url = admin_url();
$version       = defined( 'LW_AI_SYSTEM_VERSION' ) ? LW_AI_SYSTEM_VERSION : '1.0';
?><!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>AI&#12475;&#12483;&#12488;&#12450;&#12483;&#12503; - LiteWord</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
/* ===== Reset & Base ===== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:18px;-webkit-text-size-adjust:100%}
body{
  font-family:'Noto Sans JP',sans-serif;
  background:#f8fafc;
  color:#1e293b;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow-x:hidden;
  line-height:1.7;
}
a{color:#6366f1;text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;height:auto;display:block}

/* ===== Container ===== */
#lw-wizard{
  width:100%;max-width:600px;
  padding:32px 24px 24px;
  position:relative;
}

/* ===== Screen ===== */
.lw-screen{display:none;animation:fadeIn .4s ease}
.lw-screen.active{display:block}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ===== Cat Image ===== */
.lw-cat{
  display:block;margin:0 auto 20px;
  object-fit:contain;
}
.lw-cat-sm{max-width:150px}
.lw-cat-lg{max-width:220px}
.lw-cat-glow{
  filter:drop-shadow(0 0 24px rgba(99,102,241,.35));
  animation:catGlow 2s ease-in-out infinite alternate;
}
@keyframes catGlow{
  from{filter:drop-shadow(0 0 20px rgba(99,102,241,.25))}
  to  {filter:drop-shadow(0 0 36px rgba(139,92,246,.45))}
}

/* ===== Speech ===== */
.lw-speech{
  text-align:center;
  font-size:1.15rem;font-weight:600;
  color:#334155;
  margin-bottom:24px;
  line-height:1.8;
}

/* ===== Card ===== */
.lw-card{
  background:#fff;
  border:1px solid #e2e8f0;
  border-radius:16px;
  padding:20px 24px;
  margin-bottom:20px;
  box-shadow:0 1px 4px rgba(0,0,0,.04);
}

/* ===== Features ===== */
.lw-features{list-style:none;padding:0;margin:0 0 24px}
.lw-features li{
  padding:8px 0;
  font-size:.95rem;
  display:flex;align-items:flex-start;gap:10px;
  color:#334155;
}
.lw-features li::before{content:none}

/* ===== Buttons ===== */
.lw-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:16px 24px;
  border:none;border-radius:14px;
  font-family:inherit;font-size:1rem;font-weight:700;
  cursor:pointer;transition:all .2s;
  text-decoration:none;
}
.lw-btn:hover{transform:translateY(-2px);text-decoration:none}
.lw-btn:active{transform:translateY(0)}
.lw-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}

.lw-btn-primary{
  background:linear-gradient(135deg,#6366f1,#8b5cf6);
  color:#fff;
  box-shadow:0 4px 20px rgba(99,102,241,.3);
}
.lw-btn-primary:hover{box-shadow:0 6px 28px rgba(99,102,241,.4);color:#fff}

.lw-btn-ghost{
  background:#fff;
  color:#64748b;
  border:1px solid #d1d5db;
}
.lw-btn-ghost:hover{background:#f1f5f9;color:#334155}

.lw-btn-success{
  background:linear-gradient(135deg,#10b981,#059669);
  color:#fff;
  box-shadow:0 4px 20px rgba(16,185,129,.3);
}

.lw-btn-row{display:flex;gap:12px;margin-top:16px}
.lw-btn-row .lw-btn{width:auto;flex:1}
.lw-btn-row .lw-btn-back{flex:0 0 auto;padding:16px 20px}

/* ===== Progress ===== */
.lw-progress{
  display:flex;align-items:center;justify-content:center;gap:10px;
  margin-top:28px;
}
.lw-dot{
  width:10px;height:10px;border-radius:50%;
  background:#d1d5db;
  transition:all .3s;
}
.lw-dot.active{background:#6366f1;box-shadow:0 0 8px rgba(99,102,241,.4)}
.lw-dot.done{background:#10b981}

/* ===== Screen 1: Agree ===== */
.lw-agree-item{
  padding:14px 0;
  border-bottom:1px solid #f1f5f9;
}
.lw-agree-item:last-child{border-bottom:none}
.lw-agree-item strong{display:block;font-size:.95rem;margin-bottom:4px;color:#1e293b}
.lw-agree-item p{font-size:.85rem;color:#64748b;margin:0;line-height:1.6}

.lw-checkbox-wrap{
  display:flex;align-items:center;gap:12px;
  margin:20px 0 8px;
  cursor:pointer;font-size:.9rem;
  color:#334155;
  padding:14px 18px;
  background:#f8fafc;
  border:2px solid #e2e8f0;
  border-radius:14px;
  transition:all .2s;
  user-select:none;
}
.lw-checkbox-wrap:hover{border-color:#a5b4fc;background:#eef2ff}
.lw-checkbox-wrap.checked{border-color:#6366f1;background:#eef2ff}

/* Hide native checkbox */
.lw-checkbox-wrap input[type=checkbox]{
  position:absolute;opacity:0;width:0;height:0;
}

/* Custom checkbox */
.lw-check-box{
  width:26px;height:26px;flex-shrink:0;
  border:2px solid #cbd5e1;
  border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  transition:all .25s;
  background:#fff;
}
.lw-checkbox-wrap.checked .lw-check-box{
  background:linear-gradient(135deg,#6366f1,#8b5cf6);
  border-color:#6366f1;
  animation:checkPop .3s ease;
}
.lw-check-box svg{
  width:16px;height:16px;
  stroke:#fff;stroke-width:3;fill:none;
  stroke-linecap:round;stroke-linejoin:round;
  opacity:0;transform:scale(0);
  transition:all .2s;
}
.lw-checkbox-wrap.checked .lw-check-box svg{
  opacity:1;transform:scale(1);
}
@keyframes checkPop{
  0%{transform:scale(1)}
  50%{transform:scale(1.2)}
  100%{transform:scale(1)}
}

/* ===== Screen 2: Steps ===== */
.lw-step{margin-bottom:28px}
.lw-step-label{
  display:inline-block;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);
  color:#fff;font-size:.75rem;font-weight:700;
  padding:3px 12px;border-radius:20px;
  margin-bottom:10px;
}
.lw-step-title{font-size:1rem;font-weight:700;margin-bottom:10px;color:#1e293b}
.lw-step-img{
  border-radius:10px;border:1px solid #e2e8f0;
  margin-bottom:10px;
  background:#f8fafc;
  min-height:100px;
  display:flex;align-items:center;justify-content:center;
  color:#94a3b8;font-size:.85rem;
  overflow:hidden;
}
.lw-step-img img{width:100%;height:auto;display:block}
.lw-step-hint{
  font-size:.85rem;color:#6366f1;
  margin-top:6px;
  line-height:1.7;
}
.lw-step-hint>span:first-child{
  margin-right:4px;
}

.lw-api-input-wrap{
  display:flex;gap:8px;margin:14px 0 6px;
}
.lw-api-input{
  flex:1;padding:14px 16px;
  background:#fff;
  border:2px solid #d1d5db;
  border-radius:12px;
  color:#1e293b;font-family:monospace;font-size:.9rem;
  outline:none;transition:border-color .2s;
}
.lw-api-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.lw-api-input::placeholder{color:#94a3b8}

.lw-security-note{
  font-size:.75rem;color:#94a3b8;
  display:flex;align-items:center;gap:4px;
  margin-bottom:16px;
}

.lw-save-result{
  padding:10px 14px;border-radius:10px;
  font-size:.85rem;margin-top:10px;display:none;
}
.lw-save-result.success{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}
.lw-save-result.error{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}

.lw-trouble{
  margin-top:24px;padding:16px;
  background:#f8fafc;
  border-radius:12px;
  border:1px solid #e2e8f0;
}
.lw-trouble-header{
  display:flex;align-items:center;gap:8px;
  font-size:.85rem;font-weight:600;color:#64748b;
  margin-bottom:8px;
}
.lw-trouble-header img{width:36px;height:auto;object-fit:contain}
.lw-trouble-list{list-style:none;padding:0;margin:0;font-size:.8rem;color:#64748b}
.lw-trouble-list li{padding:3px 0}

/* ===== Screen 3: Complete ===== */
.lw-complete-bg{
  text-align:center;
  padding:24px;
  border-radius:20px;
  background:linear-gradient(135deg,#eef2ff,#f5f3ff,#faf5ff);
}
.lw-confetti{font-size:2.5rem;margin-bottom:8px}
.lw-complete-title{
  font-size:1.5rem;font-weight:900;
  background:linear-gradient(135deg,#7c3aed,#6366f1,#818cf8);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  margin-bottom:16px;
}
.lw-complete-hint{
  font-size:.85rem;color:#64748b;
  margin-top:16px;padding:12px;
  background:#fff;
  border-radius:10px;
  border:1px solid #e2e8f0;
}

/* ===== Text Link Button ===== */
.lw-btn-link{
  background:none;border:none;
  color:#94a3b8;font-size:.8rem;
  font-family:inherit;
  cursor:pointer;padding:4px;
  transition:color .2s;
}
.lw-btn-link:hover{color:#6366f1;text-decoration:underline}

/* ===== Responsive ===== */
@media(max-width:640px){
  body{align-items:flex-start;padding:16px 0}
  #lw-wizard{padding:20px 16px}
  .lw-cat-lg{max-width:170px}
  .lw-cat-sm{max-width:120px}
  .lw-btn-row{flex-direction:column}
  .lw-btn-row .lw-btn-back{flex:1}
}

/* ===== Spinner ===== */
.lw-spinner{
  display:inline-block;width:18px;height:18px;
  border:2px solid rgba(255,255,255,.3);border-top-color:#fff;
  border-radius:50%;animation:spin .6s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>

<div id="lw-wizard">

  <!-- ===== Screen 0: Welcome ===== -->
  <div class="lw-screen active" id="screen-0">
    <img src="<?php echo esc_url( $img_base . 'neko-worried.png?v=' . $version ); ?>" alt="" class="lw-cat lw-cat-lg">

    <div class="lw-speech">
      &#x300C;&#x307E;&#x3060;AI&#x304C;&#x7E4B;&#x304C;&#x3063;&#x3066;&#x306A;&#x3044;&#x306B;&#x3083;...<br>
      &#x50D5;&#x306E;&#x529B;&#x3092;100%&#x767A;&#x63EE;&#x3067;&#x304D;&#x306A;&#x3044;&#x306B;&#x3083;...&#x300D;
    </div>

    <div class="lw-card">
      <div style="font-weight:700;margin-bottom:12px;color:#6366f1;font-size:.9rem">AIを接続すると...</div>
      <ul class="lw-features">
        <li><span>&#x2705;</span> ページの自動生成（1分でLP完成）</li>
        <li><span>&#x2705;</span> テキストのAI改善</li>
        <li><span>&#x2705;</span> ブロック設定をAIにおまかせ</li>
        <li><span>&#x2705;</span> 回数無制限・データ外部送信なし</li>
      </ul>
    </div>

    <button class="lw-btn lw-btn-primary" onclick="goScreen(1)">
      &#x2728; セットアップを始める！（5分で完了）&#x2728;
    </button>

    <div class="lw-progress">
      <span class="lw-dot active"></span>
      <span class="lw-dot"></span>
      <span class="lw-dot"></span>
      <span class="lw-dot"></span>
    </div>
  </div>

  <!-- ===== Screen 1: Agreement ===== -->
  <div class="lw-screen" id="screen-1">
    <img src="<?php echo esc_url( $img_base . 'neko-serious.png?v=' . $version ); ?>" alt="" class="lw-cat lw-cat-sm">

    <div class="lw-speech">
      &#x300C;&#x5927;&#x4E8B;&#x306A;&#x3053;&#x3068;&#x3092;3&#x3064;&#x3060;&#x3051;&#x78BA;&#x8A8D;&#x3059;&#x308B;&#x306B;&#x3083;&#xFF01;&#x300D;
    </div>

    <div class="lw-card">
      <div class="lw-agree-item">
        <strong>&#x1F4B0; 料金: 基本無料！</strong>
        <p>使った分だけGoogleに支払う従量課金だけど、<br>無料枠がたっぷりあるから普通は0円にゃ！<br>たくさん使っても月数十円程度。スタバ1杯より安いにゃ！</p>
      </div>
      <div class="lw-agree-item">
        <strong>&#x1F916; AIは賢いけど完璧じゃない</strong>
        <p>時々間違えるから、<br>公開前にチェックしてにゃ！</p>
      </div>
      <div class="lw-agree-item">
        <strong>&#x1F4CB; 利用は自己責任</strong>
        <p>AI生成物の利用はご自身の<br>判断でお願いするにゃ！</p>
      </div>
    </div>

    <label class="lw-checkbox-wrap" id="agree-label" onclick="toggleCheck()">
      <input type="checkbox" id="agree-check">
      <span class="lw-check-box">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <span>上記の内容を確認しました</span>
    </label>

    <div class="lw-btn-row">
      <button class="lw-btn lw-btn-ghost lw-btn-back" onclick="goScreen(0)">&lt; 戻る</button>
      <button class="lw-btn lw-btn-primary" id="agree-btn" disabled onclick="handleAgree()">
        了解！次へ進む &rarr;
      </button>
    </div>

    <div class="lw-progress">
      <span class="lw-dot done"></span>
      <span class="lw-dot active"></span>
      <span class="lw-dot"></span>
      <span class="lw-dot"></span>
    </div>
  </div>

  <!-- ===== Screen 2: API Key Setup ===== -->
  <div class="lw-screen" id="screen-2">
    <img src="<?php echo esc_url( $img_base . 'neko-happy.png?v=' . $version ); ?>" alt="" class="lw-cat lw-cat-sm">

    <div class="lw-speech">
      &#x300C;&#x4E00;&#x7DD2;&#x306B;&#x3084;&#x308B;&#x306B;&#x3083;&#xFF01;&#x8D85;&#x7C21;&#x5358;&#x306B;&#x3083;&#xFF01;&#x300D;
    </div>

    <!-- Step 1 -->
    <div class="lw-step">
      <span class="lw-step-label">ステップ &#x2460;</span>
      <div class="lw-step-title">Google AI Studio を開く</div>
      <div class="lw-step-img" id="step-img-1">
        <img src="<?php echo esc_url( $img_base . 'step-open-studio.png?v=' . $version ); ?>" alt="Google AI Studio">
      </div>
      <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" class="lw-btn lw-btn-ghost" style="margin-top:8px">
        &#x1F517; Google AI Studio を開く（別タブ）
      </a>
      <div class="lw-step-hint">
        <span>&#x1F4A1;</span> Googleアカウントでログインしてね。個人のGmailがおススメにゃ！
      </div>
    </div>

    <!-- Step 2 -->
    <div class="lw-step">
      <span class="lw-step-label">ステップ &#x2461;</span>
      <div class="lw-step-title">APIキーを作成</div>
      <div class="lw-step-img" id="step-img-2">
        <img src="<?php echo esc_url( $img_base . 'step-create-key.png?v=' . $version ); ?>" alt="APIキーを作成">
      </div>
      <div class="lw-step-hint">
        <span>&#x1F4A1;</span> 右上の「APIキーを作成」をクリックするにゃ！
      </div>
    </div>

    <!-- Step 3: New Project -->
    <div class="lw-step">
      <span class="lw-step-label">ステップ &#x2462;</span>
      <div class="lw-step-title">プロジェクトを作成</div>
      <div class="lw-step-img">
        <img src="<?php echo esc_url( $img_base . 'step-new-project.png?v=' . $version ); ?>" alt="プロジェクトを作成">
      </div>
      <div class="lw-step-hint">
        <span>&#x1F4A1;</span> キー名はそのまま「Gemini API Key」でOKにゃ！<br>
        下のセレクトを開いて「<strong>+ プロジェクトを作成</strong>」をクリックしてにゃ！
      </div>

      <div class="lw-step-img" style="margin-top:14px">
        <img src="<?php echo esc_url( $img_base . 'step-create-project.png?v=' . $version ); ?>" alt="プロジェクト名を入力">
      </div>
      <div class="lw-step-hint">
        <span>&#x1F4A1;</span> この画面が出たら、名前はそのまま「Gemini Project」で<br>
        「<strong>プロジェクトを作成</strong>」ボタンを押すにゃ！
      </div>

      <div class="lw-step-img" style="margin-top:14px">
        <img src="<?php echo esc_url( $img_base . 'step-confirm-key.png?v=' . $version ); ?>" alt="キーを作成">
      </div>
      <div class="lw-step-hint">
        <span>&#x1F4A1;</span> プロジェクトが選択されたら「<strong>キーを作成</strong>」を押すにゃ！
      </div>
    </div>

    <!-- Step 4: Copy & Paste -->
    <div class="lw-step">
      <span class="lw-step-label">ステップ &#x2463;</span>
      <div class="lw-step-title">コピーして貼り付け</div>
      <div class="lw-step-img" id="step-img-3">
        <img src="<?php echo esc_url( $img_base . 'step-copy-key.png?v=' . $version ); ?>" alt="APIキーをコピー">
      </div>
      <div class="lw-step-hint">
        <span>&#x1F4A1;</span> 赤枠のキー名をクリックするにゃ！
      </div>

      <div class="lw-step-img" style="margin-top:14px">
        <img src="<?php echo esc_url( $img_base . 'step-copy-detail.png?v=' . $version ); ?>" alt="キーをコピー">
      </div>
      <div class="lw-step-hint">
        <span>&#x1F4A1;</span> 「<strong>キーをコピー</strong>」ボタンを押してコピーするにゃ！
      </div>

      <div style="font-size:.9rem;margin:14px 0 4px">コピーしたキーを下に貼り付けるにゃ！</div>

      <div class="lw-api-input-wrap">
        <input type="text" class="lw-api-input" id="api-key-input" placeholder="AIza..." autocomplete="off" spellcheck="false">
      </div>
      <div class="lw-security-note">&#x1F512; AES-256暗号化で安全に保存されます</div>

      <button class="lw-btn lw-btn-success" id="save-btn" onclick="handleSaveKey()">
        &#x1F4BE; 保存してパワーアップ！
      </button>

      <div class="lw-save-result" id="save-result"></div>
    </div>

    <!-- Trouble -->
    <div class="lw-trouble">
      <div class="lw-trouble-header">
        <img src="<?php echo esc_url( $img_base . 'neko-thinking.png?v=' . $version ); ?>" alt="">
        うまくいかない？
      </div>
      <ul class="lw-trouble-list">
        <li>&#x251C; 「APIキーが無効」&rarr; コピーし直してみてにゃ</li>
        <li>&#x251C; 「英語でわからない」&rarr; Chromeで右クリック &rarr; 翻訳</li>
        <li>&#x2514; 「それでもダメ」&rarr; サポートに連絡するにゃ</li>
      </ul>
    </div>

    <div class="lw-btn-row" style="margin-top:20px">
      <button class="lw-btn lw-btn-ghost lw-btn-back" onclick="goScreen(1)">&lt; 戻る</button>
    </div>

    <div class="lw-progress">
      <span class="lw-dot done"></span>
      <span class="lw-dot done"></span>
      <span class="lw-dot active"></span>
      <span class="lw-dot"></span>
    </div>
  </div>

  <!-- ===== Screen 3: Complete ===== -->
  <div class="lw-screen" id="screen-3">
    <div class="lw-complete-bg" style="padding:20px 0">
      <img src="<?php echo esc_url( $img_base . 'neko-happy.png?v=' . $version ); ?>" alt="" class="lw-cat lw-cat-lg lw-cat-glow">

      <div class="lw-confetti">&#x1F389;</div>
      <div class="lw-complete-title">パワーアップ完了！</div>

      <div class="lw-speech">
        &#x300C;&#x3084;&#x3063;&#x305F;&#x306B;&#x3083;&#x30FC;&#x30FC;&#x30FC;&#xFF01;&#x2728;<br>
        &#x50D5;&#x304C;&#x8D85;&#x30D1;&#x30EF;&#x30FC;&#x30A2;&#x30C3;&#x30D7;&#x3057;&#x305F;&#x306B;&#x3083;&#xFF01;&#x300D;
      </div>
    </div>

    <div style="margin-top:20px">
      <div style="text-align:center;font-size:.9rem;color:#94a3b8;margin-bottom:12px">今すぐ試してみる？</div>

      <button type="button" class="lw-btn lw-btn-primary" id="lw-go-dashboard-btn" onclick="switchToOwnAndGo()">
        &#x1F431; 僕に会いに行くにゃ！
      </button>
      <script>
      function switchToOwnAndGo(){
        var btn=document.getElementById('lw-go-dashboard-btn');
        btn.disabled=true;btn.textContent='切り替え中...';
        fetch('<?php echo esc_url(rest_url('liteword/v1/ai-chat-mode')); ?>',{
          method:'POST',
          headers:{'Content-Type':'application/json','X-WP-Nonce':'<?php echo wp_create_nonce('wp_rest'); ?>'},
          body:JSON.stringify({mode:'own'}),
          credentials:'same-origin'
        }).finally(function(){
          window.location.href='<?php echo esc_url($dashboard_url); ?>';
        });
      }
      </script>

      <div class="lw-complete-hint">
        &#x300C;&#x63A5;&#x9AA8;&#x9662;&#x306ELP&#x4F5C;&#x3063;&#x3066;&#x300D;&#x3068;&#x30C1;&#x30E3;&#x30C3;&#x30C8;&#x3067;&#x8A71;&#x3057;&#x304B;&#x3051;&#x3066;&#x307F;&#x3066;&#x306B;&#x3083;&#xFF01;
      </div>

      <div style="text-align:center;margin-top:20px">
        <button class="lw-btn-link" onclick="goScreen(2)">APIキーを変更する</button>
        <span style="color:#d1d5db;margin:0 8px">|</span>
        <button class="lw-btn-link" onclick="handleReset()">設定をリセットする</button>
      </div>
    </div>

    <div class="lw-progress">
      <span class="lw-dot done"></span>
      <span class="lw-dot done"></span>
      <span class="lw-dot done"></span>
      <span class="lw-dot done" style="background:#10b981">&#x2714;</span>
    </div>
  </div>

</div>

<script>
(function(){
  var ajaxUrl = <?php echo wp_json_encode( $ajax_url ); ?>;
  var nonce   = <?php echo wp_json_encode( $nonce ); ?>;
  var apiKeyExists = <?php echo $api_key_exists ? 'true' : 'false'; ?>;
  var hasAgreed    = <?php echo $has_agreed ? 'true' : 'false'; ?>;

  window.goScreen = function(n) {
    var screens = document.querySelectorAll('.lw-screen');
    screens.forEach(function(s){ s.classList.remove('active'); });
    var target = document.getElementById('screen-' + n);
    if (target) target.classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  };

  window.toggleCheck = function() {
    var cb = document.getElementById('agree-check');
    var label = document.getElementById('agree-label');
    var btn = document.getElementById('agree-btn');
    cb.checked = !cb.checked;
    if (cb.checked) {
      label.classList.add('checked');
    } else {
      label.classList.remove('checked');
    }
    if (btn) btn.disabled = !cb.checked;
  };

  window.handleAgree = function() {
    var btn = document.getElementById('agree-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="lw-spinner"></span> 処理中...';

    var fd = new FormData();
    fd.append('action', 'lw_ai_agree_terms');
    fd.append('nonce', nonce);
    fd.append('agreed_items[]', 'billing');
    fd.append('agreed_items[]', 'accuracy');
    fd.append('agreed_items[]', 'responsibility');

    fetch(ajaxUrl, { method:'POST', body:fd, credentials:'same-origin' })
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d.success) {
          hasAgreed = true;
          goScreen(2);
        } else {
          btn.disabled = false;
          btn.textContent = '了解！次へ進む →';
          alert(d.data && d.data.message ? d.data.message : 'エラーが発生しました');
        }
      })
      .catch(function(){
        btn.disabled = false;
        btn.textContent = '了解！次へ進む →';
        alert('通信エラーが発生しました');
      });
  };

  window.handleSaveKey = function() {
    var input = document.getElementById('api-key-input');
    var btn   = document.getElementById('save-btn');
    var result = document.getElementById('save-result');
    var key = input.value.trim();

    if (!key) {
      showResult(result, 'error', 'APIキーを入力してください');
      return;
    }
    if (key.indexOf('AIza') !== 0) {
      showResult(result, 'error', '「AIza」で始まるキーを入力してください');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="lw-spinner"></span> 検証中...';
    result.style.display = 'none';

    var fd = new FormData();
    fd.append('action', 'lw_ai_save_api_key');
    fd.append('nonce', nonce);
    fd.append('api_key', key);

    fetch(ajaxUrl, { method:'POST', body:fd, credentials:'same-origin' })
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d.success) {
          apiKeyExists = true;
          showResult(result, 'success', d.data.message || '保存成功！');
          setTimeout(function(){ goScreen(3); }, 1200);
        } else {
          btn.disabled = false;
          btn.innerHTML = '&#x1F4BE; 保存してパワーアップ！';
          showResult(result, 'error', d.data && d.data.message ? d.data.message : '保存に失敗しました');
        }
      })
      .catch(function(){
        btn.disabled = false;
        btn.innerHTML = '&#x1F4BE; 保存してパワーアップ！';
        showResult(result, 'error', '通信エラーが発生しました');
      });
  };

  window.handleReset = function() {
    if (!confirm('APIキーと同意設定をリセットします。よろしいですか？')) return;

    var fd = new FormData();
    fd.append('action', 'lw_ai_reset_api_key');
    fd.append('nonce', nonce);

    fetch(ajaxUrl, { method:'POST', body:fd, credentials:'same-origin' })
      .then(function(r){ return r.json(); })
      .then(function(d){
        apiKeyExists = false;
        hasAgreed = false;
        // 入力欄もクリア
        var input = document.getElementById('api-key-input');
        if (input) input.value = '';
        goScreen(0);
      })
      .catch(function(){ alert('リセットに失敗しました'); });
  };

  function showResult(el, type, msg) {
    el.className = 'lw-save-result ' + type;
    el.textContent = msg;
    el.style.display = 'block';
  }

  // Auto-skip: APIキーが設定済みの場合のみ完了画面へ
  // キーが未設定なら常に画面0から（同意済みでも最初から案内する）
  if (apiKeyExists) {
    goScreen(3);
  }
})();
</script>
</body>
</html>
