/**
 * LiteWord – リンク先の指定（共通部品）
 * ------------------------------------------------------------
 *  URL の直接入力に加えて、固定ページ・カテゴリーを一覧から選べるようにする。
 *  一覧は打ち込んだ文字で絞り込める（ページ数が多いサイト向け）。
 *
 *  🚨 見た目の約束（2026-08-23 Ryuichi 判断・B案）
 *  ・ブロックが元から持っているアドレス入力欄（URLInput / TextControl）は残す。
 *    この部品はその「下に足すだけ」で、URL の入力欄は自分では出さない。
 *    ＝ 今まで使ってきた人の編集画面が変わらない。
 *  ・固定ページ／カテゴリーを選ぶと、上のアドレス欄が自動で埋まる（同じ属性を書くため）。
 *    入力欄が2つ並んで見えるので、説明文でそのことを必ず伝える（helpText）。
 *
 *  🚨 設計の前提（ここを崩すと既存ページが壊れる）
 *  ・ブロックは静的ブロックのまま。save の出力は変えない。
 *    リンク種別が "url"（＝既存のボタン全部）のときは lwLinkProps が
 *    data 属性を undefined で返すので、React が属性ごと出力しない。
 *    ＝ 保存されるHTMLは今までと1バイトも変わらない。
 *  ・固定ページ / カテゴリーを選んだときだけ data-lw-link-type / data-lw-link-id が付く。
 *    実際のURLはフロントで render_block フィルタが引き直す
 *    （functions/lw_block_link_resolver/index.php）。
 *    そのため、あとでスラッグを変えてもリンクは古くならない。
 *  ・href には選んだ時点のURLを焼いておく。フィルタが効かない場面でも飛べるようにするため。
 *
 *  🚨 一覧の取り方
 *  ・全件取得（per_page:-1）はしない。固定ページが数百ある納品先で編集画面が固まるため。
 *    打った文字をサーバーへ渡して検索し、上限 LIST_LIMIT 件だけ受け取る。
 *  ・入力のたびに叩かないよう useDebouncedInput で待つ。
 *  ・すでに選んである項目は、検索結果に含まれなくても名前が出るように単独で引く。
 *
 *  使い方（ブロック側）
 *    import { LinkPicker, lwLinkProps } from "../link-picker.js";
 *    edit: 既存のURL入力欄はそのまま。その下に
 *          <LinkPicker link={button} onChange={(patch) => updateButtonMany(index, patch)} />
 *    save: const lp = lwLinkProps(button);
 *          <a href={lp.href} data-lw-link-type={lp.linkType} data-lw-link-id={lp.linkId}>
 *
 *  属性の持ち方は3通りある。どれも同じ LinkPicker を使う。
 *    ① 平たい属性        btnUrl / btnLinkType / btnPageId / btnCategoryId
 *                        → lwLinkFromAttrs / lwLinkToAttrs / lwLinkPropsFromAttrs
 *    ② 配列（query 無し） 要素に {url, linkType, pageId, categoryId} を持てる
 *                        → そのまま lwLinkProps
 *    ③ 配列（query あり） 要素の中身は HTML から読み直されるので、
 *                        linkType / linkId を data 属性から source する
 *                        → lwLinkFromItem / lwLinkToItem / lwLinkPropsFromItem
 * ----------------------------------------------------------- */
import { ComboboxControl, SelectControl } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useDebouncedInput } from "@wordpress/compose";

/** 一度に出す候補の数 */
const LIST_LIMIT = 50;

/** リンク種別 */
export const linkTypeOptions = [
	{ label: "URLを直接入力", value: "url" },
	{ label: "固定ページから選ぶ", value: "page" },
	{ label: "カテゴリーから選ぶ", value: "category" },
];

/** 既存データ（linkType を持たないもの）は URL 指定として扱う */
export function lwLinkType(link) {
	return link && link.linkType ? link.linkType : "url";
}

/**
 * save で <a> に渡す値を作る。
 * URL 指定のときは data 属性を undefined にして、従来どおりの出力に保つ。
 */
export function lwLinkProps(link) {
	const type = lwLinkType(link);
	const href = (link && link.url) || "#";
	if (type === "page" && link && link.pageId) {
		return { href, linkType: "page", linkId: String(link.pageId) };
	}
	if (type === "category" && link && link.categoryId) {
		return { href, linkType: "category", linkId: String(link.categoryId) };
	}
	return { href, linkType: undefined, linkId: undefined };
}

/**
 * save で <a> に足す data 属性だけを作る。
 * href は今まで書いてあった式のまま残すために、あえて返さない。
 *
 * 🚨 なぜ href を触らないのか
 *   ブロックによって href の式が違う（`{url}` / `{url || '#'}` / `{ url ? url : undefined }`）。
 *   lwLinkProps の href（`url || "#"`）に寄せると、URL が空のブロックで
 *   href="" が href="#" に変わり、既存ページが「無効なコンテンツ」になる。
 *   足すのは undefined になりうる data 属性だけにして、保存済みHTMLを1バイトも変えない。
 */
export function lwLinkDataProps(link) {
	const p = lwLinkProps(link);
	return { linkType: p.linkType, linkId: p.linkId };
}

/** 平たい属性版 */
export function lwLinkDataPropsFromAttrs(attributes, keys) {
	return lwLinkDataProps(lwLinkFromAttrs(attributes, keys));
}

/** 配列（query 付き）の要素版 */
export function lwLinkDataPropsFromItem(item, urlKey = "url") {
	return lwLinkDataProps(lwLinkFromItem(item, urlKey));
}

/** 編集画面のリンク設定UI */
export function LinkPicker({ link, onChange, label = "リンク先の指定方法" }) {
	const type = lwLinkType(link);
	const isPage = type === "page";
	const isCategory = type === "category";
	const selectedId = isPage
		? (link && link.pageId) || 0
		: isCategory
		? (link && link.categoryId) || 0
		: 0;

	/* 打ち込んだ文字。debounced のほうだけをサーバーへ渡す */
	const [search, setSearch, debouncedSearch] = useDebouncedInput("");

	const { records, selected, isLoading } = useSelect(
		(select) => {
			const core = select("core");
			if (!isPage && !isCategory) return { records: [], selected: null, isLoading: false };

			const kind = isPage ? "postType" : "taxonomy";
			const name = isPage ? "page" : "category";
			const query = isPage
				? { per_page: LIST_LIMIT, status: "publish", orderby: "title", order: "asc", _fields: "id,title,link" }
				: { per_page: LIST_LIMIT, orderby: "name", order: "asc", _fields: "id,name,link,count" };
			if (debouncedSearch) query.search = debouncedSearch;

			return {
				records: core.getEntityRecords(kind, name, query),
				/* 選択済みの項目は検索結果に入らないことがあるので単独で引く */
				selected: selectedId ? core.getEntityRecord(kind, name, selectedId) : null,
				isLoading: !core.hasFinishedResolution("getEntityRecords", [kind, name, query]),
			};
		},
		[isPage, isCategory, debouncedSearch, selectedId]
	);

	const labelOf = (r) => {
		if (!r) return "";
		if (isPage) return (r.title && (r.title.rendered || r.title)) || "(無題)";
		return r.name + "（" + (r.count !== undefined ? r.count + "件" : "") + "）";
	};

	const list = records || [];
	const options = list.map((r) => ({ label: labelOf(r) + "  #" + r.id, value: String(r.id) }));
	/* 選択済みが候補に無ければ先頭に足す（名前が消えないように） */
	if (selectedId && selected && !options.some((o) => o.value === String(selectedId))) {
		options.unshift({ label: labelOf(selected) + "  #" + selected.id, value: String(selectedId) });
	}

	const pick = (v) => {
		const id = v ? Number(v) : 0;
		const hit = list.find((r) => String(r.id) === String(v)) || (selected && String(selected.id) === String(v) ? selected : null);
		const url = hit && hit.link ? hit.link : "";
		onChange(isPage ? { pageId: id, url } : { categoryId: id, url });
	};

	const listHelp = isLoading
		? "読み込み中…"
		: list.length >= LIST_LIMIT
		? "上位 " + LIST_LIMIT + " 件を表示しています。見つからないときは名前を打ち込んで絞り込んでください。"
		: debouncedSearch && list.length === 0
		? "見つかりませんでした。"
		: "名前の一部を打ち込むと絞り込めます。";

	return (
		<>
			<SelectControl
				label={label}
				value={type}
				options={linkTypeOptions}
				onChange={(v) => onChange({ linkType: v })}
				help={helpText(type)}
			/>

			{(isPage || isCategory) && (
				<ComboboxControl
					label={isPage ? "固定ページ" : "カテゴリー"}
					value={selectedId ? String(selectedId) : null}
					options={options}
					onChange={pick}
					onFilterValueChange={setSearch}
					help={listHelp}
					allowReset={true}
				/>
			)}
		</>
	);
}

/** 種別ごとの説明文 */
function helpText(type) {
	if (type === "page") return "下で固定ページを選ぶと、上のアドレス欄が自動で埋まります。あとでスラッグを変えてもリンクは追従します。";
	if (type === "category") return "下でカテゴリーを選ぶと、上のアドレス欄が自動で埋まります。";
	return "上のアドレス欄に入力したURLへリンクします。サイト内のページを選びたいときは種別を変えてください。";
}

/* ──────────────────────────────────────────────────────────
 * 平たい属性のブロック用のつなぎ
 *   ボタン06 は配列の中に {linkType,url,pageId,categoryId} を持つが、
 *   ほとんどのブロックは btnUrl / buttonUrl のように属性が平たく並んでいる。
 *   その両方で同じ LinkPicker を使えるようにするための変換。
 *
 *   keys の例: { url: "btnUrl", type: "btnLinkType", page: "btnPageId", category: "btnCategoryId" }
 * ────────────────────────────────────────────────────────── */

/** 平たい属性 → LinkPicker が受け取る形 */
export function lwLinkFromAttrs(attributes, keys) {
	return {
		linkType: attributes[keys.type],
		url: attributes[keys.url],
		pageId: attributes[keys.page],
		categoryId: attributes[keys.category],
	};
}

/** LinkPicker が返す差分 → 平たい属性名に直す */
export function lwLinkToAttrs(patch, keys) {
	const out = {};
	if ("linkType" in patch) out[keys.type] = patch.linkType;
	if ("url" in patch) out[keys.url] = patch.url;
	if ("pageId" in patch) out[keys.page] = patch.pageId;
	if ("categoryId" in patch) out[keys.category] = patch.categoryId;
	return out;
}

/** 平たい属性から save 用の値を作る（lwLinkProps の平たい版） */
export function lwLinkPropsFromAttrs(attributes, keys) {
	return lwLinkProps(lwLinkFromAttrs(attributes, keys));
}

/* ──────────────────────────────────────────────────────────
 * query 付きの配列（＝要素の中身を保存済みHTMLから読み直すブロック）用のつなぎ
 *
 *   query 付きの配列は、コメントJSONに書かれず HTML から復元される。
 *   そのため linkType / pageId / categoryId も HTML に置き場所が要る。
 *   save が出す data 属性をそのまま読み場所として使う。
 *
 *   block.json（query の中）に足す2つ:
 *     "linkType": { "type":"string", "source":"attribute", "selector":"a", "attribute":"data-lw-link-type" }
 *     "linkId":   { "type":"string", "source":"attribute", "selector":"a", "attribute":"data-lw-link-id" }
 *
 *   URL 指定のときは save が data 属性を出さない → 読み戻すと undefined → "url" 扱い。
 *   ＝ いま保存されている全ページの HTML は1バイトも変わらない。
 * ────────────────────────────────────────────────────────── */

/**
 * 配列の要素（URL / linkType / linkId）→ LinkPicker が受け取る形
 * urlKey … 要素側のURLの持ち名（ブロックによって url / buttonUrl / link と違う）
 */
export function lwLinkFromItem(item, urlKey = "url") {
	const type = lwLinkType(item);
	const id = item && item.linkId ? Number(item.linkId) : 0;
	return {
		linkType: type,
		url: (item && item[urlKey]) || "",
		pageId: type === "page" ? id : 0,
		categoryId: type === "category" ? id : 0,
	};
}

/** LinkPicker が返す差分 → 配列の要素に入れる形（linkId は文字列で持つ） */
export function lwLinkToItem(patch, urlKey = "url") {
	const out = {};
	if ("url" in patch) out[urlKey] = patch.url;
	if ("linkType" in patch) {
		out.linkType = patch.linkType;
		/* 種別を変えたら前の選択は消す（別の種別のIDが残ると解決先がずれる） */
		if (patch.linkType === "url") out.linkId = undefined;
	}
	if ("pageId" in patch) out.linkId = patch.pageId ? String(patch.pageId) : undefined;
	if ("categoryId" in patch) out.linkId = patch.categoryId ? String(patch.categoryId) : undefined;
	return out;
}

/** 配列の要素から save 用の値を作る */
export function lwLinkPropsFromItem(item, urlKey = "url") {
	return lwLinkProps(lwLinkFromItem(item, urlKey));
}
