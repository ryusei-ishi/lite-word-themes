/**
 * LWSS — サイト構造ページ エントリポイント
 */
(function ($) {
    'use strict';

    $(function () {
        var $app = $('#lw-ss-app');
        if (!$app.length) return;

        var $viewport = $('#lw-ss-viewport');
        var $canvasEl = $('#lw-ss-canvas');
        var $svg = $('#lw-ss-connections');
        var $loading = $('#lw-ss-loading');
        var $panelEl = $('#lw-ss-panel');
        var $createForm = $('#lw-ss-create-form');
        var $saveGroup = $('#lw-ss-save-group');
        var $frontWarning = $('#lw-ss-front-warning');

        var store = LWSS.Store;
        var canvas = LWSS.Canvas;
        var layout = LWSS.Layout;
        var nodes = LWSS.Nodes;
        var panel = LWSS.Panel;
        var createPage = LWSS.CreatePage;

        canvas.init($viewport, $canvasEl);
        nodes.init($canvasEl, $svg, store, canvas, layout);
        panel.init($panelEl, store, nodes);
        createPage.init($viewport, $createForm, store, canvas, nodes);

        canvas.onZoomChange = function (zoom) {
            $('#lw-ss-zoom-level').text(Math.round(zoom * 100) + '%');
        };
        canvas.onBackgroundClick = function () {
            panel.close();
        };

        nodes.onSelect = function (node) { panel.open(node); };
        nodes.onPendingChange = function () { $saveGroup.addClass('is-visible'); };

        panel.onReloadNeeded = function () { reload(); };
        createPage.onCreated = function (node) {
            nodes.render();
            nodes.selectNode(node.id);
        };

        function frontCanvasPoint() {
            var front = store.getFrontNode();
            if (!front) return { x: layout.centerX, y: layout.centerY };
            return nodes.positions[front.id] || { x: layout.centerX, y: layout.centerY };
        }

        $('#lw-ss-zoom-in').on('click', function () { canvas.zoomBy(0.1); });
        $('#lw-ss-zoom-out').on('click', function () { canvas.zoomBy(-0.1); });
        $('#lw-ss-zoom-reset').on('click', function () {
            var p = frontCanvasPoint();
            canvas.reset(p.x, p.y);
        });

        // 自動整列/保存/キャンセルの間は $loading をかぶせてクリック・ドラッグを受け付けない。
        // 応答が返る前にドラッグを始められると、直後の nodes.render() がドラッグ中のDOMごと
        // 作り直してしまい、ドラッグが宙に浮いたまま終わらなくなる。
        $('#lw-ss-auto-layout').on('click', function () {
            $loading.addClass('is-visible');
            store.clearAllPositions(function (result) {
                $loading.removeClass('is-visible');
                nodes.render();
                if (result.failedCount > 0) {
                    LWSS.Notice.show('一部の整列に失敗しました（' + result.failedCount + '件）', 'error');
                } else {
                    LWSS.Notice.show('ツリー配置に整列しました', 'success');
                }
            });
        });

        $('#lw-ss-save-changes').on('click', function () {
            $loading.addClass('is-visible');
            store.saveReparents(function (data) {
                $loading.removeClass('is-visible');
                nodes.render();
                if (store.hasPendingReparent()) {
                    var messages = (data.failed || []).map(function (f) { return f.message; }).join(', ');
                    LWSS.Notice.show(data.count + '件保存・' + data.failed.length + '件失敗: ' + messages, 'error');
                } else {
                    $saveGroup.removeClass('is-visible');
                    LWSS.Notice.show('保存しました', 'success');
                }
            }, function (err) {
                $loading.removeClass('is-visible');
                LWSS.Notice.show('エラー: ' + err, 'error');
            });
        });

        $('#lw-ss-cancel-changes').on('click', function () {
            $saveGroup.removeClass('is-visible');
            $loading.addClass('is-visible');
            store.cancelReparents(function () {
                $loading.removeClass('is-visible');
                afterLoad();
                LWSS.Notice.show('変更をキャンセルしました', 'success');
            }, showLoadError);
        });

        function updateFrontWarning() {
            if (store.state.hasFrontPage) {
                $frontWarning.removeClass('is-visible');
                return;
            }
            $frontWarning.addClass('is-visible');
            var $select = $('#lw-ss-front-page-select');
            $select.find('option').slice(1).remove();
            store.state.pages.forEach(function (p) {
                var label = p.title + (p.status !== 'publish' ? '（' + p.status + '）' : '');
                $select.append($('<option></option>').attr('value', p.raw_id).text(label));
            });
        }

        $('#lw-ss-front-help').on('click', function (e) {
            e.stopPropagation();
            $(this).toggleClass('active');
        });
        $(document).on('click', function (e) {
            if (!$(e.target).closest('#lw-ss-front-help').length) {
                $('#lw-ss-front-help').removeClass('active');
            }
        });
        $('#lw-ss-btn-set-front').on('click', function () {
            var pageId = $('#lw-ss-front-page-select').val();
            if (!pageId) {
                LWSS.Notice.show('固定ページを選択してください', 'error');
                return;
            }
            $loading.addClass('is-visible');
            store.setFrontPage(pageId, function () { reload(); }, function (err) {
                $loading.removeClass('is-visible');
                LWSS.Notice.show('設定に失敗しました: ' + err, 'error');
            });
        });

        function afterLoad() {
            updateFrontWarning();
            nodes.render();
            var p = frontCanvasPoint();
            canvas.centerOn(p.x, p.y);
        }

        function showLoadError(err) {
            $loading.removeClass('is-visible');
            LWSS.Notice.show('読み込みに失敗しました: ' + err, 'error');
        }

        function reload() {
            $loading.addClass('is-visible');
            store.load(function () {
                $loading.removeClass('is-visible');
                afterLoad();
            }, showLoadError);
        }

        reload();
    });
})(jQuery);
