/**
 * CTA 2 shin shop pattern 01
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	ColorPicker,
	RangeControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { rightButtonIconSvgArr } from '../utils.js';

import metadata from './block.json';

const iconSvgOptions = rightButtonIconSvgArr();

registerBlockType(metadata.name, {
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

		// useBlockProps で apiVersion 3 対応
		const blockProps = useBlockProps({
			className: 'shin-gas-station-01-cta2'
		});

		return (
			<div {...blockProps}>
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

		// useBlockProps.save() で apiVersion 3 対応
		const blockProps = useBlockProps.save({
			className: 'shin-gas-station-01-cta2'
		});

		return (
			<div {...blockProps}>
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
