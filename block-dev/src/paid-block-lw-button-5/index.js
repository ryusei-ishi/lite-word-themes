/* ==============================================================
 * LiteWord – Paid Block  Button 05（outer border / gap / 共通角丸 / icon color 対応版）
 * ============================================================== */
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
	ToggleControl,
	RadioControl,
	RangeControl,
} from '@wordpress/components';
import {
	fontOptionsArr,
	fontWeightOptionsArr,
	rightButtonIconSvgArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';

/* ─ オプション配列 ─ */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const iconSvgOptions    = rightButtonIconSvgArr();

/* ─ ヘルパー：SVG に色を付与 ─ */
const iconWithColor = (svg, color) =>
	svg ? svg.replace('<svg', `<svg style="fill:${color};color:${color};"`) : '';

/* ─ デフォルトボタン ─ */
const defaultBtn = () => ({
	enabled          : true,
	btnText          : '03-0000-0000',
	subText          : '受付時間 10:00～17:00',
	bgColor          : 'var(--color-main)',
	textColor        : '#ffffff',
	btnUrl           : '',
	openNewTab       : false,
	selectedIcon     : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z"/></svg>',
	iconVisible      : true,
	iconWidth        : 34,
	iconColor        : '#ffffff',
	/* ▼ a_inner 外枠線 */
	outerBorderWidth : 0,
	outerBorderColor : 'var(--color-main)',
	/* ▼ 既存内枠線 */
	borderWidth      : 1,
	borderColor      : '#ffffff',
});

registerBlockType('wdl/paid-block-lw-button-5', {
	title   : 'リンクボタン 05',
	icon    : 'button',
	category: 'liteword-buttons',
	supports: { anchor: true },

	attributes: {
		blockId     : { type:'string' },
		fontWeight  : { type:'string', default:'400' },
		FontSet     : { type:'string', default:'' },
		position    : { type:'string', default:'center' },
		gapX        : { type:'number', default:12 },
		gapY        : { type:'number', default:12 },
		borderRadius: { type:'number', default:12 },   // 共通角丸
		buttons     : { type:'array',  default:[ defaultBtn(), defaultBtn(), defaultBtn() ] },
	},

	/* ───────── edit ───────── */
	// ★ 修正: useEffect を導入
	edit( { attributes, setAttributes, clientId } ) {
		const {
			blockId, fontWeight, FontSet, position,
			gapX, gapY, borderRadius, buttons
		} = attributes;

		/* -------------------------------------------------- *
		 * 初回レンダリング後に blockId を確定させる
		 * -------------------------------------------------- */
		const { useEffect, Fragment, createElement } = wp.element; // ✧ WP 環境ではこれでも可
		const generatedId = blockId || `lwbtn-${ clientId.slice(0,8) }`;

		useEffect( () => {                            // ★ 修正
			if ( ! blockId ) {
				setAttributes({ blockId: generatedId });
			}
		}, [ blockId ] );

		const updateBtn = (i,k,v)=>{
			const arr=[...buttons]; arr[i]={...arr[i],[k]:v}; setAttributes({buttons:arr});
		};

		const posClass=`position_${position}`;

		return (
			<div
				className={ `paid-block-lw-button-5 ${posClass}` }
				style={{ columnGap:`${gapX}px`, rowGap:`${gapY}px` }}
			>
				<InspectorControls>

					{/* ── 1. 全体の設定 ── */}
					<PanelBody title="📐 全体の設定" initialOpen={true}>
						<RadioControl 
							label="📍 リンクボタンの配置" 
							selected={position} 
							options={[
								{label:'左寄せ', value:'left'},
								{label:'中央（推奨）', value:'center'},
								{label:'右寄せ', value:'right'}
							]}
							onChange={v=>setAttributes({position:v})}
							help="複数のボタンをどこに配置するかを選択してください"
						/>
						
						<SelectControl 
							label="📚 フォントの種類" 
							value={FontSet} 
							options={fontOptions}
							onChange={v=>setAttributes({FontSet:v})}
						/>
						
						<SelectControl 
							label="💪 文字の太さ" 
							value={fontWeight} 
							options={fontWeightOptions}
							onChange={v=>setAttributes({fontWeight:v})}
						/>
					</PanelBody>

					{/* ── 2. ボタンサイズと間隔 ── */}
					<PanelBody title="📏 リンクボタンサイズと間隔" initialOpen={false}>
						<RangeControl 
							label="🎪 角の丸み (px)" 
							value={borderRadius}
							onChange={v=>setAttributes({borderRadius:v})} 
							min={0} max={100}
							help="全てのボタンに共通で適用される角の丸みです"
						/>
						
						<RangeControl 
							label="↔️ ボタン間の横間隔 (px)" 
							value={gapX}
							onChange={v=>setAttributes({gapX:v})} 
							min={0} max={60}
							help="ボタンが横に並ぶ時の間隔を設定します"
						/>
						
						<RangeControl 
							label="↕️ ボタン間の縦間隔 (px)" 
							value={gapY}
							onChange={v=>setAttributes({gapY:v})} 
							min={0} max={60}
							help="ボタンが縦に重なる時の間隔を設定します"
						/>
					</PanelBody>

					{/* ── 3. 各ボタンの設定 ── */}
					{buttons.map((btn,i)=>(
						<PanelBody key={i} title={`🔘 ボタン ${i+1}の設定`} initialOpen={i === 0}>
							<div style={{ 
								border: '1px solid #ddd', 
								borderRadius: '4px', 
								padding: '12px', 
								marginBottom: '15px',
								backgroundColor: btn.enabled ? '#f0f8ff' : '#f5f5f5'
							}}>
								<ToggleControl 
									label={`ボタン ${i+1} を表示する`}
									checked={btn.enabled}
									onChange={v=>updateBtn(i,'enabled',v)}
									help={btn.enabled ? 'このボタンは表示されます' : 'このボタンは非表示になります'}
								/>
							</div>
							
							{btn.enabled && (
								<>
									{/* リンク設定 */}
									<div style={{ 
										border: '1px solid #e0e0e0', 
										borderRadius: '4px', 
										padding: '15px', 
										marginBottom: '20px',
										backgroundColor: '#fafafa'
									}}>
										<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
											🔗 リンク設定
										</p>
										
										<URLInput 
											label="リンク先URL" 
											value={btn.btnUrl}
											onChange={v=>updateBtn(i,'btnUrl',v)}
											help="ボタンをクリックした時の移動先URLを入力してください"
										/>
										
										<ToggleControl 
											label="新しいタブで開く" 
											checked={btn.openNewTab}
											onChange={v=>updateBtn(i,'openNewTab',v)}
											help="リンク先を新しいタブで開きたい場合はオンにしてください"
										/>
									</div>

									{/* 色とテキスト設定 */}
									<div style={{ 
										border: '1px solid #e0e0e0', 
										borderRadius: '4px', 
										padding: '15px', 
										marginBottom: '20px',
										backgroundColor: '#fafafa'
									}}>
										<p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
											🎨 色とテキスト
										</p>
										
										<div style={{ marginBottom: '15px' }}>
											<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🌈 ボタンの背景色</p>
											<ColorPalette 
												value={btn.bgColor}
												onChange={v=>updateBtn(i,'bgColor',v)}
											/>
										</div>
										
										<div style={{ marginBottom: '15px' }}>
											<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>📝 文字の色</p>
											<ColorPalette 
												value={btn.textColor}
												onChange={v=>updateBtn(i,'textColor',v)}
											/>
										</div>

										<RichText 
											tagName="div" 
											label="📞 メインテキスト（電話番号など）" 
											value={btn.btnText}
											onChange={v=>updateBtn(i,'btnText',v)} 
											placeholder="メインテキストを入力"
										/>
										
										<RichText 
											tagName="div" 
											label="📅 サブテキスト（受付時間など）" 
											value={btn.subText}
											onChange={v=>updateBtn(i,'subText',v)} 
											placeholder="サブテキストを入力"
										/>
									</div>

									{/* アイコン設定 */}
									<div style={{ 
										border: '1px solid #e0e0e0', 
										borderRadius: '4px', 
										padding: '15px', 
										marginBottom: '20px',
										backgroundColor: '#fafafa'
									}}>
										<p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
											✨ アイコン設定
										</p>
										
										<ToggleControl 
											label="アイコンを表示する" 
											checked={btn.iconVisible}
											onChange={v=>updateBtn(i,'iconVisible',v)}
											help="ボタンにアイコンを表示したい場合はオンにしてください"
										/>
										
										{btn.iconVisible && (
											<>
												<SelectControl 
													label="🎯 アイコンの種類" 
													value={btn.selectedIcon}
													options={iconSvgOptions}
													onChange={v=>updateBtn(i,'selectedIcon',v)}
												/>
												
												<RangeControl 
													label="📐 アイコンのサイズ (%)" 
													value={btn.iconWidth}
													onChange={v=>updateBtn(i,'iconWidth',v)} 
													min={10} max={100}
													help="アイコンの大きさを調整できます"
												/>
												
												<div style={{ marginTop: '15px' }}>
													<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎨 アイコンの色</p>
													<ColorPalette 
														value={btn.iconColor}
														onChange={v=>updateBtn(i,'iconColor',v)}
													/>
												</div>
											</>
										)}
									</div>

									{/* 枠線設定 */}
									<div style={{ 
										border: '1px solid #e0e0e0', 
										borderRadius: '4px', 
										padding: '15px', 
										marginBottom: '20px',
										backgroundColor: '#fafafa'
									}}>
										<p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
											🖍️ 枠線の設定
										</p>
										
										<RangeControl 
											label="🔲 外枠線の太さ (px)" 
											value={btn.outerBorderWidth}
											onChange={v=>updateBtn(i,'outerBorderWidth',v)} 
											min={0} max={10}
											help="ボタン全体の外側の枠線です"
										/>
										
										{btn.outerBorderWidth > 0 && (
											<div style={{ marginBottom: '15px' }}>
												<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎨 外枠線の色</p>
												<ColorPalette 
													value={btn.outerBorderColor}
													onChange={v=>updateBtn(i,'outerBorderColor',v)}
												/>
											</div>
										)}
										
										<RangeControl 
											label="📦 内枠線の太さ (px)" 
											value={btn.borderWidth}
											onChange={v=>updateBtn(i,'borderWidth',v)} 
											min={0} max={10}
											help="ボタン内側の枠線です"
										/>
										
										{btn.borderWidth > 0 && (
											<div style={{ marginTop: '15px' }}>
												<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎨 内枠線の色</p>
												<ColorPalette 
													value={btn.borderColor}
													onChange={v=>updateBtn(i,'borderColor',v)}
												/>
											</div>
										)}
									</div>
								</>
							)}
						</PanelBody>
					))}
				</InspectorControls>

				{/* ─ プレビュー ─ */}
				{buttons.map((btn,i)=>{
					if(!btn.enabled) return null;
					const id=`${generatedId}-${i+1}`;      // ★ 修正
					return(
						<div key={i} id={id} className="a_inner"
							style={{
								border     :`${btn.outerBorderWidth}px solid ${btn.outerBorderColor}`,
								borderRadius:`${borderRadius}px`
							}}>
							<a className="a" style={{color:btn.textColor,fontWeight}} data-lw_font_set={FontSet}>
								{btn.iconVisible && btn.selectedIcon && (
									<span className="icon-svg">
										<span
											className="icon-svg-inner"
											style={{width:`${btn.iconWidth}%`, textDecoration: 'none'}}
											dangerouslySetInnerHTML={{
												__html: iconWithColor(btn.selectedIcon, btn.iconColor)
											}}
										/>
									</span>
								)}
								<span className="text_in">
									<RichText tagName="span" className="text_main"
										value={btn.btnText}
										onChange={v=>updateBtn(i,'btnText',v)}
										placeholder="リンクテキスト"/>
									<RichText tagName="span" className="text_sub"
										value={btn.subText}
										onChange={v=>updateBtn(i,'subText',v)}
										placeholder="サブテキスト"/>
								</span>
							</a>
							<div className="a_background" style={{background:btn.bgColor}}/>
							<div className="a_in_border"
								style={{border:`${btn.borderWidth}px solid ${btn.borderColor}`,
									borderRadius:`${borderRadius}px`}}/>
						</div>
					);
				})}
			</div>
		);
	},

	/* ───────── save ───────── */
	save({ attributes }) {
		const {
			blockId, fontWeight, FontSet, position,
			gapX, gapY, borderRadius, buttons
		} = attributes;
		const posClass=`position_${position}`;

		return (
			<div
				className={ `paid-block-lw-button-5 ${posClass}` }
				style={{ columnGap:`${gapX}px`, rowGap:`${gapY}px` }}
			>
				{buttons.map((btn,i)=>{
					if(!btn.enabled) return null;
					const id=`${blockId}-${i+1}`;
					const hasMainText = btn.btnText && btn.btnText.trim() !== '';
					const hasSubText  = btn.subText && btn.subText.trim() !== '';
					return(
						<div key={i} id={id} className="a_inner"
							style={{
								border     :`${btn.outerBorderWidth}px solid ${btn.outerBorderColor}`,
								borderRadius:`${borderRadius}px`
							}}>
							<a className="a"
								href={btn.btnUrl || '#'}
								target={btn.openNewTab ? '_blank':undefined}
								rel={btn.openNewTab ? 'noopener noreferrer':undefined}
								style={{color:btn.textColor,fontWeight, textDecoration: 'none'}}
								data-lw_font_set={FontSet}>
								{btn.iconVisible && btn.selectedIcon && (
									<span className="icon-svg">
										<span
											className="icon-svg-inner"
											style={{width:`${btn.iconWidth}%`}}
											dangerouslySetInnerHTML={{
												__html: iconWithColor(btn.selectedIcon, btn.iconColor)
											}}
										/>
									</span>
								)}
								{(hasMainText || hasSubText) && (
									<span className="text_in">
										{hasMainText && (
											<RichText.Content tagName="span" className="text_main" value={btn.btnText}/>
										)}
										{hasSubText && (
											<RichText.Content tagName="span" className="text_sub" value={btn.subText}/>
										)}
									</span>
								)}
							</a>
							<div className="a_background" style={{background:btn.bgColor}}/>
							<div className="a_in_border"
								style={{border:`${btn.borderWidth}px solid ${btn.borderColor}`,
									borderRadius:`${borderRadius}px`}}/>
						</div>
					);
				})}
			</div>
		);
	},
});