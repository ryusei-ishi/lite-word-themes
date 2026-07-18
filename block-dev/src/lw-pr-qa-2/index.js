/**
 * LiteWord - Q&A 02
 * ------------------------------------------------------------
 *  - 親ブロック: wdl/lw-pr-qa-2
 *  - 子ブロック: wdl/lw-pr-qa-2-item
 * ----------------------------------------------------------- */
import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	ColorPalette,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	Button,
	ToggleControl,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import metadata from "./block.json";

// 子ブロックのみ許可
const ALLOWED_BLOCKS = ["wdl/lw-pr-qa-2-item"];

// 初期テンプレート（1つのQ&Aアイテム）
const TEMPLATE = [["wdl/lw-pr-qa-2-item", {}]];

// 回答エリアのテンプレート（段落ブロック）
const ANSWER_TEMPLATE = [["core/paragraph", {}]];

// デフォルト画像
const DEFAULT_Q_IMAGE = "https://placehold.jp/3c7fc3/ffffff/200x200.png?text=No Image";
const DEFAULT_A_IMAGE = "https://placehold.jp/f59e0b/ffffff/200x200.png?text=No Image";

/* =========================================
   子ブロック: Q&A Item
========================================= */
registerBlockType("wdl/lw-pr-qa-2-item", {
	title: "Q&A 02 Item",
	category: "lw-qa",
	icon: "format-chat",
	description: "Q&A 02のアイテムブロック",
	parent: ["wdl/lw-pr-qa-2"],
	supports: {
		anchor: true,
		className: true,
	},
	attributes: {
		qImage: {
			type: "string",
			default: DEFAULT_Q_IMAGE,
		},
		qText: {
			type: "string",
			default: "ここに質問を入力してください",
		},
		aImage: {
			type: "string",
			default: DEFAULT_A_IMAGE,
		},
		useOneColumn: {
			type: "boolean",
			default: false,
		},
	},

	edit: ({ attributes, setAttributes }) => {
		const { qImage, qText, aImage, useOneColumn } = attributes;

		const blockProps = useBlockProps({
			className: "lw-pr-qa-2__wrap__inner",
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="Q&A アイテム設定" initialOpen={true}>
						<Heading level={4} style={{ marginBottom: "8px" }}>
							質問側の画像
						</Heading>
						{qImage && (
							<div style={{ marginBottom: "10px" }}>
								<img
									src={qImage}
									alt="質問画像"
									style={{
										width: "100px",
										height: "100px",
										objectFit: "cover",
										borderRadius: "50%",
										border: "1px solid #ccc",
									}}
								/>
							</div>
						)}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => setAttributes({ qImage: media.url })}
								allowedTypes={["image"]}
								render={({ open }) => (
									<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
										<Button variant="secondary" onClick={open}>
											画像を選択
										</Button>
										{qImage && qImage !== DEFAULT_Q_IMAGE && (
											<Button
												variant="secondary"
												onClick={() => setAttributes({ qImage: DEFAULT_Q_IMAGE })}
											>
												リセット
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>

						<hr style={{ margin: "16px 0" }} />

						<Heading level={4} style={{ marginBottom: "8px" }}>
							回答側の画像
						</Heading>
						{aImage && (
							<div style={{ marginBottom: "10px" }}>
								<img
									src={aImage}
									alt="回答画像"
									style={{
										width: "100px",
										height: "100px",
										objectFit: "cover",
										borderRadius: "50%",
										border: "1px solid #ccc",
									}}
								/>
							</div>
						)}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => setAttributes({ aImage: media.url })}
								allowedTypes={["image"]}
								render={({ open }) => (
									<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
										<Button variant="secondary" onClick={open}>
											画像を選択
										</Button>
										{aImage && aImage !== DEFAULT_A_IMAGE && (
											<Button
												variant="secondary"
												onClick={() => setAttributes({ aImage: DEFAULT_A_IMAGE })}
											>
												リセット
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>

						<hr style={{ margin: "16px 0" }} />

						<ToggleControl
							label="回答を1カラムにする"
							checked={useOneColumn}
							onChange={(value) => setAttributes({ useOneColumn: value })}
							help="ONにすると回答エリアが1カラムになります"
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="lw-pr-qa-2__q_wrap">
						<div className="lw-pr-qa-2__q_image">
							<img src={qImage} alt="" />
						</div>
						<div className="lw-pr-qa-2__q_text">
							<RichText
								tagName="p"
								className="text"
								value={qText}
								onChange={(value) => setAttributes({ qText: value })}
								placeholder="質問を入力..."
							/>
						</div>
					</div>
					<div className={`lw-pr-qa-2__a_wrap${useOneColumn ? " clm_1" : ""}`}>
						<div className="lw-pr-qa-2__a_text">
							<InnerBlocks
								template={ANSWER_TEMPLATE}
								renderAppender={InnerBlocks.ButtonBlockAppender}
							/>
						</div>
						<div className="lw-pr-qa-2__a_image">
							<img src={aImage} alt="" />
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { qImage, qText, aImage, useOneColumn } = attributes;

		const blockProps = useBlockProps.save({
			className: "lw-pr-qa-2__wrap__inner",
		});

		return (
			<div {...blockProps}>
				<dt className="lw-pr-qa-2__q_wrap">
					<div className="lw-pr-qa-2__q_image">
						<img src={qImage} alt="" />
					</div>
					<div className="lw-pr-qa-2__q_text">
						<RichText.Content tagName="p" className="text" value={qText} />
					</div>
				</dt>
				<dd className={`lw-pr-qa-2__a_wrap${useOneColumn ? " clm_1" : ""}`}>
					<div className="lw-pr-qa-2__a_text">
						<InnerBlocks.Content />
					</div>
					<div className="lw-pr-qa-2__a_image">
						<img src={aImage} alt="" />
					</div>
				</dd>
			</div>
		);
	},
});

/* =========================================
   親ブロック: Q&A 02
========================================= */
registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			maxWidth,
			qImageBorderColor,
			qTextBg,
			qTextFontSizePc,
			qTextFontSizeSp,
			aImageBorderColor,
		} = attributes;

		const blockProps = useBlockProps({
			className: "lw-pr-qa-2",
			style: {
				"--qa-2-max-w": maxWidth === 0 ? "100%" : `${maxWidth}px`,
				"--qa-2-dt-image-bd-color": qImageBorderColor,
				"--qa-2-dt-text-bg": qTextBg,
				"--qa-2-dt-text-fontsize-pc": `${qTextFontSizePc}px`,
				"--qa-2-dt-text-fontsize-sp": `${qTextFontSizeSp}px`,
				"--qa-2-dd-image-bd-color": aImageBorderColor,
			},
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<RangeControl
							label="最大幅 (px)"
							value={maxWidth}
							onChange={(value) => setAttributes({ maxWidth: value })}
							min={0}
							max={1300}
							step={10}
							help="0で100%（未設定）、800〜1300pxで指定"
							marks={[
								{ value: 0, label: "未設定" },
								{ value: 800, label: "800" },
								{ value: 1300, label: "1300" },
							]}
						/>
					</PanelBody>

					<PanelBody title="質問側の設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>
							画像ボーダー色
						</Heading>
						<ColorPalette
							value={qImageBorderColor}
							onChange={(color) =>
								setAttributes({ qImageBorderColor: color || "#3c7fc3" })
							}
						/>

						<hr style={{ margin: "16px 0" }} />

						<Heading level={4} style={{ marginBottom: "8px" }}>
							テキスト背景色
						</Heading>
						<ColorPalette
							value={qTextBg}
							onChange={(color) => setAttributes({ qTextBg: color || "#eaf4ff" })}
						/>

						<hr style={{ margin: "16px 0" }} />

						<Heading level={4} style={{ marginBottom: "8px" }}>
							テキストサイズ
						</Heading>
						<RangeControl
							label="PC (px)"
							value={qTextFontSizePc}
							onChange={(value) => setAttributes({ qTextFontSizePc: value })}
							min={14}
							max={40}
							step={1}
						/>
						<RangeControl
							label="SP (px)"
							value={qTextFontSizeSp}
							onChange={(value) => setAttributes({ qTextFontSizeSp: value })}
							min={12}
							max={24}
							step={1}
						/>
					</PanelBody>

					<PanelBody title="回答側の設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>
							画像ボーダー色
						</Heading>
						<ColorPalette
							value={aImageBorderColor}
							onChange={(color) =>
								setAttributes({ aImageBorderColor: color || "#3c7fc3" })
							}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="lw-pr-qa-2__wrap">
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
			maxWidth,
			qImageBorderColor,
			qTextBg,
			qTextFontSizePc,
			qTextFontSizeSp,
			aImageBorderColor,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: "lw-pr-qa-2",
			style: {
				"--qa-2-max-w": maxWidth === 0 ? "100%" : `${maxWidth}px`,
				"--qa-2-dt-image-bd-color": qImageBorderColor,
				"--qa-2-dt-text-bg": qTextBg,
				"--qa-2-dt-text-fontsize-pc": `${qTextFontSizePc}px`,
				"--qa-2-dt-text-fontsize-sp": `${qTextFontSizeSp}px`,
				"--qa-2-dd-image-bd-color": aImageBorderColor,
			},
		});

		return (
			<div {...blockProps}>
				<dl className="lw-pr-qa-2__wrap">
					<InnerBlocks.Content />
				</dl>
			</div>
		);
	},
});
