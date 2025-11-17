import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/shin-gas-station-01-company-01', {
    title: '会社概要 1 shin shop pattern 01',
    icon: 'building',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        colorOuter: {
            type: 'string',
            default: 'var(--color-main)'
        },
        colorDt: {
            type: 'string',
            default: '#7C7C7C'
        },
        fontDt: {
            type: 'string',
            default: ''
        },
        fontWeightDt: {
            type: 'string',
            default: '600'
        },
        colorDd: {
            type: 'string',
            default: '#111'
        },
        fontDd: {
            type: 'string',
            default: ''
        },
        fontWeightDd: {
            type: 'string',
            default: ''
        },
        contents: {
            type: 'array',
            source: 'query',
            selector: '.shin-gas-station-01-company-01__dl',
            query: {
                title: {
                    type: 'string',
                    source: 'html',
                    selector: 'dt',
                },
                text: {
                    type: 'string',
                    source: 'html',
                    selector: 'dd',
                },
            },
            default: [
                { title: '社名', text: '株式会社サンプル' },
                { title: '設立', text: '2000年4月1日' },
                { title: '所在地', text: '東京都新宿区西新宿1-1-1' },
                { title: '代表者', text: '代表取締役社長 山田太郎' },
                { title: '資本金', text: '1億円' },
                { title: '従業員数', text: '100名' },
                { title: '事業内容', text: 'ウェブサイト制作、システム開発、マーケティング支援' },
                { title: '取引銀行', text: 'みずほ銀行 新宿支店' },
                { title: '主要取引先', text: '株式会社○○、株式会社△△、株式会社□□' },
                { title: '連絡先', text: 'TEL: 03-1234-5678 / FAX: 03-1234-5679' },
                { title: 'URL', text: 'https://www.sample.co.jp' }
            ]
        },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const {
            colorOuter,
            colorDt,
            fontDt, fontWeightDt,
            colorDd,
            fontDd, fontWeightDd, contents,
        } = attributes;

        // コンテンツを追加
        const addContent = () => {
            const newContent = { title: '新しいタイトル', text: '新しいテキスト' };
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
                    <PanelBody title="外枠の色">
                        <ColorPalette
                            value={colorOuter}
                            onChange={(newColorOuter) => setAttributes({ colorOuter: newColorOuter })}
                        />
                    </PanelBody>
                    <PanelBody title="タイトルの部分の設定">
                        <p>文字の色</p>
                        <ColorPalette
                            value={colorDt}
                            onChange={(newColorDt) => setAttributes({ colorDt: newColorDt })}
                        />
                        <SelectControl
                            label="フォントの種類"
                            value={fontDt}
                            options={fontOptions}
                            onChange={(newFontDt) => setAttributes({ fontDt: newFontDt })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={fontWeightDt}
                            options={fontWeightOptions}
                            onChange={(newFontWeightDt) => setAttributes({ fontWeightDt: newFontWeightDt })}
                        />
                    </PanelBody>
                    <PanelBody title="テキストの部分の設定">
                        <p>文字の色</p>
                        <ColorPalette
                            value={colorDd}
                            onChange={(newColorDd) => setAttributes({ colorDd: newColorDd })}
                        />
                        <SelectControl
                            label="フォントの種類"
                            value={fontDd}
                            options={fontOptions}
                            onChange={(newFontDd) => setAttributes({ fontDd: newFontDd })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={fontWeightDd}
                            options={fontWeightOptions}
                            onChange={(newFontWeightDd) => setAttributes({ fontWeightDd: newFontWeightDd })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="shin-gas-station-01-company-01">
                    <div className="shin-gas-station-01-company-01__inner" style={{ borderColor: colorOuter }}>
                        {contents.map((content, index) => (
                            <dl className="shin-gas-station-01-company-01__dl" key={index}>
                                <RichText
                                    tagName="dt"
                                    value={content.title}
                                    onChange={(value) => updateContent(index, 'title', value)}
                                    placeholder="タイトルを入力"
                                    style={{ fontWeight: fontWeightDt , color: colorDt }}
                                    data-lw_font_set={fontDt}
                                />
                                <RichText
                                    tagName="dd"
                                    value={content.text}
                                    onChange={(value) => updateContent(index, 'text', value)}
                                    placeholder="テキストを入力"
                                    style={{ fontWeight: fontWeightDd, color: colorDd }}
                                    data-lw_font_set={fontDd}
                                />
                                <button className="shin-gas-station-01-company-01__remove_btn" onClick={() => removeContent(index)}>削除</button>
                            </dl>
                        ))}
                    </div>
                    <button className="shin-gas-station-01-company-01__add_btn" onClick={addContent}>リストを追加する</button>
                </div>
            </Fragment>
        );
    },

    save: function (props) {
        const { attributes } = props;
        const { colorOuter , colorDt , fontDt, fontWeightDt, colorDd ,fontDd, fontWeightDd, contents } = attributes;

        return (
            <div className="shin-gas-station-01-company-01">
                <div className="shin-gas-station-01-company-01__inner" style={{ borderColor: colorOuter }}>
                    {contents.map((content, index) => (
                        <dl className="shin-gas-station-01-company-01__dl" key={index}>
                            <RichText.Content
                                tagName="dt"
                                value={content.title}
                                style={{ fontWeight: fontWeightDt , color: colorDt }}
                                data-lw_font_set={fontDt}
                            />
                            <RichText.Content
                                tagName="dd"
                                value={content.text}
                                style={{ fontWeight: fontWeightDd , color: colorDd }}
                                data-lw_font_set={fontDd}
                            />
                        </dl>
                    ))}
                </div>
            </div>
        );
    }

});
