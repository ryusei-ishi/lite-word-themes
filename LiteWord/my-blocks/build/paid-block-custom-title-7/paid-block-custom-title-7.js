/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-custom-title-7/index.js":
/*!************************************************!*\
  !*** ./src/paid-block-custom-title-7/index.js ***!
  \************************************************/
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-custom-title-7/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-custom-title-7/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-custom-title-7/block.json");







(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  /* ---------------------------------------------------------- */
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      headingLevel = attributes.headingLevel,
      mainTitleColor = attributes.mainTitleColor,
      borderLeftColor = attributes.borderLeftColor,
      borderRightColor = attributes.borderRightColor,
      borderLeftOpacity = attributes.borderLeftOpacity,
      borderRightOpacity = attributes.borderRightOpacity,
      borderRadius = attributes.borderRadius,
      sizeClass = attributes.sizeClass,
      positionClass = attributes.positionClass;
    var Tag = "h".concat(headingLevel);
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "paid-block-custom-title-7 ".concat(sizeClass, " ").concat(positionClass)
    });

    /* mainTitleColor 更新時に未カスタムの border 色を同期 */
    var prevMain = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(mainTitleColor);
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (borderLeftColor === prevMain.current) {
        setAttributes({
          borderLeftColor: mainTitleColor
        });
      }
      if (borderRightColor === prevMain.current) {
        setAttributes({
          borderRightColor: mainTitleColor
        });
      }
      prevMain.current = mainTitleColor;
    }, [mainTitleColor]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, null, [2, 3, 4, 5].map(function (lvl) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: lvl,
        isPressed: headingLevel === lvl,
        onClick: function onClick() {
          return setAttributes({
            headingLevel: lvl
          });
        }
      }, "H".concat(lvl));
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B5\u30A4\u30BA\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
      label: "\u30B5\u30A4\u30BA",
      selected: sizeClass,
      options: [{
        label: '大 (L)',
        value: 'size_l'
      }, {
        label: '中 (M)',
        value: 'size_m'
      }, {
        label: '小 (S)',
        value: 'size_s'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          sizeClass: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4F4D\u7F6E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
      label: "\u914D\u7F6E",
      selected: positionClass,
      options: [{
        label: '左寄せ',
        value: 'position_left'
      }, {
        label: '中央',
        value: 'position_center'
      }, {
        label: '右寄せ',
        value: 'position_right'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          positionClass: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30AB\u30E9\u30FC\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("p", null, "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: mainTitleColor,
      onChange: function onChange(c) {
        return setAttributes({
          mainTitleColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      className: "components-base-control__label"
    }, "\u5DE6\u30DC\u30FC\u30C0\u30FC\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: borderLeftColor,
      onChange: function onChange(c) {
        return setAttributes({
          borderLeftColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      className: "components-base-control__label"
    }, "\u53F3\u30DC\u30FC\u30C0\u30FC\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: borderRightColor,
      onChange: function onChange(c) {
        return setAttributes({
          borderRightColor: c
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30C7\u30B6\u30A4\u30F3\u8A73\u7D30",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u30DC\u30FC\u30C0\u30FC\u900F\u660E\u5EA6\uFF08%\uFF09",
      min: 0,
      max: 100,
      step: 0.1,
      value: borderLeftOpacity,
      onChange: function onChange(v) {
        return setAttributes({
          borderLeftOpacity: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u30DC\u30FC\u30C0\u30FC\u900F\u660E\u5EA6\uFF08%\uFF09",
      min: 0,
      max: 100,
      step: 0.1,
      value: borderRightOpacity,
      onChange: function onChange(v) {
        return setAttributes({
          borderRightOpacity: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u89D2\u4E38\uFF08px\uFF09",
      min: 0,
      max: 100,
      step: 1,
      value: borderRadius,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadius: v
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(Tag, {
      className: "ttl"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      onChange: function onChange(v) {
        return setAttributes({
          subTitle: v
        });
      },
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B",
      style: {
        color: mainTitleColor
      }
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: mainTitle,
      onChange: function onChange(v) {
        return setAttributes({
          mainTitle: v
        });
      },
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement("span", {
      className: "border_wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "border_inner",
      style: {
        borderRadius: "".concat(borderRadius, "px")
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "border left",
      style: {
        backgroundColor: borderLeftColor,
        opacity: borderLeftOpacity / 100
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "border right",
      style: {
        backgroundColor: borderRightColor,
        opacity: borderRightOpacity / 100
      }
    }))))));
  },
  /* ---------------------------------------------------------- */
  save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      headingLevel = attributes.headingLevel,
      mainTitleColor = attributes.mainTitleColor,
      borderLeftColor = attributes.borderLeftColor,
      borderRightColor = attributes.borderRightColor,
      borderLeftOpacity = attributes.borderLeftOpacity,
      borderRightOpacity = attributes.borderRightOpacity,
      borderRadius = attributes.borderRadius,
      sizeClass = attributes.sizeClass,
      positionClass = attributes.positionClass;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "paid-block-custom-title-7 ".concat(sizeClass, " ").concat(positionClass)
    });
    var Tag = "h".concat(headingLevel);
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(Tag, {
      className: "ttl"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      style: {
        color: mainTitleColor
      }
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: mainTitle
    }), /*#__PURE__*/React.createElement("span", {
      className: "border_wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "border_inner",
      style: {
        borderRadius: "".concat(borderRadius, "px")
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "border left",
      style: {
        backgroundColor: borderLeftColor,
        opacity: borderLeftOpacity / 100
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "border right",
      style: {
        backgroundColor: borderRightColor,
        opacity: borderRightOpacity / 100
      }
    })))));
  }
});

/***/ }),

/***/ "./src/paid-block-custom-title-7/editor.scss":
/*!***************************************************!*\
  !*** ./src/paid-block-custom-title-7/editor.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-custom-title-7/style.scss":
/*!**************************************************!*\
  !*** ./src/paid-block-custom-title-7/style.scss ***!
  \**************************************************/
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

/***/ "./src/paid-block-custom-title-7/block.json":
/*!**************************************************!*\
  !*** ./src/paid-block-custom-title-7/block.json ***!
  \**************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-custom-title-7","version":"1.0.0","title":"見出しタイトル 07","category":"lw-heading","icon":"editor-textcolor","description":"カスタムボーダー付き見出しブロック","supports":{"anchor":true},"attributes":{"subTitle":{"type":"string","default":"製品紹介"},"mainTitle":{"type":"string","default":"PRODUCTS"},"headingLevel":{"type":"number","default":2},"mainTitleColor":{"type":"string","default":"var(--color-main)"},"borderLeftColor":{"type":"string","default":"var(--color-main)"},"borderRightColor":{"type":"string","default":"var(--color-main)"},"borderLeftOpacity":{"type":"number","default":20},"borderRightOpacity":{"type":"number","default":100},"borderRadius":{"type":"number","default":10},"sizeClass":{"type":"string","default":"size_m"},"positionClass":{"type":"string","default":"position_center"}},"editorScript":"file:./paid-block-custom-title-7.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":7}');

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
/******/ 			"paid-block-custom-title-7": 0,
/******/ 			"./style-paid-block-custom-title-7": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-custom-title-7"], () => (__webpack_require__("./src/paid-block-custom-title-7/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;