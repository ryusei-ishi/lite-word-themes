<!-- wp:wdl/lw-pr-fv-14 {"cta1Text":"空室を見る","cta1Url":"#rooms","cta2Text":"来店のご予約","cta2Url":"#contact","leadText":"駅徒歩10分圏","headline":"内見は、当日でも","description":"空室の状況は毎朝更新しています。気になる部屋があればそのままお電話ください。","bgImgPc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp","bgImgSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp","bgFilterColor":"#16324f","bgFilterOpacity":62,"minHeightPc":"min-h-pc-500px","minHeightTb":"min-h-tb-440px","minHeightSp":"min-h-sp-400px","showHeader":false} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-500px min-h-tb-440px min-h-sp-400px" style="--fv-btn-bg-color:var(--color-main);--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:var(--color-main);--fv-cta2-text-color:#ffffff"><div class="fv_inner"><p class="lead_text">駅徒歩10分圏</p><h2 class="custom_title">内見は、当日でも</h2><p class="desc">空室の状況は毎朝更新しています。気になる部屋があればそのままお電話ください。</p><div class="cta_wrap"><a href="#rooms"><span>空室を見る</span></a><a href="#contact"><span>来店のご予約</span></a></div></div><div class="bg_filter" style="background-color:#16324f9e"></div><picture class="bg_image"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp" media="(max-width: 800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/fudosan_1.webp" alt="" loading="eager"/></picture><script>(() => {
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
