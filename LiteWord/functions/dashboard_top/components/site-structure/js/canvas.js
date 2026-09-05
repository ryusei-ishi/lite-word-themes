/**
 * LWSS.Canvas — 無限キャンバスのパン・ズーム管理
 *
 * ビューポート（overflow:hidden の固定領域）の中で、キャンバスに
 * translate(pan) scale(zoom) を適用する。ズームはカーソル位置を軸に行う。
 */
window.LWSS = window.LWSS || {};

(function ($) {
    'use strict';

    var Canvas = {
        pan: { x: 0, y: 0 },
        zoom: 1,
        minZoom: 0.2,
        maxZoom: 2.5,
        $viewport: null,
        $canvas: null,
        onZoomChange: null,

        init: function ($viewport, $canvas) {
            this.$viewport = $viewport;
            this.$canvas = $canvas;
            this.bindPan();
            this.bindWheel();
        },

        applyTransform: function () {
            this.$canvas.css('transform', 'translate(' + this.pan.x + 'px, ' + this.pan.y + 'px) scale(' + this.zoom + ')');
        },

        // 画面座標（clientX/Y）→ キャンバス座標
        screenToCanvas: function (clientX, clientY) {
            var rect = this.$viewport[0].getBoundingClientRect();
            return {
                x: (clientX - rect.left - this.pan.x) / this.zoom,
                y: (clientY - rect.top - this.pan.y) / this.zoom,
            };
        },

        // anchorが指定されなければビューポート中央を軸にする
        zoomBy: function (delta, anchorClientX, anchorClientY) {
            var rect = this.$viewport[0].getBoundingClientRect();
            if (anchorClientX == null) {
                anchorClientX = rect.left + rect.width / 2;
                anchorClientY = rect.top + rect.height / 2;
            }

            var newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom + delta));
            if (newZoom === this.zoom) return;

            // ズーム前のカーソル直下のキャンバス座標を求め、ズーム後も同じ座標がカーソル直下に来るようpanを補正する
            var canvasPoint = this.screenToCanvas(anchorClientX, anchorClientY);
            this.zoom = newZoom;
            this.pan.x = (anchorClientX - rect.left) - canvasPoint.x * this.zoom;
            this.pan.y = (anchorClientY - rect.top) - canvasPoint.y * this.zoom;

            this.applyTransform();
            this.onZoomChange && this.onZoomChange(this.zoom);
        },

        setZoom: function (zoom) {
            this.zoomBy(zoom - this.zoom);
        },

        // 指定したキャンバス座標をビューポート中央に置く
        centerOn: function (canvasX, canvasY) {
            var rect = this.$viewport[0].getBoundingClientRect();
            this.pan.x = rect.width / 2 - canvasX * this.zoom;
            this.pan.y = rect.height / 2 - canvasY * this.zoom;
            this.applyTransform();
        },

        reset: function (canvasX, canvasY) {
            this.zoom = 1;
            this.centerOn(canvasX, canvasY);
            this.onZoomChange && this.onZoomChange(this.zoom);
        },

        bindPan: function () {
            var self = this;
            var dragging = false;
            var startClientX, startClientY, startPanX, startPanY;
            var moved = false;

            this.$viewport.on('pointerdown', function (e) {
                if (e.button !== 0) return;
                dragging = true;
                moved = false;
                startClientX = e.clientX;
                startClientY = e.clientY;
                startPanX = self.pan.x;
                startPanY = self.pan.y;
                self.$viewport.addClass('is-panning');
                if (e.currentTarget.setPointerCapture) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                }
            });

            this.$viewport.on('pointermove', function (e) {
                if (!dragging) return;
                var dx = e.clientX - startClientX;
                var dy = e.clientY - startClientY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
                self.pan.x = startPanX + dx;
                self.pan.y = startPanY + dy;
                self.applyTransform();
            });

            $(document).on('pointerup pointercancel', function () {
                if (dragging) {
                    dragging = false;
                    self.$viewport.removeClass('is-panning');
                }
            });

            // 背景を「動かさずにクリック」した場合はノード選択解除に使えるようフラグを公開する
            this.$viewport.on('click', function (e) {
                if (e.target !== self.$viewport[0] && e.target !== self.$canvas[0]) return;
                if (moved) return;
                self.onBackgroundClick && self.onBackgroundClick(e);
            });
        },

        bindWheel: function () {
            var self = this;
            this.$viewport.on('wheel', function (e) {
                var oe = e.originalEvent;
                e.preventDefault();

                if (oe.ctrlKey || oe.metaKey) {
                    var delta = oe.deltaY > 0 ? -0.1 : 0.1;
                    self.zoomBy(delta, oe.clientX, oe.clientY);
                } else {
                    self.pan.x -= oe.deltaX;
                    self.pan.y -= oe.deltaY;
                    self.applyTransform();
                }
            });
        },
    };

    window.LWSS.Canvas = Canvas;
})(jQuery);
