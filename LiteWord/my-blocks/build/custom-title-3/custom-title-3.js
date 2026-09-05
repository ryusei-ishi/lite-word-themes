/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/custom-title-3/index.js":
/*!*************************************!*\
  !*** ./src/custom-title-3/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/custom-title-3/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/custom-title-3/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/custom-title-3/block.json");






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      textAlignment = attributes.textAlignment,
      accentColor = attributes.accentColor,
      headingLevel = attributes.headingLevel,
      mainFontSizePc = attributes.mainFontSizePc,
      mainFontSizeSp = attributes.mainFontSizeSp;
    var onChangeMainTitle = function onChangeMainTitle(value) {
      setAttributes({
        mainTitle: value
      });
    };
    var onChangeSubTitle = function onChangeSubTitle(value) {
      setAttributes({
        subTitle: value
      });
    };
    var onChangeTextAlignment = function onChangeTextAlignment(newAlignment) {
      setAttributes({
        textAlignment: newAlignment
      });
    };
    var onChangeAccentColor = function onChangeAccentColor(newColor) {
      setAttributes({
        accentColor: newColor
      });
    };
    var onChangeHeadingLevel = function onChangeHeadingLevel(newLevel) {
      setAttributes({
        headingLevel: newLevel
      });
    };
    var alignmentClass = textAlignment === 'right' ? 'right' : textAlignment === 'center' ? 'center' : 'left';
    var TagName = "h".concat(headingLevel);

    /* 🚨 0 のときは style を1つも出さない（既定のままなら出力が変わらないようにするため） */
    var sizeStyle = {};
    if (mainFontSizePc) {
      sizeStyle['--ct3-main-pc'] = mainFontSizePc + 'px';
    }
    if (mainFontSizeSp) {
      sizeStyle['--ct3-main-sp'] = mainFontSizeSp + 'px';
    }
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(Object.assign({
      className: "custom-title-3 ".concat(alignmentClass)
    }, Object.keys(sizeStyle).length ? {
      style: sizeStyle
    } : {}));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, null, [1, 2, 3, 4, 5].map(function (level) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: level,
        isPressed: headingLevel === level,
        onClick: function onClick() {
          return onChangeHeadingLevel(level);
        }
      }, "H".concat(level));
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u914D\u7F6E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
      selected: textAlignment,
      options: [{
        label: '右',
        value: 'right'
      }, {
        label: '中央',
        value: 'center'
      }, {
        label: '左',
        value: 'left'
      }],
      onChange: onChangeTextAlignment
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: accentColor,
      onChange: onChangeAccentColor
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u6587\u5B57\u30B5\u30A4\u30BA",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\uFF08PC\uFF09",
      help: "0 \u306E\u307E\u307E\u306A\u3089\u65E2\u5B9A\u306E 60px\u3002\u65E5\u672C\u8A9E\u3067\u9577\u3044\u898B\u51FA\u3057\u306E\u3068\u304D\u306F\u5C0F\u3055\u304F\u3057\u307E\u3059",
      value: mainFontSizePc,
      onChange: function onChange(v) {
        return setAttributes({
          mainFontSizePc: v === undefined ? 0 : v
        });
      },
      min: 0,
      max: 96,
      allowReset: true
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\uFF08\u30B9\u30DE\u30DB\uFF09",
      help: "0 \u306E\u307E\u307E\u306A\u3089\u65E2\u5B9A\u306E 48px\u3002375px \u3067\u306F 5\u6587\u5B57\u3067\u753B\u9762\u3044\u3063\u3071\u3044\u306B\u306A\u308B\u306E\u3067\u3001\u65E5\u672C\u8A9E\u306A\u3089 28\u301C32px \u3092\u76EE\u5B89\u306B",
      value: mainFontSizeSp,
      onChange: function onChange(v) {
        return setAttributes({
          mainFontSizeSp: v === undefined ? 0 : v
        });
      },
      min: 0,
      max: 72,
      allowReset: true
    }))), /*#__PURE__*/React.createElement(TagName, blockProps, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: mainTitle,
      onChange: onChangeMainTitle,
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    })), /*#__PURE__*/React.createElement("div", {
      className: "accent",
      style: {
        backgroundColor: accentColor
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: subTitle,
      onChange: onChangeSubTitle,
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }))));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      textAlignment = attributes.textAlignment,
      accentColor = attributes.accentColor,
      headingLevel = attributes.headingLevel,
      mainFontSizePc = attributes.mainFontSizePc,
      mainFontSizeSp = attributes.mainFontSizeSp;
    var alignmentClass = textAlignment === 'right' ? 'right' : textAlignment === 'center' ? 'center' : 'left';
    var TagName = "h".concat(headingLevel);

    /* 🚨🚨 **0（既定）のときは style 属性を1つも書き出さない。**
       こうしておけば、いま貼られているページのマークアップと1文字も変わらないので
       deprecated を書かなくてよい（block-change-safety.md の型）。 */
    var sizeStyle = {};
    if (mainFontSizePc) {
      sizeStyle['--ct3-main-pc'] = mainFontSizePc + 'px';
    }
    if (mainFontSizeSp) {
      sizeStyle['--ct3-main-sp'] = mainFontSizeSp + 'px';
    }
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save(Object.assign({
      className: "custom-title-3 ".concat(alignmentClass)
    }, Object.keys(sizeStyle).length ? {
      style: sizeStyle
    } : {}));
    return /*#__PURE__*/React.createElement(TagName, blockProps, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: mainTitle
    })), /*#__PURE__*/React.createElement("div", {
      className: "accent",
      style: {
        backgroundColor: accentColor
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: subTitle
    })));
  }
});

/***/ }),

/***/ "./src/custom-title-3/editor.scss":
/*!****************************************!*\
  !*** ./src/custom-title-3/editor.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/custom-title-3/style.scss":
/*!***************************************!*\
  !*** ./src/custom-title-3/style.scss ***!
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

/***/ "./src/custom-title-3/block.json":
/*!***************************************!*\
  !*** ./src/custom-title-3/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/custom-title-3","version":"1.0.0","title":"見出しタイトル 03","category":"lw-heading","icon":"editor-textcolor","description":"メインタイトルとサブタイトルを表示する見出しブロック（アクセントカラー付き）","supports":{"anchor":true},"aiHint":{"description":"アクセントカラー付き見出し。メインタイトル+サブタイトル。左寄せ対応。装飾的な見出しに","excludeFromAutoSelect":false,"contentAttributes":["mainTitle","subTitle"],"imageAttributes":[]},"attributes":{"mainTitle":{"type":"string","default":"CONTENT","aiHint":{"role":"heading","contentGuide":"セクション見出し（英語 or 日本語）。3〜15文字","example":"ABOUT US"}},"subTitle":{"type":"string","default":"テキストテキストテキストテキスト<br>テキストテキキストテキスト","aiHint":{"role":"subheading","contentGuide":"補足説明テキスト。20〜50文字。改行可","example":"お客様に選ばれ続ける理由を<br>ご紹介します"}},"textAlignment":{"type":"string","default":"left","aiHint":{"skip":true}},"accentColor":{"type":"string","default":"var(--color-main)","aiHint":{"skip":true}},"headingLevel":{"type":"number","default":2,"aiHint":{"skip":true}},"mainFontSizePc":{"type":"number","default":0,"aiHint":{"role":"size","contentGuide":"主題の文字の大きさ（PC・px）。0 なら既定の 60px"}},"mainFontSizeSp":{"type":"number","default":0,"aiHint":{"role":"size","contentGuide":"主題の文字の大きさ（スマホ・px）。0 なら既定の 48px。🚨 既定の 48px は 375px だと5文字で画面いっぱいになる。日本語の見出しは 28〜32px にする"}}},"editorScript":"file:./custom-title-3.js","no":3}');

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
/******/ 			"custom-title-3": 0,
/******/ 			"./style-custom-title-3": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-custom-title-3"], () => (__webpack_require__("./src/custom-title-3/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;