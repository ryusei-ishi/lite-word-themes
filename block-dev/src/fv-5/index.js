/**
 * LiteWord – 固定ページタイトル 05（下層用）
 * src/fv-5/index.js
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	BlockControls,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
	minHeightPcClassOptionArr,
	minHeightTbClassOptionArr,
	minHeightSpClassOptionArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
	/* ----------------------------------------------------------
	 * 編集画面
	 * -------------------------------------------------------- */
	edit( { attributes, setAttributes } ) {
		const {
			backgroundImage,
			backgroundImageSp,
			mainTitle,
			description,
			filterBackgroundColor,
			filterOpacity,
			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,
			mainTitleTag,
		} = attributes;

		// useBlockPropsは条件付きreturnの前に呼ぶ（Reactフックのルール）
		const blockProps = useBlockProps({
			className: `fv-5 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		/* ▼ 現在編集中の投稿タイプを取得し、固定ページ以外なら警告を表示 */
		const currentPostType = useSelect( select => select('core/editor').getCurrentPostType() );
		if ( currentPostType !== 'page' ) {
			return <div {...blockProps}><p>このブロックは固定ページでのみ使用できます。</p></div>;
		}

		/* ----- イベントハンドラ ----- */
		const onChangeBackgroundImage   = media => setAttributes( { backgroundImage   : media.url } );
		const onChangeBackgroundImageSp = media => setAttributes( { backgroundImageSp : media.url } );
		const TagName = mainTitleTag || 'h1';

		return (
			<>
				{/* ▼ タイトルタグ切り替えツールバー */}
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
					{/* 背景画像設定 */}
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
											<img
												src={ backgroundImage }
												alt="選択した背景画像"
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ () => setAttributes( { backgroundImage: '' } ) }
												variant="secondary"
												style={ { margin: '4px 4px 0 0' } }
											>
												画像を削除
											</Button>
										</>
									) }
									<Button onClick={ open } variant="secondary">
										画像を選択
									</Button>
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
											<img
												src={ backgroundImageSp }
												alt="選択した背景画像"
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ () => setAttributes( { backgroundImageSp: '' } ) }
												variant="secondary"
												style={ { margin: '4px 4px 0 0' } }
											>
												画像を削除
											</Button>
										</>
									) }
									<Button onClick={ open } variant="secondary">
										画像を選択
									</Button>
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
							onChange={ value => setAttributes( { filterOpacity: value } ) }
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
						<p>PC 用高さ</p>
						<SelectControl
							value={ minHeightPc }
							options={ minHeightPcClassOptionArr() }
							onChange={ value => setAttributes( { minHeightPc: value } ) }
						/>
						<p>タブレット用高さ</p>
						<SelectControl
							value={ minHeightTb }
							options={ minHeightTbClassOptionArr() }
							onChange={ value => setAttributes( { minHeightTb: value } ) }
						/>
						<p>スマートフォン用高さ</p>
						<SelectControl
							value={ minHeightSp }
							options={ minHeightSpClassOptionArr() }
							onChange={ value => setAttributes( { minHeightSp: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ▼ エディタ上のプレビュー */}
				<div {...blockProps}>
					<div className="fv-5_inner">
						<TagName className="ttl" style={ { color: textColor } }>
							<RichText
								tagName="span"
								className="main"
								value={ mainTitle }
								onChange={ value => setAttributes( { mainTitle: value } ) }
								placeholder="メインタイトルを入力"
								style={ { color: textColor } }
							/>
						</TagName>
						<RichText
							tagName="p"
							className="description"
							value={ description }
							onChange={ value => setAttributes( { description: value } ) }
							placeholder="説明文を入力"
							style={ { color: textColor } }
						/>
					</div>
					<div className="bg_image">
						{ backgroundImage && <img src={ backgroundImage } alt="背景画像" /> }
					</div>
					<div
						className="filter"
						style={ { backgroundColor: filterBackgroundColor, opacity: filterOpacity } }
					/>
				</div>
			</>
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
			description,
			filterBackgroundColor,
			filterOpacity,
			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,
			mainTitleTag,
		} = attributes;

		const TagName = mainTitleTag || 'h1';

		const blockProps = useBlockProps.save({
			className: `fv-5 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		return (
			<div {...blockProps}>
				<div className="fv-5_inner">
					<TagName className="ttl" style={ { color: textColor } }>
						<RichText.Content
							tagName="span"
							className="main"
							value={ mainTitle }
							style={ { color: textColor } }
						/>
					</TagName>
					<RichText.Content
						tagName="p"
						className="description"
						value={ description }
						style={ { color: textColor } }
					/>
				</div>

				<div
					className="filter"
					style={ { backgroundColor: filterBackgroundColor, opacity: filterOpacity } }
				/>

				{ backgroundImage && (
					<picture className="bg_image">
						<source srcSet={ backgroundImageSp } media="(max-width: 800px)" />
						<source srcSet={ backgroundImage } media="(min-width: 801px)" />
						<img src={ backgroundImage } alt="背景画像" loading="eager" fetchpriority="high" />
					</picture>
				) }
			</div>
		);
	},
});
