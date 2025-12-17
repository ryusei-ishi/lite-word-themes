import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, BlockControls, ColorPalette, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, RangeControl, SelectControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { backgroundImage, backgroundImageSp, filterBackgroundColor, filterOpacity, h1AfterColor, textColor, title, minHeightPc, minHeightTb, minHeightSp, headingLevel } = attributes;

        const onChangeBackgroundImage = (media) => {
            setAttributes({ backgroundImage: media.url });
        };
        const onChangeBackgroundImageSp = (media) => {
            setAttributes({ backgroundImageSp: media.url });
        };

        const onChangeTitle = (value) => {
            setAttributes({ title: value });
        };

        const onChangeHeadingLevel = (newLevel) => {
            setAttributes({ headingLevel: newLevel });
        };

        const TagName = `h${headingLevel}`;

        const blockProps = useBlockProps({
            className: `fv-2 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
        });

        return (
            <>
                {/* ▼ タイトルタグ切替ツールバー */}
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
                    <PanelBody title="背景画像設定">
                        <p>PCの時</p>
                        <MediaUpload
                            onSelect={onChangeBackgroundImage}
                            allowedTypes={['image']}
                            value={backgroundImage}
                            render={({ open }) => (
                                <>
                                    {backgroundImage ? (
                                        <>
                                            <img src={backgroundImage} alt="選択した背景画像" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                                            <Button
                                                onClick={() => setAttributes({ backgroundImage: '' })}
                                                variant="secondary"
                                                style={{ margin: '4px 4px 0 0' }}
                                            >
                                                画像を削除
                                            </Button>
                                        </>
                                    ) : null}
                                    <Button onClick={open} variant="secondary">
                                        画像を選択
                                    </Button>
                                </>
                            )}
                        />
                        <p style={{ marginTop: '16px' }}>スマホの時</p>
                        <MediaUpload
                            onSelect={onChangeBackgroundImageSp}
                            allowedTypes={['image']}
                            value={backgroundImageSp}
                            render={({ open }) => (
                                <>
                                    {backgroundImageSp ? (
                                        <>
                                            <img src={backgroundImageSp} alt="選択した背景画像" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                                            <Button
                                                onClick={() => setAttributes({ backgroundImageSp: '' })}
                                                variant="secondary"
                                                style={{ margin: '4px 4px 0 0' }}
                                            >
                                                画像を削除
                                            </Button>
                                        </>
                                    ) : null}
                                    <Button onClick={open} variant="secondary">
                                        画像を選択
                                    </Button>
                                </>
                            )}
                        />
                    </PanelBody>
                    <PanelBody title="画像の上のフィルターの色と透明度">
                        <p>色</p>
                        <ColorPalette
                            value={filterBackgroundColor}
                            onChange={(color) => setAttributes({ filterBackgroundColor: color })}
                        />
                        <p>透明度</p>
                        <RangeControl
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                    </PanelBody>
                    <PanelBody title="h1:afterの色設定">
                        <p>背景色</p>
                        <ColorPalette
                            value={h1AfterColor}
                            onChange={(color) => setAttributes({ h1AfterColor: color })}
                        />
                    </PanelBody>
                    <PanelBody title="テキストの色">
                        <p>文字の色</p>
                        <ColorPalette
                            value={textColor}
                            onChange={(color) => setAttributes({ textColor: color })}
                        />
                    </PanelBody>
                    <PanelBody title="高さ設定">
                        <p>PC用高さ</p>
                        <SelectControl
                            value={minHeightPc}
                            options={minHeightPcClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightPc: value })}
                        />
                        <p>タブレット用高さ</p>
                        <SelectControl
                            value={minHeightTb}
                            options={minHeightTbClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightTb: value })}
                        />
                        <p>スマートフォン用高さ</p>
                        <SelectControl
                            value={minHeightSp}
                            options={minHeightSpClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightSp: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <RichText
                        tagName={TagName}
                        value={title}
                        onChange={onChangeTitle}
                        placeholder="タイトルを入力"
                        style={{ color: textColor }}
                    />
                    <div
                        className="filter"
                        style={{
                            backgroundColor: filterBackgroundColor,
                            opacity: filterOpacity,
                        }}
                    ></div>
                    <div className="bg_image">
                        {backgroundImage && <img src={backgroundImage} alt="背景画像" loading="eager" fetchpriority="high"/>}
                    </div>
                    <style>
                        {`
                            .fv-2 h${headingLevel}:after {
                                background: ${h1AfterColor};
                            }
                        `}
                    </style>
                </div>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { backgroundImage, backgroundImageSp, filterBackgroundColor, filterOpacity, h1AfterColor, textColor, title, minHeightPc, minHeightTb, minHeightSp, headingLevel } = attributes;

        const TagName = `h${headingLevel}`;

        const blockProps = useBlockProps.save({
            className: `fv-2 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
        });

        return (
            <div {...blockProps}>
                <RichText.Content
                    tagName={TagName}
                    value={title}
                    className="ttl"
                    style={{ color: textColor }}
                />
                <div
                    className="filter"
                    style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}
                ></div>
                {backgroundImage && (
                    <picture className="bg_image">
                        <source srcSet={backgroundImageSp} media="(max-width: 800px)" />
                        <source srcSet={backgroundImage} media="(min-width: 801px)" />
                        <img src={backgroundImage} alt="背景画像" loading="eager" fetchpriority="high"/>
                    </picture>
                )}
                <style>
                    {`
                        .fv-2 h${headingLevel}:after {
                            background: ${h1AfterColor};
                        }
                    `}
                </style>
            </div>
        );
    }
});