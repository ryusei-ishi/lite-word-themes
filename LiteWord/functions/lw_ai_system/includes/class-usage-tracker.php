<?php
/**
 * API使用量トラッキングクラス
 *
 * @package LiteWord_AI_Page_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class LW_AI_Generator_Usage_Tracker
 */
class LW_AI_Generator_Usage_Tracker {

    /**
     * テーブル名
     */
    const TABLE_NAME = 'lw_ai_usage_logs';

    /**
     * Gemini API 料金（1M トークンあたり USD）
     */
    const PRICING = array(
        'gemini-2.0-flash' => array(
            'input'  => 0.075,  // $0.075 per 1M input tokens
            'output' => 0.30,   // $0.30 per 1M output tokens
        ),
        'imagen-3.0' => array(
            'per_image' => 0.03,  // 約$0.03 per image
        ),
    );

    /**
     * 初期化
     */
    public static function init() {
        // テーブルを即座に作成
        self::maybe_create_table();
    }

    /**
     * テーブルが存在しなければ作成
     */
    public static function maybe_create_table() {
        global $wpdb;

        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // テーブルが既に存在するかチェック
        $table_exists = $wpdb->get_var( $wpdb->prepare(
            "SHOW TABLES LIKE %s",
            $table_name
        ) );

        if ( $table_exists === $table_name ) {
            return;
        }

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            request_type varchar(50) NOT NULL DEFAULT 'text',
            model varchar(100) NOT NULL DEFAULT 'gemini-2.0-flash',
            input_tokens int(11) NOT NULL DEFAULT 0,
            output_tokens int(11) NOT NULL DEFAULT 0,
            image_count int(11) NOT NULL DEFAULT 0,
            estimated_cost_usd decimal(10,6) NOT NULL DEFAULT 0,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY request_type (request_type),
            KEY created_at (created_at)
        ) {$charset_collate};";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );

        error_log( '[LW AI Usage] Table created: ' . $table_name );
    }

    /**
     * 使用量を記録
     *
     * @param string $request_type リクエストタイプ（'layout', 'block_instruction', 'image'）
     * @param string $model モデル名
     * @param int    $input_tokens 入力トークン数
     * @param int    $output_tokens 出力トークン数
     * @param int    $image_count 画像生成数
     */
    public static function log_usage( $request_type, $model, $input_tokens = 0, $output_tokens = 0, $image_count = 0 ) {
        global $wpdb;

        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // テーブルが存在しなければ作成を試みる
        self::maybe_create_table();

        // コスト計算
        $estimated_cost = self::calculate_cost( $model, $input_tokens, $output_tokens, $image_count );

        error_log( sprintf(
            '[LW AI Usage] Logging: type=%s, model=%s, input=%d, output=%d, images=%d, cost=$%.6f',
            $request_type,
            $model,
            $input_tokens,
            $output_tokens,
            $image_count,
            $estimated_cost
        ) );

        $result = $wpdb->insert(
            $table_name,
            array(
                'request_type'       => $request_type,
                'model'              => $model,
                'input_tokens'       => $input_tokens,
                'output_tokens'      => $output_tokens,
                'image_count'        => $image_count,
                'estimated_cost_usd' => $estimated_cost,
                'created_at'         => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%d', '%d', '%d', '%f', '%s' )
        );

        if ( $result === false ) {
            error_log( '[LW AI Usage] Insert failed: ' . $wpdb->last_error );
        } else {
            error_log( '[LW AI Usage] Insert success, ID: ' . $wpdb->insert_id );
        }
    }

    /**
     * コストを計算（USD）
     *
     * @param string $model モデル名
     * @param int    $input_tokens 入力トークン数
     * @param int    $output_tokens 出力トークン数
     * @param int    $image_count 画像生成数
     * @return float
     */
    public static function calculate_cost( $model, $input_tokens, $output_tokens, $image_count ) {
        $cost = 0;

        // テキスト生成コスト
        if ( strpos( $model, 'gemini' ) !== false ) {
            $pricing = self::PRICING['gemini-2.0-flash'];
            $cost += ( $input_tokens / 1000000 ) * $pricing['input'];
            $cost += ( $output_tokens / 1000000 ) * $pricing['output'];
        }

        // 画像生成コスト
        if ( $image_count > 0 ) {
            $cost += $image_count * self::PRICING['imagen-3.0']['per_image'];
        }

        return $cost;
    }

    /**
     * 今日の使用状況を取得
     *
     * @return array
     */
    public static function get_today_stats() {
        global $wpdb;

        $table_name = $wpdb->prefix . self::TABLE_NAME;
        $today = current_time( 'Y-m-d' );

        $stats = $wpdb->get_row( $wpdb->prepare(
            "SELECT
                COUNT(*) as request_count,
                COALESCE(SUM(input_tokens), 0) as total_input_tokens,
                COALESCE(SUM(output_tokens), 0) as total_output_tokens,
                COALESCE(SUM(image_count), 0) as total_images,
                COALESCE(SUM(estimated_cost_usd), 0) as total_cost_usd
            FROM {$table_name}
            WHERE DATE(created_at) = %s",
            $today
        ), ARRAY_A );

        return $stats ?: array(
            'request_count'       => 0,
            'total_input_tokens'  => 0,
            'total_output_tokens' => 0,
            'total_images'        => 0,
            'total_cost_usd'      => 0,
        );
    }

    /**
     * 今月の使用状況を取得
     *
     * @return array
     */
    public static function get_month_stats() {
        global $wpdb;

        $table_name = $wpdb->prefix . self::TABLE_NAME;
        $first_day = current_time( 'Y-m-01' );
        $last_day = current_time( 'Y-m-t' );

        $stats = $wpdb->get_row( $wpdb->prepare(
            "SELECT
                COUNT(*) as request_count,
                COALESCE(SUM(input_tokens), 0) as total_input_tokens,
                COALESCE(SUM(output_tokens), 0) as total_output_tokens,
                COALESCE(SUM(image_count), 0) as total_images,
                COALESCE(SUM(estimated_cost_usd), 0) as total_cost_usd
            FROM {$table_name}
            WHERE DATE(created_at) >= %s AND DATE(created_at) <= %s",
            $first_day,
            $last_day
        ), ARRAY_A );

        return $stats ?: array(
            'request_count'       => 0,
            'total_input_tokens'  => 0,
            'total_output_tokens' => 0,
            'total_images'        => 0,
            'total_cost_usd'      => 0,
        );
    }

    /**
     * 日別の使用状況を取得（過去30日）
     *
     * @return array
     */
    public static function get_daily_stats( $days = 30 ) {
        global $wpdb;

        $table_name = $wpdb->prefix . self::TABLE_NAME;
        $start_date = date( 'Y-m-d', strtotime( "-{$days} days" ) );

        $results = $wpdb->get_results( $wpdb->prepare(
            "SELECT
                DATE(created_at) as date,
                COUNT(*) as request_count,
                COALESCE(SUM(input_tokens), 0) as total_input_tokens,
                COALESCE(SUM(output_tokens), 0) as total_output_tokens,
                COALESCE(SUM(image_count), 0) as total_images,
                COALESCE(SUM(estimated_cost_usd), 0) as total_cost_usd
            FROM {$table_name}
            WHERE DATE(created_at) >= %s
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) DESC",
            $start_date
        ), ARRAY_A );

        return $results ?: array();
    }

    /**
     * リクエストタイプ別の統計を取得
     *
     * @return array
     */
    public static function get_stats_by_type() {
        global $wpdb;

        $table_name = $wpdb->prefix . self::TABLE_NAME;
        $first_day = current_time( 'Y-m-01' );

        $results = $wpdb->get_results( $wpdb->prepare(
            "SELECT
                request_type,
                COUNT(*) as request_count,
                COALESCE(SUM(estimated_cost_usd), 0) as total_cost_usd
            FROM {$table_name}
            WHERE DATE(created_at) >= %s
            GROUP BY request_type",
            $first_day
        ), ARRAY_A );

        return $results ?: array();
    }

    /**
     * 全統計情報を取得（REST API用）
     *
     * @return array
     */
    public static function get_all_stats() {
        // USD/JPYレート（おおよそ）
        $usd_to_jpy = 150;

        $today = self::get_today_stats();
        $month = self::get_month_stats();
        $by_type = self::get_stats_by_type();

        // 円換算
        $today['total_cost_jpy'] = round( floatval( $today['total_cost_usd'] ) * $usd_to_jpy, 2 );
        $month['total_cost_jpy'] = round( floatval( $month['total_cost_usd'] ) * $usd_to_jpy, 2 );

        return array(
            'today'       => $today,
            'month'       => $month,
            'by_type'     => $by_type,
            'usd_to_jpy'  => $usd_to_jpy,
            'last_update' => current_time( 'Y-m-d H:i:s' ),
        );
    }
}
