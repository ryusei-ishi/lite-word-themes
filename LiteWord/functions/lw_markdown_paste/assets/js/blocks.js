/**
 * LiteWord Markdown Paste ─ 文章の飾りの記法をブロックに変える
 * ---------------------------------------------------------------
 * 誘導系（:::voice / :::button / :::cta）は blocks-cta.js
 * ---------------------------------------------------------------
 * 1記法 = 1関数。ブロックが使えない環境（無料プランや将来の削除）でも
 * 記事が壊れないよう、すべての記法に「標準ブロックでの代わり」を用意する。
 */
( function () {
	'use strict';

	var D = window.LWMdDirectives;
	var H = window.LWMdBlockHelpers;
	var usable = H.usable;
	var inline = H.inline;
	var create = H.create;

	/* ============================================================
	 * 各記法
	 * ========================================================== */

	/** :::box … ::: → 枠 01（中身は入れ子のブロック） */
	function box( seg, ctx ) {
		var inner = ctx.markdownToBlocks( seg.body );
		if ( inner.length === 0 ) {
			inner = [ create( 'core/paragraph', { content: '' } ) ];
		}
		if ( usable( 'wdl/lw-pr-waku-1' ) ) {
			return [ create( 'wdl/lw-pr-waku-1', {}, inner ) ];
		}
		return [ create( 'core/group', {}, inner ) ];
	}

	/** :::check … ::: → チェックマーク付きリスト */
	function check( seg ) {
		var items = D.parseListItems( seg.body );
		if ( items.length === 0 ) {
			return [];
		}
		if ( usable( 'wdl/lw-list-3' ) ) {
			return [
				create( 'wdl/lw-list-3', {
					contents: items.map( function ( t ) {
						return { text: inline( t ) };
					} ),
				} ),
			];
		}
		return [
			create(
				'core/list',
				{},
				items.map( function ( t ) {
					return create( 'core/list-item', { content: inline( t ) } );
				} )
			),
		];
	}

	/** :::steps … ::: → 番号付きリスト */
	function steps( seg ) {
		var items = D.parseListItems( seg.body );
		if ( items.length === 0 ) {
			return [];
		}
		if ( usable( 'wdl/lw-list-1' ) ) {
			return [
				create( 'wdl/lw-list-1', {
					contents: items.map( function ( t, i ) {
						return { text: inline( t ), number: String( i + 1 ) };
					} ),
				} ),
			];
		}
		return [
			create(
				'core/list',
				{ ordered: true },
				items.map( function ( t ) {
					return create( 'core/list-item', { content: inline( t ) } );
				} )
			),
		];
	}

	/** :::qa … ::: → よくある質問（Q: / A: の組） */
	function qa( seg ) {
		var pairs = [];
		var current = null;
		seg.body.split( '\n' ).forEach( function ( line ) {
			var q = line.match( /^[ \t]*(?:Q|q|Ｑ)[:：][ \t]*(.*)$/ );
			var a = line.match( /^[ \t]*(?:A|a|Ａ)[:：][ \t]*(.*)$/ );
			if ( q ) {
				current = { text_q: q[ 1 ].trim(), text_a: '' };
				pairs.push( current );
			} else if ( a && current ) {
				current.text_a = a[ 1 ].trim();
			} else if ( current && line.trim() !== '' ) {
				// 回答の続きの行
				current.text_a += ( current.text_a ? '\n' : '' ) + line.trim();
			}
		} );

		pairs = pairs.filter( function ( p ) {
			return p.text_q !== '';
		} );
		if ( pairs.length === 0 ) {
			return [];
		}

		// ⚠ lw-qa-1 に blockId は書かない（開閉のJSが自力で親を辿るため）
		if ( usable( 'wdl/lw-qa-1' ) ) {
			return [
				create( 'wdl/lw-qa-1', {
					contents: pairs.map( function ( p ) {
						return { text_q: p.text_q, text_a: p.text_a };
					} ),
				} ),
			];
		}
		var out = [];
		pairs.forEach( function ( p ) {
			out.push( create( 'core/heading', { level: 3, content: inline( p.text_q ) } ) );
			out.push( create( 'core/paragraph', { content: inline( p.text_a ) } ) );
		} );
		return out;
	}

	var CTA = window.LWMdBlocksCta;
	var HANDLERS = {
		box: box,
		check: check,
		steps: steps,
		qa: qa,
		voice: CTA.voice,
		button: CTA.button,
		cta: CTA.cta,
	};

	/**
	 * 断片1つをブロックの配列にする
	 *
	 * @param {Object} seg directives.split() が返した directive 断片
	 * @param {Object} ctx { markdownToBlocks: function }
	 * @return {Array}
	 */
	function build( seg, ctx ) {
		var fn = HANDLERS[ seg.name ];
		return fn ? fn( seg, ctx ) : [];
	}

	window.LWMdBlocks = { build: build, HANDLERS: HANDLERS };
} )();
