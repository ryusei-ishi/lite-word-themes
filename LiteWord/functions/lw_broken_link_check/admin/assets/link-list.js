jQuery(document).ready(function($) {
    // PHP から渡る値は全て lwLinkList（wp_localize_script）に入っている → admin/enqueue.php
    var cfg = window.lwLinkList || {};

    // ヘッダー・フッター・メニューをまとめる、投稿タイプではない専用のタブ名。
    // 実在する投稿タイプと衝突しないよう先頭にアンダースコアを付けてある
    var COMMON_TYPE = '_common';

    var allLinks = [];
    var allPages = [];
    var groupedData = {};

    // 画面に並ぶ行数（サイト共通のリンクは1本として数えたもの）。renderStats が入れる
    var displayedTotal = 0;
    var homeUrl = cfg.homeUrl || '';
    var hasDataAttr = $('#lw-start-scan').attr('data-has-data');
    var hasData = hasDataAttr === '1';

    // 投稿タイプのラベル
    var postTypeLabels = cfg.postTypeLabels || {};

    /**
     * AJAX に送る data を組み立てる。
     * 🚨 nonce はここでしか載せない。data を手書きしないこと（付け忘れ＝403 で必ず落ちる）。
     */
    function lwData(action, extra) {
        return $.extend({ action: action, nonce: cfg.nonce }, extra || {});
    }

    // リンク種別を判定
    function getLinkType(href) {
        if (!href || href.trim() === '') return 'empty';
        if (/^#/.test(href)) return 'anchor';
        if (/^mailto:/i.test(href)) return 'mailto';
        if (/^tel:/i.test(href)) return 'tel';
        if (/^javascript:/i.test(href)) return 'javascript';
        if (/^https?:\/\//.test(href)) {
            return href.indexOf(homeUrl) !== -1 ? 'internal' : 'external';
        }
        if (/^\//.test(href)) return 'relative';
        return 'other';
    }

    // 広告リンク（アフィリエイト）かどうか。
    // スキャン時に rel を見て立てた印。古い記録には無いので、その場合は false。
    function isAdLink(link) {
        return !!(link && link.is_ad);
    }

    // 広告リンクの目印
    function getAdLabel(link) {
        return isAdLink(link) ? '<span class="lw-link-type lw-link-ad">広告</span>' : '';
    }

    // 種別ラベルを取得
    function getTypeLabel(type) {
        var labels = {
            'empty': '<span class="lw-link-type lw-link-empty">未設定</span>',
            'anchor': '<span class="lw-link-type lw-link-anchor">アンカー</span>',
            'internal': '<span class="lw-link-type lw-link-internal">内部</span>',
            'external': '<span class="lw-link-type lw-link-external">外部</span>',
            'relative': '<span class="lw-link-type lw-link-relative">相対</span>',
            'mailto': '<span class="lw-link-type lw-link-mailto">メール</span>',
            'tel': '<span class="lw-link-type lw-link-tel">電話</span>',
            'javascript': '<span class="lw-link-type lw-link-js">JavaScript</span>',
            'other': '<span class="lw-link-type lw-link-other">その他</span>'
        };
        return labels[type] || labels['other'];
    }

    // HTMLエスケープ
    //
    // 🚨 $('<div>').text(t).html() を使わないこと。
    //    これはテキストノードとしての書き出しなので & < > しか変換せず、
    //    ダブルクォートがそのまま残る。この関数の戻り値は
    //    data-href="..." や value="..." の**属性の中**でも使っているので、
    //    リンクのテキストに " が入っていると属性から抜け出して
    //    好きな属性（onmouseover など）を足せてしまう。
    //    リンクの文字列は記事の本文から拾ってくる＝投稿できる人なら誰でも
    //    仕込めるので、管理者の画面で動く JavaScript になる。
    //    2026-09-02、jsdom で実際に抜けられることを確かめて直した。
    function escapeHtml(text) {
        if (text === null || text === undefined || text === '') return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // フィルター条件を取得
    function getActiveFilters() {
        var filters = [];
        $('.lw-filter:checked').each(function() {
            filters.push($(this).val());
        });
        return filters;
    }

    // 検索クエリを取得
    function getSearchQuery() {
        return $('#lw-search').val().toLowerCase();
    }

    // リンクがフィルター条件に合うかチェック
    function matchesFilter(link, activeFilters, searchQuery) {
        var type = getLinkType(link.href);

        // 種別フィルター
        if (activeFilters.indexOf(type) === -1) return false;

        // 広告リンクだけに絞る
        if ($('#lw-only-ad').is(':checked') && !isAdLink(link)) return false;

        // 検索
        if (searchQuery) {
            var searchTarget = (link.href + ' ' + link.text + ' ' + link.source_title).toLowerCase();
            if (searchTarget.indexOf(searchQuery) === -1) return false;
        }

        return true;
    }

    // 全ページ情報を使ってグループ化されたデータを構築
    function buildGroupedData() {
        groupedData = {};

        // まず全ページで初期化（リンクがないページも含む）
        allPages.forEach(function(page) {
            var postType = page.post_type || 'unknown';
            var postId = page.post_id;

            if (!groupedData[postType]) {
                groupedData[postType] = {
                    label: postTypeLabels[postType] || postType,
                    pages: {}
                };
            }

            groupedData[postType].pages[postId] = {
                title: page.post_title,
                edit_link: page.edit_link,
                link_count: page.link_count || 0,
                links: [],
                ids: page.ids || []
            };
        });

        // サイト共通のリンク（ヘッダー・フッター・メニュー）は1回だけ見せる。
        // しっかりスキャンはフッターまで拾うので、ページごとに並べると
        // フッター20本 × 20ページ = 400行の繰り返しで本文のリンクが埋もれる。
        var commonSeen = {};

        // リンク情報を追加
        allLinks.forEach(function(link) {
            if (link.source_type !== 'post') return;

            if (link.scope === 'common') {
                var key = link.href || '';
                if (commonSeen[key]) return;
                commonSeen[key] = true;
                addCommonLink(link);
                return;
            }

            var postType = link.post_type || 'unknown';
            var postId = link.source_id;

            if (groupedData[postType] && groupedData[postType].pages[postId]) {
                groupedData[postType].pages[postId].links.push(link);
            }
        });
    }

    // サイト共通のリンクを、専用のまとまりに1本だけ足す
    function addCommonLink(link) {
        if (!groupedData[COMMON_TYPE]) {
            groupedData[COMMON_TYPE] = {
                label: 'サイト共通',
                pages: {}
            };
            groupedData[COMMON_TYPE].pages[0] = {
                title: 'ヘッダー・フッター・メニューなど（全ページ共通）',
                edit_link: '',
                link_count: 0,
                links: [],
                ids: [],
                // 🚨 ここは特定の1ページではないので、アンカー先の id があるかを判定できない。
                //    判定すると全部「ID不在」になって、ありもしない不具合を出してしまう
                skipAnchorCheck: true
            };
        }

        var bucket = groupedData[COMMON_TYPE].pages[0];
        bucket.links.push(link);
        bucket.link_count = bucket.links.length;
    }

    // 現在のアクティブタブ
    var activeTab = null;

    // タブを描画
    function renderTabs() {
        var $tabsContainer = $('#lw-tabs');
        var $contentsContainer = $('#lw-tab-contents');

        $tabsContainer.empty();
        $contentsContainer.empty();

        // 表示順序（サイト共通、固定ページ、投稿、その他カスタム投稿）。
        // サイト共通を先頭に置くのは、フッターのリンク切れが全ページに効くため
        var typeOrder = [COMMON_TYPE, 'page', 'post'];
        var otherTypes = Object.keys(groupedData).filter(function(t) {
            return typeOrder.indexOf(t) === -1;
        }).sort(function(a, b) {
            var labelA = postTypeLabels[a] || a;
            var labelB = postTypeLabels[b] || b;
            return labelA.localeCompare(labelB, 'ja');
        });
        var orderedTypes = typeOrder.concat(otherTypes);

        // 有効なタブのみをフィルタリング
        var validTypes = orderedTypes.filter(function(postType) {
            return groupedData[postType] && Object.keys(groupedData[postType].pages).length > 0;
        });

        if (validTypes.length === 0) {
            $tabsContainer.html('<p style="padding: 15px; color: #666;">データがありません。</p>');
            return;
        }

        // アクティブタブが無効になった場合、最初のタブをアクティブに
        if (!activeTab || validTypes.indexOf(activeTab) === -1) {
            activeTab = validTypes[0];
        }

        // タブを生成
        validTypes.forEach(function(postType) {
            var group = groupedData[postType];
            var pageCount = Object.keys(group.pages).length;
            var linkCount = 0;

            Object.keys(group.pages).forEach(function(pageId) {
                linkCount += group.pages[pageId].links.length;
            });

            var isActive = postType === activeTab;
            var tabHtml = '<button type="button" class="lw-link-tab' + (isActive ? ' active' : '') + '" data-post-type="' + postType + '">' +
                escapeHtml(group.label) +
                '<span class="lw-link-tab-count">' + linkCount + '</span>' +
                '</button>';
            $tabsContainer.append(tabHtml);

            // タブコンテンツを生成
            var contentHtml = '<div class="lw-link-tab-content' + (isActive ? ' active' : '') + '" data-post-type="' + postType + '">' +
                '<div class="lw-tab-pages"></div>' +
                '</div>';
            $contentsContainer.append(contentHtml);
        });

        // アクティブタブのコンテンツを描画
        renderTabContent(activeTab);
    }

    // 特定のタブのコンテンツを描画
    function renderTabContent(postType) {
        var $content = $('.lw-link-tab-content[data-post-type="' + postType + '"]');
        var $pagesContainer = $content.find('.lw-tab-pages');
        var activeFilters = getActiveFilters();
        var searchQuery = getSearchQuery();
        var totalVisible = 0;

        $pagesContainer.empty();

        if (!groupedData[postType]) return;

        var group = groupedData[postType];
        var pagesHtml = '';

        // ページIDでソート（タイトル順にソート）
        var pageIdList = Object.keys(group.pages).sort(function(a, b) {
            return group.pages[a].title.localeCompare(group.pages[b].title, 'ja');
        });

        pageIdList.forEach(function(pageId) {
            var page = group.pages[pageId];
            var pageTitle = page.edit_link ?
                '<a href="' + page.edit_link + '" target="_blank">' + escapeHtml(page.title) + '</a>' :
                escapeHtml(page.title);

            // ページが検索に一致するかチェック
            if (searchQuery) {
                var pageSearchTarget = page.title.toLowerCase();
                var linksMatchSearch = page.links.some(function(link) {
                    return (link.href + ' ' + link.text).toLowerCase().indexOf(searchQuery) !== -1;
                });
                if (pageSearchTarget.indexOf(searchQuery) === -1 && !linksMatchSearch) {
                    return; // このページはスキップ
                }
            }

            // リンクがないページ
            if (page.links.length === 0) {
                pagesHtml += '<div class="lw-link-page lw-no-links-page" data-page-id="' + pageId + '">' +
                    '<div class="lw-link-page-header">' +
                    '<span class="lw-link-page-title">' + pageTitle + '</span>' +
                    '<span class="lw-link-page-count" style="color: #999; font-style: italic;">リンク設定なし</span>' +
                    '</div>' +
                    '</div>';
            } else {
                // リンクがあるページ
                var linksHtml = '';
                var pageLinkCount = 0;

                page.links.forEach(function(link) {
                    if (!matchesFilter(link, activeFilters, searchQuery)) return;

                    pageLinkCount++;
                    totalVisible++;

                    var type = getLinkType(link.href);
                    var hrefDisplay = link.href ?
                        '<span class="lw-href-value">' + escapeHtml(link.href) + '</span>' :
                        '<span class="lw-href-value empty">(空 - href未設定)</span>';

                    // アンカーリンクのチェック（サイト共通のまとまりでは行わない。理由は addCommonLink）
                    var warningMark = '';
                    if (link.href && /^#/.test(link.href) && !page.skipAnchorCheck) {
                        // #を全て除去して、残りをtrimし、空なら警告
                        var anchorId = link.href.replace(/^#+/, '').trim();
                        if (anchorId === '' || /^\s*$/.test(anchorId) || /^#/.test(anchorId)) {
                            // 無効なアンカー（#のみ、##など）
                            warningMark = '<span class="lw-link-warning" title="有効なアンカーID（#の後の文字列）が設定されていません。正しいリンク先を設定してください。">▲</span>' +
                                '<span class="lw-link-warning-badge">無効</span>';
                        } else {
                            // 有効なアンカーIDがあるので、ページ内にそのidが存在するかチェック
                            var pageIdsList = page.ids || [];
                            if (pageIdsList.indexOf(anchorId) === -1) {
                                // ページ内にidが存在しない
                                warningMark = '<span class="lw-link-error" title="アンカー先のid=&quot;' + escapeHtml(anchorId) + '&quot; がこのページ内に存在しません。">✗</span>' +
                                    '<span class="lw-link-error-badge">ID不在</span>';
                            }
                        }
                    }

                    var textDisplay = link.text ?
                        escapeHtml(link.text) :
                        '<em style="color:#999;">(テキストなし)</em>';

                    // 編集ボタン用のデータ属性（link_index は本文中の出現順）
                    // link_index が -1 のリンクは、ブロックのレンダリング結果など
                    // post_content に実体が無いもの。位置で特定できないので編集させない
                    // （させると本文中の別のリンクを書き換えてしまう）
                    var linkIndex = (link.link_index !== undefined && link.link_index !== null)
                        ? link.link_index
                        : -1;
                    var isEditable = linkIndex >= 0;
                    var dataAttrs = 'data-post-id="' + pageId + '" ' +
                        'data-href="' + escapeHtml(link.href || '') + '" ' +
                        'data-text="' + escapeHtml(link.text || '') + '" ' +
                        'data-link-index="' + linkIndex + '"';

                    var actionCell = isEditable
                        ? '<button type="button" class="lw-edit-btn">編集</button>'
                        : '<span class="lw-edit-na" title="ブロックが出力しているリンクのため、本文から直接は編集できません。編集画面で該当ブロックを直してください。">—</span>';

                    // 何ページに出ているか。まとめた根拠が見えないと、
                    // なぜ1行にされているのか分からない
                    if (link.scope === 'common' && link.common_pages) {
                        textDisplay += '<span class="lw-common-count">' + link.common_pages + ' ページに出ています</span>';
                    }

                    linksHtml += '<tr class="lw-link-row" ' + dataAttrs + '>' +
                        '<td class="column-href"><span class="lw-href-display">' + hrefDisplay + warningMark + '</span></td>' +
                        '<td class="column-type">' + getTypeLabel(type) + getAdLabel(link) + '</td>' +
                        '<td class="column-text"><span class="lw-link-text">' + textDisplay + '</span></td>' +
                        '<td class="column-action">' + actionCell + '</td>' +
                        '</tr>';
                });

                if (pageLinkCount > 0 || !searchQuery) {
                    pagesHtml += '<div class="lw-link-page" data-page-id="' + pageId + '">' +
                        '<div class="lw-link-page-header">' +
                        '<span class="lw-link-page-title">' + pageTitle + '</span>' +
                        '<span class="lw-link-page-count">' + pageLinkCount + ' 件</span>' +
                        '</div>' +
                        '<div class="lw-link-page-links">' +
                        (pageLinkCount > 0 ?
                            '<table class="wp-list-table widefat fixed striped lw-link-list-table">' +
                            '<thead><tr>' +
                            '<th class="column-href">href属性値</th>' +
                            '<th class="column-type">種別</th>' +
                            '<th class="column-text">リンクテキスト</th>' +
                            '<th class="column-action">操作</th>' +
                            '</tr></thead>' +
                            '<tbody>' + linksHtml + '</tbody>' +
                            '</table>' :
                            '<p style="color: #999; font-style: italic; margin: 10px 0;">フィルター条件に一致するリンクがありません</p>'
                        ) +
                        '</div>' +
                        '</div>';
                }
            }
        });

        if (pagesHtml) {
            $pagesContainer.html(pagesHtml);
        } else {
            $pagesContainer.html('<div class="lw-no-links">該当するページがありません。</div>');
        }

        // 合計を更新（現在のタブのみ）
        updateTabCount();
    }

    // タブの件数表示を更新（全タブのカウントバッジと合計表示を更新）
    function updateTabCount() {
        var activeFilters = getActiveFilters();
        var searchQuery = getSearchQuery();
        var totalVisible = 0;

        // 各タブの件数を更新
        $('.lw-link-tab').each(function() {
            var $tab = $(this);
            var postType = $tab.data('post-type');
            var tabLinkCount = 0;

            if (groupedData[postType]) {
                Object.keys(groupedData[postType].pages).forEach(function(pageId) {
                    var page = groupedData[postType].pages[pageId];
                    page.links.forEach(function(link) {
                        if (matchesFilter(link, activeFilters, searchQuery)) {
                            tabLinkCount++;
                        }
                    });
                });
            }

            $tab.find('.lw-link-tab-count').text(tabLinkCount);

            if (postType === activeTab) {
                totalVisible = tabLinkCount;
            }
        });

        // 分母は「画面に並ぶ行数」。allLinks.length はサイト共通のぶんが
        // ページ数だけ重複しているので使わない（renderStats と同じ数え方に揃える）
        $('#lw-count').text('表示: ' + totalVisible + ' リンク / 全 ' + displayedTotal + ' リンク');
    }

    // グループを描画（タブ形式）
    function renderGroups() {
        renderTabs();

        // 結果エリアを表示
        $('#lw-results').show();
    }

    // タブクリックイベント
    $(document).on('click', '.lw-link-tab', function() {
        var $tab = $(this);
        var postType = $tab.data('post-type');

        if (postType === activeTab) return;

        // タブの切り替え
        $('.lw-link-tab').removeClass('active');
        $tab.addClass('active');

        $('.lw-link-tab-content').removeClass('active');
        $('.lw-link-tab-content[data-post-type="' + postType + '"]').addClass('active');

        activeTab = postType;

        // コンテンツを描画
        renderTabContent(postType);
    })

    /**
     * 統計を表示（buildGroupedData後に呼ぶこと）
     *
     * 🚨 数えるのは「画面に並んでいる行」と同じ単位にすること。
     *    しっかりスキャンではヘッダー・フッターのリンクが全ページに付くので、
     *    そのまま数えると 1本のフッターリンクが 60本に化ける
     *    （実測で 総リンク数 534 のところが 2,468 になった）。
     *    画面では「サイト共通」に1回だけ出しているので、数え方も1回に揃える。
     */
    function renderStats() {
        var stats = {
            total: 0,
            pages: allPages.length,
            empty: 0, anchor: 0, internal: 0, external: 0,
            relative: 0, mailto: 0, tel: 0, javascript: 0,
            hashOnly: 0,  // 無効なアンカーリンク数（#のみ、##など）
            idMissing: 0  // ID不在のアンカーリンク数
        };

        // ページIDからidsを取得するマップを作成
        var pageIdsMap = {};
        allPages.forEach(function(page) {
            pageIdsMap[page.post_id] = page.ids || [];
        });

        var commonCounted = {};

        allLinks.forEach(function(link) {
            var isCommon = link.scope === 'common';

            // サイト共通のリンクは1本として数える
            if (isCommon) {
                var key = link.href || '';
                if (commonCounted[key]) return;
                commonCounted[key] = true;
            }

            stats.total++;

            var type = getLinkType(link.href);
            if (stats[type] !== undefined) stats[type]++;

            // アンカーリンクのチェック。
            // サイト共通のアンカーは、どの1ページを基準に見るべきかが決まらないので数えない
            if (link.href && /^#/.test(link.href) && !isCommon) {
                var anchorId = link.href.replace(/^#+/, '').trim();
                if (anchorId === '' || /^\s*$/.test(anchorId) || /^#/.test(anchorId)) {
                    // 無効なアンカー（#のみ、##など）
                    stats.hashOnly++;
                } else {
                    // 有効なアンカーIDがあるので、ページ内にそのidが存在するかチェック
                    var pageIds = pageIdsMap[link.source_id] || [];
                    if (pageIds.indexOf(anchorId) === -1) {
                        stats.idMissing++;
                    }
                }
            }
        });

        displayedTotal = stats.total;

        var html = '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number">' + stats.pages + '</span><span class="lw-link-list-stat-label">総ページ数</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number">' + stats.total + '</span><span class="lw-link-list-stat-label">総リンク数</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#dc3232;">' + stats.empty + '</span><span class="lw-link-list-stat-label">未設定</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#d63638;">' + stats.hashOnly + '</span><span class="lw-link-list-stat-label">▲ 無効#</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#dc3232;">' + stats.idMissing + '</span><span class="lw-link-list-stat-label">✗ ID不在</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#666;">' + stats.anchor + '</span><span class="lw-link-list-stat-label">アンカー</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#46b450;">' + stats.internal + '</span><span class="lw-link-list-stat-label">内部</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#0073aa;">' + stats.external + '</span><span class="lw-link-list-stat-label">外部</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#17a2b8;">' + stats.relative + '</span><span class="lw-link-list-stat-label">相対</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#856404;">' + stats.mailto + '</span><span class="lw-link-list-stat-label">メール</span></div>' +
            '<div class="lw-link-list-stat"><span class="lw-link-list-stat-number" style="color:#28a745;">' + stats.tel + '</span><span class="lw-link-list-stat-label">電話</span></div>';

        $('#lw-stats').html(html).css('display', 'flex');
    }

    // サーバーが返したエラーを画面に出す（nonce切れ・プレミアム外はここに来る）
    function showError(response) {
        var message = (response && response.data && response.data.message)
            ? response.data.message
            : '不明なエラーが発生しました。';
        alert(message);
    }

    /**
     * いまの一覧が「どうやって集められたものか」を画面に出す。
     *
     * 🚨 これを省かないこと。
     *    軽いスキャンとしっかりスキャンでは件数が変わる。理由が画面に無いと、
     *    利用者は数が合わないことを不具合だと受け取る。
     */
    function renderScanState(data) {
        var mode = data.scanMode === 'full' ? 'full' : 'light';
        var errors = data.crawlErrors || [];
        var skipped = data.skipped || 0;
        var commonCount = data.commonCount || 0;

        var badge = '';

        if (mode === 'full') {
            badge = '<span class="lw-mode-tag lw-mode-tag-full">しっかり調べた一覧</span>' +
                '<span class="lw-mode-note">公開ページを実際に読み込んで集めました。' +
                'ヘッダー・フッター・メニューのリンクも含まれます。';
            if (commonCount > 0) {
                badge += '全ページ共通のリンク ' + commonCount + ' 本は「サイト共通」にまとめてあります。';
            }
            badge += '</span>';
        } else {
            badge = '<span class="lw-mode-tag lw-mode-tag-light">軽く調べた一覧</span>' +
                '<span class="lw-mode-note">本文のリンクを、データベースの中だけで集めました。' +
                'ヘッダー・フッター・メニューのリンクと、ブロックが自動で作るリンクの一部は含まれません。' +
                'すべて調べるには「しっかり調べる」を押してください。</span>';
        }

        $('#lw-scan-mode-badge').html(badge).show();

        // 読めなかったページ・上限で外したページは、必ず名前を挙げて伝える
        var notice = '';

        // 時間がかかった理由を出す。出さないと「今回だけ異様に遅い」としか見えない
        if (data.throttled) {
            notice += '<p><strong>サーバーからアクセス制限を受けたため、間隔を空けて調べました。</strong>' +
                'そのぶん時間がかかっています。ページはすべて読み込めています。</p>';
        }

        if (skipped > 0) {
            notice += '<p><strong>ページ数が多いため ' + skipped + ' ページは調べていません。</strong>' +
                '一度に巡回できるのは ' + (cfg.crawlMax || 200) + ' ページまでです。</p>';
        }

        if (errors.length > 0) {
            notice += '<p><strong>次の ' + errors.length + ' ページは読み込めませんでした。</strong>' +
                'この分は本文のリンクだけを載せています。</p><ul class="lw-crawl-error-list">';

            errors.forEach(function(error) {
                notice += '<li>' + escapeHtml(error.title || '(無題)') +
                    ' — ' + escapeHtml(error.reason || '') + '</li>';
            });

            notice += '</ul>';
        }

        if (notice) {
            $('#lw-crawl-notice').html(notice).show();
        } else {
            $('#lw-crawl-notice').hide().empty();
        }
    }

    // DBからデータを読み込んで表示
    function loadFromDatabase(onDone) {
        $('#lw-loading').show();
        $('#lw-loading .lw-link-list-loading-text').text('データを読み込み中...');

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: lwData('lw_link_list_load'),
            success: function(response) {
                if (!response.success) {
                    showError(response);
                    return;
                }

                allLinks = response.data.links || [];
                allPages = response.data.pages || [];

                // チェック結果は DB に残してあるので、画面を開き直しても消えない
                checkResults = response.data.checkResults || {};

                // どちらの方式で採った一覧か。件数が変わる理由になるので必ず出す
                renderScanState(response.data);

                buildGroupedData();
                renderStats();
                renderGroups();
                $('#lw-results').show();

                if (Object.keys(checkResults).length > 0) {
                    updateResultsSummary();
                    updateLinkStatusInTable();
                    $('#lw-check-results-summary').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
            },
            complete: function() {
                $('#lw-loading').hide();
                $('#lw-loading .lw-link-list-loading-text').text('リンクを調査中...');
                if (typeof onDone === 'function') {
                    onDone();
                }
            }
        });
    }

    // ページ読み込み時にDBにデータがあれば自動表示
    if (hasData) {
        loadFromDatabase();
    }

    /**
     * スキャンを1バッチずつ進める。
     * 全ページを1リクエストで処理すると、ページ数の多いサイトでタイムアウトするため。
     */
    function runScanBatch(offset, total, $btn) {
        var shown = total > 0 ? Math.min(offset, total) + ' / ' + total : offset;
        $('#lw-loading .lw-link-list-loading-text').text('リンクを調査中... ' + shown);

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: lwData('lw_link_list_scan_batch', { offset: offset }),
            success: function(response) {
                if (!response.success) {
                    showError(response);
                    finishScan($btn);
                    return;
                }

                var scanned = response.data.scanned || 0;

                // scanned が 0 なら必ず止める（進まないまま呼び続けないための歯止め）
                if (response.data.done || scanned === 0) {
                    finishScan($btn);
                    return;
                }

                runScanBatch(offset + scanned, total, $btn);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                alert('通信エラーが発生しました。');
                finishScan($btn);
            }
        });
    }

    // 軽いスキャン完了後の後始末
    function finishScan($btn) {
        // ボタンの文言は変えない。「もう一度○○」にすると2つの頭が揃って見分けがつかなくなる
        $btn.data('has-data', 1);
        afterScanCompleted();
    }

    /**
     * 集め方（軽い / しっかり）によらず、スキャンが終わったときに毎回やること。
     * しっかりスキャン側（link-list-crawl.js）からも呼ぶ。
     */
    function afterScanCompleted() {
        loadFromDatabase(function() {
            setScanButtonsDisabled(false);
            $('#lw-loading').hide();
        });

        $('#lw-check-controls').show();

        // 進捗バーは前回の実行の残りなので消す。
        // 🚨 チェック結果（有効・リンク切れ）はここで消さないこと。
        //    結果は URL を鍵に DB に持たせてあり、採り直しても同じ URL の判定は生きている。
        //    ここで空にしても直後の loadFromDatabase が DB から読み直すので効かず、
        //    「消しているつもりで消えていない」だけのコードになる（2026-08-22 に確認）。
        $('#lw-check-progress').hide();

        stampLastUpdated();
    }

    // 「最終更新」の表示を今の時刻にする
    function stampLastUpdated() {
        var now = new Date();
        var dateStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' +
            ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);

        if ($('#lw-last-updated').length) {
            $('#lw-last-updated').text('最終更新: ' + dateStr);
        } else {
            $('.lw-scan-modes').append('<span id="lw-last-updated" class="lw-last-updated">最終更新: ' + dateStr + '</span>');
        }
    }

    // スキャン中は両方のボタンを止める（軽いと しっかり を同時に走らせない）
    function setScanButtonsDisabled(disabled) {
        $('.lw-scan-button').prop('disabled', !!disabled);
    }

    // 軽いスキャン開始（新規/再生成）
    $('#lw-start-scan').on('click', function() {
        var $btn = $(this);
        setScanButtonsDisabled(true);
        $('#lw-loading').show();
        $('#lw-loading .lw-link-list-loading-text').text('リンクを調査中...');
        $('#lw-results').hide();
        $('#lw-stats').hide();

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: lwData('lw_link_list_scan_start'),
            success: function(response) {
                if (!response.success) {
                    showError(response);
                    setScanButtonsDisabled(false);
                    $('#lw-loading').hide();
                    return;
                }

                runScanBatch(0, response.data.total || 0, $btn);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                alert('通信エラーが発生しました。');
                setScanButtonsDisabled(false);
                $('#lw-loading').hide();
            }
        });
    });

    // グループの開閉
    $(document).on('click', '.lw-link-group-header', function() {
        $(this).closest('.lw-link-group').toggleClass('collapsed');
    });

    // ページの開閉
    $(document).on('click', '.lw-link-page-header', function(e) {
        if ($(e.target).is('a')) return; // リンククリックは除外
        $(this).closest('.lw-link-page').toggleClass('collapsed');
    });

    // フィルター変更（現在のタブのみ再描画）
    $('.lw-filter').on('change', function() {
        if (activeTab) {
            renderTabContent(activeTab);
        }
    });

    // 「広告リンクだけ」の絞り込み
    // 🚨 このチェックボックスに .lw-filter を付けて上にまとめないこと。
    //    getActiveFilters() が値を集めるので、種別の一覧に "on" が混ざる。
    //    絞り込みの中身は matchesFilter() が直接読んでいる。ここは再描画のきっかけだけ。
    $('#lw-only-ad').on('change', function() {
        if (activeTab) {
            renderTabContent(activeTab);
        }
    });

    // 検索（現在のタブのみ再描画）
    var searchTimer;
    $('#lw-search').on('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            if (activeTab) {
                renderTabContent(activeTab);
            }
        }, 300);
    });

    // ========================================
    // リンク有効性チェック機能
    // ========================================

    var checkResults = {};  // URL => 結果（DB にも保存されるので画面を離れても消えない）
    var isChecking = false;
    var checkAborted = false;

    // ステータスラベルを取得
    function getStatusLabel(status, statusCode) {
        var labels = {
            'ok': '有効',
            'redirect': 'リダイレクト',
            'not_found': 'リンク切れ',
            'unverified': '確認できず',
            'client_error': 'エラー',
            'server_error': 'サーバーエラー',
            'timeout': 'タイムアウト',
            'error': '接続エラー',
            'blocked': '送信せず',
            'skip': 'スキップ',
        };
        var label = labels[status] || status;
        if (statusCode) {
            label += ' (' + statusCode + ')';
        }
        return label;
    }

    // ステータスバッジHTMLを生成
    function getStatusBadge(status, statusCode) {
        var label = getStatusLabel(status, statusCode);
        return '<span class="lw-link-status lw-status-' + status + '">' + label + '</span>';
    }

    // プログレス更新
    function updateProgress(checked, total) {
        var percent = total > 0 ? Math.round((checked / total) * 100) : 0;
        $('#lw-progress-bar').css('width', percent + '%').text(percent + '%');
        $('#lw-progress-text').text('チェック中: ' + checked + ' / ' + total + ' URL');
    }

    /**
     * 結果サマリー更新
     *
     * 🚨「確認できず」を「リンク切れ」に混ぜないこと。
     *    相手が自動チェックを断っただけ（403・429・503 など）で、
     *    ブラウザでは普通に開けるものがほとんど。混ぜると誤報になる。
     *    lite-word.com の実測では、19件の「問題あり」のうち本当に切れていたのは2件だけだった。
     */
    function updateResultsSummary() {
        var stats = { ok: 0, redirect: 0, error: 0, unverified: 0, timeout: 0, skip: 0 };

        for (var url in checkResults) {
            var result = checkResults[url];
            if (result.status === 'ok') {
                stats.ok++;
            } else if (result.status === 'redirect') {
                stats.redirect++;
            } else if (result.status === 'unverified') {
                stats.unverified++;
            } else if (result.status === 'not_found' || result.status === 'client_error' || result.status === 'server_error' || result.status === 'error') {
                stats.error++;
            } else if (result.status === 'timeout') {
                stats.timeout++;
            } else if (result.status === 'skip' || result.status === 'blocked') {
                // blocked は「安全でない宛先なので送らなかった」＝ 実際には叩いていない
                stats.skip++;
            }
        }

        $('#lw-check-ok').text(stats.ok);
        $('#lw-check-redirect').text(stats.redirect);
        $('#lw-check-error').text(stats.error);
        $('#lw-check-unverified').text(stats.unverified);
        $('#lw-check-timeout').text(stats.timeout);
        $('#lw-check-skip').text(stats.skip);
    }

    // テーブル内のリンクにステータスを表示
    function updateLinkStatusInTable() {
        $('.lw-href-value').each(function() {
            var $href = $(this);
            var url = $href.text();

            // 既存のステータスバッジを削除
            $href.siblings('.lw-link-status').remove();

            if (checkResults[url]) {
                var result = checkResults[url];
                $href.after(getStatusBadge(result.status, result.status_code));
            }
        });
    }

    // チェック終了時の後始末
    function finishCheck(message) {
        isChecking = false;
        $('#lw-start-check').prop('disabled', false).find('.lw-check-btn-text').text('リンク有効性をチェック');
        $('#lw-stop-check').prop('disabled', false).hide();
        $('#lw-progress-text').text(message);
        updateResultsSummary();
        updateLinkStatusInTable();
    }

    /**
     * バッチチェック実行。
     *
     * 🚨 URL はクライアントから送らない（offset だけ）。
     *    叩く相手はサーバーが DB から組み立てる。詳しくは ajax/check.php の冒頭。
     */
    function runBatchCheck(offset, total) {
        if (checkAborted) {
            finishCheck('チェックを中止しました');
            return;
        }

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: lwData('lw_link_list_check_batch', { offset: offset }),
            success: function(response) {
                if (!response.success) {
                    showError(response);
                    finishCheck('チェックを中断しました');
                    return;
                }

                (response.data.results || []).forEach(function(result) {
                    checkResults[result.url] = result;
                });

                var checked = response.data.checked || 0;
                var next = offset + checked;

                updateProgress(Math.min(next, total), total);
                updateResultsSummary();
                updateLinkStatusInTable();

                // checked が 0 なら offset が進まない＝呼び続けても終わらないので必ず止める
                if (response.data.done || checked === 0) {
                    finishCheck('チェック完了!');
                    return;
                }

                runBatchCheck(next, total);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                finishCheck('通信エラーでチェックを中断しました');
            }
        });
    }

    // チェック開始
    $('#lw-start-check').on('click', function() {
        if (isChecking) return;

        var $btn = $(this);
        $btn.prop('disabled', true).find('.lw-check-btn-text').text('準備中...');

        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: lwData('lw_link_list_check_start'),
            success: function(response) {
                if (!response.success) {
                    showError(response);
                    $btn.prop('disabled', false).find('.lw-check-btn-text').text('リンク有効性をチェック');
                    return;
                }

                var total = response.data.total || 0;

                if (total === 0) {
                    alert('チェック対象のURLがありません。先に「リンクを調べる」を実行してください。');
                    $btn.prop('disabled', false).find('.lw-check-btn-text').text('リンク有効性をチェック');
                    return;
                }

                // 初期化
                checkResults = {};
                isChecking = true;
                checkAborted = false;

                // UI更新
                $btn.find('.lw-check-btn-text').text('チェック中...');
                $('#lw-stop-check').show();
                $('#lw-check-progress').show();
                $('#lw-check-results-summary').show();
                updateProgress(0, total);

                // 結果サマリーリセット
                $('#lw-check-ok, #lw-check-redirect, #lw-check-error, #lw-check-unverified, #lw-check-timeout, #lw-check-skip').text('0');

                runBatchCheck(0, total);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                alert('通信エラーが発生しました。');
                $btn.prop('disabled', false).find('.lw-check-btn-text').text('リンク有効性をチェック');
            }
        });
    });

    // チェック中止
    $('#lw-stop-check').on('click', function() {
        checkAborted = true;
        $(this).prop('disabled', true).text('中止中...');
    });

    // ========================================
    // インライン編集機能
    // ========================================

    // 編集ボタンクリック
    $(document).on('click', '.lw-edit-btn', function(e) {
        e.stopPropagation();

        var $row = $(this).closest('.lw-link-row');
        var $hrefCell = $row.find('.column-href');
        var $actionCell = $row.find('.column-action');

        // 既に編集中の行があればキャンセル
        $('.lw-link-row.editing').each(function() {
            cancelEdit($(this));
        });

        // 現在の値を取得
        var currentHref = $row.data('href') || '';

        // 編集モードに切り替え
        $row.addClass('editing');

        // href表示を入力フォームに置換
        var $display = $hrefCell.find('.lw-href-display');
        $display.hide();

        var formHtml = '<div class="lw-edit-form">' +
            '<input type="text" class="lw-edit-input" value="' + escapeHtml(currentHref) + '" placeholder="URLを入力">' +
            '</div>';
        $hrefCell.append(formHtml);

        // 操作ボタンを保存/キャンセルに置換
        $actionCell.html(
            '<button type="button" class="lw-save-btn">保存</button> ' +
            '<button type="button" class="lw-cancel-btn">取消</button>'
        );

        // 入力欄にフォーカス
        $hrefCell.find('.lw-edit-input').focus().select();
    });

    // 編集キャンセル
    function cancelEdit($row) {
        $row.removeClass('editing');
        $row.find('.lw-edit-form').remove();
        $row.find('.lw-href-display').show();
        $row.find('.column-action').html('<button type="button" class="lw-edit-btn">編集</button>');
    }

    // キャンセルボタンクリック
    $(document).on('click', '.lw-cancel-btn', function(e) {
        e.stopPropagation();
        var $row = $(this).closest('.lw-link-row');
        cancelEdit($row);
    });

    // 保存ボタンクリック
    $(document).on('click', '.lw-save-btn', function(e) {
        e.stopPropagation();

        var $btn = $(this);
        var $row = $btn.closest('.lw-link-row');
        var $actionCell = $row.find('.column-action');
        var $input = $row.find('.lw-edit-input');

        var postId = $row.data('post-id');
        var oldHref = $row.data('href') || '';
        var newHref = $input.val();
        // 0 を || で潰さない。未設定は「特定できない」を意味する -1 に寄せる
        var rawIndex = $row.data('link-index');
        var linkIndex = (rawIndex === undefined || rawIndex === null || rawIndex === '')
            ? -1
            : parseInt(rawIndex, 10);

        // 変更がない場合
        if (oldHref === newHref) {
            cancelEdit($row);
            return;
        }

        // 保存中の表示
        $btn.prop('disabled', true);
        $actionCell.find('.lw-cancel-btn').prop('disabled', true);
        $actionCell.append('<span class="lw-edit-saving"> 保存中...</span>');

        // AJAX送信
        $.ajax({
            url: cfg.ajaxUrl,
            type: 'POST',
            data: lwData('lw_link_list_update_href', {
                post_id: postId,
                new_href: newHref,
                link_index: linkIndex
            }),
            success: function(response) {
                if (response.success) {
                    // 成功 - 表示を更新
                    $row.data('href', newHref);

                    // href表示を更新
                    var newHrefDisplay = newHref ?
                        '<span class="lw-href-value">' + escapeHtml(newHref) + '</span>' :
                        '<span class="lw-href-value empty">(空 - href未設定)</span>';

                    // 警告マークを再計算
                    var warningMark = '';
                    if (newHref && /^#/.test(newHref)) {
                        var anchorId = newHref.replace(/^#+/, '').trim();
                        if (anchorId === '' || /^\s*$/.test(anchorId) || /^#/.test(anchorId)) {
                            warningMark = '<span class="lw-link-warning" title="有効なアンカーID（#の後の文字列）が設定されていません。">▲</span>' +
                                '<span class="lw-link-warning-badge">無効</span>';
                        }
                    }

                    $row.find('.lw-href-display').html(newHrefDisplay + warningMark);

                    // 種別を更新
                    var newType = getLinkType(newHref);
                    $row.find('.column-type').html(getTypeLabel(newType));

                    // 編集モード終了
                    cancelEdit($row);

                    // 成功メッセージ（一時表示）
                    $row.find('.column-action').append('<span class="lw-edit-success"> ✓</span>');
                    setTimeout(function() {
                        $row.find('.lw-edit-success').fadeOut(function() {
                            $(this).remove();
                        });
                    }, 2000);

                    // メモリ上のallLinksも更新
                    allLinks.forEach(function(link) {
                        if (link.source_id == postId && link.href === oldHref && link.text === linkText) {
                            link.href = newHref;
                        }
                    });

                } else {
                    // エラー
                    $actionCell.find('.lw-edit-saving').remove();
                    $actionCell.append('<span class="lw-edit-error"> ' + (response.data.message || 'エラー') + '</span>');
                    $btn.prop('disabled', false);
                    $actionCell.find('.lw-cancel-btn').prop('disabled', false);

                    setTimeout(function() {
                        $actionCell.find('.lw-edit-error').fadeOut(function() {
                            $(this).remove();
                        });
                    }, 3000);
                }
            },
            error: function(xhr, status, error) {
                $actionCell.find('.lw-edit-saving').remove();
                $actionCell.append('<span class="lw-edit-error"> 通信エラー</span>');
                $btn.prop('disabled', false);
                $actionCell.find('.lw-cancel-btn').prop('disabled', false);

                setTimeout(function() {
                    $actionCell.find('.lw-edit-error').fadeOut(function() {
                        $(this).remove();
                    });
                }, 3000);
            }
        });
    });

    // Enterキーで保存、Escapeキーでキャンセル
    $(document).on('keydown', '.lw-edit-input', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $(this).closest('.lw-link-row').find('.lw-save-btn').click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            var $row = $(this).closest('.lw-link-row');
            cancelEdit($row);
        }
    });

    /**
     * しっかりスキャン（link-list-crawl.js）から使う口。
     *
     * 🚨 ここに載っていないものを外から触らないこと。
     *    この closure の中身は外から見えないので、必要な関数はここに足してから使う。
     *    ぶら下げる先を window ではなくこのオブジェクトに限っているのは、
     *    管理画面の他のスクリプトと名前がぶつからないようにするため。
     */
    window.lwLinkListApi = {
        lwData: lwData,
        showError: showError,
        escapeHtml: escapeHtml,
        afterScanCompleted: afterScanCompleted,
        setScanButtonsDisabled: setScanButtonsDisabled
    };
});
