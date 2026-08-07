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
define( 'LW_AI_SYSTEM_VERSION', '1.0.75' );
define( 'LW_AI_SYSTEM_DIR', get_template_directory() . '/functions/lw_ai_system/' );
define( 'LW_AI_SYSTEM_URL', get_template_directory_uri() . '/functions/lw_ai_system/' );

// クラスファイル読み込み
require_once LW_AI_SYSTEM_DIR . 'includes/class-json-parser.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-block-generator.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-gemini-api.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-admin-settings.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-block-settings.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-usage-tracker.php';
require_once LW_AI_SYSTEM_DIR . 'includes/class-session-manager.php';
// AI生成の権限・契約状態・回数上限（REST の permission_callback で使う）
require_once LW_AI_SYSTEM_DIR . 'includes/access-control.php';
// AI画像生成の枚数上限（1リクエスト／1日。回数上限とは別の歯止め）
require_once LW_AI_SYSTEM_DIR . 'includes/image-quota.php';

// マーケティング知識ファイル読み込み
require_once LW_AI_SYSTEM_DIR . 'marketing_materials/lp_default.php';
require_once LW_AI_SYSTEM_DIR . 'marketing_materials/top_default.php';

// 設定画面の初期化
LW_AI_Generator_Admin_Settings::init();
LW_AI_Generator_Block_Settings::init();
LW_AI_Generator_Usage_Tracker::init();

// セッションテーブル作成（初回のみ実行）
add_action( 'admin_init', array( 'LW_AI_Session_Manager', 'create_tables' ) );

// AI使用量ウィジェット（lw-ai-usage-button）は廃止
// 代わりに lw_ai_chat のAIサポートボタンが全管理画面に表示される

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
    $is_premium = defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true;

    // ページタイプ設定を読み込み（プレミアムユーザーのみ）
    $page_types = array();
    if ( $is_premium ) {
        $page_types_json = file_get_contents( LW_AI_SYSTEM_DIR . 'page-types.json' );
        $page_types_data = json_decode( $page_types_json, true );
        $page_types = isset( $page_types_data['pageTypes'] ) ? $page_types_data['pageTypes'] : array();
    }

    // モーダルスクリプトのURLを含む設定データ
    // ※ block-ai-sidebar.js と text-selection-ai.js は遅延読み込み（パフォーマンス改善）
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
            'isPremium'   => $is_premium,
            'premiumUrl'  => function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium',
            'pageTypes'   => $page_types,
            // 遅延読み込み用スクリプトURL
            'lazyScripts' => array(
                'blockSidebar'    => LW_AI_SYSTEM_URL . 'assets/js/block-ai-sidebar.js',
                'textSelection'   => LW_AI_SYSTEM_URL . 'assets/js/text-selection-ai.js',
            ),
        )
    );

    // admin.css（必要最小限のスタイル）
    wp_enqueue_style(
        'lw-ai-generator-admin',
        LW_AI_SYSTEM_URL . 'assets/css/admin.css',
        array(),
        LW_AI_SYSTEM_VERSION
    );

    // ============================================================
    // block-ai-sidebar.js と text-selection-ai.js は遅延読み込み
    // AIボタンクリック時に動的に読み込まれます（パフォーマンス改善）
    // 読み込みロジックは admin-ui.js 内で実装
    // ============================================================

    // 遅延読み込みスクリプト用のグローバルデータを設定
    // （スクリプト読み込み時に必要な設定値）
    wp_add_inline_script(
        'lw-ai-generator-block-inserter',
        'window.lwAiBlockSidebarData = ' . json_encode( array(
            'restUrl'    => rest_url( 'lw-ai-generator/v1/' ),
            'restNonce'  => wp_create_nonce( 'wp_rest' ),
            'isPremium'  => $is_premium,
            'premiumUrl' => function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium',
        ) ) . ';' .
        'window.lwAiTextSelectionData = ' . json_encode( array(
            'restUrl'    => rest_url( 'lw-ai-generator/v1/' ),
            'restNonce'  => wp_create_nonce( 'wp_rest' ),
            'isPremium'  => $is_premium,
            'premiumUrl' => function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium',
        ) ) . ';',
        'before'
    );
}
add_action( 'enqueue_block_editor_assets', 'lw_ai_system_enqueue_block_editor_assets' );

// REST APIエンドポイントの登録（別ファイル）
require_once LW_AI_SYSTEM_DIR . 'includes/rest-api.php';
