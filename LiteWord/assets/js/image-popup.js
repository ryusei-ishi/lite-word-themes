/**
 * 画像ポップアップ機能
 * data-lw-popup="true" が付いた wp:image ブロック内の img をクリックで拡大表示
 */
document.addEventListener('DOMContentLoaded', function () {

	/* ポップアップ用のHTMLをbody直下に挿入 */
	var overlay = document.createElement('div');
	overlay.id = 'lw-image-popup';
	overlay.innerHTML =
		'<div class="lw-image-popup__overlay"></div>' +
		'<div class="lw-image-popup__content">' +
			'<button class="lw-image-popup__close" aria-label="閉じる">&times;</button>' +
			'<img class="lw-image-popup__img" src="" alt="" />' +
		'</div>';
	document.body.appendChild(overlay);

	var popupEl     = overlay;
	var popupImg    = overlay.querySelector('.lw-image-popup__img');
	var closeBtn    = overlay.querySelector('.lw-image-popup__close');
	var overlayBg   = overlay.querySelector('.lw-image-popup__overlay');

	/* 開く */
	function openPopup(src, alt) {
		popupImg.src = src;
		popupImg.alt = alt || '';
		popupEl.classList.add('is-active');
		document.body.style.overflow = 'hidden';
	}

	/* 閉じる */
	function closePopup() {
		popupEl.classList.remove('is-active');
		document.body.style.overflow = '';
		popupImg.src = '';
	}

	/* 閉じるイベント */
	closeBtn.addEventListener('click', closePopup);
	overlayBg.addEventListener('click', closePopup);
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closePopup();
	});

	/* data-lw-popup="true" の画像ブロック内 img にクリックイベント */
	var targets = document.querySelectorAll('[data-lw-popup="true"] img');
	targets.forEach(function (img) {
		img.style.cursor = 'zoom-in';
		img.addEventListener('click', function (e) {
			e.preventDefault();
			/* フルサイズ画像があればそちらを使う（親aタグのhref） */
			var parentLink = img.closest('a');
			var src = (parentLink && parentLink.href) ? parentLink.href : img.src;
			openPopup(src, img.alt);
		});
	});
});
