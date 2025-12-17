<?php
if ( ! defined( 'ABSPATH' ) ) exit;

// グーテンベルクエディタ用のスクリプトを追加
add_action( 'enqueue_block_assets', 'lw_deadline_block_editor_scripts' );
function lw_deadline_block_editor_scripts() {
    // 期限設定データを準備
    $deadline_data = array();
    
    for ( $i = 1; $i <= 5; $i++ ) {
        $switch = Lw_theme_mod_set( "deadline_setting_set_switch_{$i}", '' );
        if ( $switch !== 'on' ) {
            continue;
        }
        
        $deadline_ptn = Lw_theme_mod_set( "deadline_setting_deadline_ptn_{$i}", 'current' );
        $deadline_date = Lw_theme_mod_set( "deadline_setting_deadline_date_{$i}", '' );
        $deadline_after_text = Lw_theme_mod_set( "deadline_setting_deadline_after_text_{$i}", '' );
        
        // カウントダウン設定
        $countdown_days = Lw_theme_mod_set( "deadline_setting_countdown_days_{$i}", '0' );
        $countdown_hours = Lw_theme_mod_set( "deadline_setting_countdown_hours_{$i}", '0' );
        $countdown_minutes = Lw_theme_mod_set( "deadline_setting_countdown_minutes_{$i}", '0' );
        $countdown_seconds = Lw_theme_mod_set( "deadline_setting_countdown_seconds_{$i}", '0' );
        
        // 表示テキストを生成
        $display_text = '';
        
        switch ( $deadline_ptn ) {
            case 'current':
                // 今月末を計算
                $last_day = date( 'n月j日', strtotime( 'last day of this month' ) );
                $display_text = $last_day;
                break;
                
            case 'next_month':
                // 来月末を計算
                $last_day = date( 'n月j日', strtotime( 'last day of next month' ) );
                $display_text = $last_day;
                break;
                
            case 'next_2_months':
                // 2ヶ月後の月末を計算
                $last_day = date( 'n月j日', strtotime( 'last day of +2 months' ) );
                $display_text = $last_day;
                break;
                
            case 'manual':
                // 手動設定の日付
                if ( !empty( $deadline_date ) ) {
                    $date_obj = DateTime::createFromFormat( 'Y-m-d', $deadline_date );
                    if ( $date_obj ) {
                        $display_text = $date_obj->format( 'n月j日' );
                    }
                }
                break;
                
            case 'countdown':
                // カウントダウン表示（日数を時間に変換して表示）
                $total_days = (int)$countdown_days;
                $total_hours = (int)$countdown_hours;
                $total_minutes = (int)$countdown_minutes;
                $total_seconds = (int)$countdown_seconds;
                
                // 日数を時間に変換して合計時間を計算
                $total_hours_display = ($total_days * 24) + $total_hours;
                
                // ゼロパディングで表示
                $display_text = sprintf( '%d時間%02d分%02d秒', 
                    $total_hours_display, 
                    $total_minutes, 
                    $total_seconds 
                );
                
                // すべて0の場合
                if ( $total_hours_display == 0 && $total_minutes == 0 && $total_seconds == 0 ) {
                    $display_text = 'カウントダウン未設定';
                }
                break;
                
            default:
                $display_text = '期限未設定';
                break;
        }
        
        // 期限切れテキストがある場合は併記
        if ( !empty( $deadline_after_text ) && $deadline_ptn !== 'countdown' ) {
            $display_text .= ' (期限後: ' . $deadline_after_text . ')';
        }
        
        $deadline_data[ "set_{$i}" ] = array(
            'pattern' => $deadline_ptn,
            'display_text' => $display_text,
            'expired_text' => $deadline_after_text
        );
    }
    
    // ダミーのスクリプトを登録
    wp_register_script(
        'lw-deadline-editor',
        '', // 空のURLを使用
        array(),
        false,
        true
    );
    
    // JavaScriptコードをインラインスクリプトとして追加
    $inline_script = "
    (function() {
        'use strict';
        
        // 期限設定データ
        const lwDeadlineData = " . json_encode( $deadline_data, JSON_UNESCAPED_UNICODE ) . ";
        
        console.log('[LW_DEADLINE] Initialized with data:', lwDeadlineData);
        
        // 処理済みの要素を記録
        const processedElements = new WeakSet();
        
        // 更新中フラグ
        let isUpdating = false;
        
        // 隣り合わせの重複要素のみを削除する関数
        function removeDuplicateElements() {
            Object.keys( lwDeadlineData ).forEach( function( setClass ) {
                const elements = document.querySelectorAll( '.lw_deadline_setting.' + setClass );
                
                elements.forEach( function( element ) {
                    // 次の要素を取得
                    let nextSibling = element.nextElementSibling;
                    
                    // 次の要素が同じクラスを持つ場合は削除
                    while ( nextSibling && 
                            nextSibling.classList.contains('lw_deadline_setting') && 
                            nextSibling.classList.contains(setClass) ) {
                        const toRemove = nextSibling;
                        nextSibling = nextSibling.nextElementSibling;
                        toRemove.remove();
                        console.log('[LW_DEADLINE] Removed adjacent duplicate element:', setClass);
                    }
                });
            });
        }
        
        // クリックイベントを設定
        function setupClickHandler( element ) {
            // 既にイベントが設定されているかチェック
            if ( element.dataset.clickHandlerSet === 'true' ) {
                return;
            }
            
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // 更新を一時停止
                isUpdating = true;
                
                // クリック位置を取得
                const rect = element.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const elementWidth = rect.width;
                
                // 右側から8px以内をクリックした場合
                if ( clickX >= elementWidth - 8 ) {
                    // カーソルを要素の後に移動
                    const selection = window.getSelection();
                    const range = document.createRange();
                    
                    // 要素の後にテキストノードがあるか確認
                    if ( element.nextSibling && element.nextSibling.nodeType === 3 ) {
                        // テキストノードの先頭にカーソルを配置
                        range.setStart(element.nextSibling, 0);
                        range.setEnd(element.nextSibling, 0);
                    } else {
                        // テキストノードがない場合は、空のテキストノードを作成
                        const emptyText = document.createTextNode('');
                        element.parentNode.insertBefore(emptyText, element.nextSibling);
                        range.setStart(emptyText, 0);
                        range.setEnd(emptyText, 0);
                    }
                    
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    // フォーカスを親要素に戻す
                    const richText = element.closest('.rich-text');
                    if ( richText ) {
                        richText.focus();
                    }
                }
                
                // 300ms後に更新を再開
                setTimeout(function() {
                    isUpdating = false;
                }, 300);
            });
            
            element.dataset.clickHandlerSet = 'true';
        }
        
        // 要素のテキストを更新
        function updateElement( element, data ) {
            const currentText = element.textContent || '';
            const targetText = data.display_text || '';
            
            // 空の要素には必ずテキストを挿入
            if ( !currentText ) {
                element.textContent = targetText;
                
                // データ属性を設定
                element.dataset.deadlinePattern = data.pattern;
                element.dataset.deadlineText = data.display_text;
                if ( data.expired_text ) {
                    element.dataset.expiredText = data.expired_text;
                }
                
                // contenteditable属性を追加（編集不可にする）
                element.setAttribute('contenteditable', 'false');
                
                // クリックイベントを設定
                setupClickHandler( element );
                
                // 処理済みとしてマーク
                if ( !processedElements.has(element) ) {
                    processedElements.add(element);
                }
                
                return true;
            }
            
            // 更新中は既存要素の更新をスキップ
            if ( isUpdating ) {
                return false;
            }
            
            // Gutenbergが編集中の場合はスキップ（選択状態をチェック）
            const selection = window.getSelection();
            if ( selection && selection.rangeCount > 0 ) {
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                const parentElement = container.nodeType === 3 ? container.parentNode : container;
                
                // 選択範囲が期限要素の近くにある場合はスキップ
                if ( parentElement && (
                    parentElement === element || 
                    parentElement.contains(element) || 
                    element.contains(parentElement) ||
                    parentElement.previousSibling === element ||
                    parentElement.nextSibling === element
                )) {
                    return false;
                }
            }
            
            // 期限要素のテキストが正しくない場合のみ更新
            if ( currentText !== targetText ) {
                element.textContent = targetText;
                
                // データ属性を設定
                element.dataset.deadlinePattern = data.pattern;
                element.dataset.deadlineText = data.display_text;
                if ( data.expired_text ) {
                    element.dataset.expiredText = data.expired_text;
                }
                
                // contenteditable属性を追加（編集不可にする）
                element.setAttribute('contenteditable', 'false');
                
                // クリックイベントを設定
                setupClickHandler( element );
                
                return true;
            }
            
            // テキストは正しいが、まだイベントが設定されていない場合
            if ( !element.dataset.clickHandlerSet ) {
                element.setAttribute('contenteditable', 'false');
                setupClickHandler( element );
            }
            
            return false;
        }
        
        // 期限要素の直後にある断片的なテキストのみを削除
        function cleanupFragmentedText() {
            // 更新中は処理をスキップ
            if ( isUpdating ) {
                return;
            }
            
            Object.keys( lwDeadlineData ).forEach( function( setClass ) {
                const data = lwDeadlineData[ setClass ];
                const elements = document.querySelectorAll( '.lw_deadline_setting.' + setClass );
                
                elements.forEach( function( element ) {
                    // 次のノードをチェック（テキストノードの場合）
                    let nextNode = element.nextSibling;
                    
                    if ( nextNode && nextNode.nodeType === 3 ) { // テキストノード
                        const text = nextNode.textContent || '';
                        const expectedText = data.display_text || '';
                        
                        // 期限テキストの断片が含まれているかチェック
                        if ( expectedText && text ) {
                            // 期限テキストの一部と完全一致する場合のみ削除
                            for ( let i = 1; i < expectedText.length; i++ ) {
                                const suffix = expectedText.substring( i );
                                if ( text.startsWith( suffix ) ) {
                                    console.log('[LW_DEADLINE] Found text fragment:', text.substring( 0, suffix.length ));
                                    
                                    // 断片部分のみを削除
                                    const remainingText = text.substring( suffix.length );
                                    if ( remainingText ) {
                                        // 残りのテキストがある場合は、それを保持
                                        nextNode.textContent = remainingText;
                                    } else {
                                        // 全部が断片の場合は、ノードごと削除
                                        nextNode.parentNode.removeChild( nextNode );
                                    }
                                    break;
                                }
                            }
                        }
                    }
                });
            });
        }
        
        // すべての要素を更新
        function updateAllElements() {
            // まず重複要素を削除
            removeDuplicateElements();
            
            // 各要素を更新
            Object.keys( lwDeadlineData ).forEach( function( setClass ) {
                const data = lwDeadlineData[ setClass ];
                const elements = document.querySelectorAll( '.lw_deadline_setting.' + setClass );
                
                elements.forEach( function( element ) {
                    updateElement( element, data );
                });
            });
            
            // 断片的なテキストをクリーンアップ
            cleanupFragmentedText();
        }
        
        // 定期的な更新（500msごと）
        function startPeriodicUpdate() {
            setInterval( function() {
                updateAllElements();
            }, 500 );
        }
        
        // 初期化
        function init() {
            //console.log('[LW_DEADLINE] Starting');
            
            // 少し待ってから開始
            setTimeout( function() {
                updateAllElements();
                // 定期更新を開始（要素が消えないように維持）
                startPeriodicUpdate();
            }, 1000 );
            
            // Gutenberg連携
            if ( typeof wp !== 'undefined' && wp.data ) {
                const checkEditor = setInterval( function() {
                    const editor = wp.data.select( 'core/block-editor' );
                    if ( editor ) {
                        clearInterval( checkEditor );
                        //console.log('[LW_DEADLINE] Gutenberg ready');
                        
                        // 変更時に更新
                        wp.data.subscribe( function() {
                            // 少し遅延させて実行
                            setTimeout( function() {
                                updateAllElements();
                            }, 100 );
                        });
                    }
                }, 500 );
            }
        }
        
        // 実行開始
        if ( document.readyState === 'loading' ) {
            document.addEventListener( 'DOMContentLoaded', init );
        } else {
            init();
        }
        
    })();";
    
    // インラインスクリプトとして追加
    wp_add_inline_script( 'lw-deadline-editor', $inline_script );
    
    // スクリプトをエンキュー
    wp_enqueue_script( 'lw-deadline-editor' );
}



?>