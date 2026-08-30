<?php
/**
 * R34 — 全ページのタイトルに付く「サイト名」が長すぎる。
 *
 * 🟡 このテーマは固定ページ・投稿のタイトルの後ろに、区切り文字＋サイト名を足す
 *    （functions/seo/head_put.php の lw_append_site_title）。
 *    サイト名が長いと、検索結果で読まれる 30文字前後のうち大半をどのページでも
 *    同じ文字列が占めてしまい、肝心のページ名が読まれない。
 *
 * 実測（lite-word.com・2026-08-22）:
 *   /cf/               → 「お問合わせ | 個人事業主のためのWordPressテーマ「LiteWord」」39文字
 *   /gyoseishoshi-top/ → 52文字
 *   接尾辞だけで30文字。ページ名がどれだけ短くても必ず溢れる。
 *
 * 🚨 この検査は【サイトに1件】出す（ページごとに1件ではない）。
 *    原因も直し方も設定1か所なので、175ページぶん同じことを言っても直しやすくならない。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 検索結果で読まれる目安の文字数
if ( ! defined( 'LW_SITE_TITLE_LIMIT' ) ) {
    define( 'LW_SITE_TITLE_LIMIT', 32 );
}

// これ以上の長さの接尾辞が全ページに付いていたら指摘する
if ( ! defined( 'LW_SITE_TITLE_SUFFIX_LIMIT' ) ) {
    define( 'LW_SITE_TITLE_SUFFIX_LIMIT', 20 );
}

/**
 * 判定する。
 *
 * @return array 指摘の配列。
 */
function lw_site_rule_title_suffix() {
    $targets = array(
        'lw_page_title_sub' => '固定ページ',
        'lw_post_title_sub' => '投稿',
    );

    $found = array();

    foreach ( $targets as $option => $label ) {
        $text = lw_site_rule_resolve_title_sub( get_option( $option, 'site_title' ) );

        if ( '' === $text ) {
            continue;
        }

        $length = LW_Site_Diagnostics::text_length( $text );

        if ( $length >= LW_SITE_TITLE_SUFFIX_LIMIT ) {
            $found[] = array(
                'where'  => $label,
                'text'   => $text,
                'length' => $length,
            );
        }
    }

    if ( empty( $found ) ) {
        return array();
    }

    $first = $found[0];

    return array(
        lw_site_issue_make(
            0,
            'R34',
            'warning',
            sprintf(
                'すべての%sのタイトルの後ろに「%s」（%d文字）が付いています。検索結果は%d文字前後で切れます',
                $first['where'],
                $first['text'],
                $first['length'],
                LW_SITE_TITLE_LIMIT
            ),
            array(
                'suffixes' => $found,
                'setting'  => admin_url( 'admin.php?page=lw_seo_settings_menu_management' ),
            )
        ),
    );
}

/**
 * その投稿タイプのタイトルに付く接尾辞（サイト名など）。付かないなら空。
 *
 * R23（タイトルが長い）と共用する。同じ原因を2つのルールで別々に測ると、
 * 「全ページのタイトルが長い」と「サイト名が長い」を二重に指摘することになる。
 *
 * @param string $post_type 投稿タイプ。
 * @return string
 */
function lw_site_rule_title_suffix_text( $post_type = 'page' ) {
    $option = ( 'page' === $post_type ) ? 'lw_page_title_sub' : 'lw_post_title_sub';

    return lw_site_rule_resolve_title_sub( get_option( $option, 'site_title' ) );
}

/**
 * 「タイトルの後ろに足すもの」の設定値を、実際の文字列にする。
 *
 * 表示中のページに依存するキー（ページ名・カテゴリ名など）は、サイト全体の
 * 判定には使えないので空を返す。
 *
 * @param string $key 設定値。
 * @return string
 */
function lw_site_rule_resolve_title_sub( $key ) {
    if ( 'site_title' === $key ) {
        return (string) get_bloginfo( 'name' );
    }

    if ( 'catchphrase' === $key ) {
        return (string) get_bloginfo( 'description' );
    }

    return '';
}
