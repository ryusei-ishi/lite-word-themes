/**
 * LiteWord – Content 02（ttl に data-属性対応版・全コード）
 * ------------------------------------------------------------
 * h3.ttl：表示切替／フォント（data-属性）／色
 * p     ：色
 * 画像  ：アスペクト比（1600 / 高さ RangeControl）
 * ------------------------------------------------------------
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	SelectControl,
	ColorPalette,
	TextControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

/* ---------------- フォント選択肢 ---------------- */
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ==================================================
 * ブロック登録
 * ================================================= */
registerBlockType( 'wdl/lw-content-2', {
	title    : 'content 02',
	icon     : 'lightbulb',
	category : 'liteword-other',
	supports : { anchor : true },

	/* ---------- 属性 ---------- */
	attributes : {
		contents : {
			type     : 'array',
			source   : 'query',
			selector : '.lw-content-2_content',
			query    : {
				title : {
					type     : 'string',
					source   : 'html',
					selector : '.ttl',
					default  : 'タイトル',
				},
				text : {
					type     : 'string',
					source   : 'html',
					selector : '.lw-content-2_text p',
				},
				image : {
					type     : 'string',
					source   : 'attribute',
					selector : 'figure img',
					attribute: 'src',
				},
				buttonText : {
					type     : 'string',
					source   : 'html',
					selector : '.lw-content-2_btn',
					default  : '',
				},
				buttonUrl : {
					type     : 'string',
					source   : 'attribute',
					selector : '.lw-content-2_btn',
					attribute: 'href',
					default  : '',
				},
				buttonBgColor : {
					type     : 'string',
					source   : 'attribute',
					selector : '.lw-content-2_btn',
					attribute: 'data-bgcolor',
					default  : '',
				},
				buttonTextColor : {
					type     : 'string',
					source   : 'attribute',
					selector : '.lw-content-2_btn',
					attribute: 'data-textcolor',
					default  : '#ffffff',
				},
			},
			default : [
				{
					title          : 'タイトル',
					text           : 'テキストテキストテキストテキストテキストテキストテキストテキストテキスト',
					image          : '',
					buttonText     : '',
					buttonUrl      : '',
					buttonBgColor  : 'var(--color-accent)',
					buttonTextColor: '#ffffff',
				},
				{
					title          : 'タイトル',
					text           : 'テキストテキストテキストテキストテキストテキストテキストテキストテキスト',
					image          : '',
					buttonText     : '',
					buttonUrl      : '',
					buttonBgColor  : 'var(--color-accent)',
					buttonTextColor: '#ffffff',
				},
				{
					title          : 'タイトル',
					text           : 'テキストテキストテキストテキストテキストテキストテキストテキストテキスト',
					image          : '',
					buttonText     : '',
					buttonUrl      : '',
					buttonBgColor  : 'var(--color-accent)',
					buttonTextColor: '#ffffff',
				},
			],
		},
		fontSet        : { type:'string', default:'', source:'attribute', selector:'.lw-content-2', attribute:'data-lw_font_set' },
		fontWeight     : { type:'string', default:'' },
		columnClass    : { type:'string', default:'clm_3' },

		showTitle      : { type:'boolean', default:false },
		titleFontSet   : { type:'string',  default:'' },
		titleFontWeight: { type:'string',  default:'' },
		titleColor     : { type:'string',  default:'' },

		textColor      : { type:'string',  default:'' },

		imageHeight    : { type:'number',  default:1200 }, // 幅は 1600 固定
	},

	/* ==================================================
	 * エディター
	 * ================================================= */
	edit( { attributes, setAttributes } ) {
		const {
			contents, fontSet, fontWeight, columnClass,
			showTitle, titleFontSet, titleFontWeight, titleColor,
			textColor, imageHeight,
		} = attributes;

		/* ----- 配列操作 ----- */
		const addContent = () => {
			setAttributes( {
				contents : [
					...contents,
					{
						title          : 'タイトル',
						text           : '新しいテキスト',
						image          : '',
						buttonText     : '詳細を見る',
						buttonUrl      : '',
						buttonBgColor  : '#000000',
						buttonTextColor: '#ffffff',
					},
				],
			} );
		};
		const removeContent = ( i ) =>
			setAttributes( { contents : contents.filter( ( _, idx ) => idx !== i ) } );
		const updateContent = ( i, key, val ) => {
			const arr = [ ...contents ];
			arr[i][key] = val;
			setAttributes( { contents : arr } );
		};

		return (
			<div
				className={`lw-content-2 ${columnClass}`}
				data-lw_font_set={fontSet}
				style={{ '--lw-img-h': `${imageHeight}px` }}
			>
				<InspectorControls>
                    {/* カラム */}
					<PanelBody title="カラム数">
						<SelectControl
							label="カラム数"
							value={columnClass}
							options={[
								{ label:'2カラム', value:'clm_2' },
								{ label:'3カラム', value:'clm_3' },
								{ label:'4カラム', value:'clm_4' },
							]}
							onChange={( v ) => setAttributes( { columnClass : v } )}
						/>
					</PanelBody>
                    {/* タイトル */}
					<PanelBody title="タイトル" initialOpen={false}>
						<ToggleControl
							label="タイトルを表示"
							checked={showTitle}
							onChange={( v ) => setAttributes( { showTitle : v } )}
						/>
						<SelectControl
							label="フォント種類"
							value={titleFontSet}
							options={fontOptions}
							onChange={( v ) => setAttributes( { titleFontSet : v } )}
						/>
						<SelectControl
							label="フォント太さ"
							value={titleFontWeight}
							options={fontWeightOptions}
							onChange={( v ) => setAttributes( { titleFontWeight : v } )}
						/>
						<p>タイトル文字色</p>
						<ColorPalette
							value={titleColor}
							onChange={( c ) => setAttributes( { titleColor : c } )}
						/>
					</PanelBody>
					{/* 本文フォント */}
					<PanelBody title="本文フォント">
						<SelectControl
							label="フォント種類"
							value={fontSet}
							options={fontOptions}
							onChange={( v ) => setAttributes( { fontSet : v } )}
						/>
						<SelectControl
							label="フォント太さ"
							value={fontWeight}
							options={fontWeightOptions}
							onChange={( v ) => setAttributes( { fontWeight : v } )}
						/>
						<p>本文文字色</p>
						<ColorPalette
							value={textColor}
							onChange={( c ) => setAttributes( { textColor : c } )}
						/>
					</PanelBody>



					{/* 画像比率 */}
					<PanelBody title="画像アスペクト比 (高さ px)" initialOpen={false}>
						<RangeControl
							label="高さ(px) – 幅は1600固定"
							min={400}
							max={2000}
							step={10}
							value={imageHeight}
							onChange={( v ) => setAttributes( { imageHeight : v } )}
						/>
					</PanelBody>

					{/* 各コンテンツ */}
					{contents.map( ( c, i ) => (
						<PanelBody key={i} title={`コンテンツ ${i + 1}`} initialOpen={false}>
							{/* 画像 */}
							<div className="image-preview" style={{ marginBottom:'10px' }}>
								{c.image && (
									<img
										src={c.image}
										alt=""
										style={{ width:'100%', height:'auto', borderRadius:'5px', boxShadow:'0 2px 4px rgba(0,0,0,.1)' }}
									/>
								)}
							</div>
							<MediaUpload
								allowedTypes={['image']}
								value={c.image}
								onSelect={( m ) => updateContent( i, 'image', m.url )}
								render={({ open }) => (
									<Button isSecondary onClick={open} style={{ marginBottom:'10px' }}>
										画像を選択
									</Button>
								)}
							/>
							{/* ボタン色 */}
							<p>ボタン背景色</p>
							<ColorPalette
								value={c.buttonBgColor}
								onChange={( col ) => updateContent( i, 'buttonBgColor', col )}
							/>
							<p>ボタン文字色</p>
							<ColorPalette
								value={c.buttonTextColor}
								onChange={( col ) => updateContent( i, 'buttonTextColor', col )}
							/>
							{/* 削除 */}
							<Button isDestructive onClick={() => removeContent( i )} style={{ marginTop:'10px' }}>
								このコンテンツを削除
							</Button>
						</PanelBody>
					) ) }
					<Button isPrimary onClick={addContent} style={{ margin:'20px 0' }}>
						コンテンツを追加
					</Button>
				</InspectorControls>

				{/* ----- 出力 ----- */}
				<div className="lw-content-2_inner">
					{contents.map( ( c, i ) => (
						<div className="lw-content-2_content" key={i}>
							{showTitle && (
								<RichText
									tagName="h3"
									className="ttl"
									value={c.title}
									onChange={( v ) => updateContent( i, 'title', v )}
									placeholder="タイトルを入力"
									style={{
										color      : titleColor || undefined,
										fontWeight : titleFontWeight || undefined,
									}}
									data-lw_font_set={titleFontSet || undefined}
									data-lw_font_weight={titleFontWeight || undefined}
								/>
							)}
							<figure style={{ aspectRatio:`1600 / ${imageHeight}` }}>
								<img
									src={c.image || 'https://placehold.jp/cccccc/ffffff/400x400.png?text=IMAGE'}
									alt={`solution image ${i + 1}`}
									style={{ objectFit:'cover', width:'100%', height:'100%' }}
								/>
							</figure>
							<div className="lw-content-2_text">
								<RichText
									tagName="p"
									value={c.text}
									onChange={( v ) => updateContent( i, 'text', v )}
									placeholder="テキストを入力"
									style={{ fontWeight:fontWeight, color:textColor || undefined }}
								/>
								<div className="lw-content-2_btn-settings">
									<TextControl
										label="リンクテキスト"
										value={c.buttonText}
										onChange={( v ) => updateContent( i, 'buttonText', v )}
									/>
									<TextControl
										label="リンクURL"
										value={c.buttonUrl}
										onChange={( v ) => updateContent( i, 'buttonUrl', v )}
									/>
								</div>
							</div>
						</div>
					) ) }
				</div>
			</div>
		);
	},

	/* ==================================================
	 * 保存
	 * ================================================= */
	save( { attributes } ) {
		const {
			contents, fontSet, fontWeight, columnClass,
			showTitle, titleFontSet, titleFontWeight, titleColor,
			textColor, imageHeight,
		} = attributes;

		return (
			<div className={`lw-content-2 ${columnClass}`} data-lw_font_set={fontSet}>
				<div className="lw-content-2_inner">
					{contents.map( ( c, i ) => (
						<div className="lw-content-2_content" key={i}>
							{showTitle && (
								<RichText.Content
									tagName="h3"
									className="ttl"
									value={c.title}
									data-lw_font_set={titleFontSet || undefined}
									data-lw_font_weight={titleFontWeight || undefined}
									style={{ color:titleColor || undefined }}
								/>
							)}
							<figure style={{ aspectRatio:`1600 / ${imageHeight}` }}>
								<img
									loading="lazy"
									src={c.image || 'https://placehold.jp/cccccc/ffffff/400x400.png?text=IMAGE'}
									alt={`solution image ${i + 1}`}
									style={{ objectFit:'cover', width:'100%', height:'100%' }}
								/>
							</figure>
							<div className="lw-content-2_text">
								<RichText.Content
									tagName="p"
									value={c.text}
									style={{
										whiteSpace:'pre-wrap',
										fontWeight:fontWeight,
										color:textColor || undefined,
									}}
								/>
								{c.buttonText && (
									<a
										href={c.buttonUrl || '#'}
										className="lw-content-2_btn"
										data-bgcolor={c.buttonBgColor}
										data-textcolor={c.buttonTextColor}
										style={{ backgroundColor:c.buttonBgColor, color:c.buttonTextColor }}
									>
										{c.buttonText}
									</a>
								)}
							</div>
						</div>
					) ) }
				</div>
			</div>
		);
	},
} );
