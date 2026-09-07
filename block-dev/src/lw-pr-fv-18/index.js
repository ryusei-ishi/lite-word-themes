/**
 * FV 18 リード獲得（フォーム一体型）
 * ------------------------------------------------------------------
 * 左に「何がもらえるか」、右に「そのまま送れるフォーム」を置くFV。
 * これまでのFVは見出しを置く器しか無く、リード獲得ページでは
 * FVの下にCTAの帯を継ぎ足して補っていた（＝つぎはぎに見える原因）。
 * このブロックは FVの中で送信まで終わるので、その継ぎ足しが要らない。
 *
 * 🚨 formId（管理画面のフォームセット番号）を入れるとフォームが出る。
 *    空なら代わりに CTAボタン が出る。両方は出ない。
 * 🚨 送信ボタンと必須バッジは、テーマのフォームCSSがサイト色で塗ってしまうので、
 *    このブロックの中だけ CSS変数で上書きしている（submitBgColor / requiredBgColor）。
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, TextControl, TextareaControl, ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

/* リンク先の指定（共通部品）で使う属性名の対応 */
const LINK_KEYS = { url: 'buttonUrl', type: 'buttonLinkType', page: 'buttonPageId', category: 'buttonCategoryId' };

/* 見た目に関わる値をまとめて CSS 変数にする（edit と save で必ず同じものを使う） */
/* 🚨 CSS変数の値は必ず「文字列」で渡す。数値のまま渡すと WordPress 6.8 以下の書き出しが
   カスタムプロパティにも px を足し（--fv20-stats-cols:4px / --fv18-filter-opacity:0.86px）、
   その宣言ごと無効になる。→ repeat(4px,1fr) が none に落ちて数字の帯が1列に潰れる／
   opacity が初期値 1 に戻って写真が幕で塗り潰される。var() のフォールバックは効かない
   （変数は「定義されている」ため）。WordPress 6.9 以降は除外されるので手元では再現しない。
   🚨 `?? 既定値` も外さない。RangeControl は数値欄を空にすると undefined を渡すので、
   ガードが無いと `undefinedpx` が保存され、grid が none に落ちて PC でも1カラムに潰れる。
   （2026-09-07 の複数AIレビューで検出。手元の WordPress 11本で挙動を実測した） */
const styleVars = (a) => ({
	'--fv18-max-width': `${a.maxWidth ?? 1180}px`,
	'--fv18-form-width': `${a.formWidth ?? 396}px`,
	'--fv18-bg': a.bgColor,
	'--fv18-filter-color': a.filterColor,
	'--fv18-filter-opacity': String(a.filterOpacity ?? 0.86),
	'--fv18-badge-bg': a.badgeBgColor,
	'--fv18-badge-text': a.badgeTextColor,
	'--fv18-title-color': a.titleColor,
	'--fv18-title-weight': a.titleFontWeight,
	'--fv18-title-size-pc': `${a.titleFontSizePc ?? 46}px`,
	'--fv18-title-size-sp': `${a.titleFontSizeSp ?? 30}px`,
	'--fv18-description-color': a.descriptionColor,
	'--fv18-tick-color': a.tickTextColor,
	'--fv18-tick-mark-bg': a.tickMarkBgColor,
	'--fv18-tick-mark-color': a.tickMarkColor,
	'--fv18-card-bg': a.cardBgColor,
	'--fv18-card-title-color': a.cardTitleColor,
	'--fv18-card-sub-color': a.cardSubColor,
	'--fv18-card-note-color': a.cardNoteColor,
	'--fv18-submit-bg': a.submitBgColor,
	'--fv18-submit-text': a.submitTextColor,
	'--fv18-required-bg': a.requiredBgColor,
	'--fv18-cta-bg': a.ctaBgColor,
	'--fv18-cta-text': a.ctaTextColor,
	'--fv18-cta-radius': `${a.ctaBorderRadius ?? 6}px`,
});

const rootClass = (a) => [
	'lw-pr-fv-18',
	a.minHeightPc, a.minHeightTb, a.minHeightSp,
	a.formSide === 'left' ? 'form_left' : 'form_right',
].filter(Boolean).join(' ');

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			backgroundType, imageUrlPc, imageUrlSp, imageAlt, bgColor, filterColor, filterOpacity,
			minHeightPc, minHeightTb, minHeightSp, maxWidth, formSide, formWidth,
			showBadge, badgeLabel, badgeText, badgeBgColor, badgeTextColor,
			headingLevel, mainTitle, titleColor, titleFontWeight, titleFont, titleFontSizePc, titleFontSizeSp,
			description, descriptionColor,
			showTicks, tickItems = [], tickTextColor, tickMarkBgColor, tickMarkColor,
			cardBgColor, cardTitle, cardTitleColor, cardSubText, cardSubColor,
			formId, submitBgColor, submitTextColor, requiredBgColor,
			cardNote, cardNoteColor,
			buttonText, buttonSub, buttonUrl, ctaBgColor, ctaTextColor, ctaBorderRadius,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;
		/* 🚨 フォームセット番号は「数字だけ」に落としてから使う。
		   ① テーマ側 functions/mail_form/form_put.php は、この値を <form id="…"> と
		      <label for="lw_consent_…"> にそのまま入れる。絞るのはここの責任。
		   ② ' や ] が混じるとショートコードが途中で割れて、FVの真ん中に "] という文字が残る。
		   （2026-09-07 の複数AIレビューで検出） */
		const formNo = String(formId ?? '').replace(/[^0-9]/g, '');
		const hasForm = formNo !== '';

		const updateTick = (index, value) =>
			setAttributes({ tickItems: tickItems.map((it, i) => (i === index ? { ...it, text: value } : it)) });
		const addTick = () => setAttributes({ tickItems: [...tickItems, { text: '新しい約束' }] });
		const removeTick = (index) => setAttributes({ tickItems: tickItems.filter((_, i) => i !== index) });
		const moveTick = (index, dir) => {
			const to = index + dir;
			if (to < 0 || to >= tickItems.length) return;
			const next = [...tickItems];
			const [m] = next.splice(index, 1);
			next.splice(to, 0, m);
			setAttributes({ tickItems: next });
		};

		const blockProps = useBlockProps({ className: rootClass(attributes), style: styleVars(attributes) });

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定" initialOpen={true}>
						<SelectControl
							label="フォームを置く側"
							value={formSide}
							options={[
								{ label: '右（おすすめ）', value: 'right' },
								{ label: '左', value: 'left' },
							]}
							onChange={(v) => setAttributes({ formSide: v })}
						/>
						<RangeControl label="全体の最大横幅" value={maxWidth} onChange={(v) => setAttributes({ maxWidth: v })} min={900} max={1400} step={20} />
						<RangeControl label="フォーム側の幅" value={formWidth} onChange={(v) => setAttributes({ formWidth: v })} min={320} max={520} step={4} />
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
								<MediaUpload
									onSelect={(m) => setAttributes({ imageUrlPc: m.url })}
									allowedTypes={['image']}
									render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>}
								/>
								<TextControl label="画像のURL（パソコン）" value={imageUrlPc} onChange={(v) => setAttributes({ imageUrlPc: v })} />
								<p style={{ margin: '12px 0 4px' }}>スマホ用の背景画像（空ならパソコン用を使う）</p>
								<MediaUpload
									onSelect={(m) => setAttributes({ imageUrlSp: m.url })}
									allowedTypes={['image']}
									render={({ open }) => <Button onClick={open} variant="secondary">画像を選ぶ</Button>}
								/>
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

					<PanelBody title="オファーの札（無料など）" initialOpen={false}>
						<ToggleControl label="札を出す" checked={showBadge} onChange={(v) => setAttributes({ showBadge: v })} />
						{showBadge && (
							<>
								<TextControl label="大きく出す言葉" value={badgeLabel} onChange={(v) => setAttributes({ badgeLabel: v })} help="「無料」「先着50名」など2〜4文字" />
								<TextControl label="添える一文" value={badgeText} onChange={(v) => setAttributes({ badgeText: v })} />
								<p style={{ margin: '12px 0 4px' }}>札の背景色</p>
								<ColorPalette value={badgeBgColor} onChange={(v) => setAttributes({ badgeBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>札の文字色</p>
								<ColorPalette value={badgeTextColor} onChange={(v) => setAttributes({ badgeTextColor: v })} />
							</>
						)}
					</PanelBody>

					<PanelBody title="見出し・説明文" initialOpen={false}>
						<RangeControl label="見出しの大きさ（パソコン）" value={titleFontSizePc} onChange={(v) => setAttributes({ titleFontSizePc: v })} min={24} max={64} step={1} />
						<RangeControl label="見出しの大きさ（スマホ）" value={titleFontSizeSp} onChange={(v) => setAttributes({ titleFontSizeSp: v })} min={18} max={40} step={1} />
						<SelectControl label="見出しの太さ" value={titleFontWeight} options={fontWeightOptionsArr()} onChange={(v) => setAttributes({ titleFontWeight: v })} />
						<SelectControl label="見出しの書体" value={titleFont} options={fontOptionsArr()} onChange={(v) => setAttributes({ titleFont: v })} />
						<p style={{ margin: '12px 0 4px' }}>見出しの色</p>
						<ColorPalette value={titleColor} onChange={(v) => setAttributes({ titleColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>説明文の色</p>
						<ColorPalette value={descriptionColor} onChange={(v) => setAttributes({ descriptionColor: v })} />
					</PanelBody>

					<PanelBody title="約束の並び（チェック印）" initialOpen={false}>
						<ToggleControl label="約束を並べる" checked={showTicks} onChange={(v) => setAttributes({ showTicks: v })} />
						{showTicks && (
							<>
								{tickItems.map((it, i) => (
									<div key={i} style={{ borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 10 }}>
										<TextControl label={`${i + 1}つめ`} value={it.text} onChange={(v) => updateTick(i, v)} />
										<div style={{ display: 'flex', gap: 6 }}>
											<Button variant="secondary" onClick={() => moveTick(i, -1)} disabled={i === 0}>↑</Button>
											<Button variant="secondary" onClick={() => moveTick(i, 1)} disabled={i === tickItems.length - 1}>↓</Button>
											<Button isDestructive onClick={() => removeTick(i)}>削除</Button>
										</div>
									</div>
								))}
								<Button variant="primary" onClick={addTick} style={{ marginTop: 12 }}>約束を追加</Button>
								<p style={{ margin: '16px 0 4px' }}>文字の色</p>
								<ColorPalette value={tickTextColor} onChange={(v) => setAttributes({ tickTextColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>チェック印の背景色</p>
								<ColorPalette value={tickMarkBgColor} onChange={(v) => setAttributes({ tickMarkBgColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>チェック印の色</p>
								<ColorPalette value={tickMarkColor} onChange={(v) => setAttributes({ tickMarkColor: v })} />
							</>
						)}
					</PanelBody>

					<PanelBody title="フォームの箱" initialOpen={true}>
						<TextControl
							label="フォームセットの番号"
							value={formId}
							onChange={(v) => setAttributes({ formId: v })}
							help="管理画面「メールフォーム」の一覧に出ている番号。空にするとフォームの代わりにボタンが出ます。"
						/>
						<TextControl label="箱の見出し" value={cardTitle} onChange={(v) => setAttributes({ cardTitle: v })} />
						<TextControl label="見出しの下の一行" value={cardSubText} onChange={(v) => setAttributes({ cardSubText: v })} help="「入力は30秒ほど」など、かかる時間を書くと押されやすくなります。" />
						<TextareaControl label="箱のいちばん下の注記" value={cardNote} onChange={(v) => setAttributes({ cardNote: v })} />
						<p style={{ margin: '12px 0 4px' }}>箱の背景色</p>
						<ColorPalette value={cardBgColor} onChange={(v) => setAttributes({ cardBgColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>箱の見出しの色</p>
						<ColorPalette value={cardTitleColor} onChange={(v) => setAttributes({ cardTitleColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>見出しの下の一行の色</p>
						<ColorPalette value={cardSubColor} onChange={(v) => setAttributes({ cardSubColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>注記の色</p>
						<ColorPalette value={cardNoteColor} onChange={(v) => setAttributes({ cardNoteColor: v })} />
					</PanelBody>

					{hasForm && (
						<PanelBody title="フォームの中の色" initialOpen={false}>
							<p style={{ margin: '0 0 4px' }}>送信ボタンの背景色</p>
							<ColorPalette value={submitBgColor} onChange={(v) => setAttributes({ submitBgColor: v })} />
							<p style={{ margin: '12px 0 4px' }}>送信ボタンの文字色</p>
							<ColorPalette value={submitTextColor} onChange={(v) => setAttributes({ submitTextColor: v })} />
							<p style={{ margin: '12px 0 4px' }}>「必須」の札の色</p>
							<ColorPalette value={requiredBgColor} onChange={(v) => setAttributes({ requiredBgColor: v })} />
							<p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
								ふだんフォームはサイトの主色で塗られますが、このブロックの中だけここで決められます。
							</p>
						</PanelBody>
					)}

					{!hasForm && (
						<PanelBody title="ボタン（フォームを使わないとき）" initialOpen={true}>
							<TextControl label="ボタンの文字" value={buttonText} onChange={(v) => setAttributes({ buttonText: v })} />
							<TextControl label="ボタンの下の小さい文字" value={buttonSub} onChange={(v) => setAttributes({ buttonSub: v })} />
							<TextControl label="リンク先のURL" value={buttonUrl} onChange={(v) => setAttributes({ buttonUrl: v })} placeholder="#form など" />
							<LinkPicker link={lwLinkFromAttrs(attributes, LINK_KEYS)} onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))} />
							<p style={{ margin: '12px 0 4px' }}>ボタンの背景色</p>
							<ColorPalette value={ctaBgColor} onChange={(v) => setAttributes({ ctaBgColor: v })} />
							<p style={{ margin: '12px 0 4px' }}>ボタンの文字色</p>
							<ColorPalette value={ctaTextColor} onChange={(v) => setAttributes({ ctaTextColor: v })} />
							<RangeControl label="角の丸み" value={ctaBorderRadius} onChange={(v) => setAttributes({ ctaBorderRadius: v })} min={0} max={40} step={1} />
						</PanelBody>
					)}
				</InspectorControls>

				<div {...blockProps}>
					<div className="bg_filter">
						<div className="bg_filter_inner"></div>
						{backgroundType === 'image' && imageUrlPc && (
							<img src={imageUrlPc} alt={imageAlt} />
						)}
					</div>
					<div className="this_wrap">
						<div className="lead_side">
							{showBadge && (badgeLabel || badgeText) && (
								<span className="offer_badge">
									{badgeLabel && <b>{badgeLabel}</b>}
									{badgeText && <span>{badgeText}</span>}
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
							{showTicks && tickItems.length > 0 && (
								<ul className="tick_list">
									{tickItems.map((it, i) => (
										<li key={i}><i>✓</i><span>{it.text}</span></li>
									))}
								</ul>
							)}
						</div>
						<div className="form_side">
							<div className="form_card">
								{cardTitle && <p className="card_ttl">{cardTitle}</p>}
								{cardSubText && <p className="card_sub">{cardSubText}</p>}
								{hasForm ? (
									<p className="form_placeholder">フォームセット {formNo} 番がここに入ります<br /><small>（表示は公開ページで確認してください）</small></p>
								) : (
									<span className="cta_btn">
										{buttonText}
										{buttonSub && <small>{buttonSub}</small>}
									</span>
								)}
								{cardNote && <p className="card_note">{cardNote}</p>}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			backgroundType, imageUrlPc, imageUrlSp, imageAlt,
			showBadge, badgeLabel, badgeText,
			headingLevel, mainTitle, titleFont, description,
			showTicks, tickItems = [],
			cardTitle, cardSubText, formId, cardNote,
			buttonText, buttonSub, buttonUrl,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;
		/* 🚨 フォームセット番号は「数字だけ」に落としてから使う。
		   ① テーマ側 functions/mail_form/form_put.php は、この値を <form id="…"> と
		      <label for="lw_consent_…"> にそのまま入れる。絞るのはここの責任。
		   ② ' や ] が混じるとショートコードが途中で割れて、FVの真ん中に "] という文字が残る。
		   （2026-09-07 の複数AIレビューで検出） */
		const formNo = String(formId ?? '').replace(/[^0-9]/g, '');
		const hasForm = formNo !== '';
		const linkData = lwLinkDataPropsFromAttrs(attributes, LINK_KEYS);

		const blockProps = useBlockProps.save({ className: rootClass(attributes), style: styleVars(attributes) });

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
					<div className="lead_side">
						{showBadge && (badgeLabel || badgeText) && (
							<span className="offer_badge">
								{badgeLabel && <b>{badgeLabel}</b>}
								{badgeText && <span>{badgeText}</span>}
							</span>
						)}
						<RichText.Content tagName={HeadingTag} className="main_ttl" data-lw_font_set={titleFont} value={mainTitle} />
						{description && <RichText.Content tagName="p" className="description" value={description} />}
						{showTicks && tickItems.length > 0 && (
							<ul className="tick_list">
								{tickItems.map((it, i) => (
									<li key={i}><i>✓</i><span>{it.text}</span></li>
								))}
							</ul>
						)}
					</div>
					<div className="form_side">
						<div className="form_card">
							{cardTitle && <p className="card_ttl">{cardTitle}</p>}
							{cardSubText && <p className="card_sub">{cardSubText}</p>}
							{hasForm
								? `[lw_mail_form_select id='${formNo}']`
								: (buttonText && (
									<a className="cta_btn" href={buttonUrl} data-lw-link-type={linkData.linkType} data-lw-link-id={linkData.linkId}>
										{buttonText}
										{buttonSub && <small>{buttonSub}</small>}
									</a>
								))}
							{cardNote && <p className="card_note">{cardNote}</p>}
						</div>
					</div>
				</div>
			</div>
		);
	},
};

registerBlockType(metadata.name, lwBlockDef);
