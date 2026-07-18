/**
 * LiteWord AI Chat — Dashboard Widget
 */
(function () {
  var API_URL = lwAiChat.apiUrl;
  var CONSENT_URL = lwAiChat.consentUrl;
  var HISTORY_URL = lwAiChat.historyUrl;
  var NONCE = lwAiChat.nonce;
  var AVATAR_URL = lwAiChat.avatarUrl;
  var HAS_CONSENT = lwAiChat.hasConsent;
  var HAS_OWN_KEY = lwAiChat.hasOwnKey;
  var USE_OWN_KEY = lwAiChat.useOwnKey;
  var MODE_URL = lwAiChat.modeUrl;
  var DAILY_LIMIT = parseInt(lwAiChat.dailyLimit) || 3;
  var chatCategory = 'general'; // auto-detected per question

  function showNewReplyIndicator(targetRow) {
    if (!targetRow) return;
    var msgs = document.getElementById('lw-ai-chat-messages');
    if (!msgs) return;

    // 既存のインジケーターを削除
    var old = document.getElementById('lw-ai-new-reply-btn');
    if (old) old.remove();

    // 回答が画面内に見えているかチェック
    var rect = targetRow.getBoundingClientRect();
    var msgsRect = msgs.getBoundingClientRect();
    if (rect.top >= msgsRect.top && rect.bottom <= msgsRect.bottom) return; // 見えてるなら不要

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'lw-ai-new-reply-btn';
    btn.className = 'lw-ai-new-reply-btn';
    btn.innerHTML = '↓ 新しい回答';
    btn.addEventListener('click', function() {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
      btn.remove();
    });

    // messagesの親に追加（固定位置で表示）
    msgs.parentElement.appendChild(btn);

    // スクロールで回答が見えたら自動で消す
    msgs.addEventListener('scroll', function onScroll() {
      var r = targetRow.getBoundingClientRect();
      var m = msgs.getBoundingClientRect();
      if (r.top >= m.top && r.top <= m.bottom) {
        btn.remove();
        msgs.removeEventListener('scroll', onScroll);
      }
    });

    // 10秒後に自動消去
    setTimeout(function() { if (btn.parentElement) btn.remove(); }, 10000);
  }

  function getLocalReply(question) {
    var q = question.toLowerCase().replace(/[！!？?。、\s]/g, '');
    var name = lwAiChat.userName || '';
    var greetings = [
      { words: ['おはよう'], reply: name + 'さん、おはようにゃ！今日も一緒に頑張ろうにゃ！' },
      { words: ['こんにちは','こんにちわ'], reply: name + 'さん、こんにちはにゃ！何でも聞いてにゃ！' },
      { words: ['こんばんは','こんばんわ'], reply: name + 'さん、こんばんはにゃ！夜遅くまでお疲れ様にゃ！' },
      { words: ['ありがとう','ありがと'], reply: 'どういたしましてにゃ！また何かあったらいつでも聞いてにゃ！' },
      { words: ['お疲れ','おつかれ'], reply: 'お疲れ様にゃ！無理しないでにゃ〜！' },
      { words: ['ばいばい','バイバイ','さようなら','またね'], reply: 'またね！いつでも待ってるにゃ〜！' },
      { words: ['かわいい','可愛い'], reply: 'えへへ、ありがとうにゃ！照れるにゃ〜！' },
      { words: ['だれ','誰','なにもの'], reply: '僕はLiteWordのAIサポートにゃ！LiteWordの使い方や、Webに関する質問に答えるにゃ！' },
    ];
    for (var i = 0; i < greetings.length; i++) {
      for (var j = 0; j < greetings[i].words.length; j++) {
        if (q.indexOf(greetings[i].words[j]) !== -1) return greetings[i].reply;
      }
    }
    return null;
  }

  function detectCategory(question) {
    var q = question.toLowerCase();
    var rules = [
      { cat: 'design', words: ['ヘッダー','フッター','ロゴ','メニュー','色','カラー','フォント','デザイン','レスポンシブ','スマホ','モバイル','追従','cta','固定表示','インフォメーションバー','ピックアップ','ドロワー','パンくず','背景','見た目','レイアウト'] },
      { cat: 'blocks', words: ['ブロック','fv','ファーストビュー','ボタン','リスト','テーブル','ギャラリー','バナー','ステップ','faq','お客様の声','吹き出し','コメント','会社概要','プロフィール','lp','ランディング','トップページ','ページ作成','テンプレート','コンテンツ','見出し','カラム'] },
      { cat: 'settings', words: ['seo','analytics','gtm','フォーム','メール','問い合わせ','マイパーツ','リダイレクト','301','会員','権限','カウントダウン','期限','コード','拡張','トグル','ウィジェット','カテゴリ','アーカイブ','投稿','固定ページ','編集画面','ai生成','ページ生成'] },
      { cat: 'start', words: ['インストール','セットアップ','始め','はじめ','プラン','プレミアム','無料','有料','アクティベート','有効化','アップデート','更新','トラブル','エラー','壊れ','動かない','使えない','買った'] },
    ];
    for (var i = 0; i < rules.length; i++) {
      for (var j = 0; j < rules[i].words.length; j++) {
        if (q.indexOf(rules[i].words[j]) !== -1) return rules[i].cat;
      }
    }
    return 'general';
  }
  var history = [];
  var isLoading = false;

  // 残り回数管理（localStorageベース）
  function getDailyUsed() {
    try {
      var data = JSON.parse(localStorage.getItem('lw_ai_chat_daily') || '{}');
      var today = new Date().toISOString().slice(0,10);
      if (data.date !== today) {
        // 日付が変わった or 初回 → 履歴から今日の送信数を計算
        var count = countTodayMessages();
        localStorage.setItem('lw_ai_chat_daily', JSON.stringify({ date: today, count: count }));
        return count;
      }
      return parseInt(data.count) || 0;
    } catch(e) { return 0; }
  }
  function countTodayMessages() {
    try {
      var stored = JSON.parse(localStorage.getItem('lw_ai_chat_messages') || '[]');
      var today = new Date().toISOString().slice(0,10);
      var count = 0;
      stored.forEach(function(item) {
        if (item.isUser && item.time) {
          var d = new Date(item.time).toISOString().slice(0,10);
          if (d === today) count++;
        }
      });
      return count;
    } catch(e) { return 0; }
  }
  function incrementDailyUsed() {
    var today = new Date().toISOString().slice(0,10);
    var used = getDailyUsed() + 1;
    localStorage.setItem('lw_ai_chat_daily', JSON.stringify({ date: today, count: used }));
    updateLimitDisplay();
  }
  function updateLimitDisplay() {
    var el = document.getElementById('lw-ai-chat-limit-text');
    if (!el || USE_OWN_KEY) return;
    var used = getDailyUsed();
    var remaining = Math.max(0, DAILY_LIMIT - used);
    el.textContent = '1日' + DAILY_LIMIT + '回まで（あと' + remaining + '回）';
  }
  var cooldownTimer = null;
  var COOLDOWN_SEC = 60;
  var cachedSiteSettings = null;

  function init() {
    var overlay = document.getElementById('lw-ai-chat-overlay');
    if (!overlay) return;

    // 残り回数を初期表示
    updateLimitDisplay();

    // ウェルカム画面の表示判定
    // - 挨拶: 1日1回（lw_ai_chat_shown_date）
    // - お知らせ: 1回きり（lw_ai_chat_seen_announce_<id>）
    var today = new Date().toISOString().slice(0, 10);
    var welcomeEl = document.getElementById('lw-ai-chat-welcome');
    if (welcomeEl) {
      var announceId = welcomeEl.getAttribute('data-announce-id');
      var announceEl = document.getElementById('lw-ai-chat-announce');
      var greetingAlreadyShown = localStorage.getItem('lw_ai_chat_shown_date') === today;
      var announceAlreadySeen = announceId && localStorage.getItem('lw_ai_chat_seen_announce_' + announceId) === '1';

      // お知らせを既に見た → お知らせエリアを非表示
      if (announceAlreadySeen && announceEl) {
        announceEl.style.display = 'none';
      }

      // 挨拶が未表示 OR 未読のお知らせがある → ウェルカム表示
      var shouldShow = !greetingAlreadyShown || (announceId && !announceAlreadySeen);

      if (shouldShow) {
        welcomeEl.classList.add('open');
        localStorage.setItem('lw_ai_chat_shown_date', today);
        if (announceId) {
          localStorage.setItem('lw_ai_chat_seen_announce_' + announceId, '1');
        }
      }

      // 閉じる処理
      function closeWelcome() {
        welcomeEl.classList.remove('open');
      }

      var welcomeCloseBtn = document.getElementById('lw-ai-chat-welcome-close');
      if (welcomeCloseBtn) {
        welcomeCloseBtn.addEventListener('click', closeWelcome);
      }
      welcomeEl.addEventListener('click', function(e) {
        if (e.target === welcomeEl) closeWelcome();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && welcomeEl.classList.contains('open')) closeWelcome();
      });
    }

    // ポップアップ開閉
    var triggerBtn = document.getElementById('lw-ai-chat-trigger');
    var closeBtn = document.getElementById('lw-ai-chat-close');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', function () {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        var msgs = document.getElementById('lw-ai-chat-messages');
        if (msgs) setTimeout(function() { /* scroll disabled */ }, 100);
        var input = document.getElementById('lw-ai-chat-input');
        if (input) setTimeout(function() { input.focus(); }, 300);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // オーバーレイクリックで閉じる
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // ポップアップ内のリンククリックで閉じる（別ページ遷移時）
    overlay.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (link && link.href && !link.href.startsWith('#') && !link.getAttribute('href').startsWith('#')) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    var consentEl = document.getElementById('lw-ai-chat-consent');
    var bodyEl = document.getElementById('lw-ai-chat-body');

    // 同意済みなら直接チャットを表示（クリーンな状態で開始）
    if (HAS_CONSENT) {
      if (consentEl) consentEl.style.display = 'none';
      if (bodyEl) bodyEl.style.display = 'block';

      // 毎回クリーンに開始（ウェルカムメッセージのみ）
      showWelcomeAlways();

      // 自前キーモードなら使用量+サイト設定を取得
      if (USE_OWN_KEY) {
        loadUsageStats();
        loadSiteSettings();
      }
    }

    // 同意ボタン
    var agreeBtn = document.getElementById('lw-ai-chat-consent-agree');
    if (agreeBtn) {
      agreeBtn.addEventListener('click', function () {
        agreeBtn.disabled = true;
        agreeBtn.textContent = '処理中...';

        fetch(CONSENT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': NONCE
          },
          body: JSON.stringify({ agreed: true })
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            HAS_CONSENT = true;
            if (consentEl) consentEl.style.display = 'none';
            if (bodyEl) bodyEl.style.display = 'block';
            var input = document.getElementById('lw-ai-chat-input');
            if (input) input.focus();
          }
        })
        .catch(function () {
          agreeBtn.disabled = false;
          agreeBtn.textContent = '同意して利用する';
        });
      });
    }

    // 「できること」ボタン
    var helpBtn = document.getElementById('lw-ai-chat-help');
    if (helpBtn) {
      helpBtn.addEventListener('click', function () {
        var msg = '**プライベートAIモードでできること：**\n\n'
          + '💬 **質問回答** — LiteWordの使い方をマニュアルに基づいて案内（無制限）\n'
          + '🔍 **設定確認** — 「今のメインカラーは？」「フォントは何？」など現在の設定を確認\n'
          + '🎨 **カラー変更** — メインカラー、アクセント、文字色、リンク色など\n'
          + '🔤 **フォント変更** — サイト全体/固定ページ/投稿ページのフォント・太さ・サイズ\n'
          + '📐 **レイアウト変更** — ヘッダー・フッターのパターン切替、カラム設定\n'
          + '📝 **投稿ページ設定** — 見出しデザイン、目次、パンくずリスト、日付表示\n'
          + '⚡ **拡張機能ON/OFF** — メールフォーム、SEO、アニメーション、コメント\n'
          + '📊 **Analytics設定** — Google Analytics ID、GTM ID\n'
          + '🔗 **カスタマイザー案内** — 設定ページへの直リンク付きで案内\n'
          + '🎤 **音声入力** — マイクで話しかけて質問\n\n'
          + '回答には **📖マニュアル** と **⚙️設定ページ** のリンクが付くから、すぐに確認・操作できるにゃ！\n\n'
          + '例えば「メインカラーを赤にして」「SEO機能をONにして」と話しかけてみてにゃ！';
        addMessage(msg, false);
        addToStorage(msg, false);
        /* scroll disabled */
      });
    }

    // プライバシーポリシーリンク
    var privacyLink = document.getElementById('lw-ai-chat-privacy-link');
    if (privacyLink) {
      privacyLink.addEventListener('click', function (e) {
        e.preventDefault();
        showPrivacyPopup();
      });
    }

    // 送信ボタン
    var sendBtn = document.getElementById('lw-ai-chat-send');
    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage);
    }

    // 音声入力ボタン（トグル式）
    var voiceBtn = document.getElementById('lw-ai-chat-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', toggleVoice);
    }

    // モード切り替えボタン（カード型 + 戻すリンク両方）
    var modeBtns = document.querySelectorAll('[data-mode]');
    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = this.dataset.mode;
        if (this.classList.contains('active')) return;

        this.style.opacity = '0.6';
        this.style.pointerEvents = 'none';

        fetch(MODE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': NONCE },
          body: JSON.stringify({ mode: mode })
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            location.reload();
          } else if (data.code) {
            alert(data.message || 'エラーが発生しました');
            btn.style.opacity = '';
            btn.style.pointerEvents = '';
          }
        })
        .catch(function () {
          btn.style.opacity = '';
          btn.style.pointerEvents = '';
        });
      });
    });

    // AIモデル切り替え
    var modelSelect = document.getElementById('lw-ai-chat-model-select');
    if (modelSelect) {
      modelSelect.addEventListener('change', function () {
        var model = this.value;
        fetch(lwAiChat.modelUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': NONCE },
          body: JSON.stringify({ model: model })
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            var label = model === 'pro' ? '🧠 Pro（高性能）' : '⚡ Flash（高速）';
            addMessage('AIモデルを **' + label + '** に切り替えたにゃ！', false);
            addToStorage('AIモデルを ' + label + ' に切り替えたにゃ！', false);
          }
        });
      });
    }

    // APIキー未設定時のガイドボタン
    var setupGuideBtn = document.getElementById('lw-ai-chat-setup-guide');
    if (setupGuideBtn) {
      setupGuideBtn.addEventListener('click', function () {
        var settingsUrl = lwAiChat.settingsUrl || '';
        var guide = '「自分のAI Studio」モードを使うには、Google AI StudioのAPIキーが必要にゃ！\n\n'
          + '設定はとっても簡単にゃ！3ステップで完了するにゃ：\n\n'
          + '**1.** Google AI Studio（aistudio.google.com）でAPIキーを取得\n'
          + '**2.** 下のリンクからLiteWordの設定ページを開く\n'
          + '**3.** APIキーを貼り付けて保存するだけ！\n\n'
          + '従量課金だけど、1回の質問で約0.1円〜だから月に数十円程度にゃ。回数無制限で使い放題になるにゃ！\n\n'
          + '👉 [設定ページを開く](' + settingsUrl + ')';
        addMessage(guide, false);
        addToStorage(guide, false);

        // チャットエリアにスクロール
        var msgs = document.getElementById('lw-ai-chat-messages');
        if (msgs) setTimeout(function() { /* scroll disabled */ }, 100);
      });
    }
  }

  var activeRec = null;
  var voiceStopping = false;
  var silenceTimer = null;

  function toggleVoice() {
    // 録音中 or 停止処理中ならストップ
    if (activeRec || voiceStopping) {
      stopVoice();
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('お使いのブラウザは音声入力に対応していません。Chrome/Edge/Safariをお使いください。');
      return;
    }

    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = new SR();
    rec.lang = 'ja-JP';
    rec.continuous = true;
    rec.interimResults = true;
    activeRec = rec;

    var btn = document.getElementById('lw-ai-chat-voice');
    var input = document.getElementById('lw-ai-chat-input');
    btn.classList.add('recording');
    input.placeholder = '聞いてます... （マイクボタンで停止）';

    // 4秒無音タイマー開始
    resetSilenceTimer();

    rec.onresult = function (e) {
      // 音声が来たらタイマーリセット
      resetSilenceTimer();
      var t = '';
      for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      input.value = t;
    };

    rec.onend = function () {
      // continuous=trueでも自動停止する場合がある
      // ユーザーが停止していない場合は再開を試みる
      if (!voiceStopping && activeRec) {
        try { rec.start(); return; } catch(e) { /* fall through */ }
      }
      cleanupVoice();
    };

    rec.onerror = function () {
      cleanupVoice();
    };

    rec.start();
  }

  function stopVoice() {
    voiceStopping = true;
    if (activeRec) {
      activeRec.stop();
    }
    cleanupVoice();
  }

  function cleanupVoice() {
    activeRec = null;
    voiceStopping = false;
    if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
    var btn = document.getElementById('lw-ai-chat-voice');
    var input = document.getElementById('lw-ai-chat-input');
    if (btn) btn.classList.remove('recording');
    if (input) input.placeholder = '例: ロゴの変え方は？ヘッダーを消したい';
  }

  function resetSilenceTimer() {
    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(function () {
      // 4秒無音 → 自動停止
      stopVoice();
    }, 4000);
  }

  /**
   * 会話をlocalStorageに保存（最新30件）
   */
  function saveMessages() {
    try {
      var stored = JSON.parse(localStorage.getItem('lw_ai_chat_messages') || '[]');
      // historyから最新の会話を追加（重複防止のため全上書き）
      localStorage.setItem('lw_ai_chat_messages', JSON.stringify(stored.slice(-30)));
    } catch (e) { /* ignore */ }
  }

  function addToStorage(text, isUser) {
    try {
      var stored = JSON.parse(localStorage.getItem('lw_ai_chat_messages') || '[]');
      stored.push({ text: text, isUser: isUser, time: Date.now() });
      if (stored.length > 30) stored = stored.slice(-30);
      localStorage.setItem('lw_ai_chat_messages', JSON.stringify(stored));
    } catch (e) { /* ignore */ }
  }

  /**
   * localStorageから会話を復元
   */
  function restoreMessages() {
    try {
      var stored = JSON.parse(localStorage.getItem('lw_ai_chat_messages') || '[]');
      if (!stored.length) return false;

      // 日付ラベル用
      var lastDate = '';
      stored.forEach(function (item) {
        if (item.time) {
          var d = new Date(item.time);
          var dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
          if (dateStr !== lastDate) {
            lastDate = dateStr;
            addDateLabel(dateStr);
          }
        }
        addMessage(item.text, item.isUser);
      });

      // API送信用の履歴も復元
      stored.forEach(function (item) {
        if (item.isUser) {
          history.push({ question: item.text, answer: '' });
        } else if (history.length > 0 && !history[history.length - 1].answer) {
          history[history.length - 1].answer = item.text;
        }
      });
      if (history.length > 10) history = history.slice(-10);
      return true;
    } catch (e) { return false; }
  }

  function showWelcomeIfNeeded() {
    var todayGreet = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('lw_ai_chat_greeted_date') !== todayGreet) {
      localStorage.setItem('lw_ai_chat_greeted_date', todayGreet);
      var name = lwAiChat.userName || '';
      var greeting = name + 'さん、お帰り！今日も頑張ろうね！\nLiteWordのことで分からないことがあったら何でも聞いてね！';
      addMessage(greeting, false);
      addToStorage(greeting, false);
    }
    var msgs = document.getElementById('lw-ai-chat-messages');
    /* scroll disabled */
  }

  function showWelcomeAlways() {
    var name = lwAiChat.userName || '';
    var stored = [];
    try { stored = JSON.parse(localStorage.getItem('lw_ai_chat_messages') || '[]'); } catch(e) {}
    var greeting = stored.length > 0
      ? name + 'さん、何でも聞いてにゃ！\n前の会話は右の「履歴を見る」から確認できるにゃ！'
      : name + 'さん、何でも聞いてにゃ！';
    addMessage(greeting, false);

    // カテゴリはキーワードで自動判定（ボタンなし）
    var msgs = document.getElementById('lw-ai-chat-messages');
    /* scroll disabled */
  }

  // 履歴表示（ボタンから呼ばれる）
  window.lwAiChatShowHistory = function() {
    var msgs = document.getElementById('lw-ai-chat-messages');
    if (!msgs) return;
    var btn = document.getElementById('lw-ai-chat-history-btn');

    // 既に履歴表示中なら閉じる
    if (btn && btn.dataset.showing === '1') {
      msgs.innerHTML = '';
      showWelcomeAlways();
      btn.dataset.showing = '0';
      btn.textContent = '履歴を見る';
      return;
    }

    msgs.innerHTML = '';

    // localStorageから日付別に整理
    try {
      var stored = JSON.parse(localStorage.getItem('lw_ai_chat_messages') || '[]');
      if (!stored.length) {
        addMessage('まだ会話履歴がないにゃ！', false);
        if (btn) { btn.dataset.showing = '1'; btn.textContent = '新しい会話に戻る'; }
        return;
      }

      // 日付ごとにグループ化
      var groups = {};
      stored.forEach(function(item) {
        var dateStr = '不明';
        if (item.time) {
          var d = new Date(item.time);
          dateStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        }
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(item);
      });

      // 日付を新しい順にソート
      var dates = Object.keys(groups).sort().reverse();
      var todayStr = new Date().toISOString().slice(0,10);
      var yesterdayD = new Date(); yesterdayD.setDate(yesterdayD.getDate()-1);
      var yesterdayStr = yesterdayD.toISOString().slice(0,10);

      // 日付タブを作成
      var tabWrap = document.createElement('div');
      tabWrap.className = 'lw-ai-history-tabs';
      dates.forEach(function(dateKey, i) {
        var label = dateKey;
        if (dateKey === todayStr) label = '今日';
        else if (dateKey === yesterdayStr) label = '昨日';
        var tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'lw-ai-history-tab' + (i === 0 ? ' active' : '');
        tab.textContent = label;
        tab.dataset.date = dateKey;
        tab.addEventListener('click', function() {
          // タブ切替
          tabWrap.querySelectorAll('.lw-ai-history-tab').forEach(function(t){ t.classList.remove('active'); });
          tab.classList.add('active');
          showHistoryDate(dateKey, groups[dateKey]);
        });
        tabWrap.appendChild(tab);
      });
      msgs.appendChild(tabWrap);

      // 最新日付の会話を表示
      showHistoryDate(dates[0], groups[dates[0]]);

    } catch(e) {
      addMessage('履歴の読み込みに失敗しました', false);
    }

    if (btn) {
      btn.dataset.showing = '1';
      btn.textContent = '新しい会話に戻る';
    }
  };

  function showHistoryDate(dateKey, items) {
    var msgs = document.getElementById('lw-ai-chat-messages');
    if (!msgs) return;
    // タブは残して、会話部分だけクリア
    var existing = msgs.querySelectorAll('.lw-ai-history-item');
    existing.forEach(function(el) { el.remove(); });

    var wrap = document.createElement('div');
    wrap.className = 'lw-ai-history-item';

    items.forEach(function(item) {
      var row = document.createElement('div');
      row.className = 'lw-ai-msg-row' + (item.isUser ? ' lw-ai-msg-row-user' : ' lw-ai-msg-row-ai');
      if (!item.isUser) {
        var av = document.createElement('img');
        av.src = lwAiChat.avatarUrl;
        av.className = 'lw-ai-msg-avatar';
        row.appendChild(av);
      }
      var bubble = document.createElement('div');
      bubble.className = 'lw-ai-msg ' + (item.isUser ? 'lw-ai-msg-user' : 'lw-ai-msg-ai');
      bubble.innerHTML = (item.text || '').replace(/\n/g, '<br>');
      row.appendChild(bubble);
      wrap.appendChild(row);
    });

    msgs.appendChild(wrap);
  }

  function loadUsageStats() {
    var el = document.getElementById('lw-ai-chat-usage-text');
    if (!el || !lwAiChat.usageUrl) return;

    fetch(lwAiChat.usageUrl, {
      headers: { 'X-WP-Nonce': NONCE }
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.success || !data.stats) {
        el.textContent = '使用量データを取得できませんでした';
        return;
      }
      var today = data.stats.today || {};
      var month = data.stats.month || {};
      var todayCost = parseFloat(today.total_cost_jpy) || 0;
      var monthCost = parseFloat(month.total_cost_jpy) || 0;
      var todayReq = today.request_count || 0;
      var monthReq = month.request_count || 0;

      el.innerHTML =
        '⚡ 推定<br>' +
        '今日 ' + todayReq + '回 (約' + Math.round(todayCost) + '円)<br>' +
        '今月 ' + monthReq + '回 (約' + Math.round(monthCost) + '円)<br>' +
        '<a href="https://aistudio.google.com/spend" target="_blank" rel="noopener" class="lw-ai-chat-usage-link">実際の使用量を確認</a>';
    })
    .catch(function () {
      el.textContent = '';
    });
  }

  function loadSiteSettings() {
    if (!lwAiChat.settingsApiUrl) return;
    fetch(lwAiChat.settingsApiUrl, {
      headers: { 'X-WP-Nonce': NONCE }
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      cachedSiteSettings = data;
    })
    .catch(function () { /* ignore */ });
  }

  function loadHistory(callback) {
    console.log('[LW AI Chat] 履歴取得開始:', HISTORY_URL);
    fetch(HISTORY_URL + '?limit=10', {
      headers: { 'X-WP-Nonce': NONCE }
    })
    .then(function (r) {
      console.log('[LW AI Chat] 履歴レスポンス:', r.status);
      return r.json();
    })
    .then(function (data) {
      console.log('[LW AI Chat] 履歴データ:', data);
      if (data.history && data.history.length) {
        // 日付区切り付きで過去の会話を表示
        var lastDate = '';
        data.history.forEach(function (item) {
          var date = item.created_at ? item.created_at.substring(0, 10) : '';
          if (date && date !== lastDate) {
            lastDate = date;
            addDateLabel(date);
          }

          addMessage(item.question, true);
          addMessage(item.answer, false);
          history.push({ question: item.question, answer: item.answer });
        });

        if (history.length > 5) {
          history = history.slice(-5);
        }
      }

      // ウェルカムメッセージ
      if (callback) callback();

      // 最下部にスクロール
      var msgs = document.getElementById('lw-ai-chat-messages');
      /* scroll disabled */
    })
    .catch(function (err) {
      console.error('[LW AI Chat] 履歴取得エラー:', err);
      if (callback) callback();
    });
  }

  function addDateLabel(dateStr) {
    var msgs = document.getElementById('lw-ai-chat-messages');
    if (!msgs) return;
    var label = document.createElement('div');
    label.className = 'lw-ai-date-label';
    label.textContent = dateStr;
    msgs.appendChild(label);
  }

  function escapeHtml(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  function addMessage(text, isUser) {
    var msgs = document.getElementById('lw-ai-chat-messages');
    if (!msgs) return;

    var row = document.createElement('div');
    row.className = 'lw-ai-msg-row ' + (isUser ? 'lw-ai-msg-row-user' : 'lw-ai-msg-row-ai');

    var html = '';
    if (!isUser) {
      html += '<img src="' + AVATAR_URL + '" alt="" class="lw-ai-msg-avatar">';
    }
    html += '<div class="lw-ai-msg ' + (isUser ? 'lw-ai-msg-user' : 'lw-ai-msg-ai') + '">';

    if (isUser) {
      html += escapeHtml(text);
    } else {
      var c = text;
      c = c.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      c = c.replace(/\[(.+?)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      c = c.replace(/\[(.+?)\]\((\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      c = c.replace(/^(\d+)\.\s/gm, '<br>$1. ');
      c = c.replace(/^[\-\*]\s/gm, '<br>• ');
      c = c.replace(/\n/g, '<br>');
      c = c.replace(/(?<!")(?<!')(https?:\/\/[^\s<,)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
      html += c;
    }

    html += '</div>';
    row.innerHTML = html;
    msgs.appendChild(row);

    if (isUser) {
      // ユーザーメッセージ → 一番下に
      /* scroll disabled */
    } else {
      // AI回答 → 回答の先頭が見えるようにスクロール
      /* scroll disabled */
    }
    return row;
  }

  function addLoading() {
    var msgs = document.getElementById('lw-ai-chat-messages');
    if (!msgs) return null;

    var row = document.createElement('div');
    row.className = 'lw-ai-msg-row lw-ai-msg-row-ai';
    row.innerHTML =
      '<img src="' + AVATAR_URL + '" alt="" class="lw-ai-msg-avatar thinking">' +
      '<div class="lw-ai-msg lw-ai-msg-ai"><span class="lw-ai-dots"><span></span><span></span><span></span></span></div>';
    msgs.appendChild(row);
    /* scroll disabled */
    return row;
  }

  function sendMessage() {
    if (isLoading || cooldownTimer) return;

    // 録音中なら停止
    if (activeRec) stopVoice();

    var input = document.getElementById('lw-ai-chat-input');
    if (!input) return;

    var question = input.value.trim();
    if (!question) return;

    // 挨拶・雑談はローカル応答（API不要、カウント消費なし）
    var localReply = getLocalReply(question);
    if (localReply) {
      input.value = '';
      addMessage(question, true);
      addToStorage(question, true);
      var replyRow = addMessage(localReply, false);
      addToStorage(localReply, false);
      showNewReplyIndicator(replyRow);
      return;
    }

    // 公式モードの回数チェック
    if (!USE_OWN_KEY && getDailyUsed() >= DAILY_LIMIT) {
      var limitMsg = '今日の無料枠（' + DAILY_LIMIT + '回）を使い切ったにゃ！\nまた明日来てにゃ〜！\n\n';
      if (lwAiChat.isPremium && HAS_OWN_KEY) {
        limitMsg += '下のパワーモードに切り替えると無制限で使えるにゃ！';
      } else if (lwAiChat.isPremium) {
        limitMsg += 'APIキー（AIのコンセントのようなもの）を設定するとパワーモード（無制限）が使えるにゃ！';
      } else {
        limitMsg += 'プレミアムプランなら1日15回・月150回まで質問できるにゃ！\nhttps://lite-word.com/premium/';
      }
      addMessage(limitMsg, false);
      return;
    }

    var honeypot = '';
    var hpField = document.querySelector('#lw-ai-chat-overlay .lw-ai-chat-honeypot');
    if (hpField) honeypot = hpField.value;

    input.value = '';
    addMessage(question, true);
    addToStorage(question, true);
    isLoading = true;

    var sendBtn = document.getElementById('lw-ai-chat-send');
    var voiceBtn = document.getElementById('lw-ai-chat-voice');
    if (sendBtn) sendBtn.disabled = true;
    if (voiceBtn) voiceBtn.disabled = true;

    var loadingEl = addLoading();

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': NONCE
      },
      body: JSON.stringify({
        question: question,
        history: history,
        website: honeypot,
        site_settings: USE_OWN_KEY ? cachedSiteSettings : null,
        category: detectCategory(question)
      })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (loadingEl) loadingEl.remove();

      if (data.code) {
        var errMsg = data.message || 'エラーが発生しました。もう一度お試しください。';
        // フォールバック通知（APIキー無効等でモードがリセットされた場合）
        if (data.data && data.data.fallback) {
          errMsg += '\nページを再読み込みすると公式サーバーモードに切り替わります。';
          USE_OWN_KEY = false;
        }
        addMessage(errMsg, false);
        return;
      }

      var answer = data.answer || 'エラーが発生しました。';
      var answerRow = addMessage(answer, false);
      addToStorage(answer, false);
      // 新着インジケーター表示
      showNewReplyIndicator(answerRow);
      // 「回答できない」系はカウントしない
      var noCount = answer.indexOf('お答えできる情報がない') !== -1 || answer.indexOf('システム担当に報告') !== -1;
      if (!USE_OWN_KEY && !noCount) incrementDailyUsed();
      history.push({ question: question, answer: answer });
      if (history.length > 10) history.shift();

      // ★ Phase 2: ページ生成アクションの処理
      if (data.action && data.action.type === 'generate_page') {
        handleGeneratePageAction(data.action);
      }
    })
    .catch(function () {
      if (loadingEl) loadingEl.remove();
      addMessage('通信エラーが発生しました。ページを再読み込みしてお試しください。', false);
    })
    .finally(function () {
      isLoading = false;
      if (USE_OWN_KEY) {
        // 自前キーモード: クールダウンなし + 使用量更新
        if (sendBtn) sendBtn.disabled = false;
        if (voiceBtn) voiceBtn.disabled = false;
        loadUsageStats();
        if (input) input.focus();
      } else {
        startCooldown();
      }
    });
  }

  function startCooldown() {
    var remaining = COOLDOWN_SEC;
    var sendBtn = document.getElementById('lw-ai-chat-send');
    var voiceBtn = document.getElementById('lw-ai-chat-voice');
    var input = document.getElementById('lw-ai-chat-input');

    if (sendBtn) sendBtn.disabled = true;
    if (voiceBtn) voiceBtn.disabled = true;
    if (input) input.placeholder = '次の質問まで ' + remaining + ' 秒...';

    cooldownTimer = setInterval(function () {
      remaining--;
      if (input) input.placeholder = '次の質問まで ' + remaining + ' 秒...';

      if (remaining <= 0) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
        if (sendBtn) sendBtn.disabled = false;
        if (voiceBtn) voiceBtn.disabled = false;
        if (input) {
          input.placeholder = '例: ロゴの変え方は？ヘッダーを消したい';
          input.focus();
        }
      }
    }, 1000);
  }

  function showPrivacyPopup() {
    var existing = document.getElementById('lw-ai-chat-privacy-popup');
    if (existing) { existing.remove(); return; }

    var ov = document.createElement('div');
    ov.id = 'lw-ai-chat-privacy-popup';
    ov.innerHTML =
      '<div class="lw-ai-privacy-content">' +
        '<div style="text-align:center;margin-bottom:12px;"><img src="' + AVATAR_URL + '" alt="" style="width:48px;height:48px;"></div>' +
        '<h3>プライバシーポリシー</h3>' +
        '<h4>1. 収集する情報</h4>' +
        '<p>質問テキスト、AIの回答テキスト、質問日時を収集します。氏名・メールアドレス等の個人情報は収集しません。</p>' +
        '<h4>2. 利用目的</h4>' +
        '<ul><li>AIの回答品質向上</li><li>マニュアルの改善（よく聞かれる質問の特定）</li><li>LiteWordのサービス改善</li></ul>' +
        '<h4>3. 第三者提供</h4>' +
        '<p>質問データを第三者に提供・販売しません。AI回答生成のためにGoogle Gemini APIに送信されます。</p>' +
        '<h4>4. データの送信先</h4>' +
        '<p>質問内容は lite-word.com のサーバーに送信され、処理されます。</p>' +
        '<h4>5. お問い合わせ</h4>' +
        '<p><a href="https://lite-word.com/cf/" target="_blank" rel="noopener" style="color:#6366f1;">お問い合わせフォームはこちら</a></p>' +
        '<button class="lw-ai-privacy-close" id="lw-ai-privacy-close-btn">閉じる</button>' +
      '</div>';
    document.body.appendChild(ov);

    document.getElementById('lw-ai-privacy-close-btn').addEventListener('click', function () { ov.remove(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
  }

  // ★ Phase 2: ページ生成アクション実行
  function handleGeneratePageAction(action) {
    // 生成開始ボタンをDOMで直接追加
    var msgs = document.getElementById('lw-ai-chat-messages');
    if (!msgs) return;

    var row = document.createElement('div');
    row.className = 'lw-ai-msg-row lw-ai-msg-row-ai';

    var btnDiv = document.createElement('div');
    btnDiv.style.cssText = 'display:flex;gap:8px;padding:4px 0 4px 44px;';

    var startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.textContent = '生成を開始する';
    startBtn.style.cssText = 'background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;';

    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'キャンセル';
    cancelBtn.style.cssText = 'background:#e5e7eb;color:#374151;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;';

    startBtn.addEventListener('click', function() {
      row.remove();
      executePageGeneration(action);
    });

    cancelBtn.addEventListener('click', function() {
      row.remove();
      addMessage('ページ生成をキャンセルしたにゃ。また作りたくなったら言ってにゃ！', false);
    });

    btnDiv.appendChild(startBtn);
    btnDiv.appendChild(cancelBtn);
    row.appendChild(btnDiv);
    msgs.appendChild(row);
    /* scroll disabled */
  }

  function executePageGeneration(action) {
    addMessage('⏳ ページ生成を開始するにゃ... 1〜3分かかるにゃ', false);
    var loadingEl = addLoading();

    var generateUrl = lwAiChat.generatePageUrl || (lwAiChat.apiUrl.replace('/ai-chat', '').replace('liteword/v1', 'lw-ai-generator/v1') + '/generate-page');

    fetch(generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': NONCE
      },
      body: JSON.stringify({
        prompt: action.prompt,
        pageType: action.pageType,
        businessType: action.businessType,
        imageSource: action.imageSource || 'none'
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (loadingEl) loadingEl.remove();

      if (data.success) {
        var msg = '🎉 **ページ生成完了！**\n\n';
        msg += '- セクション: **' + data.completedSections + '/' + data.totalSections + '** 完了';
        if (data.failedSections > 0) {
          msg += ' (' + data.failedSections + '件失敗)';
        }
        msg += '\n- ページID: ' + data.postId + '\n\n';
        msg += '[📝 下書きを編集する](' + data.editUrl + ')\n';
        msg += '[👁 プレビューを見る](' + data.previewUrl + ')\n\n';
        msg += '編集画面で内容を確認して、公開してにゃ！';
        addMessage(msg, false);
      } else {
        var errMsg = '❌ 生成中にエラーが発生したにゃ...\n';
        errMsg += 'ステップ: ' + (data.step || '不明') + '\n';
        errMsg += 'エラー: ' + (data.message || '原因不明');
        if (data.progress && data.progress.length > 0) {
          errMsg += '\n\n**進捗:**\n' + data.progress.join('\n');
        }
        addMessage(errMsg, false);
      }
    })
    .catch(function(err) {
      if (loadingEl) loadingEl.remove();
      addMessage('❌ 通信エラーが発生したにゃ。再度お試しくださいにゃ。', false);
    });
  }

  // グローバル公開（設定ページなど外部から呼べるように）
  window.lwAiChatAddMessage = addMessage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
