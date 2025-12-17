import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	BlockControls,
	ColorPalette,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	ToolbarGroup,
	ToolbarButton,
	RadioControl,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType( metadata.name, {
	/* ========================== edit ========================== */
	edit( { attributes, setAttributes } ) {
		const {
			subTitle, mainTitle, headingLevel, mainTitleColor, sizeClass,
			leftImage, rightImage, leftHeightEm, rightHeightEm,
			leftMarginEm, rightMarginEm, positionClass,
			hideSubTitle, hideMainTitle,
			bdThickness, bdMarginTopEm, bdDisplay,
			ttlFullWidth,
		} = attributes;

		const Tag = `h${ headingLevel }`;

		const blockProps = useBlockProps({
			className: `paid-block-custom-title-10 ${ positionClass } ${ sizeClass }`
		});

		const onSelectImage = ( side ) => ( media ) => setAttributes( { [ side ]: media.url } );
		const removeImage   = ( side ) => setAttributes( { [ side ]: '' } );

		return (
			<>
				{/* ───── ツールバー：見出しレベル ───── */}
				<BlockControls>
					<ToolbarGroup>
						{ [ 2, 3, 4 ].map( lvl => (
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

				{/* ───── サイドバー ───── */}
				<InspectorControls>
					{/* サイズ */}
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

					{/* 配置 */}
					<PanelBody title="配置設定" initialOpen>
						<RadioControl
							label="左右中央の配置"
							selected={ positionClass }
							options={ [
								{ label: '左寄せ',   value: 'position_left' },
								{ label: '中央寄せ', value: 'position_center' },
								{ label: '右寄せ',   value: 'position_right' },
							] }
							onChange={ v => setAttributes( { positionClass: v } ) }
						/>
						<ToggleControl
							label="タイトルを全幅にする"
							checked={ ttlFullWidth === 'on' }
							onChange={ v => setAttributes( { ttlFullWidth: v ? 'on' : 'off' } ) }
						/>
					</PanelBody>

					{/* メインカラー */}
					<PanelBody title="メインカラー" initialOpen>
						<p>メインカラー</p>
						<ColorPalette
							value={ mainTitleColor }
							onChange={ c => setAttributes( { mainTitleColor: c } ) }
						/>
					</PanelBody>

					{/* 画像設定 */}
					<PanelBody title="画像設定" initialOpen>
						{/* 左画像 */}
						<p className="components-base-control__label">左画像</p>
						<MediaUploadCheck>
							<MediaUpload
								onSelect = { onSelectImage( 'leftImage' ) }
								allowedTypes = { [ 'image' ] }
								value  = { leftImage }
								render = { ( { open } ) => (
									leftImage ? (
										<>
											<img src={ leftImage } style={ { maxWidth: '100%', marginBottom: 20 } } />
											<Button isSecondary onClick={ () => removeImage( 'leftImage' ) }>削除</Button>
										</>
									) : (
										<Button isPrimary onClick={ open }>画像を選択</Button>
									)
								) }
							/>
						</MediaUploadCheck>
						<br /><br />
						<RangeControl
							label="左画像 大きさ (em)"
							min={ 0.1 } max={ 2 } step={ 0.05 }
							value={ leftHeightEm }
							onChange={ v => setAttributes( { leftHeightEm: v } ) }
						/>
						<RangeControl
							label="左画像 余白 (em)"
							min={ 0 } max={ 2 } step={ 0.05 }
							value={ leftMarginEm }
							onChange={ v => setAttributes( { leftMarginEm: v } ) }
						/>
						<br /><br />

						{/* 右画像 */}
						<p className="components-base-control__label">右画像</p>
						<MediaUploadCheck>
							<MediaUpload
								onSelect = { onSelectImage( 'rightImage' ) }
								allowedTypes = { [ 'image' ] }
								value  = { rightImage }
								render = { ( { open } ) => (
									rightImage ? (
										<>
											<img src={ rightImage } style={ { maxWidth: '100%', marginBottom: 20 } } />
											<Button isSecondary onClick={ () => removeImage( 'rightImage' ) }>削除</Button>
										</>
									) : (
										<Button isPrimary onClick={ open }>画像を選択</Button>
									)
								) }
							/>
						</MediaUploadCheck>
						<br /><br />
						<RangeControl
							label="右画像 大きさ (em)"
							min={ 0.1 } max={ 2 } step={ 0.05 }
							value={ rightHeightEm }
							onChange={ v => setAttributes( { rightHeightEm: v } ) }
						/>
						<RangeControl
							label="右画像 余白 (em)"
							min={ 0 } max={ 2 } step={ 0.05 }
							value={ rightMarginEm }
							onChange={ v => setAttributes( { rightMarginEm: v } ) }
						/>
					</PanelBody>

					{/* タイトル表示切替 */}
					<PanelBody title="タイトル表示設定" initialOpen={ true }>
						<ToggleControl
							label="subタイトルを非表示にする"
							checked={ hideSubTitle === 'on' }
							onChange={ v => setAttributes( { hideSubTitle: v ? 'on' : 'off' } ) }
						/>
						<ToggleControl
							label="mainタイトルを非表示にする"
							checked={ hideMainTitle === 'on' }
							onChange={ v => setAttributes( { hideMainTitle: v ? 'on' : 'off' } ) }
						/>
					</PanelBody>

					{/* ─── 追加：bd 設定 ─── */}
					<PanelBody title="下線の設定" initialOpen={ true }>
						<ToggleControl
							label="ON / OFF"
							checked={ bdDisplay === 'on' }
							onChange={ v => setAttributes( { bdDisplay: v ? 'on' : 'off' } ) }
						/>
						<RangeControl
							label="太さ (px)"
							min={ 0 } max={ 10 } step={ 1 }
							value={ bdThickness }
							onChange={ v => setAttributes( { bdThickness: v } ) }
						/>
						<RangeControl
							label="上マージン (em)"
							min={ 0 } max={ 2 } step={ 0.05 }
							value={ bdMarginTopEm }
							onChange={ v => setAttributes( { bdMarginTopEm: v } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ───── プレビュー ───── */}
				<div {...blockProps}>
					<Tag className={ `ttl${ ttlFullWidth === 'on' ? ' w_100' : '' }` }>
						{/* 左画像 */}
						{ leftImage && (
							<span
								className="image_left"
								style={ {
									height     : `${ leftHeightEm }em`,
									marginRight: `${ leftMarginEm }em`,
								} }
							>
								<img src={ leftImage } alt="" />
							</span>
						) }

						{/* テキスト */}
						<span className="text_wrap">
							{ hideSubTitle === 'off' && (
								<RichText
									tagName="span"
									className="sub"
									value={ subTitle }
									onChange={ v => setAttributes( { subTitle: v } ) }
									placeholder="サブタイトルを入力"
									style={ { color: mainTitleColor } }
								/>
							) }
							{ hideMainTitle === 'off' && (
								<RichText
									tagName="span"
									className="main"
									value={ mainTitle }
									onChange={ v => setAttributes( { mainTitle: v } ) }
									placeholder="メインタイトルを入力"
								/>
							) }
						</span>

						{/* 右画像 */}
						{ rightImage && (
							<span
								className="image_right"
								style={ {
									height    : `${ rightHeightEm }em`,
									marginLeft: `${ rightMarginEm }em`,
								} }
							>
								<img src={ rightImage } alt="" />
							</span>
						) }

						{/* 区切り線 bd */}
						{ bdDisplay === 'on' && (
							<span
								className="bd"
								style={ {
									backgroundColor: mainTitleColor,
									height        : `${ bdThickness }px`,
									marginTop     : `${ bdMarginTopEm }em`,
								} }
							/>
						) }
					</Tag>
				</div>
			</>
		);
	},

	/* ========================== save ========================== */
	save( { attributes } ) {
		const {
			subTitle, mainTitle, headingLevel, mainTitleColor, sizeClass,
			leftImage, rightImage, leftHeightEm, rightHeightEm,
			leftMarginEm, rightMarginEm, positionClass,
			hideSubTitle, hideMainTitle,
			bdThickness, bdMarginTopEm, bdDisplay,
			ttlFullWidth,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `paid-block-custom-title-10 ${ positionClass } ${ sizeClass }`
		});

		const Tag = `h${ headingLevel }`;

		const maybeImage = ( url, cls, styleObj ) =>
			url && (
				<span className={ cls } style={ styleObj }>
					<img src={ url } alt="" />
				</span>
			);

		const maybeText = ( val, cls, styleObj ) =>
			val && (
				<RichText.Content
					tagName="span"
					className={ cls }
					value={ val }
					style={ styleObj }
				/>
			);

		return (
			<div {...blockProps}>
				<Tag className={ `ttl${ ttlFullWidth === 'on' ? ' w_100' : '' }` }>
					{/* 左画像 */}
					{ maybeImage(
						leftImage,
						'image_left',
						{
							height     : `${ leftHeightEm }em`,
							marginRight: `${ leftMarginEm }em`,
						},
					) }

					{/* テキスト */}
					<span className="text_wrap">
						{ hideSubTitle === 'off' && maybeText( subTitle, 'sub', { color: mainTitleColor } ) }
						{ hideMainTitle === 'off' && maybeText( mainTitle, 'main' ) }
					</span>

					{/* 右画像 */}
					{ maybeImage(
						rightImage,
						'image_right',
						{
							height    : `${ rightHeightEm }em`,
							marginLeft: `${ rightMarginEm }em`,
						},
					) }

					{/* 区切り線 bd */}
					{ bdDisplay === 'on' && (
						<span
							className="bd"
							style={ {
								backgroundColor: mainTitleColor,
								height        : `${ bdThickness }px`,
								marginTop     : `${ bdMarginTopEm }em`,
							} }
						/>
					) }
				</Tag>
			</div>
		);
	},
} );
