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

    // 遅延読み込みスクリプトの状態管理
    var lazyScriptsLoaded = {
        blockSidebar: false,
        textSelection: false
    };

    // AI機能の有効/無効状態をlocalStorageから取得
    var AI_ENABLED_KEY = 'lw_ai_features_enabled';

    // グローバル変数でAI機能の有効/無効を管理（他のスクリプトから参照可能）
    window.lwAiFeaturesEnabled = false;

    function getAiEnabledState() {
        try {
            var enabled = localStorage.getItem(AI_ENABLED_KEY) === 'true';
            window.lwAiFeaturesEnabled = enabled;
            return enabled;
        } catch (e) {
            window.lwAiFeaturesEnabled = false;
            return false;
        }
    }
    function setAiEnabledState(enabled) {
        try {
            localStorage.setItem(AI_ENABLED_KEY, enabled ? 'true' : 'false');
            window.lwAiFeaturesEnabled = enabled;
            // カスタムイベントを発火して、他のコンポーネントに通知
            window.dispatchEvent(new CustomEvent('lwAiFeaturesToggle', { detail: { enabled: enabled } }));
        } catch (e) {
            // localStorage使用不可の場合は無視
        }
    }

    // 初期状態を設定
    getAiEnabledState();

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
     * 遅延読み込みスクリプトを動的に読み込む
     * AI機能を使用する際に初めて読み込まれる（パフォーマンス改善）
     * requestIdleCallbackを使用してメインスレッドのブロッキングを軽減
     */
    function loadLazyScripts(callback) {
        var lazyScripts = lwAiGeneratorData.lazyScripts;
        if (!lazyScripts) {
            if (callback) callback();
            return;
        }

        var scriptsToLoad = [];
        var version = lwAiGeneratorData.version || Date.now();

        // block-ai-sidebar.js
        if (lazyScripts.blockSidebar && !lazyScriptsLoaded.blockSidebar) {
            scriptsToLoad.push({
                key: 'blockSidebar',
                url: lazyScripts.blockSidebar + '?ver=' + version
            });
        }

        // text-selection-ai.js
        if (lazyScripts.textSelection && !lazyScriptsLoaded.textSelection) {
            scriptsToLoad.push({
                key: 'textSelection',
                url: lazyScripts.textSelection + '?ver=' + version
            });
        }

        if (scriptsToLoad.length === 0) {
            if (callback) callback();
            return;
        }

        var loadedCount = 0;
        var totalCount = scriptsToLoad.length;

        // requestIdleCallbackのポリフィル
        var scheduleTask = window.requestIdleCallback || function(cb) { return setTimeout(cb, 1); };

        scriptsToLoad.forEach(function(scriptInfo, index) {
            // 順番に少し遅延させて読み込み、メインスレッドの負荷を分散
            scheduleTask(function() {
                var script = document.createElement('script');
                script.src = scriptInfo.url;
                script.async = true;
                script.onload = function() {
                    lazyScriptsLoaded[scriptInfo.key] = true;
                    loadedCount++;
                    console.log('[LW AI Generator] Lazy script loaded: ' + scriptInfo.key);
                    if (loadedCount === totalCount && callback) {
                        // コールバックも次のアイドル時に実行
                        scheduleTask(callback);
                    }
                };
                script.onerror = function() {
                    console.error('[LW AI Generator] Failed to load lazy script: ' + scriptInfo.key);
                    loadedCount++;
                    if (loadedCount === totalCount && callback) {
                        scheduleTask(callback);
                    }
                };
                document.head.appendChild(script);
            });
        });
    }

    /**
     * AI機能ON/OFFトグルスイッチ
     */
    function AiToggleSwitch({ enabled, onChange, disabled, isLoading }) {
        return createElement('label', {
            className: 'lw-ai-toggle-switch' + (disabled ? ' is-disabled' : '') + (isLoading ? ' is-loading' : ''),
            title: enabled ? 'AI機能をOFFにする' : 'AI機能をONにする'
        }, [
            createElement('input', {
                key: 'input',
                type: 'checkbox',
                checked: enabled,
                onChange: function(e) { onChange(e.target.checked); },
                disabled: disabled || isLoading
            }),
            createElement('span', {
                key: 'slider',
                className: 'lw-ai-toggle-slider'
            }, isLoading ? createElement('span', { className: 'lw-ai-toggle-spinner' }) : null),
            createElement('span', {
                key: 'label',
                className: 'lw-ai-toggle-label'
            }, enabled ? 'AI ON' : 'AI OFF')
        ]);
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

        // AI機能ON/OFF状態
        var _aiEnabled = useState(getAiEnabledState());
        var aiEnabled = _aiEnabled[0];
        var setAiEnabled = _aiEnabled[1];

        var _isToggleLoading = useState(false);
        var isToggleLoading = _isToggleLoading[0];
        var setIsToggleLoading = _isToggleLoading[1];

        var isPremium = lwAiGeneratorData.isPremium;

        // AI機能のON/OFF切り替え
        function handleToggleChange(enabled) {
            if (!isPremium) {
                setShowPremiumModal(true);
                return;
            }

            if (enabled) {
                // ONにする場合：遅延スクリプトを読み込む
                setIsToggleLoading(true);
                loadLazyScripts(function() {
                    setAiEnabled(true);
                    setAiEnabledState(true);
                    setIsToggleLoading(false);
                    console.log('[LW AI Generator] AI features enabled');
                });
            } else {
                // OFFにする場合：状態を保存（スクリプトは読み込み済みでも機能は無効化）
                setAiEnabled(false);
                setAiEnabledState(false);
                console.log('[LW AI Generator] AI features disabled');
            }
        }

        function handleClick() {
            // プレミアムプランでない場合はプレミアムモーダルを表示
            if (!isPremium) {
                setShowPremiumModal(true);
                return;
            }

            // AI機能がOFFの場合は先にONにする
            if (!aiEnabled) {
                setIsLoading(true);
                loadLazyScripts(function() {
                    setAiEnabled(true);
                    setAiEnabledState(true);
                    loadModalScript(function(Modal) {
                        setModalComponent(function() { return Modal; });
                        setIsLoading(false);
                        setIsModalOpen(true);
                    });
                });
                return;
            }

            if (ModalComponent) {
                // すでに読み込み済み
                setIsModalOpen(true);
                return;
            }

            // モーダルスクリプトを読み込み
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
            // AI ON/OFFトグル（プレミアムユーザーのみ表示）
            createElement('div', {
                key: 'ai-controls',
                className: 'lw-ai-header-controls'
            }, [
                createElement(AiToggleSwitch, {
                    key: 'toggle',
                    enabled: aiEnabled,
                    onChange: handleToggleChange,
                    disabled: !isPremium,
                    isLoading: isToggleLoading
                }),
                // AI生成ボタン（AI ONの場合のみアクティブ）
                createElement('button', {
                    key: 'ai-button',
                    className: 'lw-ai-header-button' +
                        (isLoading ? ' is-loading' : '') +
                        (!isPremium ? ' lw-ai-premium-disabled' : '') +
                        (!aiEnabled ? ' is-inactive' : ''),
                    onClick: handleClick,
                    title: !isPremium ? 'AIでページを生成（プレミアムプラン限定）' :
                           !aiEnabled ? 'AI機能をONにしてください' : 'AIでページを生成',
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
                ])
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
