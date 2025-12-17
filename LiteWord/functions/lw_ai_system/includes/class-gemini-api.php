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
     * Gemini API エンドポイント
     */
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    /**
     * Imagen 3 画像生成 API エンドポイント（最新）
     */
    const IMAGE_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict';

    /**
     * APIキーを取得
     *
     * @return string|false
     */
    public static function get_api_key() {
        if ( class_exists( 'LW_AI_Generator_Admin_Settings' ) ) { return LW_AI_Generator_Admin_Settings::get_api_key(); } return get_option( 'lw_ai_generator_gemini_api_key', '' );
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
    public static function get_block_definitions( $return_array = false ) {
        // 各ブロックのblock.jsonから直接読み込み
        $all_blocks = LW_AI_Generator_Block_Settings::get_all_blocks();

        if ( empty( $all_blocks ) ) {
            return $return_array ? array() : '{}';
        }

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
     * aiNotesが設定されているブロックの制約事項を抽出
     *
     * @return string
     */
    public static function extract_block_constraints() {
        $schema = self::get_block_definitions( true );

        if ( empty( $schema['blocks'] ) ) {
            return '';
        }

        $constraints = array();

        foreach ( $schema['blocks'] as $block ) {
            if ( ! empty( $block['aiNotes'] ) ) {
                $block_name = isset( $block['name'] ) ? $block['name'] : '';
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
    public static function build_prompt( $user_request, $image_source = 'pixabay' ) {
        $block_definitions = self::get_block_definitions();
        $block_constraints = self::extract_block_constraints();
        $custom_block_prompts = self::extract_custom_block_prompts();

        $image_instruction = '';

        if ( $image_source === 'pixabay' ) {
            $pixabay_images = self::get_pixabay_images();
            $image_instruction = <<<INST

## 背景画像の設定（Pixabay）
以下の業種別画像リストから、ユーザーのリクエストに最も合う業種を選び、その中から1つの画像URLを選んでbackgroundImageに設定してください。

### 業種別画像リスト
{$pixabay_images}

backgroundImageには、上記リストから選んだURLを直接設定してください。
INST;
        } else {
            $image_instruction = "\nbackgroundImageはデフォルト値のままにするか、空文字にしてください。";
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

## ★★★ 絶対禁止事項（最重要）★★★
以下のブロックは内部にh2見出しが含まれています。これらのブロックの直前にcustom-title系ブロック（h2見出し）を絶対に配置しないでください：
- wdl/lw-step-1 (内部にh2あり)
- wdl/lw-step-2 (内部にh2あり)
- wdl/lw-step-3 (内部にh2あり)

【禁止パターンの例】
❌ custom-title-5 → lw-step-1 （これは禁止！h2が重複する）
✅ lw-step-1 のみ （これが正しい！内部のh2を使う）

stepブロックを使う場合は、その前に見出しブロックを置かず、stepブロック内の「titleText」属性でセクションタイトルを設定してください。

## ★★★ 余白調整（必須）★★★
wdl/lw-space-1 は余白を調整するブロックです。セクション間の区切りや視覚的な間隔を作るために積極的に使用してください。

【使用ルール】
- 各セクション（見出し＋コンテンツのまとまり）の間に lw-space-1 を配置する
- ファーストビュー（fv系ブロック）の直後に配置する
- CTAブロックの前後に配置する
- 属性で PC/タブレット/スマホ それぞれの余白サイズを設定できる

【推奨配置例】
fv-5 → lw-space-1 → custom-title-5 → コンテンツ → lw-space-1 → custom-title-5 → コンテンツ → lw-space-1 → cta-1
{$constraints_section}
{$custom_prompts_section}

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
4. 色は業種のイメージに合ったものを選んでください
5. JSONのみを出力し、マークダウンのコードブロック記号（```）は含めないでください
6. 各ブロックの「aiUsage」は用途を示します。適切な場面で使用してください
7. 各ブロックの「aiDescription」はブロックの説明です。参考にしてください
8. 【重要】lw-step系ブロックの前にcustom-title系ブロックを置かないこと
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
     * @param string $image_source 画像ソース（'pixabay', 'none'）
     * @return array|WP_Error
     */
    public static function generate_layout( $user_request, $image_source = 'pixabay' ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        $prompt = self::build_prompt( $user_request, $image_source );

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
                'temperature'     => 0.7,
                'topK'            => 40,
                'topP'            => 0.95,
                'maxOutputTokens' => 8192,
            )
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

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'layout', 'gemini-2.0-flash', $input_tokens, $output_tokens, 0 );
        }

        // JSONを抽出（コードブロックで囲まれている場合に対応）
        $json_text = self::extract_json( $generated_text );

        // JSONをパース
        $layout_data = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error(
                'json_parse_error',
                'AIの出力をJSONとしてパースできませんでした: ' . json_last_error_msg(),
                array( 'raw_output' => $generated_text )
            );
        }

        return $layout_data;
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
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        self::debug_log( '[LW AI Image Gen] 画像生成開始: ' . mb_substr( $prompt, 0, 100 ) );

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

        self::debug_log( '[LW AI Image Gen] Imagen 3 API呼び出し中...' );

        // Imagen 3はx-goog-api-keyヘッダーで認証する必要がある
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
            self::debug_log( '[LW AI Image Gen] Imagen 3 通信エラー: ' . $response->get_error_message() );
            self::debug_log( '[LW AI Image Gen] Gemini 2.0 Flash にフォールバック...' );
            return self::generate_image_with_gemini( $prompt );
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        self::debug_log( '[LW AI Image Gen] Imagen 3 レスポンス: HTTP ' . $response_code );

        if ( $response_code !== 200 ) {
            // Imagen 3が失敗した場合、エラー詳細をログ
            $error_data = json_decode( $response_body, true );
            $error_msg = isset( $error_data['error']['message'] ) ? $error_data['error']['message'] : $response_body;
            self::debug_log( '[LW AI Image Gen] Imagen 3 エラー: ' . mb_substr( $error_msg, 0, 200 ) );
            self::debug_log( '[LW AI Image Gen] Gemini 2.0 Flash にフォールバック...' );
            return self::generate_image_with_gemini( $prompt );
        }

        $data = json_decode( $response_body, true );

        // Imagen 3のレスポンス形式で画像データを抽出
        if ( isset( $data['predictions'][0]['bytesBase64Encoded'] ) ) {
            $base64_data = $data['predictions'][0]['bytesBase64Encoded'];
            $mime_type = isset( $data['predictions'][0]['mimeType'] ) ? $data['predictions'][0]['mimeType'] : 'image/png';

            self::debug_log( '[LW AI Image Gen] Imagen 3 成功！画像生成完了' );

            // 画像生成をトラッキング
            if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
                LW_AI_Generator_Usage_Tracker::log_usage( 'image', 'imagen-3.0', 0, 0, 1 );
            }

            // メディアライブラリに保存
            $upload_result = self::save_generated_image( $base64_data, $mime_type, $prompt );

            if ( is_wp_error( $upload_result ) ) {
                return 'data:' . $mime_type . ';base64,' . $base64_data;
            }

            return $upload_result;
        }

        // フォールバック: Gemini 2.0 Flashで画像生成
        self::debug_log( '[LW AI Image Gen] Imagen 3 レスポンス形式異常、Gemini 2.0 Flash にフォールバック...' );
        self::debug_log( '[LW AI Image Gen] Imagen 3 レスポンスキー: ' . implode( ', ', array_keys( $data ?? array() ) ) );
        self::debug_log( '[LW AI Image Gen] Imagen 3 レスポンス（先頭500文字）: ' . mb_substr( $response_body, 0, 500 ) );
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
                'responseModalities' => array( 'image', 'text' ),
                'responseMimeType' => 'text/plain'
            )
        );

        // Gemini 2.5 Flash Image (Nano Banana) を使用 - 本番用モデル
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
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        $prompt = self::build_block_instruction_prompt( $block_name, $block_definition, $current_attributes, $instruction, $chat_history );

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
                'temperature'     => 0.7,
                'topK'            => 40,
                'topP'            => 0.95,
                'maxOutputTokens' => 4096,
            )
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

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'block_instruction', 'gemini-2.0-flash', $input_tokens, $output_tokens, 0 );
        }

        // JSONを抽出してパース
        $json_text = self::extract_json( $generated_text );
        $result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            // JSONパースに失敗した場合、テキストのみの応答として扱う
            return array(
                'response'          => $generated_text,
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
        $attributes_json = json_encode( $block_definition['attributes'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );
        $current_attrs_json = json_encode( $current_attributes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );

        // 画像属性を特定
        $image_attributes = array();
        if ( isset( $block_definition['attributes'] ) ) {
            foreach ( $block_definition['attributes'] as $attr_name => $attr_def ) {
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

## 画像の設定について
このブロックには以下の画像関連属性があります: {$image_attrs_str}

ユーザーが画像を変更したい場合（例: 「海の画像にして」「ビジネスっぽい画像に」）:
- 該当する属性に検索キーワード（日本語または英語）を設定してください
- 例: "backgroundImage": "ocean" や "imgUrl": "ビジネス"
- 画像URLは後で自動的に適切なものに置き換えられます
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

## このブロックで設定可能な属性（attributes）
{$attributes_json}

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
3. 不可能な場合は、その理由を説明し、代替案があれば提案してください
4. 「何ができる？」などの質問には、このブロックで設定できる主な項目を説明してください
5. 応答は日本語で、親しみやすく丁寧にしてください

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
        self::debug_log( '[LW AI Text Decoration] process_text_decoration called' );
        self::debug_log( '[LW AI Text Decoration] instruction: ' . $instruction );
        self::debug_log( '[LW AI Text Decoration] selected_text: ' . $selected_text );

        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            self::debug_log( '[LW AI Text Decoration] No API key' );
            return new WP_Error( 'no_api_key', 'Gemini APIキーが設定されていません' );
        }

        $prompt = self::build_text_decoration_prompt( $instruction, $selected_text );
        self::debug_log( '[LW AI Text Decoration] Prompt built, length: ' . strlen( $prompt ) );

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
                'maxOutputTokens' => 1024,
            )
        );

        self::debug_log( '[LW AI Text Decoration] Sending request to Gemini API' );

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
            self::debug_log( '[LW AI Text Decoration] WP Error: ' . $response->get_error_message() );
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        self::debug_log( '[LW AI Text Decoration] Response code: ' . $response_code );

        if ( $response_code !== 200 ) {
            self::debug_log( '[LW AI Text Decoration] API Error response: ' . $response_body );
            $error_data = json_decode( $response_body, true );
            $error_message = isset( $error_data['error']['message'] )
                ? $error_data['error']['message']
                : 'APIエラーが発生しました';
            return new WP_Error( 'api_error', $error_message );
        }

        $data = json_decode( $response_body, true );

        if ( ! isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
            self::debug_log( '[LW AI Text Decoration] Invalid response structure' );
            return new WP_Error( 'invalid_response', 'APIからの応答が不正です' );
        }

        $generated_text = $data['candidates'][0]['content']['parts'][0]['text'];
        self::debug_log( '[LW AI Text Decoration] Generated text: ' . $generated_text );

        // 使用量をトラッキング
        $input_tokens = isset( $data['usageMetadata']['promptTokenCount'] ) ? $data['usageMetadata']['promptTokenCount'] : 0;
        $output_tokens = isset( $data['usageMetadata']['candidatesTokenCount'] ) ? $data['usageMetadata']['candidatesTokenCount'] : 0;
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'text_decoration', 'gemini-2.0-flash', $input_tokens, $output_tokens, 0 );
        }

        // JSONを抽出してパース
        $json_text = self::extract_json( $generated_text );
        self::debug_log( '[LW AI Text Decoration] Extracted JSON: ' . $json_text );

        $result = json_decode( $json_text, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            self::debug_log( '[LW AI Text Decoration] JSON parse error: ' . json_last_error_msg() );
            return new WP_Error( 'json_parse_error', 'AIの応答をパースできませんでした' );
        }

        self::debug_log( '[LW AI Text Decoration] Result: ' . print_r( $result, true ) );
        return $result;
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
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'auto_highlight', 'gemini-2.0-flash', $input_tokens, $output_tokens, 0 );
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
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'auto_highlight_multi', 'gemini-2.0-flash', $input_tokens, $output_tokens, 0 );
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
        if ( class_exists( 'LW_AI_Generator_Usage_Tracker' ) ) {
            LW_AI_Generator_Usage_Tracker::log_usage( 'generate_text', 'gemini-2.0-flash', $input_tokens, $output_tokens, 0 );
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
            LW_AI_Generator_Usage_Tracker::log_usage( 'typo_check', 'gemini-2.0-flash', $input_tokens, $output_tokens, 0 );
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

        // 許可されたモデルのリスト（安定版モデル名）
        $allowed_models = array(
            'gemini-2.5-flash',
            'gemini-2.5-pro',
            'gemini-2.0-flash',
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
  "css": "CSSコードをここに",
  "js": "JavaScriptコードをここに（不要な場合は空文字）",
  "message": "生成したパーツの説明"
}
```

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
            LW_AI_Generator_Usage_Tracker::log_usage( 'myparts_generate', $model, $input_tokens, $output_tokens, 0 );
        }

        $html_output = isset( $result['html'] ) ? $result['html'] : '';
        $message = isset( $result['message'] ) ? $result['message'] : 'パーツを生成しました';
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
}
