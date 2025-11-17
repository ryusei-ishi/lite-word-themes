import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, BlockControls } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, TextControl, ToolbarGroup, ToolbarButton, ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/lw-pr-fv-16', {
    title: '固定ページタイトル 16(動画背景)',
    icon: 'cover-image',
    category: 'liteword-firstview',
    attributes: {
        mainTitle: { type: 'string', default: 'メインタイトル<br>メインタイトルタイトル' },
        description: { type: 'string', default: 'ここに説明文が入ります説明文が入りますここに説明文が入ります<br>ここに説明文が入りますここに説明文が入ります。' },
        backgroundType: { type: 'string', default: 'image' },
        videoUrl: { type: 'string', default: '' },
        imageUrlPc: { type: 'string', default: 'https://plus.unsplash.com/premium_photo-1670360414946-e33a828d1d52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171' },
        imageUrlSp: { type: 'string', default: '' },
        imageAlt: { type: 'string', default: '' },
        filterColor: { type: 'string', default: '#121416' },
        filterOpacity: { type: 'number', default: 0.2 },
        videoSpeed: { type: 'number', default: 1.0 },
        headingLevel: { type: 'number', default: 2 },
        strokeWidth: { type: 'number', default: 0 },
        strokeWidthSp: { type: 'number', default: 0 },
        strokeColor: { type: 'string', default: '#ffffff' },
        strokeOpacity: { type: 'number', default: 0.6 },
        titleColor: { type: 'string', default: '#fff' },
        titleFontWeight: { type: 'string', default: '600' },
        titleFont: { type: 'string', default: '' },
        descriptionColor: { type: 'string', default: '#fff' },
        descriptionFontWeight: { type: 'string', default: '400' },
        descriptionFont: { type: 'string', default: '' },
        fvInnerBgColor: { type: 'string', default: '#000000' },
        fvInnerBgOpacity: { type: 'number', default: 0.4 },
        showButton: { type: 'boolean', default: true },
        buttonText: { type: 'string', default: 'ご相談はこちら' },
        buttonUrl: { type: 'string', default: '' },
        ctaBgColor: { type: 'string', default: 'var(--color-main)' },
        ctaTextColor: { type: 'string', default: '#ffffff' },
        ctaBorderRadius: { type: 'number', default: 3 },
        ctaBorderWidth: { type: 'number', default: 0 },
        ctaBorderColor: { type: 'string', default: '#fff' },
        minHeightPc: { type: 'string', default: 'min-h-pc-100vh-header-60' },
        minHeightTb: { type: 'string', default: 'min-h-tb-100vh-header-80' },
        minHeightSp: { type: 'string', default: 'min-h-sp-100vh-header' },
    },
    edit: ({ attributes, setAttributes }) => {
        const { 
            mainTitle, 
            description, 
            backgroundType, 
            videoUrl, 
            imageUrlPc, 
            imageUrlSp, 
            imageAlt, 
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
            fvInnerBgColor,
            fvInnerBgOpacity,
            showButton,
            buttonText,
            buttonUrl,
            ctaBgColor,
            ctaTextColor,
            ctaBorderRadius,
            ctaBorderWidth,
            ctaBorderColor,
            minHeightPc,
            minHeightTb,
            minHeightSp
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
                    <PanelBody title="背景タイプ" initialOpen={true}>
                        <SelectControl
                            label="背景タイプを選択"
                            value={backgroundType}
                            options={[
                                { label: '動画', value: 'video' },
                                { label: '画像', value: 'image' },
                            ]}
                            onChange={(value) => setAttributes({ backgroundType: value })}
                        />
                    </PanelBody>

                    {backgroundType === 'video' && (
                        <PanelBody title="動画設定" initialOpen={false}>
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
                        </PanelBody>
                    )}

                    {backgroundType === 'image' && (
                        <PanelBody title="画像設定" initialOpen={false}>
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
                        </PanelBody>
                    )}

                    <PanelBody title="レイアウト設定" initialOpen={false}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>高さ設定</p>
                        <p style={{ fontSize: '13px', marginBottom: '8px' }}>PC用高さ</p>
                        <SelectControl
                            value={minHeightPc}
                            options={minHeightPcClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightPc: value })}
                        />
                        <p style={{ fontSize: '13px', marginBottom: '8px' }}>タブレット用高さ</p>
                        <SelectControl
                            value={minHeightTb}
                            options={minHeightTbClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightTb: value })}
                        />
                        <p style={{ fontSize: '13px', marginBottom: '8px' }}>スマートフォン用高さ</p>
                        <SelectControl
                            value={minHeightSp}
                            options={minHeightSpClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightSp: value })}
                        />
                    </PanelBody>

                    <PanelBody title="背景フィルター" initialOpen={false}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>画像フィルターの色</p>
                        <ColorPalette
                            value={filterColor}
                            onChange={(color) => setAttributes({ filterColor: color })}
                        />
                        <RangeControl
                            label="画像フィルターの透明度"
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                        <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>コンテンツ背景色</p>
                        <ColorPalette
                            value={fvInnerBgColor}
                            onChange={(color) => setAttributes({ fvInnerBgColor: color })}
                        />
                        <RangeControl
                            label="コンテンツ背景の透明度"
                            value={fvInnerBgOpacity}
                            onChange={(value) => setAttributes({ fvInnerBgOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    </PanelBody>

                    <PanelBody title="タイトルスタイル" initialOpen={false}>
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
                        <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>ストローク設定</p>
                        <RangeControl
                            label="ストロークの幅（PC）（px）"
                            value={strokeWidth}
                            onChange={(value) => setAttributes({ strokeWidth: value })}
                            min={0}
                            max={10}
                            step={1}
                        />
                        <RangeControl
                            label="ストロークの幅（スマホ）（px）"
                            value={strokeWidthSp}
                            onChange={(value) => setAttributes({ strokeWidthSp: value })}
                            min={0}
                            max={10}
                            step={1}
                        />
                        <p style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>ストロークの色</p>
                        <ColorPalette
                            value={strokeColor}
                            onChange={(color) => setAttributes({ strokeColor: color })}
                        />
                        <RangeControl
                            label="ストロークの透明度"
                            value={strokeOpacity}
                            onChange={(value) => setAttributes({ strokeOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    </PanelBody>

                    <PanelBody title="説明文スタイル" initialOpen={false}>
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

                    <PanelBody title="ボタン設定" initialOpen={false}>
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
                                <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>ボタンカラー</p>
                                <p style={{ fontSize: '13px', marginBottom: '8px' }}>背景色</p>
                                <ColorPalette
                                    value={ctaBgColor}
                                    onChange={(color) => setAttributes({ ctaBgColor: color })}
                                />
                                <p style={{ fontSize: '13px', marginTop: '16px', marginBottom: '8px' }}>テキスト色</p>
                                <ColorPalette
                                    value={ctaTextColor}
                                    onChange={(color) => setAttributes({ ctaTextColor: color })}
                                />
                                <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>ボタン形状</p>
                                <RangeControl
                                    label="角丸（px）"
                                    value={ctaBorderRadius}
                                    onChange={(value) => setAttributes({ ctaBorderRadius: value })}
                                    min={0}
                                    max={100}
                                    step={1}
                                />
                                <RangeControl
                                    label="ボーダー幅（px）"
                                    value={ctaBorderWidth}
                                    onChange={(value) => setAttributes({ ctaBorderWidth: value })}
                                    min={0}
                                    max={10}
                                    step={1}
                                />
                                <p style={{ fontSize: '13px', marginBottom: '8px' }}>ボーダー色</p>
                                <ColorPalette
                                    value={ctaBorderColor}
                                    onChange={(color) => setAttributes({ ctaBorderColor: color })}
                                />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
                <div 
                    className={`lw-pr-fv-16 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
                    style={{
                        '--color-image-filter': filterColor,
                        '--fv-image-filter-opacity': filterOpacity,
                        '--color-fv-inner-bg-filter': fvInnerBgColor,
                        '--fv-inner-bg-filter-opacity': fvInnerBgOpacity,
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
                    }}
                >
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
            fvInnerBgColor,
            fvInnerBgOpacity,
            showButton,
            buttonText,
            buttonUrl,
            ctaBgColor,
            ctaTextColor,
            ctaBorderRadius,
            ctaBorderWidth,
            ctaBorderColor,
            minHeightPc,
            minHeightTb,
            minHeightSp
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

        return (
            <div 
                className={`lw-pr-fv-16 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
                style={{
                    '--color-image-filter': filterColor,
                    '--fv-image-filter-opacity': filterOpacity,
                    '--color-fv-inner-bg-filter': fvInnerBgColor,
                    '--fv-inner-bg-filter-opacity': fvInnerBgOpacity,
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
                }}
            >
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
                                const video = document.querySelector('.lw-pr-fv-16 .lazy-video');
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