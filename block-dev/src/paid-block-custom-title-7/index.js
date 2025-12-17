import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	BlockControls,
	ColorPalette,
	useBlockProps,
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

import metadata from './block.json';

registerBlockType(metadata.name, {
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
			positionClass, // ★ 追加
		} = attributes;

		const Tag = `h${ headingLevel }`;

		const blockProps = useBlockProps({
			className: `paid-block-custom-title-7 ${ sizeClass } ${ positionClass }`
		});

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
						{ [2,3,4,5].map( lvl => (
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
					{/* サイズ選択を最上部に配置 */}
					<PanelBody title="サイズ設定" initialOpen>
						<RadioControl
							label="サイズ"
							selected={ sizeClass }
							options={ [
								{ label: '大 (L)', value: 'size_l' },
								{ label: '中 (M)', value: 'size_m' },
								{ label: '小 (S)', value: 'size_s' },
							] }
							onChange={ v => setAttributes( { sizeClass: v } ) }
						/>
					</PanelBody>

					{/* ★ 追加：位置設定 */}
					<PanelBody title="位置設定" initialOpen>
						<RadioControl
							label="配置"
							selected={ positionClass }
							options={ [
								{ label: '左寄せ', value: 'position_left' },
								{ label: '中央',   value: 'position_center' },
								{ label: '右寄せ', value: 'position_right' },
							] }
							onChange={ v => setAttributes( { positionClass: v } ) }
						/>
					</PanelBody>

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
				<div {...blockProps}>
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
			positionClass, // ★ 追加
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `paid-block-custom-title-7 ${ sizeClass } ${ positionClass }`
		});

		const Tag = `h${ headingLevel }`;

		return (
			<div {...blockProps}>
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
