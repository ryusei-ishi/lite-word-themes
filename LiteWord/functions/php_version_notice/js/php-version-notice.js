/**
 * PHP が古いときの警告のポップアップ
 * 閉じる: 「閉じる」ボタン・Esc・外側の暗い所・記事を開いたとき
 */
( function () {
    var notice = document.getElementById( 'lwPhpNotice' );
    if ( ! notice ) {
        return;
    }

    var card = notice.querySelector( '.lw-php-notice-card' );
    var closeButton = notice.querySelector( '.lw-php-notice-close' );
    var articleLink = notice.querySelector( '.lw-php-notice-link' );
    var lastFocus = document.activeElement;

    function onKeydown( event ) {
        if ( event.key === 'Escape' ) {
            close();
        }
    }

    function close() {
        document.removeEventListener( 'keydown', onKeydown );
        notice.parentNode.removeChild( notice );
        if ( lastFocus && lastFocus.focus ) {
            lastFocus.focus();
        }
    }

    closeButton.addEventListener( 'click', close );
    // 記事は新しいタブで開くので、元の画面のポップアップは閉じておく（既定の動き＝タブを開く、は止めない）
    articleLink.addEventListener( 'click', close );
    notice.addEventListener( 'click', function ( event ) {
        if ( event.target === notice ) {
            close();
        }
    } );
    document.addEventListener( 'keydown', onKeydown );

    // 開いたときは箱そのものに当てる（「閉じる」に当てると、押す前から濃い輪が付いて目立つ）
    card.focus();
} )();
