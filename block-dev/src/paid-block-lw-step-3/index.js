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
	RadioControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

/* ===== 共通オプション ===== */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType('wdl/paid-block-lw-step-3', {
	title   : 'step 03',
	icon    : 'lightbulb',
	category: 'liteword-other',
	supports: { anchor: true },

	attributes: {
		bgGradient : { type: 'string',  default: 'var(--color-main)' },
		ulMaxWidth : { type: 'number',  default: 1080 },

		/* 全体フォントサイズクラス */
		fontSizeClass: { type: 'string', default: 'font_size_m' },

		/* STEP番号 */
		fontNo       : { type: 'string', default: 'Murecho' },
		fontWeightNo : { type: 'string', default: '600' },
		colorNo      : { type: 'string', default: '' },

		/* タイトル */
		titleTag     : { type: 'string', default: 'h3' },
		fontH3       : { type: 'string', default: '' },
		fontWeightH3 : { type: 'string', default: '' },
		colorH3      : { type: 'string', default: '' },

		/* 段落 */
		fontP        : { type: 'string', default: '' },
		fontWeightP  : { type: 'string', default: '' },
		colorP       : { type: 'string', default: '' },

		/* コンテンツ */
		contents: {
			type   : 'array',
			source : 'query',
			selector: '.lw-step-2__li',
			query  : {
				no   : { type: 'string', source: 'html', selector: '.lw-step-2__li_no' },
				title: { type: 'string', source: 'html', selector: '.lw-step-2__li_title' },
				text : { type: 'string', source: 'html', selector: '.lw-step-2__li_text' },
			},
			default: [
				{ no: '01', title: '応募', text: '応募フォームより必要事項を入力し、送信してください。応募内容を確認し、追って担当者よりご連絡いたします。' },
				{ no: '02', title: '書類選考', text: 'ご応募いただいた内容をもとに、書類選考を行います。結果は1週間以内にメールにてお知らせいたします。' },
				{ no: '03', title: '面接',     text: '書類選考に通過された方には、担当者による面接を実施します。面接日時はご相談の上、決定いたします。' },
			],
		},
	},

	/* ======================================================
	 * 1) エディタ
	 * ==================================================== */
	edit({ attributes, setAttributes }) {
		const {
			bgGradient, ulMaxWidth,
			fontSizeClass,
			fontNo, fontWeightNo, colorNo,
			titleTag,
			fontH3, fontWeightH3, colorH3,
			fontP,  fontWeightP,  colorP,
			contents,
		} = attributes;

		/* データ操作関数 */
		const addContent = () => {
			const nextNo = String(contents.length + 1).padStart(2, '0');
			setAttributes({
				contents: [...contents, { no: nextNo, title: '', text: '' }],
			});
		};
		const removeContent = (idx) =>
			setAttributes({ contents: contents.filter((_, i) => i !== idx) });
		const updateContent = (idx, key, value) => {
			const updated = [...contents];
			updated[idx][key] = value;
			setAttributes({ contents: updated });
		};

		return (
			<Fragment>
				<InspectorControls>
					{/* --- 全体設定 --- */}
					<PanelBody title="レイアウト全体" initialOpen={true}>
						<RadioControl
							label="フォントサイズ"
							selected={fontSizeClass}
							options={[
								{ label: '大 (L)', value: 'font_size_l' },
								{ label: '中 (M)', value: 'font_size_m' },
								{ label: '小 (S)', value: 'font_size_s' },
							]}
							onChange={(v) => setAttributes({ fontSizeClass: v })}
						/>
						<RangeControl
							label="最大横幅"
							value={ulMaxWidth}
							onChange={(v) => setAttributes({ ulMaxWidth: v })}
							min={600}
							max={1280}
							step={1}
						/>
						<p>枠・STEP番号背景色</p>
						<ColorPalette
							value={bgGradient}
							onChange={(c) => setAttributes({ bgGradient: c })}
						/>
					</PanelBody>

					{/* --- STEP番号設定 --- */}
					<PanelBody title="STEP番号の書式" initialOpen={false}>
						<SelectControl
							label="フォント"
							value={fontNo}
							options={fontOptions}
							onChange={(v) => setAttributes({ fontNo: v })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightNo}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ fontWeightNo: v })}
						/>
						<p>文字色</p>
						<ColorPalette
							value={colorNo}
							onChange={(c) => setAttributes({ colorNo: c })}
						/>
					</PanelBody>

					{/* --- タイトル設定 --- */}
					<PanelBody title="タイトルの書式" initialOpen={false}>
						<SelectControl
							label="タグ"
							value={titleTag}
							options={[
								{ label: 'h2', value: 'h2' },
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'p',  value: 'p' },
							]}
							onChange={(v) => setAttributes({ titleTag: v })}
						/>
						<SelectControl
							label="フォント"
							value={fontH3}
							options={fontOptions}
							onChange={(v) => setAttributes({ fontH3: v })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightH3}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ fontWeightH3: v })}
						/>
						<p>文字色</p>
						<ColorPalette
							value={colorH3}
							onChange={(c) => setAttributes({ colorH3: c })}
						/>
					</PanelBody>

					{/* --- 段落設定 --- */}
					<PanelBody title="本文の書式" initialOpen={false}>
						<SelectControl
							label="フォント"
							value={fontP}
							options={fontOptions}
							onChange={(v) => setAttributes({ fontP: v })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightP}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ fontWeightP: v })}
						/>
						<p>文字色</p>
						<ColorPalette
							value={colorP}
							onChange={(c) => setAttributes({ colorP: c })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* ---------- エディタ表示 ---------- */}
				<div className={`paid-block-lw-step-3 ${fontSizeClass}`}>
					<ul className="lw-step-2__inner" style={{ maxWidth: ulMaxWidth }}>
						{contents.map((c, i) => (
							<li
								className="lw-step-2__li"
								key={i}
								style={{ borderColor: bgGradient }}
							>
								{/* STEP番号 */}
								<RichText
									tagName="div"
									className="lw-step-2__li_no"
									value={c.no}
									onChange={(v) => updateContent(i, 'no', v)}
									data-lw_font_set={fontNo}
									style={{
										fontWeight: fontWeightNo,
										background: bgGradient,
										color: colorNo || undefined,
									}}
								/>

								<div className="lw-step-2__li_in">
									{/* タイトル */}
									<RichText
										tagName={titleTag}
										className="lw-step-2__li_title ttl"
										value={c.title}
										onChange={(v) => updateContent(i, 'title', v)}
										data-lw_font_set={fontH3}
										placeholder="タイトルを入力"
										style={{
											fontWeight: fontWeightH3,
											color: colorH3 || undefined,
										}}
									/>
									{/* 本文 */}
									<RichText
										tagName="p"
										className="lw-step-2__li_text"
										value={c.text}
										onChange={(v) => updateContent(i, 'text', v)}
										data-lw_font_set={fontP}
										placeholder="テキストを入力"
										style={{
											fontWeight: fontWeightP,
											color: colorP || undefined,
										}}
									/>
								</div>

								<button
									type="button"
									className="lw-step-2__remove_btn"
									onClick={() => removeContent(i)}
								>
									削除
								</button>
							</li>
						))}
					</ul>

					<button
						type="button"
						className="lw-step-2__add_btn"
						onClick={addContent}
					>
						リストを追加する
					</button>
				</div>
			</Fragment>
		);
	},

	/* ======================================================
	 * 2) フロント出力
	 * ==================================================== */
	save({ attributes }) {
		const {
			bgGradient, ulMaxWidth,
			fontSizeClass,
			fontNo, fontWeightNo, colorNo,
			titleTag,
			fontH3, fontWeightH3, colorH3,
			fontP,  fontWeightP,  colorP,
			contents,
		} = attributes;

		const hasContent = (str='') => str.trim() !== '';

		return (
			<div className={`paid-block-lw-step-3 ${fontSizeClass}`}>
				<ul className="lw-step-2__inner" style={{ maxWidth: ulMaxWidth }}>
					{contents.map((c, i) => (
						<li
							className="lw-step-2__li"
							key={i}
							style={{ borderColor: bgGradient }}
						>
							{/* STEP番号 */}
							<RichText.Content
								tagName="div"
								className="lw-step-2__li_no"
								value={c.no}
								data-lw_font_set={fontNo}
								style={{
									fontWeight: fontWeightNo,
									background: bgGradient,
									color: colorNo || undefined,
								}}
							/>

							<div className="lw-step-2__li_in">
								{/* タイトル */}
								{hasContent(c.title) && (
									<RichText.Content
										tagName={titleTag}
										className="lw-step-2__li_title ttl"
										value={c.title}
										data-lw_font_set={fontH3}
										style={{
											fontWeight: fontWeightH3,
											color: colorH3 || undefined,
										}}
									/>
								)}

								{/* 本文 */}
								{hasContent(c.text) && (
									<RichText.Content
										tagName="p"
										className="lw-step-2__li_text"
										value={c.text}
										data-lw_font_set={fontP}
										style={{
											fontWeight: fontWeightP,
											color: colorP || undefined,
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
