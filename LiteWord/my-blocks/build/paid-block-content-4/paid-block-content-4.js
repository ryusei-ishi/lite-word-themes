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

/***/ "./src/paid-block-content-4/index.js":
/*!*******************************************!*\
  !*** ./src/paid-block-content-4/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-content-4/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-content-4/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-content-4/style.scss");
/* harmony import */ var _link_picker_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../link-picker.js */ "./src/link-picker.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }








/* リンク先の指定（共通部品）で使う属性名の対応 */
var LINK_KEYS = {
  url: 'ctaUrl',
  type: 'ctaLinkType',
  page: 'ctaPageId',
  category: 'ctaCategoryId'
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /* ────────────────────────────────────────────────
   * 編集画面
   * ──────────────────────────────────────────────── */
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      bottomText = attributes.bottomText,
      ctaText = attributes.ctaText,
      ctaUrl = attributes.ctaUrl,
      mainTitleColor = attributes.mainTitleColor,
      highlightColor = attributes.highlightColor,
      ctaBorderColor = attributes.ctaBorderColor,
      ctaTextColor = attributes.ctaTextColor,
      ctaBorderWidth = attributes.ctaBorderWidth,
      ctaBorderRadius = attributes.ctaBorderRadius,
      imageRadius = attributes.imageRadius,
      pcButtonState = attributes.pcButtonState,
      mobileButtonState = attributes.mobileButtonState,
      images = attributes.images;
    var onChange = function onChange(key) {
      return function (val) {
        return setAttributes(_defineProperty({}, key, val));
      };
    };

    /* 画像を一括選択（最大 8 枚）してオブジェクト配列を生成 */
    var onSelectImages = function onSelectImages(mediaArray) {
      var newArr = mediaArray.slice(0, 8).map(function (m) {
        return {
          url: m.url,
          alt: m.alt
        };
      });
      setAttributes({
        images: newArr
      });
    };

    /* ボタンの状態に応じたクラス名を生成 */
    var getButtonClasses = function getButtonClasses() {
      var classes = ['cont_btn'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };

    /* .btn_bg用のクラス名を生成 */
    var getBtnBgClasses = function getBtnBgClasses() {
      var classes = ['btn_bg'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'paid-block-content-4'
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=V5vRfbzV8_8",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDCDD \u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: mainTitleColor,
      onChange: onChange('mainTitleColor')
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\u2728 \u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\uFF08\u30CF\u30A4\u30E9\u30A4\u30C8\uFF09\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: highlightColor,
      onChange: onChange('highlightColor')
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DC\u30BF\u30F3\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDD17 \u30EA\u30F3\u30AF URL"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      value: ctaUrl,
      onChange: onChange('ctaUrl'),
      placeholder: "https://example.com"
    }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.LinkPicker, {
      link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkFromAttrs)(attributes, LINK_KEYS),
      onChange: function onChange(patch) {
        return setAttributes((0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkToAttrs)(patch, LINK_KEYS));
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83C\uDFA8 \u30DC\u30BF\u30F3\u306E\u8272\u8A2D\u5B9A"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '8px',
        fontSize: '14px'
      }
    }, "\u67A0\u7DDA\u30FB\u80CC\u666F\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: ctaBorderColor,
      onChange: onChange('ctaBorderColor')
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '8px',
        marginTop: '15px',
        fontSize: '14px'
      }
    }, "\u6587\u5B57\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: ctaTextColor,
      onChange: onChange('ctaTextColor')
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#333'
      }
    }, "\uD83D\uDCD0 \u30DC\u30BF\u30F3\u306E\u5F62\u72B6"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u67A0\u7DDA\u306E\u592A\u3055\uFF08px\uFF09",
      value: ctaBorderWidth,
      onChange: onChange('ctaBorderWidth'),
      min: 0,
      max: 20,
      help: "\u30DC\u30BF\u30F3\u306E\u67A0\u7DDA\u306E\u592A\u3055\u3092\u8A2D\u5B9A\u3057\u307E\u3059"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30BF\u30F3\u89D2\u4E38\uFF08px\uFF09",
      value: ctaBorderRadius,
      onChange: onChange('ctaBorderRadius'),
      min: 0,
      max: 100,
      help: "\u30DC\u30BF\u30F3\u306E\u89D2\u306E\u4E38\u307F\u3092\u8A2D\u5B9A\u3057\u307E\u3059"
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30B9\u30DD\u30F3\u30B7\u30D6\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f0f8ff'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDDA5\uFE0F PC\u753B\u9762\u3067\u306E\u8868\u793A"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      value: pcButtonState,
      options: [{
        label: '未選択',
        value: ''
      }, {
        label: '全幅',
        value: 'w_full'
      }, {
        label: '非表示',
        value: 'none'
      }],
      onChange: onChange('pcButtonState'),
      help: "PC\u753B\u9762\u3067\u306E\u30DC\u30BF\u30F3\u306E\u8868\u793A\u65B9\u6CD5\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fff5f5'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDCF1 \u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u753B\u9762\u3067\u306E\u8868\u793A"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      value: mobileButtonState,
      options: [{
        label: '未選択',
        value: ''
      }, {
        label: '全幅',
        value: 'sp_w_full'
      }, {
        label: '非表示',
        value: 'sp_none'
      }],
      onChange: onChange('mobileButtonState'),
      help: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u753B\u9762\u3067\u306E\u30DC\u30BF\u30F3\u306E\u8868\u793A\u65B9\u6CD5\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDCF7 \u753B\u50CF\u9078\u629E\uFF08\u6700\u59278\u679A\uFF09"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onSelectImages,
      allowedTypes: ['image'],
      multiple: true,
      gallery: true,
      value: images.map(function (img) {
        return img.url;
      }),
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: open
        }, images.length ? '画像を再選択' : '画像を選択'), images.length > 0 && /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 15,
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 6,
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px'
          }
        }, images.map(function (img, i) {
          return /*#__PURE__*/React.createElement("img", {
            key: i,
            src: img.url,
            alt: "",
            style: {
              width: '100%',
              borderRadius: "".concat(imageRadius, "px"),
              aspectRatio: '1',
              objectFit: 'cover'
            }
          });
        })));
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\uD83D\uDCD0 \u753B\u50CF\u89D2\u4E38\uFF08px\uFF09",
      value: imageRadius,
      onChange: onChange('imageRadius'),
      min: 0,
      max: 200,
      help: "\u30AE\u30E3\u30E9\u30EA\u30FC\u753B\u50CF\u306E\u89D2\u306E\u4E38\u307F\u3092\u8A2D\u5B9A\u3057\u307E\u3059"
    })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("section", {
      className: "conts"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cont"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: mainTitleColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: mainTitle,
      onChange: onChange('mainTitle'),
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sub",
      style: {
        color: highlightColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: subTitle,
      onChange: onChange('subTitle'),
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB"
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "ttl_btm_p",
      value: bottomText,
      onChange: onChange('bottomText'),
      placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement("div", {
      className: getButtonClasses(),
      style: {
        borderColor: ctaBorderColor,
        borderWidth: "".concat(ctaBorderWidth, "px"),
        borderRadius: "".concat(ctaBorderRadius, "px"),
        color: ctaTextColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: ctaText,
      onChange: onChange('ctaText'),
      placeholder: "\u30DC\u30BF\u30F3\u6587\u8A00"
    }), /*#__PURE__*/React.createElement("div", {
      className: getBtnBgClasses(),
      style: {
        background: ctaBorderColor,
        borderRadius: "".concat(ctaBorderRadius, "px")
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "gallery_in"
    }, images.map(function (img, i) {
      return /*#__PURE__*/React.createElement("div", {
        className: "image",
        key: i,
        style: {
          borderRadius: "".concat(imageRadius, "px"),
          overflow: 'hidden'
        }
      }, img.url && /*#__PURE__*/React.createElement("img", {
        src: img.url,
        alt: img.alt,
        style: {
          borderRadius: "".concat(imageRadius, "px")
        }
      }));
    })))));
  },
  /* ────────────────────────────────────────────────
   * 保存
   * ──────────────────────────────────────────────── */
  save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      bottomText = attributes.bottomText,
      ctaText = attributes.ctaText,
      ctaUrl = attributes.ctaUrl,
      mainTitleColor = attributes.mainTitleColor,
      highlightColor = attributes.highlightColor,
      ctaBorderColor = attributes.ctaBorderColor,
      ctaTextColor = attributes.ctaTextColor,
      ctaBorderWidth = attributes.ctaBorderWidth,
      ctaBorderRadius = attributes.ctaBorderRadius,
      imageRadius = attributes.imageRadius,
      pcButtonState = attributes.pcButtonState,
      mobileButtonState = attributes.mobileButtonState,
      images = attributes.images;

    /* ボタンの状態に応じたクラス名を生成（保存版） */
    var getButtonClasses = function getButtonClasses() {
      var classes = ['cont_btn'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };

    /* .btn_bg用のクラス名を生成（保存版） */
    var getBtnBgClasses = function getBtnBgClasses() {
      var classes = ['btn_bg'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'paid-block-content-4'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("section", {
      className: "conts"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cont"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: mainTitleColor
      },
      dangerouslySetInnerHTML: {
        __html: mainTitle
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "sub",
      style: {
        color: highlightColor
      },
      dangerouslySetInnerHTML: {
        __html: subTitle
      }
    })), bottomText && bottomText.trim() && /*#__PURE__*/React.createElement("p", {
      className: "ttl_btm_p"
    }, /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: bottomText
      }
    })), /*#__PURE__*/React.createElement("a", {
      className: getButtonClasses(),
      href: ctaUrl,
      "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS).linkType,
      "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_6__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS).linkId,
      style: {
        borderColor: ctaBorderColor,
        borderWidth: "".concat(ctaBorderWidth, "px"),
        borderRadius: "".concat(ctaBorderRadius, "px"),
        color: ctaTextColor
      }
    }, /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: ctaText
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: getBtnBgClasses(),
      style: {
        background: ctaBorderColor,
        borderRadius: "".concat(ctaBorderRadius, "px")
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "gallery_in"
    }, images.map(function (img, i) {
      return img.url ? /*#__PURE__*/React.createElement("div", {
        className: "image",
        key: i,
        style: {
          borderRadius: "".concat(imageRadius, "px"),
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: img.url,
        alt: img.alt,
        style: {
          borderRadius: "".concat(imageRadius, "px")
        }
      })) : null;
    }))));
  },
  /* ────────────────────────────────────────────────
   * 旧 save（useBlockProps.save() 移行前・名札なし）
   * ──────────────────────────────────────────────── */
  deprecated: [{
    apiVersion: _block_json__WEBPACK_IMPORTED_MODULE_4__.apiVersion,
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    supports: _block_json__WEBPACK_IMPORTED_MODULE_4__.supports,
    save: function save(_ref4) {
      var attributes = _ref4.attributes;
      var mainTitle = attributes.mainTitle,
        subTitle = attributes.subTitle,
        bottomText = attributes.bottomText,
        ctaText = attributes.ctaText,
        ctaUrl = attributes.ctaUrl,
        mainTitleColor = attributes.mainTitleColor,
        highlightColor = attributes.highlightColor,
        ctaBorderColor = attributes.ctaBorderColor,
        ctaTextColor = attributes.ctaTextColor,
        ctaBorderWidth = attributes.ctaBorderWidth,
        ctaBorderRadius = attributes.ctaBorderRadius,
        imageRadius = attributes.imageRadius,
        pcButtonState = attributes.pcButtonState,
        mobileButtonState = attributes.mobileButtonState,
        images = attributes.images;

      /* ボタンの状態に応じたクラス名を生成（保存版） */
      var getButtonClasses = function getButtonClasses() {
        var classes = ['cont_btn'];
        if (pcButtonState === 'w_full') {
          classes.push('w_full');
        } else if (pcButtonState === 'none') {
          classes.push('none');
        }
        if (mobileButtonState === 'sp_w_full') {
          classes.push('sp_w_full');
        } else if (mobileButtonState === 'sp_none') {
          classes.push('sp_none');
        }
        return classes.join(' ');
      };

      /* .btn_bg用のクラス名を生成（保存版） */
      var getBtnBgClasses = function getBtnBgClasses() {
        var classes = ['btn_bg'];
        if (pcButtonState === 'w_full') {
          classes.push('w_full');
        } else if (pcButtonState === 'none') {
          classes.push('none');
        }
        if (mobileButtonState === 'sp_w_full') {
          classes.push('sp_w_full');
        } else if (mobileButtonState === 'sp_none') {
          classes.push('sp_none');
        }
        return classes.join(' ');
      };
      return /*#__PURE__*/React.createElement("div", {
        className: "paid-block-content-4"
      }, /*#__PURE__*/React.createElement("section", {
        className: "conts"
      }, /*#__PURE__*/React.createElement("div", {
        className: "cont"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "ttl"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          color: mainTitleColor
        },
        dangerouslySetInnerHTML: {
          __html: mainTitle
        }
      }), /*#__PURE__*/React.createElement("span", {
        className: "sub",
        style: {
          color: highlightColor
        },
        dangerouslySetInnerHTML: {
          __html: subTitle
        }
      })), bottomText && bottomText.trim() && /*#__PURE__*/React.createElement("p", {
        className: "ttl_btm_p"
      }, /*#__PURE__*/React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: bottomText
        }
      })), /*#__PURE__*/React.createElement("a", {
        className: getButtonClasses(),
        href: ctaUrl,
        style: {
          borderColor: ctaBorderColor,
          borderWidth: "".concat(ctaBorderWidth, "px"),
          borderRadius: "".concat(ctaBorderRadius, "px"),
          color: ctaTextColor
        }
      }, /*#__PURE__*/React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: ctaText
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: getBtnBgClasses(),
        style: {
          background: ctaBorderColor,
          borderRadius: "".concat(ctaBorderRadius, "px")
        }
      }))), /*#__PURE__*/React.createElement("div", {
        className: "gallery_in"
      }, images.map(function (img, i) {
        return img.url ? /*#__PURE__*/React.createElement("div", {
          className: "image",
          key: i,
          style: {
            borderRadius: "".concat(imageRadius, "px"),
            overflow: 'hidden'
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: img.url,
          alt: img.alt,
          style: {
            borderRadius: "".concat(imageRadius, "px")
          }
        })) : null;
      }))));
    }
  }]
});

/***/ }),

/***/ "./src/paid-block-content-4/editor.scss":
/*!**********************************************!*\
  !*** ./src/paid-block-content-4/editor.scss ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-content-4/style.scss":
/*!*********************************************!*\
  !*** ./src/paid-block-content-4/style.scss ***!
  \*********************************************/
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

/***/ "./src/paid-block-content-4/block.json":
/*!*********************************************!*\
  !*** ./src/paid-block-content-4/block.json ***!
  \*********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-content-4","version":"1.0.0","title":"Content 04","category":"lw-content","icon":"format-gallery","editorScript":"file:./paid-block-content-4.js","aiHint":{"description":"画像グリッド+テキスト。メインタイトル+サブ+説明+CTAボタン+画像8枚グリッド。ギャラリー型コンテンツに","excludeFromAutoSelect":false,"contentAttributes":["mainTitle","subTitle","bottomText","ctaText","ctaUrl"],"imageAttributes":["images"]},"supports":{"anchor":true},"attributes":{"mainTitle":{"type":"string","default":"CONTENT"},"subTitle":{"type":"string","default":"サブテキスト"},"bottomText":{"type":"string","default":"テキストテキストテキストテキストテキストテキスト\\nテキストテキストテキストテキストテキストテキスト"},"ctaText":{"type":"string","default":"詳細はこちら"},"ctaUrl":{"type":"string","default":"#"},"ctaLinkType":{"type":"string","default":"url"},"ctaPageId":{"type":"number","default":0},"ctaCategoryId":{"type":"number","default":0},"mainTitleColor":{"type":"string","default":"#333"},"highlightColor":{"type":"string","default":"#0AA8C9"},"ctaBorderColor":{"type":"string","default":"#333"},"ctaTextColor":{"type":"string","default":"#333"},"ctaBorderWidth":{"type":"number","default":2},"ctaBorderRadius":{"type":"number","default":0},"imageRadius":{"type":"number","default":0},"pcButtonState":{"type":"string","default":""},"mobileButtonState":{"type":"string","default":""},"images":{"type":"array","default":[{"url":"https://lite-word.com/sample_img/shop/1.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/2.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/3.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/4.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/5.webp","alt":""},{"url":"https://lite-word.com/sample_img/women/1.webp","alt":""},{"url":"https://lite-word.com/sample_img/women/2.webp","alt":""},{"url":"https://lite-word.com/sample_img/women/4.webp","alt":""}]}},"no":4}');

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
/******/ 			"paid-block-content-4": 0,
/******/ 			"./style-paid-block-content-4": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-content-4"], () => (__webpack_require__("./src/paid-block-content-4/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;