import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, ColorPalette, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, RangeControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, subTitle, textAlignment, accentColor, headingLevel,
            mainFontSizePc, mainFontSizeSp } = attributes;

        const onChangeMainTitle = (value) => {
            setAttributes({ mainTitle: value });
        };

        const onChangeSubTitle = (value) => {
            setAttributes({ subTitle: value });
        };

        const onChangeTextAlignment = (newAlignment) => {
            setAttributes({ textAlignment: newAlignment });
        };

        const onChangeAccentColor = (newColor) => {
            setAttributes({ accentColor: newColor });
        };

        const onChangeHeadingLevel = (newLevel) => {
            setAttributes({ headingLevel: newLevel });
        };

        const alignmentClass = textAlignment === 'right' ? 'right' : textAlignment === 'center' ? 'center' : 'left';
        const TagName = `h${headingLevel}`;

        /* 🚨 0 のときは style を1つも出さない（既定のままなら出力が変わらないようにするため） */
        const sizeStyle = {};
        if (mainFontSizePc) { sizeStyle['--ct3-main-pc'] = mainFontSizePc + 'px'; }
        if (mainFontSizeSp) { sizeStyle['--ct3-main-sp'] = mainFontSizeSp + 'px'; }

        const blockProps = useBlockProps(Object.assign(
            { className: `custom-title-3 ${alignmentClass}` },
            Object.keys(sizeStyle).length ? { style: sizeStyle } : {}
        ));

        return (
            <>
                <BlockControls>
                    <ToolbarGroup>
                        {[1 , 2, 3, 4, 5].map((level) => (
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
                    <PanelBody title="配置設定">
                        <RadioControl
                            selected={textAlignment}
                            options={[
                                { label: '右', value: 'right' },
                                { label: '中央', value: 'center' },
                                { label: '左', value: 'left' },
                            ]}
                            onChange={onChangeTextAlignment}
                        />
                    </PanelBody>
                    <PanelBody title="色設定">
                        <ColorPalette
                            value={accentColor}
                            onChange={onChangeAccentColor}
                        />
                    </PanelBody>
                    <PanelBody title="文字サイズ" initialOpen={false}>
                        <RangeControl
                            label="メインタイトル（PC）"
                            help="0 のままなら既定の 60px。日本語で長い見出しのときは小さくします"
                            value={mainFontSizePc}
                            onChange={(v) => setAttributes({ mainFontSizePc: v === undefined ? 0 : v })}
                            min={0}
                            max={96}
                            allowReset
                        />
                        <RangeControl
                            label="メインタイトル（スマホ）"
                            help="0 のままなら既定の 48px。375px では 5文字で画面いっぱいになるので、日本語なら 28〜32px を目安に"
                            value={mainFontSizeSp}
                            onChange={(v) => setAttributes({ mainFontSizeSp: v === undefined ? 0 : v })}
                            min={0}
                            max={72}
                            allowReset
                        />
                    </PanelBody>
                </InspectorControls>
                <TagName {...blockProps}>
                    <div className="main">
                        <RichText
                            tagName="span"
                            value={mainTitle}
                            onChange={onChangeMainTitle}
                            placeholder="メインタイトルを入力"
                        />
                    </div>
                    <div className="accent" style={{ backgroundColor: accentColor }}></div>
                    <div className="sub">
                        <RichText
                            tagName="span"
                            value={subTitle}
                            onChange={onChangeSubTitle}
                            placeholder="サブタイトルを入力"
                        />
                    </div>
                </TagName>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { mainTitle, subTitle, textAlignment, accentColor, headingLevel,
            mainFontSizePc, mainFontSizeSp } = attributes;

        const alignmentClass = textAlignment === 'right' ? 'right' : textAlignment === 'center' ? 'center' : 'left';
        const TagName = `h${headingLevel}`;

        /* 🚨🚨 **0（既定）のときは style 属性を1つも書き出さない。**
           こうしておけば、いま貼られているページのマークアップと1文字も変わらないので
           deprecated を書かなくてよい（block-change-safety.md の型）。 */
        const sizeStyle = {};
        if (mainFontSizePc) { sizeStyle['--ct3-main-pc'] = mainFontSizePc + 'px'; }
        if (mainFontSizeSp) { sizeStyle['--ct3-main-sp'] = mainFontSizeSp + 'px'; }

        const blockProps = useBlockProps.save(Object.assign(
            { className: `custom-title-3 ${alignmentClass}` },
            Object.keys(sizeStyle).length ? { style: sizeStyle } : {}
        ));

        return (
            <TagName {...blockProps}>
                <div className="main">
                    <RichText.Content
                        tagName="span"
                        value={mainTitle}
                    />
                </div>
                <div className="accent" style={{ backgroundColor: accentColor }}></div>
                <div className="sub">
                    <RichText.Content
                        tagName="span"
                        value={subTitle}
                    />
                </div>
            </TagName>
        );
    }
});
