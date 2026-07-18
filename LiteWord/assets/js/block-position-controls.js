/**
 * LiteWord 共通ユーティリティ – position
 * 2025-01-09
 *  - SelectControl / RangeControl + 単位選択 UI
 *  - 初期値は「未設定」（null）
 *  - CSS変数として直接設定
 *  - 継承なし（PC/TB/SPは独立）
 *
 * フィルター名: liteword/position/*
 * --------------------------------------------------------------
 * 生成CSS変数例:
 *   --lw-block-position-pc: relative;
 *   --lw-block-top-pc: 10px;
 *   --lw-block-left-sp: 50%;
 *   --lw-block-zindex-pc: 10;
 *   未設定（空）= 変数なし
 * --------------------------------------------------------------
 */
(function () {
	/* ───────────────────── 依存パッケージ ───────────────────── */
	const { hooks, components, blockEditor, element, blocks } = wp;
	const { addFilter } = hooks;
	const { InspectorControls } = blockEditor;
	const {
		PanelBody,
		SelectControl,
		TextControl,
		Button,
		ToggleControl,
		RangeControl,
		ButtonGroup,
		Flex,
		FlexItem,
		FlexBlock,
	} = components;

	/* ───────── 全キーを固定定義 ───────── */
	const ALL_KEYS = [
		// position
		'lwPositionPc', 'lwPositionTb', 'lwPositionSp',
		// top
		'lwTopPc', 'lwTopTb', 'lwTopSp',
		// bottom
		'lwBottomPc', 'lwBottomTb', 'lwBottomSp',
		// left
		'lwLeftPc', 'lwLeftTb', 'lwLeftSp',
		// right
		'lwRightPc', 'lwRightTb', 'lwRightSp',
		// z-index
		'lwZindexPc', 'lwZindexTb', 'lwZindexSp',
	];

	/* ───────── CSS変数名のマッピング ───────── */
	const CSS_VAR_MAP = {
		// position
		lwPositionPc: '--lw-block-position-pc',
		lwPositionTb: '--lw-block-position-tb',
		lwPositionSp: '--lw-block-position-sp',
		// top
		lwTopPc: '--lw-block-top-pc',
		lwTopTb: '--lw-block-top-tb',
		lwTopSp: '--lw-block-top-sp',
		// bottom
		lwBottomPc: '--lw-block-bottom-pc',
		lwBottomTb: '--lw-block-bottom-tb',
		lwBottomSp: '--lw-block-bottom-sp',
		// left
		lwLeftPc: '--lw-block-left-pc',
		lwLeftTb: '--lw-block-left-tb',
		lwLeftSp: '--lw-block-left-sp',
		// right
		lwRightPc: '--lw-block-right-pc',
		lwRightTb: '--lw-block-right-tb',
		lwRightSp: '--lw-block-right-sp',
		// z-index
		lwZindexPc: '--lw-block-zindex-pc',
		lwZindexTb: '--lw-block-zindex-tb',
		lwZindexSp: '--lw-block-zindex-sp',
	};

	/* ───────── position の選択肢 ───────── */
	const POSITION_OPTIONS = [
		{ label: '未設定', value: '' },
		{ label: 'static（通常配置）', value: 'static' },
		{ label: 'relative（相対配置）', value: 'relative' },
		{ label: 'absolute（絶対配置）', value: 'absolute' },
		{ label: 'fixed（固定配置）', value: 'fixed' },
		{ label: 'sticky（スティッキー）', value: 'sticky' },
	];

	/* ───────── 単位の設定 ───────── */
	const UNITS = [
		{ label: 'px', value: 'px' },
		{ label: '%', value: '%' },
		{ label: 'em', value: 'em' },
		{ label: 'vw', value: 'vw' },
		{ label: 'auto', value: 'auto' },
	];

	/* ───────── 値をパース（"10px" → {num: 10, unit: "px"}） ───────── */
	const parseValue = (val) => {
		if (!val) return { num: 0, unit: '' }; // デフォルトは未設定（空）
		if (val === 'auto') return { num: 0, unit: 'auto' };
		const match = val.match(/^(-?\d+\.?\d*)(px|%|em|vw)$/);
		if (match) {
			return { num: parseFloat(match[1]), unit: match[2] };
		}
		return { num: 0, unit: '' };
	};

	/* ───────── RangeControlの設定（単位ごと） ───────── */
	const getRangeConfig = (unit) => {
		switch (unit) {
			case '%':
				return { min: -100, max: 100, step: 1 };
			case 'em':
				return { min: -20, max: 20, step: 0.1 };
			case 'vw':
				return { min: -100, max: 100, step: 1 };
			case 'px':
			default:
				return { min: -500, max: 500, step: 1 };
		}
	};

	/* ===== 1) 属性注入 ======================================================= */
	const inject = (settings) => {
		settings.attributes = {
			...settings.attributes,
			...Object.fromEntries(
				ALL_KEYS.map((k) => [k, { type: 'string', default: '' }]),
			),
			lwOverflowDisable: { type: 'boolean', default: false },
		};
		return settings;
	};
	addFilter('blocks.registerBlockType', 'liteword/position/inject', inject);
	if (blocks?.getBlockTypes) blocks.getBlockTypes().forEach(inject);

	/* ===== 2) InspectorControls（サイドバー UI） ============================ */
	const withControls = (BlockEdit) => (props) => {
		if (!props.isSelected) return element.createElement(BlockEdit, props);

		const { attributes, setAttributes } = props;

		/* position セクション */
		const positionItems = [
			['PC', 'lwPositionPc'],
			['TB', 'lwPositionTb'],
			['SP', 'lwPositionSp'],
		];

		/* offset セクション（top, bottom, left, right） */
		const offsetSections = [
			{
				title: 'top',
				icon: '↑',
				keys: [
					['PC', 'lwTopPc'],
					['TB', 'lwTopTb'],
					['SP', 'lwTopSp'],
				],
			},
			{
				title: 'bottom',
				icon: '↓',
				keys: [
					['PC', 'lwBottomPc'],
					['TB', 'lwBottomTb'],
					['SP', 'lwBottomSp'],
				],
			},
			{
				title: 'left',
				icon: '←',
				keys: [
					['PC', 'lwLeftPc'],
					['TB', 'lwLeftTb'],
					['SP', 'lwLeftSp'],
				],
			},
			{
				title: 'right',
				icon: '→',
				keys: [
					['PC', 'lwRightPc'],
					['TB', 'lwRightTb'],
					['SP', 'lwRightSp'],
				],
			},
		];

		/* z-index セクション */
		const zindexKeys = [
			['PC', 'lwZindexPc'],
			['TB', 'lwZindexTb'],
			['SP', 'lwZindexSp'],
		];

		return element.createElement(
			element.Fragment,
			null,
			element.createElement(BlockEdit, props),
			element.createElement(
				InspectorControls,
				null,
				element.createElement(
					PanelBody,
					{
						title: 'position（上級者向け）',
						initialOpen: false,
						className: 'lw_common_side_edit lw-position-panel',
					},
					/* 注意書き */
					element.createElement(
						'div',
						{ className: 'lw-position-notice' },
						element.createElement('span', { className: 'lw-position-notice__icon' }, '⚠'),
						'この設定は上級者向けです',
					),
					/* overflow無効化トグル */
					element.createElement(
						'div',
						{ className: 'lw-position-section' },
						element.createElement(ToggleControl, {
							label: 'overflow: hidden を無効化',
							help: '親要素で要素が切れる場合にON',
							checked: !!attributes.lwOverflowDisable,
							onChange: (v) => setAttributes({ lwOverflowDisable: v }),
							__nextHasNoMarginBottom: true,
						}),
					),
					/* position 選択 */
					element.createElement(
						'div',
						{ className: 'lw-position-section' },
						element.createElement(
							'h3',
							{ className: 'lw-position-section__title' },
							element.createElement('span', { className: 'lw-position-section__icon' }, '📍'),
							'配置方法 - position',
						),
						element.createElement(
							'div',
							{ className: 'lw-position-grid' },
							positionItems.map(([deviceLabel, key]) => {
								const currentVal = attributes[key] || '';
								return element.createElement(
									'div',
									{ key, className: 'lw-position-item' },
									element.createElement(
										'span',
										{ className: 'lw-position-item__device' },
										deviceLabel,
									),
									element.createElement(SelectControl, {
										value: currentVal,
										options: POSITION_OPTIONS,
										onChange: (v) => setAttributes({ [key]: v }),
										__nextHasNoMarginBottom: true,
									}),
								);
							}),
						),
					),
					/* offset 入力（top, bottom, left, right） */
					offsetSections.map((section) =>
						element.createElement(
							'div',
							{ key: section.title, className: 'lw-position-section' },
							element.createElement(
								'h3',
								{ className: 'lw-position-section__title' },
								element.createElement('span', { className: 'lw-position-section__icon' }, section.icon),
								section.title,
							),
							element.createElement(
								'div',
								{ className: 'lw-offset-controls' },
								section.keys.map(([deviceLabel, attrKey]) => {
									const currentVal = attributes[attrKey] || '';
									const { num, unit } = parseValue(currentVal);
									const activeUnit = unit || '';
									const rangeConfig = getRangeConfig(activeUnit);

									const updateValue = (newNum, newUnit) => {
										if (newUnit === 'auto') {
											setAttributes({ [attrKey]: 'auto' });
										} else if (newUnit === '') {
											setAttributes({ [attrKey]: '' });
										} else {
											setAttributes({ [attrKey]: `${newNum}${newUnit}` });
										}
									};

									return element.createElement(
										'div',
										{ key: attrKey, className: 'lw-offset-control' },
										/* デバイスラベル */
										element.createElement(
											'div',
											{ className: 'lw-offset-control__header' },
											element.createElement(
												'span',
												{ className: 'lw-offset-control__device' },
												deviceLabel,
											),
											currentVal && element.createElement(
												'span',
												{ className: 'lw-offset-control__value' },
												currentVal,
											),
										),
										/* 単位選択ボタン */
										element.createElement(
											'div',
											{ className: 'lw-offset-control__units' },
											UNITS.map((u) =>
												element.createElement(
													'button',
													{
														key: u.value,
														type: 'button',
														className: `lw-offset-control__unit-btn ${activeUnit === u.value ? 'is-active' : ''}`,
														onClick: () => {
															if (u.value === activeUnit) {
																updateValue(0, '');
															} else {
																updateValue(activeUnit === 'auto' ? 0 : num, u.value);
															}
														},
													},
													u.label,
												),
											),
										),
										/* RangeControl（auto以外の時のみ表示） */
										activeUnit && activeUnit !== 'auto' && element.createElement(
											'div',
											{ className: 'lw-offset-control__range' },
											element.createElement(RangeControl, {
												value: num,
												onChange: (v) => updateValue(v, activeUnit),
												min: rangeConfig.min,
												max: rangeConfig.max,
												step: rangeConfig.step,
												withInputField: true,
												__nextHasNoMarginBottom: true,
											}),
										),
									);
								}),
							),
						),
					),
					/* z-index */
					element.createElement(
						'div',
						{ className: 'lw-position-section' },
						element.createElement(
							'h3',
							{ className: 'lw-position-section__title' },
							element.createElement('span', { className: 'lw-position-section__icon' }, '📚'),
							'z-index（重なり順）',
						),
						element.createElement(
							'div',
							{ className: 'lw-offset-controls' },
							zindexKeys.map(([deviceLabel, attrKey]) => {
								const currentVal = attributes[attrKey] || '';
								const numVal = currentVal ? parseInt(currentVal, 10) : 0;
								const hasValue = currentVal !== '';

								return element.createElement(
									'div',
									{ key: attrKey, className: 'lw-offset-control lw-zindex-control' },
									element.createElement(
										'div',
										{ className: 'lw-offset-control__header' },
										element.createElement(
											'span',
											{ className: 'lw-offset-control__device' },
											deviceLabel,
										),
										hasValue && element.createElement(
											'span',
											{ className: 'lw-offset-control__value' },
											currentVal,
										),
									),
									element.createElement(
										'div',
										{ className: 'lw-offset-control__range' },
										element.createElement(RangeControl, {
											value: hasValue ? numVal : 0,
											onChange: (v) => setAttributes({ [attrKey]: v === 0 ? '' : String(v) }),
											min: -100,
											max: 100,
											step: 1,
											withInputField: true,
											__nextHasNoMarginBottom: true,
										}),
									),
									hasValue && element.createElement(
										'button',
										{
											type: 'button',
											className: 'lw-offset-control__reset',
											onClick: () => setAttributes({ [attrKey]: '' }),
										},
										'リセット',
									),
								);
							}),
						),
					),
				),
			),
		);
	};
	addFilter('editor.BlockEdit', 'liteword/position/controls', withControls);

	/* ===== 3) Editor wrapper（エディター上スタイル反映） ===================== */
	const withWrapper = (BlockListBlock) => (props) => {
		const { block } = props;
		if (!block) return element.createElement(BlockListBlock, props);

		const styleObj = { ...(props.wrapperProps?.style || {}) };
		let hasValue = false;

		ALL_KEYS.forEach((k) => {
			const val = block.attributes[k];
			if (val) {
				styleObj[CSS_VAR_MAP[k]] = val;
				hasValue = true;
			}
		});

		/* overflow無効化 */
		if (block.attributes.lwOverflowDisable) {
			styleObj.overflow = 'initial';
			hasValue = true;
		}

		if (!hasValue) return element.createElement(BlockListBlock, props);

		const wrapperProps = {
			...(props.wrapperProps || {}),
			style: styleObj,
		};
		return element.createElement(BlockListBlock, { ...props, wrapperProps });
	};
	addFilter('editor.BlockListBlock', 'liteword/position/wrapper', withWrapper);

	/* ===== 4) Save extraProps（フロント側スタイル保存） ====================== */
	const applySave = (saveProps, _blockType, attrs) => {
		const styleObj = { ...(saveProps.style || {}) };
		let hasValue = false;

		ALL_KEYS.forEach((k) => {
			const val = attrs[k];
			if (val) {
				styleObj[CSS_VAR_MAP[k]] = val;
				hasValue = true;
			}
		});

		/* overflow無効化 */
		if (attrs.lwOverflowDisable) {
			styleObj.overflow = 'initial';
			hasValue = true;
		}

		if (hasValue) {
			saveProps.style = styleObj;
		}
		return saveProps;
	};
	addFilter(
		'blocks.getSaveContent.extraProps',
		'liteword/position/save',
		applySave,
	);

	/* ===== 5) スタイル注入（CSSをhead に追加） ============================= */
	const injectStyles = () => {
		if (document.getElementById('lw-position-controls-styles')) return;

		const css = `
/* ═══════════════════════════════════════════════════════════════
   LiteWord Position Controls - UI Styles
   ═══════════════════════════════════════════════════════════════ */

/* 注意書き */
.lw-position-notice {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 14px;
	background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
	border-left: 4px solid #ffc107;
	border-radius: 0 8px 8px 0;
	font-size: 12px;
	color: #856404;
	margin-bottom: 20px;
}
.lw-position-notice__icon {
	font-size: 16px;
}

/* セクション */
.lw-position-section {
	background: #f8f9fa;
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 16px;
}
.lw-position-section:last-child {
	margin-bottom: 0;
}
.lw-position-section__title {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	font-weight: 700;
	color: #1e1e1e;
	margin: 0 0 14px 0;
	padding-bottom: 10px;
	border-bottom: 2px solid #e0e0e0;
}
.lw-position-section__icon {
	font-size: 16px;
}

/* position グリッド */
.lw-position-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
}
.lw-position-item {
	display: flex;
	flex-direction: column;
	gap: 6px;
}
.lw-position-item__device {
	font-size: 11px;
	font-weight: 700;
	color: #fff;
	background: #666;
	padding: 3px 10px;
	border-radius: 4px;
	text-align: center;
	letter-spacing: 0.5px;
}
.lw-position-item .components-select-control__input {
	font-size: 11px !important;
	padding: 6px 8px !important;
	height: auto !important;
	min-height: 32px !important;
	border-radius: 6px !important;
}

/* オフセットコントロール */
.lw-offset-controls {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
.lw-offset-control {
	background: #fff;
	border-radius: 10px;
	padding: 12px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	border: 1px solid #e8e8e8;
	transition: all 0.2s ease;
}
.lw-offset-control:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	border-color: #999;
}
.lw-offset-control__header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}
.lw-offset-control__device {
	font-size: 11px;
	font-weight: 700;
	color: #fff;
	background: #666;
	padding: 3px 12px;
	border-radius: 4px;
	letter-spacing: 0.5px;
}
.lw-offset-control__value {
	font-size: 12px;
	font-weight: 700;
	color: #333;
	background: #e8e8e8;
	padding: 4px 10px;
	border-radius: 4px;
	font-family: 'SF Mono', Monaco, monospace;
}

/* 単位ボタン */
.lw-offset-control__units {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 6px;
	margin-bottom: 12px;
}
.lw-offset-control__unit-btn {
	padding: 8px 4px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	background: #fff;
	font-size: 12px;
	font-weight: 600;
	color: #666;
	cursor: pointer;
	transition: all 0.15s ease;
}
.lw-offset-control__unit-btn:hover {
	border-color: #007cba;
	color: #007cba;
	background: rgba(0, 124, 186, 0.05);
}
.lw-offset-control__unit-btn.is-active {
	border-color: #007cba;
	background: #007cba;
	color: #fff;
}

/* RangeControl */
.lw-offset-control__range {
	padding: 4px 0 0 0;
}
.lw-offset-control__range .components-range-control__root {
	flex-wrap: wrap;
	gap: 8px;
}
.lw-offset-control__range .components-range-control__wrapper {
	width: 100% !important;
	flex: 0 0 100% !important;
}
.lw-offset-control__range .components-range-control__slider {
	height: 8px;
	border-radius: 4px;
}
.lw-offset-control__range .components-range-control__track {
	background: #007cba;
	border-radius: 4px;
}
.lw-offset-control__range .components-range-control__thumb-wrapper {
	height: 20px;
	width: 20px;
	border-radius: 50%;
	background: #fff;
	border: 3px solid #007cba;
	box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.lw-offset-control__range .components-input-control__container {
	width: 100% !important;
}
.lw-offset-control__range input[type="number"] {
	width: 100% !important;
	font-size: 13px !important;
	font-weight: 600 !important;
	text-align: center !important;
	border-radius: 4px !important;
	border: 1px solid #ddd !important;
	padding: 8px !important;
}
.lw-offset-control__range input[type="number"]:focus {
	border-color: #007cba !important;
	box-shadow: 0 0 0 1px rgba(0, 124, 186, 0.2) !important;
}

/* リセットボタン */
.lw-offset-control__reset {
	width: 100%;
	margin-top: 10px;
	padding: 8px;
	border: none;
	border-radius: 6px;
	background: #f0f0f0;
	font-size: 11px;
	font-weight: 600;
	color: #666;
	cursor: pointer;
	transition: all 0.15s ease;
}
.lw-offset-control__reset:hover {
	background: #ff6b6b;
	color: #fff;
}

/* z-index専用 - デバイスラベルの色は共通 */

/* ToggleControl調整 */
.lw-position-section .components-toggle-control {
	margin-bottom: 0;
}
.lw-position-section .components-toggle-control .components-base-control__help {
	margin-top: 4px;
	font-size: 11px;
	color: #888;
}
`;

		const style = document.createElement('style');
		style.id = 'lw-position-controls-styles';
		style.textContent = css;
		document.head.appendChild(style);
	};

	// DOM読み込み後にスタイル注入
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', injectStyles);
	} else {
		injectStyles();
	}
})();
