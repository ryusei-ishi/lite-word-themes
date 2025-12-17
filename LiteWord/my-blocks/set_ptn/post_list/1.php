<!-- wp:wdl/custom-title-5 {"subTitle":"お知らせ","mainTitle":"NEWS"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">お知らせ</span><span class="main">NEWS</span></h2>
<!-- /wp:wdl/custom-title-5 -->

<!-- wp:wdl/lw-news-list-1 -->
<div class="wp-block-wdl-lw-news-list-1"><div class="news-list-1" data-number="4" data-category="" data-type="post" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="var(--color-main)" data-title-font="Noto Sans JP" data-title-font-weight="400"><ul class="news-list-1__wrap"></ul></div><script>
                        document.addEventListener('DOMContentLoaded', () => {
                            const newsList1Container = document.querySelector('.news-list-1');
                            
                            if (newsList1Container) {
                                const newsList1NumberOfPosts = newsList1Container.getAttribute('data-number') || 4;
                                const newsList1CategoryId = newsList1Container.getAttribute('data-category');
                                const newsList1PostType = newsList1Container.getAttribute('data-type') || 'post';

                                const newsList1DateFont = newsList1Container.getAttribute('data-date-font');
                                const newsList1DateFontWeight = newsList1Container.getAttribute('data-date-font-weight');
                                const newsList1CatFont = newsList1Container.getAttribute('data-cat-font');
                                const newsList1CatFontWeight = newsList1Container.getAttribute('data-cat-font-weight');
                                const newsList1CatBgColor = newsList1Container.getAttribute('data-cat-bg-color');
                                const newsList1TitleFont = newsList1Container.getAttribute('data-title-font');
                                const newsList1TitleFontWeight = newsList1Container.getAttribute('data-title-font-weight');

                                let newsList1ApiUrl = `${MyThemeSettings.home_Url}/wp-json/wp/v2/${newsList1PostType === 'post' ? 'posts' : newsList1PostType}?per_page=${newsList1NumberOfPosts}&orderby=date&order=desc&_embed`;
                                if (newsList1CategoryId) {
                                    newsList1ApiUrl += `&categories=${newsList1CategoryId}`;
                                }

                                fetch(newsList1ApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('投稿の取得に失敗しました');
                                        }
                                        return response.json();
                                    })
                                    .then(posts => {
                                        let newsList1Html = '<ul class="news-list-1__wrap">';

                                        posts.forEach(post => {
                                            const newsList1Date = new Date(post.date).toLocaleDateString();
                                            const newsList1Title = post.title.rendered;
                                            const newsList1Link = post.link;
                                            const newsList1Category = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
                                                ? post._embedded['wp:term'][0][0].name
                                                : 'カテゴリーなし';

                                            newsList1Html += `
                                                <li>
                                                    <a href="${newsList1Link}">
                                                        <div class="data">
                                                            <div class="date" style="font-weight: ${newsList1DateFontWeight};" data-lw_font_set="${newsList1DateFont}">
                                                                <span>${newsList1Date}</span>
                                                            </div>
                                                            <div class="cat" style="background-color: ${newsList1CatBgColor}; font-weight: ${newsList1CatFontWeight};" data-lw_font_set="${newsList1CatFont}">
                                                                <span>${newsList1Category}</span>
                                                            </div>
                                                        </div>
                                                        <div class="post_title">
                                                            <h3 style="font-weight: ${newsList1TitleFontWeight};" data-lw_font_set="${newsList1TitleFont}">${newsList1Title}</h3>
                                                        </div>
                                                    </a>
                                                </li>
                                            `;
                                        });

                                        newsList1Html += '</ul>';
                                        newsList1Container.innerHTML = newsList1Html;
                                    })
                                    .catch(error => {
                                        console.error('投稿を取得できませんでした:', error);
                                        newsList1Container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
                                    });
                            }
                        });
                        </script></div>
<!-- /wp:wdl/lw-news-list-1 -->
