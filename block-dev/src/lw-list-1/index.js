import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPalette, Button, TextControl } from '@wordpress/components';
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
        const { contents, noFontSet, noFontWeight, textFontSet, textFontWeight, borderColor } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-list-1'
        });

        // コンテンツを追加
        const addContent = () => {
            const newContent = { text: '新しいテキスト', number: `${contents.length + 1}` };
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
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="番号部分のフォント設定">
                        <SelectControl
                            label="フォントの種類"
                            value={noFontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ noFontSet: value })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={noFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ noFontWeight: value })}
                        />
                    </PanelBody>
                    <PanelBody title="テキスト部分のフォント設定">
                        <SelectControl
                            label="フォントの種類"
                            value={textFontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ textFontSet: value })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={textFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ textFontWeight: value })}
                        />
                    </PanelBody>
                    <PanelBody title="全体の色設定">
                        <p>ボーダーの色</p>
                        <ColorPalette
                            value={borderColor}
                            onChange={(color) => setAttributes({ borderColor: color })}
                        />
                    </PanelBody>
                    {contents.map((content, index) => (
                        <PanelBody title={`コンテンツ ${index + 1}`} key={index} initialOpen={false}>
                            <TextControl
                                label="番号"
                                value={content.number}
                                onChange={(value) => updateContent(index, 'number', value)}
                            />
                            <RichText
                                tagName="p"
                                value={content.text}
                                onChange={(value) => updateContent(index, 'text', value)}
                                placeholder="テキストを入力"
                            />
                            <div className="lw-list-1__panel-controls">
                                <Button
                                    isSecondary
                                    onClick={() => moveItem(index, -1)}
                                    disabled={index === 0}
                                >
                                    ↑ 上へ
                                </Button>
                                <Button
                                    isSecondary
                                    onClick={() => moveItem(index, 1)}
                                    disabled={index === contents.length - 1}
                                >
                                    ↓ 下へ
                                </Button>
                                <Button isDestructive onClick={() => removeContent(index)}>
                                    削除
                                </Button>
                            </div>
                        </PanelBody>
                    ))}
                    <Button isPrimary onClick={addContent} style={{ margin: '20px 0' }}>
                        コンテンツを追加
                    </Button>
                </InspectorControls>

                <div className="lw-list-1_inner">
                    {contents.map((content, index) => (
                        <div className="lw-list-1_content" key={index} style={{ borderColor: borderColor }}>
                            <div
                                className="no"
                                data-lw_font_set={noFontSet}
                                style={{
                                    fontWeight: noFontWeight,
                                    background: borderColor
                                }}
                            >
                                {content.number}
                            </div>
                            <div className="lw-list-1_text" data-lw_font_set={textFontSet} style={{ fontWeight: textFontWeight }}>
                                <RichText
                                    tagName="p"
                                    value={content.text}
                                    onChange={(value) => updateContent(index, 'text', value)}
                                    placeholder="テキストを入力"
                                />
                            </div>
                            {/* 並べ替え & 削除コントロール */}
                            <div className="lw-list-1__item-controls lw-table-item-controls">
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
                        </div>
                    ))}
                </div>
            </div>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { contents, noFontSet, noFontWeight, textFontSet, textFontWeight, borderColor } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-list-1'
        });

        return (
            <div {...blockProps}>
                <ul className="lw-list-1_inner">
                    {contents.map((content, index) => (
                        <li className="lw-list-1_content" key={index} style={{ borderColor: borderColor }}>
                            <div
                                className="no"
                                data-lw_font_set={noFontSet}
                                style={{
                                    fontWeight: noFontWeight,
                                    background: borderColor
                                }}
                            >
                                {content.number}
                            </div>
                            <div className="lw-list-1_text" data-lw_font_set={textFontSet} style={{ fontWeight: textFontWeight }}>
                                <RichText.Content
                                    tagName="p"
                                    value={content.text}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

});
