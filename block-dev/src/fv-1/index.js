import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, URLInput, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, RangeControl, SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/fv-1', {
    title: '固定ページタイトル 01（トップ用）',
    icon: 'cover-image',
    category: 'liteword-firstview',
    supports: {
        anchor: true, 
    },
    attributes: {
        backgroundImage: { type: 'string', default: `https://cdn.pixabay.com/photo/2017/01/20/00/30/maldives-1993704_1280.jpg` },
        backgroundImageSp: { type: 'string', default: `` },
        mainTitle: { type: 'string', default: 'Lite Word' },
        subTitle: { type: 'string', default: 'シンプルで簡単なWordPressテーマ' },
        description: { type: 'string', default: '誰でも簡単にきれいなブログサイトが作れます！' },
        buttonText: { type: 'string', default: '無料ダウンロード' },
        buttonUrl: { type: 'string', default: '#' },
        openInNewTab: { type: 'boolean', default: false },
        buttonBackgroundColor: { type: 'string', default: '#fff' },
        buttonTextColor: { type: 'string', default: '#111' },
        buttonBorderColor: { type: 'string', default: '#000' },
        buttonBackgroundColorOpacity: { type: 'number', default: 100 },
        buttonBorderWidth: { type: 'number', default: 0 },
        buttonBorderRadius: { type: 'number', default: 200 },
        filterBackgroundColor: { type: 'string', default: 'var(--color-main)' },
        filterOpacity: { type: 'number', default: 0.4 },
        minHeightPc: { type: 'string', default: 'min-h-pc-500px' },
        minHeightTb: { type: 'string', default: 'min-h-tb-480px' },
        minHeightSp: { type: 'string', default: 'min-h-sp-440px' },
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const {
            backgroundImage, backgroundImageSp, mainTitle, subTitle, description, buttonText, buttonUrl, openInNewTab,
            buttonBackgroundColor, buttonTextColor, buttonBorderColor,buttonBackgroundColorOpacity, buttonBorderWidth, buttonBorderRadius,
            filterBackgroundColor, filterOpacity, minHeightPc, minHeightTb, minHeightSp
        } = attributes;

        const currentPostType = useSelect((select) => select('core/editor').getCurrentPostType());
        if (currentPostType !== 'page') {
            return <p>このブロックは固定ページでのみ使用できます。</p>;
        }

        const onChangeBackgroundImage = (media) => {
            setAttributes({ backgroundImage: media.url });
        };
        const onChangeBackgroundImageSp = (media) => {
            setAttributes({ backgroundImageSp: media.url });
        };

        return (
            <Fragment>
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
                    <PanelBody title="画像の上のフィルター">
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
                    <PanelBody title="リンクボタンの設定">
                        <p>リンク先URL</p>
                        <URLInput
                            value={buttonUrl}
                            onChange={(url) => setAttributes({ buttonUrl: url })}
                        />
                        <ToggleControl
                            label="新規タブで開く"
                            checked={openInNewTab}
                            onChange={() => setAttributes({ openInNewTab: !openInNewTab })}
                        />
                        <p>背景色</p>
                        <ColorPalette
                            value={buttonBackgroundColor}
                            onChange={(color) => setAttributes({ buttonBackgroundColor: color })}
                        />
                         <RangeControl
                            label="背景色の透明度"
                            value={buttonBackgroundColorOpacity}
                            onChange={(value) => setAttributes({ buttonBackgroundColorOpacity: value })}
                            min={0}
                            max={100}
                        />
                        <p>ボーダー色</p>
                        <ColorPalette
                            value={buttonBorderColor}
                            onChange={(color) => setAttributes({ buttonBorderColor: color })}
                        />
                        <RangeControl
                            label="ボーダー幅 (px)"
                            value={buttonBorderWidth}
                            onChange={(value) => setAttributes({ buttonBorderWidth: value })}
                            min={0}
                            max={10}
                        />
                        <RangeControl
                            label="ボーダーの角丸 (px)"
                            value={buttonBorderRadius}
                            onChange={(value) => setAttributes({ buttonBorderRadius: value })}
                            min={0}
                            max={50}
                        />
                        <p>文字の色</p>
                        <ColorPalette
                            value={buttonTextColor}
                            onChange={(color) => setAttributes({ buttonTextColor: color })}
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
                <div className={`fv-1 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}>
                    <h1>
                        <RichText
                            tagName="span"
                            className="main"
                            value={mainTitle}
                            onChange={(value) => setAttributes({ mainTitle: value })}
                            placeholder="メインタイトルを入力"
                        />
                        <RichText
                            tagName="span"
                            className="sub"
                            value={subTitle}
                            onChange={(value) => setAttributes({ subTitle: value })}
                            placeholder="サブタイトルを入力"
                        />
                    </h1>
                    <RichText
                        tagName="p"
                        value={description}
                        onChange={(value) => setAttributes({ description: value })}
                        placeholder="説明文を入力"
                    />
                    <a
                        className="button"
                        style={{
                            color: buttonTextColor,
                            borderColor: buttonBorderColor,
                            borderWidth: `${buttonBorderWidth}px`,
                            borderRadius: `${buttonBorderRadius}px`,
                            borderStyle: 'solid'
                        }}
                    >
                        <RichText
                            tagName="span"
                            value={buttonText}
                            onChange={(value) => setAttributes({ buttonText: value })}
                            placeholder="ボタンテキストを入力"
                        />
                        <div 
                            className="btn_bg"
                            style={{
                                backgroundColor: buttonBackgroundColor,
                                opacity: `${buttonBackgroundColorOpacity}%`,
                            }}
                        ></div>
                    </a>
                    <div className="filter" style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}></div>
                    <div className="bg_image">
                        {backgroundImage && <img src={backgroundImage} alt="背景画像" loading="eager" fetchpriority="high"/>}
                    </div>
                </div>
            </Fragment>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const {
            backgroundImage, backgroundImageSp, mainTitle, subTitle, description, buttonText, buttonUrl, openInNewTab,
            buttonBackgroundColor, buttonBackgroundColorOpacity, buttonTextColor, buttonBorderColor, buttonBorderWidth, buttonBorderRadius,
            filterBackgroundColor, filterOpacity, minHeightPc, minHeightTb, minHeightSp
        } = attributes;
    
        return (
            <div className={`fv-1 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}>
                <h1 className="ttl">
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
                </h1>
                <RichText.Content
                    tagName="p"
                    value={description}
                />
                <a
                    href={buttonUrl}
                    className="button"
                    target={openInNewTab ? '_blank' : undefined}
                    rel={openInNewTab ? 'noopener noreferrer' : undefined}
                    style={{
                        color: buttonTextColor,
                        borderColor: buttonBorderColor,
                        borderWidth: `${buttonBorderWidth}px`,
                        borderRadius: `${buttonBorderRadius}px`,
                        borderStyle: 'solid'
                    }}
                >
                    <RichText.Content
                        tagName="span"
                        value={buttonText}
                    />
                    <div
                        className="btn_bg"
                        style={{
                            backgroundColor: buttonBackgroundColor,
                            opacity: buttonBackgroundColorOpacity / 100,
                        }}
                    ></div>
                </a>
                <div className="filter" style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}></div>
                {backgroundImage && (
                    <picture className="bg_image">
                        <source srcSet={backgroundImageSp} media="(max-width: 800px)" />
                        <source srcSet={backgroundImage} media="(min-width: 801px)" />
                        <img src={backgroundImage} alt="背景画像" loading="eager" fetchpriority="high"/>
                    </picture>
                )}
            </div>
        );
    }
    
});
