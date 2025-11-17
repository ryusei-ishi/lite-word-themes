import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	BlockControls,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	RangeControl,
	RadioControl,
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/paid-block-custom-title-8', {
	title   : '見出しタイトル 08',
	icon    : 'editor-textcolor',
	category: 'liteword-title',
	supports: { anchor: true },

	attributes: {
		subTitle      : { type: 'string',  default: '製品紹介' },
		mainTitle     : { type: 'string',  default: 'PRODUCTS' },
		headingLevel  : { type: 'number',  default: 2 },
		mainTitleColor: { type: 'string',  default: 'var(--color-main)' },

		borderLeftColor   : { type: 'string',  default: 'var(--color-main)' },
		borderRightColor  : { type: 'string',  default: 'var(--color-main)' },
		borderLeftOpacity : { type: 'number',  default: 100 },   // %
		borderRightOpacity: { type: 'number',  default: 20 },    // %
		borderRadius      : { type: 'number',  default: 10 },    // px

		sizeClass     : { type: 'string', default: 'size_m' },
		positionClass : { type: 'string', default: 'position_left' },
		// ▼ 追加：スマホサイズ
		sizeSpClass   : { type: 'string', default: '' }, // 未選択は空文字
	},

	/* ---------------------------------------------------------- */
	edit: ( { attributes, setAttributes } ) => {
		const {
			subTitle,
			mainTitle,
			headingLevel,
			mainTitleColor,
			borderLeftColor,
			borderRightColor,
			borderLeftOpacity,
			borderRightOpacity,
			borderRadius,
			sizeClass,
			positionClass,
			sizeSpClass,          // ← 追加
		} = attributes;

		const Tag = `h${ headingLevel }`;

		/* mainTitleColor 更新時に未カスタムの border 色を同期 */
		const prevMain = useRef( mainTitleColor );
		useEffect( () => {
			if ( borderLeftColor === prevMain.current ) {
				setAttributes( { borderLeftColor: mainTitleColor } );
			}
			if ( borderRightColor === prevMain.current ) {
				setAttributes( { borderRightColor: mainTitleColor } );
			}
			prevMain.current = mainTitleColor;
		}, [ mainTitleColor ] );

		return (
			<>
				{/* ツールバー：見出しレベル */}
				<BlockControls>
					<ToolbarGroup>
						{ [2,3,4].map( lvl => (
							<ToolbarButton
								key={ lvl }
								isPressed={ headingLevel === lvl }
								onClick={ () => setAttributes( { headingLevel: lvl } ) }
							>
								{ `H${ lvl }` }
							</ToolbarButton>
						) ) }
					</ToolbarGroup>
				</BlockControls>

				{/* サイドバー */}
				<InspectorControls>
					{/* サイズ設定 */}
					<PanelBody title="サイズ設定" initialOpen>
						<RadioControl
							label="PCサイズ"
							selected={ sizeClass }
							options={ [
								{ label: '大 (L)', value: 'size_l' },
								{ label: '中 (M)', value: 'size_m' },
								{ label: '小 (S)', value: 'size_s' },
							] }
							onChange={ v => setAttributes( { sizeClass: v } ) }
						/>
					</PanelBody>

					{/* ★ 追加：スマホサイズ設定 */}
					<PanelBody title="スマホサイズ設定" initialOpen>
						<RadioControl
							label="SPサイズ"
							selected={ sizeSpClass }
							options={ [
								{ label: '未選択', value: '' },
								{ label: '大 (L)', value: 'size_l_sp' },
								{ label: '中 (M)', value: 'size_m_sp' },
								{ label: '小 (S)', value: 'size_s_sp' },
							] }
							onChange={ v => setAttributes( { sizeSpClass: v } ) }
						/>
					</PanelBody>

					{/* 位置設定 */}
					<PanelBody title="位置設定" initialOpen>
						<RadioControl
							label="配置"
							selected={ positionClass }
							options={ [
								{ label: '左寄せ', value: 'position_left' },
								{ label: '右寄せ', value: 'position_right' },
							] }
							onChange={ v => setAttributes( { positionClass: v } ) }
						/>
					</PanelBody>

					{/* カラー設定 */}
					<PanelBody title="カラー設定" initialOpen>
						<p>メインタイトルカラー</p>
						<ColorPalette
							value={ mainTitleColor }
							onChange={ c => setAttributes( { mainTitleColor: c } ) }
						/>

						<p className="components-base-control__label">左ボーダーカラー</p>
						<ColorPalette
							value={ borderLeftColor }
							onChange={ c => setAttributes( { borderLeftColor: c } ) }
						/>

						<p className="components-base-control__label">右ボーダーカラー</p>
						<ColorPalette
							value={ borderRightColor }
							onChange={ c => setAttributes( { borderRightColor: c } ) }
						/>
					</PanelBody>

					{/* デザイン詳細 */}
					<PanelBody title="デザイン詳細" initialOpen>
						<RangeControl
							label="左ボーダー透明度（%）"
							min={ 0 } max={ 100 } step={ 0.1 }
							value={ borderLeftOpacity }
							onChange={ v => setAttributes( { borderLeftOpacity: v } ) }
						/>
						<RangeControl
							label="右ボーダー透明度（%）"
							min={ 0 } max={ 100 } step={ 0.1 }
							value={ borderRightOpacity }
							onChange={ v => setAttributes( { borderRightOpacity: v } ) }
						/>
						<RangeControl
							label="ボーダー角丸（px）"
							min={ 0 } max={ 100 } step={ 1 }
							value={ borderRadius }
							onChange={ v => setAttributes( { borderRadius: v } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{/* プレビュー */}
				<div className={ `paid-block-custom-title-8 ${ sizeClass } ${ sizeSpClass } ${ positionClass }` }>
					<Tag className="ttl">
						<RichText
							tagName="span"
							className="sub"
							value={ subTitle }
							onChange={ v => setAttributes( { subTitle: v } ) }
							placeholder="サブタイトルを入力"
							style={ { color: mainTitleColor } }
						/>
						<RichText
							tagName="span"
							className="main"
							value={ mainTitle }
							onChange={ v => setAttributes( { mainTitle: v } ) }
							placeholder="メインタイトルを入力"
						/>

						<span className="border_wrap">
							<span
								className="border_inner"
								style={ { borderRadius: `${ borderRadius }px` } }
							>
								<span
									className="border left"
									style={ {
										backgroundColor: borderLeftColor,
										opacity       : borderLeftOpacity / 100,
									} }
								/>
								<span
									className="border right"
									style={ {
										backgroundColor: borderRightColor,
										opacity       : borderRightOpacity / 100,
									} }
								/>
							</span>
						</span>
					</Tag>
				</div>
			</>
		);
	},

	/* ---------------------------------------------------------- */
	save: ( { attributes } ) => {
		const {
			subTitle,
			mainTitle,
			headingLevel,
			mainTitleColor,
			borderLeftColor,
			borderRightColor,
			borderLeftOpacity,
			borderRightOpacity,
			borderRadius,
			sizeClass,
			positionClass,
			sizeSpClass, // ← 追加
		} = attributes;

		const Tag = `h${ headingLevel }`;

		return (
			<div className={ `paid-block-custom-title-8 ${ sizeClass } ${ sizeSpClass } ${ positionClass }` }>
				<Tag className="ttl">
					<RichText.Content
						tagName="span"
						className="sub"
						value={ subTitle }
						style={ { color: mainTitleColor } }
					/>
					<RichText.Content
						tagName="span"
						className="main"
						value={ mainTitle }
					/>

					<span className="border_wrap">
						<span
							className="border_inner"
							style={ { borderRadius: `${ borderRadius }px` } }
						>
							<span
								className="border left"
								style={ {
									backgroundColor: borderLeftColor,
									opacity       : borderLeftOpacity / 100,
								} }
							/>
							<span
								className="border right"
								style={ {
									backgroundColor: borderRightColor,
									opacity       : borderRightOpacity / 100,
								} }
							/>
						</span>
					</span>
				</Tag>
			</div>
		);
	},
});
