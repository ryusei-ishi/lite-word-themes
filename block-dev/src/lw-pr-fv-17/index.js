/**
 * LiteWord – 固定ページタイトル 05（下層用）
 * src/lw-pr-fv-17/index.js
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
	ToggleControl,
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
			bgImageLeftPc,
			bgImageLeftSp,
			bgImageRightPc,
			bgImageRightSp,
			bgImageOpacityPc,
			bgImageOpacitySp,
			bgImageLeftOpacityPc,
			bgImageLeftOpacitySp,
			bgImageRightOpacityPc,
			bgImageRightOpacitySp,
			marginBottomZero,
		} = attributes;

		// useBlockPropsは条件付きreturnの前に呼ぶ（Reactフックのルール）
		const blockProps = useBlockProps({
			className: `lw-pr-fv-17 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
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
					<PanelBody title="背景設定">
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
						<p style={ { marginTop: '16px' } }>PC用 透明度</p>
						<RangeControl
							value={ bgImageOpacityPc }
							onChange={ value => setAttributes( { bgImageOpacityPc: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
						<p>スマホ用 透明度</p>
						<RangeControl
							value={ bgImageOpacitySp }
							onChange={ value => setAttributes( { bgImageOpacitySp: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
					</PanelBody>

					{/* 左側背景画像設定 */}
					<PanelBody title="左側背景画像設定" initialOpen={ false }>
						<p>PC 用画像</p>
						<MediaUpload
							onSelect={ media => setAttributes( { bgImageLeftPc: media.url } ) }
							allowedTypes={ [ 'image' ] }
							value={ bgImageLeftPc }
							render={ ( { open } ) => (
								<>
									{ bgImageLeftPc && (
										<>
											<img
												src={ bgImageLeftPc }
												alt="選択した左側背景画像（PC）"
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ () => setAttributes( { bgImageLeftPc: '' } ) }
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
							onSelect={ media => setAttributes( { bgImageLeftSp: media.url } ) }
							allowedTypes={ [ 'image' ] }
							value={ bgImageLeftSp }
							render={ ( { open } ) => (
								<>
									{ bgImageLeftSp && (
										<>
											<img
												src={ bgImageLeftSp }
												alt="選択した左側背景画像（スマホ）"
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ () => setAttributes( { bgImageLeftSp: '' } ) }
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
						<p style={ { marginTop: '16px' } }>PC用 透明度</p>
						<RangeControl
							value={ bgImageLeftOpacityPc }
							onChange={ value => setAttributes( { bgImageLeftOpacityPc: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
						<p>スマホ用 透明度</p>
						<RangeControl
							value={ bgImageLeftOpacitySp }
							onChange={ value => setAttributes( { bgImageLeftOpacitySp: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
					</PanelBody>

					{/* 右側背景画像設定 */}
					<PanelBody title="右側背景画像設定" initialOpen={ false }>
						<p>PC 用画像</p>
						<MediaUpload
							onSelect={ media => setAttributes( { bgImageRightPc: media.url } ) }
							allowedTypes={ [ 'image' ] }
							value={ bgImageRightPc }
							render={ ( { open } ) => (
								<>
									{ bgImageRightPc && (
										<>
											<img
												src={ bgImageRightPc }
												alt="選択した右側背景画像（PC）"
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ () => setAttributes( { bgImageRightPc: '' } ) }
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
							onSelect={ media => setAttributes( { bgImageRightSp: media.url } ) }
							allowedTypes={ [ 'image' ] }
							value={ bgImageRightSp }
							render={ ( { open } ) => (
								<>
									{ bgImageRightSp && (
										<>
											<img
												src={ bgImageRightSp }
												alt="選択した右側背景画像（スマホ）"
												style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
											/>
											<Button
												onClick={ () => setAttributes( { bgImageRightSp: '' } ) }
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
						<p style={ { marginTop: '16px' } }>PC用 透明度</p>
						<RangeControl
							value={ bgImageRightOpacityPc }
							onChange={ value => setAttributes( { bgImageRightOpacityPc: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
						<p>スマホ用 透明度</p>
						<RangeControl
							value={ bgImageRightOpacitySp }
							onChange={ value => setAttributes( { bgImageRightOpacitySp: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
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
					<PanelBody title="色設定">
						<ColorPalette
							value={ textColor }
							onChange={ color => setAttributes( { textColor: color } ) }
						/>
					</PanelBody>

					{/* 高さ設定 */}
					<PanelBody title="レイアウト設定">
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
						<ToggleControl
							label="下の余白を0にする"
							help={ marginBottomZero ? 'margin-bottomが0に固定されます' : 'パンくずリストに応じて自動調整されます' }
							checked={ marginBottomZero }
							onChange={ value => setAttributes( { marginBottomZero: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ▼ エディタ上のプレビュー */}
				<div {...blockProps}>
					<div className="lw-pr-fv-17_inner">
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
					<div
						className="bg_image"
						style={ {
							'--bg_image-op-pc': `${bgImageOpacityPc}`,
							'--bg_image-op-sp': `${bgImageOpacitySp}`,
						} }
					>
						{ backgroundImage && <img src={ backgroundImage } alt="背景画像" /> }
					</div>
					<div
						className="bg_image_left"
						style={ {
							'--bg_image_left-op-pc': `${bgImageLeftOpacityPc}`,
							'--bg_image_left-op-sp': `${bgImageLeftOpacitySp}`,
						} }
					>
						{ bgImageLeftPc && <img src={ bgImageLeftPc } alt="左側背景画像" /> }
					</div>
					<div
						className="bg_image_right"
						style={ {
							'--bg_image_right-op-pc': `${bgImageRightOpacityPc}`,
							'--bg_image_right-op-sp': `${bgImageRightOpacitySp}`,
						} }
					>
						{ bgImageRightPc && <img src={ bgImageRightPc } alt="右側背景画像" /> }
					</div>
					<div
						className="bg_color"
						style={ { backgroundColor: filterBackgroundColor, opacity: filterOpacity } }
					/>
				</div>
			</>
		);
	},

	/* ----------------------------------------------------------
	 * フロント出力（動的ブロック - render.phpで出力）
	 * -------------------------------------------------------- */
	save() {
		return null;
	},
});
