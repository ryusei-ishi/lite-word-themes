/* ==========================================================================
   LiteWord – lw-my-parts-embed
   LWマイパーツ本文をショートコードで呼び出す静的ブロック
   ======================================================================= */
import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Spinner,
	ToolbarGroup,
	ToolbarButton,
	Button,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { RawHTML, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { external, seen, unseen } from '@wordpress/icons';
import metadata from './block.json';

/* -------------------------------------------------- *
 * ブロック登録
 * -------------------------------------------------- */
registerBlockType(metadata.name, {
	title      : __( 'マイパーツ', 'liteword' ),
	icon       : 'media-document',
	category   : 'lw-utility',

	/* ==================================================
	 * 編集画面
	 * ================================================= */
	edit( { attributes, setAttributes } ) {
		const { partsId, partsCat, showPreview } = attributes;

		/* --- パーツカテゴリー（lw_parts_cat）一覧を取得 ---------- */
		const partsCats = useSelect(
			( select ) =>
				select( 'core' ).getEntityRecords(
					'taxonomy',
					'lw_parts_cat',
					{ per_page : -1, orderby : 'name', order : 'asc' },
				),
			[],
		);

		/* --- カテゴリー選択肢 ------------------------------- */
		const catOptions = partsCats
			? [
					{ label : '— カテゴリーを選択 —', value : 0 },
					...partsCats.map( ( t ) => ( {
						label : t.name,
						value : t.id,
					} ) ),
			  ]
			: [ { label : 'カテゴリーを読み込み中…', value : 0 } ];

		/* --- LWマイパーツ一覧（公開＋下書き）を取得 ---------- */
		const partsPosts = useSelect(
			( select ) => {
				const query = {
					per_page : -1,
					status   : [ 'publish', 'draft' ],
					order    : 'desc',
					orderby  : 'modified',
				};
				// カテゴリー選択時は絞り込み
				if ( partsCat ) {
					query.lw_parts_cat = partsCat;
				}
				return select( 'core' ).getEntityRecords(
					'postType',
					'lw_my_parts',
					query,
				);
			},
			[ partsCat ],
		);

		/* --- パーツ選択肢 ----------------------------------- */
		const partsOptions = partsPosts
			? [
					{ label : '— パーツを選択 —', value : 0 },
					...partsPosts.map( ( p ) => ( {
						label : `${ p.title.rendered || '(無題)' } (${ p.status })`,
						value : p.id,
					} ) ),
			  ]
			: [ { label : 'パーツを読み込み中…', value : 0 } ];

		/* --- 選択中パーツの詳細情報を取得 ---------------- */
		const selectedPart = partsPosts?.find( ( p ) => p.id === partsId );
		const selectedTitle = selectedPart ? selectedPart.title.rendered || '(無題)' : '';

		/* --- 編集画面URL（adminUrlを使用） ----------------------------------- */
		const editUrl = partsId 
			? `${ MyThemeSettings.adminUrl }post.php?post=${ partsId }&action=edit` 
			: '';

		/* --- ブロックラッパー props ------------------------ */
		const blockProps = useBlockProps( {
			className : 'lw-my-parts-embed-block',
		} );

		/* --- 選択解除 -------------------------------------- */
		const clearSelection = () =>
			setAttributes( { partsId : 0, partsCat : 0 } );

		/* --- プレビュー表示時にカスタムブロックのCSSを動的読み込み --- */
		useEffect( () => {
			if ( ! showPreview || ! selectedPart ) return;

			const editorMode = selectedPart.editor_mode || 'normal';
			if ( editorMode === 'code' ) return;

			const rawContent = selectedPart.content?.raw || '';
			const blockRegex = /<!-- wp:(wdl\/[a-z0-9-]+)/g;
			let match;

			while ( ( match = blockRegex.exec( rawContent ) ) !== null ) {
				const slug = match[ 1 ].replace( 'wdl/', '' );
				const baseUrl = `${ MyThemeSettings.themeUrl }/my-blocks/build/${ slug }`;

				[ 'style', 'editor' ].forEach( ( type ) => {
					const id = `wdl-preview-${ slug }-${ type }`;
					if ( document.getElementById( id ) ) return;

					const link = document.createElement( 'link' );
					link.id = id;
					link.rel = 'stylesheet';
					link.href = `${ baseUrl }/${ type }.css`;
					document.head.appendChild( link );

					// iframe エディタにも注入
					document.querySelectorAll( 'iframe[name="editor-canvas"]' ).forEach( ( iframe ) => {
						try {
							const doc = iframe.contentDocument;
							if ( doc && doc.head && ! doc.getElementById( id ) ) {
								const iLink = link.cloneNode();
								doc.head.appendChild( iLink );
							}
						} catch ( e ) {
							console.warn( '[lw-my-parts-embed] CSS injection failed:', slug, e.message );
						}
					} );
				} );
			}
		}, [ showPreview, selectedPart ] );

		/* --- プレビュー用のコンテンツを生成 ---------------- */
		const renderPreview = () => {
			if ( ! selectedPart ) {
				return null;
			}

			const editorMode = selectedPart.editor_mode || 'normal';
			const customHtml = selectedPart.custom_html || '';
			const customCss = selectedPart.custom_css || '';
			const postContent = selectedPart.content?.rendered || '';
			const previewHtml = selectedPart.preview_html || '';
			const fullWidth = selectedPart.full_width === 'on';

			// コードエディタモード
			if ( editorMode === 'code' ) {
				const htmlContent = customHtml || previewHtml;
				if ( ! htmlContent ) {
					return <p style={{ color: '#94a3b8', padding: '16px', textAlign: 'center' }}>コンテンツが空です</p>;
				}
				return (
					<div className={ fullWidth ? 'lw_width_full_on' : '' }>
						{ customCss && (
							<style>{ customCss }</style>
						) }
						<div dangerouslySetInnerHTML={ { __html: htmlContent } } />
					</div>
				);
			}

			// 通常モード: content.rendered が空ならpreview_htmlをフォールバック
			const displayContent = postContent || previewHtml;
			if ( ! displayContent ) {
				return <p style={{ color: '#94a3b8', padding: '16px', textAlign: 'center' }}>コンテンツが空です</p>;
			}
			return (
				<div className={ fullWidth ? 'lw_width_full_on' : '' }>
					<div dangerouslySetInnerHTML={ { __html: displayContent } } />
				</div>
			);
		};

		/* --- JSX ------------------------------------------ */
		return (
			<div { ...blockProps }>
				{/* ▼ツールバー：解除ボタン */}
				{ ( partsId !== 0 || partsCat !== 0 ) && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								icon    = "no-alt"
								label   = { __( '解除', 'liteword' ) }
								onClick = { clearSelection }
							/>
						</ToolbarGroup>
					</BlockControls>
				) }

				{/* ▼サイドバー：カテゴリー＆パーツ選択 */}
				<InspectorControls>
					<PanelBody title={ __( 'パーツカテゴリーを選択', 'liteword' ) }>
						{ partsCats ? (
							<SelectControl
								label    = { __( 'カテゴリー', 'liteword' ) }
								value    = { partsCat }
								options  = { catOptions }
								onChange = { ( val ) => {
									const catId = parseInt( val, 10 );
									// カテゴリー変更時はパーツ選択をリセット
									setAttributes( {
										partsCat : catId,
										partsId  : 0,
									} );
								} }
							/>
						) : (
							<Spinner />
						) }
					</PanelBody>

					<PanelBody title={ __( 'マイパーツを選択', 'liteword' ) }>
						{ partsPosts ? (
							<SelectControl
								label     = { __( 'パーツ', 'liteword' ) }
								value     = { partsId }
								options   = { partsOptions }
								onChange  = { ( val ) =>
									setAttributes( { partsId : parseInt( val, 10 ) } )
								}
							/>
						) : (
							<Spinner />
						) }
					</PanelBody>
				</InspectorControls>

				{/* ▼エディター内プレビュー */}
				<div
					style={ {
						border     : '1px dashed #ccc',
						padding    : '1rem',
						background : '#fafafa',
						overflow   : 'hidden',
					} }
				>
					{/* ▼マイパーツ選択エリア（常に表示） */}
					<div style={ {
						marginBottom: partsId ? '16px' : '0',
						paddingBottom: partsId ? '16px' : '0',
						borderBottom: partsId ? '1px solid #ddd' : 'none',
					} }>
						<div style={ {
							display: 'flex',
							alignItems: 'center',
							gap: '12px',
						} }>
							<label style={ {
								fontSize: '13px',
								fontWeight: '500',
								color: '#1e1e1e',
								minWidth: '80px',
							} }>
								{ __( 'マイパーツ', 'liteword' ) }
							</label>
							<div style={ { flex: '1' } }>
								{ partsPosts ? (
									<SelectControl
										value={ partsId }
										options={ partsOptions }
										onChange={ ( val ) =>
											setAttributes( { partsId : parseInt( val, 10 ) } )
										}
										style={ { marginBottom: 0 } }
									/>
								) : (
									<Spinner />
								) }
							</div>
						</div>
						
						{ partsCat !== 0 && (
							<p style={ {
								fontSize: '11px',
								color: '#666',
								margin: '8px 0 0 0',
								paddingLeft: '92px',
							} }>
								{ partsCats?.find( c => c.id === partsCat )?.name } でフィルタ中
							</p>
						) }
					</div>

					{ partsId ? (
						<>
							{/* ヘッダー部分 */}
							<div style={ {
								marginBottom: showPreview ? '12px' : '0',
								paddingBottom: showPreview ? '12px' : '0',
								borderBottom: showPreview ? '1px solid #ddd' : 'none',
							} }>
								{/* タイトルとトグルボタン */}
								<div style={ { 
									marginBottom: '10px', 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'space-between',
									gap: '12px',
								} }>
									<div style={ {
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										flex: '1',
									} }>
										<strong style={ { fontSize: '15px', color: '#1e1e1e' } }>
											{ selectedTitle }
										</strong>
										{ selectedPart && (
											<span style={ {
												fontSize: '11px',
												padding: '2px 8px',
												borderRadius: '3px',
												background: selectedPart.editor_mode === 'code' ? '#0073aa' : '#ddd',
												color: selectedPart.editor_mode === 'code' ? '#fff' : '#333',
											} }>
												{ selectedPart.editor_mode === 'code' ? '💻 コード' : '✏️ 通常' }
											</span>
										) }
									</div>
									
									{/* プレビュートグルボタン */}
									<Button
										icon={ showPreview ? seen : unseen }
										label={ showPreview ? __( 'プレビューを非表示', 'liteword' ) : __( 'プレビューを表示', 'liteword' ) }
										onClick={ () => setAttributes( { showPreview: ! showPreview } ) }
										isPressed={ showPreview }
										style={ {
											minWidth: '36px',
											height: '36px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										} }
									/>
								</div>
								
								{/* ショートコードと編集ボタンを横並び */}
								<div style={ {
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
									flexWrap: 'wrap',
								} }>
									{/* ショートコード表示 */}
									<div style={ {
										background: '#fff',
										padding: showPreview ? '6px 10px' : '8px 12px',
										border: '1px solid #ddd',
										borderRadius: '4px',
										fontFamily: 'monospace',
										fontSize: showPreview ? '11px' : '12px',
										color: '#666',
										flex: '1',
									} }>
										[my_parts_content id="{ partsId }"]
									</div>

									{/* 編集リンクボタン */}
									<Button
										variant="primary"
										href={ editUrl }
										target="_blank"
										rel="noopener noreferrer"
										icon={ external }
										style={ {
											height: showPreview ? '32px' : '36px',
											padding: '0 12px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '6px',
											fontSize: showPreview ? '12px' : '13px',
											flex: '0 0 auto',
										} }
									>
										{ __( 'このマイパーツを編集', 'liteword' ) }
									</Button>
								</div>
							</div>

							{/* プレビュー部分 */}
							{ showPreview && (
								<div style={ {
									background: '#fff',
									padding: '16px',
									border: '1px solid #ddd',
									borderRadius: '4px',
									minHeight: '100px',
									maxHeight: '500px',
									overflow: 'hidden',
									overflowY: 'auto',
								} }>
									<div style={ {
										fontSize: '11px',
										color: '#666',
										marginBottom: '12px',
										paddingBottom: '8px',
										borderBottom: '1px solid #eee',
									} }>
										<div style={ {
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											gap: '8px',
										} }>
											<span>📄 プレビュー</span>
											<span style={ {
												fontSize: '10px',
												color: '#d63638',
												fontWeight: '500',
											} }>
												⚠️ 編集画面ではJavascriptは反映されません
											</span>
										</div>
									</div>
									{ renderPreview() }
								</div>
) }
						</>
					) : (
						<div style={ { 
							color: '#999', 
							textAlign: 'center', 
							padding: '40px 20px',
							fontSize: '14px',
						} }>
							マイパーツを選択すると、プレビューが表示されます
						</div>
					) }
				</div>
			</div>
		);
	},

	/* ==================================================
	 * 保存：ショートコードだけを出力
	 * ================================================= */
	save( { attributes } ) {
		const { partsId } = attributes;
		if ( ! partsId ) return null; // 未選択なら何も保存しない

		const shortcode = `[my_parts_content id="${ partsId }"]`;

		/* RawHTML でラップして余計な <p> 挿入を防止 */
		return (
			<RawHTML { ...useBlockProps.save() }>
				{ shortcode }
			</RawHTML>
		);
	},
} );



