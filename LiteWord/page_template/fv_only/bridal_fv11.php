<!-- wp:wdl/paid-block-fv-11 {"slides":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/hanaya_1.webp","spImgUrl":"","altText":"装花","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/sub_2.webp","spImgUrl":"","altText":"会場の緑","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp","spImgUrl":"","altText":"打ち合わせ","linkUrl":""}],"autoplayDelay":5500,"minHeightPc":"min-h-pc-680px","minHeightTb":"min-h-tb-600px","minHeightSp":"min-h-sp-560px","subTitle":"WEDDING FLOWER","mainTitle":"その日の空気ごと、つくる","descriptionText":"会場の光と天井の高さを見てから、花の高さを決めます。","buttonLabel":"打ち合わせのご予約","ctaLinkUrl":"#contact","filterColor":"#4a3a44","blockId":"paid-block-fv-11-bridal-sample"} -->
<div id="paid-block-fv-11-bridal-sample" class="wp-block-wdl-paid-block-fv-11 swiper paid-block-fv-11 max-w init-hide min-h-pc-680px min-h-tb-600px min-h-sp-560px" style="max-width:100vw"><div class="text_in center"><div class="in"><h1 class="ttl"><span class="sub">WEDDING FLOWER</span>  <span class="main">その日の空気ごと、つくる</span></h1><p class="description">会場の光と天井の高さを見てから、花の高さを決めます。</p><span class="cta_btn"><a href="#contact" class="btn_link"><span>打ち合わせのご予約</span></a></span></div></div><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/hanaya_1.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/hanaya_1.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/hanaya_1.webp" alt="装花"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/sub_2.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/sub_2.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/sub_2.webp" alt="会場の緑"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp" alt="打ち合わせ"/></picture></div><div class="image_filter" style="background-color:#4a3a44;opacity:0.6"></div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><script type="text/javascript">
(function(){
const selector = "#paid-block-fv-11-bridal-sample";
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
            delay: 5500,
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
                    #paid-block-fv-11-bridal-sample .swiper-pagination-bullet { background-color:#ffffff; }
                    #paid-block-fv-11-bridal-sample .swiper-button-next,
                    #paid-block-fv-11-bridal-sample .swiper-button-prev { color:#ffffff; }
                </style><noscript><style>#paid-block-fv-11-bridal-sample{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-11 -->
