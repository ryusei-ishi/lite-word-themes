/* ----------------------------------------------------------
 * LiteWord – paid-block-image-1
 * 画像 + 肩書き + 氏名
 * 変更点：
 *   - 最大幅 (maxWidth) を数値型(px)の RangeControl に変更
 *   - 画像選択時、サイドバーにサムネイルを表示 ⭐
 * -------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	BlockControls,
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
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { createElement } from '@wordpress/element';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* -------------------------------------------------- */
const headingOptions  = ['h2', 'h3', 'h4', 'p'];
const fontSizeOptions = [
	{ label: '大 (L)', value: 'font_size_l' },
	{ label: '中 (M)', value: 'font_size_m' },
	{ label: '小 (S)', value: 'font_size_s' },
	{ label: '極小 (SS)', value: 'font_size_ss' },
];

/* ============================================================== */
registerBlockType(metadata.name, {
	/* ============================ EDIT ============================ */
	edit({ attributes, setAttributes }) {
		const {
			image, alt, subTitle, mainTitle,
			aspectRatioW, aspectRatioH, maxWidth, centerBlock,
			innerRadiusEm,
			showNamePlate, namePlateColor, namePlateRadiusEm, namePlateBorderWidth,
			showLinkNext, linkNextBgColor, linkNextIconColor,
			linkUrl, linkOpenNewTab,
			headingLevel, fontSizeClass,
		} = attributes;

		/* スタイル生成 */
		const outerStyle = {
			maxWidth   : `${maxWidth}px`,
			marginLeft : centerBlock ? 'auto' : undefined,
			marginRight: centerBlock ? 'auto' : undefined,
		};
		const innerStyle = {
			aspectRatio : `${aspectRatioW} / ${aspectRatioH}`,
			borderRadius: `${innerRadiusEm}em`,
		};

		/* 矢印有効判定 */
		const showLinkNextEffective = !!linkUrl && showLinkNext;

		/* 画像削除  */
		const removeImage = () => setAttributes({ image: '', alt: '' });

		const blockProps = useBlockProps({
			className: `paid-block-image-1 ${fontSizeClass}`,
			style: outerStyle
		});

		return (
			<>
				{/* ------- ツールバー (見出しレベル) ------- */}
				<BlockControls group="block">
					<ToolbarGroup>
						{headingOptions.map((tag) => (
							<ToolbarButton
								key={tag}
								isPressed={headingLevel === tag}
								onClick={() => setAttributes({ headingLevel: tag })}
							>
								{tag.toUpperCase() === 'P' ? 'P' : tag.toUpperCase()}
							</ToolbarButton>
						))}
					</ToolbarGroup>
				</BlockControls>

				{/* ------- サイドバー ------- */}
				<InspectorControls>

					{/* 画像設定 */}
					<PanelBody title="画像設定" initialOpen={true}>
						<MediaUpload
							onSelect={(media) => setAttributes({ image: media.url, alt: media.alt || '' })}
							allowedTypes={['image']}
							value={image}
							render={({ open }) => (
								<>
									{image && (
										<>
											<img
												src={image}
												alt={alt || '選択した画像'}
												style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
											/>
											<Button
												onClick={() => setAttributes({ image: '', alt: '' })}
												variant="secondary"
												style={{ margin: '4px 4px 0 0' }}
											>
												画像を削除
											</Button>
										</>
									)}

									<Button onClick={open} variant="secondary">
										画像を選択
									</Button>
								</>
							)}
						/>
						<br /><br />
						{/* ★ ここに余白を追加 */}
						<TextControl
							label="代替テキスト (alt)"
							value={alt}
							onChange={(v) => setAttributes({ alt: v })}
						/>
					</PanelBody>

					{/* レイアウト */}
					<PanelBody title="レイアウト" initialOpen={false}>
						<RangeControl
							label={`アスペクト比（横） : ${aspectRatioW}`}
							value={aspectRatioW}
							onChange={(v) => setAttributes({ aspectRatioW: v })}
							min={100} max={800}
						/>
						<RangeControl
							label={`アスペクト比（縦） : ${aspectRatioH}`}
							value={aspectRatioH}
							onChange={(v) => setAttributes({ aspectRatioH: v })}
							min={100} max={800}
						/>
						<RangeControl
							label={`最大幅 (px) : ${maxWidth}`}
							value={maxWidth}
							onChange={(v) => setAttributes({ maxWidth: v })}
							min={100}
							max={2000}
							step={10}
						/>
						<ToggleControl
							label="中央寄せにする"
							checked={centerBlock}
							onChange={(v) => setAttributes({ centerBlock: v })}
						/>
						<SelectControl
							label="全体のフォントサイズ"
							value={fontSizeClass}
							options={fontSizeOptions}
							onChange={(v)=> setAttributes({ fontSizeClass: v })}
						/>
						<RangeControl
							label={`画像枠角丸 (em) : ${innerRadiusEm}`}
							value={innerRadiusEm}
							onChange={(v)=> setAttributes({ innerRadiusEm: v })}
							min={0} max={5} step={0.1}
						/>
					</PanelBody>

					{/* 名前プレート */}
					<PanelBody title="名前プレート" initialOpen={false}>
						<ToggleControl
							label="プレートを表示"
							checked={showNamePlate}
							onChange={(v)=> setAttributes({ showNamePlate: v })}
						/>
						{showNamePlate && (
							<>
								<p>背景 / 枠線カラー</p>
								<ColorPalette
									value={namePlateColor}
									onChange={(v)=> setAttributes({ namePlateColor: v })}
								/>
								<RangeControl
									label={`プレート角丸 (em) : ${namePlateRadiusEm}`}
									value={namePlateRadiusEm}
									onChange={(v)=> setAttributes({ namePlateRadiusEm: v })}
									min={0} max={5} step={0.1}
								/>
								<RangeControl
									label={`プレート枠線太さ (px) : ${namePlateBorderWidth}`}
									value={namePlateBorderWidth}
									onChange={(v)=> setAttributes({ namePlateBorderWidth: v })}
									min={0} max={10}
								/>
							</>
						)}
					</PanelBody>

					{/* リンク設定 */}
					<PanelBody title="リンク設定" initialOpen={false}>
						<TextControl
							label="リンク URL"
							value={linkUrl}
							onChange={(v) => setAttributes({ linkUrl: v })}
							placeholder="https://example.com/"
						/>
						<ToggleControl
							label="新規タブで開く"
							checked={linkOpenNewTab}
							onChange={(v) => setAttributes({ linkOpenNewTab: v })}
							disabled={!linkUrl}
						/>
						<ToggleControl
							label="矢印を表示"
							checked={showLinkNext}
							onChange={(v) => setAttributes({ showLinkNext: v })}
							disabled={!linkUrl}
						/>
						{linkUrl && showLinkNext && (
							<>
								<p>背景色</p>
								<ColorPalette
									value={linkNextBgColor}
									onChange={(v) => setAttributes({ linkNextBgColor: v })}
								/>
								<p>アイコン色</p>
								<ColorPalette
									value={linkNextIconColor}
									onChange={(v) => setAttributes({ linkNextIconColor: v })}
								/>
							</>
						)}
						{!linkUrl && <p style={{fontSize:'12px',opacity:.7}}>※URLを入力すると設定できます</p>}
					</PanelBody>
				</InspectorControls>

				{/* ------- エディター表示 ------- */}
				<div {...blockProps}>
					<div className="paid-block-image-1__inner" style={innerStyle}>
						{image && <img src={image} alt={alt} />}

						{showNamePlate &&
							createElement(
								headingLevel,
								{
									className: 'name_plate',
									style: {
										backgroundColor: namePlateColor,
										borderColor    : namePlateColor,
										borderRadius   : `${namePlateRadiusEm}em`,
										borderWidth    : `${namePlateBorderWidth}px`,
									},
								},
								<>
									<RichText
										tagName="span"
										className="sub"
										value={subTitle}
										onChange={(v) => setAttributes({ subTitle: v })}
										placeholder="肩書き"
									/>
									<RichText
										tagName="span"
										className="main"
										value={mainTitle}
										onChange={(v) => setAttributes({ mainTitle: v })}
										placeholder="氏名"
									/>
								</>
							)
						}

						{showLinkNextEffective && (
							<div
								className="link_next"
								style={{ backgroundColor: linkNextBgColor }}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 448 512"
									style={{ fill: linkNextIconColor }}
								>
									<path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
								</svg>
							</div>
						)}
					</div>
				</div>
			</>
		);
	},

	/* ============================ SAVE ============================ */
	save({ attributes }) {
		const {
			image, alt, subTitle, mainTitle,
			aspectRatioW, aspectRatioH, maxWidth, centerBlock,
			innerRadiusEm,
			showNamePlate, namePlateColor, namePlateRadiusEm, namePlateBorderWidth,
			showLinkNext, linkNextBgColor, linkNextIconColor,
			linkUrl, linkOpenNewTab,
			headingLevel, fontSizeClass,
		} = attributes;

		const showLinkNextEffective = !!linkUrl && showLinkNext;

		/* テキストの有無をチェック */
		const hasSubTitle = subTitle && subTitle.trim() !== '';
		const hasMainTitle = mainTitle && mainTitle.trim() !== '';
		const showNamePlateEffective = showNamePlate && (hasSubTitle || hasMainTitle);

		/* a/div 切替 (保存時のみ) */
		const WrapperTag = linkUrl ? 'a' : 'div';
		const wrapperProps = linkUrl
			? {
					href   : linkUrl,
					target : linkOpenNewTab ? '_blank' : undefined,
					rel    : linkOpenNewTab ? 'noopener noreferrer' : undefined,
					className: 'paid-block-image-1__inner',
					style  : { aspectRatio: `${aspectRatioW} / ${aspectRatioH}`, borderRadius: `${innerRadiusEm}em` },
			}
			: {
					className: 'paid-block-image-1__inner',
					style  : { aspectRatio: `${aspectRatioW} / ${aspectRatioH}`, borderRadius: `${innerRadiusEm}em` },
			};

		const HeadingTag = headingLevel;

		const blockProps = useBlockProps.save({
			className: `paid-block-image-1 ${fontSizeClass}`,
			style: {
				maxWidth   : `${maxWidth}px`,
				marginLeft : centerBlock ? 'auto' : undefined,
				marginRight: centerBlock ? 'auto' : undefined,
			}
		});

		return (
			<div {...blockProps}>
				{createElement(
					WrapperTag,
					wrapperProps,
					<>
						{image && <img src={image} alt={alt} />}

						{showNamePlateEffective && (
							<HeadingTag
								className="name_plate"
								style={{
									backgroundColor: namePlateColor,
									borderColor    : namePlateColor,
									borderRadius   : `${namePlateRadiusEm}em`,
									borderWidth    : `${namePlateBorderWidth}px`,
								}}
							>
								{hasSubTitle && <RichText.Content tagName="span" className="sub" value={subTitle} />}
								{hasMainTitle && <RichText.Content tagName="span" className="main" value={mainTitle} />}
							</HeadingTag>
						)}

						{showLinkNextEffective && (
							<div
								className="link_next"
								style={{ backgroundColor: linkNextBgColor }}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 448 512"
									style={{ fill: linkNextIconColor }}
								>
									<path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
								</svg>
							</div>
						)}
					</>
				)}
			</div>
		);
	},
});