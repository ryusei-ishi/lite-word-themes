/**
 * LiteWord 共通ユーティリティ – 最大横幅 & ポジション（ネストカラム対応版）
 * 依存: wp.hooks / wp.blockEditor / wp.components / wp.blocks / wp.element
 * フィルター名: liteword/maxwidth-position/*
 */
(function () {
	/* ─ カスタムスタイルを追加 ─ */
	const addCustomStyles = () => {
		if (document.getElementById('lw-custom-range-styles')) return;
		
		const style = document.createElement('style');
		style.id = 'lw-custom-range-styles';
		style.textContent = `
			.lw-custom-range::-webkit-slider-thumb {
				-webkit-appearance: none;
				appearance: none;
				width: 20px;
				height: 20px;
				border-radius: 50%;
				background: #007cba;
				cursor: pointer;
				border: 2px solid #fff;
				box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
			}
			.lw-custom-range::-moz-range-thumb {
				width: 20px;
				height: 20px;
				border-radius: 50%;
				background: #007cba;
				cursor: pointer;
				border: 2px solid #fff;
				box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
			}
			.lw-custom-range::-webkit-slider-track {
				height: 4px;
				cursor: pointer;
				border-radius: 2px;
			}
			.lw-custom-range::-moz-range-track {
				height: 4px;
				cursor: pointer;
				border-radius: 2px;
			}
			/* ネストされたカラムのmax-width対応 */
			.wp-block-column[style*="max-width"] {
				width: 100% !important;
			}
			.block-editor-block-list__block.wp-block-column[style*="max-width"] {
				flex-basis: auto !important;
			}
		`;
		document.head.appendChild(style);
	};
	
	// ページ読み込み時にスタイルを追加
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', addCustomStyles);
	} else {
		addCustomStyles();
	}

	/* ─ WordPress API ─ */
	const { hooks, components, blockEditor, element, blocks } = wp;
	const { addFilter } = hooks;
	const { InspectorControls } = blockEditor;
	const { PanelBody, SelectControl, RangeControl, ButtonGroup, Button } = components;

	/* ─ オプション ─ */
	const widthTypeOptions = [
		{ label:'未設定',  value:'', icon:'✕'      },
		{ label:'100%',  value:'100%', icon:'📏'  },
		{ label:'100vw', value:'100vw', icon:'📐' },
		{ label:'px指定',    value:'px', icon:'🔧'    },
	];
	const pcPosOptions = [
		{ label:'未設定', value:'', icon:'✕' },
		{ label:'左寄せ', value:'lw_position_left', icon:'⬅️'   },
		{ label:'中央寄せ', value:'lw_position_center', icon:'⬆️' },
		{ label:'右寄せ', value:'lw_position_right', icon:'➡️'  },
	];
	const tbPosOptions = [
		{ label:'未設定', value:'', icon:'✕' },
		{ label:'左寄せ', value:'lw_position_left_tb', icon:'⬅️'   },
		{ label:'中央寄せ', value:'lw_position_center_tb', icon:'⬆️' },
		{ label:'右寄せ', value:'lw_position_right_tb', icon:'➡️'  },
	];
	const spPosOptions = [
		{ label:'未設定', value:'', icon:'✕' },
		{ label:'左寄せ', value:'lw_position_left_sp', icon:'⬅️'   },
		{ label:'中央寄せ', value:'lw_position_center_sp', icon:'⬆️' },
		{ label:'右寄せ', value:'lw_position_right_sp', icon:'➡️'  },
	];

	/* ─ 属性注入 ─ */
	const inject = settings => {
		settings.attributes = {
			...settings.attributes,
			maxWidthType : { type:'string', default:''    },
			maxWidthPx   : { type:'number', default:1200 },
			pcPosition   : { type:'string', default:''   },
			tbPosition   : { type:'string', default:''   },
			spPosition   : { type:'string', default:''   },
		};
		return settings;
	};
	addFilter('blocks.registerBlockType', 'liteword/maxwidth-position/inject-attrs', inject);
	if (blocks?.getBlockTypes) blocks.getBlockTypes().forEach(inject);

	/* ─ InspectorControls ─ */
	const withControls = BlockEdit => props => {
		if (!props.isSelected) return element.createElement(BlockEdit, props);
		const { attributes, setAttributes } = props;
		const { maxWidthType, maxWidthPx, pcPosition, tbPosition, spPosition } = attributes;

		return element.createElement(
			element.Fragment,
			null,
			element.createElement(BlockEdit, props),
			element.createElement(
				InspectorControls,
				null,
				element.createElement(
					PanelBody,
					{ title:'最大横幅 & 位置', initialOpen:false ,className  : 'lw_common_side_edit'},
					element.createElement(CustomButtonGroup, {
						label: '最大横幅の指定方法',
						value: maxWidthType,
						options: widthTypeOptions,
						onChange: v => setAttributes({maxWidthType: v}),
					}),
					maxWidthType==='px' && element.createElement(CustomRangeControl, {
						label: '最大横幅 (px)',
						value: maxWidthPx,
						min: 200,
						max: 2400,
						step: 2,
						onChange: v => setAttributes({maxWidthPx: v}),
					}),
					element.createElement(
						'div',
						{ style: { marginTop: '24px' } },
						element.createElement(CustomButtonGroup, {
							label: 'PC ポジション',
							value: pcPosition,
							options: pcPosOptions,
							onChange: v => setAttributes({pcPosition: v}),
						})
					),
					element.createElement(
						'div',
						{ style: { marginTop: '16px' } },
						element.createElement(CustomButtonGroup, {
							label: 'TB ポジション',
							value: tbPosition,
							options: tbPosOptions,
							onChange: v => setAttributes({tbPosition: v}),
						})
					),
					element.createElement(
						'div',
						{ style: { marginTop: '16px' } },
						element.createElement(CustomButtonGroup, {
							label: 'SP ポジション',
							value: spPosition,
							options: spPosOptions,
							onChange: v => setAttributes({spPosition: v}),
						})
					),
				),
			)
		);
	};
	addFilter('editor.BlockEdit', 'liteword/maxwidth-position/controls', withControls);

	/* ─ 共通 util（修正版） ─ */
	const styleStrToObj = str => {
		const o = {};
		if (!str || typeof str !== 'string') return o;
		
		// セミコロンで分割
		const declarations = str.split(';').filter(decl => decl.trim());
		
		declarations.forEach(decl => {
			// 最初のコロンで分割（値の中にコロンが含まれる場合に対応）
			const colonIndex = decl.indexOf(':');
			if (colonIndex > 0) {
				const property = decl.substring(0, colonIndex).trim();
				const value = decl.substring(colonIndex + 1).trim();
				
				if (property && value) {
					// kebab-case を camelCase に変換
					const camelProperty = property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
					o[camelProperty] = value;
				}
			}
		});
		return o;
	};

	// オブジェクトをCSS文字列に変換する関数
	const styleObjToStr = obj => {
		if (!obj || typeof obj !== 'object') return '';
		
		return Object.entries(obj)
			.map(([key, value]) => {
				// camelCase を kebab-case に変換
				const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
				return `${kebabKey}:${value}`;
			})
			.join(';');
	};

	// スタイルを安全にマージする関数
	const mergeStyles = (existing, newStyles) => {
		let result = {};
		
		// 既存のスタイルを処理
		if (typeof existing === 'object' && existing !== null) {
			result = { ...existing };
		} else if (typeof existing === 'string') {
			result = styleStrToObj(existing);
		}
		
		// 新しいスタイルをマージ
		if (typeof newStyles === 'object' && newStyles !== null) {
			result = { ...result, ...newStyles };
		}
		
		return result;
	};

	// カラムブロックかどうかを判定
	const isColumnBlock = (blockName) => {
		return blockName === 'core/column' || blockName === 'core/columns';
	};

	/* ─ カスタムコンポーネント ─ */
	const CustomButtonGroup = ({ label, value, options, onChange }) => {
		return element.createElement(
			'div',
			{ style: { marginBottom: '16px' } },
			element.createElement(
				'div',
				{ 
					style: { 
						marginBottom: '8px', 
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
						flexDirection: 'row',
						flexWrap: 'wrap',
						gap: '4px'
					}
				},
				...options.map(option => 
					element.createElement(
						Button,
						{
							key: option.value,
							isPressed: value === option.value,
							onClick: () => onChange(option.value),
							style: {
								minWidth: '45px',
								height: '36px',
								fontSize: '12px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
								padding: '4px 8px',
								border: `1px solid ${value === option.value ? '#007cba' : '#ddd'}`,
								backgroundColor: value === option.value ? '#007cba' : '#fff',
								color: value === option.value ? '#fff' : '#555',
								borderRadius: '3px',
								transition: 'all 0.1s ease',
								cursor: 'pointer'
							}
						},
						element.createElement(
							'span',
							{ style: { fontSize: '14px', lineHeight: '1' } },
							option.icon
						),
						element.createElement(
							'span',
							{ 
								style: { 
									fontSize: '9px', 
									lineHeight: '1',
									marginTop: '2px',
									whiteSpace: 'nowrap'
								} 
							},
							option.label
						)
					)
				)
			)
		);
	};

	/* ─ カスタムレンジコントロール ─ */
	const CustomRangeControl = ({ label, value, min, max, step, onChange }) => {
		const [inputValue, setInputValue] = element.useState(value);

		// valueが外部から変更された時にinputValueも更新
		element.useEffect(() => {
			setInputValue(value);
		}, [value]);

		const handleRangeChange = (e) => {
			const newValue = parseInt(e.target.value);
			onChange(newValue);
		};

		const handleTextChange = (e) => {
			// 入力中はinputValueのみ更新（リアルタイム表示用）
			setInputValue(e.target.value);
		};

		const handleTextBlur = (e) => {
			let newValue = parseInt(e.target.value);
			if (isNaN(newValue)) {
				newValue = value; // 無効な値の場合は元の値に戻す
			} else {
				// 範囲内に収める
				newValue = Math.max(min, Math.min(max, newValue));
				// 8px単位に調整
				newValue = Math.round(newValue / step) * step;
			}
			setInputValue(newValue);
			onChange(newValue);
		};

		const handleTextKeyPress = (e) => {
			if (e.key === 'Enter') {
				e.target.blur(); // Enterキーでフォーカスを外してonBlurを発火
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

	/* ─ Editor wrapper（ネストカラム対応版） ─ */
	const withWrapper = BlockListBlock => props => {
		const { block, name } = props;
		if ( ! block ) return element.createElement( BlockListBlock, props );

		const {
			maxWidthType, maxWidthPx,
			pcPosition, tbPosition, spPosition,
		} = block.attributes;

		if ( ! ( maxWidthType || pcPosition || tbPosition || spPosition ) )
			return element.createElement( BlockListBlock, props );

		/* ❶ props.wrapperProps が null のケースもあるので fallback */
		const wrapperProps = { ...( props.wrapperProps || {} ) };

		/* ❷ className が無ければ空文字で split させない */
		const cls = new Set(
			( wrapperProps.className || '' )
				.toString()
				.split( /\s+/ )
				.filter( Boolean )
		);

		// カラムブロックの場合の特別な処理
		const isColumn = isColumnBlock(name);

		if ( maxWidthType === '100%' ) {
			cls.add( 'lw_max_width_100px' );
		} else if ( maxWidthType === '100vw' ) {
			cls.add( 'lw_max_width_100vw' );
		} else if ( maxWidthType === 'px' ) {
			// 既存のスタイルを保持しながらmax-widthを追加
			const newStyles = { maxWidth: `${maxWidthPx}px` };
			
			// カラムブロックの場合、追加のスタイル調整
			if (isColumn) {
				newStyles.width = '100%';
				newStyles.flexBasis = 'auto';
			}
			
			const mergedStyles = mergeStyles(wrapperProps.style, newStyles);
			wrapperProps.style = mergedStyles;
		}

		[ pcPosition, tbPosition, spPosition ].forEach( c => c && cls.add( c ) );

		wrapperProps.className = [ ...cls ].join( ' ' ).trim();
		
		// データ属性を追加（デバッグ用）
		if (maxWidthType === 'px') {
			wrapperProps['data-max-width'] = `${maxWidthPx}px`;
		}
		
		return element.createElement( BlockListBlock, { ...props, wrapperProps } );
	};
	addFilter(
		'editor.BlockListBlock',
		'liteword/maxwidth-position/wrapper',
		withWrapper,
		15 // 優先度を上げる
	);

	/* ─ Save extraProps（ネストカラム対応版） ─ */
	const applySave = (saveProps, blockType, attrs) => {
		const { maxWidthType, maxWidthPx, pcPosition, tbPosition, spPosition } = attrs;
		const classArr = [];
		
		// カラムブロックかどうかを判定
		const isColumn = isColumnBlock(blockType.name);
		
		// 既存のスタイルを保持
		let existingStyles = {};
		if (typeof saveProps.style === 'object' && saveProps.style !== null) {
			existingStyles = { ...saveProps.style };
		} else if (typeof saveProps.style === 'string') {
			existingStyles = styleStrToObj(saveProps.style);
		}

		// max-width関連の処理
		if (maxWidthType === '100%') {
			classArr.push('lw_max_width_100px');
		} else if (maxWidthType === '100vw') {
			classArr.push('lw_max_width_100vw');
		} else if (maxWidthType === 'px') {
			// 既存のスタイルを保持しながらmax-widthを設定
			existingStyles.maxWidth = `${maxWidthPx}px`;
			
			// カラムブロックの場合、追加のスタイル調整
			if (isColumn) {
				existingStyles.width = '100%';
				// flex-basisをautoにすることで、max-widthが効くようにする
				existingStyles.flexBasis = 'auto';
			}
		}

		// ポジション関連のクラスを追加
		[pcPosition, tbPosition, spPosition].forEach(c => c && classArr.push(c));

		// className の更新
		if (classArr.length) {
			const existingClasses = (saveProps.className || '').split(/\s+/).filter(Boolean);
			const allClasses = [...new Set([...existingClasses, ...classArr])];
			saveProps.className = allClasses.join(' ').trim();
		}

		// style の更新
		if (Object.keys(existingStyles).length > 0) {
			// スタイルオブジェクトまたは文字列として保存
			// カラムブロックの場合はオブジェクトのまま渡す
			if (isColumn) {
				saveProps.style = existingStyles;
			} else {
				saveProps.style = styleObjToStr(existingStyles);
			}
		}

		// データ属性を追加（デバッグと将来の参照用）
		if (maxWidthType === 'px') {
			saveProps['data-max-width'] = `${maxWidthPx}px`;
		}

		return saveProps;
	};
	addFilter(
		'blocks.getSaveContent.extraProps',
		'liteword/maxwidth-position/save', 
		applySave,
		15 // 優先度を上げる
	);
})();