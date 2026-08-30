<!-- wp:wdl/lw-pr-fv-14 {"logoText":"PERSONAL GYM","cta1Text":"無料カウンセリング","cta1Url":"#contact","cta2Text":"料金を見る","cta2Url":"#price","leadText":"完全個室・マンツーマン","headline":"続く人だけが、変わる","description":"週2回・2か月から。食事は我慢ではなく組み立て方を教えます。","bgType":"video","bgImgSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/gym_1.webp","videoUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/v/gym_fv14.mp4","bgFilterColor":"#1c1c1f","bgFilterOpacity":40,"navMenuItems":[{"title":"コース","url":"#course"},{"title":"料金","url":"#price"},{"title":"トレーナー","url":"#trainer"},{"title":"よくある質問","url":"#faq"}],"minHeightPc":"min-h-pc-680px","minHeightTb":"min-h-tb-600px","minHeightSp":"min-h-sp-560px"} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-680px min-h-tb-600px min-h-sp-560px" style="--fv-btn-bg-color:var(--color-main);--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:var(--color-main);--fv-cta2-text-color:#ffffff"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>PERSONAL GYM</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="#course">コース</a></li><li class=""><a href="#price">料金</a></li><li class=""><a href="#trainer">トレーナー</a></li><li class=""><a href="#faq">よくある質問</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><p class="lead_text">完全個室・マンツーマン</p><h2 class="custom_title">続く人だけが、変わる</h2><p class="desc">週2回・2か月から。食事は我慢ではなく組み立て方を教えます。</p><div class="cta_wrap"><a href="#contact"><span>無料カウンセリング</span></a><a href="#price"><span>料金を見る</span></a></div></div><div class="bg_filter" style="background-color:#1c1c1f66"></div><div class="bg_video"><video autoplay="" muted="" loop="" playsinline="" class="lazy-video" data-playback-rate="1" preload="metadata"><source src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/v/gym_fv14.mp4" type="video/mp4"/></video></div><script>(() => {
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
  var vidPcUrl = 'https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/v/gym_fv14.mp4';
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
