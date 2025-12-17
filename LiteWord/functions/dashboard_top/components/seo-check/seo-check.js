/**
 * SEOセルフチェック JavaScript
 */
(function($) {
    'use strict';

    const SeoCheck = {
        init: function() {
            // サイドバーボタンクリック
            $('#lw-seo-check-trigger').on('click', function() {
                $('#lw-seo-check-modal').addClass('active');
            });

            // カテゴリーのアコーディオン
            $(document).on('click', '.lw-seo-category-header', function() {
                const $category = $(this).closest('.lw-seo-category');
                const $body = $category.find('.lw-seo-category-body');

                $category.toggleClass('is-open');
                $body.slideToggle(200);
            });

            // チェックボックスの変更
            $(document).on('change', '.lw-seo-checkbox', function() {
                SeoCheck.saveCheck($(this));
            });
        },

        saveCheck: function($checkbox) {
            const category = $checkbox.data('category');
            const item = $checkbox.data('item');
            const checked = $checkbox.is(':checked');
            const $item = $checkbox.closest('.lw-seo-item');
            const $category = $checkbox.closest('.lw-seo-category');

            // アイテムのスタイル更新
            if (checked) {
                $item.addClass('is-checked');
            } else {
                $item.removeClass('is-checked');
            }

            // AJAX保存
            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_seo_check',
                    nonce: lwWizard.nonce,
                    category: category,
                    item: item,
                    checked: checked
                },
                success: function(response) {
                    if (response.success) {
                        // 進捗更新
                        SeoCheck.updateProgress(response.data);

                        // カテゴリーの完了状態を更新
                        SeoCheck.updateCategoryStatus($category);
                    }
                }
            });
        },

        updateProgress: function(data) {
            $('#lw-seo-completed').text(data.completed);
            $('#lw-seo-total').text(data.total);
            $('#lw-seo-percent').text(data.progress);
            $('#lw-seo-progress-fill').css('width', data.progress + '%');

            // サイドバーのバッジ更新
            const $badge = $('#lw-seo-check-badge');
            if (data.progress === 100) {
                $badge.text('100%').addClass('is-complete');
            } else {
                $badge.text(data.progress + '%').removeClass('is-complete');
            }
        },

        updateCategoryStatus: function($category) {
            const $checkboxes = $category.find('.lw-seo-checkbox');
            const total = $checkboxes.length;
            const checked = $checkboxes.filter(':checked').length;

            // カウント更新
            $category.find('.lw-seo-category-count').text(checked + '/' + total);

            // 完了状態の更新
            if (checked === total) {
                $category.addClass('is-complete');
            } else {
                $category.removeClass('is-complete');
            }
        }
    };

    // 初期化
    $(document).ready(function() {
        SeoCheck.init();
    });

})(jQuery);
