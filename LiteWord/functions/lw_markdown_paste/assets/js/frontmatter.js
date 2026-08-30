/**
 * LiteWord Markdown Paste ─ フロントマター解析
 * ---------------------------------------------------------------
 * 本文の先頭にある `---` で挟んだ `キー: 値` を切り出す。
 * ここは「読むだけ」。投稿への反映は apply-meta.js が受け持つ。
 */
( function () {
	'use strict';

	/** 受け付けるキー（これ以外は無視して warnings に載せる） */
	var KNOWN_KEYS = [ 'title', 'category', 'slug', 'description', 'tags', 'eyecatch' ];

	/**
	 * 値の前後にある引用符を外す
	 *
	 * @param {string} raw
	 * @return {string}
	 */
	function unquote( raw ) {
		var m = raw.match( /^(["'])([\s\S]*)\1$/ );
		return m ? m[ 2 ] : raw;
	}

	/**
	 * フロントマターを切り出す
	 *
	 * @param {string} markdown 貼り付けられた全文
	 * @return {{meta: Object, body: string, warnings: string[]}}
	 */
	function parse( markdown ) {
		var text = String( markdown == null ? '' : markdown ).replace( /^﻿/, '' );
		// CRLF / CR を LF に寄せる（Windows のコピー対策）
		text = text.replace( /\r\n?/g, '\n' );

		var result = { meta: {}, body: text, warnings: [] };

		// 先頭が `---` の行でなければフロントマター無し
		var m = text.match( /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/ );
		if ( ! m ) {
			return result;
		}

		result.body = text.slice( m[ 0 ].length );

		m[ 1 ].split( '\n' ).forEach( function ( line ) {
			var trimmed = line.trim();
			if ( trimmed === '' || trimmed.charAt( 0 ) === '#' ) {
				return;
			}
			var sep = trimmed.indexOf( ':' );
			if ( sep === -1 ) {
				result.warnings.push( '「' + trimmed + '」は「キー: 値」の形ではないので読み飛ばしました' );
				return;
			}

			var key = trimmed.slice( 0, sep ).trim().toLowerCase();
			var value = unquote( trimmed.slice( sep + 1 ).trim() );

			if ( value === '' ) {
				return;
			}
			if ( KNOWN_KEYS.indexOf( key ) === -1 ) {
				result.warnings.push( '「' + key + '」は使えない項目なので読み飛ばしました' );
				return;
			}

			// tags だけは配列にする（カンマ区切り・全角カンマも受ける）
			if ( key === 'tags' ) {
				result.meta.tags = value
					.split( /[,、]/ )
					.map( function ( t ) {
						return t.trim();
					} )
					.filter( Boolean );
				return;
			}

			result.meta[ key ] = value;
		} );

		return result;
	}

	window.LWMdFrontmatter = { parse: parse, KNOWN_KEYS: KNOWN_KEYS };
} )();
