<!-- wp:wdl/paid-block-fv-11 {"slides":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_01.webp","spImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_01.webp","altText":"ピアノと譜面台のあるレッスン室","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_02.webp","spImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_02.webp","altText":"午後の光があたるピアノの鍵盤と楽譜","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_03.webp","spImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_03.webp","altText":"教室の待合スペースのソファと本棚","linkUrl":""}],"subTitle":"KANADE MUSIC SCHOOL","mainTitle":"いくつからでも、\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003eはじめられます。","descriptionText":"4歳のお子さんから大人の方まで。\u003cspan class=\"lw-br on_500px\"\u003e\u003c/span\u003eひとりずつのペースで続けられる、小さな音楽教室です。","buttonLabel":"体験レッスンについて","ctaLinkUrl":"#trial","showCtaButton":true,"filterColor":"color-mix(in srgb, var(--color-main) 40%, #000)","filterOpacity":0.5,"minHeightPc":"min-h-pc-560px","minHeightTb":"min-h-tb-420px","minHeightSp":"min-h-sp-380px","autoplayDelay":5000} -->
<div class="wp-block-wdl-paid-block-fv-11 swiper paid-block-fv-11 max-w init-hide min-h-pc-560px min-h-tb-420px min-h-sp-380px" style="max-width:100vw"><div class="text_in center"><div class="in"><h1 class="ttl"><span class="sub">KANADE MUSIC SCHOOL</span>  <span class="main">いくつからでも、<span class="lw-br on_500px"></span>はじめられます。</span></h1><p class="description">4歳のお子さんから大人の方まで。<span class="lw-br on_500px"></span>ひとりずつのペースで続けられる、小さな音楽教室です。</p><span class="cta_btn"><a href="#trial" class="btn_link"><span>体験レッスンについて</span></a></span></div></div><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_01.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_01.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_01.webp" alt="ピアノと譜面台のあるレッスン室"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_02.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_02.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_02.webp" alt="午後の光があたるピアノの鍵盤と楽譜"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_03.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_03.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_fv_03.webp" alt="教室の待合スペースのソファと本棚"/></picture></div><div class="image_filter" style="background-color:color-mix(in srgb, var(--color-main) 40%, #000);opacity:0.5"></div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><script type="text/javascript">
(function(){
var _sc = document.currentScript;
var _root = ( _sc && _sc.closest ) ? _sc.closest(".paid-block-fv-11") : null;
if ( !_root ) _root = document.querySelector(".paid-block-fv-11:not([data-lw-init])");
if ( !_root ) return;
_root.setAttribute("data-lw-init","1");
if ( !_root.id ) _root.id = "paid-block-fv-11-" + Math.random().toString(36).slice(2,10);
const selector = "#" + _root.id;
const MAX_RETRY = 30; // 30 × 150ms = 4.5s
let retry = 0;

const initSwiper = () => {
    if ( typeof Swiper === "undefined" ) return false;
    const already = document.querySelector(selector).swiper;
    if ( already ) return true; // 二重初期化しない

    const config = {
        loop: true,
        effect: "fade",
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        observer: true,
        observeParents: true,
        fadeEffect: { crossFade: true },
        
            pagination: {
                el: selector + " .swiper-pagination",
                clickable: true
            },
        
            navigation: {
                nextEl: selector + " .swiper-button-next",
                prevEl: selector + " .swiper-button-prev"
            },
    };
    new Swiper( selector, config );
    document.querySelector(selector).classList.remove("init-hide");
    return true;
};

/* ① DOMContentLoaded 直後 */
document.addEventListener("DOMContentLoaded", initSwiper, { once:true });

/* ② lw:swiperReady (既存仕組み維持) */
window.addEventListener("lw:swiperReady", initSwiper, { once:true });

/* ③ ポーリング（Swiper読み込み遅延対策） */
const timer = setInterval(() => {
    if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);
}, 150);

/* ④ それでも失敗したら 5s で init-hide を解除し static 画像表示 */
setTimeout(() => {
    const el = document.querySelector(selector);
    if ( el ) el.classList.remove("init-hide");
}, 5000);
})();
    </script><style>
                    .paid-block-fv-11 .swiper-pagination-bullet { background-color:#ffffff; }
                    .paid-block-fv-11 .swiper-button-next,
                    .paid-block-fv-11 .swiper-button-prev { color:#ffffff; }
                </style><noscript><style>.paid-block-fv-11{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-11 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-text-1 {"text":"Enjoy Music","tagName":"p","textAlignPc":"center","textAlignSp":"center","fontSizePc":2.8,"fontSizeTab":2.2,"fontSizeSp":1.7,"fontWeight":"700","gradientColor1":"color-mix(in srgb, var(--color-main) 45%, #000)","gradientColor2":"var(--color-main)","gradientColor3":"color-mix(in srgb, var(--color-main) 45%, #000)","gradientAngle":"270","animationTime":5} -->
<p class="wp-block-wdl-lw-pr-text-1 lw-pr-text-1 gradient-slide-anime" style="font-weight:700;--lw-text-align-pc:center;--lw-text-align-sp:center;--lw-pr-text-1-font-size-pc:2.8em;--lw-pr-text-1-font-size-tab:2.2em;--lw-pr-text-1-font-size-sp:1.7em;--lw-pr-text-1-line-height-pc:1.5;--lw-pr-text-1-gradient:linear-gradient(270deg, color-mix(in srgb, var(--color-main) 45%, #000), var(--color-main), color-mix(in srgb, var(--color-main) 45%, #000));--lw-pr-text-1-gradient-anime-ptn:lw-pr-text-1-gradient-slide-anime-1;--lw-pr-text-1-gradient-anime-time:5s;--lw-pr-text-1-gradient-anime-movement:linear" data-lw_font_set=""><span>Enjoy Music</span></p>
<!-- /wp:wdl/lw-pr-text-1 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">〇〇駅から歩いて5分、<span class="lw-br on_500px"></span>マンションの2階にある小さな教室です。<br>生徒さんは4歳から78歳まで。<span class="lw-br on_500px"></span>半分以上が、大人になってから始めた方です。<br>発表会に出るかどうかも、<span class="lw-br on_500px"></span>曲を選ぶのも、ご自身で決めていただけます。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-list-2 {"titleText":"こんな方が通っています","backgroundImage":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_gal_02.webp","bgGradient":"color-mix(in srgb, var(--color-main) 45%, #000)","filterOpacity":0.82,"colorLiSvg":"color-mix(in srgb, var(--color-main) 50%, #000)"} -->
<div class="wp-block-wdl-lw-list-2 lw-list-2" style="background-image:url(https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_gal_02.webp)"><h2 class="lw-list-2__title">こんな方が通っています</h2><ul class="lw-list-2__inner"><li class="lw-list-2__li"><span class="icon" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-2__text"><p data-lw_font_set="">楽譜が読めないけれど
ピアノを弾いてみたい</p></span></li><li class="lw-list-2__li"><span class="icon" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-2__text"><p data-lw_font_set="">子どものころに習っていて
もう一度やり直したい</p></span></li><li class="lw-list-2__li"><span class="icon" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-2__text"><p data-lw_font_set="">発表会に出るような
本格的なものでなくていい</p></span></li><li class="lw-list-2__li"><span class="icon" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-2__text"><p data-lw_font_set="">子どもに音楽を
好きになってほしい</p></span></li><li class="lw-list-2__li"><span class="icon" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-2__text"><p data-lw_font_set="">仕事帰りの時間に
通える教室をさがしている</p></span></li><li class="lw-list-2__li"><span class="icon" style="fill:color-mix(in srgb, var(--color-main) 50%, #000)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-2__text"><p data-lw_font_set="">家に楽器が無くても
始められるか知りたい</p></span></li></ul><div class="lw-list-2__filter" style="background:color-mix(in srgb, var(--color-main) 45%, #000);opacity:0.82"></div></div>
<!-- /wp:wdl/lw-list-2 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/custom-title-3 {"mainTitle":"コース","subTitle":"4歳のお子さんから大人の方まで。\u003cbr\u003eどのコースも、まずは体験レッスンからで結構です。","textAlignment":"center","accentColor":"var(--color-main)","headingLevel":2,"mainFontSizeSp":30} -->
<h2 class="wp-block-wdl-custom-title-3 custom-title-3 center" style="--ct3-main-sp:30px" id="course"><div class="main"><span>コース</span></div><div class="accent" style="background-color:var(--color-main)"></div><div class="sub"><span>4歳のお子さんから大人の方まで。<br>どのコースも、まずは体験レッスンからで結構です。</span></div></h2>
<!-- /wp:wdl/custom-title-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-list-6 {"columnsPC":4,"columnsSP":1,"imageAspectRatio":"9/6","colorTitle":"#333333","fontSizeTtlPc":18,"fontSizeTtlSp":17,"showLabel":true,"labelBgColor":"color-mix(in srgb, var(--color-main) 50%, #000)","labelTextColor":"#ffffff","labelFontSizePc":15,"labelFontSizeSp":14,"items":[{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_01.webp","label":"4歳〜小学生","title":"こどものピアノ","description":"30分・月3回。まずは音を出すことを楽しむところから。宿題は出しますが、できなくても叱りません。"},{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_04.webp","label":"2歳〜4歳","title":"リトミック","description":"30分・月2回。歌ったり打楽器を叩いたりしながら、拍やリズムを体で覚えます。親子でご参加いただけます。"},{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_02.webp","label":"大人の方","title":"大人のピアノ","description":"45分・月2回。曲はご自身で選べます。ゆっくり通いたい方は60分・月1回のコースも。"},{"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_03.webp","label":"オンライン","title":"オンラインレッスン","description":"30分・月2回。ご自宅の楽器で受けられます。遠方の方・お仕事が不規則な方に選ばれています。"}]} -->
<div class="wp-block-wdl-lw-pr-list-6 lw-pr-list-6" style="--columns-pc:4;--columns-sp:1;--list-6-row-gap-pc:32px;--list-6-row-gap-sp:32px;--list-6-column-gap-pc:8px;--list-6-column-gap-sp:8px;--list-6-fontsize-ttl-pc:18px;--list-6-fontsize-ttl-tb:18px;--list-6-fontsize-ttl-sp:17px;--list-6-align-ttl-pc:center;--list-6-align-ttl-sp:center;--list-6-margin-top-ttl-pc:12px;--list-6-margin-top-ttl-sp:12px;--list-6-fontsize-p-pc:14px;--list-6-fontsize-p-tb:14px;--list-6-fontsize-p-sp:14px;--list-6-align-p-pc:left;--list-6-align-p-sp:left;--list-6-label-bg:color-mix(in srgb, var(--color-main) 50%, #000);--list-6-label-color:#ffffff;--list-6-label-fontsize-pc:15px;--list-6-label-fontsize-sp:14px"><ul class="custom_list_items"><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_01.webp" alt="" style="aspect-ratio:9/6"/><span class="label">4歳〜小学生</span></div><h3 class="custom_ttl" data-lw_font_set="" style="color:#333333">こどものピアノ</h3><p class="custom_p" data-lw_font_set="">30分・月3回。まずは音を出すことを楽しむところから。宿題は出しますが、できなくても叱りません。</p></li><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_04.webp" alt="" style="aspect-ratio:9/6"/><span class="label">2歳〜4歳</span></div><h3 class="custom_ttl" data-lw_font_set="" style="color:#333333">リトミック</h3><p class="custom_p" data-lw_font_set="">30分・月2回。歌ったり打楽器を叩いたりしながら、拍やリズムを体で覚えます。親子でご参加いただけます。</p></li><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_02.webp" alt="" style="aspect-ratio:9/6"/><span class="label">大人の方</span></div><h3 class="custom_ttl" data-lw_font_set="" style="color:#333333">大人のピアノ</h3><p class="custom_p" data-lw_font_set="">45分・月2回。曲はご自身で選べます。ゆっくり通いたい方は60分・月1回のコースも。</p></li><li class="custom_item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_03.webp" alt="" style="aspect-ratio:9/6"/><span class="label">オンライン</span></div><h3 class="custom_ttl" data-lw_font_set="" style="color:#333333">オンラインレッスン</h3><p class="custom_p" data-lw_font_set="">30分・月2回。ご自宅の楽器で受けられます。遠方の方・お仕事が不規則な方に選ばれています。</p></li></ul></div>
<!-- /wp:wdl/lw-pr-list-6 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">※ 曜日と時間は下の「時間割」をご覧ください。<span class="lw-br on_500px"></span>空いている枠はその月によって変わります。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/paid-block-content-4 {"mainTitle":"教室の中","subTitle":"OUR ROOM","bottomText":"アップライトピアノ2台とグランドピアノ1台、待合スペースがあります。\u003cbr\u003eお子さんのレッスン中、保護者の方は待合でお待ちいただけます。\u003cbr\u003e入り口に段差がなく、ベビーカーのまま入れます。","ctaText":"教室のご案内を見る","ctaUrl":"","mainTitleColor":"#333333","highlightColor":"color-mix(in srgb, var(--color-main) 50%, #000)","ctaBorderColor":"color-mix(in srgb, var(--color-main) 50%, #000)","ctaTextColor":"color-mix(in srgb, var(--color-main) 50%, #000)","images":[{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_gal_01.webp","alt":"メトロノームと楽譜の並んだ棚"},{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_room_01.webp","alt":"グランドピアノのあるレッスン室"},{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_room_02.webp","alt":"教室の受付とスリッパ立て"},{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_gal_02.webp","alt":"子ども用の椅子と足台を置いたピアノ"},{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_intro_01.webp","alt":"ノートと鉛筆とメトロノーム"},{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_04.webp","alt":"タンバリンや木琴などの小さな打楽器"},{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_step_02.webp","alt":"楽譜を指しながら教える手元"},{"url":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_room_03.webp","alt":"教室の入っている建物の入り口"}]} -->
<div class="wp-block-wdl-paid-block-content-4 paid-block-content-4"><section class="conts"><div class="cont"><h2 class="ttl"><div style="color:#333333">教室の中</div><span class="sub" style="color:color-mix(in srgb, var(--color-main) 50%, #000)">OUR ROOM</span></h2><p class="ttl_btm_p"><span>アップライトピアノ2台とグランドピアノ1台、待合スペースがあります。<br>お子さんのレッスン中、保護者の方は待合でお待ちいただけます。<br>入り口に段差がなく、ベビーカーのまま入れます。</span></p><a class="cont_btn" href="" style="border-color:color-mix(in srgb, var(--color-main) 50%, #000);border-width:2px;border-radius:0px;color:color-mix(in srgb, var(--color-main) 50%, #000)"><span>教室のご案内を見る</span><div class="btn_bg" style="background:color-mix(in srgb, var(--color-main) 50%, #000);border-radius:0px"></div></a></div><div class="gallery_in"><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_gal_01.webp" alt="メトロノームと楽譜の並んだ棚" style="border-radius:0px"/></div><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_room_01.webp" alt="グランドピアノのあるレッスン室" style="border-radius:0px"/></div><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_room_02.webp" alt="教室の受付とスリッパ立て" style="border-radius:0px"/></div><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_gal_02.webp" alt="子ども用の椅子と足台を置いたピアノ" style="border-radius:0px"/></div><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_intro_01.webp" alt="ノートと鉛筆とメトロノーム" style="border-radius:0px"/></div><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_course_04.webp" alt="タンバリンや木琴などの小さな打楽器" style="border-radius:0px"/></div><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_step_02.webp" alt="楽譜を指しながら教える手元" style="border-radius:0px"/></div><div class="image" style="border-radius:0px;overflow:hidden"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_room_03.webp" alt="教室の入っている建物の入り口" style="border-radius:0px"/></div></div></section></div>
<!-- /wp:wdl/paid-block-content-4 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.07,"filterTypeTb":"solid","filterColorTb":"var(--color-main)","opacityTb":0.07,"filterTypeSp":"solid","filterColorSp":"var(--color-main)","opacitySp":0.07} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.07;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.07;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.07;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:wdl/custom-title-3 {"mainTitle":"時間割","subTitle":"レッスンをしている曜日と時間です。\u003cbr\u003e◎は空きあり、△は残りわずか、×は満席です。","textAlignment":"center","accentColor":"var(--color-main)","headingLevel":2,"mainFontSizeSp":30} -->
<h2 class="wp-block-wdl-custom-title-3 custom-title-3 center" style="--ct3-main-sp:30px" id="schedule"><div class="main"><span>時間割</span></div><div class="accent" style="background-color:var(--color-main)"></div><div class="sub"><span>レッスンをしている曜日と時間です。<br>◎は空きあり、△は残りわずか、×は満席です。</span></div></h2>
<!-- /wp:wdl/custom-title-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-calendar-1 {"colorTableHeadItemBg":"color-mix(in srgb, var(--color-main) 50%, #000)","colorTableHeadItemText":"#ffffff","colorTableItemBd":"var(--color-main)","headItems":["レッスン時間","月","火","水","木","金","土"],"bodyRows":[["10:00 - 13:00","◎","◎","休","◎","△","×"],["14:00 - 17:00","△","◎","休","△","×","×"],["17:00 - 20:00","×","△","休","×","△","×"],["20:00 - 21:00","◎","◎","休","◎","◎","休"]]} -->
<div class="wp-block-wdl-lw-pr-calendar-1 lw-pr-calendar-1" style="--color-table-item-bd:var(--color-main);--color-table-head-item-bg:color-mix(in srgb, var(--color-main) 50%, #000);--color-table-head-item-text:#ffffff;--color-table-body-item-text:#000000;--color-table-body-item-first-text:#000000"><div class="wrap_table"><div class="table_head"><div class="item first" data-lw_font_set=""><span>レッスン時間</span></div><div class="item " data-lw_font_set=""><span>月</span></div><div class="item " data-lw_font_set=""><span>火</span></div><div class="item " data-lw_font_set=""><span>水</span></div><div class="item " data-lw_font_set=""><span>木</span></div><div class="item " data-lw_font_set=""><span>金</span></div><div class="item " data-lw_font_set=""><span>土</span></div></div><div class="table_body"><div class="item first" data-lw_font_set=""><span>10:00 - 13:00</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>休</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>△</span></div><div class="item " data-lw_font_set=""><span>×</span></div></div><div class="table_body"><div class="item first" data-lw_font_set=""><span>14:00 - 17:00</span></div><div class="item " data-lw_font_set=""><span>△</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>休</span></div><div class="item " data-lw_font_set=""><span>△</span></div><div class="item " data-lw_font_set=""><span>×</span></div><div class="item " data-lw_font_set=""><span>×</span></div></div><div class="table_body"><div class="item first" data-lw_font_set=""><span>17:00 - 20:00</span></div><div class="item " data-lw_font_set=""><span>×</span></div><div class="item " data-lw_font_set=""><span>△</span></div><div class="item " data-lw_font_set=""><span>休</span></div><div class="item " data-lw_font_set=""><span>×</span></div><div class="item " data-lw_font_set=""><span>△</span></div><div class="item " data-lw_font_set=""><span>×</span></div></div><div class="table_body"><div class="item first" data-lw_font_set=""><span>20:00 - 21:00</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>休</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>◎</span></div><div class="item " data-lw_font_set=""><span>休</span></div></div></div></div>
<!-- /wp:wdl/lw-pr-calendar-1 -->
<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"top":"24px"}}}} -->
<p class="has-text-align-center" style="margin-top:24px">※ 2026年9月現在の空き状況です。<span class="lw-br on_500px"></span>日曜・水曜はお休みをいただいています。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":24,"tbHeight":20,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:24px"></div><div class="tb" style="height:20px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-button-02 {"btnText":"空いている枠を詳しく見る","btnUrl":"","bgGradient":"color-mix(in srgb, var(--color-main) 50%, #000)","borderColor":"color-mix(in srgb, var(--color-main) 50%, #000)","textColor":"#ffffff","iconColor":"#ffffff"} -->
<div class="wp-block-wdl-lw-button-02 lw-button-02"><div class="a_inner" style="border-width:0px;border-color:color-mix(in srgb, var(--color-main) 50%, #000);border-style:solid"><a href="" target="_self" style="color:#ffffff;font-weight:400" data-lw_font_set="">空いている枠を詳しく見る</a><div class="icon-svg" style="fill:#ffffff"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg></div><div class="a_background" style="background:color-mix(in srgb, var(--color-main) 50%, #000)"></div></div></div>
<!-- /wp:wdl/lw-button-02 --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/custom-title-3 {"mainTitle":"月謝","subTitle":"入会金のほかに、毎月かかるのはこの金額だけです。\u003cbr\u003e教材費は実費、発表会は参加する年だけかかります。","textAlignment":"center","accentColor":"var(--color-main)","headingLevel":2,"mainFontSizeSp":30} -->
<h2 class="wp-block-wdl-custom-title-3 custom-title-3 center" style="--ct3-main-sp:30px" id="price"><div class="main"><span>月謝</span></div><div class="accent" style="background-color:var(--color-main)"></div><div class="sub"><span>入会金のほかに、毎月かかるのはこの金額だけです。<br>教材費は実費、発表会は参加する年だけかかります。</span></div></h2>
<!-- /wp:wdl/custom-title-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-table-1 {"columnCount":4,"headerBgColor":"color-mix(in srgb, var(--color-main) 50%, #000)","headerTextColor":"#ffffff","cellWidth1":200,"cellWidth2":180,"cellWidth3":180,"cellWidth4":200,"headers":[{"text":"1回の時間"},{"text":"回数"},{"text":"月謝（税込）"}]} -->
<div class="wp-block-wdl-lw-pr-table-1 lw-pr-table-1"><div class="wrap_table" role="table" aria-label="料金プラン比較表" style="--lw-table-radius-size:12px;--lw-table-cell-width-1:200px;--lw-table-cell-width-2:180px;--lw-table-cell-width-3:180px;--lw-table-cell-width-4:200px;--lw-table-cell-width-5:200px;--lw-table-cell-width-6:200px;--lw-table-cell-width-7:200px;--lw-table-cell-width-8:200px;--lw-table-cell-width-1-sp:160px;--lw-table-cell-width-2-sp:160px;--lw-table-cell-width-3-sp:160px;--lw-table-cell-width-4-sp:160px;--lw-table-cell-width-5-sp:160px;--lw-table-cell-width-6-sp:160px;--lw-table-cell-width-7-sp:160px;--lw-table-cell-width-8-sp:160px;--lw-table-gap-size:3px;--lw-table-column-count:4;--lw-table-width:769px;--lw-table-width-sp:649px;--lw-table-font-size-header:17px;--lw-table-font-size-header-sp:16px;--lw-table-font-size-row-header:17px;--lw-table-font-size-row-header-sp:16px;--lw-table-font-size-cell:17px;--lw-table-font-size-cell-sp:16px;--lw-table-line-height-header:1.5;--lw-table-line-height-row-header:1.6;--lw-table-line-height-cell:1.6;--lw-table-row-cell-position-align:center;--lw-table-row-cell-position-justify:center;--lw-table-row-cell-head-position-align:center;--lw-table-row-cell-head-position-justify:center"><div class="lw_table_head" role="row" data-lw_font_set=""><div class="cell none" role="columnheader"></div><div class="cell" role="columnheader" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.5"><span class="text" style="line-height:1.5">1回の時間</span></div><div class="cell" role="columnheader" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.5"><span class="text" style="line-height:1.5">回数</span></div><div class="cell" role="columnheader" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.5"><span class="text" style="line-height:1.5">月謝（税込）</span></div></div><div class="lw_table_row first " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">こどものピアノ</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">30分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">月3回</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">8,800円</span></div></div><div class="lw_table_row  " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">リトミック</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">30分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">月2回</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">6,600円</span></div></div><div class="lw_table_row  " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">大人のピアノ</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">45分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">月2回</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">9,900円</span></div></div><div class="lw_table_row  " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">ゆったりコース</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">60分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">月1回</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">6,600円</span></div></div><div class="lw_table_row  last" role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">オンライン</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">30分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">月2回</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">6,600円</span></div></div></div></div>
<!-- /wp:wdl/lw-pr-table-1 -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">※ 入会金 5,500円（体験レッスンの当日にお申し込みで無料）。<span class="lw-br on_500px"></span>表は横にスクロールできます。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/custom-title-3 {"mainTitle":"講師","subTitle":"ひとりの先生が最後まで見ます。\u003cbr\u003e合わないと感じたら、遠慮なく交代をお申し出ください。","textAlignment":"center","accentColor":"var(--color-main)","headingLevel":2,"mainFontSizeSp":30} -->
<h2 class="wp-block-wdl-custom-title-3 custom-title-3 center" style="--ct3-main-sp:30px" id="teacher"><div class="main"><span>講師</span></div><div class="accent" style="background-color:var(--color-main)"></div><div class="sub"><span>ひとりの先生が最後まで見ます。<br>合わないと感じたら、遠慮なく交代をお申し出ください。</span></div></h2>
<!-- /wp:wdl/custom-title-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/profile-1 {"imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_teacher_01.webp","altText":"代表講師 三浦かなで","profileTitle":"代表・三浦 かなで","content":"担当：こどものピアノ／大人のピアノ\n〇〇音楽大学 ピアノ科 卒業\n楽器店の講師を10年つとめたあと、2009年にこの教室をはじめました\n「弾けるようになること」より「やめないこと」を大事にしています","backgroundColor":"#f5f3ee","titleColor":"#333333","contentColor":"#444444"} -->
<div class="wp-block-wdl-profile-1 profile-1" style="background-color:#f5f3ee"><div class="profile_1_inner"><div class="profile_1_image"><img loading="lazy" src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_teacher_01.webp" alt="代表講師 三浦かなで"/></div><div class="profile_1_content"><h2 style="color:#333333">代表・三浦 かなで</h2><p multiline="br" style="color:#444444;white-space:pre-wrap">担当：こどものピアノ／大人のピアノ
〇〇音楽大学 ピアノ科 卒業
楽器店の講師を10年つとめたあと、2009年にこの教室をはじめました
「弾けるようになること」より「やめないこと」を大事にしています</p></div></div></div>
<!-- /wp:wdl/profile-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":24,"tbHeight":20,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:24px"></div><div class="tb" style="height:20px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-button-02 {"btnText":"ほかの講師も見る","btnUrl":"","bgGradient":"color-mix(in srgb, var(--color-main) 50%, #000)","borderColor":"color-mix(in srgb, var(--color-main) 50%, #000)","textColor":"#ffffff","iconColor":"#ffffff"} -->
<div class="wp-block-wdl-lw-button-02 lw-button-02"><div class="a_inner" style="border-width:0px;border-color:color-mix(in srgb, var(--color-main) 50%, #000);border-style:solid"><a href="" target="_self" style="color:#ffffff;font-weight:400" data-lw_font_set="">ほかの講師も見る</a><div class="icon-svg" style="fill:#ffffff"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg></div><div class="a_background" style="background:color-mix(in srgb, var(--color-main) 50%, #000)"></div></div></div>
<!-- /wp:wdl/lw-button-02 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/custom-title-3 {"mainTitle":"体験","subTitle":"まずは1回、いつもの部屋で受けてみてください。\u003cbr\u003eその場で入会を決めていただく必要はありません。","textAlignment":"center","accentColor":"var(--color-main)","headingLevel":2,"mainFontSizeSp":30} -->
<h2 class="wp-block-wdl-custom-title-3 custom-title-3 center" style="--ct3-main-sp:30px" id="trial"><div class="main"><span>体験</span></div><div class="accent" style="background-color:var(--color-main)"></div><div class="sub"><span>まずは1回、いつもの部屋で受けてみてください。<br>その場で入会を決めていただく必要はありません。</span></div></h2>
<!-- /wp:wdl/custom-title-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-step-7 {"circleBgColor":"color-mix(in srgb, var(--color-main) 50%, #000)","colorNo":"#ffffff","columnCountPc":3,"columnCountSp":1,"colorH3":"#333333"} -->
<div class="wp-block-wdl-lw-pr-step-7 lw-pr-step-7 font_size_m"><ul class="lw-pr-step-7__inner" style="max-width:1200px;--column-pc:3;--column-sp:1"><li class="lw-pr-step-7__li" style="background-color:#ffffff;border-color:#e0e0e0"><div class="lw-pr-step-7__li_no" data-lw_font_set="Murecho" style="font-weight:700;background-color:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff">1</div><div class="lw-pr-step-7__li_in"><h3 class="lw-pr-step-7__li_title ttl" data-lw_font_set="" style="font-weight:600;color:#333333">お申し込み</h3><p class="lw-pr-step-7__li_text" data-lw_font_set="" style="font-weight:400;color:#666666">フォームかお電話で、ご希望の曜日と時間をお知らせください。折り返し、空いている枠をご案内します。</p></div></li><li class="lw-pr-step-7__li" style="background-color:#ffffff;border-color:#e0e0e0"><div class="lw-pr-step-7__li_no" data-lw_font_set="Murecho" style="font-weight:700;background-color:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff">2</div><div class="lw-pr-step-7__li_in"><h3 class="lw-pr-step-7__li_title ttl" data-lw_font_set="" style="font-weight:600;color:#333333">体験レッスン</h3><p class="lw-pr-step-7__li_text" data-lw_font_set="" style="font-weight:400;color:#666666">30分・無料。実際のレッスンと同じ部屋で、同じ講師が担当します。楽器をお持ちでなくても受けられます。</p></div></li><li class="lw-pr-step-7__li" style="background-color:#ffffff;border-color:#e0e0e0"><div class="lw-pr-step-7__li_no" data-lw_font_set="Murecho" style="font-weight:700;background-color:color-mix(in srgb, var(--color-main) 50%, #000);color:#ffffff">3</div><div class="lw-pr-step-7__li_in"><h3 class="lw-pr-step-7__li_title ttl" data-lw_font_set="" style="font-weight:600;color:#333333">お返事は後日で</h3><p class="lw-pr-step-7__li_text" data-lw_font_set="" style="font-weight:400;color:#666666">その日のうちに決めなくて結構です。ご家族と相談してから、1週間以内にお返事をいただければ大丈夫です。</p></div></li></ul></div>
<!-- /wp:wdl/lw-pr-step-7 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/custom-title-3 {"mainTitle":"生徒さん","subTitle":"通っている方に書いていただきました。\u003cbr\u003e年齢も目的もばらばらです。","textAlignment":"center","accentColor":"var(--color-main)","headingLevel":2,"mainFontSizeSp":30} -->
<h2 class="wp-block-wdl-custom-title-3 custom-title-3 center" style="--ct3-main-sp:30px" id="voice"><div class="main"><span>生徒さん</span></div><div class="accent" style="background-color:var(--color-main)"></div><div class="sub"><span>通っている方に書いていただきました。<br>年齢も目的もばらばらです。</span></div></h2>
<!-- /wp:wdl/custom-title-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/paid-block-voice-3 {"voices":[{"name":"小学2年生のお母さま","age":"30代","job":"会社員","photo":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_av_01.webp","alt":"30代女性のイラスト","excerpt":"練習しない日があっても叱られないので、本人がピアノを嫌いにならずに済んでいます。","text":"練習しない日があっても叱られないので、本人がピアノを嫌いにならずに済んでいます。\n\n通いはじめて1年半になります。はじめは「30分もじっと座っていられるだろうか」と心配していましたが、先生が本人の好きな曲を聴いて、それに近いものを選んでくださるので、毎回楽しみにしています。\n\n発表会も「出たかったら出る」で構わないと言っていただけたので、去年は見に行くだけにしました。今年は自分から出たいと言っています。"},{"name":"田村様","age":"50代","job":"会社員","photo":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_av_02.webp","alt":"50代男性のイラスト","excerpt":"55歳ではじめました。楽譜の読み方から教わって、いま1曲を半年かけて弾いています。","text":"55歳ではじめました。楽譜の読み方から教わって、いま1曲を半年かけて弾いています。\n\n子どものころに習っていた妻に「いまからでも大丈夫」と言われて体験に行きました。正直、大人が習いに行って笑われないかが一番の心配でしたが、同じ時間帯に来ている方も同世代でした。\n\n月2回なので負担も少なく、仕事が立て込んだ月は振替もしていただけます。半年で1曲というペースですが、自分にはちょうどよいです。"},{"name":"中村様","age":"60代","job":"主婦","photo":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_av_03.webp","alt":"60代女性のイラスト","excerpt":"子どものころにやめてしまったピアノを、40年ぶりに再開しました。","text":"子どものころにやめてしまったピアノを、40年ぶりに再開しました。\n\n手が思うように動かず、はじめの3ヶ月はうまくいきませんでした。先生が指の運動から作り直してくださって、いまは昔弾いていた曲が少しずつ戻ってきています。\n\n孫が同じ教室のリトミックに通っているので、待ち時間に一緒に来られるのも助かっています。"}],"cardBgColor":"#ffffff","nameColor":"#333333","btnBgColor":"color-mix(in srgb, var(--color-main) 50%, #000)","btnTextColor":"#ffffff"} -->
<div class="wp-block-wdl-paid-block-voice-3 paid-block-voice-3 init-hide" data-voices="[{&quot;name&quot;:&quot;小学2年生のお母さま&quot;,&quot;age&quot;:&quot;30代&quot;,&quot;job&quot;:&quot;会社員&quot;,&quot;photo&quot;:&quot;https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_av_01.webp&quot;,&quot;alt&quot;:&quot;30代女性のイラスト&quot;,&quot;excerpt&quot;:&quot;練習しない日があっても叱られないので、本人がピアノを嫌いにならずに済んでいます。&quot;,&quot;text&quot;:&quot;練習しない日があっても叱られないので、本人がピアノを嫌いにならずに済んでいます。\n\n通いはじめて1年半になります。はじめは「30分もじっと座っていられるだろうか」と心配していましたが、先生が本人の好きな曲を聴いて、それに近いものを選んでくださるので、毎回楽しみにしています。\n\n発表会も「出たかったら出る」で構わないと言っていただけたので、去年は見に行くだけにしました。今年は自分から出たいと言っています。&quot;},{&quot;name&quot;:&quot;田村様&quot;,&quot;age&quot;:&quot;50代&quot;,&quot;job&quot;:&quot;会社員&quot;,&quot;photo&quot;:&quot;https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_av_02.webp&quot;,&quot;alt&quot;:&quot;50代男性のイラスト&quot;,&quot;excerpt&quot;:&quot;55歳ではじめました。楽譜の読み方から教わって、いま1曲を半年かけて弾いています。&quot;,&quot;text&quot;:&quot;55歳ではじめました。楽譜の読み方から教わって、いま1曲を半年かけて弾いています。\n\n子どものころに習っていた妻に「いまからでも大丈夫」と言われて体験に行きました。正直、大人が習いに行って笑われないかが一番の心配でしたが、同じ時間帯に来ている方も同世代でした。\n\n月2回なので負担も少なく、仕事が立て込んだ月は振替もしていただけます。半年で1曲というペースですが、自分にはちょうどよいです。&quot;},{&quot;name&quot;:&quot;中村様&quot;,&quot;age&quot;:&quot;60代&quot;,&quot;job&quot;:&quot;主婦&quot;,&quot;photo&quot;:&quot;https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_av_03.webp&quot;,&quot;alt&quot;:&quot;60代女性のイラスト&quot;,&quot;excerpt&quot;:&quot;子どものころにやめてしまったピアノを、40年ぶりに再開しました。&quot;,&quot;text&quot;:&quot;子どものころにやめてしまったピアノを、40年ぶりに再開しました。\n\n手が思うように動かず、はじめの3ヶ月はうまくいきませんでした。先生が指の運動から作り直してくださって、いまは昔弾いていた曲が少しずつ戻ってきています。\n\n孫が同じ教室のリトミックに通っているので、待ち時間に一緒に来られるのも助かっています。&quot;}]" data-font-settings="{&quot;nameFontSet&quot;:&quot;&quot;,&quot;nameFontWeight&quot;:&quot;600&quot;,&quot;excerptFontSet&quot;:&quot;&quot;,&quot;excerptFontWeight&quot;:&quot;400&quot;}"><div class="inner" style="--paid-block-voice-3-max-width:1120px;--lw-voice-card-bg:#ffffff;--lw-voice-name-color:#333333;--lw-voice-excerpt-color:#666666;--lw-voice-meta-color:#999999;--color-btn-bg:color-mix(in srgb, var(--color-main) 50%, #000);--color-btn-text:#ffffff"><div class="swiper voice-swiper"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="voice-modal paid-block-voice-3-modal"><div class="modal-overlay"></div><div class="modal-content"><button class="modal-close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button><div class="modal-body"><div class="modal-photo"><img src="" alt=""/></div><h3 class="modal-name" data-lw_font_set="" style="font-weight:600"></h3><p class="modal-meta"></p><div class="modal-text" data-lw_font_set="" style="font-weight:400"></div></div></div></div><script type="text/javascript">
(function(){
    var _sc = document.currentScript;
    var _root = ( _sc && _sc.closest ) ? _sc.closest(".paid-block-voice-3") : null;
    if ( !_root ) _root = document.querySelector(".paid-block-voice-3:not([data-lw-init])");
    if ( !_root ) return;
    _root.setAttribute("data-lw-init","1");
    if ( !_root.id ) _root.id = "paid-block-voice-3-" + Math.random().toString(36).slice(2,10);
    const selector = "#" + _root.id;
    const section = _root;

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
                delay: 4000,
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
                    spaceBetween: 30,
                },
            },
        });

        section.classList.remove("init-hide");
        return true;
    };

    // ========== モーダル処理 ==========
    function initModal() {
        // ★ 既にbody直下に移動済みかチェック（複数ブロック対応）
        let modal = document.querySelector('.paid-block-voice-3-modal[data-for-block="' + section.id + '"]');

        if (!modal) {
            // まだ移動していない場合、セクション内から取得
            modal = section.querySelector('.paid-block-voice-3-modal');
            if (!modal) return;

            // ★ モーダルをbody直下に移動（他ブロックのz-index影響を回避）
            document.body.appendChild(modal);
            modal.setAttribute('data-for-block', section.id);
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
        </script><noscript><style>.paid-block-voice-3{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-voice-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/custom-title-3 {"mainTitle":"質問","subTitle":"体験レッスンの前によくいただくご質問です。","textAlignment":"center","accentColor":"var(--color-main)","headingLevel":2,"mainFontSizeSp":30} -->
<h2 class="wp-block-wdl-custom-title-3 custom-title-3 center" style="--ct3-main-sp:30px" id="faq"><div class="main"><span>質問</span></div><div class="accent" style="background-color:var(--color-main)"></div><div class="sub"><span>体験レッスンの前によくいただくご質問です。</span></div></h2>
<!-- /wp:wdl/custom-title-3 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":24} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:24px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-qa-1 {"mainColor":"var(--color-main)"} -->
<div class="wp-block-wdl-lw-qa-1 lw-qa-1"><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="">楽器が家にありません</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="">大丈夫です。はじめの半年は、電子ピアノでも十分に練習できます。ご購入を考えるころに、予算と置き場所に合うものを一緒に選びます。教室で練習していただくこともできます。</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="">楽譜が読めません</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="">読み方からお教えします。大人の方の半分以上は、楽譜が読めない状態で来られます。音符に名前を書き込むところからで結構です。</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="">何歳から通えますか</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="">リトミックは2歳から、ピアノは4歳ごろからです。ただし、じっと座っていられるかどうかには個人差がありますので、体験レッスンで見せていただいてから決めましょう。</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="">練習する時間がとれません</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="">週に10分でも構いません。「毎日30分」を前提にしていないので、練習できなかった週はレッスンの中で一緒に弾きます。</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="">発表会は必ず出ますか</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="">希望する方だけです。参加費は11,000円で、出ない方には一切かかりません。見に来るだけ、という方も毎年いらっしゃいます。</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="">休んだら振替できますか</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="">前日までにご連絡いただければ、同じ月の中で1回まで振り替えられます。当日のご連絡は振替の対象外ですが、体調不良のときはご相談ください。</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="">駐車場はありますか</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="">建物の前に2台分あります。満車のときは近くのコインパーキングをご利用ください。自転車は入り口の横に停められます。</p></div></dd></dl><script>
(function(){
	const scriptEl  = document.currentScript;
	if ( !scriptEl ) return;
	const container = scriptEl.parentNode;           // <script> の親 = lw-qa-1 本体
	if ( !container || !container.classList.contains('lw-qa-1') ) return;

	/* クリックイベントをバインド ---------------------- */
	function bind () {
		container.querySelectorAll(".lw-qa-1__dl").forEach( function( dl ){
			if ( dl.dataset.lwQaBound ) return;      // 二重バインド防止
			dl.dataset.lwQaBound = "1";
			dl.addEventListener("click", function(){ dl.classList.toggle("active"); } );
		} );
	}

	bind(); // まず 1 回

	/* MutationObserver – QA が動的に増減しても OK */
	const mo = new MutationObserver(bind);
	mo.observe(container,{ childList:true, subtree:true });
})();
		</script></div>
<!-- /wp:wdl/lw-qa-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_cta_bg.webp","imageSp":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_cta_bg.webp","isFullWidth":true,"minHeightPc":"min-h-pc-360px","minHeightTb":"min-h-tb-340px","minHeightSp":"min-h-sp-320px","filterTypePc":"solid","filterColorPc":"var(--color-main)","opacityPc":0.62} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-360px min-h-tb-340px min-h-sp-320px bg_all" style="--lw-bg-color-filter-pc:var(--color-main);--lw-bg-opacity-pc:0.62;--lw-bg-color-filter-tb:var(--color-main);--lw-bg-opacity-tb:0.5;--lw-bg-color-filter-sp:var(--color-main);--lw-bg-opacity-sp:0.5;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:80px;--lw-bg-padding-right-pc:80px;--lw-bg-padding-top-tb:48px;--lw-bg-padding-bottom-tb:48px;--lw-bg-padding-left-tb:48px;--lw-bg-padding-right-tb:48px;--lw-bg-padding-top-sp:24px;--lw-bg-padding-bottom-sp:24px;--lw-bg-padding-left-sp:24px;--lw-bg-padding-right-sp:24px;--lw-bg-max-width:1120px"><!-- wp:heading {"level":2,"textAlign":"center","style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"28px","lineHeight":"1.4"}}} -->
<h2 class="has-text-align-center has-text-color" style="color:#ffffff;font-size:28px;line-height:1.4">まずは30分、<span class="lw-br on_500px"></span>弾いてみませんか</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"16px"}}} -->
<p class="has-text-align-center has-text-color" style="color:#ffffff;font-size:16px">体験レッスンは無料です。楽器をお持ちでなくても受けられます。<br>その場で入会を決めていただく必要はありません。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-button-1 {"textSub":"＼ 体験レッスンは無料 ／","textMain":"体験レッスンを申し込む","btnUrl":"","btnAlign":"center","bgColor":"#ffffff","bgColorHover":"#f2f4f7","textColorMain":"color-mix(in srgb, var(--color-main) 40%, #000)","bgColorSub":"color-mix(in srgb, var(--color-main) 45%, #000)","textColorSub":"#ffffff","borderColor":"#ffffff","borderWidth":3,"iconRightColor":"color-mix(in srgb, var(--color-main) 40%, #000)","maxWidth":360,"maxWidthSp":300} -->
<div class="wp-block-wdl-lw-pr-button-1 lw-pr-button-1"><div class="wrap_btn center"><a href="#" class="lw_btn_a " style="--hover-bg:#f2f4f7;--transition-duration:0.3s;--max-width-sp:300px;--shake-interval:3s;--font-size-main:20px;--font-size-main-sp:18px;--font-size-sub:12px;max-width:360px;background:#ffffff;border:3px solid #ffffff;border-radius:64px;box-shadow:0px 0px 6px rgba(0, 0, 0, 0.2)"><span class="text_sub"><span class="in" style="background:color-mix(in srgb, var(--color-main) 45%, #000);color:#ffffff;font-weight:600;font-size:12px" data-lw_font_set="">＼ 体験レッスンは無料 ／</span><span class="down" style="background:color-mix(in srgb, var(--color-main) 45%, #000)"></span></span><span class="text_main" style="color:color-mix(in srgb, var(--color-main) 40%, #000);font-weight:700;font-size:20px" data-lw_font_set="">体験レッスンを申し込む</span><span class="icon_right" style="fill:color-mix(in srgb, var(--color-main) 40%, #000);width:12px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg></span></a></div></div>
<!-- /wp:wdl/lw-pr-button-1 --></div><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_cta_bg.webp" media="(max-width: 800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_cta_bg.webp" media="(min-width: 801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/sk_cta_bg.webp" alt=""/></picture></div>
<!-- /wp:wdl/lw-bg-1 -->