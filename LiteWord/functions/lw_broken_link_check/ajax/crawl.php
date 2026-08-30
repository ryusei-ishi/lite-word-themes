<?php
/**
 * AJAX — しっかりスキャン（公開URLを巡回してリンクを集める）。
 *
 * 軽いスキャンは ajax/scan.php。入口を分けてあるのは、
 * どちらの方式で採った一覧なのかを画面に出す必要があるため（件数が変わる理由になる）。
 *
 * 🚨 クライアントから URL は受け取らない。巡回先はサーバーがパーマリンクから組み立てる。
 *    ajax/check.php と同じ考え方（SSRF はここで塞ぐ）。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 巡回開始。
 *
 * 🚨 順番が大事。トップページ1本で疎通を確かめてから既存データを消す。
 *    先に消すと、巡回できないサイトでは前に採れていた一覧まで失う。
 *
 * @return void
 */
function lw_link_list_crawl_start_ajax() {
    lw_link_list_verify_ajax();

    $preflight = LW_Link_List_Crawler::preflight();

    if ( empty( $preflight['ok'] ) ) {
        // ここで止める＝DBは無傷。利用者には軽いスキャンを案内する
        wp_send_json_error(
            array(
                'message'   => 'しっかり調べるは、このサイトでは使えませんでした。',
                'reason'    => $preflight['reason'],
                'url'       => $preflight['url'],
                'fallback'  => '軽いスキャン（リンクを調べる）はそのまま使えます。',
            ),
            200 // 権限の 403 と区別する。中身は success:false
        );
    }

    $counts = LW_Link_List_Crawler::count_crawlable();

    lw_link_list_begin_scan();
    lw_link_list_reset_scan_state();
    lw_link_list_set_scan_mode( 'full' );
    lw_link_list_set_skipped_count( $counts['skipped'] );

    // 公開ページを開かないと分からない検査（タイトルの長さ・h1）は、この巡回に相乗りして採る。
    // 前回ぶんはここで捨てる（直したページの指摘が残り続けないように）
    LW_Site_Diagnostics::begin_page_rules();

    wp_send_json_success(
        array(
            'total'     => $counts['total'],
            'skipped'   => $counts['skipped'],
            'batchSize' => LW_LINK_LIST_CRAWL_BATCH,
        )
    );
}
add_action( 'wp_ajax_lw_link_list_crawl_start', 'lw_link_list_crawl_start_ajax' );

/**
 * 巡回1バッチ。offset から数ページだけ取りに行って保存する。
 *
 * @return void
 */
function lw_link_list_crawl_batch_ajax() {
    lw_link_list_verify_ajax();

    $offset = isset( $_POST['offset'] ) ? absint( $_POST['offset'] ) : 0;

    $result = LW_Link_List_Crawler::crawl_batch( $offset, LW_LINK_LIST_CRAWL_BATCH );

    lw_link_list_save_pages( $result['pages'] );

    // 取得したHTMLは、この場でしか手に入らない（保存していない）。
    // サイト診断のページ系ルールをここで走らせる
    foreach ( $result['pages'] as $page ) {
        if ( ! empty( $page['html'] ) ) {
            LW_Site_Diagnostics::analyze_crawled( $page['post_id'], $page['html'] );
        }
    }

    foreach ( $result['errors'] as $error ) {
        lw_link_list_add_crawl_error( $error['post_id'], $error['title'], $error['url'], $error['reason'] );
    }

    wp_send_json_success(
        array(
            'crawled' => $result['crawled'],
            'failed'  => count( $result['errors'] ),
            'offset'  => $offset,
            // 取得件数がバッチサイズ未満なら打ち止め（総件数の数え違いに引きずられない）
            'done'    => $result['crawled'] < LW_LINK_LIST_CRAWL_BATCH,
        )
    );
}
add_action( 'wp_ajax_lw_link_list_crawl_batch', 'lw_link_list_crawl_batch_ajax' );

/**
 * 巡回の締め。
 *
 * 全ページを集め終わってからでないと「どのページにも出てくるリンク」が判定できないので、
 * ここでまとめて割り出す。これをやらないと、フッター20本 × 全ページぶんが一覧に並ぶ。
 *
 * @return void
 */
function lw_link_list_crawl_finish_ajax() {
    lw_link_list_verify_ajax();

    $common = lw_link_list_compute_common_links();

    // 一覧ページ（トップの投稿一覧・投稿ページ・カテゴリー）のリンクを集める。
    // 🚨 これが無いと「孤立ページ」の判定が普通のサイトで誤検出になる
    //    （台帳は投稿・固定ページのURLしか巡回しないので、アーカイブからのリンクを持っていない）
    LW_Site_Diagnostics::collect_archive_links();

    // 「公開していないページへのリンク」が、訪問者にはどう見えるかを実際に叩いて確かめる。
    // 🚨 これが無いと R10 が誤検出になる。下書きのURLでも転送が設定されていれば
    //    訪問者はちゃんと別のページを見る（lite-word.com は12種すべてがそうだった・2026-08-23）
    LW_Site_Diagnostics::verify_draft_links();

    // タイトル・h1 をいつ採ったかを控える（診断画面が「まだ調べていない」と出し分ける根拠）
    LW_Site_Diagnostics::finish_page_rules();

    // 途中でアクセス制限を受けていたら、この一覧の付帯情報として残す。
    // 残さないと「今回だけやたら時間がかかった」理由が誰にも分からなくなる
    lw_link_list_set_was_throttled( LW_Link_List_Crawler::is_throttled() );

    wp_send_json_success(
        array(
            'common'    => $common,
            'errors'    => lw_link_list_get_crawl_errors(),
            'throttled' => lw_link_list_was_throttled(),
        )
    );
}
add_action( 'wp_ajax_lw_link_list_crawl_finish', 'lw_link_list_crawl_finish_ajax' );
