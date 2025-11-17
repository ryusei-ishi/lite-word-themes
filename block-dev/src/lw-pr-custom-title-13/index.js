/**
 * LiteWord – 見出しタイトル 13
 * カスタムブロック
 */
import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    BlockControls,
    InspectorControls,
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

registerBlockType('wdl/lw-pr-custom-title-13', {
    /* ----------------------------------------------------------
     * 基本情報
     * -------------------------------------------------------- */
    title: '見出しタイトル 13',
    icon: 'editor-textcolor',
    category: 'liteword-title',
    supports: { anchor: true },

    /* ----------------------------------------------------------
     * 属性
     * -------------------------------------------------------- */
    attributes: {
        mainTitle: { type: 'string', default: 'カスタムタイトル' },
        subTitle: { type: 'string', default: 'サブタイトル' },
        headingLevel: { type: 'number', default: 2 },
        colorMain: { type: 'string', default: '#0a71c0' },
        colorMainText: { type: 'string', default: '' },
        colorSubText: { type: 'string', default: '' },
        orderReversed: { type: 'boolean', default: false },
        maxWidth: { type: 'number', default: 0 },
    },

    /* ----------------------------------------------------------
     * 編集画面
     * -------------------------------------------------------- */
    edit: ({ attributes, setAttributes }) => {
        const { mainTitle, subTitle, headingLevel, colorMain, colorMainText, colorSubText, orderReversed, maxWidth } = attributes;

        /* 変更ハンドラ */
        const onChangeMainTitle = (value) => setAttributes({ mainTitle: value });
        const onChangeSubTitle = (value) => setAttributes({ subTitle: value });
        const onChangeHeadingLevel = (level) => setAttributes({ headingLevel: level });
        const onChangeColorMain = (value) => setAttributes({ colorMain: value });
        const onChangeColorMainText = (value) => setAttributes({ colorMainText: value });
        const onChangeColorSubText = (value) => setAttributes({ colorSubText: value });
        const onToggleOrder = () => setAttributes({ orderReversed: !orderReversed });
        const onChangeMaxWidth = (value) => setAttributes({ maxWidth: value === undefined ? 0 : value });

        const TagName = `h${headingLevel}`;

        const inlineStyle = {
            '--color-main': colorMain,
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
                            help={orderReversed ? 'メインが上、サブが下' : 'サブが上、メインが下'}
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
                </InspectorControls>

                <div className="lw-pr-custom-title-13" style={inlineStyle}>
                    <TagName className="ttl">
                        {!orderReversed ? (
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
                        ) : (
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
                        )}
                        <div className="left"></div>
                        <div className="right"></div>
                    </TagName>
                </div>
            </Fragment>
        );
    },

    /* ----------------------------------------------------------
     * フロント出力
     * -------------------------------------------------------- */
    save: ({ attributes }) => {
        const { mainTitle, subTitle, headingLevel, colorMain, colorMainText, colorSubText, orderReversed, maxWidth } = attributes;

        // テキストが両方とも入力されていない場合は何も出力しない
        if (!mainTitle && !subTitle) {
            return null;
        }

        const TagName = `h${headingLevel}`;

        const inlineStyle = {
            '--color-main': colorMain,
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

        return (
            <div className="lw-pr-custom-title-13" style={inlineStyle}>
                <TagName className="ttl">
                    {!orderReversed ? (
                        <Fragment>
                            {subTitle && (
                                <RichText.Content tagName="span" className="sub" value={subTitle} />
                            )}
                            {mainTitle && (
                                <RichText.Content tagName="span" className="main" value={mainTitle} />
                            )}
                        </Fragment>
                    ) : (
                        <Fragment>
                            {mainTitle && (
                                <RichText.Content tagName="span" className="main" value={mainTitle} />
                            )}
                            {subTitle && (
                                <RichText.Content tagName="span" className="sub" value={subTitle} />
                            )}
                        </Fragment>
                    )}
                    <div className="left"></div>
                    <div className="right"></div>
                </TagName>
            </div>
        );
    },
});