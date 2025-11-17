import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    ColorPalette,
    RangeControl,
    SelectControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/paid-block-voice-2', {
    title: 'お客様の声 2',
    icon: 'format-status',
    category: 'liteword-other',

    attributes: {
        // --- 単体のタイトルや説明は「source: 'html' + selector」でOK ---
        blockTitleMain: {
            type: 'string',
            source: 'html',
            selector: '.ttl .main',
            default: 'お客様の声'
        },
        blockTitleSub: {
            type: 'string',
            source: 'html',
            selector: '.ttl .sub',
            default: 'VOICE'
        },
        explanation: {
            type: 'string',
            source: 'html',
            selector: '.explanation',
            default: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト'
        },

        // --- フィルターの色・不透明度 ---
        filterColor: {
            type: 'string',
            default: 'var(--color-main)'
        },
        filterOpacity: {
            type: 'number',
            default: 0.9
        },

        // --- フォント系 ---
        voiceSubNameFont: {
            type: 'string',
            default: 'Noto Sans JP'
        },
        voiceSubNameFontWeight: {
            type: 'string',
            default: '400'
        },
        voiceSubNameFontColor: {
            type: 'string',
            default: 'var(--color-black)'
        },
        voiceMeinNameFont: {
            type: 'string',
            default: 'Noto Sans JP'
        },
        voiceMeinNameFontWeight: {
            type: 'string',
            default: '500'
        },
        voiceMeinNameFontColor: {
            type: 'string',
            default: 'var(--color-black)'
        },
        voiceCommentFont: {
            type: 'string',
            default: 'Noto Sans JP'
        },
        voiceCommentFontWeight: {
            type: 'string',
            default: '400'
        },
        voiceCommentFontColor: {
            type: 'string',
            default: 'var(--color-black)'
        },
        voiceThanksFont: {
            type: 'string',
            default: 'Dancing Script'
        },
        voiceThanksFontWeight: {
            type: 'string',
            default: '400'
        },
        voiceThanksFontColor: {
            type: 'string',
            default: 'var(--color-black)'
        },

        // --- voices 配列を query で定義: li 要素を繰り返し解析 ---
        voices: {
            type: 'array',
            source: 'query',
            selector: '.voice_list li',
            default: [
                {
                    image: 'https://lite-word.com/sample_img/women/1.webp',
                    thanks: 'thank you',
                    sub: '東京都 経営者',
                    nameBig: 'やまだ',
                    nameSmall: 'さん',
                    comment: 'テキストテキストテキストテキストテキストテキストテキストテキスト'
                }
            ],
            // query で、各要素がどうHTMLを取得するか定義する
            query: {
                image: {
                    // 画像URLは <img src="..." /> の src 属性から取得
                    type: 'string',
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'src'
                },
                thanks: {
                    // 「thank you」は <span class="thanks"> の内側HTML
                    type: 'string',
                    source: 'html',
                    selector: '.thanks'
                },
                sub: {
                    type: 'string',
                    source: 'html',
                    selector: '.sub'
                },
                nameBig: {
                    type: 'string',
                    source: 'html',
                    selector: '.big'
                },
                nameSmall: {
                    type: 'string',
                    source: 'html',
                    selector: '.small'
                },
                comment: {
                    // コメント欄
                    type: 'string',
                    source: 'html',
                    selector: '.comment'
                }
            }
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const {
            blockTitleMain,
            blockTitleSub,
            explanation,
            filterColor,
            filterOpacity,
            voiceSubNameFont,
            voiceSubNameFontWeight,
            voiceSubNameFontColor,
            voiceMeinNameFont,
            voiceMeinNameFontWeight,
            voiceMeinNameFontColor,
            voiceCommentFont,
            voiceCommentFontWeight,
            voiceCommentFontColor,
            voiceThanksFont,
            voiceThanksFontWeight,
            voiceThanksFontColor,
            voices
        } = attributes;

        // voices 配列の要素を更新
        const updateVoice = (index, key, value) => {
            const updated = [...voices];
            updated[index][key] = value;
            setAttributes({ voices: updated });
        };

        // voices 配列に新規要素を追加
        const addVoice = () => {
            setAttributes({
                voices: [
                    ...voices,
                    {
                        image: '',
                        thanks: '',
                        sub: '',
                        nameBig: '',
                        nameSmall: '',
                        comment: ''
                    }
                ]
            });
        };

        // voices 配列の要素を削除
        const removeVoice = (index) => {
            setAttributes({
                voices: voices.filter((_, i) => i !== index),
            });
        };

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="マニュアル">
                        <div>
                            <Button
                                variant="secondary"
                                href="https://www.youtube.com/watch?v=JMqfqbcr9YU"
                                target="_blank"
                            >
                                このブロックの使い方はこちら
                            </Button>
                        </div>
                    </PanelBody>
                    <PanelBody title="全体設定">
                        <p>タイトル・説明の設定はこちらから</p>
                        <p>フィルターの色</p>
                        <ColorPalette
                            value={filterColor}
                            onChange={(color) => setAttributes({ filterColor: color })}
                        />
                        <RangeControl
                            label="フィルターの透明度"
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.05}
                        />
                    </PanelBody>

                    <PanelBody title="フォント設定（voice_list内）">
                        {/* 肩書き */}
                        <SelectControl
                            label="肩書きのフォント"
                            value={voiceSubNameFont}
                            options={fontOptions}
                            onChange={(value) =>
                                setAttributes({ voiceSubNameFont: value })
                            }
                        />
                        <SelectControl
                            label="肩書きの太さ"
                            value={voiceSubNameFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) =>
                                setAttributes({ voiceSubNameFontWeight: value })
                            }
                        />
                        <ColorPalette
                            label="肩書きの色"
                            value={voiceSubNameFontColor}
                            onChange={(color) =>
                                setAttributes({ voiceSubNameFontColor: color })
                            }
                        />

                        {/* 名前 */}
                        <SelectControl
                            label="名前のフォント"
                            value={voiceMeinNameFont}
                            options={fontOptions}
                            onChange={(value) =>
                                setAttributes({ voiceMeinNameFont: value })
                            }
                        />
                        <SelectControl
                            label="名前の太さ"
                            value={voiceMeinNameFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) =>
                                setAttributes({ voiceMeinNameFontWeight: value })
                            }
                        />
                        <ColorPalette
                            label="名前の色"
                            value={voiceMeinNameFontColor}
                            onChange={(color) =>
                                setAttributes({ voiceMeinNameFontColor: color })
                            }
                        />

                        {/* コメント */}
                        <SelectControl
                            label="コメントのフォント"
                            value={voiceCommentFont}
                            options={fontOptions}
                            onChange={(value) =>
                                setAttributes({ voiceCommentFont: value })
                            }
                        />
                        <SelectControl
                            label="コメントの太さ"
                            value={voiceCommentFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) =>
                                setAttributes({ voiceCommentFontWeight: value })
                            }
                        />
                        <ColorPalette
                            label="コメントの色"
                            value={voiceCommentFontColor}
                            onChange={(color) =>
                                setAttributes({ voiceCommentFontColor: color })
                            }
                        />

                        {/* Thank you */}
                        <SelectControl
                            label="Thank youのフォント"
                            value={voiceThanksFont}
                            options={fontOptions}
                            onChange={(value) =>
                                setAttributes({ voiceThanksFont: value })
                            }
                        />
                        <SelectControl
                            label="Thank youの太さ"
                            value={voiceThanksFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) =>
                                setAttributes({ voiceThanksFontWeight: value })
                            }
                        />
                        <ColorPalette
                            label="Thank youの色"
                            value={voiceThanksFontColor}
                            onChange={(color) =>
                                setAttributes({ voiceThanksFontColor: color })
                            }
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="paid-block-voice-2">
                    <div className="paid-block-voice-2__wrap">

                        {/* タイトル・説明 */}
                        <h2 className="ttl">
                            <RichText
                                tagName="span"
                                className="main"
                                value={blockTitleMain}
                                onChange={(val) => setAttributes({ blockTitleMain: val })}
                                placeholder="メインタイトル"
                            />
                            <RichText
                                tagName="span"
                                className="sub"
                                value={blockTitleSub}
                                onChange={(val) => setAttributes({ blockTitleSub: val })}
                                placeholder="サブタイトル"
                            />
                        </h2>
                        <RichText
                            tagName="p"
                            className="explanation"
                            value={explanation}
                            onChange={(val) => setAttributes({ explanation: val })}
                            placeholder="説明文"
                        />

                        {/* お客様の声リスト */}
                        <ul className="voice_list">
                            {voices.map((item, index) => (
                                <li key={index}>
                                    <div className="image">
                                        <div className="in">
                                            {item.image && <img src={item.image} alt="" />}
                                            <MediaUpload
                                                onSelect={(media) => updateVoice(index, 'image', media.url)}
                                                allowedTypes={['image']}
                                                render={({ open }) => (
                                                    <Button onClick={open} isSecondary>
                                                        画像を{item.image ? '変更' : '選択'}
                                                    </Button>
                                                )}
                                            />
                                            <RichText
                                                tagName="span"
                                                className="thanks"
                                                data-lw_font_set={voiceThanksFont}
                                                style={{
                                                    fontWeight: voiceThanksFontWeight,
                                                    color: voiceThanksFontColor
                                                }}
                                                value={item.thanks}
                                                onChange={(val) => updateVoice(index, 'thanks', val)}
                                                placeholder="thank you"
                                            />
                                        </div>
                                    </div>
                                    <div className="text_in">
                                        <h3 className="name">
                                            <RichText
                                                tagName="span"
                                                className="sub"
                                                data-lw_font_set={voiceSubNameFont}
                                                style={{
                                                    fontWeight: voiceSubNameFontWeight,
                                                    color: voiceSubNameFontColor
                                                }}
                                                value={item.sub}
                                                onChange={(val) => updateVoice(index, 'sub', val)}
                                                placeholder="肩書き"
                                            />
                                            <span className="main">
                                                <RichText
                                                    tagName="span"
                                                    className="big"
                                                    data-lw_font_set={voiceMeinNameFont}
                                                    style={{
                                                        fontWeight: voiceMeinNameFontWeight,
                                                        color: voiceMeinNameFontColor
                                                    }}
                                                    value={item.nameBig}
                                                    onChange={(val) => updateVoice(index, 'nameBig', val)}
                                                    placeholder="名前大"
                                                />
                                                <RichText
                                                    tagName="span"
                                                    className="small"
                                                    data-lw_font_set={voiceMeinNameFont}
                                                    style={{
                                                        fontWeight: voiceMeinNameFontWeight,
                                                        color: voiceMeinNameFontColor
                                                    }}
                                                    value={item.nameSmall}
                                                    onChange={(val) => updateVoice(index, 'nameSmall', val)}
                                                    placeholder="名前小"
                                                />
                                            </span>
                                        </h3>
                                        <RichText
                                            tagName="p"
                                            className="comment"
                                            data-lw_font_set={voiceCommentFont}
                                            style={{
                                                fontWeight: voiceCommentFontWeight,
                                                color: voiceCommentFontColor
                                            }}
                                            value={item.comment}
                                            onChange={(val) => updateVoice(index, 'comment', val)}
                                            placeholder="コメント"
                                        />
                                    </div>

                                    <Button
                                        onClick={() => removeVoice(index)}
                                        isDestructive
                                        style={{ marginTop: '8px' }}
                                    >
                                        削除
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        <Button
                            onClick={addVoice}
                            isPrimary
                            style={{ marginTop: '12px' }}
                        >
                            ＋ 声を追加
                        </Button>
                    </div>
                    <div
                        className="filter"
                        style={{
                            backgroundColor: filterColor,
                            opacity: filterOpacity
                        }}
                    />
                </div>
            </Fragment>
        );
    },

    save: ({ attributes }) => {
        const {
            blockTitleMain,
            blockTitleSub,
            explanation,
            filterColor,
            filterOpacity,
            voiceSubNameFont,
            voiceSubNameFontWeight,
            voiceSubNameFontColor,
            voiceMeinNameFont,
            voiceMeinNameFontWeight,
            voiceMeinNameFontColor,
            voiceCommentFont,
            voiceCommentFontWeight,
            voiceCommentFontColor,
            voiceThanksFont,
            voiceThanksFontWeight,
            voiceThanksFontColor,
            voices
        } = attributes;

        return (
            <div className="paid-block-voice-2">
                <div className="paid-block-voice-2__wrap">
                    <h2 className="ttl">
                        <RichText.Content
                            tagName="span"
                            className="main"
                            value={blockTitleMain}
                        />
                        <RichText.Content
                            tagName="span"
                            className="sub"
                            value={blockTitleSub}
                        />
                    </h2>
                    <RichText.Content
                        tagName="p"
                        className="explanation"
                        value={explanation}
                    />

                    <ul className="voice_list">
                        {voices.map((item, index) => (
                            <li key={index}>
                                <div className="image">
                                    <div className="in">
                                        {/* 画像 */}
                                        {item.image && <img src={item.image} alt="" />}
                                        {/* Thanks */}
                                        <RichText.Content
                                            tagName="span"
                                            className="thanks"
                                            data-lw_font_set={voiceThanksFont}
                                            style={{
                                                fontWeight: voiceThanksFontWeight,
                                                color: voiceThanksFontColor
                                            }}
                                            value={item.thanks}
                                        />
                                    </div>
                                </div>

                                <div className="text_in">
                                    <h3 className="name">
                                        <RichText.Content
                                            tagName="span"
                                            className="sub"
                                            data-lw_font_set={voiceSubNameFont}
                                            style={{
                                                fontWeight: voiceSubNameFontWeight,
                                                color: voiceSubNameFontColor
                                            }}
                                            value={item.sub}
                                        />
                                        <span className="main">
                                            <RichText.Content
                                                tagName="span"
                                                className="big"
                                                data-lw_font_set={voiceMeinNameFont}
                                                style={{
                                                    fontWeight: voiceMeinNameFontWeight,
                                                    color: voiceMeinNameFontColor
                                                }}
                                                value={item.nameBig}
                                            />
                                            <RichText.Content
                                                tagName="span"
                                                className="small"
                                                data-lw_font_set={voiceMeinNameFont}
                                                style={{
                                                    fontWeight: voiceMeinNameFontWeight,
                                                    color: voiceMeinNameFontColor
                                                }}
                                                value={item.nameSmall}
                                            />
                                        </span>
                                    </h3>
                                    <RichText.Content
                                        tagName="p"
                                        className="comment"
                                        data-lw_font_set={voiceCommentFont}
                                        style={{
                                            fontWeight: voiceCommentFontWeight,
                                            color: voiceCommentFontColor
                                        }}
                                        value={item.comment}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    className="filter"
                    style={{
                        backgroundColor: filterColor,
                        opacity: filterOpacity
                    }}
                />
            </div>
        );
    }
});
