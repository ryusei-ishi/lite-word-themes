/**
 * LiteWord Markdown Paste ─ 投稿画面のサイドバー
 * ---------------------------------------------------------------
 * 「マークダウンを貼る」パネル。貼る → 下見する → 記事に入れる。
 * 画面の組み立てだけを持ち、変換は convert.js / apply-meta.js に任せる。
 */
( function () {
	'use strict';

	var el = wp.element.createElement;
	var useState = wp.element.useState;
	var Fragment = wp.element.Fragment;
	var registerPlugin = wp.plugins.registerPlugin;

	var editorPkg = wp.editor && wp.editor.PluginSidebar ? wp.editor : wp.editPost;
	var PluginSidebar = editorPkg.PluginSidebar;
	var PluginSidebarMoreMenuItem = editorPkg.PluginSidebarMoreMenuItem;

	var C = wp.components;
	var NAME = 'lw-markdown-paste';
	var ICON = 'editor-code';

	/** 下見の結果を出す小さな表示部品 */
	function Report( props ) {
		var r = props.result;
		if ( ! r ) {
			return null;
		}
		var lines = [ 'ブロック ' + r.stats.blockCount + '個', '見出し ' + r.stats.headings + '個' ];
		Object.keys( r.stats.directives ).forEach( function ( k ) {
			lines.push( ':::' + k + ' ' + r.stats.directives[ k ] + '個' );
		} );
		var metaKeys = Object.keys( r.meta );

		return el(
			'div',
			{ className: 'report' },
			el( 'p', { className: 'line' }, lines.join( ' / ' ) ),
			metaKeys.length
				? el(
						'p',
						{ className: 'line' },
						'設定として読めたもの: ' + metaKeys.join( '、' )
				  )
				: null,
			r.warnings.length
				? el(
						'ul',
						{ className: 'warn' },
						r.warnings.map( function ( w, i ) {
							return el( 'li', { key: i }, w );
						} )
				  )
				: null
		);
	}

	function Panel() {
		var s1 = useState( '' );
		var text = s1[ 0 ];
		var setText = s1[ 1 ];

		var s2 = useState( null );
		var result = s2[ 0 ];
		var setResult = s2[ 1 ];

		var s3 = useState( 'append' );
		var mode = s3[ 0 ];
		var setMode = s3[ 1 ];

		var s4 = useState( '' );
		var notice = s4[ 0 ];
		var setNotice = s4[ 1 ];

		function preview() {
			setNotice( '' );
			if ( text.trim() === '' ) {
				setResult( null );
				setNotice( 'マークダウンを貼ってください。' );
				return;
			}
			try {
				setResult( window.LWMdConvert.convert( text ) );
			} catch ( e ) {
				setResult( null );
				setNotice( '変換できませんでした: ' + e.message );
			}
		}

		function insert() {
			var r = result;
			if ( ! r ) {
				try {
					r = window.LWMdConvert.convert( text );
				} catch ( e ) {
					setNotice( '変換できませんでした: ' + e.message );
					return;
				}
			}
			if ( r.blocks.length === 0 ) {
				setNotice( '入れられる中身がありませんでした。' );
				return;
			}

			var be = wp.data.dispatch( 'core/block-editor' );
			if ( mode === 'replace' ) {
				be.resetBlocks( r.blocks );
			} else {
				var count = wp.data.select( 'core/block-editor' ).getBlockCount();
				be.insertBlocks( r.blocks, count );
			}

			window.LWMdMeta.apply( r.meta ).then( function ( m ) {
				var msg = 'ブロック ' + r.blocks.length + '個を入れました。';
				if ( m.applied.length ) {
					msg += ' 反映: ' + m.applied.join( '、' ) + '。';
				}
				setNotice( msg );
				if ( m.warnings.length ) {
					setResult( Object.assign( {}, r, { warnings: r.warnings.concat( m.warnings ) } ) );
				}
			} );
		}

		return el(
			'div',
			{ className: 'lwmd_panel' },
			el(
				'p',
				{ className: 'lead' },
				'AI に書いてもらったマークダウンをそのまま貼り付けてください。見出し・箇条書き・表・リンクはもちろん、',
				el( 'code', null, ':::box' ),
				' などの記法も LiteWord のデザインに変わります。'
			),
			el( C.TextareaControl, {
				className: 'input',
				label: 'マークダウン',
				value: text,
				rows: 14,
				onChange: function ( v ) {
					setText( v );
					setResult( null );
				},
				placeholder: '---\ntitle: 記事のタイトル\ncategory: お知らせ\n---\n\n## 見出し\n\n本文…',
			} ),
			el( C.RadioControl, {
				label: '入れ方',
				selected: mode,
				options: [
					{ label: '記事の末尾に足す', value: 'append' },
					{ label: '記事の中身をすべて入れ替える', value: 'replace' },
				],
				onChange: setMode,
			} ),
			el(
				'div',
				{ className: 'actions' },
				el( C.Button, { variant: 'secondary', onClick: preview }, '下見する' ),
				el( C.Button, { variant: 'primary', onClick: insert }, '記事に入れる' )
			),
			notice ? el( C.Notice, { status: 'info', isDismissible: false }, notice ) : null,
			el( Report, { result: result } )
		);
	}

	function Sidebar() {
		return el(
			Fragment,
			null,
			el( PluginSidebarMoreMenuItem, { target: NAME, icon: ICON }, 'マークダウンを貼る' ),
			el( PluginSidebar, { name: NAME, title: 'マークダウンを貼る', icon: ICON }, el( Panel, null ) )
		);
	}

	registerPlugin( NAME, { render: Sidebar, icon: ICON } );
} )();
