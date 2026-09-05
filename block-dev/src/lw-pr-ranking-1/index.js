/**
 * ランキング 01（wdl/lw-pr-ranking-1）
 * ------------------------------------------------------------
 *  「おすすめ◯選」を、順位付きで縦に並べるブロック。
 *
 *  なぜ作ったか（2026-09-02）
 *  ・アフィリエイトの主力コンテンツは「おすすめ◯選」なのに、145ブロックの中に
 *    ランキング用のブロックが**1つも無かった**。
 *  ・実際、コスメ比較サイトのテンプレート（page_template/cosme/ranking_1）を作ったときは、
 *    見出し8個＋写真6枚＋表6個＋ボタン4個を**手で積んで**代用した。
 *    テンプレートを貼るだけの人はそれでよいが、**自分で4位を足したい人には無理**だった。
 *
 *  設計の芯
 *  ・**縦に1件ずつ**。横並びカードではない。ランキング記事は1件ごとに読ませるため。
 *  ・**並べた順がそのまま順位**。順位の数字を手で持たせない（入れ替えたときにズレる）。
 *  ・**良い点だけでなく「気になる点」を置く。** 良いことしか書いていないページは
 *    読む人にすぐ分かる。書ける場所をブロック側で用意しておく。
 *  ・広告リンクの体裁（rel="sponsored nofollow"・別タブ・PRの札）が既定で入っている。
 *  ・**外部APIを使わない**（商品リンク 01 と同じ理由。Amazon PA-API は売上実績が要る）。
 *
 *  🚨 商品画像は自分で撮った写真か、使用許諾のあるものだけ。
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
import { lwRel, AffiliateToggle } from '../affiliate-link.js';
import {
	rankColor, rankLabel, starPercent, visibleShops, hasText,
	blockVars, boxStyle, shopsStyle,
} from './parts.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const CLS = 'lw-pr-ranking-1';

/** 星（下に灰色・上に色つきを幅で切って重ねる）。編集画面と保存で同じものを出す */
const Stars = ( { percent } ) => (
	<span className={ `${ CLS }__stars` } aria-hidden="true">
		<span className={ `${ CLS }__stars-on` } style={ { width: percent } }>★★★★★</span>
		★★★★★
	</span>
);

const EMPTY_ITEM = {
	imageUrl: '', imageAlt: '',
	name: '商品名を入れてください',
	comment: '選んだ理由をひとことで書きます。',
	score: '4.0',
	good: '', bad: '',
	shops: [
		{ label: 'Amazonで見る', url: '', bgColor: '#ff9900', textColor: '#ffffff' },
		{ label: '楽天市場で見る', url: '', bgColor: '#bf0000', textColor: '#ffffff' },
		{ label: 'Yahoo!で見る', url: '', bgColor: '#ff0033', textColor: '#ffffff' },
	],
};

registerBlockType( metadata.name, {
	...metadata,

	edit: ( { attributes, setAttributes } ) => {
		const {
			showPr, prText, items, rankStyle, rankUnit, showScore,
			goodLabel, badLabel, isAffiliate,
			nameColor, commentColor, goodColor, badColor,
			prBgColor, prTextColor, rankTextColor, buttonRadius, FontSet,
		} = attributes;

		const list = items || [];

		const setItem = ( i, key, value ) => {
			setAttributes( { items: list.map( ( it, k ) => ( k === i ? { ...it, [ key ]: value } : it ) ) } );
		};
		const setShop = ( i, s, key, value ) => {
			setAttributes( {
				items: list.map( ( it, k ) => {
					if ( k !== i ) { return it; }
					const shops = ( it.shops || [] ).map( ( sh, m ) => ( m === s ? { ...sh, [ key ]: value } : sh ) );
					return { ...it, shops };
				} ),
			} );
		};
		const moveItem = ( i, dir ) => {
			const j = i + dir;
			if ( j < 0 || j >= list.length ) { return; }
			const next = list.slice();
			const tmp = next[ i ];
			next[ i ] = next[ j ];
			next[ j ] = tmp;
			setAttributes( { items: next } );
		};
		const addItem = () => setAttributes( { items: [ ...list, JSON.parse( JSON.stringify( EMPTY_ITEM ) ) ] } );
		const removeItem = ( i ) => setAttributes( { items: list.filter( ( _, k ) => k !== i ) } );

		const blockProps = useBlockProps( { className: CLS, style: blockVars( attributes ) } );

		return (
			<>
				<InspectorControls>
					<PanelBody title="表示の設定" initialOpen={ true }>
						<AffiliateToggle
							checked={ isAffiliate }
							onChange={ ( v ) => setAttributes( { isAffiliate: v } ) }
						/>
						<ToggleControl
							label="「PR」の札を出す"
							help="広告であることの表示です。アフィリエイトリンクを置くなら消さないでください（景品表示法）。"
							checked={ showPr }
							onChange={ ( v ) => setAttributes( { showPr: v } ) }
						/>
						{ showPr && (
							<TextControl
								label="札の文字"
								value={ prText }
								onChange={ ( v ) => setAttributes( { prText: v } ) }
							/>
						) }
						<SelectControl
							label="順位の見せ方"
							value={ rankStyle }
							options={ [
								{ label: 'メダル（1〜3位）', value: 'medal' },
								{ label: '数字だけ（1位・2位…）', value: 'number' },
								{ label: '順位を出さない', value: 'none' },
							] }
							onChange={ ( v ) => setAttributes( { rankStyle: v } ) }
						/>
						{ rankStyle === 'number' && (
							<TextControl
								label="順位の単位"
								value={ rankUnit }
								onChange={ ( v ) => setAttributes( { rankUnit: v } ) }
							/>
						) }
						<ToggleControl
							label="評価（星）を出す"
							checked={ showScore }
							onChange={ ( v ) => setAttributes( { showScore: v } ) }
						/>
						<TextControl
							label="良い点の見出し"
							value={ goodLabel }
							onChange={ ( v ) => setAttributes( { goodLabel: v } ) }
						/>
						<TextControl
							label="気になる点の見出し"
							value={ badLabel }
							onChange={ ( v ) => setAttributes( { badLabel: v } ) }
						/>
					</PanelBody>

					{ list.map( ( item, i ) => (
						<PanelBody
							key={ i }
							title={ `${ i + 1 }位  ${ String( item.name || '' ).replace( /<[^>]*>/g, '' ).slice( 0, 12 ) }` }
							initialOpen={ false }
						>
							<div className={ `${ CLS }__ed-order` }>
								<Button variant="secondary" disabled={ i === 0 } onClick={ () => moveItem( i, -1 ) }>↑ 上へ</Button>
								<Button variant="secondary" disabled={ i === list.length - 1 } onClick={ () => moveItem( i, 1 ) }>↓ 下へ</Button>
								<Button isDestructive onClick={ () => removeItem( i ) }>削除</Button>
							</div>
							<MediaUpload
								onSelect={ ( m ) => setItem( i, 'imageUrl', m.url ) }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button variant="secondary" onClick={ open }>
										{ item.imageUrl ? '画像を変える' : '画像を選ぶ' }
									</Button>
								) }
							/>
							{ item.imageUrl && (
								<Button isDestructive variant="tertiary" onClick={ () => setItem( i, 'imageUrl', '' ) }>画像を外す</Button>
							) }
							<TextControl
								label="画像の説明（alt）"
								value={ item.imageAlt || '' }
								onChange={ ( v ) => setItem( i, 'imageAlt', v ) }
							/>
							<TextControl
								label="評価（0〜5）"
								help="空にすると星も数字も出ません。"
								value={ item.score || '' }
								onChange={ ( v ) => setItem( i, 'score', v ) }
							/>
							{ ( item.shops || [] ).map( ( sh, s ) => (
								<div key={ s } className={ `${ CLS }__ed-shop` }>
									<TextControl
										label={ `お店 ${ s + 1 } のボタン名` }
										value={ sh.label || '' }
										onChange={ ( v ) => setShop( i, s, 'label', v ) }
									/>
									<TextControl
										label="リンク先（空ならボタンは出ません）"
										value={ sh.url || '' }
										onChange={ ( v ) => setShop( i, s, 'url', v ) }
									/>
								</div>
							) ) }
						</PanelBody>
					) ) }

					<PanelBody title="大きさ・余白" initialOpen={ false }>
						<RangeControl label="全体の最大幅" min={ 320 } max={ 1200 } value={ attributes.maxWidth }
							onChange={ ( v ) => setAttributes( { maxWidth: v } ) } />
						<RangeControl label="1件ごとの間隔" min={ 0 } max={ 80 } value={ attributes.itemGap }
							onChange={ ( v ) => setAttributes( { itemGap: v } ) } />
						<RangeControl label="画像の幅（PC）" min={ 80 } max={ 360 } value={ attributes.imageWidth }
							onChange={ ( v ) => setAttributes( { imageWidth: v } ) } />
						<RangeControl label="画像の幅（スマホ）" min={ 60 } max={ 240 } value={ attributes.imageWidthSp }
							onChange={ ( v ) => setAttributes( { imageWidthSp: v } ) } />
						<RangeControl label="商品名の大きさ（PC）" min={ 12 } max={ 32 } value={ attributes.nameFontSize }
							onChange={ ( v ) => setAttributes( { nameFontSize: v } ) } />
						<RangeControl label="商品名の大きさ（スマホ）" min={ 12 } max={ 28 } value={ attributes.nameFontSizeSp }
							onChange={ ( v ) => setAttributes( { nameFontSizeSp: v } ) } />
						<RangeControl label="上の余白" min={ 0 } max={ 120 } value={ attributes.marginTop }
							onChange={ ( v ) => setAttributes( { marginTop: v } ) } />
						<RangeControl label="下の余白" min={ 0 } max={ 120 } value={ attributes.marginBottom }
							onChange={ ( v ) => setAttributes( { marginBottom: v } ) } />
					</PanelBody>

					<PanelBody title="ボタン" initialOpen={ false }>
						<RangeControl label="横に並べる数（PC）" min={ 1 } max={ 4 } value={ attributes.buttonColumnsPc }
							onChange={ ( v ) => setAttributes( { buttonColumnsPc: v } ) } />
						<RangeControl label="横に並べる数（スマホ）" min={ 1 } max={ 3 } value={ attributes.buttonColumnsSp }
							onChange={ ( v ) => setAttributes( { buttonColumnsSp: v } ) } />
						<RangeControl label="角の丸み" min={ 0 } max={ 40 } value={ attributes.buttonRadius }
							onChange={ ( v ) => setAttributes( { buttonRadius: v } ) } />
						<RangeControl label="文字の大きさ" min={ 11 } max={ 22 } value={ attributes.buttonFontSize }
							onChange={ ( v ) => setAttributes( { buttonFontSize: v } ) } />
					</PanelBody>

					<PanelBody title="色" initialOpen={ false }>
						<p>商品名</p>
						<ColorPalette value={ nameColor } onChange={ ( v ) => setAttributes( { nameColor: v || '#222222' } ) } />
						<p>ひとこと</p>
						<ColorPalette value={ commentColor } onChange={ ( v ) => setAttributes( { commentColor: v || '#666666' } ) } />
						<p>評価の星</p>
						<ColorPalette value={ attributes.scoreColor } onChange={ ( v ) => setAttributes( { scoreColor: v || '#f0a020' } ) } />
						<p>良い点</p>
						<ColorPalette value={ goodColor } onChange={ ( v ) => setAttributes( { goodColor: v || '#1f7a4d' } ) } />
						<p>気になる点</p>
						<ColorPalette value={ badColor } onChange={ ( v ) => setAttributes( { badColor: v || '#9c5a5a' } ) } />
						<p>箱の背景</p>
						<ColorPalette value={ attributes.boxBgColor } onChange={ ( v ) => setAttributes( { boxBgColor: v || '#ffffff' } ) } />
						<p>箱の枠</p>
						<ColorPalette value={ attributes.boxBorderColor } onChange={ ( v ) => setAttributes( { boxBorderColor: v || '#e5e5e5' } ) } />
						<p>1位の札</p>
						<ColorPalette value={ attributes.rank1Color } onChange={ ( v ) => setAttributes( { rank1Color: v || '#c9a227' } ) } />
						<p>2位の札</p>
						<ColorPalette value={ attributes.rank2Color } onChange={ ( v ) => setAttributes( { rank2Color: v || '#98a2ad' } ) } />
						<p>3位の札</p>
						<ColorPalette value={ attributes.rank3Color } onChange={ ( v ) => setAttributes( { rank3Color: v || '#b0763c' } ) } />
						<p>4位以下の札</p>
						<ColorPalette value={ attributes.rankOtherColor } onChange={ ( v ) => setAttributes( { rankOtherColor: v || '#8a8a8a' } ) } />
					</PanelBody>

					<PanelBody title="フォント" initialOpen={ false }>
						<SelectControl
							label="フォント"
							value={ FontSet }
							options={ fontOptionsArr() }
							onChange={ ( v ) => setAttributes( { FontSet: v } ) }
						/>
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					{ showPr && (
						<p className={ `${ CLS }__pr` } style={ { backgroundColor: prBgColor, color: prTextColor } }>
							{ prText }
						</p>
					) }
					{ list.map( ( item, i ) => {
						const shops = visibleShops( item );
						const percent = starPercent( item.score );
						return (
							<div key={ i } className={ `${ CLS }__item` } style={ boxStyle( attributes ) }>
								{ rankStyle !== 'none' && (
									<span
										className={ `${ CLS }__rank` }
										style={ { backgroundColor: rankColor( attributes, i ), color: rankTextColor } }
									>
										{ rankLabel( attributes, i ) }
									</span>
								) }
								<div className={ `${ CLS }__main` }>
									{ item.imageUrl && (
										<div className={ `${ CLS }__img` }>
											<img src={ item.imageUrl } alt={ item.imageAlt || '' } />
										</div>
									) }
									<div className={ `${ CLS }__body` }>
										<RichText
											tagName="p"
											className={ `${ CLS }__name` }
											value={ item.name }
											onChange={ ( v ) => setItem( i, 'name', v ) }
											placeholder="商品名"
											style={ { color: nameColor } }
											data-lw_font_set={ FontSet }
										/>
										{ showScore && percent && (
											<p className={ `${ CLS }__score` }>
												<Stars percent={ percent } />
												<span className={ `${ CLS }__score-num` }>{ item.score }</span>
											</p>
										) }
										<RichText
											tagName="p"
											className={ `${ CLS }__comment` }
											value={ item.comment }
											onChange={ ( v ) => setItem( i, 'comment', v ) }
											placeholder="選んだ理由をひとことで"
											style={ { color: commentColor } }
										/>
										<ul className={ `${ CLS }__points` }>
											<li className="is-good">
												<span className={ `${ CLS }__label` } style={ { color: goodColor } }>{ goodLabel }</span>
												<RichText tagName="span" value={ item.good }
													onChange={ ( v ) => setItem( i, 'good', v ) }
													placeholder="良かった点" />
											</li>
											<li className="is-bad">
												<span className={ `${ CLS }__label` } style={ { color: badColor } }>{ badLabel }</span>
												<RichText tagName="span" value={ item.bad }
													onChange={ ( v ) => setItem( i, 'bad', v ) }
													placeholder="気になった点（正直に書くほど信用されます）" />
											</li>
										</ul>
									</div>
								</div>
								{ !! shops.length && (
									<div className={ `${ CLS }__shops` } style={ shopsStyle( attributes, shops.length ) }>
										{ shops.map( ( s, k ) => (
											<span
												key={ k }
												className={ `${ CLS }__shop` }
												style={ { backgroundColor: s.bgColor, color: s.textColor, borderRadius: `${ buttonRadius }px` } }
												data-lw_font_set={ FontSet }
											>
												{ s.label }
											</span>
										) ) }
									</div>
								) }
							</div>
						);
					} ) }
					<Button variant="secondary" className={ `${ CLS }__ed-add` } onClick={ addItem }>＋ 順位を追加</Button>
				</div>
			</>
		);
	},

	save: ( { attributes } ) => {
		const {
			showPr, prText, items, rankStyle, showScore,
			goodLabel, badLabel, isAffiliate,
			nameColor, commentColor, goodColor, badColor,
			prBgColor, prTextColor, rankTextColor, buttonRadius, FontSet,
		} = attributes;

		const list = items || [];
		const blockProps = useBlockProps.save( { className: CLS, style: blockVars( attributes ) } );

		return (
			<div { ...blockProps }>
				{ showPr && (
					<p className={ `${ CLS }__pr` } style={ { backgroundColor: prBgColor, color: prTextColor } }>
						{ prText }
					</p>
				) }
				{ list.map( ( item, i ) => {
					const shops = visibleShops( item );
					const percent = starPercent( item.score );
					return (
						<div key={ i } className={ `${ CLS }__item` } style={ boxStyle( attributes ) }>
							{ rankStyle !== 'none' && (
								<span
									className={ `${ CLS }__rank` }
									style={ { backgroundColor: rankColor( attributes, i ), color: rankTextColor } }
								>
									{ rankLabel( attributes, i ) }
								</span>
							) }
							<div className={ `${ CLS }__main` }>
								{ item.imageUrl && (
									<div className={ `${ CLS }__img` }>
										<img src={ item.imageUrl } alt={ item.imageAlt || '' } />
									</div>
								) }
								<div className={ `${ CLS }__body` }>
									<RichText.Content
										tagName="p"
										className={ `${ CLS }__name` }
										value={ item.name }
										style={ { color: nameColor } }
										data-lw_font_set={ FontSet }
									/>
									{ showScore && percent && (
										<p className={ `${ CLS }__score` }>
											<Stars percent={ percent } />
											<span className={ `${ CLS }__score-num` }>{ item.score }</span>
										</p>
									) }
									<RichText.Content
										tagName="p"
										className={ `${ CLS }__comment` }
										value={ item.comment }
										style={ { color: commentColor } }
									/>
									{ /* 🚨 中身のある行だけ出す。空でも <li> を出すと、
									     ラベル（●ここが良い）だけの行が公開ページに残る。
									     CSS の li:empty では消せない（ラベルの span がいるので空ではない）。 */ }
									{ ( hasText( item.good ) || hasText( item.bad ) ) && (
										<ul className={ `${ CLS }__points` }>
											{ hasText( item.good ) && (
												<li className="is-good">
													<span className={ `${ CLS }__label` } style={ { color: goodColor } }>{ goodLabel }</span>
													<RichText.Content tagName="span" value={ item.good } />
												</li>
											) }
											{ hasText( item.bad ) && (
												<li className="is-bad">
													<span className={ `${ CLS }__label` } style={ { color: badColor } }>{ badLabel }</span>
													<RichText.Content tagName="span" value={ item.bad } />
												</li>
											) }
										</ul>
									) }
								</div>
							</div>
							{ !! shops.length && (
								<div className={ `${ CLS }__shops` } style={ shopsStyle( attributes, shops.length ) }>
									{ shops.map( ( s, k ) => (
										<a
											key={ k }
											className={ `${ CLS }__shop` }
											href={ s.url }
											target={ isAffiliate ? '_blank' : undefined }
											rel={ lwRel( { newTab: isAffiliate, affiliate: isAffiliate } ) }
											style={ { backgroundColor: s.bgColor, color: s.textColor, borderRadius: `${ buttonRadius }px` } }
											data-lw_font_set={ FontSet }
										>
											{ s.label }
										</a>
									) ) }
								</div>
							) }
						</div>
					);
				} ) }
			</div>
		);
	},
} );
