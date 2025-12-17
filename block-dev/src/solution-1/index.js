/**
 * LiteWord – solution 01（ボーダーカラー反映版）
 * ------------------------------------------------------------
 * 変更点
 * 1) <figure> に style={{ borderColor: content.borderColor }} を追加
 * 2) ボーダー太さ・スタイルが無いと色が見えないので、
 *    デフォルト CSS が無い場合に備え border:"4px solid" を指定
 * ---------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl, ColorPalette } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ==== オプション配列 ===================================== */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ==== ブロック登録 ======================================= */
registerBlockType( metadata.name, {
	/* ===== エディター側 ================================== */
	edit: ( { attributes, setAttributes } ) => {
		const { contents, fontSet, fontWeight } = attributes;

		/* コンテンツ追加 */
		const addContent = () => {
			setAttributes( {
				contents: [
					...contents,
					{ text: '新しいテキスト', image: '', borderColor: 'var(--color-main)' },
				],
			} );
		};

		/* コンテンツ削除 */
		const removeContent = ( index ) => {
			setAttributes( { contents: contents.filter( ( _, i ) => i !== index ) } );
		};

		/* コンテンツ更新 */
		const updateContent = ( index, key, value ) => {
			const newContents       = [ ...contents ];
			newContents[ index ][ key ] = value;
			setAttributes( { contents: newContents } );
		};

		const blockProps = useBlockProps({
			className: 'solution-1',
			'data-lw_font_set': fontSet
		});

		return (
			<div {...blockProps}>
				{/* === サイドバー === */}
				<InspectorControls>
					<PanelBody title="全体のフォント設定">
						<SelectControl
							label="フォントの種類"
							value={ fontSet }
							options={ fontOptions }
							onChange={ ( value ) => setAttributes( { fontSet: value } ) }
						/>
						<SelectControl
							label="フォントの太さ"
							value={ fontWeight }
							options={ fontWeightOptions }
							onChange={ ( value ) => setAttributes( { fontWeight: value } ) }
						/>
					</PanelBody>

					{/* 各コンテンツ設定 */}
					{ contents.map( ( content, index ) => (
						<PanelBody
							title={ `コンテンツ ${ index + 1 }` }
							key={ index }
							initialOpen={ false }
						>
							{/* 画像プレビュー */}
							{ content.image && (
								<img
									src={ content.image }
									alt=""
									style={ {
										width       : '100%',
										height      : 'auto',
										borderRadius: '5px',
										boxShadow   : '0 2px 4px rgba(0,0,0,0.1)',
										marginBottom: '10px',
									} }
								/>
							) }

							{/* 画像選択 */}
							<MediaUpload
								onSelect={ ( media ) => updateContent( index, 'image', media.url ) }
								allowedTypes={ [ 'image' ] }
								value={ content.image }
								render={ ( { open } ) => (
									<Button onClick={ open } isSecondary style={ { marginBottom: '10px' } }>
										画像を選択
									</Button>
								) }
							/>

							{/* ボーダーカラー */}
							<div style={ { marginBottom: '10px' } }>
								<p>ボーダーの色</p>
								<ColorPalette
									value={ content.borderColor }
									onChange={ ( color ) => updateContent( index, 'borderColor', color ) }
								/>
							</div>

							{/* 削除ボタン */}
							<Button isDestructive onClick={ () => removeContent( index ) }>
								このコンテンツを削除
							</Button>
						</PanelBody>
					) ) }

					{/* 追加ボタン */}
					<Button isPrimary onClick={ addContent } style={ { margin: '20px 0' } }>
						コンテンツを追加
					</Button>
				</InspectorControls>

				{/* === ブロックプレビュー === */}
				<div className="solution-1_inner">
					{ contents.map( ( content, index ) => (
						<div className="solution-1_content" key={ index }>
							<figure
								data-border-color={ content.borderColor }
								style={ {
									border      : '2px solid',
									borderColor : content.borderColor || 'transparent',
								} }
							>
								<img
									src={
										content.image ||
										'https://placehold.jp/cccccc/ffffff/400x400.png?text=IMAGE'
									}
									alt=""
								/>
							</figure>
							<div className="solution-1_text">
								<RichText
									tagName="p"
									value={ content.text }
									onChange={ ( value ) => updateContent( index, 'text', value ) }
									placeholder="テキストを入力"
									style={ { fontWeight: fontWeight } }
								/>
							</div>
						</div>
					) ) }
				</div>
			</div>
		);
	},

	/* ===== フロントエンド出力 ============================== */
	save: ( { attributes } ) => {
		const { contents, fontSet, fontWeight } = attributes;

		const blockProps = useBlockProps.save({
			className: 'solution-1',
			'data-lw_font_set': fontSet
		});

		return (
			<div {...blockProps}>
				<div className="solution-1_inner">
					{ contents.map( ( content, index ) => (
						<div className="solution-1_content" key={ index }>
							<figure
								data-border-color={ content.borderColor }
								style={ {
									border      : '2px solid',
									borderColor : content.borderColor || 'transparent',
								} }
							>
								<img
									loading="lazy"
									src={
										content.image ||
										'https://placehold.jp/cccccc/ffffff/400x400.png?text=IMAGE'
									}
									alt=""
								/>
							</figure>
							<div className="solution-1_text">
								<RichText.Content
									tagName="p"
									value={ content.text }
									style={ {
										whiteSpace: 'pre-wrap',
										fontWeight: fontWeight,
									} }
								/>
							</div>
						</div>
					) ) }
				</div>
			</div>
		);
	},
} );
