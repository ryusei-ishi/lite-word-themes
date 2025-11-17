import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPicker, TextControl, SelectControl, RangeControl } from '@wordpress/components';
import { leftButtonIconSvgArr } from '../utils.js';
import './style.scss';
import './editor.scss';
// SVG アイコンオプションを定義
const iconSvgOptions = leftButtonIconSvgArr();
registerBlockType('wdl/cta-2', {
    title: 'CTA 02',
    icon: 'megaphone',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        title: { type: 'string', source: 'html', selector: 'h2', default: 'お問合せはこちら' },
        addressText: { type: 'string', source: 'html', selector: '.address',  default: '〒110-0000 東京都豊島区池袋0-0-0／TEL. 042-000-0000／FAX. 042-000-0001' },
        phoneText: { type: 'string', source: 'html', selector: '.tel_text', default: '（受付時間／9:00～17:00 第2・第4土曜、日祝休業）' },
        phoneNumber: { type: 'string', default: '042-000-0000' },
        mailText: { type: 'string', source: 'html', selector: '.mail_text', default: 'メールでお問い合わせ' },
        mailUrl: { type: 'string', default: 'mailto:info@example.com' },
        backgroundImage: { type: 'string', default: 'https://cdn.pixabay.com/photo/2022/03/27/12/46/china-7094961_960_720.jpg' },
        filterColor: { type: 'string', default: 'rgba(0, 0, 0, 0.5)' },
        buttonBackgroundColor: { type: 'string', default: '#0073aa' },
        buttonTextColor: { type: 'string', default: '#ffffff' },
        selectedIcon: {  // アイコンの属性を追加（SVG文字列）
            type: 'string',
            default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg>'
        },
        maxWidth: { type: 'number', default: 0 }
    },
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

        return (
            <div 
                className={`wp-block-wdl-cta-2 ${maxWidth > 0 ? 'max_w' : ''}`}
                style={maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}}
            >
                <InspectorControls>
                    {/* 横幅の設定 */}
                    <PanelBody title="横幅の設定" initialOpen={false}>
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
                    <PanelBody title="背景画像の設定">
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
                    <PanelBody title="フィルター色設定">
                        <ColorPicker
                            color={filterColor}
                            onChangeComplete={onChangeFilterColor}
                            label="フィルターの色"
                        />
                    </PanelBody>
                    

                    {/* ボタン色の設定 */}
                    <PanelBody title="ボタン色設定">
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

        return (
            <div 
                className={`wp-block-wdl-cta-2 ${maxWidth > 0 ? 'max_w' : ''}`}
                style={maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}}
            >
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