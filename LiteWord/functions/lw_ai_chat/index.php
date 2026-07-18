<?php
if (!defined('ABSPATH')) exit;

/**
 * LiteWord AI チャット — エントリーポイント
 *
 * ダッシュボードに「AIに相談する」ボタンを表示し、
 * クリックでフルスクリーンポップアップのチャットUIを開く。
 *
 * ディレクトリ構成:
 *   index.php           ← このファイル（定数定義・ファイル読み込みのみ）
 *   includes/
 *     helpers.php        ← ヘルパー関数（判定・ユーティリティ）
 *     rest-api.php       ← REST APIルート登録
 *     proxy.php          ← チャットプロキシ（メイン処理）
 *     gemini.php         ← Gemini API呼び出し・プロンプト構築
 *     site-settings.php  ← サイト設定の取得・変更（Phase 1+2）
 *     callbacks.php      ← 同意・モード切替コールバック
 *     history.php        ← 履歴DB操作
 *     render.php         ← HTML出力（ボタン・ポップアップ・FAB）+アセット読み込み
 *   css/chat-widget.css
 *   js/chat-widget.js
 *   img/neko-bot.svg
 *
 * @since 1.0.0
 * @version 2.1.0
 */

define('LW_AI_CHAT_PATH', get_template_directory() . '/functions/lw_ai_chat/');
define('LW_AI_CHAT_URL', get_template_directory_uri() . '/functions/lw_ai_chat/');
define('LW_AI_CHAT_VERSION', '3.0.1');

// 読み込み順序: helpers → 他のファイル（helpersに依存するため先に読む）
require_once LW_AI_CHAT_PATH . 'includes/helpers.php';
require_once LW_AI_CHAT_PATH . 'includes/rest-api.php';
require_once LW_AI_CHAT_PATH . 'includes/proxy.php';
require_once LW_AI_CHAT_PATH . 'includes/gemini.php';
require_once LW_AI_CHAT_PATH . 'includes/site-settings.php';
require_once LW_AI_CHAT_PATH . 'includes/callbacks.php';
require_once LW_AI_CHAT_PATH . 'includes/history.php';
require_once LW_AI_CHAT_PATH . 'includes/render.php';
