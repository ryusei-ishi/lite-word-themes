/**
 * LiteWord Markdown Paste ─ 貼る前の点検
 * ---------------------------------------------------------------
 * 「変換は通るが、読みにくくなる」ものを数えて知らせる。
 *
 * 🚨 ここでは絶対に中身を書き換えない。数えて言うだけ。
 *    直すかどうかは書いた人が決める。
 */
( function () {
	'use strict';

	/** これを超えたら知らせる、という目安 */
	var LIMIT = {
		headings: 10,
		directives: 8,
		decorations: 20,
	};

	/** 行内の飾りの形（:red[…] など）。名前が分かればよい */
	var INLINE_RE = /:([a-zA-Z]+)\[[^\]]*\]/g;

	/**
	 * ブロックの属性から文字列を取り出す（RichTextData も文字列に落とす）
	 *
	 * @param {*} v
	 * @return {string}
	 */
	function textOf( v ) {
		if ( v && typeof v.toHTMLString === 'function' ) {
			return v.toHTMLString();
		}
		return typeof v === 'string' ? v : '';
	}

	/**
	 * 見出しの数を数える
	 *
	 * @param {Array} blocks
	 * @return {number}
	 */
	function countHeadings( blocks ) {
		var n = 0;
		( blocks || [] ).forEach( function ( b ) {
			if ( b && b.name === 'core/heading' ) {
				n++;
			}
			if ( b && b.innerBlocks && b.innerBlocks.length ) {
				n += countHeadings( b.innerBlocks );
			}
		} );
		return n;
	}

	/**
	 * 「文の途中で切れている段落」を数える
	 *
	 * 🚨 AI は1つの文を空行で刻んで書くことがある（「つまり、」だけで1段落 等）。
	 *    マークダウンとしては正しいので変換は通るが、読むと文がぶつ切りに見える。
	 *    勝手に繋ぐと書いた人の意図を壊すので、数えて知らせるだけにする。
	 *
	 * @param {Array} blocks
	 * @return {number}
	 */
	function countBrokenParagraphs( blocks ) {
		var list = blocks || [];
		var n = 0;
		list.forEach( function ( b, i ) {
			if ( ! b || b.name !== 'core/paragraph' ) {
				return;
			}
			// 次も段落のときだけ見る（箇条書き・表の前振りは正しい書き方なので数えない）
			var next = list[ i + 1 ];
			if ( ! next || next.name !== 'core/paragraph' ) {
				return;
			}
			var text = textOf( b.attributes && b.attributes.content )
				.replace( /<[^>]*>/g, '' )
				.trim();
			if ( /[、，]$/.test( text ) ) {
				n++;
			}
		} );
		return n;
	}

	/**
	 * 行内の飾りを数え、知らない飾りを見つける
	 *
	 * 🚨 コード囲み・行内コードの中は見ない。記事で記法そのものを
	 *    説明しているとき、その説明を「使いすぎ」と数えてしまうため。
	 *
	 * @param {string} body フロントマターを外した本文
	 * @return {{count: number, unknown: Object}}
	 */
	function scanInline( body ) {
		var known = window.LWMdInlineFormat ? window.LWMdInlineFormat.FORMATS : {};
		var lines = String( body == null ? '' : body ).split( '\n' );
		var inFence = window.LWMdDirectives.markFences( lines );
		var count = 0;
		var unknown = {};

		lines.forEach( function ( line, i ) {
			if ( inFence[ i ] ) {
				return;
			}
			line.split( /(`+[^`]*`+)/ ).forEach( function ( part ) {
				if ( part.charAt( 0 ) === '`' ) {
					return;
				}
				var m;
				INLINE_RE.lastIndex = 0;
				while ( ( m = INLINE_RE.exec( part ) ) !== null ) {
					if ( known[ m[ 1 ] ] ) {
						count++;
					} else {
						unknown[ m[ 1 ] ] = ( unknown[ m[ 1 ] ] || 0 ) + 1;
					}
				}
			} );
		} );

		return { count: count, unknown: unknown };
	}

	/**
	 * 使いすぎ・知らない飾りを言葉にする
	 *
	 * @param {Object} stats  convert() が作った stats
	 * @param {Object} inline scanInline() の結果
	 * @return {string[]}
	 */
	function overuse( stats, inline ) {
		var out = [];

		if ( stats.headings > LIMIT.headings ) {
			out.push(
				'見出しが ' + stats.headings + '個 あります（目安は3〜6個）。' +
					'多いと話が散って読みにくくなります'
			);
		}

		var total = 0;
		Object.keys( stats.directives || {} ).forEach( function ( k ) {
			total += stats.directives[ k ];
		} );
		if ( total > LIMIT.directives ) {
			out.push(
				'囲みの飾りが ' + total + '個 あります（目安は4〜6個）。多いと本文が読めなくなります'
			);
		}

		if ( inline.count > LIMIT.decorations ) {
			out.push(
				'文字の飾り（色・下線・マーカー）が ' + inline.count + '箇所 あります（目安は数個）。' +
					'多いとどこが大事か分からなくなります'
			);
		}

		Object.keys( inline.unknown ).forEach( function ( name ) {
			out.push(
				'「:' + name + '[…]」は知らない飾りなので、そのままの文字として残しました' +
					'（使えるのは :red / :main / :u / :marker）'
			);
		} );

		return out;
	}

	window.LWMdInspect = {
		countHeadings: countHeadings,
		countBrokenParagraphs: countBrokenParagraphs,
		scanInline: scanInline,
		overuse: overuse,
		LIMIT: LIMIT,
	};
} )();
