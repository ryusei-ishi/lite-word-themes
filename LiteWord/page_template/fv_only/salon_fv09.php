<!-- wp:wdl/paid-block-fv-9 {"slides":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_1.webp","spImgUrl":"","altText":"店内の様子","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp","spImgUrl":"","altText":"シャンプースペース","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_3.webp","spImgUrl":"","altText":"道具","linkUrl":""}],"autoplayDelay":4500,"blockId":"paid-block-fv-9-salon-sample"} -->
<div id="paid-block-fv-9-salon-sample" class="wp-block-wdl-paid-block-fv-9 swiper paid-block-fv-9 max-w init-hide" style="max-width:100vw"><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_1.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_1.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_1.webp" alt="店内の様子"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_2.webp" alt="シャンプースペース"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_3.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_3.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/salon_3.webp" alt="道具"/></picture></div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><script type="text/javascript">
(function(){
const selector = "#paid-block-fv-9-salon-sample";
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
                    #paid-block-fv-9-salon-sample .swiper-pagination-bullet { background-color:#ffffff; }
                    #paid-block-fv-9-salon-sample .swiper-button-next,
                    #paid-block-fv-9-salon-sample .swiper-button-prev { color:#ffffff; }
                </style><noscript><style>#paid-block-fv-9-salon-sample{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-9 -->
