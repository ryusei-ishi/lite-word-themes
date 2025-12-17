/**
 * LiteWord – ボーダーユーティリティ（border設定）
 * 2025-07-19  全辺共通 or 個別設定切替 + 色（インラインスタイル）
 *
 * フィルター名: liteword/border/*
 * ------------------------------------------------------------
 *   全辺共通モード（チェックなし）:
 *     borderStyleAll_solid        … 全辺：実線
 *     borderWidthAll_pc_2         … 全辺 PC で 2px
 *   個別設定モード（チェックあり）:
 *     borderStyleTop_solid        … 上辺：実線
 *     borderWidthTop_pc_2         … 上辺 PC で 2px
 * ------------------------------------------------------------
 *   TB … @container (max-width: 800px)
 *   SP … @container (max-width: 500px)
 * ------------------------------------------------------------
 *   この JS を読み込むだけで既存ブロックにボーダー UI が追加されます。
 */
(function () {
	/* ────────── WordPress API ────────── */
	const { hooks, components, blockEditor, element, blocks } = wp;
	const { addFilter } = hooks;
	const { InspectorControls } = blockEditor;
	const { PanelBody, RangeControl, SelectControl, ColorPalette, Button, CheckboxControl, TabPanel } = components;

	/* ────────── 共通定義 ────────── */
	const BORDER_SIDES = ['Top', 'Right', 'Bottom', 'Left'];
	const DEVICES = ['Pc', 'Tb', 'Sp'];
	
	// 全属性キーを生成
	const generateBorderKeys = () => {
		const keys = [];
		// ON/OFF属性
		BORDER_SIDES.forEach(side => {
			keys.push(`borderEnabled${side}`);
		});
		// 全辺共通属性
		keys.push('borderStyleAll');
		keys.push('borderColorAll');
		DEVICES.forEach(device => {
			keys.push(`borderWidthAll${device}`);
		});
		// 個別設定属性
		BORDER_SIDES.forEach(side => {
			keys.push(`borderStyle${side}`);
			keys.push(`borderColor${side}`);
			DEVICES.forEach(device => {
				keys.push(`borderWidth${side}${device}`);
			});
		});
		return keys;
	};
	
	const ALL_BORDER_KEYS = generateBorderKeys();
	
	// 線の太さの選択肢（0-20px）
	const borderWidthVals = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
	
	// 線の種類
	const borderStyleOptions = [
		{ label: '線なし', value: 'none' },
		{ label: '実線', value: 'solid' },
		{ label: '破線', value: 'dashed' },
		{ label: '点線', value: 'dotted' },
		{ label: '二重線', value: 'double' },
		{ label: '溝線', value: 'groove' },
		{ label: '隆起線', value: 'ridge' },
		{ label: '内側線', value: 'inset' },
		{ label: '外側線', value: 'outset' },
	];

	// デフォルトカラーパレット
	const colorPalette = [
		{ name: '黒', color: '#000000' },
		{ name: 'グレー（濃）', color: '#333333' },
		{ name: 'グレー', color: '#666666' },
		{ name: 'グレー（薄）', color: '#cccccc' },
		{ name: '白', color: '#ffffff' },
		{ name: '赤', color: '#ff0000' },
		{ name: '青', color: '#0000ff' },
		{ name: '緑', color: '#00ff00' },
		{ name: 'オレンジ', color: '#ff8800' },
		{ name: '紫', color: '#8800ff' },
	];

	// 辺の情報
	const sideInfo = [
		{ key: 'Top', label: '上辺', icon: '↑' },
		{ key: 'Right', label: '右辺', icon: '→' },
		{ key: 'Bottom', label: '下辺', icon: '↓' },
		{ key: 'Left', label: '左辺', icon: '←' },
	];

	/* 文字列⇔数値/値 変換 */
	const pxToClass = (side, dev, px) =>
		px === null || px === 0 ? '' : `borderWidth${side}_${dev.toLowerCase()}_${px}`;

	const classToPx = (cls = '') => {
		if (!cls) return null;
		const m = cls.match(/_(\d+)$/);
		return m ? parseInt(m[1], 10) : null;
	};

	const styleToClass = (side, style) =>
		!style || style === 'none' ? '' : `borderStyle${side}_${style}`;

	const classToStyle = (cls = '') => {
		if (!cls) return '';
		const m = cls.match(/^borderStyle.+_(.+)$/);
		return m ? m[1] : '';
	};

	/* ────────── 1) 属性注入 ────────── */
	const inject = (settings) => {
		const enabledAttrs = Object.fromEntries(
			BORDER_SIDES.map(side => [`borderEnabled${side}`, { type: 'boolean', default: false }])
		);
		const allAttrs = {
			borderStyleAll: { type: 'string', default: '' },
			borderColorAll: { type: 'string', default: '' },
			...Object.fromEntries(
				DEVICES.map(device => [`borderWidthAll${device}`, { type: 'string', default: '' }])
			),
		};
		const individualAttrs = Object.fromEntries(
			ALL_BORDER_KEYS.filter(k => !k.includes('Enabled') && !k.includes('All')).map(k => [k, { type: 'string', default: '' }])
		);
		
		settings.attributes = {
			...settings.attributes,
			...enabledAttrs,
			...allAttrs,
			...individualAttrs,
		};
		return settings;
	};
	addFilter('blocks.registerBlockType', 'liteword/border/inject', inject);
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
								style: {},
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

		const resetBtn = (key) =>
			element.createElement(
				Button,
				{
					isSecondary: true,
					onClick: () => setAttributes({ [key]: '' }),
					style: { margin: '8px 0', fontSize: '12px' },
				},
				'リセット',
			);

		// 全リセットボタン
		const resetAllBtn = () =>
			element.createElement(
				Button,
				{
					isDestructive: true,
					onClick: () => {
						const resetAttrs = {};
						ALL_BORDER_KEYS.forEach(key => {
							if (key.includes('Enabled')) {
								resetAttrs[key] = false;
							} else {
								resetAttrs[key] = '';
							}
						});
						setAttributes(resetAttrs);
					},
					style: { marginBottom: '16px' },
				},
				'すべてリセット',
			);

		// 有効な辺を取得
		const enabledSides = sideInfo.filter(side => attributes[`borderEnabled${side.key}`]);
		const isIndividualMode = enabledSides.length > 0;

		// 辺のON/OFF選択部分
		const renderSideToggles = () => {
			return element.createElement(
				'div',
				{ style: { marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '4px' } },
				element.createElement('h4', { style: { marginTop: 0, marginBottom: '8px' } }, '設定モード'),
				element.createElement(
					'p', 
					{ style: { margin: '0 0 12px 0', fontSize: '13px', color: '#666' } },
					'チェックなし：全辺共通設定｜チェックあり：個別設定'
				),
				element.createElement(
					'div',
					{ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
					sideInfo.map(side => {
						const sideKey = side.key;
						const isEnabled = attributes[`borderEnabled${sideKey}`];
						return element.createElement(CheckboxControl, {
							key: sideKey,
							label: `${side.icon} ${side.label}`,
							checked: isEnabled,
							onChange: (checked) => {
								setAttributes({ [`borderEnabled${sideKey}`]: checked });
							},
						});
					})
				),
			);
		};

		// 全辺共通設定コンポーネント
		const renderAllSidesControls = () => {
			const currentStyle = classToStyle(attributes.borderStyleAll);
			const currentColor = attributes.borderColorAll || '';

			return element.createElement(
				'div',
				{ style: { padding: '16px 0' } },
				
				element.createElement('h4', { style: { marginBottom: '16px', color: '#2271b1' } }, '全辺共通設定'),
				
				// 線の種類
				element.createElement(
					'div',
					{ style: { marginBottom: '16px' } },
					element.createElement('h4', { style: { margin: '0 0 8px 0' } }, '線の種類'),
					element.createElement(SelectControl, {
						value: currentStyle,
						options: borderStyleOptions,
						onChange: (value) => {
							setAttributes({ borderStyleAll: styleToClass('All', value) });
						},
					}),
					resetBtn('borderStyleAll'),
				),

				// 線の色
				element.createElement(
					'div',
					{ style: { marginBottom: '16px' } },
					element.createElement('h4', { style: { margin: '0 0 8px 0' } }, '線の色'),
					element.createElement(ColorPalette, {
						colors: colorPalette,
						value: currentColor,
						onChange: (color) => {
							setAttributes({ borderColorAll: color || '' });
						},
					}),
					resetBtn('borderColorAll'),
				),

				// 線の太さ
				element.createElement('h4', null, '線の太さ'),
				DEVICES.map((device) => {
					const deviceKey = `borderWidthAll${device}`;
					const currentPx = classToPx(attributes[deviceKey]);
					const deviceLabel = device === 'Pc' ? 'PC' : device === 'Tb' ? 'TB' : 'SP';
					
					return element.createElement(
						element.Fragment,
						{ key: device },
						element.createElement(RangeControl, {
							label: labelNode(deviceLabel),
							min: 0,
							max: 20,
							step: 1,
							value: currentPx ?? 0,
							help: currentPx === null || currentPx === 0 ? '線なし' : `${currentPx}px`,
							onChange: (v) => {
								const px = borderWidthVals.reduce(
									(best, val) =>
										Math.abs(val - v) < Math.abs(best - v) ? val : best,
									borderWidthVals[0],
								);
								setAttributes({ [deviceKey]: pxToClass('All', device, px) });
							},
						}),
						resetBtn(deviceKey),
					);
				}),
			);
		};

		// 各辺の設定コンポーネント
		const renderSideControls = (side) => {
			const sideKey = side.key;
			const currentStyle = classToStyle(attributes[`borderStyle${sideKey}`]);
			const currentColor = attributes[`borderColor${sideKey}`] || '';

			return element.createElement(
				'div',
				{ style: { padding: '16px 0' } },
				
				// 線の種類
				element.createElement(
					'div',
					{ style: { marginBottom: '16px' } },
					element.createElement('h4', { style: { margin: '0 0 8px 0' } }, '線の種類'),
					element.createElement(SelectControl, {
						value: currentStyle,
						options: borderStyleOptions,
						onChange: (value) => {
							setAttributes({ [`borderStyle${sideKey}`]: styleToClass(sideKey, value) });
						},
					}),
					resetBtn(`borderStyle${sideKey}`),
				),

				// 線の色
				element.createElement(
					'div',
					{ style: { marginBottom: '16px' } },
					element.createElement('h4', { style: { margin: '0 0 8px 0' } }, '線の色'),
					element.createElement(ColorPalette, {
						colors: colorPalette,
						value: currentColor,
						onChange: (color) => {
							setAttributes({ [`borderColor${sideKey}`]: color || '' });
						},
					}),
					resetBtn(`borderColor${sideKey}`),
				),

				// 線の太さ
				element.createElement('h4', null, '線の太さ'),
				DEVICES.map((device) => {
					const deviceKey = `borderWidth${sideKey}${device}`;
					const currentPx = classToPx(attributes[deviceKey]);
					const deviceLabel = device === 'Pc' ? 'PC' : device === 'Tb' ? 'TB' : 'SP';
					
					return element.createElement(
						element.Fragment,
						{ key: device },
						element.createElement(RangeControl, {
							label: labelNode(deviceLabel),
							min: 0,
							max: 20,
							step: 1,
							value: currentPx ?? 0,
							help: currentPx === null || currentPx === 0 ? '線なし' : `${currentPx}px`,
							onChange: (v) => {
								const px = borderWidthVals.reduce(
									(best, val) =>
										Math.abs(val - v) < Math.abs(best - v) ? val : best,
									borderWidthVals[0],
								);
								setAttributes({ [deviceKey]: pxToClass(sideKey, device, px) });
							},
						}),
						resetBtn(deviceKey),
					);
				}),
			);
		};

		// タブの定義（有効な辺のみ表示）
		const tabs = enabledSides.map(side => ({
			name: side.key,
			title: `${side.icon} ${side.label}`,
			className: 'border-side-tab enabled',
		}));

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
						title: 'ボーダー – border',
						initialOpen: false,
						className: 'lw_common_side_edit',
					},
					// 全リセットボタン
					resetAllBtn(),
					
					// 辺の選択
					renderSideToggles(),
					
					// 設定UI
					!isIndividualMode ? 
						// 全辺共通設定
						renderAllSidesControls()
					: 
						// 個別設定（タブパネル）
						element.createElement(TabPanel, {
							className: 'border-sides-tabs',
							activeClass: 'is-active',
							tabs: tabs,
							children: (tab) => {
								const side = sideInfo.find(s => s.key === tab.name);
								return renderSideControls(side);
							},
						}),
				),
			),
		);
	};
	addFilter('editor.BlockEdit', 'liteword/border/controls', withControls);

	/* ────────── 3) Editor wrapper ────────── */
	const withWrapper = (BlockListBlock) => (props) => {
		const { block } = props;
		if (!block) return element.createElement(BlockListBlock, props);

		const clsSet = new Set(
			(props.wrapperProps?.className || '').split(/\s+/).filter(Boolean),
		);
		
		// インラインスタイルを生成
		const inlineStyles = {};
		
		// 有効な辺があるかチェック
		const enabledSides = BORDER_SIDES.filter(side => block.attributes[`borderEnabled${side}`]);
		const isIndividualMode = enabledSides.length > 0;
		
		if (isIndividualMode) {
			// 個別設定モード
			enabledSides.forEach(side => {
				const sideKey = side;
				
				// スタイルクラス
				const styleKey = `borderStyle${sideKey}`;
				if (block.attributes[styleKey]) clsSet.add(block.attributes[styleKey]);
				
				// 色はインラインスタイル
				const colorKey = `borderColor${sideKey}`;
				const colorValue = block.attributes[colorKey];
				if (colorValue) {
					inlineStyles[`border${sideKey}Color`] = colorValue;
				}
				
				// 太さクラス
				DEVICES.forEach(device => {
					const widthKey = `borderWidth${sideKey}${device}`;
					const cls = block.attributes[widthKey];
					if (cls) clsSet.add(cls);
				});
			});
		} else {
			// 全辺共通モード
			if (block.attributes.borderStyleAll) clsSet.add(block.attributes.borderStyleAll);
			
			if (block.attributes.borderColorAll) {
				inlineStyles.borderColor = block.attributes.borderColorAll;
			}
			
			DEVICES.forEach(device => {
				const widthKey = `borderWidthAll${device}`;
				const cls = block.attributes[widthKey];
				if (cls) clsSet.add(cls);
			});
		}

		// プロパティを組み合わせ
		const wrapperProps = {
			...(props.wrapperProps || {}),
		};
		
		if (clsSet.size > 0) {
			wrapperProps.className = [...clsSet].join(' ');
		}
		
		if (Object.keys(inlineStyles).length > 0) {
			wrapperProps.style = {
				...(props.wrapperProps?.style || {}),
				...inlineStyles,
			};
		}

		return element.createElement(BlockListBlock, { ...props, wrapperProps });
	};
	addFilter('editor.BlockListBlock', 'liteword/border/wrapper', withWrapper);

	/* ────────── 4) Save extraProps ────────── */
	const applySave = (saveProps, _type, attrs) => {
		const cls = [];
		const inlineStyles = {};
		
		// 有効な辺があるかチェック
		const enabledSides = BORDER_SIDES.filter(side => attrs[`borderEnabled${side}`]);
		const isIndividualMode = enabledSides.length > 0;
		
		if (isIndividualMode) {
			// 個別設定モード
			enabledSides.forEach(side => {
				const sideKey = side;
				
				// スタイルクラス
				const styleKey = `borderStyle${sideKey}`;
				if (attrs[styleKey]) cls.push(attrs[styleKey]);
				
				// 色はインラインスタイル
				const colorKey = `borderColor${sideKey}`;
				const colorValue = attrs[colorKey];
				if (colorValue) {
					inlineStyles[`border${sideKey}Color`] = colorValue;
				}
				
				// 太さクラス
				DEVICES.forEach(device => {
					const widthKey = `borderWidth${sideKey}${device}`;
					if (attrs[widthKey]) cls.push(attrs[widthKey]);
				});
			});
		} else {
			// 全辺共通モード
			if (attrs.borderStyleAll) cls.push(attrs.borderStyleAll);
			
			if (attrs.borderColorAll) {
				inlineStyles.borderColor = attrs.borderColorAll;
			}
			
			DEVICES.forEach(device => {
				const widthKey = `borderWidthAll${device}`;
				if (attrs[widthKey]) cls.push(attrs[widthKey]);
			});
		}
		
		if (cls.length) {
			saveProps.className = [saveProps.className || '', ...cls].join(' ').trim();
		}
		
		if (Object.keys(inlineStyles).length > 0) {
			saveProps.style = {
				...(saveProps.style || {}),
				...inlineStyles,
			};
		}
		
		return saveProps;
	};
	addFilter('blocks.getSaveContent.extraProps', 'liteword/border/save', applySave);
})();