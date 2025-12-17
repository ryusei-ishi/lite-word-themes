import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, ColorPalette, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToolbarGroup, ToolbarButton, SelectControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType(metadata.name, {
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

        const blockProps = useBlockProps({
            className: className,
            style: { borderColor: mainTitleColor },
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
                <TagName {...blockProps}>
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

        const blockProps = useBlockProps.save({
            className: className,
            style: { borderColor: mainTitleColor },
        });

        return (
            <TagName {...blockProps}>
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
