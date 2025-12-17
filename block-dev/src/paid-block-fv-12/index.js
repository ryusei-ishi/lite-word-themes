/* =============================================================== *
 * LiteWord – paid‑block‑fv‑12 〈2025‑07‑改訂〉
 * =============================================================== */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	URLInput,
	MediaUpload,
	useSettings,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody, Button, SelectControl, Spinner,
	ToggleControl, RangeControl, TextControl, ColorPalette,
	ColorPicker, Popover, GradientPicker,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ---------- 二重登録防止 ---------- */
if ( wp.blocks.getBlockType( metadata.name ) ) {
	console.warn( `${metadata.name} already registered.` );
} else {

/* =============================================================== *
 *  Register
 * =============================================================== */
registerBlockType( metadata.name, {
/* =============================================================== *
 *  Edit
 * =============================================================== */
	edit( { attributes, setAttributes } ){

		const {
			logoText, logoUrl, logoImg, logoImgHeight,
			cta1Text, cta1Url, cta1Enable, cta1BgColor, cta1TextColor, cta1BorderWidth, cta1BorderColor, cta1BorderRadius,
			cta2Text, cta2Url, cta2Enable, cta2BgColor, cta2TextColor, cta2BorderWidth, cta2BorderColor, cta2BorderRadius,
			headline, newsLabel, newsListVisible,
			bgType, bgImg, videoUrl, videoSpeed,
			bgFilterType, bgFilterColor, bgFilterGradient, bgFilterOpacity,
			navMenuId, navMenuItems,
			newsSourceType, newsIds, newsPostsNumber,
			minHeightPc, minHeightTb, minHeightSp,
		} = attributes;

		/* --- WordPress標準設定を取得 --- */
		const [
			gradients,
			colors,
		] = useSettings(
			'color.gradients',
			'color.palette'
		);

		/* --- メニュー一覧取得 --- */
		const [ menus, setMenus ] = useState( null );
		useEffect(()=>{
			apiFetch( { path:'/wp/v2/menus?per_page=100' } )
				.then(res=>setMenus(res))
				.catch(()=>setMenus([]));
		},[]);

		/* --- メニューアイテム取得 --- */
		useEffect(()=>{
			if(!navMenuId) return;
			apiFetch({ path:`/wp/v2/menu-items?menus=${navMenuId}&per_page=100` })
				.then(items=>{
					// アイテムをソート
					const sortedItems = items.sort((a,b)=>a.menu_order-b.menu_order);
					
					// 階層構造を構築
					const buildHierarchy = (parentId = 0) => {
						return sortedItems
							.filter(item => item.parent === parentId)
							.map(item => ({
								id: item.id,
								title: item.title?.rendered || item.title,
								url: item.url,
								children: buildHierarchy(item.id)
							}));
					};
					
					const hierarchicalMenu = buildHierarchy();
					setAttributes({navMenuItems: hierarchicalMenu});
				})
				.catch(()=>setAttributes({navMenuItems:[]}));
		},[navMenuId]);

		/* --- NEWS プレビュー --- */
		const [ previewPosts,setPreviewPosts ]=useState([]);
		useEffect(()=>{
			let path='';
			if(newsSourceType==='ids'&&newsIds.trim()){
				path=`/wp/v2/posts?include=${newsIds.replace(/\s+/g,'')}&_embed`;
			}else{
				path=`/wp/v2/posts?per_page=${newsPostsNumber}&_embed`;
			}
			apiFetch({path}).then(setPreviewPosts).catch(()=>setPreviewPosts([]));
		},[newsSourceType,newsIds,newsPostsNumber]);

		/* --- ハンドラ --- */
		const onSelectBg   =m=>setAttributes({bgImg:m.url});
		const onSelectLogo =m=>setAttributes({logoImg:m.url});
		const onSelectVid  =m=>setAttributes({videoUrl:m.url});

		/* --- CTA背景色変更ハンドラ --- */
		const handleCTA1BgColorChange = (color) => {
			if (cta1BgColor === 'transparent' && color) {
				const rgbaColor = color.includes('rgba') ? color : `rgba(${hexToRgb(color)}, 0.7)`;
				setAttributes({cta1BgColor: rgbaColor});
			} else {
				setAttributes({cta1BgColor: color});
			}
		};

		const handleCTA2BgColorChange = (color) => {
			if (cta2BgColor === 'transparent' && color) {
				const rgbaColor = color.includes('rgba') ? color : `rgba(${hexToRgb(color)}, 0.7)`;
				setAttributes({cta2BgColor: rgbaColor});
			} else {
				setAttributes({cta2BgColor: color});
			}
		};

		/* --- HEXをRGBに変換 --- */
		const hexToRgb = (hex) => {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? 
				`${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
				'0, 0, 0';
		};

		/* --- 背景フィルターの実際の値を取得 --- */
		const getBgFilterStyle = () => {
			if (bgFilterType === 'gradient' && bgFilterGradient) {
				return { 
					background: bgFilterGradient,
					opacity: bgFilterOpacity / 100
				};
			} else if (bgFilterColor) {
				return { 
					backgroundColor: `${bgFilterColor}${Math.round(bgFilterOpacity * 2.55).toString(16).padStart(2, '0')}` 
				};
			}
			return {};
		};

		/* --- 判定（編集画面：テキストが空でもボタンを表示） --- */
		const showCTA1    = cta1Enable;  // トグルボタンの状態のみで判定
		const showCTA2    = cta2Enable;  // トグルボタンの状態のみで判定
		const showCTAWrap = showCTA1||showCTA2;
		const showNewsSection = newsListVisible !== false;

		/* --- メニューオプション --- */
		const menuOpts = menus
			? [{label:'--- メニューを選択 ---',value:'0'}, ...menus.map(m=>({label:m.name,value:String(m.id)}))]
			: [{label:'読み込み中…',value:'0'}];

		const blockProps = useBlockProps({
			className: `paid-block-fv-12 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
		});

		/* --- JSX (editor) --- */
		return(
		<>
			<InspectorControls>
				{/* ロゴ */}
				<PanelBody title="ロゴ設定" initialOpen={false}>
					<br/>
					<MediaUpload allowedTypes={['image']} value={logoImg} onSelect={onSelectLogo}
						render={({open})=>(
							<>
								{logoImg && <><img src={logoImg} alt="" style={{width:'100%',marginBottom:8}}/>
									<Button variant="secondary" style={{marginRight:8}} onClick={()=>setAttributes({logoImg:''})}>削除</Button></>}
								<Button variant="secondary" onClick={open}>{logoImg?'変更':'画像を選択'}</Button>
							</>
						)}/>
					{logoImg && <RangeControl label="ロゴ高さ(%)" value={logoImgHeight} onChange={v=>setAttributes({logoImgHeight:v})} min={50} max={100}/>}
						<br/><br/>
					<URLInput label="ロゴリンク" value={logoUrl} onChange={u=>setAttributes({logoUrl:u})}/>
				</PanelBody>

				{/* CTA */}
				<PanelBody title="CTAボタン" initialOpen={false}>
					<br/>
					<h3>CTA1 設定</h3>
					<ToggleControl label="CTA1を表示" checked={cta1Enable} onChange={v=>setAttributes({cta1Enable:v})}/>
					<RichText tagName="div" value={cta1Text} onChange={v=>setAttributes({cta1Text:v})} placeholder="ご相談はこちら"/>
					<URLInput label="CTA1 URL" value={cta1Url} onChange={u=>setAttributes({cta1Url:u})}/>
					
					<h4>CTA1 スタイル</h4>
					<div style={{marginBottom:16}}>
						<label style={{display:'block', marginBottom:8, fontWeight:600}}>背景色</label>
						<div style={{display:'flex', alignItems:'center', gap:8}}>
							<div style={{
								width:30, height:30, 
								backgroundColor:cta1BgColor, 
								border:'1px solid #ddd', 
								borderRadius:4,
								cursor:'pointer'
							}} onClick={()=>setAttributes({showCta1BgPicker:!attributes.showCta1BgPicker})}></div>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({showCta1BgPicker:!attributes.showCta1BgPicker})}
							>
								色を選択
							</Button>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({cta1BgColor:'transparent'})}
							>
								透明
							</Button>
						</div>
						{attributes.showCta1BgPicker && (
							<Popover onClose={()=>setAttributes({showCta1BgPicker:false})}>
								<ColorPicker 
									color={cta1BgColor} 
									onChange={handleCTA1BgColorChange}
									enableAlpha
								/>
							</Popover>
						)}
					</div>
					
					<div style={{marginBottom:16}}>
						<label style={{display:'block', marginBottom:8, fontWeight:600}}>文字色</label>
						<div style={{display:'flex', alignItems:'center', gap:8}}>
							<div style={{
								width:30, height:30, 
								backgroundColor:cta1TextColor, 
								border:'1px solid #ddd', 
								borderRadius:4,
								cursor:'pointer'
							}} onClick={()=>setAttributes({showCta1TextPicker:!attributes.showCta1TextPicker})}></div>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({showCta1TextPicker:!attributes.showCta1TextPicker})}
							>
								色を選択
							</Button>
						</div>
						{attributes.showCta1TextPicker && (
							<Popover onClose={()=>setAttributes({showCta1TextPicker:false})}>
								<ColorPicker 
									color={cta1TextColor} 
									onChange={v=>setAttributes({cta1TextColor:v})}
									enableAlpha
								/>
							</Popover>
						)}
					</div>
					
					<RangeControl label="ボーダー太さ(px)" value={cta1BorderWidth} onChange={v=>setAttributes({cta1BorderWidth:v})} min={0} max={10}/>
					
					<div style={{marginBottom:16}}>
						<label style={{display:'block', marginBottom:8, fontWeight:600}}>ボーダー色</label>
						<div style={{display:'flex', alignItems:'center', gap:8}}>
							<div style={{
								width:30, height:30, 
								backgroundColor:cta1BorderColor, 
								border:'1px solid #ddd', 
								borderRadius:4,
								cursor:'pointer'
							}} onClick={()=>setAttributes({showCta1BorderPicker:!attributes.showCta1BorderPicker})}></div>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({showCta1BorderPicker:!attributes.showCta1BorderPicker})}
							>
								色を選択
							</Button>
						</div>
						{attributes.showCta1BorderPicker && (
							<Popover onClose={()=>setAttributes({showCta1BorderPicker:false})}>
								<ColorPicker 
									color={cta1BorderColor} 
									onChange={v=>setAttributes({cta1BorderColor:v})}
									enableAlpha
								/>
							</Popover>
						)}
					</div>
					
					<RangeControl label="角丸(px)" value={cta1BorderRadius} onChange={v=>setAttributes({cta1BorderRadius:v})} min={0} max={50}/>
					
					<hr/>
					<h3>CTA2 設定</h3>
					<ToggleControl label="CTA2を表示" checked={cta2Enable} onChange={v=>setAttributes({cta2Enable:v})}/>
					<RichText tagName="div" value={cta2Text} onChange={v=>setAttributes({cta2Text:v})} placeholder="お問い合わせ"/>
					<URLInput label="CTA2 URL" value={cta2Url} onChange={u=>setAttributes({cta2Url:u})}/>
					
					<h4>CTA2 スタイル</h4>
					<div style={{marginBottom:16}}>
						<label style={{display:'block', marginBottom:8, fontWeight:600}}>背景色</label>
						<div style={{display:'flex', alignItems:'center', gap:8}}>
							<div style={{
								width:30, height:30, 
								backgroundColor:cta2BgColor, 
								border:'1px solid #ddd', 
								borderRadius:4,
								cursor:'pointer'
							}} onClick={()=>setAttributes({showCta2BgPicker:!attributes.showCta2BgPicker})}></div>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({showCta2BgPicker:!attributes.showCta2BgPicker})}
							>
								色を選択
							</Button>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({cta2BgColor:'transparent'})}
							>
								透明
							</Button>
						</div>
						{attributes.showCta2BgPicker && (
							<Popover onClose={()=>setAttributes({showCta2BgPicker:false})}>
								<ColorPicker 
									color={cta2BgColor} 
									onChange={handleCTA2BgColorChange}
									enableAlpha
								/>
							</Popover>
						)}
					</div>
					
					<div style={{marginBottom:16}}>
						<label style={{display:'block', marginBottom:8, fontWeight:600}}>文字色</label>
						<div style={{display:'flex', alignItems:'center', gap:8}}>
							<div style={{
								width:30, height:30, 
								backgroundColor:cta2TextColor, 
								border:'1px solid #ddd', 
								borderRadius:4,
								cursor:'pointer'
							}} onClick={()=>setAttributes({showCta2TextPicker:!attributes.showCta2TextPicker})}></div>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({showCta2TextPicker:!attributes.showCta2TextPicker})}
							>
								色を選択
							</Button>
						</div>
						{attributes.showCta2TextPicker && (
							<Popover onClose={()=>setAttributes({showCta2TextPicker:false})}>
								<ColorPicker 
									color={cta2TextColor} 
									onChange={v=>setAttributes({cta2TextColor:v})}
									enableAlpha
								/>
							</Popover>
						)}
					</div>
					
					<RangeControl label="ボーダー太さ(px)" value={cta2BorderWidth} onChange={v=>setAttributes({cta2BorderWidth:v})} min={0} max={10}/>
					
					<div style={{marginBottom:16}}>
						<label style={{display:'block', marginBottom:8, fontWeight:600}}>ボーダー色</label>
						<div style={{display:'flex', alignItems:'center', gap:8}}>
							<div style={{
								width:30, height:30, 
								backgroundColor:cta2BorderColor, 
								border:'1px solid #ddd', 
								borderRadius:4,
								cursor:'pointer'
							}} onClick={()=>setAttributes({showCta2BorderPicker:!attributes.showCta2BorderPicker})}></div>
							<Button 
								variant="secondary" 
								onClick={()=>setAttributes({showCta2BorderPicker:!attributes.showCta2BorderPicker})}
							>
								色を選択
							</Button>
						</div>
						{attributes.showCta2BorderPicker && (
							<Popover onClose={()=>setAttributes({showCta2BorderPicker:false})}>
								<ColorPicker 
									color={cta2BorderColor} 
									onChange={v=>setAttributes({cta2BorderColor:v})}
									enableAlpha
								/>
							</Popover>
						)}
					</div>
					
					<RangeControl label="角丸(px)" value={cta2BorderRadius} onChange={v=>setAttributes({cta2BorderRadius:v})} min={0} max={50}/>
				</PanelBody>

				{/* 背景 */}
				<PanelBody title="背景(画像/動画)" initialOpen={false}>
					<br/>
					<SelectControl label="タイプ" value={bgType}
						options={[{label:'画像',value:'image'},{label:'動画',value:'video'}]}
						onChange={v=>setAttributes({bgType:v})}/>
					{bgType==='image' && <MediaUpload allowedTypes={['image']} value={bgImg} onSelect={onSelectBg}
						render={({open})=>(
							<>
								{bgImg && <><img src={bgImg} alt="" style={{width:'100%',marginBottom:8}}/>
									<Button variant="secondary" style={{marginRight:8}} onClick={()=>setAttributes({bgImg:''})}>削除</Button></>}
								<Button variant="secondary" onClick={open}>{bgImg?'変更':'画像を選択'}</Button>
							</>
						)}/>}
					{bgType==='video' && <>
						<MediaUpload allowedTypes={['video']} value={videoUrl} onSelect={onSelectVid}
							render={({open})=>(
								<>
									{videoUrl && <p style={{marginBottom:8}}>現在: {videoUrl.split('/').pop()}</p>}
									<Button variant="secondary" onClick={open}>{videoUrl?'変更':'動画を選択'}</Button>
								</>
							)}/>
							<br/><br/>
						<RangeControl label="再生速度" value={videoSpeed} onChange={v=>setAttributes({videoSpeed:v})}
							min={0.25} max={2} step={0.05}/>
						<div style={{marginTop:16, padding:10, backgroundColor:'#f0f0f0', borderRadius:4}}>
							<strong>推奨動画形式:</strong>
							<ul style={{marginTop:8, marginBottom:0}}>
								<li>MP4 (H.264) - 全ブラウザ対応</li>
								<li>WebM - Chrome/Firefox対応</li>
								<li>MOV - Safari/iOSのみ</li>
							</ul>
							<p style={{marginTop:8, marginBottom:0, fontSize:'12px'}}>
								※100MB以上の動画は読み込みが遅くなる可能性があります
							</p>
						</div>
					</>}
					<hr/>
					<h3>背景フィルター設定</h3>
					
					{/* フィルタータイプ切り替え */}
					<ToggleControl
						label="グラデーションを使用"
						checked={bgFilterType === 'gradient'}
						onChange={(isGradient) => setAttributes({ 
							bgFilterType: isGradient ? 'gradient' : 'solid',
							// 切り替え時にクリア
							bgFilterColor: isGradient ? '' : (bgFilterColor || '#000000'),
							bgFilterGradient: isGradient ? (bgFilterGradient || 'linear-gradient(45deg, #000000, #ffffff)') : ''
						})}
						help={bgFilterType === 'gradient' ? 'グラデーションフィルターが有効です' : '単色フィルターが有効です'}
					/>
					
					{bgFilterType === 'solid' ? (
						<>
							{/* 単色フィルター */}
							<TextControl
								label="フィルター色"
								value={bgFilterColor}
								onChange={(color) => setAttributes({ bgFilterColor: color })}
								help="例: #000000"
							/>
							<ColorPalette
								value={bgFilterColor}
								onChange={(color) => setAttributes({ bgFilterColor: color })}
								colors={colors}
							/>
						</>
					) : (
						<>
							{/* グラデーションフィルター */}
							<GradientPicker
								value={bgFilterGradient}
								onChange={(gradient) => setAttributes({ bgFilterGradient: gradient })}
								gradients={gradients}
								__nextHasNoMargin
							/>
							
							<TextControl
								label="カスタムグラデーション"
								value={bgFilterGradient}
								onChange={(gradient) => setAttributes({ bgFilterGradient: gradient })}
								help="CSS gradient記法を使用（例: linear-gradient(45deg, #ff0000, #0000ff)）"
							/>
						</>
					)}
					
					{/* 透明度コントロール（単色・グラデーション共通） */}
					<RangeControl
						label="フィルター透明度(%)"
						value={bgFilterOpacity}
						onChange={v=>setAttributes({bgFilterOpacity:v})}
						min={0}
						max={100}
						step={5}
						help={bgFilterType === 'gradient' ? 
							'グラデーション全体の透明度を調整します' : 
							'単色フィルターの透明度を調整します'
						}
					/>
					
					{/* 現在の設定をクリアするボタン */}
					<div style={{marginTop:16}}>
						<Button 
							variant="secondary" 
							onClick={() => setAttributes({
								bgFilterColor: bgFilterType === 'solid' ? '#000000' : '',
								bgFilterGradient: bgFilterType === 'gradient' ? 'linear-gradient(45deg, #000000, #ffffff)' : ''
							})}
						>
							フィルターをリセット
						</Button>
					</div>
				</PanelBody>

				{/* メニュー */}
				<PanelBody title="ナビメニュー" initialOpen={false}>
					{!menus && <Spinner/>}
					{menus && <SelectControl label="メニュー" value={String(navMenuId)} options={menuOpts}
						onChange={v=>setAttributes({navMenuId:parseInt(v,10)})}/>}
				</PanelBody>

				{/* NEWS */}
				<PanelBody title="NEWS設定" initialOpen={false}>
					<ToggleControl label="NEWSセクションを表示" checked={newsListVisible} onChange={v=>setAttributes({newsListVisible:v})}/>
					{newsListVisible && <>
						<SelectControl label="取得方法" value={newsSourceType}
							options={[{label:'最新投稿',value:'latest'},{label:'ID指定',value:'ids'}]}
							onChange={v=>setAttributes({newsSourceType:v})}/>
						{newsSourceType==='latest' &&
							<RangeControl label="表示件数" value={newsPostsNumber}
								onChange={n=>setAttributes({newsPostsNumber:n})} min={1} max={10}/>}
						{newsSourceType==='ids' &&
							<TextControl label="投稿ID(,区切り)" value={newsIds}
								onChange={v=>setAttributes({newsIds:v})} help="例: 12,34,56"/>}
					</>}
				</PanelBody>

				{/* 高さ設定 */}
				<PanelBody title="高さ設定" initialOpen={false}>
					<p>PC用高さ</p>
					<SelectControl
						value={minHeightPc}
						options={minHeightPcClassOptionArr()}
						onChange={(value) => setAttributes({ minHeightPc: value })}
					/>
					<p>タブレット用高さ</p>
					<SelectControl
						value={minHeightTb}
						options={minHeightTbClassOptionArr()}
						onChange={(value) => setAttributes({ minHeightTb: value })}
					/>
					<p>スマートフォン用高さ</p>
					<SelectControl
						value={minHeightSp}
						options={minHeightSpClassOptionArr()}
						onChange={(value) => setAttributes({ minHeightSp: value })}
					/>
				</PanelBody>
			</InspectorControls>

			{/* -------- プレビュー -------- */}
			<div {...blockProps}>
				<header className="fv_in_header">
					<h1 className="logo"><a href={logoUrl || '#'}>
						{logoImg
							? <img src={logoImg} alt="" style={{height:logoImgHeight+'%',width:'auto'}}/>
							: <RichText tagName="span" value={logoText} onChange={v=>setAttributes({logoText:v})} placeholder="LOGO"/>}
					</a></h1>
					<nav className="fv_in_nav"><ul className="header_menu_pc">
						{navMenuItems.length ? navMenuItems.map((item,i)=>(
							<li key={i} className={item.children?.length > 0 ? 'has-submenu' : ''}>
								<a href={item.url}>{item.title}</a>
							
							</li>
						)):
							<li>メニュー未選択</li>}
					</ul></nav>
					<div className="ham_btn drawer_nav_open"><div className="in"><div></div><div></div></div></div>
				</header>

				<div className="fv_inner">
					<RichText tagName="h2" value={headline} onChange={v=>setAttributes({headline:v})}/>
					{showCTAWrap && <div className="cta_wrap">
						{showCTA1 && <a href={cta1Url} style={{
							backgroundColor: cta1BgColor || 'transparent',
							color: cta1TextColor || '#ffffff',
							border: `${cta1BorderWidth || 1}px solid ${cta1BorderColor || '#ffffff'}`,
							borderRadius: `${cta1BorderRadius || 0}px`,
						}}>
							<RichText 
								tagName="span" 
								value={cta1Text} 
								onChange={v=>setAttributes({cta1Text:v})}
								placeholder="ご相談はこちら"
								style={!cta1Text.trim() ? { opacity: 0.5, fontStyle: 'italic' } : {}}
							/>
						</a>}
						{showCTA2 && <a href={cta2Url} style={{
							backgroundColor: cta2BgColor || 'transparent',
							color: cta2TextColor || '#ffffff',
							border: `${cta2BorderWidth || 1}px solid ${cta2BorderColor || '#ffffff'}`,
							borderRadius: `${cta2BorderRadius || 0}px`,
						}}>
							<RichText 
								tagName="span" 
								value={cta2Text} 
								onChange={v=>setAttributes({cta2Text:v})}
								placeholder="お問い合わせ"
								style={!cta2Text.trim() ? { opacity: 0.5, fontStyle: 'italic' } : {}}
							/>
						</a>}
					</div>}
				</div>

				{showNewsSection && <nav className="fv-12_news_list">
					<h3><RichText tagName="span" className="text" value={newsLabel} onChange={v=>setAttributes({newsLabel:v})}/></h3>
					<div className="pagination"><div className="prev">←</div><div className="page">1/4</div><div className="next">→</div></div>
					<ul>
						<li data-news-no="1" className="active">
							<a href="#">
								<span className="date">2024.01.15</span>
								<span className="title">新しいサービスを開始しました新しいサービスを開始しました</span>
							</a>
						</li>
						<li data-news-no="2">
							<a href="#">
								<span className="date">2024.01.10</span>
								<span className="title">お客様の声を更新しました</span>
							</a>
						</li>
						<li data-news-no="3">
							<a href="#">
								<span className="date">2024.01.05</span>
								<span className="title">年末年始の営業についてのお知らせ</span>
							</a>
						</li>
						<li data-news-no="4">
							<a href="#">
								<span className="date">2024.01.01</span>
								<span className="title">新年のご挨拶</span>
							</a>
						</li>
					</ul>
				</nav>}

				<div className="bg_filter" style={getBgFilterStyle()}></div>
				{bgType==='image' && bgImg && <div className="bg_image"><img src={bgImg} alt="" loading="eager"/></div>}
				{bgType==='video' && videoUrl && <div className="bg_video">
					<video autoPlay muted loop playsInline data-playback-rate={videoSpeed} className="lazy-video" preload="metadata">
						<source src={videoUrl} type={videoUrl.endsWith('.mp4')?'video/mp4':videoUrl.endsWith('.webm')?'video/webm':videoUrl.endsWith('.mov')?'video/quicktime':'video/mp4'}/>
					</video>
				</div>}
			</div>
		</>);
	},

/* =============================================================== *
 *  Save
 * =============================================================== */
	save( { attributes } ){

		const {
			logoText, logoUrl, logoImg, logoImgHeight,
			cta1Text, cta1Url, cta1Enable, cta1BgColor, cta1TextColor, cta1BorderWidth, cta1BorderColor, cta1BorderRadius,
			cta2Text, cta2Url, cta2Enable, cta2BgColor, cta2TextColor, cta2BorderWidth, cta2BorderColor, cta2BorderRadius,
			headline, newsLabel, newsListVisible,
			bgType, bgImg, videoUrl, videoSpeed,
			bgFilterType, bgFilterColor, bgFilterGradient, bgFilterOpacity,
			navMenuItems,
			newsSourceType, newsIds, newsPostsNumber,
			minHeightPc, minHeightTb, minHeightSp,
		} = attributes;

		const show1 = cta1Enable&&cta1Text.trim();
		const show2 = cta2Enable&&cta2Text.trim();
		const showWrap = show1||show2;

		const blockProps = useBlockProps.save({
			className: `paid-block-fv-12 ${minHeightPc || 'min-h-pc-100vh'} ${minHeightTb || 'min-h-tb-100vh'} ${minHeightSp || 'min-h-sp-100vh'}`
		});

		/* --- 背景フィルタースタイル --- */
		const getBgFilterStyle = () => {
			if (bgFilterType === 'gradient' && bgFilterGradient) {
				return { 
					background: bgFilterGradient,
					opacity: bgFilterOpacity / 100
				};
			} else if (bgFilterColor) {
				return { 
					backgroundColor: `${bgFilterColor}${Math.round(bgFilterOpacity * 2.55).toString(16).padStart(2, '0')}` 
				};
			}
			return {};
		};

		/* --- インライン JS --- */
		const script = `
(() => {
'use strict';
const ready = () => {

  /* ---- ロゴリンクの設定 ---- */
  document.querySelectorAll('.logo a[data-home-url]').forEach(link => {
    if(!link.href || link.href === '' || link.href === window.location.href + '#') {
      // MyThemeSettingsまたはwindow.locationからホームURLを取得
      if(window.MyThemeSettings && window.MyThemeSettings.home_Url) {
        link.href = window.MyThemeSettings.home_Url;
      } else {
        link.href = window.location.origin;
      }
    }
  });

  /* ---- NEWS ---- */
  document.querySelectorAll('.fv-12_news_list').forEach(list=>{
    const src=list.dataset.sourceType,ids=(list.dataset.postIds||'').trim();
    const cnt=parseInt(list.dataset.postCount,10)||4;
    
    // REST APIのエンドポイントを構築
    let endpoint = '';
    
    // 方法1: wpApiSettingsを使用
    if(window.wpApiSettings && window.wpApiSettings.root) {
      const base = window.wpApiSettings.root;
      endpoint = (src==='ids'&&ids) ? 
        base + 'wp/v2/posts?include=' + ids + '&_embed' :
        base + 'wp/v2/posts?per_page=' + cnt + '&_embed';
    }
    // 方法2: MyThemeSettingsを使用
    else if(window.MyThemeSettings && window.MyThemeSettings.home_Url) {
      endpoint = (src==='ids'&&ids) ? 
        window.MyThemeSettings.home_Url + '/wp-json/wp/v2/posts?include=' + ids + '&_embed' :
        window.MyThemeSettings.home_Url + '/wp-json/wp/v2/posts?per_page=' + cnt + '&_embed';
    }
    // 方法3: 相対パスを使用（最終手段）
    else {
      endpoint = (src==='ids'&&ids) ? 
        '/wp-json/wp/v2/posts?include=' + ids + '&_embed' :
        '/wp-json/wp/v2/posts?per_page=' + cnt + '&_embed';
    }

    console.log('NEWS API Endpoint:', endpoint);

    // 投稿データを取得してHTMLを生成
    fetch(endpoint)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(posts => {
        const ul = list.querySelector('ul');
        ul.innerHTML = ''; // 既存の内容をクリア
        
        // 各投稿をli要素として追加
        posts.forEach((post, index) => {
          const date = new Date(post.date);
          const formattedDate = date.getFullYear() + '.' + 
                               String(date.getMonth() + 1).padStart(2, '0') + '.' + 
                               String(date.getDate()).padStart(2, '0');
          
          const li = document.createElement('li');
          li.dataset.newsNo = index + 1;
          if(index === 0) li.classList.add('active');
          
          li.innerHTML = '<a href="' + post.link + '">' +
                        '<span class="date">' + formattedDate + '</span>' +
                        '<span class="title">' + post.title.rendered + '</span>' +
                        '</a>';
          
          ul.appendChild(li);
        });
        
        // ページネーション機能を設定
        const btnPrev = list.querySelector('.prev');
        const btnNext = list.querySelector('.next');
        const pageText = list.querySelector('.page');
        const items = Array.from(ul.querySelectorAll('li'));
        const total = items.length;
        
        // 初期ページ表示
        if(total > 0) {
          pageText.textContent = '1/' + total;
        }
        
        // 現在のアクティブindexを返す
        const currentIndex = () => items.findIndex(li => li.classList.contains('active'));
        
        // アクティブ切り替え
        const setActive = (i) => {
          items.forEach(li => li.classList.remove('active'));
          items[i].classList.add('active');
          pageText.textContent = (i + 1) + '/' + total;
        };
        
        // ← prev
        if(btnPrev) {
          btnPrev.addEventListener('click', e => {
            e.preventDefault();
            const i = (currentIndex() - 1 + total) % total;
            setActive(i);
          });
        }
        
        // → next
        if(btnNext) {
          btnNext.addEventListener('click', e => {
            e.preventDefault();
            const i = (currentIndex() + 1) % total;
            setActive(i);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        const ul = list.querySelector('ul');
        ul.innerHTML = '<li>投稿を読み込めませんでした</li>';
      });
  });

  /* ---- video ---- */
  document.querySelectorAll('.lazy-video').forEach(v=>{
    // 動画を表示
    v.style.display='block';
    
    // 再生速度を設定
    const playbackRate = parseFloat(v.getAttribute('data-playback-rate')) || ${videoSpeed};
    v.playbackRate = playbackRate;
    
    // 動画を再生する関数
    const playVideo = () => {
      v.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    };
    
    // 既にメタデータが読み込まれている場合は即座に再生
    if(v.readyState >= 1) {
      playVideo();
    } else {
      // メタデータが読み込まれたら再生
      v.addEventListener('loadedmetadata', () => {
        v.playbackRate = playbackRate;
        playVideo();
      });
    }
    
    // ユーザーインタラクション後に再生を試みる（自動再生ポリシー対策）
    document.addEventListener('click', () => {
      if(v.paused) {
        playVideo();
      }
    }, { once: true });
  });
};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',ready):ready();
})();`.trim();

		return (
		<div {...blockProps}>
			<header className="fv_in_header">
				<h1 className="logo"><a href={logoUrl || '#'} data-home-url="">
					{logoImg ? <img src={logoImg} alt="" style={{height:logoImgHeight+'%',width:'auto'}}/> :
						<RichText.Content tagName="span" value={logoText}/>}
				</a></h1>
				<nav className="fv_in_nav"><ul className="header_menu_pc">
					{navMenuItems.map((item,i)=>(
						<li key={i} className={item.children?.length > 0 ? 'has-submenu' : ''}>
							<a href={item.url}>{item.title}</a>
							{item.children?.length > 0 && (
								<ul className="sub-menu">
									{item.children.map((child,j)=>(
										<li key={j}>
											<a href={child.url}>{child.title}</a>
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul></nav>
				<div className="ham_btn drawer_nav_open"><div className="in"><div></div><div></div></div></div>
			</header>

			<div className="fv_inner">
				<RichText.Content tagName="h2" value={headline}/>
				{showWrap && <div className="cta_wrap">
					{show1 && <a href={cta1Url} style={{
						backgroundColor: cta1BgColor || 'transparent',
						color: cta1TextColor || '#ffffff',
						border: `${cta1BorderWidth || 1}px solid ${cta1BorderColor || '#ffffff'}`,
						borderRadius: `${cta1BorderRadius || 0}px`,
					}}>
						<RichText.Content tagName="span" value={cta1Text}/>
					</a>}
					{show2 && <a href={cta2Url} style={{
						backgroundColor: cta2BgColor || 'transparent',
						color: cta2TextColor || '#ffffff',
						border: `${cta2BorderWidth || 1}px solid ${cta2BorderColor || '#ffffff'}`,
						borderRadius: `${cta2BorderRadius || 0}px`,
					}}>
						<RichText.Content tagName="span" value={cta2Text}/>
					</a>}
				</div>}
			</div>

			{(newsListVisible !== false) && <nav className="fv-12_news_list"
				data-source-type={newsSourceType}
				data-post-ids={newsIds}
				data-post-count={newsPostsNumber}>
				<h3><RichText.Content tagName="span" className="text" value={newsLabel}/></h3>
				<div className="pagination"><div className="prev">←</div><div className="page">1/1</div><div className="next">→</div></div>
				<ul></ul>
			</nav>}

			<div className="bg_filter" style={getBgFilterStyle()}></div>
			{bgType==='image'&&bgImg && <div className="bg_image"><img src={bgImg} alt="" loading="eager"/></div>}
			{bgType==='video'&&videoUrl && <div className="bg_video">
				<video autoPlay muted loop playsInline className="lazy-video" data-playback-rate={videoSpeed} preload="metadata">
					<source src={videoUrl} type={videoUrl.endsWith('.mp4')?'video/mp4':videoUrl.endsWith('.webm')?'video/webm':videoUrl.endsWith('.mov')?'video/quicktime':'video/mp4'}/>
				</video>
			</div>}

			{/* インライン JS */}
			<script dangerouslySetInnerHTML={{__html:script}}/>
		</div>);
	},
});
/* === duplicate‑check end === */
}