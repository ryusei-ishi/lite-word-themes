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

/* ===== 共通オプション ===== */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType(metadata.name, {
	/* ======================================================
	 * 1) エディタ
	 * ==================================================== */
	edit({ attributes, setAttributes }) {
		const {
			maxWidth, fontSizeClass, dtWidthClass, lineHeight,
			spFullDt,
			dtBackgroundColor, dtTextColor, fontDt, fontWeightDt,
			ddTextColor, fontDd, fontWeightDd,
			borderColor,
			contents,
		} = attributes;

		/* データ操作関数 */
		const addContent = () => {
			setAttributes({ 
				contents: [...contents, { term: '新しい項目名', desc: '新しい内容' }] 
			});
		};
		
		const removeContent = (idx) => {
			setAttributes({ 
				contents: contents.filter((_, i) => i !== idx) 
			});
		};
		
		const updateContent = (idx, key, val) => {
			const updated = [...contents];
			updated[idx][key] = val;
			setAttributes({ contents: updated });
		};
		
		/* 順番入れ替え関数 */
		const moveItem = (index, direction) => {
			const targetIndex = index + direction;
			if (targetIndex < 0 || targetIndex >= contents.length) return;
			
			const reordered = [...contents];
			const [moved] = reordered.splice(index, 1);
			reordered.splice(targetIndex, 0, moved);
			
			setAttributes({ contents: reordered });
		};

		const blockProps = useBlockProps({
			className: `paid-block-lw-company-3 ${fontSizeClass}`
		});

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

				{/* ---------- エディタ表示 ---------- */}
				<div className={`paid-block-lw-company-3 ${fontSizeClass}`}>
					<dl className="lw-company-3__inner" style={{ 
						maxWidth: maxWidth,
						lineHeight: lineHeight
					}}>
						{contents.map((c, i) => (
							<div
								className={`lw-company-3__row ${dtWidthClass} ${spFullDt ? 'sp_clm_1' : ''}`}
								key={i}
								style={{ position: 'relative' }}
							>
								{/* dt */}
								<dt className="lw-company-3__dt"
									style={{ background: dtBackgroundColor }}>
									<RichText
										tagName="div"
										className="lw-company-3__dt_text"
										value={c.term}
										onChange={(v) => updateContent(i, 'term', v)}
										data-lw_font_set={fontDt}
										placeholder="項目名を入力"
										style={{
											fontWeight: fontWeightDt,
											color: dtTextColor || undefined,
											lineHeight : lineHeight,
										}}
										// ★ フォーマットツールバーを有効化
										allowedFormats={[
											'core/bold',
											'core/italic',
											'core/link',
											'core/text-color',
											'core/strikethrough',
											'core/underline',
											'liteword/text-align-left',
											'liteword/text-align-center',
											'liteword/text-align-right',
											'liteword/font-size'
										]}
									/>
									<div
										className="lw-company-3__dt_arrow"
										style={{ background: dtBackgroundColor }}
									/>
								</dt>
								{/* dd */}
								<RichText
									tagName="dd"
									className="lw-company-3__dd"
									value={c.desc}
									onChange={(v) => updateContent(i, 'desc', v)}
									data-lw_font_set={fontDd}
									placeholder="内容を入力"
									style={{
										fontWeight: fontWeightDd,
										color: ddTextColor || undefined,
										borderColor: borderColor,
										lineHeight : lineHeight,
									}}
									// ★ フォーマットツールバーを有効化
									allowedFormats={[
										'core/bold',
										'core/italic',
										'core/link',
										'core/text-color',
										'core/strikethrough',
										'core/underline',
										'liteword/text-align-left',
										'liteword/text-align-center',
										'liteword/text-align-right',
										'liteword/font-size'
									]}
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
										onClick={() => removeContent(i)}
										className="remove-item-button"
										aria-label="削除"
									>
										削除
									</button>
								</div>
							</div>
						))}
					</dl>
					<button 
						type="button" 
						className="add-item-button" 
						onClick={addContent}
						style={{ marginTop: 12 }}
					>
						項目を追加する
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
			maxWidth, fontSizeClass, dtWidthClass, lineHeight,
			spFullDt,
			dtBackgroundColor, dtTextColor, fontDt, fontWeightDt,
			ddTextColor, fontDd, fontWeightDd,
			borderColor,
			contents,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `paid-block-lw-company-3 ${fontSizeClass}`
		});

		return (
			<div {...blockProps}>
				<dl className="lw-company-3__inner" style={{ 
					maxWidth: maxWidth,
					lineHeight: lineHeight
				}}>
					{contents.map((c, i) => (
						<div
							className={`lw-company-3__row ${dtWidthClass} ${spFullDt ? 'sp_clm_1' : ''}`}
							key={i}
						>
							<dt className="lw-company-3__dt"
								style={{ background: dtBackgroundColor }}>
								{/* dt */}
								<RichText.Content
									tagName="div"
									className="lw-company-3__dt_text"
									value={c.term}
									data-lw_font_set={fontDt}
									style={{
										fontWeight: fontWeightDt,
										color: dtTextColor || undefined,
										lineHeight : lineHeight,
									}}
								/>
								<div
									className="lw-company-3__dt_arrow"
									style={{ background: dtBackgroundColor }}
								/>
							</dt>
							<RichText.Content
								tagName="dd"
								className="lw-company-3__dd"
								value={c.desc}
								data-lw_font_set={fontDd}
								style={{
									fontWeight: fontWeightDd,
									color: ddTextColor || undefined,
									borderColor: borderColor,
									lineHeight : lineHeight,
								}}
							/>
						</div>
					))}
				</dl>
			</div>
		);
	},
});