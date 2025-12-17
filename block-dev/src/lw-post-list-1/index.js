import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ColorPalette, RangeControl, TextControl, SelectControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight,pFont, pFontWeight , catBgColor,
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
                    {/* フォント設定 */}
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

                <div className="lw_post-list-1">
                    <ul className="post-list-1__wrap">
                        {Array.from({ length: numberOfPosts }).map((_, index) => (
                            <li key={index}>
                                <a href="#">
                                    <figure><img loading="lazy" src={`https://picsum.photos/1000/1000?random=${index}`}/></figure>
                                    <div className="in">
                                        <div className="data">
                                            <div
                                                className="cat"
                                                style={{
                                                    color: catBgColor,
                                                    borderColor: catBgColor,
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
            </div>
        );
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save();
        const {
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight,
            pFont, pFontWeight,
            catBgColor,
        } = attributes;

        return (
            <div {...blockProps}>
                <div className="filter" style={{background:catBgColor}}></div>
                <div
                    className="lw_post-list-1"
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
                    
                </div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
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

                                let postList1ApiUrl = \`\${MyThemeSettings.home_Url}/wp-json/wp/v2/\${postList1PostType === 'post' ? 'posts' : postList1PostType}?per_page=\${postList1NumberOfPosts}&orderby=date&order=desc&_embed\`;
                                if (postList1CategoryId) {
                                    postList1ApiUrl += \`&categories=\${postList1CategoryId}\`;
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
                                                : \`\${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp\`;
                                            const postList1Excerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            postList1Html += \`
                                                <li>
                                                    <a href="\${postList1Link}">
                                                        <figure><img loading="lazy" src="\${postList1Thumbnail}" alt="\${postList1Title}"></figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="cat" style="border-color: \${postList1CatBgColor}; color:\${postList1CatBgColor}; font-weight: \${postList1CatFontWeight};" data-lw_font_set="\${postList1CatFont}">
                                                                    <span>\${postList1Category}</span>
                                                                </div>
                                                                <div class="date" style="font-weight: \${postList1DateFontWeight};" data-lw_font_set="\${postList1DateFont}">
                                                                    <span>\${postList1Date}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: \${postList1TitleFontWeight};" data-lw_font_set="\${postList1TitleFont}">\${postList1Title}</h3>
                                                            <p style="font-weight: \${postList1PFontWeight};" data-lw_font_set="\${postList1PFont}">\${postList1Excerpt}</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            \`;
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
                        `,
                    }}
                />
            </div>
        );
    },
});
