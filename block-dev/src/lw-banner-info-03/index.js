import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, Button ,RangeControl,ColorPalette } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/lw-banner-info-03', {
    title: 'バナー 03（3カラム）',
    icon: 'images-alt2',
    category: 'liteword-banner',
    supports: {
        anchor: true, 
    },
    attributes: {
        filterBackgroundColor: {
            type: 'string',
            default: '#000',
        },
        filterOpacity: {
            type: 'number',
            default: 0.45,
        },
        maxWidth: {
            type: 'number',
            default: 800,
        },
        titleFontFamily: {
            type: 'string',
            default: "Noto Sans JP",
        },
        titleFontWeight: {
            type: 'string',
            default: "600",
        },
        pFontFamily: {
            type: 'string',
            default: "Noto Sans JP",
        },
        pFontWeight: {
            type: 'string',
            default: "400",
        },
        items: {
            type: 'array',
            default: [
                {
                    title: 'タイトルタイトル',
                    description: '説明テキスト説明テ',
                    imgUrl: 'https://picsum.photos/1000/1000?random=1',
                    linkUrl: '',
                    openInNewTab: false,
                },
                {
                    title: 'タイトルタイトル',
                    description: '説明テキスト説明テ',
                    imgUrl: 'https://picsum.photos/1000/1000?random=2',
                    linkUrl: '',
                    openInNewTab: false,
                },
                {
                    title: 'タイトルタイトル',
                    description: '説明テキスト説明テ',
                    imgUrl: 'https://picsum.photos/1000/1000?random=3',
                    linkUrl: '',
                    openInNewTab: false,
                },
            ],
        },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { items, titleFontFamily, titleFontWeight, pFontFamily, pFontWeight,
            filterBackgroundColor, filterOpacity, maxWidth
         } = attributes;

        // アイテムの更新処理
        const updateItem = (index, key, value) => {
            const newItems = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
            setAttributes({ items: newItems });
        };

        return (
            <>
                <InspectorControls>
                    {items.map((item, index) => (
                        <PanelBody title={`項目 ${index + 1}`} key={index}>
                            <TextControl
                                label="リンク先URL"
                                value={item.linkUrl}
                                onChange={(url) => updateItem(index, 'linkUrl', url)}
                            />
                            <ToggleControl
                                label="新規タブで開く"
                                checked={item.openInNewTab}
                                onChange={(value) => updateItem(index, 'openInNewTab', value)}
                            />
                            <p>画像</p>
                            <MediaUpload
                                onSelect={(media) => updateItem(index, 'imgUrl', media.url)}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <>
                                        {item.imgUrl ? (
                                            <div>
                                                <img src={item.imgUrl} alt="選択された画像" style={{ maxWidth: '100%', height: 'auto' }} />
                                                <Button onClick={open} isSecondary style={{ marginTop: '10px' }}>
                                                    画像を変更
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button onClick={open} isSecondary>
                                                画像を選択
                                            </Button>
                                        )}
                                    </>
                                )}
                            />
                        </PanelBody>
                    ))}
                     <PanelBody title="画像部分の最大横幅">
                        <RangeControl
                            label="最大幅 (px)"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={600}
                            max={1600}
                            step={8}
                        />
                     </PanelBody>
                    <PanelBody title="フィルター設定">
                        <p>フィルターの色</p>
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
                    <PanelBody title="フォント設定">
                        <p>タイトル部分</p>
                        <SelectControl
                            label="フォントの種類"
                            value={titleFontFamily}
                            options={fontOptions}
                            onChange={(newTitleFontFamily) => setAttributes({ titleFontFamily: newTitleFontFamily })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={titleFontWeight}
                            options={fontWeightOptions}
                            onChange={(newFontWeight) => setAttributes({ titleFontWeight: newFontWeight })}
                        />
                        <p>説明部分</p>
                        <SelectControl
                            label="フォントの種類"
                            value={pFontFamily}
                            options={fontOptions}
                            onChange={(newPFontFamily) => setAttributes({ pFontFamily: newPFontFamily })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={pFontWeight}
                            options={fontWeightOptions}
                            onChange={(newPFontWeight) => setAttributes({ pFontWeight: newPFontWeight })}
                        />
                    </PanelBody>
                </InspectorControls>
                <nav className="lw-banner-info-03">
                    <ul className="lw-banner-info-03__wrap" style={{maxWidth:maxWidth}}>
                        {items.map((item, index) => (
                            <li key={index}>
                                <div  className='a'>
                                    {item.imgUrl && <img loading="lazy" src={item.imgUrl} alt="画像サムネイル" />}
                                    <h3 className="title" style={{ fontWeight: titleFontWeight }} data-lw_font_set={titleFontFamily}>
                                        <RichText
                                            tagName="span"
                                            value={item.title}
                                            onChange={(value) => updateItem(index, 'title', value)}
                                            placeholder="タイトルを入力"
                                        />
                                    </h3>
                                    <p className="description" style={{ fontWeight: pFontWeight }} data-lw_font_set={pFontFamily}>
                                        <RichText
                                            tagName="span"
                                            value={item.description}
                                            onChange={(value) => updateItem(index, 'description', value)}
                                            placeholder="説明テキストを入力"
                                        />
                                    </p>
                                    <div 
                                        className="filter"
                                        style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}
                                    ></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { items, titleFontFamily, titleFontWeight, pFontFamily, pFontWeight,
            filterBackgroundColor, filterOpacity, maxWidth
        } = attributes;

        return (
            <nav className="lw-banner-info-03">
                <ul className="lw-banner-info-03__wrap" style={{maxWidth:maxWidth}}>
                    {items.map((item, index) => {
                        // リンクの有無をチェック
                        const hasLink = item.linkUrl && item.linkUrl.trim() !== '';
                        const WrapperTag = hasLink ? 'a' : 'div';
                        
                        // プロパティ設定
                        const wrapperProps = hasLink ? {
                            href: item.linkUrl,
                            target: item.openInNewTab ? '_blank' : undefined,
                            rel: item.openInNewTab ? 'noopener noreferrer' : undefined,
                        } : {
                            className: 'a'
                        };

                        return (
                            <li key={index}>
                                <WrapperTag {...wrapperProps}>
                                    {item.imgUrl && <img src={item.imgUrl} alt="" />}
                                    <h3 className="title" style={{ fontWeight: titleFontWeight }} data-lw_font_set={titleFontFamily}>
                                        <RichText.Content tagName="span" value={item.title} />
                                    </h3>
                                    <p className="description" style={{ fontWeight: pFontWeight }} data-lw_font_set={pFontFamily}>
                                        <RichText.Content tagName="span" value={item.description} />
                                    </p>
                                    <div 
                                        className="filter"
                                        style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}
                                    ></div>
                                </WrapperTag>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    },
});
