/**
 * LiteWord – 見出しタイトル 01（復元版）
 * src/lw-pr-custom-title-15/index.js
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	BlockControls,
	InspectorControls,
	useBlockProps,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { fontWeightOptionsArr } from '../utils.js';

// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();
import { Fragment } from '@wordpress/element';

import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType( metadata.name, {
	/* ----------------------------------------------------------
	 * 編集画面
	 * -------------------------------------------------------- */
	edit: ( { attributes, setAttributes } ) => {
		const {
			mainTitle,
			subTitle,
			headingLevel,
			subMarginTopPc,
			subMarginTopSp,
			showSubTitle,
			afterColor = 'var(--color-main)',
			afterMarginTopPc = 1,
			afterMarginTopSp = 0.8,
			afterHeightPc = 4,
			afterHeightSp = 4,
			afterWidthPc = 50,
			afterWidthSp = 50,
			fontSizePc = 16,
			fontSizeSp = 16,
			mainFontWeight,
			subFontWeight,
			positionPc,
			positionSp,
		} = attributes;

		// 配置オプション
		const positionOptionsPc = [
			{ label: '中央', value: '' },
			{ label: '左寄せ', value: 'position_left_pc' },
			{ label: '右寄せ', value: 'position_right_pc' },
		];
		const positionOptionsSp = [
			{ label: 'PCと同じ', value: '' },
			{ label: '中央', value: 'position_center_sp' },
			{ label: '左寄せ', value: 'position_left_sp' },
			{ label: '右寄せ', value: 'position_right_sp' },
		];

		/* 変更ハンドラ */
		const onChangeMainTitle     = value => setAttributes( { mainTitle: value } );
		const onChangeSubTitle      = value => setAttributes( { subTitle: value } );
		const onChangeHeadingLevel  = level => setAttributes( { headingLevel: level } );
		const onChangeSubMarginTopPc = value => setAttributes( { subMarginTopPc: value } );
		const onChangeSubMarginTopSp = value => setAttributes( { subMarginTopSp: value } );

		const TagName = `h${ headingLevel }`;

		// useBlockProps で apiVersion 3 対応のブロックプロパティを取得
		const blockProps = useBlockProps( {
			className: `lw-pr-custom-title-15${ positionPc ? ` ${ positionPc }` : '' }${ positionSp ? ` ${ positionSp }` : '' }`,
			style: {
				'--custom-title-sub-margin-top-pc': `${ subMarginTopPc }em`,
				'--custom-title-sub-margin-top-sp': `${ subMarginTopSp }em`,
				'--title-15-after-color': afterColor,
				'--title-15-after-mt-pc': `${ afterMarginTopPc }em`,
				'--title-15-after-mt-sp': `${ afterMarginTopSp }em`,
				'--title-15-after-h-pc': `${ afterHeightPc }px`,
				'--title-15-after-h-sp': `${ afterHeightSp }px`,
				'--title-15-after-w-pc': `${ afterWidthPc }px`,
				'--title-15-after-w-sp': `${ afterWidthSp }px`,
				'--title-15-font-size_pc': `${ fontSizePc }px`,
				'--title-15-font-size_sp': `${ fontSizeSp }px`,
			},
		} );

		return (
			<Fragment>
				<BlockControls>
					<ToolbarGroup>
						{ [ 1 , 2, 3, 4, 5 ].map( level => (
							<ToolbarButton
								key={ level }
								isPressed={ headingLevel === level }
								onClick={ () => onChangeHeadingLevel( level ) }
							>
								{ `H${ level }` }
							</ToolbarButton>
						) ) }
					</ToolbarGroup>
				</BlockControls>

				<InspectorControls>
					<PanelBody title="サブタイトル設定">
						<ToggleControl
							label="サブタイトルを表示"
							checked={ showSubTitle }
							onChange={ value => setAttributes( { showSubTitle: value } ) }
						/>
						{ showSubTitle && (
							<>
								<RangeControl
									label="PC版 上マージン (em)"
									value={ subMarginTopPc }
									onChange={ onChangeSubMarginTopPc }
									min={ -3 }
									max={ 4 }
									step={ 0.1 }
								/>
								<RangeControl
									label="スマホ版 上マージン (em)"
									value={ subMarginTopSp }
									onChange={ onChangeSubMarginTopSp }
									min={ -3 }
									max={ 4 }
									step={ 0.1 }
								/>
							</>
						) }
					</PanelBody>
					<PanelBody title="線（after）の設定" initialOpen={ false }>
						<p style={ { marginBottom: '8px' } }>線の色</p>
						<ColorPalette
							value={ afterColor }
							onChange={ value => setAttributes( { afterColor: value || 'var(--color-main)' } ) }
						/>
						<RangeControl
							label="PC版 高さ (px)"
							value={ afterHeightPc }
							onChange={ value => setAttributes( { afterHeightPc: value } ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
						/>
						<RangeControl
							label="スマホ版 高さ (px)"
							value={ afterHeightSp }
							onChange={ value => setAttributes( { afterHeightSp: value } ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
						/>
						<RangeControl
							label="PC版 幅 (px)"
							value={ afterWidthPc }
							onChange={ value => setAttributes( { afterWidthPc: value } ) }
							min={ 10 }
							max={ 200 }
							step={ 5 }
						/>
						<RangeControl
							label="スマホ版 幅 (px)"
							value={ afterWidthSp }
							onChange={ value => setAttributes( { afterWidthSp: value } ) }
							min={ 10 }
							max={ 200 }
							step={ 5 }
						/>
						<RangeControl
							label="PC版 上マージン (em)"
							value={ afterMarginTopPc }
							onChange={ value => setAttributes( { afterMarginTopPc: value } ) }
							min={ 0 }
							max={ 3 }
							step={ 0.1 }
						/>
						<RangeControl
							label="スマホ版 上マージン (em)"
							value={ afterMarginTopSp }
							onChange={ value => setAttributes( { afterMarginTopSp: value } ) }
							min={ 0 }
							max={ 3 }
							step={ 0.1 }
						/>
					</PanelBody>
					<PanelBody title="基準となるフォントサイズ" initialOpen={ false }>
						<RangeControl
							label="PC版 (px)"
							value={ fontSizePc }
							onChange={ value => setAttributes( { fontSizePc: value } ) }
							min={ 10 }
							max={ 24 }
							step={ 1 }
						/>
						<RangeControl
							label="スマホ版 (px)"
							value={ fontSizeSp }
							onChange={ value => setAttributes( { fontSizeSp: value } ) }
							min={ 10 }
							max={ 24 }
							step={ 1 }
						/>
					</PanelBody>
					<PanelBody title="フォントの太さ" initialOpen={ false }>
						<SelectControl
							label="メインタイトル"
							value={ mainFontWeight }
							options={ fontWeightOptions }
							onChange={ value => setAttributes( { mainFontWeight: value } ) }
						/>
						<SelectControl
							label="サブタイトル"
							value={ subFontWeight }
							options={ fontWeightOptions }
							onChange={ value => setAttributes( { subFontWeight: value } ) }
						/>
					</PanelBody>
					<PanelBody title="配置" initialOpen={ false }>
						<SelectControl
							label="PC版"
							value={ positionPc }
							options={ positionOptionsPc }
							onChange={ value => setAttributes( { positionPc: value } ) }
						/>
						<SelectControl
							label="スマホ版"
							value={ positionSp }
							options={ positionOptionsSp }
							onChange={ value => setAttributes( { positionSp: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				<TagName { ...blockProps }>
					<RichText
						tagName="span"
						className="main"
						value={ mainTitle }
						onChange={ onChangeMainTitle }
						placeholder="メインタイトルを入力"
						style={ { fontWeight: mainFontWeight || undefined } }
					/>
					{ showSubTitle && (
						<RichText
							tagName="span"
							className="sub"
							value={ subTitle }
							onChange={ onChangeSubTitle }
							placeholder="サブタイトルを入力"
							style={ { fontWeight: subFontWeight || undefined } }
						/>
					) }
				</TagName>
			</Fragment>
		);
	},

	/* ----------------------------------------------------------
	 * フロント出力
	 * -------------------------------------------------------- */
	save: ( { attributes } ) => {
		const {
			mainTitle,
			subTitle,
			headingLevel,
			subMarginTopPc,
			subMarginTopSp,
			showSubTitle,
			afterColor = 'var(--color-main)',
			afterMarginTopPc = 1,
			afterMarginTopSp = 0.8,
			afterHeightPc = 4,
			afterHeightSp = 4,
			afterWidthPc = 50,
			afterWidthSp = 50,
			fontSizePc = 16,
			fontSizeSp = 16,
			mainFontWeight,
			subFontWeight,
			positionPc,
			positionSp,
		} = attributes;
		const TagName = `h${ headingLevel }`;

		// useBlockProps.save() で apiVersion 3 対応のブロックプロパティを取得
		const blockProps = useBlockProps.save( {
			className: `lw-pr-custom-title-15${ positionPc ? ` ${ positionPc }` : '' }${ positionSp ? ` ${ positionSp }` : '' }`,
			style: {
				'--custom-title-sub-margin-top-pc': `${ subMarginTopPc }em`,
				'--custom-title-sub-margin-top-sp': `${ subMarginTopSp }em`,
				'--title-15-after-color': afterColor,
				'--title-15-after-mt-pc': `${ afterMarginTopPc }em`,
				'--title-15-after-mt-sp': `${ afterMarginTopSp }em`,
				'--title-15-after-h-pc': `${ afterHeightPc }px`,
				'--title-15-after-h-sp': `${ afterHeightSp }px`,
				'--title-15-after-w-pc': `${ afterWidthPc }px`,
				'--title-15-after-w-sp': `${ afterWidthSp }px`,
				'--title-15-font-size_pc': `${ fontSizePc }px`,
				'--title-15-font-size_sp': `${ fontSizeSp }px`,
			},
		} );

		return (
			<TagName { ...blockProps }>
				{ mainTitle && (
					<RichText.Content
						tagName="span"
						className="main"
						value={ mainTitle }
						style={ mainFontWeight ? { fontWeight: mainFontWeight } : undefined }
					/>
				) }
				{ showSubTitle && subTitle && (
					<RichText.Content
						tagName="span"
						className="sub"
						value={ subTitle }
						style={ subFontWeight ? { fontWeight: subFontWeight } : undefined }
					/>
				) }
			</TagName>
		);
	},
});