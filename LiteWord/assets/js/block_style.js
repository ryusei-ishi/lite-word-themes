/**
 * WordPress Block Editor - Dynamic CSS Loader
 * エディター画面でブロックが追加された際に動的にCSSを読み込む
 * 改善版 - より確実な読み込みとタイミング制御
 * ローディング表示機能追加
 * 初期読み込み時のフルスクリーンローディング追加
 */

(function() {
    'use strict';

    // WordPress API の存在確認
    if (!window.wp || !window.wp.data || !window.MyThemeSettings) {
        console.warn('WDL Dynamic Styles: Required WordPress APIs or MyThemeSettings not available');
        return;
    }

    // 初期読み込みフラグ（ページロード時のみtrue、自動保存時はfalse）
    var isInitialPageLoad = true;
    var initialLoadComplete = false;
    var minimumLoadingTime = 3000; // 最低3秒間はローディングを表示
    var loadingStartTime = Date.now();
    var blocksReady = false;

    // フルスクリーンローディングを即座に表示（自動保存でないことを確認）
    function showFullScreenLoading() {
        // 既に存在する場合はスキップ
        if (document.getElementById('wdl-fullscreen-loading')) return;

        // Performance Navigation APIで判定（リロード/新規読み込みを検出）
        var isPageNavigation = true;
        if (window.performance && window.performance.getEntriesByType) {
            var navEntries = window.performance.getEntriesByType('navigation');
            if (navEntries.length > 0) {
                var navType = navEntries[0].type;
                // navigate, reload, back_forward, prerender
                isPageNavigation = (navType === 'navigate' || navType === 'reload');
            }
        }

        if (!isPageNavigation) {
            isInitialPageLoad = false;
            return;
        }

        loadingStartTime = Date.now();

        var overlay = document.createElement('div');
        overlay.id = 'wdl-fullscreen-loading';
        overlay.innerHTML = [
            '<div class="wdl-fullscreen-loading-content">',
            '  <div class="wdl-fullscreen-spinner"></div>',
            '  <div class="wdl-fullscreen-text">エディターを準備中...</div>',
            '</div>'
        ].join('');

        // スタイルを直接設定（CSSがまだ読み込まれていない可能性があるため）
        overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'right: 0',
            'bottom: 0',
            'background: rgba(255, 255, 255, 0.95)',
            'z-index: 999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'opacity: 1',
            'transition: opacity 0.4s ease'
        ].join(';');

        var content = overlay.querySelector('.wdl-fullscreen-loading-content');
        if (content) {
            content.style.cssText = [
                'display: flex',
                'flex-direction: column',
                'align-items: center',
                'gap: 16px'
            ].join(';');
        }

        // document.body が存在するか確認
        if (!document.body) {
            // body がまだない場合は DOMContentLoaded を待つ
            document.addEventListener('DOMContentLoaded', function() {
                if (!document.getElementById('wdl-fullscreen-loading')) {
                    document.body.appendChild(overlay);
                }
            });
        } else {
            document.body.appendChild(overlay);
        }

        // スピナーのスタイル
        var spinner = overlay.querySelector('.wdl-fullscreen-spinner');
        if (spinner) {
            spinner.style.cssText = [
                'width: 48px',
                'height: 48px',
                'border: 4px solid #e0e6ed',
                'border-top-color: #667eea',
                'border-radius: 50%',
                'animation: wdl-fullscreen-spin 0.8s linear infinite'
            ].join(';');
        }

        var text = overlay.querySelector('.wdl-fullscreen-text');
        if (text) {
            text.style.cssText = [
                'font-size: 14px',
                'color: #555',
                'font-weight: 500'
            ].join(';');
        }

        // アニメーション用のスタイルを追加
        if (!document.getElementById('wdl-fullscreen-keyframes')) {
            var keyframes = document.createElement('style');
            keyframes.id = 'wdl-fullscreen-keyframes';
            keyframes.textContent = '@keyframes wdl-fullscreen-spin { to { transform: rotate(360deg); } }';
            document.head.appendChild(keyframes);
        }
    }

    // フルスクリーンローディングを非表示（最低3秒経過後）
    function hideFullScreenLoading() {
        var elapsed = Date.now() - loadingStartTime;
        var remaining = minimumLoadingTime - elapsed;

        if (remaining > 0) {
            // 最低3秒経過していない場合は待機
            setTimeout(function() {
                doHideFullScreenLoading();
            }, remaining);
        } else {
            doHideFullScreenLoading();
        }
    }

    function doHideFullScreenLoading() {
        if (initialLoadComplete) return; // 既に非表示処理済み

        var overlay = document.getElementById('wdl-fullscreen-loading');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(function() {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 400);
        }
        initialLoadComplete = true;
        isInitialPageLoad = false;
    }

    // 3秒後に必ず非表示にするタイマー
    function scheduleHideLoading() {
        setTimeout(function() {
            if (!initialLoadComplete) {
                doHideFullScreenLoading();
            }
        }, minimumLoadingTime);
    }

    // 即座にフルスクリーンローディングを表示
    showFullScreenLoading();

    // 3秒後に必ず非表示にするタイマーを開始
    if (isInitialPageLoad) {
        scheduleHideLoading();
    }

    // ブロック名からCSSディレクトリ名へのマッピング
    var blockSlugMap = {
        'lw-button-01': 'lw-button-1'
    };

    class WDLDynamicStyleLoader {
        constructor() {
            this.loadedStyles = new Set();
            this.pendingStyles = new Set();
            this.pendingBlockElements = new Map();
            this.isInitialized = false;
            this.unsubscribe = null;
            this.retryAttempts = new Map();
            this.maxRetries = 3;
            this.initialBlocksLoaded = false;

            // ローディングスタイルを注入
            this.injectLoadingStyles();

            // DOM読み込み完了後に初期化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                this.init();
            }
        }

        injectLoadingStyles() {
            if (document.getElementById('wdl-loading-styles')) return;

            var style = document.createElement('style');
            style.id = 'wdl-loading-styles';
            style.textContent = `
                /* WDL Block Loading Overlay */
                .wdl-block-loading {
                    position: relative !important;
                    min-height: 100px !important;
                }
                .wdl-block-loading > *:not(.wdl-loading-overlay) {
                    visibility: hidden !important;
                }
                .wdl-loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    min-height: 100px;
                    background: linear-gradient(135deg, #f8fafc 0%, #e8eef5 100%);
                    border: 1px solid #e0e6ed;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    z-index: 10;
                }
                .wdl-loading-spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid #e0e6ed;
                    border-top-color: #667eea;
                    border-radius: 50%;
                    animation: wdl-spin 0.8s linear infinite;
                }
                @keyframes wdl-spin {
                    to { transform: rotate(360deg); }
                }
                .wdl-loading-text {
                    font-size: 13px;
                    color: #667;
                    font-weight: 500;
                }
                /* Fade out animation */
                .wdl-loading-overlay.fade-out {
                    animation: wdl-fade-out 0.3s ease forwards;
                }
                @keyframes wdl-fade-out {
                    to {
                        opacity: 0;
                        visibility: hidden;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        init() {
            try {
                // エディターが利用可能になるまで待機
                this.waitForEditor();

                // ブロック挿入イベントを直接監視
                this.setupBlockInsertionListener();

                // iframeの監視を開始
                this.watchForIframe();

            } catch (error) {
                console.error('WDL Dynamic Styles: Initialization failed', error);
            }
        }

        // iframeが読み込まれた時にCSSを再注入
        watchForIframe() {
            var self = this;

            // iframeを定期的にチェック
            var checkIframe = function() {
                var iframe = document.querySelector('iframe[name="editor-canvas"], iframe.editor-canvas');
                if (iframe) {
                    // iframeのload イベントを監視
                    iframe.addEventListener('load', function() {
                        console.log('WDL Dynamic Styles: iframe loaded, re-injecting styles');
                        self.reinjectAllStylesToIframe();
                    });

                    // 既に読み込まれている場合も注入
                    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                        self.reinjectAllStylesToIframe();
                    }
                } else {
                    // iframeがまだ存在しない場合は再試行
                    setTimeout(checkIframe, 500);
                }
            };

            checkIframe();

            // MutationObserverでiframeの追加を監視
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.tagName === 'IFRAME' &&
                            (node.name === 'editor-canvas' || node.classList.contains('editor-canvas'))) {
                            console.log('WDL Dynamic Styles: New iframe detected');
                            node.addEventListener('load', function() {
                                self.reinjectAllStylesToIframe();
                            });
                        }
                    });
                });
            });

            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        }

        // 既に読み込んだ全てのスタイルをiframeに再注入
        reinjectAllStylesToIframe() {
            var self = this;
            this.loadedStyles.forEach(function(blockType) {
                var blockName = blockType.replace('wdl/', '');
                if (blockSlugMap[blockName]) {
                    blockName = blockSlugMap[blockName];
                }
                var baseUrl = MyThemeSettings.themeUrl + '/my-blocks/build/' + blockName + '/';

                self.injectStyleToIframe('wdl-' + blockName + '-editor-dynamic', baseUrl + 'editor.css?v=' + Date.now());
                self.injectStyleToIframe('wdl-' + blockName + '-style-dynamic', baseUrl + 'style.css?v=' + Date.now());
            });
        }

        waitForEditor() {
            var self = this;
            var checkEditor = function() {
                var blockEditor = wp.data.select('core/block-editor');

                if (blockEditor && typeof blockEditor.getBlocks === 'function') {
                    self.startMonitoring();
                } else {
                    setTimeout(checkEditor, 100);
                }
            };

            checkEditor();
        }

        setupBlockInsertionListener() {
            var self = this;
            if (wp.hooks && wp.hooks.addAction) {
                wp.hooks.addAction(
                    'blocks.registerBlockType',
                    'wdl/dynamic-styles',
                    function(settings, name) {
                        if (name && name.startsWith('wdl/')) {
                            setTimeout(function() {
                                self.preloadBlockStyle('wdl/' + name.replace('wdl/', ''));
                            }, 0);
                        }
                    }
                );
            }
        }

        startMonitoring() {
            if (this.isInitialized) {
                return;
            }

            console.log('WDL Dynamic Styles: Starting enhanced block monitoring');

            var self = this;
            var previousBlockTypes = new Set();
            var debounceTimer = null;

            this.unsubscribe = wp.data.subscribe(function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function() {
                    self.checkForNewBlocks(previousBlockTypes);
                }, 50);
            });

            var originalInsertBlocks = wp.data.dispatch('core/block-editor').insertBlocks;
            if (originalInsertBlocks) {
                wp.data.dispatch('core/block-editor').insertBlocks = function() {
                    var args = arguments;
                    var result = originalInsertBlocks.apply(wp.data.dispatch('core/block-editor'), args);

                    setTimeout(function() {
                        self.scanAndLoadStyles();
                    }, 0);

                    return result;
                };
            }

            this.isInitialized = true;

            setTimeout(function() {
                self.loadExistingBlockStyles();
            }, 10);
        }

        checkForNewBlocks(previousBlockTypes) {
            try {
                var blockEditor = wp.data.select('core/block-editor');
                if (!blockEditor) return;

                var currentBlocks = blockEditor.getBlocks();
                var currentBlockTypes = this.extractBlockTypes(currentBlocks);

                var self = this;
                var newBlockTypes = currentBlockTypes.filter(function(type) {
                    return !previousBlockTypes.has(type) &&
                           !self.loadedStyles.has(type) &&
                           !self.pendingStyles.has(type);
                });

                if (newBlockTypes.length > 0) {
                    console.log('WDL Dynamic Styles: New blocks detected:', newBlockTypes);
                    newBlockTypes.forEach(function(blockType) {
                        self.loadBlockStyle(blockType, true);
                    });
                }

                previousBlockTypes.clear();
                currentBlockTypes.forEach(function(type) {
                    previousBlockTypes.add(type);
                });

            } catch (error) {
                console.error('WDL Dynamic Styles: Error in monitoring', error);
            }
        }

        extractBlockTypes(blocks) {
            var types = new Set();

            var traverse = function(blockArray) {
                if (!Array.isArray(blockArray)) return;

                blockArray.forEach(function(block) {
                    if (block && block.name && block.name.startsWith('wdl/')) {
                        types.add(block.name);
                    }
                    if (block && block.innerBlocks && Array.isArray(block.innerBlocks)) {
                        traverse(block.innerBlocks);
                    }
                });
            };

            traverse(blocks);
            return Array.from(types);
        }

        scanAndLoadStyles() {
            try {
                var blockEditor = wp.data.select('core/block-editor');
                if (!blockEditor) return;

                var currentBlocks = blockEditor.getBlocks();
                var currentBlockTypes = this.extractBlockTypes(currentBlocks);
                var self = this;

                currentBlockTypes.forEach(function(blockType) {
                    if (!self.loadedStyles.has(blockType) && !self.pendingStyles.has(blockType)) {
                        self.loadBlockStyle(blockType, true);
                    }
                });
            } catch (error) {
                console.error('WDL Dynamic Styles: Error in scanAndLoadStyles', error);
            }
        }

        loadExistingBlockStyles() {
            try {
                var blockEditor = wp.data.select('core/block-editor');
                if (!blockEditor) return;

                var currentBlocks = blockEditor.getBlocks();
                var currentBlockTypes = this.extractBlockTypes(currentBlocks);
                var self = this;

                if (currentBlockTypes.length > 0) {
                    console.log('WDL Dynamic Styles: Loading existing blocks:', currentBlockTypes);

                    var loadedCount = 0;
                    var totalCount = currentBlockTypes.length;

                    currentBlockTypes.forEach(function(blockType) {
                        self.loadBlockStyle(blockType, false, function() {
                            loadedCount++;
                            if (loadedCount >= totalCount) {
                                self.initialBlocksLoaded = true;
                            }
                        });
                    });

                } else {
                    // カスタムブロックがない場合
                    this.initialBlocksLoaded = true;
                }
            } catch (error) {
                console.error('WDL Dynamic Styles: Error loading existing blocks', error);
            }
        }

        preloadBlockStyle(blockType) {
            if (this.loadedStyles.has(blockType) || this.pendingStyles.has(blockType)) {
                return;
            }

            this.pendingStyles.add(blockType);
            var self = this;

            setTimeout(function() {
                self.loadBlockStyle(blockType, true);
            }, 100);
        }

        addLoadingOverlay(blockType) {
            // 初期読み込み中はフルスクリーンローディングがあるのでスキップ
            if (isInitialPageLoad && !initialLoadComplete) {
                return;
            }

            var selector = '[data-type="' + blockType + '"]';
            var blocks = document.querySelectorAll(selector);
            var self = this;

            blocks.forEach(function(block, index) {
                if (block.querySelector('.wdl-loading-overlay')) {
                    return;
                }
                if (block.classList.contains('wdl-block-loading')) {
                    return;
                }
                block.classList.add('wdl-block-loading');

                var overlay = document.createElement('div');
                overlay.className = 'wdl-loading-overlay';
                overlay.setAttribute('data-block-type', blockType);
                overlay.setAttribute('data-loading-start', Date.now());
                overlay.innerHTML = '<div class="wdl-loading-spinner"></div><div class="wdl-loading-text">読み込み中...</div>';
                block.appendChild(overlay);
            });

            // ローディングタイムアウト処理を開始
            this.startLoadingTimeout(blockType);
        }

        startLoadingTimeout(blockType) {
            var self = this;
            var maxTimeoutDuration = 5000; // 最大5秒でローディング解除

            // 即座にCSSの読み込みを開始
            this.forceReloadBlockStyle(blockType);

            // 5秒後に強制的に全てのローディングオーバーレイを解除
            setTimeout(function() {
                self.pendingStyles.delete(blockType);
                self.loadedStyles.add(blockType);
                // 全てのローディングオーバーレイを強制削除
                self.forceRemoveAllLoadingOverlays();
            }, maxTimeoutDuration);
        }

        forceRemoveAllLoadingOverlays() {
            // 全てのローディングオーバーレイを強制削除
            var overlays = document.querySelectorAll('.wdl-loading-overlay');
            overlays.forEach(function(overlay) {
                overlay.classList.add('fade-out');
                setTimeout(function() {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            });
            // 全てのローディング中クラスを削除
            var loadingBlocks = document.querySelectorAll('.wdl-block-loading');
            loadingBlocks.forEach(function(block) {
                block.classList.remove('wdl-block-loading');
            });
        }

        forceReloadBlockStyle(blockType) {
            var self = this;
            var blockName = blockType.replace('wdl/', '');
            // マッピングがあれば変換
            if (blockSlugMap[blockName]) {
                blockName = blockSlugMap[blockName];
            }
            var baseUrl = MyThemeSettings.themeUrl + '/my-blocks/build/' + blockName + '/';

            // 既存のスタイルシートを削除して再読み込み
            var editorStyleId = 'wdl-' + blockName + '-editor-dynamic';
            var styleStyleId = 'wdl-' + blockName + '-style-dynamic';

            var existingEditor = document.getElementById(editorStyleId);
            var existingStyle = document.getElementById(styleStyleId);

            if (existingEditor) {
                existingEditor.remove();
            }
            if (existingStyle) {
                existingStyle.remove();
            }

            var editorLoaded = false;
            var styleLoaded = false;

            var checkBothLoaded = function() {
                if (editorLoaded && styleLoaded) {
                    self.pendingStyles.delete(blockType);
                    self.loadedStyles.add(blockType);
                    self.forceRemoveAllLoadingOverlays();
                    self.forceEditorRefresh();
                }
            };

            var editorUrl = baseUrl + 'editor.css';
            var styleUrl = baseUrl + 'style.css';

            // 新しいタイムスタンプで再読み込み
            self.loadStylesheet(
                editorStyleId,
                editorUrl,
                'editor',
                blockType,
                function() {
                    editorLoaded = true;
                    checkBothLoaded();
                },
                function() {
                    editorLoaded = true;
                    checkBothLoaded();
                }
            );

            self.loadStylesheet(
                styleStyleId,
                styleUrl,
                'style',
                blockType,
                function() {
                    styleLoaded = true;
                    checkBothLoaded();
                },
                function() {
                    styleLoaded = true;
                    checkBothLoaded();
                }
            );
        }

        removeLoadingOverlay(blockType) {
            var selector = '[data-type="' + blockType + '"]';
            var blocks = document.querySelectorAll(selector);

            blocks.forEach(function(block) {
                var overlay = block.querySelector('.wdl-loading-overlay');
                if (overlay) {
                    overlay.classList.add('fade-out');
                    setTimeout(function() {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        block.classList.remove('wdl-block-loading');
                    }, 300);
                } else {
                    block.classList.remove('wdl-block-loading');
                }
            });
        }

        loadBlockStyle(blockType, isPriority, onComplete) {
            if (this.loadedStyles.has(blockType)) {
                if (onComplete) onComplete();
                return;
            }

            if (this.pendingStyles.has(blockType)) {
                return;
            }

            this.pendingStyles.add(blockType);
            var self = this;

            // 初期読み込み後のみ個別ローディング表示
            setTimeout(function() {
                self.addLoadingOverlay(blockType);
            }, 50);

            try {
                var blockName = blockType.replace('wdl/', '');
                // マッピングがあれば変換
                if (blockSlugMap[blockName]) {
                    blockName = blockSlugMap[blockName];
                }
                var baseUrl = MyThemeSettings.themeUrl + '/my-blocks/build/' + blockName + '/';
                var delay = isPriority ? 0 : 100;

                var editorLoaded = false;
                var styleLoaded = false;

                var checkBothLoaded = function() {
                    if (editorLoaded && styleLoaded) {
                        self.pendingStyles.delete(blockType);
                        self.loadedStyles.add(blockType);
                        self.retryAttempts.delete(blockType);
                        self.removeLoadingOverlay(blockType);
                        self.forceEditorRefresh();
                        if (onComplete) onComplete();
                    }
                };

                setTimeout(function() {
                    self.loadStylesheet(
                        'wdl-' + blockName + '-editor-dynamic',
                        baseUrl + 'editor.css',
                        'editor',
                        blockType,
                        function() {
                            editorLoaded = true;
                            checkBothLoaded();
                        },
                        function() {
                            editorLoaded = true;
                            checkBothLoaded();
                        }
                    );

                    self.loadStylesheet(
                        'wdl-' + blockName + '-style-dynamic',
                        baseUrl + 'style.css',
                        'style',
                        blockType,
                        function() {
                            styleLoaded = true;
                            checkBothLoaded();
                        },
                        function() {
                            styleLoaded = true;
                            checkBothLoaded();
                        }
                    );
                }, delay);

            } catch (error) {
                console.error('WDL Dynamic Styles: Error loading styles for', blockType, error);
                this.pendingStyles.delete(blockType);
                this.removeLoadingOverlay(blockType);
                if (onComplete) onComplete();
            }
        }

        loadStylesheet(id, href, type, blockType, onSuccess, onError) {
            if (document.getElementById(id)) {
                if (onSuccess) onSuccess();
                return;
            }

            var self = this;
            var hrefWithCache = href + '?v=' + Date.now();

            // メインドキュメントに追加
            var link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = hrefWithCache;
            link.type = 'text/css';

            link.onerror = function() {
                console.warn('WDL Dynamic Styles: Failed to load', type, 'stylesheet:', href);

                var attempts = self.retryAttempts.get(blockType) || 0;
                if (attempts < self.maxRetries) {
                    self.retryAttempts.set(blockType, attempts + 1);
                    setTimeout(function() {
                        console.log('WDL Dynamic Styles: Retrying load for', blockType);
                        self.loadStylesheet(id, href, type, blockType, onSuccess, onError);
                    }, 500 * (attempts + 1));
                } else {
                    if (onError) onError();
                }
            };

            link.onload = function() {
                console.log('WDL Dynamic Styles: Successfully loaded', type, 'stylesheet for:', blockType);
                if (onSuccess) onSuccess();
            };

            document.head.appendChild(link);

            // WordPress 6.x iframe エディターにも追加
            self.injectStyleToIframe(id, hrefWithCache);
        }

        // iframe内にCSSを注入するヘルパー関数
        injectStyleToIframe(id, href) {
            var iframes = document.querySelectorAll('iframe[name="editor-canvas"], iframe.editor-canvas');
            iframes.forEach(function(iframe) {
                try {
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc && iframeDoc.head && !iframeDoc.getElementById(id)) {
                        var iframeLink = document.createElement('link');
                        iframeLink.id = id;
                        iframeLink.rel = 'stylesheet';
                        iframeLink.href = href;
                        iframeLink.type = 'text/css';
                        iframeDoc.head.appendChild(iframeLink);
                        console.log('WDL Dynamic Styles: Injected to iframe:', id);
                    }
                } catch (e) {
                    // クロスオリジンでアクセスできない場合は無視
                    console.warn('WDL Dynamic Styles: Cannot access iframe:', e.message);
                }
            });
        }

        forceEditorRefresh() {
            if (window.wp && window.wp.data) {
                var editor = document.querySelector('.block-editor-writing-flow');
                if (editor) {
                    editor.style.opacity = '0.999';
                    setTimeout(function() {
                        editor.style.opacity = '1';
                    }, 10);
                }
            }
        }

        destroy() {
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
            }
            this.isInitialized = false;
            this.loadedStyles.clear();
            this.pendingStyles.clear();
            this.pendingBlockElements.clear();
            this.retryAttempts.clear();
            console.log('WDL Dynamic Styles: Monitoring stopped');
        }
    }

    var dynamicLoader;

    if (window.wp && window.wp.data) {
        if (window.wp.domReady) {
            window.wp.domReady(function() {
                dynamicLoader = new WDLDynamicStyleLoader();
            });
        } else {
            dynamicLoader = new WDLDynamicStyleLoader();
        }

        window.addEventListener('beforeunload', function() {
            if (dynamicLoader) {
                dynamicLoader.destroy();
            }
        });
    }

    if (window.location.search.includes('wdl_debug=1')) {
        window.WDLDynamicStyleLoader = dynamicLoader;
    }

})();
