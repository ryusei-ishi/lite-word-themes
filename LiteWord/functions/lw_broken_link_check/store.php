<?php
/**
 * リンク一覧 — スキャン結果（ページごとのリンク一覧）の保存先。
 *
 * テーブル: {prefix}lw_link_list（1行 = 1ページ）
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
function lw_link_list_get_table_name() {
    global $wpdb;
    return $wpdb->prefix . 'lw_link_list';
}

/**
 * データベーステーブル作成
 *
 * 🚨 dbDelta() は「あるべき定義」と DESCRIBE の結果を文字列で突き合わせるため、
 *    整数型の表示幅（smallint(5)）や文字セットの申告差で毎回「違う」と判定し、
 *    ALTER TABLE を投げ続けることがある。InnoDB の ALTER はメタデータロックを取るので
 *    アクセスが増えるほど直列化して遅延が跳ね上がる。
 *    2026-08-20 に mail_form/reception_history.php が同じ罠で
 *    lite-word.com を 774ms まで落としている（issue-log/2026-08-20-dbdelta-every-request.md）。
 *    → 必ずバージョンガードを通し、初回だけ走らせること。
 *
 * @param bool $force ガードを無視して実行する（テーブルを消された場合の復旧用）。
 * @return void
 */
function lw_link_list_create_table( $force = false ) {
    if ( ! $force && LW_LINK_LIST_DB_VERSION === get_option( LW_LINK_LIST_DB_VERSION_OPTION ) ) {
        return;
    }

    global $wpdb;

    $table_name      = lw_link_list_get_table_name();
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        post_id bigint(20) UNSIGNED NOT NULL,
        post_type varchar(50) NOT NULL,
        post_title varchar(255) NOT NULL,
        links_json longtext NOT NULL,
        ids_json longtext,
        link_count int(11) NOT NULL DEFAULT 0,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY post_id (post_id),
        KEY post_type (post_type)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );

    // autoload させて毎リクエストの追加クエリを出さない
    update_option( LW_LINK_LIST_DB_VERSION_OPTION, LW_LINK_LIST_DB_VERSION, true );
}

/**
 * テーブルが存在するか
 *
 * @return bool
 */
function lw_link_list_table_exists() {
    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    return (bool) $wpdb->get_var(
        $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name )
    );
}

/**
 * データベースにデータがあるか確認
 *
 * @return bool
 */
function lw_link_list_has_data() {
    if ( ! lw_link_list_table_exists() ) {
        return false;
    }

    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    return (int) $wpdb->get_var( "SELECT COUNT(*) FROM $table_name" ) > 0;
}

/**
 * 最終更新日時を取得
 *
 * @return string|null
 */
function lw_link_list_get_last_updated() {
    if ( ! lw_link_list_table_exists() ) {
        return null;
    }

    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    return $wpdb->get_var( "SELECT MAX(updated_at) FROM $table_name" );
}

/**
 * データベースからリンク情報を取得
 *
 * 各リンクには scope（そのリンクがどこから来たか）を付けて返す。
 *
 *   body   … 本文にある。一覧からリンク先を書き換えられる
 *   page   … そのページ固有だが本文の外（動的ブロックの出力など）。編集はできない
 *   common … ヘッダー・フッター・メニュー。多くのページに同じものが出る
 *
 * common を分けているのは一覧を読めるようにするため。
 * しっかりスキャンはフッターまで拾うので、そのまま並べると
 * フッター20本 × 20ページ = 400行の繰り返しが本文リンクを埋めてしまう。
 *
 * @param bool $with_scope scope を付けるか（共通リンクの判定処理から呼ぶときだけ false）。
 * @return array ['links' => リンク配列, 'pages' => 全ページ情報配列]
 */
function lw_link_list_get_from_db( $with_scope = true ) {
    $empty = array(
        'links' => array(),
        'pages' => array(),
    );

    if ( ! lw_link_list_table_exists() ) {
        return $empty;
    }

    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    $results = $wpdb->get_results(
        "SELECT * FROM $table_name ORDER BY post_type, post_id",
        ARRAY_A
    );

    if ( ! $results ) {
        return $empty;
    }

    // 共通リンクの判定結果（href => 出現ページ数）。軽いスキャンのあとは空
    $common = $with_scope ? lw_link_list_get_common_links() : array();

    $all_links = array();
    $all_pages = array();

    foreach ( $results as $row ) {
        $post_id   = (int) $row['post_id'];
        $edit_link = get_edit_post_link( $post_id, 'raw' );

        // id属性リストを取得
        $ids = array();
        if ( ! empty( $row['ids_json'] ) ) {
            $decoded = json_decode( $row['ids_json'], true );
            if ( is_array( $decoded ) ) {
                $ids = $decoded;
            }
        }

        // ページ情報を記録（リンクの有無に関わらず）
        $all_pages[] = array(
            'post_id'    => $post_id,
            'post_type'  => $row['post_type'],
            'post_title' => $row['post_title'],
            'link_count' => (int) $row['link_count'],
            'edit_link'  => $edit_link,
            'ids'        => $ids,
        );

        // リンク情報を展開
        $links = json_decode( $row['links_json'], true );
        if ( is_array( $links ) && count( $links ) > 0 ) {
            foreach ( $links as $link ) {
                $link['source_type']  = 'post';
                $link['source_id']    = $post_id;
                $link['source_title'] = $row['post_title'];
                $link['post_type']    = $row['post_type'];
                $link['edit_link']    = $edit_link;
                $link['scope']        = lw_link_list_link_scope( $link, $common );

                if ( 'common' === $link['scope'] ) {
                    $href                = isset( $link['href'] ) ? (string) $link['href'] : '';
                    $link['common_pages'] = isset( $common[ $href ] ) ? (int) $common[ $href ] : 0;
                }

                $all_links[] = $link;
            }
        }
    }

    return array(
        'links' => $all_links,
        'pages' => $all_pages,
    );
}

/**
 * そのリンクがどこから来たものかを判定する。
 *
 * @param array $link   リンク1件。
 * @param array $common 共通と判定済みの href（href => 出現ページ数）。
 * @return string 'body' | 'page' | 'common'
 */
function lw_link_list_link_scope( $link, $common ) {
    // 本文にあるものは link_index を持つ（＝一覧から書き換えられる）
    if ( isset( $link['link_index'] ) && (int) $link['link_index'] >= 0 ) {
        return 'body';
    }

    $href = isset( $link['href'] ) ? (string) $link['href'] : '';

    if ( '' !== $href && isset( $common[ $href ] ) ) {
        return 'common';
    }

    return 'page';
}

/**
 * スキャンを始める（テーブルを用意して中身を空にする）。
 *
 * バッチスキャンの1回目だけ呼ぶこと。2回目以降で呼ぶと前のバッチが消える。
 *
 * @return void
 */
function lw_link_list_begin_scan() {
    lw_link_list_create_table();

    global $wpdb;
    $table_name = lw_link_list_get_table_name();

    $wpdb->query( "TRUNCATE TABLE $table_name" );
}

/**
 * スキャン結果（1バッチ分）を保存する。
 *
 * @param array $pages スキャナが返した pages（各要素に links を持つ）。
 * @return int 保存した件数。
 */
function lw_link_list_save_pages( $pages ) {
    if ( empty( $pages ) ) {
        return 0;
    }

    global $wpdb;
    $table_name = lw_link_list_get_table_name();
    $saved      = 0;

    foreach ( $pages as $page ) {
        $links = isset( $page['links'] ) && is_array( $page['links'] ) ? $page['links'] : array();
        $ids   = isset( $page['ids'] ) && is_array( $page['ids'] ) ? $page['ids'] : array();

        // 保存するのは表示に必要な分だけ（full_tag は巨大になるので落とす）
        $slim_links = array();
        foreach ( $links as $link ) {
            $slim_links[] = array(
                'href'         => isset( $link['href'] ) ? $link['href'] : '',
                'text'         => isset( $link['text'] ) ? $link['text'] : '',
                'source_field' => isset( $link['source_field'] ) ? $link['source_field'] : 'post_content',
                'link_index'   => isset( $link['link_index'] ) ? (int) $link['link_index'] : 0,
            );
        }

        $result = $wpdb->replace(
            $table_name,
            array(
                'post_id'    => (int) $page['post_id'],
                'post_type'  => $page['post_type'],
                'post_title' => $page['post_title'],
                'links_json' => wp_json_encode( $slim_links, JSON_UNESCAPED_UNICODE ),
                'ids_json'   => wp_json_encode( $ids, JSON_UNESCAPED_UNICODE ),
                'link_count' => count( $slim_links ),
            ),
            array( '%d', '%s', '%s', '%s', '%s', '%d' )
        );

        if ( false !== $result ) {
            ++$saved;
        }
    }

    return $saved;
}

/**
 * 1ページ分のリンク情報を更新する（投稿の保存後・インライン編集後に使う）。
 *
 * @param int   $post_id 対象。
 * @param array $links   リンク配列。
 * @param array $ids     id属性配列。
 * @return void
 */
function lw_link_list_update_page( $post_id, $links, $ids ) {
    if ( ! lw_link_list_table_exists() ) {
        return;
    }

    global $wpdb;

    $wpdb->update(
        lw_link_list_get_table_name(),
        array(
            'links_json' => wp_json_encode( $links, JSON_UNESCAPED_UNICODE ),
            'ids_json'   => wp_json_encode( $ids, JSON_UNESCAPED_UNICODE ),
            'link_count' => count( $links ),
        ),
        array( 'post_id' => (int) $post_id ),
        array( '%s', '%s', '%d' ),
        array( '%d' )
    );
}
