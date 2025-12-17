/* ----------------------------------------------------------
   LiteWord – FV 08 ブロック（wdl/paid-block-fv-8）
   2025-04-19 改訂: メインタイトル改行 ON/OFF 機能を追加
   2025-04-25 追記 : ポイント表示 ON/OFF 機能を追加（showPoint）
---------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
	/* ====================================================== */
	edit: ( props ) => {
		const { attributes, setAttributes } = props;
		const {
			backgroundImagePc, backgroundImageSp,
			mainTitle, subTitle, leadText,
			listItem_1, listItem_2, listItem_3,
			PointText_1, PointText_2, PointText_3,
			bottomText, noLineBreakMain, showPoint
		} = attributes;

		const blockProps = useBlockProps({
			className: 'paid-block-fv-8'
		});

		/* ---------- ハンドラ ---------- */
		const onChangeBackgroundImagePc = ( media ) => setAttributes({ backgroundImagePc: media.url });
		const onChangeBackgroundImageSp = ( media ) => setAttributes({ backgroundImageSp: media.url });

		return (
			<>
				<InspectorControls>
					{/* ========= マニュアル ========= */}
					<PanelBody title="マニュアル">
						<Button variant="secondary" href="https://youtu.be/vtKRJmt2y6E?si=3OGelL70znRo3_t_" target="_blank">
							このブロックの使い方はこちら
						</Button>
					</PanelBody>

					{/* ========= 背景画像 (PC) ========= */}
					<PanelBody title="背景画像設定 (PC)">
						<MediaUpload
							allowedTypes={['image']}
							onSelect={onChangeBackgroundImagePc}
							value={backgroundImagePc}
							render={({ open }) => (
								<>
									{backgroundImagePc && <img src={backgroundImagePc} alt="PC用背景画像" style={{ width: '100%' }} />}
									<br /><br />
									<Button onClick={open} variant="secondary">PC用画像を選択</Button>
									<Button onClick={() => setAttributes({ backgroundImagePc: '' })} variant="secondary" style={{ marginLeft: '10px' }}>削除</Button>
								</>
							)}
						/>
					</PanelBody>

					{/* ========= 背景画像 (SP) ========= */}
					<PanelBody title="背景画像設定 (スマホ)">
						<MediaUpload
							allowedTypes={['image']}
							onSelect={onChangeBackgroundImageSp}
							value={backgroundImageSp}
							render={({ open }) => (
								<>
									{backgroundImageSp && <img src={backgroundImageSp} alt="スマホ用背景画像" style={{ width: '100%' }} />}
									<br /><br />
									<Button onClick={open} variant="secondary">スマホ用画像を選択</Button>
									<Button onClick={() => setAttributes({ backgroundImageSp: '' })} variant="secondary" style={{ marginLeft: '10px' }}>削除</Button>
								</>
							)}
						/>
					</PanelBody>

					{/* ========= 文字設定 ========= */}
					<PanelBody title="文字設定">
						<ToggleControl
							label="メインテキストを改行させない"
							checked={noLineBreakMain}
							onChange={() => setAttributes({ noLineBreakMain: !noLineBreakMain })}
						/>
					</PanelBody>

					{/* ========= ポイント表示設定 ========= */}
					<PanelBody title="ポイント表示">
						<ToggleControl
							label="ポイント (.point) を表示する"
							checked={showPoint}
							onChange={() => setAttributes({ showPoint: !showPoint })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* ================== ビジュアル ================== */}
				<div {...blockProps}>
					<div className="paid-block-fv-8_inner" data-lw_font_set="Noto Sans JP">
						<div className="text_in">
							<h2 className="ttl">
								<RichText
									tagName="span"
									className="sub"
									value={subTitle}
									onChange={(v) => setAttributes({ subTitle: v })}
									placeholder="サブタイトル"
								/>
								<RichText
									tagName="span"
									className={`main${noLineBreakMain ? ' lw_in_text_split' : ''}`}
									value={mainTitle}
									onChange={(v) => setAttributes({ mainTitle: v })}
									placeholder="メインタイトル"
								/>
							</h2>

							<RichText
								tagName="p"
								className="lead"
								value={leadText}
								onChange={(v) => setAttributes({ leadText: v })}
								placeholder="リードテキスト"
							/>

							<div className="btm_text pc">
								<ul className="list">
									<li><RichText tagName="span" value={listItem_1.replace(/\n/g, '<br />')} onChange={(v) => setAttributes({ listItem_1: v.replace(/<br \/>/g, '\n') })} /></li>
									<li><RichText tagName="span" value={listItem_2.replace(/\n/g, '<br />')} onChange={(v) => setAttributes({ listItem_2: v.replace(/<br \/>/g, '\n') })} /></li>
									<li><RichText tagName="span" value={listItem_3.replace(/\n/g, '<br />')} onChange={(v) => setAttributes({ listItem_3: v.replace(/<br \/>/g, '\n') })} /></li>
								</ul>
								<RichText tagName="p" value={bottomText} onChange={(v) => setAttributes({ bottomText: v })} placeholder="ボトムテキスト" />
							</div>
						</div>

						{/* ---------- 画像 & 星評価 ---------- */}
						<div className="image">
							<picture>
								{backgroundImageSp && <source srcSet={backgroundImageSp} media="(max-width: 768px)" />}
								{backgroundImagePc && <img src={backgroundImagePc} alt="背景画像" />}
							</picture>

							{/* ---------- ポイント ---------- */}
							{showPoint && (
								<div className="point">
									<svg className="star" xmlns="http://www.w3.org/2000/svg" width="30.468" height="23.697" viewBox="0 0 30.468 23.697">
										<path id="crown-solid" d="M16.345,35.914a2.116,2.116,0,1,0-2.222,0l-3.031,6.062a1.694,1.694,0,0,1-2.571.566L3.808,38.771a2.116,2.116,0,1,0-1.693.846h.037l2.417,13.3A3.387,3.387,0,0,0,7.9,55.7H22.565A3.39,3.39,0,0,0,25.9,52.915l2.417-13.3h.037a2.116,2.116,0,1,0-1.693-.846l-4.713,3.771a1.694,1.694,0,0,1-2.571-.566Z" transform="translate(0 -32)" fill="#f39b1b" />
									</svg>

									<p>
										<RichText tagName="span" value={PointText_1} onChange={(v) => setAttributes({ PointText_1: v })} placeholder="テキスト" />
										<span>
											<RichText tagName="b" value={PointText_2} onChange={(v) => setAttributes({ PointText_2: v })} placeholder="70" />
											<RichText tagName="span" value={PointText_3} onChange={(v) => setAttributes({ PointText_3: v })} placeholder="%" />
										</span>
									</p>

									<div className="btm">
										{[...Array(3)].map((_, i) => (
											<svg key={i} xmlns="http://www.w3.org/2000/svg" width="13.673" height="13.259" viewBox="0 0 13.673 13.259">
												<path id="star-solid" d="M31.724.466a.83.83,0,0,0-1.491,0L28.568,3.892l-3.718.549a.829.829,0,0,0-.461,1.409l2.7,2.67-.637,3.773a.831.831,0,0,0,1.209.87l3.322-1.774L34.3,13.162a.831.831,0,0,0,1.209-.87l-.64-3.773,2.7-2.67a.829.829,0,0,0-.461-1.409l-3.721-.549Z" transform="translate(-24.144)" fill="#f39b1b" />
											</svg>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* ---------- SP用 テキスト ---------- */}
					<div className="btm_text sp">
						<ul className="list">
							<li><RichText tagName="span" value={listItem_1.replace(/\n/g, '<br />')} onChange={(v) => setAttributes({ listItem_1: v.replace(/<br \/>/g, '\n') })} /></li>
							<li><RichText tagName="span" value={listItem_2.replace(/\n/g, '<br />')} onChange={(v) => setAttributes({ listItem_2: v.replace(/<br \/>/g, '\n') })} /></li>
							<li><RichText tagName="span" value={listItem_3.replace(/\n/g, '<br />')} onChange={(v) => setAttributes({ listItem_3: v.replace(/<br \/>/g, '\n') })} /></li>
						</ul>
						<RichText
							tagName="p"
							value={bottomText}
							onChange={(v) => setAttributes({ bottomText: v })}
							placeholder="ボトムテキスト"
						/>
					</div>
				</div>
			</>
		);
	},

	/* ====================================================== */
	save: ( props ) => {
		const {
			backgroundImagePc, backgroundImageSp,
			mainTitle, subTitle, leadText,
			listItem_1, listItem_2, listItem_3,
			PointText_1, PointText_2, PointText_3,
			bottomText, noLineBreakMain, showPoint
		} = props.attributes;

		const blockProps = useBlockProps.save({
			className: 'paid-block-fv-8'
		});

		return (
			<div {...blockProps}>
				<div className="paid-block-fv-8_inner" data-lw_font_set="Noto Sans JP">
					<div className="text_in">
						<h2 className="ttl">
							<RichText.Content tagName="span" className="sub" value={subTitle} />
							<RichText.Content tagName="span" className={`main${noLineBreakMain ? ' lw_in_text_split' : ''}`} value={mainTitle} />
						</h2>
						<RichText.Content tagName="p" className="lead" value={leadText} />

						<div className="btm_text pc">
							<ul className="list">
								<li><RichText.Content tagName="span" value={listItem_1.replace(/\n/g, '<br />')} /></li>
								<li><RichText.Content tagName="span" value={listItem_2.replace(/\n/g, '<br />')} /></li>
								<li><RichText.Content tagName="span" value={listItem_3.replace(/\n/g, '<br />')} /></li>
							</ul>
							<RichText.Content tagName="p" value={bottomText} />
						</div>
					</div>

					<div className="image">
						<picture>
							{ backgroundImageSp && (
								<source srcSet={backgroundImageSp} media="(max-width: 768px)" />
							)}
							{ backgroundImagePc && (
								<img
									src={backgroundImagePc}
									alt="背景画像"
									loading="eager"
									fetchpriority="high"
								/>
							)}
						</picture>


						{showPoint && (
							<div className="point">
								<svg className="star" xmlns="http://www.w3.org/2000/svg" width="30.468" height="23.697" viewBox="0 0 30.468 23.697">
									<path id="crown-solid" d="M16.345,35.914a2.116,2.116,0,1,0-2.222,0l-3.031,6.062a1.694,1.694,0,0,1-2.571.566L3.808,38.771a2.116,2.116,0,1,0-1.693.846h.037l2.417,13.3A3.387,3.387,0,0,0,7.9,55.7H22.565A3.39,3.39,0,0,0,25.9,52.915l2.417-13.3h.037a2.116,2.116,0,1,0-1.693-.846l-4.713,3.771a1.694,1.694,0,0,1-2.571-.566Z" transform="translate(0 -32)" fill="#f39b1b" />
								</svg>

								<p>
									<RichText.Content tagName="span" value={PointText_1} />
									<span>
										<RichText.Content tagName="b" value={PointText_2} />
										<RichText.Content tagName="span" value={PointText_3} />
									</span>
								</p>

								<div className="btm">
									{[...Array(3)].map((_, i) => (
										<svg key={i} xmlns="http://www.w3.org/2000/svg" width="13.673" height="13.259" viewBox="0 0 13.673 13.259">
											<path id="star-solid" d="M31.724.466a.83.83,0,0,0-1.491,0L28.568,3.892l-3.718.549a.829.829,0,0,0-.461,1.409l2.7,2.67-.637,3.773a.831.831,0,0,0,1.209.87l3.322-1.774L34.3,13.162a.831.831,0,0,0,1.209-.87l-.64-3.773,2.7-2.67a.829.829,0,0,0-.461-1.409l-3.721-.549Z" transform="translate(-24.144)" fill="#f39b1b" />
										</svg>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="btm_text sp">
					<ul className="list">
						<li><RichText.Content tagName="span" value={listItem_1.replace(/\n/g, '<br />')} /></li>
						<li><RichText.Content tagName="span" value={listItem_2.replace(/\n/g, '<br />')} /></li>
						<li><RichText.Content tagName="span" value={listItem_3.replace(/\n/g, '<br />')} /></li>
					</ul>
					<RichText.Content tagName="p" value={bottomText} />
				</div>
			</div>
		);
	},
});
