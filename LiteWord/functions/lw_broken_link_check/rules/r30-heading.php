<?php
/**
 * R30 — ページの主題を表す見出し（h1）が無い／2つ以上ある。
 *
 * 🚨 これも公開ページのHTMLで数えること。
 *    本文（post_content）だけを見ると、テーマのテンプレートが出している h1 が数えられない。
 *    実測（lite-word.com・2026-08-22）: 本文に h1 が無いページは100枚あるが、
 *    実際に h1 が無かったのは /blog_list/（投稿一覧）だった。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 判定する。
 *
 * @param WP_Post $post 対象。
 * @param array   $view 公開ページから読み取った値（title / h1_count）。
 * @return array 指摘の配列。
 */
function lw_site_rule_heading( $post, $view ) {
    if ( ! isset( $view['h1_count'] ) ) {
        return array();
    }

    $count = (int) $view['h1_count'];

    if ( 1 === $count ) {
        return array();
    }

    $message = ( 0 === $count )
        ? 'ページの主題を表す見出し（h1）がありません'
        : sprintf( 'ページの主題を表す見出し（h1）が%d個あります。1ページに1つにします', $count );

    return array(
        lw_site_issue_make(
            (int) $post->ID,
            'R30',
            'warning',
            $message,
            array( 'h1_count' => $count )
        ),
    );
}
