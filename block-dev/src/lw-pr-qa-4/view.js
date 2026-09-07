/**
 * lw-pr-qa-4 — フロントの動き（タブの切り替え）
 *
 * 🚨 このファイルが読み込まれなくてもページは壊れない。
 *    CSS の既定は「タブは非表示・分類名を出す・パネルは全部表示」で、
 *    ここで .is-js を付けたときだけ「タブ表示・分類名を隠す・1つだけ表示」に変わる。
 *
 * 🚨 1ページに同じブロックを2つ置いても混ざらないよう、必ず root の中だけを見る。
 *    document.querySelectorAll('.qa-4__tab') のような書き方をしないこと。
 */
( function () {
    'use strict';

    function setup( root ) {
        var tabs = root.querySelectorAll( '.qa-4__tab' );
        var panels = root.querySelectorAll( '.qa-4__panel' );

        // 分類が1つも無い／片方しか無いときは何もしない（縦に全部出たままになる）
        if ( ! tabs.length || tabs.length !== panels.length ) {
            return;
        }

        function activate( index ) {
            for ( var i = 0; i < tabs.length; i++ ) {
                var on = i === index;
                tabs[ i ].classList.toggle( 'is-active', on );
                tabs[ i ].setAttribute( 'aria-selected', on ? 'true' : 'false' );
                // 選ばれていないタブは Tab キーの移動先から外す（矢印キーで動かす作法）
                tabs[ i ].setAttribute( 'tabindex', on ? '0' : '-1' );
                panels[ i ].classList.toggle( 'is-active', on );
            }
        }

        for ( var i = 0; i < tabs.length; i++ ) {
            ( function ( n ) {
                tabs[ n ].addEventListener( 'click', function () {
                    activate( n );
                } );
                tabs[ n ].addEventListener( 'keydown', function ( e ) {
                    var step = 0;
                    if ( e.key === 'ArrowRight' || e.key === 'Right' ) {
                        step = 1;
                    } else if ( e.key === 'ArrowLeft' || e.key === 'Left' ) {
                        step = -1;
                    } else {
                        return;
                    }
                    e.preventDefault();
                    var next = ( n + step + tabs.length ) % tabs.length;
                    activate( next );
                    tabs[ next ].focus();
                } );
            } )( i );
        }

        root.classList.add( 'is-js' );
        activate( 0 );
    }

    function init() {
        var roots = document.querySelectorAll( '.lw-pr-qa-4' );
        for ( var i = 0; i < roots.length; i++ ) {
            setup( roots[ i ] );
        }
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }
} )();
