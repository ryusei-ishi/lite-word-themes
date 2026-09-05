<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord サイト構造ページ
 *
 * 固定ページ・投稿・カテゴリーの親子関係を、パン・ズーム・自由配置ができる
 * マインドマップ風の専用ページ（ダッシュボード配下）として表示する。
 * 旧実装（components/page-tree/ のモーダル）の全面リニューアル。
 */

define( 'LW_SITE_STRUCTURE_MENU_SLUG', 'lw-site-structure' );
define( 'LW_SITE_STRUCTURE_NONCE_ACTION', 'lw_site_structure_nonce' );
define( 'LW_SITE_STRUCTURE_PATH', LW_DASHBOARD_PATH . 'components/site-structure/' );
define( 'LW_SITE_STRUCTURE_URL', LW_DASHBOARD_URL . 'components/site-structure/' );

require_once LW_SITE_STRUCTURE_PATH . 'ajax-read.php';
require_once LW_SITE_STRUCTURE_PATH . 'ajax-write.php';

// 「ダッシュボード」配下にサブメニューとして登録
add_action( 'admin_menu', 'lw_ss_add_menu' );
function lw_ss_add_menu() {
    add_submenu_page(
        'index.php',
        'サイト構造',
        'サイト構造',
        'edit_pages',
        LW_SITE_STRUCTURE_MENU_SLUG,
        'lw_ss_render_page'
    );
}

// このページでだけCSS/JSを読み込む
add_action( 'admin_enqueue_scripts', 'lw_ss_enqueue_assets' );
function lw_ss_enqueue_assets( $hook_suffix ) {
    // 🚨 hook名を手で組み立てない（functions/lw_broken_link_check/admin/enqueue.php の教訓を踏襲）。
    //    index.php配下のサブメニューは 'dashboard_page_{slug}' になる規則だが、WPの関数に作らせる。
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    if ( get_plugin_page_hookname( LW_SITE_STRUCTURE_MENU_SLUG, 'index.php' ) !== $hook_suffix ) {
        return;
    }

    $css_files = array( 'layout', 'canvas', 'panel' );
    foreach ( $css_files as $name ) {
        $path = LW_SITE_STRUCTURE_PATH . 'css/' . $name . '.css';
        wp_enqueue_style(
            'lw-ss-' . $name,
            LW_SITE_STRUCTURE_URL . 'css/' . $name . '.css',
            array(),
            filemtime( $path )
        );
    }

    $js_files = array( 'store', 'canvas', 'layout', 'nodes-render', 'nodes-drag', 'panel', 'create-page', 'site-structure' );
    $prev_handle = 'jquery';
    foreach ( $js_files as $name ) {
        $path   = LW_SITE_STRUCTURE_PATH . 'js/' . $name . '.js';
        $handle = 'lw-ss-' . $name;
        wp_enqueue_script(
            $handle,
            LW_SITE_STRUCTURE_URL . 'js/' . $name . '.js',
            array( $prev_handle ),
            filemtime( $path ),
            true
        );
        $prev_handle = $handle;
    }

    wp_localize_script( 'lw-ss-store', 'lwSiteStructure', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( LW_SITE_STRUCTURE_NONCE_ACTION ),
    ) );
}

function lw_ss_render_page() {
    ?>
    <div class="wrap lw-ss-wrap">
        <div class="lw-ss-app" id="lw-ss-app">
            <div class="lw-ss-toolbar">
                <h1 class="lw-ss-title">
                    <span class="dashicons dashicons-networking"></span>
                    サイト構造
                </h1>

                <div class="lw-ss-toolbar-group lw-ss-filters">
                    <button type="button" class="lw-ss-filter-btn active" data-filter="page" title="固定ページ">
                        <span class="dashicons dashicons-admin-page"></span>
                        <span class="lw-ss-filter-label">固定ページ</span>
                    </button>
                    <button type="button" class="lw-ss-filter-btn active" data-filter="post" title="投稿">
                        <span class="dashicons dashicons-admin-post"></span>
                        <span class="lw-ss-filter-label">投稿</span>
                    </button>
                    <button type="button" class="lw-ss-filter-btn active" data-filter="draft" title="下書き">
                        <span class="dashicons dashicons-edit"></span>
                        <span class="lw-ss-filter-label">下書き</span>
                    </button>
                </div>

                <div class="lw-ss-toolbar-group lw-ss-zoom">
                    <button type="button" id="lw-ss-zoom-out" title="縮小">
                        <span class="dashicons dashicons-minus"></span>
                    </button>
                    <span id="lw-ss-zoom-level">100%</span>
                    <?php // 🚨 dashicons-plus(f132) は字形自体が1.5px上・縦11pxの非対称で、隣の minus と高さが揃わない。
                          //    plus-alt2(f543) は 12×12 で中央にあり、minus(横12px)と幅も揃う。 ?>
                    <button type="button" id="lw-ss-zoom-in" title="拡大">
                        <span class="dashicons dashicons-plus-alt2"></span>
                    </button>
                    <button type="button" id="lw-ss-zoom-reset" title="全体表示にリセット">
                        <span class="dashicons dashicons-image-rotate"></span>
                    </button>
                </div>

                <button type="button" class="lw-ss-btn" id="lw-ss-auto-layout" title="ドラッグで動かした位置をツリー配置に戻す">
                    <span class="dashicons dashicons-controls-repeat"></span>
                    自動整列
                </button>

                <div class="lw-ss-toolbar-group lw-ss-save-group" id="lw-ss-save-group">
                    <button type="button" class="lw-ss-btn lw-ss-btn-primary" id="lw-ss-save-changes">
                        <span class="dashicons dashicons-saved"></span>
                        変更を保存
                    </button>
                    <button type="button" class="lw-ss-btn" id="lw-ss-cancel-changes">
                        <span class="dashicons dashicons-no"></span>
                        キャンセル
                    </button>
                </div>

                <div class="lw-ss-zoom-hint">背景をドラッグでパン／Ctrl+ホイールでズーム／空いた場所を右クリックで新規ページ作成</div>
            </div>

            <div class="lw-ss-front-warning" id="lw-ss-front-warning">
                <span class="dashicons dashicons-warning"></span>
                <span class="lw-ss-warning-text">トップページが設定されていません。</span>
                <span class="lw-ss-help-icon" id="lw-ss-front-help">
                    <span class="dashicons dashicons-editor-help"></span>
                    <div class="lw-ss-help-tooltip">
                        <strong>トップページとは？</strong>
                        <p>サイトのURL（例：https://example.com/）にアクセスしたときに最初に表示されるページです。</p>
                        <p>設定しない場合、最新の投稿一覧が表示されます。</p>
                    </div>
                </span>
                <select id="lw-ss-front-page-select">
                    <option value="">-- 固定ページを選択 --</option>
                </select>
                <button type="button" class="lw-ss-btn lw-ss-btn-primary" id="lw-ss-btn-set-front">設定</button>
            </div>

            <div class="lw-ss-viewport" id="lw-ss-viewport">
                <div class="lw-ss-canvas" id="lw-ss-canvas">
                    <svg class="lw-ss-connections" id="lw-ss-connections"></svg>
                </div>
                <div class="lw-ss-loading is-visible" id="lw-ss-loading">
                    <span class="spinner is-active"></span>
                    <p>読み込み中...</p>
                </div>
            </div>

            <aside class="lw-ss-panel" id="lw-ss-panel">
                <div class="lw-ss-panel-header">
                    <span>ノードを編集</span>
                    <button type="button" class="lw-ss-panel-close" id="lw-ss-panel-close">
                        <span class="dashicons dashicons-no-alt"></span>
                    </button>
                </div>
                <div class="lw-ss-panel-body" id="lw-ss-panel-body"></div>
            </aside>

            <div class="lw-ss-create-form" id="lw-ss-create-form">
                <div class="lw-ss-create-form-row">
                    <label for="lw-ss-create-title">新しいページのタイトル</label>
                    <input type="text" id="lw-ss-create-title" placeholder="例：料金案内">
                </div>
                <div class="lw-ss-create-form-row">
                    <label for="lw-ss-create-parent">親ページ</label>
                    <select id="lw-ss-create-parent"></select>
                </div>
                <div class="lw-ss-create-form-actions">
                    <button type="button" class="lw-ss-btn lw-ss-btn-primary" id="lw-ss-create-submit">作成</button>
                    <button type="button" class="lw-ss-btn" id="lw-ss-create-cancel">キャンセル</button>
                </div>
            </div>
        </div>
    </div>
    <?php
}
