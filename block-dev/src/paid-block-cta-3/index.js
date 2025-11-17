import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	MediaUpload,
    ColorPalette,

} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Button,
    SelectControl
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';

// フォントオプションを変数に定義
const fontOptions = fontOptionsArr();
// フォント太さオプションを変数に定義
const fontWeightOptions = fontWeightOptionsArr();

// カスタムブロックのIDは「paid-block-cta-3」
registerBlockType('wdl/paid-block-cta-3', {
	title: 'CTA 03',
    icon: 'megaphone',
    category: 'liteword-other',
	supports: {
		anchor: true
	},
	attributes: {
		mainTitle: {
			type: 'string',
			default: '中古車・高価買取'
		},
		leadText: {
			type: 'string',
			default: '365日年中無休お電話受付中\n査定は完全無料です。'
		},
		listItem1: {
			type: 'string',
			default: '即日買取'
		},
		listItem2: {
			type: 'string',
			default: '出張買取'
		},
		listItem3: {
			type: 'string',
			default: '実績多数'
		},
		phoneNumber: {
			type: 'string',
			default: '0120-000-000'
		},
		imageUrl: {
			type: 'string',
			default: 'https://lite-word.com/sample_img/reception/women/6.webp'
		},
		// 画像の表示を切り替えるためのクラス用
		objectFit: {
			type: 'string',
			default: 'object_fit_cover' // object_fit_cover or object_fit_contain
		},
		objectPosition: {
			type: 'string',
			default: 'object_position_center' // object_position_center, object_position_bottom, object_position_top
		},
        bgColor: {
            type: 'string',
            default: '#f8f4de'
        },
        bdColor: {
            type: 'string',
            default: '#f45353'
        },
		tapTelText: {
			type: 'string',
			default: 'タップしてお電話ください'
		},
		fontTel: {
			type: 'string',
			default: 'Montserrat'
		},
		fontWeightTel: {
			type: 'string',
			default: ''
		}
	},

	edit: (props) => {
		const { attributes, setAttributes } = props;
		const {
			linkUrl,
			mainTitle,
			leadText,
			listItem1,
			listItem2,
			listItem3,
			phoneNumber,
			imageUrl,
			objectFit,
			objectPosition,
			tapTelText,
            bgColor,
            bdColor,
			fontTel,
			fontWeightTel
		} = attributes;

		// CSS変数が入っている場合はデフォルト値にリセット
		useEffect(() => {
			if (bgColor && bgColor.includes('var(')) {
				setAttributes({ bgColor: '#f8f4de' });
			}
			if (bdColor && bdColor.includes('var(')) {
				setAttributes({ bdColor: '#f45353' });
			}
		}, []);

		// 画像切り替え
		const onChangeImage = (media) => {
			setAttributes({ imageUrl: media.url });
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title="マニュアル">
                        <div>
                            <Button
                                variant="secondary"
                                href="https://www.youtube.com/watch?v=YVYyMtSf6VA"
                                target="_blank"
                            >
                                このブロックの使い方はこちら
                            </Button>
                        </div>
                    </PanelBody>
					<PanelBody title="電話番号フォント設定">
						<SelectControl
							label="フォントの種類"
							value={fontTel}
							options={fontOptions}
							onChange={(newFontTel) => setAttributes({ fontTel: newFontTel })}
						/>
						<SelectControl
							label="フォントの太さ"
							value={fontWeightTel}
							options={fontWeightOptions}
							onChange={(newFontWeightTel) => setAttributes({ fontWeightTel: newFontWeightTel })}
						/>
					</PanelBody>
					<PanelBody title="画像設定">
						<MediaUpload
							onSelect={onChangeImage}
							allowedTypes={['image']}
							render={({ open }) => (
								<>
									{imageUrl && (
										<img
											src={imageUrl}
											alt="CTA画像"
											style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
										/>
									)}
									<Button onClick={open} variant="secondary">
										画像を選択
									</Button>{' '}
									<Button
										onClick={() => setAttributes({ imageUrl: '' })}
										variant="secondary"
									>
										画像を削除
									</Button>
								</>
							)}
						/>
					</PanelBody>

					<PanelBody title="画像の表示設定">
						<SelectControl
							label="画像のフィット(object-fit)"
							value={objectFit}
							options={[
								{ label: 'カバー (cover)', value: 'object_fit_cover' },
								{ label: 'コンテイン (contain)', value: 'object_fit_contain' }
							]}
							onChange={(value) => setAttributes({ objectFit: value })}
						/>
						<SelectControl
							label="画像の位置(object-position)"
							value={objectPosition}
							options={[
								{ label: '中央 (center)', value: 'object_position_center' },
								{ label: '上 (top)', value: 'object_position_top' },
								{ label: '下 (bottom)', value: 'object_position_bottom' }
							]}
							onChange={(value) => setAttributes({ objectPosition: value })}
						/>
					</PanelBody>
                    <PanelBody title="背景色設定">
                        <ColorPalette
                            value={bgColor}
                            colors={[
                                { name: 'ベージュ', color: '#f8f4de' },
                                { name: '白', color: '#ffffff' },
                                { name: 'ライトグレー', color: '#f5f5f5' },
                                { name: 'ライトブルー', color: '#e3f2fd' },
                                { name: 'ライトグリーン', color: '#e8f5e9' },
                            ]}
                            disableCustomColors={false}
                            onChange={(color) => setAttributes({ bgColor: color || '#f8f4de' })}
                        />
                    </PanelBody>
                    <PanelBody title="枠線色設定">
                    <ColorPalette
                            value={bdColor}
                            colors={[
                                { name: '赤', color: '#f45353' },
                                { name: 'オレンジ', color: '#ff9800' },
                                { name: 'グリーン', color: '#4caf50' },
                                { name: 'ブルー', color: '#2196f3' },
                            ]}
                            disableCustomColors={false}
                            onChange={(color) => setAttributes({ bdColor: color || '#f45353' })}
                        />  
                    </PanelBody>

				</InspectorControls>

				<div className="paid-block-cta-3">
					<div className="this_wrap" style={{ backgroundColor: bgColor , borderColor: bdColor }}>
						<div className="text_in">
							<RichText
								tagName="h2"
								className="title"
								value={mainTitle}
								onChange={(value) => setAttributes({ mainTitle: value })}
								placeholder="メインタイトルを入力"
							/>
							<RichText
								tagName="p"
								value={leadText}
								onChange={(value) => setAttributes({ leadText: value })}
								placeholder="リードテキストを入力"
							/>
							<ul>
								<li>
									<RichText
										tagName="span"
										value={listItem1}
										onChange={(value) => setAttributes({ listItem1: value })}
										placeholder="リスト1"
									/>
								</li>
								<li>
									<RichText
										tagName="span"
										value={listItem2}
										onChange={(value) => setAttributes({ listItem2: value })}
										placeholder="リスト2"
									/>
								</li>
								<li>
									<RichText
										tagName="span"
										value={listItem3}
										onChange={(value) => setAttributes({ listItem3: value })}
										placeholder="リスト3"
									/>
								</li>
							</ul>
							<div className="tel">
								<RichText
									tagName="span"
									value={phoneNumber}
									onChange={(value) => setAttributes({ phoneNumber: value })}
									placeholder="電話番号を入力"
									data-lw_font_set={fontTel}
									style={{ fontWeight: fontWeightTel }}
								/>
							</div>
						</div>
						<div className="image">
							{imageUrl && (
								<img
									src={imageUrl}
									alt="CTA画像"
									// ここで objectFit と objectPosition を class として付与
									className={`${objectFit} ${objectPosition}`}
								/>
							)}
						</div>
					</div>
					<div className="tap_tel">
						<RichText
							tagName="p"
							value={tapTelText}
							onChange={(value) => setAttributes({ tapTelText: value })}
							placeholder="タップテキストを入力"
						/>
					</div>
				</div>
			</Fragment>
		);
	},

	save: (props) => {
		const { attributes } = props;
		const {
			linkUrl,
			mainTitle,
			leadText,
			listItem1,
			listItem2,
			listItem3,
			phoneNumber,
			imageUrl,
			objectFit,
			objectPosition,
			tapTelText,
            bgColor,
            bdColor,
			fontTel,
			fontWeightTel
		} = attributes;

		// HTMLタグを除去して純粋な電話番号のみを取得
		const getPlainPhoneNumber = (richText) => {
			if (!richText) return '';
			// HTMLタグを全て除去
			const plainText = richText.replace(/<[^>]*>/g, '');
			return plainText;
		};

		const plainPhoneNumber = getPlainPhoneNumber(phoneNumber);

		return (
			<div className="paid-block-cta-3">
				<a className="this_wrap" href={plainPhoneNumber ? `tel:${plainPhoneNumber}` : '#'} style={{ backgroundColor: bgColor , borderColor: bdColor }}>
					<div className="text_in">
						<RichText.Content
							tagName="h2"
							className="title"
							value={mainTitle}
						/>
						<RichText.Content
							tagName="p"
							value={leadText}
						/>
						<ul>
							<li>
								<RichText.Content tagName="span" value={listItem1} />
							</li>
							<li>
								<RichText.Content tagName="span" value={listItem2} />
							</li>
							<li>
								<RichText.Content tagName="span" value={listItem3} />
							</li>
						</ul>
						<div className="tel">
							<RichText.Content 
								tagName="span" 
								value={phoneNumber} 
								data-lw_font_set={fontTel}
								style={{ fontWeight: fontWeightTel }}
							/>
						</div>
					</div>
					<div className="image">
						{imageUrl && (
							<img
								src={imageUrl}
								alt="CTA画像"
								className={`${objectFit} ${objectPosition}`}
							/>
						)}
					</div>
				</a>
				<div className="tap_tel">
					<RichText.Content
						tagName="p"
						value={tapTelText}
					/>
				</div>
                <style>
                    {`
                        @container (max-width: 700px) {
                            .paid-block-cta-3 .this_wrap h2.title  {
                                background-color: ${bdColor} !important;
                            }
                        }
                    
                    `}
                </style>
			</div>
		);
	}
});