/**
 * LiteWord – 見出しタイトル 12
 * カスタムブロック
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    BlockControls,
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    ToolbarGroup,
    ToolbarButton,
    PanelBody,
    ToggleControl,
    ColorPalette,
    RangeControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import metadata from './block.json';

registerBlockType(metadata.name, {
    /* ----------------------------------------------------------
     * 編集画面
     * -------------------------------------------------------- */
    edit: ({ attributes, setAttributes }) => {
        const { mainTitle, subTitle, headingLevel, colorMain, colorSub, colorMainText, colorSubText, orderReversed, maxWidth } = attributes;

        /* 変更ハンドラ */
        const onChangeMainTitle = (value) => setAttributes({ mainTitle: value });
        const onChangeSubTitle = (value) => setAttributes({ subTitle: value });
        const onChangeHeadingLevel = (level) => setAttributes({ headingLevel: level });
        const onChangeColorMain = (value) => setAttributes({ colorMain: value });
        const onChangeColorSub = (value) => setAttributes({ colorSub: value });
        const onChangeColorMainText = (value) => setAttributes({ colorMainText: value });
        const onChangeColorSubText = (value) => setAttributes({ colorSubText: value });
        const onToggleOrder = () => setAttributes({ orderReversed: !orderReversed });
        const onChangeMaxWidth = (value) => setAttributes({ maxWidth: value === undefined ? 0 : value });

        const TagName = `h${headingLevel}`;

        const inlineStyle = {
            '--color-main': colorMain,
            '--lw-pr-custom-title-12-sub-color': colorSub,
        };

        if (colorMainText) {
            inlineStyle['--color-main-text'] = colorMainText;
        }

        if (colorSubText) {
            inlineStyle['--color-sub-text'] = colorSubText;
        }

        if (maxWidth > 0) {
            inlineStyle['maxWidth'] = `${maxWidth}px`;
        }

        const blockProps = useBlockProps({
            className: 'lw-pr-custom-title-12',
            style: inlineStyle,
        });

        return (
            <Fragment>
                <BlockControls>
                    <ToolbarGroup>
                        {[1, 2, 3, 4, 5].map((level) => (
                            <ToolbarButton
                                key={level}
                                isPressed={headingLevel === level}
                                onClick={() => onChangeHeadingLevel(level)}
                            >
                                {`H${level}`}
                            </ToolbarButton>
                        ))}
                    </ToolbarGroup>
                </BlockControls>

                <InspectorControls>
                    <PanelBody title="表示順序設定">
                        <ToggleControl
                            label="メインとサブを入れ替える"
                            checked={orderReversed}
                            onChange={onToggleOrder}
                            help={orderReversed ? 'サブが上、メインが下' : 'メインが上、サブが下'}
                        />
                    </PanelBody>
                    <PanelBody title="幅設定">
                        <RangeControl
                            label="最大幅 (px)"
                            value={maxWidth || undefined}
                            onChange={onChangeMaxWidth}
                            min={400}
                            max={1600}
                            step={10}
                            allowReset={true}
                            help={maxWidth > 0 ? `${maxWidth}px` : '未設定（デフォルト幅）'}
                        />
                    </PanelBody>
                    <PanelBody title="カラー設定">
                        <p><strong>メインカラー</strong></p>
                        <ColorPalette
                            value={colorMain}
                            onChange={onChangeColorMain}
                        />
                        <hr />
                        <p><strong>サブカラー</strong></p>
                        <ColorPalette
                            value={colorSub}
                            onChange={onChangeColorSub}
                        />
                        <hr />
                        <p><strong>メインタイトルのテキスト色</strong></p>
                        <ColorPalette
                            value={colorMainText}
                            onChange={onChangeColorMainText}
                        />
                        <hr />
                        <p><strong>サブタイトルのテキスト色</strong></p>
                        <ColorPalette
                            value={colorSubText}
                            onChange={onChangeColorSubText}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <TagName className="ttl">
                        {!orderReversed ? (
                            <Fragment>
                                <RichText
                                    tagName="span"
                                    className="main"
                                    value={mainTitle}
                                    onChange={onChangeMainTitle}
                                    placeholder="メインタイトルを入力"
                                />
                                <RichText
                                    tagName="span"
                                    className="sub"
                                    value={subTitle}
                                    onChange={onChangeSubTitle}
                                    placeholder="サブタイトルを入力"
                                />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <RichText
                                    tagName="span"
                                    className="sub"
                                    value={subTitle}
                                    onChange={onChangeSubTitle}
                                    placeholder="サブタイトルを入力"
                                />
                                <RichText
                                    tagName="span"
                                    className="main"
                                    value={mainTitle}
                                    onChange={onChangeMainTitle}
                                    placeholder="メインタイトルを入力"
                                />
                            </Fragment>
                        )}
                    </TagName>
                </div>
            </Fragment>
        );
    },

    /* ----------------------------------------------------------
     * フロント出力
     * -------------------------------------------------------- */
    save: ({ attributes }) => {
        const { mainTitle, subTitle, headingLevel, colorMain, colorSub, colorMainText, colorSubText, orderReversed, maxWidth } = attributes;

        // テキストが両方とも入力されていない場合は何も出力しない
        if (!mainTitle && !subTitle) {
            return null;
        }

        const TagName = `h${headingLevel}`;

        const inlineStyle = {
            '--color-main': colorMain,
            '--lw-pr-custom-title-12-sub-color': colorSub,
        };

        if (colorMainText) {
            inlineStyle['--color-main-text'] = colorMainText;
        }

        if (colorSubText) {
            inlineStyle['--color-sub-text'] = colorSubText;
        }

        if (maxWidth > 0) {
            inlineStyle['maxWidth'] = `${maxWidth}px`;
        }

        const blockProps = useBlockProps.save({
            className: 'lw-pr-custom-title-12',
            style: inlineStyle,
        });

        return (
            <div {...blockProps}>
                <TagName className="ttl">
                    {!orderReversed ? (
                        <Fragment>
                            {mainTitle && (
                                <RichText.Content tagName="span" className="main" value={mainTitle} />
                            )}
                            {subTitle && (
                                <RichText.Content tagName="span" className="sub" value={subTitle} />
                            )}
                        </Fragment>
                    ) : (
                        <Fragment>
                            {subTitle && (
                                <RichText.Content tagName="span" className="sub" value={subTitle} />
                            )}
                            {mainTitle && (
                                <RichText.Content tagName="span" className="main" value={mainTitle} />
                            )}
                        </Fragment>
                    )}
                </TagName>
            </div>
        );
    },
});