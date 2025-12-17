/**
 * LiteWord – 角丸ユーティリティ（border-radius 0–80px）
 * 2025-06-26  RangeControl 化 + h3/br ラベル対応 + RESET
 *
 * フィルター名: liteword/radius/*
 * ------------------------------------------------------------
 *   クラス例:
 *     borderRadius_pc_16   … PC で 16px
 *     borderRadius_sp_0    … SP で 0px
 *     空文字（未設定）      … クラス無し
 * ------------------------------------------------------------
 *   TB … @container (max-width: 800px)
 *   SP … @container (max-width: 500px)
 * ------------------------------------------------------------
 *   この JS を読み込むだけで既存ブロックに角丸 UI が追加されます。
 */
(function () {
	/* ────────── WordPress API ────────── */
	const { hooks, components, blockEditor, element, blocks } = wp;
	const { addFilter } = hooks;
	const { InspectorControls } = blockEditor;
	const { PanelBody, RangeControl, Button } = components;

	/* ────────── 共通定義 ────────── */
	const RADIUS_KEYS = ['borderRadiusPc', 'borderRadiusTb', 'borderRadiusSp'];
	const radiusVals  = [
		0, 4, 8, 12, 16, 20, 24, 28, 32, 36,
		40, 44, 48, 52, 56, 64, 72, 80,
	];

	/* 文字列⇔数値 変換 */
	const pxToClass = (dev, px) =>
		px === null ? '' : `borderRadius_${dev}_${px}`;

	const classToPx = (cls = '') => {
		if (!cls) return null;
		const m = cls.match(/_(\d+)$/);
		return m ? parseInt(m[1], 10) : null;
	};

	/* ────────── 1) 属性注入 ────────── */
	const inject = (settings) => {
		settings.attributes = {
			...settings.attributes,
			...Object.fromEntries(
				RADIUS_KEYS.map((k) => [k, { type: 'string', default: '' }]),
			),
		};
		return settings;
	};
	addFilter('blocks.registerBlockType', 'liteword/radius/inject', inject);
	if (blocks?.getBlockTypes) blocks.getBlockTypes().forEach(inject);

	/* ────────── 2) InspectorControls ────────── */
	const withControls = (BlockEdit) => (props) => {
		if (!props.isSelected) return element.createElement(BlockEdit, props);

		const { attributes, setAttributes } = props;

		/* ラベル HTML → React ノード化（<h3>/<br> 対応） */
		const labelNode = (raw) => {
			const nodes = [];
			let rest = raw;
			while (rest.length) {
				const h3 = rest.match(/^<h3>(.*?)<\/h3>/i);
				if (h3) {
					nodes.push(
						element.createElement(
							'h3',
							{
								style: {
							
								},
							},
							h3[1],
						),
					);
					rest = rest.slice(h3[0].length);
					continue;
				}
				const br = rest.match(/^<br\s*\/?>/i);
				if (br) {
					nodes.push(element.createElement('br'));
					rest = rest.slice(br[0].length);
					continue;
				}
				const next = rest.search(/<h3>|<br\s*\/?>/i);
				if (next === -1) {
					nodes.push(rest);
					rest = '';
				} else {
					nodes.push(rest.slice(0, next));
					rest = rest.slice(next);
				}
			}
			return element.createElement('span', null, ...nodes);
		};

		/* 表示用配列 [label, key, dev] */
		const items = [
			['PC', 'borderRadiusPc', 'pc'],
			['TB',                            'borderRadiusTb', 'tb'],
			['SP',                            'borderRadiusSp', 'sp'],
		];

		const resetBtn = (key) =>
			element.createElement(
				Button,
				{
					isSecondary: true,
					onClick: () => setAttributes({ [key]: '' }),
					style: { margin: '-32px 0 12px 0' },
				},
				'リセット',
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
						title: '角丸 – border-radius',
						initialOpen: false,
						className: 'lw_common_side_edit',
					},
					items.map(([labelStr, key, dev]) => {
						const currentPx = classToPx(attributes[key]); // null or number
						return element.createElement(
							element.Fragment,
							{ key },
							element.createElement(RangeControl, {
								label: labelNode(labelStr),
								min: 0,
								max: 80,
								step: 4,
								value: currentPx ?? 0,
								help:
									currentPx === null
										? '未設定'
										: `${currentPx}px`,
								onChange: (v) => {
									const px = radiusVals.reduce(
										(best, val) =>
											Math.abs(val - v) < Math.abs(best - v) ? val : best,
										radiusVals[0],
									);
									setAttributes({ [key]: pxToClass(dev, px) });
								},
							}),
							resetBtn(key),
						);
					}),
				),
			),
		);
	};
	addFilter('editor.BlockEdit', 'liteword/radius/controls', withControls);

	/* ────────── 3) Editor wrapper ────────── */
	const withWrapper = (BlockListBlock) => (props) => {
		const { block } = props;
		if (!block) return element.createElement(BlockListBlock, props);

		const clsSet = new Set(
			(props.wrapperProps?.className || '').split(/\s+/).filter(Boolean),
		);
		RADIUS_KEYS.forEach((k) => {
			const c = block.attributes[k];
			if (c) clsSet.add(c);
		});

		if (!clsSet.size) return element.createElement(BlockListBlock, props);

		const wrapperProps = {
			...(props.wrapperProps || {}),
			className: [...clsSet].join(' '),
		};
		return element.createElement(BlockListBlock, { ...props, wrapperProps });
	};
	addFilter('editor.BlockListBlock', 'liteword/radius/wrapper', withWrapper);

	/* ────────── 4) Save extraProps ────────── */
	const applySave = (saveProps, _type, attrs) => {
		const cls = RADIUS_KEYS.map((k) => attrs[k]).filter(Boolean);
		if (cls.length) {
			saveProps.className = [saveProps.className || '', ...cls].join(' ').trim();
		}
		return saveProps;
	};
	addFilter('blocks.getSaveContent.extraProps', 'liteword/radius/save', applySave);
})();
