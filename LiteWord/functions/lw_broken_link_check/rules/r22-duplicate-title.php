<?php
/**
 * R22 — タイトルが他のページと同じ。
 *
 * 🔴 Google は「同じページ」と判断して片方しか出さない。
 *    量産ページ・複製して作ったページで起きやすい。
 *
 * 実効タイトル＝ SEO設定のタイトル（seo_title）があればそれ、無ければページ名。
 * サイト名の接尾辞は全ページ共通なので、重複判定では見ない（R34 で別に見る）。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 判定する。
 *
 * @return array 指摘の配列。
 */
function lw_site_rule_duplicate_title() {
    $rows = lw_site_rule_collect_public_meta( 'seo_title' );

    if ( empty( $rows ) ) {
        return array();
    }

    $groups = array();

    foreach ( $rows as $row ) {
        $title = ( '' !== $row['meta'] ) ? $row['meta'] : $row['post_title'];
        $title = trim( $title );

        if ( '' === $title ) {
            continue;
        }

        // 🚨 mb_strtolower は使わない（mbstring が無い共用サーバーで Fatal になる）。
        //    strtolower は ASCII の A-Z だけを変える。日本語のバイトは 0x7F 超なので壊れない
        $key = strtolower( $title );

        if ( ! isset( $groups[ $key ] ) ) {
            $groups[ $key ] = array();
        }

        $groups[ $key ][] = $row;
    }

    $issues = array();

    foreach ( $groups as $group ) {
        if ( count( $group ) < 2 ) {
            continue;
        }

        foreach ( $group as $row ) {
            $issues[] = lw_site_issue_make(
                (int) $row['ID'],
                'R22',
                'critical',
                sprintf( '同じタイトルのページが他に%dページあります', count( $group ) - 1 ),
                array(
                    'count' => count( $group ) - 1,
                    'title' => ( '' !== $row['meta'] ) ? $row['meta'] : $row['post_title'],
                )
            );
        }
    }

    return $issues;
}

/**
 * 「検索に出すつもりのページ」と、その postmeta を1回のクエリで集める。
 *
 * 🚨 対象はサイトマップに載っているページだけ（`LW_Site_Diagnostics::is_indexable()`）。
 *    検索に出さないページのタイトルや説明文が重なっていても、実害は無い。
 *    設定（seo_noindex）だけで外すと足りない — プラグインが表示時に noindex を
 *    出しているだけのページを拾ってしまい、lite-word.com では
 *    説明文なし121件・重複36件のほとんどが誤検出だった（2026-08-22 本番実測）。
 *
 * @param string $meta_key 取りたい meta_key。
 * @return array array('ID','post_title','meta') の配列。
 */
function lw_site_rule_collect_public_meta( $meta_key ) {
    global $wpdb;

    $types = LW_Broken_Link_Check_Scanner::get_target_post_types();

    if ( empty( $types ) ) {
        return array();
    }

    $type_ph = implode( ',', array_fill( 0, count( $types ), '%s' ) );
    $params  = array_merge( array( $meta_key, 'seo_noindex' ), $types );

    $rows = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT p.ID, p.post_title,
                    COALESCE(m.meta_value, '') AS meta
             FROM {$wpdb->posts} p
             LEFT JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = %s
             LEFT JOIN {$wpdb->postmeta} n ON n.post_id = p.ID AND n.meta_key = %s
             WHERE p.post_status = 'publish'
               AND p.post_type IN ($type_ph)
               AND ( n.meta_value IS NULL OR n.meta_value <> 'noindex' )
             LIMIT " . LW_Site_Url_Index::MAX_ROWS,
            $params
        ),
        ARRAY_A
    );

    if ( ! is_array( $rows ) ) {
        return array();
    }

    $out = array();

    foreach ( $rows as $row ) {
        if ( LW_Site_Diagnostics::is_indexable( $row['ID'] ) ) {
            $out[] = $row;
        }
    }

    return $out;
}
