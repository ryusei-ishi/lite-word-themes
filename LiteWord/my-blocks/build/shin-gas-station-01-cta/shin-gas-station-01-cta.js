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

/***/ "./src/shin-gas-station-01-cta/block.json":
/*!************************************************!*\
  !*** ./src/shin-gas-station-01-cta/block.json ***!
  \************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/shin-gas-station-01-cta","version":"1.0.0","title":"CTA 1 shin shop pattern 01","category":"lw-cta","icon":"megaphone","description":"テンプレート専用CTAブロック","aiHint":{"description":"CTA。タイトル+サブ+説明+ボタン+背景画像。ショップテンプレート用","excludeFromAutoSelect":false,"contentAttributes":["title","titleSub","text","buttonText"],"imageAttributes":["imageUrl"]},"supports":{"anchor":true},"attributes":{"title":{"type":"string","source":"html","selector":".shin-gas-station-01-cta__title .main","default":"採用情報"},"titleSub":{"type":"string","source":"html","selector":".shin-gas-station-01-cta__title .sub","default":"Recruit"},"text":{"type":"string","source":"html","selector":"p","default":"地域社会を支え、移動の快適さと安心を提供するDriveEaseでは、未来を共に創る仲間を募集しています。<br>私たちは、ガソリンスタンド事業や車両リース事業を通じて、人々の暮らしをより豊かにすることを目指しています。<br>新しい挑戦を続ける当社で、あなたの力を活かしてみませんか？"},"buttonText":{"type":"string","source":"html","selector":"a","default":"詳しく見る"},"buttonUrl":{"type":"string","default":"#"},"buttonLinkType":{"type":"string","default":"url"},"buttonPageId":{"type":"number","default":0},"buttonCategoryId":{"type":"number","default":0},"openInNewTab":{"type":"boolean","default":false},"imageUrl":{"type":"string","source":"attribute","selector":"img","attribute":"src","default":""},"filterColor":{"type":"string","default":"#054161"},"buttonBackgroundColor":{"type":"string","default":"#fff"},"buttonBorderColor":{"type":"string","default":"var(--color-main)"},"buttonBorderSize":{"type":"number","default":1},"buttonMaxWidth":{"type":"number","default":240},"pcTextAlign":{"type":"string","default":"center"},"mobileTextAlign":{"type":"string","default":"left"}},"editorScript":"file:./shin-gas-station-01-cta.js","no":15}');

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
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************************************!*\
  !*** ./src/shin-gas-station-01-cta/index.js ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/shin-gas-station-01-cta/block.json");
/* harmony import */ var _link_picker_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../link-picker.js */ "./src/link-picker.js");
/**
 * CTA 1 shin shop pattern 01
 * ★ apiVersion 3 対応（2025-12-07）
 */






/* リンク先の指定（共通部品）で使う属性名の対応 */
var LINK_KEYS = {
  url: 'buttonUrl',
  type: 'buttonLinkType',
  page: 'buttonPageId',
  category: 'buttonCategoryId'
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var title = attributes.title,
      titleSub = attributes.titleSub,
      text = attributes.text,
      buttonText = attributes.buttonText,
      buttonUrl = attributes.buttonUrl,
      openInNewTab = attributes.openInNewTab,
      imageUrl = attributes.imageUrl,
      filterColor = attributes.filterColor,
      buttonBackgroundColor = attributes.buttonBackgroundColor,
      buttonBorderColor = attributes.buttonBorderColor,
      buttonBorderSize = attributes.buttonBorderSize,
      buttonMaxWidth = attributes.buttonMaxWidth,
      pcTextAlign = attributes.pcTextAlign,
      mobileTextAlign = attributes.mobileTextAlign;
    // 各種変更関数
    var onChangeTitle = function onChangeTitle(value) {
      return setAttributes({
        title: value
      });
    };
    var onChangeTitleSub = function onChangeTitleSub(value) {
      return setAttributes({
        titleSub: value
      });
    };
    var onChangeText = function onChangeText(value) {
      return setAttributes({
        text: value
      });
    };
    var onChangeButtonText = function onChangeButtonText(value) {
      return setAttributes({
        buttonText: value
      });
    };
    var onChangeButtonUrl = function onChangeButtonUrl(value) {
      return setAttributes({
        buttonUrl: value
      });
    };
    var onToggleOpenInNewTab = function onToggleOpenInNewTab() {
      return setAttributes({
        openInNewTab: !openInNewTab
      });
    };
    var onSelectImage = function onSelectImage(newImage) {
      return setAttributes({
        imageUrl: newImage.sizes.full.url
      });
    };
    var onChangeFilterColor = function onChangeFilterColor(value) {
      return setAttributes({
        filterColor: value
      });
    };
    var onChangeButtonBackgroundColor = function onChangeButtonBackgroundColor(value) {
      return setAttributes({
        buttonBackgroundColor: value
      });
    };
    var onChangeButtonBorderColor = function onChangeButtonBorderColor(value) {
      return setAttributes({
        buttonBorderColor: value
      });
    };
    var onChangeButtonBorderSize = function onChangeButtonBorderSize(value) {
      return setAttributes({
        buttonBorderSize: value
      });
    };
    var onChangeButtonMaxWidth = function onChangeButtonMaxWidth(value) {
      return setAttributes({
        buttonMaxWidth: value
      });
    };
    var onChangePcTextAlign = function onChangePcTextAlign(value) {
      return setAttributes({
        pcTextAlign: value
      });
    };
    var onChangeMobileTextAlign = function onChangeMobileTextAlign(value) {
      return setAttributes({
        mobileTextAlign: value
      });
    };

    // useBlockProps で apiVersion 3 対応
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'shin-gas-station-01-cta'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u57FA\u672C\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AF\u5148URL",
      value: buttonUrl,
      onChange: onChangeButtonUrl
    }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_4__.LinkPicker, {
      link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_4__.lwLinkFromAttrs)(attributes, LINK_KEYS),
      onChange: function onChange(patch) {
        return setAttributes((0,_link_picker_js__WEBPACK_IMPORTED_MODULE_4__.lwLinkToAttrs)(patch, LINK_KEYS));
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30EA\u30F3\u30AF\u3092\u65B0\u898F\u30BF\u30D6\u3067\u958B\u304F",
      checked: openInNewTab,
      onChange: onToggleOpenInNewTab
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u80CC\u666F\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onSelectImage,
      allowedTypes: "image",
      value: imageUrl,
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, imageUrl && /*#__PURE__*/React.createElement("img", {
          src: imageUrl,
          style: {
            width: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          className: "button",
          style: {
            marginTop: '10px'
          }
        }, "\u753B\u50CF\u3092\u5909\u66F4"));
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u753B\u50CF\u306E\u4E0A\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: filterColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeFilterColor(value.hex);
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u914D\u7F6E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "PC\u3067\u306E\u30C6\u30AD\u30B9\u30C8\u914D\u7F6E",
      value: pcTextAlign,
      options: [{
        label: '中央寄せ',
        value: 'center'
      }, {
        label: '左寄せ',
        value: 'left'
      }],
      onChange: onChangePcTextAlign
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30B9\u30DE\u30DB\u3067\u306E\u30C6\u30AD\u30B9\u30C8\u914D\u7F6E",
      value: mobileTextAlign,
      options: [{
        label: '中央寄せ',
        value: 'center'
      }, {
        label: '左寄せ',
        value: 'left'
      }],
      onChange: onChangeMobileTextAlign
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u306E\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: buttonBackgroundColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeButtonBackgroundColor(value.hex);
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u306E\u30DC\u30FC\u30C0\u30FC\u306E\u8272\uFF08\u5916\u67A0\uFF09"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: buttonBorderColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeButtonBorderColor(value.hex);
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u306E\u592A\u3055 (px)",
      value: buttonBorderSize,
      onChange: onChangeButtonBorderSize,
      min: 0,
      max: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30EA\u30F3\u30AF\u30DC\u30BF\u30F3\u306E\u6700\u5927\u6A2A\u5E45 (px)",
      value: buttonMaxWidth,
      onChange: onChangeButtonMaxWidth,
      min: 50,
      max: 500
    }))), /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-cta__inner"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "shin-gas-station-01-cta__title heading_style_reset"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: title,
      onChange: onChangeTitle,
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: titleSub,
      onChange: onChangeTitleSub,
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "shin-gas-station-01-cta__text ".concat(pcTextAlign === 'left' ? 'text_align_pc_left' : '', " ").concat(mobileTextAlign === 'left' ? 'text_align_sp_left' : ''),
      value: text,
      onChange: onChangeText,
      placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "a",
      className: "shin-gas-station-01-cta__button",
      value: buttonText,
      onChange: onChangeButtonText,
      placeholder: "\u30DC\u30BF\u30F3\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B",
      href: buttonUrl,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      style: {
        backgroundColor: buttonBackgroundColor,
        borderColor: buttonBorderColor,
        borderWidth: buttonBorderSize + 'px',
        borderStyle: 'solid',
        maxWidth: buttonMaxWidth + 'px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-cta__image"
    }, imageUrl && /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: filterColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }
    })));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var title = attributes.title,
      titleSub = attributes.titleSub,
      text = attributes.text,
      buttonText = attributes.buttonText,
      buttonUrl = attributes.buttonUrl,
      openInNewTab = attributes.openInNewTab,
      imageUrl = attributes.imageUrl,
      filterColor = attributes.filterColor,
      buttonBackgroundColor = attributes.buttonBackgroundColor,
      buttonBorderColor = attributes.buttonBorderColor,
      buttonBorderSize = attributes.buttonBorderSize,
      buttonMaxWidth = attributes.buttonMaxWidth,
      pcTextAlign = attributes.pcTextAlign,
      mobileTextAlign = attributes.mobileTextAlign;

    // useBlockProps.save() で apiVersion 3 対応
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'shin-gas-station-01-cta'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-cta__inner"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "shin-gas-station-01-cta__title heading_style_reset"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: title
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: titleSub
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "shin-gas-station-01-cta__text ".concat(pcTextAlign === 'left' ? 'text_align_pc_left' : '', " ").concat(mobileTextAlign === 'left' ? 'text_align_sp_left' : ''),
      value: text
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "a",
      className: "shin-gas-station-01-cta__button",
      href: buttonUrl,
      "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_4__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS).linkType,
      "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_4__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS).linkId,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      value: buttonText,
      style: {
        borderWidth: buttonBorderSize + 'px',
        borderStyle: 'solid',
        maxWidth: buttonMaxWidth + 'px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-cta__image"
    }, imageUrl && /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: filterColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }
    })), /*#__PURE__*/React.createElement("style", null, "\n\t\t\t\t\t.shin-gas-station-01-cta__button{\n                        background-color: ".concat(buttonBackgroundColor, ";\n\n\t\t\t\t\t\tcolor: ").concat(buttonBorderColor, ";\n                        border-color: ").concat(buttonBorderColor, ";\n\t\t\t\t\t}\n\t\t\t\t\t.shin-gas-station-01-cta__button:hover{\n\t\t\t\t\t\tcolor: #fff;\n                        background-color: ").concat(buttonBorderColor, ";\n\t\t\t\t\t}\n\n\t\t\t\t")));
  }
});
/******/ })()
;