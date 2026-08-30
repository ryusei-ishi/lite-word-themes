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

/***/ "./src/shin-gas-station-01-list-1/index.js":
/*!*************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/shin-gas-station-01-list-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/shin-gas-station-01-list-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/shin-gas-station-01-list-1/block.json");
/* harmony import */ var _link_picker_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../link-picker.js */ "./src/link-picker.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }







(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'shin-gas-station-01-list-1'
    });
    var contents = attributes.contents;

    // コンテンツ追加
    var addContent = function addContent() {
      var newIndex = contents.length + 1;
      var newContent = {
        text: '新しい事業',
        textColor: '',
        number: String(newIndex).padStart(2, '0'),
        image: '',
        p_text: '新しい説明テキスト',
        url: ''
      };
      setAttributes({
        contents: [].concat(_toConsumableArray(contents), [newContent])
      });
    };

    // コンテンツ削除
    var removeContent = function removeContent(index) {
      setAttributes({
        contents: contents.filter(function (_, i) {
          return i !== index;
        })
      });
    };

    // コンテンツ更新
    var updateContent = function updateContent(index, key, value) {
      var updatedContents = contents.map(function (content, i) {
        return i === index ? _objectSpread(_objectSpread({}, content), {}, _defineProperty({}, key, value)) : content;
      });
      setAttributes({
        contents: updatedContents
      });
    };

    /* リンク設定のように複数のキーをまとめて入れ替える用 */
    var updateContentMulti = function updateContentMulti(i, patch) {
      setAttributes({
        contents: contents.map(function (it, k) {
          return k === i ? _objectSpread(_objectSpread({}, it), patch) : it;
        })
      });
    };
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272\u8A2D\u5B9A",
      initialOpen: true
    }, contents.map(function (content, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: {
          marginBottom: '16px'
        }
      }, /*#__PURE__*/React.createElement("p", null, "Item ", index + 1, " \u306E\u30C6\u30AD\u30B9\u30C8\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
        value: content.textColor,
        onChange: function onChange(color) {
          return updateContent(index, 'textColor', color);
        }
      }));
    }))), /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, contents.map(function (content, index) {
      return /*#__PURE__*/React.createElement("li", {
        className: "shin-gas-station-01-list-1_item item_".concat(index),
        key: index
      }, /*#__PURE__*/React.createElement("div", {
        className: "link"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text_in"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "ttl"
      }, /*#__PURE__*/React.createElement("span", {
        className: "no",
        style: {
          color: content.textColor || 'inherit',
          borderColor: content.textColor || 'inherit'
        }
      }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        className: "text",
        style: {
          color: content.textColor || 'inherit'
        },
        value: content.text,
        onChange: function onChange(value) {
          return updateContent(index, 'text', value);
        },
        placeholder: "\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
      })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "p",
        className: "p_text",
        value: content.p_text,
        onChange: function onChange(value) {
          return updateContent(index, 'p_text', value);
        },
        placeholder: "\u8AAC\u660E\u6587\u3092\u5165\u529B"
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(media) {
          return updateContent(index, 'image', media.url);
        },
        allowedTypes: ["image"],
        render: function render(_ref) {
          var open = _ref.open;
          return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            isSecondary: true
          }, content.image ? '画像を変更' : '画像を選択');
        }
      }), content.image && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: function onClick() {
          return updateContent(index, 'image', '');
        },
        isDestructive: true,
        style: {
          marginLeft: '8px'
        }
      }, "\u753B\u50CF\u3092\u524A\u9664"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AFURL",
        value: content.url,
        onChange: function onChange(value) {
          return updateContent(index, 'url', value);
        },
        style: {
          marginTop: '12px',
          maxWidth: '300px'
        }
      }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.LinkPicker, {
        link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkFromItem)(content, 'url'),
        onChange: function onChange(patch) {
          return updateContentMulti(index, (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkToItem)(patch, 'url'));
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "bottom_content"
      }, content.image && /*#__PURE__*/React.createElement("img", {
        src: content.image,
        alt: ""
      })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeContent(index);
        },
        style: {
          marginTop: '10px'
        }
      }, "\u524A\u9664")));
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      isPrimary: true,
      onClick: addContent
    }, "\u30B3\u30F3\u30C6\u30F3\u30C4\u3092\u8FFD\u52A0"));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'shin-gas-station-01-list-1'
    });
    var contents = attributes.contents;
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, contents.map(function (content, index) {
      // URL が設定されていない場合は div.link、設定されている場合は a.link
      var LinkTag = content.url ? 'a' : 'div';
      var linkProps = content.url ? {
        href: content.url,
        'data-lw-link-type': (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromItem)(content, 'url').linkType,
        'data-lw-link-id': (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromItem)(content, 'url').linkId
      } : {};
      var nextBtn = /*#__PURE__*/React.createElement("div", {
        className: "next_btn"
      }, /*#__PURE__*/React.createElement("div", null, "\u8A73\u3057\u304F\u898B\u308B", /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "39.5",
        height: "4.197",
        viewBox: "0 0 39.5 4.197"
      }, /*#__PURE__*/React.createElement("g", {
        id: "\u30B0\u30EB\u30FC\u30D7_11",
        "data-name": "\u30B0\u30EB\u30FC\u30D7 11",
        transform: "translate(-179.5 -2154.803)"
      }, /*#__PURE__*/React.createElement("path", {
        id: "\u30D1\u30B9_28",
        "data-name": "\u30D1\u30B9 28",
        d: "M0,0,8,4.2H0Z",
        transform: "translate(211 2154.803)",
        fill: "#059d47"
      }), /*#__PURE__*/React.createElement("path", {
        id: "\u7DDA_1",
        "data-name": "\u7DDA 1",
        d: "M32,.5H0v-1H32Z",
        transform: "translate(179.5 2158.5)",
        fill: "#059d47"
      })))));
      return /*#__PURE__*/React.createElement("li", {
        className: "shin-gas-station-01-list-1_item item_".concat(index),
        key: index
      }, /*#__PURE__*/React.createElement(LinkTag, _extends({
        className: "link"
      }, linkProps), /*#__PURE__*/React.createElement("div", {
        className: "text_in"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "ttl"
      }, /*#__PURE__*/React.createElement("span", {
        className: "no",
        style: {
          color: content.textColor || '#111',
          borderColor: content.textColor || '#111'
        }
      }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "span",
        className: "text",
        value: content.text,
        style: {
          color: content.textColor || '#111'
        },
        "data-text-color": content.textColor
      })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "p",
        className: "p_text",
        value: content.p_text
      })), /*#__PURE__*/React.createElement("div", {
        className: "bottom_content"
      }, content.image ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
        src: content.image,
        alt: content.text
      }), content.url ? nextBtn : null) : content.url && nextBtn)));
    })));
  }
});

/***/ }),

/***/ "./src/shin-gas-station-01-list-1/editor.scss":
/*!****************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/editor.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/shin-gas-station-01-list-1/style.scss":
/*!***************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/style.scss ***!
  \***************************************************/
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

/***/ "./src/shin-gas-station-01-list-1/block.json":
/*!***************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/block.json ***!
  \***************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/shin-gas-station-01-list-1","version":"1.0.0","title":"インフォリスト 1 shin shop pattern 01","category":"lw-list","icon":"editor-ul","supports":{"anchor":true},"aiHint":{"description":"番号+タイトル+説明文+画像のカード型リスト。事業紹介・サービス一覧に。ショップテンプレート用","excludeFromAutoSelect":false,"contentAttributes":["contents"],"imageAttributes":[]},"attributes":{"contents":{"type":"array","source":"query","selector":".shin-gas-station-01-list-1_item","query":{"text":{"type":"string","source":"html","selector":".text"},"textColor":{"type":"string","source":"attribute","selector":".text","attribute":"data-text-color"},"number":{"type":"string","source":"text","selector":".no"},"p_text":{"type":"string","source":"html","selector":".p_text"},"image":{"type":"string","source":"attribute","selector":"img","attribute":"src"},"url":{"type":"string","source":"attribute","selector":".link","attribute":"href","default":""},"linkType":{"type":"string","source":"attribute","selector":".link","attribute":"data-lw-link-type"},"linkId":{"type":"string","source":"attribute","selector":".link","attribute":"data-lw-link-id"}},"default":[{"text":"エネルギー事業","textColor":"#E58A68","number":"01","image":"","p_text":"ガソリンスタンドの運営を通じて、高品質な燃料とサービスを提供。","url":""},{"text":"コンビニエンスストア事業","textColor":"#03A0C6","number":"02","image":"","p_text":"お客様にとって、いつでも、どこでも、何を求めても手に入る場所を提供することを目指しています。","url":""},{"text":"カーディーラー事業","textColor":"#059D47","number":"03","image":"","p_text":"お客様のカーライフをトータルにサポートするため、新車・中古車の販売など、幅広いサービスを提供しています。","url":""}]}},"editorScript":"file:./shin-gas-station-01-list-1.js","no":15}');

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
/******/ 			"shin-gas-station-01-list-1": 0,
/******/ 			"./style-shin-gas-station-01-list-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-shin-gas-station-01-list-1"], () => (__webpack_require__("./src/shin-gas-station-01-list-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;