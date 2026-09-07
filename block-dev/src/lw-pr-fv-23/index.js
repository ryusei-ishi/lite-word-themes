/**
 * FV 23 リード獲得（QRコードで登録）
 * ------------------------------------------------------------------
 * 左＝登録するとできること＋大きな登録ボタン／右＝白いカードにQRコード。
 *
 * 「登録してください」だけでは登録されない。理由はほとんど2つで、
 *   ① 何が届くのか分からない  ② やめ方が分からない
 * なので、できることの一覧（benefitItems）と
 * 「いつでも解除できます」（noteText）を最初から形にしてある。
 *
 * 🚨 パソコンの人はQRコードを読み、スマホの人はボタンを押す。
 *    スマホで自分の画面のQRは読めないので、既定ではスマホでQRを隠す
 *    （showQrOnSp = false）。
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';
import { lwRel } from '../affiliate-link.js';

const LINK_KEYS = { url: 'buttonUrl', type: 'buttonLinkType', page: 'buttonPageId', category: 'buttonCategoryId' };

/* 🚨 CSS変数の値は必ず「文字列」で渡す。数値のまま渡すと WordPress 6.8 以下の書き出しが
   カスタムプロパティにも px を足し（--fv23-filter-opacity:0.88px）、その宣言ごと無効になる。
   → 写真の上に置いた幕が消えて（opacity が初期値 1 に戻り）文字が読めなくなる。
   var() のフォールバックは効かない（変数は「定義されている」ため）。
   🚨 `?? 既定値` も外さない。RangeControl は数値欄を空にすると undefined を渡すので、
   ガードが無いと `undefinedpx` が保存される。 */
const styleVars = (a) => ({
	'--fv23-bg': a.bgColor,
	'--fv23-filter-color': a.filterColor,
	'--fv23-filter-opacity': String(a.filterOpacity ?? 0.88),
	'--fv23-max-width': `${a.maxWidth ?? 1120}px`,
	'--fv23-card-width': `${a.cardWidth ?? 340}px`,
	'--fv23-eyebrow-color': a.eyebrowColor,
	'--fv23-title-color': a.titleColor,
	'--fv23-title-weight': a.titleFontWeight,
	'--fv23-title-size-pc': `${a.titleFontSizePc ?? 40}px`,
	'--fv23-title-size-sp': `${a.titleFontSizeSp ?? 27}px`,
	'--fv23-description-color': a.descriptionColor,
	'--fv23-benefit-color': a.benefitTextColor,
	'--fv23-benefit-mark': a.benefitMarkColor,
	'--fv23-benefit-mark-bg': a.benefitMarkBgColor,
	'--fv23-cta-bg': a.ctaBgColor,
	'--fv23-cta-text': a.ctaTextColor,
	'--fv23-cta-sub': a.ctaSubColor,
	'--fv23-cta-radius': `${a.ctaBorderRadius ?? 8}px`,
	'--fv23-card-bg': a.cardBgColor,
	'--fv23-card-text': a.cardTextColor,
	'--fv23-card-border': a.cardBorderColor,
	'--fv23-card-radius': `${a.cardBorderRadius ?? 12}px`,
	'--fv23-qr-size': `${a.qrSize ?? 180}px`,
	'--fv23-note-color': a.noteColor,
});

const rootClass = (a) => [
	'lw-pr-fv-23',
	a.backgroundType === 'image' ? 'bg_image' : 'bg_color',
	a.showQrOnSp ? 'qr_on_sp' : 'qr_off_sp',
].filter(Boolean).join(' ');

const innerClass = (a) => ['fv23_inner', a.minHeightPc, a.minHeightTb, a.minHeightSp].filter(Boolean).join(' ');

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			backgroundType, bgColor, imageUrlPc, imageUrlSp, imageAlt, filterColor, filterOpacity,
			minHeightPc, minHeightTb, minHeightSp, maxWidth, cardWidth,
			showEyebrow, eyebrow, eyebrowColor,
			headingLevel, mainTitle, titleColor, titleFontWeight, titleFont, titleFontSizePc, titleFontSizeSp,
			description, descriptionColor,
			showBenefits, benefitItems = [], benefitTextColor, benefitMarkColor, benefitMarkBgColor,
			buttonText, buttonSub, buttonUrl, buttonOpenNewTab,
			ctaBgColor, ctaTextColor, ctaSubColor, ctaBorderRadius,
			cardBgColor, cardTextColor, cardBorderColor, cardBorderRadius,
			showQr, qrUrl, qrAlt, qrSize, qrCaption, showQrOnSp,
			showAccount, accountLabel, accountName,
			noteText, noteColor,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;

		const updateBenefit = (i, v) => setAttributes({ benefitItems: benefitItems.map((it, n) => (n === i ? { ...it, text: v } : it)) });
		const addBenefit = () => setAttributes({ benefitItems: [...benefitItems, { text: '登録するとできること' }] });
		const removeBenefit = (i) => setAttributes({ benefitItems: benefitItems.filter((_, n) => n !== i) });
		const moveBenefit = (i, d) => {
			const to = i + d;
			if (to < 0 || to >= benefitItems.length) return;
			const next = [...benefitItems];
			const [m] = next.splice(i, 1);
			next.splice(to, 0, m);
			setAttributes({ benefitItems: next });
		};

		const blockProps = useBlockProps({ className: rootClass(attributes), style: styleVars(attributes) });

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<SelectControl
							label="背景"
							value={backgroundType}
							options={[{ label: '色', value: 'color' }, { label: '写真', value: 'image' }]}
							onChange={(v) => setAttributes({ backgroundType: v })}
						/>
						<RangeControl label="中身の最大横幅" value={maxWidth} onChange={(v) => setAttributes({ maxWidth: v })} min={860} max={1400} step={10} />
						<RangeControl label="右のカードの横幅" value={cardWidth} onChange={(v) => setAttributes({ cardWidth: v })} min={260} max={460} step={10} />
						<SelectControl label="高さ（パソコン）" value={minHeightPc} options={minHeightPcClassOptionArr()} onChange={(v) => setAttributes({ minHeightPc: v })} />
						<SelectControl label="高さ（タブレット）" value={minHeightTb} options={minHeightTbClassOptionArr()} onChange={(v) => setAttributes({ minHeightTb: v })} />
						<SelectControl label="高さ（スマホ）" value={minHeightSp} options={minHeightSpClassOptionArr()} onChange={(v) => setAttributes({ minHeightSp: v })} />
						<SelectControl
							label="見出しの階層"
							value={headingLevel}
							options={[{ label: 'H1', value: 1 }, { label: 'H2', value: 2 }, { label: 'H3', value: 3 }]}
							onChange={(v) => setAttributes({ headingLevel: Number(v) })}
						/>
						<p style={{ margin: '12px 0 4px' }}>地の色</p>
						<ColorPalette value={bgColor} onChange={(v) => setAttributes({ bgColor: v })} />
					</PanelBody>

					{backgroundType === 'image' && (
						<PanelBody title="背景の写真" initialOpen={false}>
							<p style={{ margin: '0 0 4px' }}>パソコン用</p>
							<MediaUpload onSelect={(m) => setAttributes({ imageUrlPc: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>} />
							<TextControl label="画像のURL（パソコン）" value={imageUrlPc} onChange={(v) => setAttributes({ imageUrlPc: v })} />
							<p style={{ margin: '12px 0 4px' }}>スマホ用（空ならパソコン用）</p>
							<MediaUpload onSelect={(m) => setAttributes({ imageUrlSp: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>} />
							<TextControl label="画像のURL（スマホ）" value={imageUrlSp} onChange={(v) => setAttributes({ imageUrlSp: v })} />
							<TextControl label="画像の説明（alt）" value={imageAlt} onChange={(v) => setAttributes({ imageAlt: v })} />
							<p style={{ margin: '12px 0 4px' }}>写真に重ねる色</p>
							<ColorPalette value={filterColor} onChange={(v) => setAttributes({ filterColor: v })} />
							<RangeControl label="重ねる色の濃さ" value={filterOpacity} onChange={(v) => setAttributes({ filterOpacity: v })} min={0} max={1} step={0.01} />
						</PanelBody>
					)}

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

					<PanelBody title="登録するとできること" initialOpen={true}>
						<ToggleControl label="一覧を出す" checked={showBenefits} onChange={(v) => setAttributes({ showBenefits: v })} />
						{showBenefits && (
							<>
								<p style={{ margin: '4px 0 12px', fontSize: 12, color: '#a04a28' }}>
									🚨 登録されない理由はほとんど「何が届くか分からない」です。3つ前後で具体的に書いてください。
								</p>
								{benefitItems.map((it, i) => (
									<div key={i} style={{ borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 10 }}>
										<TextControl label={`${i + 1}つめ`} value={it.text} onChange={(v) => updateBenefit(i, v)} />
										<div style={{ display: 'flex', gap: 6 }}>
											<Button variant="secondary" onClick={() => moveBenefit(i, -1)} disabled={i === 0}>↑</Button>
											<Button variant="secondary" onClick={() => moveBenefit(i, 1)} disabled={i === benefitItems.length - 1}>↓</Button>
											<Button isDestructive onClick={() => removeBenefit(i)}>削除</Button>
										</div>
									</div>
								))}
								<Button variant="primary" onClick={addBenefit} style={{ marginTop: 12 }}>1つ追加</Button>
								<p style={{ margin: '12px 0 4px' }}>文字色</p>
								<ColorPalette value={benefitTextColor} onChange={(v) => setAttributes({ benefitTextColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>チェック印の色</p>
								<ColorPalette value={benefitMarkColor} onChange={(v) => setAttributes({ benefitMarkColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>チェック印の丸の色</p>
								<ColorPalette value={benefitMarkBgColor} onChange={(v) => setAttributes({ benefitMarkBgColor: v })} />
							</>
						)}
					</PanelBody>

					<PanelBody title="登録ボタン" initialOpen={false}>
						<TextControl label="ボタンの文字" value={buttonText} onChange={(v) => setAttributes({ buttonText: v })} />
						<TextControl label="ボタンの下の小さい文字" value={buttonSub} onChange={(v) => setAttributes({ buttonSub: v })} />
						<TextControl label="リンク先のURL" value={buttonUrl} onChange={(v) => setAttributes({ buttonUrl: v })} placeholder="登録の飛び先" />
						<LinkPicker link={lwLinkFromAttrs(attributes, LINK_KEYS)} onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))} />
						<ToggleControl label="新しいタブで開く" checked={buttonOpenNewTab} onChange={(v) => setAttributes({ buttonOpenNewTab: v })} help="外のサービスへ飛ばすときは入れたままにします。" />
						<p style={{ margin: '12px 0 4px' }}>背景色</p>
						<ColorPalette value={ctaBgColor} onChange={(v) => setAttributes({ ctaBgColor: v })} />
						<p style={{ margin: '4px 0 12px', fontSize: 12, color: '#666' }}>
							LINE公式アカウントに合わせて緑（#06C755）にするときは、文字色も一緒に見直してください。白文字のままだと薄くて読めません。
						</p>
						<p style={{ margin: '12px 0 4px' }}>文字色</p>
						<ColorPalette value={ctaTextColor} onChange={(v) => setAttributes({ ctaTextColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>小さい文字の色</p>
						<ColorPalette value={ctaSubColor} onChange={(v) => setAttributes({ ctaSubColor: v })} />
						<RangeControl label="角の丸み" value={ctaBorderRadius} onChange={(v) => setAttributes({ ctaBorderRadius: v })} min={0} max={40} step={1} />
					</PanelBody>

					<PanelBody title="QRコードのカード" initialOpen={true}>
						<ToggleControl label="QRコードを出す" checked={showQr} onChange={(v) => setAttributes({ showQr: v })} />
						{showQr && (
							<>
								<p style={{ margin: '4px 0 12px', fontSize: 12, color: '#a04a28' }}>
									🚨 ご自分のアカウントのQRコード画像を入れてください。見本は入っていません。
								</p>
								<MediaUpload onSelect={(m) => setAttributes({ qrUrl: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">QRコードの画像を選ぶ</Button>} />
								<TextControl label="QRコードの画像URL" value={qrUrl} onChange={(v) => setAttributes({ qrUrl: v })} />
								<TextControl label="QRコードの説明（alt）" value={qrAlt} onChange={(v) => setAttributes({ qrAlt: v })} />
								<RangeControl label="QRコードの大きさ" value={qrSize} onChange={(v) => setAttributes({ qrSize: v })} min={120} max={280} step={4} />
								<TextControl label="QRコードの下の一言" value={qrCaption} onChange={(v) => setAttributes({ qrCaption: v })} />
								<ToggleControl label="スマホでもQRコードを出す" checked={showQrOnSp} onChange={(v) => setAttributes({ showQrOnSp: v })} help="スマホでは自分の画面のQRを読み取れません。印刷や店頭の掲示に使うページのときだけ入れます。" />
							</>
						)}
						<ToggleControl label="アカウント名を出す" checked={showAccount} onChange={(v) => setAttributes({ showAccount: v })} />
						{showAccount && (
							<>
								<TextControl label="見出し（ID など）" value={accountLabel} onChange={(v) => setAttributes({ accountLabel: v })} />
								<TextControl label="アカウント名" value={accountName} onChange={(v) => setAttributes({ accountName: v })} />
							</>
						)}
						<p style={{ margin: '12px 0 4px' }}>カードの背景色</p>
						<ColorPalette value={cardBgColor} onChange={(v) => setAttributes({ cardBgColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>カードの文字色</p>
						<ColorPalette value={cardTextColor} onChange={(v) => setAttributes({ cardTextColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>カードの枠の色</p>
						<ColorPalette value={cardBorderColor} onChange={(v) => setAttributes({ cardBorderColor: v })} />
						<RangeControl label="カードの角の丸み" value={cardBorderRadius} onChange={(v) => setAttributes({ cardBorderRadius: v })} min={0} max={30} step={1} />
					</PanelBody>

					<PanelBody title="ボタンの下の1行" initialOpen={false}>
						<TextControl label="文章" value={noteText} onChange={(v) => setAttributes({ noteText: v })} help="「やめ方」を書くと登録が増えます。消さないでください。" />
						<p style={{ margin: '12px 0 4px' }}>文字色</p>
						<ColorPalette value={noteColor} onChange={(v) => setAttributes({ noteColor: v })} />
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{backgroundType === 'image' && (
						<div className="bg_filter">
							<div className="bg_filter_inner"></div>
							{imageUrlPc && <img src={imageUrlPc} alt={imageAlt} />}
						</div>
					)}
					<div className={innerClass(attributes)}>
						<div className="lead_side">
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
							{showBenefits && benefitItems.length > 0 && (
								<ul className="benefit_list">
									{benefitItems.map((it, i) => (
										<li key={i}><i>✓</i><span>{it.text}</span></li>
									))}
								</ul>
							)}
							{buttonText && (
								<span className="cta_btn">
									{buttonText}
									{buttonSub && <small>{buttonSub}</small>}
								</span>
							)}
							{noteText && <p className="note">{noteText}</p>}
						</div>
						<div className="join_card">
							{showQr && (
								qrUrl
									? <span className="qr_box"><img src={qrUrl} alt={qrAlt} /></span>
									: <span className="qr_box is_empty">QRコードの画像を入れてください</span>
							)}
							{showQr && qrCaption && <p className="qr_caption">{qrCaption}</p>}
							{showAccount && (accountLabel || accountName) && (
								<p className="account">
									{accountLabel && <b>{accountLabel}</b>}
									{accountName && <span>{accountName}</span>}
								</p>
							)}
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			backgroundType, imageUrlPc, imageUrlSp, imageAlt,
			showEyebrow, eyebrow, headingLevel, mainTitle, titleFont, description,
			showBenefits, benefitItems = [],
			buttonText, buttonSub, buttonUrl, buttonOpenNewTab,
			showQr, qrUrl, qrAlt, qrSize, qrCaption,
			showAccount, accountLabel, accountName, noteText,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;
		const linkData = lwLinkDataPropsFromAttrs(attributes, LINK_KEYS);
		const qrPx = qrSize ?? 180;
		const blockProps = useBlockProps.save({ className: rootClass(attributes), style: styleVars(attributes) });

		return (
			<div {...blockProps}>
				{backgroundType === 'image' && (
					<div className="bg_filter">
						<div className="bg_filter_inner"></div>
						{imageUrlPc && (
							<picture>
								<source srcSet={imageUrlSp || imageUrlPc} media="(max-width: 800px)" />
								<source srcSet={imageUrlPc} media="(min-width: 801px)" />
								<img src={imageUrlPc} alt={imageAlt} />
							</picture>
						)}
					</div>
				)}
				<div className={innerClass(attributes)}>
					<div className="lead_side">
						{showEyebrow && eyebrow && <p className="eyebrow">{eyebrow}</p>}
						<RichText.Content tagName={HeadingTag} className="main_ttl" data-lw_font_set={titleFont} value={mainTitle} />
						{description && <RichText.Content tagName="p" className="description" value={description} />}
						{showBenefits && benefitItems.length > 0 && (
							<ul className="benefit_list">
								{benefitItems.map((it, i) => (
									<li key={i}><i>✓</i><span>{it.text}</span></li>
								))}
							</ul>
						)}
						{buttonText && (
							<a
								className="cta_btn"
								href={buttonUrl}
								target={buttonOpenNewTab ? '_blank' : undefined}
								rel={lwRel({ newTab: buttonOpenNewTab })}
								data-lw-link-type={linkData.linkType}
								data-lw-link-id={linkData.linkId}
							>
								{buttonText}
								{buttonSub && <small>{buttonSub}</small>}
							</a>
						)}
						{noteText && <p className="note">{noteText}</p>}
					</div>
					<div className="join_card">
						{showQr && qrUrl && (
							<span className="qr_box">
								<img src={qrUrl} alt={qrAlt} width={qrPx} height={qrPx} />
							</span>
						)}
						{showQr && qrUrl && qrCaption && <p className="qr_caption">{qrCaption}</p>}
						{showAccount && (accountLabel || accountName) && (
							<p className="account">
								{accountLabel && <b>{accountLabel}</b>}
								{accountName && <span>{accountName}</span>}
							</p>
						)}
					</div>
				</div>
			</div>
		);
	},
};

registerBlockType(metadata.name, lwBlockDef);
