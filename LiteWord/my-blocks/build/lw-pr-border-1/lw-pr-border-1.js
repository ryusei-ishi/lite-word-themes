/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-pr-border-1/index.js":
/*!*************************************!*\
  !*** ./src/lw-pr-border-1/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-border-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-pr-border-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-border-1/block.json");







// 配置 → margin-left / margin-right の変換
var alignToMargins = function alignToMargins(align) {
  switch (align) {
    case "left":
      return {
        ml: "0",
        mr: "auto"
      };
    case "right":
      return {
        ml: "auto",
        mr: "0"
      };
    default:
      // center
      return {
        ml: "auto",
        mr: "auto"
      };
  }
};

// CSS変数を生成
var buildCssVars = function buildCssVars(attributes) {
  var mtPc = attributes.mtPc,
    mbPc = attributes.mbPc,
    mtSp = attributes.mtSp,
    mbSp = attributes.mbSp,
    maxWidthUnitPc = attributes.maxWidthUnitPc,
    maxWidthPc = attributes.maxWidthPc,
    maxWidthUnitSp = attributes.maxWidthUnitSp,
    maxWidthSp = attributes.maxWidthSp,
    borderWidthPc = attributes.borderWidthPc,
    borderWidthSp = attributes.borderWidthSp,
    borderStylePc = attributes.borderStylePc,
    borderStyleSp = attributes.borderStyleSp,
    borderColorPc = attributes.borderColorPc,
    borderColorSp = attributes.borderColorSp,
    alignPc = attributes.alignPc,
    alignSp = attributes.alignSp;
  var pcMargins = alignToMargins(alignPc);
  var effectiveAlignSp = alignSp || alignPc;
  var spMargins = alignToMargins(effectiveAlignSp);
  var effectiveMaxWidthUnitSp = maxWidthUnitSp || maxWidthUnitPc;
  var effectiveMaxWidthSp = maxWidthSp === -1 ? maxWidthPc : maxWidthSp;
  var effectiveMtSp = mtSp === -1 ? mtPc : mtSp;
  var effectiveMbSp = mbSp === -1 ? mbPc : mbSp;
  var effectiveBorderWidthSp = borderWidthSp === -1 ? borderWidthPc : borderWidthSp;
  var effectiveBorderStyleSp = borderStyleSp || borderStylePc;
  var effectiveBorderColorSp = borderColorSp || borderColorPc;
  return {
    "--border-1-mt-pc": "".concat(mtPc, "px"),
    "--border-1-mb-pc": "".concat(mbPc, "px"),
    "--border-1-ml-pc": pcMargins.ml,
    "--border-1-mr-pc": pcMargins.mr,
    "--border-1-max-width-pc": "".concat(maxWidthPc).concat(maxWidthUnitPc),
    "--border-1-width-pc": "".concat(borderWidthPc, "px"),
    "--border-1-style-pc": borderStylePc,
    "--border-1-color-pc": borderColorPc,
    "--border-1-mt-sp": "".concat(effectiveMtSp, "px"),
    "--border-1-mb-sp": "".concat(effectiveMbSp, "px"),
    "--border-1-ml-sp": spMargins.ml,
    "--border-1-mr-sp": spMargins.mr,
    "--border-1-max-width-sp": "".concat(effectiveMaxWidthSp).concat(effectiveMaxWidthUnitSp),
    "--border-1-width-sp": "".concat(effectiveBorderWidthSp, "px"),
    "--border-1-style-sp": effectiveBorderStyleSp,
    "--border-1-color-sp": effectiveBorderColorSp
  };
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var mtPc = attributes.mtPc,
      mbPc = attributes.mbPc,
      mtSp = attributes.mtSp,
      mbSp = attributes.mbSp,
      maxWidthUnitPc = attributes.maxWidthUnitPc,
      maxWidthPc = attributes.maxWidthPc,
      maxWidthUnitSp = attributes.maxWidthUnitSp,
      maxWidthSp = attributes.maxWidthSp,
      borderWidthPc = attributes.borderWidthPc,
      borderWidthSp = attributes.borderWidthSp,
      borderStylePc = attributes.borderStylePc,
      borderStyleSp = attributes.borderStyleSp,
      borderColorPc = attributes.borderColorPc,
      borderColorSp = attributes.borderColorSp,
      alignPc = attributes.alignPc,
      alignSp = attributes.alignSp;
    var cssVars = buildCssVars(attributes);
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "lw-pr-border-1",
      style: cssVars
    });
    var styleOptions = [{
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
    }];
    var alignOptions = [{
      label: "中央",
      value: "center"
    }, {
      label: "左寄せ",
      value: "left"
    }, {
      label: "右寄せ",
      value: "right"
    }];
    var unitOptions = [{
      label: "%",
      value: "%"
    }, {
      label: "px",
      value: "px"
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "PC\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mtPc,
      onChange: function onChange(v) {
        return setAttributes({
          mtPc: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mbPc,
      onChange: function onChange(v) {
        return setAttributes({
          mbPc: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u5E45\u306E\u5358\u4F4D",
      value: maxWidthUnitPc,
      options: unitOptions,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthUnitPc: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5E45",
      value: maxWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthPc: v
        });
      },
      min: 1,
      max: maxWidthUnitPc === "%" ? 100 : 1200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px)",
      value: borderWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          borderWidthPc: v
        });
      },
      min: 0,
      max: 20
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB",
      value: borderStylePc,
      options: styleOptions,
      onChange: function onChange(v) {
        return setAttributes({
          borderStylePc: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u8272",
      value: borderColorPc,
      onChange: function onChange(v) {
        return setAttributes({
          borderColorPc: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u914D\u7F6E",
      value: alignPc,
      options: alignOptions,
      onChange: function onChange(v) {
        return setAttributes({
          alignPc: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "SP\u8A2D\u5B9A\uFF08\u7A7A\u6B04\u30FB-1\u3067PC\u7D99\u627F\uFF09",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mtSp,
      onChange: function onChange(v) {
        return setAttributes({
          mtSp: v
        });
      },
      min: -1,
      max: 200,
      help: "-1\u3067PC\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mbSp,
      onChange: function onChange(v) {
        return setAttributes({
          mbSp: v
        });
      },
      min: -1,
      max: 200,
      help: "-1\u3067PC\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u5E45\u306E\u5358\u4F4D",
      value: maxWidthUnitSp,
      options: [{
        label: "PCを継承",
        value: ""
      }].concat(unitOptions),
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthUnitSp: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5E45",
      value: maxWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthSp: v
        });
      },
      min: -1,
      max: maxWidthUnitSp === "px" ? 600 : 100,
      help: "-1\u3067PC\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px)",
      value: borderWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          borderWidthSp: v
        });
      },
      min: -1,
      max: 20,
      help: "-1\u3067PC\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB",
      value: borderStyleSp,
      options: [{
        label: "PCを継承",
        value: ""
      }].concat(styleOptions),
      onChange: function onChange(v) {
        return setAttributes({
          borderStyleSp: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u8272",
      value: borderColorSp,
      onChange: function onChange(v) {
        return setAttributes({
          borderColorSp: v
        });
      },
      help: "\u7A7A\u6B04\u3067PC\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u914D\u7F6E",
      value: alignSp,
      options: [{
        label: "PCを継承",
        value: ""
      }].concat(alignOptions),
      onChange: function onChange(v) {
        return setAttributes({
          alignSp: v
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps));
  },
  save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var cssVars = buildCssVars(attributes);
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "lw-pr-border-1",
      style: cssVars
    });
    return /*#__PURE__*/React.createElement("div", blockProps);
  }
});

/***/ }),

/***/ "./src/lw-pr-border-1/editor.scss":
/*!****************************************!*\
  !*** ./src/lw-pr-border-1/editor.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-pr-border-1/style.scss":
/*!***************************************!*\
  !*** ./src/lw-pr-border-1/style.scss ***!
  \***************************************/
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

/***/ "./src/lw-pr-border-1/block.json":
/*!***************************************!*\
  !*** ./src/lw-pr-border-1/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-border-1","version":"1.0.0","title":"Border 01","category":"lw-utility","icon":"minus","description":"装飾用ボーダー（線）ブロック。幅・スタイル・色・配置をPC/SPで個別設定可能。","aiDescription":"装飾用の水平線ブロック。ボーダーの太さ、スタイル、色、最大幅、配置（左寄せ・中央・右寄せ）をPC/SPで個別に設定可能。","aiNotes":"CSS変数でスタイルを制御。SPの値が未設定の場合はPCの値を継承。配置はmargin-left/rightのauto/0の組み合わせで実現。","aiHint":{"description":"装飾ボーダー線。セクション区切りの装飾。テキスト属性なし","excludeFromAutoSelect":true,"contentAttributes":[],"imageAttributes":[],"excludeReason":"装飾線のみ。テキスト生成不要"},"supports":{"anchor":true,"className":true},"attributes":{"mtPc":{"type":"number","default":0,"ai_description":"上マージンPC（px）"},"mbPc":{"type":"number","default":0,"ai_description":"下マージンPC（px）"},"mtSp":{"type":"number","default":-1,"ai_description":"上マージンSP（px）。-1でPCを継承"},"mbSp":{"type":"number","default":-1,"ai_description":"下マージンSP（px）。-1でPCを継承"},"maxWidthUnitPc":{"type":"string","default":"%","ai_description":"幅の単位PC。%またはpx"},"maxWidthPc":{"type":"number","default":100,"ai_description":"幅PC。単位はmaxWidthUnitPcに依存"},"maxWidthUnitSp":{"type":"string","default":"","ai_description":"幅の単位SP。空でPCを継承。%またはpx"},"maxWidthSp":{"type":"number","default":-1,"ai_description":"幅SP。-1でPCを継承。単位はmaxWidthUnitSpに依存"},"borderWidthPc":{"type":"number","default":1,"ai_description":"ボーダー幅PC（px）"},"borderWidthSp":{"type":"number","default":-1,"ai_description":"ボーダー幅SP（px）。-1でPCを継承"},"borderStylePc":{"type":"string","default":"solid","ai_description":"ボーダースタイルPC。solid/dashed/dotted/none"},"borderStyleSp":{"type":"string","default":"","ai_description":"ボーダースタイルSP。空でPCを継承"},"borderColorPc":{"type":"string","default":"var(--color-main)","ai_description":"ボーダー色PC"},"borderColorSp":{"type":"string","default":"","ai_description":"ボーダー色SP。空でPCを継承"},"alignPc":{"type":"string","default":"center","ai_description":"配置PC。center（中央）/left（左寄せ）/right（右寄せ）"},"alignSp":{"type":"string","default":"","ai_description":"配置SP。空でPCを継承。center/left/right"}},"editorScript":"file:./lw-pr-border-1.js","no":1}');

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
/******/ 			"lw-pr-border-1": 0,
/******/ 			"./style-lw-pr-border-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-border-1"], () => (__webpack_require__("./src/lw-pr-border-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;