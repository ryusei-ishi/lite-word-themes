import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, ToolbarGroup, ToolbarButton, SelectControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/custom-title-5', {
    title: '見出しタイトル 05',
    icon: 'editor-textcolor',
    category: 'liteword-title',
    supports: {
        anchor: true, 
    },
    attributes: {
        subTitle: { type: 'string', default: '製品紹介' },
        mainTitle: { type: 'string', default: 'PRODUCTS' },
        headingLevel: { type: 'number', default: 2 },
        mainTitleColor: { type: 'string', default: 'var(--color-main)' },
        fontSize: { type: 'string', default: 'l' },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, subTitle, headingLevel, mainTitleColor, fontSize } = attributes;

        const onChangeMainTitle = (value) => {
            setAttributes({ mainTitle: value });
        };

        const onChangeSubTitle = (value) => {
            setAttributes({ subTitle: value });
        };

        const onChangeHeadingLevel = (newLevel) => {
            setAttributes({ headingLevel: newLevel });
        };

        const onChangeMainTitleColor = (color) => {
            setAttributes({ mainTitleColor: color });
        };

        const onChangeFontSize = (value) => {
            setAttributes({ fontSize: value });
        };

        const TagName = `h${headingLevel}`;
        
        // フォントサイズに応じたクラス名を生成
        const fontSizeClass = fontSize === 'm' ? 'font_size_m' : fontSize === 's' ? 'font_size_s' : '';
        const className = fontSizeClass ? `custom-title-5 ${fontSizeClass}` : 'custom-title-5';

        return (
            <>
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
                    <PanelBody title="カラー設定">
                        <p>メインタイトルカラー</p>
                        <ColorPalette
                            value={mainTitleColor}
                            onChange={onChangeMainTitleColor}
                        />
                    </PanelBody>
                    <PanelBody title="フォントサイズ設定">
                        <SelectControl
                            label="フォントサイズ"
                            value={fontSize}
                            options={[
                                { label: 'L (大)', value: 'l' },
                                { label: 'M (中)', value: 'm' },
                                { label: 'S (小)', value: 's' },
                            ]}
                            onChange={onChangeFontSize}
                        />
                    </PanelBody>
                </InspectorControls>
                <TagName className={className} style={{ borderColor: mainTitleColor }}>
                    <RichText
                        tagName="span"
                        className="sub"
                        value={subTitle}
                        onChange={onChangeSubTitle}
                        placeholder="サブタイトルを入力"
                        style={{ color: mainTitleColor }}
                    />
                    <RichText
                        tagName="span"
                        className="main"
                        value={mainTitle}
                        onChange={onChangeMainTitle}
                        placeholder="メインタイトルを入力"
                    />
                </TagName>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { mainTitle, subTitle, headingLevel, mainTitleColor, fontSize } = attributes;

        const TagName = `h${headingLevel}`;
        
        // フォントサイズに応じたクラス名を生成
        const fontSizeClass = fontSize === 'm' ? 'font_size_m' : fontSize === 's' ? 'font_size_s' : '';
        const className = fontSizeClass ? `custom-title-5 ${fontSizeClass}` : 'custom-title-5';

        return (
            <TagName className={className} style={{ borderColor: mainTitleColor }}>
                {subTitle && (
                    <RichText.Content
                        tagName="span"
                        className="sub"
                        value={subTitle}
                        style={{ color: mainTitleColor }}
                    />
                )}
                <RichText.Content
                    tagName="span"
                    className="main"
                    value={mainTitle}
                />
            </TagName>
        );
    }
});