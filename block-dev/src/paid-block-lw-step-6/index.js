/**
 * paid-block-lw-step-6 – フルコード（最終・バリデーション完全対応版）
 * ------------------------------------------------------------
 *  • .number 背景色一括変更／太字（数字のみ保持して <span> 1 枚で出力）
 *  • .number は PlainText で自由入力可（空なら自動連番をプレースホルダー表示）
 *  • サイドバーで .number・li 枠線・img object-fit・aspect-ratio を切替
 *  • edit() / save() の HTML 構造を完全一致させ、Block Validation Failed を解消
 * ----------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	PlainText,
	MediaUpload,
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

/* ──────────────────── 共通オプション ─────────────────── */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const sizeOptions = [
	{ label: '大 (L)', value: 'font_size_l' },
	{ label: '中 (M)', value: 'font_size_m' },
	{ label: '小 (S)', value: 'font_size_s' },
];
const objectFitOptions = [
	{ label: 'cover（トリミング）', value: 'cover' },
	{ label: 'contain（全体表示）', value: 'contain' },
];

/* ───────────────────── ブロック登録 ──────────────────── */
registerBlockType('wdl/paid-block-lw-step-6', {
	title   : 'step 06',
	icon    : 'lightbulb',
	category: 'liteword-other',
	supports: { anchor: true },

	/* ───────── 属性定義 ───────── */
	attributes: {
		/* タイトル */
		fontLi        : { type: 'string', default: '' },
		fontColorLi   : { type: 'string', default: '' },
		fontWeightLi  : { type: 'string', default: '600' },
		titleFontSizeClass: { type: 'string', default: 'font_size_m' },

		/* 説明文 */
		fontLiP          : { type: 'string', default: '' },
		fontColorLiP     : { type: 'string', default: 'var(--color-black)' },
		fontWeightLiP    : { type: 'string', default: '400' },
		textFontSizeClass: { type: 'string', default: 'font_size_m' },

		/* 画像枠線 */
		borderColor      : { type: 'string', default: 'var(--color-main)' },
		borderSize       : { type: 'number', default: 0 },
		imageBorderRadius: { type: 'number', default: 0 },

		/* 画像表示設定 */
		imageObjectFit : { type: 'string', default: 'cover' },  // object-fit
		imageAspectH   : { type: 'number', default: 300 },      // aspect-ratio 高さ（400 / H）

		/* タイトル装飾 */
		titleTag         : { type: 'string', default: 'h3' },
		titleBorderColor : { type: 'string', default: 'var(--color-main)' },
		titleBorderSize  : { type: 'number', default: 2 },

		/* 番号 */
		numberBgColor: { type: 'string', default: 'var(--color-main)' },
		showNumber   : { type: 'boolean', default: true },

		/* li 枠線 */
		liBorderColor : { type: 'string', default: '#ccc' },
		liBorderSize  : { type: 'number', default: 1 },
		liBorderRadius: { type: 'number', default: 0 },

		/* リスト本体 */
		contents: {
			type    : 'array',
			source  : 'query',
			selector: '.paid-block-lw-step-6__li',
			query   : {
				image : { type: 'string', source: 'attribute', selector: 'img',          attribute: 'src' },
				ttl   : { type: 'string', source: 'html',      selector: '.ttl' },
				text  : { type: 'string', source: 'html',      selector: '.paid-block-lw-step-6__text' },
				url   : { type: 'string', source: 'attribute', selector: '.link',        attribute: 'href', default: '' },
				number: { type: 'string', source: 'text',      selector: '.number > span' }, // ★ 修正
			},
			default: [
				{
					image : 'https://lite-word.com/sample_img/school/9.webp',
					ttl   : '難関校合格実績',
					text  : '〇〇中学、××高校など、難関校への高い合格実績が自慢です。経験豊富なプロ講師陣が、志望校合格まで徹底的にサポートします。',
					number: '',
				},
				{
					image : 'https://lite-word.com/sample_img/school/5.webp',
					ttl   : '合格への最短ルート',
					text  : '長年の指導ノウハウを結集したオリジナル教材とカリキュラムで、基礎から応用まで無駄なく効率的に学力を伸ばし、合格へと導きます。',
					number: '',
				},
				{
					image : 'https://lite-word.com/sample_img/school/3.webp',
					ttl   : '自習室完備＆質問OK',
					text  : '静かで集中できる自習室を完備しています。わからないことはいつでも講師に質問可能。学習相談や進路指導も充実、安心して学習に専念できます。',
					number: '',
				},
			],
		},
	},

	/* ───────────────────── エディター側 ───────────────────── */
	edit({ attributes, setAttributes }) {
		const {
			fontLi, fontColorLi, fontWeightLi, titleFontSizeClass,
			fontLiP, fontColorLiP, fontWeightLiP, textFontSizeClass,
			borderColor, borderSize, imageBorderRadius,
			imageObjectFit, imageAspectH,
			titleTag, titleBorderColor, titleBorderSize,
			numberBgColor, showNumber,
			liBorderColor, liBorderSize, liBorderRadius,
			contents,
		} = attributes;

		/* リスト操作ヘルパー */
		const addContent = () =>
			setAttributes({ contents: [...contents, { image: '', ttl: '', text: '', url: '', number: '' }] });

		const removeContent = (i) =>
			setAttributes({ contents: contents.filter((_, idx) => idx !== i) });

		const updateContent = (i, key, val) => {
			const arr = [...contents];
			arr[i][key] = val;
			setAttributes({ contents: arr });
		};

		return (
			<Fragment>
				{/* ──────────────── サイドバー UI ──────────────── */}
				<InspectorControls>
					<PanelBody title="スタイル設定">
						{/* 画像枠線 */}
						<p>画像枠線の色</p>
						<ColorPalette value={borderColor} onChange={(v) => setAttributes({ borderColor: v })} />
						<RangeControl label="画像枠線の太さ" value={borderSize} onChange={(v) => setAttributes({ borderSize: v })} min={0} max={10} />
						<RangeControl label="画像角丸(px)" value={imageBorderRadius} onChange={(v) => setAttributes({ imageBorderRadius: v })} min={0} max={100} />

						{/* 画像表示設定 */}
						<SelectControl
							label="画像サイズ (object-fit)"
							value={imageObjectFit}
							options={objectFitOptions}
							onChange={(v) => setAttributes({ imageObjectFit: v })}
							style={{ marginTop: '16px' }}
						/>
						<RangeControl
							label={`画像 aspect-ratio 高さ (400 / ${imageAspectH || 0}px)`}
							value={imageAspectH}
							onChange={(v) => setAttributes({ imageAspectH: v })}
							min={0}
							max={800}
							step={10}
						/>

						<hr />

						{/* タイトル */}
						<SelectControl label="タイトルタグ" value={titleTag} options={[
							{ label: 'h3', value: 'h3' },
							{ label: 'h4', value: 'h4' },
							{ label: 'p',  value: 'p'  },
						]} onChange={(v) => setAttributes({ titleTag: v })} />
						<p>タイトル文字色</p>
						<ColorPalette value={fontColorLi} onChange={(v) => setAttributes({ fontColorLi: v })} />
						<SelectControl label="タイトルフォント" value={fontLi} options={fontOptions} onChange={(v) => setAttributes({ fontLi: v })} />
						<SelectControl label="タイトル太さ" value={fontWeightLi} options={fontWeightOptions} onChange={(v) => setAttributes({ fontWeightLi: v })} />
						<SelectControl label="タイトルフォントサイズ" value={titleFontSizeClass} options={sizeOptions} onChange={(v) => setAttributes({ titleFontSizeClass: v })} />
						<p>タイトル下線の色</p>
						<ColorPalette value={titleBorderColor} onChange={(v) => setAttributes({ titleBorderColor: v })} />
						<RangeControl label="タイトル下線の太さ" value={titleBorderSize} onChange={(v) => setAttributes({ titleBorderSize: v })} min={0} max={10} />

						<hr />

						{/* 説明文 */}
						<p>説明文文字色</p>
						<ColorPalette value={fontColorLiP} onChange={(v) => setAttributes({ fontColorLiP: v })} />
						<SelectControl label="説明文フォント" value={fontLiP} options={fontOptions} onChange={(v) => setAttributes({ fontLiP: v })} />
						<SelectControl label="説明文太さ" value={fontWeightLiP} options={fontWeightOptions} onChange={(v) => setAttributes({ fontWeightLiP: v })} />
						<SelectControl label="説明文フォントサイズ" value={textFontSizeClass} options={sizeOptions} onChange={(v) => setAttributes({ textFontSizeClass: v })} />

						<hr />

						{/* 番号デザイン */}
						<ToggleControl
							label="番号を表示する"
							checked={showNumber}
							onChange={(v) => setAttributes({ showNumber: v })}
						/>
						<p style={{ marginTop: '8px' }}>番号の背景色</p>
						<ColorPalette value={numberBgColor} onChange={(v) => setAttributes({ numberBgColor: v })} />

						<hr />

						{/* リスト枠線 */}
						<p>リスト枠線の色</p>
						<ColorPalette value={liBorderColor} onChange={(v) => setAttributes({ liBorderColor: v })} />
						<RangeControl label="リスト枠線の太さ" value={liBorderSize} onChange={(v) => setAttributes({ liBorderSize: v })} min={0} max={10} />
						<RangeControl label="リスト角丸(px)" value={liBorderRadius} onChange={(v) => setAttributes({ liBorderRadius: v })} min={0} max={100} />
					</PanelBody>
				</InspectorControls>

				{/* ──────────────── エディター表示 ──────────────── */}
				<div className="paid-block-lw-step-6">
					<ul className="paid-block-lw-step-6__inner">
						{contents.map((c, i) => {
							const Tag   = c.url ? 'a' : 'div';
							const props = c.url
								? { href: c.url, className: 'link', onClick: (e) => e.preventDefault() }
								: { className: 'link' };

							return (
								<li
									key={i}
									className="paid-block-lw-step-6__li"
									style={{
										borderColor : liBorderColor,
										borderWidth : liBorderSize,
										borderStyle : liBorderSize > 0 ? 'solid' : 'none',
										borderRadius: `${liBorderRadius}px`,
									}}
								>
									{/* 番号 */}
									{showNumber && (
                                        <div
                                            className="number"
                                            style={{
                                                backgroundColor: numberBgColor,
                                                color          : '#fff',
                                                fontWeight     : '700',
                                            }}
                                        >
                                            <RichText         
                                                tagName="span"
                                                value={c.number}
                                                onChange={(v)=>
                                                    updateContent(i,'number', v.replace(/<[^>]+>/g,''))
                                                }
                                                placeholder={`${i + 1}`}
                                                allowedFormats={[]}  
                                                style={{ fontWeight: '700' }}
                                            />
                                        </div>
                                    )}

									{/* ここからリンク（または div）ラッパー */}
									{createElement(
										Tag,
										props,
										<>
											{/* 画像 */}
											{c.image && (
												<div
													className="image"
													style={{
														borderRadius : `${imageBorderRadius}px`,
														borderColor  ,
														borderWidth  : borderSize,
														borderStyle  : borderSize > 0 ? 'solid' : 'none',
														aspectRatio  : imageAspectH > 0 ? `400 / ${imageAspectH}` : undefined,
													}}
												>
													<img
														src={c.image}
														alt=""
														style={{ objectFit: imageObjectFit }}
													/>
												</div>
											)}

											{/* タイトル */}
											<RichText
												tagName={titleTag}
												className={`ttl ${titleFontSizeClass}`}
												value={c.ttl}
												data-lw_font_set={fontLi}
												onChange={(v) => updateContent(i, 'ttl', v)}
												placeholder="タイトル"
												style={{
													fontWeight          : fontWeightLi,
													fontFamily          : fontLi || undefined,
													color               : fontColorLi,
													borderBottomColor   : titleBorderColor,
													borderBottomWidth   : titleBorderSize,
													borderBottomStyle   : titleBorderSize > 0 ? 'solid' : 'none',
												}}
											/>

											{/* 説明文 */}
											<RichText
												tagName="p"
												className={`paid-block-lw-step-6__text ${textFontSizeClass}`}
												value={c.text}
												data-lw_font_set={fontLiP}
												onChange={(v) => updateContent(i, 'text', v)}
												placeholder="テキストを入力"
												style={{
													fontWeight: fontWeightLiP,
													fontFamily: fontLiP || undefined,
													color     : fontColorLiP,
												}}
											/>
										</>,
									)}
									{/* ここまでラッパー */}

									{/* 画像選択 UI */}
									<MediaUpload
										onSelect={(m) => updateContent(i, 'image', m.url)}
										allowedTypes={['image']}
										render={({ open }) => (
											<Button onClick={open} isSecondary>
												{c.image ? '画像を変更' : '画像を選択'}
											</Button>
										)}
									/>
									{c.image && (
										<Button
											isDestructive
											style={{ marginLeft: '8px' }}
											onClick={() => updateContent(i, 'image', '')}
										>
											画像を削除
										</Button>
									)}

									{/* URL */}
									<TextControl
										label="リンクURL"
										value={c.url || ''}
										onChange={(v) => updateContent(i, 'url', v)}
										placeholder="https://example.com/"
										style={{ marginTop: '12px', maxWidth: '300px' }}
									/>

									{/* 削除ボタン */}
									<Button
										className="paid-block-lw-step-6__remove_btn"
										isDestructive
										onClick={() => removeContent(i)}
									>
										削除
									</Button>
								</li>
							);
						})}
					</ul>

					{/* 追加ボタン */}
					<Button className="paid-block-lw-step-6__add_btn" isSecondary onClick={addContent}>
						リストを追加する
					</Button>
				</div>
			</Fragment>
		);
	},

	/* ───────────────────── 保存側 ───────────────────── */
	save({ attributes }) {
		const {
			fontLi, fontColorLi, fontWeightLi, titleFontSizeClass,
			fontLiP, fontColorLiP, fontWeightLiP, textFontSizeClass,
			borderColor, borderSize, imageBorderRadius,
			imageObjectFit, imageAspectH,
			titleTag, titleBorderColor, titleBorderSize,
			numberBgColor, showNumber,
			liBorderColor, liBorderSize, liBorderRadius,
			contents,
		} = attributes;

		return (
			<div className="paid-block-lw-step-6 wp-block-wdl-paid-block-lw-step-6">
				<ul className="paid-block-lw-step-6__inner">
					{contents.map((c, i) => {
						const numText = c.number ? c.number : `${i + 1}`;
						const Tag   = c.url ? 'a' : 'div';
						const props = c.url ? { href: c.url, className: 'link' } : { className: 'link' };

						return (
							<li
								key={i}
								className="paid-block-lw-step-6__li"
								style={{
									borderColor : liBorderColor,
									borderWidth : liBorderSize,
									borderStyle : liBorderSize > 0 ? 'solid' : 'none',
									borderRadius: `${liBorderRadius}px`,
								}}
							>
								{/* 番号 */}
								{showNumber && (
									<div
										className="number"
										style={{
											backgroundColor: numberBgColor,
											color          : '#fff',
											fontWeight     : '700',
										}}
									>
										<span>{numText}</span>
									</div>
								)}

								{createElement(
									Tag,
									props,
									<>
										{/* 画像 */}
										{c.image && (
											<div
												className="image"
												style={{
													borderRadius: `${imageBorderRadius}px`,
													borderColor ,
													borderWidth : borderSize,
													borderStyle : borderSize > 0 ? 'solid' : 'none',
													aspectRatio: imageAspectH > 0 ? `400 / ${imageAspectH}` : undefined,
												}}
											>
												<img
													src={c.image}
													alt=""
													style={{ objectFit: imageObjectFit }}
												/>
											</div>
										)}

										{/* タイトル */}
										{c.ttl && (
											<RichText.Content
												tagName={titleTag}
												className={`ttl ${titleFontSizeClass}`}
												value={c.ttl}
												data-lw_font_set={fontLi}
												style={{
													fontWeight : fontWeightLi,
													fontFamily : fontLi || undefined,
													color      : fontColorLi,
													borderBottomColor: titleBorderColor,
													borderBottomWidth: titleBorderSize,
													borderBottomStyle: titleBorderSize > 0 ? 'solid' : 'none',
												}}
											/>
										)}

										{/* 説明文 */}
										{c.text && (
											<RichText.Content
												tagName="p"
												className={`paid-block-lw-step-6__text ${textFontSizeClass}`}
												value={c.text}
												data-lw_font_set={fontLiP}
												style={{
													fontWeight: fontWeightLiP,
													fontFamily: fontLiP || undefined,
													color     : fontColorLiP,
												}}
											/>
										)}
									</>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		);
	},
});
