/**
 * LiteWord – グラデーションテキスト 01
 * src/lw-pr-text-1/index.js
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, BlockControls, InspectorControls } from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	SelectControl,
	ColorPalette,
	RangeControl,
	Button,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';

import './style.scss';
import './editor.scss';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();

// グラデーションプリセット
const gradientPresets = [
	{
		label: 'ブルー系',
		value: 'preset-blue',
	},
	{
		label: 'ブルー→シアン',
		value: 'preset-blue-cyan',
	},
	{
		label: 'ブルー→パープル',
		value: 'preset-blue-purple',
	},
	{
		label: 'レインボー',
		value: 'preset-rainbow',
	},
	{
		label: 'サンセット',
		value: 'preset-sunset',
	},
	{
		label: 'オレンジ→ピンク',
		value: 'preset-orange-pink',
	},
	{
		label: 'グリーン系',
		value: 'preset-green',
	},
	{
		label: 'グリーン→ブルー',
		value: 'preset-green-blue',
	},
	{
		label: 'エメラルド',
		value: 'preset-emerald',
	},
	{
		label: 'パープル系',
		value: 'preset-purple',
	},
	{
		label: 'パープル→ピンク',
		value: 'preset-purple-pink',
	},
	{
		label: 'マゼンタ',
		value: 'preset-magenta',
	},
	{
		label: 'ゴールド系',
		value: 'preset-gold',
	},
	{
		label: 'ゴールド→オレンジ',
		value: 'preset-gold-orange',
	},
	{
		label: 'ゴールド→ブロンズ',
		value: 'preset-gold-bronze',
	},
	{
		label: 'シャンパンゴールド',
		value: 'preset-champagne-gold',
	},
	{
		label: 'シルバー',
		value: 'preset-silver',
	},
	{
		label: 'ローズゴールド',
		value: 'preset-rose-gold',
	},
	{
		label: 'レッド系',
		value: 'preset-red',
	},
	{
		label: 'ファイア',
		value: 'preset-fire',
	},
	{
		label: 'カスタム',
		value: 'custom',
	},
];

// プリセットの実際の色定義
const presetGradients = {
	'preset-blue': {
		color1: '#3b82f6',
		color2: '#06b6d4',
		color3: '#3b82f6',
		angle: '270',
	},
	'preset-blue-cyan': {
		color1: '#1e40af',
		color2: '#06b6d4',
		color3: '#0891b2',
		angle: '90',
	},
	'preset-blue-purple': {
		color1: '#3b82f6',
		color2: '#8b5cf6',
		color3: '#6366f1',
		angle: '90',
	},
	'preset-rainbow': {
		color1: '#3b82f6',
		color2: '#8b5cf6',
		color3: '#ec4899',
		angle: '90',
	},
	'preset-sunset': {
		color1: '#f59e0b',
		color2: '#ef4444',
		color3: '#ec4899',
		angle: '90',
	},
	'preset-orange-pink': {
		color1: '#fb923c',
		color2: '#f97316',
		color3: '#ec4899',
		angle: '90',
	},
	'preset-green': {
		color1: '#10b981',
		color2: '#06b6d4',
		color3: '#10b981',
		angle: '90',
	},
	'preset-green-blue': {
		color1: '#059669',
		color2: '#14b8a6',
		color3: '#0ea5e9',
		angle: '90',
	},
	'preset-emerald': {
		color1: '#10b981',
		color2: '#34d399',
		color3: '#6ee7b7',
		angle: '90',
	},
	'preset-purple': {
		color1: '#8b5cf6',
		color2: '#ec4899',
		color3: '#8b5cf6',
		angle: '90',
	},
	'preset-purple-pink': {
		color1: '#a855f7',
		color2: '#d946ef',
		color3: '#ec4899',
		angle: '90',
	},
	'preset-magenta': {
		color1: '#c026d3',
		color2: '#e879f9',
		color3: '#f0abfc',
		angle: '90',
	},
	'preset-gold': {
		color1: '#f59e0b',
		color2: '#fbbf24',
		color3: '#f59e0b',
		angle: '90',
	},
	'preset-gold-orange': {
		color1: '#fbbf24',
		color2: '#f59e0b',
		color3: '#f97316',
		angle: '90',
	},
	'preset-gold-bronze': {
		color1: '#eab308',
		color2: '#d97706',
		color3: '#b45309',
		angle: '90',
	},
	'preset-champagne-gold': {
		color1: '#fef3c7',
		color2: '#fde047',
		color3: '#facc15',
		angle: '90',
	},
	'preset-silver': {
		color1: '#cbd5e1',
		color2: '#e2e8f0',
		color3: '#f1f5f9',
		angle: '90',
	},
	'preset-rose-gold': {
		color1: '#fda4af',
		color2: '#fb7185',
		color3: '#fbbf24',
		angle: '90',
	},
	'preset-red': {
		color1: '#dc2626',
		color2: '#ef4444',
		color3: '#f87171',
		angle: '90',
	},
	'preset-fire': {
		color1: '#dc2626',
		color2: '#f97316',
		color3: '#facc15',
		angle: '90',
	},
};

// グラデーション角度オプション
const gradientAngleOptions = [
	{ label: '左から右（0deg）', value: '0' },
	{ label: '左下から右上（45deg）', value: '45' },
	{ label: '下から上（90deg）', value: '90' },
	{ label: '右下から左上（135deg）', value: '135' },
	{ label: '右から左（180deg）', value: '180' },
	{ label: '右上から左下（225deg）', value: '225' },
	{ label: '上から下（270deg）', value: '270' },
	{ label: '左上から右下（315deg）', value: '315' },
];

// アニメーションパターン
const animationPatterns = [
	{ label: '左から右へスライド', value: 'lw-pr-text-1-gradient-slide-anime-1' },
	{ label: '右から左へスライド', value: 'lw-pr-text-1-gradient-slide-anime-2' },
	{ label: '上から下へスライド', value: 'lw-pr-text-1-gradient-slide-anime-3' },
	{ label: '下から上へスライド', value: 'lw-pr-text-1-gradient-slide-anime-4' },
	{ label: 'ズーム', value: 'lw-pr-text-1-gradient-slide-anime-5' },
];

// イージングオプション
const easingOptions = [
	{ label: 'Linear（一定速度）', value: 'linear' },
	{ label: 'Ease', value: 'ease' },
	{ label: 'Ease-in', value: 'ease-in' },
	{ label: 'Ease-out', value: 'ease-out' },
	{ label: 'Ease-in-out', value: 'ease-in-out' },
];

// テキスト配置オプション
const textAlignOptions = [
	{ label: '左揃え', value: 'left' },
	{ label: '中央揃え', value: 'center' },
	{ label: '右揃え', value: 'right' },
];

registerBlockType('wdl/lw-pr-text-1', {
	/* ----------------------------------------------------------
	 * 基本情報
	 * -------------------------------------------------------- */
	title: 'グラデーションテキスト 01',
	icon: 'admin-customizer',
	category: 'liteword-other',
	supports: { anchor: true },

	/* ----------------------------------------------------------
	 * 属性
	 * -------------------------------------------------------- */
	attributes: {
		text: {
			type: 'string',
			default: 'SLIDE ANIMATION',
		},
		tagName: {
			type: 'string',
			default: 'h2',
		},
		// テキスト配置設定
		textAlignPc: {
			type: 'string',
			default: 'left',
		},
		textAlignSp: {
			type: 'string',
			default: '',
		},
		// フォント設定
		fontSet: {
			type: 'string',
			default: '',
		},
		fontWeight: {
			type: 'string',
			default: '',
		},
		// フォントサイズ設定
		fontSizePc: {
			type: 'number',
			default: 1,
		},
		fontSizeTab: {
			type: 'number',
			default: null,
		},
		fontSizeSp: {
			type: 'number',
			default: null,
		},
		// 行間設定
		lineHeightPc: {
			type: 'number',
			default: 1.5,
		},
		lineHeightTab: {
			type: 'number',
			default: null,
		},
		lineHeightSp: {
			type: 'number',
			default: null,
		},
		// グラデーション設定
		gradientPreset: {
			type: 'string',
			default: 'preset-blue',
		},
		// カスタムグラデーション色設定
		gradientColor1: {
			type: 'string',
			default: '#3b82f6',
		},
		gradientColor2: {
			type: 'string',
			default: '#06b6d4',
		},
		gradientColor3: {
			type: 'string',
			default: '#3b82f6',
		},
		gradientAngle: {
			type: 'string',
			default: '270',
		},
		// アニメーション設定
		animationPattern: {
			type: 'string',
			default: 'lw-pr-text-1-gradient-slide-anime-1',
		},
		animationTime: {
			type: 'number',
			default: 3,
		},
		animationEasing: {
			type: 'string',
			default: 'linear',
		},
	},

	/* ----------------------------------------------------------
	 * 編集画面
	 * -------------------------------------------------------- */
	edit: ({ attributes, setAttributes }) => {
		const {
			text,
			tagName,
			textAlignPc,
			textAlignSp,
			fontSet,
			fontWeight,
			fontSizePc,
			fontSizeTab,
			fontSizeSp,
			lineHeightPc,
			lineHeightTab,
			lineHeightSp,
			gradientPreset,
			gradientColor1,
			gradientColor2,
			gradientColor3,
			gradientAngle,
			animationPattern,
			animationTime,
			animationEasing,
		} = attributes;

		// タグ名変更
		const onChangeTagName = (newTagName) => setAttributes({ tagName: newTagName });

		// プリセット変更時の処理
		const onChangeGradientPreset = (value) => {
			setAttributes({ gradientPreset: value });
			
			// プリセット選択時は対応する色を設定
			if (value !== 'custom' && presetGradients[value]) {
				const preset = presetGradients[value];
				setAttributes({
					gradientColor1: preset.color1,
					gradientColor2: preset.color2,
					gradientColor3: preset.color3,
					gradientAngle: preset.angle,
				});
			}
		};

		// グラデーション値を生成
		const getGradientValue = () => {
			const color1 = gradientColor1 || '#3b82f6';
			const color2 = gradientColor2 || '#06b6d4';
			const color3 = gradientColor3 || '#3b82f6';
			const angle = gradientAngle || '270';
			
			return `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`;
		};

		// インラインスタイルを生成
		const inlineStyle = {
			...(fontWeight && { fontWeight: fontWeight }),
			'--lw-text-align-pc': textAlignPc || 'left',
			...(textAlignSp && { '--lw-text-align-sp': textAlignSp }),
			'--lw-pr-text-1-font-size-pc': `${fontSizePc}em`,
			...(fontSizeTab !== null && { '--lw-pr-text-1-font-size-tab': `${fontSizeTab}em` }),
			...(fontSizeSp !== null && { '--lw-pr-text-1-font-size-sp': `${fontSizeSp}em` }),
			'--lw-pr-text-1-line-height-pc': lineHeightPc,
			...(lineHeightTab !== null && { '--lw-pr-text-1-line-height-tab': lineHeightTab }),
			...(lineHeightSp !== null && { '--lw-pr-text-1-line-height-sp': lineHeightSp }),
			'--lw-pr-text-1-gradient': getGradientValue(),
			'--lw-pr-text-1-gradient-anime-ptn': animationPattern,
			'--lw-pr-text-1-gradient-anime-time': `${animationTime}s`,
			'--lw-pr-text-1-gradient-anime-movement': animationEasing,
		};

		// h1〜h4の時はwp-block-headingクラスを追加
		const isHeading = ['h1', 'h2', 'h3', 'h4'].includes(tagName);

		// クラス名を生成
		const className = [
			'lw-pr-text-1',
			isHeading && 'wp-block-heading',
			'gradient-slide-anime',
		]
			.filter(Boolean)
			.join(' ');

		const TagName = tagName;

		return (
			<Fragment>
				{/* ツールバー: タグ選択 */}
				<BlockControls>
					<ToolbarGroup>
						{['h1', 'h2', 'h3', 'h4', 'p', 'span'].map((tag) => (
							<ToolbarButton
								key={tag}
								isPressed={tagName === tag}
								onClick={() => onChangeTagName(tag)}
							>
								{tag.toUpperCase()}
							</ToolbarButton>
						))}
					</ToolbarGroup>
				</BlockControls>

				{/* サイドバー: 詳細設定 */}
				<InspectorControls>
					{/* テキスト配置設定 */}
					<PanelBody title="テキスト配置設定" initialOpen={true}>
						<SelectControl
							label="テキスト配置（PC）"
							value={textAlignPc}
							options={textAlignOptions}
							onChange={(value) => setAttributes({ textAlignPc: value })}
						/>
						<SelectControl
							label="テキスト配置（SP）"
							value={textAlignSp}
							options={[
								{ label: 'PCと同じ', value: '' },
								...textAlignOptions
							]}
							onChange={(value) => setAttributes({ textAlignSp: value })}
						/>
					</PanelBody>

					{/* フォント設定 */}
					<PanelBody title="フォント設定" initialOpen={false}>
						<SelectControl
							label="フォントの種類"
							value={fontSet}
							options={fontOptions}
							onChange={(value) => setAttributes({ fontSet: value })}
						/>
						<SelectControl
							label="フォントの太さ"
							value={fontWeight}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ fontWeight: value })}
						/>
					</PanelBody>

					{/* フォントサイズ・行間設定 */}
					<PanelBody title="フォントサイズ・行間設定" initialOpen={false}>
						<p style={{ marginTop: '0', marginBottom: '8px', fontWeight: '600' }}>フォントサイズ</p>
						<RangeControl
							label="フォントサイズ（PC）"
							value={fontSizePc}
							onChange={(value) => setAttributes({ fontSizePc: value })}
							min={0.1}
							max={10}
							step={0.1}
						/>
						<RangeControl
							label="フォントサイズ（タブレット）"
							value={fontSizeTab !== null ? fontSizeTab : fontSizePc}
							onChange={(value) => setAttributes({ fontSizeTab: value })}
							min={0.1}
							max={10}
							step={0.1}
							help="PCと同じにする場合はリセットしてください"
						/>
						{fontSizeTab !== null && (
							<Button 
								isSmall 
								isDestructive
								onClick={() => setAttributes({ fontSizeTab: null })}
								style={{ marginBottom: '16px' }}
							>
								タブレット設定をリセット（PCと同じ）
							</Button>
						)}
						<RangeControl
							label="フォントサイズ（SP）"
							value={fontSizeSp !== null ? fontSizeSp : (fontSizeTab !== null ? fontSizeTab : fontSizePc)}
							onChange={(value) => setAttributes({ fontSizeSp: value })}
							min={0.1}
							max={10}
							step={0.1}
							help="タブレットと同じにする場合はリセットしてください"
						/>
						{fontSizeSp !== null && (
							<Button 
								isSmall 
								isDestructive
								onClick={() => setAttributes({ fontSizeSp: null })}
								style={{ marginBottom: '16px' }}
							>
								SP設定をリセット（タブレットと同じ）
							</Button>
						)}

						<p style={{ marginTop: '16px', marginBottom: '8px', fontWeight: '600' }}>行間</p>
						<RangeControl
							label="行間（PC）"
							value={lineHeightPc}
							onChange={(value) => setAttributes({ lineHeightPc: value })}
							min={0.5}
							max={3}
							step={0.1}
						/>
						<RangeControl
							label="行間（タブレット）"
							value={lineHeightTab !== null ? lineHeightTab : lineHeightPc}
							onChange={(value) => setAttributes({ lineHeightTab: value })}
							min={0.5}
							max={3}
							step={0.1}
							help="PCと同じにする場合はリセットしてください"
						/>
						{lineHeightTab !== null && (
							<Button 
								isSmall 
								isDestructive
								onClick={() => setAttributes({ lineHeightTab: null })}
								style={{ marginBottom: '16px' }}
							>
								タブレット設定をリセット（PCと同じ）
							</Button>
						)}
						<RangeControl
							label="行間（SP）"
							value={lineHeightSp !== null ? lineHeightSp : (lineHeightTab !== null ? lineHeightTab : lineHeightPc)}
							onChange={(value) => setAttributes({ lineHeightSp: value })}
							min={0.5}
							max={3}
							step={0.1}
							help="タブレットと同じにする場合はリセットしてください"
						/>
						{lineHeightSp !== null && (
							<Button 
								isSmall 
								isDestructive
								onClick={() => setAttributes({ lineHeightSp: null })}
								style={{ marginBottom: '16px' }}
							>
								SP設定をリセット（タブレットと同じ）
							</Button>
						)}
					</PanelBody>

					{/* グラデーション設定 */}
					<PanelBody title="グラデーション設定" initialOpen={true}>
						<SelectControl
							label="グラデーションプリセット"
							value={gradientPreset}
							options={gradientPresets}
							onChange={onChangeGradientPreset}
						/>
						
						<p style={{ marginTop: '16px', marginBottom: '8px', fontWeight: '600' }}>グラデーション色1</p>
						<ColorPalette
							value={gradientColor1}
							onChange={(color) => {
								setAttributes({ 
									gradientColor1: color || '#3b82f6',
									gradientPreset: 'custom'
								});
							}}
						/>
						
						<p style={{ marginTop: '16px', marginBottom: '8px', fontWeight: '600' }}>グラデーション色2</p>
						<ColorPalette
							value={gradientColor2}
							onChange={(color) => {
								setAttributes({ 
									gradientColor2: color || '#06b6d4',
									gradientPreset: 'custom'
								});
							}}
						/>
						
						<p style={{ marginTop: '16px', marginBottom: '8px', fontWeight: '600' }}>グラデーション色3</p>
						<ColorPalette
							value={gradientColor3}
							onChange={(color) => {
								setAttributes({ 
									gradientColor3: color || '#3b82f6',
									gradientPreset: 'custom'
								});
							}}
						/>
						
						<SelectControl
							label="グラデーション角度"
							value={gradientAngle}
							options={gradientAngleOptions}
							onChange={(value) => {
								setAttributes({ 
									gradientAngle: value,
									gradientPreset: 'custom'
								});
							}}
						/>
					</PanelBody>

					{/* アニメーション設定 */}
					<PanelBody title="アニメーション設定" initialOpen={false}>
						<SelectControl
							label="アニメーションパターン"
							value={animationPattern}
							options={animationPatterns}
							onChange={(value) => setAttributes({ animationPattern: value })}
						/>
						<RangeControl
							label="アニメーション時間（秒）"
							value={animationTime}
							onChange={(value) => setAttributes({ animationTime: value })}
							min={0.5}
							max={10}
							step={0.5}
						/>
						<SelectControl
							label="イージング"
							value={animationEasing}
							options={easingOptions}
							onChange={(value) => setAttributes({ animationEasing: value })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* プレビュー */}
				<TagName 
					className={className} 
					style={inlineStyle}
					data-lw_font_set={fontSet}
				>
					<RichText
						tagName="span"
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						placeholder="テキストを入力"
					/>
				</TagName>
			</Fragment>
		);
	},

	/* ----------------------------------------------------------
	 * フロント出力
	 * -------------------------------------------------------- */
	save: ({ attributes }) => {
		const {
			text,
			tagName,
			textAlignPc,
			textAlignSp,
			fontSet,
			fontWeight,
			fontSizePc,
			fontSizeTab,
			fontSizeSp,
			lineHeightPc,
			lineHeightTab,
			lineHeightSp,
			gradientColor1,
			gradientColor2,
			gradientColor3,
			gradientAngle,
			animationPattern,
			animationTime,
			animationEasing,
		} = attributes;

		// グラデーション値を生成
		const getGradientValue = () => {
			const color1 = gradientColor1 || '#3b82f6';
			const color2 = gradientColor2 || '#06b6d4';
			const color3 = gradientColor3 || '#3b82f6';
			const angle = gradientAngle || '270';
			
			return `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`;
		};

		// インラインスタイルを生成
		const inlineStyle = {
			...(fontWeight && { fontWeight: fontWeight }),
			'--lw-text-align-pc': textAlignPc || 'left',
			...(textAlignSp && { '--lw-text-align-sp': textAlignSp }),
			'--lw-pr-text-1-font-size-pc': `${fontSizePc}em`,
			...(fontSizeTab !== null && { '--lw-pr-text-1-font-size-tab': `${fontSizeTab}em` }),
			...(fontSizeSp !== null && { '--lw-pr-text-1-font-size-sp': `${fontSizeSp}em` }),
			'--lw-pr-text-1-line-height-pc': lineHeightPc,
			...(lineHeightTab !== null && { '--lw-pr-text-1-line-height-tab': lineHeightTab }),
			...(lineHeightSp !== null && { '--lw-pr-text-1-line-height-sp': lineHeightSp }),
			'--lw-pr-text-1-gradient': getGradientValue(),
			'--lw-pr-text-1-gradient-anime-ptn': animationPattern,
			'--lw-pr-text-1-gradient-anime-time': `${animationTime}s`,
			'--lw-pr-text-1-gradient-anime-movement': animationEasing,
		};

		// h1〜h4の時はwp-block-headingクラスを追加
		const isHeading = ['h1', 'h2', 'h3', 'h4'].includes(tagName);

		// クラス名を生成
		const className = [
			'lw-pr-text-1',
			isHeading && 'wp-block-heading',
			'gradient-slide-anime',
		]
			.filter(Boolean)
			.join(' ');

		const TagName = tagName;

		return (
			<TagName 
				className={className} 
				style={inlineStyle}
				data-lw_font_set={fontSet}
			>
				<RichText.Content tagName="span" value={text} />
			</TagName>
		);
	},
});