/**
 * LiteWord サイト構造 マインドマップ
 *
 * 固定ページ、カテゴリー、投稿をマインドマップ形式で表示
 * - トップページを中心に配置
 * - 固定ページは右に展開
 * - カテゴリー・投稿は投稿ページから展開
 */

(function($) {
    'use strict';

    var SiteMindMap = {
        // データ
        allNodes: [],
        pagesData: [],
        categoriesData: [],
        postsData: [],
        frontPageId: '',
        postsPageId: '',

        // 設定
        nodeWidth: 200,
        nodeHeight: 60,
        levelGap: 240,
        isLoaded: false,
        positions: {},
        centerX: 1500,
        centerY: 1000,
        zoomLevel: 1,
        minZoom: 0.3,
        maxZoom: 2,
        collapsedNodes: {},
        filters: {
            page: true,
            post: true,
            draft: true
        },
        // 変更追跡
        pendingChanges: [],
        hasChanges: false,

        init: function() {
            this.$trigger = $('#lw-page-tree-trigger');
            this.$modal = $('#lw-page-tree-modal');
            this.$container = $('#lw-mindmap-container');

            if (!this.$modal.length) {
                return;
            }

            this.bindModalEvents();
        },

        bindModalEvents: function() {
            var self = this;

            this.$trigger.on('click', function() {
                self.openModal();
            });

            $('#lw-modal-close').on('click', function() {
                self.closeModal();
            });

            this.$modal.on('click', function(e) {
                if ($(e.target).is('.lw-modal-overlay')) {
                    self.closeModal();
                }
            });

            $(document).on('keydown', function(e) {
                if (e.key === 'Escape' && self.$modal.hasClass('active')) {
                    self.closeModal();
                }
            });

            // ズームコントロール
            $(document).on('click', '#lw-zoom-in', function() {
                self.zoom(0.1);
            });
            $(document).on('click', '#lw-zoom-out', function() {
                self.zoom(-0.1);
            });
            $(document).on('click', '#lw-zoom-reset', function() {
                self.zoomLevel = 1;
                self.applyZoom();
                self.scrollToCenter();
            });

            // マウスホイールでズーム
            $(document).on('wheel', '#lw-mindmap-container', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    var delta = e.originalEvent.deltaY > 0 ? -0.1 : 0.1;
                    self.zoom(delta);
                }
            });

            // フィルターボタン
            $(document).on('click', '.lw-filter-btn', function() {
                var filterType = $(this).data('filter');
                $(this).toggleClass('active');
                self.filters[filterType] = $(this).hasClass('active');
                self.applyFilters();
            });

            // トップページ設定ボタン（警告バナー内）
            $(document).on('click', '#lw-btn-set-front', function() {
                self.setFrontPageFromBanner();
            });

            // ヘルプアイコンのトグル
            $(document).on('click', '#lw-front-page-help', function(e) {
                e.stopPropagation();
                $(this).toggleClass('active');
            });

            // ツールチップ外クリックで閉じる
            $(document).on('click', function(e) {
                if (!$(e.target).closest('#lw-front-page-help').length) {
                    $('#lw-front-page-help').removeClass('active');
                }
            });
        },

        openModal: function() {
            var self = this;
            this.$modal.addClass('active');
            $('body').css('overflow', 'hidden');

            if (!this.isLoaded) {
                this.loadSiteStructure();
            } else {
                setTimeout(function() {
                    self.scrollToCenter();
                }, 100);
            }
        },

        closeModal: function() {
            this.$modal.removeClass('active');
            $('body').css('overflow', '');
        },

        loadSiteStructure: function() {
            var self = this;

            $.ajax({
                url: lwPageTree.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_get_site_structure',
                    nonce: lwPageTree.nonce
                },
                success: function(response) {
                    if (response.success) {
                        self.pagesData = response.data.pages;
                        self.categoriesData = response.data.categories;
                        self.postsData = response.data.posts;
                        self.frontPageId = response.data.front_page_id;
                        self.postsPageId = response.data.posts_page_id;
                        self.hasFrontPage = response.data.has_front_page;

                        // 全ノードを統合
                        self.allNodes = [].concat(
                            self.pagesData,
                            self.categoriesData,
                            self.postsData
                        );

                        // トップページ未設定の場合、「最新投稿」仮想ノードを追加
                        if (!self.hasFrontPage) {
                            self.latestPostsNode = {
                                id: 'virtual-latest-posts',
                                raw_id: 0,
                                title: '最新投稿',
                                slug: '',
                                status: 'publish',
                                parent_id: '',
                                type: 'virtual',
                                edit_url: '',
                                is_front: false,
                                is_virtual: true,
                                is_latest_posts: true
                            };
                            self.allNodes.unshift(self.latestPostsNode);
                        }

                        // トップページ未設定の警告を表示/非表示
                        if (self.hasFrontPage) {
                            $('#lw-front-page-warning').hide();
                        } else {
                            $('#lw-front-page-warning').show();
                        }

                        self.isLoaded = true;
                        self.renderMindMap();

                        // renderMindMap後にドロップダウンを作成
                        if (!self.hasFrontPage) {
                            setTimeout(function() {
                                self.populateFrontPageSelect();
                            }, 100);
                        }
                    } else {
                        self.showError('データの取得に失敗しました');
                    }
                },
                error: function() {
                    self.showError('通信エラーが発生しました');
                }
            });
        },

        renderMindMap: function() {
            var self = this;

            this.$container.html('<div class="lw-mindmap-canvas" id="lw-mindmap-canvas"><svg class="lw-mindmap-svg" id="lw-mindmap-svg"></svg></div>');

            var $canvas = $('#lw-mindmap-canvas');
            var $svg = $('#lw-mindmap-svg');

            if (this.allNodes.length === 0) {
                $canvas.html('<div class="lw-mindmap-empty">コンテンツがありません</div>');
                return;
            }

            // 位置を計算
            this.positions = this.calculateAllPositions();

            // キャンバスサイズ調整
            this.adjustCanvasSize($canvas, this.positions);

            // ノード描画
            this.renderNodes($canvas, this.positions);

            // 線を描画
            this.drawConnections($svg, this.positions);

            // ドラッグ設定
            this.initDraggable();

            // 中央にスクロール
            setTimeout(function() {
                self.scrollToCenter();
            }, 100);
        },

        /**
         * 全ノードの位置を計算
         * 構造: TOP → 固定ページ（階層）
         *            → 投稿ページ → カテゴリー（階層） → 投稿
         */
        calculateAllPositions: function() {
            var self = this;
            var positions = {};
            var verticalGap = 80;

            // ノードをIDでマップ化
            var nodeMap = {};
            this.allNodes.forEach(function(node) {
                nodeMap[node.id] = node;
            });

            // フロントページを見つける（または「最新投稿」仮想ノード）
            var frontPage = null;
            this.allNodes.forEach(function(node) {
                if (node.is_front || node.is_latest_posts) {
                    frontPage = node;
                }
            });

            if (!frontPage) {
                return positions;
            }

            // 親子関係のツリーを構築（フィルター済みノードのみ）
            var childrenMap = {};

            // 固定ページの親子関係
            this.pagesData.forEach(function(page) {
                // フィルターで非表示のノードはスキップ
                if (!self.isNodeVisible(page)) return;

                var parentId = page.parent_id || '';
                // フロントページ以外で親がないものはフロントページの子
                if (!page.is_front && !parentId) {
                    parentId = frontPage.id;
                }
                if (!childrenMap[parentId]) {
                    childrenMap[parentId] = [];
                }
                if (page.id !== frontPage.id) {
                    childrenMap[parentId].push(page);
                }
            });

            // カテゴリーの親子関係（投稿ページの下、または親カテゴリーの下）
            this.categoriesData.forEach(function(cat) {
                // フィルターで非表示のノードはスキップ
                if (!self.isNodeVisible(cat)) return;

                var parentId = cat.parent_id || '';
                // 親カテゴリーがない場合は投稿ページの子、投稿ページがなければフロントページの子
                if (!parentId) {
                    parentId = self.postsPageId || frontPage.id;
                }
                if (!childrenMap[parentId]) {
                    childrenMap[parentId] = [];
                }
                childrenMap[parentId].push(cat);
            });

            // 投稿の親子関係（カテゴリーの下）
            this.postsData.forEach(function(post) {
                // フィルターで非表示のノードはスキップ
                if (!self.isNodeVisible(post)) return;

                var parentId = post.parent_id || '';
                if (parentId && childrenMap[parentId] !== undefined) {
                    // 親カテゴリーがある場合
                } else if (parentId) {
                    childrenMap[parentId] = [];
                }
                if (parentId) {
                    childrenMap[parentId].push(post);
                }
            });

            // 各ノードが必要とする高さを再帰的に計算
            function calculateHeight(nodeId) {
                if (self.collapsedNodes[nodeId]) {
                    return verticalGap;
                }

                var children = childrenMap[nodeId] || [];
                if (children.length === 0) {
                    return verticalGap;
                }
                var totalHeight = 0;
                children.forEach(function(child) {
                    totalHeight += calculateHeight(child.id);
                });
                return totalHeight;
            }

            // 再帰的に位置を設定
            function positionChildren(parentId, startX, startY, availableHeight) {
                if (self.collapsedNodes[parentId]) {
                    return;
                }

                var children = childrenMap[parentId] || [];
                if (children.length === 0) return;

                var childHeights = [];
                var totalNeededHeight = 0;
                children.forEach(function(child) {
                    var h = calculateHeight(child.id);
                    childHeights.push(h);
                    totalNeededHeight += h;
                });

                var currentY = startY - totalNeededHeight / 2;

                children.forEach(function(child, index) {
                    var x = startX + self.levelGap;
                    var y = currentY + childHeights[index] / 2;
                    positions[child.id] = { x: x, y: y };

                    positionChildren(child.id, x, y, childHeights[index]);

                    currentY += childHeights[index];
                });
            }

            // フロントページを中心に配置
            positions[frontPage.id] = { x: this.centerX, y: this.centerY };

            // フロントページの子から再帰的に配置
            positionChildren(frontPage.id, this.centerX, this.centerY, 0);

            return positions;
        },

        scrollToCenter: function() {
            var containerWidth = this.$container.width();
            var containerHeight = this.$container.height();

            var scrollX = this.centerX - (containerWidth / 2);
            var scrollY = this.centerY - (containerHeight / 2);

            this.$container.scrollLeft(scrollX);
            this.$container.scrollTop(scrollY);
        },

        renderNodes: function($canvas, positions) {
            var self = this;

            // 子を持つノードのIDを収集
            var hasChildren = {};
            this.allNodes.forEach(function(node) {
                var parentId = node.parent_id || '';
                if (parentId) {
                    hasChildren[parentId] = true;
                }
            });

            // フロントページ以外で親がない固定ページはフロントページの子
            var frontPage = this.pagesData.find(function(p) { return p.is_front; });
            if (frontPage) {
                this.pagesData.forEach(function(page) {
                    if (!page.is_front && !page.parent_id) {
                        hasChildren[frontPage.id] = true;
                    }
                });
                // 親カテゴリーがないカテゴリーは投稿ページまたはフロントページの子
                var postsPageParent = self.postsPageId || frontPage.id;
                this.categoriesData.forEach(function(cat) {
                    if (!cat.parent_id) {
                        hasChildren[postsPageParent] = true;
                    }
                });
            }

            this.allNodes.forEach(function(node) {
                var pos = positions[node.id];
                if (!pos) return;

                var typeClass = 'type-' + node.type;
                var statusClass = 'status-' + node.status;
                var frontClass = node.is_front ? ' is-front' : '';
                var postsPageClass = node.is_posts_page ? ' is-posts-page' : '';
                var virtualClass = node.is_latest_posts ? ' is-latest-posts' : '';
                var statusLabel = self.getStatusLabel(node.status);

                // バッジ
                var badge = '';
                if (node.is_latest_posts) {
                    badge = '<span class="lw-node-badge lw-badge-latest">HOME</span>';
                } else if (node.is_front) {
                    badge = '<span class="lw-node-badge lw-badge-top">TOP</span>';
                } else if (node.is_posts_page) {
                    badge = '<span class="lw-node-badge lw-badge-posts">BLOG</span>';
                } else if (node.type === 'category') {
                    badge = '<span class="lw-node-badge lw-badge-category">カテゴリ</span>';
                } else if (node.type === 'post') {
                    badge = '<span class="lw-node-badge lw-badge-post">投稿</span>';
                }

                // 開閉ボタン
                var toggleBtn = '';
                if (hasChildren[node.id]) {
                    var isCollapsed = self.collapsedNodes[node.id];
                    var iconClass = isCollapsed ? 'dashicons-arrow-right-alt2' : 'dashicons-arrow-down-alt2';
                    var collapsedClass = isCollapsed ? ' collapsed' : '';
                    toggleBtn = '<button type="button" class="lw-node-toggle' + collapsedClass + '" data-node-id="' + node.id + '" title="開閉">' +
                        '<span class="dashicons ' + iconClass + '"></span>' +
                    '</button>';
                }

                // 追加情報
                var extraInfo = '';
                if (node.type === 'category' && node.post_count !== undefined) {
                    extraInfo = '<span class="lw-node-count">' + node.post_count + '件</span>';
                }

                var nodeHtml = '<div class="lw-mindmap-node ' + typeClass + ' ' + statusClass + frontClass + postsPageClass + virtualClass + '" ' +
                    'id="node-' + node.id + '" ' +
                    'data-node-id="' + node.id + '" ' +
                    'data-node-type="' + node.type + '" ' +
                    'data-parent-id="' + (node.parent_id || '') + '" ' +
                    'data-edit-url="' + (node.edit_url || '') + '" ' +
                    'style="left: ' + (pos.x - self.nodeWidth / 2) + 'px; top: ' + (pos.y - self.nodeHeight / 2) + 'px;">' +
                    badge +
                    '<div class="lw-node-inner">' +
                        '<span class="lw-node-title">' + self.escapeHtml(node.title) + '</span>' +
                        '<span class="lw-node-slug">/' + self.escapeHtml(node.slug) + '</span>' +
                        '<span class="lw-node-status">' + statusLabel + '</span>' +
                        extraInfo +
                    '</div>' +
                    toggleBtn +
                '</div>';

                $canvas.append(nodeHtml);
            });

            // ダブルクリック・右クリックでポップアップ
            $('.lw-mindmap-node').on('dblclick contextmenu', function(e) {
                if ($(e.target).closest('.lw-node-toggle').length) return;
                // 仮想ノード（最新投稿）はポップアップを表示しない
                if ($(this).hasClass('is-latest-posts')) return;
                e.preventDefault();
                e.stopPropagation();
                var nodeId = $(this).data('node-id');
                self.showNodePopup(nodeId, e.pageX, e.pageY);
            });

            // 開閉ボタンのクリック
            $('.lw-node-toggle').on('click', function(e) {
                e.stopPropagation();
                var nodeId = $(this).data('node-id');
                self.toggleChildren(nodeId);
            });

            // ポップアップ外クリックで閉じる
            $(document).on('click', function(e) {
                if (!$(e.target).closest('.lw-node-popup').length) {
                    self.hideNodePopup();
                }
            });
        },

        /**
         * ノードポップアップを表示
         */
        showNodePopup: function(nodeId, x, y) {
            var self = this;
            this.hideNodePopup();

            var node = this.allNodes.find(function(n) { return n.id === nodeId; });
            if (!node) return;

            this.currentEditNode = node;

            var statusOptions = '';
            var statuses = [
                { value: 'publish', label: '公開' },
                { value: 'draft', label: '下書き' },
                { value: 'private', label: '非公開' },
                { value: 'pending', label: '承認待ち' }
            ];
            statuses.forEach(function(s) {
                var selected = node.status === s.value ? ' selected' : '';
                statusOptions += '<option value="' + s.value + '"' + selected + '>' + s.label + '</option>';
            });

            // 固定ページでトップページではない場合に「トップページに設定」ボタンを表示
            var setFrontPageBtn = '';
            if (node.type === 'page' && !node.is_front) {
                setFrontPageBtn = '<button type="button" class="lw-popup-btn lw-popup-set-front">トップページに設定</button>';
            }

            var popupHtml = '<div class="lw-node-popup" style="left:' + x + 'px; top:' + y + 'px;">' +
                '<div class="lw-popup-header">' +
                    '<span>編集</span>' +
                    '<button type="button" class="lw-popup-close">&times;</button>' +
                '</div>' +
                '<div class="lw-popup-body">' +
                    '<div class="lw-popup-field">' +
                        '<label>タイトル</label>' +
                        '<input type="text" id="lw-popup-title" value="' + self.escapeHtml(node.title) + '">' +
                    '</div>' +
                    '<div class="lw-popup-field">' +
                        '<label>スラッグ</label>' +
                        '<input type="text" id="lw-popup-slug" value="' + self.escapeHtml(node.slug) + '">' +
                    '</div>' +
                    '<div class="lw-popup-field">' +
                        '<label>ステータス</label>' +
                        '<select id="lw-popup-status">' + statusOptions + '</select>' +
                    '</div>' +
                '</div>' +
                '<div class="lw-popup-footer">' +
                    '<button type="button" class="lw-popup-btn lw-popup-save">保存</button>' +
                    '<button type="button" class="lw-popup-btn lw-popup-open">編集ページ</button>' +
                    setFrontPageBtn +
                '</div>' +
            '</div>';

            $('body').append(popupHtml);

            var $popup = $('.lw-node-popup');

            // 画面外にはみ出さないよう調整
            var popupWidth = $popup.outerWidth();
            var popupHeight = $popup.outerHeight();
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();

            if (x + popupWidth > windowWidth - 20) {
                x = windowWidth - popupWidth - 20;
            }
            if (y + popupHeight > windowHeight - 20) {
                y = windowHeight - popupHeight - 20;
            }
            $popup.css({ left: x, top: y });

            // アニメーション
            $popup.addClass('show');

            // イベント
            $popup.find('.lw-popup-close').on('click', function() {
                self.hideNodePopup();
            });

            $popup.find('.lw-popup-save').on('click', function() {
                self.saveNodeChanges();
            });

            $popup.find('.lw-popup-open').on('click', function() {
                if (node.edit_url) {
                    window.open(node.edit_url, '_blank');
                }
                self.hideNodePopup();
            });

            // トップページに設定
            $popup.find('.lw-popup-set-front').on('click', function() {
                self.setAsFrontPage(node);
            });
        },

        /**
         * トップページに設定
         */
        setAsFrontPage: function(node) {
            var self = this;
            var rawId = parseInt(node.id.replace('page-', ''));

            if (!confirm('「' + node.title + '」をトップページに設定しますか？')) {
                return;
            }

            var $btn = $('.lw-popup-set-front');
            $btn.prop('disabled', true).text('設定中...');

            $.ajax({
                url: lwPageTree.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_set_front_page',
                    nonce: lwPageTree.nonce,
                    page_id: rawId
                },
                success: function(response) {
                    if (response.success) {
                        self.hideNodePopup();
                        // データを再読み込み
                        self.isLoaded = false;
                        self.loadSiteStructure();
                    } else {
                        alert(response.data || '設定に失敗しました');
                        $btn.prop('disabled', false).text('トップページに設定');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('トップページに設定');
                }
            });
        },

        /**
         * トップページ選択ドロップダウンを作成
         */
        populateFrontPageSelect: function() {
            var self = this;
            var selectEl = document.getElementById('lw-tree-front-page-select');

            if (!selectEl) {
                console.log('select element not found');
                return;
            }

            // 最初のオプション以外を削除
            while (selectEl.options.length > 1) {
                selectEl.remove(1);
            }

            // 固定ページをドロップダウンに追加
            if (self.pagesData && self.pagesData.length > 0) {
                self.pagesData.forEach(function(page) {
                    var rawId = page.raw_id || page.id.replace('page-', '');
                    var statusLabel = page.status !== 'publish' ? ' (' + page.status + ')' : '';
                    var option = document.createElement('option');
                    option.value = rawId;
                    option.textContent = page.title + statusLabel;
                    selectEl.appendChild(option);
                });
            }
        },

        /**
         * 警告バナーからトップページを設定
         */
        setFrontPageFromBanner: function() {
            var self = this;
            var pageId = $('#lw-tree-front-page-select').val();

            if (!pageId) {
                alert('固定ページを選択してください');
                return;
            }

            var $btn = $('#lw-btn-set-front');
            $btn.prop('disabled', true).text('設定中...');

            $.ajax({
                url: lwPageTree.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_set_front_page',
                    nonce: lwPageTree.nonce,
                    page_id: pageId
                },
                success: function(response) {
                    if (response.success) {
                        // データを再読み込み
                        self.isLoaded = false;
                        self.loadSiteStructure();
                    } else {
                        alert(response.data || '設定に失敗しました');
                        $btn.prop('disabled', false).text('設定');
                    }
                },
                error: function() {
                    alert('通信エラーが発生しました');
                    $btn.prop('disabled', false).text('設定');
                }
            });
        },

        /**
         * ポップアップを非表示
         */
        hideNodePopup: function() {
            $('.lw-node-popup').remove();
            this.currentEditNode = null;
        },

        /**
         * ノードの変更を保存
         */
        saveNodeChanges: function() {
            var self = this;
            if (!this.currentEditNode) return;

            var node = this.currentEditNode;
            var newTitle = $('#lw-popup-title').val();
            var newSlug = $('#lw-popup-slug').val();
            var newStatus = $('#lw-popup-status').val();

            $.ajax({
                url: lwPageTree.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_update_node_details',
                    nonce: lwPageTree.nonce,
                    node_id: node.id,
                    node_type: node.type,
                    title: newTitle,
                    slug: newSlug,
                    status: newStatus
                },
                success: function(response) {
                    if (response.success) {
                        // ローカルデータも更新
                        node.title = newTitle;
                        node.slug = newSlug;
                        node.status = newStatus;

                        // ノードの表示を更新
                        var $node = $('#node-' + node.id);
                        $node.find('.lw-node-title').text(newTitle);
                        $node.find('.lw-node-slug').text('/' + newSlug);
                        $node.find('.lw-node-status').text(self.getStatusLabel(newStatus));

                        // ステータスクラスを更新
                        $node.removeClass('status-publish status-draft status-private status-pending');
                        $node.addClass('status-' + newStatus);

                        self.showNotice('保存しました ✨', 'success');
                        self.hideNodePopup();
                    } else {
                        self.showNotice('エラー: ' + response.data, 'error');
                    }
                },
                error: function() {
                    self.showNotice('通信エラーが発生しました', 'error');
                }
            });
        },

        toggleChildren: function(nodeId) {
            if (this.collapsedNodes[nodeId]) {
                delete this.collapsedNodes[nodeId];
            } else {
                this.collapsedNodes[nodeId] = true;
            }
            this.rerender();
        },

        rerender: function() {
            var self = this;
            var $canvas = $('#lw-mindmap-canvas');
            var $svg = $('#lw-mindmap-svg');

            var scrollLeft = this.$container.scrollLeft();
            var scrollTop = this.$container.scrollTop();

            this.positions = this.calculateAllPositions();
            this.adjustCanvasSize($canvas, this.positions);

            // 既存ノードの位置を更新
            this.allNodes.forEach(function(node) {
                var $node = $('#node-' + node.id);
                var pos = self.positions[node.id];

                if (pos) {
                    $node.css({
                        left: (pos.x - self.nodeWidth / 2) + 'px',
                        top: (pos.y - self.nodeHeight / 2) + 'px',
                        opacity: 1,
                        pointerEvents: 'auto'
                    });
                } else {
                    $node.css({
                        opacity: 0,
                        pointerEvents: 'none'
                    });
                }

                var $toggle = $node.find('.lw-node-toggle');
                if ($toggle.length) {
                    var isCollapsed = self.collapsedNodes[node.id];
                    var $icon = $toggle.find('.dashicons');
                    if (isCollapsed) {
                        $toggle.addClass('collapsed');
                        $icon.removeClass('dashicons-arrow-down-alt2').addClass('dashicons-arrow-right-alt2');
                    } else {
                        $toggle.removeClass('collapsed');
                        $icon.removeClass('dashicons-arrow-right-alt2').addClass('dashicons-arrow-down-alt2');
                    }
                }
            });

            this.updateConnections($svg, this.positions);

            this.$container.scrollLeft(scrollLeft);
            this.$container.scrollTop(scrollTop);
        },

        updateConnections: function($svg, positions) {
            var self = this;
            var duration = 300;

            this.allNodes.forEach(function(node) {
                var parentId = self.getEffectiveParentId(node);
                if (!parentId) return;

                var $line = $svg.find('line[data-child="' + node.id + '"]');
                if (!$line.length) return;

                var line = $line[0];

                // 子ノードの位置がある場合（表示中）
                if (positions[parentId] && positions[node.id]) {
                    var parentPos = positions[parentId];
                    var childPos = positions[node.id];

                    var currentX1 = parseFloat(line.getAttribute('x1')) || parentPos.x;
                    var currentY1 = parseFloat(line.getAttribute('y1')) || parentPos.y;
                    var currentX2 = parseFloat(line.getAttribute('x2')) || parentPos.x;
                    var currentY2 = parseFloat(line.getAttribute('y2')) || parentPos.y;

                    self.animateLine(line, {
                        x1: currentX1, y1: currentY1, x2: currentX2, y2: currentY2
                    }, {
                        x1: parentPos.x, y1: parentPos.y, x2: childPos.x, y2: childPos.y
                    }, duration);

                    $line.css('opacity', 1);
                } else {
                    // 子ノードが非表示（折りたたまれている）
                    // 親の位置を取得（親が表示されている場合はその位置へ縮める）
                    var targetPos = positions[parentId];

                    // 親も非表示の場合、先祖を辿って表示中の親を探す
                    if (!targetPos) {
                        var ancestorId = parentId;
                        while (ancestorId && !positions[ancestorId]) {
                            var ancestorNode = self.allNodes.find(function(n) { return n.id === ancestorId; });
                            if (ancestorNode) {
                                ancestorId = self.getEffectiveParentId(ancestorNode);
                            } else {
                                break;
                            }
                        }
                        if (ancestorId && positions[ancestorId]) {
                            targetPos = positions[ancestorId];
                        }
                    }

                    if (targetPos) {
                        var currentX1 = parseFloat(line.getAttribute('x1')) || targetPos.x;
                        var currentY1 = parseFloat(line.getAttribute('y1')) || targetPos.y;
                        var currentX2 = parseFloat(line.getAttribute('x2')) || targetPos.x;
                        var currentY2 = parseFloat(line.getAttribute('y2')) || targetPos.y;

                        self.animateLine(line, {
                            x1: currentX1, y1: currentY1, x2: currentX2, y2: currentY2
                        }, {
                            x1: targetPos.x, y1: targetPos.y, x2: targetPos.x, y2: targetPos.y
                        }, duration);
                    }

                    $line.css('opacity', 0);
                }
            });
        },

        animateLine: function(line, from, to, duration) {
            var startTime = null;

            function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);

                line.setAttribute('x1', from.x1 + (to.x1 - from.x1) * eased);
                line.setAttribute('y1', from.y1 + (to.y1 - from.y1) * eased);
                line.setAttribute('x2', from.x2 + (to.x2 - from.x2) * eased);
                line.setAttribute('y2', from.y2 + (to.y2 - from.y2) * eased);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        },

        getEffectiveParentId: function(node) {
            var frontPage = this.pagesData.find(function(p) { return p.is_front; });
            if (!frontPage) return null;

            if (node.is_front) return null;

            if (node.type === 'page') {
                return node.parent_id || frontPage.id;
            }

            if (node.type === 'category') {
                return node.parent_id || this.postsPageId || frontPage.id;
            }

            if (node.type === 'post') {
                return node.parent_id || null;
            }

            return null;
        },

        drawConnections: function($svg, positions) {
            var self = this;
            var lines = '';

            this.allNodes.forEach(function(node) {
                var parentId = self.getEffectiveParentId(node);
                if (!parentId) return;

                if (positions[parentId] && positions[node.id]) {
                    var parentPos = positions[parentId];
                    var childPos = positions[node.id];

                    var lineClass = 'lw-connection-line line-' + node.type;

                    lines += '<line ' +
                        'x1="' + parentPos.x + '" ' +
                        'y1="' + parentPos.y + '" ' +
                        'x2="' + childPos.x + '" ' +
                        'y2="' + childPos.y + '" ' +
                        'class="' + lineClass + '" ' +
                        'data-parent="' + parentId + '" ' +
                        'data-child="' + node.id + '" />';
                }
            });

            $svg.html(lines);
        },

        initDraggable: function() {
            var self = this;

            // 固定ページ、カテゴリー、投稿すべてをドラッグ可能に
            $('.lw-mindmap-node').not('.is-front').draggable({
                containment: '#lw-mindmap-canvas',
                scroll: true,
                scrollSensitivity: 50,
                scrollSpeed: 20,
                start: function() {
                    $(this).addClass('dragging');
                },
                drag: function(e, ui) {
                    var nodeId = $(this).data('node-id');
                    var newX = ui.position.left + self.nodeWidth / 2;
                    var newY = ui.position.top + self.nodeHeight / 2;

                    $('line[data-child="' + nodeId + '"]').attr({ 'x2': newX, 'y2': newY });
                    $('line[data-parent="' + nodeId + '"]').attr({ 'x1': newX, 'y1': newY });
                },
                stop: function() {
                    $(this).removeClass('dragging');
                }
            });

            // ドロップターゲット設定
            $('.lw-mindmap-node').droppable({
                accept: '.lw-mindmap-node',
                hoverClass: 'drop-target',
                tolerance: 'pointer',
                drop: function(e, ui) {
                    var draggedId = ui.draggable.data('node-id');
                    var draggedType = ui.draggable.data('node-type');
                    var targetId = $(this).data('node-id');
                    var targetType = $(this).data('node-type');

                    if (draggedId === targetId) return;

                    // ドロップ可能な組み合わせかチェック
                    if (!self.canDrop(draggedType, targetType)) {
                        self.showNotice('この組み合わせでは移動できません', 'error');
                        return;
                    }

                    self.changeParent(draggedId, targetId, draggedType);
                }
            });
        },

        /**
         * ドロップ可能かチェック
         */
        canDrop: function(draggedType, targetType) {
            // 固定ページ → 固定ページ
            if (draggedType === 'page' && targetType === 'page') return true;
            // カテゴリー → カテゴリー or 固定ページ(投稿ページ)
            if (draggedType === 'category' && (targetType === 'category' || targetType === 'page')) return true;
            // 投稿 → カテゴリー
            if (draggedType === 'post' && targetType === 'category') return true;
            return false;
        },

        /**
         * 親子関係を一時変更（保存はまだしない）
         */
        changeParent: function(nodeId, newParentId, nodeType) {
            var self = this;

            // 循環参照チェック
            if (this.wouldCreateCycle(nodeId, newParentId)) {
                this.showNotice('循環参照になるため変更できません', 'error');
                return;
            }

            // ノードを探して親IDを更新
            var node = this.allNodes.find(function(n) { return n.id === nodeId; });
            if (!node) return;

            var oldParentId = node.parent_id;
            node.parent_id = newParentId;

            // 変更を記録
            this.pendingChanges.push({
                nodeId: nodeId,
                nodeType: nodeType,
                oldParentId: oldParentId,
                newParentId: newParentId
            });

            this.hasChanges = true;
            this.showSaveButton();

            // レイアウトを再計算
            this.rerender();
            this.showNotice('変更しました（未保存）', 'success');
        },

        /**
         * 循環参照チェック
         */
        wouldCreateCycle: function(nodeId, newParentId) {
            var self = this;
            var currentId = newParentId;
            var visited = {};

            while (currentId) {
                if (currentId === nodeId) return true;
                if (visited[currentId]) return false;
                visited[currentId] = true;

                var parent = this.allNodes.find(function(n) { return n.id === currentId; });
                currentId = parent ? parent.parent_id : null;
            }
            return false;
        },

        /**
         * 保存ボタンを表示
         */
        showSaveButton: function() {
            if ($('#lw-save-changes').length) return;

            var $btn = $('<button type="button" id="lw-save-changes" class="lw-save-btn">' +
                '<span class="dashicons dashicons-saved"></span>' +
                '<span>変更を保存</span>' +
                '</button>');

            var $cancelBtn = $('<button type="button" id="lw-cancel-changes" class="lw-cancel-btn">' +
                '<span class="dashicons dashicons-no"></span>' +
                '<span>キャンセル</span>' +
                '</button>');

            this.$modal.find('.lw-modal-toolbar').append($btn).append($cancelBtn);

            var self = this;
            $btn.on('click', function() {
                self.saveAllChanges();
            });
            $cancelBtn.on('click', function() {
                self.cancelChanges();
            });
        },

        /**
         * 保存ボタンを非表示
         */
        hideSaveButton: function() {
            $('#lw-save-changes').remove();
            $('#lw-cancel-changes').remove();
        },

        /**
         * すべての変更を保存
         */
        saveAllChanges: function() {
            var self = this;

            if (this.pendingChanges.length === 0) return;

            // 変更をまとめて送信
            $.ajax({
                url: lwPageTree.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'lw_save_structure_changes',
                    nonce: lwPageTree.nonce,
                    changes: JSON.stringify(this.pendingChanges)
                },
                success: function(response) {
                    if (response.success) {
                        self.showNotice('保存しました', 'success');
                        self.pendingChanges = [];
                        self.hasChanges = false;
                        self.hideSaveButton();
                    } else {
                        self.showNotice('エラー: ' + response.data, 'error');
                    }
                },
                error: function() {
                    self.showNotice('通信エラーが発生しました', 'error');
                }
            });
        },

        /**
         * 変更をキャンセル
         */
        cancelChanges: function() {
            this.pendingChanges = [];
            this.hasChanges = false;
            this.hideSaveButton();
            this.isLoaded = false;
            this.loadSiteStructure();
            this.showNotice('変更をキャンセルしました', 'success');
        },

        adjustCanvasSize: function($canvas, positions) {
            var minX = Infinity, maxX = -Infinity;
            var minY = Infinity, maxY = -Infinity;

            for (var id in positions) {
                var pos = positions[id];
                minX = Math.min(minX, pos.x);
                maxX = Math.max(maxX, pos.x);
                minY = Math.min(minY, pos.y);
                maxY = Math.max(maxY, pos.y);
            }

            var paddingLeft = 1200;
            var paddingRight = 500;
            var paddingTop = 500;
            var paddingBottom = 500;

            var width = Math.max(maxX + paddingRight, this.centerX + paddingRight) + paddingLeft;
            var height = Math.max((maxY - minY) + this.nodeHeight + paddingTop + paddingBottom, 2000);

            $canvas.css({ width: width + 'px', height: height + 'px' });
            $('#lw-mindmap-svg').attr({ width: width, height: height });
        },

        zoom: function(delta) {
            this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel + delta));
            this.applyZoom();
        },

        applyZoom: function() {
            var $canvas = $('#lw-mindmap-canvas');
            $canvas.css({
                'transform': 'scale(' + this.zoomLevel + ')',
                'transform-origin': 'top left'
            });
            $('#lw-zoom-level').text(Math.round(this.zoomLevel * 100) + '%');
        },

        getStatusLabel: function(status) {
            var labels = {
                'publish': '公開',
                'draft': '下書き',
                'private': '非公開',
                'pending': '承認待ち'
            };
            return labels[status] || status;
        },

        escapeHtml: function(text) {
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        showError: function(message) {
            this.$container.html('<div class="lw-mindmap-error">' + message + '</div>');
        },

        showNotice: function(message, type) {
            var $notice = $('<div class="lw-mindmap-notice lw-notice-' + type + '">' + message + '</div>');
            this.$modal.find('.lw-modal-header').append($notice);

            setTimeout(function() {
                $notice.fadeOut(function() {
                    $(this).remove();
                });
            }, 2000);
        },

        /**
         * ノードがフィルターで表示されるかチェック
         */
        isNodeVisible: function(node) {
            // フロントページは常に表示
            if (node.is_front) return true;

            // 下書きフィルター（ステータスがdraftのもの）
            if (node.status === 'draft' && !this.filters.draft) {
                return false;
            }

            // 固定ページフィルター
            if (node.type === 'page' && !this.filters.page) {
                return false;
            }

            // 投稿フィルター（投稿とカテゴリー）
            if ((node.type === 'post' || node.type === 'category') && !this.filters.post) {
                return false;
            }

            return true;
        },

        /**
         * フィルターを適用（レイアウト再計算）
         */
        applyFilters: function() {
            this.rerender();
        }
    };

    $(document).ready(function() {
        SiteMindMap.init();
    });

})(jQuery);
