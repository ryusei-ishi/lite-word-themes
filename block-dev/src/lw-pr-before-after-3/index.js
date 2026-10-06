import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, MediaUpload, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, ColorPalette, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import { fontOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ラベル（Before / After）のフォント（2026-10-06・fontLabel）。
 * 既定は今までの直書きと同じ "Montserrat"。保存済みのページの HTML と一致するので検証エラーは出ない。
 * 共通の選択肢（fontOptionsArr）に Montserrat が無いので、このブロックだけ末尾に足す。 */
const labelFontOptions = [...fontOptionsArr(), { label: 'Montserrat', value: 'Montserrat' }];

registerBlockType(metadata.name, {
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            beforeImageUrl,
            beforeImageAlt,
            beforeText,
            beforeDescription,
            afterImageUrl,
            afterImageAlt,
            afterText,
            afterDescription,
            beforeTextBgColor,
            afterTextBgColor,
            arrowBgColor,
            maxWidth,
            aspectRatioHeight,
            hasImageShadow,
            fontLabel,
        } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-pr-before-after-3'
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title="マニュアル">
                        <div>
                            <Button
                                variant="secondary"
                                href="https://www.youtube.com/watch?v=SFx8Eq_GJFo"
                                target="_blank"
                            >
                                このブロックの使い方はこちら
                            </Button>
                        </div>
                    </PanelBody>
                    <PanelBody title="Before画像設定">
                        <MediaUpload
                            onSelect={(media) => setAttributes({ beforeImageUrl: media.url })}
                            allowedTypes={['image']}
                            render={({ open }) => (
                                <>
                                    {beforeImageUrl ? (
                                        <div>
                                            <img src={beforeImageUrl} alt={beforeImageAlt} style={{ maxWidth: '100%', height: 'auto' }} />
                                            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
                                                画像を変更
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={open} variant="secondary">画像を選択</Button>
                                    )}
                                </>
                            )}
                        />
                        <TextControl
                            label="Before画像の代替テキスト"
                            value={beforeImageAlt}
                            onChange={(value) => setAttributes({ beforeImageAlt: value })}
                            placeholder="画像の説明を入力"
                            style={{ marginTop: '10px' }}
                        />
                        <p style={{ marginTop: '16px' }}>Beforeテキストの背景色</p>
                        <ColorPalette
                            value={beforeTextBgColor}
                            onChange={(newColor) => setAttributes({ beforeTextBgColor: newColor })}
                        />
                    </PanelBody>

                    <PanelBody title="After画像設定" initialOpen={true}>
                        <MediaUpload
                            onSelect={(media) => setAttributes({ afterImageUrl: media.url })}
                            allowedTypes={['image']}
                            render={({ open }) => (
                                <>
                                    {afterImageUrl ? (
                                        <div>
                                            <img src={afterImageUrl} alt={afterImageAlt} style={{ maxWidth: '100%', height: 'auto' }} />
                                            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
                                                画像を変更
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={open} variant="secondary">画像を選択</Button>
                                    )}
                                </>
                            )}
                        />
                        <TextControl
                            label="After画像の代替テキスト"
                            value={afterImageAlt}
                            onChange={(value) => setAttributes({ afterImageAlt: value })}
                            placeholder="画像の説明を入力"
                            style={{ marginTop: '10px' }}
                        />
                        <p style={{ marginTop: '16px' }}>Afterテキストの背景色</p>
                        <ColorPalette
                            value={afterTextBgColor}
                            onChange={(newColor) => setAttributes({ afterTextBgColor: newColor })}
                        />
                    </PanelBody>

                    <PanelBody title="その他の設定" initialOpen={true}>
                        <p>矢印部分の背景色</p>
                        <ColorPalette
                            value={arrowBgColor}
                            onChange={(newColor) => setAttributes({ arrowBgColor: newColor })}
                        />
                        <RangeControl
                            label="最大横幅（.this_wrap）"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={300}
                            max={1600}
                            step={10}
                        />
                        <RangeControl
                            label="画像アスペクト比設定"
                            value={aspectRatioHeight}
                            onChange={(value) => setAttributes({ aspectRatioHeight: value })}
                            min={100}
                            max={1200}
                            step={10}
                            help="aspect-ratio: 800 / ○○ の ○○部分を変更します。"
                        />
                        <ToggleControl
                            label="画像に影をつける"
                            checked={hasImageShadow}
                            onChange={(value) => setAttributes({ hasImageShadow: value })}
                        />
                        <SelectControl
                            label="ラベル（Before / After）のフォント"
                            help="「未選択」にすると、サイト全体のフォント設定に合わせます。"
                            value={fontLabel}
                            options={labelFontOptions}
                            onChange={(value) => setAttributes({ fontLabel: value })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="this_wrap" style={{ maxWidth: maxWidth + 'px' }}>
                        <div className="image-area">
                            <div className={`image ${hasImageShadow ? 'has-shadow' : ''}`} style={{ aspectRatio: `800 / ${aspectRatioHeight}` }}>
                                <img
                                    src={beforeImageUrl}
                                    alt={beforeImageAlt}
                                />
                                <div className="text" style={{ backgroundColor: beforeTextBgColor }}>
                                    <RichText
                                        value={beforeText}
                                        onChange={(value) => setAttributes({ beforeText: value })}
                                        placeholder="Before"
                                        data-lw_font_set={fontLabel}
                                    />
                                </div>
                            </div>
                            <div className="arrow-right" style={{ borderLeft: `20px solid ${arrowBgColor}` }}></div>
                            <div className={`image ${hasImageShadow ? 'has-shadow' : ''}`} style={{ aspectRatio: `800 / ${aspectRatioHeight}` }}>
                                <img
                                    src={afterImageUrl}
                                    alt={afterImageAlt}
                                />
                                <div className="text" style={{ backgroundColor: afterTextBgColor }}>
                                    <RichText
                                        value={afterText}
                                        onChange={(value) => setAttributes({ afterText: value })}
                                        placeholder="After"
                                        data-lw_font_set={fontLabel}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="desc-area">
                            <RichText
                                tagName="p"
                                className="desc"
                                value={beforeDescription}
                                onChange={(value) => setAttributes({ beforeDescription: value })}
                                placeholder="Beforeの説明テキストを入力..."
                            />
                            <RichText
                                tagName="p"
                                className="desc"
                                value={afterDescription}
                                onChange={(value) => setAttributes({ afterDescription: value })}
                                placeholder="Afterの説明テキストを入力..."
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    },

    save: (props) => {
        const { attributes } = props;
        const {
            beforeImageUrl,
            beforeImageAlt,
            beforeText,
            beforeDescription,
            afterImageUrl,
            afterImageAlt,
            afterText,
            afterDescription,
            beforeTextBgColor,
            afterTextBgColor,
            arrowBgColor,
            maxWidth,
            aspectRatioHeight,
            hasImageShadow,
            fontLabel,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-pr-before-after-3'
        });

        return (
            <div {...blockProps}>
                <div className="this_wrap" style={{ maxWidth: maxWidth + 'px' }}>
                    <div className="image-area">
                        <div className={`image ${hasImageShadow ? 'has-shadow' : ''}`} style={{ aspectRatio: `800 / ${aspectRatioHeight}` }}>
                            <img
                                src={beforeImageUrl}
                                alt={beforeImageAlt}
                            />
                            <div className="text" style={{ backgroundColor: beforeTextBgColor }} data-lw_font_set={fontLabel}>
                                <RichText.Content value={beforeText} />
                            </div>
                        </div>
                        <div className="arrow-right" style={{ borderLeft: `20px solid ${arrowBgColor}` }}></div>
                        <div className={`image ${hasImageShadow ? 'has-shadow' : ''}`} style={{ aspectRatio: `800 / ${aspectRatioHeight}` }}>
                            <img
                                src={afterImageUrl}
                                alt={afterImageAlt}
                            />
                            <div className="text" style={{ backgroundColor: afterTextBgColor }} data-lw_font_set={fontLabel}>
                                <RichText.Content value={afterText} />
                            </div>
                        </div>
                    </div>
                    { (beforeDescription || afterDescription) && (
                        <div className="desc-area">
                            { beforeDescription && (
                                <RichText.Content tagName="p" className="desc" value={beforeDescription} />
                            ) }
                            { afterDescription && (
                                <RichText.Content tagName="p" className="desc" value={afterDescription} />
                            ) }
                        </div>
                    ) }
                </div>
            </div>
        );
    },
});
