<!-- wp:wdl/lw-pr-fv-14 {"logoText":"カードくらべ","logoUrl":"/","headline":"年会費、\u003cbr\u003e払う価値はあるか。","description":"","leadText":"年会費・還元率・特典を、条件つきで比べるサイトです。","headingLevel":1,"bgType":"image","bgImgPc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_fv_top.webp","bgImgAlt":"机の上に置かれた財布とクレジットカード","bgFilterType":"solid","bgFilterColor":"#0a1730","bgFilterOpacity":62,"navMenuItems":[{"title":"年会費・還元率をくらべる","url":"/cc-hikaku/"},{"title":"半年使ってみた話","url":"/cc-review/"},{"title":"申し込みの流れ","url":"/cc-shinsa/"},{"title":"はじめての方へ","url":"/cc-fuan/"},{"title":"運営者情報","url":"/cc-about/"}],"cta1Text":"今月のおすすめ3枚","cta1Url":"#osusume","cta1Enable":true,"cta1BgColor":"#6e5312","cta1BorderColor":"#6e5312","cta2Text":"年会費・還元率をくらべる","cta2Url":"/cc-hikaku/","cta2Enable":true} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-100vh min-h-tb-100vh min-h-sp-100vh" style="--fv-btn-bg-color:#6e5312;--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:#6e5312;--fv-cta2-text-color:#ffffff"><header class="fv_in_header"><h1 class="logo"><a href="/" data-home-url=""><span>カードくらべ</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="/cc-hikaku/">年会費・還元率をくらべる</a></li><li class=""><a href="/cc-review/">半年使ってみた話</a></li><li class=""><a href="/cc-shinsa/">申し込みの流れ</a></li><li class=""><a href="/cc-fuan/">はじめての方へ</a></li><li class=""><a href="/cc-about/">運営者情報</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><p class="lead_text">年会費・還元率・特典を、条件つきで比べるサイトです。</p><h1 class="custom_title">年会費、<br>払う価値はあるか。</h1><div class="cta_wrap"><a href="#osusume"><span>今月のおすすめ3枚</span></a><a href="/cc-hikaku/"><span>年会費・還元率をくらべる</span></a></div></div><div class="bg_filter" style="background-color:#0a17309e"></div><picture class="bg_image"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_fv_top.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_fv_top.webp" alt="机の上に置かれた財布とクレジットカード" loading="eager"/></picture><script>(() => {
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
<!-- wp:paragraph {"align":"center","style":{"color":{"background":"#f5efe2","text":"#1f2733"},"typography":{"fontSize":"14px"},"spacing":{"padding":{"top":"10px","bottom":"10px","left":"16px","right":"16px"}}}} -->
<p class="has-text-align-center has-text-color has-background" style="color:#1f2733;font-size:14px"><strong>PR</strong>　このサイトには広告（アフィリエイトリンク）が含まれます。</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"2"},"spacing":{"margin":{"top":"24px","bottom":"8px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#1f2733;font-size:15px;line-height:2;margin-top:24px;margin-bottom:8px">このサイトは、クレジットカードの年会費・還元率を調べ直して並べているところです。<br>広告のリンクを含みますが、<strong>順位は報酬の金額では決めていません</strong>。<br>年会費・還元率は税込・2026年9月1日時点で各社の公式サイトから書き写しています。<br>お得さだけでなく、サポートの実測と、解約のしやすさも見ています。<br>どれを見ればいいか分からないときは、下の「重視ポイントでしぼる」から選んでください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":24,"tbHeight":20,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:24px"></div><div class="tb" style="height:20px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-column-1 {"columnsPc":1,"columnWidthsPc":[1],"columnsSp":1,"wrapPaddingTopPc":0,"wrapPaddingBottomPc":0,"itemBgNone":false,"itemBgTypePc":"solid","itemBgColorPc":"#f5efe2","itemBgTypeSp":"solid","itemBgColorSp":"#f5efe2","itemBorderColorPc":"#7a2e3a","itemBorderWidthPc":1,"itemBorderStylePc":"solid","itemBorderColorSp":"#7a2e3a","itemBorderWidthSp":1,"itemBorderStyleSp":"solid","itemPaddingTopPc":24,"itemPaddingBottomPc":24,"itemPaddingLeftPc":28,"itemPaddingRightPc":28,"itemPaddingTopSp":18,"itemPaddingBottomSp":18,"itemPaddingLeftSp":16,"itemPaddingRightSp":16,"itemBorderRadiusTopLeftPc":6,"itemBorderRadiusTopRightPc":6,"itemBorderRadiusBottomRightPc":6,"itemBorderRadiusBottomLeftPc":6,"itemBorderRadiusTopLeftSp":6,"itemBorderRadiusTopRightSp":6,"itemBorderRadiusBottomRightSp":6,"itemBorderRadiusBottomLeftSp":6} -->
<div class="wp-block-wdl-lw-pr-column-1 lw-pr-column-1" style="--column-1-wrap-padding-pc:0px 0px 0px 0px;--column-1-wrap-padding-sp:0px 0px 0px 0px;--column-1-border-color-pc:rgb(131, 131, 131);--column-1-border-width-pc:0px;--column-1-border-style-pc:solid;--column-1-border-color-sp:rgb(131, 131, 131);--column-1-border-width-sp:0px;--column-1-border-style-sp:solid;--column-1-bdr-pc:0px 0px 0px 0px;--column-1-bdr-sp:0px 0px 0px 0px;--column-1-gtc-pc:1fr;--column-1-gtc-sp:1fr;--column-1-row-gap-pc:8px;--column-1-row-gap-sp:8px;--column-1-column-gap-pc:8px;--column-1-column-gap-sp:8px;--column-1-item-bg-pc:#f5efe2;--column-1-item-bg-sp:#f5efe2;--column-1-item-min-h-pc:0px;--column-1-item-min-h-sp:0px;--column-1-item-padding-pc:24px 28px 24px 28px;--column-1-item-padding-sp:18px 16px 18px 16px;--column-1-item-bdr-pc:6px 6px 6px 6px;--column-1-item-bdr-sp:6px 6px 6px 6px;--column-1-item-border-color-pc:#7a2e3a;--column-1-item-border-width-pc:1px;--column-1-item-border-style-pc:solid;--column-1-item-border-color-sp:#7a2e3a;--column-1-item-border-width-sp:1px;--column-1-item-border-style-sp:solid"><div class="custom_wrap"><!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:16px;line-height:1.9;margin-top:0px;margin-bottom:0px"><strong>「実質年会費無料」「最大◯%還元」と書かれている条件には、たいてい注意書きが付いています。</strong><br>よくあるのは ①初年度だけ無料で2年目以降は利用額の条件がある ②高還元率は特定の店・カテゴリだけ ③家族カードや電子マネーは対象外 ④還元の上限がある の4つです。<br>このサイトでは、条件が付いている数字には<strong>その条件を同じ大きさで書き添えます</strong>。小さな注意書きにはしません。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item --></div></div>
<!-- /wp:wdl/lw-pr-column-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"重視ポイントでしぼる","subTitle":"STEP 1","headingLevel":2,"colorMain":"#14264a"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#14264a" id="erabu"><h2 class="ttl"><span class="sub">STEP 1</span><span class="main">重視ポイントでしぼる</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:24px">先に「何を重視するか」を決めると、候補は2〜3枚くらいまで減ります。<span class="lw-br on_500px"></span>近いものを選んでください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-banner-info-02 {"filterBackgroundColor":"#0a1730","filterOpacity":0.5,"items":[{"title":"年会費を払いたくない","description":"無料または実質無料の条件がある1枚を先に見ます","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_01.webp","alt":"財布から取り出したクレジットカード","linkUrl":"/cc-hikaku/#muryo","openInNewTab":false},{"title":"ポイントを貯めたい","description":"日常の支払いでの実質還元率で比べます","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_02.webp","alt":"レシートとスマートフォンの家計簿アプリ","linkUrl":"/cc-hikaku/#point","openInNewTab":false},{"title":"旅行・出張が多い","description":"空港ラウンジ・保険・マイル還元を先に見ます","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_03.webp","alt":"空港の窓際でスーツケースを持つ人","linkUrl":"/cc-hikaku/#travel","openInNewTab":false},{"title":"はじめての1枚が欲しい","description":"学生・新社会人向けに審査の通りやすさを見ます","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_04.webp","alt":"ノートパソコンの前で申し込みフォームを見る人","linkUrl":"/cc-hikaku/#hajime","openInNewTab":false}]} -->
<nav class="wp-block-wdl-lw-banner-info-02 lw-banner-info-02"><ul class="lw-banner-info-02__wrap"><li><a href="/cc-hikaku/#muryo"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_01.webp" alt="財布から取り出したクレジットカード"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>年会費を払いたくない</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>無料または実質無料の条件がある1枚を先に見ます</span></p><div class="filter" style="background-color:#0a1730;opacity:0.5"></div></a></li><li><a href="/cc-hikaku/#point"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_02.webp" alt="レシートとスマートフォンの家計簿アプリ"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>ポイントを貯めたい</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>日常の支払いでの実質還元率で比べます</span></p><div class="filter" style="background-color:#0a1730;opacity:0.5"></div></a></li><li><a href="/cc-hikaku/#travel"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_03.webp" alt="空港の窓際でスーツケースを持つ人"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>旅行・出張が多い</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>空港ラウンジ・保険・マイル還元を先に見ます</span></p><div class="filter" style="background-color:#0a1730;opacity:0.5"></div></a></li><li><a href="/cc-hikaku/#hajime"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_use_04.webp" alt="ノートパソコンの前で申し込みフォームを見る人"/><h3 class="title" style="font-weight:600" data-lw_font_set="Noto Sans JP"><span>はじめての1枚が欲しい</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>学生・新社会人向けに審査の通りやすさを見ます</span></p><div class="filter" style="background-color:#0a1730;opacity:0.5"></div></a></li></ul></nav>
<!-- /wp:wdl/lw-banner-info-02 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"今月のおすすめ3枚","subTitle":"RANKING","headingLevel":2,"colorMain":"#14264a"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#14264a" id="osusume"><h2 class="ttl"><span class="sub">RANKING</span><span class="main">今月のおすすめ3枚</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"0px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:0px">上でしぼった重視ポイントごとに、いま条件がいちばん釣り合っている3枚です。<span class="lw-br on_500px"></span>順位の決め方はこの下に書いています。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-ranking-1 {"showPr":true,"prText":"PR","isAffiliate":true,"showScore":true,"prBgColor":"#14264a","prTextColor":"#ffffff","rankUnit":"位","goodLabel":"ここが良い","badLabel":"気になる点","maxWidth":900,"marginTop":24,"boxBorderColor":"#ddd3ba","nameColor":"#14264a","commentColor":"#5c5346","goodColor":"#1f7a4d","badColor":"#7a2e3a","rank1Color":"#14264a","rank2Color":"#6e5312","rank3Color":"#5c5346","buttonColumnsPc":1,"items":[{"imageUrl":"","imageAlt":"","name":"Aカード（年会費無料）","comment":"「年会費は1円も払いたくない」という人が、いちばん条件を満たした1枚です。永年無料の条件が緩やかでした。","score":"4.5","good":"年会費が条件なしで永年無料","bad":"還元率は0.5%と控えめ","shops":[{"label":"公式サイトを見る","url":"https://example.com/a-card/","bgColor":"#6e5312","textColor":"#ffffff"}]},{"imageUrl":"","imageAlt":"","name":"Bカード（旅行特典）","comment":"出張・旅行が多い人向け。空港ラウンジが無料で使え、旅行保険も自動付帯でした。","score":"4.4","good":"空港ラウンジ無料＋旅行保険が自動付帯","bad":"年会費は11,000円（税込）とやや高め","shops":[{"label":"公式サイトを見る","url":"https://example.com/b-card/","bgColor":"#6e5312","textColor":"#ffffff"}]},{"imageUrl":"","imageAlt":"","name":"Cカード（ポイント高還元）","comment":"日常の買い物でポイントを貯めたい人向け。特約店なら還元率が上がるタイプです。","score":"4.2","good":"特約店なら還元率が3倍になる","bad":"還元率が高いのは対象店だけ","shops":[{"label":"公式サイトを見る","url":"https://example.com/c-card/","bgColor":"#6e5312","textColor":"#ffffff"}]}]} -->
<div class="wp-block-wdl-lw-pr-ranking-1 lw-pr-ranking-1" style="margin-top:24px;margin-bottom:0px;--rk1-max-width:900px;--rk1-gap:24px;--rk1-img-w:180px;--rk1-img-w-sp:110px;--rk1-name-size:19px;--rk1-name-size-sp:17px;--rk1-btn-size:15px;--rk1-score-color:#f0a020"><p class="lw-pr-ranking-1__pr" style="background-color:#14264a;color:#ffffff">PR</p><div class="lw-pr-ranking-1__item" style="background-color:#ffffff;border-color:#ddd3ba;border-width:1px;border-radius:10px"><span class="lw-pr-ranking-1__rank" style="background-color:#14264a;color:#ffffff">1位</span><div class="lw-pr-ranking-1__main"><div class="lw-pr-ranking-1__body"><p class="lw-pr-ranking-1__name" style="color:#14264a" data-lw_font_set="">Aカード（年会費無料）</p><p class="lw-pr-ranking-1__score"><span class="lw-pr-ranking-1__stars" aria-hidden="true"><span class="lw-pr-ranking-1__stars-on" style="width:90%">★★★★★</span>★★★★★</span><span class="lw-pr-ranking-1__score-num">4.5</span></p><p class="lw-pr-ranking-1__comment" style="color:#5c5346">「年会費は1円も払いたくない」という人が、いちばん条件を満たした1枚です。永年無料の条件が緩やかでした。</p><ul class="lw-pr-ranking-1__points"><li class="is-good"><span class="lw-pr-ranking-1__label" style="color:#1f7a4d">ここが良い</span><span>年会費が条件なしで永年無料</span></li><li class="is-bad"><span class="lw-pr-ranking-1__label" style="color:#7a2e3a">気になる点</span><span>還元率は0.5%と控えめ</span></li></ul></div></div><div class="lw-pr-ranking-1__shops" style="--rk1-btn-col:1;--rk1-btn-col-sp:1"><a class="lw-pr-ranking-1__shop" href="https://example.com/a-card/" target="_blank" rel="noopener noreferrer sponsored nofollow" style="background-color:#6e5312;color:#ffffff;border-radius:6px" data-lw_font_set="">公式サイトを見る</a></div></div><div class="lw-pr-ranking-1__item" style="background-color:#ffffff;border-color:#ddd3ba;border-width:1px;border-radius:10px"><span class="lw-pr-ranking-1__rank" style="background-color:#6e5312;color:#ffffff">2位</span><div class="lw-pr-ranking-1__main"><div class="lw-pr-ranking-1__body"><p class="lw-pr-ranking-1__name" style="color:#14264a" data-lw_font_set="">Bカード（旅行特典）</p><p class="lw-pr-ranking-1__score"><span class="lw-pr-ranking-1__stars" aria-hidden="true"><span class="lw-pr-ranking-1__stars-on" style="width:88%">★★★★★</span>★★★★★</span><span class="lw-pr-ranking-1__score-num">4.4</span></p><p class="lw-pr-ranking-1__comment" style="color:#5c5346">出張・旅行が多い人向け。空港ラウンジが無料で使え、旅行保険も自動付帯でした。</p><ul class="lw-pr-ranking-1__points"><li class="is-good"><span class="lw-pr-ranking-1__label" style="color:#1f7a4d">ここが良い</span><span>空港ラウンジ無料＋旅行保険が自動付帯</span></li><li class="is-bad"><span class="lw-pr-ranking-1__label" style="color:#7a2e3a">気になる点</span><span>年会費は11,000円（税込）とやや高め</span></li></ul></div></div><div class="lw-pr-ranking-1__shops" style="--rk1-btn-col:1;--rk1-btn-col-sp:1"><a class="lw-pr-ranking-1__shop" href="https://example.com/b-card/" target="_blank" rel="noopener noreferrer sponsored nofollow" style="background-color:#6e5312;color:#ffffff;border-radius:6px" data-lw_font_set="">公式サイトを見る</a></div></div><div class="lw-pr-ranking-1__item" style="background-color:#ffffff;border-color:#ddd3ba;border-width:1px;border-radius:10px"><span class="lw-pr-ranking-1__rank" style="background-color:#5c5346;color:#ffffff">3位</span><div class="lw-pr-ranking-1__main"><div class="lw-pr-ranking-1__body"><p class="lw-pr-ranking-1__name" style="color:#14264a" data-lw_font_set="">Cカード（ポイント高還元）</p><p class="lw-pr-ranking-1__score"><span class="lw-pr-ranking-1__stars" aria-hidden="true"><span class="lw-pr-ranking-1__stars-on" style="width:84%">★★★★★</span>★★★★★</span><span class="lw-pr-ranking-1__score-num">4.2</span></p><p class="lw-pr-ranking-1__comment" style="color:#5c5346">日常の買い物でポイントを貯めたい人向け。特約店なら還元率が上がるタイプです。</p><ul class="lw-pr-ranking-1__points"><li class="is-good"><span class="lw-pr-ranking-1__label" style="color:#1f7a4d">ここが良い</span><span>特約店なら還元率が3倍になる</span></li><li class="is-bad"><span class="lw-pr-ranking-1__label" style="color:#7a2e3a">気になる点</span><span>還元率が高いのは対象店だけ</span></li></ul></div></div><div class="lw-pr-ranking-1__shops" style="--rk1-btn-col:1;--rk1-btn-col-sp:1"><a class="lw-pr-ranking-1__shop" href="https://example.com/c-card/" target="_blank" rel="noopener noreferrer sponsored nofollow" style="background-color:#6e5312;color:#ffffff;border-radius:6px" data-lw_font_set="">公式サイトを見る</a></div></div></div>
<!-- /wp:wdl/lw-pr-ranking-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"#f5efe2","opacityPc":1,"filterTypeTb":"solid","filterColorTb":"#f5efe2","opacityTb":1,"filterTypeSp":"solid","filterColorSp":"#f5efe2","opacitySp":1} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:#f5efe2;--lw-bg-opacity-pc:1;--lw-bg-color-filter-tb:#f5efe2;--lw-bg-opacity-tb:1;--lw-bg-color-filter-sp:#f5efe2;--lw-bg-opacity-sp:1;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/lw-pr-custom-title-14 {"mainTitle":"順位の決め方","subTitle":"CRITERIA","headingLevel":3,"colorMain":"#6e5312","borderRadius":6,"alignmentPc":"center","alignmentSp":"center","maxWidth":720} -->
<div class="wp-block-wdl-lw-pr-custom-title-14 lw-pr-custom-title-14 center_pc center_sp" style="--color-main:#6e5312;max-width:720px;width:100%;--custom-title-14-border-radius:6px"><h3 class="ttl"><span class="sub"><span class="text">CRITERIA</span></span><span class="main">順位の決め方</span></h3></div>
<!-- /wp:wdl/lw-pr-custom-title-14 -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"24px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#1f2733;font-size:16px;line-height:1.9;margin-top:0px;margin-bottom:24px">順位は次の4つを同じ重みで見て決めています。<strong>広告の報酬額は見ていません。</strong>各社の公式サイトの規約と、実際に使っているカードでの実測から出しています。</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"16px","lineHeight":"2"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:16px;line-height:2;margin-top:0px;margin-bottom:0px">・年会費に対する実質の還元率（条件を満たした場合の上限ではなく平均）<br>・付帯保険・特典を金額に換算した合計額<br>・サポート対応の実測（電話・チャットの応答時間）<br>・解約金の有無・解約の手続きのしやすさ</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#5c5346"},"typography":{"fontSize":"15px"},"spacing":{"margin":{"top":"24px","bottom":"0px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#5c5346;font-size:15px;margin-top:24px;margin-bottom:0px">調べた日：2026年9月1日／調べたカード：5枚（すべて自分で契約して使っています）</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"年会費・還元率のめやす","subTitle":"PRICE","headingLevel":2,"colorMain":"#14264a"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#14264a" id="hikaku"><h2 class="ttl"><span class="sub">PRICE</span><span class="main">年会費・還元率のめやす</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:24px">5枚を同じ条件でそろえたときの<strong>幅</strong>です。<span class="lw-br on_500px"></span>1枚ずつの表は「くらべる」にあります。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-company-2 {"maxWidth":900,"spFullDt":true,"dtWidthClass":"dt_width_l","dtBackgroundColor":"#f5efe2","dtTextColor":"#14264a","ddTextColor":"#1f2733","borderColor":"#ddd3ba"} -->
<div class="wp-block-wdl-lw-company-2 font_size_m" style="border-color:#ddd3ba"><dl class="sp_clm_1" style="border-color:#ddd3ba;max-width:900px;line-height:1.6"><div class="company-profile-item font_size_m dt_width_l" style="border-color:#ddd3ba"><dt style="background-color:#f5efe2;color:#14264a;line-height:1.6" data-lw_font_set="">年会費</dt><dd style="color:#1f2733;line-height:1.6" data-lw_font_set="">無料 〜 11,000円（税込・初年度無料の条件あり）</dd></div><div class="company-profile-item font_size_m dt_width_l" style="border-color:#ddd3ba"><dt style="background-color:#f5efe2;color:#14264a;line-height:1.6" data-lw_font_set="">基本の還元率</dt><dd style="color:#1f2733;line-height:1.6" data-lw_font_set="">0.5% 〜 1.0%</dd></div><div class="company-profile-item font_size_m dt_width_l" style="border-color:#ddd3ba"><dt style="background-color:#f5efe2;color:#14264a;line-height:1.6" data-lw_font_set="">特約店の還元率</dt><dd style="color:#1f2733;line-height:1.6" data-lw_font_set="">最大3.0%（対象店・条件つき）</dd></div><div class="company-profile-item font_size_m dt_width_l" style="border-color:#ddd3ba"><dt style="background-color:#f5efe2;color:#14264a;line-height:1.6" data-lw_font_set="">発行までの日数</dt><dd style="color:#1f2733;line-height:1.6" data-lw_font_set="">最短即日 〜 3週間</dd></div><div class="company-profile-item font_size_m dt_width_l" style="border-color:#ddd3ba"><dt style="background-color:#f5efe2;color:#14264a;line-height:1.6" data-lw_font_set="">家族カード</dt><dd style="color:#1f2733;line-height:1.6" data-lw_font_set="">無料 〜 年1,100円（1枚目）</dd></div><div class="company-profile-item font_size_m dt_width_l" style="border-color:#ddd3ba"><dt style="background-color:#f5efe2;color:#14264a;line-height:1.6" data-lw_font_set="">解約金</dt><dd style="color:#1f2733;line-height:1.6" data-lw_font_set="">5枚とも 0円（2026年9月1日時点）</dd></div></dl></div>
<!-- /wp:wdl/lw-company-2 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:24px">金額・還元率はすべて税込・2026年9月1日時点で各社の公式サイトから書き写したものです。キャンペーンの上乗せ分は含みません。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"選ぶときの物差し","subTitle":"HOW TO CHOOSE","headingLevel":2,"colorMain":"#14264a"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#14264a" id="monosashi"><h2 class="ttl"><span class="sub">HOW TO CHOOSE</span><span class="main">選ぶときの物差し</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"28px","bottom":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:28px;margin-bottom:24px">年会費の安さだけで決めると、たいてい半年後に後悔します。<span class="lw-br on_500px"></span>この4つを順番に見てください。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-column-1 {"columnsPc":2,"columnWidthsPc":[1,1],"columnsSp":1,"rowGapPc":20,"columnGapPc":20,"rowGapSp":16,"itemBgNone":false,"itemBgTypePc":"solid","itemBgColorPc":"#f5efe2","itemBgTypeSp":"solid","itemBgColorSp":"#f5efe2","itemPaddingTopPc":26,"itemPaddingBottomPc":26,"itemPaddingLeftPc":26,"itemPaddingRightPc":26,"itemPaddingTopSp":20,"itemPaddingBottomSp":20,"itemPaddingLeftSp":18,"itemPaddingRightSp":18,"itemBorderRadiusTopLeftPc":8,"itemBorderRadiusTopRightPc":8,"itemBorderRadiusBottomRightPc":8,"itemBorderRadiusBottomLeftPc":8,"itemBorderRadiusTopLeftSp":8,"itemBorderRadiusTopRightSp":8,"itemBorderRadiusBottomRightSp":8,"itemBorderRadiusBottomLeftSp":8} -->
<div class="wp-block-wdl-lw-pr-column-1 lw-pr-column-1" style="--column-1-wrap-padding-pc:0px 0px 0px 0px;--column-1-wrap-padding-sp:0px 0px 0px 0px;--column-1-border-color-pc:rgb(131, 131, 131);--column-1-border-width-pc:0px;--column-1-border-style-pc:solid;--column-1-border-color-sp:rgb(131, 131, 131);--column-1-border-width-sp:0px;--column-1-border-style-sp:solid;--column-1-bdr-pc:0px 0px 0px 0px;--column-1-bdr-sp:0px 0px 0px 0px;--column-1-gtc-pc:1fr 1fr;--column-1-gtc-sp:1fr;--column-1-row-gap-pc:20px;--column-1-row-gap-sp:16px;--column-1-column-gap-pc:20px;--column-1-column-gap-sp:20px;--column-1-item-bg-pc:#f5efe2;--column-1-item-bg-sp:#f5efe2;--column-1-item-min-h-pc:0px;--column-1-item-min-h-sp:0px;--column-1-item-padding-pc:26px 26px 26px 26px;--column-1-item-padding-sp:20px 18px 20px 18px;--column-1-item-bdr-pc:8px 8px 8px 8px;--column-1-item-bdr-sp:8px 8px 8px 8px;--column-1-item-border-color-pc:rgb(131, 131, 131);--column-1-item-border-width-pc:0px;--column-1-item-border-style-pc:solid;--column-1-item-border-color-sp:rgb(131, 131, 131);--column-1-item-border-width-sp:0px;--column-1-item-border-style-sp:solid"><div class="custom_wrap"><!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:heading {"level":3,"style":{"color":{"text":"#6e5312"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#6e5312;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">① 月にいくら使っているか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">いまの明細を見てください。使う金額が少ないと、還元率が高くても年会費の元が取れません。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item -->
<!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:heading {"level":3,"style":{"color":{"text":"#6e5312"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#6e5312;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">② ポイントを何に使いたいか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">マイルに替えたいのか、現金化したいのか、買い物に使いたいのかで向くカードが変わります。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item -->
<!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:heading {"level":3,"style":{"color":{"text":"#6e5312"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#6e5312;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">③ 年に何回旅行するか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">空港ラウンジや旅行保険は、年に何度も使ってはじめて年会費の元が取れます。年1回以下なら不要なことが多いです。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item -->
<!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:heading {"level":3,"style":{"color":{"text":"#6e5312"},"typography":{"fontSize":"17px","lineHeight":"1.5"},"spacing":{"margin":{"top":"0px","bottom":"10px"}}}} -->
<h3 class="has-text-color" style="color:#6e5312;font-size:17px;line-height:1.5;margin-top:0px;margin-bottom:10px">④ 解約しやすいか</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#1f2733"},"typography":{"fontSize":"15px","lineHeight":"1.9"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
<p class="has-text-color" style="color:#1f2733;font-size:15px;line-height:1.9;margin-top:0px;margin-bottom:0px">解約金の有無と、解約の窓口が電話だけかどうか。合わなかったときにすぐ抜けられるカードなら、気軽に試せます。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item --></div></div>
<!-- /wp:wdl/lw-pr-column-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-step-1 {"titleText":"申し込みの流れ","colorLiSvg":"#6e5312","ulMaxWidth":900} -->
<div class="wp-block-wdl-lw-step-1 lw-step-1" id="nagare"><h2 class="lw-step-1__title">申し込みの流れ</h2><ul class="lw-step-1__inner" style="max-width:900px"><li class="lw-step-1__li"><h3 data-lw_font_set="" style="background:var(--color-main)">① 本人確認書類を用意する</h3><p data-lw_font_set="">運転免許証・マイナンバーカードなど、住所と顔写真が確認できる書類を用意します。ここを飛ばすと再提出になります。</p><span class="icon" style="fill:#6e5312"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></span></li><li class="lw-step-1__li"><h3 data-lw_font_set="" style="background:var(--color-main)">② 申し込みフォームに入力する</h3><p data-lw_font_set="">氏名・住所・勤務先情報を入力します。勤務先の電話番号は正確に。在籍確認の連絡が来ることがあります。</p><span class="icon" style="fill:#6e5312"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></span></li><li class="lw-step-1__li"><h3 data-lw_font_set="" style="background:var(--color-main)">③ 審査結果を待つ</h3><p data-lw_font_set="">最短即日〜1週間ほどで結果が届きます。カードは郵送で、受け取りに本人確認が要ることがあります。</p><span class="icon" style="fill:#6e5312"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></span></li></ul><div class="lw-step-1__filter" style="background:var(--color-main);opacity:0.15"></div></div>
<!-- /wp:wdl/lw-step-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:24px">手順のくわしい説明は <a href="/cc-shinsa/">申し込みの流れ</a> にあります。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-custom-title-13 {"mainTitle":"よくある質問","subTitle":"Q&A","headingLevel":2,"colorMain":"#14264a"} -->
<div class="wp-block-wdl-lw-pr-custom-title-13 lw-pr-custom-title-13" style="--color-main:#14264a" id="faq"><h2 class="ttl"><span class="sub">Q&A</span><span class="main">よくある質問</span><div class="left"></div><div class="right"></div></h2></div>
<!-- /wp:wdl/lw-pr-custom-title-13 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-qa-3 {"maxWidth":900,"itemGap":20,"qLabelColor":"#14264a","aLabelColor":"#7a2e3a","lineColor":"#ddd3ba"} -->
<div class="wp-block-wdl-lw-pr-qa-3 lw-pr-qa-3" style="--qa3-max-w:900px;--qa3-gap:20px;--qa3-label-w:32px;--qa3-q-color:#14264a;--qa3-a-color:#7a2e3a;--qa3-line:#ddd3ba;--qa3-label-size-pc:18px;--qa3-label-size-sp:16px;--qa3-q-size-pc:17px;--qa3-q-size-sp:15px;--qa3-a-size-pc:15px;--qa3-a-size-sp:14px"><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">審査に落ちることはありますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">あります。年収や他社での延滞履歴などが見られます。落ちても信用情報に大きな影響は残らないことが多いですが、短期間に何枚も申し込むのは避けたほうが無難です。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">複数枚を同時に申し込んでもいいですか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">できますが、短期間に何件も申し込むと審査で不利になることがあります。まず1枚にしぼって、様子を見てから増やすほうが確実です。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">年会費はいつ請求されますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">多くの場合は入会月または初回利用月を基準に、1年ごとに請求されます。初年度無料でも2年目の請求日は各社で違うので、申し込み時に確かめてください。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">このサイトの順位は広告料で決めていますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">決めていません。順位は還元率・特典額・サポート・解約のしやすさの4つで決めています。決め方はこのページの「順位の決め方」に書いています。広告のリンクからお申し込みがあると、当サイトに報酬が入ります。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">未成年でも作れますか</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">多くの会社で18歳以上（高校生を除く）なら申し込めます。20歳未満は親権者の同意が必要になることがあります。詳しくは各社の申し込み条件をご確認ください。</p></dd></dl></div>
<!-- /wp:wdl/lw-pr-qa-3 -->
<!-- wp:wdl/lw-button-03 {"btnTextSub":"迷ったら、年会費無料の1枚から","btnTextMain":"Aカードの公式サイトを見る","btnUrl":"https://example.com/a-card/","isAffiliate":true,"openNewTab":true,"bgGradient":"#6e5312","textMainColor":"#ffffff","textSubColor":"#14264a","iconColor":"#ffffff","fontWeight":"600","selectedIcon":"\u003csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"\u003e\u003c!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--\u003e\u003cpath d=\"M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z\"/\u003e\u003c/svg\u003e"} -->
<div class="wp-block-wdl-lw-button-03 lw-button-03"><div class="a_inner"><a href="https://example.com/a-card/" target="_blank" rel="sponsored nofollow"><span class="text_sub" style="color:#14264a;font-weight:600" data-lw_font_set="">迷ったら、年会費無料の1枚から</span><div class="text_main_wrap"><div class="icon-svg" style="fill:#ffffff"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg></div><span class="text_main" style="color:#ffffff;font-weight:600" data-lw_font_set="">Aカードの公式サイトを見る</span></div></a><div class="a_background" style="background:#6e5312"></div></div></div>
<!-- /wp:wdl/lw-button-03 -->
<!-- wp:wdl/cta-1 {"buttonUrl":"/cc-hikaku/","openInNewTab":false,"filterColor":"rgba(20,38,74,0.82)","buttonBackgroundColor":"#6e5312","buttonBorderColor":"#ffffff","buttonBorderSize":1,"buttonMaxWidth":320,"headingLevel":2} -->
<div class="wp-block-wdl-cta-1 wp-block-wdl-cta-1 "><div class="cta-1__inner"><h2 class="cta-1__title heading_style_reset">まずは、いまの明細を見るところから</h2><p class="cta-1__text  ">月にいくら使っているかが分かれば、この中のどれを選べばいいかは決まります。解約金は5枚とも0円なので、合わなければやめられます。</p><a class="cta-1__button" href="/cc-hikaku/" style="background-color:#6e5312;border-color:#ffffff;border-width:1px;border-style:solid;max-width:320px">年会費・還元率をくらべる</a></div><div class="cta-1__image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/cc_cta_bg.webp" alt="" loading="lazy"/><div style="background-color:rgba(20,38,74,0.82);position:absolute;top:0;left:0;right:0;bottom:0;z-index:1"></div></div></div>
<!-- /wp:wdl/cta-1 -->