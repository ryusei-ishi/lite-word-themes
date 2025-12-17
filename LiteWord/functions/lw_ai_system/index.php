<?php
/**
 * LiteWord AI System
 *
 * テーマに統合されたAIシステム
 * - レイアウト自動生成
 * - AI画像検索
 * - ブロックエディタAIアシスタント
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 定数定義
define( 'LW_AI_SYSTEM_VERSION', '1.0.3' );
define( 'LW_AI_SYSTEM_DIR', get_template_directory() . '/functions/lw_ai_system/' );
define( 'LW_AI_SYSTEM_URL', get_template_directory_uri() . '/functions/lw_ai_system/' );

// クラスファイル読み込み
require_once LW_AI_SYSTEM_DIR . 'includes/class-json-parser.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-block-generator.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-gemini-api.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-admin-settings.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-block-settings.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-usage-tracker.php';

// 設定画面の初期化
LW_AI_Generator_Admin_Settings::init();
LW_AI_Generator_Block_Settings::init();
LW_AI_Generator_Usage_Tracker::init();

/**
 * 管理画面全体（使用量ウィジェット）
 */
function lw_ai_system_enqueue_admin_assets() {
    // 使用量ウィジェットCSS
    wp_enqueue_style(
        'lw-ai-usage-widget',
        LW_AI_SYSTEM_URL . 'assets/css/usage-widget.css',
        array(),
        LW_AI_SYSTEM_VERSION
    );

    // 使用量ウィジェットJS
    wp_enqueue_script(
        'lw-ai-usage-widget',
        LW_AI_SYSTEM_URL . 'assets/js/usage-widget.js',
        array(),
        LW_AI_SYSTEM_VERSION,
        true
    );

    wp_localize_script(
        'lw-ai-usage-widget',
        'lwAiUsageWidgetData',
        array(
            'restUrl'   => rest_url( 'lw-ai-generator/v1/' ),
            'restNonce' => wp_create_nonce( 'wp_rest' ),
            'isPremium' => defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true,
        )
    );
}
add_action( 'admin_enqueue_scripts', 'lw_ai_system_enqueue_admin_assets' );

/**
 * ブロックエディタ（メインAI機能）
 */
function lw_ai_system_enqueue_block_editor_assets() {
    // block-inserter.js（コア機能）
    wp_enqueue_script(
        'lw-ai-generator-block-inserter',
        LW_AI_SYSTEM_URL . 'assets/js/block-inserter.js',
        array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-data', 'wp-plugins', 'wp-edit-post' ),
        LW_AI_SYSTEM_VERSION,
        array( 'in_footer' => true, 'strategy' => 'defer' )
    );

    // admin-ui.js（軽量ローダー - AIボタンのみ）
    wp_enqueue_script(
        'lw-ai-generator-admin-ui',
        LW_AI_SYSTEM_URL . 'assets/js/admin-ui.js',
        array( 'wp-element', 'wp-dom-ready' ),
        LW_AI_SYSTEM_VERSION,
        array( 'in_footer' => true, 'strategy' => 'defer' )
    );

    // APIキー設定状態チェック
    $has_gemini_key = ! empty( LW_AI_Generator_Admin_Settings::get_api_key() );

    // モーダルスクリプトのURLを含む設定データ
    wp_localize_script(
        'lw-ai-generator-block-inserter',
        'lwAiGeneratorData',
        array(
            'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
            'restUrl'     => rest_url( 'lw-ai-generator/v1/' ),
            'nonce'       => wp_create_nonce( 'lw_ai_generator_nonce' ),
            'restNonce'   => wp_create_nonce( 'wp_rest' ),
            'hasApiKey'   => $has_gemini_key,
            'settingsUrl' => admin_url( 'options-general.php?page=lw-ai-generator-settings' ),
            'version'     => LW_AI_SYSTEM_VERSION,
            'modalUrl'    => LW_AI_SYSTEM_URL . 'assets/js/admin-ui-modal.js',
            'isPremium'   => defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true,
            'premiumUrl'  => function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium',
        )
    );

    // admin.css（必要最小限のスタイル）
    wp_enqueue_style(
        'lw-ai-generator-admin',
        LW_AI_SYSTEM_URL . 'assets/css/admin.css',
        array(),
        LW_AI_SYSTEM_VERSION
    );

    // block-ai-sidebar.js（遅延読み込み）
    wp_enqueue_script(
        'lw-ai-block-sidebar',
        LW_AI_SYSTEM_URL . 'assets/js/block-ai-sidebar.js',
        array( 'wp-element', 'wp-components', 'wp-block-editor', 'wp-compose', 'wp-hooks', 'wp-data' ),
        LW_AI_SYSTEM_VERSION,
        array( 'in_footer' => true, 'strategy' => 'defer' )
    );

    wp_localize_script(
        'lw-ai-block-sidebar',
        'lwAiBlockSidebarData',
        array(
            'restUrl'    => rest_url( 'lw-ai-generator/v1/' ),
            'restNonce'  => wp_create_nonce( 'wp_rest' ),
            'isPremium'  => defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true,
            'premiumUrl' => function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium',
        )
    );

    // text-selection-ai.js（遅延読み込み）
    wp_enqueue_script(
        'lw-ai-text-selection',
        LW_AI_SYSTEM_URL . 'assets/js/text-selection-ai.js',
        array( 'wp-element', 'wp-components', 'wp-data', 'wp-rich-text', 'wp-block-editor' ),
        LW_AI_SYSTEM_VERSION,
        array( 'in_footer' => true, 'strategy' => 'defer' )
    );

    wp_localize_script(
        'lw-ai-text-selection',
        'lwAiTextSelectionData',
        array(
            'restUrl'    => rest_url( 'lw-ai-generator/v1/' ),
            'restNonce'  => wp_create_nonce( 'wp_rest' ),
            'isPremium'  => defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true,
            'premiumUrl' => function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium',
        )
    );
}
add_action( 'enqueue_block_editor_assets', 'lw_ai_system_enqueue_block_editor_assets' );

// REST APIエンドポイントの登録（別ファイル）
require_once LW_AI_SYSTEM_DIR . 'includes/rest-api.php';
