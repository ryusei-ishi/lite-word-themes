<!-- wp:wdl/lw-pr-post-list-4 -->
<div class="wp-block-wdl-lw-pr-post-list-4"><div class="filter"></div><div class="lw_pr-post-list-4" style="--lw-cols:3" data-number="6" data-category="" data-type="post" data-date-format="md_day" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="var(--color-main)" data-title-font="Noto Sans JP" data-title-font-weight="400"><ul class="pr-post-list-4__wrap"></ul></div><script>
document.addEventListener('DOMContentLoaded', function () {
    var settings = window.MyThemeSettings || {};
    var homeUrl = settings.home_Url || '';
    var themeUrl = settings.theme_Url || '';
    var weekLabels = ['日', '月', '火', '水', '木', '金', '土'];

    document.querySelectorAll('.lw_pr-post-list-4').forEach(function (container) {
        if (container.getAttribute('data-lw-loaded') === '1') {
            return;
        }
        container.setAttribute('data-lw-loaded', '1');

        var numberOfPosts = container.getAttribute('data-number') || 6;
        var categoryId = container.getAttribute('data-category');
        var postType = container.getAttribute('data-type') || 'post';
        var dateFormat = container.getAttribute('data-date-format') || 'md_day';
        var dateFont = container.getAttribute('data-date-font') || '';
        var dateFontWeight = container.getAttribute('data-date-font-weight') || '';
        var catFont = container.getAttribute('data-cat-font') || '';
        var catFontWeight = container.getAttribute('data-cat-font-weight') || '';
        var catBgColor = container.getAttribute('data-cat-bg-color') || '';
        var titleFont = container.getAttribute('data-title-font') || '';
        var titleFontWeight = container.getAttribute('data-title-font-weight') || '';

        var formatDate = function (value) {
            var d = new Date(value);
            if (isNaN(d.getTime())) {
                return '';
            }
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            var day = d.getDate();
            if (dateFormat === 'ymd') {
                return y + '/' + m + '/' + day;
            }
            if (dateFormat === 'ymd_dot') {
                return y + '.' + ('0' + m).slice(-2) + '.' + ('0' + day).slice(-2);
            }
            return m + '/' + day + ' (' + weekLabels[d.getDay()] + ')';
        };

        var toAttr = function (value) {
            return String(value).replace(/<[^>]+>/g, '').replace(/"/g, '&quot;');
        };

        // カテゴリー編集画面で設定した色（REST の lw_color）。
        // 色は style 属性に直接入れるので、#rrggbb 以外は捨てる
        var hexColor = function (value) {
            return typeof value === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : '';
        };

        var apiUrl = homeUrl + '/wp-json/wp/v2/' + (postType === 'post' ? 'posts' : postType)
            + '?per_page=' + numberOfPosts + '&orderby=date&order=desc&_embed';
        if (categoryId) {
            apiUrl += '&categories=' + categoryId;
        }

        fetch(apiUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('投稿の取得に失敗しました');
                }
                return response.json();
            })
            .then(function (posts) {
                var html = '<ul class="pr-post-list-4__wrap">';

                posts.forEach(function (post) {
                    var embedded = post._embedded || {};
                    var terms = embedded['wp:term'] && embedded['wp:term'][0];
                    var term = terms && terms.length ? terms[0] : null;
                    var category = term && term.name ? term.name : '';
                    // カテゴリーに色が設定されていればそれを、なければブロックの設定色を使う
                    var catColor = (term && hexColor(term.lw_color)) || catBgColor;
                    var media = embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0];
                    var thumbnail = media && media.source_url
                        ? media.source_url
                        : themeUrl + '/assets/image/no_image/2.webp';
                    var title = post.title && post.title.rendered ? post.title.rendered : '';

                    var catHtml = category
                        ? '<div class="cat" style="background-color:' + catColor + ';font-weight:' + catFontWeight + ';" data-lw_font_set="' + catFont + '"><span>' + category + '</span></div>'
                        : '';

                    html += '<li>'
                        + '<a href="' + post.link + '">'
                        + '<figure><img loading="lazy" src="' + thumbnail + '" alt="' + toAttr(title) + '"></figure>'
                        + '<div class="in">'
                        + '<div class="data">'
                        + '<div class="date" style="font-weight:' + dateFontWeight + ';" data-lw_font_set="' + dateFont + '"><span>' + formatDate(post.date) + '</span></div>'
                        + catHtml
                        + '</div>'
                        + '<h3 style="font-weight:' + titleFontWeight + ';" data-lw_font_set="' + titleFont + '">' + title + '</h3>'
                        + '</div>'
                        + '</a>'
                        + '</li>';
                });

                html += '</ul>';
                container.innerHTML = html;
            })
            .catch(function (error) {
                console.error('投稿を取得できませんでした:', error);
                container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
            });
    });
});
</script></div>
<!-- /wp:wdl/lw-pr-post-list-4 -->