<?php
/**
 * R32 — 画像に説明文（alt）が無い。
 *
 * 画像検索から入ってこられなくなる。読み上げソフトでも読まれない。
 *
 * 🚨 見るのは【本文（post_content）の画像だけ】。
 *    公開ページのHTML全体を見ると、ヘッダーのロゴやフッターの画像が
 *    全ページで引っかかり、しかも一覧からは直せない（テンプレート側にあるため）。
 *    利用者が自分で直せる画像だけを指摘する。
 *
 * 🚨 alt="" は「装飾なので読み上げ不要」という正しい書き方でもある。
 *    だから alt 属性が無いもの（🟡）と、空のもの（🔵）を分けて数える。
 *    実測（lite-word.com・2026-08-22）: 本文画像575枚のうち386枚が alt 空・74ページに分布。
 *    これを全部 warning にすると、直すべき画像が埋もれる。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 判定する。
 *
 * @param WP_Post $post    対象。
 * @param array   $content 本文から数えた値（img_total / img_no_alt / img_empty_alt）。
 * @return array 指摘の配列。
 */
function lw_site_rule_image_alt( $post, $content ) {
    $issues = array();

    $no_alt    = isset( $content['img_no_alt'] ) ? (int) $content['img_no_alt'] : 0;
    $empty_alt = isset( $content['img_empty_alt'] ) ? (int) $content['img_empty_alt'] : 0;

    if ( $no_alt > 0 ) {
        $issues[] = lw_site_issue_make(
            (int) $post->ID,
            'R32',
            'warning',
            sprintf( '説明文（alt）が入っていない画像が%d枚あります', $no_alt ),
            array(
                'count' => $no_alt,
                'total' => isset( $content['img_total'] ) ? (int) $content['img_total'] : 0,
            )
        );
    }

    if ( $empty_alt > 0 ) {
        $issues[] = lw_site_issue_make(
            (int) $post->ID,
            'R32E',
            'info',
            sprintf( '説明文が空（alt=""）の画像が%d枚あります。飾りならこのままで正しいです', $empty_alt ),
            array(
                'count' => $empty_alt,
                'total' => isset( $content['img_total'] ) ? (int) $content['img_total'] : 0,
            )
        );
    }

    return $issues;
}
