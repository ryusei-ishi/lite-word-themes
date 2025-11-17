import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	MediaUpload
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
    ColorPicker
} from '@wordpress/components';
import './editor.scss';
import './style.scss';

registerBlockType('wdl/shin-gas-station-01-list-2', {
	title: 'インフォリスト 2 shin shop pattern 01',
	icon: 'images-alt2',
	category: 'liteword-other',
	supports: {
		anchor: true,
	},
	attributes: {
		// 背景画像は、.bg_image 内の img 要素から src 属性で取得
		bgImage: {
			type: 'string',
			source: 'attribute',
			selector: '.bg_image img',
			attribute: 'src',
			default: 'https://picsum.photos/1000/1000?random=4'
		},
        // フィルター色
        filterColor: {
            type: 'string',
            default: 'rgba(0, 0, 0, 0.5)'
        },
		// タイトル部分はそれぞれ別要素から抽出
		topTitleSub: {
			type: 'string',
			source: 'html',
			selector: '.ttl .sub',
			default: '私たちの会社について'
		},
		topTitleMain: {
			type: 'string',
			source: 'html',
			selector: '.ttl .main',
			default: 'Company'
		},
		// 各項目（li.item）を query で抽出する
		items: {
			type: 'array',
			source: 'query',
			selector: 'li.item',
			default: [
				{
					itemImage: 'https://picsum.photos/1000/1000?random=1',
					// no は自動計算のため初期値は設定しておきますが編集時は上書きされません
					no: '01',
					sub: 'Greeting',
					main: '代表あいさつ',
					description:
						'私たちは地域に根ざしたサービスを提供し、お客様の暮らしをより豊かにすることを目指してまいりました。\n地域社会や環境への配慮を欠かさず、持続可能な未来の実現に向けた取り組みにも積極的に取り組んでおります。',
					btnLabel: '代表あいさつ',
					url: ''
				},
				{
					itemImage: 'https://picsum.photos/1000/1000?random=2',
					no: '02',
					sub: 'Overview & History',
					main: '会社概要・沿革',
					description:
						'DriveEaseは、小さなスタートから社会を支える企業へと進化し、移動の快適さと安心を提供しています。我々は地域社会と共に成長し、未来のカーライフを支える存在を目指します。',
					btnLabel: '会社概要・沿革',
					url: ''
				},
				{
					itemImage: 'https://picsum.photos/1000/1000?random=3',
					no: '03',
					sub: 'Office Infomation',
					main: '事業所案内',
					description:
						'東北地方を中心に皆さまのカーライフをより快適にお届けいただけるよう、各地域での店舗展開を行っております。\n是非、お近くの店舗へお立ち寄りください。',
					btnLabel: '事業所案内',
					url: ''
				}
			],
			query: {
				// 画像は .image 内の img 要素から抽出
				itemImage: {
					type: 'string',
					source: 'attribute',
					selector: '.image img',
					attribute: 'src'
				},
				// 番号は .sub 内の .no 要素から抽出（※保存時は自動計算した値を出力します）
				no: {
					type: 'string',
					source: 'text',
					selector: '.sub .no'
				},
				// サブタイトルは .sub 内の .sub-text 要素から抽出
				sub: {
					type: 'string',
					source: 'html',
					selector: '.sub .sub-text',
					default: 'Greeting'
				},
				// メインタイトルは .ttl 内の .main 要素から抽出
				main: {
					type: 'string',
					source: 'html',
					selector: '.ttl .main',
					default: '代表あいさつ'
				},
				// 説明文は .text_in 内の p 要素から抽出
				description: {
					type: 'string',
					source: 'html',
					selector: '.text_in p',
					default:
						'私たちは地域に根ざしたサービスを提供し、お客様の暮らしをより豊かにすることを目指してまいりました。\n地域社会や環境への配慮を欠かさず、持続可能な未来の実現に向けた取り組みにも積極的に取り組んでおります。'
				},
				// ボタンラベルは .btn 内の .btn-label 要素から抽出
				btnLabel: {
					type: 'string',
					source: 'html',
					selector: '.btn .btn-label',
					default: '代表あいさつ'
				},
				// リンクURLは .btn 要素の href 属性から抽出
				url: {
					type: 'string',
					source: 'attribute',
					selector: '.btn',
					attribute: 'href',
					default: ''
				}
			}
		}
	},
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { bgImage,filterColor, topTitleSub, topTitleMain, items } = attributes;

		// items の追加（番号は自動計算）
		const addItem = () => {
			const newIndex = items.length + 1;
			const newItem = {
				itemImage: '',
				no: String(newIndex).padStart(2, '0'),
				sub: 'Greeting',
				main: '代表あいさつ',
				description:
					'私たちは地域に根ざしたサービスを提供し、お客様の暮らしをより豊かにすることを目指してまいりました。\n地域社会や環境への配慮を欠かさず、持続可能な未来の実現に向けた取り組みにも積極的に取り組んでおります。',
				btnLabel: '代表あいさつ',
				url: ''
			};
			setAttributes({ items: [...items, newItem] });
		};
        const onChangeFilterColor = (color) => setAttributes({ filterColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` });
		// items の削除
		const removeItem = (index) => {
			const newItems = [...items];
			newItems.splice(index, 1);
			setAttributes({ items: newItems });
		};

		// 各項目の値更新（番号は自動計算のため対象外）
		const updateItem = (index, key, value) => {
			const newItems = [...items];
			newItems[index][key] = value;
			setAttributes({ items: newItems });
		};

		return (
			<>
				{/* 背景画像はサイドバーで設定（サムネイルも表示） */}
				<InspectorControls>
					<PanelBody title="背景画像の設定" initialOpen={true}>
						<MediaUpload
							onSelect={(media) => setAttributes({ bgImage: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{bgImage ? '背景画像を変更' : '背景画像を選択'}
								</Button>
							)}
						/>
						{bgImage && (
							<>
								<Button
									onClick={() => setAttributes({ bgImage: '' })}
									isDestructive
									style={{ marginTop: '8px' }}
								>
									背景画像を削除
								</Button>
								<img
									src={bgImage}
									alt="背景サムネイル"
									style={{ width: '100%', marginTop: '8px' }}
								/>
							</>
						)}
					</PanelBody>
                    {/* 背景画像のフィルター色の設定 */}
                    <PanelBody title="画像の上のフィルター色">
                        <ColorPicker
                            color={filterColor}
                            onChangeComplete={onChangeFilterColor}
                            label="フィルターの色"
                        />
                    </PanelBody>
				</InspectorControls>
				<div className="shin-gas-station-01-list-2">
					<div className="bg_image">
						{bgImage && <img src={bgImage} alt="" />}
						<div className="filter" style={{ background: filterColor }} />

					</div>

					<h2 className="ttl">
						<RichText
							tagName="span"
							className="sub"
							value={topTitleSub}
							onChange={(val) => setAttributes({ topTitleSub: val })}
							placeholder="サブタイトルを入力"
						/>
						<RichText
							tagName="span"
							className="main"
							data-lw_font_set="Montserrat"
							value={topTitleMain}
							onChange={(val) => setAttributes({ topTitleMain: val })}
							placeholder="メインタイトルを入力"
						/>
					</h2>

					<ul className="list">
						{items.map((item, index) => (
							<li className="item" key={index}>
								<div className="image">
									
									{item.itemImage && (
										<>
											<img src={item.itemImage} alt="" />
										</>
									)}
                                    <div className="image_upload">
                                        <MediaUpload
                                            onSelect={(media) => updateItem(index, 'itemImage', media.url)}
                                            allowedTypes={['image']}
                                            render={({ open }) => (
                                                <Button onClick={open} isSecondary>
                                                    {item.itemImage ? '画像を変更' : '画像を選択'}
                                                </Button>
                                            )}
                                        />
                                        {item.itemImage && (
                                            <>
                                                <Button
                                                    onClick={() => updateItem(index, 'itemImage', '')}
                                                    isDestructive
                                                    style={{ marginTop: '8px' }}
                                                >
                                                    画像を削除
                                                </Button>
                                            </>
                                        )}
                                    </div>
								</div>

								<div className="text_in">
									<h3 className="ttl">
										<span className="sub">
											{/* 番号は自動で計算 */}
											<span className="no">{ String(index + 1).padStart(2, '0') }</span>
											<span className="sub-text">
												<RichText
													tagName="span"
													data-lw_font_set="Montserrat"
													value={item.sub}
													onChange={(val) => updateItem(index, 'sub', val)}
													placeholder="サブタイトル"
												/>
											</span>
										</span>
										<RichText
											tagName="span"
											className="main"
											value={item.main}
											onChange={(val) => updateItem(index, 'main', val)}
											placeholder="メインタイトル"
										/>
									</h3>

									<RichText
										tagName="p"
										value={item.description}
										onChange={(val) => updateItem(index, 'description', val)}
										placeholder="説明文"
									/>

									{/* 編集画面では常に .btn を表示し、href 属性は item.url を設定 */}
									<a className="btn" href={item.url}>
										<span className="btn-label">
											<RichText
												tagName="span"
												value={item.btnLabel}
												onChange={(val) => updateItem(index, 'btnLabel', val)}
												placeholder="ボタンテキスト"
											/>
										</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="39.5"
											height="4.197"
											viewBox="0 0 39.5 4.197"
										>
											<g transform="translate(-179.5 -2154.803)" fill="#059d47">
												<path
													d="M0,0,8,4.2H0Z"
													transform="translate(211 2154.803)"
												/>
												<path
													d="M32,.5H0v-1H32Z"
													transform="translate(179.5 2158.5)"
												/>
											</g>
										</svg>
									</a>
                                    <br />
									{/* リンクURL入力用テキストフィールド */}
									<TextControl
										label="リンク URL"
										value={item.url}
										onChange={(val) => updateItem(index, 'url', val)}
										placeholder="リンク URL を入力"
										style={{ marginTop: '8px' }}
									/>
								</div>
                                <div className="delete_item_btn">
                                    <Button
                                        isDestructive
                                        onClick={() => removeItem(index)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        この項目を削除
                                    </Button>
                                </div>
							</li>
						))}
					</ul>

					<Button isPrimary onClick={addItem} style={{ marginTop: '16px' }}>
						項目を追加
					</Button>
				</div>
			</>
		);
	},
	save: (props) => {
		const { attributes } = props;
		const { bgImage,filterColor  , topTitleSub, topTitleMain, items } = attributes;
 
		return (
			<div className="shin-gas-station-01-list-2">
				<div className="bg_image">
					{bgImage && <img src={bgImage} alt="" />}
					<div className="filter" style={{ background: filterColor }} />
				</div>
				<h2 className="ttl">
					<RichText.Content tagName="span" className="sub" value={topTitleSub} />
					<RichText.Content tagName="span" className="main" data-lw_font_set="Montserrat" value={topTitleMain} />
				</h2>
				<ul className="list">
					{items.map((item, index) => (
						<li className="item" key={index}>
							<div className="image">
								{item.itemImage && <img src={item.itemImage} alt="" />}
							</div>
							<div className="text_in">
								<h3 className="ttl">
									<span className="sub">
										<span className="no" data-lw_font_set="Montserrat">{ String(index + 1).padStart(2, '0') }</span>
										<span className="sub-text" data-lw_font_set="Montserrat">{item.sub}</span>
									</span>
									<span className="main">{item.main}</span>
								</h3>
								<RichText.Content tagName="p" value={item.description} />
								{/* リンクURLが設定されている場合のみ .btn を表示 */}
								{ item.url && item.url !== '' && (
									<a className="btn" href={item.url}>
										<span className="btn-label">{item.btnLabel}</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="39.5"
											height="4.197"
											viewBox="0 0 39.5 4.197"
										>
											<g transform="translate(-179.5 -2154.803)" fill="var(--color-main)">
												<path
													d="M0,0,8,4.2H0Z"
													transform="translate(211 2154.803)"
												/>
												<path
													d="M32,.5H0v-1H32Z"
													transform="translate(179.5 2158.5)"
												/>
											</g>
										</svg>
									</a>
								)}
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	},
});



