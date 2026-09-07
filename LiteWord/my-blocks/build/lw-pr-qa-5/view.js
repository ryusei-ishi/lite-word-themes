/**
 * lw-pr-qa-5 — フロントの動き（検索して絞り込む・押すと開く）
 *
 * 🚨 このファイルが読み込まれなくてもページは壊れない。
 *    CSS の既定は「検索窓・件数・見つかりませんは非表示／回答は全部開いている」で、
 *    ここで .is-js を付けたときだけ検索窓が出て、回答が畳まれる。
 *
 * 🚨 1ページに同じブロックを2つ置いても混ざらないよう、必ず root の中だけを見る。
 *
 * 【日本語の探し方について】
 *   ひらがな・カタカナ・全角半角・大文字小文字の違いは吸収する（normalize()）。
 *   漢字とかなの違いは吸収できないので、それは block.json の keywords でおぎなう作り。
 */
( function () {
    'use strict';

    /* 検索のために文字をそろえる。
       ① NFKC で全角英数・半角カナをふつうの形に
       ② 小文字に
       ③ カタカナをひらがなに（「ヨヤク」も「よやく」も同じ扱いにする）
       ④ 続いた空白を1つに */
    function normalize( s ) {
        if ( ! s ) {
            return '';
        }
        var t = String( s );
        if ( t.normalize ) {
            t = t.normalize( 'NFKC' );
        }
        t = t.toLowerCase();
        t = t.replace( /[ァ-ヶ]/g, function ( c ) {
            return String.fromCharCode( c.charCodeAt( 0 ) - 0x60 );
        } );
        // 長音・中黒・読点は探すときの邪魔になるので落とす
        t = t.replace( /[ー・、。,.\-_/]/g, ' ' );
        return t.replace( /\s+/g, ' ' ).trim();
    }

    function setup( root ) {
        var input = root.querySelector( '.qa-5__input' );
        var items = root.querySelectorAll( '.qa-5__item' );
        if ( ! items.length ) {
            return;
        }

        var clearBtn = root.querySelector( '.qa-5__clear' );
        var countShown = root.querySelector( '.qa-5__count-shown' );
        var empty = root.querySelector( '.qa-5__empty' );
        var hints = root.querySelectorAll( '.qa-5__hint' );
        var isAccordion = root.classList.contains( 'qa-5--accordion' );

        /* 各項目の「探す用の文字列」を1度だけ作って持たせる。
           入力のたびに textContent を読み直すと、質問が多いページで重くなる。 */
        var keys = [];
        for ( var i = 0; i < items.length; i++ ) {
            var q = items[ i ].querySelector( '.qa-5__q-text' );
            var a = items[ i ].querySelector( '.qa-5__a-text' );
            var kw = items[ i ].getAttribute( 'data-qa5-keywords' ) || '';
            keys.push(
                normalize(
                    ( q ? q.textContent : '' ) +
                        ' ' +
                        ( a ? a.textContent : '' ) +
                        ' ' +
                        kw
                )
            );
        }

        function filter( raw ) {
            var words = normalize( raw ).split( ' ' ).filter( Boolean );
            var shown = 0;

            for ( var i = 0; i < items.length; i++ ) {
                var hit = true;
                // 入れた語を「全部ふくむもの」だけ残す（AND）
                for ( var w = 0; w < words.length; w++ ) {
                    if ( keys[ i ].indexOf( words[ w ] ) === -1 ) {
                        hit = false;
                        break;
                    }
                }
                items[ i ].classList.toggle( 'is-hidden', ! hit );
                if ( hit ) {
                    shown++;
                }
            }

            if ( countShown ) {
                countShown.textContent = String( shown );
            }
            if ( empty ) {
                empty.classList.toggle( 'is-shown', shown === 0 );
            }
            if ( clearBtn ) {
                clearBtn.classList.toggle( 'is-shown', words.length > 0 );
            }
        }

        if ( input ) {
            // 🚨 autocomplete は save() ではなくここで付ける。
            //    camelCase の属性を save() に書くと保存HTMLと食い違うため（save.js のコメント参照）
            input.setAttribute( 'autocomplete', 'off' );
            input.addEventListener( 'input', function () {
                filter( input.value );
            } );
            // Enter でページが送信されないように（フォームの中に置かれることがある）
            input.addEventListener( 'keydown', function ( e ) {
                if ( e.key === 'Enter' ) {
                    e.preventDefault();
                }
            } );
        }

        if ( clearBtn ) {
            clearBtn.addEventListener( 'click', function () {
                if ( input ) {
                    input.value = '';
                    input.focus();
                }
                filter( '' );
            } );
        }

        for ( var h = 0; h < hints.length; h++ ) {
            ( function ( btn ) {
                btn.addEventListener( 'click', function () {
                    var word = btn.textContent || '';
                    if ( input ) {
                        input.value = word;
                    }
                    filter( word );
                } );
            } )( hints[ h ] );
        }

        /* 押すと開く（アコーディオン） */
        if ( isAccordion ) {
            for ( var n = 0; n < items.length; n++ ) {
                ( function ( item ) {
                    var btn = item.querySelector( '.qa-5__q' );
                    if ( ! btn ) {
                        return;
                    }
                    btn.addEventListener( 'click', function () {
                        var open = item.classList.toggle( 'is-open' );
                        btn.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
                    } );
                } )( items[ n ] );
            }
        }

        root.classList.add( 'is-js' );
        filter( '' );
    }

    function init() {
        var roots = document.querySelectorAll( '.lw-pr-qa-5' );
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
