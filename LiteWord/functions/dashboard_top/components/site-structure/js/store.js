/**
 * LWSS.Store — サイト構造ページの状態管理・サーバ通信
 */
window.LWSS = window.LWSS || {};

(function ($) {
    'use strict';

    var Store = {
        state: {
            pages: [],
            categories: [],
            posts: [],
            allNodes: [],
            byId: {},
            frontPageId: '',
            postsPageId: '',
            hasFrontPage: false,
            filters: { page: true, post: true, draft: true },
            collapsed: {},
            pendingReparent: [],
            selectedNodeId: null,
        },

        ajax: function (action, data, onSuccess, onError) {
            $.ajax({
                url: lwSiteStructure.ajaxUrl,
                type: 'POST',
                data: $.extend({ action: action, nonce: lwSiteStructure.nonce }, data || {}),
                success: function (response) {
                    if (response && response.success) {
                        onSuccess && onSuccess(response.data);
                    } else {
                        onError && onError((response && response.data) || '不明なエラーが発生しました');
                    }
                },
                error: function () {
                    onError && onError('通信エラーが発生しました');
                },
            });
        },

        // サーバから全データを取得し、内部状態を作り直す
        load: function (onReady, onError) {
            var self = this;
            this.ajax('lw_get_site_structure', {}, function (data) {
                self.state.pages = data.pages;
                self.state.categories = data.categories;
                self.state.posts = data.posts;
                self.state.frontPageId = data.front_page_id;
                self.state.postsPageId = data.posts_page_id;
                self.state.hasFrontPage = data.has_front_page;
                self.state.pendingReparent = [];
                self.rebuildIndex();
                onReady && onReady();
            }, onError);
        },

        rebuildIndex: function () {
            var s = this.state;
            s.allNodes = [].concat(s.pages, s.categories, s.posts);

            if (!s.hasFrontPage) {
                s.allNodes.unshift({
                    id: 'virtual-latest-posts',
                    raw_id: 0,
                    title: '最新投稿',
                    slug: '',
                    status: 'publish',
                    parent_id: '',
                    type: 'virtual',
                    edit_url: '',
                    is_front: false,
                    is_latest_posts: true,
                    pos: null,
                });
            }

            s.byId = {};
            s.allNodes.forEach(function (node) {
                s.byId[node.id] = node;
            });
        },

        getFrontNode: function () {
            var s = this.state;
            return s.allNodes.find(function (n) { return n.is_front || n.is_latest_posts; }) || null;
        },

        // 親子付け替え後の「実効的な親」（フロントページ/投稿ページへの暗黙の子付けを含む）
        getEffectiveParentId: function (node) {
            var front = this.state.pages.find(function (p) { return p.is_front; });
            if (!front || node.is_front) return null;

            if (node.type === 'page') {
                return node.parent_id || front.id;
            }
            if (node.type === 'category') {
                return node.parent_id || this.state.postsPageId || front.id;
            }
            if (node.type === 'post') {
                return node.parent_id || this.state.postsPageId || front.id;
            }
            return null;
        },

        isNodeVisible: function (node) {
            if (node.is_front || node.is_latest_posts) return true;

            var f = this.state.filters;
            if (node.status === 'draft' && !f.draft) return false;
            if (node.type === 'page' && !f.page) return false;
            if ((node.type === 'post' || node.type === 'category') && !f.post) return false;

            return true;
        },

        toggleCollapsed: function (nodeId) {
            if (this.state.collapsed[nodeId]) {
                delete this.state.collapsed[nodeId];
            } else {
                this.state.collapsed[nodeId] = true;
            }
        },

        // node.pos の書き換えは確定成功後にだけ行う（失敗時にサーバの実値とズレたまま残さない）
        savePosition: function (nodeId, x, y, onSuccess, onError) {
            var self = this;
            this.ajax('lw_save_node_position', { node_id: nodeId, x: x, y: y }, function (data) {
                var node = self.state.byId[nodeId];
                if (node) node.pos = { x: x, y: y };
                onSuccess && onSuccess(data);
            }, onError);
        },

        clearPosition: function (nodeId, onSuccess, onError) {
            var self = this;
            this.ajax('lw_save_node_position', { node_id: nodeId, clear: 1 }, function (data) {
                var node = self.state.byId[nodeId];
                if (node) node.pos = null;
                onSuccess && onSuccess(data);
            }, onError);
        },

        // 全件の完了（成功/失敗どちらでも）を待ってから一度だけ onDone を呼ぶ。失敗件数を渡すので
        // 呼び出し側で「N件は整列できませんでした」のような案内を出せる。
        clearAllPositions: function (onDone) {
            var self = this;
            var ids = Object.keys(this.state.byId).filter(function (id) {
                return self.state.byId[id].pos;
            });

            if (!ids.length) {
                onDone && onDone({ total: 0, failedCount: 0 });
                return;
            }

            var remaining = ids.length;
            var failedCount = 0;

            function settle() {
                remaining--;
                if (remaining === 0) {
                    onDone && onDone({ total: ids.length, failedCount: failedCount });
                }
            }

            ids.forEach(function (id) {
                self.clearPosition(id, settle, function () {
                    failedCount++;
                    settle();
                });
            });
        },

        queueReparent: function (nodeId, nodeType, newParentId) {
            var node = this.state.byId[nodeId];
            if (!node) return;
            node.parent_id = newParentId;
            // 同じノードを保存前に何度もドロップし直した場合、直近の1件だけを残す
            this.state.pendingReparent = this.state.pendingReparent.filter(function (c) {
                return c.nodeId !== nodeId;
            });
            this.state.pendingReparent.push({ nodeId: nodeId, nodeType: nodeType, newParentId: newParentId });
        },

        hasPendingReparent: function () {
            return this.state.pendingReparent.length > 0;
        },

        // 一部だけ失敗しても、成功した分は pendingReparent から確実に外す
        // （failed に残った分だけを「未保存」として残し、次の保存/キャンセルの対象にする）。
        saveReparents: function (onSuccess, onError) {
            var self = this;
            this.ajax('lw_save_structure_changes', { changes: JSON.stringify(this.state.pendingReparent) }, function (data) {
                var succeeded = {};
                (data.succeeded_ids || []).forEach(function (id) { succeeded[id] = true; });
                self.state.pendingReparent = self.state.pendingReparent.filter(function (c) {
                    return !succeeded[c.nodeId];
                });
                onSuccess && onSuccess(data);
            }, onError);
        },

        cancelReparents: function (onReloaded, onError) {
            this.state.pendingReparent = [];
            this.load(onReloaded, onError);
        },

        updateNodeDetails: function (node, title, slug, status, onSuccess, onError) {
            this.ajax('lw_update_node_details', {
                node_id: node.id,
                node_type: node.type,
                title: title,
                slug: slug,
                status: status,
            }, function (data) {
                node.title = title;
                node.slug = slug;
                node.status = status;
                onSuccess && onSuccess(data);
            }, onError);
        },

        setFrontPage: function (pageId, onSuccess, onError) {
            this.ajax('lw_set_front_page', { page_id: pageId }, onSuccess, onError);
        },

        createPage: function (title, parentId, x, y, onSuccess, onError) {
            var self = this;
            this.ajax('lw_create_page_from_map', {
                title: title,
                parent_id: parentId || '',
                x: x,
                y: y,
            }, function (data) {
                self.state.pages.push(data.node);
                self.rebuildIndex();
                onSuccess && onSuccess(data.node);
            }, onError);
        },
    };

    window.LWSS.Store = Store;

    // 画面右上に流れる小さな通知（複数モジュール共通）
    window.LWSS.Notice = {
        // message は必ずテキストとして挿入する（HTML文字列として解釈させない）。
        // node.title 等の実データを渡す呼び出し元があるため、ここがXSSの最終防波堤になる。
        show: function (message, type) {
            var $notice = $('<div>').addClass('lw-ss-notice lw-ss-notice-' + type).text(message);
            $('.lw-ss-toolbar').append($notice);
            setTimeout(function () {
                $notice.addClass('is-leaving');
                setTimeout(function () { $notice.remove(); }, 300);
            }, 2200);
        },
    };
})(jQuery);
