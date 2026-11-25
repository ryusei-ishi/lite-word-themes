import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, ColorPalette, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

// 今の大きさ（中）のときはクラスを付けない。
// 付けると、置いてある見出しの保存済み HTML と save() の出力がずれ、エディタで「無効なコンテンツ」になる。
const sizeClassName = (sizeClass) => (sizeClass === 'size_l' || sizeClass === 'size_s' ? ` ${sizeClass}` : '');

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, accentColor, headingLevel, sizeClass } = attributes;

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
            className: `custom-title-6${sizeClassName(sizeClass)}`,
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
                    <PanelBody title="サイズ設定">
                        <RadioControl
                            label="サイズ"
                            selected={sizeClass}
                            options={[
                                { label: '大 (L)', value: 'size_l' },
                                { label: '中 (M)', value: 'size_m' },
                                { label: '小 (S)', value: 'size_s' },
                            ]}
                            onChange={(value) => setAttributes({ sizeClass: value })}
                        />
                    </PanelBody>
                    <PanelBody title="色設定">
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
        const { mainTitle, accentColor, headingLevel, sizeClass } = attributes;

        const TagName = `h${headingLevel}`;

        const blockProps = useBlockProps.save({
            className: `custom-title-6${sizeClassName(sizeClass)}`,
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
