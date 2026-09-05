/**
 * 商品リンク 01（wdl/lw-pr-product-1）
 * ------------------------------------------------------------
 *  商品を1つ紹介して、Amazon・楽天・Yahoo! など複数のお店へのボタンを並べるブロック。
 *
 *  設計の芯（2026-09-02）
 *  ・**外部のAPIを使わない。** Amazon の PA-API は「180日以内に3件の売上」が
 *    無いと使えず、始めたばかりの人はまず通らない。楽天も別途アプリ登録が要る。
 *    約1000サイトに配るテーマが外部APIに依存すると、動かないサイトが必ず出る。
 *    手で入れる形なら誰でも今日から使えて、相手側の都合で壊れない。
 *  ・**広告リンクの体裁が最初から入っている。** isAffiliate と showPr の既定が true。
 *    - rel="sponsored nofollow"（Google がアフィリエイトリンクに求めている印）
 *    - 別タブで開く
 *    - 左上の「PR」の札（ステマ規制＝景品表示法・2023年10月〜 で要る表示）
 *    新しく作るブロックなので、既定を安全側にしても既存ページには影響しない。
 *  ・**URLが空のお店はボタンごと出ない。** Amazonだけ、楽天だけでも成立する。
 *
 *  🚨 商品画像は自分で撮った写真か、使用許諾のあるものだけを入れること。
 *     Amazon の商品画像を保存して貼るのは規約違反（PA-API かリンクツール経由のみ）。
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	RangeControl,
	ToggleControl,
	ColorPalette,
	SelectControl,
} from '@wordpress/components';
import { fontOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { lwRel, AffiliateToggle } from '../affiliate-link.js';

/**
 * インラインで渡す CSS 変数（PC・スマホの値をまとめて持たせる）
 *
 * 🚨 列数は「出るボタンの数」で頭打ちにする。
 *    3列のまま1本だけ出すと、ボタンが箱の3分の1幅でぽつんと残って貧相に見える
 *    （2026-09-02・Amazonだけ登録した見本で実際にそうなった）。
 *
 * 🚨🚨 **単位のない CSS 変数は必ず文字列で渡す**（2026-09-02 に踏んだ）。
 *    React は style に数値を渡されると **px を付ける**ので、`3` を渡すと
 *    `--pd1-btn-col:3px` になり `grid-template-columns: repeat(3px, 1fr)` ＝無効になる。
 *    さらに、テンプレ生成の道具（_lib/build-pages.js の shim）は px を付けないので、
 *    **プレビューでは正しく見えるのに実機だけ壊れる**。絵では絶対に気づけない。
 */
function boxVars( a, shopCount ) {
	const n = Math.max( shopCount || 0, 1 );
	return {
		marginTop: `${ a.marginTop }px`,
		marginBottom: `${ a.marginBottom }px`,
		'--pd1-max-width': `${ a.maxWidth }px`,
		'--pd1-img-w': `${ a.imageWidth }px`,
		'--pd1-img-w-sp': `${ a.imageWidthSp }px`,
		'--pd1-name-size': `${ a.nameFontSize }px`,
		'--pd1-name-size-sp': `${ a.nameFontSizeSp }px`,
		'--pd1-btn-col': String( Math.min( a.buttonColumnsPc, n ) ),
		'--pd1-btn-col-sp': String( Math.min( a.buttonColumnsSp, n ) ),
		'--pd1-btn-size': `${ a.buttonFontSize }px`,
	};
}

/** 箱そのものの見た目 */
function boxStyle( a ) {
	return {
		backgroundColor: a.boxBgColor,
		borderColor: a.boxBorderColor,
		borderWidth: `${ a.boxBorderWidth }px`,
		borderRadius: `${ a.borderRadius }px`,
	};
}

registerBlockType( metadata.name, {
	...metadata,

	edit: ( { attributes, setAttributes } ) => {
		const {
			showPr, prText, imageUrl, imageAlt,
			productName, productDesc, productPrice, priceNote,
			shops, isAffiliate,
			maxWidth, marginTop, marginBottom,
			boxBgColor, boxBorderColor, boxBorderWidth, borderRadius,
			imageWidth, imageWidthSp,
			nameColor, nameFontSize, nameFontSizeSp,
			descColor, priceColor, prBgColor, prTextColor,
			buttonColumnsPc, buttonColumnsSp, buttonRadius, buttonFontSize,
			FontSet,
		} = attributes;

		const blockProps = useBlockProps( {
			className: 'lw-pr-product-1',
			style: boxVars( attributes, ( shops || [] ).length ),
		} );

		const updateShop = ( i, key, value ) => {
			const next = shops.map( ( s, k ) => ( k === i ? { ...s, [ key ]: value } : s ) );
			setAttributes( { shops: next } );
		};
		const addShop = () => {
			setAttributes( {
				shops: [ ...shops, { label: 'お店で見る', url: '', bgColor: '#555555', textColor: '#ffffff' } ],
			} );
		};
		const removeShop = ( i ) => {
			setAttributes( { shops: shops.filter( ( s, k ) => k !== i ) } );
		};

		// 編集画面では、URLが空のお店も薄く出す（設定し忘れに気づけるように）
		const shown = shops || [];

		return (
			<>
				<InspectorControls>
					<PanelBody title="商品の画像" initialOpen={ true }>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { imageUrl: media.url, imageAlt: media.alt || '' } ) }
							allowedTypes={ [ 'image' ] }
							value={ imageUrl }
							render={ ( { open } ) => (
								<>
									{ imageUrl && (
										<img
											src={ imageUrl }
											alt={ imageAlt || '選んだ画像' }
											style={ { width: '100%', height: 'auto', marginBottom: '10px' } }
										/>
									) }
									<Button variant="secondary" onClick={ open } style={ { width: '100%' } }>
										{ imageUrl ? '画像を選び直す' : '画像を選ぶ' }
									</Button>
									{ imageUrl && (
										<Button
											variant="link"
											isDestructive
											onClick={ () => setAttributes( { imageUrl: '', imageAlt: '' } ) }
											style={ { marginTop: '8px' } }
										>
											画像を外す
										</Button>
									) }
								</>
							) }
						/>
						<p style={ { fontSize: '12px', color: '#757575', marginTop: '12px', lineHeight: 1.7 } }>
							Amazon や楽天の商品画像を保存して使うのは各社の規約違反になります。ご自身で撮った写真か、使ってよいと許可されている画像を入れてください。
						</p>
						<TextControl
							label="画像の説明（alt）"
							value={ imageAlt }
							onChange={ ( v ) => setAttributes( { imageAlt: v } ) }
							help="目の見えない方や、画像が表示できないときに読まれる文字です。"
						/>
						<RangeControl
							label="画像の幅（パソコン・px）"
							value={ imageWidth }
							onChange={ ( v ) => setAttributes( { imageWidth: v } ) }
							min={ 80 }
							max={ 400 }
						/>
						<RangeControl
							label="画像の幅（スマホ・px）"
							value={ imageWidthSp }
							onChange={ ( v ) => setAttributes( { imageWidthSp: v } ) }
							min={ 60 }
							max={ 240 }
						/>
					</PanelBody>

					<PanelBody title="お店のボタン" initialOpen={ true }>
						<p style={ { fontSize: '12px', color: '#757575', marginBottom: '16px', lineHeight: 1.7 } }>
							アドレスを入れたお店だけボタンが出ます。3つとも埋める必要はありません。
						</p>
						{ shown.map( ( s, i ) => (
							<div
								key={ i }
								style={ {
									border: '1px solid #e0e0e0',
									borderRadius: '4px',
									padding: '12px',
									marginBottom: '16px',
								} }
							>
								<p style={ { fontWeight: 'bold', fontSize: '13px', marginTop: 0, marginBottom: '10px' } }>
									{ i + 1 }つ目のお店
								</p>
								<TextControl
									label="ボタンの文字"
									value={ s.label }
									onChange={ ( v ) => updateShop( i, 'label', v ) }
								/>
								<TextControl
									label="リンク先のアドレス"
									value={ s.url }
									onChange={ ( v ) => updateShop( i, 'url', v ) }
									help="アフィリエイトのリンク（IDが付いたアドレス）をそのまま貼ってください。"
								/>
								<p style={ { fontSize: '12px', marginBottom: '4px' } }>ボタンの色</p>
								<ColorPalette
									value={ s.bgColor }
									onChange={ ( v ) => updateShop( i, 'bgColor', v ) }
								/>
								<p style={ { fontSize: '12px', marginBottom: '4px' } }>文字の色</p>
								<ColorPalette
									value={ s.textColor }
									onChange={ ( v ) => updateShop( i, 'textColor', v ) }
								/>
								{ shown.length > 1 && (
									<Button variant="link" isDestructive onClick={ () => removeShop( i ) }>
										このお店を消す
									</Button>
								) }
							</div>
						) ) }
						<Button variant="secondary" onClick={ addShop } style={ { width: '100%' } }>
							＋ お店を増やす
						</Button>
						<RangeControl
							label="ボタンの並び（パソコン・何列）"
							value={ buttonColumnsPc }
							onChange={ ( v ) => setAttributes( { buttonColumnsPc: v } ) }
							min={ 1 }
							max={ 4 }
						/>
						<RangeControl
							label="ボタンの並び（スマホ・何列）"
							value={ buttonColumnsSp }
							onChange={ ( v ) => setAttributes( { buttonColumnsSp: v } ) }
							min={ 1 }
							max={ 2 }
							help="スマホは1列が読みやすいです。"
						/>
						<RangeControl
							label="ボタンの文字の大きさ（px）"
							value={ buttonFontSize }
							onChange={ ( v ) => setAttributes( { buttonFontSize: v } ) }
							min={ 12 }
							max={ 20 }
						/>
						<RangeControl
							label="ボタンの角の丸み（px）"
							value={ buttonRadius }
							onChange={ ( v ) => setAttributes( { buttonRadius: v } ) }
							min={ 0 }
							max={ 40 }
						/>
					</PanelBody>

					<PanelBody title="広告としての表示" initialOpen={ true }>
						<AffiliateToggle
							checked={ isAffiliate }
							onChange={ ( v ) => setAttributes( { isAffiliate: v } ) }
						/>
						<ToggleControl
							label="「PR」の札を出す"
							checked={ showPr }
							onChange={ ( v ) => setAttributes( { showPr: v } ) }
							help="広告であることを画面に出す表示です。ステマ規制（景品表示法）で必要なので、アフィリエイトのときは消さないでください。"
						/>
						{ showPr && (
							<TextControl
								label="札の文字"
								value={ prText }
								onChange={ ( v ) => setAttributes( { prText: v } ) }
								help="「PR」「広告」「プロモーションを含みます」など。"
							/>
						) }
						<TextControl
							label="下に出す注意書き"
							value={ priceNote }
							onChange={ ( v ) => setAttributes( { priceNote: v } ) }
							help="価格を書いたときは、いつ時点の価格かを必ず添えてください。空にすると出ません。"
						/>
					</PanelBody>

					<PanelBody title="全体の見た目" initialOpen={ false }>
						<SelectControl
							label="フォント"
							value={ FontSet }
							options={ fontOptionsArr() }
							onChange={ ( v ) => setAttributes( { FontSet: v } ) }
						/>
						<RangeControl
							label="箱の横幅（px）"
							value={ maxWidth }
							onChange={ ( v ) => setAttributes( { maxWidth: v } ) }
							min={ 320 }
							max={ 1200 }
						/>
						<p style={ { fontSize: '12px', marginBottom: '4px' } }>箱の背景色</p>
						<ColorPalette value={ boxBgColor } onChange={ ( v ) => setAttributes( { boxBgColor: v } ) } />
						<p style={ { fontSize: '12px', marginBottom: '4px' } }>枠線の色</p>
						<ColorPalette value={ boxBorderColor } onChange={ ( v ) => setAttributes( { boxBorderColor: v } ) } />
						<RangeControl
							label="枠線の太さ（px）"
							value={ boxBorderWidth }
							onChange={ ( v ) => setAttributes( { boxBorderWidth: v } ) }
							min={ 0 }
							max={ 6 }
						/>
						<RangeControl
							label="箱の角の丸み（px）"
							value={ borderRadius }
							onChange={ ( v ) => setAttributes( { borderRadius: v } ) }
							min={ 0 }
							max={ 40 }
						/>
						<RangeControl
							label="商品名の大きさ（パソコン・px）"
							value={ nameFontSize }
							onChange={ ( v ) => setAttributes( { nameFontSize: v } ) }
							min={ 14 }
							max={ 32 }
						/>
						<RangeControl
							label="商品名の大きさ（スマホ・px）"
							value={ nameFontSizeSp }
							onChange={ ( v ) => setAttributes( { nameFontSizeSp: v } ) }
							min={ 13 }
							max={ 26 }
						/>
						<p style={ { fontSize: '12px', marginBottom: '4px' } }>商品名の色</p>
						<ColorPalette value={ nameColor } onChange={ ( v ) => setAttributes( { nameColor: v } ) } />
						<p style={ { fontSize: '12px', marginBottom: '4px' } }>説明の色</p>
						<ColorPalette value={ descColor } onChange={ ( v ) => setAttributes( { descColor: v } ) } />
						<p style={ { fontSize: '12px', marginBottom: '4px' } }>価格の色</p>
						<ColorPalette value={ priceColor } onChange={ ( v ) => setAttributes( { priceColor: v } ) } />
						<p style={ { fontSize: '12px', marginBottom: '4px' } }>PRの札の背景色</p>
						<ColorPalette value={ prBgColor } onChange={ ( v ) => setAttributes( { prBgColor: v } ) } />
						<p style={ { fontSize: '12px', marginBottom: '4px' } }>PRの札の文字色</p>
						<ColorPalette value={ prTextColor } onChange={ ( v ) => setAttributes( { prTextColor: v } ) } />
						<RangeControl
							label="上の余白（px）"
							value={ marginTop }
							onChange={ ( v ) => setAttributes( { marginTop: v } ) }
							min={ 0 }
							max={ 120 }
						/>
						<RangeControl
							label="下の余白（px）"
							value={ marginBottom }
							onChange={ ( v ) => setAttributes( { marginBottom: v } ) }
							min={ 0 }
							max={ 120 }
						/>
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					<div className="lw-pr-product-1__box" style={ boxStyle( attributes ) }>
						{ showPr && (
							<span
								className="lw-pr-product-1__pr"
								style={ { backgroundColor: prBgColor, color: prTextColor } }
							>
								{ prText }
							</span>
						) }
						<div className="lw-pr-product-1__main">
							<div className="lw-pr-product-1__img">
								<MediaUpload
									onSelect={ ( media ) => setAttributes( { imageUrl: media.url, imageAlt: media.alt || '' } ) }
									allowedTypes={ [ 'image' ] }
									value={ imageUrl }
									render={ ( { open } ) => (
										imageUrl
											? <img src={ imageUrl } alt={ imageAlt || '' } onClick={ open } style={ { cursor: 'pointer' } } />
											: (
												<button type="button" className="lw-pr-product-1__imgpick" onClick={ open }>
													商品の画像を選ぶ
												</button>
											)
									) }
								/>
							</div>
							<div className="lw-pr-product-1__body">
								<RichText
									tagName="p"
									className="lw-pr-product-1__name"
									value={ productName }
									onChange={ ( v ) => setAttributes( { productName: v } ) }
									placeholder="商品名"
									style={ { color: nameColor } }
									data-lw_font_set={ FontSet }
								/>
								<RichText
									tagName="p"
									className="lw-pr-product-1__desc"
									value={ productDesc }
									onChange={ ( v ) => setAttributes( { productDesc: v } ) }
									placeholder="ひとこと説明"
									style={ { color: descColor } }
								/>
								<RichText
									tagName="p"
									className="lw-pr-product-1__price"
									value={ productPrice }
									onChange={ ( v ) => setAttributes( { productPrice: v } ) }
									placeholder="参考価格（例 3,980円（税込））"
									style={ { color: priceColor } }
								/>
							</div>
						</div>
						{ !! shown.length && (
							<div className="lw-pr-product-1__shops">
								{ shown.map( ( s, i ) => (
									<span
										key={ i }
										className="lw-pr-product-1__shop"
										style={ {
											backgroundColor: s.bgColor,
											color: s.textColor,
											borderRadius: `${ buttonRadius }px`,
											opacity: s.url ? 1 : 0.35,
										} }
										data-lw_font_set={ FontSet }
									>
										{ s.label }
									</span>
								) ) }
							</div>
						) }
						{ priceNote && (
							<p className="lw-pr-product-1__note">{ priceNote }</p>
						) }
					</div>
				</div>
			</>
		);
	},

	save: ( { attributes } ) => {
		const {
			showPr, prText, imageUrl, imageAlt,
			productName, productDesc, productPrice, priceNote,
			shops, isAffiliate,
			nameColor, descColor, priceColor, prBgColor, prTextColor,
			buttonRadius, FontSet,
		} = attributes;

		// アドレスの入っていないお店は出さない
		const list = ( shops || [] ).filter( ( s ) => s && s.url );

		const blockProps = useBlockProps.save( {
			className: 'lw-pr-product-1',
			style: boxVars( attributes, list.length ),
		} );

		return (
			<div { ...blockProps }>
				<div className="lw-pr-product-1__box" style={ boxStyle( attributes ) }>
					{ showPr && (
						<span
							className="lw-pr-product-1__pr"
							style={ { backgroundColor: prBgColor, color: prTextColor } }
						>
							{ prText }
						</span>
					) }
					<div className="lw-pr-product-1__main">
						{ imageUrl && (
							<div className="lw-pr-product-1__img">
								<img src={ imageUrl } alt={ imageAlt || '' } />
							</div>
						) }
						<div className="lw-pr-product-1__body">
							<RichText.Content
								tagName="p"
								className="lw-pr-product-1__name"
								value={ productName }
								style={ { color: nameColor } }
								data-lw_font_set={ FontSet }
							/>
							<RichText.Content
								tagName="p"
								className="lw-pr-product-1__desc"
								value={ productDesc }
								style={ { color: descColor } }
							/>
							{ productPrice && (
								<RichText.Content
									tagName="p"
									className="lw-pr-product-1__price"
									value={ productPrice }
									style={ { color: priceColor } }
								/>
							) }
						</div>
					</div>
					{ !! list.length && (
						<div className="lw-pr-product-1__shops">
							{ list.map( ( s, i ) => (
								<a
									key={ i }
									className="lw-pr-product-1__shop"
									href={ s.url }
									target={ isAffiliate ? '_blank' : undefined }
									rel={ lwRel( { newTab: isAffiliate, affiliate: isAffiliate } ) }
									style={ {
										backgroundColor: s.bgColor,
										color: s.textColor,
										borderRadius: `${ buttonRadius }px`,
									} }
									data-lw_font_set={ FontSet }
								>
									{ s.label }
								</a>
							) ) }
						</div>
					) }
					{ priceNote && (
						<p className="lw-pr-product-1__note">{ priceNote }</p>
					) }
				</div>
			</div>
		);
	},
} );
