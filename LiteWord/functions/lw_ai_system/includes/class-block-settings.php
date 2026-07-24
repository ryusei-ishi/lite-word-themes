<?php
/**
 * ブロック設定ページクラス
 *
 * @package LiteWord_AI_Page_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class LW_AI_Generator_Block_Settings
 */
class LW_AI_Generator_Block_Settings {

    /**
     * 最大選択可能ブロック数
     */
    const MAX_BLOCKS = 20;

    /**
     * 初期化
     */
    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'add_menu_page' ) );
        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
        add_action( 'wp_ajax_lw_ai_save_block_settings', array( __CLASS__, 'ajax_save_settings' ) );
    }

    /**
     * メニューページを追加
     */
    public static function add_menu_page() {
        // 現在未使用のため無効化（2026-01-05）
        return;

        // プレミアムプランでない場合はメニューを表示しない
        if ( ! ( defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true ) ) {
            return;
        }

        add_submenu_page(
            'options-general.php',
            'AI生成ブロック設定',
            'AI生成ブロック',
            'manage_options',
            'lw-ai-block-settings',
            array( __CLASS__, 'render_page' )
        );
    }

    /**
     * アセットを読み込み
     */
    public static function enqueue_assets( $hook ) {
        if ( $hook !== 'settings_page_lw-ai-block-settings' ) {
            return;
        }

        wp_enqueue_style(
            'lw-ai-block-settings',
            LW_AI_SYSTEM_URL . 'assets/css/block-settings.css',
            array(),
            LW_AI_SYSTEM_VERSION
        );

        wp_enqueue_script(
            'lw-ai-block-settings',
            LW_AI_SYSTEM_URL . 'assets/js/block-settings.js',
            array( 'jquery' ),
            LW_AI_SYSTEM_VERSION,
            true
        );

        wp_localize_script(
            'lw-ai-block-settings',
            'lwAiBlockSettings',
            array(
                'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
                'nonce'     => wp_create_nonce( 'lw_ai_block_settings_nonce' ),
                'maxBlocks' => self::MAX_BLOCKS,
            )
        );
    }

    /**
     * 全ブロック定義を取得（各ブロックのblock.jsonから直接読み込み）
     */
    public static function get_all_blocks() {
        $blocks = array();
        $build_dir = get_template_directory() . '/my-blocks/build';

        if ( ! is_dir( $build_dir ) ) {
            return array();
        }

        // buildディレクトリ内の全ディレクトリを取得
        $block_dirs = glob( $build_dir . '/*', GLOB_ONLYDIR );

        if ( empty( $block_dirs ) ) {
            return array();
        }

        foreach ( $block_dirs as $block_dir ) {
            $block_json_path = $block_dir . '/block.json';

            // block.jsonが存在しない場合はスキップ
            if ( ! file_exists( $block_json_path ) ) {
                continue;
            }

            // block.jsonを読み込み
            $json_content = file_get_contents( $block_json_path );
            $block_data = json_decode( $json_content, true );

            if ( json_last_error() !== JSON_ERROR_NONE || empty( $block_data ) ) {
                continue;
            }

            // 必要なフィールドを抽出
            $name = isset( $block_data['name'] ) ? $block_data['name'] : '';
            if ( empty( $name ) ) {
                continue;
            }

            // slug を name から抽出（例: "wdl/lw-pr-fv-14" → "lw-pr-fv-14"）
            $slug = strpos( $name, '/' ) !== false ? substr( $name, strpos( $name, '/' ) + 1 ) : $name;

            // blockType を判定（命名規則に基づく）
            $blockType = 'free';
            if ( strpos( $slug, 'paid-block-' ) === 0 || strpos( $slug, 'lw-pr-' ) === 0 ) {
                $blockType = 'premium';
            }

            // ブロック情報を構築
            $block = array(
                'name'       => $name,
                'title'      => isset( $block_data['title'] ) ? $block_data['title'] : $slug,
                'icon'       => isset( $block_data['icon'] ) ? $block_data['icon'] : 'block-default',
                'category'   => isset( $block_data['category'] ) ? $block_data['category'] : 'common',
                'supports'   => isset( $block_data['supports'] ) ? $block_data['supports'] : array(),
                'attributes' => isset( $block_data['attributes'] ) ? $block_data['attributes'] : array(),
                'slug'       => $slug,
                'blockType'  => $blockType,
            );

            // オプションフィールドを追加
            if ( isset( $block_data['no'] ) ) {
                $block['no'] = $block_data['no'];
            }
            if ( isset( $block_data['aiNotes'] ) ) {
                $block['aiNotes'] = $block_data['aiNotes'];
            }
            if ( isset( $block_data['aiDescription'] ) ) {
                $block['aiDescription'] = $block_data['aiDescription'];
            }

            // aiHint（全142ブロックが持つ）を取り込む。
            // 従来は aiDescription / aiNotes を持つ9ブロックしか一覧に載らず、
            // 残り133ブロックはAIから存在が見えていなかった。
            // aiHint には用途の説明と、テキスト・画像を入れる正確な属性名が入っている。
            if ( isset( $block_data['aiHint'] ) && is_array( $block_data['aiHint'] ) ) {
                $hint           = $block_data['aiHint'];
                $block['aiHint'] = $hint;

                // 説明は aiHint 側を既定にする（aiDescription があればそちらを優先）
                if ( empty( $block['aiDescription'] ) && ! empty( $hint['description'] ) ) {
                    $block['aiDescription'] = $hint['description'];
                }

                // AIに入れさせたい属性名（推測ではなく実在する名前）
                if ( ! empty( $hint['contentAttributes'] ) ) {
                    $block['contentAttributes'] = $hint['contentAttributes'];
                }
                if ( ! empty( $hint['imageAttributes'] ) ) {
                    $block['imageAttributes'] = $hint['imageAttributes'];
                }

                // 自動選択から外したいブロックの指定
                if ( ! empty( $hint['excludeFromAutoSelect'] ) ) {
                    $block['excludeFromAutoSelect'] = true;
                }
            }

            // 説明が用意されているブロックだけを一覧に載せる
            // （aiHint の追加により、対象は9件から142件へ広がる）
            if ( ! empty( $block['aiDescription'] ) || ! empty( $block['aiNotes'] ) ) {
                $blocks[] = $block;
            }
        }

        // no フィールドでソート（存在する場合）
        usort( $blocks, function( $a, $b ) {
            $no_a = isset( $a['no'] ) ? $a['no'] : 9999;
            $no_b = isset( $b['no'] ) ? $b['no'] : 9999;
            return $no_a - $no_b;
        });

        return $blocks;
    }

    /**
     * 生成されたブロックに実際のテキストが入っているかを検査する
     *
     * AIが属性名を間違えたり、値を入れ忘れたりすると、
     * 見た目は生成できているのにサンプル文言のまま公開される事故が起きる。
     * 「テキストがちゃんと入っているか」を機械的に確認するための検査。
     *
     * @param array $blocks 生成されたブロック配列（name / attributes を持つ）
     * @return array{ok:bool,issues:array,checked:int} 検査結果
     */
    public static function inspect_generated_blocks( $blocks ) {
        $issues  = array();
        $checked = 0;

        if ( ! is_array( $blocks ) ) {
            return array( 'ok' => true, 'issues' => array(), 'checked' => 0 );
        }

        // 差し替え忘れを示すサンプル文言
        $placeholders = array( 'テキストテキスト', 'サンプルテキスト', 'Lite Word', 'ダミー', 'lorem ipsum' );

        $catalog = array();
        foreach ( self::get_all_blocks() as $block ) {
            $catalog[ $block['name'] ] = $block;
        }

        foreach ( $blocks as $block ) {
            // 生成系の正規形は blockName（name は正規化前の互換キー）。両方見る
            $name = isset( $block['blockName'] ) ? $block['blockName'] : ( isset( $block['name'] ) ? $block['name'] : '' );
            if ( '' === $name || ! isset( $catalog[ $name ] ) ) {
                continue;
            }

            $checked++;
            $attrs         = isset( $block['attributes'] ) ? $block['attributes'] : array();
            $text_fields   = isset( $catalog[ $name ]['contentAttributes'] ) ? $catalog[ $name ]['contentAttributes'] : array();
            $filled        = 0;

            foreach ( $text_fields as $field ) {
                $value = isset( $attrs[ $field ] ) ? $attrs[ $field ] : null;

                if ( is_string( $value ) && '' !== trim( wp_strip_all_tags( $value ) ) ) {
                    $filled++;

                    foreach ( $placeholders as $ph ) {
                        if ( false !== stripos( $value, $ph ) ) {
                            $issues[] = array(
                                'block'  => $name,
                                'field'  => $field,
                                'reason' => 'サンプル文言が残っています（' . $ph . '）',
                            );
                            break;
                        }
                    }
                }
            }

            // テキスト欄を持つブロックなのに1つも埋まっていない
            if ( ! empty( $text_fields ) && 0 === $filled ) {
                $issues[] = array(
                    'block'  => $name,
                    'field'  => implode( ' / ', $text_fields ),
                    'reason' => 'テキストが1つも入っていません（属性名の誤りの可能性）',
                );
            }
        }

        return array(
            'ok'      => empty( $issues ),
            'issues'  => $issues,
            'checked' => $checked,
        );
    }

    /**
     * AIにブロックを選ばせるための軽量な一覧を返す
     *
     * get_all_blocks() は attributes の完全定義を含むため、142ブロック分だと
     * 46KB（約1.2万トークン）になりプロンプトを圧迫する。
     * ブロックを「選ぶ」のに必要なのは用途の説明と、値を入れる属性名だけなので、
     * それだけに絞ったものを返す。属性の型や既定値が要る場面では
     * get_block_definitions() / get_single_block_definition() を使うこと。
     *
     * @param array $allowed_names 対象を絞る場合はブロック名の配列（省略時は全件）
     * @return array
     */
    public static function get_block_catalog( $allowed_names = array() ) {
        $catalog     = array();
        $found_names = array();

        foreach ( self::get_all_blocks() as $block ) {
            if ( ! empty( $allowed_names ) && ! in_array( $block['name'], $allowed_names, true ) ) {
                continue;
            }

            // 自動選択から外す指定があるブロックは候補に出さない。
            // ただし呼び出し元が許可リストで明示指定した場合は、その意思を優先する
            // （purpose.json の厳選には lw-space-1 等の除外指定ブロックが含まれる）。
            if ( empty( $allowed_names ) && ! empty( $block['excludeFromAutoSelect'] ) ) {
                continue;
            }

            $found_names[] = $block['name'];

            $item = array(
                'name'        => $block['name'],
                'title'       => $block['title'],
                'description' => isset( $block['aiDescription'] ) ? $block['aiDescription'] : '',
                'type'        => $block['blockType'],
            );

            if ( ! empty( $block['contentAttributes'] ) ) {
                $item['textFields'] = $block['contentAttributes'];
            }
            if ( ! empty( $block['imageAttributes'] ) ) {
                $item['imageFields'] = $block['imageAttributes'];
            }
            if ( ! empty( $block['aiNotes'] ) ) {
                $item['notes'] = $block['aiNotes'];
            }

            $catalog[] = $item;
        }

        // 許可リストに実在しない名前が混ざっていたら気付けるようにしておく
        // （purpose.json の書き間違いで黙って候補が減る事故の再発防止）。
        if ( ! empty( $allowed_names ) ) {
            $missing = array_diff( $allowed_names, $found_names );
            if ( ! empty( $missing ) ) {
                error_log( '[LW AI] get_block_catalog: 許可リストに実在しないブロック名: ' . implode( ', ', $missing ) );
            }
        }

        return $catalog;
    }

    /**
     * 保存された設定を取得
     */
    public static function get_saved_settings() {
        $default = array(
            'enabled_blocks' => array(),
            'block_prompts'  => array(),
        );

        $settings = get_option( 'lw_ai_generator_block_settings', $default );

        return wp_parse_args( $settings, $default );
    }

    /**
     * 有効なブロックのslug一覧を取得
     */
    public static function get_enabled_block_slugs() {
        $settings = self::get_saved_settings();
        return $settings['enabled_blocks'];
    }

    /**
     * ブロックのプロンプト一覧を取得
     */
    public static function get_block_prompts() {
        $settings = self::get_saved_settings();
        return $settings['block_prompts'];
    }

    /**
     * 設定ページを描画
     */
    public static function render_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // プレミアムプランチェック
        $is_premium = defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true;
        $premium_url = function_exists('lw_premium_info_link') ? lw_premium_info_link() : 'https://shop.lite-word.com/purchase-premium';

        // プレミアムプランでない場合はロック画面を表示
        if ( ! $is_premium ) {
            ?>
            <div class="wrap lw-ai-block-settings-wrap">
                <div class="lw-ai-premium-lock-screen">
                    <div class="lw-ai-premium-lock-content">
                        <div class="lw-ai-premium-lock-icon">
                            <span class="dashicons dashicons-lock"></span>
                        </div>
                        <h1>プレミアム機能</h1>
                        <p class="lw-ai-premium-lock-message">
                            <strong>AI生成ブロック設定</strong>は、LiteWordプレミアムプラン限定の機能です。
                        </p>
                        <div class="lw-ai-premium-lock-features">
                            <h3>この機能でできること</h3>
                            <ul>
                                <li>
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    AIが使用するブロックの選択・設定
                                </li>
                                <li>
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    ブロックごとのプロンプト最適化
                                </li>
                                <li>
                                    <span class="dashicons dashicons-yes-alt"></span>
                                    カテゴリ別ブロック管理
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

        $all_blocks = self::get_all_blocks();
        $settings = self::get_saved_settings();
        $enabled_blocks = $settings['enabled_blocks'];
        $block_prompts = $settings['block_prompts'];

        // カテゴリでグループ化
        $blocks_by_category = array();
        foreach ( $all_blocks as $block ) {
            $category = isset( $block['category'] ) ? $block['category'] : 'other';
            if ( ! isset( $blocks_by_category[ $category ] ) ) {
                $blocks_by_category[ $category ] = array();
            }
            $blocks_by_category[ $category ][] = $block;
        }

        ksort( $blocks_by_category );

        ?>
        <div class="wrap lw-ai-block-settings-wrap">
            <div class="lw-ai-header">
                <h1>
                    <span class="lw-ai-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    AI生成ブロック設定
                </h1>
                <p class="lw-ai-description">AIがページ生成時に使用するブロックを選択し、各ブロックの使用方法を指示できます。</p>
            </div>

            <div class="lw-ai-status-bar">
                <div class="lw-ai-counter">
                    <span class="lw-ai-counter-current">0</span>
                    <span class="lw-ai-counter-separator">/</span>
                    <span class="lw-ai-counter-max"><?php echo self::MAX_BLOCKS; ?></span>
                    <span class="lw-ai-counter-label">ブロック選択中</span>
                </div>
                <div class="lw-ai-actions">
                    <button type="button" class="lw-ai-btn lw-ai-btn-secondary" id="lw-ai-clear-all">
                        すべて解除
                    </button>
                    <button type="button" class="lw-ai-btn lw-ai-btn-primary" id="lw-ai-save-settings">
                        <span class="lw-ai-btn-text">設定を保存</span>
                        <span class="lw-ai-btn-loading" style="display:none;">
                            <svg class="lw-ai-spinner" width="16" height="16" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="32" stroke-linecap="round"/>
                            </svg>
                            保存中...
                        </span>
                    </button>
                </div>
            </div>

            <div class="lw-ai-notice lw-ai-notice-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>ブロック数を絞ることでAIの精度が向上します。用途に合ったブロックを<strong>最大<?php echo self::MAX_BLOCKS; ?>個</strong>まで選択してください。</p>
            </div>

            <div class="lw-ai-categories">
                <?php foreach ( $blocks_by_category as $category => $blocks ) : ?>
                    <div class="lw-ai-category" data-category="<?php echo esc_attr( $category ); ?>">
                        <div class="lw-ai-category-header">
                            <h2>
                                <span class="lw-ai-category-icon"></span>
                                <?php echo esc_html( $category ); ?>
                                <span class="lw-ai-category-count"><?php echo count( $blocks ); ?>個</span>
                            </h2>
                            <button type="button" class="lw-ai-category-toggle" aria-expanded="true">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div class="lw-ai-category-content">
                            <div class="lw-ai-block-grid">
                                <?php foreach ( $blocks as $block ) :
                                    $slug = isset( $block['slug'] ) ? $block['slug'] : '';
                                    $name = isset( $block['name'] ) ? $block['name'] : $slug;
                                    $title = isset( $block['title'] ) ? $block['title'] : $name;
                                    $block_type = isset( $block['blockType'] ) ? $block['blockType'] : 'free';
                                    $ai_description = isset( $block['aiDescription'] ) ? $block['aiDescription'] : '';
                                    $checked = in_array( $slug, $enabled_blocks, true );
                                    $prompt = isset( $block_prompts[ $slug ] ) ? $block_prompts[ $slug ] : '';
                                ?>
                                    <div class="lw-ai-block-card <?php echo $checked ? 'is-selected' : ''; ?>" data-slug="<?php echo esc_attr( $slug ); ?>">
                                        <div class="lw-ai-block-card-header">
                                            <label class="lw-ai-checkbox">
                                                <input type="checkbox"
                                                       name="enabled_blocks[]"
                                                       value="<?php echo esc_attr( $slug ); ?>"
                                                       <?php checked( $checked ); ?> />
                                                <span class="lw-ai-checkbox-mark">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </span>
                                            </label>
                                            <div class="lw-ai-block-info">
                                                <h3 class="lw-ai-block-title"><?php echo esc_html( $title ); ?></h3>
                                                <span class="lw-ai-block-name"><?php echo esc_html( $name ); ?></span>
                                            </div>
                                            <?php if ( $block_type !== 'free' ) : ?>
                                                <span class="lw-ai-block-badge lw-ai-block-badge-<?php echo esc_attr( $block_type ); ?>">
                                                    <?php echo $block_type === 'paid' ? '有料' : 'プレミアム'; ?>
                                                </span>
                                            <?php endif; ?>
                                        </div>

                                        <?php if ( $ai_description ) : ?>
                                            <p class="lw-ai-block-description"><?php echo esc_html( $ai_description ); ?></p>
                                        <?php endif; ?>

                                        <div class="lw-ai-block-prompt-section">
                                            <label class="lw-ai-prompt-label">
                                                <span class="lw-ai-prompt-label-text">AI指示（プロンプト）</span>
                                                <button type="button" class="lw-ai-prompt-toggle" aria-expanded="<?php echo $prompt ? 'true' : 'false'; ?>">
                                                    <?php echo $prompt ? '閉じる' : '設定する'; ?>
                                                </button>
                                            </label>
                                            <div class="lw-ai-prompt-field" style="<?php echo $prompt ? '' : 'display:none;'; ?>">
                                                <textarea
                                                    name="block_prompts[<?php echo esc_attr( $slug ); ?>]"
                                                    placeholder="例：このブロックはファーストビューに使用してください。背景画像は必ず設定してください。"
                                                    rows="3"
                                                ><?php echo esc_textarea( $prompt ); ?></textarea>
                                                <p class="lw-ai-prompt-hint">このブロックの使い方や注意点をAIに指示できます</p>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="lw-ai-footer">
                <button type="button" class="lw-ai-btn lw-ai-btn-primary lw-ai-btn-large" id="lw-ai-save-settings-bottom">
                    <span class="lw-ai-btn-text">設定を保存</span>
                    <span class="lw-ai-btn-loading" style="display:none;">
                        <svg class="lw-ai-spinner" width="16" height="16" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="32" stroke-linecap="round"/>
                        </svg>
                        保存中...
                    </span>
                </button>
            </div>
        </div>

        <div class="lw-ai-toast" id="lw-ai-toast" style="display:none;">
            <span class="lw-ai-toast-icon"></span>
            <span class="lw-ai-toast-message"></span>
        </div>
        <?php
    }

    /**
     * Ajax: 設定を保存
     */
    public static function ajax_save_settings() {
        check_ajax_referer( 'lw_ai_block_settings_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => '権限がありません' ) );
        }

        $enabled_blocks = isset( $_POST['enabled_blocks'] ) ? $_POST['enabled_blocks'] : array();
        $block_prompts = isset( $_POST['block_prompts'] ) ? $_POST['block_prompts'] : array();

        // サニタイズ
        $enabled_blocks = array_map( 'sanitize_text_field', $enabled_blocks );
        $enabled_blocks = array_slice( $enabled_blocks, 0, self::MAX_BLOCKS );

        $sanitized_prompts = array();
        foreach ( $block_prompts as $slug => $prompt ) {
            $slug = sanitize_text_field( $slug );
            $prompt = sanitize_textarea_field( $prompt );
            if ( ! empty( $prompt ) ) {
                $sanitized_prompts[ $slug ] = $prompt;
            }
        }

        $settings = array(
            'enabled_blocks' => $enabled_blocks,
            'block_prompts'  => $sanitized_prompts,
        );

        update_option( 'lw_ai_generator_block_settings', $settings );

        wp_send_json_success( array(
            'message' => '設定を保存しました',
            'count'   => count( $enabled_blocks ),
        ) );
    }
}
