/**
 * LiteWord Voice Guide - 音声読み上げ機能
 */
(function() {
    'use strict';

    console.log('LW Voice Guide: Loading...');

    // Web Speech API サポートチェック
    if (!('speechSynthesis' in window)) {
        console.log('LW Voice Guide: Speech API not supported');
        return;
    }

    // 状態管理
    var currentButton = null;
    var isPlaying = false;
    var isStopping = false;
    var currentRate = 1.0;
    var japaneseVoice = null;
    var voicesLoaded = false;

    // 速度オプション
    var speedOptions = [
        { value: 0.5, label: '0.5x' },
        { value: 0.7, label: '0.7x' },
        { value: 0.8, label: '0.8x' },
        { value: 1.0, label: '1.0x' },
        { value: 1.2, label: '1.2x' },
        { value: 1.5, label: '1.5x' },
        { value: 2.0, label: '2.0x' }
    ];

    /**
     * 日本語音声を取得
     */
    function loadVoices() {
        var voices = speechSynthesis.getVoices();
        console.log('LW Voice Guide: Found ' + voices.length + ' voices');

        if (voices.length === 0) {
            return false;
        }

        // 日本語音声を探す
        var priorities = [
            'Google 日本語',
            'Microsoft Haruka',
            'Microsoft Ayumi',
            'Kyoko',
            'Otoya'
        ];

        for (var i = 0; i < priorities.length; i++) {
            for (var j = 0; j < voices.length; j++) {
                if (voices[j].name.indexOf(priorities[i]) !== -1) {
                    japaneseVoice = voices[j];
                    console.log('LW Voice Guide: Selected voice - ' + japaneseVoice.name);
                    return true;
                }
            }
        }

        // 優先リストになければja-JPを探す
        for (var k = 0; k < voices.length; k++) {
            if (voices[k].lang === 'ja-JP' || voices[k].lang.indexOf('ja') === 0) {
                japaneseVoice = voices[k];
                console.log('LW Voice Guide: Selected voice - ' + japaneseVoice.name);
                return true;
            }
        }

        console.log('LW Voice Guide: No Japanese voice found, using default');
        return true;
    }

    /**
     * 音声を停止
     */
    function stopSpeech() {
        console.log('LW Voice Guide: Stopping...');
        isStopping = true;
        isPlaying = false;
        speechSynthesis.cancel();

        // 分割読み上げのキューをクリア
        speechQueue = [];
        currentQueueIndex = 0;

        if (currentButton) {
            currentButton.classList.remove('playing');
            var icon = currentButton.querySelector('.lw-voice-icon');
            var label = currentButton.querySelector('.lw-voice-label');
            if (icon) icon.innerHTML = '\u{1F50A}';
            if (label) label.textContent = 'Read';
            currentButton = null;
        }

        setTimeout(function() {
            isStopping = false;
        }, 300);
    }

    // 分割読み上げ用の状態
    var speechQueue = [];
    var currentQueueIndex = 0;

    /**
     * テキストを読み上げ
     */
    function speak(text, button) {
        console.log('LW Voice Guide: speak() called');
        console.log('LW Voice Guide: isPlaying=' + isPlaying + ', isStopping=' + isStopping);

        if (isStopping) {
            console.log('LW Voice Guide: Currently stopping, ignoring');
            return;
        }

        if (isPlaying) {
            stopSpeech();
            return;
        }

        // 速度を取得
        var speedSelect = document.querySelector('.lw-voice-speed-select');
        if (speedSelect) {
            currentRate = parseFloat(speedSelect.value);
        }

        console.log('LW Voice Guide: Speaking at rate ' + currentRate);
        console.log('LW Voice Guide: Text length = ' + text.length);

        // 前の発話をクリア
        speechSynthesis.cancel();

        // 長いテキストは分割（句点で分割、200文字以下のチャンクに）
        speechQueue = splitTextForSpeech(text);
        currentQueueIndex = 0;

        console.log('LW Voice Guide: Split into ' + speechQueue.length + ' chunks');

        currentButton = button;
        isPlaying = true;

        // ボタン状態を更新
        button.classList.add('playing');
        var icon = button.querySelector('.lw-voice-icon');
        var label = button.querySelector('.lw-voice-label');
        if (icon) icon.innerHTML = '\u{23F9}';
        if (label) label.textContent = 'Stop';

        // 最初のチャンクを読み上げ開始
        speakNextChunk();
    }

    /**
     * テキストを分割
     */
    function splitTextForSpeech(text) {
        var chunks = [];

        // まず | で分割（PHPから渡された区切り）
        if (text.indexOf('|') !== -1) {
            var parts = text.split('|');
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].trim();
                if (part) {
                    chunks.push(part);
                }
            }
        } else {
            // | がない場合は句点で分割
            var sentences = text.split('。');
            var currentChunk = '';
            var maxLength = 100;

            for (var j = 0; j < sentences.length; j++) {
                var sentence = sentences[j].trim();
                if (!sentence) continue;
                sentence += '。';

                if (currentChunk.length + sentence.length > maxLength) {
                    if (currentChunk) {
                        chunks.push(currentChunk.trim());
                    }
                    currentChunk = sentence;
                } else {
                    currentChunk += sentence;
                }
            }

            if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
            }
        }

        // チャンクがない場合は元のテキストをそのまま
        if (chunks.length === 0) {
            chunks.push(text);
        }

        console.log('LW Voice Guide: Chunks created:', chunks.length, chunks);

        return chunks;
    }

    /**
     * 次のチャンクを読み上げ
     */
    function speakNextChunk() {
        if (!isPlaying || isStopping || currentQueueIndex >= speechQueue.length) {
            // 完了
            finishSpeaking();
            return;
        }

        var chunk = speechQueue[currentQueueIndex];
        console.log('LW Voice Guide: Speaking chunk ' + (currentQueueIndex + 1) + '/' + speechQueue.length);

        var utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = 'ja-JP';
        utterance.rate = currentRate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        if (japaneseVoice) {
            utterance.voice = japaneseVoice;
        }

        utterance.onend = function() {
            console.log('LW Voice Guide: Chunk ' + (currentQueueIndex + 1) + ' finished');
            currentQueueIndex++;
            // 次のチャンクへ
            if (isPlaying && !isStopping) {
                speakNextChunk();
            }
        };

        utterance.onerror = function(e) {
            console.log('LW Voice Guide: Error - ' + e.error);
            // エラーでも次へ進む
            currentQueueIndex++;
            if (isPlaying && !isStopping) {
                speakNextChunk();
            }
        };

        speechSynthesis.speak(utterance);
    }

    /**
     * 読み上げ完了処理
     */
    function finishSpeaking() {
        console.log('LW Voice Guide: Finished all chunks');
        isPlaying = false;
        isStopping = false;
        speechQueue = [];
        currentQueueIndex = 0;

        if (currentButton) {
            currentButton.classList.remove('playing');
            var icon = currentButton.querySelector('.lw-voice-icon');
            var label = currentButton.querySelector('.lw-voice-label');
            if (icon) icon.innerHTML = '\u{1F50A}';
            if (label) label.textContent = 'Read';
            currentButton = null;
        }
    }

    /**
     * 速度コントロールを作成
     */
    function createSpeedControl() {
        var container = document.createElement('div');
        container.className = 'lw-voice-speed-control';

        var label = document.createElement('label');
        label.className = 'lw-voice-speed-label';
        label.textContent = '🎚 速度';

        var select = document.createElement('select');
        select.className = 'lw-voice-speed-select';

        for (var i = 0; i < speedOptions.length; i++) {
            var option = document.createElement('option');
            option.value = speedOptions[i].value;
            option.textContent = speedOptions[i].label;
            if (speedOptions[i].value === currentRate) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        select.onchange = function() {
            currentRate = parseFloat(this.value);
            console.log('LW Voice Guide: Speed changed to ' + currentRate);
            try {
                localStorage.setItem('lw_voice_speed', currentRate);
            } catch (e) {}
        };

        container.appendChild(label);
        container.appendChild(select);
        return container;
    }

    /**
     * HTMLからテキストを抽出し、brタグをポーズ用の句点に変換
     */
    function extractTextWithPauses(element) {
        // HTMLを取得
        var html = element.innerHTML;

        // brタグを句点+スペースに置換（音声合成で自然なポーズが入る）
        html = html.replace(/<br\s*\/?>/gi, '。 ');

        // pタグの終了を句点に
        html = html.replace(/<\/p>/gi, '。 ');

        // liタグの終了を句点に
        html = html.replace(/<\/li>/gi, '。 ');

        // その他のHTMLタグを削除
        html = html.replace(/<[^>]+>/g, ' ');

        // HTMLエンティティをデコード
        var textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        var text = textarea.value;

        // 連続する句点を整理
        text = text.replace(/。+/g, '。');

        // 句点の後のスペースを整理
        text = text.replace(/。\s+/g, '。 ');

        // 文頭の句点を削除
        text = text.replace(/^\s*。\s*/, '');

        return text;
    }

    /**
     * ボタンにクリックイベントを設定
     */
    function setupButton(button) {
        if (button.getAttribute('data-voice-init')) {
            return;
        }
        button.setAttribute('data-voice-init', 'true');

        var targetId = button.getAttribute('data-voice-target');
        console.log('LW Voice Guide: Setting up button for target: ' + targetId);

        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('LW Voice Guide: Button clicked! Target: ' + this.getAttribute('data-voice-target'));

            if (isStopping) {
                console.log('LW Voice Guide: Stopping in progress, ignoring click');
                return;
            }

            if (isPlaying) {
                console.log('LW Voice Guide: Already playing, stopping');
                stopSpeech();
                return;
            }

            // テキストを取得
            var targetId = this.getAttribute('data-voice-target');
            var text = '';

            if (targetId) {
                var target = document.getElementById(targetId);
                if (target) {
                    // HTMLを取得してbrタグを処理
                    text = extractTextWithPauses(target);
                }
            } else {
                text = this.getAttribute('data-voice-text') || '';
            }

            console.log('LW Voice Guide: Target ID = ' + targetId);
            console.log('LW Voice Guide: Text found = ' + (text.length > 0 ? 'Yes (' + text.length + ' chars)' : 'No'));

            if (text) {
                // テキスト整形（複数スペースを1つに）
                text = text.replace(/  +/g, ' ').trim();
                speak(text, this);
            } else {
                console.log('LW Voice Guide: No text to speak');
            }
        };
    }

    /**
     * 初期化
     */
    function init() {
        console.log('LW Voice Guide: Initializing...');

        // 音声を読み込み
        if (!loadVoices()) {
            // 音声がまだ読み込まれていない場合
            speechSynthesis.onvoiceschanged = function() {
                console.log('LW Voice Guide: Voices changed event fired');
                loadVoices();
                speechSynthesis.onvoiceschanged = null;
            };
        }

        // 保存された速度を読み込み
        try {
            var savedSpeed = localStorage.getItem('lw_voice_speed');
            if (savedSpeed) {
                currentRate = parseFloat(savedSpeed);
                console.log('LW Voice Guide: Loaded saved speed - ' + currentRate);
            }
        } catch (e) {}

        // 既存の速度セレクトボックスに保存された値を適用
        var speedSelects = document.querySelectorAll('.lw-voice-speed-select');
        console.log('LW Voice Guide: Found ' + speedSelects.length + ' speed selects');

        for (var i = 0; i < speedSelects.length; i++) {
            speedSelects[i].value = currentRate;
            speedSelects[i].onchange = function() {
                currentRate = parseFloat(this.value);
                console.log('LW Voice Guide: Speed changed to ' + currentRate);
                try {
                    localStorage.setItem('lw_voice_speed', currentRate);
                } catch (e) {}
                // 他のセレクトも同期
                var allSelects = document.querySelectorAll('.lw-voice-speed-select');
                for (var j = 0; j < allSelects.length; j++) {
                    allSelects[j].value = currentRate;
                }
            };
        }

        // 音声ボタンを設定
        var buttons = document.querySelectorAll('.lw-voice-btn');
        console.log('LW Voice Guide: Found ' + buttons.length + ' voice buttons');

        for (var j = 0; j < buttons.length; j++) {
            setupButton(buttons[j]);
        }

        // ヘルプボタンも設定
        var helpButtons = document.querySelectorAll('.lw-voice-help-btn');
        console.log('LW Voice Guide: Found ' + helpButtons.length + ' help buttons');

        for (var k = 0; k < helpButtons.length; k++) {
            setupButton(helpButtons[k]);
        }

        console.log('LW Voice Guide: Initialization complete');
    }

    // ページ離脱時に停止
    window.onbeforeunload = function() {
        speechSynthesis.cancel();
    };

    // DOM読み込み完了後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // グローバルAPI
    window.LWVoiceGuide = {
        speak: speak,
        stop: stopSpeech,
        setSpeed: function(rate) {
            currentRate = rate;
            var selects = document.querySelectorAll('.lw-voice-speed-select');
            for (var i = 0; i < selects.length; i++) {
                selects[i].value = rate;
            }
        },
        getSpeed: function() { return currentRate; },
        listVoices: function() {
            var voices = speechSynthesis.getVoices();
            for (var i = 0; i < voices.length; i++) {
                console.log(voices[i].name + ' (' + voices[i].lang + ')');
            }
        },
        test: function() {
            speak('これはテストです。音声読み上げが正常に動作しています。', null);
        }
    };

    console.log('LW Voice Guide: Script loaded. Use LWVoiceGuide.test() to test.');

})();
