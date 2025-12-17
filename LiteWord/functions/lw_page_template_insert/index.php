<?php
/**
 * LiteWord ページテンプレート挿入
 * Description: テーマ内のテンプレートファイルからページを作成
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// 管理画面の場合
if (is_admin()) {
    require_once __DIR__ . '/lw-page-template-admin.php';
} else {
    // フロント側（REST APIのみ）
    require_once __DIR__ . '/lw-page-template-frontend.php';
}