import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, Button } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr, ButtonBackgroundOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
// 背景色オプションを変数に定義
const bgOptions = ButtonBackgroundOptionsArr();

registerBlockType('wdl/lw-step-1', {
    title: 'step 01',
    icon: 'lightbulb',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        bgGradient: {
            type: 'string',
            default: 'var(--color-main)'
        },
        filterOpacity: {
            type: 'number',
            default: 0.15
        },
        titleText: {
            type: 'string',
            default: '採用までの流れ'
        },
        ulMaxWidth: {
            type: 'number',
            default: 800
        },
        fontH3: {
            type: 'string',
            default: ''
        },
        fontWeightH3: {
            type: 'string',
            default: ''
        },
        fontP: {
            type: 'string',
            default: ''
        },
        fontWeightP: {
            type: 'string',
            default: ''
        },
        colorLiSvg: {
            type: 'string',
            default: 'var(--color-main)'
        },
        contents: {
            type: 'array',
            source: 'query',
            selector: '.lw-step-1__li',
            query: {
                title: {
                    type: 'string',
                    source: 'html',
                    selector: 'h3',
                },
                text: {
                    type: 'string',
                    source: 'html',
                    selector: 'p',
                },
                // Remove 'borderColor' if it's not used
            },
            default: [
                { title: '応募', text: '応募フォームより必要事項を入力し、送信してください。応募内容を確認し、追って担当者よりご連絡いたします。' },
                { title: '書類選考', text: 'ご応募いただいた内容をもとに、書類選考を行います。結果は1週間以内にメールにてお知らせいたします。' },
                { title: '面接', text: '書類選考に通過された方には、担当者による面接を実施します。面接日時はご相談の上、決定いたします。' },
                { title: '最終選考', text: '面接後、最終選考を行い、採用の可否を決定します。結果はメールにてご連絡いたします。' },
                { title: '内定', text: '最終選考を通過された方には、内定通知をお送りし、入社手続きを進めていただきます。' },
            ],
            
        },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { bgGradient, filterOpacity, ulMaxWidth,
                fontH3, fontWeightH3,
                fontP,fontWeightP, titleText, contents, colorLiSvg 
            } = attributes;

        // コンテンツを追加
        const addContent = () => {
            const newContent = { text: '新しいテキスト', borderColor: 'var(--color-main)' };
            setAttributes({ contents: [...contents, newContent] });
        };

        // コンテンツを削除
        const removeContent = (index) => {
            const updatedContents = contents.filter((_, i) => i !== index);
            setAttributes({ contents: updatedContents });
        };

        // コンテンツを更新
        const updateContent = (index, key, value) => {
            const updatedContents = [...contents];
            updatedContents[index][key] = value;
            setAttributes({ contents: updatedContents });
        };

        return (
            <Fragment>
                <InspectorControls>

                    {/* 背景色設定 */}
                    <PanelBody title="背景">
                        <SelectControl
                            label="フィルターの色"
                            value={bgGradient}
                            options={bgOptions}
                            onChange={(newGradient) => setAttributes({ bgGradient: newGradient })}
                        />
                        <RangeControl
                            label='透明度'
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                    </PanelBody>

                    <PanelBody title="リスト部分の設定">
                        <RangeControl
                            label='最大横幅'
                            value={ulMaxWidth}
                            onChange={(value) => setAttributes({ ulMaxWidth: value })}
                            min={600}
                            max={1280}
                            step={1}
                        />
                        
                        
                        <p>ダウンアイコンの色</p>
                        <ColorPalette
                            label="ダウンアイコンの色"
                            value={colorLiSvg}
                            onChange={(color) => setAttributes({ colorLiSvg: color })}
                        />
                        <SelectControl
                            label="タイトルのフォントの種類"
                            value={fontH3}
                            options={fontOptions}
                            onChange={(newFontH3) => setAttributes({ fontH3: newFontH3 })}
                        />
                        <SelectControl
                            label="タイトルのフォントの太さ"
                            value={fontWeightH3}
                            options={fontWeightOptions}
                            onChange={(newFontWeightH3) => setAttributes({ fontWeightH3: newFontWeightH3 })}
                        />
                        <SelectControl
                            label="段落のフォントの種類"
                            value={fontP}
                            options={fontOptions}
                            onChange={(newFontP) => setAttributes({ fontP: newFontP })}
                        />
                        <SelectControl
                            label="段落のフォントの太さ"
                            value={fontWeightP}
                            options={fontWeightOptions}
                            onChange={(newFontWeightP) => setAttributes({ fontWeightP: newFontWeightP })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="lw-step-1">
                    <RichText
                        tagName="h2"
                        className="lw-step-1__title"
                        value={titleText}
                        onChange={(value) => setAttributes({ titleText: value })}
                        placeholder="タイトルを入力"
                    />
                    <ul className="lw-step-1__inner" style={{maxWidth:ulMaxWidth}}>
                        {contents.map((content, index) => (
                            <li className="lw-step-1__li" key={index}>
                                <RichText
                                    tagName="h3"
                                    value={content.title}
                                    data-lw_font_set={fontH3}
                                    onChange={(value) => updateContent(index, 'title', value)}
                                    placeholder="タイトルを入力"
                                    style={{ fontWeight: fontWeightH3 , background:bgGradient}}
                                />
                                <RichText
                                    tagName="p"
                                    value={content.text}
                                    data-lw_font_set={fontP}
                                    onChange={(value) => updateContent(index, 'text', value)}
                                    placeholder="テキストを入力"
                                    style={{ fontWeight: fontWeightP }}
                                />
                                
                                <span className="icon" style={{ fill: colorLiSvg }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                </span>
                                <button className="lw-step-1__remove_btn" onClick={() => removeContent(index)}>削除</button>
                            </li>
                        ))}
                    </ul>
                    <button className="lw-step-1__add_btn" onClick={addContent}>リストを追加する</button>
                    <div className="lw-step-1__filter" style={{ background: bgGradient, opacity: filterOpacity }}></div>
                </div>
            </Fragment>
        );
    },


    save: function (props) {
        const { attributes } = props;
        const { titleText, ulMaxWidth, fontH3, fontWeightH3, fontP, fontWeightP, contents, bgGradient, filterOpacity, colorLiSvg } = attributes;

        return (
            <div className="lw-step-1">
                <RichText.Content
                    tagName="h2"
                    className="lw-step-1__title"
                    value={titleText}
                />
                <ul className="lw-step-1__inner" style={{ maxWidth: ulMaxWidth }}>
                    {contents.map((content, index) => (
                        <li className="lw-step-1__li" key={index}>
                            <RichText.Content
                                tagName="h3"
                                value={content.title}
                                data-lw_font_set={fontH3}
                                style={{ fontWeight: fontWeightH3, background: bgGradient }}
                            />
                            <RichText.Content
                                tagName="p"
                                value={content.text}
                                data-lw_font_set={fontP}
                                style={{ fontWeight: fontWeightP }}
                            />
                            <span className="icon" style={{ fill: colorLiSvg }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="lw-step-1__filter" style={{ background: bgGradient, opacity: filterOpacity }}></div>
            </div>
        );
    }

});
