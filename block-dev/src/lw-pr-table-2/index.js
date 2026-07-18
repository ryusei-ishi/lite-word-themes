import { registerBlockType } from "@wordpress/blocks";
import {
	RichText,
	InspectorControls,
	useBlockProps,
	ColorPalette,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import {
	fontOptionsArr,
	fontWeightOptionsArr,
} from "../utils.js";
import "./style.scss";
import "./editor.scss";
import metadata from "./block.json";

/* ───────────────────────── 定数 ───────────────────────── */
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const alignOptions = [
	{ label: "未選択", value: "" },
	{ label: "左寄せ", value: "left" },
	{ label: "中央", value: "center" },
	{ label: "右寄せ", value: "right" },
];

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			dtFixedPc,
			dtWidthPc,
			ddFixedPc,
			ddWidthPc,
			clm1FrPc,
			clm2FrPc,
			dtFixedSp,
			dtWidthSp,
			ddFixedSp,
			ddWidthSp,
			clm1FrSp,
			clm2FrSp,
			dlBorderColor,
			dlBorderStyle,
			dlBorderWidth,
			dlBorderIndividual,
			dlBorderTopColor,
			dlBorderTopStyle,
			dlBorderTopWidth,
			dlBorderBottomColor,
			dlBorderBottomStyle,
			dlBorderBottomWidth,
			dlBorderLeftColor,
			dlBorderLeftStyle,
			dlBorderLeftWidth,
			dlBorderRightColor,
			dlBorderRightStyle,
			dlBorderRightWidth,
			rowBorderColor,
			rowBorderStyle,
			rowBorderWidth,
			dtBorderColor,
			dtBorderStyle,
			dtBorderWidth,
			dtBgColor,
			cellPaddingPc,
			cellPaddingSp,
			fontSizePc,
			fontSizeSp,
			dtFont,
			dtFontWeight,
			ddFont,
			ddFontWeight,
			dtAlignPc,
			dtAlignSp,
			ddAlignPc,
			ddAlignSp,
			dtTextColor,
			ddTextColor,
			defaultPcClm1,
			defaultSpClm1,
			rows,
		} = attributes;

		const cellPaddingSpVal = cellPaddingSp >= 0 ? cellPaddingSp : cellPaddingPc;
		const fontSizeSpVal = fontSizeSp > 0 ? fontSizeSp : fontSizePc;

		/* grid-template-columns を生成 */
		const getGridColumns = (dtFixed, dtWidth, ddFixed, ddWidth, dtFr, ddFr) => {
			if (dtFixed && ddFixed) {
				return `${dtWidth}px ${ddWidth}px`;
			} else if (dtFixed && !ddFixed) {
				return `${dtWidth}px calc(100% - ${dtWidth}px)`;
			} else if (!dtFixed && ddFixed) {
				return `calc(100% - ${ddWidth}px) ${ddWidth}px`;
			} else {
				return `${dtFr}fr ${ddFr}fr`;
			}
		};

		const gridColumnsPc = getGridColumns(dtFixedPc, dtWidthPc, ddFixedPc, ddWidthPc, clm1FrPc, clm2FrPc);
		const gridColumnsSp = getGridColumns(dtFixedSp, dtWidthSp, ddFixedSp, ddWidthSp, clm1FrSp, clm2FrSp);

		/* dl の幅（両方固定の場合のみ固定幅） */
		const dlWidthPc = (dtFixedPc && ddFixedPc) ? `${dtWidthPc + ddWidthPc}px` : "100%";
		const dlWidthSp = (dtFixedSp && ddFixedSp) ? `${dtWidthSp + ddWidthSp}px` : "100%";

		/* 行操作 */
		const addRow = () => {
			setAttributes({
				rows: [...rows, { dtText: "項目名", ddText: "内容テキスト", pcClm1: null, spClm1: null, bgColor: "", textColor: "" }],
			});
		};

		const removeRow = (index) => {
			setAttributes({
				rows: rows.filter((_, i) => i !== index),
			});
		};

		const updateRow = (index, key, value) => {
			const updated = [...rows];
			updated[index] = { ...updated[index], [key]: value };
			setAttributes({ rows: updated });
		};

		const moveRow = (index, direction) => {
			const targetIndex = index + direction;
			if (targetIndex < 0 || targetIndex >= rows.length) return;

			const reordered = [...rows];
			const [moved] = reordered.splice(index, 1);
			reordered.splice(targetIndex, 0, moved);

			setAttributes({ rows: reordered });
		};

		const effectiveLeftWidth = dlBorderIndividual ? dlBorderLeftWidth : dlBorderWidth;
		const effectiveRightWidth = dlBorderIndividual ? dlBorderRightWidth : dlBorderWidth;
		const extraClasses = [
			"lw-pr-table-2",
			effectiveLeftWidth === 0 ? "no-border-left" : "",
			effectiveRightWidth === 0 ? "no-border-right" : "",
		].filter(Boolean).join(" ");

		const blockProps = useBlockProps({
			className: extraClasses,
			style: {
				"--table-2-dl-width-pc": dlWidthPc,
				"--table-2-dl-width-sp": dlWidthSp,
				"--table-2-grid-columns-pc": gridColumnsPc,
				"--table-2-grid-columns-sp": gridColumnsSp,
				"--table-2-dl-border-color": dlBorderColor,
				"--table-2-dl-border-style": dlBorderStyle,
				"--table-2-dl-border-width": `${dlBorderWidth}px`,
				"--table-2-dl-border-individual": dlBorderIndividual ? "1" : "0",
				"--table-2-dl-border-top-color": dlBorderIndividual ? dlBorderTopColor : dlBorderColor,
				"--table-2-dl-border-top-style": dlBorderIndividual ? dlBorderTopStyle : dlBorderStyle,
				"--table-2-dl-border-top-width": dlBorderIndividual ? `${dlBorderTopWidth}px` : `${dlBorderWidth}px`,
				"--table-2-dl-border-bottom-color": dlBorderIndividual ? dlBorderBottomColor : dlBorderColor,
				"--table-2-dl-border-bottom-style": dlBorderIndividual ? dlBorderBottomStyle : dlBorderStyle,
				"--table-2-dl-border-bottom-width": dlBorderIndividual ? `${dlBorderBottomWidth}px` : `${dlBorderWidth}px`,
				"--table-2-dl-border-left-color": dlBorderIndividual ? dlBorderLeftColor : dlBorderColor,
				"--table-2-dl-border-left-style": dlBorderIndividual ? dlBorderLeftStyle : dlBorderStyle,
				"--table-2-dl-border-left-width": dlBorderIndividual ? `${dlBorderLeftWidth}px` : `${dlBorderWidth}px`,
				"--table-2-dl-border-right-color": dlBorderIndividual ? dlBorderRightColor : dlBorderColor,
				"--table-2-dl-border-right-style": dlBorderIndividual ? dlBorderRightStyle : dlBorderStyle,
				"--table-2-dl-border-right-width": dlBorderIndividual ? `${dlBorderRightWidth}px` : `${dlBorderWidth}px`,
				"--table-2-row-border-color": rowBorderColor,
				"--table-2-row-border-style": rowBorderStyle,
				"--table-2-row-border-width": `${rowBorderWidth}px`,
				"--table-2-dt-border-color": dtBorderColor,
				"--table-2-dt-border-style": dtBorderStyle,
				"--table-2-dt-border-width": `${dtBorderWidth}px`,
				"--table-2-dt-bg-color": dtBgColor || "transparent",
				"--table-2-cell-padding-pc": `${cellPaddingPc}px`,
				"--table-2-cell-padding-sp": `${cellPaddingSpVal}px`,
				"--table-2-font-size-pc": `${fontSizePc}px`,
				"--table-2-font-size-sp": `${fontSizeSpVal}px`,
				"--table-2-dt-align-pc": dtAlignPc || "left",
				"--table-2-dt-align-sp": dtAlignSp || dtAlignPc || "left",
				"--table-2-dd-align-pc": ddAlignPc || "left",
				"--table-2-dd-align-sp": ddAlignSp || ddAlignPc || "left",
				"--table-2-dt-text-color": dtTextColor || "inherit",
				"--table-2-dd-text-color": ddTextColor || "inherit",
			},
		});

		// 1カラム表示の実効値を取得（null ならデフォルト値を使用）
		const getEffectivePcClm1 = (row) => row.pcClm1 === null ? defaultPcClm1 : row.pcClm1;
		const getEffectiveSpClm1 = (row) => row.spClm1 === null ? defaultSpClm1 : row.spClm1;

		return (
			<>
				<InspectorControls>
					{/* ===== レイアウト ===== */}
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<Heading level={4} style={{ marginBottom: "8px" }}>1カラム表示デフォルト</Heading>
						<p style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
							全行に適用。各行で個別に上書き可能
						</p>
						<ToggleControl
							label="PCで1カラム表示"
							checked={defaultPcClm1}
							onChange={(v) => setAttributes({ defaultPcClm1: v })}
						/>
						<ToggleControl
							label="SPで1カラム表示"
							checked={defaultSpClm1}
							onChange={(v) => setAttributes({ defaultSpClm1: v })}
						/>

						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>カラム幅（PC）</Heading>
						<p style={{ marginBottom: "8px", fontSize: "13px" }}>左カラム (DT)</p>
						<ToggleControl
							label="固定幅にする"
							checked={dtFixedPc}
							onChange={(v) => setAttributes({ dtFixedPc: v })}
						/>
						{dtFixedPc ? (
							<RangeControl
								label="幅 (px)"
								value={dtWidthPc}
								onChange={(v) => setAttributes({ dtWidthPc: v })}
								min={50}
								max={600}
								step={10}
							/>
						) : (
							<RangeControl
								label="比率 (fr)"
								value={clm1FrPc}
								onChange={(v) => setAttributes({ clm1FrPc: v })}
								min={1}
								max={10}
								step={1}
							/>
						)}
						<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>右カラム (DD)</p>
						<ToggleControl
							label="固定幅にする"
							checked={ddFixedPc}
							onChange={(v) => setAttributes({ ddFixedPc: v })}
						/>
						{ddFixedPc ? (
							<RangeControl
								label="幅 (px)"
								value={ddWidthPc}
								onChange={(v) => setAttributes({ ddWidthPc: v })}
								min={50}
								max={600}
								step={10}
							/>
						) : (
							<RangeControl
								label="比率 (fr)"
								value={clm2FrPc}
								onChange={(v) => setAttributes({ clm2FrPc: v })}
								min={1}
								max={10}
								step={1}
							/>
						)}
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>カラム幅（SP）</Heading>
						<p style={{ marginBottom: "8px", fontSize: "13px" }}>左カラム (DT)</p>
						<ToggleControl
							label="固定幅にする"
							checked={dtFixedSp}
							onChange={(v) => setAttributes({ dtFixedSp: v })}
						/>
						{dtFixedSp ? (
							<RangeControl
								label="幅 (px)"
								value={dtWidthSp}
								onChange={(v) => setAttributes({ dtWidthSp: v })}
								min={50}
								max={400}
								step={10}
							/>
						) : (
							<RangeControl
								label="比率 (fr)"
								value={clm1FrSp}
								onChange={(v) => setAttributes({ clm1FrSp: v })}
								min={1}
								max={10}
								step={1}
							/>
						)}
						<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>右カラム (DD)</p>
						<ToggleControl
							label="固定幅にする"
							checked={ddFixedSp}
							onChange={(v) => setAttributes({ ddFixedSp: v })}
						/>
						{ddFixedSp ? (
							<RangeControl
								label="幅 (px)"
								value={ddWidthSp}
								onChange={(v) => setAttributes({ ddWidthSp: v })}
								min={50}
								max={400}
								step={10}
							/>
						) : (
							<RangeControl
								label="比率 (fr)"
								value={clm2FrSp}
								onChange={(v) => setAttributes({ clm2FrSp: v })}
								min={1}
								max={10}
								step={1}
							/>
						)}

						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>セル余白</Heading>
						<RangeControl
							label="PC (px)"
							value={cellPaddingPc}
							onChange={(v) => setAttributes({ cellPaddingPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="SP (px) -1でPC継承"
							value={cellPaddingSp}
							onChange={(v) => setAttributes({ cellPaddingSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
					</PanelBody>

					{/* ===== テキスト ===== */}
					<PanelBody title="フォント設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>フォントサイズ</Heading>
						<RangeControl
							label="PC (px)"
							value={fontSizePc}
							onChange={(v) => setAttributes({ fontSizePc: v })}
							min={10}
							max={32}
							step={1}
						/>
						<RangeControl
							label="SP (px) 0でPC継承"
							value={fontSizeSp}
							onChange={(v) => setAttributes({ fontSizeSp: v })}
							min={0}
							max={32}
							step={1}
						/>

						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>フォント設定</Heading>
						<p style={{ marginBottom: "8px", fontSize: "13px" }}>DT（項目名）</p>
						<SelectControl
							label="フォントの種類"
							value={dtFont}
							options={fontOptions}
							onChange={(v) => setAttributes({ dtFont: v })}
						/>
						<SelectControl
							label="フォントの太さ"
							value={dtFontWeight}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ dtFontWeight: v })}
						/>
						<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>DD（内容）</p>
						<SelectControl
							label="フォントの種類"
							value={ddFont}
							options={fontOptions}
							onChange={(v) => setAttributes({ ddFont: v })}
						/>
						<SelectControl
							label="フォントの太さ"
							value={ddFontWeight}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ ddFontWeight: v })}
						/>

						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>テキスト配置</Heading>
						<p style={{ marginBottom: "8px", fontSize: "13px" }}>DT（項目名）</p>
						<SelectControl
							label="PC"
							value={dtAlignPc}
							options={alignOptions}
							onChange={(v) => setAttributes({ dtAlignPc: v })}
						/>
						<SelectControl
							label="SP（空でPC継承）"
							value={dtAlignSp}
							options={alignOptions}
							onChange={(v) => setAttributes({ dtAlignSp: v })}
						/>
						<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>DD（内容）</p>
						<SelectControl
							label="PC"
							value={ddAlignPc}
							options={alignOptions}
							onChange={(v) => setAttributes({ ddAlignPc: v })}
						/>
						<SelectControl
							label="SP（空でPC継承）"
							value={ddAlignSp}
							options={alignOptions}
							onChange={(v) => setAttributes({ ddAlignSp: v })}
						/>

						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>テキスト色</Heading>
						<p style={{ marginBottom: "8px", fontSize: "13px" }}>DT（項目名）</p>
						<ColorPalette
							value={dtTextColor}
							onChange={(color) => setAttributes({ dtTextColor: color || "" })}
						/>
						<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>DD（内容）</p>
						<ColorPalette
							value={ddTextColor}
							onChange={(color) => setAttributes({ ddTextColor: color || "" })}
						/>
					</PanelBody>

					{/* ===== ボーダー ===== */}
					<PanelBody title="枠線設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>テーブル外枠</Heading>
						<ToggleControl
							label="上下左右を個別に設定"
							checked={dlBorderIndividual}
							onChange={(v) => setAttributes({ dlBorderIndividual: v })}
						/>
						{!dlBorderIndividual ? (
							<>
								<p style={{ marginBottom: "8px" }}>ボーダー色</p>
								<ColorPalette
									value={dlBorderColor}
									onChange={(color) => setAttributes({ dlBorderColor: color || "#000000" })}
								/>
								<RangeControl
									label="ボーダー幅 (px)"
									value={dlBorderWidth}
									onChange={(v) => setAttributes({ dlBorderWidth: v })}
									min={0}
									max={10}
									step={1}
								/>
								<SelectControl
									label="ボーダースタイル"
									value={dlBorderStyle}
									options={[
										{ label: "solid", value: "solid" },
										{ label: "dashed", value: "dashed" },
										{ label: "dotted", value: "dotted" },
										{ label: "none", value: "none" },
									]}
									onChange={(v) => setAttributes({ dlBorderStyle: v })}
								/>
							</>
						) : (
							<>
								<p style={{ marginBottom: "8px", fontSize: "13px" }}>上ボーダー</p>
								<p style={{ marginBottom: "8px" }}>ボーダー色</p>
								<ColorPalette
									value={dlBorderTopColor}
									onChange={(color) => setAttributes({ dlBorderTopColor: color || "#000000" })}
								/>
								<RangeControl
									label="ボーダー幅 (px)"
									value={dlBorderTopWidth}
									onChange={(v) => setAttributes({ dlBorderTopWidth: v })}
									min={0}
									max={10}
									step={1}
								/>
								<SelectControl
									label="ボーダースタイル"
									value={dlBorderTopStyle}
									options={[
										{ label: "solid", value: "solid" },
										{ label: "dashed", value: "dashed" },
										{ label: "dotted", value: "dotted" },
										{ label: "none", value: "none" },
									]}
									onChange={(v) => setAttributes({ dlBorderTopStyle: v })}
								/>

								<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>下ボーダー</p>
								<p style={{ marginBottom: "8px" }}>ボーダー色</p>
								<ColorPalette
									value={dlBorderBottomColor}
									onChange={(color) => setAttributes({ dlBorderBottomColor: color || "#000000" })}
								/>
								<RangeControl
									label="ボーダー幅 (px)"
									value={dlBorderBottomWidth}
									onChange={(v) => setAttributes({ dlBorderBottomWidth: v })}
									min={0}
									max={10}
									step={1}
								/>
								<SelectControl
									label="ボーダースタイル"
									value={dlBorderBottomStyle}
									options={[
										{ label: "solid", value: "solid" },
										{ label: "dashed", value: "dashed" },
										{ label: "dotted", value: "dotted" },
										{ label: "none", value: "none" },
									]}
									onChange={(v) => setAttributes({ dlBorderBottomStyle: v })}
								/>

								<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>左ボーダー</p>
								<p style={{ marginBottom: "8px" }}>ボーダー色</p>
								<ColorPalette
									value={dlBorderLeftColor}
									onChange={(color) => setAttributes({ dlBorderLeftColor: color || "#000000" })}
								/>
								<RangeControl
									label="ボーダー幅 (px)"
									value={dlBorderLeftWidth}
									onChange={(v) => setAttributes({ dlBorderLeftWidth: v })}
									min={0}
									max={10}
									step={1}
								/>
								<SelectControl
									label="ボーダースタイル"
									value={dlBorderLeftStyle}
									options={[
										{ label: "solid", value: "solid" },
										{ label: "dashed", value: "dashed" },
										{ label: "dotted", value: "dotted" },
										{ label: "none", value: "none" },
									]}
									onChange={(v) => setAttributes({ dlBorderLeftStyle: v })}
								/>

								<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>右ボーダー</p>
								<p style={{ marginBottom: "8px" }}>ボーダー色</p>
								<ColorPalette
									value={dlBorderRightColor}
									onChange={(color) => setAttributes({ dlBorderRightColor: color || "#000000" })}
								/>
								<RangeControl
									label="ボーダー幅 (px)"
									value={dlBorderRightWidth}
									onChange={(v) => setAttributes({ dlBorderRightWidth: v })}
									min={0}
									max={10}
									step={1}
								/>
								<SelectControl
									label="ボーダースタイル"
									value={dlBorderRightStyle}
									options={[
										{ label: "solid", value: "solid" },
										{ label: "dashed", value: "dashed" },
										{ label: "dotted", value: "dotted" },
										{ label: "none", value: "none" },
									]}
									onChange={(v) => setAttributes({ dlBorderRightStyle: v })}
								/>
							</>
						)}

						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>行ボーダー（横線）</Heading>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={rowBorderColor}
							onChange={(color) => setAttributes({ rowBorderColor: color || "#000000" })}
						/>
						<RangeControl
							label="ボーダー幅 (px)"
							value={rowBorderWidth}
							onChange={(v) => setAttributes({ rowBorderWidth: v })}
							min={0}
							max={10}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル"
							value={rowBorderStyle}
							options={[
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ rowBorderStyle: v })}
						/>

						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>DTボーダー（縦線）</Heading>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={dtBorderColor}
							onChange={(color) => setAttributes({ dtBorderColor: color || "#000000" })}
						/>
						<RangeControl
							label="ボーダー幅 (px)"
							value={dtBorderWidth}
							onChange={(v) => setAttributes({ dtBorderWidth: v })}
							min={0}
							max={10}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル"
							value={dtBorderStyle}
							options={[
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ dtBorderStyle: v })}
						/>
					</PanelBody>

					<PanelBody title="色設定" initialOpen={false}>
						<p style={{ marginBottom: "8px" }}>背景色（空で透明）</p>
						<ColorPalette
							value={dtBgColor}
							onChange={(color) => setAttributes({ dtBgColor: color || "" })}
						/>
					</PanelBody>

					{/* ===== 行の個別設定 ===== */}
					<PanelBody title="行の個別設定" initialOpen={false}>
						{rows.map((row, index) => (
							<div key={index} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: index < rows.length - 1 ? "1px solid #ddd" : "none" }}>
								<Heading level={4} style={{ marginBottom: "8px" }}>行 {index + 1}</Heading>
								<SelectControl
									label="PC 1カラム表示"
									value={row.pcClm1 === null ? "default" : row.pcClm1 ? "on" : "off"}
									options={[
										{ label: `デフォルト（${defaultPcClm1 ? "ON" : "OFF"}）`, value: "default" },
										{ label: "ON", value: "on" },
										{ label: "OFF", value: "off" },
									]}
									onChange={(v) => {
										const newValue = v === "default" ? null : v === "on";
										updateRow(index, "pcClm1", newValue);
									}}
								/>
								<SelectControl
									label="SP 1カラム表示"
									value={row.spClm1 === null ? "default" : row.spClm1 ? "on" : "off"}
									options={[
										{ label: `デフォルト（${defaultSpClm1 ? "ON" : "OFF"}）`, value: "default" },
										{ label: "ON", value: "on" },
										{ label: "OFF", value: "off" },
									]}
									onChange={(v) => {
										const newValue = v === "default" ? null : v === "on";
										updateRow(index, "spClm1", newValue);
									}}
								/>
								<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>背景色</p>
								<ColorPalette
									value={row.bgColor}
									onChange={(color) => updateRow(index, "bgColor", color || "")}
								/>
								<p style={{ marginBottom: "8px", fontSize: "13px", marginTop: "12px" }}>テキスト色</p>
								<ColorPalette
									value={row.textColor}
									onChange={(color) => updateRow(index, "textColor", color || "")}
								/>
							</div>
						))}
					</PanelBody>

				</InspectorControls>

				<div {...blockProps}>
					<dl className="table-2__dl">
						{rows.map((row, index) => {
							const rowClasses = ["table-2__row"];
							if (getEffectivePcClm1(row)) rowClasses.push("pc_clm_1");
							if (getEffectiveSpClm1(row)) rowClasses.push("sp_clm_1");

							const rowStyle = {
								backgroundColor: row.bgColor || undefined,
							};

							// 行ごとのtextColorがあれば、グローバル設定を上書き
							const dtStyle = {
								fontWeight: dtFontWeight || undefined,
								color: row.textColor || undefined,
							};
							const ddStyle = {
								fontWeight: ddFontWeight || undefined,
								color: row.textColor || undefined,
							};

							return (
								<div className={rowClasses.join(" ")} key={index} style={rowStyle}>
									<dt className="table-2__dt">
										<RichText
											tagName="p"
											value={row.dtText}
											onChange={(v) => updateRow(index, "dtText", v)}
											placeholder="項目名を入力"
											data-lw_font_set={dtFont}
											style={dtStyle}
										/>
									</dt>
									<dd className="table-2__dd">
										<RichText
											tagName="p"
											value={row.ddText}
											onChange={(v) => updateRow(index, "ddText", v)}
											placeholder="内容を入力"
											data-lw_font_set={ddFont}
											style={ddStyle}
										/>
									</dd>

									{/* 並べ替え & 削除コントロール */}
									<div className="lw-table-item-controls">
										<button
											type="button"
											onClick={() => moveRow(index, -1)}
											disabled={index === 0}
											className="move-up-button"
											aria-label="上へ移動"
										>
											↑
										</button>
										<button
											type="button"
											onClick={() => moveRow(index, 1)}
											disabled={index === rows.length - 1}
											className="move-down-button"
											aria-label="下へ移動"
										>
											↓
										</button>
										<button
											type="button"
											className="remove-item-button"
											onClick={() => removeRow(index)}
											aria-label="削除"
										>
											削除
										</button>
									</div>
								</div>
							);
						})}
					</dl>

					<button className="table-2__add-btn" onClick={addRow}>
						行を追加する
					</button>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			dtFixedPc,
			dtWidthPc,
			ddFixedPc,
			ddWidthPc,
			clm1FrPc,
			clm2FrPc,
			dtFixedSp,
			dtWidthSp,
			ddFixedSp,
			ddWidthSp,
			clm1FrSp,
			clm2FrSp,
			dlBorderColor,
			dlBorderStyle,
			dlBorderWidth,
			dlBorderIndividual,
			dlBorderTopColor,
			dlBorderTopStyle,
			dlBorderTopWidth,
			dlBorderBottomColor,
			dlBorderBottomStyle,
			dlBorderBottomWidth,
			dlBorderLeftColor,
			dlBorderLeftStyle,
			dlBorderLeftWidth,
			dlBorderRightColor,
			dlBorderRightStyle,
			dlBorderRightWidth,
			rowBorderColor,
			rowBorderStyle,
			rowBorderWidth,
			dtBorderColor,
			dtBorderStyle,
			dtBorderWidth,
			dtBgColor,
			cellPaddingPc,
			cellPaddingSp,
			fontSizePc,
			fontSizeSp,
			dtFont,
			dtFontWeight,
			ddFont,
			ddFontWeight,
			dtAlignPc,
			dtAlignSp,
			ddAlignPc,
			ddAlignSp,
			dtTextColor,
			ddTextColor,
			defaultPcClm1,
			defaultSpClm1,
			rows,
		} = attributes;

		const cellPaddingSpVal = cellPaddingSp >= 0 ? cellPaddingSp : cellPaddingPc;
		const fontSizeSpVal = fontSizeSp > 0 ? fontSizeSp : fontSizePc;

		// 1カラム表示の実効値を取得（null ならデフォルト値を使用）
		const getEffectivePcClm1 = (row) => row.pcClm1 === null ? defaultPcClm1 : row.pcClm1;
		const getEffectiveSpClm1 = (row) => row.spClm1 === null ? defaultSpClm1 : row.spClm1;

		/* grid-template-columns を生成 */
		const getGridColumns = (dtFixed, dtWidth, ddFixed, ddWidth, dtFr, ddFr) => {
			if (dtFixed && ddFixed) {
				return `${dtWidth}px ${ddWidth}px`;
			} else if (dtFixed && !ddFixed) {
				return `${dtWidth}px calc(100% - ${dtWidth}px)`;
			} else if (!dtFixed && ddFixed) {
				return `calc(100% - ${ddWidth}px) ${ddWidth}px`;
			} else {
				return `${dtFr}fr ${ddFr}fr`;
			}
		};

		const gridColumnsPc = getGridColumns(dtFixedPc, dtWidthPc, ddFixedPc, ddWidthPc, clm1FrPc, clm2FrPc);
		const gridColumnsSp = getGridColumns(dtFixedSp, dtWidthSp, ddFixedSp, ddWidthSp, clm1FrSp, clm2FrSp);

		/* dl の幅（両方固定の場合のみ固定幅） */
		const dlWidthPc = (dtFixedPc && ddFixedPc) ? `${dtWidthPc + ddWidthPc}px` : "100%";
		const dlWidthSp = (dtFixedSp && ddFixedSp) ? `${dtWidthSp + ddWidthSp}px` : "100%";

		const effectiveLeftWidth = dlBorderIndividual ? dlBorderLeftWidth : dlBorderWidth;
		const effectiveRightWidth = dlBorderIndividual ? dlBorderRightWidth : dlBorderWidth;
		const extraClasses = [
			"lw-pr-table-2",
			effectiveLeftWidth === 0 ? "no-border-left" : "",
			effectiveRightWidth === 0 ? "no-border-right" : "",
		].filter(Boolean).join(" ");

		const blockProps = useBlockProps.save({
			className: extraClasses,
			style: {
				"--table-2-dl-width-pc": dlWidthPc,
				"--table-2-dl-width-sp": dlWidthSp,
				"--table-2-grid-columns-pc": gridColumnsPc,
				"--table-2-grid-columns-sp": gridColumnsSp,
				"--table-2-dl-border-color": dlBorderColor,
				"--table-2-dl-border-style": dlBorderStyle,
				"--table-2-dl-border-width": `${dlBorderWidth}px`,
				"--table-2-dl-border-individual": dlBorderIndividual ? "1" : "0",
				"--table-2-dl-border-top-color": dlBorderIndividual ? dlBorderTopColor : dlBorderColor,
				"--table-2-dl-border-top-style": dlBorderIndividual ? dlBorderTopStyle : dlBorderStyle,
				"--table-2-dl-border-top-width": dlBorderIndividual ? `${dlBorderTopWidth}px` : `${dlBorderWidth}px`,
				"--table-2-dl-border-bottom-color": dlBorderIndividual ? dlBorderBottomColor : dlBorderColor,
				"--table-2-dl-border-bottom-style": dlBorderIndividual ? dlBorderBottomStyle : dlBorderStyle,
				"--table-2-dl-border-bottom-width": dlBorderIndividual ? `${dlBorderBottomWidth}px` : `${dlBorderWidth}px`,
				"--table-2-dl-border-left-color": dlBorderIndividual ? dlBorderLeftColor : dlBorderColor,
				"--table-2-dl-border-left-style": dlBorderIndividual ? dlBorderLeftStyle : dlBorderStyle,
				"--table-2-dl-border-left-width": dlBorderIndividual ? `${dlBorderLeftWidth}px` : `${dlBorderWidth}px`,
				"--table-2-dl-border-right-color": dlBorderIndividual ? dlBorderRightColor : dlBorderColor,
				"--table-2-dl-border-right-style": dlBorderIndividual ? dlBorderRightStyle : dlBorderStyle,
				"--table-2-dl-border-right-width": dlBorderIndividual ? `${dlBorderRightWidth}px` : `${dlBorderWidth}px`,
				"--table-2-row-border-color": rowBorderColor,
				"--table-2-row-border-style": rowBorderStyle,
				"--table-2-row-border-width": `${rowBorderWidth}px`,
				"--table-2-dt-border-color": dtBorderColor,
				"--table-2-dt-border-style": dtBorderStyle,
				"--table-2-dt-border-width": `${dtBorderWidth}px`,
				"--table-2-dt-bg-color": dtBgColor || "transparent",
				"--table-2-cell-padding-pc": `${cellPaddingPc}px`,
				"--table-2-cell-padding-sp": `${cellPaddingSpVal}px`,
				"--table-2-font-size-pc": `${fontSizePc}px`,
				"--table-2-font-size-sp": `${fontSizeSpVal}px`,
				"--table-2-dt-align-pc": dtAlignPc || "left",
				"--table-2-dt-align-sp": dtAlignSp || dtAlignPc || "left",
				"--table-2-dd-align-pc": ddAlignPc || "left",
				"--table-2-dd-align-sp": ddAlignSp || ddAlignPc || "left",
				"--table-2-dt-text-color": dtTextColor || "inherit",
				"--table-2-dd-text-color": ddTextColor || "inherit",
			},
		});

		return (
			<div {...blockProps}>
				<dl className="table-2__dl">
					{rows.map((row, index) => {
						const rowClasses = ["table-2__row"];
						if (getEffectivePcClm1(row)) rowClasses.push("pc_clm_1");
						if (getEffectiveSpClm1(row)) rowClasses.push("sp_clm_1");

						const rowStyle = {
							backgroundColor: row.bgColor || undefined,
						};

						// 行ごとのtextColorがあれば、グローバル設定を上書き
						const dtStyle = {
							fontWeight: dtFontWeight || undefined,
							color: row.textColor || undefined,
						};
						const ddStyle = {
							fontWeight: ddFontWeight || undefined,
							color: row.textColor || undefined,
						};

						return (
							<div className={rowClasses.join(" ")} key={index} style={rowStyle}>
								<dt className="table-2__dt">
									<RichText.Content
										tagName="p"
										value={row.dtText}
										data-lw_font_set={dtFont}
										style={dtStyle}
									/>
								</dt>
								<dd className="table-2__dd">
									<RichText.Content
										tagName="p"
										value={row.ddText}
										data-lw_font_set={ddFont}
										style={ddStyle}
									/>
								</dd>
							</div>
						);
					})}
				</dl>
			</div>
		);
	},
});
