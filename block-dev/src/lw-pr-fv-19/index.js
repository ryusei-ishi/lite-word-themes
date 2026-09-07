/**
 * FV 19 リード獲得（電話とフォームの二択）
 * ------------------------------------------------------------------
 * 「話したい人」と「文字で済ませたい人」を同じ大きさで受ける。
 * それぞれに受付時間・所要時間を添えられるのがこのブロックの肝で、
 * 「押した先で何が起きるか」と「どれくらいかかるか」が分かるほど押される。
 *
 * 🚨 telAsLink が true のときは、画面幅に関係なく tel: の発信リンク（<a>）で書き出す。
 *    パソコンでも押せる。押させたくないときは telAsLink を false にする（<span> になる）。
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

const LINK_KEYS = { url: 'ctaUrl', type: 'ctaLinkType', page: 'ctaPageId', category: 'ctaCategoryId' };

/* 🚨 CSS変数の値は必ず「文字列」で渡す。数値のまま渡すと WordPress 6.8 以下の書き出しが
   カスタムプロパティにも px を足し（--fv20-stats-cols:4px / --fv18-filter-opacity:0.86px）、
   その宣言ごと無効になる。→ repeat(4px,1fr) が none に落ちて数字の帯が1列に潰れる／
   opacity が初期値 1 に戻って写真が幕で塗り潰される。var() のフォールバックは効かない
   （変数は「定義されている」ため）。WordPress 6.9 以降は除外されるので手元では再現しない。
   🚨 `?? 既定値` も外さない。RangeControl は数値欄を空にすると undefined を渡すので、
   ガードが無いと `undefinedpx` が保存され、grid が none に落ちて PC でも1カラムに潰れる。
   （2026-09-07 の複数AIレビューで検出。手元の WordPress 11本で挙動を実測した） */
const styleVars = (a) => ({
	'--fv19-max-width': `${a.maxWidth ?? 1000}px`,
	'--fv19-bg': a.bgColor,
	'--fv19-filter-color': a.filterColor,
	'--fv19-filter-opacity': String(a.filterOpacity ?? 0.82),
	'--fv19-eyebrow-color': a.eyebrowColor,
	'--fv19-title-color': a.titleColor,
	'--fv19-title-weight': a.titleFontWeight,
	'--fv19-title-size-pc': `${a.titleFontSizePc ?? 46}px`,
	'--fv19-title-size-sp': `${a.titleFontSizeSp ?? 29}px`,
	'--fv19-description-color': a.descriptionColor,
	'--fv19-tel-bg': a.telBgColor,
	'--fv19-tel-text': a.telTextColor,
	'--fv19-tel-sub': a.telSubColor,
	'--fv19-cta-bg': a.ctaBgColor,
	'--fv19-cta-text': a.ctaTextColor,
	'--fv19-cta-sub': a.ctaSubColor,
	'--fv19-cta-radius': `${a.ctaBorderRadius ?? 9}px`,
	'--fv19-safe-color': a.safeColor,
	'--fv19-safe-mark': a.safeMarkColor,
});

const rootClass = (a) => [
	'lw-pr-fv-19',
	a.minHeightPc, a.minHeightTb, a.minHeightSp,
	a.textAlign === 'left' ? 'align_left' : 'align_center',
	a.ctaOrder === 'cta-first' ? 'cta_first' : 'tel_first',
].filter(Boolean).join(' ');

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			backgroundType, imageUrlPc, imageUrlSp, imageAlt, bgColor, filterColor, filterOpacity,
			minHeightPc, minHeightTb, minHeightSp, maxWidth, textAlign, ctaOrder,
			showEyebrow, eyebrow, eyebrowColor,
			headingLevel, mainTitle, titleColor, titleFontWeight, titleFont, titleFontSizePc, titleFontSizeSp,
			description, descriptionColor,
			showTel, telKicker, telNumber, telSub, telHref, telAsLink, telBgColor, telTextColor, telSubColor,
			showCta, ctaKicker, ctaText, ctaSub, ctaUrl, ctaBgColor, ctaTextColor, ctaSubColor, ctaBorderRadius,
			showSafe, safeItems = [], safeColor, safeMarkColor,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;

		const updateSafe = (i, v) => setAttributes({ safeItems: safeItems.map((it, n) => (n === i ? { ...it, text: v } : it)) });
		const addSafe = () => setAttributes({ safeItems: [...safeItems, { text: '新しい一言' }] });
		const removeSafe = (i) => setAttributes({ safeItems: safeItems.filter((_, n) => n !== i) });
		const moveSafe = (i, d) => {
			const to = i + d;
			if (to < 0 || to >= safeItems.length) return;
			const next = [...safeItems];
			const [m] = next.splice(i, 1);
			next.splice(to, 0, m);
			setAttributes({ safeItems: next });
		};

		const blockProps = useBlockProps({ className: rootClass(attributes), style: styleVars(attributes) });

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<SelectControl
							label="文字の寄せ方"
							value={textAlign}
							options={[{ label: '中央寄せ', value: 'center' }, { label: '左寄せ', value: 'left' }]}
							onChange={(v) => setAttributes({ textAlign: v })}
						/>
						<SelectControl
							label="どちらを先に置くか"
							value={ctaOrder}
							options={[{ label: '電話を先（おすすめ）', value: 'tel-first' }, { label: 'フォームを先', value: 'cta-first' }]}
							onChange={(v) => setAttributes({ ctaOrder: v })}
						/>
						<RangeControl label="全体の最大横幅" value={maxWidth} onChange={(v) => setAttributes({ maxWidth: v })} min={760} max={1300} step={20} />
						<SelectControl label="高さ（パソコン）" value={minHeightPc} options={minHeightPcClassOptionArr()} onChange={(v) => setAttributes({ minHeightPc: v })} />
						<SelectControl label="高さ（タブレット）" value={minHeightTb} options={minHeightTbClassOptionArr()} onChange={(v) => setAttributes({ minHeightTb: v })} />
						<SelectControl label="高さ（スマホ）" value={minHeightSp} options={minHeightSpClassOptionArr()} onChange={(v) => setAttributes({ minHeightSp: v })} />
						<SelectControl
							label="見出しの階層"
							value={headingLevel}
							options={[{ label: 'H1', value: 1 }, { label: 'H2', value: 2 }, { label: 'H3', value: 3 }]}
							onChange={(v) => setAttributes({ headingLevel: Number(v) })}
						/>
					</PanelBody>

					<PanelBody title="背景" initialOpen={false}>
						<SelectControl
							label="背景の種類"
							value={backgroundType}
							options={[{ label: '画像', value: 'image' }, { label: '色だけ', value: 'color' }]}
							onChange={(v) => setAttributes({ backgroundType: v })}
						/>
						{backgroundType === 'image' && (
							<>
								<p style={{ margin: '12px 0 4px' }}>パソコン用の背景画像</p>
								<MediaUpload onSelect={(m) => setAttributes({ imageUrlPc: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>} />
								<TextControl label="画像のURL（パソコン）" value={imageUrlPc} onChange={(v) => setAttributes({ imageUrlPc: v })} />
								<p style={{ margin: '12px 0 4px' }}>スマホ用の背景画像（空ならパソコン用）</p>
								<MediaUpload onSelect={(m) => setAttributes({ imageUrlSp: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>} />
								<TextControl label="画像のURL（スマホ）" value={imageUrlSp} onChange={(v) => setAttributes({ imageUrlSp: v })} />
								<TextControl label="画像の説明（alt）" value={imageAlt} onChange={(v) => setAttributes({ imageAlt: v })} />
							</>
						)}
						<p style={{ margin: '16px 0 4px' }}>{backgroundType === 'image' ? '写真に重ねる色' : '背景の色'}</p>
						<ColorPalette
							value={backgroundType === 'image' ? filterColor : bgColor}
							onChange={(v) => setAttributes(backgroundType === 'image' ? { filterColor: v } : { bgColor: v })}
						/>
						{backgroundType === 'image' && (
							<RangeControl label="重ねる色の濃さ" value={filterOpacity} onChange={(v) => setAttributes({ filterOpacity: v })} min={0} max={1} step={0.01} />
						)}
					</PanelBody>

					<PanelBody title="肩ラベル・見出し・説明文" initialOpen={false}>
						<ToggleControl label="肩ラベルを出す" checked={showEyebrow} onChange={(v) => setAttributes({ showEyebrow: v })} />
						{showEyebrow && (
							<>
								<TextControl label="肩ラベルの文字" value={eyebrow} onChange={(v) => setAttributes({ eyebrow: v })} />
								<p style={{ margin: '8px 0 4px' }}>肩ラベルの色</p>
								<ColorPalette value={eyebrowColor} onChange={(v) => setAttributes({ eyebrowColor: v })} />
							</>
						)}
						<RangeControl label="見出しの大きさ（パソコン）" value={titleFontSizePc} onChange={(v) => setAttributes({ titleFontSizePc: v })} min={24} max={64} step={1} />
						<RangeControl label="見出しの大きさ（スマホ）" value={titleFontSizeSp} onChange={(v) => setAttributes({ titleFontSizeSp: v })} min={18} max={40} step={1} />
						<SelectControl label="見出しの太さ" value={titleFontWeight} options={fontWeightOptionsArr()} onChange={(v) => setAttributes({ titleFontWeight: v })} />
						<SelectControl label="見出しの書体" value={titleFont} options={fontOptionsArr()} onChange={(v) => setAttributes({ titleFont: v })} />
						<p style={{ margin: '12px 0 4px' }}>見出しの色</p>
						<ColorPalette value={titleColor} onChange={(v) => setAttributes({ titleColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>説明文の色</p>
						<ColorPalette value={descriptionColor} onChange={(v) => setAttributes({ descriptionColor: v })} />
					</PanelBody>

					<PanelBody title="電話のボタン" initialOpen={true}>
						<ToggleControl label="電話のボタンを出す" checked={showTel} onChange={(v) => setAttributes({ showTel: v })} />
						{showTel && (
							<>
								<TextControl label="上の小さい文字" value={telKicker} onChange={(v) => setAttributes({ telKicker: v })} />
								<TextControl label="電話番号（見せ方）" value={telNumber} onChange={(v) => setAttributes({ telNumber: v })} help="ハイフン込みで書きます。" />
								<TextControl label="発信に使う番号" value={telHref} onChange={(v) => setAttributes({ telHref: v })} help="数字だけ（ハイフンなし）。" />
								<ToggleControl label="電話番号を発信リンクにする" checked={telAsLink} onChange={(v) => setAttributes({ telAsLink: v })} help="パソコンでも押すと発信します。切ると押せない文字になります。" />
								<TextControl label="下の小さい文字" value={telSub} onChange={(v) => setAttributes({ telSub: v })} help="受付時間や通話にかかる時間を書きます。" />
								<p style={{ margin: '12px 0 4px' }}>背景色</p>
								<ColorPalette value={telBgColor} onChange={(v) => setAttributes({ telBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>文字色</p>
								<ColorPalette value={telTextColor} onChange={(v) => setAttributes({ telTextColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>下の小さい文字の色</p>
								<ColorPalette value={telSubColor} onChange={(v) => setAttributes({ telSubColor: v })} />
							</>
						)}
					</PanelBody>

					<PanelBody title="フォームのボタン" initialOpen={true}>
						<ToggleControl label="フォームのボタンを出す" checked={showCta} onChange={(v) => setAttributes({ showCta: v })} />
						{showCta && (
							<>
								<TextControl label="上の小さい文字" value={ctaKicker} onChange={(v) => setAttributes({ ctaKicker: v })} />
								<TextControl label="ボタンの文字" value={ctaText} onChange={(v) => setAttributes({ ctaText: v })} />
								<TextControl label="下の小さい文字" value={ctaSub} onChange={(v) => setAttributes({ ctaSub: v })} help="受付時間や入力にかかる時間を書きます。" />
								<TextControl label="リンク先のURL" value={ctaUrl} onChange={(v) => setAttributes({ ctaUrl: v })} placeholder="#form など" />
								<LinkPicker link={lwLinkFromAttrs(attributes, LINK_KEYS)} onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))} />
								<p style={{ margin: '12px 0 4px' }}>背景色</p>
								<ColorPalette value={ctaBgColor} onChange={(v) => setAttributes({ ctaBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>文字色</p>
								<ColorPalette value={ctaTextColor} onChange={(v) => setAttributes({ ctaTextColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>下の小さい文字の色</p>
								<ColorPalette value={ctaSubColor} onChange={(v) => setAttributes({ ctaSubColor: v })} />
								<RangeControl label="角の丸み" value={ctaBorderRadius} onChange={(v) => setAttributes({ ctaBorderRadius: v })} min={0} max={40} step={1} />
							</>
						)}
					</PanelBody>

					<PanelBody title="安心の一言（ボタンの下）" initialOpen={false}>
						<ToggleControl label="一言を並べる" checked={showSafe} onChange={(v) => setAttributes({ showSafe: v })} />
						{showSafe && (
							<>
								{safeItems.map((it, i) => (
									<div key={i} style={{ borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 10 }}>
										<TextControl label={`${i + 1}つめ`} value={it.text} onChange={(v) => updateSafe(i, v)} />
										<div style={{ display: 'flex', gap: 6 }}>
											<Button variant="secondary" onClick={() => moveSafe(i, -1)} disabled={i === 0}>↑</Button>
											<Button variant="secondary" onClick={() => moveSafe(i, 1)} disabled={i === safeItems.length - 1}>↓</Button>
											<Button isDestructive onClick={() => removeSafe(i)}>削除</Button>
										</div>
									</div>
								))}
								<Button variant="primary" onClick={addSafe} style={{ marginTop: 12 }}>一言を追加</Button>
								<p style={{ margin: '16px 0 4px' }}>文字の色</p>
								<ColorPalette value={safeColor} onChange={(v) => setAttributes({ safeColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>印の色</p>
								<ColorPalette value={safeMarkColor} onChange={(v) => setAttributes({ safeMarkColor: v })} />
							</>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="bg_filter">
						<div className="bg_filter_inner"></div>
						{backgroundType === 'image' && imageUrlPc && <img src={imageUrlPc} alt={imageAlt} />}
					</div>
					<div className="this_wrap">
						{showEyebrow && eyebrow && <span className="eyebrow">{eyebrow}</span>}
						<RichText
							tagName={HeadingTag}
							className="main_ttl"
							data-lw_font_set={titleFont}
							value={mainTitle}
							onChange={(v) => setAttributes({ mainTitle: v })}
							placeholder="ここに見出し"
						/>
						<RichText
							tagName="p"
							className="description"
							value={description}
							onChange={(v) => setAttributes({ description: v })}
							placeholder="ここに説明文"
						/>
						<div className="two_cta">
							{showTel && telNumber && (
								<span className="cta_box tel">
									{telKicker && <span className="k">{telKicker}</span>}
									<span className="m">{telNumber}</span>
									{telSub && <span className="s">{telSub}</span>}
								</span>
							)}
							{showCta && ctaText && (
								<span className="cta_box form">
									{ctaKicker && <span className="k">{ctaKicker}</span>}
									<span className="m">{ctaText}</span>
									{ctaSub && <span className="s">{ctaSub}</span>}
								</span>
							)}
						</div>
						{showSafe && safeItems.length > 0 && (
							<ul className="safe_list">
								{safeItems.map((it, i) => <li key={i}><i>✓</i><span>{it.text}</span></li>)}
							</ul>
						)}
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			backgroundType, imageUrlPc, imageUrlSp, imageAlt,
			showEyebrow, eyebrow, headingLevel, mainTitle, titleFont, description,
			showTel, telKicker, telNumber, telSub, telHref, telAsLink,
			showCta, ctaKicker, ctaText, ctaSub, ctaUrl,
			showSafe, safeItems = [],
		} = attributes;

		const HeadingTag = `h${headingLevel}`;
		const linkData = lwLinkDataPropsFromAttrs(attributes, LINK_KEYS);
		/* 🚨 発信番号は数字（と先頭の + ）だけに落とす。ハイフンや空白が混じった番号は
				   端末によって発信に失敗する。表示用の telNumber は別属性なので見た目は変わらない。 */
				const telNo = String(telHref ?? '').replace(/[^0-9+]/g, '');
				const telIsLink = telAsLink && telNo !== '';

		const blockProps = useBlockProps.save({ className: rootClass(attributes), style: styleVars(attributes) });

		const telInner = (
			<>
				{telKicker && <span className="k">{telKicker}</span>}
				<span className="m">{telNumber}</span>
				{telSub && <span className="s">{telSub}</span>}
			</>
		);

		return (
			<div {...blockProps}>
				<div className="bg_filter">
					<div className="bg_filter_inner"></div>
					{backgroundType === 'image' && imageUrlPc && (
						<picture>
							<source srcSet={imageUrlSp || imageUrlPc} media="(max-width: 800px)" />
							<source srcSet={imageUrlPc} media="(min-width: 801px)" />
							<img src={imageUrlPc} alt={imageAlt} />
						</picture>
					)}
				</div>
				<div className="this_wrap">
					{showEyebrow && eyebrow && <span className="eyebrow">{eyebrow}</span>}
					<RichText.Content tagName={HeadingTag} className="main_ttl" data-lw_font_set={titleFont} value={mainTitle} />
					{description && <RichText.Content tagName="p" className="description" value={description} />}
					<div className="two_cta">
						{showTel && telNumber && (
							telIsLink
								? <a className="cta_box tel is_tel" href={`tel:${telNo}`}>{telInner}</a>
								: <span className="cta_box tel">{telInner}</span>
						)}
						{showCta && ctaText && (
							<a className="cta_box form" href={ctaUrl} data-lw-link-type={linkData.linkType} data-lw-link-id={linkData.linkId}>
								{ctaKicker && <span className="k">{ctaKicker}</span>}
								<span className="m">{ctaText}</span>
								{ctaSub && <span className="s">{ctaSub}</span>}
							</a>
						)}
					</div>
					{showSafe && safeItems.length > 0 && (
						<ul className="safe_list">
							{safeItems.map((it, i) => <li key={i}><i>✓</i><span>{it.text}</span></li>)}
						</ul>
					)}
				</div>
			</div>
		);
	},
};

registerBlockType(metadata.name, lwBlockDef);
