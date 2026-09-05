/**
 * 条件チェックリスト 01（wdl/lw-pr-compare-1）
 * ------------------------------------------------------------
 *  2つの分類（よくある条件／見落としやすい条件 など）を、
 *  上下2段・全幅の行カードで見せる。写真は使わない。
 *
 *  なぜこの形にしたか（2026-09-04）
 *  ・lw-pr-list-5/8（リスト+写真）が「よくある型でダサい」「文字が見にくくガタガタ」
 *    と指摘され、写真を使わない代わりのパターンとして新規に作った。
 *  ・左右2箱（lw-pr-goodbad-1と同じ絵）にすると、同じページ内に既にある
 *    goodbad-1 の見た目と重なってしまうため、あえて縦積み・全幅の行カードにした。
 *  ・項目を狭い列に割ると折り返しが増えて読みにくくなる（ガタガタに見える）ので、
 *    各項目は必ず全幅1本の行として描画する。左端に色付きバー+丸バッジを揃えることで、
 *    行ごとの折り返し行数が違っても左端は綺麗に揃う。
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody, Button, TextControl, RangeControl, ColorPalette,
} from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const CLS = 'lw-pr-compare-1';

/** 空の行は出さない（`<br>` だけの空タグも落とす） */
const clean = ( list ) => ( list || [] ).filter(
	( s ) => String( s || '' ).replace( /<[^>]*>/g, '' ).replace( /&nbsp;| /g, ' ' ).trim() !== ''
);

function blockVars( a ) {
	return {
		marginTop: `${ a.marginTop }px`,
		marginBottom: `${ a.marginBottom }px`,
		'--cmp1-max-width': `${ a.maxWidth }px`,
	};
}

registerBlockType( metadata.name, {
	...metadata,

	edit: ( { attributes, setAttributes } ) => {
		const {
			firstLabel, firstMark, firstItems, firstColor,
			secondLabel, secondMark, secondItems, secondColor,
			rowBgColor, textColor,
		} = attributes;

		const setRow = ( key, i, v ) => {
			const list = ( attributes[ key ] || [] ).slice();
			list[ i ] = v;
			setAttributes( { [ key ]: list } );
		};
		const addRow = ( key ) => setAttributes( { [ key ]: [ ...( attributes[ key ] || [] ), '' ] } );
		const delRow = ( key, i ) => setAttributes( { [ key ]: ( attributes[ key ] || [] ).filter( ( _, k ) => k !== i ) } );

		const blockProps = useBlockProps( { className: CLS, style: blockVars( attributes ) } );

		const tier = ( kind, label, labelKey, mark, markKey, items, key, color ) => (
			<div className={ `${ CLS }__tier is-${ kind }` }>
				<div className={ `${ CLS }__tier-head` }>
					<span className={ `${ CLS }__badge` } style={ { backgroundColor: color } }>
						<RichText
							tagName="span"
							value={ mark }
							onChange={ ( v ) => setAttributes( { [ markKey ]: v } ) }
						/>
					</span>
					<RichText
						tagName="p"
						className={ `${ CLS }__tier-title` }
						value={ label }
						onChange={ ( v ) => setAttributes( { [ labelKey ]: v } ) }
						style={ { color } }
					/>
				</div>
				<ul className={ `${ CLS }__rows` }>
					{ ( items || [] ).map( ( row, i ) => (
						<li
							key={ i }
							className={ `${ CLS }__row` }
							style={ { backgroundColor: rowBgColor, borderLeftColor: color } }
						>
							<RichText
								tagName="span"
								className={ `${ CLS }__row-text` }
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
						<TextControl label="1段目の見出し" value={ firstLabel } onChange={ ( v ) => setAttributes( { firstLabel: v } ) } />
						<TextControl label="2段目の見出し" value={ secondLabel } onChange={ ( v ) => setAttributes( { secondLabel: v } ) } />
					</PanelBody>
					<PanelBody title="大きさ・余白" initialOpen={ false }>
						<RangeControl label="全体の最大幅" min={ 480 } max={ 1200 } value={ attributes.maxWidth }
							onChange={ ( v ) => setAttributes( { maxWidth: v } ) } />
						<RangeControl label="上の余白" min={ 0 } max={ 120 } value={ attributes.marginTop }
							onChange={ ( v ) => setAttributes( { marginTop: v } ) } />
						<RangeControl label="下の余白" min={ 0 } max={ 120 } value={ attributes.marginBottom }
							onChange={ ( v ) => setAttributes( { marginBottom: v } ) } />
					</PanelBody>
					<PanelBody title="色" initialOpen={ false }>
						<p>1段目の色（バッジ・見出し・行の左線）</p>
						<ColorPalette value={ firstColor } onChange={ ( v ) => setAttributes( { firstColor: v || 'var(--color-main)' } ) } />
						<p>2段目の色（バッジ・見出し・行の左線）</p>
						<ColorPalette value={ secondColor } onChange={ ( v ) => setAttributes( { secondColor: v || '#7a2e3a' } ) } />
						<p>行の背景</p>
						<ColorPalette value={ rowBgColor } onChange={ ( v ) => setAttributes( { rowBgColor: v || '#faf7ef' } ) } />
						<p>本文の色</p>
						<ColorPalette value={ textColor } onChange={ ( v ) => setAttributes( { textColor: v || '#1f2733' } ) } />
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					{ tier( 'first', firstLabel, 'firstLabel', firstMark, 'firstMark', firstItems, 'firstItems', firstColor ) }
					{ tier( 'second', secondLabel, 'secondLabel', secondMark, 'secondMark', secondItems, 'secondItems', secondColor ) }
				</div>
			</>
		);
	},

	save: ( { attributes } ) => {
		const {
			firstLabel, firstMark, firstItems, firstColor,
			secondLabel, secondMark, secondItems, secondColor,
			rowBgColor, textColor,
		} = attributes;

		const blockProps = useBlockProps.save( { className: CLS, style: blockVars( attributes ) } );

		const tier = ( kind, label, mark, items, color ) => (
			<div className={ `${ CLS }__tier is-${ kind }` }>
				<div className={ `${ CLS }__tier-head` }>
					<span className={ `${ CLS }__badge` } style={ { backgroundColor: color } }>
						<RichText.Content tagName="span" value={ mark } />
					</span>
					<RichText.Content tagName="p" className={ `${ CLS }__tier-title` } value={ label } style={ { color } } />
				</div>
				<ul className={ `${ CLS }__rows` }>
					{ clean( items ).map( ( row, i ) => (
						<li key={ i } className={ `${ CLS }__row` } style={ { backgroundColor: rowBgColor, borderLeftColor: color } }>
							<RichText.Content tagName="span" className={ `${ CLS }__row-text` } value={ row } style={ { color: textColor } } />
						</li>
					) ) }
				</ul>
			</div>
		);

		return (
			<div { ...blockProps }>
				{ tier( 'first', firstLabel, firstMark, firstItems, firstColor ) }
				{ tier( 'second', secondLabel, secondMark, secondItems, secondColor ) }
			</div>
		);
	},
} );
