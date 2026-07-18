/**
 * LiteWord – コメント 02
 * ------------------------------------------------------------
 *  • ブロック名 : wdl/lw-pr-comment-2
 *  • 吹き出しスタイルのコメントブロック
 * ----------------------------------------------------------- */
import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	useBlockProps,
	ColorPalette,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	Button,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import metadata from "./block.json";
import { fontOptionsArr, fontWeightOptionsArr } from "../utils.js";

/* フォントオプション */
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* 画像位置オプション */
const positionOptions = [
	{ label: "左", value: "left" },
	{ label: "右", value: "right" },
];

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			comment2MaxWidth,
			comment2ImagePosition,
			comment2ImageUrl,
			comment2ImageId,
			comment2ImageAlt,
			comment2ImageWidthPc,
			comment2ImageWidthSp,
			comment2ImageBdWidthPc,
			comment2ImageBdWidthSp,
			comment2ImageBdColorPc,
			comment2ImageBdColorSp,
			comment2ImageBg,
			comment2Text,
			comment2TextColor,
			comment2TextBg,
			comment2TextMtPc,
			comment2TextMtSp,
			comment2TextFontsizePc,
			comment2TextFontsizeSp,
			comment2TextBdrPc,
			comment2TextBdrSp,
			comment2TriangleTop,
			comment2FontSet,
			comment2FontWeight,
		} = attributes;

		const blockProps = useBlockProps({
			className: "lw-pr-comment-2",
		});

		const wrapStyle = {
			"--comment-2-max-width": `${comment2MaxWidth}px`,
			"--comment-2-image-width-pc": `${comment2ImageWidthPc}px`,
			"--comment-2-image-width-sp": `${comment2ImageWidthSp}px`,
			"--comment-2-image-bd-width-pc": `${comment2ImageBdWidthPc}px`,
			"--comment-2-image-bd-width-sp": comment2ImageBdWidthSp >= 0 ? `${comment2ImageBdWidthSp}px` : `${comment2ImageBdWidthPc}px`,
			"--comment-2-image-bd-color-pc": comment2ImageBdColorPc,
			"--comment-2-image-bd-color-sp": comment2ImageBdColorSp || comment2ImageBdColorPc,
			"--comment-2-image-bg": comment2ImageBg,
			"--comment-2-text-color": comment2TextColor,
			"--comment-2-text-bg": comment2TextBg,
			"--comment-2-text-mt-pc": `${comment2TextMtPc}px`,
			"--comment-2-text-mt-sp": `${comment2TextMtSp}px`,
			"--comment-2-text-fontsize-pc": `${comment2TextFontsizePc}px`,
			"--comment-2-text-fontsize-sp": `${comment2TextFontsizeSp}px`,
			"--comment-2-text-bdr-pc": `${comment2TextBdrPc}px`,
			"--comment-2-text-bdr-sp": `${comment2TextBdrSp}px`,
			"--comment-2-triangle-top": `${comment2TriangleTop}%`,
		};

		const wrapClassName = `lw-pr-comment-2__wrap${comment2ImagePosition === "right" ? " image_right" : ""}`;

		return (
			<>
				<InspectorControls>
					{/* 画像設定 */}
					<PanelBody title="画像設定" initialOpen={true}>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										comment2ImageUrl: media.url,
										comment2ImageId: media.id,
										comment2ImageAlt: media.alt || "",
									});
								}}
								allowedTypes={["image"]}
								value={comment2ImageId}
								render={({ open }) => (
									<div style={{ marginBottom: "16px" }}>
										{comment2ImageUrl ? (
											<div>
												<img
													src={comment2ImageUrl}
													alt={comment2ImageAlt}
													style={{ width: "100%", marginBottom: "8px", borderRadius: "4px" }}
												/>
												<div style={{ display: "flex", gap: "8px" }}>
													<Button variant="secondary" onClick={open}>
														画像を変更
													</Button>
													<Button
														variant="tertiary"
														isDestructive
														onClick={() => {
															setAttributes({
																comment2ImageUrl: "",
																comment2ImageId: 0,
																comment2ImageAlt: "",
															});
														}}
													>
														削除
													</Button>
												</div>
											</div>
										) : (
											<Button variant="secondary" onClick={open}>
												画像を選択
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
						<SelectControl
							label="画像の位置"
							value={comment2ImagePosition}
							options={positionOptions}
							onChange={(v) => setAttributes({ comment2ImagePosition: v })}
						/>
					</PanelBody>

					{/* 画像詳細設定 */}
					<PanelBody title="画像詳細設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>画像サイズ (px)</Heading>
						<RangeControl
							label="PC"
							value={comment2ImageWidthPc}
							onChange={(v) => setAttributes({ comment2ImageWidthPc: v })}
							min={40}
							max={300}
							step={4}
						/>
						<RangeControl
							label="SP"
							value={comment2ImageWidthSp}
							onChange={(v) => setAttributes({ comment2ImageWidthSp: v })}
							min={40}
							max={200}
							step={4}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー幅 (px)</Heading>
						<RangeControl
							label="PC"
							value={comment2ImageBdWidthPc}
							onChange={(v) => setAttributes({ comment2ImageBdWidthPc: v })}
							min={0}
							max={10}
							step={1}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={comment2ImageBdWidthSp}
							onChange={(v) => setAttributes({ comment2ImageBdWidthSp: v })}
							min={-1}
							max={10}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー色 PC</Heading>
						<ColorPalette
							value={comment2ImageBdColorPc}
							onChange={(color) => setAttributes({ comment2ImageBdColorPc: color || "#3C7FC3" })}
						/>
						<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー色 SP（空でPC継承）</Heading>
						<ColorPalette
							value={comment2ImageBdColorSp}
							onChange={(color) => setAttributes({ comment2ImageBdColorSp: color || "" })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>背景色</Heading>
						<ColorPalette
							value={comment2ImageBg}
							onChange={(color) => setAttributes({ comment2ImageBg: color || "#ffffff" })}
						/>
					</PanelBody>

					{/* テキスト設定 */}
					<PanelBody title="テキスト設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>文字色</Heading>
						<ColorPalette
							value={comment2TextColor}
							onChange={(color) => setAttributes({ comment2TextColor: color || "#3C7FC3" })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>背景色</Heading>
						<ColorPalette
							value={comment2TextBg}
							onChange={(color) => setAttributes({ comment2TextBg: color || "#F0FCFF" })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>上マージン (px)</Heading>
						<RangeControl
							label="PC"
							value={comment2TextMtPc}
							onChange={(v) => setAttributes({ comment2TextMtPc: v })}
							min={0}
							max={60}
							step={2}
						/>
						<RangeControl
							label="SP"
							value={comment2TextMtSp}
							onChange={(v) => setAttributes({ comment2TextMtSp: v })}
							min={0}
							max={60}
							step={2}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>フォントサイズ (px)</Heading>
						<RangeControl
							label="PC"
							value={comment2TextFontsizePc}
							onChange={(v) => setAttributes({ comment2TextFontsizePc: v })}
							min={10}
							max={32}
							step={1}
						/>
						<RangeControl
							label="SP"
							value={comment2TextFontsizeSp}
							onChange={(v) => setAttributes({ comment2TextFontsizeSp: v })}
							min={10}
							max={32}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>角丸 (px)</Heading>
						<RangeControl
							label="PC"
							value={comment2TextBdrPc}
							onChange={(v) => setAttributes({ comment2TextBdrPc: v })}
							min={0}
							max={40}
							step={2}
						/>
						<RangeControl
							label="SP"
							value={comment2TextBdrSp}
							onChange={(v) => setAttributes({ comment2TextBdrSp: v })}
							min={0}
							max={40}
							step={2}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>吹き出し三角の位置 (%)</Heading>
						<RangeControl
							label="上からの位置"
							value={comment2TriangleTop}
							onChange={(v) => setAttributes({ comment2TriangleTop: v })}
							min={0}
							max={100}
							step={1}
						/>
					</PanelBody>

					{/* フォント設定 */}
					<PanelBody title="フォント設定" initialOpen={false}>
						<SelectControl
							label="フォントの種類"
							value={comment2FontSet}
							options={fontOptions}
							onChange={(v) => setAttributes({ comment2FontSet: v })}
						/>
						<SelectControl
							label="フォントの太さ"
							value={comment2FontWeight}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ comment2FontWeight: v })}
						/>
					</PanelBody>

					{/* レイアウト設定 */}
					<PanelBody title="レイアウト設定" initialOpen={false}>
						<RangeControl
							label="最大幅 PC (px)"
							value={comment2MaxWidth}
							onChange={(v) => setAttributes({ comment2MaxWidth: v })}
							min={300}
							max={1200}
							step={10}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className={wrapClassName} style={wrapStyle}>
						<div className="lw-pr-comment-2__image">
							{comment2ImageUrl ? (
								<img src={comment2ImageUrl} alt={comment2ImageAlt} />
							) : (
								<div className="lw-pr-comment-2__image_placeholder">
									<span>画像</span>
								</div>
							)}
						</div>
						<div className="lw-pr-comment-2__text">
							<RichText
								tagName="p"
								value={comment2Text}
								onChange={(v) => setAttributes({ comment2Text: v })}
								placeholder="テキストを入力..."
								data-lw_font_set={comment2FontSet}
								style={{ fontWeight: comment2FontWeight }}
							/>
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			comment2MaxWidth,
			comment2ImagePosition,
			comment2ImageUrl,
			comment2ImageAlt,
			comment2ImageWidthPc,
			comment2ImageWidthSp,
			comment2ImageBdWidthPc,
			comment2ImageBdWidthSp,
			comment2ImageBdColorPc,
			comment2ImageBdColorSp,
			comment2ImageBg,
			comment2Text,
			comment2TextColor,
			comment2TextBg,
			comment2TextMtPc,
			comment2TextMtSp,
			comment2TextFontsizePc,
			comment2TextFontsizeSp,
			comment2TextBdrPc,
			comment2TextBdrSp,
			comment2TriangleTop,
			comment2FontSet,
			comment2FontWeight,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: "lw-pr-comment-2",
		});

		const wrapStyle = {
			"--comment-2-max-width": `${comment2MaxWidth}px`,
			"--comment-2-image-width-pc": `${comment2ImageWidthPc}px`,
			"--comment-2-image-width-sp": `${comment2ImageWidthSp}px`,
			"--comment-2-image-bd-width-pc": `${comment2ImageBdWidthPc}px`,
			"--comment-2-image-bd-width-sp": comment2ImageBdWidthSp >= 0 ? `${comment2ImageBdWidthSp}px` : `${comment2ImageBdWidthPc}px`,
			"--comment-2-image-bd-color-pc": comment2ImageBdColorPc,
			"--comment-2-image-bd-color-sp": comment2ImageBdColorSp || comment2ImageBdColorPc,
			"--comment-2-image-bg": comment2ImageBg,
			"--comment-2-text-color": comment2TextColor,
			"--comment-2-text-bg": comment2TextBg,
			"--comment-2-text-mt-pc": `${comment2TextMtPc}px`,
			"--comment-2-text-mt-sp": `${comment2TextMtSp}px`,
			"--comment-2-text-fontsize-pc": `${comment2TextFontsizePc}px`,
			"--comment-2-text-fontsize-sp": `${comment2TextFontsizeSp}px`,
			"--comment-2-text-bdr-pc": `${comment2TextBdrPc}px`,
			"--comment-2-text-bdr-sp": `${comment2TextBdrSp}px`,
			"--comment-2-triangle-top": `${comment2TriangleTop}%`,
		};

		const wrapClassName = `lw-pr-comment-2__wrap${comment2ImagePosition === "right" ? " image_right" : ""}`;

		return (
			<div {...blockProps}>
				<div className={wrapClassName} style={wrapStyle}>
					<div className="lw-pr-comment-2__image">
						{comment2ImageUrl && <img src={comment2ImageUrl} alt={comment2ImageAlt} />}
					</div>
					<div className="lw-pr-comment-2__text">
						<RichText.Content
							tagName="p"
							value={comment2Text}
							data-lw_font_set={comment2FontSet}
							style={{ fontWeight: comment2FontWeight }}
						/>
					</div>
				</div>
			</div>
		);
	},
});
