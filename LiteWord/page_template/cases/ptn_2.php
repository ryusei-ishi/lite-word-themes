<!-- wp:wdl/paid-block-fv-11 {"layoutType":"full","maxWidth":1400,"autoplayDelay":4500,"sliderEffect":"fade","crossFade":true,"loop":true,"showPagination":true,"showNavigation":false,"sliderSpeed":1000,"paginationColor":"#ffffff","subTitle":"WORKS","mainTitle":"手がけた仕事","descriptionText":"2019年から、地元のお店と会社を中心に62件。見た目だけでなく、そのあとどうなったかまで書いています。","showCtaButton":false,"buttonLabel":"","ctaLinkUrl":"","filterColor":"#1c2a12","filterOpacity":0.55,"minHeightPc":"min-h-pc-480px","minHeightTb":"min-h-tb-380px","minHeightSp":"min-h-sp-320px","slides":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/atelier_03.webp","spImgUrl":"","altText":"作業台に並んだ道具","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_pg_service.webp","spImgUrl":"","altText":"広げた図面と筆記具","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/ship_03.webp","spImgUrl":"","altText":"リボンを掛けた贈りもの","linkUrl":""}]} -->
<div class="wp-block-wdl-paid-block-fv-11 swiper paid-block-fv-11 max-w init-hide min-h-pc-480px min-h-tb-380px min-h-sp-320px" style="max-width:100vw"><div class="text_in center"><div class="in"><h1 class="ttl"><span class="sub">WORKS</span>  <span class="main">手がけた仕事</span></h1><p class="description">2019年から、地元のお店と会社を中心に62件。見た目だけでなく、そのあとどうなったかまで書いています。</p></div></div><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/atelier_03.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/atelier_03.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/atelier_03.webp" alt="作業台に並んだ道具"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_pg_service.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_pg_service.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_pg_service.webp" alt="広げた図面と筆記具"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/ship_03.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/ship_03.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/ship_03.webp" alt="リボンを掛けた贈りもの"/></picture></div><div class="image_filter" style="background-color:#1c2a12;opacity:0.55"></div></div><div class="swiper-pagination"></div><script type="text/javascript">
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
            delay: 4500,
            disableOnInteraction: false
        },
        observer: true,
        observeParents: true,
        fadeEffect: { crossFade: true },
        
            pagination: {
                el: selector + " .swiper-pagination",
                clickable: true
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
<!-- wp:wdl/lw-pr-text-1 {"text":"最近の6件","tagName":"h2","textAlignPc":"center","textAlignSp":"center","fontWeight":"700","fontSizePc":2.2,"fontSizeSp":1.6,"lineHeightPc":1.4,"lineHeightSp":1.4,"gradientPreset":"","gradientColor1":"#4a6b2a","gradientColor2":"#8aa860"} -->
<h2 class="wp-block-wdl-lw-pr-text-1 lw-pr-text-1 wp-block-heading gradient-slide-anime" style="font-weight:700;--lw-text-align-pc:center;--lw-text-align-sp:center;--lw-pr-text-1-font-size-pc:2.2em;--lw-pr-text-1-font-size-sp:1.6em;--lw-pr-text-1-line-height-pc:1.4;--lw-pr-text-1-line-height-sp:1.4;--lw-pr-text-1-gradient:linear-gradient(270deg, #4a6b2a, #8aa860, #3b82f6);--lw-pr-text-1-gradient-anime-ptn:lw-pr-text-1-gradient-slide-anime-1;--lw-pr-text-1-gradient-anime-time:3s;--lw-pr-text-1-gradient-anime-movement:linear" data-lw_font_set=""><span>最近の6件</span></h2>
<!-- /wp:wdl/lw-pr-text-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#363b31"},"typography":{"fontSize":"16px","lineHeight":"2"},"spacing":{"margin":{"top":"28px","bottom":"24px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#363b31;font-size:16px;line-height:2;margin-top:28px;margin-bottom:24px">横に送ってご覧ください。<span class="lw-br on_500px"></span>それぞれ、お引き受けした理由と、そのあと分かったことを書いています。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-pr-content-9 {"autoplay":false,"slides":[{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_01.webp","altText":"パン屋の紙袋と包装紙","title":"パン屋の包装一式","description":"袋を替えたら、手土産にする方が増えたそうです。土曜の売上が前年の1.3倍になったと伺いました。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_02.webp","altText":"整体院の看板","title":"整体院の看板","description":"道からは見えない2階だったので、字を減らして矢印だけを大きくしました。飛び込みが月に7件増えたそうです。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_03.webp","altText":"味噌のパッケージ","title":"味噌の詰め合わせ","description":"贈答用に。中身は変えず、箱と栞だけを作り直しました。お歳暮の受注が2.1倍になりました。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_04.webp","altText":"工務店の会社案内","title":"工務店の会社案内","description":"施工写真ではなく、職人の顔を前に出しました。採用の応募が年3人から11人に増えたそうです。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_gal_02.webp","altText":"喫茶店のメニュー","title":"喫茶店のお品書き","description":"写真を全部やめて、字だけにしました。注文の迷いが減り、回転が少し速くなったとのことです。","linkUrl":"","openNewTab":false},{"imgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_gal_03.webp","altText":"教室の案内チラシ","title":"教室の案内","description":"「初めての方へ」の面を1面まるごと使いました。問い合わせの内容が具体的になりました。","linkUrl":"","openNewTab":false}]} -->
<div class="wp-block-wdl-lw-pr-content-9 lw-pr-content-9 init-hide"><div class="lw-pr-content-9__wrap"><div class="swiper lw-pr-content-9-swiper"><div class="swiper-wrapper"><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_01.webp" alt="パン屋の紙袋と包装紙"/></div><h3>パン屋の包装一式</h3><p>袋を替えたら、手土産にする方が増えたそうです。土曜の売上が前年の1.3倍になったと伺いました。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_02.webp" alt="整体院の看板"/></div><h3>整体院の看板</h3><p>道からは見えない2階だったので、字を減らして矢印だけを大きくしました。飛び込みが月に7件増えたそうです。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_03.webp" alt="味噌のパッケージ"/></div><h3>味噌の詰め合わせ</h3><p>贈答用に。中身は変えず、箱と栞だけを作り直しました。お歳暮の受注が2.1倍になりました。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/works_04.webp" alt="工務店の会社案内"/></div><h3>工務店の会社案内</h3><p>施工写真ではなく、職人の顔を前に出しました。採用の応募が年3人から11人に増えたそうです。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_gal_02.webp" alt="喫茶店のメニュー"/></div><h3>喫茶店のお品書き</h3><p>写真を全部やめて、字だけにしました。注文の迷いが減り、回転が少し速くなったとのことです。</p></div></div><div class="swiper-slide"><div class="item"><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/sec/km_gal_03.webp" alt="教室の案内チラシ"/></div><h3>教室の案内</h3><p>「初めての方へ」の面を1面まるごと使いました。問い合わせの内容が具体的になりました。</p></div></div></div><div class="swiper-pagination"></div></div></div><script type="text/javascript">
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
<!-- /wp:wdl/lw-pr-content-9 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-text-1 {"text":"お引き受けの実際","tagName":"h2","textAlignPc":"center","textAlignSp":"center","fontWeight":"700","fontSizePc":2.2,"fontSizeSp":1.6,"lineHeightPc":1.4,"lineHeightSp":1.4,"gradientPreset":"","gradientColor1":"#4a6b2a","gradientColor2":"#8aa860"} -->
<h2 class="wp-block-wdl-lw-pr-text-1 lw-pr-text-1 wp-block-heading gradient-slide-anime" style="font-weight:700;--lw-text-align-pc:center;--lw-text-align-sp:center;--lw-pr-text-1-font-size-pc:2.2em;--lw-pr-text-1-font-size-sp:1.6em;--lw-pr-text-1-line-height-pc:1.4;--lw-pr-text-1-line-height-sp:1.4;--lw-pr-text-1-gradient:linear-gradient(270deg, #4a6b2a, #8aa860, #3b82f6);--lw-pr-text-1-gradient-anime-ptn:lw-pr-text-1-gradient-slide-anime-1;--lw-pr-text-1-gradient-anime-time:3s;--lw-pr-text-1-gradient-anime-movement:linear" data-lw_font_set=""><span>お引き受けの実際</span></h2>
<!-- /wp:wdl/lw-pr-text-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":16,"tbHeight":16,"spHeight":12} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:16px"></div><div class="tb" style="height:16px"></div><div class="sp" style="height:12px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-border-1 {"mtPc":8,"mbPc":8,"maxWidthUnitPc":"%","maxWidthPc":40,"borderWidthPc":2,"borderStylePc":"solid","borderColorPc":"#4a6b2a","alignPc":"center"} -->
<div class="wp-block-wdl-lw-pr-border-1 lw-pr-border-1" style="--border-1-mt-pc:8px;--border-1-mb-pc:8px;--border-1-ml-pc:auto;--border-1-mr-pc:auto;--border-1-max-width-pc:40%;--border-1-width-pc:2px;--border-1-style-pc:solid;--border-1-color-pc:#4a6b2a;--border-1-mt-sp:8px;--border-1-mb-sp:8px;--border-1-ml-sp:auto;--border-1-mr-sp:auto;--border-1-max-width-sp:40%;--border-1-width-sp:2px;--border-1-style-sp:solid;--border-1-color-sp:#4a6b2a"></div>
<!-- /wp:wdl/lw-pr-border-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":24,"tbHeight":20,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:24px"></div><div class="tb" style="height:20px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-column-1 {"columnsPc":3,"columnWidthsPc":[1,1,1],"columnsSp":1,"columnGapPc":16,"wrapPaddingTopPc":0,"wrapPaddingBottomPc":0,"itemBgNone":false,"itemBgTypePc":"solid","itemBgColorPc":"#ffffff","itemBgTypeSp":"solid","itemBgColorSp":"#ffffff","itemBorderColorPc":"#dde4d5","itemBorderWidthPc":1,"itemBorderStylePc":"solid","itemBorderColorSp":"#dde4d5","itemBorderWidthSp":1,"itemBorderStyleSp":"solid","itemPaddingTopPc":28,"itemPaddingBottomPc":28,"itemPaddingLeftPc":24,"itemPaddingRightPc":24,"itemPaddingTopSp":20,"itemPaddingBottomSp":20,"itemPaddingLeftSp":18,"itemPaddingRightSp":18,"itemBorderRadiusTopLeftPc":8,"itemBorderRadiusTopRightPc":8,"itemBorderRadiusBottomRightPc":8,"itemBorderRadiusBottomLeftPc":8,"itemBorderRadiusTopLeftSp":8,"itemBorderRadiusTopRightSp":8,"itemBorderRadiusBottomRightSp":8,"itemBorderRadiusBottomLeftSp":8} -->
<div class="wp-block-wdl-lw-pr-column-1 lw-pr-column-1" style="--column-1-wrap-padding-pc:0px 0px 0px 0px;--column-1-wrap-padding-sp:0px 0px 0px 0px;--column-1-border-color-pc:rgb(131, 131, 131);--column-1-border-width-pc:0px;--column-1-border-style-pc:solid;--column-1-border-color-sp:rgb(131, 131, 131);--column-1-border-width-sp:0px;--column-1-border-style-sp:solid;--column-1-bdr-pc:0px 0px 0px 0px;--column-1-bdr-sp:0px 0px 0px 0px;--column-1-gtc-pc:1fr 1fr 1fr;--column-1-gtc-sp:1fr;--column-1-row-gap-pc:8px;--column-1-row-gap-sp:8px;--column-1-column-gap-pc:16px;--column-1-column-gap-sp:16px;--column-1-item-bg-pc:#ffffff;--column-1-item-bg-sp:#ffffff;--column-1-item-min-h-pc:0px;--column-1-item-min-h-sp:0px;--column-1-item-padding-pc:28px 24px 28px 24px;--column-1-item-padding-sp:20px 18px 20px 18px;--column-1-item-bdr-pc:8px 8px 8px 8px;--column-1-item-bdr-sp:8px 8px 8px 8px;--column-1-item-border-color-pc:#dde4d5;--column-1-item-border-width-pc:1px;--column-1-item-border-style-pc:solid;--column-1-item-border-color-sp:#dde4d5;--column-1-item-border-width-sp:1px;--column-1-item-border-style-sp:solid"><div class="custom_wrap"><!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:heading {"level":3,"style":{"color":{"text":"#4a6b2a"},"typography":{"fontSize":"30px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"16px"}}},"textAlign":"center"} -->
<h3 class="has-text-align-center has-text-color" style="color:#4a6b2a;font-size:30px;line-height:1.4;margin-top:0px;margin-bottom:16px">62件</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#363b31"},"typography":{"fontSize":"16px","lineHeight":"1.9"}},"align":"center"} -->
<p class="has-text-align-center has-text-color" style="color:#363b31;font-size:16px;line-height:1.9">2019年からお引き受けした数です。うち48件が県内のお店・会社です。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item -->
<!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:heading {"level":3,"style":{"color":{"text":"#4a6b2a"},"typography":{"fontSize":"30px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"16px"}}},"textAlign":"center"} -->
<h3 class="has-text-align-center has-text-color" style="color:#4a6b2a;font-size:30px;line-height:1.4;margin-top:0px;margin-bottom:16px">7年</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#363b31"},"typography":{"fontSize":"16px","lineHeight":"1.9"}},"align":"center"} -->
<p class="has-text-align-center has-text-color" style="color:#363b31;font-size:16px;line-height:1.9">いちばん長くお付き合いいただいている先です。年に1〜2件ずつご依頼をいただいています。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item -->
<!-- wp:wdl/lw-pr-column-1-item -->
<div class="wp-block-wdl-lw-pr-column-1-item custom_column_item"><!-- wp:heading {"level":3,"style":{"color":{"text":"#4a6b2a"},"typography":{"fontSize":"30px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"16px"}}},"textAlign":"center"} -->
<h3 class="has-text-align-center has-text-color" style="color:#4a6b2a;font-size:30px;line-height:1.4;margin-top:0px;margin-bottom:16px">3週間</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#363b31"},"typography":{"fontSize":"16px","lineHeight":"1.9"}},"align":"center"} -->
<p class="has-text-align-center has-text-color" style="color:#363b31;font-size:16px;line-height:1.9">お話をうかがってから最初の案をお出しするまでの、平均の日数です。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:wdl/lw-pr-column-1-item --></div></div>
<!-- /wp:wdl/lw-pr-column-1 -->
<!-- wp:wdl/lw-space-1 {"pcHeight":80,"tbHeight":64,"spHeight":40} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:40px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"#f1f5ec","opacityPc":1,"filterTypeTb":"solid","filterColorTb":"#f1f5ec","opacityTb":1,"filterTypeSp":"solid","filterColorSp":"#f1f5ec","opacitySp":1} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:#f1f5ec;--lw-bg-opacity-pc:1;--lw-bg-color-filter-tb:#f1f5ec;--lw-bg-opacity-tb:1;--lw-bg-color-filter-sp:#f1f5ec;--lw-bg-opacity-sp:1;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:heading {"level":3,"style":{"color":{"text":"#243613"},"typography":{"fontSize":"24px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"16px"}}},"textAlign":"center"} -->
<h3 class="has-text-align-center has-text-color" style="color:#243613;font-size:24px;line-height:1.6;margin-top:0px;margin-bottom:16px">進め方</h3>
<!-- /wp:heading -->
<!-- wp:wdl/paid-block-lw-step-3 {"ulMaxWidth":1040,"fontSizeClass":"font_size_m","bgGradient":"#354d1e","colorH3":"#243613","colorP":"#363b31","noWidthEm":0,"noFontSizeEm":0} -->
<div class="wp-block-wdl-paid-block-lw-step-3 paid-block-lw-step-3 font_size_m"><ul class="lw-step-2__inner" style="max-width:1040px"><li class="lw-step-2__li" style="border-color:#354d1e"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:#354d1e">01</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="" style="color:#243613">お話をうかがう</h3><p class="lw-step-2__li_text" data-lw_font_set="" style="color:#363b31">1〜2時間・無料。ご商売の中身と、いま困っていることを聞かせてください。</p></div></li><li class="lw-step-2__li" style="border-color:#354d1e"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:#354d1e">02</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="" style="color:#243613">お見積とご提案</h3><p class="lw-step-2__li_text" data-lw_font_set="" style="color:#363b31">かかる費用と日数をお出しします。ここまでで合わないと思われたら費用はかかりません。</p></div></li><li class="lw-step-2__li" style="border-color:#354d1e"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:#354d1e">03</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="" style="color:#243613">案を3つお出しする</h3><p class="lw-step-2__li_text" data-lw_font_set="" style="color:#363b31">方向の違う3案です。どれも本番と同じ作り込みでお見せします。</p></div></li><li class="lw-step-2__li" style="border-color:#354d1e"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:#354d1e">04</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="" style="color:#243613">1つ選んでいただく</h3><p class="lw-step-2__li_text" data-lw_font_set="" style="color:#363b31">選んだ案を仕上げます。直しは2回まで。3回目からは追加のお見積になります。</p></div></li><li class="lw-step-2__li" style="border-color:#354d1e"><div class="lw-step-2__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:#354d1e">05</div><div class="lw-step-2__li_in"><h3 class="lw-step-2__li_title ttl" data-lw_font_set="" style="color:#243613">データのお渡し</h3><p class="lw-step-2__li_text" data-lw_font_set="" style="color:#363b31">印刷用とウェブ用をまとめてお渡しします。あとから使い回していただけます。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-lw-step-3 -->
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#545a4e"},"typography":{"fontSize":"14px","lineHeight":"1.9"},"spacing":{"margin":{"top":"16px","bottom":"0px"}}}} -->
<p class="has-text-align-center has-text-color" style="color:#545a4e;font-size:14px;line-height:1.9;margin-top:16px;margin-bottom:0px">※ ②までは無料です。ここまでで合わないと思われたら、費用はかかりません。</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:wdl/lw-bg-1 -->
<!-- wp:wdl/lw-bg-1 {"backgroundType":"image","imagePc":"","imageSp":"","isFullWidth":true,"maxWidth":1040,"minHeightPc":"min-h-pc-150px","minHeightTb":"min-h-tb-160px","minHeightSp":"min-h-sp-160px","innerPaddingTopPc":80,"innerPaddingBottomPc":80,"innerPaddingLeftPc":40,"innerPaddingRightPc":40,"innerPaddingTopTb":64,"innerPaddingBottomTb":64,"innerPaddingLeftTb":32,"innerPaddingRightTb":32,"innerPaddingTopSp":48,"innerPaddingBottomSp":48,"innerPaddingLeftSp":20,"innerPaddingRightSp":20,"filterTypePc":"solid","filterColorPc":"#243613","opacityPc":1,"filterTypeTb":"solid","filterColorTb":"#243613","opacityTb":1,"filterTypeSp":"solid","filterColorSp":"#243613","opacitySp":1} -->
<div class="wp-block-wdl-lw-bg-1 lw-bg-1 min-h-pc-150px min-h-tb-160px min-h-sp-160px bg_all" style="--lw-bg-color-filter-pc:#243613;--lw-bg-opacity-pc:1;--lw-bg-color-filter-tb:#243613;--lw-bg-opacity-tb:1;--lw-bg-color-filter-sp:#243613;--lw-bg-opacity-sp:1;--lw-bg-position-pc:50% 50%;--lw-bg-position-sp:50% 50%;--lw-bg-wrap-centering-pc:center;--lw-bg-wrap-align-pc:center;--lw-bg-wrap-centering-tb:center;--lw-bg-wrap-align-tb:center;--lw-bg-wrap-centering-sp:center;--lw-bg-wrap-align-sp:center"><div class="lw-bg-1-wrap" style="--lw-bg-padding-top-pc:80px;--lw-bg-padding-bottom-pc:80px;--lw-bg-padding-left-pc:40px;--lw-bg-padding-right-pc:40px;--lw-bg-padding-top-tb:64px;--lw-bg-padding-bottom-tb:64px;--lw-bg-padding-left-tb:32px;--lw-bg-padding-right-tb:32px;--lw-bg-padding-top-sp:48px;--lw-bg-padding-bottom-sp:48px;--lw-bg-padding-left-sp:20px;--lw-bg-padding-right-sp:20px;--lw-bg-max-width:1040px"><!-- wp:heading {"level":3,"style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"26px","lineHeight":"1.6"},"spacing":{"margin":{"top":"0px","bottom":"16px"}}},"textAlign":"center"} -->
<h3 class="has-text-align-center has-text-color" style="color:#ffffff;font-size:26px;line-height:1.6;margin-top:0px;margin-bottom:16px">近い仕事をお見せします</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"#dce6d2"},"typography":{"fontSize":"16px","lineHeight":"2"}},"align":"center"} -->
<p class="has-text-align-center has-text-color" style="color:#dce6d2;font-size:16px;line-height:2">ご商売の内容と、いま困っていることを教えてください。似た条件の仕事を、費用つきでお見せします。</p>
<!-- /wp:paragraph -->
<!-- wp:wdl/lw-space-1 {"pcHeight":24,"tbHeight":20,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:24px"></div><div class="tb" style="height:20px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->
<!-- wp:wdl/lw-pr-button-4 {"textMain":"000-000-0000","textSub":"受付時間 10:00〜18:00（土日祝休）","btnUrl":"tel:0000000000","btnAlign":"center","bgColor":"#4a6b2a","bgColorHover":"#37511f","textColorMain":"#ffffff","borderWidth":0,"borderRadius":6} -->
<div class="wp-block-wdl-lw-pr-button-4 lw-pr-button-4"><div class="wrap_btn center"><a href="tel:0000000000" class="lw_btn_a " style="--hover-bg:#37511f;--transition-duration:0.3s;--max-width-sp:480px;--shake-interval:3s;--font-size-main:28px;--font-size-main-sp:18px;--font-size-sub:14px;--letter-spacing:0.05em;max-width:580px;padding:1.2em 1.5em;background:#4a6b2a;border:0px solid #000000;border-radius:6px;box-shadow:0px 0px 6px rgba(0, 0, 0, 0.2)"><span class="text_main" style="color:#ffffff;font-weight:500;font-size:28px;letter-spacing:0.05em" data-lw_font_set=""><span class="icon" style="fill:#ffffff;width:32px;margin-right:8px;margin-left:-8px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></span>000-000-0000</span><span class="text_sub" style="color:#ffffff;font-weight:500;font-size:14px" data-lw_font_set="">受付時間 10:00〜18:00（土日祝休）</span></a></div></div>
<!-- /wp:wdl/lw-pr-button-4 --></div></div>
<!-- /wp:wdl/lw-bg-1 -->