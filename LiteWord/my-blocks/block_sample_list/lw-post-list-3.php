<!-- wp:wdl/lw-post-list-3 -->
<div class="wp-block-wdl-lw-post-list-3"><div class="filter" style="background:var(--color-main)"></div><div class="lw_post-list-3" data-number="6" data-category="" data-type="post" data-date-font="Noto Sans JP" data-date-font-weight="400" data-cat-font="Noto Sans JP" data-cat-font-weight="400" data-cat-bg-color="var(--color-main)" data-title-font="Noto Sans JP" data-title-font-weight="400"><ul class="post-list-3__wrap"></ul></div><script>
                        document.addEventListener('DOMContentLoaded', () => {
                            const postListThreeContainer = document.querySelector('.lw_post-list-3');
                            
                            if (postListThreeContainer) {
                                const postListThreeNumberOfPosts = postListThreeContainer.getAttribute('data-number') || 4;
                                const postListThreeCategoryId = postListThreeContainer.getAttribute('data-category');
                                const postListThreePostType = postListThreeContainer.getAttribute('data-type') || 'post';

                                const postListThreeDateFont = postListThreeContainer.getAttribute('data-date-font');
                                const postListThreeDateFontWeight = postListThreeContainer.getAttribute('data-date-font-weight');
                                const postListThreeCatFont = postListThreeContainer.getAttribute('data-cat-font');
                                const postListThreeCatFontWeight = postListThreeContainer.getAttribute('data-cat-font-weight');
                                const postListThreeCatBgColor = postListThreeContainer.getAttribute('data-cat-bg-color');
                                const postListThreeTitleFont = postListThreeContainer.getAttribute('data-title-font');
                                const postListThreeTitleFontWeight = postListThreeContainer.getAttribute('data-title-font-weight');

                                let postListThreeApiUrl = `${MyThemeSettings.home_Url}/wp-json/wp/v2/${postListThreePostType === 'post' ? 'posts' : postListThreePostType}?per_page=${postListThreeNumberOfPosts}&orderby=date&order=desc&_embed`;
                                if (postListThreeCategoryId) {
                                    postListThreeApiUrl += `&categories=${postListThreeCategoryId}`;
                                }

                                fetch(postListThreeApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('投稿の取得に失敗しました');
                                        }
                                        return response.json();
                                    })
                                    .then(posts => {
                                        let postListThreeHtml = '<ul class="post-list-3__wrap">';

                                        posts.forEach(post => {
                                            const postListThreeDate = new Date(post.date).toLocaleDateString();
                                            const postListThreeTitle = post.title.rendered;
                                            const postListThreeLink = post.link;
                                            const postListThreeCategory = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
                                                ? post._embedded['wp:term'][0][0].name
                                                : 'カテゴリーなし';
                                            const postListThreeThumbnail = post._embedded && post._embedded['wp:featuredmedia']
                                                ? post._embedded['wp:featuredmedia'][0].source_url
                                                : `${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp`;
                                            const postListThreeExcerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            postListThreeHtml += `
                                                <li>
                                                    <a href="${postListThreeLink}">
                                                        <figure><img loading="lazy" src="${postListThreeThumbnail}" alt="${postListThreeTitle}"></figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="cat" style="background-color: ${postListThreeCatBgColor}; font-weight: ${postListThreeCatFontWeight};" data-lw_font_set="${postListThreeCatFont}">
                                                                    <span>${postListThreeCategory}</span>
                                                                </div>
                                                                <div class="date" style="font-weight: ${postListThreeDateFontWeight};" data-lw_font_set="${postListThreeDateFont}">
                                                                    <span>${postListThreeDate}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: ${postListThreeTitleFontWeight};" data-lw_font_set="${postListThreeTitleFont}">${postListThreeTitle}</h3>
                                                    
                                                        </div>
                                                    </a>
                                                </li>
                                            `;
                                        });

                                        postListThreeHtml += '</ul>';
                                        postListThreeContainer.innerHTML = postListThreeHtml;
                                    })
                                    .catch(error => {
                                        console.error('投稿を取得できませんでした:', error);
                                        postListThreeContainer.innerHTML = '<p>投稿を読み込めませんでした。</p>';
                                    });
                            }
                        });
                        </script></div>
<!-- /wp:wdl/lw-post-list-3 -->