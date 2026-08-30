<!-- wp:wdl/paid-block-fv-11 {"slides":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/nail_2.webp","spImgUrl":"","altText":"施術室","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_4.webp","spImgUrl":"","altText":"待合","linkUrl":""}],"layoutType":"fixed","autoplayDelay":4000,"sliderEffect":"slide","minHeightPc":"min-h-pc-580px","minHeightTb":"min-h-tb-480px","minHeightSp":"min-h-sp-480px","subTitle":"ESTHETIC","mainTitle":"肌の調子は、日によって違う","descriptionText":"その日の肌を見てから内容を決めます。回数券の押し売りはしません。","showCtaButton":false,"filterColor":"#7a5a63","filterOpacity":0.35,"blockId":"paid-block-fv-11-esthe-sample"} -->
<div id="paid-block-fv-11-esthe-sample" class="wp-block-wdl-paid-block-fv-11 swiper paid-block-fv-11 init-hide min-h-pc-580px min-h-tb-480px min-h-sp-480px" style="max-width:1200px"><div class="text_in center"><div class="in"><h1 class="ttl"><span class="sub">ESTHETIC</span>  <span class="main">肌の調子は、日によって違う</span></h1><p class="description">その日の肌を見てから内容を決めます。回数券の押し売りはしません。</p></div></div><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/nail_2.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/nail_2.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/nail_2.webp" alt="施術室"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_4.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_4.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_4.webp" alt="待合"/></picture></div><div class="image_filter" style="background-color:#7a5a63;opacity:0.35"></div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><script type="text/javascript">
(function(){
const selector = "#paid-block-fv-11-esthe-sample";
const MAX_RETRY = 30; // 30 × 150ms = 4.5s
let retry = 0;

const initSwiper = () => {
    if ( typeof Swiper === "undefined" ) return false;
    const already = document.querySelector(selector).swiper;
    if ( already ) return true; // 二重初期化しない

    const config = {
        loop: true,
        effect: "slide",
        speed: 1000,
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
                    #paid-block-fv-11-esthe-sample .swiper-pagination-bullet { background-color:#ffffff; }
                    #paid-block-fv-11-esthe-sample .swiper-button-next,
                    #paid-block-fv-11-esthe-sample .swiper-button-prev { color:#ffffff; }
                </style><noscript><style>#paid-block-fv-11-esthe-sample{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-11 -->
