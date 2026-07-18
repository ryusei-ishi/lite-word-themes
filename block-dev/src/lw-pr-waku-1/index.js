/**
 * LiteWord – 枠 01
 * ------------------------------------------------------------
 *  • ブロック名 : wdl/lw-pr-waku-1
 *  • 枠ブロック（背景色・背景画像・ボーダー設定可能）
 * ----------------------------------------------------------- */
import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	ColorPalette,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	Button,
	TextControl,
	ToggleControl,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import metadata from "./block.json";

/* エフェクトオプション */
const effectOptions = [
	{ label: "なし", value: "none" },
	{ label: "グレースケール", value: "grayscale" },
	{ label: "セピア", value: "sepia" },
	{ label: "ぼかし", value: "blur" },
	{ label: "明るさ", value: "brightness" },
	{ label: "コントラスト", value: "contrast" },
	{ label: "彩度", value: "saturate" },
	{ label: "色相回転", value: "hue-rotate" },
	{ label: "反転", value: "invert" },
	{ label: "透明度", value: "opacity" },
];

/* ブレンドモードオプション */
const blendModeOptions = [
	{ label: "通常", value: "normal" },
	{ label: "乗算", value: "multiply" },
	{ label: "スクリーン", value: "screen" },
	{ label: "オーバーレイ", value: "overlay" },
	{ label: "暗く", value: "darken" },
	{ label: "明るく", value: "lighten" },
	{ label: "覆い焼きカラー", value: "color-dodge" },
	{ label: "焼き込みカラー", value: "color-burn" },
	{ label: "ハードライト", value: "hard-light" },
	{ label: "ソフトライト", value: "soft-light" },
	{ label: "差の絶対値", value: "difference" },
	{ label: "除外", value: "exclusion" },
	{ label: "色相", value: "hue" },
	{ label: "彩度", value: "saturation" },
	{ label: "カラー", value: "color" },
	{ label: "輝度", value: "luminosity" },
];

/* 背景タイプオプション */
const bgTypeOptions = [
	{ label: "単色", value: "color" },
	{ label: "グラデーション", value: "gradient" },
];

/* 旧バージョン（custom_wrap クラス）の保存関数を deprecated 用に抽出 */
const deprecatedSaveV1 = ({ attributes }) => {
	const {
		waku1JustifyContentPc,
		waku1JustifyContentSp,
		waku1MaxWidthPc,
		waku1MaxWidthSp,
		waku1PaddingTopPc,
		waku1PaddingRightPc,
		waku1PaddingBottomPc,
		waku1PaddingLeftPc,
		waku1PaddingTopSp,
		waku1PaddingRightSp,
		waku1PaddingBottomSp,
		waku1PaddingLeftSp,
		waku1BorderWidthPc,
		waku1BorderWidthSp,
		waku1BorderStylePc,
		waku1BorderStyleSp,
		waku1BorderColorPc,
		waku1BorderColorSp,
		waku1BorderRadiusPc,
		waku1BorderRadiusSp,
		waku1BgTypePc,
		waku1BgTypeSp,
		waku1BgColorPc,
		waku1BgColorSp,
		waku1BgGradientPc,
		waku1BgGradientSp,
		waku1BgOpacityPc,
		waku1BgOpacitySp,
		waku1BgBlendModePc,
		waku1BgBlendModeSp,
		waku1BgImagePc,
		waku1BgImageSp,
		waku1ImageEffect,
		waku1EffectGrayscale,
		waku1EffectSepia,
		waku1EffectBlur,
		waku1EffectBrightness,
		waku1EffectContrast,
		waku1EffectSaturate,
		waku1EffectInvert,
		waku1EffectHueRotate,
		waku1EffectOpacity,
		waku1MinHeightPc,
		waku1MinHeightSp,
		waku1AspectRatioPc,
		waku1AspectRatioSp,
	} = attributes;

	const hasAspectRatioPc = waku1AspectRatioPc > 0;
	const aspectRatioPcVal = hasAspectRatioPc ? `100 / ${waku1AspectRatioPc}` : "auto";
	const hasAspectRatioSp = waku1AspectRatioSp > 0;
	const aspectRatioSpVal = hasAspectRatioSp ? `100 / ${waku1AspectRatioSp}` : (hasAspectRatioPc ? aspectRatioPcVal : "auto");

	const getFilterStyle = (effect) => {
		switch (effect) {
			case "grayscale": return `grayscale(${waku1EffectGrayscale}%)`;
			case "sepia": return `sepia(${waku1EffectSepia}%)`;
			case "blur": return `blur(${waku1EffectBlur}px)`;
			case "brightness": return `brightness(${waku1EffectBrightness}%)`;
			case "contrast": return `contrast(${waku1EffectContrast}%)`;
			case "saturate": return `saturate(${waku1EffectSaturate}%)`;
			case "hue-rotate": return `hue-rotate(${waku1EffectHueRotate}deg)`;
			case "invert": return `invert(${waku1EffectInvert}%)`;
			case "opacity": return `opacity(${waku1EffectOpacity}%)`;
			default: return "none";
		}
	};

	const paddingPcVal = `${waku1PaddingTopPc}px ${waku1PaddingRightPc}px ${waku1PaddingBottomPc}px ${waku1PaddingLeftPc}px`;
	const paddingSpVal = `${waku1PaddingTopSp >= 0 ? waku1PaddingTopSp : waku1PaddingTopPc}px ${waku1PaddingRightSp >= 0 ? waku1PaddingRightSp : waku1PaddingRightPc}px ${waku1PaddingBottomSp >= 0 ? waku1PaddingBottomSp : waku1PaddingBottomPc}px ${waku1PaddingLeftSp >= 0 ? waku1PaddingLeftSp : waku1PaddingLeftPc}px`;

	const radiusPcArr = Array.isArray(waku1BorderRadiusPc) ? waku1BorderRadiusPc : [8, 8, 8, 8];
	const radiusSpArr = Array.isArray(waku1BorderRadiusSp) ? waku1BorderRadiusSp : [];

	const generateBorderRadiusValue = (arr) => {
		if (arr.length <= 4) {
			return arr.map((v) => `${v}px`).join(" ");
		} else {
			const horizontal = arr.slice(0, 4).map((v) => `${v}px`).join(" ");
			const vertical = arr.slice(4, 8).map((v) => `${v}px`).join(" ");
			return `${horizontal} / ${vertical}`;
		}
	};

	const borderRadiusPcVal = generateBorderRadiusValue(radiusPcArr);
	const borderRadiusSpVal = radiusSpArr.length > 0 ? generateBorderRadiusValue(radiusSpArr) : borderRadiusPcVal;

	const bgPcVal = waku1BgTypePc === "gradient" ? waku1BgGradientPc : waku1BgColorPc;
	const effectiveBgTypeSp = waku1BgTypeSp || waku1BgTypePc;
	const bgSpVal = effectiveBgTypeSp === "gradient"
		? (waku1BgGradientSp || waku1BgGradientPc)
		: (waku1BgColorSp || waku1BgColorPc);

	const blockProps = useBlockProps.save({
		className: "lw-pr-waku-1",
		style: {
			"--waku-1-justify-content-pc": waku1JustifyContentPc,
			"--waku-1-justify-content-sp": waku1JustifyContentSp || waku1JustifyContentPc,
		},
	});

	const wrapStyle = {
		"--waku-1-max-width-pc": `${waku1MaxWidthPc}px`,
		"--waku-1-max-width-sp": waku1MaxWidthSp >= 0 ? `${waku1MaxWidthSp}px` : `${waku1MaxWidthPc}px`,
		"--waku-1-padding-pc": paddingPcVal,
		"--waku-1-padding-sp": paddingSpVal,
		"--waku-1-bd-width-pc": `${waku1BorderWidthPc}px`,
		"--waku-1-bd-width-sp": waku1BorderWidthSp >= 0 ? `${waku1BorderWidthSp}px` : `${waku1BorderWidthPc}px`,
		"--waku-1-bd-style-pc": waku1BorderStylePc,
		"--waku-1-bd-style-sp": waku1BorderStyleSp || waku1BorderStylePc,
		"--waku-1-bd-color-pc": waku1BorderColorPc,
		"--waku-1-bd-color-sp": waku1BorderColorSp || waku1BorderColorPc,
		"--waku-1-bdr-pc": borderRadiusPcVal,
		"--waku-1-bdr-sp": borderRadiusSpVal,
		"--waku-1-bg-pc": bgPcVal,
		"--waku-1-bg-sp": bgSpVal,
		"--waku-1-bg-opacity-pc": waku1BgOpacityPc / 100,
		"--waku-1-bg-opacity-sp": waku1BgOpacitySp >= 0 ? waku1BgOpacitySp / 100 : waku1BgOpacityPc / 100,
		"--waku-1-blend-mode-pc": waku1BgBlendModePc,
		"--waku-1-blend-mode-sp": waku1BgBlendModeSp || waku1BgBlendModePc,
		"--waku-1-bg-img-pc": waku1BgImagePc ? `url(${waku1BgImagePc})` : "none",
		"--waku-1-bg-img-sp": waku1BgImageSp ? `url(${waku1BgImageSp})` : (waku1BgImagePc ? `url(${waku1BgImagePc})` : "none"),
		"--waku-1-img-filter-pc": getFilterStyle(waku1ImageEffect),
		"--waku-1-img-filter-sp": getFilterStyle(waku1ImageEffect),
		"--waku-1-min-height-pc": hasAspectRatioPc ? "auto" : (waku1MinHeightPc >= 0 ? `${waku1MinHeightPc}px` : "auto"),
		"--waku-1-min-height-sp": hasAspectRatioSp ? "auto" : (hasAspectRatioPc ? "auto" : (waku1MinHeightSp >= 0 ? `${waku1MinHeightSp}px` : (waku1MinHeightPc >= 0 ? `${waku1MinHeightPc}px` : "auto"))),
		"--waku-1-aspect-ratio-pc": aspectRatioPcVal,
		"--waku-1-aspect-ratio-sp": aspectRatioSpVal,
	};

	return (
		<div {...blockProps}>
			<div className="custom_wrap" style={wrapStyle}>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

registerBlockType(metadata.name, {
	deprecated: [
		{
			attributes: metadata.attributes,
			save: deprecatedSaveV1,
		},
	],

	edit: ({ attributes, setAttributes }) => {
		const {
			waku1JustifyContentPc,
			waku1JustifyContentSp,
			waku1MaxWidthPc,
			waku1MaxWidthSp,
			waku1PaddingTopPc,
			waku1PaddingRightPc,
			waku1PaddingBottomPc,
			waku1PaddingLeftPc,
			waku1PaddingTopSp,
			waku1PaddingRightSp,
			waku1PaddingBottomSp,
			waku1PaddingLeftSp,
			waku1BorderWidthPc,
			waku1BorderWidthSp,
			waku1BorderStylePc,
			waku1BorderStyleSp,
			waku1BorderColorPc,
			waku1BorderColorSp,
			waku1BorderRadiusPc,
			waku1BorderRadiusSp,
			waku1BgTypePc,
			waku1BgTypeSp,
			waku1BgColorPc,
			waku1BgColorSp,
			waku1BgGradientPc,
			waku1BgGradientSp,
			waku1BgOpacityPc,
			waku1BgOpacitySp,
			waku1BgBlendModePc,
			waku1BgBlendModeSp,
			waku1BgImagePc,
			waku1BgImageSp,
			waku1ImageEffect,
			waku1EffectGrayscale,
			waku1EffectSepia,
			waku1EffectBlur,
			waku1EffectBrightness,
			waku1EffectContrast,
			waku1EffectSaturate,
			waku1EffectInvert,
			waku1EffectHueRotate,
			waku1EffectOpacity,
			waku1MinHeightPc,
			waku1MinHeightSp,
			waku1AspectRatioPc,
			waku1AspectRatioSp,
			waku1LinkUrl,
			waku1LinkNewTab,
		} = attributes;

		// aspect-ratio値を生成（100 / X の形式、比率設定時はmin-heightをautoに）
		const hasAspectRatioPc = waku1AspectRatioPc > 0;
		const aspectRatioPcVal = hasAspectRatioPc ? `100 / ${waku1AspectRatioPc}` : "auto";
		const hasAspectRatioSp = waku1AspectRatioSp > 0;
		const aspectRatioSpVal = hasAspectRatioSp ? `100 / ${waku1AspectRatioSp}` : (hasAspectRatioPc ? aspectRatioPcVal : "auto");

		/* エフェクトをCSSフィルターに変換 */
		const getFilterStyle = (effect) => {
			switch (effect) {
				case "grayscale": return `grayscale(${waku1EffectGrayscale}%)`;
				case "sepia": return `sepia(${waku1EffectSepia}%)`;
				case "blur": return `blur(${waku1EffectBlur}px)`;
				case "brightness": return `brightness(${waku1EffectBrightness}%)`;
				case "contrast": return `contrast(${waku1EffectContrast}%)`;
				case "saturate": return `saturate(${waku1EffectSaturate}%)`;
				case "hue-rotate": return `hue-rotate(${waku1EffectHueRotate}deg)`;
				case "invert": return `invert(${waku1EffectInvert}%)`;
				case "opacity": return `opacity(${waku1EffectOpacity}%)`;
				default: return "none";
			}
		};

		// padding値を生成
		const paddingPcVal = `${waku1PaddingTopPc}px ${waku1PaddingRightPc}px ${waku1PaddingBottomPc}px ${waku1PaddingLeftPc}px`;
		const paddingSpVal = `${waku1PaddingTopSp >= 0 ? waku1PaddingTopSp : waku1PaddingTopPc}px ${waku1PaddingRightSp >= 0 ? waku1PaddingRightSp : waku1PaddingRightPc}px ${waku1PaddingBottomSp >= 0 ? waku1PaddingBottomSp : waku1PaddingBottomPc}px ${waku1PaddingLeftSp >= 0 ? waku1PaddingLeftSp : waku1PaddingLeftPc}px`;

		// border-radius値を生成（配列の安全性チェック）
		const radiusPcArr = Array.isArray(waku1BorderRadiusPc) ? waku1BorderRadiusPc : [8, 8, 8, 8];
		const radiusSpArr = Array.isArray(waku1BorderRadiusSp) ? waku1BorderRadiusSp : [];

		const generateBorderRadiusValue = (arr) => {
			if (arr.length <= 4) {
				return arr.map((v) => `${v}px`).join(" ");
			} else {
				const horizontal = arr.slice(0, 4).map((v) => `${v}px`).join(" ");
				const vertical = arr.slice(4, 8).map((v) => `${v}px`).join(" ");
				return `${horizontal} / ${vertical}`;
			}
		};

		const borderRadiusPcVal = generateBorderRadiusValue(radiusPcArr);
		const borderRadiusSpVal = radiusSpArr.length > 0
			? generateBorderRadiusValue(radiusSpArr)
			: borderRadiusPcVal;

		// border-radius更新ヘルパー
		const updateBorderRadiusPc = (index, value) => {
			const newRadii = [...radiusPcArr];
			newRadii[index] = value;
			setAttributes({ waku1BorderRadiusPc: newRadii });
		};

		const addVerticalRadiusPc = () => {
			if (radiusPcArr.length === 4) {
				setAttributes({ waku1BorderRadiusPc: [...radiusPcArr, 8, 8, 8, 8] });
			}
		};

		const removeVerticalRadiusPc = () => {
			if (radiusPcArr.length === 8) {
				setAttributes({ waku1BorderRadiusPc: radiusPcArr.slice(0, 4) });
			}
		};

		const updateBorderRadiusSp = (index, value) => {
			const newRadii = [...radiusSpArr];
			newRadii[index] = value;
			setAttributes({ waku1BorderRadiusSp: newRadii });
		};

		const addVerticalRadiusSp = () => {
			if (radiusSpArr.length === 4) {
				setAttributes({ waku1BorderRadiusSp: [...radiusSpArr, 8, 8, 8, 8] });
			} else if (radiusSpArr.length === 0) {
				setAttributes({ waku1BorderRadiusSp: [8, 8, 8, 8, 8, 8, 8, 8] });
			}
		};

		const removeVerticalRadiusSp = () => {
			if (radiusSpArr.length === 8) {
				setAttributes({ waku1BorderRadiusSp: radiusSpArr.slice(0, 4) });
			}
		};

		const initSpRadius = () => {
			setAttributes({ waku1BorderRadiusSp: [...radiusPcArr] });
		};

		// 背景値を生成（単色 or グラデーション）
		const bgPcVal = waku1BgTypePc === "gradient" ? waku1BgGradientPc : waku1BgColorPc;
		const effectiveBgTypeSp = waku1BgTypeSp || waku1BgTypePc;
		const bgSpVal = effectiveBgTypeSp === "gradient"
			? (waku1BgGradientSp || waku1BgGradientPc)
			: (waku1BgColorSp || waku1BgColorPc);

		const blockProps = useBlockProps({
			className: "lw-pr-waku-1",
			style: {
				"--waku-1-justify-content-pc": waku1JustifyContentPc,
				"--waku-1-justify-content-sp": waku1JustifyContentSp || waku1JustifyContentPc,
			},
		});

		const wrapStyle = {
			"--waku-1-max-width-pc": `${waku1MaxWidthPc}px`,
			"--waku-1-max-width-sp": waku1MaxWidthSp >= 0 ? `${waku1MaxWidthSp}px` : `${waku1MaxWidthPc}px`,
			"--waku-1-padding-pc": paddingPcVal,
			"--waku-1-padding-sp": paddingSpVal,
			"--waku-1-bd-width-pc": `${waku1BorderWidthPc}px`,
			"--waku-1-bd-width-sp": waku1BorderWidthSp >= 0 ? `${waku1BorderWidthSp}px` : `${waku1BorderWidthPc}px`,
			"--waku-1-bd-style-pc": waku1BorderStylePc,
			"--waku-1-bd-style-sp": waku1BorderStyleSp || waku1BorderStylePc,
			"--waku-1-bd-color-pc": waku1BorderColorPc,
			"--waku-1-bd-color-sp": waku1BorderColorSp || waku1BorderColorPc,
			"--waku-1-bdr-pc": borderRadiusPcVal,
			"--waku-1-bdr-sp": borderRadiusSpVal,
			"--waku-1-bg-pc": bgPcVal,
			"--waku-1-bg-sp": bgSpVal,
			"--waku-1-bg-opacity-pc": waku1BgOpacityPc / 100,
			"--waku-1-bg-opacity-sp": waku1BgOpacitySp >= 0 ? waku1BgOpacitySp / 100 : waku1BgOpacityPc / 100,
			"--waku-1-blend-mode-pc": waku1BgBlendModePc,
			"--waku-1-blend-mode-sp": waku1BgBlendModeSp || waku1BgBlendModePc,
			"--waku-1-bg-img-pc": waku1BgImagePc ? `url(${waku1BgImagePc})` : "none",
			"--waku-1-bg-img-sp": waku1BgImageSp ? `url(${waku1BgImageSp})` : (waku1BgImagePc ? `url(${waku1BgImagePc})` : "none"),
			"--waku-1-img-filter-pc": getFilterStyle(waku1ImageEffect),
			"--waku-1-img-filter-sp": getFilterStyle(waku1ImageEffect),
			"--waku-1-min-height-pc": hasAspectRatioPc ? "auto" : (waku1MinHeightPc >= 0 ? `${waku1MinHeightPc}px` : "auto"),
			"--waku-1-min-height-sp": hasAspectRatioSp ? "auto" : (hasAspectRatioPc ? "auto" : (waku1MinHeightSp >= 0 ? `${waku1MinHeightSp}px` : (waku1MinHeightPc >= 0 ? `${waku1MinHeightPc}px` : "auto"))),
			"--waku-1-aspect-ratio-pc": aspectRatioPcVal,
			"--waku-1-aspect-ratio-sp": aspectRatioSpVal,
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<Heading level={4} style={{ marginBottom: "8px" }}>配置</Heading>
						<SelectControl
							label="PC"
							value={waku1JustifyContentPc}
							options={[
								{ label: "左寄せ", value: "flex-start" },
								{ label: "中央", value: "center" },
								{ label: "右寄せ", value: "flex-end" },
							]}
							onChange={(v) => setAttributes({ waku1JustifyContentPc: v })}
						/>
						<SelectControl
							label="SP（空でPC継承）"
							value={waku1JustifyContentSp}
							options={[
								{ label: "PC継承", value: "" },
								{ label: "左寄せ", value: "flex-start" },
								{ label: "中央", value: "center" },
								{ label: "右寄せ", value: "flex-end" },
							]}
							onChange={(v) => setAttributes({ waku1JustifyContentSp: v })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>最大幅 (px)</Heading>
						<RangeControl
							label="PC"
							value={waku1MaxWidthPc}
							onChange={(v) => setAttributes({ waku1MaxWidthPc: v })}
							min={400}
							max={1300}
							step={10}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={waku1MaxWidthSp}
							onChange={(v) => setAttributes({ waku1MaxWidthSp: v })}
							min={-1}
							max={1300}
							step={10}
						/>
					</PanelBody>

					<PanelBody title="余白設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<RangeControl
							label="上 (px)"
							value={waku1PaddingTopPc}
							onChange={(v) => setAttributes({ waku1PaddingTopPc: v })}
							min={0}
							max={100}
							step={2}
						/>
						<RangeControl
							label="右 (px)"
							value={waku1PaddingRightPc}
							onChange={(v) => setAttributes({ waku1PaddingRightPc: v })}
							min={0}
							max={100}
							step={2}
						/>
						<RangeControl
							label="下 (px)"
							value={waku1PaddingBottomPc}
							onChange={(v) => setAttributes({ waku1PaddingBottomPc: v })}
							min={0}
							max={100}
							step={2}
						/>
						<RangeControl
							label="左 (px)"
							value={waku1PaddingLeftPc}
							onChange={(v) => setAttributes({ waku1PaddingLeftPc: v })}
							min={0}
							max={100}
							step={2}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP (-1でPC継承)</Heading>
						<RangeControl
							label="上 (px)"
							value={waku1PaddingTopSp}
							onChange={(v) => setAttributes({ waku1PaddingTopSp: v })}
							min={-1}
							max={100}
							step={2}
						/>
						<RangeControl
							label="右 (px)"
							value={waku1PaddingRightSp}
							onChange={(v) => setAttributes({ waku1PaddingRightSp: v })}
							min={-1}
							max={100}
							step={2}
						/>
						<RangeControl
							label="下 (px)"
							value={waku1PaddingBottomSp}
							onChange={(v) => setAttributes({ waku1PaddingBottomSp: v })}
							min={-1}
							max={100}
							step={2}
						/>
						<RangeControl
							label="左 (px)"
							value={waku1PaddingLeftSp}
							onChange={(v) => setAttributes({ waku1PaddingLeftSp: v })}
							min={-1}
							max={100}
							step={2}
						/>
					</PanelBody>

					<PanelBody title="ボーダー設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<RangeControl
							label="ボーダー幅 (px)"
							value={waku1BorderWidthPc}
							onChange={(v) => setAttributes({ waku1BorderWidthPc: v })}
							min={0}
							max={20}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル"
							value={waku1BorderStylePc}
							options={[
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "double", value: "double" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ waku1BorderStylePc: v })}
						/>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={waku1BorderColorPc}
							onChange={(color) => setAttributes({ waku1BorderColorPc: color || "var(--color-main)" })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP（空/-1でPC継承）</Heading>
						<RangeControl
							label="ボーダー幅 (px)"
							value={waku1BorderWidthSp}
							onChange={(v) => setAttributes({ waku1BorderWidthSp: v })}
							min={-1}
							max={20}
							step={1}
						/>
						<SelectControl
							label="ボーダースタイル"
							value={waku1BorderStyleSp}
							options={[
								{ label: "PC継承", value: "" },
								{ label: "solid", value: "solid" },
								{ label: "dashed", value: "dashed" },
								{ label: "dotted", value: "dotted" },
								{ label: "double", value: "double" },
								{ label: "none", value: "none" },
							]}
							onChange={(v) => setAttributes({ waku1BorderStyleSp: v })}
						/>
						<p style={{ marginBottom: "8px" }}>ボーダー色</p>
						<ColorPalette
							value={waku1BorderColorSp}
							onChange={(color) => setAttributes({ waku1BorderColorSp: color || "" })}
						/>
					</PanelBody>

					<PanelBody title="角丸設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC - 水平方向</Heading>
						<p style={{ fontSize: "11px", color: "#757575", marginBottom: "8px" }}>左上 / 右上 / 右下 / 左下</p>
						{radiusPcArr.slice(0, 4).map((radius, index) => (
							<RangeControl
								key={`h-${index}`}
								label={["左上", "右上", "右下", "左下"][index]}
								value={radius}
								onChange={(v) => updateBorderRadiusPc(index, v)}
								min={0}
								max={200}
								step={1}
							/>
						))}
						{radiusPcArr.length === 8 && (
							<>
								<hr style={{ margin: "16px 0" }} />
								<Heading level={4} style={{ marginBottom: "8px" }}>PC - 垂直方向</Heading>
								<p style={{ fontSize: "11px", color: "#757575", marginBottom: "8px" }}>楕円形の角丸を作成</p>
								{radiusPcArr.slice(4, 8).map((radius, index) => (
									<RangeControl
										key={`v-${index}`}
										label={["左上", "右上", "右下", "左下"][index]}
										value={radius}
										onChange={(v) => updateBorderRadiusPc(index + 4, v)}
										min={0}
										max={200}
										step={1}
									/>
								))}
							</>
						)}
						<div style={{ marginTop: "12px" }}>
							{radiusPcArr.length === 4 ? (
								<Button
									variant="secondary"
									onClick={addVerticalRadiusPc}
									style={{ width: "100%" }}
								>
									+ 垂直方向を追加（楕円形）
								</Button>
							) : (
								<Button
									variant="tertiary"
									isDestructive
									onClick={removeVerticalRadiusPc}
									style={{ width: "100%" }}
								>
									垂直方向を削除
								</Button>
							)}
						</div>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP（空でPC継承）</Heading>
						{radiusSpArr.length === 0 ? (
							<>
								<p style={{ fontSize: "12px", color: "#757575", marginBottom: "8px" }}>PC設定を継承中</p>
								<Button
									variant="secondary"
									onClick={initSpRadius}
									style={{ width: "100%" }}
								>
									SP独自設定を開始
								</Button>
							</>
						) : (
							<>
								<p style={{ fontSize: "11px", color: "#757575", marginBottom: "8px" }}>水平: 左上 / 右上 / 右下 / 左下</p>
								{radiusSpArr.slice(0, 4).map((radius, index) => (
									<RangeControl
										key={`sp-h-${index}`}
										label={["左上", "右上", "右下", "左下"][index]}
										value={radius}
										onChange={(v) => updateBorderRadiusSp(index, v)}
										min={0}
										max={200}
										step={1}
									/>
								))}
								{radiusSpArr.length === 8 && (
									<>
										<hr style={{ margin: "12px 0" }} />
										<p style={{ fontSize: "11px", color: "#757575", marginBottom: "8px" }}>垂直方向</p>
										{radiusSpArr.slice(4, 8).map((radius, index) => (
											<RangeControl
												key={`sp-v-${index}`}
												label={["左上", "右上", "右下", "左下"][index]}
												value={radius}
												onChange={(v) => updateBorderRadiusSp(index + 4, v)}
												min={0}
												max={200}
												step={1}
											/>
										))}
									</>
								)}
								<div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
									{radiusSpArr.length === 4 ? (
										<Button
											variant="secondary"
											onClick={addVerticalRadiusSp}
											style={{ flex: 1 }}
										>
											+ 垂直追加
										</Button>
									) : (
										<Button
											variant="tertiary"
											isDestructive
											onClick={removeVerticalRadiusSp}
											style={{ flex: 1 }}
										>
											垂直削除
										</Button>
									)}
									<Button
										variant="tertiary"
										onClick={() => setAttributes({ waku1BorderRadiusSp: [] })}
										style={{ flex: 1 }}
									>
										PC継承
									</Button>
								</div>
							</>
						)}
					</PanelBody>

					<PanelBody title="背景設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						<SelectControl
							label="背景タイプ"
							value={waku1BgTypePc}
							options={bgTypeOptions}
							onChange={(v) => setAttributes({ waku1BgTypePc: v })}
						/>
						{waku1BgTypePc === "color" ? (
							<>
								<p style={{ marginBottom: "8px" }}>背景色</p>
								<ColorPalette
									value={waku1BgColorPc}
									onChange={(color) => setAttributes({ waku1BgColorPc: color || "#ffffff" })}
								/>
							</>
						) : (
							<>
								<TextControl
									label="グラデーション"
									value={waku1BgGradientPc}
									onChange={(v) => setAttributes({ waku1BgGradientPc: v })}
									help="例: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
								/>
								<div
									style={{
										height: "40px",
										background: waku1BgGradientPc,
										borderRadius: "4px",
										border: "1px solid #ccc",
										marginBottom: "8px",
									}}
								/>
							</>
						)}
						<hr style={{ margin: "16px 0" }} />
						<SelectControl
							label="ブレンドモード"
							value={waku1BgBlendModePc}
							options={blendModeOptions}
							onChange={(v) => setAttributes({ waku1BgBlendModePc: v })}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>透明度 (%)</Heading>
						<RangeControl
							label="PC"
							value={waku1BgOpacityPc}
							onChange={(v) => setAttributes({ waku1BgOpacityPc: v })}
							min={0}
							max={100}
							step={1}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={waku1BgOpacitySp}
							onChange={(v) => setAttributes({ waku1BgOpacitySp: v })}
							min={-1}
							max={100}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP（空でPC継承）</Heading>
						<SelectControl
							label="背景タイプ"
							value={waku1BgTypeSp}
							options={[
								{ label: "PC継承", value: "" },
								...bgTypeOptions,
							]}
							onChange={(v) => setAttributes({ waku1BgTypeSp: v })}
						/>
						{waku1BgTypeSp === "color" && (
							<>
								<p style={{ marginBottom: "8px" }}>背景色</p>
								<ColorPalette
									value={waku1BgColorSp}
									onChange={(color) => setAttributes({ waku1BgColorSp: color || "" })}
								/>
							</>
						)}
						{waku1BgTypeSp === "gradient" && (
							<TextControl
								label="グラデーション"
								value={waku1BgGradientSp}
								onChange={(v) => setAttributes({ waku1BgGradientSp: v })}
								help="空でPC継承"
							/>
						)}
						<SelectControl
							label="ブレンドモード"
							value={waku1BgBlendModeSp}
							options={[
								{ label: "PC継承", value: "" },
								...blendModeOptions,
							]}
							onChange={(v) => setAttributes({ waku1BgBlendModeSp: v })}
						/>
					</PanelBody>

					<PanelBody title="背景画像設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC</Heading>
						{waku1BgImagePc && (
							<div style={{ marginBottom: "10px" }}>
								<img
									src={waku1BgImagePc}
									alt="背景画像PC"
									style={{ width: "100%", maxHeight: "150px", objectFit: "cover", border: "1px solid #ccc" }}
								/>
							</div>
						)}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => setAttributes({ waku1BgImagePc: media.url })}
								allowedTypes={["image"]}
								render={({ open }) => (
									<div style={{ display: "flex", gap: "8px" }}>
										<Button variant="secondary" onClick={open}>
											画像を選択
										</Button>
										{waku1BgImagePc && (
											<Button variant="secondary" onClick={() => setAttributes({ waku1BgImagePc: "" })}>
												削除
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP（空でPC継承）</Heading>
						{waku1BgImageSp && (
							<div style={{ marginBottom: "10px" }}>
								<img
									src={waku1BgImageSp}
									alt="背景画像SP"
									style={{ width: "100%", maxHeight: "150px", objectFit: "cover", border: "1px solid #ccc" }}
								/>
							</div>
						)}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => setAttributes({ waku1BgImageSp: media.url })}
								allowedTypes={["image"]}
								render={({ open }) => (
									<div style={{ display: "flex", gap: "8px" }}>
										<Button variant="secondary" onClick={open}>
											画像を選択
										</Button>
										{waku1BgImageSp && (
											<Button variant="secondary" onClick={() => setAttributes({ waku1BgImageSp: "" })}>
												削除
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
					</PanelBody>

					<PanelBody title="画像エフェクト" initialOpen={false}>
						<SelectControl
							label="エフェクト"
							value={waku1ImageEffect}
							options={effectOptions}
							onChange={(v) => setAttributes({ waku1ImageEffect: v })}
						/>
						{waku1ImageEffect === "grayscale" && (
							<RangeControl
								label={`グレースケール : ${waku1EffectGrayscale}%`}
								value={waku1EffectGrayscale}
								onChange={(v) => setAttributes({ waku1EffectGrayscale: v })}
								min={0}
								max={100}
								step={1}
							/>
						)}
						{waku1ImageEffect === "sepia" && (
							<RangeControl
								label={`セピア : ${waku1EffectSepia}%`}
								value={waku1EffectSepia}
								onChange={(v) => setAttributes({ waku1EffectSepia: v })}
								min={0}
								max={100}
								step={1}
							/>
						)}
						{waku1ImageEffect === "blur" && (
							<RangeControl
								label={`ぼかし : ${waku1EffectBlur}px`}
								value={waku1EffectBlur}
								onChange={(v) => setAttributes({ waku1EffectBlur: v })}
								min={0}
								max={20}
								step={0.5}
							/>
						)}
						{waku1ImageEffect === "brightness" && (
							<RangeControl
								label={`明るさ : ${waku1EffectBrightness}%`}
								value={waku1EffectBrightness}
								onChange={(v) => setAttributes({ waku1EffectBrightness: v })}
								min={0}
								max={300}
								step={5}
								help="100% = 通常、100%未満 = 暗く、100%超 = 明るく"
							/>
						)}
						{waku1ImageEffect === "contrast" && (
							<RangeControl
								label={`コントラスト : ${waku1EffectContrast}%`}
								value={waku1EffectContrast}
								onChange={(v) => setAttributes({ waku1EffectContrast: v })}
								min={0}
								max={300}
								step={5}
								help="100% = 通常"
							/>
						)}
						{waku1ImageEffect === "saturate" && (
							<RangeControl
								label={`彩度 : ${waku1EffectSaturate}%`}
								value={waku1EffectSaturate}
								onChange={(v) => setAttributes({ waku1EffectSaturate: v })}
								min={0}
								max={300}
								step={5}
								help="100% = 通常、0% = グレースケール"
							/>
						)}
						{waku1ImageEffect === "hue-rotate" && (
							<RangeControl
								label={`色相回転 : ${waku1EffectHueRotate}deg`}
								value={waku1EffectHueRotate}
								onChange={(v) => setAttributes({ waku1EffectHueRotate: v })}
								min={0}
								max={360}
								step={5}
							/>
						)}
						{waku1ImageEffect === "invert" && (
							<RangeControl
								label={`反転 : ${waku1EffectInvert}%`}
								value={waku1EffectInvert}
								onChange={(v) => setAttributes({ waku1EffectInvert: v })}
								min={0}
								max={100}
								step={1}
							/>
						)}
						{waku1ImageEffect === "opacity" && (
							<RangeControl
								label={`透明度 : ${waku1EffectOpacity}%`}
								value={waku1EffectOpacity}
								onChange={(v) => setAttributes({ waku1EffectOpacity: v })}
								min={0}
								max={100}
								step={1}
								help="100% = 不透明、0% = 完全に透明"
							/>
						)}
					</PanelBody>

					<PanelBody title="高さ・縦位置設定" initialOpen={false}>
						<Heading level={4} style={{ marginBottom: "8px" }}>min-height (px)</Heading>
						{hasAspectRatioPc && (
							<p style={{ fontSize: "11px", color: "#d63638", marginBottom: "8px" }}>※ 比率設定中のためautoになります</p>
						)}
						<RangeControl
							label="PC (-1でauto)"
							value={waku1MinHeightPc}
							onChange={(v) => setAttributes({ waku1MinHeightPc: v })}
							min={-1}
							max={800}
							step={10}
							disabled={hasAspectRatioPc}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={waku1MinHeightSp}
							onChange={(v) => setAttributes({ waku1MinHeightSp: v })}
							min={-1}
							max={800}
							step={10}
							disabled={hasAspectRatioSp || hasAspectRatioPc}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>比率 (aspect-ratio: 100 / X)</Heading>
						<p style={{ fontSize: "11px", color: "#757575", marginBottom: "8px" }}>0より大きい値で適用。設定時はmin-heightがautoになります</p>
						<RangeControl
							label="PC (0で無効)"
							value={waku1AspectRatioPc}
							onChange={(v) => setAttributes({ waku1AspectRatioPc: v })}
							min={0}
							max={200}
							step={1}
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={waku1AspectRatioSp}
							onChange={(v) => setAttributes({ waku1AspectRatioSp: v })}
							min={-1}
							max={200}
							step={1}
						/>
					</PanelBody>
					<PanelBody title="リンク設定" initialOpen={false}>
						<TextControl
							label="リンクURL"
							value={waku1LinkUrl}
							onChange={(v) => setAttributes({ waku1LinkUrl: v })}
							placeholder="https://example.com"
							help="設定すると枠全体がリンクになります"
						/>
						{waku1LinkUrl && (
							<ToggleControl
								label="新しいタブで開く"
								checked={waku1LinkNewTab}
								onChange={(v) => setAttributes({ waku1LinkNewTab: v })}
							/>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="lw-pr-waku-1__custom_wrap" style={wrapStyle}>
						<InnerBlocks
							template={[["core/paragraph", {}]]}
							renderAppender={InnerBlocks.ButtonBlockAppender}
						/>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			waku1JustifyContentPc,
			waku1JustifyContentSp,
			waku1MaxWidthPc,
			waku1MaxWidthSp,
			waku1PaddingTopPc,
			waku1PaddingRightPc,
			waku1PaddingBottomPc,
			waku1PaddingLeftPc,
			waku1PaddingTopSp,
			waku1PaddingRightSp,
			waku1PaddingBottomSp,
			waku1PaddingLeftSp,
			waku1BorderWidthPc,
			waku1BorderWidthSp,
			waku1BorderStylePc,
			waku1BorderStyleSp,
			waku1BorderColorPc,
			waku1BorderColorSp,
			waku1BorderRadiusPc,
			waku1BorderRadiusSp,
			waku1BgTypePc,
			waku1BgTypeSp,
			waku1BgColorPc,
			waku1BgColorSp,
			waku1BgGradientPc,
			waku1BgGradientSp,
			waku1BgOpacityPc,
			waku1BgOpacitySp,
			waku1BgBlendModePc,
			waku1BgBlendModeSp,
			waku1BgImagePc,
			waku1BgImageSp,
			waku1ImageEffect,
			waku1EffectGrayscale,
			waku1EffectSepia,
			waku1EffectBlur,
			waku1EffectBrightness,
			waku1EffectContrast,
			waku1EffectSaturate,
			waku1EffectInvert,
			waku1EffectHueRotate,
			waku1EffectOpacity,
			waku1MinHeightPc,
			waku1MinHeightSp,
			waku1AspectRatioPc,
			waku1AspectRatioSp,
			waku1LinkUrl,
			waku1LinkNewTab,
		} = attributes;

		// aspect-ratio値を生成（100 / X の形式、比率設定時はmin-heightをautoに）
		const hasAspectRatioPc = waku1AspectRatioPc > 0;
		const aspectRatioPcVal = hasAspectRatioPc ? `100 / ${waku1AspectRatioPc}` : "auto";
		const hasAspectRatioSp = waku1AspectRatioSp > 0;
		const aspectRatioSpVal = hasAspectRatioSp ? `100 / ${waku1AspectRatioSp}` : (hasAspectRatioPc ? aspectRatioPcVal : "auto");

		/* エフェクトをCSSフィルターに変換 */
		const getFilterStyle = (effect) => {
			switch (effect) {
				case "grayscale": return `grayscale(${waku1EffectGrayscale}%)`;
				case "sepia": return `sepia(${waku1EffectSepia}%)`;
				case "blur": return `blur(${waku1EffectBlur}px)`;
				case "brightness": return `brightness(${waku1EffectBrightness}%)`;
				case "contrast": return `contrast(${waku1EffectContrast}%)`;
				case "saturate": return `saturate(${waku1EffectSaturate}%)`;
				case "hue-rotate": return `hue-rotate(${waku1EffectHueRotate}deg)`;
				case "invert": return `invert(${waku1EffectInvert}%)`;
				case "opacity": return `opacity(${waku1EffectOpacity}%)`;
				default: return "none";
			}
		};

		// padding値を生成
		const paddingPcVal = `${waku1PaddingTopPc}px ${waku1PaddingRightPc}px ${waku1PaddingBottomPc}px ${waku1PaddingLeftPc}px`;
		const paddingSpVal = `${waku1PaddingTopSp >= 0 ? waku1PaddingTopSp : waku1PaddingTopPc}px ${waku1PaddingRightSp >= 0 ? waku1PaddingRightSp : waku1PaddingRightPc}px ${waku1PaddingBottomSp >= 0 ? waku1PaddingBottomSp : waku1PaddingBottomPc}px ${waku1PaddingLeftSp >= 0 ? waku1PaddingLeftSp : waku1PaddingLeftPc}px`;

		// border-radius値を生成
		const radiusPcArr = Array.isArray(waku1BorderRadiusPc) ? waku1BorderRadiusPc : [8, 8, 8, 8];
		const radiusSpArr = Array.isArray(waku1BorderRadiusSp) ? waku1BorderRadiusSp : [];

		const generateBorderRadiusValue = (arr) => {
			if (arr.length <= 4) {
				return arr.map((v) => `${v}px`).join(" ");
			} else {
				const horizontal = arr.slice(0, 4).map((v) => `${v}px`).join(" ");
				const vertical = arr.slice(4, 8).map((v) => `${v}px`).join(" ");
				return `${horizontal} / ${vertical}`;
			}
		};

		const borderRadiusPcVal = generateBorderRadiusValue(radiusPcArr);
		const borderRadiusSpVal = radiusSpArr.length > 0
			? generateBorderRadiusValue(radiusSpArr)
			: borderRadiusPcVal;

		// 背景値を生成（単色 or グラデーション）
		const bgPcVal = waku1BgTypePc === "gradient" ? waku1BgGradientPc : waku1BgColorPc;
		const effectiveBgTypeSp = waku1BgTypeSp || waku1BgTypePc;
		const bgSpVal = effectiveBgTypeSp === "gradient"
			? (waku1BgGradientSp || waku1BgGradientPc)
			: (waku1BgColorSp || waku1BgColorPc);

		const blockProps = useBlockProps.save({
			className: "lw-pr-waku-1",
			style: {
				"--waku-1-justify-content-pc": waku1JustifyContentPc,
				"--waku-1-justify-content-sp": waku1JustifyContentSp || waku1JustifyContentPc,
			},
		});

		const wrapStyle = {
			"--waku-1-max-width-pc": `${waku1MaxWidthPc}px`,
			"--waku-1-max-width-sp": waku1MaxWidthSp >= 0 ? `${waku1MaxWidthSp}px` : `${waku1MaxWidthPc}px`,
			"--waku-1-padding-pc": paddingPcVal,
			"--waku-1-padding-sp": paddingSpVal,
			"--waku-1-bd-width-pc": `${waku1BorderWidthPc}px`,
			"--waku-1-bd-width-sp": waku1BorderWidthSp >= 0 ? `${waku1BorderWidthSp}px` : `${waku1BorderWidthPc}px`,
			"--waku-1-bd-style-pc": waku1BorderStylePc,
			"--waku-1-bd-style-sp": waku1BorderStyleSp || waku1BorderStylePc,
			"--waku-1-bd-color-pc": waku1BorderColorPc,
			"--waku-1-bd-color-sp": waku1BorderColorSp || waku1BorderColorPc,
			"--waku-1-bdr-pc": borderRadiusPcVal,
			"--waku-1-bdr-sp": borderRadiusSpVal,
			"--waku-1-bg-pc": bgPcVal,
			"--waku-1-bg-sp": bgSpVal,
			"--waku-1-bg-opacity-pc": waku1BgOpacityPc / 100,
			"--waku-1-bg-opacity-sp": waku1BgOpacitySp >= 0 ? waku1BgOpacitySp / 100 : waku1BgOpacityPc / 100,
			"--waku-1-blend-mode-pc": waku1BgBlendModePc,
			"--waku-1-blend-mode-sp": waku1BgBlendModeSp || waku1BgBlendModePc,
			"--waku-1-bg-img-pc": waku1BgImagePc ? `url(${waku1BgImagePc})` : "none",
			"--waku-1-bg-img-sp": waku1BgImageSp ? `url(${waku1BgImageSp})` : (waku1BgImagePc ? `url(${waku1BgImagePc})` : "none"),
			"--waku-1-img-filter-pc": getFilterStyle(waku1ImageEffect),
			"--waku-1-img-filter-sp": getFilterStyle(waku1ImageEffect),
			"--waku-1-min-height-pc": hasAspectRatioPc ? "auto" : (waku1MinHeightPc >= 0 ? `${waku1MinHeightPc}px` : "auto"),
			"--waku-1-min-height-sp": hasAspectRatioSp ? "auto" : (hasAspectRatioPc ? "auto" : (waku1MinHeightSp >= 0 ? `${waku1MinHeightSp}px` : (waku1MinHeightPc >= 0 ? `${waku1MinHeightPc}px` : "auto"))),
			"--waku-1-aspect-ratio-pc": aspectRatioPcVal,
			"--waku-1-aspect-ratio-sp": aspectRatioSpVal,
		};

		const WrapTag = waku1LinkUrl ? "a" : "div";
		const wrapProps = {
			className: "lw-pr-waku-1__custom_wrap",
			style: wrapStyle,
			...(waku1LinkUrl
				? {
						href: waku1LinkUrl,
						...(waku1LinkNewTab
							? { target: "_blank", rel: "noopener noreferrer" }
							: {}),
				  }
				: {}),
		};

		return (
			<div {...blockProps}>
				<WrapTag {...wrapProps}>
					<InnerBlocks.Content />
				</WrapTag>
			</div>
		);
	},
});
