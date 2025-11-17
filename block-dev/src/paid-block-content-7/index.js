import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    ColorPalette,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    Button,
    TextControl,
    RadioControl,
} from '@wordpress/components';
import { Fragment, createElement } from '@wordpress/element';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

/* -------------------------------------------------- */
/* 共通オプション */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const sizeOptions = [
    { label: '大 (L)', value: 'font_size_l' },
    { label: '中 (M)', value: 'font_size_m' },
    { label: '小 (S)', value: 'font_size_s' },
];

/* -------------------------------------------------- */
/* ブロック登録 */
registerBlockType('wdl/paid-block-content-7', {
    title   : 'Content 07',
    icon    : 'lightbulb',
    category: 'liteword-other',
    supports: { anchor: true },

    /* 属性 */
    attributes: {
        /* PCカラム設定 */
        pcColumns: { type: 'string', default: '3' },

        /* タイトル */
        fontLi        : { type: 'string',  default: '' },
        fontColorLi   : { type: 'string',  default: '' },
        fontWeightLi  : { type: 'string',  default: '600' },

        /* タイトル font-size クラス */
        titleFontSizeClass: { type: 'string', default: 'font_size_m' },

        /* 説明文 */
        fontLiP          : { type: 'string',  default: '' },
        fontColorLiP     : { type: 'string',  default: 'var(--color-black)' },
        fontWeightLiP    : { type: 'string',  default: '400' },
        textFontSizeClass: { type: 'string', default: 'font_size_m' },

        /* 枠線（.image） */
        borderColor   : { type: 'string',  default: 'var(--color-main)' },
        borderSize    : { type: 'number',  default: 0 },

        /* .image 角丸 */
        imageBorderRadius : { type: 'number', default: 20 },

        /* .ttl 装飾 */
        titleTag         : { type: 'string',  default: 'h3' },
        titleBorderRadius: { type: 'number', default: 8 },
        titleBorderColor : { type: 'string', default: 'var(--color-main)' },
        titleBorderSize  : { type: 'number', default: 8 },

        /* リスト */
        contents: {
            type    : 'array',
            source  : 'query',
            selector: '.paid-block-content-7__li',
            query   : {
                image: {
                    type     : 'string',
                    source   : 'attribute',
                    selector : 'img',
                    attribute: 'src',
                },
                ttl: {
                    type    : 'string',
                    source  : 'html',
                    selector: '.ttl',
                },
                text: {
                    type    : 'string',
                    source  : 'html',
                    selector: '.paid-block-content-7__text',
                },
                url: {
                    type     : 'string',
                    source   : 'attribute',
                    selector : '.link',
                    attribute: 'href',
                    default  : '',
                },
            },
            default: [
                {
                    image: 'https://lite-word.com/sample_img/school/9.webp',
                    ttl  : '難関校合格実績',
                    text : '〇〇中学、××高校など、難関校への高い合格実績が自慢です。経験豊富なプロ講師陣が、志望校合格まで徹底的にサポートします。',
                },
                {
                    image: 'https://lite-word.com/sample_img/school/5.webp',
                    ttl  : '合格への最短ルート',
                    text : '長年の指導ノウハウを結集したオリジナル教材とカリキュラムで、基礎から応用まで無駄なく効率的に学力を伸ばし、合格へと導きます。',
                },
                {
                    image: 'https://lite-word.com/sample_img/school/3.webp',
                    ttl  : '自習室完備＆質問OK',
                    text : '静かで集中できる自習室を完備しています。わからないことはいつでも講師に質問可能。学習相談や進路指導も充実、安心して学習に専念できます。',
                },
            ],
        },
    },

    /* -------------------------------------------------- */
    /* エディタ */
    edit({ attributes, setAttributes }) {
        const {
            /* PCカラム */
            pcColumns,
            /* タイトル */
            fontLi, fontColorLi, fontWeightLi, titleFontSizeClass,
            /* 説明文 */
            fontLiP, fontColorLiP, fontWeightLiP, textFontSizeClass,
            /* 枠線 & 角丸 */
            borderColor, borderSize, imageBorderRadius,
            /* タイトル装飾 */
            titleTag, titleBorderRadius, titleBorderColor, titleBorderSize,
            /* リスト */
            contents,
        } = attributes;

        /* ---- リスト操作 ---- */
        const addContent = () => setAttributes({ contents: [...contents, { text: '新しいテキスト' }] });
        const removeContent = (i) => setAttributes({ contents: contents.filter((_, idx) => idx !== i) });
        const updateContent = (i, key, val) => {
            const arr = [...contents];
            arr[i][key] = val;
            setAttributes({ contents: arr });
        };

        /* PCカラムクラスの設定 */
        const columnClass = pcColumns === '2' ? 'clm_2' : '';

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="レイアウト設定" initialOpen={true}>
                        {/* PCカラム設定 */}
                        <RadioControl
                            label="PC表示カラム数"
                            selected={pcColumns}
                            options={[
                                { label: '3カラム', value: '3' },
                                { label: '2カラム', value: '2' }
                            ]}
                            onChange={(value) => setAttributes({ pcColumns: value })}
                        />
                    </PanelBody>

                    <PanelBody title="スタイル設定" initialOpen={false}>
                        {/* 画像枠線 */}
                        <p>画像枠線の色</p>
                        <ColorPalette value={borderColor} onChange={(v) => setAttributes({ borderColor: v })} />
                        <RangeControl label="画像枠線の太さ" value={borderSize} onChange={(v) => setAttributes({ borderSize: v })} min={0} max={10} />
                        <RangeControl label="画像角丸(px)" value={imageBorderRadius} onChange={(v) => setAttributes({ imageBorderRadius: v })} min={0} max={100} />

                        <hr />

                        {/* タイトル設定 */}
                        <SelectControl label="タイトルタグ" value={titleTag} options={[{ label: 'h3', value: 'h3' }, { label: 'h4', value: 'h4' }, { label: 'p', value: 'p' }]} onChange={(v) => setAttributes({ titleTag: v })} />
                        <p>タイトル文字色</p>
                        <ColorPalette value={fontColorLi} onChange={(v) => setAttributes({ fontColorLi: v })} />
                        <SelectControl label="タイトルフォント" value={fontLi} options={fontOptions} onChange={(v) => setAttributes({ fontLi: v })} />
                        <SelectControl label="タイトル太さ" value={fontWeightLi} options={fontWeightOptions} onChange={(v) => setAttributes({ fontWeightLi: v })} />
                        <SelectControl label="タイトルフォントサイズ" value={titleFontSizeClass} options={sizeOptions} onChange={(v) => setAttributes({ titleFontSizeClass: v })} />
                        <RangeControl label="タイトル角丸(px)" value={titleBorderRadius} onChange={(v) => setAttributes({ titleBorderRadius: v })} min={0} max={100} />
                        <p>タイトル下線の色</p>
                        <ColorPalette value={titleBorderColor} onChange={(v) => setAttributes({ titleBorderColor: v })} />
                        <RangeControl label="タイトル下線の太さ" value={titleBorderSize} onChange={(v) => setAttributes({ titleBorderSize: v })} min={0} max={10} />

                        <hr />

                        {/* 説明文 */}
                        <p>説明文文字色</p>
                        <ColorPalette value={fontColorLiP} onChange={(v) => setAttributes({ fontColorLiP: v })} />
                        <SelectControl label="説明文フォント" value={fontLiP} options={fontOptions} onChange={(v) => setAttributes({ fontLiP: v })} />
                        <SelectControl label="説明文太さ" value={fontWeightLiP} options={fontWeightOptions} onChange={(v) => setAttributes({ fontWeightLiP: v })} />
                        <SelectControl label="説明文フォントサイズ" value={textFontSizeClass} options={sizeOptions} onChange={(v) => setAttributes({ textFontSizeClass: v })} />
                    </PanelBody>
                </InspectorControls>

                {/* -------- エディター表示 -------- */}
                <div className="paid-block-content-7">
                    <ul className={`paid-block-content-7__inner ${columnClass}`}>
                        {contents.map((c, i) => (
                            <li key={i} className="paid-block-content-7__li">
                                {c.image && (
                                    <div
                                        className="image"
                                        style={{
                                            borderRadius: `${imageBorderRadius}px`,
                                            borderColor,
                                            borderWidth : borderSize,
                                            borderStyle : borderSize > 0 ? 'solid' : 'none',
                                        }}
                                    >
                                        <img src={c.image} alt="" />

                                        <RichText
                                            tagName={titleTag}
                                            className={`ttl ${titleFontSizeClass}`}
                                            value={c.ttl}
                                            data-lw_font_set={fontLi}
                                            onChange={(v) => updateContent(i, 'ttl', v)}
                                            placeholder="タイトル"
                                            style={{
                                                fontWeight  : fontWeightLi,
                                                fontFamily  : fontLi || undefined,
                                                color       : fontColorLi,
                                                borderRadius: `${titleBorderRadius}px`,
                                                borderBottomColor: titleBorderColor,
                                                borderBottomWidth: titleBorderSize,
                                                borderBottomStyle: titleBorderSize > 0 ? 'solid' : 'none',
                                            }}
                                        />
                                    </div>
                                )}

                                {/* 画像選択 */}
                                <MediaUpload
                                    onSelect={(m) => updateContent(i, 'image', m.url)}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open} isSecondary>{c.image ? '画像を変更' : '画像を選択'}</Button>
                                    )}
                                />
                                {c.image && (
                                    <Button isDestructive style={{ marginLeft: '8px' }} onClick={() => updateContent(i, 'image', '')}>画像を削除</Button>
                                )}

                                {/* 説明文 */}
                                <RichText
                                    tagName="p"
                                    className={`paid-block-content-7__text ${textFontSizeClass}`}
                                    value={c.text}
                                    data-lw_font_set={fontLiP}
                                    onChange={(v) => updateContent(i, 'text', v)}
                                    placeholder="テキストを入力"
                                    style={{
                                        fontWeight: fontWeightLiP,
                                        fontFamily: fontLiP || undefined,
                                        color     : fontColorLiP,
                                    }}
                                />

                                {/* URL */}
                                <TextControl
                                    label="リンクURL"
                                    value={c.url || ''}
                                    onChange={(v) => updateContent(i, 'url', v)}
                                    placeholder="https://example.com/"
                                    style={{ marginTop: '12px', maxWidth: '300px' }}
                                />

                                <Button className="paid-block-content-7__remove_btn" isDestructive onClick={() => removeContent(i)}>削除</Button>
                            </li>
                        ))}
                    </ul>

                    <Button className="paid-block-content-7__add_btn" isSecondary onClick={addContent}>リストを追加する</Button>
                </div>
            </Fragment>
        );
    },

    /* -------------------------------------------------- */
    /* 保存 */
    save({ attributes }) {
        const {
            pcColumns,
            fontLi, fontColorLi, fontWeightLi, titleFontSizeClass,
            fontLiP, fontColorLiP, fontWeightLiP, textFontSizeClass,
            borderColor, borderSize,
            imageBorderRadius,
            titleTag, titleBorderRadius, titleBorderColor, titleBorderSize,
            contents,
        } = attributes;

        /* PCカラムクラスの設定 */
        const columnClass = pcColumns === '2' ? 'clm_2' : '';

        return (
            <div className="paid-block-content-7">
                <ul className={`paid-block-content-7__inner ${columnClass}`.trim()}>
                    {contents.map((c, i) => {
                        const Tag   = c.url ? 'a' : 'div';
                        const props = c.url ? { href: c.url, className: 'link' } : { className: 'link' };

                        return (
                            <li key={i} className="paid-block-content-7__li">
                                {createElement(
                                    Tag,
                                    props,
                                    <>
                                        {c.image && (
                                            <div
                                                className="image"
                                                style={{
                                                    borderRadius: `${imageBorderRadius}px`,
                                                    borderColor,
                                                    borderWidth : borderSize,
                                                    borderStyle : borderSize > 0 ? 'solid' : 'none',
                                                }}
                                            >
                                                <img src={c.image} alt="" />
                                                <RichText.Content
                                                    tagName={titleTag}
                                                    className={`ttl ${titleFontSizeClass}`}
                                                    value={c.ttl}
                                                    data-lw_font_set={fontLi}
                                                    style={{
                                                        fontWeight : fontWeightLi,
                                                        fontFamily : fontLi || undefined,
                                                        color      : fontColorLi,
                                                        borderRadius: `${titleBorderRadius}px`,
                                                        borderBottomColor: titleBorderColor,
                                                        borderBottomWidth: titleBorderSize,
                                                        borderBottomStyle: titleBorderSize > 0 ? 'solid' : 'none',
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <RichText.Content
                                            tagName="p"
                                            className={`paid-block-content-7__text ${textFontSizeClass}`}
                                            value={c.text}
                                            data-lw_font_set={fontLiP}
                                            style={{
                                                fontWeight: fontWeightLiP,
                                                fontFamily: fontLiP || undefined,
                                                color     : fontColorLiP,
                                            }}
                                        />
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    },
});