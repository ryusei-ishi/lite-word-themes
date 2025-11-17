import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	RichText,
	URLInput
} from '@wordpress/block-editor';
import {
	PanelBody,
	ButtonGroup,
	Button,
	RangeControl,
	ToggleControl
} from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/lw-button-01', {
	title: 'リンクボタン 01',
	icon: 'button',
	category: 'liteword-buttons',
	supports: { anchor: true },

	/* ---------- 属性 ---------- */
	attributes: {
		buttonText: {
			type: 'string',
			source: 'html',
			selector: 'a',
			default: '詳細はこちら',
		},
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'a',
			attribute: 'href',
			default: '',
		},
		openInNewTab: { type: 'boolean', default: false },
		fontSize:     { type: 'number',  default: 100 },
		maxWidth:     { type: 'number',  default: 240 },
		maxWidthSp:   { type: 'number',  default: null }, // ★追加
		backgroundColor: { type: 'string', default: 'var(--color-main)' },
		textColor:       { type: 'string', default: '#ffffff' },
		paddingSize:     { type: 'string', default: 'M' },
		innerPaddingSize:{ type: 'string', default: 'M' },
		marginTop:    { type: 'number',  default: 10 },
		marginBottom: { type: 'number',  default: 10 },
		alignment:    { type: 'string',  default: 'center' },   // 601px 以上
		alignmentSp:  { type: 'string',  default: 'center' },   // 600px 以下
		borderRadius: { type: 'number',  default: 0 },
		borderWidth:  { type: 'number',  default: 0 },
		borderColor:  { type: 'string',  default: '#000000' },
	},


	/* ---------- 編集 ---------- */
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const {
			buttonText, url, openInNewTab,
			fontSize, maxWidth, maxWidthSp,
			backgroundColor, textColor,
			paddingSize, innerPaddingSize,
			marginTop, marginBottom,
			alignment, alignmentSp,
			borderRadius, borderWidth, borderColor,
		} = attributes;

		/* ===== サイドバー ===== */
		const sidebar = wp.element.createElement(
			InspectorControls,
			{ key: 'controls' },
			
			/* ── 1. 基本設定 ── */
			wp.element.createElement(
				PanelBody, { title: '📝 基本設定', initialOpen: true },
				wp.element.createElement('div', {
					style: { marginBottom: '15px' }
				},
					wp.element.createElement('p', {
						style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }
					}, '🔗 リンク先URL'),
					wp.element.createElement(URLInput, {
						value: url,
						onChange: (v) => setAttributes({ url: v }),
						style: { width: '100%' },
						help: 'ボタンをクリックした時の移動先URLを入力してください'
					})
				),
				wp.element.createElement(ToggleControl, {
					label: '新しいタブで開く',
					checked: openInNewTab,
					onChange: () => setAttributes({ openInNewTab: !openInNewTab }),
					help: 'リンク先を新しいタブで開きたい場合はオンにしてください'
				})
			),

			/* ── 2. ボタンのサイズと形 ── */
			wp.element.createElement(
				PanelBody, { title: '📏 ボタンのサイズと形', initialOpen: false },
				wp.element.createElement('div', {
					style: { marginBottom: '20px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '📐 ボタンの横幅 (px)'),
					wp.element.createElement(RangeControl, {
						value: maxWidth,
						onChange: (v) => setAttributes({ maxWidth: v }),
						min: 100, max: 1000,
						help: 'ボタンの最大横幅を設定します（パソコン・タブレット）'
					})
				),
				// ★スマホ用max-width追加
				wp.element.createElement('div', {
					style: { marginBottom: '20px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '📱 スマホでのボタンの横幅 (px)'),
					wp.element.createElement(RangeControl, {
						value: maxWidthSp !== null ? maxWidthSp : maxWidth,
						onChange: (v) => setAttributes({ maxWidthSp: v }),
						min: 100, max: 1000,
						help: 'スマートフォンで見た時のボタンの最大横幅を設定します'
					})
				),
				wp.element.createElement('div', {
					style: { marginBottom: '20px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '🎪 角の丸み (px)'),
					wp.element.createElement(RangeControl, {
						value: borderRadius,
						onChange: (v) => setAttributes({ borderRadius: v }),
						min: 0, max: 100,
						help: '数値が大きいほど角が丸くなります。0で四角、50以上で丸いボタンになります'
					})
				),
				wp.element.createElement('div', {
					style: { marginBottom: '20px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '📏 文字のサイズ (%)'),
					wp.element.createElement(RangeControl, {
						value: fontSize,
						onChange: (v) => setAttributes({ fontSize: v }),
						min: 85, max: 160,
						help: '100%が標準サイズです'
					})
				),
				wp.element.createElement('div', null,
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '12px' }
					}, '📦 ボタン内の余白'),
					wp.element.createElement(
						ButtonGroup, null,
						['S', 'M', 'L'].map((size) =>
							wp.element.createElement(Button, {
								isPrimary: innerPaddingSize === size,
								onClick: () => setAttributes({ innerPaddingSize: size }),
							}, size === 'S' ? '小さめ' : size === 'M' ? '標準' : '大きめ')
						)
					),
					wp.element.createElement('p', {
						style: { fontSize: '12px', color: '#666', marginTop: '8px' }
					}, 'ボタン内の文字周りの余白サイズを選択してください')
				)
			),

			/* ── 3. 色の設定 ── */
			wp.element.createElement(
				PanelBody, { title: '🎨 色の設定', initialOpen: false },
				wp.element.createElement('div', {
					style: { marginBottom: '20px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '🌈 ボタンの背景色'),
					wp.element.createElement('input', {
						type: 'color',
						value: backgroundColor,
						onChange: (e) => setAttributes({ backgroundColor: e.target.value }),
						style: { width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ddd' }
					})
				),
				wp.element.createElement('div', {
					style: { marginBottom: '15px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '📝 文字の色'),
					wp.element.createElement('input', {
						type: 'color',
						value: textColor,
						onChange: (e) => setAttributes({ textColor: e.target.value }),
						style: { width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ddd' }
					})
				)
			),

			/* ── 4. ボタンの配置 ── */
			wp.element.createElement(
				PanelBody, { title: '📍 ボタンの配置', initialOpen: false },
				wp.element.createElement('div', {
					style: { marginBottom: '20px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '12px' }
					}, '🖥️ パソコン・タブレットでの位置'),
					wp.element.createElement(
						ButtonGroup, null,
						[
							{ label: '左寄せ', value: 'flex-start' },
							{ label: '中央', value: 'center' },
							{ label: '右寄せ', value: 'flex-end' },
						].map((opt) =>
							wp.element.createElement(Button, {
								isPrimary: alignment === opt.value,
								onClick: () => setAttributes({ alignment: opt.value }),
							}, opt.label)
						)
					),
					wp.element.createElement('p', {
						style: { fontSize: '12px', color: '#666', marginTop: '8px' }
					}, 'パソコンやタブレットで見た時のボタンの位置を選択してください')
				),
				wp.element.createElement('div', null,
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '12px' }
					}, '📱 スマートフォンでの位置'),
					wp.element.createElement(
						ButtonGroup, null,
						[
							{ label: '左寄せ', value: 'flex-start' },
							{ label: '中央', value: 'center' },
							{ label: '右寄せ', value: 'flex-end' },
						].map((opt) =>
							wp.element.createElement(Button, {
								isPrimary: alignmentSp === opt.value,
								onClick: () => setAttributes({ alignmentSp: opt.value }),
							}, opt.label)
						)
					),
					wp.element.createElement('p', {
						style: { fontSize: '12px', color: '#666', marginTop: '8px' }
					}, 'スマートフォンで見た時のボタンの位置を選択してください')
				)
			),

			/* ── 5. 余白の設定 ── */
			wp.element.createElement(
				PanelBody, { title: '📐 余白の設定', initialOpen: false },
				wp.element.createElement('div', {
					style: { marginBottom: '15px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '⬆️ ボタンの上の余白 (px)'),
					wp.element.createElement(RangeControl, {
						value: marginTop,
						onChange: (v) => setAttributes({ marginTop: v }),
						min: 0, max: 100,
						help: 'ボタンの上にどれくらい余白を空けるかを設定します'
					})
				),
				wp.element.createElement('div', null,
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '⬇️ ボタンの下の余白 (px)'),
					wp.element.createElement(RangeControl, {
						value: marginBottom,
						onChange: (v) => setAttributes({ marginBottom: v }),
						min: 0, max: 100,
						help: 'ボタンの下にどれくらい余白を空けるかを設定します'
					})
				)
			),

			/* ── 6. 枠線の設定 ── */
			wp.element.createElement(
				PanelBody, { title: '🖍️ 枠線の設定', initialOpen: false },
				wp.element.createElement('div', {
					style: { marginBottom: borderWidth > 0 ? '15px' : '0px' }
				},
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '📏 枠線の太さ (px)'),
					wp.element.createElement(RangeControl, {
						value: borderWidth,
						onChange: (v) => setAttributes({ borderWidth: v }),
						min: 0, max: 20,
						help: '0にすると枠線が表示されません'
					})
				),
				borderWidth > 0 && wp.element.createElement('div', null,
					wp.element.createElement('label', {
						style: { fontWeight: 'bold', display: 'block', marginBottom: '8px' }
					}, '🎨 枠線の色'),
					wp.element.createElement('input', {
						type: 'color',
						value: borderColor,
						onChange: (e) => setAttributes({ borderColor: e.target.value }),
						style: { width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ddd' }
					})
				)
			)
		);

		/* ===== プレビュー ===== */
		const containerClass =
			`wp-block-wdl-button-01 padding-${paddingSize}` +
			` align-${alignment} align-sp-${alignmentSp}`;

		// ★スマホ用max-widthの値を決定
		const effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;

		return [
			sidebar,
			wp.element.createElement(
				'div',
				{
					key: 'content',
					className: containerClass,
					style: {
						marginTop:    `${marginTop}px`,
						marginBottom: `${marginBottom}px`,
						'--button-01-max-width-sp': `${effectiveMaxWidthSp}px`, // ★追加
					},
				},
				wp.element.createElement(RichText, {
					tagName: 'a',
					href: url,
					target: openInNewTab ? '_blank' : undefined,
					rel: openInNewTab ? 'noopener noreferrer' : undefined,
					value: buttonText,
					onChange: (v) => setAttributes({ buttonText: v }),
					placeholder: 'ボタンのテキストを入力',
					multiline: false,
					style: {
						maxWidth: `${maxWidth}px`,
						fontSize: `${fontSize}%`,
						backgroundColor,
						color: textColor,
						padding:
							innerPaddingSize === 'S'
								? '0.7em 1em'
								: innerPaddingSize === 'M'
								? '0.9em 1.4em'
								: '1.3em 1.6em',
						textAlign: 'center',
						textDecoration: 'none',
						borderRadius: `${borderRadius}px`,
						borderWidth: `${borderWidth}px`,
						borderStyle: borderWidth > 0 ? 'solid' : 'none',
						borderColor,
					},
				}),
			),
		];
	},

	/* ---------- 保存 ---------- */
	save: (props) => {
		const { attributes } = props;
		const {
			buttonText, url, openInNewTab,
			fontSize, maxWidth, maxWidthSp,
			backgroundColor, textColor,
			paddingSize, innerPaddingSize,
			marginTop, marginBottom,
			alignment, alignmentSp,
			borderRadius, borderWidth, borderColor,
		} = attributes;

		const containerClass =
			`wp-block-wdl-button-01 padding-${paddingSize}` +
			` align-${alignment} align-sp-${alignmentSp}`;

		// ★スマホ用max-widthの値を決定
		const effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;

		return wp.element.createElement(
			'div',
			{
				className: containerClass,
				style: {
					marginTop:    `${marginTop}px`,
					marginBottom: `${marginBottom}px`,
					'--button-01-max-width-sp': `${effectiveMaxWidthSp}px`, // ★追加
				},
			},
			wp.element.createElement('a', {
				href: url,
				target: openInNewTab ? '_blank' : undefined,
				rel: openInNewTab ? 'noopener noreferrer' : undefined,
				style: {
					maxWidth: `${maxWidth}px`,
					fontSize: `${fontSize}%`,
					backgroundColor,
					color: textColor,
					padding:
						innerPaddingSize === 'S'
							? '0.7em 1em'
							: innerPaddingSize === 'M'
							? '0.9em 1.4em'
							: '1.3em 1.6em',
					textAlign: 'center',
					textDecoration: 'none',
					borderRadius: `${borderRadius}px`,
					borderWidth: `${borderWidth}px`,
					borderStyle: borderWidth > 0 ? 'solid' : 'none',
					borderColor,
				},
				dangerouslySetInnerHTML: { __html: buttonText },
			}),
		);
	},
});