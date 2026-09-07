/**
 * FV 20 リード獲得（実績の数字つき）
 * ------------------------------------------------------------------
 * 上段＝左に色の面（見出し・説明・CTA）／右に写真。
 * 下段＝実績の数字を横に並べた帯。
 *
 * 信頼の証はCTAの近くにあるほど効くので、数字はページの下ではなく
 * ボタンのすぐ下に置く。数字が無い商売では showStats を false にして
 * 帯ごと消す（ここに作った数字を置かないこと）。
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

const LINK_KEYS = { url: 'buttonUrl', type: 'buttonLinkType', page: 'buttonPageId', category: 'buttonCategoryId' };

/* 🚨 CSS変数の値は必ず「文字列」で渡す。数値のまま渡すと WordPress 6.8 以下の書き出しが
   カスタムプロパティにも px を足し（--fv20-stats-cols:4px / --fv18-filter-opacity:0.86px）、
   その宣言ごと無効になる。→ repeat(4px,1fr) が none に落ちて数字の帯が1列に潰れる／
   opacity が初期値 1 に戻って写真が幕で塗り潰される。var() のフォールバックは効かない
   （変数は「定義されている」ため）。WordPress 6.9 以降は除外されるので手元では再現しない。
   🚨 `?? 既定値` も外さない。RangeControl は数値欄を空にすると undefined を渡すので、
   ガードが無いと `undefinedpx` が保存され、grid が none に落ちて PC でも1カラムに潰れる。
   （2026-09-07 の複数AIレビューで検出。手元の WordPress 11本で挙動を実測した） */
const styleVars = (a) => ({
	'--fv20-panel-bg': a.panelBgColor,
	'--fv20-max-width': `${a.maxWidth ?? 600}px`,
	'--fv20-eyebrow-color': a.eyebrowColor,
	'--fv20-title-color': a.titleColor,
	'--fv20-title-weight': a.titleFontWeight,
	'--fv20-title-size-pc': `${a.titleFontSizePc ?? 44}px`,
	'--fv20-title-size-sp': `${a.titleFontSizeSp ?? 29}px`,
	'--fv20-description-color': a.descriptionColor,
	'--fv20-cta-bg': a.ctaBgColor,
	'--fv20-cta-text': a.ctaTextColor,
	'--fv20-cta-sub': a.ctaSubColor,
	'--fv20-cta-radius': `${a.ctaBorderRadius ?? 6}px`,
	'--fv20-stats-bg': a.statsBgColor,
	'--fv20-stats-num': a.statsNumColor,
	'--fv20-stats-unit': a.statsUnitColor,
	'--fv20-stats-label': a.statsLabelColor,
	'--fv20-stats-line': a.statsTopLineColor,
	'--fv20-stats-cols': String((a.statsItems || []).length || 4),
	'--fv20-stats-cols-sp': String(a.statsColumnsSp ?? 2),
});

const rootClass = (a) => [
	'lw-pr-fv-20',
	a.imageSide === 'left' ? 'image_left' : 'image_right',
].filter(Boolean).join(' ');

const topClass = (a) => ['fv20_top', a.minHeightPc, a.minHeightTb, a.minHeightSp].filter(Boolean).join(' ');

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			panelBgColor, imageUrlPc, imageUrlSp, imageAlt, imageSide,
			minHeightPc, minHeightTb, minHeightSp, maxWidth,
			showEyebrow, eyebrow, eyebrowColor,
			headingLevel, mainTitle, titleColor, titleFontWeight, titleFont, titleFontSizePc, titleFontSizeSp,
			description, descriptionColor,
			buttonText, buttonSub, buttonUrl, ctaBgColor, ctaTextColor, ctaSubColor, ctaBorderRadius,
			showStats, statsItems = [], statsBgColor, statsNumColor, statsUnitColor, statsLabelColor, statsTopLineColor, statsColumnsSp,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;

		const updateStat = (i, key, v) => setAttributes({ statsItems: statsItems.map((it, n) => (n === i ? { ...it, [key]: v } : it)) });
		const addStat = () => setAttributes({ statsItems: [...statsItems, { num: '0', unit: '件', label: '説明' }] });
		const removeStat = (i) => setAttributes({ statsItems: statsItems.filter((_, n) => n !== i) });
		const moveStat = (i, d) => {
			const to = i + d;
			if (to < 0 || to >= statsItems.length) return;
			const next = [...statsItems];
			const [m] = next.splice(i, 1);
			next.splice(to, 0, m);
			setAttributes({ statsItems: next });
		};

		const blockProps = useBlockProps({ className: rootClass(attributes), style: styleVars(attributes) });

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<SelectControl
							label="写真を置く側"
							value={imageSide}
							options={[{ label: '右', value: 'right' }, { label: '左', value: 'left' }]}
							onChange={(v) => setAttributes({ imageSide: v })}
						/>
						<RangeControl label="文章側の最大横幅" value={maxWidth} onChange={(v) => setAttributes({ maxWidth: v })} min={420} max={760} step={10} />
						<SelectControl label="上段の高さ（パソコン）" value={minHeightPc} options={minHeightPcClassOptionArr()} onChange={(v) => setAttributes({ minHeightPc: v })} />
						<SelectControl label="上段の高さ（タブレット）" value={minHeightTb} options={minHeightTbClassOptionArr()} onChange={(v) => setAttributes({ minHeightTb: v })} />
						<SelectControl label="上段の高さ（スマホ）" value={minHeightSp} options={minHeightSpClassOptionArr()} onChange={(v) => setAttributes({ minHeightSp: v })} />
						<SelectControl
							label="見出しの階層"
							value={headingLevel}
							options={[{ label: 'H1', value: 1 }, { label: 'H2', value: 2 }, { label: 'H3', value: 3 }]}
							onChange={(v) => setAttributes({ headingLevel: Number(v) })}
						/>
						<p style={{ margin: '12px 0 4px' }}>文章側の面の色</p>
						<ColorPalette value={panelBgColor} onChange={(v) => setAttributes({ panelBgColor: v })} />
					</PanelBody>

					<PanelBody title="写真" initialOpen={false}>
						<p style={{ margin: '0 0 4px' }}>パソコン用</p>
						<MediaUpload onSelect={(m) => setAttributes({ imageUrlPc: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>} />
						<TextControl label="画像のURL（パソコン）" value={imageUrlPc} onChange={(v) => setAttributes({ imageUrlPc: v })} />
						<p style={{ margin: '12px 0 4px' }}>スマホ用（空ならパソコン用）</p>
						<MediaUpload onSelect={(m) => setAttributes({ imageUrlSp: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>} />
						<TextControl label="画像のURL（スマホ）" value={imageUrlSp} onChange={(v) => setAttributes({ imageUrlSp: v })} />
						<TextControl label="画像の説明（alt）" value={imageAlt} onChange={(v) => setAttributes({ imageAlt: v })} />
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
						<RangeControl label="見出しの大きさ（パソコン）" value={titleFontSizePc} onChange={(v) => setAttributes({ titleFontSizePc: v })} min={24} max={60} step={1} />
						<RangeControl label="見出しの大きさ（スマホ）" value={titleFontSizeSp} onChange={(v) => setAttributes({ titleFontSizeSp: v })} min={18} max={40} step={1} />
						<SelectControl label="見出しの太さ" value={titleFontWeight} options={fontWeightOptionsArr()} onChange={(v) => setAttributes({ titleFontWeight: v })} />
						<SelectControl label="見出しの書体" value={titleFont} options={fontOptionsArr()} onChange={(v) => setAttributes({ titleFont: v })} />
						<p style={{ margin: '12px 0 4px' }}>見出しの色</p>
						<ColorPalette value={titleColor} onChange={(v) => setAttributes({ titleColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>説明文の色</p>
						<ColorPalette value={descriptionColor} onChange={(v) => setAttributes({ descriptionColor: v })} />
					</PanelBody>

					<PanelBody title="ボタン" initialOpen={false}>
						<TextControl label="ボタンの文字" value={buttonText} onChange={(v) => setAttributes({ buttonText: v })} />
						<TextControl label="ボタンの下の小さい文字" value={buttonSub} onChange={(v) => setAttributes({ buttonSub: v })} help="「全10問・3分・登録不要」のように、かかる時間を書きます。" />
						<TextControl label="リンク先のURL" value={buttonUrl} onChange={(v) => setAttributes({ buttonUrl: v })} placeholder="#form など" />
						<LinkPicker link={lwLinkFromAttrs(attributes, LINK_KEYS)} onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))} />
						<p style={{ margin: '12px 0 4px' }}>背景色</p>
						<ColorPalette value={ctaBgColor} onChange={(v) => setAttributes({ ctaBgColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>文字色</p>
						<ColorPalette value={ctaTextColor} onChange={(v) => setAttributes({ ctaTextColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>小さい文字の色</p>
						<ColorPalette value={ctaSubColor} onChange={(v) => setAttributes({ ctaSubColor: v })} />
						<RangeControl label="角の丸み" value={ctaBorderRadius} onChange={(v) => setAttributes({ ctaBorderRadius: v })} min={0} max={40} step={1} />
					</PanelBody>

					<PanelBody title="実績の数字（下の帯）" initialOpen={true}>
						<ToggleControl label="数字の帯を出す" checked={showStats} onChange={(v) => setAttributes({ showStats: v })} />
						{showStats && (
							<>
								<p style={{ margin: '4px 0 12px', fontSize: 12, color: '#a04a28' }}>
									🚨 本当の数字だけを入れてください。実績が無いときは帯ごと消します。
								</p>
								{statsItems.map((it, i) => (
									<div key={i} style={{ borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 10 }}>
										<TextControl label={`${i + 1}つめ：数字`} value={it.num} onChange={(v) => updateStat(i, 'num', v)} />
										<TextControl label="単位" value={it.unit} onChange={(v) => updateStat(i, 'unit', v)} help="人・件・%・分・円 など" />
										<TextControl label="説明" value={it.label} onChange={(v) => updateStat(i, 'label', v)} />
										<div style={{ display: 'flex', gap: 6 }}>
											<Button variant="secondary" onClick={() => moveStat(i, -1)} disabled={i === 0}>↑</Button>
											<Button variant="secondary" onClick={() => moveStat(i, 1)} disabled={i === statsItems.length - 1}>↓</Button>
											<Button isDestructive onClick={() => removeStat(i)}>削除</Button>
										</div>
									</div>
								))}
								<Button variant="primary" onClick={addStat} style={{ marginTop: 12 }}>数字を追加</Button>
								<SelectControl
									label="スマホでの列数"
									value={statsColumnsSp}
									options={[{ label: '1列', value: 1 }, { label: '2列', value: 2 }]}
									onChange={(v) => setAttributes({ statsColumnsSp: Number(v) })}
									help="数字が長い（12,480 など）ときは1列にします。"
								/>
								<p style={{ margin: '12px 0 4px' }}>帯の背景色</p>
								<ColorPalette value={statsBgColor} onChange={(v) => setAttributes({ statsBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>数字の色</p>
								<ColorPalette value={statsNumColor} onChange={(v) => setAttributes({ statsNumColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>単位の色</p>
								<ColorPalette value={statsUnitColor} onChange={(v) => setAttributes({ statsUnitColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>説明の色</p>
								<ColorPalette value={statsLabelColor} onChange={(v) => setAttributes({ statsLabelColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>帯の上の線の色</p>
								<ColorPalette value={statsTopLineColor} onChange={(v) => setAttributes({ statsTopLineColor: v })} />
							</>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className={topClass(attributes)}>
						<div className="txt_side">
							<div className="txt_inner">
								{showEyebrow && eyebrow && <p className="eyebrow">{eyebrow}</p>}
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
								{buttonText && (
									<span className="cta_btn">
										{buttonText}
										{buttonSub && <small>{buttonSub}</small>}
									</span>
								)}
							</div>
						</div>
						<div className="pic_side">
							{imageUrlPc && <img src={imageUrlPc} alt={imageAlt} />}
						</div>
					</div>
					{showStats && statsItems.length > 0 && (
						<div className="stats_bar">
							{statsItems.map((it, i) => (
								<div className="stat" key={i}>
									<p className="n">{it.num}{it.unit && <span className="u">{it.unit}</span>}</p>
									{it.label && <p className="l">{it.label}</p>}
								</div>
							))}
						</div>
					)}
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			imageUrlPc, imageUrlSp, imageAlt,
			showEyebrow, eyebrow, headingLevel, mainTitle, titleFont, description,
			buttonText, buttonSub, buttonUrl,
			showStats, statsItems = [],
		} = attributes;

		const HeadingTag = `h${headingLevel}`;
		const linkData = lwLinkDataPropsFromAttrs(attributes, LINK_KEYS);
		const blockProps = useBlockProps.save({ className: rootClass(attributes), style: styleVars(attributes) });

		return (
			<div {...blockProps}>
				<div className={topClass(attributes)}>
					<div className="txt_side">
						<div className="txt_inner">
							{showEyebrow && eyebrow && <p className="eyebrow">{eyebrow}</p>}
							<RichText.Content tagName={HeadingTag} className="main_ttl" data-lw_font_set={titleFont} value={mainTitle} />
							{description && <RichText.Content tagName="p" className="description" value={description} />}
							{buttonText && (
								<a className="cta_btn" href={buttonUrl} data-lw-link-type={linkData.linkType} data-lw-link-id={linkData.linkId}>
									{buttonText}
									{buttonSub && <small>{buttonSub}</small>}
								</a>
							)}
						</div>
					</div>
					<div className="pic_side">
						{imageUrlPc && (
							<picture>
								<source srcSet={imageUrlSp || imageUrlPc} media="(max-width: 800px)" />
								<source srcSet={imageUrlPc} media="(min-width: 801px)" />
								<img src={imageUrlPc} alt={imageAlt} />
							</picture>
						)}
					</div>
				</div>
				{showStats && statsItems.length > 0 && (
					<div className="stats_bar">
						{statsItems.map((it, i) => (
							<div className="stat" key={i}>
								<p className="n">{it.num}{it.unit && <span className="u">{it.unit}</span>}</p>
								{it.label && <p className="l">{it.label}</p>}
							</div>
						))}
					</div>
				)}
			</div>
		);
	},
};

registerBlockType(metadata.name, lwBlockDef);
