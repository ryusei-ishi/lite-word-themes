import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	MediaUpload,
	InspectorControls,
	ColorPalette,
	useBlockProps
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	Button,
	ToggleControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import {
	fontOptionsArr,
	fontWeightOptionsArr,
} from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ─────────────────────────  定数  ───────────────────────── */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const colOptions = [
	{ label: '1カラム', value: 'clm_1' },
	{ label: '2カラム', value: 'clm_2' },
];

/* ─────────────────────────  ブロック登録  ───────────────────────── */
registerBlockType(metadata.name, {
	/* ────────────────────  エディタ側  ──────────────────── */
	edit( { attributes, setAttributes } ) {
		const {
			fontLi, fontWeightLi, fontSizePc, fontSizeSp, textColor,
			colorLiSvg, iconUrl, iconSize,
			bgColor, colClass,
			columnWidths,
			columnWidthsSp,
			innerRowGapPc,
			innerColumnGapPc,
			innerRowGapSp,
			innerColumnGapSp,
			rowGapPc,
			columnGapPc,
			rowGapSp,
			columnGapSp,
			listGroups,
		} = attributes;

		/* カラム幅からgrid-template-columnsを生成 */
		const gtcPc = columnWidths.map(w => `${w}fr`).join(' ');
		const gtcSp = columnWidthsSp.length > 0
			? columnWidthsSp.map(w => `${w}fr`).join(' ')
			: gtcPc;

		const blockProps = useBlockProps({
			className: 'lw-pr-list-7',
			style: {
				'--list-7-gtc-pc': gtcPc,
				'--list-7-gtc-sp': gtcSp,
				'--list-7-inner-row-gap-pc': `${innerRowGapPc}px`,
				'--list-7-inner-column-gap-pc': `${innerColumnGapPc}px`,
				'--list-7-inner-row-gap-sp': `${innerRowGapSp >= 0 ? innerRowGapSp : innerRowGapPc}px`,
				'--list-7-inner-column-gap-sp': `${innerColumnGapSp >= 0 ? innerColumnGapSp : innerColumnGapPc}px`,
				'--list-7-row-gap-pc': `${rowGapPc}px`,
				'--list-7-column-gap-pc': `${columnGapPc}px`,
				'--list-7-row-gap-sp': `${rowGapSp >= 0 ? rowGapSp : rowGapPc}px`,
				'--list-7-column-gap-sp': `${columnGapSp >= 0 ? columnGapSp : columnGapPc}px`,
				'--list-7-font-size-pc': `${fontSizePc}px`,
				'--list-7-font-size-sp': `${fontSizeSp >= 0 ? fontSizeSp : fontSizePc}px`,
			},
		});

		/* グループ操作 */
		const addGroup = () => {
			const newGroups = [...listGroups, { contents: [{ text: '新しいテキスト' }] }];
			setAttributes({ listGroups: newGroups });
		};
		const removeGroup = (groupIndex) => {
			if (listGroups.length <= 1) return;
			const newGroups = listGroups.filter((_, idx) => idx !== groupIndex);
			setAttributes({ listGroups: newGroups });
		};

		/* カラム数変更 (PC) */
		const changeColumnCount = (newCount) => {
			const currentCount = columnWidths.length;
			let newWidths;
			if (newCount > currentCount) {
				newWidths = [...columnWidths, ...Array(newCount - currentCount).fill(1)];
			} else {
				newWidths = columnWidths.slice(0, newCount);
			}
			setAttributes({ columnWidths: newWidths });
		};

		/* カラム数変更 (SP) */
		const changeColumnCountSp = (newCount) => {
			if (newCount === 0) {
				// 0 = PCを継承
				setAttributes({ columnWidthsSp: [] });
				return;
			}
			const currentCount = columnWidthsSp.length || columnWidths.length;
			let newWidths;
			if (columnWidthsSp.length === 0) {
				// PCから初期値をコピー
				newWidths = columnWidths.slice(0, newCount);
				if (newCount > columnWidths.length) {
					newWidths = [...newWidths, ...Array(newCount - columnWidths.length).fill(1)];
				}
			} else if (newCount > currentCount) {
				newWidths = [...columnWidthsSp, ...Array(newCount - currentCount).fill(1)];
			} else {
				newWidths = columnWidthsSp.slice(0, newCount);
			}
			setAttributes({ columnWidthsSp: newWidths });
		};

		/* 行操作（グループ内） */
		const addContent = (groupIndex) => {
			const newGroups = [...listGroups];
			newGroups[groupIndex] = {
				...newGroups[groupIndex],
				contents: [...newGroups[groupIndex].contents, { text: '新しいテキスト' }]
			};
			setAttributes({ listGroups: newGroups });
		};
		const removeContent = (groupIndex, itemIndex) => {
			const newGroups = [...listGroups];
			newGroups[groupIndex] = {
				...newGroups[groupIndex],
				contents: newGroups[groupIndex].contents.filter((_, idx) => idx !== itemIndex)
			};
			setAttributes({ listGroups: newGroups });
		};
		const updateContent = (groupIndex, itemIndex, key, val) => {
			const newGroups = [...listGroups];
			const newContents = [...newGroups[groupIndex].contents];
			newContents[itemIndex] = { ...newContents[itemIndex], [key]: val };
			newGroups[groupIndex] = { ...newGroups[groupIndex], contents: newContents };
			setAttributes({ listGroups: newGroups });
		};

		/* 順番入れ替え関数（グループ内） */
		const moveItem = (groupIndex, itemIndex, direction) => {
			const contents = listGroups[groupIndex].contents;
			const targetIndex = itemIndex + direction;
			if (targetIndex < 0 || targetIndex >= contents.length) return;

			const newGroups = [...listGroups];
			const reordered = [...contents];
			const [moved] = reordered.splice(itemIndex, 1);
			reordered.splice(targetIndex, 0, moved);
			newGroups[groupIndex] = { ...newGroups[groupIndex], contents: reordered };
			setAttributes({ listGroups: newGroups });
		};

		/* スタイルオブジェクト */
		const innerStyle = {
			backgroundColor: bgColor || undefined,
		};
		const iconSpanStyle = { width: `${ iconSize }em` };
		const textSpanStyle = { width: `calc(100% - ${ iconSize }em)` };
		const textStyle     = {
			color: textColor || undefined,
			fontWeight: fontWeightLi || undefined,
		};

		/* SVG コード（colorLiSvg を直接適用） */
		const SvgIcon = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 448 512"
				style={ { fill: colorLiSvg } }
			>
				<path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
			</svg>
		);

		return (
			<>
				<InspectorControls>

					{/* ─ 外側（カラム）設定 ─ */}
					<PanelBody title="外側（カラム）設定" initialOpen={ false }>
						<Heading level={4} style={{ marginBottom: "8px" }}>PC設定</Heading>
						<RangeControl
							label="カラム数"
							value={columnWidths.length}
							onChange={changeColumnCount}
							min={1}
							max={6}
							step={1}
						/>
						{columnWidths.map((width, index) => (
							<RangeControl
								key={`pc-${index}`}
								label={`${index + 1}列目の幅 (fr)`}
								value={width}
								onChange={(v) => {
									const newWidths = [...columnWidths];
									newWidths[index] = v;
									setAttributes({ columnWidths: newWidths });
								}}
								min={1}
								max={12}
								step={1}
							/>
						))}
						<RangeControl
							label="行間隔 (px)"
							value={innerRowGapPc}
							onChange={(v) => setAttributes({ innerRowGapPc: v })}
							min={0}
							max={64}
							step={4}
						/>
						<RangeControl
							label="列間隔 (px)"
							value={innerColumnGapPc}
							onChange={(v) => setAttributes({ innerColumnGapPc: v })}
							min={0}
							max={64}
							step={4}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>SP設定 (0でPC継承)</Heading>
						<RangeControl
							label="カラム数"
							value={columnWidthsSp.length}
							onChange={changeColumnCountSp}
							min={0}
							max={6}
							step={1}
						/>
						{columnWidthsSp.length > 0 && columnWidthsSp.map((width, index) => (
							<RangeControl
								key={`sp-${index}`}
								label={`${index + 1}列目の幅 (fr)`}
								value={width}
								onChange={(v) => {
									const newWidths = [...columnWidthsSp];
									newWidths[index] = v;
									setAttributes({ columnWidthsSp: newWidths });
								}}
								min={1}
								max={12}
								step={1}
							/>
						))}
						<RangeControl
							label="行間隔 (px) (-1でPC継承)"
							value={innerRowGapSp}
							onChange={(v) => setAttributes({ innerRowGapSp: v })}
							min={-1}
							max={64}
							step={4}
						/>
						<RangeControl
							label="列間隔 (px) (-1でPC継承)"
							value={innerColumnGapSp}
							onChange={(v) => setAttributes({ innerColumnGapSp: v })}
							min={-1}
							max={64}
							step={4}
						/>
					</PanelBody>

					{/* ─ 内側（リスト）設定 ─ */}
					<PanelBody title="内側（リスト）設定" initialOpen={ false }>
						<SelectControl
							label="リスト内カラム数"
							value={ colClass }
							options={ colOptions }
							onChange={ ( v ) => setAttributes( { colClass: v } ) }
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>間隔 PC</Heading>
						<RangeControl
							label="行間隔 (px)"
							value={rowGapPc}
							onChange={(v) => setAttributes({ rowGapPc: v })}
							min={0}
							max={64}
							step={4}
						/>
						<RangeControl
							label="列間隔 (px)"
							value={columnGapPc}
							onChange={(v) => setAttributes({ columnGapPc: v })}
							min={0}
							max={64}
							step={4}
						/>
						<hr style={{ margin: "16px 0" }} />
						<Heading level={4} style={{ marginBottom: "8px" }}>間隔 SP (-1でPC継承)</Heading>
						<RangeControl
							label="行間隔 (px)"
							value={rowGapSp}
							onChange={(v) => setAttributes({ rowGapSp: v })}
							min={-1}
							max={64}
							step={4}
						/>
						<RangeControl
							label="列間隔 (px)"
							value={columnGapSp}
							onChange={(v) => setAttributes({ columnGapSp: v })}
							min={-1}
							max={64}
							step={4}
						/>
						<hr style={{ margin: "16px 0" }} />
						<p style={{ marginBottom: "8px" }}>背景色</p>
						<ColorPalette
							value={ bgColor }
							onChange={ ( c ) => setAttributes( { bgColor: c } ) }
						/>
					</PanelBody>

					{/* ─ アイコン設定 ─ */}
					<PanelBody title="アイコン設定" initialOpen={ false }>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { iconUrl: media.url } ) }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div>
									<Button className="components-button is-primary" onClick={ open }>
										{ iconUrl ? 'アイコンを変更' : 'アイコンをアップロード' }
									</Button>
									{ iconUrl && (
										<Button
											isLink
											isDestructive
											onClick={ () => setAttributes( { iconUrl: '' } ) }
											style={ { marginLeft: '8px' } }
										>
											削除
										</Button>
									) }
								</div>
							) }
						/>
						{ iconUrl && (
							<p style={ { marginTop: '12px' } }>
								<img src={ iconUrl } style={ { maxWidth: '100%' } } />
							</p>
						) }
						<hr style={{ margin: "16px 0" }} />
						<RangeControl
							label="アイコン幅 (em)"
							value={ iconSize }
							onChange={ ( v ) => setAttributes( { iconSize: v } ) }
							min={ 0.5 }
							max={ 5 }
							step={ 0.1 }
						/>
						{ !iconUrl && (
							<>
								<p style={{ marginBottom: "8px" }}>アイコン色 (SVG用)</p>
								<ColorPalette
									value={ colorLiSvg }
									onChange={ ( c ) => setAttributes( { colorLiSvg: c } ) }
								/>
							</>
						) }
					</PanelBody>

					{/* ─ テキスト設定 ─ */}
					<PanelBody title="テキスト設定" initialOpen={ false }>
						<Heading level={4} style={{ marginBottom: "8px" }}>文字サイズ</Heading>
						<RangeControl
							label="PC (px)"
							value={fontSizePc}
							onChange={(v) => setAttributes({ fontSizePc: v })}
							min={10}
							max={48}
							step={1}
						/>
						<RangeControl
							label="SP (px) (-1でPC継承)"
							value={fontSizeSp}
							onChange={(v) => setAttributes({ fontSizeSp: v })}
							min={-1}
							max={48}
							step={1}
						/>
						<hr style={{ margin: "16px 0" }} />
						<SelectControl
							label="フォントの種類"
							value={ fontLi }
							options={ fontOptions }
							onChange={ ( v ) => setAttributes( { fontLi: v } ) }
						/>
						<SelectControl
							label="フォントの太さ"
							value={ fontWeightLi }
							options={ fontWeightOptions }
							onChange={ ( v ) => setAttributes( { fontWeightLi: v } ) }
						/>
						<hr style={{ margin: "16px 0" }} />
						<p style={{ marginBottom: "8px" }}>文字色</p>
						<ColorPalette
							value={ textColor }
							onChange={ ( c ) => setAttributes( { textColor: c } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{/* ─ プレビュー ─ */}
				<div {...blockProps}>
					<div className="custom_inner">
						{listGroups.map((group, groupIndex) => (
							<div className="lw-pr-list-7__group" key={groupIndex}>
								<ul
									className={ `lw-pr-list-7__inner ${ colClass }` }
									style={ innerStyle }
								>
									{ group.contents.map( ( content, itemIndex ) => (
										<li className="lw-pr-list-7__li" key={ itemIndex } style={ { position: 'relative' } }>
											<span className="icon" style={ iconSpanStyle }>
												{ iconUrl ? <img src={ iconUrl } /> : SvgIcon }
											</span>

											<span className="lw-pr-list-7__text">
												<RichText
													tagName="p"
													value={ content.text }
													data-lw_font_set={ fontLi }
													onChange={ ( v ) => updateContent( groupIndex, itemIndex, 'text', v ) }
													placeholder="テキストを入力"
													style={ { ...textStyle, ...textSpanStyle } }
												/>
											</span>

											{/* 並べ替え & 削除コントロール */}
											<div className="lw-table-item-controls">
												<button
													type="button"
													onClick={() => moveItem(groupIndex, itemIndex, -1)}
													disabled={itemIndex === 0}
													className="move-up-button"
													aria-label="上へ移動"
												>
													↑
												</button>
												<button
													type="button"
													onClick={() => moveItem(groupIndex, itemIndex, 1)}
													disabled={itemIndex === group.contents.length - 1}
													className="move-down-button"
													aria-label="下へ移動"
												>
													↓
												</button>
												<button
													type="button"
													className="remove-item-button"
													onClick={ () => removeContent( groupIndex, itemIndex ) }
													aria-label="削除"
												>
													削除
												</button>
											</div>
										</li>
									) ) }
								</ul>
								<div className="lw-pr-list-7__group-controls">
									<button className="lw-pr-list-7__add_btn" onClick={ () => addContent(groupIndex) }>
										リストを追加
									</button>
									{listGroups.length > 1 && (
										<button className="lw-pr-list-7__remove_group_btn" onClick={ () => removeGroup(groupIndex) }>
											グループ削除
										</button>
									)}
								</div>
							</div>
						))}
					</div>

					<button className="lw-pr-list-7__add_group_btn" onClick={ addGroup }>
						グループを追加する
					</button>
				</div>
			</>
		);
	},

	/* ────────────────────  保存  ──────────────────── */
	save( { attributes } ) {
		const {
			fontLi, fontWeightLi, fontSizePc, fontSizeSp, textColor,
			colorLiSvg, iconUrl, iconSize,
			bgColor, colClass,
			columnWidths,
			columnWidthsSp,
			innerRowGapPc,
			innerColumnGapPc,
			innerRowGapSp,
			innerColumnGapSp,
			rowGapPc,
			columnGapPc,
			rowGapSp,
			columnGapSp,
			listGroups,
		} = attributes;

		/* カラム幅からgrid-template-columnsを生成 */
		const gtcPc = columnWidths.map(w => `${w}fr`).join(' ');
		const gtcSp = columnWidthsSp.length > 0
			? columnWidthsSp.map(w => `${w}fr`).join(' ')
			: gtcPc;

		const blockProps = useBlockProps.save({
			className: 'lw-pr-list-7',
			style: {
				'--list-7-gtc-pc': gtcPc,
				'--list-7-gtc-sp': gtcSp,
				'--list-7-inner-row-gap-pc': `${innerRowGapPc}px`,
				'--list-7-inner-column-gap-pc': `${innerColumnGapPc}px`,
				'--list-7-inner-row-gap-sp': `${innerRowGapSp >= 0 ? innerRowGapSp : innerRowGapPc}px`,
				'--list-7-inner-column-gap-sp': `${innerColumnGapSp >= 0 ? innerColumnGapSp : innerColumnGapPc}px`,
				'--list-7-row-gap-pc': `${rowGapPc}px`,
				'--list-7-column-gap-pc': `${columnGapPc}px`,
				'--list-7-row-gap-sp': `${rowGapSp >= 0 ? rowGapSp : rowGapPc}px`,
				'--list-7-column-gap-sp': `${columnGapSp >= 0 ? columnGapSp : columnGapPc}px`,
				'--list-7-font-size-pc': `${fontSizePc}px`,
				'--list-7-font-size-sp': `${fontSizeSp >= 0 ? fontSizeSp : fontSizePc}px`,
			},
		});

		const innerStyle = {
			backgroundColor: bgColor || undefined,
		};
		const iconSpanStyle = { width: `${ iconSize }em` };
		const textSpanStyle = { width: `calc(100% - ${ iconSize }em)` };
		const textStyle     = {
			color: textColor || undefined,
			fontWeight: fontWeightLi || undefined,
		};

		const SvgIconSave = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 448 512"
				style={ { fill: colorLiSvg } }
			>
				<path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
			</svg>
		);

		return (
			<div {...blockProps}>
				<div className="custom_inner">
					{listGroups.map((group, groupIndex) => (
						<ul
							key={groupIndex}
							className={ `lw-pr-list-7__inner ${ colClass }` }
							style={ innerStyle }
						>
							{ group.contents.map( ( content, itemIndex ) => (
								<li className="lw-pr-list-7__li" key={ itemIndex }>
									<span className="icon" style={ iconSpanStyle }>
										{ iconUrl ? <img src={ iconUrl } /> : SvgIconSave }
									</span>

									<span className="lw-pr-list-7__text">
										<RichText.Content
											tagName="p"
											value={ content.text }
											data-lw_font_set={ fontLi }
											style={ { ...textStyle, ...textSpanStyle } }
										/>
									</span>
								</li>
							) ) }
						</ul>
					))}
				</div>
			</div>
		);
	},
} );
