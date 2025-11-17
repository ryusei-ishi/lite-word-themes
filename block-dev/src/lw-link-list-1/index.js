/**
 * LiteWord – カスタムブロック「link list 01」
 * --------------------------------------------------
 * ✔ スマホ列数（BtnClmSp）対応
 * ✔ タイトル用／背景用トグルを「非表示 / 表示」に統一 ★今回修正
 * ✔ トグル ON（チェックあり）で要素が表示、OFF で非表示
 */
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
	ButtonBackgroundOptionsArr,
	leftButtonIconSvgArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';

/* ─────────────────────────  定数  ───────────────────────── */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const bgOptions         = ButtonBackgroundOptionsArr();
const btnIconOptions    = leftButtonIconSvgArr();

/* ───────────────────────  ブロック登録  ─────────────────────── */
registerBlockType( 'wdl/lw-link-list-1', {
	title   : 'link list 01',
	icon    : 'lightbulb',
	category: 'liteword-other',
	supports: { anchor: true },

	/* ───────── Attributes ───────── */
	attributes: {
		MaxWidth   : { type: 'number', default: 800 },
		BtnGap     : { type: 'number', default: 12 },
		BtnClm     : { type: 'number', default: 2 },
		BtnClmSp   : { type: 'number', default: 1 },
		backgroundSwitch  : { type: 'boolean', default: true },  // true=表示
		backgroundImage   : { type: 'string',  default: '' },
		bgGradient        : { type: 'string',  default: 'var(--color-main)' },
		colorLiBgOpacity  : { type: 'number',  default: 100 },
		filterOpacity     : { type: 'number',  default: 0.9 },
		ListBorderRadius  : { type: 'number',  default: 2 },
		hideTitle         : { type: 'boolean', default: false }, // true=非表示
		titleText         : { type: 'string',  default: 'Information' },
		titleBottomText   : { type: 'string',  default: '' },
		fontLi            : { type: 'string',  default: '' },
		fontWeightLi      : { type: 'string',  default: '' },
		colorLiSvg        : { type: 'string',  default: '#ffffff' },
		colorLiBg         : { type: 'string',  default: 'var(--color-main)' },
		colorLiText       : { type: 'string',  default: '#ffffff' },
		colorLiBorder     : { type: 'string',  default: '#ffffff' },
		ListBorderSize    : { type: 'number',  default: 2 },
		contents: {
			type   : 'array',
			source : 'query',
			selector: '.lw-link-list-1__li',
			query  : {
				text : { type: 'string', source: 'html', selector: '.lw-link-list-1__text p' },
				link : { type: 'string', source: 'attribute', selector: '.lw-link-list-1__link', attribute: 'href' },
				icon : { type: 'string', source: 'attribute', selector: '.lw-link-list-1__icon', attribute: 'data-icon' },
			},
			default: [
				{ text: 'ホームページ', link: '', icon: '' },
				{ text: 'Instagram',   link: '', icon: '' },
				{ text: 'YouTube',     link: '', icon: '' },
				{ text: 'FaceBook',    link: '', icon: '' },
			],
		},
	},


	/* ───────── Edit ───────── */
	edit: ( { attributes, setAttributes } ) => {
		const {
			MaxWidth, BtnGap, BtnClm, BtnClmSp,
			backgroundImage, bgGradient, filterOpacity,
			fontLi, ListBorderRadius, fontWeightLi,
			titleText, titleBottomText, hideTitle,
			contents, colorLiSvg, colorLiBg, colorLiText,
			colorLiBorder, ListBorderSize,
			backgroundSwitch, colorLiBgOpacity,
		} = attributes;

		const onChangeBackgroundImage = ( media ) => setAttributes( { backgroundImage: media.url } );
		const removeBackgroundImage   = () => setAttributes( { backgroundImage: '' } );

		const addContent    = () => setAttributes( { contents: [ ...contents, { text: '新しいテキスト', link: '', icon: '' } ] } );
		const removeContent = ( i ) => setAttributes( { contents: contents.filter( ( _, idx ) => idx !== i ) } );
		const updateContent = ( i, key, val ) => {
			const arr = [ ...contents ];
			arr[ i ][ key ] = val;
			setAttributes( { contents: arr } );
		};

		return (
			<Fragment>
				<InspectorControls>
					{/* 背景 */}
					<PanelBody title="背景">
						<ToggleControl
							label="非表示 / 表示"                        /* ★ ラベル統一 */
							checked={ backgroundSwitch }               /* ON で表示 */
							onChange={ ( v ) => setAttributes( { backgroundSwitch: v } ) }
						/>
						<div style={ { marginBottom: '10px' } }>
							{ backgroundImage && (
								<img src={ backgroundImage } alt="" style={ { width: '100%', height: 'auto', borderRadius: '5px' } } />
							) }
						</div>
						<MediaUpload
							title="背景画像を選択"
							onSelect={ onChangeBackgroundImage }
							allowedTypes={ [ 'image' ] }
							value={ backgroundImage }
							render={ ( { open } ) => (
								<Button onClick={ open } isSecondary style={ { marginBottom: '10px' } }>
									{ backgroundImage ? '背景画像を変更' : '背景画像を選択' }
								</Button>
							) }
						/>
						{ backgroundImage && (
							<Button isDestructive onClick={ removeBackgroundImage } style={ { marginBottom: '10px' } }>
								背景画像を削除
							</Button>
						) }
						<SelectControl
							label="フィルターの色"
							value={ bgGradient }
							options={ bgOptions }
							onChange={ ( v ) => setAttributes( { bgGradient: v } ) }
						/>
						<RangeControl
							label="透明度"
							value={ filterOpacity }
							onChange={ ( v ) => setAttributes( { filterOpacity: v } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
					</PanelBody>

					{/* レイアウト */}
					<PanelBody title="レイアウト">
						<RangeControl
							label="最大幅"
							value={ MaxWidth }
							onChange={ ( v ) => setAttributes( { MaxWidth: v } ) }
							min={ 0 }
							max={ 2000 }
							step={ 1 }
						/>
						<RangeControl
							label="ボタンとボタンの隙間"
							value={ BtnGap }
							onChange={ ( v ) => setAttributes( { BtnGap: v } ) }
							min={ 0 }
							max={ 48 }
							step={ 1 }
						/>
						<RangeControl
							label="ボタンの列数（PC）"
							value={ BtnClm }
							onChange={ ( v ) => setAttributes( { BtnClm: v } ) }
							min={ 1 }
							max={ 4 }
							step={ 1 }
						/>
						<RangeControl
							label="ボタンの列数（スマホ）"
							value={ BtnClmSp }
							onChange={ ( v ) => setAttributes( { BtnClmSp: v } ) }
							min={ 1 }
							max={ 3 }
							step={ 1 }
						/>
					</PanelBody>

					{/* タイトル設定 */}
					<PanelBody title="タイトル設定">
						<ToggleControl
							label="非表示 / 表示"                        /* ★ ラベル統一 */
							checked={ !hideTitle }                      /* ON で表示 */
							onChange={ ( v ) => setAttributes( { hideTitle: !v } ) }  /* 内部値を反転保存 */
						/>
					</PanelBody>

					{/* デザイン共通設定 */}
					<PanelBody title="リンクボタンの共通デザイン設定">
						<p>背景色</p>
						<ColorPalette
							value={ colorLiBg || 'transparent' }
							onChange={ ( c ) => setAttributes( { colorLiBg: c || 'transparent' } ) }
							clearable
						/>
						<RangeControl
							label="ボタン背景色の透明度"
							value={ colorLiBgOpacity }
							onChange={ ( v ) => setAttributes( { colorLiBgOpacity: v } ) }
							min={ 0 }
							max={ 110 }
							step={ 0.01 }
						/>
						<p>文字の色</p>
						<ColorPalette
							value={ colorLiText }
							onChange={ ( c ) => setAttributes( { colorLiText: c } ) }
						/>
						<SelectControl
							label="フォントの種類"
							value={ fontLi }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontLi: v } ) }
						/>
						<SelectControl
							label="文字の太さ"
							value={ fontWeightLi }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightLi: v } ) }
						/>
						<p>アイコンの色</p>
						<ColorPalette
							value={ colorLiSvg }
							onChange={ ( c ) => setAttributes( { colorLiSvg: c } ) }
						/>
						<p>外枠の色</p>
						<ColorPalette
							value={ colorLiBorder }
							onChange={ ( c ) => setAttributes( { colorLiBorder: c } ) }
						/>
						<RangeControl
							label="外枠の太さ"
							value={ ListBorderSize }
							onChange={ ( v ) => setAttributes( { ListBorderSize: v } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<RangeControl
							label="角丸の加減"
							value={ ListBorderRadius }
							onChange={ ( v ) => setAttributes( { ListBorderRadius: v } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ───────── エディター表示部 ───────── */}
				<div
					className={ `lw-link-list-1 ${ backgroundSwitch ? 'bg_visible' : 'bg_hidden' }` }
					style={ backgroundSwitch ? { backgroundImage: `url(${ backgroundImage })` } : {} }
				>
					{ !hideTitle && (
						<>
							<RichText
								tagName="h2"
								className="lw-link-list-1__title"
								value={ titleText }
								onChange={ ( v ) => setAttributes( { titleText: v } ) }
								placeholder="タイトルを入力"
							/>
							<RichText
								tagName="p"
								className="lw-link-list-1__title_bottom"
								value={ titleBottomText }
								onChange={ ( v ) => setAttributes( { titleBottomText: v } ) }
								placeholder="サブタイトルを入力"
							/>
						</>
					) }

					<ul
						className={ `lw-link-list-1__inner clm_${ BtnClm } clm_sp_${ BtnClmSp }` }
						style={ { maxWidth: MaxWidth, gap: `${ BtnGap }px` } }
					>
						{ contents.map( ( content, idx ) => (
							<li className="lw-link-list-1__li" key={ idx }>
								<a
									className="lw-link-list-1__link"
									style={ { borderRadius: `${ ListBorderRadius }px`, border: `${ ListBorderSize }px solid ${ colorLiBorder }` } }
								>
									<div
										className="btn_bg_color"
										style={ { backgroundColor: colorLiBg, opacity: `${ colorLiBgOpacity }%` } }
									/>
									<div
										className="icon lw-link-list-1__icon"
										dangerouslySetInnerHTML={ { __html: content.icon } }
										style={ { fill: colorLiSvg } }
									/>
									<span className="lw-link-list-1__text">
										<RichText
											tagName="p"
											value={ content.text }
											onChange={ ( v ) => updateContent( idx, 'text', v ) }
											placeholder="テキストを入力"
											data-lw_font_set={ fontLi }
											style={ { fontWeight: fontWeightLi, color: colorLiText } }
										/>
									</span>
									<button className="lw-link-list-1__remove_btn" onClick={ () => removeContent( idx ) }>
										削除
									</button>
								</a>

								<label>リンク</label>
								<input
									type="text"
									value={ content.link }
									onChange={ ( e ) => updateContent( idx, 'link', e.target.value ) }
									placeholder="リンクを入力"
								/>

								<SelectControl
									label="アイコンの選択"
									value={ content.icon }
									options={ btnIconOptions }
									onChange={ ( v ) => updateContent( idx, 'icon', v ) }
								/>
							</li>
						) ) }
					</ul>

					<button className="lw-link-list-1__add_btn" onClick={ addContent }>
						リストを追加する
					</button>

					<div className="lw-link-list-1__filter" style={ { background: bgGradient, opacity: filterOpacity } }></div>
				</div>
			</Fragment>
		);
	},

	/* ───────── Save ───────── */
	save: ( { attributes } ) => {
		const {
			backgroundImage, titleText, titleBottomText, hideTitle,
			fontLi, fontWeightLi, contents, bgGradient, filterOpacity,
			ListBorderRadius, colorLiSvg, colorLiBg, colorLiText,
			colorLiBorder, ListBorderSize, BtnGap, MaxWidth, BtnClm,
			BtnClmSp, backgroundSwitch, colorLiBgOpacity,
		} = attributes;

		return (
			<div
				className={ `lw-link-list-1 ${ backgroundSwitch ? 'bg_visible' : 'bg_hidden' }` }
				style={ backgroundSwitch ? { backgroundImage: `url(${ backgroundImage })` } : {} }
			>
				{ !hideTitle && (
					<>
						<RichText.Content tagName="h2" className="lw-link-list-1__title" value={ titleText } />
						<RichText.Content tagName="p" className="lw-link-list-1__title_bottom" value={ titleBottomText } />
					</>
				) }

				<ul
					className={ `lw-link-list-1__inner clm_${ BtnClm } clm_sp_${ BtnClmSp }` }
					style={ { gap: `${ BtnGap }px`, maxWidth: MaxWidth } }
				>
					{ contents.map( ( content, idx ) => (
						<li className="lw-link-list-1__li" key={ idx }>
							<a
								href={ content.link }
								className="lw-link-list-1__link"
								style={ { borderRadius: `${ ListBorderRadius }px`, border: `${ ListBorderSize }px solid ${ colorLiBorder }` } }
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="btn_bg_color" style={ { backgroundColor: colorLiBg, opacity: `${ colorLiBgOpacity }%` } } />
								{ content.icon && (
									<div
										className="icon lw-link-list-1__icon"
										data-icon={ content.icon }
										dangerouslySetInnerHTML={ { __html: content.icon } }
										style={ { fill: colorLiSvg } }
									/>
								) }
								<span className="lw-link-list-1__text" data-lw_font_set={ fontLi }>
									<RichText.Content
										tagName="p"
										value={ content.text }
										style={ { fontWeight: fontWeightLi, color: colorLiText } }
									/>
								</span>
							</a>
						</li>
					) ) }
				</ul>

				<div className="lw-link-list-1__filter" style={ { background: bgGradient, opacity: filterOpacity } }></div>
			</div>
		);
	},
} );
