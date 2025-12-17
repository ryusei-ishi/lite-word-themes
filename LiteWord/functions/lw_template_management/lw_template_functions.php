<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * テーブルの自動生成
 */
/**
 * 買い切り専用ブロック（サブスクリプションで除外するブロック）を返す
 * ------------------------------------------------------------
 * @return array 除外するブロックの配列
 */
function block_Outright_purchase_only() {
    // デバッグ用：コンソールログにも出力
    // error_log('[LW Debug] block_Outright_purchase_only() called');

    // デフォルトの除外対象ブロック
    $exclude_blocks = [
        "template_001,shin_gas_station_01" => [
            "shin-gas-station-01-fv-top",
            "shin-gas-station-01-fv-lower-01",
            "shin-gas-station-01-custom-title-1",
            "shin-gas-station-01-custom-title-2",
            "shin-gas-station-01-news",
            "shin-gas-station-01-list-1",
            "shin-gas-station-01-list-2",
            "shin-gas-station-01-list-3",
            "shin-gas-station-01-list-4",
            "shin-gas-station-01-step-1",
            "shin-gas-station-01-post-list",
            "shin-gas-station-01-cta",
            "shin-gas-station-01-cta2",
            "shin-gas-station-01-message-01",
            "shin-gas-station-01-company-01",
            "shin-gas-station-01-shop-list-1",
            "shin-gas-station-01-contact",
            "shin-gas-station-01-button-01",
        ],
        "kaoru_lp_01" =>[
            "paid-block-fv-8",
            "paid-block-cta-3",
        ]
    ];
    
    $templateSetting = new LwTemplateSetting();
    $final_exclude = [];
    
    foreach ( $exclude_blocks as $key => $value ) {
        // 連想配列の場合（テンプレート依存のブロック群）
        if ( is_string($key) && is_array($value) ) {
            // カンマ区切りのテンプレートIDを分割
            $template_ids = array_map('trim', explode(',', $key));
            $template_is_active = false;
            
            // いずれかのテンプレートがアクティブかチェック
            foreach ( $template_ids as $template_id ) {
                $template_setting = $templateSetting->get_template_setting_by_id( $template_id );
                if ( $template_setting && intval( $template_setting['active_flag'] ) === 1 ) {
                    $template_is_active = true;
                    break;
                }
            }
            
            // テンプレートがアクティブでない場合、配下のブロックを除外対象に追加
            if ( ! $template_is_active ) {
                // 配下の各ブロックも個別購入済みかチェック
                foreach ( $value as $block_id ) {
                    $block_setting = $templateSetting->get_template_setting_by_id( $block_id );
                    if ( $block_setting && intval( $block_setting['active_flag'] ) === 1 ) {
                        // このブロック自体が個別購入済みなので除外リストから外す
                        continue;
                    }
                    $final_exclude[] = $block_id;
                }
            }
        }
        // 通常の配列要素の場合（単独の買い切り専用ブロック）
        else {
            $block_id = $value;
            $block_setting = $templateSetting->get_template_setting_by_id( $block_id );
            if ( $block_setting && intval( $block_setting['active_flag'] ) === 1 ) {
                // このブロック自体が購入済みなので除外リストから外す
                continue;
            }
            $final_exclude[] = $block_id;
        }
    }
    
    // 買い切り専用ブロックは、プレミアムプランや試用期間中でも
    // 個別購入していなければ除外対象とする
    return $final_exclude;
}
// テーマが切り替わったときにテーブル作成
add_action('after_switch_theme', 'create_lw_template_setting_table');

/**
 * サブスクリプション状態をチェックして返す
 * ------------------------------------------------------------
 * paid-lw-parts-sub-hbjkjhkljh または sub_pre_set が
 * アクティブな場合にtrueを返す
 */
// lw_define_subscription_constant()を修正
function lw_define_subscription_constant() {
    $templateSetting = new LwTemplateSetting();

    // paid-lw-parts-sub-hbjkjhkljhをチェック
    $paid_sub = $templateSetting->get_template_setting_by_id('paid-lw-parts-sub-hbjkjhkljh');
    $paid_sub_active = ($paid_sub && intval($paid_sub['active_flag']) === 1);

    // sub_pre_setをチェック
    $sub_pre_set = $templateSetting->get_template_setting_by_id('sub_pre_set');
    $sub_pre_set_active = ($sub_pre_set && intval($sub_pre_set['active_flag']) === 1);

    // 試用期間をチェック（追加）
    $trial_period = $templateSetting->get_template_setting_by_id('trial_period');
    if ($trial_period && intval($trial_period['active_flag']) === 1) {
        // 14日間の期限内かチェック
        $start_date = strtotime($trial_period['timestamp']);
        $end_date = strtotime('+14 days', $start_date);
        $now = time();

        if ($now <= $end_date) {
            return true; // 試用期間中
        }
    }

    // サブスクリプションがアクティブならtrue
    return ($paid_sub_active || $sub_pre_set_active);
}

// functions.php読み込み時に即座に定義
if (!defined('LW_HAS_SUBSCRIPTION')) {
    define('LW_HAS_SUBSCRIPTION', lw_define_subscription_constant());
}
// JavaScriptに変数を出力
add_action('wp_head', function() {
    ?>
    <script>
        window.LW_HAS_SUBSCRIPTION = <?php echo json_encode(LW_HAS_SUBSCRIPTION); ?>;
    </script>
    <?php
});
// ログイン時にもテーブル作成を確認
add_action('wp_login', 'create_lw_template_setting_table_on_login', 10, 2);
function create_lw_template_setting_table_on_login($user_login, $user) {
    // 管理者権限を持つユーザーのログイン時のみ実行（任意）
    if (user_can($user, 'administrator')) {
        create_lw_template_setting_table();
    }
}
function create_lw_template_setting_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'lw_template_setting';
    $charset_collate = $wpdb->get_charset_collate();

    // テーブルが存在しない場合に作成
    if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_name}'" ) != $table_name ) {
        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            template_id varchar(255) NOT NULL,
            timestamp datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            active_flag tinyint(1) DEFAULT 1 NOT NULL,
            PRIMARY KEY (id)
        ) {$charset_collate};";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }
}
/* =========================================================
 * URL を正規化して [host, path] を返す
 *   - http/https・www の違いを無視
 *   - 末尾スラッシュ付与
 *   - パスは小文字化
 * ======================================================= */
function lw_normalize_url_parts_1( $url ) {
	$url = trim( $url );
	if ( $url === '' ) return [ '', '/' ];

	if ( ! preg_match( '#^https?://#i', $url ) ) {
		$url = 'https://' . ltrim( $url, '/' );
	}
	$parts = wp_parse_url( trailingslashit( $url ) );
	$host  = strtolower( preg_replace( '/^www\./i', '', $parts['host'] ?? '' ) );
	$path  = strtolower( $parts['path'] ?? '/' );

	return [ $host, $path ];
}
/**
 * 共通：API取得データからテンプレート設定を更新
 */
function lw_process_api_data_to_templates( $data ) {
    if ( empty( $data['success'] ) ) {
        return false;
    }
    
    global $wpdb;
    $table = $wpdb->prefix . 'lw_template_setting';

    $normalize_func = function_exists( 'lw_normalize_url_parts_2' ) ? 
                      'lw_normalize_url_parts_2' : 'lw_normalize_url_parts_1';
    [ $site_host, $site_path ] = $normalize_func( trailingslashit( home_url() ) );

    if ( ! empty( $data['login_id'] ) ) {
        update_option( 'lw_shop_login_id', sanitize_text_field( $data['login_id'] ) );
    }

    // 購入済みテンプレートIDを収集
    $purchased_template_ids = [];
    
    // paid-lw-parts-sub-hbjkjhkljhの存在チェック
    $has_special_template = false;
    if ( ! empty( $data['purchases'] ) && is_array( $data['purchases'] ) ) {
        foreach ( $data['purchases'] as $item ) {
            $template_id = sanitize_text_field( $item['template_id'] ?? '' );
            if ( $template_id !== '' ) {
                $purchased_template_ids[] = $template_id;
                if ( $template_id === 'paid-lw-parts-sub-hbjkjhkljh' ) {
                    $has_special_template = true;
                }
            }
        }
    }
    
    // サブスクリプションがある場合はsub_pre_setも購入済みとして扱う
    if ( ! empty( $data['subscription'] ) && $data['subscription']['is_active'] === true ) {
        $purchased_template_ids[] = 'sub_pre_set';
    }
    
    // データベースにある全テンプレートのactive_flagを一旦0にする
    // （購入していないものを確実に無効化するため）
    $existing_templates = $wpdb->get_results( 
        "SELECT template_id FROM {$table}", 
        ARRAY_A 
    );
    
    foreach ( $existing_templates as $existing ) {
        $template_id = $existing['template_id'];

        // trial_period は購入管理とは別なのでスキップ（追加）
        if ( $template_id === 'trial_period' ) {
            continue;
        }
        // 購入リストにないテンプレートはactive_flag=0にする
        if ( ! in_array( $template_id, $purchased_template_ids ) ) {
            $wpdb->update(
                $table,
                [ 'active_flag' => 0 ],
                [ 'template_id' => $template_id ],
                [ '%d' ],
                [ '%s' ]
            );
        }
    }
    
    // paid-lw-parts-sub-hbjkjhkljhを明示的に処理
    lw_save_or_update_template( 
        'paid-lw-parts-sub-hbjkjhkljh', 
        current_time( 'mysql' ), 
        $has_special_template ? 1 : 0 
    );

    // サブスクリプション処理
    if ( ! empty( $data['subscription'] ) && $data['subscription']['is_active'] === true ) {
        $sub_active_flag = 0;

        if ( ! empty( $data['domains'] ) && is_array( $data['domains'] ) ) {
            foreach ( $data['domains'] as $domain_info ) {
                if ( $domain_info['status'] === 'active' ) {
                    [ $d_host, $d_path ] = $normalize_func( $domain_info['domain'] );
                    
                    if ( $d_host === $site_host || 
                        substr( $site_host, -(strlen( $d_host ) + 1) ) === '.' . $d_host ) {
                        $sub_active_flag = 1;
                        break;
                    }
                }
            }
        }

        lw_save_or_update_template( 'sub_pre_set', current_time( 'mysql' ), $sub_active_flag );
    } else {
        // サブスクリプションが無効または存在しない場合、明示的に0にする
        lw_save_or_update_template( 'sub_pre_set', current_time( 'mysql' ), 0 );
    }

    // その他の購入履歴処理
    if ( ! empty( $data['purchases'] ) && is_array( $data['purchases'] ) ) {
        foreach ( $data['purchases'] as $item ) {
            $template_id = sanitize_text_field( $item['template_id'] ?? '' );
            
            // paid-lw-parts-sub-hbjkjhkljhは上で処理済みなのでスキップ
            if ( $template_id === '' || $template_id === 'paid-lw-parts-sub-hbjkjhkljh' ) continue;

            $purchase_date = sanitize_text_field( $item['purchase_date'] ?? '' );
            $active_flag = intval( $item['active_flag'] ?? 0 );
            $allowed_raw = sanitize_text_field( $item['allowed_domain'] ?? '' );

            if ( $allowed_raw !== '' ) {
                $allowed_list = array_map( 'trim', explode( ',', $allowed_raw ) );
                $match_ok = false;

                foreach ( $allowed_list as $allow_url ) {
                    [ $a_host, $a_path ] = $normalize_func( $allow_url );
                    if ( $a_host === '' ) continue;

                    if ( $site_host === $a_host && strpos( $site_path, $a_path ) === 0 ) {
                        $match_ok = true;
                        break;
                    }
                }

                if ( ! $match_ok ) {
                    $active_flag = 0;
                }
            }

            lw_save_or_update_template( $template_id, $purchase_date, $active_flag );
        }
    }

    update_option( 'lw_expansion_base_functions', true );
    return true;
}
/**
 * 共通：テンプレート設定の保存/更新
 */
function lw_save_or_update_template( $template_id, $timestamp, $active_flag ) {
    global $wpdb;
    $table = $wpdb->prefix . 'lw_template_setting';

    $exists = $wpdb->get_var(
        $wpdb->prepare( "SELECT COUNT(*) FROM {$table} WHERE template_id = %s", $template_id )
    );

    if ( $exists ) {
        $wpdb->update(
            $table,
            [ 'timestamp' => $timestamp, 'active_flag' => $active_flag ],
            [ 'template_id' => $template_id ],
            [ '%s', '%d' ],
            [ '%s' ]
        );
    } else {
        $wpdb->insert(
            $table,
            [ 'template_id' => $template_id, 'timestamp' => $timestamp, 'active_flag' => $active_flag ],
            [ '%s', '%s', '%d' ]
        );
    }
}
// ログイン時
add_action( 'wp_login', 'lw_auto_fetch_templates_on_login', 10, 2 );
function lw_auto_fetch_templates_on_login( $user_login, $user ) {
    if ( ! user_can( $user, 'administrator' ) ) return;
    
    $token = get_user_meta( $user->ID, 'lw_target_shop_token', true );
    if ( empty( $token ) ) return;
    
    // 現在のサイトドメインを取得
    $current_domain = wp_parse_url( home_url(), PHP_URL_HOST );
    
    $shop_url = "https://shop.lite-word.com";// 本番用
    $shop_test_url = "http://localhost/SUPPORT_LOUNGE/LiteWord_SHOP"; // テスト用
    
    // APIリクエストにドメインパラメータを追加
    $api = $shop_url . '/wp-json/liteword/v1/secure-purchase-history?token=' . urlencode( $token ) . '&domain=' . urlencode( $current_domain );
    
    $response = wp_remote_get( $api );
    if ( is_wp_error( $response ) ) return;

    $data = json_decode( wp_remote_retrieve_body( $response ), true );
    lw_process_api_data_to_templates( $data );
}



/**
 * LiteWord テンプレート設定クラス
*/
class LwTemplateSetting {

    private $table_name;
    private $all_settings = null;        // 全データのキャッシュ
    private $active_settings = null;     // active = 1 のデータキャッシュ

    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'lw_template_setting';
    }

    /**
     * lw_template_setting テーブルの全データを取得（非キャッシュ）
     */
    public function get_template_settings() {
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM {$this->table_name}", ARRAY_A);
    }

    /**
     * 指定された template_id のデータを取得（キャッシュあり）
     */
    public function get_template_setting_by_id($template_id) {
        $settings = $this->get_all_settings_assoc();
        return $settings[$template_id] ?? null;
    }

    /**
     * template_id が存在するかを判定（キャッシュあり）
     */
    public function has_template_id($template_id) {
        $settings = $this->get_all_settings_assoc();
        return isset($settings[$template_id]);
    }

    /**
     * active_flag = 1 のデータを取得（キャッシュなし。従来互換）
     */
    public function get_active_templates() {
        return array_values($this->get_active_templates_assoc());
    }

    /**
     * 有効なテンプレートの template_id 配列を返す（キャッシュあり）
     */
    public function get_active_template_ids() {
        $active_templates = $this->get_active_templates_assoc();
        return array_keys($active_templates);
    }

    /**
     * lw_template_setting テーブルの全データを [template_id => row] 形式で取得（キャッシュ付き）
     */
    public function get_all_settings_assoc() {
        if ($this->all_settings === null) {
            global $wpdb;
            $results = $wpdb->get_results("SELECT * FROM {$this->table_name}", ARRAY_A);
            $assoc = [];
            foreach ($results as $row) {
                $assoc[$row['template_id']] = $row;
            }
            $this->all_settings = $assoc;
        }
        return $this->all_settings;
    }

    /**
     * active_flag = 1 のデータを [template_id => row] 形式で取得（キャッシュ付き）
     */
    public function get_active_templates_assoc() {
        if ($this->active_settings === null) {
            global $wpdb;
            $results = $wpdb->get_results("SELECT * FROM {$this->table_name} WHERE active_flag = 1", ARRAY_A);
            $assoc = [];
            foreach ($results as $row) {
                $assoc[$row['template_id']] = $row;
            }
            $this->active_settings = $assoc;
        }
        return $this->active_settings;
    }

    /**
     * 新しいテンプレート設定を保存し、キャッシュをクリア
     */
    public function save_template_setting($template_id, $active_flag = 1) {
        global $wpdb;

        $result = $wpdb->insert(
            $this->table_name,
            array(
                'template_id' => $template_id,
                'timestamp' => current_time('mysql'),
                'active_flag' => $active_flag
            ),
            array('%s', '%s', '%d')
        );

        // キャッシュリセット
        $this->all_settings = null;
        $this->active_settings = null;

        return $result !== false;
    }
}

// テンプレートがあるかのcheck
function templateSettingCheck($id) {
    $templateSetting = new LwTemplateSetting();
    return $templateSetting->has_template_id($id);
}

//有料で有効なtemplate_idを配列で取得
// function lw_active_template_ids() {
//     $templateSetting = new LwTemplateSetting();
//     //データベースに保存されているtemplate_idを取得し配列に格納
//     $template_settings = $templateSetting->get_active_templates();
//     $template_ids = [];
//     foreach ($template_settings as $template_setting) {
//         $template_ids[] = $template_setting['template_id'];
//     }
//     //重複していたら削除
//     $template_ids = array_unique($template_ids);
//     return $template_ids;
// }




function lw_active_template_ids($page_template_url = "", $shop_url = "") {
    $templateSetting = new LwTemplateSetting();
    $template_settings = $templateSetting->get_active_templates();

    $template_ids = [];
    foreach ($template_settings as $template_setting) {
        $template_ids[] = $template_setting['template_id'];
    }

    $template_ids = array_unique($template_ids);

    $template_items = LwTemplateItems($page_template_url, $shop_url);

    foreach ($template_items as $item) {
        if (
            isset($item['item_detail']['paid']) &&
            $item['item_detail']['paid'] === true &&
            isset($item['item_detail']['template_id']) &&
            in_array($item['item_detail']['template_id'], $template_ids)
        ) {
            if (isset($item['item_detail']['block_used']) && is_array($item['item_detail']['block_used'])) {
                foreach ($item['item_detail']['block_used'] as $block_id) {
                    $template_ids[] = $block_id;
                }
            }
        }
    }

    return array_values(array_unique($template_ids));
}


//有料で有効なページテンプレート専用のブロックを配列で取得
function lw_active_page_template() {
    // テンプレートアイテムを取得
    $LwTemplateItems = LwTemplateItems();
    $templateSetting = new LwTemplateSetting();
    $blocks_arr = [];

    foreach ($LwTemplateItems as $item) {
        // 有料テンプレートのみを処理
        if (isset($item['item_detail']) && !empty($item['item_detail']['paid']) && $item['item_detail']['paid'] === true) {
            $template_id = $item['item_detail']['template_id'];
            $block_used = $item['item_detail']['block_used'] ?? []; // block_usedが存在しない場合は空配列
            
            // template_idがデータベースに存在し、active_flag = 1（購入済み）かをチェック
            $template_setting = $templateSetting->get_template_setting_by_id($template_id);
            if (!$template_setting || intval($template_setting['active_flag']) !== 1) {
                continue;
            }

            // block_usedのブロックを追加
            foreach ($block_used as $block) {
                $blocks_arr[] = $block;
            }
        }
    }

    // 重複していたら削除
    $blocks_arr = array_unique($blocks_arr);
    return $blocks_arr;
}







