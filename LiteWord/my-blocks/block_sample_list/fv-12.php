<!-- wp:wdl/paid-block-fv-12 {"navMenuId":3,"navMenuItems":[{"id":32,"title":"トップ","url":"http://localhost/SUPPORT_LOUNGE/LiteWord/","children":[{"id":1950,"title":"テスト","url":"http://localhost/SUPPORT_LOUNGE/LiteWord/test_1/","children":[]},{"id":1951,"title":"テスト","url":"http://localhost/SUPPORT_LOUNGE/LiteWord/1185-2/","children":[]},{"id":35,"title":"ギャラリー","url":"#","children":[]},{"id":34,"title":"特長","url":"#features","children":[]},{"id":36,"title":"メッセージ","url":"#","children":[]}]},{"id":33,"title":"コンセプト","url":"#consept","children":[]},{"id":37,"title":"アクセス","url":"#","children":[]},{"id":38,"title":"お問い合わせ","url":"#","children":[]}],"minHeightPc":"min-h-pc-768px"} -->
<div class="wp-block-wdl-paid-block-fv-12 paid-block-fv-12 min-h-pc-768px min-h-tb-100vh min-h-sp-100vh"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>LOGO</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class="has-submenu"><a href="http://localhost/SUPPORT_LOUNGE/LiteWord/">トップ</a><ul class="sub-menu"><li><a href="http://localhost/SUPPORT_LOUNGE/LiteWord/test_1/">テスト</a></li><li><a href="http://localhost/SUPPORT_LOUNGE/LiteWord/1185-2/">テスト</a></li><li><a href="#">ギャラリー</a></li><li><a href="#features">特長</a></li><li><a href="#">メッセージ</a></li></ul></li><li class=""><a href="#consept">コンセプト</a></li><li class=""><a href="#">アクセス</a></li><li class=""><a href="#">お問い合わせ</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><h2>キャッチフレーズテキスト<br>キャッチフレーズテキスト</h2><div class="cta_wrap"><a href="#" style="background-color:transparent;color:#ffffff;border:1px solid #ffffff;border-radius:100px"><span>ご相談はこちら</span></a><a href="#" style="background-color:transparent;color:#ffffff;border:1px solid #ffffff;border-radius:100px"><span>お問い合わせ</span></a></div></div><nav class="fv-12_news_list" data-source-type="latest" data-post-ids="" data-post-count="4"><h3><span class="text">NEWS</span></h3><div class="pagination"><div class="prev">←</div><div class="page">1/1</div><div class="next">→</div></div><ul></ul></nav><div class="bg_filter" style="background-color:#0000004d"></div><div class="bg_image"><img src="https://lite-word.com/sample_img/cafe/1.webp" alt="" loading="eager"/></div><script>(() => {
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