/* =======================================================================
 * LiteWord – ページ一覧 1（複数設置対応版）
 *  - 階層セレクト
 *  - 並び順切替
 *  - 新しいタブで開く
 *  - タイトルフィルター
 *  - uid で重複防止
 *  - 画像デザインパターン選択（ptn_1 / ptn_2 / ptn_3）
 *  - 日付・抜粋 表示／非表示
 * ===================================================================== */
import { registerBlockType }          from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	ColorPalette,
	Spinner,
} from '@wordpress/components';
import { useSelect }                  from '@wordpress/data';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* フォントオプション */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* 画像パターンオプション */
const imagePatternOptions = [
	{ label: 'パターン 1', value: 'ptn_1' },
	{ label: 'パターン 2', value: 'ptn_2' },
	{ label: 'パターン 3', value: 'ptn_3' },
];

/* -------------------------------------------------- *
 * ブロック登録
 * -------------------------------------------------- */
registerBlockType(metadata.name, {
	/* =================== edit =================== */
	edit: ( { attributes, setAttributes, clientId } ) => {

		/* uid が未設定なら最初のレンダリング時にセット */
		if ( ! attributes.uid ) {
			setAttributes( { uid: clientId } );
		}

		const {
			numberOfPages, parentPageId, orderOption,
			openInNewTab, filterText,
			imagePattern, showDate, showExcerpt,
			dateFont, dateFontWeight,
			titleFont, titleFontWeight,
			exFont, exFontWeight,
			catBgColor,
		} = attributes;

		/* 全固定ページ取得 */
		const pages = useSelect(
			(select) => select('core').getEntityRecords(
				'postType', 'page',
				{ per_page: -1, orderby: 'menu_order', order: 'asc' }
			),
			[]
		);

		/* 階層オプション生成 */
		const buildOptions = (list) => {
			if (!list) return [{ label: '読み込み中…', value: 0 }];
			const byParent = {};
			list.forEach(p => (byParent[p.parent || 0] = byParent[p.parent || 0] || []).push(p));
			const walk = (pid, depth = 0, acc = []) => {
				(byParent[pid] || [])
					.sort((a, b) => a.menu_order - b.menu_order || a.title.raw.localeCompare(b.title.raw))
					.forEach(p => {
						acc.push({ label: '　'.repeat(depth) + (p.title.rendered || '(無題)'), value: p.id });
						walk(p.id, depth + 1, acc);
					});
				return acc;
			};
			return [{ label: '現在ページを親にする（自動）', value: 0 }, ...walk(0)];
		};

		const orderOptions = [
			{ label: '新着順', value: 'date_desc' },
			{ label: '古い順', value: 'date_asc' },
			{ label: 'タイトル あ→わ', value: 'title_asc' },
		];

		return (
			<div {...useBlockProps()}>
				<InspectorControls>
					<PanelBody title="基本設定" initialOpen={true}>
						<RangeControl
							label="表示件数"
							value={numberOfPages}
							onChange={(v)=>setAttributes({numberOfPages:v})}
							min={1} max={100}
						/>
						{!pages && <Spinner/>}
						<SelectControl
							label="親ページ（階層表示）"
							value={parentPageId}
							options={buildOptions(pages)}
							onChange={(v)=>setAttributes({parentPageId:parseInt(v,10)})}
						/>
						<SelectControl
							label="並び順"
							value={orderOption}
							options={orderOptions}
							onChange={(v)=>setAttributes({orderOption:v})}
						/>
						<ToggleControl
							label="新しいタブで開く"
							checked={openInNewTab}
							onChange={(v)=>setAttributes({openInNewTab:v})}
						/>
						<TextControl
							label="タイトルに含む文字列（部分一致）"
							value={filterText}
							placeholder="例) セミナー"
							onChange={(v)=>setAttributes({filterText:v})}
						/>
						<ColorPalette
							label="メインカラー"
							value={catBgColor}
							onChange={(c)=>setAttributes({catBgColor:c})}
						/>
					</PanelBody>

					<PanelBody title="表示設定" initialOpen={false}>
						<SelectControl
							label="画像デザインパターン"
							value={imagePattern}
							options={imagePatternOptions}
							onChange={(v)=>setAttributes({imagePattern:v})}
						/>
						<ToggleControl
							label="日付を表示"
							checked={showDate}
							onChange={(v)=>setAttributes({showDate:v})}
						/>
						<ToggleControl
							label="抜粋を表示"
							checked={showExcerpt}
							onChange={(v)=>setAttributes({showExcerpt:v})}
						/>
					</PanelBody>

					<PanelBody title="フォント設定">
						<SelectControl label="日付フォント" value={dateFont} options={fontOptions} onChange={(v)=>setAttributes({dateFont:v})}/>
						<SelectControl label="日付ウエイト" value={dateFontWeight} options={fontWeightOptions} onChange={(v)=>setAttributes({dateFontWeight:v})}/>
						<SelectControl label="タイトルフォント" value={titleFont} options={fontOptions} onChange={(v)=>setAttributes({titleFont:v})}/>
						<SelectControl label="タイトルウエイト" value={titleFontWeight} options={fontWeightOptions} onChange={(v)=>setAttributes({titleFontWeight:v})}/>
						<SelectControl label="抜粋フォント" value={exFont} options={fontOptions} onChange={(v)=>setAttributes({exFont:v})}/>
						<SelectControl label="抜粋ウエイト" value={exFontWeight} options={fontWeightOptions} onChange={(v)=>setAttributes({exFontWeight:v})}/>
					</PanelBody>
				</InspectorControls>

				{/* 編集画面プレビュー */}
				<div className="lw_page-list-1">
					<ul className="page-list-1__wrap">
						{Array.from({ length: Math.min(numberOfPages, 6) }).map((_, i) => (
							<li key={i}>
								<a href="#">
									<figure className={imagePattern}>
										<img loading="lazy" src={`https://picsum.photos/1000/1000?random=${i}`} alt="" />
									</figure>
									<div className="in">
										<div className="data">
											{showDate && (
												<div
													className="date"
													data-lw_font_set={dateFont}
													style={{ fontWeight: dateFontWeight }}
												>
													<span>2025/07/10</span>
												</div>
											)}
										</div>
										<h3
											data-lw_font_set={titleFont}
											style={{ fontWeight: titleFontWeight }}
										>
											サンプルページタイトル
										</h3>
										{showExcerpt && (
											<p
												data-lw_font_set={exFont}
												style={{ fontWeight: exFontWeight }}
											>
												ページ抜粋テキストです。ここに概要が入ります。
											</p>
										)}
									</div>
								</a>
							</li>
						))}
					</ul>
				</div>

			</div>
		);
	},

	/* =================== save =================== */
	save: ( { attributes } ) => {

		const {
			uid,
			numberOfPages, parentPageId, orderOption,
			openInNewTab, filterText,
			imagePattern, showDate, showExcerpt,
			dateFont, dateFontWeight,
			titleFont, titleFontWeight,
			exFont, exFontWeight,
			catBgColor,
		} = attributes;

		return (
			<div>
				<div className="filter" style={{background:catBgColor}}/>
				<div
					id={`lw-page-list-${uid}`}               /* ★ ユニーク ID */
					className="lw_page-list-1"
					data-number={numberOfPages}
					data-parent={parentPageId}
					data-order={orderOption}
					data-target={openInNewTab ? '_blank' : '_self'}
					data-filter={filterText}
					data-img-pattern={imagePattern}
					data-date-visible={showDate ? '1' : '0'}
					data-ex-visible={showExcerpt ? '1' : '0'}
					data-date-font={dateFont}
					data-date-font-weight={dateFontWeight}
					data-title-font={titleFont}
					data-title-font-weight={titleFontWeight}
					data-ex-font={exFont}
					data-ex-font-weight={exFontWeight}
					data-cat-bg-color={catBgColor}
				/>
				<script dangerouslySetInnerHTML={{__html:`
/* =========================================================
 * front-end script – ページ一覧ブロック (複数対応)
 * ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.lw_page-list-1').forEach(async (container) => {

    const per        = parseInt(container.dataset.number, 10) || 4;          // 表示上限
    let   parentId   = parseInt(container.dataset.parent, 10);
    const orderOpt   = container.dataset.order || 'date_desc';
    const target     = container.dataset.target || '_self';
    const fText      = (container.dataset.filter || '').toLowerCase();
    const imgPattern = container.dataset.imgPattern || 'ptn_1';
    const showDate   = container.dataset.dateVisible === '1';
    const showEx     = container.dataset.exVisible   === '1';
    const dFont      = container.dataset.dateFont,  dW = container.dataset.dateFontWeight;
    const tFont      = container.dataset.titleFont, tW = container.dataset.titleFontWeight;
    const eFont      = container.dataset.exFont,    eW = container.dataset.exFontWeight;

    /* 親 ID が 0 の場合は現在ページ ID を採用 */
    if (parentId === 0) {
      const m = document.body.className.match(/page-id-(\\d+)/);
      parentId = m ? parseInt(m[1], 10) : 0;
    }

    /* 並び順パラメータ */
    let orderby = 'date', dir = 'desc';
    if (orderOpt === 'date_asc')  { dir = 'asc'; }
    if (orderOpt === 'title_asc') { orderby = 'title'; dir = 'asc'; }

    /* =====================================================
     * 100 件ずつすべて取得 → フィルタ → 上限件数に丸める
     * =================================================== */
    const perRequest = 100;                    // REST API 1 回の最大取得数
    let   page       = 1;
    let   allPages   = [];

    try {
      while (true) {
        let api = \`\${MyThemeSettings.home_Url}/wp-json/wp/v2/pages?per_page=\${perRequest}&page=\${page}&orderby=\${orderby}&order=\${dir}&_embed\`;
        if (parentId) api += \`&parent=\${parentId}\`;

        const res   = await fetch(api);
        const items = await res.json();

        if (!Array.isArray(items)) break;

        allPages = allPages.concat(items);

        const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
        if (page >= totalPages) break;
        page++;
      }

      /* ---------- フィルタ＆スライス ---------- */
      if (fText) {
        allPages = allPages.filter(p =>
          (p.title && p.title.rendered || '').toLowerCase().includes(fText)
        );
      }
      const list = allPages.slice(0, per);

      /* ---------- 出力 ---------- */
      if (list.length === 0) {
        container.innerHTML = '<p>該当するページがありません。</p>';
        return;
      }

      let html = '<ul class="page-list-1__wrap">';
      list.forEach(p => {
        const link  = p.link;
        const title = p.title.rendered;
        const date  = new Date(p.date).toLocaleDateString();
        const img   = p._embedded && p._embedded['wp:featuredmedia']
                        ? p._embedded['wp:featuredmedia'][0].source_url
                        : \`\${MyThemeSettings.theme_Url}/assets/image/no_image/2.webp\`;
        const ex    = p.excerpt && p.excerpt.rendered
                        ? p.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 40) + '…'
                        : '';

        html += \`
<li>
  <a href="\${link}" target="\${target}"\${target === '_blank' ? ' rel="noopener"' : ''}>
    <figure class="\${imgPattern}"><img loading="lazy" src="\${img}" alt="\${title}"></figure>
    <div class="in">
      <div class="data">\${ showDate ? \`<div class="date" style="font-weight:\${dW};" data-lw_font_set="\${dFont}"><span>\${date}</span></div>\` : '' }</div>
      <h3 style="font-weight:\${tW};" data-lw_font_set="\${tFont}">\${title}</h3>
      \${ showEx ? \`<p style="font-weight:\${eW};" data-lw_font_set="\${eFont}">\${ex}</p>\` : '' }
    </div>
  </a>
</li>\`;
      });
      html += '</ul>';
      container.innerHTML = html;

    } catch (e) {
      console.error(e);
      container.innerHTML = '<p>ページを読み込めませんでした。</p>';
    }

  }); // end forEach

});
				`}}/>
			</div>
		);
	},
});
