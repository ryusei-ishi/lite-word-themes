/**
 * LiteWord – カスタムブロック「会社概要 02」
 * --------------------------------------------------
 * ✔ 同一ページに複数配置しても上書きされない
 * ✔ useBlockProps() 対応でエディター側の全幅崩れを解消
 * ✔ 既存機能・UI・クラス名・スタイルは一切変更なし
 * ✔ dt/ddのフォント設定機能追加
 * ✔ 統一サイドバーレイアウト対応
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import { 
	PanelBody, 
	RadioControl, 
	SelectControl,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* =========================================================
 * セレクトオプション
 * ======================================================= */
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* =========================================================
 * 1) デフォルト項目を"毎回"生成するユーティリティ
 *    → 参照共有を断ち切り、ブロック間上書きを防止
 * ======================================================= */
const createDefaultItems = () => ( [
	{
		dt: '会社名',
		dtPlaceholder: '会社名',
		dd: '株式会社〇〇不動産',
		ddPlaceholder: '内容',
	},
	{
		dt: '所在地',
		dtPlaceholder: '所在地',
		dd: '東京都〇〇区〇〇町1-1-1',
		ddPlaceholder: '内容',
	},
	{
		dt: '電話番号',
		dtPlaceholder: '電話番号',
		dd: '03-1234-5678',
		ddPlaceholder: '内容',
	},
	{
		dt: '設立',
		dtPlaceholder: '設立',
		dd: '2020年1月1日',
		ddPlaceholder: '内容',
	},
] );

/* =========================================================
 * 2) ブロック登録
 * ======================================================= */
registerBlockType( metadata.name, {
	/* =====================================================
	 * 3) Edit – エディター側レンダリング
	 * =================================================== */
	edit: ( { attributes, setAttributes } ) => {
		/* ★ props 展開（items は保険でデフォルト生成） */
		const {
			items = createDefaultItems(),
			maxWidth,
			fontSizeClass,
			dtWidthClass,
			lineHeight,
			spFullDt,
			dtBackgroundColor,
			dtTextColor,
			fontDt,
			fontWeightDt,
			ddTextColor,
			fontDd,
			fontWeightDd,
			borderColor,
		} = attributes;

		/* --------- ハンドラ --------- */
		const addItem = () => {
			const newItem = {
				dt: '新しい項目名',
				dtPlaceholder: '項目名',
				dd: '新しい内容',
				ddPlaceholder: '内容',
			};
			setAttributes( { items: [ ...items, newItem ] } );
		};

		const removeItem = ( index ) =>
			setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );

		const updateItem = ( index, key, value ) =>
			setAttributes( {
				items: items.map( ( item, i ) =>
					i === index ? { ...item, [ key ]: value } : item
				),
			} );

		const moveItem = ( index, direction ) => {
			const targetIndex = index + direction;
			if ( targetIndex < 0 || targetIndex >= items.length ) return;
			const reordered = [ ...items ];
			const [ moved ] = reordered.splice( index, 1 );
			reordered.splice( targetIndex, 0, moved );
			setAttributes( { items: reordered } );
		};

		/* useBlockProps() → wp-block クラス付与で幅制御 */
		const blockProps = useBlockProps( {
			className: `${fontSizeClass}`,
			style: { borderColor },
		} );

		/* --------- JSX --------- */
		return (
			<>
				{/* ---------- InspectorControls ---------- */}
				<InspectorControls>
					{/* ■ レイアウト設定 - 必ず最初に配置、デフォルトで開いた状態 */}
					<PanelBody title="レイアウト設定" initialOpen={true}>
						{/* 最大横幅 */}
						<RangeControl
							label="最大横幅"
							value={maxWidth}
							onChange={(value) => setAttributes({ maxWidth: value })}
							min={600}
							max={1600}
							step={20}
						/>
						{/* 項目名の幅 - dt要素の幅制御 */}
						<SelectControl
							label="項目名の幅"
							value={dtWidthClass}
							options={[
								{ label: '広い (L)', value: 'dt_width_l' },
								{ label: '中 (M)', value: 'dt_width_m' },
								{ label: '狭い (S)', value: 'dt_width_s' }
							]}
							onChange={(value) => setAttributes({ dtWidthClass: value })}
						/>
						<ToggleControl
							label="スマホ時に１カラムにする"
							checked={spFullDt}
							onChange={(value) => setAttributes({ spFullDt: value })}
						/>
						{/* フォントサイズ - 必ずRadioControlで3段階 */}
						<RadioControl
							label="フォントサイズ"
							selected={fontSizeClass}
							options={[
								{ label: '大 (L)', value: 'font_size_l' },
								{ label: '中 (M)', value: 'font_size_m' },
								{ label: '小 (S)', value: 'font_size_s' }
							]}
							onChange={(value) => setAttributes({ fontSizeClass: value })}
						/>
						
						{/* 行間 - 必要な場合のみ */}
						<RangeControl
							label="行間 (line-height)"
							value={lineHeight}
							onChange={(value) => setAttributes({ lineHeight: value })}
							min={0.8}
							max={3.0}
							step={0.1}
						/>
						<p>枠線の色</p>
						<ColorPalette
							value={borderColor}
							onChange={(color) => setAttributes({ borderColor: color })}
						/>
					</PanelBody>

					{/* ■ 項目名（dt）設定 - 閉じた状態 */}
					<PanelBody title="項目名のフォント・色など" initialOpen={false}>
						<p>背景色</p>
						<ColorPalette
							value={dtBackgroundColor}
							onChange={(color) => setAttributes({ dtBackgroundColor: color })}
						/>
						
						<p>文字色</p>
						<ColorPalette
							value={dtTextColor}
							onChange={(color) => setAttributes({ dtTextColor: color })}
						/>
						
						<SelectControl
							label="フォント"
							value={fontDt}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontDt: value })}
						/>
						
						<SelectControl
							label="フォントの太さ"
							value={fontWeightDt}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeightDt: value })}
						/>
					</PanelBody>

					{/* ■ 内容（dd）設定 - 閉じた状態 */}
					<PanelBody title="内容のフォント・色など" initialOpen={false}>
						<p>文字色</p>
						<ColorPalette
							value={ddTextColor}
							onChange={(color) => setAttributes({ ddTextColor: color })}
						/>
						
						<SelectControl
							label="フォント"
							value={fontDd}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontDd: value })}
						/>
						
						<SelectControl
							label="フォントの太さ"
							value={fontWeightDd}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeightDd: value })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* ---------- Editor Render ---------- */}
				<div { ...blockProps }>
					<dl
						className={`${spFullDt ? 'sp_clm_1' : ''}`}
						style={{ 
							borderColor,
							maxWidth: maxWidth,
							lineHeight: lineHeight
						}}
					>
						{ items.map( ( item, index ) => (
							<div
								key={ index }
								className={`company-profile-item ${fontSizeClass} ${dtWidthClass}`}
								style={ { borderColor } }
							>
								<RichText
									tagName="dt"
									value={ item.dt }
									onChange={ ( v ) => updateItem( index, 'dt', v ) }
									placeholder={ item.dtPlaceholder || '項目名を入力' }
									style={ {
										backgroundColor: dtBackgroundColor,
										color: dtTextColor,
										fontWeight: fontWeightDt,
										lineHeight : lineHeight,
									} }
									data-lw_font_set={ fontDt }
								/>
								<RichText
									tagName="dd"
									value={ item.dd }
									onChange={ ( v ) => updateItem( index, 'dd', v ) }
									placeholder={ item.ddPlaceholder || '内容を入力' }
									style={ {
										color: ddTextColor,
										fontWeight: fontWeightDd,
										lineHeight : lineHeight,
									} }
									data-lw_font_set={ fontDd }
								/>

								{/* 並べ替え & 削除 */}
								<div className="lw-table-item-controls">
									<button
										type="button"
										onClick={ () => moveItem( index, -1 ) }
										disabled={ index === 0 }
										className="move-up-button"
									>
										↑
									</button>
									<button
										type="button"
										onClick={ () => moveItem( index, 1 ) }
										disabled={ index === items.length - 1 }
										className="move-down-button"
									>
										↓
									</button>
									<button
										type="button"
										onClick={ () => removeItem( index ) }
										className="remove-item-button"
									>
										削除
									</button>
								</div>
							</div>
						) ) }
					</dl>

					<button
						type="button"
						onClick={ addItem }
						className="add-item-button"
						style={ { marginTop: 12 } }
					>
						項目を追加する
					</button>
				</div>
			</>
		);
	},

	/* =====================================================
	 * 4) Save – フロント側マークアップ
	 * =================================================== */
	save: ( { attributes } ) => {
		const {
			items,
			maxWidth,
			fontSizeClass,
			dtWidthClass,
			lineHeight,
			spFullDt,
			dtBackgroundColor,
			dtTextColor,
			fontDt,
			fontWeightDt,
			ddTextColor,
			fontDd,
			fontWeightDd,
			borderColor,
		} = attributes;

		/* wp-block クラス付与 */
		const blockProps = useBlockProps.save( {
			className: `${fontSizeClass}`,
			style: { borderColor },
		} );

		return (
			<div { ...blockProps }>
				<dl
					className={`${spFullDt ? 'sp_clm_1' : ''}`}
					style={{ 
						borderColor,
						maxWidth: maxWidth,
						lineHeight: lineHeight
					}}
				>
					{ items.map( ( item, index ) => (
						<div
							key={ index }
							className={`company-profile-item ${fontSizeClass} ${dtWidthClass}`}
							style={ { borderColor } }
						>
							<RichText.Content
								tagName="dt"
								value={ item.dt }
								style={ {
									backgroundColor: dtBackgroundColor,
									color: dtTextColor,
									fontWeight: fontWeightDt,
									lineHeight : lineHeight,
								} }
								data-lw_font_set={ fontDt }
							/>
							<RichText.Content
								tagName="dd"
								value={ item.dd }
								style={ {
									color: ddTextColor,
									fontWeight: fontWeightDd,
									lineHeight : lineHeight,
								} }
								data-lw_font_set={ fontDd }
							/>
						</div>
					) ) }
				</dl>
			</div>
		);
	},
} );