/**
 * LiteWord Markdown Paste ─ 変換の本線
 * ---------------------------------------------------------------
 * フロントマターを外す → ::: を切り出す → 素の部分は WordPress 自身の
 * 変換器（pasteHandler）に渡す → 拡張記法は blocks.js でブロックにする。
 *
 * 🚨 変換をブラウザの中で終わらせるのが肝。サーバーへ完成HTMLを送ると
 *    KSES が <picture>/<svg>/<iframe> を削り、バックスラッシュも1段剥がれる
 *    （skills/sample-page-factory/SKILL.md の「5つの罠」）。
 */
( function () {
	'use strict';

	/**
	 * 素のマークダウンをブロックの配列にする。
	 * WordPress に同梱の marked（GFM）をそのまま使うので、
	 * 見出し・リスト・引用・表・コード・画像・リンクが標準どおりに効く。
	 *
	 * @param {string} text
	 * @return {Array}
	 */
	function markdownToBlocks( text ) {
		var src = String( text == null ? '' : text );
		if ( src.trim() === '' ) {
			return [];
		}
		var blocks = wp.blocks.pasteHandler( { plainText: src, mode: 'BLOCKS' } );
		if ( typeof blocks === 'string' ) {
			// INLINE に落ちたときの保険
			return [ wp.blocks.createBlock( 'core/paragraph', { content: blocks } ) ];
		}
		return Array.isArray( blocks ) ? blocks : [];
	}

	/**
	 * 貼り付けられた全文を「投稿に入れられる形」に変える
	 *
	 * @param {string} markdown
	 * @return {{meta: Object, blocks: Array, warnings: string[], stats: Object}}
	 */
	function convert( markdown ) {
		var fm = window.LWMdFrontmatter.parse( markdown );
		var split = window.LWMdDirectives.split( fm.body );
		var warnings = fm.warnings.concat( split.warnings );

		var blocks = [];
		var used = {};

		split.segments.forEach( function ( seg ) {
			if ( seg.type === 'markdown' ) {
				blocks = blocks.concat( markdownToBlocks( seg.text ) );
				return;
			}
			var made = window.LWMdBlocks.build( seg, { markdownToBlocks: markdownToBlocks } );
			if ( made.length === 0 ) {
				warnings.push( seg.line + '行目の「:::' + seg.name + '」は中身が空だったので飛ばしました' );
				return;
			}
			used[ seg.name ] = ( used[ seg.name ] || 0 ) + 1;
			blocks = blocks.concat( made );
		} );

		// 行内の飾り（:red[…] / :u[…] など）を最後にまとめて差し込む
		if ( window.LWMdInlineFormat ) {
			window.LWMdInlineFormat.applyToBlocks( blocks );
		}

		return {
			meta: fm.meta,
			blocks: blocks,
			warnings: warnings,
			stats: {
				blockCount: blocks.length,
				directives: used,
				headings: countHeadings( blocks ),
			},
		};
	}

	/**
	 * 見出しの数を数える（貼る前の目安表示に使う）
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

	window.LWMdConvert = { convert: convert, markdownToBlocks: markdownToBlocks };
} )();
