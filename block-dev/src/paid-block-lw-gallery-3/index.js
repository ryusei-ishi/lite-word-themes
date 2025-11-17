/*********************************************************************
 * LiteWord – Paid Block  Gallery 03（シンプル版・角丸 & 矢印色対応）
 * - メイン ＋ サムネイル連動 Swiper
 * - Swiper の CDN 読み込みはテーマ側 JS で実施（lw:swiperReady）
 * 2025-05-24  改修：画像角丸・ボタン背景色・矢印色をサイドバー設定可能に
 * 2025-05-24  追加：max-width（% → px 切替）・キャプション背景色設定
 * 2025-05-24  追加：アスペクト比（高さ px）を RangeControl で変更
 * 2025-05-24  修正：ID依存をやめてdata属性ベースに変更
 *********************************************************************/
import { registerBlockType } from '@wordpress/blocks';
import {
	MediaUpload,
	InspectorControls,
	ColorPalette
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	RangeControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import './style.scss';
import './editor.scss';

/* SVG アイコン（前後共通・左右反転で使用） */
const ArrowSVG = ( color = '#fff' ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 448 512"
		width="24"
		height="24"
	>
		<path
			d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
			fill={ color }
		/>
	</svg>
);

/* ================================================================ */
/*  ▶ ブロック登録                                                   */
/* ================================================================ */
registerBlockType( 'wdl/paid-block-lw-gallery-3', {
	title   : 'Gallery 03 画像ギャラリー',
	icon    : 'format-gallery',
	category: 'liteword-banner',

	/* -------------------------------------------------------------- */
	/*  ▶ 属性                                                        */
	/* -------------------------------------------------------------- */
	attributes: {
		images: {
			type   : 'array',
			default: [
				{
					url     : 'https://lite-word.com/sample_img/shop/1.webp',
					alt     : 'ギャラリー画像1',
					caption : ''
				},
				{
					url     : 'https://lite-word.com/sample_img/shop/2.webp',
					alt     : 'ギャラリー画像2',
					caption : ''
				},
                {
                    url     : 'https://lite-word.com/sample_img/shop/3.webp',
                    alt     : 'ギャラリー画像3',
                    caption : ''
                },
                {
                    url     : 'https://lite-word.com/sample_img/shop/4.webp',
                    alt     : 'ギャラリー画像4',
                    caption : ''
                },
                {
                    url     : 'https://lite-word.com/sample_img/shop/5.webp',
                    alt     : 'ギャラリー画像5',
                    caption : ''
                }
			]
		},
		borderRadiusEm  : { type:'number', default:0 },
		btnBgColor      : { type:'string', default:'var(--color-main)' },
		arrowColor      : { type:'string', default:'#ffffff' },
		maxWidthPx      : { type:'number', default:0 },                     // 0 = 100%
		captionBgColor  : { type:'string', default:'rgba(0,0,0,0.6)' },
		aspectHeightPx  : { type:'number', default:700 }                    // ★ アスペクト比（高さ）
	},

	/* -------------------------------------------------------------- */
	/*  ▶ Edit                                                        */
	/* -------------------------------------------------------------- */
	edit: ( { attributes, setAttributes } ) => {
		const {
			images,
			borderRadiusEm, btnBgColor, arrowColor,
			maxWidthPx, captionBgColor, aspectHeightPx
		} = attributes;

		/* 画像操作 */
		const updateImage = ( idx, key, value ) => {
			setAttributes( {
				images: images.map( ( img, i ) =>
					i === idx ? { ...img, [key]: value } : img
				)
			} );
		};
		const addImage    = () => images.length < 20 && setAttributes( { images:[ ...images, { url:'',alt:'',caption:'' } ] } );
		const removeImage = ( idx ) => images.length > 1 && setAttributes( { images: images.filter( ( _,i ) => i!==idx ) } );

		return (
			<Fragment>
				<InspectorControls>
                    {/* デザイン設定 */}
					<PanelBody title="レイアウト設定" initialOpen={ false }>
						<RangeControl
							label="画像角丸 (em)"
							min={0} max={3} step={0.1}
							value={ borderRadiusEm }
							onChange={ v => setAttributes( { borderRadiusEm:v } ) }
						/>

						<RangeControl
							label="最大横幅 max-width (px)"
							help="0 = 100%（初期値）"
							min={0} max={1600} step={10}
							value={ maxWidthPx }
							onChange={ v => setAttributes( { maxWidthPx:v } ) }
						/>

						{/* アスペクト比（高さ）設定 */}
						<RangeControl
							label="アスペクト比（高さ px）"
							help="幅 1080px に対する高さ"
							min={300} max={1200} step={10}
							value={ aspectHeightPx }
							onChange={ v => setAttributes( { aspectHeightPx:v } ) }
						/>

						<p style={ { marginTop:'1em',marginBottom:'0.5em' } }>ボタン背景色</p>
						<ColorPalette
							value={ btnBgColor }
							onChange={ c => setAttributes( { btnBgColor:c } ) }
						/>

						<p style={ { marginTop:'1em',marginBottom:'0.5em' } }>矢印カラー</p>
						<ColorPalette
							value={ arrowColor }
							onChange={ c => setAttributes( { arrowColor:c } ) }
						/>

						<p style={ { marginTop:'1em',marginBottom:'0.5em' } }>キャプション背景色</p>
						<ColorPalette
							value={ captionBgColor }
							onChange={ c => setAttributes( { captionBgColor:c } ) }
						/>
					</PanelBody>
					{/* 画像管理 */}
					<PanelBody title="画像管理" initialOpen>
						<Button variant="secondary" onClick={ addImage } disabled={ images.length>=20 }>
							画像を追加 (最大20枚)
						</Button>

						{ images.map( ( img, idx ) => (
							<div key={ idx } style={ { border:'1px solid #ddd',padding:'10px',marginTop:'10px' } }>
								<p><strong>画像 { idx+1 }</strong></p>

								<MediaUpload
									onSelect={ m => updateImage( idx,'url',m.url ) }
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										img.url ? (
											<div>
												<img
													src={ img.url }
													alt=""
													style={ { maxWidth:'100%',borderRadius:`${ borderRadiusEm }em` } }
												/>
												<Button variant="secondary" onClick={ open } style={ { marginTop:'10px' } }>変更</Button>
												<Button variant="secondary" onClick={ () => updateImage( idx,'url','' ) } style={ { marginLeft:'10px',marginTop:'10px' } }>削除</Button>
											</div>
										) : (
											<Button variant="secondary" onClick={ open }>画像を選択</Button>
										)
									) }
								/>

								<br/><br/>
								<TextControl
									label="altテキスト"
									value={ img.alt }
									onChange={ v => updateImage( idx,'alt',v ) }
								/>
								<TextControl
									label="キャプション (任意)"
									value={ img.caption }
									onChange={ v => updateImage( idx,'caption',v ) }
								/>

								<Button
									isDestructive
									onClick={ () => removeImage(idx) }
									disabled={ images.length<=1 }
									style={ { marginTop:'10px' } }
								>
									この画像を削除
								</Button>
							</div>
						) ) }
					</PanelBody>

					
				</InspectorControls>

				{/* エディター内プレビュー */}
                <div
                    className="paid-block-lw-gallery-3 editor-preview"
                    style={{
                        maxWidth: maxWidthPx ? `${maxWidthPx}px` : '100%',
                        
                    }}
                >
                    {/* ── メイン Swiper（先頭 1 枚のみ） ── */}
                    <div className="swiper lw-gallery_images_Swiper_main editor-preview"
                        style={{aspectRatio: `1080 / ${ aspectHeightPx }`}}
                    >
                        { images[0] && (
                            <img
                                src={ images[0].url }
                                alt={ images[0].alt }
                                style={{
                                    maxWidth: '100%',
                                    borderRadius: `${ borderRadiusEm }em`,
                                    
                                }}
                            />
                        ) }
                    </div>

                    {/* ── サムネイル Swiper（最大 5 枚まで） ── */}
                    <div className="swiper lw-gallery_images_Swiper_sub editor-preview">
                        { images.slice( 0, 5 ).map( ( img, i ) => (
                            <img
                                key={ i }
                                src={ img.url }
                                alt={ img.alt }
                                style={{
                                    maxWidth: '100%',
                                    marginRight: '4px',
                                    borderRadius: `${ borderRadiusEm }em`
                                }}
                            />
                        ) ) }
                    </div>
                </div>

			</Fragment>
		);
	},

	/* -------------------------------------------------------------- */
	/*  ▶ Save                                                        */
	/* -------------------------------------------------------------- */
	save: ( { attributes } ) => {
		const {
			images,
			borderRadiusEm, btnBgColor, arrowColor,
			maxWidthPx, captionBgColor, aspectHeightPx
		} = attributes;
		const slideCount = images.length;

		const swiperInit = `
(function(){
	// 全てのギャラリーを初期化
	const initAllGalleries = () => {
		// まだ初期化されていないギャラリーを全て取得
		const galleries = document.querySelectorAll('.paid-block-lw-gallery-3:not([data-swiper-initialized])');
		
		galleries.forEach((wrapper) => {
			const mainEl = wrapper.querySelector('.lw-gallery_images_Swiper_main');
			if (!mainEl || typeof Swiper === 'undefined') return;
			
			// 初期化済みマークを付ける
			wrapper.setAttribute('data-swiper-initialized', 'true');
			
			const slideCount = parseInt(mainEl.dataset.slideCount || '0', 10);
			const mainLoopFlg = slideCount > 1;
			
			let thumbsSwiper = null;
			if (mainLoopFlg) {
				const thumbEl = wrapper.querySelector('.lw-gallery_images_Swiper_sub');
				if (thumbEl) {
					// サムネイルのループは、スライド数が表示数の2倍以上の場合のみ有効
					const thumbSlidesPerView = Math.min(slideCount, 5);
					const thumbLoopFlg = slideCount >= (thumbSlidesPerView * 2);
					
					thumbsSwiper = new Swiper(thumbEl, {
						loop: thumbLoopFlg,
						spaceBetween: 4,
						slidesPerView: thumbSlidesPerView,
						freeMode: true,
						watchSlidesProgress: true
					});
				}
			}
			
			new Swiper(mainEl, {
				loop: mainLoopFlg,
				spaceBetween: 0,
				navigation: mainLoopFlg ? {
					nextEl: wrapper.querySelector('.swiper-button-next'),
					prevEl: wrapper.querySelector('.swiper-button-prev')
				} : {},
				thumbs: mainLoopFlg && thumbsSwiper ? { swiper: thumbsSwiper } : {}
			});
			
			wrapper.classList.remove('init-hide');
		});
	};
	
	// 初期化を確実に実行
	const tryInit = () => {
		if (typeof Swiper !== 'undefined') {
			initAllGalleries();
		} else {
			window.addEventListener('lw:swiperReady', initAllGalleries, { once: true });
		}
	};
	
	// DOMContentLoadedまたは即座に実行
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', tryInit);
	} else {
		tryInit();
	}
})();`;

		return (
			<div
				className="paid-block-lw-gallery-3 init-hide"
				style={ { maxWidth: maxWidthPx ? `${maxWidthPx}px` : '100%' } }
			>
				{/* メイン Swiper */}
				<div
					className="swiper lw-gallery_images_Swiper_main"
					data-slide-count={ slideCount }
					/* アスペクト比を inline で反映 */
					style={ { aspectRatio: `1080 / ${ aspectHeightPx }` } }
				>
					<div className="swiper-wrapper">
						{ images.map( ( img,idx ) => (
							<div
								className="swiper-slide"
								key={ idx }
								style={ { borderRadius:`${ borderRadiusEm }em` } }
							>
								<img
									src={ img.url }
									alt={ img.alt }
								/>
								{ img.caption && (
									<figcaption style={ { backgroundColor:captionBgColor } }>
										{ img.caption }
									</figcaption>
								) }
							</div>
						) ) }
					</div>

					{ slideCount > 1 && (
						<>
							<div
								className="swiper-button-next"
								style={ { backgroundColor:btnBgColor } }
							>
								{ ArrowSVG( arrowColor ) }
							</div>
							<div
								className="swiper-button-prev"
								style={ {
									backgroundColor:btnBgColor,
									transform:'scaleX(-1)'
								} }
							>
								{ ArrowSVG( arrowColor ) }
							</div>
						</>
					) }
				</div>

				{/* サムネイル Swiper */}
				{ slideCount > 1 && (
					<div className={ `swiper lw-gallery_images_Swiper_sub image_count_${slideCount}` } data-slide-count={ slideCount }>
						<div className="swiper-wrapper">
							{ images.map( ( img,idx ) => (
								<div
									className="swiper-slide"
									key={ idx }
									style={ { borderRadius:`${ borderRadiusEm }em` } }
								>
									<img
										src={ img.url }
										alt={ img.alt }
									/>
								</div>
							) ) }
						</div>
					</div>
				) }

				<script type="text/javascript" dangerouslySetInnerHTML={ { __html: swiperInit } } />
				<noscript><style>{`.paid-block-lw-gallery-3{opacity:1!important}`}</style></noscript>
			</div>
		);
	}
} );