/**
 * LiteWord サイト制作ウィザード
 */
(function($) {
    'use strict';

    // モーダル共通制御
    const Modal = {
        open: function(modalId) {
            $('#' + modalId).addClass('active');
        },
        close: function(modalId) {
            $('#' + modalId).removeClass('active');
        },
        init: function() {
            // 閉じるボタン
            $('.lw-modal-close, .lw-btn-cancel').on('click', function() {
                const modalId = $(this).data('modal');
                if (modalId) {
                    Modal.close(modalId);
                }
            });

            // オーバーレイクリックで閉じる
            $('.lw-wizard-modal').on('click', function(e) {
                if ($(e.target).hasClass('lw-wizard-modal')) {
                    $(this).removeClass('active');
                }
            });

            // ESCキーで閉じる
            $(document).on('keydown', function(e) {
                if (e.key === 'Escape') {
                    $('.lw-wizard-modal.active').removeClass('active');
                }
            });

            // data-modal-close属性で閉じる
            $(document).on('click', '[data-modal-close]', function() {
                const modalId = $(this).data('modal-close');
                if (modalId) {
                    Modal.close(modalId);
                }
            });

            // プレミアム限定ボタンのクリック
            $(document).on('click', '[data-premium-only]', function(e) {
                e.preventDefault();
                e.stopPropagation();
                Modal.open('lw-premium-modal');
            });
        }
    };

    // サイト基本情報モーダル
    const SiteInfoModal = {
        init: function() {
            // ステップ2をクリックでモーダルを開く
            $('#lw-step-site-info').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-site-info-modal');
                SiteInfoModal.load();
            });

            // フォーム送信
            $('#lw-site-info-form').on('submit', function(e) {
                e.preventDefault();
                SiteInfoModal.save();
            });

            // ロゴ選択
            $('#lw-logo-select').on('click', function() {
                SiteInfoModal.openMediaUploader();
            });

            // ロゴ削除
            $('#lw-logo-remove').on('click', function() {
                $('#lw-logo-id').val('');
                $('#lw-logo-preview').html('<span class="lw-no-logo">ロゴ未設定</span>');
                $(this).hide();
            });

            // SVG Supportプラグインのインストール
            $('#lw-svg-install-btn').on('click', function() {
                SiteInfoModal.installSvgSupport();
            });

            // SVG Supportプラグインの有効化
            $('#lw-svg-activate-btn').on('click', function() {
                SiteInfoModal.activateSvgSupport();
            });
        },

        installSvgSupport: function() {
            const $btn = $('#lw-svg-install-btn');
            const $status = $('#lw-svg-status');

            $btn.prop('disabled', true).html('<span class="spinner is-active" style="float:none;margin:0 5px 0 0;"></span> インストール中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_install_svg_support',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        $btn.removeClass('lw-btn-primary').addClass('lw-btn-success')
                            .html('<span class="dashicons dashicons-yes"></span> 有効化する')
                            .attr('id', 'lw-svg-activate-btn')
                            .prop('disabled', false);

                        // 新しいボタンにイベントを再バインド
                        $('#lw-svg-activate-btn').off('click').on('click', function() {
                            SiteInfoModal.activateSvgSupport();
                        });

                        $status.html('<span style="color:#10b981;">インストール完了！</span>');
                    } else {
                        $btn.prop('disabled', false).html('<span class="dashicons dashicons-download"></span> インストール');
                        $status.html('<span style="color:#dc2626;">エラー: ' + response.data + '</span>');
                    }
                },
                error: function() {
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-download"></span> インストール');
                    $status.html('<span style="color:#dc2626;">通信エラー</span>');
                }
            });
        },

        activateSvgSupport: function() {
            const $btn = $('#lw-svg-activate-btn');
            const $status = $('#lw-svg-status');

            $btn.prop('disabled', true).html('<span class="spinner is-active" style="float:none;margin:0 5px 0 0;"></span> 有効化中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_activate_svg_support',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        // 成功時はボックス全体を更新
                        $('.lw-svg-support-box').addClass('is-active');
                        $('.lw-svg-support-content').html(
                            '<p class="lw-svg-support-title">SVG画像を使用したい場合</p>' +
                            '<p class="lw-svg-support-status"><span class="dashicons dashicons-yes-alt"></span> SVG Supportプラグインが有効です。SVG画像をアップロードできます。</p>'
                        );
                    } else {
                        $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 有効化する');
                        $status.html('<span style="color:#dc2626;">エラー: ' + response.data + '</span>');
                    }
                },
                error: function() {
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 有効化する');
                    $status.html('<span style="color:#dc2626;">通信エラー</span>');
                }
            });
        },

        load: function() {
            $('#lw-site-info-loading').show();
            $('#lw-site-info-form').hide();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_site_info',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        const data = response.data;
                        $('#lw-site-title').val(data.site_title);
                        $('#lw-site-tagline').val(data.site_tagline);
                        $('#lw-logo-id').val(data.logo_id);

                        if (data.logo_url) {
                            $('#lw-logo-preview').html('<img src="' + data.logo_url + '" alt="ロゴ">');
                            $('#lw-logo-remove').show();
                        } else {
                            $('#lw-logo-preview').html('<span class="lw-no-logo">ロゴ未設定</span>');
                            $('#lw-logo-remove').hide();
                        }

                        // タイムゾーン・日付形式を設定
                        if (data.timezone) {
                            $('#lw-timezone').val(data.timezone);
                        }
                        if (data.date_format) {
                            $('input[name="date_format"][value="' + data.date_format + '"]').prop('checked', true);
                        }
                        if (data.time_format) {
                            $('input[name="time_format"][value="' + data.time_format + '"]').prop('checked', true);
                        }
                    }
                    $('#lw-site-info-loading').hide();
                    $('#lw-site-info-form').show();
                    $('#lw-site-title').focus();
                },
                error: function() {
                    $('#lw-site-info-loading').html('<p style="color:#e53e3e;">読み込みに失敗しました</p>');
                }
            });
        },

        openMediaUploader: function() {
            const frame = wp.media({
                title: 'ロゴ画像を選択',
                button: { text: '選択' },
                library: { type: 'image' },
                multiple: false
            });

            frame.on('select', function() {
                const attachment = frame.state().get('selection').first().toJSON();
                $('#lw-logo-id').val(attachment.id);
                $('#lw-logo-preview').html('<img src="' + attachment.url + '" alt="ロゴ">');
                $('#lw-logo-remove').show();
            });

            frame.open();
        },

        save: function() {
            const $form = $('#lw-site-info-form');
            const $btn = $form.find('button[type="submit"]');
            const originalText = $btn.text();
            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_site_info',
                    nonce: lwWizard.nonce,
                    site_title: $('#lw-site-title').val(),
                    site_tagline: $('#lw-site-tagline').val(),
                    logo_id: $('#lw-logo-id').val(),
                    timezone: $('#lw-timezone').val(),
                    date_format: $('input[name="date_format"]:checked').val(),
                    time_format: $('input[name="time_format"]:checked').val()
                },
                success: function(response) {
                    if (response.success) {
                        $btn.text('保存しました!');
                        setTimeout(function() {
                            Modal.close('lw-site-info-modal');
                            $btn.prop('disabled', false).text(originalText);
                        }, 1000);
                    } else {
                        alert(response.data || '保存に失敗しました');
                        $btn.prop('disabled', false).text(originalText);
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text(originalText);
                }
            });
        }
    };

    // カラー・フォント設定モーダル
    const ColorFontModal = {
        init: function() {
            // ステップ3をクリックでモーダルを開く
            $('#lw-step-color-font').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-color-font-modal');
                ColorFontModal.load();
            });

            // フォーム送信
            $('#lw-color-font-form').on('submit', function(e) {
                e.preventDefault();
                ColorFontModal.save();
            });
        },

        load: function() {
            $('#lw-color-font-loading').show();
            $('#lw-color-font-form').hide();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_color_font',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        const data = response.data;
                        $('#lw-color-main').val(data.color_main);
                        $('#lw-color-accent').val(data.color_accent);

                        // フォントオプションを動的に生成
                        const $select = $('#lw-font-body');
                        $select.empty();
                        data.font_options.forEach(function(font) {
                            const selected = font.value === data.font_body ? ' selected' : '';
                            $select.append('<option value="' + font.value + '"' + selected + '>' + font.label + '</option>');
                        });
                    }
                    $('#lw-color-font-loading').hide();
                    $('#lw-color-font-form').show();
                },
                error: function() {
                    $('#lw-color-font-loading').html('<p style="color:#e53e3e;">読み込みに失敗しました</p>');
                }
            });
        },

        save: function() {
            const $form = $('#lw-color-font-form');
            const $btn = $form.find('button[type="submit"]');
            const originalText = $btn.text();
            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_color_font',
                    nonce: lwWizard.nonce,
                    color_main: $('#lw-color-main').val(),
                    color_accent: $('#lw-color-accent').val(),
                    font_body: $('#lw-font-body').val()
                },
                success: function(response) {
                    if (response.success) {
                        $btn.text('保存しました!');
                        setTimeout(function() {
                            Modal.close('lw-color-font-modal');
                            $btn.prop('disabled', false).text(originalText);
                        }, 1000);
                    } else {
                        alert(response.data || '保存に失敗しました');
                        $btn.prop('disabled', false).text(originalText);
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text(originalText);
                }
            });
        }
    };

    // ヘッダーパターンモーダル
    const HeaderModal = {
        customizeUrl: '',

        init: function() {
            // ステップ4をクリックでモーダルを開く
            $('#lw-step-header').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-header-modal');
                HeaderModal.load();
            });

            // パターン選択時にハイライト＆リンク更新（動的要素なのでデリゲート）
            $('#lw-header-patterns').on('change', 'input', function() {
                $('#lw-header-patterns .lw-pattern-item').removeClass('selected');
                $(this).closest('.lw-pattern-item').addClass('selected');


            });

            // フォーム送信
            $('#lw-header-form').on('submit', function(e) {
                e.preventDefault();
                HeaderModal.save();
            });
        },

        load: function() {
            $('#lw-header-loading').show();
            $('#lw-header-form').hide();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_header_pattern',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        const data = response.data;
                        HeaderModal.customizeUrl = data.customize_url;

                        // パターングリッドを生成
                        const $grid = $('#lw-header-patterns');
                        $grid.empty();
                        data.patterns.forEach(function(ptn) {
                            const selected = ptn.value === data.current ? ' selected' : '';
                            const checked = ptn.value === data.current ? ' checked' : '';
                            const locked = ptn.locked ? ' locked' : '';
                            const disabled = ptn.locked ? ' disabled' : '';
                            const lockIcon = ptn.locked ? '<span class="lw-pattern-lock"><span class="dashicons dashicons-lock"></span></span>' : '';
                            const lockMsg = ptn.locked ? '<span class="lw-pattern-lock-msg">' + ptn.locked_message + '</span>' : '';
                            $grid.append(
                                '<label class="lw-pattern-item' + selected + locked + '">' +
                                    '<input type="radio" name="header_ptn" value="' + ptn.value + '"' + checked + disabled + '>' +
                                    '<div class="lw-pattern-img-wrap">' +
                                        '<img src="' + ptn.image + '" alt="' + ptn.label + '">' +
                                        lockIcon +
                                    '</div>' +
                                    '<span class="lw-pattern-label">' + ptn.label + '</span>' +
                                    lockMsg +
                                '</label>'
                            );
                        });


                    }
                    $('#lw-header-loading').hide();
                    $('#lw-header-form').show();
                },
                error: function() {
                    $('#lw-header-loading').html('<p style="color:#e53e3e;">読み込みに失敗しました</p>');
                }
            });
        },

        save: function() {
            const $form = $('#lw-header-form');
            const $btn = $form.find('button[type="submit"]');
            const originalText = $btn.text();
            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_header_pattern',
                    nonce: lwWizard.nonce,
                    header_ptn: $('input[name="header_ptn"]:checked').val()
                },
                success: function(response) {
                    if (response.success) {
                        // 詳細設定リンクのURLを更新
                        const selectedPtn = $('input[name="header_ptn"]:checked').val();
                        const newUrl = lwWizard.adminUrl + 'customize.php?autofocus[control]=header_' + selectedPtn + '_set_logo_switch';
                        $('#lw-header-detail-step').attr('href', newUrl);

                        $btn.text('保存しました!');
                        setTimeout(function() {
                            Modal.close('lw-header-modal');
                            $btn.prop('disabled', false).text(originalText);
                        }, 1000);
                    } else {
                        alert(response.data || '保存に失敗しました');
                        $btn.prop('disabled', false).text(originalText);
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text(originalText);
                }
            });
        }
    };

    // フッターパターンモーダル
    const FooterModal = {
        customizeUrl: '',

        init: function() {
            // ステップ5をクリックでモーダルを開く
            $('#lw-step-footer').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-footer-modal');
                FooterModal.load();
            });

            // パターン選択時にハイライト＆リンク更新（動的要素なのでデリゲート）
            $('#lw-footer-patterns').on('change', 'input', function() {
                $('#lw-footer-patterns .lw-pattern-item').removeClass('selected');
                $(this).closest('.lw-pattern-item').addClass('selected');


            });

            // フォーム送信
            $('#lw-footer-form').on('submit', function(e) {
                e.preventDefault();
                FooterModal.save();
            });
        },

        load: function() {
            $('#lw-footer-loading').show();
            $('#lw-footer-form').hide();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_footer_pattern',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        const data = response.data;
                        FooterModal.customizeUrl = data.customize_url;

                        // パターングリッドを生成
                        const $grid = $('#lw-footer-patterns');
                        $grid.empty();
                        data.patterns.forEach(function(ptn) {
                            const selected = ptn.value === data.current ? ' selected' : '';
                            const checked = ptn.value === data.current ? ' checked' : '';
                            const locked = ptn.locked ? ' locked' : '';
                            const disabled = ptn.locked ? ' disabled' : '';
                            const lockIcon = ptn.locked ? '<span class="lw-pattern-lock"><span class="dashicons dashicons-lock"></span></span>' : '';
                            const lockMsg = ptn.locked ? '<span class="lw-pattern-lock-msg">' + ptn.locked_message + '</span>' : '';
                            $grid.append(
                                '<label class="lw-pattern-item' + selected + locked + '">' +
                                    '<input type="radio" name="footer_ptn" value="' + ptn.value + '"' + checked + disabled + '>' +
                                    '<div class="lw-pattern-img-wrap">' +
                                        '<img src="' + ptn.image + '" alt="' + ptn.label + '">' +
                                        lockIcon +
                                    '</div>' +
                                    '<span class="lw-pattern-label">' + ptn.label + '</span>' +
                                    lockMsg +
                                '</label>'
                            );
                        });


                    }
                    $('#lw-footer-loading').hide();
                    $('#lw-footer-form').show();
                },
                error: function() {
                    $('#lw-footer-loading').html('<p style="color:#e53e3e;">読み込みに失敗しました</p>');
                }
            });
        },

        save: function() {
            const $form = $('#lw-footer-form');
            const $btn = $form.find('button[type="submit"]');
            const originalText = $btn.text();
            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_footer_pattern',
                    nonce: lwWizard.nonce,
                    footer_ptn: $('input[name="footer_ptn"]:checked').val()
                },
                success: function(response) {
                    if (response.success) {
                        // 詳細設定リンクのURLを更新
                        const selectedPtn = $('input[name="footer_ptn"]:checked').val();
                        const newUrl = lwWizard.adminUrl + 'customize.php?autofocus[control]=footer_' + selectedPtn + '_set_widget_switch';
                        $('#lw-footer-detail-step').attr('href', newUrl);

                        $btn.text('保存しました!');
                        setTimeout(function() {
                            Modal.close('lw-footer-modal');
                            $btn.prop('disabled', false).text(originalText);
                        }, 1000);
                    } else {
                        alert(response.data || '保存に失敗しました');
                        $btn.prop('disabled', false).text(originalText);
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text(originalText);
                }
            });
        }
    };

    // 公開設定モーダル
    const PublishModal = {
        init: function() {
            // ステップ11をクリックでモーダルを開く
            $('#lw-step-publish').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-publish-modal');
                PublishModal.load();
            });

            // フォーム送信
            $('#lw-publish-form').on('submit', function(e) {
                e.preventDefault();
                PublishModal.save();
            });
        },

        load: function() {
            $('#lw-publish-loading').show();
            $('#lw-publish-form').hide();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_publish_settings',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        const blogPublic = response.data.blog_public;
                        $('input[name="blog_public"][value="' + blogPublic + '"]').prop('checked', true);
                    }
                    $('#lw-publish-loading').hide();
                    $('#lw-publish-form').show();
                },
                error: function() {
                    $('#lw-publish-loading').html('<p style="color:#e53e3e;">読み込みに失敗しました</p>');
                }
            });
        },

        save: function() {
            const $btn = $('#lw-publish-form button[type="submit"]');
            const originalText = $btn.text();
            $btn.prop('disabled', true).text('保存中...');

            const blogPublic = $('input[name="blog_public"]:checked').val();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_publish_settings',
                    nonce: lwWizard.nonce,
                    blog_public: blogPublic
                },
                success: function(response) {
                    if (response.success) {
                        $btn.text('保存しました!');
                        setTimeout(function() {
                            Modal.close('lw-publish-modal');
                            $btn.prop('disabled', false).text(originalText);
                        }, 1000);
                    } else {
                        alert(response.data || '保存に失敗しました');
                        $btn.prop('disabled', false).text(originalText);
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text(originalText);
                }
            });
        }
    };

    // 拡張機能チェック
    const ExtensionCheck = {
        pendingUrl: null,
        pendingType: null,

        init: function() {
            const self = this;

            // Step2以降すべてのクリックイベント（アクティベートチェック）
            $('.lw-wizard-step-wrapper:not([data-step="1"]) .lw-wizard-step').on('click', function(e) {
                if (!lwWizard.isActivated) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    Modal.open('lw-activate-confirm-modal');
                    return false;
                }
            });

            // SEO関連ステップ（12, 13, 14, 16）のクリックイベント
            $('.lw-wizard-step-wrapper[data-step="12"] .lw-wizard-step, .lw-wizard-step-wrapper[data-step="13"] .lw-wizard-step, .lw-wizard-step-wrapper[data-step="14"] .lw-wizard-step, .lw-wizard-step-wrapper[data-step="16"] .lw-wizard-step').on('click', function(e) {
                if (!lwWizard.extensions.seo) {
                    e.preventDefault();
                    self.showConfirm('seo', $(this).attr('href'));
                }
            });

            // お問い合わせフォームステップ（8, 11）のクリックイベント
            $('.lw-wizard-step-wrapper[data-step="8"] .lw-wizard-step, .lw-wizard-step-wrapper[data-step="11"] .lw-wizard-step').on('click', function(e) {
                if (!lwWizard.extensions.mailForm) {
                    e.preventDefault();
                    self.showConfirm('mailForm', $(this).attr('href'));
                }
            });

            // 有効にするボタン
            $('#lw-extension-enable-btn').on('click', function() {
                self.enableExtension();
            });
        },

        showConfirm: function(type, url) {
            this.pendingType = type;
            this.pendingUrl = url;

            let message = '';
            if (type === 'seo') {
                message = 'SEO関係のLiteWord独自の機能を有効にしますか？';
            } else if (type === 'mailForm') {
                message = 'お問い合わせフォームのLiteWord独自の機能を有効にしますか？';
            }

            $('#lw-extension-confirm-message').text(message);
            Modal.open('lw-extension-confirm-modal');
        },

        enableExtension: function() {
            const self = this;
            const $btn = $('#lw-extension-enable-btn');
            const originalText = $btn.text();
            $btn.prop('disabled', true).text('有効化中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_enable_extension',
                    nonce: lwWizard.nonce,
                    type: self.pendingType
                },
                success: function(response) {
                    if (response.success) {
                        // 拡張機能の状態を更新
                        if (self.pendingType === 'seo') {
                            lwWizard.extensions.seo = true;
                        } else if (self.pendingType === 'mailForm') {
                            lwWizard.extensions.mailForm = true;
                        }

                        $btn.text('有効にしました!');
                        setTimeout(function() {
                            Modal.close('lw-extension-confirm-modal');
                            $btn.prop('disabled', false).text(originalText);
                            // リンク先に移動
                            if (self.pendingUrl) {
                                window.open(self.pendingUrl, '_blank');
                            }
                        }, 800);
                    } else {
                        alert(response.data || '有効化に失敗しました');
                        $btn.prop('disabled', false).text(originalText);
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text(originalText);
                }
            });
        }
    };

    // ステップ状態管理
    const StepStatus = {
        saveTimer: null,

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // トグル変更時
            $('.lw-step-toggle').on('change', function(e) {
                const $toggle = $(e.target);
                const step = $toggle.data('step');
                const isChecked = $toggle.is(':checked');
                const $wrapper = $('.lw-wizard-step-wrapper[data-step="' + step + '"]');
                const $label = $wrapper.find('.lw-toggle-label');

                // クラスとラベルを更新
                if (isChecked) {
                    $wrapper.addClass('completed');
                    $label.text('完了');
                } else {
                    $wrapper.removeClass('completed');
                    $label.text('未完了');
                }

                StepStatus.saveStepStatus(step);
            });

            // コメントボタンクリック
            $('.lw-step-comment-btn').on('click', function(e) {
                const step = $(e.currentTarget).data('step');
                StepStatus.toggleCommentArea(step);
            });

            // コメント入力時（遅延保存）
            $('.lw-step-comment').on('input', function(e) {
                const $textarea = $(e.target);
                const step = $textarea.closest('.lw-step-comment-area').data('step');

                clearTimeout(StepStatus.saveTimer);
                StepStatus.saveTimer = setTimeout(function() {
                    StepStatus.saveStepStatus(step);
                }, 800);
            });
        },

        toggleCommentArea: function(step) {
            const $area = $('.lw-step-comment-area[data-step="' + step + '"]');
            $area.slideToggle(200);
        },

        saveStepStatus: function(step) {
            const isOk = $('.lw-step-toggle[data-step="' + step + '"]').is(':checked');
            const comment = $('.lw-step-comment-area[data-step="' + step + '"] .lw-step-comment').val();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_step_status',
                    nonce: lwWizard.nonce,
                    step: step,
                    ok: isOk ? 1 : 0,
                    comment: comment
                },
                success: function(response) {
                    if (response.success) {
                        // コメントがある場合はドットを表示
                        const $btn = $('.lw-step-comment-btn[data-step="' + step + '"]');
                        if (comment && comment.trim()) {
                            if (!$btn.find('.lw-comment-dot').length) {
                                $btn.append('<span class="lw-comment-dot"></span>');
                            }
                        } else {
                            $btn.find('.lw-comment-dot').remove();
                        }

                        // プログレスバーを更新
                        StepStatus.updateProgress();
                    }
                }
            });
        },

        updateProgress: function() {
            const totalSteps = 18;
            let completedSteps = 0;

            $('.lw-wizard-step-wrapper').each(function() {
                if ($(this).hasClass('completed')) {
                    completedSteps++;
                }
            });

            const percent = (completedSteps / totalSteps) * 100;

            // プログレスバーを更新
            $('.lw-progress-fill').css('width', percent + '%');
            $('.lw-progress-text span').first().text(completedSteps);
        }
    };

    // 固定ページ制作モーダル
    const PagesModal = {
        frontPageId: 0,

        init: function() {
            // ステップ6をクリックでモーダルを開く
            $('#lw-step-pages').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-pages-modal');
                PagesModal.loadPages();
            });

            // ページ追加ポップアップを開く
            $('#lw-open-add-page-btn').on('click', function() {
                PagesModal.openAddPageModal();
            });

            // ページ追加ボタン
            $('#lw-add-page-btn').on('click', function() {
                PagesModal.addPage();
            });

            // タイトル文字数カウント
            $('#lw-add-page-title').on('input', function() {
                const len = $(this).val().length;
                $('#lw-add-title-count').text(len);
            });

            // Enterキーでも追加
            $('#lw-add-page-title, #lw-add-page-slug').on('keypress', function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                    PagesModal.addPage();
                }
            });

            // ページ編集（鉛筆）ボタン
            $('#lw-pages-list').on('click', '.lw-page-action-btn.edit-info', function() {
                const $item = $(this).closest('.lw-page-item');
                PagesModal.openEditModal($item);
            });

            // ブロックエディタで編集
            $('#lw-pages-list').on('click', '.lw-page-action-btn.edit', function() {
                const pageId = $(this).closest('.lw-page-item').data('id');
                window.open(lwWizard.adminUrl + 'post.php?post=' + pageId + '&action=edit', '_blank');
            });

            $('#lw-pages-list').on('click', '.lw-page-action-btn.view', function() {
                const url = $(this).closest('.lw-page-item').data('url');
                window.open(url, '_blank');
            });

            $('#lw-pages-list').on('click', '.lw-page-action-btn.delete', function() {
                const $item = $(this).closest('.lw-page-item');
                const pageId = $item.data('id');
                const title = $item.find('.lw-page-title-text').text();

                if (confirm('「' + title + '」をゴミ箱に移動しますか？')) {
                    PagesModal.deletePage(pageId, $item);
                }
            });

            // 子ページ化ボタン
            $('#lw-pages-list').on('click', '.lw-page-action-btn.indent', function() {
                const $item = $(this).closest('.lw-page-item');
                PagesModal.indentPage($item);
            });

            // 親ページ解除ボタン
            $('#lw-pages-list').on('click', '.lw-page-action-btn.outdent', function() {
                const $item = $(this).closest('.lw-page-item');
                PagesModal.outdentPage($item);
            });

            // トップページ設定変更
            $('#lw-front-page-select').on('change', function() {
                PagesModal.setFrontPage($(this).val());
            });

            // ページ編集保存
            $('#lw-save-page-edit').on('click', function() {
                PagesModal.savePageEdit();
            });

            // ステータスクリックでポップアップ表示
            $('#lw-pages-list').on('click', '.lw-page-status', function() {
                const $item = $(this).closest('.lw-page-item');
                PagesModal.openStatusModal($item);
            });

            // タスクステータスクリックでポップアップ表示
            $('#lw-pages-list').on('click', '.lw-task-status', function() {
                const $item = $(this).closest('.lw-page-item');
                PagesModal.openTaskStatusModal($item);
            });

            // タスクステータス保存
            $('#lw-save-task-status').on('click', function() {
                PagesModal.saveTaskStatus();
            });

            // 指示ボタンクリック（プレミアム限定の場合はスキップ）
            $('#lw-pages-list').on('click', '.lw-page-action-btn.instructions', function(e) {
                // プレミアム限定ボタンの場合は何もしない（別のハンドラーで処理）
                if ($(this).data('premium-only')) {
                    return;
                }
                const $item = $(this).closest('.lw-page-item');
                if (typeof InstructionsModal !== 'undefined') {
                    InstructionsModal.openModal($item);
                }
            });

            // ステータス選択変更時
            $('#lw-status-select').on('change', function() {
                const val = $(this).val();
                if (val === 'future') {
                    $('#lw-schedule-group').slideDown(200);
                    // デフォルトで明日の日付を設定
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    $('#lw-schedule-date').val(tomorrow.toISOString().split('T')[0]);
                } else {
                    $('#lw-schedule-group').slideUp(200);
                }
            });

            // ステータス保存
            $('#lw-save-status').on('click', function() {
                PagesModal.saveStatus();
            });
        },

        loadPages: function() {
            const $list = $('#lw-pages-list');
            $list.html('<li style="text-align:center;padding:20px;color:#718096;">読み込み中...</li>');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_pages',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        PagesModal.frontPageId = response.data.front_page_id || 0;
                        PagesModal.renderPages(response.data.pages);
                        PagesModal.updateFrontPageSelect(response.data.pages);
                        PagesModal.initSortable();
                        // 指示バッジを更新
                        if (typeof InstructionsModal !== 'undefined') {
                            InstructionsModal.loadInstructionCounts();
                        }
                    } else {
                        $list.html('<li style="text-align:center;padding:20px;color:#e53e3e;">読み込みに失敗しました</li>');
                    }
                },
                error: function() {
                    $list.html('<li style="text-align:center;padding:20px;color:#e53e3e;">通信エラーが発生しました</li>');
                }
            });
        },

        renderPages: function(pages) {
            const $list = $('#lw-pages-list');
            $list.empty();

            if (pages.length === 0) {
                return;
            }

            // トップページを最初に、それ以外はそのまま表示
            const frontPageId = PagesModal.frontPageId;
            let frontPage = null;
            const otherPages = [];

            pages.forEach(function(page) {
                if (page.id == frontPageId) {
                    frontPage = page;
                } else {
                    otherPages.push(page);
                }
            });

            // トップページを最初に追加
            if (frontPage) {
                $list.append(PagesModal.createPageItem(frontPage));
            }

            // その他のページを追加
            otherPages.forEach(function(page) {
                $list.append(PagesModal.createPageItem(page));
            });
        },

        updateFrontPageSelect: function(pages) {
            const $select = $('#lw-front-page-select');
            $select.find('option:not(:first)').remove();

            pages.forEach(function(page) {
                const indent = '　'.repeat(page.depth || 0);
                $select.append('<option value="' + page.id + '">' + indent + page.title + '</option>');
            });

            $select.val(PagesModal.frontPageId);
        },

        createPageItem: function(page) {
            const statusMap = {
                'publish': { class: 'published', text: '公開' },
                'draft': { class: 'draft', text: '下書き' },
                'pending': { class: 'pending', text: 'レビュー待ち' },
                'private': { class: 'private', text: '非公開' },
                'future': { class: 'future', text: '予約' }
            };
            const taskStatusMap = {
                'not-started': { class: 'not-started', text: '未着手' },
                'waiting-copy': { class: 'waiting-copy', text: '原稿待ち' },
                'waiting-material': { class: 'waiting-material', text: '素材待ち' },
                'in-progress': { class: 'in-progress', text: '作業中' },
                'internal-review': { class: 'internal-review', text: '社内確認中' },
                'revising': { class: 'revising', text: '修正中' },
                'client-review': { class: 'client-review', text: '先方確認中' },
                'revision-requested': { class: 'revision-requested', text: '修正依頼' },
                'approved': { class: 'approved', text: '承認済み' },
                'completed': { class: 'completed', text: '完了' }
            };
            const statusInfo = statusMap[page.status] || { class: 'draft', text: page.status };
            const taskStatus = page.task_status || 'not-started';
            const taskInfo = taskStatusMap[taskStatus] || taskStatusMap['not-started'];
            const depth = page.depth || 0;
            const parentId = page.parent || 0;
            const isHomePage = page.id == PagesModal.frontPageId;
            const homeBadge = isHomePage ? '<span class="lw-page-home-badge"><span class="dashicons dashicons-admin-home"></span>TOP</span>' : '';
            const itemClass = 'lw-page-item' + (isHomePage ? ' is-front-page' : '');
            const dragHandle = isHomePage
                ? '<span class="lw-page-drag-handle disabled" title="トップページは移動できません"><span class="dashicons dashicons-lock"></span></span>'
                : '<span class="lw-page-drag-handle"><span class="dashicons dashicons-menu"></span></span>';

            return '<li class="' + itemClass + '" data-id="' + page.id + '" data-parent="' + parentId + '" data-url="' + page.url + '" data-depth="' + depth + '" data-slug="' + page.slug + '" data-status="' + page.status + '" data-task-status="' + taskStatus + '">' +
                dragHandle +
                '<span class="lw-page-title">' +
                    (depth > 0 ? '<span class="lw-page-indent">' + '└ '.repeat(depth) + '</span>' : '') +
                    '<span class="lw-page-title-text">' + page.title + '</span>' +
                    homeBadge +
                '</span>' +
                '<span class="lw-page-status ' + statusInfo.class + '" title="クリックでステータス変更">' + statusInfo.text + '</span>' +
                '<div class="lw-page-actions">' +
                    (isHomePage ? '' : '<button type="button" class="lw-page-action-btn indent" title="子ページにする"><span class="dashicons dashicons-arrow-right-alt"></span></button>') +
                    (isHomePage ? '' : '<button type="button" class="lw-page-action-btn outdent" title="親を解除"><span class="dashicons dashicons-arrow-left-alt"></span></button>') +
                    '<button type="button" class="lw-page-action-btn edit-info" title="タイトル・スラッグ編集"><span class="dashicons dashicons-edit-page"></span></button>' +
                    '<button type="button" class="lw-page-action-btn edit" title="コンテンツ編集"><span class="dashicons dashicons-edit"></span></button>' +
                    '<button type="button" class="lw-page-action-btn view" title="表示"><span class="dashicons dashicons-visibility"></span></button>' +
                    (isHomePage ? '' : '<button type="button" class="lw-page-action-btn delete" title="削除"><span class="dashicons dashicons-trash"></span></button>') +
                    '<button type="button" class="lw-page-action-btn instructions' + (lwWizard.isPremium ? '' : ' lw-premium-disabled') + '" title="指示・コメント"' + (lwWizard.isPremium ? '' : ' data-premium-only="true"') + '><span class="dashicons dashicons-format-chat"></span></button>' +
                '</div>' +
                '<span class="lw-task-status ' + taskInfo.class + '" title="クリックで進捗変更">' + taskInfo.text + '</span>' +
            '</li>';
        },

        openEditModal: function($item) {
            const pageId = $item.data('id');
            const title = $item.find('.lw-page-title-text').text();
            const slug = $item.data('slug');

            $('#lw-edit-page-id').val(pageId);
            $('#lw-edit-page-title').val(title);
            $('#lw-edit-page-slug').val(slug);

            Modal.open('lw-page-edit-modal');
            $('#lw-edit-page-title').focus();
        },

        savePageEdit: function() {
            const pageId = $('#lw-edit-page-id').val();
            const title = $('#lw-edit-page-title').val().trim();
            const slug = $('#lw-edit-page-slug').val().trim();

            if (!title) {
                alert('タイトルを入力してください');
                return;
            }

            const $btn = $('#lw-save-page-edit');
            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_update_page_info',
                    nonce: lwWizard.nonce,
                    page_id: pageId,
                    title: title,
                    slug: slug
                },
                success: function(response) {
                    if (response.success) {
                        Modal.close('lw-page-edit-modal');
                        PagesModal.loadPages();
                    } else {
                        alert(response.data || '保存に失敗しました');
                    }
                    $btn.prop('disabled', false).text('保存する');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('保存する');
                }
            });
        },

        setFrontPage: function(pageId) {
            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_set_front_page',
                    nonce: lwWizard.nonce,
                    page_id: pageId
                },
                success: function(response) {
                    if (response.success) {
                        PagesModal.frontPageId = pageId;
                        PagesModal.loadPages();
                    } else {
                        alert(response.data || '設定に失敗しました');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                }
            });
        },

        // ステータス変更ポップアップを開く
        openStatusModal: function($item) {
            const pageId = $item.data('id');
            const currentStatus = $item.data('status');

            $('#lw-status-page-id').val(pageId);
            $('#lw-status-select').val(currentStatus);
            $('#lw-schedule-group').hide();

            // 予約投稿の場合は日時も設定
            if (currentStatus === 'future') {
                $('#lw-schedule-group').show();
            }

            Modal.open('lw-status-modal');
        },

        // ステータスを保存
        saveStatus: function() {
            const pageId = $('#lw-status-page-id').val();
            const status = $('#lw-status-select').val();
            const $btn = $('#lw-save-status');

            let scheduleDate = '';
            if (status === 'future') {
                const date = $('#lw-schedule-date').val();
                const time = $('#lw-schedule-time').val();
                if (!date) {
                    alert('公開日を選択してください');
                    return;
                }
                scheduleDate = date + ' ' + (time || '09:00') + ':00';
            }

            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_update_page_status',
                    nonce: lwWizard.nonce,
                    page_id: pageId,
                    status: status,
                    schedule_date: scheduleDate
                },
                success: function(response) {
                    if (response.success) {
                        Modal.close('lw-status-modal');
                        PagesModal.loadPages();
                    } else {
                        alert(response.data || 'ステータス変更に失敗しました');
                    }
                    $btn.prop('disabled', false).text('変更する');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('変更する');
                }
            });
        },

        // タスクステータス変更ポップアップを開く
        openTaskStatusModal: function($item) {
            const pageId = $item.data('id');
            const currentStatus = $item.data('task-status') || 'not-started';

            $('#lw-task-status-page-id').val(pageId);
            $('#lw-task-status-select').val(currentStatus);

            Modal.open('lw-task-status-modal');
        },

        // タスクステータスを保存
        saveTaskStatus: function() {
            const pageId = $('#lw-task-status-page-id').val();
            const taskStatus = $('#lw-task-status-select').val();
            const $btn = $('#lw-save-task-status');

            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_update_task_status',
                    nonce: lwWizard.nonce,
                    page_id: pageId,
                    task_status: taskStatus
                },
                success: function(response) {
                    if (response.success) {
                        Modal.close('lw-task-status-modal');
                        // UIを更新
                        const $item = $('#lw-pages-list .lw-page-item[data-id="' + pageId + '"]');
                        const $badge = $item.find('.lw-task-status');
                        const statusMap = {
                            'not-started': { class: 'not-started', text: '未着手' },
                            'waiting-copy': { class: 'waiting-copy', text: '原稿待ち' },
                            'waiting-material': { class: 'waiting-material', text: '素材待ち' },
                            'in-progress': { class: 'in-progress', text: '作業中' },
                            'internal-review': { class: 'internal-review', text: '社内確認中' },
                            'revising': { class: 'revising', text: '修正中' },
                            'client-review': { class: 'client-review', text: '先方確認中' },
                            'revision-requested': { class: 'revision-requested', text: '修正依頼' },
                            'approved': { class: 'approved', text: '承認済み' },
                            'completed': { class: 'completed', text: '完了' }
                        };
                        const info = statusMap[taskStatus];
                        $badge.removeClass('not-started waiting-copy waiting-material in-progress internal-review revising client-review revision-requested approved completed')
                              .addClass(info.class)
                              .text(info.text);
                        $item.attr('data-task-status', taskStatus);
                    } else {
                        alert(response.data || '保存に失敗しました');
                    }
                    $btn.prop('disabled', false).text('変更する');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('変更する');
                }
            });
        },

        initSortable: function() {
            $('#lw-pages-list').sortable({
                handle: '.lw-page-drag-handle',
                placeholder: 'lw-page-item ui-sortable-placeholder',
                tolerance: 'pointer',
                items: '> li:not(.is-front-page)', // トップページは除外
                update: function(event, ui) {
                    PagesModal.saveAllPages();
                }
            });
        },

        // 子ページにする（1つ上のページの子に）
        indentPage: function($item) {
            const $prev = $item.prev('.lw-page-item');
            if ($prev.length === 0) {
                return; // 最初のアイテムは子にできない
            }

            const currentDepth = parseInt($item.attr('data-depth')) || 0;
            if (currentDepth >= 5) {
                alert('これ以上深くできません（最大5階層）');
                return;
            }

            const prevId = $prev.data('id');
            const newDepth = currentDepth + 1;

            $item.attr('data-parent', prevId);
            $item.attr('data-depth', newDepth);
            PagesModal.updateItemDisplay($item, newDepth);
            PagesModal.saveAllPages();
        },

        // 親を解除（1階層上げる）
        outdentPage: function($item) {
            const currentDepth = parseInt($item.attr('data-depth')) || 0;
            if (currentDepth === 0) {
                return; // 既にルートレベル
            }

            const newDepth = currentDepth - 1;
            const currentParent = parseInt($item.attr('data-parent')) || 0;

            // 親の親を探す
            let newParent = 0;
            if (currentParent > 0) {
                const $parentItem = $('#lw-pages-list .lw-page-item[data-id="' + currentParent + '"]');
                if ($parentItem.length) {
                    newParent = parseInt($parentItem.attr('data-parent')) || 0;
                }
            }

            $item.attr('data-parent', newParent);
            $item.attr('data-depth', newDepth);
            PagesModal.updateItemDisplay($item, newDepth);
            PagesModal.saveAllPages();
        },

        updateItemDisplay: function($item, depth) {
            const $title = $item.find('.lw-page-title');
            const titleText = $item.find('.lw-page-title-text').text();

            $title.html(
                (depth > 0 ? '<span class="lw-page-indent">' + '└ '.repeat(depth) + '</span>' : '') +
                '<span class="lw-page-title-text">' + titleText + '</span>'
            );
        },

        openAddPageModal: function() {
            $('#lw-add-page-title').val('');
            $('#lw-add-page-slug').val('');
            $('#lw-add-title-count').text('0');
            Modal.open('lw-add-page-modal');
            $('#lw-add-page-title').focus();
        },

        addPage: function() {
            const title = $('#lw-add-page-title').val().trim();
            const slug = $('#lw-add-page-slug').val().trim();

            if (!title) {
                alert('タイトルを入力してください');
                $('#lw-add-page-title').focus();
                return;
            }

            const $btn = $('#lw-add-page-btn');
            $btn.prop('disabled', true).text('作成中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_add_page',
                    nonce: lwWizard.nonce,
                    title: title,
                    slug: slug
                },
                success: function(response) {
                    if (response.success) {
                        Modal.close('lw-add-page-modal');
                        PagesModal.loadPages();
                    } else {
                        alert(response.data || 'ページの追加に失敗しました');
                    }
                    $btn.prop('disabled', false).text('ページを作成');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('ページを作成');
                }
            });
        },

        deletePage: function(pageId, $item) {
            $item.css('opacity', '0.5');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_delete_page',
                    nonce: lwWizard.nonce,
                    page_id: pageId
                },
                success: function(response) {
                    if (response.success) {
                        $item.slideUp(200, function() {
                            $(this).remove();
                        });
                    } else {
                        alert(response.data || '削除に失敗しました');
                        $item.css('opacity', '1');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $item.css('opacity', '1');
                }
            });
        },

        saveAllPages: function() {
            const order = [];
            $('#lw-pages-list .lw-page-item').each(function(index) {
                order.push({
                    id: parseInt($(this).data('id')),
                    order: index,
                    parent: parseInt($(this).attr('data-parent')) || 0
                });
            });

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_wizard_update_page_order',
                    nonce: lwWizard.nonce,
                    order: JSON.stringify(order)
                }
            });
        }
    };

    // 指示機能モーダル
    const InstructionsModal = {
        currentPageId: null,
        instructionCounts: {},

        init: function() {
            // 指示バッジクリックでモーダルを開く
            $('#lw-pages-list').on('click', '.lw-instruction-badge', function(e) {
                e.stopPropagation();
                const $item = $(this).closest('.lw-page-item');
                InstructionsModal.openModal($item);
            });

            // 画像選択
            $('#lw-instruction-image').on('change', function() {
                const file = this.files[0];
                if (file) {
                    $('#lw-instruction-image-name').text(file.name);
                    $('#lw-instruction-image-clear').show();
                }
            });

            // 画像クリア
            $('#lw-instruction-image-clear').on('click', function() {
                $('#lw-instruction-image').val('');
                $('#lw-instruction-image-name').text('');
                $(this).hide();
            });

            // 指示追加
            $('#lw-add-instruction-btn').on('click', function() {
                InstructionsModal.addInstruction();
            });

            // 返信画像選択
            $('#lw-reply-image').on('change', function() {
                const file = this.files[0];
                if (file) {
                    $('#lw-reply-image-name').text(file.name);
                }
            });

            // 返信保存
            $('#lw-save-reply-btn').on('click', function() {
                InstructionsModal.saveReply();
            });

            // 指示ステータス変更（デリゲート）→ポップアップを開く
            $('#lw-instructions-list').on('click', '.lw-instruction-status', function() {
                const $item = $(this).closest('.lw-instruction-item');
                InstructionsModal.openStatusModal($item);
            });

            // ステータス選択変更時に担当者欄の表示切替
            $('#lw-inst-status-select').on('change', function() {
                const status = $(this).val();
                if (status === 'check-requested') {
                    $('#lw-inst-assigned-to-group').show();
                    InstructionsModal.loadEditors();
                } else {
                    $('#lw-inst-assigned-to-group').hide();
                }
            });

            // ステータス保存ボタン
            $('#lw-inst-save-status-btn').on('click', function() {
                InstructionsModal.saveStatus();
            });

            // 返信ボタン（デリゲート）
            $('#lw-instructions-list').on('click', '.lw-instruction-reply-btn', function() {
                const $item = $(this).closest('.lw-instruction-item');
                InstructionsModal.openReplyModal($item);
            });

            // 編集ボタン（デリゲート）
            $('#lw-instructions-list').on('click', '.lw-instruction-edit-btn', function() {
                const $item = $(this).closest('.lw-instruction-item');
                InstructionsModal.openEditModal($item);
            });

            // 削除ボタン（デリゲート）
            $('#lw-instructions-list').on('click', '.lw-instruction-delete-btn', function() {
                const $item = $(this).closest('.lw-instruction-item');
                InstructionsModal.deleteInstruction($item);
            });

            // 編集画像選択
            $('#lw-edit-instruction-image').on('change', function() {
                const file = this.files[0];
                if (file) {
                    $('#lw-edit-instruction-image-name').text(file.name);
                }
            });

            // 編集画像削除
            $('#lw-edit-instruction-image-remove').on('click', function() {
                InstructionsModal.removeImageFlag = true;
                $('#lw-edit-instruction-current-image').empty();
                $(this).hide();
            });

            // 編集保存
            $('#lw-save-edit-instruction-btn').on('click', function() {
                InstructionsModal.saveEdit();
            });

            // 返信削除ボタン（デリゲート）
            $('#lw-instructions-list').on('click', '.lw-reply-delete-btn', function() {
                const $reply = $(this).closest('.lw-reply-item');
                InstructionsModal.deleteReply($reply);
            });

            // 画像クリックで拡大表示
            $('#lw-instructions-list').on('click', '.lw-instruction-image img, .lw-reply-image img', function() {
                InstructionsModal.showLightbox($(this).attr('src'));
            });

            // 指示件数を取得
            InstructionsModal.loadInstructionCounts();
        },

        openModal: function($item) {
            const pageId = $item.data('id');
            const pageTitle = $item.find('.lw-page-title-text').text();

            InstructionsModal.currentPageId = pageId;
            $('#lw-instructions-page-id').val(pageId);
            $('#lw-instructions-page-title').text(pageTitle);

            // フォームをリセット
            $('#lw-instruction-content').val('');
            $('#lw-instruction-image').val('');
            $('#lw-instruction-image-name').text('');
            $('#lw-instruction-image-clear').hide();
            $('#lw-add-instruction-status').val('not-started');
            $('#lw-add-assigned-to').val('');

            Modal.open('lw-instructions-modal');
            InstructionsModal.loadInstructions(pageId);
            InstructionsModal.loadEditorsForAdd(); // 担当者一覧をロード
        },

        loadInstructions: function(pageId) {
            const $list = $('#lw-instructions-list');
            const $loading = $('#lw-instructions-loading');
            const $empty = $('#lw-instructions-empty');

            $list.empty();
            $loading.show();
            $empty.hide();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_instructions',
                    nonce: lwWizard.nonce,
                    page_id: pageId
                },
                success: function(response) {
                    $loading.hide();
                    if (response.success) {
                        const instructions = response.data.instructions;
                        $('#lw-instructions-total').text(instructions.length);

                        if (instructions.length === 0) {
                            $empty.show();
                        } else {
                            instructions.forEach(function(inst) {
                                $list.append(InstructionsModal.createInstructionItem(inst));
                            });
                            InstructionsModal.initSortable();
                        }
                    }
                },
                error: function() {
                    $loading.hide();
                    $empty.html('<p style="color:#e53e3e;">読み込みに失敗しました</p>').show();
                }
            });
        },

        createInstructionItem: function(inst) {
            const statusMap = {
                'not-started': { class: 'not-started', text: '未着手' },
                'check-requested': { class: 'check-requested', text: 'チェック依頼' },
                'completed': { class: 'completed', text: '完了' }
            };
            const statusInfo = statusMap[inst.status] || statusMap['not-started'];

            let imageHtml = '';
            if (inst.image_url) {
                imageHtml = '<div class="lw-instruction-image"><img src="' + inst.image_url + '" alt="指示画像"></div>';
            }

            let repliesHtml = '';
            if (inst.replies && inst.replies.length > 0) {
                repliesHtml = '<div class="lw-instruction-replies">';
                inst.replies.forEach(function(reply) {
                    let replyImageHtml = '';
                    if (reply.image_url) {
                        replyImageHtml = '<div class="lw-reply-image"><img src="' + reply.image_url + '" alt="返信画像"></div>';
                    }
                    repliesHtml += '<div class="lw-reply-item" data-id="' + reply.id + '">' +
                        '<span class="lw-reply-icon"><span class="dashicons dashicons-format-chat"></span></span>' +
                        '<div class="lw-reply-content">' +
                            '<div class="lw-reply-text">' + InstructionsModal.escapeHtml(reply.content) + '</div>' +
                            replyImageHtml +
                            '<div class="lw-reply-meta">' +
                                '<span class="lw-reply-author"><span class="dashicons dashicons-admin-users"></span>' + (reply.author_name || '不明') + '</span>' +
                                '<span class="lw-reply-date"><span class="dashicons dashicons-clock"></span>' + InstructionsModal.formatDate(reply.created_at) + '</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="lw-reply-actions">' +
                            '<button type="button" class="lw-instruction-action-btn delete lw-reply-delete-btn" title="削除"><span class="dashicons dashicons-trash"></span></button>' +
                        '</div>' +
                    '</div>';
                });
                repliesHtml += '</div>';
            }

            // 担当者表示
            let assignedHtml = '';
            if (inst.assigned_to && inst.assigned_name) {
                assignedHtml = '<span class="lw-instruction-assigned"><span class="dashicons dashicons-businessman"></span>' + inst.assigned_name + '</span>';
            }

            // リンクボタン
            let linkBtnHtml = '';
            if (inst.link_url) {
                linkBtnHtml = '<a href="' + InstructionsModal.escapeAttr(inst.link_url) + '" target="_blank" class="lw-instruction-action-btn lw-instruction-link-btn" title="リンクを開く"><span class="dashicons dashicons-external"></span></a>';
            }

            return '<li class="lw-instruction-item" data-id="' + inst.id + '" data-content="' + InstructionsModal.escapeAttr(inst.content) + '" data-image-url="' + (inst.image_url || '') + '" data-assigned-to="' + (inst.assigned_to || '') + '" data-link-url="' + (inst.link_url || '') + '">' +
                '<div class="lw-instruction-main">' +
                    '<span class="lw-instruction-drag"><span class="dashicons dashicons-menu"></span></span>' +
                    '<div class="lw-instruction-content">' +
                        '<div class="lw-instruction-text">' + InstructionsModal.escapeHtml(inst.content) + '</div>' +
                        imageHtml +
                        '<div class="lw-instruction-meta">' +
                            '<span class="lw-instruction-status ' + statusInfo.class + '" title="クリックでステータス変更">' + statusInfo.text + '</span>' +
                            assignedHtml +
                            '<span class="lw-instruction-author"><span class="dashicons dashicons-admin-users"></span>' + (inst.author_name || '不明') + '</span>' +
                            '<span class="lw-instruction-date"><span class="dashicons dashicons-clock"></span>' + InstructionsModal.formatDate(inst.created_at) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lw-instruction-actions">' +
                        linkBtnHtml +
                        '<button type="button" class="lw-instruction-action-btn lw-instruction-edit-btn" title="編集"><span class="dashicons dashicons-edit"></span></button>' +
                        '<button type="button" class="lw-instruction-action-btn lw-instruction-reply-btn" title="返信"><span class="dashicons dashicons-format-chat"></span></button>' +
                        '<button type="button" class="lw-instruction-action-btn delete lw-instruction-delete-btn" title="削除"><span class="dashicons dashicons-trash"></span></button>' +
                    '</div>' +
                '</div>' +
                repliesHtml +
            '</li>';
        },

        addInstruction: function() {
            const pageId = InstructionsModal.currentPageId;
            const content = $('#lw-instruction-content').val().trim();
            const imageFile = $('#lw-instruction-image')[0].files[0];
            const status = $('#lw-add-instruction-status').val();
            const assignedTo = $('#lw-add-assigned-to').val() || '';

            if (!content) {
                alert('指示内容を入力してください');
                return;
            }

            const $btn = $('#lw-add-instruction-btn');
            $btn.prop('disabled', true).html('<span class="dashicons dashicons-update spin"></span> 追加中...');

            const formData = new FormData();
            formData.append('action', 'lw_add_instruction');
            formData.append('nonce', lwWizard.nonce);
            formData.append('page_id', pageId);
            formData.append('content', content);
            formData.append('status', status);
            formData.append('assigned_to', assignedTo);
            const linkUrl = $('#lw-add-instruction-link-url').val().trim();
            if (linkUrl) {
                formData.append('link_url', linkUrl);
            }
            if (imageFile) {
                formData.append('image', imageFile);
            }

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        // フォームをリセット
                        $('#lw-instruction-content').val('');
                        $('#lw-instruction-image').val('');
                        $('#lw-instruction-image-name').text('');
                        $('#lw-instruction-image-clear').hide();
                        $('#lw-add-instruction-status').val('not-started');
                        $('#lw-add-assigned-to').val('');
                        $('#lw-add-instruction-link-url').val('');
                        // リロード
                        InstructionsModal.loadInstructions(pageId);
                        InstructionsModal.loadInstructionCounts();
                    } else {
                        alert(response.data || '追加に失敗しました');
                    }
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-plus"></span> 指示を追加');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-plus"></span> 指示を追加');
                }
            });
        },

        editorsCache: null,
        currentStatusItem: null,

        openStatusModal: function($item) {
            const instructionId = $item.data('id');
            const $status = $item.find('.lw-instruction-status');
            const currentStatus = $status.hasClass('not-started') ? 'not-started' :
                                  $status.hasClass('check-requested') ? 'check-requested' : 'completed';

            InstructionsModal.currentStatusItem = $item;
            $('#lw-inst-status-instruction-id').val(instructionId);
            $('#lw-inst-status-select').val(currentStatus);

            // チェック依頼の場合は担当者欄を表示
            if (currentStatus === 'check-requested') {
                $('#lw-inst-assigned-to-group').show();
                // ユーザー一覧をロード
                InstructionsModal.loadEditors(function() {
                    const currentAssigned = $item.data('assigned-to') || '';
                    $('#lw-inst-assigned-to-select').val(currentAssigned);
                });
            } else {
                $('#lw-inst-assigned-to-group').hide();
            }

            Modal.open('lw-status-change-modal');
        },

        loadEditors: function(callback) {
            // キャッシュがあれば使う
            if (InstructionsModal.editorsCache) {
                if (callback) callback();
                return;
            }

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_editors',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        InstructionsModal.editorsCache = response.data.users;
                        const $select = $('#lw-inst-assigned-to-select');
                        $select.find('option:not(:first)').remove();
                        response.data.users.forEach(function(user) {
                            $select.append('<option value="' + user.id + '">' + user.name + '</option>');
                        });
                    }
                    if (callback) callback();
                }
            });
        },

        loadEditorsForAdd: function() {
            // キャッシュがあれば使う
            if (InstructionsModal.editorsCache) {
                const $select = $('#lw-add-assigned-to');
                $select.find('option:not(:first)').remove();
                InstructionsModal.editorsCache.forEach(function(user) {
                    $select.append('<option value="' + user.id + '">' + user.name + '</option>');
                });
                return;
            }

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_editors',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        InstructionsModal.editorsCache = response.data.users;
                        const $select = $('#lw-add-assigned-to');
                        $select.find('option:not(:first)').remove();
                        response.data.users.forEach(function(user) {
                            $select.append('<option value="' + user.id + '">' + user.name + '</option>');
                        });
                    }
                }
            });
        },

        saveStatus: function() {
            const instructionId = $('#lw-inst-status-instruction-id').val();
            const status = $('#lw-inst-status-select').val();
            const assignedTo = status === 'check-requested' ? $('#lw-inst-assigned-to-select').val() : '';

            const $btn = $('#lw-inst-save-status-btn');
            $btn.prop('disabled', true).text('保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_update_instruction_status',
                    nonce: lwWizard.nonce,
                    instruction_id: instructionId,
                    status: status,
                    assigned_to: assignedTo
                },
                success: function(response) {
                    if (response.success) {
                        // UIを更新
                        const statusMap = {
                            'not-started': { class: 'not-started', text: '未着手' },
                            'check-requested': { class: 'check-requested', text: 'チェック依頼' },
                            'completed': { class: 'completed', text: '完了' }
                        };
                        const statusInfo = statusMap[status];

                        if (InstructionsModal.currentStatusItem) {
                            const $status = InstructionsModal.currentStatusItem.find('.lw-instruction-status');
                            $status.removeClass('not-started check-requested completed')
                                   .addClass(statusInfo.class)
                                   .text(statusInfo.text);

                            // 担当者データを保存
                            InstructionsModal.currentStatusItem.data('assigned-to', assignedTo);

                            // 担当者表示を更新
                            let $assigned = InstructionsModal.currentStatusItem.find('.lw-instruction-assigned');
                            if (status === 'check-requested' && assignedTo) {
                                const userName = $('#lw-assigned-to-select option:selected').text();
                                if ($assigned.length === 0) {
                                    InstructionsModal.currentStatusItem.find('.lw-instruction-meta .lw-instruction-status').after(
                                        '<span class="lw-instruction-assigned"><span class="dashicons dashicons-businessman"></span>' + userName + '</span>'
                                    );
                                } else {
                                    $assigned.html('<span class="dashicons dashicons-businessman"></span>' + userName);
                                }
                            } else {
                                $assigned.remove();
                            }
                        }

                        InstructionsModal.loadInstructionCounts();
                        Modal.close('lw-status-change-modal');
                    } else {
                        alert(response.data || '更新に失敗しました');
                    }
                    $btn.prop('disabled', false).text('変更する');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('変更する');
                }
            });
        },

        openReplyModal: function($item) {
            const instructionId = $item.data('id');
            $('#lw-reply-parent-id').val(instructionId);
            $('#lw-reply-content').val('');
            $('#lw-reply-image').val('');
            $('#lw-reply-image-name').text('');
            Modal.open('lw-reply-modal');
        },

        saveReply: function() {
            const parentId = $('#lw-reply-parent-id').val();
            const content = $('#lw-reply-content').val().trim();
            const imageFile = $('#lw-reply-image')[0].files[0];
            const pageId = InstructionsModal.currentPageId;

            if (!content) {
                alert('返信内容を入力してください');
                return;
            }

            const $btn = $('#lw-save-reply-btn');
            $btn.prop('disabled', true).text('保存中...');

            const formData = new FormData();
            formData.append('action', 'lw_add_instruction');
            formData.append('nonce', lwWizard.nonce);
            formData.append('page_id', pageId);
            formData.append('parent_id', parentId);
            formData.append('content', content);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        Modal.close('lw-reply-modal');
                        InstructionsModal.loadInstructions(pageId);
                    } else {
                        alert(response.data || '返信に失敗しました');
                    }
                    $btn.prop('disabled', false).text('返信する');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('返信する');
                }
            });
        },

        deleteInstruction: function($item) {
            if (!confirm('この指示を削除しますか？\n（返信と画像も削除されます）')) {
                return;
            }

            const instructionId = $item.data('id');
            const pageId = InstructionsModal.currentPageId;

            $item.css('opacity', '0.5');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_delete_instruction',
                    nonce: lwWizard.nonce,
                    instruction_id: instructionId
                },
                success: function(response) {
                    if (response.success) {
                        $item.slideUp(200, function() {
                            $(this).remove();
                            const count = $('#lw-instructions-list .lw-instruction-item').length;
                            $('#lw-instructions-total').text(count);
                            if (count === 0) {
                                $('#lw-instructions-empty').show();
                            }
                        });
                        InstructionsModal.loadInstructionCounts();
                    } else {
                        alert(response.data || '削除に失敗しました');
                        $item.css('opacity', '1');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $item.css('opacity', '1');
                }
            });
        },

        deleteReply: function($reply) {
            if (!confirm('この返信を削除しますか？')) {
                return;
            }

            const replyId = $reply.data('id');
            const pageId = InstructionsModal.currentPageId;

            $reply.css('opacity', '0.5');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_delete_instruction',
                    nonce: lwWizard.nonce,
                    instruction_id: replyId
                },
                success: function(response) {
                    if (response.success) {
                        $reply.slideUp(200, function() {
                            $(this).remove();
                        });
                    } else {
                        alert(response.data || '削除に失敗しました');
                        $reply.css('opacity', '1');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $reply.css('opacity', '1');
                }
            });
        },

        initSortable: function() {
            $('#lw-instructions-list').sortable({
                handle: '.lw-instruction-drag',
                placeholder: 'lw-instruction-item ui-sortable-placeholder',
                tolerance: 'pointer',
                update: function() {
                    InstructionsModal.saveOrder();
                }
            });
        },

        saveOrder: function() {
            const order = [];
            $('#lw-instructions-list .lw-instruction-item').each(function() {
                order.push($(this).data('id'));
            });

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_update_instruction_order',
                    nonce: lwWizard.nonce,
                    order: JSON.stringify(order)
                }
            });
        },

        loadInstructionCounts: function() {
            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_instruction_counts',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        InstructionsModal.instructionCounts = response.data.counts;
                        InstructionsModal.updateBadges();
                    }
                }
            });
        },

        updateBadges: function() {
            // 既存のバッジを削除
            $('.lw-instruction-badge').remove();

            // 各ページに未完了バッジを追加
            $('#lw-pages-list .lw-page-item').each(function() {
                const pageId = $(this).data('id');
                const counts = InstructionsModal.instructionCounts[pageId];

                if (counts) {
                    const $title = $(this).find('.lw-page-title');

                    // 作業（未着手）バッジ
                    if (counts.work > 0) {
                        $title.append(
                            '<span class="lw-instruction-badge lw-badge-work" title="未着手の作業があります">' +
                                '<span class="dashicons dashicons-edit"></span>' + counts.work +
                            '</span>'
                        );
                    }

                    // チェック依頼バッジ
                    if (counts.check > 0) {
                        $title.append(
                            '<span class="lw-instruction-badge lw-badge-check" title="チェック依頼があります">' +
                                '<span class="dashicons dashicons-visibility"></span>' + counts.check +
                            '</span>'
                        );
                    }
                }
            });
        },

        showLightbox: function(src) {
            const $lightbox = $('<div class="lw-image-lightbox">' +
                '<button class="lw-image-lightbox-close"><span class="dashicons dashicons-no-alt"></span></button>' +
                '<img src="' + src + '">' +
            '</div>');

            $('body').append($lightbox);

            $lightbox.on('click', function() {
                $(this).remove();
            });
        },

        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        formatDate: function(dateStr) {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;

            // 1時間以内
            if (diff < 3600000) {
                const mins = Math.floor(diff / 60000);
                return mins <= 0 ? '今' : mins + '分前';
            }
            // 24時間以内
            if (diff < 86400000) {
                const hours = Math.floor(diff / 3600000);
                return hours + '時間前';
            }
            // 7日以内
            if (diff < 604800000) {
                const days = Math.floor(diff / 86400000);
                return days + '日前';
            }
            // それ以外
            return (date.getMonth() + 1) + '/' + date.getDate();
        },

        escapeAttr: function(text) {
            return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        removeImageFlag: false,
        editingInstructionId: null,

        openEditModal: function($item) {
            const instructionId = $item.data('id');
            const content = $item.data('content');
            const imageUrl = $item.data('image-url');

            InstructionsModal.editingInstructionId = instructionId;
            InstructionsModal.removeImageFlag = false;

            $('#lw-edit-instruction-id').val(instructionId);
            $('#lw-edit-instruction-content').val(content);
            $('#lw-edit-instruction-image').val('');
            $('#lw-edit-instruction-image-name').text('');

            // 現在の画像を表示
            const $currentImage = $('#lw-edit-instruction-current-image');
            $currentImage.empty();
            if (imageUrl) {
                $currentImage.html('<img src="' + imageUrl + '" alt="現在の画像" style="max-width:100%;max-height:150px;border-radius:6px;margin-bottom:10px;">');
                $('#lw-edit-instruction-image-remove').show();
            } else {
                $('#lw-edit-instruction-image-remove').hide();
            }

            Modal.open('lw-edit-instruction-modal');
        },

        saveEdit: function() {
            const instructionId = InstructionsModal.editingInstructionId;
            const content = $('#lw-edit-instruction-content').val().trim();
            const imageFile = $('#lw-edit-instruction-image')[0].files[0];
            const pageId = InstructionsModal.currentPageId;

            if (!content) {
                alert('指示内容を入力してください');
                return;
            }

            const $btn = $('#lw-save-edit-instruction-btn');
            $btn.prop('disabled', true).text('保存中...');

            const formData = new FormData();
            formData.append('action', 'lw_update_instruction');
            formData.append('nonce', lwWizard.nonce);
            formData.append('instruction_id', instructionId);
            formData.append('content', content);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (InstructionsModal.removeImageFlag) {
                formData.append('remove_image', '1');
            }

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        Modal.close('lw-edit-instruction-modal');
                        InstructionsModal.loadInstructions(pageId);
                    } else {
                        alert(response.data || '保存に失敗しました');
                    }
                    $btn.prop('disabled', false).text('保存する');
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('保存する');
                }
            });
        }
    };

    // DOM Ready
    $(function() {
        Modal.init();
        SiteInfoModal.init();
        ColorFontModal.init();
        HeaderModal.init();
        FooterModal.init();
        PublishModal.init();
        ExtensionCheck.init();
        PagesModal.init();
        StepStatus.init();
        SecurityPluginModal.init();
        PermalinkModal.init();
        FaviconModal.init();
        PrivacyModal.init();
        // 指示・コメント機能はプレミアム限定
        if (lwWizard.isPremium) {
            InstructionsModal.init();
            TaskList.init();
        }

        // プレミアムプラン紹介ポップアップ
        $('#lw-premium-plan-trigger').on('click', function() {
            Modal.open('lw-premium-intro-modal');
        });

        // URLパラメータでプレミアムポップアップを自動表示
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('show_premium_popup') === '1') {
            // 少し遅延させてページ読み込み完了後に表示
            setTimeout(function() {
                Modal.open('lw-premium-intro-modal');
            }, 500);
            // URLからパラメータを削除（履歴を汚さないため）
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    });

    // ========================================
    // セキュリティプラグイン選択モーダル
    const SecurityPluginModal = {
        selectedPlugin: null,

        init: function() {
            // ステップ15をクリックでモーダルを開く
            $('#lw-step-security-plugin').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-security-plugin-modal');
            });

            // ラジオボタン選択時
            $('input[name="security_plugin"]').on('change', function() {
                const $radio = $(this);
                SecurityPluginModal.selectedPlugin = {
                    key: $radio.val(),
                    slug: $radio.data('slug'),
                    file: $radio.data('file'),
                    installed: $radio.data('installed') === 1 || $radio.data('installed') === '1',
                    active: $radio.data('active') === 1 || $radio.data('active') === '1'
                };

                // ボタンの状態を更新
                SecurityPluginModal.updateButtons();
            });

            // インストールボタン
            $('#lw-security-install-btn').on('click', function() {
                if (!SecurityPluginModal.selectedPlugin) return;

                if (SecurityPluginModal.selectedPlugin.installed) {
                    // すでにインストール済みなら有効化へ
                    SecurityPluginModal.showActivateButton();
                } else {
                    SecurityPluginModal.installPlugin();
                }
            });

            // 有効化ボタン
            $('#lw-security-activate-btn').on('click', function() {
                SecurityPluginModal.activatePlugin();
            });
        },

        updateButtons: function() {
            const plugin = SecurityPluginModal.selectedPlugin;
            const $installBtn = $('#lw-security-install-btn');
            const $activateBtn = $('#lw-security-activate-btn');

            if (!plugin) {
                $installBtn.prop('disabled', true);
                $activateBtn.hide();
                return;
            }

            if (plugin.active) {
                // 既に有効化済み
                $installBtn.hide();
                $activateBtn.hide();
            } else if (plugin.installed) {
                // インストール済みだが未有効化
                $installBtn.hide();
                $activateBtn.show();
            } else {
                // 未インストール
                $installBtn.prop('disabled', false).show();
                $activateBtn.hide();
            }
        },

        showStatus: function(message, showSpinner) {
            const $status = $('#lw-security-status');
            $status.show();
            $status.find('.lw-security-status-text').text(message);
            if (showSpinner) {
                $status.find('.spinner').addClass('is-active');
            } else {
                $status.find('.spinner').removeClass('is-active');
            }
        },

        hideStatus: function() {
            $('#lw-security-status').hide();
        },

        showActivateButton: function() {
            $('#lw-security-install-btn').hide();
            $('#lw-security-activate-btn').show();
        },

        installPlugin: function() {
            const plugin = SecurityPluginModal.selectedPlugin;

            SecurityPluginModal.showStatus('プラグインをインストール中...', true);
            $('#lw-security-install-btn').prop('disabled', true);

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_install_security_plugin',
                    nonce: lwWizard.nonce,
                    plugin_slug: plugin.slug
                },
                success: function(response) {
                    if (response.success) {
                        SecurityPluginModal.showStatus('インストール完了！', false);
                        SecurityPluginModal.selectedPlugin.installed = true;

                        // ラジオボタンのdata属性も更新
                        $('input[name="security_plugin"][value="' + plugin.key + '"]')
                            .data('installed', '1');

                        // バッジを更新
                        const $item = $('input[name="security_plugin"][value="' + plugin.key + '"]')
                            .closest('.lw-security-plugin-item');
                        if (!$item.find('.lw-badge-installed').length && !$item.find('.lw-badge-active').length) {
                            $item.find('.lw-security-plugin-header')
                                .append('<span class="lw-security-plugin-badge lw-badge-installed">インストール済み</span>');
                        }

                        setTimeout(function() {
                            SecurityPluginModal.hideStatus();
                            SecurityPluginModal.showActivateButton();
                        }, 1000);
                    } else {
                        SecurityPluginModal.showStatus('エラー: ' + response.data, false);
                        $('#lw-security-install-btn').prop('disabled', false);
                    }
                },
                error: function() {
                    SecurityPluginModal.showStatus('通信エラーが発生しました', false);
                    $('#lw-security-install-btn').prop('disabled', false);
                }
            });
        },

        activatePlugin: function() {
            const plugin = SecurityPluginModal.selectedPlugin;

            SecurityPluginModal.showStatus('プラグインを有効化中...', true);
            $('#lw-security-activate-btn').prop('disabled', true);

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_activate_security_plugin',
                    nonce: lwWizard.nonce,
                    plugin_file: plugin.file
                },
                success: function(response) {
                    if (response.success) {
                        SecurityPluginModal.showStatus('有効化完了！セキュリティプラグインが有効になりました。', false);
                        SecurityPluginModal.selectedPlugin.active = true;

                        // ラジオボタンを無効化
                        const $radio = $('input[name="security_plugin"][value="' + plugin.key + '"]');
                        $radio.prop('disabled', true).data('active', '1');

                        // アイテムのスタイルを更新
                        const $item = $radio.closest('.lw-security-plugin-item');
                        $item.addClass('is-active');
                        $item.find('.lw-badge-installed').remove();
                        $item.find('.lw-security-plugin-header')
                            .append('<span class="lw-security-plugin-badge lw-badge-active">有効化済み</span>');

                        // ボタンを非表示
                        $('#lw-security-activate-btn').hide();

                        // ステップ15を完了にする
                        const $toggle = $('.lw-step-toggle[data-step="15"]');
                        if (!$toggle.is(':checked')) {
                            $toggle.prop('checked', true).trigger('change');
                        }

                        setTimeout(function() {
                            SecurityPluginModal.hideStatus();
                        }, 2000);
                    } else {
                        SecurityPluginModal.showStatus('エラー: ' + response.data, false);
                        $('#lw-security-activate-btn').prop('disabled', false);
                    }
                },
                error: function() {
                    SecurityPluginModal.showStatus('通信エラーが発生しました', false);
                    $('#lw-security-activate-btn').prop('disabled', false);
                }
            });
        }
    };

    // パーマリンク設定モーダル
    const PermalinkModal = {
        init: function() {
            // ステップ3をクリックでモーダルを開く
            $('#lw-step-permalink').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-permalink-modal');
                // 警告の初期状態を設定
                PermalinkModal.checkBasicWarning();
            });

            // ラジオボタン選択時のスタイル更新と警告表示
            $('input[name="permalink_structure"]').on('change', function() {
                $('.lw-permalink-item').removeClass('is-selected');
                $(this).closest('.lw-permalink-item').addClass('is-selected');
                PermalinkModal.checkBasicWarning();
            });

            // 保存ボタン
            $('#lw-permalink-save').on('click', function() {
                PermalinkModal.save();
            });
        },

        checkBasicWarning: function() {
            const selectedValue = $('input[name="permalink_structure"]:checked').val();
            if (selectedValue === '') {
                $('#lw-permalink-basic-warning').slideDown(200);
            } else {
                $('#lw-permalink-basic-warning').slideUp(200);
            }
        },

        save: function() {
            const $btn = $('#lw-permalink-save');
            const structure = $('input[name="permalink_structure"]:checked').val();

            $btn.prop('disabled', true).html('<span class="spinner is-active" style="float:none;margin:0;"></span> 保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_permalink',
                    nonce: lwWizard.nonce,
                    permalink_structure: structure
                },
                success: function(response) {
                    if (response.success) {
                        $btn.html('<span class="dashicons dashicons-yes"></span> 保存しました！');

                        // ステップ3を完了にする
                        const $toggle = $('.lw-step-toggle[data-step="3"]');
                        if (!$toggle.is(':checked')) {
                            $toggle.prop('checked', true).trigger('change');
                        }

                        setTimeout(function() {
                            Modal.close('lw-permalink-modal');
                            $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 保存する');
                        }, 1000);
                    } else {
                        alert('エラー: ' + response.data);
                        $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 保存する');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 保存する');
                }
            });
        }
    };

    // ファビコン設定モーダル
    const FaviconModal = {
        init: function() {
            // ステップ17をクリックでモーダルを開く
            $('#lw-step-favicon').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-favicon-modal');
            });

            // 画像選択
            $('#lw-favicon-select').on('click', function() {
                FaviconModal.openMediaUploader();
            });

            // 削除
            $('#lw-favicon-remove').on('click', function() {
                $('#lw-favicon-id').val('');
                $('#lw-favicon-preview').html('<span class="lw-no-favicon"><span class="dashicons dashicons-format-image"></span><span>未設定</span></span>');
                $(this).hide();
            });

            // 保存ボタン
            $('#lw-favicon-save').on('click', function() {
                FaviconModal.save();
            });
        },

        openMediaUploader: function() {
            const frame = wp.media({
                title: 'ファビコン画像を選択',
                button: { text: '選択' },
                library: { type: 'image' },
                multiple: false
            });

            frame.on('select', function() {
                const attachment = frame.state().get('selection').first().toJSON();
                $('#lw-favicon-id').val(attachment.id);
                $('#lw-favicon-preview').html('<img src="' + attachment.url + '" alt="ファビコン">');
                $('#lw-favicon-remove').show();
            });

            frame.open();
        },

        save: function() {
            const $btn = $('#lw-favicon-save');
            const iconId = $('#lw-favicon-id').val();

            $btn.prop('disabled', true).html('<span class="spinner is-active" style="float:none;margin:0;"></span> 保存中...');

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_favicon',
                    nonce: lwWizard.nonce,
                    icon_id: iconId
                },
                success: function(response) {
                    if (response.success) {
                        $btn.html('<span class="dashicons dashicons-yes"></span> 保存しました！');

                        // ステップ17を完了にする
                        const $toggle = $('.lw-step-toggle[data-step="17"]');
                        if (!$toggle.is(':checked')) {
                            $toggle.prop('checked', true).trigger('change');
                        }

                        setTimeout(function() {
                            Modal.close('lw-favicon-modal');
                            $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 保存する');
                        }, 1000);
                    } else {
                        alert('エラー: ' + response.data);
                        $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 保存する');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 保存する');
                }
            });
        }
    };

    // プライバシーポリシー確認モーダル
    const PrivacyModal = {
        init: function() {
            // ステップ12をクリックでモーダルを開く
            $('#lw-step-privacy').on('click', function(e) {
                e.preventDefault();
                Modal.open('lw-privacy-modal');
            });

            // チェックボックス変更時に必要なページを更新
            $('.lw-privacy-checkbox').on('change', function() {
                PrivacyModal.updateRequirements();
            });

            // 確認完了ボタン
            $('#lw-privacy-complete').on('click', function() {
                PrivacyModal.complete();
            });
        },

        updateRequirements: function() {
            const hasContactForm = $('#lw-privacy-contact-form').is(':checked');
            const hasEC = $('#lw-privacy-ec').is(':checked');
            const hasMembership = $('#lw-privacy-membership').is(':checked');
            const hasAnalytics = $('#lw-privacy-analytics').is(':checked');
            const hasAds = $('#lw-privacy-ads').is(':checked');
            const hasNewsletter = $('#lw-privacy-newsletter').is(':checked');

            const requirements = [];

            // プライバシーポリシーは常に必要
            if (hasContactForm || hasEC || hasMembership || hasAnalytics || hasAds || hasNewsletter) {
                requirements.push({
                    title: 'プライバシーポリシー',
                    desc: '個人情報の取り扱いについて明記したページ。お問い合わせフォームや会員登録がある場合は必須です。',
                    type: 'required',
                    icon: 'dashicons-shield'
                });
            }

            // 利用規約
            if (hasMembership || hasEC) {
                requirements.push({
                    title: '利用規約',
                    desc: 'サービスの利用条件を定めたページ。会員制サイトやECサイトでは必須です。',
                    type: 'required',
                    icon: 'dashicons-media-document'
                });
                $('#lw-privacy-status-terms').show();
            } else {
                $('#lw-privacy-status-terms').hide();
            }

            // 特定商取引法に基づく表記
            if (hasEC) {
                requirements.push({
                    title: '特定商取引法に基づく表記',
                    desc: '通信販売を行う場合に法律で義務付けられているページ。事業者情報や返品条件などを記載します。',
                    type: 'required',
                    icon: 'dashicons-store'
                });
                $('#lw-privacy-status-law').show();
            } else {
                $('#lw-privacy-status-law').hide();
            }

            // Cookieポリシー
            if (hasAnalytics || hasAds) {
                requirements.push({
                    title: 'Cookieポリシー',
                    desc: 'Cookie（クッキー）の使用について説明するページ。アクセス解析や広告を使用する場合は推奨されます。',
                    type: 'recommended',
                    icon: 'dashicons-admin-settings'
                });
                $('#lw-privacy-status-cookie').show();
            } else {
                $('#lw-privacy-status-cookie').hide();
            }

            // 表示を更新
            const $container = $('#lw-privacy-requirements');
            if (requirements.length === 0) {
                $container.html('<p class="lw-privacy-hint">上記の項目にチェックを入れると、必要なページが表示されます。</p>');
            } else {
                let html = '<div class="lw-privacy-req-list">';
                requirements.forEach(function(req) {
                    html += '<div class="lw-privacy-req-item ' + req.type + '">';
                    html += '<div class="lw-privacy-req-icon"><span class="dashicons ' + req.icon + '"></span></div>';
                    html += '<div class="lw-privacy-req-content">';
                    html += '<p class="lw-privacy-req-title">' + req.title;
                    html += '<span class="lw-privacy-req-badge ' + req.type + '">' + (req.type === 'required' ? '必須' : '推奨') + '</span>';
                    html += '</p>';
                    html += '<p class="lw-privacy-req-desc">' + req.desc + '</p>';
                    html += '</div>';
                    html += '</div>';
                });
                html += '</div>';
                $container.html(html);
            }
        },

        complete: function() {
            const $btn = $('#lw-privacy-complete');
            $btn.prop('disabled', true).html('<span class="dashicons dashicons-yes"></span> 完了しました！');

            // ステップ12を完了にする
            const $toggle = $('.lw-step-toggle[data-step="12"]');
            if (!$toggle.is(':checked')) {
                $toggle.prop('checked', true).trigger('change');
            }

            setTimeout(function() {
                Modal.close('lw-privacy-modal');
                $btn.prop('disabled', false).html('<span class="dashicons dashicons-yes"></span> 確認完了');
            }, 1000);
        }
    };

    // 依頼一覧（TaskList）
    // ========================================
    const TaskList = {
        currentFilter: 'all',
        allInstructions: [],
        counts: { all: 0, work: 0, check: 0 },
        targetType: 'page',
        targetPosts: [],
        editorsCache: null,

        init: function() {
            // 依頼一覧ボタンクリック
            $('#lw-tasklist-trigger').on('click', function() {
                TaskList.openModal();
            });

            // フィルタータブ
            $(document).on('click', '.lw-tasklist-tab', function() {
                const filter = $(this).data('filter');
                TaskList.setFilter(filter);
            });

            // 新規追加ボタン
            $('#lw-tasklist-add-btn').on('click', function() {
                TaskList.openNewModal();
            });

            // ターゲットタイプ変更
            $('input[name="lw-target-type"]').on('change', function() {
                TaskList.onTargetTypeChange($(this).val());
            });

            // ターゲット検索
            $('#lw-target-search').on('input', function() {
                TaskList.filterTargetList($(this).val());
            });

            // ターゲット選択クリア
            $('#lw-target-clear').on('click', function() {
                TaskList.clearTargetSelection();
            });

            // ターゲット選択（デリゲート）
            $(document).on('click', '.lw-target-item', function() {
                const id = $(this).data('id');
                const title = $(this).data('title');
                TaskList.selectTarget(id, title);
            });

            // 画像選択
            $('#lw-tasklist-new-image-btn').on('click', function() {
                $('#lw-tasklist-new-image').click();
            });

            $('#lw-tasklist-new-image').on('change', function() {
                const file = this.files[0];
                if (file) {
                    $('#lw-tasklist-new-image-name').text(file.name);
                }
            });

            // 保存ボタン
            $('#lw-tasklist-new-save').on('click', function() {
                TaskList.saveNewInstruction();
            });

            // 初期ロード（バッジ用）
            TaskList.loadBadgeCount();
        },

        openNewModal: function() {
            // フォームをリセット
            $('input[name="lw-target-type"][value="page"]').prop('checked', true);
            TaskList.targetType = 'page';
            $('#lw-target-select-group').show();
            $('#lw-custom-title-group').hide();
            $('#lw-target-select-label').text('固定ページを選択');
            $('#lw-target-search').val('');
            $('#lw-target-id').val('');
            $('#lw-target-selected').hide();
            $('#lw-tasklist-new-content').val('');
            $('#lw-tasklist-new-image').val('');
            $('#lw-tasklist-new-image-name').text('');
            $('#lw-tasklist-new-status').val('not-started');
            $('#lw-tasklist-new-assigned').val('');
            $('#lw-custom-title').val('');
            $('#lw-tasklist-new-link-url').val('');

            Modal.open('lw-tasklist-new-modal');
            TaskList.loadTargetList('page');
            TaskList.loadEditorsForNew(); // 担当者一覧をロード
        },

        onTargetTypeChange: function(type) {
            TaskList.targetType = type;
            TaskList.clearTargetSelection();
            $('#lw-target-search').val('');

            if (type === 'custom') {
                $('#lw-target-select-group').hide();
                $('#lw-custom-title-group').show();
            } else {
                $('#lw-target-select-group').show();
                $('#lw-custom-title-group').hide();

                const label = type === 'page' ? '固定ページを選択' : '投稿を選択';
                $('#lw-target-select-label').text(label);
                TaskList.loadTargetList(type);
            }
        },

        loadTargetList: function(postType) {
            $('#lw-target-loading').show();
            $('#lw-target-list').empty();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_post_list',
                    nonce: lwWizard.nonce,
                    post_type: postType
                },
                success: function(response) {
                    $('#lw-target-loading').hide();

                    if (response.success) {
                        TaskList.targetPosts = response.data.posts;
                        TaskList.renderTargetList(TaskList.targetPosts);
                    }
                },
                error: function() {
                    $('#lw-target-loading').hide();
                    $('#lw-target-list').html('<p class="lw-error">読み込みに失敗しました</p>');
                }
            });
        },

        renderTargetList: function(posts) {
            const $list = $('#lw-target-list');
            $list.empty();

            if (posts.length === 0) {
                $list.html('<p class="lw-target-empty">対象がありません</p>');
                return;
            }

            posts.forEach(function(post) {
                let subtitle = '';
                if (post.parent_title) {
                    subtitle = '<span class="lw-target-parent">└ ' + TaskList.escapeHtml(post.parent_title) + '</span>';
                }
                if (post.status !== 'publish') {
                    const statusLabel = {
                        'draft': '下書き',
                        'pending': 'レビュー待ち',
                        'private': '非公開'
                    };
                    subtitle += '<span class="lw-target-status">' + (statusLabel[post.status] || post.status) + '</span>';
                }

                const $item = $('<div class="lw-target-item" data-id="' + post.id + '" data-title="' + TaskList.escapeAttr(post.title) + '">' +
                    '<span class="lw-target-title">' + TaskList.escapeHtml(post.title) + '</span>' +
                    subtitle +
                '</div>');

                $list.append($item);
            });
        },

        filterTargetList: function(keyword) {
            if (!keyword) {
                TaskList.renderTargetList(TaskList.targetPosts);
                return;
            }

            const lower = keyword.toLowerCase();
            const filtered = TaskList.targetPosts.filter(function(post) {
                return post.title.toLowerCase().indexOf(lower) !== -1;
            });
            TaskList.renderTargetList(filtered);
        },

        selectTarget: function(id, title) {
            $('#lw-target-id').val(id);
            $('#lw-target-selected-title').text(title);
            $('#lw-target-selected').show();
            $('#lw-target-list').hide();
            $('#lw-target-search').hide();
            $('.lw-target-search-box').hide();
        },

        clearTargetSelection: function() {
            $('#lw-target-id').val('');
            $('#lw-target-selected').hide();
            $('#lw-target-list').show();
            $('#lw-target-search').show();
            $('.lw-target-search-box').show();
        },

        loadEditorsForNew: function() {
            if (TaskList.editorsCache) {
                TaskList.populateEditorsSelect(TaskList.editorsCache);
                return;
            }

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_editors',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        TaskList.editorsCache = response.data.users;
                        TaskList.populateEditorsSelect(TaskList.editorsCache);
                    }
                }
            });
        },

        populateEditorsSelect: function(users) {
            const $select = $('#lw-tasklist-new-assigned');
            $select.empty().append('<option value="">選択してください</option>');
            users.forEach(function(user) {
                $select.append('<option value="' + user.id + '">' + TaskList.escapeHtml(user.name) + '</option>');
            });
        },

        saveNewInstruction: function() {
            const targetType = TaskList.targetType;
            let pageId = null;
            let customTitle = '';

            if (targetType === 'custom') {
                customTitle = $('#lw-custom-title').val().trim();
                if (!customTitle) {
                    alert('タイトルを入力してください');
                    return;
                }
                pageId = 0; // カスタムの場合は0
            } else {
                pageId = $('#lw-target-id').val();
                if (!pageId) {
                    alert('対象を選択してください');
                    return;
                }
            }

            const content = $('#lw-tasklist-new-content').val().trim();
            if (!content) {
                alert('依頼内容を入力してください');
                return;
            }

            const status = $('#lw-tasklist-new-status').val();
            const assignedTo = $('#lw-tasklist-new-assigned').val() || '';

            const $btn = $('#lw-tasklist-new-save');
            $btn.prop('disabled', true).html('<span class="spinner is-active"></span> 保存中...');

            const formData = new FormData();
            formData.append('action', 'lw_add_instruction');
            formData.append('nonce', lwWizard.nonce);
            formData.append('page_id', pageId);
            formData.append('content', content);
            formData.append('status', status);
            formData.append('assigned_to', assignedTo);

            if (targetType === 'custom') {
                formData.append('custom_title', customTitle);
            }

            const linkUrl = $('#lw-tasklist-new-link-url').val().trim();
            if (linkUrl) {
                formData.append('link_url', linkUrl);
            }

            const imageFile = $('#lw-tasklist-new-image')[0].files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-saved"></span> 依頼を作成');

                    if (response.success) {
                        Modal.close('lw-tasklist-new-modal');
                        // 一覧を再読み込み
                        TaskList.loadInstructions();
                        TaskList.loadBadgeCount();
                        // ページバッジも更新
                        InstructionsModal.loadInstructionCounts();
                    } else {
                        alert(response.data || '保存に失敗しました');
                    }
                },
                error: function() {
                    $btn.prop('disabled', false).html('<span class="dashicons dashicons-saved"></span> 依頼を作成');
                    alert('通信エラーが発生しました');
                }
            });
        },

        openModal: function() {
            Modal.open('lw-tasklist-modal');
            TaskList.loadInstructions();
        },

        loadBadgeCount: function() {
            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_all_pending_instructions',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    if (response.success) {
                        const total = response.data.counts.all || 0;
                        const $badge = $('#lw-tasklist-badge');
                        if (total > 0) {
                            $badge.text(total).show();
                        } else {
                            $badge.hide();
                        }
                    }
                }
            });
        },

        loadInstructions: function() {
            $('#lw-tasklist-loading').show();
            $('#lw-tasklist-empty').hide();
            $('#lw-tasklist-list').empty();

            $.ajax({
                url: lwWizard.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_all_pending_instructions',
                    nonce: lwWizard.nonce
                },
                success: function(response) {
                    $('#lw-tasklist-loading').hide();

                    if (response.success) {
                        TaskList.allInstructions = response.data.instructions;
                        TaskList.counts = response.data.counts;
                        TaskList.updateCountBadges();
                        TaskList.renderList();

                        // サイドバーバッジも更新
                        const total = TaskList.counts.all || 0;
                        const $badge = $('#lw-tasklist-badge');
                        if (total > 0) {
                            $badge.text(total).show();
                        } else {
                            $badge.hide();
                        }
                    }
                },
                error: function() {
                    $('#lw-tasklist-loading').hide();
                    $('#lw-tasklist-list').html('<p class="lw-error">読み込みに失敗しました</p>');
                }
            });
        },

        updateCountBadges: function() {
            $('#lw-tasklist-count-all').text(TaskList.counts.all || 0);
            $('#lw-tasklist-count-work').text(TaskList.counts.work || 0);
            $('#lw-tasklist-count-check').text(TaskList.counts.check || 0);
        },

        setFilter: function(filter) {
            TaskList.currentFilter = filter;
            $('.lw-tasklist-tab').removeClass('active');
            $('.lw-tasklist-tab[data-filter="' + filter + '"]').addClass('active');
            TaskList.renderList();
        },

        renderList: function() {
            const $list = $('#lw-tasklist-list');
            $list.empty();

            let filtered = TaskList.allInstructions;

            if (TaskList.currentFilter === 'work') {
                filtered = filtered.filter(i => i.status !== 'check-requested');
            } else if (TaskList.currentFilter === 'check') {
                filtered = filtered.filter(i => i.status === 'check-requested');
            }

            if (filtered.length === 0) {
                $('#lw-tasklist-empty').show();
                return;
            }

            $('#lw-tasklist-empty').hide();

            // ページごとにグループ化
            const grouped = {};
            filtered.forEach(function(inst) {
                if (!grouped[inst.page_id]) {
                    grouped[inst.page_id] = {
                        page_title: inst.page_title,
                        items: []
                    };
                }
                grouped[inst.page_id].items.push(inst);
            });

            Object.keys(grouped).forEach(function(pageId) {
                const group = grouped[pageId];
                const $group = $('<div class="lw-tasklist-group">' +
                    '<div class="lw-tasklist-group-header">' +
                        '<span class="dashicons dashicons-media-document"></span>' +
                        '<span class="lw-tasklist-page-title">' + TaskList.escapeHtml(group.page_title) + '</span>' +
                        '<span class="lw-tasklist-group-count">' + group.items.length + '件</span>' +
                    '</div>' +
                    '<div class="lw-tasklist-group-items"></div>' +
                '</div>');

                const $items = $group.find('.lw-tasklist-group-items');

                group.items.forEach(function(inst) {
                    const statusClass = inst.status === 'check-requested' ? 'check-requested' : 'not-started';
                    const statusIcon = inst.status === 'check-requested' ? 'visibility' : 'edit';
                    const statusText = inst.status === 'check-requested' ? 'チェック依頼' : '未着手';
                    const assignedHtml = inst.assigned_to_name
                        ? '<span class="lw-tasklist-assigned"><span class="dashicons dashicons-admin-users"></span>' + TaskList.escapeHtml(inst.assigned_to_name) + '</span>'
                        : '';
                    const imageHtml = inst.image_path
                        ? '<span class="lw-tasklist-has-image"><span class="dashicons dashicons-format-image"></span></span>'
                        : '';
                    const linkHtml = inst.link_url
                        ? '<a href="' + TaskList.escapeAttr(inst.link_url) + '" target="_blank" class="lw-tasklist-link-btn" title="リンクを開く"><span class="dashicons dashicons-external"></span></a>'
                        : '';

                    const $item = $('<div class="lw-tasklist-item" data-id="' + inst.id + '" data-page-id="' + inst.page_id + '">' +
                        '<div class="lw-tasklist-item-status ' + statusClass + '">' +
                            '<span class="dashicons dashicons-' + statusIcon + '"></span>' +
                        '</div>' +
                        '<div class="lw-tasklist-item-content">' +
                            '<div class="lw-tasklist-item-text">' + TaskList.escapeHtml(inst.content) + '</div>' +
                            '<div class="lw-tasklist-item-meta">' +
                                '<span class="lw-tasklist-author">' + TaskList.escapeHtml(inst.author_name || '') + '</span>' +
                                '<span class="lw-tasklist-date">' + InstructionsModal.formatDate(inst.created_at) + '</span>' +
                                assignedHtml +
                                imageHtml +
                            '</div>' +
                        '</div>' +
                        linkHtml +
                        '<button type="button" class="lw-tasklist-item-action" title="詳細を開く">' +
                            '<span class="dashicons dashicons-arrow-right-alt2"></span>' +
                        '</button>' +
                    '</div>');

                    // リンクボタンのクリックはイベント伝播を止める
                    $item.find('.lw-tasklist-link-btn').on('click', function(e) {
                        e.stopPropagation();
                    });

                    // クリックで該当ページの指示モーダルを開く
                    $item.on('click', function(e) {
                        // リンクボタンがクリックされた場合は処理しない
                        if ($(e.target).closest('.lw-tasklist-link-btn').length) {
                            return;
                        }
                        const pageId = $(this).data('page-id');
                        const pageTitle = group.page_title;
                        Modal.close('lw-tasklist-modal');
                        // 少し遅延してからモーダルを開く
                        setTimeout(function() {
                            TaskList.openPageInstructions(pageId, pageTitle);
                        }, 300);
                    });

                    $items.append($item);
                });

                $list.append($group);
            });
        },

        openPageInstructions: function(pageId, pageTitle) {
            // 該当ページの指示コメントモーダルを直接開く
            InstructionsModal.currentPageId = pageId;
            InstructionsModal.currentPageTitle = pageTitle;
            Modal.open('lw-instructions-modal');
            $('#lw-instructions-page-title').text(pageTitle);
            InstructionsModal.loadInstructions(pageId);
        },

        escapeHtml: function(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        escapeAttr: function(text) {
            if (!text) return '';
            return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };

})(jQuery);
