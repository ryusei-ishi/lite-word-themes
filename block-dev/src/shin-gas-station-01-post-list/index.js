import { registerBlockType } from '@wordpress/blocks';
import { RichText,URLInput,useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl,ColorPalette, RangeControl, TextControl, SelectControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    title: '投稿一覧 1 shin shop pattern 01',
    icon: 'editor-ul',
    category: 'lw-post',
    supports: {
        anchor: true,
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            titleMain, linkText, linkUrl,openInNewTab,
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight, 
            catBgColor,
        } = attributes;

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="設定" initialOpen={true}>
                        <p>リンク先URL</p>
                        <URLInput
                            value={linkUrl}
                            onChange={(url) => setAttributes({ linkUrl: url })}
                        />
                        <ToggleControl
                            label="新規タブで開く"
                            checked={openInNewTab}
                            onChange={() => setAttributes({ openInNewTab: !openInNewTab })}
                        />
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

                <div className="shin-gas-station-01-post-list">
                    <div className="head">
                        <div className="sen"></div>
                        <h2 className="title">
                            <RichText
                                tagName="span"
                                className="main"
                                value={titleMain}
                                onChange={(value) => setAttributes({ titleMain: value })}
                                placeholder="メインタイトルを入力"
                            />
                            <span className="sub" data-lw_font_set="Montserrat">Blog</span>
                        </h2>
                        <nav>
                            <div className="a">
                                <RichText
                                    className="text"
                                    tagName="span"
                                    value={linkText}
                                    onChange={(value) => setAttributes({ linkText: value })}
                                    placeholder="リンクテキストを入力"
                                />
                               <svg xmlns="http://www.w3.org/2000/svg" width="39.5" height="4.197" viewBox="0 0 39.5 4.197">
                                    <g id="グループ_16" data-name="グループ 16" transform="translate(-179.5 -2154.803)">
                                        <path id="パス_28" data-name="パス 28" d="M0,0,8,4.2H0Z" transform="translate(211 2154.803)" fill={catBgColor || "#000"}/>
                                        <line id="線_1" data-name="線 1" x2="32" transform="translate(179.5 2158.5)" fill="none" stroke={catBgColor} strokeWidth="1"/>
                                    </g>
                                </svg>
                            </div>
                        </nav>
                    </div>
                    <ul className="post-list-3__wrap">
                        {Array.from({ length: numberOfPosts }).map((_, index) => (
                            <li key={index}>
                                <a href="#">
                                    <figure><img loading="lazy" src={`https://picsum.photos/1000/1000?random=${index}`}/></figure>
                                    <div className="in">
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
                                                    color: catBgColor,
                                                    fontWeight: catFontWeight,
                                                }}
                                                data-lw_font_set={catFont}
                                            >
                                                <span>カテゴリー</span>
                                            </div>
                                        </div>
                                        <h3
                                            style={{ 
                                                fontWeight: titleFontWeight,
                                                color: catBgColor,
                                            }}
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
            </div>
        );
    },
    save: ({ attributes }) => {
        const {
            titleMain, linkText, linkUrl, openInNewTab,
            numberOfPosts, categoryId, postType,
            dateFont, dateFontWeight, catFont, catFontWeight, titleFont, titleFontWeight,
            catBgColor,
        } = attributes;

        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps}>
                <div
                    className="shin-gas-station-01-post-list"
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
                    <div className="head">
                        <div className="sen"></div>
                        <h2 className="title">
                            <RichText.Content tagName="span" className="main" value={titleMain} />
                            <span className="sub" data-lw_font_set="Montserrat">Blog</span>
                        </h2>
                        {linkUrl && (
                        <nav>
                            <a href={linkUrl} target={openInNewTab ? '_blank' : '_self'}>  
                                <span className="text">{linkText}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="39.5" height="4.197" viewBox="0 0 39.5 4.197">
                                    <g id="グループ_16" data-name="グループ 16" transform="translate(-179.5 -2154.803)">
                                        <path id="パス_28" data-name="パス 28" d="M0,0,8,4.2H0Z" transform="translate(211 2154.803)" fill={catBgColor || "#000"}/>
                                        <line id="線_1" data-name="線 1" x2="32" transform="translate(179.5 2158.5)" fill="none" stroke={catBgColor} strokeWidth="1"/>
                                    </g>
                                </svg>
                            </a>
                        </nav>
                        )}
                    </div>
                    <ul className="post-list-3__wrap"></ul>
                    
                </div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        document.addEventListener('DOMContentLoaded', () => {
                            const container = document.querySelector('.shin-gas-station-01-post-list');
                            if (container) {
                                // 投稿一覧を出力するUL要素を取得
                                const ulContainer = container.querySelector('.post-list-3__wrap');
                                if (!ulContainer) return;

                                // 各種属性を取得
                                const numberOfPosts = container.getAttribute('data-number') || 4;
                                const categoryId = container.getAttribute('data-category');
                                const postType = container.getAttribute('data-type') || 'post';

                                const dateFont = container.getAttribute('data-date-font');
                                const dateFontWeight = container.getAttribute('data-date-font-weight');
                                const catFont = container.getAttribute('data-cat-font');
                                const catFontWeight = container.getAttribute('data-cat-font-weight');
                                const catBgColor = container.getAttribute('data-cat-bg-color');
                                const titleFont = container.getAttribute('data-title-font');
                                const titleFontWeight = container.getAttribute('data-title-font-weight');

                                // APIのURLを生成
                                let apiUrl = \`\${MyThemeSettings.home_Url}/wp-json/wp/v2/\${postType === 'post' ? 'posts' : postType}?per_page=\${numberOfPosts}&orderby=date&order=desc&_embed\`;
                                if (categoryId) {
                                    apiUrl += \`&categories=\${categoryId}\`;
                                }

                                fetch(apiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('投稿の取得に失敗しました');
                                        }
                                        return response.json();
                                    })
                                    .then(posts => {
                                        let html = '';
                                        posts.forEach(post => {
                                            const postDate = new Date(post.date).toLocaleDateString();
                                            const postTitle = post.title.rendered;
                                            const postLink = post.link;
                                            const postCategory = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
                                                ? post._embedded['wp:term'][0][0].name
                                                : 'カテゴリーなし';
                                            const postThumbnail = post._embedded && post._embedded['wp:featuredmedia']
                                                ? post._embedded['wp:featuredmedia'][0].source_url
                                                : \`\${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp\`;
                                            // 抜粋の加工は必要に応じて調整してください
                                            const postExcerpt = post.excerpt && post.excerpt.rendered
                                                ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '...'
                                                : '本文がありません';

                                            html += \`
                                                <li>
                                                    <a href="\${postLink}">
                                                        <figure>
                                                            <img loading="lazy" src="\${postThumbnail}" alt="\${postTitle}">
                                                        </figure>
                                                        <div class="in">
                                                            <div class="data">
                                                                <div class="date" style="font-weight: \${dateFontWeight};" data-lw_font_set="\${dateFont}">
                                                                    <span>\${postDate}</span>
                                                                </div>
                                                                <div class="cat" style="color: \${catBgColor}; font-weight: \${catFontWeight};" data-lw_font_set="\${catFont}">
                                                                    <span>\${postCategory}</span>
                                                                </div>
                                                            </div>
                                                            <h3 style="font-weight: \${titleFontWeight}; color: \${catBgColor}" data-lw_font_set="\${titleFont}">
                                                                \${postTitle}
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </li>
                                            \`;
                                        });
                                        // 既存のUL要素の中にリスト項目を挿入
                                        ulContainer.innerHTML = html;
                                    })
                                    .catch(error => {
                                        console.error('投稿を取得できませんでした:', error);
                                        ulContainer.innerHTML = '<li>投稿を読み込めませんでした。</li>';
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
