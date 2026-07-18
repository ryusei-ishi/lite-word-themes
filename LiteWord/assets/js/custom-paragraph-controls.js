(function() {
    const { hooks, components, blockEditor, element } = wp;
    const { addFilter } = hooks;
    const { InspectorControls } = blockEditor;
    const { PanelBody, SelectControl, TextControl, RangeControl, __experimentalToggleGroupControl: ToggleGroupControl, __experimentalToggleGroupControlOption: ToggleGroupControlOption } = components;
    const { useState } = element;

    // 対象ブロック名を配列で定義
    const targetBlocks = ['core/paragraph', 'core/heading'];

    /**
     * 1. カスタム属性を追加
     */
    function addCustomAttributes(settings, name) {
        if (!targetBlocks.includes(name)) {
            return settings;
        }
        settings.attributes = Object.assign({}, settings.attributes, {
            // 最大横幅
            maxWidth: { type: 'string', default: '' },
            maxWidthUnit: { type: 'string', default: 'px' },
            // フォントの太さ
            fontWeightClass: { type: 'string', default: '' },

            // フォントサイズ
            fontSizeClass: { type: 'string', default: '' },
            fontSizeSpClass: { type: 'string', default: '' },

            // 行間
            lineHeightClass: { type: 'string', default: '' },
            lineHeightSpClass: { type: 'string', default: '' },

            // 文字間
            letterSpacingClass: { type: 'string', default: '' },
            letterSpacingSpClass: { type: 'string', default: '' },

            
        });
        return settings;
    }
    addFilter(
        'blocks.registerBlockType',
        'my-plugin/add-custom-attributes',
        addCustomAttributes
    );

    /**
     * 2. サイドバーにカスタム設定を追加
     */
    function addCustomInspectorControls(BlockEdit) {
        return (props) => {
            if (!targetBlocks.includes(props.name)) {
                return element.createElement(BlockEdit, props);
            }
            const { attributes, setAttributes, isSelected } = props;

            const {
                maxWidth,
                maxWidthUnit = 'px',
                lineHeightClass,
                lineHeightSpClass,
                letterSpacingClass,
                letterSpacingSpClass,
                fontSizeClass,
                fontSizeSpClass,
                fontWeightClass,
            } = attributes;

            if (!isSelected) {
                return element.createElement(BlockEdit, props);
            }

            // 行間 (PC)
            const lineHeightOptions = [
                { label: '未選択', value: '' },
                { label: '0.8', value: 'lh-0-8' },
                { label: '0.9', value: 'lh-0-9' },
                { label: '1.0', value: 'lh-1' },
                { label: '1.1', value: 'lh-1-1' },
                { label: '1.2', value: 'lh-1-2' },
                { label: '1.3', value: 'lh-1-3' },
                { label: '1.4', value: 'lh-1-4' },
                { label: '1.5', value: 'lh-1-5' },
                { label: '1.6', value: 'lh-1-6' },
                { label: '1.7', value: 'lh-1-7' },
                { label: '1.8', value: 'lh-1-8' },
                { label: '1.9', value: 'lh-1-9' },
                { label: '2.0', value: 'lh-2' },
                { label: '2.1', value: 'lh-2-1' },
                { label: '2.2', value: 'lh-2-2' },
                { label: '2.3', value: 'lh-2-3' },
                { label: '2.4', value: 'lh-2-4' },
                { label: '2.5', value: 'lh-2-5' },
                { label: '2.6', value: 'lh-2-6' },
                { label: '2.7', value: 'lh-2-7' },
                { label: '2.8', value: 'lh-2-8' },
                { label: '2.9', value: 'lh-2-9' },
                { label: '3.0', value: 'lh-3' }
            ];

            // 行間 (SP)
            const lineHeightOptionsSp = lineHeightOptions.map(option => ({
                label: option.label,
                value: option.value ? option.value.replace('lh-', 'lh-sp-') : ''
            }));

            // 文字間 (PC)
            const letterSpacingOptions = [
                { label: '未選択', value: '' },
                { label: '0', value: 'ls-0' },
                { label: '0.05', value: 'ls-0-05' },
                { label: '0.06', value: 'ls-0-06' },
                { label: '0.07', value: 'ls-0-07' },
                { label: '0.08', value: 'ls-0-08' },
                { label: '0.09', value: 'ls-0-09' },
                { label: '0.1', value: 'ls-0-1' },
                { label: '0.2', value: 'ls-0-2' },
                { label: '0.3', value: 'ls-0-3' }
            ];

            // 文字間 (SP)
            const letterSpacingOptionsSp = letterSpacingOptions.map(option => ({
                label: option.label,
                value: option.value ? option.value.replace('ls-', 'ls-sp-') : ''
            }));

            // フォントサイズ (PC)
            const fontSizeOptions = [
                { label: '未選択', value: '' },
                { label: '0.1倍', value: 'fs-0-1' },
                { label: '0.2倍', value: 'fs-0-2' },
                { label: '0.3倍', value: 'fs-0-3' },
                { label: '0.4倍', value: 'fs-0-4' },
                { label: '0.5倍', value: 'fs-0-5' },
                { label: '0.6倍', value: 'fs-0-6' },
                { label: '0.7倍', value: 'fs-0-7' },
                { label: '0.8倍', value: 'fs-0-8' },
                { label: '0.9倍', value: 'fs-0-9' },
                { label: '1.0倍', value: 'fs-1' },
                { label: '1.1倍', value: 'fs-1-1' },
                { label: '1.2倍', value: 'fs-1-2' },
                { label: '1.3倍', value: 'fs-1-3' },
                { label: '1.4倍', value: 'fs-1-4' },
                { label: '1.5倍', value: 'fs-1-5' },
                { label: '1.6倍', value: 'fs-1-6' },
                { label: '1.7倍', value: 'fs-1-7' },
                { label: '1.8倍', value: 'fs-1-8' },
                { label: '1.9倍', value: 'fs-1-9' },
                { label: '2.0倍', value: 'fs-2' },
                { label: '2.1倍', value: 'fs-2-1' },
                { label: '2.2倍', value: 'fs-2-2' },
                { label: '2.3倍', value: 'fs-2-3' },
                { label: '2.4倍', value: 'fs-2-4' },
                { label: '2.5倍', value: 'fs-2-5' },
                { label: '2.6倍', value: 'fs-2-6' },
                { label: '2.7倍', value: 'fs-2-7' },
                { label: '2.8倍', value: 'fs-2-8' },
                { label: '2.9倍', value: 'fs-2-9' },
                { label: '3.0倍', value: 'fs-3' },
                { label: '3.1倍', value: 'fs-3-1' },
                { label: '3.2倍', value: 'fs-3-2' },
                { label: '3.3倍', value: 'fs-3-3' },
                { label: '3.4倍', value: 'fs-3-4' },
                { label: '3.5倍', value: 'fs-3-5' },
                { label: '3.6倍', value: 'fs-3-6' },
                { label: '3.7倍', value: 'fs-3-7' },
                { label: '3.8倍', value: 'fs-3-8' },
                { label: '3.9倍', value: 'fs-3-9' },
                { label: '4.0倍', value: 'fs-4' }
            ];

            // フォントサイズ (SP)
            const fontSizeOptionsSp = fontSizeOptions.map(option => ({
                label: option.label,
                value: option.value ? option.value.replace('fs-', 'fs-sp-') : ''
            }));

            // フォントの太さ
            const fontWeightOptions = [
                { label: '未選択', value: '' },
                { label: '100 - Thin', value: 'fw-100' },
                { label: '200 - Extra Light', value: 'fw-200' },
                { label: '300 - Light', value: 'fw-300' },
                { label: '400 - Regular', value: 'fw-400' },
                { label: '500 - Medium', value: 'fw-500' },
                { label: '600 - Semi Bold', value: 'fw-600' },
                { label: '700 - Bold', value: 'fw-700' },
                { label: '800 - Extra Bold', value: 'fw-800' },
                { label: '900 - Black', value: 'fw-900' }
            ];

            // パネルのタイトルを動的に変更
            const panelTitle = props.name === 'core/heading' ? '見出しのカスタム設定' : '段落のカスタム設定';

          const styles = `
                .custom-typography-panel {
                    padding: 4px;
                }
                
                .custom-section {
                    margin: 0 -12px;
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                    padding: 12px 16px;
                    border-radius: 4px;
                    margin-bottom: 4px;
                    box-shadow: 0 2px 6px rgba(56, 88, 233, 0.08);
                }
                
                .custom-section-title {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #1976d2;
                    margin: 0 0 12px 0;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .custom-section-title:before {
                    content: '';
                    width: 3px;
                    height: 14px;
                    background: #3858e9;
                    border-radius: 2px;
                }
                
                .custom-two-column {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                
                .custom-select-wrapper {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 4px;
                    padding: 8px;
                    transition: all 0.2s ease;
                }
                
                .custom-select-wrapper:hover {
                    background: #ffffff;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(56, 88, 233, 0.12);
                }
                
                .custom-select-wrapper label {
                    font-size: 11px;
                    font-weight: 600;
                    color: #3858e9;
                    margin-bottom: 4px;
                    display: block;
                }
                
                .custom-select-wrapper select {
                    border: 2px solid #e3f2fd;
                    border-radius: 4px;
                    font-size: 13px;
                    transition: all 0.2s ease;
                }
                
                .custom-select-wrapper select:focus {
                    border-color: #3858e9;
                    box-shadow: 0 0 0 3px rgba(56, 88, 233, 0.1);
                }
                
                .custom-width-section {
                    margin: 0 -12px;
                    background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
                    padding: 16px;
                    border-radius: 4px;
                    margin-bottom: 4px;
                    box-shadow: 0 2px 6px rgba(56, 88, 233, 0.08);
                }
                
                .custom-width-section .components-base-control__label {
                    color: #0d47a1 !important;
                    font-weight: 600;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .custom-width-section .components-input-control__input,
                .custom-width-section input[type="number"] {
                    background: rgba(255, 255, 255, 0.95);
                    border: 2px solid rgba(56, 88, 233, 0.2);
                    border-radius: 6px;
                    font-weight: 500;
                }
                
                .custom-width-section .components-input-control__input:focus,
                .custom-width-section input[type="number"]:focus {
                    background: #ffffff;
                    border-color: #3858e9;
                    box-shadow: 0 0 0 3px rgba(56, 88, 233, 0.15);
                }
                
                .custom-width-section .components-button-group {
                    margin-top: 8px;
                }
                
                .custom-width-section .components-button {
                    background: rgba(255, 255, 255, 0.5);
                    color: #1565c0;
                    border: 2px solid rgba(56, 88, 233, 0.25);
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                
                .custom-width-section .components-button:hover {
                    background: rgba(255, 255, 255, 0.8);
                    border-color: rgba(56, 88, 233, 0.4);
                }
                
                .custom-width-section .components-button.is-pressed {
                    background: #ffffff;
                    color: #3858e9;
                    border-color: #3858e9;
                }
                
                .custom-width-section input[type="range"] {
                    background: rgba(56, 88, 233, 0.15);
                }
                
                .custom-weight-section {
                    margin: 0 -12px;
                    margin-bottom: 4px;
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                    padding: 16px;
                    border-radius: 4px;
                    box-shadow: 0 2px 6px rgba(56, 88, 233, 0.08);
                }
                
                .custom-weight-section .components-base-control__label {
                    color: #283593 !important;
                    font-weight: 600;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .custom-weight-section select {
                    background: rgba(255, 255, 255, 0.95);
                    border: 2px solid rgba(56, 88, 233, 0.2);
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 13px;
                }
                
                .custom-weight-section select:focus {
                    background: #ffffff;
                    border-color: #3858e9;
                    box-shadow: 0 0 0 3px rgba(56, 88, 233, 0.15);
                }
                
            `;

            // スタイルタグを追加
            if (typeof document !== 'undefined' && !document.getElementById('custom-typography-styles')) {
                const styleTag = document.createElement('style');
                styleTag.id = 'custom-typography-styles';
                styleTag.textContent = styles;
                document.head.appendChild(styleTag);
            }

            // 最大横幅の数値を取得
            const maxWidthValue = maxWidth ? parseInt(maxWidth) : '';
            const maxWidthWithUnit = maxWidth && maxWidthValue ? `${maxWidthValue}${maxWidthUnit}` : '';

            return element.createElement(
                element.Fragment,
                null,
                element.createElement(BlockEdit, props),
                element.createElement(
                    InspectorControls,
                    null,
                    element.createElement(
                        PanelBody,
                        { title: panelTitle, className: 'custom-typography-panel' },

                        // 最大横幅セクション
                        element.createElement(
                            'div',
                            { className: 'custom-width-section' },
                            element.createElement(
                                'div',
                                { style: { marginBottom: '12px' } },
                                element.createElement(ToggleGroupControl, {
                                    value: maxWidthUnit,
                                    onChange: (value) => setAttributes({ maxWidthUnit: value }),
                                    isBlock: true,
                                    __next40pxDefaultSize: true,
                                    __nextHasNoMarginBottom: true
                                },
                                    element.createElement(ToggleGroupControlOption, { value: 'px', label: 'px' }),
                                    element.createElement(ToggleGroupControlOption, { value: '%', label: '%' })
                                )
                            ),
                            element.createElement(RangeControl, {
                                label: '最大横幅',
                                value: maxWidthValue,
                                onChange: (value) => setAttributes({ maxWidth: value ? String(value) : '' }),
                                min: 0,
                                max: maxWidthUnit === 'px' ? 2000 : 100,
                                step: maxWidthUnit === 'px' ? 10 : 5,
                                help: maxWidthWithUnit || '未設定',
                                __next40pxDefaultSize: true,
                                __nextHasNoMarginBottom: true
                            }),
                            element.createElement(TextControl, {
                                label: '直接入力',
                                value: maxWidth,
                                onChange: (value) => setAttributes({ maxWidth: value }),
                                placeholder: `例: 600`,
                                type: 'number',
                                __next40pxDefaultSize: true,
                                __nextHasNoMarginBottom: true
                            })
                        ),

                        // フォント太さセクション
                        element.createElement(
                            'div',
                            { className: 'custom-weight-section' },
                            element.createElement(SelectControl, {
                                label: 'フォントの太さ',
                                value: fontWeightClass,
                                onChange: (value) => setAttributes({ fontWeightClass: value }),
                                options: fontWeightOptions,
                                __next40pxDefaultSize: true,
                                __nextHasNoMarginBottom: true
                            })
                        ),
                        // フォントサイズセクション
                        element.createElement(
                            'div',
                            { className: 'custom-section' },
                            element.createElement('div', { className: 'custom-section-title' }, 'フォントサイズ'),
                            element.createElement(
                                'div',
                                { className: 'custom-two-column' },
                                element.createElement(
                                    'div',
                                    { className: 'custom-select-wrapper' },
                                    element.createElement('label', null, '💻 PC'),
                                    element.createElement('select', {
                                        value: fontSizeClass,
                                        onChange: (e) => setAttributes({ fontSizeClass: e.target.value })
                                    }, fontSizeOptions.map(opt =>
                                        element.createElement('option', { value: opt.value, key: opt.value }, opt.label)
                                    ))
                                ),
                                element.createElement(
                                    'div',
                                    { className: 'custom-select-wrapper' },
                                    element.createElement('label', null, '📱 スマホ'),
                                    element.createElement('select', {
                                        value: fontSizeSpClass,
                                        onChange: (e) => setAttributes({ fontSizeSpClass: e.target.value })
                                    }, fontSizeOptionsSp.map(opt =>
                                        element.createElement('option', { value: opt.value, key: opt.value }, opt.label)
                                    ))
                                )
                            )
                        ),


                        
                        // 行間セクション
                        element.createElement(
                            'div',
                            { className: 'custom-section' },
                            element.createElement('div', { className: 'custom-section-title' }, '行間'),
                            element.createElement(
                                'div',
                                { className: 'custom-two-column' },
                                element.createElement(
                                    'div',
                                    { className: 'custom-select-wrapper' },
                                    element.createElement('label', null, '💻 PC'),
                                    element.createElement('select', {
                                        value: lineHeightClass,
                                        onChange: (e) => setAttributes({ lineHeightClass: e.target.value })
                                    }, lineHeightOptions.map(opt =>
                                        element.createElement('option', { value: opt.value, key: opt.value }, opt.label)
                                    ))
                                ),
                                element.createElement(
                                    'div',
                                    { className: 'custom-select-wrapper' },
                                    element.createElement('label', null, '📱 スマホ'),
                                    element.createElement('select', {
                                        value: lineHeightSpClass,
                                        onChange: (e) => setAttributes({ lineHeightSpClass: e.target.value })
                                    }, lineHeightOptionsSp.map(opt =>
                                        element.createElement('option', { value: opt.value, key: opt.value }, opt.label)
                                    ))
                                )
                            )
                        ),

                        // 文字間セクション
                        element.createElement(
                            'div',
                            { className: 'custom-section' },
                            element.createElement('div', { className: 'custom-section-title' }, '文字間'),
                            element.createElement(
                                'div',
                                { className: 'custom-two-column' },
                                element.createElement(
                                    'div',
                                    { className: 'custom-select-wrapper' },
                                    element.createElement('label', null, '💻 PC'),
                                    element.createElement('select', {
                                        value: letterSpacingClass,
                                        onChange: (e) => setAttributes({ letterSpacingClass: e.target.value })
                                    }, letterSpacingOptions.map(opt =>
                                        element.createElement('option', { value: opt.value, key: opt.value }, opt.label)
                                    ))
                                ),
                                element.createElement(
                                    'div',
                                    { className: 'custom-select-wrapper' },
                                    element.createElement('label', null, '📱 スマホ'),
                                    element.createElement('select', {
                                        value: letterSpacingSpClass,
                                        onChange: (e) => setAttributes({ letterSpacingSpClass: e.target.value })
                                    }, letterSpacingOptionsSp.map(opt =>
                                        element.createElement('option', { value: opt.value, key: opt.value }, opt.label)
                                    ))
                                )
                            )
                        ),

                    )
                )
            );
        };
    }
    addFilter(
        'editor.BlockEdit',
        'my-plugin/add-custom-inspector-controls',
        addCustomInspectorControls
    );

    /**
     * 3. エディター画面でクラスと max-width を反映 (HOC)
     */
    function withCustomWrapperProps(BlockListBlock) {
        return (props) => {
            const { block } = props;
            if (!block || !targetBlocks.includes(block.name)) {
                return element.createElement(BlockListBlock, props);
            }

            // wrapperProps がなければ空オブジェクト作成
            let newWrapperProps = { ...(props.wrapperProps || {}) };
            let existingClassName = newWrapperProps.className || '';
            let classNames = new Set(existingClassName.split(' ').filter(Boolean));

            // 各種クラスを追加
            const {
                maxWidth,
                maxWidthUnit = 'px',
                lineHeightClass,
                lineHeightSpClass,
                letterSpacingClass,
                letterSpacingSpClass,
                fontSizeClass,
                fontSizeSpClass,
                fontWeightClass,
            } = block.attributes;

            [
                lineHeightClass, lineHeightSpClass,
                letterSpacingClass, letterSpacingSpClass,
                fontSizeClass, fontSizeSpClass,
                fontWeightClass
            ].forEach(cls => {
                if (cls) classNames.add(cls);
            });

            // クラス名をセット
            newWrapperProps.className = Array.from(classNames).join(' ').trim();

            // max-width をエディターでも適用
            newWrapperProps.style = { ...(newWrapperProps.style || {}) };
            if (maxWidth) {
                newWrapperProps.style.maxWidth = maxWidth + maxWidthUnit;
            }

            return element.createElement(BlockListBlock, {
                ...props,
                wrapperProps: newWrapperProps
            });
        };
    }

    addFilter(
        'editor.BlockListBlock',
        'my-plugin/with-custom-wrapper-props',
        withCustomWrapperProps
    );


    /**
     * 4. 保存時にタグへクラスを適用 & max-width の反映
     */
    function applyCustomExtraProps(saveElementProps, blockType, attributes) {
        if (!targetBlocks.includes(blockType.name)) {
            return saveElementProps;
        }

        const {
            maxWidth,
            maxWidthUnit = 'px',
            lineHeightClass,
            lineHeightSpClass,
            letterSpacingClass,
            letterSpacingSpClass,
            fontSizeClass,
            fontSizeSpClass,
            fontWeightClass,
        } = attributes;

        // max-width を style に
        saveElementProps.style = saveElementProps.style || {};
        if (maxWidth) {
            saveElementProps.style.maxWidth = maxWidth + maxWidthUnit;
        }

        // 既存クラス保持
        let classNames = new Set(
            saveElementProps.className ? saveElementProps.className.split(' ') : []
        );

        // 各種クラスを追加
        [
            lineHeightClass, lineHeightSpClass,
            letterSpacingClass, letterSpacingSpClass,
            fontSizeClass, fontSizeSpClass,
            fontWeightClass
        ].forEach(cls => {
            if (cls) classNames.add(cls);
        });

        // 結合して反映
        saveElementProps.className = Array.from(classNames).join(' ').trim();

        return saveElementProps;
    }
    addFilter(
        'blocks.getSaveContent.extraProps',
        'my-plugin/apply-custom-extra-props',
        applyCustomExtraProps
    );
})();