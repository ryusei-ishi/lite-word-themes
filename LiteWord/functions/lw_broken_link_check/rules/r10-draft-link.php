<?php
/**
 * R10 / R10U / R10R — まだ公開していないページ（下書き・非公開・ゴミ箱）へのリンク。
 *
 * 🚨 「下書き＝訪問者は404を見る」と決めつけないこと（2026-08-23・本番実測で判明）。
 *
 *    lite-word.com でこのルールは🔴重大7件を出していた。しかし指摘していた
 *    リンク先12種を実際に叩いたところ、**12種すべてが301で新しいマニュアルへ
 *    転送されていて、行き止まりは0件**だった。
 *    転送はテーマの `seo_301_redirect_url`（R15 が見ているもの）ではなく
 *    プラグイン側に入っていて、DBを読んでいるだけのルールからは存在すら分からない。
 *
 *    誤って🔴を出すと実害がある。点数には「重大が1件でもあれば79点以下」という
 *    上限があるので（issues-report.php）、**転送をきちんと運用しているサイトほど
 *    不当に低い点になる**。いちばんやってはいけない出方だった。
 *
 * そこで判定を3つに分け、**実際に叩いた結果だけを根拠にする**。
 *
 *   R10  🔴 叩いたら 404/410 だった            … 訪問者は本当に行き止まりを見る
 *   R10U 🟡 まだ叩いていない／確認できなかった … 転送が無ければ開けない。断定はしない
 *   R10R 🔵 叩いたら転送された／表示された     … いまは困らない。リンクは直しておくと確実
 *
 * 叩くのは巡回（「ページを開いて全部調べる」）の締め
 * → LW_Site_Diagnostics::verify_draft_links()。
 * 診断ボタン側は HTTP を1本も出さない決まりなので（2026-08-22 Ryuichi 判断）、
 * 一度も巡回していないサイトでは全部 R10U になる。**それでいい。**
 * 「確かめていないのに断定する」よりは「確かめていないと言う」ほうが正しい。
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
function lw_site_rule_draft_links( $ledger ) {
    $verified = LW_Site_Diagnostics::draft_link_status();
    $by_page  = array();

    foreach ( $ledger['links'] as $link ) {
        $href = isset( $link['href'] ) ? (string) $link['href'] : '';

        if ( '' === $href ) {
            continue;
        }

        $target = LW_Site_Url_Index::resolve( $href );

        if ( null === $target || 'publish' === $target['status'] ) {
            continue;
        }

        $source_id = isset( $link['source_id'] ) ? (int) $link['source_id'] : 0;

        if ( ! $source_id || $source_id === $target['post_id'] ) {
            continue;
        }

        $key    = lw_site_rule_draft_link_key( $href );
        $result = isset( $verified[ $key ] ) ? $verified[ $key ] : null;

        if ( ! isset( $by_page[ $source_id ] ) ) {
            $by_page[ $source_id ] = array();
        }

        // 同じ相手への同じリンクは1回だけ数える
        $by_page[ $source_id ][ $target['post_id'] ] = array(
            'href'      => $href,
            'target_id' => $target['post_id'],
            'title'     => $target['title'],
            'status'    => $target['status'],
            'label'     => lw_site_rule_draft_status_label( $target['status'] ),
            'verdict'   => isset( $result['verdict'] ) ? $result['verdict'] : 'unknown',
            'code'      => isset( $result['code'] ) ? $result['code'] : null,
            'goes_to'   => isset( $result['goes_to'] ) ? $result['goes_to'] : '',
        );
    }

    $issues = array();

    foreach ( $by_page as $post_id => $targets ) {
        $issues = array_merge( $issues, lw_site_rule_draft_page_issues( $post_id, array_values( $targets ) ) );
    }

    return $issues;
}

/**
 * 1ページ分の指摘を組み立てる。
 *
 * 同じページの中に「行き止まり」と「転送で救われている」が混ざることがあるので、
 * 判定ごとに分けて、それぞれ別のルールIDで出す。
 *
 * 🚨 1つのルールIDに重大度を混ぜないこと。診断画面はルールごとにまとめて
 *    **先頭1件の重大度でバッジを出す**（admin/assets/diagnostics.js）。
 *    混ぜると「重大」の見出しの下に気づきレベルの行が並ぶ。
 *
 * @param int   $post_id 対象ページ。
 * @param array $targets そのページから張られている、公開していないページへのリンク。
 * @return array
 */
function lw_site_rule_draft_page_issues( $post_id, $targets ) {
    $buckets = array(
        'dead'    => array(),
        'unknown' => array(),
        'alive'   => array(),
    );

    foreach ( $targets as $target ) {
        $verdict = isset( $buckets[ $target['verdict'] ] ) ? $target['verdict'] : 'unknown';

        $buckets[ $verdict ][] = $target;
    }

    $issues = array();

    foreach ( $buckets as $verdict => $list ) {
        if ( empty( $list ) ) {
            continue;
        }

        $issues[] = lw_site_issue_make(
            $post_id,
            lw_site_rule_draft_rule_id( $verdict ),
            lw_site_rule_draft_severity( $verdict ),
            lw_site_rule_draft_message( $verdict, $list ),
            array(
                'count' => count( $list ),
                // 画面に出すのは先頭だけ。全部持たせるとテーブルが膨らむ
                'targets' => array_slice( $list, 0, 10 ),
            )
        );
    }

    return $issues;
}

/**
 * 判定に対応するルールID。
 *
 * @param string $verdict dead | unknown | alive。
 * @return string
 */
function lw_site_rule_draft_rule_id( $verdict ) {
    $map = array(
        'dead'    => 'R10',
        'unknown' => 'R10U',
        'alive'   => 'R10R',
    );

    return isset( $map[ $verdict ] ) ? $map[ $verdict ] : 'R10U';
}

/**
 * 判定に対応する重大度。
 *
 * @param string $verdict dead | unknown | alive。
 * @return string
 */
function lw_site_rule_draft_severity( $verdict ) {
    $map = array(
        'dead'    => 'critical',
        'unknown' => 'warning',
        'alive'   => 'info',
    );

    return isset( $map[ $verdict ] ) ? $map[ $verdict ] : 'warning';
}

/**
 * 利用者に見せる1行。
 *
 * 🚨 確かめた話と確かめていない話を、文言の上でも混ぜない。
 *    「訪問者には表示されません」と言い切ってよいのは、実際に叩いて
 *    404/410 が返ってきたときだけ。
 *
 * 🚨 未確認（R10U）の1行は、**まず「まだ確かめていない」と言う**（2026-08-23）。
 *    以前は「転送の設定が無ければ訪問者は開けません」と書いていて、
 *    Ryuichi が「このページは開けないのか」と読み違えた。条件つきの但し書きは、
 *    先に置くと結論に見える。
 *
 * @param string $verdict dead | unknown | alive。
 * @param array  $list    そのバケツに入ったリンク。
 * @return string
 */
function lw_site_rule_draft_message( $verdict, $list ) {
    $count = count( $list );
    $first = $list[0];

    if ( 'dead' === $verdict ) {
        return ( 1 === $count )
            ? sprintf( '「%s」（%s）へのリンクが開けません。訪問者には「ページが見つかりません」と表示されます', $first['title'], $first['label'] )
            : sprintf( '開けないリンクが%d本あります。訪問者には「ページが見つかりません」と表示されます', $count );
    }

    if ( 'alive' === $verdict ) {
        return ( 1 === $count )
            ? sprintf( '「%s」（%s）のURLへのリンクがありますが、別のページへ転送されて表示されています', $first['title'], $first['label'] )
            : sprintf( '公開していないページのURLへのリンクが%d本ありますが、いずれも転送されて表示されています', $count );
    }

    return ( 1 === $count )
        ? sprintf( '「%s」（%s）へのリンクがあります。訪問者に開けるかどうかは、まだ確かめていません', $first['title'], $first['label'] )
        : sprintf( '公開していないページへのリンクが%d本あります。訪問者に開けるかどうかは、まだ確かめていません', $count );
}

/**
 * 叩いた結果を突き合わせるためのキー。
 *
 * 🚨 突き合わせる両側で必ず同じ作り方にすること
 *    （ここと LW_Site_Diagnostics::verify_draft_links()）。
 *    `#` 以降はサーバーに送られないので落とす。落とさないと
 *    `/yuryo-plan/#faq` と `/yuryo-plan/` が別物になって永久に噛み合わない。
 *
 * ⚠️ lw_site_rule_absolute_url() / lw_site_rule_normalize_url() は
 *    rules/r15-redirect.php にある（同じ URL のそろえ方を2か所に書かないため）。
 *
 * @param string $href リンク先。
 * @return string
 */
function lw_site_rule_draft_link_key( $href ) {
    $url = lw_site_rule_absolute_url( (string) $href );
    $cut = strpos( $url, '#' );

    if ( false !== $cut ) {
        $url = substr( $url, 0, $cut );
    }

    return lw_site_rule_normalize_url( $url );
}

/**
 * 投稿ステータスを利用者に見せる日本語にする。
 *
 * @param string $status post_status。
 * @return string
 */
function lw_site_rule_draft_status_label( $status ) {
    $labels = array(
        'draft'   => '下書き',
        'pending' => 'レビュー待ち',
        'private' => '非公開',
        'future'  => '予約投稿',
        'trash'   => 'ゴミ箱',
    );

    return isset( $labels[ $status ] ) ? $labels[ $status ] : $status;
}
