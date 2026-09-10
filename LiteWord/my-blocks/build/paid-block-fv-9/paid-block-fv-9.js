/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/paid-block-fv-9/index.js":
/*!**************************************!*\
  !*** ./src/paid-block-fv-9/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-fv-9/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-fv-9/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-fv-9/block.json");
/* harmony import */ var _link_picker_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../link-picker.js */ "./src/link-picker.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*************************************************************************
 * LiteWord – Paid Block  FV 09 : full‑width / fixed‑width Swiper slider *
 * 2025‑04‑17 改訂版                                                     *
 ************************************************************************/









/* リンク先の指定（共通部品）で使う、配列の要素の中のキー名 */
var LINK_KEYS = {
  url: 'linkUrl',
  type: 'linkType',
  page: 'pageId',
  category: 'categoryId'
};

// ★ HTTPをHTTPSに変換するヘルパー関数を追加
var ensureHttps = function ensureHttps(url) {
  if (!url) return url;

  // 現在のページがHTTPSで、URLがHTTPの場合のみ変換
  if (window.location.protocol === 'https:' && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  // プロトコル相対URLに変換する方法も可能
  // return url.replace(/^https?:/, '');

  return url;
};

/* save は deprecated からも使うので先に名前を付ける（本文をひとつだけ持ち、写し間違いを防ぐ） */
var saveBlockFv9 = function saveBlockFv9(_ref) {
  var attributes = _ref.attributes;
  var blockId = attributes.blockId,
    slides = attributes.slides,
    layoutType = attributes.layoutType,
    maxWidth = attributes.maxWidth,
    autoplayDelay = attributes.autoplayDelay,
    sliderEffect = attributes.sliderEffect,
    crossFade = attributes.crossFade,
    loop = attributes.loop,
    disableOnInteraction = attributes.disableOnInteraction,
    showPagination = attributes.showPagination,
    paginationClickable = attributes.paginationClickable,
    showNavigation = attributes.showNavigation,
    sliderSpeed = attributes.sliderSpeed,
    paginationColor = attributes.paginationColor,
    nextButtonColor = attributes.nextButtonColor;
  var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    id: blockId,
    className: layoutType === 'full' ? 'swiper paid-block-fv-9 max-w init-hide' : 'swiper paid-block-fv-9 init-hide',
    style: layoutType === 'fixed' ? {
      maxWidth: maxWidth
    } : {
      maxWidth: '100vw'
    }
  });

  /* ---------- Swiper 設定文字列（observer 追加） ---------------*/
  /* 🚨 2026-08-26: 自分の要素を "#" + blockId でしか探せなかった。
   *   blockId が空のまま保存されたマークアップ（ページテンプレート・AI生成）だと
   *   セレクタが "#" だけになり querySelector が例外を投げる。その結果 init-hide が
   *   外れず、フロントで高さ0＝真っ白になっていた（2026-08-26 に実測）。
   *   🚨 blockId があるときの出力は1バイトも変えないこと。変えると既存ページが
   *      編集画面で「ブロックが壊れています」になる（save() の出力がそのまま検証対象のため）。 */
  var rootFinder = blockId ? "const selector = \"#".concat(blockId, "\";") : ['var _sc = document.currentScript;', 'var _root = ( _sc && _sc.closest ) ? _sc.closest(".paid-block-fv-9") : null;', 'if ( !_root ) _root = document.querySelector(".paid-block-fv-9:not([data-lw-init])");', 'if ( !_root ) return;', '_root.setAttribute("data-lw-init","1");', 'if ( !_root.id ) _root.id = "paid-block-fv-9-" + Math.random().toString(36).slice(2,10);', 'const selector = "#" + _root.id;'].join(String.fromCharCode(10));
  /* 色の指定も同じ理由。blockId が無いときはクラスで当てる */
  var cssRoot = blockId ? "#".concat(blockId) : '.paid-block-fv-9';
  var swiperConfig = "\n(function(){\n".concat(rootFinder, "\nconst MAX_RETRY = 30; // 30 \xD7 150ms = 4.5s\nlet retry = 0;\n\nconst initSwiper = () => {\n    if ( typeof Swiper === \"undefined\" ) return false;\n    const already = document.querySelector(selector).swiper;\n    if ( already ) return true; // \u4E8C\u91CD\u521D\u671F\u5316\u3057\u306A\u3044\n\n    const config = {\n        loop: ").concat(loop, ",\n        effect: \"").concat(sliderEffect, "\",\n        speed: ").concat(sliderSpeed, ",\n        autoplay: {\n            delay: ").concat(autoplayDelay, ",\n            disableOnInteraction: ").concat(disableOnInteraction, "\n        },\n        observer: true,\n        observeParents: true,\n        ").concat(sliderEffect === 'fade' ? "fadeEffect: { crossFade: ".concat(crossFade, " },") : '', "\n        ").concat(showPagination ? "\n            pagination: {\n                el: selector + \" .swiper-pagination\",\n                clickable: ".concat(paginationClickable, "\n            },") : '', "\n        ").concat(showNavigation ? "\n            navigation: {\n                nextEl: selector + \" .swiper-button-next\",\n                prevEl: selector + \" .swiper-button-prev\"\n            }," : '', "\n    };\n    new Swiper( selector, config );\n    document.querySelector(selector).classList.remove(\"init-hide\");\n    return true;\n};\n\n/* \u2460 DOMContentLoaded \u76F4\u5F8C */\ndocument.addEventListener(\"DOMContentLoaded\", initSwiper, { once:true });\n\n/* \u2461 lw:swiperReady (\u65E2\u5B58\u4ED5\u7D44\u307F\u7DAD\u6301) */\nwindow.addEventListener(\"lw:swiperReady\", initSwiper, { once:true });\n\n/* \u2462 \u30DD\u30FC\u30EA\u30F3\u30B0\uFF08Swiper\u8AAD\u307F\u8FBC\u307F\u9045\u5EF6\u5BFE\u7B56\uFF09 */\nconst timer = setInterval(() => {\n    if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);\n}, 150);\n\n/* \u2463 \u305D\u308C\u3067\u3082\u5931\u6557\u3057\u305F\u3089 5s \u3067 init-hide \u3092\u89E3\u9664\u3057 static \u753B\u50CF\u8868\u793A */\nsetTimeout(() => {\n    const el = document.querySelector(selector);\n    if ( el ) el.classList.remove(\"init-hide\");\n}, 5000);\n})();\n    ");

  /* ---------- JSX 出力 -----------------------------------------*/
  return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
    className: "swiper-wrapper"
  }, slides.map(function (slide, i) {
    // ★ フロントエンドでもHTTPS変換を適用（念のため）
    var pcImgUrl = ensureHttps(slide.pcImgUrl);
    var spImgUrl = ensureHttps(slide.spImgUrl || slide.pcImgUrl);
    var picture = /*#__PURE__*/React.createElement("picture", {
      className: "bg_img"
    }, /*#__PURE__*/React.createElement("source", {
      srcSet: spImgUrl,
      media: "(max-width:800px)"
    }), /*#__PURE__*/React.createElement("source", {
      srcSet: pcImgUrl,
      media: "(min-width:801px)"
    }), /*#__PURE__*/React.createElement("img", {
      src: pcImgUrl,
      alt: slide.altText
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "swiper-slide",
      key: i
    }, slide.linkUrl ? /*#__PURE__*/React.createElement("a", {
      href: slide.linkUrl,
      "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_7__.lwLinkDataPropsFromAttrs)(slide, LINK_KEYS).linkType,
      "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_7__.lwLinkDataPropsFromAttrs)(slide, LINK_KEYS).linkId,
      target: "_blank",
      rel: "noopener noreferrer"
    }, picture) : picture);
  })), showPagination && /*#__PURE__*/React.createElement("div", {
    className: "swiper-pagination"
  }), showNavigation && /*#__PURE__*/React.createElement("div", {
    className: "swiper-button-prev"
  }), showNavigation && /*#__PURE__*/React.createElement("div", {
    className: "swiper-button-next"
  }), /*#__PURE__*/React.createElement("script", {
    type: "text/javascript",
    dangerouslySetInnerHTML: {
      __html: swiperConfig
    }
  }), showPagination && paginationColor && /*#__PURE__*/React.createElement("style", null, "\n                    ".concat(cssRoot, " .swiper-pagination-bullet { background-color:").concat(paginationColor, "; }\n                    ").concat(cssRoot, " .swiper-button-next,\n                    ").concat(cssRoot, " .swiper-button-prev { color:").concat(nextButtonColor, "; }\n                ")), /*#__PURE__*/React.createElement("noscript", null, /*#__PURE__*/React.createElement("style", null, "".concat(cssRoot, "{opacity:1!important}"))));
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  // ------------------------------------------------------------------
  // ▶ Edit
  // ------------------------------------------------------------------
  edit: function edit(_ref2) {
    var attributes = _ref2.attributes,
      setAttributes = _ref2.setAttributes;
    var blockId = attributes.blockId,
      slides = attributes.slides,
      layoutType = attributes.layoutType,
      maxWidth = attributes.maxWidth,
      autoplayDelay = attributes.autoplayDelay,
      sliderEffect = attributes.sliderEffect,
      crossFade = attributes.crossFade,
      loop = attributes.loop,
      disableOnInteraction = attributes.disableOnInteraction,
      showPagination = attributes.showPagination,
      paginationClickable = attributes.paginationClickable,
      showNavigation = attributes.showNavigation,
      sliderSpeed = attributes.sliderSpeed,
      paginationColor = attributes.paginationColor,
      nextButtonColor = attributes.nextButtonColor;

    /* ID を確定させる ------------------------------------------------*/
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!blockId) {
        var uniqueId = "paid-block-fv-9-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        setAttributes({
          blockId: uniqueId
        });
      }
    }, []);

    /* スライド編集ヘルパー ----------------------------------------*/
    var updateSlide = function updateSlide(index, key, value) {
      // ★ URL更新時はHTTPS変換を適用
      var processedValue = key === 'pcImgUrl' || key === 'spImgUrl' ? ensureHttps(value) : value;
      var newSlides = slides.map(function (slide, i) {
        return i === index ? _objectSpread(_objectSpread({}, slide), {}, _defineProperty({}, key, processedValue)) : slide;
      });
      setAttributes({
        slides: newSlides
      });
    };

    /* リンク設定のように複数のキーをまとめて入れ替える用 */
    var updateSlideMulti = function updateSlideMulti(i, patch) {
      setAttributes({
        slides: slides.map(function (it, k) {
          return k === i ? _objectSpread(_objectSpread({}, it), patch) : it;
        })
      });
    };
    var addSlide = function addSlide() {
      if (slides.length < 20) {
        setAttributes({
          slides: [].concat(_toConsumableArray(slides), [{
            pcImgUrl: '',
            spImgUrl: '',
            altText: '',
            linkUrl: ''
          }])
        });
      }
    };
    var removeSlide = function removeSlide(index) {
      if (slides.length > 1) {
        setAttributes({
          slides: slides.filter(function (_, i) {
            return i !== index;
          })
        });
      }
    };

    /* スライドの順番を入れ替える */
    var moveSlide = function moveSlide(index, direction) {
      var newIndex = index + direction;
      if (newIndex < 0 || newIndex >= slides.length) return;
      var newSlides = _toConsumableArray(slides);
      var temp = newSlides[index];
      newSlides[index] = newSlides[newIndex];
      newSlides[newIndex] = temp;
      setAttributes({
        slides: newSlides
      });
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      id: blockId,
      className: layoutType === 'full' ? 'swiper paid-block-fv-9 max-w' : 'swiper paid-block-fv-9',
      style: layoutType === 'fixed' ? {
        maxWidth: maxWidth
      } : {}
    });

    /* --------------------------------------------------------------*/
    /* Gutenberg サイドバー                                           */
    /* --------------------------------------------------------------*/
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=tCEO9QA-hCI",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u5E45\u306E\u8A2D\u5B9A",
      value: layoutType,
      options: [{
        label: '固定幅',
        value: 'fixed'
      }, {
        label: '画面いっぱい（固定ページの時のみ）',
        value: 'full'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          layoutType: v
        });
      }
    }), layoutType === 'fixed' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45 (px)",
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 600,
      max: 2000,
      step: 10
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C9\u753B\u50CF",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: addSlide,
      disabled: slides.length >= 20
    }, "\u30B9\u30E9\u30A4\u30C9\u3092\u8FFD\u52A0 (\u6700\u592720\u679A)"), slides.map(function (slide, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: {
          border: '1px solid #ddd',
          padding: '10px',
          marginTop: '10px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          margin: 0
        }
      }, /*#__PURE__*/React.createElement("strong", null, "\u30B9\u30E9\u30A4\u30C9 ", index + 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: "arrow-up-alt",
        onClick: function onClick() {
          return moveSlide(index, -1);
        },
        disabled: index === 0,
        label: "\u4E0A\u3078\u79FB\u52D5",
        size: "small"
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: "arrow-down-alt",
        onClick: function onClick() {
          return moveSlide(index, 1);
        },
        disabled: index === slides.length - 1,
        label: "\u4E0B\u3078\u79FB\u52D5",
        size: "small"
      }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(media) {
          // ★ HTTPS変換を適用
          var secureUrl = ensureHttps(media.url);
          updateSlide(index, 'pcImgUrl', secureUrl);
        },
        allowedTypes: ['image'],
        render: function render(_ref3) {
          var open = _ref3.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "PC\u7528\u753B\u50CF"), slide.pcImgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: ensureHttps(slide.pcImgUrl),
            alt: "",
            style: {
              maxWidth: '100%'
            }
          }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            variant: "secondary",
            style: {
              marginTop: '10px'
            }
          }, "\u753B\u50CF\u3092\u5909\u66F4"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: function onClick() {
              return updateSlide(index, 'pcImgUrl', '');
            },
            variant: "secondary",
            style: {
              marginLeft: '10px',
              marginTop: '10px'
            }
          }, "\u524A\u9664")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            variant: "secondary"
          }, "\u753B\u50CF\u3092\u9078\u629E"));
        }
      }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(m) {
          // ★ HTTPS変換を適用
          var secureUrl = ensureHttps(m.url);
          updateSlide(index, 'spImgUrl', secureUrl);
        },
        allowedTypes: ['image'],
        render: function render(_ref4) {
          var open = _ref4.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u30B9\u30DE\u30DB\u7528\u753B\u50CF(\u4EFB\u610F)"), slide.spImgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: ensureHttps(slide.spImgUrl),
            alt: "",
            style: {
              maxWidth: '100%'
            }
          }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            variant: "secondary",
            style: {
              marginTop: '10px'
            }
          }, "\u753B\u50CF\u3092\u5909\u66F4"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: function onClick() {
              return updateSlide(index, 'spImgUrl', '');
            },
            variant: "secondary",
            style: {
              marginLeft: '10px',
              marginTop: '10px'
            }
          }, "\u524A\u9664")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            variant: "secondary"
          }, "\u753B\u50CF\u3092\u9078\u629E"));
        }
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "alt\u30C6\u30AD\u30B9\u30C8",
        value: slide.altText,
        onChange: function onChange(v) {
          return updateSlide(index, 'altText', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AF\u5148URL (\u4EFB\u610F)",
        value: slide.linkUrl,
        onChange: function onChange(v) {
          return updateSlide(index, 'linkUrl', v);
        }
      }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_7__.LinkPicker, {
        link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_7__.lwLinkFromAttrs)(slide, LINK_KEYS),
        onChange: function onChange(patch) {
          return updateSlideMulti(index, (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_7__.lwLinkToAttrs)(patch, LINK_KEYS));
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeSlide(index);
        },
        disabled: slides.length <= 1,
        style: {
          marginTop: '10px'
        }
      }, "\u3053\u306E\u30B9\u30E9\u30A4\u30C9\u3092\u524A\u9664"));
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u8A73\u7D30\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30AA\u30FC\u30C8\u30D7\u30EC\u30A4\u306E\u9045\u5EF6 (\u30DF\u30EA\u79D2)",
      value: autoplayDelay,
      onChange: function onChange(v) {
        return setAttributes({
          autoplayDelay: v
        });
      },
      min: 100,
      max: 10000,
      step: 100
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5207\u308A\u66FF\u3048\u901F\u5EA6 (\u30DF\u30EA\u79D2)",
      value: sliderSpeed,
      onChange: function onChange(v) {
        return setAttributes({
          sliderSpeed: v
        });
      },
      min: 100,
      max: 5000,
      step: 100
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u30A8\u30D5\u30A7\u30AF\u30C8",
      value: sliderEffect,
      options: [{
        label: 'フェード',
        value: 'fade'
      }, {
        label: 'スライド',
        value: 'slide'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          sliderEffect: v
        });
      }
    }), sliderEffect === 'fade' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "CrossFade\u3092\u6709\u52B9\u306B\u3059\u308B",
      checked: crossFade,
      onChange: function onChange(v) {
        return setAttributes({
          crossFade: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30EB\u30FC\u30D7\u518D\u751F",
      checked: loop,
      onChange: function onChange(v) {
        return setAttributes({
          loop: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30E6\u30FC\u30B6\u30FC\u64CD\u4F5C\u3067\u30AA\u30FC\u30C8\u30D7\u30EC\u30A4\u505C\u6B62",
      help: "true \u306B\u3059\u308B\u3068\u30E6\u30FC\u30B6\u30FC\u64CD\u4F5C\u5F8C\u306B\u81EA\u52D5\u518D\u751F\u304C\u6B62\u307E\u308A\u307E\u3059",
      checked: disableOnInteraction,
      onChange: function onChange(v) {
        return setAttributes({
          disableOnInteraction: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3/\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\u3092\u8868\u793A",
      checked: showPagination,
      onChange: function onChange(v) {
        return setAttributes({
          showPagination: v
        });
      }
    }), showPagination && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u53EF\u80FD\u306B\u3059\u308B",
      checked: paginationClickable,
      onChange: function onChange(v) {
        return setAttributes({
          paginationClickable: v
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: paginationColor,
      onChangeComplete: function onChangeComplete(c) {
        return setAttributes({
          paginationColor: c.hex
        });
      },
      disableAlpha: true
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u524D\u3078/\u6B21\u3078\u30DC\u30BF\u30F3\u3092\u8868\u793A",
      checked: showNavigation,
      onChange: function onChange(v) {
        return setAttributes({
          showNavigation: v
        });
      }
    }), showNavigation && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "\u524D\u3078/\u6B21\u3078\u30DC\u30BF\u30F3\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: nextButtonColor,
      onChangeComplete: function onChangeComplete(c) {
        return setAttributes({
          nextButtonColor: c.hex
        });
      },
      disableAlpha: true
    })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "swiper-wrapper"
    }, slides.length > 0 && function () {
      var slide = slides[0];
      var pcImg = ensureHttps(slide.pcImgUrl);
      var spImg = ensureHttps(slide.spImgUrl || slide.pcImgUrl);
      return /*#__PURE__*/React.createElement("div", {
        className: "swiper-slide",
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement("picture", {
        className: "bg_img"
      }, /*#__PURE__*/React.createElement("source", {
        srcSet: spImg,
        media: "(max-width:800px)"
      }), /*#__PURE__*/React.createElement("source", {
        srcSet: pcImg,
        media: "(min-width:801px)"
      }), /*#__PURE__*/React.createElement("img", {
        src: pcImg,
        alt: slide.altText
      })));
    }()), showPagination && /*#__PURE__*/React.createElement("div", {
      className: "swiper-pagination"
    }), showNavigation && /*#__PURE__*/React.createElement("div", {
      className: "swiper-button-next"
    })), showPagination && paginationColor && /*#__PURE__*/React.createElement("style", null, "\n                        #".concat(blockId, " .swiper-pagination-bullet { background-color:").concat(paginationColor, "; }\n                        #").concat(blockId, " .swiper-button-next,\n                        #").concat(blockId, " .swiper-button-prev { color:").concat(nextButtonColor, "; }\n                    ")));
  },
  // ------------------------------------------------------------------
  // ▶ Save
  // ------------------------------------------------------------------
  save: saveBlockFv9,
  /* 2026-08-23: slides の既定に入っていた見本の alt（「スライド1のalt」など）をやめて空にした。
   * それより前に作られたページは slides を既定のまま（＝本文に書かずに）保存していることがあり、
   * 新しい既定で読むと alt が変わって「無効なコンテンツ」になる。ここで旧既定を持たせて読めるようにする。
   * 出力するHTMLは同じなので save は使い回す。
   * ⚠️ この deprecated を消すと、449サイトの既存ページが編集画面で壊れる。 */
  deprecated: [{
    attributes: _objectSpread(_objectSpread({}, _block_json__WEBPACK_IMPORTED_MODULE_6__.attributes), {}, {
      slides: _objectSpread(_objectSpread({}, _block_json__WEBPACK_IMPORTED_MODULE_6__.attributes.slides), {}, {
        "default": [{
          "pcImgUrl": "https://liteword-assets.bigi-ishikawa.workers.dev/t/sample/slide/1.webp",
          "spImgUrl": "",
          "altText": "スライド1のalt",
          "linkUrl": ""
        }, {
          "pcImgUrl": "https://liteword-assets.bigi-ishikawa.workers.dev/t/sample/slide/2.webp",
          "spImgUrl": "",
          "altText": "スライド2のalt",
          "linkUrl": ""
        }]
      })
    }),
    save: saveBlockFv9
  }]
});

/***/ }),

/***/ "./src/paid-block-fv-9/editor.scss":
/*!*****************************************!*\
  !*** ./src/paid-block-fv-9/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-fv-9/style.scss":
/*!****************************************!*\
  !*** ./src/paid-block-fv-9/style.scss ***!
  \****************************************/
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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./src/paid-block-fv-9/block.json":
/*!****************************************!*\
  !*** ./src/paid-block-fv-9/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-fv-9","version":"1.0.0","title":"FV 09 画像スライダー用ブロック","category":"lw-firstview","icon":"images-alt2","editorScript":"file:./paid-block-fv-9.js","aiHint":{"description":"画像スライダーFV。複数画像を自動切替。テキストなし。ビジュアル重視のトップページに","excludeFromAutoSelect":true,"excludeReason":"テキスト属性がほぼなく画像URLの配列のみ。AI生成に不向き","contentAttributes":[],"imageAttributes":["slides"],"notes":"🚨 blockId に一意の文字列（例 \\"paid-block-fv-9-20260826-01\\"）を必ず入れる。空のままだと外側の div に id が付かず、スライダーの初期化セレクタ（#blockId）が一致しないため init-hide クラスが外れず、フロントで高さ0の真っ白になる（2026-08-26 に実機で確認）。 このブロックは画像だけのスライダーで文字を持たない。見出しを出したいときは paid-block-fv-11 を使う。"},"supports":{"anchor":true},"attributes":{"blockId":{"type":"string"},"slides":{"type":"array","default":[{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sample/slide/1.webp","spImgUrl":"","altText":"","linkUrl":""},{"pcImgUrl":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sample/slide/2.webp","spImgUrl":"","altText":"","linkUrl":""}]},"layoutType":{"type":"string","default":"full"},"maxWidth":{"type":"number","default":1200},"autoplayDelay":{"type":"number","default":3000},"sliderEffect":{"type":"string","default":"fade"},"crossFade":{"type":"boolean","default":true},"loop":{"type":"boolean","default":true},"disableOnInteraction":{"type":"boolean","default":false},"showPagination":{"type":"boolean","default":true},"paginationClickable":{"type":"boolean","default":true},"showNavigation":{"type":"boolean","default":true},"sliderSpeed":{"type":"number","default":1000},"paginationColor":{"type":"string","default":"#ffffff"},"nextButtonColor":{"type":"string","default":"#ffffff"}},"no":9}');

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
/******/ 			"paid-block-fv-9": 0,
/******/ 			"./style-paid-block-fv-9": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-fv-9"], () => (__webpack_require__("./src/paid-block-fv-9/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;