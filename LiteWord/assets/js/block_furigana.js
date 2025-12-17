(function() {
    const { registerFormatType, applyFormat, removeFormat, getActiveFormat } = wp.richText;
    const { RichTextToolbarButton } = wp.blockEditor;
    const { useState, useEffect, createElement, Fragment } = wp.element;
    const { Popover, TextControl, Button, SelectControl } = wp.components;

    const FURIGANA_FORMAT = 'liteword/furigana';

    // フリガナフォーマットを登録
    registerFormatType(FURIGANA_FORMAT, {
        title: 'ふりがな',
        tagName: 'ruby',
        className: null,
        attributes: {
            rt: 'data-rt',
            position: 'data-rt-position',
        },
        edit: FuriganaButton,
    });

    function FuriganaButton({ isActive, value, onChange, contentRef }) {
        const [isPopoverVisible, setIsPopoverVisible] = useState(false);
        const [furiganaText, setFuriganaText] = useState('');
        const [position, setPosition] = useState('over');

        // 選択されたテキストを取得
        const selectedText = value.text.substring(value.start, value.end);

        // 現在のフォーマットを取得
        const activeFormat = getActiveFormat(value, FURIGANA_FORMAT);

        // ポップオーバーが開いたときの処理
        useEffect(() => {
            if (isPopoverVisible) {
                // 既存のフリガナがあれば入力欄に表示
                if (activeFormat && activeFormat.attributes) {
                    if (activeFormat.attributes.rt) {
                        setFuriganaText(activeFormat.attributes.rt);
                    }
                    if (activeFormat.attributes.position) {
                        setPosition(activeFormat.attributes.position);
                    } else {
                        setPosition('over');
                    }
                } else {
                    setFuriganaText('');
                    setPosition('over');
                }
            }
        }, [isPopoverVisible, activeFormat]);

        // ツールバーボタンがクリックされたとき
        const onButtonClick = () => {
            // テキストが選択されていない場合は何もしない
            if (value.start === value.end) {
                return;
            }

            setIsPopoverVisible(true);
        };

        // フリガナを適用
        const applyFurigana = () => {
            if (!furiganaText.trim()) {
                // 空の場合はフリガナを削除
                onChange(removeFormat(value, FURIGANA_FORMAT));
                setIsPopoverVisible(false);
                return;
            }

            // フリガナを適用
            const newValue = applyFormat(value, {
                type: FURIGANA_FORMAT,
                attributes: {
                    rt: furiganaText,
                    position: position,
                },
            });

            onChange(newValue);
            setIsPopoverVisible(false);
            setFuriganaText('');
        };

        // フリガナを削除
        const removeFurigana = () => {
            onChange(removeFormat(value, FURIGANA_FORMAT));
            setIsPopoverVisible(false);
            setFuriganaText('');
        };

        // Enterキーで適用
        const onKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyFurigana();
            }
            if (event.key === 'Escape') {
                setIsPopoverVisible(false);
            }
        };

        return createElement(
            Fragment,
            null,
            createElement(RichTextToolbarButton, {
                icon: 'editor-textcolor',
                title: 'ふりがな',
                onClick: onButtonClick,
                isActive: isActive,
            }),
            isPopoverVisible && createElement(
                Popover,
                {
                    className: 'lw-furigana-popover',
                    position: 'bottom center',
                    onClose: () => setIsPopoverVisible(false),
                    anchor: contentRef?.current,
                    focusOnMount: 'firstElement',
                },
                createElement(
                    'div',
                    {
                        className: 'lw-furigana-popover-content',
                        style: { padding: '16px', minWidth: '280px' }
                    },
                    createElement(
                        'p',
                        { style: { margin: '0 0 12px', fontSize: '13px', color: '#1e1e1e' } },
                        '選択中のテキスト: ',
                        createElement('strong', null, selectedText)
                    ),
                    createElement(TextControl, {
                        label: 'ふりがな',
                        value: furiganaText,
                        onChange: setFuriganaText,
                        onKeyDown: onKeyDown,
                        placeholder: 'ひらがなを入力',
                        __nextHasNoMarginBottom: true,
                    }),
                    createElement(
                        'div',
                        { style: { marginTop: '12px' } },
                        createElement(SelectControl, {
                            label: '表示位置',
                            value: position,
                            options: [
                                { label: '上（通常）', value: 'over' },
                                { label: '下', value: 'under' },
                            ],
                            onChange: setPosition,
                            __nextHasNoMarginBottom: true,
                        })
                    ),
                    createElement(
                        'div',
                        { style: { display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' } },
                        isActive && createElement(Button, {
                            variant: 'tertiary',
                            onClick: removeFurigana,
                            isDestructive: true,
                        }, '削除'),
                        createElement(Button, {
                            variant: 'secondary',
                            onClick: () => setIsPopoverVisible(false),
                        }, 'キャンセル'),
                        createElement(Button, {
                            variant: 'primary',
                            onClick: applyFurigana,
                            disabled: !furiganaText.trim(),
                        }, '適用')
                    )
                )
            )
        );
    }

})();
