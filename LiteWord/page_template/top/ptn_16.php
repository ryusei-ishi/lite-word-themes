<!-- wp:wdl/paid-block-fv-9 {"blockId":"paid-block-fv-9-1744201568160-2689","slides":[{"pcImgUrl":"https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_top5.svg","spImgUrl":"https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_SPtop6.svg","altText":"スライド1のalt","linkUrl":""},{"pcImgUrl":"https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_top7.svg","spImgUrl":"https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_SPtop8.svg","altText":"スライド2のalt","linkUrl":""}]} -->
<div id="paid-block-fv-9-1744201568160-2689" class="wp-block-wdl-paid-block-fv-9 swiper paid-block-fv-9 max-w init-hide" style="max-width:100vw"><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcset="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_SPtop6.svg" media="(max-width:800px)"/><source srcset="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_top5.svg" media="(min-width:801px)"/><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_top5.svg" alt="スライド1のalt"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcset="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_SPtop8.svg" media="(max-width:800px)"/><source srcset="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_top7.svg" media="(min-width:801px)"/><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal_top7.svg" alt="スライド2のalt"/></picture></div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><script type="text/javascript">
(function(){
    const selector = "#paid-block-fv-9-1744201568160-2689";
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
                        #paid-block-fv-9-1744201568160-2689 .swiper-pagination-bullet { background-color:#ffffff; }
                        #paid-block-fv-9-1744201568160-2689 .swiper-button-next,
                        #paid-block-fv-9-1744201568160-2689 .swiper-button-prev { color:#ffffff; }
                    </style><noscript><style>#paid-block-fv-9-1744201568160-2689{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-9 -->

<!-- wp:wdl/lw-space-1 {"spHeight":0} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:80px"></div><div class="tb" style="height:64px"></div><div class="sp" style="height:0px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022\u003eこのようなお悩みありませんか？\u003c/span\u003e","subTitle":"ご相談前の不安や疑問にも、丁寧にお応\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings lh-2\u0022\u003eえします。まずはお気軽にお話しください。\u003c/span\u003e","className":"lw_pc_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_pc_only"><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">このようなお悩みありませんか？</span></span><span class="sub">ご相談前の不安や疑問にも、丁寧にお応<span data-lw_font_set="" class="custom-font-settings custom-font-settings lh-2">えします。まずはお気軽にお話しください。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1\u0022\u003e\u003cmark style=\u0022background-color:rgba(0, 0, 0, 0)\u0022 class=\u0022has-inline-color has-white-color\u0022\u003eこのようなお悩みありませんか？\u003c/mark\u003e\u003c/span\u003e","subTitle":"ご相談前の不安や疑問\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings ls-0\u0022\u003eにも、丁寧にお応えします。\u003cbr\u003eまずはお気軽にお話しください。\u003c/span\u003e","className":"lw_sp_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_sp_only"><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-white-color">このようなお悩みありませんか？</mark></span></span><span class="sub">ご相談前の不安や疑問<span data-lw_font_set="" class="custom-font-settings custom-font-settings ls-0">にも、丁寧にお応えします。<br>まずはお気軽にお話しください。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/paid-block-content-7 {"imageBorderRadius":0,"titleBorderRadius":0} -->
<div class="wp-block-wdl-paid-block-content-7 paid-block-content-7"><ul class="paid-block-content-7__inner"><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal4.png" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:0px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">契約書の内容が不安</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">取引先との契約書に不利な内容が含まれていないか心配…。法律の専門家が適正な内容かどうかを確認し、必要な修正をご提案します。</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal6.png" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:0px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">取引先とのトラブル予防</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">今後の取引で万が一のトラブルが起きないよう、事前にリスクを把握して備えておきたい。交渉や契約内容の整備までしっかりサポートします。</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal3.png" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:0px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">相続手続きに困っている</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">相続手続きを進めたいが、何から手をつけてよいのかわからない…。複雑な手続きも弁護士がわかりやすくサポートします。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-content-7 -->

<!-- wp:wdl/paid-block-content-7 {"imageBorderRadius":0,"titleBorderRadius":0} -->
<div class="wp-block-wdl-paid-block-content-7 paid-block-content-7"><ul class="paid-block-content-7__inner"><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal8.png" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:0px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">未払い金を回収したい</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">取引先からの売掛金や未払い金の回収に悩んでいる…。適切な法的手段を検討し、スムーズな解決をサポートいたします。</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal7.png" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:0px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">離婚を考えているが不安</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">離婚の話し合いや、今後の生活設計に不安がある…。あなたの立場に寄り添い、最適な解決策をご一緒に考えます。</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal2.png" alt=""/><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:0px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">労務トラブルに対応したい</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">従業員とのトラブルや労務管理で不安を抱えている。早めの相談がトラブル回避につながります。企業法務の実績豊富な弁護士が対応します。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-content-7 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":10} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:10px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022\u003e選ばれる\u003c/span\u003e\u003cspan class=\u0022custom-font-settings custom-font-settings fs-1-1\u0022 data-lw_font_set=\u0022\u0022\u003e\u003cmark style=\u0022background-color:rgba(0, 0, 0, 0);color:#002f5f\u0022 class=\u0022has-inline-color\u0022\u003e６\u003c/mark\u003e\u003c/span\u003e\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022\u003eつの理由\u003c/span\u003e","subTitle":"\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings fs-1 lh-2\u0022\u003e豊富な経験と的確な対応で、安心してご相談いただけます。\u003c/span\u003e","className":"lw_pc_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_pc_only"><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">選ばれる</span><span class="custom-font-settings custom-font-settings fs-1-1" data-lw_font_set=""><mark style="background-color:rgba(0, 0, 0, 0);color:#002f5f" class="has-inline-color">６</mark></span><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">つの理由</span></span><span class="sub"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-1 lh-2">豊富な経験と的確な対応で、安心してご相談いただけます。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1\u0022 data-lw_font_set=\u0022\u0022\u003e\u003cmark style=\u0022background-color:rgba(0, 0, 0, 0)\u0022 class=\u0022has-inline-color has-white-color\u0022\u003e選ばれる６つの理由\u003c/mark\u003e\u003c/span\u003e","subTitle":"豊富な\u003cspan class=\u0022custom-font-settings custom-font-settings fs-1 lh-2\u0022 data-lw_font_set=\u0022\u0022\u003e経験と的確な対応で、安心してご相談いただけます。\u003c/span\u003e","className":"lw_sp_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_sp_only"><span class="main"><span class="custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1" data-lw_font_set=""><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-white-color">選ばれる６つの理由</mark></span></span><span class="sub">豊富な<span class="custom-font-settings custom-font-settings fs-1 lh-2" data-lw_font_set="">経験と的確な対応で、安心してご相談いただけます。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/paid-block-lw-step-6 -->
<div class="wp-block-wdl-paid-block-lw-step-6 paid-block-lw-step-6"><ul class="paid-block-lw-step-6__inner"><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>1</span></div><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">幅広い分野に対応</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">企業法務、相続、離婚、労務問題など、法人・個人問わず幅広い分野のご相談に対応しています。ワンストップで対応できる総合力が当事務所の強みです。</p></div></li><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>2</span></div><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">迅速な対応</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">法律問題はスピードが求められる場面も多くあります。当事務所では、ご相談から解決まで迅速に対応し、お客様の不安を早期に解消いたします。</p></div></li><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>3</span></div><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">豊富な相談実績</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">累計1,200件以上の相談実績に裏打ちされた経験と知見を活かし、最適な解決策をご提案します。初めての方も安心してご相談ください</p></div></li><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>4</span></div><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">明確な料金体系</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">ご相談の前に料金についても明確にご案内いたします。納得した上でご依頼いただけるよう、費用面でも安心いただける体制を整えています。</p></div></li><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>5</span></div><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">わかりやすい説明</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">法律用語や手続きは難しく感じられるもの。当事務所では、どなたにも分かりやすい言葉で丁寧にご説明し、納得した上で進めていただけることを大切にしています。</p></div></li><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>6</span></div><div class="link"><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">信頼と親身な対応</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">一人ひとりのお悩みにしっかり耳を傾け、親身になって対応することを大切にしています。安心してご相談いただける、信頼関係を築ける事務所を目指しています。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-lw-step-6 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":20} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:20px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022\u003e解決事例のご紹介\u003c/span\u003e","subTitle":"\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings lh-2\u0022\u003eご相談いただいたさまざまな事例の中から、解決事例の一部をご紹介します。\u003c/span\u003e","className":"lw_pc_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_pc_only"><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">解決事例のご紹介</span></span><span class="sub"><span data-lw_font_set="" class="custom-font-settings custom-font-settings lh-2">ご相談いただいたさまざまな事例の中から、解決事例の一部をご紹介します。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1\u0022 data-lw_font_set=\u0022\u0022\u003e\u003cmark style=\u0022background-color:rgba(0, 0, 0, 0)\u0022 class=\u0022has-inline-color has-white-color\u0022\u003e解決事例のご紹介\u003c/mark\u003e\u003c/span\u003e","subTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings lh-2\u0022 data-lw_font_set=\u0022\u0022\u003eご相談いただいたさまざまな事例の中から、解決事例の一部をご紹介します。\u003c/span\u003e","className":"lw_sp_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_sp_only"><span class="main"><span class="custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1" data-lw_font_set=""><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-white-color">解決事例のご紹介</mark></span></span><span class="sub"><span class="custom-font-settings custom-font-settings lh-2" data-lw_font_set="">ご相談いただいたさまざまな事例の中から、解決事例の一部をご紹介します。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">契約書見直しで安心取引</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">取引先との契約締結前に契約書のチェックをご依頼いただきました。複数のリスク要因を事前に把握し、内容の修正を行ったことで将来的なトラブルを未然に防ぐことができました</p>
<!-- /wp:paragraph -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":20} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:20px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-button-01 {"fontSize":97,"maxWidth":208,"backgroundColor":"#002f5f","className":"lw_pc_only"} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-M align-center align-sp-center lw_pc_only" style="margin-top:10px;margin-bottom:10px"><a href="" style="max-width:208px;font-size:97%;background-color:#002f5f;color:#ffffff;padding:0.9em 1.4em;text-align:center;text-decoration:none;border-radius:0px;border-width:0px;border-style:none;border-color:#000000">もっと見る</a></div>
<!-- /wp:wdl/lw-button-01 -->

<!-- wp:wdl/lw-button-01 {"fontSize":97,"maxWidth":208,"backgroundColor":"#ffffff","textColor":"#002f5f","innerPaddingSize":"S","borderWidth":1,"borderColor":"#002f5f","className":"lw_sp_only"} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-M align-center align-sp-center lw_sp_only" style="margin-top:10px;margin-bottom:10px"><a href="" style="max-width:208px;font-size:97%;background-color:#ffffff;color:#002f5f;padding:0.7em 1em;text-align:center;text-decoration:none;border-radius:0px;border-width:1px;border-style:solid;border-color:#002f5f">もっと見る</a></div>
<!-- /wp:wdl/lw-button-01 --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">複雑な相続問題を解決</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">相続人が多数いる複雑な相続案件でご相談いただきました。調整役として関係者間の意見を整理し、法的に正当な分割案を提案。スムーズに相続手続きを完了させました。</p>
<!-- /wp:paragraph -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":20} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:20px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-button-01 {"fontSize":97,"maxWidth":208,"backgroundColor":"#002f5f","className":"lw_pc_only"} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-M align-center align-sp-center lw_pc_only" style="margin-top:10px;margin-bottom:10px"><a href="" style="max-width:208px;font-size:97%;background-color:#002f5f;color:#ffffff;padding:0.9em 1.4em;text-align:center;text-decoration:none;border-radius:0px;border-width:0px;border-style:none;border-color:#000000">もっと見る</a></div>
<!-- /wp:wdl/lw-button-01 -->

<!-- wp:wdl/lw-button-01 {"fontSize":97,"maxWidth":208,"backgroundColor":"#ffffff","textColor":"#002f5f","innerPaddingSize":"S","borderWidth":1,"borderColor":"#002f5f","className":"lw_sp_only"} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-M lw_sp_only" style="justify-content:center;margin-top:10px;margin-bottom:10px"><a href="" style="max-width:208px;font-size:97%;background-color:#ffffff;color:#002f5f;padding:0.7em 1em;text-align:center;text-decoration:none;border-radius:0px;border-width:1px;border-style:solid;border-color:#002f5f">もっと見る</a></div>
<!-- /wp:wdl/lw-button-01 --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">未払い金の回収に成功</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">取引先からの売掛金が長期間未払いとなっている件でご相談いただきました。内容証明郵送・法的手続きを適切に進めたことで全額回収に成功。ご依頼者様に安心していただけました。</p>
<!-- /wp:paragraph -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":20} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:20px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-button-01 {"fontSize":97,"maxWidth":208,"backgroundColor":"#002f5f","className":"lw_pc_only"} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-M align-center align-sp-center lw_pc_only" style="margin-top:10px;margin-bottom:10px"><a href="" style="max-width:208px;font-size:97%;background-color:#002f5f;color:#ffffff;padding:0.9em 1.4em;text-align:center;text-decoration:none;border-radius:0px;border-width:0px;border-style:none;border-color:#000000">もっと見る</a></div>
<!-- /wp:wdl/lw-button-01 -->

<!-- wp:wdl/lw-button-01 {"fontSize":97,"maxWidth":208,"backgroundColor":"#ffffff","textColor":"#002f5f","innerPaddingSize":"S","borderWidth":1,"borderColor":"#002f5f","className":"lw_sp_only"} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-M align-center align-sp-center lw_sp_only" style="margin-top:10px;margin-bottom:10px"><a href="" style="max-width:208px;font-size:97%;background-color:#ffffff;color:#002f5f;padding:0.7em 1em;text-align:center;text-decoration:none;border-radius:0px;border-width:1px;border-style:solid;border-color:#002f5f">もっと見る</a></div>
<!-- /wp:wdl/lw-button-01 --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":10} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:10px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-message-1 {"leadText":"\u003cspan class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022 data-lw_font_set=\u0022\u0022\u003e豊富な経験と専門知識を持つ弁護士が、\u003c/span\u003e\u003cbr\u003e\u003cspan class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022 data-lw_font_set=\u0022\u0022\u003eあなたのお悩みに丁寧に寄り添います\u003c/span\u003e","bodyText":"【専門分野】\u003cbr\u003e企業法務 / 契約書作成・リーガルチェック / 労務問題 / 相続 / 離婚・家族問題\u003cbr\u003e【略歴】弁護士歴15年\u003cbr\u003e〇〇大学法学部卒業\u003cbr\u003e〇〇年 弁護士登録\u003cbr\u003e〇〇法律事務所勤務を経て、現在に至る\u003cbr\u003e【メッセージ】\u003cbr\u003e「法律問題は、どんな方でも最初は不安が大きいものです。まずはじっくりお話を伺い、安心していただけるよう心がけています。皆さまのお力になれるよう誠心誠意対応いたします。」","imgUrl":"https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal10.png","captionSub":"弁護士／代表","captionMain":"\u003cstrong\u003e髙橋 太郎\u003c/strong\u003e"} -->
<div class="wp-block-wdl-lw-message-1 lw-message-1"><div class="lw-message-1__wrap" style="max-width:px"><div class="text__in"><h3 class="title"><div class="sub" style="color:var(--color-main)">message</div><div class="main">代表あいさつ</div></h3><p class="lead" style="color:var(--color-main)"><span class="custom-font-settings custom-font-settings fs-0-8" data-lw_font_set="">豊富な経験と専門知識を持つ弁護士が、</span><br><span class="custom-font-settings custom-font-settings fs-0-8" data-lw_font_set="">あなたのお悩みに丁寧に寄り添います</span></p><p class="description">【専門分野】<br>企業法務 / 契約書作成・リーガルチェック / 労務問題 / 相続 / 離婚・家族問題<br>【略歴】弁護士歴15年<br>〇〇大学法学部卒業<br>〇〇年 弁護士登録<br>〇〇法律事務所勤務を経て、現在に至る<br>【メッセージ】<br>「法律問題は、どんな方でも最初は不安が大きいものです。まずはじっくりお話を伺い、安心していただけるよう心がけています。皆さまのお力になれるよう誠心誠意対応いたします。」</p></div><div class="image"><figure class="img"><img loading="lazy" src="https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal10.png" alt="代表の写真"/></figure><figcaption class="img_caption"><span class="sub">弁護士／代表</span><span class="main"><strong>髙橋 太郎</strong></span></figcaption></div></div><div class="bg_filter" style="opacity:0.05;background-color:var(--color-main)"></div></div>
<!-- /wp:wdl/lw-message-1 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":20} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:20px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022 data-lw_font_set=\u0022\u0022\u003eお知らせ・コラム\u003c/span\u003e","subTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings lh-2\u0022 data-lw_font_set=\u0022\u0022\u003e\u003cspan class=\u0022custom-font-settings custom-font-settings lh-2\u0022 data-lw_font_set=\u0022\u0022\u003e最新の情報や法律に関するコラムを掲載しています。\u003c/span\u003e\u003c/span\u003e","className":"lw_pc_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_pc_only"><span class="main"><span class="custom-font-settings custom-font-settings fs-0-8" data-lw_font_set="">お知らせ・コラム</span></span><span class="sub"><span class="custom-font-settings custom-font-settings lh-2" data-lw_font_set=""><span class="custom-font-settings custom-font-settings lh-2" data-lw_font_set="">最新の情報や法律に関するコラムを掲載しています。</span></span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1\u0022 data-lw_font_set=\u0022\u0022\u003e\u003cmark style=\u0022background-color:rgba(0, 0, 0, 0)\u0022 class=\u0022has-inline-color has-white-color\u0022\u003eお知らせ・コラム\u003c/mark\u003e\u003c/span\u003e","subTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings lh-2\u0022 data-lw_font_set=\u0022\u0022\u003e最新の情報や法律に関するコラムを掲載しています。\u003c/span\u003e","className":"lw_sp_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_sp_only"><span class="main"><span class="custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1" data-lw_font_set=""><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-white-color">お知らせ・コラム</mark></span></span><span class="sub"><span class="custom-font-settings custom-font-settings lh-2" data-lw_font_set="">最新の情報や法律に関するコラムを掲載しています。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":10} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:10px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-news-list-1 -->
<div class="wp-block-wdl-lw-news-list-1"><div class="news-list-1" data-number="4" data-category="" data-type="post" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="var(--color-main)" data-title-font="Noto Sans JP" data-title-font-weight="400"><ul class="news-list-1__wrap"></ul></div><script>
                        document.addEventListener('DOMContentLoaded', () => {
                            const newsList1Container = document.querySelector('.news-list-1');
                            
                            if (newsList1Container) {
                                const newsList1NumberOfPosts = newsList1Container.getAttribute('data-number') || 4;
                                const newsList1CategoryId = newsList1Container.getAttribute('data-category');
                                const newsList1PostType = newsList1Container.getAttribute('data-type') || 'post';

                                const newsList1DateFont = newsList1Container.getAttribute('data-date-font');
                                const newsList1DateFontWeight = newsList1Container.getAttribute('data-date-font-weight');
                                const newsList1CatFont = newsList1Container.getAttribute('data-cat-font');
                                const newsList1CatFontWeight = newsList1Container.getAttribute('data-cat-font-weight');
                                const newsList1CatBgColor = newsList1Container.getAttribute('data-cat-bg-color');
                                const newsList1TitleFont = newsList1Container.getAttribute('data-title-font');
                                const newsList1TitleFontWeight = newsList1Container.getAttribute('data-title-font-weight');

                                let newsList1ApiUrl = `${MyThemeSettings.home_Url}/wp-json/wp/v2/${newsList1PostType === 'post' ? 'posts' : newsList1PostType}?per_page=${newsList1NumberOfPosts}&orderby=date&order=desc&_embed`;
                                if (newsList1CategoryId) {
                                    newsList1ApiUrl += `&categories=${newsList1CategoryId}`;
                                }

                                fetch(newsList1ApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('投稿の取得に失敗しました');
                                        }
                                        return response.json();
                                    })
                                    .then(posts => {
                                        let newsList1Html = '<ul class="news-list-1__wrap">';

                                        posts.forEach(post => {
                                            const newsList1Date = new Date(post.date).toLocaleDateString();
                                            const newsList1Title = post.title.rendered;
                                            const newsList1Link = post.link;
                                            const newsList1Category = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
                                                ? post._embedded['wp:term'][0][0].name
                                                : 'カテゴリーなし';

                                            newsList1Html += `
                                                <li>
                                                    <a href="${newsList1Link}">
                                                        <div class="data">
                                                            <div class="date" style="font-weight: ${newsList1DateFontWeight};" data-lw_font_set="${newsList1DateFont}">
                                                                <span>${newsList1Date}</span>
                                                            </div>
                                                            <div class="cat" style="background-color: ${newsList1CatBgColor}; font-weight: ${newsList1CatFontWeight};" data-lw_font_set="${newsList1CatFont}">
                                                                <span>${newsList1Category}</span>
                                                            </div>
                                                        </div>
                                                        <div class="post_title">
                                                            <h3 style="font-weight: ${newsList1TitleFontWeight};" data-lw_font_set="${newsList1TitleFont}">${newsList1Title}</h3>
                                                        </div>
                                                    </a>
                                                </li>
                                            `;
                                        });

                                        newsList1Html += '</ul>';
                                        newsList1Container.innerHTML = newsList1Html;
                                    })
                                    .catch(error => {
                                        console.error('投稿を取得できませんでした:', error);
                                        newsList1Container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
                                    });
                            }
                        });
                        </script></div>
<!-- /wp:wdl/lw-news-list-1 -->

<!-- wp:wdl/lw-button-01 {"fontSize":97,"maxWidth":208,"backgroundColor":"#ffffff","textColor":"#002f5f","alignment":"flex-end","borderWidth":1,"borderColor":"#002f5f"} -->
<div class="wp-block-wdl-lw-button-01 wp-block-wdl-button-01 padding-M align-flex-end align-sp-center" style="margin-top:10px;margin-bottom:10px"><a href="" style="max-width:208px;font-size:97%;background-color:#ffffff;color:#002f5f;padding:0.9em 1.4em;text-align:center;text-decoration:none;border-radius:0px;border-width:1px;border-style:solid;border-color:#002f5f">お知らせ一覧</a></div>
<!-- /wp:wdl/lw-button-01 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":15} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:15px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan data-lw_font_set=\u0022\u0022 class=\u0022custom-font-settings custom-font-settings fs-0-8\u0022\u003eご相談から解決までの流れ\u003c/span\u003e","subTitle":"初めての方にもわかりやすく\u003cspan class=\u0022custom-font-settings custom-font-settings lh-2\u0022 data-lw_font_set=\u0022\u0022\u003eご案内いたします。\u003c/span\u003e","className":"lw_pc_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_pc_only"><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">ご相談から解決までの流れ</span></span><span class="sub">初めての方にもわかりやすく<span class="custom-font-settings custom-font-settings lh-2" data-lw_font_set="">ご案内いたします。</span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/custom-title-2 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1\u0022 data-lw_font_set=\u0022\u0022\u003e\u003cmark style=\u0022background-color:rgba(0, 0, 0, 0)\u0022 class=\u0022has-inline-color has-white-color\u0022\u003eご相談から解決までの流れ\u003c/mark\u003e\u003c/span\u003e","subTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings lh-2\u0022 data-lw_font_set=\u0022\u0022\u003e初めての方にもわかりやすく\u003cspan class=\u0022custom-font-settings custom-font-settings lh-2\u0022 data-lw_font_set=\u0022\u0022\u003eご案内いたします\u003c/span\u003e\u003c/span\u003e","className":"lw_sp_only"} -->
<h2 class="wp-block-wdl-custom-title-2 custom-title-2 left lw_sp_only"><span class="main"><span class="custom-font-settings custom-font-settings fs-0-5 ls-0-06 u-line-3-color_1" data-lw_font_set=""><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-white-color">ご相談から解決までの流れ</mark></span></span><span class="sub"><span class="custom-font-settings custom-font-settings lh-2" data-lw_font_set="">初めての方にもわかりやすく<span class="custom-font-settings custom-font-settings lh-2" data-lw_font_set="">ご案内いたします</span></span></span></h2>
<!-- /wp:wdl/custom-title-2 -->

<!-- wp:wdl/paid-block-lw-step-5 {"ulMaxWidth":1029} -->
<div class="wp-block-wdl-paid-block-lw-step-5 paid-block-lw-step-5 font_size_m"><ul class="lw-step__inner" style="max-width:1029px"><li class="lw-step__li" style="border-width:0px;border-style:solid;border-color:var(--color-main);box-shadow:0 0 6px rgba(0, 0, 0, 0.16)"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">1</div><div class="lw-step__li_in"><h3 class="lw-step__li_title ttl" data-lw_font_set="" style="font-weight:">お問い合わせ・ご予約</h3><p class="lw-step__li_text" data-lw_font_set="" style="font-weight:">まずはお電話またはお問い合わせフォームよりご連絡ください。初回相談の日程を調整いたします。</p></div></li><li class="lw-step__li" style="border-width:0px;border-style:solid;border-color:var(--color-main);box-shadow:0 0 6px rgba(0, 0, 0, 0.16)"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">2</div><div class="lw-step__li_in"><h3 class="lw-step__li_title ttl" data-lw_font_set="" style="font-weight:">無料相談・ヒアリング</h3><p class="lw-step__li_text" data-lw_font_set="" style="font-weight:">弁護士がご相談内容を丁寧にお伺いします。現状やご希望を踏まえた対応方針をご提案いたします。</p></div></li><li class="lw-step__li" style="border-width:0px;border-style:solid;border-color:var(--color-main);box-shadow:0 0 6px rgba(0, 0, 0, 0.16)"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">3</div><div class="lw-step__li_in"><h3 class="lw-step__li_title ttl" data-lw_font_set="" style="font-weight:">ご契約・対応開始</h3><p class="lw-step__li_text" data-lw_font_set="" style="font-weight:">ご提案内容にご納得いただいた上で、ご契約後に具体的な対応を進めます。費用についても事前にご案内いたします。</p></div></li><li class="lw-step__li" style="border-width:0px;border-style:solid;border-color:var(--color-main);box-shadow:0 0 6px rgba(0, 0, 0, 0.16)"><div class="lw-step__li_no" data-lw_font_set="Murecho" style="font-weight:600;background:var(--color-main)">4</div><div class="lw-step__li_in"><h3 class="lw-step__li_title ttl" data-lw_font_set="" style="font-weight:">解決・アフターサポート</h3><p class="lw-step__li_text" data-lw_font_set="" style="font-weight:">問題解決まで責任を持って対応いたします。必要に応じてアフターサポートもご提供しています。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-lw-step-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":30,"tbHeight":22,"spHeight":10} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:30px"></div><div class="tb" style="height:22px"></div><div class="sp" style="height:10px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/cta-2 {"backgroundImage":"https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal9.png","buttonBackgroundColor":"#002f5f","selectedIcon":"\u003csvg xmlns=\u0022http://www.w3.org/2000/svg\u0022 viewBox=\u00220 0 512 512\u0022\u003e\u003c!\u002d\u002d!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.\u002d\u002d\u003e\u003cpath d=\u0022M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\u0022/\u003e\u003c/svg\u003e","className":"cta-2"} -->
<div class="wp-block-wdl-cta-2  cta-2"><div class="cta-2" style="background-image:url(https://lite-word.com/wp-content/uploads/2025/06/LiteWord_legal9.png)"><div class="cta-2__wrap"><h2 class="title"><span class="custom-font-settings custom-font-settings fs-1-2 mb-0-5" data-lw_font_set="">無料相談・お問合わせ</span><br><span class="custom-font-settings custom-font-settings fs-0-5" data-lw_font_set="">どうぞお気軽にご相談ください。</span><span class="lw-br on_600px"></span><span class="custom-font-settings custom-font-settings fs-0-5" data-lw_font_set="">初回相談は無料で承っております。</span><br><br><span class="custom-font-settings custom-font-settings fs-0-5" data-lw_font_set="">ご相談内容は秘密厳守いたします。</span></h2><p class="address">〒110-0000 東京都豊島区池袋0-0-0<span class="lw-br on_600px"></span>／TEL. 042-000-0000／FAX. 042-000-0001</p><nav><a href="tel:042-000-0000" class="tel" data-lw_font_set="Roboto"><div class="no"><div class="small">TEL:</div><div class="big">042-000-0000</div></div><p class="tel_text">（受付時間／9:00～17:00 第2・第4土曜、日祝休業）</p></a><a href="mailto:info@example.com" class="mail" style="background-color:#002f5f;color:#ffffff"><div class="icon" style="fill:#ffffff"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></div><div class="mail_text">無料相談を申し込む</div></a></nav></div><div class="bg_filter" style="background-color:rgba(0, 0, 0, 0.5)"></div></div></div>
<!-- /wp:wdl/cta-2 -->