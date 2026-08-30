<!-- wp:wdl/lw-pr-fv-14 {"bgFilterOpacity":55} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-100vh min-h-tb-100vh min-h-sp-100vh" style="--fv-btn-bg-color:var(--color-main);--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:var(--color-main);--fv-cta2-text-color:#ffffff"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>LOGO</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><p class="lead_text">リードテキストリード</p><h2>キャッチフレーズテキスト<br>キャッチフレーズテキスト</h2><p class="desc">ここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入りますここに説明文が入ります</p><div class="cta_wrap"><a href="#"><span>ご相談はこちら</span></a><a href="#"><span>資料ダウンロードはこちら</span></a></div></div><div class="bg_filter" style="background-color:#0000008c"></div><picture class="bg_image"><source srcset="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/gym_1.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/gym_1.webp" alt="" loading="eager"/></picture><script>(() => {
'use strict';
const ready = () => {

  /* ---- ロゴリンクの設定 ---- */
  document.querySelectorAll('.logo a[data-home-url]').forEach(link => {
    if(!link.href || link.href === '' || link.href === window.location.href + '#') {
      if(window.MyThemeSettings && window.MyThemeSettings.home_Url) {
        link.href = window.MyThemeSettings.home_Url;
      } else {
        link.href = window.location.origin;
      }
    }
  });

  /* ---- video ---- */
  document.querySelectorAll('.lazy-video').forEach(v=>{
    v.style.display='block';
    
    const playbackRate = parseFloat(v.getAttribute('data-playback-rate')) || 1;
    v.playbackRate = playbackRate;
    
    const playVideo = () => {
      v.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    };
    
    if(v.readyState >= 1) {
      playVideo();
    } else {
      v.addEventListener('loadedmetadata', () => {
        v.playbackRate = playbackRate;
        playVideo();
      });
    }
    
    document.addEventListener('click', () => {
      if(v.paused) {
        playVideo();
      }
    }, { once: true });
  });
};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',ready):ready();
})();</script></div>
<!-- /wp:wdl/lw-pr-fv-14 -->