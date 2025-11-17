import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, RangeControl, ColorPalette } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/shin-gas-station-01-message-01', {
    title: 'メッセージ 1 shin shop pattern 01',
    icon: 'admin-comments',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        subTitle: { type: 'string', default: '代表挨拶' },
        mainTitle: { type: 'string', default: 'Message' },
        bodyText: { type: 'string', default: '私たちは「Drive freely, live comfortably.（自由に走り、快適に暮らす）」を掲げ、地域に根ざしたサービスを提供し、お客様のカーライフをより豊かにすることを目指してまいりました。エネルギー事業では、高品質な燃料と細やかな接客で安全・快適な走行を支え、リース事業では多様なニーズに応える柔軟なプランで移動の自由を広げています。さらに、地域イベントの協賛や公共インフラ整備への協力を通じて、地域社会の活性化にも尽力しています。私たちは、地域社会や環境への配慮を欠かさず、常に新しい挑戦を続けながら、持続可能な未来の実現に向けて歩んでまいります。これからもお客様と地域の笑顔のために、心を込めたサービスを提供し続けます。' },
        imgUrl: { type: 'string', default: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=400&h=400&auto=format&fit=crop&q=80' },
        imgAlt: { type: 'string', default: '代表の写真' },
        captionSub: { type: 'string', default: '代表取締役' },
        captionMain: { type: 'string', default: '山田太郎' },
        colorMain: { type: 'string', default: 'var(--color-main)' },
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { subTitle, mainTitle, bodyText, imgUrl, imgAlt, captionSub, captionMain, colorMain } = attributes;

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
                <div className="shin-gas-station-01-message-01">
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
