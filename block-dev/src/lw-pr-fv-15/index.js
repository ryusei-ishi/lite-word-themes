import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, BlockControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, TextControl, ToolbarGroup, ToolbarButton, ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const { 
            mainTitle, 
            description, 
            backgroundType, 
            videoUrl, 
            imageUrlPc, 
            imageUrlSp, 
            imageAlt,
            bgColor,
            filterColor, 
            filterOpacity, 
            videoSpeed, 
            headingLevel,
            strokeWidth,
            strokeWidthSp,
            strokeColor,
            strokeOpacity,
            titleColor,
            titleFontWeight,
            titleFont,
            descriptionColor,
            descriptionFontWeight,
            descriptionFont,
            showButton,
            buttonText,
            buttonUrl,
            ctaBgColor,
            ctaTextColor,
            ctaBorderRadius,
            ctaBorderWidth,
            ctaBorderColor
        } = attributes;

        const onChangeHeadingLevel = (newLevel) => {
            setAttributes({ headingLevel: newLevel });
        };

        // HEXをRGBに変換する関数
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        // RGBA形式に変換
        const rgb = hexToRgb(strokeColor);
        const strokeColorRgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${strokeOpacity})` : `rgba(255, 255, 255, ${strokeOpacity})`;

        const HeadingTag = `h${headingLevel}`;

        // フォントと太さのオプション
        const fontOptions = fontOptionsArr();
        const fontWeightOptions = fontWeightOptionsArr();

        const blockProps = useBlockProps({
            className: 'lw-pr-fv-15',
            style: {
                '--fv-color-bg-all': bgColor,
                '--color-image-filter': filterColor,
                '--fv-image-filter-opacity': filterOpacity,
                '--lw-stroke-width': `${strokeWidth}px`,
                '--lw-stroke-width-sp': `${strokeWidthSp}px`,
                '--lw-stroke-color': strokeColorRgba,
                '--color-fv-ttl-main': titleColor,
                '--fv-ttl-main-font-weight': titleFontWeight,
                '--color-fv-description-main': descriptionColor,
                '--fv-description-main-font-weight': descriptionFontWeight,
                '--color-cta-bg': ctaBgColor,
                '--color-cta-text': ctaTextColor,
                '--cta-border-radius': `${ctaBorderRadius}px`,
                '--cta-bd-width': `${ctaBorderWidth}px`,
                '--cta-bd-color': ctaBorderColor,
            }
        });

        return (
            <>
                <BlockControls>
                    <ToolbarGroup>
                        {[1, 2, 3, 4, 5].map(level => (
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
                    <PanelBody title="全体の背景色" initialOpen={false}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>背景色</p>
                        <ColorPalette
                            value={bgColor}
                            onChange={(color) => setAttributes({ bgColor: color })}
                        />
                    </PanelBody>

                    <PanelBody title="背景メディア" initialOpen={true}>
                        <SelectControl
                            label="背景タイプ"
                            value={backgroundType}
                            options={[
                                { label: '動画', value: 'video' },
                                { label: '画像', value: 'image' },
                            ]}
                            onChange={(value) => setAttributes({ backgroundType: value })}
                        />

                        {backgroundType === 'video' && (
                            <>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ videoUrl: media.url })}
                                    allowedTypes={['video']}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary" style={{ marginBottom: '10px' }}>
                                            {videoUrl ? '動画を変更' : '動画を選択'}
                                        </Button>
                                    )}
                                />
                                {videoUrl && (
                                    <video src={videoUrl} controls style={{ maxWidth: '100%', marginTop: '10px', marginBottom: '10px' }} />
                                )}
                                <RangeControl
                                    label="動画の再生速度"
                                    value={videoSpeed}
                                    onChange={(value) => setAttributes({ videoSpeed: value })}
                                    min={0.5}
                                    max={2.0}
                                    step={0.1}
                                />
                            </>
                        )}

                        {backgroundType === 'image' && (
                            <>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>PC用画像</p>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ imageUrlPc: media.url })}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary" style={{ marginBottom: '10px' }}>
                                            {imageUrlPc ? 'PC用画像を変更' : 'PC用画像を選択'}
                                        </Button>
                                    )}
                                />
                                {imageUrlPc && (
                                    <img src={imageUrlPc} alt="" style={{ maxWidth: '100%', marginBottom: '20px' }} />
                                )}

                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>スマホ用画像</p>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ imageUrlSp: media.url })}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary" style={{ marginBottom: '10px' }}>
                                            {imageUrlSp ? 'スマホ用画像を変更' : 'スマホ用画像を選択'}
                                        </Button>
                                    )}
                                />
                                {imageUrlSp && (
                                    <img src={imageUrlSp} alt="" style={{ maxWidth: '100%', marginBottom: '20px' }} />
                                )}

                                <TextControl
                                    label="画像のalt属性"
                                    value={imageAlt}
                                    onChange={(value) => setAttributes({ imageAlt: value })}
                                    placeholder="画像の説明を入力"
                                />
                            </>
                        )}

                        <hr style={{ margin: '20px 0', borderTop: '1px solid #ddd' }} />
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>フィルター色</p>
                        <ColorPalette
                            value={filterColor}
                            onChange={(color) => setAttributes({ filterColor: color })}
                        />
                        <RangeControl
                            label="フィルター透明度"
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    </PanelBody>

                    <PanelBody title="タイトル" initialOpen={false}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>文字色</p>
                        <ColorPalette
                            value={titleColor}
                            onChange={(color) => setAttributes({ titleColor: color })}
                        />
                        <SelectControl
                            label="フォント"
                            value={titleFont}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ titleFont: value })}
                        />
                        <SelectControl
                            label="太さ"
                            value={titleFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ titleFontWeight: value })}
                        />
                        <hr style={{ margin: '20px 0', borderTop: '1px solid #ddd' }} />
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>ストローク設定</p>
                        <RangeControl
                            label="ストローク幅（PC）"
                            value={strokeWidth}
                            onChange={(value) => setAttributes({ strokeWidth: value })}
                            min={0}
                            max={10}
                            step={1}
                        />
                        <RangeControl
                            label="ストローク幅（スマホ）"
                            value={strokeWidthSp}
                            onChange={(value) => setAttributes({ strokeWidthSp: value })}
                            min={0}
                            max={10}
                            step={1}
                        />
                        <p style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>ストローク色</p>
                        <ColorPalette
                            value={strokeColor}
                            onChange={(color) => setAttributes({ strokeColor: color })}
                        />
                        <RangeControl
                            label="ストローク透明度"
                            value={strokeOpacity}
                            onChange={(value) => setAttributes({ strokeOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    </PanelBody>

                    <PanelBody title="説明文" initialOpen={false}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>文字色</p>
                        <ColorPalette
                            value={descriptionColor}
                            onChange={(color) => setAttributes({ descriptionColor: color })}
                        />
                        <SelectControl
                            label="フォント"
                            value={descriptionFont}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ descriptionFont: value })}
                        />
                        <SelectControl
                            label="太さ"
                            value={descriptionFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ descriptionFontWeight: value })}
                        />
                    </PanelBody>

                    <PanelBody title="ボタン" initialOpen={false}>
                        <ToggleControl
                            label="ボタンを表示"
                            checked={showButton}
                            onChange={(value) => setAttributes({ showButton: value })}
                        />
                        {showButton && (
                            <>
                                <TextControl
                                    label="ボタンテキスト"
                                    value={buttonText}
                                    onChange={(value) => setAttributes({ buttonText: value })}
                                    placeholder="ボタンのテキストを入力"
                                />
                                <TextControl
                                    label="リンク先URL"
                                    value={buttonUrl}
                                    onChange={(value) => setAttributes({ buttonUrl: value })}
                                    placeholder="リンク先のURLを入力"
                                />
                                <hr style={{ margin: '20px 0', borderTop: '1px solid #ddd' }} />
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>ボタンスタイル</p>
                                <p style={{ fontWeight: 'bold', marginTop: '12px', marginBottom: '8px' }}>背景色</p>
                                <ColorPalette
                                    value={ctaBgColor}
                                    onChange={(color) => setAttributes({ ctaBgColor: color })}
                                />
                                <p style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>テキスト色</p>
                                <ColorPalette
                                    value={ctaTextColor}
                                    onChange={(color) => setAttributes({ ctaTextColor: color })}
                                />
                                <RangeControl
                                    label="角丸"
                                    value={ctaBorderRadius}
                                    onChange={(value) => setAttributes({ ctaBorderRadius: value })}
                                    min={0}
                                    max={100}
                                    step={1}
                                />
                                <RangeControl
                                    label="ボーダー幅"
                                    value={ctaBorderWidth}
                                    onChange={(value) => setAttributes({ ctaBorderWidth: value })}
                                    min={0}
                                    max={10}
                                    step={1}
                                />
                                <p style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>ボーダー色</p>
                                <ColorPalette
                                    value={ctaBorderColor}
                                    onChange={(color) => setAttributes({ ctaBorderColor: color })}
                                />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <div className="fv_inner">
                        <HeadingTag className="ttl" data-lw_font_set={titleFont}>
                            <RichText
                                tagName="span"
                                value={mainTitle}
                                onChange={(value) => setAttributes({ mainTitle: value })}
                                placeholder="タイトルを入力"
                            />
                        </HeadingTag>
                        <RichText
                            tagName="p"
                            className="description"
                            data-lw_font_set={descriptionFont}
                            value={description}
                            onChange={(value) => setAttributes({ description: value })}
                            placeholder="説明文を入力"
                        />
                        {showButton && (
                            <div className="cta_wrap">
                                <RichText
                                    tagName="a"
                                    value={buttonText}
                                    onChange={(value) => setAttributes({ buttonText: value })}
                                    placeholder="ボタンテキストを入力"
                                />
                            </div>
                        )}
                    </div>
                    <div className="bg_image">
                        {backgroundType === 'video' ? (
                            <video muted playsInline data-playback-rate={videoSpeed}>
                                <source src={videoUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={imageUrlPc || imageUrlSp} alt={imageAlt} />
                        )}
                    </div>
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const { 
            mainTitle, 
            description, 
            backgroundType, 
            videoUrl, 
            imageUrlPc, 
            imageUrlSp, 
            imageAlt,
            bgColor,
            filterColor, 
            filterOpacity, 
            videoSpeed, 
            headingLevel,
            strokeWidth,
            strokeWidthSp,
            strokeColor,
            strokeOpacity,
            titleColor,
            titleFontWeight,
            titleFont,
            descriptionColor,
            descriptionFontWeight,
            descriptionFont,
            showButton,
            buttonText,
            buttonUrl,
            ctaBgColor,
            ctaTextColor,
            ctaBorderRadius,
            ctaBorderWidth,
            ctaBorderColor
        } = attributes;

        // HEXをRGBに変換する関数
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        // RGBA形式に変換
        const rgb = hexToRgb(strokeColor);
        const strokeColorRgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${strokeOpacity})` : `rgba(255, 255, 255, ${strokeOpacity})`;

        const HeadingTag = `h${headingLevel}`;

        const blockProps = useBlockProps.save({
            className: 'lw-pr-fv-15',
            style: {
                '--fv-color-bg-all': bgColor,
                '--color-image-filter': filterColor,
                '--fv-image-filter-opacity': filterOpacity,
                '--lw-stroke-width': `${strokeWidth}px`,
                '--lw-stroke-width-sp': `${strokeWidthSp}px`,
                '--lw-stroke-color': strokeColorRgba,
                '--color-fv-ttl-main': titleColor,
                '--fv-ttl-main-font-weight': titleFontWeight,
                '--color-fv-description-main': descriptionColor,
                '--fv-description-main-font-weight': descriptionFontWeight,
                '--color-cta-bg': ctaBgColor,
                '--color-cta-text': ctaTextColor,
                '--cta-border-radius': `${ctaBorderRadius}px`,
                '--cta-bd-width': `${ctaBorderWidth}px`,
                '--cta-bd-color': ctaBorderColor,
            }
        });

        return (
            <div {...blockProps}>
                <div className="fv_inner">
                    <HeadingTag className="ttl" data-lw_font_set={titleFont}>
                        <RichText.Content value={mainTitle} />
                    </HeadingTag>
                    <RichText.Content tagName="p" className="description" data-lw_font_set={descriptionFont} value={description} />
                    {showButton && buttonText && buttonText.trim() !== '' && (
                        <div className="cta_wrap">
                            <a href={buttonUrl}>
                                <RichText.Content value={buttonText} />
                            </a>
                        </div>
                    )}
                </div>
                {backgroundType === 'video' ? (
                    <div className="bg_image">
                        <video autoPlay muted loop playsInline data-playback-rate={videoSpeed} className="lazy-video" style={{ display: 'none' }}>
                            <source src={videoUrl} type="video/mp4" />
                        </video>
                    </div>
                ) : (
                    <picture className="bg_image">
                        <source srcSet={imageUrlSp} media="(max-width: 800px)" />
                        <source srcSet={imageUrlPc} media="(min-width: 801px)" />
                        <img src={imageUrlPc} alt={imageAlt} />
                    </picture>
                )}
                {backgroundType === 'video' && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            document.addEventListener('DOMContentLoaded', function() {
                                const video = document.querySelector('.lw-pr-fv-15 .lazy-video');
                                if (video) {
                                    video.style.display = 'block';
                                    video.playbackRate = video.getAttribute('data-playback-rate');
                                }
                            });
                            `,
                        }}
                    />
                )}
            </div>
        );
    }
});