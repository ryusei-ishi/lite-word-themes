import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	SelectControl,
	RadioControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
	minHeightPcClassOptionArr,
	minHeightTbClassOptionArr,
	minHeightSpClassOptionArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
	/* ====================================================== */
	edit({ attributes, setAttributes }) {
		const {
			backgroundImage,
			backgroundImageSp,
			mainTitle,
			filterBackgroundColor,
			filterOpacity,

			innerFilterBg,
			innerFilterBorderColor,
			innerFilterBorderWidth,
			innerFilterBorderRadius,

			innerFilterShadowColor,
			innerFilterShadowOffsetX,
			innerFilterShadowOffsetY,
			innerFilterShadowBlur,
			innerFilterShadowSpread,

			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,

			/* ★ 追加属性 */
			titleFontSizeClass,
		} = attributes;

		const blockProps = useBlockProps({
			className: `paid-block-fv-10 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		const currentPostType = useSelect((select) =>
			select('core/editor').getCurrentPostType(),
		);
		if (currentPostType !== 'page') {
			return <div {...blockProps}><p>このブロックは固定ページでのみ使用できます。</p></div>;
		}

		const onChangeBg   = (media) => setAttributes({ backgroundImage: media.url });
		const onChangeBgSp = (media) => setAttributes({ backgroundImageSp: media.url });

		/* --- 影の box-shadow 文字列生成 --- */
		const boxShadow = `${innerFilterShadowOffsetX}px ${innerFilterShadowOffsetY}px ${innerFilterShadowBlur}px ${innerFilterShadowSpread}px ${innerFilterShadowColor}`;

		return (
			<>
				<InspectorControls>

					{/* ★ フォントサイズ設定パネル（RadioControlへ変更） */}
					<PanelBody title="タイトルのフォントサイズ" initialOpen={true}>
						<RadioControl
							selected={ titleFontSizeClass }
							options={[
								{ label: '大 (L)', value: 'font_size_l' },
								{ label: '中 (M)', value: 'font_size_m' },
								{ label: '小 (S)', value: 'font_size_s' },
							]}
							onChange={ (v) => setAttributes({ titleFontSizeClass: v }) }
						/>
					</PanelBody>

					{/* 背景画像パネル */}
					<PanelBody title="背景画像設定">
						{/* …PC / SP 画像アップロードの既存コード… */}
					</PanelBody>

					{/* フィルター設定 */}
					<PanelBody title="フィルター設定">
						<p>フィルターの色</p>
						<ColorPalette
							value={filterBackgroundColor}
							onChange={(c) => setAttributes({ filterBackgroundColor: c })}
						/>
						<p>透明度</p>
						<RangeControl
							value={filterOpacity}
							onChange={(v) => setAttributes({ filterOpacity: v })}
							min={0}
							max={1}
							step={0.01}
						/>
					</PanelBody>

					{/* inner_filter 装飾 */}
					<PanelBody title="インナーフィルター装飾" initialOpen={false}>
						<p>背景色</p>
						<ColorPalette
							value={innerFilterBg}
							onChange={(c) => setAttributes({ innerFilterBg: c })}
						/>
						<p>枠線色</p>
						<ColorPalette
							value={innerFilterBorderColor}
							onChange={(c) => setAttributes({ innerFilterBorderColor: c })}
						/>
						<RangeControl
							label="枠線太さ (px)"
							value={innerFilterBorderWidth}
							onChange={(v) => setAttributes({ innerFilterBorderWidth: v })}
							min={0}
							max={20}
							step={1}
						/>
						<RangeControl
							label="角丸 (px)"
							value={innerFilterBorderRadius}
							onChange={(v) => setAttributes({ innerFilterBorderRadius: v })}
							min={0}
							max={100}
							step={1}
						/>
					</PanelBody>

					{/* 影設定 */}
					<PanelBody title="インナーフィルター影" initialOpen={false}>
						<p>影の色</p>
						<ColorPalette
							value={innerFilterShadowColor}
							onChange={(c) => setAttributes({ innerFilterShadowColor: c })}
						/>
						<RangeControl
							label="Xオフセット (px)"
							value={innerFilterShadowOffsetX}
							onChange={(v) => setAttributes({ innerFilterShadowOffsetX: v })}
							min={-50}
							max={50}
							step={1}
						/>
						<RangeControl
							label="Yオフセット (px)"
							value={innerFilterShadowOffsetY}
							onChange={(v) => setAttributes({ innerFilterShadowOffsetY: v })}
							min={-50}
							max={50}
							step={1}
						/>
						<RangeControl
							label="ぼかし (px)"
							value={innerFilterShadowBlur}
							onChange={(v) => setAttributes({ innerFilterShadowBlur: v })}
							min={0}
							max={100}
							step={1}
						/>
						<RangeControl
							label="スプレッド (px)"
							value={innerFilterShadowSpread}
							onChange={(v) => setAttributes({ innerFilterShadowSpread: v })}
							min={-50}
							max={50}
							step={1}
						/>
					</PanelBody>

					{/* 文字色 */}
					<PanelBody title="全体の文字の色">
						<ColorPalette
							value={textColor}
							onChange={(c) => setAttributes({ textColor: c })}
						/>
					</PanelBody>

					{/* 高さ設定 */}
					<PanelBody title="高さ設定">
						<p>PC用高さ</p>
						<SelectControl
							value={minHeightPc}
							options={minHeightPcClassOptionArr()}
							onChange={(v) => setAttributes({ minHeightPc: v })}
						/>
						<p>タブレット用高さ</p>
						<SelectControl
							value={minHeightTb}
							options={minHeightTbClassOptionArr()}
							onChange={(v) => setAttributes({ minHeightTb: v })}
						/>
						<p>スマートフォン用高さ</p>
						<SelectControl
							value={minHeightSp}
							options={minHeightSpClassOptionArr()}
							onChange={(v) => setAttributes({ minHeightSp: v })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* ---------- プレビュー ---------- */}
				<div {...blockProps}>
					<div className="fv-10_inner">
						<h1 className={`ttl ${titleFontSizeClass}`} style={{ color: textColor }}>
							<RichText
								tagName="span"
								className="main"
								value={mainTitle}
								onChange={(v) => setAttributes({ mainTitle: v })}
								placeholder="メインタイトルを入力"
								style={{ color: textColor }}
							/>
						</h1>

						<div
							className="inner_filter"
							style={{
								backgroundColor: innerFilterBg,
								borderColor: innerFilterBorderColor,
								borderWidth: `${innerFilterBorderWidth}px`,
								borderStyle: innerFilterBorderWidth ? 'solid' : 'none',
								borderRadius: `${innerFilterBorderRadius}px`,
								boxShadow: boxShadow,
							}}
						></div>
					</div>

					<div
						className="filter"
						style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}
					></div>

					<div className="bg_image">
						{backgroundImage && <img src={backgroundImage} alt="" />}
					</div>
				</div>
			</>
		);
	},

	/* ====================================================== */
	save({ attributes }) {
		const {
			backgroundImage,
			backgroundImageSp,
			mainTitle,
			filterBackgroundColor,
			filterOpacity,

			innerFilterBg,
			innerFilterBorderColor,
			innerFilterBorderWidth,
			innerFilterBorderRadius,

			innerFilterShadowColor,
			innerFilterShadowOffsetX,
			innerFilterShadowOffsetY,
			innerFilterShadowBlur,
			innerFilterShadowSpread,

			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,

			/* ★ 追加属性 */
			titleFontSizeClass,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `paid-block-fv-10 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		const boxShadow = `${innerFilterShadowOffsetX}px ${innerFilterShadowOffsetY}px ${innerFilterShadowBlur}px ${innerFilterShadowSpread}px ${innerFilterShadowColor}`;

		return (
			<div {...blockProps}>
				<div className="fv-10_inner">
					<h1 className={`ttl ${titleFontSizeClass}`} style={{ color: textColor }}>
						<RichText.Content
							tagName="span"
							className="main"
							value={mainTitle}
							style={{ color: textColor }}
						/>
					</h1>

					<div
						className="inner_filter"
						style={{
							backgroundColor: innerFilterBg,
							borderColor: innerFilterBorderColor,
							borderWidth: `${innerFilterBorderWidth}px`,
							borderStyle: innerFilterBorderWidth ? 'solid' : 'none',
							borderRadius: `${innerFilterBorderRadius}px`,
							boxShadow: boxShadow,
						}}
					></div>
				</div>

				<div
					className="filter"
					style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}
				></div>

				{backgroundImage && (
					<picture className="bg_image">
						<source srcSet={backgroundImageSp} media="(max-width: 800px)" />
						<source srcSet={backgroundImage}  media="(min-width: 801px)" />
						<img src={backgroundImage} alt="" loading="eager" fetchpriority="high" />
					</picture>
				)}
			</div>
		);
	},
});
