/* ----------------------------------------------------------
 * LiteWord – 会社概要ブロック 01 (wdl/lw-company-1)
 * ----------------------------------------------------------
 * ■ 追加機能
 *   1. タイトル幅クラス（dt_width_l / m / s）を選択可
 *   2. フォントサイズクラス（font_size_l / m / s）を選択可
 *   3. dd の border-color をカラーピッカーで変更可
 *   4. ★行間(line-height) を dt/dd 共通で調整可
 *   5. ★順番入れ替え機能
 *   6. ★レスポンシブ設定（スマホ時のレイアウト）
 * -------------------------------------------------------- */

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
	ToggleControl,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* -----------------------------------------------
   セレクトオプション
------------------------------------------------ */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* -----------------------------------------------
   ブロック登録
------------------------------------------------ */
registerBlockType(metadata.name, {
	/* ---------- エディター ---------- */
	edit({ attributes, setAttributes }) {
		const {
			maxWidth, fontSizeClass, dtWidthClass, lineHeight,
			spFullDt,
			dtBackgroundColor, dtTextColor, fontDt, fontWeightDt,
			ddTextColor, fontDd, fontWeightDd,
			borderColor,
			contents,
		} = attributes;

		/* --- 追加・削除・更新 --- */
		const addContent = () => {
			setAttributes({
				contents: [...contents, { title: '新しいタイトル', text: '新しいテキスト' }],
			});
		};

		const removeContent = (idx) => {
			setAttributes({ contents: contents.filter((_, i) => i !== idx) });
		};

		const updateContent = (idx, key, val) => {
			const list = [...contents];
			list[idx][key] = val;
			setAttributes({ contents: list });
		};

		/* --- 順番入れ替え関数 --- */
		const moveItem = (index, direction) => {
			const targetIndex = index + direction;
			if (targetIndex < 0 || targetIndex >= contents.length) return;
			
			const reordered = [...contents];
			const [moved] = reordered.splice(index, 1);
			reordered.splice(targetIndex, 0, moved);
			
			setAttributes({ contents: reordered });
		};

		const blockProps = useBlockProps({
			className: 'lw-company-1'
		});

		/* --- JSX --- */
		return (
			<>
				<InspectorControls>
					{/* ■ レイアウト設定 - 必ず最初に配置、デフォルトで開いた状態 */}
					<PanelBody title="レイアウト設定" initialOpen={true}>
						{/* 最大横幅 */}
						<RangeControl
							label="最大横幅"
							value={maxWidth}
							onChange={(value) => setAttributes({ maxWidth: value })}
							min={600}
							max={1600}
							step={20}
						/>
						{/* 項目名の幅 - dt要素の幅制御 */}
						<SelectControl
							label="項目名の幅"
							value={dtWidthClass}
							options={[
								{ label: '広い (L)', value: 'dt_width_l' },
								{ label: '中 (M)', value: 'dt_width_m' },
								{ label: '狭い (S)', value: 'dt_width_s' }
							]}
							onChange={(value) => setAttributes({ dtWidthClass: value })}
						/>
						<ToggleControl
							label="スマホ時に１カラムにする"
							checked={spFullDt}
							onChange={(value) => setAttributes({ spFullDt: value })}
						/>
						{/* フォントサイズ - 必ずRadioControlで3段階 */}
						<RadioControl
							label="フォントサイズ"
							selected={fontSizeClass}
							options={[
								{ label: '大 (L)', value: 'font_size_l' },
								{ label: '中 (M)', value: 'font_size_m' },
								{ label: '小 (S)', value: 'font_size_s' }
							]}
							onChange={(value) => setAttributes({ fontSizeClass: value })}
						/>
						
						{/* 行間 - 必要な場合のみ */}
						<RangeControl
							label="行間 (line-height)"
							value={lineHeight}
							onChange={(value) => setAttributes({ lineHeight: value })}
							min={0.8}
							max={3.0}
							step={0.1}
						/>
						<p>枠線の色</p>
						<ColorPalette
							value={borderColor}
							onChange={(color) => setAttributes({ borderColor: color })}
						/>
					</PanelBody>

					{/* ■ 項目名（dt）設定 - 閉じた状態 */}
					<PanelBody title="項目名のフォント・色など" initialOpen={false}>
						<p>背景色</p>
						<ColorPalette
							value={dtBackgroundColor}
							onChange={(color) => setAttributes({ dtBackgroundColor: color })}
						/>
						
						<p>文字色</p>
						<ColorPalette
							value={dtTextColor}
							onChange={(color) => setAttributes({ dtTextColor: color })}
						/>
						
						<SelectControl
							label="フォント"
							value={fontDt}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontDt: value })}
						/>
						
						<SelectControl
							label="フォントの太さ"
							value={fontWeightDt}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeightDt: value })}
						/>
					</PanelBody>

					{/* ■ 内容（dd）設定 - 閉じた状態 */}
					<PanelBody title="内容のフォント・色など" initialOpen={false}>
						<p>文字色</p>
						<ColorPalette
							value={ddTextColor}
							onChange={(color) => setAttributes({ ddTextColor: color })}
						/>
						
						<SelectControl
							label="フォント"
							value={fontDd}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontDd: value })}
						/>
						
						<SelectControl
							label="フォントの太さ"
							value={fontWeightDd}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeightDd: value })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* ビジュアル */}
				<div {...blockProps}>
					<div
						className="lw-company-1__inner"
						style={{ maxWidth: maxWidth }}
					>
						{contents.map((c, i) => (
							<dl
								key={i}
								className={`lw-company-1__dl ${dtWidthClass} ${fontSizeClass} ${spFullDt ? 'sp_clm_1' : ''}`}
								style={{ position: 'relative' }}
							>
								<RichText
									tagName="dt"
									className='edit_in'
									value={c.title}
									onChange={(v) => updateContent(i, 'title', v)}
									placeholder="タイトル"
									style={{
										backgroundColor: dtBackgroundColor || undefined,
										color: dtTextColor,
										fontWeight: fontWeightDt,
										lineHeight: lineHeight,
									}}
									data-lw_font_set={fontDt}
								/>
								<RichText
									tagName="dd"
									className='edit_in'
									value={c.text}
									onChange={(v) => updateContent(i, 'text', v)}
									placeholder="テキスト"
									style={{
										color: ddTextColor,
										fontWeight: fontWeightDd,
										borderColor: borderColor,
										lineHeight: lineHeight,
									}}
									data-lw_font_set={fontDd}
								/>
								
								{/* 並べ替え & 削除コントロール */}
								<div className="lw-table-item-controls">
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
							</dl>
						))}
					</div>
					<button
						className="add-item-button"
						onClick={addContent}
						style={{ marginTop: 12 }}
					>
						リストを追加する
					</button>
				</div>
			</>
		);
	},

	/* ---------- 保存 ---------- */
	save({ attributes }) {
		const {
			maxWidth, fontSizeClass, dtWidthClass, lineHeight,
			spFullDt,
			dtBackgroundColor, dtTextColor, fontDt, fontWeightDt,
			ddTextColor, fontDd, fontWeightDd,
			borderColor,
			contents,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: 'lw-company-1'
		});

		return (
			<div {...blockProps}>
				<div
					className="lw-company-1__inner"
					style={{ maxWidth: maxWidth }}
				>
					{contents.map((c, i) => (
						<dl
							key={i}
							className={`lw-company-1__dl ${dtWidthClass} ${fontSizeClass} ${spFullDt ? 'sp_clm_1' : ''}`}
						>
							<RichText.Content
								tagName="dt"
								value={c.title}
								style={{
									backgroundColor: dtBackgroundColor || undefined,
									color: dtTextColor,
									fontWeight: fontWeightDt,
									lineHeight: lineHeight,
								}}
								data-lw_font_set={fontDt}
							/>
							<RichText.Content
								tagName="dd"
								value={c.text}
								style={{
									color: ddTextColor,
									fontWeight: fontWeightDd,
									borderColor: borderColor,
									lineHeight: lineHeight,
								}}
								data-lw_font_set={fontDd}
							/>
						</dl>
					))}
				</div>
			</div>
		);
	},
});