import { registerBlockType } from '@wordpress/blocks';
import {
    MediaUpload,
    InspectorControls,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    RangeControl,
    SelectControl,
    ToggleControl       // ← 追加
} from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/lw-gallery-01', {
    title   : 'ギャラリー 01',
    icon    : 'images-alt2',
    category: 'liteword-banner',
    supports: { anchor: true },

    attributes: {
        /* --- テキスト --- */
        text_1      : { type: 'string',  default: 'テキストテキストテキストテキスト\nテキストテキストテキストテキストテキストテキストテキストテキスト' },
        text_2      : { type: 'string',  default: 'テキストテキストテキストテキスト\nテキストテキストテキストテキストテキストテキストテキストテキスト' },
        showText1   : { type: 'boolean', default: true  },   // ← boolean へ変更
        showText2   : { type: 'boolean', default: true  },
        text1AlignPc: { type: 'string',  default: 'center_pc' },
        text1AlignSp: { type: 'string',  default: 'left_sp'   },
        text2AlignPc: { type: 'string',  default: 'center_pc' },
        text2AlignSp: { type: 'string',  default: 'left_sp'   },

        /* --- 画像 --- */
        items: {
            type   : 'array',
            default: [
                { imgUrl: 'https://picsum.photos/1000/1000?random=1' },
                { imgUrl: 'https://picsum.photos/1000/1000?random=2' },
                { imgUrl: 'https://picsum.photos/1000/1000?random=3' },
            ],
        },

        /* --- レイアウト --- */
        maxWidthText: { type: 'number', default: 800 },
        maxWidth    : { type: 'number', default: 800 },
    },

    edit: ({ attributes, setAttributes }) => {
        const {
            items, maxWidthText, maxWidth,
            text_1, text_2, showText1, showText2,
            text1AlignPc, text1AlignSp, text2AlignPc, text2AlignSp,
        } = attributes;

        const updateItem = (i, key, val) =>
            setAttributes({ items: items.map((v, n) => (n === i ? { ...v, [key]: val } : v)) });
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

        return (
            <>
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
                                onSelect={(m) => updateItem(i, 'imgUrl', m.url)}
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

                <nav className="lw-gallery-01">
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
                                {item.imgUrl && <img loading="lazy" src={item.imgUrl} alt="" />}
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
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            items, maxWidthText, maxWidth,
            text_1, text_2, showText1, showText2,
            text1AlignPc, text1AlignSp, text2AlignPc, text2AlignSp,
        } = attributes;

        return (
            <nav className="lw-gallery-01">
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
                            {item.imgUrl && <img src={item.imgUrl} alt="" />}
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
});
