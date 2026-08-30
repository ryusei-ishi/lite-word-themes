<!-- wp:wdl/paid-block-fv-11 {"slides":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/reform_1.webp","spImgUrl":"","altText":"内装をやり直した部屋","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_1.webp","spImgUrl":"","altText":"和室のある住まい","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_3.webp","spImgUrl":"","altText":"職人の手仕事","linkUrl":""}],"autoplayDelay":5000,"minHeightPc":"min-h-pc-580px","minHeightTb":"min-h-tb-480px","minHeightSp":"min-h-sp-480px","subTitle":"RENOVATION","mainTitle":"住みながら、変えていく","descriptionText":"暮らしを止めずに進める工程を組みます。水回りだけ、1部屋だけでもご相談ください。","buttonLabel":"施工事例を見る","blockId":"paid-block-fv-11-reform-sample"} -->
<div id="paid-block-fv-11-reform-sample" class="wp-block-wdl-paid-block-fv-11 swiper paid-block-fv-11 max-w init-hide min-h-pc-580px min-h-tb-480px min-h-sp-480px" style="max-width:100vw"><div class="text_in center"><div class="in"><h1 class="ttl"><span class="sub">RENOVATION</span>  <span class="main">住みながら、変えていく</span></h1><p class="description">暮らしを止めずに進める工程を組みます。水回りだけ、1部屋だけでもご相談ください。</p><span class="cta_btn"><a href="#" class="btn_link"><span>施工事例を見る</span></a></span></div></div><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/reform_1.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/reform_1.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/reform_1.webp" alt="内装をやり直した部屋"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_1.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_1.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_1.webp" alt="和室のある住まい"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_3.webp" media="(max-width:800px)"/><source srcSet="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_3.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/fv/koumuten_3.webp" alt="職人の手仕事"/></picture></div><div class="image_filter" style="background-color:#000000;opacity:0.6"></div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><script type="text/javascript">
(function(){
const selector = "#paid-block-fv-11-reform-sample";
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
                    #paid-block-fv-11-reform-sample .swiper-pagination-bullet { background-color:#ffffff; }
                    #paid-block-fv-11-reform-sample .swiper-button-next,
                    #paid-block-fv-11-reform-sample .swiper-button-prev { color:#ffffff; }
                </style><noscript><style>#paid-block-fv-11-reform-sample{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-11 -->
