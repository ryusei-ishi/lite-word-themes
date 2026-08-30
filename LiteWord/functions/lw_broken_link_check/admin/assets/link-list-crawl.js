/**
 * しっかりスキャン — 公開ページを実際に読みに行くほうの画面側。
 *
 * 軽いスキャンは link-list.js が持っている。こちらを別ファイルにしてあるのは、
 * link-list.js が既に1,000行を超えていて、これ以上1枚に足すと読めなくなるため。
 *
 * link-list.js の中の関数は closure に閉じていて外から見えないので、
 * 必要なものは window.lwLinkListApi 経由でもらう（link-list.js の末尾で公開している）。
 * 読み込み順は admin/enqueue.php で保証している（依存に lw-link-list を指定）。
 */
jQuery(document).ready(function($) {
    var cfg = window.lwLinkList || {};
    var api = window.lwLinkListApi;

    // link-list.js が読めていない状況では何もしない（ボタンだけ生きていると事故になる）
    if (!api) {
        return;
    }

    var $button = $('#lw-start-crawl');

    if (!$button.length) {
        return;
    }

    /**
     * 巡回を1バッチずつ進める。
     *
     * 1ページごとに HTTP を叩くので、軽いスキャンよりずっと遅い。
     * どこまで進んだかを必ず出す（黙って固まっているように見せない）。
     */
    function runCrawlBatch(offset, total) {
        var shown = total > 0 ? Math.min(offset, total) + ' / ' + total : offset;
        $('#lw-loading .lw-link-list-loading-text').text('ページを読み込み中... ' + shown);

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: api.lwData('lw_link_list_crawl_batch', { offset: offset }),
            success: function(response) {
                if (!response.success) {
                    api.showError(response);
                    finishCrawl();
                    return;
                }

                var crawled = response.data.crawled || 0;

                // crawled が 0 なら必ず止める（進まないまま呼び続けないための歯止め）
                if (response.data.done || crawled === 0) {
                    finishCrawl();
                    return;
                }

                runCrawlBatch(offset + crawled, total);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                alert('通信エラーが発生しました。');
                finishCrawl();
            }
        });
    }

    /**
     * 締め。
     *
     * 全ページを集め終わってからでないと「どのページにも出てくるリンク」が判定できないので、
     * サーバー側で最後にまとめて割り出してもらってから画面を作り直す。
     */
    function finishCrawl() {
        $('#lw-loading .lw-link-list-loading-text').text('共通のリンクを整理中...');

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: api.lwData('lw_link_list_crawl_finish'),
            complete: function() {
                // 締めに失敗しても一覧そのものは採れている。読み込みまでは必ず進める
                // ボタンの文言は変えない（link-list.js の finishScan と同じ理由）
                api.afterScanCompleted();
            }
        });
    }

    /**
     * 巡回できなかったときに、理由をそのまま画面に出す。
     *
     * 🚨 黙って軽いスキャンに切り替えないこと（2026-08-22 Ryuichi と確認）。
     *    勝手に切り替えると、なぜ件数が違うのかが利用者に分からなくなる。
     *    ここでは「使えなかった理由」と「代わりに何ができるか」の両方を出す。
     */
    function showCrawlBlocked(data) {
        var message = (data && data.message) ? data.message : 'しっかり調べるは、このサイトでは使えませんでした。';
        var reason = (data && data.reason) ? data.reason : '';
        var fallback = (data && data.fallback) ? data.fallback : '';

        var html = '<p><strong>' + api.escapeHtml(message) + '</strong></p>';

        if (reason) {
            html += '<p>理由: ' + api.escapeHtml(reason) + '</p>';
        }

        if (fallback) {
            html += '<p>' + api.escapeHtml(fallback) + '</p>';
        }

        $('#lw-crawl-notice').html(html).show();
    }

    $button.on('click', function() {
        api.setScanButtonsDisabled(true);
        $('#lw-crawl-notice').hide().empty();
        $('#lw-loading').show();
        $('#lw-loading .lw-link-list-loading-text').text('サイトが読めるか確認中...');
        $('#lw-results').hide();
        $('#lw-stats').hide();

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: api.lwData('lw_link_list_crawl_start'),
            success: function(response) {
                if (!response.success) {
                    // 疎通の失敗（パスワード保護・メンテナンス中・ループバック不可）。
                    // この場合サーバー側は既存データを消していないので、一覧はそのまま残る
                    showCrawlBlocked(response.data);
                    api.setScanButtonsDisabled(false);
                    $('#lw-loading').hide();
                    $('#lw-results').show();
                    $('#lw-stats').show();
                    return;
                }

                runCrawlBatch(0, response.data.total || 0);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                alert('通信エラーが発生しました。');
                api.setScanButtonsDisabled(false);
                $('#lw-loading').hide();
            }
        });
    });
});
