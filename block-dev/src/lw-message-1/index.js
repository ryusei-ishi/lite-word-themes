import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, RangeControl, ColorPalette } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { subTitle, mainTitle, leadText, bodyText, imgUrl, imgAlt, captionSub, captionMain, colorMain, filterOpacity, maxWidth } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-message-1'
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
                    <PanelBody title="スタイル設定">
                        <RangeControl
                            label="背景フィルターの透明度"
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.05}
                        />
                        <RangeControl
                            label="ラップの最大幅"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={400}
                            max={1200}
                            step={10}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <div className="lw-message-1__wrap" style={{ maxWidth: `${maxWidth}px` }}>
                        <div className="text__in">
                            <h3 className="title">
                                <RichText
                                    tagName="div"
                                    className="sub"
                                    value={subTitle}
                                    onChange={(value) => setAttributes({ subTitle: value })}
                                    placeholder="サブタイトルを入力"
                                    style={{ color: colorMain }}
                                />
                                <RichText
                                    tagName="div"
                                    className="main"
                                    value={mainTitle}
                                    onChange={(value) => setAttributes({ mainTitle: value })}
                                    placeholder="メインタイトルを入力"
                                />
                            </h3>
                            <RichText
                                tagName="p"
                                className="lead"
                                value={leadText}
                                onChange={(value) => setAttributes({ leadText: value })}
                                placeholder="リードテキストを入力"
                                style={{ color: colorMain }}
                            />
                            <RichText
                                tagName="p"
                                className="description"
                                value={bodyText}
                                onChange={(value) => setAttributes({ bodyText: value })}
                                placeholder="本文テキストを入力"
                            />
                        </div>
                        <div className="image">
                            <figure className="img">
                                <img loading="lazy" src={imgUrl} alt={imgAlt} />
                            </figure>
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
                    </div>
                    <div className="bg_filter" style={{ opacity: filterOpacity,backgroundColor:colorMain }}></div>
                </div>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { subTitle, mainTitle, leadText, bodyText, imgUrl, imgAlt, captionSub, captionMain, colorMain, filterOpacity, maxWidth } = attributes;
    
        return (
            <div className="lw-message-1">
                <div className="lw-message-1__wrap" style={{ maxWidth: `${maxWidth}px` }}>
                    <div className="text__in">
                        <h3 className="title">
                            <RichText.Content 
                            tagName="div" className="sub" value={subTitle} style={{ color: colorMain }}/>
                            <RichText.Content tagName="div" className="main" value={mainTitle} />
                        </h3>
                        <RichText.Content 
                            tagName="p" 
                            className="lead" 
                            value={leadText.replace(/\n/g, '<br />')} 
                            style={{ color: colorMain }}
                        />
                        <RichText.Content 
                            tagName="p" 
                            className="description" 
                            value={bodyText.replace(/\n/g, '<br />')} 
                        />
                    </div>
                    <div className="image">
                        <figure className="img">
                            <img loading="lazy" src={imgUrl} alt={imgAlt} />
                        </figure>
                        <figcaption className="img_caption">
                            <RichText.Content tagName="span" className="sub" value={captionSub} />
                            <RichText.Content tagName="span" className="main" value={captionMain} />
                        </figcaption>
                    </div>
                </div>
                <div className="bg_filter" style={{ opacity: filterOpacity,backgroundColor:colorMain }}></div>
            </div>
        );
    }
});
