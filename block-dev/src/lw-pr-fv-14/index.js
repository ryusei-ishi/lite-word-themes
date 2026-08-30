/* =============================================================== *
 * LiteWord – paid‑block‑fv‑14 (CSS変数名修正版)
 * =============================================================== */
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InspectorControls,
	URLInput,
	MediaUpload,
	BlockControls,
	useSettings,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody, Button, SelectControl, Spinner,
	ToggleControl, RangeControl, TextControl, ColorPalette,
	ColorPicker, Popover, GradientPicker, ToolbarGroup, ToolbarButton,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

/* リンク先の指定（共通部品）で使う属性名の対応 */
const LINK_KEYS_CTA2 = { url: 'cta2Url', type: 'cta2LinkType', page: 'cta2PageId', category: 'cta2CategoryId' };

/* リンク先の指定（共通部品）で使う属性名の対応 */
const LINK_KEYS_CTA1 = { url: 'cta1Url', type: 'cta1LinkType', page: 'cta1PageId', category: 'cta1CategoryId' };

/* =============================================================== *
 *  FV のインライン JS（save から使う）
 *
 *  🚨 legacy=true のときは 2026-08-27 以前と **1文字も違わない** 文字列を返すこと。
 *     1文字でも変わると、その版で保存された既存ページが編集画面で
 *     「このブロックには問題が含まれています」になる（deprecated が一致しなくなるため）。
 *
 *  NOTE: WordPress the_content フィルターが && を &#038;&#038; に変換するため、
 *        インラインスクリプト内では && を使用禁止。nested if で代替する。
 * =============================================================== */
const buildFv14Script = ( { videoUrl, videoUrlSp, videoSpeed }, legacy ) => {

	/* 自分のブロックの中だけを見るための下ごしらえ（新版のみ）。
	   document.currentScript は同期実行中しか取れないので、必ず ready() の外で掴む
	   （ready は DOMContentLoaded に遅らせることがあり、その時点では null になる）。 */
	const setup = legacy ? '' : `
var _me = document.currentScript;
var _root = _me ? _me.closest('.lw-pr-fv-14') : null;`;

	/* 🚨 ここが #1170 の本体。旧版は document.querySelectorAll('.lazy-video') と
	   ページ全体を拾っていたため、同じページに別の動画ブロック
	   （fv-7 / lw-bg-1 / lw-pr-fv-13,15,16 / paid-block-fv-12）があると、
	   その <source src> まで自分の動画URLで上書きしていた。 */
	const pick = legacy
		? `  document.querySelectorAll('.lazy-video').forEach(function(v) {`
		: `  var _scope = _root ? _root : document;
  var _sel = _root ? '.lazy-video' : '.lw-pr-fv-14 .lazy-video';
  _scope.querySelectorAll(_sel).forEach(function(v) {`;

	return `
(() => {
'use strict';${setup}
const ready = () => {
  document.querySelectorAll('.logo a[data-home-url]').forEach(link => {
    if(!link.href || link.href === '' || link.href === window.location.href + '#') {
      var mts = window.MyThemeSettings;
      if(mts) { if(mts.home_Url) { link.href = mts.home_Url; return; } }
      link.href = window.location.origin;
    }
  });
  var vidPcUrl = '${videoUrl}';
  var vidSpUrl = '${videoUrlSp || ''}';
  var vidSpeed = ${videoSpeed};
  var getVidType = function(url) {
    if(url.endsWith('.webm')) return 'video/webm';
    if(url.endsWith('.mov')) return 'video/quicktime';
    return 'video/mp4';
  };
${pick}
    v.style.display = 'block';
    var playbackRate = parseFloat(v.getAttribute('data-playback-rate')) || vidSpeed;
    var switchVideo = function() {
      if(!vidSpUrl) return;
      var isSp = window.innerWidth <= 800;
      var newSrc = isSp ? vidSpUrl : vidPcUrl;
      var source = v.querySelector('source');
      if(!source) return;
      if(source.getAttribute('src') === newSrc) return;
      source.setAttribute('src', newSrc);
      source.setAttribute('type', getVidType(newSrc));
      v.load();
      v.playbackRate = playbackRate;
      v.play().catch(function(){});
    };
    if(vidSpUrl) {
      switchVideo();
      var resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(switchVideo, 200);
      });
    }
    v.playbackRate = playbackRate;
    var playVideo = function() { v.play().catch(function(){}); };
    if(v.readyState >= 1) {
      playVideo();
    } else {
      v.addEventListener('loadedmetadata', function() {
        v.playbackRate = playbackRate;
        playVideo();
      });
    }
    document.addEventListener('click', function() {
      if(v.paused) { playVideo(); }
    }, { once: true });
  });
};
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',ready)}else{ready()}
})();
`.trim();
};

/* =============================================================== *
 *  Save の本体（deprecated からも同じものを使う）
 *  legacy=true のときだけ、2026-08-27 以前とまったく同じマークアップを出す。
 * =============================================================== */
const renderFv14Save = ( attributes, legacy ) => {

		const {
			logoText, logoUrl, logoImg, logoImgHeight,
			cta1Text, cta1Url, cta1Enable, cta1BgColor, cta1TextColor, cta1BorderWidth, cta1BorderColor,
			cta2Text, cta2Url, cta2Enable, cta2TextColor,
			leadText, headline, description, headingLevel,
			bgType, bgImgPc, bgImgSp, bgImgAlt, videoUrl, videoUrlSp, videoSpeed,
			bgFilterType, bgFilterColor, bgFilterGradient, bgFilterOpacity,
			navMenuItems,
			minHeightPc, minHeightTb, minHeightSp,
			showHeader,
		} = attributes;

		const show1 = cta1Enable&&cta1Text.trim();
		const show2 = cta2Enable&&cta2Text.trim();
		const showWrap = show1||show2;

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

		/* --- 見出しタグ --- */
		const HeadingTag = `h${headingLevel}`;

		const blockProps = useBlockProps.save({
			className: `lw-pr-fv-14 ${minHeightPc || 'min-h-pc-100vh'} ${minHeightTb || 'min-h-tb-100vh'} ${minHeightSp || 'min-h-sp-100vh'}`,
			style: {
				'--fv-btn-bg-color': cta1BgColor,
				'--fv-btn-text-color': cta1TextColor,
				'--fv-btn-bd-width': `${cta1BorderWidth}px`,
				'--fv-btn-bd-width-color': cta1BorderColor,
				'--fv-cta2-text-color': cta2TextColor,
			}
		});

		/* --- インライン JS --- */
		/* NOTE: WordPress the_content フィルターが && を &#038;&#038; に変換するため、
		   インラインスクリプト内では && を使用禁止。nested if で代替する。 */
		const script = buildFv14Script( { videoUrl, videoUrlSp, videoSpeed }, legacy );

		return (
		<div {...blockProps}>
			{showHeader && <header className="fv_in_header">
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
			</header>}

			<div className="fv_inner">
				{leadText && <RichText.Content tagName="p" className="lead_text" value={leadText}/>}
				<RichText.Content tagName={HeadingTag} className="custom_title" value={headline}/>
				{description && <RichText.Content tagName="p" className="desc" value={description}/>}
				{showWrap && <div className="cta_wrap">
					{show1 && <a href={cta1Url} data-lw-link-type={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS_CTA1).linkType} data-lw-link-id={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS_CTA1).linkId}>
						<RichText.Content tagName="span" value={cta1Text}/>
					</a>}
					{show2 && <a href={cta2Url} data-lw-link-type={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS_CTA2).linkType} data-lw-link-id={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS_CTA2).linkId}>
						<RichText.Content tagName="span" value={cta2Text}/>
					</a>}
				</div>}
			</div>

			<div className="bg_filter" style={getBgFilterStyle()}></div>
			{bgType==='image' && (bgImgPc || bgImgSp) && (
				<picture className="bg_image">
					{bgImgSp && <source srcSet={bgImgSp} media="(max-width: 800px)" />}
					{bgImgPc && <source srcSet={bgImgPc} media="(min-width: 801px)" />}
					<img src={bgImgPc || bgImgSp} alt={bgImgAlt} loading="eager"/>
				</picture>
			)}
			{bgType==='video'&&videoUrl && <div className="bg_video">
				<video autoPlay muted loop playsInline className="lazy-video"
					data-playback-rate={videoSpeed}
					preload="metadata">
					<source src={videoUrl} type={videoUrl.endsWith('.mp4')?'video/mp4':videoUrl.endsWith('.webm')?'video/webm':videoUrl.endsWith('.mov')?'video/quicktime':'video/mp4'}/>
				</video>
			</div>}

			<script dangerouslySetInnerHTML={{__html:script}}/>
		</div>);
};


/* ---------- 二重登録防止 ---------- */
if ( wp.blocks.getBlockType( metadata.name ) ) {
	console.warn( `${metadata.name} already registered.` );
} else {

/* =============================================================== *
 *  Register
 * =============================================================== */
const lwBlockDef = {

/* =============================================================== *
 *  Edit
 * =============================================================== */
	edit( { attributes, setAttributes } ){

		const {
			logoText, logoUrl, logoImg, logoImgHeight,
			cta1Text, cta1Url, cta1Enable, cta1BgColor, cta1TextColor, cta1BorderWidth, cta1BorderColor,
			cta2Text, cta2Url, cta2Enable, cta2TextColor,
			leadText, headline, description, headingLevel,
			bgType, bgImgPc, bgImgSp, bgImgAlt, videoUrl, videoUrlSp, videoSpeed,
			bgFilterType, bgFilterColor, bgFilterGradient, bgFilterOpacity,
			navMenuId, navMenuItems,
			minHeightPc, minHeightTb, minHeightSp,
			showHeader,
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
					const sortedItems = items.sort((a,b)=>a.menu_order-b.menu_order);
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

		/* --- ハンドラ --- */
		const onSelectBgPc =m=>setAttributes({bgImgPc:m.url});
		const onSelectBgSp =m=>setAttributes({bgImgSp:m.url});
		const onSelectLogo =m=>setAttributes({logoImg:m.url});
		const onSelectVid  =m=>setAttributes({videoUrl:m.url});
		const onSelectVidSp=m=>setAttributes({videoUrlSp:m.url});
		const getFileName = (url) => { try { return decodeURIComponent(url.split('/').pop().split('?')[0]); } catch(e) { return url.split('/').pop(); } };
		const onChangeHeadingLevel = (newLevel) => {
			setAttributes({ headingLevel: newLevel });
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

		/* --- 判定 --- */
		const showCTA1    = cta1Enable;
		const showCTA2    = cta2Enable;
		const showCTAWrap = showCTA1||showCTA2;

		/* --- メニューオプション --- */
		const menuOpts = menus
			? [{label:'--- メニューを選択 ---',value:'0'}, ...menus.map(m=>({label:m.name,value:String(m.id)}))]
			: [{label:'読み込み中…',value:'0'}];

		/* --- 見出しタグ --- */
		const HeadingTag = `h${headingLevel}`;

		const blockProps = useBlockProps({
			className: `lw-pr-fv-14 ${minHeightPc} ${minHeightTb} ${minHeightSp}`,
			style: {
				'--fv-btn-bg-color': cta1BgColor,
				'--fv-btn-text-color': cta1TextColor,
				'--fv-btn-bd-width': `${cta1BorderWidth}px`,
				'--fv-btn-bd-width-color': cta1BorderColor,
				'--fv-cta2-text-color': cta2TextColor,
			}
		});

		/* --- JSX (editor) --- */
		return(
		<>
			<BlockControls>
				<ToolbarGroup>
					{[1, 2, 3, 4].map(level => (
						<ToolbarButton
							key={level}
							isPressed={headingLevel === level}
							onClick={() => onChangeHeadingLevel(level)}
						>
							{`H${level}`}
						</ToolbarButton>
					))}
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				{/* ヘッダー表示 */}
				<PanelBody title="ヘッダー設定" initialOpen={true}>
					<ToggleControl label="ヘッダーを表示" checked={showHeader} onChange={v=>setAttributes({showHeader:v})}
						help={showHeader ? 'ロゴ・ナビ・ハンバーガーが表示されます' : 'ヘッダー部分が非表示になります'}/>
				</PanelBody>
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
					<h3>CTA1 設定（背景ボタン）</h3>
					<ToggleControl label="CTA1を表示" checked={cta1Enable} onChange={v=>setAttributes({cta1Enable:v})}/>
					<RichText tagName="div" value={cta1Text} onChange={v=>setAttributes({cta1Text:v})} placeholder="ご相談はこちら"/>
					<URLInput label="CTA1 URL" value={cta1Url} onChange={u=>setAttributes({cta1Url:u})}/>
					<LinkPicker
					    link={lwLinkFromAttrs(attributes, LINK_KEYS_CTA1)}
					    onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS_CTA1))}
					/>
					
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
						</div>
						{attributes.showCta1BgPicker && (
							<Popover onClose={()=>setAttributes({showCta1BgPicker:false})}>
								<ColorPicker 
									color={cta1BgColor} 
									onChange={v=>setAttributes({cta1BgColor:v})}
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
					
					<hr/>
					<h3>CTA2 設定（テキストリンク）</h3>
					<ToggleControl label="CTA2を表示" checked={cta2Enable} onChange={v=>setAttributes({cta2Enable:v})}/>
					<RichText tagName="div" value={cta2Text} onChange={v=>setAttributes({cta2Text:v})} placeholder="お問い合わせ"/>
					<URLInput label="CTA2 URL" value={cta2Url} onChange={u=>setAttributes({cta2Url:u})}/>
					<LinkPicker
					    link={lwLinkFromAttrs(attributes, LINK_KEYS_CTA2)}
					    onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS_CTA2))}
					/>
					
					<h4>CTA2 スタイル</h4>
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
				</PanelBody>

				{/* 背景 */}
				<PanelBody title="背景(画像/動画)" initialOpen={false}>
					<br/>
					<SelectControl label="タイプ" value={bgType}
						options={[{label:'画像',value:'image'},{label:'動画',value:'video'}]}
						onChange={v=>setAttributes({bgType:v})}/>
					{bgType==='image' && <>
						<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>PC用画像</p>
						<MediaUpload allowedTypes={['image']} value={bgImgPc} onSelect={onSelectBgPc}
							render={({open})=>(
								<>
									{bgImgPc && <><img src={bgImgPc} alt="" style={{width:'100%',marginBottom:8}}/>
										<Button variant="secondary" style={{marginRight:8}} onClick={()=>setAttributes({bgImgPc:''})}>削除</Button></>}
									<Button variant="secondary" onClick={open}>{bgImgPc?'変更':'画像を選択'}</Button>
								</>
							)}/>
						<br/><br/>
						<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>スマホ用画像</p>
						<MediaUpload allowedTypes={['image']} value={bgImgSp} onSelect={onSelectBgSp}
							render={({open})=>(
								<>
									{bgImgSp && <><img src={bgImgSp} alt="" style={{width:'100%',marginBottom:8}}/>
										<Button variant="secondary" style={{marginRight:8}} onClick={()=>setAttributes({bgImgSp:''})}>削除</Button></>}
									<Button variant="secondary" onClick={open}>{bgImgSp?'変更':'画像を選択'}</Button>
								</>
							)}/>
						<br/><br/>
						<TextControl
							label="画像のalt属性"
							value={bgImgAlt}
							onChange={(value) => setAttributes({ bgImgAlt: value })}
							placeholder="画像の説明を入力"
						/>
					</>}
					{bgType==='video' && <>
						<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>PC用動画</p>
						<MediaUpload allowedTypes={['video']} value={videoUrl} onSelect={onSelectVid}
							render={({open})=>(
								<>
									{videoUrl && <><p style={{marginBottom:8, fontSize:'13px', wordBreak:'break-all'}}>{getFileName(videoUrl)}</p>
										<Button variant="secondary" style={{marginRight:8}} onClick={()=>setAttributes({videoUrl:''})}>削除</Button></>}
									<Button variant="secondary" onClick={open}>{videoUrl?'変更':'動画を選択'}</Button>
								</>
							)}/>
						<br/><br/>
						<p style={{ fontWeight: 'bold', marginBottom: '8px' }}>スマホ用動画</p>
						<MediaUpload allowedTypes={['video']} value={videoUrlSp} onSelect={onSelectVidSp}
							render={({open})=>(
								<>
									{videoUrlSp && <><p style={{marginBottom:8, fontSize:'13px', wordBreak:'break-all'}}>{getFileName(videoUrlSp)}</p>
										<Button variant="secondary" style={{marginRight:8}} onClick={()=>setAttributes({videoUrlSp:''})}>削除</Button></>}
									<Button variant="secondary" onClick={open}>{videoUrlSp?'変更':'動画を選択'}</Button>
								</>
							)}/>
						<p style={{marginTop:8, fontSize:'12px', color:'#666'}}>※未設定の場合はPC用動画が使われます</p>
						<br/>
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
					
					<ToggleControl
						label="グラデーションを使用"
						checked={bgFilterType === 'gradient'}
						onChange={(isGradient) => setAttributes({ 
							bgFilterType: isGradient ? 'gradient' : 'solid',
							bgFilterColor: isGradient ? '' : (bgFilterColor || '#000000'),
							bgFilterGradient: isGradient ? (bgFilterGradient || 'linear-gradient(45deg, #000000, #ffffff)') : ''
						})}
						help={bgFilterType === 'gradient' ? 'グラデーションフィルターが有効です' : '単色フィルターが有効です'}
					/>
					
					{bgFilterType === 'solid' ? (
						<>
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
				{showHeader && <header className="fv_in_header">
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
				</header>}

				<div className="fv_inner">
					<RichText 
						tagName="p" 
						className="lead_text"
						value={leadText} 
						onChange={v=>setAttributes({leadText:v})}
						placeholder="リードテキストを入力"
					/>
					<RichText
						tagName={HeadingTag}
						className="custom_title"
						value={headline}
						onChange={v=>setAttributes({headline:v})}
						placeholder="メインタイトルを入力"
					/>
					<RichText 
						tagName="p" 
						className="desc"
						value={description} 
						onChange={v=>setAttributes({description:v})}
						placeholder="説明文を入力"
					/>
					{showCTAWrap && <div className="cta_wrap">
						{showCTA1 && <div className="a">
							<RichText
								tagName="span"
								value={cta1Text}
								onChange={v=>setAttributes({cta1Text:v})}
								placeholder="ご相談はこちら"
								style={!cta1Text.trim() ? { opacity: 0.5, fontStyle: 'italic' } : {}}
							/>
						</div>}
						{showCTA2 && <div className="a">
							<RichText
								tagName="span"
								value={cta2Text}
								onChange={v=>setAttributes({cta2Text:v})}
								placeholder="お問い合わせ"
								style={!cta2Text.trim() ? { opacity: 0.5, fontStyle: 'italic' } : {}}
							/>
						</div>}
					</div>}
				</div>

				<div className="bg_filter" style={getBgFilterStyle()}></div>
				{bgType==='image' && (bgImgPc || bgImgSp) && <div className="bg_image"><img src={bgImgPc || bgImgSp} alt={bgImgAlt} loading="eager"/></div>}
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
		return renderFv14Save( attributes, false );
	},

	/* 旧マークアップ（インラインJSがページ内の .lazy-video を全部つかんでいた版）で
	   保存された既存ページを受け止める。2026-08-27 追加（#1170）。
	   ⚠️ 属性は1つも変えていない。変わったのは save が出すスクリプトの文字列だけ。
	   ⚠️ 既存ページのマークアップは編集して保存し直すまで旧スクリプトのまま。
	      「新しく挿れたぶんが直る」「開いて保存すれば直る」という直り方になる。 */
	deprecated: [
		{
			attributes: metadata.attributes,
			save: ( { attributes } ) => renderFv14Save( attributes, true ),
		},
	],
};

/* ------------------------------------------------------------------
 * #1169（2026-08-27）既定値の他社CDN直リンクを自社素材に差し替えた。
 * 既定値と同じ値はブロックコメントに書かれないので、既定値のまま使っている
 * 既存ページは「保存HTMLは旧URL／ブロックは新しい既定値」で食い違う。
 * 旧既定値を持った版を残して、開いて保存し直しても画像が入れ替わらないようにする。
 * 🚨 save は現行と同じ関数をそのまま渡す（マークアップは変えていない）。
 * ------------------------------------------------------------------ */
const LW_1169_OLD = JSON.parse( JSON.stringify( metadata.attributes ) );
LW_1169_OLD.bgImgPc.default = "https://plus.unsplash.com/premium_photo-1685868556097-641c237f3fa5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1328";

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
/* === duplicate‑check end === */
}