<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* --------------------------------------------------
 * 1) 期限設定ブロックが 1 つでも有効か判定
 * -------------------------------------------------- */
$js_switch = false;
for ( $i = 1; $i <= 5; $i++ ) {
	$deadline_setting_set_switch = Lw_theme_mod_set( "deadline_setting_set_switch_{$i}", '' );
	if ( $deadline_setting_set_switch === 'on' ) {
		$js_switch = true;
		break;
	}
}

if ( $js_switch === true ) :
?>
<script>
/**
 *  lw_deadline_setting - 拡張版（子要素保持対応）
 *  ------------------------------------------------------------------
 */
(function() {
    'use strict';
    
    // グローバルにカウントダウンインスタンスを管理
    window.lwDeadlineInstances = window.lwDeadlineInstances || [];
    
    /**
     * テキストノードを更新する関数（子要素を保持）
     */
    function updateTextContent( element, newText ) {
        // 子要素があるかチェック
        const hasChildren = element.children.length > 0;
        
        if ( hasChildren ) {
            // 子要素がある場合、最も深い要素のテキストを更新
            let deepestElement = element;
            
            // 最も深いテキストを含む要素を探す
            function findDeepestTextElement( el ) {
                // 子要素を全て取得
                const children = Array.from( el.children );
                
                // 子要素がある場合は再帰的に探索
                for ( let child of children ) {
                    const deepChild = findDeepestTextElement( child );
                    if ( deepChild ) {
                        return deepChild;
                    }
                }
                
                // テキストノードを含む要素を返す
                const textNodes = Array.from( el.childNodes ).filter( 
                    node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() 
                );
                
                if ( textNodes.length > 0 ) {
                    return el;
                }
                
                return null;
            }
            
            // 最も深いテキスト要素を取得
            const targetElement = findDeepestTextElement( element );
            
            if ( targetElement ) {
                // テキストノードのみを更新
                const childNodes = Array.from( targetElement.childNodes );
                childNodes.forEach( node => {
                    if ( node.nodeType === Node.TEXT_NODE ) {
                        node.textContent = newText;
                        newText = ''; // 最初のテキストノードのみ更新
                    }
                });
                
                // テキストノードがない場合は追加
                if ( newText ) {
                    targetElement.appendChild( document.createTextNode( newText ) );
                }
            } else {
                // テキスト要素が見つからない場合は最初の子要素に追加
                if ( element.firstElementChild ) {
                    element.firstElementChild.textContent = newText;
                }
            }
        } else {
            // 子要素がない場合は通常通り更新
            element.textContent = newText;
        }
    }
    
    /**
     * メイン関数
     */
    window.lw_deadline_setting = function( setClass, mode, manualDateStr = '', expiredText = '', afterAction = '', redirectUrl = '', countdownConfig = {} ) {

        
        /* ------------------------------------------------------------
         * 1) ターゲット要素を取得
         * ---------------------------------------------------------- */
        const targets = document.querySelectorAll( `.lw_deadline_setting.${ setClass }` );
        if ( ! targets.length ) return; // 対象なし

        /* ------------------------------------------------------------
         * 2) カウントダウン方式の処理（各要素に対して個別に処理）
         * ---------------------------------------------------------- */
        if ( mode === 'countdown' ) {
            targets.forEach( (target, index) => {
                // 各要素に固有のインスタンスIDを付与（インターバル管理用）
                if ( !target.dataset.lwInstanceId ) {
                    const instanceId = `${ setClass }_instance_${ Date.now() }_${ index }`;
                    target.dataset.lwInstanceId = instanceId;
                }
                // setClassをベースにしたストレージキーを使用（ページ間で共有）
                handleCountdown( target, setClass, target.dataset.lwInstanceId, countdownConfig, expiredText, afterAction, redirectUrl );
            });
            return;
        }

        /* ------------------------------------------------------------
         * 3) サイト基準の "現在" を取得（WP のタイムゾーン準拠）
         * ---------------------------------------------------------- */
        const tzOffsetSiteMin =
            typeof MyThemeSettings !== 'undefined' && Number.isFinite( +MyThemeSettings.tzOffsetMin )
                ? +MyThemeSettings.tzOffsetMin          // WP から渡された分
                : -new Date().getTimezoneOffset();      // フォールバック：閲覧者の分

        const nowUTC  = Date.now();                                   // UTC ミリ秒
        const nowSite = new Date( nowUTC + tzOffsetSiteMin * 60_000 ); // サイト時刻

        /* ------------------------------------------------------------
         * 4) 期限日を算出
         * ---------------------------------------------------------- */
        let deadline;                         // Date オブジェクト
        const y = nowSite.getFullYear();
        const m = nowSite.getMonth();        // 0-始まり

        switch ( mode ) {
            case 'current':          // 今月末
                deadline = new Date( y, m + 1, 0, 23, 59, 59 );
                break;
            case 'next_month':       // 来月末
                deadline = new Date( y, m + 2, 0, 23, 59, 59 );
                break;
            case 'next_2_months':    // 2 か月後の月末
                deadline = new Date( y, m + 3, 0, 23, 59, 59 );
                break;
            case 'manual':           // 手動指定
                if ( ! /^\d{4}-\d{2}-\d{2}$/.test( manualDateStr ) ) return;
                const [ yy, mm, dd ] = manualDateStr.split( '-' ).map( Number );
                deadline = new Date( yy, mm - 1, dd, 23, 59, 59 );
                break;
            default:                 // 未選択など
                return;
        }

        /* ------------------------------------------------------------
         * 5) 期限切れ判定と処理
         * ---------------------------------------------------------- */
        const isExpired = nowSite > deadline;
        
        if ( isExpired ) {
            // 期限切れ時のアクション処理（通常モード用）- setClassを追加
            handleExpiredAction( afterAction, redirectUrl, expiredText, targets, false, setClass );
        } else {
            // 期限内：日付を表示
            const viewText = `${ deadline.getMonth() + 1 }月${ deadline.getDate() }日`;
            targets.forEach( el => { 
                updateTextContent( el, viewText );
            });
        }
    };

    /**
     * 期限切れ時のアクション処理
     * @param {string} afterAction - アクションタイプ
     * @param {string} redirectUrl - リダイレクトURL
     * @param {string} expiredText - 期限切れテキスト
     * @param {NodeList|Element|Array} targets - 対象要素
     * @param {boolean} isCountdown - カウントダウンモードかどうか
     * @param {string} setClass - セットクラス名
     */
    function handleExpiredAction( afterAction, redirectUrl, expiredText, targets, isCountdown = false, setClass = '' ) {
        
        // カウントダウンモードで期限切れテキストが未設定の場合、デフォルトテキストを使用
        const defaultExpiredText = isCountdown ? '期限が終了いたしました' : '';
        const displayText = expiredText || defaultExpiredText;
        
        // targetsが単一要素の場合も配列として扱う
        const targetArray = targets.length !== undefined ? targets : [targets];
        
        switch ( afterAction ) {
            case 'redirect':
                // リダイレクト処理
                if ( redirectUrl && redirectUrl.trim() !== '' ) {
                    // より厳密なキーを使用（URLとsetClassを組み合わせる）
                    const redirectKey = 'lw_deadline_redirected_' + window.location.href + '_' + setClass;
                    

                    
                    if ( !sessionStorage.getItem( redirectKey ) ) {
                        sessionStorage.setItem( redirectKey, 'true' );
                        
                        // 少し遅延を入れてリダイレクト（即座のリダイレクトを避ける）
                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 100);
                    } else {
                        // リダイレクト済みの場合もテキストを表示
                        targetArray.forEach( el => { 
                            updateTextContent( el, displayText );
                        });
                    }
                } else {
                    targetArray.forEach( el => { 
                        updateTextContent( el, displayText );
                    });
                }
                break;
            
            case 'message':
                // メッセージ表示
                targetArray.forEach( el => { 
                    updateTextContent( el, displayText );
                });
                break;
            
            default:
                // 未選択時：デフォルトテキストまたは設定されたテキストを表示
                targetArray.forEach( el => { 
                    updateTextContent( el, displayText );
                });
                break;
        }
    }

    /**
     * カウントダウン方式の処理（単一要素用）
     * @param {Element} target - 対象要素
     * @param {string} setClass - パターンクラス（LocalStorageキーとして使用）
     * @param {string} instanceId - インスタンス固有ID（インターバル管理用）
     */
    function handleCountdown( target, setClass, instanceId, countdownConfig, expiredText, afterAction, redirectUrl ) {
    // 既に処理済みの要素かチェック
    if ( target.dataset.lwCountdownInit === 'true' ) {
        return;
    }
    target.dataset.lwCountdownInit = 'true';
    
    // カウントダウン設定から合計秒数を計算
    const days = parseInt( countdownConfig.days || 0 );
    const hours = parseInt( countdownConfig.hours || 0 );
    const minutes = parseInt( countdownConfig.minutes || 0 );
    const seconds = parseInt( countdownConfig.seconds || 0 );
    
    const totalSeconds = 
        days * 86400 + 
        hours * 3600 + 
        minutes * 60 + 
        seconds;

    // 設定が0の場合はエラー表示
    if ( totalSeconds <= 0 ) {
        updateTextContent( target, 'カウントダウン時間を設定してください' );
        return;
    }

    // LocalStorageのキー
    const storageKey = `lw_countdown_start_${ setClass }`;
    const expiredKey = `lw_countdown_expired_${ setClass }`;
    
    // 既に期限切れフラグが立っている場合
    if ( localStorage.getItem( expiredKey ) === 'true' ) {
        // 即座に期限切れ処理を実行
        handleExpiredAction( afterAction, redirectUrl, expiredText, target, true, setClass );
        return;
    }
    
    let startTime = localStorage.getItem( storageKey );
    
    if ( !startTime ) {
        // 初回アクセス時
        startTime = Date.now();
        localStorage.setItem( storageKey, startTime );
    } else {
        startTime = parseInt( startTime );
    }

    // カウントダウン更新関数
    const updateCountdown = () => {
        const elapsed = Math.floor( ( Date.now() - startTime ) / 1000 );
        const remaining = totalSeconds - elapsed;

        if ( remaining <= 0 ) {
            // 期限切れフラグを立てる
            localStorage.setItem( expiredKey, 'true' );
            
            // 期限切れ処理
            handleExpiredAction( afterAction, redirectUrl, expiredText, target, true, setClass );
            
            // メッセージ表示の場合のみLocalStorageをクリア（リセット可能にする）
            if ( afterAction === 'message' || !afterAction ) {
                // 一定時間後にリセット可能にする（例：10秒後）
                setTimeout(() => {
                    localStorage.removeItem( storageKey );
                    localStorage.removeItem( expiredKey );
                }, 10000);
            }
            // リダイレクトの場合はLocalStorageを維持（リダイレクト先でも期限切れ状態を保つ）
            
            return false; // インターバル停止のフラグ
        }

        // 残り時間を計算と表示（既存のコード）
        const d = Math.floor( remaining / 86400 );
        const h = Math.floor( ( remaining % 86400 ) / 3600 );
        const m = Math.floor( ( remaining % 3600 ) / 60 );
        const s = remaining % 60;

        let displayText = '';
        if ( d > 0 ) displayText += `${d}日`;
        if ( h > 0 || d > 0 ) displayText += `${h}時間`;
        if ( m > 0 || h > 0 || d > 0 ) displayText += `${m}分`;
        displayText += `${s}秒`;

        updateTextContent( target, displayText );
        return true;
    };

        // 初回実行
        const shouldContinue = updateCountdown();
        
        // 既に期限切れの場合はインターバルを開始しない
        if ( !shouldContinue ) {
            return;
        }

        // 既存のインターバルがあれば停止
        if ( target.lwIntervalId ) {
            clearInterval( target.lwIntervalId );
        }

        // 1秒ごとに更新（期限切れたら停止）
        const intervalId = setInterval( () => {
            if ( !updateCountdown() ) {
                clearInterval( intervalId );
                // インターバルIDをクリア
                target.lwIntervalId = null;
                // グローバル管理配列から削除
                const index = window.lwDeadlineInstances.findIndex( 
                    instance => instance.instanceId === instanceId 
                );
                if ( index > -1 ) {
                    window.lwDeadlineInstances.splice( index, 1 );
                }
            }
        }, 1000 );
        
        // インターバルIDを要素に保存
        target.lwIntervalId = intervalId;
        
        // グローバル管理配列に追加
        window.lwDeadlineInstances.push({
            element: target,
            intervalId: intervalId,
            instanceId: instanceId,
            setClass: setClass
        });
    }

    // ページ離脱時のクリーンアップ
    window.addEventListener('beforeunload', function() {
        if ( window.lwDeadlineInstances ) {
            window.lwDeadlineInstances.forEach( instance => {
                if ( instance.intervalId ) {
                    clearInterval( instance.intervalId );
                }
            });
        }
    });

})();

document.addEventListener( 'DOMContentLoaded', () => {
<?php
for ( $i = 1; $i <= 5; $i++ ) :
	$deadline_setting_set_switch = Lw_theme_mod_set( "deadline_setting_set_switch_{$i}", '' );
	if ( $deadline_setting_set_switch !== 'on' ) {
		continue;
	}

	$deadline_ptn        = Lw_theme_mod_set( "deadline_setting_deadline_ptn_{$i}", 'current' );
	$deadline_date       = Lw_theme_mod_set( "deadline_setting_deadline_date_{$i}", '' );
	$deadline_after_text = Lw_theme_mod_set( "deadline_setting_deadline_after_text_{$i}", '' );
	$deadline_after_ptn  = Lw_theme_mod_set( "deadline_setting_deadline_after_ptn_{$i}", '' );
	$deadline_redirect_url = Lw_theme_mod_set( "deadline_setting_deadline_after_redirect_url_{$i}", '' );
	
	// カウントダウン設定
	$countdown_days    = Lw_theme_mod_set( "deadline_setting_countdown_days_{$i}", '0' );
	$countdown_hours   = Lw_theme_mod_set( "deadline_setting_countdown_hours_{$i}", '0' );
	$countdown_minutes = Lw_theme_mod_set( "deadline_setting_countdown_minutes_{$i}", '0' );
	$countdown_seconds = Lw_theme_mod_set( "deadline_setting_countdown_seconds_{$i}", '0' );
?>
	lw_deadline_setting(
		'set_<?= $i ?>',                              // .lw_deadline_setting.set_1
		'<?= esc_js( $deadline_ptn ) ?>',             // mode
		'<?= esc_js( $deadline_date ) ?>',            // "manual"の日付
		'<?= esc_js( $deadline_after_text ) ?>',      // 期限切れ後テキスト
		'<?= esc_js( $deadline_after_ptn ) ?>',       // 期限後アクション
		'<?= esc_js( $deadline_redirect_url ) ?>',    // リダイレクトURL
		{                                              // カウントダウン設定
			days: '<?= esc_js( $countdown_days ) ?>',
			hours: '<?= esc_js( $countdown_hours ) ?>',
			minutes: '<?= esc_js( $countdown_minutes ) ?>',
			seconds: '<?= esc_js( $countdown_seconds ) ?>'
		}
	);
<?php endfor; ?>
} );
</script>
<?php endif; ?>