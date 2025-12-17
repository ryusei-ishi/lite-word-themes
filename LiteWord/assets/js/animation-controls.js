/**
 * LiteWord – 全ブロック共通アニメーション設定
 * 2025-05-25 + distanceClass 対応（既定値を空に修正）
 *
 *  ─ 属性 ──────────────────────────────────────────
 *  trigger                : lw_anime lw_scroll / lw_anime lw_loading
 *  animationClass         : lw-fade-up / -right / -left / -down …
 *  animationDurationClass : dur-0-1s ‥ dur-5-0s
 *  thresholdClass         : threshold-10 ‥ threshold-200
 *  delayClass             : delay-0-1s ‥ delay-5-0s
 *  distanceClass          : dist-10 ‥ dist-200（10 px 刻み）※デフォルトは空
 *  ────────────────────────────────────────────────
 */
(function () {
	/* ─── 必要パッケージ ─── */
	const { hooks, components, blockEditor, element } = wp;
	const { addFilter } = hooks;
	const { InspectorControls } = blockEditor;
	const { PanelBody, SelectControl } = components;

	/* ─── 1. 選択肢 ─── */
	const triggerOptions = [
		{ label: 'アニメーション無効にする', value: '' },
		{ label: 'スクロール時',             value: 'lw_anime lw_scroll'  },
		{ label: '初回表示時',               value: 'lw_anime lw_loading' },
	];

	const animationOptions = [
		{ label: 'なし',         value: '' },
		{ label: '下から現れる', value: 'lw-fade-up'    },
		{ label: '右から現れる', value: 'lw-fade-right' },
		{ label: '左から現れる', value: 'lw-fade-left'  },
		{ label: '上から現れる', value: 'lw-fade-down'  },
	];

	const buildDurationOptions = () => {
		const opts = [{ label: 'なし', value: '' }];
		for (let i = 0.1; i <= 5.0 + 1e-9; i += 0.1) {
			const str  = i.toFixed(1);              // "0.1"〜"5.0"
			const slug = str.replace('.', '-');     // 0-1 → 0-1
			opts.push({ label: `${str}秒`, value: `dur-${slug}s` });
		}
		return opts;
	};
	const animationDurationOptions = buildDurationOptions();

	const buildThresholdOptions = () => {
		const opts = [{ label: 'デフォルト (80px)', value: '' }];
		for (let px = 10; px <= 200; px += 10) {
			opts.push({ label: `${px}px`, value: `threshold-${px}` });
		}
		return opts;
	};
	const thresholdOptions = buildThresholdOptions();

	const buildDelayOptions = () => {
		const opts = [{ label: '遅延なし', value: '' }];
		for (let i = 0.1; i <= 5.0 + 1e-9; i += 0.1) {
			const str  = i.toFixed(1);
			const slug = str.replace('.', '-');
			opts.push({ label: `${str}秒`, value: `delay-${slug}s` });
		}
		return opts;
	};
	const delayOptions = buildDelayOptions();

	const buildDistanceOptions = () => {
		const opts = [{ label: 'デフォルト (40px)', value: '' }];   // ← デフォルトを空
		for (let px = 10; px <= 200; px += 10) {
			opts.push({ label: `${px}px`, value: `dist-${px}` });
		}
		return opts;
	};
	const distanceOptions = buildDistanceOptions();

	/* ─── 2. 属性追加 ─── */
	function addAnimationAttributes(settings) {
		settings.attributes = Object.assign({}, settings.attributes, {
			trigger:                { type: 'string', default: '' },
			animationClass:         { type: 'string', default: '' },
			animationDurationClass: { type: 'string', default: '' },
			thresholdClass:         { type: 'string', default: '' },
			delayClass:             { type: 'string', default: '' },
			distanceClass:          { type: 'string', default: '' }, // ← 空
		});
		return settings;
	}
	addFilter(
		'blocks.registerBlockType',
		'liteword/add-animation-attributes',
		addAnimationAttributes,
	);

	/* ─── 3. サイドバー UI ─── */
	function addAnimationInspectorControls(BlockEdit) {
		return (props) => {
			if (!props.isSelected) return element.createElement(BlockEdit, props);

			const { attributes, setAttributes } = props;
			const {
				trigger,
				animationClass,
				animationDurationClass,
				thresholdClass,
				delayClass,
				distanceClass,
			} = attributes;

			const isScrollMode = trigger.includes('lw_scroll');

			return element.createElement(
				element.Fragment,
				null,
				element.createElement(BlockEdit, props),
				element.createElement(
					InspectorControls,
					null,
					element.createElement(
						PanelBody,
						{ title: 'アニメーション設定', initialOpen: false ,className  : 'lw_common_side_edit',},

						/* 発動条件 */
						element.createElement(SelectControl, {
							label   : '発動条件',
							value   : trigger,
							options : triggerOptions,
							onChange: (v) => setAttributes({ trigger: v }),
						}),

						/* 種類 */
						element.createElement(SelectControl, {
							label   : 'アニメーション種類',
							value   : animationClass,
							options : animationOptions,
							onChange: (v) => setAttributes({ animationClass: v }),
						}),

						/* 時間 */
						element.createElement(SelectControl, {
							label   : 'アニメーション時間',
							value   : animationDurationClass,
							options : animationDurationOptions,
							onChange: (v) => setAttributes({ animationDurationClass: v }),
						}),

						/* 表示開始距離 (スクロール時のみ) */
						isScrollMode && element.createElement(SelectControl, {
							label   : '表示開始距離 (px)',
							value   : thresholdClass,
							options : thresholdOptions,
							onChange: (v) => setAttributes({ thresholdClass: v }),
						}),

						/* 移動距離 */
						element.createElement(SelectControl, {
							label   : '移動距離 (px)',
							value   : distanceClass,
							options : distanceOptions,
							onChange: (v) => setAttributes({ distanceClass: v }),
						}),

						/* 遅延 */
						element.createElement(SelectControl, {
							label   : '遅延時間',
							value   : delayClass,
							options : delayOptions,
							onChange: (v) => setAttributes({ delayClass: v }),
						}),
					),
				),
			);
		};
	}
	addFilter(
		'editor.BlockEdit',
		'liteword/add-animation-inspector-controls',
		addAnimationInspectorControls,
	);

	/* ─── 4. エディター上でクラス反映 ─── */
	function withAnimationWrapperProps(BlockListBlock) {
		return (props) => {
			const { block } = props;
			if (!block) return element.createElement(BlockListBlock, props);

			const {
				trigger,
				animationClass,
				animationDurationClass,
				thresholdClass,
				delayClass,
				distanceClass,
			} = block.attributes;

			if (
				!trigger && !animationClass && !animationDurationClass &&
				!thresholdClass && !delayClass && !distanceClass
			) {
				return element.createElement(BlockListBlock, props);
			}

			const wrapperProps = { ...(props.wrapperProps || {}) };
			const classSet = new Set(
				(wrapperProps.className || '').split(' ').filter(Boolean),
			);

			if (trigger)                trigger.split(/\s+/).forEach((c) => classSet.add(c));
			if (animationClass)         classSet.add(animationClass);
			if (animationDurationClass) classSet.add(animationDurationClass);
			if (thresholdClass)         classSet.add(thresholdClass);
			if (delayClass)             classSet.add(delayClass);
			if (distanceClass)          classSet.add(distanceClass);

			wrapperProps.className = Array.from(classSet).join(' ').trim();
			return element.createElement(BlockListBlock, { ...props, wrapperProps });
		};
	}
	addFilter(
		'editor.BlockListBlock',
		'liteword/with-animation-wrapper-props',
		withAnimationWrapperProps,
	);

	/* ─── 5. 保存時にクラスを付与 ─── */
	function applyAnimationExtraProps(saveProps, blockType, attrs) {
		const {
			trigger,
			animationClass,
			animationDurationClass,
			thresholdClass,
			delayClass,
			distanceClass,
		} = attrs;

		if (
			!trigger && !animationClass && !animationDurationClass &&
			!thresholdClass && !delayClass && !distanceClass
		) {
			return saveProps;
		}

		saveProps.className = [
			saveProps.className || '',
			trigger,
			animationClass,
			animationDurationClass,
			thresholdClass,
			delayClass,
			distanceClass,
		].filter(Boolean).join(' ').trim();

		return saveProps;
	}
	addFilter(
		'blocks.getSaveContent.extraProps',
		'liteword/apply-animation-extra-props',
		applyAnimationExtraProps,
	);
})();
