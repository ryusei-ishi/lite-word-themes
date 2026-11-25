import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

// サイズの選択肢。値がそのままクラス名になる（main_size_l など）
const sizeOptions = (prefix) => [
    { label: '大 (L)', value: `${prefix}_size_l` },
    { label: '中 (M)', value: `${prefix}_size_m` },
    { label: '小 (S)', value: `${prefix}_size_s` },
];

// 今の大きさ（メイン＝大・サブ＝中）のときはクラスを付けない。
// 付けると、置いてある見出しの保存済み HTML と save() の出力がずれ、エディタで「無効なコンテンツ」になる。
const sizeClassNames = (mainSizeClass, subSizeClass) => {
    const classes = [];
    if (mainSizeClass === 'main_size_m' || mainSizeClass === 'main_size_s') {
        classes.push(mainSizeClass);
    }
    if (subSizeClass === 'sub_size_l' || subSizeClass === 'sub_size_s') {
        classes.push(subSizeClass);
    }
    return classes.length ? ` ${classes.join(' ')}` : '';
};

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { mainTitle, subTitle, textAlignment, headingLevel, mainSizeClass, subSizeClass } = attributes;

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

        const blockProps = useBlockProps({
            className: `custom-title-2 ${alignmentClass}${sizeClassNames(mainSizeClass, subSizeClass)}`,
        });

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
                    <PanelBody title="サイズ設定">
                        <RadioControl
                            label="メインタイトル"
                            selected={mainSizeClass}
                            options={sizeOptions('main')}
                            onChange={(value) => setAttributes({ mainSizeClass: value })}
                        />
                        <RadioControl
                            label="サブタイトル"
                            selected={subSizeClass}
                            options={sizeOptions('sub')}
                            onChange={(value) => setAttributes({ subSizeClass: value })}
                        />
                    </PanelBody>
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
                </InspectorControls>
                <TagName {...blockProps}>
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
        const { mainTitle, subTitle, textAlignment, headingLevel, mainSizeClass, subSizeClass } = attributes;

        const alignmentClass = textAlignment === 'right' ? 'right' : textAlignment === 'center' ? 'center' : 'left';

        const TagName = `h${headingLevel}`;

        const blockProps = useBlockProps.save({
            className: `custom-title-2 ${alignmentClass}${sizeClassNames(mainSizeClass, subSizeClass)}`,
        });

        return (
            <TagName {...blockProps}>
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
