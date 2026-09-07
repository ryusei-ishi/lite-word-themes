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

/**
 * STEP番号の「列の幅」と「文字の大きさ」をブロック本体の CSS 変数として出す。
 * ------------------------------------------------------------
 * 🚨 **0 のときは何も出さない。** 既定値のままなら save() の出力が
 *    これまでと1文字も変わらないので、既存ページが「問題が含まれています」にならない。
 *    （新しい属性を足すときの決まり → reference/block-change-safety.md）
 * 🚨 値は必ず**単位つきの文字列**で渡す。数値のまま渡すと WordPress の書き出しが
 *    カスタムプロパティにも px を足してしまい（`--step3-no-w:3.2px`）、無効値になる。
 *
 * なぜ要るか（2026-09-07 Ryuichi 指摘）:
 *   番号の列は 2.4em 固定・番号の文字は 1.4em 固定で「01」「02」の2桁専用だった。
 *   「10時」「STEP1」のような3文字以上を入れると、タイルからはみ出して
 *   右の白地の見出しに重なる。**スマホではさらに崩れる。**
 */
const noStyle = ({ noWidthEm, noFontSizeEm }) => {
	const style = {};
	if (noWidthEm)    { style['--step3-no-w']  = `${noWidthEm}em`; }
	if (noFontSizeEm) { style['--step3-no-fs'] = `${noFontSizeEm}em`; }
	return Object.keys(style).length ? style : undefined;
};

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType(metadata.name, {
	title   : 'step 03',

	/* ======================================================
	 * 1) エディタ
	 * ==================================================== */
	edit({ attributes, setAttributes }) {
		const {
			bgGradient, ulMaxWidth,
			fontSizeClass,
			fontNo, fontWeightNo, colorNo,
			noWidthEm, noFontSizeEm,
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
			const updated = contents.map((item, i) =>
				i === idx ? { ...item, [key]: value } : item
			);
			setAttributes({ contents: updated });
		};

		
        const blockProps = useBlockProps({
            className: `paid-block-lw-step-3 ${fontSizeClass}`,
            style: noStyle(attributes),
        });

        return (
			<>
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
						<RangeControl
							label="番号の列の幅"
							value={noWidthEm}
							onChange={(v) => setAttributes({ noWidthEm: v })}
							min={0}
							max={6}
							step={0.1}
							help="0 でおまかせ（2.4）。「01」「02」の2桁ならそのままで大丈夫です。「10時」「STEP1」のように3文字以上入れるときは 3.2 前後まで広げてください。"
						/>
						<RangeControl
							label="番号の文字の大きさ"
							value={noFontSizeEm}
							onChange={(v) => setAttributes({ noFontSizeEm: v })}
							min={0}
							max={2.5}
							step={0.05}
							help="0 でおまかせ（1.4）。文字だけ小さくしても列は狭いままなので、上の「列の幅」と一緒に調整してください。"
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
				<div {...blockProps}>
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
			</>
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
			noWidthEm, noFontSizeEm,
			titleTag,
			fontH3, fontWeightH3, colorH3,
			fontP,  fontWeightP,  colorP,
			contents,
		} = attributes;

		const hasContent = (str='') => str.trim() !== '';

		const blockProps = useBlockProps.save({
			className: `paid-block-lw-step-3 ${fontSizeClass}`,
			style: noStyle(attributes),
		});

		return (
			<div {...blockProps}>
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

	deprecated: [
		{
			apiVersion: metadata.apiVersion,
			attributes: metadata.attributes,

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
		},
	],
});
