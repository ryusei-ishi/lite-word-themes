/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-before-after-2/index.js":
/*!************************************************!*\
  !*** ./src/paid-block-before-after-2/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-before-after-2/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-before-after-2/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-before-after-2/block.json");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }







/**
 * items のデフォルト値を返す関数
 * - 直接配列を default に指定すると、ブロックインスタンス間で参照が共有される場合がある
 * - 必ず関数で返すことで、ブロックごとに独立した配列を得られる
 */
var getDefaultItems = function getDefaultItems() {
  return [{
    // Before画像
    imgUrl: 'https://lite-word.com/sample_img/women/6_2.webp'
  }, {
    // After画像
    imgUrl: 'https://lite-word.com/sample_img/women/6.webp'
  }];
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  title: 'ビフォーアフター 02',
  icon: 'images-alt2',
  category: 'lw-voice',
  supports: {
    anchor: true
  },
  edit: function edit(props) {
    var _items$3, _items$4;
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var beforeLabel = attributes.beforeLabel,
      afterLabel = attributes.afterLabel,
      labelColorBefore = attributes.labelColorBefore,
      labelColorAfter = attributes.labelColorAfter,
      maxWidth = attributes.maxWidth,
      aspectRatioH = attributes.aspectRatioH,
      items = attributes.items;

    // items が配列でない、または空配列なら初期化
    if (!Array.isArray(items) || items.length === 0) {
      items = getDefaultItems();
      setAttributes({
        items: items
      });
    }

    // ========== イベントハンドラ ==========
    var onChangeBeforeLabel = function onChangeBeforeLabel(value) {
      setAttributes({
        beforeLabel: value
      });
    };
    var onChangeAfterLabel = function onChangeAfterLabel(value) {
      setAttributes({
        afterLabel: value
      });
    };
    // ラベル色を変更
    var onChangeLabelColorBefore = function onChangeLabelColorBefore(color) {
      setAttributes({
        labelColorBefore: color
      });
    };
    var onChangeLabelColorAfter = function onChangeLabelColorAfter(color) {
      setAttributes({
        labelColorAfter: color
      });
    };

    // 画像更新 (0=Before, 1=After)
    var updateItem = function updateItem(index, url) {
      var newItems = _toConsumableArray(items);
      newItems[index].imgUrl = url;
      setAttributes({
        items: newItems
      });
    };

    // 横幅/縦比スライダー
    var onChangeMaxWidth = function onChangeMaxWidth(value) {
      setAttributes({
        maxWidth: value
      });
    };
    var onChangeAspectRatioH = function onChangeAspectRatioH(value) {
      setAttributes({
        aspectRatioH: value
      });
    };
    // ========== レンダリング ==========
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)();
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=FRkHB4I6CSs",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089"))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B5\u30A4\u30BA\u306E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45(px)",
      value: maxWidth,
      onChange: onChangeMaxWidth,
      min: 400,
      max: 1600,
      step: 8
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u7E26\u6BD4",
      value: aspectRatioH,
      onChange: onChangeAspectRatioH,
      min: 100,
      max: 1600,
      step: 1,
      allowReset: true,
      resetFallbackValue: 800
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "Before\u753B\u50CF"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return updateItem(0, media.url);
      },
      allowedTypes: ['image'],
      render: function render(_ref) {
        var _items$;
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, (_items$ = items[0]) !== null && _items$ !== void 0 && _items$.imgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
          src: items[0].imgUrl,
          alt: "Before\u753B\u50CF",
          style: {
            maxWidth: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          isSecondary: true,
          style: {
            marginTop: '10px'
          }
        }, "\u753B\u50CF\u3092\u5909\u66F4")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          isSecondary: true
        }, "\u753B\u50CF\u3092\u9078\u629E"));
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "After\u753B\u50CF"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return updateItem(1, media.url);
      },
      allowedTypes: ['image'],
      render: function render(_ref2) {
        var _items$2;
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, (_items$2 = items[1]) !== null && _items$2 !== void 0 && _items$2.imgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
          src: items[1].imgUrl,
          alt: "After\u753B\u50CF",
          style: {
            maxWidth: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          isSecondary: true,
          style: {
            marginTop: '10px'
          }
        }, "\u753B\u50CF\u3092\u5909\u66F4")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          isSecondary: true
        }, "\u753B\u50CF\u3092\u9078\u629E"));
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30E9\u30D9\u30EB\u8272\u306E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("p", null, "Before\u30E9\u30D9\u30EB\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: labelColorBefore,
      onChange: onChangeLabelColorBefore
      // 必要に応じて色セットを制限したりできます
    }), /*#__PURE__*/React.createElement("p", null, "After\u30E9\u30D9\u30EB\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: labelColorAfter,
      onChange: onChangeLabelColorAfter
    }))), /*#__PURE__*/React.createElement("div", {
      className: "paid-block-before-after-2-editor"
    }, /*#__PURE__*/React.createElement("p", {
      className: "editor_in_ttl"
    }, "Before/After\u306E\u8A2D\u5B9A"), /*#__PURE__*/React.createElement("div", {
      className: "paid-block-before-after-2-preview-wrap",
      style: {
        maxWidth: maxWidth + 'px',
        aspectRatio: "1280 / ".concat(aspectRatioH)
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "left"
    }, ((_items$3 = items[0]) === null || _items$3 === void 0 ? void 0 : _items$3.imgUrl) && /*#__PURE__*/React.createElement("img", {
      src: items[0].imgUrl,
      alt: "Before\u30D7\u30EC\u30D3\u30E5\u30FC"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "paid-block-before-after-2_label",
      value: beforeLabel,
      onChange: onChangeBeforeLabel,
      placeholder: "before\u30E9\u30D9\u30EB"
      // ラベルの文字色
      ,
      style: {
        background: labelColorBefore
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "right"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "paid-block-before-after-2_label right",
      value: afterLabel,
      onChange: onChangeAfterLabel,
      placeholder: "after\u30E9\u30D9\u30EB"
      // ラベルの文字色
      ,
      style: {
        background: labelColorAfter
      }
    }), ((_items$4 = items[1]) === null || _items$4 === void 0 ? void 0 : _items$4.imgUrl) && /*#__PURE__*/React.createElement("img", {
      src: items[1].imgUrl,
      alt: "After\u30D7\u30EC\u30D3\u30E5\u30FC"
    })))));
  },
  save: function save(props) {
    var _items$5, _items$6;
    var attributes = props.attributes;
    var beforeLabel = attributes.beforeLabel,
      afterLabel = attributes.afterLabel,
      labelColorBefore = attributes.labelColorBefore,
      labelColorAfter = attributes.labelColorAfter,
      maxWidth = attributes.maxWidth,
      aspectRatioH = attributes.aspectRatioH,
      items = attributes.items;

    // 配列チェック
    var beforeUrl = Array.isArray(items) && (_items$5 = items[0]) !== null && _items$5 !== void 0 && _items$5.imgUrl ? items[0].imgUrl : '';
    var afterUrl = Array.isArray(items) && (_items$6 = items[1]) !== null && _items$6 !== void 0 && _items$6.imgUrl ? items[1].imgUrl : '';

    // スタイル適用
    var wrapStyle = {
      maxWidth: maxWidth ? maxWidth + 'px' : undefined
    };
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'paid-block-before-after-2'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "this_wrap",
      style: wrapStyle
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "label",
      value: beforeLabel,
      style: {
        background: labelColorBefore
      }
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "label right",
      value: afterLabel,
      style: {
        background: labelColorAfter
      }
    }), afterUrl && /*#__PURE__*/React.createElement("img", {
      src: afterUrl,
      className: "before-image",
      alt: "Before",
      style: {
        aspectRatio: "1280 / ".concat(aspectRatioH)
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "after-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "after-inner"
    }, beforeUrl && /*#__PURE__*/React.createElement("img", {
      src: beforeUrl,
      className: "after-image",
      alt: "After",
      style: {
        aspectRatio: "1280 / ".concat(aspectRatioH)
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "slider-line"
    }, /*#__PURE__*/React.createElement("div", {
      className: "slider-circle"
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 320 512"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 \r 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 \r 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 \r 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 320 512"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 \r 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 \r 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 \r 45.3 0l192 192z"
    }))))), /*#__PURE__*/React.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: "\n                        document.addEventListener('DOMContentLoaded', function() {\n                            var blocks = document.querySelectorAll('.paid-block-before-after-2');\n                            blocks.forEach(function(block) {\n                                var container = block.querySelector('.this_wrap');\n                                var slider = block.querySelector('.slider-line');\n                                var afterWrapper = block.querySelector('.after-wrapper');\n                                if (!container || !slider || !afterWrapper) return;\n\n                                function updateSliderPosition(x) {\n                                    var rect = container.getBoundingClientRect();\n                                    var offsetX = x - rect.left;\n                                    if (offsetX < 0) offsetX = 0;\n                                    if (offsetX > rect.width) offsetX = rect.width;\n                                    afterWrapper.style.width = offsetX + 'px';\n                                    slider.style.left = offsetX + 'px';\n                                }\n\n                                // \u521D\u671F\u4F4D\u7F6E\uFF1A\u4E2D\u592E\u306B\u30B9\u30E9\u30A4\u30C0\u30FC\u3092\u914D\u7F6E\n                                var initialCenter = container.getBoundingClientRect().width / 2;\n                                updateSliderPosition(container.getBoundingClientRect().left + initialCenter);\n\n                                // PC\u30DE\u30A6\u30B9\u5BFE\u5FDC\n                                container.addEventListener('mousemove', function(e) {\n                                    updateSliderPosition(e.clientX);\n                                });\n\n                                // \u30B9\u30DE\u30DB\u30BF\u30C3\u30C1\u5BFE\u5FDC\n                                container.addEventListener('touchmove', function(e) {\n                                    if (e.touches.length > 0) {\n                                        updateSliderPosition(e.touches[0].clientX);\n                                    }\n                                }, { passive: false });\n\n                                // \u30B9\u30DE\u30DB\u3067\u30B9\u30AF\u30ED\u30FC\u30EB\u3057\u306A\u3044\u3088\u3046\u306B\u3059\u308B\n                                container.addEventListener('touchstart', function(e) {\n                                    e.preventDefault();\n                                }, { passive: false });\n                            });\n                        });\n                        "
      }
    }));
  }
});

/***/ }),

/***/ "./src/paid-block-before-after-2/editor.scss":
/*!***************************************************!*\
  !*** ./src/paid-block-before-after-2/editor.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-before-after-2/style.scss":
/*!**************************************************!*\
  !*** ./src/paid-block-before-after-2/style.scss ***!
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

/***/ "./src/paid-block-before-after-2/block.json":
/*!**************************************************!*\
  !*** ./src/paid-block-before-after-2/block.json ***!
  \**************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-before-after-2","version":"1.0.0","title":"ビフォーアフター 02","category":"lw-voice","icon":"images-alt2","editorScript":"file:./paid-block-before-after-2.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","supports":{"anchor":true},"no":2,"attributes":{"beforeLabel":{"type":"string","default":"before"},"afterLabel":{"type":"string","default":"after"},"labelColorBefore":{"type":"string","default":"rgba(209, 77, 77, 0.85)"},"labelColorAfter":{"type":"string","default":"rgba(77, 209, 77, 0.85)"},"maxWidth":{"type":"number","default":1280},"aspectRatioH":{"type":"number","default":800},"items":{"type":"array","default":[{"imgUrl":"https://lite-word.com/sample_img/women/6_2.webp"},{"imgUrl":"https://lite-word.com/sample_img/women/6.webp"}]}}}');

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
/******/ 			"paid-block-before-after-2": 0,
/******/ 			"./style-paid-block-before-after-2": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-before-after-2"], () => (__webpack_require__("./src/paid-block-before-after-2/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;