<!-- wp:wdl/lw-post-list-2 -->
<div class="wp-block-wdl-lw-post-list-2"><div class="filter" style="background:var(--color-main)"></div><div class="lw_post-list-2" data-number="6" data-category="" data-type="post" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="var(--color-main)" data-title-font="Noto Sans JP" data-title-font-weight="400" data-p-font="Noto Sans JP" data-p-font-weight="400"><ul class="post-list-2__wrap"></ul></div><script>
                        document.addEventListener('DOMContentLoaded', () => {
                            const postList2Container = document.querySelector('.lw_post-list-2');
                            
                            if (postList2Container) {
                                const postList2NumberOfPosts = postList2Container.getAttribute('data-number') || 4;
                                const postList2CategoryId = postList2Container.getAttribute('data-category');
                                const postList2PostType = postList2Container.getAttribute('data-type') || 'post';

                                const postList2DateFont = postList2Container.getAttribute('data-date-font');
                                const postList2DateFontWeight = postList2Container.getAttribute('data-date-font-weight');
                                const postList2CatFont = postList2Container.getAttribute('data-cat-font');
                                const postList2CatFontWeight = postList2Container.getAttribute('data-cat-font-weight');
                                const postList2CatBgColor = postList2Container.getAttribute('data-cat-bg-color');
                                const postList2TitleFont = postList2Container.getAttribute('data-title-font');
                                const postList2TitleFontWeight = postList2Container.getAttribute('data-title-font-weight');
                                const postList2PFont = postList2Container.getAttribute('data-p-font');
                                const postList2PFontWeight = postList2Container.getAttribute('data-p-font-weight');

                                let postList2ApiUrl = `${MyThemeSettings.home_Url}/wp-json/wp/v2/${postList2PostType === 'post' ? 'posts' : postList2PostType}?per_page=${postList2NumberOfPosts}&orderby=date&order=desc&_embed`;
                                if (postList2CategoryId) {
                                    postList2ApiUrl += `&categories=${postList2CategoryId}`;
                                }

                                fetch(postList2ApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('投稿の取得に失敗しました');
                                        }
                                        return response.json();
                                    })
                                    .then(posts => {
                                        let postList2Html = '<ul class="post-list-2__wrap">';

                                        posts.forEach(post => {
                                            const postList2Date = new Date(post.date).toLocaleDateString();
                                            const postList2Title = post.title.rendered;
                                            const postList2Link = post.link;
                                            const postList2Category = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
                                                ? post._embedded['wp:term'][0][0].name
                                                : 'カテゴリーなし';
                                            const postList2Thumbnail = post._embedded && post._embedded['wp:featuredmedia']
                                                ? post._embedded['wp:featuredmedia'][0].source_url
                                                : `${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp`;
                                            const postList2Excerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            postList2Html += `
                                                <li>
                                                    <a href="${postList2Link}">
                                                        <figure><img loading="lazy" src="${postList2Thumbnail}" alt="${postList2Title}"></figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="cat" style="background-color: ${postList2CatBgColor}; font-weight: ${postList2CatFontWeight};" data-lw_font_set="${postList2CatFont}">
                                                                    <span>${postList2Category}</span>
                                                                </div>
                                                                <div class="date" style="font-weight: ${postList2DateFontWeight};" data-lw_font_set="${postList2DateFont}">
                                                                    <span>${postList2Date}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: ${postList2TitleFontWeight};" data-lw_font_set="${postList2TitleFont}">${postList2Title}</h3>
                                                            <p style="font-weight: ${postList2PFontWeight};" data-lw_font_set="${postList2PFont}">${postList2Excerpt}</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            `;
                                        });

                                        postList2Html += '</ul>';
                                        postList2Container.innerHTML = postList2Html;
                                    })
                                    .catch(error => {
                                        console.error('投稿を取得できませんでした:', error);
                                        postList2Container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
                                    });
                            }
                        });
                        </script></div>
<!-- /wp:wdl/lw-post-list-2 -->