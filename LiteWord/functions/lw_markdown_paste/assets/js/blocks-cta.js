/**
 * LiteWord Markdown Paste ─ 誘導系の記法（:::voice / :::button / :::cta）
 * ---------------------------------------------------------------
 * 文章の飾り（box / check / steps / qa）は blocks.js。
 * ここは「読み手を次へ動かす」3つだけを持つ。
 */
( function () {
	'use strict';

	var D = window.LWMdDirectives;
	var H = window.LWMdBlockHelpers;
	var usable = H.usable;
	var inline = H.inline;
	var create = H.create;

	/**
	 * :::voice 名前 | 画像URL … ::: → 体験談
	 *
	 * 🚨 写真が無いときに lw-comment-1 を使わないこと。
	 *    imageUrl が空だと**保存HTMLにも**「No Image」の丸が入り、公開ページに出てしまう。
	 *    写真が無いときは引用ブロックに落とす（テーマのデザインが当たり、見た目が崩れない）。
	 *
	 * @param {Object} seg
	 * @return {Array}
	 */
	function voice( seg ) {
		var text = seg.body.trim();
		if ( text === '' ) {
			return [];
		}
		var parts = String( seg.arg || '' ).split( '|' );
		var who = parts[ 0 ].trim();
		var image = ( parts[ 1 ] || '' ).trim();

		if ( image && usable( 'wdl/lw-comment-1' ) ) {
			return [
				create( 'wdl/lw-comment-1', {
					name: who || 'お客様',
					title: inline( text ),
					imageUrl: image,
					altText: who,
				} ),
			];
		}
		return [
			create( 'core/quote', { citation: who }, [
				create( 'core/paragraph', { content: inline( text ) } ),
			] ),
		];
	}

	/**
	 * :::button URL … ::: → リンクボタン
	 *
	 * ⚠ ディレクトリ名は lw-button-1 だが、登録されているブロック名は wdl/lw-button-01。
	 *
	 * @param {Object} seg
	 * @return {Array}
	 */
	function button( seg ) {
		var label = seg.body.trim().split( '\n' )[ 0 ] || '詳しく見る';
		var url = seg.arg;
		if ( usable( 'wdl/lw-button-01' ) ) {
			return [ create( 'wdl/lw-button-01', { buttonText: label, url: url, linkType: 'url' } ) ];
		}
		return [ create( 'core/buttons', {}, [ create( 'core/button', { text: label, url: url } ) ] ) ];
	}

	/**
	 * :::cta … ::: → 記事末の誘導（title / text / button / url の4行）
	 *
	 * @param {Object} seg
	 * @return {Array}
	 */
	function cta( seg ) {
		var f = D.parseFields( seg.body );
		var attrs = {
			title: f.title || 'お気軽にご相談ください',
			text: f.text || '',
			buttonText: f.button || 'お問い合わせ',
			buttonUrl: f.url || '',
		};
		if ( usable( 'wdl/cta-1' ) ) {
			return [ create( 'wdl/cta-1', attrs ) ];
		}
		return [
			create( 'core/group', {}, [
				create( 'core/heading', { level: 2, content: attrs.title } ),
				create( 'core/paragraph', { content: attrs.text } ),
				create( 'core/buttons', {}, [
					create( 'core/button', { text: attrs.buttonText, url: attrs.buttonUrl } ),
				] ),
			] ),
		];
	}

	window.LWMdBlocksCta = { voice: voice, button: button, cta: cta };
} )();
