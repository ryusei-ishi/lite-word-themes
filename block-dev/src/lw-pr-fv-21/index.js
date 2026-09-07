/**
 * FV 21 リード獲得（もらえる物と締切）
 * ------------------------------------------------------------------
 * 「何がもらえるのか」を写真と番号付きのリストで見せ、
 * 締切や残り枠の札を写真の角に添えるFV。
 *
 * 資料請求・サンプル・応募のページは、言葉で説明するより
 * 現物を見せたほうが早い。写真は少し傾けて影を落とし、
 * 「手に取れる物」として見えるようにしてある。
 *
 * 🚨 締切の札は本当に締切があるときだけ出す（showTag）。
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
	'--fv21-bg': a.bgColor,
	'--fv21-max-width': `${a.maxWidth ?? 1140}px`,
	'--fv21-pic-width': `${a.imageColWidth ?? 430}px`,
	'--fv21-pic-tilt': `${a.imageTilt ?? -2.4}deg`,
	'--fv21-pic-height-pc': `${a.imageHeightPc ?? 330}px`,
	'--fv21-pic-height-sp': `${a.imageHeightSp ?? 220}px`,
	'--fv21-free-bg': a.freeBgColor,
	'--fv21-free-text': a.freeTextColor,
	'--fv21-title-color': a.titleColor,
	'--fv21-title-weight': a.titleFontWeight,
	'--fv21-title-size-pc': `${a.titleFontSizePc ?? 45}px`,
	'--fv21-title-size-sp': `${a.titleFontSizeSp ?? 30}px`,
	'--fv21-description-color': a.descriptionColor,
	'--fv21-inbox-bg': a.inboxBgColor,
	'--fv21-inbox-border': a.inboxBorderColor,
	'--fv21-inbox-title': a.inboxTitleColor,
	'--fv21-inbox-text': a.inboxTextColor,
	'--fv21-inbox-num-bg': a.inboxNumBgColor,
	'--fv21-inbox-num': a.inboxNumColor,
	'--fv21-cta-bg': a.ctaBgColor,
	'--fv21-cta-text': a.ctaTextColor,
	'--fv21-cta-sub': a.ctaSubColor,
	'--fv21-cta-radius': `${a.ctaBorderRadius ?? 7}px`,
	'--fv21-cta-max': `${a.buttonMaxWidth ?? 400}px`,
	'--fv21-tag-bg': a.tagBgColor,
	'--fv21-tag-text': a.tagTextColor,
});

const rootClass = (a) => [
	'lw-pr-fv-21',
	a.minHeightPc, a.minHeightTb, a.minHeightSp,
	a.imageSide === 'left' ? 'image_left' : 'image_right',
].filter(Boolean).join(' ');

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			bgColor, minHeightPc, minHeightTb, minHeightSp, maxWidth,
			imageSide, imageColWidth, imageUrl, imageAlt, imageTilt, imageHeightPc, imageHeightSp,
			showFree, freeLabel, freeText, freeBgColor, freeTextColor,
			headingLevel, mainTitle, titleColor, titleFontWeight, titleFont, titleFontSizePc, titleFontSizeSp,
			description, descriptionColor,
			showInbox, inboxTitle, inboxItems = [], inboxBgColor, inboxBorderColor, inboxTitleColor, inboxTextColor, inboxNumBgColor, inboxNumColor,
			buttonText, buttonSub, buttonUrl, buttonMaxWidth, ctaBgColor, ctaTextColor, ctaSubColor, ctaBorderRadius,
			showTag, tagTop, tagMain, tagUnit, tagBottom, tagBgColor, tagTextColor,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;

		const updateInbox = (i, v) => setAttributes({ inboxItems: inboxItems.map((it, n) => (n === i ? { ...it, text: v } : it)) });
		const addInbox = () => setAttributes({ inboxItems: [...inboxItems, { text: '新しい中身' }] });
		const removeInbox = (i) => setAttributes({ inboxItems: inboxItems.filter((_, n) => n !== i) });
		const moveInbox = (i, d) => {
			const to = i + d;
			if (to < 0 || to >= inboxItems.length) return;
			const next = [...inboxItems];
			const [m] = next.splice(i, 1);
			next.splice(to, 0, m);
			setAttributes({ inboxItems: next });
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
						<RangeControl label="全体の最大横幅" value={maxWidth} onChange={(v) => setAttributes({ maxWidth: v })} min={900} max={1400} step={20} />
						<RangeControl label="写真側の幅" value={imageColWidth} onChange={(v) => setAttributes({ imageColWidth: v })} min={300} max={560} step={10} />
						<SelectControl label="高さ（パソコン）" value={minHeightPc} options={minHeightPcClassOptionArr()} onChange={(v) => setAttributes({ minHeightPc: v })} />
						<SelectControl label="高さ（タブレット）" value={minHeightTb} options={minHeightTbClassOptionArr()} onChange={(v) => setAttributes({ minHeightTb: v })} />
						<SelectControl label="高さ（スマホ）" value={minHeightSp} options={minHeightSpClassOptionArr()} onChange={(v) => setAttributes({ minHeightSp: v })} />
						<SelectControl
							label="見出しの階層"
							value={headingLevel}
							options={[{ label: 'H1', value: 1 }, { label: 'H2', value: 2 }, { label: 'H3', value: 3 }]}
							onChange={(v) => setAttributes({ headingLevel: Number(v) })}
						/>
						<p style={{ margin: '12px 0 4px' }}>背景の色</p>
						<ColorPalette value={bgColor} onChange={(v) => setAttributes({ bgColor: v })} />
					</PanelBody>

					<PanelBody title="写真" initialOpen={false}>
						<MediaUpload onSelect={(m) => setAttributes({ imageUrl: m.url })} allowedTypes={['image']} render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>} />
						<TextControl label="画像のURL" value={imageUrl} onChange={(v) => setAttributes({ imageUrl: v })} />
						<TextControl label="画像の説明（alt）" value={imageAlt} onChange={(v) => setAttributes({ imageAlt: v })} />
						<RangeControl label="傾き（度）" value={imageTilt} onChange={(v) => setAttributes({ imageTilt: v })} min={-6} max={6} step={0.2} help="0 にすると傾きません。" />
						<RangeControl label="高さ（パソコン）" value={imageHeightPc} onChange={(v) => setAttributes({ imageHeightPc: v })} min={200} max={520} step={10} />
						<RangeControl label="高さ（スマホ）" value={imageHeightSp} onChange={(v) => setAttributes({ imageHeightSp: v })} min={140} max={360} step={10} />
					</PanelBody>

					<PanelBody title="オファーの札（無料など）" initialOpen={false}>
						<ToggleControl label="札を出す" checked={showFree} onChange={(v) => setAttributes({ showFree: v })} />
						{showFree && (
							<>
								<TextControl label="大きく出す言葉" value={freeLabel} onChange={(v) => setAttributes({ freeLabel: v })} />
								<TextControl label="添える一文" value={freeText} onChange={(v) => setAttributes({ freeText: v })} />
								<p style={{ margin: '12px 0 4px' }}>札の背景色</p>
								<ColorPalette value={freeBgColor} onChange={(v) => setAttributes({ freeBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>札の文字色</p>
								<ColorPalette value={freeTextColor} onChange={(v) => setAttributes({ freeTextColor: v })} />
							</>
						)}
					</PanelBody>

					<PanelBody title="見出し・説明文" initialOpen={false}>
						<RangeControl label="見出しの大きさ（パソコン）" value={titleFontSizePc} onChange={(v) => setAttributes({ titleFontSizePc: v })} min={24} max={60} step={1} />
						<RangeControl label="見出しの大きさ（スマホ）" value={titleFontSizeSp} onChange={(v) => setAttributes({ titleFontSizeSp: v })} min={18} max={40} step={1} />
						<SelectControl label="見出しの太さ" value={titleFontWeight} options={fontWeightOptionsArr()} onChange={(v) => setAttributes({ titleFontWeight: v })} />
						<SelectControl label="見出しの書体" value={titleFont} options={fontOptionsArr()} onChange={(v) => setAttributes({ titleFont: v })} />
						<p style={{ margin: '12px 0 4px' }}>見出しの色</p>
						<ColorPalette value={titleColor} onChange={(v) => setAttributes({ titleColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>説明文の色</p>
						<ColorPalette value={descriptionColor} onChange={(v) => setAttributes({ descriptionColor: v })} />
					</PanelBody>

					<PanelBody title="もらえる物の中身" initialOpen={true}>
						<ToggleControl label="中身の箱を出す" checked={showInbox} onChange={(v) => setAttributes({ showInbox: v })} />
						{showInbox && (
							<>
								<TextControl label="箱の見出し" value={inboxTitle} onChange={(v) => setAttributes({ inboxTitle: v })} />
								{inboxItems.map((it, i) => (
									<div key={i} style={{ borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 10 }}>
										<TextControl label={`${i + 1}つめ`} value={it.text} onChange={(v) => updateInbox(i, v)} />
										<div style={{ display: 'flex', gap: 6 }}>
											<Button variant="secondary" onClick={() => moveInbox(i, -1)} disabled={i === 0}>↑</Button>
											<Button variant="secondary" onClick={() => moveInbox(i, 1)} disabled={i === inboxItems.length - 1}>↓</Button>
											<Button isDestructive onClick={() => removeInbox(i)}>削除</Button>
										</div>
									</div>
								))}
								<Button variant="primary" onClick={addInbox} style={{ marginTop: 12 }}>中身を追加</Button>
								<p style={{ margin: '16px 0 4px' }}>箱の背景色</p>
								<ColorPalette value={inboxBgColor} onChange={(v) => setAttributes({ inboxBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>箱の枠の色</p>
								<ColorPalette value={inboxBorderColor} onChange={(v) => setAttributes({ inboxBorderColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>箱の見出しの色</p>
								<ColorPalette value={inboxTitleColor} onChange={(v) => setAttributes({ inboxTitleColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>中身の文字色</p>
								<ColorPalette value={inboxTextColor} onChange={(v) => setAttributes({ inboxTextColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>番号の丸の色</p>
								<ColorPalette value={inboxNumBgColor} onChange={(v) => setAttributes({ inboxNumBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>番号の文字色</p>
								<ColorPalette value={inboxNumColor} onChange={(v) => setAttributes({ inboxNumColor: v })} />
							</>
						)}
					</PanelBody>

					<PanelBody title="ボタン" initialOpen={false}>
						<TextControl label="ボタンの文字" value={buttonText} onChange={(v) => setAttributes({ buttonText: v })} />
						<TextControl label="ボタンの下の小さい文字" value={buttonSub} onChange={(v) => setAttributes({ buttonSub: v })} />
						<TextControl label="リンク先のURL" value={buttonUrl} onChange={(v) => setAttributes({ buttonUrl: v })} placeholder="#form など" />
						<LinkPicker link={lwLinkFromAttrs(attributes, LINK_KEYS)} onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))} />
						<RangeControl label="ボタンの最大幅" value={buttonMaxWidth} onChange={(v) => setAttributes({ buttonMaxWidth: v })} min={240} max={620} step={10} />
						<p style={{ margin: '12px 0 4px' }}>背景色</p>
						<ColorPalette value={ctaBgColor} onChange={(v) => setAttributes({ ctaBgColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>文字色</p>
						<ColorPalette value={ctaTextColor} onChange={(v) => setAttributes({ ctaTextColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>小さい文字の色</p>
						<ColorPalette value={ctaSubColor} onChange={(v) => setAttributes({ ctaSubColor: v })} />
						<RangeControl label="角の丸み" value={ctaBorderRadius} onChange={(v) => setAttributes({ ctaBorderRadius: v })} min={0} max={40} step={1} />
					</PanelBody>

					<PanelBody title="締切の札" initialOpen={false}>
						<ToggleControl label="締切の札を出す" checked={showTag} onChange={(v) => setAttributes({ showTag: v })} />
						{showTag && (
							<>
								<p style={{ margin: '4px 0 12px', fontSize: 12, color: '#a04a28' }}>
									🚨 本当に締切があるときだけ出してください。ずっと「残り3日」のままにしない。
								</p>
								<TextControl label="上の言葉" value={tagTop} onChange={(v) => setAttributes({ tagTop: v })} />
								<TextControl label="真ん中の数字" value={tagMain} onChange={(v) => setAttributes({ tagMain: v })} />
								<TextControl label="単位" value={tagUnit} onChange={(v) => setAttributes({ tagUnit: v })} help="日・名 など" />
								<TextControl label="下の言葉" value={tagBottom} onChange={(v) => setAttributes({ tagBottom: v })} />
								<p style={{ margin: '12px 0 4px' }}>札の背景色</p>
								<ColorPalette value={tagBgColor} onChange={(v) => setAttributes({ tagBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>札の文字色</p>
								<ColorPalette value={tagTextColor} onChange={(v) => setAttributes({ tagTextColor: v })} />
							</>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="this_wrap">
						<div className="lead_side">
							{showFree && (freeLabel || freeText) && (
								<span className="free_badge">
									{freeLabel && <b>{freeLabel}</b>}
									{freeText && <span>{freeText}</span>}
								</span>
							)}
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
							{showInbox && inboxItems.length > 0 && (
								<div className="inbox">
									{inboxTitle && <p className="inbox_ttl">{inboxTitle}</p>}
									<ul>
										{inboxItems.map((it, i) => (
											<li key={i}><i>{i + 1}</i><span>{it.text}</span></li>
										))}
									</ul>
								</div>
							)}
							{buttonText && (
								<span className="cta_btn">
									{buttonText}
									{buttonSub && <small>{buttonSub}</small>}
								</span>
							)}
						</div>
						<div className="pic_side">
							<div className="shot">
								{imageUrl && <img src={imageUrl} alt={imageAlt} />}
							</div>
							{showTag && tagMain && (
								<span className="dl_tag">
									{tagTop && <span className="t">{tagTop}</span>}
									<span className="d">{tagMain}{tagUnit && <span className="u">{tagUnit}</span>}</span>
									{tagBottom && <span className="t">{tagBottom}</span>}
								</span>
							)}
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			imageUrl, imageAlt,
			showFree, freeLabel, freeText,
			headingLevel, mainTitle, titleFont, description,
			showInbox, inboxTitle, inboxItems = [],
			buttonText, buttonSub, buttonUrl,
			showTag, tagTop, tagMain, tagUnit, tagBottom,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;
		const linkData = lwLinkDataPropsFromAttrs(attributes, LINK_KEYS);
		const blockProps = useBlockProps.save({ className: rootClass(attributes), style: styleVars(attributes) });

		return (
			<div {...blockProps}>
				<div className="this_wrap">
					<div className="lead_side">
						{showFree && (freeLabel || freeText) && (
							<span className="free_badge">
								{freeLabel && <b>{freeLabel}</b>}
								{freeText && <span>{freeText}</span>}
							</span>
						)}
						<RichText.Content tagName={HeadingTag} className="main_ttl" data-lw_font_set={titleFont} value={mainTitle} />
						{description && <RichText.Content tagName="p" className="description" value={description} />}
						{showInbox && inboxItems.length > 0 && (
							<div className="inbox">
								{inboxTitle && <p className="inbox_ttl">{inboxTitle}</p>}
								<ul>
									{inboxItems.map((it, i) => (
										<li key={i}><i>{i + 1}</i><span>{it.text}</span></li>
									))}
								</ul>
							</div>
						)}
						{buttonText && (
							<a className="cta_btn" href={buttonUrl} data-lw-link-type={linkData.linkType} data-lw-link-id={linkData.linkId}>
								{buttonText}
								{buttonSub && <small>{buttonSub}</small>}
							</a>
						)}
					</div>
					<div className="pic_side">
						<div className="shot">
							{imageUrl && <img src={imageUrl} alt={imageAlt} />}
						</div>
						{showTag && tagMain && (
							<span className="dl_tag">
								{tagTop && <span className="t">{tagTop}</span>}
								<span className="d">{tagMain}{tagUnit && <span className="u">{tagUnit}</span>}</span>
								{tagBottom && <span className="t">{tagBottom}</span>}
							</span>
						)}
					</div>
				</div>
			</div>
		);
	},
};

registerBlockType(metadata.name, lwBlockDef);
