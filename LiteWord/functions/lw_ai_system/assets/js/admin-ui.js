/**
 * LiteWord AI Page Generator - Admin UI Loader
 *
 * 軽量ローダー：AIボタンのみを表示
 * モーダル機能はクリック時に動的読み込み
 */

(function() {
    'use strict';

    // WordPress依存関係のチェック
    if (typeof wp === 'undefined' || !wp.element) {
        return;
    }

    var createElement = wp.element.createElement;
    var useState = wp.element.useState;
    var Fragment = wp.element.Fragment;
    var createPortal = wp.element.createPortal;

    // モーダルコンポーネントのキャッシュ
    var modalComponentLoaded = false;
    var AiGeneratorModal = null;

    /**
     * AIアイコンSVG（軽量版）
     */
    function AiIcon(props) {
        return createElement('svg', {
            width: props.size || 24,
            height: props.size || 24,
            viewBox: '0 0 24 24',
            fill: 'none'
        }, [
            createElement('defs', { key: 'defs' },
                createElement('linearGradient', {
                    id: 'ai-gradient',
                    x1: '0%', y1: '0%', x2: '100%', y2: '100%'
                }, [
                    createElement('stop', { key: 's1', offset: '0%', stopColor: '#8B5CF6' }),
                    createElement('stop', { key: 's2', offset: '50%', stopColor: '#6366F1' }),
                    createElement('stop', { key: 's3', offset: '100%', stopColor: '#3B82F6' })
                ])
            ),
            createElement('path', {
                key: 'p1',
                d: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
                fill: 'url(#ai-gradient)'
            }),
            createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '3', fill: 'white' }),
            createElement('path', {
                key: 'p2',
                d: 'M12 10V14M10 12H14',
                stroke: 'url(#ai-gradient)',
                strokeWidth: '1.5',
                strokeLinecap: 'round'
            })
        ]);
    }

    /**
     * モーダルスクリプトを動的読み込み
     */
    function loadModalScript(callback) {
        if (modalComponentLoaded && AiGeneratorModal) {
            callback(AiGeneratorModal);
            return;
        }

        // スクリプトがすでに読み込まれているか確認
        if (window.LwAiGeneratorModal) {
            modalComponentLoaded = true;
            AiGeneratorModal = window.LwAiGeneratorModal;
            callback(AiGeneratorModal);
            return;
        }

        // 動的にスクリプトを読み込む
        var script = document.createElement('script');
        script.src = lwAiGeneratorData.modalUrl + '?ver=' + (lwAiGeneratorData.version || Date.now());
        script.onload = function() {
            if (window.LwAiGeneratorModal) {
                modalComponentLoaded = true;
                AiGeneratorModal = window.LwAiGeneratorModal;
                callback(AiGeneratorModal);
            }
        };
        script.onerror = function() {
            console.error('[LW AI Generator] Failed to load modal script');
        };
        document.head.appendChild(script);
    }

    /**
     * プレミアムモーダルコンポーネント
     */
    function PremiumModal({ isOpen, onClose }) {
        if (!isOpen) return null;

        var modalContent = createElement('div', {
            className: 'lw-ai-premium-modal-overlay',
            onClick: onClose
        },
            createElement('div', {
                className: 'lw-ai-premium-modal',
                onClick: function(e) { e.stopPropagation(); }
            }, [
                createElement('div', { key: 'header', className: 'lw-ai-premium-modal-header' }, [
                    createElement('h3', { key: 'title' }, 'プレミアム機能'),
                    createElement('button', {
                        key: 'close',
                        className: 'lw-ai-premium-modal-close',
                        onClick: onClose
                    }, '×')
                ]),
                createElement('div', { key: 'body', className: 'lw-ai-premium-modal-body' }, [
                    createElement('p', { key: 'message', className: 'lw-ai-premium-message' }, [
                        'この機能は',
                        createElement('strong', { key: 'strong' }, 'LiteWordプレミアムプラン'),
                        '限定です。'
                    ]),
                    createElement('p', { key: 'desc', className: 'lw-ai-premium-description' },
                        'プレミアムプランでは、AIページ生成機能をご利用いただけます。'
                    ),
                    createElement('p', { key: 'note', className: 'lw-ai-premium-note' },
                        '※ AI機能のご利用にはAPIキーの設定が必要です。別途API利用料（1生成あたり約1円程度）がかかります。'
                    ),
                    createElement('p', { key: 'warning', className: 'lw-ai-premium-warning' },
                        '⚠️ AI機能は現在開発中です。生成精度が低い場合がありますので、あらかじめご了承ください。'
                    ),
                    createElement('div', { key: 'actions', className: 'lw-ai-premium-actions' }, [
                        createElement('button', {
                            key: 'upgrade-now',
                            className: 'lw-ai-btn lw-ai-btn-primary',
                            'data-lw-shop-action': 'login',
                            'data-redirect': '/purchase-premium/',
                            onClick: onClose
                        }, '今すぐプレミアムにする'),
                        createElement('div', { key: 'actions-row', className: 'lw-ai-premium-actions-row' }, [
                            createElement('a', {
                                key: 'upgrade',
                                href: lwAiGeneratorData.premiumUrl || 'https://shop.lite-word.com/purchase-premium',
                                className: 'lw-ai-btn lw-ai-btn-outline',
                                target: '_blank'
                            }, 'プレミアムプランの詳細'),
                            createElement('button', {
                                key: 'cancel',
                                className: 'lw-ai-btn lw-ai-btn-text',
                                onClick: onClose
                            }, '閉じる')
                        ])
                    ])
                ])
            ])
        );

        // body直下にPortalでレンダリング
        return createPortal(modalContent, document.body);
    }

    /**
     * ヘッダーバーのAIボタンコンポーネント
     */
    function AiHeaderButton() {
        var _isModalOpen = useState(false);
        var isModalOpen = _isModalOpen[0];
        var setIsModalOpen = _isModalOpen[1];

        var _isLoading = useState(false);
        var isLoading = _isLoading[0];
        var setIsLoading = _isLoading[1];

        var _ModalComponent = useState(null);
        var ModalComponent = _ModalComponent[0];
        var setModalComponent = _ModalComponent[1];

        var _showPremiumModal = useState(false);
        var showPremiumModal = _showPremiumModal[0];
        var setShowPremiumModal = _showPremiumModal[1];

        var isPremium = lwAiGeneratorData.isPremium;

        function handleClick() {
            // プレミアムプランでない場合はプレミアムモーダルを表示
            if (!isPremium) {
                setShowPremiumModal(true);
                return;
            }

            if (ModalComponent) {
                // すでに読み込み済み
                setIsModalOpen(true);
                return;
            }

            // モーダルスクリプトを動的読み込み
            setIsLoading(true);
            loadModalScript(function(Modal) {
                setModalComponent(function() { return Modal; });
                setIsLoading(false);
                setIsModalOpen(true);
            });
        }

        function handleClose() {
            setIsModalOpen(false);
        }

        function handlePremiumModalClose() {
            setShowPremiumModal(false);
        }

        return createElement(Fragment, null, [
            createElement('button', {
                key: 'ai-button',
                className: 'lw-ai-header-button' +
                    (isLoading ? ' is-loading' : '') +
                    (!isPremium ? ' lw-ai-premium-disabled' : ''),
                onClick: handleClick,
                title: isPremium ? 'AIでページを生成' : 'AIでページを生成（プレミアムプラン限定）',
                disabled: isLoading
            }, [
                isLoading ?
                    createElement('span', { key: 'loading', className: 'lw-ai-loading-spinner' }) :
                    createElement(AiIcon, { key: 'icon', size: 20 }),
                createElement('span', { key: 'text', className: 'lw-ai-header-button-text' },
                    isLoading ? '読込中...' : 'AI生成'
                ),
                !isPremium && createElement('span', {
                    key: 'premium-label',
                    className: 'lw-ai-premium-label'
                }, 'Premium')
            ]),
            // プレミアムモーダル
            createElement(PremiumModal, {
                key: 'premium-modal',
                isOpen: showPremiumModal,
                onClose: handlePremiumModalClose
            }),
            // モーダルが読み込まれていれば表示
            ModalComponent && createElement(ModalComponent, {
                key: 'modal',
                isOpen: isModalOpen,
                onClose: handleClose
            })
        ]);
    }

    // ヘッダーボタンをDOMに追加
    function injectHeaderButton() {
        var selectors = [
            '.edit-post-header__settings',
            '.editor-header__settings',
            '.edit-post-header-toolbar__right',
            '.interface-pinned-items'
        ];

        var target = null;
        for (var i = 0; i < selectors.length; i++) {
            target = document.querySelector(selectors[i]);
            if (target) break;
        }

        if (!target) {
            setTimeout(injectHeaderButton, 500);
            return;
        }

        if (document.querySelector('.lw-ai-header-button-wrapper')) {
            return;
        }

        var wrapper = document.createElement('div');
        wrapper.className = 'lw-ai-header-button-wrapper';
        target.insertBefore(wrapper, target.firstChild);

        // React 18対応: createRootを使用（フォールバックあり）
        if (wp.element.createRoot) {
            // React 18+ (WordPress 6.2+)
            var root = wp.element.createRoot(wrapper);
            root.render(createElement(AiHeaderButton));
        } else {
            // React 17以前 (WordPress 6.1以前)
            wp.element.render(createElement(AiHeaderButton), wrapper);
        }
    }

    // 初期化
    if (wp.domReady) {
        wp.domReady(injectHeaderButton);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(injectHeaderButton, 1000);
        });
    }

    // block-inserter.jsとの連携用
    if (window.lwAiGenerator) {
        window.lwAiGenerator.log('Admin UI Loader initialized');
    }

})();
