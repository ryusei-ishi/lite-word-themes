/**
 * LiteWord – 固定ページタイトル 06（下層用）
 * src/fv-6/index.js
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	BlockControls,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	minHeightPcClassOptionArr,
	minHeightTbClassOptionArr,
	minHeightSpClassOptionArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/fv-6', {
	/* ----------------------------------------------------------
	 * 基本情報
	 * -------------------------------------------------------- */
	title: '固定ページタイトル 06（下層用）',
	icon: 'cover-image',
	category: 'liteword-firstview',
	supports: { anchor: true },

	/* ----------------------------------------------------------
	 * 属性
	 * -------------------------------------------------------- */
	attributes: {
		backgroundImage   : { type: 'string', default: 'https://cdn.pixabay.com/photo/2016/11/19/15/39/architecture-1839930_1280.jpg' },
		backgroundImageSp : { type: 'string', default: '' },
		mainTitle         : { type: 'string', default: '会社情報' },
		subTitle          : { type: 'string', default: 'COMPANY INFO' },
		filterBackgroundColor: { type: 'string', default: '#111' },
		filterOpacity     : { type: 'number', default: 0.3 },
		textColor         : { type: 'string', default: '#111' },
		minHeightPc       : { type: 'string', default: 'min-h-pc-400px' },
		minHeightTb       : { type: 'string', default: 'min-h-tb-360px' },
		minHeightSp       : { type: 'string', default: 'min-h-sp-280px' },
		/* ▼ 追加：メイン＋サブを囲むタグ */
		mainTitleTag      : { type: 'string', default: 'h1' },
	},


	/* ----------------------------------------------------------
	 * 編集画面
	 * -------------------------------------------------------- */
	edit( { attributes, setAttributes } ) {
		const {
			backgroundImage,
			backgroundImageSp,
			mainTitle,
			subTitle,
			filterBackgroundColor,
			filterOpacity,
			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,
			mainTitleTag,
		} = attributes;

		/* 固定ページ以外では警告 */
		const currentPostType = useSelect( select => select('core/editor').getCurrentPostType() );
		if ( currentPostType !== 'page' ) {
			return <p>このブロックは固定ページでのみ使用できます。</p>;
		}

		/* 画像選択ハンドラ */
		const onChangeBackgroundImage   = media => setAttributes( { backgroundImage: media.url } );
		const onChangeBackgroundImageSp = media => setAttributes( { backgroundImageSp: media.url } );

		const TagName = mainTitleTag || 'h1';

		return (
			<Fragment>
				{/* ▼ タイトルタグ切替ツールバー */}
				<BlockControls>
					<ToolbarGroup>
						{ [ 'h1', 'h2', 'h3', 'p' ].map( tag => (
							<ToolbarButton
								key={ tag }
								isPressed={ mainTitleTag === tag }
								onClick={ () => setAttributes( { mainTitleTag: tag } ) }
							>
								{ tag.toUpperCase() }
							</ToolbarButton>
						) ) }
					</ToolbarGroup>
				</BlockControls>

				{/* ▼ サイドバー設定 */}
				<InspectorControls>
					{/* 背景画像 */}
					<PanelBody title="背景画像設定">
						<p>PC 用画像</p>
						<MediaUpload
							onSelect={ onChangeBackgroundImage }
							allowedTypes={ [ 'image' ] }
							value={ backgroundImage }
							render={ ( { open } ) => (
								<>
									{ backgroundImage && (
										<>
											<img src={ backgroundImage } alt="" style={ { width: '100%', marginBottom: '10px' } } />
											<Button variant="secondary" onClick={ () => setAttributes( { backgroundImage: '' } ) } style={ { margin: '4px 4px 0 0' } }>
												画像を削除
											</Button>
										</>
									) }
									<Button variant="secondary" onClick={ open }>画像を選択</Button>
								</>
							) }
						/>
						<p style={ { marginTop: '16px' } }>スマホ用画像</p>
						<MediaUpload
							onSelect={ onChangeBackgroundImageSp }
							allowedTypes={ [ 'image' ] }
							value={ backgroundImageSp }
							render={ ( { open } ) => (
								<>
									{ backgroundImageSp && (
										<>
											<img src={ backgroundImageSp } alt="" style={ { width: '100%', marginBottom: '10px' } } />
											<Button variant="secondary" onClick={ () => setAttributes( { backgroundImageSp: '' } ) } style={ { margin: '4px 4px 0 0' } }>
												画像を削除
											</Button>
										</>
									) }
									<Button variant="secondary" onClick={ open }>画像を選択</Button>
								</>
							) }
						/>
					</PanelBody>

					{/* フィルター設定 */}
					<PanelBody title="フィルター設定">
						<p>フィルターの色</p>
						<ColorPalette
							value={ filterBackgroundColor }
							onChange={ color => setAttributes( { filterBackgroundColor: color } ) }
						/>
						<p>透明度</p>
						<RangeControl
							value={ filterOpacity }
							onChange={ val => setAttributes( { filterOpacity: val } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
					</PanelBody>

					{/* 文字色 */}
					<PanelBody title="全体の文字の色">
						<ColorPalette
							value={ textColor }
							onChange={ color => setAttributes( { textColor: color } ) }
						/>
					</PanelBody>

					{/* 高さ設定 */}
					<PanelBody title="高さ設定">
						<p>PC 高さ</p>
						<SelectControl
							value={ minHeightPc }
							options={ minHeightPcClassOptionArr() }
							onChange={ val => setAttributes( { minHeightPc: val } ) }
						/>
						<p>タブレット高さ</p>
						<SelectControl
							value={ minHeightTb }
							options={ minHeightTbClassOptionArr() }
							onChange={ val => setAttributes( { minHeightTb: val } ) }
						/>
						<p>スマホ高さ</p>
						<SelectControl
							value={ minHeightSp }
							options={ minHeightSpClassOptionArr() }
							onChange={ val => setAttributes( { minHeightSp: val } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ▼ エディタプレビュー */}
				<div className={ `fv-6 ${ minHeightPc } ${ minHeightTb } ${ minHeightSp }` }>
					<div className="fv-6_inner">
						<TagName className="ttl" style={ { color: textColor } }>
							<RichText
								tagName="span"
								className="main"
								value={ mainTitle }
								onChange={ val => setAttributes( { mainTitle: val } ) }
								placeholder="メインタイトルを入力"
								style={ { color: textColor } }
							/>
							<RichText
								tagName="span"
								className="sub"
								value={ subTitle }
								onChange={ val => setAttributes( { subTitle: val } ) }
								placeholder="サブタイトルを入力"
								style={ { color: textColor } }
							/>
						</TagName>
						<div className="inner_filter" />
					</div>
					<div className="bg_image">{ backgroundImage && <img src={ backgroundImage } alt="" /> }</div>
					<div className="filter" style={ { backgroundColor: filterBackgroundColor, opacity: filterOpacity } } />
				</div>
			</Fragment>
		);
	},

	/* ----------------------------------------------------------
	 * フロント出力
	 * -------------------------------------------------------- */
	save( { attributes } ) {
		const {
			backgroundImage,
			backgroundImageSp,
			mainTitle,
			subTitle,
			filterBackgroundColor,
			filterOpacity,
			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,
			mainTitleTag,
		} = attributes;

		const TagName = mainTitleTag || 'h1';

		return (
			<div className={ `fv-6 ${ minHeightPc } ${ minHeightTb } ${ minHeightSp }` }>
				<div className="fv-6_inner">
					<TagName className="ttl" style={ { color: textColor } }>
						<RichText.Content tagName="span" className="main" value={ mainTitle } style={ { color: textColor } } />
						<RichText.Content tagName="span" className="sub" value={ subTitle } style={ { color: textColor } } />
					</TagName>
					<div className="inner_filter" />
				</div>

				<div className="filter" style={ { backgroundColor: filterBackgroundColor, opacity: filterOpacity } } />

				{ backgroundImage && (
					<picture className="bg_image">
						<source srcSet={ backgroundImageSp } media="(max-width: 800px)" />
						<source srcSet={ backgroundImage } media="(min-width: 801px)" />
						<img src={ backgroundImage } alt="" loading="eager" fetchpriority="high" />
					</picture>
				) }
			</div>
		);
	},
});
