import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, ColorPalette, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
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

        const blockProps = useBlockProps({
            className: 'shin-gas-station-01-company-01'
        });

        return (
            <>
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

                <div {...blockProps}>
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
            </>
        );
    },

    save: function (props) {
        const { attributes } = props;
        const { colorOuter , colorDt , fontDt, fontWeightDt, colorDd ,fontDd, fontWeightDd, contents } = attributes;

        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-company-01'
        });

        return (
            <div {...blockProps}>
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
