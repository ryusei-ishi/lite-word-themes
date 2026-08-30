/**
 * バナー 03（3カラム）
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, Button ,RangeControl,ColorPalette } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';

import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

/* リンク先の指定（共通部品）で使う、配列の要素の中のキー名 */
const LINK_KEYS = { url: 'linkUrl', type: 'linkType', page: 'pageId', category: 'categoryId' };

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

const lwBlockDef = {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { items, titleFontFamily, titleFontWeight, pFontFamily, pFontWeight,
            filterBackgroundColor, filterOpacity, maxWidth
         } = attributes;

        // アイテムの更新処理
        const updateItem = (index, key, value) => updateItemMulti(index, { [key]: value });
        /* 画像を選び直したときに URL と alt をまとめて入れ替えるため、複数キー版を用意する */
        const updateItemMulti = (index, patch) => {
            const newItems = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
            setAttributes({ items: newItems });
        };

        // useBlockProps で apiVersion 3 対応
        const blockProps = useBlockProps({
            className: 'lw-banner-info-03'
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
                            <LinkPicker
                                link={lwLinkFromAttrs(item, LINK_KEYS)}
                                onChange={(patch) => updateItemMulti(index, lwLinkToAttrs(patch, LINK_KEYS))}
                            />
                            <ToggleControl
                                label="新規タブで開く"
                                checked={item.openInNewTab}
                                onChange={(value) => updateItem(index, 'openInNewTab', value)}
                            />
                            <p>画像</p>
                            <MediaUpload
                                onSelect={(media) => updateItemMulti(index, { imgUrl: media.url, alt: media.alt || '' })}
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
                            {item.imgUrl && (
                                <TextControl
                                    label="画像の説明（alt）"
                                    help="目の見えない方や検索エンジンに、この画像が何かを伝える文です。例：木のカウンターと観葉植物のある店内"
                                    value={item.alt || ''}
                                    onChange={(v) => updateItem(index, 'alt', v)}
                                    style={{ marginTop: '12px' }}
                                />
                            )}
                        </PanelBody>
                    ))}
                     <PanelBody title="レイアウト設定">
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
                <ul className="lw-banner-info-03__wrap" style={{maxWidth:maxWidth}}>
                        {items.map((item, index) => (
                            <li key={index}>
                                <div  className='a'>
                                    {item.imgUrl && <img loading="lazy" src={item.imgUrl} alt={item.alt || ''} />}
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
            filterBackgroundColor, filterOpacity, maxWidth
        } = attributes;

        // useBlockProps.save() で apiVersion 3 対応
        const blockProps = useBlockProps.save({
            className: 'lw-banner-info-03'
        });

        return (
            <nav {...blockProps}>
                <ul className="lw-banner-info-03__wrap" style={{maxWidth:maxWidth}}>
                    {items.map((item, index) => {
                        // リンクの有無をチェック
                        const hasLink = item.linkUrl && item.linkUrl.trim() !== '';
                        const WrapperTag = hasLink ? 'a' : 'div';
                        
                        // プロパティ設定
                        const wrapperProps = hasLink ? {
                            href: item.linkUrl,
                            'data-lw-link-type': lwLinkDataPropsFromAttrs(item, LINK_KEYS).linkType,
                            'data-lw-link-id': lwLinkDataPropsFromAttrs(item, LINK_KEYS).linkId,
                            target: item.openInNewTab ? '_blank' : undefined,
                            rel: item.openInNewTab ? 'noopener noreferrer' : undefined,
                        } : {
                            className: 'a'
                        };

                        return (
                            <li key={index}>
                                <WrapperTag {...wrapperProps}>
                                    {item.imgUrl && <img src={item.imgUrl} alt={item.alt || ''} />}
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
    // 旧マークアップ（リンクが無くても <a href="" data-open-in-new-tab="false"> を出していた頃）を
    // そのまま読めるようにしておく。これが無いと、その頃に作られたページが
    // 編集画面で「このブロックには、想定されていないか無効なコンテンツが含まれています」になる。
    // ⚠️ deprecated の中身は当時のコードの写し。きれいにしようとして書き換えないこと。
    deprecated: [
        {
            attributes: metadata.attributes,
            save: function (props) {
                    const { attributes } = props;
                    const { items, titleFontFamily, titleFontWeight, pFontFamily, pFontWeight,
                        filterBackgroundColor, filterOpacity, maxWidth
                    } = attributes;
            
                    // useBlockProps.save() で apiVersion 3 対応
                    const blockProps = useBlockProps.save({
                        className: 'lw-banner-info-03'
                    });
            
                    return (
                        <nav {...blockProps}>
                            <ul className="lw-banner-info-03__wrap" style={{maxWidth:maxWidth}}>
                                {items.map((item, index) => {
                                    // 旧版はリンクの有無にかかわらず <a> を出していた
                                    const WrapperTag = 'a';
                                    const wrapperProps = {
                                        href: item.linkUrl,
                                        target: item.openInNewTab ? '_blank' : undefined,
                                        rel: item.openInNewTab ? 'noopener noreferrer' : undefined,
                                        'data-open-in-new-tab': item.openInNewTab,
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
        },
    ],
};

/* ------------------------------------------------------------------
 * #1169（2026-08-27）既定値の他社CDN直リンクを自社素材に差し替えた。
 * 既定値と同じ値はブロックコメントに書かれないので、既定値のまま使っている
 * 既存ページは「保存HTMLは旧URL／ブロックは新しい既定値」で食い違う。
 * 旧既定値を持った版を残して、開いて保存し直しても画像が入れ替わらないようにする。
 * 🚨 save は現行と同じ関数をそのまま渡す（マークアップは変えていない）。
 * ------------------------------------------------------------------ */
const LW_1169_OLD = JSON.parse( JSON.stringify( metadata.attributes ) );
LW_1169_OLD.items.default[0].imgUrl = "https://picsum.photos/1000/1000?random=1";
LW_1169_OLD.items.default[1].imgUrl = "https://picsum.photos/1000/1000?random=2";
LW_1169_OLD.items.default[2].imgUrl = "https://picsum.photos/1000/1000?random=3";

/* 🚨 すでにある deprecated は attributes: metadata.attributes を使っている＝新しい既定値を指す。
 *    そのままだと「古い save ＋ 古い既定値」で保存されたページ（サンプル画像のまま使っている人の
 *    大多数がこれ）がどの版にも当たらなくなる。だから既存の版それぞれについて
 *    旧既定値を持たせた双子を作って先に並べる。元の版も残す（画像を自分で差し替えた人向け）。 */
const lwPrev1169 = lwBlockDef.deprecated || [];
lwBlockDef.deprecated = [
	{ attributes: LW_1169_OLD, save: lwBlockDef.save },
	...lwPrev1169.map( ( d ) => ( { ...d, attributes: LW_1169_OLD } ) ),
	...lwPrev1169,
];

registerBlockType( metadata.name, lwBlockDef );
