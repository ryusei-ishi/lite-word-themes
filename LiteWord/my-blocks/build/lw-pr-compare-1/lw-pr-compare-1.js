/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-pr-compare-1/index.js":
/*!**************************************!*\
  !*** ./src/lw-pr-compare-1/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-compare-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-pr-compare-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-compare-1/block.json");
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
/**
 * 条件チェックリスト 01（wdl/lw-pr-compare-1）
 * ------------------------------------------------------------
 *  2つの分類（よくある条件／見落としやすい条件 など）を、
 *  上下2段・全幅の行カードで見せる。写真は使わない。
 *
 *  なぜこの形にしたか（2026-09-04）
 *  ・lw-pr-list-5/8（リスト+写真）が「よくある型でダサい」「文字が見にくくガタガタ」
 *    と指摘され、写真を使わない代わりのパターンとして新規に作った。
 *  ・左右2箱（lw-pr-goodbad-1と同じ絵）にすると、同じページ内に既にある
 *    goodbad-1 の見た目と重なってしまうため、あえて縦積み・全幅の行カードにした。
 *  ・項目を狭い列に割ると折り返しが増えて読みにくくなる（ガタガタに見える）ので、
 *    各項目は必ず全幅1本の行として描画する。左端に色付きバー+丸バッジを揃えることで、
 *    行ごとの折り返し行数が違っても左端は綺麗に揃う。
 */






var CLS = 'lw-pr-compare-1';

/** 空の行は出さない（`<br>` だけの空タグも落とす） */
var clean = function clean(list) {
  return (list || []).filter(function (s) {
    return String(s || '').replace(/<[^>]*>/g, '').replace(/&nbsp;| /g, ' ').trim() !== '';
  });
};
function blockVars(a) {
  return {
    marginTop: "".concat(a.marginTop, "px"),
    marginBottom: "".concat(a.marginBottom, "px"),
    '--cmp1-max-width': "".concat(a.maxWidth, "px")
  };
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, _objectSpread(_objectSpread({}, _block_json__WEBPACK_IMPORTED_MODULE_5__), {}, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var firstLabel = attributes.firstLabel,
      firstMark = attributes.firstMark,
      firstItems = attributes.firstItems,
      firstColor = attributes.firstColor,
      secondLabel = attributes.secondLabel,
      secondMark = attributes.secondMark,
      secondItems = attributes.secondItems,
      secondColor = attributes.secondColor,
      rowBgColor = attributes.rowBgColor,
      textColor = attributes.textColor;
    var setRow = function setRow(key, i, v) {
      var list = (attributes[key] || []).slice();
      list[i] = v;
      setAttributes(_defineProperty({}, key, list));
    };
    var addRow = function addRow(key) {
      return setAttributes(_defineProperty({}, key, [].concat(_toConsumableArray(attributes[key] || []), [''])));
    };
    var delRow = function delRow(key, i) {
      return setAttributes(_defineProperty({}, key, (attributes[key] || []).filter(function (_, k) {
        return k !== i;
      })));
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: CLS,
      style: blockVars(attributes)
    });
    var tier = function tier(kind, label, labelKey, mark, markKey, items, key, color) {
      return /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__tier is-").concat(kind)
      }, /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__tier-head")
      }, /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__badge"),
        style: {
          backgroundColor: color
        }
      }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        value: mark,
        onChange: function onChange(v) {
          return setAttributes(_defineProperty({}, markKey, v));
        }
      })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "p",
        className: "".concat(CLS, "__tier-title"),
        value: label,
        onChange: function onChange(v) {
          return setAttributes(_defineProperty({}, labelKey, v));
        },
        style: {
          color: color
        }
      })), /*#__PURE__*/React.createElement("ul", {
        className: "".concat(CLS, "__rows")
      }, (items || []).map(function (row, i) {
        return /*#__PURE__*/React.createElement("li", {
          key: i,
          className: "".concat(CLS, "__row"),
          style: {
            backgroundColor: rowBgColor,
            borderLeftColor: color
          }
        }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
          tagName: "span",
          className: "".concat(CLS, "__row-text"),
          value: row,
          onChange: function onChange(v) {
            return setRow(key, i, v);
          },
          placeholder: "1\u884C\u305A\u3064\u66F8\u3044\u3066\u304F\u3060\u3055\u3044",
          style: {
            color: textColor
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          className: "".concat(CLS, "__ed-del"),
          isDestructive: true,
          variant: "tertiary",
          onClick: function onClick() {
            return delRow(key, i);
          }
        }, "\xD7"));
      })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        className: "".concat(CLS, "__ed-add"),
        onClick: function onClick() {
          return addRow(key);
        }
      }, "\uFF0B \u884C\u3092\u8FFD\u52A0"));
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8868\u793A\u306E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "1\u6BB5\u76EE\u306E\u898B\u51FA\u3057",
      value: firstLabel,
      onChange: function onChange(v) {
        return setAttributes({
          firstLabel: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "2\u6BB5\u76EE\u306E\u898B\u51FA\u3057",
      value: secondLabel,
      onChange: function onChange(v) {
        return setAttributes({
          secondLabel: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u5927\u304D\u3055\u30FB\u4F59\u767D",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5168\u4F53\u306E\u6700\u5927\u5E45",
      min: 480,
      max: 1200,
      value: attributes.maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A\u306E\u4F59\u767D",
      min: 0,
      max: 120,
      value: attributes.marginTop,
      onChange: function onChange(v) {
        return setAttributes({
          marginTop: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B\u306E\u4F59\u767D",
      min: 0,
      max: 120,
      value: attributes.marginBottom,
      onChange: function onChange(v) {
        return setAttributes({
          marginBottom: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("p", null, "1\u6BB5\u76EE\u306E\u8272\uFF08\u30D0\u30C3\u30B8\u30FB\u898B\u51FA\u3057\u30FB\u884C\u306E\u5DE6\u7DDA\uFF09"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: firstColor,
      onChange: function onChange(v) {
        return setAttributes({
          firstColor: v || 'var(--color-main)'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "2\u6BB5\u76EE\u306E\u8272\uFF08\u30D0\u30C3\u30B8\u30FB\u898B\u51FA\u3057\u30FB\u884C\u306E\u5DE6\u7DDA\uFF09"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: secondColor,
      onChange: function onChange(v) {
        return setAttributes({
          secondColor: v || '#7a2e3a'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u884C\u306E\u80CC\u666F"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: rowBgColor,
      onChange: function onChange(v) {
        return setAttributes({
          rowBgColor: v || '#faf7ef'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u672C\u6587\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: textColor,
      onChange: function onChange(v) {
        return setAttributes({
          textColor: v || '#1f2733'
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, tier('first', firstLabel, 'firstLabel', firstMark, 'firstMark', firstItems, 'firstItems', firstColor), tier('second', secondLabel, 'secondLabel', secondMark, 'secondMark', secondItems, 'secondItems', secondColor)));
  },
  save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var firstLabel = attributes.firstLabel,
      firstMark = attributes.firstMark,
      firstItems = attributes.firstItems,
      firstColor = attributes.firstColor,
      secondLabel = attributes.secondLabel,
      secondMark = attributes.secondMark,
      secondItems = attributes.secondItems,
      secondColor = attributes.secondColor,
      rowBgColor = attributes.rowBgColor,
      textColor = attributes.textColor;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: CLS,
      style: blockVars(attributes)
    });
    var tier = function tier(kind, label, mark, items, color) {
      return /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__tier is-").concat(kind)
      }, /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__tier-head")
      }, /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__badge"),
        style: {
          backgroundColor: color
        }
      }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "span",
        value: mark
      })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "p",
        className: "".concat(CLS, "__tier-title"),
        value: label,
        style: {
          color: color
        }
      })), /*#__PURE__*/React.createElement("ul", {
        className: "".concat(CLS, "__rows")
      }, clean(items).map(function (row, i) {
        return /*#__PURE__*/React.createElement("li", {
          key: i,
          className: "".concat(CLS, "__row"),
          style: {
            backgroundColor: rowBgColor,
            borderLeftColor: color
          }
        }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
          tagName: "span",
          className: "".concat(CLS, "__row-text"),
          value: row,
          style: {
            color: textColor
          }
        }));
      })));
    };
    return /*#__PURE__*/React.createElement("div", blockProps, tier('first', firstLabel, firstMark, firstItems, firstColor), tier('second', secondLabel, secondMark, secondItems, secondColor));
  }
}));

/***/ }),

/***/ "./src/lw-pr-compare-1/editor.scss":
/*!*****************************************!*\
  !*** ./src/lw-pr-compare-1/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-pr-compare-1/style.scss":
/*!****************************************!*\
  !*** ./src/lw-pr-compare-1/style.scss ***!
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

/***/ "./src/lw-pr-compare-1/block.json":
/*!****************************************!*\
  !*** ./src/lw-pr-compare-1/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-compare-1","version":"1.0.0","title":"条件チェックリスト 01","category":"lw-list","icon":"editor-ul","description":"2つの分類（よくある条件／見落としやすい条件 など）を、上下2段の全幅チェックリストで見せるブロックです。写真は使いません。","aiDescription":"「よくある条件／見落としやすい条件」「知っておきたいこと／注意すること」のように、2つの対になる分類を上下2段のチェックリストで見せるブロック。各段は丸バッジ＋見出しのあと、項目を1行=1本の全幅バーで縦に並べる（横並びの箱でも、写真付きリストでもない）。lw-pr-goodbad-1（左右2箱）やlw-pr-list-5/8（リスト+写真）とは見た目が重ならないよう、あえて縦積み・全幅の行カード形式にしている。","aiNotes":"2026-09-04新設。背景: リスト+写真の構成（lw-pr-list-5/8）がRyuichiに『よくある型でダサい』『文字も見にくくガタガタ』と指摘され、写真を使わない新パターンとして作成。設計判断: ①左右2箱（lw-pr-goodbad-1と同じ絵）は同一ページ内で使うと重複して見えるため避け、上下2段×全幅1列の行カードにした。②項目を狭い列に割ると行の折り返しが増えて読みにくい（ガタガタに見える）ため、各項目は必ず全幅1本の行にする。③行の左端に色付きの縦バー+丸バッジを揃えて置くことで、テキストの折り返し行数が項目ごとに違っても左端は綺麗に揃う。","aiHint":{"description":"上下2段の全幅チェックリスト。写真なし。各段は丸バッジ＋見出しのあと、項目を1行=1本の横長カードで縦に並べる。よくある/見落としがち、知っておきたい/注意する、のような2区分の説明に","excludeFromAutoSelect":false,"contentAttributes":["firstLabel","firstItems","secondLabel","secondItems"],"imageAttributes":[],"notes":"firstMark/secondMarkは絵文字ではなく○△✓!のような1〜2文字の記号にする。項目（firstItems/secondItems）は文字列の配列で、1要素=1行のフルワイド行カードとして描画される（2列に割った内部レイアウトは持たない。2026-09-04にRyuichi指摘のガタガタ対策）。1項目は20〜50文字程度が読みやすい。件数は上下で違っていてよい（3〜6件推奨）。"},"supports":{"anchor":true},"attributes":{"firstLabel":{"type":"string","default":"よくある条件","ai_description":"1段目（上）の見出し"},"firstMark":{"type":"string","default":"○","ai_description":"1段目の丸バッジの中の文字（1〜2文字）"},"firstItems":{"type":"array","default":["テキストテキストテキストテキスト","テキストテキストテキストテキスト","テキストテキストテキストテキスト"],"ai_description":"1段目の項目（1要素=1行のフルワイド行カード）"},"firstColor":{"type":"string","default":"var(--color-main)","ai_description":"1段目のバッジ・見出し・行の左アクセント色"},"secondLabel":{"type":"string","default":"見落としやすい条件","ai_description":"2段目（下）の見出し"},"secondMark":{"type":"string","default":"△","ai_description":"2段目の丸バッジの中の文字（1〜2文字）"},"secondItems":{"type":"array","default":["テキストテキストテキストテキスト","テキストテキストテキストテキスト","テキストテキストテキストテキスト"],"ai_description":"2段目の項目（1要素=1行のフルワイド行カード）"},"secondColor":{"type":"string","default":"#7a2e3a","ai_description":"2段目のバッジ・見出し・行の左アクセント色"},"rowBgColor":{"type":"string","default":"#faf7ef","ai_description":"行カードの背景色（上下共通）"},"textColor":{"type":"string","default":"#1f2733","ai_description":"項目本文の文字色"},"maxWidth":{"type":"number","default":1040,"ai_description":"ブロック全体の最大幅(px)"},"marginTop":{"type":"number","default":0,"ai_description":"ブロック上の余白(px)"},"marginBottom":{"type":"number","default":0,"ai_description":"ブロック下の余白(px)"}},"editorScript":"file:./lw-pr-compare-1.js","no":200}');

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
/******/ 			"lw-pr-compare-1": 0,
/******/ 			"./style-lw-pr-compare-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-compare-1"], () => (__webpack_require__("./src/lw-pr-compare-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;