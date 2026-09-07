/**
 * FV 22 リード獲得（選んで進む入口）
 * ------------------------------------------------------------------
 * 見出しの下に「あてはまるものを選ぶだけ」の入口カードを並べ、
 * 1枚ずつ別のページへ飛ばす。
 *
 * 申し込みは重いが、選ぶだけなら軽い。だから最初の一歩を
 * 「送信」ではなく「選択」にする。選べなかった人のために
 * いちばん下に逃げ道（noteText）を1行だけ置いてある。
 *
 * 他のリード獲得FV（18〜21）が濃い面なのに対して、これは
 * 淡い地色に濃い文字。同じページの並びに置いても見分けがつく。
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr, minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs, lwLinkFromItem, lwLinkToItem, lwLinkDataPropsFromItem } from '../link-picker.js';

const NOTE_LINK_KEYS = { url: 'noteUrl', type: 'noteLinkType', page: 'notePageId', category: 'noteCategoryId' };

/* 🚨 CSS変数の値は必ず「文字列」で渡す。数値のまま渡すと WordPress 6.8 以下の書き出しが
   カスタムプロパティにも px を足し（--fv22-cols-pc:3px）、その宣言ごと無効になる。
   → repeat(3px,1fr) が none に落ちて、選択肢がPCでも1列に潰れる。
   var() のフォールバックは効かない（変数は「定義されている」ため）。
   🚨 `?? 既定値` も外さない。RangeControl は数値欄を空にすると undefined を渡すので、
   ガードが無いと `undefinedpx` が保存される。 */
const styleVars = (a) => ({
	'--fv22-bg': a.bgColor,
	'--fv22-filter-color': a.filterColor,
	'--fv22-filter-opacity': String(a.filterOpacity ?? 0.88),
	'--fv22-max-width': `${a.maxWidth ?? 1080}px`,
	'--fv22-eyebrow-color': a.eyebrowColor,
	'--fv22-title-color': a.titleColor,
	'--fv22-title-weight': a.titleFontWeight,
	'--fv22-title-size-pc': `${a.titleFontSizePc ?? 42}px`,
	'--fv22-title-size-sp': `${a.titleFontSizeSp ?? 28}px`,
	'--fv22-description-color': a.descriptionColor,
	'--fv22-cols-pc': String(a.columnsPc ?? 3),
	'--fv22-cols-sp': String(a.columnsSp ?? 1),
	'--fv22-card-bg': a.cardBgColor,
	'--fv22-card-border': a.cardBorderColor,
	'--fv22-card-title': a.cardTitleColor,
	'--fv22-card-sub': a.cardSubColor,
	'--fv22-card-num': a.cardNumColor,
	'--fv22-card-arrow': a.cardArrowColor,
	'--fv22-badge-bg': a.cardBadgeBgColor,
	'--fv22-badge-text': a.cardBadgeTextColor,
	'--fv22-card-radius': `${a.cardBorderRadius ?? 8}px`,
	'--fv22-note-color': a.noteColor,
	'--fv22-note-link': a.noteLinkColor,
});

const rootClass = (a) => [
	'lw-pr-fv-22',
	a.backgroundType === 'image' ? 'bg_image' : 'bg_color',
	a.showNum ? 'with_num' : 'no_num',
].filter(Boolean).join(' ');

const innerClass = (a) => ['fv22_inner', a.minHeightPc, a.minHeightTb, a.minHeightSp].filter(Boolean).join(' ');

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			backgroundType, bgColor, imageUrlPc, imageUrlSp, imageAlt, filterColor, filterOpacity,
			minHeightPc, minHeightTb, minHeightSp, maxWidth,
			showEyebrow, eyebrow, eyebrowColor,
			headingLevel, mainTitle, titleColor, titleFontWeight, titleFont, titleFontSizePc, titleFontSizeSp,
			description, descriptionColor,
			showNum, choiceItems = [], columnsPc, columnsSp,
			cardBgColor, cardBorderColor, cardTitleColor, cardSubColor, cardNumColor, cardArrowColor,
			cardBadgeBgColor, cardBadgeTextColor, cardBorderRadius,
			showNote, noteText, noteLinkText, noteColor, noteLinkColor, noteUrl,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;

		const updateChoice = (i, patch) => setAttributes({ choiceItems: choiceItems.map((it, n) => (n === i ? { ...it, ...patch } : it)) });
		const addChoice = () => setAttributes({ choiceItems: [...choiceItems, { num: String(choiceItems.length + 1).padStart(2, '0'), title: '選択肢の言葉', sub: '', badge: '', url: '', linkType: 'url', linkId: '' }] });
		const removeChoice = (i) => setAttributes({ choiceItems: choiceItems.filter((_, n) => n !== i) });
		const moveChoice = (i, d) => {
			const to = i + d;
			if (to < 0 || to >= choiceItems.length) return;
			const next = [...choiceItems];
			const [m] = next.splice(i, 1);
			next.splice(to, 0, m);
			setAttributes({ choiceItems: next });
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
							help="写真にしたときは、見出しと説明文の色を明るい色に変えてください。"
						/>
						<RangeControl label="中身の最大横幅" value={maxWidth} onChange={(v) => setAttributes({ maxWidth: v })} min={800} max={1400} step={10} />
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

					<PanelBody title="選択肢" initialOpen={true}>
						<p style={{ margin: '0 0 12px', fontSize: 12, color: '#a04a28' }}>
							🚨 選択肢は「お客様の言葉」で書いてください。商品名を並べると選べません。
						</p>
						<ToggleControl label="番号を出す" checked={showNum} onChange={(v) => setAttributes({ showNum: v })} />
						<SelectControl
							label="パソコンでの列数"
							value={columnsPc}
							options={[{ label: '1列', value: 1 }, { label: '2列', value: 2 }, { label: '3列', value: 3 }, { label: '4列', value: 4 }]}
							onChange={(v) => setAttributes({ columnsPc: Number(v) })}
						/>
						<SelectControl
							label="スマホでの列数"
							value={columnsSp}
							options={[{ label: '1列', value: 1 }, { label: '2列', value: 2 }]}
							onChange={(v) => setAttributes({ columnsSp: Number(v) })}
							help="文が入るので1列をおすすめします。"
						/>
						{choiceItems.map((it, i) => (
							<div key={i} style={{ borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 10 }}>
								<TextControl label={`${i + 1}枚目：番号`} value={it.num} onChange={(v) => updateChoice(i, { num: v })} help="01・02 など。" />
								<TextControl label="選択肢の言葉" value={it.title} onChange={(v) => updateChoice(i, { title: v })} />
								<TextControl label="その下の一言" value={it.sub} onChange={(v) => updateChoice(i, { sub: v })} />
								<TextControl label="小さい札（空なら出ません）" value={it.badge} onChange={(v) => updateChoice(i, { badge: v })} help="「いちばん多いご相談」など。" />
								<TextControl label="飛び先のURL" value={it.url} onChange={(v) => updateChoice(i, { url: v })} placeholder="#form など" />
								<LinkPicker link={lwLinkFromItem(it)} onChange={(patch) => updateChoice(i, lwLinkToItem(patch))} />
								<div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
									<Button variant="secondary" onClick={() => moveChoice(i, -1)} disabled={i === 0}>↑</Button>
									<Button variant="secondary" onClick={() => moveChoice(i, 1)} disabled={i === choiceItems.length - 1}>↓</Button>
									<Button isDestructive onClick={() => removeChoice(i)}>削除</Button>
								</div>
							</div>
						))}
						<Button variant="primary" onClick={addChoice} style={{ marginTop: 12 }}>選択肢を追加</Button>
					</PanelBody>

					<PanelBody title="選択肢の見た目" initialOpen={false}>
						<p style={{ margin: '0 0 4px' }}>カードの背景色</p>
						<ColorPalette value={cardBgColor} onChange={(v) => setAttributes({ cardBgColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>カードの枠の色</p>
						<ColorPalette value={cardBorderColor} onChange={(v) => setAttributes({ cardBorderColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>選択肢の文字色</p>
						<ColorPalette value={cardTitleColor} onChange={(v) => setAttributes({ cardTitleColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>一言の文字色</p>
						<ColorPalette value={cardSubColor} onChange={(v) => setAttributes({ cardSubColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>番号の色</p>
						<ColorPalette value={cardNumColor} onChange={(v) => setAttributes({ cardNumColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>矢印の色</p>
						<ColorPalette value={cardArrowColor} onChange={(v) => setAttributes({ cardArrowColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>札の背景色</p>
						<ColorPalette value={cardBadgeBgColor} onChange={(v) => setAttributes({ cardBadgeBgColor: v })} />
						<p style={{ margin: '12px 0 4px' }}>札の文字色</p>
						<ColorPalette value={cardBadgeTextColor} onChange={(v) => setAttributes({ cardBadgeTextColor: v })} />
						<RangeControl label="角の丸み" value={cardBorderRadius} onChange={(v) => setAttributes({ cardBorderRadius: v })} min={0} max={30} step={1} />
					</PanelBody>

					<PanelBody title="いちばん下の1行" initialOpen={false}>
						<ToggleControl label="1行を出す" checked={showNote} onChange={(v) => setAttributes({ showNote: v })} />
						{showNote && (
							<>
								<TextControl label="文章" value={noteText} onChange={(v) => setAttributes({ noteText: v })} help="選べなかった方の逃げ道です。消さないほうが問い合わせは増えます。" />
								<TextControl label="リンクの文字（空なら出ません）" value={noteLinkText} onChange={(v) => setAttributes({ noteLinkText: v })} />
								<TextControl label="リンク先のURL" value={noteUrl} onChange={(v) => setAttributes({ noteUrl: v })} placeholder="#form など" />
								<LinkPicker link={lwLinkFromAttrs(attributes, NOTE_LINK_KEYS)} onChange={(patch) => setAttributes(lwLinkToAttrs(patch, NOTE_LINK_KEYS))} />
								<p style={{ margin: '12px 0 4px' }}>文字色</p>
								<ColorPalette value={noteColor} onChange={(v) => setAttributes({ noteColor: v })} />
								<p style={{ margin: '12px 0 4px' }}>リンクの色</p>
								<ColorPalette value={noteLinkColor} onChange={(v) => setAttributes({ noteLinkColor: v })} />
							</>
						)}
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
						<div className="lead">
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
						</div>
						{choiceItems.length > 0 && (
							<div className="choice_list">
								{choiceItems.map((it, i) => (
									<span className="choice" key={i}>
										{it.badge && <span className="c_badge">{it.badge}</span>}
										{showNum && it.num && <span className="c_num">{it.num}</span>}
										<span className="c_body">
											<span className="c_ttl">{it.title}</span>
											{it.sub && <span className="c_sub">{it.sub}</span>}
										</span>
									</span>
								))}
							</div>
						)}
						{showNote && (noteText || noteLinkText) && (
							<p className="note">
								{noteText}
								{noteLinkText && <span className="note_link">{noteLinkText}</span>}
							</p>
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
			showNum, choiceItems = [],
			showNote, noteText, noteLinkText, noteUrl,
		} = attributes;

		const HeadingTag = `h${headingLevel}`;
		const noteLink = lwLinkDataPropsFromAttrs(attributes, NOTE_LINK_KEYS);
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
					<div className="lead">
						{showEyebrow && eyebrow && <p className="eyebrow">{eyebrow}</p>}
						<RichText.Content tagName={HeadingTag} className="main_ttl" data-lw_font_set={titleFont} value={mainTitle} />
						{description && <RichText.Content tagName="p" className="description" value={description} />}
					</div>
					{choiceItems.length > 0 && (
						<div className="choice_list">
							{choiceItems.map((it, i) => {
								const lp = lwLinkDataPropsFromItem(it);
								return (
									<a className="choice" key={i} href={it.url} data-lw-link-type={lp.linkType} data-lw-link-id={lp.linkId}>
										{it.badge && <span className="c_badge">{it.badge}</span>}
										{showNum && it.num && <span className="c_num">{it.num}</span>}
										<span className="c_body">
											<span className="c_ttl">{it.title}</span>
											{it.sub && <span className="c_sub">{it.sub}</span>}
										</span>
									</a>
								);
							})}
						</div>
					)}
					{showNote && (noteText || noteLinkText) && (
						<p className="note">
							{noteText}
							{noteLinkText && (
								<a className="note_link" href={noteUrl} data-lw-link-type={noteLink.linkType} data-lw-link-id={noteLink.linkId}>
									{noteLinkText}
								</a>
							)}
						</p>
					)}
				</div>
			</div>
		);
	},
};

registerBlockType(metadata.name, lwBlockDef);
