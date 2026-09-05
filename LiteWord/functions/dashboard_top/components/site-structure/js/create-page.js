/**
 * LWSS.CreatePage — 空いた場所を右クリックして、その場に新規固定ページを作成する
 */
window.LWSS = window.LWSS || {};

(function ($) {
    'use strict';

    var CreatePage = {
        store: null,
        canvas: null,
        nodes: null,
        $viewport: null,
        $form: null,
        pendingCanvasPoint: null,
        onCreated: null,

        init: function ($viewport, $form, store, canvas, nodes) {
            this.$viewport = $viewport;
            this.$form = $form;
            this.store = store;
            this.canvas = canvas;
            this.nodes = nodes;

            var self = this;

            $viewport.on('contextmenu', function (e) {
                if ($(e.target).closest('.lw-ss-node').length) return; // ノード上は対象外
                e.preventDefault();
                self.openAt(e.clientX, e.clientY, e.pageX, e.pageY);
            });

            $form.find('#lw-ss-create-cancel').on('click', function () { self.close(); });
            $form.find('#lw-ss-create-submit').on('click', function () { self.submit(); });
            $form.find('#lw-ss-create-title').on('keydown', function (e) {
                if (e.key === 'Enter') self.submit();
                if (e.key === 'Escape') self.close();
            });

            $(document).on('click', function (e) {
                if (!self.$form.hasClass('is-open')) return;
                if ($(e.target).closest('#lw-ss-create-form').length) return;
                self.close();
            });
        },

        openAt: function (clientX, clientY, pageX, pageY) {
            this.pendingCanvasPoint = this.canvas.screenToCanvas(clientX, clientY);
            this.populateParentSelect();

            var $formEl = this.$form;
            $formEl.css({ left: pageX + 'px', top: pageY + 'px' }).addClass('is-open');

            // 画面外にはみ出さないよう補正
            var rect = $formEl[0].getBoundingClientRect();
            var overflowX = rect.right - $(window).width();
            var overflowY = rect.bottom - $(window).height();
            if (overflowX > 0) $formEl.css('left', (pageX - overflowX - 16) + 'px');
            if (overflowY > 0) $formEl.css('top', (pageY - overflowY - 16) + 'px');

            $formEl.find('#lw-ss-create-title').val('').trigger('focus');
        },

        close: function () {
            this.$form.removeClass('is-open');
            this.pendingCanvasPoint = null;
        },

        populateParentSelect: function () {
            var $select = this.$form.find('#lw-ss-create-parent');
            $select.empty();
            $select.append('<option value="">（親を付けない＝トップ直下）</option>');

            var nearestId = this.findNearestPageId();

            this.store.state.pages.forEach(function (page) {
                var label = page.title + (page.status !== 'publish' ? '（' + page.status + '）' : '');
                var $opt = $('<option></option>').attr('value', page.id).text(label);
                if (page.id === nearestId) $opt.attr('selected', 'selected');
                $select.append($opt);
            });
        },

        // 右クリックした場所に一番近い「固定ページ」ノードを既定の親候補にする
        findNearestPageId: function () {
            if (!this.pendingCanvasPoint) return '';
            var point = this.pendingCanvasPoint;
            var positions = this.nodes.positions;
            var byId = this.store.state.byId;

            var nearestId = '';
            var nearestDist = Infinity;

            Object.keys(positions).forEach(function (id) {
                var node = byId[id];
                if (!node || node.type !== 'page') return;
                var pos = positions[id];
                var dist = Math.hypot(pos.x - point.x, pos.y - point.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestId = id;
                }
            });

            return nearestId;
        },

        submit: function () {
            var self = this;
            var title = this.$form.find('#lw-ss-create-title').val().trim();
            if (!title) {
                LWSS.Notice.show('タイトルを入力してください', 'error');
                return;
            }

            var parentId = this.$form.find('#lw-ss-create-parent').val();
            var point = this.pendingCanvasPoint || { x: 0, y: 0 };

            this.store.createPage(title, parentId, point.x, point.y, function (node) {
                self.close();
                self.onCreated && self.onCreated(node);
                LWSS.Notice.show('「' + node.title + '」を下書きページとして作成しました', 'success');
            }, function (err) {
                LWSS.Notice.show('作成に失敗しました: ' + err, 'error');
            });
        },
    };

    window.LWSS.CreatePage = CreatePage;
})(jQuery);
