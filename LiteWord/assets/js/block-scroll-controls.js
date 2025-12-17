/**
 * LiteWord 横スクロール設定
 * 依存: wp.hooks / wp.blockEditor / wp.components / wp.element
 * フィルター名: liteword/scroll-controls/*
 */
(function () {
	/* ─ WordPress API ─ */
	const { hooks, components, blockEditor, element } = wp;
	const { addFilter } = hooks;
	const { InspectorControls } = blockEditor;
	const { PanelBody, ToggleControl } = components;

	/* ─ 属性注入 ─ */
	const inject = settings => {
		settings.attributes = {
			...settings.attributes,
			enableScroll: { type: 'boolean', default: false },
			minWidthTb: { type: 'number', default: 1000 },
			minWidthSp: { type: 'number', default: 600 },
		};
		return settings;
	};
	addFilter('blocks.registerBlockType', 'liteword/scroll-controls/inject-attrs', inject);
	if (wp.blocks?.getBlockTypes) {
		wp.blocks.getBlockTypes().forEach(inject);
	}

	/* ─ InspectorControls ─ */
	const withControls = BlockEdit => props => {
		if (!props.isSelected) return element.createElement(BlockEdit, props);
		const { attributes, setAttributes } = props;
		const { enableScroll, minWidthTb, minWidthSp } = attributes;

		return element.createElement(
			element.Fragment,
			null,
			element.createElement(BlockEdit, props),
			element.createElement(
				InspectorControls,
				null,
				element.createElement(
					PanelBody,
					{ title: '横スクロール設定', initialOpen: enableScroll, className: 'lw_scroll_controls_panel' },
					element.createElement(
						'div',
						{ style: { marginTop: '20px' } },
						element.createElement(ToggleControl, {
							label: '横スクロールを有効にする',
							checked: enableScroll,
							onChange: v => setAttributes({ enableScroll: v }),
							help: enableScroll ? 'スマホ・タブレットで横スクロール表示されます' : 'オフの状態です'
						})
					),
					enableScroll && element.createElement(CustomRangeControl, {
						label: 'TB 最小横幅 (px)',
						value: minWidthTb,
						min: 400,
						max: 1920,
						step: 10,
						onChange: v => setAttributes({ minWidthTb: v }),
					}),
					enableScroll && element.createElement(CustomRangeControl, {
						label: 'SP 最小横幅 (px)',
						value: minWidthSp,
						min: 200,
						max: 1200,
						step: 10,
						onChange: v => setAttributes({ minWidthSp: v }),
					})
				)
			)
		);
	};
	addFilter('editor.BlockEdit', 'liteword/scroll-controls/controls', withControls);

	/* ─ カスタムレンジコントロール ─ */
	const CustomRangeControl = ({ label, value, min, max, step, onChange }) => {
		const [inputValue, setInputValue] = element.useState(value);

		element.useEffect(() => {
			setInputValue(value);
		}, [value]);

		const handleRangeChange = (e) => {
			const newValue = parseInt(e.target.value);
			onChange(newValue);
		};

		const handleTextChange = (e) => {
			setInputValue(e.target.value);
		};

		const handleTextBlur = (e) => {
			let newValue = parseInt(e.target.value);
			if (isNaN(newValue)) {
				newValue = value;
			} else {
				newValue = Math.max(min, Math.min(max, newValue));
				newValue = Math.round(newValue / step) * step;
			}
			setInputValue(newValue);
			onChange(newValue);
		};

		const handleTextKeyPress = (e) => {
			if (e.key === 'Enter') {
				e.target.blur();
			}
		};

		return element.createElement(
			'div',
			{ style: { marginBottom: '16px', marginTop: '16px' } },
			element.createElement(
				'div',
				{
					style: {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '8px'
					}
				},
				element.createElement(
					'label',
					{
						style: {
							fontSize: '11px',
							fontWeight: '500',
							textTransform: 'uppercase',
							color: '#1e1e1e'
						}
					},
					label
				),
				element.createElement(
					'div',
					{
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: '8px'
						}
					},
					element.createElement(
						'input',
						{
							type: 'number',
							min: min,
							max: max,
							step: step,
							value: inputValue,
							onChange: handleTextChange,
							onBlur: handleTextBlur,
							onKeyPress: handleTextKeyPress,
							style: {
								width: '70px',
								height: '28px',
								fontSize: '12px',
								fontWeight: '500',
								color: '#007cba',
								backgroundColor: '#f0f8ff',
								border: '1px solid #007cba',
								borderRadius: '4px',
								textAlign: 'center',
								padding: '4px',
								outline: 'none'
							}
						}
					),
					element.createElement(
						'span',
						{
							style: {
								fontSize: '12px',
								color: '#666',
								fontWeight: '500'
							}
						},
						'px'
					)
				)
			),
			element.createElement(
				'input',
				{
					type: 'range',
					min: min,
					max: max,
					step: step,
					value: value,
					onChange: handleRangeChange,
					style: {
						width: '100%',
						height: '4px',
						borderRadius: '2px',
						background: `linear-gradient(to right, #007cba 0%, #007cba ${((value - min) / (max - min)) * 100}%, #ddd ${((value - min) / (max - min)) * 100}%, #ddd 100%)`,
						outline: 'none',
						appearance: 'none',
						WebkitAppearance: 'none',
						cursor: 'pointer'
					},
					className: 'lw-custom-range'
				}
			),
			element.createElement(
				'div',
				{
					style: {
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: '10px',
						color: '#999',
						marginTop: '4px'
					}
				},
				element.createElement('span', null, `${min}px`),
				element.createElement('span', null, `${max}px`)
			)
		);
	};

	/* ─ Editor wrapper ─ */
	const withWrapper = BlockListBlock => props => {
		const { block } = props;
		if (!block) return element.createElement(BlockListBlock, props);

		const { enableScroll, minWidthTb, minWidthSp } = block.attributes;

		if (!enableScroll) return element.createElement(BlockListBlock, props);

		// wrapperPropsにクラスを追加
		const wrapperProps = { ...(props.wrapperProps || {}) };
		const cls = new Set(
			(wrapperProps.className || '')
				.toString()
				.split(/\s+/)
				.filter(Boolean)
		);
		cls.add('lw_block_scroll_control');
		wrapperProps.className = [...cls].join(' ').trim();

		// 外側のwrapper要素を作成
		return element.createElement(
			'div',
			{
				className: 'lw_block_scroll_control_wrap',
				style: {
					'--lw-block-min-width-tb': `${minWidthTb}px`,
					'--lw-block-min-width-sp': `${minWidthSp}px`
				}
			},
			element.createElement(BlockListBlock, { ...props, wrapperProps })
		);
	};
	addFilter(
		'editor.BlockListBlock',
		'liteword/scroll-controls/wrapper',
		withWrapper,
		20
	);

	/* ─ Save時の処理 ─ */
	const applySave = (element, blockType, attrs) => {
		const { enableScroll, minWidthTb, minWidthSp } = attrs;

		if (!enableScroll) return element;

		// 既存の要素のクラスにlw_block_scroll_controlを追加
		const existingProps = element.props || {};
		const existingClasses = (existingProps.className || '').split(/\s+/).filter(Boolean);
		const newClasses = [...new Set([...existingClasses, 'lw_block_scroll_control'])];

		// 既存の要素を新しいpropsでクローン
		const clonedElement = wp.element.cloneElement(element, {
			...existingProps,
			className: newClasses.join(' ').trim()
		});

		// wrapper要素で囲む
		return wp.element.createElement(
			'div',
			{
				className: 'lw_block_scroll_control_wrap',
				style: `--lw-block-min-width-tb:${minWidthTb}px;--lw-block-min-width-sp:${minWidthSp}px;`
			},
			clonedElement
		);
	};
	addFilter(
		'blocks.getSaveElement',
		'liteword/scroll-controls/save',
		applySave,
		20
	);
})();