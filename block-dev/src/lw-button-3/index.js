import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, URLInput } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPalette , ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, ButtonBackgroundOptionsArr, rightButtonIconSvgArr } from '../utils.js'; // iconSvgオプションもインポート
import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
// 背景オプションを変数に定義
const bgOptions = ButtonBackgroundOptionsArr();
// SVG アイコンオプションを定義
const iconSvgOptions = rightButtonIconSvgArr();

registerBlockType('wdl/lw-button-03', {
    title: 'リンクボタン 03',
    icon: 'button',
    category: 'liteword-buttons',
    supports: {
        anchor: true, 
    },
    attributes: {
        btnTextSub: {
            type: 'string',
            default: 'お気軽にお問い合わせください'
        },
        btnTextMain: {
            type: 'string',
            default: '資料ダウンロードはこちら'
        },
        bgGradient: {
            type: 'string',
            default: ''
        },
        textSubColor: {
            type: 'string',
            default: 'var(--color-main)'
        },
        textMainColor: {
            type: 'string',
            default: '#ffffff'
        },
        fontWeight: {
            type: 'string',
            default: '500'
        },
        btnUrl: {
            type: 'string',
            default: ''
        },
        openNewTab: {
            type: 'boolean',
            default: false
        },
        FontSet: {
            type: 'string',
            default: ''
        },
        selectedIcon: {  // アイコンの属性を追加（SVG文字列）
            type: 'string',
            default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg>'
        },
        iconColor: { // アイコンの色属性を追加
            type: 'string',
            default: '#ffffff'
        }
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { btnTextSub, btnTextMain , bgGradient, textSubColor, textMainColor , fontWeight, FontSet, btnUrl, selectedIcon, iconColor } = attributes;

        return (
            <div className='lw-button-03'>
                <InspectorControls>

                    {/* ── 1. 基本設定 ── */}
                    <PanelBody title="📝 基本設定" initialOpen={true}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
                                🔗 リンク先URL
                            </p>
                            <URLInput
                                value={btnUrl}
                                onChange={(newUrl) => setAttributes({ btnUrl: newUrl })}
                                help="ボタンをクリックした時の移動先URLを入力してください"
                            />
                        </div>
                        
                        <ToggleControl
                            label="新しいタブで開く"
                            checked={props.attributes.openNewTab}
                            onChange={(value) => setAttributes({ openNewTab: value })}
                            help="リンク先を新しいタブで開きたい場合はオンにしてください"
                        />
                    </PanelBody>

                    {/* ── 2. ボタンの見た目 ── */}
                    <PanelBody title="🎨 ボタンの見た目" initialOpen={false}>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🌈 背景デザイン
                            </p>
                            <SelectControl
                                value={bgGradient}
                                options={bgOptions}
                                onChange={(newGradient) => setAttributes({ bgGradient: newGradient })}
                                help="ボタンの背景色やグラデーションを選択してください"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                📚 フォントの種類
                            </p>
                            <SelectControl
                                value={FontSet}
                                options={fontOptions}
                                onChange={(newFont) => setAttributes({ FontSet: newFont })}
                                help="ボタンのフォントを選択してください"
                            />
                        </div>

                        <div>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                💪 文字の太さ
                            </p>
                            <SelectControl
                                value={fontWeight}
                                options={fontWeightOptions}
                                onChange={(newWeight) => setAttributes({ fontWeight: newWeight })}
                            />
                        </div>
                    </PanelBody>

                    {/* ── 3. テキストの色設定 ── */}
                    <PanelBody title="📝 テキストの色設定" initialOpen={false}>
                        <div style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '4px', 
                            padding: '15px', 
                            marginBottom: '20px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
                                💬 サブテキストの色
                            </p>
                            <ColorPalette
                                value={textSubColor}
                                onChange={(newColor) => setAttributes({ textSubColor: newColor })}
                            />
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                「お気軽にお問い合わせください」などの小さなテキストの色
                            </p>
                        </div>

                        <div style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '4px', 
                            padding: '15px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
                                📢 メインテキストの色
                            </p>
                            <ColorPalette
                                value={textMainColor}
                                onChange={(newColor) => setAttributes({ textMainColor: newColor })}
                            />
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                「資料ダウンロードはこちら」などのメインテキストの色
                            </p>
                        </div>
                    </PanelBody>

                    {/* ── 4. アイコン設定 ── */}
                    <PanelBody title="✨ アイコン設定" initialOpen={false}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🎯 アイコンの種類
                            </p>
                            <SelectControl
                                value={selectedIcon}
                                options={iconSvgOptions}
                                onChange={(newIcon) => setAttributes({ selectedIcon: newIcon })}
                                help="メインテキストの横に表示するアイコンを選択してください"
                            />
                        </div>

                        {selectedIcon && (
                            <div>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    🎨 アイコンの色
                                </p>
                                <ColorPalette
                                    value={iconColor}
                                    onChange={(newColor) => setAttributes({ iconColor: newColor })}
                                />
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                    アイコンが選択されている場合のみ色を変更できます
                                </p>
                            </div>
                        )}
                    </PanelBody>
                </InspectorControls>

                <div className='a_inner'>
                    <a>
                        <RichText
                            tagName="span"
                            className="text_sub"
                            value={btnTextSub}
                            onChange={(newContent) => setAttributes({ btnTextSub: newContent })}
                            placeholder="リンクテキストを入力"
                            style={{ color: textSubColor, fontWeight: fontWeight }} // テキスト色とフォント太さの適用
                            data-lw_font_set={FontSet} // フォントの適用
                        />
                        <div className="text_main_wrap">
                            {selectedIcon && (
                                <div
                                    className="icon-svg"
                                    dangerouslySetInnerHTML={{ __html: selectedIcon }} // SVGを安全にレンダリング
                                    style={{ fill: iconColor }} // アイコンの色を適用
                                />
                            )}
                            <RichText
                                tagName="span"
                                className="text_main"
                                value={btnTextMain}
                                onChange={(newContent) => setAttributes({ btnTextMain: newContent })}
                                placeholder="リンクテキストを入力"
                                style={{ color: textMainColor, fontWeight: fontWeight }} // テキスト色とフォント太さの適用
                                data-lw_font_set={FontSet} // フォントの適用
                            />
                        </div>
                    </a>
                    <div className="a_background" style={{ background: bgGradient }}></div>
                </div>
            </div>
        );
    },

    save: function (props) {
        const { btnTextSub, btnTextMain , bgGradient, textSubColor, textMainColor , fontWeight, FontSet, btnUrl, selectedIcon, iconColor } = props.attributes;

        return (
            <div className='lw-button-03'>
                <div className='a_inner'>
                    <a href={btnUrl} target={props.attributes.openNewTab ? '_blank' : '_self'}>
                        <RichText.Content
                            tagName="span"
                            className="text_sub"
                            value={btnTextSub}
                            style={{ color: textSubColor, fontWeight: fontWeight }} // テキスト色、フォント太さとフォントの適用
                            data-lw_font_set={FontSet} // フォントの適用
                        />
                        <div className="text_main_wrap">
                            {selectedIcon && (
                                <div
                                    className="icon-svg"
                                    dangerouslySetInnerHTML={{ __html: selectedIcon }} // SVGを安全にレンダリング
                                    style={{ fill: iconColor }} // アイコンの色を適用
                                />
                            )}
                            <RichText.Content
                                tagName="span"
                                className="text_main"
                                value={btnTextMain}
                                style={{ color: textMainColor, fontWeight: fontWeight }} // テキスト色、フォント太さとフォントの適用
                                data-lw_font_set={FontSet} // フォントの適用
                            />
                        </div>
                        
                    </a>
                    <div className="a_background" style={{ background: bgGradient }}></div>
                </div>
            </div>
        );
    }

});