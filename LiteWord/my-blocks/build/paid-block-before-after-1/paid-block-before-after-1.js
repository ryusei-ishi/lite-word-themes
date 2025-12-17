/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-before-after-1/index.js":
/*!************************************************!*\
  !*** ./src/paid-block-before-after-1/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-before-after-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-before-after-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-before-after-1/block.json");






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var beforeImageUrl = attributes.beforeImageUrl,
      beforeImageAlt = attributes.beforeImageAlt,
      beforeText = attributes.beforeText,
      afterImageUrl = attributes.afterImageUrl,
      afterImageAlt = attributes.afterImageAlt,
      afterText = attributes.afterText,
      beforeTextBgColor = attributes.beforeTextBgColor,
      afterTextBgColor = attributes.afterTextBgColor,
      arrowBgColor = attributes.arrowBgColor,
      maxWidth = attributes.maxWidth,
      aspectRatioHeight = attributes.aspectRatioHeight,
      hasImageShadow = attributes.hasImageShadow;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'paid-block-before-after-1'
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=SFx8Eq_GJFo",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089"))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "Before\u753B\u50CF\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          beforeImageUrl: media.url
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, beforeImageUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
          src: beforeImageUrl,
          alt: beforeImageAlt,
          style: {
            maxWidth: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary",
          style: {
            marginTop: '10px'
          }
        }, "\u753B\u50CF\u3092\u5909\u66F4")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, "\u753B\u50CF\u3092\u9078\u629E"));
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "Before\u753B\u50CF\u306E\u4EE3\u66FF\u30C6\u30AD\u30B9\u30C8",
      value: beforeImageAlt,
      onChange: function onChange(value) {
        return setAttributes({
          beforeImageAlt: value
        });
      },
      placeholder: "\u753B\u50CF\u306E\u8AAC\u660E\u3092\u5165\u529B",
      style: {
        marginTop: '10px'
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '16px'
      }
    }, "Before\u30C6\u30AD\u30B9\u30C8\u306E\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: beforeTextBgColor,
      onChange: function onChange(newColor) {
        return setAttributes({
          beforeTextBgColor: newColor
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "After\u753B\u50CF\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          afterImageUrl: media.url
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, afterImageUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
          src: afterImageUrl,
          alt: afterImageAlt,
          style: {
            maxWidth: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary",
          style: {
            marginTop: '10px'
          }
        }, "\u753B\u50CF\u3092\u5909\u66F4")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, "\u753B\u50CF\u3092\u9078\u629E"));
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "After\u753B\u50CF\u306E\u4EE3\u66FF\u30C6\u30AD\u30B9\u30C8",
      value: afterImageAlt,
      onChange: function onChange(value) {
        return setAttributes({
          afterImageAlt: value
        });
      },
      placeholder: "\u753B\u50CF\u306E\u8AAC\u660E\u3092\u5165\u529B",
      style: {
        marginTop: '10px'
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '16px'
      }
    }, "After\u30C6\u30AD\u30B9\u30C8\u306E\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: afterTextBgColor,
      onChange: function onChange(newColor) {
        return setAttributes({
          afterTextBgColor: newColor
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u305D\u306E\u4ED6\u306E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("p", null, "\u77E2\u5370\u90E8\u5206\u306E\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: arrowBgColor,
      onChange: function onChange(newColor) {
        return setAttributes({
          arrowBgColor: newColor
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45\uFF08.this_wrap\uFF09",
      value: maxWidth,
      onChange: function onChange(value) {
        return setAttributes({
          maxWidth: value
        });
      },
      min: 300,
      max: 1600,
      step: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u753B\u50CF\u30A2\u30B9\u30DA\u30AF\u30C8\u6BD4\u8A2D\u5B9A",
      value: aspectRatioHeight,
      onChange: function onChange(value) {
        return setAttributes({
          aspectRatioHeight: value
        });
      },
      min: 100,
      max: 1200,
      step: 10,
      help: "aspect-ratio: 800 / \u25CB\u25CB \u306E \u25CB\u25CB\u90E8\u5206\u3092\u5909\u66F4\u3057\u307E\u3059\u3002"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u753B\u50CF\u306B\u5F71\u3092\u3064\u3051\u308B",
      checked: hasImageShadow,
      onChange: function onChange(value) {
        return setAttributes({
          hasImageShadow: value
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "this_wrap",
      style: {
        maxWidth: maxWidth + 'px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "image ".concat(hasImageShadow ? 'has-shadow' : ''),
      style: {
        aspectRatio: "800 / ".concat(aspectRatioHeight)
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: beforeImageUrl,
      alt: beforeImageAlt
    }), /*#__PURE__*/React.createElement("div", {
      className: "text",
      style: {
        backgroundColor: beforeTextBgColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: beforeText,
      onChange: function onChange(value) {
        return setAttributes({
          beforeText: value
        });
      },
      placeholder: "Before",
      "data-lw_font_set": "Montserrat"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "arrow-right",
      style: {
        borderLeft: "20px solid ".concat(arrowBgColor)
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "image ".concat(hasImageShadow ? 'has-shadow' : ''),
      style: {
        aspectRatio: "800 / ".concat(aspectRatioHeight)
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: afterImageUrl,
      alt: afterImageAlt
    }), /*#__PURE__*/React.createElement("div", {
      className: "text",
      style: {
        backgroundColor: afterTextBgColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: afterText,
      onChange: function onChange(value) {
        return setAttributes({
          afterText: value
        });
      },
      placeholder: "After",
      "data-lw_font_set": "Montserrat"
    }))))));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var beforeImageUrl = attributes.beforeImageUrl,
      beforeImageAlt = attributes.beforeImageAlt,
      beforeText = attributes.beforeText,
      afterImageUrl = attributes.afterImageUrl,
      afterImageAlt = attributes.afterImageAlt,
      afterText = attributes.afterText,
      beforeTextBgColor = attributes.beforeTextBgColor,
      afterTextBgColor = attributes.afterTextBgColor,
      arrowBgColor = attributes.arrowBgColor,
      maxWidth = attributes.maxWidth,
      aspectRatioHeight = attributes.aspectRatioHeight,
      hasImageShadow = attributes.hasImageShadow;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'paid-block-before-after-1'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "this_wrap",
      style: {
        maxWidth: maxWidth + 'px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "image ".concat(hasImageShadow ? 'has-shadow' : ''),
      style: {
        aspectRatio: "800 / ".concat(aspectRatioHeight)
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: beforeImageUrl,
      alt: beforeImageAlt
    }), /*#__PURE__*/React.createElement("div", {
      className: "text",
      style: {
        backgroundColor: beforeTextBgColor
      },
      "data-lw_font_set": "Montserrat"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: beforeText
    }))), /*#__PURE__*/React.createElement("div", {
      className: "arrow-right",
      style: {
        borderLeft: "20px solid ".concat(arrowBgColor)
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "image ".concat(hasImageShadow ? 'has-shadow' : ''),
      style: {
        aspectRatio: "800 / ".concat(aspectRatioHeight)
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: afterImageUrl,
      alt: afterImageAlt
    }), /*#__PURE__*/React.createElement("div", {
      className: "text",
      style: {
        backgroundColor: afterTextBgColor
      },
      "data-lw_font_set": "Montserrat"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: afterText
    })))));
  }
});

/***/ }),

/***/ "./src/paid-block-before-after-1/editor.scss":
/*!***************************************************!*\
  !*** ./src/paid-block-before-after-1/editor.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-before-after-1/style.scss":
/*!**************************************************!*\
  !*** ./src/paid-block-before-after-1/style.scss ***!
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

/***/ "./src/paid-block-before-after-1/block.json":
/*!**************************************************!*\
  !*** ./src/paid-block-before-after-1/block.json ***!
  \**************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-before-after-1","version":"1.0.0","title":"ビフォーアフター 01","category":"lw-voice","icon":"format-image","editorScript":"file:./paid-block-before-after-1.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","supports":{"anchor":true},"attributes":{"beforeImageUrl":{"type":"string","default":"https://lite-word.com/sample_img/before_after/1_1.webp"},"beforeImageAlt":{"type":"string","default":""},"beforeText":{"type":"string","default":"Before"},"afterImageUrl":{"type":"string","default":"https://lite-word.com/sample_img/before_after/1_2.webp"},"afterImageAlt":{"type":"string","default":""},"afterText":{"type":"string","default":"After"},"beforeTextBgColor":{"type":"string","default":"#e64343"},"afterTextBgColor":{"type":"string","default":"#e64343"},"arrowBgColor":{"type":"string","default":"#e64343"},"maxWidth":{"type":"number","default":800},"aspectRatioHeight":{"type":"number","default":800},"hasImageShadow":{"type":"boolean","default":false}},"no":1}');

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
/******/ 			"paid-block-before-after-1": 0,
/******/ 			"./style-paid-block-before-after-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-before-after-1"], () => (__webpack_require__("./src/paid-block-before-after-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;