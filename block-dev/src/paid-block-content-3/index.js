import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	SelectControl,
	TextControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

/* リンク先の指定（共通部品）で使う属性名の対応 */
const LINK_KEYS = { url: 'linkUrl', type: 'linkType', page: 'pageId', category: 'categoryId' };

/* ───────────────── フォントオプション ───────────────── */
const fontOptions      = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ───────────────── 旧世代の save（deprecated 用） ─────────────────
 * 幅設定（--content-3-max-w）とリンクボタンの表示切替（showLinkButton）を
 * 足す前の保存形式を再現する。当時は <a> を必ず出していたので、
 * migrate で showLinkButton を立てて既存ページのボタンが消えないようにする。
 *
 *   withAspectRatio = true  … 画像に aspect-ratio を付けるようになった後の世代
 *   withAspectRatio = false … その前のいちばん古い世代（画像に style が無い）
 */
const legacySave = (withAspectRatio) => ({ attributes }) => {
	const {
		imageUrl, imageAlt, aspectRatioHeight,
		titleSub, title, borderColor,
		content, linkUrl, linkText, linkTarget,
		titleFontSet, titleFontWeight,
		contentFontSet, contentFontWeight,
		linkFontSet, linkFontWeight,
		imagePosition,
		linkButtonBackgroundColor, linkButtonTextColor,
		showTitle,
		textPaddingTopNone,
	} = attributes;

	const hasTitle = titleSub || title;

	/* 当時は幅設定が無いので style を付けない（root の div に差が出る） */
	const blockProps = useBlockProps.save({
		className: `paid-block-content-3 ${imagePosition === 'right' ? 'right' : 'left'}`,
	});

	return (
		<div {...blockProps}>
			<div className="paid-block-content-3__inner">
				<div className="paid-block-content-3__image">
					{imageUrl && (
						<img
							loading="lazy"
							src={imageUrl}
							alt={imageAlt}
							style={withAspectRatio ? { aspectRatio: `160/${aspectRatioHeight}` } : undefined}
						/>
					)}
				</div>
				<div className={`paid-block-content-3__text${textPaddingTopNone ? ' padding-top-none' : ''}`}>
					{showTitle && hasTitle && (
						<h3 className="ttl">
							<RichText.Content
								tagName="span"
								className="sub"
								value={titleSub}
								style={{ fontWeight: titleFontWeight, color: borderColor }}
								data-lw_font_set={titleFontSet}
							/>
							<RichText.Content
								tagName="span"
								className="main"
								value={title}
								style={{ fontWeight: titleFontWeight }}
								data-lw_font_set={titleFontSet}
							/>
							<div className="bd" style={{ backgroundColor: borderColor }}></div>
						</h3>
					)}

					<RichText.Content
						tagName="p"
						className="lw_p"
						value={content}
						style={{ fontWeight: contentFontWeight, whiteSpace: 'pre-wrap' }}
						data-lw_font_set={contentFontSet}
					/>

					{/* 当時は showLinkButton が無く、<a> は常に出していた（border-radius も付いていない） */}
					<a
						href={linkUrl}
						className="paid-block-content-3__text_br_button"
						style={{
							fontWeight     : linkFontWeight,
							backgroundColor: linkButtonBackgroundColor,
							color          : linkButtonTextColor,
						}}
						data-lw_font_set={linkFontSet}
						{...(linkTarget && { target: linkTarget, rel: 'noopener noreferrer' })}
					>
						{linkText}
					</a>
				</div>
			</div>
		</div>
	);
};

/* ───────────────── ブロック登録 ───────────────── */
registerBlockType(metadata.name, {
	/* ───────── エディター側 ───────── */
	edit: ({ attributes, setAttributes }) => {
		const {
			imageUrl, imageAlt, aspectRatioHeight,
			titleSub, title, borderColor, content,
			linkUrl, linkText, linkTarget,
			titleFontSet, titleFontWeight,
			contentFontSet, contentFontWeight,
			linkFontSet, linkFontWeight,
			imagePosition,
			linkButtonBackgroundColor, linkButtonTextColor,
			showLinkButton,
			linkButtonBorderRadius,
			showTitle,
			maxWidth = 0,
			textPaddingTopNone,
		} = attributes;

		const hasTitle = titleSub || title;

		const blockProps = useBlockProps({
            className: `paid-block-content-3 ${imagePosition === 'right' ? 'right' : 'left'}${maxWidth !== 0 ? ' max-width-on' : ''}`,
            style: {
                '--content-3-max-w': maxWidth === 0 ? '100vw' : `${maxWidth}px`,
            },
        });

        return (
			<>
				<InspectorControls>
					{/* マニュアル */}
					<PanelBody title="マニュアル">
						<Button
							variant="secondary"
							href="https://www.youtube.com/watch?v=kYmWiKIxdsc"
							target="_blank"
						>
							このブロックの使い方はこちら
						</Button>
					</PanelBody>

					{/* 幅設定 */}
					<PanelBody title="幅設定">
						<RangeControl
							label="最大幅 (px)"
							help="0にすると全幅（画面いっぱい）。数値を入れると、その幅で中央に配置します"
							value={maxWidth}
							onChange={(v) => setAttributes({ maxWidth: v === undefined || v === null ? 0 : v })}
							min={0}
							max={2000}
							step={8}
						/>
					</PanelBody>

					{/* テキストエリア設定 */}
					<PanelBody title="テキストエリア設定">
						<ToggleControl
							label="上部パディングをなしにする"
							checked={textPaddingTopNone}
							onChange={(v) => setAttributes({ textPaddingTopNone: v })}
						/>
					</PanelBody>

					{/* 画像設定 */}
					<PanelBody title="画像設定">
						<MediaUpload
							onSelect={(m) => setAttributes({ imageUrl: m.url, imageAlt: m.alt })}
							allowedTypes={['image']}
							value={imageUrl}
							render={({ open }) => (
								<div style={{ marginBottom: '16px' }}>
									{imageUrl && (
										<img
											src={imageUrl}
											alt={imageAlt}
											style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
										/>
									)}
									<Button onClick={open} isSecondary>
										{imageUrl ? '画像を変更' : '画像を選択'}
									</Button>
									{imageUrl && (
										<Button
											variant="secondary"
											onClick={() => setAttributes({ imageUrl: '', imageAlt: '' })}
											style={{ marginLeft: '10px' }}
										>
											削除
										</Button>
									)}
								</div>
							)}
						/>

						<ToggleControl
							label="画像を右側に表示"
							checked={imagePosition === 'right'}
							onChange={(v) => setAttributes({ imagePosition: v ? 'right' : 'left' })}
						/>

						{/* 画像比率設定 */}
						<RangeControl
							label="画像の高さ比率"
							help="幅160に対する高さの比率"
							value={aspectRatioHeight}
							onChange={(value) => setAttributes({ aspectRatioHeight: value })}
							min={60}
							max={200}
							step={1}
						/>

						{imageUrl && (
							<TextControl
								label="代替テキスト"
								value={imageAlt}
								onChange={(v) => setAttributes({ imageAlt: v })}
							/>
						)}
					</PanelBody>

					{/* タイトル表示 */}
					<PanelBody title="タイトルの表示設定">
						<ToggleControl
							label="タイトルを表示する"
							checked={showTitle}
							onChange={(v) => setAttributes({ showTitle: v })}
						/>
					</PanelBody>

					{/* タイトルメインカラー */}
					<PanelBody title="タイトルのメインカラー">
						<ColorPalette
							value={borderColor}
							onChange={(c) => setAttributes({ borderColor: c })}
						/>
					</PanelBody>

					{/* リンク設定 */}
					<PanelBody title="リンク設定">
						<ToggleControl
							label="新規タブで開く"
							checked={linkTarget === '_blank'}
							onChange={(v) => setAttributes({ linkTarget: v ? '_blank' : '' })}
						/>
					</PanelBody>

					{/* フォント設定 */}
					<PanelBody title="フォント設定">
						<SelectControl
							label="タイトルのフォント"
							value={titleFontSet}
							options={fontOptions}
							onChange={(v) => setAttributes({ titleFontSet: v })}
						/>
						<SelectControl
							label="タイトルの太さ"
							value={titleFontWeight}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ titleFontWeight: v })}
						/>
						<SelectControl
							label="テキストのフォント"
							value={contentFontSet}
							options={fontOptions}
							onChange={(v) => setAttributes({ contentFontSet: v })}
						/>
						<SelectControl
							label="テキストの太さ"
							value={contentFontWeight}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ contentFontWeight: v })}
						/>
						<SelectControl
							label="リンクのフォント"
							value={linkFontSet}
							options={fontOptions}
							onChange={(v) => setAttributes({ linkFontSet: v })}
						/>
						<SelectControl
							label="リンクの太さ"
							value={linkFontWeight}
							options={fontWeightOptions}
							onChange={(v) => setAttributes({ linkFontWeight: v })}
						/>
					</PanelBody>

					{/* リンクボタン設定 */}
					<PanelBody title="リンクボタン設定">
						<ToggleControl
							label="リンクボタンを表示"
							checked={showLinkButton}
							onChange={(v) => setAttributes({ showLinkButton: v })}
						/>
						{showLinkButton && (
							<>
								<RangeControl
									label="角丸 (px)"
									value={linkButtonBorderRadius}
									onChange={(v) => setAttributes({ linkButtonBorderRadius: v })}
									min={0}
									max={50}
									step={1}
								/>
								<p>背景色</p>
								<ColorPalette
									value={linkButtonBackgroundColor}
									onChange={(c) => setAttributes({ linkButtonBackgroundColor: c })}
								/>
								<p>テキストの色</p>
								<ColorPalette
									value={linkButtonTextColor}
									onChange={(c) => setAttributes({ linkButtonTextColor: c })}
								/>
							</>
						)}
					</PanelBody>
				</InspectorControls>

				{/* 編集画面プレビュー */}
				<div {...blockProps}>
					<div className="paid-block-content-3__inner">
						<div className="paid-block-content-3__image">
							{imageUrl && (
								<img
									src={imageUrl}
									alt={imageAlt}
									style={{ aspectRatio: `160/${aspectRatioHeight}` }}
								/>
							)}
						</div>
						<div className={`paid-block-content-3__text${textPaddingTopNone ? ' padding-top-none' : ''}`}>
							{showTitle && (
								<h3 className="ttl">
									<RichText
										tagName="span"
										className="sub"
										value={titleSub}
										onChange={(v) => setAttributes({ titleSub: v })}
										placeholder="サブタイトルを入力"
										style={{ fontWeight: titleFontWeight, color: borderColor }}
										data-lw_font_set={titleFontSet}
									/>
									<RichText
										tagName="span"
										className="main"
										value={title}
										onChange={(v) => setAttributes({ title: v })}
										placeholder="タイトルを入力"
										style={{ fontWeight: titleFontWeight }}
										data-lw_font_set={titleFontSet}
									/>
									<div className="bd" style={{ backgroundColor: borderColor }}></div>
								</h3>
							)}

							<RichText
								tagName="p"
								value={content}
								onChange={(v) => setAttributes({ content: v })}
								placeholder="テキストを入力"
								style={{ fontWeight: contentFontWeight, whiteSpace: 'pre-wrap' }}
								data-lw_font_set={contentFontSet}
							/>

							{showLinkButton && (
								<div className="paid-block-content-3__text_br_button">
									<TextControl
										label="リンクテキスト"
										value={linkText}
										onChange={(v) => setAttributes({ linkText: v })}
									/>
									<TextControl
										label="リンクURL"
										value={linkUrl}
										onChange={(v) => setAttributes({ linkUrl: v })}
									/>
									<LinkPicker
									    link={lwLinkFromAttrs(attributes, LINK_KEYS)}
									    onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		);
	},

	/* ───────── save ───────── */
	save: ({ attributes }) => {
		const {
			imageUrl, imageAlt, aspectRatioHeight,
			titleSub, title, borderColor,
			content, linkUrl, linkText, linkTarget,
			titleFontSet, titleFontWeight,
			contentFontSet, contentFontWeight,
			linkFontSet, linkFontWeight,
			imagePosition,
			linkButtonBackgroundColor, linkButtonTextColor,
			showLinkButton,
			linkButtonBorderRadius,
			showTitle,
			maxWidth = 0,
			textPaddingTopNone,
		} = attributes;

		const hasTitle = titleSub || title;

		const blockProps = useBlockProps.save({
            className: `paid-block-content-3 ${imagePosition === 'right' ? 'right' : 'left'}${maxWidth !== 0 ? ' max-width-on' : ''}`,
            style: {
                '--content-3-max-w': maxWidth === 0 ? '100vw' : `${maxWidth}px`,
            },
        });

		return (
			<div {...blockProps}>
				<div className="paid-block-content-3__inner">
					<div className="paid-block-content-3__image">
						{imageUrl && (
							<img 
								loading="lazy" 
								src={imageUrl} 
								alt={imageAlt}
								style={{ aspectRatio: `160/${aspectRatioHeight}` }}
							/>
						)}
					</div>
					<div className={`paid-block-content-3__text${textPaddingTopNone ? ' padding-top-none' : ''}`}>
						{showTitle && hasTitle && (
							<h3 className="ttl">
								<RichText.Content
									tagName="span"
									className="sub"
									value={titleSub}
									style={{ fontWeight: titleFontWeight, color: borderColor }}
									data-lw_font_set={titleFontSet}
								/>
								<RichText.Content
									tagName="span"
									className="main"
									value={title}
									style={{ fontWeight: titleFontWeight }}
									data-lw_font_set={titleFontSet}
								/>
								<div className="bd" style={{ backgroundColor: borderColor }}></div>
							</h3>
						)}

						<RichText.Content
							tagName="p"
							className="lw_p"
							value={content}
							style={{ fontWeight: contentFontWeight, whiteSpace: 'pre-wrap' }}
							data-lw_font_set={contentFontSet}
						/>

						{showLinkButton && (
							<a
								href={linkUrl}
								data-lw-link-type={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS).linkType}
								data-lw-link-id={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS).linkId}
								className="paid-block-content-3__text_br_button"
								style={{
									fontWeight     : linkFontWeight,
									backgroundColor: linkButtonBackgroundColor,
									color          : linkButtonTextColor,
									borderRadius   : `${linkButtonBorderRadius}px`,
								}}
								data-lw_font_set={linkFontSet}
								{...(linkTarget && { target: linkTarget, rel: 'noopener noreferrer' })}
							>
								{linkText}
							</a>
						)}
					</div>
				</div>
			</div>
		);
	},

	/* ────────────────────────────────────────────────
	 * 旧世代の保存形式（これが無いと、古いページを開いて更新した瞬間に
	 * リンクボタンが黙って消える。2026-08-23 に本番28ブロック中25個で確認）
	 * ──────────────────────────────────────────────── */
	deprecated: [
		{
			apiVersion: metadata.apiVersion,
			attributes: metadata.attributes,
			supports  : metadata.supports,
			save      : legacySave(true),
			migrate   : (attributes) => ({ ...attributes, showLinkButton: true }),
		},
		{
			apiVersion: metadata.apiVersion,
			attributes: metadata.attributes,
			supports  : metadata.supports,
			save      : legacySave(false),
			migrate   : (attributes) => ({ ...attributes, showLinkButton: true }),
		},
	],
});