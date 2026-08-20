/**
 * LiteWord – リンク先の指定（共通部品）
 * ------------------------------------------------------------
 *  URL の直接入力に加えて、固定ページ・カテゴリーを一覧から選べるようにする。
 *  一覧は打ち込んだ文字で絞り込める（ページ数が多いサイト向け）。
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
 *    edit: <LinkPicker link={button} onChange={(patch) => updateButtonMany(index, patch)} />
 *    save: const lp = lwLinkProps(button);
 *          <a href={lp.href} data-lw-link-type={lp.linkType} data-lw-link-id={lp.linkId}>
 * ----------------------------------------------------------- */
import { ComboboxControl, SelectControl, TextControl } from "@wordpress/components";
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

/** 編集画面のリンク設定UI */
export function LinkPicker({ link, onChange, label = "リンク先" }) {
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

			{type === "url" && (
				<TextControl
					label="URL"
					value={(link && link.url) || ""}
					onChange={(v) => onChange({ url: v })}
					type="url"
				/>
			)}

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
	if (type === "page") return "選んだ固定ページのURLを自動で使います。あとでスラッグを変えても追従します。";
	if (type === "category") return "選んだカテゴリーの一覧ページへリンクします。";
	return "";
}
