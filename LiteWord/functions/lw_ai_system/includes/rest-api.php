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
    // AI生成
    register_rest_route( 'lw-ai-generator/v1', '/generate', array(
        'methods'             => 'POST',
        'callback'            => 'lw_ai_system_generate_with_ai',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
        'args'                => array(
            'prompt' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'imageSource' => array(
                'required'          => false,
                'type'              => 'string',
                'default'           => 'pixabay',
                'enum'              => array( 'pixabay', 'none' ),
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
}
add_action( 'rest_api_init', 'lw_ai_system_register_rest_routes' );

/**
 * AI生成コールバック
 */
function lw_ai_system_generate_with_ai( WP_REST_Request $request ) {
    $prompt = $request->get_param( 'prompt' );
    $image_source = $request->get_param( 'imageSource' );

    if ( empty( $prompt ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'プロンプトが空です' ), 400 );
    }

    $result = LW_AI_Generator_Gemini_API::generate_layout( $prompt, $image_source );

    if ( is_wp_error( $result ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $result->get_error_message(), 'data' => $result->get_error_data() ), 400 );
    }

    return new WP_REST_Response( array( 'success' => true, 'layout' => $result, 'imageSource' => $image_source ), 200 );
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
        $image_attrs = array( 'backgroundImage', 'backgroundImageSp', 'imgUrl', 'imageUrl', 'image' );

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
            foreach ( $result['updatedAttributes']['items'] as &$item ) {
                if ( isset( $item['imgUrl'] ) && ! empty( $item['imgUrl'] ) && ! filter_var( $item['imgUrl'], FILTER_VALIDATE_URL ) ) {
                    $generated_image = LW_AI_Generator_Gemini_API::generate_image( $item['imgUrl'] );
                    if ( ! is_wp_error( $generated_image ) ) {
                        $item['imgUrl'] = $generated_image;
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
