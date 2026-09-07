/**
 * lw-pr-qa-6 — フロントの動き（分類をクリックで移動・いま読んでいる分類を光らせる）
 *
 * 🚨 このファイルが読み込まれなくてもページは壊れない。
 *    CSS の既定は「分類一覧は非表示・1カラム」で、
 *    ここで .is-js を付けたときだけ2カラムになり、一覧が出る。
 *
 * 🚨 見出しに id が無い作りなので、飛び先は data-qa6-group の番号で探す。
 *    1ページに同じブロックを2つ置いても混ざらないよう、必ず root の中だけを見る。
 */
( function () {
    'use strict';

    /* 固定ヘッダーに隠れないよう、避ける高さを測る。
       LiteWord のヘッダーはスクロールすると .fixed_on が付いて position:fixed になる。
       管理バー（#wpadminbar）もログイン中は上にいる。 */
    function offsetTop() {
        var pad = 16;
        var header = document.querySelector( '.lw_header_main.fixed_on' );
        if ( header ) {
            pad += header.offsetHeight;
        }
        var bar = document.getElementById( 'wpadminbar' );
        if ( bar && window.getComputedStyle( bar ).position === 'fixed' ) {
            pad += bar.offsetHeight;
        }
        return pad;
    }

    function setup( root ) {
        var links = root.querySelectorAll( '.qa-6__nav-link' );
        var groups = root.querySelectorAll( '.qa-6__group' );

        // 分類が無い／数が合わないときは何もしない（1カラムのまま出る）
        if ( ! links.length || links.length !== groups.length ) {
            return;
        }

        function mark( index ) {
            for ( var i = 0; i < links.length; i++ ) {
                links[ i ].classList.toggle( 'is-active', i === index );
            }
        }

        for ( var i = 0; i < links.length; i++ ) {
            ( function ( n ) {
                links[ n ].addEventListener( 'click', function () {
                    var target = groups[ n ];
                    var y =
                        target.getBoundingClientRect().top + window.pageYOffset - offsetTop();
                    window.scrollTo( { top: y, behavior: 'smooth' } );
                    mark( n );
                } );
            } )( i );
        }

        /* いま画面に見えている分類を光らせる。
           IntersectionObserver が無いブラウザでは光らないだけで、移動はできる。 */
        if ( typeof window.IntersectionObserver === 'function' ) {
            var visible = {};
            var observer = new window.IntersectionObserver(
                function ( entries ) {
                    for ( var e = 0; e < entries.length; e++ ) {
                        var idx = Number(
                            entries[ e ].target.getAttribute( 'data-qa6-group' )
                        );
                        visible[ idx ] = entries[ e ].isIntersecting;
                    }
                    // 見えているもののうち、いちばん上のものを「いま読んでいる分類」にする
                    for ( var k = 0; k < groups.length; k++ ) {
                        if ( visible[ k ] ) {
                            mark( k );
                            return;
                        }
                    }
                },
                {
                    // 画面の上のほう（上から 20% の帯）に入った分類を「読んでいる」とみなす
                    rootMargin: '-20% 0px -70% 0px',
                    threshold: 0,
                }
            );
            for ( var g = 0; g < groups.length; g++ ) {
                observer.observe( groups[ g ] );
            }
        }

        root.classList.add( 'is-js' );
        mark( 0 );
    }

    function init() {
        var roots = document.querySelectorAll( '.lw-pr-qa-6' );
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
