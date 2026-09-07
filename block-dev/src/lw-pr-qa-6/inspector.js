/**
 * lw-pr-qa-6 — サイドバーの設定パネル
 */
import { InspectorControls, ColorPalette } from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    SelectControl,
    TextControl,
    ToggleControl,
    __experimentalHeading as Heading,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import { navPositionOptions, labelStyleOptions } from './constants.js';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

export default function Inspector( { attributes, setAttributes } ) {
    const {
        maxWidth,
        navWidth,
        navPosition,
        stickyTop,
        showCount,
        navTitle,
        mainColor,
        navBg,
        lineColor,
        itemGap,
        labelStyle,
        labelWidth,
        qLabelColor,
        aLabelColor,
        groupTitleSizePc,
        groupTitleSizeSp,
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

    return (
        <InspectorControls>
            <PanelBody title="分類の一覧（追従する側）" initialOpen={ true }>
                <SelectControl
                    label="置く場所"
                    value={ navPosition }
                    options={ navPositionOptions }
                    onChange={ ( v ) => setAttributes( { navPosition: v } ) }
                    help="スマホでは自動で上の横並びになります"
                />
                <TextControl
                    label="一覧の見出し（空でよい）"
                    value={ navTitle }
                    onChange={ ( v ) => setAttributes( { navTitle: v } ) }
                    help="例：お困りごとから探す"
                    __nextHasNoMarginBottom
                />
                <ToggleControl
                    label="件数を出す"
                    checked={ showCount }
                    onChange={ ( v ) => setAttributes( { showCount: v } ) }
                    __nextHasNoMarginBottom
                />
                <RangeControl
                    label="一覧の幅 (px)"
                    value={ navWidth }
                    onChange={ ( v ) => setAttributes( { navWidth: v } ) }
                    min={ 160 }
                    max={ 360 }
                    step={ 10 }
                />
                <RangeControl
                    label="止まる位置（画面上端からの px）"
                    value={ stickyTop }
                    onChange={ ( v ) => setAttributes( { stickyTop: v } ) }
                    min={ 0 }
                    max={ 240 }
                    step={ 4 }
                    help="固定ヘッダーに隠れるときは大きくしてください"
                />

                <Heading level={ 4 } style={ { margin: '16px 0 8px' } }>
                    一覧の地色
                </Heading>
                <ColorPalette
                    value={ navBg }
                    onChange={ ( c ) => setAttributes( { navBg: c || '#f7f7f7' } ) }
                />

                <Heading level={ 4 } style={ { margin: '16px 0 8px' } }>
                    いま読んでいる分類の色
                </Heading>
                <ColorPalette
                    value={ mainColor }
                    onChange={ ( c ) => setAttributes( { mainColor: c || 'var(--color-main)' } ) }
                />
            </PanelBody>

            <PanelBody title="レイアウト設定" initialOpen={ false }>
                <RangeControl
                    label="最大幅 (px)"
                    value={ maxWidth }
                    onChange={ ( v ) => setAttributes( { maxWidth: v } ) }
                    min={ 0 }
                    max={ 1300 }
                    step={ 10 }
                    help="0で100%（未設定）。2カラムなので1000px以上をおすすめします"
                    marks={ [
                        { value: 0, label: '未設定' },
                        { value: 1100, label: '1100' },
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
                <RangeControl
                    label="分類の見出し PC (px)"
                    value={ groupTitleSizePc }
                    onChange={ ( v ) => setAttributes( { groupTitleSizePc: v } ) }
                    min={ 14 }
                    max={ 40 }
                    step={ 1 }
                />
                <RangeControl
                    label="分類の見出し SP (px)"
                    value={ groupTitleSizeSp }
                    onChange={ ( v ) => setAttributes( { groupTitleSizeSp: v } ) }
                    min={ 12 }
                    max={ 32 }
                    step={ 1 }
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
                <SelectControl
                    label="ラベルの形式"
                    value={ labelStyle }
                    options={ labelStyleOptions }
                    onChange={ ( v ) => setAttributes( { labelStyle: v } ) }
                />
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
