/**
 * ギャラリー 01
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import {
    MediaUpload,
    InspectorControls,
    RichText,
    useBlockProps
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    Button,
    RangeControl,
    SelectControl,
    ToggleControl
} from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

const lwBlockDef = {
    edit: ({ attributes, setAttributes }) => {
        const {
            items, maxWidthText, maxWidth,
            text_1, text_2, showText1, showText2,
            text1AlignPc, text1AlignSp, text2AlignPc, text2AlignSp,
        } = attributes;

        const updateItem = (i, key, val) => updateItemMulti(i, { [key]: val });
        // 画像を選び直したときに URL と alt をまとめて入れ替えるため、複数キー版を用意する
        const updateItemMulti = (i, patch) =>
            setAttributes({ items: items.map((v, n) => (n === i ? { ...v, ...patch } : v)) });
        const update = (key, val) => setAttributes({ [key]: val });

        const alignOptionsPc = [
            { label: '左寄せ',   value: 'left_pc'   },
            { label: '中央寄せ', value: 'center_pc' },
            { label: '右寄せ',   value: 'right_pc'  },
        ];
        const alignOptionsSp = [
            { label: '左寄せ',   value: 'left_sp'   },
            { label: '中央寄せ', value: 'center_sp' },
            { label: '右寄せ',   value: 'right_sp'  },
        ];

        // useBlockProps で apiVersion 3 対応
        const blockProps = useBlockProps({
            className: 'lw-gallery-01'
        });

        return (
            <nav {...blockProps}>
                <InspectorControls>
                    <PanelBody title="最大横幅">
                        <RangeControl
                            label="テキスト部分"
                            value={maxWidthText}
                            onChange={(v) => update('maxWidthText', v)}
                            min={400}
                            max={1600}
                            step={8}
                        />
                        <RangeControl
                            label="画像部分"
                            value={maxWidth}
                            onChange={(v) => update('maxWidth', v)}
                            min={400}
                            max={1600}
                            step={8}
                        />
                    </PanelBody>

                    {/* 画像設定 */}
                    {items.map((item, i) => (
                        <PanelBody title={`画像 ${i + 1}`} key={i}>
                            <MediaUpload
                                onSelect={(m) => updateItemMulti(i, { imgUrl: m.url, alt: m.alt || '' })}
                                allowedTypes={['image']}
                                render={({ open }) =>
                                    item.imgUrl ? (
                                        <>
                                            <img src={item.imgUrl} alt="" style={{ maxWidth: '100%' }} />
                                            <Button onClick={open} isSecondary style={{ marginTop: 10 }}>
                                                画像を変更
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={open} isSecondary>
                                            画像を選択
                                        </Button>
                                    )
                                }
                            />
                            <TextControl
                                label="画像の説明（alt）"
                                help="目の見えない方や検索エンジンに、この画像が何かを伝える文です。例：焼きたてのパンが並ぶ木の棚"
                                value={item.alt || ''}
                                onChange={(v) => updateItem(i, 'alt', v)}
                                style={{ marginTop: '12px' }}
                            />
                        </PanelBody>
                    ))}

                    {/* テキスト1 */}
                    <PanelBody title="テキスト（画像の上）">
                        <ToggleControl
                            label="表示"
                            checked={showText1}
                            onChange={(v) => update('showText1', v)}
                        />
                        <SelectControl
                            label="PC配置"
                            value={text1AlignPc}
                            options={alignOptionsPc}
                            onChange={(v) => update('text1AlignPc', v)}
                        />
                        <SelectControl
                            label="SP配置"
                            value={text1AlignSp}
                            options={alignOptionsSp}
                            onChange={(v) => update('text1AlignSp', v)}
                        />
                    </PanelBody>

                    {/* テキスト2 */}
                    <PanelBody title="テキスト（画像の下）">
                        <ToggleControl
                            label="表示"
                            checked={showText2}
                            onChange={(v) => update('showText2', v)}
                        />
                        <SelectControl
                            label="PC配置"
                            value={text2AlignPc}
                            options={alignOptionsPc}
                            onChange={(v) => update('text2AlignPc', v)}
                        />
                        <SelectControl
                            label="SP配置"
                            value={text2AlignSp}
                            options={alignOptionsSp}
                            onChange={(v) => update('text2AlignSp', v)}
                        />
                    </PanelBody>
                </InspectorControls>

                {showText1 && (
                        <RichText
                            tagName="p"
                            className={`${text1AlignPc} ${text1AlignSp}`}
                            value={text_1}
                            onChange={(v) => update('text_1', v)}
                            placeholder="テキストを入力"
                            style={{ maxWidth: `${maxWidthText}px` }}
                        />
                    )}

                    <ul className="lw-gallery-01__wrap" style={{ maxWidth: `${maxWidth}px` }}>
                        {items.map((item, i) => (
                            <li key={i}>
                                {item.imgUrl && <img loading="lazy" src={item.imgUrl} alt={item.alt || ''} />}
                            </li>
                        ))}
                    </ul>

                {showText2 && (
                    <RichText
                        tagName="p"
                        className={`${text2AlignPc} ${text2AlignSp}`}
                        value={text_2}
                        onChange={(v) => update('text_2', v)}
                        placeholder="テキストを入力"
                        style={{ maxWidth: `${maxWidthText}px` }}
                    />
                )}
            </nav>
        );
    },

    save: ({ attributes }) => {
        const {
            items, maxWidthText, maxWidth,
            text_1, text_2, showText1, showText2,
            text1AlignPc, text1AlignSp, text2AlignPc, text2AlignSp,
        } = attributes;

        // useBlockProps.save() で apiVersion 3 対応
        const blockProps = useBlockProps.save({
            className: 'lw-gallery-01'
        });

        return (
            <nav {...blockProps}>
                {showText1 && text_1 && (
                    <RichText.Content
                        tagName="p"
                        className={`${text1AlignPc} ${text1AlignSp}`}
                        value={text_1}
                        style={{ maxWidth: `${maxWidthText}px` }}
                    />
                )}

                <ul className="lw-gallery-01__wrap" style={{ maxWidth: `${maxWidth}px` }}>
                    {items.map((item, i) => (
                        <li key={i}>
                            {item.imgUrl && <img src={item.imgUrl} alt={item.alt || ''} />}
                        </li>
                    ))}
                </ul>

                {showText2 && text_2 && (
                    <RichText.Content
                        tagName="p"
                        className={`${text2AlignPc} ${text2AlignSp}`}
                        value={text_2}
                        style={{ maxWidth: `${maxWidthText}px` }}
                    />
                )}
            </nav>
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
LW_1169_OLD.items.default[0].imgUrl = "https://picsum.photos/1000/1000?random=1";
LW_1169_OLD.items.default[1].imgUrl = "https://picsum.photos/1000/1000?random=2";
LW_1169_OLD.items.default[2].imgUrl = "https://picsum.photos/1000/1000?random=3";

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
