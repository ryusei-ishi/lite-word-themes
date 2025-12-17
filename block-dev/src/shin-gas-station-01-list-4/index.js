import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, ColorPalette , useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, Button ,TextControl} from '@wordpress/components';
import { Fragment, createElement } from '@wordpress/element';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
// 背景色オプションを変数に定義

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;

        const blockProps = useBlockProps({
            className: 'shin-gas-station-01-list-4'
        });
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
            <>
                <InspectorControls>
     
                    <PanelBody>
                        <p>背景色</p>
                        <ColorPalette
                            label="背景色"
                            value={backgroundColor}
                            onChange={(newBackgroundColor) => setAttributes({ backgroundColor: newBackgroundColor })}
                        />
                        <p>枠色の色</p>
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

                <div {...blockProps}>
                    <ul className="shin-gas-station-01-list-4__inner">
                        {contents.map((content, index) => (
                            <li className="shin-gas-station-01-list-4__li" key={index} style={{borderColor:borderColor,backgroundColor:backgroundColor,borderWidth:borderSize}}>
                                 
                                {content.image && <div className="image"><img src={content.image} alt="" /></div>}
                               
                                 {/* 画像選択ボタン */}
                                 <MediaUpload
                                    onSelect={(media) => updateContent(index, 'image', media.url)}
                                    allowedTypes={["image"]}
                                    render={({ open }) => (
                                        <Button onClick={open} isSecondary>
                                            {content.image ? '画像を変更' : '画像を選択'}
                                        </Button>
                                    )}
                                />
                                {content.image && (
                                    <Button
                                        onClick={() => updateContent(index, 'image', '')}
                                        isDestructive
                                        style={{ marginLeft: '8px' }}
                                    >
                                        画像を削除
                                    </Button>
                                )}
                                <br /><br />
                                <span className="shin-gas-station-01-list-4__text">
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
                                <br />
                                {/* リンク URL 入力用の TextControl を追加 */}
                                    <TextControl
                                        label="リンクURL"
                                        value={content.url}
                                        onChange={(value) => updateContent(index, 'url', value)}
                                        style={{ marginTop: '12px', maxWidth: '300px' }}
                                    />
                                <button className="shin-gas-station-01-list-4__remove_btn" onClick={() => removeContent(index)}>削除</button>
                            </li>
                        ))}
                    </ul>
                    <button className="shin-gas-station-01-list-4__add_btn" onClick={addContent}>リストを追加する</button>
                </div>
            </>
        );
    },
    save: function (props) {
        const { attributes } = props;

        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-list-4'
        });
        const {
            fontLi, fontColorLi, backgroundColor, borderSize,
            fontLiP, fontColorLiP, fontWeightLiP,
            stepFont, stepFontColor, stepFontWeight,
            fontWeightLi, contents, borderColor
        } = attributes;
    
        return (
            <div {...blockProps}>
                <ul className="shin-gas-station-01-list-4__inner">
                    {contents.map((content, index) => {
                        const TagName = content.url ? 'a' : 'div';
                        const linkProps = content.url ? { href: content.url, className: 'link' } : { className: 'link' };
    
                        return (
                            <li
                                className="shin-gas-station-01-list-4__li"
                                key={index}
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: backgroundColor,
                                    borderWidth: borderSize,
                                    borderStyle: borderSize > 0 ? 'solid' : 'none'
                                }}
                            >
                                {createElement(
                                    TagName,
                                    linkProps,
                                    <>
                                        {content.image && (
                                            <div className="image">
                                                <img src={content.image} alt="" />
                                            </div>
                                        )}
                                        <span className="shin-gas-station-01-list-4__text">
                                            <RichText.Content
                                                tagName="h4"
                                                className="ttl"
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
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
    
    
});
