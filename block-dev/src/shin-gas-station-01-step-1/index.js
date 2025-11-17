import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, Button } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
// 背景色オプションを変数に定義

registerBlockType('wdl/shin-gas-station-01-step-1', {
    title: 'ステップ 1 shin shop pattern 01',
    icon: 'lightbulb',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        fontLi: {
            type: 'string',
            default: ''
        },
        fontColorLi: {
            type: 'string',
            default: 'var(--color-black)'
        },
        fontWeightLi: {
            type: 'string',
            default: '600'
        },
        fontLiP: {
            type: 'string',
            default: ''
        },
        fontColorLiP: {
            type: 'string',
            default: 'var(--color-black)'
        },
        fontWeightLiP: {
            type: 'string',
            default: '400'
        },
        
        stepFont :{
            type: 'string',
            default: ''
        },
        stepFontColor: {
            type: 'string',
            default: '#fff'
        },
        stepFontWeight: {
            type: 'string',
            default: '600'
        },
        backgroundColor: {
            type: 'string',
            default: '#FAFAFA'
        },
        borderColor: {
            type: 'string',
             default: 'var(--color-main)'
        },
        borderSize: {
            type: 'number',
            default: 0
        },
        contents: {
            type: 'array',
            source: 'query',
            selector: '.shin-gas-station-01-step-1__li',
            query: {
                ttl: {
                  type: 'string',
                  source: 'html',
                  selector: '.shin-gas-station-01-step-1__text h4', // これが必須
                },
                text: {
                  type: 'string',
                  source: 'html',
                  selector: '.shin-gas-station-01-step-1__text p',
                },
              },
              
            default: [
                { ttl: 'タイトル', text: 'リストテキストリストテキスト ' },
                { ttl: 'タイトル', text: 'リストテキストリストテキスト ' },
                { ttl: 'タイトル', text: 'リストテキストリストテキスト ' },
                { ttl: 'タイトル', text: 'リストテキストリストテキスト ' },
            ],
        },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { fontLi, fontColorLi, fontWeightLi, 
                fontLiP, fontColorLiP, fontWeightLiP,
                stepFont, stepFontColor, stepFontWeight,
            contents ,backgroundColor ,borderColor,borderSize} = attributes;

        // コンテンツを追加
        const addContent = () => {
            const newContent = { text: '新しいテキスト'};
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
     
                    <PanelBody>
                        <p>背景色</p>
                        <ColorPalette
                            label="背景色"
                            value={backgroundColor}
                            onChange={(newBackgroundColor) => setAttributes({ backgroundColor: newBackgroundColor })}
                        />
                        <p>枠色と「STEP」の背景色</p>
                        <ColorPalette
                            label="枠の色"
                            value={borderColor}
                            onChange={(newBorderColor) => setAttributes({ borderColor: newBorderColor })}
                        />
                        <RangeControl
                            label="枠の太さ"
                            value={borderSize}
                            onChange={(newBorderSize) => setAttributes({ borderSize: newBorderSize })}
                            min={0}
                            max={10}
                        />
                        <p>タイトルの文字色</p>
                        <ColorPalette
                            label="タイトルの文字色"
                            value={fontColorLi}
                            onChange={(newFontColorLi) => setAttributes({ fontColorLi: newFontColorLi })}
                        />
                        <SelectControl
                            label="タイトルのフォントの種類"
                            value={fontLi}
                            options={fontOptions}
                            onChange={(newFontLi) => setAttributes({ fontLi: newFontLi })}
                        />
                        <SelectControl
                            label="タイトルのフォントの太さ"
                            value={fontWeightLi}
                            options={fontWeightOptions}
                            onChange={(newFontWeightLi) => setAttributes({ fontWeightLi: newFontWeightLi })}
                        />
                        <p>説明部分の文字色</p>
                        <ColorPalette
                            label="説明部分の文字色"
                            value={fontColorLiP}
                            onChange={(newFontColorLiP) => setAttributes({ fontColorLiP: newFontColorLiP })}
                        />
                        <SelectControl
                            label="説明部分のフォントの種類"
                            value={fontLiP}
                            options={fontOptions}
                            onChange={(newFontLiP) => setAttributes({ fontLiP: newFontLiP })}
                        />
                        <SelectControl
                            label="説明部分のフォントの太さ"
                            value={fontWeightLiP}
                            options={fontWeightOptions}
                            onChange={(newFontWeightLiP) => setAttributes({ fontWeightLiP: newFontWeightLiP })}
                        />
                        <p>STEPの文字色</p>
                        <ColorPalette
                            label="STEPの文字色"
                            value={stepFontColor}
                            onChange={(newStepFontColor) => setAttributes({ stepFontColor: newStepFontColor })}
                        />
                        <SelectControl
                            label="STEPのフォントの種類"
                            value={stepFont}
                            options={fontOptions}
                            onChange={(newStepFont) => setAttributes({ stepFont: newStepFont })}
                        />
                        <SelectControl
                            label="STEPのフォントの太さ"
                            value={stepFontWeight}
                            options={fontWeightOptions}
                            onChange={(newStepFontWeight) => setAttributes({ stepFontWeight: newStepFontWeight })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="shin-gas-station-01-step-1">
                    <ul className="shin-gas-station-01-step-1__inner">
                        {contents.map((content, index) => (
                            <li className="shin-gas-station-01-step-1__li" key={index} style={{borderColor:borderColor,backgroundColor:backgroundColor,borderWidth:borderSize}}>
                                <span
                                    className="no"
                                    data-lw_font_set={stepFont}
                                    style={{background:borderColor,color:stepFontColor,fontWeight:stepFontWeight}}
                                >
                                    Step.{String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="shin-gas-station-01-step-1__text">
                                    <RichText
                                        tagName="h4"
                                        className='ttl'
                                        value={content.ttl}
                                        data-lw_font_set={fontLi}
                                        onChange={(value) => updateContent(index, 'ttl', value)} // ← ttl を更新
                                        placeholder="タイトルを入力"
                                        style={{ fontWeight: fontWeightLi, color: fontColorLi }}
                                    />

                                    <RichText
                                        tagName="p"
                                        value={content.text}
                                        data-lw_font_set={fontLiP}
                                        onChange={(value) => updateContent(index, 'text', value)}
                                        placeholder="テキストを入力"
                                        style={{ fontWeight: fontWeightLiP, color: fontColorLiP }}
                                        
                                    />
                                </span>
                                <button className="shin-gas-station-01-step-1__remove_btn" onClick={() => removeContent(index)}>削除</button>
                            </li>
                        ))}
                    </ul>
                    <button className="shin-gas-station-01-step-1__add_btn" onClick={addContent}>リストを追加する</button>
                </div>
            </Fragment>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { fontLi,
                fontColorLi,backgroundColor,borderSize,
                fontLiP, fontColorLiP, fontWeightLiP,
                stepFont, stepFontColor, stepFontWeight,
            fontWeightLi, contents,borderColor } = attributes;

        return (
            <div className="shin-gas-station-01-step-1">
                <ul className="shin-gas-station-01-step-1__inner">
                    {contents.map((content, index) => (
                        <li className="shin-gas-station-01-step-1__li" key={index}  style={{borderColor:borderColor,backgroundColor:backgroundColor,borderWidth:borderSize}}>
                            <span
                                className="no"
                                data-lw_font_set={stepFont}
                                style={{background:borderColor,color:stepFontColor,fontWeight:stepFontWeight}}
                            >
                                Step.{String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="shin-gas-station-01-step-1__text">
                                <RichText.Content
                                    tagName="h4"
                                    className='ttl'
                                    value={content.ttl}
                                    data-lw_font_set={fontLi}
                                    style={{ fontWeight: fontWeightLi, color: fontColorLi }}
                                />
                                <RichText.Content
                                    tagName="p"
                                    value={content.text}
                                    data-lw_font_set={fontLiP}
                                    style={{ fontWeight: fontWeightLiP, color: fontColorLiP }}
                                />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
});
