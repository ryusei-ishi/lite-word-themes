/**
 * LiteWord – 見出しタイトル 01（復元版）
 * src/custom-title-1/index.js
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	BlockControls,
	InspectorControls,
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

registerBlockType('wdl/custom-title-1', {
	/* ----------------------------------------------------------
	 * 基本情報
	 * -------------------------------------------------------- */
	title: '見出しタイトル 01',
	icon: 'editor-textcolor',
	category: 'liteword-title',
	supports: { anchor: true },

	/* ----------------------------------------------------------
	 * 属性
	 * -------------------------------------------------------- */
	attributes: {
		mainTitle:   { type: 'string', default: 'タイトル' },
		subTitle:    { type: 'string', default: 'サブタイトル' },
		headingLevel:{ type: 'number', default: 2 }, // h2
		subMarginTopPc: { type: 'number', default: 0.2 },
		subMarginTopSp: { type: 'number', default: 0.2 },
	},


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

		// インラインスタイルでCSS変数を設定
		const inlineStyle = {
			'--custom-title-sub-margin-top-pc': `${ subMarginTopPc }em`,
			'--custom-title-sub-margin-top-sp': `${ subMarginTopSp }em`,
		};

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

				<TagName className="custom-title-1" style={ inlineStyle }>
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

		// インラインスタイルでCSS変数を設定
		const inlineStyle = {
			'--custom-title-sub-margin-top-pc': `${ subMarginTopPc }em`,
			'--custom-title-sub-margin-top-sp': `${ subMarginTopSp }em`,
		};

		return (
			<TagName className="custom-title-1" style={ inlineStyle }>
				<RichText.Content tagName="span" className="main" value={ mainTitle } />
				<RichText.Content tagName="span" className="sub" value={ subTitle } />
			</TagName>
		);
	},
});