/**
 * LWSS.Nodes（描画担当）— ノードHTML・曲線接続の描画
 *
 * ドラッグ・選択・親子付け替え判定は nodes-drag.js が同じ LWSS.Nodes オブジェクトに追記する
 * （このファイルが先に読み込まれ、LWSS.Nodes を確立する）。
 */
window.LWSS = window.LWSS || {};

(function ($) {
    'use strict';

    var Nodes = {
        store: null,
        canvas: null,
        layout: null,
        $canvas: null,
        $svg: null,
        positions: {},
        onSelect: null,
        onPendingChange: null,

        init: function ($canvasEl, $svgEl, store, canvas, layout) {
            this.$canvas = $canvasEl;
            this.$svg = $svgEl;
            this.store = store;
            this.canvas = canvas;
            this.layout = layout;
            this.bindFilters();
        },

        render: function () {
            this.positions = this.layout.computeEffectivePositions(this.store);
            this.renderNodesHtml();
            this.renderConnectionsOnly();
        },

        renderNodesHtml: function () {
            var self = this;
            this.$canvas.find('.lw-ss-node').remove();

            // 「子を持つか」は構造から求める（接続線から数えない）。折りたたむと子の接続線が消えるため、
            // 接続線を根拠にすると閉じた瞬間に開閉ボタンが消えて開き直せなくなる。
            var hasChildren = this.layout.computeHasChildren(this.store);

            this.store.state.allNodes.forEach(function (node) {
                var pos = self.positions[node.id];
                if (!pos) return;

                var $node = $(self.buildNodeHtml(node, pos, hasChildren[node.id]));
                self.$canvas.append($node);
                self.bindNodeEvents($node, node);
            });
        },

        buildNodeHtml: function (node, pos, hasChildrenFlag) {
            var typeClass = 'type-' + node.type;
            // node.status はサーバ側ではWPのpost_status文字列をそのまま返す。既知の4値以外は
            // class名に混ぜない（属性へのHTML/属性値インジェクションの入り口を作らない）。
            var KNOWN_STATUSES = ['publish', 'draft', 'private', 'pending'];
            var statusClass = 'status-' + (KNOWN_STATUSES.indexOf(node.status) !== -1 ? node.status : 'unknown');
            var frontClass = node.is_front ? ' is-front' : '';
            var postsPageClass = node.is_posts_page ? ' is-posts-page' : '';
            var virtualClass = node.is_latest_posts ? ' is-latest-posts' : '';
            var selectedClass = this.store.state.selectedNodeId === node.id ? ' is-selected' : '';

            var badge = '';
            if (node.is_latest_posts) {
                badge = '<span class="lw-ss-badge lw-ss-badge-latest">HOME</span>';
            } else if (node.is_front) {
                badge = '<span class="lw-ss-badge lw-ss-badge-top">TOP</span>';
            } else if (node.is_posts_page) {
                badge = '<span class="lw-ss-badge lw-ss-badge-posts">BLOG</span>';
            } else if (node.type === 'category') {
                badge = '<span class="lw-ss-badge lw-ss-badge-category">カテゴリ</span>';
            } else if (node.type === 'post') {
                badge = '<span class="lw-ss-badge lw-ss-badge-post">投稿</span>';
            }

            var toggleBtn = '';
            if (hasChildrenFlag) {
                var isCollapsed = this.store.state.collapsed[node.id];
                var iconClass = isCollapsed ? 'dashicons-arrow-right-alt2' : 'dashicons-arrow-down-alt2';
                toggleBtn = '<button type="button" class="lw-ss-node-toggle' + (isCollapsed ? ' is-collapsed' : '') + '" title="開閉">' +
                    '<span class="dashicons ' + iconClass + '"></span>' +
                '</button>';
            }

            var extraInfo = '';
            if (node.type === 'category' && node.post_count !== undefined) {
                extraInfo = '<span class="lw-ss-node-count">' + node.post_count + '件</span>';
            }

            return '<div class="lw-ss-node ' + typeClass + ' ' + statusClass + frontClass + postsPageClass + virtualClass + selectedClass + '" ' +
                'data-node-id="' + node.id + '" ' +
                'style="left:' + (pos.x - this.layout.nodeWidth / 2) + 'px; top:' + (pos.y - this.layout.nodeHeight / 2) + 'px;">' +
                badge +
                '<div class="lw-ss-node-inner">' +
                    '<span class="lw-ss-node-title">' + this.escapeHtml(node.title) + '</span>' +
                    (node.slug ? '<span class="lw-ss-node-slug">/' + this.escapeHtml(node.slug) + '</span>' : '') +
                    '<span class="lw-ss-node-status">' + this.getStatusLabel(node.status) + '</span>' +
                    extraInfo +
                '</div>' +
                toggleBtn +
            '</div>';
        },

        renderConnectionsOnly: function () {
            var self = this;
            var connections = this.layout.computeConnections(this.store, this.positions);
            var html = connections.map(function (c) {
                return '<path class="lw-ss-connection line-' + (self.store.state.byId[c.childId] || {}).type + '" d="' + self.pathFor(c.parentPos, c.childPos) + '" />';
            }).join('');
            this.$svg.html(html);
        },

        pathFor: function (parentPos, childPos) {
            var x1 = parentPos.x + this.layout.nodeWidth / 2;
            var y1 = parentPos.y;
            var x2 = childPos.x - this.layout.nodeWidth / 2;
            var y2 = childPos.y;
            var bend = Math.max(Math.abs(x2 - x1) * 0.5, 40);

            return 'M ' + x1 + ',' + y1 +
                ' C ' + (x1 + bend) + ',' + y1 + ' ' + (x2 - bend) + ',' + y2 + ' ' + x2 + ',' + y2;
        },

        bindFilters: function () {
            var self = this;
            $('.lw-ss-filter-btn').on('click', function () {
                var filterType = $(this).data('filter');
                $(this).toggleClass('active');
                self.store.state.filters[filterType] = $(this).hasClass('active');
                self.render();
            });
        },

        getStatusLabel: function (status) {
            // 未知の値をそのまま表示しない（サーバ側の想定外データがそのままDOMへ流れる経路を断つ）。
            var labels = { publish: '公開', draft: '下書き', private: '非公開', pending: '承認待ち' };
            return labels[status] || '不明';
        },

        escapeHtml: function (text) {
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },
    };

    window.LWSS.Nodes = Nodes;
})(jQuery);
