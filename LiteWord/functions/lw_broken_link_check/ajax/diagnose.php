<?php
/**
 * AJAX — サイト診断（本文とデータベースだけで調べる）。
 *
 * 🚨 ここは HTTP を1本も叩かない。利用者のサーバーに自分でアクセスを浴びせないため
 *    （2026-08-22 Ryuichi 判断: 重い巡回は「ページを開いて全部調べる」のときだけ）。
 *    タイトル・見出しの検査は巡回に相乗りして採る（ajax/crawl.php）。
 *
 * 🚨 すべて lw_link_list_verify_ajax() を先頭で通す（nonce → 権限 → 契約）。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 診断開始。前回の結果を捨てて、対象件数を返す。
 *
 * @return void
 */
function lw_site_diagnose_start_ajax() {
    lw_link_list_verify_ajax();

    $total = LW_Site_Diagnostics::begin();

    wp_send_json_success(
        array(
            'total'     => $total,
            'batchSize' => LW_SITE_DIAGNOSE_BATCH,
        )
    );
}
add_action( 'wp_ajax_lw_site_diagnose_start', 'lw_site_diagnose_start_ajax' );

/**
 * 診断1バッチ（本文の検査）。
 *
 * @return void
 */
function lw_site_diagnose_batch_ajax() {
    lw_link_list_verify_ajax();

    $offset  = isset( $_POST['offset'] ) ? absint( $_POST['offset'] ) : 0;
    $checked = LW_Site_Diagnostics::content_batch( $offset, LW_SITE_DIAGNOSE_BATCH );

    wp_send_json_success(
        array(
            'checked' => $checked,
            'offset'  => $offset,
            // 取得件数がバッチサイズ未満なら打ち止め（総件数の数え違いに引きずられない）
            'done'    => $checked < LW_SITE_DIAGNOSE_BATCH,
        )
    );
}
add_action( 'wp_ajax_lw_site_diagnose_batch', 'lw_site_diagnose_batch_ajax' );

/**
 * 診断の締め。サイト全体を見ないと判定できないルールを走らせる。
 *
 * @return void
 */
function lw_site_diagnose_finish_ajax() {
    lw_link_list_verify_ajax();

    $result = LW_Site_Diagnostics::finish();

    wp_send_json_success( $result );
}
add_action( 'wp_ajax_lw_site_diagnose_finish', 'lw_site_diagnose_finish_ajax' );

/**
 * 保存済みの診断結果を返す（画面を開いたとき）。
 *
 * @return void
 */
function lw_site_diagnose_load_ajax() {
    lw_link_list_verify_ajax();

    $summary = lw_site_issues_get_summary();
    $issues  = lw_site_issues_get_all( array( 'limit' => 1000 ) );

    // リンク切れの結果も一緒に見せる。利用者にとっては同じ「サイトの健康状態」
    $links = lw_link_check_results_get_summary();

    wp_send_json_success(
        array(
            'summary'   => $summary,
            'issues'    => $issues,
            'rules'     => lw_site_rules_dictionary(),
            'linkCheck' => array(
                'counts'      => isset( $links['counts'] ) ? $links['counts'] : array(),
                'total'       => isset( $links['total'] ) ? $links['total'] : 0,
                'lastChecked' => isset( $links['last_checked'] ) ? $links['last_checked'] : null,
            ),
            'linkListUrl' => admin_url( 'admin.php?page=' . LW_LINK_LIST_MENU_SLUG ),
        )
    );
}
add_action( 'wp_ajax_lw_site_diagnose_load', 'lw_site_diagnose_load_ajax' );
