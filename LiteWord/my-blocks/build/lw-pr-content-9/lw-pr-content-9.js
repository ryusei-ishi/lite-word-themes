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

/***/ "./src/lw-pr-content-9/index.js":
/*!**************************************!*\
  !*** ./src/lw-pr-content-9/index.js ***!
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-content-9/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-pr-content-9/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-content-9/block.json");
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
 * LiteWord – lw-pr-content-9 : カードスライダー（Swiper）              *
 ************************************************************************/









/* リンク先の指定（共通部品）で使う、配列の要素の中のキー名 */
var LINK_KEYS = {
  url: 'linkUrl',
  type: 'linkType',
  page: 'pageId',
  category: 'categoryId'
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  // ------------------------------------------------------------------
  // ▶ Edit
  // ------------------------------------------------------------------
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var blockId = attributes.blockId,
      slides = attributes.slides,
      autoplay = attributes.autoplay;

    /* ID を確定させる -----------------------------------------------*/
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!blockId) {
        var uniqueId = "lw-pr-content-9-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        setAttributes({
          blockId: uniqueId
        });
      }
    }, []);

    /* スライド編集ヘルパー -----------------------------------------*/
    var updateSlide = function updateSlide(index, key, value) {
      var newSlides = slides.map(function (slide, i) {
        return i === index ? _objectSpread(_objectSpread({}, slide), {}, _defineProperty({}, key, value)) : slide;
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
            imgUrl: '',
            altText: '',
            title: 'タイトルテキスト',
            description: '説明テキストが入ります。',
            linkUrl: '',
            openNewTab: false
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
    var moveSlideUp = function moveSlideUp(index) {
      if (index === 0) return;
      var newSlides = _toConsumableArray(slides);
      var _ref2 = [newSlides[index], newSlides[index - 1]];
      newSlides[index - 1] = _ref2[0];
      newSlides[index] = _ref2[1];
      setAttributes({
        slides: newSlides
      });
    };
    var moveSlideDown = function moveSlideDown(index) {
      if (index === slides.length - 1) return;
      var newSlides = _toConsumableArray(slides);
      var _ref3 = [newSlides[index + 1], newSlides[index]];
      newSlides[index] = _ref3[0];
      newSlides[index + 1] = _ref3[1];
      setAttributes({
        slides: newSlides
      });
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      id: blockId,
      className: 'lw-pr-content-9'
    });

    /* ----------------------------------------------------------*/
    /* Gutenberg サイドバー                                       */
    /* ----------------------------------------------------------*/
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C0\u30FC\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u81EA\u52D5\u518D\u751F",
      checked: autoplay,
      onChange: function onChange(v) {
        return setAttributes({
          autoplay: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C9\u7BA1\u7406",
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
      }, /*#__PURE__*/React.createElement("strong", null, "\u30B9\u30E9\u30A4\u30C9 ", index + 1), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: '4px'
        }
      }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: function onClick() {
          return moveSlideUp(index);
        },
        disabled: index === 0,
        style: {
          width: '32px',
          height: '32px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, "\u2191"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: function onClick() {
          return moveSlideDown(index);
        },
        disabled: index === slides.length - 1,
        style: {
          width: '32px',
          height: '32px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, "\u2193"))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(media) {
          return updateSlide(index, 'imgUrl', media.url);
        },
        allowedTypes: ['image'],
        render: function render(_ref4) {
          var open = _ref4.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "\u753B\u50CF"), slide.imgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: slide.imgUrl,
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
              return updateSlide(index, 'imgUrl', '');
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
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "alt\u30C6\u30AD\u30B9\u30C8",
        value: slide.altText,
        onChange: function onChange(v) {
          return updateSlide(index, 'altText', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
        label: "\u30BF\u30A4\u30C8\u30EB (h3)",
        value: slide.title,
        onChange: function onChange(v) {
          return updateSlide(index, 'title', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
        label: "\u8AAC\u660E\u6587",
        value: slide.description,
        onChange: function onChange(v) {
          return updateSlide(index, 'description', v);
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
      }), slide.linkUrl && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
        label: "\u65B0\u898F\u30BF\u30D6\u3067\u958B\u304F",
        checked: slide.openNewTab,
        onChange: function onChange(v) {
          return updateSlide(index, 'openNewTab', v);
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
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-content-9__wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-content-9-swiper",
      style: {
        display: 'flex',
        gap: '24px',
        overflow: 'hidden'
      }
    }, slides.map(function (slide, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: '0 0 calc(25% - 18px)',
          minWidth: '0'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "image"
      }, slide.imgUrl ? /*#__PURE__*/React.createElement("img", {
        src: slide.imgUrl,
        alt: slide.altText
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          background: '#eee',
          width: '100%',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '14px'
        }
      }, "\u753B\u50CF\u672A\u8A2D\u5B9A")), /*#__PURE__*/React.createElement("h3", null, slide.title), /*#__PURE__*/React.createElement("p", null, slide.description)));
    })))));
  },
  // ------------------------------------------------------------------
  // ▶ Save
  // ------------------------------------------------------------------
  save: function save(_ref5) {
    var attributes = _ref5.attributes;
    var blockId = attributes.blockId,
      slides = attributes.slides,
      autoplay = attributes.autoplay;

    /* 改行を <br> に変換するヘルパー */
    var nl2br = function nl2br(text) {
      if (!text) return null;
      return text.split('\n').reduce(function (acc, line, i) {
        if (i > 0) acc.push( /*#__PURE__*/React.createElement("br", {
          key: "br-".concat(i)
        }));
        acc.push(line);
        return acc;
      }, []);
    };
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      id: blockId,
      className: 'lw-pr-content-9 init-hide'
    });

    /* ---------- Swiper 設定文字列 --------------------------------*/
    /* 🚨 2026-08-26: 自分の要素を "#" + blockId でしか探せなかった。
     *   blockId が空のまま保存されたマークアップ（ページテンプレート・AI生成）だと
     *   セレクタが "#" だけになり querySelector が例外を投げ、init-hide が外れず
     *   フロントで高さ0＝真っ白になっていた（2026-08-26 に実測）。
     *   🚨 blockId があるときの出力は1バイトも変えないこと（既存ページの検証が壊れる）。 */
    var rootFinder = blockId ? "    var selector = \"#".concat(blockId, " .lw-pr-content-9-swiper\";") : ['    var _sc = document.currentScript;', '    var _root = ( _sc && _sc.closest ) ? _sc.closest(".lw-pr-content-9") : null;', '    if ( !_root ) _root = document.querySelector(".lw-pr-content-9:not([data-lw-init])");', '    if ( !_root ) return;', '    _root.setAttribute("data-lw-init","1");', '    if ( !_root.id ) _root.id = "lw-pr-content-9-" + Math.random().toString(36).slice(2,10);', '    var selector = "#" + _root.id + " .lw-pr-content-9-swiper";'].join(String.fromCharCode(10));
    /* 「自分自身」を指す式。blockId が無いときは上で掴んだ _root を使う */
    var rootRef = blockId ? "document.querySelector(\"#".concat(blockId, "\")") : '_root';
    /* 色の指定も同じ理由。blockId が無いときはクラスで当てる */
    var cssRoot = blockId ? "#".concat(blockId) : '.lw-pr-content-9';
    var swiperConfig = "\n(function(){\n".concat(rootFinder, "\n    var MAX_RETRY = 30;\n    var retry = 0;\n\n    function initSwiper(){\n        if ( typeof Swiper === \"undefined\" ) return false;\n        var el = document.querySelector(selector);\n        if ( !el ) return false;\n        if ( el.swiper ) return true;\n\n        new Swiper( selector, {\n            slidesPerView: 4,\n            spaceBetween: 24,\n            loop: true,\n            ").concat(autoplay ? 'autoplay: { delay: 3000, disableOnInteraction: true },' : '', "\n            pagination: {\n                el: selector + \" .swiper-pagination\",\n                clickable: true\n            },\n            observer: true,\n            observeParents: true,\n            breakpoints: {\n                0:    { slidesPerView: 1, spaceBetween: 24 },\n                576:  { slidesPerView: 2, spaceBetween: 20 },\n                992:  { slidesPerView: 3, spaceBetween: 24 },\n                1200: { slidesPerView: 4, spaceBetween: 24 }\n            }\n        });\n        ").concat(rootRef, ".classList.remove(\"init-hide\");\n        return true;\n    }\n\n    document.addEventListener(\"DOMContentLoaded\", initSwiper, { once:true });\n    window.addEventListener(\"lw:swiperReady\", initSwiper, { once:true });\n\n    var timer = setInterval(function(){\n        if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);\n    }, 150);\n\n    setTimeout(function(){\n        var el = ").concat(rootRef, ";\n        if ( el ) el.classList.remove(\"init-hide\");\n    }, 5000);\n})();\n        ");

    /* ---------- JSX 出力 ----------------------------------------*/
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-content-9__wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "swiper lw-pr-content-9-swiper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "swiper-wrapper"
    }, slides.map(function (slide, i) {
      var innerContent = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "image"
      }, slide.imgUrl && /*#__PURE__*/React.createElement("img", {
        src: slide.imgUrl,
        alt: slide.altText
      })), /*#__PURE__*/React.createElement("h3", null, nl2br(slide.title)), /*#__PURE__*/React.createElement("p", null, nl2br(slide.description)));
      return /*#__PURE__*/React.createElement("div", {
        className: "swiper-slide",
        key: i
      }, slide.linkUrl ? /*#__PURE__*/React.createElement("a", {
        className: "item",
        href: slide.linkUrl,
        "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_7__.lwLinkDataPropsFromAttrs)(slide, LINK_KEYS).linkType,
        "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_7__.lwLinkDataPropsFromAttrs)(slide, LINK_KEYS).linkId,
        target: slide.openNewTab ? '_blank' : undefined,
        rel: slide.openNewTab ? 'noopener noreferrer' : undefined
      }, innerContent) : /*#__PURE__*/React.createElement("div", {
        className: "item"
      }, innerContent));
    })), /*#__PURE__*/React.createElement("div", {
      className: "swiper-pagination"
    }))), /*#__PURE__*/React.createElement("script", {
      type: "text/javascript",
      dangerouslySetInnerHTML: {
        __html: swiperConfig
      }
    }), /*#__PURE__*/React.createElement("noscript", null, /*#__PURE__*/React.createElement("style", null, "".concat(cssRoot, "{opacity:1!important}"))));
  }
});

/***/ }),

/***/ "./src/lw-pr-content-9/editor.scss":
/*!*****************************************!*\
  !*** ./src/lw-pr-content-9/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-pr-content-9/style.scss":
/*!****************************************!*\
  !*** ./src/lw-pr-content-9/style.scss ***!
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

/***/ "./src/lw-pr-content-9/block.json":
/*!****************************************!*\
  !*** ./src/lw-pr-content-9/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-content-9","version":"1.0.0","title":"PR Content 9 カードスライダー","category":"lw-content","icon":"slides","editorScript":"file:./lw-pr-content-9.js","aiHint":{"description":"カードスライダー。画像+タイトル+説明のカードが横スクロール。実績・ポートフォリオ紹介に","excludeFromAutoSelect":false,"contentAttributes":["slides"],"imageAttributes":[],"notes":"🚨 blockId に一意の文字列（例 \\"paid-block-fv-9-20260826-01\\"）を必ず入れる。空のままだと外側の div に id が付かず、スライダーの初期化セレクタ（#blockId）が一致しないため init-hide クラスが外れず、フロントで高さ0の真っ白になる（2026-08-26 に実機で確認）。"},"supports":{"anchor":true},"attributes":{"blockId":{"type":"string"},"autoplay":{"type":"boolean","default":false},"slides":{"type":"array","default":[{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false},{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false},{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false},{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false}]}},"no":9}');

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
/******/ 			"lw-pr-content-9": 0,
/******/ 			"./style-lw-pr-content-9": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-content-9"], () => (__webpack_require__("./src/lw-pr-content-9/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;