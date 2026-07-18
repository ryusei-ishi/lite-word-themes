(function (wp) {
    'use strict';

    // WordPress APIの存在確認
    if (!wp || !wp.plugins || !wp.element || !wp.components || !wp.data || !wp.blocks) {
        console.warn('LW Custom Block Insert: Required WordPress APIs not available');
        return;
    }

    var registerPlugin = wp.plugins.registerPlugin;
    // wp.editPost.PluginMoreMenuItem を優先、wp.editor をフォールバック
    var PluginMoreMenuItem = (wp.editPost && wp.editPost.PluginMoreMenuItem) || (wp.editor && wp.editor.PluginMoreMenuItem);

    if (!PluginMoreMenuItem) {
        console.warn('LW Custom Block Insert: PluginMoreMenuItem not available');
    }

    var Fragment = wp.element.Fragment;
    var createElement = wp.element.createElement;
    var useState = wp.element.useState;
    var useEffect = wp.element.useEffect;
    var useRef = wp.element.useRef;
    var createPortal = wp.element.createPortal;
    var Button = wp.components.Button;
    var ButtonGroup = wp.components.ButtonGroup;
    var Modal = wp.components.Modal;
    var Spinner = wp.components.Spinner;
    var Icon = wp.components.Icon;
    var Tooltip = wp.components.Tooltip;
    var dispatch = wp.data.dispatch;
    var createBlock = wp.blocks.createBlock;
    var getBlockType = wp.blocks.getBlockType;
    var getSaveContent = wp.blocks.getSaveContent;

    /**
     * JSONデータをWordPressブロックに変換
     */
    function jsonToBlocks(blocksData) {
        if (!blocksData || !Array.isArray(blocksData)) {
            return [];
        }

        return blocksData.map(function(blockData) {
            var innerBlocks = [];
            if (blockData.innerBlocks && blockData.innerBlocks.length > 0) {
                innerBlocks = jsonToBlocks(blockData.innerBlocks);
            }

            return createBlock(
                blockData.name,
                blockData.attributes || {},
                innerBlocks
            );
        });
    }

    // プレビューモード定数
    var PREVIEW_MODE_PC = 'pc';
    var PREVIEW_MODE_SP = 'sp';
    var SP_WIDTH = 375; // スマホプレビュー幅（px）

    // カテゴリー設定（PHPから取得）
    var categoryConfig = lwTemplatePutTest.categoryConfig || {};

    // プレミアム判定（PHPから取得）
    var premiumStatus = lwTemplatePutTest.premiumStatus || {};
    var isUnlocked = premiumStatus.isUnlocked || false;
    var excludedBlocks = premiumStatus.excludedBlocks || [];
    var purchasedBlocks = premiumStatus.purchasedBlocks || [];
    var premiumInfoUrl = premiumStatus.premiumInfoUrl || 'https://lite-word.com/yuryo-plan/';
    var blockShopUrls = premiumStatus.blockShopUrls || {};

    // 初期化時のデバッグ出力（必要時のみ有効化）
    // console.log('[LW Template Put Test] Initialized', { premiumStatus: premiumStatus });

    /**
     * ブロックがロックされているか判定
     */
    function isBlockLocked(block) {
        // 無料ブロックは常にアンロック
        if (block.blockType === 'free') {
            return { locked: false, reason: null };
        }

        var blockSlug = block.slug || '';

        // 除外リストに含まれている場合（プレミアムプラン対象外）
        var isExcluded = excludedBlocks.indexOf(blockSlug) !== -1;

        // 個別購入済みか確認
        var isPurchased = purchasedBlocks.indexOf(blockSlug) !== -1;

        // サブスク/試用期間でアンロック
        if (isUnlocked && !isExcluded) {
            return { locked: false, reason: null };
        }

        // 個別購入済み
        if (isPurchased) {
            return { locked: false, reason: null };
        }

        // ロック中
        if (block.blockType === 'premium') {
            return {
                locked: true,
                reason: isExcluded ? 'excluded' : 'premium',
                label: isExcluded ? 'プレミアムプラン対象外' : 'プレミアム限定'
            };
        }

        if (block.blockType === 'paid') {
            return {
                locked: true,
                reason: 'paid',
                label: '有料'
            };
        }

        return { locked: false, reason: null };
    }

    // カテゴリー名を日本語に変換
    function getCategoryDisplayName(slug) {
        if (categoryConfig[slug]) {
            return categoryConfig[slug].name;
        }
        return slug;
    }

    // カテゴリーの表示順序を取得
    function getCategoryOrder(slug) {
        if (categoryConfig[slug]) {
            return categoryConfig[slug].order;
        }
        return 999;
    }

    // カスタムアイコン（Lwロゴ風）
    var LwIcon = createElement('svg', {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
    },
        createElement('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3, stroke: 'currentColor', strokeWidth: 2 }),
        createElement('path', { d: 'M7 7h4v10H7V7z', fill: 'currentColor' }),
        createElement('path', { d: 'M13 12l4 5h-3l-2.5-3.5L13 12z', fill: 'currentColor' }),
        createElement('path', { d: 'M13 7l4 5h-3l-2.5-3.5L13 7z', fill: 'currentColor' })
    );

    /**
     * 単一ブロックをエディタに挿入（カーソル位置に挿入）
     */
    function insertSingleBlock(block) {
        var select = wp.data.select;
        var newBlock = createBlock(block.name, {});

        // 現在選択されているブロックの情報を取得
        var selectedBlockClientId = select('core/block-editor').getSelectedBlockClientId();
        var selectedBlockIndex = select('core/block-editor').getBlockIndex(selectedBlockClientId);
        var selectedBlockRootClientId = select('core/block-editor').getBlockRootClientId(selectedBlockClientId);

        if (selectedBlockClientId) {
            // 選択されているブロックの直後に挿入
            dispatch('core/block-editor').insertBlocks(
                [newBlock],
                selectedBlockIndex + 1,
                selectedBlockRootClientId
            );
        } else {
            // 選択がない場合は末尾に挿入
            dispatch('core/block-editor').insertBlocks([newBlock]);
        }

        dispatch('core/notices').createSuccessNotice(
            '「' + block.title + '」を挿入しました',
            { type: 'snackbar', isDismissible: true }
        );
    }

    /**
     * ブロックプレビューカードコンポーネント
     */
    function BlockPreviewCard(props) {
        var block = props.block;
        var onInsert = props.onInsert;
        var onPreview = props.onPreview;
        var previewMode = props.previewMode || PREVIEW_MODE_PC;
        var iframeRef = useRef(null);

        var _useState = useState(null);
        var previewData = _useState[0];
        var setPreviewData = _useState[1];

        var _useState2 = useState(true);
        var loading = _useState2[0];
        var setLoading = _useState2[1];

        // サンプル画像があるかチェック（PC/SP両方対応）
        // build/[block-slug]/sample.webp または sample-sp.webp がある場合のみ画像表示
        var sampleImagePc = block.sampleImage ? lwTemplatePutTest.blocksBaseUrl + block.sampleImage : null;
        var sampleImageSp = block.sampleImageSp ? lwTemplatePutTest.blocksBaseUrl + block.sampleImageSp : null;

        // 現在のモードに応じた画像を選択
        // 優先順位: 1. SP画像(SPモード時) 2. PC画像
        // sample.webpがない場合はiframeでプレビュー
        var currentSampleImage = previewMode === PREVIEW_MODE_SP
            ? (sampleImageSp || sampleImagePc)
            : sampleImagePc;
        var hasSampleImage = currentSampleImage ? true : false;

        // プレビューを生成（サンプル画像がない場合のみ）
        useEffect(function () {
            if (!block) return;

            // サンプル画像がある場合はCSS/HTML生成をスキップ
            if (hasSampleImage) {
                setLoading(false);
                return;
            }

            // デフォルト属性を構築
            var defaultAttrs = {};
            if (block.attributes) {
                Object.keys(block.attributes).forEach(function (key) {
                    var attr = block.attributes[key];
                    if (attr.default !== undefined) {
                        defaultAttrs[key] = attr.default;
                    }
                });
            }

            // JavaScript側でブロックのHTMLを生成
            var blockType = getBlockType(block.name);
            var generatedHtml = '';

            if (blockType) {
                try {
                    var tempBlock = createBlock(block.name, defaultAttrs);
                    generatedHtml = getSaveContent(blockType, tempBlock.attributes);
                } catch (err) {
                    // エラーは静かに処理
                }
            }

            // CSSを取得（JSONに含まれるslugを使用）
            var cssBlockSlug = block.slug || block.name.replace('wdl/', '');
            var cssUrl = lwTemplatePutTest.blocksBaseUrl + cssBlockSlug + '/style.css';
            var resetCssUrl = lwTemplatePutTest.resetCssUrl;
            var commonCssUrl = lwTemplatePutTest.commonCssUrl;
            var pageCssUrl = lwTemplatePutTest.pageCssUrl;
            var fontStyleCssUrl = lwTemplatePutTest.fontStyleCssUrl;

            // reset.css, common.css, page.css, font_style.css, ブロックCSSを全て取得
            Promise.all([
                fetch(resetCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(commonCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(pageCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(fontStyleCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(cssUrl).then(function (r) { return r.ok ? r.text() : ''; })
            ])
                .then(function (results) {
                    var resetCss = results[0];
                    var commonCss = results[1];
                    var pageCss = results[2];
                    var fontStyleCss = results[3];
                    var blockCss = results[4];
                    setPreviewData({
                        html: generatedHtml,
                        resetCss: resetCss,
                        commonCss: commonCss,
                        pageCss: pageCss,
                        fontStyleCss: fontStyleCss,
                        cssContent: blockCss
                    });
                    setLoading(false);
                })
                .catch(function (err) {
                    setPreviewData({
                        html: generatedHtml,
                        resetCss: '',
                        commonCss: '',
                        pageCss: '',
                        fontStyleCss: '',
                        cssContent: ''
                    });
                    setLoading(false);
                });
        }, [block, hasSampleImage]);

        // iframeにコンテンツを書き込む（サンプル画像がない場合のみ）
        useEffect(function () {
            if (hasSampleImage || !previewData || !iframeRef.current) return;

            var iframe = iframeRef.current;
            var doc = iframe.contentDocument || iframe.contentWindow.document;

            // test.htmlと同じ構造でHTMLを生成
            // PHPから渡されたCSS変数を使用
            var vars = lwTemplatePutTest.cssVariables || {};
            var cssVariables = ':root { ' +
                '--color-main: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-sub: ' + (vars.colorSub || '#0e1013') + '; ' +
                '--color-accent: ' + (vars.colorAccent || '#d34a4a') + '; ' +
                '--color-text: ' + (vars.colorText || '#060606') + '; ' +
                '--color-page-bg-pc: ' + (vars.colorPageBgPc || '#ffffff') + '; ' +
                '--color-page-bg-sp: ' + (vars.colorPageBgSp || '#ffffff') + '; ' +
                '--color-content-bg-pc: ' + (vars.colorContentBgPc || '#ffffff') + '; ' +
                '--color-content-bg-sp: ' + (vars.colorContentBgSp || '#ffffff') + '; ' +
                '--color-link-common: ' + (vars.colorLinkCommon || '#0066cc') + '; ' +
                '--color-background-all: ' + (vars.colorBackground || '#f4f4f4') + '; ' +
                '--color-1: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-2: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-3: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--max-width-clm-1: ' + (vars.maxWidthClm1 || '1120px') + '; ' +
                '--font-family-gothic: "Hiragino Kaku Gothic ProN", "游ゴシック", "Yu Gothic", "メイリオ", "Meiryo", sans-serif; ' +
                '--font-family-mincho: "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif; ' +
                '}';

            // プレビュー用スタイル
            var previewBaseStyle = 'html, body { margin: 0; } ' +
                'html { overflow-y: auto !important; scrollbar-width: thin; } ' +
                'html::-webkit-scrollbar { width: 8px; } ' +
                'html::-webkit-scrollbar-track { background: #f1f1f1; } ' +
                'html::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; } ' +
                'html::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }';

            // 縦中央配置スタイル（全ブロック共通）
            // コンテンツが高さを超える場合は上寄せ、超えない場合は中央寄せ
            var previewCenterStyle = 'html { height: 100%; } ' +
                'body { min-height: 100%; display: flex; flex-direction: column; margin: 0; } ' +
                'main { width: 100%; margin: auto 0; }';

            var htmlContent = '<!DOCTYPE html><html><head>' +
                '<meta charset="UTF-8">' +
                '<meta name="viewport" content="width=' + (previewMode === PREVIEW_MODE_SP ? SP_WIDTH : 1200) + '">' +
                '<style>' +
                cssVariables +
                (previewData.resetCss || '') +
                (previewData.commonCss || '') +
                (previewData.pageCss || '') +
                (previewData.fontStyleCss || '') +
                (previewData.cssContent || '') +
                previewBaseStyle +
                previewCenterStyle +
                '</style>' +
                '</head><body>' +
                '<main>' +
                '<div class="lw_content_wrap page">' +
                '<div class="main_content">' +
                '<section class="post_content">' +
                '<div class="post_style">' +
                (previewData.html || '<p style="color:#999;text-align:center;padding:20px;">プレビューなし</p>') +
                '</div>' +
                '</section>' +
                '</div>' +
                '</div>' +
                '</main>' +
                '</body></html>';

            doc.open();
            doc.write(htmlContent);
            doc.close();

            // iframe高さを動的に調整
            setTimeout(function() {
                if (!iframe.contentWindow) return;
                var body = iframe.contentWindow.document.body;
                var html = iframe.contentWindow.document.documentElement;
                if (!body || !html) return;

                // コンテンツの実際の高さを取得
                var contentHeight = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight
                );

                // iframeの高さをコンテンツに合わせる
                iframe.style.height = contentHeight + 'px';

                // 親要素の高さをscale(0.5)後のサイズに合わせる
                var previewContainer = iframe.closest('.lw-block-card-preview');
                if (previewContainer) {
                    // scale(0.5)なので表示サイズは50% + padding 48px (上下24pxずつ)
                    previewContainer.style.height = (contentHeight * 0.5 + 48) + 'px';
                }
            }, 100);
        }, [previewData, previewMode]);

        // ブロックが登録されているか確認
        var blockType = getBlockType(block.name);
        var isBlockRegistered = blockType ? true : false;

        // プレビューコンテンツを決定
        var previewContent;
        if (loading) {
            previewContent = createElement(
                'div',
                { className: 'lw-block-card-loading' },
                createElement(Spinner, null)
            );
        } else if (hasSampleImage) {
            // サンプル画像を表示
            previewContent = createElement('img', {
                src: currentSampleImage,
                className: 'lw-block-card-sample-image' + (previewMode === PREVIEW_MODE_SP ? ' is-sp-mode' : ''),
                alt: block.title
            });
        } else if (isBlockRegistered) {
            // ブロックが登録されている場合はiframeプレビューを表示
            previewContent = createElement('iframe', {
                ref: iframeRef,
                className: 'lw-block-card-iframe' + (previewMode === PREVIEW_MODE_SP ? ' is-sp-mode' : ''),
                title: block.title
            });
        } else {
            // サンプル画像もなく、ブロックも未登録の場合はプレースホルダー
            previewContent = createElement(
                'div',
                { className: 'lw-block-card-no-preview' },
                createElement('span', { className: 'lw-no-preview-icon' }, '🖼'),
                createElement('span', { className: 'lw-no-preview-text' }, 'プレビュー準備中')
            );
        }

        // ロック状態を判定
        var lockStatus = isBlockLocked(block);
        var cardClassName = 'lw-block-card' + (lockStatus.locked ? ' is-locked' : '');

        // 詳細リンクのURLを決定（有料ブロックは購入ページ、プレミアムはプレミアム説明ページ）
        var detailUrl = premiumInfoUrl;
        if (lockStatus.reason === 'paid' && blockShopUrls[block.slug]) {
            detailUrl = blockShopUrls[block.slug];
        }

        // プレビューエリア内に表示するバッジ（ロック時のみ）
        var previewBadge = null;
        if (lockStatus.locked) {
            previewBadge = createElement(
                'span',
                { className: 'lw-block-card-badge lw-badge-' + lockStatus.reason + ' lw-badge-in-preview' },
                lockStatus.label
            );
        }

        // フッターの右側要素を生成
        var footerRightContent;
        if (lockStatus.locked) {
            // ロック中：プレビューボタン + 詳細を見るリンク
            footerRightContent = createElement(
                'div',
                { className: 'lw-block-card-footer-actions' },
                createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-block-card-preview-btn',
                        onClick: function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onPreview) {
                                onPreview(block);
                            }
                        },
                        title: '大きくプレビュー'
                    },
                    createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('path', {
                            d: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
                            stroke: 'currentColor',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        })
                    )
                ),
                createElement(
                    'a',
                    {
                        href: detailUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'lw-block-card-detail-btn'
                    },
                    '詳細を見る'
                )
            );
        } else {
            // アンロック：プレビューボタン + 挿入ボタン
            footerRightContent = createElement(
                'div',
                { className: 'lw-block-card-footer-actions' },
                createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-block-card-preview-btn',
                        onClick: function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onPreview) {
                                onPreview(block);
                            }
                        },
                        title: '大きくプレビュー'
                    },
                    createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('path', {
                            d: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
                            stroke: 'currentColor',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        })
                    )
                ),
                createElement(
                    Button,
                    {
                        variant: 'primary',
                        className: 'lw-block-card-insert-btn',
                        onClick: function () {
                            onInsert(block);
                        }
                    },
                    '挿入'
                )
            );
        }

        // プレビューエリアクリック時の処理
        function handlePreviewClick(e) {
            e.preventDefault();
            e.stopPropagation();
            // ロックされていなければ挿入
            if (!lockStatus.locked) {
                onInsert(block);
            }
        }

        // ロック時のツールチップテキスト
        var lockTooltip = '';
        if (lockStatus.locked) {
            if (lockStatus.reason === 'premium') {
                lockTooltip = 'プレミアム限定のため利用できません';
            } else if (lockStatus.reason === 'paid') {
                lockTooltip = '有料ブロックのため利用できません';
            } else if (lockStatus.reason === 'excluded') {
                lockTooltip = '買い切り専用のため利用できません';
            }
        }

        return createElement(
            'div',
            { className: cardClassName },
            // プレビューエリア
            createElement(
                'div',
                {
                    className: 'lw-block-card-preview' + (previewMode === PREVIEW_MODE_SP ? ' is-sp-mode' : ''),
                    style: { position: 'relative' }
                },
                previewContent,
                // 左上にバッジを表示（ロック時のみ）
                previewBadge,
                // iframeの上に透明なオーバーレイを配置してクリックをキャッチ（スクロールは通過）
                createElement('div', {
                    className: 'lw-block-card-preview-overlay' + (lockStatus.locked ? ' is-locked' : ''),
                    onClick: handlePreviewClick,
                    title: lockTooltip,
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        cursor: lockStatus.locked ? 'not-allowed' : 'pointer',
                        zIndex: 10,
                        pointerEvents: 'auto'
                    },
                    onWheel: function(e) {
                        // スクロールイベントをiframeに伝播
                        var target = e.currentTarget; // イベントターゲットを変数に保存
                        target.style.pointerEvents = 'none';
                        setTimeout(function() {
                            target.style.pointerEvents = 'auto';
                        }, 100);
                    }
                })
            ),
            // フッター
            createElement(
                'div',
                { className: 'lw-block-card-footer' },
                createElement('span', { className: 'lw-block-card-title' }, block.title || block.name),
                footerRightContent
            )
        );
    }

    /**
     * フルプレビューオーバーレイコンポーネント
     */
    function FullPreviewOverlay(props) {
        var block = props.block;
        var blocks = props.blocks;
        var onClose = props.onClose;
        var onInsert = props.onInsert;
        var previewMode = props.previewMode || PREVIEW_MODE_PC;

        var iframeRef = useRef(null);
        var _useState = useState(null);
        var previewData = _useState[0];
        var setPreviewData = _useState[1];

        var _useState2 = useState(true);
        var loading = _useState2[0];
        var setLoading = _useState2[1];

        // 現在のブロックのインデックスを取得
        var currentIndex = blocks.findIndex(function (b) { return b.name === block.name; });

        // 前後のブロックに移動
        function goToPrev() {
            if (currentIndex > 0) {
                props.onNavigate(blocks[currentIndex - 1]);
            }
        }

        function goToNext() {
            if (currentIndex < blocks.length - 1) {
                props.onNavigate(blocks[currentIndex + 1]);
            }
        }

        // キーボード操作
        useEffect(function () {
            function handleKeyDown(e) {
                if (e.key === 'Escape') {
                    onClose();
                } else if (e.key === 'ArrowLeft') {
                    goToPrev();
                } else if (e.key === 'ArrowRight') {
                    goToNext();
                }
            }
            document.addEventListener('keydown', handleKeyDown);
            return function () {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }, [currentIndex]);

        // サンプル画像チェック
        var sampleImagePc = block.sampleImage ? lwTemplatePutTest.blocksBaseUrl + block.sampleImage : null;
        var sampleImageSp = block.sampleImageSp ? lwTemplatePutTest.blocksBaseUrl + block.sampleImageSp : null;
        var currentSampleImage = previewMode === PREVIEW_MODE_SP
            ? (sampleImageSp || sampleImagePc)
            : sampleImagePc;
        var hasSampleImage = currentSampleImage ? true : false;

        // プレビューを生成（サンプル画像がない場合のみ）
        useEffect(function () {
            if (!block) return;

            if (hasSampleImage) {
                setLoading(false);
                return;
            }

            var defaultAttrs = {};
            if (block.attributes) {
                Object.keys(block.attributes).forEach(function (key) {
                    var attr = block.attributes[key];
                    if (attr.default !== undefined) {
                        defaultAttrs[key] = attr.default;
                    }
                });
            }

            var blockType = getBlockType(block.name);
            var generatedHtml = '';

            if (blockType) {
                try {
                    var tempBlock = createBlock(block.name, defaultAttrs);
                    generatedHtml = getSaveContent(blockType, tempBlock.attributes);
                } catch (err) {
                    // エラーは静かに処理
                }
            }

            var cssBlockSlug = block.slug || block.name.replace('wdl/', '');
            var cssUrl = lwTemplatePutTest.blocksBaseUrl + cssBlockSlug + '/style.css';

            Promise.all([
                fetch(lwTemplatePutTest.resetCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(lwTemplatePutTest.commonCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(lwTemplatePutTest.pageCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(lwTemplatePutTest.fontStyleCssUrl).then(function (r) { return r.ok ? r.text() : ''; }),
                fetch(cssUrl).then(function (r) { return r.ok ? r.text() : ''; })
            ])
                .then(function (results) {
                    setPreviewData({
                        html: generatedHtml,
                        resetCss: results[0],
                        commonCss: results[1],
                        pageCss: results[2],
                        fontStyleCss: results[3],
                        cssContent: results[4]
                    });
                    setLoading(false);
                })
                .catch(function () {
                    setPreviewData({ html: generatedHtml, resetCss: '', commonCss: '', pageCss: '', fontStyleCss: '', cssContent: '' });
                    setLoading(false);
                });
        }, [block, hasSampleImage]);

        // iframeにコンテンツを書き込む
        useEffect(function () {
            if (hasSampleImage || !previewData || !iframeRef.current) return;

            var iframe = iframeRef.current;
            var doc = iframe.contentDocument || iframe.contentWindow.document;

            var vars = lwTemplatePutTest.cssVariables || {};
            var cssVariables = ':root { ' +
                '--color-main: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-sub: ' + (vars.colorSub || '#0e1013') + '; ' +
                '--color-accent: ' + (vars.colorAccent || '#d34a4a') + '; ' +
                '--color-text: ' + (vars.colorText || '#060606') + '; ' +
                '--color-page-bg-pc: ' + (vars.colorPageBgPc || '#ffffff') + '; ' +
                '--color-page-bg-sp: ' + (vars.colorPageBgSp || '#ffffff') + '; ' +
                '--color-content-bg-pc: ' + (vars.colorContentBgPc || '#ffffff') + '; ' +
                '--color-content-bg-sp: ' + (vars.colorContentBgSp || '#ffffff') + '; ' +
                '--color-link-common: ' + (vars.colorLinkCommon || '#0066cc') + '; ' +
                '--color-background-all: ' + (vars.colorBackground || '#f4f4f4') + '; ' +
                '--color-1: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-2: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-3: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--max-width-clm-1: ' + (vars.maxWidthClm1 || '1120px') + '; ' +
                '--font-family-gothic: "Hiragino Kaku Gothic ProN", "游ゴシック", "Yu Gothic", "メイリオ", "Meiryo", sans-serif; ' +
                '--font-family-mincho: "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif; ' +
                '}';

            var previewBaseStyle = 'html, body { margin: 0; } ' +
                'html { overflow-y: auto !important; }';

            var previewCenterStyle = 'html { height: 100%; } ' +
                'body { min-height: 100%; display: flex; flex-direction: column; margin: 0; } ' +
                'main { width: 100%; margin: auto 0; }';

            var htmlContent = '<!DOCTYPE html><html><head>' +
                '<meta charset="UTF-8">' +
                '<meta name="viewport" content="width=' + (previewMode === PREVIEW_MODE_SP ? SP_WIDTH : 1200) + '">' +
                '<style>' +
                cssVariables +
                (previewData.resetCss || '') +
                (previewData.commonCss || '') +
                (previewData.pageCss || '') +
                (previewData.fontStyleCss || '') +
                (previewData.cssContent || '') +
                previewBaseStyle +
                previewCenterStyle +
                '</style>' +
                '</head><body>' +
                '<main>' +
                '<div class="lw_content_wrap page">' +
                '<div class="main_content">' +
                '<section class="post_content">' +
                '<div class="post_style">' +
                (previewData.html || '<p style="color:#999;text-align:center;padding:20px;">プレビューなし</p>') +
                '</div>' +
                '</section>' +
                '</div>' +
                '</div>' +
                '</main>' +
                '</body></html>';

            doc.open();
            doc.write(htmlContent);
            doc.close();

            // iframe高さを動的に調整（フルプレビュー用）
            setTimeout(function() {
                if (!iframe.contentWindow) return;
                var body = iframe.contentWindow.document.body;
                var html = iframe.contentWindow.document.documentElement;
                if (!body || !html) return;

                // コンテンツの実際の高さを取得
                var contentHeight = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight
                );

                // フルプレビューはscale(0.95)なので調整
                // 高さはそのまま使用（コンテナが自動調整）
                iframe.style.height = contentHeight + 'px';
            }, 100);
        }, [previewData, previewMode]);

        // ロック状態を判定
        var lockStatus = isBlockLocked(block);

        // プレビューコンテンツ
        var previewContent;
        if (loading) {
            previewContent = createElement(
                'div',
                { className: 'lw-full-preview-loading' },
                createElement(Spinner, null)
            );
        } else if (hasSampleImage) {
            previewContent = createElement('img', {
                src: currentSampleImage,
                className: 'lw-full-preview-image' + (previewMode === PREVIEW_MODE_SP ? ' is-sp-mode' : ''),
                alt: block.title
            });
        } else {
            previewContent = createElement('iframe', {
                ref: iframeRef,
                className: 'lw-full-preview-iframe' + (previewMode === PREVIEW_MODE_SP ? ' is-sp-mode' : ''),
                title: block.title
            });
        }

        var overlayElement = createElement(
            'div',
            { className: 'lw-full-preview-overlay', onClick: onClose },
            createElement(
                'div',
                { className: 'lw-full-preview-container', onClick: function (e) { e.stopPropagation(); } },
                // ヘッダー
                createElement(
                    'div',
                    { className: 'lw-full-preview-header' },
                    createElement('span', { className: 'lw-full-preview-title' }, block.title || block.name),
                    createElement(
                        'div',
                        { className: 'lw-full-preview-actions' },
                        !lockStatus.locked && createElement(
                            Button,
                            {
                                variant: 'primary',
                                className: 'lw-full-preview-insert-btn',
                                onClick: function () {
                                    onInsert(block);
                                    onClose();
                                }
                            },
                            '挿入'
                        ),
                        createElement(
                            'button',
                            {
                                type: 'button',
                                className: 'lw-full-preview-close-btn',
                                onClick: onClose
                            },
                            createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none' },
                                createElement('path', {
                                    d: 'M18 6L6 18M6 6l12 12',
                                    stroke: 'currentColor',
                                    strokeWidth: 2,
                                    strokeLinecap: 'round'
                                })
                            )
                        )
                    )
                ),
                // プレビューエリア
                createElement(
                    'div',
                    { className: 'lw-full-preview-content' },
                    previewContent
                ),
                // ナビゲーション矢印（前）
                currentIndex > 0 && createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-full-preview-nav lw-full-preview-nav-prev',
                        onClick: goToPrev
                    },
                    createElement('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('path', {
                            d: 'M15 18l-6-6 6-6',
                            stroke: 'currentColor',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        })
                    )
                ),
                // ナビゲーション矢印（次）
                currentIndex < blocks.length - 1 && createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-full-preview-nav lw-full-preview-nav-next',
                        onClick: goToNext
                    },
                    createElement('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('path', {
                            d: 'M9 18l6-6-6-6',
                            stroke: 'currentColor',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        })
                    )
                ),
                // カウンター
                createElement(
                    'div',
                    { className: 'lw-full-preview-counter' },
                    (currentIndex + 1) + ' / ' + blocks.length
                )
            )
        );

        return createPortal(overlayElement, document.body);
    }

    /**
     * セクションテンプレートカードコンポーネント（iframeプレビュー）
     */
    function SectionTemplateCard(props) {
        var template = props.template;
        var onInsert = props.onInsert;
        var onPreview = props.onPreview;

        // プレビュー画像URLがある場合は画像モードを使用
        var hasPreviewImage = template.previewImageUrl && template.previewImageUrl !== '';

        var iframeRef = useRef(null);
        var _useState1 = useState(null);
        var previewData = _useState1[0];
        var setPreviewData = _useState1[1];

        var _useState2 = useState(!hasPreviewImage); // 画像がある場合はローディング不要
        var loading = _useState2[0];
        var setLoading = _useState2[1];

        // ブロックからHTMLを再帰的に生成する関数
        function generateBlockHtml(block) {
            var blockType = getBlockType(block.name);
            if (!blockType) {
                return '';
            }

            try {
                // innerBlocksがある場合は先に子ブロックのHTMLを生成
                var innerHtml = '';
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    innerHtml = block.innerBlocks.map(function (innerBlock) {
                        return generateBlockHtml(innerBlock);
                    }).join('');
                }

                // getSaveContentでブロックのHTMLを生成
                var html = getSaveContent(blockType, block.attributes, block.innerBlocks);

                // InnerBlocks.Contentが出力するWordPressブロックコメントを純粋なinnerHtmlで置換
                if (innerHtml) {
                    // すべてのブロックコメントを除去
                    var cleanedHtml = html.replace(/<!--\s*\/?wp:[^>]*-->/g, '');

                    // innerBlocksを含むブロックの場合、適切な場所にinnerHtmlを挿入
                    // lw-bg-1-wrap クラスを持つdivの内部に挿入
                    if (block.name === 'wdl/lw-bg-1') {
                        // lw-bg-1-wrap の中にinnerHtmlを挿入
                        cleanedHtml = cleanedHtml.replace(
                            /(<div[^>]*class="lw-bg-1-wrap"[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>)$/,
                            function(match, openTag, content, closingTags) {
                                return openTag + innerHtml + closingTags;
                            }
                        );
                    }
                    html = cleanedHtml;
                }

                return html;
            } catch (err) {
                return '';
            }
        }

        // テンプレートのブロックからHTMLを生成してプレビュー
        useEffect(function () {
            if (!template || !template.filename) return;
            // プレビュー画像がある場合はiframeプレビューをスキップ
            if (hasPreviewImage) return;

            // テンプレートデータを取得してブロックを生成
            fetch(lwTemplatePutTest.restUrl + '/section-templates/' + template.filename, {
                headers: {
                    'X-WP-Nonce': lwTemplatePutTest.nonce
                }
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                // JSONからブロックを生成
                var blocks = jsonToBlocks(data.data);

                if (blocks.length === 0) {
                    setLoading(false);
                    return;
                }

                // 各ブロックのHTMLを生成
                var generatedHtml = blocks.map(function (block) {
                    return generateBlockHtml(block);
                }).join('');

                // CSSを取得
                Promise.all([
                    fetch(lwTemplatePutTest.resetCssUrl).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; }),
                    fetch(lwTemplatePutTest.commonCssUrl).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; }),
                    fetch(lwTemplatePutTest.pageCssUrl).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; }),
                    fetch(lwTemplatePutTest.fontStyleCssUrl).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; })
                ]).then(function (results) {
                    // テンプレート内のブロックのCSSを収集
                    var blockCssPromises = [];
                    var processedBlocks = {};

                    // ブロック名からCSSディレクトリ名へのマッピング
                    var blockSlugMap = {
                        'lw-button-01': 'lw-button-1'
                    };

                    function collectBlockCss(blockList) {
                        blockList.forEach(function (block) {
                            if (!processedBlocks[block.name]) {
                                processedBlocks[block.name] = true;
                                // ブロック名からslugを取得（wdl/lw-bg-1 → lw-bg-1）
                                var slug = block.name.replace('wdl/', '');
                                // マッピングがあれば適用
                                if (blockSlugMap[slug]) {
                                    slug = blockSlugMap[slug];
                                }
                                var cssUrl = lwTemplatePutTest.blocksBaseUrl + slug + '/style.css';
                                blockCssPromises.push(
                                    fetch(cssUrl).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; })
                                );
                            }
                            if (block.innerBlocks && block.innerBlocks.length > 0) {
                                collectBlockCss(block.innerBlocks);
                            }
                        });
                    }

                    collectBlockCss(blocks);

                    return Promise.all(blockCssPromises).then(function (blockCssResults) {
                        var allBlockCss = blockCssResults.join('\n');
                        setPreviewData({
                            html: generatedHtml,
                            resetCss: results[0],
                            commonCss: results[1],
                            pageCss: results[2],
                            fontStyleCss: results[3],
                            blockCss: allBlockCss
                        });
                        setLoading(false);
                    });
                });
            })
            .catch(function (err) {
                setLoading(false);
            });
        }, [template.filename]);

        // iframeにコンテンツを書き込む
        useEffect(function () {
            if (!previewData || !iframeRef.current) return;

            var iframe = iframeRef.current;
            var doc = iframe.contentDocument || iframe.contentWindow.document;

            var vars = lwTemplatePutTest.cssVariables || {};
            var cssVariables = ':root { ' +
                '--color-main: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-sub: ' + (vars.colorSub || '#0e1013') + '; ' +
                '--color-accent: ' + (vars.colorAccent || '#d34a4a') + '; ' +
                '--color-text: ' + (vars.colorText || '#060606') + '; ' +
                '--color-page-bg-pc: ' + (vars.colorPageBgPc || '#ffffff') + '; ' +
                '--color-page-bg-sp: ' + (vars.colorPageBgSp || '#ffffff') + '; ' +
                '--color-content-bg-pc: ' + (vars.colorContentBgPc || '#ffffff') + '; ' +
                '--color-content-bg-sp: ' + (vars.colorContentBgSp || '#ffffff') + '; ' +
                '--color-link-common: ' + (vars.colorLinkCommon || '#0066cc') + '; ' +
                '--color-background-all: ' + (vars.colorBackground || '#f4f4f4') + '; ' +
                '--color-1: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-2: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--color-3: ' + (vars.colorMain || '#1a72ad') + '; ' +
                '--max-width-clm-1: ' + (vars.maxWidthClm1 || '1120px') + '; ' +
                '--font-family-gothic: "Hiragino Kaku Gothic ProN", "游ゴシック", "Yu Gothic", "メイリオ", "Meiryo", sans-serif; ' +
                '--font-family-mincho: "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif; ' +
                '}';

            var previewBaseStyle = 'html, body { margin: 0; padding: 0; } ' +
                'html { overflow: hidden; }';

            var htmlContent = '<!DOCTYPE html><html><head>' +
                '<meta charset="UTF-8">' +
                '<meta name="viewport" content="width=1200">' +
                '<style>' +
                cssVariables +
                (previewData.resetCss || '') +
                (previewData.commonCss || '') +
                (previewData.pageCss || '') +
                (previewData.fontStyleCss || '') +
                (previewData.blockCss || '') +
                previewBaseStyle +
                '</style>' +
                '</head><body>' +
                '<main>' +
                '<div class="lw_content_wrap page">' +
                '<div class="main_content">' +
                '<section class="post_content">' +
                '<div class="post_style">' +
                (previewData.html || '') +
                '</div>' +
                '</section>' +
                '</div>' +
                '</div>' +
                '</main>' +
                '</body></html>';

            doc.open();
            doc.write(htmlContent);
            doc.close();

            // iframe高さを動的に調整（セクションテンプレート用）
            setTimeout(function() {
                if (!iframe.contentWindow) return;
                var body = iframe.contentWindow.document.body;
                var html = iframe.contentWindow.document.documentElement;
                if (!body || !html) return;

                // コンテンツの実際の高さを取得
                var contentHeight = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight
                );

                // iframeの高さをコンテンツに合わせる
                iframe.style.height = contentHeight + 'px';

                // 親要素の高さをscale(0.5)後のサイズに合わせる
                var previewContainer = iframe.closest('.lw-block-card-preview');
                if (previewContainer) {
                    // scale(0.5)なので表示サイズは50% + padding 48px
                    previewContainer.style.height = (contentHeight * 0.5 + 48) + 'px';
                }
            }, 100);

        }, [previewData]);

        // プレビューコンテンツ
        var previewContent;
        if (hasPreviewImage) {
            // プレビュー画像がある場合は画像を表示
            previewContent = createElement('img', {
                src: template.previewImageUrl,
                alt: template.name,
                className: 'lw-block-card-preview-image'
            });
        } else if (loading) {
            previewContent = createElement(
                'div',
                { className: 'lw-block-card-loading' },
                createElement(Spinner, null)
            );
        } else if (previewData) {
            previewContent = createElement('iframe', {
                ref: iframeRef,
                className: 'lw-block-card-iframe',
                title: template.name
            });
        } else {
            previewContent = createElement(
                'div',
                { className: 'lw-block-card-no-preview' },
                createElement('span', { className: 'lw-no-preview-icon' }, '🖼'),
                createElement('span', { className: 'lw-no-preview-text' }, 'プレビュー準備中')
            );
        }

        // プレミアムテンプレートのロック判定
        var isPremiumTemplate = template.isPremium || false;
        var isTemplateLocked = isPremiumTemplate && !isUnlocked;
        var cardClassName = 'lw-block-card lw-section-template-card' + (isTemplateLocked ? ' is-locked' : '');

        // プレビューエリア内に表示するバッジ（プレミアム時のみ）
        var previewBadge = null;
        if (isPremiumTemplate) {
            previewBadge = createElement(
                'span',
                { className: 'lw-block-card-badge lw-badge-premium lw-badge-in-preview' },
                'プレミアム限定'
            );
        }

        // フッターの右側要素を生成
        var footerRightContent;
        if (isTemplateLocked) {
            // ロック中：プレビューボタン + 詳細を見るリンク
            footerRightContent = createElement(
                'div',
                { className: 'lw-block-card-footer-actions' },
                onPreview && createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-block-card-preview-btn',
                        onClick: function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onPreview) onPreview(template);
                        },
                        title: '大きくプレビュー'
                    },
                    createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('path', {
                            d: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
                            stroke: 'currentColor',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        })
                    )
                ),
                createElement(
                    'a',
                    {
                        href: premiumInfoUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'lw-block-card-detail-btn'
                    },
                    '詳細を見る'
                )
            );
        } else {
            // アンロック：プレビューボタン + 挿入ボタン
            footerRightContent = createElement(
                'div',
                { className: 'lw-block-card-footer-actions' },
                onPreview && createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-block-card-preview-btn',
                        onClick: function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onPreview) onPreview(template);
                        },
                        title: '大きくプレビュー'
                    },
                    createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('path', {
                            d: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
                            stroke: 'currentColor',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        })
                    )
                ),
                createElement(
                    Button,
                    {
                        variant: 'primary',
                        className: 'lw-block-card-insert-btn',
                        onClick: function () {
                            onInsert(template);
                        }
                    },
                    '挿入'
                )
            );
        }

        // プレビューエリアクリック時の処理
        function handlePreviewClick(e) {
            e.preventDefault();
            e.stopPropagation();
            // ロックされていなければ挿入
            if (!isTemplateLocked) {
                onInsert(template);
            }
        }

        return createElement(
            'div',
            { className: cardClassName },
            // プレビューエリア
            createElement(
                'div',
                {
                    className: 'lw-block-card-preview',
                    style: { position: 'relative', cursor: isTemplateLocked ? 'not-allowed' : 'pointer' },
                    onClick: handlePreviewClick,
                    title: isTemplateLocked ? 'プレミアム限定のため利用できません' : 'クリックして挿入'
                },
                previewContent,
                // 左上にバッジを表示（プレミアム時のみ）
                previewBadge
            ),
            // フッター
            createElement(
                'div',
                { className: 'lw-block-card-footer' },
                createElement('span', { className: 'lw-block-card-title' }, template.name),
                footerRightContent
            )
        );
    }

    /**
     * テンプレートモーダルコンポーネント
     */
    function TemplateModal(props) {
        var isOpen = props.isOpen;
        var onClose = props.onClose;
        var propsInitialCategory = props.initialCategory || null;

        // メインタブ：blocks or templates
        var _useStateMainTab = useState('blocks');
        var mainTab = _useStateMainTab[0];
        var setMainTab = _useStateMainTab[1];

        var _useState = useState([]);
        var blocks = _useState[0];
        var setBlocks = _useState[1];

        var _useState2 = useState([]);
        var categories = _useState2[0];
        var setCategories = _useState2[1];

        var _useState3 = useState(null);
        var selectedCategory = _useState3[0];
        var setSelectedCategory = _useState3[1];

        var _useState4 = useState(true);
        var loading = _useState4[0];
        var setLoading = _useState4[1];

        var _useState5 = useState(null);
        var error = _useState5[0];
        var setError = _useState5[1];

        var _useState6 = useState(PREVIEW_MODE_PC);
        var previewMode = _useState6[0];
        var setPreviewMode = _useState6[1];

        var _useState7 = useState(false);
        var showOnlyAvailable = _useState7[0];
        var setShowOnlyAvailable = _useState7[1];

        var _useState8 = useState(null);
        var fullPreviewBlock = _useState8[0];
        var setFullPreviewBlock = _useState8[1];

        // ブロックグリッドへの参照（スクロール位置リセット用）
        var blockGridRef = useRef(null);

        // セクションテンプレート用state
        var _useStateSectionTemplates = useState([]);
        var sectionTemplates = _useStateSectionTemplates[0];
        var setSectionTemplates = _useStateSectionTemplates[1];

        var _useStateSectionLoading = useState(false);
        var sectionLoading = _useStateSectionLoading[0];
        var setSectionLoading = _useStateSectionLoading[1];

        // セクションテンプレート一覧を取得
        useEffect(function () {
            if (!isOpen || mainTab !== 'templates') return;
            if (sectionTemplates.length > 0) {
                return;
            }

            setSectionLoading(true);

            fetch(lwTemplatePutTest.restUrl + '/section-templates', {
                headers: {
                    'X-WP-Nonce': lwTemplatePutTest.nonce
                }
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                setSectionTemplates(data);
                setSectionLoading(false);
            })
            .catch(function (err) {
                setSectionLoading(false);
            });
        }, [isOpen, mainTab]);

        // ブロック一覧を取得
        useEffect(function () {
            if (!isOpen) return;

            setLoading(true);

            fetch(lwTemplatePutTest.restUrl + '/templates', {
                headers: {
                    'X-WP-Nonce': lwTemplatePutTest.nonce
                }
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('取得失敗');
                    return response.json();
                })
                .then(function (data) {
                    var allBlocks = data.blocks || [];
                    setBlocks(allBlocks);

                    // カテゴリーを抽出
                    var categoryMap = {};
                    allBlocks.forEach(function (block) {
                        var cat = block.category || 'その他';
                        if (!categoryMap[cat]) {
                            categoryMap[cat] = [];
                        }
                        categoryMap[cat].push(block);
                    });

                    var categoryList = Object.keys(categoryMap).map(function (name) {
                        return {
                            name: name,
                            count: categoryMap[name].length,
                            blocks: categoryMap[name]
                        };
                    });

                    // カテゴリーの表示順序でソート
                    categoryList.sort(function (a, b) {
                        return getCategoryOrder(a.name) - getCategoryOrder(b.name);
                    });

                    setCategories(categoryList);

                    // 初期カテゴリーを選択（propsで指定されている場合はそれを優先）
                    var targetCategory = propsInitialCategory || 'lw-heading';
                    var foundCategory = categoryList.find(function (cat) {
                        return cat.name === targetCategory;
                    });
                    if (foundCategory) {
                        setSelectedCategory(targetCategory);
                    } else if (categoryList.length > 0) {
                        setSelectedCategory(categoryList[0].name);
                    }

                    setLoading(false);
                })
                .catch(function (err) {
                    setError(err.message);
                    setLoading(false);
                });
        }, [isOpen]);

        if (!isOpen) return null;

        // フィルタリング関数
        function filterBlocksByAvailability(blockList) {
            if (!showOnlyAvailable) return blockList;
            return blockList.filter(function (block) {
                var lockStatus = isBlockLocked(block);
                return !lockStatus.locked;
            });
        }

        // カテゴリーごとの利用可能ブロック数を計算
        function getAvailableCount(cat) {
            return cat.blocks.filter(function (block) {
                var lockStatus = isBlockLocked(block);
                return !lockStatus.locked;
            }).length;
        }

        // 選択されたカテゴリーのブロック
        var filteredBlocks = [];
        if (selectedCategory) {
            var cat = categories.find(function (c) { return c.name === selectedCategory; });
            if (cat) filteredBlocks = filterBlocksByAvailability(cat.blocks);
        }

        // フィルタリング後にカテゴリーも絞り込む（利用可能ブロックのみ表示時）
        var displayCategories = showOnlyAvailable
            ? categories.filter(function (cat) { return getAvailableCount(cat) > 0; })
            : categories;

        // ユーティリティブロック挿入関数
        function insertUtilityBlock(blockName) {
            var blockType = wp.blocks.getBlockType(blockName);
            if (!blockType) {
                console.warn('Block not found:', blockName);
                return;
            }
            var newBlock = wp.blocks.createBlock(blockName);
            var blockEditor = wp.data.dispatch('core/block-editor');
            blockEditor.insertBlocks(newBlock);
            onClose();
        }

        // メインタブ切り替えボタン
        var mainTabButtons = createElement(
            'div',
            { className: 'lw-main-tab-buttons' },
            createElement(
                'button',
                {
                    type: 'button',
                    className: 'lw-main-tab-btn' + (mainTab === 'blocks' ? ' is-active' : ''),
                    onClick: function () { setMainTab('blocks'); }
                },
                createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', style: { marginRight: '6px' } },
                    createElement('rect', { x: 3, y: 3, width: 7, height: 7, rx: 1, stroke: 'currentColor', strokeWidth: 2 }),
                    createElement('rect', { x: 14, y: 3, width: 7, height: 7, rx: 1, stroke: 'currentColor', strokeWidth: 2 }),
                    createElement('rect', { x: 3, y: 14, width: 7, height: 7, rx: 1, stroke: 'currentColor', strokeWidth: 2 }),
                    createElement('rect', { x: 14, y: 14, width: 7, height: 7, rx: 1, stroke: 'currentColor', strokeWidth: 2 })
                ),
                'ブロック'
            ),
            createElement(
                'button',
                {
                    type: 'button',
                    className: 'lw-main-tab-btn' + (mainTab === 'templates' ? ' is-active' : ''),
                    onClick: function () { setMainTab('templates'); }
                },
                createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', style: { marginRight: '6px' } },
                    createElement('rect', { x: 3, y: 3, width: 18, height: 18, rx: 2, stroke: 'currentColor', strokeWidth: 2 }),
                    createElement('line', { x1: 3, y1: 9, x2: 21, y2: 9, stroke: 'currentColor', strokeWidth: 2 }),
                    createElement('line', { x1: 9, y1: 9, x2: 9, y2: 21, stroke: 'currentColor', strokeWidth: 2 })
                ),
                'テンプレート'
            ),
            // ユーティリティボタングループ（右上に配置）
            createElement(
                'div',
                { className: 'lw-utility-buttons' },
                // コンテナブロック
                createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-utility-btn',
                        onClick: function () { insertUtilityBlock('wdl/lw-bg-1'); },
                        title: 'コンテナを挿入'
                    },
                    createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('rect', { x: 3, y: 3, width: 18, height: 18, rx: 2, stroke: 'currentColor', strokeWidth: 2 }),
                        createElement('rect', { x: 6, y: 6, width: 12, height: 12, rx: 1, stroke: 'currentColor', strokeWidth: 1.5, strokeDasharray: '2 2' })
                    ),
                    createElement('span', null, 'コンテナ')
                ),
                // スペーサー
                createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-utility-btn',
                        onClick: function () { insertUtilityBlock('wdl/lw-space-1'); },
                        title: 'スペースを挿入'
                    },
                    createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('line', { x1: 4, y1: 6, x2: 20, y2: 6, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }),
                        createElement('line', { x1: 4, y1: 18, x2: 20, y2: 18, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }),
                        createElement('line', { x1: 12, y1: 9, x2: 12, y2: 15, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }),
                        createElement('polyline', { points: '9,11 12,9 15,11', stroke: 'currentColor', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }),
                        createElement('polyline', { points: '9,13 12,15 15,13', stroke: 'currentColor', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
                    ),
                    createElement('span', null, 'スペース')
                ),
                // マイパーツ
                createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'lw-utility-btn',
                        onClick: function () { insertUtilityBlock('wdl/lw-my-parts-embed'); },
                        title: 'マイパーツを挿入'
                    },
                    createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
                        createElement('rect', { x: 4, y: 4, width: 16, height: 16, rx: 2, stroke: 'currentColor', strokeWidth: 2 }),
                        createElement('path', { d: 'M8 8h8M8 12h8M8 16h5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' })
                    ),
                    createElement('span', null, 'マイパーツ')
                )
            )
        );

        var modalContent;

        if (mainTab === 'blocks') {
            // ブロックタブのコンテンツ
            if (loading) {
                modalContent = createElement(
                    'div',
                    { className: 'lw-template-loading' },
                    createElement(Spinner, null),
                    createElement('p', null, '読み込み中...')
                );
            } else if (error) {
                modalContent = createElement(
                    'div',
                    { className: 'lw-template-error' },
                    createElement('p', null, error)
                );
            } else {
                modalContent = createElement(
                    'div',
                    { className: 'lw-template-layout' },
                    // 左側：カテゴリー一覧
                    createElement(
                        'div',
                        { className: 'lw-template-sidebar' },
                        createElement('h3', { className: 'lw-sidebar-title' }, 'カテゴリー'),
                        // 表示切り替えトグル
                        createElement(
                            'div',
                            { className: 'lw-availability-toggle' },
                            createElement(
                                'button',
                                {
                                    type: 'button',
                                    className: 'lw-availability-btn' + (!showOnlyAvailable ? ' is-active' : ''),
                                    onClick: function () { setShowOnlyAvailable(false); }
                                },
                                'すべて'
                            ),
                            createElement(
                                'button',
                                {
                                    type: 'button',
                                    className: 'lw-availability-btn' + (showOnlyAvailable ? ' is-active' : ''),
                                    onClick: function () { setShowOnlyAvailable(true); }
                                },
                                '利用可能のみ'
                            )
                        ),
                        createElement(
                            'div',
                            { className: 'lw-category-list' },
                            displayCategories.map(function (cat) {
                                var isSelected = selectedCategory === cat.name;
                                var displayCount = showOnlyAvailable ? getAvailableCount(cat) : cat.count;
                                return createElement(
                                    Button,
                                    {
                                        key: cat.name,
                                        variant: isSelected ? 'primary' : 'secondary',
                                        className: 'lw-category-btn' + (isSelected ? ' is-selected' : ''),
                                        onClick: function () {
                                            setSelectedCategory(cat.name);
                                            // スクロール位置をトップにリセット
                                            if (blockGridRef.current) {
                                                blockGridRef.current.scrollTop = 0;
                                            }
                                        }
                                    },
                                    createElement('span', { className: 'lw-category-name' }, getCategoryDisplayName(cat.name)),
                                    createElement('span', { className: 'lw-category-count' }, displayCount)
                                );
                            })
                        )
                    ),
                // 右側：ブロックプレビューグリッド
                createElement(
                    'div',
                    { className: 'lw-template-main' },
                    !selectedCategory
                        ? createElement(
                            'div',
                            { className: 'lw-template-placeholder' },
                            createElement('p', null, 'カテゴリーを選択してください')
                        )
                        : createElement(
                            Fragment,
                            null,
                            createElement(
                                'div',
                                { className: 'lw-template-header' },
                                createElement(
                                    'div',
                                    { className: 'lw-template-header-left' },
                                    createElement('h3', null, getCategoryDisplayName(selectedCategory)),
                                    createElement('span', { className: 'lw-block-count' }, filteredBlocks.length + ' ブロック')
                                ),
                                createElement(
                                    'div',
                                    { className: 'lw-template-header-right' },
                                    createElement(
                                        'div',
                                        { className: 'lw-preview-mode-toggle' },
                                        createElement(
                                            'button',
                                            {
                                                type: 'button',
                                                className: 'lw-preview-mode-btn' + (previewMode === PREVIEW_MODE_PC ? ' is-active' : ''),
                                                onClick: function () { setPreviewMode(PREVIEW_MODE_PC); },
                                                title: 'PCプレビュー'
                                            },
                                            createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
                                                createElement('rect', { x: 2, y: 4, width: 20, height: 13, rx: 2, stroke: 'currentColor', strokeWidth: 2 }),
                                                createElement('line', { x1: 8, y1: 20, x2: 16, y2: 20, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }),
                                                createElement('line', { x1: 12, y1: 17, x2: 12, y2: 20, stroke: 'currentColor', strokeWidth: 2 })
                                            ),
                                            createElement('span', null, 'PC')
                                        ),
                                        createElement(
                                            'button',
                                            {
                                                type: 'button',
                                                className: 'lw-preview-mode-btn' + (previewMode === PREVIEW_MODE_SP ? ' is-active' : ''),
                                                onClick: function () { setPreviewMode(PREVIEW_MODE_SP); },
                                                title: 'スマホプレビュー'
                                            },
                                            createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
                                                createElement('rect', { x: 6, y: 2, width: 12, height: 20, rx: 2, stroke: 'currentColor', strokeWidth: 2 }),
                                                createElement('line', { x1: 10, y1: 19, x2: 14, y2: 19, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' })
                                            ),
                                            createElement('span', null, 'SP')
                                        )
                                    )
                                )
                            ),
                            createElement(
                                'div',
                                {
                                    className: 'lw-block-grid' + (previewMode === PREVIEW_MODE_SP ? ' is-sp-mode' : ''),
                                    ref: blockGridRef
                                },
                                filteredBlocks.map(function (block) {
                                    return createElement(BlockPreviewCard, {
                                        key: block.name + '-' + previewMode,
                                        block: block,
                                        previewMode: previewMode,
                                        onInsert: function (b) {
                                            insertSingleBlock(b);
                                            onClose();
                                        },
                                        onPreview: function (b) {
                                            setFullPreviewBlock(b);
                                        }
                                    });
                                })
                            )
                        )
                )
                );
            }
        } else {
            // テンプレートタブのコンテンツ（ブロックタブと同じカードグリッド形式）
            if (sectionLoading) {
                modalContent = createElement(
                    'div',
                    { className: 'lw-template-loading' },
                    createElement(Spinner, null),
                    createElement('p', null, 'テンプレートを読み込み中...')
                );
            } else {
                modalContent = createElement(
                    'div',
                    { className: 'lw-section-template-grid-layout' },
                    // ヘッダー
                    createElement(
                        'div',
                        { className: 'lw-template-header' },
                        createElement(
                            'div',
                            { className: 'lw-template-header-left' },
                            createElement('h3', null, 'セクションテンプレート'),
                            createElement('span', { className: 'lw-block-count' }, sectionTemplates.length + ' テンプレート')
                        )
                    ),
                    // カードグリッド
                    createElement(
                        'div',
                        { className: 'lw-section-template-grid' },
                        sectionTemplates.length === 0
                            ? createElement(
                                'div',
                                { className: 'lw-template-placeholder' },
                                createElement('p', null, 'テンプレートがありません')
                            )
                            : sectionTemplates.map(function (template) {
                                return createElement(SectionTemplateCard, {
                                    key: template.filename,
                                    template: template,
                                    onInsert: function (t) {
                                        // テンプレートを挿入
                                        fetch(lwTemplatePutTest.restUrl + '/section-templates/' + t.filename, {
                                            headers: {
                                                'X-WP-Nonce': lwTemplatePutTest.nonce
                                            }
                                        })
                                        .then(function (res) { return res.json(); })
                                        .then(function (data) {
                                            var blocks = jsonToBlocks(data.data);
                                            if (blocks.length > 0) {
                                                var blockEditor = wp.data.select('core/block-editor');
                                                var insertBlocksAction = wp.data.dispatch('core/block-editor').insertBlocks;
                                                var allBlocks = blockEditor.getBlocks();
                                                insertBlocksAction(blocks, allBlocks.length);
                                                dispatch('core/notices').createSuccessNotice(
                                                    'テンプレート「' + t.name + '」を挿入しました',
                                                    { type: 'snackbar', isDismissible: true }
                                                );
                                                onClose();
                                            }
                                        })
                                        .catch(function (err) {
                                            // エラーは静かに処理
                                        });
                                    }
                                });
                            })
                    )
                );
            }
        }

        return createElement(
            Fragment,
            null,
            createElement(
                Modal,
                {
                    title: 'Lwブロックを挿入',
                    onRequestClose: onClose,
                    className: 'lw-template-modal',
                    isFullScreen: true
                },
                // タブボタンとコンテンツをラップ
                createElement(
                    'div',
                    { className: 'lw-modal-content-wrapper' },
                    mainTabButtons,
                    modalContent
                )
            ),
            // フルプレビューオーバーレイ
            fullPreviewBlock && createElement(FullPreviewOverlay, {
                block: fullPreviewBlock,
                blocks: filteredBlocks,
                previewMode: previewMode,
                onClose: function () {
                    setFullPreviewBlock(null);
                },
                onNavigate: function (b) {
                    setFullPreviewBlock(b);
                },
                onInsert: function (b) {
                    insertSingleBlock(b);
                    setFullPreviewBlock(null);
                    onClose();
                }
            })
        );
    }

    /**
     * ヘッダーボタンコンポーネント（createPortalを使用）
     */
    function HeaderButton(props) {
        var onClick = props.onClick;
        var _useState = useState(null);
        var container = _useState[0];
        var setContainer = _useState[1];

        useEffect(function () {
            var attempts = 0;
            var maxAttempts = 20;

            function findContainer() {
                attempts++;

                // 様々なセレクタを試す（WordPress バージョンによって異なる）
                var selectors = [
                    '.edit-post-header__settings',
                    '.editor-header__settings',
                    '.edit-post-header-toolbar__right',
                    '.interface-pinned-items',
                    '.edit-post-header .edit-post-header__toolbar',
                    '.editor-header'
                ];

                var target = null;
                for (var i = 0; i < selectors.length; i++) {
                    target = document.querySelector(selectors[i]);
                    if (target) {
                        break;
                    }
                }

                if (target) {
                    // コンテナ要素を作成してターゲットに挿入
                    var wrapper = document.createElement('div');
                    wrapper.id = 'lw-header-btn-portal';
                    wrapper.style.display = 'flex';
                    wrapper.style.alignItems = 'center';
                    target.insertBefore(wrapper, target.firstChild);
                    setContainer(wrapper);
                } else if (attempts < maxAttempts) {
                    setTimeout(findContainer, 500);
                }
            }

            setTimeout(findContainer, 500);

            return function () {
                var portal = document.getElementById('lw-header-btn-portal');
                if (portal) portal.remove();
            };
        }, []);

        if (!container) return null;

        return createPortal(
            createElement(
                'button',
                {
                    className: 'lw-header-insert-btn',
                    type: 'button',
                    title: 'Lwブロックを挿入',
                    onClick: onClick
                },
                createElement('svg', {
                    width: 20,
                    height: 20,
                    viewBox: '0 0 24 24',
                    fill: 'none'
                },
                    createElement('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3, stroke: 'currentColor', strokeWidth: 2 }),
                    createElement('path', { d: 'M8 8h3v8H8z', fill: 'currentColor' }),
                    createElement('path', { d: 'M13 8h3v8h-3z', fill: 'currentColor' })
                )
            ),
            container
        );
    }

    /**
     * メインプラグインコンポーネント
     */
    function TemplateInserterPlugin() {
        var _useState = useState(false);
        var isModalOpen = _useState[0];
        var setIsModalOpen = _useState[1];

        // 初期カテゴリー指定用state
        var _useStateInitialCategory = useState(null);
        var initialCategory = _useStateInitialCategory[0];
        var setInitialCategory = _useStateInitialCategory[1];

        // Listen for custom event from external button
        useEffect(function () {
            function handleOpenModal(e) {
                // イベントに初期カテゴリーが指定されている場合は設定
                if (e.detail && e.detail.category) {
                    setInitialCategory(e.detail.category);
                }
                setIsModalOpen(true);
            }
            document.addEventListener('lwOpenBlockInsertModal', handleOpenModal);
            return function () {
                document.removeEventListener('lwOpenBlockInsertModal', handleOpenModal);
            };
        }, []);

        return createElement(
            Fragment,
            null,
            // ヘッダーにボタンを追加（createPortalを使用）
            createElement(HeaderButton, {
                onClick: function () {
                    setIsModalOpen(true);
                }
            }),
            // メニュー内のボタン（バックアップとして残す）
            createElement(
                PluginMoreMenuItem,
                {
                    icon: 'layout',
                    onClick: function () {
                        setIsModalOpen(true);
                    }
                },
                'Lwブロックを挿入'
            ),
            createElement(TemplateModal, {
                isOpen: isModalOpen,
                onClose: function () {
                    setIsModalOpen(false);
                    setInitialCategory(null);
                },
                initialCategory: initialCategory
            })
        );
    }

    registerPlugin('lw-template-put-test', {
        icon: 'layout',
        render: TemplateInserterPlugin
    });

    /**
     * エディタ内のロック対象ブロックを監視して操作をロック
     */
    var lockedBlocks = window.wdlLockedBlocks || [];

    if (lockedBlocks.length > 0) {
        var subscribe = wp.data.subscribe;
        var select = wp.data.select;

        // ブロック選択時のロックチェック
        var lastSelectedBlockId = null;

        subscribe(function () {
            var selectedBlock = select('core/block-editor').getSelectedBlock();

            if (selectedBlock && selectedBlock.clientId !== lastSelectedBlockId) {
                lastSelectedBlockId = selectedBlock.clientId;

                // ロック対象ブロックかチェック
                if (lockedBlocks.indexOf(selectedBlock.name) !== -1) {
                    // 選択を解除
                    setTimeout(function () {
                        dispatch('core/block-editor').clearSelectedBlock();
                    }, 50);
                }
            }
        });

        // ロック用のスタイルをiframe内に注入
        var lockOverlayStyles = '.wdl-block-locked{position:relative!important;min-height:200px!important;overflow:hidden!important}.wdl-block-locked>*:not(.wdl-lock-overlay){pointer-events:none!important;user-select:none!important;opacity:.5}.wdl-lock-overlay{position:absolute;top:0;left:0;right:0;bottom:0;min-height:200px;background:rgba(248,249,250,.95);border:2px dashed #adb5bd;border-radius:8px;z-index:100;display:flex;align-items:center;justify-content:center;cursor:default;box-sizing:border-box;overflow:hidden}.wdl-lock-content{display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px;text-align:center;max-width:280px}.wdl-lock-icon{font-size:24px;line-height:1}.wdl-lock-message{font-size:13px;font-weight:600;color:#495057;margin-bottom:4px}.wdl-lock-buttons{display:flex;flex-direction:column;gap:6px;margin:4px 0}.wdl-lock-premium-btn{display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff!important;border:none;border-radius:5px;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none!important;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 6px rgba(102,126,234,.3);text-align:center}.wdl-lock-premium-btn:hover{background:linear-gradient(135deg,#5a6fd6 0%,#6a4190 100%);transform:translateY(-1px);box-shadow:0 4px 10px rgba(102,126,234,.4);color:#fff!important}.wdl-lock-purchase-btn{display:inline-block;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:#fff!important;border:none;border-radius:5px;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none!important;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 6px rgba(245,87,108,.3);text-align:center}.wdl-lock-purchase-btn:hover{background:linear-gradient(135deg,#e080e8 0%,#e04a5e 100%);transform:translateY(-1px);box-shadow:0 4px 10px rgba(245,87,108,.4);color:#fff!important}.wdl-lock-excluded-notice{display:block;font-size:12px;color:#868e96;font-style:italic}.wdl-lock-delete-btn{background:linear-gradient(135deg,#dc3545 0%,#c82333 100%);color:#fff;border:none;border-radius:5px;padding:6px 16px;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 6px rgba(220,53,69,.3);margin-top:4px}.wdl-lock-delete-btn:hover{background:linear-gradient(135deg,#c82333 0%,#bd2130 100%);transform:translateY(-1px);box-shadow:0 4px 12px rgba(220,53,69,.4)}.wdl-lock-delete-btn:active{transform:translateY(0)}.wdl-block-locked .block-editor-block-toolbar,.wdl-block-locked .block-editor-block-contextual-toolbar{display:none!important}.wdl-block-locked.is-selected,.wdl-block-locked.is-hovered{outline:none!important;box-shadow:none!important}';

        function injectLockStylesIfNeeded(doc) {
            if (!doc || doc.querySelector('#wdl-lock-overlay-styles')) return;
            var style = doc.createElement('style');
            style.id = 'wdl-lock-overlay-styles';
            style.textContent = lockOverlayStyles;
            (doc.head || doc.documentElement).appendChild(style);
        }

        // ロック対象ブロックにオーバーレイを追加する
        function addLockOverlayToBlocks() {
            // iframe内とメインドキュメント両方を検索対象にする
            var documentsToSearch = [document];
            var iframe = document.querySelector('iframe[name="editor-canvas"]');
            if (iframe && iframe.contentDocument) {
                documentsToSearch.push(iframe.contentDocument);
                // iframeにスタイルを注入
                injectLockStylesIfNeeded(iframe.contentDocument);
            }

            // デバッグ用
            var foundAnyBlock = false;

            documentsToSearch.forEach(function(doc) {
                lockedBlocks.forEach(function (blockName) {
                    // data-type属性でブロックを検索
                    var selector = '[data-type="' + blockName + '"]';
                    var blocks = doc.querySelectorAll(selector);

                    if (blocks.length > 0) {
                        foundAnyBlock = true;
                        console.log('[LW Lock Overlay] Found block:', blockName, 'count:', blocks.length);
                    }

                    blocks.forEach(function (block) {
                        if (!block.classList.contains('wdl-block-locked')) {
                            console.log('[LW Lock Overlay] Adding overlay to:', blockName);
                            block.classList.add('wdl-block-locked');

                            // clientIdを取得
                            var clientId = block.getAttribute('data-block');

                            // ブロックslugを取得 (wdl/xxx -> xxx)
                            var blockSlug = blockName.replace('wdl/', '');

                            // 購入URLを取得（個別購入用）
                            var shopUrl = blockShopUrls[blockSlug] || '';

                            // excludedBlocksに含まれているか（プレミアムプラン対象外か）
                            var isExcludedFromPremium = excludedBlocks.indexOf(blockSlug) !== -1;

                            // ボタンHTMLを生成
                            var buttonsHtml = '<div class="wdl-lock-buttons">';

                            // プレミアムプラン対象外でない場合のみプレミアムボタンを表示
                            if (!isExcludedFromPremium) {
                                buttonsHtml += '<a href="' + premiumInfoUrl + '" target="_blank" rel="noopener noreferrer" class="wdl-lock-premium-btn">プレミアムプランを契約する</a>';
                            }

                            // 個別購入URLがある場合のみ表示
                            if (shopUrl) {
                                buttonsHtml += '<a href="' + shopUrl + '" target="_blank" rel="noopener noreferrer" class="wdl-lock-purchase-btn">このブロックを単体購入する</a>';
                            }

                            // プレミアム対象外で購入URLもない場合のメッセージ
                            if (isExcludedFromPremium && !shopUrl) {
                                buttonsHtml += '<span class="wdl-lock-excluded-notice">このブロックは買い切り専用です</span>';
                            }

                            buttonsHtml += '</div>';

                            // オーバーレイ要素を作成（対象documentで作成）
                            var overlay = doc.createElement('div');
                            overlay.className = 'wdl-lock-overlay';
                            overlay.innerHTML = '<div class="wdl-lock-content">' +
                                '<span class="wdl-lock-icon">🔒</span>' +
                                '<span class="wdl-lock-message">未購入のため利用できません</span>' +
                                buttonsHtml +
                                '<button type="button" class="wdl-lock-delete-btn" data-client-id="' + clientId + '">削除</button>' +
                                '</div>';

                            block.appendChild(overlay);

                            // 削除ボタンのイベント
                            var deleteBtn = overlay.querySelector('.wdl-lock-delete-btn');
                            if (deleteBtn) {
                                deleteBtn.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var targetClientId = this.getAttribute('data-client-id');
                                    if (targetClientId) {
                                        dispatch('core/block-editor').removeBlock(targetClientId);
                                        dispatch('core/notices').createSuccessNotice(
                                            'ブロックを削除しました',
                                            { type: 'snackbar', isDismissible: true }
                                        );
                                    }
                                });
                            }
                        }
                    });
                });
            });
        }

        // DOM変更を監視（iframe対応）
        wp.domReady(function () {
            // 初回実行
            setTimeout(addLockOverlayToBlocks, 1000);

            // iframeのエディタコンテナを監視するためのセットアップ
            function setupObserverForContainer(container) {
                if (!container || container.dataset.lwLockObserving) return;
                container.dataset.lwLockObserving = '1';

                var observer = new MutationObserver(function (mutations) {
                    addLockOverlayToBlocks();
                });

                observer.observe(container, {
                    childList: true,
                    subtree: true
                });
            }

            // メインドキュメントとiframe両方を監視
            function setupAllObservers() {
                // メインドキュメント
                var mainContainer = document.querySelector('.editor-styles-wrapper');
                if (mainContainer) {
                    setupObserverForContainer(mainContainer);
                }

                // iframe内
                var iframe = document.querySelector('iframe[name="editor-canvas"]');
                if (iframe && iframe.contentDocument) {
                    var iframeContainer = iframe.contentDocument.querySelector('.editor-styles-wrapper');
                    if (iframeContainer) {
                        setupObserverForContainer(iframeContainer);
                    }
                }
            }

            // 定期的にiframeの読み込みを確認してオブザーバをセットアップ
            var checkInterval = setInterval(function() {
                setupAllObservers();
            }, 1000);

            // 初回セットアップ
            setupAllObservers();

            // フォールバック：定期的にチェック
            setInterval(addLockOverlayToBlocks, 2000);
        });
    }


})(window.wp);
