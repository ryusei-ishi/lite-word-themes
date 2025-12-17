<!-- wp:wdl/paid-block-voice-3 {"blockId":"paid-block-voice-3-56a651be-bff3-4d98-8fb2-e1674fcd18dc"} -->
<div id="paid-block-voice-3-56a651be-bff3-4d98-8fb2-e1674fcd18dc" class="wp-block-wdl-paid-block-voice-3 paid-block-voice-3 init-hide" data-voices="[{&quot;name&quot;:&quot;田中 美咲様&quot;,&quot;age&quot;:&quot;30代&quot;,&quot;job&quot;:&quot;会社員&quot;,&quot;photo&quot;:&quot;https://picsum.photos/200/200?random=1&quot;,&quot;alt&quot;:&quot;田中様&quot;,&quot;excerpt&quot;:&quot;とても丁寧な対応で、安心してお任せすることができました。想像以上の仕上がりに大満足です...&quot;,&quot;text&quot;:&quot;とても丁寧な対応で、安心してお任せすることができました。想像以上の仕上がりに大満足です。\n\n初めての利用で不安もありましたが、最初のヒアリングから丁寧に対応していただき、こちらの要望を細かく聞いてくださいました。途中経過も随時報告していただけたので、安心して任せることができました。\n\n仕上がりも想像以上で、細部まで気を配っていただいたことが伝わってきます。友人にも自信を持って勧められるサービスです。本当にありがとうございました。&quot;},{&quot;name&quot;:&quot;佐藤 健太様&quot;,&quot;age&quot;:&quot;40代&quot;,&quot;job&quot;:&quot;自営業&quot;,&quot;photo&quot;:&quot;https://picsum.photos/200/200?random=2&quot;,&quot;alt&quot;:&quot;佐藤様&quot;,&quot;excerpt&quot;:&quot;スピーディーな対応と、細かい要望にも応えていただき感謝しています。また利用したいです...&quot;,&quot;text&quot;:&quot;スピーディーな対応と、細かい要望にも応えていただき感謝しています。また利用したいです。\n\n急な依頼にも関わらず、迅速に対応していただきました。こちらの細かい要望にも一つ一つ丁寧に答えていただき、期待以上の結果となりました。\n\nプロフェッショナルな仕事ぶりと柔軟な対応力に感動しました。次回もぜひお願いしたいと思います。長くお付き合いできるパートナーを見つけられて嬉しいです。&quot;},{&quot;name&quot;:&quot;鈴木 明子様&quot;,&quot;age&quot;:&quot;50代&quot;,&quot;job&quot;:&quot;主婦&quot;,&quot;photo&quot;:&quot;https://picsum.photos/200/200?random=3&quot;,&quot;alt&quot;:&quot;鈴木様&quot;,&quot;excerpt&quot;:&quot;初めての利用で不安でしたが、親切に説明していただき安心できました。結果も期待以上でした...&quot;,&quot;text&quot;:&quot;初めての利用で不安でしたが、親切に説明していただき安心できました。結果も期待以上でした。\n\n専門的なことは全く分からない状態でしたが、一から丁寧に説明していただき、とても分かりやすかったです。質問にも快く答えていただき、安心して進めることができました。\n\n完成したものを見て、本当に驚きました。こんなに素晴らしい仕上がりになるとは思っていませんでした。感謝の気持ちでいっぱいです。&quot;}]" data-font-settings="{&quot;nameFontSet&quot;:&quot;&quot;,&quot;nameFontWeight&quot;:&quot;600&quot;,&quot;excerptFontSet&quot;:&quot;&quot;,&quot;excerptFontWeight&quot;:&quot;400&quot;}"><div class="inner" style="--paid-block-voice-3-max-width:1120px;--lw-voice-card-bg:#ffffff;--lw-voice-name-color:#333333;--lw-voice-excerpt-color:#666666;--lw-voice-meta-color:#999999"><div class="swiper voice-swiper"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="voice-modal paid-block-voice-3-modal"><div class="modal-overlay"></div><div class="modal-content"><button class="modal-close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button><div class="modal-body"><div class="modal-photo"><img src="" alt=""/></div><h3 class="modal-name" data-lw_font_set="" style="font-weight:600"></h3><p class="modal-meta"></p><div class="modal-text" data-lw_font_set="" style="font-weight:400"></div></div></div></div><script type="text/javascript">
(function(){
    const selector = "#paid-block-voice-3-56a651be-bff3-4d98-8fb2-e1674fcd18dc";
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
        const modal = section.querySelector('.paid-block-voice-3-modal');
        if (!modal) return;

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
        </script><noscript><style>#paid-block-voice-3-56a651be-bff3-4d98-8fb2-e1674fcd18dc{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-voice-3 -->