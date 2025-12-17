<!-- wp:wdl/lw-post-list-1 -->
<div class="wp-block-wdl-lw-post-list-1"><div class="filter" style="background:var(--color-main)"></div><div class="lw_post-list-1" data-number="6" data-category="" data-type="post" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="var(--color-main)" data-title-font="Noto Sans JP" data-title-font-weight="500" data-p-font="Noto Sans JP" data-p-font-weight="400"></div><script>
                        document.addEventListener('DOMContentLoaded', () => {
                            const postList1Container = document.querySelector('.lw_post-list-1');
                            
                            if (postList1Container) {
                                const postList1NumberOfPosts = postList1Container.getAttribute('data-number') || 4;
                                const postList1CategoryId = postList1Container.getAttribute('data-category');
                                const postList1PostType = postList1Container.getAttribute('data-type') || 'post';

                                const postList1DateFont = postList1Container.getAttribute('data-date-font');
                                const postList1DateFontWeight = postList1Container.getAttribute('data-date-font-weight');
                                const postList1CatFont = postList1Container.getAttribute('data-cat-font');
                                const postList1CatFontWeight = postList1Container.getAttribute('data-cat-font-weight');
                                const postList1CatBgColor = postList1Container.getAttribute('data-cat-bg-color');
                                const postList1TitleFont = postList1Container.getAttribute('data-title-font');
                                const postList1TitleFontWeight = postList1Container.getAttribute('data-title-font-weight');
                                const postList1PFont = postList1Container.getAttribute('data-p-font');
                                const postList1PFontWeight = postList1Container.getAttribute('data-p-font-weight');

                                let postList1ApiUrl = `${MyThemeSettings.home_Url}/wp-json/wp/v2/${postList1PostType === 'post' ? 'posts' : postList1PostType}?per_page=${postList1NumberOfPosts}&orderby=date&order=desc&_embed`;
                                if (postList1CategoryId) {
                                    postList1ApiUrl += `&categories=${postList1CategoryId}`;
                                }

                                fetch(postList1ApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('投稿の取得に失敗しました');
                                        }
                                        return response.json();
                                    })
                                    .then(posts => {
                                        let postList1Html = '<ul class="post-list-1__wrap">';

                                        posts.forEach(post => {
                                            const postList1Date = new Date(post.date).toLocaleDateString();
                                            const postList1Title = post.title.rendered;
                                            const postList1Link = post.link;
                                            const postList1Category = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
                                                ? post._embedded['wp:term'][0][0].name
                                                : 'カテゴリーなし';
                                            const postList1Thumbnail = post._embedded && post._embedded['wp:featuredmedia']
                                                ? post._embedded['wp:featuredmedia'][0].source_url
                                                : `${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp`;
                                            const postList1Excerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            postList1Html += `
                                                <li>
                                                    <a href="${postList1Link}">
                                                        <figure><img loading="lazy" src="${postList1Thumbnail}" alt="${postList1Title}"></figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="cat" style="border-color: ${postList1CatBgColor}; color:${postList1CatBgColor}; font-weight: ${postList1CatFontWeight};" data-lw_font_set="${postList1CatFont}">
                                                                    <span>${postList1Category}</span>
                                                                </div>
                                                                <div class="date" style="font-weight: ${postList1DateFontWeight};" data-lw_font_set="${postList1DateFont}">
                                                                    <span>${postList1Date}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: ${postList1TitleFontWeight};" data-lw_font_set="${postList1TitleFont}">${postList1Title}</h3>
                                                            <p style="font-weight: ${postList1PFontWeight};" data-lw_font_set="${postList1PFont}">${postList1Excerpt}</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            `;
                                        });

                                        postList1Html += '</ul>';
                                        postList1Container.innerHTML = postList1Html;
                                    })
                                    .catch(error => {
                                        console.error('投稿を取得できませんでした:', error);
                                        postList1Container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
                                    });
                            }
                        });
                        </script></div>
<!-- /wp:wdl/lw-post-list-1 -->