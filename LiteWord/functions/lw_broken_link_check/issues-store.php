<?php
/**
 * サイト診断 — 指摘の保存先。
 *
 * テーブル: {prefix}lw_site_issues
 *
 * 🚨 1ページ × 1ルール = 最大1件（UNIQUE KEY post_rule）。
 *    「画像386枚に説明文が無い」を386行にすると、一覧が読めなくなるうえ
 *    テーブルが実データで数千行に膨らむ。件数は context に持たせて、行は1つにする。
 *    （lite-word.com の実測: 本文画像575枚のうち386枚が alt 空・74ページに分布）
 *
 * post_id = 0 は「サイト全体への指摘」（どのページとも結びつかないもの）。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * テーブル名。
 *
 * @return string
 */
function lw_site_issues_table() {
    global $wpdb;
    return $wpdb->prefix . 'lw_site_issues';
}

/**
 * テーブル作成（🚨 バージョンガード必須）。
 *
 * dbDelta を毎リクエスト走らせると ALTER TABLE が飛び続ける。
 * 2026-08-20 に mail_form/reception_history.php がこれで lite-word.com を
 * 774ms まで落としている。option に版を持って、同じ版なら何もしない。
 *
 * @param bool $force ガードを無視する。
 * @return void
 */
function lw_site_issues_create_table( $force = false ) {
    if ( ! $force && LW_SITE_ISSUES_DB_VERSION === get_option( LW_SITE_ISSUES_DB_VERSION_OPTION ) ) {
        return;
    }

    global $wpdb;

    $table_name      = lw_site_issues_table();
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        post_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
        rule_id varchar(20) NOT NULL,
        severity varchar(10) NOT NULL,
        message varchar(255) NOT NULL DEFAULT '',
        context_json longtext,
        detected_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY post_rule (post_id, rule_id),
        KEY severity (severity),
        KEY rule_id (rule_id)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );

    update_option( LW_SITE_ISSUES_DB_VERSION_OPTION, LW_SITE_ISSUES_DB_VERSION, true );
}

/**
 * テーブルがあるか。
 *
 * @return bool
 */
function lw_site_issues_table_exists() {
    global $wpdb;

    return (bool) $wpdb->get_var(
        $wpdb->prepare( 'SHOW TABLES LIKE %s', lw_site_issues_table() )
    );
}

/**
 * 指摘1件を組み立てる（ルールはこの形の配列を返す）。
 *
 * @param int    $post_id  対象。サイト全体なら 0。
 * @param string $rule_id  R10 など。
 * @param string $severity critical | warning | info。
 * @param string $message  利用者に見せる1行。
 * @param array  $context  具体的な値（件数・URL・対象ID）。
 * @return array
 */
function lw_site_issue_make( $post_id, $rule_id, $severity, $message, $context = array() ) {
    return array(
        'post_id'  => (int) $post_id,
        'rule_id'  => (string) $rule_id,
        'severity' => in_array( $severity, array( 'critical', 'warning', 'info' ), true ) ? $severity : 'info',
        'message'  => (string) $message,
        'context'  => is_array( $context ) ? $context : array(),
    );
}

/**
 * 指摘をまとめて保存する（同じ post_id × rule_id は上書き）。
 *
 * @param array $issues lw_site_issue_make() が返した配列の配列。
 * @return int 保存件数。
 */
function lw_site_issues_save( $issues ) {
    if ( empty( $issues ) || ! is_array( $issues ) ) {
        return 0;
    }

    lw_site_issues_create_table();

    global $wpdb;
    $table_name = lw_site_issues_table();
    $saved      = 0;

    foreach ( $issues as $issue ) {
        if ( empty( $issue['rule_id'] ) ) {
            continue;
        }

        $result = $wpdb->replace(
            $table_name,
            array(
                'post_id'      => isset( $issue['post_id'] ) ? (int) $issue['post_id'] : 0,
                'rule_id'      => (string) $issue['rule_id'],
                'severity'     => isset( $issue['severity'] ) ? $issue['severity'] : 'info',
                // _mb_substr は mbstring が無い環境でも動く（wp-includes/compat.php）
                'message'      => _mb_substr( isset( $issue['message'] ) ? (string) $issue['message'] : '', 0, 255 ),
                'context_json' => wp_json_encode( isset( $issue['context'] ) ? $issue['context'] : array(), JSON_UNESCAPED_UNICODE ),
                'detected_at'  => current_time( 'mysql' ),
            ),
            array( '%d', '%s', '%s', '%s', '%s', '%s' )
        );

        if ( false !== $result ) {
            ++$saved;
        }
    }

    return $saved;
}

/**
 * 指摘を全部消す（診断をやり直すとき）。
 *
 * @return void
 */
function lw_site_issues_clear() {
    if ( ! lw_site_issues_table_exists() ) {
        return;
    }

    global $wpdb;
    $table_name = lw_site_issues_table();

    $wpdb->query( "TRUNCATE TABLE $table_name" );
}

/**
 * 指定したルールの指摘だけ消す。
 *
 * ページ系ルール（巡回しないと判定できないもの）を、巡回しない診断で
 * 消してしまわないために使う。消さずに上書きだけすると、直したページの
 * 指摘が永久に残る。
 *
 * @param array $rule_ids 対象のルールID。
 * @return void
 */
function lw_site_issues_clear_rules( $rule_ids ) {
    if ( empty( $rule_ids ) || ! lw_site_issues_table_exists() ) {
        return;
    }

    global $wpdb;
    $table_name = lw_site_issues_table();

    $placeholders = implode( ',', array_fill( 0, count( $rule_ids ), '%s' ) );

    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM $table_name WHERE rule_id IN ($placeholders)",
            $rule_ids
        )
    );
}

/**
 * 1ページ分の指摘を消す（そのページを調べ直す前に呼ぶ）。
 *
 * @param int   $post_id  対象。
 * @param array $rule_ids 限定するルールID（省略でそのページの全部）。
 * @return void
 */
function lw_site_issues_clear_for_post( $post_id, $rule_ids = array() ) {
    if ( ! lw_site_issues_table_exists() ) {
        return;
    }

    global $wpdb;
    $table_name = lw_site_issues_table();

    if ( empty( $rule_ids ) ) {
        $wpdb->delete( $table_name, array( 'post_id' => (int) $post_id ), array( '%d' ) );
        return;
    }

    $placeholders = implode( ',', array_fill( 0, count( $rule_ids ), '%s' ) );
    $params       = array_merge( array( (int) $post_id ), $rule_ids );

    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM $table_name WHERE post_id = %d AND rule_id IN ($placeholders)",
            $params
        )
    );
}
