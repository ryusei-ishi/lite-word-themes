/**
 * lw-pr-qa-5 — サイドバーの設定パネル
 */
import { InspectorControls, ColorPalette } from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    SelectControl,
    TextControl,
    TextareaControl,
    ToggleControl,
    Button,
    __experimentalHeading as Heading,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import { openModeOptions } from './constants.js';
import { safeHints } from './helpers.js';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

export default function Inspector( { attributes, setAttributes } ) {
    const {
        maxWidth,
        openMode,
        placeholder,
        hintLabel,
        hints,
        showCount,
        noResultText,
        noResultLinkText,
        noResultLinkUrl,
        mainColor,
        searchBg,
        lineColor,
        itemGap,
        labelWidth,
        qLabelColor,
        aLabelColor,
        labelFont,
        labelFontWeight,
        labelFontSizePc,
        labelFontSizeSp,
        textFont,
        qFontSizePc,
        qFontSizeSp,
        aFontSizePc,
        aFontSizeSp,
        schemaOutput,
    } = attributes;

    const hintList = Array.isArray( hints ) ? hints : [];

    const updateHint = ( i, value ) =>
        setAttributes( { hints: hintList.map( ( h, idx ) => ( idx === i ? value : h ) ) } );
    const removeHint = ( i ) =>
        setAttributes( { hints: hintList.filter( ( _, idx ) => idx !== i ) } );
    const addHint = () => setAttributes( { hints: [ ...hintList, '' ] } );

    return (
        <InspectorControls>
            <PanelBody title="検索窓の設定" initialOpen={ true }>
                <TextControl
                    label="検索窓に薄く出す文字"
                    value={ placeholder }
                    onChange={ ( v ) => setAttributes( { placeholder: v } ) }
                    help="何を入れればいいか分かる例を書いてください"
                    __nextHasNoMarginBottom
                />
                <ToggleControl
                    label="件数を出す"
                    checked={ showCount }
                    onChange={ ( v ) => setAttributes( { showCount: v } ) }
                    __nextHasNoMarginBottom
                />

                <hr style={ { margin: '16px 0' } } />

                <TextControl
                    label="よく検索される言葉の見出し"
                    value={ hintLabel }
                    onChange={ ( v ) => setAttributes( { hintLabel: v } ) }
                    __nextHasNoMarginBottom
                />
                { hintList.map( ( h, i ) => (
                    <div
                        key={ i }
                        style={ { display: 'flex', gap: '4px', alignItems: 'flex-end' } }
                    >
                        <div style={ { flex: '1 1 auto' } }>
                            <TextControl
                                label={ `言葉 ${ i + 1 }` }
                                value={ h }
                                onChange={ ( v ) => updateHint( i, v ) }
                                __nextHasNoMarginBottom
                            />
                        </div>
                        <Button
                            size="small"
                            variant="secondary"
                            isDestructive
                            onClick={ () => removeHint( i ) }
                        >
                            削除
                        </Button>
                    </div>
                ) ) }
                <Button
                    variant="secondary"
                    onClick={ addHint }
                    disabled={ safeHints( hints ).length >= 6 }
                    style={ { marginTop: '8px' } }
                >
                    ＋ 言葉を追加（5個までがおすすめ）
                </Button>
            </PanelBody>

            <PanelBody title="見つからなかったとき" initialOpen={ false }>
                <TextareaControl
                    label="出す文章"
                    value={ noResultText }
                    onChange={ ( v ) => setAttributes( { noResultText: v } ) }
                    rows={ 3 }
                    __nextHasNoMarginBottom
                />
                <TextControl
                    label="ボタンの文字"
                    value={ noResultLinkText }
                    onChange={ ( v ) => setAttributes( { noResultLinkText: v } ) }
                    __nextHasNoMarginBottom
                />
                <TextControl
                    label="ボタンの行き先（URL）"
                    value={ noResultLinkUrl }
                    onChange={ ( v ) => setAttributes( { noResultLinkUrl: v } ) }
                    help="空のままにするとボタンは出ません"
                    __nextHasNoMarginBottom
                />
            </PanelBody>

            <PanelBody title="レイアウト設定" initialOpen={ false }>
                <SelectControl
                    label="回答の出し方"
                    value={ openMode }
                    options={ openModeOptions }
                    onChange={ ( v ) => setAttributes( { openMode: v } ) }
                    help="質問が多いときは「押すと開く」のほうが探しやすくなります"
                />
                <RangeControl
                    label="最大幅 (px)"
                    value={ maxWidth }
                    onChange={ ( v ) => setAttributes( { maxWidth: v } ) }
                    min={ 0 }
                    max={ 1300 }
                    step={ 10 }
                    help="0で100%（未設定）"
                    marks={ [
                        { value: 0, label: '未設定' },
                        { value: 860, label: '860' },
                        { value: 1300, label: '1300' },
                    ] }
                />
                <RangeControl
                    label="項目の上下余白 (px)"
                    value={ itemGap }
                    onChange={ ( v ) => setAttributes( { itemGap: v } ) }
                    min={ 8 }
                    max={ 64 }
                    step={ 1 }
                />

                <Heading level={ 4 } style={ { margin: '16px 0 8px' } }>
                    主な色（アイコン・押した言葉）
                </Heading>
                <ColorPalette
                    value={ mainColor }
                    onChange={ ( c ) => setAttributes( { mainColor: c || 'var(--color-main)' } ) }
                />

                <Heading level={ 4 } style={ { margin: '16px 0 8px' } }>
                    検索窓のまわりの地色
                </Heading>
                <ColorPalette
                    value={ searchBg }
                    onChange={ ( c ) => setAttributes( { searchBg: c || '#f6f6f6' } ) }
                />

                <Heading level={ 4 } style={ { margin: '16px 0 8px' } }>
                    区切り線の色
                </Heading>
                <ColorPalette
                    value={ lineColor }
                    onChange={ ( c ) => setAttributes( { lineColor: c || '#e0e0e0' } ) }
                />
            </PanelBody>

            <PanelBody title="ラベル設定（Q・A）" initialOpen={ false }>
                <RangeControl
                    label="ラベル幅 (px)"
                    value={ labelWidth }
                    onChange={ ( v ) => setAttributes( { labelWidth: v } ) }
                    min={ 20 }
                    max={ 100 }
                    step={ 1 }
                />
                <Heading level={ 4 } style={ { marginBottom: '8px' } }>
                    Q ラベルの色
                </Heading>
                <ColorPalette
                    value={ qLabelColor }
                    onChange={ ( c ) => setAttributes( { qLabelColor: c || 'var(--color-main)' } ) }
                />
                <Heading level={ 4 } style={ { margin: '16px 0 8px' } }>
                    A ラベルの色
                </Heading>
                <ColorPalette
                    value={ aLabelColor }
                    onChange={ ( c ) =>
                        setAttributes( { aLabelColor: c || 'var(--color-accent)' } )
                    }
                />

                <hr style={ { margin: '16px 0' } } />

                <SelectControl
                    label="フォント"
                    value={ labelFont }
                    options={ fontOptions }
                    onChange={ ( v ) => setAttributes( { labelFont: v } ) }
                />
                <SelectControl
                    label="太さ"
                    value={ labelFontWeight }
                    options={ fontWeightOptions }
                    onChange={ ( v ) => setAttributes( { labelFontWeight: v } ) }
                />
                <RangeControl
                    label="文字サイズ PC (px)"
                    value={ labelFontSizePc }
                    onChange={ ( v ) => setAttributes( { labelFontSizePc: v } ) }
                    min={ 12 }
                    max={ 40 }
                    step={ 1 }
                />
                <RangeControl
                    label="文字サイズ SP (px)"
                    value={ labelFontSizeSp }
                    onChange={ ( v ) => setAttributes( { labelFontSizeSp: v } ) }
                    min={ 10 }
                    max={ 32 }
                    step={ 1 }
                />
            </PanelBody>

            <PanelBody title="質問・回答の文字" initialOpen={ false }>
                <SelectControl
                    label="フォント（質問・回答 共通）"
                    value={ textFont }
                    options={ fontOptions }
                    onChange={ ( v ) => setAttributes( { textFont: v } ) }
                />
                <RangeControl
                    label="質問 PC (px)"
                    value={ qFontSizePc }
                    onChange={ ( v ) => setAttributes( { qFontSizePc: v } ) }
                    min={ 12 }
                    max={ 40 }
                    step={ 1 }
                />
                <RangeControl
                    label="質問 SP (px)"
                    value={ qFontSizeSp }
                    onChange={ ( v ) => setAttributes( { qFontSizeSp: v } ) }
                    min={ 10 }
                    max={ 32 }
                    step={ 1 }
                />
                <RangeControl
                    label="回答 PC (px)"
                    value={ aFontSizePc }
                    onChange={ ( v ) => setAttributes( { aFontSizePc: v } ) }
                    min={ 12 }
                    max={ 40 }
                    step={ 1 }
                />
                <RangeControl
                    label="回答 SP (px)"
                    value={ aFontSizeSp }
                    onChange={ ( v ) => setAttributes( { aFontSizeSp: v } ) }
                    min={ 10 }
                    max={ 32 }
                    step={ 1 }
                />
            </PanelBody>

            <PanelBody title="検索エンジン向けの設定" initialOpen={ false }>
                <ToggleControl
                    label="よくある質問の構造化データを出す"
                    checked={ schemaOutput }
                    onChange={ ( v ) => setAttributes( { schemaOutput: v } ) }
                    help="Google や AI に「これはよくある質問です」と伝える印（FAQPage）を、表示に影響しない形でページに埋めます。同じページに2つ以上のよくある質問ブロックがあるときは、1つだけ ON にしてください。"
                    __nextHasNoMarginBottom
                />
            </PanelBody>
        </InspectorControls>
    );
}
