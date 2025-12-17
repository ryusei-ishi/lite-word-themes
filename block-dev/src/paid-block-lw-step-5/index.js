import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	RadioControl,
} from '@wordpress/components';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ===== 共通オプション ===== */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* HEX → RGBA 変換（影用） */
const hexToRgba = (hex = '#000000', a = 1) => {
	const h = hex.replace('#', '');
	const full = h.length === 3
		? h.split('').map((c) => c + c).join('')
		: h.padEnd(6, '0');
	const n = parseInt(full, 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType(metadata.name, {
	title   : 'step 05',

	/* ======================================================
	 * 1) エディタ
	 * ==================================================== */
	edit({ attributes, setAttributes }) {
		const {
			bgGradient, ulMaxWidth, fontSizeClass,
			borderWidth, borderStyle, borderColor,
			shadowBlur, shadowColor, shadowAlpha,
			fontNo, fontWeightNo, colorNo,
			titleTag, fontH3, fontWeightH3, colorH3,
			fontP,  fontWeightP,  colorP,
			contents,
		} = attributes;

		/* 行操作用関数 */
		const addContent = () =>
			setAttributes({
				contents:[...contents, { no:`${contents.length+1}月`, title:'', text:'' }]
			});
		const removeContent = (idx) =>
			setAttributes({ contents: contents.filter((_,i)=>i!==idx) });
		const updateContent = (idx,key,val) => {
			const updated=[...contents];
			updated[idx][key]=val;
			setAttributes({ contents: updated });
		};

		const blockProps = useBlockProps({
			className: `paid-block-lw-step-5 ${fontSizeClass}`
		});

		/* li 共通スタイル */
		const liStyle = {
			borderWidth : `${borderWidth}px`,
			borderStyle,
			borderColor,
			boxShadow   : `0 0 ${shadowBlur}px ${hexToRgba(shadowColor, shadowAlpha)}`,
		};

		return (
			<>
				<InspectorControls>
					{/* --- レイアウト全体 --- */}
					<PanelBody title="レイアウト全体" initialOpen={true}>
						<RadioControl
							label="フォントサイズ"
							selected={fontSizeClass}
							options={[
								{ label:'大 (L)', value:'font_size_l' },
								{ label:'中 (M)', value:'font_size_m' },
								{ label:'小 (S)', value:'font_size_s' },
							]}
							onChange={(v)=>setAttributes({ fontSizeClass:v })}
						/>
						<RangeControl
							label="最大横幅"
							value={ulMaxWidth}
							onChange={(v)=>setAttributes({ ulMaxWidth:v })}
							min={600} max={1280} step={1}
						/>
						<p>枠・STEP 番号背景色</p>
						<ColorPalette
							value={bgGradient}
							onChange={(c)=>setAttributes({ bgGradient:c })}
						/>
					</PanelBody>

					{/* --- 枠線・影設定（★ 追加） --- */}
					<PanelBody title="枠線・影" initialOpen={false}>
						<RangeControl
							label="枠線太さ(px)"
							value={borderWidth}
							onChange={(v)=>setAttributes({ borderWidth:v })}
							min={0} max={10} step={1}
						/>
						<SelectControl
							label="枠線スタイル"
							value={borderStyle}
							options={[
								{ label:'solid',  value:'solid'  },
								{ label:'dashed', value:'dashed' },
								{ label:'dotted', value:'dotted' },
								{ label:'double', value:'double' },
								{ label:'none',   value:'none'   },
							]}
							onChange={(v)=>setAttributes({ borderStyle:v })}
						/>
						<p>枠線色</p>
						<ColorPalette
							value={borderColor}
							onChange={(c)=>setAttributes({ borderColor:c })}
						/>
						<RangeControl
							label="影のぼかし(px)"
							value={shadowBlur}
							onChange={(v)=>setAttributes({ shadowBlur:v })}
							min={0} max={30} step={1}
						/>
						<p>影の色</p>
						<ColorPalette
							value={shadowColor}
							onChange={(c)=>setAttributes({ shadowColor:c })}
						/>
						<RangeControl
							label="影の透過(0-1)"
							value={shadowAlpha}
							onChange={(v)=>setAttributes({ shadowAlpha:v })}
							min={0} max={1} step={0.05}
						/>
					</PanelBody>

					{/* --- STEP番号書式 --- */}
					<PanelBody title="STEP番号の書式" initialOpen={false}>
						<SelectControl
							label="フォント"
							value={fontNo}
							options={fontOptions}
							onChange={(v)=>setAttributes({ fontNo:v })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightNo}
							options={fontWeightOptions}
							onChange={(v)=>setAttributes({ fontWeightNo:v })}
						/>
						<p>文字色</p>
						<ColorPalette
							value={colorNo}
							onChange={(c)=>setAttributes({ colorNo:c })}
						/>
					</PanelBody>

					{/* --- タイトル書式 --- */}
					<PanelBody title="タイトルの書式" initialOpen={false}>
						<SelectControl
							label="タグ"
							value={titleTag}
							options={[
								{ label:'h2', value:'h2' },
								{ label:'h3', value:'h3' },
								{ label:'h4', value:'h4' },
								{ label:'p',  value:'p'  },
							]}
							onChange={(v)=>setAttributes({ titleTag:v })}
						/>
						<SelectControl
							label="フォント"
							value={fontH3}
							options={fontOptions}
							onChange={(v)=>setAttributes({ fontH3:v })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightH3}
							options={fontWeightOptions}
							onChange={(v)=>setAttributes({ fontWeightH3:v })}
						/>
						<p>文字色</p>
						<ColorPalette
							value={colorH3}
							onChange={(c)=>setAttributes({ colorH3:c })}
						/>
					</PanelBody>

					{/* --- 本文書式 --- */}
					<PanelBody title="本文の書式" initialOpen={false}>
						<SelectControl
							label="フォント"
							value={fontP}
							options={fontOptions}
							onChange={(v)=>setAttributes({ fontP:v })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightP}
							options={fontWeightOptions}
							onChange={(v)=>setAttributes({ fontWeightP:v })}
						/>
						<p>文字色</p>
						<ColorPalette
							value={colorP}
							onChange={(c)=>setAttributes({ colorP:c })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* ---------- エディタ表示 ---------- */}
				<div {...blockProps}>
					<ul className="lw-step__inner" style={{ maxWidth:ulMaxWidth }}>
						{contents.map((c,i)=>(
							<li
								className="lw-step__li"
								key={i}
								style={liStyle}
							>
								{/* STEP番号 */}
								<RichText
									tagName="div"
									className="lw-step__li_no"
									value={c.no}
									onChange={(v)=>updateContent(i,'no',v)}
									data-lw_font_set={fontNo}
									style={{
										fontWeight:fontWeightNo,
										background:bgGradient,
										color:colorNo||undefined,
									}}
								/>

								<div className="lw-step__li_in">
									<RichText
										tagName={titleTag}
										className="lw-step__li_title ttl"
										value={c.title}
										onChange={(v)=>updateContent(i,'title',v)}
										data-lw_font_set={fontH3}
										placeholder="タイトルを入力"
										style={{
											fontWeight:fontWeightH3,
											color:colorH3||undefined,
										}}
									/>
									<RichText
										tagName="p"
										className="lw-step__li_text"
										value={c.text}
										onChange={(v)=>updateContent(i,'text',v)}
										data-lw_font_set={fontP}
										placeholder="テキストを入力"
										style={{
											fontWeight:fontWeightP,
											color:colorP||undefined,
										}}
									/>
								</div>

								<button
									type="button"
									className="lw-step__remove_btn"
									onClick={()=>removeContent(i)}
								>
									削除
								</button>
							</li>
						))}
					</ul>

					<button
						type="button"
						className="lw-step__add_btn"
						onClick={addContent}
					>
						リストを追加する
					</button>
				</div>
			</>
		);
	},

	/* ======================================================
	 * 2) フロント出力
	 * ==================================================== */
	save({ attributes }) {
		const {
			bgGradient, ulMaxWidth, fontSizeClass,
			borderWidth, borderStyle, borderColor,
			shadowBlur, shadowColor, shadowAlpha,
			fontNo, fontWeightNo, colorNo,
			titleTag, fontH3, fontWeightH3, colorH3,
			fontP,  fontWeightP,  colorP,
			contents,
		} = attributes;

		const hasContent = (str='')=>str.trim()!=='';  // 空判定

		const liStyle = {
			borderWidth : `${borderWidth}px`,
			borderStyle,
			borderColor,
			boxShadow   : `0 0 ${shadowBlur}px ${hexToRgba(shadowColor, shadowAlpha)}`,
		};

		return (
			<div className={`paid-block-lw-step-5 ${fontSizeClass}`}>
				<ul className="lw-step__inner" style={{ maxWidth:ulMaxWidth }}>
					{contents.map((c,i)=>(
						<li className="lw-step__li" key={i} style={liStyle}>
							<RichText.Content
								tagName="div"
								className="lw-step__li_no"
								value={c.no}
								data-lw_font_set={fontNo}
								style={{
									fontWeight:fontWeightNo,
									background:bgGradient,
									color:colorNo||undefined,
								}}
							/>

							<div className="lw-step__li_in">
								{hasContent(c.title) && (
									<RichText.Content
										tagName={titleTag}
										className="lw-step__li_title ttl"
										value={c.title}
										data-lw_font_set={fontH3}
										style={{
											fontWeight:fontWeightH3,
											color:colorH3||undefined,
										}}
									/>
								)}
								{hasContent(c.text) && (
									<RichText.Content
										tagName="p"
										className="lw-step__li_text"
										value={c.text}
										data-lw_font_set={fontP}
										style={{
											fontWeight:fontWeightP,
											color:colorP||undefined,
										}}
									/>
								)}
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	},
});
