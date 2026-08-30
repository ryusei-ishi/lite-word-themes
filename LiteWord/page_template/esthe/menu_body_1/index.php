<!-- wp:wdl/paid-block-fv-11 {"blockId":"fvbody","slides":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/fv_body.webp","spImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/fv_body.webp","imgAlt":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_waist.webp","spImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_waist.webp","imgAlt":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_legs.webp","spImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_legs.webp","imgAlt":""}],"autoplayDelay":4500,"showNavigation":false,"minHeightTb":"min-h-tb-400px","subTitle":"BODY SLIMMING","mainTitle":"池袋の痩身エステ\u003cbr\u003eお腹まわり・脚のむくみに","descriptionText":"毎回その場で測って、数値の変化をお見せします。","buttonLabel":"","showCtaButton":false,"filterColor":"var(\u002d\u002dcolor-main)","filterOpacity":0.42} -->
<div id="fvbody" class="wp-block-wdl-paid-block-fv-11 swiper paid-block-fv-11 max-w init-hide min-h-pc-480px min-h-tb-400px min-h-sp-320px" style="max-width:100vw"><div class="text_in center"><div class="in"><h1 class="ttl"><span class="sub">BODY SLIMMING</span>  <span class="main">池袋の痩身エステ<br>お腹まわり・脚のむくみに</span></h1><p class="description">毎回その場で測って、数値の変化をお見せします。</p></div></div><div class="swiper-wrapper"><div class="swiper-slide"><picture class="bg_img"><source srcset="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/fv_body.webp" media="(max-width:800px)"/><source srcset="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/fv_body.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/fv_body.webp"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcset="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_waist.webp" media="(max-width:800px)"/><source srcset="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_waist.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_waist.webp"/></picture></div><div class="swiper-slide"><picture class="bg_img"><source srcset="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_legs.webp" media="(max-width:800px)"/><source srcset="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_legs.webp" media="(min-width:801px)"/><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_legs.webp"/></picture></div><div class="image_filter" style="background-color:var(--color-main);opacity:0.42"></div></div><div class="swiper-pagination"></div><script type="text/javascript">
(function(){
const selector = "#fvbody";
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
                    #fvbody .swiper-pagination-bullet { background-color:#ffffff; }
                    #fvbody .swiper-button-next,
                    #fvbody .swiper-button-prev { color:#ffffff; }
                </style><noscript><style>#fvbody{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-fv-11 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">こんなお悩みはありませんか</span>","subTitle":"体重より、見た目のラインを変えたい方に向いています。"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">体重より、見た目のラインを変えたい方に向いています。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">こんなお悩みはありませんか</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-list-4 {"bgColor":"#ffffff"} -->
<div class="wp-block-wdl-lw-list-4 lw-list-4"><ul class="lw-list-4__inner clm_1 " style="border-color:var(--color-main);border-width:2px;border-style:solid;border-radius:0.5em;max-width:800px;background-color:#ffffff"><li class="lw-list-4__li size_m"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="fill:var(--color-main)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-4__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">体重は変わらないのに、お腹まわりだけ落ちない</p></span></li><li class="lw-list-4__li size_m"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="fill:var(--color-main)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-4__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">夕方になると脚がだるくて、靴がきつくなる</p></span></li><li class="lw-list-4__li size_m"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="fill:var(--color-main)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-4__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">運動する時間が取れず、何年も同じ体型のまま</p></span></li><li class="lw-list-4__li size_m"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="fill:var(--color-main)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-4__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">食事を減らすと顔からやせて、疲れて見える</p></span></li><li class="lw-list-4__li size_m"><span class="icon" style="width:1.2em"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="fill:var(--color-main)"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-4__text"><p data-lw_font_set="" style="width:calc(100% - 1.2em)">自分で測っても、変わっているのか分からない</p></span></li></ul></div>
<!-- /wp:wdl/lw-list-4 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">数字でお見せします</span>","subTitle":"毎回、施術の前後に同じ場所を測ってお伝えします。"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">毎回、施術の前後に同じ場所を測ってお伝えします。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">数字でお見せします</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/paid-block-content-7 -->
<div class="wp-block-wdl-paid-block-content-7 paid-block-content-7"><ul class="paid-block-content-7__inner"><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_waist.webp" alt=""><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">ウエスト 平均 -4.2cm</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">1回目の施術前後で測った平均です（当サロン調べ・60分コース）。数字は毎回その場でお伝えし、記録をお渡しします。</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_machine.webp" alt=""><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">温めてから流す</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">固くなった部分を温めてゆるめてから流します。強く揉んで痛い思いをしていただく施術ではありません。</p></div></li><li class="paid-block-content-7__li"><div class="link"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/body_card_legs.webp" alt=""><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">ふくらはぎ 平均 -1.8cm</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">脚は変化が出やすい部位です。むくみが取れると、その日の帰り道から歩きやすさが変わります。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-content-7 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">ご予約の前にご確認ください</span>","subTitle":"安全にお受けいただくために、次に当てはまる方はご相談ください。"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">安全にお受けいただくために、次に当てはまる方はご相談ください。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">ご予約の前にご確認ください</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-list-1 -->
<div class="wp-block-wdl-lw-list-1 lw-list-1"><ul class="lw-list-1_inner"><li class="lw-list-1_content" style="border-color:var(--color-main)"><div class="no" data-lw_font_set="" style="font-weight:;background:var(--color-main)">1</div><div class="lw-list-1_text" data-lw_font_set="" style="font-weight:"><p style="white-space:pre-wrap">妊娠中・授乳中の方（お腹の張りがない時期であればご相談ください）</p></div></li><li class="lw-list-1_content" style="border-color:var(--color-main)"><div class="no" data-lw_font_set="" style="font-weight:;background:var(--color-main)">2</div><div class="lw-list-1_text" data-lw_font_set="" style="font-weight:"><p style="white-space:pre-wrap">心臓疾患・血栓症の治療を受けている方</p></div></li><li class="lw-list-1_content" style="border-color:var(--color-main)"><div class="no" data-lw_font_set="" style="font-weight:;background:var(--color-main)">3</div><div class="lw-list-1_text" data-lw_font_set="" style="font-weight:"><p style="white-space:pre-wrap">施術前後2時間のお食事はお控えください</p></div></li><li class="lw-list-1_content" style="border-color:var(--color-main)"><div class="no" data-lw_font_set="" style="font-weight:;background:var(--color-main)">4</div><div class="lw-list-1_text" data-lw_font_set="" style="font-weight:"><p style="white-space:pre-wrap">施術前後24時間の飲酒・激しい運動はお控えください</p></div></li><li class="lw-list-1_content" style="border-color:var(--color-main)"><div class="no" data-lw_font_set="" style="font-weight:;background:var(--color-main)">5</div><div class="lw-list-1_text" data-lw_font_set="" style="font-weight:"><p style="white-space:pre-wrap">生理中の方（お腹まわりを避けたコースをご案内します）</p></div></li><li class="lw-list-1_content" style="border-color:var(--color-main)"><div class="no" data-lw_font_set="" style="font-weight:;background:var(--color-main)">6</div><div class="lw-list-1_text" data-lw_font_set="" style="font-weight:"><p style="white-space:pre-wrap">金属を体内に入れている方（機器を使わないコースをご案内します）</p></div></li></ul></div>
<!-- /wp:wdl/lw-list-1 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">コースと料金</span>","subTitle":"表示はすべて税込です。追加料金はいただきません。","anchor":"price"} -->
<h2 id="price" class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">表示はすべて税込です。追加料金はいただきません。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">コースと料金</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-table-1 {"headers":[{"text":"所要時間","bgColor":""},{"text":"料金（税込）","bgColor":""},{"text":"こんな方に","bgColor":""}],"rows":[{"header":"初回体験ボディ","cells":[{"content":"60分"},{"content":"5,500円"},{"content":"まずは試してみたい方"}]},{"header":"お腹まわり集中","cells":[{"content":"60分"},{"content":"13,200円"},{"content":"ウエストを絞りたい方"}]},{"header":"脚・むくみケア","cells":[{"content":"60分"},{"content":"11,000円"},{"content":"夕方の脚のだるさに"}]},{"header":"全身ボディ","cells":[{"content":"90分"},{"content":"19,800円"},{"content":"全体のラインを整えたい方"}]},{"header":"10回チケット","cells":[{"content":"—"},{"content":"118,800円"},{"content":"結果を出しきりたい方"}]}]} -->
<div class="wp-block-wdl-lw-pr-table-1 lw-pr-table-1"><div class="wrap_table" role="table" aria-label="料金プラン比較表" style="--lw-table-radius-size:12px;--lw-table-cell-width-1:200px;--lw-table-cell-width-2:200px;--lw-table-cell-width-3:200px;--lw-table-cell-width-4:200px;--lw-table-cell-width-5:200px;--lw-table-cell-width-6:200px;--lw-table-cell-width-7:200px;--lw-table-cell-width-8:200px;--lw-table-cell-width-1-sp:160px;--lw-table-cell-width-2-sp:160px;--lw-table-cell-width-3-sp:160px;--lw-table-cell-width-4-sp:160px;--lw-table-cell-width-5-sp:160px;--lw-table-cell-width-6-sp:160px;--lw-table-cell-width-7-sp:160px;--lw-table-cell-width-8-sp:160px;--lw-table-gap-size:3px;--lw-table-column-count:4;--lw-table-width:809px;--lw-table-width-sp:649px;--lw-table-font-size-header:17px;--lw-table-font-size-header-sp:16px;--lw-table-font-size-row-header:17px;--lw-table-font-size-row-header-sp:16px;--lw-table-font-size-cell:17px;--lw-table-font-size-cell-sp:16px;--lw-table-line-height-header:1.5;--lw-table-line-height-row-header:1.6;--lw-table-line-height-cell:1.6;--lw-table-row-cell-position-align:center;--lw-table-row-cell-position-justify:center;--lw-table-row-cell-head-position-align:center;--lw-table-row-cell-head-position-justify:center"><div class="lw_table_head" role="row" data-lw_font_set=""><div class="cell none" role="columnheader"></div><div class="cell" role="columnheader" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.5"><span class="text" style="line-height:1.5">所要時間</span></div><div class="cell" role="columnheader" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.5"><span class="text" style="line-height:1.5">料金（税込）</span></div><div class="cell" role="columnheader" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.5"><span class="text" style="line-height:1.5">こんな方に</span></div></div><div class="lw_table_row first " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">初回体験ボディ</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">60分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">5,500円</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">まずは試してみたい方</span></div></div><div class="lw_table_row  " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">お腹まわり集中</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">60分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">13,200円</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">ウエストを絞りたい方</span></div></div><div class="lw_table_row  " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">脚・むくみケア</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">60分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">11,000円</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">夕方の脚のだるさに</span></div></div><div class="lw_table_row  " role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">全身ボディ</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">90分</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">19,800円</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">全体のラインを整えたい方</span></div></div><div class="lw_table_row  last" role="row"><div class="cell row_head" role="rowheader" data-lw_font_set="" style="background:var(--color-main);color:#ffffff;font-weight:600;line-height:1.6"><span class="text" style="line-height:1.6">10回チケット</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">—</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">118,800円</span></div><div class="cell" role="cell" data-lw_font_set="" style="background:#ffffff;color:#333333;font-weight:400;box-shadow:0 0 3px rgba(37, 37, 37, 0.3);line-height:1.6"><span class="text" style="line-height:1.6">結果を出しきりたい方</span></div></div></div></div>
<!-- /wp:wdl/lw-pr-table-1 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">施術の流れ</span>","subTitle":"初めての方でも迷わないよう、当日の流れをご案内します。"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">初めての方でも迷わないよう、当日の流れをご案内します。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">施術の流れ</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/paid-block-lw-step-6 -->
<div class="wp-block-wdl-paid-block-lw-step-6 paid-block-lw-step-6"><ul class="paid-block-lw-step-6__inner"><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>01</span></div><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none;aspect-ratio:400 / 300"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/step_counseling.webp" alt="" style="object-fit:cover"></div><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">カウンセリングと採寸</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">気になる部位を伺い、その場で採寸します。今日どこまで変えられるかを、はじめにお伝えします。</p></div></li><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>02</span></div><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none;aspect-ratio:400 / 300"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/step_treat_body.webp" alt="" style="object-fit:cover"></div><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">施術</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">温めてゆるめてから流します。強く揉む施術ではないので、眠ってしまう方がほとんどです。</p></div></li><li class="paid-block-lw-step-6__li" style="border-color:#ccc;border-width:1px;border-style:solid;border-radius:0px"><div class="number" style="background-color:var(--color-main);color:#fff;font-weight:700"><span>03</span></div><div class="link"><div class="image" style="border-radius:0px;border-color:var(--color-main);border-width:0;border-style:none;aspect-ratio:400 / 300"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/step_finish.webp" alt="" style="object-fit:cover"></div><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-bottom-color:var(--color-main);border-bottom-width:2px;border-bottom-style:solid">採寸とご説明</h3><p class="paid-block-lw-step-6__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">もう一度同じ場所を測り、変化をお見せします。次までの過ごし方もお伝えします。</p></div></li></ul></div>
<!-- /wp:wdl/paid-block-lw-step-6 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">当日のご準備</span>","subTitle":"手ぶらでお越しいただけます。"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">手ぶらでお越しいただけます。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">当日のご準備</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-list-3 -->
<div class="wp-block-wdl-lw-list-3 lw-list-3"><ul class="lw-list-3__inner"><li class="lw-list-3__li" style="border-color:var(--color-main)"><span class="icon" style="fill:var(--color-main)"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-3__text"><p data-lw_font_set="" style="font-weight:">お着替えはご用意しています</p></span></li><li class="lw-list-3__li" style="border-color:var(--color-main)"><span class="icon" style="fill:var(--color-main)"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-3__text"><p data-lw_font_set="" style="font-weight:">施術後のシャワーは不要です</p></span></li><li class="lw-list-3__li" style="border-color:var(--color-main)"><span class="icon" style="fill:var(--color-main)"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-3__text"><p data-lw_font_set="" style="font-weight:">お食事は施術の2時間前までに</p></span></li><li class="lw-list-3__li" style="border-color:var(--color-main)"><span class="icon" style="fill:var(--color-main)"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></span><span class="lw-list-3__text"><p data-lw_font_set="" style="font-weight:">当日は水分を多めにお取りください</p></span></li></ul></div>
<!-- /wp:wdl/lw-list-3 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">よくあるご質問</span>","subTitle":"痩身について、多くいただくご質問をまとめました。"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">痩身について、多くいただくご質問をまとめました。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">よくあるご質問</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/lw-pr-qa-3 -->
<div class="wp-block-wdl-lw-pr-qa-3 lw-pr-qa-3" style="--qa3-max-w:100%;--qa3-gap:24px;--qa3-label-w:32px;--qa3-q-color:var(--color-main);--qa3-a-color:var(--color-accent);--qa3-line:#e0e0e0;--qa3-label-size-pc:18px;--qa3-label-size-sp:16px;--qa3-q-size-pc:17px;--qa3-q-size-sp:15px;--qa3-a-size-pc:15px;--qa3-a-size-sp:14px"><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">1回で変わりますか。</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">その日のうちにサイズは変わります。ただし戻りやすいので、変化を保ちたい場合は2週間に1回のペースを目安にご提案しています。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">痛くないですか。</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">温めてゆるめてから流すので、強く揉んで痛い思いをしていただくことはありません。力加減はその都度伺います。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">食事制限はありますか。</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">当サロンからお願いすることはありません。ご希望があれば、いまの生活のなかでできることだけをお伝えします。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">体重は落ちますか。</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">お約束はできません。当サロンが数字でお見せするのは体重ではなくサイズです。見た目のラインを変えることを目的にしています。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">服が濡れたりしますか。</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">お着替えをご用意していますので、そのままお帰りいただけます。シャワーも不要です。</p></dd></dl><dl class="qa-3__item"><dt><span class="label" data-lw_font_set="Roboto">Q</span><p class="qa-3__q_text">部位を選べますか。</p></dt><dd><span class="label" data-lw_font_set="Roboto">A</span><p class="qa-3__a_text">選べます。お腹まわりだけ、脚だけ、というご利用がいちばん多いです。</p></dd></dl></div>
<!-- /wp:wdl/lw-pr-qa-3 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/paid-block-voice-2 {"filterColor":"#f3b1b1","voiceThanksFontColor":"#d77575"} -->
<div class="wp-block-wdl-paid-block-voice-2 paid-block-voice-2"><div class="paid-block-voice-2__wrap"><h2 class="ttl"><span class="main">お客様の声</span><span class="sub">voice</span></h2><p class="explanation">痩身をお受けいただいた方から、いただいた声です。</p><ul class="voice_list"><li><div class="image"><div class="in"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/voice_2.webp" alt=""><span class="thanks" data-lw_font_set="Dancing Script" style="font-weight:400;color:#d77575">thank you</span></div></div><div class="text_in"><h3 class="name"><span class="sub" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">豊島区 40代</span><span class="main"><span class="big" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">M</span><span class="small" data-lw_font_set="Noto Sans JP" style="font-weight:500;color:var(--color-black)">さま</span></span></h3><p class="comment" data-lw_font_set="Noto Sans JP" style="font-weight:400;color:var(--color-black)">体重は昔から変わらないのに、お腹だけ落ちませんでした。毎回その場で測ってもらえるので、続ける気になります。3回目でスカートのホックが楽になりました。</p></div></li></ul></div><div class="filter" style="background-color:#f3b1b1;opacity:0.9"></div></div>
<!-- /wp:wdl/paid-block-voice-2 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":56,"tbHeight":45,"spHeight":28} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:56px"></div><div class="tb" style="height:45px"></div><div class="sp" style="height:28px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-5 {"mainTitle":"<span data-lw_font_set=\"\" class=\"custom-font-settings custom-font-settings fs-0-8\">ほかのメニュー</span>","subTitle":"痩身とあわせてご利用いただくことの多いメニューです。"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">痩身とあわせてご利用いただくことの多いメニューです。</span><span class="main"><span data-lw_font_set="" class="custom-font-settings custom-font-settings fs-0-8">ほかのメニュー</span></span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":4,"tbHeight":3,"spHeight":2} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:4px"></div><div class="tb" style="height:3px"></div><div class="sp" style="height:2px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/paid-block-content-7 -->
<div class="wp-block-wdl-paid-block-content-7 paid-block-content-7"><ul class="paid-block-content-7__inner"><li class="paid-block-content-7__li"><a class="link" href="/esthe-menu-lymph/"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/card_lymph.webp" alt=""><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">リンパ・ヘッドスパ</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">眠れない、肩が重いという方に。顔と頭はつながっています。</p></a></li><li class="paid-block-content-7__li"><a class="link" href="/esthe-menu-facial/"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/card_facial.webp" alt=""><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">フェイシャル</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">乾燥・くすみ・毛穴に。肌そのものの力を引き出します。</p></a></li><li class="paid-block-content-7__li"><a class="link" href="/esthe-menu-bridal/"><div class="image" style="border-radius:20px;border-color:var(--color-main);border-width:0;border-style:none"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/card_bridal.webp" alt=""><h3 class="ttl font_size_m" data-lw_font_set="" style="font-weight:600;color:;border-radius:8px;border-bottom-color:var(--color-main);border-bottom-width:8px;border-bottom-style:solid">ブライダル</h3></div><p class="paid-block-content-7__text font_size_m" data-lw_font_set="" style="font-weight:400;color:var(--color-black)">挙式日から逆算してご提案します。背中・二の腕まで。</p></a></li></ul></div>
<!-- /wp:wdl/paid-block-content-7 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":40,"tbHeight":32,"spHeight":20} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:40px"></div><div class="tb" style="height:32px"></div><div class="sp" style="height:20px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/paid-block-cta-3 {"mainTitle":"まずは初回体験から","leadText":"初回体験 60分 5,500円<br>10:00〜19:00（最終受付18:00）／定休日 水曜・第3日曜","listItem1":"完全予約制","listItem2":"完全個室","listItem3":"女性専用","phoneNumber":"042-000-0000","imageUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/card_body.webp","bgColor":"#f6efec","bdColor":"var(--color-main)","tapTelText":"タップで電話がかけられます"} -->
<div class="wp-block-wdl-paid-block-cta-3 paid-block-cta-3"><a class="this_wrap" href="tel:042-000-0000" style="background-color:#f6efec;border-color:var(--color-main)"><div class="text_in"><h2 class="title">まずは初回体験から</h2><p>初回体験 60分 5,500円<br>10:00〜19:00（最終受付18:00）／定休日 水曜・第3日曜</p><ul><li><span>完全予約制</span></li><li><span>完全個室</span></li><li><span>女性専用</span></li></ul><div class="tel"><span data-lw_font_set="Montserrat" style="font-weight:">042-000-0000</span></div></div><div class="image"><img src="https://liteword-assets.bigi-ishikawa.workers.dev/t/esthe/card_body.webp" alt="CTA画像" class="object_fit_cover object_position_center"/></div></a><div class="tap_tel"><p>タップで電話がかけられます</p></div><style>
                        @container (max-width: 700px) {
                            .paid-block-cta-3 .this_wrap h2.title  {
                                background-color: var(--color-main) !important;
                            }
                        }
                    
                    </style></div>
<!-- /wp:wdl/paid-block-cta-3 -->