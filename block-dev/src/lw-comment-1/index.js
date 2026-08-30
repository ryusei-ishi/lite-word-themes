import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, RadioControl, SelectControl, ColorPalette, RangeControl, TextControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* save は deprecated からも使うので先に名前を付ける（写し間違いを防ぐため本文はひとつだけ持つ） */
const saveComment1 = function(props) {
    const {
        attributes: {
            name, title, imageUrl, imageColor, altText, commentAlignment,
            nameFontSet, nameFontWeight, nameTextColor,
            titleFontSet, titleFontWeight, titleTextColor, commentBgColor,
            maxWidth
        }
    } = props;

    const alignmentClass = commentAlignment === 'right' ? 'right' : 'left';

    const blockProps = useBlockProps.save({
        className: `lw-comment-1 ${alignmentClass}`
    });

    return (
        <div {...blockProps}>
            <div className="lw-comment-1__wrap" style={{ maxWidth: `${maxWidth}px` }}>
                <div className="lw-comment-1__image">
                    {imageUrl ? (
                            <img src={imageUrl} alt={altText} style={{ borderColor: imageColor }} />
                        ) : (
                            <div className="no_image" style={{ borderColor: imageColor,color:imageColor }}>No Image</div>
                        )}
                    <div className="lw-comment-1__name">
                        <RichText.Content
                            tagName="p"
                            className='lw-p'
                            value={name}
                            style={{ fontFamily: nameFontSet, fontWeight: nameFontWeight, color: nameTextColor }}
                        />
                    </div>
                </div>
                <div className="lw-comment-1__text_wrap">
                    <div className="lw-comment-1__text">
                        <RichText.Content
                            tagName="p"
                            value={title}
                            className='lw-p'
                            style={{ fontFamily: titleFontSet, fontWeight: titleFontWeight, color: titleTextColor }}
                        />
                        <div className="lw-arrow" style={{ backgroundColor: commentBgColor }}></div>
                        <div className="lw-bg_color" style={{ backgroundColor: commentBgColor }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: function(props) {
        const {
            attributes: {
                name, title, imageUrl, imageColor, altText, commentAlignment,
                nameFontSet, nameFontWeight, nameTextColor,
                titleFontSet, titleFontWeight, titleTextColor, commentBgColor,
                maxWidth
            },
            setAttributes
        } = props;

        const alignmentClass = commentAlignment === 'right' ? 'right' : 'left';

        const blockProps = useBlockProps({
            className: `lw-comment-1 ${alignmentClass}`
        });

        const onImageSelect = (media) => {
            setAttributes({
                imageUrl: media.url,
                altText: media.alt || '',
            });
        };

        const onChangeCommentAlignment = (newAlignment) => {
            setAttributes({ commentAlignment: newAlignment });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title="画像設定">
                        <MediaUpload
                            onSelect={onImageSelect}
                            allowedTypes={['image']}
                            value={imageUrl}
                            render={({ open }) => (
                                <div>
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={altText} style={{ width: '100%', height: 'auto' }} />
                                    ) : (
                                        <p>画像を選択してください</p>
                                    )}
                                    <Button onClick={open} isSecondary style={{ marginTop: '10px' }}>
                                        画像を{imageUrl ? '変更' : '選択'}
                                    </Button>
                                </div>
                            )}
                        />
                        <TextControl
                            label="画像の説明（alt）"
                            help="目の見えない方や検索エンジンに、この画像が何かを伝える文です。例：笑顔でこちらを見る女性のイラスト"
                            value={altText || ''}
                            onChange={(v) => setAttributes({ altText: v })}
                            style={{ marginTop: '10px' }}
                        />
                        <ColorPalette
                            label="画像の枠線色"
                            style={{ marginTop: '10px' }}
                            value={imageColor}
                            onChange={(color) => setAttributes({ imageColor: color })}
                        />
                    </PanelBody>
                    <PanelBody title="位置">
                        <RadioControl
                            selected={commentAlignment}
                            options={[
                                { label: '右', value: 'right' },
                                { label: '左', value: 'left' },
                            ]}
                            onChange={onChangeCommentAlignment}
                        />
                    </PanelBody>
                    <PanelBody title="コメント部分の設定">
                        <ColorPalette
                            label="背景色"
                            value={commentBgColor}
                            onChange={(color) => setAttributes({ commentBgColor: color })}
                        />
                        <ColorPalette
                            label="テキストの色"
                            value={titleTextColor}
                            onChange={(color) => setAttributes({ titleTextColor: color })}
                        />
                        <SelectControl
                            label="フォント種類"
                            value={titleFontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ titleFontSet: value })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={titleFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ titleFontWeight: value })}
                        />
                    </PanelBody>
                    <PanelBody title="イメージ画像部分のテキスト設定">
                        <SelectControl
                            label="フォント種類"
                            value={nameFontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ nameFontSet: value })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={nameFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ nameFontWeight: value })}
                        />
                        <ColorPalette
                            label="テキストの色"
                            value={nameTextColor}
                            onChange={(color) => setAttributes({ nameTextColor: color })}
                        />
                    </PanelBody>
                    <PanelBody title="最大幅設定">
                        <RangeControl
                            label="最大幅(px)"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={200}
                            max={1200}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <div className="lw-comment-1__wrap" style={{ maxWidth: `${maxWidth}px` }}>
                        <div className="lw-comment-1__image">
                            {imageUrl ? (
                                <img src={imageUrl} alt={altText} style={{ borderColor: imageColor }} />
                            ) : (
                                <div className="no_image" style={{ borderColor: imageColor,color:imageColor }}>No Image</div>
                            )}
                            <div className="lw-comment-1__name">
                                <RichText
                                    tagName="p"
                                    className='lw-p'
                                    value={name}
                                    onChange={(name) => setAttributes({ name })}
                                    placeholder="名前"
                                    style={{ fontFamily: nameFontSet, fontWeight: nameFontWeight, color: nameTextColor }}
                                />
                            </div>
                        </div>
                        <div className="lw-comment-1__text_wrap">
                            <div className="lw-comment-1__text">
                                <RichText
                                    tagName="p"
                                    className='lw-p'
                                    value={title}
                                    onChange={(title) => setAttributes({ title })}
                                    placeholder="コメント"
                                    style={{ fontFamily: titleFontSet, fontWeight: titleFontWeight, color: titleTextColor }}
                                />
                                <div className="lw-arrow" style={{ backgroundColor: commentBgColor }}></div>
                                <div className="lw-bg_color" style={{ backgroundColor: commentBgColor }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    },
    save: saveComment1,
    /* 2026-08-23: altText の既定を「画像」から空に変えた。
     * それより前に作られたページは altText を書かずに保存しているので、
     * 新しい既定（空）で読むと alt="" になって出力が変わり「無効なコンテンツ」になる。
     * ここで旧既定を持たせて読めるようにする。出力するHTMLは同じなので save は使い回す。
     * ⚠️ この deprecated を消すと、449サイトの既存ページが編集画面で壊れる。 */
    deprecated: [
        {
            attributes: { ...metadata.attributes, altText: { type: 'string', default: '画像' } },
            save: saveComment1,
        },
    ],
});
