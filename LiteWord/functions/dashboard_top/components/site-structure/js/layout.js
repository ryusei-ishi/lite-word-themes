/**
 * LWSS.Layout — ツリー自動配置アルゴリズム＋自由配置との合成
 */
window.LWSS = window.LWSS || {};

(function () {
    'use strict';

    var Layout = {
        nodeWidth: 200,
        nodeHeight: 60,
        levelGap: 240,
        verticalGap: 80,
        centerX: 1500,
        centerY: 1000,

        // 表示中のノードから「親ID → 子ノード配列」を作る。
        // 🚨 折りたたみ（collapsed）はここでは一切考慮しない。折りたたんでも「子がいる」事実は
        //    変わらないので、開閉ボタンを出すかどうかの判定にもこの結果をそのまま使う。
        buildChildrenMap: function (store) {
            var s = store.state;
            var childrenMap = {};

            var front = store.getFrontNode();
            if (!front) return childrenMap;

            s.pages.forEach(function (page) {
                if (!store.isNodeVisible(page)) return;
                var parentId = page.parent_id || '';
                if (!page.is_front && !parentId) parentId = front.id;
                if (!childrenMap[parentId]) childrenMap[parentId] = [];
                if (page.id !== front.id) childrenMap[parentId].push(page);
            });

            s.categories.forEach(function (cat) {
                if (!store.isNodeVisible(cat)) return;
                var parentId = cat.parent_id || s.postsPageId || front.id;
                if (!childrenMap[parentId]) childrenMap[parentId] = [];
                childrenMap[parentId].push(cat);
            });

            s.posts.forEach(function (post) {
                if (!store.isNodeVisible(post)) return;
                // カテゴリー未設定の投稿も消えないよう、カテゴリーと同じく投稿ページ/トップページの子にする
                var parentId = post.parent_id || s.postsPageId || front.id;
                if (!childrenMap[parentId]) childrenMap[parentId] = [];
                childrenMap[parentId].push(post);
            });

            return childrenMap;
        },

        // 子を持つノードの一覧 { nodeId: true }。折りたたみ中でも true になる。
        // 🚨 これを「実際に描画された接続線」から求めてはいけない。折りたたむと子の接続線が
        //    消えるため、閉じた瞬間に開閉ボタンごと消えて二度と開けなくなる
        //    （2026-09-05 Ryuichi 実機報告「閉じた後、開くが出来なくなった」の原因）。
        computeHasChildren: function (store) {
            var childrenMap = this.buildChildrenMap(store);
            var hasChildren = {};

            Object.keys(childrenMap).forEach(function (parentId) {
                if (childrenMap[parentId].length) hasChildren[parentId] = true;
            });

            return hasChildren;
        },

        // トップページを中心に、フィルター・折りたたみを反映したツリー配置を計算する
        // （手動配置＝node.pos は無視する。「整った状態はどうなるか」だけを表す）
        computeTreeLayout: function (store) {
            var self = this;
            var positions = {};
            var s = store.state;

            var front = store.getFrontNode();
            if (!front) return positions;

            var childrenMap = this.buildChildrenMap(store);

            // ancestors は「ここまで辿ってきた経路」。サーバ側は循環参照を拒否しているが、既存データの
            // 壊れ・想定外の経路で親子が循環していても無限再帰でタブが固まらないよう、ここでも打ち切る。
            function heightOf(nodeId, ancestors) {
                if (s.collapsed[nodeId]) return self.verticalGap;
                if (ancestors && ancestors[nodeId]) return self.verticalGap;
                var children = childrenMap[nodeId] || [];
                if (!children.length) return self.verticalGap;
                var nextAncestors = ancestors ? Object.assign({}, ancestors) : {};
                nextAncestors[nodeId] = true;
                var total = 0;
                children.forEach(function (child) { total += heightOf(child.id, nextAncestors); });
                return total;
            }

            function place(parentId, x, y, ancestors) {
                if (s.collapsed[parentId]) return;
                if (ancestors && ancestors[parentId]) return;
                var children = childrenMap[parentId] || [];
                if (!children.length) return;
                var nextAncestors = ancestors ? Object.assign({}, ancestors) : {};
                nextAncestors[parentId] = true;

                var heights = children.map(function (c) { return heightOf(c.id, nextAncestors); });
                var total = heights.reduce(function (a, b) { return a + b; }, 0);
                var cursorY = y - total / 2;

                children.forEach(function (child, i) {
                    var cx = x + self.levelGap;
                    var cy = cursorY + heights[i] / 2;
                    positions[child.id] = { x: cx, y: cy };
                    place(child.id, cx, cy, nextAncestors);
                    cursorY += heights[i];
                });
            }

            positions[front.id] = { x: this.centerX, y: this.centerY };
            place(front.id, this.centerX, this.centerY);

            return positions;
        },

        // ツリー配置に、保存済みの自由配置（node.pos）を上書きしたものを返す
        computeEffectivePositions: function (store) {
            var tree = this.computeTreeLayout(store);
            var positions = {};

            store.state.allNodes.forEach(function (node) {
                if (!Object.prototype.hasOwnProperty.call(tree, node.id)) return;
                positions[node.id] = node.pos ? { x: node.pos.x, y: node.pos.y } : tree[node.id];
            });

            return positions;
        },

        // 現在表示されている親→子の接続一覧（ベジェ曲線描画用）
        computeConnections: function (store, positions) {
            var connections = [];
            store.state.allNodes.forEach(function (node) {
                var parentId = store.getEffectiveParentId(node);
                if (!parentId) return;
                if (!positions[parentId] || !positions[node.id]) return;

                connections.push({
                    parentId: parentId,
                    childId: node.id,
                    parentPos: positions[parentId],
                    childPos: positions[node.id],
                });
            });
            return connections;
        },
    };

    window.LWSS.Layout = Layout;
})();
