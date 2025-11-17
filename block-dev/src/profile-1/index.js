import { registerBlockType } from '@wordpress/blocks';
import {
    MediaUpload,
    InspectorControls,
    RichText,
    ColorPalette
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import './style.scss';
import './editor.scss';

/* ===== ユーティリティ：<mark> → <span> 変換 ================= */
const replaceMarkWithSpan = (html = '') =>
    html
        .replace(/<mark([\s\S]*?)>/gi, '<span$1>')
        .replace(/<\/mark>/gi, '</span>');

registerBlockType('wdl/profile-1', {
    title: 'プロフィール 01',
    icon: 'id',
    category: 'liteword-other',
    supports: { anchor: true },

    /* === 属性 ================================================= */
    attributes: {
        imageUrl:     { type: 'string', default: '' },
        altText:      { type: 'string', default: 'プロフィール画像' },

        profileTitle: { type: 'string', default: 'PROFILE' }, // 見出し
        content: {
            type: 'string',
            default:
                '名前：東京太郎\n生年月日：1990年1月1日\n出身地：東京都\n趣味：読書、映画鑑賞、旅行',
        },

        backgroundColor: { type: 'string', default: '#ebebeb' },
        titleColor:      { type: 'string', default: '#000000' },
        contentColor:    { type: 'string', default: '#000000' },
    },


    /* === 編集画面 ============================================= */
    edit({ attributes, setAttributes }) {
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

        return (
            <Fragment>
                {/* === Inspector === */}
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

                    <PanelBody title="背景色" initialOpen={false}>
                        <ColorPalette
                            value={backgroundColor}
                            onChange={(c) => setAttributes({ backgroundColor: c })}
                        />
                    </PanelBody>

                    <PanelBody title="テキスト色" initialOpen={false}>
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

                {/* === ブロック本体 === */}
                <div className="profile-1" style={{ backgroundColor }}>
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
            </Fragment>
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

        return (
            <div className="profile-1" style={{ backgroundColor }}>
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
});
