import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, ColorPalette, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, accentColor, headingLevel } = attributes;

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

        const blockProps = useBlockProps({
            className: 'custom-title-6',
        });

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
                <TagName {...blockProps}>
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
        const { mainTitle, accentColor, headingLevel } = attributes;

        const TagName = `h${headingLevel}`;

        const blockProps = useBlockProps.save({
            className: 'custom-title-6',
        });

        return (
            <TagName {...blockProps}>
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
