/**
 * ブロックサイドバー AI指示パネル
 *
 * カスタムブロック（wdl/*）のInspectorControlsに「AIへの指示」セクションを追加
 */

(function() {
    'use strict';

    const { createElement, useState, useEffect, Fragment } = wp.element;
    const { PanelBody, TextareaControl, Button, Spinner } = wp.components;
    const { InspectorControls } = wp.blockEditor;
    const { createHigherOrderComponent } = wp.compose;
    const { addFilter } = wp.hooks;
    const { useDispatch } = wp.data;

    /**
     * AIチャットメッセージコンポーネント
     */
    const ChatMessage = ({ message, isUser }) => {
        return createElement('div', {
            className: `lw-ai-chat-message ${isUser ? 'user' : 'ai'}`,
            style: {
                padding: '8px 10px',
                marginBottom: '6px',
                borderRadius: '6px',
                backgroundColor: isUser ? '#0073aa' : '#f0f0f0',
                color: isUser ? '#fff' : '#333',
                fontSize: '12px',
                lineHeight: '1.4',
                whiteSpace: 'pre-wrap'
            }
        }, message);
    };

    /**
     * AI指示パネルコンポーネント
     */
    const AIInstructionPanel = ({ blockName, attributes, clientId }) => {
        const [instruction, setInstruction] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [chatHistory, setChatHistory] = useState([]);
        const [isOpen, setIsOpen] = useState(false);

        // AI機能の有効/無効状態を監視
        const [aiEnabled, setAiEnabled] = useState(window.lwAiFeaturesEnabled || false);

        const { updateBlockAttributes } = useDispatch('core/block-editor');

        // プレミアムステータス
        const isPremium = lwAiBlockSidebarData.isPremium;

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

        // ブロックが変わったらチャット履歴をクリア
        useEffect(() => {
            setChatHistory([]);
        }, [clientId]);

        // AI機能がOFFの場合は何も表示しない
        if (!aiEnabled) {
            return null;
        }

        // AI指示を送信
        const handleSubmit = async () => {
            if (!instruction.trim()) return;

            // プレミアムでない場合は警告を表示
            if (!isPremium) {
                setChatHistory(prev => [...prev, {
                    message: '⚠️ この機能はプレミアムプラン限定です。プレミアムプランにアップグレードしてご利用ください。',
                    isUser: false
                }]);
                return;
            }

            setIsLoading(true);

            // ユーザーメッセージを追加
            const userMessage = instruction;
            setChatHistory(prev => [...prev, { message: userMessage, isUser: true }]);
            setInstruction('');

            try {
                const response = await fetch(lwAiBlockSidebarData.restUrl + 'block-instruction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': lwAiBlockSidebarData.restNonce
                    },
                    body: JSON.stringify({
                        blockName: blockName,
                        currentAttributes: attributes,
                        instruction: userMessage,
                        chatHistory: chatHistory
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // AIの応答を追加
                    setChatHistory(prev => [...prev, { message: data.response, isUser: false }]);

                    // 属性の更新があれば適用
                    if (data.updatedAttributes && Object.keys(data.updatedAttributes).length > 0) {
                        updateBlockAttributes(clientId, data.updatedAttributes);

                        // 更新通知を追加
                        setChatHistory(prev => [...prev, {
                            message: '✅ 設定を更新しました',
                            isUser: false
                        }]);
                    }
                } else {
                    setChatHistory(prev => [...prev, {
                        message: '❌ ' + (data.message || 'エラーが発生しました'),
                        isUser: false
                    }]);
                }
            } catch (err) {
                console.error('[LW AI Block] Error:', err);
                setChatHistory(prev => [...prev, {
                    message: '❌ 通信エラーが発生しました',
                    isUser: false
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        // Enterキーで送信（Shift+Enterは改行）
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        };

        // 近日公開予定フラグ（trueの間は機能を無効化）
        const isComingSoon = false;

        return createElement(PanelBody, {
            title: createElement(Fragment, null,
                createElement('span', {
                    style: {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '600'
                    }
                }, '✨ AIアシスタント'),
                isComingSoon ? createElement('span', {
                    style: {
                        marginLeft: '8px',
                        fontSize: '10px',
                        padding: '2px 6px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#fff',
                        borderRadius: '3px',
                        fontWeight: 'bold'
                    }
                }, '近日公開予定') : (!isPremium && createElement('span', {
                    style: {
                        marginLeft: '8px',
                        fontSize: '10px',
                        padding: '2px 6px',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: '#fff',
                        borderRadius: '3px',
                        fontWeight: 'bold'
                    }
                }, 'Premium'))
            ),
            initialOpen: isOpen,
            onToggle: () => setIsOpen(!isOpen),
            className: 'lw-ai-assistant-panel' + (isComingSoon || !isPremium ? ' lw-ai-premium-disabled' : '')
        },
            // 近日公開予定の案内を表示
            isComingSoon && createElement('div', {
                style: {
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '4px',
                    fontSize: '12px',
                    lineHeight: '1.5'
                }
            }, [
                createElement('p', {
                    key: 'msg',
                    style: { margin: '0 0 8px 0', fontWeight: 'bold' }
                }, '🚧 近日公開予定'),
                createElement('p', {
                    key: 'desc',
                    style: { margin: '0' }
                }, 'この機能は現在開発中です。もうしばらくお待ちください。')
            ]),
            // プレミアムでない場合は案内を表示（近日公開中は非表示）
            !isComingSoon && !isPremium && createElement('div', {
                style: {
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '4px',
                    fontSize: '12px',
                    lineHeight: '1.5'
                }
            }, [
                createElement('p', {
                    key: 'msg',
                    style: { margin: '0 0 8px 0', fontWeight: 'bold' }
                }, '⚠️ プレミアム機能'),
                createElement('p', {
                    key: 'desc',
                    style: { margin: '0' }
                }, 'この機能はLiteWordプレミアムプラン限定です。')
            ]),
            // チャット履歴
            chatHistory.length > 0 && createElement('div', {
                className: 'lw-ai-chat-history',
                style: {
                    maxHeight: '200px',
                    overflowY: 'auto',
                    marginBottom: '10px',
                    padding: '4px',
                    backgroundColor: '#fafafa',
                    borderRadius: '4px'
                }
            }, chatHistory.map((chat, index) =>
                createElement(ChatMessage, {
                    key: index,
                    message: chat.message,
                    isUser: chat.isUser
                })
            )),

            // 入力エリア
            createElement(TextareaControl, {
                placeholder: isComingSoon ? '近日公開予定...' : '例: 背景を青にして、タイトルを変更して',
                value: instruction,
                onChange: setInstruction,
                onKeyDown: handleKeyDown,
                rows: 2,
                disabled: isLoading || isComingSoon,
                style: { marginBottom: '8px' }
            }),

            createElement(Button, {
                isPrimary: !isComingSoon && isPremium,
                isSecondary: isComingSoon || !isPremium,
                onClick: handleSubmit,
                disabled: isLoading || !instruction.trim() || !isPremium || isComingSoon,
                style: {
                    width: '100%',
                    justifyContent: 'center'
                }
            },
                isLoading ? createElement(Fragment, null,
                    createElement(Spinner, { style: { marginRight: '4px' } }),
                    '処理中...'
                ) : (isComingSoon ? '🚧 近日公開予定' : (!isPremium ? '🔒 プレミアムプラン限定' : '✨ AIに指示する'))
            ),

            // ヒント（折りたたみ可能）
            createElement('details', {
                style: {
                    marginTop: '10px',
                    fontSize: '11px',
                    color: '#666'
                }
            },
                createElement('summary', {
                    style: { cursor: 'pointer', marginBottom: '4px' }
                }, '💡 使い方のヒント'),
                createElement('div', {
                    style: { paddingLeft: '8px', lineHeight: '1.6' }
                },
                    '・「背景を赤にして」',
                    createElement('br'),
                    '・「タイトルを〇〇に」',
                    createElement('br'),
                    '・「海の画像を設定」',
                    createElement('br'),
                    '・「何ができる？」'
                )
            )
        );
    };

    /**
     * wdl/* ブロックのInspectorControlsにAIパネルを追加
     */
    const withAIInspectorControls = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            const { name, attributes, clientId } = props;

            // wdl/* ブロック以外はそのまま返す
            if (!name || !name.startsWith('wdl/')) {
                return createElement(BlockEdit, props);
            }

            return createElement(Fragment, null,
                // AIパネルを最初に追加
                createElement(InspectorControls, null,
                    createElement(AIInstructionPanel, {
                        blockName: name,
                        attributes: attributes,
                        clientId: clientId
                    })
                ),
                // 元のBlockEdit
                createElement(BlockEdit, props)
            );
        };
    }, 'withAIInspectorControls');

    // フィルターを追加
    addFilter(
        'editor.BlockEdit',
        'lw-ai-generator/with-ai-inspector-controls',
        withAIInspectorControls
    );

})();
