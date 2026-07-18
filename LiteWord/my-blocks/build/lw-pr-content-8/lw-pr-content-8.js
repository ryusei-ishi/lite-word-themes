/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-pr-content-8/index.js":
/*!**************************************!*\
  !*** ./src/lw-pr-content-8/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-content-8/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-pr-content-8/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-content-8/block.json");






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var imageUrl = attributes.imageUrl,
      imageAlt = attributes.imageAlt,
      maxWidth = attributes.maxWidth,
      bgColor = attributes.bgColor,
      bdrPc = attributes.bdrPc,
      bdrSp = attributes.bdrSp,
      minHeight = attributes.minHeight,
      borderWidth = attributes.borderWidth,
      borderColor = attributes.borderColor;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'lw-pr-content-8',
      style: {
        '--content-8-max-w': "".concat(maxWidth, "px"),
        '--content-8-bdr-pc': "".concat(bdrPc, "px"),
        '--content-8-bdr-sp': "".concat(bdrSp, "px"),
        '--content-8-min-h': "".concat(minHeight, "px"),
        background: bgColor,
        border: borderWidth ? "".concat(borderWidth, "px solid ").concat(borderColor) : undefined
      }
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          imageUrl: media.url,
          imageAlt: media.alt
        });
      },
      allowedTypes: ['image'],
      value: imageUrl,
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            marginBottom: '16px'
          }
        }, imageUrl && /*#__PURE__*/React.createElement("img", {
          src: imageUrl,
          alt: imageAlt,
          style: {
            maxWidth: '100%',
            height: 'auto',
            marginBottom: '10px'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, imageUrl ? '画像を変更' : '画像を選択'), imageUrl && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: function onClick() {
            return setAttributes({
              imageUrl: '',
              imageAlt: ''
            });
          },
          style: {
            marginLeft: '10px'
          }
        }, "\u524A\u9664"));
      }
    }), imageUrl && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u4EE3\u66FF\u30C6\u30AD\u30B9\u30C8",
      value: imageAlt,
      onChange: function onChange(v) {
        return setAttributes({
          imageAlt: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 (px)",
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 600,
      max: 1600,
      step: 8
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 PC (px)",
      value: bdrPc,
      onChange: function onChange(v) {
        return setAttributes({
          bdrPc: v
        });
      },
      min: 0,
      max: 50,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 SP (px)",
      value: bdrSp,
      onChange: function onChange(v) {
        return setAttributes({
          bdrSp: v
        });
      },
      min: 0,
      max: 50,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5C0F\u306E\u9AD8\u3055 (px)",
      value: minHeight,
      onChange: function onChange(v) {
        return setAttributes({
          minHeight: v
        });
      },
      min: 200,
      max: 600,
      step: 1
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u67A0\u7DDA\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u67A0\u306E\u592A\u3055 (px)",
      value: borderWidth,
      onChange: function onChange(v) {
        return setAttributes({
          borderWidth: v
        });
      },
      min: 0,
      max: 10,
      step: 1
    }), borderWidth > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: '8px'
      }
    }, "\u67A0\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: borderColor,
      onChange: function onChange(color) {
        return setAttributes({
          borderColor: color || 'var(--color-main)'
        });
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u80CC\u666F\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: bgColor,
      onChange: function onChange(color) {
        return setAttributes({
          bgColor: color || '#f5f5f5'
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "image"
    }, imageUrl ? /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
      alt: imageAlt
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#ddd',
        padding: '40px',
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, "\u753B\u50CF\u3092\u9078\u629E")), /*#__PURE__*/React.createElement("div", {
      className: "content_in"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, null))));
  },
  save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var imageUrl = attributes.imageUrl,
      imageAlt = attributes.imageAlt,
      maxWidth = attributes.maxWidth,
      bgColor = attributes.bgColor,
      bdrPc = attributes.bdrPc,
      bdrSp = attributes.bdrSp,
      minHeight = attributes.minHeight,
      borderWidth = attributes.borderWidth,
      borderColor = attributes.borderColor;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'lw-pr-content-8',
      style: {
        '--content-8-max-w': "".concat(maxWidth, "px"),
        '--content-8-bdr-pc': "".concat(bdrPc, "px"),
        '--content-8-bdr-sp': "".concat(bdrSp, "px"),
        '--content-8-min-h': "".concat(minHeight, "px"),
        background: bgColor,
        border: borderWidth ? "".concat(borderWidth, "px solid ").concat(borderColor) : undefined
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "image"
    }, imageUrl && /*#__PURE__*/React.createElement("img", {
      loading: "lazy",
      src: imageUrl,
      alt: imageAlt
    })), /*#__PURE__*/React.createElement("div", {
      className: "content_in"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)));
  }
});

/***/ }),

/***/ "./src/lw-pr-content-8/editor.scss":
/*!*****************************************!*\
  !*** ./src/lw-pr-content-8/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-pr-content-8/style.scss":
/*!****************************************!*\
  !*** ./src/lw-pr-content-8/style.scss ***!
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

/***/ "./src/lw-pr-content-8/block.json":
/*!****************************************!*\
  !*** ./src/lw-pr-content-8/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-content-8","version":"1.0.0","title":"Content 08","category":"lw-content","icon":"align-pull-left","description":"画像+コンテンツエリアブロック","aiDescription":"左側に画像、右側にコンテンツエリアを配置した2カラムレイアウト。コンテンツエリアには任意のブロックを配置可能。","aiNotes":"InnerBlocksでコンテンツエリアを自由に編集可能。背景色、最大幅、角丸をカスタマイズ可能。","aiHint":{"description":"画像+InnerBlocksの2カラム。左に画像、右に自由コンテンツエリア。InnerBlocks使用のためAI直接生成非推奨","excludeFromAutoSelect":true,"excludeReason":"InnerBlocksを使用するためAIが直接コンテンツを生成できない","contentAttributes":[],"imageAttributes":["imageUrl"]},"supports":{"anchor":true},"attributes":{"imageUrl":{"type":"string","default":"https://placehold.co/400x400","ai_description":"左側の画像URL"},"imageAlt":{"type":"string","default":"","ai_description":"画像のalt属性"},"maxWidth":{"type":"number","default":1040,"ai_description":"最大幅（px）"},"bgColor":{"type":"string","default":"#f5f5f5","ai_description":"背景色"},"bdrPc":{"type":"number","default":10,"ai_description":"角丸PC（px）"},"bdrSp":{"type":"number","default":10,"ai_description":"角丸SP（px）"},"minHeight":{"type":"number","default":378,"ai_description":"最小の高さ（px）"},"borderWidth":{"type":"number","default":2,"ai_description":"枠線の太さ（px）"},"borderColor":{"type":"string","default":"var(--color-main)","ai_description":"枠線の色"}},"editorScript":"file:./lw-pr-content-8.js","no":8}');

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
/******/ 			"lw-pr-content-8": 0,
/******/ 			"./style-lw-pr-content-8": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-content-8"], () => (__webpack_require__("./src/lw-pr-content-8/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;