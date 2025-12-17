import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, PanelColorSettings , useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            testimonials,
            h2Title,
            h2FontSet,
            h2FontWeight,
            h2TextColor,
            nameTextColor,
            nameBackgroundColor,
            nameFontSet,
            nameFontWeight,
            h3TextColor,
            h3FontSet,
            h3FontWeight,
            pTextColor,
            pFontSet,
            pFontWeight,
            backgroundColor,
        } = attributes;

        // testimonial追加
        const addTestimonial = () => {
            const newTestimonial = { name: '新しい名前', title: '新しいタイトル', content: '新しいコンテンツ' };
            setAttributes({ testimonials: [...testimonials, newTestimonial] });
        };

        // testimonial削除
        const removeTestimonial = (index) => {
            const updatedTestimonials = testimonials.filter((_, i) => i !== index);
            setAttributes({ testimonials: updatedTestimonials });
        };

        // testimonial更新
        const updateTestimonial = (index, key, value) => {
            const updatedTestimonials = [...testimonials];
            updatedTestimonials[index][key] = value;
            setAttributes({ testimonials: updatedTestimonials });
        };

        const blockProps = useBlockProps({
            className: 'lw-voice-1',
            style: { backgroundColor: backgroundColor }
        });

        return (
            <>
                <InspectorControls>
                    <div
                        style={{
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '5px',
                        }}
                    >
                        <div>
                            <h3>コンテンツ 追加と削除</h3>
                        </div>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <Button
                                    isDestructive
                                    onClick={() => removeTestimonial(index)}
                                    style={{
                                        marginTop: '10px',
                                        backgroundColor: '#f0f0f0',
                                        color: '#333',
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    コンテンツ{index + 1}を削除
                                </Button>
                            </div>
                        ))}
                        <Button isPrimary onClick={addTestimonial} style={{ margin: '20px 0' }}>
                            コンテンツを追加
                        </Button>
                    </div>
                    <PanelColorSettings
                        title="全体の背景色"
                        colorSettings={[
                            {
                                value: backgroundColor,
                                onChange: (color) => setAttributes({ backgroundColor: color }),
                                label: '背景色',
                            },
                        ]}
                    />
                    <PanelBody title="■メインタイトルの設定">
                        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' }}>
                            <RichText
                                label="メインタイトル"
                                value={h2Title}
                                onChange={(value) => setAttributes({ h2Title: value })}
                                placeholder="タイトルを入力"
                            />
                            <SelectControl
                                label="フォントの種類"
                                value={h2FontSet}
                                options={fontOptions}
                                onChange={(value) => setAttributes({ h2FontSet: value })}
                            />
                            <SelectControl
                                label="フォントの太さ"
                                value={h2FontWeight}
                                options={fontWeightOptions}
                                onChange={(value) => setAttributes({ h2FontWeight: value })}
                            />
                            <PanelColorSettings
                                colorSettings={[
                                    {
                                        value: h2TextColor,
                                        onChange: (color) => setAttributes({ h2TextColor: color }),
                                        label: 'テキストの色',
                                    },
                                ]}
                            />
                        </div>
                    </PanelBody>
                    <PanelBody title="■コメント内：名前部分の設定">
                        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' }}>
                            <SelectControl
                                label="フォントの種類"
                                value={nameFontSet}
                                options={fontOptions}
                                onChange={(value) => setAttributes({ nameFontSet: value })}
                            />
                            <SelectControl
                                label="フォントの太さ"
                                value={nameFontWeight}
                                options={fontWeightOptions}
                                onChange={(value) => setAttributes({ nameFontWeight: value })}
                            />
                            <PanelColorSettings
                                colorSettings={[
                                    {
                                        value: nameTextColor,
                                        onChange: (color) => setAttributes({ nameTextColor: color }),
                                        label: 'テキストの色',
                                    },
                                    {
                                        value: nameBackgroundColor,
                                        onChange: (color) => setAttributes({ nameBackgroundColor: color }),
                                        label: '背景色',
                                    },
                                ]}
                            />
                        </div>
                    </PanelBody>

                    <PanelBody title="■コメント内：タイトルの設定">
                        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' }}>
                            <SelectControl
                                label="フォントの種類"
                                value={h3FontSet}
                                options={fontOptions}
                                onChange={(value) => setAttributes({ h3FontSet: value })}
                            />
                            <SelectControl
                                label="フォントの太さ"
                                value={h3FontWeight}
                                options={fontWeightOptions}
                                onChange={(value) => setAttributes({ h3FontWeight: value })}
                            />
                            <PanelColorSettings
                                colorSettings={[
                                    {
                                        value: h3TextColor,
                                        onChange: (color) => setAttributes({ h3TextColor: color }),
                                        label: 'テキストの色',
                                    },
                                ]}
                            />
                        </div>
                    </PanelBody>

                    <PanelBody title="■コメント内：本文の設定">
                        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' }}>
                            <SelectControl
                                label="フォントの種類"
                                value={pFontSet}
                                options={fontOptions}
                                onChange={(value) => setAttributes({ pFontSet: value })}
                            />
                            <SelectControl
                                label="フォントの太さ"
                                value={pFontWeight}
                                options={fontWeightOptions}
                                onChange={(value) => setAttributes({ pFontWeight: value })}
                            />
                            <PanelColorSettings
                                colorSettings={[
                                    {
                                        value: pTextColor,
                                        onChange: (color) => setAttributes({ pTextColor: color }),
                                        label: 'テキストの色',
                                    },
                                ]}
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="lw-voice-1_inner">
                    <RichText
                        tagName="h2"
                        className="lw-voice-1__title"
                        value={h2Title}
                        onChange={(value) => setAttributes({ h2Title: value })}
                        style={{ fontWeight: h2FontWeight, color: h2TextColor }}
                        data-lw_font_set={h2FontSet}
                    />
                    <ul className="lw-voice-1__ul">
                        {testimonials.map((testimonial, index) => (
                            <li className="lw-voice-1__li" key={index}>
                                <div
                                    className="lw-voice-1__name"
                                    style={{
                                        backgroundColor: nameBackgroundColor,
                                        color: nameTextColor,
                                        fontWeight: nameFontWeight,
                                    }}
                                    data-lw_font_set={nameFontSet}
                                >
                                    <RichText
                                        value={testimonial.name}
                                        onChange={(value) => updateTestimonial(index, 'name', value)}
                                        placeholder="名前を入力"
                                    />
                                </div>
                                <div className="lw-voice-1__text">
                                    <RichText
                                        tagName="h3"
                                        value={testimonial.title}
                                        onChange={(value) => updateTestimonial(index, 'title', value)}
                                        placeholder="タイトルを入力"
                                        style={{ color: h3TextColor, fontWeight: h3FontWeight }}
                                        data-lw_font_set={h3FontSet}
                                    />
                                    <RichText
                                        tagName="p"
                                        value={testimonial.content}
                                        onChange={(value) => updateTestimonial(index, 'content', value)}
                                        placeholder="コンテンツを入力"
                                        style={{ color: pTextColor, fontWeight: pFontWeight }}
                                        data-lw_font_set={pFontSet}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
            </>
        );
    },
    save: (props) => {
        const { attributes } = props;
        const {
            testimonials,
            h2Title,
            h2FontSet,
            h2FontWeight,
            h2TextColor,
            nameTextColor,
            nameBackgroundColor,
            nameFontSet,
            nameFontWeight,
            h3TextColor,
            h3FontSet,
            h3FontWeight,
            pTextColor,
            pFontSet,
            pFontWeight,
            backgroundColor,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-voice-1',
            style: { backgroundColor: backgroundColor }
        });

        return (
            <div {...blockProps}>
                <RichText.Content
                    tagName="h2"
                    className="lw-voice-1__title"
                    value={h2Title}
                    style={{ fontWeight: h2FontWeight, color: h2TextColor }}
                    data-lw_font_set={h2FontSet}
                />
                <ul className="lw-voice-1__ul">
                    {testimonials.map((testimonial, index) => (
                        <li className="lw-voice-1__li" key={index}>
                            <div
                                className="lw-voice-1__name"
                                style={{
                                    backgroundColor: nameBackgroundColor,
                                    color: nameTextColor,
                                    fontWeight: nameFontWeight,
                                }}
                                data-lw_font_set={nameFontSet}
                            >
                                <RichText.Content value={testimonial.name} />
                            </div>
                            <div className="lw-voice-1__text">
                                <RichText.Content
                                    tagName="h3"
                                    value={testimonial.title}
                                    style={{ color: h3TextColor, fontWeight: h3FontWeight }}
                                    data-lw_font_set={h3FontSet}
                                />
                                <RichText.Content
                                    tagName="p"
                                    value={testimonial.content}
                                    style={{ color: pTextColor, fontWeight: pFontWeight }}
                                    data-lw_font_set={pFontSet}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    },
});
