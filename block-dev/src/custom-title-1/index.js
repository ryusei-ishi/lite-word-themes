/**
 * LiteWord – 見出しタイトル 01（復元版）
 * src/custom-title-1/index.js
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType( metadata.name, {
	/* ----------------------------------------------------------
	 * 編集画面
	 * -------------------------------------------------------- */
	edit: ( { attributes, setAttributes } ) => {
		const { mainTitle, subTitle, headingLevel, subMarginTopPc, subMarginTopSp } = attributes;

		/* 変更ハンドラ */
		const onChangeMainTitle     = value => setAttributes( { mainTitle: value } );
		const onChangeSubTitle      = value => setAttributes( { subTitle: value } );
		const onChangeHeadingLevel  = level => setAttributes( { headingLevel: level } );
		const onChangeSubMarginTopPc = value => setAttributes( { subMarginTopPc: value } );
		const onChangeSubMarginTopSp = value => setAttributes( { subMarginTopSp: value } );

		const TagName = `h${ headingLevel }`;

		// useBlockProps で apiVersion 3 対応のブロックプロパティを取得
		const blockProps = useBlockProps( {
			className: 'custom-title-1',
			style: {
				'--custom-title-sub-margin-top-pc': `${ subMarginTopPc }em`,
				'--custom-title-sub-margin-top-sp': `${ subMarginTopSp }em`,
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
					<PanelBody title="サブタイトルのマージン設定">
						<RangeControl
							label="PC版 下マージン (em)"
							value={ subMarginTopPc }
							onChange={ onChangeSubMarginTopPc }
							min={ -3 }
							max={ 4 }
							step={ 0.1 }
						/>
						<RangeControl
							label="スマホ版 下マージン (em)"
							value={ subMarginTopSp }
							onChange={ onChangeSubMarginTopSp }
							min={ -3 }
							max={ 4 }
							step={ 0.1 }
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
					/>
					<RichText
						tagName="span"
						className="sub"
						value={ subTitle }
						onChange={ onChangeSubTitle }
						placeholder="サブタイトルを入力"
					/>
				</TagName>
			</Fragment>
		);
	},

	/* ----------------------------------------------------------
	 * フロント出力
	 * -------------------------------------------------------- */
	save: ( { attributes } ) => {
		const { mainTitle, subTitle, headingLevel, subMarginTopPc, subMarginTopSp } = attributes;
		const TagName = `h${ headingLevel }`;

		// useBlockProps.save() で apiVersion 3 対応のブロックプロパティを取得
		const blockProps = useBlockProps.save( {
			className: 'custom-title-1',
			style: {
				'--custom-title-sub-margin-top-pc': `${ subMarginTopPc }em`,
				'--custom-title-sub-margin-top-sp': `${ subMarginTopSp }em`,
			},
		} );

		return (
			<TagName { ...blockProps }>
				<RichText.Content tagName="span" className="main" value={ mainTitle } />
				<RichText.Content tagName="span" className="sub" value={ subTitle } />
			</TagName>
		);
	},
});