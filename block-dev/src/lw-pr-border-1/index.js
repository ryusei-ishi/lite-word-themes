import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
} from "@wordpress/components";
import "./style.scss";
import "./editor.scss";
import metadata from "./block.json";

// 配置 → margin-left / margin-right の変換
const alignToMargins = (align) => {
	switch (align) {
		case "left":
			return { ml: "0", mr: "auto" };
		case "right":
			return { ml: "auto", mr: "0" };
		default: // center
			return { ml: "auto", mr: "auto" };
	}
};

// CSS変数を生成
const buildCssVars = (attributes) => {
	const {
		mtPc, mbPc, mtSp, mbSp,
		maxWidthUnitPc, maxWidthPc, maxWidthUnitSp, maxWidthSp,
		borderWidthPc, borderWidthSp,
		borderStylePc, borderStyleSp,
		borderColorPc, borderColorSp,
		alignPc, alignSp,
	} = attributes;

	const pcMargins = alignToMargins(alignPc);
	const effectiveAlignSp = alignSp || alignPc;
	const spMargins = alignToMargins(effectiveAlignSp);

	const effectiveMaxWidthUnitSp = maxWidthUnitSp || maxWidthUnitPc;
	const effectiveMaxWidthSp = maxWidthSp === -1 ? maxWidthPc : maxWidthSp;
	const effectiveMtSp = mtSp === -1 ? mtPc : mtSp;
	const effectiveMbSp = mbSp === -1 ? mbPc : mbSp;
	const effectiveBorderWidthSp = borderWidthSp === -1 ? borderWidthPc : borderWidthSp;
	const effectiveBorderStyleSp = borderStyleSp || borderStylePc;
	const effectiveBorderColorSp = borderColorSp || borderColorPc;

	return {
		"--border-1-mt-pc": `${mtPc}px`,
		"--border-1-mb-pc": `${mbPc}px`,
		"--border-1-ml-pc": pcMargins.ml,
		"--border-1-mr-pc": pcMargins.mr,
		"--border-1-max-width-pc": `${maxWidthPc}${maxWidthUnitPc}`,
		"--border-1-width-pc": `${borderWidthPc}px`,
		"--border-1-style-pc": borderStylePc,
		"--border-1-color-pc": borderColorPc,
		"--border-1-mt-sp": `${effectiveMtSp}px`,
		"--border-1-mb-sp": `${effectiveMbSp}px`,
		"--border-1-ml-sp": spMargins.ml,
		"--border-1-mr-sp": spMargins.mr,
		"--border-1-max-width-sp": `${effectiveMaxWidthSp}${effectiveMaxWidthUnitSp}`,
		"--border-1-width-sp": `${effectiveBorderWidthSp}px`,
		"--border-1-style-sp": effectiveBorderStyleSp,
		"--border-1-color-sp": effectiveBorderColorSp,
	};
};

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			mtPc, mbPc, mtSp, mbSp,
			maxWidthUnitPc, maxWidthPc, maxWidthUnitSp, maxWidthSp,
			borderWidthPc, borderWidthSp,
			borderStylePc, borderStyleSp,
			borderColorPc, borderColorSp,
			alignPc, alignSp,
		} = attributes;

		const cssVars = buildCssVars(attributes);
		const blockProps = useBlockProps({ className: "lw-pr-border-1", style: cssVars });

		const styleOptions = [
			{ label: "solid", value: "solid" },
			{ label: "dashed", value: "dashed" },
			{ label: "dotted", value: "dotted" },
			{ label: "none", value: "none" },
		];

		const alignOptions = [
			{ label: "中央", value: "center" },
			{ label: "左寄せ", value: "left" },
			{ label: "右寄せ", value: "right" },
		];

		const unitOptions = [
			{ label: "%", value: "%" },
			{ label: "px", value: "px" },
		];

		return (
			<>
				<InspectorControls>
					<PanelBody title="PC設定" initialOpen={true}>
						<RangeControl label="上マージン (px)" value={mtPc} onChange={(v) => setAttributes({ mtPc: v })} min={0} max={200} />
						<RangeControl label="下マージン (px)" value={mbPc} onChange={(v) => setAttributes({ mbPc: v })} min={0} max={200} />
						<SelectControl label="幅の単位" value={maxWidthUnitPc} options={unitOptions} onChange={(v) => setAttributes({ maxWidthUnitPc: v })} />
						<RangeControl label="幅" value={maxWidthPc} onChange={(v) => setAttributes({ maxWidthPc: v })} min={1} max={maxWidthUnitPc === "%" ? 100 : 1200} />
						<RangeControl label="ボーダー幅 (px)" value={borderWidthPc} onChange={(v) => setAttributes({ borderWidthPc: v })} min={0} max={20} />
						<SelectControl label="ボーダースタイル" value={borderStylePc} options={styleOptions} onChange={(v) => setAttributes({ borderStylePc: v })} />
						<TextControl label="ボーダー色" value={borderColorPc} onChange={(v) => setAttributes({ borderColorPc: v })} />
						<SelectControl label="配置" value={alignPc} options={alignOptions} onChange={(v) => setAttributes({ alignPc: v })} />
					</PanelBody>
					<PanelBody title="SP設定（空欄・-1でPC継承）" initialOpen={false}>
						<RangeControl label="上マージン (px)" value={mtSp} onChange={(v) => setAttributes({ mtSp: v })} min={-1} max={200} help="-1でPCを継承" />
						<RangeControl label="下マージン (px)" value={mbSp} onChange={(v) => setAttributes({ mbSp: v })} min={-1} max={200} help="-1でPCを継承" />
						<SelectControl
							label="幅の単位"
							value={maxWidthUnitSp}
							options={[{ label: "PCを継承", value: "" }, ...unitOptions]}
							onChange={(v) => setAttributes({ maxWidthUnitSp: v })}
						/>
						<RangeControl label="幅" value={maxWidthSp} onChange={(v) => setAttributes({ maxWidthSp: v })} min={-1} max={maxWidthUnitSp === "px" ? 600 : 100} help="-1でPCを継承" />
						<RangeControl label="ボーダー幅 (px)" value={borderWidthSp} onChange={(v) => setAttributes({ borderWidthSp: v })} min={-1} max={20} help="-1でPCを継承" />
						<SelectControl
							label="ボーダースタイル"
							value={borderStyleSp}
							options={[{ label: "PCを継承", value: "" }, ...styleOptions]}
							onChange={(v) => setAttributes({ borderStyleSp: v })}
						/>
						<TextControl label="ボーダー色" value={borderColorSp} onChange={(v) => setAttributes({ borderColorSp: v })} help="空欄でPCを継承" />
						<SelectControl
							label="配置"
							value={alignSp}
							options={[{ label: "PCを継承", value: "" }, ...alignOptions]}
							onChange={(v) => setAttributes({ alignSp: v })}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}></div>
			</>
		);
	},

	save: ({ attributes }) => {
		const cssVars = buildCssVars(attributes);
		const blockProps = useBlockProps.save({ className: "lw-pr-border-1", style: cssVars });

		return <div {...blockProps}></div>;
	},
});
