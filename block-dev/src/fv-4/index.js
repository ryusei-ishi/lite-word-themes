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

/**
 * 文字サイズの CSS 変数を組み立てる。
 * 値が 0（未設定）のものは何も返さないので、既定のままのブロックは
 * 保存される HTML がこれまでと 1 バイトも変わらない（＝既存ページが無効にならない）。
 */
function fvSizeVars(a) {
	const v = {};
	if (a.mainFontSizePc) v['--fv4-main-pc'] = `${a.mainFontSizePc}px`;
	if (a.mainFontSizeTb) v['--fv4-main-tb'] = `${a.mainFontSizeTb}px`;
	if (a.mainFontSizeSp) v['--fv4-main-sp'] = `${a.mainFontSizeSp}px`;
	if (a.subFontSizePc) v['--fv4-sub-pc'] = `${a.subFontSizePc}px`;
	if (a.subFontSizeTb) v['--fv4-sub-tb'] = `${a.subFontSizeTb}px`;
	if (a.subFontSizeSp) v['--fv4-sub-sp'] = `${a.subFontSizeSp}px`;
	return v;
}

registerBlockType(metadata.name, {
	/* --------------------------------------------------
	 * 編集画面
	 * -------------------------------------------------- */
	edit(props) {
		const { attributes, setAttributes } = props;
		const {
			backgroundImage,
			backgroundImageSp,
			mainTitle,
			subTitle,
			description,
			filterBackgroundColor,
			filterOpacity,
			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,
			maxWidth,
			textAlignPc,
			textAlignSp,
			headingLevel,
			mainFontSizePc,
			mainFontSizeTb,
			mainFontSizeSp,
			subFontSizePc,
			subFontSizeTb,
			subFontSizeSp,
		} = attributes;

		// useBlockPropsは条件付きreturnの前に呼ぶ（Reactフックのルール）
		const blockProps = useBlockProps({
			className: `fv-4 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		/* 固定ページのみ許可 */
		const currentPostType = useSelect((select) =>
			select('core/editor').getCurrentPostType()
		);
		if (currentPostType !== 'page') {
			return <div {...blockProps}><p>このブロックは固定ページでのみ使用できます。</p></div>;
		}

		/* 画像選択ハンドラ */
		const onChangeBackgroundImage = (media) =>
			setAttributes({ backgroundImage: media.url });
		const onChangeBackgroundImageSp = (media) =>
			setAttributes({ backgroundImageSp: media.url });

		const onChangeHeadingLevel = (newLevel) => {
			setAttributes({ headingLevel: newLevel });
		};

		const TagName = `h${headingLevel}`;

		return (
			<>
				{/* ▼ タイトルタグ切替ツールバー */}
				<BlockControls>
					<ToolbarGroup>
						{[1, 2, 3, 4, 5].map((level) => (
							<ToolbarButton
								key={level}
								isPressed={headingLevel === level}
								onClick={() => onChangeHeadingLevel(level)}
							>
								{`H${level}`}
							</ToolbarButton>
						))}
					</ToolbarGroup>
				</BlockControls>

				<InspectorControls>
					{/* 背景画像 */}
					<PanelBody title="背景設定">
						<p>PCの時</p>
						<MediaUpload
							onSelect={onChangeBackgroundImage}
							allowedTypes={['image']}
							value={backgroundImage}
							render={({ open }) => (
								<>
									{backgroundImage && (
										<>
											<img
												src={backgroundImage}
												alt="選択した背景画像"
												style={{
													width: '100%',
													height: 'auto',
													marginBottom: '10px',
												}}
											/>
											<Button
												onClick={() =>
													setAttributes({
														backgroundImage: '',
													})
												}
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
						<p style={{ marginTop: '16px' }}>スマホの時</p>
						<MediaUpload
							onSelect={onChangeBackgroundImageSp}
							allowedTypes={['image']}
							value={backgroundImageSp}
							render={({ open }) => (
								<>
									{backgroundImageSp && (
										<>
											<img
												src={backgroundImageSp}
												alt="選択した背景画像"
												style={{
													width: '100%',
													height: 'auto',
													marginBottom: '10px',
												}}
											/>
											<Button
												onClick={() =>
													setAttributes({
														backgroundImageSp: '',
													})
												}
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
					</PanelBody>

					{/* フィルター */}
					<PanelBody title="フィルター設定">
						<p>フィルターの色</p>
						<ColorPalette
							value={filterBackgroundColor}
							onChange={(color) =>
								setAttributes({ filterBackgroundColor: color })
							}
						/>
						<p>透明度</p>
						<RangeControl
							value={filterOpacity}
							onChange={(value) =>
								setAttributes({ filterOpacity: value })
							}
							min={0}
							max={1}
							step={0.01}
						/>
					</PanelBody>

					{/* 文字色 */}
					<PanelBody title="色設定">
						<ColorPalette
							value={textColor}
							onChange={(color) =>
								setAttributes({ textColor: color })
							}
						/>
					</PanelBody>

					{/* 高さ設定 */}
					<PanelBody title="レイアウト設定">
						<p>PC用高さ</p>
						<SelectControl
							value={minHeightPc}
							options={minHeightPcClassOptionArr()}
							onChange={(value) =>
								setAttributes({ minHeightPc: value })
							}
						/>
						<p>タブレット用高さ</p>
						<SelectControl
							value={minHeightTb}
							options={minHeightTbClassOptionArr()}
							onChange={(value) =>
								setAttributes({ minHeightTb: value })
							}
						/>
						<p>スマートフォン用高さ</p>
						<SelectControl
							value={minHeightSp}
							options={minHeightSpClassOptionArr()}
							onChange={(value) =>
								setAttributes({ minHeightSp: value })
							}
						/>
					</PanelBody>

					{/* 最大幅 */}
					<PanelBody title="コンテンツ幅設定">
						<RangeControl
							label="最大幅 (px)"
							value={maxWidth}
							onChange={(value) =>
								setAttributes({ maxWidth: value })
							}
							min={600}
							max={1600}
							step={8}
						/>
					</PanelBody>

					{/* 文字サイズ */}
					<PanelBody title="文字サイズ設定" initialOpen={false}>
						<p style={{ fontSize: '12px', color: '#666', marginTop: 0, lineHeight: 1.6 }}>
							空欄のままなら今までどおりの大きさです。タイトルが長くて
							スマホで何行にも折り返してしまうときだけ下げてください。
							もとに戻すときは各項目の「リセット」を押します。
						</p>
						<p style={{ margin: '20px 0 4px', fontWeight: 600 }}>メインタイトル</p>
						<RangeControl
							label="パソコン"
							value={mainFontSizePc || undefined}
							onChange={(value) =>
								setAttributes({ mainFontSizePc: value ? value : 0 })
							}
							min={16}
							max={120}
							step={1}
							allowReset
							help={mainFontSizePc ? '' : '空欄＝これまでどおり（72px）'}
						/>
						<RangeControl
							label="タブレット"
							value={mainFontSizeTb || undefined}
							onChange={(value) =>
								setAttributes({ mainFontSizeTb: value ? value : 0 })
							}
							min={16}
							max={120}
							step={1}
							allowReset
							help={mainFontSizeTb ? '' : '空欄＝これまでどおり（64px・狭いと56px）'}
						/>
						<RangeControl
							label="スマホ"
							value={mainFontSizeSp || undefined}
							onChange={(value) =>
								setAttributes({ mainFontSizeSp: value ? value : 0 })
							}
							min={12}
							max={80}
							step={1}
							allowReset
							help={mainFontSizeSp ? '' : '空欄＝これまでどおり（48px）'}
						/>
						<p style={{ margin: '24px 0 4px', fontWeight: 600 }}>サブタイトル</p>
						<RangeControl
							label="パソコン"
							value={subFontSizePc || undefined}
							onChange={(value) =>
								setAttributes({ subFontSizePc: value ? value : 0 })
							}
							min={10}
							max={48}
							step={1}
							allowReset
							help={subFontSizePc ? '' : '空欄＝これまでどおり（24px）'}
						/>
						<RangeControl
							label="タブレット"
							value={subFontSizeTb || undefined}
							onChange={(value) =>
								setAttributes({ subFontSizeTb: value ? value : 0 })
							}
							min={10}
							max={48}
							step={1}
							allowReset
							help={subFontSizeTb ? '' : '空欄＝これまでどおり（18px）'}
						/>
						<RangeControl
							label="スマホ"
							value={subFontSizeSp || undefined}
							onChange={(value) =>
								setAttributes({ subFontSizeSp: value ? value : 0 })
							}
							min={8}
							max={40}
							step={1}
							allowReset
							help={subFontSizeSp ? '' : '空欄＝これまでどおり（16px）'}
						/>
					</PanelBody>

					{/* テキスト位置 */}
					<PanelBody title="配置設定">
						<p>PC 表示</p>
						<SelectControl
							value={textAlignPc}
							options={[
								{ label: '左寄せ', value: 'pc_left' },
								{ label: '中央寄せ', value: 'pc_center' },
								{ label: '右寄せ', value: 'pc_right' },
							]}
							onChange={(value) =>
								setAttributes({ textAlignPc: value })
							}
						/>
						<p>スマホ表示</p>
						<SelectControl
							value={textAlignSp}
							options={[
								{ label: '左寄せ', value: 'sp_left' },
								{ label: '中央寄せ', value: 'sp_center' },
								{ label: '右寄せ', value: 'sp_right' },
							]}
							onChange={(value) =>
								setAttributes({ textAlignSp: value })
							}
						/>
					</PanelBody>
				</InspectorControls>

				{/* --------------------------------------------------
				 * プレビュー（編集画面）
				 * -------------------------------------------------- */}
				<div {...blockProps}>
					<div
						className={`fv-4_inner ${textAlignPc} ${textAlignSp}`}
						style={{ maxWidth: maxWidth, ...fvSizeVars(attributes) }}
					>
						<TagName style={{ color: textColor }}>
							<RichText
								tagName="span"
								className="sub"
								value={subTitle}
								onChange={(value) =>
									setAttributes({ subTitle: value })
								}
								placeholder="サブタイトルを入力"
								style={{ color: textColor }}
							/>
							<RichText
								tagName="span"
								className="main"
								value={mainTitle}
								onChange={(value) =>
									setAttributes({ mainTitle: value })
								}
								placeholder="メインタイトルを入力"
								style={{ color: textColor }}
							/>
						</TagName>
						<RichText
							tagName="p"
							value={description}
							onChange={(value) =>
								setAttributes({ description: value })
							}
							placeholder="説明文を入力"
							style={{ color: textColor }}
						/>
					</div>

					<div
						className="filter"
						style={{
							backgroundColor: filterBackgroundColor,
							opacity: filterOpacity,
						}}
					></div>

					<div className="bg_image">
						{backgroundImage && (
							<img
								src={backgroundImage}
								alt="背景画像"
								loading="eager"
								fetchpriority="high"
							/>
						)}
					</div>
				</div>
			</>
		);
	},

	/* --------------------------------------------------
	 * フロント出力
	 * -------------------------------------------------- */
	save(props) {
		const { attributes } = props;
		const {
			backgroundImage,
			backgroundImageSp,
			mainTitle,
			subTitle,
			description,
			filterBackgroundColor,
			filterOpacity,
			textColor,
			minHeightPc,
			minHeightTb,
			minHeightSp,
			maxWidth,
			textAlignPc,
			textAlignSp,
			headingLevel,
			mainFontSizePc,
			mainFontSizeTb,
			mainFontSizeSp,
			subFontSizePc,
			subFontSizeTb,
			subFontSizeSp,
		} = attributes;

		const TagName = `h${headingLevel}`;

		const blockProps = useBlockProps.save({
			className: `fv-4 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		return (
			<div {...blockProps}>
				<div
					className={`fv-4_inner ${textAlignPc} ${textAlignSp}`}
					style={{ maxWidth: maxWidth, ...fvSizeVars(attributes) }}
				>
					<TagName className="ttl" style={{ color: textColor }}>
						<RichText.Content
							tagName="span"
							className="sub"
							value={subTitle}
							style={{ color: textColor }}
						/>
						<RichText.Content
							tagName="span"
							className="main"
							value={mainTitle}
							style={{ color: textColor }}
						/>
					</TagName>
					<RichText.Content
						tagName="p"
						value={description}
						style={{ color: textColor }}
					/>
				</div>

				<div
					className="filter"
					style={{
						backgroundColor: filterBackgroundColor,
						opacity: filterOpacity,
					}}
				></div>

				{backgroundImage && (
					<picture className="bg_image">
						<source
							srcSet={backgroundImageSp}
							media="(max-width: 800px)"
						/>
						<source
							srcSet={backgroundImage}
							media="(min-width: 801px)"
						/>
						<img
							src={backgroundImage}
							alt="背景画像"
							loading="eager"
							fetchpriority="high"
						/>
					</picture>
				)}
			</div>
		);
	},
});