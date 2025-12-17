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
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight, catBgColor,
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
                        <ColorPalette
                            label="カテゴリーの背景色"
                            value={catBgColor}
                            onChange={(newColor) => setAttributes({ catBgColor: newColor })}
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

                <div className="news-list-1">
                    <ul className="news-list-1__wrap">
                        {Array.from({ length: numberOfPosts }).map((_, index) => (
                            <li key={index}>
                                <a href="#">
                                    <div className="data">
                                        <div
                                            className="date"
                                            style={{ fontWeight: dateFontWeight }}
                                            data-lw_font_set={dateFont}
                                        >
                                            <span>2020/10/10</span>
                                        </div>
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
                                    </div>
                                    <div className="post_title">
                                        <h3
                                            style={{ fontWeight: titleFontWeight }}
                                            data-lw_font_set={titleFont}
                                        >
                                            サンプル投稿タイトルです。サンプル投稿タイトルです。
                                        </h3>
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
        const {
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight, catBgColor,
        } = attributes;

        return (
            <div>
                <div
                    className="news-list-1"
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
                    <ul className="news-list-1__wrap"></ul>
                </div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
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

                                let newsList1ApiUrl = \`\${MyThemeSettings.home_Url}/wp-json/wp/v2/\${newsList1PostType === 'post' ? 'posts' : newsList1PostType}?per_page=\${newsList1NumberOfPosts}&orderby=date&order=desc&_embed\`;
                                if (newsList1CategoryId) {
                                    newsList1ApiUrl += \`&categories=\${newsList1CategoryId}\`;
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

                                            newsList1Html += \`
                                                <li>
                                                    <a href="\${newsList1Link}">
                                                        <div class="data">
                                                            <div class="date" style="font-weight: \${newsList1DateFontWeight};" data-lw_font_set="\${newsList1DateFont}">
                                                                <span>\${newsList1Date}</span>
                                                            </div>
                                                            <div class="cat" style="background-color: \${newsList1CatBgColor}; font-weight: \${newsList1CatFontWeight};" data-lw_font_set="\${newsList1CatFont}">
                                                                <span>\${newsList1Category}</span>
                                                            </div>
                                                        </div>
                                                        <div class="post_title">
                                                            <h3 style="font-weight: \${newsList1TitleFontWeight};" data-lw_font_set="\${newsList1TitleFont}">\${newsList1Title}</h3>
                                                        </div>
                                                    </a>
                                                </li>
                                            \`;
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
                        `,
                    }}
                />
            </div>
        );
    },
});
