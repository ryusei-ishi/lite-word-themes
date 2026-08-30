<?php
/**
 * R24 / R25 — 検索結果に出る説明文（メタディスクリプション）。
 *
 *   R24 🟡 未設定 … このテーマは seo_description が空だと <meta name="description"> を
 *                   出さない（自動生成しない・head_put.php:325 で確認）。
 *                   何を書けばクリックされるかを、Google に丸投げすることになる。
 *   R25 🔴 重複   … 同じ説明文が複数ページに付いていると、Google は同じページと見なす。
 *                   実測では lite-word.com の36ページが同一文だった（2026-08-22）。
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
function lw_site_rule_description() {
    $rows = lw_site_rule_collect_public_meta( 'seo_description' );

    if ( empty( $rows ) ) {
        return array();
    }

    $issues = array();
    $groups = array();

    // 🚨 トップページの説明文だけは別の場所に入る。
    //    head_put.php は is_front_page() のとき postmeta ではなく
    //    オプション lw_front_meta_description を出す。
    //    ページ側の設定だけを見ると「トップページに説明文が無い」と誤報する。
    $front      = (int) get_option( 'page_on_front' );
    $front_desc = trim( (string) get_option( 'lw_front_meta_description', '' ) );

    foreach ( $rows as $row ) {
        $desc = trim( (string) $row['meta'] );

        if ( '' === $desc && $front && (int) $row['ID'] === $front && '' !== $front_desc ) {
            continue;
        }

        if ( '' === $desc ) {
            $issues[] = lw_site_issue_make(
                (int) $row['ID'],
                'R24',
                'warning',
                '検索結果に出る説明文が設定されていません',
                array()
            );
            continue;
        }

        $key = strtolower( $desc );

        if ( ! isset( $groups[ $key ] ) ) {
            $groups[ $key ] = array();
        }

        $groups[ $key ][] = $row;
    }

    foreach ( $groups as $group ) {
        if ( count( $group ) < 2 ) {
            continue;
        }

        foreach ( $group as $row ) {
            $issues[] = lw_site_issue_make(
                (int) $row['ID'],
                'R25',
                'critical',
                sprintf( '同じ説明文が他の%dページにも使われています', count( $group ) - 1 ),
                array(
                    'count'   => count( $group ) - 1,
                    'excerpt' => _mb_substr( (string) $row['meta'], 0, 40 ),
                )
            );
        }
    }

    return $issues;
}
