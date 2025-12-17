/**
 * LiteWord 共通ユーティリティ – background
 * 2025-06-26
 *  - 単色背景のみ
 *  - CSS変数 --lw-block-bg-color, --lw-block-bg-opacity で色と透明度を制御
 *
 * フィルター名: liteword/background/*
 * --------------------------------------------------------------
 */
(function () {
	/* ───────────────────── 依存パッケージ ───────────────────── */
	const { hooks, components, blockEditor, element, blocks } = wp;
	const { addFilter } = hooks;
	const { InspectorControls, ColorPalette } = blockEditor;
	const { PanelBody, ToggleControl, Button, RangeControl } = components;

	/* ───────── デフォルト値 ───────── */
	const DEFAULTS = {
		lw_bgEnabled: false,
		lw_bgColor: 'var(--color-main)',
		lw_bgOpacity: 0.1,
		lw_bgFullWidth: true,
	};

	/* ===== 1) 属性注入 ======================================================= */
	const inject = (settings) => {
		settings.attributes = {
			...settings.attributes,
			lw_bgEnabled: { type: 'boolean', default: DEFAULTS.lw_bgEnabled },
			lw_bgColor: { type: 'string', default: DEFAULTS.lw_bgColor },
			lw_bgOpacity: { type: 'number', default: DEFAULTS.lw_bgOpacity },
			lw_bgFullWidth: { type: 'boolean', default: DEFAULTS.lw_bgFullWidth },
		};
		return settings;
	};
	addFilter('blocks.registerBlockType', 'liteword/background/inject', inject);
	if (blocks?.getBlockTypes) blocks.getBlockTypes().forEach(inject);

	/* ===== 2) InspectorControls(サイドバー UI) ============================ */
	const withControls = (BlockEdit) => (props) => {
		if (!props.isSelected) return element.createElement(BlockEdit, props);

		const { attributes, setAttributes } = props;
		const { lw_bgEnabled, lw_bgColor, lw_bgOpacity, lw_bgFullWidth } = attributes;

		/* RESET ボタン */
		const resetBtn = () =>
			element.createElement(
				Button,
				{
					isSecondary: true,
					onClick: () =>
						setAttributes({
							lw_bgEnabled: DEFAULTS.lw_bgEnabled,
							lw_bgColor: DEFAULTS.lw_bgColor,
							lw_bgOpacity: DEFAULTS.lw_bgOpacity,
							lw_bgFullWidth: DEFAULTS.lw_bgFullWidth,
						}),
					style: { marginTop: '12px' },
				},
				'すべてリセット',
			);

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
						title: '背景設定',
						initialOpen: false,
						className: 'lw_common_side_edit',
					},
					/* 背景を有効にする */
					element.createElement(ToggleControl, {
						label: '背景を有効にする',
						checked: lw_bgEnabled,
						onChange: (val) => setAttributes({ lw_bgEnabled: val }),
						__nextHasNoMarginBottom: true,
					}),

					/* 背景有効時のみ表示 */
					lw_bgEnabled &&
						element.createElement(
							element.Fragment,
							null,
							/* 背景全幅 */
							element.createElement(ToggleControl, {
								label: '背景を全幅にする',
								checked: lw_bgFullWidth,
								onChange: (val) => setAttributes({ lw_bgFullWidth: val }),
								help: '有効にすると画面幅いっぱいに背景が広がります',
								__nextHasNoMarginBottom: true,
							}),

							element.createElement('hr', { style: { margin: '16px 0' } }),

							/* 背景色 */
							element.createElement(
								'div',
								{ style: { marginTop: '16px' } },
								element.createElement(
									'label',
									{
										style: {
											display: 'block',
											marginBottom: '8px',
											fontWeight: '600',
										},
									},
									'背景色',
								),
								element.createElement(ColorPalette, {
									value: lw_bgColor,
									onChange: (val) => setAttributes({ lw_bgColor: val || DEFAULTS.lw_bgColor }),
									colors: [
										{ name: 'ホワイト', color: '#ffffff' },
										{ name: 'ライトグレー', color: '#f5f5f5' },
										{ name: 'グレー', color: '#e0e0e0' },
										{ name: 'ダークグレー', color: '#9e9e9e' },
										{ name: 'ライトブルー', color: '#e3f2fd' },
										{ name: 'ブルー', color: '#2196f3' },
										{ name: 'ライトグリーン', color: '#e8f5e9' },
										{ name: 'グリーン', color: '#4caf50' },
										{ name: 'ライトイエロー', color: '#fffde7' },
										{ name: 'イエロー', color: '#ffeb3b' },
										{ name: 'ライトピンク', color: '#fce4ec' },
										{ name: 'ピンク', color: '#e91e63' },
									],
								}),
							),

							element.createElement('hr', { style: { margin: '16px 0' } }),

							/* 透明度 */
							element.createElement(RangeControl, {
								label: '透明度',
								value: lw_bgOpacity,
								onChange: (val) => setAttributes({ lw_bgOpacity: val }),
								min: 0,
								max: 1,
								step: 0.01,
								help: `現在の透明度: ${Math.round(lw_bgOpacity * 100)}%`,
								__nextHasNoMarginBottom: true,
							}),

							resetBtn(),
						),
				),
			),
		);
	};
	addFilter('editor.BlockEdit', 'liteword/background/controls', withControls);

	/* ===== 3) Editor wrapper（エディター上クラス＋スタイル反映） =========== */
	const withWrapper = (BlockListBlock) => (props) => {
		const { block } = props;
		if (!block?.attributes?.lw_bgEnabled || !block.attributes.lw_bgColor) {
			return element.createElement(BlockListBlock, props);
		}

		const attrs = block.attributes;

		/* クラス名生成 */
		const clsSet = new Set(
			(props.wrapperProps?.className || '').split(/\s+/).filter(Boolean),
		);
		clsSet.add('lw_block_bg');
		if (attrs.lw_bgFullWidth) clsSet.add('width_100vw');

		/* インラインスタイル生成 ★修正箇所★ */
		const inlineStyle = {
			...(props.wrapperProps?.style || {}),
			'--lw-block-bg-color': attrs.lw_bgColor,
			'--lw-block-bg-opacity': String(attrs.lw_bgOpacity ?? DEFAULTS.lw_bgOpacity), // 文字列に変換
		};

		const wrapperProps = {
			...(props.wrapperProps || {}),
			className: [...clsSet].join(' '),
			style: inlineStyle,
		};

		return element.createElement(BlockListBlock, { ...props, wrapperProps });
	};
	addFilter('editor.BlockListBlock', 'liteword/background/wrapper', withWrapper);

	/* ===== 4) Save extraProps（フロント側クラス＋style属性） =============== */
	const applySave = (saveProps, _blockType, attrs) => {
		if (!attrs?.lw_bgEnabled || !attrs.lw_bgColor) {
			return saveProps;
		}

		/* クラス名追加 */
		const cls = ['lw_block_bg'];
		if (attrs.lw_bgFullWidth) cls.push('width_100vw');

		saveProps.className = [saveProps.className || '', ...cls].join(' ').trim();

		/* style属性にCSS変数を設定 ★修正箇所★ */
		const existingStyle = saveProps.style || {};
		saveProps.style = {
			...existingStyle,
			'--lw-block-bg-color': attrs.lw_bgColor,
			'--lw-block-bg-opacity': String(attrs.lw_bgOpacity ?? DEFAULTS.lw_bgOpacity), // 文字列に変換
		};

		return saveProps;
	};
	addFilter(
		'blocks.getSaveContent.extraProps',
		'liteword/background/save',
		applySave,
	);
})();