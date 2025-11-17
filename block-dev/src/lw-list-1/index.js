import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPalette, Button, TextControl } from '@wordpress/components';
import {fontOptionsArr,fontWeightOptionsArr} from '../utils.js';
import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/lw-list-1', {
    title: 'List 01',
    icon: 'editor-ul',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        contents: {
            type: 'array',
            source: 'query',
            selector: '.lw-list-1_content',
            query: {
                text: {
                    type: 'string',
                    source: 'html',
                    selector: '.lw-list-1_text p',
                },
                number: {
                    type: 'string',
                    source: 'text',
                    selector: '.no',
                },
            },
            default: [
                { text: '初心者向けの動画マニュアルで、誰でも簡単、スムーズに制作！', number: '1' },
                { text: 'ページテンプレートが用意されているので、ワンクリックで固定ページがほぼ完成！', number: '2' },
                { text: '業種別デザイナーテンプレートを使うことで、プロ級のサイトが出来る！', number: '3' }
            ],
        },
        noFontSet: {
            type: 'string',
            default: '',
        },
        noFontWeight: {
            type: 'string',
            default: '',
        },
        textFontSet: {
            type: 'string',
            default: '',
        },
        textFontWeight: {
            type: 'string',
            default: '',
        },
        borderColor: {
            type: 'string',
            default: 'var(--color-main)',
        }
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { contents, noFontSet, noFontWeight, textFontSet, textFontWeight, borderColor } = attributes;

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

        return (
            <div className="lw-list-1">
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
                            <Button isDestructive onClick={() => removeContent(index)} style={{ marginTop: '10px' }}>
                                このコンテンツを削除
                            </Button>
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
                        </div>
                    ))}
                </div>
            </div>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { contents, noFontSet, noFontWeight, textFontSet, textFontWeight, borderColor } = attributes;
    
        return (
            <div className="lw-list-1">
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
