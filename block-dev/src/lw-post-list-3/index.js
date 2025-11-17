import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ColorPalette, RangeControl, TextControl, SelectControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/lw-post-list-3', {
    title: '投稿一覧 3',
    icon: 'editor-ul',
    category: 'liteword-other',
    supports: {
        anchor: true, 
    },
    attributes: {
        numberOfPosts: { type: 'number', default: 6 },
        categoryId: { type: 'string', default: '' },
        postType: { type: 'string', default: 'post' },
        dateFont: { type: 'string', default: 'Noto Sans JP' },
        dateFontWeight: { type: 'string', default: '400' },
        catFont: { type: 'string', default: 'Noto Sans JP' },
        catFontWeight: { type: 'string', default: '400' },
        catBgColor: { type: 'string', default: 'var(--color-main)' },
        titleFont: { type: 'string', default: 'Noto Sans JP' },
        titleFontWeight: { type: 'string', default: '400' },
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight, 
            catBgColor,
        } = attributes;

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="設定" initialOpen={true}>
                        <RangeControl
                            label="出力数"
                            value={numberOfPosts}
                            onChange={(value) => setAttributes({ numberOfPosts: value })}
                            min={1}
                            max={20}
                        />
                        <TextControl
                            label="カテゴリID"
                            value={categoryId}
                            onChange={(value) => setAttributes({ categoryId: value })}
                            help="特定のカテゴリを指定（空欄の場合は全カテゴリ）"
                        />
                        <TextControl
                            label="投稿タイプ"
                            value={postType}
                            onChange={(value) => setAttributes({ postType: value })}
                            help="投稿タイプを指定（例: post, page, custom_post_type）"
                        />
                        <ColorPalette
                            label="メインカラー"
                            value={catBgColor}
                            onChange={(newColor) => setAttributes({ catBgColor: newColor })}
                        />
                    </PanelBody>
                    <PanelBody title="フォント設定">
                        <SelectControl
                            label="日付のフォント"
                            value={dateFont}
                            options={fontOptions}
                            onChange={(newFont) => setAttributes({ dateFont: newFont })}
                        />
                        <SelectControl
                            label="日付のフォント太さ"
                            value={dateFontWeight}
                            options={fontWeightOptions}
                            onChange={(newWeight) => setAttributes({ dateFontWeight: newWeight })}
                        />
                        <SelectControl
                            label="カテゴリーのフォント"
                            value={catFont}
                            options={fontOptions}
                            onChange={(newFont) => setAttributes({ catFont: newFont })}
                        />
                        <SelectControl
                            label="カテゴリーのフォント太さ"
                            value={catFontWeight}
                            options={fontWeightOptions}
                            onChange={(newWeight) => setAttributes({ catFontWeight: newWeight })}
                        />
                        <SelectControl
                            label="タイトルのフォント"
                            value={titleFont}
                            options={fontOptions}
                            onChange={(newFont) => setAttributes({ titleFont: newFont })}
                        />
                        <SelectControl
                            label="タイトルのフォント太さ"
                            value={titleFontWeight}
                            options={fontWeightOptions}
                            onChange={(newWeight) => setAttributes({ titleFontWeight: newWeight })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="lw_post-list-3">
                    <ul className="post-list-3__wrap">
                        {Array.from({ length: numberOfPosts }).map((_, index) => (
                            <li key={index}>
                                <a href="#">
                                    <figure><img loading="lazy" src={`https://picsum.photos/1000/1000?random=${index}`}/></figure>
                                    <div className="in">
                                        <div className="data">
                                            <div
                                                className="cat"
                                                style={{
                                                    backgroundColor: catBgColor,
                                                    fontWeight: catFontWeight,
                                                }}
                                                data-lw_font_set={catFont}
                                            >
                                                <span>カテゴリー</span>
                                            </div>
                                            <div
                                                className="date"
                                                style={{ fontWeight: dateFontWeight }}
                                                data-lw_font_set={dateFont}
                                            >
                                                <span>2020/10/10</span>
                                            </div>
                                        </div>
                                        <h3
                                            style={{ fontWeight: titleFontWeight }}
                                            data-lw_font_set={titleFont}
                                        >
                                            サンプル投稿タイトルです。
                                        </h3>

                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="editor_in_filter" style={{background:catBgColor}}></div>
            </div>
        );
    },
    save: ({ attributes }) => {
        const {
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight, 
            catBgColor,
        } = attributes;

        return (
            <div>
                <div className="filter" style={{background:catBgColor}}></div>
                <div
                    className="lw_post-list-3"
                    data-number={numberOfPosts}
                    data-category={categoryId}
                    data-type={postType}
                    data-date-font={dateFont}
                    data-date-font-weight={dateFontWeight}
                    data-cat-font={catFont}
                    data-cat-font-weight={catFontWeight}
                    data-cat-bg-color={catBgColor}
                    data-title-font={titleFont}
                    data-title-font-weight={titleFontWeight}
                >
                    <ul className="post-list-3__wrap"></ul>
                </div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
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

                                let postListThreeApiUrl = \`\${MyThemeSettings.home_Url}/wp-json/wp/v2/\${postListThreePostType === 'post' ? 'posts' : postListThreePostType}?per_page=\${postListThreeNumberOfPosts}&orderby=date&order=desc&_embed\`;
                                if (postListThreeCategoryId) {
                                    postListThreeApiUrl += \`&categories=\${postListThreeCategoryId}\`;
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
                                                : \`\${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp\`;
                                            const postListThreeExcerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            postListThreeHtml += \`
                                                <li>
                                                    <a href="\${postListThreeLink}">
                                                        <figure><img loading="lazy" src="\${postListThreeThumbnail}" alt="\${postListThreeTitle}"></figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="cat" style="background-color: \${postListThreeCatBgColor}; font-weight: \${postListThreeCatFontWeight};" data-lw_font_set="\${postListThreeCatFont}">
                                                                    <span>\${postListThreeCategory}</span>
                                                                </div>
                                                                <div class="date" style="font-weight: \${postListThreeDateFontWeight};" data-lw_font_set="\${postListThreeDateFont}">
                                                                    <span>\${postListThreeDate}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: \${postListThreeTitleFontWeight};" data-lw_font_set="\${postListThreeTitleFont}">\${postListThreeTitle}</h3>
                                                    
                                                        </div>
                                                    </a>
                                                </li>
                                            \`;
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
                        `,
                    }}
                />
            </div>
        );
    },
});