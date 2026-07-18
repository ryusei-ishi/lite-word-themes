import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ColorPalette,
} from '@wordpress/components';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ===== 共通オプション ===== */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType(metadata.name, {
	title   : 'step 08',

	/* ======================================================
	 * 1) エディタ
	 * ==================================================== */
	edit({ attributes, setAttributes }) {
		const {
			bgGradient, ulMaxWidth,
			fontNo, fontWeightNo, colorNo,
			stepNo,
			liInPtPc, liInPtSp,
			stepBdrPc, stepBdrSp,
		} = attributes;

		const blockProps = useBlockProps({
			className: 'lw-pr-step-8'
		});

		return (
			<>
				<InspectorControls>
					{/* --- 全体設定 --- */}
					<PanelBody title="レイアウト全体" initialOpen={true}>
						<RangeControl
							label="最大横幅"
							value={ulMaxWidth}
							onChange={(v) => setAttributes({ ulMaxWidth: v })}
							min={600}
							max={1280}
							step={1}
						/>
						<p>枠・STEP番号背景色</p>
						<ColorPalette
							value={bgGradient}
							onChange={(c) => setAttributes({ bgGradient: c })}
						/>
						<RangeControl
							label="コンテンツの余白（上）PC"
							value={liInPtPc}
							onChange={(v) => setAttributes({ liInPtPc: v })}
							min={0}
							max={3}
							step={0.1}
						/>
						<RangeControl
							label="コンテンツの余白（上）SP"
							value={liInPtSp}
							onChange={(v) => setAttributes({ liInPtSp: v })}
							min={0}
							max={3}
							step={0.1}
						/>
						<RangeControl
							label="角丸 PC"
							value={stepBdrPc}
							onChange={(v) => setAttributes({ stepBdrPc: v })}
							min={0}
							max={50}
							step={1}
						/>
						<RangeControl
							label="角丸 SP"
							value={stepBdrSp}
							onChange={(v) => setAttributes({ stepBdrSp: v })}
							min={0}
							max={50}
							step={1}
						/>
					</PanelBody>

					{/* --- STEP番号設定 --- */}
					<PanelBody title="STEP番号の書式" initialOpen={false}>
						<SelectControl
							label="フォント"
							value={fontNo}
							options={fontOptions}
							onChange={(v) => setAttributes({ fontNo: v })}
						/>
						<SelectControl
							label="太さ"
							value={fontWeightNo}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ fontWeightNo: v })}
						/>
						<p>文字色</p>
						<ColorPalette
							value={colorNo}
							onChange={(c) => setAttributes({ colorNo: c })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* ---------- エディタ表示 ---------- */}
				<div {...blockProps}>
					<div className="lw-step__inner" style={{ maxWidth: ulMaxWidth }}>
						<div
							className="lw-step__li"
							style={{
								borderColor: bgGradient,
								'--step-8-bdr-pc': `${stepBdrPc}px`,
								'--step-8-bdr-sp': `${stepBdrSp}px`,
							}}
						>
							{/* STEP番号 */}
							<RichText
								tagName="div"
								className="lw-step__li_no"
								value={stepNo}
								onChange={(v) => setAttributes({ stepNo: v })}
								data-lw_font_set={fontNo}
								style={{
									fontWeight: fontWeightNo,
									color: colorNo || undefined,
								}}
							/>

							<div
								className="lw-step__li_in"
								style={{
									'--step-8-li-in-pt-pc': `${liInPtPc}em`,
									'--step-8-li-in-pt-sp': `${liInPtSp}em`,
								}}
							>
								<InnerBlocks />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},

	/* ======================================================
	 * 2) フロント出力
	 * ==================================================== */
	save({ attributes }) {
		const {
			bgGradient, ulMaxWidth,
			fontNo, fontWeightNo, colorNo,
			stepNo,
			liInPtPc, liInPtSp,
			stepBdrPc, stepBdrSp,
		} = attributes;

		return (
			<div className="lw-pr-step-8">
				<div className="lw-step__inner" style={{ maxWidth: ulMaxWidth }}>
					<div
						className="lw-step__li"
						style={{
							borderColor: bgGradient,
							'--step-8-bdr-pc': `${stepBdrPc}px`,
							'--step-8-bdr-sp': `${stepBdrSp}px`,
						}}
					>
						{/* STEP番号 */}
						<RichText.Content
							tagName="div"
							className="lw-step__li_no"
							value={stepNo}
							data-lw_font_set={fontNo}
							style={{
								fontWeight: fontWeightNo,
								color: colorNo || undefined,
							}}
						/>

						<div
							className="lw-step__li_in"
							style={{
								'--step-8-li-in-pt-pc': `${liInPtPc}em`,
								'--step-8-li-in-pt-sp': `${liInPtSp}em`,
							}}
						>
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	},
});
