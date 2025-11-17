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

registerBlockType('wdl/shin-gas-station-01-list-3', {
    title: 'インフォリスト 3 shin shop pattern 01',
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
            default: 'var(--color-main)'
        },
        fontWeightLi: {
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
            selector: '.shin-gas-station-01-list-3__li',
            query: {
                text: {
                    type: 'string',
                    source: 'html',
                    selector: '.shin-gas-station-01-list-3__text p',
                },
            },
            default: [
                { text: 'リストテキストリストテキスト ' },
                { text: 'リストテキストリストテキスト ' },
                { text: 'リストテキストリストテキスト ' },
            ],
        },
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { fontLi, fontColorLi, fontWeightLi, contents ,backgroundColor ,borderColor,borderSize} = attributes;

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
                        <p>文字色</p>
                        <ColorPalette
                            label="リストの文字色"
                            value={fontColorLi}
                            onChange={(newFontColorLi) => setAttributes({ fontColorLi: newFontColorLi })}
                        />
                        <p>枠の色</p>
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

                <div className="shin-gas-station-01-list-3">
                    <ul className="shin-gas-station-01-list-3__inner">
                        {contents.map((content, index) => (
                            <li className="shin-gas-station-01-list-3__li" key={index} style={{borderColor:borderColor,backgroundColor:backgroundColor,borderWidth:borderSize}}>
                                <span className="shin-gas-station-01-list-3__text">
                                    <RichText
                                        tagName="p"
                                        value={content.text}
                                        data-lw_font_set={fontLi}
                                        onChange={(value) => updateContent(index, 'text', value)}
                                        placeholder="テキストを入力"
                                        style={{ fontWeight: fontWeightLi, color: fontColorLi }}
                                    />
                                </span>
                                <button className="shin-gas-station-01-list-3__remove_btn" onClick={() => removeContent(index)}>削除</button>
                            </li>
                        ))}
                    </ul>
                    <button className="shin-gas-station-01-list-3__add_btn" onClick={addContent}>リストを追加する</button>
                </div>
            </Fragment>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { fontLi,
                fontColorLi,backgroundColor,borderSize,
            fontWeightLi, contents,borderColor } = attributes;

        return (
            <div className="shin-gas-station-01-list-3">
                <ul className="shin-gas-station-01-list-3__inner">
                    {contents.map((content, index) => (
                        <li className="shin-gas-station-01-list-3__li" key={index}  style={{borderColor:borderColor,backgroundColor:backgroundColor,borderWidth:borderSize}}>
                            <span className="shin-gas-station-01-list-3__text">
                                <p
                                    data-lw_font_set={fontLi}
                                    style={{ fontWeight: fontWeightLi, color: fontColorLi }}
                                >
                                    {content.text}
                                </p>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
});
