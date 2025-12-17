import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, subTitle, headingLevel, subMarginBottomPc, subMarginBottomSp } = attributes;

        const onChangeMainTitle = (value) => {
            setAttributes({ mainTitle: value });
        };

        const onChangeSubTitle = (value) => {
            setAttributes({ subTitle: value });
        };

        const onChangeHeadingLevel = (newLevel) => {
            setAttributes({ headingLevel: newLevel });
        };

        const onChangeSubMarginBottomPc = (value) => {
            setAttributes({ subMarginBottomPc: value });
        };

        const onChangeSubMarginBottomSp = (value) => {
            setAttributes({ subMarginBottomSp: value });
        };

        const TagName = `h${headingLevel}`;

        const blockProps = useBlockProps({
            className: 'custom-title-4',
            style: {
                '--custom-title-sub-margin-bottom-pc': `${subMarginBottomPc}em`,
                '--custom-title-sub-margin-bottom-sp': `${subMarginBottomSp}em`,
            },
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
                    <PanelBody title="サブタイトルのマージン設定">
                        <RangeControl
                            label="PC版 下マージン (em)"
                            value={subMarginBottomPc}
                            onChange={onChangeSubMarginBottomPc}
                            min={-2}
                            max={4}
                            step={0.1}
                        />
                        <RangeControl
                            label="スマホ版 下マージン (em)"
                            value={subMarginBottomSp}
                            onChange={onChangeSubMarginBottomSp}
                            min={-2}
                            max={4}
                            step={0.1}
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
                    />
                    <RichText
                        tagName="span"
                        className="main"
                        value={mainTitle}
                        onChange={onChangeMainTitle}
                        placeholder="メインタイトルを入力"
                    />
                </TagName>
            </Fragment>
        );
    },

    save: function (props) {
        const { attributes } = props;
        const { mainTitle, subTitle, headingLevel, subMarginBottomPc, subMarginBottomSp } = attributes;

        const TagName = `h${headingLevel}`;

        const blockProps = useBlockProps.save({
            className: 'custom-title-4',
            style: {
                '--custom-title-sub-margin-bottom-pc': `${subMarginBottomPc}em`,
                '--custom-title-sub-margin-bottom-sp': `${subMarginBottomSp}em`,
            },
        });

        return (
            <TagName {...blockProps}>
                <RichText.Content
                    tagName="span"
                    className="sub"
                    value={subTitle}
                />
                <RichText.Content
                    tagName="span"
                    className="main"
                    value={mainTitle}
                />
            </TagName>
        );
    }
});
