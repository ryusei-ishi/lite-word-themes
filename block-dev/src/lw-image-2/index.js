import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	ColorPalette,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

/* ----------------------------------------------------------
 * 共通データ
 * -------------------------------------------------------- */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const blendOptions = [
	{ label:'normal',   value:'normal'   },
	{ label:'multiply', value:'multiply' },
	{ label:'screen',   value:'screen'   },
	{ label:'overlay',  value:'overlay'  },
	{ label:'darken',   value:'darken'   },
	{ label:'lighten',  value:'lighten'  },
];

/* HEX→RGBA 変換（影などで未使用だが util として残しておく） */
const hexToRgba = (hex='#000', a=1)=>{
	const h = hex.replace('#','');
	const full = h.length === 3 ? h.split('').map(c=>c+c).join('') : h.padEnd(6,'0');
	const n = parseInt(full,16);
	const r = (n>>16)&255, g = (n>>8)&255, b = n&255;
	return `rgba(${r},${g},${b},${a})`;
};

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType( 'wdl/lw-image-2', {
	title   : '画像カード 02',
	icon    : 'format-image',
	category: 'liteword-other',
	supports: { anchor:true },

	attributes:{
		/* ===== 共通設定 ===== */
		borderRadiusEm : { type:'number', default:1.2 }, // 角丸 em
		aspectHeight   : { type:'number', default:800 }, // 1000 / 高さ
		fontP          : { type:'string', default:'' },
		fontWeightP    : { type:'string', default:'' },
		colorP         : { type:'string', default:'' },
		maxWidthPx     : { type:'number', default:0 },   // 0 = 100%
		alignClass     : { type:'string', default:'left' }, // left/center/right

		/* ===== カード 3 件 ===== */
		items:{
			type   :'array',
			source :'query',
			selector:'.image__inner',
			query  :{
				imgSrc :{ type:'string', source:'attribute', selector:'img', attribute:'src' },
				altText:{ type:'string', source:'attribute', selector:'img', attribute:'alt' },
				text   :{ type:'string', source:'text',      selector:'p' },
				fColor :{ type:'string', source:'attribute', selector:'.image_filter', attribute:'data-color' },
				fOpac  :{ type:'number', source:'attribute', selector:'.image_filter', attribute:'data-opacity' },
				fBlend :{ type:'string', source:'attribute', selector:'.image_filter', attribute:'data-blend' },
			},
			default:[
				{
					imgSrc :'https://cdn.pixabay.com/photo/2022/12/28/14/45/sunset-7683081_1280.jpg',
					altText:'',
					text   :'テキスト',
					fColor :'#000000',
					fOpac  :0.3,
					fBlend :'normal',
				},
				{
					imgSrc :'https://cdn.pixabay.com/photo/2022/12/28/14/45/sunset-7683081_1280.jpg',
					altText:'',
					text   :'テキスト',
					fColor :'#000000',
					fOpac  :0.3,
					fBlend :'normal',
				},
				{
					imgSrc :'https://cdn.pixabay.com/photo/2022/12/28/14/45/sunset-7683081_1280.jpg',
					altText:'',
					text   :'テキスト',
					fColor :'#000000',
					fOpac  :0.3,
					fBlend :'normal',
				},
			],
		},
	},

	/* ======================================================
	 * エディタ
	 * ==================================================== */
	edit( { attributes, setAttributes } ){
		const {
			borderRadiusEm, aspectHeight,
			fontP, fontWeightP, colorP,
			maxWidthPx, alignClass,
			items,
		} = attributes;

		/* 共通設定更新 */
		const updateAttr = (k,v)=>setAttributes({ [k]:v });

		/* 個別カード更新 */
		const updateItem = (idx,k,v)=>{
			const newItems=[...items];
			newItems[idx][k]=v;
			setAttributes({ items:newItems });
		};

		const numClass = i=>`no_${i+1}`;

		return (
			<Fragment>
				{/* ===== サイドバー ===== */}
				<InspectorControls>
					<PanelBody title="共通スタイル" initialOpen={true}>
						<RangeControl
							label="角丸 (em)"
							value={borderRadiusEm}
							onChange={v=>updateAttr('borderRadiusEm',v)}
							min={0} max={5} step={0.1}
						/>
						<RangeControl
							label="アスペクト比 高さ (1000 / 高さ)"
							value={aspectHeight}
							onChange={v=>updateAttr('aspectHeight',v)}
							min={400} max={1200} step={10}
						/>
						<RangeControl
							label={`コンテナ max-width (${maxWidthPx || '100% (制限なし)'})`}
							value={maxWidthPx}
							onChange={v=>updateAttr('maxWidthPx',v)}
							min={0} max={2000} step={10}
						/>
						<SelectControl
							label="横位置"
							value={alignClass}
							options={[
								{ label:'左寄せ',   value:'left'   },
								{ label:'中央寄せ', value:'center' },
								{ label:'右寄せ',   value:'right'  },
							]}
							onChange={v=>updateAttr('alignClass',v)}
						/>
						<SelectControl
							label="本文フォント"
							value={fontP}
							options={fontOptions}
							onChange={v=>updateAttr('fontP',v)}
						/>
						<SelectControl
							label="本文太さ"
							value={fontWeightP}
							options={fontWeightOptions}
							onChange={v=>updateAttr('fontWeightP',v)}
						/>
						<p>本文文字色</p>
						<ColorPalette
							value={colorP}
							onChange={c=>updateAttr('colorP',c)}
						/>
					</PanelBody>

					{/* 各カード設定（画像+フィルターのみ） */}
					{items.map((itm,idx)=>(
						<PanelBody key={idx} title={`画像 ${idx+1} の設定`} initialOpen={false}>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										updateItem(idx, 'imgSrc', media.url);
										updateItem(idx, 'altText', media.alt || '');
									}}
									allowedTypes={['image']}
									value={itm.imgSrc}
									render={({ open }) => (
										<>
											{/* サムネイル＋削除ボタン */}
											{itm.imgSrc && (
												<>
													<img
														src={itm.imgSrc}
														alt={itm.altText || '選択した画像'}
														style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
													/>
													<Button
														onClick={() => {
															updateItem(idx, 'imgSrc', '');
															updateItem(idx, 'altText', '');
														}}
														variant="secondary"
														style={{ margin: '4px 4px 0 0' }}
													>
														画像を削除
													</Button>
												</>
											)}

											{/* 画像を選択 */}
											<Button onClick={open} variant="secondary">
												画像を選択
											</Button>
										</>
									)}
								/>
							</MediaUploadCheck>
							<br /><br />
							<p>フィルター色</p>
							<ColorPalette
								value={itm.fColor}
								onChange={c=>updateItem(idx,'fColor',c)}
							/>
							<RangeControl
								label="フィルター透過(0-1)"
								value={itm.fOpac}
								onChange={v=>updateItem(idx,'fOpac',v)}
								min={0} max={1} step={0.05}
							/>
							<SelectControl
								label="ブレンドモード"
								value={itm.fBlend}
								options={blendOptions}
								onChange={v=>updateItem(idx,'fBlend',v)}
							/>
						</PanelBody>
					))}
				</InspectorControls>

				{/* ===== ビジュアルエディタ ===== */}
				<div
					className={`lw-image-2 ${alignClass}`}
					style={{ maxWidth: maxWidthPx ? `${maxWidthPx}px` : '100%' }}
				>
					{items.map((itm,idx)=>(
						<div
							className={`image__inner ${numClass(idx)}`}
							key={idx}
							style={{
								borderRadius:`${borderRadiusEm}em`,
								aspectRatio:`1000 / ${aspectHeight}`,
							}}
						>
							<img src={itm.imgSrc} alt={itm.altText||''}/>
							<RichText
								tagName="p"
								value={itm.text}
								onChange={v=>updateItem(idx,'text',v)}
								data-lw_font_set={fontP}
								style={{
									fontWeight:fontWeightP,
									color:colorP||undefined,
								}}
							/>
							<div
								className="image_filter"
								data-color={itm.fColor}
								data-opacity={itm.fOpac}
								data-blend={itm.fBlend}
								style={{
									backgroundColor:itm.fColor,
									opacity:itm.fOpac,
									mixBlendMode:itm.fBlend,
								}}
							/>
						</div>
					))}
				</div>
			</Fragment>
		);
	},

	/* ======================================================
	 * フロント出力
	 * ==================================================== */
	save({ attributes }){
		const {
			borderRadiusEm, aspectHeight,
			fontP, fontWeightP, colorP,
			maxWidthPx, alignClass,
			items,
		} = attributes;

		const numClass = i=>`no_${i+1}`;

		return (
			<div
				className={`lw-image-2 ${alignClass}`}
				style={{ maxWidth: maxWidthPx ? `${maxWidthPx}px` : '100%' }}
			>
				{items.map((itm,idx)=>(
					<div
						className={`image__inner ${numClass(idx)}`}
						key={idx}
						style={{
							borderRadius:`${borderRadiusEm}em`,
							aspectRatio:`1000 / ${aspectHeight}`,
						}}
					>
						<img src={itm.imgSrc} alt={itm.altText||''}/>
						<RichText.Content
							tagName="p"
							value={itm.text}
							data-lw_font_set={fontP}
							style={{
								fontWeight:fontWeightP,
								color:colorP||undefined,
							}}
						/>
						<div
							className="image_filter"
							data-color={itm.fColor}
							data-opacity={itm.fOpac}
							data-blend={itm.fBlend}
							style={{
								backgroundColor:itm.fColor,
								opacity:itm.fOpac,
								mixBlendMode:itm.fBlend,
							}}
						/>
					</div>
				))}
			</div>
		);
	},
});
