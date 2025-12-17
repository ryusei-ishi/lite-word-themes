import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	RichText,
	URLInput,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ButtonGroup,
	Button,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			buttonText, url, openInNewTab,
			fontSize, maxWidth, maxWidthSp,
			backgroundColor, textColor,
			paddingSize, innerPaddingSize,
			marginTop, marginBottom,
			alignment, alignmentSp,
			borderRadius, borderWidth, borderColor,
		} = attributes;

		const effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;

		const blockProps = useBlockProps({
			className: `wp-block-wdl-button-01 padding-${paddingSize} align-${alignment} align-sp-${alignmentSp}`,
			style: {
				marginTop: `${marginTop}px`,
				marginBottom: `${marginBottom}px`,
				'--button-01-max-width-sp': `${effectiveMaxWidthSp}px`,
			},
		});

		return (
			<>
				<InspectorControls>
					{/* 1. 基本設定 */}
					<PanelBody title="基本設定" initialOpen={true}>
						<div style={{ marginBottom: '15px' }}>
							<p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
								リンク先URL
							</p>
							<URLInput
								value={url}
								onChange={(v) => setAttributes({ url: v })}
								style={{ width: '100%' }}
							/>
						</div>
						<ToggleControl
							label="新しいタブで開く"
							checked={openInNewTab}
							onChange={() => setAttributes({ openInNewTab: !openInNewTab })}
						/>
					</PanelBody>

					{/* 2. ボタンのサイズと形 */}
					<PanelBody title="ボタンのサイズと形" initialOpen={false}>
						<div style={{ marginBottom: '20px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								ボタンの横幅 (px)
							</label>
							<RangeControl
								value={maxWidth}
								onChange={(v) => setAttributes({ maxWidth: v })}
								min={100}
								max={1000}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>
						<div style={{ marginBottom: '20px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								スマホでのボタンの横幅 (px)
							</label>
							<RangeControl
								value={maxWidthSp !== null ? maxWidthSp : maxWidth}
								onChange={(v) => setAttributes({ maxWidthSp: v })}
								min={100}
								max={1000}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>
						<div style={{ marginBottom: '20px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								角の丸み (px)
							</label>
							<RangeControl
								value={borderRadius}
								onChange={(v) => setAttributes({ borderRadius: v })}
								min={0}
								max={100}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>
						<div style={{ marginBottom: '20px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								文字のサイズ (%)
							</label>
							<RangeControl
								value={fontSize}
								onChange={(v) => setAttributes({ fontSize: v })}
								min={85}
								max={160}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>
						<div>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
								ボタン内の余白
							</label>
							<ButtonGroup>
								{['S', 'M', 'L'].map((size) => (
									<Button
										key={size}
										isPrimary={innerPaddingSize === size}
										onClick={() => setAttributes({ innerPaddingSize: size })}
									>
										{size === 'S' ? '小さめ' : size === 'M' ? '標準' : '大きめ'}
									</Button>
								))}
							</ButtonGroup>
						</div>
					</PanelBody>

					{/* 3. 色の設定 */}
					<PanelBody title="色の設定" initialOpen={false}>
						<div style={{ marginBottom: '20px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								ボタンの背景色
							</label>
							<input
								type="color"
								value={backgroundColor}
								onChange={(e) => setAttributes({ backgroundColor: e.target.value })}
								style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ddd' }}
							/>
						</div>
						<div style={{ marginBottom: '15px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								文字の色
							</label>
							<input
								type="color"
								value={textColor}
								onChange={(e) => setAttributes({ textColor: e.target.value })}
								style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ddd' }}
							/>
						</div>
					</PanelBody>

					{/* 4. ボタンの配置 */}
					<PanelBody title="ボタンの配置" initialOpen={false}>
						<div style={{ marginBottom: '20px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
								パソコン・タブレットでの位置
							</label>
							<ButtonGroup>
								{[
									{ label: '左寄せ', value: 'flex-start' },
									{ label: '中央', value: 'center' },
									{ label: '右寄せ', value: 'flex-end' },
								].map((opt) => (
									<Button
										key={opt.value}
										isPrimary={alignment === opt.value}
										onClick={() => setAttributes({ alignment: opt.value })}
									>
										{opt.label}
									</Button>
								))}
							</ButtonGroup>
						</div>
						<div>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
								スマートフォンでの位置
							</label>
							<ButtonGroup>
								{[
									{ label: '左寄せ', value: 'flex-start' },
									{ label: '中央', value: 'center' },
									{ label: '右寄せ', value: 'flex-end' },
								].map((opt) => (
									<Button
										key={opt.value}
										isPrimary={alignmentSp === opt.value}
										onClick={() => setAttributes({ alignmentSp: opt.value })}
									>
										{opt.label}
									</Button>
								))}
							</ButtonGroup>
						</div>
					</PanelBody>

					{/* 5. 余白の設定 */}
					<PanelBody title="余白の設定" initialOpen={false}>
						<div style={{ marginBottom: '15px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								ボタンの上の余白 (px)
							</label>
							<RangeControl
								value={marginTop}
								onChange={(v) => setAttributes({ marginTop: v })}
								min={0}
								max={100}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>
						<div>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								ボタンの下の余白 (px)
							</label>
							<RangeControl
								value={marginBottom}
								onChange={(v) => setAttributes({ marginBottom: v })}
								min={0}
								max={100}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>
					</PanelBody>

					{/* 6. 枠線の設定 */}
					<PanelBody title="枠線の設定" initialOpen={false}>
						<div style={{ marginBottom: borderWidth > 0 ? '15px' : '0px' }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
								枠線の太さ (px)
							</label>
							<RangeControl
								value={borderWidth}
								onChange={(v) => setAttributes({ borderWidth: v })}
								min={0}
								max={20}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</div>
						{borderWidth > 0 && (
							<div>
								<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
									枠線の色
								</label>
								<input
									type="color"
									value={borderColor}
									onChange={(e) => setAttributes({ borderColor: e.target.value })}
									style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ddd' }}
								/>
							</div>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<RichText
						tagName="a"
						href={url}
						target={openInNewTab ? '_blank' : undefined}
						rel={openInNewTab ? 'noopener noreferrer' : undefined}
						value={buttonText}
						onChange={(v) => setAttributes({ buttonText: v })}
						placeholder="ボタンのテキストを入力"
						multiline={false}
						style={{
							maxWidth: `${maxWidth}px`,
							fontSize: `${fontSize}%`,
							backgroundColor,
							color: textColor,
							padding:
								innerPaddingSize === 'S'
									? '0.7em 1em'
									: innerPaddingSize === 'M'
									? '0.9em 1.4em'
									: '1.3em 1.6em',
							textAlign: 'center',
							textDecoration: 'none',
							borderRadius: `${borderRadius}px`,
							borderWidth: `${borderWidth}px`,
							borderStyle: borderWidth > 0 ? 'solid' : 'none',
							borderColor,
						}}
					/>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			buttonText, url, openInNewTab,
			fontSize, maxWidth, maxWidthSp,
			backgroundColor, textColor,
			paddingSize, innerPaddingSize,
			marginTop, marginBottom,
			alignment, alignmentSp,
			borderRadius, borderWidth, borderColor,
		} = attributes;

		const effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;

		const blockProps = useBlockProps.save({
			className: `wp-block-wdl-button-01 padding-${paddingSize} align-${alignment} align-sp-${alignmentSp}`,
			style: {
				marginTop: `${marginTop}px`,
				marginBottom: `${marginBottom}px`,
				'--button-01-max-width-sp': `${effectiveMaxWidthSp}px`,
			},
		});

		return (
			<div {...blockProps}>
				<a
					href={url}
					target={openInNewTab ? '_blank' : undefined}
					rel={openInNewTab ? 'noopener noreferrer' : undefined}
					style={{
						maxWidth: `${maxWidth}px`,
						fontSize: `${fontSize}%`,
						backgroundColor,
						color: textColor,
						padding:
							innerPaddingSize === 'S'
								? '0.7em 1em'
								: innerPaddingSize === 'M'
								? '0.9em 1.4em'
								: '1.3em 1.6em',
						textAlign: 'center',
						textDecoration: 'none',
						borderRadius: `${borderRadius}px`,
						borderWidth: `${borderWidth}px`,
						borderStyle: borderWidth > 0 ? 'solid' : 'none',
						borderColor,
					}}
					dangerouslySetInnerHTML={{ __html: buttonText }}
				/>
			</div>
		);
	},
});
