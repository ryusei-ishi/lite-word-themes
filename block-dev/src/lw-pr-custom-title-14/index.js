/**
 * LiteWord – 見出しタイトル 14
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
    ColorPalette,
    RangeControl,
    RadioControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import metadata from './block.json';

registerBlockType(metadata.name, {
    /* ----------------------------------------------------------
     * 編集画面
     * -------------------------------------------------------- */
    edit: ({ attributes, setAttributes }) => {
        const { mainTitle, subTitle, headingLevel, colorMain, colorMainText, colorSubText, maxWidth, borderRadius, alignmentPc, alignmentSp } = attributes;

        /* 変更ハンドラ */
        const onChangeMainTitle = (value) => setAttributes({ mainTitle: value });
        const onChangeSubTitle = (value) => setAttributes({ subTitle: value });
        const onChangeHeadingLevel = (level) => setAttributes({ headingLevel: level });
        const onChangeColorMain = (value) => setAttributes({ colorMain: value });
        const onChangeColorMainText = (value) => setAttributes({ colorMainText: value });
        const onChangeColorSubText = (value) => setAttributes({ colorSubText: value });
        const onChangeMaxWidth = (value) => setAttributes({ maxWidth: value === undefined ? 0 : value });
        const onChangeBorderRadius = (value) => setAttributes({ borderRadius: value === undefined ? 0 : value });
        const onChangeAlignmentPc = (value) => setAttributes({ alignmentPc: value });
        const onChangeAlignmentSp = (value) => setAttributes({ alignmentSp: value });

        const TagName = `h${headingLevel}`;

        const inlineStyle = {
            '--color-main': colorMain,
        };

        if (maxWidth > 0) {
            inlineStyle['maxWidth'] = `${maxWidth}px`;
            inlineStyle['width'] = '100%';
        }

        if (borderRadius > 0) {
            inlineStyle['width'] = '100%';
            inlineStyle['--custom-title-14-border-radius'] = `${borderRadius}px`;
        }

        const subTextStyle = {};
        if (colorSubText) {
            subTextStyle['color'] = colorSubText;
        }

        const mainTextStyle = {};
        if (colorMainText) {
            mainTextStyle['color'] = colorMainText;
        }

        // .lw-pr-custom-title-14 のクラス名生成
        let containerClassName = 'lw-pr-custom-title-14';
        if (alignmentPc) {
            containerClassName += ` ${alignmentPc}_pc`;
        }
        if (alignmentSp) {
            containerClassName += ` ${alignmentSp}_sp`;
        }

        const blockProps = useBlockProps({
            className: containerClassName,
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
                    <PanelBody title="位置設定">
                        <p><strong>PC表示</strong></p>
                        <RadioControl
                            selected={alignmentPc}
                            options={[
                                { label: '未設定', value: '' },
                                { label: '左寄せ', value: 'left' },
                                { label: '中央', value: 'center' },
                                { label: '右寄せ', value: 'right' },
                            ]}
                            onChange={onChangeAlignmentPc}
                        />
                        <hr />
                        <p><strong>スマホ表示</strong></p>
                        <RadioControl
                            selected={alignmentSp}
                            options={[
                                { label: '未設定', value: '' },
                                { label: '左寄せ', value: 'left' },
                                { label: '中央', value: 'center' },
                                { label: '右寄せ', value: 'right' },
                            ]}
                            onChange={onChangeAlignmentSp}
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
                    <PanelBody title="角丸設定">
                        <RangeControl
                            label="角丸 (px)"
                            value={borderRadius || undefined}
                            onChange={onChangeBorderRadius}
                            min={0}
                            max={16}
                            step={1}
                            allowReset={true}
                            help={borderRadius > 0 ? `${borderRadius}px` : '角丸なし'}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <TagName className="ttl">
                        <span className="sub">
                            <RichText
                                tagName="span"
                                className="text"
                                value={subTitle}
                                onChange={onChangeSubTitle}
                                placeholder="サブタイトルを入力"
                                style={subTextStyle}
                            />
                        </span>
                        <RichText
                            tagName="span"
                            className="main"
                            value={mainTitle}
                            onChange={onChangeMainTitle}
                            placeholder="メインタイトルを入力"
                            style={mainTextStyle}
                        />
                    </TagName>
                </div>
            </Fragment>
        );
    },

    /* ----------------------------------------------------------
     * フロント出力
     * -------------------------------------------------------- */
    save: ({ attributes }) => {
        const { mainTitle, subTitle, headingLevel, colorMain, colorMainText, colorSubText, maxWidth, borderRadius, alignmentPc, alignmentSp } = attributes;

        // テキストが両方とも入力されていない場合は何も出力しない
        if (!mainTitle && !subTitle) {
            return null;
        }

        const TagName = `h${headingLevel}`;

        const inlineStyle = {
            '--color-main': colorMain,
        };

        if (maxWidth > 0) {
            inlineStyle['maxWidth'] = `${maxWidth}px`;
            inlineStyle['width'] = '100%';
        }

        if (borderRadius > 0) {
            inlineStyle['width'] = '100%';
            inlineStyle['--custom-title-14-border-radius'] = `${borderRadius}px`;
        }

        const subTextStyle = {};
        if (colorSubText) {
            subTextStyle['color'] = colorSubText;
        }

        const mainTextStyle = {};
        if (colorMainText) {
            mainTextStyle['color'] = colorMainText;
        }

        // .lw-pr-custom-title-14 のクラス名生成
        let containerClassName = 'lw-pr-custom-title-14';
        if (alignmentPc) {
            containerClassName += ` ${alignmentPc}_pc`;
        }
        if (alignmentSp) {
            containerClassName += ` ${alignmentSp}_sp`;
        }

        const blockProps = useBlockProps.save({
            className: containerClassName,
            style: inlineStyle,
        });

        return (
            <div {...blockProps}>
                <TagName className="ttl">
                    {subTitle && (
                        <span className="sub">
                            <RichText.Content 
                                tagName="span" 
                                className="text" 
                                value={subTitle}
                                style={subTextStyle}
                            />
                        </span>
                    )}
                    {mainTitle && (
                        <RichText.Content 
                            tagName="span" 
                            className="main" 
                            value={mainTitle}
                            style={mainTextStyle}
                        />
                    )}
                </TagName>
            </div>
        );
    },
});