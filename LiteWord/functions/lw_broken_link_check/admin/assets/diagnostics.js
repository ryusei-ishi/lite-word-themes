/**
 * サイト診断 — 画面の動き。
 *
 * PHP から受け取る値は window.lwSiteDiagnose（admin/enqueue.php）。
 * ここに <?php ?> を書き戻さないこと（外部ファイルでは PHP は動かない）。
 */
(function ($) {
    'use strict';

    var cfg = window.lwSiteDiagnose || {};
    var data = null;

    /**
     * AJAX 1本。nonce は毎回送る（サーバー側で必ず検証される）。
     */
    function post(action, extra) {
        return $.post(cfg.ajaxUrl, $.extend({ action: action, nonce: cfg.nonce }, extra || {}));
    }

    function escapeHtml(text) {
        return $('<div>').text(text == null ? '' : text).html();
    }

    /* ---------------------------------------------------------
     * 進み具合
     * ------------------------------------------------------- */

    function showProgress(percent, text) {
        $('#lw-diagnose-progress').addClass('is-active');
        $('#lw-diagnose-progress-fill').css('width', Math.max(0, Math.min(100, percent)) + '%');
        $('#lw-diagnose-progress-text').text(text);
    }

    function hideProgress() {
        $('#lw-diagnose-progress').removeClass('is-active');
    }

    /* ---------------------------------------------------------
     * 診断を走らせる（開始 → 本文をバッチで → 締め）
     * ------------------------------------------------------- */

    function run() {
        var $button = $('#lw-diagnose-run').prop('disabled', true);

        showProgress(0, '準備中...');

        post('lw_site_diagnose_start')
            .done(function (res) {
                if (!res || !res.success) {
                    fail(res);
                    return;
                }

                var total = res.data.total || 0;
                var size = res.data.batchSize || 30;

                batch(0, total, size, function () {
                    showProgress(95, 'サイト全体を見ています...');

                    post('lw_site_diagnose_finish')
                        .done(function (finish) {
                            if (!finish || !finish.success) {
                                fail(finish);
                                return;
                            }
                            load(function () {
                                hideProgress();
                                $button.prop('disabled', false);
                            });
                        })
                        .fail(function () { fail(null); });
                });
            })
            .fail(function () { fail(null); });
    }

    function batch(offset, total, size, done) {
        post('lw_site_diagnose_batch', { offset: offset })
            .done(function (res) {
                if (!res || !res.success) {
                    fail(res);
                    return;
                }

                var checked = res.data.checked || 0;
                var next = offset + (checked || size);
                var percent = total ? Math.min(90, Math.round((next / total) * 90)) : 45;

                showProgress(percent, '本文を調べています... ' + Math.min(next, total) + ' / ' + total);

                if (res.data.done) {
                    done();
                    return;
                }

                batch(next, total, size, done);
            })
            .fail(function () { fail(null); });
    }

    function fail(res) {
        hideProgress();
        $('#lw-diagnose-run').prop('disabled', false);

        var message = (res && res.data && res.data.message)
            ? res.data.message
            : '診断できませんでした。画面を再読み込みしてからもう一度お試しください。';

        $('#lw-diagnose-issues').html('<div class="notice notice-error"><p>' + escapeHtml(message) + '</p></div>');
    }

    /* ---------------------------------------------------------
     * 結果の読み込みと描画
     * ------------------------------------------------------- */

    function load(after) {
        post('lw_site_diagnose_load')
            .done(function (res) {
                if (res && res.success) {
                    data = res.data;
                    render();
                }
                if (after) { after(); }
            })
            .fail(function () { if (after) { after(); } });
    }

    function render() {
        renderScore();
        renderCoverage();
        renderIssues();
    }

    function scoreLabel(score) {
        if (score >= 90) { return 'とても良い'; }
        if (score >= 75) { return '良い'; }
        if (score >= 50) { return '直すところがあります'; }
        return '早めに手を入れたい状態です';
    }

    function renderScore() {
        var s = data.summary || {};
        var c = s.counts || {};

        if (!s.checkedAt) {
            $('#lw-diagnose-score').html(
                '<div class="lw-diagnose-empty">まだ診断していません。「このサイトを診断する」を押してください。</div>'
            );
            return;
        }

        var html = ''
            + '<div class="lw-diagnose-score-card lw-score-' + scoreClass(s.score) + '">'
            + '  <div class="lw-diagnose-score-number">' + (s.score != null ? s.score : '-') + '<small>点</small></div>'
            + '  <div class="lw-diagnose-score-label">' + escapeHtml(scoreLabel(s.score)) + '</div>'
            + '</div>'
            + '<div class="lw-diagnose-counts">'
            + counter('critical', '重大', c.critical || 0)
            + counter('warning', '要改善', c.warning || 0)
            + counter('info', '気づき', c.info || 0)
            + '  <span class="lw-diagnose-pages">調べたページ: ' + (s.pages || 0)
            + (typeof s.indexable === 'number' ? '（うち検索に出すページ ' + s.indexable + '）' : '')
            + '</span>'
            + '</div>';

        $('#lw-diagnose-score').html(html);
    }

    function scoreClass(score) {
        if (score >= 90) { return 'good'; }
        if (score >= 75) { return 'ok'; }
        if (score >= 50) { return 'warn'; }
        return 'bad';
    }

    function counter(key, label, count) {
        return '<span class="lw-diagnose-count lw-diagnose-count-' + key + '">'
            + escapeHtml(label) + ' <strong>' + count + '</strong></span>';
    }

    /**
     * 何を調べていないかを必ず出す。
     * 「問題なし」と読み違えられると、調べていないことが見落としになる。
     */
    function renderCoverage() {
        var s = data.summary || {};
        var notes = [];

        // 検索に出さないページを、検索まわりの検査から外していることは必ず伝える。
        // 黙って減らすと「うちのサイトは問題が少ない」と読み違えられる
        if (typeof s.indexable === 'number' && s.pages && s.indexable < s.pages) {
            notes.push('サイトマップに載っていない ' + (s.pages - s.indexable) + ' ページ（サンプルや検索に出さない設定のページ）は、'
                + '<strong>タイトル・説明文・孤立ページの検査から外しています</strong>。'
                + '公開していないページへのリンク・差し込み文字の残り・画像の説明文は、全ページを見ています。');
        }

        if (!s.pageRulesAt) {
            notes.push('タイトルの長さ・大見出し（h1）の検査は、まだ含まれていません。'
                + '<a href="' + escapeHtml(data.linkListUrl) + '">リンク一覧</a> の「ページを開いて全部調べる」を実行すると次回から含まれます。');
        }

        // 🚨 確かめていないのに「訪問者は404を見ます」と言い切らない。
        //    下書きのURLでも、転送が設定されていれば訪問者はちゃんと別のページを見る
        //    （lite-word.com は指摘12種すべてがそうだった・2026-08-23）
        if (!s.draftLinksAt) {
            notes.push('公開していないページへのリンクが、訪問者に<strong>本当に開けないのか</strong>は、まだ確かめていません。'
                + '転送（リダイレクト）が設定されていれば訪問者は困りません。'
                + '<a href="' + escapeHtml(data.linkListUrl) + '">リンク一覧</a> の「ページを開いて全部調べる」を実行すると、実際に開いて確かめます。');
        } else if (s.draftLinksPending > 0) {
            // 一度は確かめたが、途中で時間切れ・相手が断った、が残っている。
            // 黙って残すと「何度実行しても消えない指摘」に見える（2026-08-23）
            notes.push('公開していないページへのリンクのうち <strong>' + s.draftLinksPending + ' 本</strong>は、'
                + '実際に開けるかどうかをまだ確かめきれていません（時間切れ、または相手が応答しなかったもの）。'
                + '<a href="' + escapeHtml(data.linkListUrl) + '">リンク一覧</a> の「ページを開いて全部調べる」をもう一度実行すると、'
                + '<strong>確かめていないものから順に続きを調べます</strong>（前回の結果は残るのでやり直しにはなりません）。');
        }

        if (s.scanMode !== 'full' || !s.archiveLinks) {
            notes.push('「どこからもリンクされていないページ」と「一覧ページに入る道が無い」の検査は含まれていません。'
                + 'ヘッダー・フッター・メニューや、投稿一覧からのリンクが分からないため、誤って孤立と判定してしまうからです。'
                + '<a href="' + escapeHtml(data.linkListUrl) + '">リンク一覧</a> の「ページを開いて全部調べる」を実行してから診断すると含まれます。');
        }

        var link = data.linkCheck || {};
        if (!link.lastChecked) {
            notes.push('外部リンクが切れていないかは、この診断には含まれていません（相手のサイトに問い合わせる必要があるため）。'
                + '<a href="' + escapeHtml(data.linkListUrl) + '">リンク一覧</a> の「リンク有効性をチェック」で調べられます。');
        }

        if (!notes.length) {
            $('#lw-diagnose-coverage').empty();
            return;
        }

        $('#lw-diagnose-coverage').html(
            '<div class="lw-diagnose-note"><strong>この診断に含まれていないもの</strong><ul><li>'
            + notes.join('</li><li>') + '</li></ul></div>'
        );
    }

    function renderIssues() {
        var issues = data.issues || [];
        var rules = data.rules || {};

        if (!issues.length) {
            if (data.summary && data.summary.checkedAt) {
                $('#lw-diagnose-issues').html('<div class="lw-diagnose-clean">見つかった問題はありません。</div>');
            } else {
                $('#lw-diagnose-issues').empty();
            }
            return;
        }

        // ルールごとにまとめる（同じ直し方のものを1か所で見せる）
        var groups = {};
        var order = [];

        issues.forEach(function (issue) {
            if (!groups[issue.rule_id]) {
                groups[issue.rule_id] = [];
                order.push(issue.rule_id);
            }
            groups[issue.rule_id].push(issue);
        });

        var html = '';

        order.forEach(function (ruleId) {
            var list = groups[ruleId];
            var info = rules[ruleId] || {};
            var severity = list[0].severity;

            html += '<details class="lw-diagnose-group lw-diagnose-' + severity + '" open>'
                + '<summary>'
                + '<span class="lw-diagnose-badge">' + severityLabel(severity) + '</span>'
                + '<span class="lw-diagnose-group-title">' + escapeHtml(info.title || ruleId) + '</span>'
                + '<span class="lw-diagnose-group-count">' + list.length + '件</span>'
                + '</summary>';

            if (info.why) {
                html += '<p class="lw-diagnose-why"><strong>なぜ直すのか:</strong> ' + escapeHtml(info.why) + '</p>';
            }
            if (info.how) {
                html += '<p class="lw-diagnose-how"><strong>直し方:</strong> ' + escapeHtml(info.how) + '</p>';
            }
            if (info.caveat) {
                html += '<p class="lw-diagnose-caveat">' + escapeHtml(info.caveat) + '</p>';
            }

            html += '<table class="widefat striped lw-diagnose-table"><tbody>';

            list.forEach(function (issue) {
                html += '<tr><td class="lw-diagnose-page">' + pageCell(issue) + '</td>'
                    + '<td class="lw-diagnose-message">' + escapeHtml(issue.message) + '</td></tr>';
            });

            html += '</tbody></table></details>';
        });

        $('#lw-diagnose-issues').html(html);
    }

    function pageCell(issue) {
        if (!issue.post_id) {
            return '<em>サイト全体</em>';
        }

        var title = escapeHtml(issue.post_title || ('#' + issue.post_id));

        // 🚨 別タブで開く。診断結果を見ながら直したいので、この画面を離れさせない
        //    （リンク一覧の一覧表も同じ作り。admin/assets/link-list.js）
        var out = issue.edit_link
            ? '<a href="' + escapeHtml(issue.edit_link) + '" target="_blank" rel="noopener">' + title + '</a>'
            : title;

        if (issue.view_link) {
            out += ' <a class="lw-diagnose-view" href="' + escapeHtml(issue.view_link) + '" target="_blank" rel="noopener">表示</a>';
        }

        return out;
    }

    function severityLabel(severity) {
        if (severity === 'critical') { return '重大'; }
        if (severity === 'warning') { return '要改善'; }
        return '気づき';
    }

    /* ------------------------------------------------------- */

    $(function () {
        $('#lw-diagnose-run').on('click', run);
        load();
    });
})(jQuery);
