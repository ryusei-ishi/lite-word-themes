import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	Button,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment, createElement } from '@wordpress/element';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

/* --------------------------------------------------
 * 共通オプション
 * -------------------------------------------------- */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const sizeOptions = [
	{ label: '大 (L)', value: 'font_size_l' },
	{ label: '中 (M)', value: 'font_size_m' },
	{ label: '小 (S)', value: 'font_size_s' },
];
const columnOptions = [
	{ label: '2カラム', value: 'clm_2' },
	{ label: '3カラム', value: 'clm_3' },
	{ label: '4カラム', value: 'clm_4' },
];
const alignOptions = [
	{ label: '左寄せ',   value: 'left'   },
	{ label: '中央寄せ', value: 'center' },
];

/* --------------------------------------------------
 * ブロック登録
 * -------------------------------------------------- */
registerBlockType( 'wdl/lw-content-8', {
	title   : 'Content 08',
	icon    : 'lightbulb',
	category: 'liteword-other',
	supports: { anchor: true },

	/* ---------- 属性 ---------- */
	attributes: {
		/* タイトル共通 */
		fontLi             : { type: 'string', default: '' },
		fontColorLi        : { type: 'string', default: '' },
		fontWeightLi       : { type: 'string', default: '600' },
		titleFontSizeClass : { type: 'string', default: 'font_size_m' },

		/* 説明文共通 */
		fontLiP            : { type: 'string', default: '' },
		fontColorLiP       : { type: 'string', default: 'var(--color-black)' },
		fontWeightLiP      : { type: 'string', default: '400' },
		textFontSizeClass  : { type: 'string', default: 'font_size_m' },

		/* タイトル装飾 */
		titleTag           : { type: 'string', default: 'h3' },
		titleBorderColor   : { type: 'string', default: 'var(--color-main)' },
		titleBorderSize    : { type: 'number', default: 2 },

		/* li 枠線 */
		liBorderColor      : { type: 'string', default: 'var(--color-main)' },
		liBorderSize       : { type: 'number', default: 2 },

		/* li 余白 & 角丸 */
		liPaddingTop       : { type: 'number', default: 24 },
		liPaddingBottom    : { type: 'number', default: 24 },
		liPaddingLeft      : { type: 'number', default: 24 },
		liPaddingRight     : { type: 'number', default: 24 },
		liBorderRadius     : { type: 'number', default: 8 },

		/* sub 枠線・色・表示可否 */
		subBorderColor     : { type: 'string', default: 'var(--color-main)' },
		subBorderSize      : { type: 'number', default: 1 },
		subFontColor       : { type: 'string', default: 'var(--color-main)' },
		subBgColor         : { type: 'string', default: '#ffffff' },
		showSub            : { type: 'boolean', default: true },

		/* sub / main フォント */
		fontLiSub          : { type: 'string', default: '' },
		fontWeightLiSub    : { type: 'string', default: '600' },
		fontLiMain         : { type: 'string', default: '' },
		fontWeightLiMain   : { type: 'string', default: '700' },

		/* カラム数 */
		columnClass        : { type: 'string', default: 'clm_3' },

		/* メインタイトル位置 */
		mainAlign          : { type: 'string', default: 'left' },

		/* ul 最大幅 */
		innerMaxWidth      : { type: 'number', default: 1200 },

		/* ボタンスタイル */
		btnMarginTop       : { type: 'number', default: 16 },
		btnHeight          : { type: 'number', default: 56 },
		btnBgColor         : { type: 'string', default: 'var(--color-main)' },
		btnFontColor       : { type: 'string', default: '#ffffff' },
		btnFontSize        : { type: 'number', default: 15 },
		btnBorderRadius    : { type: 'number', default: 2 },
		btnBorderColor     : { type: 'string', default: 'var(--color-main)' },
		btnBorderSize      : { type: 'number', default: 0 },
		showButton         : { type: 'boolean', default: true },

		/* リスト */
		contents: {
			type    : 'array',
			source  : 'query',
			selector: '.lw-content-8__li',
			query   : {
				sub:  { type: 'string', source: 'html', selector: '.ttl .sub' },
				main: { type: 'string', source: 'html', selector: '.ttl .main' },
				text: { type: 'string', source: 'html', selector: '.lw-content-8__text' },
				url:  {
					type     : 'string',
					source   : 'attribute',
					selector : '.link',
					attribute: 'href',
					default  : '',
				},
				btnText: {
					type    : 'string',
					source  : 'html',
					selector: '.btn',
					default : '詳細はこちら',
				},
			},
			default: [
				{
					sub    : 'サブタイトル',
					main   : 'タイトルタイトル',
					text   : '説明文を入力してください。説明文を入力してください。説明文を入力してください。説明文を入力してください。説明文を入力してください。',
					url    : '#',
					btnText: '詳細はこちら',
				},
				{
					sub    : 'サブタイトル',
					main   : 'タイトルタイトル',
					text   : '説明文を入力してください。説明文を入力してください。説明文を入力してください。説明文を入力してください。説明文を入力してください。',
					url    : '#',
					btnText: '詳細はこちら',
				},
				{
					sub    : 'サブタイトル',
					main   : 'タイトルタイトル',
					text   : '説明文を入力してください。説明文を入力してください。説明文を入力してください。説明文を入力してください。説明文を入力してください。',
					url    : '#',
					btnText: '詳細はこちら',
				},
			],
		},
	},

	/* ---------- エディタ ---------- */
	edit( { attributes, setAttributes } ) {
		const {
			fontLi, fontColorLi, fontWeightLi, titleFontSizeClass,
			fontLiP, fontColorLiP, fontWeightLiP, textFontSizeClass,
			titleTag, titleBorderColor, titleBorderSize,
			liBorderColor, liBorderSize,
			liPaddingTop, liPaddingBottom, liPaddingLeft, liPaddingRight, liBorderRadius,
			subBorderColor, subBorderSize, subFontColor, subBgColor, showSub,
			fontLiSub, fontWeightLiSub,
			fontLiMain, fontWeightLiMain,
			columnClass, mainAlign, innerMaxWidth,
			btnMarginTop, btnHeight,
			btnBgColor, btnFontColor, btnFontSize, btnBorderRadius,
			btnBorderColor, btnBorderSize, showButton,
			contents,
		} = attributes;

		/* リスト操作関数 */
		const addContent = () =>
			setAttributes( { contents: [ ...contents, { sub: '', main: '', text: '', url: '', btnText: '詳細はこちら' } ] } );
		const removeContent = ( index ) =>
			setAttributes( { contents: contents.filter( ( _, i ) => i !== index ) } );
		const updateContent = ( index, key, value ) => {
			const list = [ ...contents ];
			list[ index ][ key ] = value;
			setAttributes( { contents: list } );
		};

		return (
			<Fragment>
				<InspectorControls>
					{/* ▼ 基本スタイル */}
					<PanelBody title="スタイルの調整" initialOpen={ true }>
						<SelectControl
							label="カラム数"
							value={ columnClass }
							options={ columnOptions }
							onChange={ ( v ) => setAttributes( { columnClass: v } ) }
						/>
						<RangeControl
							label="ブロック最大幅 (px)"
							value={ innerMaxWidth }
							onChange={ ( v ) => setAttributes( { innerMaxWidth: v } ) }
							min={ 800 }
							max={ 2000 }
						/>
                        <p>枠線の色</p>
						<ColorPalette
							value={ liBorderColor }
							onChange={ ( v ) => setAttributes( { liBorderColor: v } ) }
						/>
						<RangeControl
							label="リスト枠線の太さ"
							value={ liBorderSize }
							onChange={ ( v ) => setAttributes( { liBorderSize: v } ) }
							min={ 0 }
							max={ 10 }
						/>
						<hr />
                        <RangeControl
							label="上余白 (px)"
							value={ liPaddingTop }
							onChange={ ( v ) => setAttributes( { liPaddingTop: v } ) }
							min={ 0 }
							max={ 100 }
						/>
						<RangeControl
							label="下余白 (px)"
							value={ liPaddingBottom }
							onChange={ ( v ) => setAttributes( { liPaddingBottom: v } ) }
							min={ 0 }
							max={ 100 }
						/>
						<RangeControl
							label="左余白 (px)"
							value={ liPaddingLeft }
							onChange={ ( v ) => setAttributes( { liPaddingLeft: v } ) }
							min={ 0 }
							max={ 100 }
						/>
						<RangeControl
							label="右余白 (px)"
							value={ liPaddingRight }
							onChange={ ( v ) => setAttributes( { liPaddingRight: v } ) }
							min={ 0 }
							max={ 100 }
						/>
						<RangeControl
							label="角丸 (px)"
							value={ liBorderRadius }
							onChange={ ( v ) => setAttributes( { liBorderRadius: v } ) }
							min={ 0 }
							max={ 100 }
						/>
                    </PanelBody>
                    <PanelBody title="メインタイトル部分" initialOpen={ false }>
						<SelectControl
							label="タイトルタグ"
							value={ titleTag }
							options={ [
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'p',  value: 'p'  },
							] }
							onChange={ ( v ) => setAttributes( { titleTag: v } ) }
						/>
                        <SelectControl
							label="メインタイトル位置"
							value={ mainAlign }
							options={ alignOptions }
							onChange={ ( v ) => setAttributes( { mainAlign: v } ) }
						/>
						<p>タイトル文字色</p>
						<ColorPalette
							value={ fontColorLi }
							onChange={ ( v ) => setAttributes( { fontColorLi: v } ) }
						/>
						<SelectControl
							label="メインタイトルフォント"
							value={ fontLiMain }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontLiMain: v } ) }
						/>
						<SelectControl
							label="メインタイトル太さ"
							value={ fontWeightLiMain }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightLiMain: v } ) }
						/>
						<SelectControl
							label="タイトルフォントサイズ"
							value={ titleFontSizeClass }
							options={ sizeOptions }
							onChange={ ( v ) => setAttributes( { titleFontSizeClass: v } ) }
						/>
						<p>タイトル下線の色</p>
						<ColorPalette
							value={ titleBorderColor }
							onChange={ ( v ) => setAttributes( { titleBorderColor: v } ) }
						/>
						<RangeControl
							label="タイトル下線の太さ"
							value={ titleBorderSize }
							onChange={ ( v ) => setAttributes( { titleBorderSize: v } ) }
							min={ 0 }
							max={ 10 }
						/>

						<hr />

					</PanelBody>

	
					{/* ▼ サブタイトル設定 */}
					<PanelBody title="サブタイトル部分" initialOpen={ false }>
						<ToggleControl
							label="サブタイトルを表示"
							checked={ showSub }
							onChange={ ( v ) => setAttributes( { showSub: v } ) }
						/>
						<p>サブタイトル枠線の色</p>
						<ColorPalette
							value={ subBorderColor }
							onChange={ ( v ) => setAttributes( { subBorderColor: v } ) }
						/>
						<RangeControl
							label="サブタイトル枠線の太さ"
							value={ subBorderSize }
							onChange={ ( v ) => setAttributes( { subBorderSize: v } ) }
							min={ 0 }
							max={ 10 }
						/>
						<p>サブタイトル文字色</p>
						<ColorPalette
							value={ subFontColor }
							onChange={ ( v ) => setAttributes( { subFontColor: v } ) }
						/>
						<p>サブタイトル背景色</p>
						<ColorPalette
							value={ subBgColor }
							onChange={ ( v ) => setAttributes( { subBgColor: v } ) }
						/>
                        <SelectControl
							label="サブタイトルフォント"
							value={ fontLiSub }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontLiSub: v } ) }
						/>
						<SelectControl
							label="サブタイトル太さ"
							value={ fontWeightLiSub }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightLiSub: v } ) }
						/>
					</PanelBody>

					{/* ▼ 説明部分 */}
					<PanelBody title="説明部分" initialOpen={ false }>

						<p>説明文文字色</p>
						<ColorPalette
							value={ fontColorLiP }
							onChange={ ( v ) => setAttributes( { fontColorLiP: v } ) }
						/>
						<SelectControl
							label="説明文フォント"
							value={ fontLiP }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontLiP: v } ) }
						/>
						<SelectControl
							label="説明文太さ"
							value={ fontWeightLiP }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightLiP: v } ) }
						/>
						<SelectControl
							label="説明文フォントサイズ"
							value={ textFontSizeClass }
							options={ sizeOptions }
							onChange={ ( v ) => setAttributes( { textFontSizeClass: v } ) }
						/>
					</PanelBody>

					{/* ▼ ボタン設定 */}
					<PanelBody title="ボタン設定" initialOpen={ false }>
						<ToggleControl
							label="ボタンを表示"
							checked={ showButton }
							onChange={ ( v ) => setAttributes( { showButton: v } ) }
						/>
						<RangeControl
							label="ボタン上余白 (px)"
							value={ btnMarginTop }
							onChange={ ( v ) => setAttributes( { btnMarginTop: v } ) }
							min={ 0 }
							max={ 50 }
						/>
						<RangeControl
							label="ボタン高さ (px)"
							value={ btnHeight }
							onChange={ ( v ) => setAttributes( { btnHeight: v } ) }
							min={ 30 }
							max={ 100 }
						/>
						<p>ボタン背景色</p>
						<ColorPalette
							value={ btnBgColor }
							onChange={ ( v ) => setAttributes( { btnBgColor: v } ) }
						/>
						<p>ボタン文字色</p>
						<ColorPalette
							value={ btnFontColor }
							onChange={ ( v ) => setAttributes( { btnFontColor: v } ) }
						/>
						<RangeControl
							label="ボタン文字サイズ (px)"
							value={ btnFontSize }
							onChange={ ( v ) => setAttributes( { btnFontSize: v } ) }
							min={ 10 }
							max={ 30 }
						/>
						<p>ボタン枠線の色</p>
						<ColorPalette
							value={ btnBorderColor }
							onChange={ ( v ) => setAttributes( { btnBorderColor: v } ) }
						/>
						<RangeControl
							label="ボタン枠線の太さ (px)"
							value={ btnBorderSize }
							onChange={ ( v ) => setAttributes( { btnBorderSize: v } ) }
							min={ 0 }
							max={ 10 }
						/>
						<RangeControl
							label="ボタン角丸 (px)"
							value={ btnBorderRadius }
							onChange={ ( v ) => setAttributes( { btnBorderRadius: v } ) }
							min={ 0 }
							max={ 30 }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ---------- プレビュー ---------- */}
				<div className="lw-content-8">
					<ul
						className={ `lw-content-8__inner ${ columnClass }` }
						style={ { maxWidth: `${ innerMaxWidth }px`, margin: '0 auto' } }
					>
						{ contents.map( ( item, idx ) => (
							<li
								key={ idx }
								className="lw-content-8__li"
								style={ {
									borderColor   : liBorderColor,
									borderWidth   : liBorderSize,
									borderStyle   : liBorderSize > 0 ? 'solid' : 'none',
									paddingTop    : `${ liPaddingTop }px`,
									paddingBottom : `${ liPaddingBottom }px`,
									paddingLeft   : `${ liPaddingLeft }px`,
									paddingRight  : `${ liPaddingRight }px`,
									borderRadius  : `${ liBorderRadius }px`,
								} }
							>
								{/* タイトル */}
								{ createElement(
									titleTag,
									{
										className          : `ttl ${ titleFontSizeClass }`,
										'data-lw_font_set' : fontLi,
										style: {
											fontWeight        : fontWeightLi,
											color             : fontColorLi,
											borderBottomColor : titleBorderColor,
											borderBottomWidth : titleBorderSize,
											borderBottomStyle : titleBorderSize > 0 ? 'solid' : 'none',
										},
									},
									<>
										{ showSub && (
											<RichText
												tagName="span"
												className="sub"
												value={ item.sub }
												onChange={ ( v ) => updateContent( idx, 'sub', v ) }
												placeholder="サブテキスト"
												data-lw_font_set={ fontLiSub }
												style={ {
													fontWeight     : fontWeightLiSub,
													borderColor    : subBorderColor,
													borderWidth    : subBorderSize,
													borderStyle    : subBorderSize > 0 ? 'solid' : 'none',
													display        : 'inline-block',
													color          : subFontColor,
													backgroundColor: subBgColor,
												} }
											/>
										) }
										<RichText
											tagName="span"
											className={ `main ${ mainAlign }` }
											value={ item.main }
											onChange={ ( v ) => updateContent( idx, 'main', v ) }
											placeholder="メインテキスト"
											data-lw_font_set={ fontLiMain }
											style={ { fontWeight: fontWeightLiMain } }
										/>
									</>
								) }

								{/* 説明文 */}
								<RichText
									tagName="p"
									className={ `lw-content-8__text ${ textFontSizeClass }` }
									value={ item.text }
									data-lw_font_set={ fontLiP }
									onChange={ ( v ) => updateContent( idx, 'text', v ) }
									placeholder="テキストを入力"
									style={ {
										fontWeight: fontWeightLiP,
										color     : fontColorLiP,
									} }
								/>

								{/* URL入力 */}
								<TextControl
									label="リンクURL"
									value={ item.url || '' }
									onChange={ ( v ) => updateContent( idx, 'url', v ) }
									placeholder="https://example.com/"
									style={ { marginTop: '12px', maxWidth: '300px' } }
								/>

								{/* ボタンテキスト入力（URLが入力されていてshowButtonがtrueの場合のみ表示） */}
								{ item.url && showButton && (
									<div 
										className="link_btn"
										style={ {
											marginTop      : `${ btnMarginTop }px`,
											padding        : '0 1em',
											height         : `${ btnHeight }px`,
											width          : '100%',
											display        : 'flex',
											alignItems     : 'center',
											justifyContent : 'center',
											background     : btnBgColor,
											color          : btnFontColor,
											fontSize       : `${ btnFontSize }px`,
											borderRadius   : `${ btnBorderRadius }px`,
											borderColor    : btnBorderColor,
											borderWidth    : `${ btnBorderSize }px`,
											borderStyle    : btnBorderSize > 0 ? 'solid' : 'none',
										} }
									>
										<RichText
											tagName="span"
											value={ item.btnText || '詳細はこちら' }
											onChange={ ( v ) => updateContent( idx, 'btnText', v ) }
											placeholder="詳細はこちら"
										/>
									</div>
								) }

								<Button
									className="lw-content-8__remove_btn"
									isDestructive
									onClick={ () => removeContent( idx ) }
									style={ { marginTop: '12px' } }
								>
									削除
								</Button>
							</li>
						) ) }
					</ul>

					<Button
						className="lw-content-8__add_btn"
						isSecondary
						onClick={ addContent }
					>
						リストを追加する
					</Button>
				</div>
			</Fragment>
		);
	},

	/* ---------- 保存 ---------- */
	save( { attributes } ) {
		const {
			fontLi, fontColorLi, fontWeightLi, titleFontSizeClass,
			fontLiP, fontColorLiP, fontWeightLiP, textFontSizeClass,
			titleTag, titleBorderColor, titleBorderSize,
			liBorderColor, liBorderSize,
			liPaddingTop, liPaddingBottom, liPaddingLeft, liPaddingRight, liBorderRadius,
			subBorderColor, subBorderSize, subFontColor, subBgColor, showSub,
			fontLiSub, fontWeightLiSub,
			fontLiMain, fontWeightLiMain,
			columnClass, mainAlign, innerMaxWidth,
			btnMarginTop, btnHeight,
			btnBgColor, btnFontColor, btnFontSize, btnBorderRadius,
			btnBorderColor, btnBorderSize, showButton,
			contents,
		} = attributes;

		return (
			<div className="lw-content-8">
				<ul
					className={ `lw-content-8__inner ${ columnClass }` }
					style={ { maxWidth: `${ innerMaxWidth }px`, margin: '0 auto' } }
				>
					{ contents.map( ( item, idx ) => {
						const LinkTag   = item.url ? 'a' : 'div';
						const linkProps = item.url
							? { href: item.url, className: 'link' }
							: { className: 'link' };

						return (
							<li
								key={ idx }
								className="lw-content-8__li"
								style={ {
									borderColor   : liBorderColor,
									borderWidth   : liBorderSize,
									borderStyle   : liBorderSize > 0 ? 'solid' : 'none',
									paddingTop    : `${ liPaddingTop }px`,
									paddingBottom : `${ liPaddingBottom }px`,
									paddingLeft   : `${ liPaddingLeft }px`,
									paddingRight  : `${ liPaddingRight }px`,
									borderRadius  : `${ liBorderRadius }px`,
								} }
							>
								{ createElement(
									LinkTag,
									linkProps,
									<>
										{/* タイトル */}
										{ createElement(
											titleTag,
											{
												className          : `ttl ${ titleFontSizeClass }`,
												'data-lw_font_set' : fontLi,
												style: {
													fontWeight        : fontWeightLi,
													color             : fontColorLi,
													borderBottomColor : titleBorderColor,
													borderBottomWidth : titleBorderSize,
													borderBottomStyle : titleBorderSize > 0 ? 'solid' : 'none',
												},
											},
											<>
												{ showSub && item.sub && (
													<span
														className="sub"
														dangerouslySetInnerHTML={ { __html: item.sub } }
														data-lw_font_set={ fontLiSub }
														style={ {
															fontWeight     : fontWeightLiSub,
															borderColor    : subBorderColor,
															borderWidth    : subBorderSize,
															borderStyle    : subBorderSize > 0 ? 'solid' : 'none',
															display        : 'inline-block',
															color          : subFontColor,
															backgroundColor: subBgColor,
														} }
													/>
												) }
												{ item.main && (
													<span
														className={ `main ${ mainAlign }` }
														dangerouslySetInnerHTML={ { __html: item.main } }
														data-lw_font_set={ fontLiMain }
														style={ { fontWeight: fontWeightLiMain } }
													/>
												) }
											</>
										) }

										{/* 説明文 */}
										<RichText.Content
											tagName="p"
											className={ `lw-content-8__text ${ textFontSizeClass }` }
											value={ item.text }
											data-lw_font_set={ fontLiP }
											style={ {
												fontWeight: fontWeightLiP,
												color     : fontColorLiP,
											} }
										/>

										{/* ボタン（URLが入力されていてshowButtonがtrueの場合のみ表示） */}
										{ item.url && showButton && (item.btnText || '詳細はこちら') && (
											<div
												className="link_btn"
												dangerouslySetInnerHTML={ { __html: item.btnText || '詳細はこちら' } }
												style={ {
													marginTop      : `${ btnMarginTop }px`,
													padding        : '0 1em',
													height         : `${ btnHeight }px`,
													width          : '100%',
													display        : 'flex',
													alignItems     : 'center',
													justifyContent : 'center',
													background     : btnBgColor,
													color          : btnFontColor,
													fontSize       : `${ btnFontSize }px`,
													borderRadius   : `${ btnBorderRadius }px`,
													borderColor    : btnBorderColor,
													borderWidth    : `${ btnBorderSize }px`,
													borderStyle    : btnBorderSize > 0 ? 'solid' : 'none',
												} }
											/>
										) }
									</>
								) }
							</li>
						);
					} ) }
				</ul>
			</div>
		);
	},
} );