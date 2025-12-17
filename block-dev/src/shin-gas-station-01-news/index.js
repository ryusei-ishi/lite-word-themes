import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    useBlockProps,
    URLInput,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    ColorPalette,
    RangeControl,
    TextControl,
    SelectControl,
} from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    title: 'お知らせ一覧 1 shin shop pattern 01',
    icon: 'editor-ul',
    category: 'lw-post',
    supports: {
        anchor: true,
    },
    // =========================
    //         Edit
    // =========================
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'shin-gas-station-01-news',
        });
        const {
            mainTitle,
            subTitle,
            buttonText,
            buttonUrl,
            openInNewTab,
            numberOfPosts,
            categoryId,
            postType,
            dateFont,
            dateFontWeight,
            catFont,
            catFontWeight,
            titleFont,
            titleFontWeight,
            catBgColor,
        } = attributes;

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="設定" initialOpen={true}>
                        <p>リンク先 URL</p>
                        <URLInput
                            value={buttonUrl}
                            onChange={(url) => setAttributes({ buttonUrl: url })}
                        />
                        <ToggleControl
                            label="新規タブで開く"
                            checked={openInNewTab}
                            onChange={() =>
                                setAttributes({ openInNewTab: !openInNewTab })
                            }
                        />
                        <RangeControl
                            label="出力数"
                            value={numberOfPosts}
                            onChange={(value) =>
                                setAttributes({ numberOfPosts: value })
                            }
                            min={1}
                            max={20}
                        />
                        <TextControl
                            label="カテゴリ ID"
                            value={categoryId}
                            onChange={(value) =>
                                setAttributes({ categoryId: value })
                            }
                            help="特定のカテゴリを指定（空欄の場合は全カテゴリ）"
                        />
                        <TextControl
                            label="投稿タイプ"
                            value={postType}
                            onChange={(value) =>
                                setAttributes({ postType: value })
                            }
                            help="例: post, page, custom_post_type"
                        />
                    </PanelBody>

                    {/* フォント設定 */}
                    <PanelBody title="フォント設定">
                        {/* ――日付―― */}
                        <SelectControl
                            label="日付のフォント"
                            value={dateFont}
                            options={fontOptions}
                            onChange={(v) => setAttributes({ dateFont: v })}
                        />
                        <SelectControl
                            label="日付のフォント太さ"
                            value={dateFontWeight}
                            options={fontWeightOptions}
                            onChange={(v) =>
                                setAttributes({ dateFontWeight: v })
                            }
                        />
                        {/* ――カテゴリー―― */}
                        <SelectControl
                            label="カテゴリーのフォント"
                            value={catFont}
                            options={fontOptions}
                            onChange={(v) => setAttributes({ catFont: v })}
                        />
                        <SelectControl
                            label="カテゴリーのフォント太さ"
                            value={catFontWeight}
                            options={fontWeightOptions}
                            onChange={(v) =>
                                setAttributes({ catFontWeight: v })
                            }
                        />
                        <ColorPalette
                            label="カテゴリーの背景色"
                            value={catBgColor}
                            onChange={(c) => setAttributes({ catBgColor: c })}
                        />
                        {/* ――タイトル―― */}
                        <SelectControl
                            label="タイトルのフォント"
                            value={titleFont}
                            options={fontOptions}
                            onChange={(v) => setAttributes({ titleFont: v })}
                        />
                        <SelectControl
                            label="タイトルのフォント太さ"
                            value={titleFontWeight}
                            options={fontWeightOptions}
                            onChange={(v) =>
                                setAttributes({ titleFontWeight: v })
                            }
                        />
                    </PanelBody>
                </InspectorControls>

                <h2 className="ttl">
                    <RichText
                        tagName="span"
                        className="main"
                        value={mainTitle}
                        onChange={(v) => setAttributes({ mainTitle: v })}
                        placeholder="メインタイトルを入力"
                    />
                    <RichText
                        tagName="span"
                        className="sub"
                        data-lw_font_set="Montserrat"
                        value={subTitle}
                        onChange={(v) => setAttributes({ subTitle: v })}
                        placeholder="サブタイトルを入力"
                    />
                </h2>

                <div className="shin-gas-station-01-news_in">
                        <ul className="shin-gas-station-01-news__wrap">
                            {Array.from({ length: numberOfPosts }).map(
                                (_, index) => (
                                    <li key={index}>
                                        <a href="#">
                                            <div className="data">
                                                <div
                                                    className="date"
                                                    style={{
                                                        fontWeight:
                                                            dateFontWeight,
                                                    }}
                                                    data-lw_font_set={dateFont}
                                                >
                                                    <span>2020.10.10</span>
                                                </div>
                                                <div
                                                    className="cat"
                                                    style={{
                                                        backgroundColor:
                                                            catBgColor,
                                                        fontWeight:
                                                            catFontWeight,
                                                    }}
                                                    data-lw_font_set={catFont}
                                                >
                                                    <span>カテゴリー</span>
                                                </div>
                                            </div>
                                            <div className="post_title">
                                                <h3
                                                    style={{
                                                        fontWeight:
                                                            titleFontWeight,
                                                    }}
                                                    data-lw_font_set={titleFont}
                                                >
                                                    サンプル投稿タイトルです。サンプル投稿タイトルです。
                                                </h3>
                                            </div>
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                </div>

                {/* ボタン */}
                {buttonUrl && (
                    <div className="btn">
                        <RichText
                            tagName="span"
                            className="text"
                            value={buttonText}
                            onChange={(v) => setAttributes({ buttonText: v })}
                            placeholder="ボタンテキスト"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="39.5"
                            height="4.197"
                            viewBox="0 0 39.5 4.197"
                        >
                            <g
                                id="グループ_16"
                                data-name="グループ 16"
                                transform="translate(-179.5 -2154.803)"
                            >
                                <path
                                    id="パス_28"
                                    data-name="パス 28"
                                    d="M0,0,8,4.2H0Z"
                                    transform="translate(211 2154.803)"
                                    fill={catBgColor}
                                />
                                <line
                                    id="線_1"
                                    data-name="線 1"
                                    x2="32"
                                    transform="translate(179.5 2158.5)"
                                    fill="none"
                                    stroke={catBgColor}
                                    strokeWidth="1"
                                />
                            </g>
                        </svg>
                    </div>
                )}

                <div className="filter"></div>
            </div>
        );
    },

    // =========================
    //         Save
    // =========================
    save: ({ attributes }) => {
        const {
            mainTitle,
            subTitle,
            buttonText,
            buttonUrl,
            openInNewTab,
            numberOfPosts,
            categoryId,
            postType,
            dateFont,
            dateFontWeight,
            catFont,
            catFontWeight,
            titleFont,
            titleFontWeight,
            catBgColor,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-news',
        });

        return (
            <div {...blockProps}>
                    <h2 className="ttl">
                        <RichText.Content
                            tagName="span"
                            className="main"
                            value={mainTitle}
                        />
                        <RichText.Content
                            tagName="span"
                            className="sub"
                            data-lw_font_set="Montserrat"
                            value={subTitle}
                        />
                    </h2>

                    <div
                        className="shin-gas-station-01-news_in"
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
                        <ul className="shin-gas-station-01-news__wrap"></ul>
                    </div>

                    {/* ▼▼▼ 保存側も従来通り URL の有無で表示 ▼▼▼ */}
                    {buttonUrl && (
                        <a
                            className="btn"
                            href={buttonUrl}
                            target={openInNewTab ? '_blank' : undefined}
                            rel={
                                openInNewTab
                                    ? 'noopener noreferrer'
                                    : undefined
                            }
                        >
                            <RichText.Content
                                tagName="span"
                                className="text"
                                value={buttonText}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="39.5"
                                height="4.197"
                                viewBox="0 0 39.5 4.197"
                            >
                                <g
                                    id="グループ_16"
                                    data-name="グループ 16"
                                    transform="translate(-179.5 -2154.803)"
                                >
                                    <path
                                        id="パス_28"
                                        data-name="パス 28"
                                        d="M0,0,8,4.2H0Z"
                                        transform="translate(211 2154.803)"
                                        fill={catBgColor}
                                    />
                                    <line
                                        id="線_1"
                                        data-name="線 1"
                                        x2="32"
                                        transform="translate(179.5 2158.5)"
                                        fill="none"
                                        stroke={catBgColor}
                                        strokeWidth="1"
                                    />
                                </g>
                            </svg>
                        </a>
                    )}

                    <div className="filter"></div>

                {/* --- 動的取得の JS（そのまま） --- */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        document.addEventListener('DOMContentLoaded', () => {
                            const newsList1Container = document.querySelector('.shin-gas-station-01-news_in');
                            if (!newsList1Container) return;

                            const newsList1NumberOfPosts = newsList1Container.getAttribute('data-number') || 4;
                            const newsList1CategoryId   = newsList1Container.getAttribute('data-category');
                            const newsList1PostType     = newsList1Container.getAttribute('data-type') || 'post';

                            const newsList1DateFont        = newsList1Container.getAttribute('data-date-font');
                            const newsList1DateFontWeight  = newsList1Container.getAttribute('data-date-font-weight');
                            const newsList1CatFont         = newsList1Container.getAttribute('data-cat-font');
                            const newsList1CatFontWeight   = newsList1Container.getAttribute('data-cat-font-weight');
                            const newsList1CatBgColor      = newsList1Container.getAttribute('data-cat-bg-color');
                            const newsList1TitleFont       = newsList1Container.getAttribute('data-title-font');
                            const newsList1TitleFontWeight = newsList1Container.getAttribute('data-title-font-weight');

                            let newsList1ApiUrl = \`\${MyThemeSettings.home_Url}/wp-json/wp/v2/\${newsList1PostType === 'post' ? 'posts' : newsList1PostType}?per_page=\${newsList1NumberOfPosts}&orderby=date&order=desc&_embed\`;
                            if (newsList1CategoryId) {
                                newsList1ApiUrl += \`&categories=\${newsList1CategoryId}\`;
                            }

                            fetch(newsList1ApiUrl)
                                .then(res => {
                                    if (!res.ok) throw new Error('投稿の取得に失敗しました');
                                    return res.json();
                                })
                                .then(posts => {
                                    let html = '<ul class="shin-gas-station-01-news__wrap">';
                                    posts.forEach(post => {
                                        const date = new Date(post.date).toISOString().split('T')[0].replace(/-/g, '.');
                                        const title = post.title.rendered;
                                        const link = post.link;
                                        const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'カテゴリーなし';

                                        html += \`
                                            <li>
                                                <a href="\${link}">
                                                    <div class="data">
                                                        <div class="date" style="font-weight:\${newsList1DateFontWeight};" data-lw_font_set="\${newsList1DateFont}">
                                                            <span>\${date}</span>
                                                        </div>
                                                        <div class="cat" style="background-color:\${newsList1CatBgColor};font-weight:\${newsList1CatFontWeight};" data-lw_font_set="\${newsList1CatFont}">
                                                            <span>\${category}</span>
                                                        </div>
                                                    </div>
                                                    <div class="post_title">
                                                        <h3 style="font-weight:\${newsList1TitleFontWeight};" data-lw_font_set="\${newsList1TitleFont}">\${title}</h3>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="39.5" height="4.197" viewBox="0 0 39.5 4.197">
                                                            <g transform="translate(-179.5 -2154.803)">
                                                                <path d="M0,0,8,4.2H0Z" transform="translate(211 2154.803)" fill="\${newsList1CatBgColor}"/>
                                                                <line x2="32" transform="translate(179.5 2158.5)" fill="none" stroke="\${newsList1CatBgColor}" stroke-width="1"/>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                </a>
                                            </li>\`;
                                    });
                                    html += '</ul>';
                                    newsList1Container.innerHTML = html;
                                })
                                .catch(err => {
                                    console.error('投稿を取得できませんでした:', err);
                                    newsList1Container.innerHTML = '<p>投稿を読み込めませんでした。</p>';
                                });
                        });
                        `,
                    }}
                />
            </div>
        );
    },
});
