/**
 * CTA 02
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, RichText, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPicker, TextControl, SelectControl, RangeControl } from '@wordpress/components';
import { leftButtonIconSvgArr } from '../utils.js';

import metadata from './block.json';

// SVG アイコンオプションを定義
const iconSvgOptions = leftButtonIconSvgArr();

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const {
            title, addressText, phoneText, phoneNumber, mailText,
            mailUrl, backgroundImage, filterColor, buttonBackgroundColor, buttonTextColor, selectedIcon, maxWidth
        } = attributes;

        const onSelectBackgroundImage = (media) => setAttributes({ backgroundImage: media.url });
        const onChangeFilterColor = (color) => setAttributes({ filterColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` });
        const onChangeButtonBackgroundColor = (color) => setAttributes({ buttonBackgroundColor: color.hex });
        const onChangeButtonTextColor = (color) => setAttributes({ buttonTextColor: color.hex });
        const onChangeMaxWidth = (value) => setAttributes({ maxWidth: value });
        const onResetMaxWidth = () => setAttributes({ maxWidth: 0 });

        // useBlockProps で apiVersion 3 対応
        const blockProps = useBlockProps({
            className: `wp-block-wdl-cta-2 ${maxWidth > 0 ? 'max_w' : ''}`,
            style: maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}
        });

        return (
            <div {...blockProps}>
                <InspectorControls>
                    {/* 横幅の設定 */}
                    <PanelBody title="レイアウト設定" initialOpen={false}>
                        <div style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '4px', 
                            padding: '15px', 
                            marginBottom: '15px',
                            backgroundColor: '#fafafa'
                        }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
                                📐 最大横幅の設定
                            </p>
                            <RangeControl 
                                label={`最大横幅 ${maxWidth > 0 ? `(${maxWidth}px)` : '(未設定)'}`}
                                value={maxWidth}
                                onChange={onChangeMaxWidth}
                                min={800}
                                max={1600}
                                help="ブロック全体の最大横幅を設定します。0で未設定状態になります。"
                            />
                            {maxWidth > 0 && (
                                <Button 
                                    variant="secondary" 
                                    onClick={onResetMaxWidth}
                                    style={{ marginTop: '10px' }}
                                >
                                    🔄 リセット
                                </Button>
                            )}
                        </div>
                    </PanelBody>

                    {/* 電話番号 */}
                    <PanelBody title="電話番号設定">
                        <TextControl label="電話番号" value={phoneNumber} onChange={(value) => setAttributes({ phoneNumber: value })} />
                    </PanelBody>
                    {/* リンクボタンの設定 */}
                    <PanelBody title="テキスト設定">
                        <TextControl label="ボタンURL" value={mailUrl} onChange={(value) => setAttributes({ mailUrl: value })} />
                        <SelectControl
                            label="アイコン"
                            value={selectedIcon}
                            options={iconSvgOptions}
                            onChange={(newIcon) => setAttributes({ selectedIcon: newIcon })}
                        />
                    </PanelBody>
                    {/* 背景画像の設定 */}
                    <PanelBody title="背景設定">
                        <MediaUpload
                            onSelect={onSelectBackgroundImage}
                            allowedTypes="image"
                            render={({ open }) => (
                                <div>
                                    {backgroundImage && (
                                        <img src={backgroundImage} alt="背景画像" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                                    )}
                                    <Button onClick={open} variant="secondary">画像を選択</Button>
                                </div>
                            )}
                        />
                    </PanelBody>
                    {/* 背景画像のフィルター色の設定 */}
                    <PanelBody title="フィルター設定">
                        <ColorPicker
                            color={filterColor}
                            onChangeComplete={onChangeFilterColor}
                            label="フィルターの色"
                        />
                    </PanelBody>
                    

                    {/* ボタン色の設定 */}
                    <PanelBody title="色設定">
                        <p>ボタン背景色</p>
                        <ColorPicker
                            color={buttonBackgroundColor}
                            onChangeComplete={onChangeButtonBackgroundColor}
                            label="ボタン背景色"
                        />
                        <p>ボタンテキストの色</p>
                        <ColorPicker
                            color={buttonTextColor}
                            onChangeComplete={onChangeButtonTextColor}
                            label="ボタンテキスト色"
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="cta-2" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="cta-2__wrap">
                        <RichText
                            tagName="h2"
                            className="title"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder="タイトルを入力"
                        />
                        <RichText
                            tagName="p"
                            className="address"
                            value={addressText}
                            onChange={(value) => setAttributes({ addressText: value })}
                            placeholder="住所テキストを入力"
                        />
                        <nav>
                            <a className="tel">
                                <div className="no" data-lw_font_set="Roboto">
                                    <div className="small">TEL:</div>
                                    <div className="big">{phoneNumber}</div>
                                </div>
                                <RichText
                                    tagName="p"
                                    className="tel_text"
                                    value={phoneText}
                                    onChange={(value) => setAttributes({ phoneText: value })}
                                    placeholder="受付時間を入力"
                                />
                            </a>
                            <a className="mail" style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor }}>
                                {selectedIcon && (
                                    <div
                                        className="icon"
                                        dangerouslySetInnerHTML={{ __html: selectedIcon }} // SVGを安全にレンダリング
                                        style={{ fill: buttonTextColor }} // アイコンの色を適用
                                    />
                                )}
                                <RichText
                                    tagName="div"
                                    className="mail_text"
                                    value={mailText}
                                    onChange={(value) => setAttributes({ mailText: value })}
                                    placeholder="メールテキストを入力"
                                />
                            </a>
                        </nav>
                    </div>
                    <div className="bg_filter" style={{ backgroundColor: filterColor }}></div>
                </div>
            </div>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const {
            title, addressText, phoneText, phoneNumber, mailText,
            mailUrl, backgroundImage, filterColor, buttonBackgroundColor, buttonTextColor, selectedIcon, maxWidth
        } = attributes;

        // useBlockProps.save() で apiVersion 3 対応
        const blockProps = useBlockProps.save({
            className: `wp-block-wdl-cta-2 ${maxWidth > 0 ? 'max_w' : ''}`,
            style: maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}
        });

        return (
            <div {...blockProps}>
                <div className="cta-2" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="cta-2__wrap">
                        <RichText.Content
                            tagName="h2"
                            className="title"
                            value={title}
                        />
                        <RichText.Content
                            tagName="p"
                            className="address"
                            value={addressText}
                        />
                        <nav>
                            <a href={`tel:${phoneNumber}`} className="tel" data-lw_font_set="Roboto">
                                <div className="no">
                                    <div className="small">TEL:</div>
                                    <div className="big">{phoneNumber}</div>
                                </div>
                                <RichText.Content
                                    tagName="p"
                                    className="tel_text"
                                    value={phoneText}
                                />
                            </a>
                            <a href={mailUrl} className="mail" style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor }}>

                                {selectedIcon && (
                                    <div
                                        className="icon"
                                        dangerouslySetInnerHTML={{ __html: selectedIcon }} // SVGを安全にレンダリング
                                        style={{ fill: buttonTextColor }} // アイコンの色を適用
                                    />
                                )}
                                <RichText.Content
                                    tagName="div"
                                    className="mail_text"
                                    value={mailText}
                                />
                            </a>
                        </nav>
                    </div>
                    <div className="bg_filter" style={{ backgroundColor: filterColor }}></div>
                </div>
            </div>
        );
    }
});