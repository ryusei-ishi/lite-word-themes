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
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
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

const lwBlockDef = {
	/* ----------------------------------------------------------
	 * 編集画面
	 * -------------------------------------------------------- */
	edit( { attributes, setAttributes } ) {
		const {
			backgroundImage,
			backgroundImageSp,
			backgroundImageAlt,
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

		// useBlockPropsは条件付きreturnの前に呼ぶ（Reactフックのルール）
		const blockProps = useBlockProps({
			className: `fv-6 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		/* 固定ページ以外では警告 */
		const currentPostType = useSelect( select => select('core/editor').getCurrentPostType() );
		if ( currentPostType !== 'page' ) {
			return <div {...blockProps}><p>このブロックは固定ページでのみ使用できます。</p></div>;
		}

		/* 画像選択ハンドラ */
		const onChangeBackgroundImage   = media => setAttributes( { backgroundImage: media.url, backgroundImageAlt: media.alt || '' } );
		const onChangeBackgroundImageSp = media => setAttributes( { backgroundImageSp: media.url } );

		const TagName = mainTitleTag || 'h1';

		return (
			<>
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
						<TextControl
							label="画像の説明（alt）"
							help={ "目の見えない方や検索エンジンに、この画像が何かを伝える文です。例：ガラス張りのオフィスビルを見上げた外観" }
							value={ backgroundImageAlt || '' }
							onChange={ value => setAttributes( { backgroundImageAlt: value } ) }
							style={ { marginTop: '16px' } }
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
					<PanelBody title="色設定">
						<ColorPalette
							value={ textColor }
							onChange={ color => setAttributes( { textColor: color } ) }
						/>
					</PanelBody>

					{/* 高さ設定 */}
					<PanelBody title="レイアウト設定">
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
				<div {...blockProps}>
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
					<div className="bg_image">{ backgroundImage && <img src={ backgroundImage } alt={ backgroundImageAlt || '' } /> }</div>
					<div className="filter" style={ { backgroundColor: filterBackgroundColor, opacity: filterOpacity } } />
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
			backgroundImageAlt,
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

		const blockProps = useBlockProps.save({
			className: `fv-6 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		return (
			<div {...blockProps}>
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
						<img src={ backgroundImage } alt={ backgroundImageAlt || '' } loading="eager" fetchpriority="high" />
					</picture>
				) }
			</div>
		);
	},
};

/* ------------------------------------------------------------------
 * #1169（2026-08-27）既定値の他社CDN直リンクを自社素材に差し替えた。
 * 既定値と同じ値はブロックコメントに書かれないので、既定値のまま使っている
 * 既存ページは「保存HTMLは旧URL／ブロックは新しい既定値」で食い違う。
 * 旧既定値を持った版を残して、開いて保存し直しても画像が入れ替わらないようにする。
 * 🚨 save は現行と同じ関数をそのまま渡す（マークアップは変えていない）。
 * ------------------------------------------------------------------ */
const LW_1169_OLD = JSON.parse( JSON.stringify( metadata.attributes ) );
LW_1169_OLD.backgroundImage.default = "https://cdn.pixabay.com/photo/2016/11/19/15/39/architecture-1839930_1280.jpg";

/* 🚨 すでにある deprecated は attributes: metadata.attributes を使っている＝新しい既定値を指す。
 *    そのままだと「古い save ＋ 古い既定値」で保存されたページ（サンプル画像のまま使っている人の
 *    大多数がこれ）がどの版にも当たらなくなる。だから既存の版それぞれについて
 *    旧既定値を持たせた双子を作って先に並べる。元の版も残す（画像を自分で差し替えた人向け）。 */
const lwPrev1169 = lwBlockDef.deprecated || [];
lwBlockDef.deprecated = [
	{ attributes: LW_1169_OLD, save: lwBlockDef.save },
	...lwPrev1169.map( ( d ) => ( { ...d, attributes: LW_1169_OLD } ) ),
	...lwPrev1169,
];

registerBlockType( metadata.name, lwBlockDef );
