<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'deadline_setting_custom' );
function deadline_setting_custom( $wp_customize ) {
    
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $switch = [
        "" => "OFF",
        "on" => "ON",
    ];
    $deadline_arr = [
        "" => "未選択",
        "current" => "アクセスした月の末日",
        "next_month" => "アクセスした月の翌月の月末日",
        "next_2_months" => "アクセスした月の2ヶ月後の月末日",
        "manual" => "期限を手動で設定する",
        "countdown" => "アクセス後カウントダウン方式",
    ];
    $actions_after_deadline = [
        "" => "未選択",
        "message" => "期限日の代わりにテキストを表示する",
        "redirect" => "別ページへリダイレクトする",
    ];
    // -----------------------
    // 期限テキストの設定
    // -----------------------
    $set_ttl = '期限の設定(カウントダウンなど)'; // セクションタイトル
    $sec = 'deadline_setting_sec'; // セクションID
    $set = 'deadline_setting'; // 入力ID
    $wp_customize->add_section($sec, [
        'title'    => $set_ttl,
        'priority' => 170,  
    ]);
    // サブスクの場合の設定数
    $set_no = 3;
    $pure_link = lw_premium_info_link();
    $sub_message = "<p class='ctm_note'>※ <a href='{$pure_link}'>プレミアムプラン</a>の場合は15パターンまで設定できます。</p>";
    if ( defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION ) {
        $set_no = 15;
        $sub_message = "";
    }
    // コントロール
    for ( $i = 1; $i <= $set_no; $i++ ) {

        $items[] = [

            /* ───────── 1 ラジオスイッチ ───────── */
            [
                "radio",
                "set_switch_{$i}",
                "", // ラベル不要
                "<h2 class=\"ctm_ttl_ptn_1\">期限テキストパターン {$i}</h2>
                    {$sub_message}
                 <span class=\"ctm_note\">
                   <code>&lt;span class=&quot;lw_deadline_setting set_{$i}&quot;&gt;&lt;/span&gt;</code>
                 </span>",
                $switch,
            ],

            /* ───────── 2 期限パターン選択 ───────── */
            [
                "select",
                "deadline_ptn_{$i}",
                "期限をいつにしますか?",
                "<span class='lw_deadline_trigger' data-trigger-id='deadline_ptn_{$i}' data-pattern-index='{$i}'></span>",
                $deadline_arr,
            ],

            /* ───────── 3 手動日付入力（manualの時のみ表示） ───────── */
            [
                "date",
                "deadline_date_{$i}",
                "手動で期限を設定",
                "<div class='lw_deadline_conditional lw_deadline_manual_{$i}' data-show-when='manual' data-watch='deadline_ptn_{$i}'>期限を手動で設定する場合、日付を手動で入力してください。</div>",
            ],

            /* ───────── 4 カウントダウン日数（countdownの時のみ表示） ───────── */
            [
                "number",
                "countdown_days_{$i}",
                "カウントダウン:日数",
                "<div class='lw_deadline_conditional lw_deadline_countdown_{$i}' data-show-when='countdown' data-watch='deadline_ptn_{$i}'>アクセス後のカウントダウン日数(0〜365)</div>",
                [],
                0,   // min
                365, // max
                1    // step
            ],

            /* ───────── 5 カウントダウン時間（countdownの時のみ表示） ───────── */
            [
                "number",
                "countdown_hours_{$i}",
                "カウントダウン:時間",
                "<div class='lw_deadline_conditional lw_deadline_countdown_{$i}' data-show-when='countdown' data-watch='deadline_ptn_{$i}'>アクセス後のカウントダウン時間(0〜23)</div>",
                [],
                0,   // min
                23,  // max
                1    // step
            ],

            /* ───────── 6 カウントダウン分（countdownの時のみ表示） ───────── */
            [
                "number",
                "countdown_minutes_{$i}",
                "カウントダウン:分",
                "<div class='lw_deadline_conditional lw_deadline_countdown_{$i}' data-show-when='countdown' data-watch='deadline_ptn_{$i}'>アクセス後のカウントダウン分(0〜59)</div>",
                [],
                0,   // min
                59,  // max
                1    // step
            ],

            /* ───────── 7 カウントダウン秒（countdownの時のみ表示） ───────── */
            [
                "number",
                "countdown_seconds_{$i}",
                "カウントダウン:秒",
                "<div class='lw_deadline_conditional lw_deadline_countdown_{$i}' data-show-when='countdown' data-watch='deadline_ptn_{$i}'>アクセス後のカウントダウン秒(0〜59)</div>",
                [],
                0,   // min
                59,  // max
                1    // step
            ],

            /* ───────── 8 期限過ぎてからのアクション ───────── */
            [
                "select",
                "deadline_after_ptn_{$i}",
                "期限を過ぎた後のアクションは?",
                "<span class='lw_deadline_after_trigger' data-trigger-id='deadline_after_ptn_{$i}' data-pattern-index='{$i}'></span>",
                $actions_after_deadline,
            ],

            /* ───────── 9 期限切れの時にリダイレクトするURL（redirectの時のみ表示） ───────── */
            [
                "url",
                "deadline_after_redirect_url_{$i}",
                "期限切れの時にリダイレクトするURL",
                "<div class='lw_deadline_conditional lw_deadline_redirect_{$i}' data-show-when='redirect' data-watch='deadline_after_ptn_{$i}'>リダイレクト先のURLを入力してください</div>",
            ],

            /* ───────── 10 期限切れ後テキスト（messageの時のみ表示） ───────── */
            [
                "text",
                "deadline_after_text_{$i}",
                "期限切れの時に表示するテキスト",
                "<div class='lw_deadline_conditional lw_deadline_message_{$i}' data-show-when='message' data-watch='deadline_after_ptn_{$i}'><span class='ctm_point'>例)「受付を締め切りました」</span></div>",
            ],

        ];
    }

    customize_set($items, $set, $sec, $wp_customize);
    
    // カスタマイザー用のJavaScriptを追加
    add_action( 'customize_controls_enqueue_scripts', 'deadline_setting_customize_scripts' );
}

// カスタマイザー画面でのみ読み込まれるJavaScript（純粋JavaScript版）
function deadline_setting_customize_scripts() {
    ?>
    <script type="text/javascript">
    (function() {
        'use strict';
        
        // DOMContentLoadedイベント待機
        document.addEventListener('DOMContentLoaded', function() {
            
            // 期限設定の条件付き表示制御
            function lwDeadlineConditionalDisplay() {
                // 各パターン（1〜5）をループ
                for (let i = 1; i <= 5; i++) {
                    (function(index) {
                        // 期限パターンのセレクトボックスを取得
                        const deadlineSelectContainer = document.querySelector(`#customize-control-deadline_setting_deadline_ptn_${index}`);
                        const afterActionSelectContainer = document.querySelector(`#customize-control-deadline_setting_deadline_after_ptn_${index}`);
                        
                        if (!deadlineSelectContainer || !afterActionSelectContainer) return;
                        
                        const deadlineSelect = deadlineSelectContainer.querySelector('select');
                        const afterActionSelect = afterActionSelectContainer.querySelector('select');
                        
                        if (!deadlineSelect || !afterActionSelect) return;
                        
                        // 期限パターンによる表示制御
                        function updateDeadlineFields() {
                            const selectedValue = deadlineSelect.value;
                            
                            // 手動日付フィールドの制御
                            const manualField = document.querySelector(`#customize-control-deadline_setting_deadline_date_${index}`);
                            if (manualField) {
                                if (selectedValue === 'manual') {
                                    manualField.style.display = 'list-item';
                                    manualField.classList.add('lw-visible');
                                } else {
                                    manualField.style.display = 'none';
                                    manualField.classList.remove('lw-visible');
                                }
                            }
                            
                            // カウントダウンフィールドの制御
                            const countdownFieldIds = [
                                `customize-control-deadline_setting_countdown_days_${index}`,
                                `customize-control-deadline_setting_countdown_hours_${index}`,
                                `customize-control-deadline_setting_countdown_minutes_${index}`,
                                `customize-control-deadline_setting_countdown_seconds_${index}`
                            ];
                            
                            countdownFieldIds.forEach(function(fieldId) {
                                const field = document.getElementById(fieldId);
                                if (field) {
                                    if (selectedValue === 'countdown') {
                                        field.style.display = 'list-item';
                                        field.classList.add('lw-visible');
                                    } else {
                                        field.style.display = 'none';
                                        field.classList.remove('lw-visible');
                                    }
                                }
                            });
                        }
                        
                        // 期限後アクションによる表示制御
                        function updateAfterActionFields() {
                            const selectedValue = afterActionSelect.value;
                            
                            // リダイレクトURLフィールドの制御
                            const redirectField = document.querySelector(`#customize-control-deadline_setting_deadline_after_redirect_url_${index}`);
                            if (redirectField) {
                                if (selectedValue === 'redirect') {
                                    redirectField.style.display = 'list-item';
                                    redirectField.classList.add('lw-visible');
                                } else {
                                    redirectField.style.display = 'none';
                                    redirectField.classList.remove('lw-visible');
                                }
                            }
                            
                            // メッセージテキストフィールドの制御
                            const messageField = document.querySelector(`#customize-control-deadline_setting_deadline_after_text_${index}`);
                            if (messageField) {
                                if (selectedValue === 'message') {
                                    messageField.style.display = 'list-item';
                                    messageField.classList.add('lw-visible');
                                } else {
                                    messageField.style.display = 'none';
                                    messageField.classList.remove('lw-visible');
                                }
                            }
                        }
                        
                        // 初期表示の設定
                        updateDeadlineFields();
                        updateAfterActionFields();
                        
                        // 変更イベントの監視
                        deadlineSelect.addEventListener('change', updateDeadlineFields);
                        afterActionSelect.addEventListener('change', updateAfterActionFields);
                    })(i);
                }
            }
            
            // 初期化（少し遅延させて確実に要素が存在する状態で実行）
            setTimeout(lwDeadlineConditionalDisplay, 100);
            
            // カスタマイザーのセクションが開かれた時の処理（WordPress APIが利用可能な場合）
            if (typeof wp !== 'undefined' && wp.customize) {
                wp.customize.section('deadline_setting_sec', function(section) {
                    section.expanded.bind(function(isExpanded) {
                        if (isExpanded) {
                            setTimeout(lwDeadlineConditionalDisplay, 100);
                        }
                    });
                });
            }
        });
    })();
    </script>
    
    <style type="text/css">
    /* トリガー要素は非表示 */
    .lw_deadline_trigger,
    .lw_deadline_after_trigger {
        display: none !important;
    }
    
    /* 条件付きフィールドの初期状態 */
    .lw_deadline_conditional {
        margin-top: 5px;
    }
    
    /* フィールド全体の表示/非表示アニメーション */
    li[id*="customize-control-deadline_setting_deadline_date_"],
    li[id*="customize-control-deadline_setting_countdown_"],
    li[id*="customize-control-deadline_setting_deadline_after_redirect_url_"],
    li[id*="customize-control-deadline_setting_deadline_after_text_"] {
        transition: all 0.3s ease-in-out;
    }
    
    /* カウントダウン関連フィールドのグループ化 */
    li[id*="customize-control-deadline_setting_countdown_days_"],
    li[id*="customize-control-deadline_setting_countdown_hours_"],
    li[id*="customize-control-deadline_setting_countdown_minutes_"],
    li[id*="customize-control-deadline_setting_countdown_seconds_"] {
        background: #f8f8f8;
        border-left: 3px solid #0073aa;
        padding-left: 15px !important;
        margin-left: -12px;
    }
    
    /* 条件付きフィールドのラベル強調 */
    .lw_deadline_conditional {
        color: #666;
        font-size: 13px;
    }
    </style>
    <?php
}