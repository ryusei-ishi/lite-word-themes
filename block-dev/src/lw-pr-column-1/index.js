import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	ColorPalette,
	useSettings,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	GradientPicker,
	ToggleControl,
	__experimentalHeading as Heading,
} from "@wordpress/components";
// import "./style.scss";  // block.json の style で読み込み済みのため無効化
// import "./editor.scss";  // block.json の editorStyle で読み込み済みのため無効化
import metadata from "./block.json";

const ALLOWED_BLOCKS = ["wdl/lw-pr-column-1-item"];

const TEMPLATE = [
	["wdl/lw-pr-column-1-item", {}],
	["wdl/lw-pr-column-1-item", {}],
	["wdl/lw-pr-column-1-item", {}],
];

// 子ブロック（Column Item）の登録
const ITEM_TEMPLATE = [["core/paragraph", {}]];

registerBlockType("wdl/lw-pr-column-1-item", {
	title: "Column 01 Item",
	category: "lw-utility",
	icon: "screenoptions",
	description: "Column 01のアイテムブロック。内部に任意のブロックを配置可能。",
	parent: ["wdl/lw-pr-column-1"],
	supports: {
		anchor: true,
		className: true,
	},
	attributes: {},
	edit: () => {
		const blockProps = useBlockProps({
			className: "custom_column_item",
		});

		return (
			<div {...blockProps}>
				<InnerBlocks
					template={ITEM_TEMPLATE}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>
		);
	},
	save: () => {
		const blockProps = useBlockProps.save({
			className: "custom_column_item",
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});

// 親ブロック（Column Container）の登録
registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			wrapPaddingTopPc, wrapPaddingRightPc, wrapPaddingBottomPc, wrapPaddingLeftPc,
			wrapPaddingTopSp, wrapPaddingRightSp, wrapPaddingBottomSp, wrapPaddingLeftSp,
			borderColorPc,
			borderWidthPc,
			borderStylePc,
			borderColorSp,
			borderWidthSp,
			borderStyleSp,
			borderRadiusTopLeftPc, borderRadiusTopRightPc, borderRadiusBottomRightPc, borderRadiusBottomLeftPc,
			borderRadiusTopLeftSp, borderRadiusTopRightSp, borderRadiusBottomRightSp, borderRadiusBottomLeftSp,
			wrapBgTypePc, wrapBgColorPc, wrapBgGradientPc,
			wrapBgTypeSp, wrapBgColorSp, wrapBgGradientSp,
			columnsPc,
			columnWidthsPc,
			columnsSp,
			columnWidthsSp,
			rowGapPc,
			rowGapSp,
			columnGapPc,
			columnGapSp,
			itemBgNone,
			itemBgColor,
			itemBgTypePc, itemBgColorPc, itemBgGradientPc,
			itemBgTypeSp, itemBgColorSp, itemBgGradientSp,
			itemMinHeightPc,
			itemMinHeightSp,
			itemPaddingTopPc, itemPaddingRightPc, itemPaddingBottomPc, itemPaddingLeftPc,
			itemPaddingTopSp, itemPaddingRightSp, itemPaddingBottomSp, itemPaddingLeftSp,
			itemBorderRadiusTopLeftPc, itemBorderRadiusTopRightPc, itemBorderRadiusBottomRightPc, itemBorderRadiusBottomLeftPc,
			itemBorderRadiusTopLeftSp, itemBorderRadiusTopRightSp, itemBorderRadiusBottomRightSp, itemBorderRadiusBottomLeftSp,
			itemBorderColorPc, itemBorderWidthPc, itemBorderStylePc,
			itemBorderColorSp, itemBorderWidthSp, itemBorderStyleSp,
			spBreakpoint,
		} = attributes;

		const [gradients, colors] = useSettings('color.gradients', 'color.palette');

		const getWrapBg = (type, color, gradient) => {
			if (type === 'gradient' && gradient) return gradient;
			if (color) return color;
			return '';
		};

		const getItemBg = (type, color, gradient) => {
			if (type === 'gradient' && gradient) return gradient;
			if (color) return color;
			return '';
		};

		// カラム幅配列をカラム数に合わせて調整
		const adjustedWidthsPc = Array.from({ length: columnsPc }, (_, i) => columnWidthsPc[i] || 1);
		const adjustedWidthsSp = Array.from({ length: columnsSp }, (_, i) => {
			if (columnWidthsSp.length > 0 && columnWidthsSp[i] !== undefined) {
				return columnWidthsSp[i];
			}
			return adjustedWidthsPc[i] || 1;
		});

		const gtcPc = adjustedWidthsPc.map(w => `${w}fr`).join(' ');
		const gtcSp = columnWidthsSp.length > 0
			? adjustedWidthsSp.map(w => `${w}fr`).join(' ')
			: Array.from({ length: columnsSp }, (_, i) => `${adjustedWidthsPc[i] || 1}fr`).join(' ');

		const wrapPaddingPcVal = `${wrapPaddingTopPc}px ${wrapPaddingRightPc}px ${wrapPaddingBottomPc}px ${wrapPaddingLeftPc}px`;
		const wrapPaddingSpVal = `${wrapPaddingTopSp >= 0 ? wrapPaddingTopSp : wrapPaddingTopPc}px ${wrapPaddingRightSp >= 0 ? wrapPaddingRightSp : wrapPaddingRightPc}px ${wrapPaddingBottomSp >= 0 ? wrapPaddingBottomSp : wrapPaddingBottomPc}px ${wrapPaddingLeftSp >= 0 ? wrapPaddingLeftSp : wrapPaddingLeftPc}px`;
		const itemPaddingPcVal = `${itemPaddingTopPc}px ${itemPaddingRightPc}px ${itemPaddingBottomPc}px ${itemPaddingLeftPc}px`;
		const itemPaddingSpVal = `${itemPaddingTopSp >= 0 ? itemPaddingTopSp : itemPaddingTopPc}px ${itemPaddingRightSp >= 0 ? itemPaddingRightSp : itemPaddingRightPc}px ${itemPaddingBottomSp >= 0 ? itemPaddingBottomSp : itemPaddingBottomPc}px ${itemPaddingLeftSp >= 0 ? itemPaddingLeftSp : itemPaddingLeftPc}px`;
		const borderRadiusPcVal = `${borderRadiusTopLeftPc}px ${borderRadiusTopRightPc}px ${borderRadiusBottomRightPc}px ${borderRadiusBottomLeftPc}px`;
		const borderRadiusSpVal = `${borderRadiusTopLeftSp >= 0 ? borderRadiusTopLeftSp : borderRadiusTopLeftPc}px ${borderRadiusTopRightSp >= 0 ? borderRadiusTopRightSp : borderRadiusTopRightPc}px ${borderRadiusBottomRightSp >= 0 ? borderRadiusBottomRightSp : borderRadiusBottomRightPc}px ${borderRadiusBottomLeftSp >= 0 ? borderRadiusBottomLeftSp : borderRadiusBottomLeftPc}px`;
		const itemBorderRadiusPcVal = `${itemBorderRadiusTopLeftPc}px ${itemBorderRadiusTopRightPc}px ${itemBorderRadiusBottomRightPc}px ${itemBorderRadiusBottomLeftPc}px`;
		const itemBorderRadiusSpVal = `${itemBorderRadiusTopLeftSp >= 0 ? itemBorderRadiusTopLeftSp : itemBorderRadiusTopLeftPc}px ${itemBorderRadiusTopRightSp >= 0 ? itemBorderRadiusTopRightSp : itemBorderRadiusTopRightPc}px ${itemBorderRadiusBottomRightSp >= 0 ? itemBorderRadiusBottomRightSp : itemBorderRadiusBottomRightPc}px ${itemBorderRadiusBottomLeftSp >= 0 ? itemBorderRadiusBottomLeftSp : itemBorderRadiusBottomLeftPc}px`;
		const wrapBgPcVal = getWrapBg(wrapBgTypePc, wrapBgColorPc, wrapBgGradientPc);
		const wrapBgSpVal = getWrapBg(wrapBgTypeSp, wrapBgColorSp, wrapBgGradientSp) || wrapBgPcVal;

		// アイテム背景（itemBgNoneがtrueの場合は透明、falseの場合は新しい設定を使用）
		const itemBgPcVal = itemBgNone ? 'transparent' : (getItemBg(itemBgTypePc, itemBgColorPc, itemBgGradientPc) || itemBgColor || 'transparent');
		const itemBgSpVal = itemBgNone ? 'transparent' : (getItemBg(itemBgTypeSp, itemBgColorSp, itemBgGradientSp) || itemBgPcVal);

		const blockProps = useBlockProps({
			className: "lw-pr-column-1",
			style: {
				"--column-1-wrap-padding-pc": wrapPaddingPcVal,
				"--column-1-wrap-padding-sp": wrapPaddingSpVal,
				"--column-1-border-color-pc": borderColorPc,
				"--column-1-border-width-pc": borderWidthPc + "px",
				"--column-1-border-style-pc": borderStylePc,
				"--column-1-border-color-sp": borderColorSp || borderColorPc,
				"--column-1-border-width-sp": borderWidthSp >= 0 ? borderWidthSp + "px" : borderWidthPc + "px",
				"--column-1-border-style-sp": borderStyleSp || borderStylePc,
				"--column-1-bdr-pc": borderRadiusPcVal,
				"--column-1-bdr-sp": borderRadiusSpVal,
				"--column-1-wrap-bg-pc": wrapBgPcVal,
				"--column-1-wrap-bg-sp": wrapBgSpVal,
				"--column-1-gtc-pc": gtcPc,
				"--column-1-gtc-sp": gtcSp,
				"--column-1-row-gap-pc": rowGapPc + "px",
				"--column-1-row-gap-sp": rowGapSp >= 0 ? rowGapSp + "px" : rowGapPc + "px",
				"--column-1-column-gap-pc": columnGapPc + "px",
				"--column-1-column-gap-sp": columnGapSp >= 0 ? columnGapSp + "px" : columnGapPc + "px",
				"--column-1-item-bg-pc": itemBgPcVal,
				"--column-1-item-bg-sp": itemBgSpVal,
				"--column-1-item-min-h-pc": itemMinHeightPc + "px",
				"--column-1-item-min-h-sp": itemMinHeightSp + "px",
				"--column-1-item-padding-pc": itemPaddingPcVal,
				"--column-1-item-padding-sp": itemPaddingSpVal,
				"--column-1-item-bdr-pc": itemBorderRadiusPcVal,
				"--column-1-item-bdr-sp": itemBorderRadiusSpVal,
				"--column-1-item-border-color-pc": itemBorderColorPc,
				"--column-1-item-border-width-pc": itemBorderWidthPc + "px",
				"--column-1-item-border-style-pc": itemBorderStylePc,
				"--column-1-item-border-color-sp": itemBorderColorSp || itemBorderColorPc,
				"--column-1-item-border-width-sp": itemBorderWidthSp >= 0 ? itemBorderWidthSp + "px" : itemBorderWidthPc + "px",
				"--column-1-item-border-style-sp": itemBorderStyleSp || itemBorderStylePc,
			},
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="カラム設定" initialOpen={true}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<RangeControl
							label="カラム数"
							value={columnsPc}
							onChange={(v) => {
								const newWidths = Array.from({ length: v }, (_, i) => columnWidthsPc[i] || 1);
								setAttributes({ columnsPc: v, columnWidthsPc: newWidths });
							}}
							min={1}
							max={20}
							step={1}
						/>
						<p style={{ marginBottom: "8px", fontSize: "12px", color: "#757575" }}>カラム幅 (fr)</p>
						{adjustedWidthsPc.map((width, index) => (
							<RangeControl
								key={`pc-${index}`}
								label={`${index + 1}列目`}
								value={width}
								onChange={(v) => {
									const newWidths = [...adjustedWidthsPc];
									newWidths[index] = v;
									setAttributes({ columnWidthsPc: newWidths });
								}}
								min={1}
								max={20}
								step={1}
							/>
						))}
						<p style={{ marginTop: "16px", marginBottom: "8px", fontSize: "12px", color: "#757575" }}>間隔（Gap）</p>
						<RangeControl
							label="列の間隔 (px)"
							value={columnGapPc}
							onChange={(v) => setAttributes({ columnGapPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="行の間隔 (px)"
							value={rowGapPc}
							onChange={(v) => setAttributes({ rowGapPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP</Heading>
						<RangeControl
							label="カラム数"
							value={columnsSp}
							onChange={(v) => setAttributes({ columnsSp: v })}
							min={1}
							max={20}
							step={1}
						/>
						<p style={{ marginBottom: "8px", fontSize: "12px", color: "#757575" }}>カラム幅 (fr) - 空でPC継承</p>
						{Array.from({ length: columnsSp }, (_, index) => (
							<RangeControl
								key={`sp-${index}`}
								label={`${index + 1}列目`}
								value={columnWidthsSp[index] !== undefined ? columnWidthsSp[index] : (adjustedWidthsPc[index] || 1)}
								onChange={(v) => {
									const newWidths = Array.from({ length: columnsSp }, (_, i) => {
										if (i === index) return v;
										return columnWidthsSp[i] !== undefined ? columnWidthsSp[i] : (adjustedWidthsPc[i] || 1);
									});
									setAttributes({ columnWidthsSp: newWidths });
								}}
								min={1}
								max={20}
								step={1}
							/>
						))}
						<p style={{ marginTop: "16px", marginBottom: "8px", fontSize: "12px", color: "#757575" }}>間隔（Gap）- -1でPC継承</p>
						<RangeControl
							label="列の間隔 (px)"
							value={columnGapSp}
							onChange={(v) => setAttributes({ columnGapSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="行の間隔 (px)"
							value={rowGapSp}
							onChange={(v) => setAttributes({ rowGapSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<SelectControl
							label="レスポンシブ切替値"
							value={spBreakpoint}
							options={[
								{ label: "デフォルト (700px)", value: "" },
								{ label: "600px", value: "600" },
								{ label: "500px", value: "500" },
								{ label: "400px", value: "400" },
							]}
							onChange={(v) => setAttributes({ spBreakpoint: v })}
						/>
					</PanelBody>

					<PanelBody title="アイテム設定" initialOpen={false}>
						<ToggleControl
							label="背景なし"
							checked={itemBgNone}
							onChange={(v) => setAttributes({ itemBgNone: v })}
						/>
						{!itemBgNone && (
							<>
								<Heading level={4} style={{ marginBottom: "8px" }}>背景 PC</Heading>
								<SelectControl
									label="タイプ"
									value={itemBgTypePc}
									options={[
										{ label: "単色", value: "solid" },
										{ label: "グラデーション", value: "gradient" },
									]}
									onChange={(v) => setAttributes({ itemBgTypePc: v })}
								/>
								{itemBgTypePc === "solid" ? (
									<>
										<p style={{ marginBottom: "8px" }}>背景色</p>
										<ColorPalette
											value={itemBgColorPc || itemBgColor}
											onChange={(color) => setAttributes({ itemBgColorPc: color || "" })}
											colors={colors}
										/>
									</>
								) : (
									<GradientPicker
										value={itemBgGradientPc || undefined}
										onChange={(gradient) => setAttributes({ itemBgGradientPc: gradient || "" })}
										gradients={gradients || []}
									/>
								)}
								<hr style={{ margin: "16px 0" }} />
								<Heading level={4} style={{ marginBottom: "8px" }}>背景 SP (空でPC継承)</Heading>
								<SelectControl
									label="タイプ"
									value={itemBgTypeSp}
									options={[
										{ label: "単色", value: "solid" },
										{ label: "グラデーション", value: "gradient" },
									]}
									onChange={(v) => setAttributes({ itemBgTypeSp: v })}
								/>
								{itemBgTypeSp === "solid" ? (
									<>
										<p style={{ marginBottom: "8px" }}>背景色</p>
										<ColorPalette
											value={itemBgColorSp}
											onChange={(color) => setAttributes({ itemBgColorSp: color || "" })}
											colors={colors}
										/>
									</>
								) : (
									<GradientPicker
										value={itemBgGradientSp || itemBgGradientPc || undefined}
										onChange={(gradient) => setAttributes({ itemBgGradientSp: gradient || "" })}
										gradients={gradients || []}
									/>
								)}
							</>
						)}
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>最小高さ</Heading>
						<RangeControl
							label="PC (px)"
							value={itemMinHeightPc}
							onChange={(v) => setAttributes({ itemMinHeightPc: v })}
							min={0}
							max={500}
							step={10}
						/>
						<RangeControl
							label="SP (px)"
							value={itemMinHeightSp}
							onChange={(v) => setAttributes({ itemMinHeightSp: v })}
							min={0}
							max={500}
							step={10}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>余白 PC</Heading>
						<RangeControl
							label="上 (px)"
							value={itemPaddingTopPc}
							onChange={(v) => setAttributes({ itemPaddingTopPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右 (px)"
							value={itemPaddingRightPc}
							onChange={(v) => setAttributes({ itemPaddingRightPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="下 (px)"
							value={itemPaddingBottomPc}
							onChange={(v) => setAttributes({ itemPaddingBottomPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左 (px)"
							value={itemPaddingLeftPc}
							onChange={(v) => setAttributes({ itemPaddingLeftPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>余白 SP (-1でPC継承)</Heading>
						<RangeControl
							label="上 (px)"
							value={itemPaddingTopSp}
							onChange={(v) => setAttributes({ itemPaddingTopSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右 (px)"
							value={itemPaddingRightSp}
							onChange={(v) => setAttributes({ itemPaddingRightSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="下 (px)"
							value={itemPaddingBottomSp}
							onChange={(v) => setAttributes({ itemPaddingBottomSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左 (px)"
							value={itemPaddingLeftSp}
							onChange={(v) => setAttributes({ itemPaddingLeftSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>角丸 PC</Heading>
						<RangeControl
							label="左上 (px)"
							value={itemBorderRadiusTopLeftPc}
							onChange={(v) => setAttributes({ itemBorderRadiusTopLeftPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右上 (px)"
							value={itemBorderRadiusTopRightPc}
							onChange={(v) => setAttributes({ itemBorderRadiusTopRightPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右下 (px)"
							value={itemBorderRadiusBottomRightPc}
							onChange={(v) => setAttributes({ itemBorderRadiusBottomRightPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左下 (px)"
							value={itemBorderRadiusBottomLeftPc}
							onChange={(v) => setAttributes({ itemBorderRadiusBottomLeftPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>角丸 SP (-1でPC継承)</Heading>
						<RangeControl
							label="左上 (px)"
							value={itemBorderRadiusTopLeftSp}
							onChange={(v) => setAttributes({ itemBorderRadiusTopLeftSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右上 (px)"
							value={itemBorderRadiusTopRightSp}
							onChange={(v) => setAttributes({ itemBorderRadiusTopRightSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右下 (px)"
							value={itemBorderRadiusBottomRightSp}
							onChange={(v) => setAttributes({ itemBorderRadiusBottomRightSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左下 (px)"
							value={itemBorderRadiusBottomLeftSp}
							onChange={(v) => setAttributes({ itemBorderRadiusBottomLeftSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー PC</Heading>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={itemBorderColorPc}
							onChange={(color) => setAttributes({ itemBorderColorPc: color || "rgb(131, 131, 131)" })}
						/>
						<RangeControl
							label="ボーダー幅 (px)"
							value={itemBorderWidthPc}
							onChange={(v) => setAttributes({ itemBorderWidthPc: v })}
							min={0}
							max={10}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル"
							value={itemBorderStylePc}
							options={[
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ itemBorderStylePc: v })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー SP（空でPC継承）</Heading>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={itemBorderColorSp}
							onChange={(color) => setAttributes({ itemBorderColorSp: color || "" })}
						/>
						<RangeControl
							label="ボーダー幅 (px) (-1でPC継承)"
							value={itemBorderWidthSp}
							onChange={(v) => setAttributes({ itemBorderWidthSp: v })}
							min={-1}
							max={10}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル（空でPC継承）"
							value={itemBorderStyleSp}
							options={[
								{ label: "PC継承", value: "" },
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ itemBorderStyleSp: v })}
						/>
					</PanelBody>

					<PanelBody title="ラップ：余白" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<RangeControl
							label="上 (px)"
							value={wrapPaddingTopPc}
							onChange={(v) => setAttributes({ wrapPaddingTopPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右 (px)"
							value={wrapPaddingRightPc}
							onChange={(v) => setAttributes({ wrapPaddingRightPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="下 (px)"
							value={wrapPaddingBottomPc}
							onChange={(v) => setAttributes({ wrapPaddingBottomPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左 (px)"
							value={wrapPaddingLeftPc}
							onChange={(v) => setAttributes({ wrapPaddingLeftPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP (-1でPC継承)</Heading>
						<RangeControl
							label="上 (px)"
							value={wrapPaddingTopSp}
							onChange={(v) => setAttributes({ wrapPaddingTopSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右 (px)"
							value={wrapPaddingRightSp}
							onChange={(v) => setAttributes({ wrapPaddingRightSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="下 (px)"
							value={wrapPaddingBottomSp}
							onChange={(v) => setAttributes({ wrapPaddingBottomSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左 (px)"
							value={wrapPaddingLeftSp}
							onChange={(v) => setAttributes({ wrapPaddingLeftSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
					</PanelBody>

					<PanelBody title="ラップ：ボーダー" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={borderColorPc}
							onChange={(color) => setAttributes({ borderColorPc: color || "rgb(131, 131, 131)" })}
						/>
						<RangeControl
							label="ボーダー幅 (px)"
							value={borderWidthPc}
							onChange={(v) => setAttributes({ borderWidthPc: v })}
							min={0}
							max={10}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル"
							value={borderStylePc}
							options={[
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ borderStylePc: v })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP（空でPC継承）</Heading>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={borderColorSp}
							onChange={(color) => setAttributes({ borderColorSp: color || "" })}
						/>
						<RangeControl
							label="ボーダー幅 (px) (-1でPC継承)"
							value={borderWidthSp}
							onChange={(v) => setAttributes({ borderWidthSp: v })}
							min={-1}
							max={10}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル（空でPC継承）"
							value={borderStyleSp}
							options={[
								{ label: "PC継承", value: "" },
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ borderStyleSp: v })}
						/>
					</PanelBody>

					<PanelBody title="ラップ：角丸" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<RangeControl
							label="左上 (px)"
							value={borderRadiusTopLeftPc}
							onChange={(v) => setAttributes({ borderRadiusTopLeftPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右上 (px)"
							value={borderRadiusTopRightPc}
							onChange={(v) => setAttributes({ borderRadiusTopRightPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右下 (px)"
							value={borderRadiusBottomRightPc}
							onChange={(v) => setAttributes({ borderRadiusBottomRightPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左下 (px)"
							value={borderRadiusBottomLeftPc}
							onChange={(v) => setAttributes({ borderRadiusBottomLeftPc: v })}
							min={0}
							max={64}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP (-1でPC継承)</Heading>
						<RangeControl
							label="左上 (px)"
							value={borderRadiusTopLeftSp}
							onChange={(v) => setAttributes({ borderRadiusTopLeftSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右上 (px)"
							value={borderRadiusTopRightSp}
							onChange={(v) => setAttributes({ borderRadiusTopRightSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="右下 (px)"
							value={borderRadiusBottomRightSp}
							onChange={(v) => setAttributes({ borderRadiusBottomRightSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
						<RangeControl
							label="左下 (px)"
							value={borderRadiusBottomLeftSp}
							onChange={(v) => setAttributes({ borderRadiusBottomLeftSp: v })}
							min={-1}
							max={64}
							step={1}
						/>
					</PanelBody>

					<PanelBody title="ラップ：背景" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<SelectControl
							label="タイプ"
							value={wrapBgTypePc}
							options={[
								{ label: "単色", value: "solid" },
								{ label: "グラデーション", value: "gradient" },
							]}
							onChange={(v) => setAttributes({ wrapBgTypePc: v })}
						/>
						{wrapBgTypePc === "solid" ? (
							<>
								<p style={{ marginBottom: "8px" }}>背景色</p>
								<ColorPalette
									value={wrapBgColorPc}
									onChange={(color) => setAttributes({ wrapBgColorPc: color || "" })}
									colors={colors}
								/>
							</>
						) : (
							<GradientPicker
								value={wrapBgGradientPc || undefined}
								onChange={(gradient) => setAttributes({ wrapBgGradientPc: gradient || "" })}
								gradients={gradients || []}
							/>
						)}
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP (空でPC継承)</Heading>
						<SelectControl
							label="タイプ"
							value={wrapBgTypeSp}
							options={[
								{ label: "単色", value: "solid" },
								{ label: "グラデーション", value: "gradient" },
							]}
							onChange={(v) => setAttributes({ wrapBgTypeSp: v })}
						/>
						{wrapBgTypeSp === "solid" ? (
							<>
								<p style={{ marginBottom: "8px" }}>背景色</p>
								<ColorPalette
									value={wrapBgColorSp}
									onChange={(color) => setAttributes({ wrapBgColorSp: color || "" })}
									colors={colors}
								/>
							</>
						) : (
							<GradientPicker
								value={wrapBgGradientSp || wrapBgGradientPc || undefined}
								onChange={(gradient) => setAttributes({ wrapBgGradientSp: gradient || "" })}
								gradients={gradients || []}
							/>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="custom_wrap">
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={TEMPLATE}
							renderAppender={InnerBlocks.ButtonBlockAppender}
						/>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			wrapPaddingTopPc, wrapPaddingRightPc, wrapPaddingBottomPc, wrapPaddingLeftPc,
			wrapPaddingTopSp, wrapPaddingRightSp, wrapPaddingBottomSp, wrapPaddingLeftSp,
			borderColorPc,
			borderWidthPc,
			borderStylePc,
			borderColorSp,
			borderWidthSp,
			borderStyleSp,
			borderRadiusTopLeftPc, borderRadiusTopRightPc, borderRadiusBottomRightPc, borderRadiusBottomLeftPc,
			borderRadiusTopLeftSp, borderRadiusTopRightSp, borderRadiusBottomRightSp, borderRadiusBottomLeftSp,
			wrapBgTypePc, wrapBgColorPc, wrapBgGradientPc,
			wrapBgTypeSp, wrapBgColorSp, wrapBgGradientSp,
			columnsPc,
			columnWidthsPc,
			columnsSp,
			columnWidthsSp,
			rowGapPc,
			rowGapSp,
			columnGapPc,
			columnGapSp,
			itemBgNone,
			itemBgColor,
			itemBgTypePc, itemBgColorPc, itemBgGradientPc,
			itemBgTypeSp, itemBgColorSp, itemBgGradientSp,
			itemMinHeightPc,
			itemMinHeightSp,
			itemPaddingTopPc, itemPaddingRightPc, itemPaddingBottomPc, itemPaddingLeftPc,
			itemPaddingTopSp, itemPaddingRightSp, itemPaddingBottomSp, itemPaddingLeftSp,
			itemBorderRadiusTopLeftPc, itemBorderRadiusTopRightPc, itemBorderRadiusBottomRightPc, itemBorderRadiusBottomLeftPc,
			itemBorderRadiusTopLeftSp, itemBorderRadiusTopRightSp, itemBorderRadiusBottomRightSp, itemBorderRadiusBottomLeftSp,
			itemBorderColorPc, itemBorderWidthPc, itemBorderStylePc,
			itemBorderColorSp, itemBorderWidthSp, itemBorderStyleSp,
			spBreakpoint,
		} = attributes;

		// カラム幅配列をカラム数に合わせて調整
		const adjustedWidthsPc = Array.from({ length: columnsPc }, (_, i) => columnWidthsPc[i] || 1);
		const adjustedWidthsSp = Array.from({ length: columnsSp }, (_, i) => {
			if (columnWidthsSp.length > 0 && columnWidthsSp[i] !== undefined) {
				return columnWidthsSp[i];
			}
			return adjustedWidthsPc[i] || 1;
		});

		const gtcPc = adjustedWidthsPc.map(w => `${w}fr`).join(' ');
		const gtcSp = columnWidthsSp.length > 0
			? adjustedWidthsSp.map(w => `${w}fr`).join(' ')
			: Array.from({ length: columnsSp }, (_, i) => `${adjustedWidthsPc[i] || 1}fr`).join(' ');

		const wrapPaddingPcVal = `${wrapPaddingTopPc}px ${wrapPaddingRightPc}px ${wrapPaddingBottomPc}px ${wrapPaddingLeftPc}px`;
		const wrapPaddingSpVal = `${wrapPaddingTopSp >= 0 ? wrapPaddingTopSp : wrapPaddingTopPc}px ${wrapPaddingRightSp >= 0 ? wrapPaddingRightSp : wrapPaddingRightPc}px ${wrapPaddingBottomSp >= 0 ? wrapPaddingBottomSp : wrapPaddingBottomPc}px ${wrapPaddingLeftSp >= 0 ? wrapPaddingLeftSp : wrapPaddingLeftPc}px`;
		const itemPaddingPcVal = `${itemPaddingTopPc}px ${itemPaddingRightPc}px ${itemPaddingBottomPc}px ${itemPaddingLeftPc}px`;
		const itemPaddingSpVal = `${itemPaddingTopSp >= 0 ? itemPaddingTopSp : itemPaddingTopPc}px ${itemPaddingRightSp >= 0 ? itemPaddingRightSp : itemPaddingRightPc}px ${itemPaddingBottomSp >= 0 ? itemPaddingBottomSp : itemPaddingBottomPc}px ${itemPaddingLeftSp >= 0 ? itemPaddingLeftSp : itemPaddingLeftPc}px`;
		const borderRadiusPcVal = `${borderRadiusTopLeftPc}px ${borderRadiusTopRightPc}px ${borderRadiusBottomRightPc}px ${borderRadiusBottomLeftPc}px`;
		const borderRadiusSpVal = `${borderRadiusTopLeftSp >= 0 ? borderRadiusTopLeftSp : borderRadiusTopLeftPc}px ${borderRadiusTopRightSp >= 0 ? borderRadiusTopRightSp : borderRadiusTopRightPc}px ${borderRadiusBottomRightSp >= 0 ? borderRadiusBottomRightSp : borderRadiusBottomRightPc}px ${borderRadiusBottomLeftSp >= 0 ? borderRadiusBottomLeftSp : borderRadiusBottomLeftPc}px`;
		const itemBorderRadiusPcVal = `${itemBorderRadiusTopLeftPc}px ${itemBorderRadiusTopRightPc}px ${itemBorderRadiusBottomRightPc}px ${itemBorderRadiusBottomLeftPc}px`;
		const itemBorderRadiusSpVal = `${itemBorderRadiusTopLeftSp >= 0 ? itemBorderRadiusTopLeftSp : itemBorderRadiusTopLeftPc}px ${itemBorderRadiusTopRightSp >= 0 ? itemBorderRadiusTopRightSp : itemBorderRadiusTopRightPc}px ${itemBorderRadiusBottomRightSp >= 0 ? itemBorderRadiusBottomRightSp : itemBorderRadiusBottomRightPc}px ${itemBorderRadiusBottomLeftSp >= 0 ? itemBorderRadiusBottomLeftSp : itemBorderRadiusBottomLeftPc}px`;

		const getWrapBg = (type, color, gradient) => {
			if (type === 'gradient' && gradient) return gradient;
			if (color) return color;
			return '';
		};
		const wrapBgPcVal = getWrapBg(wrapBgTypePc, wrapBgColorPc, wrapBgGradientPc);
		const wrapBgSpVal = getWrapBg(wrapBgTypeSp, wrapBgColorSp, wrapBgGradientSp) || wrapBgPcVal;

		const getItemBg = (type, color, gradient) => {
			if (type === 'gradient' && gradient) return gradient;
			if (color) return color;
			return '';
		};
		// アイテム背景（itemBgNoneがtrueの場合は透明、falseの場合は新しい設定を使用）
		const itemBgPcVal = itemBgNone ? 'transparent' : (getItemBg(itemBgTypePc, itemBgColorPc, itemBgGradientPc) || itemBgColor || 'transparent');
		const itemBgSpVal = itemBgNone ? 'transparent' : (getItemBg(itemBgTypeSp, itemBgColorSp, itemBgGradientSp) || itemBgPcVal);

		// ブレークポイントクラス
		const bpClass = spBreakpoint ? `lw-bp-${spBreakpoint}` : '';

		const blockProps = useBlockProps.save({
			className: `lw-pr-column-1${bpClass ? ` ${bpClass}` : ''}`,
			style: {
				"--column-1-wrap-padding-pc": wrapPaddingPcVal,
				"--column-1-wrap-padding-sp": wrapPaddingSpVal,
				"--column-1-border-color-pc": borderColorPc,
				"--column-1-border-width-pc": borderWidthPc + "px",
				"--column-1-border-style-pc": borderStylePc,
				"--column-1-border-color-sp": borderColorSp || borderColorPc,
				"--column-1-border-width-sp": borderWidthSp >= 0 ? borderWidthSp + "px" : borderWidthPc + "px",
				"--column-1-border-style-sp": borderStyleSp || borderStylePc,
				"--column-1-bdr-pc": borderRadiusPcVal,
				"--column-1-bdr-sp": borderRadiusSpVal,
				"--column-1-wrap-bg-pc": wrapBgPcVal,
				"--column-1-wrap-bg-sp": wrapBgSpVal,
				"--column-1-gtc-pc": gtcPc,
				"--column-1-gtc-sp": gtcSp,
				"--column-1-row-gap-pc": rowGapPc + "px",
				"--column-1-row-gap-sp": rowGapSp >= 0 ? rowGapSp + "px" : rowGapPc + "px",
				"--column-1-column-gap-pc": columnGapPc + "px",
				"--column-1-column-gap-sp": columnGapSp >= 0 ? columnGapSp + "px" : columnGapPc + "px",
				"--column-1-item-bg-pc": itemBgPcVal,
				"--column-1-item-bg-sp": itemBgSpVal,
				"--column-1-item-min-h-pc": itemMinHeightPc + "px",
				"--column-1-item-min-h-sp": itemMinHeightSp + "px",
				"--column-1-item-padding-pc": itemPaddingPcVal,
				"--column-1-item-padding-sp": itemPaddingSpVal,
				"--column-1-item-bdr-pc": itemBorderRadiusPcVal,
				"--column-1-item-bdr-sp": itemBorderRadiusSpVal,
				"--column-1-item-border-color-pc": itemBorderColorPc,
				"--column-1-item-border-width-pc": itemBorderWidthPc + "px",
				"--column-1-item-border-style-pc": itemBorderStylePc,
				"--column-1-item-border-color-sp": itemBorderColorSp || itemBorderColorPc,
				"--column-1-item-border-width-sp": itemBorderWidthSp >= 0 ? itemBorderWidthSp + "px" : itemBorderWidthPc + "px",
				"--column-1-item-border-style-sp": itemBorderStyleSp || itemBorderStylePc,
			},
		});

		return (
			<div {...blockProps}>
				<div className="custom_wrap">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
