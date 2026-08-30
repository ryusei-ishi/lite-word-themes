<?php
/**
 * サイト診断ページ — 表示だけを持つ。
 *
 * CSS  … admin/assets/diagnostics.css
 * JS   … admin/assets/diagnostics.js（PHP から渡す値は admin/enqueue.php の lwSiteDiagnose）
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$lw_diag_meta = lw_site_issues_get_meta();
?>

<div class="wrap lw-diagnose-wrap">
    <h1>サイト診断</h1>
    <p>
        検索エンジンから見たときの問題を、サイトの中から調べます。
        外から調べるツールでは分からないこと（下書きのページへのリンク、どこからもリンクされていないページ、
        検索設定とサイトマップの食い違い）が中心です。
    </p>

    <div class="lw-diagnose-controls">
        <button type="button" id="lw-diagnose-run" class="button button-primary lw-diagnose-button">
            <span class="dashicons dashicons-search"></span>
            <span class="lw-diagnose-button-labels">
                <span class="lw-diagnose-button-title">このサイトを診断する</span>
                <span class="lw-diagnose-button-sub">本文と設定だけを見ます／数秒で終わります</span>
            </span>
        </button>

        <?php if ( ! empty( $lw_diag_meta['checked_at'] ) ) : ?>
            <span class="lw-diagnose-last">
                最終診断: <?php echo esc_html( date_i18n( 'Y年n月j日 H:i', strtotime( $lw_diag_meta['checked_at'] ) ) ); ?>
            </span>
        <?php endif; ?>
    </div>

    <div id="lw-diagnose-progress" class="lw-diagnose-progress">
        <div class="lw-diagnose-progress-bar"><span id="lw-diagnose-progress-fill"></span></div>
        <p id="lw-diagnose-progress-text">準備中...</p>
    </div>

    <!-- 点数と内訳（JS が埋める） -->
    <div id="lw-diagnose-score" class="lw-diagnose-score"></div>

    <!-- 何を調べていないか（JS が埋める）。ここを出さないと「問題なし」と読み違えられる -->
    <div id="lw-diagnose-coverage" class="lw-diagnose-coverage"></div>

    <!-- 指摘一覧（JS が埋める） -->
    <div id="lw-diagnose-issues" class="lw-diagnose-issues"></div>
</div>
