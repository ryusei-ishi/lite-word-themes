import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	BlockControls,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	minHeightPcClassOptionArr,
	minHeightTbClassOptionArr,
	minHeightSpClassOptionArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/fv-4', {
	title: '固定ページタイトル 04（トップ用）',
	icon: 'cover-image',
	category: 'liteword-firstview',

	/* --------------------------------------------------
	 * 属性
	 * -------------------------------------------------- */
	attributes: {
		backgroundImage: { type: 'string', default: '' },
		backgroundImageSp: { type: 'string', default: '' },
		mainTitle: { type: 'string', default: 'Lite Word' },
		subTitle: { type: 'string', default: '軽量で簡単なWordPressテーマ' },
		description: {
			type: 'string',
			default:
				'デザイナーとプログラマーが共同で開発した\nコーポレートサイトやオウンドメディアに最適なテーマ',
		},
		filterBackgroundColor: { type: 'string', default: 'var(--color-main)' },
		filterOpacity: { type: 'number', default: 1.0 },
		textColor: { type: 'string', default: '#fff' },
		minHeightPc: { type: 'string', default: 'min-h-pc-480px' },
		minHeightTb: { type: 'string', default: 'min-h-tb-400px' },
		minHeightSp: { type: 'string', default: 'min-h-sp-360px' },
		maxWidth: { type: 'number', default: 1040 },
		textAlignPc: { type: 'string', default: 'pc_left' },
		textAlignSp: { type: 'string', default: 'sp_left' },
		headingLevel: { type: 'number', default: 1 },
	},



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
		} = attributes;

		/* 固定ページのみ許可 */
		const currentPostType = useSelect((select) =>
			select('core/editor').getCurrentPostType()
		);
		if (currentPostType !== 'page') {
			return <p>このブロックは固定ページでのみ使用できます。</p>;
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
			<Fragment>
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
					<PanelBody title="背景画像設定">
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
					<PanelBody title="全体の文字の色">
						<ColorPalette
							value={textColor}
							onChange={(color) =>
								setAttributes({ textColor: color })
							}
						/>
					</PanelBody>

					{/* 高さ設定 */}
					<PanelBody title="高さ設定">
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
					<PanelBody title="内側の最大横幅">
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

					{/* テキスト位置 */}
					<PanelBody title="テキスト配置">
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
				<div
					className={`fv-4 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
				>
					<div
						className={`fv-4_inner ${textAlignPc} ${textAlignSp}`}
						style={{ maxWidth: maxWidth }}
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
			</Fragment>
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
		} = attributes;

		const TagName = `h${headingLevel}`;

		return (
			<div
				className={`fv-4 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
			>
				<div
					className={`fv-4_inner ${textAlignPc} ${textAlignSp}`}
					style={{ maxWidth: maxWidth }}
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