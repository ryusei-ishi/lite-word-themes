/**
 * LiteWord – 見出しタイトル 11
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

registerBlockType('wdl/lw-pr-custom-title-11', {
    /* ----------------------------------------------------------
     * 基本情報
     * -------------------------------------------------------- */
    title: '見出しタイトル 11',
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
        borderRadius: { type: 'number', default: 0 },
        minHeightPc: { type: 'number', default: 0 },
        minHeightTb: { type: 'number', default: 0 },
        minHeightSp: { type: 'number', default: 0 },
    },

    /* ----------------------------------------------------------
     * 編集画面
     * -------------------------------------------------------- */
    edit: ({ attributes, setAttributes }) => {
        const { 
            mainTitle, 
            subTitle, 
            headingLevel, 
            colorMain, 
            colorMainText, 
            colorSubText, 
            orderReversed, 
            maxWidth, 
            borderRadius,
            minHeightPc,
            minHeightTb,
            minHeightSp
        } = attributes;

        /* 変更ハンドラ */
        const onChangeMainTitle = (value) => setAttributes({ mainTitle: value });
        const onChangeSubTitle = (value) => setAttributes({ subTitle: value });
        const onChangeHeadingLevel = (level) => setAttributes({ headingLevel: level });
        const onChangeColorMain = (value) => setAttributes({ colorMain: value });
        const onChangeColorMainText = (value) => setAttributes({ colorMainText: value });
        const onChangeColorSubText = (value) => setAttributes({ colorSubText: value });
        const onToggleOrder = () => setAttributes({ orderReversed: !orderReversed });
        const onChangeMaxWidth = (value) => setAttributes({ maxWidth: value === undefined ? 0 : value });
        const onChangeBorderRadius = (value) => setAttributes({ borderRadius: value === undefined ? 0 : value });
        const onChangeMinHeightPc = (value) => setAttributes({ minHeightPc: value === undefined ? 0 : value });
        const onChangeMinHeightTb = (value) => setAttributes({ minHeightTb: value === undefined ? 0 : value });
        const onChangeMinHeightSp = (value) => setAttributes({ minHeightSp: value === undefined ? 0 : value });

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
            inlineStyle['width'] = '100%';
            inlineStyle['margin'] = '1em auto';
        }

        if (borderRadius > 0) {
            inlineStyle['width'] = '100%';
            inlineStyle['margin'] = '1em auto';
        }

        if (minHeightPc > 0) {
            inlineStyle['--min-height-pc'] = `${minHeightPc}px`;
        }

        if (minHeightTb > 0) {
            inlineStyle['--min-height-tb'] = `${minHeightTb}px`;
        }

        if (minHeightSp > 0) {
            inlineStyle['--min-height-sp'] = `${minHeightSp}px`;
        }

        const ttlStyle = {};
        if (borderRadius > 0) {
            ttlStyle['borderRadius'] = `${borderRadius}px`;
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
                            help={maxWidth > 0 ? `${maxWidth}px` : '未設定(デフォルト幅)'}
                        />
                    </PanelBody>
                    <PanelBody title="最小高さ設定">
                        <RangeControl
                            label="最小高さ PC (px)"
                            value={minHeightPc || undefined}
                            onChange={onChangeMinHeightPc}
                            min={0}
                            max={500}
                            step={10}
                            allowReset={true}
                            help={minHeightPc > 0 ? `${minHeightPc}px` : '未設定(auto)'}
                        />
                        <RangeControl
                            label="最小高さ タブレット (px)"
                            value={minHeightTb || undefined}
                            onChange={onChangeMinHeightTb}
                            min={0}
                            max={500}
                            step={10}
                            allowReset={true}
                            help={minHeightTb > 0 ? `${minHeightTb}px` : '未設定(PCの設定を継承)'}
                        />
                        <RangeControl
                            label="最小高さ SP (px)"
                            value={minHeightSp || undefined}
                            onChange={onChangeMinHeightSp}
                            min={0}
                            max={500}
                            step={10}
                            allowReset={true}
                            help={minHeightSp > 0 ? `${minHeightSp}px` : '未設定(タブレットの設定を継承)'}
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
                            max={50}
                            step={1}
                            allowReset={true}
                            help={borderRadius > 0 ? `${borderRadius}px` : '角丸なし'}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="lw-pr-custom-title-11" style={inlineStyle}>
                    <TagName className="ttl" style={ttlStyle}>
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
                    </TagName>
                </div>
            </Fragment>
        );
    },

    /* ----------------------------------------------------------
     * フロント出力
     * -------------------------------------------------------- */
    save: ({ attributes }) => {
        const { 
            mainTitle, 
            subTitle, 
            headingLevel, 
            colorMain, 
            colorMainText, 
            colorSubText, 
            orderReversed, 
            maxWidth, 
            borderRadius,
            minHeightPc,
            minHeightTb,
            minHeightSp
        } = attributes;

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
            inlineStyle['width'] = '100%';
            inlineStyle['margin'] = '1em auto';
        }

        if (borderRadius > 0) {
            inlineStyle['width'] = '100%';
            inlineStyle['margin'] = '1em auto';
        }

        if (minHeightPc > 0) {
            inlineStyle['--min-height-pc'] = `${minHeightPc}px`;
        }

        if (minHeightTb > 0) {
            inlineStyle['--min-height-tb'] = `${minHeightTb}px`;
        }

        if (minHeightSp > 0) {
            inlineStyle['--min-height-sp'] = `${minHeightSp}px`;
        }

        const ttlStyle = {};
        if (borderRadius > 0) {
            ttlStyle['borderRadius'] = `${borderRadius}px`;
        }

        return (
            <div className="lw-pr-custom-title-11" style={inlineStyle}>
                <TagName className="ttl" style={ttlStyle}>
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
                </TagName>
            </div>
        );
    },
});