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
	ToggleControl,
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
registerBlockType('wdl/lw-pr-step-7', {
	title   : 'step 07',
	icon    : 'list-view',
	category: 'liteword-other',
	supports: { anchor: true },

	attributes: {
		circleBgColor : { type: 'string',  default: '#4a9d9c' },
		cardBgColor   : { type: 'string',  default: '#ffffff' },
		borderColor   : { type: 'string',  default: '#e0e0e0' },
		ulMaxWidth    : { type: 'number',  default: 1200 },
		columnCountPc : { type: 'number',  default: 3 },
		columnCountSp : { type: 'number',  default: 2 },
		// 旧属性（互換性のため残す）
		columnCount   : { type: 'number' },

		/* 全体フォントサイズクラス */
		fontSizeClass: { type: 'string', default: 'font_size_m' },

		/* STEP番号 */
		fontNo       : { type: 'string', default: 'Murecho' },
		fontWeightNo : { type: 'string', default: '700' },
		colorNo      : { type: 'string', default: '#ffffff' },

		/* タイトル */
		titleTag     : { type: 'string', default: 'h3' },
		fontH3       : { type: 'string', default: '' },
		fontWeightH3 : { type: 'string', default: '600' },
		colorH3      : { type: 'string', default: '#333333' },

		/* 段落 */
		fontP        : { type: 'string', default: '' },
		fontWeightP  : { type: 'string', default: '400' },
		colorP       : { type: 'string', default: '#666666' },

		/* コンテンツ */
		contents: {
			type   : 'array',
			source : 'query',
			selector: '.lw-pr-step-7__li',
			query  : {
				title: { type: 'string', source: 'html', selector: '.lw-pr-step-7__li_title' },
				text : { type: 'string', source: 'html', selector: '.lw-pr-step-7__li_text' },
			},
			default: [
				{ title: '', text: '説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テ' },
				{ title: '', text: '説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テ' },
				{ title: '', text: '説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テ' },
			],
		},
	},

	/* ======================================================
	 * 1) エディタ
	 * ==================================================== */
	edit({ attributes, setAttributes }) {
		const {
			circleBgColor, cardBgColor, borderColor, ulMaxWidth, columnCountPc, columnCountSp, columnCount,
			fontSizeClass,
			fontNo, fontWeightNo, colorNo,
			titleTag,
			fontH3, fontWeightH3, colorH3,
			fontP,  fontWeightP,  colorP,
			contents,
		} = attributes;

		// 旧属性からの移行処理
		if (columnCount !== undefined && (columnCountPc === 3 && columnCountSp === 2)) {
			setAttributes({
				columnCountPc: columnCount,
				columnCountSp: columnCount,
				columnCount: undefined
			});
		}

		// 表示用の最終値（フォールバック処理）
		const finalColumnPc = columnCountPc || columnCount || 3;
		const finalColumnSp = columnCountSp || columnCount || 2;

		/* データ操作関数 */
		const addContent = () => {
			setAttributes({
				contents: [...contents, { title: '', text: '' }],
			});
		};
		const removeContent = (idx) =>
			setAttributes({ contents: contents.filter((_, i) => i !== idx) });
		const updateContent = (idx, key, value) => {
			const updated = [...contents];
			updated[idx][key] = value;
			setAttributes({ contents: updated });
		};

		/* 順番入れ替え関数（lw-list-4から移植） */
		const moveItem = (index, direction) => {
			const targetIndex = index + direction;
			if (targetIndex < 0 || targetIndex >= contents.length) return;

			const reordered = [...contents];
			const [moved] = reordered.splice(index, 1);
			reordered.splice(targetIndex, 0, moved);

			setAttributes({ contents: reordered });
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
						<RangeControl
							label="カラム数（PC）"
							value={finalColumnPc}
							onChange={(v) => setAttributes({ columnCountPc: v, columnCount: undefined })}
							min={1}
							max={3}
							step={1}
						/>
						<RangeControl
							label="カラム数（スマホ）"
							value={finalColumnSp}
							onChange={(v) => setAttributes({ columnCountSp: v, columnCount: undefined })}
							min={1}
							max={3}
							step={1}
						/>
						<p>STEP番号の背景色</p>
						<ColorPalette
							value={circleBgColor}
							onChange={(c) => setAttributes({ circleBgColor: c })}
						/>
						<p>カードの背景色</p>
						<ColorPalette
							value={cardBgColor}
							onChange={(c) => setAttributes({ cardBgColor: c })}
						/>
						<p>カードの枠線色</p>
						<ColorPalette
							value={borderColor}
							onChange={(c) => setAttributes({ borderColor: c })}
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
				<div className={`lw-pr-step-7 ${fontSizeClass}`}>
					<ul
						className="lw-pr-step-7__inner"
						style={{
							maxWidth: ulMaxWidth,
							'--column-pc': finalColumnPc,
							'--column-sp': finalColumnSp
						}}
					>
						{contents.map((c, i) => (
							<li
								className="lw-pr-step-7__li"
								key={i}
								style={{
									backgroundColor: cardBgColor,
									borderColor: borderColor
								}}
							>
								{/* STEP番号 */}
								<div
									className="lw-pr-step-7__li_no"
									data-lw_font_set={fontNo}
									style={{
										fontWeight: fontWeightNo,
										backgroundColor: circleBgColor,
										color: colorNo || undefined,
									}}
								>
									{i + 1}
								</div>

								<div className="lw-pr-step-7__li_in">
									{/* タイトル */}
									<RichText
										tagName={titleTag}
										className="lw-pr-step-7__li_title ttl"
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
										className="lw-pr-step-7__li_text"
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

								{/* 並べ替え & 削除コントロール */}
								<div className="lw-pr-step-7-item-controls">
									<button
										type="button"
										onClick={() => moveItem(i, -1)}
										disabled={i === 0}
										className="move-up-button"
										aria-label="上へ移動"
									>
										↑
									</button>
									<button
										type="button"
										onClick={() => moveItem(i, 1)}
										disabled={i === contents.length - 1}
										className="move-down-button"
										aria-label="下へ移動"
									>
										↓
									</button>
									<button
										type="button"
										className="remove-item-button"
										onClick={() => removeContent(i)}
										aria-label="削除"
									>
										削除
									</button>
								</div>
							</li>
						))}
					</ul>

					<button
						type="button"
						className="lw-pr-step-7__add_btn"
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
			circleBgColor, cardBgColor, borderColor, ulMaxWidth, columnCountPc, columnCountSp, columnCount,
			fontSizeClass,
			fontNo, fontWeightNo, colorNo,
			titleTag,
			fontH3, fontWeightH3, colorH3,
			fontP,  fontWeightP,  colorP,
			contents,
		} = attributes;

		const hasContent = (str='') => str.trim() !== '';

		// 旧属性との互換性を保つ
		const finalColumnPc = columnCountPc || columnCount || 3;
		const finalColumnSp = columnCountSp || columnCount || 2;

		return (
			<div className={`lw-pr-step-7 ${fontSizeClass}`}>
				<ul
					className="lw-pr-step-7__inner"
					style={{
						maxWidth: ulMaxWidth,
						'--column-pc': finalColumnPc,
						'--column-sp': finalColumnSp
					}}
				>
					{contents.map((c, i) => (
						<li
							className="lw-pr-step-7__li"
							key={i}
							style={{
								backgroundColor: cardBgColor,
								borderColor: borderColor
							}}
						>
							{/* STEP番号 */}
							<div
								className="lw-pr-step-7__li_no"
								data-lw_font_set={fontNo}
								style={{
									fontWeight: fontWeightNo,
									backgroundColor: circleBgColor,
									color: colorNo || undefined,
								}}
							>
								{i + 1}
							</div>

							<div className="lw-pr-step-7__li_in">
								{/* タイトル */}
								{hasContent(c.title) && (
									<RichText.Content
										tagName={titleTag}
										className="lw-pr-step-7__li_title ttl"
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
										className="lw-pr-step-7__li_text"
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
