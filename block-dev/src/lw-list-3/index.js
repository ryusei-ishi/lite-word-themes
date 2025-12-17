import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, ColorPalette , useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, Button } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr, ButtonBackgroundOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
// 背景色オプションを変数に定義
const bgOptions = ButtonBackgroundOptionsArr();

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { fontLi, fontWeightLi, contents, colorLiSvg ,borderColor} = attributes;

        const blockProps = useBlockProps({
            className: 'lw-list-3'
        });

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

        // 順番入れ替え関数
        const moveItem = (index, direction) => {
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= contents.length) return;

            const reordered = [...contents];
            const [moved] = reordered.splice(index, 1);
            reordered.splice(targetIndex, 0, moved);

            setAttributes({ contents: reordered });
        };

        return (
            <>
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

                <div {...blockProps}>
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
                                {/* 並べ替え & 削除コントロール */}
                                <div className="lw-list-3__item-controls lw-table-item-controls">
                                    <button
                                        type="button"
                                        onClick={() => moveItem(index, -1)}
                                        disabled={index === 0}
                                        className="move-up-button"
                                        aria-label="上へ移動"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(index, 1)}
                                        disabled={index === contents.length - 1}
                                        className="move-down-button"
                                        aria-label="下へ移動"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        className="remove-item-button"
                                        onClick={() => removeContent(index)}
                                        aria-label="削除"
                                    >
                                        削除
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className="lw-list-3__add_btn" onClick={addContent}>リストを追加する</button>
                </div>
            </>
        );
    },
    save( { attributes } ) {
        const {
            fontLi, fontWeightLi,
            contents,
            colorLiSvg, borderColor,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-list-3'
        });

        return (
            <div {...blockProps}>
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
