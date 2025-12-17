/**
 * CTA 1 shin shop pattern 01
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, RichText, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, ColorPicker, RangeControl, TextControl, SelectControl } from '@wordpress/components';

import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const {
            title,titleSub, text, buttonText, buttonUrl, openInNewTab, imageUrl,
            filterColor, buttonBackgroundColor, buttonBorderColor, buttonBorderSize, buttonMaxWidth,
            pcTextAlign, mobileTextAlign
        } = attributes;
        // 各種変更関数
        const onChangeTitle = (value) => setAttributes({ title: value });
        const onChangeTitleSub = (value) => setAttributes({ titleSub: value });
        const onChangeText = (value) => setAttributes({ text: value });
        const onChangeButtonText = (value) => setAttributes({ buttonText: value });
        const onChangeButtonUrl = (value) => setAttributes({ buttonUrl: value });
        const onToggleOpenInNewTab = () => setAttributes({ openInNewTab: !openInNewTab });
        const onSelectImage = (newImage) => setAttributes({ imageUrl: newImage.sizes.full.url });
        const onChangeFilterColor = (value) => setAttributes({ filterColor: value });
        const onChangeButtonBackgroundColor = (value) => setAttributes({ buttonBackgroundColor: value });
        const onChangeButtonBorderColor = (value) => setAttributes({ buttonBorderColor: value });
        const onChangeButtonBorderSize = (value) => setAttributes({ buttonBorderSize: value });
        const onChangeButtonMaxWidth = (value) => setAttributes({ buttonMaxWidth: value });
        const onChangePcTextAlign = (value) => setAttributes({ pcTextAlign: value });
        const onChangeMobileTextAlign = (value) => setAttributes({ mobileTextAlign: value });

        // useBlockProps で apiVersion 3 対応
        const blockProps = useBlockProps({
            className: 'shin-gas-station-01-cta'
        });

        return (
            <div {...blockProps}>
                <InspectorControls>
                    {/* リンクの設定 */}
                    <PanelBody title="リンクの設定">
                        <TextControl label="リンク先URL" value={buttonUrl} onChange={onChangeButtonUrl} />
                        <ToggleControl label="リンクを新規タブで開く" checked={openInNewTab} onChange={onToggleOpenInNewTab} />
                    </PanelBody>

                    {/* 画像の設定 */}
                    <PanelBody title="背景画像の設定">
                        <MediaUpload onSelect={onSelectImage} allowedTypes="image" value={imageUrl}
                            render={({ open }) => (
                                <>
                                    {imageUrl && <img src={imageUrl} style={{ width: '100%', height: 'auto' }} />}
                                    <Button onClick={open} className="button" style={{ marginTop: '10px' }}>画像を変更</Button>
                                </>
                            )}
                        />
                        <br /><br />
                        <p>画像の上のフィルターの色</p>
                        <ColorPicker color={filterColor} onChangeComplete={(value) => onChangeFilterColor(value.hex)} />
                    </PanelBody>
                    {/* テキストの配置設定 */}
                    <PanelBody title="テキストの配置設定">
                        <SelectControl label="PCでのテキスト配置" value={pcTextAlign} options={[{ label: '中央寄せ', value: 'center' }, { label: '左寄せ', value: 'left' }]} onChange={onChangePcTextAlign} />
                        <SelectControl label="スマホでのテキスト配置" value={mobileTextAlign} options={[{ label: '中央寄せ', value: 'center' }, { label: '左寄せ', value: 'left' }]} onChange={onChangeMobileTextAlign} />
                    </PanelBody>
                    {/* ボタンの色の設定 */}
                    <PanelBody title="リンクボタンの設定">
                        <p>ボタンの背景色</p>
                        <ColorPicker color={buttonBackgroundColor} onChangeComplete={(value) => onChangeButtonBackgroundColor(value.hex)} />
                        <p>ボタンのボーダーの色（外枠）</p>
                        <ColorPicker color={buttonBorderColor} onChangeComplete={(value) => onChangeButtonBorderColor(value.hex)} />
                        <RangeControl label="ボーダーの太さ (px)" value={buttonBorderSize} onChange={onChangeButtonBorderSize} min={0} max={10} />
                        <RangeControl label="リンクボタンの最大横幅 (px)" value={buttonMaxWidth} onChange={onChangeButtonMaxWidth} min={50} max={500} />
                    </PanelBody>
                </InspectorControls>

                <div className="shin-gas-station-01-cta__inner">
                    <h2 className="shin-gas-station-01-cta__title heading_style_reset">
                        <RichText
                            tagName="span"
                            className="main"
                            value={title}
                            onChange={onChangeTitle}
                            placeholder="メインタイトルを入力"
                        />
                        <RichText
                            tagName="span"
                            className="sub"
                            value={titleSub}
                            onChange={onChangeTitleSub}
                            placeholder="サブタイトルを入力"
                        />
                    </h2>
                    <RichText
                        tagName="p"
                        className={`shin-gas-station-01-cta__text ${pcTextAlign === 'left' ? 'text_align_pc_left' : ''} ${mobileTextAlign === 'left' ? 'text_align_sp_left' : ''}`}
                        value={text}
                        onChange={onChangeText}
                        placeholder="テキストを入力"
                    />
                    <RichText
                        tagName="a"
                        className="shin-gas-station-01-cta__button"
                        value={buttonText}
                        onChange={onChangeButtonText}
                        placeholder="ボタンテキストを入力"
                        href={buttonUrl}
                        target={openInNewTab ? '_blank' : undefined}
                        rel={openInNewTab ? 'noopener noreferrer' : undefined}
                        style={{ backgroundColor: buttonBackgroundColor, borderColor: buttonBorderColor, borderWidth: buttonBorderSize + 'px', borderStyle: 'solid', maxWidth: buttonMaxWidth + 'px' }}
                    />
                </div>
                <div className="shin-gas-station-01-cta__image">
                    {imageUrl && <img src={imageUrl} loading="lazy" />}
                    <div style={{ backgroundColor: filterColor,  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></div>
                </div>
            </div>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const {
            title,titleSub, text, buttonText, buttonUrl, openInNewTab, imageUrl,
            filterColor,  buttonBackgroundColor, buttonBorderColor, buttonBorderSize, buttonMaxWidth,
             pcTextAlign, mobileTextAlign
        } = attributes;

        // useBlockProps.save() で apiVersion 3 対応
        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-cta'
        });

        return (
            <div {...blockProps}>
                <div className="shin-gas-station-01-cta__inner">
                    <h2 className="shin-gas-station-01-cta__title heading_style_reset">
                        <RichText.Content
                            tagName="span"
                            className="main"
                            value={title}
                        />
                        <RichText.Content
                            tagName="span"
                            className="sub"
                            value={titleSub}
                        />
                    </h2>
                    <RichText.Content
                        tagName="p"
                        className={`shin-gas-station-01-cta__text ${pcTextAlign === 'left' ? 'text_align_pc_left' : ''} ${mobileTextAlign === 'left' ? 'text_align_sp_left' : ''}`}
                        value={text}
                    />
                    <RichText.Content
                        tagName="a"
                        className="shin-gas-station-01-cta__button"
                        href={buttonUrl}
                        target={openInNewTab ? '_blank' : undefined}
                        rel={openInNewTab ? 'noopener noreferrer' : undefined}
                        value={buttonText}
                        style={{ borderWidth: buttonBorderSize + 'px', borderStyle: 'solid', maxWidth: buttonMaxWidth + 'px' }}
                    />
                </div>
                <div className="shin-gas-station-01-cta__image">
                    {imageUrl && <img src={imageUrl} loading="lazy" />}
                    <div style={{ backgroundColor: filterColor,  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></div>
                </div>
                <style>{`
					.shin-gas-station-01-cta__button{
                        background-color: ${ buttonBackgroundColor  };

						color: ${ buttonBorderColor };
                        border-color: ${ buttonBorderColor };
					}
					.shin-gas-station-01-cta__button:hover{
						color: #fff;
                        background-color: ${ buttonBorderColor };
					}

				`}</style>
            </div>
        );
    }
});
