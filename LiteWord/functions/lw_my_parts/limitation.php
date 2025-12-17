<?php
/**
 * マイパーツ無料プラン制限機能
 * 実際の投稿数が5個以上の場合、新規作成をブロック
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* ===================================================================
 * 共通関数
 * ================================================================ */

if ( ! function_exists( 'lw_premium_info_link' ) ) {
    function lw_premium_info_link() {
        $custom_url = get_theme_mod( 'lw_premium_info_url', '' );
        if ( ! empty( $custom_url ) ) {
            return esc_url( $custom_url );
        }
        return 'https://lite-word.com/yuryo-plan/';
    }
}

/**
 * 実際のマイパーツ投稿数を取得
 * @return int 投稿数
 */
function lw_get_actual_my_parts_count() {
    $count = wp_count_posts( 'lw_my_parts' );
    
    // publish + draft + pending + private の合計
    $total = 0;
    if ( isset( $count->publish ) ) $total += $count->publish;
    if ( isset( $count->draft ) ) $total += $count->draft;
    if ( isset( $count->pending ) ) $total += $count->pending;
    if ( isset( $count->private ) ) $total += $count->private;
    
    return $total;
}

/**
 * マイパーツの作成制限に達しているかチェック
 * @return bool 制限に達している場合true
 */
function lw_is_my_parts_limit_reached() {
    // 有料プランは制限なし
    if ( defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION ) {
        return false;
    }
    
    // トライアル中は制限なし
    if ( function_exists( 'lw_is_trial_active' ) && lw_is_trial_active() ) {
        return false;
    }
    
    // 実際の投稿数が5個以上なら制限
    return lw_get_actual_my_parts_count() >= 5;
}

/* ===================================================================
 * 新規作成時のチェック（DB保存前にブロック）
 * ================================================================ */

add_action( 'wp_insert_post', function( $post_id, $post, $update ) {
    // 新規作成時のみチェック（更新は許可）
    if ( $update ) {
        return;
    }
    
    // マイパーツ以外はスキップ
    if ( $post->post_type !== 'lw_my_parts' ) {
        return;
    }
    
    // 自動保存・リビジョンはスキップ
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
        return;
    }
    
    // auto-draft, inherit はスキップ
    if ( in_array( $post->post_status, ['auto-draft', 'inherit'] ) ) {
        return;
    }
    
    // 制限チェック（この投稿を含めて6個以上になる場合）
    if ( lw_is_my_parts_limit_reached() ) {
        // この投稿を削除
        wp_delete_post( $post_id, true );
        
        // エラーメッセージを表示してリダイレクト
        wp_die(
            '<div style="max-width: 600px; margin: 100px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <h1 style="color: #d63638; margin-bottom: 20px;">⚠️ マイパーツ作成制限</h1>
                <p style="font-size: 16px; color: #333; margin-bottom: 25px; line-height: 1.6;">
                    無料プランでは<strong>5個まで</strong>のマイパーツが作成可能です。<br>
                    現在、すでに<strong>' . lw_get_actual_my_parts_count() . '個</strong>のマイパーツが存在しています。
                </p>
                <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
                    追加でマイパーツを作成するには<br>
                    LiteWordプレミアムプランへの登録が必要です。
                </p>
                <p>
                    <a href="' . admin_url( 'index.php?show_premium_popup=1' ) . '" target="_blank" style="display: inline-block; padding: 15px 30px; background: #0073aa; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;">プレミアムプランを見る</a>
                    <a href="' . admin_url( 'edit.php?post_type=lw_my_parts' ) . '" style="display: inline-block; padding: 15px 30px; background: #666; color: #fff; text-decoration: none; border-radius: 4px;">一覧に戻る</a>
                </p>
            </div>',
            'マイパーツ作成制限',
            array( 'response' => 403 )
        );
    }
}, 10, 3 );

/* ===================================================================
 * 管理画面でのリンク無効化とポップアップ
 * ================================================================ */

add_action( 'admin_footer', function() {
    global $typenow;
    
    // マイパーツ画面以外はスキップ
    if ( $typenow !== 'lw_my_parts' ) {
        return;
    }
    
    // 制限に達していない場合はスキップ
    if ( ! lw_is_my_parts_limit_reached() ) {
        return;
    }
    
    $premium_url = lw_premium_info_link();
    $current_count = lw_get_actual_my_parts_count();
    ?>
    <style>
    .lw-limit-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    .lw-limit-popup-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    .lw-limit-popup {
        background: #fff;
        padding: 0;
        border-radius: 20px;
        max-width: 480px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.9) translateY(20px);
        transition: transform 0.3s ease;
        overflow: hidden;
    }
    .lw-limit-popup-overlay.active .lw-limit-popup {
        transform: scale(1) translateY(0);
    }
    .lw-limit-popup-header {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        padding: 32px 32px 24px;
    }
    .lw-limit-popup-icon {
        width: 64px;
        height: 64px;
        background: rgba(245, 158, 11, 0.2);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
    }
    .lw-limit-popup-icon .dashicons {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #d97706;
    }
    .lw-limit-popup-badge {
        display: inline-block;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 20px;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
    }
    .lw-limit-popup-title {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        color: #92400e;
    }
    .lw-limit-popup-body {
        padding: 28px 32px 32px;
    }
    .lw-limit-popup-count {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 20px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
    }
    .lw-limit-popup-count-item {
        text-align: center;
    }
    .lw-limit-popup-count-label {
        font-size: 11px;
        color: #6b7280;
        margin-bottom: 4px;
    }
    .lw-limit-popup-count-value {
        font-size: 28px;
        font-weight: 700;
        color: #1f2937;
    }
    .lw-limit-popup-count-value.limit {
        color: #d97706;
    }
    .lw-limit-popup-count-divider {
        font-size: 24px;
        color: #d1d5db;
    }
    .lw-limit-popup-text {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.6;
        margin-bottom: 24px;
    }
    .lw-limit-popup-actions {
        display: flex;
        gap: 12px;
    }
    .lw-limit-popup-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 24px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
    }
    .lw-limit-popup-btn .dashicons {
        font-size: 16px;
        width: 16px;
        height: 16px;
    }
    .lw-limit-popup-btn-primary {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
    }
    .lw-limit-popup-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        color: #fff;
    }
    .lw-limit-popup-btn-secondary {
        background: #f3f4f6;
        color: #4b5563;
    }
    .lw-limit-popup-btn-secondary:hover {
        background: #e5e7eb;
        color: #1f2937;
    }
    </style>
    <script>
    jQuery(document).ready(function($) {
        // 新規追加ボタン（一覧画面上部）
        $('.page-title-action').each(function() {
            if ($(this).text().indexOf('新規追加') !== -1) {
                var $link = $(this);

                // リンクを無効化してスタイル変更
                $link.removeAttr('href')
                    .css({
                        'opacity': '0.5',
                        'cursor': 'not-allowed',
                        'background': '#9ca3af',
                        'color': '#fff'
                    })
                    .click(function(e) {
                        e.preventDefault();

                        // ポップアップ表示
                        if ($('#lw-my-parts-limit-popup').length === 0) {
                            var popup = `
                                <div id="lw-my-parts-limit-popup" class="lw-limit-popup-overlay">
                                    <div class="lw-limit-popup">
                                        <div class="lw-limit-popup-header">
                                            <div class="lw-limit-popup-icon">
                                                <span class="dashicons dashicons-warning"></span>
                                            </div>
                                            <span class="lw-limit-popup-badge">作成上限に到達</span>
                                            <h2 class="lw-limit-popup-title">マイパーツ作成制限</h2>
                                        </div>
                                        <div class="lw-limit-popup-body">
                                            <div class="lw-limit-popup-count">
                                                <div class="lw-limit-popup-count-item">
                                                    <div class="lw-limit-popup-count-label">現在の数</div>
                                                    <div class="lw-limit-popup-count-value"><?php echo $current_count; ?></div>
                                                </div>
                                                <div class="lw-limit-popup-count-divider">/</div>
                                                <div class="lw-limit-popup-count-item">
                                                    <div class="lw-limit-popup-count-label">無料プラン上限</div>
                                                    <div class="lw-limit-popup-count-value limit">5</div>
                                                </div>
                                            </div>
                                            <p class="lw-limit-popup-text">
                                                追加でマイパーツを作成するには<br>
                                                LiteWordプレミアムプランへの登録が必要です。
                                            </p>
                                            <div class="lw-limit-popup-actions">
                                                <a href="<?php echo $premium_url; ?>" target="_blank" class="lw-limit-popup-btn lw-limit-popup-btn-primary">
                                                    <span class="dashicons dashicons-external"></span>
                                                    プレミアムプランを見る
                                                </a>
                                                <button id="lw-popup-close" class="lw-limit-popup-btn lw-limit-popup-btn-secondary">
                                                    閉じる
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            $('body').append(popup);

                            // 閉じるボタン
                            $('#lw-popup-close').click(function(e) {
                                e.stopPropagation();
                                $('#lw-my-parts-limit-popup').removeClass('active');
                            });

                            // オーバーレイクリックで閉じる
                            $('#lw-my-parts-limit-popup').click(function(e) {
                                if (e.target === this) {
                                    $(this).removeClass('active');
                                }
                            });
                        }

                        setTimeout(function() {
                            $('#lw-my-parts-limit-popup').addClass('active');
                        }, 10);
                        return false;
                    });
            }
        });

        // サイドメニューの新規追加リンクも無効化
        $('#menu-posts-lw_my_parts .wp-submenu a').each(function() {
            if ($(this).attr('href') && $(this).attr('href').indexOf('post-new.php') !== -1) {
                var $link = $(this);

                $link.removeAttr('href')
                    .css({
                        'opacity': '0.5',
                        'cursor': 'not-allowed',
                        'color': '#9ca3af'
                    })
                    .click(function(e) {
                        e.preventDefault();

                        // 同じポップアップを表示
                        $('.page-title-action:contains("新規追加")').click();
                        return false;
                    });

                // リンクの横に「制限中」を追加
                if (!$link.find('.lw-limit-badge').length) {
                    $link.append('<span class="lw-limit-badge" style="background: linear-gradient(135deg, #f59e0b, #d97706); color:#fff; padding:2px 8px; border-radius:4px; font-size:10px; margin-left:6px; font-weight:600;">制限中</span>');
                }
            }
        });
    });
    </script>
    <?php
});

/* ===================================================================
 * 一覧画面での使用状況表示
 * ================================================================ */

add_action( 'admin_notices', function() {
    $screen = get_current_screen();
    
    if ( ! $screen || $screen->post_type !== 'lw_my_parts' || $screen->base !== 'edit' ) {
        return;
    }
    
    // 有料プランは表示しない
    if ( defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION ) {
        return;
    }
    
    // トライアル中は表示しない
    if ( function_exists( 'lw_is_trial_active' ) && lw_is_trial_active() ) {
        return;
    }
    
    $current_count = lw_get_actual_my_parts_count();
    $remaining = 5 - $current_count;
    
    if ( $remaining > 0 ) {
        ?>
        <div class="lw-parts-usage-notice lw-parts-usage-info">
            <div class="lw-parts-usage-inner">
                <div class="lw-parts-usage-icon">
                    <span class="dashicons dashicons-chart-bar"></span>
                </div>
                <div class="lw-parts-usage-content">
                    <div class="lw-parts-usage-title">無料プランでのマイパーツ作成状況</div>
                    <div class="lw-parts-usage-bar-wrap">
                        <div class="lw-parts-usage-bar">
                            <div class="lw-parts-usage-bar-fill" style="width: <?php echo ($current_count / 5) * 100; ?>%;"></div>
                        </div>
                        <div class="lw-parts-usage-count">
                            <span class="lw-parts-usage-current"><?php echo $current_count; ?></span> / 5個
                        </div>
                    </div>
                    <div class="lw-parts-usage-remaining">
                        あと<span><?php echo $remaining; ?>個</span>作成可能
                    </div>
                </div>
            </div>
        </div>
        <style>
        .lw-parts-usage-notice {
            margin: 20px 20px 10px 2px;
            padding: 0;
            border: none;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }
        .lw-parts-usage-info {
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
        }
        .lw-parts-usage-inner {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
        }
        .lw-parts-usage-icon {
            width: 44px;
            height: 44px;
            background: rgba(14, 165, 233, 0.15);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .lw-parts-usage-info .lw-parts-usage-icon .dashicons {
            color: #0284c7;
            font-size: 22px;
            width: 22px;
            height: 22px;
        }
        .lw-parts-usage-content {
            flex: 1;
        }
        .lw-parts-usage-title {
            font-size: 13px;
            font-weight: 600;
            color: #0369a1;
            margin-bottom: 8px;
        }
        .lw-parts-usage-bar-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .lw-parts-usage-bar {
            flex: 1;
            max-width: 200px;
            height: 8px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 4px;
            overflow: hidden;
        }
        .lw-parts-usage-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #0ea5e9, #0284c7);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        .lw-parts-usage-count {
            font-size: 14px;
            font-weight: 600;
            color: #0369a1;
        }
        .lw-parts-usage-current {
            font-size: 18px;
        }
        .lw-parts-usage-remaining {
            font-size: 12px;
            color: #0284c7;
            margin-top: 4px;
        }
        .lw-parts-usage-remaining span {
            font-weight: 600;
        }
        </style>
        <?php
    } else {
        ?>
        <div class="lw-parts-limit-notice">
            <div class="lw-parts-limit-inner">
                <div class="lw-parts-limit-icon">
                    <span class="dashicons dashicons-warning"></span>
                </div>
                <div class="lw-parts-limit-content">
                    <div class="lw-parts-limit-header">
                        <span class="lw-parts-limit-badge">上限到達</span>
                        <h3 class="lw-parts-limit-title">マイパーツの作成上限（5個）に達しました</h3>
                    </div>
                    <p class="lw-parts-limit-desc">
                        現在<strong><?php echo $current_count; ?>個</strong>のマイパーツが存在しています。
                        追加で作成するにはプレミアムプランへのアップグレードが必要です。
                    </p>
                </div>
                <div class="lw-parts-limit-action">
                    <a href="<?php echo admin_url('index.php?show_premium_popup=1'); ?>" target="_blank" class="lw-parts-limit-btn">
                        <span class="dashicons dashicons-external"></span>
                        プレミアムプランを見る
                    </a>
                </div>
            </div>
        </div>
        <style>
        .lw-parts-limit-notice {
            margin: 20px 20px 10px 2px;
            padding: 0;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(245, 158, 11, 0.15);
        }
        .lw-parts-limit-inner {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
        }
        .lw-parts-limit-icon {
            width: 48px;
            height: 48px;
            background: rgba(245, 158, 11, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .lw-parts-limit-icon .dashicons {
            color: #d97706;
            font-size: 24px;
            width: 24px;
            height: 24px;
        }
        .lw-parts-limit-content {
            flex: 1;
        }
        .lw-parts-limit-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 4px;
        }
        .lw-parts-limit-badge {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            letter-spacing: 0.5px;
        }
        .lw-parts-limit-title {
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            color: #92400e;
        }
        .lw-parts-limit-desc {
            margin: 0;
            font-size: 13px;
            color: #b45309;
            line-height: 1.5;
        }
        .lw-parts-limit-desc strong {
            color: #92400e;
        }
        .lw-parts-limit-action {
            flex-shrink: 0;
        }
        .lw-parts-limit-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 18px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }
        .lw-parts-limit-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
            color: #fff;
        }
        .lw-parts-limit-btn .dashicons {
            font-size: 14px;
            width: 14px;
            height: 14px;
        }
        @media (max-width: 782px) {
            .lw-parts-limit-inner {
                flex-direction: column;
                text-align: center;
            }
            .lw-parts-limit-header {
                justify-content: center;
                flex-wrap: wrap;
            }
            .lw-parts-limit-action {
                width: 100%;
            }
            .lw-parts-limit-btn {
                width: 100%;
                justify-content: center;
            }
        }
        </style>
        <?php
    }
});

/* ===================================================================
 * 直接URLアクセスもブロック
 * ================================================================ */

add_action( 'load-post-new.php', function() {
    global $typenow;
    
    if ( $typenow !== 'lw_my_parts' ) {
        return;
    }
    
    if ( lw_is_my_parts_limit_reached() ) {
        $current_count = lw_get_actual_my_parts_count();
        
        wp_die(
            '<div style="max-width: 600px; margin: 100px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <h1 style="color: #d63638; margin-bottom: 20px;">⚠️ アクセス制限</h1>
                <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
                    無料プランでのマイパーツ作成上限（5個）に達しています。<br>
                    現在<strong>' . $current_count . '個</strong>のマイパーツが存在しています。<br>
                    このページにはアクセスできません。
                </p>
                <p>
                    <a href="' . admin_url( 'index.php?show_premium_popup=1' ) . '" target="_blank" style="display: inline-block; padding: 15px 30px; background: #0073aa; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;">プレミアムプランを見る</a>
                    <a href="' . admin_url( 'edit.php?post_type=lw_my_parts' ) . '" style="display: inline-block; padding: 15px 30px; background: #666; color: #fff; text-decoration: none; border-radius: 4px;">一覧に戻る</a>
                </p>
            </div>',
            'アクセス制限',
            array( 'response' => 403 )
        );
    }
});