/**
 * LiteWord Markdown Paste ─ 貼られた文章の下ごしらえ
 * ---------------------------------------------------------------
 * ブロックに変える前に、AI の返答に混ざる「記事ではないもの」を外す。
 *
 * 🚨 どちらも黙って消さない。何をしたかを必ず warnings で知らせる。
 *    黙って直すと、書いた人が「AI がそう書いた」ことに気づけない。
 */
( function () {
	'use strict';

	/**
	 * その行がコード囲みの記号か
	 *
	 * 判定は directives.js の fenceOf に任せる（行内コード ```foo``` を
	 * 囲みと誤認しないための除外がそちらに入っている。二重に書かない）。
	 *
	 * @param {string} line
	 * @return {boolean}
	 */
	function isFence( line ) {
		return window.LWMdDirectives.fenceOf( line ) !== null;
	}

	/** ChatGPT が Web 検索を使うと本文に残す引用の印 */
	var CITATION_RES = [
		/:contentReference\[[^\]]*\](\{[^}]*\})?/g,
		/【[^【】]*†[^【】]*】/g,
		/\[oaicite:\d+\]/g,
	];

	/** 前置き（「以下が記事です！」等）をここまでは許す行数 */
	var MAX_PREFACE = 3;

	/**
	 * 記事全体を囲っているコード囲みを外す
	 *
	 * 🚨 「コピーしやすいように ~~~~ で囲んで出して」と AI に頼むと、
	 *    利用者は囲みごとコピーしてくる。~~~~ はマークダウンのコード囲みなので、
	 *    そのままだと記事1本がまるごと1個のコードブロックになり、
	 *    見出しも飾りも全部ただの文字になる（実際に起きた）。
	 *
	 * 本物のコードブロックを壊さないよう、次の両方を満たすときだけ外す。
	 *   ・囲みが文章のいちばん最初にある（前置き数行までは許す）
	 *   ・囲みの中身が「記事に見える」（--- で始まる or ## が2つ以上ある）
	 *
	 * @param {string} text 改行を LF に揃えた全文
	 * @return {{text: string, unwrapped: boolean}}
	 */
	function unwrapFence( text ) {
		var lines = String( text == null ? '' : text ).split( '\n' );
		var open = -1;
		var preface = 0;

		for ( var i = 0; i < lines.length; i++ ) {
			var line = lines[ i ];
			if ( line.trim() === '' ) {
				continue;
			}
			if ( isFence( line ) ) {
				open = i;
				break;
			}
			// もう本文が始まっている（フロントマター・見出し）なら囲みではない
			if ( line.trim() === '---' || /^#{1,6}\s/.test( line ) ) {
				break;
			}
			preface++;
			if ( preface > MAX_PREFACE ) {
				break;
			}
		}

		if ( open === -1 ) {
			return { text: text, unwrapped: false };
		}

		var rest = lines.slice( open + 1 );
		var looksLikeArticle =
			( rest[ 0 ] || '' ).trim() === '---' ||
			rest.filter( function ( l ) {
				return /^##\s/.test( l );
			} ).length >= 2;

		if ( ! looksLikeArticle ) {
			return { text: text, unwrapped: false };
		}

		// 閉じは後ろから探す（AI は開きを ~~~~ 閉じを ~~~ と書くことがある）
		var close = -1;
		for ( var j = lines.length - 1; j > open; j-- ) {
			if ( isFence( lines[ j ] ) ) {
				close = j;
				break;
			}
		}

		return {
			text: lines.slice( open + 1, close > open ? close : lines.length ).join( '\n' ),
			unwrapped: true,
		};
	}

	/**
	 * AI が本文に混ぜてしまう「引用の印」を取り除く
	 *
	 * 🚨 コード囲みと行内コードの中は触らない。記事の中で記法そのものを
	 *    説明しているとき、その説明文まで消してしまうため（実際に起きた）。
	 *
	 * @param {string} text
	 * @return {{text: string, removed: number}}
	 */
	function stripCitations( text ) {
		var lines = String( text == null ? '' : text ).split( '\n' );
		var inFence = window.LWMdDirectives.markFences( lines );
		var removed = 0;

		var out = lines.map( function ( line, i ) {
			if ( inFence[ i ] ) {
				return line;
			}
			return line
				.split( /(`+[^`]*`+)/ )
				.map( function ( part ) {
					if ( part.charAt( 0 ) === '`' ) {
						return part;
					}
					var s = part;
					CITATION_RES.forEach( function ( re ) {
						s = s.replace( re, function () {
							removed++;
							return '';
						} );
					} );
					return s;
				} )
				.join( '' );
		} );

		var joined = out.join( '\n' );
		if ( removed ) {
			// 印だけの行が空行として残るので畳む
			joined = joined.replace( /^[ \t]+$/gm, '' ).replace( /\n{3,}/g, '\n\n' );
		}
		return { text: joined, removed: removed };
	}

	/**
	 * 下ごしらえをまとめて行う
	 *
	 * @param {string} markdown 貼り付けられた全文
	 * @return {{text: string, warnings: string[]}}
	 */
	function prepare( markdown ) {
		// 改行を LF に揃える（Windows のコピー対策。以降の行処理が全部これ前提）
		var text = String( markdown == null ? '' : markdown ).replace( /\r\n?/g, '\n' );
		var warnings = [];

		var un = unwrapFence( text );
		if ( un.unwrapped ) {
			warnings.push(
				'記事全体を囲っていたコード囲み（``` や ~~~）を外しました。' +
					'AI の返答をそのままコピーすると付いてきます'
			);
		}

		var cleaned = stripCitations( un.text );
		if ( cleaned.removed ) {
			warnings.push(
				'AI が付けた引用の印を ' + cleaned.removed + '個 取り除きました' +
					'（本文に意味のない文字列として出るため）'
			);
		}

		return { text: cleaned.text, warnings: warnings };
	}

	window.LWMdSanitize = {
		prepare: prepare,
		unwrapFence: unwrapFence,
		stripCitations: stripCitations,
	};
} )();
