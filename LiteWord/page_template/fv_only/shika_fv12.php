<!-- wp:wdl/paid-block-fv-12 {"logoText":"DENTAL","cta1Text":"ご予約","cta1Url":"#reserve","cta2Enable":false,"headline":"痛くなる前に、来てほしい","newsLabel":"お知らせ","bgImg":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/shika_1.webp","bgFilterColor":"#2b6b78","bgFilterOpacity":48,"navMenuItems":[{"title":"診療案内","url":"#service"},{"title":"院内のご案内","url":"#clinic"},{"title":"診療時間","url":"#hours"},{"title":"アクセス","url":"#access"}],"minHeightPc":"min-h-pc-680px","minHeightTb":"min-h-tb-600px","minHeightSp":"min-h-sp-560px"} -->
<div class="wp-block-wdl-paid-block-fv-12 paid-block-fv-12 min-h-pc-680px min-h-tb-600px min-h-sp-560px"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>DENTAL</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="#service">診療案内</a></li><li class=""><a href="#clinic">院内のご案内</a></li><li class=""><a href="#hours">診療時間</a></li><li class=""><a href="#access">アクセス</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><h2>痛くなる前に、来てほしい</h2><div class="cta_wrap"><a href="#reserve" style="background-color:transparent;color:#ffffff;border:1px solid #ffffff;border-radius:100px"><span>ご予約</span></a></div></div><nav class="fv-12_news_list" data-source-type="latest" data-post-ids="" data-post-count="4"><h3><span class="text">お知らせ</span></h3><div class="pagination"><div class="prev">←</div><div class="page">1/1</div><div class="next">→</div></div><ul></ul></nav><div class="bg_filter" style="background-color:#2b6b787a"></div><div class="bg_image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/shika_1.webp" alt="" loading="eager"/></div><script>(() => {
'use strict';
var _me = document.currentScript;
var _root = _me ? _me.closest('.paid-block-fv-12') : null;
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
  var _scope = _root ? _root : document;
  var _sel = _root ? '.lazy-video' : '.paid-block-fv-12 .lazy-video';
  _scope.querySelectorAll(_sel).forEach(v=>{
    // 動画を表示
    v.style.display='block';
    
    // 再生速度を設定
    const playbackRate = parseFloat(v.getAttribute('data-playback-rate')) || 1;
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
})();</script></div>
<!-- /wp:wdl/paid-block-fv-12 -->
