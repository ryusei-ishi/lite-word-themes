import { registerBlockType } from "@wordpress/blocks";
import { useState } from "@wordpress/element";
import {
	RichText,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	ColorPalette,
	Button,
	Popover,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import "./style.scss";
import "./editor.scss";
import metadata from "./block.json";

// 共通オプション
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

// --- セル正規化 ---
const normalizeCell = (cell) => {
	if (typeof cell === "string") {
		return { content: cell, spanRow: 1, spanCol: 1, hidden: false, bgColor: "", outlineColor: "", outlineWidth: 0 };
	}
	return {
		content: cell.content || "",
		spanRow: cell.spanRow || 1,
		spanCol: cell.spanCol || 1,
		hidden: cell.hidden || false,
		bgColor: cell.bgColor || "",
		outlineColor: cell.outlineColor || "",
		outlineWidth: cell.outlineWidth || 0,
	};
};

const normalizeRow = (row) => ({
	header: row.header || "",
	headerSpanRow: row.headerSpanRow || 1,
	headerHidden: row.headerHidden || false,
	headerBgColor: row.headerBgColor || "",
	headerOutlineColor: row.headerOutlineColor || "",
	headerOutlineWidth: row.headerOutlineWidth || 0,
	cells: (row.cells || []).map(normalizeCell),
});

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			columnCount,
			colWidthPc,
			colWidthSp,
			gapSize,
			hideMainHead,
			hideRowHead,
			headers,
			headerBgColors,
			headerOutlineColors,
			headerOutlineWidths,
			rows: rawRows,
			fontFamilyMainHead, fontWeightMainHead, fontSizeMainHead, fontSizeMainHeadSp, lineHeightMainHead,
			mainHeadBgColor, mainHeadTextColor,
			fontFamilyRowHead, fontWeightRowHead, fontSizeRowHead, fontSizeRowHeadSp, lineHeightRowHead,
			rowHeadBgColor, rowHeadTextColor,
			fontFamilyCell, fontWeightCell, fontSizeCell, fontSizeCellSp, lineHeightCell,
			cellBgColor, cellTextColor,
			textAlignMainHead, textAlignRowHead, textAlignCell,
			verticalAlignMainHead, verticalAlignRowHead, verticalAlignCell,
			mainHeadPaddingY, rowHeadPaddingY, cellPaddingY,
			designPattern,
		} = attributes;

		const rows = rawRows.map(normalizeRow);
		const gridColumns = hideRowHead ? columnCount - 1 : columnCount;
		const dataCols = columnCount - 1;

		// --- 位置クラス算出 ---
		const firstRowHeadIdx = rows.findIndex((r) => !r.headerHidden);
		const lastRowHeadIdx = (() => { for (let i = rows.length - 1; i >= 0; i--) { if (!rows[i].headerHidden) return i; } return -1; })();

		// 選択中セル
		const [selected, setSelected] = useState(null);
		const [showPopover, setShowPopover] = useState(null); // null | "bg" | "outline"

		// CSS変数を生成
		const cssVars = { "--table-3-gap": gapSize + "px" };
		let totalSpWidth = 0;
		if (hideRowHead) {
			for (let i = 0; i < dataCols; i++) {
				cssVars[`--table-3-clm-${i + 1}-pc`] = (colWidthPc[i + 1] || 200) + "px";
				cssVars[`--table-3-clm-${i + 1}-sp`] = (colWidthSp[i + 1] || 120) + "px";
				totalSpWidth += colWidthSp[i + 1] || 120;
			}
		} else {
			for (let i = 0; i < columnCount; i++) {
				cssVars[`--table-3-clm-${i + 1}-pc`] = (colWidthPc[i] || 200) + "px";
				cssVars[`--table-3-clm-${i + 1}-sp`] = (colWidthSp[i] || 120) + "px";
				totalSpWidth += colWidthSp[i] || 120;
			}
		}
		cssVars["--table-3-total-sp"] = (totalSpWidth + 80) + "px";
		// フォント系CSS変数
		cssVars["--table-3-fs-main-head"] = `${fontSizeMainHead}px`;
		cssVars["--table-3-fs-main-head-sp"] = `${fontSizeMainHeadSp}px`;
		cssVars["--table-3-lh-main-head"] = lineHeightMainHead;
		cssVars["--table-3-fs-row-head"] = `${fontSizeRowHead}px`;
		cssVars["--table-3-fs-row-head-sp"] = `${fontSizeRowHeadSp}px`;
		cssVars["--table-3-lh-row-head"] = lineHeightRowHead;
		cssVars["--table-3-fs-cell"] = `${fontSizeCell}px`;
		cssVars["--table-3-fs-cell-sp"] = `${fontSizeCellSp}px`;
		cssVars["--table-3-lh-cell"] = lineHeightCell;

		const blockProps = useBlockProps({ className: "lw-pr-table-3" });

		// --- 更新ヘルパー ---
		const updateRows = (newRows) => setAttributes({ rows: newRows });

		const updateHeader = (index, value) => {
			const h = [...headers];
			h[index] = value;
			setAttributes({ headers: h });
		};

		const updateRowHeader = (ri, value) => {
			const r = [...rows];
			r[ri] = { ...r[ri], header: value };
			updateRows(r);
		};

		const updateCell = (ri, ci, value) => {
			const r = [...rows];
			const cells = [...r[ri].cells];
			cells[ci] = { ...cells[ci], content: value };
			r[ri] = { ...r[ri], cells };
			updateRows(r);
		};

		const addRow = () => {
			const newCells = Array(dataCols).fill(null).map(() => ({ content: "", spanRow: 1, spanCol: 1, hidden: false }));
			updateRows([...rows, { header: "新しい項目", headerSpanRow: 1, headerHidden: false, cells: newCells }]);
		};

		const removeRow = (index) => updateRows(rows.filter((_, i) => i !== index));

		const handleColumnCountChange = (newCount) => {
			const newHeaders = [...headers];
			const newBgColors = [...headerBgColors];
			const newOutlineColors = [...headerOutlineColors];
			const newOutlineWidths = [...headerOutlineWidths];
			const newWidthPc = [...colWidthPc];
			const newWidthSp = [...colWidthSp];
			while (newHeaders.length < newCount) {
				newHeaders.push(`プラン${newHeaders.length}`);
				newBgColors.push("");
				newOutlineColors.push("");
				newOutlineWidths.push(0);
				newWidthPc.push(200);
				newWidthSp.push(120);
			}
			const newRows = rows.map((row) => {
				const c = [...row.cells];
				while (c.length < newCount - 1) c.push({ content: "", spanRow: 1, spanCol: 1, hidden: false, bgColor: "" });
				return { ...row, cells: c.slice(0, newCount - 1) };
			});
			setAttributes({
				columnCount: newCount,
				headers: newHeaders.slice(0, newCount),
				headerBgColors: newBgColors.slice(0, newCount),
				headerOutlineColors: newOutlineColors.slice(0, newCount),
				headerOutlineWidths: newOutlineWidths.slice(0, newCount),
				colWidthPc: newWidthPc.slice(0, newCount),
				colWidthSp: newWidthSp.slice(0, newCount),
				rows: newRows,
			});
		};

		const updateColWidth = (index, value, type) => {
			const key = type === "pc" ? "colWidthPc" : "colWidthSp";
			const arr = type === "pc" ? [...colWidthPc] : [...colWidthSp];
			arr[index] = value;
			setAttributes({ [key]: arr });
		};

		// --- 個別背景色更新 ---
		const updateMainHeadBgColor = (index, color) => {
			const c = [...headerBgColors];
			c[index] = color || "";
			setAttributes({ headerBgColors: c });
		};

		const updateRowHeadBgColor = (ri, color) => {
			const r = [...rows];
			r[ri] = { ...r[ri], headerBgColor: color || "" };
			updateRows(r);
		};

		const updateCellBgColor = (ri, ci, color) => {
			const r = [...rows];
			const cells = [...r[ri].cells];
			cells[ci] = { ...cells[ci], bgColor: color || "" };
			r[ri] = { ...r[ri], cells };
			updateRows(r);
		};

		// --- 個別アウトライン更新 ---
		const updateMainHeadOutlineColor = (index, color) => {
			const c = [...headerOutlineColors];
			c[index] = color || "";
			setAttributes({ headerOutlineColors: c });
		};
		const updateMainHeadOutlineWidth = (index, width) => {
			const w = [...headerOutlineWidths];
			w[index] = width;
			setAttributes({ headerOutlineWidths: w });
		};

		const updateRowHeadOutlineColor = (ri, color) => {
			const r = [...rows];
			r[ri] = { ...r[ri], headerOutlineColor: color || "" };
			updateRows(r);
		};
		const updateRowHeadOutlineWidth = (ri, width) => {
			const r = [...rows];
			r[ri] = { ...r[ri], headerOutlineWidth: width };
			updateRows(r);
		};

		const updateCellOutlineColor = (ri, ci, color) => {
			const r = [...rows];
			const cells = [...r[ri].cells];
			cells[ci] = { ...cells[ci], outlineColor: color || "" };
			r[ri] = { ...r[ri], cells };
			updateRows(r);
		};
		const updateCellOutlineWidth = (ri, ci, width) => {
			const r = [...rows];
			const cells = [...r[ri].cells];
			cells[ci] = { ...cells[ci], outlineWidth: width };
			r[ri] = { ...r[ri], cells };
			updateRows(r);
		};

		// --- セル統合ロジック ---

		// データセル: 下と統合
		const mergeCellDown = (ri, ci) => {
			const r = rows.map((row) => ({ ...row, cells: [...row.cells] }));
			const cell = r[ri].cells[ci];
			const newSpanRow = cell.spanRow + 1;
			r[ri].cells[ci] = { ...cell, spanRow: newSpanRow };
			const targetRow = ri + newSpanRow - 1;
			if (targetRow < r.length) {
				// spanCol分すべてhiddenにする
				for (let dc = 0; dc < cell.spanCol; dc++) {
					const tc = ci + dc;
					if (tc < dataCols) {
						r[targetRow].cells[tc] = { ...r[targetRow].cells[tc], hidden: true };
					}
				}
			}
			updateRows(r);
		};

		// データセル: 右と統合
		const mergeCellRight = (ri, ci) => {
			const r = rows.map((row) => ({ ...row, cells: [...row.cells] }));
			const cell = r[ri].cells[ci];
			const newSpanCol = cell.spanCol + 1;
			r[ri].cells[ci] = { ...cell, spanCol: newSpanCol };
			const targetCol = ci + newSpanCol - 1;
			if (targetCol < dataCols) {
				// spanRow分すべてhiddenにする
				for (let dr = 0; dr < cell.spanRow; dr++) {
					const tr = ri + dr;
					if (tr < r.length) {
						r[tr].cells[targetCol] = { ...r[tr].cells[targetCol], hidden: true };
					}
				}
			}
			updateRows(r);
		};

		// データセル: 統合解除
		const unmergeCellAll = (ri, ci) => {
			const r = rows.map((row) => ({ ...row, cells: [...row.cells] }));
			const cell = r[ri].cells[ci];
			for (let dr = 0; dr < cell.spanRow; dr++) {
				for (let dc = 0; dc < cell.spanCol; dc++) {
					if (dr === 0 && dc === 0) continue;
					const tr = ri + dr;
					const tc = ci + dc;
					if (tr < r.length && tc < dataCols) {
						r[tr].cells[tc] = { ...r[tr].cells[tc], hidden: false };
					}
				}
			}
			r[ri].cells[ci] = { ...cell, spanRow: 1, spanCol: 1 };
			updateRows(r);
		};

		// 行ヘッダー: 下と統合
		const mergeRowHeadDown = (ri) => {
			const r = rows.map((row) => ({ ...row, cells: [...row.cells] }));
			r[ri] = { ...r[ri], headerSpanRow: (r[ri].headerSpanRow || 1) + 1 };
			const targetRow = ri + r[ri].headerSpanRow - 1;
			if (targetRow < r.length) {
				r[targetRow] = { ...r[targetRow], headerHidden: true };
			}
			updateRows(r);
		};

		// 行ヘッダー: 統合解除
		const unmergeRowHead = (ri) => {
			const r = rows.map((row) => ({ ...row, cells: [...row.cells] }));
			const span = r[ri].headerSpanRow || 1;
			for (let dr = 1; dr < span; dr++) {
				const tr = ri + dr;
				if (tr < r.length) {
					r[tr] = { ...r[tr], headerHidden: false };
				}
			}
			r[ri] = { ...r[ri], headerSpanRow: 1 };
			updateRows(r);
		};

		// --- 統合可否チェック ---
		const canMergeCellDown = (ri, ci) => {
			const cell = rows[ri].cells[ci];
			const targetRow = ri + (cell.spanRow || 1);
			if (targetRow >= rows.length) return false;
			// spanCol分すべてが hidden でないことを確認
			for (let dc = 0; dc < (cell.spanCol || 1); dc++) {
				const tc = ci + dc;
				if (tc >= dataCols || rows[targetRow].cells[tc].hidden) return false;
			}
			return true;
		};

		const canMergeCellRight = (ri, ci) => {
			const cell = rows[ri].cells[ci];
			const targetCol = ci + (cell.spanCol || 1);
			if (targetCol >= dataCols) return false;
			// spanRow分すべてが hidden でないことを確認
			for (let dr = 0; dr < (cell.spanRow || 1); dr++) {
				const tr = ri + dr;
				if (tr >= rows.length || rows[tr].cells[targetCol].hidden) return false;
			}
			return true;
		};

		const isCellMerged = (ri, ci) => {
			const cell = rows[ri].cells[ci];
			return (cell.spanRow || 1) > 1 || (cell.spanCol || 1) > 1;
		};

		const canRowHeadDown = (ri) => {
			const targetRow = ri + (rows[ri].headerSpanRow || 1);
			return targetRow < rows.length && !rows[targetRow].headerHidden;
		};

		const isRowHeadMerged = (ri) => (rows[ri].headerSpanRow || 1) > 1;

		// --- 縦統合チェック ---
		const isRowInvolvedInVerticalMerge = (ri) => {
			const row = rows[ri];
			if ((row.headerSpanRow || 1) > 1 || row.headerHidden) return true;
			return row.cells.some((cell) => (cell.spanRow || 1) > 1 || cell.hidden);
		};

		// --- 行移動 ---
		const canMoveRowUp = (ri) => ri > 0 && !isRowInvolvedInVerticalMerge(ri) && !isRowInvolvedInVerticalMerge(ri - 1);
		const canMoveRowDown = (ri) => ri < rows.length - 1 && !isRowInvolvedInVerticalMerge(ri) && !isRowInvolvedInVerticalMerge(ri + 1);

		const moveRowUp = (ri) => {
			const r = [...rows];
			[r[ri - 1], r[ri]] = [r[ri], r[ri - 1]];
			updateRows(r);
			setSelected(null);
		};

		const moveRowDown = (ri) => {
			const r = [...rows];
			[r[ri], r[ri + 1]] = [r[ri + 1], r[ri]];
			updateRows(r);
			setSelected(null);
		};

		// --- 選択判定 ---
		const isSelectedCell = (ri, ci) => selected && selected.type === "cell" && selected.row === ri && selected.col === ci;
		const isSelectedRowHead = (ri) => selected && selected.type === "rowHead" && selected.row === ri;
		const isSelectedMainHead = (i) => selected && selected.type === "mainHead" && selected.col === i;

		// --- 色ピッカーPopover ---
		const renderColorPopover = (currentColor, onChange) => (
			<Popover
				placement="bottom-start"
				onClose={() => setShowPopover(null)}
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{ padding: '12px', minWidth: '200px' }}>
					<p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>個別背景色</p>
					<ColorPalette
						value={currentColor || undefined}
						onChange={(color) => onChange(color)}
						clearable={true}
					/>
				</div>
			</Popover>
		);

		// --- アウトラインPopover ---
		const renderOutlinePopover = (currentColor, currentWidth, onColorChange, onWidthChange) => (
			<Popover
				placement="bottom-start"
				onClose={() => setShowPopover(null)}
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{ padding: '12px', minWidth: '200px' }}>
					<p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>アウトライン色</p>
					<ColorPalette
						value={currentColor || undefined}
						onChange={(color) => onColorChange(color)}
						clearable={true}
					/>
					<RangeControl
						label="太さ (px)"
						value={currentWidth || 0}
						onChange={(v) => onWidthChange(v)}
						min={0}
						max={10}
						step={1}
					/>
				</div>
			</Popover>
		);

		// --- ツールバー (データセル) ---
		const renderCellToolbar = (ri, ci) => (
			<div className="lw-pr-table-3__merge-toolbar" onClick={(e) => e.stopPropagation()}>
				{hideRowHead && ci === 0 && canMoveRowUp(ri) && (
					<button type="button" onClick={() => moveRowUp(ri)} title="上に移動">移動↑</button>
				)}
				{hideRowHead && ci === 0 && canMoveRowDown(ri) && (
					<button type="button" onClick={() => moveRowDown(ri)} title="下に移動">移動↓</button>
				)}
				{canMergeCellDown(ri, ci) && (
					<button type="button" onClick={() => mergeCellDown(ri, ci)} title="下と統合">統合↓</button>
				)}
				{canMergeCellRight(ri, ci) && (
					<button type="button" onClick={() => mergeCellRight(ri, ci)} title="右と統合">統合→</button>
				)}
				{isCellMerged(ri, ci) && (
					<button type="button" onClick={() => unmergeCellAll(ri, ci)} title="統合解除" className="unmerge">解除</button>
				)}
				<button
					type="button"
					onClick={() => setShowPopover(showPopover === "bg" ? null : "bg")}
					title="背景色"
					className="color-btn"
					style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
				>
					<span style={{
						display: 'inline-block',
						width: '12px',
						height: '12px',
						borderRadius: '50%',
						background: rows[ri].cells[ci].bgColor || cellBgColor,
						border: '1px solid rgba(255,255,255,0.5)',
					}} />
					色
				</button>
				<button
					type="button"
					onClick={() => setShowPopover(showPopover === "outline" ? null : "outline")}
					title="アウトライン"
					className="color-btn"
					style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
				>
					<span style={{
						display: 'inline-block',
						width: '12px',
						height: '12px',
						borderRadius: '2px',
						background: 'transparent',
						border: `2px solid ${rows[ri].cells[ci].outlineColor || '#999'}`,
					}} />
					枠
				</button>
				{showPopover === "bg" && renderColorPopover(
					rows[ri].cells[ci].bgColor,
					(color) => updateCellBgColor(ri, ci, color)
				)}
				{showPopover === "outline" && renderOutlinePopover(
					rows[ri].cells[ci].outlineColor,
					rows[ri].cells[ci].outlineWidth,
					(color) => updateCellOutlineColor(ri, ci, color),
					(width) => updateCellOutlineWidth(ri, ci, width)
				)}
			</div>
		);

		// --- ツールバー (行ヘッダー) ---
		const renderRowHeadToolbar = (ri) => (
			<div className="lw-pr-table-3__merge-toolbar" onClick={(e) => e.stopPropagation()}>
				{canMoveRowUp(ri) && (
					<button type="button" onClick={() => moveRowUp(ri)} title="上に移動">移動↑</button>
				)}
				{canMoveRowDown(ri) && (
					<button type="button" onClick={() => moveRowDown(ri)} title="下に移動">移動↓</button>
				)}
				{canRowHeadDown(ri) && (
					<button type="button" onClick={() => mergeRowHeadDown(ri)} title="下と統合">統合↓</button>
				)}
				{isRowHeadMerged(ri) && (
					<button type="button" onClick={() => unmergeRowHead(ri)} title="統合解除" className="unmerge">解除</button>
				)}
				<button
					type="button"
					onClick={() => setShowPopover(showPopover === "bg" ? null : "bg")}
					title="背景色"
					className="color-btn"
					style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
				>
					<span style={{
						display: 'inline-block',
						width: '12px',
						height: '12px',
						borderRadius: '50%',
						background: rows[ri].headerBgColor || rowHeadBgColor,
						border: '1px solid rgba(255,255,255,0.5)',
					}} />
					色
				</button>
				<button
					type="button"
					onClick={() => setShowPopover(showPopover === "outline" ? null : "outline")}
					title="アウトライン"
					className="color-btn"
					style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
				>
					<span style={{
						display: 'inline-block',
						width: '12px',
						height: '12px',
						borderRadius: '2px',
						background: 'transparent',
						border: `2px solid ${rows[ri].headerOutlineColor || '#999'}`,
					}} />
					枠
				</button>
				{showPopover === "bg" && renderColorPopover(
					rows[ri].headerBgColor,
					(color) => updateRowHeadBgColor(ri, color)
				)}
				{showPopover === "outline" && renderOutlinePopover(
					rows[ri].headerOutlineColor,
					rows[ri].headerOutlineWidth,
					(color) => updateRowHeadOutlineColor(ri, color),
					(width) => updateRowHeadOutlineWidth(ri, width)
				)}
			</div>
		);

		// --- ツールバー (列ヘッダー) ---
		const renderMainHeadToolbar = (i) => (
			<div className="lw-pr-table-3__merge-toolbar" onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					onClick={() => setShowPopover(showPopover === "bg" ? null : "bg")}
					title="背景色"
					className="color-btn"
					style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
				>
					<span style={{
						display: 'inline-block',
						width: '12px',
						height: '12px',
						borderRadius: '50%',
						background: (headerBgColors[i]) || mainHeadBgColor,
						border: '1px solid rgba(255,255,255,0.5)',
					}} />
					色
				</button>
				<button
					type="button"
					onClick={() => setShowPopover(showPopover === "outline" ? null : "outline")}
					title="アウトライン"
					className="color-btn"
					style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
				>
					<span style={{
						display: 'inline-block',
						width: '12px',
						height: '12px',
						borderRadius: '2px',
						background: 'transparent',
						border: `2px solid ${(headerOutlineColors[i]) || '#999'}`,
					}} />
					枠
				</button>
				{showPopover === "bg" && renderColorPopover(
					headerBgColors[i],
					(color) => updateMainHeadBgColor(i, color)
				)}
				{showPopover === "outline" && renderOutlinePopover(
					headerOutlineColors[i],
					headerOutlineWidths[i],
					(color) => updateMainHeadOutlineColor(i, color),
					(width) => updateMainHeadOutlineWidth(i, width)
				)}
			</div>
		);

		const wrapClassName = `lw-pr-table-3__wrap${gridColumns >= 3 ? ` clm_${gridColumns}` : ""}${designPattern ? ` ${designPattern}` : ""}`;

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<RangeControl label="カラム数" value={columnCount} onChange={handleColumnCountChange} min={2} max={10} step={1} />
						<RangeControl label="セル間隔 (px)" value={gapSize} onChange={(v) => setAttributes({ gapSize: v })} min={0} max={10} step={1} />
						<ToggleControl label="列ヘッダー（main_head）を非表示" checked={hideMainHead} onChange={(v) => setAttributes({ hideMainHead: v })} />
						<ToggleControl label="行ヘッダー（row_head）を非表示" checked={hideRowHead} onChange={(v) => setAttributes({ hideRowHead: v })} />
						<SelectControl
							label="デザインパターン"
							value={designPattern}
							options={[
								{ label: "なし", value: "" },
								{ label: "角丸（外側）", value: "design_ptn_1" },
								{ label: "角丸（全セル）", value: "design_ptn_2" },
							]}
							onChange={(value) => setAttributes({ designPattern: value })}
						/>
					</PanelBody>
					<PanelBody title="カラム幅 PC" initialOpen={false}>
						{Array.from({ length: columnCount }, (_, i) => (
							<RangeControl key={`pc-${i}`} label={`${i === 0 ? "項目列" : `カラム${i + 1}`} (px)`} value={colWidthPc[i] || 200} onChange={(v) => updateColWidth(i, v, "pc")} min={50} max={800} step={1} />
						))}
					</PanelBody>
					<PanelBody title="カラム幅 SP" initialOpen={false}>
						{Array.from({ length: columnCount }, (_, i) => (
							<RangeControl key={`sp-${i}`} label={`${i === 0 ? "項目列" : `カラム${i + 1}`} (px)`} value={colWidthSp[i] || 120} onChange={(v) => updateColWidth(i, v, "sp")} min={50} max={600} step={1} />
						))}
					</PanelBody>

					{/* 列ヘッダー色設定 */}
					<PanelBody title="列ヘッダー 色設定" initialOpen={false}>
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>背景色</p>
							<ColorPalette
								value={mainHeadBgColor}
								onChange={(color) => setAttributes({ mainHeadBgColor: color })}
							/>
						</div>
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>文字色</p>
							<ColorPalette
								value={mainHeadTextColor}
								onChange={(color) => setAttributes({ mainHeadTextColor: color })}
							/>
						</div>
					</PanelBody>

					{/* 列ヘッダーフォント設定 */}
					<PanelBody title="列ヘッダー フォント設定" initialOpen={false}>
						<SelectControl
							label="フォントファミリー"
							value={fontFamilyMainHead}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontFamilyMainHead: value })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightMainHead}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeightMainHead: value })}
						/>
						<SelectControl
							label="テキスト配置"
							value={textAlignMainHead}
							options={[
								{ label: "左寄せ", value: "left" },
								{ label: "中央", value: "center" },
								{ label: "右寄せ", value: "right" },
							]}
							onChange={(value) => setAttributes({ textAlignMainHead: value })}
						/>
						<SelectControl
							label="縦方向の配置"
							value={verticalAlignMainHead}
							options={[
								{ label: "上", value: "flex-start" },
								{ label: "中央", value: "center" },
								{ label: "下", value: "flex-end" },
							]}
							onChange={(value) => setAttributes({ verticalAlignMainHead: value })}
						/>
						<RangeControl label="文字サイズ PC (px)" value={fontSizeMainHead} onChange={(v) => setAttributes({ fontSizeMainHead: v })} min={10} max={30} />
						<RangeControl label="文字サイズ SP (px)" value={fontSizeMainHeadSp} onChange={(v) => setAttributes({ fontSizeMainHeadSp: v })} min={10} max={24} />
						<RangeControl label="行間" value={lineHeightMainHead} onChange={(v) => setAttributes({ lineHeightMainHead: v })} min={1} max={2.5} step={0.1} />
						<RangeControl label="上下余白 (px)" value={mainHeadPaddingY} onChange={(v) => setAttributes({ mainHeadPaddingY: v })} min={0} max={60} step={1} />
					</PanelBody>

					{/* 行ヘッダー色設定 */}
					<PanelBody title="行ヘッダー 色設定" initialOpen={false}>
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>背景色</p>
							<ColorPalette
								value={rowHeadBgColor}
								onChange={(color) => setAttributes({ rowHeadBgColor: color })}
							/>
						</div>
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>文字色</p>
							<ColorPalette
								value={rowHeadTextColor}
								onChange={(color) => setAttributes({ rowHeadTextColor: color })}
							/>
						</div>
					</PanelBody>

					{/* 行ヘッダーフォント設定 */}
					<PanelBody title="行ヘッダー フォント設定" initialOpen={false}>
						<SelectControl
							label="フォントファミリー"
							value={fontFamilyRowHead}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontFamilyRowHead: value })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightRowHead}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeightRowHead: value })}
						/>
						<SelectControl
							label="テキスト配置"
							value={textAlignRowHead}
							options={[
								{ label: "左寄せ", value: "left" },
								{ label: "中央", value: "center" },
								{ label: "右寄せ", value: "right" },
							]}
							onChange={(value) => setAttributes({ textAlignRowHead: value })}
						/>
						<SelectControl
							label="縦方向の配置"
							value={verticalAlignRowHead}
							options={[
								{ label: "上", value: "flex-start" },
								{ label: "中央", value: "center" },
								{ label: "下", value: "flex-end" },
							]}
							onChange={(value) => setAttributes({ verticalAlignRowHead: value })}
						/>
						<RangeControl label="文字サイズ PC (px)" value={fontSizeRowHead} onChange={(v) => setAttributes({ fontSizeRowHead: v })} min={10} max={30} />
						<RangeControl label="文字サイズ SP (px)" value={fontSizeRowHeadSp} onChange={(v) => setAttributes({ fontSizeRowHeadSp: v })} min={10} max={24} />
						<RangeControl label="行間" value={lineHeightRowHead} onChange={(v) => setAttributes({ lineHeightRowHead: v })} min={1} max={2.5} step={0.1} />
						<RangeControl label="上下余白 (px)" value={rowHeadPaddingY} onChange={(v) => setAttributes({ rowHeadPaddingY: v })} min={0} max={60} step={1} />
					</PanelBody>

					{/* セル色設定 */}
					<PanelBody title="セル 色設定" initialOpen={false}>
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>背景色</p>
							<ColorPalette
								value={cellBgColor}
								onChange={(color) => setAttributes({ cellBgColor: color })}
							/>
						</div>
						<div style={{ marginBottom: '20px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>文字色</p>
							<ColorPalette
								value={cellTextColor}
								onChange={(color) => setAttributes({ cellTextColor: color })}
							/>
						</div>
					</PanelBody>

					{/* セルフォント設定 */}
					<PanelBody title="セル フォント設定" initialOpen={false}>
						<SelectControl
							label="フォントファミリー"
							value={fontFamilyCell}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontFamilyCell: value })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightCell}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeightCell: value })}
						/>
						<SelectControl
							label="テキスト配置"
							value={textAlignCell}
							options={[
								{ label: "左寄せ", value: "left" },
								{ label: "中央", value: "center" },
								{ label: "右寄せ", value: "right" },
							]}
							onChange={(value) => setAttributes({ textAlignCell: value })}
						/>
						<SelectControl
							label="縦方向の配置"
							value={verticalAlignCell}
							options={[
								{ label: "上", value: "flex-start" },
								{ label: "中央", value: "center" },
								{ label: "下", value: "flex-end" },
							]}
							onChange={(value) => setAttributes({ verticalAlignCell: value })}
						/>
						<RangeControl label="文字サイズ PC (px)" value={fontSizeCell} onChange={(v) => setAttributes({ fontSizeCell: v })} min={10} max={30} />
						<RangeControl label="文字サイズ SP (px)" value={fontSizeCellSp} onChange={(v) => setAttributes({ fontSizeCellSp: v })} min={10} max={24} />
						<RangeControl label="行間" value={lineHeightCell} onChange={(v) => setAttributes({ lineHeightCell: v })} min={1} max={2.5} step={0.1} />
						<RangeControl label="上下余白 (px)" value={cellPaddingY} onChange={(v) => setAttributes({ cellPaddingY: v })} min={0} max={60} step={1} />
					</PanelBody>
				</InspectorControls>

				<div {...blockProps} onClick={() => { setSelected(null); setShowPopover(null); }}>
					<div className={wrapClassName} style={cssVars}>
						{/* 列ヘッダー (main_head) */}
						{!hideMainHead && headers.slice(0, columnCount).map((header, i) => {
							if (hideRowHead && i === 0) return null;
							const firstMainHead = hideRowHead ? 1 : 0;
							const lastMainHead = columnCount - 1;
							const posClass = (i === firstMainHead ? " main_head_first" : "") + (i === lastMainHead ? " main_head_last" : "");
							const cellClass = `lw-pr-table-3__cell main_head${posClass}${isSelectedMainHead(i) ? " is-selected" : ""}`;
							const individualBg = headerBgColors[i];
							const olColor = headerOutlineColors[i];
							const olWidth = headerOutlineWidths[i];
							return (
								<div
									key={`mh-${i}`}
									className={cellClass}
									data-lw_font_set={fontFamilyMainHead}
									style={{
										display: 'flex',
										alignItems: verticalAlignMainHead,
										background: individualBg || mainHeadBgColor,
										color: mainHeadTextColor,
										fontWeight: fontWeightMainHead,
										fontSize: `${fontSizeMainHead}px`,
										lineHeight: lineHeightMainHead,
										textAlign: textAlignMainHead,
										paddingTop: `${mainHeadPaddingY}px`,
										paddingBottom: `${mainHeadPaddingY}px`,
										...(olWidth && olColor ? { outline: `${olWidth}px solid ${olColor}`, outlineOffset: `-${olWidth}px` } : {}),
									}}
									onClick={(e) => { e.stopPropagation(); setShowPopover(null); setSelected({ type: "mainHead", col: i }); }}
								>
									<div className="lw-pr-table-3__cell-inner">
										<RichText value={header} onChange={(v) => updateHeader(i, v)} placeholder={i === 0 ? "" : "ヘッダー"} />
									</div>
									{isSelectedMainHead(i) && renderMainHeadToolbar(i)}
								</div>
							);
						})}

						{/* データ行 */}
						{rows.map((row, ri) => (
							<>
								{/* 行ヘッダー */}
								{!hideRowHead && !row.headerHidden && (
									<div
										key={`rh-${ri}`}
										className={`lw-pr-table-3__cell row_head${ri === firstRowHeadIdx ? " row_head_first" : ""}${ri === lastRowHeadIdx ? " row_head_last" : ""}${isSelectedRowHead(ri) ? " is-selected" : ""}`}
										data-lw_font_set={fontFamilyRowHead}
										style={{
											...((row.headerSpanRow || 1) > 1 ? { gridRow: `span ${row.headerSpanRow}` } : {}),
											display: 'flex',
											alignItems: verticalAlignRowHead,
											background: row.headerBgColor || rowHeadBgColor,
											color: rowHeadTextColor,
											fontWeight: fontWeightRowHead,
											fontSize: `${fontSizeRowHead}px`,
											lineHeight: lineHeightRowHead,
											textAlign: textAlignRowHead,
											paddingTop: `${rowHeadPaddingY}px`,
											paddingBottom: `${rowHeadPaddingY}px`,
											...(row.headerOutlineWidth && row.headerOutlineColor ? { outline: `${row.headerOutlineWidth}px solid ${row.headerOutlineColor}`, outlineOffset: `-${row.headerOutlineWidth}px` } : {}),
										}}
										onClick={(e) => { e.stopPropagation(); setShowPopover(null); setSelected({ type: "rowHead", row: ri }); }}
									>
										<div className="lw-pr-table-3__cell-inner">
											<RichText value={row.header} onChange={(v) => updateRowHeader(ri, v)} placeholder="項目名" />
										</div>
										{isSelectedRowHead(ri) && renderRowHeadToolbar(ri)}
									</div>
								)}
								{!hideRowHead && row.headerHidden && (
									<div key={`rh-${ri}`} className="lw-pr-table-3__cell row_head" style={{ display: "none" }}></div>
								)}

								{/* データセル */}
								{row.cells.slice(0, dataCols).map((cell, ci) => {
									if (cell.hidden) {
										return <div key={`c-${ri}-${ci}`} className="lw-pr-table-3__cell" style={{ display: "none" }}></div>;
									}
									const cellStyle = {
										display: 'flex',
										alignItems: verticalAlignCell,
										background: cell.bgColor || cellBgColor,
										color: cellTextColor,
										fontWeight: fontWeightCell,
										fontSize: `${fontSizeCell}px`,
										lineHeight: lineHeightCell,
										textAlign: textAlignCell,
										paddingTop: `${cellPaddingY}px`,
										paddingBottom: `${cellPaddingY}px`,
									};
									if (cell.outlineWidth && cell.outlineColor) {
										cellStyle.outline = `${cell.outlineWidth}px solid ${cell.outlineColor}`;
										cellStyle.outlineOffset = `-${cell.outlineWidth}px`;
									}
									if ((cell.spanRow || 1) > 1) cellStyle.gridRow = `span ${cell.spanRow}`;
									if ((cell.spanCol || 1) > 1) cellStyle.gridColumn = `span ${cell.spanCol}`;

									const isLastRow = ri === rows.length - 1;
									const isLastCol = ci === dataCols - 1;
									const isFirstRow = ri === 0;
									const cellPosClass = (isFirstRow && isLastCol ? " cell_first_row_last_col" : "") + (isLastRow && isLastCol ? " cell_last_row_last_col" : "");

									return (
										<div
											key={`c-${ri}-${ci}`}
											className={`lw-pr-table-3__cell${cellPosClass}${isSelectedCell(ri, ci) ? " is-selected" : ""}`}
											data-lw_font_set={fontFamilyCell}
											style={cellStyle}
											onClick={(e) => { e.stopPropagation(); setShowPopover(null); setSelected({ type: "cell", row: ri, col: ci }); }}
										>
											<div className="lw-pr-table-3__cell-inner">
												<RichText value={cell.content} onChange={(v) => updateCell(ri, ci, v)} placeholder="内容" />
											</div>
											{isSelectedCell(ri, ci) && renderCellToolbar(ri, ci)}
										</div>
									);
								})}
							</>
						))}
					</div>

					{/* 行追加・削除ボタン */}
					<div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
						<Button variant="secondary" onClick={addRow} size="small">行を追加</Button>
						{rows.length > 1 && (
							<Button variant="secondary" onClick={() => removeRow(rows.length - 1)} size="small" isDestructive>最後の行を削除</Button>
						)}
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			columnCount,
			colWidthPc,
			colWidthSp,
			gapSize,
			hideMainHead,
			hideRowHead,
			headers,
			headerBgColors,
			headerOutlineColors,
			headerOutlineWidths,
			rows: rawRows,
			fontFamilyMainHead, fontWeightMainHead, fontSizeMainHead, fontSizeMainHeadSp, lineHeightMainHead,
			mainHeadBgColor, mainHeadTextColor,
			fontFamilyRowHead, fontWeightRowHead, fontSizeRowHead, fontSizeRowHeadSp, lineHeightRowHead,
			rowHeadBgColor, rowHeadTextColor,
			fontFamilyCell, fontWeightCell, fontSizeCell, fontSizeCellSp, lineHeightCell,
			cellBgColor, cellTextColor,
			textAlignMainHead, textAlignRowHead, textAlignCell,
			verticalAlignMainHead, verticalAlignRowHead, verticalAlignCell,
			mainHeadPaddingY, rowHeadPaddingY, cellPaddingY,
			designPattern,
		} = attributes;

		const rows = rawRows.map(normalizeRow);
		const gridColumns = hideRowHead ? columnCount - 1 : columnCount;
		const dataCols = columnCount - 1;

		const firstRowHeadIdx = rows.findIndex((r) => !r.headerHidden);
		const lastRowHeadIdx = (() => { for (let i = rows.length - 1; i >= 0; i--) { if (!rows[i].headerHidden) return i; } return -1; })();

		const cssVars = { "--table-3-gap": gapSize + "px" };
		let totalSpWidth = 0;
		if (hideRowHead) {
			for (let i = 0; i < dataCols; i++) {
				cssVars[`--table-3-clm-${i + 1}-pc`] = (colWidthPc[i + 1] || 200) + "px";
				cssVars[`--table-3-clm-${i + 1}-sp`] = (colWidthSp[i + 1] || 120) + "px";
				totalSpWidth += colWidthSp[i + 1] || 120;
			}
		} else {
			for (let i = 0; i < columnCount; i++) {
				cssVars[`--table-3-clm-${i + 1}-pc`] = (colWidthPc[i] || 200) + "px";
				cssVars[`--table-3-clm-${i + 1}-sp`] = (colWidthSp[i] || 120) + "px";
				totalSpWidth += colWidthSp[i] || 120;
			}
		}
		cssVars["--table-3-total-sp"] = (totalSpWidth + 80) + "px";
		// フォント系CSS変数
		cssVars["--table-3-fs-main-head"] = `${fontSizeMainHead}px`;
		cssVars["--table-3-fs-main-head-sp"] = `${fontSizeMainHeadSp}px`;
		cssVars["--table-3-lh-main-head"] = lineHeightMainHead;
		cssVars["--table-3-fs-row-head"] = `${fontSizeRowHead}px`;
		cssVars["--table-3-fs-row-head-sp"] = `${fontSizeRowHeadSp}px`;
		cssVars["--table-3-lh-row-head"] = lineHeightRowHead;
		cssVars["--table-3-fs-cell"] = `${fontSizeCell}px`;
		cssVars["--table-3-fs-cell-sp"] = `${fontSizeCellSp}px`;
		cssVars["--table-3-lh-cell"] = lineHeightCell;

		const blockProps = useBlockProps.save({ className: "lw-pr-table-3" });
		const wrapClassName = `lw-pr-table-3__wrap${gridColumns >= 3 ? ` clm_${gridColumns}` : ""}${designPattern ? ` ${designPattern}` : ""}`;

		return (
			<div {...blockProps}>
				<div className={wrapClassName} style={cssVars}>
					{/* 列ヘッダー */}
					{!hideMainHead && headers.slice(0, columnCount).map((header, i) => {
						if (hideRowHead && i === 0) return null;
						const firstMainHead = hideRowHead ? 1 : 0;
						const lastMainHead = columnCount - 1;
						const posClass = (i === firstMainHead ? " main_head_first" : "") + (i === lastMainHead ? " main_head_last" : "");
						const cellClass = `lw-pr-table-3__cell main_head${posClass}`;
						const individualBg = headerBgColors[i];
						const olColor = headerOutlineColors[i];
						const olWidth = headerOutlineWidths[i];
						return (
							<div
								key={`mh-${i}`}
								className={cellClass}
								data-lw_font_set={fontFamilyMainHead}
								style={{
									display: 'flex',
									alignItems: verticalAlignMainHead,
									background: individualBg || mainHeadBgColor,
									color: mainHeadTextColor,
									fontWeight: fontWeightMainHead,
									lineHeight: lineHeightMainHead,
									textAlign: textAlignMainHead,
									paddingTop: `${mainHeadPaddingY}px`,
									paddingBottom: `${mainHeadPaddingY}px`,
									...(olWidth && olColor ? { outline: `${olWidth}px solid ${olColor}`, outlineOffset: `-${olWidth}px` } : {}),
								}}
							>
								<div className="lw-pr-table-3__cell-inner">
									<RichText.Content value={header} />
								</div>
							</div>
						);
					})}

					{/* データ行 */}
					{rows.map((row, ri) => (
						<>
							{/* 行ヘッダー */}
							{!hideRowHead && !row.headerHidden && (
								<div
									key={`rh-${ri}`}
									className={`lw-pr-table-3__cell row_head${ri === firstRowHeadIdx ? " row_head_first" : ""}${ri === lastRowHeadIdx ? " row_head_last" : ""}`}
									data-lw_font_set={fontFamilyRowHead}
									style={{
										...((row.headerSpanRow || 1) > 1 ? { gridRow: `span ${row.headerSpanRow}` } : {}),
										display: 'flex',
										alignItems: verticalAlignRowHead,
										background: row.headerBgColor || rowHeadBgColor,
										color: rowHeadTextColor,
										fontWeight: fontWeightRowHead,
										lineHeight: lineHeightRowHead,
										textAlign: textAlignRowHead,
										paddingTop: `${rowHeadPaddingY}px`,
										paddingBottom: `${rowHeadPaddingY}px`,
										...(row.headerOutlineWidth && row.headerOutlineColor ? { outline: `${row.headerOutlineWidth}px solid ${row.headerOutlineColor}`, outlineOffset: `-${row.headerOutlineWidth}px` } : {}),
									}}
								>
									<div className="lw-pr-table-3__cell-inner">
										<RichText.Content value={row.header} />
									</div>
								</div>
							)}
							{!hideRowHead && row.headerHidden && (
								<div key={`rh-${ri}`} className="lw-pr-table-3__cell row_head" style={{ display: "none" }}></div>
							)}

							{/* データセル */}
							{row.cells.slice(0, dataCols).map((cell, ci) => {
								if (cell.hidden) {
									return <div key={`c-${ri}-${ci}`} className="lw-pr-table-3__cell" style={{ display: "none" }}></div>;
								}
								const cellStyle = {
									display: 'flex',
									alignItems: verticalAlignCell,
									background: cell.bgColor || cellBgColor,
									color: cellTextColor,
									fontWeight: fontWeightCell,
									lineHeight: lineHeightCell,
									textAlign: textAlignCell,
									paddingTop: `${cellPaddingY}px`,
									paddingBottom: `${cellPaddingY}px`,
								};
								if (cell.outlineWidth && cell.outlineColor) {
									cellStyle.outline = `${cell.outlineWidth}px solid ${cell.outlineColor}`;
									cellStyle.outlineOffset = `-${cell.outlineWidth}px`;
								}
								if ((cell.spanRow || 1) > 1) cellStyle.gridRow = `span ${cell.spanRow}`;
								if ((cell.spanCol || 1) > 1) cellStyle.gridColumn = `span ${cell.spanCol}`;

								const isLastRow = ri === rows.length - 1;
								const isLastCol = ci === dataCols - 1;
								const isFirstRow = ri === 0;
								const cellPosClass = (isFirstRow && isLastCol ? " cell_first_row_last_col" : "") + (isLastRow && isLastCol ? " cell_last_row_last_col" : "");

								return (
									<div
										key={`c-${ri}-${ci}`}
										className={`lw-pr-table-3__cell${cellPosClass}`}
										data-lw_font_set={fontFamilyCell}
										style={cellStyle}
									>
										<div className="lw-pr-table-3__cell-inner">
											<RichText.Content value={cell.content} />
										</div>
									</div>
								);
							})}
						</>
					))}
				</div>
			</div>
		);
	},
});
