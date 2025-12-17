/* ----------------------------------------------------------
   LiteWord – 見出しアコーディオン 01
   DOMContentLoaded → window.load 待機 + .last_content 判定付き（2025-05-19）
   ★ borderWidth 追加版（2025-05-20）
   ★ apiVersion 3 対応（2025-12-07）
---------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	BlockControls,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	RangeControl,
} from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

/* ========================================================= */
registerBlockType(metadata.name, {
	/* ----- エディター側 ----- */
	edit({ attributes, setAttributes }) {
		const {
			subTitle, mainTitle, headingLevel,
			mainTitleColor, borderColor, borderWidth,
			backgroundColor, iconColor,
		} = attributes;

		const onChange = (k) => (v) => setAttributes({ [k]: v });
		const TagName = `h${headingLevel}`;

		const blockProps = useBlockProps({
			className: 'custom-title-accordion-1',
			style: {
				borderColor,
				borderWidth: `${borderWidth}px`,
				borderStyle: 'solid',
				backgroundColor,
			},
		});

		return (
			<>
				{/* 見出しレベルツールバー */}
				<BlockControls>
					<ToolbarGroup>
						{[2, 3, 4, 5].map((lvl) => (
							<ToolbarButton
								key={lvl}
								isPressed={headingLevel === lvl}
								onClick={() => setAttributes({ headingLevel: lvl })}
							>
								{`H${lvl}`}
							</ToolbarButton>
						))}
					</ToolbarGroup>
				</BlockControls>

				{/* サイドバー */}
				<InspectorControls>
					<PanelBody title="タイトル文字色" initialOpen={false}>
						<ColorPalette value={mainTitleColor} onChange={onChange('mainTitleColor')} />
					</PanelBody>

					<PanelBody title="枠線設定" initialOpen={true}>
						<ColorPalette value={borderColor} onChange={onChange('borderColor')} />
						<RangeControl
							label="枠線の太さ (px)"
							min={0}
							max={10}
							step={1}
							value={borderWidth}
							onChange={onChange('borderWidth')}
						/>
					</PanelBody>

					<PanelBody title="背景色" initialOpen={false}>
						<ColorPalette value={backgroundColor} onChange={onChange('backgroundColor')} />
					</PanelBody>

					<PanelBody title="アイコンカラー" initialOpen={false}>
						<ColorPalette value={iconColor} onChange={onChange('iconColor')} />
					</PanelBody>
				</InspectorControls>

				{/* プレビュー */}
				<TagName {...blockProps}>
					<RichText
						tagName="span"
						className="sub"
						value={subTitle}
						onChange={onChange('subTitle')}
						style={{ color: mainTitleColor }}
						placeholder="サブタイトル"
					/>
					<RichText
						tagName="span"
						className="main"
						value={mainTitle}
						onChange={onChange('mainTitle')}
						placeholder="メインタイトル"
					/>
					<div className="accordion-icon" style={{ background: iconColor }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.8l-111.9 111.9c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
						</svg>
					</div>
				</TagName>
			</>
		);
	},

	/* ----- フロント側 ----- */
	save({ attributes }) {
		const {
			subTitle, mainTitle, headingLevel,
			mainTitleColor, borderColor, borderWidth,
			backgroundColor, iconColor,
		} = attributes;

		const TagName = `h${headingLevel}`;

		const blockProps = useBlockProps.save({
			className: 'custom-title-accordion-1',
			style: {
				borderColor,
				borderWidth: `${borderWidth}px`,
				borderStyle: 'solid',
				backgroundColor,
			},
		});

		/* === インライン JS === */
		const accordionScript = `
/* === accordionScript – window.load 待機 & .last_content 判定付き ============ */
(function () {
	const scriptEl = document.currentScript;

	const run = () => {
		if (!scriptEl) return;
		if (document.body.classList.contains('block-editor-page')) return;

		const heading = scriptEl.previousElementSibling;
		if (!heading || !heading.classList.contains('custom-title-accordion-1')) return;
		if (heading.__lwAccBound) return;
		heading.__lwAccBound = true;

		const wrap = document.createElement('div');
		wrap.className = 'custom-title-accordion-1__content_wrap';
		wrap.style.display = 'none';

		const sameTag = heading.tagName;
		let node = scriptEl.nextSibling;

		while (
			node &&
			!(
				node.nodeType === 1 &&
				(node.tagName === sameTag || node.classList?.contains('last_content'))
			)
		) {
			const next = node.nextSibling;
			wrap.appendChild(node);
			node = next;
		}
		if (!wrap.childNodes.length) return;

		heading.parentNode.insertBefore(wrap, node);

		heading.addEventListener('click', () => {
			const hidden = wrap.style.display === 'none';
			wrap.style.display = hidden ? '' : 'none';
			heading.classList.toggle('open', hidden);
		});
	};

	if (document.readyState === 'complete') {
		run();
	} else {
		window.addEventListener('load', run, { once: true });
	}
})();
`;

		/* === JSX === */
		return (
			<>
				<TagName {...blockProps}>
					<RichText.Content
						tagName="span"
						className="sub"
						value={subTitle}
						style={{ color: mainTitleColor }}
					/>
					<RichText.Content tagName="span" className="main" value={mainTitle} />
					<span className="accordion-icon" style={{ background: iconColor }} data-icon>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.8l-111.9 111.9c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
						</svg>
					</span>
				</TagName>

				{/* インラインスクリプト */}
				<script dangerouslySetInnerHTML={{ __html: accordionScript }} />
			</>
		);
	},
});
