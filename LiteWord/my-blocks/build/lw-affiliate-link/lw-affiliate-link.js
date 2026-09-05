/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/rich-text":
/*!**********************************!*\
  !*** external ["wp","richText"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["richText"];

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
/*!****************************************!*\
  !*** ./src/lw-affiliate-link/index.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 文中のリンクに「広告リンク（アフィリエイト）」の印を付ける書式ボタン
 * ==================================================================
 * ボタン系のブロックには「広告リンク」の設定を付けたが（lw-button-* / lw-pr-product-1）、
 * アフィリエイトのリンクの大半は文章の中にある（「詳しくは こちら」の“こちら”）。
 * そこが裸のままだったので、リンクの上にいるときだけツールバーに印を付けるボタンを出す。
 *
 * 付ける印は rel="sponsored nofollow"。ブロック側の LW_AFFILIATE_REL と同じ値にそろえてある
 * （src/affiliate-link.js）。Google は広告・有料リンクに sponsored を求めており、
 * WordPress 7.1 のリンク設定にあるのは nofollow だけで sponsored は無い。
 *
 * 🚨 target（新しいタブで開く）は触らない。
 *    WordPress のリンク設定に「新しいタブで開く」が既にあるので、そちらと役割を分ける。
 *    ブロック側の広告リンク設定も新しいタブとは独立している。挙動をそろえるため。
 *
 * 登録: functions/css_js_set/editor.php（wp_enqueue_script）
 * ビルド: LW_BLOCK=lw-affiliate-link node ./node_modules/webpack/bin/webpack.js --config webpack.one.js
 */


var LINK_FORMAT = 'core/link';
var AFFILIATE_REL = ['sponsored', 'nofollow'];
var toList = function toList(rel) {
  return String(rel || '').split(/\s+/).filter(Boolean);
};

/**
 * そのリンクが本文のどこからどこまでかを返す。
 * 1本のリンクは同じ format オブジェクトを文字ごとに共有しているので、
 * その参照を持つ文字の範囲を探せばよい（本体の getFormatBoundary と同じ考え方。
 * あちらは @wordpress/rich-text から出ていないので自前で持つ）。
 *
 * 離れた場所に同じ URL を2回貼っても混ざらない。normaliseFormats が参照を
 * まとめるのは「1つ前の文字と同じとき」だけなので、あいだにリンクでない文字が
 * 1つでもあれば連なりが切れて別オブジェクトのままになる。
 * 隣り合った同じリンクは1つの参照にまとめられるが、そちらは rich-text 自身が
 * 1本のリンクとして扱うものなので、まとめて印を付けるのが正しい。
 */
function linkRange(value, format) {
  var formats = value.formats;
  var start = -1;
  var end = -1;
  for (var i = 0; i < formats.length; i++) {
    if (Array.isArray(formats[i]) && formats[i].indexOf(format) !== -1) {
      if (start === -1) {
        start = i;
      }
      end = i + 1;
    }
  }
  return start === -1 ? null : {
    start: start,
    end: end
  };
}
var Edit = function Edit(_ref) {
  var value = _ref.value,
    onChange = _ref.onChange;
  var link = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.getActiveFormat)(value, LINK_FORMAT);
  /* リンクの上にいないときはボタンを出さない（押しても何も起きないボタンを見せない） */
  if (!link) {
    return null;
  }
  var rel = toList(link.attributes && link.attributes.rel);
  var isOn = rel.indexOf('sponsored') !== -1;
  var toggle = function toggle() {
    var range = linkRange(value, link);
    if (!range) {
      return;
    }

    /* 🚨 外すときに消すのは sponsored だけ。
       nofollow は WordPress のリンク設定にもあり、利用者が自分で付けていることがある。
       両方消すと、このボタンを一度押して戻しただけで利用者の nofollow が黙って消える。
       付けるときは sponsored と nofollow を両方入れる（Google が求める形）。
       戻したときに nofollow が残るのは、外れて困るものではないので許容する。 */
    var next = isOn ? rel.filter(function (r) {
      return r !== 'sponsored';
    }) : rel.filter(function (r) {
      return AFFILIATE_REL.indexOf(r) === -1;
    }).concat(AFFILIATE_REL);
    var attributes = _objectSpread({}, link.attributes || {});
    if (next.length) {
      attributes.rel = next.join(' ');
    } else {
      delete attributes.rel;
    }

    /* 🚨 { type, attributes } だけの新しい物を渡さないこと。
       core/link に登録されていない属性（class・title など）は format の
       unregisteredAttributes に入っていて、作り直すと落ちる。
       元の format を広げて attributes だけ差し替える。 */
    onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.applyFormat)(value, _objectSpread(_objectSpread({}, link), {}, {
      attributes: attributes
    }), range.start, range.end));
  };
  return /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichTextToolbarButton, {
    icon: "megaphone",
    title: isOn ? '広告リンクの印を外す' : '広告リンク（アフィリエイト）',
    onClick: toggle,
    isActive: isOn
  });
};

/* 🚨 この書式そのものは本文に付けない（付けるのは core/link の rel）。
   ツールバーにボタンを出すためだけに登録する（br-on-none と同じやり方）。
   tagName と className は他とぶつからない名前にしてある。 */
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.registerFormatType)('liteword/affiliate-link', {
  title: '広告リンク（アフィリエイト）',
  tagName: 'span',
  className: 'lw-affiliate-link-marker',
  edit: Edit
});
/******/ })()
;