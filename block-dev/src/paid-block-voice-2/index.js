import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    ColorPalette,
    RangeControl,
    SelectControl
} from '@wordpress/components';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    title: 'お客様の声 2',
    icon: 'format-status',
    category: 'lw-voice',

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

        
        const blockProps = useBlockProps({
            className: 'paid-block-voice-2'
        });

        return (
            <>
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

                
                <div {...blockProps}>
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
            </>
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

        const blockProps = useBlockProps.save({
            className: 'paid-block-voice-2',
        });

        return (
            <div {...blockProps}>
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
