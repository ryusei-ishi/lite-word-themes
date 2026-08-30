import { registerBlockType } from '@wordpress/blocks';
import {
    MediaUpload,
    InspectorControls,
    RichText,
    ColorPalette
,
    useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ===== ユーティリティ：<mark> → <span> 変換 ================= */
const replaceMarkWithSpan = (html = '') =>
    html
        .replace(/<mark([\s\S]*?)>/gi, '<span$1>')
        .replace(/<\/mark>/gi, '</span>');

const lwBlockDef = {
    title: 'プロフィール 01',
    icon: 'id',
    category: 'lw-profile',
    supports: { anchor: true },

    /* === 編集画面 ============================================= */
    edit({ attributes, setAttributes}) {
        const {
            imageUrl,
            altText,
            profileTitle,
            content,
            backgroundColor,
            titleColor,
            contentColor,
        } = attributes;

        /* ---------- 既存データ内の <mark> を変換（初回のみ） */
        useEffect(() => {
            const fixedTitle = replaceMarkWithSpan(profileTitle);
            if (fixedTitle !== profileTitle) {
                setAttributes({ profileTitle: fixedTitle });
            }
        }, []); // 依存配列なし → 初回のみ

        /* ---------- 画像選択 ---------- */
        const onImageSelect = (media) =>
            setAttributes({ imageUrl: media.url, altText: media.alt });

        const blockProps = useBlockProps({
            className: 'profile-1',
            style: { backgroundColor }
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title="画像設定" initialOpen={true}>
                        <MediaUpload
                            onSelect={onImageSelect}
                            allowedTypes={['image']}
                            value={imageUrl}
                            render={({ open }) => (
                                <div>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={altText}
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    ) : (
                                        <p>画像を選択してください</p>
                                    )}
                                    <Button
                                        onClick={open}
                                        isSecondary
                                        style={{ marginTop: 10 }}
                                    >
                                        画像を{imageUrl ? '変更' : '選択'}
                                    </Button>
                                </div>
                            )}
                        />
                    </PanelBody>

                    <PanelBody title="背景設定" initialOpen={false}>
                        <ColorPalette
                            value={backgroundColor}
                            onChange={(c) => setAttributes({ backgroundColor: c })}
                        />
                    </PanelBody>

                    <PanelBody title="色設定" initialOpen={false}>
                        <p><strong>タイトルの色 (h2)</strong></p>
                        <ColorPalette
                            value={titleColor}
                            onChange={(c) => setAttributes({ titleColor: c })}
                        />
                        <p style={{ marginTop: 20 }}>
                            <strong>内容の色 (p)</strong>
                        </p>
                        <ColorPalette
                            value={contentColor}
                            onChange={(c) => setAttributes({ contentColor: c })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="profile_1_inner">
                        <div className="profile_1_image">
                            {imageUrl ? (
                                <img src={imageUrl} alt={altText} />
                            ) : (
                                <p>画像を選択してください</p>
                            )}
                        </div>

                        <div className="profile_1_content">
                            {/* 見出し：ハイライト禁止（mark 生成防止） */}
                            <RichText
                                tagName="h2"
                                value={profileTitle}
                                onChange={(v) =>
                                    setAttributes({ profileTitle: replaceMarkWithSpan(v) })
                                }
                                placeholder="タイトルを入力してください"
                                style={{ color: titleColor }}
                                allowedFormats={['core/bold', 'core/italic', 'core/text-color']}
                            />

                            {/* 本文：改行→<br> だけで white-space は付けない */}
                               <RichText
                                tagName="p"
                                value={attributes.content}
                                style={{ color: contentColor }}
                                onChange={(newContent) => setAttributes({ content: newContent })}
                                placeholder="内容を入力してください"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    },

    /* === 保存（フロント側） ==================================== */
    save({ attributes }) {
        const {
            imageUrl,
            altText,
            profileTitle,
            content,
            backgroundColor,
            titleColor,
            contentColor,
        } = attributes;

        /* 見出しの mark→span 変換を念押し */
        const safeTitle = replaceMarkWithSpan(profileTitle);

        const blockProps = useBlockProps.save({
            className: 'profile-1',
            style: { backgroundColor }
        });

        return (
            <div {...blockProps}>
                <div className="profile_1_inner">
                    <div className="profile_1_image">
                        {imageUrl && <img loading="lazy" src={imageUrl} alt={altText} />}
                    </div>

                    <div className="profile_1_content">
                        <RichText.Content
                            tagName="h2"
                            value={safeTitle}
                            style={{ color: titleColor }}
                        />
                        <RichText.Content
                            tagName="p"
                            value={content}
                            multiline="br"
                            style={{ color: contentColor,whiteSpace: 'pre-wrap'  }}
                        />
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
LW_1169_OLD.imageUrl.default = "https://cdn.pixabay.com/photo/2020/06/30/10/05/photographer-5355840_1280.jpg";

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
