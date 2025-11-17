import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/custom-title-6', {
    title: '見出しタイトル 06',
    icon: 'editor-textcolor',
    category: 'liteword-title',
    supports: {
        anchor: true, 
    },
    attributes: {
        mainTitle: { type: 'string', default: 'CONTENT' },
        accentColor: { type: 'string', default: 'var(--color-main)' },
        headingLevel: { type: 'number', default: 2 },
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle,  accentColor, headingLevel } = attributes;

        const onChangeMainTitle = (value) => {
            setAttributes({ mainTitle: value });
        };

        const onChangeAccentColor = (newColor) => {
            setAttributes({ accentColor: newColor });
        };

        const onChangeHeadingLevel = (newLevel) => {
            setAttributes({ headingLevel: newLevel });
        };

        const TagName = `h${headingLevel}`;

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
                    <PanelBody title="アクセントカラー設定">
                        <ColorPalette
                            value={accentColor}
                            onChange={onChangeAccentColor}
                        />
                    </PanelBody>
                </InspectorControls>
                <TagName className={`custom-title-6`}>
                    <div className="main">
                        <RichText
                            tagName="span"
                            value={mainTitle}
                            onChange={onChangeMainTitle}
                            placeholder="メインタイトルを入力"
                     
                        />
                        <div className="accent" style={{ backgroundColor: accentColor }}></div>
                    </div>
             
                </TagName>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { mainTitle,  accentColor, headingLevel } = attributes;

        const TagName = `h${headingLevel}`;

        return (
            <TagName className={`custom-title-6`}>
                <div className="main">
                    <RichText.Content
                        tagName="span"
                        value={mainTitle}
                    />
                    <div className="accent" style={{ backgroundColor: accentColor }}></div>
                </div>
       
            </TagName>
        );
    }
});
