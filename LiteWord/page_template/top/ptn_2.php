<!-- wp:wdl/fv-4 {"backgroundImage":"https://cdn.pixabay.com/photo/2016/06/29/04/39/bride-1486004_1280.jpg","mainTitle":"\u003cspan data-lw_font_set=\u0022Noto Serif JP\u0022 class=\u0022custom-font-settings custom-font-settings fw-500\u0022\u003ePhoto Miki\u003c/span\u003e","subTitle":"一生に一度を綺麗に残す","description":"キャリア30年 | ウェディング撮影専門\u003cbr\u003e撮影からメイクまで一貫してお任せください！","filterBackgroundColor":"#000000","filterOpacity":0.35} -->
<div class="wp-block-wdl-fv-4 fv-4 min-h-pc-480px min-h-tb-400px min-h-sp-360px"><div class="fv-4_inner pc_left sp_left" style="max-width:1040px"><h1 style="color:#fff"><span class="sub" style="color:#fff">一生に一度を綺麗に残す</span><span class="main" style="color:#fff"><span data-lw_font_set="Noto Serif JP" class="custom-font-settings custom-font-settings fw-500">Photo Miki</span></span></h1><p style="color:#fff">キャリア30年 | ウェディング撮影専門<br>撮影からメイクまで一貫してお任せください！</p></div><div class="filter" style="background-color:#000000;opacity:0.35"></div><picture class="bg_image"><source srcset="" media="(max-width: 800px)"/><source srcset="https://cdn.pixabay.com/photo/2016/06/29/04/39/bride-1486004_1280.jpg" media="(min-width: 801px)"/><img src="https://cdn.pixabay.com/photo/2016/06/29/04/39/bride-1486004_1280.jpg" alt="背景画像" loading="eager" fetchpriority="high"/></picture></div>
<!-- /wp:wdl/fv-4 -->

<!-- wp:wdl/custom-title-5 {"subTitle":"お知らせ","mainTitle":"\u003cspan data-lw_font_set=\u0022Noto Serif JP\u0022 class=\u0022custom-font-settings custom-font-settings fw-500\u0022\u003eNews\u003c/span\u003e"} -->
<h2 class="wp-block-wdl-custom-title-5 custom-title-5" style="border-color:var(--color-main)"><span class="sub" style="color:var(--color-main)">お知らせ</span><span class="main"><span data-lw_font_set="Noto Serif JP" class="custom-font-settings custom-font-settings fw-500">News</span></span></h2>
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

<!-- wp:wdl/lw-space-1 {"pcHeight":48,"tbHeight":24,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:48px"></div><div class="tb" style="height:24px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-1 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fw-500\u0022 data-lw_font_set=\u0022Noto Serif JP\u0022\u003eConsept\u003c/span\u003e","subTitle":"コンセプト"} -->
<h2 class="wp-block-wdl-custom-title-1 custom-title-1"><span class="main"><span class="custom-font-settings custom-font-settings fw-500" data-lw_font_set="Noto Serif JP">Consept</span></span><span class="sub">コンセプト</span></h2>
<!-- /wp:wdl/custom-title-1 -->

<!-- wp:wdl/lw-gallery-01 {"text_1":"「Photo Miki」は、人生で最も特別な瞬間を、鮮やかに、\u003cbr\u003eそして美しく永遠に残すことを使命としています。\u003cbr\u003e30年以上のキャリアを持つウェディング撮影のプロフェッショナルとして、お客様の想いや希望を丁寧に聞き取り、その瞬間を理想以上のかたちで表現します。","text_2":"撮影だけでなく、メイクやスタイリングまで一貫してお任せいただくことで、トータルで満足いただけるサービスを提供しています。\u003cbr\u003e挙式当日からリハーサル、前撮りや後撮りに至るまで、いつまでも色褪せない写真を創り出すため、細部にこだわり抜き、光と影を活かした一瞬を丁寧に捉えます。\u003cbr\u003e「Photo Miki」の作品は、ただの記録写真ではなく、お二人の物語を映し出す芸術です。\u003cbr\u003e結婚式という一生に一度の舞台で、かけがえのない瞬間を形にして残したいと願うお二人に、最高のフォトグラフィー体験をお届けします。","maxWidthText":840,"maxWidth":1000} -->
<nav class="wp-block-wdl-lw-gallery-01 lw-gallery-01"><p class="center_pc left_sp" style="max-width:840px">「Photo Miki」は、人生で最も特別な瞬間を、鮮やかに、<br>そして美しく永遠に残すことを使命としています。<br>30年以上のキャリアを持つウェディング撮影のプロフェッショナルとして、お客様の想いや希望を丁寧に聞き取り、その瞬間を理想以上のかたちで表現します。</p><ul class="lw-gallery-01__wrap" style="max-width:1000px"><li><img src="https://picsum.photos/1000/1000?random=1" alt=""/></li><li><img src="https://picsum.photos/1000/1000?random=2" alt=""/></li><li><img src="https://picsum.photos/1000/1000?random=3" alt=""/></li></ul><p class="center_pc left_sp" style="max-width:840px">撮影だけでなく、メイクやスタイリングまで一貫してお任せいただくことで、トータルで満足いただけるサービスを提供しています。<br>挙式当日からリハーサル、前撮りや後撮りに至るまで、いつまでも色褪せない写真を創り出すため、細部にこだわり抜き、光と影を活かした一瞬を丁寧に捉えます。<br>「Photo Miki」の作品は、ただの記録写真ではなく、お二人の物語を映し出す芸術です。<br>結婚式という一生に一度の舞台で、かけがえのない瞬間を形にして残したいと願うお二人に、最高のフォトグラフィー体験をお届けします。</p></nav>
<!-- /wp:wdl/lw-gallery-01 -->

<!-- wp:wdl/lw-button-02 {"btnText":"お申込み・ご相談はこちら"} -->
<div class="wp-block-wdl-lw-button-02 lw-button-02"><div class="a_inner" style="border-width:0px;border-color:var(--color-main);border-style:solid"><a href="" target="_self" style="color:#ffffff;font-weight:400" data-lw_font_set="">お申込み・ご相談はこちら</a><div class="icon-svg" style="fill:#ffffff"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg></div><div class="a_background" style="background:var(--color-main)"></div></div></div>
<!-- /wp:wdl/lw-button-02 -->

<!-- wp:wdl/lw-space-1 {"pcHeight":48,"tbHeight":24,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:48px"></div><div class="tb" style="height:24px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-1 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fw-500\u0022 data-lw_font_set=\u0022Noto Serif JP\u0022\u003eGallery\u003c/span\u003e","subTitle":"写真集"} -->
<h2 class="wp-block-wdl-custom-title-1 custom-title-1"><span class="main"><span class="custom-font-settings custom-font-settings fw-500" data-lw_font_set="Noto Serif JP">Gallery</span></span><span class="sub">写真集</span></h2>
<!-- /wp:wdl/custom-title-1 -->

<!-- wp:gallery {"linkTo":"none"} -->
<figure class="wp-block-gallery has-nested-images columns-default is-cropped"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://plus.unsplash.com/premium_photo-1661293843302-3ef4ea0b3961?q=80&amp;w=2070&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1504993945773-3f38e1b6a626?q=80&amp;w=2070&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&amp;w=2070&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&amp;w=2069&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1508407576665-2d9a5d638a7e?q=80&amp;w=2072&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?q=80&amp;w=2070&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->

<!-- wp:wdl/lw-space-1 {"pcHeight":48,"tbHeight":24,"spHeight":16} -->
<div class="wp-block-wdl-lw-space-1 lw_space_1"><div class="pc" style="height:48px"></div><div class="tb" style="height:24px"></div><div class="sp" style="height:16px"></div></div>
<!-- /wp:wdl/lw-space-1 -->

<!-- wp:wdl/custom-title-1 {"mainTitle":"\u003cspan class=\u0022custom-font-settings custom-font-settings fw-500\u0022 data-lw_font_set=\u0022Noto Serif JP\u0022\u003eBlog\u003c/span\u003e","subTitle":"ブログ"} -->
<h2 class="wp-block-wdl-custom-title-1 custom-title-1"><span class="main"><span class="custom-font-settings custom-font-settings fw-500" data-lw_font_set="Noto Serif JP">Blog</span></span><span class="sub">ブログ</span></h2>
<!-- /wp:wdl/custom-title-1 -->

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