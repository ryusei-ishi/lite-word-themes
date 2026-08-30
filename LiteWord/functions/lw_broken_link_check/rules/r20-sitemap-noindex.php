<?php
/**
 * R20 — 「検索に出さない」設定とサイトマップの食い違い。
 *
 * 🔴 Google に「来るな（noindex）」と「来い（サイトマップ）」を同時に言っている状態。
 *    クロールの予算を捨てるうえ、意図しないページが検索結果に出る。
 *
 * 🚨 このテーマのサイトマップ除外は option `lw_noindex_cache` を見て動く
 *    （functions/seo/sitemap_control_functions.php）。
 *    キャッシュの作り直しは「管理者が保存したとき」と「ログインしたとき」しか走らないので、
 *    スクリプトや別ユーザーが noindex を付けると**キャッシュが古いまま**になり、
 *    設定したのにサイトマップから外れない。
 *    実例: 行政書士サンプル16枚が noindex なのにサイトマップに載っていた（2026-08-22）。
 *    → だから「設定」ではなく「キャッシュの中身」と突き合わせる。設定だけ見ても矛盾は見つからない。
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
function lw_site_rule_sitemap_noindex() {
    // サイトマップ制御そのものが無いテーマ構成では判定しない
    if ( ! class_exists( 'LW_SEO_Sitemap_Control' ) ) {
        return array();
    }

    // 🚨 get_noindex_cache() を呼ばないこと。無ければ作り直してしまい、
    //    「古いまま放置されている」という事実が消える
    $cache = get_option( 'lw_noindex_cache' );

    if ( ! is_array( $cache ) || ! isset( $cache['all_posts'] ) || ! is_array( $cache['all_posts'] ) ) {
        return array();
    }

    $excluded = array_map( 'intval', $cache['all_posts'] );

    global $wpdb;

    $rows = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT p.ID, p.post_title, m.meta_value
             FROM {$wpdb->postmeta} m
             INNER JOIN {$wpdb->posts} p ON p.ID = m.post_id
             WHERE m.meta_key = %s
               AND p.post_status = 'publish'",
            'seo_noindex'
        ),
        ARRAY_A
    );

    $issues  = array();
    $stale   = 0;

    foreach ( (array) $rows as $row ) {
        $post_id    = (int) $row['ID'];
        $is_noindex = ( 'noindex' === $row['meta_value'] );
        $is_hidden  = in_array( $post_id, $excluded, true );

        if ( $is_noindex && ! $is_hidden ) {
            ++$stale;

            $issues[] = lw_site_issue_make(
                $post_id,
                'R20',
                'critical',
                '検索に出さない設定なのに、サイトマップには載っています',
                array( 'direction' => 'noindex_in_sitemap' )
            );
            continue;
        }

        if ( ! $is_noindex && $is_hidden ) {
            $issues[] = lw_site_issue_make(
                $post_id,
                'R20',
                'warning',
                '検索に出す設定なのに、サイトマップから外れています',
                array( 'direction' => 'index_not_in_sitemap' )
            );
        }
    }

    // 何件も同じ原因（キャッシュが古い）で出るときは、直し方をサイト全体にも1件出す
    if ( $stale >= 3 ) {
        $issues[] = lw_site_issue_make(
            0,
            'R20',
            'critical',
            sprintf( '%d ページで「検索に出さない設定」がサイトマップに反映されていません', $stale ),
            array(
                'count'       => $stale,
                'cache_built' => isset( $cache['updated_at'] ) ? $cache['updated_at'] : null,
            )
        );
    }

    return $issues;
}
