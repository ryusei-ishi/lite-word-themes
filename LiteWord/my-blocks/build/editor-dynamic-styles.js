/**
 * editor-dynamic-styles.js
 * ============================================================================
 * エディタで「実際に使われている wdl/* ブロックの style.css だけ」を
 * オンデマンドで読み込むローダー。
 *
 * WP7.0 でエディタが iframe(name="editor-canvas") 化され、通常の enqueue では
 * ブロック描画 canvas に CSS が届かなくなった。本スクリプトは外側フレーム
 * (wp.data が動く側) で実行され、使用中ブロックの style.css を iframe の
 * contentDocument に <link> として注入する。iframe が無い旧環境では親docに注入。
 *
 * 設計方針: 「全ブロックのCSSを読む」のは禁止。挿入されたブロックの分だけ、
 * 1ブロック1回だけ注入する（doc単位で id 重複チェック）。
 *
 * 依存: wp-data / wp-blocks / wp-dom-ready
 * 設定: window.MyThemeSettings.themeUrl（PHPから localize 済み）
 * ----------------------------------------------------------------------------
 */
( function ( wp ) {
	if ( ! wp || ! wp.data || ! wp.domReady ) {
		return;
	}

	var settings = window.MyThemeSettings || {};
	var themeUrl = ( settings.themeUrl || '' ).replace( /\/$/, '' );
	var PREFIX = 'wdl/';
	var BUILD_BASE = themeUrl + '/my-blocks/build/';

	/* 使用中ブロック名を再帰的に集める（innerBlocks 含む） */
	function collectNames( blocks, found ) {
		if ( ! blocks ) {
			return;
		}
		for ( var i = 0; i < blocks.length; i++ ) {
			var b = blocks[ i ];
			if ( ! b ) {
				continue;
			}
			if ( b.name && b.name.indexOf( PREFIX ) === 0 ) {
				found[ b.name ] = true;
			}
			if ( b.innerBlocks && b.innerBlocks.length ) {
				collectNames( b.innerBlocks, found );
			}
		}
	}

	/* ブロック描画先の document を取得（WP7.0=iframe / 旧=親doc） */
	function getCanvasDoc() {
		var iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
		if ( iframe && iframe.contentDocument && iframe.contentDocument.head ) {
			return iframe.contentDocument;
		}
		return document;
	}

	function linkId( blockName ) {
		return 'wdl-dyn-style-' + blockName.replace( /[^\w-]/g, '-' );
	}

	/* 1ブロックの style.css を指定 doc に注入（同 doc に既にあれば何もしない） */
	function injectOne( doc, blockName ) {
		var id = linkId( blockName );
		if ( doc.getElementById( id ) ) {
			return;
		}
		var slug = blockName.slice( PREFIX.length );
		var link = doc.createElement( 'link' );
		link.id = id;
		link.rel = 'stylesheet';
		link.href = BUILD_BASE + slug + '/style.css';
		( doc.head || doc.documentElement ).appendChild( link );
	}

	/* 現在使用中の全 wdl ブロックについて、未注入分を canvas に注入 */
	function sync() {
		var editor = wp.data.select( 'core/block-editor' );
		if ( ! editor || typeof editor.getBlocks !== 'function' ) {
			return;
		}
		var blocks = editor.getBlocks();
		if ( ! blocks || ! blocks.length ) {
			return;
		}
		var found = {};
		collectNames( blocks, found );
		var names = Object.keys( found );
		if ( ! names.length ) {
			return;
		}
		var doc = getCanvasDoc();
		for ( var i = 0; i < names.length; i++ ) {
			injectOne( doc, names[ i ] );
		}
	}

	/* store の変化が多発するので debounce してから sync */
	var pending = null;
	function scheduleSync() {
		if ( pending ) {
			return;
		}
		pending = window.setTimeout( function () {
			pending = null;
			sync();
		}, 300 );
	}

	wp.domReady( function () {
		sync();

		if ( typeof wp.data.subscribe === 'function' ) {
			wp.data.subscribe( scheduleSync );
		}

		/* iframe が domReady 後にマウント／再マウントされるケースに対応して
		   初期だけ短時間ポーリングで取りこぼしを拾う（約20秒で停止）。 */
		var tries = 0;
		var iv = window.setInterval( function () {
			tries++;
			sync();
			if ( tries >= 40 ) {
				window.clearInterval( iv );
			}
		}, 500 );
	} );
} )( window.wp );
