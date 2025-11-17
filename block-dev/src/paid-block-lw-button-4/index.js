import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	URLInput,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import {
	fontOptionsArr,
	fontWeightOptionsArr,
	rightButtonIconSvgArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';

/* ───────── オプション配列 ───────── */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const iconSvgOptions    = rightButtonIconSvgArr();

/* ╭──────────────────────────────────╮
   │          ブロック登録             │
   ╰──────────────────────────────────╯ */
registerBlockType('wdl/paid-block-lw-button-4', {
	title   : 'リンクボタン 04',
	icon    : 'button',
	category: 'liteword-buttons',
	supports: { anchor: true },

	/* ── 属性 ─────────────────────── */
	attributes: {
		blockId      : { type: 'string' },
		btnText      : { type: 'string',  default: '詳細はこちら' },
		bgColor      : { type: 'string',  default: 'var(--color-main)' },
		textColor    : { type: 'string',  default: '#ffffff' },
		fontWeight   : { type: 'string',  default: '400' },
		FontSet      : { type: 'string',  default: '' },
		fontSize     : { type: 'string',  default: 'm' },   // l / m / s

		/* ★ PC／SP 配置 */
		position     : { type: 'string',  default: 'center' }, // PC
		positionSp   : { type: 'string',  default: '' },       // SP（''=未選択）

		btnUrl       : { type: 'string',  default: '' },
		openNewTab   : { type: 'boolean', default: false },

		selectedIcon : { type: 'string',  default:
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>',
		},
		iconVisible  : { type: 'boolean', default: true },

		borderWidth  : { type: 'number',  default: 1 },
		borderColor  : { type: 'string',  default: '#ffffff' },
		borderRadius : { type: 'number',  default: 200 },

		maxWidth     : { type: 'number',  default: 320 },
		maxWidthSp   : { type: 'number',  default: 320 },
	},

	/* ── 編集画面 ─────────────────── */
	edit( props ) {
		const { attributes, setAttributes, clientId } = props;
		const {
			blockId,
			btnText, bgColor, textColor,
			fontWeight, FontSet, fontSize,
			position, positionSp,
			btnUrl, openNewTab,
			selectedIcon, iconVisible,
			borderWidth, borderColor, borderRadius,
			maxWidth, maxWidthSp,
		} = attributes;

		/* 一意 ID 自動付与 */
		if ( ! blockId ) {
			setAttributes({ blockId: `lwbtn-${ clientId.slice(0,8) }` });
		}

		const fontSizeClass = `font_size_${ fontSize }`;
		const pcClass       = `position_${ position }`;
		const spClass       = positionSp ? `position_${ positionSp }_sp` : '';

		return (
			<div className={ `paid-block-lw-button-4 ${ pcClass } ${ spClass }` }>
				<InspectorControls>

					{/* ── 1. 基本設定 ── */}
					<PanelBody title="📝 基本設定" initialOpen={true}>
						<URLInput
							label="🔗 リンク先URL"
							value={ btnUrl }
							onChange={ v => setAttributes({ btnUrl: v }) }
							help="ボタンをクリックした時の移動先URLを入力してください"
						/>
						<ToggleControl
							label="新しいタブで開く"
							checked={ openNewTab }
							onChange={ v => setAttributes({ openNewTab: v }) }
							help="リンク先を新しいタブで開きたい場合はオンにしてください"
						/>
					</PanelBody>

					{/* ── 2. ボタンサイズ・形状 ── */}
					<PanelBody title="📏 ボタンのサイズと形" initialOpen={false}>
						<RangeControl
							label="🖥️ パソコンでの横幅 (px)"
							value={ maxWidth }
							onChange={ v=>setAttributes({ maxWidth: v }) }
							min={100} max={600}
							help="パソコンで表示する時のボタンの横幅を設定します"
						/>
						
						<RangeControl
							label="📱 スマホでの横幅 (px)"
							value={ maxWidthSp }
							onChange={ v=>setAttributes({ maxWidthSp: v }) }
							min={100} max={600}
							help="スマホで表示する時のボタンの横幅を設定します"
						/>

						<RangeControl
							label="🎪 角の丸み (px)"
							value={ borderRadius }
							onChange={ v=>setAttributes({ borderRadius: v }) }
							min={0} max={100}
							help="数値が大きいほど角が丸くなります。0で四角、50以上で丸いボタンになります"
						/>
					</PanelBody>

					{/* ── 3. 色・フォント設定 ── */}
					<PanelBody title="🎨 色とフォントの設定" initialOpen={false}>
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🌈 ボタンの背景色</p>
							<ColorPalette 
								value={ bgColor } 
								onChange={ v=>setAttributes({ bgColor: v }) } 
							/>
						</div>
						
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>📝 文字の色</p>
							<ColorPalette 
								value={ textColor } 
								onChange={ v=>setAttributes({ textColor: v }) } 
							/>
						</div>

						<SelectControl
							label="📚 フォントの種類"
							value={ FontSet }
							options={ fontOptions }
							onChange={ v=>setAttributes({ FontSet: v }) }
							help="ボタンのフォントを選択してください"
						/>
						
						<SelectControl
							label="💪 文字の太さ"
							value={ fontWeight }
							options={ fontWeightOptions }
							onChange={ v=>setAttributes({ fontWeight: v }) }
						/>

						<SelectControl
							label="📏 文字サイズ"
							value={ fontSize }
							options={[
								{ label:'大きめ (L)', value:'l' },
								{ label:'標準 (M)', value:'m' },
								{ label:'小さめ (S)', value:'s' },
							]}
							onChange={ v=>setAttributes({ fontSize: v }) }
						/>
					</PanelBody>

					{/* ── 4. アイコン設定 ── */}
					<PanelBody title="✨ アイコン設定" initialOpen={false}>
						<ToggleControl
							label="アイコンを表示する"
							checked={ iconVisible }
							onChange={ v=>setAttributes({ iconVisible: v }) }
							help="ボタンにアイコンを表示したい場合はオンにしてください"
						/>
						
						{ iconVisible && (
							<SelectControl
								label="🎯 アイコンの種類"
								value={ selectedIcon }
								options={ iconSvgOptions }
								onChange={ v=>setAttributes({ selectedIcon: v }) }
							/>
						)}
					</PanelBody>

					{/* ── 5. 配置設定 ── */}
					<PanelBody title="📍 ボタンの配置" initialOpen={false}>
						<SelectControl
							label="🖥️ パソコンでの位置"
							value={ position }
							options={[
								{ label:'左寄せ', value:'left' },
								{ label:'中央（推奨）', value:'center' },
								{ label:'右寄せ', value:'right' },
							]}
							onChange={ v => setAttributes({ position: v }) }
							help="パソコンで見た時のボタンの位置を選択してください"
						/>
						
						<SelectControl
							label="📱 スマートフォンでの位置"
							value={ positionSp }
							options={[
								{ label:'パソコンと同じ', value:'' },
								{ label:'左寄せ', value:'left' },
								{ label:'中央', value:'center' },
								{ label:'右寄せ', value:'right' },
							]}
							onChange={ v => setAttributes({ positionSp: v }) }
							help="スマホで見た時の位置を個別に設定したい場合は選択してください"
						/>
					</PanelBody>

					{/* ── 6. 枠線設定 ── */}
					<PanelBody title="🖍️ 枠線の設定" initialOpen={false}>
						<RangeControl
							label="枠線の太さ (px)"
							value={ borderWidth }
							onChange={ v=>setAttributes({ borderWidth: v }) }
							min={0} max={10}
							help="0にすると枠線が表示されません"
						/>
						
						{ borderWidth > 0 && (
							<div style={{ marginTop: '15px' }}>
								<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎨 枠線の色</p>
								<ColorPalette
									value={ borderColor }
									onChange={ v=>setAttributes({ borderColor: v }) }
								/>
							</div>
						)}
					</PanelBody>
				</InspectorControls>

				{/* ---- エディタープレビュー ---- */}
				<div
					id={ blockId }
					className={ `a_inner ${ fontSizeClass }` }
					style={{ maxWidth:`${ maxWidth }px`, borderRadius:`${ borderRadius }px` }}
				>
					<RichText
						tagName="a"
						className="a"
						value={ btnText }
						onChange={ v=>setAttributes({ btnText: v }) }
						placeholder="リンクテキスト"
						style={{ color:textColor, fontWeight }}
						data-lw_font_set={ FontSet }
					/>
					{ iconVisible && selectedIcon && (
						<div
							className="icon-svg"
							dangerouslySetInnerHTML={{ __html: selectedIcon }}
							style={{ fill:bgColor }}
						/>
					)}
					<div className="a_background" style={{ background:bgColor, borderRadius:`${borderRadius}px` }} />
					<div className="a_in_border" style={{ border:`${borderWidth}px solid ${borderColor}`, borderRadius:`${borderRadius}px` }} />
				</div>
			</div>
		);
	},

	/* ── フロント保存 ───────────────────────────── */
	save({ attributes }) {
		const {
			blockId,
			btnText, bgColor, textColor,
			fontWeight, FontSet, fontSize,
			position, positionSp,
			btnUrl, openNewTab,
			selectedIcon, iconVisible,
			borderWidth, borderColor, borderRadius,
			maxWidth, maxWidthSp,
		} = attributes;

		const fontSizeClass = `font_size_${ fontSize }`;
		const pcClass       = `position_${ position }`;
		const spClass       = positionSp ? `position_${ positionSp }_sp` : '';
		const pcStyle       = `#${ blockId }{max-width:${ maxWidth }px;}`;
		const spStyle       = `@media (max-width:500px){#${ blockId }{max-width:${ maxWidthSp }px;}}`;

		return (
			<div className={ `paid-block-lw-button-4 ${ pcClass } ${ spClass }` }>
				<style>{ pcStyle + spStyle }</style>
				<div
					id={ blockId }
					className={ `a_inner ${ fontSizeClass }` }
					style={{ borderRadius:`${ borderRadius }px` }}
				>
					<RichText.Content
						tagName="a"
						className="a"
						value={ btnText }
						href={ btnUrl }
						target={ openNewTab ? '_blank' : undefined }
						rel={ openNewTab ? 'noopener noreferrer' : undefined }
						style={{ color:textColor, fontWeight }}
						data-lw_font_set={ FontSet }
					/>
					{ iconVisible && selectedIcon && (
						<div
							className="icon-svg"
							dangerouslySetInnerHTML={{ __html: selectedIcon }}
							style={{ fill:bgColor }}
						/>
					)}
					<div className="a_background" style={{ background:bgColor, borderRadius:`${borderRadius}px` }} />
					<div className="a_in_border" style={{ border:`${borderWidth}px solid ${borderColor}`, borderRadius:`${borderRadius}px` }} />
				</div>
			</div>
		);
	},
});