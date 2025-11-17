import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ColorPalette, RangeControl, TextControl, SelectControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/lw-post-list-2', {
    title: '投稿一覧 2',
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
        pFont: { type: 'string', default: 'Noto Sans JP' },
        pFontWeight: { type: 'string', default: '400' },
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight, 
            pFont, pFontWeight,
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
                        <SelectControl
                            label="抜粋のフォント"
                            value={pFont}
                            options={fontOptions}
                            onChange={(new_pFont) => setAttributes({ pFont: new_pFont })}
                        />
                        <SelectControl
                            label="抜粋のフォント太さ"
                            value={pFontWeight}
                            options={fontWeightOptions}
                            onChange={(new_pFontWeight) => setAttributes({ pFontWeight: new_pFontWeight })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="lw_post-list-2">
                    <ul className="post-list-2__wrap">
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
                                        <p
                                            style={{ fontWeight: pFontWeight }}
                                            data-lw_font_set={pFont}
                                        >
                                            投稿抜粋テキスト40文字程度投稿抜粋テキスト40文字程度投稿抜粋テキスト40文字
                                        </p>
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
            pFont, pFontWeight,
            catBgColor,
        } = attributes;

        return (
            <div>
                <div className="filter" style={{background:catBgColor}}></div>
                <div
                    className="lw_post-list-2"
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
                    data-p-font={pFont}
                    data-p-font-weight={pFontWeight}
                >
                    <ul className="post-list-2__wrap"></ul>
                    
                </div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
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

                                let postList2ApiUrl = \`\${MyThemeSettings.home_Url}/wp-json/wp/v2/\${postList2PostType === 'post' ? 'posts' : postList2PostType}?per_page=\${postList2NumberOfPosts}&orderby=date&order=desc&_embed\`;
                                if (postList2CategoryId) {
                                    postList2ApiUrl += \`&categories=\${postList2CategoryId}\`;
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
                                                : \`\${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp\`;
                                            const postList2Excerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            postList2Html += \`
                                                <li>
                                                    <a href="\${postList2Link}">
                                                        <figure><img loading="lazy" src="\${postList2Thumbnail}" alt="\${postList2Title}"></figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="cat" style="background-color: \${postList2CatBgColor}; font-weight: \${postList2CatFontWeight};" data-lw_font_set="\${postList2CatFont}">
                                                                    <span>\${postList2Category}</span>
                                                                </div>
                                                                <div class="date" style="font-weight: \${postList2DateFontWeight};" data-lw_font_set="\${postList2DateFont}">
                                                                    <span>\${postList2Date}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: \${postList2TitleFontWeight};" data-lw_font_set="\${postList2TitleFont}">\${postList2Title}</h3>
                                                            <p style="font-weight: \${postList2PFontWeight};" data-lw_font_set="\${postList2PFont}">\${postList2Excerpt}</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            \`;
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
                        `,
                    }}
                />
            </div>
        );
    },
});
