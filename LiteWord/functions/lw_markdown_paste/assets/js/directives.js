/**
 * LiteWord Markdown Paste ─ 拡張記法（:::）の切り出し
 * ---------------------------------------------------------------
 * 本文を「素のマークダウン」と「::: の塊」に分ける。
 * ここでもブロックは作らない。作るのは blocks.js。
 *
 *   :::box
 *   中身
 *   :::
 *
 *   :::button https://example.com
 *   ボタンの文字
 *   :::
 */
( function () {
	'use strict';

	/** 対応する名前。ここに無いものは素のマークダウンとして扱う */
	var KNOWN = [ 'box', 'check', 'steps', 'qa', 'voice', 'button', 'cta' ];

	var OPEN_RE = /^:::[ \t]*([a-zA-Z][a-zA-Z0-9_-]*)[ \t]*(.*)$/;
	var CLOSE_RE = /^:::[ \t]*$/;
	var FENCE_RE = /^[ \t]{0,3}(```+|~~~+)/;

	/**
	 * コード囲み（``` / ~~~）の中にある行に印を付ける
	 *
	 * 🚨 これが無いと、記事の中で「:::box と書きます」のような説明をコード囲みで
	 *    見せたときに、その行が本物の記法として拾われて中身が消える。
	 *
	 * @param {string[]} lines
	 * @return {boolean[]} 行ごとに「コード囲みの中か」
	 */
	function markFences( lines ) {
		var inside = new Array( lines.length ).fill( false );
		var marker = null;
		for ( var i = 0; i < lines.length; i++ ) {
			var m = lines[ i ].match( FENCE_RE );
			if ( marker === null ) {
				if ( m ) {
					marker = m[ 1 ];
					inside[ i ] = true; // 囲みの記号の行も中扱い
				}
				continue;
			}
			inside[ i ] = true;
			// 閉じは同じ記号で、開いたときと同じ長さ以上
			if ( m && m[ 1 ].charAt( 0 ) === marker.charAt( 0 ) && m[ 1 ].length >= marker.length ) {
				marker = null;
			}
		}
		return inside;
	}

	/**
	 * 本文を断片の配列に分ける
	 *
	 * 返す断片は2種類:
	 *   { type: 'markdown', text }
	 *   { type: 'directive', name, arg, body, line }
	 *
	 * @param {string} body フロントマターを外した本文
	 * @return {{segments: Array, warnings: string[]}}
	 */
	function split( body ) {
		var lines = String( body == null ? '' : body ).split( '\n' );
		var inFence = markFences( lines );
		var segments = [];
		var warnings = [];
		var buffer = [];

		function flushMarkdown() {
			if ( buffer.length === 0 ) {
				return;
			}
			var text = buffer.join( '\n' );
			buffer = [];
			if ( text.trim() !== '' ) {
				segments.push( { type: 'markdown', text: text } );
			}
		}

		for ( var i = 0; i < lines.length; i++ ) {
			var open = inFence[ i ] ? null : lines[ i ].match( OPEN_RE );

			if ( ! open ) {
				buffer.push( lines[ i ] );
				continue;
			}

			var name = open[ 1 ].toLowerCase();
			if ( KNOWN.indexOf( name ) === -1 ) {
				warnings.push( ( i + 1 ) + '行目の「:::' + name + '」は知らない記法なので、そのままの文字として残しました' );
				buffer.push( lines[ i ] );
				continue;
			}

			// 閉じ ::: を探す（入れ子は受け付けない＝最初に出た閉じで終わる。
			// コード囲みの中の ::: は閉じとみなさない）
			var end = -1;
			for ( var j = i + 1; j < lines.length; j++ ) {
				if ( ! inFence[ j ] && CLOSE_RE.test( lines[ j ] ) ) {
					end = j;
					break;
				}
			}
			if ( end === -1 ) {
				warnings.push( ( i + 1 ) + '行目の「:::' + name + '」が閉じられていません（閉じる行 ::: が要ります）。そのままの文字として残しました' );
				buffer.push( lines[ i ] );
				continue;
			}

			flushMarkdown();
			segments.push( {
				type: 'directive',
				name: name,
				arg: open[ 2 ].trim(),
				body: lines.slice( i + 1, end ).join( '\n' ),
				line: i + 1,
			} );
			i = end;
		}

		flushMarkdown();
		return { segments: segments, warnings: warnings };
	}

	/**
	 * `キー: 値` の行だけでできた本文を読む（:::cta 用）
	 *
	 * @param {string} text
	 * @return {Object}
	 */
	function parseFields( text ) {
		var out = {};
		String( text || '' )
			.split( '\n' )
			.forEach( function ( line ) {
				var trimmed = line.trim();
				var sep = trimmed.indexOf( ':' );
				if ( trimmed === '' || sep === -1 ) {
					return;
				}
				out[ trimmed.slice( 0, sep ).trim().toLowerCase() ] = trimmed.slice( sep + 1 ).trim();
			} );
		return out;
	}

	/**
	 * 箇条書き（- / * / 1.）を項目の配列にする
	 *
	 * @param {string} text
	 * @return {string[]}
	 */
	function parseListItems( text ) {
		return String( text || '' )
			.split( '\n' )
			.map( function ( line ) {
				return line.replace( /^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/, '' ).trim();
			} )
			.filter( function ( line ) {
				return line !== '';
			} );
	}

	window.LWMdDirectives = {
		split: split,
		parseFields: parseFields,
		parseListItems: parseListItems,
		KNOWN: KNOWN,
	};
} )();
