/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-contact-3/index.js":
/*!***********************************!*\
  !*** ./src/lw-contact-3/index.js ***!
  \***********************************/
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/lw-contact-3/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-contact-3/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/lw-contact-3/block.json");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* ============================================================
 * LiteWord – お問い合わせフォーム 03（フォームのみ・カラー調整拡張）
 * ----------------------------------------------------------------
 *  • Block Name : wdl/lw-contact-3
 *  • Features   :
 *      - Inspector でフォーム ID・max‑width(px) を設定
 *      - ラベル文字色、入力欄背景／文字色
 *      - 送信ボタン背景／文字色
 *      - <必須>・<任意> ラベルの背景／文字色
 *      - インスタンス固有クラス（uniqueClass）を自動生成し、
 *        <style> タグでインライン CSS を出力（多重設置可）
 * =========================================================== */





/* 汎用スタイル（フォームの基本デザイン）は別途読み込む想定 */



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  /* ========== 編集画面 ========== */edit: function edit(_ref) {
    var clientId = _ref.clientId,
      attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var formId = attributes.formId,
      maxWidth = attributes.maxWidth,
      labelColor = attributes.labelColor,
      inputBgColor = attributes.inputBgColor,
      inputTextColor = attributes.inputTextColor,
      buttonBgColor = attributes.buttonBgColor,
      buttonTextColor = attributes.buttonTextColor,
      requiredBgColor = attributes.requiredBgColor,
      requiredTextColor = attributes.requiredTextColor,
      optionalBgColor = attributes.optionalBgColor,
      optionalTextColor = attributes.optionalTextColor,
      uniqueClass = attributes.uniqueClass;

    /* --- 初回のみユニーククラス生成 --- */
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!uniqueClass) {
        setAttributes({
          uniqueClass: "lw-contact-3-".concat(clientId.slice(0, 8))
        });
      }
    }, []);
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "lw-contact-3 ".concat(uniqueClass || ''),
      style: {
        maxWidth: "".concat(maxWidth, "px")
      }
    });

    /* --- Inspector --- */
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30D5\u30A9\u30FC\u30E0\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30D5\u30A9\u30FC\u30E0ID",
      value: formId,
      options: _toConsumableArray(Array(40)).map(function (_, i) {
        return {
          label: "LiteWord\u5C02\u7528 \u304A\u554F\u5408\u308F\u305B\u30D5\u30A9\u30FC\u30E0\u30D1\u30BF\u30FC\u30F3 ".concat(i + 1),
          value: i + 1
        };
      }),
      onChange: function onChange(value) {
        return setAttributes({
          formId: parseInt(value, 10)
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45\uFF08px\uFF09",
      min: 320,
      max: 1920,
      step: 20,
      allowReset: true,
      value: maxWidth,
      onChange: function onChange(value) {
        return setAttributes({
          maxWidth: value || 1080
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u30E9\u30D9\u30EB\u6587\u5B57\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: labelColor,
      onChange: function onChange(c) {
        return setAttributes({
          labelColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u5165\u529B\u6B04\u80CC\u666F\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: inputBgColor,
      onChange: function onChange(c) {
        return setAttributes({
          inputBgColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u5165\u529B\u6B04\u6587\u5B57\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: inputTextColor,
      onChange: function onChange(c) {
        return setAttributes({
          inputTextColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1.5em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u9001\u4FE1\u30DC\u30BF\u30F3\u80CC\u666F\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: buttonBgColor,
      onChange: function onChange(c) {
        return setAttributes({
          buttonBgColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u9001\u4FE1\u30DC\u30BF\u30F3\u6587\u5B57\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: buttonTextColor,
      onChange: function onChange(c) {
        return setAttributes({
          buttonTextColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1.5em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u5FC5\u9808\u30E9\u30D9\u30EB\u80CC\u666F\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: requiredBgColor,
      onChange: function onChange(c) {
        return setAttributes({
          requiredBgColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u5FC5\u9808\u30E9\u30D9\u30EB\u6587\u5B57\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: requiredTextColor,
      onChange: function onChange(c) {
        return setAttributes({
          requiredTextColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1.5em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u4EFB\u610F\u30E9\u30D9\u30EB\u80CC\u666F\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: optionalBgColor,
      onChange: function onChange(c) {
        return setAttributes({
          optionalBgColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u4EFB\u610F\u30E9\u30D9\u30EB\u6587\u5B57\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: optionalTextColor,
      onChange: function onChange(c) {
        return setAttributes({
          optionalTextColor: c
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.RawHTML, null, "[lw_mail_form_select id='".concat(formId, "']")), /*#__PURE__*/React.createElement("style", null, "\n                        .".concat(uniqueClass, " .lw_mail_form .label_in label { color: ").concat(labelColor, "; }\n                        .").concat(uniqueClass, " .lw_mail_form input[type=\"text\"],\n                        .").concat(uniqueClass, " .lw_mail_form input[type=\"email\"],\n                        .").concat(uniqueClass, " .lw_mail_form input[type=\"tel\"],\n                        .").concat(uniqueClass, " .lw_mail_form input[type=\"url\"],\n                        .").concat(uniqueClass, " .lw_mail_form input[type=\"password\"],\n                        .").concat(uniqueClass, " .lw_mail_form textarea,\n                        .").concat(uniqueClass, " .lw_mail_form select {\n                            background-color: ").concat(inputBgColor, ";\n                            color: ").concat(inputTextColor, ";\n                        }\n                        .").concat(uniqueClass, " .lw_mail_form select option { color: ").concat(inputTextColor, "; }\n                        .").concat(uniqueClass, " .lw_mail_form input[type=\"radio\"] + label,\n                        .").concat(uniqueClass, " .lw_mail_form input[type=\"checkbox\"] + label {\n                            color: ").concat(inputTextColor, ";\n                        }\n                        .").concat(uniqueClass, " .lw_mail_form .submit_wrap button {\n                            background-color: ").concat(buttonBgColor, ";\n                            color: ").concat(buttonTextColor, ";\n                        }\n                        .").concat(uniqueClass, " .lw_mail_form .required:not(.is-optional) {\n                            background-color: ").concat(requiredBgColor, ";\n                            color: ").concat(requiredTextColor, ";\n                        }\n                        .").concat(uniqueClass, " .lw_mail_form .required.is-optional {\n                            background-color: ").concat(optionalBgColor, ";\n                            color: ").concat(optionalTextColor, ";\n                        }\n                    "))));
  },
  /* ========== フロント出力 ========== */save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var formId = attributes.formId,
      maxWidth = attributes.maxWidth,
      labelColor = attributes.labelColor,
      inputBgColor = attributes.inputBgColor,
      inputTextColor = attributes.inputTextColor,
      buttonBgColor = attributes.buttonBgColor,
      buttonTextColor = attributes.buttonTextColor,
      requiredBgColor = attributes.requiredBgColor,
      requiredTextColor = attributes.requiredTextColor,
      optionalBgColor = attributes.optionalBgColor,
      optionalTextColor = attributes.optionalTextColor,
      uniqueClass = attributes.uniqueClass;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "lw-contact-3 ".concat(uniqueClass),
      style: {
        maxWidth: "".concat(maxWidth, "px")
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.RawHTML, null, "[lw_mail_form_select id='".concat(formId, "']")), /*#__PURE__*/React.createElement("style", null, "\n                    .".concat(uniqueClass, " .lw_mail_form .label_in label,.supplement_text { color: ").concat(labelColor, "; }\n                    .").concat(uniqueClass, " .lw_mail_form input[type=\"text\"],\n                    .").concat(uniqueClass, " .lw_mail_form input[type=\"email\"],\n                    .").concat(uniqueClass, " .lw_mail_form input[type=\"tel\"],\n                    .").concat(uniqueClass, " .lw_mail_form input[type=\"url\"],\n                    .").concat(uniqueClass, " .lw_mail_form input[type=\"password\"],\n                    .").concat(uniqueClass, " .lw_mail_form textarea,\n                    .").concat(uniqueClass, " .lw_mail_form select {\n                        background-color: ").concat(inputBgColor, ";\n                        color: ").concat(inputTextColor, ";\n                    }\n                    .").concat(uniqueClass, " .lw_mail_form select option { color: ").concat(inputTextColor, "; }\n                    .").concat(uniqueClass, " .lw_mail_form .checkbox_in label,\n                    .").concat(uniqueClass, " .lw_mail_form .radio_in label {\n                        color: ").concat(labelColor, ";\n                    }\n                    .").concat(uniqueClass, " .lw_mail_form .submit_wrap button {\n                        background-color: ").concat(buttonBgColor, ";\n                        color: ").concat(buttonTextColor, ";\n                    }\n                    .").concat(uniqueClass, " .lw_mail_form .required:not(.is-optional) {\n                        background-color: ").concat(requiredBgColor, " !important;\n                        color: ").concat(requiredTextColor, " !important;\n                    }\n                    .").concat(uniqueClass, " .lw_mail_form .required.is-optional {\n                        background-color: ").concat(optionalBgColor, " !important;\n                        color: ").concat(optionalTextColor, " !important;\n                    }\n                ")));
  }
});

/***/ }),

/***/ "./src/lw-contact-3/editor.scss":
/*!**************************************!*\
  !*** ./src/lw-contact-3/editor.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-contact-3/style.scss":
/*!*************************************!*\
  !*** ./src/lw-contact-3/style.scss ***!
  \*************************************/
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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./src/lw-contact-3/block.json":
/*!*************************************!*\
  !*** ./src/lw-contact-3/block.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-contact-3","version":"1.0.0","title":"お問合わせフォーム 03（ワンカラム・シンプル）","category":"lw-contact","icon":"email","supports":{"anchor":true},"attributes":{"formId":{"type":"number","default":1},"maxWidth":{"type":"number","default":1080},"labelColor":{"type":"string","default":"#000000"},"inputBgColor":{"type":"string","default":"#f6f6f6"},"inputTextColor":{"type":"string","default":"#000000"},"buttonBgColor":{"type":"string","default":"#007cba"},"buttonTextColor":{"type":"string","default":"#ffffff"},"requiredBgColor":{"type":"string","default":"#da3838"},"requiredTextColor":{"type":"string","default":"#ffffff"},"optionalBgColor":{"type":"string","default":"#dddddd"},"optionalTextColor":{"type":"string","default":"#000000"},"uniqueClass":{"type":"string","default":""}},"editorScript":"file:./lw-contact-3.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":3}');

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
/******/ 			"lw-contact-3": 0,
/******/ 			"./style-lw-contact-3": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-contact-3"], () => (__webpack_require__("./src/lw-contact-3/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;