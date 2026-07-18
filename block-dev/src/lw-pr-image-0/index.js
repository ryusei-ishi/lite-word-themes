/* ----------------------------------------------------------
 * LiteWord – lw-pr-image-0
 * シンプルな画像ブロック
 * -------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import {
	MediaUpload,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	RangeControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

/* エフェクトオプション */
const effectOptions = [
	{ label: 'なし', value: 'none' },
	{ label: 'グレースケール', value: 'grayscale' },
	{ label: 'セピア', value: 'sepia' },
	{ label: 'ぼかし', value: 'blur' },
	{ label: '明るさ', value: 'brightness' },
	{ label: 'コントラスト', value: 'contrast' },
	{ label: '彩度', value: 'saturate' },
	{ label: '色相回転', value: 'hue-rotate' },
	{ label: '反転', value: 'invert' },
	{ label: '透明度', value: 'opacity' },
];

/* 配置オプション */
const alignOptionsPc = [
	{ label: '左寄せ', value: 'left' },
	{ label: '中央', value: 'center' },
	{ label: '右寄せ', value: 'right' },
];
const alignOptionsTbSp = [
	{ label: '継承', value: 'inherit' },
	{ label: '左寄せ', value: 'left' },
	{ label: '中央', value: 'center' },
	{ label: '右寄せ', value: 'right' },
];

/* 配置からmarginを取得 */
const getAlignMargins = (align) => {
	switch (align) {
		case 'left': return { ml: '0', mr: 'auto' };
		case 'right': return { ml: 'auto', mr: '0' };
		case 'center':
		default: return { ml: 'auto', mr: 'auto' };
	}
};

/* object-fit オプション */
const objectFitOptionsPc = [
	{ label: 'cover', value: 'cover' },
	{ label: 'contain', value: 'contain' },
];
const objectFitOptionsTbSp = [
	{ label: '継承', value: 'inherit' },
	{ label: 'cover', value: 'cover' },
	{ label: 'contain', value: 'contain' },
];

import './style.scss';
import metadata from './block.json';

/* ============================================================== */
registerBlockType(metadata.name, {
	/* ============================ EDIT ============================ */
	edit({ attributes, setAttributes }) {
		const {
			image = '', alt = '',
			maxWidthPc = 0, maxWidthTb = 0, maxWidthSp = 0,
			aspectRatioW = 600, aspectRatioH = 400,
			imgBorderRadiusPc = 0, imgBorderRadiusTb = 0, imgBorderRadiusSp = 0,
			rotatePc = 0, rotateTb = 0, rotateSp = 0,
			rotateInheritTb = true, rotateInheritSp = true,
			imageEffect = 'none',
			effectGrayscale = 100, effectSepia = 100, effectBlur = 3,
			effectBrightness = 130, effectContrast = 150, effectSaturate = 200,
			effectInvert = 100, effectHueRotate = 180, effectOpacity = 50,
			linkUrl = '', linkOpenNewTab = false,
			alignPc = 'center', alignTb = 'inherit', alignSp = 'inherit',
			objectFitPc = 'cover', objectFitTb = 'inherit', objectFitSp = 'inherit',
		} = attributes;

		/* エフェクトをCSSフィルターに変換 */
		const getFilterStyle = (effect) => {
			switch (effect) {
				case 'grayscale': return `grayscale(${effectGrayscale}%)`;
				case 'sepia': return `sepia(${effectSepia}%)`;
				case 'blur': return `blur(${effectBlur}px)`;
				case 'brightness': return `brightness(${effectBrightness}%)`;
				case 'contrast': return `contrast(${effectContrast}%)`;
				case 'saturate': return `saturate(${effectSaturate}%)`;
				case 'hue-rotate': return `hue-rotate(${effectHueRotate}deg)`;
				case 'invert': return `invert(${effectInvert}%)`;
				case 'opacity': return `opacity(${effectOpacity}%)`;
				default: return 'none';
			}
		};

		/* 数値を CSS 値に変換 (0 = 100%, それ以外 = px) */
		const toMaxWidthValue = (v) => (v === 0 ? '100%' : `${v}px`);

		/* 継承ロジック: PC → TB → SP (0は継承) */
		const effectiveMaxWidthTb = maxWidthTb === 0 ? maxWidthPc : maxWidthTb;
		const effectiveMaxWidthSp = maxWidthSp === 0 ? effectiveMaxWidthTb : maxWidthSp;

		/* 角丸の継承ロジック: PC → TB → SP (0は継承) */
		const effectiveRadiusTb = imgBorderRadiusTb === 0 ? imgBorderRadiusPc : imgBorderRadiusTb;
		const effectiveRadiusSp = imgBorderRadiusSp === 0 ? effectiveRadiusTb : imgBorderRadiusSp;

		/* 角度の継承ロジック: PC → TB → SP (トグルで継承) */
		const effectiveRotateTb = rotateInheritTb ? rotatePc : rotateTb;
		const effectiveRotateSp = rotateInheritSp ? effectiveRotateTb : rotateSp;

		/* 配置の継承ロジック: PC → TB → SP */
		const effectiveAlignTb = alignTb === 'inherit' ? alignPc : alignTb;
		const effectiveAlignSp = alignSp === 'inherit' ? effectiveAlignTb : alignSp;
		const marginsPc = getAlignMargins(alignPc);
		const marginsTb = getAlignMargins(effectiveAlignTb);
		const marginsSp = getAlignMargins(effectiveAlignSp);

		/* object-fit の継承ロジック: PC → TB → SP */
		const effectiveObjFitTb = objectFitTb === 'inherit' ? objectFitPc : objectFitTb;
		const effectiveObjFitSp = objectFitSp === 'inherit' ? effectiveObjFitTb : objectFitSp;

		const blockProps = useBlockProps({
			className: 'lw-pr-image-0',
			style: {
				'--image-0-max-w-pc': toMaxWidthValue(maxWidthPc),
				'--image-0-max-w-tb': toMaxWidthValue(effectiveMaxWidthTb),
				'--image-0-max-w-sp': toMaxWidthValue(effectiveMaxWidthSp),
				'--image-0-radius-pc': `${imgBorderRadiusPc}px`,
				'--image-0-radius-tb': `${effectiveRadiusTb}px`,
				'--image-0-radius-sp': `${effectiveRadiusSp}px`,
				'--image-0-rotate-pc': `${rotatePc}deg`,
				'--image-0-rotate-tb': `${effectiveRotateTb}deg`,
				'--image-0-rotate-sp': `${effectiveRotateSp}deg`,
				'--image-0-filter': getFilterStyle(imageEffect),
				'--image-0-ml-pc': marginsPc.ml,
				'--image-0-mr-pc': marginsPc.mr,
				'--image-0-ml-tb': marginsTb.ml,
				'--image-0-mr-tb': marginsTb.mr,
				'--image-0-ml-sp': marginsSp.ml,
				'--image-0-mr-sp': marginsSp.mr,
				'--image-0-fit-pc': objectFitPc,
				'--image-0-fit-tb': effectiveObjFitTb,
				'--image-0-fit-sp': effectiveObjFitSp,
			},
		});

		const wrapStyle = {
			aspectRatio: `${aspectRatioW} / ${aspectRatioH}`,
		};

		return (
			<>
				{/* ------- サイドバー ------- */}
				<InspectorControls>

					{/* 画像設定 */}
					<PanelBody title="画像設定" initialOpen={true}>
						<MediaUpload
							onSelect={(media) => setAttributes({ image: media.url, alt: media.alt || '' })}
							allowedTypes={['image']}
							value={image}
							render={({ open }) => (
								<>
									{image && (
										<>
											<img
												src={image}
												alt={alt || '選択した画像'}
												style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
											/>
											<Button
												onClick={() => setAttributes({ image: '', alt: '' })}
												variant="secondary"
												style={{ margin: '4px 4px 0 0' }}
											>
												画像を削除
											</Button>
										</>
									)}
									<Button onClick={open} variant="secondary">
										画像を選択
									</Button>
								</>
							)}
						/>
						<br /><br />
						<TextControl
							label="代替テキスト (alt)"
							value={alt}
							onChange={(v) => setAttributes({ alt: v })}
						/>
					</PanelBody>

					{/* レイアウト */}
					<PanelBody title="レイアウト" initialOpen={false}>
						<RangeControl
							label={`最大幅 - PC : ${maxWidthPc === 0 ? '100%' : maxWidthPc + 'px'}`}
							value={maxWidthPc}
							onChange={(v) => setAttributes({ maxWidthPc: v })}
							min={0}
							max={1200}
							step={10}
							help="0 = 100%"
						/>
						<RangeControl
							label={`最大幅 - タブレット : ${maxWidthTb === 0 ? '継承(' + toMaxWidthValue(maxWidthPc) + ')' : maxWidthTb + 'px'}`}
							value={maxWidthTb}
							onChange={(v) => setAttributes({ maxWidthTb: v })}
							min={0}
							max={1200}
							step={10}
							help="0 = PCの値を継承"
						/>
						<RangeControl
							label={`最大幅 - スマホ : ${maxWidthSp === 0 ? '継承(' + toMaxWidthValue(effectiveMaxWidthTb) + ')' : maxWidthSp + 'px'}`}
							value={maxWidthSp}
							onChange={(v) => setAttributes({ maxWidthSp: v })}
							min={0}
							max={1200}
							step={10}
							help="0 = タブレットの値を継承"
						/>
						<SelectControl
							label="配置 - PC"
							value={alignPc}
							options={alignOptionsPc}
							onChange={(v) => setAttributes({ alignPc: v })}
						/>
						<SelectControl
							label={`配置 - タブレット${alignTb === 'inherit' ? ' (継承)' : ''}`}
							value={alignTb}
							options={alignOptionsTbSp}
							onChange={(v) => setAttributes({ alignTb: v })}
						/>
						<SelectControl
							label={`配置 - スマホ${alignSp === 'inherit' ? ' (継承)' : ''}`}
							value={alignSp}
							options={alignOptionsTbSp}
							onChange={(v) => setAttributes({ alignSp: v })}
						/>
						<SelectControl
							label="フィット - PC"
							value={objectFitPc}
							options={objectFitOptionsPc}
							onChange={(v) => setAttributes({ objectFitPc: v })}
						/>
						<SelectControl
							label={`フィット - タブレット${objectFitTb === 'inherit' ? ' (継承)' : ''}`}
							value={objectFitTb}
							options={objectFitOptionsTbSp}
							onChange={(v) => setAttributes({ objectFitTb: v })}
						/>
						<SelectControl
							label={`フィット - スマホ${objectFitSp === 'inherit' ? ' (継承)' : ''}`}
							value={objectFitSp}
							options={objectFitOptionsTbSp}
							onChange={(v) => setAttributes({ objectFitSp: v })}
						/>
						<RangeControl
							label={`比率 - 横 : ${aspectRatioW}`}
							value={aspectRatioW}
							onChange={(v) => setAttributes({ aspectRatioW: v })}
							min={100}
							max={1200}
							step={10}
							help={`aspect-ratio: ${aspectRatioW} / ${aspectRatioH}`}
						/>
						<RangeControl
							label={`比率 - 縦 : ${aspectRatioH}`}
							value={aspectRatioH}
							onChange={(v) => setAttributes({ aspectRatioH: v })}
							min={100}
							max={1200}
							step={10}
							help={`aspect-ratio: ${aspectRatioW} / ${aspectRatioH}`}
						/>
						<RangeControl
							label={`角丸 - PC : ${imgBorderRadiusPc}px`}
							value={imgBorderRadiusPc}
							onChange={(v) => setAttributes({ imgBorderRadiusPc: v })}
							min={0}
							max={100}
							step={1}
						/>
						<RangeControl
							label={`角丸 - タブレット : ${imgBorderRadiusTb === 0 ? '継承(' + imgBorderRadiusPc + 'px)' : imgBorderRadiusTb + 'px'}`}
							value={imgBorderRadiusTb}
							onChange={(v) => setAttributes({ imgBorderRadiusTb: v })}
							min={0}
							max={100}
							step={1}
							help="0 = PCの値を継承"
						/>
						<RangeControl
							label={`角丸 - スマホ : ${imgBorderRadiusSp === 0 ? '継承(' + effectiveRadiusTb + 'px)' : imgBorderRadiusSp + 'px'}`}
							value={imgBorderRadiusSp}
							onChange={(v) => setAttributes({ imgBorderRadiusSp: v })}
							min={0}
							max={100}
							step={1}
							help="0 = タブレットの値を継承"
						/>
						<RangeControl
							label={`角度 - PC : ${rotatePc}deg`}
							value={rotatePc}
							onChange={(v) => setAttributes({ rotatePc: v })}
							min={-180}
							max={180}
							step={1}
						/>
						<ToggleControl
							label="タブレットでPCの角度を継承"
							checked={rotateInheritTb}
							onChange={(v) => setAttributes({ rotateInheritTb: v })}
						/>
						{!rotateInheritTb && (
							<RangeControl
								label={`角度 - タブレット : ${rotateTb}deg`}
								value={rotateTb}
								onChange={(v) => setAttributes({ rotateTb: v })}
								min={-180}
								max={180}
								step={1}
							/>
						)}
						<ToggleControl
							label="スマホでタブレットの角度を継承"
							checked={rotateInheritSp}
							onChange={(v) => setAttributes({ rotateInheritSp: v })}
						/>
						{!rotateInheritSp && (
							<RangeControl
								label={`角度 - スマホ : ${rotateSp}deg`}
								value={rotateSp}
								onChange={(v) => setAttributes({ rotateSp: v })}
								min={-180}
								max={180}
								step={1}
							/>
						)}
					</PanelBody>

					{/* エフェクト設定 */}
					<PanelBody title="エフェクト" initialOpen={false}>
						<SelectControl
							label="画像エフェクト"
							value={imageEffect}
							options={effectOptions}
							onChange={(v) => setAttributes({ imageEffect: v })}
						/>
						{imageEffect === 'grayscale' && (
							<RangeControl
								label={`グレースケール : ${effectGrayscale}%`}
								value={effectGrayscale}
								onChange={(v) => setAttributes({ effectGrayscale: v })}
								min={0}
								max={100}
								step={1}
							/>
						)}
						{imageEffect === 'sepia' && (
							<RangeControl
								label={`セピア : ${effectSepia}%`}
								value={effectSepia}
								onChange={(v) => setAttributes({ effectSepia: v })}
								min={0}
								max={100}
								step={1}
							/>
						)}
						{imageEffect === 'blur' && (
							<RangeControl
								label={`ぼかし : ${effectBlur}px`}
								value={effectBlur}
								onChange={(v) => setAttributes({ effectBlur: v })}
								min={0}
								max={20}
								step={0.5}
							/>
						)}
						{imageEffect === 'brightness' && (
							<RangeControl
								label={`明るさ : ${effectBrightness}%`}
								value={effectBrightness}
								onChange={(v) => setAttributes({ effectBrightness: v })}
								min={0}
								max={300}
								step={5}
								help="100% = 通常、100%未満 = 暗く、100%超 = 明るく"
							/>
						)}
						{imageEffect === 'contrast' && (
							<RangeControl
								label={`コントラスト : ${effectContrast}%`}
								value={effectContrast}
								onChange={(v) => setAttributes({ effectContrast: v })}
								min={0}
								max={300}
								step={5}
								help="100% = 通常"
							/>
						)}
						{imageEffect === 'saturate' && (
							<RangeControl
								label={`彩度 : ${effectSaturate}%`}
								value={effectSaturate}
								onChange={(v) => setAttributes({ effectSaturate: v })}
								min={0}
								max={300}
								step={5}
								help="100% = 通常、0% = グレースケール"
							/>
						)}
						{imageEffect === 'hue-rotate' && (
							<RangeControl
								label={`色相回転 : ${effectHueRotate}deg`}
								value={effectHueRotate}
								onChange={(v) => setAttributes({ effectHueRotate: v })}
								min={0}
								max={360}
								step={5}
							/>
						)}
						{imageEffect === 'invert' && (
							<RangeControl
								label={`反転 : ${effectInvert}%`}
								value={effectInvert}
								onChange={(v) => setAttributes({ effectInvert: v })}
								min={0}
								max={100}
								step={1}
							/>
						)}
						{imageEffect === 'opacity' && (
							<RangeControl
								label={`透明度 : ${effectOpacity}%`}
								value={effectOpacity}
								onChange={(v) => setAttributes({ effectOpacity: v })}
								min={0}
								max={100}
								step={1}
								help="100% = 不透明、0% = 完全に透明"
							/>
						)}
					</PanelBody>

					{/* リンク設定 */}
					<PanelBody title="リンク設定" initialOpen={false}>
						<TextControl
							label="リンク URL"
							value={linkUrl}
							onChange={(v) => setAttributes({ linkUrl: v })}
							placeholder="https://example.com/"
						/>
						<ToggleControl
							label="新規タブで開く"
							checked={linkOpenNewTab}
							onChange={(v) => setAttributes({ linkOpenNewTab: v })}
							disabled={!linkUrl}
						/>
						{!linkUrl && <p style={{fontSize:'12px',opacity:.7}}>※URLを入力すると設定できます</p>}
					</PanelBody>

				</InspectorControls>

				{/* ------- エディター表示 ------- */}
				<div {...blockProps}>
					<div className="custom_wrap" style={wrapStyle}>
						{image && <img src={image} alt={alt} />}
					</div>
				</div>
			</>
		);
	},

	/* ============================ SAVE ============================ */
	save({ attributes }) {
		const {
			image = '', alt = '',
			maxWidthPc = 0, maxWidthTb = 0, maxWidthSp = 0,
			aspectRatioW = 600, aspectRatioH = 400,
			imgBorderRadiusPc = 0, imgBorderRadiusTb = 0, imgBorderRadiusSp = 0,
			rotatePc = 0, rotateTb = 0, rotateSp = 0,
			rotateInheritTb = true, rotateInheritSp = true,
			imageEffect = 'none',
			effectGrayscale = 100, effectSepia = 100, effectBlur = 3,
			effectBrightness = 130, effectContrast = 150, effectSaturate = 200,
			effectInvert = 100, effectHueRotate = 180, effectOpacity = 50,
			linkUrl = '', linkOpenNewTab = false,
			alignPc = 'center', alignTb = 'inherit', alignSp = 'inherit',
			objectFitPc = 'cover', objectFitTb = 'inherit', objectFitSp = 'inherit',
		} = attributes;

		/* エフェクトをCSSフィルターに変換 */
		const getFilterStyle = (effect) => {
			switch (effect) {
				case 'grayscale': return `grayscale(${effectGrayscale}%)`;
				case 'sepia': return `sepia(${effectSepia}%)`;
				case 'blur': return `blur(${effectBlur}px)`;
				case 'brightness': return `brightness(${effectBrightness}%)`;
				case 'contrast': return `contrast(${effectContrast}%)`;
				case 'saturate': return `saturate(${effectSaturate}%)`;
				case 'hue-rotate': return `hue-rotate(${effectHueRotate}deg)`;
				case 'invert': return `invert(${effectInvert}%)`;
				case 'opacity': return `opacity(${effectOpacity}%)`;
				default: return 'none';
			}
		};

		/* 数値を CSS 値に変換 (0 = 100%, それ以外 = px) */
		const toMaxWidthValue = (v) => (v === 0 ? '100%' : `${v}px`);

		/* 継承ロジック: PC → TB → SP (0は継承) */
		const effectiveMaxWidthTb = maxWidthTb === 0 ? maxWidthPc : maxWidthTb;
		const effectiveMaxWidthSp = maxWidthSp === 0 ? effectiveMaxWidthTb : maxWidthSp;

		/* 角丸の継承ロジック: PC → TB → SP (0は継承) */
		const effectiveRadiusTb = imgBorderRadiusTb === 0 ? imgBorderRadiusPc : imgBorderRadiusTb;
		const effectiveRadiusSp = imgBorderRadiusSp === 0 ? effectiveRadiusTb : imgBorderRadiusSp;

		/* 角度の継承ロジック: PC → TB → SP (トグルで継承) */
		const effectiveRotateTb = rotateInheritTb ? rotatePc : rotateTb;
		const effectiveRotateSp = rotateInheritSp ? effectiveRotateTb : rotateSp;

		/* 配置の継承ロジック: PC → TB → SP */
		const effectiveAlignTb = alignTb === 'inherit' ? alignPc : alignTb;
		const effectiveAlignSp = alignSp === 'inherit' ? effectiveAlignTb : alignSp;
		const marginsPc = getAlignMargins(alignPc);
		const marginsTb = getAlignMargins(effectiveAlignTb);
		const marginsSp = getAlignMargins(effectiveAlignSp);

		/* object-fit の継承ロジック: PC → TB → SP */
		const effectiveObjFitTb = objectFitTb === 'inherit' ? objectFitPc : objectFitTb;
		const effectiveObjFitSp = objectFitSp === 'inherit' ? effectiveObjFitTb : objectFitSp;

		const blockProps = useBlockProps.save({
			className: 'lw-pr-image-0',
			style: {
				'--image-0-max-w-pc': toMaxWidthValue(maxWidthPc),
				'--image-0-max-w-tb': toMaxWidthValue(effectiveMaxWidthTb),
				'--image-0-max-w-sp': toMaxWidthValue(effectiveMaxWidthSp),
				'--image-0-radius-pc': `${imgBorderRadiusPc}px`,
				'--image-0-radius-tb': `${effectiveRadiusTb}px`,
				'--image-0-radius-sp': `${effectiveRadiusSp}px`,
				'--image-0-rotate-pc': `${rotatePc}deg`,
				'--image-0-rotate-tb': `${effectiveRotateTb}deg`,
				'--image-0-rotate-sp': `${effectiveRotateSp}deg`,
				'--image-0-filter': getFilterStyle(imageEffect),
				'--image-0-ml-pc': marginsPc.ml,
				'--image-0-mr-pc': marginsPc.mr,
				'--image-0-ml-tb': marginsTb.ml,
				'--image-0-mr-tb': marginsTb.mr,
				'--image-0-ml-sp': marginsSp.ml,
				'--image-0-mr-sp': marginsSp.mr,
				'--image-0-fit-pc': objectFitPc,
				'--image-0-fit-tb': effectiveObjFitTb,
				'--image-0-fit-sp': effectiveObjFitSp,
			},
		});

		const wrapStyle = {
			aspectRatio: `${aspectRatioW} / ${aspectRatioH}`,
		};

		const imgElement = image ? <img src={image} alt={alt} /> : null;

		return (
			<div {...blockProps}>
				{linkUrl ? (
					<a
						href={linkUrl}
						className="custom_wrap"
						style={wrapStyle}
						target={linkOpenNewTab ? '_blank' : undefined}
						rel={linkOpenNewTab ? 'noopener noreferrer' : undefined}
					>
						{imgElement}
					</a>
				) : (
					<div className="custom_wrap" style={wrapStyle}>
						{imgElement}
					</div>
				)}
			</div>
		);
	},
});
