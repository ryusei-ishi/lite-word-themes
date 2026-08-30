<?php
/**
 * リンク一覧 — 有効性チェック結果の保存先。
 *
 * これが無かったため、チェック結果は画面を離れると消えていた（2024-12-20 からの積み残し）。
 * テーブル: {prefix}lw_link_check_results（1行 = 1URL。同じURLが複数ページから貼られていても1行）
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * テーブル名を取得
 *
 * @return string
 */
function lw_link_check_results_table() {
    global $wpdb;
    return $wpdb->prefix . 'lw_link_check_results';
}

/**
 * テーブル作成（🚨 バージョンガード必須。理由は store.php の同名関数を参照）
 *
 * URL は 2,000 文字を超えることがあり、そのままでは UNIQUE キーに使えない
 * （utf8mb4 のインデックス長制限）。md5 の 32 文字を鍵にする。
 *
 * @param bool $force ガードを無視して実行する。
 * @return void
 */
function lw_link_check_results_create_table( $force = false ) {
    if ( ! $force && LW_LINK_CHECK_DB_VERSION === get_option( LW_LINK_CHECK_DB_VERSION_OPTION ) ) {
        return;
    }

    global $wpdb;

    $table_name      = lw_link_check_results_table();
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        url_hash char(32) NOT NULL,
        url text NOT NULL,
        status varchar(20) NOT NULL,
        status_code smallint(6) UNSIGNED DEFAULT NULL,
        redirect_url text,
        message varchar(255) DEFAULT '',
        checked_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY url_hash (url_hash),
        KEY status (status)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );

    update_option( LW_LINK_CHECK_DB_VERSION_OPTION, LW_LINK_CHECK_DB_VERSION, true );
}

/**
 * テーブルが存在するか
 *
 * @return bool
 */
function lw_link_check_results_table_exists() {
    global $wpdb;

    return (bool) $wpdb->get_var(
        $wpdb->prepare( 'SHOW TABLES LIKE %s', lw_link_check_results_table() )
    );
}

/**
 * チェック結果をまとめて保存する（同じURLは上書き）。
 *
 * @param array $results LW_Broken_Link_Check_Checker が返した結果の配列。
 * @return int 保存件数。
 */
function lw_link_check_results_save( $results ) {
    if ( empty( $results ) || ! is_array( $results ) ) {
        return 0;
    }

    lw_link_check_results_create_table();

    global $wpdb;
    $table_name = lw_link_check_results_table();
    $saved      = 0;

    foreach ( $results as $result ) {
        if ( empty( $result['url'] ) ) {
            continue;
        }

        $url = (string) $result['url'];

        $row = $wpdb->replace(
            $table_name,
            array(
                'url_hash'     => md5( $url ),
                'url'          => $url,
                'status'       => isset( $result['status'] ) ? $result['status'] : 'unknown',
                'status_code'  => isset( $result['status_code'] ) ? $result['status_code'] : null,
                'redirect_url' => isset( $result['redirect_url'] ) ? $result['redirect_url'] : null,
                // _mb_substr は mbstring が無い環境でも動く WordPress 側の実装（compat.php）
                'message'      => isset( $result['message'] ) ? _mb_substr( (string) $result['message'], 0, 255 ) : '',
                'checked_at'   => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%s', '%d', '%s', '%s', '%s' )
        );

        if ( false !== $row ) {
            ++$saved;
        }
    }

    return $saved;
}

/**
 * 保存済みのチェック結果を url => 結果 の形で返す。
 *
 * @return array
 */
function lw_link_check_results_get_all() {
    if ( ! lw_link_check_results_table_exists() ) {
        return array();
    }

    global $wpdb;
    $table_name = lw_link_check_results_table();

    $rows = $wpdb->get_results(
        "SELECT url, status, status_code, redirect_url, message, checked_at FROM $table_name",
        ARRAY_A
    );

    if ( ! $rows ) {
        return array();
    }

    $out = array();
    foreach ( $rows as $row ) {
        $out[ $row['url'] ] = array(
            'url'          => $row['url'],
            'status'       => $row['status'],
            'status_code'  => null !== $row['status_code'] ? (int) $row['status_code'] : null,
            'redirect_url' => $row['redirect_url'],
            'message'      => $row['message'],
            'checked_at'   => $row['checked_at'],
        );
    }

    return $out;
}

/**
 * ステータス別の件数と最終チェック日時を返す。
 *
 * @return array
 */
function lw_link_check_results_get_summary() {
    $summary = array(
        'counts'       => array(),
        'total'        => 0,
        'last_checked' => null,
    );

    if ( ! lw_link_check_results_table_exists() ) {
        return $summary;
    }

    global $wpdb;
    $table_name = lw_link_check_results_table();

    $rows = $wpdb->get_results(
        "SELECT status, COUNT(*) AS cnt FROM $table_name GROUP BY status",
        ARRAY_A
    );

    foreach ( (array) $rows as $row ) {
        $summary['counts'][ $row['status'] ] = (int) $row['cnt'];
        $summary['total']                   += (int) $row['cnt'];
    }

    $summary['last_checked'] = $wpdb->get_var( "SELECT MAX(checked_at) FROM $table_name" );

    return $summary;
}

/**
 * チェック結果を全消しする（チェックを最初からやり直すとき）。
 *
 * @return void
 */
function lw_link_check_results_clear() {
    if ( ! lw_link_check_results_table_exists() ) {
        return;
    }

    global $wpdb;
    $table_name = lw_link_check_results_table();

    $wpdb->query( "TRUNCATE TABLE $table_name" );
}
