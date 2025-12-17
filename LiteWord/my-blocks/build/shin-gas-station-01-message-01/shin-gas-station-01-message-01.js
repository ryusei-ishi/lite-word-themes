/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shin-gas-station-01-message-01/index.js":
/*!*****************************************************!*\
  !*** ./src/shin-gas-station-01-message-01/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/shin-gas-station-01-message-01/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/shin-gas-station-01-message-01/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/shin-gas-station-01-message-01/block.json");






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  title: 'メッセージ 1 shin shop pattern 01',
  icon: 'admin-comments',
  category: 'lw-content',
  supports: {
    anchor: true
  },
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      bodyText = attributes.bodyText,
      imgUrl = attributes.imgUrl,
      imgAlt = attributes.imgAlt,
      captionSub = attributes.captionSub,
      captionMain = attributes.captionMain,
      colorMain = attributes.colorMain;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'shin-gas-station-01-message-01'
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          imgUrl: media.url
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, imgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
          src: imgUrl,
          alt: imgAlt,
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
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u753B\u50CF\u306E\u4EE3\u66FF\u30C6\u30AD\u30B9\u30C8",
      value: imgAlt,
      onChange: function onChange(value) {
        return setAttributes({
          imgAlt: value
        });
      },
      placeholder: "\u753B\u50CF\u306E\u8AAC\u660E\u3092\u5165\u529B"
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30AB\u30E9\u30FC\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement("p", null, "\u30EA\u30FC\u30C9\u30C6\u30AD\u30B9\u30C8\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: colorMain,
      onChange: function onChange(newColor) {
        return setAttributes({
          colorMain: newColor
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-message-01__wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text__in"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "title"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "div",
      className: "main",
      "data-lw_font_set": "Montserrat",
      value: mainTitle,
      onChange: function onChange(value) {
        return setAttributes({
          mainTitle: value
        });
      },
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "div",
      className: "sub",
      value: subTitle,
      onChange: function onChange(value) {
        return setAttributes({
          subTitle: value
        });
      },
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B",
      style: {
        color: colorMain
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "description",
      value: bodyText,
      onChange: function onChange(value) {
        return setAttributes({
          bodyText: value
        });
      },
      placeholder: "\u672C\u6587\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement("figcaption", {
      className: "img_caption"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: captionSub,
      onChange: function onChange(value) {
        return setAttributes({
          captionSub: value
        });
      },
      placeholder: "\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3\u306E\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: captionMain,
      onChange: function onChange(value) {
        return setAttributes({
          captionMain: value
        });
      },
      placeholder: "\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3\u306E\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "image"
    }, /*#__PURE__*/React.createElement("figure", {
      className: "img"
    }, /*#__PURE__*/React.createElement("img", {
      loading: "lazy",
      src: imgUrl,
      alt: imgAlt
    }))))));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      bodyText = attributes.bodyText,
      imgUrl = attributes.imgUrl,
      imgAlt = attributes.imgAlt,
      captionSub = attributes.captionSub,
      captionMain = attributes.captionMain,
      colorMain = attributes.colorMain;
    return /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-message-01"
    }, /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-message-01__wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text__in"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "title"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "div",
      className: "main",
      "data-lw_font_set": "Montserrat",
      value: mainTitle
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "div",
      className: "sub",
      value: subTitle,
      style: {
        color: colorMain
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "description",
      value: bodyText.replace(/\n/g, '<br />')
    }), /*#__PURE__*/React.createElement("figcaption", {
      className: "img_caption"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: captionSub
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: captionMain
    }))), /*#__PURE__*/React.createElement("div", {
      className: "image"
    }, /*#__PURE__*/React.createElement("figure", {
      className: "img"
    }, /*#__PURE__*/React.createElement("img", {
      loading: "lazy",
      src: imgUrl,
      alt: imgAlt
    })))));
  }
});

/***/ }),

/***/ "./src/shin-gas-station-01-message-01/editor.scss":
/*!********************************************************!*\
  !*** ./src/shin-gas-station-01-message-01/editor.scss ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/shin-gas-station-01-message-01/style.scss":
/*!*******************************************************!*\
  !*** ./src/shin-gas-station-01-message-01/style.scss ***!
  \*******************************************************/
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

/***/ "./src/shin-gas-station-01-message-01/block.json":
/*!*******************************************************!*\
  !*** ./src/shin-gas-station-01-message-01/block.json ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/shin-gas-station-01-message-01","version":"1.0.0","title":"メッセージ 1 shin shop pattern 01","category":"lw-content","icon":"admin-comments","editorScript":"file:./shin-gas-station-01-message-01.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","supports":{"anchor":true},"no":15,"attributes":{"subTitle":{"type":"string","default":"代表挨拶"},"mainTitle":{"type":"string","default":"Message"},"bodyText":{"type":"string","default":"私たちは「Drive freely, live comfortably.（自由に走り、快適に暮らす）」を掲げ、地域に根ざしたサービスを提供し、お客様のカーライフをより豊かにすることを目指してまいりました。エネルギー事業では、高品質な燃料と細やかな接客で安全・快適な走行を支え、リース事業では多様なニーズに応える柔軟なプランで移動の自由を広げています。さらに、地域イベントの協賛や公共インフラ整備への協力を通じて、地域社会の活性化にも尽力しています。私たちは、地域社会や環境への配慮を欠かさず、常に新しい挑戦を続けながら、持続可能な未来の実現に向けて歩んでまいります。これからもお客様と地域の笑顔のために、心を込めたサービスを提供し続けます。"},"imgUrl":{"type":"string","default":"https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=400&h=400&auto=format&fit=crop&q=80"},"imgAlt":{"type":"string","default":"代表の写真"},"captionSub":{"type":"string","default":"代表取締役"},"captionMain":{"type":"string","default":"山田太郎"},"colorMain":{"type":"string","default":"var(--color-main)"}}}');

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
/******/ 			"shin-gas-station-01-message-01": 0,
/******/ 			"./style-shin-gas-station-01-message-01": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-shin-gas-station-01-message-01"], () => (__webpack_require__("./src/shin-gas-station-01-message-01/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;