import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, URLInput, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPalette, RangeControl , ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, ButtonBackgroundOptionsArr, rightButtonIconSvgArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
// 背景色オプションを変数に定義
const bgOptions = ButtonBackgroundOptionsArr();
// SVG アイコンオプションを定義
const iconSvgOptions = rightButtonIconSvgArr();

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { btnText, bgGradient, textColor, fontWeight, FontSet, btnUrl, selectedIcon, iconColor, borderWidth, borderColor } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-button-02'
        });

        return (
            <div {...blockProps}>
                <InspectorControls>

                    {/* ── 1. 基本設定 ── */}
                    <PanelBody title="基本設定" initialOpen={true}>
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
                    <PanelBody title="色設定" initialOpen={false}>
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
                    <PanelBody title="アイコン設定" initialOpen={false}>
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
                    <PanelBody title="枠線設定" initialOpen={false}>
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
                    <div className="a_background" style={{ background: bgGradient }}></div>
                </div>
            </div>
        );
    },

    save: function (props) {
        const { btnText, bgGradient, textColor, fontWeight, FontSet, btnUrl, selectedIcon, iconColor, borderWidth, borderColor } = props.attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-button-02'
        });

        return (
            <div {...blockProps}>
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
                    <div className="a_background" style={{ background: bgGradient }}></div>
                </div>
            </div>
        );
    }

});