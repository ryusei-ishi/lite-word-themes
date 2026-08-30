<!-- wp:wdl/lw-pr-fv-14 {"logoText":"ACCOUNTING","cta1Text":"無料相談のお申込み","cta1Url":"#contact","cta2Enable":false,"leadText":"創業から決算まで","headline":"数字を、経営の言葉に","description":"毎月の試算表をお渡しするだけで終わりにしません。何が起きているかを一緒に読みます。","bgImgPc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/zeirishi_1.webp","bgImgSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/zeirishi_1.webp","bgFilterColor":"#22364a","bgFilterOpacity":70,"navMenuItems":[{"title":"サービス","url":"#service"},{"title":"料金","url":"#price"},{"title":"事務所案内","url":"#about"},{"title":"お問い合わせ","url":"#contact"}],"minHeightPc":"min-h-pc-680px","minHeightTb":"min-h-tb-600px","minHeightSp":"min-h-sp-560px"} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-680px min-h-tb-600px min-h-sp-560px" style="--fv-btn-bg-color:var(--color-main);--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:var(--color-main);--fv-cta2-text-color:#ffffff"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>ACCOUNTING</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="#service">サービス</a></li><li class=""><a href="#price">料金</a></li><li class=""><a href="#about">事務所案内</a></li><li class=""><a href="#contact">お問い合わせ</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><p class="lead_text">創業から決算まで</p><h2 class="custom_title">数字を、経営の言葉に</h2><p class="desc">毎月の試算表をお渡しするだけで終わりにしません。何が起きているかを一緒に読みます。</p><div class="cta_wrap"><a href="#contact"><span>無料相談のお申込み</span></a></div></div><div class="bg_filter" style="background-color:#22364ab3"></div><picture class="bg_image"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/zeirishi_1.webp" media="(max-width: 800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/zeirishi_1.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/zeirishi_1.webp" alt="" loading="eager"/></picture><script>(() => {
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
