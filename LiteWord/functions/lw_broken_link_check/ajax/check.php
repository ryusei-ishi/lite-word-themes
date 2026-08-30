<?php
/**
 * AJAX — リンク有効性チェック（HTTPを叩く側）。
 *
 * 🚨 SSRF 対策の要はここ。
 *    以前は $_POST['urls'] に入った任意のURLをそのままサーバーが叩いていた。
 *    管理者を騙す必要すらなく、nonce も無かったので外部から踏み台にできた。
 *    いまは「クライアントは offset しか言えない」形にしてある。
 *    叩く相手は必ずサーバー側が DB から組み立てる。
 *    その上で checker 側も wp_safe_remote_*（wp_http_validate_url）を通す＝二重防御。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * チェック対象のURL一覧を DB から組み立てる。
 *
 * 並び順を固定しないと offset がずれるので必ずソートする。
 *
 * @return array URL の配列。
 */
function lw_link_list_build_checkable_urls() {
    $data  = lw_link_list_get_from_db();
    $urls  = array();
    $seen  = array();

    foreach ( $data['links'] as $link ) {
        $href      = isset( $link['href'] ) ? trim( (string) $link['href'] ) : '';
        $source_id = isset( $link['source_id'] ) ? (int) $link['source_id'] : 0;

        if ( '' === $href ) {
            continue;
        }

        // スキーム付きの飛び先はチェックしても意味がない
        if ( preg_match( '/^(mailto:|tel:|javascript:|data:)/i', $href ) ) {
            continue;
        }

        // アンカーだけのリンクは、その記事のURLに繋いで実在を見る
        if ( 0 === strpos( $href, '#' ) ) {
            // 🚨 ヘッダー・フッターのアンカーは全ページに出る。
            //    ページごとに繋ぐと 1本が 60本に膨らみ、同じページを何度も叩くことになる。
            //    共通のアンカーはページ内の id を見れば足りるので HTTP では確かめない
            if ( isset( $link['scope'] ) && 'common' === $link['scope'] ) {
                continue;
            }

            if ( $source_id <= 0 ) {
                continue;
            }

            $page_url = get_permalink( $source_id );
            if ( ! $page_url ) {
                continue;
            }

            $href = rtrim( $page_url, '/' ) . $href;
        }

        if ( isset( $seen[ $href ] ) ) {
            continue;
        }

        $seen[ $href ] = true;
        $urls[]        = $href;
    }

    sort( $urls, SORT_STRING );

    return $urls;
}

/**
 * チェック開始。対象件数を返し、前回の結果を捨てる。
 *
 * @return void
 */
function lw_link_list_check_start_ajax() {
    lw_link_list_verify_ajax();

    $urls = lw_link_list_build_checkable_urls();

    lw_link_check_results_clear();

    // 前回「断られた相手」を引きずらない。時間が経てば確認できることがある
    LW_Broken_Link_Check_Checker::reset_blocked_hosts();

    wp_send_json_success(
        array(
            'total'     => count( $urls ),
            'batchSize' => LW_LINK_LIST_CHECK_BATCH,
        )
    );
}
add_action( 'wp_ajax_lw_link_list_check_start', 'lw_link_list_check_start_ajax' );

/**
 * チェック1バッチ。
 *
 * クライアントから受け取るのは offset だけ。URL は受け取らない。
 *
 * @return void
 */
function lw_link_list_check_batch_ajax() {
    lw_link_list_verify_ajax();

    $offset = isset( $_POST['offset'] ) ? absint( $_POST['offset'] ) : 0;

    $urls  = lw_link_list_build_checkable_urls();
    $total = count( $urls );

    if ( $offset >= $total ) {
        wp_send_json_success(
            array(
                'results' => array(),
                'checked' => 0,
                'offset'  => $offset,
                'total'   => $total,
                'done'    => true,
            )
        );
    }

    $batch   = array_slice( $urls, $offset, LW_LINK_LIST_CHECK_BATCH );
    $results = LW_Broken_Link_Check_Checker::check_batch( $batch );

    lw_link_check_results_save( $results );

    $next = $offset + count( $batch );

    wp_send_json_success(
        array(
            'results' => $results,
            'checked' => count( $results ),
            'offset'  => $offset,
            'total'   => $total,
            'done'    => $next >= $total,
        )
    );
}
add_action( 'wp_ajax_lw_link_list_check_batch', 'lw_link_list_check_batch_ajax' );
