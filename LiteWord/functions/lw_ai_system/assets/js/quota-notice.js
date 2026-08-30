/**
 * AI生成の「本日の残り回数」をブロックエディタに出す
 * ------------------------------------------------------------------
 * IdeaVoice #124 の #359（2026-08-23）
 *
 * これまで上限（ページ生成 無料3回／プレミアム15回、AI呼び出し 1000回/日、
 * 画像 300枚/日）はどれも画面に出ておらず、利用者は上限に当たって初めて
 * 「本日のAI利用回数の上限に達しました」と知らされる状態だった。
 *
 * 数字は lwAiGeneratorData.quota（サーバー側で計算済み）から読む。通信はしない。
 *
 * 出す条件は「知りたい人にだけ出す」:
 *   - 上限が無い人（管理者）には出さない
 *   - まだ1回も使っていない人には出さない（毎回の通知は邪魔なだけ）
 *   - 残りが少ない（3以下）か、使い切った場合は使用実績が無くても出す
 * 使い切っているときは警告色、それ以外は情報色。どちらも閉じられる。
 */
( function () {
	'use strict';

	var LOW = 3; // これ以下になったら使っていなくても知らせる

	function ready( fn ) {
		if ( window.wp && wp.domReady ) { wp.domReady( fn ); return; }
		if ( document.readyState !== 'loading' ) { fn(); return; }
		document.addEventListener( 'DOMContentLoaded', fn );
	}

	ready( function () {
		var data = window.lwAiGeneratorData;
		if ( ! data || ! data.quota ) { return; }

		var q = data.quota;
		if ( q.unlimited ) { return; } // 管理者など上限が無い人

		// 有限の上限だけを対象にする
		var items = [
			{ key: 'pages',  label: 'ページ生成', unit: '回', v: q.pages },
			{ key: 'calls',  label: 'AIの呼び出し', unit: '回', v: q.calls },
			{ key: 'images', label: '画像の生成', unit: '枚', v: q.images }
		].filter( function ( it ) {
			return it.v && typeof it.v.limit === 'number' && it.v.limit >= 0;
		} );

		if ( ! items.length ) { return; }

		var used = items.some( function ( it ) { return it.v.used > 0; } );
		var low  = items.some( function ( it ) { return it.v.remaining <= LOW; } );
		var out  = items.some( function ( it ) { return it.v.remaining <= 0; } );

		if ( ! used && ! low ) { return; } // まだ使っていなくて余裕もある → 黙っている

		var parts = items.map( function ( it ) {
			return it.label + ' あと' + it.v.remaining + it.unit + '（' + it.v.used + '/' + it.v.limit + '）';
		} );

		var text = 'AI機能の本日の残り: ' + parts.join( ' ／ ' );
		if ( q.resetsAt ) { text += '。' + q.resetsAt + 'にリセットされます。'; }
		if ( out ) { text = '本日のAI機能の上限に達しました。' + text; }

		if ( ! ( window.wp && wp.data && wp.data.dispatch( 'core/notices' ) ) ) {
			return; // 通知の口が無い環境では何もしない（エディタを壊さない）
		}

		wp.data.dispatch( 'core/notices' ).createNotice(
			out ? 'warning' : 'info',
			text,
			{ id: 'lw-ai-quota-notice', isDismissible: true }
		);
	} );
} )();
