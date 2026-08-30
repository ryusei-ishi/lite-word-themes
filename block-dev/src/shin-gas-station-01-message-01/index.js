import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, RangeControl, ColorPalette } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const lwBlockDef = {
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

                    <PanelBody title="色設定">
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

        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-message-01'
        });

        return (
            <div {...blockProps}>
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
    },
    deprecated: [
        {
            apiVersion: metadata.apiVersion,
            attributes: metadata.attributes,
            supports: {
                anchor: true,
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
    },
        },
    ],
};

/* ------------------------------------------------------------------
 * #1169（2026-08-27）既定値の他社CDN直リンクを自社素材に差し替えた。
 * 既定値と同じ値はブロックコメントに書かれないので、既定値のまま使っている
 * 既存ページは「保存HTMLは旧URL／ブロックは新しい既定値」で食い違う。
 * 旧既定値を持った版を残して、開いて保存し直しても画像が入れ替わらないようにする。
 * 🚨 save は現行と同じ関数をそのまま渡す（マークアップは変えていない）。
 * ------------------------------------------------------------------ */
const LW_1169_OLD = JSON.parse( JSON.stringify( metadata.attributes ) );
LW_1169_OLD.imgUrl.default = "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=400&h=400&auto=format&fit=crop&q=80";

/* 🚨 すでにある deprecated は attributes: metadata.attributes を使っている＝新しい既定値を指す。
 *    そのままだと「古い save ＋ 古い既定値」で保存されたページ（サンプル画像のまま使っている人の
 *    大多数がこれ）がどの版にも当たらなくなる。だから既存の版それぞれについて
 *    旧既定値を持たせた双子を作って先に並べる。元の版も残す（画像を自分で差し替えた人向け）。 */
const lwPrev1169 = lwBlockDef.deprecated || [];
lwBlockDef.deprecated = [
	{ attributes: LW_1169_OLD, save: lwBlockDef.save },
	...lwPrev1169.map( ( d ) => ( { ...d, attributes: LW_1169_OLD } ) ),
	...lwPrev1169,
];

registerBlockType( metadata.name, lwBlockDef );
