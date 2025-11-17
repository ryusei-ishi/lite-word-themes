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

registerBlockType('wdl/lw-list-3', {
    title: 'list 03',
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
        fontWeightLi: {
            type: 'string',
            default: ''
        },
        colorLiSvg: {
            type: 'string',
            default: 'var(--color-main)'
        },
        borderColor: {
            type: 'string',
             default: 'var(--color-main)'
        },
        contents: {
            type: 'array',
            source: 'query',
            selector: '.lw-list-3__li',
            query: {
                text: {
                    type: 'string',
                    source: 'html',
                    selector: '.lw-list-3__text p',
                },
            },
            default: [
                { text: 'リストテキストリストテキスト ' },
                { text: 'リストテキストリストテキスト ' },
                { text: 'リストテキストリストテキスト ' },
                { text: 'リストテキストリストテキスト ' },
            ],
        },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { fontLi, fontWeightLi, contents, colorLiSvg ,borderColor} = attributes;

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
                        <p>アイコンの色</p>
                        <ColorPalette
                            label="チェックアイコンの色"
                            value={colorLiSvg}
                            onChange={(color) => setAttributes({ colorLiSvg: color })}
                        />
                        <p>枠の色</p>
                        <ColorPalette
                            label="枠の色"
                            value={borderColor}
                            onChange={(newBorderColor) => setAttributes({ borderColor: newBorderColor })}
                        />

                        <SelectControl
                            label="フォントの種類"
                            value={fontLi}
                            options={fontOptions}
                            onChange={(newFontLi) => setAttributes({ fontLi: newFontLi })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={fontWeightLi}
                            options={fontWeightOptions}
                            onChange={(newFontWeightLi) => setAttributes({ fontWeightLi: newFontWeightLi })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="lw-list-3">
                    <ul className="lw-list-3__inner">
                        {contents.map((content, index) => (
                            <li className="lw-list-3__li" key={index} style={{borderColor:borderColor}}>
                                <span className="icon" style={{ fill: colorLiSvg }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                    </svg>
                                </span>
                                <span className="lw-list-3__text">
                                    <RichText
                                        tagName="p"
                                        value={content.text}
                                        data-lw_font_set={fontLi}
                                        onChange={(value) => updateContent(index, 'text', value)}
                                        placeholder="テキストを入力"
                                        style={{ fontWeight: fontWeightLi }}
                                    />
                                </span>
                                <button className="lw-list-3__remove_btn" onClick={() => removeContent(index)}>削除</button>
                            </li>
                        ))}
                    </ul>
                    <button className="lw-list-3__add_btn" onClick={addContent}>リストを追加する</button>
                </div>
            </Fragment>
        );
    },
    save( { attributes } ) {
        const {
            fontLi, fontWeightLi,
            contents,
            colorLiSvg, borderColor,
        } = attributes;

        return (
            <div className="lw-list-3">
                <ul className="lw-list-3__inner">
                    { contents.map( ( content, index ) => (
                        <li
                            className="lw-list-3__li"
                            key={ index }
                            style={{ borderColor }}
                        >
                            <span className="icon" style={{ fill: colorLiSvg }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                </svg>
                            </span>

                            <span className="lw-list-3__text">
                                <RichText.Content
                                    tagName="p"
                                    value={ content.text }               // ← HTML をそのまま出力
                                    data-lw_font_set={ fontLi }
                                    style={{ fontWeight: fontWeightLi }}
                                />
                            </span>
                        </li>
                    ) ) }
                </ul>
            </div>
        );
    },
});
