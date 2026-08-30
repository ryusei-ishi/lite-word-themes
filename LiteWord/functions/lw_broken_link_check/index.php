<?php
/**
 * リンク一覧機能 — モジュールの入口。
 *
 * ここには「定数・読み込み・メニュー登録」しか置かない。
 *
 *   guard.php          … 権限・nonce・プレミアム判定（AJAX は必ずここを通す）
 *   store.php          … wp_lw_link_list（ページごとのリンク一覧）
 *   results-store.php  … wp_lw_link_check_results（HTTPチェックの結果）
 *   scan-state.php     … どちらの方式で採ったか・読めなかったページ・共通リンク（option）
 *   class-scanner.php  … 軽いスキャン（DB内で完結）
 *   class-crawler.php  … しっかりスキャン（公開URLを取得して解析）
 *   class-checker.php  … HTTP ステータス判定
 *   ajax/*.php         … AJAX ハンドラ
 *   admin/*            … 管理画面（表示・アセット）
 *
 * リンクの集め方は2通りある（2026-08-22 Ryuichi 判断）。
 * 詳しい違いと、どちらを使うべきかは scan-state.php の冒頭に書いてある。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* -------------------------------------------------------------
 * 定数
 * ----------------------------------------------------------- */

if ( ! defined( 'LW_BROKEN_LINK_CHECK_PATH' ) ) {
    define( 'LW_BROKEN_LINK_CHECK_PATH', get_template_directory() . '/functions/lw_broken_link_check/' );
}
if ( ! defined( 'LW_BROKEN_LINK_CHECK_URL' ) ) {
    define( 'LW_BROKEN_LINK_CHECK_URL', get_template_directory_uri() . '/functions/lw_broken_link_check/' );
}

// 管理メニューの slug（admin/enqueue.php が hook 名の組み立てに使う）
if ( ! defined( 'LW_LINK_LIST_MENU_SLUG' ) ) {
    define( 'LW_LINK_LIST_MENU_SLUG', 'lw_link_list' );
}

// AJAX の nonce アクション名
if ( ! defined( 'LW_LINK_LIST_NONCE_ACTION' ) ) {
    define( 'LW_LINK_LIST_NONCE_ACTION', 'lw_link_list_ajax' );
}

// 1リクエストで処理する件数。共用サーバーのタイムアウトに収まる大きさにする
if ( ! defined( 'LW_LINK_LIST_SCAN_BATCH' ) ) {
    define( 'LW_LINK_LIST_SCAN_BATCH', 20 );
}
if ( ! defined( 'LW_LINK_LIST_CHECK_BATCH' ) ) {
    define( 'LW_LINK_LIST_CHECK_BATCH', 20 );
}

/* しっかりスキャン（公開URLの巡回）— HTTP を伴うので数字は控えめにする */

// 1リクエストで取りに行くページ数。1ページ8秒 × 3 = 最悪24秒
if ( ! defined( 'LW_LINK_LIST_CRAWL_BATCH' ) ) {
    define( 'LW_LINK_LIST_CRAWL_BATCH', 3 );
}

// 巡回するページ数の上限。超えたぶんは対象から外し、外した件数を必ず画面に出す
if ( ! defined( 'LW_LINK_LIST_CRAWL_MAX' ) ) {
    define( 'LW_LINK_LIST_CRAWL_MAX', 200 );
}

// 読めなかったページを画面に並べる上限（全部並べても読めない）
if ( ! defined( 'LW_LINK_LIST_CRAWL_ERROR_MAX' ) ) {
    define( 'LW_LINK_LIST_CRAWL_ERROR_MAX', 20 );
}

/* 巡回の間隔（🚨 自分のサイトを短時間に何度も叩くと 429 で弾かれる） */

// ページとページの間に空ける時間（ミリ秒）
if ( ! defined( 'LW_LINK_LIST_CRAWL_DELAY_MS' ) ) {
    define( 'LW_LINK_LIST_CRAWL_DELAY_MS', 250 );
}

// リンクの有効性を確かめるときに、1本ごとに空ける時間（ミリ秒）。
// 同じ相手（YouTube・Amazon・自サイト）に何本もリンクが向いていることは普通にある
if ( ! defined( 'LW_LINK_LIST_CHECK_DELAY_MS' ) ) {
    define( 'LW_LINK_LIST_CHECK_DELAY_MS', 200 );
}

// 一度 429 を食らったあとに空ける時間（ミリ秒）
if ( ! defined( 'LW_LINK_LIST_CRAWL_SLOW_DELAY_MS' ) ) {
    define( 'LW_LINK_LIST_CRAWL_SLOW_DELAY_MS', 1200 );
}

// 429 のあと、待ってからやり直すまでの上限（秒）
if ( ! defined( 'LW_LINK_LIST_CRAWL_RETRY_MAX_SEC' ) ) {
    define( 'LW_LINK_LIST_CRAWL_RETRY_MAX_SEC', 5 );
}

// 「弾かれた」ことを次のリクエストへ伝える置き場
if ( ! defined( 'LW_LINK_LIST_THROTTLED_TRANSIENT' ) ) {
    define( 'LW_LINK_LIST_THROTTLED_TRANSIENT', 'lw_link_list_crawl_throttled' );
}

/* サイト共通のリンク（ヘッダー・フッター・メニュー）の見分け方 */

// 全ページの何割に出ていたら「共通」とみなすか
//
// 🚨 0.6 では厳しすぎた（2026-08-22 に lite-word.com の実データで判明）。
//    175ページのサイトで、フッターの利用規約・プライバシーポリシー・特商法が
//    ちょうど100ページ＝57%だったため共通と判定されず、
//    たった6本のために 600行以上の繰り返しが一覧に残った。
//    実データの分布では 20〜99ページに出るURLが1本も無く（16本が100ページ以上、
//    残りは19ページ以下）、10%〜50%のどこに置いても結果が同じだった。
//    真ん中の 0.3 なら、しきい値が多少ぶれても判定が変わらない。
if ( ! defined( 'LW_LINK_LIST_COMMON_RATIO' ) ) {
    define( 'LW_LINK_LIST_COMMON_RATIO', 0.3 );
}

// 割合で出した数がこれを下回っても、これ未満のページ数では共通としない。
// 2ページに出ているだけのものを「サイト共通」と呼ぶと、そのページ固有の情報が消える
if ( ! defined( 'LW_LINK_LIST_COMMON_MIN_HITS' ) ) {
    define( 'LW_LINK_LIST_COMMON_MIN_HITS', 3 );
}

// ページ数がこれ未満のサイトでは共通判定をしない（3ページ中2ページは共通ではない）
if ( ! defined( 'LW_LINK_LIST_COMMON_MIN_PAGES' ) ) {
    define( 'LW_LINK_LIST_COMMON_MIN_PAGES', 5 );
}

/* option 名（🚨 テーブルに列を足さない。理由は scan-state.php の冒頭） */

if ( ! defined( 'LW_LINK_LIST_MODE_OPTION' ) ) {
    define( 'LW_LINK_LIST_MODE_OPTION', 'lw_link_list_scan_mode' );
}
if ( ! defined( 'LW_LINK_LIST_CRAWL_ERRORS_OPTION' ) ) {
    define( 'LW_LINK_LIST_CRAWL_ERRORS_OPTION', 'lw_link_list_crawl_errors' );
}
if ( ! defined( 'LW_LINK_LIST_SKIPPED_OPTION' ) ) {
    define( 'LW_LINK_LIST_SKIPPED_OPTION', 'lw_link_list_skipped' );
}
if ( ! defined( 'LW_LINK_LIST_COMMON_OPTION' ) ) {
    define( 'LW_LINK_LIST_COMMON_OPTION', 'lw_link_list_common_links' );
}
if ( ! defined( 'LW_LINK_LIST_THROTTLED_OPTION' ) ) {
    define( 'LW_LINK_LIST_THROTTLED_OPTION', 'lw_link_list_was_throttled' );
}

// テーブル定義のバージョン（🚨 dbDelta を毎回走らせないためのガードに使う）
if ( ! defined( 'LW_LINK_LIST_DB_VERSION' ) ) {
    define( 'LW_LINK_LIST_DB_VERSION', '1.0' );
}
if ( ! defined( 'LW_LINK_LIST_DB_VERSION_OPTION' ) ) {
    define( 'LW_LINK_LIST_DB_VERSION_OPTION', 'lw_link_list_db_ver' );
}
if ( ! defined( 'LW_LINK_CHECK_DB_VERSION' ) ) {
    define( 'LW_LINK_CHECK_DB_VERSION', '1.0' );
}
if ( ! defined( 'LW_LINK_CHECK_DB_VERSION_OPTION' ) ) {
    define( 'LW_LINK_CHECK_DB_VERSION_OPTION', 'lw_link_check_db_ver' );
}

/* サイト診断（SEOの健全性）*/

if ( ! defined( 'LW_SITE_DIAGNOSE_MENU_SLUG' ) ) {
    define( 'LW_SITE_DIAGNOSE_MENU_SLUG', 'lw_site_diagnose' );
}

// 1リクエストで本文を調べるページ数。HTTP を伴わないのでリンクのスキャンより多く取れる
if ( ! defined( 'LW_SITE_DIAGNOSE_BATCH' ) ) {
    define( 'LW_SITE_DIAGNOSE_BATCH', 30 );
}

if ( ! defined( 'LW_SITE_ISSUES_DB_VERSION' ) ) {
    define( 'LW_SITE_ISSUES_DB_VERSION', '1.0' );
}
if ( ! defined( 'LW_SITE_ISSUES_DB_VERSION_OPTION' ) ) {
    define( 'LW_SITE_ISSUES_DB_VERSION_OPTION', 'lw_site_issues_db_ver' );
}
// 一覧ページ（トップの投稿一覧・カテゴリー）から張られているページのID。孤立判定に使う。
// 🚨 中身は「一覧ページ1本ごとの内訳」（2026-08-23〜）。平らなID配列だった旧形式も読める
if ( ! defined( 'LW_SITE_ARCHIVE_LINKS_OPTION' ) ) {
    define( 'LW_SITE_ARCHIVE_LINKS_OPTION', 'lw_site_archive_links' );
}
// 巡回の締めで取りに行く一覧ページの本数。1本ごとに HTTP が1回増えるので控えめにする
if ( ! defined( 'LW_SITE_ARCHIVE_CRAWL_MAX' ) ) {
    define( 'LW_SITE_ARCHIVE_CRAWL_MAX', 10 );
}

// 「公開していないページのURL」を実際に叩いた結果の置き場（R10 の根拠）。
// 🚨 これが空のうちは R10 を🔴にしない。転送で救われていることがある（2026-08-23 本番実測）
if ( ! defined( 'LW_SITE_DRAFT_LINK_STATUS_OPTION' ) ) {
    define( 'LW_SITE_DRAFT_LINK_STATUS_OPTION', 'lw_site_draft_link_status' );
}
// 1回の巡回で叩いてよい本数。超えたぶんは「確認していない」として残す（黙って切らない）
if ( ! defined( 'LW_SITE_DRAFT_LINK_VERIFY_MAX' ) ) {
    define( 'LW_SITE_DRAFT_LINK_VERIFY_MAX', 30 );
}
// 確認に使ってよい時間（秒）。巡回の締めは他の仕事も持っているので居座らない
if ( ! defined( 'LW_SITE_DRAFT_LINK_VERIFY_BUDGET' ) ) {
    define( 'LW_SITE_DRAFT_LINK_VERIFY_BUDGET', 15 );
}
if ( ! defined( 'LW_SITE_ISSUES_META_OPTION' ) ) {
    define( 'LW_SITE_ISSUES_META_OPTION', 'lw_site_issues_meta' );
}

/* -------------------------------------------------------------
 * 読み込み
 * ----------------------------------------------------------- */

foreach (
    array(
        'guard.php',
        'store.php',
        'results-store.php',
        'scan-state.php',
        'issues-store.php',
        'issues-report.php',
        'diagnostics-dictionary.php',
        'class-scanner.php',
        'class-crawler.php',
        'class-checker.php',
        'class-url-index.php',
        // 検査ルール（1ルール1ファイル）。順番に意味は無いが、増えたらここに足す
        'rules/r10-draft-link.php',
        'rules/r13-orphan.php',
        'rules/r14-archive-orphan.php',
        'rules/r15-redirect.php',
        'rules/r20-sitemap-noindex.php',
        'rules/r22-duplicate-title.php',
        'rules/r23-title-length.php',
        'rules/r24-description.php',
        'rules/r30-heading.php',
        'rules/r32-image-alt.php',
        'rules/r34-title-suffix.php',
        'rules/r35-placeholder.php',
        // ルールを読んでからエンジン（エンジンは関数名で呼ぶ）
        'class-diagnostics.php',
        'ajax/scan.php',
        'ajax/crawl.php',
        'ajax/check.php',
        'ajax/edit.php',
        'ajax/diagnose.php',
        'admin/enqueue.php',
    ) as $lw_link_list_file
) {
    $lw_link_list_path = LW_BROKEN_LINK_CHECK_PATH . $lw_link_list_file;
    if ( file_exists( $lw_link_list_path ) ) {
        require_once $lw_link_list_path;
    }
}
unset( $lw_link_list_file, $lw_link_list_path );

/* -------------------------------------------------------------
 * 管理メニュー
 * ----------------------------------------------------------- */

/**
 * 管理メニュー登録
 *
 * プレミアム限定（2026-08-22 Ryuichi 判断）。
 * 使えない人にはメニュー自体を出さない。AJAX 側でも同じ判定を通す。
 *
 * @return void
 */
function lw_broken_link_check_admin_menu() {
    if ( ! lw_link_list_can_use() ) {
        return;
    }

    add_menu_page(
        'リンク一覧',
        'リンク一覧',
        'manage_options',
        LW_LINK_LIST_MENU_SLUG,
        'lw_broken_link_check_all_links_page',
        'dashicons-admin-links',
        25
    );

    add_submenu_page(
        LW_LINK_LIST_MENU_SLUG,
        'サイト診断',
        'サイト診断',
        'manage_options',
        LW_SITE_DIAGNOSE_MENU_SLUG,
        'lw_site_diagnose_page'
    );
}
add_action( 'admin_menu', 'lw_broken_link_check_admin_menu' );

/**
 * リンク一覧ページ表示
 *
 * @return void
 */
function lw_broken_link_check_all_links_page() {
    if ( ! lw_link_list_can_use() ) {
        wp_die( esc_html__( 'この機能を利用する権限がありません。', 'lite-word' ) );
    }

    require LW_BROKEN_LINK_CHECK_PATH . 'admin/page.php';
}

/**
 * サイト診断ページ表示
 *
 * @return void
 */
function lw_site_diagnose_page() {
    if ( ! lw_link_list_can_use() ) {
        wp_die( esc_html__( 'この機能を利用する権限がありません。', 'lite-word' ) );
    }

    require LW_BROKEN_LINK_CHECK_PATH . 'admin/diagnostics-page.php';
}
