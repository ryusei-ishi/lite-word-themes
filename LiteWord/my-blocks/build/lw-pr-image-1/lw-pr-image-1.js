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

/***/ "./src/lw-pr-image-1/index.js":
/*!************************************!*\
  !*** ./src/lw-pr-image-1/index.js ***!
  \************************************/
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-image-1/style.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-image-1/block.json");
/* harmony import */ var _link_picker_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../link-picker.js */ "./src/link-picker.js");
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








/* リンク先の指定（共通部品）で使う、配列の要素の中のキー名 */
var LINK_KEYS = {
  url: 'linkUrl',
  type: 'linkType',
  page: 'pageId',
  category: 'categoryId'
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /* =============================================================
   *  Edit
   * ============================================================= */
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var blockId = attributes.blockId,
      images = attributes.images,
      gapPc = attributes.gapPc,
      gapSp = attributes.gapSp,
      columnsPc = attributes.columnsPc,
      columnsSp = attributes.columnsSp,
      aspectRatioW = attributes.aspectRatioW,
      aspectRatioH = attributes.aspectRatioH,
      imgBorderRadius = attributes.imgBorderRadius,
      mtPc = attributes.mtPc,
      mbPc = attributes.mbPc,
      mtSp = attributes.mtSp,
      mbSp = attributes.mbSp,
      maxWidth = attributes.maxWidth;

    /* --- blockId 確定 ---------------------------------------- */
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!blockId) {
        var uid = "lw-pr-image-1-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        setAttributes({
          blockId: uid
        });
      }
    }, []);

    /* --- 画像ヘルパー ---------------------------------------- */
    var updateImage = function updateImage(index, key, value) {
      var next = images.map(function (img, i) {
        return i === index ? _objectSpread(_objectSpread({}, img), {}, _defineProperty({}, key, value)) : img;
      });
      setAttributes({
        images: next
      });
    };

    /* リンク設定のように複数のキーをまとめて入れ替える用 */
    var updateImageMulti = function updateImageMulti(i, patch) {
      setAttributes({
        images: images.map(function (it, k) {
          return k === i ? _objectSpread(_objectSpread({}, it), patch) : it;
        })
      });
    };
    var addImage = function addImage() {
      if (images.length < 20) {
        setAttributes({
          images: [].concat(_toConsumableArray(images), [{
            imgUrl: '',
            altText: '',
            linkUrl: ''
          }])
        });
      }
    };
    var removeImage = function removeImage(index) {
      if (images.length > 1) {
        setAttributes({
          images: images.filter(function (_, i) {
            return i !== index;
          })
        });
      }
    };
    var moveImageUp = function moveImageUp(index) {
      if (index === 0) return;
      var next = _toConsumableArray(images);
      var _ref2 = [next[index], next[index - 1]];
      next[index - 1] = _ref2[0];
      next[index] = _ref2[1];
      setAttributes({
        images: next
      });
    };
    var moveImageDown = function moveImageDown(index) {
      if (index === images.length - 1) return;
      var next = _toConsumableArray(images);
      var _ref3 = [next[index + 1], next[index]];
      next[index] = _ref3[0];
      next[index + 1] = _ref3[1];
      setAttributes({
        images: next
      });
    };

    /* --- CSS変数 --------------------------------------------- */
    var cssVars = {
      '--pr-image-1-gap-pc': "".concat(gapPc, "px"),
      '--pr-image-1-gap-sp': "".concat(gapSp, "px"),
      '--pr-image-1-clm-pc': columnsPc,
      '--pr-image-1-clm-sp': columnsSp,
      '--pr-image-1-aspect-w': aspectRatioW,
      '--pr-image-1-aspect-h': aspectRatioH,
      '--pr-image-1-radius': "".concat(imgBorderRadius, "px"),
      '--pr-image-1-mt-pc': "".concat(mtPc, "px"),
      '--pr-image-1-mb-pc': "".concat(mbPc, "px"),
      '--pr-image-1-mt-sp': "".concat(mtSp, "px"),
      '--pr-image-1-mb-sp': "".concat(mbSp, "px"),
      '--pr-image-1-max-w': maxWidth ? "".concat(maxWidth, "px") : '100%'
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      id: blockId,
      className: 'lw-pr-image-1',
      style: cssVars
    });

    /* --- JSX ------------------------------------------------- */
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B0\u30EA\u30C3\u30C9\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC\u30AB\u30E9\u30E0\u6570",
      value: columnsPc,
      onChange: function onChange(v) {
        return setAttributes({
          columnsPc: v
        });
      },
      min: 1,
      max: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP\u30AB\u30E9\u30E0\u6570",
      value: columnsSp,
      onChange: function onChange(v) {
        return setAttributes({
          columnsSp: v
        });
      },
      min: 1,
      max: 6
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC\u9593\u9694 (px)",
      value: gapPc,
      onChange: function onChange(v) {
        return setAttributes({
          gapPc: v
        });
      },
      min: 0,
      max: 60
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP\u9593\u9694 (px)",
      value: gapSp,
      onChange: function onChange(v) {
        return setAttributes({
          gapSp: v
        });
      },
      min: 0,
      max: 40
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4F59\u767D\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC \u4E0A\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mtPc,
      onChange: function onChange(v) {
        return setAttributes({
          mtPc: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC \u4E0B\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mbPc,
      onChange: function onChange(v) {
        return setAttributes({
          mbPc: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP \u4E0A\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mtSp,
      onChange: function onChange(v) {
        return setAttributes({
          mtSp: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP \u4E0B\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mbSp,
      onChange: function onChange(v) {
        return setAttributes({
          mbSp: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 (px)\u3000\u203B0\u3067100%",
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 0,
      max: 1600
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30A2\u30B9\u30DA\u30AF\u30C8\u6BD4",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6A2A (W)",
      value: aspectRatioW,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioW: v
        });
      },
      min: 1,
      max: 500
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u7E26 (H)",
      value: aspectRatioH,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioH: v
        });
      },
      min: 1,
      max: 500
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u89D2\u4E38",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 (px)",
      value: imgBorderRadius,
      onChange: function onChange(v) {
        return setAttributes({
          imgBorderRadius: v
        });
      },
      min: 0,
      max: 100
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u7BA1\u7406",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: addImage,
      disabled: images.length >= 20
    }, "\u753B\u50CF\u3092\u8FFD\u52A0\uFF08\u6700\u592720\u679A\uFF09"), images.map(function (img, index) {
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
      }, /*#__PURE__*/React.createElement("strong", null, "\u753B\u50CF ", index + 1), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: '4px'
        }
      }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: function onClick() {
          return moveImageUp(index);
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
          return moveImageDown(index);
        },
        disabled: index === images.length - 1,
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
          return updateImage(index, 'imgUrl', media.url);
        },
        allowedTypes: ['image'],
        render: function render(_ref4) {
          var open = _ref4.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, img.imgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: img.imgUrl,
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
              return updateImage(index, 'imgUrl', '');
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
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "alt\u30C6\u30AD\u30B9\u30C8",
        value: img.altText,
        onChange: function onChange(v) {
          return updateImage(index, 'altText', v);
        },
        style: {
          marginTop: '8px'
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AF\u5148URL\uFF08\u4EFB\u610F\uFF09",
        value: img.linkUrl,
        onChange: function onChange(v) {
          return updateImage(index, 'linkUrl', v);
        }
      }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.LinkPicker, {
        link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkFromAttrs)(img, LINK_KEYS),
        onChange: function onChange(patch) {
          return updateImageMulti(index, (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkToAttrs)(patch, LINK_KEYS));
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeImage(index);
        },
        disabled: images.length <= 1,
        style: {
          marginTop: '10px'
        }
      }, "\u3053\u306E\u753B\u50CF\u3092\u524A\u9664"));
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-image-1__wrap"
    }, images.map(function (img, i) {
      return /*#__PURE__*/React.createElement("div", {
        className: "lw-pr-image-1__item",
        key: i
      }, img.imgUrl ? /*#__PURE__*/React.createElement("img", {
        src: img.imgUrl,
        alt: img.altText
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#999'
        }
      }, "No Image"));
    }))));
  },
  /* =============================================================
   *  Save
   * ============================================================= */
  save: function save(_ref5) {
    var attributes = _ref5.attributes;
    var blockId = attributes.blockId,
      images = attributes.images,
      gapPc = attributes.gapPc,
      gapSp = attributes.gapSp,
      columnsPc = attributes.columnsPc,
      columnsSp = attributes.columnsSp,
      aspectRatioW = attributes.aspectRatioW,
      aspectRatioH = attributes.aspectRatioH,
      imgBorderRadius = attributes.imgBorderRadius,
      mtPc = attributes.mtPc,
      mbPc = attributes.mbPc,
      mtSp = attributes.mtSp,
      mbSp = attributes.mbSp,
      maxWidth = attributes.maxWidth;
    var cssVars = {
      '--pr-image-1-gap-pc': "".concat(gapPc, "px"),
      '--pr-image-1-gap-sp': "".concat(gapSp, "px"),
      '--pr-image-1-clm-pc': columnsPc,
      '--pr-image-1-clm-sp': columnsSp,
      '--pr-image-1-aspect-w': aspectRatioW,
      '--pr-image-1-aspect-h': aspectRatioH,
      '--pr-image-1-radius': "".concat(imgBorderRadius, "px"),
      '--pr-image-1-mt-pc': "".concat(mtPc, "px"),
      '--pr-image-1-mb-pc': "".concat(mbPc, "px"),
      '--pr-image-1-mt-sp': "".concat(mtSp, "px"),
      '--pr-image-1-mb-sp': "".concat(mbSp, "px"),
      '--pr-image-1-max-w': maxWidth ? "".concat(maxWidth, "px") : '100%'
    };
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      id: blockId,
      className: 'lw-pr-image-1',
      style: cssVars
    });

    /* imgUrl が無いアイテムはスキップ */
    var validImages = images.filter(function (img) {
      return img.imgUrl;
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-image-1__wrap"
    }, validImages.map(function (img, i) {
      var imgTag = /*#__PURE__*/React.createElement("img", {
        src: img.imgUrl,
        alt: img.altText
      });
      return /*#__PURE__*/React.createElement("div", {
        className: "lw-pr-image-1__item",
        key: i
      }, img.linkUrl ? /*#__PURE__*/React.createElement("a", {
        href: img.linkUrl,
        "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromAttrs)(img, LINK_KEYS).linkType,
        "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromAttrs)(img, LINK_KEYS).linkId,
        target: "_blank",
        rel: "noopener noreferrer"
      }, imgTag) : imgTag);
    })));
  }
});

/***/ }),

/***/ "./src/lw-pr-image-1/style.scss":
/*!**************************************!*\
  !*** ./src/lw-pr-image-1/style.scss ***!
  \**************************************/
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

/***/ "./src/lw-pr-image-1/block.json":
/*!**************************************!*\
  !*** ./src/lw-pr-image-1/block.json ***!
  \**************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-image-1","version":"1.0.0","title":"PR画像グリッド 01","category":"lw-media","icon":"grid-view","description":"CSS変数で制御する画像グリッドブロック","aiHint":{"description":"画像グリッド。複数画像をグリッド配置。ギャラリー・施設写真に","excludeFromAutoSelect":false,"contentAttributes":[],"imageAttributes":["images"]},"supports":{"anchor":true},"editorScript":"file:./lw-pr-image-1.js","viewScript":"file:./view.js","attributes":{"blockId":{"type":"string"},"images":{"type":"array","default":[{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""}]},"gapPc":{"type":"number","default":16},"gapSp":{"type":"number","default":8},"columnsPc":{"type":"number","default":5},"columnsSp":{"type":"number","default":2},"aspectRatioW":{"type":"number","default":160},"aspectRatioH":{"type":"number","default":108},"imgBorderRadius":{"type":"number","default":0},"mtPc":{"type":"number","default":16},"mbPc":{"type":"number","default":16},"mtSp":{"type":"number","default":16},"mbSp":{"type":"number","default":16},"maxWidth":{"type":"number","default":0}}}');

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
/******/ 			"lw-pr-image-1": 0,
/******/ 			"./style-lw-pr-image-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-image-1"], () => (__webpack_require__("./src/lw-pr-image-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;