<!-- wp:wdl/lw-pr-fv-14 {"logoText":"みなと内科クリニック","logoUrl":"#","cta1Text":"WEB予約はこちら","cta1BgColor":"#0f5b78","cta1BorderColor":"#0f5b78","cta2Text":"お電話 048-000-0000","cta2Url":"tel:0480000000","leadText":"内科・小児科・アレルギー科","headline":"かかりつけ医として、<br>いちばん近くで。","description":"気になる症状のご相談から、生活習慣病の管理、予防接種・健診まで。どなたにも分かる言葉でご説明し、無理なく続けられる医療を一緒に考えます。","headingLevel":1,"bgImgPc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/fv_top.webp","bgImgAlt":"みなと内科クリニックの待合室","bgFilterColor":"#0f3648","bgFilterOpacity":32,"navMenuItems":[{"id":1,"title":"当院について","url":"#about","children":[]},{"id":2,"title":"診療案内","url":"#medical","children":[]},{"id":3,"title":"はじめての方へ","url":"#flow","children":[]},{"id":4,"title":"診療時間・アクセス","url":"#hours","children":[]},{"id":5,"title":"患者さんの声","url":"#voice","children":[]}],"minHeightTb":"min-h-tb-768px","minHeightSp":"min-h-sp-560px"} -->
<div class="wp-block-wdl-lw-pr-fv-14 lw-pr-fv-14 min-h-pc-100vh min-h-tb-768px min-h-sp-560px" style="--fv-btn-bg-color:#0f5b78;--fv-btn-text-color:#ffffff;--fv-btn-bd-width:1px;--fv-btn-bd-width-color:#0f5b78;--fv-cta2-text-color:#ffffff"><header class="fv_in_header"><h1 class="logo"><a href="#" data-home-url=""><span>みなと内科クリニック</span></a></h1><nav class="fv_in_nav"><ul class="header_menu_pc"><li class=""><a href="#about">当院について</a></li><li class=""><a href="#medical">診療案内</a></li><li class=""><a href="#flow">はじめての方へ</a></li><li class=""><a href="#hours">診療時間・アクセス</a></li><li class=""><a href="#voice">患者さんの声</a></li></ul></nav><div class="ham_btn drawer_nav_open"><div class="in"><div></div><div></div></div></div></header><div class="fv_inner"><p class="lead_text">内科・小児科・アレルギー科</p><h1 class="custom_title">かかりつけ医として、<br>いちばん近くで。</h1><p class="desc">気になる症状のご相談から、生活習慣病の管理、予防接種・健診まで。どなたにも分かる言葉でご説明し、無理なく続けられる医療を一緒に考えます。</p><div class="cta_wrap"><a href="#"><span>WEB予約はこちら</span></a><a href="tel:0480000000"><span>お電話 048-000-0000</span></a></div></div><div class="bg_filter" style="background-color:#0f364852"></div><picture class="bg_image"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/fv_top.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/fv_top.webp" alt="みなと内科クリニックの待合室" loading="eager"/></picture><script>(() => {
'use strict';
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
  document.querySelectorAll('.lazy-video').forEach(function(v) {
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

<!-- wp:wdl/lw-banner-info-04 {"filterBackgroundColor":"#0f3648","filterOpacity":0.42,"maxWidth":1040,"titleFontWeight":"700","items":[{"title":"初めての方へ","description":"受付から会計までの流れ","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_first.webp","alt":"受付","linkUrl":"#flow","openInNewTab":false},{"title":"診療時間・休診日","description":"9:00〜12:30 / 15:00〜18:30","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_hours.webp","alt":"診察室","linkUrl":"#hours","openInNewTab":false},{"title":"アクセス・駐車場","description":"〒330-0000 埼玉県さいたま市中央区0-0-0","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_access.webp","alt":"外観","linkUrl":"#hours","openInNewTab":false},{"title":"WEB予約","description":"24時間受付・待ち時間を短く","imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_reserve.webp","alt":"受付カウンター","linkUrl":"#","openInNewTab":false}]} -->
<nav class="wp-block-wdl-lw-banner-info-04 lw-banner-info-04"><ul class="lw-banner-info-04__wrap" style="max-width:1040px"><li><a href="#flow"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_first.webp" alt="受付"/><h3 class="title" style="font-weight:700" data-lw_font_set="Noto Sans JP"><span>初めての方へ</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>受付から会計までの流れ</span></p><div class="filter" style="background-color:#0f3648;opacity:0.42"></div></a></li><li><a href="#hours"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_hours.webp" alt="診察室"/><h3 class="title" style="font-weight:700" data-lw_font_set="Noto Sans JP"><span>診療時間・休診日</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>9:00〜12:30 / 15:00〜18:30</span></p><div class="filter" style="background-color:#0f3648;opacity:0.42"></div></a></li><li><a href="#hours"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_access.webp" alt="外観"/><h3 class="title" style="font-weight:700" data-lw_font_set="Noto Sans JP"><span>アクセス・駐車場</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>〒330-0000 埼玉県さいたま市中央区0-0-0</span></p><div class="filter" style="background-color:#0f3648;opacity:0.42"></div></a></li><li><a href="#"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/nav_reserve.webp" alt="受付カウンター"/><h3 class="title" style="font-weight:700" data-lw_font_set="Noto Sans JP"><span>WEB予約</span></h3><p class="description" style="font-weight:400" data-lw_font_set="Noto Sans JP"><span>24時間受付・待ち時間を短く</span></p><div class="filter" style="background-color:#0f3648;opacity:0.42"></div></a></li></ul></nav>
<!-- /wp:wdl/lw-banner-info-04 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":104,"tbHeight":76,"spHeight":52} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:104px"></div><div class="tb" style="height:76px"></div><div class="sp" style="height:52px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"当院について","subTitle":"ABOUT","afterColor":"#3f9dbd","afterMarginTopPc":1.2,"afterMarginTopSp":1,"afterHeightPc":3,"afterHeightSp":3,"afterWidthPc":44,"afterWidthSp":40,"fontSizePc":14,"fontSizeSp":13,"mainFontWeight":"700","subFontWeight":"500"} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:#3f9dbd;--title-15-after-mt-pc:1.2em;--title-15-after-mt-sp:1em;--title-15-after-h-pc:3px;--title-15-after-h-sp:3px;--title-15-after-w-pc:44px;--title-15-after-w-sp:40px;--title-15-font-size_pc:14px;--title-15-font-size_sp:13px" id="about"><span class="main" style="font-weight:700">当院について</span><span class="sub" style="font-weight:500">ABOUT</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":28,"tbHeight":22,"spHeight":18} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:28px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:18px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-content-8 {"fontColorLi":"#0f5b78","fontColorLiP":"#26383f","titleBorderColor":"#3f9dbd","titleBorderSize":0,"liBorderColor":"#dbe6ea","liBorderSize":1,"liBorderRadius":10,"subBorderColor":"#3f9dbd","subFontColor":"#3f9dbd","innerMaxWidth":1100,"showButton":false,"contents":[{"sub":"01","main":"分かる言葉で説明します","text":"検査の結果も、お薬の意味も、専門用語のままではお伝えしません。図や数値をお見せしながら、いま何が起きていて、次に何をするのかをご説明します。","url":"#","btnText":""},{"sub":"02","main":"待ち時間を短くします","text":"WEB予約で来院の時間を分散し、受付から会計までの動線を短くしています。体調が悪いときに長く座っていなくて済むように、という考え方です。","url":"#","btnText":""},{"sub":"03","main":"必要なときは、つなぎます","text":"当院で対応が難しい症状は、抱え込まずに専門の医療機関へご紹介します。近隣の病院と連携しているので、検査や入院が必要な場合もお待たせしません。","url":"#","btnText":""}]} -->
<div class="wp-block-wdl-lw-content-8 lw-content-8"><ul class="lw-content-8__inner clm_3" style="max-width:1100px;margin:0 auto"><li class="lw-content-8__li" style="border-color:#dbe6ea;border-width:1px;border-style:solid;padding-top:24px;padding-bottom:24px;padding-left:24px;padding-right:24px;border-radius:10px"><a href="#" class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:#0f5b78;border-bottom-color:#3f9dbd;border-bottom-width:0;border-bottom-style:none"><span class="sub" data-lw_font_set="" style="font-weight:600;border-color:#3f9dbd;border-width:1px;border-style:solid;display:inline-block;color:#3f9dbd;background-color:#ffffff">01</span><span class="main left" data-lw_font_set="" style="font-weight:700">分かる言葉で説明します</span></h3><p class="lw-content-8__text font_size_m" data-lw_font_set="" style="font-weight:400;color:#26383f">検査の結果も、お薬の意味も、専門用語のままではお伝えしません。図や数値をお見せしながら、いま何が起きていて、次に何をするのかをご説明します。</p></a></li><li class="lw-content-8__li" style="border-color:#dbe6ea;border-width:1px;border-style:solid;padding-top:24px;padding-bottom:24px;padding-left:24px;padding-right:24px;border-radius:10px"><a href="#" class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:#0f5b78;border-bottom-color:#3f9dbd;border-bottom-width:0;border-bottom-style:none"><span class="sub" data-lw_font_set="" style="font-weight:600;border-color:#3f9dbd;border-width:1px;border-style:solid;display:inline-block;color:#3f9dbd;background-color:#ffffff">02</span><span class="main left" data-lw_font_set="" style="font-weight:700">待ち時間を短くします</span></h3><p class="lw-content-8__text font_size_m" data-lw_font_set="" style="font-weight:400;color:#26383f">WEB予約で来院の時間を分散し、受付から会計までの動線を短くしています。体調が悪いときに長く座っていなくて済むように、という考え方です。</p></a></li><li class="lw-content-8__li" style="border-color:#dbe6ea;border-width:1px;border-style:solid;padding-top:24px;padding-bottom:24px;padding-left:24px;padding-right:24px;border-radius:10px"><a href="#" class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:#0f5b78;border-bottom-color:#3f9dbd;border-bottom-width:0;border-bottom-style:none"><span class="sub" data-lw_font_set="" style="font-weight:600;border-color:#3f9dbd;border-width:1px;border-style:solid;display:inline-block;color:#3f9dbd;background-color:#ffffff">03</span><span class="main left" data-lw_font_set="" style="font-weight:700">必要なときは、つなぎます</span></h3><p class="lw-content-8__text font_size_m" data-lw_font_set="" style="font-weight:400;color:#26383f">当院で対応が難しい症状は、抱え込まずに専門の医療機関へご紹介します。近隣の病院と連携しているので、検査や入院が必要な場合もお待たせしません。</p></a></li></ul></div>
<!-- /wp:wdl/lw-content-8 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":104,"tbHeight":76,"spHeight":52} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:104px"></div><div class="tb" style="height:76px"></div><div class="sp" style="height:52px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"診療案内","subTitle":"MEDICAL","afterColor":"#3f9dbd","afterMarginTopPc":1.2,"afterMarginTopSp":1,"afterHeightPc":3,"afterHeightSp":3,"afterWidthPc":44,"afterWidthSp":40,"fontSizePc":14,"fontSizeSp":13,"mainFontWeight":"700","subFontWeight":"500"} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:#3f9dbd;--title-15-after-mt-pc:1.2em;--title-15-after-mt-sp:1em;--title-15-after-h-pc:3px;--title-15-after-h-sp:3px;--title-15-after-w-pc:44px;--title-15-after-w-sp:40px;--title-15-font-size_pc:14px;--title-15-font-size_sp:13px" id="medical"><span class="main" style="font-weight:700">診療案内</span><span class="sub" style="font-weight:500">MEDICAL</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":28,"tbHeight":22,"spHeight":18} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:28px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:18px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-list-6 {"rowGapPc":40,"columnGapPc":24,"fontWeightTitle":"700","colorTitle":"#0f5b78","marginTopTtlPc":16,"colorDescription":"#26383f","labelBgColor":"#3f9dbd","labelTextColor":"#ffffff","labelFontSizePc":12,"items":[{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_naika.webp","label":"急な症状も","title":"内科","description":"発熱・かぜ・腹痛・倦怠感などの急な症状から、高血圧・糖尿病・脂質異常症といった生活習慣病の管理まで対応します。"},{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_shonika.webp","label":"お子さま","title":"小児科","description":"お子さまの発熱・せき・発疹のご相談、乳幼児健診、各種予防接種に対応します。泣いても大丈夫な個室をご用意しています。"},{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_allergy.webp","label":"原因から","title":"アレルギー科","description":"花粉症、通年性のアレルギー性鼻炎、じんましんなど。検査で原因を確かめたうえで、治療の選択肢をご提案します。"},{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_kenshin.webp","label":"予防","title":"予防接種・健診","description":"インフルエンザ・肺炎球菌などの予防接種、特定健診、企業健診に対応します。ご予約のうえお越しください。"}]} -->
<div class="wp-block-wdl-lw-pr-list-6 lw-pr-list-6" style="--columns-pc:4;--columns-sp:2;--list-6-row-gap-pc:40px;--list-6-row-gap-sp:40px;--list-6-column-gap-pc:24px;--list-6-column-gap-sp:24px;--list-6-fontsize-ttl-pc:18px;--list-6-fontsize-ttl-tb:18px;--list-6-fontsize-ttl-sp:18px;--list-6-align-ttl-pc:center;--list-6-align-ttl-sp:center;--list-6-margin-top-ttl-pc:16px;--list-6-margin-top-ttl-sp:16px;--list-6-fontsize-p-pc:14px;--list-6-fontsize-p-tb:14px;--list-6-fontsize-p-sp:14px;--list-6-align-p-pc:left;--list-6-align-p-sp:left;--list-6-label-bg:#3f9dbd;--list-6-label-color:#ffffff;--list-6-label-fontsize-pc:12px;--list-6-label-fontsize-sp:12px"><ul class="custom_list_items"><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_naika.webp" alt="" style="aspect-ratio:9/6"/><span class="label">急な症状も</span></div><h3 class="custom_ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">内科</h3><p class="custom_p" data-lw_font_set="" style="color:#26383f">発熱・かぜ・腹痛・倦怠感などの急な症状から、高血圧・糖尿病・脂質異常症といった生活習慣病の管理まで対応します。</p></li><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_shonika.webp" alt="" style="aspect-ratio:9/6"/><span class="label">お子さま</span></div><h3 class="custom_ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">小児科</h3><p class="custom_p" data-lw_font_set="" style="color:#26383f">お子さまの発熱・せき・発疹のご相談、乳幼児健診、各種予防接種に対応します。泣いても大丈夫な個室をご用意しています。</p></li><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_allergy.webp" alt="" style="aspect-ratio:9/6"/><span class="label">原因から</span></div><h3 class="custom_ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">アレルギー科</h3><p class="custom_p" data-lw_font_set="" style="color:#26383f">花粉症、通年性のアレルギー性鼻炎、じんましんなど。検査で原因を確かめたうえで、治療の選択肢をご提案します。</p></li><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/dept_kenshin.webp" alt="" style="aspect-ratio:9/6"/><span class="label">予防</span></div><h3 class="custom_ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">予防接種・健診</h3><p class="custom_p" data-lw_font_set="" style="color:#26383f">インフルエンザ・肺炎球菌などの予防接種、特定健診、企業健診に対応します。ご予約のうえお越しください。</p></li></ul></div>
<!-- /wp:wdl/lw-pr-list-6 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":104,"tbHeight":76,"spHeight":52} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:104px"></div><div class="tb" style="height:76px"></div><div class="sp" style="height:52px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"はじめての方へ","subTitle":"FLOW","afterColor":"#3f9dbd","afterMarginTopPc":1.2,"afterMarginTopSp":1,"afterHeightPc":3,"afterHeightSp":3,"afterWidthPc":44,"afterWidthSp":40,"fontSizePc":14,"fontSizeSp":13,"mainFontWeight":"700","subFontWeight":"500"} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:#3f9dbd;--title-15-after-mt-pc:1.2em;--title-15-after-mt-sp:1em;--title-15-after-h-pc:3px;--title-15-after-h-sp:3px;--title-15-after-w-pc:44px;--title-15-after-w-sp:40px;--title-15-font-size_pc:14px;--title-15-font-size_sp:13px" id="flow"><span class="main" style="font-weight:700">はじめての方へ</span><span class="sub" style="font-weight:500">FLOW</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":28,"tbHeight":22,"spHeight":18} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:28px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:18px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-step-7 {"circleBgColor":"#0f5b78","borderColor":"#dbe6ea","ulMaxWidth":1100,"columnCountPc":4,"columnCountSp":1,"fontWeightH3":"700","colorH3":"#0f5b78","colorP":"#26383f","contents":[{"title":"ご予約","text":"WEB予約またはお電話で。予約なしでも受診いただけますが、お待たせすることがあります。"},{"title":"受付・問診","text":"保険証と、お持ちであればお薬手帳をご提示ください。問診票にご記入いただきます。"},{"title":"診察・検査","text":"症状をうかがい、必要な検査を行います。結果は当日ご説明できるものが大半です。"},{"title":"お会計・お薬","text":"処方せんをお渡しします。次回の目安もその場でご案内するので、通院の予定が立てられます。"}]} -->
<div class="wp-block-wdl-lw-pr-step-7 lw-pr-step-7 font_size_m"><ul class="lw-pr-step-7__inner" style="max-width:1100px;--column-pc:4;--column-sp:1"><li class="lw-pr-step-7__li" style="background-color:#ffffff;border-color:#dbe6ea"><div class="lw-pr-step-7__li_no" data-lw_font_set="Murecho" style="font-weight:700;background-color:#0f5b78;color:#ffffff">1</div><div class="lw-pr-step-7__li_in"><h3 class="lw-pr-step-7__li_title ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">ご予約</h3><p class="lw-pr-step-7__li_text" data-lw_font_set="" style="font-weight:400;color:#26383f">WEB予約またはお電話で。予約なしでも受診いただけますが、お待たせすることがあります。</p></div></li><li class="lw-pr-step-7__li" style="background-color:#ffffff;border-color:#dbe6ea"><div class="lw-pr-step-7__li_no" data-lw_font_set="Murecho" style="font-weight:700;background-color:#0f5b78;color:#ffffff">2</div><div class="lw-pr-step-7__li_in"><h3 class="lw-pr-step-7__li_title ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">受付・問診</h3><p class="lw-pr-step-7__li_text" data-lw_font_set="" style="font-weight:400;color:#26383f">保険証と、お持ちであればお薬手帳をご提示ください。問診票にご記入いただきます。</p></div></li><li class="lw-pr-step-7__li" style="background-color:#ffffff;border-color:#dbe6ea"><div class="lw-pr-step-7__li_no" data-lw_font_set="Murecho" style="font-weight:700;background-color:#0f5b78;color:#ffffff">3</div><div class="lw-pr-step-7__li_in"><h3 class="lw-pr-step-7__li_title ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">診察・検査</h3><p class="lw-pr-step-7__li_text" data-lw_font_set="" style="font-weight:400;color:#26383f">症状をうかがい、必要な検査を行います。結果は当日ご説明できるものが大半です。</p></div></li><li class="lw-pr-step-7__li" style="background-color:#ffffff;border-color:#dbe6ea"><div class="lw-pr-step-7__li_no" data-lw_font_set="Murecho" style="font-weight:700;background-color:#0f5b78;color:#ffffff">4</div><div class="lw-pr-step-7__li_in"><h3 class="lw-pr-step-7__li_title ttl" data-lw_font_set="" style="font-weight:700;color:#0f5b78">お会計・お薬</h3><p class="lw-pr-step-7__li_text" data-lw_font_set="" style="font-weight:400;color:#26383f">処方せんをお渡しします。次回の目安もその場でご案内するので、通院の予定が立てられます。</p></div></li></ul></div>
<!-- /wp:wdl/lw-pr-step-7 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":104,"tbHeight":76,"spHeight":52} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:104px"></div><div class="tb" style="height:76px"></div><div class="sp" style="height:52px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"診療時間・アクセス","subTitle":"HOURS","afterColor":"#3f9dbd","afterMarginTopPc":1.2,"afterMarginTopSp":1,"afterHeightPc":3,"afterHeightSp":3,"afterWidthPc":44,"afterWidthSp":40,"fontSizePc":14,"fontSizeSp":13,"mainFontWeight":"700","subFontWeight":"500"} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:#3f9dbd;--title-15-after-mt-pc:1.2em;--title-15-after-mt-sp:1em;--title-15-after-h-pc:3px;--title-15-after-h-sp:3px;--title-15-after-w-pc:44px;--title-15-after-w-sp:40px;--title-15-font-size_pc:14px;--title-15-font-size_sp:13px" id="hours"><span class="main" style="font-weight:700">診療時間・アクセス</span><span class="sub" style="font-weight:500">HOURS</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":28,"tbHeight":22,"spHeight":18} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:28px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:18px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-table-3 {"columnCount":8,"colWidthPc":[150,80,80,80,80,80,80,80],"colWidthSp":[96,52,52,52,52,52,52,52],"gapSize":1,"headers":["診療時間","月","火","水","木","金","土","日祝"],"headerBgColors":["","","","","","","",""],"headerOutlineColors":["","","","","","","",""],"headerOutlineWidths":[0,0,0,0,0,0,0,0],"rows":[{"header":"9:00〜12:30","cells":["●","●","●","●","●","●","―"]},{"header":"15:00〜18:30","cells":["●","●","―","●","●","―","―"]}],"fontSizeMainHead":15,"mainHeadBgColor":"#0f5b78","fontSizeRowHead":15,"rowHeadBgColor":"#eff7fa","rowHeadTextColor":"#0f5b78","fontSizeCell":15,"cellTextColor":"#26383f","cellPaddingY":18,"tableAlign":"center"} -->
<div class="wp-block-wdl-lw-pr-table-3 lw-pr-table-3"><div class="lw-pr-table-3__wrap clm_8 is_center" style="--table-3-gap:1px;--table-3-clm-1-pc:150px;--table-3-clm-1-sp:96px;--table-3-clm-2-pc:80px;--table-3-clm-2-sp:52px;--table-3-clm-3-pc:80px;--table-3-clm-3-sp:52px;--table-3-clm-4-pc:80px;--table-3-clm-4-sp:52px;--table-3-clm-5-pc:80px;--table-3-clm-5-sp:52px;--table-3-clm-6-pc:80px;--table-3-clm-6-sp:52px;--table-3-clm-7-pc:80px;--table-3-clm-7-sp:52px;--table-3-clm-8-pc:80px;--table-3-clm-8-sp:52px;--table-3-total-sp:540px;--table-3-fs-main-head:15px;--table-3-fs-main-head-sp:14px;--table-3-lh-main-head:1.6;--table-3-fs-row-head:15px;--table-3-fs-row-head-sp:14px;--table-3-lh-row-head:1.6;--table-3-fs-cell:15px;--table-3-fs-cell-sp:14px;--table-3-lh-cell:1.6"><div class="lw-pr-table-3__cell main_head main_head_first" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">診療時間</div></div><div class="lw-pr-table-3__cell main_head" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">月</div></div><div class="lw-pr-table-3__cell main_head" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">火</div></div><div class="lw-pr-table-3__cell main_head" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">水</div></div><div class="lw-pr-table-3__cell main_head" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">木</div></div><div class="lw-pr-table-3__cell main_head" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">金</div></div><div class="lw-pr-table-3__cell main_head" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">土</div></div><div class="lw-pr-table-3__cell main_head main_head_last" data-lw_font_set="" style="display:flex;align-items:center;background:#0f5b78;color:#ffffff;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">日祝</div></div><div class="lw-pr-table-3__cell row_head row_head_first" data-lw_font_set="" style="display:flex;align-items:center;background:#eff7fa;color:#0f5b78;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">9:00〜12:30</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell cell_first_row_last_col" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">―</div></div><div class="lw-pr-table-3__cell row_head row_head_last" data-lw_font_set="" style="display:flex;align-items:center;background:#eff7fa;color:#0f5b78;font-weight:600;line-height:1.6;text-align:center;padding-top:16px;padding-bottom:16px"><div class="lw-pr-table-3__cell-inner">15:00〜18:30</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">―</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">●</div></div><div class="lw-pr-table-3__cell" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">―</div></div><div class="lw-pr-table-3__cell cell_last_row_last_col" data-lw_font_set="" style="display:flex;align-items:center;background:#ffffff;color:#26383f;font-weight:400;line-height:1.6;text-align:center;padding-top:18px;padding-bottom:18px"><div class="lw-pr-table-3__cell-inner">―</div></div></div></div>
<!-- /wp:wdl/lw-pr-table-3 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":104,"tbHeight":76,"spHeight":52} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:104px"></div><div class="tb" style="height:76px"></div><div class="sp" style="height:52px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"患者さんの声","subTitle":"VOICE","afterColor":"#3f9dbd","afterMarginTopPc":1.2,"afterMarginTopSp":1,"afterHeightPc":3,"afterHeightSp":3,"afterWidthPc":44,"afterWidthSp":40,"fontSizePc":14,"fontSizeSp":13,"mainFontWeight":"700","subFontWeight":"500"} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:#3f9dbd;--title-15-after-mt-pc:1.2em;--title-15-after-mt-sp:1em;--title-15-after-h-pc:3px;--title-15-after-h-sp:3px;--title-15-after-w-pc:44px;--title-15-after-w-sp:40px;--title-15-font-size_pc:14px;--title-15-font-size_sp:13px" id="voice"><span class="main" style="font-weight:700">患者さんの声</span><span class="sub" style="font-weight:500">VOICE</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":28,"tbHeight":22,"spHeight":18} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:28px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:18px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/paid-block-voice-3 {"voices":[{"name":"佐藤 様","age":"40代","job":"会社員","photo":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/voice_1.webp","alt":"佐藤様","excerpt":"血圧の数値の意味を、はじめてちゃんと理解できました。","text":"健診でひっかかってから何年も放っておいたのですが、思い切って受診しました。\n\n数値がどのくらいなら大丈夫で、どこからが危ないのかを、紙に書きながら説明していただきました。「まず3か月、食事だけで様子を見ましょう」と段階を示してもらえたので、いきなり薬という不安がありませんでした。\n\n結果として今は数値も落ち着いています。分かって続けるのと、言われて続けるのは違うのだと思いました。"},{"name":"田口 様","age":"30代","job":"2児の母","photo":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/voice_2.webp","alt":"田口様","excerpt":"子どもが泣いても大丈夫、と言ってもらえて肩の力が抜けました。","text":"下の子の熱が続いていて、上の子も連れて行かざるを得ませんでした。\n\n待合で泣き出してしまったのですが、すぐ個室に通していただけて、そこで診察も受けられました。受付の方が上の子に絵本を出してくださったのも助かりました。\n\n予防接種のスケジュールも、母子手帳を見ながら次はいつ、と紙に書いてもらえるので迷いません。"},{"name":"西村 様","age":"60代","job":"自営業","photo":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/voice_3.webp","alt":"西村様","excerpt":"検査が必要なとき、その場で紹介先まで決めてくれました。","text":"せきが長引いていて、念のためと撮ったレントゲンで気になる影が見つかりました。\n\nその場で「ここは詳しく調べたほうがいい」と説明があり、近くの病院への紹介状をその日のうちに用意していただきました。予約の日時まで決まった状態で帰れたので、余計な不安を持ち越さずに済みました。\n\n結果は大きな問題ではありませんでしたが、あのときすぐ動いてもらえたのはありがたかったです。"}],"autoplayDelay":5000,"spaceBetween900":28,"maxWidthContainer":1100,"cardShadowColor":"rgba(15, 91, 120, 0.10)","nameColor":"#0f5b78","excerptColor":"#26383f","metaColor":"#7d919a","btnBgColor":"#0f5b78","btnTextColor":"#ffffff","nameFontWeight":"700","blockId":"paid-block-voice-3-c1f7a204"} -->
<div id="paid-block-voice-3-c1f7a204" class="wp-block-wdl-paid-block-voice-3 paid-block-voice-3 init-hide" data-voices="[{&quot;name&quot;:&quot;佐藤 様&quot;,&quot;age&quot;:&quot;40代&quot;,&quot;job&quot;:&quot;会社員&quot;,&quot;photo&quot;:&quot;https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/voice_1.webp&quot;,&quot;alt&quot;:&quot;佐藤様&quot;,&quot;excerpt&quot;:&quot;血圧の数値の意味を、はじめてちゃんと理解できました。&quot;,&quot;text&quot;:&quot;健診でひっかかってから何年も放っておいたのですが、思い切って受診しました。\n\n数値がどのくらいなら大丈夫で、どこからが危ないのかを、紙に書きながら説明していただきました。「まず3か月、食事だけで様子を見ましょう」と段階を示してもらえたので、いきなり薬という不安がありませんでした。\n\n結果として今は数値も落ち着いています。分かって続けるのと、言われて続けるのは違うのだと思いました。&quot;},{&quot;name&quot;:&quot;田口 様&quot;,&quot;age&quot;:&quot;30代&quot;,&quot;job&quot;:&quot;2児の母&quot;,&quot;photo&quot;:&quot;https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/voice_2.webp&quot;,&quot;alt&quot;:&quot;田口様&quot;,&quot;excerpt&quot;:&quot;子どもが泣いても大丈夫、と言ってもらえて肩の力が抜けました。&quot;,&quot;text&quot;:&quot;下の子の熱が続いていて、上の子も連れて行かざるを得ませんでした。\n\n待合で泣き出してしまったのですが、すぐ個室に通していただけて、そこで診察も受けられました。受付の方が上の子に絵本を出してくださったのも助かりました。\n\n予防接種のスケジュールも、母子手帳を見ながら次はいつ、と紙に書いてもらえるので迷いません。&quot;},{&quot;name&quot;:&quot;西村 様&quot;,&quot;age&quot;:&quot;60代&quot;,&quot;job&quot;:&quot;自営業&quot;,&quot;photo&quot;:&quot;https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/voice_3.webp&quot;,&quot;alt&quot;:&quot;西村様&quot;,&quot;excerpt&quot;:&quot;検査が必要なとき、その場で紹介先まで決めてくれました。&quot;,&quot;text&quot;:&quot;せきが長引いていて、念のためと撮ったレントゲンで気になる影が見つかりました。\n\nその場で「ここは詳しく調べたほうがいい」と説明があり、近くの病院への紹介状をその日のうちに用意していただきました。予約の日時まで決まった状態で帰れたので、余計な不安を持ち越さずに済みました。\n\n結果は大きな問題ではありませんでしたが、あのときすぐ動いてもらえたのはありがたかったです。&quot;}]" data-font-settings="{&quot;nameFontSet&quot;:&quot;&quot;,&quot;nameFontWeight&quot;:&quot;700&quot;,&quot;excerptFontSet&quot;:&quot;&quot;,&quot;excerptFontWeight&quot;:&quot;400&quot;}"><div class="inner" style="--paid-block-voice-3-max-width:1100px;--lw-voice-card-bg:#ffffff;--lw-voice-name-color:#0f5b78;--lw-voice-excerpt-color:#26383f;--lw-voice-meta-color:#7d919a;--color-btn-bg:#0f5b78;--color-btn-text:#ffffff"><div class="swiper voice-swiper"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="voice-modal paid-block-voice-3-modal"><div class="modal-overlay"></div><div class="modal-content"><button class="modal-close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button><div class="modal-body"><div class="modal-photo"><img src="" alt=""/></div><h3 class="modal-name" data-lw_font_set="" style="font-weight:700"></h3><p class="modal-meta"></p><div class="modal-text" data-lw_font_set="" style="font-weight:400"></div></div></div></div><script type="text/javascript">
(function(){
    const selector = "#paid-block-voice-3-c1f7a204";
    const section = document.querySelector(selector);
    if (!section) return;

    // データを取得
    const voiceData = JSON.parse(section.getAttribute('data-voices'));
    const fontSettings = JSON.parse(section.getAttribute('data-font-settings'));

    // ========== HTML生成 ==========
    function generateHTML() {
        const swiperWrapper = section.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;

        const slidesHTML = voiceData.map((voice, index) => `
            <div class="swiper-slide">
                <div class="voice-card" data-voice-id="${index}">
                    <div class="photo">
                        <img loading="lazy" src="${voice.photo}" alt="${voice.alt || voice.name}">
                    </div>
                    <h3 
                        class="name" 
                        data-lw_font_set="${fontSettings.nameFontSet}"
                        style="font-weight: ${fontSettings.nameFontWeight}"
                    >${voice.name}</h3>
                    ${voice.age || voice.job ? '<p class="meta">' + (voice.age || '') + ' / ' + (voice.job || '') + '</p>' : ''}
                    <p 
                        class="excerpt"
                        data-lw_font_set="${fontSettings.excerptFontSet}"
                        style="font-weight: ${fontSettings.excerptFontWeight}"
                    >${voice.excerpt}</p>
                    <div class="more-btn">続きを読む</div>
                </div>
            </div>
        `).join('');

        swiperWrapper.innerHTML = slidesHTML;
    }

    // ========== Swiper初期化 ==========
    const MAX_RETRY = 30;
    let retry = 0;

    const initSwiper = () => {
        if (typeof Swiper === "undefined") return false;
        const swiperEl = section.querySelector('.voice-swiper');
        if (!swiperEl) return false;
        const already = swiperEl.swiper;
        if (already) return true;

        new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            speed: 600,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            observer: true,
            observeParents: true,
            
            pagination: {
                el: selector + " .swiper-pagination",
                clickable: true
            },
            
            navigation: {
                nextEl: selector + " .swiper-button-next",
                prevEl: selector + " .swiper-button-prev"
            },
            breakpoints: {
                600: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                900: {
                    slidesPerView: 3,
                    spaceBetween: 28,
                },
            },
        });

        section.classList.remove("init-hide");
        return true;
    };

    // ========== モーダル処理 ==========
    function initModal() {
        // ★ 既にbody直下に移動済みかチェック（複数ブロック対応）
        let modal = document.querySelector('.paid-block-voice-3-modal[data-for-block="paid-block-voice-3-c1f7a204"]');

        if (!modal) {
            // まだ移動していない場合、セクション内から取得
            modal = section.querySelector('.paid-block-voice-3-modal');
            if (!modal) return;

            // ★ モーダルをbody直下に移動（他ブロックのz-index影響を回避）
            document.body.appendChild(modal);
            modal.setAttribute('data-for-block', 'paid-block-voice-3-c1f7a204');
        }

        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        // カードクリックでモーダル表示
        section.addEventListener('click', function(e) {
            const card = e.target.closest('.voice-card');
            if (!card) return;

            const voiceId = parseInt(card.getAttribute('data-voice-id'));
            const data = voiceData[voiceId];
            
            if (data) {
                modal.querySelector('.modal-photo img').src = data.photo;
                modal.querySelector('.modal-photo img').alt = data.alt || data.name;
                modal.querySelector('.modal-name').textContent = data.name;
                const modalMeta = modal.querySelector('.modal-meta');
                if (data.age || data.job) {
                    modalMeta.textContent = `${data.age || ''} / ${data.job || ''}`;
                    modalMeta.style.display = '';
                } else {
                    modalMeta.style.display = 'none';
                }
                modal.querySelector('.modal-text').textContent = data.text;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        // モーダルを閉じる
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESCキーで閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ========== 初期化実行 ==========
    // 1. HTML生成
    generateHTML();

    // 2. Swiper初期化（複数トリガー）
    document.addEventListener("DOMContentLoaded", initSwiper, { once: true });
    window.addEventListener("lw:swiperReady", initSwiper, { once: true });

    const timer = setInterval(() => {
        if (initSwiper() || ++retry >= MAX_RETRY) clearInterval(timer);
    }, 150);

    setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.classList.remove("init-hide");
    }, 5000);

    // 3. モーダル初期化
    initModal();
})();
        </script><noscript><style>#paid-block-voice-3-c1f7a204{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-voice-3 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":104,"tbHeight":76,"spHeight":52} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:104px"></div><div class="tb" style="height:76px"></div><div class="sp" style="height:52px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-custom-title-15 {"mainTitle":"お知らせ","subTitle":"NEWS","afterColor":"#3f9dbd","afterMarginTopPc":1.2,"afterMarginTopSp":1,"afterHeightPc":3,"afterHeightSp":3,"afterWidthPc":44,"afterWidthSp":40,"fontSizePc":14,"fontSizeSp":13,"mainFontWeight":"700","subFontWeight":"500"} -->
<h2 class="wp-block-wdl-lw-pr-custom-title-15 lw-pr-custom-title-15" style="--custom-title-sub-margin-top-pc:0.2em;--custom-title-sub-margin-top-sp:0.2em;--title-15-after-color:#3f9dbd;--title-15-after-mt-pc:1.2em;--title-15-after-mt-sp:1em;--title-15-after-h-pc:3px;--title-15-after-h-sp:3px;--title-15-after-w-pc:44px;--title-15-after-w-sp:40px;--title-15-font-size_pc:14px;--title-15-font-size_sp:13px" id="news"><span class="main" style="font-weight:700">お知らせ</span><span class="sub" style="font-weight:500">NEWS</span></h2>
<!-- /wp:wdl/lw-pr-custom-title-15 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":28,"tbHeight":22,"spHeight":18} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:28px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:18px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-post-list-4 {"numberOfPosts":3,"catBgColor":"#3f9dbd","titleFontWeight":"500"} -->
<div class="wp-block-wdl-lw-pr-post-list-4"><div class="filter"></div><div class="lw_pr-post-list-4" style="--lw-cols:3" data-number="3" data-category="" data-type="post" data-date-format="md_day" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="#3f9dbd" data-title-font="Noto Sans JP" data-title-font-weight="500"><ul class="pr-post-list-4__wrap"></ul></div><script>
document.addEventListener('DOMContentLoaded', function () {
    var settings = window.MyThemeSettings || {};
    var homeUrl = settings.home_Url || '';
    var themeUrl = settings.theme_Url || '';
    var weekLabels = ['日', '月', '火', '水', '木', '金', '土'];

    document.querySelectorAll('.lw_pr-post-list-4').forEach(function (container) {
        if (container.getAttribute('data-lw-loaded') === '1') {
            return;
        }
        container.setAttribute('data-lw-loaded', '1');

        var numberOfPosts = container.getAttribute('data-number') || 6;
        var categoryId = container.getAttribute('data-category');
        var postType = container.getAttribute('data-type') || 'post';
        var dateFormat = container.getAttribute('data-date-format') || 'md_day';
        var dateFont = container.getAttribute('data-date-font') || '';
        var dateFontWeight = container.getAttribute('data-date-font-weight') || '';
        var catFont = container.getAttribute('data-cat-font') || '';
        var catFontWeight = container.getAttribute('data-cat-font-weight') || '';
        var catBgColor = container.getAttribute('data-cat-bg-color') || '';
        var titleFont = container.getAttribute('data-title-font') || '';
        var titleFontWeight = container.getAttribute('data-title-font-weight') || '';

        var formatDate = function (value) {
            var d = new Date(value);
            if (isNaN(d.getTime())) {
                return '';
            }
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            var day = d.getDate();
            if (dateFormat === 'ymd') {
                return y + '/' + m + '/' + day;
            }
            if (dateFormat === 'ymd_dot') {
                return y + '.' + ('0' + m).slice(-2) + '.' + ('0' + day).slice(-2);
            }
            return m + '/' + day + ' (' + weekLabels[d.getDay()] + ')';
        };

        var toAttr = function (value) {
            return String(value).replace(/<[^>]+>/g, '').replace(/"/g, '&quot;');
        };

        // カテゴリー編集画面で設定した色（REST の lw_color）。
        // 色は style 属性に直接入れるので、#rrggbb 以外は捨てる
        var hexColor = function (value) {
            return typeof value === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : '';
        };

        var apiUrl = homeUrl + '/wp-json/wp/v2/' + (postType === 'post' ? 'posts' : postType)
            + '?per_page=' + numberOfPosts + '&orderby=date&order=desc&_embed';
        if (categoryId) {
            apiUrl += '&categories=' + categoryId;
        }

        fetch(apiUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('投稿の取得に失敗しました');
                }
                return response.json();
            })
            .then(function (posts) {
                var html = '<ul class="pr-post-list-4__wrap">';

                posts.forEach(function (post) {
                    var embedded = post._embedded || {};
                    var terms = embedded['wp:term'] && embedded['wp:term'][0];
                    var term = terms && terms.length ? terms[0] : null;
                    var category = term && term.name ? term.name : '';
                    // カテゴリーに色が設定されていればそれを、なければブロックの設定色を使う
                    var catColor = (term && hexColor(term.lw_color)) || catBgColor;
                    var media = embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0];
                    var thumbnail = media && media.source_url
                        ? media.source_url
                        : themeUrl + '/assets/image/no_image/2.webp';
                    var title = post.title && post.title.rendered ? post.title.rendered : '';

                    var catHtml = category
                        ? '<div class="cat" style="background-color:' + catColor + ';font-weight:' + catFontWeight + ';" data-lw_font_set="' + catFont + '"><span>' + category + '</span></div>'
                        : '';

                    html += '<li>'
                        + '<a href="' + post.link + '">'
                        + '<figure><img loading="lazy" src="' + thumbnail + '" alt="' + toAttr(title) + '"></figure>'
                        + '<div class="in">'
                        + '<div class="data">'
                        + '<div class="date" style="font-weight:' + dateFontWeight + ';" data-lw_font_set="' + dateFont + '"><span>' + formatDate(post.date) + '</span></div>'
                        + catHtml
                        + '</div>'
                        + '<h3 style="font-weight:' + titleFontWeight + ';" data-lw_font_set="' + titleFont + '">' + title + '</h3>'
                        + '</div>'
                        + '</a>'
                        + '</li>';
                });

                html += '</ul>';
                container.innerHTML = html;
            })
            .catch(function (error) {
                console.error('投稿を取得できませんでした:', error);
                container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
            });
    });
});
</script></div>
<!-- /wp:wdl/lw-pr-post-list-4 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":104,"tbHeight":76,"spHeight":52} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:104px"></div><div class="tb" style="height:76px"></div><div class="sp" style="height:52px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":120,"tbHeight":88,"spHeight":60} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:120px"></div><div class="tb" style="height:88px"></div><div class="sp" style="height:60px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/cta-2 {"title":"ご予約・お問い合わせ","addressText":"〒330-0000 埼玉県さいたま市中央区0-0-0","phoneText":"（受付時間 9:00〜12:30 / 15:00〜18:30 ／ 休診 水曜午後・土曜午後・日曜・祝日）","phoneNumber":"048-000-0000","mailText":"WEBから予約する","mailUrl":"#","backgroundImage":"https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/cta_bg.webp","filterColor":"rgba(15, 54, 72, 0.55)","buttonBackgroundColor":"#ffffff","buttonTextColor":"#0f5b78"} -->
<div class="wp-block-wdl-cta-2 wp-block-wdl-cta-2 "><div class="cta-2" style="background-image:url(https://liteword-assets.bigi-ishikawa.workers.dev/t/clinic/cta_bg.webp)"><div class="cta-2__wrap"><h2 class="title">ご予約・お問い合わせ</h2><p class="address">〒330-0000 埼玉県さいたま市中央区0-0-0</p><nav><a href="tel:048-000-0000" class="tel" data-lw_font_set="Roboto"><div class="no"><div class="small">TEL:</div><div class="big">048-000-0000</div></div><p class="tel_text">（受付時間 9:00〜12:30 / 15:00〜18:30 ／ 休診 水曜午後・土曜午後・日曜・祝日）</p></a><a href="#" class="mail" style="background-color:#ffffff;color:#0f5b78"><div class="icon" style="fill:#0f5b78"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg></div><div class="mail_text">WEBから予約する</div></a></nav></div><div class="bg_filter" style="background-color:rgba(15, 54, 72, 0.55)"></div></div></div>
<!-- /wp:wdl/cta-2 -->
