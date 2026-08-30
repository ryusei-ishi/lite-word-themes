/**
 * LiteWord Markdown Paste ─ ブロックを作るための小道具
 * ---------------------------------------------------------------
 * blocks.js から使う。ここには「1つの記法の作り方」は書かない。
 */
( function () {
	'use strict';

	/**
	 * そのブロックが今のユーザーの画面で使えるか。
	 * 無料プランで解放されていないブロックや、将来消したブロックを
	 * 黙って作って壊さないための入口チェック。
	 *
	 * @param {string} name 例 'wdl/lw-qa-1'
	 * @return {boolean}
	 */
	function usable( name ) {
		return !! ( wp.blocks.getBlockType && wp.blocks.getBlockType( name ) );
	}

	/**
	 * 行内のマークダウン（**太字**・[リンク](url)）を HTML にする。
	 * WordPress 自身の変換器を使うので、記法の解釈がエディタの貼り付けと必ず揃う。
	 *
	 * @param {string} text
	 * @return {string}
	 */
	function inline( text ) {
		var src = String( text == null ? '' : text ).trim();
		if ( src === '' ) {
			return '';
		}
		try {
			var html = wp.blocks.pasteHandler( { plainText: src, mode: 'INLINE' } );
			if ( typeof html === 'string' && html !== '' ) {
				return html;
			}
		} catch ( e ) {
			// 変換器が使えないときは素の文字として扱う
		}
		return src.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
	}

	/**
	 * createBlock の短い書き方
	 *
	 * @param {string} name
	 * @param {Object} attrs
	 * @param {Array}  inner
	 * @return {Object}
	 */
	function create( name, attrs, inner ) {
		return wp.blocks.createBlock( name, attrs || {}, inner || [] );
	}

	window.LWMdBlockHelpers = { usable: usable, inline: inline, create: create };
} )();
