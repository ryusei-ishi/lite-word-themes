/* ============================================================
 * LiteWord – お問い合わせフォーム 03（フォームのみ・カラー調整拡張）
 * ----------------------------------------------------------------
 *  • Block Name : wdl/lw-contact-3
 *  • Features   :
 *      - Inspector でフォーム ID・max‑width(px) を設定
 *      - ラベル文字色、入力欄背景／文字色
 *      - 送信ボタン背景／文字色
 *      - <必須>・<任意> ラベルの背景／文字色
 *      - インスタンス固有クラス（uniqueClass）を自動生成し、
 *        <style> タグでインライン CSS を出力（多重設置可）
 * =========================================================== */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ColorPalette } from '@wordpress/components';
import { RawHTML, useEffect } from '@wordpress/element';

/* 汎用スタイル（フォームの基本デザイン）は別途読み込む想定 */
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    /* ========== 編集画面 ========== */
    edit({ clientId, attributes, setAttributes }) {
        const {
            formId,
            maxWidth,
            labelColor,
            inputBgColor,
            inputTextColor,
            buttonBgColor,
            buttonTextColor,
            requiredBgColor,
            requiredTextColor,
            optionalBgColor,
            optionalTextColor,
            uniqueClass,
        } = attributes;

        /* --- 初回のみユニーククラス生成 --- */
        useEffect(() => {
            if (!uniqueClass) {
                setAttributes({ uniqueClass: `lw-contact-3-${clientId.slice(0, 8)}` });
            }
        }, []);

        const blockProps = useBlockProps({
            className: `lw-contact-3 ${uniqueClass || ''}`,
            style: { maxWidth: `${maxWidth}px` }
        });

        /* --- Inspector --- */
        return (
            <>
                <InspectorControls>
                    {/* フォーム設定 */}
                    <PanelBody title="フォーム設定" initialOpen={true}>
                        <SelectControl
                            label="フォームID"
                            value={formId}
                            options={[...Array(40)].map((_, i) => ({
                                label: `LiteWord専用 お問合わせフォームパターン ${i + 1}`,
                                value: i + 1,
                            }))}
                            onChange={(value) => setAttributes({ formId: parseInt(value, 10) })}
                        />
                    </PanelBody>

                    {/* レイアウト */}
                    <PanelBody title="レイアウト" initialOpen={true}>
                        <RangeControl
                            label="最大横幅（px）"
                            min={320}
                            max={1920}
                            step={20}
                            allowReset
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value || 1080 })}
                        />
                    </PanelBody>

                    {/* 色設定 */}
                    <PanelBody title="色設定" initialOpen={true}>
                        {/* ラベル */}
                        <p><strong>ラベル文字色</strong></p>
                        <ColorPalette value={labelColor} onChange={(c) => setAttributes({ labelColor: c })} />

                        {/* 入力欄 */}
                        <p style={{ marginTop: '1em' }}><strong>入力欄背景色</strong></p>
                        <ColorPalette value={inputBgColor} onChange={(c) => setAttributes({ inputBgColor: c })} />
                        <p style={{ marginTop: '1em' }}><strong>入力欄文字色</strong></p>
                        <ColorPalette value={inputTextColor} onChange={(c) => setAttributes({ inputTextColor: c })} />

                        {/* ボタン */}
                        <p style={{ marginTop: '1.5em' }}><strong>送信ボタン背景色</strong></p>
                        <ColorPalette value={buttonBgColor} onChange={(c) => setAttributes({ buttonBgColor: c })} />
                        <p style={{ marginTop: '1em' }}><strong>送信ボタン文字色</strong></p>
                        <ColorPalette value={buttonTextColor} onChange={(c) => setAttributes({ buttonTextColor: c })} />

                        {/* 必須／任意 */}
                        <p style={{ marginTop: '1.5em' }}><strong>必須ラベル背景色</strong></p>
                        <ColorPalette value={requiredBgColor} onChange={(c) => setAttributes({ requiredBgColor: c })} />
                        <p style={{ marginTop: '1em' }}><strong>必須ラベル文字色</strong></p>
                        <ColorPalette value={requiredTextColor} onChange={(c) => setAttributes({ requiredTextColor: c })} />

                        <p style={{ marginTop: '1.5em' }}><strong>任意ラベル背景色</strong></p>
                        <ColorPalette value={optionalBgColor} onChange={(c) => setAttributes({ optionalBgColor: c })} />
                        <p style={{ marginTop: '1em' }}><strong>任意ラベル文字色</strong></p>
                        <ColorPalette value={optionalTextColor} onChange={(c) => setAttributes({ optionalTextColor: c })} />
                    </PanelBody>
                </InspectorControls>

                {/* プレビュー */}
                <div {...blockProps}>
                    <RawHTML>{`[lw_mail_form_select id='${formId}']`}</RawHTML>
                    {/* インラインスタイル */}
                    <style>{`
                        .${uniqueClass} .lw_mail_form .label_in label { color: ${labelColor}; }
                        .${uniqueClass} .lw_mail_form input[type="text"],
                        .${uniqueClass} .lw_mail_form input[type="email"],
                        .${uniqueClass} .lw_mail_form input[type="tel"],
                        .${uniqueClass} .lw_mail_form input[type="url"],
                        .${uniqueClass} .lw_mail_form input[type="password"],
                        .${uniqueClass} .lw_mail_form textarea,
                        .${uniqueClass} .lw_mail_form select {
                            background-color: ${inputBgColor};
                            color: ${inputTextColor};
                        }
                        .${uniqueClass} .lw_mail_form select option { color: ${inputTextColor}; }
                        .${uniqueClass} .lw_mail_form input[type="radio"] + label,
                        .${uniqueClass} .lw_mail_form input[type="checkbox"] + label {
                            color: ${inputTextColor};
                        }
                        .${uniqueClass} .lw_mail_form .submit_wrap button {
                            background-color: ${buttonBgColor};
                            color: ${buttonTextColor};
                        }
                        .${uniqueClass} .lw_mail_form .required:not(.is-optional) {
                            background-color: ${requiredBgColor};
                            color: ${requiredTextColor};
                        }
                        .${uniqueClass} .lw_mail_form .required.is-optional {
                            background-color: ${optionalBgColor};
                            color: ${optionalTextColor};
                        }
                    `}</style>
                </div>
            </>
        );
    },

    /* ========== フロント出力 ========== */
    save({ attributes }) {
        const {
            formId,
            maxWidth,
            labelColor,
            inputBgColor,
            inputTextColor,
            buttonBgColor,
            buttonTextColor,
            requiredBgColor,
            requiredTextColor,
            optionalBgColor,
            optionalTextColor,
            uniqueClass,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `lw-contact-3 ${uniqueClass}`,
            style: { maxWidth: `${maxWidth}px` }
        });

        return (
            <div {...blockProps}>
                <RawHTML>{`[lw_mail_form_select id='${formId}']`}</RawHTML>
                <style>{`
                    .${uniqueClass} .lw_mail_form .label_in label,.supplement_text { color: ${labelColor}; }
                    .${uniqueClass} .lw_mail_form input[type="text"],
                    .${uniqueClass} .lw_mail_form input[type="email"],
                    .${uniqueClass} .lw_mail_form input[type="tel"],
                    .${uniqueClass} .lw_mail_form input[type="url"],
                    .${uniqueClass} .lw_mail_form input[type="password"],
                    .${uniqueClass} .lw_mail_form textarea,
                    .${uniqueClass} .lw_mail_form select {
                        background-color: ${inputBgColor};
                        color: ${inputTextColor};
                    }
                    .${uniqueClass} .lw_mail_form select option { color: ${inputTextColor}; }
                    .${uniqueClass} .lw_mail_form .checkbox_in label,
                    .${uniqueClass} .lw_mail_form .radio_in label {
                        color: ${labelColor};
                    }
                    .${uniqueClass} .lw_mail_form .submit_wrap button {
                        background-color: ${buttonBgColor};
                        color: ${buttonTextColor};
                    }
                    .${uniqueClass} .lw_mail_form .required:not(.is-optional) {
                        background-color: ${requiredBgColor} !important;
                        color: ${requiredTextColor} !important;
                    }
                    .${uniqueClass} .lw_mail_form .required.is-optional {
                        background-color: ${optionalBgColor} !important;
                        color: ${optionalTextColor} !important;
                    }
                `}</style>
            </div>
        );
    },
});
