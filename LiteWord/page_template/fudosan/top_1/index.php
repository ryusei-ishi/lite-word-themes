<!-- wp:wdl/lw-pr-fv-14 {"logoText":"まちなみ不動産","leadText":"地域密着 2005年から","headline":"この街のことなら、\u003cbr\u003eだいたい分かります。","description":"駅からの帰り道の暗さも、ゴミ置き場の場所も、朝の踏切の混み方も。\u003cbr\u003e間取りの前に、暮らしの話をさせてください。","cta1Text":"物件を見る","cta1Url":"#search","cta2Text":"来店のご予約","cta2Url":"#contact","bgImgPc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_fv_01.webp","bgImgSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_fv_01.webp","bgFilterColor":"#0b1f25","bgFilterOpacity":66,"navMenuItems":[{"title":"物件を探す","url":"#search"},{"title":"エリア","url":"#area"},{"title":"お部屋探しの流れ","url":"#flow"},{"title":"売却のご相談","url":"#sell"},{"title":"会社案内","url":"#company"}]} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-100vh min-h-tb-100vh min-h-sp-100vh" style="--fv-btn-bg-color:var(--color-main);--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:var(--color-main);--fv-cta2-text-color:#ffffff"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>まちなみ不動産</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="#search">物件を探す</a></li><li class=""><a href="#area">エリア</a></li><li class=""><a href="#flow">お部屋探しの流れ</a></li><li class=""><a href="#sell">売却のご相談</a></li><li class=""><a href="#company">会社案内</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><p class="lead_text">地域密着 2005年から</p><h2 class="custom_title">この街のことなら、<br>だいたい分かります。</h2><p class="desc">駅からの帰り道の暗さも、ゴミ置き場の場所も、朝の踏切の混み方も。<br>間取りの前に、暮らしの話をさせてください。</p><div class="cta_wrap"><a href="#search"><span>物件を見る</span></a><a href="#contact"><span>来店のご予約</span></a></div></div><div class="bg_filter" style="background-color:#0b1f25a8"></div><picture class="bg_image"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_fv_01.webp" media="(max-width: 800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_fv_01.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_fv_01.webp" alt="" loading="eager"/></picture><script>(() => {
'use strict';
var _me = document.currentScript;
var _root = _me ? _me.closest('.lw-pr-fv-14') : null;
const ready = () => {
  document.querySelectorAll('.logo a[data-home-url]').forEach(link => {
    if(!link.href || link.href === '' || link.href === window.location.href + '#') {
      var mts = window.MyThemeSettings;
      if(mts) { if(mts.home_Url) { link.href = mts.home_Url; return; } }
      link.href = window.location.origin;
    }
  });
  var vidPcUrl = '';
  var vidSpUrl = '';
  var vidSpeed = 1;
  var getVidType = function(url) {
    if(url.endsWith('.webm')) return 'video/webm';
    if(url.endsWith('.mov')) return 'video/quicktime';
    return 'video/mp4';
  };
  var _scope = _root ? _root : document;
  var _sel = _root ? '.lazy-video' : '.lw-pr-fv-14 .lazy-video';
  _scope.querySelectorAll(_sel).forEach(function(v) {
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
})();</script></div>
<!-- /wp:wdl/lw-pr-fv-14 -->
<!-- wp:wdl/paid-block-link-2 {"titleBdColor":"#ffffff","bgImageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_nav_bg.webp","bgImageAlt":"夕方の住宅街","bgFilterColor":"#000","bgFilterOpacity":0.68,"borderColor":"#ffffff","borderSize":1,"backgroundColor":"#000000","backgroundOpacity":0.25} -->
<div class="wp-block-wdl-paid-block-link-2 paid-block-link-2"><div class="this_wrap"><h2 class="main_ttl"><span class="main"><span class="main_title_text" data-lw_font_set="" style="font-weight:500;color:#fff">どちらのご相談ですか</span><div class="bd" style="background-color:#ffffff"></div></span><span class="sub">SERVICE</span></h2><p class="main_explanation">はじめての方も、そうでない方も。<span class="lw-br on_500px"></span>まずは当てはまるところからご覧ください。</p><ul class="this_items"><li class="item" style="border-color:#ffffff;border-width:1px;border-style:solid"><div class="bg_item" style="background-color:#000000;opacity:0.25"></div><a href="#search" class="link"><span class="item_ttl"><h4 class="ttl" data-lw_font_set="" style="font-weight:500;color:#fff">借りる</h4><p class="desc" data-lw_font_set="" style="font-weight:400;color:#fff">賃貸のお部屋を探す<br>初期費用の目安も出せます</p></span></a></li><li class="item" style="border-color:#ffffff;border-width:1px;border-style:solid"><div class="bg_item" style="background-color:#000000;opacity:0.25"></div><a href="#search" class="link"><span class="item_ttl"><h4 class="ttl" data-lw_font_set="" style="font-weight:500;color:#fff">買う</h4><p class="desc" data-lw_font_set="" style="font-weight:400;color:#fff">中古の戸建て・マンション<br>資金のご相談から</p></span></a></li><li class="item" style="border-color:#ffffff;border-width:1px;border-style:solid"><div class="bg_item" style="background-color:#000000;opacity:0.25"></div><a href="#sell" class="link"><span class="item_ttl"><h4 class="ttl" data-lw_font_set="" style="font-weight:500;color:#fff">売る</h4><p class="desc" data-lw_font_set="" style="font-weight:400;color:#fff">査定は無料です<br>相場だけ知りたい方も</p></span></a></li></ul></div><div class="bg_filter" style="background-color:#000;opacity:0.68"></div><div class="bg_image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_nav_bg.webp" alt="夕方の住宅街"/></div></div>
<!-- /wp:wdl/paid-block-link-2 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"新着の物件","subTitle":"PROPERTIES","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l" id="search"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">PROPERTIES</span><span class="main">新着の物件</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">毎朝、空室の状況を確かめてから載せています。<span class="lw-br on_500px"></span>「もう決まっていました」をできるだけ無くすためです。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/paid-block-content-7 {"pcColumns":"3","titleTag":"h3"} -->
<div class="wp-block-wdl-paid-block-content-7 paid-block-content-7"><ul class="paid-block-content-7__inner"><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_room_01.webp" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">〇〇町 2LDK</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)"><strong>8.2万円</strong><br>〇〇駅 徒歩7分／築8年／58㎡<br>南向き・独立洗面・追い焚き</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_room_02.webp" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">〇〇3丁目 1LDK</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)"><strong>6.8万円</strong><br>〇〇駅 徒歩4分／築3年／42㎡<br>対面キッチン・宅配ボックス</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_room_03.webp" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">〇〇台 3DK</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)"><strong>5.9万円</strong><br>バス10分＋徒歩3分／築22年／62㎡<br>和室あり・駐車場2台込み</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_room_04.webp" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">中古戸建 〇〇町</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)"><strong>2,480万円</strong><br>〇〇駅 徒歩12分／築22年／4LDK<br>土地128㎡・カーポート付き</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_room_05.webp" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">中古マンション 〇〇駅前</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)"><strong>1,980万円</strong><br>〇〇駅 徒歩3分／築12年／3LDK<br>7階・南東角・管理費込み</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_room_06.webp" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">〇〇町 1R</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)"><strong>4.8万円</strong><br>〇〇駅 徒歩10分／築5年／22㎡<br>学生さん歓迎・ネット無料</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-content-7 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">※ 掲載していない物件もあります。ご希望の条件をお伝えいただければ、<span class="lw-br on_500px"></span>他社さんが扱っている分も含めてお探しします。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"エリアから探す","subTitle":"AREA","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l" id="area"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">AREA</span><span class="main">エリアから探す</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">同じ市内でも、住み心地はまるで違います。<span class="lw-br on_500px"></span>暮らし方から選んでいただけるように分けました。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-banner-info-05 {"maxWidth":900,"filterBackgroundColor":"#000","filterOpacity":0.45,"items":[{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_01.webp","title":"〇〇駅の周辺","description":"通勤が最優先の方へ。徒歩10分圏に絞って探せます","linkUrl":"","openInNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_02.webp","title":"川沿いの一帯","description":"朝が静かな地域です。散歩と自転車が気持ちいい","linkUrl":"","openInNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_03.webp","title":"学校が近い〇〇台","description":"小中学校まで徒歩圏。同じ年頃のお子さんが多い地域","linkUrl":"","openInNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_04.webp","title":"新しい家が増えた〇〇の丘","description":"築浅の戸建てが中心。駐車場2台の物件が探せます","linkUrl":"","openInNewTab":false}]} -->
<nav class="wp-block-wdl-lw-banner-info-05 lw-banner-info-05"><ul class="lw-banner-info-05__wrap" style="max-width:900px"><li><div class="a"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_01.webp" alt="画像サムネイル"/><h3 class="title" style="font-weight:800" data-lw_font_set="Noto Sans JP"><span>〇〇駅の周辺</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>通勤が最優先の方へ。徒歩10分圏に絞って探せます</span></p><div class="filter" style="background-color:#000;opacity:0.45"></div></div></li><li><div class="a"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_02.webp" alt="画像サムネイル"/><h3 class="title" style="font-weight:800" data-lw_font_set="Noto Sans JP"><span>川沿いの一帯</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>朝が静かな地域です。散歩と自転車が気持ちいい</span></p><div class="filter" style="background-color:#000;opacity:0.45"></div></div></li><li><div class="a"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_03.webp" alt="画像サムネイル"/><h3 class="title" style="font-weight:800" data-lw_font_set="Noto Sans JP"><span>学校が近い〇〇台</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>小中学校まで徒歩圏。同じ年頃のお子さんが多い地域</span></p><div class="filter" style="background-color:#000;opacity:0.45"></div></div></li><li><div class="a"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_area_04.webp" alt="画像サムネイル"/><h3 class="title" style="font-weight:800" data-lw_font_set="Noto Sans JP"><span>新しい家が増えた〇〇の丘</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>築浅の戸建てが中心。駐車場2台の物件が探せます</span></p><div class="filter" style="background-color:#000;opacity:0.45"></div></div></li></ul></nav>
<!-- /wp:wdl/lw-banner-info-05 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.07,"filterTypeTb":"solid","filterColorTb":"var(--color-main)","opacityTb":0.07,"filterTypeSp":"solid","filterColorSp":"var(--color-main)","opacitySp":0.07} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.07;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.07;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.07;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"選ばれている理由","subTitle":"REASON","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l" id="reason"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">REASON</span><span class="main">選ばれている理由</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">大きな会社ではありません。<span class="lw-br on_500px"></span>そのぶん、この3つだけは他所に負けないつもりでいます。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/solution-1 -->
<div class="wp-block-wdl-solution-1 solution-1" data-lw_font_set=""><div class="solution-1_inner"><div class="solution-1_content"><figure data-border-color="var(--color-main)" style="border:2px solid;border-color:var(--color-main)"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_reason_01.webp" alt=""/></figure><div class="solution-1_text"><p style="white-space:pre-wrap">この街で2005年から
貸主さんと直接話せます</p></div></div><div class="solution-1_content"><figure data-border-color="var(--color-main)" style="border:2px solid;border-color:var(--color-main)"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_reason_02.webp" alt=""/></figure><div class="solution-1_text"><p style="white-space:pre-wrap">見えないお金も
先にぜんぶ出します</p></div></div><div class="solution-1_content"><figure data-border-color="var(--color-main)" style="border:2px solid;border-color:var(--color-main)"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_reason_03.webp" alt=""/></figure><div class="solution-1_text"><p style="white-space:pre-wrap">鍵を預かっているので
内見は最短で当日</p></div></div></div></div>
<!-- /wp:wdl/solution-1 --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"お部屋探しの流れ","subTitle":"FLOW","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l" id="flow"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">FLOW</span><span class="main">お部屋探しの流れ</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">ご相談から鍵をお渡しするまで、だいたい2〜3週間です。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/paid-block-lw-step-3 {"ulMaxWidth":1000,"fontSizeClass":"font_size_m","titleTag":"h3"} -->
<div class="wp-block-wdl-paid-block-lw-step-3 paid-block-lw-step-3 font_size_m"><ul class="lw-step-2__inner" style="max-width:1000px"><li class="lw-step-2__li" style="border-color:var(--color-main)"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">01</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="">ご相談</h3><p class="lw-step-2__li_text" data-lw_font_set="">ご来店・お電話・オンラインのどれでも。予算と時期だけ決まっていれば十分です。</p></div></li><li class="lw-step-2__li" style="border-color:var(--color-main)"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">02</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="">条件を整理します</h3><p class="lw-step-2__li_text" data-lw_font_set="">譲れないところと、譲れるところを一緒に分けます。ここがいちばん大事です。</p></div></li><li class="lw-step-2__li" style="border-color:var(--color-main)"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">03</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="">内見</h3><p class="lw-step-2__li_text" data-lw_font_set="">1日に3〜4件がめやすです。鍵をお預かりしている物件は当日でもご案内できます。</p></div></li><li class="lw-step-2__li" style="border-color:var(--color-main)"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">04</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="">お申し込み・入居審査</h3><p class="lw-step-2__li_text" data-lw_font_set="">身分証と収入の分かる書類をご用意ください。審査は2〜4日ほどです。</p></div></li><li class="lw-step-2__li" style="border-color:var(--color-main)"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">05</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="">ご契約</h3><p class="lw-step-2__li_text" data-lw_font_set="">重要事項の説明をしてから契約書に押印いただきます。60分ほど見てください。</p></div></li><li class="lw-step-2__li" style="border-color:var(--color-main)"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">06</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="">鍵のお渡し</h3><p class="lw-step-2__li_text" data-lw_font_set="">お引っ越しの前日か当日にお渡しします。設備の使い方もその場でご説明します。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-lw-step-3 -->
<!-- wp:wdl/lw-button-01 {"fontSize":125,"maxWidth":440,"maxWidthSp":320,"paddingSize":"L","innerPaddingSize":"L","backgroundColor":"color-mix(in srgb, var(--color-main) 50%, #000)","textColor":"#ffffff","borderRadius":4,"alignment":"center","alignmentSp":"center","marginTop":10,"marginBottom":10} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-L align-center align-sp-center" style="margin-top:10px;margin-bottom:10px;--button-01-max-width-sp:320px"><a href="#contact" style="max-width:440px;font-size:125%;background-color:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;padding:1.3em 1.6em;text-align:center;text-decoration:none;border-radius:4px;border-width:0px;border-style:none;border-color:#000000">来店のご予約をする</a></div>
<!-- /wp:wdl/lw-button-01 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-voice-2 {"filterColor":"var(--color-main)","filterOpacity":0.9} -->
<div class="wp-block-wdl-paid-block-voice-2 paid-block-voice-2"><div class="paid-block-voice-2__wrap"><h2 class="ttl"><span class="main">お客様の声</span><span class="sub">VOICE</span></h2><p class="explanation">契約のあとにいただいたご感想を、そのまま載せています。</p><ul class="voice_list"><li><div class="image"><div class="in"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_voice_01.webp" alt="ご感想をくださった20代女性のお客様"/><span class="thanks" data-lw_font_set="Dancing Script" style="font-weight:400;color:var(--color-black)">thank you</span></div></div><div class="text_in"><h3 class="name"><span class="sub" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">20代・女性 ／ 賃貸・初めての一人暮らし</span><span class="main"><span class="big" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">木下</span><span class="small" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">さま</span></span></h3><p class="comment" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">初期費用がいくらになるのか分からないのが一番こわかったのですが、最初の相談のときに紙に全部書き出してもらえました。あとから増えた項目がひとつも無かったです。</p></div></li><li><div class="image"><div class="in"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_voice_02.webp" alt="ご感想をくださった30代男性のお客様"/><span class="thanks" data-lw_font_set="Dancing Script" style="font-weight:400;color:var(--color-black)">thank you</span></div></div><div class="text_in"><h3 class="name"><span class="sub" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">30代・男性 ／ 賃貸・転勤での引っ越し</span><span class="main"><span class="big" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">相馬</span><span class="small" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">さま</span></span></h3><p class="comment" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">転勤が急に決まって、こちらに来られたのは1回だけでした。動画で部屋を撮って送ってもらえたので、遠くからでも決められました。</p></div></li><li><div class="image"><div class="in"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_voice_03.webp" alt="ご感想をくださった40代女性のお客様"/><span class="thanks" data-lw_font_set="Dancing Script" style="font-weight:400;color:var(--color-black)">thank you</span></div></div><div class="text_in"><h3 class="name"><span class="sub" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">40代・女性 ／ 中古戸建てのご購入</span><span class="main"><span class="big" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">西野</span><span class="small" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">さま</span></span></h3><p class="comment" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">見に行った家の悪いところも先に教えてくれました。良いことしか言わない会社だったら、たぶん決めていなかったと思います。</p></div></li><li><div class="image"><div class="in"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_voice_04.webp" alt="ご感想をくださった60代男性のお客様"/><span class="thanks" data-lw_font_set="Dancing Script" style="font-weight:400;color:var(--color-black)">thank you</span></div></div><div class="text_in"><h3 class="name"><span class="sub" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">60代・男性 ／ ご実家の売却</span><span class="main"><span class="big" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">大久保</span><span class="small" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">さま</span></span></h3><p class="comment" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">母の家をどうするか何年も決められずにいました。急がなくていいと言ってもらえたので、相場だけ聞くつもりで伺って、結局1年かけて売りました。</p></div></li></ul></div><div class="filter" style="background-color:var(--color-main);opacity:0.9"></div></div>
<!-- /wp:wdl/paid-block-voice-2 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"売却をお考えの方へ","subTitle":"SELL","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l" id="sell"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">SELL</span><span class="main">売却をお考えの方へ</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">「まだ売ると決めていない」という段階のご相談がいちばん多いです。<span class="lw-br on_500px"></span>査定は無料で、そのあとお願いされなくてもかまいません。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-content-8 {"innerMaxWidth":1040,"columnClass":"clm_3","mainAlign":"center","showButton":false} -->
<div class="wp-block-wdl-lw-content-8 lw-content-8"><ul class="lw-content-8__inner clm_3" style="max-width:1040px;margin:0 auto"><li class="lw-content-8__li" style="border-color:var(--color-main);border-width:2px;border-style:solid;padding-top:24px;padding-bottom:24px;padding-left:24px;padding-right:24px;border-radius:8px"><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid"><span class="sub" data-lw_font_set="" style="font-weight:600;border-color:var(--color-main);border-width:1px;border-style:solid;display:inline-block;color:var(--color-main);background-color:#ffffff">SELL 01</span><span class="main center" data-lw_font_set="" style="font-weight:700">相場だけ知りたい方へ</span></h3><p class="lw-content-8__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">近隣で実際にいくらで売れたかをお調べして、紙にしてお渡しします。その場でご依頼いただく必要はありません。訪問をご希望でなければ、資料だけお送りします。</p></div></li><li class="lw-content-8__li" style="border-color:var(--color-main);border-width:2px;border-style:solid;padding-top:24px;padding-bottom:24px;padding-left:24px;padding-right:24px;border-radius:8px"><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid"><span class="sub" data-lw_font_set="" style="font-weight:600;border-color:var(--color-main);border-width:1px;border-style:solid;display:inline-block;color:var(--color-main);background-color:#ffffff">SELL 02</span><span class="main center" data-lw_font_set="" style="font-weight:700">急かしません</span></h3><p class="lw-content-8__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">ご実家やご相続の物件は、決まるまで数年かかることもあります。売り出す時期はご家族で話がまとまってからで結構です。こちらから催促のご連絡はしません。</p></div></li><li class="lw-content-8__li" style="border-color:var(--color-main);border-width:2px;border-style:solid;padding-top:24px;padding-bottom:24px;padding-left:24px;padding-right:24px;border-radius:8px"><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid"><span class="sub" data-lw_font_set="" style="font-weight:600;border-color:var(--color-main);border-width:1px;border-style:solid;display:inline-block;color:var(--color-main);background-color:#ffffff">SELL 03</span><span class="main center" data-lw_font_set="" style="font-weight:700">売る前の手入れも相談できます</span></h3><p class="lw-content-8__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">直したほうが高く売れる場所と、直しても金額が変わらない場所があります。費用をかけずに済むところは、はっきり「そのままで大丈夫です」とお伝えします。</p></div></li></ul></div>
<!-- /wp:wdl/lw-content-8 -->
<!-- wp:wdl/lw-button-01 {"fontSize":125,"maxWidth":440,"maxWidthSp":320,"paddingSize":"L","innerPaddingSize":"L","backgroundColor":"color-mix(in srgb, var(--color-main) 50%, #000)","textColor":"#ffffff","borderRadius":4,"alignment":"center","alignmentSp":"center","marginTop":10,"marginBottom":10} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-L align-center align-sp-center" style="margin-top:10px;margin-bottom:10px;--button-01-max-width-sp:320px"><a href="#contact" style="max-width:440px;font-size:125%;background-color:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;padding:1.3em 1.6em;text-align:center;text-decoration:none;border-radius:4px;border-width:0px;border-style:none;border-color:#000000">売却のご相談をする</a></div>
<!-- /wp:wdl/lw-button-01 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"お知らせ","subTitle":"NEWS","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">NEWS</span><span class="main">お知らせ</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">休業のお知らせ、地域の話、家探しの豆知識など。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-post-list-2 {"numberOfPosts":3,"categoryId":"","catBgColor":"color-mix(in srgb, var(--color-main) 50%, #000)"} -->
<div class="wp-block-wdl-lw-post-list-2"><div class="filter" style="background:color-mix(in srgb, var(--color-main) 50%, #000)"></div><div class="lw_post-list-2" data-number="3" data-category="" data-type="post" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="color-mix(in srgb, var(--color-main) 50%, #000)" data-title-font="Noto Sans JP" data-title-font-weight="400" data-p-font="Noto Sans JP" data-p-font-weight="400"><ul class="post-list-2__wrap"></ul></div><script>
                        document.addEventListener('DOMContentLoaded', () => {
                            const postList2Container = document.querySelector('.lw_post-list-2');
                            
                            if (postList2Container) {
                                const postList2NumberOfPosts = postList2Container.getAttribute('data-number') || 4;
                                const postList2CategoryId = postList2Container.getAttribute('data-category');
                                const postList2PostType = postList2Container.getAttribute('data-type') || 'post';

                                const postList2DateFont = postList2Container.getAttribute('data-date-font');
                                const postList2DateFontWeight = postList2Container.getAttribute('data-date-font-weight');
                                const postList2CatFont = postList2Container.getAttribute('data-cat-font');
                                const postList2CatFontWeight = postList2Container.getAttribute('data-cat-font-weight');
                                const postList2CatBgColor = postList2Container.getAttribute('data-cat-bg-color');
                                const postList2TitleFont = postList2Container.getAttribute('data-title-font');
                                const postList2TitleFontWeight = postList2Container.getAttribute('data-title-font-weight');
                                const postList2PFont = postList2Container.getAttribute('data-p-font');
                                const postList2PFontWeight = postList2Container.getAttribute('data-p-font-weight');

                                let postList2ApiUrl = `${MyThemeSettings.home_Url}/wp-json/wp/v2/${postList2PostType === 'post' ? 'posts' : postList2PostType}?per_page=${postList2NumberOfPosts}&orderby=date&order=desc&_embed`;
                                if (postList2CategoryId) {
                                    postList2ApiUrl += `&categories=${postList2CategoryId}`;
                                }

                                fetch(postList2ApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('投稿の取得に失敗しました');
                                        }
                                        return response.json();
                                    })
                                    .then(posts => {
                                        let postList2Html = '<ul class="post-list-2__wrap">';

                                        posts.forEach(post => {
                                            const postList2Date = new Date(post.date).toLocaleDateString();
                                            const postList2Title = post.title.rendered;
                                            const postList2Link = post.link;
                                            const postList2Category = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
                                                ? post._embedded['wp:term'][0][0].name
                                                : 'カテゴリーなし';
                                            const postList2Thumbnail = post._embedded && post._embedded['wp:featuredmedia']
                                                ? post._embedded['wp:featuredmedia'][0].source_url
                                                : `${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp`;
                                            const postList2Excerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            postList2Html += `
                                                <li>
                                                    <a href="${postList2Link}">
                                                        <figure><img loading="lazy" src="${postList2Thumbnail}" alt="${postList2Title}"></figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="cat" style="background-color: ${postList2CatBgColor}; font-weight: ${postList2CatFontWeight};" data-lw_font_set="${postList2CatFont}">
                                                                    <span>${postList2Category}</span>
                                                                </div>
                                                                <div class="date" style="font-weight: ${postList2DateFontWeight};" data-lw_font_set="${postList2DateFont}">
                                                                    <span>${postList2Date}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: ${postList2TitleFontWeight};" data-lw_font_set="${postList2TitleFont}">${postList2Title}</h3>
                                                            <p style="font-weight: ${postList2PFontWeight};" data-lw_font_set="${postList2PFont}">${postList2Excerpt}</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            `;
                                        });

                                        postList2Html += '</ul>';
                                        postList2Container.innerHTML = postList2Html;
                                    })
                                    .catch(error => {
                                        console.error('投稿を取得できませんでした:', error);
                                        postList2Container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
                                    });
                            }
                        });
                        </script></div>
<!-- /wp:wdl/lw-post-list-2 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"会社案内","subTitle":"COMPANY","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l" id="company"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">COMPANY</span><span class="main">会社案内</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:wdl/lw-company-2 {"maxWidth":860,"contents":[{"dt":"会社名","dd":"まちなみ不動産"},{"dt":"代表者","dd":"〇〇 〇〇"},{"dt":"所在地","dd":"〒000-0000 〇〇県〇〇市〇〇町1-2-3"},{"dt":"アクセス","dd":"〇〇線 〇〇駅 東口から徒歩3分"},{"dt":"電話番号","dd":"000-0000-0000"},{"dt":"営業時間","dd":"9:30〜18:30（定休日：水曜・第2火曜）"},{"dt":"宅地建物取引業免許","dd":"〇〇県知事(4)第00000号"},{"dt":"加盟団体","dd":"公益社団法人 〇〇県宅地建物取引業協会／〇〇県不動産公正取引協議会"}]} -->
<div class="wp-block-wdl-lw-company-2 font_size_m" style="border-color:#cccccc"><dl class="" style="border-color:#cccccc;max-width:860px;line-height:1.6"><div class="company-profile-item font_size_m dt_width_m" style="border-color:#cccccc"><dt style="background-color:#f0f0f0;color:#000000;line-height:1.6" data-lw_font_set="">会社名</dt><dd style="color:#000000;line-height:1.6" data-lw_font_set="">株式会社〇〇不動産</dd></div><div class="company-profile-item font_size_m dt_width_m" style="border-color:#cccccc"><dt style="background-color:#f0f0f0;color:#000000;line-height:1.6" data-lw_font_set="">所在地</dt><dd style="color:#000000;line-height:1.6" data-lw_font_set="">東京都〇〇区〇〇町1-1-1</dd></div><div class="company-profile-item font_size_m dt_width_m" style="border-color:#cccccc"><dt style="background-color:#f0f0f0;color:#000000;line-height:1.6" data-lw_font_set="">電話番号</dt><dd style="color:#000000;line-height:1.6" data-lw_font_set="">03-1234-5678</dd></div><div class="company-profile-item font_size_m dt_width_m" style="border-color:#cccccc"><dt style="background-color:#f0f0f0;color:#000000;line-height:1.6" data-lw_font_set="">設立</dt><dd style="color:#000000;line-height:1.6" data-lw_font_set="">2020年1月1日</dd></div></dl></div>
<!-- /wp:wdl/lw-company-2 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-custom-title-10 {"mainTitle":"来店のご案内","subTitle":"VISIT","headingLevel":2,"sizeClass":"size_l","positionClass":"position_center","mainTitleColor":"var(--color-main)","leftImage":"","rightImage":"","bdDisplay":"on","bdThickness":2} -->
<div class="wp-block-wdl-paid-block-custom-title-10 paid-block-custom-title-10 position_center size_l" id="contact"><h2 class="ttl"><span class="text_wrap"><span class="sub" style="color:var(--color-main)">VISIT</span><span class="main">来店のご案内</span></span><span class="bd" style="background-color:var(--color-main);height:2px;margin-top:0.1em"></span></h2></div>
<!-- /wp:wdl/paid-block-custom-title-10 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><strong style="font-size:26px">000-0000-0000</strong><br>受付時間 9:30〜18:30（水曜・第2火曜はお休みです）</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-button-01 {"fontSize":125,"maxWidth":440,"maxWidthSp":320,"paddingSize":"L","innerPaddingSize":"L","backgroundColor":"color-mix(in srgb, var(--color-main) 50%, #000)","textColor":"#ffffff","borderRadius":4,"alignment":"center","alignmentSp":"center","marginTop":10,"marginBottom":10} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-L align-center align-sp-center" style="margin-top:10px;margin-bottom:10px;--button-01-max-width-sp:320px"><a href="tel:00000000000" style="max-width:440px;font-size:125%;background-color:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;padding:1.3em 1.6em;text-align:center;text-decoration:none;border-radius:4px;border-width:0px;border-style:none;border-color:#000000">この番号にかける</a></div>
<!-- /wp:wdl/lw-button-01 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-waku-1 {"waku1MaxWidthPc":900,"waku1PaddingTopPc":28,"waku1PaddingBottomPc":28,"waku1PaddingLeftPc":32,"waku1PaddingRightPc":32,"waku1PaddingTopSp":20,"waku1PaddingBottomSp":20,"waku1PaddingLeftSp":16,"waku1PaddingRightSp":16,"waku1BorderWidthPc":1,"waku1BorderWidthSp":1,"waku1BorderColorPc":"#e5e9ee","waku1BorderColorSp":"#e5e9ee","waku1BorderRadiusPc":[8,8,8,8],"waku1BgColorPc":"#f7f7f5"} -->
<div class="wp-block-wdl-lw-pr-waku-1 lw-pr-waku-1" style="--waku-1-justify-content-pc:center;--waku-1-justify-content-sp:center"><div class="lw-pr-waku-1__custom_wrap" style="--waku-1-max-width-pc:900px;--waku-1-max-width-sp:900px;--waku-1-padding-pc:28px 32px 28px 32px;--waku-1-padding-sp:20px 16px 20px 16px;--waku-1-bd-width-pc:1px;--waku-1-bd-width-sp:1px;--waku-1-bd-style-pc:solid;--waku-1-bd-style-sp:solid;--waku-1-bd-color-pc:#e5e9ee;--waku-1-bd-color-sp:#e5e9ee;--waku-1-bdr-pc:8px 8px 8px 8px;--waku-1-bdr-sp:8px 8px 8px 8px;--waku-1-bg-pc:#f7f7f5;--waku-1-bg-sp:#f7f7f5;--waku-1-bg-opacity-pc:1;--waku-1-bg-opacity-sp:1;--waku-1-blend-mode-pc:normal;--waku-1-blend-mode-sp:normal;--waku-1-bg-img-pc:none;--waku-1-bg-img-sp:none;--waku-1-img-filter-pc:none;--waku-1-img-filter-sp:none;--waku-1-min-height-pc:auto;--waku-1-min-height-sp:auto;--waku-1-aspect-ratio-pc:auto;--waku-1-aspect-ratio-sp:auto"><!-- wp:heading {"level":3,"textAlign":"center","style":{"typography":{"fontSize":"18px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"14px"}}}} -->
<h3 class="has-text-align-center" style="font-size:18px;line-height:1.6;margin-top:0px;margin-bottom:14px">ご来店の前に</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:0px;margin-bottom:0px"><strong>ご予約</strong>　なくてもご案内できますが、ご予約いただくと物件の資料と鍵をそろえてお待ちできます。</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"10px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:10px;margin-bottom:0px"><strong>お時間</strong>　30分ほどです。内見までされる場合は、あわせて2時間ほど見てください。</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"10px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:10px;margin-bottom:0px"><strong>駐車場</strong>　建物の前に3台あります。満車のときはお電話ください。近くの契約駐車場をご案内します。</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"10px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:10px;margin-bottom:0px"><strong>オンライン</strong>　ご来店が難しい方には、ビデオ通話でのご相談と、現地から中継する内見もご用意しています。</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"10px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:10px;margin-bottom:0px"><strong>お子さま連れ</strong>　キッズスペースがあります。お子さんが遊んでいるあいだにお話しできます。</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-pr-waku-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_cta_bg.webp","imageSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_cta_bg.webp","isFullWidth":true,"minHeightPc":"min-h-pc-360px","minHeightTb":"min-h-tb-340px","minHeightSp":"min-h-sp-320px","filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.62} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-360px min-h-tb-340px min-h-sp-320px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.62;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.5;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.5;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:80px;--lw-bg-padding-right-pc:80px;--lw-bg-padding-top-tb:48px;--lw-bg-padding-bottom-tb:48px;--lw-bg-padding-left-tb:48px;--lw-bg-padding-right-tb:48px;--lw-bg-padding-top-sp:24px;--lw-bg-padding-bottom-sp:24px;--lw-bg-padding-left-sp:24px;--lw-bg-padding-right-sp:24px;--lw-bg-max-width:1120px"><!-- wp:heading {"level":2,"textAlign":"center","style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"28px","lineHeight":"1.4"}}} -->
<h2 class="has-text-align-center has-text-color" style="color:#ffffff;font-size:28px;line-height:1.4">見るだけ、聞くだけで<span class="lw-br on_500px"></span>かまいません</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"16px"}}} -->
<p class="has-text-align-center has-text-color" style="color:#ffffff;font-size:16px">いま探していなくても大丈夫です。相場だけ、雰囲気だけ知りたいという方も来られます。<br>無理にお勧めすることはありません。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-button-01 {"fontSize":125,"maxWidth":440,"maxWidthSp":320,"paddingSize":"L","innerPaddingSize":"L","backgroundColor":"#ffffff","textColor":"color-mix(in srgb, var(--color-main) 40%, #000)","borderRadius":4,"alignment":"center","alignmentSp":"center","marginTop":10,"marginBottom":0} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-L align-center align-sp-center" style="margin-top:10px;margin-bottom:0px;--button-01-max-width-sp:320px"><a href="#contact" style="max-width:440px;font-size:125%;background-color:#ffffff;color:color-mix(in srgb, var(--color-main) 40%, #000);padding:1.3em 1.6em;text-align:center;text-decoration:none;border-radius:4px;border-width:0px;border-style:none;border-color:#000000">来店のご予約をする</a></div>
<!-- /wp:wdl/lw-button-01 --></div><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_cta_bg.webp" media="(max-width: 800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_cta_bg.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/fd_cta_bg.webp" alt=""/></picture></div>
<!-- /wp:wdl/lw-bg-1 -->