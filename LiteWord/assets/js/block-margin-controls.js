/**
 * LiteWord 共通ユーティリティ – margin
 * 2025-06-26
 *  - RangeControl UI
 *  - 初期値は「未設定」（クラス無し）
 *  - RESET で null（空文字）に戻す
 *  - ラベル文字列の <h3> と <br> を React ノード化
 *
 * フィルター名: liteword/margin/*
 * --------------------------------------------------------------
 * 生成クラス例:
 *   lw_margin_top_pc_16     … PC の margin-top を 16px
 *   lw_margin_bottom_sp_0   … SP の margin-bottom を 0px
 *   未設定（空文字）          … クラス付与なし
 * --------------------------------------------------------------
 */
(function () {
	/* ───────────────────── 依存パッケージ ───────────────────── */
	const { hooks, components, blockEditor, element, blocks } = wp;
	const { addFilter } = hooks;
	const { InspectorControls } = blockEditor;
	const { PanelBody, RangeControl, Button } = components;

	/* ───────── margin 用キーを固定定義 ───────── */
	const MARGIN_KEYS = [
		'marginTopPc',    'marginTopTb',    'marginTopSp',
		'marginBottomPc', 'marginBottomTb', 'marginBottomSp',
	];

	/* ───────── 固定リスト（0 〜 80 px, 4 px 刻み） ───────── */
	const spaceVals = [
		0, 4, 8, 12, 16, 20, 24, 28, 32, 36,
		40, 44, 48, 52, 56, 64, 72, 80,
	];

	/* ───────── 文字列⇔数値 変換ヘルパー ───────── */
	const pxToClass = (dir, dev, px) =>
		px === null ? '' : `lw_margin_${dir}_${dev}_${px}`; // null＝未設定

	const classToPx = (cls = '') => {
		if (!cls) return null;           // 未設定
		const m = cls.match(/_(\d+)$/);
		return m ? parseInt(m[1], 10) : null;
	};

	/* ===== 1) 属性注入 ======================================================= */
	const inject = (settings) => {
		settings.attributes = {
			...settings.attributes,
			...Object.fromEntries(
				MARGIN_KEYS.map((k) => [k, { type: 'string', default: '' }]),
			),
		};
		return settings;
	};
	addFilter('blocks.registerBlockType', 'liteword/margin/inject', inject);
	if (blocks?.getBlockTypes) blocks.getBlockTypes().forEach(inject);

	/* ===== 2) InspectorControls（サイドバー UI） ============================ */
	const withControls = (BlockEdit) => (props) => {
		if (!props.isSelected) return element.createElement(BlockEdit, props);

		const { attributes, setAttributes } = props;

		/* --------------------------------------------------
		 * ラベル用：<h3> と <br> を React ノード化
		 * -------------------------------------------------- */
		const labelNode = (raw) => {
			const nodes = [];
			let rest = raw;
			while (rest.length) {
				const h3Match = rest.match(/^<h3>(.*?)<\/h3>/i);
				if (h3Match) {
					nodes.push(
						element.createElement(
							'h3',
							{
								style: {
			
								},
							},
							h3Match[1],
						),
					);
					rest = rest.slice(h3Match[0].length);
					continue;
				}
				const brMatch = rest.match(/^<br\s*\/?>/i);
				if (brMatch) {
					nodes.push(element.createElement('br'));
					rest = rest.slice(brMatch[0].length);
					continue;
				}
				const nextTag = rest.search(/<h3>|<br\s*\/?>/i);
				if (nextTag === -1) {
					nodes.push(rest);
					rest = '';
				} else if (nextTag > 0) {
					nodes.push(rest.slice(0, nextTag));
					rest = rest.slice(nextTag);
				}
			}
			return element.createElement('span', null, ...nodes);
		};

		/* 表示用メタ配列 [label, key, dir, dev] */
		const items = [
			['<h3>外側の余白（上）margin-top</h3>PC',   'marginTopPc',    'top',    'pc'],
			['TB',                                      'marginTopTb',    'top',    'tb'],
			['SP',                                      'marginTopSp',    'top',    'sp'],
			['<h3>外側の余白（下）margin-bottom</h3>PC', 'marginBottomPc', 'bottom', 'pc'],
			['TB',                                      'marginBottomTb', 'bottom', 'tb'],
			['SP',                                      'marginBottomSp', 'bottom', 'sp'],
		];

		/* RESET ボタン */
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
						title: '外側の余白 - margin',
						initialOpen: false,
						className: 'lw_common_side_edit',
					},
					items.map(([labelStr, key, dir, dev]) => {
						const currentPx = classToPx(attributes[key]); // null or 数値

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
									const px = spaceVals.reduce(
										(closest, val) =>
											Math.abs(val - v) < Math.abs(closest - v) ? val : closest,
										spaceVals[0],
									);
									setAttributes({ [key]: pxToClass(dir, dev, px) });
								},
							}),
							resetBtn(key),
						);
					}),
				),
			),
		);
	};
	addFilter('editor.BlockEdit', 'liteword/margin/controls', withControls);

	/* ===== 3) Editor wrapper（エディター上クラス反映） ===================== */
	const withWrapper = (BlockListBlock) => (props) => {
		const { block } = props;
		if (!block) return element.createElement(BlockListBlock, props);

		const clsSet = new Set(
			(props.wrapperProps?.className || '').split(/\s+/).filter(Boolean),
		);
		MARGIN_KEYS.forEach((k) => {
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
	addFilter('editor.BlockListBlock', 'liteword/margin/wrapper', withWrapper);

	/* ===== 4) Save extraProps（フロント側クラス保存） ====================== */
	const applySave = (saveProps, _blockType, attrs) => {
		const cls = MARGIN_KEYS.map((k) => attrs[k]).filter(Boolean);
		if (cls.length) {
			saveProps.className = [saveProps.className || '', ...cls].join(' ').trim();
		}
		return saveProps;
	};
	addFilter(
		'blocks.getSaveContent.extraProps',
		'liteword/margin/save',
		applySave,
	);
})();
