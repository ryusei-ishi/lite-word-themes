/**
 * lw-pr-qa-3 — サイドバーの設定パネル
 * 表示（edit.js）とは分けておく。設定が増えてもエディタ側が太らないようにするため。
 */
import { InspectorControls, ColorPalette } from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    SelectControl,
    __experimentalHeading as Heading,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import { labelStyleOptions } from './constants.js';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

export default function Inspector( { attributes, setAttributes } ) {
    const {
        maxWidth,
        itemGap,
        labelStyle,
        labelWidth,
        qLabelColor,
        aLabelColor,
        lineColor,
        labelFont,
        labelFontWeight,
        labelFontSizePc,
        labelFontSizeSp,
        textFont,
        qFontWeight,
        aFontWeight,
        qFontSizePc,
        qFontSizeSp,
        aFontSizePc,
        aFontSizeSp,
    } = attributes;

    return (
        <InspectorControls>
            <PanelBody title="レイアウト設定" initialOpen={ true }>
                <RangeControl
                    label="最大幅 (px)"
                    value={ maxWidth }
                    onChange={ ( v ) => setAttributes( { maxWidth: v } ) }
                    min={ 0 }
                    max={ 1300 }
                    step={ 10 }
                    help="0で100%（未設定）、600〜1300pxで指定"
                    marks={ [
                        { value: 0, label: '未設定' },
                        { value: 800, label: '800' },
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
                    help="区切り線と Q・A の間隔"
                />
                <Heading level={ 4 } style={ { marginBottom: '8px' } }>
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
                    help="連番にすると文字が増えます。窮屈なら広げてください"
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
                    onChange={ ( c ) => setAttributes( { aLabelColor: c || 'var(--color-accent)' } ) }
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

            <PanelBody title="質問の設定" initialOpen={ false }>
                <SelectControl
                    label="太さ"
                    value={ qFontWeight }
                    options={ fontWeightOptions }
                    onChange={ ( v ) => setAttributes( { qFontWeight: v } ) }
                />
                <RangeControl
                    label="文字サイズ PC (px)"
                    value={ qFontSizePc }
                    onChange={ ( v ) => setAttributes( { qFontSizePc: v } ) }
                    min={ 12 }
                    max={ 40 }
                    step={ 1 }
                />
                <RangeControl
                    label="文字サイズ SP (px)"
                    value={ qFontSizeSp }
                    onChange={ ( v ) => setAttributes( { qFontSizeSp: v } ) }
                    min={ 10 }
                    max={ 32 }
                    step={ 1 }
                />
            </PanelBody>

            <PanelBody title="回答の設定" initialOpen={ false }>
                <SelectControl
                    label="太さ"
                    value={ aFontWeight }
                    options={ fontWeightOptions }
                    onChange={ ( v ) => setAttributes( { aFontWeight: v } ) }
                />
                <RangeControl
                    label="文字サイズ PC (px)"
                    value={ aFontSizePc }
                    onChange={ ( v ) => setAttributes( { aFontSizePc: v } ) }
                    min={ 12 }
                    max={ 40 }
                    step={ 1 }
                />
                <RangeControl
                    label="文字サイズ SP (px)"
                    value={ aFontSizeSp }
                    onChange={ ( v ) => setAttributes( { aFontSizeSp: v } ) }
                    min={ 10 }
                    max={ 32 }
                    step={ 1 }
                />
            </PanelBody>

            <PanelBody title="本文のフォント" initialOpen={ false }>
                <SelectControl
                    label="フォント（質問・回答 共通）"
                    value={ textFont }
                    options={ fontOptions }
                    onChange={ ( v ) => setAttributes( { textFont: v } ) }
                />
            </PanelBody>
        </InspectorControls>
    );
}
