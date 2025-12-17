/**
 * 見出しタイトル 1 ─ shin shop pattern 01
 * -----------------------------------------------------------
 * 追加機能
 *   1. 下線（::after）の太さ(height) と 色(background) を
 *      サイドバーから変更
 *   2. 変更内容は <style> タグをブロック内にインライン出力
 *   3. 既存機能（見出しレベル切替・タイトル編集）はそのまま
 * ★ apiVersion 3 対応（2025-12-07）
 */

import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    InspectorControls,
    BlockControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    RadioControl,
    ToolbarGroup,
    ToolbarButton,
    RangeControl,
    ColorPalette
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import metadata from './block.json';

registerBlockType(metadata.name, {
    /* --------------------------------------------------
     * 編集画面
     * -------------------------------------------------- */
    edit(props) {
        const { attributes, setAttributes, clientId } = props;
        const {
            mainTitle,
            headingLevel,
            underlineHeight,
            underlineColor,
            uniqueId
        } = attributes;

        /* 初回のみユニーク ID を保存 */
        useEffect(() => {
            if (!uniqueId) {
                setAttributes({ uniqueId: clientId.slice(0, 8) });
            }
        }, []);

        /* 共通：タイトル・レベル変更 */
        const onChangeMainTitle   = (v) => setAttributes({ mainTitle: v });
        const onChangeHeadingLevel = (l) => setAttributes({ headingLevel: l });

        /* 下線：高さ & 色 */
        const onChangeHeight = (h) => setAttributes({ underlineHeight: h });
        const onChangeColor  = (c) => setAttributes({ underlineColor: c });

        /* 動的タグ名とユニーククラス */
        const TagName      = `h${headingLevel}`;
        const uniqueClass  = `title-${uniqueId || clientId.slice(0, 8)}`;

        /* インライン style */
        const inlineStyle = `
          .${uniqueClass} .main::after{
              height:${underlineHeight}px;
              background:${underlineColor};
          }
        `;

        const blockProps = useBlockProps({
            className: `shin-gas-station-01-custom-title-1 ${uniqueClass}`,
        });

        return (
            <>
                {/* --------------- ツールバー --------------- */}
                <BlockControls>
                    <ToolbarGroup>
                        {[2, 3, 4, 5].map((level) => (
                            <ToolbarButton
                                key={level}
                                isPressed={headingLevel === level}
                                onClick={() => onChangeHeadingLevel(level)}
                            >
                                {`H${level}`}
                            </ToolbarButton>
                        ))}
                    </ToolbarGroup>
                </BlockControls>

                {/* --------------- サイドバー --------------- */}
                <InspectorControls>
                    <PanelBody title="下線の設定">
                        <RangeControl
                            label="線の太さ(px)"
                            value={underlineHeight}
                            onChange={onChangeHeight}
                            min={0}
                            max={10}
                            step={1}
                        />
                        <ColorPalette
                            label="線の色"
                            value={underlineColor}
                            onChange={onChangeColor}
                        />
                    </PanelBody>
                </InspectorControls>

                {/* --------------- プレビュー --------------- */}
                <TagName {...blockProps}>
                    <RichText
                        tagName="span"
                        className="main"
                        data-lw_font_set="Montserrat"
                        value={mainTitle}
                        onChange={onChangeMainTitle}
                        placeholder="メインタイトルを入力"
                    />
                    <style>{inlineStyle}</style>
                </TagName>
            </>
        );
    },

    /* --------------------------------------------------
     * 保存
     * -------------------------------------------------- */
    save({ attributes }) {
        const {
            mainTitle,
            headingLevel,
            underlineHeight,
            underlineColor,
            uniqueId
        } = attributes;

        const TagName     = `h${headingLevel}`;
        const uniqueClass = `title-${uniqueId}`;

        const inlineStyle = `
          .${uniqueClass} .main::after{
              height:${underlineHeight}px;
              background:${underlineColor};
          }
        `;

        const blockProps = useBlockProps.save({
            className: `shin-gas-station-01-custom-title-1 ${uniqueClass}`,
        });

        return (
            <TagName {...blockProps}>
                <RichText.Content
                    tagName="span"
                    className="main"
                    data-lw_font_set="Montserrat"
                    value={mainTitle}
                />
                <style>{inlineStyle}</style>
            </TagName>
        );
    }
});
