<?php
/**
 * サイト診断 — 指摘の読み出しと集計（点数）。
 *
 * 保存側は issues-store.php。画面と（将来の）MCP は、どちらもここを読む。
 * 二重実装にしないために、集計のしかたはこの1か所だけに置く。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 診断の付帯情報（いつ・何ページ・どこまで調べたか）を記録する。
 *
 * 🚨 テーブルに列を足さず option に置く（scan-state.php と同じ理由）。
 *
 * @param array $meta pages / mode / checked_at。
 * @return void
 */
function lw_site_issues_set_meta( $meta ) {
    update_option( LW_SITE_ISSUES_META_OPTION, $meta, false );
}

/**
 * 診断の付帯情報。
 *
 * scan_mode … 診断したときのリンク台帳の採り方（light / full）。
 *             light だと「孤立ページ」を判定していない（メニューのリンクが見えないため）。
 * page_rules_at … 公開ページを開いて調べた（タイトル・見出し）最後の日時。
 *             null なら、その検査はまだ一度も含まれていない。
 *
 * 🚨 どちらも画面に必ず出す。何を調べていないかが分からない診断結果は、
 *    「問題なし」と読み違えられる（リンクチェックで実際に起きた・2026-08-22）。
 *
 * @return array
 */
function lw_site_issues_get_meta() {
    $meta = get_option( LW_SITE_ISSUES_META_OPTION );

    if ( ! is_array( $meta ) ) {
        $meta = array();
    }

    return array_merge(
        array(
            'pages'         => 0,
            'scan_mode'     => 'light',
            'checked_at'    => null,
            'page_rules_at' => null,
            'indexable'     => null,
        ),
        $meta
    );
}

/**
 * 指摘を読み出す。
 *
 * @param array $args severity / rule_id / post_id / limit。
 * @return array
 */
function lw_site_issues_get_all( $args = array() ) {
    if ( ! lw_site_issues_table_exists() ) {
        return array();
    }

    global $wpdb;
    $table_name = lw_site_issues_table();

    $where  = array( '1=1' );
    $params = array();

    if ( ! empty( $args['severity'] ) ) {
        $where[]  = 'severity = %s';
        $params[] = $args['severity'];
    }
    if ( ! empty( $args['rule_id'] ) ) {
        $where[]  = 'rule_id = %s';
        $params[] = $args['rule_id'];
    }
    if ( isset( $args['post_id'] ) ) {
        $where[]  = 'post_id = %d';
        $params[] = (int) $args['post_id'];
    }

    $limit = isset( $args['limit'] ) ? (int) $args['limit'] : 500;
    $limit = ( $limit > 0 && $limit <= 2000 ) ? $limit : 500;

    // 重い順に並べる。放置すると損が出るものから読ませたい
    $sql = 'SELECT * FROM ' . $table_name
        . ' WHERE ' . implode( ' AND ', $where )
        . " ORDER BY FIELD(severity,'critical','warning','info'), rule_id, post_id"
        . ' LIMIT ' . $limit;

    $rows = $params ? $wpdb->get_results( $wpdb->prepare( $sql, $params ), ARRAY_A ) : $wpdb->get_results( $sql, ARRAY_A );

    if ( ! $rows ) {
        return array();
    }

    $out = array();

    foreach ( $rows as $row ) {
        $post_id = (int) $row['post_id'];
        $context = json_decode( (string) $row['context_json'], true );

        $out[] = array(
            'rule_id'     => $row['rule_id'],
            'severity'    => $row['severity'],
            'post_id'     => $post_id,
            'post_title'  => $post_id ? get_the_title( $post_id ) : '',
            'edit_link'   => $post_id ? get_edit_post_link( $post_id, 'raw' ) : '',
            'view_link'   => $post_id ? get_permalink( $post_id ) : '',
            'message'     => $row['message'],
            'context'     => is_array( $context ) ? $context : array(),
            'detected_at' => $row['detected_at'],
        );
    }

    return $out;
}

/**
 * 重大度ごとの件数。
 *
 * @return array
 */
function lw_site_issues_count_by_severity() {
    $counts = array(
        'critical' => 0,
        'warning'  => 0,
        'info'     => 0,
    );

    if ( ! lw_site_issues_table_exists() ) {
        return $counts;
    }

    global $wpdb;
    $table_name = lw_site_issues_table();

    $rows = $wpdb->get_results( "SELECT severity, COUNT(*) AS cnt FROM $table_name GROUP BY severity", ARRAY_A );

    foreach ( (array) $rows as $row ) {
        if ( isset( $counts[ $row['severity'] ] ) ) {
            $counts[ $row['severity'] ] = (int) $row['cnt'];
        }
    }

    return $counts;
}

/**
 * サイトの点数を出す。
 *
 * 考え方は「ページごとに減点して、その平均をサイトの点数にする」。
 * 全体の件数だけで減点すると、ページ数の多いサイトが必ず0点になり、
 * 直しても点数が動かない＝改善の手応えが無い画面になる。
 *
 *   ページの点 = 100 −（重大20 × 件数）−（要改善7）−（気づき2）… 下限0
 *   サイトの点 = 全ページの平均 − サイト全体への指摘ぶん（最大30）… 下限0
 *
 * @return int 0〜100。
 */
function lw_site_issues_score() {
    $meta  = lw_site_issues_get_meta();
    $pages = (int) $meta['pages'];

    if ( $pages < 1 || ! lw_site_issues_table_exists() ) {
        return 100;
    }

    global $wpdb;
    $table_name = lw_site_issues_table();

    $rows = $wpdb->get_results(
        "SELECT post_id, severity, COUNT(*) AS cnt FROM $table_name GROUP BY post_id, severity",
        ARRAY_A
    );

    $weight = array(
        'critical' => 20,
        'warning'  => 7,
        'info'     => 2,
    );

    $per_page   = array();
    $site_level = 0;
    $critical   = 0;

    foreach ( (array) $rows as $row ) {
        $w = isset( $weight[ $row['severity'] ] ) ? $weight[ $row['severity'] ] : 2;
        $d = $w * (int) $row['cnt'];

        if ( 'critical' === $row['severity'] ) {
            $critical += (int) $row['cnt'];
        }

        if ( 0 === (int) $row['post_id'] ) {
            $site_level += $d;
            continue;
        }

        $post_id = (int) $row['post_id'];

        if ( ! isset( $per_page[ $post_id ] ) ) {
            $per_page[ $post_id ] = 0;
        }

        $per_page[ $post_id ] += $d;
    }

    // 指摘の無いページは満点。だからページ数ぶんの 100 から引く
    $total = $pages * 100;

    foreach ( $per_page as $deduction ) {
        $total -= min( 100, $deduction );
    }

    $score = ( $total / $pages ) - min( 30, $site_level );
    $score = max( 0, min( 100, round( $score ) ) );

    // 🚨 重大な指摘が1つでもあるうちは「とても良い」にしない。
    //    平均で出すと、ページ数の多いサイトでは数件の重大が薄まって高得点になる。
    //    実測（2026-08-22 ローカル60ページ）: 重大8件で92点と出て、実態と合わなかった。
    //    重大＝訪問者に実害が出ている状態なので、点数の上限を下げて必ず目に入るようにする。
    if ( $critical > 0 ) {
        $score = min( $score, ( $critical >= 5 ) ? 69 : 79 );
    }

    return (int) $score;
}

/**
 * 画面と MCP が使うサマリー。
 *
 * @return array
 */
function lw_site_issues_get_summary() {
    $meta   = lw_site_issues_get_meta();
    $counts = lw_site_issues_count_by_severity();

    return array(
        'score'        => lw_site_issues_score(),
        'counts'       => $counts,
        'total'        => array_sum( $counts ),
        'pages'        => (int) $meta['pages'],
        'scanMode'     => $meta['scan_mode'],
        'checkedAt'    => $meta['checked_at'],
        'pageRulesAt'  => $meta['page_rules_at'],
        // 検索まわりの検査の対象になったページ数（サイトマップ基準）。null＝全ページが対象
        'indexable'    => $meta['indexable'],
        // 一覧ページ（トップの投稿一覧・カテゴリー）のリンクを集めてあるか。
        // 集めていないと孤立ページの判定ができない（誤検出になるので出さない）
        'archiveLinks' => is_array( get_option( LW_SITE_ARCHIVE_LINKS_OPTION, null ) ),
        // 「公開していないページへのリンク」を実際に叩いて確かめた最後の日時。
        // null なら R10 は🔴を出さない（確かめていないのに断定しないため）
        'draftLinksAt' => LW_Site_Diagnostics::draft_link_checked_at(),
        // そのうち、まだ判定が付いていない本数（上限・時間切れ・相手が断った）。
        // 0 でなければ「あと◯本は確かめきれていない」と画面に出す。黙って切らない
        'draftLinksPending' => LW_Site_Diagnostics::draft_link_pending(),
    );
}
