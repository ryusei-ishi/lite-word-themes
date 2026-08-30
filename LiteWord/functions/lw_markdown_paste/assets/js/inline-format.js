/**
 * LiteWord Markdown Paste ─ 行内の飾り（色・下線・マーカー）
 * ---------------------------------------------------------------
 * マークダウンには色や下線の書き方が無いので、`:名前[テキスト]` を用意する。
 * 変換し終わったブロックの文字列属性に対して、後から差し込む。
 *
 * 🚨 出力する HTML は WordPress 標準の書式（core/text-color・core/underline）に
 *    そろえてある。独自のクラスを作らないこと。編集画面のツールバーで
 *    そのまま外したり変えたりできるのは、標準の形で書いてあるから。
 */
( function () {
	'use strict';

	/** 使える名前と、置き換える HTML */
	var FORMATS = {
		// 赤字（注意・警告）
		red: '<mark style="background-color:rgba(0, 0, 0, 0);color:#cf2e2e" class="has-inline-color">$1</mark>',
		// サイトのメインカラー（テーマの色に自動で追従する）
		main: '<mark style="background-color:rgba(0, 0, 0, 0);color:var(--color-main)" class="has-inline-color">$1</mark>',
		// 下線
		u: '<span style="text-decoration: underline;">$1</span>',
		// 黄色いマーカー
		marker: '<mark style="background-color:#fcff41;color:#000" class="has-inline-color has-inline-background-color">$1</mark>',
	};

	/** `:red[…]` を拾う。中身に `]` は入れられない（入れ子は受け付けない） */
	var RE = /:([a-z]+)\[([^\]]*)\]/g;

	/** 中身をそのまま見せるブロック。ここは変換しない */
	var SKIP_BLOCKS = [ 'core/code', 'core/preformatted', 'core/html' ];

	/**
	 * 文字列1つぶんを変換する
	 *
	 * @param {string} text
	 * @return {string}
	 */
	function apply( text ) {
		// 🚨 <code> の中は変換しない。記事の中で「:red[…] と書きます」と
		//    説明するとき、その説明文まで色が付いてしまうため。
		return String( text )
			.split( /(<code[\s\S]*?<\/code>)/i )
			.map( function ( part ) {
				if ( /^<code/i.test( part ) ) {
					return part;
				}
				return part.replace( RE, function ( whole, name, inner ) {
					var tpl = FORMATS[ name ];
					return tpl ? tpl.replace( '$1', inner ) : whole;
				} );
			} )
			.join( '' );
	}

	/**
	 * 属性の値を文字列として読む
	 *
	 * 🚨 リッチテキストの属性（core/paragraph の content など）は素の文字列ではなく
	 *    RichTextData オブジェクトで入っている。typeof で 'string' を見るだけだと素通りする。
	 *
	 * @param {*} v
	 * @return {string|null} 文字列として読めないときは null
	 */
	function readText( v ) {
		if ( typeof v === 'string' ) {
			return v;
		}
		if ( v && typeof v.toHTMLString === 'function' ) {
			return v.toHTMLString();
		}
		return null;
	}

	/**
	 * 読んだときと同じ形で書き戻す
	 *
	 * @param {*}      original 元の値
	 * @param {string} html     差し込み後のHTML
	 * @return {*}
	 */
	function writeText( original, html ) {
		var RTD = window.wp && wp.richText && wp.richText.RichTextData;
		if ( original && typeof original.toHTMLString === 'function' && RTD && RTD.fromHTMLString ) {
			return RTD.fromHTMLString( html );
		}
		return html;
	}

	/**
	 * 値ひとつを見て、必要なら差し込んだ値を返す（変わらなければ undefined）
	 *
	 * @param {*} v
	 * @return {*}
	 */
	function convertValue( v ) {
		var text = readText( v );
		if ( text === null || text.indexOf( ':' ) === -1 ) {
			return undefined;
		}
		var next = apply( text );
		return next === text ? undefined : writeText( v, next );
	}

	/**
	 * ブロックの木をたどって、文字列属性に飾りを差し込む
	 *
	 * @param {Array} blocks
	 * @return {Array} 同じ配列（中身を書き換える）
	 */
	function applyToBlocks( blocks ) {
		( blocks || [] ).forEach( function ( b ) {
			if ( ! b || ! b.attributes ) {
				return;
			}
			// 🚨 コードを見せるためのブロックには触らない
			if ( SKIP_BLOCKS.indexOf( b.name ) !== -1 ) {
				return;
			}
			Object.keys( b.attributes ).forEach( function ( k ) {
				var v = b.attributes[ k ];

				if ( Array.isArray( v ) ) {
					// contents:[{text:…}] のような配列も見る
					v.forEach( function ( item ) {
						if ( item && typeof item === 'object' ) {
							Object.keys( item ).forEach( function ( ik ) {
								var nx = convertValue( item[ ik ] );
								if ( nx !== undefined ) {
									item[ ik ] = nx;
								}
							} );
						}
					} );
					return;
				}

				var next = convertValue( v );
				if ( next !== undefined ) {
					b.attributes[ k ] = next;
				}
			} );
			if ( b.innerBlocks && b.innerBlocks.length ) {
				applyToBlocks( b.innerBlocks );
			}
		} );
		return blocks;
	}

	window.LWMdInlineFormat = { apply: apply, applyToBlocks: applyToBlocks, FORMATS: FORMATS };
} )();
