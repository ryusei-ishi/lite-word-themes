import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	RichText,
	MediaUpload,
	ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	Button,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import './editor.scss';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
	/* ────────────────────────────────────────────────
	 * 編集画面
	 * ──────────────────────────────────────────────── */
	edit( { attributes, setAttributes } ) {
		const {
			mainTitle,
			subTitle,
			bottomText,
			ctaText,
			ctaUrl,
			mainTitleColor,
			highlightColor,
			ctaBorderColor,
			ctaTextColor,
			ctaBorderWidth,
			ctaBorderRadius,
			imageRadius,
			pcButtonState,
			mobileButtonState,
			images,
		} = attributes;

		const onChange = key => val => setAttributes( { [ key ]: val } );

		/* 画像を一括選択（最大 8 枚）してオブジェクト配列を生成 */
		const onSelectImages = mediaArray => {
			const newArr = mediaArray.slice( 0, 8 ).map( m => ( { url: m.url, alt: m.alt } ) );
			setAttributes( { images: newArr } );
		};

		/* ボタンの状態に応じたクラス名を生成 */
		const getButtonClasses = () => {
			let classes = ['cont_btn'];
			
			if (pcButtonState === 'w_full') {
				classes.push('w_full');
			} else if (pcButtonState === 'none') {
				classes.push('none');
			}
			
			if (mobileButtonState === 'sp_w_full') {
				classes.push('sp_w_full');
			} else if (mobileButtonState === 'sp_none') {
				classes.push('sp_none');
			}
			
			return classes.join(' ');
		};

		/* .btn_bg用のクラス名を生成 */
		const getBtnBgClasses = () => {
			let classes = ['btn_bg'];
			
			if (pcButtonState === 'w_full') {
				classes.push('w_full');
			} else if (pcButtonState === 'none') {
				classes.push('none');
			}
			
			if (mobileButtonState === 'sp_w_full') {
				classes.push('sp_w_full');
			} else if (mobileButtonState === 'sp_none') {
				classes.push('sp_none');
			}
			
			return classes.join(' ');
		};

		
        const blockProps = useBlockProps({
            className: 'paid-block-content-4'
        });

        return (
			<>
				<InspectorControls>
					{/* マニュアル */}
					<PanelBody title="マニュアル" initialOpen={false}>
						<Button variant="secondary" href="https://www.youtube.com/watch?v=V5vRfbzV8_8" target="_blank">
							このブロックの使い方はこちら
						</Button>
					</PanelBody>

					{/* テキスト・色設定 */}
					<PanelBody title="色設定" initialOpen={true}>
						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#fafafa'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
								📝 メインタイトルの色
							</p>
							<ColorPalette value={ mainTitleColor } onChange={ onChange('mainTitleColor') } />
						</div>

						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#fafafa'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
								✨ サブタイトル（ハイライト）の色
							</p>
							<ColorPalette value={ highlightColor } onChange={ onChange('highlightColor') } />
						</div>
					</PanelBody>

					{/* CTA ボタン基本設定 */}
					<PanelBody title="ボタン設定" initialOpen={false}>
						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#fafafa'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
								🔗 リンク URL
							</p>
							<TextControl 
								value={ ctaUrl } 
								onChange={ onChange('ctaUrl') }
								placeholder="https://example.com"
							/>
						</div>

						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#fafafa'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
								🎨 ボタンの色設定
							</p>
							
							<p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
								枠線・背景の色
							</p>
							<ColorPalette value={ ctaBorderColor } onChange={ onChange('ctaBorderColor') } />

							<p style={{ fontWeight: 'bold', marginBottom: '8px', marginTop: '15px', fontSize: '14px' }}>
								文字色
							</p>
							<ColorPalette value={ ctaTextColor } onChange={ onChange('ctaTextColor') } />
						</div>

						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#fafafa'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
								📐 ボタンの形状
							</p>
							
							<RangeControl 
								label="枠線の太さ（px）"
								value={ ctaBorderWidth } 
								onChange={ onChange('ctaBorderWidth') } 
								min={ 0 } 
								max={ 20 }
								help="ボタンの枠線の太さを設定します"
							/>

							<RangeControl 
								label="ボタン角丸（px）"
								value={ ctaBorderRadius } 
								onChange={ onChange('ctaBorderRadius') } 
								min={ 0 } 
								max={ 100 }
								help="ボタンの角の丸みを設定します"
							/>
						</div>
					</PanelBody>

					{/* CTA ボタンレスポンシブ設定 */}
					<PanelBody title="レスポンシブ設定" initialOpen={false}>
						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#f0f8ff'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
								🖥️ PC画面での表示
							</p>
							<SelectControl
								value={ pcButtonState }
								options={ [
									{ label: '未選択', value: '' },
									{ label: '全幅', value: 'w_full' },
									{ label: '非表示', value: 'none' }
								] }
								onChange={ onChange('pcButtonState') }
								help="PC画面でのボタンの表示方法を選択してください"
							/>
						</div>

						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#fff5f5'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
								📱 スマートフォン画面での表示
							</p>
							<SelectControl
								value={ mobileButtonState }
								options={ [
									{ label: '未選択', value: '' },
									{ label: '全幅', value: 'sp_w_full' },
									{ label: '非表示', value: 'sp_none' }
								] }
								onChange={ onChange('mobileButtonState') }
								help="スマートフォン画面でのボタンの表示方法を選択してください"
							/>
						</div>
					</PanelBody>

					{/* ギャラリー */}
					<PanelBody title="画像設定" initialOpen={false}>
						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							marginBottom: '15px',
							backgroundColor: '#fafafa'
						}}>
							<p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
								📷 画像選択（最大8枚）
							</p>
							<MediaUpload
								onSelect={ onSelectImages }
								allowedTypes={ [ 'image' ] }
								multiple
								gallery
								value={ images.map( img => img.url ) }
								render={ ( { open } ) => (
									<>
										<Button variant="primary" onClick={ open }>
											{ images.length ? '画像を再選択' : '画像を選択' }
										</Button>
										{ images.length > 0 && (
											<div style={ { 
												marginTop: 15, 
												display: 'grid', 
												gridTemplateColumns: 'repeat(4,1fr)', 
												gap: 6,
												border: '1px solid #ddd',
												borderRadius: '4px',
												padding: '10px'
											} }>
												{ images.map( ( img, i ) => (
													<img 
														key={ i } 
														src={ img.url } 
														alt="" 
														style={ { 
															width: '100%', 
															borderRadius: `${ imageRadius }px`,
															aspectRatio: '1',
															objectFit: 'cover'
														} } 
													/>
												) ) }
											</div>
										) }
									</>
								) }
							/>
						</div>

						<div style={{ 
							border: '1px solid #e0e0e0', 
							borderRadius: '4px', 
							padding: '15px', 
							backgroundColor: '#fafafa'
						}}>
							<RangeControl 
								label="📐 画像角丸（px）"
								value={ imageRadius } 
								onChange={ onChange('imageRadius') } 
								min={ 0 } 
								max={ 200 }
								help="ギャラリー画像の角の丸みを設定します"
							/>
						</div>
					</PanelBody>
				</InspectorControls>

				{/* エディタープレビュー */}
				<div {...blockProps}>
					<section className="conts">
						<div className="cont">
							<h2 className="ttl">
								<div style={ { color: mainTitleColor } }>
									<RichText value={ mainTitle } onChange={ onChange('mainTitle') } placeholder="メインタイトル" />
								</div>
								<span className="sub" style={ { color: highlightColor } }>
									<RichText value={ subTitle } onChange={ onChange('subTitle') } placeholder="サブタイトル" />
								</span>
							</h2>

							<RichText
								tagName="p"
								className="ttl_btm_p"
								value={ bottomText }
								onChange={ onChange('bottomText') }
								placeholder="テキストを入力"
							/>

							<div
								className={ getButtonClasses() }
								style={ {
									borderColor : ctaBorderColor,
									borderWidth : `${ ctaBorderWidth }px`,
									borderRadius: `${ ctaBorderRadius }px`,
									color       : ctaTextColor,
								} }
							>
								<RichText value={ ctaText } onChange={ onChange('ctaText') } placeholder="ボタン文言" />
								<div className={ getBtnBgClasses() } style={ { background: ctaBorderColor, borderRadius: `${ ctaBorderRadius }px` } } />
							</div>
						</div>

						<div className="gallery_in">
							{ images.map( ( img, i ) => (
								<div className="image" key={ i } style={ { borderRadius: `${ imageRadius }px`, overflow: 'hidden' } }>
									{ img.url && <img src={ img.url } alt={ img.alt } style={ { borderRadius: `${ imageRadius }px` } } /> }
								</div>
							) ) }
						</div>
					</section>
				</div>
			</>
		);
	},

	/* ────────────────────────────────────────────────
	 * 保存
	 * ──────────────────────────────────────────────── */
	save( { attributes } ) {
		const {
			mainTitle,
			subTitle,
			bottomText,
			ctaText,
			ctaUrl,
			mainTitleColor,
			highlightColor,
			ctaBorderColor,
			ctaTextColor,
			ctaBorderWidth,
			ctaBorderRadius,
			imageRadius,
			pcButtonState,
			mobileButtonState,
			images,
		} = attributes;

		/* ボタンの状態に応じたクラス名を生成（保存版） */
		const getButtonClasses = () => {
			let classes = ['cont_btn'];
			
			if (pcButtonState === 'w_full') {
				classes.push('w_full');
			} else if (pcButtonState === 'none') {
				classes.push('none');
			}
			
			if (mobileButtonState === 'sp_w_full') {
				classes.push('sp_w_full');
			} else if (mobileButtonState === 'sp_none') {
				classes.push('sp_none');
			}
			
			return classes.join(' ');
		};

		/* .btn_bg用のクラス名を生成（保存版） */
		const getBtnBgClasses = () => {
			let classes = ['btn_bg'];
			
			if (pcButtonState === 'w_full') {
				classes.push('w_full');
			} else if (pcButtonState === 'none') {
				classes.push('none');
			}
			
			if (mobileButtonState === 'sp_w_full') {
				classes.push('sp_w_full');
			} else if (mobileButtonState === 'sp_none') {
				classes.push('sp_none');
			}
			
			return classes.join(' ');
		};

		const blockProps = useBlockProps.save({
			className: 'paid-block-content-4'
		});

		return (
			<div {...blockProps}>
				<section className="conts">
					<div className="cont">
						<h2 className="ttl">
							<div style={ { color: mainTitleColor } } dangerouslySetInnerHTML={ { __html: mainTitle } } />
							<span className="sub" style={ { color: highlightColor } } dangerouslySetInnerHTML={ { __html: subTitle } } />
						</h2>

						{ bottomText && bottomText.trim() && (
							<p className="ttl_btm_p">
								<span dangerouslySetInnerHTML={ { __html: bottomText } } />
							</p>
						) }

						<a
							className={ getButtonClasses() }
							href={ ctaUrl }
							style={ {
								borderColor : ctaBorderColor,
								borderWidth : `${ ctaBorderWidth }px`,
								borderRadius: `${ ctaBorderRadius }px`,
								color       : ctaTextColor,
							} }
						>
							<span dangerouslySetInnerHTML={ { __html: ctaText } } />
							<div className={ getBtnBgClasses() } style={ { background: ctaBorderColor, borderRadius: `${ ctaBorderRadius }px` } } />
						</a>
					</div>

					<div className="gallery_in">
						{ images.map( ( img, i ) =>
							img.url ? (
								<div className="image" key={ i } style={ { borderRadius: `${ imageRadius }px`, overflow: 'hidden' } }>
									<img src={ img.url } alt={ img.alt } style={ { borderRadius: `${ imageRadius }px` } } />
								</div>
							) : null
						) }
					</div>
				</section>
			</div>
		);
	},

	/* ────────────────────────────────────────────────
	 * 旧 save（useBlockProps.save() 移行前・名札なし）
	 * ──────────────────────────────────────────────── */
	deprecated: [
		{
			apiVersion: metadata.apiVersion,
			attributes: metadata.attributes,
			supports: metadata.supports,
			save: function ( { attributes } ) {
		const {
			mainTitle,
			subTitle,
			bottomText,
			ctaText,
			ctaUrl,
			mainTitleColor,
			highlightColor,
			ctaBorderColor,
			ctaTextColor,
			ctaBorderWidth,
			ctaBorderRadius,
			imageRadius,
			pcButtonState,
			mobileButtonState,
			images,
		} = attributes;

		/* ボタンの状態に応じたクラス名を生成（保存版） */
		const getButtonClasses = () => {
			let classes = ['cont_btn'];
			
			if (pcButtonState === 'w_full') {
				classes.push('w_full');
			} else if (pcButtonState === 'none') {
				classes.push('none');
			}
			
			if (mobileButtonState === 'sp_w_full') {
				classes.push('sp_w_full');
			} else if (mobileButtonState === 'sp_none') {
				classes.push('sp_none');
			}
			
			return classes.join(' ');
		};

		/* .btn_bg用のクラス名を生成（保存版） */
		const getBtnBgClasses = () => {
			let classes = ['btn_bg'];
			
			if (pcButtonState === 'w_full') {
				classes.push('w_full');
			} else if (pcButtonState === 'none') {
				classes.push('none');
			}
			
			if (mobileButtonState === 'sp_w_full') {
				classes.push('sp_w_full');
			} else if (mobileButtonState === 'sp_none') {
				classes.push('sp_none');
			}
			
			return classes.join(' ');
		};

		return (
			<div className="paid-block-content-4">
				<section className="conts">
					<div className="cont">
						<h2 className="ttl">
							<div style={ { color: mainTitleColor } } dangerouslySetInnerHTML={ { __html: mainTitle } } />
							<span className="sub" style={ { color: highlightColor } } dangerouslySetInnerHTML={ { __html: subTitle } } />
						</h2>

						{ bottomText && bottomText.trim() && (
							<p className="ttl_btm_p">
								<span dangerouslySetInnerHTML={ { __html: bottomText } } />
							</p>
						) }

						<a
							className={ getButtonClasses() }
							href={ ctaUrl }
							style={ {
								borderColor : ctaBorderColor,
								borderWidth : `${ ctaBorderWidth }px`,
								borderRadius: `${ ctaBorderRadius }px`,
								color       : ctaTextColor,
							} }
						>
							<span dangerouslySetInnerHTML={ { __html: ctaText } } />
							<div className={ getBtnBgClasses() } style={ { background: ctaBorderColor, borderRadius: `${ ctaBorderRadius }px` } } />
						</a>
					</div>

					<div className="gallery_in">
						{ images.map( ( img, i ) =>
							img.url ? (
								<div className="image" key={ i } style={ { borderRadius: `${ imageRadius }px`, overflow: 'hidden' } }>
									<img src={ img.url } alt={ img.alt } style={ { borderRadius: `${ imageRadius }px` } } />
								</div>
							) : null
						) }
					</div>
				</section>
			</div>
		);
			},
		},
	],
});