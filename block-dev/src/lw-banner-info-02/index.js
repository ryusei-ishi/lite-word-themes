/**
 * バナー 02（4カラム）
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, Button ,RangeControl,ColorPalette } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';

import metadata from './block.json';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { items, titleFontFamily, titleFontWeight, pFontFamily, pFontWeight,
            filterBackgroundColor, filterOpacity
         } = attributes;

        // アイテムの更新処理
        const updateItem = (index, key, value) => {
            const newItems = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
            setAttributes({ items: newItems });
        };

        // useBlockProps で apiVersion 3 対応
        const blockProps = useBlockProps({
            className: 'lw-banner-info-02'
        });

        return (
            <nav {...blockProps}>
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
                <ul className="lw-banner-info-02__wrap">
                        {items.map((item, index) => (
                            <li key={index}>
                                <div className="a">
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
        );
    },
   save: function (props) {
        const { attributes } = props;
        const { items, titleFontFamily, titleFontWeight, pFontFamily, pFontWeight,
            filterBackgroundColor, filterOpacity
        } = attributes;

        // useBlockProps.save() で apiVersion 3 対応
        const blockProps = useBlockProps.save({
            className: 'lw-banner-info-02'
        });

        return (
            <nav {...blockProps}>
                <ul className="lw-banner-info-02__wrap">
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
