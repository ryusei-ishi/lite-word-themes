/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shin-gas-station-01-list-1/index.js":
/*!*************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/shin-gas-station-01-list-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/shin-gas-station-01-list-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/shin-gas-station-01-list-1/block.json");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'shin-gas-station-01-list-1'
    });
    var contents = attributes.contents;

    // コンテンツ追加
    var addContent = function addContent() {
      var newIndex = contents.length + 1;
      var newContent = {
        text: '新しい事業',
        textColor: '',
        number: String(newIndex).padStart(2, '0'),
        image: '',
        p_text: '新しい説明テキスト',
        url: ''
      };
      setAttributes({
        contents: [].concat(_toConsumableArray(contents), [newContent])
      });
    };

    // コンテンツ削除
    var removeContent = function removeContent(index) {
      setAttributes({
        contents: contents.filter(function (_, i) {
          return i !== index;
        })
      });
    };

    // コンテンツ更新
    var updateContent = function updateContent(index, key, value) {
      var updatedContents = _toConsumableArray(contents);
      updatedContents[index][key] = value;
      setAttributes({
        contents: updatedContents
      });
    };
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30C6\u30AD\u30B9\u30C8\u30AB\u30E9\u30FC\u8A2D\u5B9A",
      initialOpen: true
    }, contents.map(function (content, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: {
          marginBottom: '16px'
        }
      }, /*#__PURE__*/React.createElement("p", null, "Item ", index + 1, " \u306E\u30C6\u30AD\u30B9\u30C8\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
        value: content.textColor,
        onChange: function onChange(color) {
          return updateContent(index, 'textColor', color);
        }
      }));
    }))), /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, contents.map(function (content, index) {
      return /*#__PURE__*/React.createElement("li", {
        className: "shin-gas-station-01-list-1_item item_".concat(index),
        key: index
      }, /*#__PURE__*/React.createElement("div", {
        className: "link"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text_in"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "ttl"
      }, /*#__PURE__*/React.createElement("span", {
        className: "no",
        style: {
          color: content.textColor || 'inherit',
          borderColor: content.textColor || 'inherit'
        }
      }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        className: "text",
        style: {
          color: content.textColor || 'inherit'
        },
        value: content.text,
        onChange: function onChange(value) {
          return updateContent(index, 'text', value);
        },
        placeholder: "\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
      })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "p",
        className: "p_text",
        value: content.p_text,
        onChange: function onChange(value) {
          return updateContent(index, 'p_text', value);
        },
        placeholder: "\u8AAC\u660E\u6587\u3092\u5165\u529B"
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(media) {
          return updateContent(index, 'image', media.url);
        },
        allowedTypes: ["image"],
        render: function render(_ref) {
          var open = _ref.open;
          return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            isSecondary: true
          }, content.image ? '画像を変更' : '画像を選択');
        }
      }), content.image && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: function onClick() {
          return updateContent(index, 'image', '');
        },
        isDestructive: true,
        style: {
          marginLeft: '8px'
        }
      }, "\u753B\u50CF\u3092\u524A\u9664"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AFURL",
        value: content.url,
        onChange: function onChange(value) {
          return updateContent(index, 'url', value);
        },
        style: {
          marginTop: '12px',
          maxWidth: '300px'
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "bottom_content"
      }, content.image && /*#__PURE__*/React.createElement("img", {
        src: content.image,
        alt: ""
      })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeContent(index);
        },
        style: {
          marginTop: '10px'
        }
      }, "\u524A\u9664")));
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      isPrimary: true,
      onClick: addContent
    }, "\u30B3\u30F3\u30C6\u30F3\u30C4\u3092\u8FFD\u52A0"));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'shin-gas-station-01-list-1'
    });
    var contents = attributes.contents;
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, contents.map(function (content, index) {
      // URL が設定されていない場合は div.link、設定されている場合は a.link
      var LinkTag = content.url ? 'a' : 'div';
      var linkProps = content.url ? {
        href: content.url
      } : {};
      var nextBtn = /*#__PURE__*/React.createElement("div", {
        className: "next_btn"
      }, /*#__PURE__*/React.createElement("div", null, "\u8A73\u3057\u304F\u898B\u308B", /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "39.5",
        height: "4.197",
        viewBox: "0 0 39.5 4.197"
      }, /*#__PURE__*/React.createElement("g", {
        id: "\u30B0\u30EB\u30FC\u30D7_11",
        "data-name": "\u30B0\u30EB\u30FC\u30D7 11",
        transform: "translate(-179.5 -2154.803)"
      }, /*#__PURE__*/React.createElement("path", {
        id: "\u30D1\u30B9_28",
        "data-name": "\u30D1\u30B9 28",
        d: "M0,0,8,4.2H0Z",
        transform: "translate(211 2154.803)",
        fill: "#059d47"
      }), /*#__PURE__*/React.createElement("path", {
        id: "\u7DDA_1",
        "data-name": "\u7DDA 1",
        d: "M32,.5H0v-1H32Z",
        transform: "translate(179.5 2158.5)",
        fill: "#059d47"
      })))));
      return /*#__PURE__*/React.createElement("li", {
        className: "shin-gas-station-01-list-1_item item_".concat(index),
        key: index
      }, /*#__PURE__*/React.createElement(LinkTag, _extends({
        className: "link"
      }, linkProps), /*#__PURE__*/React.createElement("div", {
        className: "text_in"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "ttl"
      }, /*#__PURE__*/React.createElement("span", {
        className: "no",
        style: {
          color: content.textColor || '#111',
          borderColor: content.textColor || '#111'
        }
      }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "span",
        className: "text",
        value: content.text,
        style: {
          color: content.textColor || '#111'
        },
        "data-text-color": content.textColor
      })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "p",
        className: "p_text",
        value: content.p_text
      })), /*#__PURE__*/React.createElement("div", {
        className: "bottom_content"
      }, content.image ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
        src: content.image,
        alt: content.text
      }), content.url ? nextBtn : null) : content.url && nextBtn)));
    })));
  }
});

/***/ }),

/***/ "./src/shin-gas-station-01-list-1/editor.scss":
/*!****************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/editor.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/shin-gas-station-01-list-1/style.scss":
/*!***************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/style.scss ***!
  \***************************************************/
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

/***/ "./src/shin-gas-station-01-list-1/block.json":
/*!***************************************************!*\
  !*** ./src/shin-gas-station-01-list-1/block.json ***!
  \***************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/shin-gas-station-01-list-1","version":"1.0.0","title":"インフォリスト 1 shin shop pattern 01","category":"lw-list","icon":"editor-ul","supports":{"anchor":true},"attributes":{"contents":{"type":"array","source":"query","selector":".shin-gas-station-01-list-1_item","query":{"text":{"type":"string","source":"html","selector":".text"},"textColor":{"type":"string","source":"attribute","selector":".text","attribute":"data-text-color"},"number":{"type":"string","source":"text","selector":".no"},"p_text":{"type":"string","source":"html","selector":".p_text"},"image":{"type":"string","source":"attribute","selector":"img","attribute":"src"},"url":{"type":"string","source":"attribute","selector":".link","attribute":"href","default":""}},"default":[{"text":"エネルギー事業","textColor":"#E58A68","number":"01","image":"","p_text":"ガソリンスタンドの運営を通じて、高品質な燃料とサービスを提供。","url":""},{"text":"コンビニエンスストア事業","textColor":"#03A0C6","number":"02","image":"","p_text":"お客様にとって、いつでも、どこでも、何を求めても手に入る場所を提供することを目指しています。","url":""},{"text":"カーディーラー事業","textColor":"#059D47","number":"03","image":"","p_text":"お客様のカーライフをトータルにサポートするため、新車・中古車の販売など、幅広いサービスを提供しています。","url":""}]}},"editorScript":"file:./shin-gas-station-01-list-1.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":15}');

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
/******/ 			"shin-gas-station-01-list-1": 0,
/******/ 			"./style-shin-gas-station-01-list-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-shin-gas-station-01-list-1"], () => (__webpack_require__("./src/shin-gas-station-01-list-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;