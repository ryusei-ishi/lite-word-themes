<?php
/**
 * 管理画面設定クラス（API設定）
 *
 * @package LiteWord_AI_Page_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class LW_AI_Generator_Admin_Settings
 */
class LW_AI_Generator_Admin_Settings {

    /**
     * 暗号化方式
     */
    const CIPHER_METHOD = 'aes-256-cbc';

    /**
     * オプション名（暗号化版）
     */
    const OPTION_NAME = 'lw_ai_generator_gemini_api_key_encrypted';

    /**
     * APIキー検証ステータスオプション名
     */
    const VALIDATION_STATUS_OPTION = 'lw_ai_generator_api_key_status';

    /**
     * 利用規約同意オプション名
     */
    const TERMS_AGREED_OPTION = 'lw_ai_generator_terms_agreed';

    /**
     * 初期化
     */
    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'add_settings_page' ) );
        add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
        add_action( 'admin_init', array( __CLASS__, 'maybe_migrate_api_key' ) );
        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
        add_action( 'wp_ajax_lw_ai_reset_api_key', array( __CLASS__, 'ajax_reset_api_key' ) );
        add_action( 'wp_ajax_lw_ai_validate_api_key', array( __CLASS__, 'ajax_validate_api_key' ) );
        add_action( 'wp_ajax_lw_ai_save_api_key', array( __CLASS__, 'ajax_save_api_key' ) );
        add_action( 'wp_ajax_lw_ai_agree_terms', array( __CLASS__, 'ajax_agree_terms' ) );

        // ★ セットアップウィザード（フロントエンド白紙ページ）
        add_action( 'init', array( __CLASS__, 'register_setup_wizard_route' ) );
        add_filter( 'query_vars', array( __CLASS__, 'setup_wizard_query_vars' ) );
        add_action( 'template_redirect', array( __CLASS__, 'setup_wizard_redirect' ) );
    }

    /**
     * セットアップウィザードのリライトルール登録
     */
    public static function register_setup_wizard_route() {
        add_rewrite_rule( '^lw-ai-setup/?$', 'index.php?lw_ai_setup=1', 'top' );
        // ルールが未登録なら1回だけflush
        $rules = get_option( 'rewrite_rules' );
        if ( ! isset( $rules['^lw-ai-setup/?$'] ) ) {
            flush_rewrite_rules( false );
        }
    }

    public static function setup_wizard_query_vars( $vars ) {
        $vars[] = 'lw_ai_setup';
        return $vars;
    }

    public static function setup_wizard_redirect() {
        if ( get_query_var( 'lw_ai_setup' ) !== '1' ) {
            return;
        }
        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_redirect( wp_login_url( home_url( '/lw-ai-setup/' ) ) );
            exit;
        }
        // テーマCSS/JSなしの白紙ページ
        include LW_AI_SYSTEM_DIR . 'templates/setup-wizard.php';
        exit;
    }

    /**
     * 利用規約に同意済みか確認
     */
    public static function has_agreed_terms() {
        return (bool) get_option( self::TERMS_AGREED_OPTION, false );
    }

    /**
     * Ajax: 利用規約に同意
     */
    public static function ajax_agree_terms() {
        check_ajax_referer( 'lw_ai_admin_settings_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => '権限がありません' ) );
        }

        $agreed_items = isset( $_POST['agreed_items'] ) ? $_POST['agreed_items'] : array();

        // 3つ全てにチェックが必要
        $required_items = array( 'billing', 'accuracy', 'responsibility' );
        foreach ( $required_items as $item ) {
            if ( ! in_array( $item, $agreed_items, true ) ) {
                wp_send_json_error( array( 'message' => 'すべての項目に同意してください' ) );
            }
        }

        update_option( self::TERMS_AGREED_OPTION, array(
            'agreed'    => true,
            'agreed_at' => current_time( 'Y-m-d H:i:s' ),
            'user_id'   => get_current_user_id(),
        ) );

        wp_send_json_success( array( 'message' => '同意が完了しました' ) );
    }

    /**
     * 設定ページを追加
     */
    public static function add_settings_page() {
        // プレミアムプランでない場合はメニューを表示しない
        if ( ! ( defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true ) ) {
            return;
        }

        add_options_page(
            'LiteWord AI Generator 設定',
            'LW AI Generator',
            'manage_options',
            'lw-ai-generator-settings',
            array( __CLASS__, 'render_settings_page' )
        );
    }

    /**
     * アセットを読み込み
     */
    public static function enqueue_assets( $hook ) {
        if ( $hook !== 'settings_page_lw-ai-generator-settings' ) {
            return;
        }

        wp_enqueue_style(
            'lw-ai-admin-settings',
            LW_AI_SYSTEM_URL . 'assets/css/admin-settings.css',
            array(),
            LW_AI_SYSTEM_VERSION
        );

        wp_enqueue_script(
            'lw-ai-admin-settings',
            LW_AI_SYSTEM_URL . 'assets/js/admin-settings.js',
            array( 'jquery' ),
            LW_AI_SYSTEM_VERSION,
            true
        );

        wp_localize_script(
            'lw-ai-admin-settings',
            'lwAiAdminSettings',
            array(
                'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                'nonce'   => wp_create_nonce( 'lw_ai_admin_settings_nonce' ),
            )
        );

        // 音声ガイドJS読み込み
        wp_enqueue_script(
            'lw-voice-guide',
            get_template_directory_uri() . '/functions/seo/js/lw-voice-guide.js',
            array(),
            LW_AI_SYSTEM_VERSION,
            true
        );
    }

    /**
     * 設定を登録
     */
    public static function register_settings() {
        register_setting(
            'lw_ai_generator_settings',
            'lw_ai_generator_gemini_api_key',
            array(
                'type'              => 'string',
                'sanitize_callback' => array( __CLASS__, 'sanitize_and_encrypt_api_key' ),
            )
        );
    }

    /**
     * 古い平文APIキーを暗号化形式に移行
     */
    public static function maybe_migrate_api_key() {
        $old_key = get_option( 'lw_ai_generator_gemini_api_key', '' );
        $encrypted_key = get_option( self::OPTION_NAME, '' );

        if ( ! empty( $old_key ) && empty( $encrypted_key ) && strpos( $old_key, 'AIza' ) === 0 ) {
            $new_encrypted = self::encrypt( $old_key );
            if ( $new_encrypted ) {
                update_option( self::OPTION_NAME, $new_encrypted );
                delete_option( 'lw_ai_generator_gemini_api_key' );
            }
        }
    }

    /**
     * 暗号化キーを取得
     */
    private static function get_encryption_key() {
        if ( defined( 'AUTH_KEY' ) && AUTH_KEY ) {
            return hash( 'sha256', AUTH_KEY, true );
        }
        return hash( 'sha256', ABSPATH . DB_NAME, true );
    }

    /**
     * APIキーを暗号化
     */
    public static function encrypt( $plain_text ) {
        if ( empty( $plain_text ) ) {
            return '';
        }

        $key = self::get_encryption_key();
        $iv_length = openssl_cipher_iv_length( self::CIPHER_METHOD );
        $iv = openssl_random_pseudo_bytes( $iv_length );

        $encrypted = openssl_encrypt( $plain_text, self::CIPHER_METHOD, $key, OPENSSL_RAW_DATA, $iv );

        if ( $encrypted === false ) {
            return false;
        }

        return base64_encode( $iv . $encrypted );
    }

    /**
     * APIキーを復号化
     */
    public static function decrypt( $encrypted_text ) {
        if ( empty( $encrypted_text ) ) {
            return '';
        }

        $key = self::get_encryption_key();
        $data = base64_decode( $encrypted_text );

        if ( $data === false ) {
            return false;
        }

        $iv_length = openssl_cipher_iv_length( self::CIPHER_METHOD );
        $iv = substr( $data, 0, $iv_length );
        $encrypted = substr( $data, $iv_length );

        $decrypted = openssl_decrypt( $encrypted, self::CIPHER_METHOD, $key, OPENSSL_RAW_DATA, $iv );

        return $decrypted;
    }

    /**
     * APIキーをサニタイズして暗号化保存
     */
    public static function sanitize_and_encrypt_api_key( $input ) {
        $input = sanitize_text_field( $input );

        if ( ! empty( $input ) ) {
            $encrypted = self::encrypt( $input );
            if ( $encrypted ) {
                update_option( self::OPTION_NAME, $encrypted );
            }
        }

        return '';
    }

    /**
     * 復号化されたAPIキーを取得
     */
    public static function get_api_key() {
        $encrypted = get_option( self::OPTION_NAME, '' );
        if ( empty( $encrypted ) ) {
            return '';
        }
        return self::decrypt( $encrypted );
    }

    /**
     * 音声ガイドテキストを取得
     */
    public static function get_voice_guide_text() {
        $texts = array(
            'このページでは、AI機能を使うための設定を行います。',
            'まず、APIとは何かを説明します。|APIとは、アプリケーション・プログラミング・インターフェースの略で、異なるソフトウェア同士が通信するための仕組みです。',
            '簡単に言うと、このWordPressサイトと、GoogleのAIサービスをつなぐための「鍵」のようなものです。',
            'APIキーを設定することで、Googleの高性能なAI「ジェミニ」を使って、自動でページの内容を生成したり、画像を作成したりできるようになります。',
            'APIキーの取得方法を説明します。|まず、Googleアイスタジオというサイトにアクセスします。|Googleアカウントでログインしてください。',
            '次に、「APIキーを作成」ボタンをクリックします。|すると、エーアイゼットエーで始まる長い文字列が表示されます。これがAPIキーです。',
            'このキーをコピーして、下のフォームに貼り付けて保存してください。|保存すると、自動でキーが正しいかテストされます。',
            '注意点として、APIキーは大切な情報です。|他の人に教えたり、インターネット上に公開しないでください。',
            'また、Googleのエーアイサービスは従量課金制です。|無料枠もありますが、たくさん使うと料金がかかる場合があります。',
            '設定が完了したら、ブロックエディターでAI機能を使って、コンテンツを自動生成できるようになります。',
        );

        return implode( '|', $texts );
    }

    /**
     * APIキーの検証ステータスを取得
     */
    public static function get_validation_status() {
        return get_option( self::VALIDATION_STATUS_OPTION, array(
            'valid'      => false,
            'message'    => '',
            'checked_at' => '',
        ) );
    }

    /**
     * APIキーをテスト
     */
    public static function test_api_key( $api_key ) {
        $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $api_key;

        $response = wp_remote_post( $endpoint, array(
            'timeout' => 15,
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode( array(
                'contents' => array(
                    array(
                        'parts' => array(
                            array( 'text' => 'Hello' )
                        )
                    )
                ),
                'generationConfig' => array(
                    'maxOutputTokens' => 10,
                ),
            ) ),
        ) );

        if ( is_wp_error( $response ) ) {
            return array(
                'valid'   => false,
                'message' => 'ネットワークエラー: ' . $response->get_error_message(),
            );
        }

        $code = wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code === 200 ) {
            return array(
                'valid'   => true,
                'message' => 'APIキーは有効です',
            );
        }

        // エラーメッセージを解析
        $error_message = isset( $body['error']['message'] ) ? $body['error']['message'] : '';

        if ( strpos( $error_message, 'API_KEY_INVALID' ) !== false ) {
            return array(
                'valid'   => false,
                'message' => 'APIキーが無効です。正しいキーを入力してください。',
            );
        }

        if ( strpos( $error_message, 'PERMISSION_DENIED' ) !== false ) {
            return array(
                'valid'   => false,
                'message' => 'このAPIキーにはGemini APIへのアクセス権限がありません。',
            );
        }

        if ( $code === 429 ) {
            return array(
                'valid'   => true,
                'message' => 'APIキーは有効ですが、レート制限に達しています。しばらく待ってから使用してください。',
            );
        }

        return array(
            'valid'   => false,
            'message' => 'エラー（コード ' . $code . '）: ' . $error_message,
        );
    }

    /**
     * Ajax: APIキーをリセット
     */
    public static function ajax_reset_api_key() {
        check_ajax_referer( 'lw_ai_admin_settings_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => '権限がありません' ) );
        }

        delete_option( self::OPTION_NAME );
        delete_option( self::VALIDATION_STATUS_OPTION );

        wp_send_json_success( array(
            'message' => 'APIキーをリセットしました',
        ) );
    }

    /**
     * Ajax: APIキーを検証
     */
    public static function ajax_validate_api_key() {
        check_ajax_referer( 'lw_ai_admin_settings_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => '権限がありません' ) );
        }

        $api_key = self::get_api_key();
        if ( empty( $api_key ) ) {
            wp_send_json_error( array( 'message' => 'APIキーが設定されていません' ) );
        }

        $result = self::test_api_key( $api_key );
        $result['checked_at'] = current_time( 'Y-m-d H:i:s' );

        update_option( self::VALIDATION_STATUS_OPTION, $result );

        if ( $result['valid'] ) {
            wp_send_json_success( $result );
        } else {
            wp_send_json_error( $result );
        }
    }

    /**
     * Ajax: APIキーを保存（検証付き）
     */
    public static function ajax_save_api_key() {
        check_ajax_referer( 'lw_ai_admin_settings_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => '権限がありません' ) );
        }

        $api_key = isset( $_POST['api_key'] ) ? sanitize_text_field( $_POST['api_key'] ) : '';

        if ( empty( $api_key ) ) {
            wp_send_json_error( array( 'message' => 'APIキーを入力してください' ) );
        }

        // フォーマットチェック
        if ( strpos( $api_key, 'AIza' ) !== 0 ) {
            wp_send_json_error( array(
                'message' => 'APIキーの形式が正しくありません。「AIza」で始まるキーを入力してください。',
            ) );
        }

        // APIをテスト
        $test_result = self::test_api_key( $api_key );

        if ( ! $test_result['valid'] ) {
            wp_send_json_error( array(
                'message' => $test_result['message'],
            ) );
        }

        // 保存
        $encrypted = self::encrypt( $api_key );
        if ( $encrypted ) {
            update_option( self::OPTION_NAME, $encrypted );
            $test_result['checked_at'] = current_time( 'Y-m-d H:i:s' );
            update_option( self::VALIDATION_STATUS_OPTION, $test_result );

            wp_send_json_success( array(
                'message'    => 'APIキーを保存しました。接続テストも成功しました！',
                'masked_key' => substr( $api_key, 0, 10 ) . str_repeat( '*', strlen( $api_key ) - 10 ),
            ) );
        } else {
            wp_send_json_error( array( 'message' => '暗号化に失敗しました' ) );
        }
    }

    /**
     * 設定ページを描画
     */
    public static function render_settings_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // ★ 未設定 or 未同意 → セットアップウィザードにリダイレクト
        $is_premium = defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true;
        if ( $is_premium && ( ! self::has_agreed_terms() || empty( self::get_api_key() ) ) ) {
            echo '<script>window.location.href="' . esc_url( home_url( '/lw-ai-setup/' ) ) . '";</script>';
            return;
        }
        $premium_url = function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium';

        // プレミアムプランでない場合はロック画面を表示
        if ( ! $is_premium ) {
            ?>
            <div class="lw-ai-settings-wrap">
                <div class="lw-ai-premium-lock-screen">
                    <div class="lw-ai-premium-lock-content">
                        <div class="lw-ai-premium-lock-icon">
                            <span class="dashicons dashicons-lock"></span>
                        </div>
                        <h1>プレミアム機能</h1>
                        <p class="lw-ai-premium-lock-message">
                            <strong>LiteWord AI Generator</strong>は、LiteWordプレミアムプラン限定の機能です。
                        </p>
                        <div class="lw-ai-premium-lock-features">
                            <h3>AI機能でできること</h3>
                            <ul>
                                <li>
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    AIによる自動ページ生成
                                </li>
                                <li>
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    ブロック設定のAI最適化
                                </li>
                                <li>
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    テキスト選択AI機能
                                </li>
                                <li>
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    AI使用量の確認
                                </li>
                            </ul>
                        </div>
                        <div class="lw-ai-premium-lock-actions">
                            <a href="<?php echo esc_url( $premium_url ); ?>" class="lw-ai-premium-upgrade-btn" target="_blank">
                                <span class="dashicons dashicons-star-filled"></span>
                                プレミアムプランの詳細を見る
                            </a>
                            <a href="<?php echo esc_url( admin_url( 'index.php' ) ); ?>" class="lw-ai-premium-back-btn">
                                ダッシュボードに戻る
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <?php
            return;
        }

        $has_agreed = self::has_agreed_terms();
        $api_key = self::get_api_key();
        $has_key = ! empty( $api_key );
        $masked_key = $has_key ? substr( $api_key, 0, 4 ) . str_repeat( '●', 20 ) . substr( $api_key, -4 ) : '';
        $validation_status = self::get_validation_status();
        ?>
        <div class="lw-ai-settings-wrap">

            <!-- ヘッダー -->
            <div class="lw-ai-settings-header">
                <div class="lw-ai-header-top">
                    <h1>
                        <span class="dashicons dashicons-superhero-alt"></span>
                        LiteWord AI Generator 設定
                    </h1>
                </div>
                <p>AIによる自動ページ生成機能の設定・管理</p>
            </div>

            <!-- セットアップウィザードへの導線 -->
            <div class="lw-ai-card">
                <div class="lw-ai-card-body" style="text-align:center; padding: 20px;">
                    <p style="margin-bottom: 12px;">APIキーの設定・変更はセットアップウィザードから行えます。</p>
                    <a href="<?php echo esc_url( home_url( '/lw-ai-setup/' ) ); ?>" class="button button-primary" style="font-size: 14px; padding: 8px 24px;">
                        <span class="dashicons dashicons-admin-tools" style="margin-top: 4px;"></span>
                        セットアップウィザードを開く
                    </a>
                </div>
            </div>

            <!-- APIキー入力フォーム -->
            <div class="lw-ai-card">
                <div class="lw-ai-card-header">
                    <h2>
                        <span class="dashicons dashicons-admin-network"></span>
                        Gemini APIキーの設定
                    </h2>
                </div>
                <div class="lw-ai-card-body">
                    <!-- ステータス表示 -->
                    <div id="lw-ai-status-container">
                        <?php if ( $has_key ) : ?>
                            <?php if ( $validation_status['valid'] ) : ?>
                                <div class="lw-ai-status lw-ai-status-success">
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    <div>
                                        <strong>APIキー設定済み - 接続確認OK</strong><br>
                                        <?php if ( ! empty( $validation_status['checked_at'] ) ) : ?>
                                            <small>最終確認: <?php echo esc_html( $validation_status['checked_at'] ); ?></small>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php else : ?>
                                <div class="lw-ai-status lw-ai-status-warning">
                                    <span class="dashicons dashicons-warning"></span>
                                    <div>
                                        <strong>APIキー設定済み - 接続未確認</strong><br>
                                        <?php if ( ! empty( $validation_status['message'] ) ) : ?>
                                            <small><?php echo esc_html( $validation_status['message'] ); ?></small>
                                        <?php else : ?>
                                            <small>「接続テスト」ボタンでAPIキーの有効性を確認できます</small>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        <?php else : ?>
                            <div class="lw-ai-status lw-ai-status-error">
                                <span class="dashicons dashicons-warning"></span>
                                <div>
                                    <strong>APIキーが設定されていません</strong><br>
                                    AI機能を使用するには、上記の手順でAPIキーを取得し、下のフォームに入力してください。
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- 設定済み表示 -->
                    <div id="lw-ai-key-display" class="lw-ai-api-form has-key" <?php echo ! $has_key ? 'style="display:none;"' : ''; ?>>
                        <label class="lw-ai-form-label">
                            現在のAPIキー
                        </label>
                        <div class="lw-ai-masked-input">
                            <input
                                type="text"
                                value="<?php echo esc_attr( $masked_key ); ?>"
                                class="lw-ai-form-input"
                                disabled
                                readonly
                            />
                            <span class="lw-ai-lock-icon">
                                <span class="dashicons dashicons-lock"></span>
                            </span>
                        </div>
                        <p class="lw-ai-form-help">
                            セキュリティのため、APIキーはマスク表示されています。
                        </p>

                        <div class="lw-ai-security-badge">
                            <span class="dashicons dashicons-lock"></span>
                            AES-256暗号化で安全に保存されています
                        </div>

                        <div class="lw-ai-button-group">
                            <button type="button" class="lw-ai-btn lw-ai-btn-secondary" id="lw-ai-test-btn">
                                <span class="dashicons dashicons-update"></span>
                                接続テスト
                            </button>
                            <button type="button" class="lw-ai-btn lw-ai-btn-danger" id="lw-ai-reset-btn">
                                <span class="dashicons dashicons-trash"></span>
                                設定をリセット
                            </button>
                        </div>
                    </div>

                    <!-- 新規入力フォーム -->
                    <div id="lw-ai-key-form" class="lw-ai-api-form" <?php echo $has_key ? 'style="display:none;"' : ''; ?>>
                        <label class="lw-ai-form-label" for="lw_ai_api_key_input">
                            Gemini APIキー
                        </label>
                        <input
                            type="password"
                            id="lw_ai_api_key_input"
                            class="lw-ai-form-input"
                            placeholder="AIza... から始まるAPIキーを入力"
                            autocomplete="off"
                        />
                        <p class="lw-ai-form-help">
                            Google AI Studioで取得したAPIキーを入力してください。保存時に自動で接続テストを行います。
                        </p>

                        <div class="lw-ai-security-badge">
                            <span class="dashicons dashicons-lock"></span>
                            AES-256暗号化で安全に保存されます
                        </div>

                        <p style="margin-top: 20px;">
                            <button type="button" class="lw-ai-submit-btn" id="lw-ai-save-btn">
                                <span class="lw-ai-btn-icon">
                                    <span class="dashicons dashicons-saved"></span>
                                </span>
                                <span class="lw-ai-btn-text">設定を保存</span>
                                <span class="lw-ai-btn-loading" style="display:none;">
                                    <span class="lw-ai-spinner"></span>
                                    検証中...
                                </span>
                            </button>
                        </p>
                    </div>

                    <!-- メッセージ表示エリア -->
                    <div id="lw-ai-message" style="display:none;"></div>
                </div>
            </div>

            <!-- トラブルシューティング -->
            <div class="lw-ai-card">
                <div class="lw-ai-card-header">
                    <h2>
                        <span class="dashicons dashicons-sos"></span>
                        トラブルシューティング
                    </h2>
                </div>
                <div class="lw-ai-card-body lw-ai-troubleshoot">
                    <div class="lw-ai-troubleshoot-item">
                        <div class="lw-ai-troubleshoot-q">
                            <span class="dashicons dashicons-editor-help"></span>
                            「APIキーが無効です」というエラーが表示される
                        </div>
                        <div class="lw-ai-troubleshoot-a">
                            <strong>原因：</strong>APIキーが無効化されているか、入力ミスの可能性があります。<br>
                            <strong>解決方法：</strong>
                            <ol>
                                <li>APIキーが<code>AIza</code>で始まっているか確認してください</li>
                                <li>キーの前後に余分なスペースがないか確認してください</li>
                                <li>Google AI Studioで新しいキーを作成してください</li>
                            </ol>
                        </div>
                    </div>

                    <div class="lw-ai-troubleshoot-item">
                        <div class="lw-ai-troubleshoot-q">
                            <span class="dashicons dashicons-editor-help"></span>
                            「アクセス権限がありません」というエラーが表示される
                        </div>
                        <div class="lw-ai-troubleshoot-a">
                            <strong>原因：</strong>Google Workspaceアカウントや地域制限の可能性があります。<br>
                            <strong>解決方法：</strong>
                            <ol>
                                <li>個人のGmailアカウントでGoogle AI Studioにアクセスしてください</li>
                                <li>新しいAPIキーを作成してください</li>
                                <li>企業アカウントの場合、管理者にAPI利用の許可を確認してください</li>
                            </ol>
                        </div>
                    </div>

                    <div class="lw-ai-troubleshoot-item">
                        <div class="lw-ai-troubleshoot-q">
                            <span class="dashicons dashicons-editor-help"></span>
                            接続テストが失敗する
                        </div>
                        <div class="lw-ai-troubleshoot-a">
                            <strong>原因：</strong>ネットワーク問題またはサーバー側の一時的な問題が考えられます。<br>
                            <strong>解決方法：</strong>
                            <ol>
                                <li>インターネット接続を確認してください</li>
                                <li>しばらく時間をおいてから再度テストしてください</li>
                                <li>ファイアウォールがGoogle APIへの接続をブロックしていないか確認してください</li>
                            </ol>
                        </div>
                    </div>

                    <div class="lw-ai-troubleshoot-item">
                        <div class="lw-ai-troubleshoot-q">
                            <span class="dashicons dashicons-editor-help"></span>
                            料金はかかりますか？
                        </div>
                        <div class="lw-ai-troubleshoot-a">
                            <strong>回答：</strong>Gemini APIには無料枠があります。<br>
                            <ul>
                                <li><strong>無料枠：</strong>1分あたり15リクエスト、1日あたり1,500リクエストまで無料</li>
                                <li><strong>超過した場合：</strong>従量課金制（入力100万トークンあたり約$0.075）</li>
                                <li>通常の使用では無料枠内で十分です</li>
                            </ul>
                            詳細は<a href="https://ai.google.dev/pricing" target="_blank" rel="noopener">Google AI 料金ページ</a>をご確認ください。
                        </div>
                    </div>
                </div>
            </div>

            <!-- セキュリティ情報 -->
            <div class="lw-ai-card">
                <div class="lw-ai-card-header">
                    <h2>
                        <span class="dashicons dashicons-shield"></span>
                        セキュリティについて
                    </h2>
                </div>
                <div class="lw-ai-card-body">
                    <div class="lw-ai-notice lw-ai-notice-info">
                        <span class="dashicons dashicons-lock"></span>
                        <div>
                            <strong>APIキーは安全に保存されます</strong><br>
                            入力されたAPIキーは<strong>AES-256暗号化</strong>を使用してデータベースに保存されます。
                            平文（そのままの文字列）では保存されません。
                        </div>
                    </div>

                    <div class="lw-ai-notice lw-ai-notice-warning">
                        <span class="dashicons dashicons-warning"></span>
                        <div>
                            <strong>APIキーの取り扱いに注意</strong><br>
                            <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                                <li>APIキーを第三者に共有しないでください</li>
                                <li>公開リポジトリにAPIキーをコミットしないでください</li>
                                <li>不正利用が疑われる場合は、Google AI Studioでキーを無効化し、新しいキーを作成してください</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
        (function() {
            var synth = window.speechSynthesis;
            if (!synth) return;

            var currentBtn = null;

            document.querySelectorAll('.lw-ai-neko-voice-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    // 再生中なら停止
                    if (currentBtn === btn) {
                        synth.cancel();
                        btn.classList.remove('playing');
                        currentBtn = null;
                        return;
                    }

                    // 他のボタンが再生中なら停止
                    if (currentBtn) {
                        synth.cancel();
                        currentBtn.classList.remove('playing');
                    }

                    var text = btn.getAttribute('data-voice-text') || '';
                    if (!text) return;

                    btn.classList.add('playing');
                    currentBtn = btn;

                    var parts = text.split('|');
                    var index = 0;

                    function speakNext() {
                        if (index >= parts.length) {
                            btn.classList.remove('playing');
                            currentBtn = null;
                            return;
                        }
                        var utter = new SpeechSynthesisUtterance(parts[index].trim());
                        utter.lang = 'ja-JP';
                        utter.rate = 1.15;
                        utter.pitch = 1.2;
                        var voices = synth.getVoices();
                        var jaVoice = voices.find(function(v) { return v.lang.startsWith('ja'); });
                        if (jaVoice) utter.voice = jaVoice;
                        utter.onend = function() { index++; speakNext(); };
                        synth.speak(utter);
                    }
                    speakNext();
                });
            });
        })();
        </script>
        <?php
    }
}
