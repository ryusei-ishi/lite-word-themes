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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./src/paid-block-cta-4/block.json":
/*!*****************************************!*\
  !*** ./src/paid-block-cta-4/block.json ***!
  \*****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-cta-4","version":"1.0.0","title":"CTA 04","category":"lw-cta","icon":"megaphone","description":"2カラムCTAブロック（有料）","aiHint":{"description":"2カラムCTA。左右それぞれに背景画像+見出し+説明+ボタン。2つのCTA並列表示に","excludeFromAutoSelect":false,"contentAttributes":["mainTitle1","mainTitle2","subTitle1","subTitle2","desc1","desc2","btnText1","btnText2"],"imageAttributes":["backgroundImage1","backgroundImage2"]},"supports":{"anchor":true},"attributes":{"linkUrl1":{"type":"string","default":""},"link1LinkType":{"type":"string","default":"url"},"link1PageId":{"type":"number","default":0},"link1CategoryId":{"type":"number","default":0},"mainTitle1":{"type":"string","default":"Franchise"},"subTitle1":{"type":"string","default":"加盟店募集"},"desc1":{"type":"string","default":"独立を応援！フランチャイズ加盟しませんか？"},"backgroundImage1":{"type":"string","default":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sample/shop/1.webp"},"filterColor1":{"type":"string","default":"rgba(38,129,147,1)"},"filterOpacity1":{"type":"number","default":60},"btnText1":{"type":"string","default":"詳細はこちら"},"bgColor1":{"type":"string","default":"#d88d00"},"textColor1":{"type":"string","default":"#ffffff"},"linkUrl2":{"type":"string","default":""},"link2LinkType":{"type":"string","default":"url"},"link2PageId":{"type":"number","default":0},"link2CategoryId":{"type":"number","default":0},"mainTitle2":{"type":"string","default":"Recruit"},"subTitle2":{"type":"string","default":"求人情報"},"desc2":{"type":"string","default":"◯では、一緒に働くスタッフを全店で募集しております！"},"backgroundImage2":{"type":"string","default":"https://liteword-assets.bigi-ishikawa.workers.dev/t/sample/shop/5.webp"},"filterColor2":{"type":"string","default":"#690707"},"filterOpacity2":{"type":"number","default":60},"btnText2":{"type":"string","default":"詳細はこちら"},"bgColor2":{"type":"string","default":"#F02D2D"},"textColor2":{"type":"string","default":"#ffffff"},"maxWidth":{"type":"number","default":0}},"editorScript":"file:./paid-block-cta-4.js","no":4}');

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
/*!***************************************!*\
  !*** ./src/paid-block-cta-4/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-cta-4/block.json");
/* harmony import */ var _link_picker_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../link-picker.js */ "./src/link-picker.js");
/**
 * CTA 04
 * ★ apiVersion 3 対応（2025-12-07）
 */







/* リンク先の指定（共通部品）で使う属性名の対応 */
var LINK_KEYS_2 = {
  url: 'linkUrl2',
  type: 'link2LinkType',
  page: 'link2PageId',
  category: 'link2CategoryId'
};

/* リンク先の指定（共通部品）で使う属性名の対応 */
var LINK_KEYS_1 = {
  url: 'linkUrl1',
  type: 'link1LinkType',
  page: 'link1PageId',
  category: 'link1CategoryId'
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * =========================================
   * エディター(編集)用の表示
   * =========================================
   */
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var linkUrl1 = attributes.linkUrl1,
      mainTitle1 = attributes.mainTitle1,
      subTitle1 = attributes.subTitle1,
      desc1 = attributes.desc1,
      backgroundImage1 = attributes.backgroundImage1,
      filterColor1 = attributes.filterColor1,
      filterOpacity1 = attributes.filterOpacity1,
      btnText1 = attributes.btnText1,
      bgColor1 = attributes.bgColor1,
      textColor1 = attributes.textColor1,
      linkUrl2 = attributes.linkUrl2,
      mainTitle2 = attributes.mainTitle2,
      subTitle2 = attributes.subTitle2,
      desc2 = attributes.desc2,
      backgroundImage2 = attributes.backgroundImage2,
      filterColor2 = attributes.filterColor2,
      filterOpacity2 = attributes.filterOpacity2,
      btnText2 = attributes.btnText2,
      bgColor2 = attributes.bgColor2,
      textColor2 = attributes.textColor2,
      maxWidth = attributes.maxWidth;

    // === 画像変更ハンドラ ===
    var onChangeBgImage1 = function onChangeBgImage1(media) {
      setAttributes({
        backgroundImage1: media.url
      });
    };
    var onChangeBgImage2 = function onChangeBgImage2(media) {
      setAttributes({
        backgroundImage2: media.url
      });
    };

    // === 最大横幅設定ハンドラ ===
    var onChangeMaxWidth = function onChangeMaxWidth(value) {
      return setAttributes({
        maxWidth: value
      });
    };
    var onResetMaxWidth = function onResetMaxWidth() {
      return setAttributes({
        maxWidth: 0
      });
    };

    // useBlockProps で apiVersion 3 対応
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "paid-block-cta-4 ".concat(maxWidth > 0 ? 'max_w' : ''),
      style: maxWidth > 0 ? {
        maxWidth: maxWidth + 'px'
      } : {}
    });

    // === カラー設定用サンプル ===
    var colors = [{
      name: '青',
      color: '#268193'
    }, {
      name: '赤',
      color: '#d00000'
    }, {
      name: '緑',
      color: '#008000'
    }, {
      name: '白',
      color: '#ffffff'
    }, {
      name: '黒',
      color: '#000000'
    }];
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A",
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
    }, "\uD83D\uDCD0 \u6700\u5927\u6A2A\u5E45\u306E\u8A2D\u5B9A"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45 ".concat(maxWidth > 0 ? "(".concat(maxWidth, "px)") : '(未設定)'),
      value: maxWidth,
      onChange: onChangeMaxWidth,
      min: 800,
      max: 1600,
      help: "\u30D6\u30ED\u30C3\u30AF\u5168\u4F53\u306E\u6700\u5927\u6A2A\u5E45\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u30020\u3067\u672A\u8A2D\u5B9A\u72B6\u614B\u306B\u306A\u308A\u307E\u3059\u3002"
    }), maxWidth > 0 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: onResetMaxWidth,
      style: {
        marginTop: '10px'
      }
    }, "\uD83D\uDD04 \u30EA\u30BB\u30C3\u30C8"))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=NAqO2JgjzBo",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089"))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "CTA1\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AF\u5148URL",
      value: linkUrl1,
      onChange: function onChange(value) {
        return setAttributes({
          linkUrl1: value
        });
      }
    }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.LinkPicker, {
      link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkFromAttrs)(attributes, LINK_KEYS_1),
      onChange: function onChange(patch) {
        return setAttributes((0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkToAttrs)(patch, LINK_KEYS_1));
      }
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onChangeBgImage1,
      allowedTypes: ['image'],
      value: backgroundImage1,
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, backgroundImage1 && /*#__PURE__*/React.createElement("img", {
          src: backgroundImage1,
          alt: "",
          style: {
            width: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary",
          style: {
            marginTop: '8px'
          }
        }, "\u80CC\u666F\u753B\u50CF\u3092\u9078\u629E"), backgroundImage1 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              backgroundImage1: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '8px'
          }
        }, "\u524A\u9664"));
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u30D5\u30A3\u30EB\u30BF\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: filterColor1,
      onChange: function onChange(color) {
        return setAttributes({
          filterColor1: color
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30D5\u30A3\u30EB\u30BF\u30FC\u4E0D\u900F\u660E\u5EA6 (".concat(filterOpacity1, "%)"),
      value: filterOpacity1,
      onChange: function onChange(value) {
        return setAttributes({
          filterOpacity1: value
        });
      },
      min: 0,
      max: 100
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: bgColor1,
      onChange: function onChange(color) {
        return setAttributes({
          bgColor1: color
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u6587\u5B57\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: textColor1,
      onChange: function onChange(color) {
        return setAttributes({
          textColor1: color
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "CTA2\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AF\u5148URL",
      value: linkUrl2,
      onChange: function onChange(value) {
        return setAttributes({
          linkUrl2: value
        });
      }
    }), /*#__PURE__*/React.createElement(_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.LinkPicker, {
      link: (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkFromAttrs)(attributes, LINK_KEYS_2),
      onChange: function onChange(patch) {
        return setAttributes((0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkToAttrs)(patch, LINK_KEYS_2));
      }
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onChangeBgImage2,
      allowedTypes: ['image'],
      value: backgroundImage2,
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, backgroundImage2 && /*#__PURE__*/React.createElement("img", {
          src: backgroundImage2,
          alt: "",
          style: {
            width: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary",
          style: {
            marginTop: '8px'
          }
        }, "\u80CC\u666F\u753B\u50CF\u3092\u9078\u629E"), backgroundImage2 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              backgroundImage2: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '8px'
          }
        }, "\u524A\u9664"));
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u30D5\u30A3\u30EB\u30BF\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: filterColor2,
      onChange: function onChange(color) {
        return setAttributes({
          filterColor2: color
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30D5\u30A3\u30EB\u30BF\u30FC\u4E0D\u900F\u660E\u5EA6 (".concat(filterOpacity2, "%)"),
      value: filterOpacity2,
      onChange: function onChange(value) {
        return setAttributes({
          filterOpacity2: value
        });
      },
      min: 0,
      max: 100
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: bgColor2,
      onChange: function onChange(color) {
        return setAttributes({
          bgColor2: color
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u6587\u5B57\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: textColor2,
      onChange: function onChange(color) {
        return setAttributes({
          textColor2: color
        });
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "paid-block-cta-4__inner"
    }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
      className: "a"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: mainTitle1,
      onChange: function onChange(value) {
        return setAttributes({
          mainTitle1: value
        });
      },
      placeholder: "Recruit"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: subTitle1,
      onChange: function onChange(value) {
        return setAttributes({
          subTitle1: value
        });
      },
      placeholder: "\u30B5\u30D6\u30C6\u30AD\u30B9\u30C8"
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: desc1,
      onChange: function onChange(value) {
        return setAttributes({
          desc1: value
        });
      },
      placeholder: "\u25EF\u3067\u306F\u3001\u4E00\u7DD2\u306B\u50CD\u304F\u30B9\u30BF\u30C3\u30D5\u3092..."
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "div",
      value: btnText1,
      onChange: function onChange(value) {
        return setAttributes({
          btnText1: value
        });
      },
      placeholder: "\u8A73\u7D30\u306F\u3053\u3061\u3089",
      style: {
        color: textColor1
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor1
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5  12.5 32.8 0 45.3l-192 192c-12.5  12.5-32.8 12.5-45.3 0s-12.5-32.8  0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8  0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor1,
        opacity: filterOpacity1 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage1 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage1,
      alt: "CTA1\u80CC\u666F"
    }))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
      className: "a"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: mainTitle2,
      onChange: function onChange(value) {
        return setAttributes({
          mainTitle2: value
        });
      },
      placeholder: "Contact"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: subTitle2,
      onChange: function onChange(value) {
        return setAttributes({
          subTitle2: value
        });
      },
      placeholder: "\u30B5\u30D6\u30C6\u30AD\u30B9\u30C8"
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: desc2,
      onChange: function onChange(value) {
        return setAttributes({
          desc2: value
        });
      },
      placeholder: "\u25EF\u3067\u306F\u3001\u4E00\u7DD2\u306B\u50CD\u304F\u30B9\u30BF\u30C3\u30D5\u3092..."
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "div",
      value: btnText2,
      onChange: function onChange(value) {
        return setAttributes({
          btnText2: value
        });
      },
      placeholder: "\u8A73\u7D30\u306F\u3053\u3061\u3089",
      style: {
        color: textColor2
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor2
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5  12.5 32.8 0 45.3l-192 192c-12.5  12.5-32.8 12.5-45.3 0s-12.5-32.8  0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8  0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor2
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor2,
        opacity: filterOpacity2 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage2 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage2,
      alt: "CTA2\u80CC\u666F"
    }))))));
  },
  /**
   * =========================================
   * 保存時(フロントエンド)用の表示
   * =========================================
   */
  save: function save(props) {
    var attributes = props.attributes;
    var linkUrl1 = attributes.linkUrl1,
      mainTitle1 = attributes.mainTitle1,
      subTitle1 = attributes.subTitle1,
      desc1 = attributes.desc1,
      backgroundImage1 = attributes.backgroundImage1,
      filterColor1 = attributes.filterColor1,
      filterOpacity1 = attributes.filterOpacity1,
      btnText1 = attributes.btnText1,
      bgColor1 = attributes.bgColor1,
      textColor1 = attributes.textColor1,
      linkUrl2 = attributes.linkUrl2,
      mainTitle2 = attributes.mainTitle2,
      subTitle2 = attributes.subTitle2,
      desc2 = attributes.desc2,
      backgroundImage2 = attributes.backgroundImage2,
      filterColor2 = attributes.filterColor2,
      filterOpacity2 = attributes.filterOpacity2,
      btnText2 = attributes.btnText2,
      bgColor2 = attributes.bgColor2,
      textColor2 = attributes.textColor2,
      maxWidth = attributes.maxWidth;

    // useBlockProps.save() で apiVersion 3 対応
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "paid-block-cta-4 ".concat(maxWidth > 0 ? 'max_w' : ''),
      style: maxWidth > 0 ? {
        maxWidth: maxWidth + 'px'
      } : {}
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: linkUrl1 || '#',
      "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS_1).linkType,
      "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS_1).linkId
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: mainTitle1
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: subTitle1
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: desc1
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "div",
      value: btnText1,
      style: {
        color: textColor1
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor1
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5  12.5 32.8 0 45.3l-192 192c-12.5  12.5-32.8 12.5-45.3 0s-12.5-32.8  0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8  0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor1,
        color: textColor1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor1,
        opacity: filterOpacity1 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage1 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage1,
      alt: "CTA1\u80CC\u666F"
    }))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: linkUrl2 || '#',
      "data-lw-link-type": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS_2).linkType,
      "data-lw-link-id": (0,_link_picker_js__WEBPACK_IMPORTED_MODULE_5__.lwLinkDataPropsFromAttrs)(attributes, LINK_KEYS_2).linkId
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: mainTitle2
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: subTitle2
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: desc2
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "div",
      value: btnText2,
      style: {
        color: textColor2
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor2
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5  12.5 32.8 0 45.3l-192 192c-12.5  12.5-32.8 12.5-45.3 0s-12.5-32.8  0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8  0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor2,
        color: textColor2
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor2,
        opacity: filterOpacity2 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage2 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage2,
      alt: "CTA2\u80CC\u666F"
    })))));
  }
});
/******/ })()
;