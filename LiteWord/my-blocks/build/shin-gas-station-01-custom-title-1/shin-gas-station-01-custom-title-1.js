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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./src/shin-gas-station-01-custom-title-1/block.json":
/*!***********************************************************!*\
  !*** ./src/shin-gas-station-01-custom-title-1/block.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/shin-gas-station-01-custom-title-1","version":"1.0.0","title":"見出しタイトル 1 shin shop pattern 01","category":"lw-heading","icon":"editor-textcolor","description":"下線カスタマイズ対応見出しブロック","supports":{"anchor":true},"attributes":{"mainTitle":{"type":"string","default":"タイトル"},"headingLevel":{"type":"number","default":2},"underlineHeight":{"type":"number","default":1},"underlineColor":{"type":"string","default":"#C6C6C6"},"uniqueId":{"type":"string","default":""}},"editorScript":"file:./shin-gas-station-01-custom-title-1.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":15}');

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
/*!*********************************************************!*\
  !*** ./src/shin-gas-station-01-custom-title-1/index.js ***!
  \*********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/shin-gas-station-01-custom-title-1/block.json");
/**
 * 見出しタイトル 1 ─ shin shop pattern 01
 * -----------------------------------------------------------
 * 追加機能
 *   1. 下線（::after）の太さ(height) と 色(background) を
 *      サイドバーから変更
 *   2. 変更内容は <style> タグをブロック内にインライン出力
 *   3. 既存機能（見出しレベル切替・タイトル編集）はそのまま
 * ★ apiVersion 3 対応（2025-12-07）
 */






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /* --------------------------------------------------
   * 編集画面
   * -------------------------------------------------- */
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes,
      clientId = props.clientId;
    var mainTitle = attributes.mainTitle,
      headingLevel = attributes.headingLevel,
      underlineHeight = attributes.underlineHeight,
      underlineColor = attributes.underlineColor,
      uniqueId = attributes.uniqueId;

    /* 初回のみユニーク ID を保存 */
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!uniqueId) {
        setAttributes({
          uniqueId: clientId.slice(0, 8)
        });
      }
    }, []);

    /* 共通：タイトル・レベル変更 */
    var onChangeMainTitle = function onChangeMainTitle(v) {
      return setAttributes({
        mainTitle: v
      });
    };
    var onChangeHeadingLevel = function onChangeHeadingLevel(l) {
      return setAttributes({
        headingLevel: l
      });
    };

    /* 下線：高さ & 色 */
    var onChangeHeight = function onChangeHeight(h) {
      return setAttributes({
        underlineHeight: h
      });
    };
    var onChangeColor = function onChangeColor(c) {
      return setAttributes({
        underlineColor: c
      });
    };

    /* 動的タグ名とユニーククラス */
    var TagName = "h".concat(headingLevel);
    var uniqueClass = "title-".concat(uniqueId || clientId.slice(0, 8));

    /* インライン style */
    var inlineStyle = "\n          .".concat(uniqueClass, " .main::after{\n              height:").concat(underlineHeight, "px;\n              background:").concat(underlineColor, ";\n          }\n        ");
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "shin-gas-station-01-custom-title-1 ".concat(uniqueClass)
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, null, [2, 3, 4, 5].map(function (level) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: level,
        isPressed: headingLevel === level,
        onClick: function onClick() {
          return onChangeHeadingLevel(level);
        }
      }, "H".concat(level));
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4E0B\u7DDA\u306E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u7DDA\u306E\u592A\u3055(px)",
      value: underlineHeight,
      onChange: onChangeHeight,
      min: 0,
      max: 10,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      label: "\u7DDA\u306E\u8272",
      value: underlineColor,
      onChange: onChangeColor
    }))), /*#__PURE__*/React.createElement(TagName, blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      "data-lw_font_set": "Montserrat",
      value: mainTitle,
      onChange: onChangeMainTitle,
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement("style", null, inlineStyle)));
  },
  /* --------------------------------------------------
   * 保存
   * -------------------------------------------------- */
  save: function save(_ref) {
    var attributes = _ref.attributes;
    var mainTitle = attributes.mainTitle,
      headingLevel = attributes.headingLevel,
      underlineHeight = attributes.underlineHeight,
      underlineColor = attributes.underlineColor,
      uniqueId = attributes.uniqueId;
    var TagName = "h".concat(headingLevel);
    var uniqueClass = "title-".concat(uniqueId);
    var inlineStyle = "\n          .".concat(uniqueClass, " .main::after{\n              height:").concat(underlineHeight, "px;\n              background:").concat(underlineColor, ";\n          }\n        ");
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "shin-gas-station-01-custom-title-1 ".concat(uniqueClass)
    });
    return /*#__PURE__*/React.createElement(TagName, blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      "data-lw_font_set": "Montserrat",
      value: mainTitle
    }), /*#__PURE__*/React.createElement("style", null, inlineStyle));
  }
});
/******/ })()
;