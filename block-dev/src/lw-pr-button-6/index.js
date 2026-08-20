/**
 * LiteWord – ボタン 06
 * ------------------------------------------------------------
 *  • ブロック名 : wdl/lw-pr-button-6
 *  • グリッドレイアウトのボタンブロック
 * ----------------------------------------------------------- */
import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	useBlockProps,
	ColorPalette,
	RichText,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import metadata from "./block.json";
import { fontOptionsArr, fontWeightOptionsArr } from "../utils.js";
import { LinkPicker, lwLinkProps } from "../link-picker.js";

/* フォントオプション */
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* 配置オプション */
const positionOptions = [
	{ label: "左寄せ", value: "flex-start" },
	{ label: "中央", value: "center" },
	{ label: "右寄せ", value: "flex-end" },
];

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			button6Buttons,
			button6MaxWidthPc,
			button6MaxWidthSp,
			button6ColumnsPc,
			button6ColumnsSp,
			button6RowGapPc,
			button6RowGapSp,
			button6ColumnGapPc,
			button6ColumnGapSp,
			button6PaddingTopPc,
			button6PaddingRightPc,
			button6PaddingBottomPc,
			button6PaddingLeftPc,
			button6PaddingTopSp,
			button6PaddingRightSp,
			button6PaddingBottomSp,
			button6PaddingLeftSp,
			button6MinHeightPc,
			button6MinHeightSp,
			button6PositionPc,
			button6PositionSp,
			button6FontSizePc,
			button6FontSizeSp,
			button6BorderWidthPc,
			button6BorderWidthSp,
			button6BorderStyle,
			button6BorderColor,
			button6TextColor,
			button6BorderRadiusPc,
			button6BorderRadiusSp,
			button6BgColor,
			button6FontSet,
			button6FontWeight,
			button6ShowArrow,
			button6TextAlign,
			button6ArrowColor,
		} = attributes;

		const ARROW_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/></svg>';

		/* ボタン操作関数 */
		const updateButton = (index, key, value) => {
			const newButtons = [...button6Buttons];
			newButtons[index] = { ...newButtons[index], [key]: value };
			setAttributes({ button6Buttons: newButtons });
		};

		/* リンク設定のように複数の項目をまとめて更新する用 */
		const updateButtonMany = (index, patch) => {
			const newButtons = [...button6Buttons];
			newButtons[index] = { ...newButtons[index], ...patch };
			setAttributes({ button6Buttons: newButtons });
		};

		const addButton = () => {
			setAttributes({
				button6Buttons: [...button6Buttons, { text: "リンクテキスト", linkType: "url", url: "", isBlank: false }],
			});
		};

		const removeButton = (index) => {
			const newButtons = button6Buttons.filter((_, i) => i !== index);
			setAttributes({ button6Buttons: newButtons });
		};

		const moveButton = (index, direction) => {
			const newButtons = [...button6Buttons];
			const newIndex = index + direction;
			if (newIndex < 0 || newIndex >= newButtons.length) return;
			[newButtons[index], newButtons[newIndex]] = [newButtons[newIndex], newButtons[index]];
			setAttributes({ button6Buttons: newButtons });
		};

		/* padding値を生成 */
		const paddingPcVal = `${button6PaddingTopPc}px ${button6PaddingRightPc}px ${button6PaddingBottomPc}px ${button6PaddingLeftPc}px`;
		const paddingSpVal = `${button6PaddingTopSp >= 0 ? button6PaddingTopSp : button6PaddingTopPc}px ${button6PaddingRightSp >= 0 ? button6PaddingRightSp : button6PaddingRightPc}px ${button6PaddingBottomSp >= 0 ? button6PaddingBottomSp : button6PaddingBottomPc}px ${button6PaddingLeftSp >= 0 ? button6PaddingLeftSp : button6PaddingLeftPc}px`;

		const blockProps = useBlockProps({
			className: "lw-pr-button-6",
		});

		const wrapStyle = {
			"--button-6-max-width-pc": `${button6MaxWidthPc}px`,
			"--button-6-max-width-sp": button6MaxWidthSp >= 0 ? `${button6MaxWidthSp}px` : `${button6MaxWidthPc}px`,
			"--button-6-gtc-pc": button6ColumnsPc,
			"--button-6-gtc-sp": button6ColumnsSp,
			"--button-6-row-gap-pc": `${button6RowGapPc}px`,
			"--button-6-row-gap-sp": button6RowGapSp >= 0 ? `${button6RowGapSp}px` : `${button6RowGapPc}px`,
			"--button-6-column-gap-pc": `${button6ColumnGapPc}px`,
			"--button-6-column-gap-sp": button6ColumnGapSp >= 0 ? `${button6ColumnGapSp}px` : `${button6ColumnGapPc}px`,
			"--button-6-item-padding-pc": paddingPcVal,
			"--button-6-item-padding-sp": paddingSpVal,
			"--button-6-item-min-height-pc": `${button6MinHeightPc}px`,
			"--button-6-item-min-height-sp": `${button6MinHeightSp}px`,
			"--button-6-item-position-pc": button6PositionPc,
			"--button-6-item-position-sp": button6PositionSp || button6PositionPc,
			"--button-6-item-fontsize-pc": `${button6FontSizePc}px`,
			"--button-6-item-fontsize-sp": `${button6FontSizeSp}px`,
			"--button-6-item-bd-width-pc": `${button6BorderWidthPc}px`,
			"--button-6-item-bd-width-sp": button6BorderWidthSp >= 0 ? `${button6BorderWidthSp}px` : `${button6BorderWidthPc}px`,
			"--button-6-item-border-style": button6BorderStyle,
			"--button-6-item-border-color": button6BorderColor,
			"--button-6-item-text-color": button6TextColor,
			"--button-6-item-border-radius-pc": `${button6BorderRadiusPc}px`,
			"--button-6-item-border-radius-sp": button6BorderRadiusSp >= 0 ? `${button6BorderRadiusSp}px` : `${button6BorderRadiusPc}px`,
			"--button-6-item-bg-color": button6BgColor,
			"--button-6-item-text-align": button6TextAlign,
		};

		return (
			<>
				<InspectorControls>
					{/* ボタン設定 */}
					<PanelBody title="基本設定" initialOpen={true}>
						{button6Buttons.map((button, index) => (
							<div
								key={index}
								style={{
									marginBottom: "16px",
									padding: "12px",
									border: "1px solid #ddd",
									borderRadius: "4px",
									background: "#f9f9f9",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
									<Heading level={5} style={{ margin: 0 }}>ボタン {index + 1}</Heading>
									<div style={{ display: "flex", gap: "4px" }}>
										<Button
											icon="arrow-up-alt2"
											label="上へ移動"
											onClick={() => moveButton(index, -1)}
											disabled={index === 0}
											size="small"
										/>
										<Button
											icon="arrow-down-alt2"
											label="下へ移動"
											onClick={() => moveButton(index, 1)}
											disabled={index === button6Buttons.length - 1}
											size="small"
										/>
										<Button
											icon="trash"
											label="削除"
											onClick={() => removeButton(index)}
											isDestructive
											size="small"
											disabled={button6Buttons.length === 1}
										/>
									</div>
								</div>
								<LinkPicker
									link={button}
									onChange={(patch) => updateButtonMany(index, patch)}
								/>
								<ToggleControl
									label="新しいタブで開く"
									checked={button.isBlank}
									onChange={(v) => updateButton(index, "isBlank", v)}
								/>
							</div>
						))}
						<Button
							variant="secondary"
							onClick={addButton}
							style={{ width: "100%" }}
						>
							+ ボタンを追加
						</Button>
					</PanelBody>

					{/* フォント設定 */}
					<PanelBody title="フォント設定" initialOpen={false}>
						<SelectControl
							label="フォントの種類"
							value={button6FontSet}
							options={fontOptions}
							onChange={(v) => setAttributes({ button6FontSet: v })}
						/>
						<SelectControl
							label="フォントの太さ"
							value={button6FontWeight}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ button6FontWeight: v })}
						/>
					</PanelBody>

					{/* レイアウト設定 */}
					<PanelBody title="レイアウト設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>最大幅 (px)</Heading>
						<RangeControl
							label="PC"
							value={button6MaxWidthPc}
							onChange={(v) => setAttributes({ button6MaxWidthPc: v })}
							min={200}
							max={1200}
							step={10}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={button6MaxWidthSp}
							onChange={(v) => setAttributes({ button6MaxWidthSp: v })}
							min={-1}
							max={1200}
							step={10}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>列数（カラム数）</Heading>
						<RangeControl
							label="PC"
							value={button6ColumnsPc}
							onChange={(v) => setAttributes({ button6ColumnsPc: v })}
							min={1}
							max={6}
							step={1}
						/>
						<RangeControl
							label="SP"
							value={button6ColumnsSp}
							onChange={(v) => setAttributes({ button6ColumnsSp: v })}
							min={1}
							max={6}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>間隔 (px)</Heading>
						<RangeControl
							label="行間 PC"
							value={button6RowGapPc}
							onChange={(v) => setAttributes({ button6RowGapPc: v })}
							min={0}
							max={40}
							step={2}
						/>
						<RangeControl
							label="行間 SP (-1でPC継承)"
							value={button6RowGapSp}
							onChange={(v) => setAttributes({ button6RowGapSp: v })}
							min={-1}
							max={40}
							step={2}
						/>
						<RangeControl
							label="列間 PC"
							value={button6ColumnGapPc}
							onChange={(v) => setAttributes({ button6ColumnGapPc: v })}
							min={0}
							max={40}
							step={2}
						/>
						<RangeControl
							label="列間 SP (-1でPC継承)"
							value={button6ColumnGapSp}
							onChange={(v) => setAttributes({ button6ColumnGapSp: v })}
							min={-1}
							max={40}
							step={2}
						/>
					</PanelBody>

					{/* ボタンスタイル設定 */}
					<PanelBody title="色設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>余白 PC (px)</Heading>
						<RangeControl
							label="上"
							value={button6PaddingTopPc}
							onChange={(v) => setAttributes({ button6PaddingTopPc: v })}
							min={0}
							max={40}
							step={2}
						/>
						<RangeControl
							label="右"
							value={button6PaddingRightPc}
							onChange={(v) => setAttributes({ button6PaddingRightPc: v })}
							min={0}
							max={40}
							step={2}
						/>
						<RangeControl
							label="下"
							value={button6PaddingBottomPc}
							onChange={(v) => setAttributes({ button6PaddingBottomPc: v })}
							min={0}
							max={40}
							step={2}
						/>
						<RangeControl
							label="左"
							value={button6PaddingLeftPc}
							onChange={(v) => setAttributes({ button6PaddingLeftPc: v })}
							min={0}
							max={40}
							step={2}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>余白 SP (-1でPC継承)</Heading>
						<RangeControl
							label="上"
							value={button6PaddingTopSp}
							onChange={(v) => setAttributes({ button6PaddingTopSp: v })}
							min={-1}
							max={40}
							step={2}
						/>
						<RangeControl
							label="右"
							value={button6PaddingRightSp}
							onChange={(v) => setAttributes({ button6PaddingRightSp: v })}
							min={-1}
							max={40}
							step={2}
						/>
						<RangeControl
							label="下"
							value={button6PaddingBottomSp}
							onChange={(v) => setAttributes({ button6PaddingBottomSp: v })}
							min={-1}
							max={40}
							step={2}
						/>
						<RangeControl
							label="左"
							value={button6PaddingLeftSp}
							onChange={(v) => setAttributes({ button6PaddingLeftSp: v })}
							min={-1}
							max={40}
							step={2}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>最小高さ (px)</Heading>
						<RangeControl
							label="PC"
							value={button6MinHeightPc}
							onChange={(v) => setAttributes({ button6MinHeightPc: v })}
							min={32}
							max={120}
							step={2}
						/>
						<RangeControl
							label="SP"
							value={button6MinHeightSp}
							onChange={(v) => setAttributes({ button6MinHeightSp: v })}
							min={32}
							max={120}
							step={2}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>配置</Heading>
						<SelectControl
							label="PC"
							value={button6PositionPc}
							options={positionOptions}
							onChange={(v) => setAttributes({ button6PositionPc: v })}
						/>
						<SelectControl
							label="SP（空でPC継承）"
							value={button6PositionSp}
							options={[
								{ label: "PC継承", value: "" },
								...positionOptions,
							]}
							onChange={(v) => setAttributes({ button6PositionSp: v })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>フォントサイズ (px)</Heading>
						<RangeControl
							label="PC"
							value={button6FontSizePc}
							onChange={(v) => setAttributes({ button6FontSizePc: v })}
							min={10}
							max={32}
							step={1}
						/>
						<RangeControl
							label="SP"
							value={button6FontSizeSp}
							onChange={(v) => setAttributes({ button6FontSizeSp: v })}
							min={10}
							max={32}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー幅 (px)</Heading>
						<RangeControl
							label="PC"
							value={button6BorderWidthPc}
							onChange={(v) => setAttributes({ button6BorderWidthPc: v })}
							min={0}
							max={10}
							step={1}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={button6BorderWidthSp}
							onChange={(v) => setAttributes({ button6BorderWidthSp: v })}
							min={-1}
							max={10}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダースタイル</Heading>
						<SelectControl
							value={button6BorderStyle}
							options={[
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "double", value: "double" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ button6BorderStyle: v })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー色</Heading>
						<ColorPalette
							value={button6BorderColor}
							onChange={(color) => setAttributes({ button6BorderColor: color || "#000000" })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>テキスト色</Heading>
						<ColorPalette
							value={button6TextColor}
							onChange={(color) => setAttributes({ button6TextColor: color || "#000000" })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>背景色</Heading>
						<ColorPalette
							value={button6BgColor}
							onChange={(color) => setAttributes({ button6BgColor: color || "#ffffff" })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>角丸 (px)</Heading>
						<RangeControl
							label="PC"
							value={button6BorderRadiusPc}
							onChange={(v) => setAttributes({ button6BorderRadiusPc: v })}
							min={0}
							max={50}
							step={1}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={button6BorderRadiusSp}
							onChange={(v) => setAttributes({ button6BorderRadiusSp: v })}
							min={-1}
							max={50}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<ToggleControl
							label="矢印アイコンを表示"
							checked={button6ShowArrow}
							onChange={(v) => setAttributes({ button6ShowArrow: v })}
						/>
						{button6ShowArrow && (
							<>
								<Heading level={4} style={{ marginTop: "12px", marginBottom: "8px" }}>アイコン色</Heading>
								<ColorPalette
									value={button6ArrowColor}
									onChange={(color) => setAttributes({ button6ArrowColor: color || "var(--color-main)" })}
								/>
							</>
						)}
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>テキスト配置</Heading>
						<SelectControl
							value={button6TextAlign}
							options={[
								{ label: "左寄せ", value: "left" },
								{ label: "中央", value: "center" },
								{ label: "右寄せ", value: "right" },
							]}
							onChange={(v) => setAttributes({ button6TextAlign: v })}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="lw-pr-button-6__wrap" style={wrapStyle}>
						{button6Buttons.map((button, index) => (
							<div key={index} className="lw-pr-button-6__item">
								<RichText
									tagName="div"
									className="lw-pr-button-6__item_text"
									value={button.text}
									onChange={(v) => updateButton(index, "text", v)}
									placeholder="リンクテキスト"
									data-lw_font_set={button6FontSet}
									style={{ fontWeight: button6FontWeight }}
								/>
								{button6ShowArrow && (
									<span className="icon" style={{ fill: button6ArrowColor }} dangerouslySetInnerHTML={{ __html: ARROW_SVG }} />
								)}
							</div>
						))}
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			button6Buttons,
			button6MaxWidthPc,
			button6MaxWidthSp,
			button6ColumnsPc,
			button6ColumnsSp,
			button6RowGapPc,
			button6RowGapSp,
			button6ColumnGapPc,
			button6ColumnGapSp,
			button6PaddingTopPc,
			button6PaddingRightPc,
			button6PaddingBottomPc,
			button6PaddingLeftPc,
			button6PaddingTopSp,
			button6PaddingRightSp,
			button6PaddingBottomSp,
			button6PaddingLeftSp,
			button6MinHeightPc,
			button6MinHeightSp,
			button6PositionPc,
			button6PositionSp,
			button6FontSizePc,
			button6FontSizeSp,
			button6BorderWidthPc,
			button6BorderWidthSp,
			button6BorderStyle,
			button6BorderColor,
			button6TextColor,
			button6BorderRadiusPc,
			button6BorderRadiusSp,
			button6BgColor,
			button6FontSet,
			button6FontWeight,
			button6ShowArrow,
			button6TextAlign,
			button6ArrowColor,
		} = attributes;

		/* padding値を生成 */
		const paddingPcVal = `${button6PaddingTopPc}px ${button6PaddingRightPc}px ${button6PaddingBottomPc}px ${button6PaddingLeftPc}px`;
		const paddingSpVal = `${button6PaddingTopSp >= 0 ? button6PaddingTopSp : button6PaddingTopPc}px ${button6PaddingRightSp >= 0 ? button6PaddingRightSp : button6PaddingRightPc}px ${button6PaddingBottomSp >= 0 ? button6PaddingBottomSp : button6PaddingBottomPc}px ${button6PaddingLeftSp >= 0 ? button6PaddingLeftSp : button6PaddingLeftPc}px`;

		const blockProps = useBlockProps.save({
			className: "lw-pr-button-6",
		});

		const wrapStyle = {
			"--button-6-max-width-pc": `${button6MaxWidthPc}px`,
			"--button-6-max-width-sp": button6MaxWidthSp >= 0 ? `${button6MaxWidthSp}px` : `${button6MaxWidthPc}px`,
			"--button-6-gtc-pc": button6ColumnsPc,
			"--button-6-gtc-sp": button6ColumnsSp,
			"--button-6-row-gap-pc": `${button6RowGapPc}px`,
			"--button-6-row-gap-sp": button6RowGapSp >= 0 ? `${button6RowGapSp}px` : `${button6RowGapPc}px`,
			"--button-6-column-gap-pc": `${button6ColumnGapPc}px`,
			"--button-6-column-gap-sp": button6ColumnGapSp >= 0 ? `${button6ColumnGapSp}px` : `${button6ColumnGapPc}px`,
			"--button-6-item-padding-pc": paddingPcVal,
			"--button-6-item-padding-sp": paddingSpVal,
			"--button-6-item-min-height-pc": `${button6MinHeightPc}px`,
			"--button-6-item-min-height-sp": `${button6MinHeightSp}px`,
			"--button-6-item-position-pc": button6PositionPc,
			"--button-6-item-position-sp": button6PositionSp || button6PositionPc,
			"--button-6-item-fontsize-pc": `${button6FontSizePc}px`,
			"--button-6-item-fontsize-sp": `${button6FontSizeSp}px`,
			"--button-6-item-bd-width-pc": `${button6BorderWidthPc}px`,
			"--button-6-item-bd-width-sp": button6BorderWidthSp >= 0 ? `${button6BorderWidthSp}px` : `${button6BorderWidthPc}px`,
			"--button-6-item-border-style": button6BorderStyle,
			"--button-6-item-border-color": button6BorderColor,
			"--button-6-item-text-color": button6TextColor,
			"--button-6-item-border-radius-pc": `${button6BorderRadiusPc}px`,
			"--button-6-item-border-radius-sp": button6BorderRadiusSp >= 0 ? `${button6BorderRadiusSp}px` : `${button6BorderRadiusPc}px`,
			"--button-6-item-bg-color": button6BgColor,
			"--button-6-item-text-align": button6TextAlign,
		};

		return (
			<div {...blockProps}>
				<div className="lw-pr-button-6__wrap" style={wrapStyle}>
					{button6Buttons.map((button, index) => {
						/* リンク種別が url（＝既存のボタン全部）のときは data 属性が undefined になり、
						   React が出力しないので、保存されるHTMLは従来と完全に同じになる */
						const lp = lwLinkProps(button);
						return (
						<a
							key={index}
							href={lp.href}
							className="lw-pr-button-6__item"
							target={button.isBlank ? "_blank" : undefined}
							rel={button.isBlank ? "noopener noreferrer" : undefined}
							data-lw-link-type={lp.linkType}
							data-lw-link-id={lp.linkId}
						>
							<RichText.Content
								tagName="div"
								className="lw-pr-button-6__item_text"
								value={button.text}
								data-lw_font_set={button6FontSet}
								style={{ fontWeight: button6FontWeight }}
							/>
							{button6ShowArrow && (
								<span className="icon" style={{ fill: button6ArrowColor }}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/></svg>
								</span>
							)}
						</a>
						);
					})}
				</div>
			</div>
		);
	},
});
