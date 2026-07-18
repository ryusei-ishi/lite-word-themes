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

/***/ "./src/lw-pr-column-1/block.json":
/*!***************************************!*\
  !*** ./src/lw-pr-column-1/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-column-1","version":"1.0.0","title":"Column 01","category":"lw-utility","icon":"grid-view","description":"カラムレイアウトブロック。アイテムを自由に追加可能。","aiDescription":"グリッドベースのカラムレイアウト。PC/SPでカラム数やギャップを個別設定可能。各アイテム内にはInnerBlocksで任意のコンテンツを配置可能。","aiNotes":"親ブロックとしてlw-pr-column-1-itemのみ許可。カラム比率、ギャップ、背景色、余白などをサイドバーで設定可能。","aiHint":{"description":"カラムコンテナ。InnerBlocksで自由レイアウト。テキスト属性なし","excludeFromAutoSelect":true,"contentAttributes":[],"imageAttributes":[],"excludeReason":"InnerBlocksコンテナ。AI直接生成非推奨"},"supports":{"anchor":true,"className":true},"attributes":{"wrapPaddingTopPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の上余白PC（px）"},"wrapPaddingRightPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の右余白PC（px）"},"wrapPaddingBottomPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の下余白PC（px）"},"wrapPaddingLeftPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の左余白PC（px）"},"wrapPaddingTopSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の上余白SP（px）。-1でPCを継承"},"wrapPaddingRightSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の右余白SP（px）。-1でPCを継承"},"wrapPaddingBottomSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の下余白SP（px）。-1でPCを継承"},"wrapPaddingLeftSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の左余白SP（px）。-1でPCを継承"},"borderColorPc":{"type":"string","default":"rgb(131, 131, 131)","ai_description":"ラップ（外枠）のボーダー色PC"},"borderWidthPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）のボーダー幅PC（px）"},"borderStylePc":{"type":"string","default":"solid","ai_description":"ラップ（外枠）のボーダースタイルPC。solid/dashed/dotted/none"},"borderColorSp":{"type":"string","default":"","ai_description":"ラップ（外枠）のボーダー色SP。空でPCを継承"},"borderWidthSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）のボーダー幅SP（px）。-1でPCを継承"},"borderStyleSp":{"type":"string","default":"","ai_description":"ラップ（外枠）のボーダースタイルSP。空でPCを継承"},"columnsPc":{"type":"number","default":3,"ai_description":"グリッドのカラム（列）数PC。1〜6の範囲"},"columnWidthsPc":{"type":"array","default":[1,1,1],"ai_description":"各カラムの幅比率PC（fr単位の配列）。例: [1,2,1]で1:2:1の比率"},"columnsSp":{"type":"number","default":2,"ai_description":"グリッドのカラム（列）数SP。1〜4の範囲"},"columnWidthsSp":{"type":"array","default":[],"ai_description":"各カラムの幅比率SP（fr単位の配列）。空配列でPCを継承"},"rowGapPc":{"type":"number","default":8,"ai_description":"グリッドの行間（縦方向の間隔）PC（px）"},"rowGapSp":{"type":"number","default":-1,"ai_description":"グリッドの行間（縦方向の間隔）SP（px）。-1でPCを継承"},"columnGapPc":{"type":"number","default":8,"ai_description":"グリッドの列間（横方向の間隔）PC（px）"},"columnGapSp":{"type":"number","default":-1,"ai_description":"グリッドの列間（横方向の間隔）SP（px）。-1でPCを継承"},"itemBgNone":{"type":"boolean","default":true,"ai_description":"アイテム（各カラム）の背景を無しにするかどうか。trueで透明"},"itemBgColor":{"type":"string","default":"#ffffff","ai_description":"アイテム（各カラム）の背景色。全アイテム共通（旧属性、互換性用）"},"itemBgTypePc":{"type":"string","default":"solid","ai_description":"アイテム背景タイプPC。solid（単色）またはgradient（グラデーション）"},"itemBgColorPc":{"type":"string","default":"","ai_description":"アイテム背景色PC。itemBgTypePcがsolidの時に使用"},"itemBgGradientPc":{"type":"string","default":"","ai_description":"アイテムグラデーションPC。itemBgTypePcがgradientの時に使用"},"itemBgTypeSp":{"type":"string","default":"solid","ai_description":"アイテム背景タイプSP。solid（単色）またはgradient（グラデーション）"},"itemBgColorSp":{"type":"string","default":"","ai_description":"アイテム背景色SP。空でPCを継承"},"itemBgGradientSp":{"type":"string","default":"","ai_description":"アイテムグラデーションSP。空でPCを継承"},"itemMinHeightPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の最小高さPC（px）。0で自動"},"itemMinHeightSp":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の最小高さSP（px）。0で自動。PCとは独立"},"itemPaddingTopPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の上余白PC（px）"},"itemPaddingRightPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の右余白PC（px）"},"itemPaddingBottomPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の下余白PC（px）"},"itemPaddingLeftPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の左余白PC（px）"},"itemPaddingTopSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の上余白SP（px）。-1でPCを継承"},"itemPaddingRightSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の右余白SP（px）。-1でPCを継承"},"itemPaddingBottomSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の下余白SP（px）。-1でPCを継承"},"itemPaddingLeftSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の左余白SP（px）。-1でPCを継承"},"itemBorderRadiusTopLeftPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の左上角丸PC（px）"},"itemBorderRadiusTopRightPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の右上角丸PC（px）"},"itemBorderRadiusBottomRightPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の右下角丸PC（px）"},"itemBorderRadiusBottomLeftPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）の左下角丸PC（px）"},"itemBorderRadiusTopLeftSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の左上角丸SP（px）。-1でPCを継承"},"itemBorderRadiusTopRightSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の右上角丸SP（px）。-1でPCを継承"},"itemBorderRadiusBottomRightSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の右下角丸SP（px）。-1でPCを継承"},"itemBorderRadiusBottomLeftSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）の左下角丸SP（px）。-1でPCを継承"},"itemBorderColorPc":{"type":"string","default":"rgb(131, 131, 131)","ai_description":"アイテム（各カラム）のボーダー色PC"},"itemBorderWidthPc":{"type":"number","default":0,"ai_description":"アイテム（各カラム）のボーダー幅PC（px）"},"itemBorderStylePc":{"type":"string","default":"solid","ai_description":"アイテム（各カラム）のボーダースタイルPC。solid/dashed/dotted/none"},"itemBorderColorSp":{"type":"string","default":"","ai_description":"アイテム（各カラム）のボーダー色SP。空でPCを継承"},"itemBorderWidthSp":{"type":"number","default":-1,"ai_description":"アイテム（各カラム）のボーダー幅SP（px）。-1でPCを継承"},"itemBorderStyleSp":{"type":"string","default":"","ai_description":"アイテム（各カラム）のボーダースタイルSP。空でPCを継承"},"borderRadiusTopLeftPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の左上角丸PC（px）"},"borderRadiusTopRightPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の右上角丸PC（px）"},"borderRadiusBottomRightPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の右下角丸PC（px）"},"borderRadiusBottomLeftPc":{"type":"number","default":0,"ai_description":"ラップ（外枠）の左下角丸PC（px）"},"borderRadiusTopLeftSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の左上角丸SP（px）。-1でPCを継承"},"borderRadiusTopRightSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の右上角丸SP（px）。-1でPCを継承"},"borderRadiusBottomRightSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の右下角丸SP（px）。-1でPCを継承"},"borderRadiusBottomLeftSp":{"type":"number","default":-1,"ai_description":"ラップ（外枠）の左下角丸SP（px）。-1でPCを継承"},"wrapBgTypePc":{"type":"string","default":"solid","ai_description":"ラップ（外枠）の背景タイプPC。solid（単色）またはgradient（グラデーション）"},"wrapBgColorPc":{"type":"string","default":"","ai_description":"ラップ（外枠）の背景色PC。wrapBgTypePcがsolidの時に使用"},"wrapBgGradientPc":{"type":"string","default":"","ai_description":"ラップ（外枠）のグラデーションPC。wrapBgTypePcがgradientの時に使用"},"wrapBgTypeSp":{"type":"string","default":"solid","ai_description":"ラップ（外枠）の背景タイプSP。solid（単色）またはgradient（グラデーション）"},"wrapBgColorSp":{"type":"string","default":"","ai_description":"ラップ（外枠）の背景色SP。空でPCを継承"},"wrapBgGradientSp":{"type":"string","default":"","ai_description":"ラップ（外枠）のグラデーションSP。空でPCを継承"},"spBreakpoint":{"type":"string","default":"","ai_description":"SPブレークポイントの値。空でデフォルト(700px)、600/500/400から選択可能"}},"editorScript":"file:./lw-pr-column-1.js","no":1}');

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
/*!*************************************!*\
  !*** ./src/lw-pr-column-1/index.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-column-1/block.json");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



// import "./style.scss";  // block.json の style で読み込み済みのため無効化
// import "./editor.scss";  // block.json の editorStyle で読み込み済みのため無効化

var ALLOWED_BLOCKS = ["wdl/lw-pr-column-1-item"];
var TEMPLATE = [["wdl/lw-pr-column-1-item", {}], ["wdl/lw-pr-column-1-item", {}], ["wdl/lw-pr-column-1-item", {}]];

// 子ブロック（Column Item）の登録
var ITEM_TEMPLATE = [["core/paragraph", {}]];
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("wdl/lw-pr-column-1-item", {
  title: "Column 01 Item",
  category: "lw-utility",
  icon: "screenoptions",
  description: "Column 01のアイテムブロック。内部に任意のブロックを配置可能。",
  parent: ["wdl/lw-pr-column-1"],
  supports: {
    anchor: true,
    className: true
  },
  attributes: {},
  edit: function edit() {
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "custom_column_item"
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
      template: ITEM_TEMPLATE,
      renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender
    }));
  },
  save: function save() {
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "custom_column_item"
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null));
  }
});

// 親ブロック（Column Container）の登録
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var wrapPaddingTopPc = attributes.wrapPaddingTopPc,
      wrapPaddingRightPc = attributes.wrapPaddingRightPc,
      wrapPaddingBottomPc = attributes.wrapPaddingBottomPc,
      wrapPaddingLeftPc = attributes.wrapPaddingLeftPc,
      wrapPaddingTopSp = attributes.wrapPaddingTopSp,
      wrapPaddingRightSp = attributes.wrapPaddingRightSp,
      wrapPaddingBottomSp = attributes.wrapPaddingBottomSp,
      wrapPaddingLeftSp = attributes.wrapPaddingLeftSp,
      borderColorPc = attributes.borderColorPc,
      borderWidthPc = attributes.borderWidthPc,
      borderStylePc = attributes.borderStylePc,
      borderColorSp = attributes.borderColorSp,
      borderWidthSp = attributes.borderWidthSp,
      borderStyleSp = attributes.borderStyleSp,
      borderRadiusTopLeftPc = attributes.borderRadiusTopLeftPc,
      borderRadiusTopRightPc = attributes.borderRadiusTopRightPc,
      borderRadiusBottomRightPc = attributes.borderRadiusBottomRightPc,
      borderRadiusBottomLeftPc = attributes.borderRadiusBottomLeftPc,
      borderRadiusTopLeftSp = attributes.borderRadiusTopLeftSp,
      borderRadiusTopRightSp = attributes.borderRadiusTopRightSp,
      borderRadiusBottomRightSp = attributes.borderRadiusBottomRightSp,
      borderRadiusBottomLeftSp = attributes.borderRadiusBottomLeftSp,
      wrapBgTypePc = attributes.wrapBgTypePc,
      wrapBgColorPc = attributes.wrapBgColorPc,
      wrapBgGradientPc = attributes.wrapBgGradientPc,
      wrapBgTypeSp = attributes.wrapBgTypeSp,
      wrapBgColorSp = attributes.wrapBgColorSp,
      wrapBgGradientSp = attributes.wrapBgGradientSp,
      columnsPc = attributes.columnsPc,
      columnWidthsPc = attributes.columnWidthsPc,
      columnsSp = attributes.columnsSp,
      columnWidthsSp = attributes.columnWidthsSp,
      rowGapPc = attributes.rowGapPc,
      rowGapSp = attributes.rowGapSp,
      columnGapPc = attributes.columnGapPc,
      columnGapSp = attributes.columnGapSp,
      itemBgNone = attributes.itemBgNone,
      itemBgColor = attributes.itemBgColor,
      itemBgTypePc = attributes.itemBgTypePc,
      itemBgColorPc = attributes.itemBgColorPc,
      itemBgGradientPc = attributes.itemBgGradientPc,
      itemBgTypeSp = attributes.itemBgTypeSp,
      itemBgColorSp = attributes.itemBgColorSp,
      itemBgGradientSp = attributes.itemBgGradientSp,
      itemMinHeightPc = attributes.itemMinHeightPc,
      itemMinHeightSp = attributes.itemMinHeightSp,
      itemPaddingTopPc = attributes.itemPaddingTopPc,
      itemPaddingRightPc = attributes.itemPaddingRightPc,
      itemPaddingBottomPc = attributes.itemPaddingBottomPc,
      itemPaddingLeftPc = attributes.itemPaddingLeftPc,
      itemPaddingTopSp = attributes.itemPaddingTopSp,
      itemPaddingRightSp = attributes.itemPaddingRightSp,
      itemPaddingBottomSp = attributes.itemPaddingBottomSp,
      itemPaddingLeftSp = attributes.itemPaddingLeftSp,
      itemBorderRadiusTopLeftPc = attributes.itemBorderRadiusTopLeftPc,
      itemBorderRadiusTopRightPc = attributes.itemBorderRadiusTopRightPc,
      itemBorderRadiusBottomRightPc = attributes.itemBorderRadiusBottomRightPc,
      itemBorderRadiusBottomLeftPc = attributes.itemBorderRadiusBottomLeftPc,
      itemBorderRadiusTopLeftSp = attributes.itemBorderRadiusTopLeftSp,
      itemBorderRadiusTopRightSp = attributes.itemBorderRadiusTopRightSp,
      itemBorderRadiusBottomRightSp = attributes.itemBorderRadiusBottomRightSp,
      itemBorderRadiusBottomLeftSp = attributes.itemBorderRadiusBottomLeftSp,
      itemBorderColorPc = attributes.itemBorderColorPc,
      itemBorderWidthPc = attributes.itemBorderWidthPc,
      itemBorderStylePc = attributes.itemBorderStylePc,
      itemBorderColorSp = attributes.itemBorderColorSp,
      itemBorderWidthSp = attributes.itemBorderWidthSp,
      itemBorderStyleSp = attributes.itemBorderStyleSp,
      spBreakpoint = attributes.spBreakpoint;
    var _useSettings = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useSettings)('color.gradients', 'color.palette'),
      _useSettings2 = _slicedToArray(_useSettings, 2),
      gradients = _useSettings2[0],
      colors = _useSettings2[1];
    var getWrapBg = function getWrapBg(type, color, gradient) {
      if (type === 'gradient' && gradient) return gradient;
      if (color) return color;
      return '';
    };
    var getItemBg = function getItemBg(type, color, gradient) {
      if (type === 'gradient' && gradient) return gradient;
      if (color) return color;
      return '';
    };

    // カラム幅配列をカラム数に合わせて調整
    var adjustedWidthsPc = Array.from({
      length: columnsPc
    }, function (_, i) {
      return columnWidthsPc[i] || 1;
    });
    var adjustedWidthsSp = Array.from({
      length: columnsSp
    }, function (_, i) {
      if (columnWidthsSp.length > 0 && columnWidthsSp[i] !== undefined) {
        return columnWidthsSp[i];
      }
      return adjustedWidthsPc[i] || 1;
    });
    var gtcPc = adjustedWidthsPc.map(function (w) {
      return "".concat(w, "fr");
    }).join(' ');
    var gtcSp = columnWidthsSp.length > 0 ? adjustedWidthsSp.map(function (w) {
      return "".concat(w, "fr");
    }).join(' ') : Array.from({
      length: columnsSp
    }, function (_, i) {
      return "".concat(adjustedWidthsPc[i] || 1, "fr");
    }).join(' ');
    var wrapPaddingPcVal = "".concat(wrapPaddingTopPc, "px ").concat(wrapPaddingRightPc, "px ").concat(wrapPaddingBottomPc, "px ").concat(wrapPaddingLeftPc, "px");
    var wrapPaddingSpVal = "".concat(wrapPaddingTopSp >= 0 ? wrapPaddingTopSp : wrapPaddingTopPc, "px ").concat(wrapPaddingRightSp >= 0 ? wrapPaddingRightSp : wrapPaddingRightPc, "px ").concat(wrapPaddingBottomSp >= 0 ? wrapPaddingBottomSp : wrapPaddingBottomPc, "px ").concat(wrapPaddingLeftSp >= 0 ? wrapPaddingLeftSp : wrapPaddingLeftPc, "px");
    var itemPaddingPcVal = "".concat(itemPaddingTopPc, "px ").concat(itemPaddingRightPc, "px ").concat(itemPaddingBottomPc, "px ").concat(itemPaddingLeftPc, "px");
    var itemPaddingSpVal = "".concat(itemPaddingTopSp >= 0 ? itemPaddingTopSp : itemPaddingTopPc, "px ").concat(itemPaddingRightSp >= 0 ? itemPaddingRightSp : itemPaddingRightPc, "px ").concat(itemPaddingBottomSp >= 0 ? itemPaddingBottomSp : itemPaddingBottomPc, "px ").concat(itemPaddingLeftSp >= 0 ? itemPaddingLeftSp : itemPaddingLeftPc, "px");
    var borderRadiusPcVal = "".concat(borderRadiusTopLeftPc, "px ").concat(borderRadiusTopRightPc, "px ").concat(borderRadiusBottomRightPc, "px ").concat(borderRadiusBottomLeftPc, "px");
    var borderRadiusSpVal = "".concat(borderRadiusTopLeftSp >= 0 ? borderRadiusTopLeftSp : borderRadiusTopLeftPc, "px ").concat(borderRadiusTopRightSp >= 0 ? borderRadiusTopRightSp : borderRadiusTopRightPc, "px ").concat(borderRadiusBottomRightSp >= 0 ? borderRadiusBottomRightSp : borderRadiusBottomRightPc, "px ").concat(borderRadiusBottomLeftSp >= 0 ? borderRadiusBottomLeftSp : borderRadiusBottomLeftPc, "px");
    var itemBorderRadiusPcVal = "".concat(itemBorderRadiusTopLeftPc, "px ").concat(itemBorderRadiusTopRightPc, "px ").concat(itemBorderRadiusBottomRightPc, "px ").concat(itemBorderRadiusBottomLeftPc, "px");
    var itemBorderRadiusSpVal = "".concat(itemBorderRadiusTopLeftSp >= 0 ? itemBorderRadiusTopLeftSp : itemBorderRadiusTopLeftPc, "px ").concat(itemBorderRadiusTopRightSp >= 0 ? itemBorderRadiusTopRightSp : itemBorderRadiusTopRightPc, "px ").concat(itemBorderRadiusBottomRightSp >= 0 ? itemBorderRadiusBottomRightSp : itemBorderRadiusBottomRightPc, "px ").concat(itemBorderRadiusBottomLeftSp >= 0 ? itemBorderRadiusBottomLeftSp : itemBorderRadiusBottomLeftPc, "px");
    var wrapBgPcVal = getWrapBg(wrapBgTypePc, wrapBgColorPc, wrapBgGradientPc);
    var wrapBgSpVal = getWrapBg(wrapBgTypeSp, wrapBgColorSp, wrapBgGradientSp) || wrapBgPcVal;

    // アイテム背景（itemBgNoneがtrueの場合は透明、falseの場合は新しい設定を使用）
    var itemBgPcVal = itemBgNone ? 'transparent' : getItemBg(itemBgTypePc, itemBgColorPc, itemBgGradientPc) || itemBgColor || 'transparent';
    var itemBgSpVal = itemBgNone ? 'transparent' : getItemBg(itemBgTypeSp, itemBgColorSp, itemBgGradientSp) || itemBgPcVal;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "lw-pr-column-1",
      style: {
        "--column-1-wrap-padding-pc": wrapPaddingPcVal,
        "--column-1-wrap-padding-sp": wrapPaddingSpVal,
        "--column-1-border-color-pc": borderColorPc,
        "--column-1-border-width-pc": borderWidthPc + "px",
        "--column-1-border-style-pc": borderStylePc,
        "--column-1-border-color-sp": borderColorSp || borderColorPc,
        "--column-1-border-width-sp": borderWidthSp >= 0 ? borderWidthSp + "px" : borderWidthPc + "px",
        "--column-1-border-style-sp": borderStyleSp || borderStylePc,
        "--column-1-bdr-pc": borderRadiusPcVal,
        "--column-1-bdr-sp": borderRadiusSpVal,
        "--column-1-wrap-bg-pc": wrapBgPcVal,
        "--column-1-wrap-bg-sp": wrapBgSpVal,
        "--column-1-gtc-pc": gtcPc,
        "--column-1-gtc-sp": gtcSp,
        "--column-1-row-gap-pc": rowGapPc + "px",
        "--column-1-row-gap-sp": rowGapSp >= 0 ? rowGapSp + "px" : rowGapPc + "px",
        "--column-1-column-gap-pc": columnGapPc + "px",
        "--column-1-column-gap-sp": columnGapSp >= 0 ? columnGapSp + "px" : columnGapPc + "px",
        "--column-1-item-bg-pc": itemBgPcVal,
        "--column-1-item-bg-sp": itemBgSpVal,
        "--column-1-item-min-h-pc": itemMinHeightPc + "px",
        "--column-1-item-min-h-sp": itemMinHeightSp + "px",
        "--column-1-item-padding-pc": itemPaddingPcVal,
        "--column-1-item-padding-sp": itemPaddingSpVal,
        "--column-1-item-bdr-pc": itemBorderRadiusPcVal,
        "--column-1-item-bdr-sp": itemBorderRadiusSpVal,
        "--column-1-item-border-color-pc": itemBorderColorPc,
        "--column-1-item-border-width-pc": itemBorderWidthPc + "px",
        "--column-1-item-border-style-pc": itemBorderStylePc,
        "--column-1-item-border-color-sp": itemBorderColorSp || itemBorderColorPc,
        "--column-1-item-border-width-sp": itemBorderWidthSp >= 0 ? itemBorderWidthSp + "px" : itemBorderWidthPc + "px",
        "--column-1-item-border-style-sp": itemBorderStyleSp || itemBorderStylePc
      }
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30AB\u30E9\u30E0\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30AB\u30E9\u30E0\u6570",
      value: columnsPc,
      onChange: function onChange(v) {
        var newWidths = Array.from({
          length: v
        }, function (_, i) {
          return columnWidthsPc[i] || 1;
        });
        setAttributes({
          columnsPc: v,
          columnWidthsPc: newWidths
        });
      },
      min: 1,
      max: 20,
      step: 1
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px",
        fontSize: "12px",
        color: "#757575"
      }
    }, "\u30AB\u30E9\u30E0\u5E45 (fr)"), adjustedWidthsPc.map(function (width, index) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
        key: "pc-".concat(index),
        label: "".concat(index + 1, "\u5217\u76EE"),
        value: width,
        onChange: function onChange(v) {
          var newWidths = [].concat(adjustedWidthsPc);
          newWidths[index] = v;
          setAttributes({
            columnWidthsPc: newWidths
          });
        },
        min: 1,
        max: 20,
        step: 1
      });
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: "16px",
        marginBottom: "8px",
        fontSize: "12px",
        color: "#757575"
      }
    }, "\u9593\u9694\uFF08Gap\uFF09"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5217\u306E\u9593\u9694 (px)",
      value: columnGapPc,
      onChange: function onChange(v) {
        return setAttributes({
          columnGapPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u884C\u306E\u9593\u9694 (px)",
      value: rowGapPc,
      onChange: function onChange(v) {
        return setAttributes({
          rowGapPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30AB\u30E9\u30E0\u6570",
      value: columnsSp,
      onChange: function onChange(v) {
        return setAttributes({
          columnsSp: v
        });
      },
      min: 1,
      max: 20,
      step: 1
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px",
        fontSize: "12px",
        color: "#757575"
      }
    }, "\u30AB\u30E9\u30E0\u5E45 (fr) - \u7A7A\u3067PC\u7D99\u627F"), Array.from({
      length: columnsSp
    }, function (_, index) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
        key: "sp-".concat(index),
        label: "".concat(index + 1, "\u5217\u76EE"),
        value: columnWidthsSp[index] !== undefined ? columnWidthsSp[index] : adjustedWidthsPc[index] || 1,
        onChange: function onChange(v) {
          var newWidths = Array.from({
            length: columnsSp
          }, function (_, i) {
            if (i === index) return v;
            return columnWidthsSp[i] !== undefined ? columnWidthsSp[i] : adjustedWidthsPc[i] || 1;
          });
          setAttributes({
            columnWidthsSp: newWidths
          });
        },
        min: 1,
        max: 20,
        step: 1
      });
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: "16px",
        marginBottom: "8px",
        fontSize: "12px",
        color: "#757575"
      }
    }, "\u9593\u9694\uFF08Gap\uFF09- -1\u3067PC\u7D99\u627F"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5217\u306E\u9593\u9694 (px)",
      value: columnGapSp,
      onChange: function onChange(v) {
        return setAttributes({
          columnGapSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u884C\u306E\u9593\u9694 (px)",
      value: rowGapSp,
      onChange: function onChange(v) {
        return setAttributes({
          rowGapSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30EC\u30B9\u30DD\u30F3\u30B7\u30D6\u5207\u66FF\u5024",
      value: spBreakpoint,
      options: [{
        label: "デフォルト (700px)",
        value: ""
      }, {
        label: "600px",
        value: "600"
      }, {
        label: "500px",
        value: "500"
      }, {
        label: "400px",
        value: "400"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          spBreakpoint: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30A2\u30A4\u30C6\u30E0\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u80CC\u666F\u306A\u3057",
      checked: itemBgNone,
      onChange: function onChange(v) {
        return setAttributes({
          itemBgNone: v
        });
      }
    }), !itemBgNone && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30BF\u30A4\u30D7",
      value: itemBgTypePc,
      options: [{
        label: "単色",
        value: "solid"
      }, {
        label: "グラデーション",
        value: "gradient"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          itemBgTypePc: v
        });
      }
    }), itemBgTypePc === "solid" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: itemBgColorPc || itemBgColor,
      onChange: function onChange(color) {
        return setAttributes({
          itemBgColorPc: color || ""
        });
      },
      colors: colors
    })) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.GradientPicker, {
      value: itemBgGradientPc || undefined,
      onChange: function onChange(gradient) {
        return setAttributes({
          itemBgGradientPc: gradient || ""
        });
      },
      gradients: gradients || []
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F SP (\u7A7A\u3067PC\u7D99\u627F)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30BF\u30A4\u30D7",
      value: itemBgTypeSp,
      options: [{
        label: "単色",
        value: "solid"
      }, {
        label: "グラデーション",
        value: "gradient"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          itemBgTypeSp: v
        });
      }
    }), itemBgTypeSp === "solid" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: itemBgColorSp,
      onChange: function onChange(color) {
        return setAttributes({
          itemBgColorSp: color || ""
        });
      },
      colors: colors
    })) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.GradientPicker, {
      value: itemBgGradientSp || itemBgGradientPc || undefined,
      onChange: function onChange(gradient) {
        return setAttributes({
          itemBgGradientSp: gradient || ""
        });
      },
      gradients: gradients || []
    })), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u6700\u5C0F\u9AD8\u3055"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC (px)",
      value: itemMinHeightPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemMinHeightPc: v
        });
      },
      min: 0,
      max: 500,
      step: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (px)",
      value: itemMinHeightSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemMinHeightSp: v
        });
      },
      min: 0,
      max: 500,
      step: 10
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u4F59\u767D PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A (px)",
      value: itemPaddingTopPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingTopPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3 (px)",
      value: itemPaddingRightPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingRightPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B (px)",
      value: itemPaddingBottomPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingBottomPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6 (px)",
      value: itemPaddingLeftPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingLeftPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u4F59\u767D SP (-1\u3067PC\u7D99\u627F)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A (px)",
      value: itemPaddingTopSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingTopSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3 (px)",
      value: itemPaddingRightSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingRightSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B (px)",
      value: itemPaddingBottomSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingBottomSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6 (px)",
      value: itemPaddingLeftSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemPaddingLeftSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u89D2\u4E38 PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0A (px)",
      value: itemBorderRadiusTopLeftPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusTopLeftPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0A (px)",
      value: itemBorderRadiusTopRightPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusTopRightPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0B (px)",
      value: itemBorderRadiusBottomRightPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusBottomRightPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0B (px)",
      value: itemBorderRadiusBottomLeftPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusBottomLeftPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u89D2\u4E38 SP (-1\u3067PC\u7D99\u627F)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0A (px)",
      value: itemBorderRadiusTopLeftSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusTopLeftSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0A (px)",
      value: itemBorderRadiusTopRightSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusTopRightSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0B (px)",
      value: itemBorderRadiusBottomRightSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusBottomRightSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0B (px)",
      value: itemBorderRadiusBottomLeftSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderRadiusBottomLeftSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC PC"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: itemBorderColorPc,
      onChange: function onChange(color) {
        return setAttributes({
          itemBorderColorPc: color || "rgb(131, 131, 131)"
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px)",
      value: itemBorderWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderWidthPc: v
        });
      },
      min: 0,
      max: 10,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB",
      value: itemBorderStylePc,
      options: [{
        label: "solid",
        value: "solid"
      }, {
        label: "dashed",
        value: "dashed"
      }, {
        label: "dotted",
        value: "dotted"
      }, {
        label: "none",
        value: "none"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderStylePc: v
        });
      }
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC SP\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: itemBorderColorSp,
      onChange: function onChange(color) {
        return setAttributes({
          itemBorderColorSp: color || ""
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px) (-1\u3067PC\u7D99\u627F)",
      value: itemBorderWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderWidthSp: v
        });
      },
      min: -1,
      max: 10,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09",
      value: itemBorderStyleSp,
      options: [{
        label: "PC継承",
        value: ""
      }, {
        label: "solid",
        value: "solid"
      }, {
        label: "dashed",
        value: "dashed"
      }, {
        label: "dotted",
        value: "dotted"
      }, {
        label: "none",
        value: "none"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          itemBorderStyleSp: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30E9\u30C3\u30D7\uFF1A\u4F59\u767D",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A (px)",
      value: wrapPaddingTopPc,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingTopPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3 (px)",
      value: wrapPaddingRightPc,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingRightPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B (px)",
      value: wrapPaddingBottomPc,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingBottomPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6 (px)",
      value: wrapPaddingLeftPc,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingLeftPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP (-1\u3067PC\u7D99\u627F)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A (px)",
      value: wrapPaddingTopSp,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingTopSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3 (px)",
      value: wrapPaddingRightSp,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingRightSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B (px)",
      value: wrapPaddingBottomSp,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingBottomSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6 (px)",
      value: wrapPaddingLeftSp,
      onChange: function onChange(v) {
        return setAttributes({
          wrapPaddingLeftSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30E9\u30C3\u30D7\uFF1A\u30DC\u30FC\u30C0\u30FC",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: borderColorPc,
      onChange: function onChange(color) {
        return setAttributes({
          borderColorPc: color || "rgb(131, 131, 131)"
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px)",
      value: borderWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          borderWidthPc: v
        });
      },
      min: 0,
      max: 10,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB",
      value: borderStylePc,
      options: [{
        label: "solid",
        value: "solid"
      }, {
        label: "dashed",
        value: "dashed"
      }, {
        label: "dotted",
        value: "dotted"
      }, {
        label: "none",
        value: "none"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          borderStylePc: v
        });
      }
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: borderColorSp,
      onChange: function onChange(color) {
        return setAttributes({
          borderColorSp: color || ""
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px) (-1\u3067PC\u7D99\u627F)",
      value: borderWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          borderWidthSp: v
        });
      },
      min: -1,
      max: 10,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09",
      value: borderStyleSp,
      options: [{
        label: "PC継承",
        value: ""
      }, {
        label: "solid",
        value: "solid"
      }, {
        label: "dashed",
        value: "dashed"
      }, {
        label: "dotted",
        value: "dotted"
      }, {
        label: "none",
        value: "none"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          borderStyleSp: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30E9\u30C3\u30D7\uFF1A\u89D2\u4E38",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0A (px)",
      value: borderRadiusTopLeftPc,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusTopLeftPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0A (px)",
      value: borderRadiusTopRightPc,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusTopRightPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0B (px)",
      value: borderRadiusBottomRightPc,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusBottomRightPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0B (px)",
      value: borderRadiusBottomLeftPc,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusBottomLeftPc: v
        });
      },
      min: 0,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP (-1\u3067PC\u7D99\u627F)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0A (px)",
      value: borderRadiusTopLeftSp,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusTopLeftSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0A (px)",
      value: borderRadiusTopRightSp,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusTopRightSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u4E0B (px)",
      value: borderRadiusBottomRightSp,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusBottomRightSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u4E0B (px)",
      value: borderRadiusBottomLeftSp,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusBottomLeftSp: v
        });
      },
      min: -1,
      max: 64,
      step: 1
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30E9\u30C3\u30D7\uFF1A\u80CC\u666F",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30BF\u30A4\u30D7",
      value: wrapBgTypePc,
      options: [{
        label: "単色",
        value: "solid"
      }, {
        label: "グラデーション",
        value: "gradient"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          wrapBgTypePc: v
        });
      }
    }), wrapBgTypePc === "solid" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: wrapBgColorPc,
      onChange: function onChange(color) {
        return setAttributes({
          wrapBgColorPc: color || ""
        });
      },
      colors: colors
    })) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.GradientPicker, {
      value: wrapBgGradientPc || undefined,
      onChange: function onChange(gradient) {
        return setAttributes({
          wrapBgGradientPc: gradient || ""
        });
      },
      gradients: gradients || []
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP (\u7A7A\u3067PC\u7D99\u627F)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30BF\u30A4\u30D7",
      value: wrapBgTypeSp,
      options: [{
        label: "単色",
        value: "solid"
      }, {
        label: "グラデーション",
        value: "gradient"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          wrapBgTypeSp: v
        });
      }
    }), wrapBgTypeSp === "solid" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: wrapBgColorSp,
      onChange: function onChange(color) {
        return setAttributes({
          wrapBgColorSp: color || ""
        });
      },
      colors: colors
    })) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.GradientPicker, {
      value: wrapBgGradientSp || wrapBgGradientPc || undefined,
      onChange: function onChange(gradient) {
        return setAttributes({
          wrapBgGradientSp: gradient || ""
        });
      },
      gradients: gradients || []
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "custom_wrap"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender
    }))));
  },
  save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var wrapPaddingTopPc = attributes.wrapPaddingTopPc,
      wrapPaddingRightPc = attributes.wrapPaddingRightPc,
      wrapPaddingBottomPc = attributes.wrapPaddingBottomPc,
      wrapPaddingLeftPc = attributes.wrapPaddingLeftPc,
      wrapPaddingTopSp = attributes.wrapPaddingTopSp,
      wrapPaddingRightSp = attributes.wrapPaddingRightSp,
      wrapPaddingBottomSp = attributes.wrapPaddingBottomSp,
      wrapPaddingLeftSp = attributes.wrapPaddingLeftSp,
      borderColorPc = attributes.borderColorPc,
      borderWidthPc = attributes.borderWidthPc,
      borderStylePc = attributes.borderStylePc,
      borderColorSp = attributes.borderColorSp,
      borderWidthSp = attributes.borderWidthSp,
      borderStyleSp = attributes.borderStyleSp,
      borderRadiusTopLeftPc = attributes.borderRadiusTopLeftPc,
      borderRadiusTopRightPc = attributes.borderRadiusTopRightPc,
      borderRadiusBottomRightPc = attributes.borderRadiusBottomRightPc,
      borderRadiusBottomLeftPc = attributes.borderRadiusBottomLeftPc,
      borderRadiusTopLeftSp = attributes.borderRadiusTopLeftSp,
      borderRadiusTopRightSp = attributes.borderRadiusTopRightSp,
      borderRadiusBottomRightSp = attributes.borderRadiusBottomRightSp,
      borderRadiusBottomLeftSp = attributes.borderRadiusBottomLeftSp,
      wrapBgTypePc = attributes.wrapBgTypePc,
      wrapBgColorPc = attributes.wrapBgColorPc,
      wrapBgGradientPc = attributes.wrapBgGradientPc,
      wrapBgTypeSp = attributes.wrapBgTypeSp,
      wrapBgColorSp = attributes.wrapBgColorSp,
      wrapBgGradientSp = attributes.wrapBgGradientSp,
      columnsPc = attributes.columnsPc,
      columnWidthsPc = attributes.columnWidthsPc,
      columnsSp = attributes.columnsSp,
      columnWidthsSp = attributes.columnWidthsSp,
      rowGapPc = attributes.rowGapPc,
      rowGapSp = attributes.rowGapSp,
      columnGapPc = attributes.columnGapPc,
      columnGapSp = attributes.columnGapSp,
      itemBgNone = attributes.itemBgNone,
      itemBgColor = attributes.itemBgColor,
      itemBgTypePc = attributes.itemBgTypePc,
      itemBgColorPc = attributes.itemBgColorPc,
      itemBgGradientPc = attributes.itemBgGradientPc,
      itemBgTypeSp = attributes.itemBgTypeSp,
      itemBgColorSp = attributes.itemBgColorSp,
      itemBgGradientSp = attributes.itemBgGradientSp,
      itemMinHeightPc = attributes.itemMinHeightPc,
      itemMinHeightSp = attributes.itemMinHeightSp,
      itemPaddingTopPc = attributes.itemPaddingTopPc,
      itemPaddingRightPc = attributes.itemPaddingRightPc,
      itemPaddingBottomPc = attributes.itemPaddingBottomPc,
      itemPaddingLeftPc = attributes.itemPaddingLeftPc,
      itemPaddingTopSp = attributes.itemPaddingTopSp,
      itemPaddingRightSp = attributes.itemPaddingRightSp,
      itemPaddingBottomSp = attributes.itemPaddingBottomSp,
      itemPaddingLeftSp = attributes.itemPaddingLeftSp,
      itemBorderRadiusTopLeftPc = attributes.itemBorderRadiusTopLeftPc,
      itemBorderRadiusTopRightPc = attributes.itemBorderRadiusTopRightPc,
      itemBorderRadiusBottomRightPc = attributes.itemBorderRadiusBottomRightPc,
      itemBorderRadiusBottomLeftPc = attributes.itemBorderRadiusBottomLeftPc,
      itemBorderRadiusTopLeftSp = attributes.itemBorderRadiusTopLeftSp,
      itemBorderRadiusTopRightSp = attributes.itemBorderRadiusTopRightSp,
      itemBorderRadiusBottomRightSp = attributes.itemBorderRadiusBottomRightSp,
      itemBorderRadiusBottomLeftSp = attributes.itemBorderRadiusBottomLeftSp,
      itemBorderColorPc = attributes.itemBorderColorPc,
      itemBorderWidthPc = attributes.itemBorderWidthPc,
      itemBorderStylePc = attributes.itemBorderStylePc,
      itemBorderColorSp = attributes.itemBorderColorSp,
      itemBorderWidthSp = attributes.itemBorderWidthSp,
      itemBorderStyleSp = attributes.itemBorderStyleSp,
      spBreakpoint = attributes.spBreakpoint;

    // カラム幅配列をカラム数に合わせて調整
    var adjustedWidthsPc = Array.from({
      length: columnsPc
    }, function (_, i) {
      return columnWidthsPc[i] || 1;
    });
    var adjustedWidthsSp = Array.from({
      length: columnsSp
    }, function (_, i) {
      if (columnWidthsSp.length > 0 && columnWidthsSp[i] !== undefined) {
        return columnWidthsSp[i];
      }
      return adjustedWidthsPc[i] || 1;
    });
    var gtcPc = adjustedWidthsPc.map(function (w) {
      return "".concat(w, "fr");
    }).join(' ');
    var gtcSp = columnWidthsSp.length > 0 ? adjustedWidthsSp.map(function (w) {
      return "".concat(w, "fr");
    }).join(' ') : Array.from({
      length: columnsSp
    }, function (_, i) {
      return "".concat(adjustedWidthsPc[i] || 1, "fr");
    }).join(' ');
    var wrapPaddingPcVal = "".concat(wrapPaddingTopPc, "px ").concat(wrapPaddingRightPc, "px ").concat(wrapPaddingBottomPc, "px ").concat(wrapPaddingLeftPc, "px");
    var wrapPaddingSpVal = "".concat(wrapPaddingTopSp >= 0 ? wrapPaddingTopSp : wrapPaddingTopPc, "px ").concat(wrapPaddingRightSp >= 0 ? wrapPaddingRightSp : wrapPaddingRightPc, "px ").concat(wrapPaddingBottomSp >= 0 ? wrapPaddingBottomSp : wrapPaddingBottomPc, "px ").concat(wrapPaddingLeftSp >= 0 ? wrapPaddingLeftSp : wrapPaddingLeftPc, "px");
    var itemPaddingPcVal = "".concat(itemPaddingTopPc, "px ").concat(itemPaddingRightPc, "px ").concat(itemPaddingBottomPc, "px ").concat(itemPaddingLeftPc, "px");
    var itemPaddingSpVal = "".concat(itemPaddingTopSp >= 0 ? itemPaddingTopSp : itemPaddingTopPc, "px ").concat(itemPaddingRightSp >= 0 ? itemPaddingRightSp : itemPaddingRightPc, "px ").concat(itemPaddingBottomSp >= 0 ? itemPaddingBottomSp : itemPaddingBottomPc, "px ").concat(itemPaddingLeftSp >= 0 ? itemPaddingLeftSp : itemPaddingLeftPc, "px");
    var borderRadiusPcVal = "".concat(borderRadiusTopLeftPc, "px ").concat(borderRadiusTopRightPc, "px ").concat(borderRadiusBottomRightPc, "px ").concat(borderRadiusBottomLeftPc, "px");
    var borderRadiusSpVal = "".concat(borderRadiusTopLeftSp >= 0 ? borderRadiusTopLeftSp : borderRadiusTopLeftPc, "px ").concat(borderRadiusTopRightSp >= 0 ? borderRadiusTopRightSp : borderRadiusTopRightPc, "px ").concat(borderRadiusBottomRightSp >= 0 ? borderRadiusBottomRightSp : borderRadiusBottomRightPc, "px ").concat(borderRadiusBottomLeftSp >= 0 ? borderRadiusBottomLeftSp : borderRadiusBottomLeftPc, "px");
    var itemBorderRadiusPcVal = "".concat(itemBorderRadiusTopLeftPc, "px ").concat(itemBorderRadiusTopRightPc, "px ").concat(itemBorderRadiusBottomRightPc, "px ").concat(itemBorderRadiusBottomLeftPc, "px");
    var itemBorderRadiusSpVal = "".concat(itemBorderRadiusTopLeftSp >= 0 ? itemBorderRadiusTopLeftSp : itemBorderRadiusTopLeftPc, "px ").concat(itemBorderRadiusTopRightSp >= 0 ? itemBorderRadiusTopRightSp : itemBorderRadiusTopRightPc, "px ").concat(itemBorderRadiusBottomRightSp >= 0 ? itemBorderRadiusBottomRightSp : itemBorderRadiusBottomRightPc, "px ").concat(itemBorderRadiusBottomLeftSp >= 0 ? itemBorderRadiusBottomLeftSp : itemBorderRadiusBottomLeftPc, "px");
    var getWrapBg = function getWrapBg(type, color, gradient) {
      if (type === 'gradient' && gradient) return gradient;
      if (color) return color;
      return '';
    };
    var wrapBgPcVal = getWrapBg(wrapBgTypePc, wrapBgColorPc, wrapBgGradientPc);
    var wrapBgSpVal = getWrapBg(wrapBgTypeSp, wrapBgColorSp, wrapBgGradientSp) || wrapBgPcVal;
    var getItemBg = function getItemBg(type, color, gradient) {
      if (type === 'gradient' && gradient) return gradient;
      if (color) return color;
      return '';
    };
    // アイテム背景（itemBgNoneがtrueの場合は透明、falseの場合は新しい設定を使用）
    var itemBgPcVal = itemBgNone ? 'transparent' : getItemBg(itemBgTypePc, itemBgColorPc, itemBgGradientPc) || itemBgColor || 'transparent';
    var itemBgSpVal = itemBgNone ? 'transparent' : getItemBg(itemBgTypeSp, itemBgColorSp, itemBgGradientSp) || itemBgPcVal;

    // ブレークポイントクラス
    var bpClass = spBreakpoint ? "lw-bp-".concat(spBreakpoint) : '';
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "lw-pr-column-1".concat(bpClass ? " ".concat(bpClass) : ''),
      style: {
        "--column-1-wrap-padding-pc": wrapPaddingPcVal,
        "--column-1-wrap-padding-sp": wrapPaddingSpVal,
        "--column-1-border-color-pc": borderColorPc,
        "--column-1-border-width-pc": borderWidthPc + "px",
        "--column-1-border-style-pc": borderStylePc,
        "--column-1-border-color-sp": borderColorSp || borderColorPc,
        "--column-1-border-width-sp": borderWidthSp >= 0 ? borderWidthSp + "px" : borderWidthPc + "px",
        "--column-1-border-style-sp": borderStyleSp || borderStylePc,
        "--column-1-bdr-pc": borderRadiusPcVal,
        "--column-1-bdr-sp": borderRadiusSpVal,
        "--column-1-wrap-bg-pc": wrapBgPcVal,
        "--column-1-wrap-bg-sp": wrapBgSpVal,
        "--column-1-gtc-pc": gtcPc,
        "--column-1-gtc-sp": gtcSp,
        "--column-1-row-gap-pc": rowGapPc + "px",
        "--column-1-row-gap-sp": rowGapSp >= 0 ? rowGapSp + "px" : rowGapPc + "px",
        "--column-1-column-gap-pc": columnGapPc + "px",
        "--column-1-column-gap-sp": columnGapSp >= 0 ? columnGapSp + "px" : columnGapPc + "px",
        "--column-1-item-bg-pc": itemBgPcVal,
        "--column-1-item-bg-sp": itemBgSpVal,
        "--column-1-item-min-h-pc": itemMinHeightPc + "px",
        "--column-1-item-min-h-sp": itemMinHeightSp + "px",
        "--column-1-item-padding-pc": itemPaddingPcVal,
        "--column-1-item-padding-sp": itemPaddingSpVal,
        "--column-1-item-bdr-pc": itemBorderRadiusPcVal,
        "--column-1-item-bdr-sp": itemBorderRadiusSpVal,
        "--column-1-item-border-color-pc": itemBorderColorPc,
        "--column-1-item-border-width-pc": itemBorderWidthPc + "px",
        "--column-1-item-border-style-pc": itemBorderStylePc,
        "--column-1-item-border-color-sp": itemBorderColorSp || itemBorderColorPc,
        "--column-1-item-border-width-sp": itemBorderWidthSp >= 0 ? itemBorderWidthSp + "px" : itemBorderWidthPc + "px",
        "--column-1-item-border-style-sp": itemBorderStyleSp || itemBorderStylePc
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "custom_wrap"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)));
  }
});
/******/ })()
;