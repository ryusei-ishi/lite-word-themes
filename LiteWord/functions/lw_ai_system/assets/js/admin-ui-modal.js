/**
 * LiteWord AI Page Generator - Modal Component
 *
 * 動的読み込み：AIボタンクリック時に読み込まれる
 * - モード選択画面
 * - ページ生成機能
 * - 誤字脱字チェック機能
 */

(function() {
    'use strict';

    var createElement = wp.element.createElement;
    var useState = wp.element.useState;
    var useEffect = wp.element.useEffect;
    var Fragment = wp.element.Fragment;
    var Modal = wp.components.Modal;

    /**
     * AIアイコンSVG
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
                    id: 'ai-gradient-modal',
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
                fill: 'url(#ai-gradient-modal)'
            }),
            createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '3', fill: 'white' }),
            createElement('path', {
                key: 'p2',
                d: 'M12 10V14M10 12H14',
                stroke: 'url(#ai-gradient-modal)',
                strokeWidth: '1.5',
                strokeLinecap: 'round'
            })
        ]);
    }

    /**
     * スパークルアイコン
     */
    function SparkleIcon(props) {
        return createElement('svg', {
            width: props.size || 20,
            height: props.size || 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            className: props.className || ''
        }, [
            createElement('path', { key: 'p1', d: 'M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z', fill: 'currentColor' }),
            createElement('path', { key: 'p2', d: 'M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18L19 15Z', fill: 'currentColor', opacity: '0.6' }),
            createElement('path', { key: 'p3', d: 'M5 2L6 5L9 6L6 7L5 10L4 7L1 6L4 5L5 2Z', fill: 'currentColor', opacity: '0.4' })
        ]);
    }

    /**
     * 虫眼鏡アイコン
     */
    function SearchIcon(props) {
        return createElement('svg', {
            width: props.size || 24,
            height: props.size || 24,
            viewBox: '0 0 24 24',
            fill: 'none'
        }, [
            createElement('circle', { key: 'c1', cx: '11', cy: '11', r: '7', stroke: 'currentColor', strokeWidth: '2' }),
            createElement('path', { key: 'p1', d: 'M16 16L20 20', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' })
        ]);
    }

    /**
     * ドキュメントアイコン
     */
    function DocumentIcon(props) {
        return createElement('svg', {
            width: props.size || 24,
            height: props.size || 24,
            viewBox: '0 0 24 24',
            fill: 'none'
        }, [
            createElement('path', { key: 'p1', d: 'M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }),
            createElement('path', { key: 'p2', d: 'M14 2V8H20', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }),
            createElement('path', { key: 'p3', d: 'M12 18V12', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }),
            createElement('path', { key: 'p4', d: 'M9 15L12 12L15 15', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' })
        ]);
    }

    /**
     * テキストがチェック対象かどうかを判定
     */
    function isValidTextForCheck(text) {
        if (!text || typeof text !== 'string') return false;
        var trimmed = text.trim();
        if (trimmed.length < 2) return false;

        var excludePatterns = [
            /^var\(--/,
            /^#[0-9a-fA-F]{3,8}$/,
            /^rgb[a]?\(/,
            /^https?:\/\//,
            /^lw_/,
            /^[0-9]+px$/,
            /^[0-9]+%$/,
            /^[0-9]+em$/,
            /^[a-z_-]+_[a-z_-]+_[0-9]+$/i,
            /^(true|false)$/
        ];

        for (var i = 0; i < excludePatterns.length; i++) {
            if (excludePatterns[i].test(trimmed)) return false;
        }
        return true;
    }

    /**
     * ブロックエディタから全テキストを抽出
     */
    function extractTextFromBlocks(blocks, result, depth) {
        if (!result) result = [];
        if (!depth) depth = 0;
        if (!blocks || !Array.isArray(blocks)) return result;

        blocks.forEach(function(block) {
            var clientId = block.clientId;
            var blockName = block.name;
            var attributes = block.attributes || {};

            var textAttributes = ['content', 'text', 'title', 'subtitle', 'description', 'caption', 'citation', 'value', 'heading', 'paragraph', 'label', 'buttonText', 'linkText', 'message', 'quote'];

            textAttributes.forEach(function(attr) {
                if (attributes.hasOwnProperty(attr)) {
                    var rawValue = attributes[attr];
                    var textValue = '';

                    if (typeof rawValue === 'string') {
                        textValue = rawValue;
                    } else if (rawValue && typeof rawValue === 'object') {
                        if (rawValue.originalHTML) {
                            textValue = rawValue.originalHTML;
                        } else if (rawValue.text) {
                            textValue = rawValue.text;
                        }
                        if (!textValue && wp.richText && wp.richText.toHTMLString) {
                            try { textValue = wp.richText.toHTMLString({ value: rawValue }); } catch (e) {}
                        }
                        if (!textValue && typeof rawValue.toString === 'function') {
                            var str = rawValue.toString();
                            if (str && str !== '[object Object]') textValue = str;
                        }
                    }

                    if (textValue) {
                        var text = textValue.replace(/<[^>]*>/g, '');
                        if (isValidTextForCheck(text)) {
                            result.push({
                                clientId: clientId,
                                blockName: blockName,
                                attribute: attr,
                                text: text.trim(),
                                originalHtml: textValue
                            });
                        }
                    }
                }
            });

            if (attributes.items && Array.isArray(attributes.items)) {
                attributes.items.forEach(function(item, index) {
                    if (item && typeof item === 'object') {
                        Object.keys(item).forEach(function(key) {
                            var itemValue = item[key];
                            if (typeof itemValue === 'string') {
                                var text = itemValue.replace(/<[^>]*>/g, '');
                                if (isValidTextForCheck(text)) {
                                    result.push({
                                        clientId: clientId,
                                        blockName: blockName,
                                        attribute: 'items[' + index + '].' + key,
                                        text: text.trim(),
                                        originalHtml: itemValue
                                    });
                                }
                            }
                        });
                    }
                });
            }

            if (block.innerBlocks && block.innerBlocks.length > 0) {
                extractTextFromBlocks(block.innerBlocks, result, depth + 1);
            }
        });

        return result;
    }

    /**
     * 要素内の特定テキストをハイライト
     */
    function highlightTextInElement(element, searchText) {
        clearTextHighlights();

        var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        var nodesToHighlight = [];
        var node;

        while (node = walker.nextNode()) {
            var text = node.textContent;
            var index = text.indexOf(searchText);
            if (index !== -1) {
                nodesToHighlight.push({ node: node, index: index, length: searchText.length });
            }
        }

        nodesToHighlight.forEach(function(item) {
            try {
                var range = document.createRange();
                range.setStart(item.node, item.index);
                range.setEnd(item.node, item.index + item.length);
                var highlight = document.createElement('mark');
                highlight.className = 'lw-ai-typo-text-highlight';
                range.surroundContents(highlight);
            } catch (e) {}
        });

        setTimeout(clearTextHighlights, 4000);
    }

    /**
     * テキストハイライトをクリア
     */
    function clearTextHighlights() {
        var highlights = document.querySelectorAll('.lw-ai-typo-text-highlight');
        highlights.forEach(function(el) {
            var parent = el.parentNode;
            if (parent) {
                var textNode = document.createTextNode(el.textContent);
                parent.replaceChild(textNode, el);
                parent.normalize();
            }
        });
    }

    /**
     * AI生成ポップアップコンポーネント
     */
    function AiGeneratorModal(props) {
        var isOpen = props.isOpen;
        var onClose = props.onClose;

        var _currentMode = useState('select');
        var currentMode = _currentMode[0];
        var setCurrentMode = _currentMode[1];

        var _aiPrompt = useState('');
        var aiPrompt = _aiPrompt[0];
        var setAiPrompt = _aiPrompt[1];

        var _imageSource = useState('pixabay');
        var imageSource = _imageSource[0];
        var setImageSource = _imageSource[1];

        var _isGenerating = useState(false);
        var isGenerating = _isGenerating[0];
        var setIsGenerating = _isGenerating[1];

        var _error = useState(null);
        var error = _error[0];
        var setError = _error[1];

        var _generatedJson = useState('');
        var generatedJson = _generatedJson[0];
        var setGeneratedJson = _generatedJson[1];

        var _showAdvanced = useState(false);
        var showAdvanced = _showAdvanced[0];
        var setShowAdvanced = _showAdvanced[1];

        var _isChecking = useState(false);
        var isChecking = _isChecking[0];
        var setIsChecking = _isChecking[1];

        var _typoResults = useState(null);
        var typoResults = _typoResults[0];
        var setTypoResults = _typoResults[1];

        var _minimized = useState(false);
        var minimized = _minimized[0];
        var setMinimized = _minimized[1];

        var _panelPosition = useState({ x: 20, y: null });
        var panelPosition = _panelPosition[0];
        var setPanelPosition = _panelPosition[1];

        var _isDragging = useState(false);
        var isDragging = _isDragging[0];
        var setIsDragging = _isDragging[1];

        var _dragOffset = useState({ x: 0, y: 0 });
        var dragOffset = _dragOffset[0];
        var setDragOffset = _dragOffset[1];

        useEffect(function() {
            if (!isOpen) {
                setError(null);
                setGeneratedJson('');
                setCurrentMode('select');
                setTypoResults(null);
                setMinimized(false);
            }
        }, [isOpen]);

        function handleGenerate() {
            if (!aiPrompt.trim()) {
                setError('リクエスト内容を入力してください');
                return;
            }
            if (!lwAiGeneratorData.hasApiKey) {
                setError('Gemini APIキーが設定されていません');
                return;
            }

            setIsGenerating(true);
            setError(null);
            setGeneratedJson('');

            fetch(lwAiGeneratorData.restUrl + 'generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({ prompt: aiPrompt, imageSource: imageSource })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.layout) {
                    setGeneratedJson(JSON.stringify(data.layout, null, 2));
                    try {
                        var result = window.lwAiGenerator.insertBlocksFromJson(data.layout);
                        if (result.success) { onClose(); }
                        else { setError(result.message); }
                    } catch (err) {
                        setError('ブロックの挿入に失敗しました: ' + err.message);
                    }
                } else {
                    setError(data.message || 'AIの生成に失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); })
            .finally(function() { setIsGenerating(false); });
        }

        function handleReapply() {
            if (!generatedJson.trim()) return;
            try {
                var jsonData = JSON.parse(generatedJson);
                var result = window.lwAiGenerator.insertBlocksFromJson(jsonData);
                if (result.success) { onClose(); }
                else { setError(result.message); }
            } catch (err) {
                setError('JSONの適用に失敗しました: ' + err.message);
            }
        }

        function handleTypoCheck() {
            if (!lwAiGeneratorData.hasApiKey) {
                setError('Gemini APIキーが設定されていません');
                return;
            }

            setIsChecking(true);
            setError(null);
            setTypoResults(null);

            var blocks = wp.data.select('core/block-editor').getBlocks();
            if (!blocks || blocks.length === 0) {
                setError('エディタにブロックがありません');
                setIsChecking(false);
                return;
            }

            var textData = extractTextFromBlocks(blocks);
            if (textData.length === 0) {
                setError('チェックするテキストが見つかりませんでした');
                setIsChecking(false);
                return;
            }

            fetch(lwAiGeneratorData.restUrl + 'check-typo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({ blocks: textData })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    setTypoResults(data.errors || []);
                    if (data.errors && data.errors.length === 0) {
                        window.lwAiGenerator.showNotice('success', '誤字脱字は見つかりませんでした');
                    }
                } else {
                    setError(data.message || '誤字脱字チェックに失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); })
            .finally(function() { setIsChecking(false); });
        }

        function handleSelectBlock(clientId, originalText) {
            setMinimized(true);
            wp.data.dispatch('core/block-editor').selectBlock(clientId);

            setTimeout(function() {
                var blockElement = document.querySelector('[data-block="' + clientId + '"]');
                if (blockElement) {
                    blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (originalText) {
                        highlightTextInElement(blockElement, originalText);
                    } else {
                        blockElement.classList.add('lw-ai-typo-highlight');
                        setTimeout(function() { blockElement.classList.remove('lw-ai-typo-highlight'); }, 3000);
                    }
                }
            }, 100);
        }

        function handleDismissTypo(index, e) {
            if (e) e.stopPropagation();
            setTypoResults(function(prev) {
                if (!prev) return prev;
                var newResults = prev.slice();
                newResults.splice(index, 1);
                return newResults;
            });
        }

        function handleRestoreModal() { setMinimized(false); }

        function handleDragStart(e) {
            if (e.target.closest('.lw-ai-typo-floating-item') || e.target.closest('.lw-ai-typo-floating-more')) return;
            e.preventDefault();
            var panel = e.currentTarget.closest('.lw-ai-typo-floating-panel');
            if (!panel) return;
            var rect = panel.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setIsDragging(true);
        }

        useEffect(function() {
            if (!isDragging) return;
            function handleMouseMove(e) {
                setPanelPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
            }
            function handleMouseUp() { setIsDragging(false); }
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return function() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }, [isDragging, dragOffset]);

        function handleKeyDown(e) {
            if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                e.preventDefault();
                handleGenerate();
            }
        }

        if (!isOpen) return null;

        var imageSourceOptions = [
            { value: 'pixabay', label: 'Pixabay（無料・APIキー不要）' },
            { value: 'none', label: '画像なし' }
        ];

        var modalContent = [];

        // ===== モード選択画面 =====
        if (currentMode === 'select') {
            if (!lwAiGeneratorData.hasApiKey) {
                modalContent.push(
                    createElement('div', { key: 'api-warning', className: 'lw-ai-modal-warning' }, [
                        'APIキーが未設定です。',
                        createElement('a', { key: 'link', href: lwAiGeneratorData.settingsUrl, target: '_blank' }, '設定画面へ')
                    ])
                );
            }

            modalContent.push(
                createElement('div', { key: 'mode-select', className: 'lw-ai-mode-select' }, [
                    createElement('p', { key: 'label', className: 'lw-ai-mode-select-label' }, '何をしますか？'),
                    createElement('div', { key: 'buttons', className: 'lw-ai-mode-buttons' }, [
                        createElement('button', {
                            key: 'generate-btn',
                            className: 'lw-ai-mode-btn lw-ai-mode-btn-generate lw-ai-mode-btn-coming-soon',
                            onClick: function() { /* 近日公開予定 */ },
                            disabled: true
                        }, [
                            createElement(DocumentIcon, { key: 'icon', size: 32 }),
                            createElement('span', { key: 'title', className: 'lw-ai-mode-btn-title' }, 'ページを自動生成'),
                            createElement('span', { key: 'badge', className: 'lw-ai-coming-soon-badge' }, '近日公開予定'),
                            createElement('span', { key: 'desc', className: 'lw-ai-mode-btn-desc' }, 'AIがページレイアウトを作成します')
                        ]),
                        createElement('button', {
                            key: 'typo-btn',
                            className: 'lw-ai-mode-btn lw-ai-mode-btn-typo',
                            onClick: function() { setCurrentMode('typo-check'); },
                            disabled: !lwAiGeneratorData.hasApiKey
                        }, [
                            createElement(SearchIcon, { key: 'icon', size: 32 }),
                            createElement('span', { key: 'title', className: 'lw-ai-mode-btn-title' }, '誤字脱字をチェック'),
                            createElement('span', { key: 'desc', className: 'lw-ai-mode-btn-desc' }, 'ページ内の誤りを検出します')
                        ])
                    ])
                ])
            );

            return createElement(Modal, {
                title: createElement('div', { className: 'lw-ai-modal-title' }, [
                    createElement(AiIcon, { key: 'icon', size: 24 }),
                    createElement('span', { key: 'text' }, 'AIアシスタント')
                ]),
                onRequestClose: onClose,
                className: 'lw-ai-generator-modal',
                overlayClassName: 'lw-ai-generator-modal-overlay'
            }, createElement('div', { className: 'lw-ai-modal-content' }, modalContent));
        }

        // ===== 誤字脱字チェック画面 =====
        if (currentMode === 'typo-check') {
            if (minimized && typoResults && typoResults.length > 0) {
                var panelStyle = {
                    position: 'fixed',
                    zIndex: 100000,
                    cursor: isDragging ? 'grabbing' : 'grab'
                };
                if (panelPosition.y === null) {
                    panelStyle.left = panelPosition.x + 'px';
                    panelStyle.bottom = '20px';
                } else {
                    panelStyle.left = panelPosition.x + 'px';
                    panelStyle.top = panelPosition.y + 'px';
                }

                return createElement('div', {
                    className: 'lw-ai-typo-floating-panel' + (isDragging ? ' is-dragging' : ''),
                    style: panelStyle,
                    onMouseDown: handleDragStart
                }, [
                    createElement('div', { key: 'header', className: 'lw-ai-typo-floating-header' }, [
                        createElement('span', { key: 'icon', className: 'lw-ai-typo-drag-handle' }, '⠿'),
                        createElement('span', { key: 'count' }, typoResults.length + '件の問題'),
                        createElement('button', { key: 'expand', className: 'lw-ai-typo-expand-btn', onClick: function(e) { e.stopPropagation(); handleRestoreModal(); } }, '展開'),
                        createElement('button', { key: 'close', className: 'lw-ai-typo-close-btn', onClick: function(e) { e.stopPropagation(); onClose(); } }, '×')
                    ]),
                    createElement('div', { key: 'list', className: 'lw-ai-typo-floating-list' },
                        typoResults.slice(0, 5).map(function(result, index) {
                            return createElement('div', {
                                key: 'item-' + index,
                                className: 'lw-ai-typo-floating-item',
                                onClick: function(e) { e.stopPropagation(); handleSelectBlock(result.clientId, result.original); }
                            }, [
                                createElement('span', { key: 'orig', className: 'lw-ai-typo-floating-orig' }, result.original),
                                createElement('span', { key: 'arrow' }, ' → '),
                                createElement('span', { key: 'corr', className: 'lw-ai-typo-floating-corr' }, result.correction),
                                createElement('button', { key: 'dismiss', className: 'lw-ai-typo-dismiss-btn', onClick: function(e) { handleDismissTypo(index, e); }, title: '修正済みとしてマーク' }, '×')
                            ]);
                        })
                    ),
                    typoResults.length > 5 && createElement('div', { key: 'more', className: 'lw-ai-typo-floating-more', onClick: function(e) { e.stopPropagation(); handleRestoreModal(); } }, '他 ' + (typoResults.length - 5) + ' 件...')
                ]);
            }

            modalContent.push(
                createElement('button', { key: 'back-btn', className: 'lw-ai-back-btn', onClick: function() { setCurrentMode('select'); setTypoResults(null); setError(null); } }, '← 戻る')
            );

            if (error) {
                modalContent.push(
                    createElement('div', { key: 'error', className: 'lw-ai-modal-error' }, [
                        createElement('span', { key: 'icon', className: 'lw-ai-modal-error-icon' }, '!'),
                        createElement('span', { key: 'msg' }, error)
                    ])
                );
            }

            if (!typoResults && !isChecking) {
                modalContent.push(
                    createElement('div', { key: 'check-section', className: 'lw-ai-typo-check-section' }, [
                        createElement('p', { key: 'desc', className: 'lw-ai-typo-desc' }, 'ページ内の全テキストをAIがチェックし、誤字脱字や文法の誤りを検出します。'),
                        createElement('button', { key: 'check-btn', className: 'lw-ai-modal-btn lw-ai-modal-btn-primary', onClick: handleTypoCheck }, [
                            createElement(SearchIcon, { key: 'icon', size: 18 }),
                            createElement('span', { key: 'text' }, 'チェックを開始')
                        ])
                    ])
                );
            }

            if (isChecking) {
                modalContent.push(
                    createElement('div', { key: 'checking', className: 'lw-ai-typo-checking' }, [
                        createElement(SparkleIcon, { key: 'icon', size: 24, className: 'lw-ai-sparkle-spin' }),
                        createElement('span', { key: 'text' }, 'AIがチェック中...')
                    ])
                );
            }

            if (typoResults) {
                if (typoResults.length === 0) {
                    modalContent.push(
                        createElement('div', { key: 'no-errors', className: 'lw-ai-typo-no-errors' }, [
                            createElement('span', { key: 'icon', className: 'lw-ai-typo-success-icon' }, '✓'),
                            createElement('span', { key: 'text' }, '誤字脱字は見つかりませんでした')
                        ])
                    );
                } else {
                    modalContent.push(
                        createElement('div', { key: 'results-header', className: 'lw-ai-typo-results-header' }, typoResults.length + '件の問題が見つかりました')
                    );
                    modalContent.push(
                        createElement('div', { key: 'results-list', className: 'lw-ai-typo-results-list' },
                            typoResults.map(function(result, index) {
                                return createElement('div', { key: 'result-' + index, className: 'lw-ai-typo-result-item' }, [
                                    createElement('button', { key: 'dismiss', className: 'lw-ai-typo-item-dismiss', onClick: function(e) { handleDismissTypo(index, e); }, title: '修正済みとしてマーク' }, '×'),
                                    createElement('div', { key: 'content', className: 'lw-ai-typo-item-content', onClick: function() { handleSelectBlock(result.clientId, result.original); } }, [
                                        createElement('div', { key: 'original', className: 'lw-ai-typo-original' }, [
                                            createElement('span', { key: 'label', className: 'lw-ai-typo-label' }, '誤り：'),
                                            createElement('span', { key: 'text', className: 'lw-ai-typo-error-text' }, result.original)
                                        ]),
                                        createElement('div', { key: 'correction', className: 'lw-ai-typo-correction' }, [
                                            createElement('span', { key: 'label', className: 'lw-ai-typo-label' }, '修正案：'),
                                            createElement('span', { key: 'text', className: 'lw-ai-typo-correct-text' }, result.correction)
                                        ]),
                                        result.reason && createElement('div', { key: 'reason', className: 'lw-ai-typo-reason' }, result.reason),
                                        createElement('div', { key: 'hint', className: 'lw-ai-typo-hint' }, 'クリックで該当箇所へ移動')
                                    ])
                                ]);
                            })
                        )
                    );
                }

                modalContent.push(
                    createElement('div', { key: 'recheck-section', className: 'lw-ai-typo-recheck' }, [
                        createElement('button', { key: 'recheck-btn', className: 'lw-ai-modal-btn lw-ai-modal-btn-secondary', onClick: handleTypoCheck, disabled: isChecking }, '再チェック')
                    ])
                );
            }

            return createElement(Modal, {
                title: createElement('div', { className: 'lw-ai-modal-title' }, [
                    createElement(SearchIcon, { key: 'icon', size: 24 }),
                    createElement('span', { key: 'text' }, '誤字脱字チェック')
                ]),
                onRequestClose: onClose,
                className: 'lw-ai-generator-modal lw-ai-typo-modal',
                overlayClassName: 'lw-ai-generator-modal-overlay'
            }, createElement('div', { className: 'lw-ai-modal-content' }, modalContent));
        }

        // ===== ページ生成画面 =====
        modalContent.push(
            createElement('button', { key: 'back-btn', className: 'lw-ai-back-btn', onClick: function() { setCurrentMode('select'); setError(null); setGeneratedJson(''); } }, '← 戻る')
        );

        if (error) {
            modalContent.push(
                createElement('div', { key: 'error', className: 'lw-ai-modal-error' }, [
                    createElement('span', { key: 'icon', className: 'lw-ai-modal-error-icon' }, '!'),
                    createElement('span', { key: 'msg' }, error)
                ])
            );
        }

        if (!lwAiGeneratorData.hasApiKey) {
            modalContent.push(
                createElement('div', { key: 'api-warning', className: 'lw-ai-modal-warning' }, [
                    'APIキーが未設定です。',
                    createElement('a', { key: 'link', href: lwAiGeneratorData.settingsUrl, target: '_blank' }, '設定画面へ')
                ])
            );
        }

        modalContent.push(
            createElement('div', { key: 'prompt-section', className: 'lw-ai-modal-section' }, [
                createElement('label', { key: 'label', className: 'lw-ai-modal-label' }, 'どんなページを作りたいですか？'),
                createElement('textarea', {
                    key: 'textarea',
                    className: 'lw-ai-modal-textarea',
                    value: aiPrompt,
                    onChange: function(e) { setAiPrompt(e.target.value); },
                    onKeyDown: handleKeyDown,
                    placeholder: '例: 整体院のLPを作って、腰痛に悩む人向けで、予約ボタンは目立つ赤色にしてください',
                    rows: 4,
                    disabled: isGenerating,
                    autoFocus: true
                }),
                createElement('p', { key: 'hint', className: 'lw-ai-modal-hint' }, 'Enterキーで生成、Shift+Enterで改行')
            ])
        );

        modalContent.push(
            createElement('div', { key: 'image-section', className: 'lw-ai-modal-section lw-ai-modal-section-inline' }, [
                createElement('label', { key: 'label', className: 'lw-ai-modal-label-inline' }, '背景画像:'),
                createElement('select', {
                    key: 'select',
                    className: 'lw-ai-modal-select',
                    value: imageSource,
                    onChange: function(e) { setImageSource(e.target.value); },
                    disabled: isGenerating
                }, imageSourceOptions.map(function(opt) {
                    return createElement('option', { key: opt.value, value: opt.value }, opt.label);
                }))
            ])
        );

        modalContent.push(
            createElement('div', { key: 'actions', className: 'lw-ai-modal-actions' }, [
                createElement('button', {
                    key: 'generate-btn',
                    className: 'lw-ai-modal-btn lw-ai-modal-btn-primary' + (isGenerating ? ' is-generating' : ''),
                    onClick: handleGenerate,
                    disabled: isGenerating || !aiPrompt.trim() || !lwAiGeneratorData.hasApiKey
                }, isGenerating ? [
                    createElement(SparkleIcon, { key: 'icon', size: 18, className: 'lw-ai-sparkle-spin' }),
                    createElement('span', { key: 'text' }, 'AIが生成中...')
                ] : [
                    createElement(SparkleIcon, { key: 'icon', size: 18 }),
                    createElement('span', { key: 'text' }, 'ページを生成')
                ])
            ])
        );

        if (generatedJson) {
            modalContent.push(
                createElement('div', { key: 'advanced-section', className: 'lw-ai-modal-advanced' }, [
                    createElement('button', { key: 'toggle', className: 'lw-ai-modal-advanced-toggle', onClick: function() { setShowAdvanced(!showAdvanced); } },
                        showAdvanced ? '▼ JSONを非表示' : '▶ 生成されたJSONを編集'
                    ),
                    showAdvanced && createElement('div', { key: 'content', className: 'lw-ai-modal-advanced-content' }, [
                        createElement('textarea', { key: 'json-textarea', className: 'lw-ai-modal-textarea lw-ai-modal-textarea-json', value: generatedJson, onChange: function(e) { setGeneratedJson(e.target.value); }, rows: 10 }),
                        createElement('button', { key: 'reapply-btn', className: 'lw-ai-modal-btn lw-ai-modal-btn-secondary', onClick: handleReapply }, '編集内容を適用')
                    ])
                ])
            );
        }

        return createElement(Modal, {
            title: createElement('div', { className: 'lw-ai-modal-title' }, [
                createElement(AiIcon, { key: 'icon', size: 24 }),
                createElement('span', { key: 'text' }, 'AIでページを生成')
            ]),
            onRequestClose: onClose,
            className: 'lw-ai-generator-modal',
            overlayClassName: 'lw-ai-generator-modal-overlay'
        }, createElement('div', { className: 'lw-ai-modal-content' }, modalContent));
    }

    // グローバルに公開（動的読み込み用）
    window.LwAiGeneratorModal = AiGeneratorModal;

})();
