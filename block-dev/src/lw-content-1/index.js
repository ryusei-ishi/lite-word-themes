import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    ColorPalette,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    SelectControl,
    TextControl,
    ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import {fontOptionsArr,fontWeightOptionsArr} from '../utils.js';
import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();


registerBlockType('wdl/lw-content-1', {
    title: 'Content 1',
    icon: 'format-image',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        imageUrl: {
            type: 'string',
            default: 'https://picsum.photos/1000/1000?random=1',
        },
        imageAlt: {
            type: 'string',
            default: '',
        },
        title: {
            type: 'string',
            source: 'html',
            selector: '.lw-content-1__text h3',
            default: 'タイトルテキスト',
        },
        content: {
            type: 'string',
            source: 'html',
            selector: '.lw-content-1__text p',
            default: 'テキストテキストテキストテキスト\nテキストテキストテキストテキストテキストテキスト',
        },
        linkUrl: {
            type: 'string',
            default: '',
        },
        linkText: {
            type: 'string',
            default: '詳細はこちら',
        },
        linkTarget: {
            type: 'string',
            default: '',
        },
        titleFontSet: {
            type: 'string',
            default: '',
        },
        titleFontWeight: {
            type: 'string',
            default: '', // デフォルトの太さを設定
        },
        contentFontSet: {
            type: 'string',
            default: '',
        },
        contentFontWeight: {
            type: 'string',
            default: '',
        },
        linkFontSet: {
            type: 'string',
            default: '',
        },
        linkFontWeight: {
            type: 'string',
            default: '',
        },
        imagePosition: {
            type: 'string',
            default: 'left',
        },
        linkButtonBackgroundColor: {
            type: 'string',
            default: 'var(--color-accent)',
        },
        linkButtonTextColor: {
            type: 'string',
            default: '#fff',
        },
    },

    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            imageUrl,
            imageAlt,
            title,
            content,
            linkUrl,
            linkText,
            linkTarget,
            titleFontSet,
            titleFontWeight,
            contentFontSet,
            contentFontWeight,
            linkFontSet,
            linkFontWeight,
            imagePosition,
            linkButtonBackgroundColor,
            linkButtonTextColor,
        } = attributes;

        const onSelectImage = (media) => {
            setAttributes({
                imageUrl: media.url,
                imageAlt: media.alt,
            });
        };

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="画像設定">
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageUrl}
                            render={({ open }) => (
                                <div style={{ marginBottom: '16px' }}>
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt={imageAlt}
                                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                                        />
                                    )}
                                    <Button onClick={open} isSecondary>
                                        {imageUrl ? '画像を変更' : '画像を選択'}
                                    </Button>
                                </div>
                            )}
                        />
                        <ToggleControl
                            label="画像を右側に表示"
                            checked={imagePosition === 'right'}
                            onChange={(value) =>
                                setAttributes({ imagePosition: value ? 'right' : 'left' })
                            }
                        />
                        {imageUrl && (
                            <div style={{ marginTop: '16px' }}>
                                <TextControl
                                    label="代替テキスト"
                                    value={imageAlt}
                                    onChange={(value) => setAttributes({ imageAlt: value })}
                                />
                            </div>
                        )}
                    </PanelBody>

                    <PanelBody title="リンク設定">
                        <ToggleControl
                            label="新規タブで開く"
                            checked={linkTarget === '_blank'}
                            onChange={(value) => setAttributes({ linkTarget: value ? '_blank' : '' })}
                        />
                    </PanelBody>

                    <PanelBody title="フォント設定">
                        <SelectControl
                            label="タイトルのフォント"
                            value={titleFontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ titleFontSet: value })}
                        />
                        <SelectControl
                            label="タイトルの太さ"
                            value={titleFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ titleFontWeight: value })}
                        />
                        <SelectControl
                            label="テキストのフォント"
                            value={contentFontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ contentFontSet: value })}
                        />
                        <SelectControl
                            label="テキストの太さ"
                            value={contentFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ contentFontWeight: value })}
                        />
                        <SelectControl
                            label="リンクのフォント"
                            value={linkFontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ linkFontSet: value })}
                        />
                        <SelectControl
                            label="リンクの太さ"
                            value={linkFontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ linkFontWeight: value })}
                        />
                    </PanelBody>

                    <PanelBody title="リンクボタンの色設定">
                        <p>背景色</p>
                        <ColorPalette
                            value={linkButtonBackgroundColor}
                            onChange={(color) => setAttributes({ linkButtonBackgroundColor: color })}
                        />
                        <p>テキストの色</p>
                        <ColorPalette
                            value={linkButtonTextColor}
                            onChange={(color) => setAttributes({ linkButtonTextColor: color })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className={`lw-content-1 ${imagePosition === 'right' ? 'right' : 'left'}`}>
                    <div className="lw-content-1__inner">
                        <div className="lw-content-1__image">
                            <img src={imageUrl} alt={imageAlt} />
                        </div>
                        <div className="lw-content-1__text">
                            <RichText
                                tagName="h3"
                                value={title}
                                onChange={(value) => setAttributes({ title: value })}
                                placeholder="タイトルを入力"
                                style={{ fontWeight: titleFontWeight }}
                                data-lw_font_set={titleFontSet}
                            />
                            <RichText
                                tagName="p"
                                value={content}
                                onChange={(value) => setAttributes({ content: value })}
                                placeholder="テキストを入力"
                                style={{ fontWeight: contentFontWeight, whiteSpace: 'pre-wrap' }}
                                data-lw_font_set={contentFontSet}
                            />
                            <div className="lw-content-1__text_br_button">
                                <TextControl
                                    label="リンクテキスト"
                                    value={linkText}
                                    onChange={(value) => setAttributes({ linkText: value })}
                                />
                                <TextControl
                                    label="リンクURL"
                                    value={linkUrl}
                                    onChange={(value) => setAttributes({ linkUrl: value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    },
    save: (props) => {
        const { attributes } = props;
        const {
            imageUrl,
            imageAlt,
            title,
            content,
            linkUrl,
            linkText,
            linkTarget,
            titleFontSet,
            titleFontWeight,
            contentFontSet,
            contentFontWeight,
            linkFontSet,
            linkFontWeight,
            imagePosition,
            linkButtonBackgroundColor,
            linkButtonTextColor,
        } = attributes;

        return (
            <div className={`lw-content-1 ${imagePosition === 'right' ? 'right' : 'left'}`}>
                <div className="lw-content-1__inner">
                    <div className="lw-content-1__image">
                        <img loading="lazy" src={imageUrl} alt={imageAlt} />
                    </div>
                    <div className="lw-content-1__text">
                        <RichText.Content
                            tagName="h3"
                            className="lw_title"
                            value={title}
                            style={{ fontWeight: titleFontWeight }}
                            data-lw_font_set={titleFontSet}
                        />
                        <RichText.Content
                            tagName="p"
                            className="lw_p"
                            value={content}
                            style={{ fontWeight: contentFontWeight, whiteSpace: 'pre-wrap' }}
                            data-lw_font_set={contentFontSet}
                        />
                        <a
                            href={linkUrl}
                            className="lw-content-1__text_br_button"
                            style={{
                                fontWeight: linkFontWeight,
                                backgroundColor: linkButtonBackgroundColor,
                                color: linkButtonTextColor,
                            }}
                            data-lw_font_set={linkFontSet}
                            {...(linkTarget && { target: linkTarget, rel: 'noopener noreferrer' })}
                        >
                            {linkText}
                        </a>
                    </div>
                </div>
            </div>
        );
    },
});
