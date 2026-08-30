/**
 * LiteWord Markdown Paste ─ フロントマターを投稿に反映する
 * ---------------------------------------------------------------
 * タイトル・スラッグ・カテゴリー・タグ・アイキャッチはエディタのデータストアへ。
 * 説明文（seo_description）だけはテーマの従来メタボックスが持っているので、
 * その入力欄に書き込む（保存の仕組みを変えないため）。
 *
 * 🚨 カテゴリー・タグは「無ければ作らない」。勝手に分類が増えると
 *    利用者のサイトが散らかるので、見つからないときは知らせるだけにする。
 */
( function () {
	'use strict';

	/**
	 * 名前から分類の ID を引く（完全一致のみ）
	 *
	 * @param {string} taxRoute 'categories' か 'tags'
	 * @param {string} name
	 * @return {Promise<number|null>}
	 */
	function findTermId( taxRoute, name ) {
		return wp
			.apiFetch( { path: '/wp/v2/' + taxRoute + '?per_page=100&search=' + encodeURIComponent( name ) } )
			.then( function ( list ) {
				var hit = ( list || [] ).filter( function ( t ) {
					return t.name === name || String( t.slug ) === name;
				} );
				return hit.length ? hit[ 0 ].id : null;
			} )
			.catch( function () {
				return null;
			} );
	}

	/**
	 * アイキャッチを決める。数字ならそのまま添付ID、URLならファイル名で探す。
	 *
	 * @param {string} value
	 * @return {Promise<number|null>}
	 */
	function resolveEyecatch( value ) {
		if ( /^\d+$/.test( value ) ) {
			return Promise.resolve( parseInt( value, 10 ) );
		}
		var base = String( value ).split( '/' ).pop().replace( /\.[a-z0-9]+$/i, '' );
		if ( ! base ) {
			return Promise.resolve( null );
		}
		return wp
			.apiFetch( { path: '/wp/v2/media?per_page=20&search=' + encodeURIComponent( base ) } )
			.then( function ( list ) {
				return list && list.length ? list[ 0 ].id : null;
			} )
			.catch( function () {
				return null;
			} );
	}

	/**
	 * テーマのメタボックスの入力欄に書き込む
	 *
	 * @param {string} fieldName name 属性
	 * @param {string} value
	 * @return {boolean} 書けたら true
	 */
	function fillMetaBoxField( fieldName, value ) {
		var el = document.querySelector( '[name="' + fieldName + '"]' );
		if ( ! el ) {
			return false;
		}
		el.value = value;
		el.dispatchEvent( new Event( 'input', { bubbles: true } ) );
		el.dispatchEvent( new Event( 'change', { bubbles: true } ) );
		return true;
	}

	/**
	 * フロントマターを投稿に反映する
	 *
	 * @param {Object} meta frontmatter.parse() の meta
	 * @return {Promise<{applied: string[], warnings: string[]}>}
	 */
	function apply( meta ) {
		var editPost = wp.data.dispatch( 'core/editor' ).editPost;
		var applied = [];
		var warnings = [];
		var jobs = [];

		if ( meta.title ) {
			editPost( { title: meta.title } );
			applied.push( 'タイトル' );
		}
		if ( meta.slug ) {
			editPost( { slug: meta.slug } );
			applied.push( 'スラッグ' );
		}

		if ( meta.description ) {
			if ( fillMetaBoxField( 'seo_description', meta.description ) ) {
				applied.push( '説明文（検索結果の要約）' );
			} else {
				warnings.push(
					'説明文の入力欄が見つかりませんでした。カスタマイザーで SEO 機能をONにするか、' +
						'「その他の設定」に手で入れてください'
				);
			}
		}

		if ( meta.category ) {
			jobs.push(
				findTermId( 'categories', meta.category ).then( function ( id ) {
					if ( id ) {
						editPost( { categories: [ id ] } );
						applied.push( 'カテゴリー' );
					} else {
						warnings.push(
							'カテゴリー「' + meta.category + '」が見つかりませんでした（新しくは作りません）。先に作ってから貼り直してください'
						);
					}
				} )
			);
		}

		if ( meta.tags && meta.tags.length ) {
			jobs.push(
				Promise.all(
					meta.tags.map( function ( t ) {
						return findTermId( 'tags', t );
					} )
				).then( function ( ids ) {
					var found = ids.filter( Boolean );
					var missing = meta.tags.filter( function ( t, i ) {
						return ! ids[ i ];
					} );
					if ( found.length ) {
						editPost( { tags: found } );
						applied.push( 'タグ ' + found.length + '件' );
					}
					if ( missing.length ) {
						warnings.push( '無いタグは飛ばしました: ' + missing.join( '、' ) );
					}
				} )
			);
		}

		if ( meta.eyecatch ) {
			jobs.push(
				resolveEyecatch( meta.eyecatch ).then( function ( id ) {
					if ( id ) {
						editPost( { featured_media: id } );
						applied.push( 'アイキャッチ' );
					} else {
						warnings.push(
							'アイキャッチ「' + meta.eyecatch + '」がメディアの中に見つかりませんでした。先にアップロードしてください'
						);
					}
				} )
			);
		}

		return Promise.all( jobs ).then( function () {
			return { applied: applied, warnings: warnings };
		} );
	}

	window.LWMdMeta = { apply: apply, findTermId: findTermId, fillMetaBoxField: fillMetaBoxField };
} )();
