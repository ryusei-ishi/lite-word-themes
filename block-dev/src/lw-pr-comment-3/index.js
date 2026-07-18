/**
 * LiteWord – コメント 03
 * ------------------------------------------------------------
 *  • ブロック名 : wdl/lw-pr-comment-3
 *  • 吹き出しスタイルのコメントブロック（InnerBlocks対応）
 * ----------------------------------------------------------- */
import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	useBlockProps,
	ColorPalette,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import metadata from "./block.json";

/* InnerBlocks で許可するブロック */
const ALLOWED_BLOCKS = ["core/paragraph", "core/heading", "wdl/lw-space-1"];

/* InnerBlocks のデフォルトテンプレート */
const TEMPLATE = [["core/paragraph", { content: "ここにコメントテキストを挿入できます。吹き出しの中にお好みの文章を入力して、自由にカスタマイズしてください。" }]];

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			comment3ImageWidthPc,
			comment3ImageWidthSp,
			comment3TextBdColorPc,
			comment3TextInnerBg,
			comment3ImageUrl,
			comment3ImageId,
			comment3ImageAlt,
			comment3TextDfPc,
			comment3TextDfSp,
			comment3SpClm,
			comment3BdOutside,
			comment3BdColor,
			comment3Bg,
			comment3AlignItems,
			comment3MaxWidth,
			comment3TextInnerGapPc,
			comment3TextInnerGapSp,
		} = attributes;

		const blockProps = useBlockProps({
			className: `lw-pr-comment-3${comment3BdOutside ? " bd_outside" : ""}`,
			style: {
				"--comment-3-bd-color": comment3BdColor,
				"--comment-3-bg": comment3Bg,
				"--comment-3-max-width": `${comment3MaxWidth}px`,
			},
		});

		const wrapStyle = {
			"--comment-3-image-width-pc": `${comment3ImageWidthPc}px`,
			"--comment-3-image-width-sp": `${comment3ImageWidthSp}px`,
			"--comment-3-text-bd-color-pc": comment3TextBdColorPc,
			"--comment-3-text-inner-bg": comment3TextInnerBg,
			"--comment-3-text-df-pc": `${comment3TextDfPc}px`,
			"--comment-3-text-df-sp": `${comment3TextDfSp}px`,
			"--comment-3-text-inner-gap-pc": `${comment3TextInnerGapPc}px`,
			"--comment-3-text-inner-gap-sp": `${comment3TextInnerGapSp}px`,
			...(comment3BdOutside && { "--comment-3-align-items": comment3AlignItems }),
		};

		const wrapClassName = `lw-pr-comment-3__wrap${comment3SpClm ? " sp_clm_1" : ""}`;

		return (
			<>
				<InspectorControls>
					{/* 画像設定 */}
					<PanelBody title="画像設定" initialOpen={true}>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										comment3ImageUrl: media.url,
										comment3ImageId: media.id,
										comment3ImageAlt: media.alt || "",
									});
								}}
								allowedTypes={["image"]}
								value={comment3ImageId}
								render={({ open }) => (
									<div style={{ marginBottom: "16px" }}>
										{comment3ImageUrl ? (
											<div>
												<img
													src={comment3ImageUrl}
													alt={comment3ImageAlt}
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
																comment3ImageUrl: "",
																comment3ImageId: 0,
																comment3ImageAlt: "",
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
						<RangeControl
							label="画像幅 PC (px)"
							value={comment3ImageWidthPc}
							onChange={(v) => setAttributes({ comment3ImageWidthPc: v })}
							min={80}
							max={400}
							step={4}
						/>
						<RangeControl
							label="画像幅 SP (px)"
							value={comment3ImageWidthSp}
							onChange={(v) => setAttributes({ comment3ImageWidthSp: v })}
							min={60}
							max={240}
							step={4}
						/>
					</PanelBody>

					{/* レイアウト設定 */}
					<PanelBody title="レイアウト設定" initialOpen={false}>
						<ToggleControl
							label="枠を外側にする"
							checked={comment3BdOutside}
							onChange={(v) => setAttributes({ comment3BdOutside: v })}
						/>
						{comment3BdOutside && (
							<SelectControl
								label="画像の垂直位置"
								value={comment3AlignItems}
								options={[
									{ label: "上揃え", value: "start" },
									{ label: "中央揃え", value: "center" },
									{ label: "下揃え", value: "end" },
								]}
								onChange={(v) => setAttributes({ comment3AlignItems: v })}
							/>
						)}
						<RangeControl
							label="最大幅 (px)"
							value={comment3MaxWidth}
							onChange={(v) => setAttributes({ comment3MaxWidth: v })}
							min={600}
							max={1200}
							step={10}
						/>
						<ToggleControl
							label="SP時に1カラム表示"
							checked={comment3SpClm}
							onChange={(v) => setAttributes({ comment3SpClm: v })}
						/>
					</PanelBody>

					{/* 外枠カラー設定（枠を外側にする ON時のみ） */}
					{comment3BdOutside && (
						<PanelBody title="外枠カラー設定" initialOpen={false}>
							<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー色</Heading>
							<ColorPalette
								value={comment3BdColor}
								onChange={(color) => setAttributes({ comment3BdColor: color || "#3C7FC3" })}
							/>
							<hr style={{ margin: "16px 0" }} />
							<Heading level={4} style={{ marginBottom: "8px" }}>背景色</Heading>
							<ColorPalette
								value={comment3Bg}
								onChange={(color) => setAttributes({ comment3Bg: color || "#ffffff" })}
							/>
						</PanelBody>
					)}

					{/* テキストエリア設定（枠を外側にする OFF時のみ） */}
					{!comment3BdOutside && (
						<PanelBody title="テキストエリア設定" initialOpen={false}>
							<Heading level={4} style={{ marginBottom: "8px" }}>ボーダー色</Heading>
							<ColorPalette
								value={comment3TextBdColorPc}
								onChange={(color) => setAttributes({ comment3TextBdColorPc: color || "#3C7FC3" })}
							/>
							<hr style={{ margin: "16px 0" }} />
							<Heading level={4} style={{ marginBottom: "8px" }}>背景色</Heading>
							<ColorPalette
								value={comment3TextInnerBg}
								onChange={(color) => setAttributes({ comment3TextInnerBg: color || "#e9f5ff" })}
							/>
						</PanelBody>
					)}

					{/* テキスト設定 */}
					<PanelBody title="テキスト設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>フォントサイズ</Heading>
						<RangeControl
							label="PC (px)"
							value={comment3TextDfPc}
							onChange={(v) => setAttributes({ comment3TextDfPc: v })}
							min={10}
							max={32}
							step={1}
						/>
						<RangeControl
							label="SP (px)"
							value={comment3TextDfSp}
							onChange={(v) => setAttributes({ comment3TextDfSp: v })}
							min={10}
							max={32}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>gap</Heading>
						<RangeControl
							label="PC (px)"
							value={comment3TextInnerGapPc}
							onChange={(v) => setAttributes({ comment3TextInnerGapPc: v })}
							min={0}
							max={32}
							step={1}
						/>
						<RangeControl
							label="SP (px)"
							value={comment3TextInnerGapSp}
							onChange={(v) => setAttributes({ comment3TextInnerGapSp: v })}
							min={0}
							max={32}
							step={1}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className={wrapClassName} style={wrapStyle}>
						<div className="lw-pr-comment-3__text">
							<div className="lw-pr-comment-3__text_inner">
								<InnerBlocks
									allowedBlocks={ALLOWED_BLOCKS}
									template={TEMPLATE}
									templateLock={false}
								/>
								<div className="lw-pr-comment-3__text_arrow"></div>
							</div>
						</div>
						<div className="lw-pr-comment-3__image">
							{comment3ImageUrl ? (
								<img src={comment3ImageUrl} alt={comment3ImageAlt} />
							) : (
								<div className="lw-pr-comment-3__image_placeholder">
									<span>画像</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			comment3ImageWidthPc,
			comment3ImageWidthSp,
			comment3TextBdColorPc,
			comment3TextInnerBg,
			comment3ImageUrl,
			comment3ImageAlt,
			comment3TextDfPc,
			comment3TextDfSp,
			comment3SpClm,
			comment3BdOutside,
			comment3BdColor,
			comment3Bg,
			comment3AlignItems,
			comment3MaxWidth,
			comment3TextInnerGapPc,
			comment3TextInnerGapSp,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `lw-pr-comment-3${comment3BdOutside ? " bd_outside" : ""}`,
			style: {
				"--comment-3-bd-color": comment3BdColor,
				"--comment-3-bg": comment3Bg,
				"--comment-3-max-width": `${comment3MaxWidth}px`,
			},
		});

		const wrapStyle = {
			"--comment-3-image-width-pc": `${comment3ImageWidthPc}px`,
			"--comment-3-image-width-sp": `${comment3ImageWidthSp}px`,
			"--comment-3-text-bd-color-pc": comment3TextBdColorPc,
			"--comment-3-text-inner-bg": comment3TextInnerBg,
			"--comment-3-text-df-pc": `${comment3TextDfPc}px`,
			"--comment-3-text-df-sp": `${comment3TextDfSp}px`,
			"--comment-3-text-inner-gap-pc": `${comment3TextInnerGapPc}px`,
			"--comment-3-text-inner-gap-sp": `${comment3TextInnerGapSp}px`,
			...(comment3BdOutside && { "--comment-3-align-items": comment3AlignItems }),
		};

		const wrapClassName = `lw-pr-comment-3__wrap${comment3SpClm ? " sp_clm_1" : ""}`;

		return (
			<div {...blockProps}>
				<div className={wrapClassName} style={wrapStyle}>
					<div className="lw-pr-comment-3__text">
						<div className="lw-pr-comment-3__text_inner">
							<InnerBlocks.Content />
							<div className="lw-pr-comment-3__text_arrow"></div>
						</div>
					</div>
					<div className="lw-pr-comment-3__image">
						{comment3ImageUrl && <img src={comment3ImageUrl} alt={comment3ImageAlt} />}
					</div>
				</div>
			</div>
		);
	},
});
