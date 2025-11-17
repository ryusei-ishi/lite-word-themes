import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/custom-title-3', {
    title: '見出しタイトル 03',
    icon: 'editor-textcolor',
    category: 'liteword-title',
    supports: {
        anchor: true, 
    },
    attributes: {
        mainTitle: { type: 'string', default: 'CONTENT' },
        subTitle: { type: 'string', default: 'テキストテキストテキストテキスト<br>テキストテキキストテキスト' },
        textAlignment: { type: 'string', default: 'left' },
        accentColor: { type: 'string', default: 'var(--color-main)' },
        headingLevel: { type: 'number', default: 2 },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, subTitle, textAlignment, accentColor, headingLevel } = attributes;

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
                    <PanelBody title="文字位置設定">
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
                    <PanelBody title="アクセントカラー設定">
                        <ColorPalette
                            value={accentColor}
                            onChange={onChangeAccentColor}
                        />
                    </PanelBody>
                </InspectorControls>
                <TagName className={`custom-title-3 ${alignmentClass}`}>
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
        const { mainTitle, subTitle, textAlignment, accentColor, headingLevel } = attributes;

        const alignmentClass = textAlignment === 'right' ? 'right' : textAlignment === 'center' ? 'center' : 'left';
        const TagName = `h${headingLevel}`;

        return (
            <TagName className={`custom-title-3 ${alignmentClass}`}>
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
