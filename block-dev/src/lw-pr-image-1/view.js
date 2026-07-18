/**
 * lw-pr-image-1 — ポップアップ (フロントエンド専用)
 */
( function () {
	'use strict';

	var POPUP_ID = 'lw-pr-image-1-popup';
	var popup, popupImg, btnClose, btnPrev, btnNext;
	var currentImages = [];
	var currentIndex = 0;

	/* ── ポップアップ要素を body 直下に1つだけ作成 ────────── */
	function createPopup() {
		if ( document.getElementById( POPUP_ID ) ) return;

		popup = document.createElement( 'div' );
		popup.id = POPUP_ID;
		popup.className = 'lw-pr-image-1__popup';
		popup.setAttribute( 'role', 'dialog' );
		popup.setAttribute( 'aria-modal', 'true' );
		popup.setAttribute( 'aria-label', '画像ポップアップ' );
		popup.innerHTML =
			'<div class="lw-pr-image-1__popup-overlay"></div>' +
			'<div class="lw-pr-image-1__popup-inner">' +
				'<button class="lw-pr-image-1__popup-close" type="button" aria-label="閉じる">&times;</button>' +
				'<button class="lw-pr-image-1__popup-prev" type="button" aria-label="前へ">&#8249;</button>' +
				'<img class="lw-pr-image-1__popup-img" src="" alt="" />' +
				'<button class="lw-pr-image-1__popup-next" type="button" aria-label="次へ">&#8250;</button>' +
			'</div>';

		document.body.appendChild( popup );

		popupImg  = popup.querySelector( '.lw-pr-image-1__popup-img' );
		btnClose  = popup.querySelector( '.lw-pr-image-1__popup-close' );
		btnPrev   = popup.querySelector( '.lw-pr-image-1__popup-prev' );
		btnNext   = popup.querySelector( '.lw-pr-image-1__popup-next' );

		/* イベント */
		popup.querySelector( '.lw-pr-image-1__popup-overlay' ).addEventListener( 'click', close );
		btnClose.addEventListener( 'click', close );
		btnPrev.addEventListener( 'click', function () { navigate( -1 ); } );
		btnNext.addEventListener( 'click', function () { navigate( 1 ); } );
	}

	/* ── 開く ────────────────────────────────────── */
	function open( images, index ) {
		currentImages = images;
		currentIndex  = index;
		show();
		document.body.style.overflow = 'hidden';
		popup.classList.add( 'is-active' );
		document.addEventListener( 'keydown', onKey );
	}

	/* ── 閉じる ──────────────────────────────────── */
	function close() {
		popup.classList.remove( 'is-active' );
		document.body.style.overflow = '';
		document.removeEventListener( 'keydown', onKey );
	}

	/* ── 表示更新 ─────────────────────────────────── */
	function show() {
		var img = currentImages[ currentIndex ];
		popupImg.src = img.src;
		popupImg.alt = img.alt || '';
		btnPrev.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
		btnNext.style.visibility = currentIndex < currentImages.length - 1 ? 'visible' : 'hidden';
	}

	/* ── ナビゲーション ───────────────────────────── */
	function navigate( dir ) {
		var next = currentIndex + dir;
		if ( next < 0 || next >= currentImages.length ) return;
		currentIndex = next;
		show();
	}

	/* ── キーボード ───────────────────────────────── */
	function onKey( e ) {
		if ( e.key === 'Escape' )      close();
		if ( e.key === 'ArrowLeft' )   navigate( -1 );
		if ( e.key === 'ArrowRight' )  navigate( 1 );
	}

	/* ── 初期化 ───────────────────────────────────── */
	function init() {
		createPopup();

		var blocks = document.querySelectorAll( '.lw-pr-image-1' );
		blocks.forEach( function ( block ) {
			var items = block.querySelectorAll( '.lw-pr-image-1__item' );
			items.forEach( function ( item, idx ) {
				item.addEventListener( 'click', function ( e ) {
					/* linkUrl の a タグのデフォルト遷移を止める */
					e.preventDefault();

					/* クリック時にそのブロック内の画像リストを収集 */
					var imgs = [];
					block.querySelectorAll( '.lw-pr-image-1__item img' ).forEach( function ( img ) {
						imgs.push( { src: img.src, alt: img.alt } );
					} );
					if ( ! imgs.length ) return;

					open( imgs, idx );
				} );
			} );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
