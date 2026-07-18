/**
 * LiteWord AI Generator - API設定ページスクリプト
 */
(function($) {
    'use strict';

    var LwAiSettings = {
        /**
         * 初期化
         */
        init: function() {
            this.bindEvents();
        },

        /**
         * イベントをバインド
         */
        bindEvents: function() {
            // API設定
            $('#lw-ai-save-btn').on('click', this.handleSave.bind(this));
            $('#lw-ai-reset-btn').on('click', this.handleReset.bind(this));
            $('#lw-ai-test-btn').on('click', this.handleTest.bind(this));

            // 利用規約同意
            $('.lw-ai-terms-checkbox input').on('change', this.handleTermsCheckbox.bind(this));
            $('#lw-ai-agree-btn').on('click', this.handleAgreeTerms.bind(this));
        },

        /**
         * 利用規約チェックボックス変更
         */
        handleTermsCheckbox: function() {
            var $checkboxes = $('.lw-ai-terms-checkbox input');
            var allChecked = $checkboxes.length === $checkboxes.filter(':checked').length;

            $('#lw-ai-agree-btn').prop('disabled', !allChecked);
        },

        /**
         * 利用規約に同意
         */
        handleAgreeTerms: function(e) {
            e.preventDefault();

            var $btn = $('#lw-ai-agree-btn');
            var agreedItems = [];

            $('.lw-ai-terms-checkbox input:checked').each(function() {
                agreedItems.push($(this).val());
            });

            if (agreedItems.length < 3) {
                alert('すべての項目に同意してください');
                return;
            }

            // ローディング表示
            $btn.prop('disabled', true);
            $btn.find('.lw-ai-btn-text').hide();
            $btn.find('.lw-ai-btn-loading').show();

            $.ajax({
                url: lwAiAdminSettings.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_ai_agree_terms',
                    nonce: lwAiAdminSettings.nonce,
                    agreed_items: agreedItems
                },
                success: function(response) {
                    if (response.success) {
                        // モーダルをフェードアウト
                        $('#lw-ai-terms-overlay').fadeOut(300, function() {
                            $(this).remove();
                        });
                    } else {
                        alert(response.data.message || 'エラーが発生しました');
                        $btn.prop('disabled', false);
                        $btn.find('.lw-ai-btn-text').show();
                        $btn.find('.lw-ai-btn-loading').hide();
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false);
                    $btn.find('.lw-ai-btn-text').show();
                    $btn.find('.lw-ai-btn-loading').hide();
                }
            });
        },

        /**
         * APIキーを保存
         */
        handleSave: function(e) {
            e.preventDefault();

            var $btn = $('#lw-ai-save-btn');
            var apiKey = $('#lw_ai_api_key_input').val().trim();

            if (!apiKey) {
                this.showMessage('error', 'APIキーを入力してください');
                return;
            }

            // フォーマットチェック
            if (apiKey.indexOf('AIza') !== 0) {
                this.showMessage('error', 'APIキーの形式が正しくありません。「AIza」で始まるキーを入力してください。');
                return;
            }

            this.setButtonLoading($btn, true);
            this.showMessage('info', 'APIキーを検証中...');

            $.ajax({
                url: lwAiAdminSettings.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_ai_save_api_key',
                    nonce: lwAiAdminSettings.nonce,
                    api_key: apiKey
                },
                success: function(response) {
                    if (response.success) {
                        LwAiSettings.showMessage('success', response.data.message);
                        LwAiSettings.switchToDisplayMode(response.data.masked_key);
                        LwAiSettings.showSuccessPopup();
                    } else {
                        LwAiSettings.showMessage('error', response.data.message);
                    }
                },
                error: function() {
                    LwAiSettings.showMessage('error', '通信エラーが発生しました。再度お試しください。');
                },
                complete: function() {
                    LwAiSettings.setButtonLoading($btn, false);
                }
            });
        },

        /**
         * APIキーをリセット
         */
        handleReset: function(e) {
            e.preventDefault();

            if (!confirm('本当にAPIキーをリセットしますか？\nリセット後、AIの機能は使用できなくなります。')) {
                return;
            }

            var $btn = $('#lw-ai-reset-btn');
            $btn.prop('disabled', true);

            $.ajax({
                url: lwAiAdminSettings.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_ai_reset_api_key',
                    nonce: lwAiAdminSettings.nonce
                },
                success: function(response) {
                    if (response.success) {
                        LwAiSettings.showMessage('success', response.data.message);
                        LwAiSettings.switchToFormMode();
                    } else {
                        LwAiSettings.showMessage('error', response.data.message);
                    }
                },
                error: function() {
                    LwAiSettings.showMessage('error', '通信エラーが発生しました。');
                },
                complete: function() {
                    $btn.prop('disabled', false);
                }
            });
        },

        /**
         * 接続テスト
         */
        handleTest: function(e) {
            e.preventDefault();

            var $btn = $('#lw-ai-test-btn');
            var originalText = $btn.html();

            $btn.prop('disabled', true).html('<span class="dashicons dashicons-update lw-ai-spin"></span> テスト中...');
            this.showMessage('info', 'APIキーを検証中...');

            $.ajax({
                url: lwAiAdminSettings.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_ai_validate_api_key',
                    nonce: lwAiAdminSettings.nonce
                },
                success: function(response) {
                    if (response.success) {
                        LwAiSettings.showMessage('success', response.data.message);
                        LwAiSettings.updateStatus(true, response.data.checked_at);
                    } else {
                        LwAiSettings.showMessage('error', response.data.message);
                        LwAiSettings.updateStatus(false, '', response.data.message);
                    }
                },
                error: function() {
                    LwAiSettings.showMessage('error', '通信エラーが発生しました。');
                },
                complete: function() {
                    $btn.prop('disabled', false).html(originalText);
                }
            });
        },

        /**
         * ボタンのローディング状態を切り替え
         */
        setButtonLoading: function($btn, isLoading) {
            if (isLoading) {
                $btn.prop('disabled', true);
                $btn.find('.lw-ai-btn-icon, .lw-ai-btn-text').hide();
                $btn.find('.lw-ai-btn-loading').show();
            } else {
                $btn.prop('disabled', false);
                $btn.find('.lw-ai-btn-icon, .lw-ai-btn-text').show();
                $btn.find('.lw-ai-btn-loading').hide();
            }
        },

        /**
         * メッセージを表示
         */
        showMessage: function(type, message) {
            var $container = $('#lw-ai-message');
            var iconClass = {
                'success': 'dashicons-yes-alt',
                'error': 'dashicons-dismiss',
                'warning': 'dashicons-warning',
                'info': 'dashicons-info'
            };

            $container.removeClass('lw-ai-msg-success lw-ai-msg-error lw-ai-msg-warning lw-ai-msg-info')
                .addClass('lw-ai-msg-' + type)
                .html('<span class="dashicons ' + iconClass[type] + '"></span> ' + message)
                .slideDown(200);

            // 成功メッセージは5秒後に消す
            if (type === 'success') {
                setTimeout(function() {
                    $container.slideUp(200);
                }, 5000);
            }
        },

        /**
         * 表示モードに切り替え（設定済み状態）
         */
        switchToDisplayMode: function(maskedKey) {
            $('#lw-ai-key-form').slideUp(200);
            $('#lw-ai-guide-card').slideUp(200);

            // マスクされたキーを更新
            if (maskedKey) {
                // APIから返ってきた形式を●に変換
                var displayKey = maskedKey.substring(0, 4) + '●'.repeat(20) + maskedKey.slice(-4).replace(/\*/g, '');
                $('#lw-ai-key-display input').val(displayKey);
            }

            $('#lw-ai-key-display').slideDown(200);

            // ステータスを更新
            this.updateStatus(true);
        },

        /**
         * フォームモードに切り替え（未設定状態）
         */
        switchToFormMode: function() {
            $('#lw-ai-key-display').slideUp(200);
            $('#lw-ai-key-form').slideDown(200);
            $('#lw-ai-guide-card').slideDown(200);
            $('#lw_ai_api_key_input').val('');

            // ステータスを更新
            var statusHtml = '<div class="lw-ai-status lw-ai-status-error">' +
                '<span class="dashicons dashicons-warning"></span>' +
                '<div><strong>APIキーが設定されていません</strong><br>' +
                'AI機能を使用するには、上記の手順でAPIキーを取得し、下のフォームに入力してください。</div></div>';
            $('#lw-ai-status-container').html(statusHtml);
        },

        /**
         * ステータス表示を更新
         */
        updateStatus: function(isValid, checkedAt, errorMessage) {
            var $container = $('#lw-ai-status-container');
            var html = '';

            if (isValid) {
                html = '<div class="lw-ai-status lw-ai-status-success">' +
                    '<span class="dashicons dashicons-yes-alt"></span>' +
                    '<div><strong>APIキー設定済み - 接続確認OK</strong>';
                if (checkedAt) {
                    html += '<br><small>最終確認: ' + checkedAt + '</small>';
                }
                html += '</div></div>';
            } else {
                html = '<div class="lw-ai-status lw-ai-status-warning">' +
                    '<span class="dashicons dashicons-warning"></span>' +
                    '<div><strong>APIキー設定済み - 接続エラー</strong>';
                if (errorMessage) {
                    html += '<br><small>' + errorMessage + '</small>';
                }
                html += '</div></div>';
            }

            $container.html(html);
        },

        /**
         * 設定完了ポップアップ
         */
        showSuccessPopup: function() {
            var nekoUrl = (typeof lwAiChat !== 'undefined' && lwAiChat.avatarUrl) ? lwAiChat.avatarUrl : '';
            var modeUrl = (typeof lwAiChat !== 'undefined' && lwAiChat.modeUrl) ? lwAiChat.modeUrl : '';
            var nonce = (typeof lwAiChat !== 'undefined' && lwAiChat.nonce) ? lwAiChat.nonce : '';
            var dashUrl = typeof ajaxurl !== 'undefined' ? ajaxurl.replace('/admin-ajax.php', '/') : '/wp-admin/';

            var overlay = document.createElement('div');
            overlay.id = 'lw-ai-success-popup';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100500;';

            // Step 1: 設定完了
            overlay.innerHTML =
                '<div id="lw-ai-success-card" style="background:#fff;border-radius:20px;padding:40px 32px;max-width:460px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.25);">' +
                    (nekoUrl ? '<img src="' + nekoUrl + '" alt="" style="width:72px;height:72px;margin-bottom:16px;">' : '') +
                    '<h2 style="font-size:22px;font-weight:700;color:#1e293b;margin:0 0 10px;">設定完了にゃ！🎉</h2>' +
                    '<p style="font-size:14px;color:#64748b;line-height:1.7;margin:0 0 24px;">' +
                        'APIキーの設定が完了したにゃ！<br>これでAI機能が使えるようになったにゃ〜！' +
                    '</p>' +
                    '<div style="background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:14px;padding:24px 20px;margin:0 0 24px;text-align:center;">' +
                        '<p style="color:rgba(255,255,255,0.8);font-size:13px;margin:0 0 12px;">今すぐ無制限モードに切り替えますか？</p>' +
                        '<p style="color:#fff;font-size:15px;font-weight:700;margin:0 0 6px;">プライベートAI — 無制限モード</p>' +
                        '<p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0 0 16px;">データは外部に送信されません。回数制限なし。</p>' +
                        '<button type="button" id="lw-ai-activate-private" style="width:100%;padding:14px;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;transition:transform 0.15s;">✨ プライベートAIを有効にする ✨</button>' +
                    '</div>' +
                    '<button type="button" id="lw-ai-success-skip" style="padding:10px 20px;background:transparent;border:1px solid #e2e8f0;border-radius:8px;color:#94a3b8;font-size:13px;cursor:pointer;">あとで設定する</button>' +
                '</div>';
            document.body.appendChild(overlay);

            // プライベートAI有効化ボタン
            var activateBtn = document.getElementById('lw-ai-activate-private');
            if (activateBtn && modeUrl && nonce) {
                activateBtn.addEventListener('click', function() {
                    activateBtn.textContent = '切り替え中...';
                    activateBtn.style.opacity = '0.7';
                    activateBtn.disabled = true;

                    fetch(modeUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
                        body: JSON.stringify({ mode: 'own' })
                    })
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                        if (data.success) {
                            // Step 2: パワーアップ演出
                            var card = document.getElementById('lw-ai-success-card');
                            card.style.background = 'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)';
                            card.style.transition = 'background 0.5s';
                            card.innerHTML =
                                (nekoUrl ? '<div style="position:relative;display:inline-block;margin-bottom:16px;">' +
                                    '<img src="' + nekoUrl + '" alt="" style="width:80px;height:80px;position:relative;z-index:1;filter:drop-shadow(0 0 12px rgba(99,102,241,0.6));">' +
                                    '<div style="position:absolute;top:-8px;left:-8px;right:-8px;bottom:-8px;border-radius:50%;background:conic-gradient(#6366f1,#a78bfa,#c4b5fd,#818cf8,#a78bfa,#6366f1);animation:lw-glow-spin 2s linear infinite;filter:blur(6px);opacity:0.7;z-index:0;"></div>' +
                                '</div>' : '') +
                                '<h2 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 8px;">プライベートAI 起動！</h2>' +
                                '<p style="color:#c4b5fd;font-size:14px;margin:0 0 8px;">✨ 無制限 ・ プライベート ・ 自動操作 ✨</p>' +
                                '<p style="color:rgba(255,255,255,0.7);font-size:13px;line-height:1.7;margin:0 0 28px;">' +
                                    'AIがパワーアップしたにゃ！<br>回数制限なし、データは外部に一切送信されないにゃ。<br>さっそく使ってみるにゃ〜！' +
                                '</p>' +
                                '<button type="button" id="lw-ai-meet-powered" style="width:100%;padding:16px;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(99,102,241,0.4);">🐱 パワーアップしたAIに会いに行く</button>' +
                                '<style>@keyframes lw-glow-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style>';

                            // 「会いに行く」ボタン → その場でAIチャットポップアップを開く
                            var meetBtn = document.getElementById('lw-ai-meet-powered');
                            if (meetBtn) {
                                meetBtn.addEventListener('click', function() {
                                    overlay.remove();
                                    var chatOverlay = document.getElementById('lw-ai-chat-overlay');
                                    if (chatOverlay) {
                                        // パワーモードに切り替え
                                        chatOverlay.classList.add('lw-ai-power-mode');
                                        chatOverlay.classList.add('open');
                                        document.body.style.overflow = 'hidden';
                                        // ウェルカムメッセージ
                                        var msgs = document.getElementById('lw-ai-chat-messages');
                                        var bodyEl = document.getElementById('lw-ai-chat-body');
                                        var consentEl = document.getElementById('lw-ai-chat-consent');
                                        if (consentEl) consentEl.style.display = 'none';
                                        if (bodyEl) bodyEl.style.display = 'block';
                                        if (msgs && typeof window.lwAiChatAddMessage === 'function') {
                                            window.lwAiChatAddMessage('プライベートAIモードが起動したにゃ！✨\n回数無制限・データは外部に送信されないにゃ。\nなんでも聞いてにゃ〜！', false);
                                        }
                                    }
                                });
                            }

                            // 音声で祝福
                            var synth = window.speechSynthesis;
                            if (synth) {
                                synth.cancel();
                                setTimeout(function() {
                                    var utter = new SpeechSynthesisUtterance('やったにゃ！プライベートAIが起動したにゃ！回数無制限で、データも外に出ないにゃ。さっそくダッシュボードで使ってみてにゃ〜！');
                                    utter.lang = 'ja-JP';
                                    utter.rate = 1.15;
                                    utter.pitch = 1.2;
                                    var voices = synth.getVoices();
                                    var jaVoice = voices.find(function(v) { return v.lang.startsWith('ja'); });
                                    if (jaVoice) utter.voice = jaVoice;
                                    synth.speak(utter);
                                }, 300);
                            }
                        } else {
                            activateBtn.textContent = 'エラーが発生しました';
                            activateBtn.style.opacity = '';
                        }
                    })
                    .catch(function() {
                        activateBtn.textContent = '通信エラー';
                        activateBtn.style.opacity = '';
                    });
                });
            }

            // スキップ
            document.getElementById('lw-ai-success-skip').addEventListener('click', function() {
                overlay.remove();
            });
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) overlay.remove();
            });

            // 設定完了の音声
            var synth = window.speechSynthesis;
            if (synth) {
                setTimeout(function() {
                    var utter = new SpeechSynthesisUtterance('設定完了にゃ！おめでとう！今すぐプライベートAIモードに切り替えると、無制限で使えるようになるにゃ！');
                    utter.lang = 'ja-JP';
                    utter.rate = 1.15;
                    utter.pitch = 1.2;
                    var voices = synth.getVoices();
                    var jaVoice = voices.find(function(v) { return v.lang.startsWith('ja'); });
                    if (jaVoice) utter.voice = jaVoice;
                    synth.speak(utter);
                }, 500);
            }
        }
    };

    // DOM Ready
    $(document).ready(function() {
        LwAiSettings.init();
    });

})(jQuery);
