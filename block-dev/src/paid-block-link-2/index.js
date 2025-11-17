import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    ColorPalette
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    Button,
    TextControl
} from '@wordpress/components';
import { Fragment, createElement } from '@wordpress/element';

// ▼ 別ファイル「utils.js」などからアイコンの配列をインポートする想定
import {
    fontOptionsArr,
    fontWeightOptionsArr,
    serviceInfoIconSvgArr
} from '../utils.js';

import './style.scss';
import './editor.scss';

// フォント選択肢・フォントウェイト選択肢・アイコン選択肢
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const iconSvgOptions = serviceInfoIconSvgArr();

// カスタムブロックを定義
registerBlockType('wdl/paid-block-link-2', {
    title: 'リンクリスト 2',
    icon: 'lightbulb',
    category: 'liteword-other',
    supports: {
        anchor: true,
    },
    attributes: {
        // ====== リッチテキストなど ======
        mainTitle: {
            type: 'string',
            source: 'html',
            selector: '.main_title_text',
            default: 'INFORMATION'
        },
        titleBdColor: {
            type: 'string',
            default: '#da5959'
        },
        subTitle: {
            type: 'string',
            source: 'html',
            selector: '.sub',
            default: 'インフォメーション'
        },
        mainExplanation: {
            type: 'string',
            source: 'html',
            selector: '.main_explanation',
            default: 'テキストテキストテキストテキスト'
        },

        // ====== タイトル・説明のフォント等 ======
        fontLi: {
            type: 'string',
            default: ''
        },
        fontColorLi: {
            type: 'string',
            default: '#fff'
        },
        fontWeightLi: {
            type: 'string',
            default: '500'
        },
        fontLiP: {
            type: 'string',
            default: ''
        },
        fontColorLiP: {
            type: 'string',
            default: '#fff'
        },
        fontWeightLiP: {
            type: 'string',
            default: '400'
        },

        // ====== 背景・枠線関連 ======
        backgroundColor: {
            type: 'string',
            default: 'rgba(0, 0, 0, 0)'
        },
        backgroundOpacity: {
            type: 'number',
            default: 0.5
        },
        borderColor: {
            type: 'string',
            default: '#fff'
        },
        borderSize: {
            type: 'number',
            default: 2
        },

        // ====== フィルター用の色設定 ======
        bgFilterColor: {
            type: 'string',
            default: '#000'
        },
        bgFilterOpacity: {
            type: 'number',
            default: 0.7
        },

        // ====== 背景画像 ======
        bgImageUrl: {
            type: 'string',
            default: 'https://lite-word.com/sample_img/forest/1.webp'
        },

        // ====== 繰り返し要素(リンクリスト) ======
        contents: {
            type: 'array',
            source: 'query',
            selector: '.item',
            query: {
                ttl: {
                    type: 'string',
                    source: 'html',
                    selector: 'h4.ttl'
                },
                text: {
                    type: 'string',
                    source: 'html',
                    selector: 'p.desc'
                },
                url: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.link',
                    attribute: 'href',
                    default: ''
                },
                // ▼ icon は「data-icon 属性」として保存・読み込み
                icon: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.selected_icon',
                    attribute: 'data-icon',
                    default: ''
                },
                // ▼ 新規追加: リストごとの画像URL（data-img 属性に保持）
                imageUrl: {
                    type: 'string',
                    source: 'attribute',
                    selector: 'img.selected_image', // もしくは .selected_image
                    attribute: 'data-img',
                    default: ''
                },
            },
            default: [
                {
                    ttl: 'タイトルタイトル',
                    text: 'テキストテキスト ',
                    url: '',
                    icon: '',
                    imageUrl: ''
                },
                {
                    ttl: 'タイトルタイトル',
                    text: 'テキストテキスト ',
                    url: '',
                    icon: '',
                    imageUrl: ''
                },
                {
                    ttl: 'タイトルタイトル',
                    text: 'テキストテキスト ',
                    url: '',
                    icon: '',
                    imageUrl: ''
                },
            ],
        },
    },



    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            mainTitle, subTitle, mainExplanation, titleBdColor,
            fontLi, fontColorLi, fontWeightLi,
            fontLiP, fontColorLiP, fontWeightLiP,
            backgroundColor, backgroundOpacity,
            borderColor, borderSize,
            bgFilterColor, bgFilterOpacity,
            bgImageUrl,
            contents
        } = attributes;

        // リスト追加
        const addContent = () => {
            const newItem = {
                ttl: '新しいタイトル',
                text: '新しいテキスト',
                url: '',
                icon: '',
                imageUrl: ''
            };
            setAttributes({ contents: [...contents, newItem] });
        };

        // リスト削除
        const removeContent = (index) => {
            const newContents = contents.filter((_, i) => i !== index);
            setAttributes({ contents: newContents });
        };

        // リスト更新
        const updateContent = (index, key, value) => {
            const newContents = [...contents];
            newContents[index][key] = value;
            setAttributes({ contents: newContents });
        };

        return (
            <Fragment>
                <InspectorControls>

                    {/* ── 1. 使い方ガイド ── */}
                    <PanelBody title="📚 使い方ガイド" initialOpen={true}>
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <Button
                                variant="secondary"
                                href="https://www.youtube.com/watch?v=ixzfHmZmCPA"
                                target="_blank"
                                style={{ width: '100%' }}
                            >
                                🎥 このブロックの使い方を見る
                            </Button>
                        </div>
                        <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                            背景画像の上にリンクリストを表示できるブロックです。各項目にアイコンや画像を設定できます。
                        </p>
                    </PanelBody>

                    {/* ── 2. 背景の設定 ── */}
                    <PanelBody title="🖼️ 背景の設定" initialOpen={false}>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>📸 背景画像</p>
                            <MediaUpload
                                onSelect={ (media) => setAttributes({ bgImageUrl: media.url }) }
                                allowedTypes={ ['image'] }
                                render={ ({ open }) => (
                                    <Button 
                                        onClick={ open }
                                        variant="secondary"
                                        style={{ width: '100%', marginBottom: '10px' }}
                                    >
                                        背景画像を選択
                                    </Button>
                                ) }
                            />
                            { bgImageUrl && (
                                <div>
                                    <img
                                        src={ bgImageUrl }
                                        alt="プレビュー"
                                        style={{ 
                                            maxWidth: '100%', 
                                            height: 'auto', 
                                            borderRadius: '4px',
                                            marginBottom: '10px'
                                        }}
                                    />
                                    <Button
                                        onClick={ () => setAttributes({ bgImageUrl: '' }) }
                                        variant="secondary"
                                        style={{ width: '100%' }}
                                    >
                                        背景画像を削除
                                    </Button>
                                </div>
                            ) }
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🌫️ 背景フィルターの色</p>
                            <ColorPalette
                                value={ bgFilterColor }
                                onChange={ (color) => setAttributes({ bgFilterColor: color }) }
                            />
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                背景画像の上に重ねる色を設定します
                            </p>
                        </div>

                        <RangeControl
                            label="🔍 背景フィルターの透明度"
                            value={ bgFilterOpacity }
                            onChange={ (val) => setAttributes({ bgFilterOpacity: val }) }
                            min={0} max={1} step={0.01}
                            help="数値が大きいほど背景画像が見えにくくなります"
                            allowReset
                            resetFallbackValue={0.7}
                        />
                    </PanelBody>

                    {/* ── 3. タイトルセクション ── */}
                    <PanelBody title="📝 タイトルセクション" initialOpen={false}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎯 タイトル下線の色</p>
                            <ColorPalette
                                value={ titleBdColor }
                                onChange={ (color) => setAttributes({ titleBdColor: color }) }
                            />
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                メインタイトルの下に表示される線の色です
                            </p>
                        </div>
                    </PanelBody>

                    {/* ── 4. リスト項目の見た目 ── */}
                    <PanelBody title="🎨 リスト項目の見た目" initialOpen={false}>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🏷️ 各項目の背景色</p>
                            <ColorPalette
                                value={ backgroundColor }
                                onChange={ (c) => setAttributes({ backgroundColor: c }) }
                            />
                            <RangeControl
                                label="背景の透明度"
                                value={ backgroundOpacity }
                                onChange={ (v) => setAttributes({ backgroundOpacity: v }) }
                                min={0} max={1} step={0.01}
                                help="0で透明、1で完全に不透明になります"
                                allowReset
                                resetFallbackValue={0.5}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🖍️ 項目の枠線色</p>
                            <ColorPalette
                                value={ borderColor }
                                onChange={ (c) => setAttributes({ borderColor: c }) }
                            />
                            <RangeControl
                                label="枠線の太さ (px)"
                                value={ borderSize }
                                onChange={ (v) => setAttributes({ borderSize: v }) }
                                min={0} max={10}
                                help="0にすると枠線が表示されません"
                            />
                        </div>
                    </PanelBody>

                    {/* ── 5. 文字スタイル設定 ── */}
                    <PanelBody title="✍️ 文字スタイル設定" initialOpen={false}>
                        <div style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            padding: '15px', 
                            marginBottom: '20px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                                📋 リスト項目のタイトル
                            </p>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🌈 文字色</p>
                                <ColorPalette
                                    value={ fontColorLi }
                                    onChange={ (c) => setAttributes({ fontColorLi: c }) }
                                />
                            </div>

                            <SelectControl
                                label="📚 フォントの種類"
                                value={ fontLi }
                                options={ fontOptions }
                                onChange={ (v) => setAttributes({ fontLi: v }) }
                            />
                            
                            <SelectControl
                                label="💪 フォントの太さ"
                                value={ fontWeightLi }
                                options={ fontWeightOptions }
                                onChange={ (v) => setAttributes({ fontWeightLi: v }) }
                            />
                        </div>

                        <div style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            padding: '15px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                                📄 説明文
                            </p>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🌈 文字色</p>
                                <ColorPalette
                                    value={ fontColorLiP }
                                    onChange={ (c) => setAttributes({ fontColorLiP: c }) }
                                />
                            </div>

                            <SelectControl
                                label="📚 フォントの種類"
                                value={ fontLiP }
                                options={ fontOptions }
                                onChange={ (v) => setAttributes({ fontLiP: v }) }
                            />
                            
                            <SelectControl
                                label="💪 フォントの太さ"
                                value={ fontWeightLiP }
                                options={ fontWeightOptions }
                                onChange={ (v) => setAttributes({ fontWeightLiP: v }) }
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>

                {/* ========== Edit画面でのプレビュー ========== */}
                <div className="paid-block-link-2">
                    <div className="this_wrap">
                        <h2 className="main_ttl">
                            <span className="main">
                                <RichText
                                    tagName="span"
                                    className="main_title_text"
                                    allowedFormats={ [] }
                                    value={ mainTitle }
                                    onChange={ (val) => setAttributes({ mainTitle: val }) }
                                    placeholder="メインタイトルを入力"
                                />
                                <div
                                    className="bd"
                                    style={{ backgroundColor: titleBdColor }}
                                />
                            </span>
                            <RichText
                                tagName="span"
                                className="sub"
                                allowedFormats={ [] }
                                value={ subTitle }
                                onChange={ (val) => setAttributes({ subTitle: val }) }
                                placeholder="サブタイトルを入力"
                            />
                        </h2>

                        <RichText
                            tagName="p"
                            className="main_explanation"
                            allowedFormats={ [] }
                            value={ mainExplanation }
                            onChange={ (val) => setAttributes({ mainExplanation: val }) }
                            placeholder="メインの説明文を入力"
                        />

                        <ul className="this_items">
                            { contents.map((content, index) => (
                                <li
                                    key={ index }
                                    className="item"
                                    style={{
                                        borderColor: borderColor,
                                        borderWidth: borderSize,
                                        borderStyle: borderSize > 0 ? 'solid' : 'none'
                                    }}
                                >
                                    <div
                                        className="bg_item"
                                        style={{
                                            backgroundColor: backgroundColor,
                                            opacity: backgroundOpacity
                                        }}
                                    />

                                    {/* ▼ アイコン選択UI + 画像アップロードUI */}
                                    <div className="icon_select_area" >
                                        {/* アイコン選択 */}
                                        <SelectControl
                                            className="icon_select"
                                            value={ content.icon }
                                            options={ iconSvgOptions }
                                            onChange={ (newIcon) => {
                                                updateContent(index, 'icon', newIcon);
                                            }}
                                        />
                                        <div className='madia_upload_area'>
                                            {/* 画像アップロード */}
                                            <MediaUpload
                                                onSelect={ (media) => {
                                                    updateContent(index, 'imageUrl', media.url);
                                                }}
                                                allowedTypes={ ['image'] }
                                                render={ ({ open }) => (
                                                    <Button onClick={ open }>
                                                        画像を選択
                                                    </Button>
                                                ) }
                                            />
                                            {/* 画像プレビュー & 削除ボタン */}
                                            { content.imageUrl && (
                                                <div>
                                                    <Button
                                                        onClick={ () => updateContent(index, 'imageUrl', '') }
                                                        style={{ backgroundColor:'#d15656', }}
                                                    >
                                                        画像を削除
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* アイコン or 画像 プレビューエリア (エディター上) */}
                                        <div style={{ marginTop: '10px' }}>
                                            { content.imageUrl ? (
                                                // 画像がある場合は画像を優先
                                                <div className="selected_image_area">
                                                    <img
                                                        className="selected_image"
                                                        data-img={ content.imageUrl }
                                                        src={ content.imageUrl }
                                                    />
                                                </div>
                                            ) : content.icon ? (
                                                // 画像が無い場合のみアイコン表示
                                                <div
                                                    className="selected_icon"
                                                    data-icon={ content.icon }
                                                    dangerouslySetInnerHTML={{ __html: content.icon }}
                                                />
                                            ) : (
                                                <p></p>
                                            ) }
                                        </div>
                                    </div>

                                    {/* ▼ タイトル＆説明 */}
                                    <span className="item_ttl">
                                        <RichText
                                            tagName="h4"
                                            className="ttl"
                                            allowedFormats={ [] }
                                            value={ content.ttl }
                                            onChange={ (val) => updateContent(index, 'ttl', val) }
                                            placeholder="タイトルを入力"
                                            data-lw_font_set={ fontLi }
                                            style={{
                                                fontWeight: fontWeightLi,
                                                color: fontColorLi
                                            }}
                                        />
                                        <RichText
                                            tagName="p"
                                            className="desc"
                                            allowedFormats={ [] }
                                            value={ content.text }
                                            onChange={ (val) => updateContent(index, 'text', val) }
                                            placeholder="テキストを入力"
                                            data-lw_font_set={ fontLiP }
                                            style={{
                                                fontWeight: fontWeightLiP,
                                                color: fontColorLiP
                                            }}
                                        />
                                    </span>
                                    
                                    {/* ▼ リンクURL入力 */}
                                    <TextControl
                                        className='url_input'
                                        placeholder="リンクURL"
                                        type="url"
                                        autoComplete='url'
                                        value={ content.url }
                                        onChange={ (val) => updateContent(index, 'url', val) }
                                        style={{ marginTop: '12px', maxWidth: '300px' }}
                                    />

                                    <button
                                        className="item_remove_btn"
                                        onClick={ () => removeContent(index) }
                                        style={{ marginTop: '1em' }}
                                    >
                                        削除
                                    </button>
                                </li>
                            )) }
                        </ul>

                        <button className="item_add_btn" onClick={ addContent }>
                            リストを追加する
                        </button>
                    </div>

                    <div
                        className="bg_filter"
                        style={{
                            backgroundColor: bgFilterColor,
                            opacity: bgFilterOpacity
                        }}
                    />
                    <div className="bg_image">
                        <img src={ bgImageUrl } alt="背景画像" />
                    </div>
                </div>
            </Fragment>
        );
    },

    // ========== save() (投稿本文に保存されるHTML) ========== 
    save: (props) => {
        const { attributes } = props;
        const {
            mainTitle, subTitle, mainExplanation, titleBdColor,
            fontLi, fontColorLi, fontWeightLi,
            fontLiP, fontColorLiP, fontWeightLiP,
            backgroundColor, backgroundOpacity,
            borderColor, borderSize,
            bgFilterColor, bgFilterOpacity,
            bgImageUrl,
            contents
        } = attributes;

        return (
            <div className="paid-block-link-2">
                <div className="this_wrap">
                    <h2 className="main_ttl">
                        <span className="main">
                            <RichText.Content
                                tagName="span"
                                className="main_title_text"
                                value={ mainTitle }
                                data-lw_font_set={ fontLi }
                                style={{
                                    fontWeight: fontWeightLi,
                                    color: fontColorLi
                                }}
                            />
                            <div
                                className="bd"
                                style={{ backgroundColor: titleBdColor }}
                            />
                        </span>
                        <RichText.Content
                            tagName="span"
                            className="sub"
                            value={ subTitle }
                        />
                    </h2>

                    <RichText.Content
                        tagName="p"
                        className="main_explanation"
                        value={ mainExplanation }
                    />

                    <ul className="this_items">
                        { contents.map((content, index) => {
                            // リンクURLがあるか否かでタグを変える
                            const TagName = content.url ? 'a' : 'div';
                            const linkProps = content.url
                                ? { href: content.url, className: 'link' }
                                : { className: 'link' };

                            return (
                                <li
                                    key={ index }
                                    className="item"
                                    style={{
                                        borderColor: borderColor,
                                        borderWidth: borderSize,
                                        borderStyle: borderSize > 0 ? 'solid' : 'none'
                                    }}
                                >
                                    <div
                                        className="bg_item"
                                        style={{
                                            backgroundColor: backgroundColor,
                                            opacity: backgroundOpacity
                                        }}
                                    />

                                    { createElement(
                                        TagName,
                                        linkProps,
                                        <>
                                            {/* 画像があれば画像を優先表示、なければアイコン */}
                                            { content.imageUrl ? (
                                                // 画像がある場合は画像を優先
                                                <div className="selected_image_area">
                                                    <img
                                                        className="selected_image"
                                                        data-img={ content.imageUrl }
                                                        src={ content.imageUrl }
                                                        alt=""
                                                    />
                                                </div>
                                            
                                            ) : content.icon ? (
                                                <div
                                                    className="selected_icon"
                                                    data-icon={ content.icon }
                                                    dangerouslySetInnerHTML={{ __html: content.icon }}
                                                />
                                            ) : null }

                                            <span className="item_ttl">
                                                <RichText.Content
                                                    tagName="h4"
                                                    className="ttl"
                                                    value={ content.ttl }
                                                    data-lw_font_set={ fontLi }
                                                    style={{
                                                        fontWeight: fontWeightLi,
                                                        color: fontColorLi
                                                    }}
                                                />
                                                <RichText.Content
                                                    tagName="p"
                                                    className="desc"
                                                    value={ content.text }
                                                    data-lw_font_set={ fontLiP }
                                                    style={{
                                                        fontWeight: fontWeightLiP,
                                                        color: fontColorLiP
                                                    }}
                                                />
                                            </span>
                                        </>
                                    ) }
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div
                    className="bg_filter"
                    style={{
                        backgroundColor: bgFilterColor,
                        opacity: bgFilterOpacity
                    }}
                />
                <div className="bg_image">
                    <img src={ bgImageUrl } alt="背景画像" />
                </div>
            </div>
        );
    }
});