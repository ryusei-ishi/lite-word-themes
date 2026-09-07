<!-- wp:wdl/paid-block-fv-12 {"logoText":"大和田工務店","logoUrl":"#","navMenuItems":[{"id":1,"title":"お困りごと","url":"#worry","children":[]},{"id":2,"title":"対応する工事","url":"#service","children":[]},{"id":3,"title":"施工例","url":"#works","children":[]},{"id":4,"title":"費用の目安","url":"#price","children":[]},{"id":5,"title":"ご相談の流れ","url":"#flow","children":[]},{"id":6,"title":"お客様の声","url":"#voice","children":[]}],"headline":"建てたあとも、\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003eずっと近くに。","cta1Enable":true,"cta1Text":"無料で現地を見てもらう","cta1Url":"#","cta2Enable":true,"cta2Text":"施工例を見る","cta2Url":"#works","newsListVisible":false,"bgType":"image","bgImg":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_fv.webp","bgImgAlt":"リフォームを終えた木の床のリビング。大きな窓から庭が見えている","bgFilterType":"solid","bgFilterColor":"#141e1a","bgFilterOpacity":55,"minHeightPc":"min-h-pc-720px","minHeightTb":"min-h-tb-600px","minHeightSp":"min-h-sp-560px"} -->
<div class="wp-block-wdl-paid-block-fv-12 paid-block-fv-12 min-h-pc-720px min-h-tb-600px min-h-sp-560px"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>大和田工務店</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="#worry">お困りごと</a></li><li class=""><a href="#service">対応する工事</a></li><li class=""><a href="#works">施工例</a></li><li class=""><a href="#price">費用の目安</a></li><li class=""><a href="#flow">ご相談の流れ</a></li><li class=""><a href="#voice">お客様の声</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><h2>建てたあとも、<span class="lw-br on_500px"></span>ずっと近くに。</h2><div class="cta_wrap"><a href="#" style="background-color:transparent;color:#ffffff;border:1px solid #ffffff;border-radius:100px"><span>無料で現地を見てもらう</span></a><a href="#works" style="background-color:transparent;color:#ffffff;border:1px solid #ffffff;border-radius:100px"><span>施工例を見る</span></a></div></div><div class="bg_filter" style="background-color:#141e1a8c"></div><div class="bg_image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_fv.webp" alt="リフォームを終えた木の床のリビング。大きな窓から庭が見えている" loading="eager"/></div><script>(() => {
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
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"リフォームで迷ったら","subTitle":"WORRY","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px" id="worry"><span class="main">リフォームで迷ったら</span><span class="sub">WORRY</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">リフォームは、決めることが多くて<span class="lw-br on_500px"></span>後回しになりがちです。<br>ひとつでも当てはまったら、<span class="lw-br on_500px"></span>まだ何も決まっていない状態で<span class="lw-br on_500px"></span>ご相談ください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-list-5 {"listColumns":1,"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_worry.webp","leftItems":["どこから直せばいいのか分からない","費用がいくらかかるのか見当がつかない","見積りを頼むと断りにくくなりそう","前に頼んだ業者と連絡が取れなくなった","住みながら工事ができるのか不安","古い家なので断られそうで聞けていない"],"rightItems":[]} -->
<div class="wp-block-wdl-lw-pr-list-5 lw-pr-list-5 columns-1" style="--list_items_bg_color:#f7f7f7;--list_items_color:var(--color-main)"><div class="lw-pr-list-5_wrap"><div class="list_items"><div class="list_items_inner"><ul class="list_left" data-lw_font_set=""><li><span>どこから直せばいいのか分からない</span></li><li><span>費用がいくらかかるのか見当がつかない</span></li><li><span>見積りを頼むと断りにくくなりそう</span></li><li><span>前に頼んだ業者と連絡が取れなくなった</span></li><li><span>住みながら工事ができるのか不安</span></li><li><span>古い家なので断られそうで聞けていない</span></li></ul></div></div><div class="image"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_worry.webp" alt=""/></div></div></div>
<!-- /wp:wdl/lw-pr-list-5 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">※ ご相談・現地調査・お見積りは無料です。<span class="lw-br on_500px"></span>その場で契約をおすすめすることはありませんので、<span class="lw-br on_500px"></span>比べるための1社としてお使いください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.08,"filterTypeTb":"solid","filterColorTb":"var(--color-main)","opacityTb":0.08,"filterTypeSp":"solid","filterColorSp":"var(--color-main)","opacitySp":0.08} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.08;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.08;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.08;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"対応する工事","subTitle":"SERVICE","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px" id="service"><span class="main">対応する工事</span><span class="sub">SERVICE</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">小さな修繕から、<span class="lw-br on_500px"></span>住まいまるごとの改修までお受けしています。<br>「これは頼めるのかな」と思ったものは、<span class="lw-br on_500px"></span>まずお聞かせください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-content-9 {"autoplay":false,"slides":[{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_01.webp","altText":"新しくなったキッチンと洗面まわり","title":"水まわりの改修","description":"キッチン・浴室・洗面・トイレ。1か所だけでもお受けします。住みながらの工事もご相談ください。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_02.webp","altText":"無垢の床板を張っている職人の手元","title":"内装・床と壁","description":"床の張り替え、壁紙、漆喰、間取りの変更まで。素材は実物をお見せしてから決めていただきます。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_03.webp","altText":"塗り替えたばかりの外壁と軒先","title":"外壁・屋根","description":"塗装・張り替え・雨漏りの修理。足場を組む工事は、ほかに直すところがないか一緒に点検します。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_04.webp","altText":"壁を開けて断熱材を入れているところ","title":"断熱・耐震","description":"寒さ・暑さ・地震への備え。補助金が使えることが多い工事なので、申請のお手伝いまで含めてご案内します。","linkUrl":"","openNewTab":false}]} -->
<div class="wp-block-wdl-lw-pr-content-9 lw-pr-content-9 init-hide"><div class="lw-pr-content-9__wrap"><div class="swiper lw-pr-content-9-swiper"><div class="swiper-wrapper"><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_01.webp" alt="新しくなったキッチンと洗面まわり"/></div><h3>水まわりの改修</h3><p>キッチン・浴室・洗面・トイレ。1か所だけでもお受けします。住みながらの工事もご相談ください。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_02.webp" alt="無垢の床板を張っている職人の手元"/></div><h3>内装・床と壁</h3><p>床の張り替え、壁紙、漆喰、間取りの変更まで。素材は実物をお見せしてから決めていただきます。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_03.webp" alt="塗り替えたばかりの外壁と軒先"/></div><h3>外壁・屋根</h3><p>塗装・張り替え・雨漏りの修理。足場を組む工事は、ほかに直すところがないか一緒に点検します。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_svc_04.webp" alt="壁を開けて断熱材を入れているところ"/></div><h3>断熱・耐震</h3><p>寒さ・暑さ・地震への備え。補助金が使えることが多い工事なので、申請のお手伝いまで含めてご案内します。</p></div></div></div><div class="swiper-pagination"></div></div></div><script type="text/javascript">
(function(){
    var _sc = document.currentScript;
    var _root = ( _sc && _sc.closest ) ? _sc.closest(".lw-pr-content-9") : null;
    if ( !_root ) _root = document.querySelector(".lw-pr-content-9:not([data-lw-init])");
    if ( !_root ) return;
    _root.setAttribute("data-lw-init","1");
    if ( !_root.id ) _root.id = "lw-pr-content-9-" + Math.random().toString(36).slice(2,10);
    var selector = "#" + _root.id + " .lw-pr-content-9-swiper";
    var MAX_RETRY = 30;
    var retry = 0;

    function initSwiper(){
        if ( typeof Swiper === "undefined" ) return false;
        var el = document.querySelector(selector);
        if ( !el ) return false;
        if ( el.swiper ) return true;

        new Swiper( selector, {
            slidesPerView: 4,
            spaceBetween: 24,
            loop: true,
            
            pagination: {
                el: selector + " .swiper-pagination",
                clickable: true
            },
            observer: true,
            observeParents: true,
            breakpoints: {
                0:    { slidesPerView: 1, spaceBetween: 24 },
                576:  { slidesPerView: 2, spaceBetween: 20 },
                992:  { slidesPerView: 3, spaceBetween: 24 },
                1200: { slidesPerView: 4, spaceBetween: 24 }
            }
        });
        _root.classList.remove("init-hide");
        return true;
    }

    document.addEventListener("DOMContentLoaded", initSwiper, { once:true });
    window.addEventListener("lw:swiperReady", initSwiper, { once:true });

    var timer = setInterval(function(){
        if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);
    }, 150);

    setTimeout(function(){
        var el = _root;
        if ( el ) el.classList.remove("init-hide");
    }, 5000);
})();
        </script><noscript><style>.lw-pr-content-9{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/lw-pr-content-9 --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"施工前と施工後","subTitle":"BEFORE / AFTER","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px"><span class="main">施工前と施工後</span><span class="sub">BEFORE / AFTER</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">築40年の和室を、<span class="lw-br on_500px"></span>寝室として使えるようにした例です。<br>窓を広げて、<span class="lw-br on_500px"></span>床は無垢のオークに張り替えました。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-before-after-3 {"beforeImageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_ba_before.webp","afterImageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_ba_after.webp","beforeText":"Before","afterText":"After","beforeDescription":"築40年・6畳の和室","afterDescription":"工期12日 ／ 約128万円（税込）"} -->
<div class="wp-block-wdl-lw-pr-before-after-3 lw-pr-before-after-3"><div class="this_wrap" style="max-width:800px"><div class="image-area"><div class="image " style="aspect-ratio:800 / 800"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_ba_before.webp" alt=""/><div class="text" style="background-color:#e64343" data-lw_font_set="Montserrat">Before</div></div><div class="arrow-right" style="border-left:20px solid #e64343"></div><div class="image " style="aspect-ratio:800 / 800"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_ba_after.webp" alt=""/><div class="text" style="background-color:#e64343" data-lw_font_set="Montserrat">After</div></div></div><div class="desc-area"><p class="desc">築40年・6畳の和室</p><p class="desc">工期12日 ／ 約128万円（税込）</p></div></div></div>
<!-- /wp:wdl/lw-pr-before-after-3 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">※ 金額は工事の内容と建物の状態で変わります。<span class="lw-br on_500px"></span>上の例は目安としてご覧ください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.08,"filterTypeTb":"solid","filterColorTb":"var(--color-main)","opacityTb":0.08,"filterTypeSp":"solid","filterColorSp":"var(--color-main)","opacitySp":0.08} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.08;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.08;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.08;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"これまでの施工例","subTitle":"WORKS","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px" id="works"><span class="main">これまでの施工例</span><span class="sub">WORKS</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">地元の住まいを中心に、<span class="lw-br on_500px"></span>年間およそ60件をお預かりしています。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-image-2 {"maxWidthPx":800,"alignClass":"center"} -->
<div class="wp-block-wdl-lw-image-2 lw-image-2 center" style="max-width:800px"><div class="image__inner no_1" style="border-radius:1.2em;aspect-ratio:1000 / 800"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_work_01.webp" alt="薪ストーブのあるリビングとオークのダイニングテーブル"/><p data-lw_font_set="">リビングまるごとの改修</p><div class="image_filter" data-color="#000000" data-opacity="0.28" data-blend="normal" style="background-color:#000000;opacity:0.28;mix-blend-mode:normal"></div></div><div class="image__inner no_2" style="border-radius:1.2em;aspect-ratio:1000 / 800"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_work_02.webp" alt="床の間に造り付けたオークの棚とカウンター"/><p data-lw_font_set="">造作の棚</p><div class="image_filter" data-color="#000000" data-opacity="0.28" data-blend="normal" style="background-color:#000000;opacity:0.28;mix-blend-mode:normal"></div></div><div class="image__inner no_3" style="border-radius:1.2em;aspect-ratio:1000 / 800"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_work_03.webp" alt="木のカウンターと大きな鏡のある明るい洗面所"/><p data-lw_font_set="">洗面の一新</p><div class="image_filter" data-color="#000000" data-opacity="0.28" data-blend="normal" style="background-color:#000000;opacity:0.28;mix-blend-mode:normal"></div></div></div>
<!-- /wp:wdl/lw-image-2 --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"数字で見る大和田工務店","subTitle":"ABOUT","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px"><span class="main">数字で見る大和田工務店</span><span class="sub">ABOUT</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">大きな会社ではありませんが、<span class="lw-br on_500px"></span>同じ土地でずっと続けてきました。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-column-1 {"columnsPc":3,"columnsSp":1,"columnGapPc":16,"rowGapPc":16,"columnGapSp":12,"rowGapSp":12} -->
<div class="wp-block-wdl-lw-pr-column-1 lw-pr-column-1" style="--column-1-wrap-padding-pc:0px 0px 0px 0px;--column-1-wrap-padding-sp:0px 0px 0px 0px;--column-1-border-color-pc:rgb(131, 131, 131);--column-1-border-width-pc:0px;--column-1-border-style-pc:solid;--column-1-border-color-sp:rgb(131, 131, 131);--column-1-border-width-sp:0px;--column-1-border-style-sp:solid;--column-1-bdr-pc:0px 0px 0px 0px;--column-1-bdr-sp:0px 0px 0px 0px;--column-1-gtc-pc:1fr 1fr 1fr;--column-1-gtc-sp:1fr;--column-1-row-gap-pc:16px;--column-1-row-gap-sp:12px;--column-1-column-gap-pc:16px;--column-1-column-gap-sp:12px;--column-1-item-bg-pc:transparent;--column-1-item-bg-sp:transparent;--column-1-item-min-h-pc:0px;--column-1-item-min-h-sp:0px;--column-1-item-padding-pc:0px 0px 0px 0px;--column-1-item-padding-sp:0px 0px 0px 0px;--column-1-item-bdr-pc:0px 0px 0px 0px;--column-1-item-bdr-sp:0px 0px 0px 0px;--column-1-item-border-color-pc:rgb(131, 131, 131);--column-1-item-border-width-pc:0px;--column-1-item-border-style-pc:solid;--column-1-item-border-color-sp:rgb(131, 131, 131);--column-1-item-border-width-sp:0px;--column-1-item-border-style-sp:solid"><div class="custom_wrap"><!-- wp:wdl/lw-pr-waku-1 {"waku1MaxWidthPc":420,"waku1MaxWidthSp":420,"waku1PaddingTopPc":28,"waku1PaddingBottomPc":22,"waku1PaddingLeftPc":16,"waku1PaddingRightPc":16,"waku1PaddingTopSp":20,"waku1PaddingBottomSp":18,"waku1PaddingLeftSp":12,"waku1PaddingRightSp":12,"waku1BorderWidthPc":1,"waku1BorderRadiusPc":[8,8,8,8],"waku1BgColorPc":"#f7f9fb"} -->
<div class="wp-block-wdl-lw-pr-waku-1 lw-pr-waku-1" style="--waku-1-justify-content-pc:center;--waku-1-justify-content-sp:center"><div class="lw-pr-waku-1__custom_wrap" style="--waku-1-max-width-pc:420px;--waku-1-max-width-sp:420px;--waku-1-padding-pc:28px 16px 22px 16px;--waku-1-padding-sp:20px 12px 18px 12px;--waku-1-bd-width-pc:1px;--waku-1-bd-width-sp:1px;--waku-1-bd-style-pc:solid;--waku-1-bd-style-sp:solid;--waku-1-bd-color-pc:var(--color-main);--waku-1-bd-color-sp:var(--color-main);--waku-1-bdr-pc:8px 8px 8px 8px;--waku-1-bdr-sp:8px 8px 8px 8px;--waku-1-bg-pc:#f7f9fb;--waku-1-bg-sp:#f7f9fb;--waku-1-bg-opacity-pc:1;--waku-1-bg-opacity-sp:1;--waku-1-blend-mode-pc:normal;--waku-1-blend-mode-sp:normal;--waku-1-bg-img-pc:none;--waku-1-bg-img-sp:none;--waku-1-img-filter-pc:none;--waku-1-img-filter-sp:none;--waku-1-min-height-pc:auto;--waku-1-min-height-sp:auto;--waku-1-aspect-ratio-pc:auto;--waku-1-aspect-ratio-sp:auto"><!-- wp:heading {"level":3,"textAlign":"center","style":{"typography":{"fontSize":"40px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"4px"}}}} -->
<h3 class="has-text-align-center" style="font-size:40px;line-height:1.4;margin-top:0px;margin-bottom:4px">1998<span style="font-size:60%;margin-left:0.2em">年創業</span></h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"14px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-align-center" style="font-size:14px;margin-top:0px;margin-bottom:0px">この土地で28年目です</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-pr-waku-1 -->
<!-- wp:wdl/lw-pr-waku-1 {"waku1MaxWidthPc":420,"waku1MaxWidthSp":420,"waku1PaddingTopPc":28,"waku1PaddingBottomPc":22,"waku1PaddingLeftPc":16,"waku1PaddingRightPc":16,"waku1PaddingTopSp":20,"waku1PaddingBottomSp":18,"waku1PaddingLeftSp":12,"waku1PaddingRightSp":12,"waku1BorderWidthPc":1,"waku1BorderRadiusPc":[8,8,8,8],"waku1BgColorPc":"#f7f9fb"} -->
<div class="wp-block-wdl-lw-pr-waku-1 lw-pr-waku-1" style="--waku-1-justify-content-pc:center;--waku-1-justify-content-sp:center"><div class="lw-pr-waku-1__custom_wrap" style="--waku-1-max-width-pc:420px;--waku-1-max-width-sp:420px;--waku-1-padding-pc:28px 16px 22px 16px;--waku-1-padding-sp:20px 12px 18px 12px;--waku-1-bd-width-pc:1px;--waku-1-bd-width-sp:1px;--waku-1-bd-style-pc:solid;--waku-1-bd-style-sp:solid;--waku-1-bd-color-pc:var(--color-main);--waku-1-bd-color-sp:var(--color-main);--waku-1-bdr-pc:8px 8px 8px 8px;--waku-1-bdr-sp:8px 8px 8px 8px;--waku-1-bg-pc:#f7f9fb;--waku-1-bg-sp:#f7f9fb;--waku-1-bg-opacity-pc:1;--waku-1-bg-opacity-sp:1;--waku-1-blend-mode-pc:normal;--waku-1-blend-mode-sp:normal;--waku-1-bg-img-pc:none;--waku-1-bg-img-sp:none;--waku-1-img-filter-pc:none;--waku-1-img-filter-sp:none;--waku-1-min-height-pc:auto;--waku-1-min-height-sp:auto;--waku-1-aspect-ratio-pc:auto;--waku-1-aspect-ratio-sp:auto"><!-- wp:heading {"level":3,"textAlign":"center","style":{"typography":{"fontSize":"40px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"4px"}}}} -->
<h3 class="has-text-align-center" style="font-size:40px;line-height:1.4;margin-top:0px;margin-bottom:4px">1,800<span style="font-size:60%;margin-left:0.2em">件</span></h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"14px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-align-center" style="font-size:14px;margin-top:0px;margin-bottom:0px">これまでにお預かりした工事</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-pr-waku-1 -->
<!-- wp:wdl/lw-pr-waku-1 {"waku1MaxWidthPc":420,"waku1MaxWidthSp":420,"waku1PaddingTopPc":28,"waku1PaddingBottomPc":22,"waku1PaddingLeftPc":16,"waku1PaddingRightPc":16,"waku1PaddingTopSp":20,"waku1PaddingBottomSp":18,"waku1PaddingLeftSp":12,"waku1PaddingRightSp":12,"waku1BorderWidthPc":1,"waku1BorderRadiusPc":[8,8,8,8],"waku1BgColorPc":"#f7f9fb"} -->
<div class="wp-block-wdl-lw-pr-waku-1 lw-pr-waku-1" style="--waku-1-justify-content-pc:center;--waku-1-justify-content-sp:center"><div class="lw-pr-waku-1__custom_wrap" style="--waku-1-max-width-pc:420px;--waku-1-max-width-sp:420px;--waku-1-padding-pc:28px 16px 22px 16px;--waku-1-padding-sp:20px 12px 18px 12px;--waku-1-bd-width-pc:1px;--waku-1-bd-width-sp:1px;--waku-1-bd-style-pc:solid;--waku-1-bd-style-sp:solid;--waku-1-bd-color-pc:var(--color-main);--waku-1-bd-color-sp:var(--color-main);--waku-1-bdr-pc:8px 8px 8px 8px;--waku-1-bdr-sp:8px 8px 8px 8px;--waku-1-bg-pc:#f7f9fb;--waku-1-bg-sp:#f7f9fb;--waku-1-bg-opacity-pc:1;--waku-1-bg-opacity-sp:1;--waku-1-blend-mode-pc:normal;--waku-1-blend-mode-sp:normal;--waku-1-bg-img-pc:none;--waku-1-bg-img-sp:none;--waku-1-img-filter-pc:none;--waku-1-img-filter-sp:none;--waku-1-min-height-pc:auto;--waku-1-min-height-sp:auto;--waku-1-aspect-ratio-pc:auto;--waku-1-aspect-ratio-sp:auto"><!-- wp:heading {"level":3,"textAlign":"center","style":{"typography":{"fontSize":"40px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"4px"}}}} -->
<h3 class="has-text-align-center" style="font-size:40px;line-height:1.4;margin-top:0px;margin-bottom:4px">12<span style="font-size:60%;margin-left:0.2em">名</span></h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"14px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-align-center" style="font-size:14px;margin-top:0px;margin-bottom:0px">大工・職人（全員が自社の社員です）</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-pr-waku-1 --></div></div>
<!-- /wp:wdl/lw-pr-column-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-border-1 {"maxWidthPc":100,"maxWidthUnitPc":"%","borderWidthPc":1,"borderColorPc":"#e5e9ee","borderStylePc":"solid","maxWidthSp":100,"maxWidthUnitSp":"%","borderWidthSp":1,"borderColorSp":"#e5e9ee","borderStyleSp":"solid"} -->
<div class="wp-block-wdl-lw-pr-border-1 lw-pr-border-1" style="--border-1-mt-pc:0px;--border-1-mb-pc:0px;--border-1-ml-pc:auto;--border-1-mr-pc:auto;--border-1-max-width-pc:100%;--border-1-width-pc:1px;--border-1-style-pc:solid;--border-1-color-pc:#e5e9ee;--border-1-mt-sp:0px;--border-1-mb-sp:0px;--border-1-ml-sp:auto;--border-1-mr-sp:auto;--border-1-max-width-sp:100%;--border-1-width-sp:1px;--border-1-style-sp:solid;--border-1-color-sp:#e5e9ee"></div>
<!-- /wp:wdl/lw-pr-border-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"0px"}}}} -->
<p class="has-text-align-center" style="margin-top:0px">※ 下請けに丸投げはしません。<span class="lw-br on_500px"></span>大工・電気・水道はいつも同じ顔ぶれで伺いますので、<span class="lw-br on_500px"></span>あとから「聞いていない」が起きません。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"お見積りの例","subTitle":"PRICE","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px" id="price"><span class="main">お見積りの例</span><span class="sub">PRICE</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">よくあるご依頼を、<span class="lw-br on_500px"></span>材料費・工事費・諸経費を含めた総額でご紹介します。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-table-2 {"dtFixedPc":true,"dtWidthPc":220,"dtBorderColor":"#dfe4ea","defaultSpClm1":true,"dtBgColor":"#f7f9fb","dlBorderColor":"#dfe4ea","rowBorderColor":"#dfe4ea","rows":[{"dtText":"浴室の入れ替え","ddText":"ユニットバスへの交換・\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e給湯器も同時に。\u003cbr\u003e工期5日 ／ \u003cstrong\u003e約118万円\u003c/strong\u003e\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e（税込・処分費こみ）","pcClm1":null,"spClm1":null,"bgColor":"","textColor":""},{"dtText":"キッチンの交換","ddText":"同じ位置での入れ替え。\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e壁と床も張り替え。\u003cbr\u003e工期4日 ／ \u003cstrong\u003e約96万円\u003c/strong\u003e\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e（税込）","pcClm1":null,"spClm1":null,"bgColor":"","textColor":""},{"dtText":"外壁の塗り替え","ddText":"30坪2階建て・\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e足場と高圧洗浄こみ。\u003cbr\u003e工期14日 ／ \u003cstrong\u003e約128万円\u003c/strong\u003e\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e（税込）","pcClm1":null,"spClm1":null,"bgColor":"","textColor":""},{"dtText":"和室を洋室に","ddText":"6畳・床は無垢材、\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e押し入れをクローゼットへ。\u003cbr\u003e工期12日 ／ \u003cstrong\u003e約128万円\u003c/strong\u003e\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e（税込）","pcClm1":null,"spClm1":null,"bgColor":"","textColor":""},{"dtText":"雨漏りの修理","ddText":"屋根の一部葺き替えと\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e天井の張り替え。\u003cbr\u003e工期3日 ／ \u003cstrong\u003e約34万円\u003c/strong\u003e\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e（税込）","pcClm1":null,"spClm1":null,"bgColor":"","textColor":""},{"dtText":"手すりの取り付け","ddText":"玄関・廊下・浴室の3か所。\u003cbr\u003e工期1日 ／ \u003cstrong\u003e約7万円\u003c/strong\u003e\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e（税込・\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003e介護保険の申請もお手伝いします）","pcClm1":null,"spClm1":null,"bgColor":"","textColor":""}]} -->
<div class="wp-block-wdl-lw-pr-table-2 lw-pr-table-2" style="--table-2-dl-width-pc:100%;--table-2-dl-width-sp:100%;--table-2-grid-columns-pc:220px calc(100% - 220px);--table-2-grid-columns-sp:1fr 1fr;--table-2-dl-border-color:#dfe4ea;--table-2-dl-border-style:solid;--table-2-dl-border-width:1px;--table-2-dl-border-individual:0;--table-2-dl-border-top-color:#dfe4ea;--table-2-dl-border-top-style:solid;--table-2-dl-border-top-width:1px;--table-2-dl-border-bottom-color:#dfe4ea;--table-2-dl-border-bottom-style:solid;--table-2-dl-border-bottom-width:1px;--table-2-dl-border-left-color:#dfe4ea;--table-2-dl-border-left-style:solid;--table-2-dl-border-left-width:1px;--table-2-dl-border-right-color:#dfe4ea;--table-2-dl-border-right-style:solid;--table-2-dl-border-right-width:1px;--table-2-row-border-color:#dfe4ea;--table-2-row-border-style:solid;--table-2-row-border-width:1px;--table-2-dt-border-color:#dfe4ea;--table-2-dt-border-style:solid;--table-2-dt-border-width:1px;--table-2-dt-bg-color:#f7f9fb;--table-2-cell-padding-pc:16px;--table-2-cell-padding-sp:16px;--table-2-font-size-pc:17px;--table-2-font-size-sp:16px;--table-2-dt-align-pc:left;--table-2-dt-align-sp:left;--table-2-dd-align-pc:left;--table-2-dd-align-sp:left;--table-2-dt-text-color:inherit;--table-2-dd-text-color:inherit"><dl class="table-2__dl"><div class="table-2__row sp_clm_1"><dt class="table-2__dt"><p data-lw_font_set="">浴室の入れ替え</p></dt><dd class="table-2__dd"><p data-lw_font_set="">ユニットバスへの交換・<span class="lw-br on_500px"></span>給湯器も同時に。<br>工期5日 ／ <strong>約118万円</strong><span class="lw-br on_500px"></span>（税込・処分費こみ）</p></dd></div><div class="table-2__row sp_clm_1"><dt class="table-2__dt"><p data-lw_font_set="">キッチンの交換</p></dt><dd class="table-2__dd"><p data-lw_font_set="">同じ位置での入れ替え。<span class="lw-br on_500px"></span>壁と床も張り替え。<br>工期4日 ／ <strong>約96万円</strong><span class="lw-br on_500px"></span>（税込）</p></dd></div><div class="table-2__row sp_clm_1"><dt class="table-2__dt"><p data-lw_font_set="">外壁の塗り替え</p></dt><dd class="table-2__dd"><p data-lw_font_set="">30坪2階建て・<span class="lw-br on_500px"></span>足場と高圧洗浄こみ。<br>工期14日 ／ <strong>約128万円</strong><span class="lw-br on_500px"></span>（税込）</p></dd></div><div class="table-2__row sp_clm_1"><dt class="table-2__dt"><p data-lw_font_set="">和室を洋室に</p></dt><dd class="table-2__dd"><p data-lw_font_set="">6畳・床は無垢材、<span class="lw-br on_500px"></span>押し入れをクローゼットへ。<br>工期12日 ／ <strong>約128万円</strong><span class="lw-br on_500px"></span>（税込）</p></dd></div><div class="table-2__row sp_clm_1"><dt class="table-2__dt"><p data-lw_font_set="">雨漏りの修理</p></dt><dd class="table-2__dd"><p data-lw_font_set="">屋根の一部葺き替えと<span class="lw-br on_500px"></span>天井の張り替え。<br>工期3日 ／ <strong>約34万円</strong><span class="lw-br on_500px"></span>（税込）</p></dd></div><div class="table-2__row sp_clm_1"><dt class="table-2__dt"><p data-lw_font_set="">手すりの取り付け</p></dt><dd class="table-2__dd"><p data-lw_font_set="">玄関・廊下・浴室の3か所。<br>工期1日 ／ <strong>約7万円</strong><span class="lw-br on_500px"></span>（税込・<span class="lw-br on_500px"></span>介護保険の申請もお手伝いします）</p></dd></div></dl></div>
<!-- /wp:wdl/lw-pr-table-2 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">※ 建物の状態で金額は変わります。<span class="lw-br on_500px"></span>現地を見てからお出しする見積書には、<span class="lw-br on_500px"></span>材料の品番と数量まで書きます。<span class="lw-br on_500px"></span>追加が出そうなときは、必ず先に金額をお伝えしてからにします。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"ご相談から完了まで","subTitle":"FLOW","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px" id="flow"><span class="main">ご相談から完了まで</span><span class="sub">FLOW</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">はじめてのご依頼でも迷わないように、<span class="lw-br on_500px"></span>順番を決めてあります。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"01"} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:1080px"><div class="lw-step__li" style="border-color:var(--color-main);--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:var(--color-main)">01</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 style="font-size:18px;line-height:1.6;margin-top:0px;margin-bottom:8px">ご相談（無料）</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:0px;margin-bottom:0px">お電話かフォームでご連絡ください。「まだ何も決まっていない」で構いません。ご希望とご予算のだいたいの幅をうかがいます。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"02"} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:1080px"><div class="lw-step__li" style="border-color:var(--color-main);--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:var(--color-main)">02</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 style="font-size:18px;line-height:1.6;margin-top:0px;margin-bottom:8px">現地の調査（無料）</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:0px;margin-bottom:0px">ご都合のよい日に伺い、写真を撮りながら建物を見ます。所要はおよそ60分。その場で契約をおすすめすることはありません。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"03"} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:1080px"><div class="lw-step__li" style="border-color:var(--color-main);--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:var(--color-main)">03</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 style="font-size:18px;line-height:1.6;margin-top:0px;margin-bottom:8px">お見積りとご提案</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:0px;margin-bottom:0px">1週間ほどでお出しします。<span class="lw-br on_500px"></span>材料の品番と数量まで書き、「やらなくていいところ」も<span class="lw-br on_500px"></span>はっきりお伝えします。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"04"} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:1080px"><div class="lw-step__li" style="border-color:var(--color-main);--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:var(--color-main)">04</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 style="font-size:18px;line-height:1.6;margin-top:0px;margin-bottom:8px">ご契約と着工</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:0px;margin-bottom:0px">内容とお支払いを書面で確認してから始めます。着工前にご近所へごあいさつに伺います。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"05"} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:1080px"><div class="lw-step__li" style="border-color:var(--color-main);--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:var(--color-main)">05</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"18px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 style="font-size:18px;line-height:1.6;margin-top:0px;margin-bottom:8px">お引き渡しと点検</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="font-size:15px;margin-top:0px;margin-bottom:0px">一緒に確認しながらお渡しします。1か月・1年・3年に点検へ伺います。困ったことがあればその前でもお電話ください。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"0px"}}}} -->
<p class="has-text-align-center" style="margin-top:0px">※ 途中でやめても費用はいただきません。<span class="lw-br on_500px"></span>お見積りまでは無料です。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.08,"filterTypeTb":"solid","filterColorTb":"var(--color-main)","opacityTb":0.08,"filterTypeSp":"solid","filterColorSp":"var(--color-main)","opacitySp":0.08} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.08;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.08;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.08;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"対応エリア","subTitle":"AREA","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px" id="area"><span class="main">対応エリア</span><span class="sub">AREA</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">片道およそ40分で伺える範囲を目安にしています。<br>「すぐ行ける距離」でないと、<span class="lw-br on_500px"></span>工事のあとの点検に通いきれないからです。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-list-7 {"colClass":"clm_2","bgColor":"transparent","columnWidths":[1],"columnWidthsSp":[1],"fontSizePc":16,"fontSizeSp":15,"rowGapPc":14,"columnGapPc":24,"colorLiSvg":"color-mix(in srgb, var(--color-main) 50%, #000)","listGroups":[{"contents":[{"text":"〇〇市（全域）"},{"text":"△△市（全域）"},{"text":"□□町（全域）"},{"text":"◇◇市 北部"},{"text":"××市 東部"},{"text":"〇△町（全域）"},{"text":"△□村（全域）"},{"text":"◇×市 中央部"}]}]} -->
<div class="wp-block-wdl-lw-pr-list-7 lw-pr-list-7" style="--list-7-gtc-pc:1fr;--list-7-gtc-sp:1fr;--list-7-inner-row-gap-pc:20px;--list-7-inner-column-gap-pc:20px;--list-7-inner-row-gap-sp:20px;--list-7-inner-column-gap-sp:20px;--list-7-row-gap-pc:14px;--list-7-column-gap-pc:24px;--list-7-row-gap-sp:14px;--list-7-column-gap-sp:24px;--list-7-font-size-pc:16px;--list-7-font-size-sp:15px"><div class="custom_inner"><ul class="lw-pr-list-7__inner clm_2" style="background-color:transparent"><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">〇〇市（全域）</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">△△市（全域）</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">□□町（全域）</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">◇◇市 北部</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">××市 東部</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">〇△町（全域）</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">△□村（全域）</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">◇×市 中央部</p></span></li></ul></div></div>
<!-- /wp:wdl/lw-pr-list-7 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">※ エリアの外でも、<span class="lw-br on_500px"></span>工事の内容によってはお受けできることがあります。<span class="lw-br on_500px"></span>一度お尋ねください。</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"保証とアフターサポート","subTitle":"SUPPORT","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px"><span class="main">保証とアフターサポート</span><span class="sub">SUPPORT</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">工事が終わってからのほうが、<span class="lw-br on_500px"></span>おつきあいは長くなります。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-waku-1 {"waku1MaxWidthPc":760,"waku1PaddingTopPc":28,"waku1PaddingBottomPc":28,"waku1PaddingLeftPc":32,"waku1PaddingRightPc":32,"waku1PaddingTopSp":20,"waku1PaddingBottomSp":20,"waku1PaddingLeftSp":16,"waku1PaddingRightSp":16,"waku1BorderWidthPc":1,"waku1BorderRadiusPc":[8,8,8,8],"waku1BgColorPc":"#f7f9fb"} -->
<div class="wp-block-wdl-lw-pr-waku-1 lw-pr-waku-1" style="--waku-1-justify-content-pc:center;--waku-1-justify-content-sp:center"><div class="lw-pr-waku-1__custom_wrap" style="--waku-1-max-width-pc:760px;--waku-1-max-width-sp:760px;--waku-1-padding-pc:28px 32px 28px 32px;--waku-1-padding-sp:20px 16px 20px 16px;--waku-1-bd-width-pc:1px;--waku-1-bd-width-sp:1px;--waku-1-bd-style-pc:solid;--waku-1-bd-style-sp:solid;--waku-1-bd-color-pc:var(--color-main);--waku-1-bd-color-sp:var(--color-main);--waku-1-bdr-pc:8px 8px 8px 8px;--waku-1-bdr-sp:8px 8px 8px 8px;--waku-1-bg-pc:#f7f9fb;--waku-1-bg-sp:#f7f9fb;--waku-1-bg-opacity-pc:1;--waku-1-bg-opacity-sp:1;--waku-1-blend-mode-pc:normal;--waku-1-blend-mode-sp:normal;--waku-1-bg-img-pc:none;--waku-1-bg-img-sp:none;--waku-1-img-filter-pc:none;--waku-1-img-filter-sp:none;--waku-1-min-height-pc:auto;--waku-1-min-height-sp:auto;--waku-1-aspect-ratio-pc:auto;--waku-1-aspect-ratio-sp:auto"><!-- wp:heading {"level":3,"textAlign":"center","style":{"typography":{"fontSize":"18px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 class="has-text-align-center" style="font-size:18px;line-height:1.6;margin-top:0px;margin-bottom:8px">工事のあと、3回うかがいます</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p style="margin-top:0px;margin-bottom:0px">1か月・1年・3年の点検は無料です。自社の工事は2年間の保証をお付けし、設備は各メーカーの保証をそのままお渡しします。保証の対象かどうか分からないときも、まずご連絡ください。見るだけなら費用はかかりませんし、対象外だと思って我慢されているうちに大きくなってしまうほうが、結局どちらにとっても損になります。</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-pr-waku-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.08,"filterTypeTb":"solid","filterColorTb":"var(--color-main)","opacityTb":0.08,"filterTypeSp":"solid","filterColorSp":"var(--color-main)","opacitySp":0.08} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.08;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.08;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.08;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"お客様の声","subTitle":"VOICE","headingLevel":2} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:var(--color-main);--title-15-after-mt-pc:1em;--title-15-after-mt-sp:0.8em;--title-15-after-h-pc:4px;--title-15-after-h-sp:4px;--title-15-after-w-pc:50px;--title-15-after-w-sp:50px;--title-15-font-size_pc:16px;--title-15-font-size_sp:16px" id="voice"><span class="main">お客様の声</span><span class="sub">VOICE</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">お引き渡しのあとに、うかがったお話です。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-comment-3 {"comment3ImageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_voice_01.webp","comment3AlignItems":"end"} -->
<div class="wp-block-wdl-lw-pr-comment-3 lw-pr-comment-3" style="--comment-3-bd-color:#3C7FC3;--comment-3-bg:#ffffff;--comment-3-max-width:980px"><div class="lw-pr-comment-3__wrap sp_clm_1" style="--comment-3-image-width-pc:240px;--comment-3-image-width-sp:120px;--comment-3-text-bd-color-pc:#3C7FC3;--comment-3-text-inner-bg:#e9f5ff;--comment-3-text-df-pc:16px;--comment-3-text-df-sp:14px;--comment-3-text-inner-gap-pc:8px;--comment-3-text-inner-gap-sp:8px"><div class="lw-pr-comment-3__text"><div class="lw-pr-comment-3__text_inner"><!-- wp:paragraph -->
<p><strong>50代・男性 ／ 外壁の塗り替え</strong></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>見積りが3社とも違いすぎて、何が正しいのか分からなくなっていました。ここだけが「この部分は今やらなくていい」と減らしてくれたので、逆に信用できると思いました。足場を組んだついでに雨樋まで直してもらえたのも助かりました。</p>
<!-- /wp:paragraph --><div class="lw-pr-comment-3__text_arrow"></div></div></div><div class="lw-pr-comment-3__image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_voice_01.webp" alt=""/></div></div></div>
<!-- /wp:wdl/lw-pr-comment-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":24,"tbHeight":20,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:24px"></div><div class="tb" style="height:20px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-comment-3 {"comment3ImageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_voice_02.webp","comment3AlignItems":"end"} -->
<div class="wp-block-wdl-lw-pr-comment-3 lw-pr-comment-3" style="--comment-3-bd-color:#3C7FC3;--comment-3-bg:#ffffff;--comment-3-max-width:980px"><div class="lw-pr-comment-3__wrap sp_clm_1" style="--comment-3-image-width-pc:240px;--comment-3-image-width-sp:120px;--comment-3-text-bd-color-pc:#3C7FC3;--comment-3-text-inner-bg:#e9f5ff;--comment-3-text-df-pc:16px;--comment-3-text-df-sp:14px;--comment-3-text-inner-gap-pc:8px;--comment-3-text-inner-gap-sp:8px"><div class="lw-pr-comment-3__text"><div class="lw-pr-comment-3__text_inner"><!-- wp:paragraph -->
<p><strong>40代・女性 ／ キッチンの交換</strong></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>子どもが小さいので、<span class="lw-br on_500px"></span>住みながらの工事ができるか心配でした。毎朝その日にどこを触るか説明してくれて、<span class="lw-br on_500px"></span>夕方には片づけて帰ってくださるので、思っていたより普通に暮らせました。</p>
<!-- /wp:paragraph --><div class="lw-pr-comment-3__text_arrow"></div></div></div><div class="lw-pr-comment-3__image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_voice_02.webp" alt=""/></div></div></div>
<!-- /wp:wdl/lw-pr-comment-3 --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_cta_bg.webp","imageSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_cta_bg.webp","isFullWidth":true,"minHeightPc":"min-h-pc-360px","minHeightTb":"min-h-tb-340px","minHeightSp":"min-h-sp-320px","filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.6} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-360px min-h-tb-340px min-h-sp-320px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.6;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.5;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.5;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:80px;--lw-bg-padding-right-pc:80px;--lw-bg-padding-top-tb:48px;--lw-bg-padding-bottom-tb:48px;--lw-bg-padding-left-tb:48px;--lw-bg-padding-right-tb:48px;--lw-bg-padding-top-sp:24px;--lw-bg-padding-bottom-sp:24px;--lw-bg-padding-left-sp:24px;--lw-bg-padding-right-sp:24px;--lw-bg-max-width:1120px"><!-- wp:heading {"level":2,"textAlign":"center","style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"28px","lineHeight":"1.4"}}} -->
<h2 class="has-text-align-center has-text-color" style="color:#ffffff;font-size:28px;line-height:1.4">まず、<span class="lw-br on_500px"></span>見にいかせてください</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"16px"}}} -->
<p class="has-text-align-center has-text-color" style="color:#ffffff;font-size:16px">現地の調査もお見積りも無料です。<span class="lw-br on_500px"></span>その場で契約をおすすめすることはありませんので、<span class="lw-br on_500px"></span>比べるための1社としてお使いください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-button-2 {"textSub":"＼ 調査・お見積りは無料 ／","textMain":"無料で現地を見てもらう","btnUrl":"","btnAlign":"center","textColorSub":"#ffffff","textColorMain":"color-mix(in srgb, var(--color-main) 40%, #000)","bgGradient":"linear-gradient(135deg, #ffffff 0%, #f2f4f7 100%)","bgGradientHover":"linear-gradient(135deg, #f2f4f7 0%, #e6eaef 100%)"} -->
<div class="wp-block-wdl-lw-pr-button-2 lw-pr-button-2 center"><div class="wrap_btn"><span class="text_sub" style="margin-bottom:6px;color:#ffffff;font-size:16px;font-weight:500" data-lw_font_set="">＼ 調査・お見積りは無料 ／</span><a href="#" class="lw_btn_a " style="padding:1.2em 1em;max-width:340px;background:linear-gradient(135deg, #ffffff 0%, #f2f4f7 100%);border-radius:64px;box-shadow:0px 0px 6px rgba(0, 0, 0, 0.2);--hover-bg:linear-gradient(135deg, #f2f4f7 0%, #e6eaef 100%);--transition-duration:0.3s;--shake-interval:3s;--max-width-sp:300px;--font-size-main-sp:18px"><span class="text_main" style="font-size:20px;font-weight:500;color:color-mix(in srgb, var(--color-main) 40%, #000)" data-lw_font_set="">無料で現地を見てもらう</span></a></div></div>
<!-- /wp:wdl/lw-pr-button-2 --></div><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_cta_bg.webp" media="(max-width: 800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_cta_bg.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_cta_bg.webp" alt=""/></picture></div>
<!-- /wp:wdl/lw-bg-1 -->