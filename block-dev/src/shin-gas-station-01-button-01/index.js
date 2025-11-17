import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, URLInput } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPalette, RangeControl , ToggleControl } from '@wordpress/components'; // RangeControlを追加
import { fontOptionsArr, fontWeightOptionsArr, ButtonBackgroundOptionsArr, rightButtonIconSvgArr } from '../utils.js';
import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
// 背景色オプションを変数に定義
const bgOptions = ButtonBackgroundOptionsArr();
// SVG アイコンオプションを定義
const iconSvgOptions = rightButtonIconSvgArr();

registerBlockType('wdl/shin-gas-station-01-button-01', {
    title: 'リンクボタン 01 shin shop pattern 01',
    icon: 'button',
    category: 'liteword-buttons',
    supports: {
        anchor: true, 
    },
    attributes: {
        btnText: {
            type: 'string',
            default: '詳細はこちら'
        },
        bgGradient: {
            type: 'string',
            default: 'var(--color-main)'
        },
        colorMode: { // 背景色設定モード（'select' または 'palette'）
            type: 'string',
            default: 'select'
        },
        customBgColor: { // カラーパレットで選択した背景色
            type: 'string',
            default: '#0073aa'
        },
        textColor: {
            type: 'string',
            default: '#ffffff'
        },
        fontWeight: {
            type: 'string',
            default: '400'
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
            default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>'
        },
        iconColor: { // アイコンの色属性を追加
            type: 'string',
            default: '#ffffff'
        },
        borderWidth: { // ボーダーの幅属性を追加
            type: 'number',
            default: 0
        },
        borderColor: { // ボーダーの色属性を追加
            type: 'string',
            default: 'var(--color-main)'
        }
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { btnText, bgGradient, colorMode, customBgColor, textColor, fontWeight, FontSet, btnUrl, selectedIcon, iconColor, borderWidth, borderColor } = attributes;

        // 実際に使用する背景色を決定
        const actualBgColor = colorMode === 'palette' ? customBgColor : bgGradient;

        return (
            <div className='shin-gas-station-01-button-01'>
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
                            <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                                🌈 背景デザイン
                            </p>
                            
                            {/* トグルボタンで設定方法を切り替え */}
                            <ToggleControl
                                label={colorMode === 'select' ? '🎯 選択式（簡単）' : '🎨 カラーパレット（自由）'}
                                checked={colorMode === 'palette'}
                                onChange={(value) => setAttributes({ colorMode: value ? 'palette' : 'select' })}
                                help={colorMode === 'select' 
                                    ? '用意されたデザインから選択できます。オンにするとカラーパレットで自由に色を選べます。' 
                                    : '自由に色を選択できます。オフにすると用意されたデザインから選べます。'
                                }
                            />
                            
                            {/* 選択式モード */}
                            {colorMode === 'select' && (
                                <div style={{ marginTop: '15px' }}>
                                    <SelectControl
                                        value={bgGradient}
                                        options={bgOptions}
                                        onChange={(newGradient) => setAttributes({ bgGradient: newGradient })}
                                        help="用意されたデザインから選択してください"
                                    />
                                </div>
                            )}
                            
                            {/* カラーパレットモード */}
                            {colorMode === 'palette' && (
                                <div style={{ marginTop: '15px' }}>
                                    <ColorPalette
                                        value={customBgColor}
                                        onChange={(newColor) => setAttributes({ customBgColor: newColor })}
                                    />
                                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                        お好きな色を自由に選択してください
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                📝 文字の色
                            </p>
                            <ColorPalette
                                value={textColor}
                                onChange={(newColor) => setAttributes({ textColor: newColor })}
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

                    {/* ── 3. アイコン設定 ── */}
                    <PanelBody title="✨ アイコン設定" initialOpen={false}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🎯 アイコンの種類
                            </p>
                            <SelectControl
                                value={selectedIcon}
                                options={iconSvgOptions}
                                onChange={(newIcon) => setAttributes({ selectedIcon: newIcon })}
                                help="ボタンに表示するアイコンを選択してください"
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

                    {/* ── 4. 枠線設定 ── */}
                    <PanelBody title="🖍️ 枠線の設定" initialOpen={false}>
                        <div style={{ marginBottom: borderWidth > 0 ? '15px' : '0px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                📏 枠線の太さ (px)
                            </p>
                            <RangeControl
                                value={borderWidth}
                                onChange={(newWidth) => setAttributes({ borderWidth: newWidth })}
                                min={0}
                                max={10}
                                help="0にすると枠線が表示されません"
                            />
                        </div>

                        {borderWidth > 0 && (
                            <div>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    🎨 枠線の色
                                </p>
                                <ColorPalette
                                    value={borderColor}
                                    onChange={(newColor) => setAttributes({ borderColor: newColor })}
                                />
                            </div>
                        )}
                    </PanelBody>
                </InspectorControls>

                <div className='a_inner' style={{ borderWidth: `${borderWidth}px`, borderColor: borderColor, borderStyle: 'solid' }}>
                    <RichText
                        tagName="a"
                        value={btnText}
                        onChange={(newContent) => setAttributes({ btnText: newContent })}
                        placeholder="リンクテキストを入力"
                        style={{ color: textColor, fontWeight: fontWeight }} // テキスト色とフォント太さの適用
                        data-lw_font_set={FontSet} // フォントの適用
                    />
                    {selectedIcon && (
                        <div
                            className="icon-svg"
                            dangerouslySetInnerHTML={{ __html: selectedIcon }} // SVGを安全にレンダリング
                            style={{ fill: iconColor }} // アイコンの色を適用
                        />
                    )}
                    <div className="a_background" style={{ background: actualBgColor }}></div>
                </div>
            </div>
        );
    },

    save: function (props) {
        const { btnText, bgGradient, colorMode, customBgColor, textColor, fontWeight, FontSet, btnUrl, selectedIcon, iconColor, borderWidth, borderColor } = props.attributes;

        // 実際に使用する背景色を決定
        const actualBgColor = colorMode === 'palette' ? customBgColor : bgGradient;

        return (
            <div className='shin-gas-station-01-button-01'>
                <div className='a_inner' style={{ borderWidth: `${borderWidth}px`, borderColor: borderColor, borderStyle: 'solid' }}>
                    <RichText.Content
                        tagName="a"
                        value={btnText}
                        href={btnUrl} // リンクの適用
                        target={props.attributes.openNewTab ? '_blank' : '_self'} // 新しいタブで開くかどうか
                        style={{ color: textColor, fontWeight: fontWeight }} // テキスト色、フォント太さとフォントの適用
                        data-lw_font_set={FontSet} // フォントの適用
                    />
                    {selectedIcon && (
                        <div
                            className="icon-svg"
                            dangerouslySetInnerHTML={{ __html: selectedIcon }} // SVGを安全にレンダリング
                            style={{ fill: iconColor }} // アイコンの色を適用
                        />
                    )}
                    <div className="a_background" style={{ background: actualBgColor }}></div>
                </div>
            </div>
        );
    }

});