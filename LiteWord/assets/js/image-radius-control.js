/**
 * 画像ブロックに角丸設定を追加(PC/SP対応)
 */
(function () {
    // wpが存在しない場合は何もしない
    if (typeof wp === 'undefined' || !wp.hooks || !wp.element) {
        console.log('image-radius-control: wp not available');
        return;
    }

    const { addFilter } = wp.hooks;
    const { createElement, Fragment } = wp.element;
    const { InspectorControls } = wp.blockEditor || wp.editor;
    const { PanelBody, RangeControl } = wp.components;
    const { createHigherOrderComponent } = wp.compose;

    /**
     * 属性を追加
     */
    function addImageRadiusAttribute(settings, name) {
        if (name !== 'core/image') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                lwImageRadiusPc: {
                    type: 'number',
                    default: 0,
                },
                lwImageRadiusSp: {
                    type: 'number',
                    default: 0,
                },
                lwImageRadiusSpManuallySet: {
                    type: 'boolean',
                    default: false,
                },
            },
        };
    }

    addFilter(
        'blocks.registerBlockType',
        'liteword/image-radius-attribute',
        addImageRadiusAttribute
    );

    /**
     * InspectorControlsを追加
     */
    const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            if (props.name !== 'core/image') {
                return createElement(BlockEdit, props);
            }

            const { attributes, setAttributes } = props;
            const { lwImageRadiusPc, lwImageRadiusSp, lwImageRadiusSpManuallySet } = attributes;

            return createElement(
                Fragment,
                null,
                createElement(BlockEdit, props),
                createElement(
                    InspectorControls,
                    null,
                    createElement(
                        PanelBody,
                        {
                            title: '角丸設定',
                            initialOpen: true,
                        },
                        createElement(RangeControl, {
                            label: '角丸の大きさ (PC)',
                            value: lwImageRadiusPc || 0,
                            onChange: (value) => {
                                // SPが手動で変更されていない場合は、SPもPCと同じ値に設定
                                if (!lwImageRadiusSpManuallySet) {
                                    setAttributes({ 
                                        lwImageRadiusPc: value,
                                        lwImageRadiusSp: value
                                    });
                                } else {
                                    setAttributes({ lwImageRadiusPc: value });
                                }
                            },
                            min: 0,
                            max: 400,
                            step: 1,
                            help: 'PC表示時の画像の角丸を設定します(px)',
                        }),
                        createElement(RangeControl, {
                            label: '角丸の大きさ (スマホ)',
                            value: lwImageRadiusSp || 0,
                            onChange: (value) => {
                                // SPを手動で変更したら、連動フラグをtrueに
                                setAttributes({ 
                                    lwImageRadiusSp: value,
                                    lwImageRadiusSpManuallySet: true
                                });
                            },
                            min: 0,
                            max: 400,
                            step: 1,
                            help: 'スマホ表示時の画像の角丸を設定します(px)。',
                        })
                    )
                )
            );
        };
    }, 'withInspectorControls');

    addFilter(
        'editor.BlockEdit',
        'liteword/image-radius-inspector',
        withInspectorControls
    );

    /**
     * エディター内でのプレビュー用スタイル追加
     */
    const withImageRadiusEditor = createHigherOrderComponent((BlockListBlock) => {
        return (props) => {
            if (props.name !== 'core/image') {
                return createElement(BlockListBlock, props);
            }

            const { attributes } = props;
            const { lwImageRadiusPc, lwImageRadiusSp } = attributes;

            if ((lwImageRadiusPc && lwImageRadiusPc > 0) || (lwImageRadiusSp && lwImageRadiusSp > 0)) {
                const wrapperProps = props.wrapperProps || {};
                const style = wrapperProps.style || {};

                return createElement(BlockListBlock, {
                    ...props,
                    wrapperProps: {
                        ...wrapperProps,
                        style: {
                            ...style,
                            '--lw-img-radius-pc': `${lwImageRadiusPc || 0}px`,
                            '--lw-img-radius-sp': `${lwImageRadiusSp || 0}px`,
                        },
                    },
                });
            }

            return createElement(BlockListBlock, props);
        };
    }, 'withImageRadiusEditor');

    addFilter(
        'editor.BlockListBlock',
        'liteword/image-radius-editor',
        withImageRadiusEditor
    );

    /**
     * 保存時のスタイル追加
     */
    function addImageRadiusStyle(props, blockType, attributes) {
        if (blockType.name !== 'core/image') {
            return props;
        }

        const { lwImageRadiusPc, lwImageRadiusSp } = attributes;

        if ((lwImageRadiusPc && lwImageRadiusPc > 0) || (lwImageRadiusSp && lwImageRadiusSp > 0)) {
            const style = props.style || {};
            
            return {
                ...props,
                style: {
                    ...style,
                    '--lw-img-radius-pc': `${lwImageRadiusPc || 0}px`,
                    '--lw-img-radius-sp': `${lwImageRadiusSp || 0}px`,
                },
            };
        }

        return props;
    }

    addFilter(
        'blocks.getSaveContent.extraProps',
        'liteword/image-radius-style',
        addImageRadiusStyle
    );

})();