<?php
/**
 * R35 — テンプレートの差し込み文字が、そのままリンク先に残っている。
 *
 * 🔴 テンプレートを読み込んだあと差し替えられなかった変数が、
 *    href="${newsList1Link}" のような形で本文に残ることがある。
 *    見た目は普通のボタンなのに、押すと必ず「ページが見つかりません」になる。
 *
 * 実例（2026-08-22 ローカルの行政書士サンプルで検出）:
 *   ${newsList1Link} / ${postList2Link} が href に残っていた。
 *   リンク切れチェック（HTTP）でも見つかるが、原因が「差し込み漏れ」だと分からず
 *   相対URLの間違いに見えてしまう。中から見れば一発で分かる。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 判定する。
 *
 * @param array $ledger lw_link_list_get_from_db() の戻り値。
 * @return array 指摘の配列。
 */
function lw_site_rule_placeholder( $ledger ) {
    $by_page = array();

    foreach ( $ledger['links'] as $link ) {
        $href = isset( $link['href'] ) ? (string) $link['href'] : '';

        if ( '' === $href ) {
            continue;
        }

        // ${...} と {{...}} の2種類。テンプレート側で使われている書き方に合わせる
        if ( ! preg_match( '~(\$\{[^}]+\}|\{\{[^}]+\}\})~', $href, $m ) ) {
            continue;
        }

        $source_id = isset( $link['source_id'] ) ? (int) $link['source_id'] : 0;

        if ( ! $source_id ) {
            continue;
        }

        if ( ! isset( $by_page[ $source_id ] ) ) {
            $by_page[ $source_id ] = array();
        }

        $by_page[ $source_id ][ $href ] = $m[1];
    }

    $issues = array();

    foreach ( $by_page as $post_id => $found ) {
        $names = array_values( $found );

        $issues[] = lw_site_issue_make(
            $post_id,
            'R35',
            'critical',
            sprintf( 'リンク先に差し込み文字「%s」が残っています。押すとページが見つかりません', $names[0] ),
            array(
                'count'        => count( $names ),
                'placeholders' => array_slice( $names, 0, 10 ),
            )
        );
    }

    return $issues;
}
