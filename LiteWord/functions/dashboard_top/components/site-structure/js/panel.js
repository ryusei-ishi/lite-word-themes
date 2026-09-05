/**
 * LWSS.Panel — 選択中ノードを編集する右サイドパネル
 */
window.LWSS = window.LWSS || {};

(function ($) {
    'use strict';

    var Panel = {
        store: null,
        nodes: null,
        $panel: null,
        $body: null,
        currentNode: null,
        onReloadNeeded: null,

        init: function ($panel, store, nodes) {
            this.$panel = $panel;
            this.$body = $panel.find('#lw-ss-panel-body');
            this.store = store;
            this.nodes = nodes;

            var self = this;
            $panel.find('#lw-ss-panel-close').on('click', function () { self.close(); });
        },

        open: function (node) {
            this.currentNode = node;

            var statuses = [
                { value: 'publish', label: '公開' },
                { value: 'draft', label: '下書き' },
                { value: 'private', label: '非公開' },
                { value: 'pending', label: '承認待ち' },
            ];
            var statusOptions = statuses.map(function (s) {
                return '<option value="' + s.value + '"' + (node.status === s.value ? ' selected' : '') + '>' + s.label + '</option>';
            }).join('');

            var setFrontBtn = '';
            if (node.type === 'page' && !node.is_front) {
                setFrontBtn = '<button type="button" class="lw-ss-btn" id="lw-ss-panel-set-front">トップページに設定</button>';
            }

            var openEditBtn = node.edit_url
                ? '<a href="' + node.edit_url + '" target="_blank" class="lw-ss-btn" id="lw-ss-panel-open-edit">編集ページを開く</a>'
                : '';

            this.$body.html(
                '<div class="lw-ss-panel-field">' +
                    '<label>タイトル</label>' +
                    '<input type="text" id="lw-ss-panel-title" value="' + this.escapeAttr(node.title) + '">' +
                '</div>' +
                '<div class="lw-ss-panel-field">' +
                    '<label>スラッグ</label>' +
                    '<input type="text" id="lw-ss-panel-slug" value="' + this.escapeAttr(node.slug) + '">' +
                '</div>' +
                '<div class="lw-ss-panel-field">' +
                    '<label>ステータス</label>' +
                    '<select id="lw-ss-panel-status">' + statusOptions + '</select>' +
                '</div>' +
                '<div class="lw-ss-panel-actions">' +
                    '<button type="button" class="lw-ss-btn lw-ss-btn-primary" id="lw-ss-panel-save">保存</button>' +
                    openEditBtn +
                    setFrontBtn +
                '</div>'
            );

            this.bindActions(node);
            this.$panel.addClass('is-open');
        },

        close: function () {
            this.$panel.removeClass('is-open');
            this.currentNode = null;
            this.nodes.deselect();
        },

        bindActions: function (node) {
            var self = this;

            this.$body.find('#lw-ss-panel-save').on('click', function () {
                var title = self.$body.find('#lw-ss-panel-title').val();
                var slug = self.$body.find('#lw-ss-panel-slug').val();
                var status = self.$body.find('#lw-ss-panel-status').val();

                self.store.updateNodeDetails(node, title, slug, status, function () {
                    self.updateNodeInPlace(node);
                    LWSS.Notice.show('保存しました', 'success');
                }, function (err) {
                    LWSS.Notice.show('エラー: ' + err, 'error');
                });
            });

            this.$body.find('#lw-ss-panel-set-front').on('click', function () {
                if (!confirm('「' + node.title + '」をトップページに設定しますか？')) return;

                self.store.setFrontPage(node.raw_id, function () {
                    self.close();
                    self.onReloadNeeded && self.onReloadNeeded();
                }, function (err) {
                    LWSS.Notice.show('設定に失敗しました: ' + err, 'error');
                });
            });
        },

        updateNodeInPlace: function (node) {
            var $node = this.nodes.$canvas.find('.lw-ss-node[data-node-id="' + node.id + '"]');
            $node.find('.lw-ss-node-title').text(node.title);
            var $slug = $node.find('.lw-ss-node-slug');
            if (node.slug) $slug.text('/' + node.slug);
            $node.find('.lw-ss-node-status').text(this.nodes.getStatusLabel(node.status));
            $node.removeClass('status-publish status-draft status-private status-pending').addClass('status-' + node.status);
        },

        escapeAttr: function (text) {
            return String(text == null ? '' : text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        },
    };

    window.LWSS.Panel = Panel;
})(jQuery);
