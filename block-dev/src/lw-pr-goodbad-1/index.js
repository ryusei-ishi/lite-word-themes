/**
 * メリット・デメリット 01（wdl/lw-pr-goodbad-1）
 * ------------------------------------------------------------
 *  良い点と気になる点を左右に並べる。レビュー記事・比較記事用。
 *
 *  なぜ作ったか（2026-09-02）
 *  ・145ブロックの中に、良い点と悪い点を対で見せるブロックが1つも無かった。
 *  ・レビュー記事で「気になる点」を書く場所が用意されていないと、
 *    書き手は良いことだけ並べてしまう。読む人はそれをすぐ見抜く。
 *    **書ける場所を先に作っておく**のがこのブロックの役目。
 *
 *  設計の芯
 *  ・**列数に CSS 変数を使わない。** 横並びか縦積みかはクラスで切り替える。
 *    数値の変数を style に渡すと React が px を付けて grid が壊れるため
 *    （2026-09-02 に商品リンク 01 で踏んだ）。**最初から罠を持ち込まない。**
 *  ・スマホ（750px以下）では自動で縦に積む。設定を触らせない。
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody, Button, TextControl, RangeControl, ColorPalette, SelectControl,
} from '@wordpress/components';
import { fontOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const CLS = 'lw-pr-goodbad-1';

/** 全体に渡す CSS 変数（すべて単位つき。単位のない値はここに置かない） */
function blockVars( a ) {
	return {
		marginTop: `${ a.marginTop }px`,
		marginBottom: `${ a.marginBottom }px`,
		'--gb1-max-width': `${ a.maxWidth }px`,
		'--gb1-radius': `${ a.borderRadius }px`,
		'--gb1-border-w': `${ a.borderWidth }px`,
		'--gb1-size': `${ a.fontSize }px`,
		'--gb1-size-sp': `${ a.fontSizeSp }px`,
		'--gb1-title-size': `${ a.titleFontSize }px`,
	};
}

/** 空の行は出さない */
/* 中身のある行だけ残す。
   🚨 空文字だけでなく `<br>` や `&nbsp;` だけの行も落とす。
   RichText は消しきったつもりでも空タグが残ることがあり、素の trim() では拾えない
   （ランキング 01 の parts.js hasText() と同じ判定にそろえてある）。 */
const clean = ( list ) => ( list || [] ).filter(
	( s ) => String( s || '' ).replace( /<[^>]*>/g, '' ).replace( /&nbsp;| /g, ' ' ).trim() !== ''
);

registerBlockType( metadata.name, {
	...metadata,

	edit: ( { attributes, setAttributes } ) => {
		const {
			goodTitle, badTitle, goodItems, badItems, goodMark, badMark, layout,
			goodBgColor, goodBorderColor, goodTitleColor,
			badBgColor, badBorderColor, badTitleColor, textColor, FontSet,
		} = attributes;

		const setRow = ( key, i, v ) => {
			const list = ( attributes[ key ] || [] ).slice();
			list[ i ] = v;
			setAttributes( { [ key ]: list } );
		};
		const addRow = ( key ) => setAttributes( { [ key ]: [ ...( attributes[ key ] || [] ), '' ] } );
		const delRow = ( key, i ) => setAttributes( { [ key ]: ( attributes[ key ] || [] ).filter( ( _, k ) => k !== i ) } );

		const blockProps = useBlockProps( { className: `${ CLS } is-${ layout }`, style: blockVars( attributes ) } );

		const column = ( kind, title, titleKey, items, key, mark, bg, border, titleColor ) => (
			<div className={ `${ CLS }__col is-${ kind }` } style={ { backgroundColor: bg, borderColor: border } }>
				<RichText
					tagName="p"
					className={ `${ CLS }__title` }
					value={ title }
					onChange={ ( v ) => setAttributes( { [ titleKey ]: v } ) }
					style={ { color: titleColor } }
					data-lw_font_set={ FontSet }
				/>
				<ul className={ `${ CLS }__list` }>
					{ ( items || [] ).map( ( row, i ) => (
						<li key={ i }>
							<span className={ `${ CLS }__mark` } style={ { color: titleColor } }>{ mark }</span>
							<RichText
								tagName="span"
								className={ `${ CLS }__text` }
								value={ row }
								onChange={ ( v ) => setRow( key, i, v ) }
								placeholder="1行ずつ書いてください"
								style={ { color: textColor } }
							/>
							<Button
								className={ `${ CLS }__ed-del` }
								isDestructive
								variant="tertiary"
								onClick={ () => delRow( key, i ) }
							>
								×
							</Button>
						</li>
					) ) }
				</ul>
				<Button variant="secondary" className={ `${ CLS }__ed-add` } onClick={ () => addRow( key ) }>＋ 行を追加</Button>
			</div>
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="表示の設定" initialOpen={ true }>
						<SelectControl
							label="並べ方（PC）"
							help="スマホでは自動で縦に積みます。"
							value={ layout }
							options={ [
								{ label: '左右に並べる', value: 'side' },
								{ label: '上下に積む', value: 'stack' },
							] }
							onChange={ ( v ) => setAttributes( { layout: v } ) }
						/>
						<TextControl label="良い点の印" value={ goodMark } onChange={ ( v ) => setAttributes( { goodMark: v } ) } />
						<TextControl label="気になる点の印" value={ badMark } onChange={ ( v ) => setAttributes( { badMark: v } ) } />
					</PanelBody>
					<PanelBody title="大きさ・余白" initialOpen={ false }>
						<RangeControl label="全体の最大幅" min={ 320 } max={ 1200 } value={ attributes.maxWidth }
							onChange={ ( v ) => setAttributes( { maxWidth: v } ) } />
						<RangeControl label="文字の大きさ（PC）" min={ 11 } max={ 22 } value={ attributes.fontSize }
							onChange={ ( v ) => setAttributes( { fontSize: v } ) } />
						<RangeControl label="文字の大きさ（スマホ）" min={ 11 } max={ 20 } value={ attributes.fontSizeSp }
							onChange={ ( v ) => setAttributes( { fontSizeSp: v } ) } />
						<RangeControl label="見出しの大きさ" min={ 12 } max={ 28 } value={ attributes.titleFontSize }
							onChange={ ( v ) => setAttributes( { titleFontSize: v } ) } />
						<RangeControl label="角の丸み" min={ 0 } max={ 30 } value={ attributes.borderRadius }
							onChange={ ( v ) => setAttributes( { borderRadius: v } ) } />
						<RangeControl label="枠の太さ" min={ 0 } max={ 4 } value={ attributes.borderWidth }
							onChange={ ( v ) => setAttributes( { borderWidth: v } ) } />
						<RangeControl label="上の余白" min={ 0 } max={ 120 } value={ attributes.marginTop }
							onChange={ ( v ) => setAttributes( { marginTop: v } ) } />
						<RangeControl label="下の余白" min={ 0 } max={ 120 } value={ attributes.marginBottom }
							onChange={ ( v ) => setAttributes( { marginBottom: v } ) } />
					</PanelBody>
					<PanelBody title="色" initialOpen={ false }>
						<p>良い点の背景</p>
						<ColorPalette value={ goodBgColor } onChange={ ( v ) => setAttributes( { goodBgColor: v || '#f2f8f4' } ) } />
						<p>良い点の枠</p>
						<ColorPalette value={ goodBorderColor } onChange={ ( v ) => setAttributes( { goodBorderColor: v || '#cfe4d6' } ) } />
						<p>良い点の見出し</p>
						<ColorPalette value={ goodTitleColor } onChange={ ( v ) => setAttributes( { goodTitleColor: v || '#1f7a4d' } ) } />
						<p>気になる点の背景</p>
						<ColorPalette value={ badBgColor } onChange={ ( v ) => setAttributes( { badBgColor: v || '#fbf5f4' } ) } />
						<p>気になる点の枠</p>
						<ColorPalette value={ badBorderColor } onChange={ ( v ) => setAttributes( { badBorderColor: v || '#e8d5d2' } ) } />
						<p>気になる点の見出し</p>
						<ColorPalette value={ badTitleColor } onChange={ ( v ) => setAttributes( { badTitleColor: v || '#9c5a5a' } ) } />
						<p>本文の色</p>
						<ColorPalette value={ textColor } onChange={ ( v ) => setAttributes( { textColor: v || '#444444' } ) } />
					</PanelBody>
					<PanelBody title="フォント" initialOpen={ false }>
						<SelectControl label="フォント" value={ FontSet } options={ fontOptionsArr() }
							onChange={ ( v ) => setAttributes( { FontSet: v } ) } />
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					<div className={ `${ CLS }__cols` }>
						{ column( 'good', goodTitle, 'goodTitle', goodItems, 'goodItems', goodMark, goodBgColor, goodBorderColor, goodTitleColor ) }
						{ column( 'bad', badTitle, 'badTitle', badItems, 'badItems', badMark, badBgColor, badBorderColor, badTitleColor ) }
					</div>
				</div>
			</>
		);
	},

	save: ( { attributes } ) => {
		const {
			goodTitle, badTitle, goodItems, badItems, goodMark, badMark, layout,
			goodBgColor, goodBorderColor, goodTitleColor,
			badBgColor, badBorderColor, badTitleColor, textColor, FontSet,
		} = attributes;

		const blockProps = useBlockProps.save( { className: `${ CLS } is-${ layout }`, style: blockVars( attributes ) } );

		const column = ( kind, title, items, mark, bg, border, titleColor ) => (
			<div className={ `${ CLS }__col is-${ kind }` } style={ { backgroundColor: bg, borderColor: border } }>
				<RichText.Content
					tagName="p"
					className={ `${ CLS }__title` }
					value={ title }
					style={ { color: titleColor } }
					data-lw_font_set={ FontSet }
				/>
				<ul className={ `${ CLS }__list` }>
					{ clean( items ).map( ( row, i ) => (
						<li key={ i }>
							<span className={ `${ CLS }__mark` } style={ { color: titleColor } }>{ mark }</span>
							<RichText.Content tagName="span" className={ `${ CLS }__text` } value={ row } style={ { color: textColor } } />
						</li>
					) ) }
				</ul>
			</div>
		);

		return (
			<div { ...blockProps }>
				<div className={ `${ CLS }__cols` }>
					{ column( 'good', goodTitle, goodItems, goodMark, goodBgColor, goodBorderColor, goodTitleColor ) }
					{ column( 'bad', badTitle, badItems, badMark, badBgColor, badBorderColor, badTitleColor ) }
				</div>
			</div>
		);
	},
} );
