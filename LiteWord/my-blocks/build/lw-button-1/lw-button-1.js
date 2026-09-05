/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/affiliate-link.js":
/*!*******************************!*\
  !*** ./src/affiliate-link.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AffiliateToggle: () => (/* binding */ AffiliateToggle),
/* harmony export */   LW_AFFILIATE_REL: () => (/* binding */ LW_AFFILIATE_REL),
/* harmony export */   lwRel: () => (/* binding */ lwRel)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/**
 * LiteWord – アフィリエイトリンク（共通部品）
 * ------------------------------------------------------------
 *  Amazon・楽天などの広告リンクに、検索エンジン向けの印
 *  rel="sponsored nofollow" を付けるための共通部品。
 *
 *  なぜ要るか
 *  ・Google は「報酬が発生するリンクには rel="sponsored"（または nofollow）を付ける」
 *    ことを求めている。付けずに広告リンクを大量に置くと、リンクを売っているサイトと
 *    区別が付かず、検索順位を落とされることがある。
 *  ・ステマ規制（景品表示法・2023年10月〜）で必要なのは「広告である」という
 *    画面上の表示。rel はそれとは別（検索エンジン向け）なので、両方いる。
 *
 *  🚨 設計の前提（ここを崩すと既存ページが壊れる）
 *  ・約1000サイトに配るテーマなので、**既定値（オフ）のときの save の出力は
 *    1バイトも変えない**。lwRel() はオフのとき undefined を返し、React は
 *    属性ごと出力しない ＝ 今まで保存された HTML と完全に一致する。
 *    ＝ deprecated を書かなくてよい（reference/block-change-safety.md §0）。
 *  ・別タブの rel="noopener noreferrer" を今まで出していたブロックは、
 *    lwRel({ newTab, affiliate }) の形で呼ぶ。オフなら従来と同じ文字列になる。
 *  ・別タブでも rel を出していなかったブロック（lw-button-2 / 3）は
 *    lwRel({ affiliate }) だけを渡す。newTab を混ぜると出力が変わってしまう。
 */



/** 広告リンクに付ける rel の中身 */
var LW_AFFILIATE_REL = 'sponsored nofollow';

/**
 * a タグの rel を組み立てる。
 * 付けるものが何も無ければ undefined（＝属性そのものを出さない）。
 *
 * @param {Object}  opt
 * @param {boolean} opt.newTab    別タブで開く（従来どおり noopener noreferrer）
 * @param {boolean} opt.affiliate 広告リンク（sponsored nofollow）
 * @return {string|undefined} rel の値
 */
function lwRel() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$newTab = _ref.newTab,
    newTab = _ref$newTab === void 0 ? false : _ref$newTab,
    _ref$affiliate = _ref.affiliate,
    affiliate = _ref$affiliate === void 0 ? false : _ref$affiliate;
  var parts = [];
  if (newTab) {
    parts.push('noopener noreferrer');
  }
  if (affiliate) {
    parts.push(LW_AFFILIATE_REL);
  }
  return parts.length ? parts.join(' ') : undefined;
}

/**
 * 編集画面のトグル。
 * 「新しいタブで開く」のすぐ下に置く。
 *
 * @param {Object}   props
 * @param {boolean}  props.checked
 * @param {Function} props.onChange
 */
function AffiliateToggle(_ref2) {
  var checked = _ref2.checked,
    onChange = _ref2.onChange;
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
    label: "\u5E83\u544A\u30EA\u30F3\u30AF\uFF08\u30A2\u30D5\u30A3\u30EA\u30A8\u30A4\u30C8\uFF09",
    checked: !!checked,
    onChange: onChange,
    help: "Amazon\u30FB\u697D\u5929\u306A\u3069\u306E\u3001\u6210\u679C\u5831\u916C\u304C\u767A\u751F\u3059\u308B\u30EA\u30F3\u30AF\u306E\u3068\u304D\u306B\u30AA\u30F3\u306B\u3057\u307E\u3059\u3002\u691C\u7D22\u30A8\u30F3\u30B8\u30F3\u306B\u5E83\u544A\u3060\u3068\u4F1D\u3048\u308B\u5370\u304C\u4ED8\u304D\u307E\u3059\uFF08rel=\"sponsored nofollow\"\uFF09\u3002\u30AA\u30F3\u306B\u3059\u308B\u3068\u65B0\u3057\u3044\u30BF\u30D6\u3067\u958B\u304F\u8A2D\u5B9A\u3082\u4E00\u7DD2\u306B\u5165\u308A\u307E\u3059\u3002"
  });
}

/***/ }),

/***/ "./src/link-picker.js":
/*!****************************!*\
  !*** ./src/link-picker.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LinkPicker: () => (/* binding */ LinkPicker),
/* harmony export */   linkTypeOptions: () => (/* binding */ linkTypeOptions),
/* harmony export */   lwLinkDataProps: () => (/* binding */ lwLinkDataProps),
/* harmony export */   lwLinkDataPropsFromAttrs: () => (/* binding */ lwLinkDataPropsFromAttrs),
/* harmony export */   lwLinkDataPropsFromItem: () => (/* binding */ lwLinkDataPropsFromItem),
/* harmony export */   lwLinkFromAttrs: () => (/* binding */ lwLinkFromAttrs),
/* harmony export */   lwLinkFromItem: () => (/* binding */ lwLinkFromItem),
/* harmony export */   lwLinkProps: () => (/* binding */ lwLinkProps),
/* harmony export */   lwLinkPropsFromAttrs: () => (/* binding */ lwLinkPropsFromAttrs),
/* harmony export */   lwLinkPropsFromItem: () => (/* binding */ lwLinkPropsFromItem),
/* harmony export */   lwLinkToAttrs: () => (/* binding */ lwLinkToAttrs),
/* harmony export */   lwLinkToItem: () => (/* binding */ lwLinkToItem),
/* harmony export */   lwLinkType: () => (/* binding */ lwLinkType)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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




/** 一度に出す候補の数 */
var LIST_LIMIT = 50;

/** リンク種別 */
var linkTypeOptions = [{
  label: "URLを直接入力",
  value: "url"
}, {
  label: "固定ページから選ぶ",
  value: "page"
}, {
  label: "カテゴリーから選ぶ",
  value: "category"
}];

/** 既存データ（linkType を持たないもの）は URL 指定として扱う */
function lwLinkType(link) {
  return link && link.linkType ? link.linkType : "url";
}

/**
 * save で <a> に渡す値を作る。
 * URL 指定のときは data 属性を undefined にして、従来どおりの出力に保つ。
 */
function lwLinkProps(link) {
  var type = lwLinkType(link);
  var href = link && link.url || "#";
  if (type === "page" && link && link.pageId) {
    return {
      href: href,
      linkType: "page",
      linkId: String(link.pageId)
    };
  }
  if (type === "category" && link && link.categoryId) {
    return {
      href: href,
      linkType: "category",
      linkId: String(link.categoryId)
    };
  }
  return {
    href: href,
    linkType: undefined,
    linkId: undefined
  };
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
function lwLinkDataProps(link) {
  var p = lwLinkProps(link);
  return {
    linkType: p.linkType,
    linkId: p.linkId
  };
}

/** 平たい属性版 */
function lwLinkDataPropsFromAttrs(attributes, keys) {
  return lwLinkDataProps(lwLinkFromAttrs(attributes, keys));
}

/** 配列（query 付き）の要素版 */
function lwLinkDataPropsFromItem(item) {
  var urlKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "url";
  return lwLinkDataProps(lwLinkFromItem(item, urlKey));
}

/** 編集画面のリンク設定UI */
function LinkPicker(_ref) {
  var link = _ref.link,
    _onChange = _ref.onChange,
    _ref$label = _ref.label,
    label = _ref$label === void 0 ? "リンク先の指定方法" : _ref$label;
  var type = lwLinkType(link);
  var isPage = type === "page";
  var isCategory = type === "category";
  var selectedId = isPage ? link && link.pageId || 0 : isCategory ? link && link.categoryId || 0 : 0;

  /* 打ち込んだ文字。debounced のほうだけをサーバーへ渡す */
  var _useDebouncedInput = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.useDebouncedInput)(""),
    _useDebouncedInput2 = _slicedToArray(_useDebouncedInput, 3),
    search = _useDebouncedInput2[0],
    setSearch = _useDebouncedInput2[1],
    debouncedSearch = _useDebouncedInput2[2];
  var _useSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
      var core = select("core");
      if (!isPage && !isCategory) return {
        records: [],
        selected: null,
        isLoading: false
      };
      var kind = isPage ? "postType" : "taxonomy";
      var name = isPage ? "page" : "category";
      var query = isPage ? {
        per_page: LIST_LIMIT,
        status: "publish",
        orderby: "title",
        order: "asc",
        _fields: "id,title,link"
      } : {
        per_page: LIST_LIMIT,
        orderby: "name",
        order: "asc",
        _fields: "id,name,link,count"
      };
      if (debouncedSearch) query.search = debouncedSearch;
      return {
        records: core.getEntityRecords(kind, name, query),
        /* 選択済みの項目は検索結果に入らないことがあるので単独で引く */
        selected: selectedId ? core.getEntityRecord(kind, name, selectedId) : null,
        isLoading: !core.hasFinishedResolution("getEntityRecords", [kind, name, query])
      };
    }, [isPage, isCategory, debouncedSearch, selectedId]),
    records = _useSelect.records,
    selected = _useSelect.selected,
    isLoading = _useSelect.isLoading;
  var labelOf = function labelOf(r) {
    if (!r) return "";
    if (isPage) return r.title && (r.title.rendered || r.title) || "(無題)";
    return r.name + "（" + (r.count !== undefined ? r.count + "件" : "") + "）";
  };
  var list = records || [];
  var options = list.map(function (r) {
    return {
      label: labelOf(r) + "  #" + r.id,
      value: String(r.id)
    };
  });
  /* 選択済みが候補に無ければ先頭に足す（名前が消えないように） */
  if (selectedId && selected && !options.some(function (o) {
    return o.value === String(selectedId);
  })) {
    options.unshift({
      label: labelOf(selected) + "  #" + selected.id,
      value: String(selectedId)
    });
  }
  var pick = function pick(v) {
    var id = v ? Number(v) : 0;
    var hit = list.find(function (r) {
      return String(r.id) === String(v);
    }) || (selected && String(selected.id) === String(v) ? selected : null);
    var url = hit && hit.link ? hit.link : "";
    _onChange(isPage ? {
      pageId: id,
      url: url
    } : {
      categoryId: id,
      url: url
    });
  };
  var listHelp = isLoading ? "読み込み中…" : list.length >= LIST_LIMIT ? "上位 " + LIST_LIMIT + " 件を表示しています。見つからないときは名前を打ち込んで絞り込んでください。" : debouncedSearch && list.length === 0 ? "見つかりませんでした。" : "名前の一部を打ち込むと絞り込めます。";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    label: label,
    value: type,
    options: linkTypeOptions,
    onChange: function onChange(v) {
      return _onChange({
        linkType: v
      });
    },
    help: helpText(type)
  }), (isPage || isCategory) && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ComboboxControl, {
    label: isPage ? "固定ページ" : "カテゴリー",
    value: selectedId ? String(selectedId) : null,
    options: options,
    onChange: pick,
    onFilterValueChange: setSearch,
    help: listHelp,
    allowReset: true
  }));
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
function lwLinkFromAttrs(attributes, keys) {
  return {
    linkType: attributes[keys.type],
    url: attributes[keys.url],
    pageId: attributes[keys.page],
    categoryId: attributes[keys.category]
  };
}

/** LinkPicker が返す差分 → 平たい属性名に直す */
function lwLinkToAttrs(patch, keys) {
  var out = {};
  if ("linkType" in patch) out[keys.type] = patch.linkType;
  if ("url" in patch) out[keys.url] = patch.url;
  if ("pageId" in patch) out[keys.page] = patch.pageId;
  if ("categoryId" in patch) out[keys.category] = patch.categoryId;
  return out;
}

/** 平たい属性から save 用の値を作る（lwLinkProps の平たい版） */
function lwLinkPropsFromAttrs(attributes, keys) {
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
function lwLinkFromItem(item) {
  var urlKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "url";
  var type = lwLinkType(item);
  var id = item && item.linkId ? Number(item.linkId) : 0;
  return {
    linkType: type,
    url: item && item[urlKey] || "",
    pageId: type === "page" ? id : 0,
    categoryId: type === "category" ? id : 0
  };
}

/** LinkPicker が返す差分 → 配列の要素に入れる形（linkId は文字列で持つ） */
function lwLinkToItem(patch) {
  var urlKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "url";
  var out = {};
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
function lwLinkPropsFromItem(item) {
  var urlKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "url";
  return lwLinkProps(lwLinkFromItem(item, urlKey));
}

/***/ }),

/***/ "./src/lw-button-1/index.js":
/*!**********************************!*\
  !*** ./src/lw-button-1/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/lw-button-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-button-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/lw-button-1/block.json");
/* harmony import */ var _link_picker_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../link-picker.js */ "./src/link-picker.js");
/* harmony import */ var _affiliate_link_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../affiliate-link.js */ "./src/affiliate-link.js");









/* リンク先の指定（共通部品）で使う属性名の対応 */
var LINK_KEYS = {
  url: 'url',
  type: 'linkType',
  page: 'pageId',
  category: 'categoryId'
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var buttonText = attributes.buttonText,
      url = attributes.url,
      openInNewTab = attributes.openInNewTab,
      fontSize = attributes.fontSize,
      maxWidth = attributes.maxWidth,
      maxWidthSp = attributes.maxWidthSp,
      backgroundColor = attributes.backgroundColor,
      textColor = attributes.textColor,
      paddingSize = attributes.paddingSize,
      innerPaddingSize = attributes.innerPaddingSize,
      marginTop = attributes.marginTop,
      marginBottom = attributes.marginBottom,
      alignment = attributes.alignment,
      alignmentSp = attributes.alignmentSp,
      borderRadius = attributes.borderRadius,
      borderWidth = attributes.borderWidth,
      borderColor = attributes.borderColor;
    var effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "wp-block-wdl-button-01 padding-".concat(paddingSize, " align-").concat(alignment, " align-sp-").concat(alignmentSp),
      style: {
        marginTop: "".concat(marginTop, "px"),
        marginBottom: "".concat(marginBottom, "px"),
        '--button-01-max-width-sp': "".concat(effectiveMaxWidthSp, "px")
      }
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u57FA\u672C\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '15px'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '8px',
        fontSize: '13px'
      }
    }, "\u30EA\u30F3\u30AF\u5148URL"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.URLInput, {
      value: url,
      onChange: function onChange(v) {
        return setAttributes({
          url: v
        });
      },
      style: {
        width: '100%'
      }
    }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.LinkPicker, {
      link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkFromAttrs)(attributes, LINK_KEYS),
      onChange: function onChange(patch) {
        return setAttributes((0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkToAttrs)(patch, LINK_KEYS));
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u65B0\u3057\u3044\u30BF\u30D6\u3067\u958B\u304F",
      checked: openInNewTab,
      onChange: function onChange() {
        return setAttributes({
          openInNewTab: !openInNewTab
        });
      }
    }), /*#__PURE__*/React.createElement(_affiliate_link_js__WEBPACK_IMPORTED_MODULE_7__.AffiliateToggle, {
      checked: attributes.isAffiliate,
      onChange: function onChange(v) {
        return setAttributes(v ? {
          isAffiliate: true,
          openInNewTab: true
        } : {
          isAffiliate: false
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u6A2A\u5E45 (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 100,
      max: 1000,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30B9\u30DE\u30DB\u3067\u306E\u30DC\u30BF\u30F3\u306E\u6A2A\u5E45 (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: maxWidthSp !== null ? maxWidthSp : maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthSp: v
        });
      },
      min: 100,
      max: 1000,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u89D2\u306E\u4E38\u307F (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: borderRadius,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadius: v
        });
      },
      min: 0,
      max: 100,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u6587\u5B57\u306E\u30B5\u30A4\u30BA (%)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: fontSize,
      onChange: function onChange(v) {
        return setAttributes({
          fontSize: v
        });
      },
      min: 85,
      max: 160,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '12px'
      }
    }, "\u30DC\u30BF\u30F3\u5185\u306E\u4F59\u767D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, ['S', 'M', 'L'].map(function (size) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        key: size,
        isPrimary: innerPaddingSize === size,
        onClick: function onClick() {
          return setAttributes({
            innerPaddingSize: size
          });
        }
      }, size === 'S' ? '小さめ' : size === 'M' ? '標準' : '大きめ');
    })))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: backgroundColor,
      onChange: function onChange(e) {
        return setAttributes({
          backgroundColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '15px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u6587\u5B57\u306E\u8272"), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: textColor,
      onChange: function onChange(e) {
        return setAttributes({
          textColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u914D\u7F6E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '12px'
      }
    }, "\u30D1\u30BD\u30B3\u30F3\u30FB\u30BF\u30D6\u30EC\u30C3\u30C8\u3067\u306E\u4F4D\u7F6E"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, [{
      label: '左寄せ',
      value: 'flex-start'
    }, {
      label: '中央',
      value: 'center'
    }, {
      label: '右寄せ',
      value: 'flex-end'
    }].map(function (opt) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        key: opt.value,
        isPrimary: alignment === opt.value,
        onClick: function onClick() {
          return setAttributes({
            alignment: opt.value
          });
        }
      }, opt.label);
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '12px'
      }
    }, "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u3067\u306E\u4F4D\u7F6E"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, [{
      label: '左寄せ',
      value: 'flex-start'
    }, {
      label: '中央',
      value: 'center'
    }, {
      label: '右寄せ',
      value: 'flex-end'
    }].map(function (opt) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        key: opt.value,
        isPrimary: alignmentSp === opt.value,
        onClick: function onClick() {
          return setAttributes({
            alignmentSp: opt.value
          });
        }
      }, opt.label);
    })))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4F59\u767D\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '15px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u4E0A\u306E\u4F59\u767D (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: marginTop,
      onChange: function onChange(v) {
        return setAttributes({
          marginTop: v
        });
      },
      min: 0,
      max: 100,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u4E0B\u306E\u4F59\u767D (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: marginBottom,
      onChange: function onChange(v) {
        return setAttributes({
          marginBottom: v
        });
      },
      min: 0,
      max: 100,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u67A0\u7DDA\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: borderWidth > 0 ? '15px' : '0px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u67A0\u7DDA\u306E\u592A\u3055 (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: borderWidth,
      onChange: function onChange(v) {
        return setAttributes({
          borderWidth: v
        });
      },
      min: 0,
      max: 20,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), borderWidth > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u67A0\u7DDA\u306E\u8272"), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: borderColor,
      onChange: function onChange(e) {
        return setAttributes({
          borderColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }
    })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "a",
      href: url,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      value: buttonText,
      onChange: function onChange(v) {
        return setAttributes({
          buttonText: v
        });
      },
      placeholder: "\u30DC\u30BF\u30F3\u306E\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B",
      multiline: false,
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        fontSize: "".concat(fontSize, "%"),
        backgroundColor: backgroundColor,
        color: textColor,
        padding: innerPaddingSize === 'S' ? '0.7em 1em' : innerPaddingSize === 'M' ? '0.9em 1.4em' : '1.3em 1.6em',
        textAlign: 'center',
        textDecoration: 'none',
        borderRadius: "".concat(borderRadius, "px"),
        borderWidth: "".concat(borderWidth, "px"),
        borderStyle: borderWidth > 0 ? 'solid' : 'none',
        borderColor: borderColor
      }
    })));
  },
  save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var buttonText = attributes.buttonText,
      url = attributes.url,
      openInNewTab = attributes.openInNewTab,
      isAffiliate = attributes.isAffiliate,
      fontSize = attributes.fontSize,
      maxWidth = attributes.maxWidth,
      maxWidthSp = attributes.maxWidthSp,
      backgroundColor = attributes.backgroundColor,
      textColor = attributes.textColor,
      paddingSize = attributes.paddingSize,
      innerPaddingSize = attributes.innerPaddingSize,
      marginTop = attributes.marginTop,
      marginBottom = attributes.marginBottom,
      alignment = attributes.alignment,
      alignmentSp = attributes.alignmentSp,
      borderRadius = attributes.borderRadius,
      borderWidth = attributes.borderWidth,
      borderColor = attributes.borderColor;
    var effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "wp-block-wdl-button-01 padding-".concat(paddingSize, " align-").concat(alignment, " align-sp-").concat(alignmentSp),
      style: {
        marginTop: "".concat(marginTop, "px"),
        marginBottom: "".concat(marginBottom, "px"),
        '--button-01-max-width-sp': "".concat(effectiveMaxWidthSp, "px")
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("a", {
      href: url,
      "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS).linkType,
      "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS).linkId,
      target: openInNewTab ? '_blank' : undefined,
      rel: (0,_affiliate_link_js__WEBPACK_IMPORTED_MODULE_7__.lwRel)({
        newTab: openInNewTab,
        affiliate: isAffiliate
      }),
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        fontSize: "".concat(fontSize, "%"),
        backgroundColor: backgroundColor,
        color: textColor,
        padding: innerPaddingSize === 'S' ? '0.7em 1em' : innerPaddingSize === 'M' ? '0.9em 1.4em' : '1.3em 1.6em',
        textAlign: 'center',
        textDecoration: 'none',
        borderRadius: "".concat(borderRadius, "px"),
        borderWidth: "".concat(borderWidth, "px"),
        borderStyle: borderWidth > 0 ? 'solid' : 'none',
        borderColor: borderColor
      },
      dangerouslySetInnerHTML: {
        __html: buttonText
      }
    }));
  }
});

/***/ }),

/***/ "./src/lw-button-1/editor.scss":
/*!*************************************!*\
  !*** ./src/lw-button-1/editor.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-button-1/style.scss":
/*!************************************!*\
  !*** ./src/lw-button-1/style.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "./src/lw-button-1/block.json":
/*!************************************!*\
  !*** ./src/lw-button-1/block.json ***!
  \************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-button-01","version":"1.0.0","title":"リンクボタン 01","category":"lw-button","icon":"button","description":"カスタマイズ可能なリンクボタン","supports":{"anchor":true},"aiHint":{"description":"基本リンクボタン。テキスト+URL。サイズ・色・角丸を細かくカスタマイズ可能","excludeFromAutoSelect":false,"contentAttributes":["buttonText","url"],"imageAttributes":[]},"attributes":{"isAffiliate":{"type":"boolean","default":false},"buttonText":{"type":"string","source":"html","selector":"a","default":"詳細はこちら","aiHint":{"role":"button","contentGuide":"動詞形。4〜10文字","example":"詳細を見る"}},"url":{"type":"string","source":"attribute","selector":"a","attribute":"href","default":"","aiHint":{"role":"url","contentGuide":"遷移先URL。#contact や /about/ 等"}},"linkType":{"type":"string","default":"url"},"pageId":{"type":"number","default":0},"categoryId":{"type":"number","default":0},"openInNewTab":{"type":"boolean","default":false,"aiHint":{"skip":true}},"fontSize":{"type":"number","default":100,"aiHint":{"skip":true}},"maxWidth":{"type":"number","default":240,"aiHint":{"skip":true}},"maxWidthSp":{"type":"number","default":null,"aiHint":{"skip":true}},"backgroundColor":{"type":"string","default":"var(--color-main)","aiHint":{"skip":true}},"textColor":{"type":"string","default":"#ffffff","aiHint":{"skip":true}},"paddingSize":{"type":"string","default":"M","aiHint":{"skip":true}},"innerPaddingSize":{"type":"string","default":"M","aiHint":{"skip":true}},"marginTop":{"type":"number","default":10,"aiHint":{"skip":true}},"marginBottom":{"type":"number","default":10,"aiHint":{"skip":true}},"alignment":{"type":"string","default":"center","aiHint":{"skip":true}},"alignmentSp":{"type":"string","default":"center","aiHint":{"skip":true}},"borderRadius":{"type":"number","default":0,"aiHint":{"skip":true}},"borderWidth":{"type":"number","default":0,"aiHint":{"skip":true}},"borderColor":{"type":"string","default":"#000000","aiHint":{"skip":true}}},"editorScript":"file:./lw-button-1.js","no":1}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"lw-button-1": 0,
/******/ 			"./style-lw-button-1": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkblock_dev"] = self["webpackChunkblock_dev"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-button-1"], () => (__webpack_require__("./src/lw-button-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;