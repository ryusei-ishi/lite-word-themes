<?php
/**
 * R13 — どのページからもリンクされていないページ（孤立ページ）。
 *
 * 検索エンジンは基本的にリンクを辿って回る。サイトマップに載っていても、
 * どこからも張られていないページは評価されにくい。
 *
 * 🚨 「ページを開いて全部調べる（巡回）」のときだけ判定する。
 *    本文だけのスキャンではヘッダー・フッター・メニューのリンクが見えないため、
 *    メニューに入っているページまで「孤立」と誤って言ってしまう。
 *
 * 🚨 JavaScript で描かれるリンクは拾えない。
 *    lite-word.com のサンプル一覧（#1143）は lw_page-list-1 ブロックが REST から
 *    取ってきて <a> を組み立てているため、HTML には1本も出てこない。
 *    訪問者には見えているのに、機械には孤立して見える（2026-08-22 に判明）。
 *    → 検索エンジンも同じ見え方をするので指摘すること自体は正しいが、
 *      文言で「JavaScriptで作られたリンクは数えられない」ことを必ず伝える。
 *
 * 🚨 一覧ページ（カテゴリー）から張られていても、**その一覧ページ自体に
 *    サイト内からのリンクが1本も無ければ「辿れる」とは言えない**（2026-08-23 追加）。
 *    以前は一覧ページを無条件に辿れるものとして扱っていたため、
 *    lite-word.com の記事11本が「カテゴリー一覧からしか辿れず、その一覧にも
 *    リンクが無い」状態だったのに、孤立として出ていなかった。
 *    どの一覧が入口を持っているかは LW_Site_Diagnostics::archive_list() の内訳で見る。
 *
 * 🚨 辿れるかどうかは1ホップで見ている（トップからの到達可能性は追っていない）。
 *    「どこか1ページでも張っていれば辿れる」という、これまでどおりの見方。
 *    一覧ページだけを例外扱いしていたのを、他のページと同じ扱いに戻したのが今回の変更。
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
function lw_site_rule_orphan( $ledger ) {
    // 🚨 一覧ページ（トップの投稿一覧・カテゴリー）から張られているリンクを
    //    集めていないうちは判定しない。台帳は投稿・固定ページしか巡回しないので、
    //    アーカイブからのリンクが1本も入っておらず、全部「孤立」になってしまう。
    $from_archive = LW_Site_Diagnostics::archive_linked_ids();

    if ( null === $from_archive ) {
        return array();
    }

    // ページからページへのリンク（ヘッダー・フッター・メニューを含む）
    $linked = array();

    foreach ( $ledger['links'] as $link ) {
        $href = isset( $link['href'] ) ? (string) $link['href'] : '';

        if ( '' === $href ) {
            continue;
        }

        $target = LW_Site_Url_Index::resolve( $href );

        if ( null === $target ) {
            continue;
        }

        $source_id = isset( $link['source_id'] ) ? (int) $link['source_id'] : 0;

        // 自分から自分へのリンクは被リンクに数えない
        if ( $source_id === $target['post_id'] ) {
            continue;
        }

        $linked[ $target['post_id'] ] = true;
    }

    // 一覧ページから張られているぶんを足す。
    // 🚨 ただし「その一覧ページ自体に、サイト内から入る道がある」ものだけ。
    //    入口の判定にはページどうしのリンクだけを使う（一覧に張られていることを
    //    根拠に一覧を辿れることにすると、堂々巡りになる）。
    $from_pages = $linked;
    $link_paths = LW_Site_Diagnostics::ledger_link_paths( $ledger );
    $archives   = LW_Site_Diagnostics::archive_list();

    // post_id => その記事を張っていた「入口の無い一覧ページ」
    $stranded = array();

    if ( null === $archives ) {
        // 旧形式（内訳が無い）。どの一覧から来たか分からないので、これまでどおり全部数える
        foreach ( $from_archive as $id => $ignore ) {
            $linked[ (int) $id ] = true;
        }
    } else {
        foreach ( $archives as $archive ) {
            $ids = isset( $archive['ids'] ) ? (array) $archive['ids'] : array();

            if ( empty( $ids ) ) {
                continue;
            }

            if ( lw_site_rule_archive_has_entrance( $archive, $link_paths, $from_pages ) ) {
                foreach ( $ids as $id ) {
                    $linked[ (int) $id ] = true;
                }
                continue;
            }

            foreach ( $ids as $id ) {
                if ( ! isset( $stranded[ (int) $id ] ) ) {
                    $stranded[ (int) $id ] = $archive;
                }
            }
        }
    }

    // トップページと投稿一覧ページは、テーマが必ず導線を持っているので対象外
    $skip = array(
        (int) get_option( 'page_on_front' ),
        (int) get_option( 'page_for_posts' ),
    );

    $issues = array();

    foreach ( $ledger['pages'] as $page ) {
        $post_id = (int) $page['post_id'];

        if ( in_array( $post_id, $skip, true ) || isset( $linked[ $post_id ] ) ) {
            continue;
        }

        // 🚨 検索に出さないページは、孤立していても困らない。
        //    判定はサイトマップの実物で行う（設定 seo_noindex だけを見ると、
        //    プラグインが表示時に noindex を出しているページを拾えず、
        //    lite-word.com では誤検出が133件出た・2026-08-22）
        if ( ! LW_Site_Diagnostics::is_indexable( $post_id ) ) {
            continue;
        }

        if ( 'noindex' === get_post_meta( $post_id, 'seo_noindex', true ) ) {
            continue;
        }

        // 一覧ページからは張られているが、その一覧ページに入口が無い場合。
        // 「どこからもリンクされていません」とだけ言うと、一覧に並んでいるのを
        // 見ている利用者には話が通じない。何を直せばよいかまで書く
        if ( isset( $stranded[ $post_id ] ) ) {
            $archive = $stranded[ $post_id ];

            $issues[] = lw_site_issue_make(
                $post_id,
                'R13',
                'warning',
                sprintf(
                    '「%s」の一覧ページからしか辿れません。その一覧ページ自体にサイト内からのリンクがありません',
                    isset( $archive['label'] ) ? $archive['label'] : '一覧'
                ),
                array(
                    'post_type'   => $page['post_type'],
                    'via_archive' => array(
                        'label' => isset( $archive['label'] ) ? $archive['label'] : '',
                        'url'   => isset( $archive['url'] ) ? $archive['url'] : '',
                    ),
                )
            );

            continue;
        }

        $issues[] = lw_site_issue_make(
            $post_id,
            'R13',
            'warning',
            'どのページからもリンクされていません',
            array(
                'post_type' => $page['post_type'],
            )
        );
    }

    return $issues;
}

/**
 * その一覧ページに、サイト内から入る道があるか。
 *
 * @param array $archive    LW_Site_Diagnostics::archive_list() の1件。
 * @param array $link_paths LW_Site_Diagnostics::ledger_link_paths() の戻り値。
 * @param array $from_pages ページからページへのリンク（post_id => true）。
 * @return bool
 */
function lw_site_rule_archive_has_entrance( $archive, $link_paths, $from_pages ) {
    $kind = isset( $archive['kind'] ) ? $archive['kind'] : 'term';

    // トップページはサイトの入口そのもの。必ず辿れる
    if ( 'home' === $kind ) {
        return true;
    }

    // 投稿一覧ページは固定ページなので、ページどうしのリンクで判定できる
    if ( 'posts_page' === $kind ) {
        $post_id = isset( $archive['post_id'] ) ? (int) $archive['post_id'] : 0;

        return ( $post_id && isset( $from_pages[ $post_id ] ) );
    }

    $path = LW_Site_Diagnostics::link_path( isset( $archive['url'] ) ? $archive['url'] : '' );

    return ( '' !== $path && ! empty( $link_paths[ $path ] ) );
}
