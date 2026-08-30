import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	MediaUpload,
	useBlockProps,
	InnerBlocks,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	RangeControl,
} from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const lwBlockDef = {
	edit: ({ attributes, setAttributes }) => {
		const {
			imageUrl,
			imageAlt,
			maxWidth,
			bgColor,
			bdrPc,
			bdrSp,
			minHeight,
			borderWidth,
			borderColor,
		} = attributes;

		const blockProps = useBlockProps({
			className: 'lw-pr-content-8',
			style: {
				'--content-8-max-w': `${maxWidth}px`,
				'--content-8-bdr-pc': `${bdrPc}px`,
				'--content-8-bdr-sp': `${bdrSp}px`,
				'--content-8-min-h': `${minHeight}px`,
				background: bgColor,
				border: borderWidth ? `${borderWidth}px solid ${borderColor}` : undefined,
			},
		});

		return (
			<>
				<InspectorControls>
					{/* 画像設定 */}
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
					</PanelBody>

					{/* レイアウト設定 */}
					<PanelBody title="レイアウト設定">
						<RangeControl
							label="最大幅 (px)"
							value={maxWidth}
							onChange={(v) => setAttributes({ maxWidth: v })}
							min={600}
							max={1600}
							step={8}
						/>
						<RangeControl
							label="角丸 PC (px)"
							value={bdrPc}
							onChange={(v) => setAttributes({ bdrPc: v })}
							min={0}
							max={50}
							step={1}
						/>
						<RangeControl
							label="角丸 SP (px)"
							value={bdrSp}
							onChange={(v) => setAttributes({ bdrSp: v })}
							min={0}
							max={50}
							step={1}
						/>
						<RangeControl
							label="最小の高さ (px)"
							value={minHeight}
							onChange={(v) => setAttributes({ minHeight: v })}
							min={200}
							max={600}
							step={1}
						/>
					</PanelBody>

					{/* 枠線設定 */}
					<PanelBody title="枠線設定" initialOpen={false}>
						<RangeControl
							label="枠の太さ (px)"
							value={borderWidth}
							onChange={(v) => setAttributes({ borderWidth: v })}
							min={0}
							max={10}
							step={1}
						/>
						{borderWidth > 0 && (
							<>
								<p style={{ marginBottom: '8px' }}>枠の色</p>
								<ColorPalette
									value={borderColor}
									onChange={(color) => setAttributes({ borderColor: color || 'var(--color-main)' })}
								/>
							</>
						)}
					</PanelBody>

					{/* 色設定 */}
					<PanelBody title="背景設定">
						<ColorPalette
							value={bgColor}
							onChange={(color) => setAttributes({ bgColor: color || '#f5f5f5' })}
						/>
					</PanelBody>
				</InspectorControls>

				{/* エディタープレビュー */}
				<div {...blockProps}>
					<div className="image">
						{imageUrl ? (
							<img src={imageUrl} alt={imageAlt} />
						) : (
							<div style={{ background: '#ddd', padding: '40px', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								画像を選択
							</div>
						)}
					</div>
					<div className="content_in">
						<InnerBlocks />
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			imageUrl,
			imageAlt,
			maxWidth,
			bgColor,
			bdrPc,
			bdrSp,
			minHeight,
			borderWidth,
			borderColor,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: 'lw-pr-content-8',
			style: {
				'--content-8-max-w': `${maxWidth}px`,
				'--content-8-bdr-pc': `${bdrPc}px`,
				'--content-8-bdr-sp': `${bdrSp}px`,
				'--content-8-min-h': `${minHeight}px`,
				background: bgColor,
				border: borderWidth ? `${borderWidth}px solid ${borderColor}` : undefined,
			},
		});

		return (
			<div {...blockProps}>
				<div className="image">
					{imageUrl && (
						<img loading="lazy" src={imageUrl} alt={imageAlt} />
					)}
				</div>
				<div className="content_in">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

/* ------------------------------------------------------------------
 * #1169（2026-08-27）既定値の他社CDN直リンクを自社素材に差し替えた。
 * 既定値と同じ値はブロックコメントに書かれないので、既定値のまま使っている
 * 既存ページは「保存HTMLは旧URL／ブロックは新しい既定値」で食い違う。
 * 旧既定値を持った版を残して、開いて保存し直しても画像が入れ替わらないようにする。
 * 🚨 save は現行と同じ関数をそのまま渡す（マークアップは変えていない）。
 * ------------------------------------------------------------------ */
const LW_1169_OLD = JSON.parse( JSON.stringify( metadata.attributes ) );
LW_1169_OLD.imageUrl.default = "https://placehold.co/400x400";

/* 🚨 すでにある deprecated は attributes: metadata.attributes を使っている＝新しい既定値を指す。
 *    そのままだと「古い save ＋ 古い既定値」で保存されたページ（サンプル画像のまま使っている人の
 *    大多数がこれ）がどの版にも当たらなくなる。だから既存の版それぞれについて
 *    旧既定値を持たせた双子を作って先に並べる。元の版も残す（画像を自分で差し替えた人向け）。 */
const lwPrev1169 = lwBlockDef.deprecated || [];
lwBlockDef.deprecated = [
	{ attributes: LW_1169_OLD, save: lwBlockDef.save },
	...lwPrev1169.map( ( d ) => ( { ...d, attributes: LW_1169_OLD } ) ),
	...lwPrev1169,
];

registerBlockType( metadata.name, lwBlockDef );
