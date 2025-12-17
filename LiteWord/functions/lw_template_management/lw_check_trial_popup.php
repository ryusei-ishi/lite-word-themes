<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * LiteWord 2週間試用期間システム - リッチバージョン（修正版）
 */

// ログイン後のリダイレクトをフック
add_filter('login_redirect', 'lw_check_trial_popup', 10, 3);
function lw_check_trial_popup($redirect_to, $request, $user) {
    // ログインが失敗した場合（$userがWP_Errorの場合）は処理しない
    if (is_wp_error($user) || !is_object($user)) {
        return $redirect_to;
    }
    
    if (!user_can($user, 'administrator')) {
        return $redirect_to;
    }
    
    // サブスクリプション契約者は無料オファーを表示しない（修正版）
    if (lw_is_subscription_active()) {
        return $redirect_to;
    }
    
    // trial_periodの状態を確認
    $templateSetting = new LwTemplateSetting();
    $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');
    
    // trial_periodが存在しない場合
    if (!$trial_setting) {
        // 初回の場合、試用開始ポップアップを表示
        set_transient('lw_show_trial_popup_' . $user->ID, true, 60);
    } else {
        // 最後のタイムスタンプから経過日数を計算
        $last_timestamp = strtotime($trial_setting['timestamp']);
        $now = time();
        $days_elapsed = floor(($now - $last_timestamp) / (60 * 60 * 24));
        
        if ($trial_setting['active_flag'] == 1) {
            // 試用期間中の場合
            $days_remaining = lw_get_trial_days_remaining_without_update(); // 更新しないバージョンを使用
            
            if ($days_remaining <= 0) {
                // 期間終了した場合、ポップアップを表示
                // シンプルなキーで期限切れポップアップ表示済みかチェック
                $expired_shown_key = 'lw_trial_expired_shown_' . date('Y-m-d', $last_timestamp);
                if (!get_user_meta($user->ID, $expired_shown_key, true)) {
                    set_transient('lw_show_trial_expired_popup_' . $user->ID, true, 60);
                }
            } elseif ($days_remaining <= 5 && $days_remaining > 0) {
                // 残り5日以下の場合
                set_transient('lw_show_trial_warning_popup_' . $user->ID, $days_remaining, 60);
            }
        } elseif ($days_elapsed >= 60) {
            // 試用期間終了後60日経過した場合、再度試用開始ポップアップを表示
            set_transient('lw_show_trial_popup_' . $user->ID, true, 60);
        }
    }
    
    return $redirect_to;
}

// 管理画面でポップアップを表示
add_action('admin_footer', 'lw_trial_popup_script');
function lw_trial_popup_script() {
    $current_user_id = get_current_user_id();
    if (!current_user_can('administrator')) {
        return;
    }
    
    // サブスクリプション契約者はポップアップを表示しない（修正版）
    if (lw_is_subscription_active()) {
        // すべてのトランジェントを削除してクリーンアップ
        delete_transient('lw_show_trial_popup_' . $current_user_id);
        delete_transient('lw_show_trial_warning_popup_' . $current_user_id);
        delete_transient('lw_show_trial_expired_popup_' . $current_user_id);
        return;
    }
    
    // 初回試用開始ポップアップ
    if (get_transient('lw_show_trial_popup_' . $current_user_id)) {
        delete_transient('lw_show_trial_popup_' . $current_user_id);
        lw_render_trial_start_popup();
        return;
    }
    
    // 残り日数警告ポップアップ
    $days_remaining = get_transient('lw_show_trial_warning_popup_' . $current_user_id);
    if ($days_remaining !== false) {
        delete_transient('lw_show_trial_warning_popup_' . $current_user_id);
        lw_render_trial_warning_popup($days_remaining);
        return;
    }
    
    // 期限切れポップアップ
    if (get_transient('lw_show_trial_expired_popup_' . $current_user_id)) {
        delete_transient('lw_show_trial_expired_popup_' . $current_user_id);
        
        // 期限切れポップアップを表示済みとして記録（シンプルなキーを使用）
        $templateSetting = new LwTemplateSetting();
        $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');
        if ($trial_setting) {
            $expired_shown_key = 'lw_trial_expired_shown_' . date('Y-m-d', strtotime($trial_setting['timestamp']));
            update_user_meta($current_user_id, $expired_shown_key, true);
            
            // ポップアップ表示と同時にactive_flagを0に更新
            global $wpdb;
            $table_name = $wpdb->prefix . 'lw_template_setting';
            $wpdb->update(
                $table_name,
                array('active_flag' => 0),
                array('template_id' => 'trial_period'),
                array('%d'),
                array('%s')
            );
        }
        
        lw_render_trial_expired_popup();
        return;
    }
    
    // 期限切れだがポップアップ未表示の場合の追加チェック
    lw_check_and_show_expired_popup_if_needed();
}


// 期限切れだがポップアップ未表示の場合の追加チェック関数（新規追加）
function lw_check_and_show_expired_popup_if_needed() {
    $current_user_id = get_current_user_id();
    $templateSetting = new LwTemplateSetting();
    $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');
    
    if ($trial_setting && $trial_setting['active_flag'] == 1) {
        $days_remaining = lw_get_trial_days_remaining_without_update();
        
        if ($days_remaining <= 0) {
            // 期限切れだがまだポップアップを表示していない場合
            $expired_shown_key = 'lw_trial_expired_shown_' . date('Y-m-d', strtotime($trial_setting['timestamp']));
            if (!get_user_meta($current_user_id, $expired_shown_key, true)) {
                // ポップアップを即座に表示
                update_user_meta($current_user_id, $expired_shown_key, true);
                
                // active_flagを0に更新
                global $wpdb;
                $table_name = $wpdb->prefix . 'lw_template_setting';
                $wpdb->update(
                    $table_name,
                    array('active_flag' => 0),
                    array('template_id' => 'trial_period'),
                    array('%d'),
                    array('%s')
                );
                
                lw_render_trial_expired_popup();
            }
        }
    }
}

// 試用開始ポップアップのレンダリング（プレミアム・未来感バージョン）
function lw_render_trial_start_popup() {
    $templateSetting = new LwTemplateSetting();
    $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');

    // 再試用の場合のメッセージを判定
    $is_retry = ($trial_setting && $trial_setting['active_flag'] == 0);

    ?>
    <style>
        @keyframes lw-fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes lw-slideUp {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes lw-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes lw-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }

        @keyframes lw-gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        body:has(.lw-trial-overlay),
        html:has(.lw-trial-overlay) {
            overflow: hidden;
        }

        .lw-trial-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
            backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            animation: lw-fadeIn 0.4s ease;
            overflow-y: auto;
            box-sizing: border-box;
        }

        .lw-trial-popup {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            padding: 48px 44px;
            border-radius: 24px;
            max-width: 520px;
            width: 100%;
            box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.1),
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 100px rgba(99, 102, 241, 0.15);
            text-align: center;
            position: relative;
            animation: lw-slideUp 0.5s ease;
            overflow: hidden;
        }

        /* 背景のアクセント */
        .lw-trial-popup::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #0ea5e9, #0284c7, #0369a1);
            background-size: 200% 100%;
            animation: lw-gradient-shift 3s ease infinite;
        }

        /* フローティングオーブ */
        .lw-trial-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.4;
            pointer-events: none;
        }

        .lw-trial-orb-1 {
            width: 120px;
            height: 120px;
            background: #0ea5e9;
            top: -40px;
            right: -40px;
            animation: lw-float 8s ease-in-out infinite;
        }

        .lw-trial-orb-2 {
            width: 80px;
            height: 80px;
            background: #38bdf8;
            bottom: -20px;
            left: -20px;
            animation: lw-float 6s ease-in-out infinite reverse;
        }

        .lw-trial-icon {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 28px;
            position: relative;
            z-index: 1;
            box-shadow: 0 8px 32px rgba(14, 165, 233, 0.3);
        }

        .lw-trial-icon svg {
            width: 36px;
            height: 36px;
            stroke: #fff;
            stroke-width: 1.5;
            fill: none;
        }

        .lw-trial-popup h2 {
            margin: 0 0 12px;
            color: #0f172a;
            font-size: 26px;
            line-height: 1.4;
            font-weight: 700;
            position: relative;
            z-index: 1;
            letter-spacing: -0.5px;
        }

        .lw-trial-popup h2 .highlight {
            color: #0284c7;
        }

        .lw-trial-subtitle {
            color: #64748b;
            font-size: 15px;
            margin: 0 0 32px;
            position: relative;
            z-index: 1;
        }

        .lw-trial-features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin: 0 0 32px;
            position: relative;
            z-index: 1;
        }

        .lw-trial-feature {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 20px 16px;
            border-radius: 16px;
            transition: all 0.3s ease;
        }

        .lw-trial-feature:hover {
            border-color: #bae6fd;
            background: #f0f9ff;
            transform: translateY(-2px);
        }

        .lw-trial-feature-icon {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #e0f2fe, #bae6fd);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
        }

        .lw-trial-feature-icon svg {
            width: 22px;
            height: 22px;
            stroke: #0284c7;
            stroke-width: 1.5;
            fill: none;
        }

        .lw-trial-feature-text {
            color: #475569;
            font-size: 12px;
            line-height: 1.5;
            font-weight: 500;
        }

        .lw-trial-feature-text strong {
            display: block;
            font-size: 18px;
            color: #0284c7;
            margin-bottom: 2px;
        }

        .lw-trial-info {
            color: #64748b;
            font-size: 14px;
            line-height: 1.7;
            margin: 0 0 12px;
            position: relative;
            z-index: 1;
        }

        .lw-trial-note {
            display: flex;
            justify-content: center;
            gap: 24px;
            color: #94a3b8;
            font-size: 12px;
            margin-bottom: 32px;
            position: relative;
            z-index: 1;
        }

        .lw-trial-note span {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .lw-trial-note svg {
            width: 14px;
            height: 14px;
            stroke: #10b981;
            stroke-width: 2;
            fill: none;
        }

        .lw-trial-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        .lw-trial-btn {
            padding: 14px 32px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .lw-trial-btn-yes {
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: #fff;
            box-shadow: 0 4px 20px rgba(14, 165, 233, 0.35);
        }

        .lw-trial-btn-yes:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(14, 165, 233, 0.45);
        }

        .lw-trial-btn-no {
            background: #f1f5f9;
            color: #64748b;
        }

        .lw-trial-btn-no:hover {
            background: #e2e8f0;
            color: #475569;
        }

        .lw-trial-skip-checkbox {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            position: relative;
            z-index: 1;
        }

        .lw-trial-skip-checkbox input[type="checkbox"] {
            margin-right: 6px;
            vertical-align: middle;
            accent-color: #0284c7;
        }

        .lw-trial-skip-checkbox label {
            cursor: pointer;
            user-select: none;
        }

        .lw-trial-skip-checkbox label:hover {
            color: #64748b;
        }

        .lw-trial-success {
            margin-top: 20px;
            padding: 16px;
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border: 1px solid #a7f3d0;
            color: #065f46;
            border-radius: 12px;
            font-weight: 500;
            font-size: 14px;
        }
    </style>

    <div class="lw-trial-overlay" id="lwTrialOverlay">
        <div class="lw-trial-popup">
            <div class="lw-trial-orb lw-trial-orb-1"></div>
            <div class="lw-trial-orb lw-trial-orb-2"></div>

            <div class="lw-trial-icon">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>

            <h2><?php echo $is_retry ? '<span class="highlight">プレミアム機能</span>を再度ご利用いただけます' : '<span class="highlight">プレミアム機能</span>を14日間無料でお試し'; ?></h2>
            <p class="lw-trial-subtitle">すべての有料デザインパーツをご利用いただけます</p>

            <div class="lw-trial-features">
                <div class="lw-trial-feature">
                    <div class="lw-trial-feature-icon">
                        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    </div>
                    <div class="lw-trial-feature-text"><strong>40+</strong>デザインパーツ</div>
                </div>
                <div class="lw-trial-feature">
                    <div class="lw-trial-feature-icon">
                        <svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                    <div class="lw-trial-feature-text">プロ仕様の<br>カスタマイズ</div>
                </div>
                <div class="lw-trial-feature">
                    <div class="lw-trial-feature-icon">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div class="lw-trial-feature-text">制限なし<br>14日間</div>
                </div>
            </div>

            <p class="lw-trial-info">期間中はすべてのプレミアム機能を<br>制限なくお使いいただけます</p>

            <div class="lw-trial-note">
                <span>
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    クレジットカード不要
                </span>
                <span>
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    自動課金なし
                </span>
            </div>

            <div class="lw-trial-buttons">
                <button class="lw-trial-btn lw-trial-btn-yes" id="lwTrialYes">無料で試してみる</button>
                <button class="lw-trial-btn lw-trial-btn-no" id="lwTrialNo">後で</button>
            </div>

            <div class="lw-trial-skip-checkbox">
                <label>
                    <input type="checkbox" id="lwTrialSkipCheckbox">
                    60日間、このメッセージを表示しない
                </label>
            </div>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        $('#lwTrialYes').on('click', function() {
            const $btn = $(this);
            $btn.prop('disabled', true).text('処理中...');

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'lw_activate_trial',
                    nonce: '<?php echo wp_create_nonce('lw_trial_nonce'); ?>'
                },
                success: function(response) {
                    if (response.success) {
                        $btn.text('完了');

                        const successMsg = $('<div class="lw-trial-success">プレミアム機能が有効になりました</div>');
                        $('.lw-trial-buttons').after(successMsg);

                        setTimeout(function() {
                            $('#lwTrialOverlay').fadeOut(400, function() {
                                $(this).remove();
                                location.reload();
                            });
                        }, 1500);
                    } else {
                        alert('エラーが発生しました。もう一度お試しください。');
                        $btn.prop('disabled', false).text('無料で試してみる');
                    }
                }
            });
        });

        $('#lwTrialNo').on('click', function() {
            if ($('#lwTrialSkipCheckbox').is(':checked')) {
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'lw_skip_trial_for_60days',
                        nonce: '<?php echo wp_create_nonce('lw_skip_trial_nonce'); ?>'
                    },
                    success: function(response) {
                        $('#lwTrialOverlay').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                });
            } else {
                $('#lwTrialOverlay').fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });

        $('#lwTrialOverlay').on('click', function(e) {
            if (e.target.id === 'lwTrialOverlay') {
                $(this).fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    });
    </script>
    <?php
}

// 残り日数警告ポップアップのレンダリング（プレミアム・未来感バージョン）
function lw_render_trial_warning_popup($days_remaining) {
    $progress_percent = ((14 - $days_remaining) / 14) * 100;
    ?>
    <style>
        .lw-warning-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
            backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            animation: lw-fadeIn 0.4s ease;
            overflow-y: auto;
            box-sizing: border-box;
        }

        .lw-warning-popup {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            padding: 48px 44px;
            border-radius: 24px;
            max-width: 480px;
            width: 100%;
            box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.1),
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 100px rgba(245, 158, 11, 0.1);
            text-align: center;
            position: relative;
            animation: lw-slideUp 0.5s ease;
            overflow: hidden;
        }

        .lw-warning-popup::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #f59e0b, #d97706, #b45309);
        }

        .lw-warning-icon {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 2px solid #f59e0b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 28px;
            position: relative;
            z-index: 1;
        }

        .lw-warning-icon svg {
            width: 36px;
            height: 36px;
            stroke: #d97706;
            stroke-width: 2;
            fill: none;
        }

        .lw-warning-popup h2 {
            margin: 0 0 24px;
            color: #0f172a;
            font-size: 22px;
            line-height: 1.4;
            font-weight: 700;
            letter-spacing: -0.3px;
        }

        .lw-warning-countdown {
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border: 1px solid #fde68a;
            border-radius: 16px;
            padding: 24px;
            margin: 0 0 24px;
        }

        .lw-warning-countdown-number {
            font-size: 56px;
            font-weight: 700;
            color: #d97706;
            display: block;
            line-height: 1;
            letter-spacing: -2px;
        }

        .lw-warning-countdown-text {
            display: block;
            color: #92400e;
            font-size: 14px;
            font-weight: 500;
            margin-top: 8px;
        }

        .lw-warning-progress {
            width: 100%;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
            margin: 0 0 24px;
        }

        .lw-warning-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #f59e0b, #d97706);
            border-radius: 3px;
            transition: width 0.5s ease;
        }

        .lw-warning-popup p {
            margin: 0 0 16px;
            color: #64748b;
            font-size: 14px;
            line-height: 1.7;
        }

        .lw-warning-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #0284c7;
            text-decoration: none;
            font-weight: 500;
            font-size: 13px;
            margin-bottom: 28px;
        }

        .lw-warning-link:hover {
            text-decoration: underline;
        }

        .lw-warning-link svg {
            width: 14px;
            height: 14px;
            stroke: currentColor;
            stroke-width: 2;
            fill: none;
        }

        .lw-warning-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .lw-warning-btn {
            background: #f1f5f9;
            color: #475569;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .lw-warning-btn:hover {
            background: #e2e8f0;
            color: #1e293b;
        }

        .lw-warning-popup .lw-trial-btn-yes {
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: #fff;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 20px rgba(14, 165, 233, 0.35);
        }

        .lw-warning-popup .lw-trial-btn-yes:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(14, 165, 233, 0.45);
        }
    </style>

    <div class="lw-warning-overlay" id="lwTrialWarningOverlay">
        <div class="lw-warning-popup">
            <div class="lw-warning-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>

            <h2>試用期間終了まであとわずかです</h2>

            <div class="lw-warning-countdown">
                <span class="lw-warning-countdown-number"><?php echo $days_remaining; ?></span>
                <span class="lw-warning-countdown-text">日後に終了予定</span>
            </div>

            <div class="lw-warning-progress">
                <div class="lw-warning-progress-bar" style="width: <?php echo $progress_percent; ?>%"></div>
            </div>

            <p>
                プレミアム機能の試用期間が残り<strong><?php echo $days_remaining; ?>日</strong>となりました。<br>
                終了後はプレミアム機能をご利用いただけなくなります。
            </p>

            <a href="<?php echo lw_premium_info_link(); ?>" target="_blank" class="lw-warning-link">
                プレミアムプランを確認する
                <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>

            <div class="lw-warning-buttons">
                <a href="<?php echo admin_url('index.php?show_premium_popup=1'); ?>" target="_blank" class="lw-trial-btn lw-trial-btn-yes">プレミアムプランへ変更</a>
                <button class="lw-warning-btn" id="lwTrialWarningOk">確認しました</button>
            </div>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        $('#lwTrialWarningOk').on('click', function() {
            $('#lwTrialWarningOverlay').fadeOut(300, function() {
                $(this).remove();
            });
        });

        $('#lwTrialWarningOverlay').on('click', function(e) {
            if (e.target.id === 'lwTrialWarningOverlay') {
                $(this).fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    });
    </script>
    <?php
}

// 期限切れポップアップのレンダリング（プレミアム・未来感バージョン）
function lw_render_trial_expired_popup() {
    ?>
    <style>
        .lw-expired-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
            backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            animation: lw-fadeIn 0.4s ease;
            overflow-y: auto;
            box-sizing: border-box;
        }

        .lw-expired-popup {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            padding: 48px 44px;
            border-radius: 24px;
            max-width: 480px;
            width: 100%;
            box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.1),
                0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
            position: relative;
            animation: lw-slideUp 0.5s ease;
            overflow: hidden;
        }

        .lw-expired-popup::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #94a3b8, #64748b, #475569);
        }

        .lw-expired-icon {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border: 2px solid #cbd5e1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 28px;
            position: relative;
            z-index: 1;
        }

        .lw-expired-icon svg {
            width: 36px;
            height: 36px;
            stroke: #64748b;
            stroke-width: 2;
            fill: none;
        }

        .lw-expired-popup h2 {
            margin: 0 0 12px;
            color: #0f172a;
            font-size: 22px;
            line-height: 1.4;
            font-weight: 700;
            letter-spacing: -0.3px;
        }

        .lw-expired-subtitle {
            color: #64748b;
            font-size: 14px;
            margin: 0 0 28px;
            line-height: 1.6;
        }

        .lw-expired-features {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 0 0 24px;
            text-align: left;
        }

        .lw-expired-features-title {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            margin: 0 0 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .lw-expired-features ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .lw-expired-features li {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #94a3b8;
            font-size: 13px;
        }

        .lw-expired-features li svg {
            width: 14px;
            height: 14px;
            stroke: #cbd5e1;
            stroke-width: 2;
            fill: none;
            flex-shrink: 0;
        }

        .lw-expired-next-info {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 16px;
            margin: 0 0 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #0369a1;
            font-size: 13px;
            font-weight: 500;
        }

        .lw-expired-next-info svg {
            width: 18px;
            height: 18px;
            stroke: #0284c7;
            stroke-width: 2;
            fill: none;
            flex-shrink: 0;
        }

        .lw-expired-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .lw-expired-btn-upgrade {
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: #fff;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
            text-decoration: none;
            display: inline-block;
        }

        .lw-expired-btn-upgrade:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(14, 165, 233, 0.4);
            color: #fff;
        }

        .lw-expired-btn-detail {
            background: #e0f2fe;
            color: #0284c7;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-block;
        }

        .lw-expired-btn-detail:hover {
            background: #bae6fd;
            color: #0369a1;
        }

        .lw-expired-btn-close {
            background: #f1f5f9;
            color: #64748b;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .lw-expired-btn-close:hover {
            background: #e2e8f0;
            color: #475569;
        }
    </style>

    <div class="lw-expired-overlay" id="lwTrialExpiredOverlay">
        <div class="lw-expired-popup">
            <div class="lw-expired-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>

            <h2>試用期間が終了しました</h2>
            <p class="lw-expired-subtitle">プレミアム機能の無料試用期間が終了しました。<br>ご利用いただきありがとうございました。</p>

            <div class="lw-expired-features">
                <div class="lw-expired-features-title">制限される機能</div>
                <ul>
                    <li>
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        レイアウトパーツ
                    </li>
                    <li>
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ボタン・CTA
                    </li>
                    <li>
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        スライダー
                    </li>
                    <li>
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        その他多数
                    </li>
                </ul>
            </div>

            <div class="lw-expired-next-info">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                60日後に再度無料でお試しいただけます
            </div>

            <div class="lw-expired-buttons">
                <a href="<?php echo admin_url('index.php?show_premium_popup=1'); ?>" target="_blank" class="lw-expired-btn-upgrade">プレミアムプランへ変更</a>
                <a href="<?php echo lw_premium_info_link(); ?>" target="_blank" class="lw-expired-btn-detail">詳細を見る</a>
                <button class="lw-expired-btn-close" id="lwTrialExpiredOk">閉じる</button>
            </div>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        $('#lwTrialExpiredOk').on('click', function() {
            $('#lwTrialExpiredOverlay').fadeOut(300, function() {
                $(this).remove();
            });
        });

        $('#lwTrialExpiredOverlay').on('click', function(e) {
            if (e.target.id === 'lwTrialExpiredOverlay') {
                $(this).fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    });
    </script>
    <?php
}

// Ajax処理：試用期間の有効化
add_action('wp_ajax_lw_activate_trial', 'lw_activate_trial_callback');
function lw_activate_trial_callback() {
    // nonceチェック
    if (!wp_verify_nonce($_POST['nonce'], 'lw_trial_nonce')) {
        wp_die('Security check failed');
    }
    
    // 管理者権限チェック
    if (!current_user_can('administrator')) {
        wp_send_json_error('権限がありません');
        return;
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_template_setting';
    
    // trial_periodが既に存在するかチェック
    $exists = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT COUNT(*) FROM {$table_name} WHERE template_id = %s",
            'trial_period'
        )
    );
    
    if ($exists) {
        // 既存のレコードを更新（タイムスタンプを現在時刻に更新）
        $result = $wpdb->update(
            $table_name,
            array(
                'timestamp' => current_time('mysql'),
                'active_flag' => 1
            ),
            array('template_id' => 'trial_period'),
            array('%s', '%d'),
            array('%s')
        );
    } else {
        // 新規レコードを挿入
        $result = $wpdb->insert(
            $table_name,
            array(
                'template_id' => 'trial_period',
                'timestamp' => current_time('mysql'),
                'active_flag' => 1
            ),
            array('%s', '%s', '%d')
        );
    }
    
    if ($result !== false) {
        wp_send_json_success('試用期間が有効になりました');
    } else {
        wp_send_json_error('データベースエラーが発生しました');
    }
}

// Ajax処理：60日間試用をスキップ
add_action('wp_ajax_lw_skip_trial_for_60days', 'lw_skip_trial_for_60days_callback');
function lw_skip_trial_for_60days_callback() {
    // nonceチェック
    if (!wp_verify_nonce($_POST['nonce'], 'lw_skip_trial_nonce')) {
        wp_die('Security check failed');
    }
    
    // 管理者権限チェック
    if (!current_user_can('administrator')) {
        wp_send_json_error('権限がありません');
        return;
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_template_setting';
    
    // trial_periodが既に存在するかチェック
    $exists = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT COUNT(*) FROM {$table_name} WHERE template_id = %s",
            'trial_period'
        )
    );
    
    if ($exists) {
        // 既存のレコードを更新（タイムスタンプを現在時刻に更新、active_flagを0に）
        $result = $wpdb->update(
            $table_name,
            array(
                'timestamp' => current_time('mysql'),
                'active_flag' => 0
            ),
            array('template_id' => 'trial_period'),
            array('%s', '%d'),
            array('%s')
        );
    } else {
        // 新規レコードを挿入（active_flag = 0で作成）
        $result = $wpdb->insert(
            $table_name,
            array(
                'template_id' => 'trial_period',
                'timestamp' => current_time('mysql'),
                'active_flag' => 0
            ),
            array('%s', '%s', '%d')
        );
    }
    
    if ($result !== false) {
        wp_send_json_success('60日間スキップされました');
    } else {
        wp_send_json_error('データベースエラーが発生しました');
    }
}

// 試用期間の残り日数を取得する関数（active_flagを更新しないバージョン）
function lw_get_trial_days_remaining_without_update() {
    $templateSetting = new LwTemplateSetting();
    $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');
    
    if (!$trial_setting || $trial_setting['active_flag'] == 0) {
        return 0;
    }
    
    $start_date = strtotime($trial_setting['timestamp']);
    $end_date = strtotime('+14 days', $start_date);
    $now = time();
    
    if ($now >= $end_date) {
        return 0;
    }
    
    $remaining_seconds = $end_date - $now;
    $remaining_days = ceil($remaining_seconds / (60 * 60 * 24));
    
    return $remaining_days;
}

// 試用期間の残り日数を取得する関数（期限切れ時に自動更新する）
function lw_get_trial_days_remaining() {
    $templateSetting = new LwTemplateSetting();
    $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');
    
    if (!$trial_setting || $trial_setting['active_flag'] == 0) {
        return 0;
    }
    
    $start_date = strtotime($trial_setting['timestamp']);
    $end_date = strtotime('+14 days', $start_date);
    $now = time();
    
    if ($now >= $end_date) {
        return 0;
    }
    
    $remaining_seconds = $end_date - $now;
    $remaining_days = ceil($remaining_seconds / (60 * 60 * 24));
    
    return $remaining_days;
}

// 試用期間が実際に有効かどうかを確認する関数
function lw_is_trial_active() {
    $templateSetting = new LwTemplateSetting();
    
    // サブスクリプション契約者は常に有料機能を利用可能（ただし試用期間とは別扱い）
    $subscription_setting = $templateSetting->get_template_setting_by_id('paid-lw-parts-sub-hbjkjhkljh');
    if ($subscription_setting && $subscription_setting['active_flag'] == 1) {
        return false; // 試用期間ではないのでfalse
    }
    
    $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');
    
    if (!$trial_setting || $trial_setting['active_flag'] == 0) {
        return false;
    }
    
    // 残り日数が0日の場合はfalseを返す（active_flagは更新しない）
    $days_remaining = lw_get_trial_days_remaining_without_update();
    
    return $days_remaining > 0;
}

// サブスクリプションが有効かどうかを確認する関数
function lw_is_subscription_active() {
    $templateSetting = new LwTemplateSetting();
    
    $paid_sub_setting = $templateSetting->get_template_setting_by_id('paid-lw-parts-sub-hbjkjhkljh');
    if ($paid_sub_setting && $paid_sub_setting['active_flag'] == 1) {
        return true;
    }
    
    $sub_pre_setting = $templateSetting->get_template_setting_by_id('sub_pre_set');
    if ($sub_pre_setting && $sub_pre_setting['active_flag'] == 1) {
        return true;
    }
    
    return false;
}


// 管理画面に試用期間の情報を表示（リッチバージョン）
add_action('admin_notices', 'lw_show_trial_notice');
function lw_show_trial_notice() {
    if (!current_user_can('administrator')) {
        return;
    }
    
    $templateSetting = new LwTemplateSetting();
    
    // サブスクリプション契約者は通知を表示しない（修正版）
    if (lw_is_subscription_active()) {
        return;
    }
    
    $trial_setting = $templateSetting->get_template_setting_by_id('trial_period');
    
    if (!$trial_setting) {
        return;
    }
    
    // 試用期間が有効かチェック
    $is_active = lw_is_trial_active();
    $days_remaining = lw_get_trial_days_remaining_without_update();
    
    if ($is_active && $days_remaining > 0 && $days_remaining <= 5) {
        // 残り5日以下の警告表示
        ?>
        <style>
            .lw-admin-notice-warning {
                background: linear-gradient(135deg, #fff9f5 0%, #fff5f0 100%);
                border-left: 4px solid #f39c12;
                box-shadow: 0 2px 10px rgba(243, 156, 18, 0.1);
            }
            .lw-admin-notice-warning p {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .lw-admin-notice-warning .lw-notice-icon {
                font-size: 24px;
            }
            .lw-admin-notice-warning .lw-notice-days {
                background: #f39c12;
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-weight: bold;
            }
        </style>
        <div class="notice lw-admin-notice-warning is-dismissible">
            <p>
                <span class="lw-notice-icon">⚠️</span>
                <strong>LiteWordプレミアム試用期間：</strong>
                残り<span class="lw-notice-days"><?php echo $days_remaining; ?>日</span>です。
                期間終了後はプレミアム機能が利用できなくなります。プレミアムへの切替は<a href="<?=admin_url('index.php?show_premium_popup=1')?>" target="_blank">こちら</a>から。
            </p>
        </div>
        <?php
    } elseif ($is_active && $days_remaining > 5) {
        // 通常の試用期間表示（プレミアム・未来感バージョン）
        $progress_percent = ((14 - $days_remaining) / 14) * 100;
        ?>
        <style>
            .lw-admin-notice-info {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                border: none;
                border-radius: 12px;
                padding: 0;
                margin: 15px 20px 15px 2px;
                box-shadow:
                    0 4px 20px rgba(14, 165, 233, 0.15),
                    0 0 0 1px rgba(14, 165, 233, 0.1);
                overflow: hidden;
                position: relative;
            }
            .lw-admin-notice-info::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #0ea5e9, #38bdf8, #0284c7);
                background-size: 200% 100%;
                animation: lw-notice-gradient 3s ease infinite;
            }
            @keyframes lw-notice-gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .lw-notice-inner {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px 20px;
            }
            .lw-notice-icon-wrap {
                width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
            }
            .lw-notice-icon-wrap svg {
                width: 22px;
                height: 22px;
                stroke: #fff;
                stroke-width: 2;
                fill: none;
            }
            .lw-notice-content {
                flex: 1;
                min-width: 0;
            }
            .lw-notice-title {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
            }
            .lw-notice-badge {
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                color: #fff;
                font-size: 10px;
                font-weight: 700;
                padding: 3px 8px;
                border-radius: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .lw-notice-title-text {
                color: #f8fafc;
                font-size: 14px;
                font-weight: 600;
            }
            .lw-notice-progress-wrap {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .lw-notice-progress {
                flex: 1;
                max-width: 180px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
            }
            .lw-notice-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #0ea5e9, #38bdf8);
                border-radius: 2px;
                transition: width 0.5s ease;
            }
            .lw-notice-days {
                color: #38bdf8;
                font-size: 13px;
                font-weight: 600;
            }
            .lw-notice-days strong {
                color: #fff;
                font-size: 18px;
                margin-right: 2px;
            }
            .lw-notice-action {
                flex-shrink: 0;
            }
            .lw-notice-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(14, 165, 233, 0.15);
                border: 1px solid rgba(14, 165, 233, 0.3);
                color: #38bdf8;
                padding: 8px 14px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.2s ease;
            }
            .lw-notice-btn:hover {
                background: rgba(14, 165, 233, 0.25);
                border-color: rgba(14, 165, 233, 0.5);
                color: #7dd3fc;
                transform: translateY(-1px);
            }
            .lw-notice-btn svg {
                width: 14px;
                height: 14px;
                stroke: currentColor;
                stroke-width: 2;
                fill: none;
            }
            /* WordPress の閉じるボタンスタイル調整 */
            .lw-admin-notice-info .notice-dismiss {
                top: 50%;
                transform: translateY(-50%);
                padding: 10px;
            }
            .lw-admin-notice-info .notice-dismiss::before {
                color: #64748b;
                transition: color 0.2s ease;
            }
            .lw-admin-notice-info .notice-dismiss:hover::before {
                color: #94a3b8;
            }
            @media (max-width: 782px) {
                .lw-notice-inner {
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .lw-notice-content {
                    flex: 1 1 calc(100% - 60px);
                }
                .lw-notice-action {
                    width: 100%;
                }
                .lw-notice-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        </style>
        <div class="notice lw-admin-notice-info is-dismissible" id="lw-trial-notice-info" style="display:none;">
            <div class="lw-notice-inner">
                <div class="lw-notice-icon-wrap">
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div class="lw-notice-content">
                    <div class="lw-notice-title">
                        <span class="lw-notice-badge">Premium Trial</span>
                        <span class="lw-notice-title-text">プレミアム機能を試用中</span>
                    </div>
                    <div class="lw-notice-progress-wrap">
                        <div class="lw-notice-progress">
                            <div class="lw-notice-progress-bar" style="width: <?php echo $progress_percent; ?>%"></div>
                        </div>
                        <span class="lw-notice-days">残り <strong><?php echo $days_remaining; ?></strong>日</span>
                    </div>
                </div>
                <div class="lw-notice-action">
                    <a href="<?php echo admin_url('index.php?show_premium_popup=1'); ?>" target="_blank" class="lw-notice-btn">
                        プレミアムへ変更
                        <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                </div>
            </div>
        </div>
        <script>
        (function() {
            const STORAGE_KEY = 'lw_trial_notice_dismissed';
            const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 1日（ミリ秒）
            const notice = document.getElementById('lw-trial-notice-info');

            if (!notice) return;

            // 前回の非表示時刻をチェック
            const dismissedAt = localStorage.getItem(STORAGE_KEY);
            if (dismissedAt) {
                const elapsed = Date.now() - parseInt(dismissedAt, 10);
                if (elapsed < DISMISS_DURATION) {
                    // まだ1日経っていないので表示しない
                    notice.remove();
                    return;
                }
            }

            // 表示する
            notice.style.display = '';

            // 閉じるボタンのクリックを監視
            notice.addEventListener('click', function(e) {
                if (e.target.classList.contains('notice-dismiss') || e.target.closest('.notice-dismiss')) {
                    localStorage.setItem(STORAGE_KEY, Date.now().toString());
                }
            });
        })();
        </script>
        <?php
    } elseif (!$is_active && $trial_setting['active_flag'] == 0) {
        // 試用期間終了後の日数を計算
        $last_timestamp = strtotime($trial_setting['timestamp']);
        $now = time();
        $days_since_start = floor(($now - $last_timestamp) / (60 * 60 * 24));
        $days_until_next_trial = 60 - $days_since_start;
        
        if ($days_until_next_trial > 0 && $days_until_next_trial <= 7) {
            // 次の試用期間まで7日以内の場合
            ?>
            <style>
                .lw-admin-notice-upcoming {
                    background: linear-gradient(135deg, #f5f3ff 0%, #ede7ff 100%);
                    border-left: 4px solid #9b59b6;
                    box-shadow: 0 2px 10px rgba(155, 89, 182, 0.1);
                }
                .lw-admin-notice-upcoming p {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .lw-admin-notice-upcoming .lw-notice-icon {
                    font-size: 24px;
                }
            </style>
            <div class="notice lw-admin-notice-upcoming is-dismissible">
                <p>
                    <span class="lw-notice-icon">✨</span>
                    <strong>LiteWord：</strong>
                    あと<?php echo $days_until_next_trial; ?>日で再度2週間の無料試用期間をご利用いただけます。
                </p>
            </div>
            <?php
        }
    }
}

// 既存のlw_active_template_ids関数をオーバーライド（優先度を高く設定）
if (!function_exists('lw_active_template_ids_with_trial')) {
    function lw_active_template_ids_with_trial($page_template_url = "", $shop_url = "") {
        $templateSetting = new LwTemplateSetting();
        
        // サブスクリプション契約者の確認（修正版）
        $is_subscription_active = lw_is_subscription_active();
        
        // 試用期間が実際に有効かチェック
        $is_trial_active = lw_is_trial_active();
        
        $template_ids = [];
        
        if ($is_subscription_active || $is_trial_active) {
            // サブスクリプション契約中または試用期間中：すべての有料テンプレートを有効化
            $template_items = LwTemplateItems($page_template_url, $shop_url);
            
            foreach ($template_items as $item) {
                if (isset($item['item_detail']['paid']) && $item['item_detail']['paid'] === true) {
                    // テンプレートIDを追加
                    if (isset($item['item_detail']['template_id'])) {
                        $template_ids[] = $item['item_detail']['template_id'];
                    }
                    
                    // 関連ブロックも追加
                    if (isset($item['item_detail']['block_used']) && is_array($item['item_detail']['block_used'])) {
                        foreach ($item['item_detail']['block_used'] as $block_id) {
                            $template_ids[] = $block_id;
                        }
                    }
                }
            }
        } else {
            // 通常時：元の関数を呼び出す
            return lw_active_template_ids($page_template_url, $shop_url);
        }
        
        return array_values(array_unique($template_ids));
    }
}

// フィルターを使って既存関数の結果を変更
add_filter('init', 'lw_override_template_functions', 999);
function lw_override_template_functions() {
    // templateSettingCheck関数のラッパー
    if (!function_exists('templateSettingCheck_with_trial')) {
        function templateSettingCheck_with_trial($id) {
            $templateSetting = new LwTemplateSetting();
            
            // サブスクリプション契約者の確認（修正版）
            $is_subscription_active = lw_is_subscription_active();
            
            // サブスクリプション契約中または試用期間が実際に有効かチェック
            if ($is_subscription_active || lw_is_trial_active()) {
                // すべての有料テンプレートを有効とみなす
                $template_items = LwTemplateItems();
                foreach ($template_items as $item) {
                    if (isset($item['item_detail']['paid']) && 
                        $item['item_detail']['paid'] === true && 
                        isset($item['item_detail']['template_id']) &&
                        $item['item_detail']['template_id'] === $id) {
                        return true;
                    }
                    
                    // block_usedもチェック
                    if (isset($item['item_detail']['block_used']) && 
                        is_array($item['item_detail']['block_used']) &&
                        in_array($id, $item['item_detail']['block_used'])) {
                        return true;
                    }
                }
            }
            
            // 通常時：元の関数を呼び出す
            return templateSettingCheck($id);
        }
    }
}

// 関数の存在確認と上書き用のアクション
add_action('after_setup_theme', 'lw_setup_trial_override', 999);
function lw_setup_trial_override() {
    // 必要に応じて追加の設定
}