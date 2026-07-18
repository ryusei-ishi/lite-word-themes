/**
 * テキスト選択時のAI指示機能
 *
 * ブロックツールバーにAIボタンを追加
 * 指示に基づいてspanタグ+クラス/スタイルを適用、またはテキスト変更
 */

(function() {
    'use strict';

    const { createElement, useState, useEffect, useRef, createPortal } = wp.element;
    const { Button, Spinner, Modal, ToolbarButton, ToolbarGroup } = wp.components;
    const { select, dispatch } = wp.data;
    const { BlockControls } = wp.blockEditor;
    const { createHigherOrderComponent } = wp.compose;
    const { addFilter } = wp.hooks;

    // デバッグモード（本番環境ではfalse）
    const LW_AI_TEXT_DEBUG = false;
    const log = LW_AI_TEXT_DEBUG ? console.log.bind(console) : function() {};

    // グローバル状態
    let currentSelectionData = null;

    /**
     * ブロックにAIツールバーボタンを追加
     */
    const withAIToolbarButton = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            // AI機能の有効/無効状態を監視
            const [aiEnabled, setAiEnabled] = useState(window.lwAiFeaturesEnabled || false);

            // ※ Reactのルール: すべてのHooksは条件分岐やreturnの前に宣言する必要がある
            const [showModal, setShowModal] = useState(false);
            const [instruction, setInstruction] = useState('');
            const [isLoading, setIsLoading] = useState(false);
            const [selectedText, setSelectedText] = useState('');
            const [selectedStyles, setSelectedStyles] = useState([]); // 複数スタイル選択用
            const [activeSection, setActiveSection] = useState(null); // 'generate' or 'decorate' or null
            const [generatePrompt, setGeneratePrompt] = useState('');
            const [useWebSearch, setUseWebSearch] = useState(false);
            const [generatedText, setGeneratedText] = useState(''); // 生成されたテキスト（確認用）
            const [showConfirmation, setShowConfirmation] = useState(false); // 確認ダイアログ表示
            const [selectedTone, setSelectedTone] = useState(''); // 口調選択（空=指定なし）
            const [textSource, setTextSource] = useState('selection'); // 'selection', 'block', 'new'
            const [floatingButtonPos, setFloatingButtonPos] = useState(null); // フローティングボタン位置
            const [searchSources, setSearchSources] = useState([]); // Web検索ソース
            const [refinementPrompt, setRefinementPrompt] = useState(''); // 確認時の追加指示
            const [customPrompts, setCustomPrompts] = useState([]); // カスタムプロンプト一覧
            const [showAddPrompt, setShowAddPrompt] = useState(false); // プロンプト追加フォーム表示
            const [newPromptName, setNewPromptName] = useState(''); // 新規プロンプト名
            const [newPromptText, setNewPromptText] = useState(''); // 新規プロンプト内容
            const [newPromptEmoji, setNewPromptEmoji] = useState('📝'); // 新規プロンプト絵文字
            const [editingPromptId, setEditingPromptId] = useState(null); // 編集中のプロンプトID
            const inputRef = useRef(null);
            const floatingButtonRef = useRef(null);

            // AI機能のON/OFFイベントを監視
            useEffect(() => {
                const handleToggle = (e) => {
                    setAiEnabled(e.detail.enabled);
                };
                window.addEventListener('lwAiFeaturesToggle', handleToggle);
                // 初期状態を同期
                setAiEnabled(window.lwAiFeaturesEnabled || false);
                return () => {
                    window.removeEventListener('lwAiFeaturesToggle', handleToggle);
                };
            }, []);

            // カスタムプロンプト読み込み（AI有効時のみ実行）
            useEffect(() => {
                if (!aiEnabled) return;
                const loadCustomPrompts = async () => {
                    try {
                        const response = await fetch(lwAiTextSelectionData.restUrl + 'custom-prompts', {
                            headers: {
                                'X-WP-Nonce': lwAiTextSelectionData.restNonce
                            }
                        });
                        if (!response.ok) {
                            // 404等のエラーの場合は空配列で続行
                            console.warn('[LW AI Text] Custom prompts API returned:', response.status);
                            return;
                        }
                        const data = await response.json();
                        if (data.success) {
                            setCustomPrompts(data.prompts || []);
                        }
                    } catch (err) {
                        // エラーは警告として処理、機能は継続
                        console.warn('[LW AI Text] Could not load custom prompts:', err.message);
                    }
                };
                loadCustomPrompts();
            }, [aiEnabled]);

            // モーダル表示時にフォーカス
            useEffect(() => {
                if (aiEnabled && showModal && inputRef.current) {
                    setTimeout(() => inputRef.current.focus(), 100);
                }
            }, [showModal, aiEnabled]);

            // フローティングボタンを表示するブロックタイプ
            const floatingButtonBlockTypes = ['core/paragraph', 'core/heading'];

            // フローティングボタンを表示するかどうかを判定
            const shouldShowFloatingButton = (blockName) => {
                // core/paragraph, core/heading は表示
                if (floatingButtonBlockTypes.includes(blockName)) {
                    return true;
                }
                // wdl/custom-title-* (見出しブロック) は表示
                if (blockName && blockName.startsWith('wdl/custom-title-')) {
                    return true;
                }
                // wdl/lw-pr-custom-title-* (プレミアム見出しブロック) は表示
                if (blockName && blockName.startsWith('wdl/lw-pr-custom-title-')) {
                    return true;
                }
                // wdl/paid-block-custom-title-* (有料見出しブロック) は表示
                if (blockName && blockName.startsWith('wdl/paid-block-custom-title-')) {
                    return true;
                }
                return false;
            };

            // iframe内のドキュメントを取得するヘルパー
            const getEditorDocument = () => {
                const iframe = document.querySelector('iframe[name="editor-canvas"]');
                if (iframe && iframe.contentDocument) {
                    return iframe.contentDocument;
                }
                return document;
            };

            // フローティングボタンの位置を更新（fixed position用）
            useEffect(() => {
                // AI無効時または対象ブロック以外は表示しない
                if (!aiEnabled || !props.isSelected || !shouldShowFloatingButton(props.name)) {
                    setFloatingButtonPos(null);
                    return;
                }

                const updatePosition = () => {
                    // iframe内とメインドキュメントの両方を検索
                    const editorDoc = getEditorDocument();
                    let blockElement = editorDoc.querySelector(`[data-block="${props.clientId}"]`);

                    // iframe内で見つからない場合はメインドキュメントも検索
                    if (!blockElement) {
                        blockElement = document.querySelector(`[data-block="${props.clientId}"]`);
                    }

                    if (blockElement) {
                        const rect = blockElement.getBoundingClientRect();

                        // iframeの場合はiframeのオフセットを考慮
                        const iframe = document.querySelector('iframe[name="editor-canvas"]');
                        let offsetTop = 0;
                        let offsetLeft = 0;
                        if (iframe) {
                            const iframeRect = iframe.getBoundingClientRect();
                            offsetTop = iframeRect.top;
                            offsetLeft = iframeRect.left;
                        }

                        // ブロックの右上に配置（ビューポート座標）
                        setFloatingButtonPos({
                            top: rect.top + offsetTop - 10, // ブロックの少し上
                            left: rect.right + offsetLeft + 10 // ブロックの右側
                        });
                    } else {
                        setFloatingButtonPos(null);
                    }
                };

                updatePosition();

                // スクロールやリサイズ時に位置を更新（passiveオプションでパフォーマンス改善）
                const scrollableContainer = document.querySelector('.interface-interface-skeleton__content');
                if (scrollableContainer) {
                    scrollableContainer.addEventListener('scroll', updatePosition, { passive: true });
                }

                // iframe内のスクロールも監視
                const iframe = document.querySelector('iframe[name="editor-canvas"]');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.addEventListener('scroll', updatePosition, { passive: true });
                }

                window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
                window.addEventListener('resize', updatePosition, { passive: true });

                // MutationObserverでブロックの変更を監視
                const observer = new MutationObserver(updatePosition);
                const editorDoc = getEditorDocument();
                const editorArea = editorDoc.querySelector('.block-editor-block-list__layout') ||
                                   document.querySelector('.block-editor-block-list__layout');
                if (editorArea) {
                    observer.observe(editorArea, { childList: true, subtree: true, attributes: true });
                }

                return () => {
                    if (scrollableContainer) {
                        scrollableContainer.removeEventListener('scroll', updatePosition);
                    }
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.removeEventListener('scroll', updatePosition);
                    }
                    window.removeEventListener('scroll', updatePosition, { capture: true });
                    window.removeEventListener('resize', updatePosition);
                    observer.disconnect();
                };
            }, [aiEnabled, props.isSelected, props.clientId, props.name]);

            // AI機能がOFFの場合は元のBlockEditのみを返す
            if (!aiEnabled) {
                return createElement(BlockEdit, props);
            }

            // カスタムプロンプト保存（新規・更新共通）
            const handleSaveCustomPrompt = async () => {
                if (!newPromptName.trim() || !newPromptText.trim()) {
                    alert('名前とプロンプト内容を入力してください');
                    return;
                }

                try {
                    const isEditing = editingPromptId !== null;
                    const url = isEditing
                        ? lwAiTextSelectionData.restUrl + 'custom-prompts/' + editingPromptId
                        : lwAiTextSelectionData.restUrl + 'custom-prompts';

                    const response = await fetch(url, {
                        method: isEditing ? 'PUT' : 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        },
                        body: JSON.stringify({
                            name: newPromptName,
                            prompt: newPromptText,
                            emoji: newPromptEmoji
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setCustomPrompts(data.prompts || []);
                        setNewPromptName('');
                        setNewPromptText('');
                        setNewPromptEmoji('📝');
                        setShowAddPrompt(false);
                        setEditingPromptId(null);
                    }
                } catch (err) {
                    console.error('[LW AI Text] Failed to save custom prompt:', err);
                    alert('保存に失敗しました');
                }
            };

            // カスタムプロンプト編集開始
            const handleEditCustomPrompt = (prompt) => {
                setNewPromptName(prompt.name);
                setNewPromptText(prompt.prompt);
                setNewPromptEmoji(prompt.emoji || '📝');
                setEditingPromptId(prompt.id);
                setShowAddPrompt(true);
            };

            // 編集キャンセル
            const handleCancelEditPrompt = () => {
                setNewPromptName('');
                setNewPromptText('');
                setNewPromptEmoji('📝');
                setEditingPromptId(null);
                setShowAddPrompt(false);
            };

            // カスタムプロンプト削除
            const handleDeleteCustomPrompt = async (id) => {
                if (!confirm('このプロンプトを削除しますか？')) return;

                try {
                    const response = await fetch(lwAiTextSelectionData.restUrl + 'custom-prompts/' + id, {
                        method: 'DELETE',
                        headers: {
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        }
                    });
                    const data = await response.json();
                    if (data.success) {
                        setCustomPrompts(data.prompts || []);
                    }
                } catch (err) {
                    console.error('[LW AI Text] Failed to delete custom prompt:', err);
                }
            };

            // カスタムプロンプトを選択して実行
            const handleCustomPromptSelect = async (prompt) => {
                if (!currentSelectionData || !currentSelectionData.selectedText) {
                    alert('テキストを選択してください');
                    return;
                }

                setIsLoading(true);

                try {
                    const response = await fetch(lwAiTextSelectionData.restUrl + 'generate-text', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        },
                        body: JSON.stringify({
                            prompt: prompt.prompt,
                            originalText: currentSelectionData.selectedText,
                            useWebSearch: false,
                            tone: '',
                            isNewGeneration: false
                        })
                    });

                    const data = await response.json();
                    if (data.success && data.generatedText) {
                        setGeneratedText(data.generatedText);
                        setShowConfirmation(true);
                    } else {
                        alert('変換に失敗しました: ' + (data.message || '不明なエラー'));
                    }
                } catch (err) {
                    console.error('[LW AI Text] Custom prompt error:', err);
                    alert('通信エラーが発生しました');
                } finally {
                    setIsLoading(false);
                }
            };

            // ブロックからテキスト属性を取得するヘルパー
            const getBlockTextContent = (block) => {
                if (!block || !block.attributes) {
                    log('[LW AI Text] getBlockTextContent: no block or attributes');
                    return null;
                }

                // mainTitleを優先して検索（見出し系を先に）
                const textAttrs = [
                    'mainTitle', 'title', 'heading', 'content', 'text', 'subtitle', 'subTitle',
                    'description', 'paragraph', 'leadText', 'buttonText', 'caption', 'label'
                ];

                for (const attrName of textAttrs) {
                    if (block.attributes.hasOwnProperty(attrName)) {
                        const value = block.attributes[attrName];
                        console.log(`[LW AI Text] Checking attr "${attrName}":`, value, 'type:', typeof value);

                        // nullやundefinedの場合はスキップ
                        if (value === null || value === undefined) {
                            continue;
                        }

                        // RichTextData対象の場合は文字列に変換
                        if (typeof value === 'object' && value !== null) {
                            // textプロパティがある場合
                            if (value.text && typeof value.text === 'string' && value.text.trim()) {
                                log('[LW AI Text] Found text from object.text:', value.text);
                                return { text: value.text, attrName };
                            }
                            // toStringで取得してチェック
                            if (typeof value.toString === 'function') {
                                const stringValue = value.toString();
                                // [object Object]でなく、かつ空でない場合
                                if (stringValue && stringValue !== '[object Object]' && stringValue.trim()) {
                                    log('[LW AI Text] Found text from object.toString():', stringValue);
                                    return { text: stringValue, attrName };
                                }
                            }
                            continue;
                        }

                        // 文字列の場合
                        if (typeof value === 'string' && value.trim()) {
                            log('[LW AI Text] Found text from string:', value);
                            return { text: value, attrName };
                        }
                    }
                }
                log('[LW AI Text] getBlockTextContent: no text found, returning null');
                return null;
            };

            // HTMLからプレーンテキストを抽出するヘルパー（空チェック用）
            const extractPlainText = (html) => {
                if (!html) return '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                return (tempDiv.textContent || tempDiv.innerText || '').trim();
            };

            // 選択範囲から対応する属性名を特定するヘルパー
            const getTargetAttributeFromSelection = (selection, block) => {
                if (!block) return null;

                // selectionがない場合、iframeから取得を試みる
                let sel = selection;
                if (!sel || !sel.rangeCount) {
                    const iframe = document.querySelector('iframe[name="editor-canvas"]');
                    if (iframe && iframe.contentWindow) {
                        try {
                            sel = iframe.contentWindow.getSelection();
                        } catch (e) {
                            log('[LW AI Text] Could not get selection from iframe for attribute detection');
                        }
                    }
                }

                if (!sel || !sel.rangeCount) return null;

                try {
                    const range = sel.getRangeAt(0);
                    let element = range.startContainer;

                    // テキストノードの場合は親要素を取得
                    if (element.nodeType === Node.TEXT_NODE) {
                        element = element.parentElement;
                    }

                    if (!element) return null;

                    // RichText編集要素を探す（最も近い.block-editor-rich-text__editable）
                    const richTextElement = element.closest('.block-editor-rich-text__editable');
                    if (!richTextElement) return null;

                    // 属性マッピング：CSSクラスや構造から属性名を推測
                    const attributeMappings = [
                        { selector: '.ttl', attrs: ['mainTitle', 'title'] },
                        { selector: '.description', attrs: ['description'] },
                        { selector: '.subtitle', attrs: ['subTitle', 'subtitle'] },
                        { selector: '.lead', attrs: ['leadText'] },
                        { selector: '.cta', attrs: ['buttonText'] },
                        { selector: '.heading', attrs: ['heading'] },
                        { selector: '.caption', attrs: ['caption'] },
                        { selector: 'h1, h2, h3, h4, h5, h6', attrs: ['mainTitle', 'title', 'heading'] },
                        { selector: 'p.description', attrs: ['description'] },
                    ];

                    // RichText要素またはその祖先から属性を特定
                    for (const mapping of attributeMappings) {
                        // RichText自身がマッチするか
                        if (richTextElement.matches(mapping.selector)) {
                            for (const attrName of mapping.attrs) {
                                if (block.attributes.hasOwnProperty(attrName)) {
                                    log('[LW AI Text] Found target attribute from RichText element:', attrName);
                                    return attrName;
                                }
                            }
                        }
                        // 祖先要素がマッチするか
                        const ancestor = richTextElement.closest(mapping.selector);
                        if (ancestor) {
                            for (const attrName of mapping.attrs) {
                                if (block.attributes.hasOwnProperty(attrName)) {
                                    log('[LW AI Text] Found target attribute from ancestor:', attrName);
                                    return attrName;
                                }
                            }
                        }
                    }

                    // tagNameから推測
                    const tagName = richTextElement.tagName.toLowerCase();
                    if (tagName === 'p') {
                        // p要素の場合、クラスで判断
                        if (richTextElement.classList.contains('description')) {
                            if (block.attributes.hasOwnProperty('description')) return 'description';
                        }
                        // 一般的なpはcontent
                        if (block.attributes.hasOwnProperty('content')) return 'content';
                    } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName) || richTextElement.closest('h1, h2, h3, h4, h5, h6')) {
                        // 見出し内の場合
                        if (block.attributes.hasOwnProperty('mainTitle')) return 'mainTitle';
                        if (block.attributes.hasOwnProperty('title')) return 'title';
                        if (block.attributes.hasOwnProperty('heading')) return 'heading';
                    }

                    log('[LW AI Text] Could not determine target attribute from DOM');
                    return null;
                } catch (err) {
                    console.error('[LW AI Text] Error determining target attribute:', err);
                    return null;
                }
            };

            const handleButtonClick = () => {
                // プレミアムチェック
                const isPremium = lwAiTextSelectionData.isPremium;
                if (!isPremium) {
                    const premiumUrl = lwAiTextSelectionData.premiumUrl || 'https://shop.lite-word.com/purchase-premium';
                    alert('⚠️ この機能はプレミアムプラン限定です。\n\nプレミアムプランにアップグレードしてご利用ください。\n詳細: ' + premiumUrl);
                    return;
                }

                // 現在の選択テキストを取得（iframe対応）
                let selection = window.getSelection();
                let rawText = selection ? selection.toString() : '';

                // iframeからの選択を試みる
                if (!rawText) {
                    const iframe = document.querySelector('iframe[name="editor-canvas"]');
                    if (iframe && iframe.contentWindow) {
                        try {
                            selection = iframe.contentWindow.getSelection();
                            rawText = selection ? selection.toString() : '';
                            log('[LW AI Text] Got selection from iframe:', rawText ? `"${rawText}"` : '(empty)');
                        } catch (e) {
                            log('[LW AI Text] Could not get selection from iframe:', e);
                        }
                    }
                }

                const text = rawText.trim();

                // 複数ブロック選択をチェック
                const multiSelectedIds = select('core/block-editor').getMultiSelectedBlockClientIds();
                const isMultiSelect = multiSelectedIds && multiSelectedIds.length > 1;

                log('[LW AI Text] ===== handleButtonClick START =====');
                log('[LW AI Text] Multi-selected blocks:', multiSelectedIds?.length || 0);

                let finalText = text;
                let source = 'selection';
                let multiBlocks = null;

                // 複数ブロック選択の場合
                if (isMultiSelect) {
                    log('[LW AI Text] Multiple blocks selected:', multiSelectedIds.length);
                    const blocks = multiSelectedIds.map(id => select('core/block-editor').getBlock(id));

                    // 各ブロックのテキストを結合
                    const textsArray = blocks.map(block => {
                        const blockText = getBlockTextContent(block);
                        return blockText ? extractPlainText(blockText.text) : '';
                    }).filter(t => t);

                    if (textsArray.length > 0) {
                        finalText = textsArray.join('\n\n');
                        source = 'multi';
                        multiBlocks = {
                            clientIds: multiSelectedIds,
                            blocks: blocks
                        };
                        log('[LW AI Text] Using MULTI-BLOCK mode, combined text:', finalText.substring(0, 100) + '...');
                    }
                } else {
                    // 単一ブロック選択
                    const selectedBlock = select('core/block-editor').getSelectedBlock();
                    log('[LW AI Text] Selected text from window.getSelection():', text ? `"${text}"` : '(empty)');
                    log('[LW AI Text] Selected block:', selectedBlock);

                    // テキスト未選択の場合、ブロック全体のテキストを取得
                    if (!text) {
                        log('[LW AI Text] No text selected, checking block content...');
                        const blockText = getBlockTextContent(selectedBlock);
                        log('[LW AI Text] getBlockTextContent result:', blockText);

                        if (blockText && blockText.text) {
                            // HTMLからプレーンテキストを抽出して実際にテキストがあるかチェック
                            const plainText = extractPlainText(blockText.text);
                            log('[LW AI Text] Extracted plain text:', plainText ? `"${plainText}"` : '(empty)');

                            if (plainText) {
                                finalText = blockText.text;
                                source = 'block';
                                log('[LW AI Text] Using BLOCK text mode, text:', finalText.substring(0, 50) + '...');
                            } else {
                                // HTMLはあるが実際のテキストが空の場合は新規生成モード
                                finalText = '';
                                source = 'new';
                                log('[LW AI Text] Block has HTML but no actual text, using NEW generation mode');
                            }
                        } else {
                            // ブロックにテキストがない場合は新規生成モード
                            finalText = '';
                            source = 'new';
                            log('[LW AI Text] Using NEW generation mode (no block text found)');
                        }
                    } else {
                        log('[LW AI Text] Using SELECTION mode, text:', text.substring(0, 50) + '...');
                    }
                }

                log('[LW AI Text] Final source:', source);
                log('[LW AI Text] Final text:', finalText ? finalText.substring(0, 50) + '...' : '(empty)');

                // 選択中のブロック情報を取得（単一選択の場合）
                const selectedBlock = select('core/block-editor').getSelectedBlock();

                // 選択範囲から対応する属性名を特定
                const targetAttribute = getTargetAttributeFromSelection(selection, selectedBlock);
                log('[LW AI Text] Target attribute from selection:', targetAttribute);

                // 選択範囲とブロック情報を保存
                currentSelectionData = {
                    selectedText: finalText,
                    range: (selection && selection.rangeCount > 0) ? selection.getRangeAt(0).cloneRange() : null,
                    clientId: props.clientId,
                    blockAttributes: selectedBlock ? { ...selectedBlock.attributes } : null,
                    blockName: selectedBlock ? selectedBlock.name : null,
                    textSource: source,
                    multiBlocks: multiBlocks,
                    targetAttribute: targetAttribute
                };
                log('[LW AI Text] Saved selection data, textSource:', currentSelectionData.textSource, 'targetAttribute:', targetAttribute);
                log('[LW AI Text] ===== handleButtonClick END =====');

                setTextSource(source);
                setSelectedText(finalText);
                setShowModal(true);
                setInstruction('');
            };

            const handleClose = () => {
                setShowModal(false);
                setInstruction('');
                setSelectedText('');
                setSelectedStyles([]);
                setActiveSection(null);
                setGeneratePrompt('');
                setUseWebSearch(false);
                setGeneratedText('');
                setShowConfirmation(false);
                setSelectedTone('');
                setTextSource('selection');
                setSearchSources([]);
                setRefinementPrompt('');
                currentSelectionData = null;
            };

            // スタイルのトグル
            const toggleStyle = (style) => {
                setSelectedStyles(prev => {
                    if (prev.includes(style)) {
                        return prev.filter(s => s !== style);
                    } else {
                        return [...prev, style];
                    }
                });
            };

            const handleSubmit = async () => {
                if (!instruction.trim() || !currentSelectionData) return;

                setIsLoading(true);

                try {
                    const response = await fetch(lwAiTextSelectionData.restUrl + 'text-decoration', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        },
                        body: JSON.stringify({
                            instruction: instruction,
                            selectedText: currentSelectionData.selectedText
                        })
                    });

                    const data = await response.json();
                    log('[LW AI Text] Response:', data);

                    if (data.success && data.decoration) {
                        const decorationType = data.decoration.type || 'style';

                        if (decorationType === 'text' && data.decoration.newText) {
                            applyTextChange(data.decoration.newText, props.clientId);
                        } else {
                            applyStyleChange(data.decoration, props.clientId);
                        }

                        handleClose();
                    } else {
                        alert(data.message || 'エラーが発生しました');
                    }
                } catch (err) {
                    console.error('[LW AI Text] Error:', err);
                    alert('通信エラーが発生しました');
                } finally {
                    setIsLoading(false);
                }
            };

            const handleKeyDown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
            };

            // 自動マーカー実行（複数スタイル対応）
            const handleAutoHighlightExecute = async () => {
                if (!currentSelectionData || !currentSelectionData.selectedText) {
                    alert('テキストを選択してください');
                    return;
                }

                if (selectedStyles.length === 0) {
                    alert('スタイルを選択してください');
                    return;
                }

                setIsLoading(true);

                try {
                    // 現在のブロックから最新のHTMLコンテンツを取得
                    const savedClientId = currentSelectionData.clientId || props.clientId;
                    const currentBlock = select('core/block-editor').getBlock(savedClientId);
                    let textToHighlight = currentSelectionData.selectedText;

                    if (currentBlock) {
                        const attributes = currentBlock.attributes;
                        const textAttrs = [
                            'content', 'text', 'title', 'subtitle', 'description', 'heading', 'paragraph',
                            'mainTitle', 'subTitle', 'leadText', 'buttonText', 'caption', 'label'
                        ];

                        for (const attrName of textAttrs) {
                            if (attributes[attrName]) {
                                const attrString = getAttributeAsString(attributes[attrName]);
                                if (attrString) {
                                    const plainText = stripHtmlTags(attrString);
                                    const originalPlainText = stripHtmlTags(currentSelectionData.selectedText);
                                    if (plainText === originalPlainText || plainText.includes(originalPlainText)) {
                                        textToHighlight = attrString;
                                        log('[LW AI Text] Using current HTML content:', textToHighlight);
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    // 複数スタイルを一度に適用（AIは1回だけ呼び出し）
                    log('[LW AI Text] Applying styles:', selectedStyles);
                    const response = await fetch(lwAiTextSelectionData.restUrl + 'auto-highlight-multi', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        },
                        body: JSON.stringify({
                            text: textToHighlight,
                            styles: selectedStyles
                        })
                    });

                    const data = await response.json();
                    log('[LW AI Text] Auto highlight multi response:', data);

                    if (data.success && data.highlightedHtml) {
                        // 最終結果を適用
                        applyHighlightedHtml(data.highlightedHtml, props.clientId);
                    } else {
                        console.error('[LW AI Text] Failed to apply styles:', data.message);
                        alert('スタイルの適用に失敗しました: ' + (data.message || '不明なエラー'));
                    }
                    handleClose();
                } catch (err) {
                    console.error('[LW AI Text] Auto highlight error:', err);
                    alert('通信エラーが発生しました');
                } finally {
                    setIsLoading(false);
                }
            };

            // テキスト生成実行
            const handleGenerateText = async () => {
                if (!generatePrompt.trim()) return;

                setIsLoading(true);

                try {
                    const response = await fetch(lwAiTextSelectionData.restUrl + 'generate-text', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        },
                        body: JSON.stringify({
                            prompt: generatePrompt,
                            originalText: currentSelectionData ? currentSelectionData.selectedText : '',
                            useWebSearch: useWebSearch,
                            tone: selectedTone,
                            isNewGeneration: textSource === 'new'
                        })
                    });

                    const data = await response.json();
                    log('[LW AI Text] Generate text response:', data);

                    if (data.success && data.generatedText) {
                        setGeneratedText(data.generatedText);
                        setSearchSources(data.sources || []);
                        setShowConfirmation(true);
                        log('[LW AI Text] Search sources:', data.sources);
                    } else {
                        alert('テキスト生成に失敗しました: ' + (data.message || '不明なエラー'));
                    }
                } catch (err) {
                    console.error('[LW AI Text] Generate text error:', err);
                    alert('通信エラーが発生しました');
                } finally {
                    setIsLoading(false);
                }
            };

            // 生成テキストを確定
            const handleConfirmGenerated = () => {
                if (!generatedText || !currentSelectionData) return;

                const savedClientId = currentSelectionData.clientId || props.clientId;

                // 複数ブロック選択モードの場合
                if (currentSelectionData.textSource === 'multi' && currentSelectionData.multiBlocks) {
                    const { clientIds } = currentSelectionData.multiBlocks;
                    log('[LW AI Text] Multi-block mode: replacing', clientIds.length, 'blocks');

                    // 空行で段落を分割
                    const paragraphs = generatedText.split(/\n\s*\n/).filter(p => p.trim());

                    // 最初のブロックの位置を取得
                    const firstBlockIndex = select('core/block-editor').getBlockIndex(clientIds[0]);
                    const rootClientId = select('core/block-editor').getBlockRootClientId(clientIds[0]);

                    // 元のブロックを削除
                    dispatch('core/block-editor').removeBlocks(clientIds);

                    // 新しいブロックを作成して挿入
                    const newBlocks = paragraphs.map(p =>
                        wp.blocks.createBlock('core/paragraph', { content: p.trim() })
                    );

                    dispatch('core/block-editor').insertBlocks(newBlocks, firstBlockIndex, rootClientId);
                    log('[LW AI Text] Multi-block: replaced with', paragraphs.length, 'new paragraph blocks');
                }
                // 新規生成モードの場合
                else if (currentSelectionData.textSource === 'new') {
                    // 段落ブロックの場合は、空行で分割して複数ブロックを作成
                    if (currentSelectionData.blockName === 'core/paragraph') {
                        // 空行（2つ以上の改行）で段落を分割
                        const paragraphs = generatedText.split(/\n\s*\n/).filter(p => p.trim());

                        if (paragraphs.length > 1) {
                            // 最初の段落は現在のブロックに設定
                            dispatch('core/block-editor').updateBlockAttributes(savedClientId, { content: paragraphs[0].trim() });

                            // 残りの段落は新しいブロックとして挿入
                            const currentBlockIndex = select('core/block-editor').getBlockIndex(savedClientId);
                            const rootClientId = select('core/block-editor').getBlockRootClientId(savedClientId);

                            for (let i = 1; i < paragraphs.length; i++) {
                                const newBlock = wp.blocks.createBlock('core/paragraph', {
                                    content: paragraphs[i].trim()
                                });
                                dispatch('core/block-editor').insertBlock(
                                    newBlock,
                                    currentBlockIndex + i,
                                    rootClientId
                                );
                            }
                            log('[LW AI Text] New generation: created', paragraphs.length, 'paragraph blocks');
                        } else {
                            // 単一段落の場合はそのまま設定
                            dispatch('core/block-editor').updateBlockAttributes(savedClientId, { content: generatedText.trim() });
                            log('[LW AI Text] New generation: single paragraph');
                        }
                    } else {
                        // 段落以外のブロックはそのまま設定
                        dispatch('core/block-editor').updateBlockAttributes(savedClientId, { content: generatedText });
                        log('[LW AI Text] New generation: directly set content attribute');
                    }
                } else {
                    applyHighlightedHtml(generatedText, savedClientId);
                }
                handleClose();
            };

            // 生成テキストをキャンセル（再編集）
            const handleCancelConfirmation = () => {
                setShowConfirmation(false);
                setRefinementPrompt('');
                // generatedTextは保持して、ユーザーが修正できるようにする
            };

            // 追加指示で再生成
            const handleRefinement = async () => {
                if (!refinementPrompt.trim() && !selectedTone) return;

                setIsLoading(true);

                try {
                    // 追加指示のプロンプトを構築
                    let fullPrompt = '';
                    if (refinementPrompt.trim()) {
                        fullPrompt = `以下のテキストを指示に従って修正してください。

【重要】修正後のテキストのみを出力してください。「はい」「承知しました」などの返答や説明は一切含めないでください。

元のテキスト:
${generatedText}

修正指示:
${refinementPrompt}`;
                    } else {
                        // 口調のみ変更の場合
                        fullPrompt = `以下のテキストの口調を変更してください。

【重要】変更後のテキストのみを出力してください。「はい」「承知しました」などの返答や説明は一切含めないでください。

元のテキスト:
${generatedText}`;
                    }

                    const response = await fetch(lwAiTextSelectionData.restUrl + 'generate-text', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        },
                        body: JSON.stringify({
                            prompt: fullPrompt,
                            originalText: generatedText,
                            useWebSearch: useWebSearch,
                            tone: selectedTone,
                            isNewGeneration: false
                        })
                    });

                    const data = await response.json();
                    log('[LW AI Text] Refinement response:', data);

                    if (data.success && data.generatedText) {
                        setGeneratedText(data.generatedText);
                        setSearchSources(data.sources || []);
                        setRefinementPrompt('');
                    } else {
                        alert('再生成に失敗しました: ' + (data.message || '不明なエラー'));
                    }
                } catch (err) {
                    console.error('[LW AI Text] Refinement error:', err);
                    alert('通信エラーが発生しました');
                } finally {
                    setIsLoading(false);
                }
            };

            // 口調だけを変更（内容はそのまま）
            const handleChangeToneOnly = async () => {
                if (!selectedTone || !currentSelectionData || !currentSelectionData.selectedText) return;

                setIsLoading(true);

                try {
                    const toneLabels = {
                        'polite': 'です・ます調（丁寧語）',
                        'plain': 'だ・である調（常体）',
                        'casual': 'カジュアルな口調',
                        'business': 'ビジネス向けのフォーマルな口調',
                        'friendly': 'フレンドリーで親しみやすい口調',
                        'okinawa': '沖縄弁（うちなーぐち）。「〜さー」「〜やっさー」「なんくるないさー」などの沖縄方言',
                        'akita': '秋田弁。「〜だべ」「〜んだ」「なんぼ」などの秋田方言',
                        'osaka': '大阪弁（関西弁）。「〜やねん」「〜やで」「なんでやねん」「めっちゃ」などの大阪方言',
                        'gyaru': '渋谷ギャル語。「マジ卍」「てぇてぇ」「激おこ」「ぴえん」「それな」などのギャル語・若者言葉'
                    };

                    const prompt = `以下のテキストの口調を「${toneLabels[selectedTone]}」に変更してください。

【重要なルール】
- 内容や意味は一切変更しないでください
- 口調・文体のみを変更してください
- 変更後のテキストのみを出力してください
- 「はい」「承知しました」などの返答は含めないでください
- マークダウン記法は使用しないでください`;

                    const response = await fetch(lwAiTextSelectionData.restUrl + 'generate-text', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': lwAiTextSelectionData.restNonce
                        },
                        body: JSON.stringify({
                            prompt: prompt,
                            originalText: currentSelectionData.selectedText,
                            useWebSearch: false,
                            tone: selectedTone,
                            isNewGeneration: false
                        })
                    });

                    const data = await response.json();
                    log('[LW AI Text] Tone change response:', data);

                    if (data.success && data.generatedText) {
                        setGeneratedText(data.generatedText);
                        setShowConfirmation(true);
                    } else {
                        alert('口調変更に失敗しました: ' + (data.message || '不明なエラー'));
                    }
                } catch (err) {
                    console.error('[LW AI Text] Tone change error:', err);
                    alert('通信エラーが発生しました');
                } finally {
                    setIsLoading(false);
                }
            };

            // SVGアイコン - 紫色のAIアイコン（大きめ）
            const aiIcon = createElement('svg', {
                width: 32,
                height: 32,
                viewBox: '0 0 24 24',
                fill: 'none',
                xmlns: 'http://www.w3.org/2000/svg'
            },
                // グラデーション定義
                createElement('defs', null,
                    createElement('linearGradient', {
                        id: 'aiGradient',
                        x1: '0%',
                        y1: '0%',
                        x2: '100%',
                        y2: '100%'
                    },
                        createElement('stop', { offset: '0%', stopColor: '#8B5CF6' }),
                        createElement('stop', { offset: '100%', stopColor: '#A855F7' })
                    )
                ),
                // 背景の角丸四角
                createElement('rect', {
                    x: '1',
                    y: '3',
                    width: '22',
                    height: '18',
                    rx: '4',
                    fill: 'url(#aiGradient)'
                }),
                // AIテキスト
                createElement('text', {
                    x: '12',
                    y: '16',
                    textAnchor: 'middle',
                    fill: 'white',
                    fontSize: '10',
                    fontWeight: 'bold',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }, 'AI')
            );

            // フローティングボタン用の小さいアイコン
            const aiIconSmall = createElement('svg', {
                width: 20,
                height: 20,
                viewBox: '0 0 24 24',
                fill: 'none',
                xmlns: 'http://www.w3.org/2000/svg'
            },
                createElement('defs', null,
                    createElement('linearGradient', {
                        id: 'aiGradientSmall',
                        x1: '0%',
                        y1: '0%',
                        x2: '100%',
                        y2: '100%'
                    },
                        createElement('stop', { offset: '0%', stopColor: '#8B5CF6' }),
                        createElement('stop', { offset: '100%', stopColor: '#A855F7' })
                    )
                ),
                createElement('rect', {
                    x: '1',
                    y: '3',
                    width: '22',
                    height: '18',
                    rx: '4',
                    fill: 'url(#aiGradientSmall)'
                }),
                createElement('text', {
                    x: '12',
                    y: '16',
                    textAnchor: 'middle',
                    fill: 'white',
                    fontSize: '10',
                    fontWeight: 'bold',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }, 'AI')
            );

            const isPremium = lwAiTextSelectionData.isPremium;

            return createElement(
                wp.element.Fragment,
                null,
                createElement(BlockEdit, props),
                createElement(BlockControls, null,
                    createElement(ToolbarGroup, null,
                        createElement(ToolbarButton, {
                            icon: aiIcon,
                            label: isPremium ? 'AI テキスト生成・自動装飾' : 'AI テキスト生成・自動装飾（プレミアムプラン限定）',
                            onClick: handleButtonClick,
                            className: 'lw-ai-toolbar-button' + (!isPremium ? ' lw-ai-premium-disabled' : '')
                        })
                    )
                ),
                // フローティングAIボタン（ブロック選択時に表示）- Portalでbody直下にレンダリング
                props.isSelected && floatingButtonPos && isPremium && createPortal(
                    createElement('div', {
                        ref: floatingButtonRef,
                        className: 'lw-ai-floating-button',
                        onClick: handleButtonClick,
                        title: 'AI テキスト生成・自動装飾',
                        style: {
                            position: 'fixed',
                            top: `${floatingButtonPos.top}px`,
                            left: `${floatingButtonPos.left}px`,
                            zIndex: 999999,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '2px solid white',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }
                    }, aiIconSmall),
                    document.body
                ),
                showModal && createElement(Modal, {
                    title: '✨ AI テキスト生成・自動装飾',
                    onRequestClose: handleClose,
                    className: 'lw-ai-generator-modal',
                    overlayClassName: 'lw-ai-generator-modal-overlay',
                    style: { maxWidth: '520px' }
                },
                    createElement('div', { className: 'lw-ai-modal-content' },
                        // テキストソース表示（モードに応じて変化）
                        textSource === 'new' ?
                            // 新規生成モード
                            createElement('div', {
                                className: 'lw-ai-section-card lw-ai-section-card-generate',
                                style: {
                                    marginBottom: '20px',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
                                }
                            },
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }
                                },
                                    createElement('span', { style: { fontSize: '20px' } }, '✨'),
                                    createElement('div', null,
                                        createElement('strong', {
                                            style: {
                                                color: '#1d4ed8',
                                                fontSize: '14px',
                                                fontWeight: '700'
                                            }
                                        }, '新規テキスト生成モード'),
                                        createElement('div', {
                                            style: {
                                                fontSize: '12px',
                                                color: '#64748b',
                                                marginTop: '2px'
                                            }
                                        }, 'プロンプトからテキストを生成します')
                                    )
                                )
                            ) :
                        textSource === 'multi' ?
                            // 複数ブロック選択モード
                            createElement('div', {
                                className: 'lw-ai-section-card',
                                style: {
                                    marginBottom: '20px',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%)',
                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)'
                                }
                            },
                                // タイトル行
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '10px'
                                    }
                                },
                                    createElement('span', { style: { fontSize: '20px' } }, '📚'),
                                    createElement('strong', {
                                        style: {
                                            color: '#1d4ed8',
                                            fontSize: '14px',
                                            fontWeight: '700'
                                        }
                                    }, '複数段落を選択中')
                                ),
                                // テキストプレビュー（全幅）
                                createElement('div', {
                                    style: {
                                        fontSize: '12px',
                                        color: '#1e40af',
                                        maxHeight: '80px',
                                        overflow: 'auto',
                                        padding: '8px',
                                        background: 'rgba(255,255,255,0.7)',
                                        borderRadius: '6px',
                                        whiteSpace: 'pre-wrap'
                                    }
                                }, selectedText.length > 150 ? selectedText.substring(0, 150) + '...' : selectedText)
                            ) :
                        textSource === 'block' ?
                            // ブロック全体モード
                            createElement('div', {
                                className: 'lw-ai-section-card',
                                style: {
                                    marginBottom: '20px',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 100%)',
                                    boxShadow: '0 2px 8px rgba(251, 191, 36, 0.15)'
                                }
                            },
                                // タイトル行
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '10px'
                                    }
                                },
                                    createElement('span', { style: { fontSize: '20px' } }, '📦'),
                                    createElement('strong', {
                                        style: {
                                            color: '#b45309',
                                            fontSize: '14px',
                                            fontWeight: '700'
                                        }
                                    }, 'ブロック全体を対象')
                                ),
                                // テキストプレビュー（全幅）
                                createElement('div', {
                                    style: {
                                        fontSize: '12px',
                                        color: '#78716c',
                                        maxHeight: '60px',
                                        overflow: 'auto',
                                        padding: '8px',
                                        background: 'rgba(255,255,255,0.6)',
                                        borderRadius: '6px'
                                    }
                                }, selectedText.length > 100 ? selectedText.substring(0, 100) + '...' : selectedText)
                            ) :
                            // 選択テキストモード
                            createElement('div', {
                                className: 'lw-ai-section-card',
                                style: {
                                    marginBottom: '20px',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                }
                            },
                                createElement('div', {
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#475569',
                                        marginBottom: '8px'
                                    }
                                }, '選択テキスト'),
                                createElement('div', {
                                    style: {
                                        fontSize: '13px',
                                        color: '#334155',
                                        maxHeight: '60px',
                                        overflow: 'auto',
                                        padding: '8px 10px',
                                        background: 'rgba(255,255,255,0.8)',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(0,0,0,0.06)'
                                    }
                                }, selectedText.length > 100 ? selectedText.substring(0, 100) + '...' : selectedText)
                            ),

                        // 確認ダイアログ表示時
                        showConfirmation ? createElement('div', {
                            className: 'lw-ai-confirmation-box',
                            style: {
                                background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)',
                                borderRadius: '16px',
                                padding: '20px',
                                color: 'white',
                                boxShadow: '0 10px 40px rgba(30, 27, 75, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            }
                        },
                            createElement('div', {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '16px'
                                }
                            },
                                createElement('span', {
                                    style: {
                                        fontSize: '24px',
                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                    }
                                }, '✅'),
                                createElement('div', null,
                                    createElement('div', {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            color: '#e0e7ff'
                                        }
                                    }, '生成されたテキスト'),
                                    createElement('div', {
                                        style: {
                                            fontSize: '12px',
                                            color: 'rgba(255,255,255,0.7)',
                                            marginTop: '2px'
                                        }
                                    }, 'この内容でよろしいですか？編集も可能です')
                                )
                            ),
                            createElement('textarea', {
                                value: generatedText,
                                onChange: (e) => setGeneratedText(e.target.value),
                                className: 'lw-ai-confirmation-textarea',
                                style: {
                                    width: '100%',
                                    minHeight: '140px',
                                    padding: '14px 16px',
                                    border: '2px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    lineHeight: '1.7',
                                    marginBottom: '16px',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    color: '#1e293b',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                }
                            }),
                            // 検索ソースの表示
                            searchSources.length > 0 && createElement('div', {
                                style: {
                                    marginBottom: '16px',
                                    padding: '12px 14px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255, 255, 255, 0.15)'
                                }
                            },
                                createElement('div', {
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#a5b4fc',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }
                                },
                                    createElement('span', null, '🔍'),
                                    '参照したWebサイト'
                                ),
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px'
                                    }
                                },
                                    ...searchSources.map((source, index) =>
                                        createElement('a', {
                                            key: index,
                                            href: source.uri,
                                            target: '_blank',
                                            rel: 'noopener noreferrer',
                                            className: 'lw-ai-source-link',
                                            style: {
                                                display: 'block',
                                                padding: '8px 12px',
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                borderRadius: '8px',
                                                color: '#c7d2fe',
                                                textDecoration: 'none',
                                                fontSize: '12px',
                                                transition: 'all 0.2s ease'
                                            }
                                        }, source.title || source.uri)
                                    )
                                )
                            ),
                            // 追加指示セクション
                            createElement('div', {
                                style: {
                                    marginBottom: '16px',
                                    padding: '14px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.15)'
                                }
                            },
                                createElement('div', {
                                    style: {
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#fbbf24',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }
                                },
                                    createElement('span', null, '✏️'),
                                    '追加の指示（オプション）'
                                ),
                                // 追加指示入力
                                createElement('textarea', {
                                    value: refinementPrompt,
                                    onChange: (e) => setRefinementPrompt(e.target.value),
                                    placeholder: '例: もう少し短くして、もっとカジュアルに、具体例を追加して...',
                                    style: {
                                        width: '100%',
                                        minHeight: '70px',
                                        padding: '12px',
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        marginBottom: '12px',
                                        boxSizing: 'border-box',
                                        resize: 'vertical',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        color: '#1e293b'
                                    }
                                }),
                                // 口調選択ボタン
                                createElement('div', {
                                    style: {
                                        marginBottom: '12px'
                                    }
                                },
                                    createElement('div', {
                                        style: {
                                            fontSize: '11px',
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            marginBottom: '8px'
                                        }
                                    }, '口調を変更:'),
                                    createElement('div', {
                                        style: {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '6px'
                                        }
                                    },
                                        ...[
                                            { value: '', label: '指定なし' },
                                            { value: 'polite', label: 'です・ます' },
                                            { value: 'plain', label: 'だ・である' },
                                            { value: 'casual', label: 'カジュアル' },
                                            { value: 'business', label: 'ビジネス' },
                                            { value: 'friendly', label: 'フレンドリー' }
                                        ].map(tone =>
                                            createElement('button', {
                                                key: tone.value,
                                                onClick: () => setSelectedTone(tone.value),
                                                className: 'lw-ai-tone-btn',
                                                style: {
                                                    padding: '6px 12px',
                                                    fontSize: '11px',
                                                    border: 'none',
                                                    borderRadius: '20px',
                                                    background: selectedTone === tone.value
                                                        ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                                                        : 'rgba(255, 255, 255, 0.15)',
                                                    color: selectedTone === tone.value ? 'white' : 'rgba(255, 255, 255, 0.9)',
                                                    cursor: 'pointer',
                                                    fontWeight: selectedTone === tone.value ? '600' : '500',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: selectedTone === tone.value
                                                        ? '0 4px 12px rgba(139, 92, 246, 0.4)'
                                                        : 'none'
                                                }
                                            }, tone.label)
                                        )
                                    )
                                ),
                                // 再生成ボタン
                                createElement(Button, {
                                    variant: 'secondary',
                                    onClick: handleRefinement,
                                    disabled: isLoading || (!refinementPrompt.trim() && !selectedTone),
                                    className: 'lw-ai-action-btn',
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
                                    }
                                },
                                    isLoading ? createElement(Spinner) : '🔄 この指示で再生成'
                                )
                            ),
                            // ボタン
                            createElement('div', {
                                style: {
                                    display: 'flex',
                                    gap: '10px',
                                    marginTop: '8px'
                                }
                            },
                                createElement(Button, {
                                    variant: 'secondary',
                                    onClick: handleCancelConfirmation,
                                    disabled: isLoading,
                                    style: {
                                        flex: 1,
                                        padding: '12px 16px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '10px',
                                        transition: 'all 0.2s ease'
                                    }
                                }, '← 最初から'),
                                createElement(Button, {
                                    variant: 'primary',
                                    onClick: handleConfirmGenerated,
                                    disabled: isLoading,
                                    className: 'lw-ai-action-btn',
                                    style: {
                                        flex: 2,
                                        padding: '12px 20px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                                    }
                                }, '✓ 確定して適用')
                            )
                        ) :

                        // メインUI（セクション選択）
                        createElement('div', null,
                            // セクション選択ボタン（新規生成モードでは非表示）
                            textSource !== 'new' && createElement('div', {
                                style: {
                                    display: 'flex',
                                    gap: '8px',
                                    marginBottom: '20px',
                                    padding: '4px',
                                    background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    borderRadius: '14px',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                                }
                            },
                                createElement(Button, {
                                    variant: activeSection === 'generate' ? 'primary' : 'secondary',
                                    onClick: () => setActiveSection(activeSection === 'generate' ? null : 'generate'),
                                    className: 'lw-ai-section-tab',
                                    style: {
                                        flex: 1,
                                        padding: '10px 12px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: activeSection === 'generate'
                                            ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                            : 'transparent',
                                        color: activeSection === 'generate' ? 'white' : '#64748b',
                                        boxShadow: activeSection === 'generate'
                                            ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                                            : 'none',
                                        transition: 'all 0.25s ease'
                                    }
                                }, '📝 生成'),
                                createElement(Button, {
                                    variant: activeSection === 'tone' ? 'primary' : 'secondary',
                                    onClick: () => setActiveSection(activeSection === 'tone' ? null : 'tone'),
                                    className: 'lw-ai-section-tab',
                                    style: {
                                        flex: 1,
                                        padding: '10px 12px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: activeSection === 'tone'
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : 'transparent',
                                        color: activeSection === 'tone' ? 'white' : '#64748b',
                                        boxShadow: activeSection === 'tone'
                                            ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                                            : 'none',
                                        transition: 'all 0.25s ease'
                                    }
                                }, '🗣️ 口調変更'),
                                createElement(Button, {
                                    variant: activeSection === 'decorate' ? 'primary' : 'secondary',
                                    onClick: () => setActiveSection(activeSection === 'decorate' ? null : 'decorate'),
                                    className: 'lw-ai-section-tab',
                                    style: {
                                        flex: 1,
                                        padding: '10px 12px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: activeSection === 'decorate'
                                            ? 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)'
                                            : 'transparent',
                                        color: activeSection === 'decorate' ? 'white' : '#64748b',
                                        boxShadow: activeSection === 'decorate'
                                            ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                                            : 'none',
                                        transition: 'all 0.25s ease'
                                    }
                                }, '🎨 装飾')
                            ),

                            // テキスト生成セクション（新規生成モードでは常に表示）
                            (activeSection === 'generate' || textSource === 'new') && createElement('div', {
                                className: 'lw-ai-section-card lw-ai-section-card-generate',
                                style: {
                                    padding: '18px',
                                    borderRadius: '14px',
                                    marginBottom: '16px',
                                    boxShadow: '0 2px 12px rgba(59, 130, 246, 0.08)'
                                }
                            },
                                createElement('div', {
                                    style: {
                                        fontSize: '12px',
                                        color: '#64748b',
                                        marginBottom: '14px',
                                        padding: '10px 12px',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(59, 130, 246, 0.1)'
                                    }
                                }, textSource === 'new'
                                    ? '💡 プロンプトに基づいてAIが新しいテキストを生成します'
                                    : textSource === 'multi'
                                        ? '💡 選択した複数段落を元に、AIがテキストを再生成します'
                                        : textSource === 'block'
                                            ? '💡 ブロック全体のテキストを元に、AIがテキストを生成します'
                                            : '💡 選択したテキストを元に、AIがテキストを生成します'),

                                // 口調選択
                                createElement('div', {
                                    className: 'lw-ai-section-label',
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#1e40af',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }
                                },
                                    createElement('span', null, '📝'),
                                    '口調・文体'
                                ),
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap',
                                        marginBottom: '16px'
                                    }
                                },
                                    ...[
                                        { value: 'polite', label: 'です・ます' },
                                        { value: 'plain', label: 'だ・である' },
                                        { value: 'casual', label: 'カジュアル' },
                                        { value: 'business', label: 'ビジネス' },
                                        { value: 'friendly', label: 'フレンドリー' }
                                    ].map(tone =>
                                        createElement(Button, {
                                            key: tone.value,
                                            variant: selectedTone === tone.value ? 'primary' : 'secondary',
                                            onClick: () => setSelectedTone(selectedTone === tone.value ? '' : tone.value),
                                            disabled: isLoading,
                                            className: 'lw-ai-tone-btn',
                                            style: {
                                                fontSize: '12px',
                                                padding: '8px 14px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                background: selectedTone === tone.value
                                                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                                    : 'rgba(255, 255, 255, 0.8)',
                                                color: selectedTone === tone.value ? 'white' : '#475569',
                                                fontWeight: selectedTone === tone.value ? '600' : '500',
                                                boxShadow: selectedTone === tone.value
                                                    ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                                                    : '0 1px 3px rgba(0,0,0,0.08)',
                                                transition: 'all 0.2s ease'
                                            }
                                        }, tone.label)
                                    )
                                ),

                                // プロンプト入力
                                createElement('div', {
                                    className: 'lw-ai-section-label',
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#1e40af',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }
                                },
                                    createElement('span', null, '💡'),
                                    '指示'
                                ),
                                createElement('textarea', {
                                    value: generatePrompt,
                                    onChange: (e) => setGeneratePrompt(e.target.value),
                                    placeholder: '例: もっと詳しく説明して、キャッチコピー風に、英語に翻訳、箇条書きにして',
                                    disabled: isLoading,
                                    className: 'lw-ai-modal-textarea',
                                    style: {
                                        width: '100%',
                                        minHeight: '90px',
                                        padding: '14px',
                                        border: '2px solid rgba(59, 130, 246, 0.15)',
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        marginBottom: '12px',
                                        boxSizing: 'border-box',
                                        resize: 'vertical',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        transition: 'all 0.2s ease'
                                    }
                                }),
                                createElement('label', {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '16px',
                                        padding: '12px 14px',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        border: useWebSearch ? '2px solid #3b82f6' : '2px solid transparent',
                                        transition: 'all 0.2s ease'
                                    }
                                },
                                    createElement('input', {
                                        type: 'checkbox',
                                        checked: useWebSearch,
                                        onChange: (e) => setUseWebSearch(e.target.checked),
                                        disabled: isLoading,
                                        style: {
                                            width: '18px',
                                            height: '18px',
                                            accentColor: '#3b82f6'
                                        }
                                    }),
                                    createElement('span', {
                                        style: {
                                            fontSize: '13px',
                                            color: useWebSearch ? '#1e40af' : '#64748b',
                                            fontWeight: useWebSearch ? '600' : '500'
                                        }
                                    }, '🔍 Web検索して情報を調べてから生成')
                                ),
                                createElement(Button, {
                                    variant: 'primary',
                                    onClick: handleGenerateText,
                                    disabled: isLoading || !generatePrompt.trim(),
                                    className: 'lw-ai-action-btn',
                                    style: {
                                        width: '100%',
                                        padding: '14px',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
                                    }
                                },
                                    isLoading
                                        ? createElement(Spinner, { style: { margin: 0 } })
                                        : '✨ テキストを生成'
                                )
                            ),

                            // 口調変更セクション
                            activeSection === 'tone' && createElement('div', {
                                className: 'lw-ai-section-card lw-ai-section-card-tone',
                                style: {
                                    padding: '18px',
                                    borderRadius: '14px',
                                    marginBottom: '16px',
                                    boxShadow: '0 2px 12px rgba(16, 185, 129, 0.08)'
                                }
                            },
                                createElement('div', {
                                    style: {
                                        fontSize: '12px',
                                        color: '#065f46',
                                        marginBottom: '16px',
                                        padding: '10px 12px',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(16, 185, 129, 0.1)'
                                    }
                                }, '💡 選択したテキストの口調だけを変更します。内容はそのままです。'),
                                // 標準の口調
                                createElement('div', {
                                    className: 'lw-ai-section-label',
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#047857',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }
                                },
                                    createElement('span', null, '📝'),
                                    '標準'
                                ),
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap',
                                        marginBottom: '16px'
                                    }
                                },
                                    ...[
                                        { value: 'polite', label: 'です・ます' },
                                        { value: 'plain', label: 'だ・である' },
                                        { value: 'casual', label: 'カジュアル' },
                                        { value: 'business', label: 'ビジネス' },
                                        { value: 'friendly', label: 'フレンドリー' }
                                    ].map(tone =>
                                        createElement(Button, {
                                            key: tone.value,
                                            variant: selectedTone === tone.value ? 'primary' : 'secondary',
                                            onClick: () => setSelectedTone(selectedTone === tone.value ? '' : tone.value),
                                            disabled: isLoading,
                                            className: 'lw-ai-tone-btn',
                                            style: {
                                                fontSize: '12px',
                                                padding: '8px 14px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                background: selectedTone === tone.value
                                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                    : 'rgba(255, 255, 255, 0.8)',
                                                color: selectedTone === tone.value ? 'white' : '#475569',
                                                fontWeight: selectedTone === tone.value ? '600' : '500',
                                                boxShadow: selectedTone === tone.value
                                                    ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                    : '0 1px 3px rgba(0,0,0,0.08)',
                                                transition: 'all 0.2s ease'
                                            }
                                        }, tone.label)
                                    )
                                ),
                                // 方言・おもしろ系
                                createElement('div', {
                                    className: 'lw-ai-section-label',
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#047857',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }
                                },
                                    createElement('span', null, '🎉'),
                                    'おもしろ系'
                                ),
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap',
                                        marginBottom: '16px'
                                    }
                                },
                                    ...[
                                        { value: 'okinawa', label: '🌺 沖縄弁', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', shadow: 'rgba(249, 115, 22, 0.3)' },
                                        { value: 'akita', label: '🌾 秋田弁', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', shadow: 'rgba(14, 165, 233, 0.3)' },
                                        { value: 'osaka', label: '🐙 大阪弁', gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', shadow: 'rgba(234, 179, 8, 0.3)' },
                                        { value: 'gyaru', label: '💖 ギャル語', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', shadow: 'rgba(236, 72, 153, 0.3)' }
                                    ].map(tone =>
                                        createElement(Button, {
                                            key: tone.value,
                                            variant: selectedTone === tone.value ? 'primary' : 'secondary',
                                            onClick: () => setSelectedTone(selectedTone === tone.value ? '' : tone.value),
                                            disabled: isLoading,
                                            className: 'lw-ai-tone-btn',
                                            style: {
                                                fontSize: '12px',
                                                padding: '8px 14px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                background: selectedTone === tone.value
                                                    ? tone.gradient
                                                    : 'rgba(255, 255, 255, 0.8)',
                                                color: selectedTone === tone.value ? 'white' : '#475569',
                                                fontWeight: selectedTone === tone.value ? '600' : '500',
                                                boxShadow: selectedTone === tone.value
                                                    ? `0 4px 12px ${tone.shadow}`
                                                    : '0 1px 3px rgba(0,0,0,0.08)',
                                                transition: 'all 0.2s ease'
                                            }
                                        }, tone.label)
                                    )
                                ),
                                // 実行ボタン
                                createElement(Button, {
                                    variant: 'primary',
                                    onClick: handleChangeToneOnly,
                                    disabled: isLoading || !selectedTone,
                                    className: 'lw-ai-action-btn',
                                    style: {
                                        width: '100%',
                                        padding: '14px',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                                        marginBottom: '16px'
                                    }
                                },
                                    isLoading
                                        ? createElement(Spinner, { style: { margin: 0 } })
                                        : '🗣️ 口調を変更'
                                ),

                                // カスタムプロンプトセクション
                                createElement('div', {
                                    className: 'lw-ai-custom-prompt-section',
                                    style: {
                                        borderTop: '2px dashed rgba(16, 185, 129, 0.2)',
                                        paddingTop: '16px',
                                        marginTop: '12px',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        borderRadius: '0 0 12px 12px',
                                        padding: '16px',
                                        marginLeft: '-18px',
                                        marginRight: '-18px',
                                        marginBottom: '-18px'
                                    }
                                },
                                    createElement('div', {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '12px'
                                        }
                                    },
                                        createElement('div', {
                                            style: {
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                color: '#047857',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }
                                        },
                                            createElement('span', null, '✨'),
                                            'カスタムプロンプト'
                                        ),
                                        createElement('button', {
                                            onClick: () => {
                                                if (showAddPrompt) {
                                                    handleCancelEditPrompt();
                                                } else {
                                                    setShowAddPrompt(true);
                                                }
                                            },
                                            style: {
                                                background: showAddPrompt
                                                    ? 'rgba(239, 68, 68, 0.1)'
                                                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                border: 'none',
                                                color: showAddPrompt ? '#ef4444' : 'white',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                padding: '6px 12px',
                                                borderRadius: '16px',
                                                transition: 'all 0.2s ease'
                                            }
                                        }, showAddPrompt ? '✕ 閉じる' : '+ 追加')
                                    ),

                                    // 追加/編集フォーム
                                    showAddPrompt && createElement('div', {
                                        style: {
                                            background: editingPromptId
                                                ? 'linear-gradient(145deg, #fef3c7 0%, #fde68a 100%)'
                                                : 'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 100%)',
                                            borderRadius: '12px',
                                            padding: '14px',
                                            marginBottom: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                        }
                                    },
                                        editingPromptId && createElement('div', {
                                            style: {
                                                fontSize: '12px',
                                                color: '#92400e',
                                                marginBottom: '10px',
                                                fontWeight: '700',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }
                                        },
                                            createElement('span', null, '✏️'),
                                            '編集中'
                                        ),
                                        createElement('div', {
                                            style: {
                                                display: 'flex',
                                                gap: '10px',
                                                marginBottom: '10px'
                                            }
                                        },
                                            createElement('select', {
                                                value: newPromptEmoji,
                                                onChange: (e) => setNewPromptEmoji(e.target.value),
                                                style: {
                                                    width: '60px',
                                                    padding: '8px',
                                                    borderRadius: '10px',
                                                    border: '2px solid rgba(99, 102, 241, 0.2)',
                                                    fontSize: '16px',
                                                    background: 'white',
                                                    cursor: 'pointer'
                                                }
                                            },
                                                ['📝', '✏️', '🔄', '💡', '🎯', '✨', '🚀', '💬', '📢', '🎨'].map(e =>
                                                    createElement('option', { key: e, value: e }, e)
                                                )
                                            ),
                                            createElement('input', {
                                                type: 'text',
                                                value: newPromptName,
                                                onChange: (e) => setNewPromptName(e.target.value),
                                                placeholder: '名前（例：要約）',
                                                style: {
                                                    flex: 1,
                                                    padding: '10px 12px',
                                                    borderRadius: '10px',
                                                    border: '2px solid rgba(99, 102, 241, 0.2)',
                                                    fontSize: '13px',
                                                    background: 'white'
                                                }
                                            })
                                        ),
                                        createElement('textarea', {
                                            value: newPromptText,
                                            onChange: (e) => setNewPromptText(e.target.value),
                                            placeholder: 'プロンプト内容（例：以下のテキストを3行に要約してください）',
                                            style: {
                                                width: '100%',
                                                minHeight: '70px',
                                                padding: '12px',
                                                borderRadius: '10px',
                                                border: '2px solid rgba(99, 102, 241, 0.2)',
                                                fontSize: '13px',
                                                marginBottom: '10px',
                                                boxSizing: 'border-box',
                                                resize: 'vertical',
                                                background: 'white'
                                            }
                                        }),
                                        createElement('div', {
                                            style: {
                                                display: 'flex',
                                                gap: '10px'
                                            }
                                        },
                                            editingPromptId && createElement(Button, {
                                                variant: 'secondary',
                                                onClick: handleCancelEditPrompt,
                                                style: {
                                                    flex: 1,
                                                    padding: '10px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    borderRadius: '10px'
                                                }
                                            }, 'キャンセル'),
                                            createElement(Button, {
                                                variant: 'primary',
                                                onClick: handleSaveCustomPrompt,
                                                className: 'lw-ai-action-btn',
                                                style: {
                                                    flex: 1,
                                                    padding: '10px',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                                }
                                            }, editingPromptId ? '✓ 更新' : '💾 保存')
                                        )
                                    ),

                                    // 保存済みプロンプト一覧
                                    customPrompts.length > 0 && createElement('div', {
                                        style: {
                                            display: 'flex',
                                            gap: '8px',
                                            flexWrap: 'wrap'
                                        }
                                    },
                                        customPrompts.map(prompt =>
                                            createElement('div', {
                                                key: prompt.id,
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    borderRadius: '20px',
                                                    padding: '2px 4px 2px 2px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                                }
                                            },
                                                createElement(Button, {
                                                    variant: 'secondary',
                                                    onClick: () => handleCustomPromptSelect(prompt),
                                                    disabled: isLoading,
                                                    className: 'lw-ai-custom-prompt-btn',
                                                    style: {
                                                        fontSize: '12px',
                                                        padding: '8px 12px',
                                                        borderRadius: '18px',
                                                        border: 'none',
                                                        background: editingPromptId === prompt.id
                                                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                                            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                        color: 'white',
                                                        fontWeight: '600',
                                                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                                                        transition: 'all 0.2s ease'
                                                    }
                                                }, `${prompt.emoji} ${prompt.name}`),
                                                createElement('button', {
                                                    onClick: () => handleEditCustomPrompt(prompt),
                                                    title: '編集',
                                                    style: {
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        border: 'none',
                                                        color: '#6366f1',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        padding: '4px 6px',
                                                        borderRadius: '8px',
                                                        transition: 'all 0.2s ease'
                                                    }
                                                }, '✏️'),
                                                createElement('button', {
                                                    onClick: () => handleDeleteCustomPrompt(prompt.id),
                                                    title: '削除',
                                                    style: {
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        padding: '4px 6px',
                                                        borderRadius: '8px',
                                                        transition: 'all 0.2s ease'
                                                    }
                                                }, '✕')
                                            )
                                        )
                                    ),

                                    // プロンプトがない場合
                                    customPrompts.length === 0 && !showAddPrompt && createElement('div', {
                                        style: {
                                            fontSize: '11px',
                                            color: '#9ca3af',
                                            textAlign: 'center',
                                            padding: '8px'
                                        }
                                    }, 'カスタムプロンプトがありません。「+ 追加」で作成できます')
                                )
                            ),

                            // 自動装飾セクション
                            activeSection === 'decorate' && createElement('div', {
                                className: 'lw-ai-section-card lw-ai-section-card-decorate',
                                style: {
                                    padding: '18px',
                                    borderRadius: '14px',
                                    marginBottom: '16px',
                                    boxShadow: '0 2px 12px rgba(139, 92, 246, 0.08)'
                                }
                            },
                                // 手動指示入力
                                createElement('div', {
                                    style: { marginBottom: '16px' }
                                },
                                    createElement('div', {
                                        className: 'lw-ai-section-label',
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: '#7c3aed',
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }
                                    },
                                        createElement('span', null, '✍️'),
                                        '指示を入力'
                                    ),
                                    createElement('input', {
                                        ref: inputRef,
                                        type: 'text',
                                        value: instruction,
                                        onChange: (e) => setInstruction(e.target.value),
                                        onKeyDown: handleKeyDown,
                                        placeholder: '例: 赤くして、大きくして、太字にして',
                                        disabled: isLoading,
                                        style: {
                                            width: '100%',
                                            padding: '12px 14px',
                                            border: '2px solid rgba(139, 92, 246, 0.15)',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            transition: 'all 0.2s ease'
                                        }
                                    }),
                                    createElement(Button, {
                                        variant: 'primary',
                                        onClick: handleSubmit,
                                        disabled: isLoading || !instruction.trim(),
                                        className: 'lw-ai-action-btn',
                                        style: {
                                            marginTop: '10px',
                                            padding: '10px 20px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                                        }
                                    },
                                        isLoading ? createElement(Spinner, { style: { margin: 0 } }) : '適用'
                                    )
                                ),

                                // 区切り線
                                createElement('div', {
                                    style: {
                                        borderTop: '2px dashed rgba(139, 92, 246, 0.2)',
                                        margin: '16px 0',
                                        position: 'relative'
                                    }
                                },
                                    createElement('span', {
                                        style: {
                                            position: 'absolute',
                                            top: '-12px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'linear-gradient(145deg, #faf5ff 0%, #f3e8ff 100%)',
                                            padding: '4px 14px',
                                            fontSize: '12px',
                                            color: '#7c3aed',
                                            fontWeight: '600',
                                            borderRadius: '12px'
                                        }
                                    }, 'または')
                                ),

                                // 自動マーカー
                                createElement('div', {
                                    className: 'lw-ai-section-label',
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#7c3aed',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }
                                },
                                    createElement('span', null, '🎯'),
                                    '自動マーカー（複数選択可）'
                                ),
                                createElement('div', {
                                    style: {
                                        display: 'flex',
                                        gap: '10px',
                                        flexWrap: 'wrap',
                                        marginBottom: '12px'
                                    }
                                },
                                    createElement(Button, {
                                        variant: selectedStyles.includes('marker') ? 'primary' : 'secondary',
                                        onClick: () => toggleStyle('marker'),
                                        disabled: isLoading,
                                        className: 'lw-ai-tone-btn',
                                        style: {
                                            fontSize: '13px',
                                            padding: '10px 16px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            background: selectedStyles.includes('marker')
                                                ? 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)'
                                                : 'rgba(255, 255, 255, 0.8)',
                                            color: selectedStyles.includes('marker') ? '#713f12' : '#475569',
                                            fontWeight: '600',
                                            boxShadow: selectedStyles.includes('marker')
                                                ? '0 4px 12px rgba(234, 179, 8, 0.3)'
                                                : '0 1px 3px rgba(0,0,0,0.08)',
                                            transition: 'all 0.2s ease'
                                        }
                                    }, '✨ マーカー'),
                                    createElement(Button, {
                                        variant: selectedStyles.includes('color-red') ? 'primary' : 'secondary',
                                        onClick: () => toggleStyle('color-red'),
                                        disabled: isLoading,
                                        className: 'lw-ai-tone-btn',
                                        style: {
                                            fontSize: '13px',
                                            padding: '10px 16px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            background: selectedStyles.includes('color-red')
                                                ? 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)'
                                                : 'rgba(255, 255, 255, 0.8)',
                                            color: selectedStyles.includes('color-red') ? '#7f1d1d' : '#475569',
                                            fontWeight: '600',
                                            boxShadow: selectedStyles.includes('color-red')
                                                ? '0 4px 12px rgba(220, 38, 38, 0.3)'
                                                : '0 1px 3px rgba(0,0,0,0.08)',
                                            transition: 'all 0.2s ease'
                                        }
                                    }, '🔴 赤文字'),
                                    createElement(Button, {
                                        variant: selectedStyles.includes('bold') ? 'primary' : 'secondary',
                                        onClick: () => toggleStyle('bold'),
                                        disabled: isLoading,
                                        className: 'lw-ai-tone-btn',
                                        style: {
                                            fontSize: '13px',
                                            padding: '10px 16px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            background: selectedStyles.includes('bold')
                                                ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                                                : 'rgba(255, 255, 255, 0.8)',
                                            color: selectedStyles.includes('bold') ? '#1f2937' : '#475569',
                                            fontWeight: selectedStyles.includes('bold') ? '800' : '600',
                                            boxShadow: selectedStyles.includes('bold')
                                                ? '0 4px 12px rgba(107, 114, 128, 0.3)'
                                                : '0 1px 3px rgba(0,0,0,0.08)',
                                            transition: 'all 0.2s ease'
                                        }
                                    }, '𝐁 太字')
                                ),
                                selectedStyles.length > 0 && createElement('div', {
                                    style: {
                                        fontSize: '12px',
                                        color: '#7c3aed',
                                        marginBottom: '12px',
                                        padding: '8px 12px',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        borderRadius: '8px',
                                        fontWeight: '600'
                                    }
                                }, `✓ 選択中: ${selectedStyles.map(s => {
                                    const names = { 'marker': 'マーカー', 'color-red': '赤文字', 'bold': '太字' };
                                    return names[s] || s;
                                }).join(' + ')}`),
                                createElement('div', {
                                    style: { display: 'flex', gap: '10px' }
                                },
                                    createElement(Button, {
                                        variant: 'primary',
                                        onClick: handleAutoHighlightExecute,
                                        disabled: isLoading || selectedStyles.length === 0,
                                        className: 'lw-ai-action-btn',
                                        style: {
                                            flex: 1,
                                            padding: '12px',
                                            fontSize: '14px',
                                            fontWeight: '700',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)'
                                        }
                                    },
                                        isLoading ? createElement(Spinner, { style: { margin: 0 } }) : '✨ 実行'
                                    ),
                                    selectedStyles.length > 0 && createElement(Button, {
                                        variant: 'secondary',
                                        onClick: () => setSelectedStyles([]),
                                        disabled: isLoading,
                                        style: {
                                            padding: '12px 20px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            borderRadius: '12px'
                                        }
                                    }, 'クリア')
                                )
                            ),

                            // セクション未選択時のヒント（新規生成モードでは表示しない）
                            !activeSection && textSource !== 'new' && createElement('div', {
                                style: {
                                    padding: '40px 24px',
                                    textAlign: 'center',
                                    background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: '16px',
                                    border: '2px dashed #cbd5e1'
                                }
                            },
                                createElement('div', {
                                    style: {
                                        fontSize: '32px',
                                        marginBottom: '12px'
                                    }
                                }, '👆'),
                                createElement('div', {
                                    style: {
                                        fontSize: '14px',
                                        color: '#64748b',
                                        fontWeight: '600'
                                    }
                                }, '上のボタンから機能を選択してください')
                            )
                        )
                    )
                )
            );
        };
    }, 'withAIToolbarButton');

    // フィルターを追加
    addFilter(
        'editor.BlockEdit',
        'lw-ai/text-toolbar-button',
        withAIToolbarButton
    );

    /**
     * スタイル変更を適用
     */
    function applyStyleChange(decoration, clientId) {
        const { className, style, dataAttributes } = decoration;

        log('[LW AI Text] Applying style:', decoration);

        if (!currentSelectionData || !currentSelectionData.range) {
            console.error('[LW AI Text] No selection data');
            return;
        }

        const savedRange = currentSelectionData.range;
        const savedText = currentSelectionData.selectedText;
        const savedClientId = currentSelectionData.clientId || clientId;

        // spanのクラスを構築
        let spanClass = 'custom-font-settings';
        if (className) {
            if (className.includes('custom-font-settings')) {
                spanClass = className;
            } else {
                spanClass += ' ' + className;
            }
        }

        const spanHtml = buildSpanHtml(spanClass, style, dataAttributes, savedText);
        log('[LW AI Text] Built span HTML:', spanHtml);

        // 現在のブロック状態を取得（最新の状態が必要）
        const currentBlock = select('core/block-editor').getBlock(savedClientId);
        log('[LW AI Text] Current block for style:', currentBlock);

        if (currentBlock) {
            const attributes = currentBlock.attributes;

            // テキスト属性を検索（優先順位順）
            const textAttrs = [
                'content', 'text', 'title', 'subtitle', 'description', 'heading', 'paragraph',
                'mainTitle', 'subTitle', 'leadText', 'buttonText', 'caption', 'label'
            ];

            for (const attrName of textAttrs) {
                if (attributes[attrName]) {
                    const attrString = getAttributeAsString(attributes[attrName]);
                    console.log(`[LW AI Text] Checking style for ${attrName}:`, attrString);

                    if (attrString && attrString.includes(savedText)) {
                        // HTMLタグ内のテキストも正しく置換するための処理
                        const newValue = replaceTextPreservingTags(attrString, savedText, spanHtml);
                        dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [attrName]: newValue });
                        log('[LW AI Text] Style applied via attribute:', attrName);
                        return;
                    }
                }
            }

            // 全属性を検索
            for (const [attrName, attrValue] of Object.entries(attributes)) {
                const attrString = getAttributeAsString(attrValue);
                if (attrString && attrString.includes(savedText)) {
                    const newValue = replaceTextPreservingTags(attrString, savedText, spanHtml);
                    dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [attrName]: newValue });
                    log('[LW AI Text] Style applied via attribute:', attrName);
                    return;
                }
            }
        }

        // フォールバック: DOM操作 + Gutenberg同期
        log('[LW AI Text] Using DOM fallback for style');
        try {
            const span = document.createElement('span');
            span.className = spanClass;
            if (style) span.setAttribute('style', style);
            if (dataAttributes && typeof dataAttributes === 'object') {
                Object.entries(dataAttributes).forEach(([key, value]) => {
                    if (value) span.setAttribute(`data-${key}`, value);
                });
            }
            span.textContent = savedText;

            savedRange.deleteContents();
            savedRange.insertNode(span);

            log('[LW AI Text] Style applied via DOM, syncing...');

            // Gutenbergと同期
            setTimeout(() => {
                syncBlockContent(savedClientId);
            }, 50);
        } catch (err) {
            console.error('[LW AI Text] DOM fallback error:', err);
        }
    }

    /**
     * 属性値を文字列として取得（RichTextData対応）
     */
    function getAttributeAsString(attrValue) {
        if (typeof attrValue === 'string') {
            return attrValue;
        }
        // RichTextData オブジェクトの場合
        if (attrValue && typeof attrValue === 'object') {
            // toHTMLString() メソッドがある場合（RichTextData）
            if (typeof attrValue.toHTMLString === 'function') {
                return attrValue.toHTMLString();
            }
            // toString() メソッドを試す
            if (typeof attrValue.toString === 'function' && attrValue.toString() !== '[object Object]') {
                return attrValue.toString();
            }
            // text プロパティがある場合
            if (attrValue.text) {
                return attrValue.text;
            }
            // originalHTML プロパティがある場合
            if (attrValue.originalHTML) {
                return attrValue.originalHTML;
            }
        }
        return null;
    }

    /**
     * テキスト変更を適用
     */
    function applyTextChange(newText, clientId) {
        log('[LW AI Text] Applying text change:', newText);
        log('[LW AI Text] clientId:', clientId);

        if (!currentSelectionData) {
            console.error('[LW AI Text] No selection data');
            return;
        }

        const originalText = currentSelectionData.selectedText;
        const savedClientId = currentSelectionData.clientId || clientId;

        log('[LW AI Text] Original text:', originalText);
        log('[LW AI Text] Saved clientId:', savedClientId);

        // 現在のブロック状態を取得（最新の状態が必要）
        const currentBlock = select('core/block-editor').getBlock(savedClientId);
        log('[LW AI Text] Current block:', currentBlock);

        if (!currentBlock) {
            console.error('[LW AI Text] Block not found');
            applyTextChangeDOMWithSync(originalText, newText, savedClientId);
            return;
        }

        const attributes = currentBlock.attributes;

        // 選択時に特定した属性名があれば、それを優先使用
        const targetAttribute = currentSelectionData.targetAttribute;
        if (targetAttribute && attributes[targetAttribute]) {
            const attrString = getAttributeAsString(attributes[targetAttribute]);
            console.log(`[LW AI Text] Using target attribute "${targetAttribute}":`, attrString);

            if (attrString) {
                let newValue;
                if (attrString.includes(originalText)) {
                    newValue = attrString.replace(originalText, newText);
                } else {
                    // 部分一致しない場合は全置換
                    newValue = newText;
                }
                dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [targetAttribute]: newValue });
                log('[LW AI Text] Text changed via target attribute:', targetAttribute);
                return;
            }
        }

        // targetAttributeがない場合は従来のテキスト検索（フォールバック）
        // テキスト属性を検索（優先順位順）
        const textAttrs = [
            'content', 'text', 'title', 'subtitle', 'description', 'heading', 'paragraph',
            'mainTitle', 'subTitle', 'leadText', 'buttonText', 'caption', 'label'
        ];

        for (const attrName of textAttrs) {
            if (attributes[attrName]) {
                const attrString = getAttributeAsString(attributes[attrName]);
                console.log(`[LW AI Text] Checking ${attrName}:`, attrString);

                if (attrString && attrString.includes(originalText)) {
                    const newValue = attrString.replace(originalText, newText);
                    dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [attrName]: newValue });
                    log('[LW AI Text] Text changed via attribute:', attrName);
                    return;
                }
            }
        }

        // 全属性を検索
        for (const [attrName, attrValue] of Object.entries(attributes)) {
            const attrString = getAttributeAsString(attrValue);
            if (attrString && attrString.includes(originalText)) {
                const newValue = attrString.replace(originalText, newText);
                dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [attrName]: newValue });
                log('[LW AI Text] Text changed via attribute:', attrName);
                return;
            }
        }

        log('[LW AI Text] Attribute search failed, trying DOM fallback with sync');
        applyTextChangeDOMWithSync(originalText, newText, savedClientId);
    }

    /**
     * DOM操作でテキスト変更を適用し、Gutenbergと同期
     */
    function applyTextChangeDOMWithSync(originalText, newText, clientId) {
        log('[LW AI Text] Attempting DOM text change with sync');

        if (!currentSelectionData || !currentSelectionData.range) {
            console.error('[LW AI Text] No selection range for DOM fallback');
            alert('テキストの更新に失敗しました');
            return;
        }

        try {
            const range = currentSelectionData.range;

            // DOM変更
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));

            // Gutenbergと同期するため、少し待ってからブロック内容を更新
            setTimeout(() => {
                syncBlockContent(clientId);
            }, 50);

            log('[LW AI Text] Text changed via DOM');
        } catch (err) {
            console.error('[LW AI Text] DOM text change error:', err);
            alert('テキストの更新に失敗しました');
        }
    }

    /**
     * DOMの内容をGutenbergブロックと同期
     */
    function syncBlockContent(clientId) {
        try {
            const blockElement = document.querySelector(`[data-block="${clientId}"]`);
            if (!blockElement) {
                log('[LW AI Text] Block element not found for sync');
                return;
            }

            // RichText要素を探す
            const richTextElement = blockElement.querySelector('.block-editor-rich-text__editable');
            if (richTextElement) {
                const newContent = richTextElement.innerHTML;
                log('[LW AI Text] Syncing content:', newContent);

                // content属性を更新
                dispatch('core/block-editor').updateBlockAttributes(clientId, { content: newContent });
                log('[LW AI Text] Block content synced');
            }
        } catch (err) {
            console.error('[LW AI Text] Sync error:', err);
        }
    }

    /**
     * span HTMLを構築
     */
    function buildSpanHtml(className, style, dataAttributes, text) {
        let attrs = `class="${className}"`;
        if (style) attrs += ` style="${style}"`;
        if (dataAttributes && typeof dataAttributes === 'object') {
            Object.entries(dataAttributes).forEach(([key, value]) => {
                if (value) attrs += ` data-${key}="${value}"`;
            });
        }
        return `<span ${attrs}>${text}</span>`;
    }

    /**
     * 自動マーカー付きHTMLを適用
     */
    function applyHighlightedHtml(highlightedHtml, clientId) {
        log('[LW AI Text] Applying highlighted HTML:', highlightedHtml);

        if (!currentSelectionData) {
            console.error('[LW AI Text] No selection data for highlight');
            return;
        }

        const savedClientId = currentSelectionData.clientId || clientId;
        const originalText = currentSelectionData.selectedText;

        // 現在のブロック状態を取得
        const currentBlock = select('core/block-editor').getBlock(savedClientId);

        if (!currentBlock) {
            console.error('[LW AI Text] Block not found for highlight');
            return;
        }

        const attributes = currentBlock.attributes;

        // 選択時に特定した属性名があれば、それを優先使用
        const targetAttribute = currentSelectionData.targetAttribute;
        if (targetAttribute && attributes[targetAttribute]) {
            dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [targetAttribute]: highlightedHtml });
            log('[LW AI Text] Highlighted HTML applied via target attribute:', targetAttribute);
            return;
        }

        // targetAttributeがない場合は従来のテキスト検索（フォールバック）
        // テキスト属性を検索（優先順位順）
        const textAttrs = [
            'content', 'text', 'title', 'subtitle', 'description', 'heading', 'paragraph',
            'mainTitle', 'subTitle', 'leadText', 'buttonText', 'caption', 'label'
        ];

        for (const attrName of textAttrs) {
            if (attributes[attrName]) {
                const attrString = getAttributeAsString(attributes[attrName]);

                if (attrString) {
                    // HTMLタグを除去したテキストで比較
                    const plainText = stripHtmlTags(attrString);
                    const originalPlainText = stripHtmlTags(originalText);
                    log('[LW AI Text] Comparing plain text:', plainText.substring(0, 50) + '...');
                    log('[LW AI Text] With original:', originalText.substring(0, 50) + '...');
                    log('[LW AI Text] Original plain text:', originalPlainText.substring(0, 50) + '...');

                    // 比較方法：
                    // 1. プレーンテキスト同士が一致
                    // 2. HTMLを含む文字列にオリジナルが含まれる
                    // 3. プレーンテキストにオリジナルのプレーンテキストが含まれる
                    if (plainText === originalPlainText ||
                        attrString.includes(originalText) ||
                        plainText.includes(originalPlainText)) {
                        // 元のテキストが完全一致する場合、またはHTMLタグ除去後に一致する場合
                        // 既存のHTMLを完全に置換
                        dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [attrName]: highlightedHtml });
                        log('[LW AI Text] Highlighted HTML applied via attribute:', attrName);
                        return;
                    }
                }
            }
        }

        // 全属性を検索
        for (const [attrName, attrValue] of Object.entries(attributes)) {
            const attrString = getAttributeAsString(attrValue);
            if (attrString) {
                const plainText = stripHtmlTags(attrString);
                const originalPlainText = stripHtmlTags(originalText);
                if (plainText === originalPlainText ||
                    attrString.includes(originalText) ||
                    plainText.includes(originalPlainText)) {
                    dispatch('core/block-editor').updateBlockAttributes(savedClientId, { [attrName]: highlightedHtml });
                    log('[LW AI Text] Highlighted HTML applied via attribute:', attrName);
                    return;
                }
            }
        }

        console.error('[LW AI Text] Could not apply highlighted HTML');
    }

    /**
     * HTMLタグを除去してプレーンテキストを取得
     */
    function stripHtmlTags(html) {
        if (!html) return '';
        // 一時的なdiv要素を使用してHTMLをパース
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    /**
     * HTMLタグを保持しながらテキストを置換
     * 既存のspan内のテキストも正しく置換できるようにする
     */
    function replaceTextPreservingTags(html, searchText, replacement) {
        // 単純な置換を試す（テキストがタグをまたがない場合）
        if (html.includes(searchText)) {
            // searchTextがタグの中にあるかチェック
            const tagPattern = /<[^>]*>/g;
            let result = '';
            let lastIndex = 0;
            let match;
            let textParts = [];
            let tagPositions = [];

            // タグの位置を記録
            while ((match = tagPattern.exec(html)) !== null) {
                if (match.index > lastIndex) {
                    textParts.push({
                        type: 'text',
                        content: html.substring(lastIndex, match.index),
                        start: lastIndex,
                        end: match.index
                    });
                }
                tagPositions.push({
                    type: 'tag',
                    content: match[0],
                    start: match.index,
                    end: match.index + match[0].length
                });
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < html.length) {
                textParts.push({
                    type: 'text',
                    content: html.substring(lastIndex),
                    start: lastIndex,
                    end: html.length
                });
            }

            // テキスト部分だけを結合して検索
            const textOnly = textParts.map(p => p.content).join('');

            // テキスト部分に検索文字列が含まれているか確認
            if (textOnly.includes(searchText)) {
                // 単一のテキスト部分内にある場合
                for (const part of textParts) {
                    if (part.content.includes(searchText)) {
                        // この部分のテキストを置換
                        return html.substring(0, part.start) +
                               part.content.replace(searchText, replacement) +
                               html.substring(part.end);
                    }
                }
            }
        }

        // フォールバック: 単純置換
        return html.replace(searchText, replacement);
    }

    log('[LW AI Text] Toolbar button registered');

})();
