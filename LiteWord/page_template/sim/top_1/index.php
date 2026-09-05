<!-- wp:wdl/paid-block-fv-12 {"logoText":"スマホ代しらべ","logoUrl":"/","headline":"毎月のスマホ代、\u003cbr\u003eいくらまで下げられるか。","bgType":"image","bgImg":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_fv_top.webp","bgImgAlt":"机の上のスマートフォンと手帳","bgFilterType":"solid","bgFilterColor":"#0d1f3d","bgFilterOpacity":52,"newsListVisible":false,"navMenuItems":[{"title":"料金をくらべる","url":"/sim-plan/"},{"title":"3か月使った話","url":"/sim-review/"},{"title":"乗り換えの手順","url":"/sim-mnp/"},{"title":"はじめての方へ","url":"/sim-faq/"},{"title":"運営者情報","url":"/sim-about/"}],"cta1Text":"今月のおすすめ3社","cta1Url":"#osusume","cta1Enable":true,"cta2Text":"料金をくらべる","cta2Url":"/sim-plan/","cta2Enable":true} -->
<div class="wp-block-wdl-paid-block-fv-12 paid-block-fv-12 min-h-pc-100vh min-h-tb-100vh min-h-sp-100vh"><header class="fv_in_header"><h1 class="logo"><a href="/" data-home-url=""><span>スマホ代しらべ</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="/sim-plan/">料金をくらべる</a></li><li class=""><a href="/sim-review/">3か月使った話</a></li><li class=""><a href="/sim-mnp/">乗り換えの手順</a></li><li class=""><a href="/sim-faq/">はじめての方へ</a></li><li class=""><a href="/sim-about/">運営者情報</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><h2>毎月のスマホ代、<br>いくらまで下げられるか。</h2><div class="cta_wrap"><a href="#osusume" style="background-color:transparent;color:#ffffff;border:1px solid #ffffff;border-radius:100px"><span>今月のおすすめ3社</span></a><a href="/sim-plan/" style="background-color:transparent;color:#ffffff;border:1px solid #ffffff;border-radius:100px"><span>料金をくらべる</span></a></div></div><div class="bg_filter" style="background-color:#0d1f3d85"></div><div class="bg_image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_fv_top.webp" alt="机の上のスマートフォンと手帳" loading="eager"/></div><script>(() => {
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
<!-- wp:paragraph {"align":"center","style":{"color":{"background":"#eef2f7","text":"#1f2733"},"typography":{"fontSize":"14px"},"spacing":{"padding":{"top":"10px","bottom":"10px","left":"16px","right":"16px"}}}} -->
<p class="has-text-align-center has-text-color has-background" style="color:#1f2733;font-size:14px"><strong>PR</strong>　このサイトには広告（アフィリエイトリンク）が含まれます。</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"2"},"spacing":{"margin":{"top":"24px","bottom":"8px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#1f2733;font-size:15px;line-height:2;margin-top:24px;margin-bottom:8px">このサイトは、格安SIMの料金を毎月調べ直して並べているところです。<br>広告のリンクを含みますが、<strong>順位は報酬の金額では決めていません</strong>。<br>料金は税込・2026年9月1日時点で各社の公式サイトから書き写しています。<br>安さだけでなく、混む時間帯の速さと、やめたくなったときの出やすさも見ています。<br>どれを見ればいいか分からないときは、下の「使い方でしぼる」から選んでください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":24,"tbHeight":20,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:24px"></div><div class="tb" style="height:20px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-column-1 {"columnsPc":1,"columnWidthsPc":[1],"columnsSp":1,"wrapPaddingTopPc":0,"wrapPaddingBottomPc":0,"itemBgNone":false,"itemBgTypePc":"solid","itemBgColorPc":"#eef2f7","itemBgTypeSp":"solid","itemBgColorSp":"#eef2f7","itemBorderColorPc":"#c1440e","itemBorderWidthPc":1,"itemBorderStylePc":"solid","itemBorderColorSp":"#c1440e","itemBorderWidthSp":1,"itemBorderStyleSp":"solid","itemPaddingTopPc":24,"itemPaddingBottomPc":24,"itemPaddingLeftPc":28,"itemPaddingRightPc":28,"itemPaddingTopSp":18,"itemPaddingBottomSp":18,"itemPaddingLeftSp":16,"itemPaddingRightSp":16,"itemBorderRadiusTopLeftPc":6,"itemBorderRadiusTopRightPc":6,"itemBorderRadiusBottomRightPc":6,"itemBorderRadiusBottomLeftPc":6,"itemBorderRadiusTopLeftSp":6,"itemBorderRadiusTopRightSp":6,"itemBorderRadiusBottomRightSp":6,"itemBorderRadiusBottomLeftSp":6} -->
<div class="wp-block-wdl-lw-pr-column-1 lw-pr-column-1" style="--column-1-wrap-padding-pc:0px 0px 0px 0px;--column-1-wrap-padding-sp:0px 0px 0px 0px;--column-1-border-color-pc:rgb(131, 131, 131);--column-1-border-width-pc:0px;--column-1-border-style-pc:solid;--column-1-border-color-sp:rgb(131, 131, 131);--column-1-border-width-sp:0px;--column-1-border-style-sp:solid;--column-1-bdr-pc:0px 0px 0px 0px;--column-1-bdr-sp:0px 0px 0px 0px;--column-1-gtc-pc:1fr;--column-1-gtc-sp:1fr;--column-1-row-gap-pc:8px;--column-1-row-gap-sp:8px;--column-1-column-gap-pc:8px;--column-1-column-gap-sp:8px;--column-1-item-bg-pc:#eef2f7;--column-1-item-bg-sp:#eef2f7;--column-1-item-min-h-pc:0px;--column-1-item-min-h-sp:0px;--column-1-item-padding-pc:24px 28px 24px 28px;--column-1-item-padding-sp:18px 16px 18px 16px;--column-1-item-bdr-pc:6px 6px 6px 6px;--column-1-item-bdr-sp:6px 6px 6px 6px;--column-1-item-border-color-pc:#c1440e;--column-1-item-border-width-pc:1px;--column-1-item-border-style-pc:solid;--column-1-item-border-color-sp:#c1440e;--column-1-item-border-width-sp:1px;--column-1-item-border-style-sp:solid"><div class="custom_wrap"><!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:16px;line-height:1.9;margin-top:0px;margin-bottom:0px"><strong>「実質0円」「最安」と書かれている料金には、たいてい条件が付いています。</strong><br>よくあるのは ①家族で複数回線を契約する ②光回線もセットにする ③指定のクレジットカードで払う ④割引が半年〜1年で終わる の4つです。<br>このサイトでは、条件が付いている金額には<strong>その条件を同じ大きさで書き添えます</strong>。小さな注意書きにはしません。</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-pr-column-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"使い方でしぼる","subTitle":"STEP 1","headingLevel":2,"colorMain":"#16305c"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#16305c" id="erabu"><h2 class="ttl"><span class="sub">STEP 1</span><span class="main">使い方でしぼる</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:24px">先に「どう使っているか」を決めると、候補は3つくらいまで減ります。<span class="lw-br on_500px"></span>近いものを選んでください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-banner-info-02 {"filterBackgroundColor":"#0d1f3d","filterOpacity":0.5,"items":[{"title":"家ではWi-Fi","description":"外では地図と連絡くらい。3GBで足ります","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_01.webp","alt":"テーブルに置かれたスマートフォンとWi-Fiルーター","linkUrl":"/sim-plan/#gb3","openInNewTab":false},{"title":"動画をよく見る","description":"通勤の行き帰りで見る。20GB以上が要ります","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_02.webp","alt":"電車でスマートフォンを見る人","linkUrl":"/sim-plan/#gb20","openInNewTab":false},{"title":"電話が多い","description":"仕事で毎日かける。かけ放題を先に決めます","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_03.webp","alt":"窓辺で通話するビジネスパーソン","linkUrl":"/sim-plan/#tel","openInNewTab":false},{"title":"家族でまとめたい","description":"2回線以上でまとめると1人あたりが下がります","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_04.webp","alt":"ソファでスマートフォンを見る家族","linkUrl":"/sim-plan/#family","openInNewTab":false}]} -->
<nav class="wp-block-wdl-lw-banner-info-02 lw-banner-info-02"><ul class="lw-banner-info-02__wrap"><li><a href="/sim-plan/#gb3"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_01.webp" alt="テーブルに置かれたスマートフォンとWi-Fiルーター"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>家ではWi-Fi</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>外では地図と連絡くらい。3GBで足ります</span></p><div class="filter" style="background-color:#0d1f3d;opacity:0.5"></div></a></li><li><a href="/sim-plan/#gb20"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_02.webp" alt="電車でスマートフォンを見る人"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>動画をよく見る</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>通勤の行き帰りで見る。20GB以上が要ります</span></p><div class="filter" style="background-color:#0d1f3d;opacity:0.5"></div></a></li><li><a href="/sim-plan/#tel"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_03.webp" alt="窓辺で通話するビジネスパーソン"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>電話が多い</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>仕事で毎日かける。かけ放題を先に決めます</span></p><div class="filter" style="background-color:#0d1f3d;opacity:0.5"></div></a></li><li><a href="/sim-plan/#family"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_use_04.webp" alt="ソファでスマートフォンを見る家族"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>家族でまとめたい</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>2回線以上でまとめると1人あたりが下がります</span></p><div class="filter" style="background-color:#0d1f3d;opacity:0.5"></div></a></li></ul></nav>
<!-- /wp:wdl/lw-banner-info-02 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"今月のおすすめ3社","subTitle":"RANKING","headingLevel":2,"colorMain":"#16305c"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#16305c" id="osusume"><h2 class="ttl"><span class="sub">RANKING</span><span class="main">今月のおすすめ3社</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"0px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:0px">上でしぼった使い方ごとに、いま料金と速さの釣り合いが取れている3社です。<span class="lw-br on_500px"></span>順位の決め方はこの下に書いています。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-ranking-1 {"showPr":true,"prText":"PR","isAffiliate":true,"showScore":true,"prBgColor":"#16305c","prTextColor":"#ffffff","rankUnit":"位","goodLabel":"ここが良い","badLabel":"気になる点","maxWidth":900,"marginTop":24,"boxBorderColor":"#d8dfe8","nameColor":"#16305c","commentColor":"#5c6673","goodColor":"#1f7a4d","badColor":"#c1440e","rank1Color":"#16305c","rank2Color":"#1668b0","rank3Color":"#5c6673","buttonColumnsPc":1,"items":[{"imageUrl":"","imageAlt":"","name":"A社（3GB・通話は都度）","comment":"「家ではWi-Fi、外では地図と連絡だけ」という人が、いちばん安く収まった会社です。3GBまでの価格で他社を下回りました。","score":"4.6","good":"3GBまでなら他社より月200〜400円安い","bad":"昼12時台は動画が止まることがある","shops":[{"label":"公式サイトを見る","url":"https://example.com/a-mobile/","bgColor":"#c1440e","textColor":"#ffffff"}]},{"imageUrl":"","imageAlt":"","name":"B社（20GB・混む時間に強い）","comment":"通勤の行き帰りで動画を見る人向け。昼と夕方に3日ずつ測って、いちばん速度の落ち方が小さかった会社です。","score":"4.3","good":"12時台でも動画が止まらなかった","bad":"3GB以下の安いプランが無い","shops":[{"label":"公式サイトを見る","url":"https://example.com/b-mobile/","bgColor":"#c1440e","textColor":"#ffffff"}]},{"imageUrl":"","imageAlt":"","name":"C社（かけ放題つき）","comment":"仕事で電話が多い人向け。通話が定額で、そのぶんデータの単価はやや高めです。","score":"4.0","good":"10分かけ放題が標準で付く","bad":"データを足すと20GB帯ではB社より高い","shops":[{"label":"公式サイトを見る","url":"https://example.com/c-mobile/","bgColor":"#c1440e","textColor":"#ffffff"}]}]} -->
<div class="wp-block-wdl-lw-pr-ranking-1 lw-pr-ranking-1" style="margin-top:24px;margin-bottom:0px;--rk1-max-width:900px;--rk1-gap:24px;--rk1-img-w:180px;--rk1-img-w-sp:110px;--rk1-name-size:19px;--rk1-name-size-sp:17px;--rk1-btn-size:15px;--rk1-score-color:#f0a020"><p class="lw-pr-ranking-1__pr" style="background-color:#16305c;color:#ffffff">PR</p><div class="lw-pr-ranking-1__item" style="background-color:#ffffff;border-color:#d8dfe8;border-width:1px;border-radius:10px"><span class="lw-pr-ranking-1__rank" style="background-color:#16305c;color:#ffffff">1位</span><div class="lw-pr-ranking-1__main"><div class="lw-pr-ranking-1__body"><p class="lw-pr-ranking-1__name" style="color:#16305c" data-lw_font_set="">A社（3GB・通話は都度）</p><p class="lw-pr-ranking-1__score"><span class="lw-pr-ranking-1__stars" aria-hidden="true"><span class="lw-pr-ranking-1__stars-on" style="width:92%">★★★★★</span>★★★★★</span><span class="lw-pr-ranking-1__score-num">4.6</span></p><p class="lw-pr-ranking-1__comment" style="color:#5c6673">「家ではWi-Fi、外では地図と連絡だけ」という人が、いちばん安く収まった会社です。3GBまでの価格で他社を下回りました。</p><ul class="lw-pr-ranking-1__points"><li class="is-good"><span class="lw-pr-ranking-1__label" style="color:#1f7a4d">ここが良い</span><span>3GBまでなら他社より月200〜400円安い</span></li><li class="is-bad"><span class="lw-pr-ranking-1__label" style="color:#c1440e">気になる点</span><span>昼12時台は動画が止まることがある</span></li></ul></div></div><div class="lw-pr-ranking-1__shops" style="--rk1-btn-col:1;--rk1-btn-col-sp:1"><a class="lw-pr-ranking-1__shop" href="https://example.com/a-mobile/" target="_blank" rel="noopener noreferrer sponsored nofollow" style="background-color:#c1440e;color:#ffffff;border-radius:6px" data-lw_font_set="">公式サイトを見る</a></div></div><div class="lw-pr-ranking-1__item" style="background-color:#ffffff;border-color:#d8dfe8;border-width:1px;border-radius:10px"><span class="lw-pr-ranking-1__rank" style="background-color:#1668b0;color:#ffffff">2位</span><div class="lw-pr-ranking-1__main"><div class="lw-pr-ranking-1__body"><p class="lw-pr-ranking-1__name" style="color:#16305c" data-lw_font_set="">B社（20GB・混む時間に強い）</p><p class="lw-pr-ranking-1__score"><span class="lw-pr-ranking-1__stars" aria-hidden="true"><span class="lw-pr-ranking-1__stars-on" style="width:86%">★★★★★</span>★★★★★</span><span class="lw-pr-ranking-1__score-num">4.3</span></p><p class="lw-pr-ranking-1__comment" style="color:#5c6673">通勤の行き帰りで動画を見る人向け。昼と夕方に3日ずつ測って、いちばん速度の落ち方が小さかった会社です。</p><ul class="lw-pr-ranking-1__points"><li class="is-good"><span class="lw-pr-ranking-1__label" style="color:#1f7a4d">ここが良い</span><span>12時台でも動画が止まらなかった</span></li><li class="is-bad"><span class="lw-pr-ranking-1__label" style="color:#c1440e">気になる点</span><span>3GB以下の安いプランが無い</span></li></ul></div></div><div class="lw-pr-ranking-1__shops" style="--rk1-btn-col:1;--rk1-btn-col-sp:1"><a class="lw-pr-ranking-1__shop" href="https://example.com/b-mobile/" target="_blank" rel="noopener noreferrer sponsored nofollow" style="background-color:#c1440e;color:#ffffff;border-radius:6px" data-lw_font_set="">公式サイトを見る</a></div></div><div class="lw-pr-ranking-1__item" style="background-color:#ffffff;border-color:#d8dfe8;border-width:1px;border-radius:10px"><span class="lw-pr-ranking-1__rank" style="background-color:#5c6673;color:#ffffff">3位</span><div class="lw-pr-ranking-1__main"><div class="lw-pr-ranking-1__body"><p class="lw-pr-ranking-1__name" style="color:#16305c" data-lw_font_set="">C社（かけ放題つき）</p><p class="lw-pr-ranking-1__score"><span class="lw-pr-ranking-1__stars" aria-hidden="true"><span class="lw-pr-ranking-1__stars-on" style="width:80%">★★★★★</span>★★★★★</span><span class="lw-pr-ranking-1__score-num">4.0</span></p><p class="lw-pr-ranking-1__comment" style="color:#5c6673">仕事で電話が多い人向け。通話が定額で、そのぶんデータの単価はやや高めです。</p><ul class="lw-pr-ranking-1__points"><li class="is-good"><span class="lw-pr-ranking-1__label" style="color:#1f7a4d">ここが良い</span><span>10分かけ放題が標準で付く</span></li><li class="is-bad"><span class="lw-pr-ranking-1__label" style="color:#c1440e">気になる点</span><span>データを足すと20GB帯ではB社より高い</span></li></ul></div></div><div class="lw-pr-ranking-1__shops" style="--rk1-btn-col:1;--rk1-btn-col-sp:1"><a class="lw-pr-ranking-1__shop" href="https://example.com/c-mobile/" target="_blank" rel="noopener noreferrer sponsored nofollow" style="background-color:#c1440e;color:#ffffff;border-radius:6px" data-lw_font_set="">公式サイトを見る</a></div></div></div>
<!-- /wp:wdl/lw-pr-ranking-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"#eef2f7","opacityPc":1,"filterTypeTb":"solid","filterColorTb":"#eef2f7","opacityTb":1,"filterTypeSp":"solid","filterColorSp":"#eef2f7","opacitySp":1} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:#eef2f7;--lw-bg-opacity-pc:1;--lw-bg-color-filter-tb:#eef2f7;--lw-bg-opacity-tb:1;--lw-bg-color-filter-sp:#eef2f7;--lw-bg-opacity-sp:1;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/lw-pr-custom-title-14 {"mainTitle":"順位の決め方","subTitle":"CRITERIA","headingLevel":3,"colorMain":"#1668b0","borderRadius":6,"alignmentPc":"center","alignmentSp":"center","maxWidth":720} -->
<div class="wp-block-wdl-lw-pr-custom-title-14 lw-pr-custom-title-14 center_pc center_sp" style="--color-main:#1668b0;max-width:720px;width:100%;--custom-title-14-border-radius:6px"><h3 class="ttl"><span class="sub"><span class="text">CRITERIA</span></span><span class="main">順位の決め方</span></h3></div>
<!-- /wp:wdl/lw-pr-custom-title-14 -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"24px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#1f2733;font-size:16px;line-height:1.9;margin-top:0px;margin-bottom:24px">順位は次の4つを同じ重みで見て決めています。<strong>広告の報酬額は見ていません。</strong>各社の公式サイトの料金表と、実際に契約している回線での実測から出しています。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-list-7 {"colClass":"clm_2","columnWidths":[1],"listGroups":[{"contents":[{"text":"同じギガ数にそろえたときの月額（税込・割引前）"},{"text":"平日12時台と18時台の下り速度（各3日ぶんの中央値）"},{"text":"かけ放題を足したときの合計額"},{"text":"解約金・最低利用期間・MNPの出しやすさ"}]}],"colorLiSvg":"#1668b0","textColor":"#1f2733","bgColor":"transparent","fontSizePc":16} -->
<div class="wp-block-wdl-lw-pr-list-7 lw-pr-list-7" style="--list-7-gtc-pc:1fr;--list-7-gtc-sp:1fr;--list-7-inner-row-gap-pc:20px;--list-7-inner-column-gap-pc:20px;--list-7-inner-row-gap-sp:20px;--list-7-inner-column-gap-sp:20px;--list-7-row-gap-pc:20px;--list-7-column-gap-pc:20px;--list-7-row-gap-sp:20px;--list-7-column-gap-sp:20px;--list-7-font-size-pc:16px;--list-7-font-size-sp:16px"><div class="custom_inner"><ul class="lw-pr-list-7__inner clm_2" style="background-color:transparent"><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:#1668b0"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="color:#1f2733;width:calc(100% - 1.2em)">同じギガ数にそろえたときの月額（税込・割引前）</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:#1668b0"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="color:#1f2733;width:calc(100% - 1.2em)">平日12時台と18時台の下り速度（各3日ぶんの中央値）</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:#1668b0"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="color:#1f2733;width:calc(100% - 1.2em)">かけ放題を足したときの合計額</p></span></li><li class="lw-pr-list-7__li"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:#1668b0"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-pr-list-7__text"><p data-lw_font_set="" style="color:#1f2733;width:calc(100% - 1.2em)">解約金・最低利用期間・MNPの出しやすさ</p></span></li></ul></div></div>
<!-- /wp:wdl/lw-pr-list-7 -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#5c6673"},"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"24px","bottom":"0px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#5c6673;font-size:15px;margin-top:24px;margin-bottom:0px">調べた日：2026年9月1日／調べた回線：5社（すべて自分で契約して測っています）</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"月額のめやす","subTitle":"PRICE","headingLevel":2,"colorMain":"#16305c"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#16305c" id="ryokin"><h2 class="ttl"><span class="sub">PRICE</span><span class="main">月額のめやす</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:24px">5社を同じ条件でそろえたときの<strong>幅</strong>です。<span class="lw-br on_500px"></span>1社ずつの表は「料金をくらべる」にあります。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-table-2 {"rows":[{"dtText":"3GB","ddText":"月 900円 〜 1,300円"},{"dtText":"20GB","ddText":"月 1,900円 〜 2,700円"},{"dtText":"無制限","ddText":"月 3,000円 〜 3,900円"},{"dtText":"かけ放題","ddText":"＋ 880円 〜 1,980円（5分／10分／無制限で差があります）"},{"dtText":"事務手数料","ddText":"0円 〜 3,300円（乗り換えのときだけかかります）"},{"dtText":"解約金","ddText":"5社とも 0円（2026年9月1日時点）"}],"dtFixedPc":true,"dtWidthPc":200,"defaultSpClm1":true,"dtBgColor":"#eef2f7","dtTextColor":"#16305c","ddTextColor":"#1f2733","dtFontWeight":"600","dlBorderColor":"#d8dfe8","rowBorderColor":"#d8dfe8","dtBorderColor":"#d8dfe8","fontSizePc":17,"fontSizeSp":16,"cellPaddingPc":18} -->
<div class="wp-block-wdl-lw-pr-table-2 lw-pr-table-2" style="--table-2-dl-width-pc:100%;--table-2-dl-width-sp:100%;--table-2-grid-columns-pc:200px calc(100% - 200px);--table-2-grid-columns-sp:1fr 1fr;--table-2-dl-border-color:#d8dfe8;--table-2-dl-border-style:solid;--table-2-dl-border-width:1px;--table-2-dl-border-individual:0;--table-2-dl-border-top-color:#d8dfe8;--table-2-dl-border-top-style:solid;--table-2-dl-border-top-width:1px;--table-2-dl-border-bottom-color:#d8dfe8;--table-2-dl-border-bottom-style:solid;--table-2-dl-border-bottom-width:1px;--table-2-dl-border-left-color:#d8dfe8;--table-2-dl-border-left-style:solid;--table-2-dl-border-left-width:1px;--table-2-dl-border-right-color:#d8dfe8;--table-2-dl-border-right-style:solid;--table-2-dl-border-right-width:1px;--table-2-row-border-color:#d8dfe8;--table-2-row-border-style:solid;--table-2-row-border-width:1px;--table-2-dt-border-color:#d8dfe8;--table-2-dt-border-style:solid;--table-2-dt-border-width:1px;--table-2-dt-bg-color:#eef2f7;--table-2-cell-padding-pc:18px;--table-2-cell-padding-sp:18px;--table-2-font-size-pc:17px;--table-2-font-size-sp:16px;--table-2-dt-align-pc:left;--table-2-dt-align-sp:left;--table-2-dd-align-pc:left;--table-2-dd-align-sp:left;--table-2-dt-text-color:#16305c;--table-2-dd-text-color:#1f2733"><dl class="table-2__dl"><div class="table-2__row"><dt class="table-2__dt"><p data-lw_font_set="" style="font-weight:600">3GB</p></dt><dd class="table-2__dd"><p data-lw_font_set="">月 900円 〜 1,300円</p></dd></div><div class="table-2__row"><dt class="table-2__dt"><p data-lw_font_set="" style="font-weight:600">20GB</p></dt><dd class="table-2__dd"><p data-lw_font_set="">月 1,900円 〜 2,700円</p></dd></div><div class="table-2__row"><dt class="table-2__dt"><p data-lw_font_set="" style="font-weight:600">無制限</p></dt><dd class="table-2__dd"><p data-lw_font_set="">月 3,000円 〜 3,900円</p></dd></div><div class="table-2__row"><dt class="table-2__dt"><p data-lw_font_set="" style="font-weight:600">かけ放題</p></dt><dd class="table-2__dd"><p data-lw_font_set="">＋ 880円 〜 1,980円（5分／10分／無制限で差があります）</p></dd></div><div class="table-2__row"><dt class="table-2__dt"><p data-lw_font_set="" style="font-weight:600">事務手数料</p></dt><dd class="table-2__dd"><p data-lw_font_set="">0円 〜 3,300円（乗り換えのときだけかかります）</p></dd></div><div class="table-2__row"><dt class="table-2__dt"><p data-lw_font_set="" style="font-weight:600">解約金</p></dt><dd class="table-2__dd"><p data-lw_font_set="">5社とも 0円（2026年9月1日時点）</p></dd></div></dl></div>
<!-- /wp:wdl/lw-pr-table-2 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:24px">金額はすべて税込・2026年9月1日時点で各社の公式サイトから書き写したものです。割引を適用する前の金額です。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"選ぶときの物差し","subTitle":"HOW TO CHOOSE","headingLevel":2,"colorMain":"#16305c"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#16305c" id="monosashi"><h2 class="ttl"><span class="sub">HOW TO CHOOSE</span><span class="main">選ぶときの物差し</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:24px">安いかどうかだけで決めると、たいてい2か月目に後悔します。<span class="lw-br on_500px"></span>この4つを順番に見てください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-column-1 {"columnsPc":2,"columnWidthsPc":[1,1],"columnsSp":1,"rowGapPc":20,"columnGapPc":20,"rowGapSp":16,"itemBgNone":false,"itemBgTypePc":"solid","itemBgColorPc":"#eef2f7","itemBgTypeSp":"solid","itemBgColorSp":"#eef2f7","itemPaddingTopPc":26,"itemPaddingBottomPc":26,"itemPaddingLeftPc":26,"itemPaddingRightPc":26,"itemPaddingTopSp":20,"itemPaddingBottomSp":20,"itemPaddingLeftSp":18,"itemPaddingRightSp":18,"itemBorderRadiusTopLeftPc":8,"itemBorderRadiusTopRightPc":8,"itemBorderRadiusBottomRightPc":8,"itemBorderRadiusBottomLeftPc":8,"itemBorderRadiusTopLeftSp":8,"itemBorderRadiusTopRightSp":8,"itemBorderRadiusBottomRightSp":8,"itemBorderRadiusBottomLeftSp":8} -->
<div class="wp-block-wdl-lw-pr-column-1 lw-pr-column-1" style="--column-1-wrap-padding-pc:0px 0px 0px 0px;--column-1-wrap-padding-sp:0px 0px 0px 0px;--column-1-border-color-pc:rgb(131, 131, 131);--column-1-border-width-pc:0px;--column-1-border-style-pc:solid;--column-1-border-color-sp:rgb(131, 131, 131);--column-1-border-width-sp:0px;--column-1-border-style-sp:solid;--column-1-bdr-pc:0px 0px 0px 0px;--column-1-bdr-sp:0px 0px 0px 0px;--column-1-gtc-pc:1fr 1fr;--column-1-gtc-sp:1fr;--column-1-row-gap-pc:20px;--column-1-row-gap-sp:16px;--column-1-column-gap-pc:20px;--column-1-column-gap-sp:20px;--column-1-item-bg-pc:#eef2f7;--column-1-item-bg-sp:#eef2f7;--column-1-item-min-h-pc:0px;--column-1-item-min-h-sp:0px;--column-1-item-padding-pc:26px 26px 26px 26px;--column-1-item-padding-sp:20px 18px 20px 18px;--column-1-item-bdr-pc:8px 8px 8px 8px;--column-1-item-bdr-sp:8px 8px 8px 8px;--column-1-item-border-color-pc:rgb(131, 131, 131);--column-1-item-border-width-pc:0px;--column-1-item-border-style-pc:solid;--column-1-item-border-color-sp:rgb(131, 131, 131);--column-1-item-border-width-sp:0px;--column-1-item-border-style-sp:solid"><div class="custom_wrap"><!-- wp:heading {"level":3,"style":{"color":{"text":"#1668b0"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#1668b0;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">① 先月、何ギガ使ったか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">いまの明細を見てください。ここが分からないまま安いプランに変えると、毎月ギガを買い足すことになって元より高くつきます。</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"style":{"color":{"text":"#1668b0"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#1668b0;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">② 混む時間に使うか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">昼の12時台と夕方18時台は、どの会社も遅くなります。その時間に動画を見る人は、月額が200円高くてもそこが速い会社を選んだほうが安く済みます。</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"style":{"color":{"text":"#1668b0"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#1668b0;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">③ 電話をかけるか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">かけ放題は月880円〜1,980円かかります。仕事で毎日かけるなら必要ですが、月に数回なら30秒22円のほうが安いことがほとんどです。</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"style":{"color":{"text":"#1668b0"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#1668b0;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">④ やめやすいか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">解約金と最低利用期間、それにMNP予約番号がすぐ出るかどうか。合わなかったときにすぐ戻れる会社なら、気軽に試せます。</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-pr-column-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"乗り換えの流れ","subTitle":"FLOW","headingLevel":2,"colorMain":"#16305c"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#16305c" id="nagare"><h2 class="ttl"><span class="sub">FLOW</span><span class="main">乗り換えの流れ</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"0px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:0px">ここまで来たら、あとは3つです。かかる時間は合わせて1時間くらい。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"01","bgGradient":"#1668b0","colorNo":"#16305c","ulMaxWidth":900} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:900px"><div class="lw-step__li" style="border-color:#1668b0;--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:#16305c">01</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"color":{"text":"#16305c"},"typography":{"fontSize":"20px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 class="has-text-color" style="color:#16305c;font-size:20px;line-height:1.5;margin-top:0px;margin-bottom:8px">いまの契約を確かめる</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"1.9"}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:16px;line-height:1.9">明細で、先月使ったギガ数・かけ放題の有無・解約金の有無を見ます。ここを飛ばすと乗り換えたあとで足りなくなります。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"02","bgGradient":"#1668b0","colorNo":"#16305c","ulMaxWidth":900} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:900px"><div class="lw-step__li" style="border-color:#1668b0;--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:#16305c">02</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"color":{"text":"#16305c"},"typography":{"fontSize":"20px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 class="has-text-color" style="color:#16305c;font-size:20px;line-height:1.5;margin-top:0px;margin-bottom:8px">MNP予約番号をもらう</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"1.9"}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:16px;line-height:1.9">いまの会社のマイページから取れます。電話をかける必要はありません。番号には15日の期限があります。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:wdl/lw-pr-step-8 {"stepNo":"03","bgGradient":"#1668b0","colorNo":"#16305c","ulMaxWidth":900} -->
<div class="lw-pr-step-8"><div class="lw-step__inner" style="max-width:900px"><div class="lw-step__li" style="border-color:#1668b0;--step-8-bdr-pc:10px;--step-8-bdr-sp:10px"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;color:#16305c">03</div><div class="lw-step__li_in" style="--step-8-li-in-pt-pc:0.6em;--step-8-li-in-pt-sp:0.6em"><!-- wp:heading {"level":3,"style":{"color":{"text":"#16305c"},"typography":{"fontSize":"20px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"8px"}}}} -->
<h3 class="has-text-color" style="color:#16305c;font-size:20px;line-height:1.5;margin-top:0px;margin-bottom:8px">申し込んでSIMを差し替える</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"1.9"}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:16px;line-height:1.9">本人確認の書類とMNP予約番号を出して申し込みます。SIMが届いたら差し替えて、開通の手続きをして終わりです。</p>
<!-- /wp:paragraph --></div></div></div></div>
<!-- /wp:wdl/lw-pr-step-8 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:24px">手順のくわしい説明は <a href="/sim-mnp/">乗り換えの手順</a> にあります。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"よくある質問","subTitle":"Q&A","headingLevel":2,"colorMain":"#16305c"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#16305c" id="faq"><h2 class="ttl"><span class="sub">Q&A</span><span class="main">よくある質問</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-qa-3 {"maxWidth":900,"itemGap":20,"qLabelColor":"#16305c","aLabelColor":"#c1440e","lineColor":"#d8dfe8"} -->
<div class="wp-block-wdl-lw-pr-qa-3 lw-pr-qa-3" style="--qa3-max-w:900px;--qa3-gap:20px;--qa3-label-w:32px;--qa3-q-color:#16305c;--qa3-a-color:#c1440e;--qa3-line:#d8dfe8;--qa3-label-size-pc:18px;--qa3-label-size-sp:16px;--qa3-q-size-pc:17px;--qa3-q-size-sp:15px;--qa3-a-size-pc:15px;--qa3-a-size-sp:14px"><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">電話番号はそのまま使えますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">使えます。MNP予約番号をもらってから申し込めば、いまの番号のまま移せます。番号が変わるのは、予約番号を取らずに新規で契約したときだけです。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">いま使っているスマホをそのまま使えますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">多くの場合は使えます。各社が「動作確認済み端末」の一覧を公開しているので、申し込む前にご自分の機種名で探してください。数年前に購入した端末は、SIMロックがかかっていることがあります。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">手続きの途中で電話が使えなくなりますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">SIMを差し替えて開通の手続きをする数十分だけ、つながらない時間があります。それ以外は今まで通りです。平日の昼間に手続きすると、困ったときにすぐ問い合わせられます。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">格安SIMは遅いと聞きました</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">一日中遅いわけではありません。遅くなるのは平日の昼12時台と夕方で、それ以外の時間はほとんど差がありません。その時間に動画を見るかどうかで、選ぶ会社が変わります。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">このサイトの順位は広告料で決めていますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">決めていません。順位は料金・速度・かけ放題の合計額・やめやすさの4つで決めています。決め方はこのページの「順位の決め方」に書いています。広告のリンクからお申し込みがあると、当サイトに報酬が入ります。</p></dd></dl></div>
<!-- /wp:wdl/lw-pr-qa-3 -->
<!-- wp:wdl/lw-button-03 {"btnTextSub":"迷ったら、いちばん安い1社を1か月だけ","btnTextMain":"A社の公式サイトを見る","btnUrl":"https://example.com/a-mobile/","isAffiliate":true,"openNewTab":true,"bgGradient":"#c1440e","textMainColor":"#ffffff","textSubColor":"#16305c","iconColor":"#ffffff","fontWeight":"600","selectedIcon":"\u003csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"\u003e\u003c!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--\u003e\u003cpath d=\"M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z\"/\u003e\u003c/svg\u003e"} -->
<div class="wp-block-wdl-lw-button-03 lw-button-03"><div class="a_inner"><a href="https://example.com/a-mobile/" target="_blank" rel="sponsored nofollow"><span class="text_sub" style="color:#16305c;font-weight:600" data-lw_font_set="">迷ったら、いちばん安い1社を1か月だけ</span><div class="text_main_wrap"><div class="icon-svg" style="fill:#ffffff"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg></div><span class="text_main" style="color:#ffffff;font-weight:600" data-lw_font_set="">A社の公式サイトを見る</span></div></a><div class="a_background" style="background:#c1440e"></div></div></div>
<!-- /wp:wdl/lw-button-03 -->
<!-- wp:wdl/cta-1 {"buttonUrl":"/sim-plan/","openInNewTab":false,"filterColor":"rgba(22,48,92,0.82)","buttonBackgroundColor":"#c1440e","buttonBorderColor":"#ffffff","buttonBorderSize":1,"buttonMaxWidth":320,"headingLevel":2} -->
<div class="wp-block-wdl-cta-1 wp-block-wdl-cta-1 "><div class="cta-1__inner"><h2 class="cta-1__title heading_style_reset">まずは、いまの明細を見るところから</h2><p class="cta-1__text  ">先月のギガ数が分かれば、この中のどれを選べばいいかは決まります。合わなければ翌月に戻せるので、1か月だけ試すのがいちばん確実です。</p><a class="cta-1__button" href="/sim-plan/" style="background-color:#c1440e;border-color:#ffffff;border-width:1px;border-style:solid;max-width:320px">料金をくらべる</a></div><div class="cta-1__image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sm_cta_bg.webp" alt="" loading="lazy"/><div style="background-color:rgba(22,48,92,0.82);position:absolute;top:0;left:0;right:0;bottom:0;z-index:1"></div></div></div>
<!-- /wp:wdl/cta-1 -->