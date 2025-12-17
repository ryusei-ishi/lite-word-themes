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
        }
    };

    // DOM Ready
    $(document).ready(function() {
        LwAiSettings.init();
    });

})(jQuery);
