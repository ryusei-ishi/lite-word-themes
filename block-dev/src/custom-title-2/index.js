import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/custom-title-2', {
    title: '見出しタイトル 02',
    icon: 'editor-textcolor',
    category: 'liteword-title',
    supports: {
        anchor: true, 
    },
    attributes: {
        mainTitle: { type: 'string', default: 'CONTENT' },
        subTitle: { type: 'string', default: 'SUB TITLE TEXT' },
        textAlignment: { type: 'string', default: 'left' },
        headingLevel: { type: 'number', default: 2 },
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, subTitle, textAlignment, headingLevel } = attributes;

        const onChangeMainTitle = (value) => {
            setAttributes({ mainTitle: value });
        };

        const onChangeSubTitle = (value) => {
            setAttributes({ subTitle: value });
        };

        const onChangeTextAlignment = (newAlignment) => {
            setAttributes({ textAlignment: newAlignment });
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
                        {[1 ,2, 3, 4, 5].map((level) => (
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
                </InspectorControls>
                <TagName className={`custom-title-2 ${alignmentClass}`}>
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
                </TagName>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { mainTitle, subTitle, textAlignment, headingLevel } = attributes;

        const alignmentClass = textAlignment === 'right' ? 'right' : textAlignment === 'center' ? 'center' : 'left';

        const TagName = `h${headingLevel}`;

        return (
            <TagName className={`custom-title-2 ${alignmentClass}`}>
                <RichText.Content
                    tagName="span"
                    className="main"
                    value={mainTitle}
                />
                <RichText.Content
                    tagName="span"
                    className="sub"
                    value={subTitle}
                />
            </TagName>
        );
    }
});
