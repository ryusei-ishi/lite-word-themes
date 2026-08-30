import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    SelectControl,
    TextControl,
    ToggleControl,
} from '@wordpress/components';
import {fontOptionsArr,fontWeightOptionsArr} from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

/* リンク先の指定（共通部品）で使う属性名の対応 */
const LINK_KEYS = { url: 'linkUrl', type: 'linkType', page: 'pageId', category: 'categoryId' };

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();


const lwBlockDef = {
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

        const blockProps = useBlockProps({
            className: `lw-content-1 ${imagePosition === 'right' ? 'right' : 'left'}`
        });

        return (
            <>
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

                    <PanelBody title="基本設定">
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

                    <PanelBody title="色設定">
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

                <div {...blockProps}>
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
                                <LinkPicker
                                    link={lwLinkFromAttrs(attributes, LINK_KEYS)}
                                    onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
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

        const blockProps = useBlockProps.save({
            className: `lw-content-1 ${imagePosition === 'right' ? 'right' : 'left'}`
        });

        return (
            <div {...blockProps}>
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
                            data-lw-link-type={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS).linkType}
                            data-lw-link-id={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS).linkId}
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
};

/* ------------------------------------------------------------------
 * #1169（2026-08-27）既定値の他社CDN直リンクを自社素材に差し替えた。
 * 既定値と同じ値はブロックコメントに書かれないので、既定値のまま使っている
 * 既存ページは「保存HTMLは旧URL／ブロックは新しい既定値」で食い違う。
 * 旧既定値を持った版を残して、開いて保存し直しても画像が入れ替わらないようにする。
 * 🚨 save は現行と同じ関数をそのまま渡す（マークアップは変えていない）。
 * ------------------------------------------------------------------ */
const LW_1169_OLD = JSON.parse( JSON.stringify( metadata.attributes ) );
LW_1169_OLD.imageUrl.default = "https://picsum.photos/1000/1000?random=1";

/* 🚨 すでにある deprecated は attributes: metadata.attributes を使っている＝新しい既定値を指す。
 *    そのままだと「古い save ＋ 古い既定値」で保存されたページ（サンプル画像のまま使っている人の
 *    大多数がこれ）がどの版にも当たらなくなる。だから既存の版それぞれについて
 *    旧既定値を持たせた双子を作って先に並べる。元の版も残す（画像を自分で差し替えた人向け）。 */
const lwPrev1169 = lwBlockDef.deprecated || [];
lwBlockDef.deprecated = [
	{ attributes: LW_1169_OLD, save: lwBlockDef.save },
	...lwPrev1169.map( ( d ) => ( { ...d, attributes: LW_1169_OLD } ) ),
	...lwPrev1169,
];

registerBlockType( metadata.name, lwBlockDef );
