/**
 * LiteWord – PRリスト 06
 * ------------------------------------------------------------
 *  • ブロック名 : wdl/lw-pr-list-6
 *  • 画像付きリストブロック
 * ----------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	SelectControl,
	RangeControl,
	ToggleControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import {
	fontOptionsArr,
	fontWeightOptionsArr,
} from '../utils.js';
import metadata from './block.json';

/* ─────────────────────────  定数  ───────────────────────── */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType( metadata.name, {
	/* ==================================================
	 * 編集画面
	 * ================================================= */
	edit( { attributes, setAttributes } ) {
		const {
			columnsPC,
			columnsSP,
			rowGapPc,
			rowGapSp,
			columnGapPc,
			columnGapSp,
			imageAspectRatio,
			fontTitle,
			fontWeightTitle,
			colorTitle,
			fontSizeTtlPc,
			fontSizeTtlTb,
			fontSizeTtlSp,
			alignTtlPc,
			alignTtlSp,
			marginTopTtlPc,
			marginTopTtlSp,
			fontDescription,
			fontWeightDescription,
			colorDescription,
			fontSizePPc,
			fontSizePTb,
			fontSizePSp,
			alignPPc,
			alignPSp,
			showLabel,
			labelBgColor,
			labelTextColor,
			labelFontSizePc,
			labelFontSizeSp,
			items,
		} = attributes;

		const blockProps = useBlockProps({
			className: 'lw-pr-list-6',
			style: {
				'--columns-pc': columnsPC,
				'--columns-sp': columnsSP,
				'--list-6-row-gap-pc': `${rowGapPc}px`,
				'--list-6-row-gap-sp': `${rowGapSp >= 0 ? rowGapSp : rowGapPc}px`,
				'--list-6-column-gap-pc': `${columnGapPc}px`,
				'--list-6-column-gap-sp': `${columnGapSp >= 0 ? columnGapSp : columnGapPc}px`,
				'--list-6-fontsize-ttl-pc': `${fontSizeTtlPc}px`,
				'--list-6-fontsize-ttl-tb': `${fontSizeTtlTb >= 0 ? fontSizeTtlTb : fontSizeTtlPc}px`,
				'--list-6-fontsize-ttl-sp': `${fontSizeTtlSp >= 0 ? fontSizeTtlSp : (fontSizeTtlTb >= 0 ? fontSizeTtlTb : fontSizeTtlPc)}px`,
				'--list-6-align-ttl-pc': alignTtlPc,
				'--list-6-align-ttl-sp': alignTtlSp || alignTtlPc,
				'--list-6-margin-top-ttl-pc': `${marginTopTtlPc}px`,
				'--list-6-margin-top-ttl-sp': `${marginTopTtlSp >= 0 ? marginTopTtlSp : marginTopTtlPc}px`,
				'--list-6-fontsize-p-pc': `${fontSizePPc}px`,
				'--list-6-fontsize-p-tb': `${fontSizePTb >= 0 ? fontSizePTb : fontSizePPc}px`,
				'--list-6-fontsize-p-sp': `${fontSizePSp >= 0 ? fontSizePSp : (fontSizePTb >= 0 ? fontSizePTb : fontSizePPc)}px`,
				'--list-6-align-p-pc': alignPPc,
				'--list-6-align-p-sp': alignPSp || alignPPc,
				'--list-6-label-bg': labelBgColor,
				'--list-6-label-color': labelTextColor,
				'--list-6-label-fontsize-pc': `${labelFontSizePc}px`,
				'--list-6-label-fontsize-sp': `${labelFontSizeSp >= 0 ? labelFontSizeSp : labelFontSizePc}px`,
			},
		});

		/* アイテム更新用ヘルパー */
		const updateItem = ( index, key, value ) => {
			const newItems = [ ...items ];
			newItems[ index ] = { ...newItems[ index ], [ key ]: value };
			setAttributes( { items: newItems } );
		};

		/* アイテム追加 */
		const addItem = () => {
			const newItems = [
				...items,
				{
					imageUrl: '',
					label: '',
					title: `タイトル${items.length + 1}`,
					description: '説明文を入力してください。',
				},
			];
			setAttributes( { items: newItems } );
		};

		/* アイテム削除 */
		const removeItem = ( index ) => {
			if ( items.length <= 1 ) return;
			const newItems = items.filter( ( _, i ) => i !== index );
			setAttributes( { items: newItems } );
		};

		/* アイテム順番入れ替え */
		const moveItem = ( index, direction ) => {
			const targetIndex = index + direction;
			if ( targetIndex < 0 || targetIndex >= items.length ) return;
			const newItems = [ ...items ];
			const [ moved ] = newItems.splice( index, 1 );
			newItems.splice( targetIndex, 0, moved );
			setAttributes( { items: newItems } );
		};

		/* スタイルオブジェクト */
		const titleStyle = {
			fontWeight: fontWeightTitle || undefined,
			color: colorTitle || undefined,
		};
		const descriptionStyle = {
			fontWeight: fontWeightDescription || undefined,
			color: colorDescription || undefined,
		};

		return (
			<>
				{/* ========== InspectorControls（サイドバー設定） ========== */}
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={ false }>
						<Heading level={4} style={{ marginBottom: "8px" }}>カラム数</Heading>
						<RangeControl
							label="PC"
							value={ columnsPC }
							onChange={ ( v ) => setAttributes( { columnsPC: v } ) }
							min={ 1 }
							max={ 6 }
						/>
						<RangeControl
							label="SP"
							value={ columnsSP }
							onChange={ ( v ) => setAttributes( { columnsSP: v } ) }
							min={ 1 }
							max={ 4 }
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>行間隔 (px)</Heading>
						<RangeControl
							label="PC"
							value={ rowGapPc }
							onChange={ ( v ) => setAttributes( { rowGapPc: v } ) }
							min={ 0 }
							max={ 80 }
							step={ 4 }
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={ rowGapSp }
							onChange={ ( v ) => setAttributes( { rowGapSp: v } ) }
							min={ -1 }
							max={ 80 }
							step={ 4 }
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>列間隔 (px)</Heading>
						<RangeControl
							label="PC"
							value={ columnGapPc }
							onChange={ ( v ) => setAttributes( { columnGapPc: v } ) }
							min={ 0 }
							max={ 80 }
							step={ 4 }
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={ columnGapSp }
							onChange={ ( v ) => setAttributes( { columnGapSp: v } ) }
							min={ -1 }
							max={ 80 }
							step={ 4 }
						/>
					</PanelBody>

					<PanelBody title="画像設定" initialOpen={ false }>
						<SelectControl
							label="画像のアスペクト比"
							value={ imageAspectRatio }
							options={ [
								{ label: '1:1（正方形）', value: '1/1' },
								{ label: '4:3', value: '4/3' },
								{ label: '3:2', value: '3/2' },
								{ label: '9:6', value: '9/6' },
								{ label: '16:9', value: '16/9' },
								{ label: '2:1', value: '2/1' },
							] }
							onChange={ ( value ) => setAttributes( { imageAspectRatio: value } ) }
						/>
						<hr style={ { margin: '20px 0' } } />
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { marginBottom: '20px' } }>
								<p><strong>アイテム { index + 1 } の画像</strong></p>
								{ item.imageUrl && (
									<div style={ { marginBottom: '10px' } }>
										<img
											src={ item.imageUrl }
											alt={ `アイテム${ index + 1 }` }
											style={ {
												width: '100%',
												maxHeight: '100px',
												objectFit: 'cover',
												border: '1px solid #ccc',
											} }
										/>
									</div>
								) }
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) => updateItem( index, 'imageUrl', media.url ) }
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<>
												<Button onClick={ open } variant="secondary">
													画像を選択
												</Button>
												{ item.imageUrl && (
													<Button
														onClick={ () => updateItem( index, 'imageUrl', '' ) }
														variant="secondary"
														style={ { marginLeft: '10px' } }
													>
														削除
													</Button>
												) }
											</>
										) }
									/>
								</MediaUploadCheck>
							</div>
						) ) }
					</PanelBody>

					<PanelBody title="タイトル設定" initialOpen={ false }>
						<Heading level={4} style={{ marginBottom: "8px" }}>文字サイズ (px)</Heading>
						<RangeControl
							label="PC"
							value={ fontSizeTtlPc }
							onChange={ ( v ) => setAttributes( { fontSizeTtlPc: v } ) }
							min={ 10 }
							max={ 48 }
						/>
						<RangeControl
							label="TB (-1でPC継承)"
							value={ fontSizeTtlTb }
							onChange={ ( v ) => setAttributes( { fontSizeTtlTb: v } ) }
							min={ -1 }
							max={ 48 }
						/>
						<RangeControl
							label="SP (-1でTB継承)"
							value={ fontSizeTtlSp }
							onChange={ ( v ) => setAttributes( { fontSizeTtlSp: v } ) }
							min={ -1 }
							max={ 48 }
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>配置</Heading>
						<SelectControl
							label="PC"
							value={ alignTtlPc }
							options={ [
								{ label: '左寄せ', value: 'left' },
								{ label: '中央', value: 'center' },
								{ label: '右寄せ', value: 'right' },
							] }
							onChange={ ( v ) => setAttributes( { alignTtlPc: v } ) }
						/>
						<SelectControl
							label="SP (空でPC継承)"
							value={ alignTtlSp }
							options={ [
								{ label: 'PC継承', value: '' },
								{ label: '左寄せ', value: 'left' },
								{ label: '中央', value: 'center' },
								{ label: '右寄せ', value: 'right' },
							] }
							onChange={ ( v ) => setAttributes( { alignTtlSp: v } ) }
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>上余白 (px)</Heading>
						<RangeControl
							label="PC"
							value={ marginTopTtlPc }
							onChange={ ( v ) => setAttributes( { marginTopTtlPc: v } ) }
							min={ 0 }
							max={ 60 }
							step={ 2 }
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={ marginTopTtlSp }
							onChange={ ( v ) => setAttributes( { marginTopTtlSp: v } ) }
							min={ -1 }
							max={ 60 }
							step={ 2 }
						/>
						<hr style={{ margin: "16px 0" }} />
						<SelectControl
							label="フォントの種類"
							value={ fontTitle }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontTitle: v } ) }
						/>
						<SelectControl
							label="フォントの太さ"
							value={ fontWeightTitle }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightTitle: v } ) }
						/>
						<hr style={{ margin: "16px 0" }} />
						<p style={{ marginBottom: "8px" }}>文字色</p>
						<ColorPalette
							value={ colorTitle }
							onChange={ ( color ) => setAttributes( { colorTitle: color } ) }
						/>
					</PanelBody>

					<PanelBody title="説明文設定" initialOpen={ false }>
						<Heading level={4} style={{ marginBottom: "8px" }}>文字サイズ (px)</Heading>
						<RangeControl
							label="PC"
							value={ fontSizePPc }
							onChange={ ( v ) => setAttributes( { fontSizePPc: v } ) }
							min={ 10 }
							max={ 48 }
						/>
						<RangeControl
							label="TB (-1でPC継承)"
							value={ fontSizePTb }
							onChange={ ( v ) => setAttributes( { fontSizePTb: v } ) }
							min={ -1 }
							max={ 48 }
						/>
						<RangeControl
							label="SP (-1でTB継承)"
							value={ fontSizePSp }
							onChange={ ( v ) => setAttributes( { fontSizePSp: v } ) }
							min={ -1 }
							max={ 48 }
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>配置</Heading>
						<SelectControl
							label="PC"
							value={ alignPPc }
							options={ [
								{ label: '左寄せ', value: 'left' },
								{ label: '中央', value: 'center' },
								{ label: '右寄せ', value: 'right' },
							] }
							onChange={ ( v ) => setAttributes( { alignPPc: v } ) }
						/>
						<SelectControl
							label="SP (空でPC継承)"
							value={ alignPSp }
							options={ [
								{ label: 'PC継承', value: '' },
								{ label: '左寄せ', value: 'left' },
								{ label: '中央', value: 'center' },
								{ label: '右寄せ', value: 'right' },
							] }
							onChange={ ( v ) => setAttributes( { alignPSp: v } ) }
						/>
						<hr style={{ margin: "16px 0" }} />
						<SelectControl
							label="フォントの種類"
							value={ fontDescription }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontDescription: v } ) }
						/>
						<SelectControl
							label="フォントの太さ"
							value={ fontWeightDescription }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightDescription: v } ) }
						/>
						<hr style={{ margin: "16px 0" }} />
						<p style={{ marginBottom: "8px" }}>文字色</p>
						<ColorPalette
							value={ colorDescription }
							onChange={ ( color ) => setAttributes( { colorDescription: color } ) }
						/>
					</PanelBody>

					<PanelBody title="ラベル設定" initialOpen={ false }>
						<ToggleControl
							label="ラベルを表示"
							checked={ showLabel }
							onChange={ ( v ) => setAttributes( { showLabel: v } ) }
						/>
						{ showLabel && (
						<>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>文字サイズ (px)</Heading>
						<RangeControl
							label="PC"
							value={ labelFontSizePc }
							onChange={ ( v ) => setAttributes( { labelFontSizePc: v } ) }
							min={ 10 }
							max={ 32 }
						/>
						<RangeControl
							label="SP (-1でPC継承)"
							value={ labelFontSizeSp }
							onChange={ ( v ) => setAttributes( { labelFontSizeSp: v } ) }
							min={ -1 }
							max={ 32 }
						/>
						<hr style={{ margin: "16px 0" }} />
						<p style={{ marginBottom: "8px" }}>背景色</p>
						<ColorPalette
							value={ labelBgColor }
							onChange={ ( color ) => setAttributes( { labelBgColor: color } ) }
						/>
						<hr style={{ margin: "16px 0" }} />
						<p style={{ marginBottom: "8px" }}>文字色</p>
						<ColorPalette
							value={ labelTextColor }
							onChange={ ( color ) => setAttributes( { labelTextColor: color } ) }
						/>
						</>
						) }
					</PanelBody>
				</InspectorControls>

				{/* ========== エディター上のプレビュー ========== */}
				<div { ...blockProps }>
					<ul className="custom_list_items">
						{ items.map( ( item, index ) => (
							<li key={ index } className="custom_item">
								<div className="image">
									<MediaUploadCheck>
										<MediaUpload
											onSelect={ ( media ) => updateItem( index, 'imageUrl', media.url ) }
											allowedTypes={ [ 'image' ] }
											render={ ( { open } ) => (
												item.imageUrl ? (
													<div className="lw-pr-list-6__image-wrap" onClick={ open } style={{ cursor: 'pointer' }}>
														<img src={ item.imageUrl } alt="" style={ { width: '100%', aspectRatio: imageAspectRatio, objectFit: 'cover' } } />
														<button
															type="button"
															className="lw-pr-list-6__image-remove"
															onClick={ ( e ) => {
																e.stopPropagation();
																updateItem( index, 'imageUrl', '' );
															} }
														>
															×
														</button>
													</div>
												) : (
													<div
														className="lw-pr-list-6__image-placeholder"
														onClick={ open }
														style={ { background: '#ddd', width: '100%', aspectRatio: imageAspectRatio, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } }
													>
														クリックで画像を選択
													</div>
												)
											) }
										/>
									</MediaUploadCheck>
									{ showLabel && (
										<RichText
											tagName="span"
											className="label"
											value={ item.label }
											onChange={ ( value ) => updateItem( index, 'label', value ) }
											placeholder="ラベル"
										/>
									) }
								</div>
								<RichText
									tagName="h3"
									className="custom_ttl"
									value={ item.title }
									onChange={ ( value ) => updateItem( index, 'title', value ) }
									placeholder="タイトル"
									data-lw_font_set={ fontTitle }
									style={ titleStyle }
								/>
								<RichText
									tagName="p"
									className="custom_p"
									value={ item.description }
									onChange={ ( value ) => updateItem( index, 'description', value ) }
									placeholder="説明文"
									data-lw_font_set={ fontDescription }
									style={ descriptionStyle }
								/>
								<div className="lw-pr-list-6__item-controls">
									<button
										type="button"
										className="lw-pr-list-6__move-btn"
										onClick={ () => moveItem( index, -1 ) }
										disabled={ index === 0 }
									>
										←
									</button>
									<button
										type="button"
										className="lw-pr-list-6__move-btn"
										onClick={ () => moveItem( index, 1 ) }
										disabled={ index === items.length - 1 }
									>
										→
									</button>
									{ items.length > 1 && (
										<button
											type="button"
											className="lw-pr-list-6__item-remove"
											onClick={ () => removeItem( index ) }
										>
											削除
										</button>
									) }
								</div>
							</li>
						) ) }
					</ul>
					<button
						type="button"
						className="lw-pr-list-6__add-btn"
						onClick={ addItem }
					>
						+ アイテムを追加
					</button>
				</div>
			</>
		);
	},

	/* ==================================================
	 * 保存（フロント出力）
	 * ================================================= */
	save( { attributes } ) {
		const {
			columnsPC,
			columnsSP,
			rowGapPc,
			rowGapSp,
			columnGapPc,
			columnGapSp,
			imageAspectRatio,
			fontTitle,
			fontWeightTitle,
			colorTitle,
			fontSizeTtlPc,
			fontSizeTtlTb,
			fontSizeTtlSp,
			alignTtlPc,
			alignTtlSp,
			marginTopTtlPc,
			marginTopTtlSp,
			fontDescription,
			fontWeightDescription,
			colorDescription,
			fontSizePPc,
			fontSizePTb,
			fontSizePSp,
			alignPPc,
			alignPSp,
			showLabel,
			labelBgColor,
			labelTextColor,
			labelFontSizePc,
			labelFontSizeSp,
			items,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: 'lw-pr-list-6',
			style: {
				'--columns-pc': columnsPC,
				'--columns-sp': columnsSP,
				'--list-6-row-gap-pc': `${rowGapPc}px`,
				'--list-6-row-gap-sp': `${rowGapSp >= 0 ? rowGapSp : rowGapPc}px`,
				'--list-6-column-gap-pc': `${columnGapPc}px`,
				'--list-6-column-gap-sp': `${columnGapSp >= 0 ? columnGapSp : columnGapPc}px`,
				'--list-6-fontsize-ttl-pc': `${fontSizeTtlPc}px`,
				'--list-6-fontsize-ttl-tb': `${fontSizeTtlTb >= 0 ? fontSizeTtlTb : fontSizeTtlPc}px`,
				'--list-6-fontsize-ttl-sp': `${fontSizeTtlSp >= 0 ? fontSizeTtlSp : (fontSizeTtlTb >= 0 ? fontSizeTtlTb : fontSizeTtlPc)}px`,
				'--list-6-align-ttl-pc': alignTtlPc,
				'--list-6-align-ttl-sp': alignTtlSp || alignTtlPc,
				'--list-6-margin-top-ttl-pc': `${marginTopTtlPc}px`,
				'--list-6-margin-top-ttl-sp': `${marginTopTtlSp >= 0 ? marginTopTtlSp : marginTopTtlPc}px`,
				'--list-6-fontsize-p-pc': `${fontSizePPc}px`,
				'--list-6-fontsize-p-tb': `${fontSizePTb >= 0 ? fontSizePTb : fontSizePPc}px`,
				'--list-6-fontsize-p-sp': `${fontSizePSp >= 0 ? fontSizePSp : (fontSizePTb >= 0 ? fontSizePTb : fontSizePPc)}px`,
				'--list-6-align-p-pc': alignPPc,
				'--list-6-align-p-sp': alignPSp || alignPPc,
				'--list-6-label-bg': labelBgColor,
				'--list-6-label-color': labelTextColor,
				'--list-6-label-fontsize-pc': `${labelFontSizePc}px`,
				'--list-6-label-fontsize-sp': `${labelFontSizeSp >= 0 ? labelFontSizeSp : labelFontSizePc}px`,
			},
		});

		/* スタイルオブジェクト */
		const titleStyle = {
			fontWeight: fontWeightTitle || undefined,
			color: colorTitle || undefined,
		};
		const descriptionStyle = {
			fontWeight: fontWeightDescription || undefined,
			color: colorDescription || undefined,
		};

		return (
			<div { ...blockProps }>
				<ul className="custom_list_items">
					{ items.map( ( item, index ) => (
						<li key={ index } className="custom_item">
							<div className="image">
								{ item.imageUrl && (
									<img src={ item.imageUrl } alt="" style={ { aspectRatio: imageAspectRatio } } />
								) }
								{ showLabel && item.label && (
									<RichText.Content
										tagName="span"
										className="label"
										value={ item.label }
									/>
								) }
							</div>
							<RichText.Content
								tagName="h3"
								className="custom_ttl"
								value={ item.title }
								data-lw_font_set={ fontTitle }
								style={ titleStyle }
							/>
							<RichText.Content
								tagName="p"
								className="custom_p"
								value={ item.description }
								data-lw_font_set={ fontDescription }
								style={ descriptionStyle }
							/>
						</li>
					) ) }
				</ul>
			</div>
		);
	},
} );
