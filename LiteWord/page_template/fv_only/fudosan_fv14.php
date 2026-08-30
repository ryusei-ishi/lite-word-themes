<!-- wp:wdl/lw-pr-fv-14 {"logoText":"ESTATE","cta1Text":"物件を探す","cta1Url":"#search","cta2Text":"来店のご予約","cta2Url":"#contact","leadText":"地域密着","headline":"暮らしから、住まいを選ぶ","description":"間取りや価格の前に、どんな暮らしがしたいかを伺います。","bgImgPc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp","bgImgSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp","bgFilterColor":"#16324f","bgFilterOpacity":72,"navMenuItems":[{"title":"物件を探す","url":"#search"},{"title":"売却のご相談","url":"#sell"},{"title":"会社概要","url":"#company"},{"title":"お問い合わせ","url":"#contact"}],"minHeightPc":"min-h-pc-680px","minHeightTb":"min-h-tb-600px","minHeightSp":"min-h-sp-560px"} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-680px min-h-tb-600px min-h-sp-560px" style="--fv-btn-bg-color:var(--color-main);--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:var(--color-main);--fv-cta2-text-color:#ffffff"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>ESTATE</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="#search">物件を探す</a></li><li class=""><a href="#sell">売却のご相談</a></li><li class=""><a href="#company">会社概要</a></li><li class=""><a href="#contact">お問い合わせ</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><p class="lead_text">地域密着</p><h2 class="custom_title">暮らしから、住まいを選ぶ</h2><p class="desc">間取りや価格の前に、どんな暮らしがしたいかを伺います。</p><div class="cta_wrap"><a href="#search"><span>物件を探す</span></a><a href="#contact"><span>来店のご予約</span></a></div></div><div class="bg_filter" style="background-color:#16324fb8"></div><picture class="bg_image"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp" media="(max-width: 800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp" alt="" loading="eager"/></picture><script>(() => {
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
