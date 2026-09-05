import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	MediaUpload,
	useBlockProps,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			leftItems,
			rightItems,
			imageUrl,
			imageAlt,
			bgColor,
			textColor,
			listFontSet,
			listFontWeight,
			listColumns,
		} = attributes;

		const blockProps = useBlockProps({
			className: `lw-pr-list-8 columns-${listColumns}`,
			style: {
				'--list_items_bg_color': bgColor,
				'--list_items_color': textColor,
			},
		});

		const updateLeftItem = (index, value) => {
			const updated = [...leftItems];
			updated[index] = value;
			setAttributes({ leftItems: updated });
		};
		const addLeftItem = () => {
			setAttributes({ leftItems: [...leftItems, '新しい項目'] });
		};
		const removeLeftItem = (index) => {
			setAttributes({ leftItems: leftItems.filter((_, i) => i !== index) });
		};

		const updateRightItem = (index, value) => {
			const updated = [...rightItems];
			updated[index] = value;
			setAttributes({ rightItems: updated });
		};
		const addRightItem = () => {
			setAttributes({ rightItems: [...rightItems, '新しい項目'] });
		};
		const removeRightItem = (index) => {
			setAttributes({ rightItems: rightItems.filter((_, i) => i !== index) });
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title="レイアウト設定">
						<SelectControl
							label="リストの列数"
							value={listColumns}
							options={[
								{ label: '1列', value: 1 },
								{ label: '2列', value: 2 },
							]}
							onChange={(value) => setAttributes({ listColumns: parseInt(value, 10) })}
						/>
					</PanelBody>

					<PanelBody title="画像設定">
						<MediaUpload
							onSelect={(media) => setAttributes({ imageUrl: media.url, imageAlt: media.alt })}
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
									<Button onClick={open} variant="secondary">
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
						{imageUrl && (
							<TextControl
								label="代替テキスト"
								value={imageAlt}
								onChange={(v) => setAttributes({ imageAlt: v })}
							/>
						)}
						<p style={{ opacity: 0.7, fontSize: '12px' }}>
							画像はリスト側の高さいっぱいにトリミング表示されます（下に余白は残りません）。
						</p>
					</PanelBody>

					<PanelBody title="色設定">
						<p>リスト背景色</p>
						<ColorPalette
							value={bgColor}
							onChange={(color) => setAttributes({ bgColor: color || '#f7f7f7' })}
						/>
						<p>テキスト色</p>
						<ColorPalette
							value={textColor}
							onChange={(color) => setAttributes({ textColor: color || 'var(--color-main)' })}
						/>
					</PanelBody>

					<PanelBody title="フォント設定">
						<SelectControl
							label="フォントの種類"
							value={listFontSet}
							options={fontOptions}
							onChange={(value) => setAttributes({ listFontSet: value })}
						/>
						<SelectControl
							label="フォントの太さ"
							value={listFontWeight}
							options={fontWeightOptions}
							onChange={(value) => setAttributes({ listFontWeight: value })}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="lw-pr-list-8_wrap">
						<div className="list_items">
							<div className="list_items_inner">
								<ul
									className="list_left"
									data-lw_font_set={listFontSet}
									style={{ fontWeight: listFontWeight }}
								>
									{leftItems.map((item, index) => (
										<li key={index} className="list-item-edit">
											<RichText
												tagName="span"
												value={item}
												onChange={(value) => updateLeftItem(index, value)}
												placeholder="項目を入力"
											/>
											<button
												type="button"
												className="list-item-remove"
												onClick={() => removeLeftItem(index)}
												aria-label="削除"
											>
												×
											</button>
										</li>
									))}
									<li className="list-item-add">
										<button type="button" onClick={addLeftItem}>＋</button>
									</li>
								</ul>

								{listColumns === 2 && (
									<ul
										className="list_right"
										data-lw_font_set={listFontSet}
										style={{ fontWeight: listFontWeight }}
									>
										{rightItems.map((item, index) => (
											<li key={index} className="list-item-edit">
												<RichText
													tagName="span"
													value={item}
													onChange={(value) => updateRightItem(index, value)}
													placeholder="項目を入力"
												/>
												<button
													type="button"
													className="list-item-remove"
													onClick={() => removeRightItem(index)}
													aria-label="削除"
												>
													×
												</button>
											</li>
										))}
										<li className="list-item-add">
											<button type="button" onClick={addRightItem}>＋</button>
										</li>
									</ul>
								)}
							</div>
						</div>
						<div className="image">
							{imageUrl ? (
								<img src={imageUrl} alt={imageAlt} />
							) : (
								<div style={{ background: '#eee', padding: '40px', textAlign: 'center' }}>
									画像を選択してください
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			leftItems,
			rightItems,
			imageUrl,
			imageAlt,
			bgColor,
			textColor,
			listFontSet,
			listFontWeight,
			listColumns,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `lw-pr-list-8 columns-${listColumns}`,
			style: {
				'--list_items_bg_color': bgColor,
				'--list_items_color': textColor,
			},
		});

		return (
			<div {...blockProps}>
				<div className="lw-pr-list-8_wrap">
					<div className="list_items">
						<div className="list_items_inner">
							<ul
								className="list_left"
								data-lw_font_set={listFontSet}
								style={{ fontWeight: listFontWeight }}
							>
								{leftItems.map((item, index) => (
									<li key={index}>
										<RichText.Content tagName="span" value={item} />
									</li>
								))}
							</ul>
							{listColumns === 2 && (
								<ul
									className="list_right"
									data-lw_font_set={listFontSet}
									style={{ fontWeight: listFontWeight }}
								>
									{rightItems.map((item, index) => (
										<li key={index}>
											<RichText.Content tagName="span" value={item} />
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
					<div className="image">
						{imageUrl && (
							<img loading="lazy" src={imageUrl} alt={imageAlt} />
						)}
					</div>
				</div>
			</div>
		);
	},
};

registerBlockType( metadata.name, lwBlockDef );
