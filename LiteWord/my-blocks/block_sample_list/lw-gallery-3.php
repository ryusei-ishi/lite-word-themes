<!-- wp:wdl/paid-block-lw-gallery-3 {"maxWidthPx":680} -->
<div class="wp-block-wdl-paid-block-lw-gallery-3 paid-block-lw-gallery-3 init-hide" style="max-width:680px"><div class="swiper lw-gallery_images_Swiper_main" data-slide-count="5" style="aspect-ratio:1080 / 700"><div class="swiper-wrapper"><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/1.webp" alt="ギャラリー画像1"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/2.webp" alt="ギャラリー画像2"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/3.webp" alt="ギャラリー画像3"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/4.webp" alt="ギャラリー画像4"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/5.webp" alt="ギャラリー画像5"/></div></div><div class="swiper-button-next" style="background-color:var(--color-main)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" fill="#ffffff"></path></svg></div><div class="swiper-button-prev" style="background-color:var(--color-main);transform:scaleX(-1)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" fill="#ffffff"></path></svg></div></div><div class="swiper lw-gallery_images_Swiper_sub image_count_5" data-slide-count="5"><div class="swiper-wrapper"><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/1.webp" alt="ギャラリー画像1"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/2.webp" alt="ギャラリー画像2"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/3.webp" alt="ギャラリー画像3"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/4.webp" alt="ギャラリー画像4"/></div><div class="swiper-slide" style="border-radius:0em"><img src="https://lite-word.com/sample_img/shop/5.webp" alt="ギャラリー画像5"/></div></div></div><script type="text/javascript">
(function(){
	// 全てのギャラリーを初期化
	const initAllGalleries = () => {
		// まだ初期化されていないギャラリーを全て取得
		const galleries = document.querySelectorAll('.paid-block-lw-gallery-3:not([data-swiper-initialized])');
		
		galleries.forEach((wrapper) => {
			const mainEl = wrapper.querySelector('.lw-gallery_images_Swiper_main');
			if (!mainEl || typeof Swiper === 'undefined') return;
			
			// 初期化済みマークを付ける
			wrapper.setAttribute('data-swiper-initialized', 'true');
			
			const slideCount = parseInt(mainEl.dataset.slideCount || '0', 10);
			const mainLoopFlg = slideCount > 1;
			
			let thumbsSwiper = null;
			if (mainLoopFlg) {
				const thumbEl = wrapper.querySelector('.lw-gallery_images_Swiper_sub');
				if (thumbEl) {
					// サムネイルのループは、スライド数が表示数の2倍以上の場合のみ有効
					const thumbSlidesPerView = Math.min(slideCount, 5);
					const thumbLoopFlg = slideCount >= (thumbSlidesPerView * 2);
					
					thumbsSwiper = new Swiper(thumbEl, {
						loop: thumbLoopFlg,
						spaceBetween: 4,
						slidesPerView: thumbSlidesPerView,
						freeMode: true,
						watchSlidesProgress: true
					});
				}
			}
			
			new Swiper(mainEl, {
				loop: mainLoopFlg,
				spaceBetween: 0,
				navigation: mainLoopFlg ? {
					nextEl: wrapper.querySelector('.swiper-button-next'),
					prevEl: wrapper.querySelector('.swiper-button-prev')
				} : {},
				thumbs: mainLoopFlg && thumbsSwiper ? { swiper: thumbsSwiper } : {}
			});
			
			wrapper.classList.remove('init-hide');
		});
	};
	
	// 初期化を確実に実行
	const tryInit = () => {
		if (typeof Swiper !== 'undefined') {
			initAllGalleries();
		} else {
			window.addEventListener('lw:swiperReady', initAllGalleries, { once: true });
		}
	};
	
	// DOMContentLoadedまたは即座に実行
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', tryInit);
	} else {
		tryInit();
	}
})();</script><noscript><style>.paid-block-lw-gallery-3{opacity:1!important}</style></noscript></div>
<!-- /wp:wdl/paid-block-lw-gallery-3 -->