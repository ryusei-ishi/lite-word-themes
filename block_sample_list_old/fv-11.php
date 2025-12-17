<!-- wp:wdl/paid-block-fv-11 {"blockId":"paid-block-fv-11-1749469789802-502","className":"min-h-sp-280px"} -->
<div id="paid-block-fv-11-1749469789802-502" class="wp-block-wdl-paid-block-fv-11 swiper paid-block-fv-11 max-w init-hide
  min-h-pc-480px min-h-tb-380px min-h-sp-320px min-h-sp-280px" style="max-width:100vw"><div class="text_in center"><div class="in"><h1 class="ttl"><span class="sub">サブタイトル</span>  <span class="main">メインタイトル</span></h1><p class="description">サブテキストが入ります。ここは任意のテキストを入れてください。</p><span class="cta_btn"><a href="#" class="btn_link"><span>ボタンテキスト</span></a></span></div></div><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcset="https://lite-word.com/sample_img/shop/6.webp" media="(max-width:800px)"/><source srcset="https://lite-word.com/sample_img/shop/6.webp" media="(min-width:801px)"/><img src="https://lite-word.com/sample_img/shop/6.webp" alt="スライド1のalt"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcset="https://lite-word.com/sample_img/shop/2.webp" media="(max-width:800px)"/><source srcset="https://lite-word.com/sample_img/shop/2.webp" media="(min-width:801px)"/><img src="https://lite-word.com/sample_img/shop/2.webp" alt="スライド2のalt"/></picture></div><div class="image_filter" style="background-color:#000000;opacity:0.6"></div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><script type="text/javascript">
(function(){
    const selector = "#paid-block-fv-11-1749469789802-502";
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
                delay: 3000,
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
                        #paid-block-fv-11-1749469789802-502 .swiper-pagination-bullet { background-color:#ffffff; }
                        #paid-block-fv-11-1749469789802-502 .swiper-button-next,
                        #paid-block-fv-11-1749469789802-502 .swiper-button-prev { color:#ffffff; }
                    </style><noscript><style>#paid-block-fv-11-1749469789802-502{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-11 -->