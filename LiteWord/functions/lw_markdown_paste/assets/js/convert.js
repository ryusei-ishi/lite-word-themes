/**
 * LiteWord Markdown Paste ─ 変換の本線
 * ---------------------------------------------------------------
 * 下ごしらえ（sanitize）→ フロントマターを外す → ::: を切り出す →
 * 素の部分は WordPress 自身の変換器（pasteHandler）に渡す →
 * 拡張記法は blocks.js でブロックにする → 最後に点検（inspect）。
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
		var pre = window.LWMdSanitize.prepare( markdown );
		var fm = window.LWMdFrontmatter.parse( pre.text );
		var split = window.LWMdDirectives.split( fm.body );
		var warnings = pre.warnings.concat( fm.warnings, split.warnings );

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

		var inspect = window.LWMdInspect;

		var broken = inspect.countBrokenParagraphs( blocks );
		if ( broken ) {
			warnings.push(
				'文の途中で切れている段落が ' + broken + '個 あります（段落の最後が「、」で終わっています）。' +
					'AI が1つの文を空行で刻んだときに起きます。そのまま入りますが、読みにくければ書き直してください'
			);
		}

		// 行内の飾り（:red[…] / :u[…] など）を最後にまとめて差し込む
		if ( window.LWMdInlineFormat ) {
			window.LWMdInlineFormat.applyToBlocks( blocks );
		}

		var stats = {
			blockCount: blocks.length,
			directives: used,
			headings: inspect.countHeadings( blocks ),
		};

		// 使いすぎ・知らない飾りは最後にまとめて言う（本文には手を入れない）
		warnings = warnings.concat( inspect.overuse( stats, inspect.scanInline( fm.body ) ) );

		return {
			meta: fm.meta,
			blocks: blocks,
			warnings: warnings,
			stats: stats,
		};
	}

	window.LWMdConvert = { convert: convert, markdownToBlocks: markdownToBlocks };
} )();
