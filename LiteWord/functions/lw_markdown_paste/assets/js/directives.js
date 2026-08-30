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
	var KNOWN = [ 'box', 'bg', 'check', 'steps', 'qa', 'voice', 'button', 'cta' ];

	var OPEN_RE = /^:::[ \t]*([a-zA-Z][a-zA-Z0-9_-]*)[ \t]*(.*)$/;
	var CLOSE_RE = /^:::[ \t]*$/;
	var FENCE_RE = /^[ \t]{0,3}(```+|~~~+)/;
	/** 「:::」の書き損ない（全角が混ざる・コロンが4つ以上）。効かないので知らせる */
	var BAD_OPEN_RE = /^[ \t]{0,3}([:：]{3,})[ \t]*(\S*)/;

	/**
	 * その行がコード囲みの記号なら、その記号を返す（違えば null）
	 *
	 * 🚨 ``` で始まっていても、同じ行にもう1つ ` があるなら、それは行内コード
	 *    （```foo``` のような書き方）であって囲みではない。囲みと見なすと、
	 *    以降の行が全部「コードの中」扱いになり、記法の検査が黙って止まる
	 *    （実際に起きた。閉じ忘れも全角も、そこから先は一切警告が出なくなった）。
	 *
	 * @param {string} line
	 * @return {string|null}
	 */
	function fenceOf( line ) {
		var m = line.match( FENCE_RE );
		if ( ! m ) {
			return null;
		}
		var tail = line.slice( line.indexOf( m[ 1 ] ) + m[ 1 ].length );
		if ( m[ 1 ].charAt( 0 ) === '`' && tail.indexOf( '`' ) !== -1 ) {
			return null;
		}
		return m[ 1 ];
	}

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
			var mark = fenceOf( lines[ i ] );
			if ( marker === null ) {
				if ( mark ) {
					marker = mark;
					inside[ i ] = true; // 囲みの記号の行も中扱い
				}
				continue;
			}
			inside[ i ] = true;
			// 閉じは同じ記号で、開いたときと同じ長さ以上
			if ( mark && mark.charAt( 0 ) === marker.charAt( 0 ) && mark.length >= marker.length ) {
				marker = null;
			}
		}
		return inside;
	}

	/**
	 * 飾りの中に別の飾りが書かれていないか探す
	 *
	 * 🚨 入れ子は受け付けない（最初に出た閉じ ::: でその飾りは終わる）。
	 *    黙って中身の文字として残ると書いた人が気づけないので、見つけたら知らせる。
	 *
	 * @param {string[]} bodyLines 飾りの中身の行
	 * @param {number}   offset    元の本文での開始行（0始まり）
	 * @return {string[]}
	 */
	function findNested( bodyLines, offset ) {
		var inner = markFences( bodyLines );
		var out = [];
		bodyLines.forEach( function ( line, k ) {
			if ( inner[ k ] ) {
				return;
			}
			var m = line.match( OPEN_RE );
			if ( m ) {
				out.push(
					( offset + k + 1 ) + '行目の「:::' + m[ 1 ].toLowerCase() +
						'」は飾りの中にあります。飾りの入れ子はできないので、そのままの文字として残しました'
				);
			}
		} );
		return out;
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

		// 全角のコロンで書かれていないか（記法として効かないので先に知らせる）
		lines.forEach( function ( line, k ) {
			if ( inFence[ k ] ) {
				return;
			}
			var z = line.match( BAD_OPEN_RE );
			// 正しい「:::」だけは素通り。それ以外（全角混じり・コロン4つ以上）は知らせる
			if ( z && z[ 1 ] !== ':::' ) {
				warnings.push(
					( k + 1 ) + '行目の「' + z[ 1 ] + z[ 2 ] + '」は飾りの書き方が違います。' +
						'半角のコロン3つ「:::」で書いてください（そのままの文字として残しました）'
				);
			}
		} );

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
			warnings = warnings.concat( findNested( lines.slice( i + 1, end ), i + 1 ) );
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
		markFences: markFences,
		fenceOf: fenceOf,
		KNOWN: KNOWN,
	};
} )();
