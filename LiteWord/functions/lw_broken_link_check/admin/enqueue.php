<?php
/**
 * リンク一覧ページの CSS / JS を登録する。
 *
 * 🚨 PHP からフロントへ値を渡す口はここ1つだけ。
 *    JS 側に <?php ?> を書き戻さないこと（外部ファイルでは PHP は動かない）。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * リンク一覧ページでだけアセットを読み込む。
 *
 * @param string $hook_suffix 現在の管理画面ページ。
 */
function lw_link_list_enqueue_assets( $hook_suffix ) {
    // add_menu_page( ..., 'lw_link_list', ... ) が作る hook。他のページでは読み込まない
    if ( 'toplevel_page_' . LW_LINK_LIST_MENU_SLUG !== $hook_suffix ) {
        return;
    }

    // 画面に出ている以上ここは通るはずだが、権限は毎回見る
    if ( ! lw_link_list_can_use() ) {
        return;
    }

    $base_url = LW_BROKEN_LINK_CHECK_URL . 'admin/assets/';
    $base_dir = LW_BROKEN_LINK_CHECK_PATH . 'admin/assets/';

    // ファイル更新時刻をバージョンにしてキャッシュを跨がせない
    $css_ver   = file_exists( $base_dir . 'link-list.css' ) ? filemtime( $base_dir . 'link-list.css' ) : false;
    $js_ver    = file_exists( $base_dir . 'link-list.js' ) ? filemtime( $base_dir . 'link-list.js' ) : false;
    $crawl_ver = file_exists( $base_dir . 'link-list-crawl.js' ) ? filemtime( $base_dir . 'link-list-crawl.js' ) : false;

    wp_enqueue_style(
        'lw-link-list',
        $base_url . 'link-list.css',
        array(),
        $css_ver
    );

    wp_enqueue_script(
        'lw-link-list',
        $base_url . 'link-list.js',
        array( 'jquery' ),
        $js_ver,
        true
    );

    // 🚨 依存に 'lw-link-list' を必ず入れること。
    //    しっかりスキャン側は link-list.js が最後に公開する window.lwLinkListApi を使う。
    //    順番が逆になると api が undefined になり、ボタンだけ生きて何も起きない。
    wp_enqueue_script(
        'lw-link-list-crawl',
        $base_url . 'link-list-crawl.js',
        array( 'jquery', 'lw-link-list' ),
        $crawl_ver,
        true
    );

    // 投稿タイプのラベル（タブの見出しに使う）
    $post_type_labels = array();
    foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $slug => $obj ) {
        $post_type_labels[ $slug ] = $obj->label;
    }

    wp_localize_script(
        'lw-link-list',
        'lwLinkList',
        array(
            'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
            'nonce'          => wp_create_nonce( LW_LINK_LIST_NONCE_ACTION ),
            'homeUrl'        => home_url(),
            'postTypeLabels' => $post_type_labels,
            'scanBatchSize'  => LW_LINK_LIST_SCAN_BATCH,
            'checkBatchSize' => LW_LINK_LIST_CHECK_BATCH,
            'crawlBatchSize' => LW_LINK_LIST_CRAWL_BATCH,
            'crawlMax'       => LW_Link_List_Crawler::get_max_pages(),
        )
    );
}
add_action( 'admin_enqueue_scripts', 'lw_link_list_enqueue_assets' );

/**
 * サイト診断ページでだけアセットを読み込む。
 *
 * 🚨 hook 名を手で組み立てないこと。サブメニューの hook は親メニューの slug から
 *    作られる（lw_link_list_page_lw_site_diagnose）。WordPress の関数に作らせる。
 *
 * @param string $hook_suffix 現在の管理画面ページ。
 */
function lw_site_diagnose_enqueue_assets( $hook_suffix ) {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';

    $expected = get_plugin_page_hookname( LW_SITE_DIAGNOSE_MENU_SLUG, LW_LINK_LIST_MENU_SLUG );

    if ( $expected !== $hook_suffix ) {
        return;
    }

    if ( ! lw_link_list_can_use() ) {
        return;
    }

    $base_url = LW_BROKEN_LINK_CHECK_URL . 'admin/assets/';
    $base_dir = LW_BROKEN_LINK_CHECK_PATH . 'admin/assets/';

    $css_ver = file_exists( $base_dir . 'diagnostics.css' ) ? filemtime( $base_dir . 'diagnostics.css' ) : false;
    $js_ver  = file_exists( $base_dir . 'diagnostics.js' ) ? filemtime( $base_dir . 'diagnostics.js' ) : false;

    wp_enqueue_style( 'lw-site-diagnose', $base_url . 'diagnostics.css', array(), $css_ver );
    wp_enqueue_script( 'lw-site-diagnose', $base_url . 'diagnostics.js', array( 'jquery' ), $js_ver, true );

    wp_localize_script(
        'lw-site-diagnose',
        'lwSiteDiagnose',
        array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            // リンク一覧と同じ nonce・同じガードを通す（同じ機能の別画面なので）
            'nonce'   => wp_create_nonce( LW_LINK_LIST_NONCE_ACTION ),
        )
    );
}
add_action( 'admin_enqueue_scripts', 'lw_site_diagnose_enqueue_assets' );
