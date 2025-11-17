import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	Button,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import {
	fontOptionsArr,
	fontWeightOptionsArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';

/* ─────────────────────────  定数  ───────────────────────── */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const sizeOptions = [
	{ label: 'L サイズ', value: 'size_l' },
	{ label: 'M サイズ', value: 'size_m' },
	{ label: 'S サイズ', value: 'size_s' },
];
const colOptions = [
	{ label: '1カラム', value: 'clm_1' },
	{ label: '2カラム', value: 'clm_2' },
];

/* ─────────────────────────  ブロック登録  ───────────────────────── */
registerBlockType( 'wdl/lw-list-4', {
	title   : 'list 04',
	icon    : 'lightbulb',
	category: 'liteword-other',
	supports: { anchor: true },

	attributes: {
		/* 文字周り */
		fontLi       : { type: 'string',  default: '' },
		fontWeightLi : { type: 'string',  default: '' },
		sizeLi       : { type: 'string',  default: 'size_m' },
		textColor    : { type: 'string',  default: '' },

		/* アイコン */
		colorLiSvg   : { type: 'string',  default: 'var(--color-main)' },
		iconUrl      : { type: 'string',  default: '' },
		iconSize     : { type: 'number',  default: 1.2 },

		/* 枠線・レイアウト */
		borderColor  : { type: 'string',  default: 'var(--color-main)' },
		borderWidth  : { type: 'number',  default: 2 },
		borderStyle  : { type: 'string',  default: 'solid' },
		borderRadius : { type: 'number',  default: 0.5 },
		maxWidth     : { type: 'number',  default: 800 },
		bgColor      : { type: 'string',  default: '#fff' },
		colClass     : { type: 'string',  default: 'clm_1' },
		noBorder     : { type: 'boolean', default: false },

		/* コンテンツ */
		contents: {
			type: 'array',
			source: 'query',
			selector: '.lw-list-4__li',
			query: {
				text: {
					type: 'string',
					source: 'html',
					selector: '.lw-list-4__text p',
				},
			},
			default: [
				{ text: 'リストテキストリストテキスト ' },
				{ text: 'リストテキストリストテキスト ' },
				{ text: 'リストテキストリストテキスト ' },
				{ text: 'リストテキストリストテキスト ' },
			],
		},
	},

	/* ────────────────────  エディタ側  ──────────────────── */
	edit( { attributes, setAttributes } ) {
		const {
			fontLi, fontWeightLi, sizeLi, textColor,
			colorLiSvg, iconUrl, iconSize,
			borderColor, borderWidth, borderStyle,
			borderRadius, maxWidth, bgColor, colClass,
			noBorder,
			contents,
		} = attributes;

		/* 行操作 */
		const addContent    = () => setAttributes( { contents: [ ...contents, { text: '新しいテキスト' } ] } );
		const removeContent = ( i ) => setAttributes( { contents: contents.filter( ( _, idx ) => idx !== i ) } );
		const updateContent = ( i, key, val ) => {
			const updated      = [ ...contents ];
			updated[ i ][ key] = val;
			setAttributes( { contents: updated } );
		};

		/* 順番入れ替え関数 */
		const moveItem = (index, direction) => {
			const targetIndex = index + direction;
			if (targetIndex < 0 || targetIndex >= contents.length) return;
			
			const reordered = [...contents];
			const [moved] = reordered.splice(index, 1);
			reordered.splice(targetIndex, 0, moved);
			
			setAttributes({ contents: reordered });
		};

		/* スタイルオブジェクト */
		const innerStyle = {
			borderColor,
			borderWidth : `${ borderWidth }px`,
			borderStyle,
			borderRadius: `${ borderRadius }em`,
			maxWidth    : `${ maxWidth }px`,
			backgroundColor: bgColor || undefined,
		};
		const iconSpanStyle = { width: `${ iconSize }em` };
        const textSpanStyle = { width: `calc(100% - ${ iconSize }em)` };
		const textStyle     = {
			color: textColor || undefined,
			fontWeight: fontWeightLi || undefined,
		};

		/* SVG コード（colorLiSvg を直接適用） */
		const SvgIcon = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 448 512"
				style={ { fill: colorLiSvg } }
			>
				<path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
			</svg>
		);

		return (
			<Fragment>
				<InspectorControls>

					{/* ─ アイコン設定 ─ */}
					<PanelBody title="アイコン設定" initialOpen={ true }>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { iconUrl: media.url } ) }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div>
									<Button className="components-button is-primary" onClick={ open }>
										{ iconUrl ? 'アイコンを変更' : 'アイコンをアップロード' }
									</Button>
									{ iconUrl && (
										<Button
											isLink
											isDestructive
											onClick={ () => setAttributes( { iconUrl: '' } ) }
											style={ { marginLeft: '8px' } }
										>
											削除
										</Button>
									) }
								</div>
							) }
						/>
						{ iconUrl && (
							<p style={ { marginTop: '12px' } }>
								<img src={ iconUrl } style={ { maxWidth: '100%' } } />
							</p>
						) }
                        <hr />
						<RangeControl
							label="アイコン幅 (em)"
							value={ iconSize }
							onChange={ ( v ) => setAttributes( { iconSize: v } ) }
							min={ 0.5 }
							max={ 5 }
							step={ 0.1 }
						/>

						{/* SVG 用カラーは画像未選択時のみ表示 */}
						{ !iconUrl && (
							<ColorPalette
								label="アイコン色 (SVG 用)"
								value={ colorLiSvg }
								onChange={ ( c ) => setAttributes( { colorLiSvg: c } ) }
							/>
						) }
					</PanelBody>
                    <PanelBody title="テキスト" initialOpen={ true }>
                        <SelectControl
							label="文字サイズ"
							value={ sizeLi }
							options={ sizeOptions }
							onChange={ ( v ) => setAttributes( { sizeLi: v } ) }
						/>

						<SelectControl
							label="フォントの種類"
							value={ fontLi }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontLi: v } ) }
						/>

						<SelectControl
							label="フォントの太さ"
							value={ fontWeightLi }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightLi: v } ) }
						/>

						<ColorPalette
							label="文字色"
							value={ textColor }
							onChange={ ( c ) => setAttributes( { textColor: c } ) }
						/>

						<hr />


                    </PanelBody>
					{/* ─ レイアウト設定 ─ */}
					<PanelBody title="レイアウト設定" initialOpen={ true }>
						<RangeControl
							label="max-width (px)"
							value={ maxWidth }
							onChange={ ( v ) => setAttributes( { maxWidth: v } ) }
							min={ 200 }
							max={ 2000 }
							step={ 10 }
						/>
						<SelectControl
							label="カラム数"
							value={ colClass }
							options={ colOptions }
							onChange={ ( v ) => setAttributes( { colClass: v } ) }
						/>
						<p>背景色</p>
						<ColorPalette
							label="背景色"
							value={ bgColor }
							onChange={ ( c ) => setAttributes( { bgColor: c } ) }
						/>
						<p>枠線設定</p>
					
						<ColorPalette
							label="枠線色"
							value={ borderColor }
							onChange={ ( c ) => setAttributes( { borderColor: c } ) }
						/>

						<RangeControl
							label="枠線太さ (px)"
							value={ borderWidth }
							onChange={ ( v ) => setAttributes( { borderWidth: v } ) }
							min={ 1 }
							max={ 10 }
						/>

						<SelectControl
							label="枠線種類"
							value={ borderStyle }
							options={ [
								{ label: 'solid',  value: 'solid'  },
								{ label: 'dashed', value: 'dashed' },
								{ label: 'dotted', value: 'dotted' },
								{ label: 'double', value: 'double' },
							] }
							onChange={ ( v ) => setAttributes( { borderStyle: v } ) }
						/>

						<RangeControl
							label="角丸 (em)"
							value={ borderRadius }
							onChange={ ( v ) => setAttributes( { borderRadius: v } ) }
							min={ 0 }
							max={ 5 }
							step={ 0.1 }
						/>

						{/* 枠あり／なしトグル */}
						<ToggleControl
							label="枠あり / 枠無し"
							checked={ noBorder }
							onChange={ ( v ) => setAttributes( { noBorder: v } ) }
							help={ noBorder ? '現在：枠無し' : '現在：枠あり' }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ─ プレビュー ─ */}
				<div className="lw-list-4">
					<ul
						className={ `lw-list-4__inner ${ colClass } ${ noBorder ? 'none_border' : '' }` }
						style={ innerStyle }
					>
						{ contents.map( ( content, index ) => (
							<li className={ `lw-list-4__li ${ sizeLi }` } key={ index } style={ { position: 'relative' } }>
								<span className="icon" style={ iconSpanStyle }>
									{ iconUrl ? <img src={ iconUrl } /> : SvgIcon }
								</span>

								<span className="lw-list-4__text">
									<RichText
										tagName="p"
										value={ content.text }
										data-lw_font_set={ fontLi }
										onChange={ ( v ) => updateContent( index, 'text', v ) }
										placeholder="テキストを入力"
										style={ { ...textStyle, ...textSpanStyle } }
									/>
								</span>

								{/* 並べ替え & 削除コントロール */}
								<div className="lw-table-item-controls">
									<button
										type="button"
										onClick={() => moveItem(index, -1)}
										disabled={index === 0}
										className="move-up-button"
										aria-label="上へ移動"
									>
										↑
									</button>
									<button
										type="button"
										onClick={() => moveItem(index, 1)}
										disabled={index === contents.length - 1}
										className="move-down-button"
										aria-label="下へ移動"
									>
										↓
									</button>
									<button
										type="button"
										className="remove-item-button"
										onClick={ () => removeContent( index ) }
										aria-label="削除"
									>
										削除
									</button>
								</div>
							</li>
						) ) }
					</ul>

					<button className="lw-list-4__add_btn" onClick={ addContent }>
						リストを追加する
					</button>
				</div>
			</Fragment>
		);
	},

	/* ────────────────────  保存  ──────────────────── */
	save( { attributes } ) {
		const {
			fontLi, fontWeightLi, sizeLi, textColor,
			colorLiSvg, iconUrl, iconSize,
			borderColor, borderWidth, borderStyle,
			borderRadius, maxWidth, bgColor, colClass,
			noBorder,
			contents,
		} = attributes;

		const innerStyle = {
			borderColor,
			borderWidth : `${ borderWidth }px`,
			borderStyle,
			borderRadius: `${ borderRadius }em`,
			maxWidth    : `${ maxWidth }px`,
			backgroundColor: bgColor || undefined,
		};
		const iconSpanStyle = { width: `${ iconSize }em` };
        const textSpanStyle = { width: `calc(100% - ${ iconSize }em)` };
		const textStyle     = {
			color: textColor || undefined,
			fontWeight: fontWeightLi || undefined,
		};

		const SvgIconSave = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 448 512"
				style={ { fill: colorLiSvg } }
			>
				<path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
			</svg>
		);

		return (
			<div className="lw-list-4">
				<ul
					className={ `lw-list-4__inner ${ colClass } ${ noBorder ? 'none_border' : '' }` }
					style={ innerStyle }
				>
					{ contents.map( ( content, index ) => (
						<li className={ `lw-list-4__li ${ sizeLi }` } key={ index }>
							<span className="icon" style={ iconSpanStyle }>
								{ iconUrl ? <img src={ iconUrl } /> : SvgIconSave }
							</span>

							<span className="lw-list-4__text">
								<RichText.Content
									tagName="p"
									value={ content.text }
									data-lw_font_set={ fontLi }
									style={ { ...textStyle, ...textSpanStyle } }
								/>
							</span>
						</li>
					) ) }
				</ul>
			</div>
		);
	},
} );