/**
 * CTA 01
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, RichText, MediaUpload, BlockControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, ColorPicker, RangeControl, TextControl, SelectControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';

import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const {
            title, text, buttonText, buttonUrl, openInNewTab, imageUrl, imageAlt,
            filterColor, buttonBackgroundColor, buttonBorderColor, buttonBorderSize, buttonMaxWidth,
            pcTextAlign, mobileTextAlign, maxWidth, headingLevel
        } = attributes;
        
        // 各種変更関数
        const onChangeTitle = (value) => setAttributes({ title: value });
        const onChangeText = (value) => setAttributes({ text: value });
        const onChangeButtonText = (value) => setAttributes({ buttonText: value });
        const onChangeButtonUrl = (value) => setAttributes({ buttonUrl: value });
        const onToggleOpenInNewTab = () => setAttributes({ openInNewTab: !openInNewTab });
        const onSelectImage = (newImage) => setAttributes({ imageUrl: newImage.sizes.full.url, imageAlt: newImage.alt });
        const onChangeImageAlt = (value) => setAttributes({ imageAlt: value });
        const onChangeFilterColor = (value) => setAttributes({ filterColor: value });
        const onChangeButtonBackgroundColor = (value) => setAttributes({ buttonBackgroundColor: value });
        const onChangeButtonBorderColor = (value) => setAttributes({ buttonBorderColor: value });
        const onChangeButtonBorderSize = (value) => setAttributes({ buttonBorderSize: value });
        const onChangeButtonMaxWidth = (value) => setAttributes({ buttonMaxWidth: value });
        const onChangePcTextAlign = (value) => setAttributes({ pcTextAlign: value });
        const onChangeMobileTextAlign = (value) => setAttributes({ mobileTextAlign: value });
        const onChangeMaxWidth = (value) => setAttributes({ maxWidth: value });
        const onResetMaxWidth = () => setAttributes({ maxWidth: 0 });
        const onChangeHeadingLevel = (newLevel) => setAttributes({ headingLevel: newLevel });

        // 見出しタグ名を動的に決定
        const TagName = `h${headingLevel}`;

        // useBlockProps で apiVersion 3 対応
        const blockProps = useBlockProps({
            className: `wp-block-wdl-cta-1 ${maxWidth > 0 ? 'max_w' : ''}`,
            style: maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}
        });

        return (
            <div {...blockProps}>
                <BlockControls>
                    <ToolbarGroup>
                        {[1, 2, 3].map((level) => (
                            <ToolbarButton
                                key={level}
                                isPressed={headingLevel === level}
                                onClick={() => onChangeHeadingLevel(level)}
                            >
                                {`H${level}`}
                            </ToolbarButton>
                        ))}
                    </ToolbarGroup>
                </BlockControls>
                
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

                    {/* リンクの設定 */}
                    <PanelBody title="基本設定">
                        <TextControl label="リンク先URL" value={buttonUrl} onChange={onChangeButtonUrl} />
                        <ToggleControl label="リンクを新規タブで開く" checked={openInNewTab} onChange={onToggleOpenInNewTab} />
                    </PanelBody>

                    {/* 画像の設定 */}
                    <PanelBody title="画像設定">
                        <MediaUpload onSelect={onSelectImage} allowedTypes="image" value={imageUrl}
                            render={({ open }) => (
                                <>
                                    {imageUrl && <img src={imageUrl} alt={imageAlt} style={{ width: '100%', height: 'auto' }} />}
                                    <Button onClick={open} className="button" style={{ marginTop: '10px' }}>画像を変更</Button>
                                </>
                            )}
                        />
                        <br /><br />
                        <TextControl label="画像のaltテキスト" value={imageAlt} onChange={onChangeImageAlt} />
                        <ColorPicker color={filterColor} onChangeComplete={(value) => onChangeFilterColor(value.hex)} />
                    </PanelBody>

                    {/* ボタンの色の設定 */}
                    <PanelBody title="色設定">
                        <ColorPicker color={buttonBackgroundColor} onChangeComplete={(value) => onChangeButtonBackgroundColor(value.hex)} />
                        <ColorPicker color={buttonBorderColor} onChangeComplete={(value) => onChangeButtonBorderColor(value.hex)} />
                        <RangeControl label="ボーダーのサイズ (px)" value={buttonBorderSize} onChange={onChangeButtonBorderSize} min={0} max={10} />
                        <RangeControl label="リンクボタンの最大横幅 (px)" value={buttonMaxWidth} onChange={onChangeButtonMaxWidth} min={50} max={500} />
                    </PanelBody>

                    {/* テキストの配置設定 */}
                    <PanelBody title="配置設定">
                        <SelectControl label="PCでのテキスト配置" value={pcTextAlign} options={[{ label: '中央寄せ', value: 'center' }, { label: '左寄せ', value: 'left' }]} onChange={onChangePcTextAlign} />
                        <SelectControl label="スマホでのテキスト配置" value={mobileTextAlign} options={[{ label: '中央寄せ', value: 'center' }, { label: '左寄せ', value: 'left' }]} onChange={onChangeMobileTextAlign} />
                    </PanelBody>
                </InspectorControls>

                <div className="cta-1__inner">
                        <RichText
                            tagName={TagName}
                            className="cta-1__title heading_style_reset"
                            value={title}
                            onChange={onChangeTitle}
                            placeholder="タイトルを入力"
                        />
                        <RichText
                            tagName="p"
                            className={`cta-1__text ${pcTextAlign === 'left' ? 'text_align_pc_left' : ''} ${mobileTextAlign === 'left' ? 'text_align_sp_left' : ''}`}
                            value={text}
                            onChange={onChangeText}
                            placeholder="テキストを入力"
                        />
                        <RichText
                            tagName="a"
                            className="cta-1__button"
                            value={buttonText}
                            onChange={onChangeButtonText}
                            placeholder="ボタンテキストを入力"
                            href={buttonUrl}
                            target={openInNewTab ? '_blank' : undefined}
                            rel={openInNewTab ? 'noopener noreferrer' : undefined}
                            style={{ backgroundColor: buttonBackgroundColor, borderColor: buttonBorderColor, borderWidth: buttonBorderSize + 'px', borderStyle: 'solid', maxWidth: buttonMaxWidth + 'px' }}
                        />
                    </div>
                <div className="cta-1__image">
                    {imageUrl && <img src={imageUrl} alt={imageAlt} loading="lazy" />}
                    <div style={{ backgroundColor: filterColor,  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></div>
                </div>
            </div>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const {
            title, text, buttonText, buttonUrl, openInNewTab, imageUrl, imageAlt,
            filterColor,  buttonBackgroundColor, buttonBorderColor, buttonBorderSize, buttonMaxWidth,
             pcTextAlign, mobileTextAlign, maxWidth, headingLevel
        } = attributes;

        // 見出しタグ名を動的に決定
        const TagName = `h${headingLevel}`;

        // useBlockProps.save() で apiVersion 3 対応
        const blockProps = useBlockProps.save({
            className: `wp-block-wdl-cta-1 ${maxWidth > 0 ? 'max_w' : ''}`,
            style: maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}
        });

        return (
            <div {...blockProps}>
                <div className="cta-1__inner">
                    <RichText.Content
                        tagName={TagName}
                        className="cta-1__title heading_style_reset"
                        value={title}
                    />
                    <RichText.Content
                        tagName="p"
                        className={`cta-1__text ${pcTextAlign === 'left' ? 'text_align_pc_left' : ''} ${mobileTextAlign === 'left' ? 'text_align_sp_left' : ''}`}
                        value={text}
                    />
                    <RichText.Content
                        tagName="a"
                        className="cta-1__button"
                        href={buttonUrl}
                        target={openInNewTab ? '_blank' : undefined}
                        rel={openInNewTab ? 'noopener noreferrer' : undefined}
                        value={buttonText}
                        style={{ backgroundColor: buttonBackgroundColor, borderColor: buttonBorderColor, borderWidth: buttonBorderSize + 'px', borderStyle: 'solid', maxWidth: buttonMaxWidth + 'px' }}
                    />
                </div>
                <div className="cta-1__image">
                    {imageUrl && <img src={imageUrl} alt={imageAlt} loading="lazy" />}
                    <div style={{ backgroundColor: filterColor,  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></div>
                </div>
            </div>
        );
    }
});