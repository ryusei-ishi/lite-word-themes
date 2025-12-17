import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, RangeControl, ColorPalette } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    title: 'メッセージ 1 shin shop pattern 01',
    icon: 'admin-comments',
    category: 'lw-content',
    supports: {
        anchor: true, 
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { subTitle, mainTitle, bodyText, imgUrl, imgAlt, captionSub, captionMain, colorMain } = attributes;

        
        const blockProps = useBlockProps({
            className: 'shin-gas-station-01-message-01'
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title="画像設定">
                        <MediaUpload
                            onSelect={(media) => setAttributes({ imgUrl: media.url })}
                            allowedTypes={['image']}
                            render={({ open }) => (
                                <>
                                    {imgUrl ? (
                                        <div>
                                            <img src={imgUrl} alt={imgAlt} style={{ maxWidth: '100%', height: 'auto' }} />
                                            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
                                                画像を変更
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={open} variant="secondary">
                                            画像を選択
                                        </Button>
                                    )}
                                </>
                            )}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <TextControl
                                label="画像の代替テキスト"
                                value={imgAlt}
                                onChange={(value) => setAttributes({ imgAlt: value })}
                                placeholder="画像の説明を入力"
                            />
                        </div>
                    </PanelBody>

                    <PanelBody title="カラー設定">
                        <p>リードテキストの色</p>
                        <ColorPalette
                            value={colorMain}
                            onChange={(newColor) => setAttributes({ colorMain: newColor })}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div {...blockProps}>
                    <div className="shin-gas-station-01-message-01__wrap">
                        <div className="text__in">
                            <h3 className="title">
                                <RichText
                                    tagName="div"
                                    className="main"
                                    data-lw_font_set="Montserrat"
                                    value={mainTitle}
                                    onChange={(value) => setAttributes({ mainTitle: value })}
                                    placeholder="メインタイトルを入力"
                                />
                                <RichText
                                    tagName="div"
                                    className="sub"
                                    value={subTitle}
                                    onChange={(value) => setAttributes({ subTitle: value })}
                                    placeholder="サブタイトルを入力"
                                    style={{ color: colorMain }}
                                />
                            </h3>
                            <RichText
                                tagName="p"
                                className="description"
                                value={bodyText}
                                onChange={(value) => setAttributes({ bodyText: value })}
                                placeholder="本文テキストを入力"
                            />
                            <figcaption className="img_caption">
                                <RichText
                                    tagName="span"
                                    className="sub"
                                    value={captionSub}
                                    onChange={(value) => setAttributes({ captionSub: value })}
                                    placeholder="キャプションのサブタイトルを入力"
                                />
                                <RichText
                                    tagName="span"
                                    className="main"
                                    value={captionMain}
                                    onChange={(value) => setAttributes({ captionMain: value })}
                                    placeholder="キャプションのメインタイトルを入力"
                                />
                            </figcaption>
                        </div>
                        <div className="image">
                            <figure className="img">
                                <img loading="lazy" src={imgUrl} alt={imgAlt} />
                            </figure>
                        </div>
                    </div>
                </div>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { subTitle, mainTitle, bodyText, imgUrl, imgAlt, captionSub, captionMain, colorMain } = attributes;
    
        return (
            <div className="shin-gas-station-01-message-01">
                <div className="shin-gas-station-01-message-01__wrap">
                    <div className="text__in">
                        <h3 className="title">
                            <RichText.Content tagName="div" className="main" data-lw_font_set="Montserrat" value={mainTitle} />
                            <RichText.Content 
                            tagName="div" className="sub" value={subTitle} style={{ color: colorMain }}/>
                        </h3>
                        <RichText.Content 
                            tagName="p" 
                            className="description" 
                            value={bodyText.replace(/\n/g, '<br />')} 
                        />
                        <figcaption className="img_caption">
                            <RichText.Content tagName="span" className="sub" value={captionSub} />
                            <RichText.Content tagName="span" className="main" value={captionMain} />
                        </figcaption>
                    </div>
                    <div className="image">
                        <figure className="img">
                            <img loading="lazy" src={imgUrl} alt={imgAlt} />
                        </figure>
                    </div>
                </div>
            </div>
        );
    }
});
