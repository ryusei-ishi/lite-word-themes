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

        var _imageSource = useState('ai');
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

        // 構成案用のステート
        var _outline = useState(null);
        var outline = _outline[0];
        var setOutline = _outline[1];

        var _isGeneratingOutline = useState(false);
        var isGeneratingOutline = _isGeneratingOutline[0];
        var setIsGeneratingOutline = _isGeneratingOutline[1];

        // 構成案テキスト（ユーザーが編集可能）
        var _outlineText = useState('');
        var outlineText = _outlineText[0];
        var setOutlineText = _outlineText[1];

        // ヒアリング用のステート
        var _interviewQuestions = useState([]);
        var interviewQuestions = _interviewQuestions[0];
        var setInterviewQuestions = _interviewQuestions[1];

        var _interviewAnswers = useState({});
        var interviewAnswers = _interviewAnswers[0];
        var setInterviewAnswers = _interviewAnswers[1];

        var _isGeneratingInterview = useState(false);
        var isGeneratingInterview = _isGeneratingInterview[0];
        var setIsGeneratingInterview = _isGeneratingInterview[1];

        var _isGeneratingSampleAnswers = useState(false);
        var isGeneratingSampleAnswers = _isGeneratingSampleAnswers[0];
        var setIsGeneratingSampleAnswers = _isGeneratingSampleAnswers[1];

        // ページタイプ選択用のステート
        var _selectedPageType = useState(null);
        var selectedPageType = _selectedPageType[0];
        var setSelectedPageType = _selectedPageType[1];

        // セクション生成進捗用のステート
        var _sectionProgress = useState({ current: 0, total: 0, sectionName: '' });
        var sectionProgress = _sectionProgress[0];
        var setSectionProgress = _sectionProgress[1];

        // パーツプレビュー用のステート
        var _partsPreviewData = useState(null);
        var partsPreviewData = _partsPreviewData[0];
        var setPartsPreviewData = _partsPreviewData[1];

        // 順次生成用：現在プレビュー中のセクションインデックス
        var _currentPreviewIndex = useState(0);
        var currentPreviewIndex = _currentPreviewIndex[0];
        var setCurrentPreviewIndex = _currentPreviewIndex[1];

        // 順次生成用：生成済みセクション数
        var _generatedSectionCount = useState(0);
        var generatedSectionCount = _generatedSectionCount[0];
        var setGeneratedSectionCount = _generatedSectionCount[1];

        var _isSelectingParts = useState(false);
        var isSelectingParts = _isSelectingParts[0];
        var setIsSelectingParts = _isSelectingParts[1];

        // 構成案のセクション配列（エディタ用）
        var _outlineSections = useState([]);
        var outlineSections = _outlineSections[0];
        var setOutlineSections = _outlineSections[1];

        // 保存した構成案用のステート
        var _savedOutlines = useState([]);
        var savedOutlines = _savedOutlines[0];
        var setSavedOutlines = _savedOutlines[1];

        var _isLoadingSavedOutlines = useState(false);
        var isLoadingSavedOutlines = _isLoadingSavedOutlines[0];
        var setIsLoadingSavedOutlines = _isLoadingSavedOutlines[1];

        var _isSavingOutline = useState(false);
        var isSavingOutline = _isSavingOutline[0];
        var setIsSavingOutline = _isSavingOutline[1];

        // 最終レビュー用のステート
        var _isReviewing = useState(false);
        var isReviewing = _isReviewing[0];
        var setIsReviewing = _isReviewing[1];

        var _generatedBlocks = useState([]);
        var generatedBlocks = _generatedBlocks[0];
        var setGeneratedBlocks = _generatedBlocks[1];

        var _reviewResult = useState(null);
        var reviewResult = _reviewResult[0];
        var setReviewResult = _reviewResult[1];

        useEffect(function() {
            if (!isOpen) {
                setError(null);
                setGeneratedJson('');
                setCurrentMode('select');
                setTypoResults(null);
                setMinimized(false);
                setOutline(null);
                setOutlineText('');
                setInterviewQuestions([]);
                setInterviewAnswers({});
                setSelectedPageType(null);
                setAiPrompt('');
                setPartsPreviewData(null);
                setOutlineSections([]);
                setCurrentPreviewIndex(0);
                setGeneratedSectionCount(0);
            }
        }, [isOpen]);

        // 保存した構成案一覧を取得
        function handleLoadSavedOutlines() {
            setIsLoadingSavedOutlines(true);
            setError(null);

            fetch(lwAiGeneratorData.restUrl + 'saved-outlines', {
                method: 'GET',
                headers: { 'X-WP-Nonce': lwAiGeneratorData.restNonce }
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    setSavedOutlines(data.outlines || []);
                    setCurrentMode('saved-outlines');
                } else {
                    setError(data.message || '保存した構成案の取得に失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); })
            .finally(function() { setIsLoadingSavedOutlines(false); });
        }

        // 保存した構成案を選択して読み込み
        function handleSelectSavedOutline(savedOutline) {
            // 保存データからステートを復元
            setOutline(savedOutline.outline || null);
            setOutlineText(savedOutline.outlineText || '');
            setSelectedPageType(savedOutline.pageType || null);
            setAiPrompt(savedOutline.prompt || '');
            setInterviewAnswers(savedOutline.interviewAnswers || {});

            // パーツデータがある場合はパーツプレビュー画面へ直接遷移
            if (savedOutline.partsData && savedOutline.partsData.length > 0) {
                setPartsPreviewData(savedOutline.partsData);
                setCurrentMode('parts-preview');
            } else {
                setCurrentMode('outline-preview');
            }
        }

        // 現在の構成案を保存
        function handleSaveOutline() {
            if (!outline || !outline.sections) {
                setError('保存する構成案がありません');
                return;
            }

            var outlineName = prompt('構成案の名前を入力してください（例: 美容室トップページ）');
            if (!outlineName || !outlineName.trim()) {
                return; // キャンセル
            }

            setIsSavingOutline(true);
            setError(null);

            fetch(lwAiGeneratorData.restUrl + 'saved-outlines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({
                    name: outlineName.trim(),
                    outline: outline,
                    outlineText: outlineText,
                    pageType: selectedPageType,
                    prompt: aiPrompt,
                    interviewAnswers: interviewAnswers
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    alert('構成案を保存しました');
                } else {
                    setError(data.message || '保存に失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); })
            .finally(function() { setIsSavingOutline(false); });
        }

        // 現在の構成案とパーツデータを保存
        function handleSaveWithParts() {
            if (!outline || !outline.sections) {
                setError('保存する構成案がありません');
                return;
            }
            if (!partsPreviewData || partsPreviewData.length === 0) {
                setError('保存するパーツデータがありません');
                return;
            }

            var outlineName = prompt('構成案の名前を入力してください（例: 美容室トップページ）\n※パーツ選択も一緒に保存されます');
            if (!outlineName || !outlineName.trim()) {
                return; // キャンセル
            }

            setIsSavingOutline(true);
            setError(null);

            fetch(lwAiGeneratorData.restUrl + 'saved-outlines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({
                    name: outlineName.trim(),
                    outline: outline,
                    outlineText: outlineText,
                    pageType: selectedPageType,
                    prompt: aiPrompt,
                    interviewAnswers: interviewAnswers,
                    partsData: partsPreviewData
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    alert('構成案とパーツデータを保存しました');
                } else {
                    setError(data.message || '保存に失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); })
            .finally(function() { setIsSavingOutline(false); });
        }

        // 保存した構成案を削除
        function handleDeleteSavedOutline(outlineId) {
            if (!confirm('この構成案を削除しますか？')) {
                return;
            }

            fetch(lwAiGeneratorData.restUrl + 'saved-outlines/' + outlineId, {
                method: 'DELETE',
                headers: { 'X-WP-Nonce': lwAiGeneratorData.restNonce }
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    // リストから削除
                    setSavedOutlines(savedOutlines.filter(function(o) { return o.id !== outlineId; }));
                } else {
                    setError(data.message || '削除に失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); });
        }

        // ヒアリング質問を生成
        function handleGenerateInterview() {
            if (!aiPrompt.trim()) {
                setError('リクエスト内容を入力してください');
                return;
            }
            if (!lwAiGeneratorData.hasApiKey) {
                setError('Gemini APIキーが設定されていません');
                return;
            }

            setIsGeneratingInterview(true);
            setError(null);

            console.log('[LW AI Debug] ヒアリング生成リクエスト:', { prompt: aiPrompt });

            fetch(lwAiGeneratorData.restUrl + 'generate-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({ prompt: aiPrompt })
            })
            .then(function(r) {
                console.log('[LW AI Debug] ヒアリング生成レスポンスステータス:', r.status, r.statusText);
                return r.text();
            })
            .then(function(text) {
                console.log('[LW AI Debug] ヒアリング生成生レスポンス:', text.substring(0, 500));
                return JSON.parse(text);
            })
            .then(function(data) {
                console.log('[LW AI Debug] ヒアリング生成パース済み:', data);
                if (data.success && data.questions) {
                    setInterviewQuestions(data.questions);
                    setInterviewAnswers({});
                    setCurrentMode('interview');
                } else {
                    setError(data.message || 'ヒアリング質問の生成に失敗しました');
                }
            })
            .catch(function(err) {
                console.error('[LW AI Debug] ヒアリング生成エラー:', err);
                setError('APIエラー: ' + err.message);
            })
            .finally(function() { setIsGeneratingInterview(false); });
        }

        // ヒアリング回答を送信して構成案を生成
        function handleSubmitInterview() {
            // 回答をテキスト形式に変換
            var answersText = interviewQuestions.map(function(q) {
                var answer = interviewAnswers[q.id] || '';
                return '【' + q.question + '】\n' + (answer || '（未回答）');
            }).join('\n\n');

            setIsGeneratingOutline(true);
            setError(null);

            console.log('[LW AI Debug] 構成案生成リクエスト:', { prompt: aiPrompt, interviewAnswers: answersText.substring(0, 200) + '...' });

            fetch(lwAiGeneratorData.restUrl + 'generate-outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({ prompt: aiPrompt, interviewAnswers: answersText, pageType: selectedPageType })
            })
            .then(function(r) {
                console.log('[LW AI Debug] 構成案生成レスポンスステータス:', r.status, r.statusText);
                return r.text();
            })
            .then(function(text) {
                console.log('[LW AI Debug] 構成案生成生レスポンス:', text.substring(0, 500));
                return JSON.parse(text);
            })
            .then(function(data) {
                console.log('[LW AI Debug] 構成案生成パース済み:', data);
                if (data.success && data.outline) {
                    console.log('[LW AI Debug] アウトラインをセット中...');
                    setOutline(data.outline);
                    try {
                        var textContent = outlineToText(data.outline);
                        console.log('[LW AI Debug] outlineToText成功、長さ:', textContent.length);
                        setOutlineText(textContent);
                        console.log('[LW AI Debug] outline-previewモードに切り替え中...');
                        setCurrentMode('outline-preview');
                        console.log('[LW AI Debug] モード切り替え完了');
                    } catch (e) {
                        console.error('[LW AI Debug] outlineToTextエラー:', e);
                        setError('構成案の変換に失敗しました: ' + e.message);
                    }
                } else {
                    // デバッグ: 詳細情報を表示
                    if (data.debug_raw_output) {
                        console.error('[LW AI Debug] Gemini生レスポンス (先頭1000文字):', data.debug_raw_output);
                    }
                    if (data.debug_json_length) {
                        console.error('[LW AI Debug] JSONの長さ:', data.debug_json_length, '文字');
                    }
                    if (data.debug_json_end) {
                        console.error('[LW AI Debug] JSON末尾:', data.debug_json_end);
                    }
                    setError(data.message || '構成案の生成に失敗しました');
                }
            })
            .catch(function(err) {
                console.error('[LW AI Debug] 構成案生成エラー:', err);
                setError('APIエラー: ' + err.message);
            })
            .finally(function() { setIsGeneratingOutline(false); });
        }

        // ヒアリング回答を更新
        function handleUpdateAnswer(questionId, value) {
            setInterviewAnswers(function(prev) {
                var newAnswers = Object.assign({}, prev);
                newAnswers[questionId] = value;
                return newAnswers;
            });
        }

        // サンプル回答を自動生成（サービス名を基準に他の質問を埋める）
        function handleGenerateSampleAnswers() {
            if (interviewQuestions.length === 0) return;

            // 最初の質問（サービス名）を取得
            var firstQuestionId = interviewQuestions[0].id;
            var serviceName = interviewAnswers[firstQuestionId] || '';

            if (!serviceName.trim()) {
                setError('まずサービス名を入力してください');
                return;
            }

            setIsGeneratingSampleAnswers(true);
            setError(null);

            // 2番目以降の質問リストをテキストに変換
            var questionsText = interviewQuestions.slice(1).map(function(q, i) {
                var questionLabel = q.label || q.question || '';
                return (i + 1) + '. ' + questionLabel;
            }).join('\n');

            fetch(lwAiGeneratorData.restUrl + 'generate-sample-answers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    serviceName: serviceName,
                    questions: questionsText,
                    pageType: selectedPageType || 'lp'
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.answers) {
                    // 回答をセット（サービス名は保持）
                    var newAnswers = {};
                    newAnswers[firstQuestionId] = serviceName; // サービス名は保持
                    interviewQuestions.slice(1).forEach(function(q, i) {
                        if (data.answers[i]) {
                            newAnswers[q.id] = data.answers[i];
                        }
                    });
                    setInterviewAnswers(newAnswers);
                } else {
                    setError(data.message || 'サンプル回答の生成に失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); })
            .finally(function() { setIsGeneratingSampleAnswers(false); });
        }

        // 構成案を生成（ヒアリングをスキップして直接生成）
        function handleGenerateOutline() {
            if (!aiPrompt.trim()) {
                setError('リクエスト内容を入力してください');
                return;
            }
            if (!lwAiGeneratorData.hasApiKey) {
                setError('Gemini APIキーが設定されていません');
                return;
            }

            setIsGeneratingOutline(true);
            setError(null);

            fetch(lwAiGeneratorData.restUrl + 'generate-outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({ prompt: aiPrompt, pageType: selectedPageType })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.outline) {
                    setOutline(data.outline);
                    // JSONを読みやすいテキストに変換
                    var textContent = outlineToText(data.outline);
                    setOutlineText(textContent);
                    setCurrentMode('outline-preview');
                } else {
                    setError(data.message || '構成案の生成に失敗しました');
                }
            })
            .catch(function(err) { setError('APIエラー: ' + err.message); })
            .finally(function() { setIsGeneratingOutline(false); });
        }

        // 構成案テキストをセクションに分割
        function parseOutlineToSections(text) {
            var sections = [];
            var businessType = '';

            // 業種を抽出
            var businessMatch = text.match(/【業種】\s*\n([^\n]+)/);
            if (businessMatch) {
                businessType = businessMatch[1].trim();
            }

            // セクション区切り「================」で分割
            var parts = text.split(/={5,}/);

            var currentSection = null;
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].trim();
                if (!part) continue;

                // 【業種】は除外
                if (part.indexOf('【業種】') === 0) continue;

                // 【〇〇】で始まる場合はセクションタイトル
                var sectionMatch = part.match(/^【([^】]+)】/);
                if (sectionMatch) {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        name: sectionMatch[1],
                        content: part
                    };
                } else if (currentSection) {
                    // 前のセクションの続き
                    currentSection.content += '\n' + part;
                }
            }

            // 最後のセクションを追加
            if (currentSection) {
                sections.push(currentSection);
            }

            return { sections: sections, businessType: businessType };
        }

        // パーツ選択を実行（構成案からパーツプレビューへ）
        // 全セクションを順次処理してからパーツプレビュー画面へ
        async function handleSelectParts() {
            if (!outline || !outline.sections) {
                setError('構成案データがありません');
                return;
            }

            var totalSections = outline.sections.length;
            console.log('[LW AI Debug] パーツ選択開始: ' + totalSections + 'セクション');

            setIsSelectingParts(true);
            setError(null);
            setCurrentPreviewIndex(0);
            setGeneratedSectionCount(0);

            var businessType = outline.businessType || '';
            var allPartsData = [];

            try {
                // 全セクションを順次処理
                for (var i = 0; i < totalSections; i++) {
                    var section = outline.sections[i];
                    var sectionLabel = getSectionLabel(section.type);

                    // 進捗表示を更新
                    setSectionProgress({
                        current: i + 1,
                        total: totalSections,
                        sectionName: sectionLabel + '（パーツ選択中...）',
                        phase: 'selecting'
                    });

                    console.log('[LW AI Debug] パーツ選択: セクション ' + (i + 1) + '/' + totalSections + ' ' + sectionLabel);

                    var sectionForApi = [{
                        type: section.type,
                        content: JSON.stringify(section)
                    }];

                    var response = await fetch(lwAiGeneratorData.restUrl + 'select-parts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                        body: JSON.stringify({
                            sections: sectionForApi,
                            businessType: businessType
                        })
                    });

                    var data = await response.json();

                    if (data.success && data.sections && data.sections.length > 0) {
                        allPartsData.push(data.sections[0]);
                    } else {
                        throw new Error('セクション「' + sectionLabel + '」のパーツ選択に失敗しました');
                    }
                }

                // 全セクション完了
                console.log('[LW AI Debug] パーツ選択完了: ' + allPartsData.length + 'セクション');
                setPartsPreviewData(allPartsData);
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
                setCurrentMode('parts-preview');

            } catch (err) {
                console.error('[LW AI Debug] パーツ選択エラー:', err);
                setError(err.message || 'パーツ選択中にエラーが発生しました');
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
            } finally {
                setIsSelectingParts(false);
            }
        }

        // 指定インデックスのセクションのパーツを選択（順次処理用）
        function handleSelectSectionParts(sectionIndex) {
            if (!outline || !outline.sections || sectionIndex >= outline.sections.length) {
                return Promise.reject(new Error('セクションが見つかりません'));
            }

            var section = outline.sections[sectionIndex];
            var sectionsForApi = [{
                type: section.type,
                content: JSON.stringify(section)
            }];

            return fetch(lwAiGeneratorData.restUrl + 'select-parts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({
                    sections: sectionsForApi,
                    businessType: outline.businessType || ''
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.sections && data.sections.length > 0) {
                    // partsPreviewDataの該当インデックスを更新
                    var newData = partsPreviewData.map(function(s, i) {
                        if (i === sectionIndex) {
                            return data.sections[0];
                        }
                        return s;
                    });
                    setPartsPreviewData(newData);
                    return data.sections[0];
                } else {
                    throw new Error(data.message || 'パーツ選択に失敗しました');
                }
            });
        }

        // パーツを切り替え
        function handleSwitchPart(sectionIndex, newPartName) {
            if (!partsPreviewData || !partsPreviewData[sectionIndex]) {
                return;
            }

            var section = partsPreviewData[sectionIndex];

            // ローディング状態を設定（その行だけ）
            var updatedData = partsPreviewData.map(function(s, i) {
                if (i === sectionIndex) {
                    return Object.assign({}, s, { isLoading: true });
                }
                return s;
            });
            setPartsPreviewData(updatedData);

            fetch(lwAiGeneratorData.restUrl + 'switch-part', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                body: JSON.stringify({
                    sectionType: section.type,
                    newPart: newPartName,
                    originalContent: JSON.stringify(outline.sections[sectionIndex]),
                    businessType: outline.businessType || ''
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    // 該当セクションを更新
                    var newData = partsPreviewData.map(function(s, i) {
                        if (i === sectionIndex) {
                            return {
                                type: s.type,
                                selectedPart: data.selectedPart,
                                partType: data.partType,
                                partDescription: data.partDescription,
                                availableParts: s.availableParts,
                                optimizedContent: data.optimizedContent,
                                isLoading: false
                            };
                        }
                        return s;
                    });
                    setPartsPreviewData(newData);
                } else {
                    setError(data.message || 'パーツ切り替えに失敗しました');
                    // エラー時はローディングを解除
                    var revertData = partsPreviewData.map(function(s, i) {
                        if (i === sectionIndex) {
                            return Object.assign({}, s, { isLoading: false });
                        }
                        return s;
                    });
                    setPartsPreviewData(revertData);
                }
            })
            .catch(function(err) {
                setError('APIエラー: ' + err.message);
                var revertData = partsPreviewData.map(function(s, i) {
                    if (i === sectionIndex) {
                        return Object.assign({}, s, { isLoading: false });
                    }
                    return s;
                });
                setPartsPreviewData(revertData);
            });
        }

        // パーツプレビューからページ生成を実行（セッションベース）
        async function handleGenerateFromParts(selectedImageSource) {
            if (!partsPreviewData || partsPreviewData.length === 0) {
                setError('パーツデータがありません');
                return;
            }

            var imgSource = selectedImageSource || 'none';

            setIsGenerating(true);
            setError(null);
            setGeneratedJson('');
            setGeneratedBlocks([]);
            setReviewResult(null);

            var businessType = outline ? (outline.businessType || '') : '';
            var totalSteps = partsPreviewData.length + 1;
            var currentSessionId = null;

            try {
                // ★セッション作成
                setSectionProgress({ current: 0, total: totalSteps, sectionName: 'セッション準備中...' });

                var postId = 0;
                try { postId = wp.data.select('core/editor').getCurrentPostId() || 0; } catch(e) {}

                var sessionResponse = await fetch(lwAiGeneratorData.restUrl + 'sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                    body: JSON.stringify({
                        postId: postId,
                        pageType: selectedPageType || 'lp',
                        businessType: businessType,
                        prompt: aiPrompt || '',
                        interviewAnswers: interviewAnswers || {},
                        outline: outline || { sections: partsPreviewData },
                        outlineText: outlineText || '',
                        imageSource: imgSource
                    })
                });
                var sessionData = await sessionResponse.json();

                if (!sessionData.success) {
                    throw new Error('セッション作成に失敗: ' + (sessionData.message || '不明なエラー'));
                }

                currentSessionId = sessionData.sessionId;
                var allBlocks = [];

                // ★各セクションを順番にセッションAPIで生成
                for (var i = 0; i < partsPreviewData.length; i++) {
                    var section = partsPreviewData[i];
                    var sectionLabel = getSectionLabel(section.type);
                    var progressName = sectionLabel;
                    if (imgSource === 'ai') {
                        progressName += '（AI画像生成中...時間がかかります）';
                    }
                    setSectionProgress({ current: i + 1, total: totalSteps, sectionName: progressName });

                    var selectedPart = section.selectedPart || '';
                    var selectedPartType = '';
                    if (selectedPart) {
                        selectedPartType = (selectedPart.indexOf('wdl/') === 0 || selectedPart.indexOf('paid-block-') === 0) ? 'block' : 'template';
                    }

                    var controller = new AbortController();
                    var timeoutId = setTimeout(function() { controller.abort(); }, 600000);

                    var response;
                    try {
                        response = await fetch(
                            lwAiGeneratorData.restUrl + 'sessions/' + currentSessionId + '/sections/' + i + '/generate',
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                                body: JSON.stringify({
                                    selectedPart: selectedPart,
                                    selectedPartType: selectedPartType
                                }),
                                signal: controller.signal
                            }
                        );
                        clearTimeout(timeoutId);
                    } catch (fetchErr) {
                        clearTimeout(timeoutId);
                        if (fetchErr.name === 'AbortError') {
                            throw new Error('セクション「' + sectionLabel + '」の生成がタイムアウトしました（セッションID: ' + currentSessionId + ' から再開可能）');
                        }
                        throw fetchErr;
                    }

                    var result = await response.json();

                    if (!result.success) {
                        throw new Error('セクション「' + sectionLabel + '」の生成に失敗: ' + (result.message || '不明なエラー'));
                    }

                    if (result.blocks && result.blocks.length > 0) {
                        allBlocks = allBlocks.concat(result.blocks);
                    }
                }

                // レビューフェーズ
                setSectionProgress({ current: totalSteps, total: totalSteps, sectionName: '最終チェック中...' });

                var reviewResponse = await fetch(lwAiGeneratorData.restUrl + 'review-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                    body: JSON.stringify({ blocks: allBlocks })
                });
                var reviewResult = await reviewResponse.json();

                if (reviewResult.success && reviewResult.blocks) {
                    allBlocks = reviewResult.blocks;
                }

                // ブロックを挿入
                for (var j = 0; j < allBlocks.length; j++) {
                    var block = allBlocks[j];
                    var blockName = block.name || block.blockName;
                    if (!blockName) continue;

                    var createdBlock = wp.blocks.createBlock(blockName, block.attributes || {}, (block.innerBlocks || []).map(function mapInnerBlock(ib) {
                        var ibName = ib.name || ib.blockName;
                        if (!ibName) return null;
                        return wp.blocks.createBlock(ibName, ib.attributes || {}, (ib.innerBlocks || []).map(mapInnerBlock).filter(Boolean));
                    }).filter(Boolean));

                    wp.data.dispatch('core/block-editor').insertBlock(createdBlock);
                }

                setIsGenerating(false);
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
                onClose();

            } catch (err) {
                console.error('[LW AI Debug] エラー:', err);
                var errorMsg = err.message || 'ページ生成中にエラーが発生しました';
                if (currentSessionId) {
                    errorMsg += '\n\nセッションID: ' + currentSessionId + ' から再開できます。';
                }
                setError(errorMsg);
                setIsGenerating(false);
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
            }
        }

        // 順次生成：1セクションだけ生成してエディタに挿入
        async function handleGenerateSingleSection() {
            if (!partsPreviewData || partsPreviewData.length === 0) {
                setError('パーツデータがありません');
                return;
            }

            var section = partsPreviewData[currentPreviewIndex];
            if (!section) {
                setError('セクションデータがありません');
                return;
            }

            setIsGenerating(true);
            setError(null);

            // isPendingの場合は先にパーツ選択を実行
            if (section.isPending) {
                console.log('[LW AI Debug] 順次生成: セクション ' + currentPreviewIndex + ' のパーツ選択を実行');
                setSectionProgress({ current: 1, total: 1, sectionName: getSectionLabel(section.type) + '（パーツ選択中...）' });
                try {
                    section = await handleSelectSectionParts(currentPreviewIndex);
                } catch (err) {
                    setError('パーツ選択に失敗しました: ' + err.message);
                    setIsGenerating(false);
                    setSectionProgress({ current: 0, total: 0, sectionName: '' });
                    return;
                }
            }

            var sectionLabel = getSectionLabel(section.type);
            console.log('[LW AI Debug] 順次生成: セクション ' + currentPreviewIndex + ' (' + sectionLabel + ') 生成開始');

            setSectionProgress({ current: 1, total: 1, sectionName: sectionLabel + (imageSource === 'ai' ? '（AI画像生成中...）' : '') });

            try {
                var businessType = outline.businessType || '';

                // セクションテキストを構築
                var content = section.optimizedContent || {};
                var lines = ['【' + sectionLabel + '】'];
                Object.keys(content).forEach(function(key) {
                    var value = content[key];
                    if (Array.isArray(value)) {
                        lines.push(key + ':');
                        value.forEach(function(item, idx) {
                            if (typeof item === 'object') {
                                lines.push('  ' + (idx + 1) + '. ' + JSON.stringify(item));
                            } else {
                                lines.push('  ' + (idx + 1) + '. ' + item);
                            }
                        });
                    } else if (typeof value === 'object') {
                        lines.push(key + ': ' + JSON.stringify(value));
                    } else {
                        lines.push(key + ': ' + value);
                    }
                });
                var sectionText = lines.join('\n');

                // パーツタイプを判定
                var selectedPart = section.selectedPart || '';
                var selectedPartType = '';
                if (selectedPart) {
                    if (selectedPart.indexOf('wdl/') === 0 || selectedPart.indexOf('paid-block-') === 0) {
                        selectedPartType = 'block';
                    } else {
                        selectedPartType = 'template';
                    }
                }

                var requestBody = {
                    sectionText: sectionText,
                    sectionIndex: currentPreviewIndex,
                    totalSections: partsPreviewData.length,
                    imageSource: imageSource,
                    businessType: businessType,
                    selectedPart: selectedPart,
                    selectedPartType: selectedPartType
                };

                console.log('[LW AI Debug] 順次生成 APIリクエスト:', requestBody);

                // APIを呼び出し
                var controller = new AbortController();
                var timeoutId = setTimeout(function() {
                    controller.abort();
                }, 300000); // 5分タイムアウト

                var response;
                try {
                    response = await fetch(lwAiGeneratorData.restUrl + 'generate-section', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                        body: JSON.stringify(requestBody),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                } catch (fetchErr) {
                    clearTimeout(timeoutId);
                    if (fetchErr.name === 'AbortError') {
                        throw new Error('セクション「' + sectionLabel + '」の生成がタイムアウトしました');
                    }
                    throw fetchErr;
                }

                var result = await response.json();

                if (!result.success) {
                    throw new Error('セクション「' + sectionLabel + '」の生成に失敗: ' + (result.message || '不明なエラー'));
                }

                console.log('[LW AI Debug] 順次生成: セクション ' + currentPreviewIndex + ' 生成完了:', result.blocks);

                // 生成されたブロックをエディタに挿入
                if (result.blocks && result.blocks.length > 0) {
                    for (var j = 0; j < result.blocks.length; j++) {
                        var block = result.blocks[j];
                        var blockName = block.name || block.blockName;
                        if (!blockName) continue;

                        var createdBlock = wp.blocks.createBlock(blockName, block.attributes || {}, (block.innerBlocks || []).map(function mapInnerBlock(ib) {
                            var ibName = ib.name || ib.blockName;
                            if (!ibName) return null;
                            return wp.blocks.createBlock(ibName, ib.attributes || {}, (ib.innerBlocks || []).map(mapInnerBlock).filter(Boolean));
                        }).filter(Boolean));

                        wp.data.dispatch('core/block-editor').insertBlock(createdBlock);
                    }
                    console.log('[LW AI Debug] 順次生成: ブロック挿入完了');
                }

                // 生成完了：次のセクションへ or 完了
                var newGeneratedCount = generatedSectionCount + 1;
                setGeneratedSectionCount(newGeneratedCount);
                setIsGenerating(false);
                setSectionProgress({ current: 0, total: 0, sectionName: '' });

                if (currentPreviewIndex < partsPreviewData.length - 1) {
                    // 次のセクションへ
                    setCurrentPreviewIndex(currentPreviewIndex + 1);
                } else {
                    // 全セクション完了
                    console.log('[LW AI Debug] 順次生成: 全セクション完了');
                    onClose();
                }

            } catch (err) {
                console.error('[LW AI Debug] 順次生成エラー:', err);
                setError(err.message || 'セクション生成中にエラーが発生しました');
                setIsGenerating(false);
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
            }
        }

        // 全セクション自動生成（ユーザー操作不要で全て順次処理）
        async function handleGenerateAllAutomatic() {
            if (!outline || !outline.sections || outline.sections.length === 0) {
                setError('構成案データがありません');
                return;
            }

            var totalSections = outline.sections.length;
            console.log('[LW AI Debug] セッションベース全自動生成開始: ' + totalSections + 'セクション');

            setIsGenerating(true);
            setError(null);
            setCurrentMode('auto-generating');

            var businessType = outline.businessType || '';
            var generatedCount = 0;
            var currentSessionId = null;

            try {
                // ★ステップ0: セッション作成（outlineをDBに保存）
                setSectionProgress({
                    current: 0, total: totalSections,
                    sectionName: 'セッション準備中...', phase: 'init'
                });

                var postId = 0;
                try { postId = wp.data.select('core/editor').getCurrentPostId() || 0; } catch(e) {}

                var sessionResponse = await fetch(lwAiGeneratorData.restUrl + 'sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                    body: JSON.stringify({
                        postId: postId,
                        pageType: selectedPageType || 'lp',
                        businessType: businessType,
                        prompt: aiPrompt || '',
                        interviewAnswers: interviewAnswers || {},
                        outline: outline,
                        outlineText: outlineText || '',
                        imageSource: imageSource || 'none'
                    })
                });
                var sessionData = await sessionResponse.json();

                if (!sessionData.success) {
                    throw new Error('セッション作成に失敗: ' + (sessionData.message || '不明なエラー'));
                }

                currentSessionId = sessionData.sessionId;
                console.log('[LW AI Debug] セッション作成完了: ID=' + currentSessionId);

                // ★各セクションを順番に生成（前後文脈はバックエンドが自動構築）
                for (var i = 0; i < totalSections; i++) {
                    var outlineSection = outline.sections[i];
                    var sectionLabel = getSectionLabel(outlineSection.type);

                    // ステップ1: パーツ選択
                    setSectionProgress({
                        current: i + 1, total: totalSections,
                        sectionName: sectionLabel + '（パーツ選択中...）', phase: 'selecting'
                    });

                    var sectionForApi = [{
                        type: outlineSection.type,
                        content: JSON.stringify(outlineSection)
                    }];

                    var selectResponse = await fetch(lwAiGeneratorData.restUrl + 'select-parts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                        body: JSON.stringify({ sections: sectionForApi, businessType: businessType })
                    });
                    var selectData = await selectResponse.json();

                    if (!selectData.success || !selectData.sections || selectData.sections.length === 0) {
                        throw new Error('セクション「' + sectionLabel + '」のパーツ選択に失敗しました');
                    }

                    var selectedSection = selectData.sections[0];

                    // AIがパーツを選べず既定のパーツで代替された場合は、そのことを伝える。
                    // 従来はこの error を読み捨てていたため、
                    // 「業種を変えても毎回同じレイアウトになる」原因が誰にも見えなかった。
                    if (selectedSection.usedFallback) {
                        console.warn(
                            'LiteWord AI: セクション「' + sectionLabel + '」はAIがパーツを選べず、' +
                            '既定のパーツ（' + (selectedSection.selectedPart || '不明') + '）を使いました。理由: ' +
                            (selectedSection.fallbackReason || '不明')
                        );
                    }

                    var selectedPart = selectedSection.selectedPart || '';
                    var selectedPartType = '';
                    if (selectedPart) {
                        selectedPartType = (selectedPart.indexOf('wdl/') === 0 || selectedPart.indexOf('paid-block-') === 0) ? 'block' : 'template';
                    }

                    // ステップ2: セッションAPIでセクション生成（★前後文脈付き）
                    var progressName = sectionLabel + '（生成中...）';
                    if (imageSource === 'ai') {
                        progressName = sectionLabel + '（AI画像生成中...時間がかかります）';
                    }
                    setSectionProgress({
                        current: i + 1, total: totalSections,
                        sectionName: progressName, phase: 'generating'
                    });

                    var controller = new AbortController();
                    var timeoutId = setTimeout(function() { controller.abort(); }, 300000);

                    var generateResponse;
                    try {
                        generateResponse = await fetch(
                            lwAiGeneratorData.restUrl + 'sessions/' + currentSessionId + '/sections/' + i + '/generate',
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                                body: JSON.stringify({
                                    selectedPart: selectedPart,
                                    selectedPartType: selectedPartType
                                }),
                                signal: controller.signal
                            }
                        );
                        clearTimeout(timeoutId);
                    } catch (fetchErr) {
                        clearTimeout(timeoutId);
                        if (fetchErr.name === 'AbortError') {
                            throw new Error('セクション「' + sectionLabel + '」の生成がタイムアウトしました（セッションID: ' + currentSessionId + ' から再開可能）');
                        }
                        throw fetchErr;
                    }

                    var generateResult = await generateResponse.json();

                    if (!generateResult.success) {
                        throw new Error('セクション「' + sectionLabel + '」の生成に失敗: ' + (generateResult.message || '不明なエラー'));
                    }

                    // 生成されたブロックをエディタに即座に挿入
                    if (generateResult.blocks && generateResult.blocks.length > 0) {
                        for (var j = 0; j < generateResult.blocks.length; j++) {
                            var block = generateResult.blocks[j];
                            var blockName = block.name || block.blockName;
                            if (!blockName) continue;

                            var createdBlock = wp.blocks.createBlock(blockName, block.attributes || {}, (block.innerBlocks || []).map(function mapInnerBlock(ib) {
                                var ibName = ib.name || ib.blockName;
                                if (!ibName) return null;
                                return wp.blocks.createBlock(ibName, ib.attributes || {}, (ib.innerBlocks || []).map(mapInnerBlock).filter(Boolean));
                            }).filter(Boolean));

                            wp.data.dispatch('core/block-editor').insertBlock(createdBlock);
                        }
                    }

                    generatedCount++;
                    console.log('[LW AI Debug] セクション ' + (i + 1) + '/' + totalSections + ' 完了（DB保存済み）');
                }

                // 全セクション完了
                console.log('[LW AI Debug] 全自動生成完了: セッションID=' + currentSessionId);
                setSectionProgress({ current: totalSections, total: totalSections, sectionName: '完了！', phase: 'done' });

                setTimeout(function() {
                    setIsGenerating(false);
                    setSectionProgress({ current: 0, total: 0, sectionName: '' });
                    onClose();
                }, 1500);

            } catch (err) {
                console.error('[LW AI Debug] 全自動生成エラー:', err);
                var errorMsg = err.message || 'ページ生成中にエラーが発生しました';
                if (currentSessionId && generatedCount > 0) {
                    errorMsg += '\n\n' + generatedCount + '/' + totalSections + ' セクション完了済み。セッションID: ' + currentSessionId + ' から再開できます。';
                }
                setError(errorMsg);
                setIsGenerating(false);
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
                setCurrentMode('outline-preview');
            }
        }

        // セクションタイプのラベルを取得
        function getSectionLabel(type) {
            var labels = {
                'firstview': 'ファーストビュー',
                'introduction': 'イントロダクション',
                'features': '特徴・強み',
                'service': 'サービス内容',
                'solution': '課題解決',
                'step': 'ステップ・流れ',
                'voice': 'お客様の声',
                'faq': 'よくある質問',
                'price': '料金',
                'staff': 'スタッフ紹介',
                'company': '会社概要',
                'access': 'アクセス',
                'news': 'お知らせ',
                'history': '沿革',
                'cta': 'CTA'
            };
            return labels[type] || type;
        }

        // ブロックのスクリーンショットを取得
        async function captureBlockScreenshot(clientId) {
            // レンダリング完了を待つ
            await new Promise(function(resolve) { setTimeout(resolve, 800); });

            // ブロック要素を取得
            var blockElement = document.querySelector('[data-block="' + clientId + '"]');
            if (!blockElement) {
                console.warn('Block element not found:', clientId);
                return null;
            }

            try {
                // html2canvasでスクリーンショット
                var canvas = await window.html2canvas(blockElement, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    logging: false
                });
                return canvas.toDataURL('image/png');
            } catch (err) {
                console.warn('Screenshot capture failed:', err);
                return null;
            }
        }

        // ブロックを最適化
        async function optimizeBlock(clientId, blockName, attributes, sectionContent) {
            var maxAttempts = 2;

            for (var attempt = 0; attempt < maxAttempts; attempt++) {
                // スクリーンショットを取得
                var screenshot = await captureBlockScreenshot(clientId);
                if (!screenshot) {
                    console.warn('Could not capture screenshot, skipping optimization');
                    return;
                }

                // 最適化APIを呼び出し
                try {
                    var response = await fetch(lwAiGeneratorData.restUrl + 'optimize-block', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                        body: JSON.stringify({
                            screenshot: screenshot,
                            blockName: blockName,
                            currentAttributes: attributes,
                            sectionContent: sectionContent
                        })
                    });

                    var data = await response.json();

                    if (!data.success) {
                        console.warn('Optimization API error:', data.message);
                        return;
                    }

                    // 最適化が不要なら終了
                    if (!data.needsOptimization) {
                        console.log('Block is optimized:', blockName);
                        return;
                    }

                    // 最適化された属性を適用
                    if (data.optimizedAttributes && Object.keys(data.optimizedAttributes).length > 0) {
                        console.log('Applying optimized attributes:', data.optimizedAttributes);
                        console.log('Issues found:', data.issues);

                        // 属性を更新
                        window.lwAiGenerator.updateBlockAttributes(clientId, data.optimizedAttributes);

                        // 更新後の属性をマージ
                        attributes = Object.assign({}, attributes, data.optimizedAttributes);

                        // 少し待ってから再チェック
                        await new Promise(function(resolve) { setTimeout(resolve, 500); });
                    } else {
                        // 最適化属性がない場合は終了
                        return;
                    }
                } catch (err) {
                    console.warn('Optimization failed:', err);
                    return;
                }
            }
        }

        // セクション単位でブロックを生成・挿入
        async function handleGenerateFromOutline() {
            console.log('[LW AI Debug] handleGenerateFromOutline開始');
            console.log('[LW AI Debug] outlineText長さ:', outlineText ? outlineText.length : 0);

            if (!outlineText.trim()) {
                setError('構成案がありません');
                return;
            }

            setIsGenerating(true);
            setError(null);
            setGeneratedJson('');
            setGeneratedBlocks([]);
            setReviewResult(null);

            try {
                // 構成案をセクションに分割
                console.log('[LW AI Debug] セクション分割開始...');
                var parsed = parseOutlineToSections(outlineText);
                var sections = parsed.sections;
                var businessType = parsed.businessType;
                console.log('[LW AI Debug] セクション分割完了:', { businessType: businessType, sectionCount: sections.length, sectionNames: sections.map(function(s) { return s.name; }) });

                if (sections.length === 0) {
                    setError('セクションが見つかりませんでした');
                    setIsGenerating(false);
                    return;
                }

                // レビューを含めた総ステップ数（セクション数 + 1）
                var totalSteps = sections.length + 1;
                setSectionProgress({ current: 0, total: totalSteps, sectionName: '' });

                // 生成されたブロックを収集
                var allBlocks = [];

                // 各セクションを順番に生成
                for (var i = 0; i < sections.length; i++) {
                    var section = sections[i];
                    var progressName = section.name;
                    if (imageSource === 'ai') {
                        progressName += '（AI画像生成中...時間がかかります）';
                    }
                    setSectionProgress({ current: i + 1, total: totalSteps, sectionName: progressName });

                    // デバッグ: リクエスト内容をログ
                    var requestBody = {
                        sectionText: section.content,
                        sectionIndex: i,
                        totalSections: sections.length,
                        imageSource: imageSource,
                        businessType: businessType
                    };
                    console.log('[LW AI Debug] セクション生成リクエスト:', {
                        url: lwAiGeneratorData.restUrl + 'generate-section',
                        sectionName: section.name,
                        imageSource: imageSource,
                        body: requestBody
                    });

                    // セクションAPIを呼び出し（画像生成がある場合は長時間かかるため10分タイムアウト）
                    var controller = new AbortController();
                    var timeoutId = setTimeout(function() {
                        controller.abort();
                    }, 600000); // 10分タイムアウト

                    var response;
                    try {
                        response = await fetch(lwAiGeneratorData.restUrl + 'generate-section', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                            body: JSON.stringify(requestBody),
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                    } catch (fetchErr) {
                        clearTimeout(timeoutId);
                        if (fetchErr.name === 'AbortError') {
                            console.error('[LW AI Debug] リクエストタイムアウト (10分):', section.name);
                            setError('セクション「' + section.name + '」の生成がタイムアウトしました（10分以上かかりました）');
                        } else {
                            console.error('[LW AI Debug] fetchエラー:', fetchErr);
                            setError('セクション「' + section.name + '」の生成中に通信エラーが発生しました: ' + fetchErr.message);
                        }
                        setIsGenerating(false);
                        setSectionProgress({ current: 0, total: 0, sectionName: '' });
                        return;
                    }

                    // デバッグ: レスポンスステータスをログ
                    console.log('[LW AI Debug] レスポンスステータス:', response.status, response.statusText);

                    var data;
                    try {
                        var rawText = await response.text();
                        console.log('[LW AI Debug] 生レスポンス:', rawText.substring(0, 500));
                        data = JSON.parse(rawText);
                    } catch (parseErr) {
                        console.error('[LW AI Debug] JSONパースエラー:', parseErr);
                        setError('セクション「' + section.name + '」のレスポンスパースに失敗しました');
                        setIsGenerating(false);
                        setSectionProgress({ current: 0, total: 0, sectionName: '' });
                        return;
                    }

                    console.log('[LW AI Debug] パース済みレスポンス:', data);

                    if (!data.success) {
                        console.error('[LW AI Debug] 生成失敗:', data);
                        setError('セクション「' + section.name + '」の生成に失敗しました: ' + (data.message || '不明なエラー'));
                        setIsGenerating(false);
                        setSectionProgress({ current: 0, total: 0, sectionName: '' });
                        return;
                    }

                    // 生成されたブロックを収集
                    if (data.blocks && data.blocks.length > 0) {
                        allBlocks = allBlocks.concat(data.blocks);
                    }

                    // セクション間に余白ブロックを追加（最後のセクション以外）
                    if (i < sections.length - 1) {
                        allBlocks.push({ blockName: 'wdl/lw-space-1', attributes: {} });
                    }

                    console.log('[LW AI Debug] セクション ' + (i + 1) + '/' + sections.length + ' 処理完了: ' + section.name);
                }

                console.log('[LW AI Debug] 全セクション生成完了！ブロック数:', allBlocks.length);

                // 最終レビューフェーズ
                setSectionProgress({ current: totalSteps, total: totalSteps, sectionName: '最終チェック中...' });
                setIsReviewing(true);

                try {
                    console.log('[LW AI Debug] 最終レビュー開始...');
                    var reviewResponse = await fetch(lwAiGeneratorData.restUrl + 'review-content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': lwAiGeneratorData.restNonce },
                        body: JSON.stringify({
                            blocks: allBlocks,
                            businessType: businessType
                        })
                    });

                    var reviewData = await reviewResponse.json();
                    console.log('[LW AI Debug] レビュー結果:', reviewData);

                    if (reviewData.success) {
                        allBlocks = reviewData.fixedBlocks || allBlocks;
                        setReviewResult({
                            fixCount: reviewData.fixCount || 0,
                            fixedItems: reviewData.fixedItems || []
                        });
                        if (reviewData.fixCount > 0) {
                            console.log('[LW AI Debug] 修正箇所:', reviewData.fixedItems);
                        }
                    } else {
                        console.warn('[LW AI Debug] レビューに失敗しましたが、生成は続行します:', reviewData.message);
                    }
                } catch (reviewErr) {
                    console.warn('[LW AI Debug] レビュー中にエラーが発生しましたが、生成は続行します:', reviewErr);
                }

                setIsReviewing(false);

                // 全ブロックを挿入
                console.log('[LW AI Debug] ブロック挿入開始...', allBlocks.length, '個');
                if (allBlocks.length > 0) {
                    try {
                        var result = window.lwAiGenerator.insertBlocksFromJson({ blocks: allBlocks });
                        console.log('[LW AI Debug] insertBlocksFromJson結果:', result);
                        if (!result.success) {
                            console.warn('[LW AI Debug] ブロック挿入に問題がありました:', result.message);
                        }
                    } catch (err) {
                        console.error('[LW AI Debug] ブロック挿入エラー:', err.message, err.stack);
                    }
                }

                console.log('[LW AI Debug] ページ生成完了！');
                // 完了
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
                onClose();

            } catch (err) {
                setError('APIエラー: ' + err.message);
            } finally {
                setIsGenerating(false);
                setIsReviewing(false);
                setSectionProgress({ current: 0, total: 0, sectionName: '' });
            }
        }

        // 従来のダイレクト生成（互換性用）
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

        // ===== ヒアリング画面 =====
        if (currentMode === 'interview') {
            var interviewContent = [];

            // 戻るボタン
            interviewContent.push(
                createElement('button', {
                    key: 'back-btn',
                    className: 'lw-ai-back-btn',
                    onClick: function() { setCurrentMode('pageType'); setError(null); setInterviewAnswers({}); }
                }, '← 戻る')
            );

            // 説明とサンプル回答ボタン
            interviewContent.push(
                createElement('div', { key: 'desc-row', className: 'lw-ai-interview-desc-row' }, [
                    createElement('p', { key: 'desc', className: 'lw-ai-interview-desc' },
                        '「' + aiPrompt + '」のページを作成するために、いくつか質問させてください。'
                    ),
                    (function() {
                        // 最初の質問（サービス名）が入力されているかチェック
                        var firstQuestionId = interviewQuestions.length > 0 ? interviewQuestions[0].id : null;
                        var hasServiceName = firstQuestionId && interviewAnswers[firstQuestionId] && interviewAnswers[firstQuestionId].trim().length > 0;
                        return createElement('button', {
                            key: 'sample-btn',
                            className: 'lw-ai-sample-answer-btn' + (isGeneratingSampleAnswers ? ' is-generating' : ''),
                            onClick: handleGenerateSampleAnswers,
                            disabled: isGeneratingSampleAnswers || isGeneratingOutline || !hasServiceName,
                            title: hasServiceName ? 'サービス名を基にサンプル回答を自動入力します' : 'まずサービス名を入力してください'
                        }, isGeneratingSampleAnswers ? [
                            createElement(SparkleIcon, { key: 'icon', size: 14, className: 'lw-ai-sparkle-spin' }),
                            createElement('span', { key: 'text' }, '生成中...')
                        ] : [
                            createElement(SparkleIcon, { key: 'icon', size: 14 }),
                            createElement('span', { key: 'text' }, 'サンプル回答を自動入力')
                        ]);
                    })()
                ])
            );

            // エラー表示
            if (error) {
                interviewContent.push(
                    createElement('div', { key: 'error', className: 'lw-ai-modal-error' }, [
                        createElement('span', { key: 'icon', className: 'lw-ai-modal-error-icon' }, '!'),
                        createElement('span', { key: 'msg' }, error)
                    ])
                );
            }

            // 質問リスト
            interviewContent.push(
                createElement('div', { key: 'questions', className: 'lw-ai-interview-questions' },
                    interviewQuestions.map(function(q, index) {
                        var questionLabel = q.label || q.question || '';
                        var isRequired = q.required || false;
                        var inputType = q.type || 'text';
                        return createElement('div', { key: q.id, className: 'lw-ai-interview-question' }, [
                            createElement('label', { key: 'label', className: 'lw-ai-interview-label' }, [
                                createElement('span', { key: 'num' }, (index + 1) + '. '),
                                createElement('span', { key: 'text' }, questionLabel),
                                isRequired && createElement('span', { key: 'req', className: 'lw-ai-required' }, ' *')
                            ]),
                            createElement(inputType === 'textarea' ? 'textarea' : 'input', {
                                key: 'input',
                                type: inputType === 'textarea' ? undefined : 'text',
                                className: 'lw-ai-interview-input',
                                value: interviewAnswers[q.id] || '',
                                onChange: function(e) { handleUpdateAnswer(q.id, e.target.value); },
                                placeholder: q.placeholder || '',
                                rows: inputType === 'textarea' ? 3 : undefined,
                                disabled: isGeneratingOutline
                            })
                        ]);
                    })
                )
            );

            // 送信ボタン
            interviewContent.push(
                createElement('div', { key: 'actions', className: 'lw-ai-modal-actions' }, [
                    createElement('button', {
                        key: 'submit-btn',
                        className: 'lw-ai-modal-btn lw-ai-modal-btn-primary' + (isGeneratingOutline ? ' is-generating' : ''),
                        onClick: handleSubmitInterview,
                        disabled: isGeneratingOutline
                    }, isGeneratingOutline ? [
                        createElement(SparkleIcon, { key: 'icon', size: 18, className: 'lw-ai-sparkle-spin' }),
                        createElement('span', { key: 'text' }, '構成案を生成中...')
                    ] : [
                        createElement(SparkleIcon, { key: 'icon', size: 18 }),
                        createElement('span', { key: 'text' }, '回答を送信して構成案を生成')
                    ])
                ])
            );

            return createElement(Modal, {
                title: createElement('div', { className: 'lw-ai-modal-title' }, [
                    createElement(AiIcon, { key: 'icon', size: 24 }),
                    createElement('span', { key: 'text' }, 'ヒアリング')
                ]),
                onRequestClose: onClose,
                className: 'lw-ai-generator-modal lw-ai-interview-modal',
                overlayClassName: 'lw-ai-generator-modal-overlay'
            }, createElement('div', { className: 'lw-ai-modal-content' }, interviewContent));
        }

        // ===== 構成案プレビュー画面 =====
        if (currentMode === 'outline-preview') {
            console.log('[LW AI Debug] OutlinePreviewModalをレンダリング中...');
            return createElement(OutlinePreviewModal, {
                isOpen: true,
                onClose: onClose,
                outline: outline,
                outlineText: outlineText,
                setOutlineText: setOutlineText,
                onGenerate: handleGenerateFromOutline,
                onSelectParts: handleSelectParts,
                onGenerateAll: handleGenerateAllAutomatic,
                isGenerating: isGenerating,
                isSelectingParts: isSelectingParts,
                imageSource: imageSource,
                setImageSource: setImageSource,
                error: error,
                onBack: function() { setCurrentMode('interview'); setError(null); },
                sectionProgress: sectionProgress,
                onSave: handleSaveOutline,
                isSaving: isSavingOutline
            });
        }

        // ===== 自動生成中画面 =====
        if (currentMode === 'auto-generating') {
            var progressPercent = sectionProgress.total > 0 ? Math.round((sectionProgress.current / sectionProgress.total) * 100) : 0;
            var isDone = sectionProgress.phase === 'done';

            return createElement(Modal, {
                title: createElement('div', { className: 'lw-ai-modal-title' }, [
                    createElement(AiIcon, { key: 'icon', size: 24 }),
                    createElement('span', { key: 'text' }, 'AIページ生成中...')
                ]),
                onRequestClose: function() {},
                isDismissible: false,
                className: 'lw-ai-generator-modal lw-ai-auto-generating-modal lw-ai-modal-locked',
                overlayClassName: 'lw-ai-generator-modal-overlay'
            }, createElement('div', { className: 'lw-ai-modal-content lw-ai-auto-generating-content' }, [
                // ヘッダーアイコン
                createElement('div', { key: 'header', className: 'lw-ai-auto-gen-header' }, [
                    createElement(SparkleIcon, { key: 'icon', size: 48, className: isDone ? '' : 'lw-ai-sparkle-spin' }),
                    createElement('h3', { key: 'title' }, isDone ? 'ページ生成完了！' : 'ページを自動生成しています')
                ]),
                // 進捗表示
                createElement('div', { key: 'progress-section', className: 'lw-ai-auto-gen-progress' }, [
                    createElement('div', { key: 'progress-text', className: 'lw-ai-auto-gen-progress-text' },
                        sectionProgress.current + ' / ' + sectionProgress.total + ' セクション'
                    ),
                    createElement('div', { key: 'progress-bar-container', className: 'lw-ai-auto-gen-progress-bar-container' },
                        createElement('div', {
                            key: 'progress-bar',
                            className: 'lw-ai-auto-gen-progress-bar' + (isDone ? ' is-complete' : ''),
                            style: { width: progressPercent + '%' }
                        })
                    ),
                    createElement('div', { key: 'progress-name', className: 'lw-ai-auto-gen-progress-name' },
                        sectionProgress.sectionName || '...'
                    )
                ]),
                // 注意書き
                !isDone && createElement('div', { key: 'warning', className: 'lw-ai-auto-gen-warning' },
                    '※ ブラウザを閉じずにお待ちください。AI画像生成を含む場合は数分かかることがあります。'
                ),
                // エラー表示
                error && createElement('div', { key: 'error', className: 'lw-ai-modal-error' }, [
                    createElement('span', { key: 'icon', className: 'lw-ai-modal-error-icon' }, '!'),
                    createElement('span', { key: 'msg' }, error)
                ])
            ]));
        }

        // ===== パーツプレビュー画面 =====
        if (currentMode === 'parts-preview') {
            // コンテンツ編集ハンドラ
            function handleContentChange(sectionIndex, key, newValue) {
                var updated = partsPreviewData.map(function(section, idx) {
                    if (idx !== sectionIndex) return section;
                    var newContent = Object.assign({}, section.optimizedContent);
                    newContent[key] = newValue;
                    return Object.assign({}, section, { optimizedContent: newContent });
                });
                setPartsPreviewData(updated);
            }

            return createElement(PartsPreviewModal, {
                isOpen: true,
                onClose: onClose,
                partsData: partsPreviewData,
                onSwitchPart: handleSwitchPart,
                onGenerate: handleGenerateFromParts,
                onGenerateSingle: handleGenerateSingleSection,
                isGenerating: isGenerating,
                error: error,
                onBack: function() { setCurrentMode('outline-preview'); setError(null); setCurrentPreviewIndex(0); setGeneratedSectionCount(0); },
                sectionProgress: sectionProgress,
                getSectionLabel: getSectionLabel,
                onSaveWithParts: handleSaveWithParts,
                isSavingWithParts: isSavingOutline,
                onContentChange: handleContentChange,
                currentPreviewIndex: currentPreviewIndex,
                setCurrentPreviewIndex: setCurrentPreviewIndex,
                generatedSectionCount: generatedSectionCount,
                onSelectSectionParts: handleSelectSectionParts
            });
        }

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
                            className: 'lw-ai-mode-btn lw-ai-mode-btn-generate' + (!lwAiGeneratorData.isPremium ? ' lw-ai-mode-btn-premium-only' : ''),
                            onClick: function() {
                                if (lwAiGeneratorData.isPremium) {
                                    setCurrentMode('pageType');
                                } else {
                                    window.open(lwAiGeneratorData.premiumUrl, '_blank');
                                }
                            },
                            disabled: !lwAiGeneratorData.hasApiKey
                        }, [
                            createElement(DocumentIcon, { key: 'icon', size: 32 }),
                            createElement('span', { key: 'title', className: 'lw-ai-mode-btn-title' }, 'ページを自動生成（Beta版）'),
                            !lwAiGeneratorData.isPremium && createElement('span', { key: 'badge', className: 'lw-ai-premium-badge' }, 'プレミアムプラン限定'),
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
                    ]),
                    // 保存した構成案から生成
                    lwAiGeneratorData.isPremium && createElement('div', { key: 'saved-section', className: 'lw-ai-saved-outlines-link' },
                        createElement('button', {
                            className: 'lw-ai-saved-outlines-btn' + (isLoadingSavedOutlines ? ' is-loading' : ''),
                            onClick: handleLoadSavedOutlines,
                            disabled: !lwAiGeneratorData.hasApiKey || isLoadingSavedOutlines
                        }, isLoadingSavedOutlines ? [
                            createElement('span', { key: 'icon', className: 'lw-ai-loading-spinner' }),
                            createElement('span', { key: 'text' }, '読み込み中...')
                        ] : [
                            createElement('span', { key: 'icon', className: 'lw-ai-saved-icon' }, '📁'),
                            createElement('span', { key: 'text' }, '保存した構成案から生成')
                        ])
                    )
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

        // ===== 保存した構成案一覧画面 =====
        if (currentMode === 'saved-outlines') {
            var savedContent = [];

            savedContent.push(
                createElement('button', {
                    key: 'back-btn',
                    className: 'lw-ai-back-btn',
                    onClick: function() { setCurrentMode('select'); setError(null); }
                }, '← 戻る')
            );

            if (error) {
                savedContent.push(
                    createElement('div', { key: 'error', className: 'lw-ai-modal-error' }, [
                        createElement('span', { key: 'icon', className: 'lw-ai-modal-error-icon' }, '!'),
                        createElement('span', { key: 'msg' }, error)
                    ])
                );
            }

            savedContent.push(
                createElement('div', { key: 'saved-section', className: 'lw-ai-saved-outlines-section' }, [
                    createElement('p', { key: 'label', className: 'lw-ai-saved-outlines-label' }, '保存した構成案'),
                    savedOutlines.length === 0
                        ? createElement('div', { key: 'empty', className: 'lw-ai-saved-outlines-empty' },
                            '保存された構成案はありません。新しくページを生成して保存してください。'
                        )
                        : createElement('div', { key: 'list', className: 'lw-ai-saved-outlines-list' },
                            savedOutlines.map(function(saved) {
                                var hasPartsData = saved.partsData && saved.partsData.length > 0;
                                return createElement('div', {
                                    key: saved.id,
                                    className: 'lw-ai-saved-outline-item' + (hasPartsData ? ' has-parts-data' : '')
                                }, [
                                    createElement('div', {
                                        key: 'content',
                                        className: 'lw-ai-saved-outline-content',
                                        onClick: function() { handleSelectSavedOutline(saved); }
                                    }, [
                                        createElement('span', { key: 'name', className: 'lw-ai-saved-outline-name' }, saved.name),
                                        createElement('span', { key: 'date', className: 'lw-ai-saved-outline-date' },
                                            saved.createdAt ? new Date(saved.createdAt).toLocaleDateString('ja-JP') : ''
                                        ),
                                        saved.pageType && createElement('span', { key: 'type', className: 'lw-ai-saved-outline-type' },
                                            (lwAiGeneratorData.pageTypes && lwAiGeneratorData.pageTypes[saved.pageType])
                                                ? lwAiGeneratorData.pageTypes[saved.pageType].label
                                                : saved.pageType
                                        ),
                                        hasPartsData && createElement('span', { key: 'parts-badge', className: 'lw-ai-saved-outline-parts-badge' }, 'パーツ選択済')
                                    ]),
                                    createElement('button', {
                                        key: 'delete',
                                        className: 'lw-ai-saved-outline-delete',
                                        onClick: function(e) {
                                            e.stopPropagation();
                                            handleDeleteSavedOutline(saved.id);
                                        },
                                        title: '削除'
                                    }, '×')
                                ]);
                            })
                        )
                ])
            );

            return createElement(Modal, {
                title: createElement('div', { className: 'lw-ai-modal-title' }, [
                    createElement(AiIcon, { key: 'icon', size: 24 }),
                    createElement('span', { key: 'text' }, '保存した構成案')
                ]),
                onRequestClose: onClose,
                className: 'lw-ai-generator-modal',
                overlayClassName: 'lw-ai-generator-modal-overlay'
            }, createElement('div', { className: 'lw-ai-modal-content' }, savedContent));
        }

        // ===== ページタイプ選択画面 =====
        if (currentMode === 'pageType') {
            var pageTypeContent = [];
            var pageTypes = lwAiGeneratorData.pageTypes || {};

            pageTypeContent.push(
                createElement('button', {
                    key: 'back-btn',
                    className: 'lw-ai-back-btn',
                    onClick: function() { setCurrentMode('select'); setSelectedPageType(null); }
                }, '← 戻る')
            );

            pageTypeContent.push(
                createElement('div', { key: 'page-type-section', className: 'lw-ai-page-type-section' }, [
                    createElement('p', { key: 'label', className: 'lw-ai-page-type-label' }, 'どんなページを生成しますか？'),
                    createElement('div', { key: 'cards', className: 'lw-ai-page-type-cards' },
                        Object.keys(pageTypes).map(function(typeKey) {
                            var typeData = pageTypes[typeKey];
                            return createElement('button', {
                                key: typeKey,
                                className: 'lw-ai-page-type-card',
                                onClick: function() {
                                    setSelectedPageType(typeKey);
                                    // ページタイプに応じた固定質問をセット
                                    var questions = typeData.questions || [];
                                    setInterviewQuestions(questions.map(function(q, i) {
                                        return { id: q.id || 'q' + i, label: q.label, placeholder: q.placeholder || '', type: q.type || 'text', required: q.required || false };
                                    }));
                                    setInterviewAnswers({});
                                    // aiPromptにページタイプ名を設定
                                    setAiPrompt(typeData.label + 'ページ');
                                    setCurrentMode('interview');
                                }
                            }, [
                                createElement('span', { key: 'title', className: 'lw-ai-page-type-title' }, typeData.label),
                                createElement('span', { key: 'desc', className: 'lw-ai-page-type-desc' }, typeData.description)
                            ]);
                        })
                    )
                ])
            );

            return createElement(Modal, {
                title: createElement('div', { className: 'lw-ai-modal-title' }, [
                    createElement(AiIcon, { key: 'icon', size: 24 }),
                    createElement('span', { key: 'text' }, 'ページタイプを選択')
                ]),
                onRequestClose: onClose,
                className: 'lw-ai-generator-modal lw-ai-page-type-modal',
                overlayClassName: 'lw-ai-generator-modal-overlay'
            }, createElement('div', { className: 'lw-ai-modal-content' }, pageTypeContent));
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
            createElement('div', { key: 'actions', className: 'lw-ai-modal-actions' }, [
                createElement('button', {
                    key: 'generate-btn',
                    className: 'lw-ai-modal-btn lw-ai-modal-btn-primary' + (isGeneratingInterview ? ' is-generating' : ''),
                    onClick: handleGenerateInterview,
                    disabled: isGeneratingInterview || !aiPrompt.trim() || !lwAiGeneratorData.hasApiKey
                }, isGeneratingInterview ? [
                    createElement(SparkleIcon, { key: 'icon', size: 18, className: 'lw-ai-sparkle-spin' }),
                    createElement('span', { key: 'text' }, 'ヒアリング準備中...')
                ] : [
                    createElement(SparkleIcon, { key: 'icon', size: 18 }),
                    createElement('span', { key: 'text' }, 'ヒアリングを開始')
                ])
            ])
        );

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

    /**
     * JSON構成案を読みやすいテキストに変換
     */
    function outlineToText(outline) {
        if (!outline) return '';

        var lines = [];

        // 業種情報
        if (outline.businessType) {
            lines.push('【業種】');
            lines.push(outline.businessType);
            lines.push('');
        }

        // セクション
        if (outline.sections && outline.sections.length > 0) {
            outline.sections.forEach(function(section, index) {
                var sectionLabels = {
                    'firstview': 'ファーストビュー',
                    'introduction': 'イントロダクション',
                    'features': '特徴・強み',
                    'treatment': '施術・サービス内容',
                    'flow': 'ご利用の流れ',
                    'faq': 'よくある質問',
                    'price': '料金',
                    'staff': 'スタッフ紹介',
                    'voice': 'お客様の声',
                    'access': 'アクセス',
                    'cta': 'CTA（お問い合わせ）'
                };
                var label = sectionLabels[section.type] || section.type;
                lines.push('=====================================');
                lines.push('【' + label + '】');
                lines.push('=====================================');

                // 各フィールドを出力
                if (section.category) lines.push('カテゴリー: ' + section.category);
                if (section.catchphrase) lines.push('キャッチフレーズ: ' + section.catchphrase);
                if (section.subText) lines.push('補足文: ' + section.subText);
                if (section.title) lines.push('タイトル: ' + section.title);
                if (section.content) lines.push('説明文: ' + section.content);
                if (section.buttonText) lines.push('ボタン: ' + section.buttonText);
                if (section.buttonUrl) lines.push('リンク先: ' + section.buttonUrl);

                // access用のフィールド
                if (section.address) lines.push('住所: ' + section.address);
                if (section.access) lines.push('アクセス: ' + section.access);
                if (section.hours) lines.push('営業時間: ' + section.hours);
                if (section.holidays) lines.push('定休日: ' + section.holidays);
                if (section.phone) lines.push('電話番号: ' + section.phone);

                // items（セクションタイプによって出力形式を変える）
                if (section.items && section.items.length > 0) {
                    lines.push('');
                    section.items.forEach(function(item, i) {
                        // staff用
                        if (item.name && item.role) {
                            lines.push('- スタッフ' + (i + 1) + ': ' + item.name);
                            lines.push('  役職: ' + item.role);
                            if (item.description) lines.push('  プロフィール: ' + item.description);
                            if (item.message) lines.push('  メッセージ: ' + item.message);
                        }
                        // voice用
                        else if (item.name && item.content) {
                            lines.push('- お客様' + (i + 1) + ': ' + item.name);
                            if (item.title) lines.push('  タイトル: ' + item.title);
                            lines.push('  内容: ' + item.content);
                        }
                        // faq用
                        else if (item.question && item.answer) {
                            lines.push('- Q' + (i + 1) + ': ' + item.question);
                            lines.push('  A: ' + item.answer);
                        }
                        // price用
                        else if (item.price) {
                            lines.push('- ' + (item.title || 'メニュー' + (i + 1)) + ': ' + item.price);
                            if (item.description) lines.push('  説明: ' + item.description);
                        }
                        // 一般的なitems（features, treatment等）
                        else {
                            lines.push('- 項目' + (i + 1) + ': ' + (item.title || ''));
                            if (item.description) lines.push('  説明: ' + item.description);
                        }
                    });
                }

                // steps（流れなど）
                if (section.steps && section.steps.length > 0) {
                    lines.push('');
                    section.steps.forEach(function(step, i) {
                        lines.push('- STEP' + (i + 1) + ': ' + (step.title || ''));
                        if (step.description) lines.push('  説明: ' + step.description);
                    });
                }

                lines.push('');
            });
        }

        return lines.join('\n');
    }

    /**
     * 構成案プレビュー画面コンポーネント（シンプル版）
     */
    function OutlinePreviewModal(props) {
        console.log('[LW AI Debug] OutlinePreviewModal関数が呼ばれました', { isOpen: props.isOpen, hasOutlineText: !!props.outlineText });
        var isOpen = props.isOpen;
        var onClose = props.onClose;
        var outline = props.outline;
        var outlineText = props.outlineText;
        var setOutlineText = props.setOutlineText;
        var onGenerate = props.onGenerate;
        var onSelectParts = props.onSelectParts;
        var onGenerateAll = props.onGenerateAll;
        var isGenerating = props.isGenerating;
        var isSelectingParts = props.isSelectingParts;
        var imageSource = props.imageSource;
        var setImageSource = props.setImageSource;
        var error = props.error;
        var onBack = props.onBack;
        var sectionProgress = props.sectionProgress || { current: 0, total: 0, sectionName: '' };
        var onSave = props.onSave;
        var isSaving = props.isSaving;

        if (!isOpen) return null;

        var modalContent = [];

        // ヘッダー（戻る・保存ボタン）（生成中は非表示）
        if (!isGenerating) {
            modalContent.push(
                createElement('div', { key: 'header-row', className: 'lw-ai-outline-header-row' }, [
                    createElement('button', { key: 'back-btn', className: 'lw-ai-back-btn', onClick: onBack }, '← 戻る'),
                    createElement('button', {
                        key: 'save-btn',
                        className: 'lw-ai-save-btn' + (isSaving ? ' is-saving' : ''),
                        onClick: onSave,
                        disabled: isSaving || !outline || !outline.sections
                    }, isSaving ? '保存中...' : '💾 構成案を保存')
                ])
            );
        }

        // 説明（パーツ選択中または生成中は進捗表示に変更）
        if ((isSelectingParts || isGenerating) && sectionProgress.total > 0) {
            var progressPercent = Math.round((sectionProgress.current / sectionProgress.total) * 100);
            var progressTitle = isSelectingParts ? 'パーツを選択中...' : 'セクションを生成中...';
            var progressWarning = isSelectingParts
                ? '※ 各セクションに最適なパーツを選択しています。しばらくお待ちください。'
                : '※ 生成中はブラウザを閉じないでください。画像生成を含む場合、数分かかることがあります。';
            modalContent.push(
                createElement('div', { key: 'progress', className: 'lw-ai-section-progress' }, [
                    createElement('div', { key: 'progress-header', className: 'lw-ai-section-progress-header' }, [
                        createElement(SparkleIcon, { key: 'icon', size: 20, className: 'lw-ai-sparkle-spin' }),
                        createElement('span', { key: 'text' }, progressTitle)
                    ]),
                    createElement('div', { key: 'progress-warning', className: 'lw-ai-section-progress-warning' },
                        progressWarning
                    ),
                    createElement('div', { key: 'progress-info', className: 'lw-ai-section-progress-info' },
                        sectionProgress.current + ' / ' + sectionProgress.total + ' セクション'
                    ),
                    createElement('div', { key: 'progress-name', className: 'lw-ai-section-progress-name' },
                        '現在: ' + (sectionProgress.sectionName || '...')
                    ),
                    createElement('div', { key: 'progress-bar-container', className: 'lw-ai-progress-bar-container' }, [
                        createElement('div', {
                            key: 'progress-bar',
                            className: 'lw-ai-progress-bar',
                            style: { width: progressPercent + '%' }
                        })
                    ])
                ])
            );
        } else {
            modalContent.push(
                createElement('p', { key: 'desc', className: 'lw-ai-outline-desc' },
                    'AIが生成したコンテンツ構成案です。自由に編集してください。編集後の内容をAIが理解してページを生成します。'
                )
            );
        }

        // エラー表示
        if (error) {
            modalContent.push(
                createElement('div', { key: 'error', className: 'lw-ai-modal-error' }, [
                    createElement('span', { key: 'icon', className: 'lw-ai-modal-error-icon' }, '!'),
                    createElement('span', { key: 'msg' }, error)
                ])
            );
        }

        // テキストエリア
        modalContent.push(
            createElement('div', { key: 'textarea-section', className: 'lw-ai-outline-textarea-section' }, [
                createElement('textarea', {
                    key: 'textarea',
                    className: 'lw-ai-outline-textarea',
                    value: outlineText,
                    onChange: function(e) { setOutlineText(e.target.value); },
                    disabled: isGenerating,
                    rows: 20
                })
            ])
        );

        // パーツ選択ボタン
        var isProcessing = isGenerating || isSelectingParts;
        modalContent.push(
            createElement('div', { key: 'actions', className: 'lw-ai-modal-actions' },
                createElement('button', {
                    className: 'lw-ai-modal-btn lw-ai-modal-btn-primary' + (isSelectingParts ? ' is-generating' : ''),
                    onClick: onSelectParts,
                    disabled: isProcessing || !outline || !outline.sections
                }, isSelectingParts ? [
                    createElement(SparkleIcon, { key: 'icon', size: 18, className: 'lw-ai-sparkle-spin' }),
                    createElement('span', { key: 'text' }, 'パーツを選択中...')
                ] : [
                    createElement(SparkleIcon, { key: 'icon', size: 18 }),
                    createElement('span', { key: 'text' }, 'パーツを選択して次へ')
                ])
            )
        );

        return createElement(Modal, {
            title: createElement('div', { className: 'lw-ai-modal-title' }, [
                createElement(AiIcon, { key: 'icon', size: 24 }),
                createElement('span', { key: 'text' }, 'コンテンツ構成の確認・編集')
            ]),
            onRequestClose: onClose,
            className: 'lw-ai-generator-modal lw-ai-outline-modal',
            overlayClassName: 'lw-ai-generator-modal-overlay'
        }, createElement('div', { className: 'lw-ai-modal-content lw-ai-outline-content' }, modalContent));
    }

    /**
     * パーツプレビュー画面コンポーネント（全セクション一覧表示版）
     */
    function PartsPreviewModal(props) {
        var isOpen = props.isOpen;
        var onClose = props.onClose;
        var partsData = props.partsData || [];
        var onSwitchPart = props.onSwitchPart;
        var onGenerate = props.onGenerate;
        var isGenerating = props.isGenerating;
        var error = props.error;
        var onBack = props.onBack;
        var sectionProgress = props.sectionProgress || { current: 0, total: 0, sectionName: '' };
        var getSectionLabel = props.getSectionLabel;
        var onSaveWithParts = props.onSaveWithParts;
        var isSavingWithParts = props.isSavingWithParts;
        var onContentChange = props.onContentChange;

        // 編集中のセクションインデックス（-1は編集なし）
        var editingState = useState(-1);
        var editingSectionIndex = editingState[0];
        var setEditingSectionIndex = editingState[1];

        if (!isOpen) return null;

        var totalSections = partsData.length;

        var modalContent = [];

        // ヘッダー（生成中は非表示）
        if (!isGenerating) {
            modalContent.push(
                createElement('div', { key: 'header-buttons', className: 'lw-ai-parts-header-buttons' }, [
                    createElement('button', { key: 'back-btn', className: 'lw-ai-back-btn', onClick: onBack }, '← 構成案に戻る'),
                    onSaveWithParts && createElement('button', {
                        key: 'save-btn',
                        className: 'lw-ai-save-parts-btn',
                        onClick: onSaveWithParts,
                        disabled: isSavingWithParts || !partsData || partsData.length === 0
                    }, isSavingWithParts ? '保存中...' : '保存する')
                ])
            );

            // セクション数表示
            modalContent.push(
                createElement('div', { key: 'section-info', className: 'lw-ai-section-info' },
                    createElement('span', { className: 'lw-ai-section-count' }, totalSections + ' セクション')
                )
            );
        }

        // 生成中の進捗表示
        if (isGenerating && sectionProgress.total > 0) {
            var progressPercent = Math.round((sectionProgress.current / sectionProgress.total) * 100);
            modalContent.push(
                createElement('div', { key: 'progress', className: 'lw-ai-section-progress' }, [
                    createElement('div', { key: 'progress-header', className: 'lw-ai-section-progress-header' }, [
                        createElement(SparkleIcon, { key: 'icon', size: 20, className: 'lw-ai-sparkle-spin' }),
                        createElement('span', { key: 'text' }, 'セクションを生成中...')
                    ]),
                    createElement('div', { key: 'progress-warning', className: 'lw-ai-section-progress-warning' },
                        '※ 生成中はブラウザを閉じないでください。画像生成を含む場合、数分かかることがあります。'
                    ),
                    createElement('div', { key: 'progress-info', className: 'lw-ai-section-progress-info' },
                        sectionProgress.current + ' / ' + sectionProgress.total + ' セクション'
                    ),
                    createElement('div', { key: 'progress-name', className: 'lw-ai-section-progress-name' },
                        '現在: ' + (sectionProgress.sectionName || '...')
                    ),
                    createElement('div', { key: 'progress-bar-container', className: 'lw-ai-progress-bar-container' }, [
                        createElement('div', {
                            key: 'progress-bar',
                            className: 'lw-ai-progress-bar',
                            style: { width: progressPercent + '%' }
                        })
                    ])
                ])
            );
        } else {
            modalContent.push(
                createElement('p', { key: 'desc', className: 'lw-ai-parts-desc' },
                    'AIが各セクションに最適なパーツを選択しました。「別のパーツを使う」で変更できます。'
                )
            );
        }

        // エラー表示
        if (error) {
            modalContent.push(
                createElement('div', { key: 'error', className: 'lw-ai-modal-error' }, [
                    createElement('span', { key: 'icon', className: 'lw-ai-modal-error-icon' }, '!'),
                    createElement('span', { key: 'msg' }, error)
                ])
            );
        }

        // テキスト表示用のフィールドかどうか判定
        function isTextFieldForDisplay(key, value) {
            var excludeKeyPatterns = [
                /Color$/i, /Gradient$/i, /^bg/i, /^background/i, /^image/i, /^video/i,
                /Url$/i, /^imagePc$/i, /^imageSp$/i, /^border/i, /^filter/i, /^stroke/i,
                /^cta.*Color$/i, /^font/i, /^Font/i, /Weight$/i, /Class$/i, /Width$/i,
                /Height$/i, /Size$/i, /^margin/i, /^padding/i, /Radius$/i, /Opacity$/i,
                /^max/i, /^min/i, /^headingLevel$/i, /^showButton$/i, /^openNewTab$/i,
                /^level$/i, /^align$/i, /^trigger$/i, /^animation/i, /^threshold/i,
                /^delay/i, /^distance/i, /^lw_bg/i, /Position$/i, /Enabled$/i,
                /^enableScroll$/i, /^focalPoint/i, /^isFullWidth$/i, /^contentAlign/i,
                /^innerPadding/i, /^ulMaxWidth$/i, /^shadowX$/i, /^shadowY$/i, /^shadowBlur$/i,
                /^transitionDuration$/i, /^shake/i, /^icon/i, /Prompt$/i, /^imagePrompt$/i
            ];
            for (var i = 0; i < excludeKeyPatterns.length; i++) {
                if (excludeKeyPatterns[i].test(key)) return false;
            }
            if (typeof value === 'string') {
                if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return false;
                if (/^rgb/.test(value)) return false;
                if (/^var\(--/.test(value)) return false;
                if (value.trim() === '') return false;
            }
            if (typeof value === 'number' || typeof value === 'boolean') return false;
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    var firstItem = value[0];
                    if (typeof firstItem === 'string') return true;
                    if (typeof firstItem === 'object' && (firstItem.title || firstItem.text || firstItem.name || firstItem.question)) return true;
                }
                return false;
            }
            return true;
        }

        // テキスト項目のラベル名を取得
        function getTextFieldLabel(key) {
            var labelMap = {
                'mainTitle': 'メインタイトル', 'subTitle': 'サブタイトル', 'title': 'タイトル',
                'description': '説明文', 'catchphrase': 'キャッチフレーズ', 'subText': 'サブテキスト',
                'buttonText': 'ボタンテキスト', 'textMain': 'ボタンテキスト', 'textSub': 'ボタンサブテキスト',
                'content': '本文', 'message': 'メッセージ', 'items': '項目', 'contents': 'ステップ'
            };
            return labelMap[key] || key;
        }

        // 全セクション一覧表示
        if (partsData.length > 0 && !isGenerating) {
            var sectionCards = partsData.map(function(section, sectionIndex) {
                var sectionLabel = getSectionLabel ? getSectionLabel(section.type) : section.type;
                var content = section.optimizedContent || {};
                var isLoading = section.isLoading || false;
                var isEditing = editingSectionIndex === sectionIndex;

                // コンテンツを表示/編集用に整形
                var contentItems = [];
                Object.keys(content).forEach(function(key) {
                    var value = content[key];
                    if (!isTextFieldForDisplay(key, value)) return;
                    var fieldLabel = getTextFieldLabel(key);

                    if (isEditing) {
                        if (typeof value === 'string') {
                            var isLongText = key === 'content' || key === 'description' || key === 'message' || value.length > 80;
                            contentItems.push(
                                createElement('div', { key: key, className: 'lw-pp-item lw-pp-editable' }, [
                                    createElement('label', { key: 'label', className: 'lw-pp-label' }, fieldLabel + ':'),
                                    createElement('textarea', {
                                        key: 'input', className: 'lw-pp-textarea', value: value, rows: isLongText ? 3 : 2,
                                        onChange: function(e) { onContentChange(sectionIndex, key, e.target.value); }
                                    })
                                ])
                            );
                        } else if (Array.isArray(value)) {
                            contentItems.push(
                                createElement('div', { key: key, className: 'lw-pp-items lw-pp-editable' }, [
                                    createElement('label', { key: 'label', className: 'lw-pp-label' }, fieldLabel + ' (' + value.length + '件):'),
                                    createElement('div', { key: 'items-list', className: 'lw-pp-items-edit-list' },
                                        value.map(function(item, i) {
                                            var itemText = typeof item === 'object' ? (item.title || item.name || item.question || item.text || '') : item;
                                            return createElement('textarea', {
                                                key: i, className: 'lw-pp-textarea lw-pp-item-textarea',
                                                value: itemText, rows: 2, placeholder: '項目 ' + (i + 1),
                                                onChange: function(e) {
                                                    var newItems = value.slice();
                                                    if (typeof item === 'object') {
                                                        var newItem = Object.assign({}, item);
                                                        if (item.title !== undefined) newItem.title = e.target.value;
                                                        else if (item.name !== undefined) newItem.name = e.target.value;
                                                        else if (item.question !== undefined) newItem.question = e.target.value;
                                                        else if (item.text !== undefined) newItem.text = e.target.value;
                                                        newItems[i] = newItem;
                                                    } else {
                                                        newItems[i] = e.target.value;
                                                    }
                                                    onContentChange(sectionIndex, key, newItems);
                                                }
                                            });
                                        })
                                    )
                                ])
                            );
                        }
                    } else {
                        if (Array.isArray(value)) {
                            contentItems.push(
                                createElement('div', { key: key, className: 'lw-pp-items' }, [
                                    createElement('span', { key: 'label', className: 'lw-pp-label' }, fieldLabel + ':'),
                                    createElement('ul', { key: 'list' },
                                        value.slice(0, 5).map(function(item, i) {
                                            var itemText = typeof item === 'object' ? (item.title || item.name || item.question || item.text || JSON.stringify(item).substring(0, 50)) : item;
                                            return createElement('li', { key: i }, itemText);
                                        })
                                    ),
                                    value.length > 5 && createElement('span', { key: 'more', className: 'lw-pp-more' }, '他 ' + (value.length - 5) + ' 件')
                                ])
                            );
                        } else if (typeof value === 'string') {
                            contentItems.push(
                                createElement('div', { key: key, className: 'lw-pp-item' }, [
                                    createElement('span', { key: 'label', className: 'lw-pp-label' }, fieldLabel + ':'),
                                    createElement('span', { key: 'value', className: 'lw-pp-value' }, value.length > 150 ? value.substring(0, 150) + '...' : value)
                                ])
                            );
                        }
                    }
                });

                // カード要素を配列で構築
                var cardElements = [
                    createElement('div', { key: 'header', className: 'lw-pp-header' }, [
                        createElement('span', { key: 'num', className: 'lw-pp-num' }, (sectionIndex + 1) + '.'),
                        createElement('span', { key: 'type', className: 'lw-pp-type' }, sectionLabel),
                        createElement('span', { key: 'part', className: 'lw-pp-name' }, section.selectedPart || '未選択'),
                        createElement('button', {
                            key: 'edit-btn', className: 'lw-pp-edit-btn' + (isEditing ? ' is-active' : ''),
                            onClick: function() { setEditingSectionIndex(isEditing ? -1 : sectionIndex); },
                            title: isEditing ? '閉じる' : 'テキストを編集'
                        }, isEditing ? '✕' : '✎')
                    ])
                ];

                // 説明があれば追加
                if (section.partDescription) {
                    cardElements.push(
                        createElement('div', { key: 'desc', className: 'lw-pp-desc' }, section.partDescription)
                    );
                }

                // コンテンツがあれば追加
                if (contentItems.length > 0) {
                    cardElements.push(
                        createElement('div', { key: 'content', className: 'lw-pp-body' }, contentItems)
                    );
                }

                // パーツ切り替えドロップダウン
                if (section.availableParts && section.availableParts.length > 1) {
                    cardElements.push(
                        createElement('div', { key: 'switch', className: 'lw-pp-switch' }, [
                            createElement('select', {
                                key: 'select', className: 'lw-pp-select',
                                value: section.selectedPart || '',
                                onChange: function(e) { onSwitchPart(sectionIndex, e.target.value); },
                                disabled: isLoading
                            }, section.availableParts.map(function(part) {
                                return createElement('option', { key: part.name, value: part.name }, part.name + ' (' + part.type + ')');
                            })),
                            isLoading && createElement(SparkleIcon, { key: 'loading', size: 16, className: 'lw-ai-sparkle-spin' })
                        ])
                    );
                }

                return createElement('div', {
                    key: 'section-' + sectionIndex,
                    className: 'lw-pp-card' + (isLoading ? ' is-loading' : '') + (isEditing ? ' is-editing' : '')
                }, cardElements);
            });

            modalContent.push(
                createElement('div', { key: 'all-sections', className: 'lw-ai-parts-list lw-ai-all-sections' }, sectionCards)
            );
        }

        // 生成ボタン（2つのボタンで画像生成有無を選択）
        modalContent.push(
            createElement('div', { key: 'actions', className: 'lw-ai-modal-actions lw-ai-modal-actions-dual' },
                isGenerating ? [
                    // 生成中は1つのボタンで進捗表示
                    createElement('button', {
                        key: 'generating-btn',
                        className: 'lw-ai-modal-btn lw-ai-modal-btn-primary is-generating',
                        disabled: true
                    }, [
                        createElement(SparkleIcon, { key: 'icon', size: 18, className: 'lw-ai-sparkle-spin' }),
                        createElement('span', { key: 'text' }, 'ページを生成中...')
                    ])
                ] : [
                    // AI画像ありで生成ボタン
                    createElement('button', {
                        key: 'generate-with-ai-btn',
                        className: 'lw-ai-modal-btn lw-ai-modal-btn-primary',
                        onClick: function() { onGenerate('ai'); },
                        disabled: partsData.length === 0
                    }, [
                        createElement('span', { key: 'icon', className: 'lw-ai-btn-icon' }, '🖼️'),
                        createElement('span', { key: 'text' }, 'AI画像ありで生成')
                    ]),
                    // 画像なしで生成ボタン
                    createElement('button', {
                        key: 'generate-without-ai-btn',
                        className: 'lw-ai-modal-btn lw-ai-modal-btn-secondary',
                        onClick: function() { onGenerate('none'); },
                        disabled: partsData.length === 0
                    }, [
                        createElement('span', { key: 'icon', className: 'lw-ai-btn-icon' }, '📝'),
                        createElement('span', { key: 'text' }, '画像なしで生成')
                    ])
                ]
            )
        );

        return createElement(Modal, {
            title: createElement('div', { className: 'lw-ai-modal-title' }, [
                createElement(AiIcon, { key: 'icon', size: 24 }),
                createElement('span', { key: 'text' }, 'パーツプレビュー')
            ]),
            onRequestClose: isGenerating ? function() {} : onClose,
            isDismissible: !isGenerating,
            className: 'lw-ai-generator-modal lw-ai-parts-modal' + (isGenerating ? ' lw-ai-modal-locked' : ''),
            overlayClassName: 'lw-ai-generator-modal-overlay'
        }, createElement('div', { className: 'lw-ai-modal-content lw-ai-parts-content' }, modalContent));
    }

    // グローバルに公開（動的読み込み用）
    window.LwAiGeneratorModal = AiGeneratorModal;

})();
