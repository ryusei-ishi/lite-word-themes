/**
 * LiteWord – お問い合わせフォーム 02（最大横幅バグ修正版）
 * ------------------------------------------------------------
 *  • ブロック名   : wdl/paid-block-contact-2
 *  • 修正ポイント : maxWidth を常に "◯◯px" の文字列で保存し、
 *                   RangeControl との型不整合を解消
 * ----------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	ColorPalette,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Button,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

registerBlockType( 'wdl/paid-block-contact-2', {
	/* ───────── 基本情報 ───────── */
	title   : 'お問合わせフォーム 02',
	icon    : 'email',
	category: 'liteword-buttons',
	supports: { anchor: true },

	/* ───────── 属性 ───────── */
	attributes: {
		formId            : { type: 'number',  default: 1 },
		mainTitle         : { type: 'string',  default: 'CONTACT' },
		subTitle          : { type: 'string',  default: 'お問合わせフォーム' },
		description       : { type: 'string',  default: 'ご不明な点やご相談がございましたら、下記のお問い合わせフォームよりお気軽にご連絡ください。' },
		bgImageUrl        : { type: 'string',  default: 'https://lite-word.com/sample_img/background/6.webp' },
		bgImageUrlSp      : { type: 'string',  default: '' },
		bgColor           : { type: 'string',  default: '#03294C' },
		bgOpacity         : { type: 'number',  default: 0.5 },
		requiredBgColor   : { type: 'string',  default: '#da3838' },
		submitBgColor     : { type: 'string',  default: '#EE3131' },
		mainTitleLevel    : { type: 'string',  default: 'h1' },
		/* ← maxWidth は常に "◯◯px" 形式で保持する！ */
		maxWidth          : { type: 'string',  default: '800px' },
		descriptionAlignPC: { type: 'string',  default: 'pc_center' },
		descriptionAlignSP: { type: 'string',  default: 'sp_center' },
	},

	/* ==================================================
	 * 編集画面
	 * ================================================= */
	edit( { attributes, setAttributes } ) {
		const {
			formId,
			mainTitle,
			subTitle,
			description,
			bgImageUrl,
			bgImageUrlSp,
			bgColor,
			bgOpacity,
			requiredBgColor,
			submitBgColor,
			mainTitleLevel,
			maxWidth,
			descriptionAlignPC,
			descriptionAlignSP,
		} = attributes;

		/* ─ 見出しレベル切替 ─ */
		const TagName = mainTitleLevel;
		const onChangeHeadingLevel = ( level ) => setAttributes( { mainTitleLevel: level } );

		/* ─ RangeControl 用の数値化（未設定なら 0） ─ */
		const widthNumber = parseInt( maxWidth, 10 ) || 0;

		return (
			<>
				{/* ========== 1. BlockControls（ツールバー） ========== */}
				<BlockControls>
					<ToolbarGroup label="見出しレベル">
						{ [ 'h1','h2','h3','h4','h5','h6' ].map( tag => (
							<ToolbarButton
								key={ tag }
								isPressed={ mainTitleLevel === tag }
								onClick={ () => onChangeHeadingLevel( tag ) }
							>
								{ tag.toUpperCase() }
							</ToolbarButton>
						) ) }
					</ToolbarGroup>
				</BlockControls>

				{/* ========== 2. InspectorControls（サイドバー設定） ========== */}
				<InspectorControls>
					{/* --- 2-1. マニュアル --- */}
					<PanelBody title="マニュアル">
						<div style={ { marginBottom:'1em' } }>
							<Button
								variant="secondary"
								href="https://www.youtube.com/watch?v=LPns_dcZADo"
								target="_blank"
							>
								このブロックの使い方はこちら
							</Button>
						</div>
						<div>
							<Button
								variant="secondary"
								href="https://www.youtube.com/watch?v=gtxSdMsPBAU"
								target="_blank"
							>
								フォーム設定方法はこちら
							</Button>
						</div>
					</PanelBody>

					{/* --- 2-2. フォーム設定 --- */}
					<PanelBody title="フォーム設定" initialOpen={ true }>
						<SelectControl
							label="フォームID"
							value={ formId }
							options={ [ ...Array( 40 ) ].map( ( _, i ) => ( {
								label: `LiteWord専用 お問合わせフォームパターン ${ i + 1 }`,
								value: i + 1,
							} ) ) }
							onChange={ ( value ) => setAttributes( { formId: parseInt( value, 10 ) } ) }
						/>
					</PanelBody>

					{/* --- 2-3. 背景や色の設定 --- */}
					<PanelBody title="背景や色の設定" initialOpen={ true }>
						{/* 背景画像（PC） */}
						<p><strong>背景画像（PCの時）</strong></p>
						{ bgImageUrl && (
							<div style={ { marginBottom:'1em' } }>
								<img
									src={ bgImageUrl }
									alt="背景画像プレビュー"
									style={ {
										width:'100%',
										maxHeight:'150px',
										objectFit:'cover',
										border:'1px solid #ccc',
									} }
								/>
							</div>
						) }
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => setAttributes( { bgImageUrl: media.url } ) }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<>
										<Button onClick={ open } variant="secondary">
											背景画像を選択
										</Button>
										{ bgImageUrl && (
											<Button
												onClick={ () => setAttributes( { bgImageUrl:'' } ) }
												variant="secondary"
												style={ { marginLeft:'10px' } }
											>
												削除
											</Button>
										) }
									</>
								) }
							/>
						</MediaUploadCheck>

						<br /><br />

						{/* 背景画像（SP） */}
						<p><strong>背景画像（SPの時）</strong></p>
						{ bgImageUrlSp && (
							<div style={ { marginBottom:'1em' } }>
								<img
									src={ bgImageUrlSp }
									alt="背景画像プレビュー"
									style={ {
										width:'100%',
										maxHeight:'150px',
										objectFit:'cover',
										border:'1px solid #ccc',
									} }
								/>
							</div>
						) }
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => setAttributes( { bgImageUrlSp: media.url } ) }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<>
										<Button onClick={ open } variant="secondary">
											SP用背景画像を選択
										</Button>
										{ bgImageUrlSp && (
											<Button
												onClick={ () => setAttributes( { bgImageUrlSp:'' } ) }
												variant="secondary"
												style={ { marginLeft:'10px' } }
											>
												削除
											</Button>
										) }
									</>
								) }
							/>
						</MediaUploadCheck>

						<br /><br />

						{/* 背景色・透明度 */}
						<p><strong>背景色</strong></p>
						<ColorPalette
							value={ bgColor }
							onChange={ ( color ) => setAttributes( { bgColor: color } ) }
						/>

						<RangeControl
							label="背景色の透明度"
							value={ bgOpacity }
							onChange={ ( value ) => setAttributes( { bgOpacity: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.05 }
						/>

						{/* 必須アイコン背景色 */}
						<p><strong>必須アイコンの背景色</strong></p>
						<ColorPalette
							value={ requiredBgColor }
							onChange={ ( color ) => setAttributes( { requiredBgColor: color } ) }
						/>

						{/* 送信ボタン背景色 */}
						<p><strong>送信ボタンの背景色</strong></p>
						<ColorPalette
							value={ submitBgColor }
							onChange={ ( color ) => setAttributes( { submitBgColor: color } ) }
						/>

						{/* フォーム最大横幅 */}
						<p><strong>フォーム部分の最大横幅</strong></p>
						<RangeControl
							label="最大横幅（px）"
							value={ widthNumber }
							onChange={ ( value ) => {
								if ( value === undefined || value === null ) {
									/* リセット時：空文字で「指定なし」 */
									setAttributes( { maxWidth:'' } );
								} else {
									/* 常に px を付与して保存 */
									setAttributes( { maxWidth: `${ value }px` } );
								}
							} }
							min={ 0 }
							max={ 1200 }
							step={ 10 }
							allowReset
							resetFallbackValue={ 800 }
						/>
					</PanelBody>

					{/* --- 2-4. 説明テキストの配置 --- */}
					<PanelBody title="説明テキストの配置" initialOpen={ true }>
						<SelectControl
							label="PCでの説明テキストの配置"
							value={ descriptionAlignPC }
							options={ [
								{ label:'左寄せ（pc_left）',   value:'pc_left'   },
								{ label:'中央寄せ（pc_center）', value:'pc_center' },
							] }
							onChange={ ( value ) => setAttributes( { descriptionAlignPC: value } ) }
						/>
						<SelectControl
							label="スマホでの説明テキストの配置"
							value={ descriptionAlignSP }
							options={ [
								{ label:'左寄せ（sp_left）',   value:'sp_left'   },
								{ label:'中央寄せ（sp_center）', value:'sp_center' },
							] }
							onChange={ ( value ) => setAttributes( { descriptionAlignSP: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ========== 3. エディター上のプレビュー ========== */}
				<div className="paid-block-contact-2">
					<div className="this_wrap" style={ { maxWidth } }>
						{/* タイトル */}
						<TagName className="title">
							<RichText
								tagName="span"
								className="main"
								value={ mainTitle }
								onChange={ ( value ) => setAttributes( { mainTitle: value } ) }
								placeholder="メインタイトル"
							/>
							<RichText
								tagName="span"
								className="sub"
								value={ subTitle }
								onChange={ ( value ) => setAttributes( { subTitle: value } ) }
								placeholder="サブタイトル"
							/>
						</TagName>

						{/* 説明文 */}
						<RichText
							tagName="p"
							className={ `description ${ descriptionAlignPC } ${ descriptionAlignSP }` }
							value={ description }
							onChange={ ( value ) => setAttributes( { description: value } ) }
							placeholder="説明文"
						/>

						{/* 背景レイヤ */}
						<div className="bg_filter">
							<div
								className="bg_filter_inner"
								style={ {
									backgroundColor: bgColor,
									opacity       : bgOpacity,
								} }
							/>
							{ bgImageUrl && (
								<picture>
									<source srcSet={ bgImageUrlSp } media="(max-width: 800px)" />
									<source srcSet={ bgImageUrl   } media="(min-width: 801px)" />
									<img src={ bgImageUrl } alt="背景画像" style={ { display:'block' } } />
								</picture>
							) }
						</div>
					</div>
				</div>
			</>
		);
	},

	/* ==================================================
	 * 保存（フロント出力）
	 * ================================================= */
	save( { attributes } ) {
		const {
			formId,
			mainTitle,
			subTitle,
			description,
			bgImageUrl,
			bgImageUrlSp,
			bgColor,
			bgOpacity,
			requiredBgColor,
			submitBgColor,
			mainTitleLevel,
			maxWidth,
			descriptionAlignPC,
			descriptionAlignSP,
		} = attributes;

		const TagName = mainTitleLevel;

		return (
			<div className="paid-block-contact-2">
				<div className="this_wrap" style={ { maxWidth } }>
					{/* タイトル */}
					<TagName className="title">
						<RichText.Content tagName="span" className="main" value={ mainTitle } />
						<RichText.Content tagName="span" className="sub"  value={ subTitle } />
					</TagName>

					{/* 説明文 */}
					<RichText.Content
						tagName="p"
						className={ `description ${ descriptionAlignPC } ${ descriptionAlignSP }` }
						value={ description }
					/>

					{/* お問い合わせフォーム（ショートコード） */}
					{ `[lw_mail_form_select id='${ formId }']` }

					{/* 背景レイヤ */}
					<div className="bg_filter">
						<div
							className="bg_filter_inner"
							style={ {
								backgroundColor: bgColor,
								opacity       : bgOpacity,
							} }
						/>
						{ ( bgImageUrl || bgImageUrlSp ) && (
							<picture>
								<source srcSet={ bgImageUrlSp } media="(max-width: 800px)" />
								<source srcSet={ bgImageUrl   } media="(min-width: 801px)" />
								<img src={ bgImageUrl } alt="背景画像" style={ { display:'block' } } />
							</picture>
						) }
					</div>
				</div>

				{/* 送信ボタン／必須ラベルの動的カラー */}
				<style>{ `
					.submit_wrap button   { background-color: ${ submitBgColor } !important; }
					.required.is-required { background-color: ${ requiredBgColor } !important; }
				` }</style>
			</div>
		);
	},
} );
