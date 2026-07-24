<?php
/**
 * Gemini API連携クラス
 *
 * @package LiteWord_AI_Page_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class LW_AI_Generator_Gemini_API
 */
class LW_AI_Generator_Gemini_API {

    /**
     * デバッグモード（本番ではfalseにする）
     */
    const DEBUG_MODE = false;

    /**
     * デバッグログ出力
     *
     * @param string $message ログメッセージ
     */
    private static function debug_log( $message ) {
        if ( self::DEBUG_MODE ) {
            error_log( $message );
        }
    }

    /**
     * Gemini API エンドポイント（高速処理用）
     */
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    /**
     * Gemini API エンドポイント（高品質ページ生成用 - 2.5 Flash）
     * 注意: 2.5 Proが400エラーになる場合は2.5 Flashを使用
     */
    const API_ENDPOINT_PRO = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

    /**
     * Imagen 4 画像生成 API エンドポイント（2025年推奨）
     */
    const IMAGE_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict';

    /**
     * No Image プレースホルダー画像URL
     */
    const NO_IMAGE_PLACEHOLDER = 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image';

    /**
     * モデル名からAPIエンドポイントを取得
     *
     * @param string $model モデル名
     * @return string APIエンドポイント
     */
    public static function get_model_endpoint( $model = 'gemini-2.5-flash' ) {
        return 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent';
    }

    /**
     * APIキーを取得
     *
     * @return string|false
     */
    /**
     * 既定で使うモデルを返す
     *
     * 実測（2026-07-19・構成案の生成で比較）:
     *   gemini-2.5-flash      10,933ms / 10セクション / 6,173字
     *   gemini-3.5-flash       7,552ms / 10セクション / 5,066字  ← 速くて内容も同等
     *   gemini-3.1-flash-lite  4,092ms /  7セクション / 2,667字  ← 速いが構成が薄くなる
     *
     * 既定は現行のまま（2.5-flash）にして後方互換を保つ。
     * オプション lw_ai_generator_model で切り替えられる。
     *
     * @return string モデル名
     */
    public static function get_default_model() {
        $model = get_option( 'lw_ai_generator_model', '' );

        if ( ! is_string( $model ) || '' === trim( $model ) ) {
            $model = 'gemini-2.5-flash';
        }

        /**
         * 使用するGeminiモデルを差し替えるフィルタ
         *
         * @param string $model モデル名
         */
        // 前後の空白・改行はURLに直結して全リクエストを壊すので必ず落とす
        // （wp-cli や SQL 直更新で末尾改行が混入しがち）。
        return trim( (string) apply_filters( 'lw_ai_generator_model', $model ) );
    }

    /**
     * パーツ選定・整形に使うモデルを返す
     *
     * これらは「候補から1つ選ぶ」「文面を整える」処理で、思考の恩恵が薄い。
     * 従来の 2.5-pro は実測1回18秒かかり、セクション数だけ繰り返されるため
     * ページ全体の待ち時間を押し上げていた（10セクションで約3分）。
     *
     * @return string モデル名
     */
    public static function get_part_select_model() {
        $model = get_option( 'lw_ai_generator_part_model', '' );

        if ( ! is_string( $model ) || '' === trim( $model ) ) {
            $model = self::get_default_model();
        }

        /**
         * パーツ選定に使うモデルを差し替えるフィルタ
         *
         * @param string $model モデル名
         */
        return trim( (string) apply_filters( 'lw_ai_generator_part_model', $model ) );
    }

    /**
     * モデルに応じた thinkingConfig を返す（送るべきでない場合は null）
     *
     * gemini-2.5-pro は思考を切れない（Budget 0 は 400
     * "This model only works in thinking mode"）。また thinkingConfig を
     * 知らない旧世代モデル（1.5系/2.0系）に送っても 400 になる。
     * 思考制御を送ってよいのは Flash 系だけとし、それ以外のモデルでは
     * 明示的に正のバジェットが指定された場合のみ送る。
     *
     * @param string $model  モデル名
     * @param int    $budget 思考トークン上限（0=思考オフ）
     * @return array|null
     */
    public static function build_thinking_config( $model, $budget ) {
        $model = (string) $model;

        // thinkingConfig を持たない旧世代（1.5系/2.0系）は Flash でも送らない
        $is_legacy = ( false !== stripos( $model, '1.5' ) || false !== stripos( $model, '2.0' ) );
        $is_flash  = ( ! $is_legacy && false !== stripos( $model, 'flash' ) );

        if ( $is_flash ) {
            return array( 'thinkingBudget' => (int) $budget );
        }

        if ( ! $is_legacy && (int) $budget > 0 ) {
            return array( 'thinkingBudget' => (int) $budget );
        }

        return null;
    }

    public static function get_api_key() {
        if ( class_exists( 'LW_AI_Generator_Admin_Settings' ) ) {
            return LW_AI_Generator_Admin_Settings::get_api_key();
        }
        return get_option( 'lw_ai_generator_gemini_api_key', '' );
    }

    /**
     * Gemini API共通呼び出しヘルパー
     *
     * @param string $prompt プロンプトテキスト
     * @param array  $config 設定（model, temperature, maxOutputTokens, responseMimeType, timeout, usage_label）
     * @return array|WP_Error ['text' => 生成テキスト, 'input_tokens' => int, 'output_tokens' => int]
     */
    private static function call_gemini_text_api( $prompt, $config = array() ) {
        $api_key = self::get_api_key();
        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        $model           = isset( $config['model'] ) ? $config['model'] : self::get_default_model();
        $temperature     = isset( $config['temperature'] ) ? $config['temperature'] : 0.7;
        $max_tokens      = isset( $config['maxOutputTokens'] ) ? $config['maxOutputTokens'] : 8192;
        $timeout         = isset( $config['timeout'] ) ? $config['timeout'] : 60;
        $usage_label     = isset( $config['usage_label'] ) ? $config['usage_label'] : 'unknown';

        $gen_config = array(
            'temperature'     => $temperature,
            'topK'            => 40,
            'topP'            => 0.95,
            'maxOutputTokens' => $max_tokens,
        );
        if ( isset( $config['responseMimeType'] ) ) {
            $gen_config['responseMimeType'] = $config['responseMimeType'];
        }

        // 思考トークンの制御。
        // Gemini 2.5系は既定で「思考」が走り、実測で1回あたり約1,568トークン
        // （出力本体583トークンの2.7倍）を消費し、待ち時間の大半を占めていた。
        // ページ生成のように出力形式が決まっている処理では思考の恩恵が薄いため、
        // 既定で切る。個別に効かせたい処理は $config['thinkingBudget'] で上書きできる。
        $thinking_budget = isset( $config['thinkingBudget'] ) ? (int) $config['thinkingBudget'] : 0;
        $thinking_config = self::build_thinking_config( $model, $thinking_budget );
        if ( null !== $thinking_config ) {
            $gen_config['thinkingConfig'] = $thinking_config;
        }

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $prompt )
                    )
                )
            ),
            'generationConfig' => $gen_config,
        );

        $endpoint = self::get_model_endpoint( $model );

        $response = wp_remote_post(
            $endpoint . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( $request_body ),
                'timeout' => $timeout,
            )
        );

        if ( is_wp_error( $response ) ) {
            self::debug_log( "[LW AI] {$usage_label}: WP_Error - " . $response->get_error_message() );
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            self::debug_log( "[LW AI] {$usage_label}: HTTP {$response_code} - " . mb_substr( $response_body, 0, 500 ) );
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました (HTTP ' . $response_code . ')';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        $input_tokens   = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens  = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;

        // 思考トークンは candidatesTokenCount に含まれないが、出力として課金される。
        // これを数えていなかったため、使用量画面が実際の請求額を大きく下回っていた。
        $thinking_tokens = isset( $data['usageMetadata']['thoughtsTokenCount'] )
            ? (int) $data['usageMetadata']['thoughtsTokenCount']
            : 0;

        // 使用量をトラッキング（思考分を出力に含めて実請求に合わせる）
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage(
                $usage_label,
                $model,
                $input_tokens,
                $output_tokens + $thinking_tokens,
                0
            );
        }

        return array(
            'text'          => $generated_text,
            'input_tokens'  => $input_tokens,
            'output_tokens' => $output_tokens,
        );
    }

    /**
     * Gemini APIレスポンスからJSONをパースする共通ヘルパー
     *
     * @param array  $api_result call_gemini_text_api()の戻り値
     * @param string $error_context エラーメッセージのコンテキスト
     * @return array|WP_Error パースされたJSONデータまたはエラー
     */
    private static function parse_json_response( $api_result, $error_context = '' ) {
        if ( is_wp_error( $api_result ) ) {
            return $api_result;
        }

        $json_text = self::extract_json( $api_result['text'] );
        $parsed = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            self::debug_log( "[LW AI] {$error_context}: JSONパースエラー - " . json_last_error_msg() );
            return new WP_Error(
                'json_parse_error',
                $error_context . 'のパースに失敗しました: ' . json_last_error_msg(),
                array( 'raw_output' => $api_result['text'] )
            );
        }

        return $parsed;
    }

    /**
     * ユーザー入力をプロンプトに埋め込む前にサニタイズ
     * プロンプトインジェクション対策（長さ制限 + 区切り文字の無効化）
     *
     * @param string $input ユーザー入力
     * @param int    $max_length 最大文字数（デフォルト500）
     * @return string サニタイズ済みテキスト
     */
    private static function sanitize_prompt_input( $input, $max_length = 500 ) {
        // 基本サニタイズ
        $input = sanitize_textarea_field( $input );

        // 長さ制限
        if ( mb_strlen( $input ) > $max_length ) {
            $input = mb_substr( $input, 0, $max_length ) . '...';
        }

        // プロンプト区切り文字のエスケープ（```、---、##等の連続をスペースに）
        $input = preg_replace( '/`{3,}/', ' ', $input );
        $input = preg_replace( '/-{3,}/', ' ', $input );

        return $input;
    }

    /**
     * purpose.jsonを読み込んでキャッシュ
     *
     * @return array|null
     */
    private static $purpose_data = null;

    private static function get_purpose_data() {
        if ( self::$purpose_data !== null ) {
            return self::$purpose_data;
        }

        $json_path = get_template_directory() . '/functions/custom_bloc_insert_system/purpose.json';
        if ( ! file_exists( $json_path ) ) {
            return null;
        }

        $json_content = file_get_contents( $json_path );
        self::$purpose_data = json_decode( $json_content, true );

        return self::$purpose_data;
    }

    /**
     * blocks-schema.jsonを読み込んでキャッシュ
     * 96ブロックの詳細情報（category, tier, elements, attributes, recommendedFor）
     *
     * @return array|null
     */
    private static $blocks_schema_data = null;

    private static function get_blocks_schema_data() {
        if ( self::$blocks_schema_data !== null ) {
            return self::$blocks_schema_data;
        }

        $json_path = LW_AI_SYSTEM_DIR . 'blocks-schema.json';
        if ( ! file_exists( $json_path ) ) {
            return null;
        }

        $json_content = file_get_contents( $json_path );
        self::$blocks_schema_data = json_decode( $json_content, true );

        return self::$blocks_schema_data;
    }

    /**
     * セクションテキストからセクションタイプを検出
     *
     * @param string $section_text セクションのテキスト
     * @return string セクションタイプ
     */
    private static function detect_section_type( $section_text ) {
        // ★文脈テキストが含まれている場合は「今回生成するセクション」以降のみを使う
        $marker = '今回生成するセクション';
        $marker_pos = mb_strpos( $section_text, $marker );
        if ( $marker_pos !== false ) {
            $section_text = mb_substr( $section_text, $marker_pos + mb_strlen( $marker ) );
        }

        // ★★★ 第1段階: 【type_label】パターンから直接検出（最優先）
        // generate-page/generate-nextが付与する日本語ラベルで確実に検出
        $label_map = array(
            'ファーストビュー'       => 'firstview',
            'イントロダクション'     => 'introduction',
            '特徴・強み'             => 'features',
            'サービス内容'           => 'service',
            '課題解決・お悩み'       => 'solution',
            'ステップ・流れ'         => 'step',
            'お客様の声・レビュー'   => 'voice',
            'よくある質問'           => 'faq',
            '料金・メニュー'         => 'price',
            'スタッフ紹介'           => 'staff',
            '会社概要'               => 'company',
            'アクセス・地図'         => 'access',
            'お問い合わせ・予約CTA'  => 'cta',
            'ギャラリー'             => 'gallery',
            'お知らせ・ニュース'     => 'news',
            '沿革・歴史'             => 'history',
            'ビフォーアフター'       => 'before_after',
            'バナー・告知'           => 'banner',
            'カレンダー・スケジュール' => 'calendar',
        );

        if ( preg_match( '/【(.+?)】/', $section_text, $m ) ) {
            $label = $m[1];
            if ( isset( $label_map[ $label ] ) ) {
                return $label_map[ $label ];
            }
            // ラベルに含まれるキーワードでも検出（部分一致）
            foreach ( $label_map as $map_label => $type ) {
                if ( mb_strpos( $label, $map_label ) !== false ) {
                    return $type;
                }
            }
        }

        // ★★★ 第2段階: キーワードベースで検出（フォールバック）
        // CTAを上位に配置（access等との競合防止）
        $section_text_lower = mb_strtolower( $section_text );

        $type_keywords = array(
            'firstview' => array( 'ファーストビュー', 'fv', 'メインビジュアル', 'キャッチコピー', 'ヒーロー' ),
            'cta' => array( 'cta', 'お問い合わせ', '予約', 'contact', 'ご予約', '資料請求', '申し込み' ),
            'faq' => array( 'よくある質問', 'faq', 'q&a' ),
            'voice' => array( 'お客様の声', 'レビュー', '口コミ', 'voice', '患者様の声', '感想' ),
            'solution' => array( '悩み', '課題', 'お悩み', 'こんな方', '問題' ),
            'service' => array( 'サービス', '提供', '事業内容', 'service', '施工内容', 'リフォーム', '修繕', '改修', '増改築' ),
            'introduction' => array( 'イントロダクション', '紹介', '当院について', '当店について', 'コンセプト', 'about' ),
            'features' => array( '特徴', '強み', 'メリット', '選ばれる理由', 'ポイント' ),
            'step' => array( 'ステップ', '流れ', 'step', 'ご利用の流れ', '施術の流れ' ),
            'price' => array( '料金', '価格', 'メニュー', 'price', '費用', 'プラン' ),
            'staff' => array( 'スタッフ', 'チーム', '院長', '代表', 'プロフィール', 'staff' ),
            'company' => array( '会社概要', '事業者情報', '運営者情報', 'company' ),
            'access' => array( 'アクセス', '地図', '所在地', 'map', 'access' ),
            'gallery' => array( 'ギャラリー', '写真', 'gallery', '施術例', '作品', 'ポートフォリオ' ),
            'news' => array( 'お知らせ', 'ニュース', 'news', 'ブログ', '最新情報' ),
            'history' => array( '沿革', '歴史', '年表', 'history', 'タイムライン' ),
            'before_after' => array( 'ビフォーアフター', 'before', 'after', '施術前後', '比較' ),
            'banner' => array( 'バナー', 'キャンペーン', '告知', 'お得', '期間限定' ),
            'calendar' => array( 'カレンダー', 'スケジュール', '営業日', '休業日', '予定' ),
        );

        foreach ( $type_keywords as $type => $keywords ) {
            foreach ( $keywords as $keyword ) {
                if ( mb_strpos( $section_text_lower, mb_strtolower( $keyword ) ) !== false ) {
                    return $type;
                }
            }
        }

        return 'introduction'; // デフォルト
    }

    /**
     * セクションタイプに対応するブロック/テンプレート情報を取得
     *
     * @param string $section_type セクションタイプ
     * @return array ブロックとテンプレートの情報
     */
    private static function get_purpose_blocks_and_templates( $section_type, $business_type = '' ) {
        $purpose_data = self::get_purpose_data();
        if ( ! $purpose_data ) {
            return array( 'blocks' => array(), 'templates' => array() );
        }

        // sectionTypeMappingで変換
        if ( isset( $purpose_data['sectionTypeMapping'][ $section_type ] ) ) {
            $mapped_type = $purpose_data['sectionTypeMapping'][ $section_type ];
        } else {
            $mapped_type = $section_type;
        }

        // purposesから取得
        if ( ! isset( $purpose_data['purposes'][ $mapped_type ] ) ) {
            return array( 'blocks' => array(), 'templates' => array() );
        }

        $purpose = $purpose_data['purposes'][ $mapped_type ];

        $blocks = isset( $purpose['blocks'] ) ? $purpose['blocks'] : array();
        $templates = isset( $purpose['templates'] ) ? $purpose['templates'] : array();

        // blocks-schema.jsonのデータでブロック説明を補強
        $schema_data = self::get_blocks_schema_data();
        if ( $schema_data && ! empty( $blocks ) && isset( $schema_data['blocks'] ) ) {
            $enriched_blocks = array();
            foreach ( $blocks as $block_name => $description ) {
                $enriched_desc = $description;

                if ( isset( $schema_data['blocks'][ $block_name ] ) ) {
                    $schema_block = $schema_data['blocks'][ $block_name ];

                    // 要素情報を追加（h1数、段落数、ボタン数、画像数）
                    $elements_info = array();
                    if ( isset( $schema_block['elements'] ) ) {
                        $el = $schema_block['elements'];
                        if ( ! empty( $el['headings'] ) ) {
                            foreach ( $el['headings'] as $h => $count ) {
                                $elements_info[] = "{$h}×{$count}";
                            }
                        }
                        if ( ! empty( $el['paragraphs'] ) ) {
                            $elements_info[] = "段落×{$el['paragraphs']}";
                        }
                        if ( ! empty( $el['buttons'] ) ) {
                            $elements_info[] = "ボタン×{$el['buttons']}";
                        }
                    }

                    // recommendedForを追加
                    $recommended = '';
                    if ( ! empty( $schema_block['recommendedFor'] ) ) {
                        $recommended = '（推奨: ' . implode( '/', $schema_block['recommendedFor'] ) . '）';
                    }

                    // tier情報
                    $tier = isset( $schema_block['tier'] ) ? $schema_block['tier'] : '';

                    if ( ! empty( $elements_info ) || ! empty( $recommended ) ) {
                        $enriched_desc .= ' [' . implode( ', ', $elements_info ) . ']' . $recommended;
                    }
                }

                $enriched_blocks[ $block_name ] = $enriched_desc;
            }
            $blocks = $enriched_blocks;
        }

        return array(
            'label'       => isset( $purpose['label'] ) ? $purpose['label'] : $mapped_type,
            'description' => isset( $purpose['description'] ) ? $purpose['description'] : '',
            'blocks'      => $blocks,
            'templates'   => $templates,
        );
    }

    /**
     * テンプレートJSONファイルを読み込む
     *
     * @param string $template_name テンプレート名（拡張子なし）
     * @return array|null テンプレートデータ
     */
    private static function load_template( $template_name, $skip_clear_defaults = false ) {
        $template_path = get_template_directory() . '/functions/custom_bloc_insert_system/templates/' . $template_name . '.json';
        if ( ! file_exists( $template_path ) ) {
            return null;
        }

        $json_content = file_get_contents( $template_path );
        $template_data = json_decode( $json_content, true );

        if ( ! is_array( $template_data ) ) {
            return null;
        }

        // ブロックのキー名を正規化（name → blockName）
        $template_data = self::normalize_block_keys( $template_data );

        // テンプレートのデフォルト値をクリア（contentOverridesがある場合のみ）
        if ( ! $skip_clear_defaults ) {
            $template_data = self::clear_template_defaults( $template_data );
        }

        return $template_data;
    }

    /**
     * テンプレートのデフォルトテキスト値をクリア
     * AIからのcontentOverridesで上書きされることを前提とし、
     * 無関係なデフォルト文が表示されないようにする
     *
     * @param array $blocks ブロック配列
     * @return array クリアされたブロック配列
     */
    private static function clear_template_defaults( $blocks ) {
        // クリア対象のデフォルト値パターン（不適切な具体的コンテンツ）
        // 注意: 【】で囲まれたプレースホルダーは意図的なので対象外
        $default_values = array(
            'テキストテキストテキスト',
            'テキストテキスト',
            '何から始めたらいいか',
            '作りたいけど',
            '自分で作ると',
            '応募フォームより',
            '書類選考を行います',
            '面接を実施します',
            '最終選考を行い',
            '内定通知をお送り',
            'ここに説明文が入ります',
            '質問テキスト質問テキスト',
            '回答テキスト回答テキスト',
        );

        // titleText等のデフォルト値パターン
        $default_title_texts = array(
            '採用までの流れ',
            'タイトルテキスト',
        );

        foreach ( $blocks as &$block ) {
            if ( ! isset( $block['attributes'] ) ) {
                continue;
            }

            // mainTitle, subTitleがデフォルト値の場合はプレースホルダーに変更
            if ( isset( $block['attributes']['mainTitle'] ) ) {
                $val = $block['attributes']['mainTitle'];
                if ( $val === 'タイトル' || $val === 'メインタイトル' ) {
                    $block['attributes']['mainTitle'] = '【見出しを設定してください】';
                }
            }
            if ( isset( $block['attributes']['subTitle'] ) ) {
                $val = $block['attributes']['subTitle'];
                if ( $val === 'サブタイトル' ) {
                    $block['attributes']['subTitle'] = '';
                }
            }

            // descriptionがデフォルト値の場合はクリア
            if ( isset( $block['attributes']['description'] ) ) {
                foreach ( $default_values as $pattern ) {
                    if ( strpos( $block['attributes']['description'], $pattern ) !== false ) {
                        $block['attributes']['description'] = '';
                        break;
                    }
                }
            }

            // titleTextがデフォルト値の場合はプレースホルダーに変更
            if ( isset( $block['attributes']['titleText'] ) ) {
                if ( in_array( $block['attributes']['titleText'], $default_title_texts, true ) ) {
                    $block['attributes']['titleText'] = '【見出しを設定してください】';
                }
            }

            // contents配列のデフォルト値をクリア
            if ( isset( $block['attributes']['contents'] ) && is_array( $block['attributes']['contents'] ) ) {
                foreach ( $block['attributes']['contents'] as $idx => &$content ) {
                    if ( ! is_array( $content ) ) {
                        continue;
                    }
                    // textフィールドがデフォルト値かチェック
                    if ( isset( $content['text'] ) ) {
                        foreach ( $default_values as $pattern ) {
                            if ( strpos( $content['text'], $pattern ) !== false ) {
                                $content['text'] = '【内容を設定してください】';
                                break;
                            }
                        }
                    }
                    // titleフィールドがデフォルト値かチェック
                    if ( isset( $content['title'] ) ) {
                        $default_titles = array( '応募', '書類選考', '面接', '最終選考', '内定' );
                        if ( in_array( $content['title'], $default_titles, true ) ) {
                            $content['title'] = '【項目' . ( $idx + 1 ) . '】';
                        }
                    }
                    // text_q / text_aがデフォルト値かチェック（QAブロック用）
                    if ( isset( $content['text_q'] ) ) {
                        foreach ( $default_values as $pattern ) {
                            if ( strpos( $content['text_q'], $pattern ) !== false ) {
                                $content['text_q'] = '【質問を設定してください】';
                                break;
                            }
                        }
                    }
                    if ( isset( $content['text_a'] ) ) {
                        foreach ( $default_values as $pattern ) {
                            if ( strpos( $content['text_a'], $pattern ) !== false ) {
                                $content['text_a'] = '【回答を設定してください】';
                                break;
                            }
                        }
                    }
                }
                unset( $content );
            }

            // text_1, text_2のデフォルト値をクリア（プレースホルダー形式も含む）
            if ( isset( $block['attributes']['text_1'] ) ) {
                if ( strpos( $block['attributes']['text_1'], 'テキストテキスト' ) !== false ||
                     strpos( $block['attributes']['text_1'], '【' ) === 0 ) {
                    $block['attributes']['text_1'] = '';
                }
            }
            if ( isset( $block['attributes']['text_2'] ) ) {
                if ( strpos( $block['attributes']['text_2'], 'テキストテキスト' ) !== false ||
                     strpos( $block['attributes']['text_2'], '【' ) === 0 ) {
                    $block['attributes']['text_2'] = '';
                }
            }

            // innerBlocksも再帰的に処理
            if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
                $block['innerBlocks'] = self::clear_template_defaults( $block['innerBlocks'] );
            }
        }
        unset( $block );

        return $blocks;
    }

    /**
     * filterColor の不透明度が高すぎる場合にキャップする
     * CTA等の背景画像付きブロックで、オーバーレイが濃すぎると画像が見えなくなるため
     *
     * @param array $blocks ブロック配列
     * @param int $max_alpha 最大アルファ値（0-255、デフォルト176 = 0xb0 ≈ 69%）
     * @return array 修正後のブロック配列
     */
    private static function cap_filter_opacity( $blocks, $max_alpha = 176 ) {
        foreach ( $blocks as &$block ) {
            if ( ! isset( $block['attributes'] ) ) {
                continue;
            }

            // filterColor属性をチェック（CTA-1等）
            if ( isset( $block['attributes']['filterColor'] ) ) {
                $color = $block['attributes']['filterColor'];
                // 8桁HEX（#RRGGBBAA）の場合、アルファ値をチェック
                if ( preg_match( '/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})$/', $color, $m ) ) {
                    $alpha = hexdec( $m[2] );
                    if ( $alpha > $max_alpha ) {
                        $new_alpha = dechex( $max_alpha );
                        $block['attributes']['filterColor'] = '#' . $m[1] . str_pad( $new_alpha, 2, '0', STR_PAD_LEFT );
                    }
                }
                // 6桁HEX（#RRGGBB、完全不透明）の場合もアルファ追加
                elseif ( preg_match( '/^#([0-9a-fA-F]{6})$/', $color, $m ) ) {
                    $new_alpha = dechex( $max_alpha );
                    $block['attributes']['filterColor'] = '#' . $m[1] . str_pad( $new_alpha, 2, '0', STR_PAD_LEFT );
                }
            }

            // innerBlocksも再帰的に処理
            if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
                $block['innerBlocks'] = self::cap_filter_opacity( $block['innerBlocks'], $max_alpha );
            }
        }
        unset( $block );

        return $blocks;
    }

    /**
     * ブロックのキー名を正規化（name → blockName）
     *
     * @param array $blocks ブロック配列
     * @return array 正規化されたブロック配列
     */
    private static function normalize_block_keys( $blocks ) {
        if ( ! is_array( $blocks ) ) {
            return $blocks;
        }

        foreach ( $blocks as &$block ) {
            if ( ! is_array( $block ) ) {
                continue;
            }

            // 'name' を 'blockName' に変換
            if ( isset( $block['name'] ) && ! isset( $block['blockName'] ) ) {
                $block['blockName'] = $block['name'];
                unset( $block['name'] );
            }

            // innerBlocksも再帰的に処理
            if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
                $block['innerBlocks'] = self::normalize_block_keys( $block['innerBlocks'] );
            }
        }
        unset( $block );

        return $blocks;
    }

    /**
     * テンプレートブロックにcontentOverridesを適用
     *
     * @param array $blocks テンプレートのブロック配列
     * @param array $overrides 上書きするコンテンツ
     * @return array 更新されたブロック配列
     */
    private static function apply_content_overrides( $blocks, $overrides ) {
        if ( empty( $overrides ) || ! is_array( $blocks ) ) {
            return $blocks;
        }

        // ★★★ 複数ブロックテンプレート対応 ★★★
        // contentBlocks / sections 配列がある場合、同じタイプのブロックに順番に適用
        $content_blocks_source = null;
        $content_blocks_key = '';
        foreach ( array( 'contentBlocks', 'sections', 'blocks' ) as $key ) {
            if ( isset( $overrides[ $key ] ) && is_array( $overrides[ $key ] ) ) {
                $content_blocks_source = $overrides[ $key ];
                $content_blocks_key = $key;
                break;
            }
        }

        if ( $content_blocks_source !== null ) {
            // ブロックタイプごとにカウント（wdl/paid-block-content-3 などの連続するブロックを検出）
            $block_type_counters = array();

            foreach ( $blocks as $block_idx => &$block ) {
                $block_name = isset( $block['blockName'] ) ? $block['blockName'] : ( isset( $block['name'] ) ? $block['name'] : '' );

                // paid-block-content-X や similar content blocks を検出
                if ( preg_match( '/paid-block-content|content-block|card/i', $block_name ) ) {
                    if ( ! isset( $block_type_counters[ $block_name ] ) ) {
                        $block_type_counters[ $block_name ] = 0;
                    }

                    $counter = $block_type_counters[ $block_name ];

                    if ( isset( $content_blocks_source[ $counter ] ) && is_array( $content_blocks_source[ $counter ] ) ) {
                        $block_override = $content_blocks_source[ $counter ];

                        // このブロックの属性を初期化
                        if ( ! isset( $block['attributes'] ) ) {
                            $block['attributes'] = array();
                        }

                        // すべてのオーバーライドキーを適用
                        foreach ( $block_override as $attr_key => $attr_value ) {
                            $block['attributes'][ $attr_key ] = $attr_value;
                        }

                    }

                    $block_type_counters[ $block_name ]++;
                }
            }
            unset( $block );
        }

        // テキスト属性のマッピング（キー名のバリエーション対応）
        // overridesのキー => テンプレート内で探す属性名の配列
        $text_attr_mapping = array(
            'title'       => array( 'mainTitle', 'titleText', 'title', 'heading', 'text', 'mainText' ),
            'mainTitle'   => array( 'mainTitle', 'titleText', 'title', 'heading' ),
            'titleText'   => array( 'titleText', 'mainTitle', 'title' ),
            'subtitle'    => array( 'subTitle', 'subtitle', 'subText', 'subheading' ),
            'subTitle'    => array( 'subTitle', 'subtitle', 'subText' ),
            'description' => array( 'description', 'content', 'text', 'paragraph', 'text_1' ),
            'content'     => array( 'content', 'description', 'text', 'text_1' ),
            'text'        => array( 'content', 'text', 'description', 'text_1' ),
            'buttonText'  => array( 'buttonText', 'textMain', 'btnText', 'ctaText' ),
            'buttonUrl'   => array( 'buttonUrl', 'btnUrl', 'url', 'link' ),
        );

        // 画像属性（存在しなくても追加する）- contents配列内のimageも含む
        // imageUrlPc, imageUrlSp: lw-pr-fv-15等のPC/SP用背景画像で使用
        $image_attrs = array( 'imageUrl', 'imageUrlPc', 'imageUrlSp', 'backgroundImage', 'backgroundImageSp', 'imgUrl', 'image', 'imagePc', 'imageSp', 'img' );

        foreach ( $blocks as &$block ) {
            if ( ! isset( $block['attributes'] ) ) {
                $block['attributes'] = array();
            }

            $block_name = isset( $block['blockName'] ) ? $block['blockName'] : ( isset( $block['name'] ) ? $block['name'] : '' );

            // 各オーバーライドキーをチェック
            foreach ( $overrides as $override_key => $override_value ) {
                // items, contentsは別途処理
                if ( $override_key === 'items' || $override_key === 'contents' ) {
                    continue;
                }

                if ( $override_value === null || $override_value === '' ) {
                    continue;
                }

                // 直接一致する属性があれば最優先で上書き
                if ( array_key_exists( $override_key, $block['attributes'] ) ) {
                    $block['attributes'][ $override_key ] = $override_value;
                    continue;
                }

                // 画像属性は存在しなくても追加（最初のブロックのみ）
                if ( in_array( $override_key, $image_attrs, true ) ) {
                    $block['attributes'][ $override_key ] = $override_value;
                    continue;
                }

                // マッピングから適用可能な属性を探す
                if ( isset( $text_attr_mapping[ $override_key ] ) ) {
                    $applied = false;
                    foreach ( $text_attr_mapping[ $override_key ] as $attr_name ) {
                        if ( array_key_exists( $attr_name, $block['attributes'] ) ) {
                            $block['attributes'][ $attr_name ] = $override_value;
                            $applied = true;
                            break;
                        }
                    }
                }
            }

            // items/tableContents配列内のテキストと画像も処理
            if ( isset( $block['attributes']['items'] ) && is_array( $block['attributes']['items'] ) ) {
                // tableContents -> items のマッピング（lw-company-2等で使用）
                $items_source = null;
                if ( isset( $overrides['tableContents'] ) && is_array( $overrides['tableContents'] ) ) {
                    $items_source = $overrides['tableContents'];
                } elseif ( isset( $overrides['items'] ) && is_array( $overrides['items'] ) ) {
                    $items_source = $overrides['items'];
                }

                if ( $items_source !== null ) {
                    // AIからのitems配列の長さに合わせてテンプレートを調整
                    $override_count = count( $items_source );
                    $template_count = count( $block['attributes']['items'] );

                    if ( $template_count > $override_count ) {
                        $block['attributes']['items'] = array_slice( $block['attributes']['items'], 0, $override_count );
                    }

                    foreach ( $items_source as $index => $item_override ) {
                        if ( ! isset( $block['attributes']['items'][ $index ] ) ) {
                            // items配列が足りない場合は新規作成
                            $block['attributes']['items'][ $index ] = array();
                        }
                        if ( is_array( $item_override ) ) {
                            // AIからのすべてのキーを受け入れる（dt, dd, title, text等）
                            foreach ( $item_override as $item_key => $item_value ) {
                                $block['attributes']['items'][ $index ][ $item_key ] = $item_value;
                            }
                        }
                    }
                }

                // items_0, items_1 形式も対応
                foreach ( $block['attributes']['items'] as $index => &$item ) {
                    $items_key = 'items_' . $index;
                    if ( isset( $overrides[ $items_key ] ) && is_array( $overrides[ $items_key ] ) ) {
                        foreach ( $overrides[ $items_key ] as $item_key => $item_value ) {
                            // 画像属性は存在しなくても追加
                            if ( in_array( $item_key, $image_attrs, true ) || array_key_exists( $item_key, $item ) ) {
                                $item[ $item_key ] = $item_value;
                            }
                        }
                    }
                }
                unset( $item );
            }

            // contents配列内のテキストと画像も処理（solution-1, lw-step-1, lw-qa-1等で使用）
            // steps, questions, faq, problems, solutions → contents のマッピング
            // テンプレートにcontents配列がない場合、AIがデータを提供していれば初期化
            if ( ! isset( $block['attributes']['contents'] ) || ! is_array( $block['attributes']['contents'] ) ) {
                $contents_mapping_keys_check = array( 'contents', 'steps', 'flow', 'questions', 'faq', 'problems', 'solutions' );
                foreach ( $contents_mapping_keys_check as $ck ) {
                    if ( isset( $overrides[ $ck ] ) && is_array( $overrides[ $ck ] ) ) {
                        $block['attributes']['contents'] = array();
                        break;
                    }
                }
            }
            if ( isset( $block['attributes']['contents'] ) && is_array( $block['attributes']['contents'] ) ) {
                $contents_source = null;
                $contents_source_key = '';

                // 優先順位でソースを探す
                $contents_mapping_keys = array( 'contents', 'steps', 'flow', 'questions', 'faq', 'problems', 'solutions' );
                foreach ( $contents_mapping_keys as $key ) {
                    if ( isset( $overrides[ $key ] ) && is_array( $overrides[ $key ] ) ) {
                        $contents_source = $overrides[ $key ];
                        $contents_source_key = $key;
                        break;
                    }
                }

                if ( $contents_source !== null ) {
                    // AIからのcontents配列の長さに合わせてテンプレートを調整
                    $override_count = count( $contents_source );
                    $template_count = count( $block['attributes']['contents'] );

                    // テンプレートの余分な項目を削除（AIが提供した数に合わせる）
                    if ( $template_count > $override_count ) {
                        $block['attributes']['contents'] = array_slice( $block['attributes']['contents'], 0, $override_count );
                    }

                    // contents内のキー名マッピング（AIの出力キー → テンプレートのキー）
                    $contents_key_mapping = array(
                        'question' => 'text_q',
                        'answer'   => 'text_a',
                        'q'        => 'text_q',
                        'a'        => 'text_a',
                    );

                    foreach ( $contents_source as $index => $content_override ) {
                        if ( ! isset( $block['attributes']['contents'][ $index ] ) ) {
                            $block['attributes']['contents'][ $index ] = array();
                        }
                        if ( is_array( $content_override ) ) {
                            // AIからのすべてのキーを受け入れる（title, text, image, text_q, text_a, no等）
                            foreach ( $content_override as $content_key => $content_value ) {
                                // キー名マッピング: AIが question/answer で出力した場合 text_q/text_a に変換
                                $mapped_key = isset( $contents_key_mapping[ $content_key ] ) ? $contents_key_mapping[ $content_key ] : $content_key;
                                $block['attributes']['contents'][ $index ][ $mapped_key ] = $content_value;
                            }
                        }
                    }
                }
            }

            // events配列の処理（paid-block-history-1等で使用）
            // history, timeline → events のマッピング
            if ( isset( $block['attributes']['events'] ) && is_array( $block['attributes']['events'] ) ) {
                $events_source = null;
                if ( isset( $overrides['history'] ) && is_array( $overrides['history'] ) ) {
                    $events_source = $overrides['history'];
                } elseif ( isset( $overrides['timeline'] ) && is_array( $overrides['timeline'] ) ) {
                    $events_source = $overrides['timeline'];
                } elseif ( isset( $overrides['events'] ) && is_array( $overrides['events'] ) ) {
                    $events_source = $overrides['events'];
                }

                if ( $events_source !== null ) {
                    // AIからのevents配列の長さに合わせてテンプレートを調整
                    $override_count = count( $events_source );
                    $template_count = count( $block['attributes']['events'] );

                    if ( $template_count > $override_count ) {
                        $block['attributes']['events'] = array_slice( $block['attributes']['events'], 0, $override_count );
                    }

                    foreach ( $events_source as $index => $event_override ) {
                        if ( ! isset( $block['attributes']['events'][ $index ] ) ) {
                            $block['attributes']['events'][ $index ] = array();
                        }
                        if ( is_array( $event_override ) ) {
                            // AIからのすべてのキーを受け入れる（month, desc等）
                            foreach ( $event_override as $event_key => $event_value ) {
                                $block['attributes']['events'][ $index ][ $event_key ] = $event_value;
                            }
                        }
                    }
                }
            }

            // testimonials/voices配列の処理（paid-block-voice-3等で使用）
            // AIがtestimonialsを出力し、ブロックがvoicesを持つ場合のマッピング
            // テンプレートにvoices配列がない場合、AIがデータを提供していれば初期化
            if ( ! isset( $block['attributes']['voices'] ) || ! is_array( $block['attributes']['voices'] ) ) {
                if ( ( isset( $overrides['testimonials'] ) && is_array( $overrides['testimonials'] ) ) ||
                     ( isset( $overrides['voices'] ) && is_array( $overrides['voices'] ) ) ) {
                    $block['attributes']['voices'] = array();
                }
            }
            if ( isset( $block['attributes']['voices'] ) && is_array( $block['attributes']['voices'] ) ) {
                // testimonials -> voices のマッピング
                $voices_source = null;
                if ( isset( $overrides['testimonials'] ) && is_array( $overrides['testimonials'] ) ) {
                    $voices_source = $overrides['testimonials'];
                } elseif ( isset( $overrides['voices'] ) && is_array( $overrides['voices'] ) ) {
                    $voices_source = $overrides['voices'];
                }

                if ( $voices_source !== null ) {
                    // AIからのvoices配列の長さに合わせてテンプレートを調整
                    $override_count = count( $voices_source );
                    $template_count = count( $block['attributes']['voices'] );

                    // テンプレートの余分な項目を削除（AIが提供した数に合わせる）
                    if ( $template_count > $override_count ) {
                        $block['attributes']['voices'] = array_slice( $block['attributes']['voices'], 0, $override_count );
                    }

                    foreach ( $voices_source as $index => $voice_override ) {
                        if ( ! isset( $block['attributes']['voices'][ $index ] ) ) {
                            $block['attributes']['voices'][ $index ] = array();
                        }
                        if ( is_array( $voice_override ) ) {
                            // AIからのすべてのキーを受け入れる（name, age, job, excerpt, text, photo等）
                            foreach ( $voice_override as $voice_key => $voice_value ) {
                                $block['attributes']['voices'][ $index ][ $voice_key ] = $voice_value;
                            }
                            // AIがphotoを提供しなかった場合、テンプレートのプレースホルダーURLのみクリア
                            if ( ! isset( $voice_override['photo'] ) && isset( $block['attributes']['voices'][ $index ]['photo'] ) ) {
                                $original_photo = $block['attributes']['voices'][ $index ]['photo'];
                                if ( strpos( $original_photo, 'picsum' ) !== false ||
                                     strpos( $original_photo, 'placeholder' ) !== false ||
                                     strpos( $original_photo, 'via.placeholder' ) !== false ||
                                     strpos( $original_photo, 'dummyimage' ) !== false ) {
                                    $block['attributes']['voices'][ $index ]['photo'] = '';
                                }
                            }
                        }
                    }
                }
            }

            // innerBlocksも再帰的に処理
            if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
                $block['innerBlocks'] = self::apply_content_overrides( $block['innerBlocks'], $overrides );
            }
        }
        unset( $block );

        return $blocks;
    }

    /**
     * 現在のテーマカラー設定を取得
     *
     * @return array カラー設定の配列
     */
    public static function get_theme_colors() {
        // カスタマイザーから取得するヘルパー関数
        $get_color = function( $key, $default ) {
            if ( function_exists( 'Lw_theme_mod_set' ) ) {
                return Lw_theme_mod_set( $key, $default );
            }
            return get_theme_mod( $key, $default );
        };

        return array(
            'main'       => $get_color( 'color_main', '#1a72ad' ),
            'sub'        => $get_color( 'color_sub', '#0e1013' ),
            'accent'     => $get_color( 'color_accent', '#d34a4a' ),
            'text'       => $get_color( 'color_text', '#060606' ),
            'background' => $get_color( 'color_background', '#f4f4f4' ),
            'link'       => $get_color( 'color_link_common', '#0066cc' ),
        );
    }

    /**
     * テーマカラー情報をプロンプト用テキストに変換
     *
     * @return string
     */
    public static function get_theme_colors_prompt() {
        $colors = self::get_theme_colors();

        $prompt = <<<COLORS
## ★★★ サイトのカラー設定（必ず使用すること）★★★
このサイトには以下のカラー設定があります。統一感のあるデザインにするため、これらの色を活用してください。

【CSS変数と現在の値】
- var(--color-main): {$colors['main']} ← メインカラー（ボタン、見出し装飾、重要な要素に使用）
- var(--color-sub): {$colors['sub']} ← サブカラー（補助的な装飾、濃い背景に使用）
- var(--color-accent): {$colors['accent']} ← アクセントカラー（強調、CTAボタン、注目させたい要素に使用）
- var(--color-text): {$colors['text']} ← テキストカラー（本文テキストの色）
- var(--color-background-all): {$colors['background']} ← 背景色

【使用ルール】
1. ボタンの背景色は var(--color-main) または var(--color-accent) を使用
2. 見出しやセクションタイトルの装飾には var(--color-main) を使用
3. オーバーレイやフィルターには var(--color-sub) を使用
4. 色を直接指定する場合は上記のHEX値を参考に、サイトのトーンに合わせる
5. 特に指定がない限り、CSS変数形式（var(--color-main)等）で設定する
COLORS;

        return $prompt;
    }

    /**
     * APIキーを保存
     *
     * @param string $api_key APIキー
     * @return bool
     */
    public static function save_api_key( $api_key ) {
        return update_option( 'lw_ai_generator_gemini_api_key', sanitize_text_field( $api_key ) );
    }

    /**
     * ユーザーのプレミアム状態を取得
     *
     * @return array
     */
    public static function get_premium_status() {
        $is_subscription_active = false;
        if ( function_exists( 'lw_template_is_active' ) ) {
            $is_subscription_active = lw_template_is_active( 'paid-lw-parts-sub-hbjkjhkljh', 'sub_pre_set' );
        }

        $is_trial_active = false;
        if ( function_exists( 'lw_is_trial_active' ) ) {
            $is_trial_active = lw_is_trial_active();
        }

        $excluded_blocks = array();
        if ( function_exists( 'block_Outright_purchase_only' ) ) {
            $excluded_blocks = block_Outright_purchase_only();
        }

        $purchased_blocks = array();
        if ( class_exists( 'LwTemplateSetting' ) ) {
            $ts = new LwTemplateSetting();
            $purchased_blocks = $ts->get_active_template_ids();
        }

        return array(
            'isSubscriptionActive' => $is_subscription_active,
            'isTrialActive'        => $is_trial_active,
            'isUnlocked'           => $is_subscription_active || $is_trial_active,
            'excludedBlocks'       => $excluded_blocks,
            'purchasedBlocks'      => $purchased_blocks,
        );
    }

    /**
     * ブロックが利用可能か判定
     *
     * @param array $block ブロック情報
     * @param array $premium_status プレミアム状態
     * @return bool
     */
    private static function is_block_available( $block, $premium_status ) {
        $block_type = isset( $block['blockType'] ) ? $block['blockType'] : 'free';
        $block_slug = isset( $block['slug'] ) ? $block['slug'] : '';

        // 無料ブロックは常に利用可能
        if ( $block_type === 'free' ) {
            return true;
        }

        // 除外リストに含まれている場合は個別購入が必要
        $is_excluded = in_array( $block_slug, $premium_status['excludedBlocks'], true );

        // 個別購入済みか確認
        $is_purchased = in_array( $block_slug, $premium_status['purchasedBlocks'], true );

        // サブスク/試用期間でアンロック（除外ブロック以外）
        if ( $premium_status['isUnlocked'] && ! $is_excluded ) {
            return true;
        }

        // 個別購入済み
        if ( $is_purchased ) {
            return true;
        }

        return false;
    }

    /**
     * ブロック定義を取得
     * 各ブロックのblock.jsonから直接読み込み
     * 管理画面で選択されたブロック + ユーザーのプラン状況に応じてフィルタリング
     *
     * @param bool $return_array 配列で返すかどうか
     * @return string|array
     */
    /**
     * 用途別に厳選されたブロック名の一覧を返す
     *
     * purpose.json はセクションタイプごとに「このセクションならこれを使う」という
     * 少数のブロックを説明つきで持っている（22タイプ・実質51ブロック）。
     * AIに142ブロック全部から選ばせると迷って遅くなるため、既定ではここに載るものだけを候補にする。
     *
     * @return array ブロック名の配列（取得できない場合は空配列＝絞り込みなし）
     */
    public static function get_curated_block_names() {
        $purpose_data = self::get_purpose_data();
        if ( empty( $purpose_data['purposes'] ) || ! is_array( $purpose_data['purposes'] ) ) {
            return array();
        }

        $names = array();
        foreach ( $purpose_data['purposes'] as $purpose ) {
            if ( empty( $purpose['blocks'] ) || ! is_array( $purpose['blocks'] ) ) {
                continue;
            }
            foreach ( array_keys( $purpose['blocks'] ) as $block_name ) {
                $names[ $block_name ] = true;
            }
        }

        return array_keys( $names );
    }

    /**
     * ブロックを選ばせるための軽量カタログをJSON文字列で返す
     *
     * 用途・入れる属性名だけを持つ一覧。attributes の完全定義は含まない。
     * 属性の型や既定値が必要な場面では get_single_block_definition() を使うこと。
     *
     * @param array $allowed_block_names 絞り込む場合はブロック名の配列
     * @return string JSON文字列
     */
    public static function get_block_catalog_json( $allowed_block_names = array() ) {
        if ( ! class_exists( 'LW_AI_Generator_Block_Settings' ) ) {
            return '[]';
        }

        $catalog = LW_AI_Generator_Block_Settings::get_block_catalog( $allowed_block_names );

        // プレミアム以外のユーザーには有料ブロックを見せない。
        // is_block_available() は blockType / slug キーを見るため、判定用に詰め替える。
        $premium_status = self::get_premium_status();
        $catalog        = array_values( array_filter(
            $catalog,
            function ( $item ) use ( $premium_status ) {
                $name  = isset( $item['name'] ) ? $item['name'] : '';
                $slug  = ( false !== strpos( $name, '/' ) ) ? substr( $name, strpos( $name, '/' ) + 1 ) : $name;
                $probe = array(
                    'blockType' => isset( $item['type'] ) ? $item['type'] : 'free',
                    'slug'      => $slug,
                );

                return self::is_block_available( $probe, $premium_status );
            }
        ) );

        // 整形すると1.4倍に膨らむだけでAIの読み取り精度は変わらないため、圧縮したまま渡す
        return wp_json_encode( $catalog, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    }

    public static function get_block_definitions( $return_array = false ) {
        // 各ブロックのblock.jsonから直接読み込み
        $all_blocks = LW_AI_Generator_Block_Settings::get_all_blocks();

        if ( empty( $all_blocks ) ) {
            return $return_array ? array() : '{}';
        }

        // 開発モード：全ブロックを許可（制限を解除）
        $dev_mode = false;

        if ( $dev_mode ) {
            // 全ブロックを使用可能にする
            $available_blocks = $all_blocks;
        } else {
            // プレミアム状態を取得
            $premium_status = self::get_premium_status();

            // 管理画面で有効にされたブロック一覧を取得
            $enabled_block_slugs = LW_AI_Generator_Block_Settings::get_enabled_block_slugs();

            // 利用可能なブロックのみフィルタリング
            $available_blocks = array();
            foreach ( $all_blocks as $block ) {
                $block_slug = isset( $block['slug'] ) ? $block['slug'] : '';

                // 管理画面で有効にされているか確認
                if ( ! in_array( $block_slug, $enabled_block_slugs, true ) ) {
                    continue;
                }

                // プレミアム状態で利用可能か確認
                if ( self::is_block_available( $block, $premium_status ) ) {
                    $available_blocks[] = $block;
                }
            }
        }

        // フィルタリング後のスキーマを返す
        $filtered_schema = array(
            'version'     => '1.0',
            'generatedAt' => current_time( 'mysql' ),
            'totalBlocks' => count( $available_blocks ),
            'blocks'      => $available_blocks,
        );

        if ( $return_array ) {
            return $filtered_schema;
        }

        return json_encode( $filtered_schema, JSON_UNESCAPED_UNICODE );
    }

    /**
     * 許可されたブロックのみのブロック定義を取得
     * purpose.jsonで指定されたブロックのスキーマのみを返す
     *
     * @param array $allowed_block_names 許可するブロック名の配列（例: ['wdl/fv-1', 'wdl/fv-2']）
     * @param bool $return_array 配列で返すかどうか
     * @return string|array
     */
    public static function get_filtered_block_definitions( $allowed_block_names, $return_array = false ) {
        if ( empty( $allowed_block_names ) ) {
            return $return_array ? array( 'blocks' => array() ) : '{"blocks":[]}';
        }

        // 全ブロック定義を取得（block.jsonベース）
        $all_schema = self::get_block_definitions( true );

        // 許可されたブロックのみフィルタリング
        $filtered_blocks = array();
        $found_names = array();
        if ( ! empty( $all_schema['blocks'] ) ) {
            foreach ( $all_schema['blocks'] as $block ) {
                $block_name = isset( $block['name'] ) ? $block['name'] : '';
                if ( in_array( $block_name, $allowed_block_names, true ) ) {
                    $filtered_blocks[] = $block;
                    $found_names[] = $block_name;
                }
            }
        }

        // ★ block.jsonに未登録のブロックをblocks-schema.jsonから補完
        $missing_names = array_diff( $allowed_block_names, $found_names );
        if ( ! empty( $missing_names ) ) {
            $schema_data = self::get_blocks_schema_data();
            if ( $schema_data && isset( $schema_data['blocks'] ) ) {
                foreach ( $missing_names as $block_name ) {
                    if ( isset( $schema_data['blocks'][ $block_name ] ) ) {
                        $sb = $schema_data['blocks'][ $block_name ];
                        // blocks-schema.jsonの情報からAIが理解できるブロック定義を構築
                        $synth_block = array(
                            'name'          => $block_name,
                            'title'         => isset( $sb['label'] ) ? $sb['label'] : $block_name,
                            'slug'          => str_replace( 'wdl/', '', $block_name ),
                            'blockType'     => isset( $sb['tier'] ) ? $sb['tier'] : 'free',
                            'aiDescription' => isset( $sb['description'] ) ? $sb['description'] : '',
                            'aiUsage'       => isset( $sb['category'] ) ? $sb['category'] : '',
                        );

                        // elements情報から属性リストを推測して追加
                        if ( isset( $sb['elements'] ) ) {
                            $attrs_hint = array();
                            $el = $sb['elements'];
                            if ( ! empty( $el['headings'] ) ) {
                                $attrs_hint['mainTitle'] = array( 'type' => 'string', 'ai_description' => '見出しテキスト' );
                                $attrs_hint['subTitle'] = array( 'type' => 'string', 'ai_description' => 'サブタイトル（英語表記等）' );
                            }
                            if ( ! empty( $el['paragraphs'] ) ) {
                                $attrs_hint['description'] = array( 'type' => 'string', 'ai_description' => '説明文（50〜200文字）' );
                            }
                            if ( ! empty( $el['buttons'] ) ) {
                                $attrs_hint['buttonText'] = array( 'type' => 'string', 'ai_description' => 'ボタンテキスト' );
                                $attrs_hint['buttonUrl'] = array( 'type' => 'url', 'ai_description' => 'ボタンリンク先' );
                            }
                            if ( ! empty( $el['images'] ) ) {
                                $attrs_hint['imageUrl'] = array( 'type' => 'string', 'ai_description' => '画像URL or 画像生成プロンプト' );
                            }
                            $synth_block['attributes'] = $attrs_hint;
                        }

                        // blocks-schema.jsonの追加属性情報
                        if ( isset( $sb['attributes'] ) ) {
                            if ( ! isset( $synth_block['attributes'] ) ) {
                                $synth_block['attributes'] = array();
                            }
                            foreach ( $sb['attributes'] as $attr_name => $attr_info ) {
                                if ( ! isset( $synth_block['attributes'][ $attr_name ] ) ) {
                                    $synth_block['attributes'][ $attr_name ] = $attr_info;
                                }
                            }
                        }

                        $filtered_blocks[] = $synth_block;
                    }
                }
            }
        }

        $filtered_schema = array(
            'version'     => '1.0',
            'note'        => 'このセクションで使用可能なブロックのみ',
            'totalBlocks' => count( $filtered_blocks ),
            'blocks'      => $filtered_blocks,
        );

        if ( $return_array ) {
            return $filtered_schema;
        }

        return json_encode( $filtered_schema, JSON_UNESCAPED_UNICODE );
    }

    /**
     * aiNotesが設定されているブロックの制約事項を抽出
     *
     * @return string
     */
    /**
     * ブロックの配置ルール（aiNotes）を組み立てる
     *
     * 「このブロックはh2見出しを内包するので直前にcustom-title系を置かない」といった、
     * レイアウトが崩れないための注意書き。
     *
     * @param array $allowed_block_names 対象を絞る場合はブロック名の配列
     * @return string
     */
    public static function extract_block_constraints( $allowed_block_names = array() ) {
        $schema = self::get_block_definitions( true );

        if ( empty( $schema['blocks'] ) ) {
            return '';
        }

        $constraints = array();

        foreach ( $schema['blocks'] as $block ) {
            $block_name = isset( $block['name'] ) ? $block['name'] : '';

            // そのセクションで使えないブロックの注意書きを混ぜると、
            // 「リストにないブロックは使うな」という指示と矛盾してAIが混乱する
            if ( ! empty( $allowed_block_names ) && ! in_array( $block_name, $allowed_block_names, true ) ) {
                continue;
            }

            if ( ! empty( $block['aiNotes'] ) ) {
                $block_title = isset( $block['title'] ) ? $block['title'] : '';
                $constraints[] = "- **{$block_name}**（{$block_title}）: {$block['aiNotes']}";
            }
        }

        if ( empty( $constraints ) ) {
            return '';
        }

        return implode( "\n", $constraints );
    }

    /**
     * 管理画面で設定されたブロックごとのプロンプトを取得
     *
     * @return string
     */
    public static function extract_custom_block_prompts() {
        $block_prompts = LW_AI_Generator_Block_Settings::get_block_prompts();

        if ( empty( $block_prompts ) ) {
            return '';
        }

        $schema = self::get_block_definitions( true );
        if ( empty( $schema['blocks'] ) ) {
            return '';
        }

        // ブロック名の対応表を作成
        $block_names = array();
        foreach ( $schema['blocks'] as $block ) {
            $slug = isset( $block['slug'] ) ? $block['slug'] : '';
            $name = isset( $block['name'] ) ? $block['name'] : '';
            $title = isset( $block['title'] ) ? $block['title'] : '';
            if ( $slug ) {
                $block_names[ $slug ] = array(
                    'name'  => $name,
                    'title' => $title,
                );
            }
        }

        $prompts = array();

        foreach ( $block_prompts as $slug => $prompt ) {
            if ( empty( $prompt ) ) {
                continue;
            }

            $block_info = isset( $block_names[ $slug ] ) ? $block_names[ $slug ] : null;
            if ( $block_info ) {
                $prompts[] = "- **{$block_info['name']}**（{$block_info['title']}）: {$prompt}";
            }
        }

        if ( empty( $prompts ) ) {
            return '';
        }

        return implode( "\n", $prompts );
    }

    /**
     * Pixabay画像リストを取得
     *
     * @return string
     */
    public static function get_pixabay_images() {
        $images_file = LW_AI_SYSTEM_DIR . 'templates/pixabay-images.json';
        if ( file_exists( $images_file ) ) {
            return file_get_contents( $images_file );
        }
        return '{}';
    }

    /**
     * プロンプトを生成
     *
     * @param string $user_request ユーザーのリクエスト
     * @param string $image_source 画像ソース（'pixabay', 'none'）
     * @return string
     */
    public static function build_prompt( $user_request, $image_source = 'ai' ) {
        // 142ブロック全部を候補にすると、選択に迷って生成が遅くなり、トークンも無駄に増える。
        // purpose.json に用途別で厳選されたブロック（51件）だけを候補にする。
        // ユーザーが特定のブロックを名指しした場合は get_single_block_definition() で個別に引く。
        $block_definitions = self::get_block_catalog_json( self::get_curated_block_names() );
        $block_constraints = self::extract_block_constraints();
        $custom_block_prompts = self::extract_custom_block_prompts();
        $theme_colors_prompt = self::get_theme_colors_prompt();

        $image_instruction = '';

        if ( $image_source === 'none' ) {
            $placeholder_url = self::NO_IMAGE_PLACEHOLDER;
            $image_instruction = "\nbackgroundImage、imageUrl等の画像属性には、すべて以下のプレースホルダー画像URLを設定してください:\n{$placeholder_url}";
        } else {
            // AI画像生成モード（デフォルト）
            $image_instruction = <<<INST

## ★★★ 背景画像の設定（AI生成）★★★
画像が必要な属性（imageUrl, backgroundImage等）には、URLではなく**画像生成用のプロンプト（英語）**を設定してください。
このプロンプトはAI画像生成エンジンに渡され、自動的に画像が生成されます。

【プロンプトの書き方】
- 英語で記述する（例: "Japanese business team meeting in modern office"）
- 業種・シーンを具体的に（例: "dental clinic reception with friendly staff"）
- 雰囲気を指定（例: "warm, professional, clean atmosphere"）
- 人物が必要な場合は "Japanese people" を含める

【プロンプト例】
- 整体院: "Japanese massage therapist treating patient in clean therapy room, professional healthcare"
- 美容院: "Japanese hairstylist cutting hair in modern salon, bright natural lighting"
- 飲食店: "delicious Japanese ramen in stylish restaurant, steam rising, appetizing food photography"
- 企業: "Japanese business professionals in modern office, teamwork, corporate atmosphere"
- 歯科: "friendly Japanese dentist with patient, clean modern dental clinic"

【重要】
- URLではなく、必ず英語の画像プロンプトを設定すること
- プロンプトは50〜150文字程度の英語で記述
- テキストや文字が画像に入らないよう、写真・風景・人物のみを指定
INST;
        }

        // 制約事項セクションを構築
        $constraints_section = '';
        if ( ! empty( $block_constraints ) ) {
            $constraints_section = <<<CONSTRAINTS

## ★★★ 重要：ブロック配置の制約事項（必ず守ること）★★★
以下の制約は絶対に守ってください。違反するとページが正しく表示されません。

{$block_constraints}

上記の制約に違反したレイアウトは無効です。特に「〜の前にh2を設定しない」などの指示は厳守してください。
CONSTRAINTS;
        }

        // カスタムブロックプロンプトセクションを構築
        $custom_prompts_section = '';
        if ( ! empty( $custom_block_prompts ) ) {
            $custom_prompts_section = <<<CUSTOMPROMPTS

## ブロック別の使用指示
以下は各ブロックの使い方に関する追加指示です。該当するブロックを使用する際は必ず従ってください。

{$custom_block_prompts}
CUSTOMPROMPTS;
        }

        $prompt = <<<PROMPT
あなたはWordPressのGutenbergブロックを使ったページレイアウトを生成するAIです。
ユーザーのリクエストに基づいて、適切なブロック構成をJSON形式で出力してください。

## ★★★ 余白調整（必須）★★★
wdl/lw-space-1 は余白を調整するブロックです。セクション間の区切りや視覚的な間隔を作るために積極的に使用してください。

【使用ルール】
- 各セクション（見出し＋コンテンツのまとまり）の間に lw-space-1 を配置する
- ファーストビュー（fv系ブロック）の直後に配置する
- CTAブロックの前後に配置する
- 属性で PC/タブレット/スマホ それぞれの余白サイズを設定できる

【★★★ 禁止事項 ★★★】
- titleを含むブロック（custom-title-1, custom-title-5 等）の直後に lw-space-1 を配置しない
- titleブロックの直後は必ずコンテンツブロックを配置すること
- 正しい順序: title → コンテンツ → lw-space-1 → 次のtitle

【推奨配置例】
fv-5 → lw-space-1 → custom-title-5 → コンテンツ → lw-space-1 → custom-title-5 → コンテンツ → lw-space-1 → cta-1

❌ 禁止パターン: custom-title-5 → lw-space-1（titleの直後にspaceは禁止）
✅ 正しいパターン: custom-title-5 → コンテンツ → lw-space-1
{$constraints_section}
{$custom_prompts_section}
{$theme_colors_prompt}

## 利用可能なブロック定義
{$block_definitions}

## 出力形式
以下のJSON形式で出力してください。JSONのみを出力し、他の説明は不要です。

```json
{
    "version": "1.0",
    "layoutName": "生成されたレイアウト",
    "description": "レイアウトの説明",
    "blocks": [
        {
            "blockName": "wdl/ブロック名",
            "attributes": {
                "属性名": "値"
            }
        }
    ]
}
```

## ルール
1. 必ず利用可能なブロック定義に存在するブロックのみを使用してください
2. 属性は各ブロックの定義に従って設定してください
3. テキストは日本語で、業種や目的に合った内容にしてください
4. ★★★ 色はサイトのカラー設定（上記）に従い、var(--color-main)等のCSS変数を使用してください
5. JSONのみを出力し、マークダウンのコードブロック記号（```）は含めないでください
6. 各ブロックの「aiUsage」は用途を示します。適切な場面で使用してください
7. 各ブロックの「aiDescription」はブロックの説明です。参考にしてください
8. 【重要】各ブロックの「aiNotes」に記載された制約事項は必ず守ってください（h2見出しの重複禁止など）
9. ★★★【最重要】各属性に「ai_description」がある場合、その指示に必ず従ってコンテンツを生成してください。例えば「50～200文字程度で説明文を作ってください」とあれば、その文字数を守ってください。ai_descriptionは属性ごとの生成ルールです。
{$image_instruction}

## ユーザーのリクエスト
{$user_request}
PROMPT;

        return $prompt;
    }

    /**
     * Gemini APIを呼び出し
     *
     * @param string $user_request ユーザーのリクエスト
     * @param string $image_source 画像ソース（'ai', 'none'）
     * @return array|WP_Error
     */
    public static function generate_layout( $user_request, $image_source = 'ai' ) {
        $prompt = self::build_prompt( $user_request, $image_source );

        $api_result = self::call_gemini_text_api( $prompt, array(
            'usage_label' => 'layout',
        ) );

        $layout_data = self::parse_json_response( $api_result, 'レイアウト' );
        if ( is_wp_error( $layout_data ) ) {
            return $layout_data;
        }

        // AI画像生成モードの場合、画像属性のプロンプトから実際の画像を生成
        if ( $image_source !== 'none' && isset( $layout_data['blocks'] ) ) {
            $image_result = self::process_image_generation( $layout_data['blocks'] );
            $layout_data['blocks'] = $image_result['blocks'];
            $layout_data['image_stats'] = $image_result['image_stats'];
        }

        return $layout_data;
    }

    /**
     * ヒアリング質問を生成
     *
     * @param string $user_request ユーザーのリクエスト（例：「接骨院」）
     * @return array|WP_Error 質問リストまたはエラー
     */
    public static function generate_interview( $user_request ) {
        $user_request = self::sanitize_prompt_input( $user_request, 200 );

        $prompt = <<<PROMPT
あなたはWebサイト制作のヒアリング担当者です。
ユーザーが「{$user_request}」のWebサイト/ランディングページを作りたいと言っています。

適切なページを作成するために、以下の観点から3〜5個の質問を生成してください：
- ページの目的（集客、予約獲得、認知向上など）
- ターゲット層（誰に向けたページか）
- 強み・特徴（他社との差別化ポイント）
- 掲載したい情報（料金、アクセス、サービス内容など）
- トーン・雰囲気（高級感、親しみやすさ、専門性など）

## 出力形式
JSON形式で出力してください：
```json
{
    "questions": [
        {
            "id": "purpose",
            "question": "このページの主な目的は何ですか？",
            "placeholder": "例：新規のお客様からの予約を増やしたい",
            "type": "textarea"
        },
        {
            "id": "target",
            "question": "どのようなお客様に来てほしいですか？",
            "placeholder": "例：腰痛に悩む30〜50代の方",
            "type": "textarea"
        }
    ]
}
```

## ルール
1. 質問は具体的で答えやすいものにする
2. placeholderには具体的な回答例を入れる
3. 業種に合わせた適切な質問にする
4. typeは "textarea" または "text" のみ
PROMPT;

        $api_result = self::call_gemini_text_api( $prompt, array(
            'maxOutputTokens'  => 2048,
            'responseMimeType' => 'application/json',
            'usage_label'      => 'interview',
        ) );

        $interview_data = self::parse_json_response( $api_result, 'ヒアリング質問' );
        if ( is_wp_error( $interview_data ) ) {
            return $interview_data;
        }

        return isset( $interview_data['questions'] ) ? $interview_data['questions'] : array();
    }

    /**
     * サンプル回答を自動生成
     *
     * @param string $prompt 業種・ページの種類
     * @param string $questions 質問リスト（テキスト形式）
     * @return array|WP_Error 回答配列またはエラー
     */
    public static function generate_sample_answers( $prompt, $questions, $service_name = '', $page_type = 'lp' ) {
        $service_name = self::sanitize_prompt_input( $service_name, 100 );
        $questions = self::sanitize_prompt_input( $questions, 2000 );

        // サービス名が指定されている場合は、それを基に回答を生成
        $service_context = '';
        if ( ! empty( $service_name ) ) {
            $service_context = "★重要：サービス名「{$service_name}」に合わせた内容で回答を生成してください。";
        }

        // マーケティング知識を取得（ページタイプ別）
        $marketing_context = '';
        if ( $page_type === 'lp' && function_exists( 'lw_ai_get_lp_marketing_knowledge' ) ) {
            $marketing_knowledge = lw_ai_get_lp_marketing_knowledge();
            $marketing_context = "\n\n## マーケティング知識（回答作成時の参考情報）\n以下のLP制作のマーケティング知識を参考に、効果的なLP構成につながるサンプル回答を生成してください：\n\n{$marketing_knowledge}";
        } elseif ( $page_type === 'top' && function_exists( 'lw_ai_get_top_marketing_knowledge' ) ) {
            $marketing_knowledge = lw_ai_get_top_marketing_knowledge();
            $marketing_context = "\n\n## マーケティング知識（回答作成時の参考情報）\n以下のトップページ制作のマーケティング知識を参考に、効果的なトップページ構成につながるサンプル回答を生成してください：\n\n{$marketing_knowledge}";
        }

        $system_prompt = <<<PROMPT
あなたは「{$service_name}」のウェブサイトを作成しようとしているビジネスオーナーです。
以下のヒアリング質問に対して、リアルで具体的なサンプル回答を日本語で生成してください。

{$service_context}
{$marketing_context}

## 質問リスト
{$questions}

## ルール
1. 各質問に対して、「{$service_name}」に適した具体的で現実的な回答を生成してください
2. 回答は簡潔で明確に（各50〜150文字程度）
3. 業種や業態を推測し、それに合った専門的で説得力のある内容にしてください
4. ターゲット層、悩み、特徴などは「{$service_name}」から連想される内容にしてください
5. マーケティング知識を参考に、LPとして効果的な訴求につながる回答を心がけてください

## 出力形式
JSON配列で、質問の順番通りに回答を返してください：
```json
[
    "質問1への回答",
    "質問2への回答",
    "質問3への回答"
]
```
PROMPT;

        $api_result = self::call_gemini_text_api( $system_prompt, array(
            'temperature'     => 0.8,
            'maxOutputTokens' => 2048,
            'timeout'         => 30,
            'usage_label'     => 'sample-answers',
        ) );

        $answers = self::parse_json_response( $api_result, 'サンプル回答' );
        if ( is_wp_error( $answers ) ) {
            return $answers;
        }
        if ( ! is_array( $answers ) ) {
            return new WP_Error( 'json_parse_error', 'サンプル回答のパースに失敗しました' );
        }

        return $answers;
    }

    /**
     * コンテンツ構成案を生成
     *
     * @param string $user_request ユーザーのリクエスト
     * @param string $interview_answers ヒアリング回答（テキスト形式）
     * @return array|WP_Error 構成案データまたはエラー
     */
    public static function generate_outline( $user_request, $interview_answers = '', $page_type = 'lp' ) {
        $prompt = self::build_outline_prompt( $user_request, $interview_answers, $page_type );

        $api_result = self::call_gemini_text_api( $prompt, array(
            'maxOutputTokens'  => 16384,
            'responseMimeType' => 'application/json',
            'usage_label'      => 'outline',
        ) );

        return self::parse_json_response( $api_result, '構成案' );
    }

    /**
     * 構成案生成用プロンプトを構築
     *
     * @param string $user_request ユーザーのリクエスト
     * @param string $interview_answers ヒアリング回答（テキスト形式）
     * @param string $page_type ページタイプ（lp, top, contact, company）
     * @return string プロンプト
     */
    private static function build_outline_prompt( $user_request, $interview_answers = '', $page_type = 'lp' ) {
        $user_request = self::sanitize_prompt_input( $user_request, 1000 );
        $interview_answers = self::sanitize_prompt_input( $interview_answers, 3000 );

        // purpose.jsonから有効なセクションタイプを読み込む
        $purpose_json_path = get_template_directory() . '/functions/custom_bloc_insert_system/purpose.json';
        $valid_sections = array();
        $section_descriptions = array();

        if ( file_exists( $purpose_json_path ) ) {
            $purpose_data = json_decode( file_get_contents( $purpose_json_path ), true );
            if ( isset( $purpose_data['purposes'] ) ) {
                foreach ( $purpose_data['purposes'] as $key => $data ) {
                    $valid_sections[] = $key;
                    $section_descriptions[ $key ] = isset( $data['label'] ) ? $data['label'] : $key;
                }
            }
        }

        // page-types.jsonからデフォルトセクションを読み込む
        $page_types_json_path = get_template_directory() . '/functions/lw_ai_system/page-types.json';
        $default_sections = array();
        $page_type_label = '';
        $industry_sections_map = array();

        if ( file_exists( $page_types_json_path ) ) {
            $page_types_data = json_decode( file_get_contents( $page_types_json_path ), true );
            if ( isset( $page_types_data['pageTypes'][ $page_type ] ) ) {
                $default_sections = isset( $page_types_data['pageTypes'][ $page_type ]['defaultSections'] )
                    ? $page_types_data['pageTypes'][ $page_type ]['defaultSections']
                    : array();
                $page_type_label = isset( $page_types_data['pageTypes'][ $page_type ]['label'] )
                    ? $page_types_data['pageTypes'][ $page_type ]['label']
                    : '';
                $industry_sections_map = isset( $page_types_data['pageTypes'][ $page_type ]['industrySections'] )
                    ? $page_types_data['pageTypes'][ $page_type ]['industrySections']
                    : array();
            }
        }

        // セクションタイプの一覧を作成
        $section_list = '';
        foreach ( $valid_sections as $section ) {
            $label = isset( $section_descriptions[ $section ] ) ? $section_descriptions[ $section ] : $section;
            $section_list .= "- {$section}: {$label}\n";
        }

        // デフォルトセクションの文字列を作成
        $default_sections_str = implode( ', ', $default_sections );

        // 業種別セクション候補をプロンプトに追加
        $industry_sections_hint = '';
        if ( ! empty( $industry_sections_map ) ) {
            $industry_sections_hint = "\n\n## 業種別の推奨セクション構成（参考）\n";
            $industry_sections_hint .= "ユーザーのリクエストから業種を判断し、該当する構成を参考にしてください。\n";
            $industry_sections_hint .= "完全一致しなくても、最も近い業種の構成をベースに調整してください。\n\n";
            foreach ( $industry_sections_map as $industry => $sections ) {
                $industry_sections_hint .= "- **{$industry}**: " . implode( ' → ', $sections ) . "\n";
            }
        }

        // ヒアリング回答がある場合は追加情報として含める
        $interview_section = '';
        if ( ! empty( $interview_answers ) ) {
            $interview_section = <<<INTERVIEW

## ヒアリング情報（★重要：この情報を必ず反映してください）
{$interview_answers}

上記のヒアリング情報を踏まえて、ターゲット層に響くコンテンツを作成してください。
INTERVIEW;
        }

        // マーケティング知識を取得（ページタイプ別）
        $marketing_section = '';
        if ( $page_type === 'lp' && function_exists( 'lw_ai_get_lp_marketing_knowledge' ) ) {
            $marketing_knowledge = lw_ai_get_lp_marketing_knowledge();
            $marketing_section = <<<MARKETING

## マーケティング知識（コンテンツ作成時の参考情報）
以下のマーケティング知識を参考に、効果的なLP構成を作成してください：

{$marketing_knowledge}
MARKETING;
        } elseif ( $page_type === 'top' && function_exists( 'lw_ai_get_top_marketing_knowledge' ) ) {
            $marketing_knowledge = lw_ai_get_top_marketing_knowledge();
            $marketing_section = <<<MARKETING

## マーケティング知識（コンテンツ作成時の参考情報）
以下のマーケティング知識を参考に、効果的なトップページ構成を作成してください：

{$marketing_knowledge}
MARKETING;
        }

        $prompt = <<<PROMPT
あなたはWebサイトのコンテンツプランナーです。
ユーザーのリクエストとヒアリング情報に基づいて、{$page_type_label}のコンテンツ構成案をJSON形式で出力してください。

## ページタイプ
{$page_type_label}

## 推奨セクション構成
このページタイプには以下のセクションが推奨されます：{$default_sections_str}
{$industry_sections_hint}

## ユーザーのリクエスト
{$user_request}
{$interview_section}
{$marketing_section}

## 使用可能なセクションタイプ（★重要：以下のtypeのみ使用可能）
{$section_list}

## 出力形式
以下のJSON形式で出力してください。JSONのみを出力し、他の説明は不要です。

```json
{
    "businessType": "業種（整体院、美容院、歯科医院など）",
    "sections": [
        {
            "type": "firstview",
            "category": "カテゴリー名（例：整体・骨盤矯正）",
            "catchphrase": "キャッチフレーズ（20〜40文字）",
            "subText": "補足文（30〜60文字）",
            "buttonText": "ボタンのテキスト",
            "buttonUrl": "#contact"
        },
        {
            "type": "introduction",
            "title": "セクションタイトル（例：当院について）",
            "content": "説明文（100〜200文字程度）"
        },
        {
            "type": "features",
            "title": "セクションタイトル（例：当院の3つの特徴）",
            "items": [
                { "title": "特徴1のタイトル", "description": "特徴1の説明（50〜100文字）" },
                { "title": "特徴2のタイトル", "description": "特徴2の説明（50〜100文字）" },
                { "title": "特徴3のタイトル", "description": "特徴3の説明（50〜100文字）" }
            ]
        },
        {
            "type": "service",
            "title": "サービス内容",
            "items": [
                { "title": "メニュー1", "description": "説明文（50〜100文字）", "price": "料金（任意）" },
                { "title": "メニュー2", "description": "説明文（50〜100文字）", "price": "料金（任意）" }
            ]
        },
        {
            "type": "solution",
            "title": "こんなお悩みありませんか？",
            "items": [
                { "title": "悩み1", "description": "悩みの詳細（30〜50文字）" },
                { "title": "悩み2", "description": "悩みの詳細（30〜50文字）" }
            ]
        },
        {
            "type": "step",
            "title": "ご利用の流れ",
            "steps": [
                { "title": "ステップ1", "description": "説明文（30〜50文字）" },
                { "title": "ステップ2", "description": "説明文（30〜50文字）" },
                { "title": "ステップ3", "description": "説明文（30〜50文字）" }
            ]
        },
        {
            "type": "voice",
            "title": "お客様の声",
            "items": [
                {
                    "name": "お客様の属性（例：30代女性）",
                    "title": "見出し（例：肩こりがすっきり！）",
                    "content": "お客様の声本文（100〜200文字）"
                }
            ]
        },
        {
            "type": "faq",
            "title": "よくある質問",
            "items": [
                { "question": "質問1", "answer": "回答1（50〜150文字）" },
                { "question": "質問2", "answer": "回答2（50〜150文字）" }
            ]
        },
        {
            "type": "price",
            "title": "料金表",
            "items": [
                { "title": "メニュー名1", "price": "○○円", "description": "補足説明（任意）" }
            ]
        },
        {
            "type": "staff",
            "title": "スタッフ紹介",
            "items": [
                {
                    "name": "スタッフ名",
                    "role": "役職",
                    "description": "プロフィール（100〜200文字）"
                }
            ]
        },
        {
            "type": "company",
            "title": "会社概要",
            "items": [
                { "label": "会社名", "value": "株式会社〇〇" },
                { "label": "設立", "value": "20XX年X月" },
                { "label": "所在地", "value": "東京都〇〇区..." }
            ]
        },
        {
            "type": "access",
            "title": "アクセス",
            "address": "住所（例：東京都渋谷区〇〇1-2-3）",
            "access": "アクセス情報（例：〇〇駅から徒歩5分）",
            "hours": "営業時間（例：9:00〜20:00）",
            "holidays": "定休日（例：日曜・祝日）",
            "phone": "電話番号（例：03-xxxx-xxxx）"
        },
        {
            "type": "news",
            "title": "お知らせ",
            "description": "最新のお知らせを表示します"
        },
        {
            "type": "history",
            "title": "沿革",
            "items": [
                { "year": "20XX年", "event": "創業" },
                { "year": "20XX年", "event": "拡大" }
            ]
        },
        {
            "type": "cta",
            "title": "ご予約・お問い合わせ",
            "content": "CTAの説明文（30〜80文字）",
            "buttonText": "ボタンのテキスト",
            "buttonUrl": "#contact"
        }
    ]
}
```

## ★重要なルール★
1. **typeは上記の「使用可能なセクションタイプ」一覧からのみ選んでください**。それ以外のtypeは使用禁止です
2. **すべてのセクションに具体的な内容を入れてください**。タイトルだけでなく、items や content を必ず埋めてください
3. 空の項目（"title": "" や "description": ""）は絶対に作らないでください
4. ヒアリング情報がない項目でも、業種に合った一般的な内容を推測して埋めてください
5. 業種や目的に合った自然な日本語でコンテンツを作成してください
6. キャッチフレーズは印象的で、ターゲットに響く内容にしてください
7. 各セクションの説明文は具体的で説得力のある内容にしてください
8. 推奨セクション構成を参考にしつつ、リクエストの内容に応じて適切に調整してください
9. ヒアリング情報がある場合は、その内容を最大限に活用してください
PROMPT;

        return $prompt;
    }

    /**
     * 構成案（テキスト）からレイアウトを生成
     *
     * @param string $outline_text 構成案テキスト（ユーザーが編集した可能性あり）
     * @param string $image_source 画像ソース（'ai', 'none'）
     * @return array|WP_Error レイアウトデータまたはエラー
     */
    public static function generate_layout_from_outline( $outline_text, $image_source = 'ai' ) {
        $prompt = self::build_prompt_from_outline( $outline_text, $image_source );

        $api_result = self::call_gemini_text_api( $prompt, array(
            'usage_label' => 'layout',
        ) );

        $layout_data = self::parse_json_response( $api_result, 'レイアウト（構成案から）' );
        if ( is_wp_error( $layout_data ) ) {
            return $layout_data;
        }

        // AI画像生成モードの場合
        if ( $image_source !== 'none' && isset( $layout_data['blocks'] ) ) {
            $image_result = self::process_image_generation( $layout_data['blocks'] );
            $layout_data['blocks'] = $image_result['blocks'];
            $layout_data['image_stats'] = $image_result['image_stats'];
        }

        return $layout_data;
    }

    /**
     * 構成案からブロック生成用プロンプトを構築
     *
     * @param string $outline_text 構成案テキスト（ユーザーが編集した可能性あり）
     * @param string $image_source 画像ソース
     * @return string プロンプト
     */
    private static function build_prompt_from_outline( $outline_text, $image_source = 'ai' ) {
        // build_prompt と同じ理由で、厳選ブロックだけを候補にする
        $block_definitions = self::get_block_catalog_json( self::get_curated_block_names() );
        $block_constraints = self::extract_block_constraints();
        $theme_colors_prompt = self::get_theme_colors_prompt();

        $image_instruction = '';
        if ( $image_source === 'none' ) {
            $placeholder_url = self::NO_IMAGE_PLACEHOLDER;
            $image_instruction = "\nbackgroundImage、imageUrl等の画像属性には、すべて以下のプレースホルダー画像URLを設定してください:\n{$placeholder_url}";
        } else {
            $image_instruction = <<<INST

## 背景画像の設定（AI生成）
画像が必要な属性（imageUrl, backgroundImage等）には、URLではなく**画像生成用のプロンプト（英語）**を設定してください。
プロンプトは50〜150文字程度の英語で、業種・シーンを具体的に記述してください。
INST;
        }

        $constraints_section = '';
        if ( ! empty( $block_constraints ) ) {
            $constraints_section = <<<CONSTRAINTS

## ブロック配置の制約事項
{$block_constraints}
CONSTRAINTS;
        }

        $prompt = <<<PROMPT
あなたはWordPressのGutenbergブロックを使ったページレイアウトを生成するAIです。
以下のコンテンツ構成案に基づいて、適切なブロック構成をJSON形式で出力してください。

## コンテンツ構成案（ユーザーが確認・編集済み）
---
{$outline_text}
---

## ★★★ 重要：構成案の内容を理解してそのまま使用すること ★★★
上記の構成案はユーザーが確認・編集したテキストです。
- テキスト形式は整っていない可能性があります（ユーザーが自由に書き換えた場合）
- 構成案の意図を理解し、適切なブロック構成を生成してください
- キャッチフレーズ、説明文、ボタンテキスト等の内容は変更せず、そのまま使用してください
- セクションの順番や種類はユーザーの意図を尊重してください

## 余白調整
- 各セクション間に lw-space-1 を配置する
- titleブロックの直後には lw-space-1 を配置しない
{$constraints_section}
{$theme_colors_prompt}

## 利用可能なブロック定義
{$block_definitions}

## 出力形式
```json
{
    "version": "1.0",
    "layoutName": "生成されたレイアウト",
    "description": "レイアウトの説明",
    "blocks": [
        {
            "blockName": "wdl/ブロック名",
            "attributes": { "属性名": "値" }
        }
    ]
}
```

## ルール
1. 構成案のセクション内容を理解し、適切なブロックを選択してください
2. 構成案のテキスト内容はそのまま使用し、勝手に変更しないでください
3. 色はvar(--color-main)等のCSS変数を使用してください
4. 各ブロックのaiNotesに記載された制約事項は必ず守ってください
{$image_instruction}
PROMPT;

        return $prompt;
    }

    /**
     * ブロック配列内の画像プロンプトをAI生成画像URLに置換
     *
     * @param array $blocks ブロック配列
     * @return array 処理済みブロック配列
     */
    private static function process_image_generation( $blocks, $is_recursive = false ) {
        // 画像属性のキー一覧（photoはvoicesやstaffで使用）
        // imageUrlPc, imageUrlSp: lw-pr-fv-15等のPC/SP用背景画像で使用
        $image_attrs = array( 'imageUrl', 'imageUrlPc', 'imageUrlSp', 'backgroundImage', 'backgroundImageSp', 'imgUrl', 'image', 'imagePc', 'imageSp', 'photo' );

        $image_count = 0;
        $success_count = 0;
        $fail_count = 0;

        // 最初の呼び出し時のみPHP実行時間を延長（画像生成は時間がかかるため）
        if ( ! $is_recursive ) {
            // PHP実行時間を600秒（10分）に延長
            $original_time_limit = ini_get( 'max_execution_time' );
            @set_time_limit( 600 );
        }

        foreach ( $blocks as $block_index => &$block ) {
            if ( ! isset( $block['attributes'] ) ) {
                continue;
            }

            $block_name = isset( $block['blockName'] ) ? $block['blockName'] : ( isset( $block['name'] ) ? $block['name'] : 'unknown' );

            foreach ( $image_attrs as $attr ) {
                if ( isset( $block['attributes'][ $attr ] ) ) {
                    $value = $block['attributes'][ $attr ];

                    // URLでない場合（プロンプトの場合）、画像を生成
                    if ( ! empty( $value ) && ! filter_var( $value, FILTER_VALIDATE_URL ) && strpos( $value, 'data:' ) !== 0 ) {
                        $image_count++;

                        try {
                            $generated_url = self::generate_image( $value );

                            if ( ! is_wp_error( $generated_url ) ) {
                                $block['attributes'][ $attr ] = $generated_url;
                                $success_count++;
                            } else {
                                $fail_count++;
                                error_log( '[LW AI Image] 画像生成失敗 #' . $image_count . ': ' . $generated_url->get_error_message() );
                                // 失敗した場合は元のプロンプトを保持（再生成時に利用可能）
                                // $block['attributes'][ $attr ] はそのまま（$valueが残る）
                            }
                        } catch ( Exception $e ) {
                            $fail_count++;
                            error_log( '[LW AI Image] 画像生成例外 #' . $image_count . ': ' . $e->getMessage() );
                        } catch ( Error $e ) {
                            $fail_count++;
                            error_log( '[LW AI Image] 画像生成エラー #' . $image_count . ': ' . $e->getMessage() );
                        }
                    }
                }
            }

            // items配列内の画像も処理
            if ( isset( $block['attributes']['items'] ) && is_array( $block['attributes']['items'] ) ) {
                foreach ( $block['attributes']['items'] as $item_index => &$item ) {
                    if ( isset( $item['imgUrl'] ) && ! empty( $item['imgUrl'] ) && ! filter_var( $item['imgUrl'], FILTER_VALIDATE_URL ) && strpos( $item['imgUrl'], 'data:' ) !== 0 ) {
                        $image_count++;

                        try {
                            $generated_url = self::generate_image( $item['imgUrl'] );
                            if ( ! is_wp_error( $generated_url ) ) {
                                $item['imgUrl'] = $generated_url;
                                $success_count++;
                            } else {
                                $fail_count++;
                                error_log( '[LW AI Image] items画像生成失敗 #' . $image_count . ': ' . $generated_url->get_error_message() );
                                // 元のプロンプトを保持
                            }
                        } catch ( Exception $e ) {
                            $fail_count++;
                            error_log( '[LW AI Image] items画像生成例外 #' . $image_count . ': ' . $e->getMessage() );
                        } catch ( Error $e ) {
                            $fail_count++;
                            error_log( '[LW AI Image] items画像生成エラー #' . $image_count . ': ' . $e->getMessage() );
                        }
                    }
                }
                unset( $item );
            }

            // contents配列内の画像も処理（solution-1等で使用）
            if ( isset( $block['attributes']['contents'] ) && is_array( $block['attributes']['contents'] ) ) {
                foreach ( $block['attributes']['contents'] as $content_index => &$content_item ) {
                    // contents配列内の各画像属性をチェック
                    foreach ( $image_attrs as $img_attr ) {
                        if ( isset( $content_item[ $img_attr ] ) && ! empty( $content_item[ $img_attr ] ) && ! filter_var( $content_item[ $img_attr ], FILTER_VALIDATE_URL ) && strpos( $content_item[ $img_attr ], 'data:' ) !== 0 ) {
                            $image_count++;

                            try {
                                $generated_url = self::generate_image( $content_item[ $img_attr ] );
                                if ( ! is_wp_error( $generated_url ) ) {
                                    $content_item[ $img_attr ] = $generated_url;
                                    $success_count++;
                                } else {
                                    $fail_count++;
                                    error_log( '[LW AI Image] contents画像生成失敗 #' . $image_count . ': ' . $generated_url->get_error_message() );
                                    // 元のプロンプトを保持
                                }
                            } catch ( Exception $e ) {
                                $fail_count++;
                                error_log( '[LW AI Image] contents画像生成例外 #' . $image_count . ': ' . $e->getMessage() );
                            } catch ( Error $e ) {
                                $fail_count++;
                                error_log( '[LW AI Image] contents画像生成エラー #' . $image_count . ': ' . $e->getMessage() );
                            }
                        }
                    }
                }
                unset( $content_item );
            }

            // voices配列内の画像も処理（paid-block-voice-3等で使用）
            if ( isset( $block['attributes']['voices'] ) && is_array( $block['attributes']['voices'] ) ) {
                foreach ( $block['attributes']['voices'] as $voice_index => &$voice_item ) {
                    // voices配列内の各画像属性をチェック（特にphoto）
                    foreach ( $image_attrs as $img_attr ) {
                        if ( isset( $voice_item[ $img_attr ] ) && ! empty( $voice_item[ $img_attr ] ) && ! filter_var( $voice_item[ $img_attr ], FILTER_VALIDATE_URL ) && strpos( $voice_item[ $img_attr ], 'data:' ) !== 0 ) {
                            $image_count++;

                            try {
                                $generated_url = self::generate_image( $voice_item[ $img_attr ] );
                                if ( ! is_wp_error( $generated_url ) ) {
                                    $voice_item[ $img_attr ] = $generated_url;
                                    $success_count++;
                                } else {
                                    $fail_count++;
                                    error_log( '[LW AI Image] voices画像生成失敗 #' . $image_count . ': ' . $generated_url->get_error_message() );
                                    // 元のプロンプトを保持
                                }
                            } catch ( Exception $e ) {
                                $fail_count++;
                                error_log( '[LW AI Image] voices画像生成例外 #' . $image_count . ': ' . $e->getMessage() );
                            } catch ( Error $e ) {
                                $fail_count++;
                                error_log( '[LW AI Image] voices画像生成エラー #' . $image_count . ': ' . $e->getMessage() );
                            }
                        }
                    }
                }
                unset( $voice_item );
            }

            // innerBlocksも再帰的に処理
            if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) ) {
                $inner_result = self::process_image_generation( $block['innerBlocks'], true );
                if ( is_array( $inner_result ) && isset( $inner_result['blocks'] ) ) {
                    $block['innerBlocks'] = $inner_result['blocks'];
                    $success_count += $inner_result['image_stats']['success'];
                    $fail_count += $inner_result['image_stats']['fail'];
                    $image_count += $inner_result['image_stats']['total'];
                } else {
                    $block['innerBlocks'] = $inner_result;
                }
            }
        }
        unset( $block );

        return array(
            'blocks' => $blocks,
            'image_stats' => array(
                'success' => $success_count,
                'fail'    => $fail_count,
                'total'   => $image_count,
            ),
        );
    }

    /**
     * セクション単位でブロックを生成
     *
     * @param string $section_text セクションのテキスト内容
     * @param int $section_index セクション番号（0始まり）
     * @param int $total_sections 総セクション数
     * @param string $image_source 画像ソース（'ai', 'none'）
     * @param string $business_type 業種
     * @return array|WP_Error ブロック配列またはエラー
     */
    public static function generate_section( $section_text, $section_index, $total_sections, $image_source = 'ai', $business_type = '', $selected_part = '', $selected_part_type = '' ) {
        $prompt = self::build_section_prompt( $section_text, $section_index, $total_sections, $image_source, $business_type, $selected_part, $selected_part_type );

        $api_result = self::call_gemini_text_api( $prompt, array(
            'temperature'      => 0.7,
            'maxOutputTokens'  => 16384,
            // 他の処理はJSON指定済みだが、最も出力が大きいこの処理だけ抜けていた。
            // 指定が無いとAIがコードフェンスや前置きを付け、正規表現で剥がす処理に依存する。
            'responseMimeType' => 'application/json',
            'usage_label'      => 'section',
        ) );

        $blocks_data = self::parse_json_response( $api_result, 'セクションブロック' );
        if ( defined('WP_DEBUG') && WP_DEBUG ) { error_log('[LW DBG] blocks_data=' . substr(json_encode($blocks_data),0,200)); }
        if ( is_wp_error( $blocks_data ) ) {
            return $blocks_data;
        }

        // セクションタイプを検出して許可されたテンプレートを取得（バリデーション用）
        $detected_type = self::detect_section_type( $section_text );
        $purpose_info  = self::get_purpose_blocks_and_templates( $detected_type, $business_type );
        $allowed_templates = ! empty( $purpose_info['templates'] ) ? array_keys( $purpose_info['templates'] ) : array();

        // テンプレートを使用する場合
        if ( isset( $blocks_data['useTemplate'] ) ) {
            $template_name = $blocks_data['useTemplate'];

            // ★バリデーション: AIが許可されていないテンプレートを使った場合はブロックモードにフォールバック
            if ( ! empty( $allowed_templates ) ) {
                // テンプレートが許可リストにあるか確認（pr_title_接頭辞も考慮）
                $is_allowed = in_array( $template_name, $allowed_templates, true );
                if ( ! $is_allowed ) {
                    // 接頭辞除去して再確認
                    $stripped = preg_replace( '/^pr_title_/', '', $template_name );
                    $is_allowed = in_array( $stripped, $allowed_templates, true );
                    if ( ! $is_allowed ) {
                        $stripped2 = preg_replace( '/^pr_/', '', $template_name );
                        $is_allowed = in_array( $stripped2, $allowed_templates, true );
                    }
                }
                if ( ! $is_allowed ) {
                    if ( defined('WP_DEBUG') && WP_DEBUG ) { error_log( '[LW AI Debug] テンプレート「' . $template_name . '」はセクション「' . $detected_type . '」の許可リストにありません。スキップしてブロックモードに切替。許可: ' . implode(', ', $allowed_templates) ); }
                    // useTemplateを除去してブロックモードにフォールバック
                    unset( $blocks_data['useTemplate'] );
                    // → 下の blocks 処理へ流れる
                }
            } elseif ( empty( $selected_part ) || $selected_part_type !== 'template' ) {
                // このセクションタイプにはテンプレートが定義されていない → テンプレート使用を拒否
                if ( defined('WP_DEBUG') && WP_DEBUG ) { error_log( '[LW AI Debug] セクション「' . $detected_type . '」にはテンプレートが定義されていません。「' . $template_name . '」を拒否。ブロックモードに切替。' ); }
                // contentOverridesからブロック属性を構築するフォールバック
                $co = isset( $blocks_data['contentOverrides'] ) ? $blocks_data['contentOverrides'] : array();
                $fallback_blocks = self::build_fallback_blocks_from_overrides( $detected_type, $co, $purpose_info, $image_source );
                if ( ! empty( $fallback_blocks ) ) {
                    $fallback_blocks = self::cap_filter_opacity( $fallback_blocks );
                    return $fallback_blocks;
                }
                unset( $blocks_data['useTemplate'] );
            }
        }

        // テンプレートを使用する場合（バリデーション通過後）
        if ( isset( $blocks_data['useTemplate'] ) ) {
            $template_name = $blocks_data['useTemplate'];
            $content_overrides = isset( $blocks_data['contentOverrides'] ) ? $blocks_data['contentOverrides'] : array();

            // テンプレートを読み込み（contentOverridesが空の場合はデフォルト値クリアをスキップ）
            $skip_clear = empty( $content_overrides );
            $template_blocks = self::load_template( $template_name, $skip_clear );

            // テンプレートが見つからない場合、AIがpr_title_等の接頭辞を勝手に追加した可能性
            if ( ! $template_blocks || ! is_array( $template_blocks ) ) {
                // 接頭辞を除去して再試行
                $stripped = preg_replace( '/^pr_title_/', '', $template_name );
                if ( $stripped !== $template_name ) {
                    $template_blocks = self::load_template( $stripped, $skip_clear );
                }
                // pr_接頭辞を除去して再試行
                if ( ! $template_blocks ) {
                    $stripped2 = preg_replace( '/^pr_/', '', $template_name );
                    if ( $stripped2 !== $template_name ) {
                        $template_blocks = self::load_template( $stripped2, $skip_clear );
                    }
                }
                // それでも見つからない場合はエラー
                if ( ! $template_blocks || ! is_array( $template_blocks ) ) {
                    if ( defined('WP_DEBUG') && WP_DEBUG ) { error_log( '[LW AI Debug] generate_section: テンプレートが見つからない - ' . $template_name ); }
                    return new WP_Error( 'template_not_found', 'テンプレート「' . $template_name . '」が見つかりませんでした' );
                }
            }

            // contentOverridesを適用
            if ( ! empty( $content_overrides ) ) {
                $template_blocks = self::apply_content_overrides( $template_blocks, $content_overrides );
            } else {
                if ( defined('WP_DEBUG') && WP_DEBUG ) { error_log( '[LW AI Warning] contentOverridesが空のためテンプレートデフォルト値を保持します: ' . $template_name ); }
            }

            // AI画像生成モードの場合
            if ( $image_source !== 'none' && ! empty( $template_blocks ) ) {
                $image_result = self::process_image_generation( $template_blocks );
                $template_blocks = $image_result['blocks'];
                // image_statsはgenerate_sectionの戻り値には含めない（ブロック配列を返すため）
                // ログで確認可能
            }

            // filterColorの不透明度をキャップ（背景画像が見えなくなるのを防止）
            $template_blocks = self::cap_filter_opacity( $template_blocks );

            return $template_blocks;
        }

        // blocks配列を取得（直接配列またはblocksキー）
        $blocks = isset( $blocks_data['blocks'] ) ? $blocks_data['blocks'] : $blocks_data;

        // 配列でない場合はエラー
        if ( ! is_array( $blocks ) ) {
            return new WP_Error( 'invalid_format', 'ブロック配列の形式が不正です' );
        }

        // ★単一ブロックオブジェクト対応: {"blockName":"...","attributes":{...}} を配列にラップ
        if ( isset( $blocks['blockName'] ) ) {
            $blocks = array( $blocks );
        }

        // 直接ブロックでもテンプレートデフォルト値をクリア（AIがプレースホルダーをコピーする場合がある）
        $blocks = self::clear_template_defaults( $blocks );

        // filterColorの不透明度をキャップ（背景画像が見えなくなるのを防止）
        $blocks = self::cap_filter_opacity( $blocks );

        // AI画像生成モードの場合
        if ( $image_source !== 'none' && ! empty( $blocks ) ) {
            $image_result = self::process_image_generation( $blocks );
            $blocks = $image_result['blocks'];
        }

        return $blocks;
    }

    /**
     * テンプレート拒否時のフォールバック: contentOverridesからブロック配列を構築
     * CTA、price、step等のテンプレート未定義セクションで有効
     */
    private static function build_fallback_blocks_from_overrides( $section_type, $overrides, $purpose_info, $image_source ) {
        $blocks = array();
        $available_blocks = ! empty( $purpose_info['blocks'] ) ? $purpose_info['blocks'] : array();

        if ( empty( $available_blocks ) ) {
            return array();
        }

        // セクションタイプに応じた最適ブロックを選択
        $block_name = '';
        switch ( $section_type ) {
            case 'cta':
                // cta-1 を優先（最も汎用的）
                $block_name = isset( $available_blocks['wdl/cta-1'] ) ? 'wdl/cta-1' :
                    ( isset( $available_blocks['wdl/cta-2'] ) ? 'wdl/cta-2' : array_keys( $available_blocks )[0] );

                $blocks[] = array(
                    'blockName'  => $block_name,
                    'attributes' => array(
                        'mainTitle'   => isset( $overrides['mainTitle'] ) ? $overrides['mainTitle'] : 'お問い合わせ',
                        'description' => isset( $overrides['content'] ) ? $overrides['content'] : ( isset( $overrides['description'] ) ? $overrides['description'] : '' ),
                        'buttonText'  => isset( $overrides['buttonText'] ) ? $overrides['buttonText'] : ( ! empty( $overrides['items'][0]['text'] ) ? $overrides['items'][0]['text'] : 'お問い合わせ' ),
                        'buttonUrl'   => '#',
                    ),
                );
                break;

            case 'price':
                // 料金テーブル
                if ( isset( $available_blocks['wdl/lw-pr-table-1'] ) ) {
                    // 見出しブロック追加
                    if ( ! empty( $overrides['mainTitle'] ) ) {
                        $blocks[] = array(
                            'blockName'  => 'wdl/custom-title-4',
                            'attributes' => array(
                                'mainTitle' => $overrides['mainTitle'],
                                'subTitle'  => isset( $overrides['subTitle'] ) ? $overrides['subTitle'] : 'PRICE',
                            ),
                        );
                    }
                    $items = array();
                    if ( ! empty( $overrides['items'] ) ) {
                        foreach ( $overrides['items'] as $item ) {
                            $items[] = array(
                                'title' => isset( $item['title'] ) ? $item['title'] : '',
                                'text'  => isset( $item['description'] ) ? $item['description'] : ( isset( $item['text'] ) ? $item['text'] : '' ),
                            );
                        }
                    } elseif ( ! empty( $overrides['contentBlocks'] ) ) {
                        foreach ( $overrides['contentBlocks'] as $cb ) {
                            $items[] = array(
                                'title' => isset( $cb['title'] ) ? $cb['title'] : '',
                                'text'  => isset( $cb['content'] ) ? $cb['content'] : '',
                            );
                        }
                    }
                    $blocks[] = array(
                        'blockName'  => 'wdl/lw-pr-table-1',
                        'attributes' => array( 'items' => $items ),
                    );
                }
                break;

            default:
                // 汎用: 最初の利用可能ブロックを使用
                $block_name = array_keys( $available_blocks )[0];
                $attrs = array();
                if ( ! empty( $overrides['mainTitle'] ) )   $attrs['mainTitle']   = $overrides['mainTitle'];
                if ( ! empty( $overrides['subTitle'] ) )    $attrs['subTitle']    = $overrides['subTitle'];
                if ( ! empty( $overrides['description'] ) ) $attrs['description'] = $overrides['description'];
                if ( ! empty( $overrides['content'] ) )     $attrs['content']     = $overrides['content'];
                if ( ! empty( $overrides['buttonText'] ) )  $attrs['buttonText']  = $overrides['buttonText'];
                if ( ! empty( $overrides['items'] ) )       $attrs['items']       = $overrides['items'];

                // 見出しが必要なブロックの場合は先に見出しを追加
                $block_desc = isset( $available_blocks[ $block_name ] ) ? $available_blocks[ $block_name ] : '';
                if ( strpos( $block_desc, '見出しが無いブロックです' ) !== false && ! empty( $overrides['mainTitle'] ) ) {
                    $blocks[] = array(
                        'blockName'  => 'wdl/custom-title-4',
                        'attributes' => array(
                            'mainTitle' => $overrides['mainTitle'],
                            'subTitle'  => isset( $overrides['subTitle'] ) ? $overrides['subTitle'] : '',
                        ),
                    );
                }

                $blocks[] = array(
                    'blockName'  => $block_name,
                    'attributes' => $attrs,
                );
                break;
        }

        if ( defined('WP_DEBUG') && WP_DEBUG ) { error_log( '[LW AI Debug] フォールバックブロック生成: ' . $section_type . ' → ' . ( $block_name ?: 'custom' ) . ' (' . count( $blocks ) . 'ブロック)' ); }

        return $blocks;
    }

    /**
     * セクション用プロンプトを構築
     *
     * @param string $section_text セクションのテキスト内容
     * @param int $section_index セクション番号（0始まり）
     * @param int $total_sections 総セクション数
     * @param string $image_source 画像ソース
     * @param string $business_type 業種
     * @param string $selected_part 選択されたパーツ名（指定された場合は強制使用）
     * @param string $selected_part_type パーツタイプ（'block' or 'template'）
     * @return string プロンプト
     */
    private static function build_section_prompt( $section_text, $section_index, $total_sections, $image_source = 'ai', $business_type = '', $selected_part = '', $selected_part_type = '' ) {
        // セクションタイプを先に検出（ブロック定義のフィルタリングに使用）
        $section_type = self::detect_section_type( $section_text );
        $purpose_info = self::get_purpose_blocks_and_templates( $section_type, $business_type );

        // purpose.jsonで許可されたブロックの定義を取得
        // blocksが空の場合（テンプレートのみ）は空文字
        $has_blocks = ! empty( $purpose_info['blocks'] );
        $has_templates = ! empty( $purpose_info['templates'] );

        $block_definitions = '';
        $needs_title_block = false;
        if ( $has_blocks ) {
            $allowed_block_names = array_keys( $purpose_info['blocks'] );

            // 「見出しが無いブロック」があるか確認
            foreach ( $purpose_info['blocks'] as $block_name => $description ) {
                if ( strpos( $description, '見出しが無いブロックです' ) !== false ) {
                    $needs_title_block = true;
                    break;
                }
            }

            // 見出しブロックが必要な場合は追加
            if ( $needs_title_block && ! in_array( 'wdl/custom-title-4', $allowed_block_names, true ) ) {
                $allowed_block_names[] = 'wdl/custom-title-4';
            }

            $filtered = self::get_filtered_block_definitions( $allowed_block_names, true );

            // フィルタ結果が空の場合、purpose.jsonの説明だけでブロック生成できるようにする
            // （block.jsonにAI情報が未登録のブロックでも、purpose.jsonの情報で使用可能）
            if ( empty( $filtered['blocks'] ) ) {
                $block_definitions = '';
            } else {
                $block_definitions = json_encode( $filtered, JSON_UNESCAPED_UNICODE );
            }
        }

        // このセクションで使えるブロックの注意書きだけを渡す。
        // 全ブロック分を渡すと「リストにないブロックは使うな」という指示と
        // 矛盾する情報が同居し、AIのブロック選択を撹乱する。
        $block_constraints = self::extract_block_constraints(
            isset( $allowed_block_names ) ? $allowed_block_names : array()
        );
        $theme_colors_prompt = self::get_theme_colors_prompt();

        $image_instruction = '';
        if ( $image_source === 'none' ) {
            $placeholder_url = self::NO_IMAGE_PLACEHOLDER;
            $image_instruction = "\nbackgroundImage、imageUrl等の画像属性には、すべて以下のプレースホルダー画像URLを設定してください:\n{$placeholder_url}";
        } else {
            $image_instruction = <<<INST

## 背景画像の設定（AI生成）
画像が必要な属性（imageUrl, backgroundImage等）には、URLではなく**画像生成用のプロンプト（英語）**を設定してください。
プロンプトは50〜150文字程度の英語で、業種・シーンを具体的に記述してください。
INST;
        }

        $constraints_section = '';
        if ( ! empty( $block_constraints ) ) {
            $constraints_section = <<<CONSTRAINTS

## ブロック配置の制約事項
{$block_constraints}
CONSTRAINTS;
        }

        $business_context = '';
        if ( ! empty( $business_type ) ) {
            $business_type = self::sanitize_prompt_input( $business_type, 100 );
            $business_context = "業種: {$business_type}\n";
        }

        $position_hint = '';
        if ( $section_index === 0 ) {
            $position_hint = '（ページの最初のセクション - ファーストビューとして目を引くデザインを）';
        } elseif ( $section_index === $total_sections - 1 ) {
            $position_hint = '（ページの最後のセクション - CTAやお問い合わせを促す締めくくりを）';
        }

        // ブロック選択ガイドを構築（優先順位: 上が高い）
        // ※ $section_type と $purpose_info は関数冒頭で取得済み
        $blocks_guide = '';
        $templates_guide = '';

        if ( ! empty( $purpose_info['templates'] ) ) {
            $templates_guide = "### テンプレート（★最優先で使うこと）\n";
            $templates_guide .= "テンプレートがある場合は**必ずテンプレートを使ってください**。\n";
            $templates_guide .= "`useTemplate` に以下のテンプレート名を**そのまま正確にコピー**してください。\n";
            $templates_guide .= "**絶対にテンプレート名を変えないでください**（pr_接頭辞を追加しない、スペルを変えない等）\n\n";
            $priority = 1;
            foreach ( $purpose_info['templates'] as $template_name => $description ) {
                $templates_guide .= "{$priority}. テンプレート名: `{$template_name}` — {$description}\n";
                $priority++;
            }
            $templates_guide .= "\n";
        }

        if ( ! empty( $purpose_info['blocks'] ) ) {
            $blocks_guide = "### 単体ブロック" . ( ! empty( $purpose_info['templates'] ) ? "（テンプレートが使えない場合のみ）" : "" ) . "\n";
            $blocks_guide .= "blockNameに以下のブロック名を**そのまま正確にコピー**してください。\n\n";
            $priority = 1;
            foreach ( $purpose_info['blocks'] as $block_name => $description ) {
                $blocks_guide .= "{$priority}. ブロック名: `{$block_name}` — {$description}\n";
                $priority++;
            }
            $blocks_guide .= "\n**★絶対禁止★**: 上記リストに**ない**ブロック（例: lw-bg-1, lw-step-2, paid-block-content-3 等）は使わないでください。\n";
        }

        $purpose_label = isset( $purpose_info['label'] ) ? $purpose_info['label'] : $section_type;

        // パーツが指定されている場合は強制使用
        $forced_part_instruction = '';
        if ( ! empty( $selected_part ) ) {
            if ( $selected_part_type === 'template' ) {
                $forced_part_instruction = <<<FORCED
## ★★★ 絶対必須：指定されたテンプレートを使用 ★★★
ユーザーがパーツプレビューで「{$selected_part}」を選択しました。
**必ずこのテンプレートを使用してください。他のテンプレートやブロックは絶対に使用しないでください。**

出力形式:
```json
{
  "useTemplate": "{$selected_part}",
  "contentOverrides": { ... }
}
```
FORCED;
            } else {
                $forced_part_instruction = <<<FORCED
## ★★★ 絶対必須：指定されたブロックを使用 ★★★
ユーザーがパーツプレビューで「{$selected_part}」を選択しました。
**必ずこのブロックを使用してください。他のブロックやテンプレートは絶対に使用しないでください。**

出力形式:
```json
{
  "blocks": [
    {
      "blockName": "{$selected_part}",
      "attributes": { ... }
    }
  ]
}
```
FORCED;
            }
        }

        // テンプレートのみ or ブロックのみ or 両方に応じて指示を変更
        $usage_instruction = '';
        $skip_block_defs_in_prompt = false;

        if ( $has_templates ) {
            // テンプレートがある場合は常にテンプレート優先
            $usage_instruction = "- **テンプレートを最優先で使用してください**\n- `useTemplate: \"テンプレート名\"` 形式で出力してください";
            if ( $has_blocks ) {
                $usage_instruction .= "\n- テンプレートが合わない場合のみ、上記「単体ブロック」リストのブロックを使ってください";
            }
            // テンプレートがある場合、詳細ブロック定義は省略（プロンプト短縮 → 精度向上）
            $skip_block_defs_in_prompt = true;
        } elseif ( $has_blocks ) {
            $usage_instruction = "- 上記「単体ブロック」リストのブロックの `blocks` 配列を出力してください";
        }

        // テンプレートが1つだけの場合は強制使用（AIに選択させない）
        if ( empty( $forced_part_instruction ) && $has_templates && count( $purpose_info['templates'] ) === 1 ) {
            $only_template = array_keys( $purpose_info['templates'] )[0];
            $forced_part_instruction = "## ★★★ 絶対必須：テンプレート「{$only_template}」を使用 ★★★\nこのセクションには唯一のテンプレート `{$only_template}` があります。**必ずこのテンプレートを使用してください**。\n\n出力形式:\n```json\n{\n  \"useTemplate\": \"{$only_template}\",\n  \"contentOverrides\": { ... }\n}\n```";
        }

        // ★FVセクションの場合、業種別推奨ブロックを明記
        $fv_recommendation = '';
        if ( $section_type === 'firstview' && ! empty( $business_type ) ) {
            $bt_lower = mb_strtolower( $business_type );
            if ( mb_strpos( $bt_lower, '飲食' ) !== false || mb_strpos( $bt_lower, 'ラーメン' ) !== false || mb_strpos( $bt_lower, 'カフェ' ) !== false || mb_strpos( $bt_lower, '美容' ) !== false || mb_strpos( $bt_lower, 'サロン' ) !== false || mb_strpos( $bt_lower, 'ec' ) !== false ) {
                $fv_recommendation = "\n\n**★ この業種のFV推奨**: `wdl/lw-pr-fv-16`（大きな見出し+背景画像+CTA。ビジュアル訴求が強い業種に最適）";
            } elseif ( mb_strpos( $bt_lower, 'it' ) !== false || mb_strpos( $bt_lower, 'web' ) !== false || mb_strpos( $bt_lower, 'コンサル' ) !== false || mb_strpos( $bt_lower, '士業' ) !== false || mb_strpos( $bt_lower, '不動産' ) !== false ) {
                $fv_recommendation = "\n\n**★ この業種のFV推奨**: `wdl/fv-4` または `wdl/lw-pr-fv-15`（左寄せテキスト+画像。情報量が多い業種に最適）";
            } elseif ( mb_strpos( $bt_lower, '整体' ) !== false || mb_strpos( $bt_lower, '接骨' ) !== false || mb_strpos( $bt_lower, 'クリニック' ) !== false || mb_strpos( $bt_lower, '医療' ) !== false || mb_strpos( $bt_lower, '歯科' ) !== false ) {
                $fv_recommendation = "\n\n**★ この業種のFV推奨**: `wdl/fv-1`（中央テキスト+背景画像+CTA。信頼感重視の業種に最適）";
            }
        }

        // パーツ強制指定がある場合は選択ガイドを置き換え
        if ( ! empty( $forced_part_instruction ) ) {
            $selection_guide = $forced_part_instruction;
        } else {
            $selection_guide = <<<SELECTION_GUIDE
## ★★★ このセクションで使用するブロック/テンプレート ★★★
検出されたセクションタイプ: **{$purpose_label}**
{$business_context}

以下のリストから、**業種・コンテンツ内容・必要な要素数に最も合うもの**を選んでください。

【選び方のポイント】
1. コンテンツに画像が必要か？→ 画像付きテンプレート/ブロックを選ぶ
2. 項目数は何個か？→ カラム数が合うものを選ぶ（3項目→3カラム）
3. 説明文の長さは？→ 短い文→リスト型、長い文→カード型やコンテンツ型
4. 業種の雰囲気に合うか？→ シンプルvs装飾的、フォーマルvsカジュアル
5. **毎回同じブロックを選ばず、ページ全体でバリエーションを持たせる**
{$fv_recommendation}

{$templates_guide}{$blocks_guide}

**★重要★**:
- 上記リストにあるブロック/テンプレート**のみ**を使用してください
- リストにないブロックは使わないでください
{$usage_instruction}
SELECTION_GUIDE;
        }

        $prompt = <<<PROMPT
あなたはWordPressのGutenbergブロックを使ったページレイアウトを生成するAIです。
以下の**1つのセクション**の内容に基づいて、適切なブロック構成をJSON形式で出力してください。

## セクション情報
{$business_context}セクション {$section_index} / {$total_sections} {$position_hint}

## セクションの内容
---
{$section_text}
---

{$selection_guide}

## ★★★ 見出しが無いブロックの扱い ★★★
ブロックの説明に「見出しが無いブロックです」と記載されている場合：
- セクションにタイトル（「会社概要」「よくある質問」「料金表」など）が指定されている場合は、**先に見出しブロック `wdl/custom-title-4` を配置**してから、メインブロックを配置してください
- 見出しブロックの attributes は以下の形式で設定：
  ```json
  {
    "blockName": "wdl/custom-title-4",
    "attributes": {
      "mainTitle": "セクションタイトル（例：会社概要）",
      "subTitle": "英語サブタイトル（例：COMPANY）"
    }
  }
  ```
- セクションにタイトルが無い場合は、見出しブロックは追加しないでください

## ★★★ 重要：このセクションのみを生成すること ★★★
- 上記のセクション内容**だけ**に対応するブロックを生成してください
- 他のセクションは別途生成されるので、このセクションに集中してください
- テキスト内容は変更せず、そのまま使用してください

## 余白について
- セクションの前後に lw-space-1 を配置する必要はありません（フロントエンドで処理します）
- titleブロックの直後にはスペースを入れないでください
{$constraints_section}
{$theme_colors_prompt}

## 出力形式
PROMPT;

        // テンプレートのみの場合と、両方ある場合で出力形式を変更
        // 画像生成時のテンプレート用画像指示
        $template_image_instruction = '';
        if ( $image_source !== 'none' ) {
            $template_image_instruction = <<<TEMPLATE_IMAGE

**★★★ 画像生成（重要）★★★**
画像がテンプレートに含まれる場合、contentOverridesに以下のキーで**英語の画像生成プロンプト**を設定してください：
- `imageUrl`: メイン画像のプロンプト（例: "Professional osteopathic treatment room with warm lighting"）
- `imageUrlPc`: PC用背景画像のプロンプト（lw-pr-fv-15等で使用）
- `backgroundImage`: 背景画像のプロンプト
- 各items内の`imgUrl`: 項目ごとの画像プロンプト
- 各contents内の`image`: コンテンツブロックごとの画像プロンプト
- 各contentBlocks内の`imageUrl`: 複数コンテンツブロックの画像プロンプト
- 各testimonials内の`photo`: お客様の声の顔写真プロンプト（例: "Professional portrait of a 40-year-old Japanese businessman"）

プロンプトは50〜150文字程度の英語で、業種・シーンを具体的に記述してください。URLではなくテキストで記述すること。
TEMPLATE_IMAGE;
        }

        if ( $has_templates ) {
            $prompt .= <<<TEMPLATE_FORMAT

### テンプレートを使用する場合:

**★★★ 超重要：contentOverridesは必須です ★★★**
テンプレートにはデフォルトのダミーテキストが含まれています。
contentOverridesで**すべてのテキスト内容を上書きしないと、無関係なデフォルト文が表示されます！**

```json
{
    "useTemplate": "テンプレート名",
    "contentOverrides": {
        "mainTitle": "セクションの見出し（必須）",
        "subTitle": "サブタイトル（英語や補足）",
        "description": "FV・ヘッダーの説明文（descriptionがあるブロック用）",
        "content": "説明文・本文テキスト",
        "titleText": "ステップ系ブロックのタイトル（titleTextがあるブロック用）",
        "imageUrl": "English image prompt for main image",
        "items": [
            {"title": "項目名", "description": "説明文", "imgUrl": "English image prompt"}
        ],
        "contents": [
            {"title": "項目タイトル", "text": "項目の説明文", "image": "English image prompt"}
        ]
    }
}
```

**★ contentOverridesの必須ルール ★**

1. **mainTitle**: 必ずセクション内容から見出しを設定（「タイトル」のままにしない）
2. **subTitle**: 英語表記やサブテキストを設定（「サブタイトル」のままにしない、不要なら空文字""）
3. **description**: FV（ファーストビュー）やヘッダーブロックの説明文。必ず具体的な文章を設定
4. **titleText**: ステップ系ブロック（lw-step-1等）のタイトル。必ずセクション内容に沿った見出しを設定
5. **contents配列**: セクションに複数項目がある場合、**すべての項目**を配列で指定
   - 各項目に `title`（見出し）と `text`（説明文）を設定
   - QAブロックの場合は `text_q`（質問）と `text_a`（回答）を設定
   - セクション内容に3つの特徴があれば、3つのオブジェクトを配列に含める
6. **items配列**: リスト形式の項目がある場合、**すべての項目**を配列で指定
7. **content**: 段落テキストがある場合は設定

**例：「3つの特徴」セクションの場合**
```json
{
    "useTemplate": "pr_title_p_img_2",
    "contentOverrides": {
        "mainTitle": "当院の3つの特徴",
        "subTitle": "FEATURES",
        "contents": [
            {"title": "身体に優しいソフトな施術", "text": "ボキボキしない優しい施術で...", "image": "Gentle massage therapy"},
            {"title": "女性特有の悩みに対応", "text": "生理痛や産後ケアにも...", "image": "Women's health clinic"},
            {"title": "根本改善を目指す", "text": "一時的な緩和ではなく...", "image": "Holistic body treatment"}
        ]
    }
}
```

**例：「ご利用の流れ」セクションの場合**
```json
{
    "useTemplate": "pr_title_step_1",
    "contentOverrides": {
        "mainTitle": "ご予約から施術までの流れ",
        "subTitle": "FLOW",
        "titleText": "ご利用の流れ",
        "contents": [
            {"title": "ご予約", "text": "お電話またはWebから..."},
            {"title": "ご来院・問診", "text": "受付後、お悩みをお伺い..."},
            {"title": "施術", "text": "お一人おひとりに合わせた..."},
            {"title": "アフターケア", "text": "施術後の状態を確認..."}
        ]
    }
}
```

**例：「よくある質問」セクションの場合**
```json
{
    "useTemplate": "pr_title_qa_1",
    "contentOverrides": {
        "mainTitle": "よくあるご質問",
        "subTitle": "FAQ",
        "contents": [
            {"text_q": "施術時間はどのくらいですか？", "text_a": "初回は約60分、2回目以降は約40分を目安にしております。"},
            {"text_q": "予約は必要ですか？", "text_a": "完全予約制となっております。お電話またはWebからご予約ください。"},
            {"text_q": "駐車場はありますか？", "text_a": "専用駐車場を3台分ご用意しております。"}
        ]
    }
}
```

**例：「お客様の声」セクションの場合**
```json
{
    "useTemplate": "pr_voice_1",
    "contentOverrides": {
        "mainTitle": "お客様の声",
        "subTitle": "VOICE",
        "testimonials": [
            {"name": "田中様", "age": "30代", "job": "会社員", "excerpt": "とても丁寧な対応で...", "text": "詳細な感想文...", "photo": "Professional portrait of a 30-year-old Japanese businesswoman smiling"},
            {"name": "佐藤様", "age": "40代", "job": "自営業", "excerpt": "スピーディーな対応...", "text": "詳細な感想文...", "photo": "Friendly portrait of a 40-year-old Japanese businessman"}
        ]
    }
}
```

**例：「サービス紹介」等、複数のコンテンツブロックがあるテンプレートの場合（pr_title_content_1等）**
テンプレート内に複数の同じタイプのコンテンツブロック（paid-block-content-3等）がある場合は、`contentBlocks`配列で各ブロックの内容を順番に指定してください。
```json
{
    "useTemplate": "pr_title_content_1",
    "contentOverrides": {
        "mainTitle": "私たちのサービス",
        "subTitle": "SERVICE",
        "content": "導入文やセクション説明（段落がある場合）",
        "contentBlocks": [
            {"titleSub": "POINT 01", "title": "高品質な施術", "content": "詳しい説明文...", "imageUrl": "English image prompt for first block"},
            {"titleSub": "POINT 02", "title": "丁寧なカウンセリング", "content": "詳しい説明文...", "imageUrl": "English image prompt for second block"},
            {"titleSub": "POINT 03", "title": "アフターサポート", "content": "詳しい説明文...", "imageUrl": "English image prompt for third block"}
        ]
    }
}
```
{$template_image_instruction}

**警告**: contentOverridesを省略したり、空にしたりすると、テンプレートのデフォルト文（採用フローやWeb制作の例文など）がそのまま表示されてしまいます。必ずセクションの内容でcontentOverridesを設定してください。
TEMPLATE_FORMAT;
        }

        if ( $has_blocks && ! $skip_block_defs_in_prompt ) {
            // ブロック定義セクション（テンプレートがない場合のみ出力）
            $block_defs_section = '';
            if ( ! empty( $block_definitions ) ) {
                $block_defs_section = "\n## 利用可能なブロック詳細定義\n{$block_definitions}";
            } else {
                $block_defs_section = "\n## ★重要★ ブロック使用時の注意\n上記「単体ブロック」リストのブロック名を**そのまま正確に**使用してください。\n属性は一般的なWordPressブロック属性（mainTitle, subTitle, description, content, items, contents等）を設定してください。";
            }

            $prompt .= <<<BLOCK_FORMAT

### 単体ブロックを使用する場合:
```json
{
    "blocks": [
        {
            "blockName": "wdl/ブロック名",
            "attributes": { "属性名": "値" }
        }
    ]
}
```

**★★★ 超重要：直接ブロック使用時の注意 ★★★**
ブロック定義にあるデフォルト値やプレースホルダーテキスト（「ここに説明文が入ります」「テキストテキスト」「タイトル」等）は絶対に使用しないでください。
すべての属性（mainTitle, subTitle, description, content, titleText等）に、セクション内容に基づいた具体的なテキストを設定してください。
{$block_defs_section}
BLOCK_FORMAT;
        }

        $prompt .= <<<RULES

## ルール
1. このセクションの内容に最も適したブロックまたはテンプレートを選択してください
2. セクションのテキスト内容はそのまま使用し、勝手に変更しないでください
3. 色はvar(--color-main)等のCSS変数を使用してください
4. 各ブロックのaiNotesに記載された制約事項は必ず守ってください
5. 迷った場合は優先度の高いもの（リストの上）を選んでください
{$image_instruction}
RULES;

        // テンプレート強制の場合、プロンプト末尾に再掲（AIは末尾の指示を最重視する）
        if ( $has_templates && count( $purpose_info['templates'] ) === 1 && empty( $selected_part ) ) {
            $only_template = array_keys( $purpose_info['templates'] )[0];
            $prompt .= "\n\n★最終指示：出力は必ず `{\"useTemplate\": \"{$only_template}\", \"contentOverrides\": {...}}` の形式にしてください。blocksキーは使わないでください。★";
        }

        return $prompt;
    }

    /**
     * ブロックのスクリーンショットを見て最適化
     *
     * @param string $screenshot Base64エンコードされたスクリーンショット
     * @param string $block_name ブロック名
     * @param array $current_attributes 現在の属性
     * @param string $section_content セクションの内容
     * @return array|WP_Error 最適化結果またはエラー
     */
    public static function optimize_block( $screenshot, $block_name, $current_attributes, $section_content = '' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        // スクリーンショットからbase64データ部分を抽出
        $image_data = $screenshot;
        if ( strpos( $screenshot, 'data:image' ) === 0 ) {
            $parts = explode( ',', $screenshot );
            $image_data = isset( $parts[1] ) ? $parts[1] : $screenshot;
        }

        // MIMEタイプを推測
        $mime_type = 'image/png';
        if ( strpos( $screenshot, 'data:image/jpeg' ) === 0 ) {
            $mime_type = 'image/jpeg';
        } elseif ( strpos( $screenshot, 'data:image/webp' ) === 0 ) {
            $mime_type = 'image/webp';
        }

        $prompt = self::build_optimize_prompt( $block_name, $current_attributes, $section_content );

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array(
                            'inline_data' => array(
                                'mime_type' => $mime_type,
                                'data'      => $image_data
                            )
                        ),
                        array( 'text' => $prompt )
                    )
                )
            ),
            'generationConfig' => array(
                'temperature'     => 0.3,
                'topK'            => 40,
                'topP'            => 0.95,
                'maxOutputTokens' => 4096,
            )
        );

        $response = wp_remote_post(
            self::API_ENDPOINT . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( $request_body ),
                'timeout' => 60,
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'optimize', 'gemini-2.5-flash', $input_tokens, $output_tokens, 0 );
        }

        // JSONを抽出
        $json_text = self::extract_json( $generated_text );
        $result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            // JSONパースに失敗した場合は最適化不要として返す
            return array(
                'needsOptimization' => false,
                'message' => '解析できませんでした'
            );
        }

        return $result;
    }

    /**
     * ブロック最適化用プロンプトを構築
     *
     * @param string $block_name ブロック名
     * @param array $current_attributes 現在の属性
     * @param string $section_content セクションの内容
     * @return string プロンプト
     */
    private static function build_optimize_prompt( $block_name, $current_attributes, $section_content = '' ) {
        $attributes_json = json_encode( $current_attributes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );

        $section_info = '';
        if ( ! empty( $section_content ) ) {
            $section_info = <<<SECTION

## 元のセクション内容
{$section_content}
SECTION;
        }

        $prompt = <<<PROMPT
あなたはWebデザインの品質チェックを行うAIです。
添付された画像はWordPressのブロックエディタでレンダリングされたブロックのスクリーンショットです。

## ブロック情報
- ブロック名: {$block_name}
- 現在の属性:
```json
{$attributes_json}
```
{$section_info}

## チェックポイント
以下の問題がないか画像を確認してください：

1. **レイアウト崩れ**
   - リスト項目が中途半端な位置で切れていないか
   - カラムが崩れていないか
   - 要素が重なっていないか

2. **テキストの問題**
   - テキストが長すぎてはみ出していないか
   - テキストが短すぎて見た目が悪くないか
   - 改行が必要な箇所はないか

3. **項目数の問題**
   - items配列がある場合、項目数が多すぎ/少なすぎないか
   - グリッドレイアウトで項目数が合っていないか（例：3列なのに4項目など）

4. **見た目のバランス**
   - 全体的にバランスが取れているか
   - 余白が適切か

## 出力形式
```json
{
    "needsOptimization": true または false,
    "issues": ["問題点1", "問題点2"],
    "optimizedAttributes": {
        // 問題がある場合のみ、修正が必要な属性のみを含む
        // 例: items配列を3つに減らす、テキストを短くするなど
    },
    "message": "最適化の説明"
}
```

## ルール
1. 問題がない場合は needsOptimization: false を返す
2. 問題がある場合は、修正した属性を optimizedAttributes に含める
3. 修正する属性は必要最小限にする（変更が不要な属性は含めない）
4. テキストを変更する場合は、元の意味を保ちながら調整する
5. items配列を調整する場合は、重要な項目を残す
PROMPT;

        return $prompt;
    }

    /**
     * テキストからJSONを抽出
     *
     * @param string $text テキスト
     * @return string
     */
    private static function extract_json( $text ) {
        // マークダウンのコードブロックを除去
        $text = preg_replace( '/```json\s*/i', '', $text );
        $text = preg_replace( '/```\s*/', '', $text );

        // 前後の空白を除去
        $text = trim( $text );

        // JSONオブジェクト { } を探す
        $start = strpos( $text, '{' );
        $end = strrpos( $text, '}' );

        if ( $start !== false && $end !== false && $end > $start ) {
            $extracted = substr( $text, $start, $end - $start + 1 );
            // サニタイズしてデコードを試みる
            $sanitized = self::sanitize_json_string( $extracted );
            $decoded = json_decode( $sanitized, true );
            if ( $decoded !== null ) {
                return trim( $sanitized );
            }
            // デコード失敗時はブレースカウントで正確に抽出
            $brace_extracted = self::extract_json_by_brace_counting( $text, '{', '}' );
            if ( $brace_extracted !== null ) {
                return trim( self::sanitize_json_string( $brace_extracted ) );
            }
            // フォールバック: 元の抽出結果を使用
            $text = $extracted;
        }

        // JSON配列 [ ] を探す（オブジェクトが見つからない場合）
        if ( $start === false ) {
            $start = strpos( $text, '[' );
            $end = strrpos( $text, ']' );
            if ( $start !== false && $end !== false && $end > $start ) {
                $extracted = substr( $text, $start, $end - $start + 1 );
                $sanitized = self::sanitize_json_string( $extracted );
                $decoded = json_decode( $sanitized, true );
                if ( $decoded !== null ) {
                    return trim( $sanitized );
                }
                // ブレースカウントで正確に抽出
                $bracket_extracted = self::extract_json_by_brace_counting( $text, '[', ']' );
                if ( $bracket_extracted !== null ) {
                    return trim( self::sanitize_json_string( $bracket_extracted ) );
                }
                $text = $extracted;
            }
        }

        // 制御文字をクリーンアップ（JSONで問題になる文字を除去・変換）
        $text = self::sanitize_json_string( $text );

        return trim( $text );
    }

    /**
     * ブレースカウントによる正確なJSON抽出
     *
     * @param string $text テキスト
     * @param string $open 開きブレース（{ or [）
     * @param string $close 閉じブレース（} or ]）
     * @return string|null 抽出されたJSON文字列
     */
    private static function extract_json_by_brace_counting( $text, $open, $close ) {
        $start = strpos( $text, $open );
        if ( $start === false ) {
            return null;
        }

        $depth = 0;
        $in_string = false;
        $escape = false;
        $len = strlen( $text );

        for ( $i = $start; $i < $len; $i++ ) {
            $char = $text[ $i ];

            if ( $escape ) {
                $escape = false;
                continue;
            }

            if ( $char === '\\' && $in_string ) {
                $escape = true;
                continue;
            }

            if ( $char === '"' ) {
                $in_string = ! $in_string;
                continue;
            }

            if ( $in_string ) {
                continue;
            }

            if ( $char === $open ) {
                $depth++;
            } elseif ( $char === $close ) {
                $depth--;
                if ( $depth === 0 ) {
                    return substr( $text, $start, $i - $start + 1 );
                }
            }
        }

        return null;
    }

    /**
     * JSON文字列から制御文字を除去・変換
     *
     * @param string $text JSON文字列
     * @return string サニタイズされた文字列
     */
    private static function sanitize_json_string( $text ) {
        // 文字列内の改行を適切にエスケープ（JSON文字列値の中の改行）
        // 注意: これは文字列値の中の改行のみを処理し、JSON構造の改行は保持する

        // 不正な制御文字を除去（タブ、改行、キャリッジリターン以外）
        $text = preg_replace( '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text );

        // BOM（Byte Order Mark）を除去
        $text = preg_replace( '/^\xEF\xBB\xBF/', '', $text );

        // 文字列値内の改行を\nにエスケープ
        // "..." の中にある生の改行を検出してエスケープ
        $text = preg_replace_callback(
            '/"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"/s',
            function( $matches ) {
                $content = $matches[1];
                // 生の改行を \n に変換
                $content = str_replace( array( "\r\n", "\r", "\n" ), '\\n', $content );
                // タブを \t に変換
                $content = str_replace( "\t", '\\t', $content );
                return '"' . $content . '"';
            },
            $text
        );

        return $text;
    }

    /**
     * 参考画像を分析してレイアウト情報を取得（ステップ1）
     *
     * @param string $reference_image Base64エンコードされた画像
     * @param string $model 使用するモデル
     * @param string $user_request ユーザーのリクエスト（コンテキスト用）
     * @return array|WP_Error 分析結果またはエラー
     */
    public static function analyze_reference_image( $reference_image, $model = 'gemini-2.5-flash', $user_request = '' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'APIキーが設定されていません' );
        }

        // モデル名はURLに直結するため必ず許可リストで検証する。
        // generate_myparts 経由は検証済みだが、RESTの previewOnly 経路は
        // リクエストの model がそのままここへ届くので、この関数側でも守る。
        $allowed_models = array(
            'gemini-2.5-flash',
            'gemini-2.5-pro',
            'gemini-2.5-flash-lite',
        );
        if ( ! in_array( $model, $allowed_models, true ) ) {
            $model = 'gemini-2.5-flash';
        }

        // MIMEタイプを推測
        $mime_type = 'image/jpeg';
        if ( strpos( $reference_image, 'iVBOR' ) === 0 ) {
            $mime_type = 'image/png';
        } elseif ( strpos( $reference_image, 'R0lGOD' ) === 0 ) {
            $mime_type = 'image/gif';
        } elseif ( strpos( $reference_image, 'UklGR' ) === 0 ) {
            $mime_type = 'image/webp';
        }

        // ユーザーリクエストのコンテキストを追加
        $context_text = '';
        if ( ! empty( $user_request ) ) {
            $context_text = "\n\n## ユーザーのリクエスト（参考情報）\n「{$user_request}」\n\nこのリクエストを踏まえて、画像のレイアウトを分析してください。コンテンツの内容（例：接骨院、美容院など）は content_context に記載してください。\n";
        }

        // 画像分析用プロンプト
        $analysis_prompt = <<<PROMPT
あなたはWebデザインの専門家です。この参考画像の「レイアウト構造」を分析してください。
{$context_text}

## 重要：レイアウト構造の理解

この画像は「ファーストビュー（FV）」や「ヒーローセクション」として使われる想定です。
以下の点に注目して分析してください：

1. **背景の使い方**
   - 画像全体が1枚の背景画像として使われているか？
   - それとも背景は単色/グラデーションで、画像は別途配置されているか？
   - ほとんどのFVは「1枚の大きな背景画像 + テキストオーバーレイ」というシンプルな構造です

2. **テキストの配置**
   - 中央配置か、左寄せか、右寄せか
   - 背景画像の上に重なっているか（オーバーレイ）

3. **全体構造のパターン**
   - パターンA: 1枚の背景画像（全幅）+ 中央にテキスト + ボタン
   - パターンB: 左右分割（片側に画像、片側にテキスト）
   - パターンC: 背景色/グラデーション + 複数の小さな画像を配置

## 必ず以下のJSON形式で出力してください：
```json
{
  "content_context": "ユーザーのリクエストから推測されるサイトの目的・業種",
  "layout_pattern": "A/B/Cのいずれか（上記パターン参照）",
  "layout": {
    "type": "背景画像オーバーレイ/左右分割/中央配置/etc",
    "structure": "具体的な構造（例：全幅背景画像の上に中央配置のテキストとボタン）",
    "text_alignment": "center/left/right"
  },
  "background": {
    "type": "full_image/solid_color/gradient",
    "description": "背景の詳細説明（例：人物とインテリアが写った1枚の写真が全幅背景として使用）",
    "color": "#hex値（単色の場合）",
    "suggested_image": "ユーザーのリクエストに合わせた背景画像の説明（例：女性施術者が患者をマッサージしている明るい施術室の写真）"
  },
  "colors": {
    "background": "#hex値（背景色またはオーバーレイ色）",
    "text_primary": "#hex値",
    "text_secondary": "#hex値",
    "accent": "#hex値（ボタン等）",
    "overlay": "rgba値（背景画像の上のオーバーレイがあれば）"
  },
  "typography": {
    "heading_size": "推定サイズ（例：48px）",
    "heading_weight": "太さ（例：bold）",
    "text_alignment": "center/left/right"
  },
  "suggested_content": {
    "heading": "ユーザーのリクエストに適した見出し例（日本語）",
    "subheading": "サブ見出し例（日本語）",
    "cta_text": "CTAボタンのテキスト例（日本語）"
  },
  "css_implementation": "CSSで再現する際の具体的な実装方針（例：position:relativeの親要素に背景画像を設定し、その中にflexboxで中央配置したテキストを置く）"
}
```

重要：
- 画像内の人物や小物を「個別の要素」として分解しないでください
- 画像全体を「1枚の背景画像」として捉えてください
- ユーザーのリクエストに合わせて、background.suggested_image に適切な画像の説明を提案してください
- 色は必ず#hex形式で抽出してください
PROMPT;

        $request_body = array(
            'contents' => array(
                array(
                    'role'  => 'user',
                    'parts' => array(
                        array(
                            'inline_data' => array(
                                'mime_type' => $mime_type,
                                'data'      => $reference_image,
                            ),
                        ),
                        array( 'text' => $analysis_prompt ),
                    ),
                ),
            ),
            'generationConfig' => array(
                'temperature'     => 0.3,
                'topP'            => 0.95,
                'topK'            => 40,
                'maxOutputTokens' => 4096,
                'responseMimeType' => 'application/json',
            ),
        );

        $api_endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent';

        $response = wp_remote_post(
            $api_endpoint . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => wp_json_encode( $request_body ),
                'timeout' => 60,
            )
        );

        if ( is_wp_error( $response ) ) {
            return new WP_Error( 'api_error', '画像分析API通信エラー: ' . $response->get_error_message() );
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( isset( $data['error'] ) ) {
            return new WP_Error( 'api_error', '画像分析APIエラー: ' . $data['error']['message'] );
        }

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'parse_error', '画像分析レスポンスの解析に失敗しました' );
        }

        $response_text = $data['candidates'][0]['content']['parts'][0]['text'];
        $analysis = json_decode( $response_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            // JSONパースエラーの場合は生テキストを返す
            return array( 'raw_analysis' => $response_text );
        }

        // 使用量トラッキング
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) && isset( $data['usageMetadata'] ) ) {
            $input_tokens  = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
            $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
            // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
            $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
            LW_AI_Generator_Usage_Tracker::log_usage( 'image_analysis', $model, $input_tokens, $output_tokens, 0 );
        }

        return $analysis;
    }

    /**
     * AIで画像を生成（Imagen 3使用）
     *
     * @param string $prompt 画像生成プロンプト
     * @return string|WP_Error 画像URLまたはエラー
     */
    public static function generate_image( $prompt ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            error_log( '[LW AI Image Gen] APIキーが設定されていません' );
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        // 画像生成用のプロンプトを構築（テキスト禁止・日本人指定を強調）
        $image_prompt = "High-quality, professional photograph for a website: {$prompt}. Style: modern, clean, suitable for business website hero section or background. Photorealistic. If people appear in the image, they must be Japanese. IMPORTANT: Do NOT include any text, letters, words, numbers, watermarks, logos, or any written content in the image. The image must be purely visual with no text elements whatsoever.";

        // Imagen 3 用のリクエストボディ
        $request_body = array(
            'instances' => array(
                array(
                    'prompt' => $image_prompt
                )
            ),
            'parameters' => array(
                'sampleCount' => 1,
                'aspectRatio' => '16:9',
                'personGeneration' => 'allow_adult'
            )
        );

        // Imagen 4はx-goog-api-keyヘッダーで認証する必要がある
        $response = wp_remote_post(
            self::IMAGE_API_ENDPOINT,
            array(
                'headers' => array(
                    'Content-Type'   => 'application/json',
                    'x-goog-api-key' => $api_key,
                ),
                'body'    => json_encode( $request_body ),
                'timeout' => 120,
            )
        );

        if ( is_wp_error( $response ) ) {
            error_log( '[LW AI Image Gen] Imagen 4 通信エラー: ' . $response->get_error_message() );
            error_log( '[LW AI Image Gen] Gemini 2.0 Flash にフォールバック...' );
            return self::generate_image_with_gemini( $prompt );
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            // Imagen 4が失敗した場合、エラー詳細をログ
            $error_data = json_decode( $response_body, true );
            $error_msg = isset( $error_data['error']['message'] ) ? $error_data['error']['message'] : mb_substr( $response_body, 0, 200 );
            error_log( '[LW AI Image Gen] Imagen 4 エラー: ' . $error_msg );
            error_log( '[LW AI Image Gen] Gemini 2.0 Flash にフォールバック...' );
            return self::generate_image_with_gemini( $prompt );
        }

        $data = json_decode( $response_body, true );

        // Imagen 4のレスポンス形式で画像データを抽出
        if ( isset( $data['predictions'][0]['bytesBase64Encoded'] ) ) {
            $base64_data = $data['predictions'][0]['bytesBase64Encoded'];
            $mime_type = isset( $data['predictions'][0]['mimeType'] ) ? $data['predictions'][0]['mimeType'] : 'image/png';

            // 画像生成をトラッキング
            if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
                LW_AI_Generator_Usage_Tracker::log_usage( 'image', 'imagen-4.0', 0, 0, 1 );
            }

            // メディアライブラリに保存
            $upload_result = self::save_generated_image( $base64_data, $mime_type, $prompt );

            if ( is_wp_error( $upload_result ) ) {
                error_log( '[LW AI Image Gen] メディア保存失敗、Base64で返却: ' . $upload_result->get_error_message() );
                return 'data:' . $mime_type . ';base64,' . $base64_data;
            }

            return $upload_result;
        }

        // フォールバック: Gemini 2.0 Flashで画像生成
        error_log( '[LW AI Image Gen] Imagen 4 レスポンス形式異常、Gemini 2.0 Flash にフォールバック...' );
        error_log( '[LW AI Image Gen] Imagen 4 レスポンスキー: ' . implode( ', ', array_keys( $data ?? array() ) ) );
        return self::generate_image_with_gemini( $prompt );
    }

    /**
     * Gemini 2.0 Flash で画像を生成（フォールバック用）
     *
     * @param string $prompt 画像生成プロンプト
     * @return string|WP_Error 画像URLまたはエラー
     */
    private static function generate_image_with_gemini( $prompt ) {
        $api_key = self::get_api_key();

        self::debug_log( '[LW AI Image Gen] Gemini 2.5 Flash Image (Nano Banana) で画像生成開始...' );

        // テキスト禁止・日本人指定を強調したプロンプト
        $image_prompt = "Generate a high-quality, professional photograph for a website. The image should be: {$prompt}. Style: modern, clean, suitable for business website hero section or background. Photorealistic style preferred. If people appear in the image, they must be Japanese. CRITICAL REQUIREMENT: This image MUST NOT contain ANY text, letters, words, numbers, watermarks, logos, signs, labels, captions, or any written content whatsoever. The image must be purely visual - absolutely no text elements of any kind.";

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array(
                            'text' => $image_prompt
                        )
                    )
                )
            ),
            'generationConfig' => array(
                // Modality enum は大文字（小文字だとJSON enumパースで弾かれる）。
                // responseMimeType は画像出力と両立しないため指定しない。
                'responseModalities' => array( 'IMAGE', 'TEXT' ),
            )
        );

        // 画像出力対応モデル（Nano Banana）。素の 2.5-flash は IMAGE モダリティ非対応
        $gemini_image_endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

        $response = wp_remote_post(
            $gemini_image_endpoint,
            array(
                'headers' => array(
                    'Content-Type'   => 'application/json',
                    'x-goog-api-key' => $api_key,
                ),
                'body'    => json_encode( $request_body ),
                'timeout' => 120,
            )
        );

        if ( is_wp_error( $response ) ) {
            self::debug_log( '[LW AI Image Gen] Gemini 2.5 Flash Image 通信エラー: ' . $response->get_error_message() );
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        self::debug_log( '[LW AI Image Gen] Gemini 2.5 Flash Image レスポンス: HTTP ' . $response_code );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'API画像生成エラーが発生しました';
            self::debug_log( '[LW AI Image Gen] Gemini 2.5 Flash Image エラー: ' . $error_message );
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        // Geminiのレスポンス形式で画像データを抽出
        if ( isset( $data['candidates'][0]['content']['parts'] ) ) {
            foreach ( $data['candidates'][0]['content']['parts'] as $part ) {
                if ( isset( $part['inlineData'] ) ) {
                    $mime_type = $part['inlineData']['mimeType'];
                    $base64_data = $part['inlineData']['data'];

                    // 画像生成をトラッキング
                    if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
                        LW_AI_Generator_Usage_Tracker::log_usage( 'image', 'gemini-2.5-flash-image', 0, 0, 1 );
                    }

                    self::debug_log( '[LW AI Image Gen] Gemini 2.5 Flash Image 成功！画像生成完了' );

                    $upload_result = self::save_generated_image( $base64_data, $mime_type, $prompt );

                    if ( is_wp_error( $upload_result ) ) {
                        return 'data:' . $mime_type . ';base64,' . $base64_data;
                    }

                    return $upload_result;
                }
            }
        }

        return new WP_Error( 'no_image', 'AIから画像が生成されませんでした' );
    }

    /**
     * 生成された画像をメディアライブラリに保存
     *
     * @param string $base64_data Base64エンコードされた画像データ
     * @param string $mime_type MIMEタイプ
     * @param string $prompt 生成プロンプト（ファイル名用）
     * @return string|WP_Error 画像URLまたはエラー
     */
    private static function save_generated_image( $base64_data, $mime_type, $prompt ) {
        self::debug_log( '[LW AI Image] Starting image save process' );

        // 拡張子を決定
        $extension = 'png';
        if ( strpos( $mime_type, 'jpeg' ) !== false || strpos( $mime_type, 'jpg' ) !== false ) {
            $extension = 'jpg';
        } elseif ( strpos( $mime_type, 'webp' ) !== false ) {
            $extension = 'webp';
        }

        // ファイル名を生成（日本語を避けてランダム文字列を使用）
        $filename = 'ai-generated-' . wp_generate_password( 12, false, false ) . '-' . time() . '.' . $extension;

        self::debug_log( '[LW AI Image] Generated filename: ' . $filename );

        // 画像データをデコード
        $image_data = base64_decode( $base64_data );

        if ( $image_data === false ) {
            self::debug_log( '[LW AI Image] ERROR: Failed to decode base64 data' );
            return new WP_Error( 'decode_error', '画像データのデコードに失敗しました' );
        }

        self::debug_log( '[LW AI Image] Base64 decoded successfully, size: ' . strlen( $image_data ) . ' bytes' );

        // アップロードディレクトリを取得
        $upload_dir = wp_upload_dir();

        if ( isset( $upload_dir['error'] ) && $upload_dir['error'] ) {
            self::debug_log( '[LW AI Image] ERROR: Upload dir error: ' . $upload_dir['error'] );
            return new WP_Error( 'upload_dir_error', $upload_dir['error'] );
        }

        self::debug_log( '[LW AI Image] Upload dir path: ' . $upload_dir['path'] );
        self::debug_log( '[LW AI Image] Upload dir URL: ' . $upload_dir['url'] );

        // ディレクトリが存在するか確認、なければ作成
        if ( ! file_exists( $upload_dir['path'] ) ) {
            wp_mkdir_p( $upload_dir['path'] );
            self::debug_log( '[LW AI Image] Created upload directory: ' . $upload_dir['path'] );
        }

        // ファイルパス
        $file_path = $upload_dir['path'] . '/' . $filename;

        self::debug_log( '[LW AI Image] Full file path: ' . $file_path );

        // ファイルを保存
        $result = file_put_contents( $file_path, $image_data );

        if ( $result === false ) {
            self::debug_log( '[LW AI Image] ERROR: file_put_contents failed for: ' . $file_path );
            return new WP_Error( 'save_error', 'ファイルの保存に失敗しました: ' . $file_path );
        }

        self::debug_log( '[LW AI Image] File saved successfully, bytes written: ' . $result );

        // ファイルが実際に存在するか確認
        if ( ! file_exists( $file_path ) ) {
            self::debug_log( '[LW AI Image] ERROR: File does not exist after save: ' . $file_path );
            return new WP_Error( 'save_error', 'ファイルが保存されませんでした' );
        }

        self::debug_log( '[LW AI Image] File exists confirmed: ' . $file_path );

        // ファイルタイプをチェック
        $file_type = wp_check_filetype( $filename, null );

        if ( empty( $file_type['type'] ) ) {
            $file_type['type'] = $mime_type;
        }

        self::debug_log( '[LW AI Image] File type: ' . $file_type['type'] );

        // 添付ファイルデータを準備
        $attachment = array(
            'post_mime_type' => $file_type['type'],
            'post_title'     => sanitize_file_name( $filename ),
            'post_content'   => '',
            'post_status'    => 'inherit'
        );

        // 添付ファイルをデータベースに挿入
        $attach_id = wp_insert_attachment( $attachment, $file_path );

        if ( is_wp_error( $attach_id ) ) {
            self::debug_log( '[LW AI Image] ERROR: wp_insert_attachment failed: ' . $attach_id->get_error_message() );
            return $attach_id;
        }

        self::debug_log( '[LW AI Image] Attachment ID: ' . $attach_id );

        // 添付ファイルのメタデータを生成して保存
        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        $attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );
        wp_update_attachment_metadata( $attach_id, $attach_data );

        // 画像URLを取得
        $image_url = wp_get_attachment_url( $attach_id );

        self::debug_log( '[LW AI Image] Final image URL: ' . $image_url );

        return $image_url;
    }

    /**
     * 単一ブロックの定義を取得
     *
     * @param string $block_name ブロック名（例: wdl/fv-1）
     * @return array|null
     */
    public static function get_single_block_definition( $block_name ) {
        $all_blocks = LW_AI_Generator_Block_Settings::get_all_blocks();

        if ( empty( $all_blocks ) ) {
            return null;
        }

        foreach ( $all_blocks as $block ) {
            if ( isset( $block['name'] ) && $block['name'] === $block_name ) {
                return $block;
            }
        }

        return null;
    }

    /**
     * ブロックのJSファイルからUI情報（ラベル、セクション名）を抽出
     *
     * @param string $block_name ブロック名（例：wdl/cta-1）
     * @return array UI情報（sections配列）
     */
    public static function get_block_ui_info( $block_name ) {
        // ブロック名からディレクトリ名を取得（wdl/cta-1 → cta-1）
        $block_slug = str_replace( 'wdl/', '', $block_name );

        // JSファイルのパスを構築
        $js_path = get_template_directory() . '/my-blocks/build/' . $block_slug . '/' . $block_slug . '.js';

        if ( ! file_exists( $js_path ) ) {
            return array();
        }

        $js_content = file_get_contents( $js_path );
        if ( empty( $js_content ) ) {
            return array();
        }

        $ui_info = array(
            'sections' => array(),
            'controls' => array()
        );

        // Unicodeエスケープを日本語に変換
        $js_content = preg_replace_callback(
            '/\\\\u([0-9a-fA-F]{4})/',
            function( $matches ) {
                return mb_convert_encoding( pack( 'H*', $matches[1] ), 'UTF-8', 'UTF-16BE' );
            },
            $js_content
        );

        // PanelBodyのtitle（セクション名）を抽出
        if ( preg_match_all( '/PanelBody[^}]*?title:\s*["\']([^"\']+)["\']/', $js_content, $matches ) ) {
            $ui_info['sections'] = array_unique( $matches[1] );
        }

        // 各種コントロールのlabelを抽出
        $control_patterns = array(
            'TextControl'    => '/TextControl[^}]*?label:\s*["\']([^"\']+)["\']/',
            'RangeControl'   => '/RangeControl[^}]*?label:\s*["\']([^"\']+)["\']/',
            'SelectControl'  => '/SelectControl[^}]*?label:\s*["\']([^"\']+)["\']/',
            'ToggleControl'  => '/ToggleControl[^}]*?label:\s*["\']([^"\']+)["\']/',
            'TextareaControl' => '/TextareaControl[^}]*?label:\s*["\']([^"\']+)["\']/',
        );

        foreach ( $control_patterns as $control_type => $pattern ) {
            if ( preg_match_all( $pattern, $js_content, $matches ) ) {
                foreach ( $matches[1] as $label ) {
                    $ui_info['controls'][] = array(
                        'type'  => $control_type,
                        'label' => $label
                    );
                }
            }
        }

        // ColorPicker（色選択）の存在を確認
        if ( strpos( $js_content, 'ColorPicker' ) !== false ) {
            // ColorPickerの前後のコンテキストからセクション名を推測
            $ui_info['controls'][] = array(
                'type'  => 'ColorPicker',
                'label' => '色選択'
            );
        }

        return $ui_info;
    }

    /**
     * ブロック単体への指示を処理
     *
     * @param string $block_name ブロック名
     * @param array  $block_definition ブロック定義
     * @param array  $current_attributes 現在の属性
     * @param string $instruction ユーザーの指示
     * @param array  $chat_history チャット履歴
     * @return array|WP_Error
     */
    public static function process_block_instruction( $block_name, $block_definition, $current_attributes, $instruction, $chat_history = array() ) {
        $prompt = self::build_block_instruction_prompt( $block_name, $block_definition, $current_attributes, $instruction, $chat_history );

        $api_result = self::call_gemini_text_api( $prompt, array(
            'maxOutputTokens' => 4096,
            'usage_label'     => 'block_instruction',
        ) );

        if ( is_wp_error( $api_result ) ) {
            return $api_result;
        }

        $result = self::parse_json_response( $api_result, 'ブロック指示' );
        if ( is_wp_error( $result ) ) {
            // JSONパースに失敗した場合、テキストのみの応答として扱う
            return array(
                'response'          => $api_result['text'],
                'updatedAttributes' => array(),
            );
        }

        return array(
            'response'          => isset( $result['response'] ) ? $result['response'] : '',
            'updatedAttributes' => isset( $result['updatedAttributes'] ) ? $result['updatedAttributes'] : array(),
        );
    }

    /**
     * ブロック単体指示用のプロンプトを構築
     *
     * @param string $block_name ブロック名
     * @param array  $block_definition ブロック定義
     * @param array  $current_attributes 現在の属性
     * @param string $instruction ユーザーの指示
     * @param array  $chat_history チャット履歴
     * @return string
     */
    private static function build_block_instruction_prompt( $block_name, $block_definition, $current_attributes, $instruction, $chat_history = array() ) {
        $block_title = isset( $block_definition['title'] ) ? $block_definition['title'] : $block_name;
        $current_attrs_json = json_encode( $current_attributes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );

        // ★ ブロックレベルの説明（aiDescription, aiNotes）を取得
        $block_description = '';
        if ( ! empty( $block_definition['aiDescription'] ) ) {
            $block_description .= "**ブロックの説明**: " . $block_definition['aiDescription'] . "\n";
        }
        if ( ! empty( $block_definition['aiNotes'] ) ) {
            $block_description .= "**注意事項**: " . $block_definition['aiNotes'] . "\n";
        }

        // ★ JSファイルからUI情報（サイドバーのセクション名・ラベル）を取得
        $ui_info = self::get_block_ui_info( $block_name );
        $sidebar_info = '';
        if ( ! empty( $ui_info['sections'] ) || ! empty( $ui_info['controls'] ) ) {
            $sidebar_info = "\n## 右側の設定メニュー（ユーザーが手動で変更できる場所）\n";
            $sidebar_info .= "ユーザーが「どこで設定できますか？」と聞いた場合、「右側の『〇〇』→『△△』で変更できます」と案内してください。\n\n";

            if ( ! empty( $ui_info['sections'] ) ) {
                $sidebar_info .= "**メニュー名:**\n";
                foreach ( $ui_info['sections'] as $section ) {
                    $sidebar_info .= "- 「{$section}」\n";
                }
                $sidebar_info .= "\n";
            }

            if ( ! empty( $ui_info['controls'] ) ) {
                $sidebar_info .= "**項目名:**\n";
                foreach ( $ui_info['controls'] as $control ) {
                    $sidebar_info .= "- {$control['label']}\n";
                }
            }
        }

        // ★ 各属性のai_descriptionを整形して抽出
        $attributes_info = '';
        $image_attributes = array();
        if ( isset( $block_definition['attributes'] ) && is_array( $block_definition['attributes'] ) ) {
            foreach ( $block_definition['attributes'] as $attr_name => $attr_def ) {
                $type = isset( $attr_def['type'] ) ? $attr_def['type'] : 'string';
                $default = isset( $attr_def['default'] ) ? $attr_def['default'] : '';
                $ai_desc = isset( $attr_def['ai_description'] ) ? $attr_def['ai_description'] : '';

                // 属性情報を構築
                $default_str = is_array( $default ) ? json_encode( $default, JSON_UNESCAPED_UNICODE ) : (string) $default;
                if ( strlen( $default_str ) > 50 ) {
                    $default_str = mb_substr( $default_str, 0, 50 ) . '...';
                }

                $attributes_info .= "- **{$attr_name}** ({$type})";
                if ( $default_str !== '' ) {
                    $attributes_info .= " [デフォルト: {$default_str}]";
                }
                $attributes_info .= "\n";
                if ( $ai_desc ) {
                    $attributes_info .= "  → {$ai_desc}\n";
                }

                // 画像属性を特定
                if ( strpos( strtolower( $attr_name ), 'image' ) !== false ||
                     strpos( strtolower( $attr_name ), 'img' ) !== false ||
                     strpos( strtolower( $attr_name ), 'background' ) !== false ) {
                    $image_attributes[] = $attr_name;
                }
            }
        }

        $image_instruction = '';
        if ( ! empty( $image_attributes ) ) {
            $image_attrs_str = implode( ', ', $image_attributes );
            $image_instruction = <<<IMG

## ★★★ 画像の設定について（重要） ★★★
このブロックには以下の画像関連属性があります: {$image_attrs_str}

**ユーザーが画像を変更したい場合**（例: 「海の画像にして」「ビジネスっぽい画像に」「背景を夕焼けに」）:
1. 該当する画像属性に、生成したい画像の**日本語の説明文**を設定してください
2. この説明文はAI画像生成のプロンプトとして使用されます
3. 良い説明文の例:
   - 「美しい海岸の風景、青い空と白い砂浜」
   - 「モダンなオフィスでミーティング中のビジネスパーソン」
   - 「夕焼けに染まる山々のシルエット」

**具体例:**
- ユーザー「海の画像にして」→ "imageUrl": "美しい海岸の風景、青い空と白い砂浜、高品質な写真"
- ユーザー「ビジネスっぽく」→ "backgroundImage": "モダンなオフィス、プロフェッショナルな雰囲気"
- ユーザー「自然な感じで」→ "imgUrl": "緑豊かな森林、木漏れ日が差し込む自然風景"

**注意**: URLではなく説明文を入れてください。画像は自動的に生成されます。
IMG;
        }

        // チャット履歴を構築
        $history_text = '';
        if ( ! empty( $chat_history ) ) {
            $history_text = "\n## これまでの会話履歴\n";
            foreach ( $chat_history as $chat ) {
                $role = $chat['isUser'] ? 'ユーザー' : 'AI';
                $history_text .= "**{$role}**: {$chat['message']}\n\n";
            }
        }

        // ユーティリティクラスの説明
        $utility_classes_info = self::get_utility_classes_info();

        $prompt = <<<PROMPT
あなたはWordPressのGutenbergブロックのアシスタントAIです。
ユーザーが選択中のブロックに対して指示を出します。その指示に基づいて適切に応答してください。

## 対象ブロック
- 名前: {$block_name}
- タイトル: {$block_title}
{$block_description}

## このブロックで設定可能な属性一覧
各属性には説明（→）が付いています。この説明を参考に、ユーザーの要望に適切に対応してください。

{$attributes_info}
{$sidebar_info}

## 現在の属性値
{$current_attrs_json}
{$image_instruction}
{$history_text}

## ユーザーの指示
{$instruction}

## ★★★ 重要：スタイル変更の方法 ★★★

### 方法1: 専用属性がある場合
ブロックに専用の属性（例: titleColor, fontSize など）がある場合は、その属性を直接変更してください。

### 方法2: 専用属性がない場合 → className または style 属性を使用
ブロックに専用属性がない場合でも、以下の方法でスタイルを変更できます：

#### A) className属性にユーティリティクラスを追加
{$utility_classes_info}

**classNameの更新方法:**
- 現在のclassNameに新しいクラスを追加（スペース区切り）
- 既存のクラスを削除する場合は、そのクラスを除外した文字列を返す
- 例: 現在 "my-block" → "my-block fs-1-5 fw-700" に変更

#### B) style属性にインラインスタイルを追加
専用属性もユーティリティクラスもない場合は、style属性を使用：
- style属性はオブジェクト形式で指定
- 例: "style": { "color": "#ff0000", "backgroundColor": "#f0f0f0" }

### スタイル変更の優先順位
1. まず専用属性があるか確認 → あれば使用
2. なければユーティリティクラス（className）を使用
3. それでも対応できない場合はstyle属性を使用

## 応答ルール
1. ユーザーの指示を理解し、このブロックで**できること**と**できないこと**を判断してください
2. 可能な場合は、属性を変更するためのJSON形式で updatedAttributes を返してください
3. **★重要★ できないことは明確に「できません」と伝えてください**。曖昧にせず、はっきりと「このブロックではその機能はサポートされていません」「この設定項目はありません」など理由を添えて断ってください。代替案がある場合のみ提案してください
4. 「何ができる？」などの質問には、このブロックで設定できる主な項目を説明してください
5. 応答は日本語で、親しみやすく丁寧にしてください
6. **★重要★ 確認を求めずに即座に実行してください。「よろしいでしょうか？」「変更しますか？」などの確認は不要です。変更を実行したら「〇〇を変更しました」と完了形で報告してください**
7. **★重要★ ユーザーへの応答では技術的な属性名（titleFontWeight、descriptionColor等）を使わないでください。代わりに「タイトルの太さ」「説明文の色」など、一般ユーザーが分かる日本語で説明してください。属性名はupdatedAttributesのJSONのみで使用します**
8. **複数の選択肢がある場合は、ユーザーに質問せず、最も一般的・自然な選択肢を選んで実行してください。例：「太文字にして」→ 全てのテキスト要素を太くする**
9. **存在しない属性や機能を勝手に作らないでください**。属性一覧にないものは変更できません
10. **「どこで設定できますか？」「色の変更はどこ？」などの質問**には、2つの方法を分けて案内してください：
    - **手動で設定する場合**: 「右側の『〇〇』→『△△』で変更できます」
    - **AIに任せる場合**: 「私にお任せいただく場合は『〇〇にして』と指示してください」
    例: 「画像は右側の『画像の設定』で変更できます。もしくは、私に『海の画像にして』のように指示していただければ自動で設定します」

## 出力形式
以下のJSON形式で出力してください。JSONのみを出力し、他の説明は不要です。

```json
{
    "response": "ユーザーへの応答メッセージ（できる/できない、変更内容の説明など）",
    "updatedAttributes": {
        "変更する属性名": "新しい値"
    }
}
```

変更がない場合や質問への回答の場合は updatedAttributes を空のオブジェクト {} にしてください。

## 注意事項
- 属性名は正確に使用してください（大文字小文字を区別）
- 色の値は16進数（例: #FF0000）またはCSS変数（例: var(--color-main)）で指定
- 数値の属性には数値を、文字列の属性には文字列を設定してください
- items配列の属性は、配列全体を返すか、変更しない場合は含めないでください
- classNameを変更する場合は、既存のクラスを保持しつつ新しいクラスを追加してください
PROMPT;

        return $prompt;
    }

    /**
     * テキスト装飾を処理
     *
     * @param string $instruction ユーザーの指示
     * @param string $selected_text 選択されたテキスト
     * @return array|WP_Error
     */
    public static function process_text_decoration( $instruction, $selected_text = '' ) {
        $prompt = self::build_text_decoration_prompt( $instruction, $selected_text );

        $api_result = self::call_gemini_text_api( $prompt, array(
            'temperature'     => 0.3,
            'maxOutputTokens' => 1024,
            'timeout'         => 30,
            'usage_label'     => 'text_decoration',
        ) );

        return self::parse_json_response( $api_result, 'テキスト装飾' );
    }

    /**
     * テキスト装飾用のプロンプトを構築
     *
     * @param string $instruction ユーザーの指示
     * @param string $selected_text 選択されたテキスト
     * @return string
     */
    private static function build_text_decoration_prompt( $instruction, $selected_text = '' ) {
        $prompt = <<<PROMPT
あなたはテキストスタイリングとライティングの専門家です。
ユーザーの指示に基づいて、選択されたテキストに対する処理を決定してください。

## 選択されたテキスト
"{$selected_text}"

## ユーザーの指示
{$instruction}

## 処理タイプの判定
まず、ユーザーの指示が以下のどちらかを判断してください：

1. **スタイル変更**: 色、サイズ、太さ、下線、フォントなどの見た目の変更
   - 例: 「赤くして」「大きくして」「太くして」「マーカーつけて」「明朝体にして」

2. **テキスト変更**: テキスト内容自体の変更
   - 例: 「英語に翻訳して」「もっと丁寧に」「短くして」「キャッチコピー風に」「敬語にして」「カジュアルに」

## スタイル変更の場合

### 利用可能なユーティリティクラス

#### 色の変更（style属性で直接指定）
- 赤: color: #e53935
- 青: color: #1976d2
- 緑: color: #43a047
- オレンジ: color: #ff9800
- ピンク: color: #e91e63
- 紫: color: #9c27b0
- メインカラー: color: var(--color-main)
- アクセントカラー: color: var(--color-accent)

#### フォントサイズ（classNameで指定）
- 小さく: fs-0-8
- 少し小さく: fs-0-9
- 普通: fs-1
- 少し大きく: fs-1-1 または fs-1-2
- 大きく: fs-1-3 または fs-1-5
- かなり大きく: fs-2
- とても大きく: fs-2-5 または fs-3

#### フォントウェイト（classNameで指定）
- 細く: fw-300
- 普通: fw-400
- 少し太く: fw-500
- 太く: fw-600 または fw-700
- かなり太く: fw-800 または fw-900

#### 下線・マーカー（classNameで指定）
- 黄色マーカー: u-line-1-yellow
- ピンクマーカー: u-line-1-pink
- 赤下線: u-line-1-red
- 青下線: u-line-1-blue
- 緑下線: u-line-1-green
- オレンジ下線: u-line-1-orange
- メインカラー下線: u-line-1-main
- アクセントカラー下線: u-line-1-accent
- 背景ハイライト（タイプ3）: u-line-3-yellow, u-line-3-pink など

#### 文字の縁取り（classNameで指定、custom-font-settingsクラスも必要）
- 白縁: lw-outline-2 lw-outline-color-white
- 赤縁: lw-outline-2 lw-outline-color-red
- メインカラー縁: lw-outline-2 lw-outline-color-main

#### フォントファミリー（dataAttributesで指定）
- 明朝体: lw_font_set: "Noto Serif JP"
- ゴシック: lw_font_set: "Noto Sans JP"
- 丸ゴシック: lw_font_set: "M PLUS Rounded 1c"

## 出力形式
以下のJSON形式で出力してください。JSONのみを出力し、他の説明は不要です。

```json
{
    "type": "style" または "text",
    "className": "適用するクラス（スタイル変更時のみ、スペース区切りで複数可）",
    "style": "インラインスタイル（スタイル変更時のみ）",
    "dataAttributes": {
        "lw_font_set": "フォント名（フォント変更時のみ）"
    },
    "newText": "変更後のテキスト（テキスト変更時のみ）"
}
```

## ルール
1. type は必ず "style" または "text" を指定
2. スタイル変更の場合:
   - 色の変更はstyle属性を使用
   - サイズ、太さ、下線などはclassNameを使用
   - フォント変更はdataAttributesのlw_font_setを使用
   - classNameは必ず "custom-font-settings" を含める
   - newTextは空文字""にする
3. テキスト変更の場合:
   - newTextに変更後のテキストを指定
   - className, style, dataAttributesは空にする
4. 不要なプロパティは空文字""または空オブジェクト{}にする

## 例

### スタイル変更の例
指示: 「赤くして」
出力: {"type": "style", "className": "custom-font-settings", "style": "color: #e53935;", "dataAttributes": {}, "newText": ""}

指示: 「大きく太くして」
出力: {"type": "style", "className": "custom-font-settings fs-1-5 fw-700", "style": "", "dataAttributes": {}, "newText": ""}

### テキスト変更の例
指示: 「英語に翻訳して」
選択テキスト: 「こんにちは」
出力: {"type": "text", "className": "", "style": "", "dataAttributes": {}, "newText": "Hello"}

指示: 「もっと丁寧な表現に」
選択テキスト: 「確認してください」
出力: {"type": "text", "className": "", "style": "", "dataAttributes": {}, "newText": "ご確認いただけますと幸いです"}

指示: 「キャッチコピー風に」
選択テキスト: 「美味しいコーヒー」
出力: {"type": "text", "className": "", "style": "", "dataAttributes": {}, "newText": "至福の一杯、極上のコーヒー体験"}

指示: 「短くして」
選択テキスト: 「私たちは最高品質のサービスを提供することをお約束いたします」
出力: {"type": "text", "className": "", "style": "", "dataAttributes": {}, "newText": "最高品質をお約束"}
PROMPT;

        return $prompt;
    }

    /**
     * 自動マーカー処理（AIが重要部分を判断してマーカーを付ける）
     *
     * @param string $text 対象のテキスト（HTMLタグを含む可能性あり）
     * @param string $highlight_style マーカースタイル（marker, color, bold）
     * @return string|WP_Error マーカー付きHTML
     */
    public static function process_auto_highlight( $text, $highlight_style = 'marker' ) {
        self::debug_log( '[LW AI Auto Highlight] process_auto_highlight called' );
        self::debug_log( '[LW AI Auto Highlight] text: ' . $text );
        self::debug_log( '[LW AI Auto Highlight] style: ' . $highlight_style );

        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        $prompt = self::build_auto_highlight_prompt( $text, $highlight_style );

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array(
                            'text' => $prompt
                        )
                    )
                )
            ),
            'generationConfig' => array(
                'temperature'     => 0.3,
                'topK'            => 20,
                'topP'            => 0.9,
                'maxOutputTokens' => 2048,
            )
        );

        $response = wp_remote_post(
            self::API_ENDPOINT . '?key=' . $api_key,
            array(
                'headers' => array(
                    'Content-Type' => 'application/json',
                ),
                'body'    => json_encode( $request_body ),
                'timeout' => 30,
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        self::debug_log( '[LW AI Auto Highlight] Generated (phrases): ' . $generated_text );

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'auto_highlight', 'gemini-2.5-flash', $input_tokens, $output_tokens, 0 );
        }

        // JSONを抽出してパース
        $json_text = self::extract_json( $generated_text );
        $phrases = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE || ! is_array( $phrases ) ) {
            self::debug_log( '[LW AI Auto Highlight] JSON parse error: ' . json_last_error_msg() );
            return new WP_Error( 'json_parse_error', 'AIの応答をパースできませんでした' );
        }

        self::debug_log( '[LW AI Auto Highlight] Phrases to highlight: ' . print_r( $phrases, true ) );

        // 重要フレーズを元のHTMLに適用（既存のスタイルを保持）
        $result_html = self::apply_highlights_to_html( $text, $phrases, $highlight_style );

        self::debug_log( '[LW AI Auto Highlight] Result HTML: ' . $result_html );

        return $result_html;
    }

    /**
     * 複数スタイル対応の自動マーカー処理
     * AIを1回だけ呼び出してフレーズを取得し、複数スタイルを順番に適用
     *
     * @param string $text 対象のテキスト
     * @param array  $styles スタイルの配列（例: ['marker', 'bold', 'color-red']）
     * @return string|WP_Error マーカー付きHTML
     */
    public static function process_auto_highlight_multi( $text, $styles ) {
        self::debug_log( '[LW AI Auto Highlight Multi] Called with styles: ' . print_r( $styles, true ) );
        self::debug_log( '[LW AI Auto Highlight Multi] text: ' . $text );

        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        // AIを1回だけ呼び出してフレーズを取得
        $prompt = self::build_auto_highlight_prompt( $text, $styles[0] );

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $prompt ),
                    ),
                ),
            ),
            'generationConfig' => array(
                'temperature'     => 0.3,
                'topK'            => 40,
                'topP'            => 0.95,
                'maxOutputTokens' => 500,
            ),
        );

        $response = wp_remote_post(
            self::API_ENDPOINT . '?key=' . $api_key,
            array(
                'headers' => array(
                    'Content-Type' => 'application/json',
                ),
                'body'    => json_encode( $request_body ),
                'timeout' => 60,
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        self::debug_log( '[LW AI Auto Highlight Multi] Generated (phrases): ' . $generated_text );

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'auto_highlight_multi', 'gemini-2.5-flash', $input_tokens, $output_tokens, 0 );
        }

        // JSONを抽出してパース
        $json_text = self::extract_json( $generated_text );
        $phrases = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE || ! is_array( $phrases ) ) {
            self::debug_log( '[LW AI Auto Highlight Multi] JSON parse error: ' . json_last_error_msg() );
            return new WP_Error( 'json_parse_error', 'AIの応答をパースできませんでした' );
        }

        self::debug_log( '[LW AI Auto Highlight Multi] Phrases to highlight: ' . print_r( $phrases, true ) );

        // 同じフレーズに対して複数スタイルを順番に適用
        $result_html = $text;
        foreach ( $styles as $style ) {
            self::debug_log( '[LW AI Auto Highlight Multi] Applying style: ' . $style );
            $result_html = self::apply_highlights_to_html( $result_html, $phrases, $style );
        }

        self::debug_log( '[LW AI Auto Highlight Multi] Final HTML: ' . $result_html );

        return $result_html;
    }

    /**
     * テキスト生成（Web検索オプション付き）
     *
     * @param string $original_text 元のテキスト
     * @param string $prompt ユーザーの指示
     * @param bool   $use_web_search Web検索を使用するか
     * @param string $tone 口調（polite, plain, casual, business, friendly）
     * @param bool   $is_new_generation 新規生成モード（元テキストなし）
     * @return string|WP_Error 生成されたテキスト
     */
    public static function generate_text( $original_text, $prompt, $use_web_search = false, $tone = '', $is_new_generation = false ) {
        self::debug_log( '[LW AI Generate Text] Called' );
        self::debug_log( '[LW AI Generate Text] Original text: ' . $original_text );
        self::debug_log( '[LW AI Generate Text] Prompt: ' . $prompt );
        self::debug_log( '[LW AI Generate Text] Use web search: ' . ( $use_web_search ? 'yes' : 'no' ) );
        self::debug_log( '[LW AI Generate Text] Tone: ' . ( $tone ? $tone : 'none' ) );
        self::debug_log( '[LW AI Generate Text] Is new generation: ' . ( $is_new_generation ? 'yes' : 'no' ) );

        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        // Web検索が有効な場合、Gemini 2.0のGrounding機能を使用
        $system_prompt = self::build_text_generation_prompt( $original_text, $prompt, $tone, $is_new_generation );

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $system_prompt ),
                    ),
                ),
            ),
            'generationConfig' => array(
                'temperature'     => 0.7,
                'topK'            => 40,
                'topP'            => 0.95,
                'maxOutputTokens' => 2000,
            ),
        );

        // Web検索が有効な場合、Google検索のGroundingを追加
        if ( $use_web_search ) {
            $request_body['tools'] = array(
                array(
                    'google_search' => new stdClass(),
                ),
            );
        }

        $response = wp_remote_post(
            self::API_ENDPOINT . '?key=' . $api_key,
            array(
                'headers' => array(
                    'Content-Type' => 'application/json',
                ),
                'body'    => json_encode( $request_body ),
                'timeout' => 90,
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        self::debug_log( '[LW AI Generate Text] Response code: ' . $response_code );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            self::debug_log( '[LW AI Generate Text] API Error: ' . $error_message );
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        self::debug_log( '[LW AI Generate Text] Generated: ' . $generated_text );

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'generate_text', 'gemini-2.5-flash', $input_tokens, $output_tokens, 0 );
        }

        // テキストのみを返す（余分な説明は削除）
        $generated_text = trim( $generated_text );

        // Web検索が使用された場合、検索ソース情報を取得
        $search_sources = array();
        if ( $use_web_search && isset( $data['candidates'][0]['groundingMetadata'] ) ) {
            $grounding = $data['candidates'][0]['groundingMetadata'];
            self::debug_log( '[LW AI Generate Text] Grounding metadata: ' . print_r( $grounding, true ) );

            // 検索クエリ
            if ( isset( $grounding['webSearchQueries'] ) ) {
                self::debug_log( '[LW AI Generate Text] Web search queries: ' . print_r( $grounding['webSearchQueries'], true ) );
            }

            // 検索結果のソース
            if ( isset( $grounding['groundingChunks'] ) ) {
                foreach ( $grounding['groundingChunks'] as $chunk ) {
                    if ( isset( $chunk['web'] ) ) {
                        $search_sources[] = array(
                            'title' => isset( $chunk['web']['title'] ) ? $chunk['web']['title'] : '',
                            'uri'   => isset( $chunk['web']['uri'] ) ? $chunk['web']['uri'] : '',
                        );
                    }
                }
            }

            // 検索エントリ（別の形式）
            if ( isset( $grounding['groundingSupports'] ) ) {
                foreach ( $grounding['groundingSupports'] as $support ) {
                    if ( isset( $support['groundingChunkIndices'] ) ) {
                        self::debug_log( '[LW AI Generate Text] Grounding support indices: ' . print_r( $support['groundingChunkIndices'], true ) );
                    }
                }
            }

            // searchEntryPointも確認
            if ( isset( $grounding['searchEntryPoint'] ) && isset( $grounding['searchEntryPoint']['renderedContent'] ) ) {
                self::debug_log( '[LW AI Generate Text] Search entry point rendered content available' );
            }
        }

        // 検索ソースがある場合は配列で返す
        if ( ! empty( $search_sources ) ) {
            return array(
                'text'    => $generated_text,
                'sources' => $search_sources,
            );
        }

        return $generated_text;
    }

    /**
     * テキスト生成用のプロンプトを構築
     *
     * @param string $original_text 元のテキスト
     * @param string $prompt ユーザーの指示
     * @param string $tone 口調
     * @param bool   $is_new_generation 新規生成モード
     * @return string プロンプト
     */
    private static function build_text_generation_prompt( $original_text, $prompt, $tone = '', $is_new_generation = false ) {
        // 口調の指示を構築
        $tone_instruction = '';
        if ( ! empty( $tone ) ) {
            $tone_map = array(
                'polite'   => '「です・ます」調（丁寧語）で書いてください。読者に対して敬意を持った表現を使用してください。',
                'plain'    => '「だ・である」調（常体）で書いてください。断定的で簡潔な表現を使用してください。',
                'casual'   => 'カジュアルな口調で書いてください。堅苦しくない、親しみやすい表現を使用してください。',
                'business' => 'ビジネス向けのフォーマルな口調で書いてください。専門的で信頼感のある表現を使用してください。',
                'friendly' => 'フレンドリーで親しみやすい口調で書いてください。読者と会話しているような温かみのある表現を使用してください。',
            );

            if ( isset( $tone_map[ $tone ] ) ) {
                $tone_instruction = "\n\n## 口調・文体\n" . $tone_map[ $tone ];
            }
        }

        // 新規生成モードの場合は異なるプロンプト
        if ( $is_new_generation ) {
            $system_prompt = <<<PROMPT
あなたはプロのコンテンツライターです。
ユーザーの指示に基づいて、新しいテキストを生成してください。

## ユーザーの指示
{$prompt}{$tone_instruction}

## ルール（厳守）
1. 指示に忠実に従ってテキストを生成してください
2. 【重要】生成したテキストのみを出力してください
3. 【禁止】「はい」「承知しました」「以下に」などの返答・前置き・説明は絶対に含めないでください
4. 【禁止】HTMLタグは使用しないでください（プレーンテキストのみ）
5. 【禁止】マークダウン記法（**太字**、# 見出し、- リストなど）は絶対に使用しないでください
6. 自然で読みやすい日本語を心がけてください
7. Webサイトのコンテンツとして適切な文章にしてください
8. 段落は空行（改行2つ）で区切ってください。意味のまとまりごとに段落を分けてください
9. 【重要】句読点は日本語の「、」「。」を使用してください。ピリオド「.」やカンマ「,」は使用しないでください

## 出力形式
コンテンツのみを直接出力してください。挨拶や説明は一切不要です。
段落ごとに空行で区切り、読みやすく整形してください。
PROMPT;
        } else {
            $system_prompt = <<<PROMPT
あなたはプロのコンテンツライターです。
ユーザーの指示に基づいて、元のテキストを変換・生成してください。

## 元のテキスト
{$original_text}

## ユーザーの指示
{$prompt}{$tone_instruction}

## ルール（厳守）
1. 指示に忠実に従ってテキストを生成してください
2. 【重要】生成したテキストのみを出力してください
3. 【禁止】「はい」「承知しました」「以下に」などの返答・前置き・説明は絶対に含めないでください
4. 【禁止】HTMLタグは使用しないでください（プレーンテキストのみ）
5. 【禁止】マークダウン記法（**太字**、# 見出し、- リストなど）は絶対に使用しないでください
6. 自然で読みやすい日本語を心がけてください
7. 元のテキストの意図やトーンを可能な限り維持してください
8. 段落は空行（改行2つ）で区切ってください。意味のまとまりごとに段落を分けてください
9. 【重要】句読点は日本語の「、」「。」を使用してください。ピリオド「.」やカンマ「,」は使用しないでください

## 出力形式
コンテンツのみを直接出力してください。挨拶や説明は一切不要です。
段落ごとに空行で区切り、読みやすく整形してください。
PROMPT;
        }

        return $system_prompt;
    }

    /**
     * 重要フレーズをHTMLに適用（既存のスタイルを保持）
     *
     * @param string $html 元のHTML
     * @param array  $phrases 重要フレーズの配列
     * @param string $highlight_style スタイル
     * @return string マーカー付きHTML
     */
    private static function apply_highlights_to_html( $html, $phrases, $highlight_style ) {
        // スタイルに応じたクラスを設定（追加するクラスのみ）
        $style_new_classes = array(
            'marker'       => 'u-line-1-yellow',
            'marker-pink'  => 'u-line-1-pink',
            'color-red'    => '',
            'color-accent' => '',
            'bold'         => 'fw-700',
        );

        $style_css = array(
            'marker'       => '',
            'marker-pink'  => '',
            'color-red'    => 'color: #e53935;',
            'color-accent' => 'color: var(--color-accent);',
            'bold'         => '',
        );

        $new_class = isset( $style_new_classes[$highlight_style] ) ? $style_new_classes[$highlight_style] : 'u-line-1-yellow';
        $new_css = isset( $style_css[$highlight_style] ) ? $style_css[$highlight_style] : '';

        self::debug_log( '[LW AI Highlight] Applying style: ' . $highlight_style . ', class: ' . $new_class . ', css: ' . $new_css );
        self::debug_log( '[LW AI Highlight] Input HTML: ' . $html );
        self::debug_log( '[LW AI Highlight] Phrases: ' . print_r( $phrases, true ) );

        // 各フレーズを処理
        foreach ( $phrases as $phrase ) {
            if ( empty( $phrase ) ) {
                continue;
            }

            $escaped_phrase = preg_quote( $phrase, '/' );

            // パターン1: フレーズがすでにspanタグ内にある場合（クラス/スタイルをマージ）
            $pattern_existing = '/<span([^>]*)>' . $escaped_phrase . '<\/span>/su';

            if ( preg_match( $pattern_existing, $html ) ) {
                self::debug_log( '[LW AI Highlight] Found existing span for: ' . $phrase );

                $html = preg_replace_callback(
                    $pattern_existing,
                    function( $matches ) use ( $new_class, $new_css, $phrase ) {
                        $attributes = $matches[1];

                        // 既存のクラスを取得してマージ
                        if ( preg_match( '/class="([^"]*)"/', $attributes, $class_match ) ) {
                            $existing_classes = $class_match[1];
                            // 新しいクラスがまだ含まれていなければ追加
                            if ( $new_class && strpos( $existing_classes, $new_class ) === false ) {
                                $merged_classes = trim( $existing_classes . ' ' . $new_class );
                                $attributes = str_replace( 'class="' . $existing_classes . '"', 'class="' . $merged_classes . '"', $attributes );
                            }
                        } else if ( $new_class ) {
                            // classがない場合は追加
                            $attributes = ' class="custom-font-settings ' . $new_class . '"' . $attributes;
                        }

                        // 既存のスタイルを取得してマージ
                        if ( $new_css ) {
                            if ( preg_match( '/style="([^"]*)"/', $attributes, $style_match ) ) {
                                $existing_styles = rtrim( $style_match[1], '; ' );
                                // 新しいスタイルプロパティ名を取得
                                $new_prop_match = array();
                                if ( preg_match( '/^([^:]+):/', $new_css, $new_prop_match ) ) {
                                    $new_prop = $new_prop_match[1];
                                    // 既に同じプロパティがあれば置換、なければ追加
                                    if ( strpos( $existing_styles, $new_prop . ':' ) !== false ) {
                                        $existing_styles = preg_replace( '/' . preg_quote( $new_prop, '/' ) . ':[^;]+;?/', '', $existing_styles );
                                    }
                                }
                                $merged_styles = trim( $existing_styles . '; ' . $new_css, '; ' );
                                $attributes = str_replace( 'style="' . $style_match[1] . '"', 'style="' . $merged_styles . '"', $attributes );
                            } else {
                                // styleがない場合は追加
                                $attributes = $attributes . ' style="' . $new_css . '"';
                            }
                        }

                        self::debug_log( '[LW AI Highlight] Merged span: <span' . $attributes . '>' . $phrase . '</span>' );
                        return '<span' . $attributes . '>' . $phrase . '</span>';
                    },
                    $html
                );
            } else {
                // パターン2: フレーズがspan外にある場合（新規span作成）
                // 既存のspanタグを一時的にプレースホルダーに置換
                $placeholders = array();
                $placeholder_html = preg_replace_callback(
                    '/<span[^>]*>.*?<\/span>/su',
                    function( $matches ) use ( &$placeholders ) {
                        $key = '###PLACEHOLDER_' . count( $placeholders ) . '###';
                        $placeholders[$key] = $matches[0];
                        return $key;
                    },
                    $html
                );

                // フレーズがプレースホルダー以外に存在するか確認
                if ( strpos( $placeholder_html, $phrase ) !== false ) {
                    self::debug_log( '[LW AI Highlight] Creating new span for: ' . $phrase );

                    // 新しいspanを構築
                    $class_attr = 'custom-font-settings';
                    if ( $new_class ) {
                        $class_attr .= ' ' . $new_class;
                    }
                    $style_attr = $new_css ? ' style="' . $new_css . '"' : '';
                    $span_tag = '<span class="' . $class_attr . '"' . $style_attr . '>' . $phrase . '</span>';

                    $placeholder_html = str_replace( $phrase, $span_tag, $placeholder_html );

                    // プレースホルダーを元に戻す
                    foreach ( $placeholders as $key => $original ) {
                        $placeholder_html = str_replace( $key, $original, $placeholder_html );
                    }

                    $html = $placeholder_html;
                }
            }
        }

        self::debug_log( '[LW AI Highlight] Output HTML: ' . $html );
        return $html;
    }

    /**
     * 自動マーカー用のプロンプトを構築
     */
    private static function build_auto_highlight_prompt( $text, $highlight_style = 'marker' ) {
        // スタイルに応じたクラスを設定
        $style_classes = array(
            'marker'       => 'custom-font-settings u-line-1-yellow',
            'marker-pink'  => 'custom-font-settings u-line-1-pink',
            'color-red'    => 'custom-font-settings',
            'color-accent' => 'custom-font-settings',
            'bold'         => 'custom-font-settings fw-700',
        );

        $style_css = array(
            'marker'       => '',
            'marker-pink'  => '',
            'color-red'    => 'color: #e53935;',
            'color-accent' => 'color: var(--color-accent);',
            'bold'         => '',
        );

        $class_to_use = isset( $style_classes[$highlight_style] ) ? $style_classes[$highlight_style] : $style_classes['marker'];
        $css_to_use = isset( $style_css[$highlight_style] ) ? $style_css[$highlight_style] : '';

        $style_attr = $css_to_use ? " style=\"{$css_to_use}\"" : '';

        // 既存のHTMLタグを除去してプレーンテキストのみを渡す
        // AIには常にプレーンテキストを渡し、重要なフレーズのみを返してもらう
        $plain_text = strip_tags( $text );

        $prompt = <<<PROMPT
あなたはコンテンツ編集の専門家です。
以下のテキストの中から、読者にとって重要なポイント（キーワード、重要な数字、強調すべきフレーズなど）を見つけてください。

## 対象テキスト
{$plain_text}

## ルール
1. 重要度の高い2〜5個程度のフレーズを選ぶ
2. 文章全体の20〜30%程度を選ぶ（多すぎないこと）
3. 完全な単語やフレーズ単位で選ぶ（文字の途中で切らない）

## 重要なポイントの例
- 数字、日付、期間
- 固有名詞、サービス名、会社名
- 重要なキーワードやフレーズ
- 結論や要点
- ユーザーにとってのメリット

## 出力形式
重要なフレーズをJSON配列で出力してください。JSONのみを出力し、他の説明は不要です。

## 例
入力: 「当社は2024年に創業し、年間売上100億円を達成しました。お客様満足度98%を誇ります。」
出力: ["2024年", "100億円", "98%"]

入力: 「豊富なユーティリティクラスとAIを活用し、あなたのテキストをより魅力的に変身させます。」
出力: ["ユーティリティクラスとAI", "より魅力的に変身"]
PROMPT;

        return $prompt;
    }

    /**
     * AIレスポンスからHTMLを抽出
     */
    private static function extract_html_from_response( $response ) {
        // ```html ... ``` の形式を削除
        $html = preg_replace( '/```html?\s*/i', '', $response );
        $html = preg_replace( '/```\s*$/', '', $html );

        // 前後の空白を削除
        $html = trim( $html );

        return $html;
    }

    /**
     * ユーティリティクラスの情報を取得
     *
     * @return string
     */
    private static function get_utility_classes_info() {
        return <<<UTILITY

**利用可能なユーティリティクラス:**

【フォントファミリー】data-lw_font_set属性で設定（classNameではない）
- 日本語: "Noto Sans JP", "Noto Serif JP", "Zen Kaku Gothic New", "M PLUS Rounded 1c", "Kosugi Maru" など
- 英語: "Roboto", "Lato", "Montserrat", "Josefin Sans", "Open Sans" など

【フォントサイズ】fs-{値} （0.1〜4まで、0.1刻み）
- PC用: fs-0-5, fs-0-8, fs-1, fs-1-2, fs-1-5, fs-2, fs-3 など
- SP用: fs-sp-0-5, fs-sp-0-8, fs-sp-1, fs-sp-1-2 など
- 例: "fs-1-5" = font-size: 1.5em

【フォントウェイト】fw-{値}
- fw-100, fw-200, fw-300, fw-400, fw-500, fw-600, fw-700, fw-800, fw-900

【行間】lh-{値} （0.8〜3まで、0.1刻み）
- PC用: lh-1, lh-1-2, lh-1-5, lh-1-8, lh-2 など
- SP用: lh-sp-1, lh-sp-1-2, lh-sp-1-5 など

【文字間】ls-{値}
- ls-0, ls-0-05, ls-0-1, ls-0-2, ls-0-3
- SP用: ls-sp-0, ls-sp-0-05, ls-sp-0-1 など

【テキスト配置】
- text-center, text-left, text-right, text-justify
- SP用: text-center-sp, text-left-sp, text-right-sp

【下線装飾】u-line-{タイプ}-{色}
- タイプ: 1（マーカー風）, 2（下線）, 3（背景ハイライト）
- 色: red, pink, blue, green, yellow, orange, main, accent
- 例: "u-line-1-yellow" = 黄色マーカー風下線

【文字の縁取り】
- 太さ: lw-outline-1 〜 lw-outline-10（PC用）、lw-outline-1-sp 〜 lw-outline-10-sp（SP用）
- 色: lw-outline-color-white, lw-outline-color-red, lw-outline-color-main, lw-outline-color-accent

【マージン調整】
- 上: mt-0, mt-0-1, mt-0-5, mt-1, mt-2 など（-0.5〜2em）
- 下: mb-0, mb-0-1, mb-0-5, mb-1, mb-2 など
- 左: ml-0, ml-0-1, ml-0-5, ml-1 など
- 右: mr-0, mr-0-1, mr-0-5, mr-1 など

【角丸】borderRadius_{デバイス}_{px}
- borderRadius_pc_0, borderRadius_pc_8, borderRadius_pc_16, borderRadius_pc_24 など
- borderRadius_tb_*, borderRadius_sp_*

UTILITY;
    }

    /**
     * 誤字脱字チェック
     *
     * @param array $blocks テキストブロック配列
     * @return array|WP_Error 誤字脱字リスト
     */
    public static function check_typo( $blocks ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'APIキーが設定されていません' );
        }

        // テキストを整形
        $text_for_check = array();
        foreach ( $blocks as $index => $block ) {
            $text_for_check[] = array(
                'id'       => $index,
                'clientId' => isset( $block['clientId'] ) ? $block['clientId'] : '',
                'text'     => isset( $block['text'] ) ? $block['text'] : '',
            );
        }

        if ( empty( $text_for_check ) ) {
            return array();
        }

        $texts_json = json_encode( $text_for_check, JSON_UNESCAPED_UNICODE );

        self::debug_log( '[LW AI Typo] Checking ' . count( $text_for_check ) . ' text items' );

        $prompt = <<<PROMPT
あなたは日本語の文章校正の専門家です。以下のテキストブロックを分析し、誤字脱字、文法の誤り、不自然な表現を検出してください。

## チェック対象テキスト（JSON形式）
{$texts_json}

## 検出すべき項目
1. 誤字脱字（漢字の間違い、タイプミス）
2. 送り仮名の誤り
3. 文法的な誤り
4. 不自然な言い回し
5. 同音異義語の誤用

## 出力形式
検出した問題をJSON配列で返してください。問題がない場合は空配列 [] を返してください。

```json
[
  {
    "id": 0,
    "original": "誤りのある文字列または単語",
    "correction": "正しい文字列または単語",
    "reason": "修正理由を簡潔に"
  }
]
```

## 重要な注意事項
- 明らかな誤りのみを報告してください
- 固有名詞や意図的な表現は誤りとしないでください
- 文体の好みによる指摘は避けてください
- JSONのみを出力し、他の説明は不要です
PROMPT;

        // API呼び出し
        $response = wp_remote_post(
            self::API_ENDPOINT . '?key=' . $api_key,
            array(
                'timeout' => 60,
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( array(
                    'contents' => array(
                        array(
                            'parts' => array(
                                array( 'text' => $prompt ),
                            ),
                        ),
                    ),
                    'generationConfig' => array(
                        'temperature'     => 0.1,
                        'topP'            => 0.8,
                        'topK'            => 40,
                        'maxOutputTokens' => 4096,
                    ),
                ) ),
            )
        );

        if ( is_wp_error( $response ) ) {
            return new WP_Error( 'api_error', 'API呼び出しに失敗しました: ' . $response->get_error_message() );
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            self::debug_log( '[LW AI Typo] API error: ' . substr( $body, 0, 500 ) );
            return new WP_Error( 'api_error', 'APIレスポンスの解析に失敗しました' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];

        // JSONを抽出
        if ( preg_match( '/```json\s*([\s\S]*?)\s*```/', $generated_text, $matches ) ) {
            $json_str = $matches[1];
        } else {
            $json_str = trim( $generated_text );
        }

        $typo_results = json_decode( $json_str, true );

        if ( ! is_array( $typo_results ) ) {
            self::debug_log( '[LW AI Typo] JSON parse error: ' . json_last_error_msg() );
            return array();
        }

        self::debug_log( '[LW AI Typo] Found ' . count( $typo_results ) . ' issues' );

        // clientIdをマッピング
        $results_with_client_id = array();
        foreach ( $typo_results as $typo ) {
            $id = isset( $typo['id'] ) ? intval( $typo['id'] ) : -1;
            $client_id = '';

            if ( $id >= 0 && isset( $text_for_check[ $id ] ) ) {
                $client_id = $text_for_check[ $id ]['clientId'];
            }

            $results_with_client_id[] = array(
                'clientId'   => $client_id,
                'original'   => isset( $typo['original'] ) ? $typo['original'] : '',
                'correction' => isset( $typo['correction'] ) ? $typo['correction'] : '',
                'reason'     => isset( $typo['reason'] ) ? $typo['reason'] : '',
            );
        }

        // 使用量トラッキング
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) && isset( $data['usageMetadata'] ) ) {
            $input_tokens  = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
            $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
            // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
            $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
            LW_AI_Generator_Usage_Tracker::log_usage( 'typo_check', 'gemini-2.5-flash', $input_tokens, $output_tokens, 0 );
        }

        return $results_with_client_id;
    }

    /**
     * マイパーツHTML/CSS/JS生成
     *
     * @param string $user_request ユーザーのリクエスト
     * @param string $parts_type パーツの種類（fv, intro, voice等）
     * @param int $parts_number パーツの番号
     * @param array|null $confirmed_analysis プレビューで確認済みの分析データ（省略時は新規分析）
     * @return array|WP_Error
     */
    public static function generate_myparts( $user_request, $parts_type = '', $parts_number = 1, $model = 'gemini-2.5-flash', $reference_image = '', $current_code = null, $generate_images = false, $confirmed_analysis = null ) {
        self::debug_log( '[LW MyParts Gemini] generate_myparts() 開始' );

        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            self::debug_log( '[LW MyParts Gemini] エラー: APIキーが設定されていない' );
            return new WP_Error( 'no_api_key', 'APIキーが設定されていません' );
        }

        self::debug_log( '[LW MyParts Gemini] APIキー: 設定済み' );

        // 許可されたモデルのリスト
        $allowed_models = array(
            'gemini-2.5-flash',
            'gemini-2.5-pro',
            'gemini-2.5-flash-lite',
        );

        // モデル名のバリデーション
        if ( ! in_array( $model, $allowed_models, true ) ) {
            $model = 'gemini-2.5-flash'; // デフォルト
        }

        self::debug_log( '[LW MyParts Gemini] 使用モデル: ' . $model );

        // ★ ステップ1: 参考画像の分析
        $image_analysis = null;

        // 確認済み分析データがある場合はそれを使用（プレビューで確認・修正済み）
        if ( ! empty( $confirmed_analysis ) && is_array( $confirmed_analysis ) ) {
            self::debug_log( '[LW MyParts Gemini] ステップ1: 確認済み分析データを使用' );
            $image_analysis = $confirmed_analysis;
            if ( isset( $image_analysis['content_context'] ) ) {
                self::debug_log( '[LW MyParts Gemini] - コンテキスト: ' . $image_analysis['content_context'] );
            }
            if ( isset( $image_analysis['suggested_content']['heading'] ) ) {
                self::debug_log( '[LW MyParts Gemini] - 見出し: ' . $image_analysis['suggested_content']['heading'] );
            }
        }
        // 確認済みデータがなく、参考画像がある場合は新規分析
        elseif ( ! empty( $reference_image ) ) {
            self::debug_log( '[LW MyParts Gemini] ステップ1: 参考画像分析開始...' );
            self::debug_log( '[LW MyParts Gemini] - ユーザーリクエスト: ' . mb_substr( $user_request, 0, 50 ) );
            $image_analysis = self::analyze_reference_image( $reference_image, $model, $user_request );
            if ( is_wp_error( $image_analysis ) ) {
                // 分析エラーの場合はログに記録するが処理は続行
                self::debug_log( '[LW MyParts Gemini] ステップ1: 画像分析失敗 - ' . $image_analysis->get_error_message() );
                $image_analysis = null;
            } else {
                self::debug_log( '[LW MyParts Gemini] ステップ1: 画像分析成功' );
                self::debug_log( '[LW MyParts Gemini] - 分析結果キー: ' . implode( ', ', array_keys( $image_analysis ) ) );
                if ( isset( $image_analysis['content_context'] ) ) {
                    self::debug_log( '[LW MyParts Gemini] - コンテキスト: ' . $image_analysis['content_context'] );
                } else {
                    self::debug_log( '[LW MyParts Gemini] - コンテキスト: なし' );
                }
                if ( isset( $image_analysis['layout'] ) ) {
                    self::debug_log( '[LW MyParts Gemini] - レイアウト: ' . ( isset( $image_analysis['layout']['type'] ) ? $image_analysis['layout']['type'] : '不明' ) );
                }
                if ( isset( $image_analysis['colors']['background'] ) ) {
                    self::debug_log( '[LW MyParts Gemini] - 背景色: ' . $image_analysis['colors']['background'] );
                }
                if ( isset( $image_analysis['suggested_content']['heading'] ) ) {
                    self::debug_log( '[LW MyParts Gemini] - 推奨見出し: ' . $image_analysis['suggested_content']['heading'] );
                } else {
                    self::debug_log( '[LW MyParts Gemini] - 推奨見出し: なし' );
                }
            }
        } else {
            self::debug_log( '[LW MyParts Gemini] ステップ1: 参考画像なし - スキップ' );
        }

        // パーツタイプからクラス名のプレフィックスを生成
        $class_prefix = 'lw_my_parts';
        if ( ! empty( $parts_type ) ) {
            $class_prefix .= '_' . sanitize_title( $parts_type );
        }
        $class_name = $class_prefix . '_' . intval( $parts_number );

        // システムプロンプト
        $system_prompt = <<<PROMPT
あなたはWordPressテーマ「LiteWord」のマイパーツ（ショートコード用パーツ）を制作するエキスパートです。
ユーザーのリクエストに基づいて、HTML、CSS、JavaScriptを生成してください。

## 重要なルール

### 1. 出力形式
必ず以下のJSON形式で出力してください：
```json
{
  "html": "HTMLコードをここに",
  "css": "CSSコードをここに（★絶対に空にしないこと）",
  "js": "JavaScriptコードをここに（不要な場合は空文字）",
  "message": "生成したパーツの説明"
}
```
**★最重要: cssフィールドは絶対に空にしないでください。** HTMLだけでは見た目が成立しません。最低限レイアウト・フォントサイズ・余白・レスポンシブ対応のCSSを必ず含めてください。

### 2. クラス命名規則
- 親要素のクラス名: `{$class_name}` を必ず使用
- 子要素: シンプルなクラス名（inner, title, text等）またはクラスなしでタグのみ
- CSSセレクタは必ず親クラスから指定: `.{$class_name} h1`, `.{$class_name} .inner`

### 3. CSS記述ルール
- **モダンCSSネスト記法を使用**してください
- 例:
```css
.{$class_name} {
  display: flex;

  .inner {
    padding: 20px;
  }

  h1 {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    h1 {
      font-size: 24px;
    }
  }
}
```

### 4. JavaScript記述ルール
- 変数名は必ずクラス名をプレフィックスに: `const {$class_name}_slider = ...`
- Pure JavaScriptを使用（jQuery不要）
- 即時実行関数でスコープを閉じる
- スライダーが必要な場合はSwiperを使用（CDNは自動読み込み）

### 5. 使用禁止のCSS（重要）
以下のCSSプロパティは**絶対に使用しないでください**：
- `background-attachment: fixed` - iOS Safariでサポートされていない
- `-webkit-background-clip: text` を単独で使う場合は `background-clip: text` も併記

### 6. レスポンシブ対応
- 必ずレスポンシブ対応にする
- ブレークポイント: 768px（タブレット）、480px（スマホ）を目安に
- LiteWordのヘルパークラスも利用可能: `.none_750px`（750px以下で非表示）, `.on_750px`（750px以下で表示）

### 7. 既存スタイルの考慮
LiteWordでは以下がリセット済み:
- 全要素: margin: 0, padding: 0, box-sizing: border-box
- ul: list-style: none
- a: text-decoration: none
- body: font-size: 16px, line-height: 1, letter-spacing: 0.03em

### 8. 画像について（重要）
- **すべての画像はpicsum.photosを使用してください**
- サンプル画像URL: `https://picsum.photos/幅/高さ?random=番号`
- 例: `https://picsum.photos/800/600?random=1`
- 背景画像が必要な場合も必ずpicsum.photosを使用: `background-image: url('https://picsum.photos/1920/1080?random=1')`
- **グラデーションや単色背景ではなく、実際の画像を使ってください**

### 9. 禁止事項
- **絵文字は使用禁止**（セキュリティ上の制限）
- 絵文字的な表現が必要な場合はSVGをインラインで記述
- html, body, head タグは不要（パーツのみ出力）

### 10. 全幅表示（フルワイド）の方法
ファーストビューなど画面幅いっぱいに表示したい場合は、以下のCSSを使用してください：
```css
.lw_content_wrap.page {
  .{$class_name} {
    margin-left: calc((100% - 100vw) / 2);
    width: 100vw;
  }
  &:has(.first_content + .{$class_name}) {
    .first_content {
      display: none;
    }
  }
}
```
- `margin-left: calc((100% - 100vw) / 2)` と `width: 100vw` で親要素からはみ出して全幅表示
- `.first_content` は最初のコンテンツ前の余白なので、ファーストビューの場合は非表示にする
- **重要**: 全幅表示が必要な場合は、必ずこの形式でCSSを出力してください

### 11. コードの品質
- 初心者でも理解しやすいシンプルなHTML構造
- 必要最小限のマークアップ
- コメントは日本語で適宜追加

PROMPT;

        // 修正モードの場合（既存コードがある場合）
        $is_edit_mode = ! empty( $current_code ) && (
            ! empty( $current_code['html'] ) ||
            ! empty( $current_code['css'] ) ||
            ! empty( $current_code['js'] )
        );

        if ( $is_edit_mode ) {
            $system_prompt .= "\n\n### 12. 修正モード（最重要）\n";
            $system_prompt .= "ユーザーから既存のコードが提供されています。\n";
            $system_prompt .= "- ユーザーの指示に従って、既存コードを**部分的に修正**してください\n";
            $system_prompt .= "- 指示されていない部分は**絶対に変更しないで**そのまま維持してください\n";
            $system_prompt .= "- クラス名やID、全体の構造は可能な限り維持してください\n";
            $system_prompt .= "- 修正箇所のみを変更し、他の部分はそのまま出力してください\n";
            $system_prompt .= "- コード全体を作り直すのではなく、必要な箇所だけを修正してください\n\n";
            $system_prompt .= "**絶対に変更禁止（指示がない限り）**:\n";
            $system_prompt .= "- 画像URL（background-image, src属性など）は**絶対に変更しない**\n";
            $system_prompt .= "- 既存の背景画像設定はそのまま維持する\n";
            $system_prompt .= "- 色（color, background-color等）は指示がない限り変更しない\n";
            $system_prompt .= "- フォントサイズや余白も指示がない限り変更しない\n";
        }

        // 参考画像がある場合はプロンプトに追加
        if ( ! empty( $reference_image ) ) {
            $system_prompt .= "\n\n### 13. 参考画像の分析結果（この情報に従ってコードを生成）\n";
            $system_prompt .= "参考画像を事前に分析しました。**この分析結果に従ってCSSを生成してください。**\n\n";

            // 分析結果がある場合は詳細を追加
            if ( ! empty( $image_analysis ) && ! isset( $image_analysis['raw_analysis'] ) ) {

                // コンテンツコンテキスト（業種・目的）
                if ( isset( $image_analysis['content_context'] ) && ! empty( $image_analysis['content_context'] ) ) {
                    $system_prompt .= "#### サイトの目的・業種\n";
                    $system_prompt .= "**" . $image_analysis['content_context'] . "**\n\n";
                }

                // レイアウトパターン（最重要）
                $layout_pattern = isset( $image_analysis['layout_pattern'] ) ? $image_analysis['layout_pattern'] : 'A';
                $system_prompt .= "#### レイアウトパターン: **{$layout_pattern}**\n";
                if ( $layout_pattern === 'A' ) {
                    $system_prompt .= "**1枚の大きな背景画像（全幅）+ 中央にテキスト + ボタン** のシンプルな構造\n";
                    $system_prompt .= "- 背景画像を `background-image` で設定\n";
                    $system_prompt .= "- テキストは `position: absolute` または `flexbox` で中央配置\n";
                    $system_prompt .= "- 複数の小さな画像を配置するのは**禁止**\n\n";
                } elseif ( $layout_pattern === 'B' ) {
                    $system_prompt .= "**左右分割（片側に画像、片側にテキスト）** の構造\n";
                    $system_prompt .= "- `display: flex` で左右に配置\n";
                    $system_prompt .= "- 画像は1枚のみ使用\n\n";
                } else {
                    $system_prompt .= "**背景色/グラデーション + 画像を配置** の構造\n\n";
                }

                // 背景情報（重要）
                if ( isset( $image_analysis['background'] ) ) {
                    $bg = $image_analysis['background'];
                    $system_prompt .= "#### 背景の設定（重要）\n";
                    $bg_type = isset( $bg['type'] ) ? $bg['type'] : 'full_image';
                    $system_prompt .= "- **背景タイプ**: " . $bg_type . "\n";

                    if ( $bg_type === 'full_image' ) {
                        $system_prompt .= "- **実装方法**: `background-image: url('https://picsum.photos/1920/1080?random=1')` で1枚の背景画像を設定\n";
                        $system_prompt .= "- `background-size: cover`, `background-position: center` を使用\n";
                        $system_prompt .= "- **禁止**: `background-attachment: fixed` は使用禁止（iOS Safariで動作しないため）\n";
                        if ( isset( $bg['suggested_image'] ) && ! empty( $bg['suggested_image'] ) ) {
                            $system_prompt .= "- **背景画像の内容**: " . $bg['suggested_image'] . "\n";
                        }
                    } elseif ( isset( $bg['color'] ) ) {
                        $system_prompt .= "- **背景色**: " . $bg['color'] . "\n";
                    }
                    $system_prompt .= "\n";
                }

                // レイアウト詳細
                if ( isset( $image_analysis['layout'] ) ) {
                    $layout = $image_analysis['layout'];
                    $system_prompt .= "#### レイアウト詳細\n";
                    if ( isset( $layout['structure'] ) ) {
                        $system_prompt .= "- 構造: " . $layout['structure'] . "\n";
                    }
                    $text_align = isset( $layout['text_alignment'] ) ? $layout['text_alignment'] : 'center';
                    $system_prompt .= "- テキスト配置: **" . $text_align . "**\n\n";
                }

                // 色情報
                if ( isset( $image_analysis['colors'] ) ) {
                    $colors = $image_analysis['colors'];
                    $system_prompt .= "#### 使用する色（必ずこの色を使用）\n";
                    if ( isset( $colors['text_primary'] ) ) {
                        $system_prompt .= "- メインテキスト色: " . $colors['text_primary'] . "\n";
                    }
                    if ( isset( $colors['text_secondary'] ) ) {
                        $system_prompt .= "- サブテキスト色: " . $colors['text_secondary'] . "\n";
                    }
                    if ( isset( $colors['accent'] ) && ! empty( $colors['accent'] ) ) {
                        $system_prompt .= "- アクセント色（ボタン等）: " . $colors['accent'] . "\n";
                    }
                    if ( isset( $colors['overlay'] ) && ! empty( $colors['overlay'] ) ) {
                        $system_prompt .= "- 背景オーバーレイ: " . $colors['overlay'] . "（背景画像の上に半透明レイヤーを置く場合）\n";
                    }
                    $system_prompt .= "\n";
                }

                // タイポグラフィ
                if ( isset( $image_analysis['typography'] ) ) {
                    $typo = $image_analysis['typography'];
                    $system_prompt .= "#### タイポグラフィ\n";
                    if ( isset( $typo['heading_size'] ) ) {
                        $system_prompt .= "- 見出しサイズ: " . $typo['heading_size'] . "\n";
                    }
                    if ( isset( $typo['heading_weight'] ) ) {
                        $system_prompt .= "- 見出しの太さ: " . $typo['heading_weight'] . "\n";
                    }
                    $system_prompt .= "\n";
                }

                // CSS実装方針
                if ( isset( $image_analysis['css_implementation'] ) && ! empty( $image_analysis['css_implementation'] ) ) {
                    $system_prompt .= "#### CSS実装方針\n";
                    $system_prompt .= $image_analysis['css_implementation'] . "\n\n";
                }

                // 提案コンテンツ（見出し・サブ見出し・CTA）
                if ( isset( $image_analysis['suggested_content'] ) ) {
                    $suggested = $image_analysis['suggested_content'];
                    $system_prompt .= "#### 推奨テキスト（これを使用）\n";
                    if ( isset( $suggested['heading'] ) && ! empty( $suggested['heading'] ) ) {
                        $system_prompt .= "- **見出し**: " . $suggested['heading'] . "\n";
                    }
                    if ( isset( $suggested['subheading'] ) && ! empty( $suggested['subheading'] ) ) {
                        $system_prompt .= "- **サブ見出し**: " . $suggested['subheading'] . "\n";
                    }
                    if ( isset( $suggested['cta_text'] ) && ! empty( $suggested['cta_text'] ) ) {
                        $system_prompt .= "- **CTAボタン**: " . $suggested['cta_text'] . "\n";
                    }
                    $system_prompt .= "\n";
                }
            } elseif ( isset( $image_analysis['raw_analysis'] ) ) {
                // 生テキストの分析結果
                $system_prompt .= "#### 画像分析結果\n";
                $system_prompt .= $image_analysis['raw_analysis'] . "\n\n";
            }

            $system_prompt .= "**絶対条件**:\n";
            $system_prompt .= "- 上記の分析結果に基づいてCSSを生成してください\n";
            $system_prompt .= "- レイアウトパターンAの場合、**必ず1枚の背景画像**を使用し、複数の小さな画像を配置しないでください\n";
            $system_prompt .= "- 背景画像はpicsum.photosのURL（1920x1080）を使用してください\n";
            $system_prompt .= "- 推奨テキストを必ず使用してください\n";
        }

        // リクエストのパーツを構築
        $request_parts = array(
            array( 'text' => $system_prompt ),
        );

        // 参考画像がある場合はパーツに追加
        if ( ! empty( $reference_image ) ) {
            // MIMEタイプを推測（Base64の先頭から判断するか、デフォルトでJPEGとする）
            $mime_type = 'image/jpeg';
            if ( strpos( $reference_image, 'iVBOR' ) === 0 ) {
                $mime_type = 'image/png';
            } elseif ( strpos( $reference_image, 'R0lGOD' ) === 0 ) {
                $mime_type = 'image/gif';
            } elseif ( strpos( $reference_image, 'UklGR' ) === 0 ) {
                $mime_type = 'image/webp';
            }

            $request_parts[] = array(
                'inline_data' => array(
                    'mime_type' => $mime_type,
                    'data'      => $reference_image,
                ),
            );

            // 分析結果がある場合は簡潔に、ない場合は詳細な指示
            if ( ! empty( $image_analysis ) ) {
                $request_parts[] = array( 'text' => "上記が参考画像です。システムプロンプトに記載した分析結果（色・レイアウト・サイズ等）に従ってコードを生成してください。\n\nユーザーのリクエスト:\n" . $user_request );
            } else {
                $request_parts[] = array( 'text' => "【絶対条件】上記が参考画像です。このレイアウトと完全に一致させてください。\n\n必ず再現すること：\n1. 要素の配置位置を画像と同じにする\n2. 背景色・文字色を画像から抽出して使用する\n3. テキストと画像の配置関係を一致させる\n4. 余白のバランスを一致させる\n\n独自のレイアウトは作らず、この画像の構造をそのままCSSで再現してください。\n\nユーザーのリクエスト:\n" . $user_request );
            }
        } else {
            // 修正モードの場合は既存コードを含める
            if ( $is_edit_mode ) {
                $existing_code_text = "## 既存のコード（これを修正してください）\n\n";

                if ( ! empty( $current_code['html'] ) ) {
                    $existing_code_text .= "### 現在のHTML:\n```html\n" . $current_code['html'] . "\n```\n\n";
                }
                if ( ! empty( $current_code['css'] ) ) {
                    $existing_code_text .= "### 現在のCSS:\n```css\n" . $current_code['css'] . "\n```\n\n";
                }
                if ( ! empty( $current_code['js'] ) ) {
                    $existing_code_text .= "### 現在のJavaScript:\n```javascript\n" . $current_code['js'] . "\n```\n\n";
                }

                $edit_instruction = "## ユーザーの修正指示:\n" . $user_request . "\n\n";
                $edit_instruction .= "**重要**: 上記の指示に関係ない部分（特に画像URL、背景画像、色など）は**絶対に変更しないでください**。指示された箇所のみを修正してください。";
                $request_parts[] = array( 'text' => $existing_code_text . $edit_instruction );
            } else {
                $request_parts[] = array( 'text' => "ユーザーのリクエスト:\n" . $user_request );
            }
        }

        // リクエスト本文
        $request_body = array(
            'contents' => array(
                array(
                    'role'  => 'user',
                    'parts' => $request_parts,
                ),
            ),
            'generationConfig' => array(
                'temperature'     => 0.7,
                'topP'            => 0.95,
                'topK'            => 40,
                'maxOutputTokens' => 8192,
                'responseMimeType' => 'application/json',
            ),
        );

        // モデル名を使ってAPIエンドポイントを構築
        $api_endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent';

        self::debug_log( '[LW MyParts Gemini] ステップ2: コード生成API呼び出し開始...' );
        self::debug_log( '[LW MyParts Gemini] - エンドポイント: ' . $api_endpoint );

        // API呼び出し
        $response = wp_remote_post(
            $api_endpoint . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => wp_json_encode( $request_body ),
                'timeout' => 120,
            )
        );

        if ( is_wp_error( $response ) ) {
            self::debug_log( '[LW MyParts Gemini] ステップ2: API通信エラー - ' . $response->get_error_message() );
            return new WP_Error( 'api_error', 'API通信エラー: ' . $response->get_error_message() );
        }

        $http_code = wp_remote_retrieve_response_code( $response );
        self::debug_log( '[LW MyParts Gemini] ステップ2: HTTPステータス ' . $http_code );

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( isset( $data['error'] ) ) {
            self::debug_log( '[LW MyParts Gemini] ステップ2: APIエラー - ' . $data['error']['message'] );
            return new WP_Error( 'api_error', 'APIエラー: ' . $data['error']['message'] );
        }

        // レスポンス解析
        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            self::debug_log( '[LW MyParts Gemini] ステップ2: レスポンス構造異常' );
            self::debug_log( '[LW MyParts Gemini] レスポンス先頭500文字: ' . mb_substr( $body, 0, 500 ) );
            return new WP_Error( 'parse_error', 'レスポンスの解析に失敗しました' );
        }

        $response_text = $data['candidates'][0]['content']['parts'][0]['text'];
        self::debug_log( '[LW MyParts Gemini] ステップ2: レスポンス取得成功 (' . strlen( $response_text ) . 'bytes)' );

        // JSONとして解析
        $result = json_decode( $response_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            self::debug_log( '[LW MyParts Gemini] ステップ2: JSONパースエラー - ' . json_last_error_msg() );
            // JSONパースエラー - テキストから抽出を試みる
            $result = self::extract_myparts_from_text( $response_text );
            if ( ! $result ) {
                self::debug_log( '[LW MyParts Gemini] ステップ2: テキスト抽出も失敗' );
                return new WP_Error( 'parse_error', 'レスポンスのJSON解析に失敗しました' );
            }
            self::debug_log( '[LW MyParts Gemini] ステップ2: テキストから抽出成功' );
        }

        self::debug_log( '[LW MyParts Gemini] ステップ2: コード生成完了' );

        // 使用量トラッキング
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) && isset( $data['usageMetadata'] ) ) {
            $input_tokens  = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
            $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
            // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
            $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
            LW_AI_Generator_Usage_Tracker::log_usage( 'myparts_generate', $model, $input_tokens, $output_tokens, 0 );
        }

        $html_output = isset( $result['html'] ) ? $result['html'] : '';
        $message = isset( $result['message'] ) ? $result['message'] : 'パーツを生成しました';

        // CSSが空の場合、最低限のスタイルを生成
        if ( empty( $result['css'] ) && ! empty( $html_output ) ) {
            self::debug_log( '[LW MyParts Gemini] 警告: AIがCSSを返さなかったためデフォルトCSSを生成' );
            $result['css'] = ".{$class_name} {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 40px 20px;\n\n  @media (max-width: 768px) {\n    padding: 24px 16px;\n  }\n}";
            $message .= '（CSSが自動補完されました。必要に応じて調整してください）';
        }
        $images_generated = 0;

        // 参考画像分析が行われた場合はメッセージに追加
        if ( ! empty( $image_analysis ) && ! isset( $image_analysis['raw_analysis'] ) ) {
            $analysis_info = '';
            if ( isset( $image_analysis['layout']['type'] ) ) {
                $analysis_info .= $image_analysis['layout']['type'];
            }
            if ( isset( $image_analysis['colors']['background'] ) ) {
                $analysis_info .= ', 背景' . $image_analysis['colors']['background'];
            }
            if ( ! empty( $analysis_info ) ) {
                $message .= ' [画像分析: ' . $analysis_info . ']';
            }
        }

        // ★ ステップ3: AI画像生成オプションが有効な場合、picsum.photos URLを置き換え
        $css_output = isset( $result['css'] ) ? $result['css'] : '';
        if ( $generate_images && ( ! empty( $html_output ) || ! empty( $css_output ) ) ) {
            self::debug_log( '[LW MyParts Gemini] ステップ3: AI画像生成開始...' );

            // 分析結果から色調情報を取得（画像生成のスタイルヒントとして使用）
            $color_hint = '';
            if ( ! empty( $image_analysis ) && isset( $image_analysis['colors'] ) ) {
                $colors = $image_analysis['colors'];
                if ( isset( $colors['background'] ) ) {
                    // 背景色から画像のトーンを推測
                    $bg_color = strtolower( $colors['background'] );
                    if ( strpos( $bg_color, '#fff' ) !== false || strpos( $bg_color, '#faf' ) !== false || strpos( $bg_color, '#f5f' ) !== false ) {
                        $color_hint = 'bright and airy tone, light background';
                    } elseif ( strpos( $bg_color, '#000' ) !== false || strpos( $bg_color, '#111' ) !== false || strpos( $bg_color, '#222' ) !== false || strpos( $bg_color, '#333' ) !== false ) {
                        $color_hint = 'dark and moody tone, dark background';
                    }
                }
            }

            // HTMLとCSSを結合して検索
            $all_content = $html_output . "\n" . $css_output;

            // picsum.photos URLを検出（?random=X がある場合とない場合の両方に対応）
            if ( preg_match_all( '/https?:\/\/picsum\.photos\/(\d+)\/(\d+)(?:\?random=\d+)?/', $all_content, $matches, PREG_SET_ORDER ) ) {
                self::debug_log( '[LW MyParts Gemini] ステップ3: ' . count( $matches ) . '枚の画像を検出' );

                foreach ( $matches as $index => $match ) {
                    $full_url = $match[0];
                    $width = $match[1];
                    $height = $match[2];

                    // 画像のコンテキストを推測（分析結果とHTML周辺情報から）
                    $image_context = self::build_image_prompt( $html_output, $full_url, $user_request, $image_analysis );

                    // 色調ヒントがあれば追加
                    if ( ! empty( $color_hint ) ) {
                        $image_context .= ', ' . $color_hint;
                    }

                    self::debug_log( '[LW MyParts Gemini] ステップ3: 画像' . ( $index + 1 ) . '生成中...' );
                    self::debug_log( '[LW MyParts Gemini] - 画像プロンプト: ' . mb_substr( $image_context, 0, 150 ) );

                    // AI画像を生成
                    $generated_url = self::generate_image( $image_context );

                    if ( ! is_wp_error( $generated_url ) && ! empty( $generated_url ) ) {
                        // URLを置き換え（HTMLとCSS両方）
                        $html_output = str_replace( $full_url, $generated_url, $html_output );
                        $css_output = str_replace( $full_url, $generated_url, $css_output );
                        $images_generated++;
                        self::debug_log( '[LW MyParts Gemini] ステップ3: 画像' . ( $index + 1 ) . '生成成功' );
                    } else {
                        self::debug_log( '[LW MyParts Gemini] ステップ3: 画像' . ( $index + 1 ) . '生成失敗' );
                    }

                    // API制限を考慮して少し待機（最大3枚まで）
                    if ( $images_generated >= 3 ) {
                        break;
                    }
                    usleep( 500000 ); // 0.5秒待機
                }
            } else {
                self::debug_log( '[LW MyParts Gemini] ステップ3: picsum.photos URLなし - スキップ' );
                self::debug_log( '[LW MyParts Gemini] - HTML内容: ' . mb_substr( $html_output, 0, 200 ) );
                self::debug_log( '[LW MyParts Gemini] - CSS内容: ' . mb_substr( $css_output, 0, 200 ) );
            }

            if ( $images_generated > 0 ) {
                $message .= ' (' . $images_generated . '枚の画像をAIで生成しました)';
            }
        } else {
            self::debug_log( '[LW MyParts Gemini] ステップ3: AI画像生成OFF - スキップ' );
        }

        self::debug_log( '[LW MyParts Gemini] generate_myparts() 完了 - 全ステップ終了' );

        return array(
            'html'    => $html_output,
            'css'     => ! empty( $css_output ) ? $css_output : ( isset( $result['css'] ) ? $result['css'] : '' ),
            'js'      => isset( $result['js'] ) ? $result['js'] : '',
            'message' => $message,
        );
    }

    /**
     * JSONテキストから指定したキーの文字列値を抽出
     * 正規表現ではなく文字列操作で確実に抽出
     *
     * @param string $text JSONテキスト
     * @param string $key 抽出するキー
     * @return string 抽出した値（見つからない場合は空文字）
     */
    private static function extract_json_string_value( $text, $key ) {
        // "key": " のパターンを探す
        $pattern = '"' . $key . '"';
        $key_pos = strpos( $text, $pattern );
        if ( $key_pos === false ) {
            return '';
        }

        // : を探す
        $colon_pos = strpos( $text, ':', $key_pos + strlen( $pattern ) );
        if ( $colon_pos === false ) {
            return '';
        }

        // 開始のダブルクォートを探す
        $start_quote_pos = strpos( $text, '"', $colon_pos + 1 );
        if ( $start_quote_pos === false ) {
            return '';
        }

        // 値の開始位置
        $value_start = $start_quote_pos + 1;

        // 終了のダブルクォートを探す（エスケープされたクォートをスキップ）
        $pos = $value_start;
        $len = strlen( $text );
        while ( $pos < $len ) {
            $char = $text[ $pos ];
            if ( $char === '\\' ) {
                // エスケープシーケンス - 次の文字をスキップ
                $pos += 2;
                continue;
            }
            if ( $char === '"' ) {
                // 終了クォートを発見
                break;
            }
            $pos++;
        }

        if ( $pos >= $len ) {
            // 終了クォートが見つからなかった
            return '';
        }

        // 値を抽出
        $raw_value = substr( $text, $value_start, $pos - $value_start );

        // エスケープシーケンスをデコード
        $decoded = stripcslashes( $raw_value );

        return $decoded;
    }

    /**
     * 画像生成用のプロンプトを構築（分析結果を活用）
     *
     * @param string $html HTML内容
     * @param string $image_url 画像URL
     * @param string $user_request ユーザーリクエスト
     * @param array|null $image_analysis ステップ1の画像分析結果
     * @return string 画像生成用プロンプト
     */
    private static function build_image_prompt( $html, $image_url, $user_request, $image_analysis = null ) {
        $prompt_parts = array();

        // 1. 画像分析結果からコンテキストを取得（最優先）
        if ( ! empty( $image_analysis ) && isset( $image_analysis['content_context'] ) ) {
            // 業種・テーマに関する情報を抽出
            $context = $image_analysis['content_context'];

            // 業種キーワードを抽出（接骨院、サロン、クリニックなど）
            if ( preg_match( '/(接骨院|整体|整骨院|サロン|クリニック|医院|歯科|美容|エステ|ヨガ|フィットネス|カフェ|レストラン|店舗|オフィス|事務所)/u', $context, $matches ) ) {
                $business_type = $matches[1];

                // 業種に応じた画像テーマを設定（人物が出る場合は日本人を指定）
                $image_themes = array(
                    '接骨院' => 'professional osteopathic treatment, healing massage, therapeutic care, Japanese woman receiving treatment, relaxing spa atmosphere',
                    '整体' => 'professional body therapy, healing massage, therapeutic care, Japanese person, relaxing treatment room',
                    '整骨院' => 'professional osteopathic clinic, physical therapy, therapeutic treatment, Japanese patient',
                    'サロン' => 'luxury spa interior, relaxing atmosphere, beauty treatment, elegant salon, Japanese woman',
                    'クリニック' => 'modern medical clinic, clean professional healthcare environment, Japanese staff',
                    '医院' => 'professional medical office, healthcare facility, clean and modern',
                    '歯科' => 'modern dental clinic, professional dentistry, clean healthcare environment',
                    '美容' => 'beauty spa, skincare treatment, elegant beauty salon, relaxing atmosphere, Japanese woman',
                    'エステ' => 'luxury spa treatment, facial massage, relaxing beauty care, elegant atmosphere, Japanese woman',
                    'ヨガ' => 'peaceful yoga studio, meditation space, calm and serene environment, Japanese person',
                    'フィットネス' => 'modern gym, fitness training, active lifestyle, workout space, Japanese person',
                    'カフェ' => 'cozy cafe interior, warm atmosphere, coffee shop aesthetic',
                    'レストラン' => 'elegant restaurant interior, fine dining atmosphere, food establishment',
                    '店舗' => 'professional retail store, shop interior, commercial space',
                    'オフィス' => 'modern office space, professional business environment, Japanese businessperson',
                    '事務所' => 'professional office interior, business workspace',
                );

                if ( isset( $image_themes[ $business_type ] ) ) {
                    $prompt_parts[] = $image_themes[ $business_type ];
                }
            }

            // ターゲット層の情報（女性向け、など）
            if ( preg_match( '/(女性|男性|シニア|若者|ファミリー|子供)/u', $context, $target_match ) ) {
                $target_themes = array(
                    '女性' => 'feminine and elegant style, soft lighting, warm colors',
                    '男性' => 'masculine and professional style, strong composition',
                    'シニア' => 'comfortable and welcoming atmosphere, warm tones',
                    '若者' => 'modern and trendy style, vibrant atmosphere',
                    'ファミリー' => 'family-friendly atmosphere, welcoming and warm',
                    '子供' => 'bright and cheerful atmosphere, playful elements',
                );
                if ( isset( $target_themes[ $target_match[1] ] ) ) {
                    $prompt_parts[] = $target_themes[ $target_match[1] ];
                }
            }
        }

        // 2. ユーザーリクエストから画像関連のキーワードを抽出
        if ( ! empty( $user_request ) ) {
            // 施術、治療、癒しなどのキーワード
            if ( preg_match( '/(施術|治療|癒し|リラックス|マッサージ|ケア|癒やし)/u', $user_request, $keyword_match ) ) {
                $prompt_parts[] = 'healing and relaxing treatment scene';
            }
            // 背景に関する指示
            if ( preg_match( '/背景.*(画像|写真|イメージ)/u', $user_request ) ) {
                $prompt_parts[] = 'suitable as website background image';
            }
        }

        // 3. HTML内のalt属性から情報を取得
        if ( preg_match( '/alt=["\']([^"\']+)["\'][^>]*src=["\']' . preg_quote( $image_url, '/' ) . '["\']/', $html, $alt_match ) ) {
            if ( ! empty( $alt_match[1] ) && $alt_match[1] !== 'image' ) {
                $prompt_parts[] = $alt_match[1];
            }
        } elseif ( preg_match( '/src=["\']' . preg_quote( $image_url, '/' ) . '["\'][^>]*alt=["\']([^"\']+)["\']/', $html, $alt_match ) ) {
            if ( ! empty( $alt_match[1] ) && $alt_match[1] !== 'image' ) {
                $prompt_parts[] = $alt_match[1];
            }
        }

        // 4. 画像の用途を推測（クラス名から）
        $image_pos = strpos( $html, $image_url );
        if ( $image_pos !== false ) {
            $surrounding = substr( $html, max( 0, $image_pos - 300 ), 600 );
            if ( preg_match( '/class=["\'][^"\']*\b(hero|banner|fv|firstview)\b/i', $surrounding ) ) {
                $prompt_parts[] = 'hero banner image, wide format, impactful composition';
            } elseif ( preg_match( '/class=["\'][^"\']*\b(background|bg)\b/i', $surrounding ) ) {
                $prompt_parts[] = 'background image, subtle and elegant';
            } elseif ( preg_match( '/class=["\'][^"\']*\b(feature|card|thumb)\b/i', $surrounding ) ) {
                $prompt_parts[] = 'feature image, clear subject focus';
            }
        }

        // 5. デフォルトの品質指定を追加
        $prompt_parts[] = 'professional photography, high quality, sharp focus';

        // プロンプトを結合
        $final_prompt = implode( ', ', array_unique( array_filter( $prompt_parts ) ) );

        // プロンプトが空の場合のフォールバック
        if ( empty( $final_prompt ) ) {
            $final_prompt = 'professional business photograph, modern and clean style, high quality';
        }

        return $final_prompt;
    }

    /**
     * @deprecated 代わりに build_image_prompt() を使用
     */
    private static function extract_image_context( $html, $image_url, $user_request ) {
        return self::build_image_prompt( $html, $image_url, $user_request, null );
    }

    /**
     * テキストからマイパーツのHTML/CSS/JSを抽出
     *
     * @param string $text レスポンステキスト
     * @return array|false
     */
    private static function extract_myparts_from_text( $text ) {
        self::debug_log( '[LW MyParts Extract] テキストから抽出開始 (' . strlen( $text ) . 'bytes)' );

        $result = array(
            'html' => '',
            'css'  => '',
            'js'   => '',
            'message' => '',
        );

        // まず制御文字を除去してJSONパースを再試行
        $cleaned_text = preg_replace( '/[\x00-\x1F\x7F]/u', '', $text );
        $json_result = json_decode( $cleaned_text, true );
        if ( json_last_error() === JSON_ERROR_NONE && is_array( $json_result ) ) {
            self::debug_log( '[LW MyParts Extract] 制御文字除去後のJSONパース成功' );
            return array(
                'html'    => isset( $json_result['html'] ) ? $json_result['html'] : '',
                'css'     => isset( $json_result['css'] ) ? $json_result['css'] : '',
                'js'      => isset( $json_result['js'] ) ? $json_result['js'] : '',
                'message' => isset( $json_result['message'] ) ? $json_result['message'] : '',
            );
        }
        self::debug_log( '[LW MyParts Extract] 制御文字除去後もJSONパース失敗: ' . json_last_error_msg() );

        // デバッグ: レスポンスの先頭を表示
        self::debug_log( '[LW MyParts Extract] レスポンス先頭1000文字: ' . mb_substr( $text, 0, 1000 ) );

        // JSONからフィールドを抽出（文字列操作方式 - より確実）
        $result['html'] = self::extract_json_string_value( $text, 'html' );
        if ( ! empty( $result['html'] ) ) {
            self::debug_log( '[LW MyParts Extract] HTML抽出成功: ' . strlen( $result['html'] ) . 'bytes' );
        }

        $result['css'] = self::extract_json_string_value( $text, 'css' );
        if ( ! empty( $result['css'] ) ) {
            self::debug_log( '[LW MyParts Extract] CSS抽出成功: ' . strlen( $result['css'] ) . 'bytes' );
        }

        $result['js'] = self::extract_json_string_value( $text, 'js' );
        if ( ! empty( $result['js'] ) ) {
            self::debug_log( '[LW MyParts Extract] JS抽出成功: ' . strlen( $result['js'] ) . 'bytes' );
        }

        $result['message'] = self::extract_json_string_value( $text, 'message' );

        // JSONからの抽出が失敗した場合、HTMLタグから抽出
        if ( empty( $result['html'] ) ) {
            if ( preg_match( '/<div[^>]*class=["\'][^"\']*lw_my_parts[^"\']*["\'][^>]*>[\s\S]*?<\/div>/s', $text, $matches ) ) {
                $result['html'] = trim( $matches[0] );
                self::debug_log( '[LW MyParts Extract] HTML抽出成功 (タグ形式): ' . strlen( $result['html'] ) . 'bytes' );
            }
        }

        if ( empty( $result['css'] ) ) {
            if ( preg_match( '/<style[^>]*>(.*?)<\/style>/s', $text, $matches ) ) {
                $result['css'] = trim( $matches[1] );
                self::debug_log( '[LW MyParts Extract] CSS抽出成功 (styleタグ形式): ' . strlen( $result['css'] ) . 'bytes' );
            } elseif ( preg_match( '/```css\s*([\s\S]*?)```/', $text, $matches ) ) {
                $result['css'] = trim( $matches[1] );
                self::debug_log( '[LW MyParts Extract] CSS抽出成功 (コードブロック形式): ' . strlen( $result['css'] ) . 'bytes' );
            }
        }

        if ( empty( $result['js'] ) ) {
            if ( preg_match( '/<script[^>]*>(.*?)<\/script>/s', $text, $matches ) ) {
                $result['js'] = trim( $matches[1] );
                self::debug_log( '[LW MyParts Extract] JS抽出成功 (scriptタグ形式): ' . strlen( $result['js'] ) . 'bytes' );
            }
        }

        self::debug_log( '[LW MyParts Extract] 最終結果: HTML=' . strlen( $result['html'] ) . 'bytes, CSS=' . strlen( $result['css'] ) . 'bytes, JS=' . strlen( $result['js'] ) . 'bytes' );

        if ( empty( $result['html'] ) && empty( $result['css'] ) ) {
            self::debug_log( '[LW MyParts Extract] 抽出失敗 - テキスト先頭500文字: ' . mb_substr( $text, 0, 500 ) );
            return false;
        }

        return $result;
    }

    // ========================================
    // パーツ選択・最適化メソッド
    // ========================================

    /**
     * ブロックのblock.jsonから属性情報を取得
     *
     * @param string $block_name ブロック名（例: wdl/lw-pr-fv-13）
     * @return array|null 属性情報の配列、または取得できない場合はnull
     */
    public static function get_block_attributes_from_json( $block_name ) {
        // ブロック名からフォルダ名を取得（wdl/lw-pr-fv-13 -> lw-pr-fv-13）
        $folder_name = str_replace( 'wdl/', '', $block_name );

        // block.jsonのパスを構築
        $block_json_path = get_template_directory() . '/my-blocks/build/' . $folder_name . '/block.json';

        if ( ! file_exists( $block_json_path ) ) {
            error_log( '[LW AI] block.json not found: ' . $block_json_path );
            return null;
        }

        $json_content = file_get_contents( $block_json_path );
        $block_data   = json_decode( $json_content, true );

        if ( json_last_error() !== JSON_ERROR_NONE || ! isset( $block_data['attributes'] ) ) {
            error_log( '[LW AI] Failed to parse block.json: ' . $block_json_path );
            return null;
        }

        // ai_descriptionを持つ属性のみを抽出
        $ai_attributes = array();
        foreach ( $block_data['attributes'] as $attr_name => $attr_config ) {
            if ( isset( $attr_config['ai_description'] ) ) {
                $ai_attributes[ $attr_name ] = array(
                    'type'           => isset( $attr_config['type'] ) ? $attr_config['type'] : 'string',
                    'default'        => isset( $attr_config['default'] ) ? $attr_config['default'] : '',
                    'ai_description' => $attr_config['ai_description'],
                );
            }
        }

        // ブロック全体の説明も取得
        $result = array(
            'blockName'     => $block_name,
            'title'         => isset( $block_data['title'] ) ? $block_data['title'] : '',
            'description'   => isset( $block_data['description'] ) ? $block_data['description'] : '',
            'aiDescription' => isset( $block_data['aiDescription'] ) ? $block_data['aiDescription'] : '',
            'aiNotes'       => isset( $block_data['aiNotes'] ) ? $block_data['aiNotes'] : '',
            'attributes'    => $ai_attributes,
        );

        return $result;
    }

    /**
     * 属性情報をプロンプト用のテキストに整形
     *
     * @param array $block_info get_block_attributes_from_jsonの戻り値
     * @return string プロンプト用テキスト
     */
    public static function format_block_attributes_for_prompt( $block_info ) {
        if ( empty( $block_info ) || empty( $block_info['attributes'] ) ) {
            return '';
        }

        $text = "## 選択されたブロックの入力項目\n";
        $text .= "ブロック名: {$block_info['blockName']}\n";

        if ( ! empty( $block_info['aiDescription'] ) ) {
            $text .= "ブロック説明: {$block_info['aiDescription']}\n";
        }

        if ( ! empty( $block_info['aiNotes'] ) ) {
            $text .= "注意事項: {$block_info['aiNotes']}\n";
        }

        $text .= "\n### 入力すべき項目（ai_description付き）\n";
        $text .= "以下の項目に対してコンテンツを生成してください。各項目のai_descriptionに従ってください。\n\n";

        foreach ( $block_info['attributes'] as $attr_name => $attr_config ) {
            $type    = $attr_config['type'];
            $default = $attr_config['default'];
            $desc    = $attr_config['ai_description'];

            // デフォルト値を文字列化
            if ( is_bool( $default ) ) {
                $default_str = $default ? 'true' : 'false';
            } elseif ( is_array( $default ) ) {
                $default_str = json_encode( $default, JSON_UNESCAPED_UNICODE );
            } else {
                $default_str = (string) $default;
            }

            $text .= "- **{$attr_name}** ({$type})\n";
            $text .= "  説明: {$desc}\n";
            if ( ! empty( $default_str ) && $default_str !== '""' && $default_str !== '[]' ) {
                $text .= "  デフォルト値: {$default_str}\n";
            }
            $text .= "\n";
        }

        return $text;
    }

    /**
     * テンプレートJSONからテキスト項目を抽出
     *
     * @param string $template_name テンプレート名
     * @return array|null テンプレート構造情報
     */
    public static function get_template_text_fields( $template_name ) {
        $template_path = get_template_directory() . '/functions/custom_bloc_insert_system/templates/' . $template_name . '.json';

        if ( ! file_exists( $template_path ) ) {
            error_log( '[LW AI] Template not found: ' . $template_path );
            return null;
        }

        $json_content  = file_get_contents( $template_path );
        $template_data = json_decode( $json_content, true );

        if ( json_last_error() !== JSON_ERROR_NONE || ! is_array( $template_data ) ) {
            error_log( '[LW AI] Failed to parse template: ' . $template_path );
            return null;
        }

        $text_fields = array();

        // 再帰的にブロックを処理
        self::extract_text_fields_from_blocks( $template_data, $text_fields );

        return array(
            'templateName' => $template_name,
            'textFields'   => $text_fields,
        );
    }

    /**
     * ブロック配列からテキスト項目を再帰的に抽出
     *
     * @param array $blocks ブロック配列
     * @param array &$text_fields テキスト項目を格納する配列
     * @param int   $depth ネスト深度
     */
    private static function extract_text_fields_from_blocks( $blocks, &$text_fields, $depth = 0 ) {
        foreach ( $blocks as $block_index => $block ) {
            $block_name = isset( $block['name'] ) ? $block['name'] : '';
            $attributes = isset( $block['attributes'] ) ? $block['attributes'] : array();

            // wdlブロックの場合、block.jsonを参照
            if ( strpos( $block_name, 'wdl/' ) === 0 ) {
                $block_info = self::get_block_attributes_from_json( $block_name );

                if ( $block_info && ! empty( $block_info['attributes'] ) ) {
                    foreach ( $block_info['attributes'] as $attr_name => $attr_config ) {
                        // テキスト系の属性のみ抽出
                        if ( self::is_text_attribute( $attr_name, $attr_config ) ) {
                            $current_value = isset( $attributes[ $attr_name ] ) ? $attributes[ $attr_name ] : $attr_config['default'];

                            $text_fields[] = array(
                                'blockName'     => $block_name,
                                'blockIndex'    => $block_index,
                                'depth'         => $depth,
                                'attrName'      => $attr_name,
                                'attrType'      => $attr_config['type'],
                                'aiDescription' => $attr_config['ai_description'],
                                'currentValue'  => $current_value,
                                'default'       => $attr_config['default'],
                            );
                        }
                    }
                }
            }
            // core/paragraph, core/headingの場合
            elseif ( $block_name === 'core/paragraph' || $block_name === 'core/heading' ) {
                $content = isset( $attributes['content'] ) ? $attributes['content'] : '';
                // HTMLタグを除去してプレーンテキストを取得
                $plain_text = wp_strip_all_tags( $content );

                $text_fields[] = array(
                    'blockName'     => $block_name,
                    'blockIndex'    => $block_index,
                    'depth'         => $depth,
                    'attrName'      => 'content',
                    'attrType'      => 'string',
                    'aiDescription' => $block_name === 'core/heading' ? '見出しテキスト' : '段落テキスト',
                    'currentValue'  => $plain_text,
                    'default'       => '',
                );
            }

            // innerBlocksを再帰処理
            if ( ! empty( $block['innerBlocks'] ) ) {
                self::extract_text_fields_from_blocks( $block['innerBlocks'], $text_fields, $depth + 1 );
            }
        }
    }

    /**
     * 属性がテキスト系かどうかを判定
     *
     * @param string $attr_name 属性名
     * @param array  $attr_config 属性設定
     * @return bool
     */
    private static function is_text_attribute( $attr_name, $attr_config ) {
        $type = isset( $attr_config['type'] ) ? $attr_config['type'] : '';
        $ai_desc = isset( $attr_config['ai_description'] ) ? $attr_config['ai_description'] : '';

        // 配列型でコンテンツを含む場合（contents, itemsなど）
        if ( $type === 'array' ) {
            // ai_descriptionに「項目」「ステップ」「リスト」などが含まれるか
            if ( preg_match( '/(項目|ステップ|リスト|配列|title|text|内容)/u', $ai_desc ) ) {
                return true;
            }
        }

        // 文字列型の場合
        if ( $type === 'string' ) {
            // 除外: 色、URL(画像生成プロンプト以外)、フォント、CSSクラス系
            $exclude_patterns = array(
                '/^(bg|border|filter|stroke|cta).*Color$/i',
                '/Color$/i',
                '/^(font|Font)/',
                '/Gradient$/i',
                '/Class$/i',
                '/Weight$/i',
                '/^video.*Url$/i',
            );

            foreach ( $exclude_patterns as $pattern ) {
                if ( preg_match( $pattern, $attr_name ) ) {
                    return false;
                }
            }

            // ai_descriptionにテキスト生成を示唆する内容があるか
            if ( preg_match( '/(タイトル|キャッチ|説明|テキスト|文字|メッセージ|ボタン|見出し|alt|プロンプト)/u', $ai_desc ) ) {
                return true;
            }

            // 属性名でテキスト系を判定
            $text_attr_patterns = array(
                '/^(main|sub)?Title$/i',
                '/^(catch|sub)?[Pp]hrase$/i',
                '/^description$/i',
                '/^(button|btn)Text$/i',
                '/^(text|content)$/i',
                '/^imageAlt$/i',
                '/Prompt$/i',
            );

            foreach ( $text_attr_patterns as $pattern ) {
                if ( preg_match( $pattern, $attr_name ) ) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * テンプレート構造用にコンテンツを最適化
     *
     * @param string $content 構成案のコンテンツ
     * @param array  $template_info get_template_text_fieldsの戻り値
     * @param string $business_type 業種
     * @return array|WP_Error
     */
    public static function optimize_content_with_template_structure( $content, $template_info, $business_type = '' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        $text_fields = $template_info['textFields'];

        // テキスト項目をプロンプト用に整形
        $fields_text = "## テンプレートの入力項目\n";
        $fields_text .= "テンプレート名: {$template_info['templateName']}\n\n";
        $fields_text .= "### 入力すべきテキスト項目\n";

        $output_structure = array();

        foreach ( $text_fields as $index => $field ) {
            $fields_text .= ( $index + 1 ) . ". **{$field['attrName']}** ({$field['blockName']})\n";
            $fields_text .= "   説明: {$field['aiDescription']}\n";
            if ( $field['attrType'] === 'array' ) {
                $fields_text .= "   形式: 配列（複数項目）\n";
            }
            $fields_text .= "\n";

            // 出力構造を構築
            $output_structure[ $field['attrName'] ] = $field['attrType'] === 'array'
                ? '（配列: ai_descriptionに従って生成）'
                : '（ai_descriptionに従って生成）';
        }

        $output_example_json = json_encode( $output_structure, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );

        $business_context = '';
        if ( ! empty( $business_type ) ) {
            $business_context = "業種: {$business_type}\n";
        }

        $prompt = <<<PROMPT
あなたはWebコンテンツの専門家です。以下の構成案を、テンプレートの各テキスト項目に整形してください。

## 重要な注意事項
- **構成案の内容（タイトル、項目名、説明文）を必ずそのまま使用してください**
- 新しい内容を創作しないでください
- 構成案の項目数をそのまま維持してください

## 構成案の内容（このテキストを使用すること）
{$content}

{$business_context}

{$fields_text}

## タスク
上記の「入力すべきテキスト項目」のそれぞれに対して：
- **タイトル**: 構成案のタイトルをそのまま使用
- **配列項目（contents, items）**: 構成案の項目をそのまま使用（項目数も同じに）
- **説明文**: 構成案の説明文をそのまま使用

## 出力形式（JSON）
```json
{$output_example_json}
```

JSONのみを出力してください。
PROMPT;

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $prompt )
                    )
                )
            ),
            'generationConfig' => array(
                'temperature'      => 0.5,
                'topK'             => 40,
                'topP'             => 0.95,
                'maxOutputTokens'  => 8192,
                'responseMimeType' => 'application/json',
            )
        );

        // 候補から選ぶ・整えるだけの処理なので思考は不要（思考オフ）。
        // ただし 2.5-pro は思考を切れない（Budget 0 で "This model only works in thinking mode"）ため、
        // Flash 系のときだけ thinkingConfig を送る（build_thinking_config が判定）。
        $thinking_config = self::build_thinking_config( self::get_part_select_model(), 0 );
        if ( null !== $thinking_config ) {
            $request_body['generationConfig']['thinkingConfig'] = $thinking_config;
        }

        // 従来は 2.5-pro 固定で、パーツ選定は実測1回18秒（セクション数だけ繰り返される）。
        // タイムアウト30秒に収まらず失敗して既定パーツへ差し替わるのが
        // 「業種を変えても毎回同じレイアウトになる」主因だった。
        $response = wp_remote_post(
            self::get_model_endpoint( self::get_part_select_model() ) . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( $request_body ),
                'timeout' => 60, // 余裕をもたせる（30秒だと失敗しフォールバックしていた）
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        $json_text = self::extract_json( $generated_text );
        $result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error( 'json_parse_error', 'JSONのパースに失敗しました: ' . json_last_error_msg() );
        }

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'template_optimize', self::get_part_select_model(), $input_tokens, $output_tokens, 0 );
        }

        return $result;
    }

    /**
     * パーツを選択してテキストを最適化
     *
     * @param string $section_type セクションタイプ
     * @param string $content 構成案のコンテンツ
     * @param array  $available_parts 利用可能なパーツ一覧
     * @param string $business_type 業種
     * @return array|WP_Error
     */
    public static function select_and_optimize_part( $section_type, $content, $available_parts, $business_type = '' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        // パーツ一覧をテキスト化
        $parts_list = '';
        foreach ( $available_parts as $index => $part ) {
            $parts_list .= ( $index + 1 ) . ". {$part['name']} ({$part['type']})\n   説明: {$part['description']}\n\n";
        }

        $business_context = '';
        if ( ! empty( $business_type ) ) {
            $business_context = "業種: {$business_type}\n";
        }

        $prompt = <<<PROMPT
あなたはWebデザインの専門家です。以下の構成案に最適なパーツを選択し、構成案のテキストをそのパーツ向けに整形してください。

## 重要な注意事項
- **構成案の内容を必ずそのまま使用してください**
- 新しい内容を創作しないでください
- タイトルや項目名、説明文は構成案から取得してください
- 文言の微調整は許可されますが、内容の変更は禁止です

## セクションタイプ
{$section_type}

## 構成案の内容（このテキストを使用すること）
{$content}

{$business_context}

## 利用可能なパーツ
{$parts_list}

## タスク
1. パーツ一覧から、構成案の内容構造（項目数、テキスト量など）に最も適したパーツを選択
2. 構成案のテキストをそのパーツの形式に合わせて整形（内容は変更しない）

## 出力形式（JSON）
```json
{
    "selectedPart": "選択したパーツ名（例: wdl/lw-pr-fv-13）",
    "partType": "block または template",
    "partDescription": "パーツの説明",
    "optimizedContent": {
        "title": "構成案のタイトルをそのまま使用",
        "items": [
            { "title": "構成案の項目名", "description": "構成案の説明文" }
        ]
    }
}
```

JSONのみを出力してください。
PROMPT;

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $prompt )
                    )
                )
            ),
            'generationConfig' => array(
                'temperature'      => 0.5,
                'topK'             => 40,
                'topP'             => 0.95,
                'maxOutputTokens'  => 8192,
                'responseMimeType' => 'application/json',
            )
        );

        // 候補から選ぶ・整えるだけの処理なので思考は不要（思考オフ）。
        // ただし 2.5-pro は思考を切れない（Budget 0 で "This model only works in thinking mode"）ため、
        // Flash 系のときだけ thinkingConfig を送る（build_thinking_config が判定）。
        $thinking_config = self::build_thinking_config( self::get_part_select_model(), 0 );
        if ( null !== $thinking_config ) {
            $request_body['generationConfig']['thinkingConfig'] = $thinking_config;
        }

        // 従来は 2.5-pro 固定で、パーツ選定は実測1回18秒（セクション数だけ繰り返される）。
        // タイムアウト30秒に収まらず失敗して既定パーツへ差し替わるのが
        // 「業種を変えても毎回同じレイアウトになる」主因だった。
        $response = wp_remote_post(
            self::get_model_endpoint( self::get_part_select_model() ) . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( $request_body ),
                'timeout' => 60, // 余裕をもたせる（30秒だと失敗しフォールバックしていた）
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        $json_text = self::extract_json( $generated_text );
        $result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error( 'json_parse_error', 'JSONのパースに失敗しました: ' . json_last_error_msg() );
        }

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'part_select', self::get_part_select_model(), $input_tokens, $output_tokens, 0 );
        }

        // 選択されたパーツがブロックの場合、block.jsonの属性情報を使って再最適化
        $selected_part = isset( $result['selectedPart'] ) ? $result['selectedPart'] : '';
        $part_type     = isset( $result['partType'] ) ? $result['partType'] : '';

        if ( $part_type === 'block' && strpos( $selected_part, 'wdl/' ) === 0 ) {
            $block_info = self::get_block_attributes_from_json( $selected_part );

            if ( $block_info && ! empty( $block_info['attributes'] ) ) {
                // block.jsonの属性情報を使って再最適化
                $reoptimized = self::optimize_content_with_block_attributes(
                    $content,
                    $block_info,
                    $business_type
                );

                if ( ! is_wp_error( $reoptimized ) && ! empty( $reoptimized ) ) {
                    $result['optimizedContent'] = $reoptimized;
                }
            }
        }
        // 選択されたパーツがテンプレートの場合、テンプレート構造を使って再最適化
        elseif ( $part_type === 'template' ) {
            $template_info = self::get_template_text_fields( $selected_part );

            if ( $template_info && ! empty( $template_info['textFields'] ) ) {
                // テンプレート構造を使って再最適化
                $reoptimized = self::optimize_content_with_template_structure(
                    $content,
                    $template_info,
                    $business_type
                );

                if ( ! is_wp_error( $reoptimized ) && ! empty( $reoptimized ) ) {
                    $result['optimizedContent'] = $reoptimized;
                }
            }
        }

        return $result;
    }

    /**
     * block.jsonの属性情報を使ってコンテンツを最適化
     *
     * @param string $content 構成案のコンテンツ
     * @param array  $block_info block.jsonから取得した情報
     * @param string $business_type 業種
     * @return array|WP_Error
     */
    public static function optimize_content_with_block_attributes( $content, $block_info, $business_type = '' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        $block_attributes_text = self::format_block_attributes_for_prompt( $block_info );

        $business_context = '';
        if ( ! empty( $business_type ) ) {
            $business_context = "業種: {$business_type}\n";
        }

        // 出力すべきJSONキーを生成
        $output_keys = array_keys( $block_info['attributes'] );
        $output_example = array();
        foreach ( $block_info['attributes'] as $attr_name => $attr_config ) {
            if ( $attr_config['type'] === 'string' ) {
                $output_example[ $attr_name ] = '（ai_descriptionに従って生成）';
            } elseif ( $attr_config['type'] === 'number' ) {
                $output_example[ $attr_name ] = $attr_config['default'];
            } elseif ( $attr_config['type'] === 'boolean' ) {
                $output_example[ $attr_name ] = $attr_config['default'];
            } else {
                $output_example[ $attr_name ] = $attr_config['default'];
            }
        }
        $output_example_json = json_encode( $output_example, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );

        $prompt = <<<PROMPT
あなたはWebコンテンツの専門家です。以下の構成案を、指定されたブロックの各属性に整形してください。

## 重要な注意事項
- **構成案の内容（タイトル、項目名、説明文）を必ずそのまま使用してください**
- 新しい内容を創作しないでください
- ai_descriptionは形式（文字数など）の参考にし、内容は構成案から取得してください

## 構成案の内容（このテキストを使用すること）
{$content}

{$business_context}

{$block_attributes_text}

## タスク
上記の「入力すべき項目」のそれぞれに対して：
- **テキスト項目**: 構成案の内容をそのまま使用し、ai_descriptionの文字数に合わせて調整
- **配列項目（items, contents）**: 構成案の項目をそのまま使用
- **画像URL系**: AI画像生成用の英語プロンプトを出力

## 出力形式（JSON）
```json
{$output_example_json}
```

JSONのみを出力してください。
PROMPT;

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $prompt )
                    )
                )
            ),
            'generationConfig' => array(
                'temperature'      => 0.5,
                'topK'             => 40,
                'topP'             => 0.95,
                'maxOutputTokens'  => 8192,
                'responseMimeType' => 'application/json',
            )
        );

        // 候補から選ぶ・整えるだけの処理なので思考は不要（思考オフ）。
        // ただし 2.5-pro は思考を切れない（Budget 0 で "This model only works in thinking mode"）ため、
        // Flash 系のときだけ thinkingConfig を送る（build_thinking_config が判定）。
        $thinking_config = self::build_thinking_config( self::get_part_select_model(), 0 );
        if ( null !== $thinking_config ) {
            $request_body['generationConfig']['thinkingConfig'] = $thinking_config;
        }

        // 従来は 2.5-pro 固定で、パーツ選定は実測1回18秒（セクション数だけ繰り返される）。
        // タイムアウト30秒に収まらず失敗して既定パーツへ差し替わるのが
        // 「業種を変えても毎回同じレイアウトになる」主因だった。
        $response = wp_remote_post(
            self::get_model_endpoint( self::get_part_select_model() ) . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( $request_body ),
                'timeout' => 60, // 余裕をもたせる（30秒だと失敗しフォールバックしていた）
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        $json_text = self::extract_json( $generated_text );
        $result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error( 'json_parse_error', 'JSONのパースに失敗しました: ' . json_last_error_msg() );
        }

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'block_optimize', self::get_part_select_model(), $input_tokens, $output_tokens, 0 );
        }

        return $result;
    }

    /**
     * パーツ用にテキストを再最適化
     *
     * @param string $section_type セクションタイプ
     * @param string $original_content 元の構成案テキスト
     * @param array  $part_info パーツ情報（name, type, description）
     * @param string $business_type 業種
     * @return array|WP_Error
     */
    public static function optimize_content_for_part( $section_type, $original_content, $part_info, $business_type = '' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        // ブロックの場合はblock.jsonを使って最適化
        $part_name = $part_info['name'];
        if ( $part_info['type'] === 'block' && strpos( $part_name, 'wdl/' ) === 0 ) {
            $block_info = self::get_block_attributes_from_json( $part_name );

            if ( $block_info && ! empty( $block_info['attributes'] ) ) {
                return self::optimize_content_with_block_attributes( $original_content, $block_info, $business_type );
            }
        }

        // テンプレートの場合はテンプレート構造を解析して最適化
        if ( $part_info['type'] === 'template' ) {
            $template_info = self::get_template_text_fields( $part_name );

            if ( $template_info && ! empty( $template_info['textFields'] ) ) {
                return self::optimize_content_with_template_structure( $original_content, $template_info, $business_type );
            }
        }

        // block.jsonもテンプレート構造もない場合は従来のプロンプトを使用
        $business_context = '';
        if ( ! empty( $business_type ) ) {
            $business_context = "業種: {$business_type}\n";
        }

        $prompt = <<<PROMPT
あなたはWebデザインの専門家です。以下の構成案を、指定されたパーツの形式に整形してください。

## 重要な注意事項
- **構成案の内容（タイトル、項目名、説明文）を必ずそのまま使用してください**
- 新しい内容を創作しないでください
- 構成案の項目数をそのまま維持してください

## セクションタイプ
{$section_type}

## 構成案の内容（このテキストを使用すること）
{$original_content}

{$business_context}

## 使用するパーツ
名前: {$part_info['name']}
タイプ: {$part_info['type']}
説明: {$part_info['description']}

## タスク
構成案のテキストをパーツの形式に合わせて整形（内容は変更しない）

## 出力形式（JSON）
```json
{
    "title": "構成案のタイトルをそのまま使用",
    "items": [
        { "title": "構成案の項目名", "description": "構成案の説明文" }
    ]
}
```

JSONのみを出力してください。
PROMPT;

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $prompt )
                    )
                )
            ),
            'generationConfig' => array(
                'temperature'      => 0.5,
                'topK'             => 40,
                'topP'             => 0.95,
                'maxOutputTokens'  => 8192,
                'responseMimeType' => 'application/json',
            )
        );

        // 候補から選ぶ・整えるだけの処理なので思考は不要（思考オフ）。
        // ただし 2.5-pro は思考を切れない（Budget 0 で "This model only works in thinking mode"）ため、
        // Flash 系のときだけ thinkingConfig を送る（build_thinking_config が判定）。
        $thinking_config = self::build_thinking_config( self::get_part_select_model(), 0 );
        if ( null !== $thinking_config ) {
            $request_body['generationConfig']['thinkingConfig'] = $thinking_config;
        }

        // 従来は 2.5-pro 固定で、パーツ選定は実測1回18秒（セクション数だけ繰り返される）。
        // タイムアウト30秒に収まらず失敗して既定パーツへ差し替わるのが
        // 「業種を変えても毎回同じレイアウトになる」主因だった。
        $response = wp_remote_post(
            self::get_model_endpoint( self::get_part_select_model() ) . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( $request_body ),
                'timeout' => 60, // 余裕をもたせる（30秒だと失敗しフォールバックしていた）
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        $json_text = self::extract_json( $generated_text );
        $result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error( 'json_parse_error', 'JSONのパースに失敗しました: ' . json_last_error_msg() );
        }

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'part_optimize', self::get_part_select_model(), $input_tokens, $output_tokens, 0 );
        }

        return $result;
    }

    /**
     * 生成されたコンテンツの最終レビュー・修正
     *
     * @param array  $blocks       生成されたブロックの配列
     * @param string $business_type 業種
     * @return array|WP_Error 修正されたブロック配列またはエラー
     */
    public static function review_and_fix_content( $blocks, $business_type = '' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        // ブロックをJSON形式で渡す
        $blocks_json = json_encode( $blocks, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );

        $prompt = <<<PROMPT
あなたはWebサイトコンテンツの品質管理担当です。
以下のブロックデータを確認し、問題のある箇所を修正してください。

## 業種
{$business_type}

## 確認・修正すべき項目

1. **空のテキスト**: title, heading, text, description, content などが空文字列 "" の場合、業種に合った適切な内容を入れる
2. **タイトルの欠落**: sectionTitle, heading などが空の場合、セクションの内容に合ったタイトルを追加
3. **未入力のボタンテキスト**: buttonText, ctaText などが空の場合、適切なCTAテキストを入れる
4. **プレースホルダーの残り**: 「〇〇」「XXX」「ここにテキスト」などのプレースホルダーがあれば、具体的な内容に置き換える
5. **リスト項目の空要素**: items 配列内で title や description が空のものがあれば埋める
6. **不自然な文章**: 文が途中で切れている、意味が通らない場合は修正

## 現在のブロックデータ
```json
{$blocks_json}
```

## 出力形式
修正が必要なブロックのみを配列で返してください。
修正がない場合は空の配列 [] を返してください。

```json
{
    "fixedBlocks": [
        {
            "index": 0,
            "blockName": "wdl/block-name",
            "attributes": { 修正後の属性 }
        }
    ],
    "fixedItems": [
        "セクション1のタイトルを追加",
        "CTAボタンのテキストを修正"
    ]
}
```

重要:
- indexは元の配列での位置（0始まり）
- attributesは修正後の完全な属性オブジェクト
- fixedItemsは修正内容の簡潔な説明リスト
- 修正不要の場合は { "fixedBlocks": [], "fixedItems": [] } を返す
PROMPT;

        $request_body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array( 'text' => $prompt )
                    )
                )
            ),
            'generationConfig' => array(
                'temperature'     => 0.3,
                'topK'            => 40,
                'topP'            => 0.95,
                'maxOutputTokens' => 8192,
            )
        );

        $response = wp_remote_post(
            self::API_ENDPOINT . '?key=' . $api_key,
            array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( $request_body ),
                'timeout' => 120,
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code !== 200 ) {
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        $json_text = self::extract_json( $generated_text );
        $review_result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error( 'json_parse_error', 'JSONのパースに失敗しました: ' . json_last_error_msg() );
        }

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        // 思考トークンは candidatesTokenCount に含まれないが出力として課金されるため加算する
        $output_tokens += isset( $data['usageMetadata']['thoughtsTokenCount'] ) ? (int) $data['usageMetadata']['thoughtsTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'content_review', 'gemini-2.5-flash', $input_tokens, $output_tokens, 0 );
        }

        // 修正を元のブロック配列に適用
        $fixed_blocks = isset( $review_result['fixedBlocks'] ) ? $review_result['fixedBlocks'] : array();
        $fixed_items = isset( $review_result['fixedItems'] ) ? $review_result['fixedItems'] : array();

        // 元のブロックをコピー
        $result_blocks = $blocks;

        // 修正を適用
        foreach ( $fixed_blocks as $fix ) {
            $index = isset( $fix['index'] ) ? intval( $fix['index'] ) : -1;
            if ( $index >= 0 && $index < count( $result_blocks ) && isset( $fix['attributes'] ) ) {
                $result_blocks[ $index ]['attributes'] = $fix['attributes'];
            }
        }

        return array(
            'blocks'     => $result_blocks,
            'fixCount'   => count( $fixed_blocks ),
            'fixedItems' => $fixed_items,
        );
    }
}
