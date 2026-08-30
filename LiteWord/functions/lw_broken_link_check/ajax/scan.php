<?php
/**
 * AJAX — 軽いスキャン（DB の中だけでリンクを集める）と、画面への読み込み。
 *
 * しっかりスキャン（公開URLの巡回）は ajax/crawl.php。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * スキャン開始。総件数を返し、保存先を空にする。
 *
 * @return void
 */
function lw_link_list_scan_start_ajax() {
    lw_link_list_verify_ajax();

    $total = LW_Broken_Link_Check_Scanner::count_scannable_posts();

    lw_link_list_begin_scan();

    // 軽いスキャンではヘッダーもフッターも採らないので、前回の巡回の付帯情報は捨てる。
    // 残しておくと「共通リンク」の見出しだけが残って、中身が無い状態になる
    lw_link_list_reset_scan_state();
    lw_link_list_set_scan_mode( 'light' );

    wp_send_json_success(
        array(
            'total'     => $total,
            'batchSize' => LW_LINK_LIST_SCAN_BATCH,
        )
    );
}
add_action( 'wp_ajax_lw_link_list_scan_start', 'lw_link_list_scan_start_ajax' );

/**
 * スキャン1バッチ。offset から数十件だけ処理して保存する。
 *
 * @return void
 */
function lw_link_list_scan_batch_ajax() {
    lw_link_list_verify_ajax();

    $offset = isset( $_POST['offset'] ) ? absint( $_POST['offset'] ) : 0;

    $pages = LW_Broken_Link_Check_Scanner::scan_batch( $offset, LW_LINK_LIST_SCAN_BATCH );
    $saved = lw_link_list_save_pages( $pages );

    wp_send_json_success(
        array(
            'scanned' => count( $pages ),
            'saved'   => $saved,
            'offset'  => $offset,
            // 取得件数がバッチサイズ未満なら、そこで打ち止め（総件数の数え違いに引きずられない）
            'done'    => count( $pages ) < LW_LINK_LIST_SCAN_BATCH,
        )
    );
}
add_action( 'wp_ajax_lw_link_list_scan_batch', 'lw_link_list_scan_batch_ajax' );

/**
 * DB に保存済みのリンク情報とチェック結果を返す。
 *
 * @return void
 */
function lw_link_list_load_ajax() {
    lw_link_list_verify_ajax();

    $data    = lw_link_list_get_from_db();
    $summary = lw_link_check_results_get_summary();

    wp_send_json_success(
        array(
            'links'        => $data['links'],
            'pages'        => $data['pages'],
            'total'        => count( $data['links'] ),
            // ここが 2024-12-20 からの積み残しだった部分。
            // 画面を離れてもチェック結果が残るよう、DB から一緒に返す
            'checkResults' => lw_link_check_results_get_all(),
            'checkSummary' => $summary,
            'lastUpdated'  => lw_link_list_get_last_updated(),
            // どちらの方式で採った一覧なのか。件数が変わる理由になるので必ず画面に出す
            'scanMode'     => lw_link_list_get_scan_mode(),
            'crawlErrors'  => lw_link_list_get_crawl_errors(),
            'skipped'      => lw_link_list_get_skipped_count(),
            'commonCount'  => count( lw_link_list_get_common_links() ),
            'throttled'    => lw_link_list_was_throttled(),
        )
    );
}
add_action( 'wp_ajax_lw_link_list_load', 'lw_link_list_load_ajax' );
