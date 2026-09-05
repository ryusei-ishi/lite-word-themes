/**
 * LWSS.Nodes（操作担当）— ドラッグ（自由配置／親子付け替えの判別）・選択
 *
 * nodes-render.js が確立した LWSS.Nodes に、操作系のメソッドを追記する。
 * このファイルは nodes-render.js の後に読み込むこと。
 *
 * 🚨 jQuery UI Draggable/Droppable は使わない（他画面では使用中でも、ここでは不可）。
 * canvas.js がキャンバスに CSS scale() を掛けるため、jQuery UI 内部のスクリーン座標ベースの
 * 計算とズーム倍率がズレ、ズーム時にドラッグ量とマウス移動量が一致しなくなる。
 * pointermove の移動量を canvas.zoom で割って自前で追従させているのはそのため。
 */
window.LWSS = window.LWSS || {};

(function ($) {
    'use strict';

    // 実際のマウス/トラックパッド操作では「クリックのつもり」でも数px動く。閾値が狭いと
    // それがドラッグと誤判定され、ノードが少しだけ動いて保存され、パネルが開かなくなる
    // （2026-09-05 Ryuichi 実機報告で確認・5pxでは不十分だった）。
    var DRAG_THRESHOLD = 10;

    $.extend(window.LWSS.Nodes, {
        bindNodeEvents: function ($node, node) {
            var self = this;

            var $toggle = $node.find('.lw-ss-node-toggle');
            $toggle.on('pointerdown click', function (e) { e.stopPropagation(); });
            $toggle.on('click', function () {
                self.store.toggleCollapsed(node.id);
                self.render();
            });

            if (node.is_latest_posts) return; // 仮想ノードは選択・ドラッグ対象外

            this.bindDrag($node, node);
        },

        bindDrag: function ($node, node) {
            var self = this;
            var dragging = false;
            var moved = false;
            var startClientX, startClientY, startLeft, startTop;

            $node.on('pointerdown', function (e) {
                if (e.button !== 0) return;
                if ($(e.target).closest('.lw-ss-node-toggle').length) return;
                e.stopPropagation();

                dragging = true;
                moved = false;
                startClientX = e.clientX;
                startClientY = e.clientY;
                var pos = self.positions[node.id];
                startLeft = pos.x - self.layout.nodeWidth / 2;
                startTop = pos.y - self.layout.nodeHeight / 2;

                if (e.currentTarget.setPointerCapture) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                }
            });

            $node.on('pointermove', function (e) {
                if (!dragging) return;

                // クリックかドラッグかは「画面上で指/マウスが何px動いたか」で判定する（ズーム倍率で
                // 割る前の値）。ズーム倍率で割った後の値と比べていると、縮小表示（zoom<1）ほど
                // 同じしきい値に達する実際の画面上の移動量が小さくなり、ちょっとしたブレでも
                // ドラッグと誤判定されてクリックが効かなくなる（2026-09-05 Ryuichi 実機報告で発覚）。
                var screenDx = e.clientX - startClientX;
                var screenDy = e.clientY - startClientY;

                if (!moved && (Math.abs(screenDx) > DRAG_THRESHOLD || Math.abs(screenDy) > DRAG_THRESHOLD)) {
                    moved = true;
                    $node.addClass('is-dragging');
                }
                if (!moved) return;

                // ノードの実際の移動量（キャンバス座標）はここでズーム倍率を反映する
                var dx = screenDx / self.canvas.zoom;
                var dy = screenDy / self.canvas.zoom;

                var newLeft = startLeft + dx;
                var newTop = startTop + dy;
                $node.css({ left: newLeft + 'px', top: newTop + 'px' });

                self.positions[node.id] = { x: newLeft + self.layout.nodeWidth / 2, y: newTop + self.layout.nodeHeight / 2 };
                self.renderConnectionsOnly();
                self.updateDropTarget(e.clientX, e.clientY, node);
            });

            $node.on('pointerup pointercancel', function (e) {
                if (!dragging) return;
                dragging = false;
                $node.removeClass('is-dragging');
                self.$canvas.find('.lw-ss-node.is-drop-target').removeClass('is-drop-target');

                if (!moved) {
                    self.selectNode(node.id);
                    return;
                }

                self.store.savePosition(node.id, self.positions[node.id].x, self.positions[node.id].y, null, function (err) {
                    LWSS.Notice.show('位置の保存に失敗しました: ' + err, 'error');
                });

                var target = self.findDropTarget(e.clientX, e.clientY, node);
                if (target && target.id !== node.id && self.canDrop(node.type, target.type)) {
                    if (self.wouldCreateCycle(node.id, target.id)) {
                        LWSS.Notice.show('循環参照になるため親には設定できません', 'error');
                    } else {
                        self.store.queueReparent(node.id, node.type, target.id);
                        self.onPendingChange && self.onPendingChange();
                        LWSS.Notice.show('親を「' + target.title + '」に変更しました（未保存）', 'success');
                    }
                }
            });
        },

        updateDropTarget: function (clientX, clientY, draggedNode) {
            var self = this;
            this.$canvas.find('.lw-ss-node').each(function () {
                var id = $(this).data('node-id');
                if (id === draggedNode.id) {
                    $(this).removeClass('is-drop-target');
                    return;
                }
                var rect = this.getBoundingClientRect();
                var inside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
                var node = self.store.state.byId[id];
                var ok = inside && node && self.canDrop(draggedNode.type, node.type);
                $(this).toggleClass('is-drop-target', !!ok);
            });
        },

        findDropTarget: function (clientX, clientY, draggedNode) {
            var self = this;
            var found = null;
            this.$canvas.find('.lw-ss-node').each(function () {
                var id = $(this).data('node-id');
                if (id === draggedNode.id) return;
                var rect = this.getBoundingClientRect();
                if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                    found = self.store.state.byId[id] || null;
                }
            });
            return found;
        },

        canDrop: function (draggedType, targetType) {
            if (draggedType === 'page' && targetType === 'page') return true;
            if (draggedType === 'category' && (targetType === 'category' || targetType === 'page')) return true;
            if (draggedType === 'post' && targetType === 'category') return true;
            return false;
        },

        // ドラッグ中の付け替え候補が循環参照にならないか（サーバ側でも再チェックする）
        wouldCreateCycle: function (nodeId, newParentId) {
            var byId = this.store.state.byId;
            var currentId = newParentId;
            var visited = {};

            while (currentId) {
                if (currentId === nodeId) return true;
                if (visited[currentId]) return false;
                visited[currentId] = true;
                var parent = byId[currentId];
                currentId = parent ? parent.parent_id : null;
            }
            return false;
        },

        selectNode: function (nodeId) {
            this.store.state.selectedNodeId = nodeId;
            this.$canvas.find('.lw-ss-node').removeClass('is-selected');
            this.$canvas.find('.lw-ss-node[data-node-id="' + nodeId + '"]').addClass('is-selected');
            var node = this.store.state.byId[nodeId];
            this.onSelect && node && this.onSelect(node);
        },

        deselect: function () {
            this.store.state.selectedNodeId = null;
            this.$canvas.find('.lw-ss-node').removeClass('is-selected');
        },
    });
})(jQuery);
