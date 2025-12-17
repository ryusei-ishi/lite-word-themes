/**
 * LiteWord AI Generator - Block Settings Page Scripts
 */

(function($) {
    'use strict';

    const MAX_BLOCKS = lwAiBlockSettings.maxBlocks || 20;

    /**
     * カウンターを更新
     */
    function updateCounter() {
        const count = $('.lw-ai-block-card input[type="checkbox"]:checked').length;
        const $counter = $('.lw-ai-counter');
        const $current = $('.lw-ai-counter-current');

        $current.text(count);

        if (count >= MAX_BLOCKS) {
            $counter.addClass('is-max');
        } else {
            $counter.removeClass('is-max');
        }

        // 上限に達したらチェックされていないカードを無効化
        if (count >= MAX_BLOCKS) {
            $('.lw-ai-block-card:not(.is-selected)').addClass('is-disabled');
        } else {
            $('.lw-ai-block-card').removeClass('is-disabled');
        }
    }

    /**
     * カードの選択状態を更新
     */
    function updateCardState($card, isChecked) {
        if (isChecked) {
            $card.addClass('is-selected');
        } else {
            $card.removeClass('is-selected');
        }
    }

    /**
     * トーストを表示
     */
    function showToast(message, type = 'success') {
        const $toast = $('#lw-ai-toast');

        $toast
            .removeClass('is-success is-error')
            .addClass('is-' + type)
            .find('.lw-ai-toast-message')
            .text(message);

        $toast.stop(true).fadeIn(300);

        setTimeout(function() {
            $toast.fadeOut(300);
        }, 3000);
    }

    /**
     * 設定を保存
     */
    function saveSettings() {
        const $buttons = $('#lw-ai-save-settings, #lw-ai-save-settings-bottom');
        const $btnText = $buttons.find('.lw-ai-btn-text');
        const $btnLoading = $buttons.find('.lw-ai-btn-loading');

        // ローディング状態
        $buttons.prop('disabled', true);
        $btnText.hide();
        $btnLoading.show();

        // データ収集
        const enabledBlocks = [];
        const blockPrompts = {};

        $('.lw-ai-block-card input[type="checkbox"]:checked').each(function() {
            enabledBlocks.push($(this).val());
        });

        $('.lw-ai-block-card').each(function() {
            const slug = $(this).data('slug');
            const prompt = $(this).find('textarea').val().trim();
            if (prompt) {
                blockPrompts[slug] = prompt;
            }
        });

        // Ajax送信
        $.ajax({
            url: lwAiBlockSettings.ajaxUrl,
            type: 'POST',
            data: {
                action: 'lw_ai_save_block_settings',
                nonce: lwAiBlockSettings.nonce,
                enabled_blocks: enabledBlocks,
                block_prompts: blockPrompts
            },
            success: function(response) {
                if (response.success) {
                    showToast(response.data.message + ' (' + response.data.count + '個のブロック)', 'success');
                } else {
                    showToast(response.data.message || 'エラーが発生しました', 'error');
                }
            },
            error: function() {
                showToast('保存に失敗しました', 'error');
            },
            complete: function() {
                $buttons.prop('disabled', false);
                $btnText.show();
                $btnLoading.hide();
            }
        });
    }

    /**
     * 初期化
     */
    $(function() {
        // 初期カウント
        updateCounter();

        // チェックボックスの変更
        $(document).on('change', '.lw-ai-block-card input[type="checkbox"]', function() {
            const $card = $(this).closest('.lw-ai-block-card');
            const isChecked = $(this).is(':checked');
            const currentCount = $('.lw-ai-block-card input[type="checkbox"]:checked').length;

            // 上限チェック
            if (isChecked && currentCount > MAX_BLOCKS) {
                $(this).prop('checked', false);
                showToast('選択できるブロックは最大' + MAX_BLOCKS + '個までです', 'error');
                return;
            }

            updateCardState($card, isChecked);
            updateCounter();
        });

        // カード全体のクリック（チェックボックス以外）
        $(document).on('click', '.lw-ai-block-card-header', function(e) {
            if ($(e.target).closest('.lw-ai-checkbox, .lw-ai-block-badge').length) {
                return;
            }

            const $card = $(this).closest('.lw-ai-block-card');
            if ($card.hasClass('is-disabled')) {
                return;
            }

            const $checkbox = $card.find('input[type="checkbox"]');
            $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
        });

        // すべて解除
        $('#lw-ai-clear-all').on('click', function() {
            $('.lw-ai-block-card input[type="checkbox"]').prop('checked', false).each(function() {
                updateCardState($(this).closest('.lw-ai-block-card'), false);
            });
            updateCounter();
        });

        // 保存ボタン
        $('#lw-ai-save-settings, #lw-ai-save-settings-bottom').on('click', saveSettings);

        // カテゴリの折りたたみ
        $('.lw-ai-category-toggle').on('click', function() {
            const $category = $(this).closest('.lw-ai-category');
            const isExpanded = $(this).attr('aria-expanded') === 'true';

            $(this).attr('aria-expanded', !isExpanded);
            $category.toggleClass('is-collapsed');
        });

        // プロンプト設定トグル
        $(document).on('click', '.lw-ai-prompt-toggle', function() {
            const $section = $(this).closest('.lw-ai-block-prompt-section');
            const $field = $section.find('.lw-ai-prompt-field');
            const isExpanded = $(this).attr('aria-expanded') === 'true';

            if (isExpanded) {
                $field.slideUp(200);
                $(this).attr('aria-expanded', 'false').text('設定する');
            } else {
                $field.slideDown(200);
                $(this).attr('aria-expanded', 'true').text('閉じる');
            }
        });

        // Ctrl+S / Cmd+S で保存
        $(document).on('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveSettings();
            }
        });
    });

})(jQuery);
