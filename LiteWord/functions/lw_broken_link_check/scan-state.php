<?php
/**
 * リンク一覧 — 「いまの一覧が、どうやって集められたものか」を持つ。
 *
 * リンクの集め方は2通りある（2026-08-22 Ryuichi 判断）。
 *
 *   light（軽いスキャン） … DB の中だけで完結する。本文と the_content の出力から集める。
 *                           速いがヘッダー・フッター・メニューは見えない。
 *   full （しっかりスキャン）… 公開URLを実際に取得して解析する。訪問者が見るHTMLそのもの。
 *                           取りこぼしが無い代わりにページ数ぶんの HTTP が要る。
 *
 * どちらで採ったかを画面に出さないと、件数が違う理由が利用者に分からなくなる。
 * だからモードは必ず記録して表示する。
 *
 * 🚨 ここで扱う値はすべて option に置く（テーブルに列を足さない）。
 *    dbDelta の ALTER TABLE は 2026-08-20 に lite-word.com を 774ms まで落としている。
 *    列を増やさずに済むならその方が安全。autoload は必ず false
 *    （リンク一覧の画面でしか読まないので、毎リクエストに載せる理由が無い）。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* -------------------------------------------------------------
 * スキャン方式
 * ----------------------------------------------------------- */

/**
 * いまの一覧をどちらの方式で採ったか。
 *
 * @return string 'light' または 'full'。一度も採っていなければ 'light'。
 */
function lw_link_list_get_scan_mode() {
    $mode = get_option( LW_LINK_LIST_MODE_OPTION );

    return ( 'full' === $mode ) ? 'full' : 'light';
}

/**
 * スキャン方式を記録する。
 *
 * @param string $mode 'light' または 'full'。
 * @return void
 */
function lw_link_list_set_scan_mode( $mode ) {
    update_option( LW_LINK_LIST_MODE_OPTION, ( 'full' === $mode ) ? 'full' : 'light', false );
}

/* -------------------------------------------------------------
 * 読めなかったページ
 * ----------------------------------------------------------- */

/**
 * 巡回で読めなかったページの記録を消す。
 *
 * @return void
 */
function lw_link_list_clear_crawl_errors() {
    delete_option( LW_LINK_LIST_CRAWL_ERRORS_OPTION );
}

/**
 * 読めなかったページを1件足す。
 *
 * @param int    $post_id 対象。
 * @param string $title   ページ名。
 * @param string $url     読もうとしたURL。
 * @param string $reason  理由（利用者に見せる日本語）。
 * @return void
 */
function lw_link_list_add_crawl_error( $post_id, $title, $url, $reason ) {
    $errors = lw_link_list_get_crawl_errors();

    $errors[] = array(
        'post_id' => (int) $post_id,
        'title'   => (string) $title,
        'url'     => (string) $url,
        'reason'  => (string) $reason,
    );

    // 何十件も並べても読めないので、画面に出すぶんだけ持つ（件数は別に数える）
    if ( count( $errors ) > LW_LINK_LIST_CRAWL_ERROR_MAX ) {
        $errors = array_slice( $errors, 0, LW_LINK_LIST_CRAWL_ERROR_MAX );
    }

    update_option( LW_LINK_LIST_CRAWL_ERRORS_OPTION, $errors, false );
}

/**
 * 読めなかったページの一覧。
 *
 * @return array
 */
function lw_link_list_get_crawl_errors() {
    $errors = get_option( LW_LINK_LIST_CRAWL_ERRORS_OPTION );

    return is_array( $errors ) ? $errors : array();
}

/* -------------------------------------------------------------
 * 巡回できなかったページ数（上限で打ち切ったぶん）
 * ----------------------------------------------------------- */

/**
 * 上限で対象から外したページ数を記録する。
 *
 * 🚨 黙って打ち切らないこと。全部見たつもりの人が見落とす。
 *
 * @param int $count 外した件数。
 * @return void
 */
function lw_link_list_set_skipped_count( $count ) {
    update_option( LW_LINK_LIST_SKIPPED_OPTION, (int) $count, false );
}

/**
 * 上限で対象から外したページ数。
 *
 * @return int
 */
function lw_link_list_get_skipped_count() {
    return (int) get_option( LW_LINK_LIST_SKIPPED_OPTION, 0 );
}

/* -------------------------------------------------------------
 * サーバーにアクセス制限をかけられたか
 * ----------------------------------------------------------- */

/**
 * この巡回の途中で 429 を食らったかを覚えておく。
 *
 * 覚えておかないと「なぜか今回だけ3分かかった」という体験になる。
 * 実測: lite-word.com（175ページ）で 42秒 → 173秒。
 * 間隔を広げて全ページ取り切った結果なので、遅いこと自体は正しい。
 * だからこそ、遅くなった理由を画面に出す。
 *
 * @param bool $yes 弾かれたか。
 * @return void
 */
function lw_link_list_set_was_throttled( $yes ) {
    update_option( LW_LINK_LIST_THROTTLED_OPTION, $yes ? 1 : 0, false );
}

/**
 * この一覧を採るときにアクセス制限を受けたか。
 *
 * @return bool
 */
function lw_link_list_was_throttled() {
    return (bool) get_option( LW_LINK_LIST_THROTTLED_OPTION, 0 );
}

/* -------------------------------------------------------------
 * サイト共通のリンク（ヘッダー・フッター・メニュー）
 * ----------------------------------------------------------- */

/**
 * どのページにも出てくるリンクを割り出して覚える。
 *
 * しっかりスキャンはヘッダー・フッター・メニューまで拾うので、
 * そのまま並べると1ページぶんの本文リンクより共通パーツの方が多くなり、
 * 一覧が読めなくなる（20ページ × フッター20本 = 400行の繰り返し）。
 * → 「多くのページに共通で出ている本文外のリンク」を別扱いにして、一覧では1回だけ見せる。
 *
 * 判定は本文の外（link_index が -1）にあり、かつ全ページの一定割合以上に出ているもの。
 * ページ数が少ないサイトでは意味が無い（3ページ中2ページ＝67% でも「共通」ではない）ので、
 * 一定数に満たなければ何もしない。
 *
 * @return int 共通と判定した本数。
 */
function lw_link_list_compute_common_links() {
    $data  = lw_link_list_get_from_db( false );
    $pages = $data['pages'];

    $page_count = count( $pages );

    if ( $page_count < LW_LINK_LIST_COMMON_MIN_PAGES ) {
        delete_option( LW_LINK_LIST_COMMON_OPTION );
        return 0;
    }

    // href ごとに「本文外として何ページに出たか」を数える
    $seen_in_page = array();
    $counts       = array();

    foreach ( $data['links'] as $link ) {
        $href = isset( $link['href'] ) ? (string) $link['href'] : '';

        if ( '' === $href ) {
            continue;
        }

        // 本文にあるリンクは編集もできるし、そのページ固有の話なので共通にはしない
        if ( isset( $link['link_index'] ) && (int) $link['link_index'] >= 0 ) {
            continue;
        }

        $source_id = isset( $link['source_id'] ) ? (int) $link['source_id'] : 0;
        $key       = $href . "\n" . $source_id;

        if ( isset( $seen_in_page[ $key ] ) ) {
            continue;
        }

        $seen_in_page[ $key ] = true;

        if ( ! isset( $counts[ $href ] ) ) {
            $counts[ $href ] = 0;
        }

        ++$counts[ $href ];
    }

    if ( empty( $counts ) ) {
        delete_option( LW_LINK_LIST_COMMON_OPTION );
        return 0;
    }

    // 割合で決めるが、下限は必ず設ける（2ページに出ているだけのものを共通と呼ばない）
    $threshold = max(
        LW_LINK_LIST_COMMON_MIN_HITS,
        (int) ceil( $page_count * LW_LINK_LIST_COMMON_RATIO )
    );

    $common = array();

    foreach ( $counts as $href => $count ) {
        if ( $count >= $threshold ) {
            $common[ $href ] = $count;
        }
    }

    if ( empty( $common ) ) {
        delete_option( LW_LINK_LIST_COMMON_OPTION );
        return 0;
    }

    update_option( LW_LINK_LIST_COMMON_OPTION, $common, false );

    return count( $common );
}

/**
 * サイト共通と判定済みのリンク（href => 出現ページ数）。
 *
 * @return array
 */
function lw_link_list_get_common_links() {
    $common = get_option( LW_LINK_LIST_COMMON_OPTION );

    return is_array( $common ) ? $common : array();
}

/**
 * 共通リンクの判定結果を捨てる（軽いスキャンではヘッダーもフッターも採らないので不要）。
 *
 * @return void
 */
function lw_link_list_clear_common_links() {
    delete_option( LW_LINK_LIST_COMMON_OPTION );
}

/**
 * スキャンを始めるときに、前回の付帯情報をまとめて捨てる。
 *
 * @return void
 */
function lw_link_list_reset_scan_state() {
    lw_link_list_clear_crawl_errors();
    lw_link_list_clear_common_links();
    lw_link_list_set_skipped_count( 0 );
    lw_link_list_set_was_throttled( false );

    // 前回 429 で弾かれた記録も捨てる。残しておくと、
    // 一度弾かれただけで以後ずっと遅い巡回になってしまう
    delete_transient( LW_LINK_LIST_THROTTLED_TRANSIENT );
}
