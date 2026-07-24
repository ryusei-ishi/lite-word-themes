<?php
/**
 * LiteWord AI System - REST API
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * REST API エンドポイント登録
 */
function lw_ai_system_register_rest_routes() {
    // AI生成（構成案からブロック生成）
    register_rest_route( 'lw-ai-generator/v1', '/generate', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_generate_with_ai',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'prompt' => array(
                'required'          => false,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'imageSource' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => 'ai',
                'enum'              => array( 'ai', 'none' ),
            ),
            'outline' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
        ),
    ) );

    // ヒアリング質問生成
    register_rest_route( 'lw-ai-generator/v1', '/generate-interview', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_generate_interview',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'prompt' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
        ),
    ) );

    // コンテンツ構成案生成
    register_rest_route( 'lw-ai-generator/v1', '/generate-outline', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_generate_outline',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'prompt' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'interviewAnswers' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'pageType' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => 'lp',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ) );

    // セクション単位でブロック生成
    register_rest_route( 'lw-ai-generator/v1', '/generate-section', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_generate_section',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'sectionText' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'sectionIndex' => array(
                'required'          => true,
                'type'              => 'integer',
            ),
            'totalSections' => array(
                'required'          => true,
                'type'              => 'integer',
            ),
            'imageSource' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => 'ai',
                'enum'              => array( 'ai', 'none' ),
            ),
            'businessType' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'selectedPart' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'selectedPartType' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'enum'              => array( '', 'block', 'template' ),
            ),
        ),
    ) );

    // サンプル回答を自動生成
    register_rest_route( 'lw-ai-generator/v1', '/generate-sample-answers', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_generate_sample_answers',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'prompt' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'serviceName' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'questions' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'pageType' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => 'lp',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ) );

    // ブロック最適化（スクリーンショットを見て属性を調整）
    register_rest_route( 'lw-ai-generator/v1', '/optimize-block', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_optimize_block',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'screenshot' => array(
                'required'          => true,
                'type'              => 'string',
            ),
            'blockName' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'currentAttributes' => array(
                'required'          => true,
                'type'              => 'object',
            ),
            'sectionContent' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
        ),
    ) );

    // ブロック指示AI
    register_rest_route( 'lw-ai-generator/v1', '/block-instruction', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_block_instruction',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'blockName' => array( 'required' => true, 'type' => 'string' ),
            'currentAttributes' => array( 'required' => true, 'type' => 'object' ),
            'instruction' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'chatHistory' => array( 'required' => false, 'type' => 'array', 'default' => array() ),
        ),
    ) );

    // API使用量取得
    register_rest_route( 'lw-ai-generator/v1', '/usage-stats', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_system_get_usage_stats',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // 自動ハイライト
    register_rest_route( 'lw-ai-generator/v1', '/auto-highlight', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_auto_highlight',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'text' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'highlightStyle' => array( 'required' => false, 'type' => 'string', 'default' => 'marker' ),
        ),
    ) );

    // 複数スタイル自動ハイライト
    register_rest_route( 'lw-ai-generator/v1', '/auto-highlight-multi', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_auto_highlight_multi',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'text' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'styles' => array( 'required' => true, 'type' => 'array' ),
        ),
    ) );

    // テキスト生成
    register_rest_route( 'lw-ai-generator/v1', '/generate-text', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_generate_text',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'prompt' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'originalText' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'useWebSearch' => array( 'required' => false, 'type' => 'boolean', 'default' => false ),
            'tone' => array( 'required' => false, 'type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ),
            'isNewGeneration' => array( 'required' => false, 'type' => 'boolean', 'default' => false ),
        ),
    ) );

    // カスタムプロンプト取得
    register_rest_route( 'lw-ai-generator/v1', '/custom-prompts', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_system_get_custom_prompts',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // カスタムプロンプト保存
    register_rest_route( 'lw-ai-generator/v1', '/custom-prompts', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_save_custom_prompt',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'name' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'prompt' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'emoji' => array( 'required' => false, 'type' => 'string', 'default' => '📝', 'sanitize_callback' => 'sanitize_text_field' ),
        ),
    ) );

    // カスタムプロンプト削除
    register_rest_route( 'lw-ai-generator/v1', '/custom-prompts/(?P<id>\d+)', array(
        'methods'             => 'DELETE',
        'callback'            => 'lw_ai_system_delete_custom_prompt',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array( 'id' => array( 'required' => true, 'type' => 'integer' ) ),
    ) );

    // カスタムプロンプト更新
    register_rest_route( 'lw-ai-generator/v1', '/custom-prompts/(?P<id>\d+)', array(
        'methods'             => 'PUT',
        'callback'            => 'lw_ai_system_update_custom_prompt',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'id' => array( 'required' => true, 'type' => 'integer' ),
            'name' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'prompt' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'emoji' => array( 'required' => false, 'type' => 'string', 'default' => '📝', 'sanitize_callback' => 'sanitize_text_field' ),
        ),
    ) );

    // 誤字脱字チェック
    register_rest_route( 'lw-ai-generator/v1', '/check-typo', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_check_typo',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'blocks' => array( 'required' => true, 'type' => 'array' ),
        ),
    ) );

    // マイパーツAI生成
    register_rest_route( 'lw-ai-generator/v1', '/myparts-generate', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_myparts_generate',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'prompt' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'partsType' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'partsNumber' => array(
                'required'          => false,
                'type'              => 'integer',
                'default'           => 1,
            ),
            'model' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => 'gemini-2.5-flash',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'referenceImage' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
            ),
            'currentCode' => array(
                'required'          => false,
                'type'              => 'object',
                'default'           => null,
            ),
            'generateImages' => array(
                'required'          => false,
                'type'              => 'boolean',
                'default'           => false,
            ),
            // プレビューモード: trueの場合、画像分析のみ実行して確認用データを返す
            'previewOnly' => array(
                'required'          => false,
                'type'              => 'boolean',
                'default'           => false,
            ),
            // 確認済み分析データ: プレビューで確認・修正された分析結果
            'confirmedAnalysis' => array(
                'required'          => false,
                'type'              => 'object',
                'default'           => null,
            ),
        ),
    ) );

    // ========================================
    // 構成案パターン保存/読み込みAPI
    // ========================================

    // パターン一覧取得
    register_rest_route( 'lw-ai-generator/v1', '/saved-outlines', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_system_get_saved_outlines',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // パターン保存
    register_rest_route( 'lw-ai-generator/v1', '/saved-outlines', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_save_outline',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'name' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'pageType' => array( 'required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field', 'default' => '' ),
            'outline' => array( 'required' => true, 'type' => 'object' ),
            'outlineText' => array( 'required' => false, 'type' => 'string', 'default' => '' ),
            'prompt' => array( 'required' => false, 'type' => 'string', 'default' => '' ),
            'interviewAnswers' => array( 'required' => false, 'type' => 'object', 'default' => array() ),
            'partsData' => array( 'required' => false, 'type' => 'array', 'default' => null ),
        ),
    ) );

    // パターン更新
    register_rest_route( 'lw-ai-generator/v1', '/saved-outlines/(?P<id>[a-zA-Z0-9_-]+)', array(
        'methods'             => 'PUT',
        'callback'            => 'lw_ai_system_update_outline',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'id' => array( 'required' => true, 'type' => 'string' ),
            'name' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'pageType' => array( 'required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field', 'default' => '' ),
            'outline' => array( 'required' => true, 'type' => 'object' ),
            'outlineText' => array( 'required' => false, 'type' => 'string', 'default' => '' ),
            'prompt' => array( 'required' => false, 'type' => 'string', 'default' => '' ),
            'interviewAnswers' => array( 'required' => false, 'type' => 'object', 'default' => array() ),
            'partsData' => array( 'required' => false, 'type' => 'array', 'default' => null ),
        ),
    ) );

    // パターン削除
    register_rest_route( 'lw-ai-generator/v1', '/saved-outlines/(?P<id>[a-zA-Z0-9_-]+)', array(
        'methods'             => 'DELETE',
        'callback'            => 'lw_ai_system_delete_outline',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array( 'id' => array( 'required' => true, 'type' => 'string' ) ),
    ) );

    // セクション一覧取得
    register_rest_route( 'lw-ai-generator/v1', '/saved-sections', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_system_get_saved_sections',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // セクション保存
    register_rest_route( 'lw-ai-generator/v1', '/saved-sections', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_save_section',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'name' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'type' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'content' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
        ),
    ) );

    // セクション削除
    register_rest_route( 'lw-ai-generator/v1', '/saved-sections/(?P<id>[a-zA-Z0-9_-]+)', array(
        'methods'             => 'DELETE',
        'callback'            => 'lw_ai_system_delete_section',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array( 'id' => array( 'required' => true, 'type' => 'string' ) ),
    ) );

    // ========================================
    // パーツ選択API
    // ========================================

    // パーツ自動選択（構成案からパーツを選択）
    register_rest_route( 'lw-ai-generator/v1', '/select-parts', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_select_parts',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'sections' => array( 'required' => true, 'type' => 'array' ),
            'businessType' => array( 'required' => false, 'type' => 'string', 'default' => '' ),
        ),
    ) );

    // パーツ切り替え（別パーツに変更）
    register_rest_route( 'lw-ai-generator/v1', '/switch-part', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_switch_part',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'sectionType' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'newPart' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
            'originalContent' => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'businessType' => array( 'required' => false, 'type' => 'string', 'default' => '' ),
        ),
    ) );

    // ========================================
    // 最終レビューAPI
    // ========================================

    // 生成コンテンツの最終レビュー・修正
    register_rest_route( 'lw-ai-generator/v1', '/review-content', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_review_content',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'blocks' => array(
                'required'    => true,
                'type'        => 'array',
                'description' => '生成されたブロックの配列',
            ),
            'businessType' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ) );

    /* =========================================================
     *  セッションベース生成API（セクション単位 + 前後文脈保持）
     * ========================================================= */

    // セッション作成（outlineからセクション分割してDB保存）
    register_rest_route( 'lw-ai-generator/v1', '/sessions', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_session_create',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'postId'           => array( 'type' => 'integer', 'default' => 0 ),
            'pageType'         => array( 'type' => 'string', 'default' => 'lp', 'sanitize_callback' => 'sanitize_text_field' ),
            'businessType'     => array( 'type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ),
            'prompt'           => array( 'type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'interviewAnswers' => array( 'type' => 'object', 'default' => array() ),
            'outline'          => array( 'type' => 'object', 'required' => true ),
            'outlineText'      => array( 'type' => 'string', 'default' => '' ),
            'imageSource'      => array( 'type' => 'string', 'default' => 'ai', 'enum' => array( 'ai', 'none' ) ),
        ),
    ) );

    // セッション取得（復帰用 — 全セクションの状態を返す）
    register_rest_route( 'lw-ai-generator/v1', '/sessions/(?P<id>\d+)', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_session_get',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // セッション一覧（直近5件）
    register_rest_route( 'lw-ai-generator/v1', '/sessions', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_session_list',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // セッション削除
    register_rest_route( 'lw-ai-generator/v1', '/sessions/(?P<id>\d+)', array(
        'methods'             => 'DELETE',
        'callback'            => 'lw_ai_session_delete',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // セクション単体生成（前後文脈付き）
    register_rest_route( 'lw-ai-generator/v1', '/sessions/(?P<session_id>\d+)/sections/(?P<index>\d+)/generate', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_session_generate_section',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'selectedPart'     => array( 'type' => 'string', 'default' => '' ),
            'selectedPartType' => array( 'type' => 'string', 'default' => '' ),
        ),
    ) );

    // 全セクションの完成ブロックを取得
    register_rest_route( 'lw-ai-generator/v1', '/sessions/(?P<id>\d+)/blocks', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_session_get_blocks',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // セッション状況サマリー（AIチャット・ダッシュボードから確認用）
    register_rest_route( 'lw-ai-generator/v1', '/sessions/status', array(
        'methods'             => 'GET',
        'callback'            => 'lw_ai_session_status',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // 次の未完了セクションを自動生成（AIキャラがトリガー）
    register_rest_route( 'lw-ai-generator/v1', '/sessions/(?P<id>\d+)/generate-next', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_session_generate_next',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );

    // ★ Phase 2: 一括ページ生成（チャットから呼び出し）
    // outline生成 → session作成 → 全セクション生成 → 下書きページ保存
    register_rest_route( 'lw-ai-generator/v1', '/generate-page', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_generate_page',
        'permission_callback' => function() { return current_user_can( 'edit_posts' ); },
        'args'                => array(
            'prompt'       => array( 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field' ),
            'pageType'     => array( 'type' => 'string', 'default' => 'lp', 'sanitize_callback' => 'sanitize_text_field' ),
            'businessType' => array( 'type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ),
            'imageSource'  => array( 'type' => 'string', 'default' => 'none', 'enum' => array( 'ai', 'none' ) ),
        ),
    ) );
}
add_action( 'rest_api_init', 'lw_ai_system_register_rest_routes' );

/* =========================================================
 *  セッションAPIコールバック
 * ========================================================= */

function lw_ai_session_create( WP_REST_Request $request ) {
    $session_id = LW_AI_Session_Manager::create_session( array(
        'post_id'           => $request->get_param( 'postId' ),
        'page_type'         => $request->get_param( 'pageType' ),
        'business_type'     => $request->get_param( 'businessType' ),
        'prompt'            => $request->get_param( 'prompt' ),
        'interview_answers' => $request->get_param( 'interviewAnswers' ),
        'outline_json'      => $request->get_param( 'outline' ),
        'outline_text'      => $request->get_param( 'outlineText' ),
        'image_source'      => $request->get_param( 'imageSource' ),
    ) );

    if ( is_wp_error( $session_id ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $session_id->get_error_message() ), 400 );
    }

    return new WP_REST_Response( array( 'success' => true, 'sessionId' => $session_id ), 201 );
}

function lw_ai_session_get( WP_REST_Request $request ) {
    $session = LW_AI_Session_Manager::get_session( (int) $request['id'] );
    if ( is_wp_error( $session ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $session->get_error_message() ), 404 );
    }
    return new WP_REST_Response( array( 'success' => true, 'session' => $session ) );
}

function lw_ai_session_list( WP_REST_Request $request ) {
    $sessions = LW_AI_Session_Manager::get_user_sessions();
    return new WP_REST_Response( array( 'success' => true, 'sessions' => $sessions ) );
}

function lw_ai_session_delete( WP_REST_Request $request ) {
    $result = LW_AI_Session_Manager::delete_session( (int) $request['id'] );
    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message() ), 403 );
    }
    return new WP_REST_Response( array( 'success' => true ) );
}

function lw_ai_session_generate_section( WP_REST_Request $request ) {
    $session_id    = (int) $request['session_id'];
    $section_index = (int) $request['index'];
    $selected_part      = sanitize_text_field( $request->get_param( 'selectedPart' ) );
    $selected_part_type = sanitize_text_field( $request->get_param( 'selectedPartType' ) );

    // コンテキスト構築（前後のセクション情報を含む）
    $context = LW_AI_Session_Manager::build_section_context( $session_id, $section_index );
    if ( is_wp_error( $context ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $context->get_error_message() ), 400 );
    }

    $current = $context['current_section'];

    // セクションテキストを構築（元のoutlineデータ + 前後文脈）
    $section_data = is_array( $current['section_text'] ) ? $current['section_text'] : array();
    $section_text_parts = array();

    // セクションタイプの日本語ラベル（detect_section_typeが正しく検出するため必須）
    $type_labels = array(
        'firstview' => 'ファーストビュー', 'introduction' => 'イントロダクション',
        'features' => '特徴・強み', 'service' => 'サービス内容',
        'solution' => '課題解決・お悩み', 'step' => 'ステップ・流れ',
        'voice' => 'お客様の声・レビュー', 'faq' => 'よくある質問',
        'price' => '料金・メニュー', 'staff' => 'スタッフ紹介',
        'company' => '会社概要', 'access' => 'アクセス・地図',
        'cta' => 'お問い合わせ・予約CTA', 'gallery' => 'ギャラリー',
        'news' => 'お知らせ・ニュース', 'history' => '沿革・歴史',
        'before_after' => 'ビフォーアフター', 'banner' => 'バナー・告知',
        'calendar' => 'カレンダー・スケジュール',
    );

    $sec_type = $current['section_type'];
    $type_label = isset( $type_labels[ $sec_type ] ) ? $type_labels[ $sec_type ] : $sec_type;
    $section_text_parts[] = "【" . $type_label . "】";

    if ( ! empty( $current['section_title'] ) ) {
        $section_text_parts[] = $current['section_title'];
    }

    // セクション内容をテキスト化（type以外の全フィールド）
    foreach ( $section_data as $key => $value ) {
        if ( $key === 'type' ) continue;
        if ( is_array( $value ) ) {
            foreach ( $value as $item ) {
                if ( is_array( $item ) ) {
                    $section_text_parts[] = implode( ' / ', array_filter( $item ) );
                } else {
                    $section_text_parts[] = (string) $item;
                }
            }
        } else {
            $section_text_parts[] = (string) $value;
        }
    }

    $section_text = implode( "\n", $section_text_parts );

    // 前後文脈をプロンプト補足テキストとして追加
    $context_prompt = LW_AI_Session_Manager::context_to_prompt_text( $context );
    $section_text_with_context = $context_prompt . "\n## 今回生成するセクション\n" . $section_text;

    // パーツ選択を保存
    if ( ! empty( $selected_part ) ) {
        LW_AI_Session_Manager::save_part_selection( $session_id, $section_index, $selected_part, $selected_part_type );
    }

    // セクション生成（既存のgenerate_sectionを呼ぶ）
    $blocks = LW_AI_Generator_Gemini_API::generate_section(
        $section_text_with_context,
        $section_index,
        $context['total_sections'],
        $context['image_source'],
        $context['business_type'],
        $selected_part,
        $selected_part_type
    );

    if ( is_wp_error( $blocks ) ) {
        LW_AI_Session_Manager::mark_section_failed( $session_id, $section_index, $blocks->get_error_message() );
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $blocks->get_error_message(),
            'sectionIndex' => $section_index,
        ), 500 );
    }

    // 結果をDBに保存（サマリーは自動生成）
    LW_AI_Session_Manager::save_section_result( $session_id, $section_index, $blocks );

    return new WP_REST_Response( array(
        'success'      => true,
        'sectionIndex' => $section_index,
        'blocks'       => $blocks,
        'completed'    => $section_index + 1,
        'total'        => $context['total_sections'],
    ) );
}

function lw_ai_session_get_blocks( WP_REST_Request $request ) {
    $session_id = (int) $request['id'];
    $session = LW_AI_Session_Manager::get_session( $session_id );
    if ( is_wp_error( $session ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $session->get_error_message() ), 404 );
    }

    $blocks = LW_AI_Session_Manager::get_all_completed_blocks( $session_id );
    return new WP_REST_Response( array(
        'success' => true,
        'blocks'  => $blocks,
        'status'  => $session['status'],
        'completed' => (int) $session['completed_sections'],
        'total'     => (int) $session['total_sections'],
    ) );
}

function lw_ai_session_status( WP_REST_Request $request ) {
    $summary = LW_AI_Session_Manager::get_status_summary();
    return new WP_REST_Response( array( 'success' => true, 'status' => $summary ) );
}

function lw_ai_session_generate_next( WP_REST_Request $request ) {
    $session_id = (int) $request['id'];

    // 次の未完了セクションを特定
    $next_index = LW_AI_Session_Manager::get_next_pending_index( $session_id );

    if ( $next_index === null ) {
        return new WP_REST_Response( array(
            'success' => true,
            'completed' => true,
            'message' => '全セクション生成済みです',
        ) );
    }

    // コンテキスト構築
    $context = LW_AI_Session_Manager::build_section_context( $session_id, $next_index );
    if ( is_wp_error( $context ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $context->get_error_message() ), 400 );
    }

    $current = $context['current_section'];

    // セクションテキスト構築（日本語ラベルでdetect_section_typeが正しく動作するようにする）
    $section_data = is_array( $current['section_text'] ) ? $current['section_text'] : array();
    $section_text_parts = array();

    $type_labels = array(
        'firstview' => 'ファーストビュー', 'introduction' => 'イントロダクション',
        'features' => '特徴・強み', 'service' => 'サービス内容',
        'solution' => '課題解決・お悩み', 'step' => 'ステップ・流れ',
        'voice' => 'お客様の声・レビュー', 'faq' => 'よくある質問',
        'price' => '料金・メニュー', 'staff' => 'スタッフ紹介',
        'company' => '会社概要', 'access' => 'アクセス・地図',
        'cta' => 'お問い合わせ・予約CTA', 'gallery' => 'ギャラリー',
        'news' => 'お知らせ・ニュース', 'history' => '沿革・歴史',
        'before_after' => 'ビフォーアフター', 'banner' => 'バナー・告知',
        'calendar' => 'カレンダー・スケジュール',
    );

    $sec_type = $current['section_type'];
    $type_label = isset( $type_labels[ $sec_type ] ) ? $type_labels[ $sec_type ] : $sec_type;
    $section_text_parts[] = '【' . $type_label . '】';

    if ( ! empty( $current['section_title'] ) ) {
        $section_text_parts[] = $current['section_title'];
    }
    foreach ( $section_data as $key => $value ) {
        if ( $key === 'type' ) continue;
        if ( is_array( $value ) ) {
            foreach ( $value as $item ) {
                $section_text_parts[] = is_array( $item ) ? implode( ' / ', array_filter( $item ) ) : (string) $item;
            }
        } else {
            $section_text_parts[] = (string) $value;
        }
    }

    $section_text = implode( "\n", $section_text_parts );
    $context_prompt = LW_AI_Session_Manager::context_to_prompt_text( $context );
    $section_text_with_context = $context_prompt . "\n## 今回生成するセクション\n" . $section_text;

    $selected_part      = $current['selected_part'];
    $selected_part_type = $current['selected_part_type'];

    // パーツが未選択なら select-parts を自動実行
    if ( empty( $selected_part ) && class_exists( 'LW_AI_Generator_Gemini_API' ) ) {
        // purpose.jsonベースで自動選択（generate_sectionの内部ロジックに任せる）
        $selected_part = '';
        $selected_part_type = '';
    }

    // セクション生成
    $blocks = LW_AI_Generator_Gemini_API::generate_section(
        $section_text_with_context,
        $next_index,
        $context['total_sections'],
        $context['image_source'],
        $context['business_type'],
        $selected_part,
        $selected_part_type
    );

    if ( is_wp_error( $blocks ) ) {
        LW_AI_Session_Manager::mark_section_failed( $session_id, $next_index, $blocks->get_error_message() );
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $blocks->get_error_message(),
            'sectionIndex' => $next_index,
        ), 500 );
    }

    // 結果をDBに保存
    LW_AI_Session_Manager::save_section_result( $session_id, $next_index, $blocks );

    // 残りセクション数を確認
    $remaining = LW_AI_Session_Manager::get_next_pending_index( $session_id );

    return new WP_REST_Response( array(
        'success'        => true,
        'sectionIndex'   => $next_index,
        'sectionType'    => $current['section_type'],
        'sectionTitle'   => $current['section_title'],
        'blocks'         => $blocks,
        'completed'      => $remaining === null,
        'nextIndex'      => $remaining,
        'progress'       => ($next_index + 1) . '/' . $context['total_sections'],
    ) );
}

/**
 * AI生成コールバック（構成案からブロック生成）
 */
function lw_ai_system_generate_with_ai( WP_REST_Request $request ) {
    // 画像生成がある場合は時間がかかるため、PHP実行時間を延長
    @set_time_limit( 600 ); // 10分

    $prompt = $request->get_param( 'prompt' );
    $image_source = $request->get_param( 'imageSource' );
    $outline = $request->get_param( 'outline' );

    // 構成案がある場合は構成案ベースで生成
    if ( ! empty( $outline ) ) {
        $result = LW_AI_Generator_Gemini_API::generate_layout_from_outline( $outline, $image_source );
    } else {
        // 従来の方式（プロンプトから直接生成）
        if ( empty( $prompt ) ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが空です' ), 400 );
        }
        $result = LW_AI_Generator_Gemini_API::generate_layout( $prompt, $image_source );
    }

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message(), 'data' => $result->get_error_data() ), 400 );
    }

    return new WP_REST_Response( array( 'success' => true, 'layout' => $result, 'imageSource' => $image_source ), 200 );
}

/**
 * ヒアリング質問生成コールバック
 */
function lw_ai_system_generate_interview( WP_REST_Request $request ) {
    $prompt = $request->get_param( 'prompt' );

    if ( empty( $prompt ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが空です' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::generate_interview( $prompt );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message() ), 400 );
    }

    return new WP_REST_Response( array( 'success' => true, 'questions' => $result ), 200 );
}

/**
 * コンテンツ構成案生成コールバック
 */
function lw_ai_system_generate_outline( WP_REST_Request $request ) {
    $prompt = $request->get_param( 'prompt' );
    $interview_answers = $request->get_param( 'interviewAnswers' );
    $page_type = $request->get_param( 'pageType' );

    if ( empty( $prompt ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが空です' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::generate_outline( $prompt, $interview_answers, $page_type );

    if ( is_wp_error( $result ) ) {
        $error_data = $result->get_error_data();
        $response = array(
            'success' => false,
            'message' => $result->get_error_message()
        );
        // デバッグ用: 詳細情報を含める
        if ( isset( $error_data['raw_output'] ) ) {
            $response['debug_raw_output'] = mb_substr( $error_data['raw_output'], 0, 1000 );
        }
        if ( isset( $error_data['json_length'] ) ) {
            $response['debug_json_length'] = $error_data['json_length'];
        }
        if ( isset( $error_data['json_end'] ) ) {
            $response['debug_json_end'] = $error_data['json_end'];
        }
        return new WP_REST_Response( $response, 400 );
    }

    return new WP_REST_Response( array( 'success' => true, 'outline' => $result ), 200 );
}

/**
 * サンプル回答生成コールバック
 */
function lw_ai_system_generate_sample_answers( WP_REST_Request $request ) {
    $prompt = $request->get_param( 'prompt' );
    $service_name = $request->get_param( 'serviceName' );
    $questions = $request->get_param( 'questions' );
    $page_type = $request->get_param( 'pageType' );

    $result = LW_AI_Generator_Gemini_API::generate_sample_answers( $prompt, $questions, $service_name, $page_type );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $result->get_error_message()
        ), 400 );
    }

    return new WP_REST_Response( array(
        'success' => true,
        'answers' => $result
    ), 200 );
}

/**
 * ブロック最適化コールバック（スクリーンショットを見て属性を調整）
 */
function lw_ai_system_optimize_block( WP_REST_Request $request ) {
    $screenshot = $request->get_param( 'screenshot' );
    $block_name = $request->get_param( 'blockName' );
    $current_attributes = $request->get_param( 'currentAttributes' );
    $section_content = $request->get_param( 'sectionContent' );

    if ( empty( $screenshot ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'スクリーンショットがありません' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::optimize_block(
        $screenshot,
        $block_name,
        $current_attributes,
        $section_content
    );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $result->get_error_message()
        ), 400 );
    }

    return new WP_REST_Response( array(
        'success' => true,
        'needsOptimization' => $result['needsOptimization'],
        'optimizedAttributes' => isset( $result['optimizedAttributes'] ) ? $result['optimizedAttributes'] : null,
        'issues' => isset( $result['issues'] ) ? $result['issues'] : array(),
        'message' => isset( $result['message'] ) ? $result['message'] : ''
    ), 200 );
}

/**
 * セクション単位でブロック生成コールバック
 */
function lw_ai_system_generate_section( WP_REST_Request $request ) {
    // 画像生成がある場合は時間がかかるため、PHP実行時間を延長
    @set_time_limit( 600 ); // 10分

    $section_text      = $request->get_param( 'sectionText' );
    $section_index     = $request->get_param( 'sectionIndex' );
    $total_sections    = $request->get_param( 'totalSections' );
    $image_source      = $request->get_param( 'imageSource' );
    $business_type     = $request->get_param( 'businessType' );
    $selected_part     = $request->get_param( 'selectedPart' );
    $selected_part_type = $request->get_param( 'selectedPartType' );

    if ( empty( $section_text ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'セクションテキストが空です' ), 400 );
    }

    // デバッグログ - パーツ選択情報を詳細に出力
    error_log( '========================================' );
    error_log( '[LW AI Section] セクション生成開始' );
    error_log( '[LW AI Section] index: ' . $section_index );
    error_log( '[LW AI Section] imageSource: ' . $image_source );
    error_log( '[LW AI Section] selectedPart: ' . ( $selected_part ?: '(未指定)' ) );
    error_log( '[LW AI Section] selectedPartType: ' . ( $selected_part_type ?: '(未指定)' ) );
    error_log( '[LW AI Section] businessType: ' . ( $business_type ?: '(未指定)' ) );
    error_log( '[LW AI Section] sectionText(先頭200文字): ' . mb_substr( $section_text, 0, 200 ) );
    error_log( '========================================' );

    // リトライ回数（JSONパースエラー時に再試行）
    $max_retries = 2;
    $retry_count = 0;
    $result = null;

    while ( $retry_count <= $max_retries ) {
        $result = LW_AI_Generator_Gemini_API::generate_section(
            $section_text,
            $section_index,
            $total_sections,
            $image_source,
            $business_type,
            $selected_part,
            $selected_part_type
        );

        // 成功した場合はループを抜ける
        if ( ! is_wp_error( $result ) ) {
            break;
        }

        // JSONパースエラーの場合のみリトライ
        if ( $result->get_error_code() === 'json_parse_error' && $retry_count < $max_retries ) {
            $retry_count++;
            error_log( '[LW AI Section] JSONパースエラー - リトライ ' . $retry_count . '/' . $max_retries . ' - index: ' . $section_index );
            sleep( 1 ); // 1秒待機してからリトライ
            continue;
        }

        // その他のエラーまたはリトライ上限に達した場合
        break;
    }

    if ( is_wp_error( $result ) ) {
        error_log( '[LW AI Section] セクション生成エラー - index: ' . $section_index . ', error: ' . $result->get_error_message() );
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $result->get_error_message(),
            'data' => $result->get_error_data()
        ), 400 );
    }

    // 生成されたブロックをログ出力
    $block_count = is_array( $result ) ? count( $result ) : 0;
    $block_names = array();
    if ( is_array( $result ) ) {
        foreach ( $result as $block ) {
            // 'name' または 'blockName' をチェック
            $name = isset( $block['name'] ) ? $block['name'] : ( isset( $block['blockName'] ) ? $block['blockName'] : '(不明)' );
            $block_names[] = $name;
        }
    }
    error_log( '========================================' );
    error_log( '[LW AI Section] セクション生成完了 - index: ' . $section_index );
    error_log( '[LW AI Section] 生成されたブロック数: ' . $block_count );
    error_log( '[LW AI Section] 生成されたブロック: ' . implode( ', ', $block_names ) );
    error_log( '[LW AI Section] 選択されていたパーツ: ' . ( $selected_part ?: '(未指定)' ) );
    error_log( '[LW AI Section] ★ 一致チェック: ' . ( in_array( $selected_part, $block_names, true ) ? '✓ 一致' : '× 不一致（テンプレート使用時は正常）' ) );
    error_log( '========================================' );

    return new WP_REST_Response( array(
        'success' => true,
        'blocks' => $result,
        'sectionIndex' => $section_index
    ), 200 );
}

/**
 * ブロック指示AIコールバック
 */
function lw_ai_system_block_instruction( WP_REST_Request $request ) {
    $block_name = $request->get_param( 'blockName' );
    $current_attributes = $request->get_param( 'currentAttributes' );
    $instruction = $request->get_param( 'instruction' );
    $chat_history = $request->get_param( 'chatHistory' );

    if ( empty( $instruction ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => '指示が空です' ), 400 );
    }

    $block_definition = LW_AI_Generator_Gemini_API::get_single_block_definition( $block_name );

    if ( ! $block_definition ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'このブロックの定義が見つかりませんでした', 'response' => 'このブロックはAI指示に対応していません' ), 200 );
    }

    $result = LW_AI_Generator_Gemini_API::process_block_instruction( $block_name, $block_definition, $current_attributes, $instruction, $chat_history );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message(), 'response' => 'エラーが発生しました: ' . $result->get_error_message() ), 200 );
    }

    // 画像属性の処理（AIで生成）
    if ( ! empty( $result['updatedAttributes'] ) ) {
        // ページ生成と同じ画像属性リスト
        $image_attrs = array( 'imageUrl', 'imageUrlPc', 'imageUrlSp', 'backgroundImage', 'backgroundImageSp', 'imgUrl', 'image', 'imagePc', 'imageSp', 'photo' );

        foreach ( $image_attrs as $img_attr ) {
            if ( isset( $result['updatedAttributes'][ $img_attr ] ) ) {
                $img_value = $result['updatedAttributes'][ $img_attr ];
                if ( ! empty( $img_value ) && ! filter_var( $img_value, FILTER_VALIDATE_URL ) ) {
                    $generated_image = LW_AI_Generator_Gemini_API::generate_image( $img_value );
                    if ( ! is_wp_error( $generated_image ) ) {
                        $result['updatedAttributes'][ $img_attr ] = $generated_image;
                        $result['response'] .= "\n\n🖼️ 画像を生成してギャラリーに保存しました";
                    } else {
                        unset( $result['updatedAttributes'][ $img_attr ] );
                        $result['response'] .= "\n\n⚠️ 画像の生成に失敗しました: " . $generated_image->get_error_message();
                    }
                }
            }
        }

        // items内の画像処理
        if ( isset( $result['updatedAttributes']['items'] ) && is_array( $result['updatedAttributes']['items'] ) ) {
            // items内でも同じ画像属性リストを使用
            $item_image_attrs = array( 'imageUrl', 'imgUrl', 'image', 'backgroundImage', 'photo' );
            foreach ( $result['updatedAttributes']['items'] as &$item ) {
                foreach ( $item_image_attrs as $item_img_attr ) {
                    if ( isset( $item[ $item_img_attr ] ) && ! empty( $item[ $item_img_attr ] ) && ! filter_var( $item[ $item_img_attr ], FILTER_VALIDATE_URL ) ) {
                        $generated_image = LW_AI_Generator_Gemini_API::generate_image( $item[ $item_img_attr ] );
                        if ( ! is_wp_error( $generated_image ) ) {
                            $item[ $item_img_attr ] = $generated_image;
                        }
                    }
                }
            }
            unset( $item );
        }
    }

    return new WP_REST_Response( array( 'success' => true, 'response' => $result['response'], 'updatedAttributes' => isset( $result['updatedAttributes'] ) ? $result['updatedAttributes'] : array() ), 200 );
}

/**
 * API使用量取得
 */
function lw_ai_system_get_usage_stats() {
    if ( ! class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'Usage tracker not available' ), 500 );
    }

    $stats = LW_AI_Generator_Usage_Tracker::get_all_stats();
    return new WP_REST_Response( array( 'success' => true, 'stats' => $stats ), 200 );
}

/**
 * 自動ハイライト
 */
function lw_ai_system_auto_highlight( WP_REST_Request $request ) {
    $text = $request->get_param( 'text' );
    $highlight_style = $request->get_param( 'highlightStyle' );

    if ( empty( $text ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'テキストが空です' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::process_auto_highlight( $text, $highlight_style );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message() ), 200 );
    }

    return new WP_REST_Response( array( 'success' => true, 'highlightedHtml' => $result ), 200 );
}

/**
 * 複数スタイル自動ハイライト
 */
function lw_ai_system_auto_highlight_multi( WP_REST_Request $request ) {
    $text = $request->get_param( 'text' );
    $styles = $request->get_param( 'styles' );

    if ( empty( $text ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'テキストが空です' ), 400 );
    }

    if ( empty( $styles ) || ! is_array( $styles ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'スタイルが指定されていません' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::process_auto_highlight_multi( $text, $styles );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message() ), 200 );
    }

    return new WP_REST_Response( array( 'success' => true, 'highlightedHtml' => $result ), 200 );
}

/**
 * テキスト生成
 */
function lw_ai_system_generate_text( WP_REST_Request $request ) {
    $prompt = $request->get_param( 'prompt' );
    $original_text = $request->get_param( 'originalText' );
    $use_web_search = $request->get_param( 'useWebSearch' );
    $tone = $request->get_param( 'tone' );
    $is_new_generation = $request->get_param( 'isNewGeneration' );

    if ( empty( $prompt ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが空です' ), 400 );
    }

    if ( ! $is_new_generation && empty( $original_text ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => '元テキストが空です' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::generate_text( $original_text, $prompt, $use_web_search, $tone, $is_new_generation );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message() ), 200 );
    }

    if ( is_array( $result ) && isset( $result['text'] ) ) {
        return new WP_REST_Response( array( 'success' => true, 'generatedText' => $result['text'], 'sources' => isset( $result['sources'] ) ? $result['sources'] : array() ), 200 );
    }

    return new WP_REST_Response( array( 'success' => true, 'generatedText' => $result, 'sources' => array() ), 200 );
}

/**
 * カスタムプロンプト取得
 */
function lw_ai_system_get_custom_prompts() {
    $prompts = get_option( 'lw_ai_custom_prompts', array() );
    return new WP_REST_Response( array( 'success' => true, 'prompts' => $prompts ), 200 );
}

/**
 * カスタムプロンプト保存
 */
function lw_ai_system_save_custom_prompt( WP_REST_Request $request ) {
    $name   = $request->get_param( 'name' );
    $prompt = $request->get_param( 'prompt' );
    $emoji  = $request->get_param( 'emoji' );

    if ( empty( $name ) || empty( $prompt ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => '名前とプロンプトは必須です' ), 400 );
    }

    $prompts = get_option( 'lw_ai_custom_prompts', array() );

    $max_id = 0;
    foreach ( $prompts as $p ) {
        if ( isset( $p['id'] ) && $p['id'] > $max_id ) {
            $max_id = $p['id'];
        }
    }

    $new_prompt = array( 'id' => $max_id + 1, 'name' => $name, 'prompt' => $prompt, 'emoji' => $emoji ?: '📝' );
    $prompts[] = $new_prompt;
    update_option( 'lw_ai_custom_prompts', $prompts );

    return new WP_REST_Response( array( 'success' => true, 'prompt' => $new_prompt, 'prompts' => $prompts ), 200 );
}

/**
 * カスタムプロンプト削除
 */
function lw_ai_system_delete_custom_prompt( WP_REST_Request $request ) {
    $id = (int) $request->get_param( 'id' );
    $prompts = get_option( 'lw_ai_custom_prompts', array() );

    $new_prompts = array_values( array_filter( $prompts, function( $p ) use ( $id ) {
        return $p['id'] !== $id;
    }));

    update_option( 'lw_ai_custom_prompts', $new_prompts );
    return new WP_REST_Response( array( 'success' => true, 'prompts' => $new_prompts ), 200 );
}

/**
 * カスタムプロンプト更新
 */
function lw_ai_system_update_custom_prompt( WP_REST_Request $request ) {
    $id     = (int) $request->get_param( 'id' );
    $name   = $request->get_param( 'name' );
    $prompt = $request->get_param( 'prompt' );
    $emoji  = $request->get_param( 'emoji' );

    if ( empty( $name ) || empty( $prompt ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => '名前とプロンプトは必須です' ), 400 );
    }

    $prompts = get_option( 'lw_ai_custom_prompts', array() );
    $found = false;

    foreach ( $prompts as &$p ) {
        if ( $p['id'] === $id ) {
            $p['name'] = $name;
            $p['prompt'] = $prompt;
            $p['emoji'] = $emoji ?: '📝';
            $found = true;
            break;
        }
    }
    unset( $p );

    if ( ! $found ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが見つかりません' ), 404 );
    }

    update_option( 'lw_ai_custom_prompts', $prompts );
    return new WP_REST_Response( array( 'success' => true, 'prompts' => $prompts ), 200 );
}

/**
 * 誤字脱字チェックコールバック
 */
function lw_ai_system_check_typo( WP_REST_Request $request ) {
    $blocks = $request->get_param( 'blocks' );

    if ( empty( $blocks ) || ! is_array( $blocks ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'チェックするテキストがありません' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::check_typo( $blocks );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message() ), 200 );
    }

    return new WP_REST_Response( array( 'success' => true, 'errors' => $result ), 200 );
}

/**
 * マイパーツAI生成コールバック
 */
function lw_ai_system_myparts_generate( WP_REST_Request $request ) {
    // 3ステップ処理のため実行時間を延長（ステップ1: 画像分析、ステップ2: コード生成、ステップ3: AI画像生成）
    set_time_limit( 300 ); // 5分

    $prompt = $request->get_param( 'prompt' );
    $parts_type = $request->get_param( 'partsType' );
    $parts_number = $request->get_param( 'partsNumber' );
    $model = $request->get_param( 'model' );
    $reference_image = $request->get_param( 'referenceImage' );
    $current_code = $request->get_param( 'currentCode' );
    $generate_images = $request->get_param( 'generateImages' );
    $preview_only = $request->get_param( 'previewOnly' );
    $confirmed_analysis = $request->get_param( 'confirmedAnalysis' );

    // プレビューモード: 画像分析のみ実行
    if ( $preview_only ) {
        error_log( '[LW MyParts API] ========== プレビューモード開始 ==========' );
        error_log( '[LW MyParts API] プロンプト: ' . mb_substr( $prompt, 0, 100 ) );

        if ( empty( $prompt ) ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが空です' ), 400 );
        }

        // 参考画像がある場合は画像分析を実行
        if ( ! empty( $reference_image ) ) {
            try {
                $analysis = LW_AI_Generator_Gemini_API::analyze_reference_image( $reference_image, $model, $prompt );

                if ( is_wp_error( $analysis ) ) {
                    return new WP_REST_Response( array(
                        'success' => false,
                        'message' => '画像分析エラー: ' . $analysis->get_error_message(),
                    ), 200 );
                }

                error_log( '[LW MyParts API] プレビュー分析成功' );
                error_log( '[LW MyParts API] ========== プレビューモード完了 ==========' );

                return new WP_REST_Response( array(
                    'success'  => true,
                    'preview'  => true,
                    'analysis' => $analysis,
                ), 200 );

            } catch ( Exception $e ) {
                return new WP_REST_Response( array(
                    'success' => false,
                    'message' => '分析エラー: ' . $e->getMessage(),
                ), 500 );
            }
        } else {
            // 参考画像がない場合はデフォルトの分析結果を返す
            return new WP_REST_Response( array(
                'success'  => true,
                'preview'  => true,
                'analysis' => array(
                    'content_context' => $parts_type ? $parts_type . 'セクション' : 'Webサイトのセクション',
                    'layout' => array( 'type' => 'centered' ),
                    'colors' => array( 'background' => '#ffffff', 'text_primary' => '#333333' ),
                    'suggested_content' => array(
                        'heading' => '見出しテキスト',
                        'subheading' => 'サブ見出しテキスト',
                    ),
                ),
            ), 200 );
        }
    }

    // 通常の生成モード
    error_log( '[LW MyParts API] ========== 処理開始 ==========' );

    error_log( '[LW MyParts API] プロンプト: ' . mb_substr( $prompt, 0, 100 ) );
    error_log( '[LW MyParts API] パーツタイプ: ' . $parts_type . ', 番号: ' . $parts_number );
    error_log( '[LW MyParts API] モデル: ' . $model );
    error_log( '[LW MyParts API] 参考画像: ' . ( ! empty( $reference_image ) ? 'あり (' . strlen( $reference_image ) . 'bytes)' : 'なし' ) );
    error_log( '[LW MyParts API] 既存コード: ' . ( ! empty( $current_code ) ? 'あり' : 'なし' ) );
    error_log( '[LW MyParts API] AI画像生成: ' . ( $generate_images ? 'ON' : 'OFF' ) );
    error_log( '[LW MyParts API] 確認済み分析: ' . ( ! empty( $confirmed_analysis ) ? 'あり' : 'なし' ) );

    if ( empty( $prompt ) ) {
        error_log( '[LW MyParts API] エラー: プロンプトが空' );
        return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが空です' ), 400 );
    }

    error_log( '[LW MyParts API] generate_myparts() 呼び出し開始...' );

    try {
        $result = LW_AI_Generator_Gemini_API::generate_myparts(
            $prompt,
            $parts_type,
            $parts_number,
            $model,
            $reference_image,
            $current_code,
            $generate_images,
            $confirmed_analysis  // 確認済み分析データを渡す
        );
        error_log( '[LW MyParts API] generate_myparts() 完了' );
    } catch ( Exception $e ) {
        error_log( '[LW MyParts API] 例外発生: ' . $e->getMessage() );
        error_log( '[LW MyParts API] スタックトレース: ' . $e->getTraceAsString() );
        return new WP_REST_Response( array(
            'success' => false,
            'message' => '例外エラー: ' . $e->getMessage(),
        ), 500 );
    }

    if ( is_wp_error( $result ) ) {
        error_log( '[LW MyParts API] WP_Error: ' . $result->get_error_message() );
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $result->get_error_message(),
        ), 200 );
    }

    error_log( '[LW MyParts API] 成功 - HTML: ' . strlen( isset( $result['html'] ) ? $result['html'] : '' ) . 'bytes' );
    error_log( '[LW MyParts API] ========== 処理完了 ==========' );

    return new WP_REST_Response( array(
        'success' => true,
        'html'    => isset( $result['html'] ) ? $result['html'] : '',
        'css'     => isset( $result['css'] ) ? $result['css'] : '',
        'js'      => isset( $result['js'] ) ? $result['js'] : '',
        'message' => isset( $result['message'] ) ? $result['message'] : '',
    ), 200 );
}

// ========================================
// 構成案パターン保存/読み込みコールバック関数
// ========================================

/**
 * 保存データ取得用ヘルパー
 */
function lw_ai_system_get_saved_data() {
    $data = get_option( 'lw_ai_saved_outlines', array(
        'patterns' => array(),
        'sections' => array(),
    ) );
    // 後方互換性のため配列を保証
    if ( ! isset( $data['patterns'] ) ) {
        $data['patterns'] = array();
    }
    if ( ! isset( $data['sections'] ) ) {
        $data['sections'] = array();
    }
    return $data;
}

/**
 * 保存データ更新用ヘルパー
 */
function lw_ai_system_update_saved_data( $data ) {
    return update_option( 'lw_ai_saved_outlines', $data );
}

/**
 * UUID生成ヘルパー
 */
function lw_ai_system_generate_uuid() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
        mt_rand( 0, 0xffff ),
        mt_rand( 0, 0x0fff ) | 0x4000,
        mt_rand( 0, 0x3fff ) | 0x8000,
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

/**
 * パターン一覧取得
 */
function lw_ai_system_get_saved_outlines( WP_REST_Request $request ) {
    $data = lw_ai_system_get_saved_data();
    return new WP_REST_Response( array(
        'success'  => true,
        'outlines' => $data['patterns'],
    ), 200 );
}

/**
 * パターン保存
 */
function lw_ai_system_save_outline( WP_REST_Request $request ) {
    $name              = $request->get_param( 'name' );
    $page_type         = $request->get_param( 'pageType' );
    $outline           = $request->get_param( 'outline' );
    $outline_text      = $request->get_param( 'outlineText' );
    $prompt            = $request->get_param( 'prompt' );
    $interview_answers = $request->get_param( 'interviewAnswers' );
    $parts_data        = $request->get_param( 'partsData' );

    $data = lw_ai_system_get_saved_data();

    $new_pattern = array(
        'id'               => lw_ai_system_generate_uuid(),
        'name'             => $name,
        'pageType'         => $page_type,
        'createdAt'        => current_time( 'c' ),
        'outline'          => $outline,
        'outlineText'      => $outline_text,
        'prompt'           => $prompt,
        'interviewAnswers' => $interview_answers,
        'partsData'        => $parts_data,
        'hasPartsData'     => ! empty( $parts_data ),
    );

    $data['patterns'][] = $new_pattern;
    lw_ai_system_update_saved_data( $data );

    return new WP_REST_Response( array(
        'success' => true,
        'pattern' => $new_pattern,
    ), 200 );
}

/**
 * パターン更新
 */
function lw_ai_system_update_outline( WP_REST_Request $request ) {
    $id                = $request->get_param( 'id' );
    $name              = $request->get_param( 'name' );
    $page_type         = $request->get_param( 'pageType' );
    $outline           = $request->get_param( 'outline' );
    $outline_text      = $request->get_param( 'outlineText' );
    $prompt            = $request->get_param( 'prompt' );
    $interview_answers = $request->get_param( 'interviewAnswers' );
    $parts_data        = $request->get_param( 'partsData' );

    $data  = lw_ai_system_get_saved_data();
    $found = false;

    foreach ( $data['patterns'] as $index => $pattern ) {
        if ( $pattern['id'] === $id ) {
            $data['patterns'][ $index ]['name']             = $name;
            $data['patterns'][ $index ]['pageType']         = $page_type;
            $data['patterns'][ $index ]['outline']          = $outline;
            $data['patterns'][ $index ]['outlineText']      = $outline_text;
            $data['patterns'][ $index ]['prompt']           = $prompt;
            $data['patterns'][ $index ]['interviewAnswers'] = $interview_answers;
            $data['patterns'][ $index ]['partsData']        = $parts_data;
            $data['patterns'][ $index ]['hasPartsData']     = ! empty( $parts_data );
            $data['patterns'][ $index ]['updatedAt']        = current_time( 'c' );
            $found = true;
            break;
        }
    }

    if ( ! $found ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'パターンが見つかりません' ), 404 );
    }

    lw_ai_system_update_saved_data( $data );

    return new WP_REST_Response( array(
        'success' => true,
        'pattern' => $data['patterns'][ $index ],
    ), 200 );
}

/**
 * パターン削除
 */
function lw_ai_system_delete_outline( WP_REST_Request $request ) {
    $id = $request->get_param( 'id' );

    $data  = lw_ai_system_get_saved_data();
    $found = false;

    foreach ( $data['patterns'] as $index => $pattern ) {
        if ( $pattern['id'] === $id ) {
            array_splice( $data['patterns'], $index, 1 );
            $found = true;
            break;
        }
    }

    if ( ! $found ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'パターンが見つかりません' ), 404 );
    }

    lw_ai_system_update_saved_data( $data );

    return new WP_REST_Response( array( 'success' => true ), 200 );
}

/**
 * セクション一覧取得
 */
function lw_ai_system_get_saved_sections( WP_REST_Request $request ) {
    $data = lw_ai_system_get_saved_data();
    return new WP_REST_Response( array(
        'success'  => true,
        'sections' => $data['sections'],
    ), 200 );
}

/**
 * セクション保存
 */
function lw_ai_system_save_section( WP_REST_Request $request ) {
    $name    = $request->get_param( 'name' );
    $type    = $request->get_param( 'type' );
    $content = $request->get_param( 'content' );

    $data = lw_ai_system_get_saved_data();

    $new_section = array(
        'id'        => lw_ai_system_generate_uuid(),
        'name'      => $name,
        'type'      => $type,
        'content'   => $content,
        'createdAt' => current_time( 'c' ),
    );

    $data['sections'][] = $new_section;
    lw_ai_system_update_saved_data( $data );

    return new WP_REST_Response( array(
        'success' => true,
        'section' => $new_section,
    ), 200 );
}

/**
 * セクション削除
 */
function lw_ai_system_delete_section( WP_REST_Request $request ) {
    $id = $request->get_param( 'id' );

    $data  = lw_ai_system_get_saved_data();
    $found = false;

    foreach ( $data['sections'] as $index => $section ) {
        if ( $section['id'] === $id ) {
            array_splice( $data['sections'], $index, 1 );
            $found = true;
            break;
        }
    }

    if ( ! $found ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'セクションが見つかりません' ), 404 );
    }

    lw_ai_system_update_saved_data( $data );

    return new WP_REST_Response( array( 'success' => true ), 200 );
}

// ========================================
// パーツ選択APIコールバック関数
// ========================================

/**
 * purpose.jsonからパーツ一覧を取得
 */
function lw_ai_system_get_available_parts( $section_type ) {
    $purpose_json_path = get_template_directory() . '/functions/custom_bloc_insert_system/purpose.json';

    if ( ! file_exists( $purpose_json_path ) ) {
        return array();
    }

    $purpose_data = json_decode( file_get_contents( $purpose_json_path ), true );

    if ( ! isset( $purpose_data['purposes'][ $section_type ] ) ) {
        return array();
    }

    $section_data = $purpose_data['purposes'][ $section_type ];
    $parts = array();

    // ブロック
    if ( isset( $section_data['blocks'] ) && is_array( $section_data['blocks'] ) ) {
        foreach ( $section_data['blocks'] as $block_name => $description ) {
            $parts[] = array(
                'name'        => $block_name,
                'type'        => 'block',
                'description' => $description,
            );
        }
    }

    // テンプレート
    if ( isset( $section_data['templates'] ) && is_array( $section_data['templates'] ) ) {
        foreach ( $section_data['templates'] as $template_name => $description ) {
            $parts[] = array(
                'name'        => $template_name,
                'type'        => 'template',
                'description' => $description,
            );
        }
    }

    return $parts;
}

/**
 * パーツ自動選択（構成案からパーツを選択＆最適化テキスト生成）
 */
function lw_ai_system_select_parts( WP_REST_Request $request ) {
    // 選定→再最適化の直列2コール（各timeout 60秒）×セクション数になり得るため、
    // 実時間でカウントする環境でPHPが先に打ち切られないようにする（他のAIハンドラと同じ作法）。
    @set_time_limit( 300 );

    $sections      = $request->get_param( 'sections' );
    $business_type = $request->get_param( 'businessType' );

    if ( empty( $sections ) || ! is_array( $sections ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'セクションが空です' ), 400 );
    }

    $result_sections = array();

    foreach ( $sections as $section ) {
        $section_type = isset( $section['type'] ) ? $section['type'] : '';
        $content      = isset( $section['content'] ) ? $section['content'] : '';

        // 利用可能なパーツ一覧を取得
        $available_parts = lw_ai_system_get_available_parts( $section_type );

        if ( empty( $available_parts ) ) {
            // パーツがない場合はスキップ
            $result_sections[] = array(
                'type'             => $section_type,
                'selectedPart'     => null,
                'partType'         => null,
                'partDescription'  => 'このセクションタイプには対応するパーツがありません',
                'availableParts'   => array(),
                'optimizedContent' => $section,
            );
            continue;
        }

        // AIでパーツ選択＆テキスト最適化
        $ai_result = LW_AI_Generator_Gemini_API::select_and_optimize_part(
            $section_type,
            $content,
            $available_parts,
            $business_type
        );

        if ( is_wp_error( $ai_result ) ) {
            // AIが選べなかった場合は一覧の先頭パーツで代替する。
            // ここが黙って通ると「業種を変えても毎回同じレイアウトになる」症状になり、
            // しかも画面にもログにも痕跡が残らないため原因追跡ができなかった。
            // 代替したことを呼び出し側とログの両方に残す。
            $error_message = $ai_result->get_error_message();

            error_log( sprintf(
                '[LiteWord AI] パーツ選定に失敗したため既定のパーツを使用しました。section=%s part=%s reason=%s',
                $section_type,
                $available_parts[0]['name'],
                $error_message
            ) );

            $result_sections[] = array(
                'type'             => $section_type,
                'selectedPart'     => $available_parts[0]['name'],
                'partType'         => $available_parts[0]['type'],
                'partDescription'  => $available_parts[0]['description'],
                'availableParts'   => $available_parts,
                'optimizedContent' => $section,
                'error'            => $error_message,
                // 画面側がこのフラグを見て「AIが選んだ結果ではない」と示せるようにする
                'usedFallback'     => true,
                'fallbackReason'   => $error_message,
            );
        } else {
            $result_sections[] = array(
                'type'             => $section_type,
                'selectedPart'     => $ai_result['selectedPart'],
                'partType'         => $ai_result['partType'],
                'partDescription'  => $ai_result['partDescription'],
                'availableParts'   => $available_parts,
                'optimizedContent' => $ai_result['optimizedContent'],
            );
        }
    }

    return new WP_REST_Response( array(
        'success'  => true,
        'sections' => $result_sections,
    ), 200 );
}

/**
 * パーツ切り替え（別パーツ用にテキスト再最適化）
 */
function lw_ai_system_switch_part( WP_REST_Request $request ) {
    $section_type     = $request->get_param( 'sectionType' );
    $new_part         = $request->get_param( 'newPart' );
    $original_content = $request->get_param( 'originalContent' );
    $business_type    = $request->get_param( 'businessType' );

    // 新しいパーツの説明を取得
    $available_parts = lw_ai_system_get_available_parts( $section_type );
    $part_info       = null;

    foreach ( $available_parts as $part ) {
        if ( $part['name'] === $new_part ) {
            $part_info = $part;
            break;
        }
    }

    if ( ! $part_info ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => '指定されたパーツが見つかりません' ), 404 );
    }

    // AIでテキスト再最適化
    $ai_result = LW_AI_Generator_Gemini_API::optimize_content_for_part(
        $section_type,
        $original_content,
        $part_info,
        $business_type
    );

    if ( is_wp_error( $ai_result ) ) {
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $ai_result->get_error_message(),
        ), 400 );
    }

    return new WP_REST_Response( array(
        'success'          => true,
        'selectedPart'     => $new_part,
        'partType'         => $part_info['type'],
        'partDescription'  => $part_info['description'],
        'optimizedContent' => $ai_result,
    ), 200 );
}

/**
 * 生成コンテンツの最終レビュー・修正コールバック
 */
function lw_ai_system_review_content( WP_REST_Request $request ) {
    $blocks        = $request->get_param( 'blocks' );
    $business_type = $request->get_param( 'businessType' );

    if ( empty( $blocks ) || ! is_array( $blocks ) ) {
        return new WP_REST_Response( array(
            'success' => false,
            'message' => 'ブロックデータが必要です',
        ), 400 );
    }

    // AIでコンテンツをレビュー・修正
    $result = LW_AI_Generator_Gemini_API::review_and_fix_content( $blocks, $business_type );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array(
            'success' => false,
            'message' => $result->get_error_message(),
        ), 400 );
    }

    return new WP_REST_Response( array(
        'success'       => true,
        'fixedBlocks'   => $result['blocks'],
        'fixCount'      => $result['fixCount'],
        'fixedItems'    => $result['fixedItems'],
    ), 200 );
}

/* =========================================================
 *  Phase 2: 一括ページ生成パイプライン
 *  prompt → outline → session → generate sections → draft page
 * ========================================================= */

function lw_ai_generate_page( WP_REST_Request $request ) {
    @set_time_limit( 600 ); // 10分

    // ── Step 0: レート制限チェック
    $rate_limit = LW_AI_Session_Manager::check_daily_limit();
    if ( ! $rate_limit['allowed'] ) {
        return new WP_REST_Response( array(
            'success'   => false,
            'step'      => 'rate_limit',
            'message'   => '本日のページ生成上限（' . $rate_limit['limit'] . '回/日）に達しました。明日またお試しください。',
            'rateLimit' => $rate_limit,
        ), 429 );
    }

    $prompt        = $request->get_param( 'prompt' );
    $page_type     = $request->get_param( 'pageType' );
    $business_type = $request->get_param( 'businessType' );
    $image_source  = $request->get_param( 'imageSource' );

    $progress = array(); // 進捗ログ

    // ── Step 1: 構成案（outline）生成
    $progress[] = 'Step 1: 構成案を生成中...';
    $outline = LW_AI_Generator_Gemini_API::generate_outline( $prompt, '', $page_type );

    if ( is_wp_error( $outline ) ) {
        return new WP_REST_Response( array(
            'success'  => false,
            'step'     => 'outline',
            'message'  => $outline->get_error_message(),
            'progress' => $progress,
        ), 400 );
    }

    $progress[] = 'Step 1 完了: ' . count( $outline['sections'] ) . 'セクションの構成案';

    // ── Step 2: セッション作成
    $progress[] = 'Step 2: セッション作成中...';
    $session_id = LW_AI_Session_Manager::create_session( array(
        'post_id'           => 0,
        'page_type'         => $page_type,
        'business_type'     => $business_type,
        'prompt'            => $prompt,
        'interview_answers' => array(),
        'outline_json'      => $outline,
        'outline_text'      => '',
        'image_source'      => $image_source,
    ) );

    if ( is_wp_error( $session_id ) ) {
        return new WP_REST_Response( array(
            'success'  => false,
            'step'     => 'session',
            'message'  => $session_id->get_error_message(),
            'progress' => $progress,
        ), 400 );
    }

    $progress[] = 'Step 2 完了: セッションID=' . $session_id;

    // ── Step 3: 全セクション生成ループ
    $total_sections = count( $outline['sections'] );
    $progress[] = 'Step 3: ' . $total_sections . 'セクションを順次生成中...';
    $section_results = array();
    $failed_count = 0;

    for ( $i = 0; $i < $total_sections; $i++ ) {
        $next_index = LW_AI_Session_Manager::get_next_pending_index( $session_id );
        if ( $next_index === null ) {
            break; // 全て完了
        }

        // コンテキスト構築
        $context = LW_AI_Session_Manager::build_section_context( $session_id, $next_index );
        if ( is_wp_error( $context ) ) {
            $failed_count++;
            $progress[] = "  ✗ セクション{$next_index}: コンテキスト構築失敗";
            continue;
        }

        $current = $context['current_section'];

        // セクションテキスト構築
        $section_data = is_array( $current['section_text'] ) ? $current['section_text'] : array();
        $section_text_parts = array();

        $type_labels = array(
            'firstview' => 'ファーストビュー', 'introduction' => 'イントロダクション',
            'features' => '特徴・強み', 'service' => 'サービス内容',
            'solution' => '課題解決・お悩み', 'step' => 'ステップ・流れ',
            'voice' => 'お客様の声・レビュー', 'faq' => 'よくある質問',
            'price' => '料金・メニュー', 'staff' => 'スタッフ紹介',
            'company' => '会社概要', 'access' => 'アクセス・地図',
            'cta' => 'お問い合わせ・予約CTA', 'gallery' => 'ギャラリー',
            'news' => 'お知らせ・ニュース', 'history' => '沿革・歴史',
            'before_after' => 'ビフォーアフター', 'banner' => 'バナー・告知',
            'calendar' => 'カレンダー・スケジュール',
        );

        $sec_type   = $current['section_type'];
        $type_label = isset( $type_labels[ $sec_type ] ) ? $type_labels[ $sec_type ] : $sec_type;
        $section_text_parts[] = '【' . $type_label . '】';

        if ( ! empty( $current['section_title'] ) ) {
            $section_text_parts[] = $current['section_title'];
        }
        foreach ( $section_data as $key => $value ) {
            if ( $key === 'type' ) continue;
            if ( is_array( $value ) ) {
                foreach ( $value as $item ) {
                    $section_text_parts[] = is_array( $item ) ? implode( ' / ', array_filter( $item ) ) : (string) $item;
                }
            } else {
                $section_text_parts[] = (string) $value;
            }
        }

        $section_text = implode( "\n", $section_text_parts );
        $context_prompt = LW_AI_Session_Manager::context_to_prompt_text( $context );
        $section_text_with_context = $context_prompt . "\n## 今回生成するセクション\n" . $section_text;

        // セクション生成
        $blocks = LW_AI_Generator_Gemini_API::generate_section(
            $section_text_with_context,
            $next_index,
            $context['total_sections'],
            $context['image_source'],
            $context['business_type'],
            '', // selectedPart (自動選択)
            ''  // selectedPartType
        );

        if ( is_wp_error( $blocks ) ) {
            LW_AI_Session_Manager::mark_section_failed( $session_id, $next_index, $blocks->get_error_message() );
            $failed_count++;
            $progress[] = "  ✗ [{$next_index}] {$type_label}: " . $blocks->get_error_message();
            continue;
        }

        // DB保存
        LW_AI_Session_Manager::save_section_result( $session_id, $next_index, $blocks );

        $block_count = is_array( $blocks ) ? count( $blocks ) : 0;
        $section_results[] = array(
            'index' => $next_index,
            'type'  => $sec_type,
            'title' => $current['section_title'],
            'blocks' => $block_count,
        );
        $progress[] = "  ✓ [{$next_index}] {$type_label}: {$block_count}ブロック";
    }

    $completed_count = count( $section_results );
    $progress[] = "Step 3 完了: {$completed_count}/{$total_sections} セクション生成 (失敗: {$failed_count})";

    // ── Step 4: 全ブロックを取得して下書きページ作成
    $progress[] = 'Step 4: 下書きページを作成中...';
    $all_blocks = LW_AI_Session_Manager::get_all_completed_blocks( $session_id );

    if ( empty( $all_blocks ) ) {
        return new WP_REST_Response( array(
            'success'   => false,
            'step'      => 'page',
            'message'   => '生成されたブロックがありません',
            'sessionId' => $session_id,
            'progress'  => $progress,
        ), 400 );
    }

    // ブロックをWordPressのGutenbergコメント形式に変換
    $page_content = lw_ai_blocks_to_gutenberg_content( $all_blocks );

    // 下書きページ作成
    $page_title = '';
    if ( ! empty( $outline['title'] ) ) {
        $page_title = $outline['title'];
    } elseif ( ! empty( $outline['businessType'] ) ) {
        $page_title = $outline['businessType'];
    } else {
        $page_title = $prompt;
    }

    $post_id = wp_insert_post( array(
        'post_title'   => sanitize_text_field( $page_title ),
        'post_content' => $page_content,
        'post_status'  => 'draft',
        'post_type'    => 'page',
        'post_author'  => get_current_user_id(),
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_REST_Response( array(
            'success'   => false,
            'step'      => 'page',
            'message'   => $post_id->get_error_message(),
            'sessionId' => $session_id,
            'progress'  => $progress,
        ), 400 );
    }

    // セッションにpost_idを紐付け
    global $wpdb;
    $wpdb->update(
        $wpdb->prefix . 'lw_ai_sessions',
        array( 'post_id' => $post_id, 'status' => 'completed' ),
        array( 'id' => $session_id ),
        array( '%d', '%s' ),
        array( '%d' )
    );

    $page_url  = get_edit_post_link( $post_id, 'raw' );
    $preview_url = get_preview_post_link( $post_id );
    $progress[] = 'Step 4 完了: ページID=' . $post_id;

    return new WP_REST_Response( array(
        'success'        => true,
        'postId'         => $post_id,
        'editUrl'        => $page_url,
        'previewUrl'     => $preview_url,
        'sessionId'      => $session_id,
        'totalSections'  => $total_sections,
        'completedSections' => $completed_count,
        'failedSections' => $failed_count,
        'sectionResults' => $section_results,
        'progress'       => $progress,
    ), 201 );
}

/**
 * ブロック配列をGutenberg HTMLコメント形式に変換
 */
function lw_ai_blocks_to_gutenberg_content( $blocks ) {
    $content = '';
    foreach ( $blocks as $block ) {
        if ( ! is_array( $block ) || empty( $block['blockName'] ) ) {
            continue;
        }

        $block_name = $block['blockName'];
        $attrs      = isset( $block['attributes'] ) ? $block['attributes'] : array();

        // Gutenbergブロックコメント形式で出力
        $attrs_json = ! empty( $attrs ) ? ' ' . wp_json_encode( $attrs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) : '';
        $content .= "<!-- wp:{$block_name}{$attrs_json} /-->\n\n";
    }
    return $content;
}
