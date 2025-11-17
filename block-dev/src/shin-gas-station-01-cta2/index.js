import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	ColorPicker,
	RangeControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { rightButtonIconSvgArr } from '../utils.js';
import './style.scss';
import './editor.scss';

const iconSvgOptions = rightButtonIconSvgArr();

registerBlockType('wdl/shin-gas-station-01-cta2', {
	title: 'CTA 2 shin shop pattern 01',
	icon: 'megaphone',
	category: 'liteword-other',
	supports: {
		anchor: true,
	},
	attributes: {
		title: {
			type: 'string',
			source: 'html',
			selector: '.shin-gas-station-01-cta2__title .main',
			default: 'お問い合わせ・ご相談',
		},
		text: {
			type: 'string',
			source: 'html',
			selector: 'p',
			default:
				'フランチャイズ加盟に関するご相談や当運営店舗に関するご意見など<br>お気軽にお問い合わせくださいませ。',
		},
		// ★ selector を 'a span.text' に変更して、<a> 内の <span class="text"> をマッピング
		buttonText: {
			type: 'string',
			source: 'html',
			selector: 'a span.text',
			default: 'お問い合わせ',
		},
		buttonUrl: {
			type: 'string',
			default: '#',
		},
		openInNewTab: {
			type: 'boolean',
			default: false,
		},
		filterColor: {
			type: 'string',
			default: '#054161',
		},
		filterOpacity: {
			type: 'number',
			default: 0.05,
		},
		buttonTextColor: {
			type: 'string',
			default: '#fff',
		},
		buttonBackgroundColor: {
			type: 'string',
			default: 'var(--color-main)',
		},
		buttonBorderColor: {
			type: 'string',
			default: 'var(--color-main)',
		},
		buttonBorderSize: {
			type: 'number',
			default: 1,
		},
		selectedIcon: {
			type: 'string',
			default:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg>',
		},
	},


	edit: (props) => {
		const { attributes, setAttributes } = props;
		const {
			title,
			text,
			buttonText,
			buttonUrl,
			openInNewTab,
			filterColor,
			filterOpacity,
			buttonBackgroundColor,
			buttonBorderColor,
			buttonBorderSize,
			buttonTextColor,
			selectedIcon,
		} = attributes;

		// 各種ハンドラ
		const onChangeTitle = (value) => setAttributes({ title: value });
		const onChangeText = (value) => setAttributes({ text: value });
		const onChangeButtonText = (value) => setAttributes({ buttonText: value });
		const onChangeButtonUrl = (value) => setAttributes({ buttonUrl: value });
		const onToggleOpenInNewTab = () =>
			setAttributes({ openInNewTab: !openInNewTab });
		const onChangeButtonTextColor = (value) =>
			setAttributes({ buttonTextColor: value });
		const onChangeButtonBackgroundColor = (value) =>
			setAttributes({ buttonBackgroundColor: value });
		const onChangeButtonBorderColor = (value) =>
			setAttributes({ buttonBorderColor: value });
		const onChangeButtonBorderSize = (value) =>
			setAttributes({ buttonBorderSize: value });

		return (
			<div className="shin-gas-station-01-cta2">
				<InspectorControls>
					<PanelBody title="リンクの設定">
						<TextControl
							label="リンク先URL"
							value={buttonUrl}
							onChange={onChangeButtonUrl}
						/>
						<ToggleControl
							label="リンクを新規タブで開く"
							checked={openInNewTab}
							onChange={onToggleOpenInNewTab}
						/>
					</PanelBody>

					<PanelBody title="リンクボタンの色設定">
						<p>ボタン文字色</p>
						<ColorPicker
							color={buttonTextColor}
							onChangeComplete={(color) =>
								onChangeButtonTextColor(color.hex)
							}
						/>
						<p>ボタン背景色</p>
						<ColorPicker
							color={buttonBackgroundColor}
							onChangeComplete={(color) =>
								onChangeButtonBackgroundColor(color.hex)
							}
						/>
						<p>ボタン枠線色</p>
						<ColorPicker
							color={buttonBorderColor}
							onChangeComplete={(color) =>
								onChangeButtonBorderColor(color.hex)
							}
						/>
						<RangeControl
							label="ボーダーのサイズ (px)"
							value={buttonBorderSize}
							onChange={onChangeButtonBorderSize}
							min={0}
							max={10}
						/>
					</PanelBody>

					<PanelBody title="アイコン設定">
						<SelectControl
							label="アイコン"
							value={selectedIcon}
							options={iconSvgOptions}
							onChange={(newIcon) =>
								setAttributes({ selectedIcon: newIcon })
							}
						/>
					</PanelBody>
					<PanelBody title="背景の色設定">
						<p>色</p>
						<ColorPicker
							color={filterColor}
							onChangeComplete={(color) =>
								setAttributes({ filterColor: color.hex })
							}
						/>
					</PanelBody>
					<PanelBody title="背景の不透明度設定">
						<RangeControl
							label="不透明度"
							value={filterOpacity}
							onChange={(newOpacity) =>
								setAttributes({ filterOpacity: newOpacity })
							}
							min={0}
							max={1}
							step={0.01}
						/>
					</PanelBody>

				</InspectorControls>

				<div className="shin-gas-station-01-cta2__inner">
					<div className="head">
						<h2 className="shin-gas-station-01-cta2__title heading_style_reset">
							<RichText
								tagName="span"
								className="main"
								value={title}
								onChange={onChangeTitle}
								placeholder="メインタイトルを入力"
							/>
						</h2>
						<RichText
							tagName="p"
							className="shin-gas-station-01-cta2__text"
							value={text}
							onChange={onChangeText}
							placeholder="テキストを入力"
						/>
					</div>

					{/* <a> タグ配下に <span class="text"> を置き、RichTextで buttonText を管理 */}
					<div
						className="shin-gas-station-01-cta2__button"
						href={buttonUrl}
						target={openInNewTab ? '_blank' : undefined}
						rel={openInNewTab ? 'noopener noreferrer' : undefined}
						style={{
							color: buttonTextColor,
							backgroundColor: buttonBackgroundColor,
							borderColor: buttonBorderColor,
							borderWidth: buttonBorderSize + 'px',
							borderStyle: 'solid',
						}}
						onClick={(e) => e.preventDefault()} // 編集画面でリンク飛ばないように
					>
						{selectedIcon && (
							<div
								className="icon-svg"
								dangerouslySetInnerHTML={{ __html: selectedIcon }}
								style={{ fill: buttonTextColor }}
							/>
						)}
						<RichText
							tagName="span"
							className="text"
							value={buttonText}
							onChange={onChangeButtonText}
							placeholder="ボタンテキストを入力"
						/>
					</div>

					<span className="bg_text">Contact us.</span>
					<div
						className="filter"
						style={{ backgroundColor: filterColor , opacity: filterOpacity }}
					/>
				</div>
			</div>
		);
	},

	save: (props) => {
		const { attributes } = props;
		const {
			title,
			text,
			buttonText,
			buttonUrl,
			openInNewTab,
			filterColor,
			filterOpacity,
			buttonBackgroundColor,
			buttonBorderColor,
			buttonBorderSize,
			buttonTextColor,
			selectedIcon,
		} = attributes;

		return (
			<div className="shin-gas-station-01-cta2">
				<div className="shin-gas-station-01-cta2__inner">
					<div className="head">
						<h2 className="shin-gas-station-01-cta2__title heading_style_reset">
							<RichText.Content
								tagName="span"
								className="main"
								value={title}
							/>
						</h2>
						<RichText.Content
							tagName="p"
							className="shin-gas-station-01-cta2__text"
							value={text}
						/>
					</div>
					<a
						className="shin-gas-station-01-cta2__button"
						href={buttonUrl}
						target={openInNewTab ? '_blank' : undefined}
						rel={openInNewTab ? 'noopener noreferrer' : undefined}
					>
						{selectedIcon && (
							<div
								className="icon-svg"
								dangerouslySetInnerHTML={{ __html: selectedIcon }}
							/>
						)}
						{/* ★ save時も同じ <span class="text"> 構造 */}
						<RichText.Content
							tagName="span"
							className="text"
							value={buttonText}
						/>
					</a>
					<span className="bg_text"  data-lw_font_set="Montserrat">Contact us.</span>
					<div
						className="filter"
						style={{ backgroundColor: filterColor , opacity: filterOpacity }}
					/>
				</div>
				<style>{`
					.shin-gas-station-01-cta2__button{
						background-color: ${ buttonBackgroundColor };
						border-color: ${ buttonBorderColor };
						border-width: ${ buttonBorderSize }px;
						border-style: solid;
					}
					.shin-gas-station-01-cta2__button .text{
						color: ${ buttonTextColor };
					}
					.shin-gas-station-01-cta2__button .icon-svg svg,
					.shin-gas-station-01-cta2__button .icon-svg svg path{
						fill: ${ buttonTextColor };
					}
					.shin-gas-station-01-cta2__button:hover .text{
						color: ${ buttonBackgroundColor };
					}
					.shin-gas-station-01-cta2__button:hover .icon-svg svg,
					.shin-gas-station-01-cta2__button:hover .icon-svg svg path {
						fill: ${ buttonBackgroundColor };
					}
				`}</style>

			</div>
		);
	},
});
