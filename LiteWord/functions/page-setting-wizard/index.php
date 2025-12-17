<?php
if (!defined('ABSPATH')) exit;

/**
 * 固定ページ編集時のタイトル・スラッグ入力ポップアップ機能
 * タイトルがnullまたは空の場合にポップアップを表示
 */

// 管理画面以外では読み込まない
if (!is_admin()) {
    return;
}

/**
 * 固定ページ編集画面でタイトル入力ポップアップ用のスクリプトを読み込む
 */
function lw_page_title_wizard_scripts($hook) {
    // post.php（編集）または post-new.php（新規作成）以外では処理しない
    if ($hook !== 'post.php' && $hook !== 'post-new.php') {
        return;
    }

    // 固定ページと投稿のみ対象
    $screen = get_current_screen();
    if (!$screen || !in_array($screen->post_type, ['page', 'post'], true)) {
        return;
    }

    // 投稿タイプを判定
    $is_page = $screen->post_type === 'page';

    // 現在の投稿データを取得
    global $post;
    $post_id = isset($post->ID) ? $post->ID : 0;
    $post_title = isset($post->post_title) ? $post->post_title : '';
    $post_slug = isset($post->post_name) ? $post->post_name : '';
    $post_status = isset($post->post_status) ? $post->post_status : 'draft';

    // 公開済みかどうかを判定
    $is_published = in_array($post_status, ['publish', 'private'], true);

    // スラッグが設定済みかどうか（自動生成されたものではない本当のスラッグがあるか）
    // 新規作成時や空の場合はfalse
    $has_slug = !empty($post_slug) && $post_slug !== sanitize_title($post_id);

    // 完全な新規ページかどうか（post-new.phpで、コンテンツも空）
    $post_content = isset($post->post_content) ? $post->post_content : '';
    $is_new_page = ($hook === 'post-new.php') || (empty($post_title) && empty($post_content) && $post_status === 'auto-draft');

    // JSファイルを読み込み
    wp_enqueue_script(
        'lw-page-title-wizard',
        get_template_directory_uri() . '/assets/js/page-title-wizard.js',
        ['wp-data', 'wp-dom-ready'],
        css_version(),
        true
    );

    // PHPからJSにデータを渡す
    wp_localize_script('lw-page-title-wizard', 'lwPageTitleWizard', [
        'postId' => $post_id,
        'currentTitle' => $post_title,
        'currentSlug' => $post_slug,
        'hasSlug' => $has_slug,
        'postStatus' => $post_status,
        'isPublished' => $is_published,
        'isNewPage' => $is_new_page,
        'isPage' => $is_page,
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('lw_page_title_wizard_nonce'),
    ]);

    // ポップアップ用のインラインCSS
    $inline_css = '
        @keyframes lwGradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes lwPopupFadeIn {
            0% {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        @keyframes lwOverlayFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        .lw-title-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(-45deg, #1e3a5f, #2d5a87, #3a7bd5, #00d2ff, #2d5a87, #1e3a5f);
            background-size: 400% 400%;
            animation: lwGradientFlow 15s ease infinite, lwOverlayFadeIn 0.4s ease-out;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lw-title-popup-back {
            position: absolute;
            top: 30px;
            left: 30px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 50px;
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            animation: lwPopupFadeIn 0.5s ease-out 0.2s both;
        }
        .lw-title-popup-back:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateX(-3px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .lw-title-popup-back svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }
        .lw-title-popup {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 40px 45px;
            border-radius: 16px;
            box-shadow:
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1);
            max-width: 480px;
            width: 90%;
            animation: lwPopupFadeIn 0.5s ease-out 0.1s both;
        }
        .lw-title-popup h2 {
            margin: 0 0 8px;
            font-size: 22px;
            font-weight: 700;
            color: #1e3a5f;
            text-align: center;
        }
        .lw-title-popup-subtitle {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-bottom: 30px;
        }
        .lw-title-popup-field {
            margin-bottom: 24px;
        }
        .lw-title-popup-label {
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            letter-spacing: 0.025em;
        }
        .lw-title-popup-label .required {
            color: #ef4444;
            margin-left: 2px;
        }
        .lw-title-popup-input {
            width: 100% !important;
            padding: 0.5em 0.8em !important;
            font-size: 16px !important;
            border: 2px solid transparent !important;
            border-radius: 10px !important;
            box-sizing: border-box !important;
            background:
                linear-gradient(#fff, #fff) padding-box,
                linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%) border-box !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08) !important;
        }
        .lw-title-popup-input:focus {
            outline: none !important;
            background:
                linear-gradient(#fff, #fff) padding-box,
                linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%) border-box !important;
            box-shadow: 0 6px 20px rgba(58, 123, 213, 0.2), 0 0 0 4px rgba(58, 123, 213, 0.1) !important;
            transform: translateY(-1px) !important;
        }
        .lw-title-popup-input.error {
            background:
                linear-gradient(#fff, #fff) padding-box,
                linear-gradient(135deg, #fca5a5 0%, #ef4444 100%) border-box !important;
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2), 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
        }
        .lw-title-popup-input::placeholder {
            color: #a0aec0 !important;
        }
        .lw-title-popup-hint {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 6px;
        }
        .lw-title-popup-counter {
            display: flex;
            justify-content: flex-end;
            font-size: 12px;
            color: #94a3b8;
            margin-top: 6px;
            transition: color 0.3s ease;
        }
        .lw-title-popup-counter.warning {
            color: #f59e0b;
        }
        .lw-title-popup-counter.over {
            color: #ef4444;
            font-weight: 600;
        }
        .lw-title-popup-btn {
            background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
            color: #fff;
            border: none;
            padding: 16px 32px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 10px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(58, 123, 213, 0.3);
        }
        .lw-title-popup-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(58, 123, 213, 0.4);
        }
        .lw-title-popup-btn:active {
            transform: translateY(0);
        }
        .lw-title-popup-btn:disabled {
            background: linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    ';
    wp_add_inline_style('_css', $inline_css);
}
add_action('admin_enqueue_scripts', 'lw_page_title_wizard_scripts');

/**
 * AJAXでタイトルとスラッグを保存する（未公開なら下書き保存、公開済みなら更新）
 */
function lw_save_page_title_ajax() {
    // nonceチェック
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'lw_page_title_wizard_nonce')) {
        wp_send_json_error(['message' => 'セキュリティチェックに失敗しました']);
    }

    // 権限チェック
    if (!current_user_can('edit_pages')) {
        wp_send_json_error(['message' => '権限がありません']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $title = isset($_POST['title']) ? sanitize_text_field($_POST['title']) : '';
    $slug = isset($_POST['slug']) ? sanitize_title($_POST['slug']) : '';
    $is_published = isset($_POST['is_published']) && $_POST['is_published'] === 'true';

    if (empty($title)) {
        wp_send_json_error(['message' => 'タイトルを入力してください']);
    }

    if (empty($slug)) {
        wp_send_json_error(['message' => 'スラッグを入力してください']);
    }

    // 新規作成の場合（post_idが0または存在しない場合）
    if ($post_id === 0) {
        $update_args = [
            'post_title' => $title,
            'post_name' => $slug,
            'post_type' => 'page',
            'post_status' => 'draft',
        ];
        $result = wp_insert_post($update_args);
    } else {
        // 既存の投稿を更新
        // 公開済みの場合はステータスを変更しない（そのまま更新）
        // 未公開の場合は下書きとして保存
        $current_post = get_post($post_id);
        $current_status = $current_post ? $current_post->post_status : 'draft';

        // 公開済み（publish, private）ならステータスを維持、それ以外はdraftに
        if (in_array($current_status, ['publish', 'private'], true)) {
            $new_status = $current_status;
        } else {
            $new_status = 'draft';
        }

        $update_args = [
            'ID' => $post_id,
            'post_title' => $title,
            'post_name' => $slug,
            'post_status' => $new_status,
        ];
        $result = wp_update_post($update_args);
    }

    if (is_wp_error($result)) {
        wp_send_json_error(['message' => '保存に失敗しました']);
    }

    wp_send_json_success([
        'message' => '保存しました',
        'post_id' => $result,
    ]);
}
add_action('wp_ajax_lw_save_page_title', 'lw_save_page_title_ajax');
