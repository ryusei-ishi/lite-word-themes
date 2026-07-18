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

/***/ "./src/lw-pr-comment-3/block.json":
/*!****************************************!*\
  !*** ./src/lw-pr-comment-3/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-comment-3","version":"1.0.0","title":"吹き出しコメント 03（画像・InnerBlocks）","category":"lw-comment","icon":"format-chat","description":"吹き出しスタイルのコメントブロック。画像とInnerBlocksテキストを配置。","aiHint":{"description":"吹き出しコメント（InnerBlocks）。アバター+自由コンテンツ","excludeFromAutoSelect":true,"contentAttributes":[],"imageAttributes":["comment3ImageUrl"],"excludeReason":"InnerBlocks使用のためAI直接生成非推奨"},"supports":{"anchor":true,"className":true},"attributes":{"comment3ImageWidthPc":{"type":"number","default":240},"comment3ImageWidthSp":{"type":"number","default":120},"comment3TextBdColorPc":{"type":"string","default":"#3C7FC3"},"comment3TextInnerBg":{"type":"string","default":"#e9f5ff"},"comment3ImageUrl":{"type":"string","default":"https://placehold.co/240x240/e8e8e8/999999?text=Image"},"comment3ImageId":{"type":"number","default":0},"comment3ImageAlt":{"type":"string","default":""},"comment3TextDfPc":{"type":"number","default":16},"comment3TextDfSp":{"type":"number","default":14},"comment3SpClm":{"type":"boolean","default":true},"comment3BdOutside":{"type":"boolean","default":false},"comment3BdColor":{"type":"string","default":"#3C7FC3"},"comment3Bg":{"type":"string","default":"#ffffff"},"comment3AlignItems":{"type":"string","default":"end"},"comment3MaxWidth":{"type":"number","default":980},"comment3TextInnerGapPc":{"type":"number","default":8},"comment3TextInnerGapSp":{"type":"number","default":8}},"editorScript":"file:./lw-pr-comment-3.js","no":3}');

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
/*!**************************************!*\
  !*** ./src/lw-pr-comment-3/index.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-comment-3/block.json");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * LiteWord – コメント 03
 * ------------------------------------------------------------
 *  • ブロック名 : wdl/lw-pr-comment-3
 *  • 吹き出しスタイルのコメントブロック（InnerBlocks対応）
 * ----------------------------------------------------------- */





/* InnerBlocks で許可するブロック */
var ALLOWED_BLOCKS = ["core/paragraph", "core/heading", "wdl/lw-space-1"];

/* InnerBlocks のデフォルトテンプレート */
var TEMPLATE = [["core/paragraph", {
  content: "ここにコメントテキストを挿入できます。吹き出しの中にお好みの文章を入力して、自由にカスタマイズしてください。"
}]];
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var comment3ImageWidthPc = attributes.comment3ImageWidthPc,
      comment3ImageWidthSp = attributes.comment3ImageWidthSp,
      comment3TextBdColorPc = attributes.comment3TextBdColorPc,
      comment3TextInnerBg = attributes.comment3TextInnerBg,
      comment3ImageUrl = attributes.comment3ImageUrl,
      comment3ImageId = attributes.comment3ImageId,
      comment3ImageAlt = attributes.comment3ImageAlt,
      comment3TextDfPc = attributes.comment3TextDfPc,
      comment3TextDfSp = attributes.comment3TextDfSp,
      comment3SpClm = attributes.comment3SpClm,
      comment3BdOutside = attributes.comment3BdOutside,
      comment3BdColor = attributes.comment3BdColor,
      comment3Bg = attributes.comment3Bg,
      comment3AlignItems = attributes.comment3AlignItems,
      comment3MaxWidth = attributes.comment3MaxWidth,
      comment3TextInnerGapPc = attributes.comment3TextInnerGapPc,
      comment3TextInnerGapSp = attributes.comment3TextInnerGapSp;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "lw-pr-comment-3".concat(comment3BdOutside ? " bd_outside" : ""),
      style: {
        "--comment-3-bd-color": comment3BdColor,
        "--comment-3-bg": comment3Bg,
        "--comment-3-max-width": "".concat(comment3MaxWidth, "px")
      }
    });
    var wrapStyle = _objectSpread({
      "--comment-3-image-width-pc": "".concat(comment3ImageWidthPc, "px"),
      "--comment-3-image-width-sp": "".concat(comment3ImageWidthSp, "px"),
      "--comment-3-text-bd-color-pc": comment3TextBdColorPc,
      "--comment-3-text-inner-bg": comment3TextInnerBg,
      "--comment-3-text-df-pc": "".concat(comment3TextDfPc, "px"),
      "--comment-3-text-df-sp": "".concat(comment3TextDfSp, "px"),
      "--comment-3-text-inner-gap-pc": "".concat(comment3TextInnerGapPc, "px"),
      "--comment-3-text-inner-gap-sp": "".concat(comment3TextInnerGapSp, "px")
    }, comment3BdOutside && {
      "--comment-3-align-items": comment3AlignItems
    });
    var wrapClassName = "lw-pr-comment-3__wrap".concat(comment3SpClm ? " sp_clm_1" : "");
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        setAttributes({
          comment3ImageUrl: media.url,
          comment3ImageId: media.id,
          comment3ImageAlt: media.alt || ""
        });
      },
      allowedTypes: ["image"],
      value: comment3ImageId,
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            marginBottom: "16px"
          }
        }, comment3ImageUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
          src: comment3ImageUrl,
          alt: comment3ImageAlt,
          style: {
            width: "100%",
            marginBottom: "8px",
            borderRadius: "4px"
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            gap: "8px"
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: open
        }, "\u753B\u50CF\u3092\u5909\u66F4"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "tertiary",
          isDestructive: true,
          onClick: function onClick() {
            setAttributes({
              comment3ImageUrl: "",
              comment3ImageId: 0,
              comment3ImageAlt: ""
            });
          }
        }, "\u524A\u9664"))) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: open
        }, "\u753B\u50CF\u3092\u9078\u629E"));
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u753B\u50CF\u5E45 PC (px)",
      value: comment3ImageWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          comment3ImageWidthPc: v
        });
      },
      min: 80,
      max: 400,
      step: 4
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u753B\u50CF\u5E45 SP (px)",
      value: comment3ImageWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          comment3ImageWidthSp: v
        });
      },
      min: 60,
      max: 240,
      step: 4
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u67A0\u3092\u5916\u5074\u306B\u3059\u308B",
      checked: comment3BdOutside,
      onChange: function onChange(v) {
        return setAttributes({
          comment3BdOutside: v
        });
      }
    }), comment3BdOutside && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u753B\u50CF\u306E\u5782\u76F4\u4F4D\u7F6E",
      value: comment3AlignItems,
      options: [{
        label: "上揃え",
        value: "start"
      }, {
        label: "中央揃え",
        value: "center"
      }, {
        label: "下揃え",
        value: "end"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          comment3AlignItems: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 (px)",
      value: comment3MaxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          comment3MaxWidth: v
        });
      },
      min: 600,
      max: 1200,
      step: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "SP\u6642\u306B1\u30AB\u30E9\u30E0\u8868\u793A",
      checked: comment3SpClm,
      onChange: function onChange(v) {
        return setAttributes({
          comment3SpClm: v
        });
      }
    })), comment3BdOutside && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u5916\u67A0\u30AB\u30E9\u30FC\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: comment3BdColor,
      onChange: function onChange(color) {
        return setAttributes({
          comment3BdColor: color || "#3C7FC3"
        });
      }
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: comment3Bg,
      onChange: function onChange(color) {
        return setAttributes({
          comment3Bg: color || "#ffffff"
        });
      }
    })), !comment3BdOutside && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30C6\u30AD\u30B9\u30C8\u30A8\u30EA\u30A2\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: comment3TextBdColorPc,
      onChange: function onChange(color) {
        return setAttributes({
          comment3TextBdColorPc: color || "#3C7FC3"
        });
      }
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: comment3TextInnerBg,
      onChange: function onChange(color) {
        return setAttributes({
          comment3TextInnerBg: color || "#e9f5ff"
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30C6\u30AD\u30B9\u30C8\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC (px)",
      value: comment3TextDfPc,
      onChange: function onChange(v) {
        return setAttributes({
          comment3TextDfPc: v
        });
      },
      min: 10,
      max: 32,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (px)",
      value: comment3TextDfSp,
      onChange: function onChange(v) {
        return setAttributes({
          comment3TextDfSp: v
        });
      },
      min: 10,
      max: 32,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "gap"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC (px)",
      value: comment3TextInnerGapPc,
      onChange: function onChange(v) {
        return setAttributes({
          comment3TextInnerGapPc: v
        });
      },
      min: 0,
      max: 32,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (px)",
      value: comment3TextInnerGapSp,
      onChange: function onChange(v) {
        return setAttributes({
          comment3TextInnerGapSp: v
        });
      },
      min: 0,
      max: 32,
      step: 1
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: wrapClassName,
      style: wrapStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__text"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__text_inner"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      templateLock: false
    }), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__text_arrow"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__image"
    }, comment3ImageUrl ? /*#__PURE__*/React.createElement("img", {
      src: comment3ImageUrl,
      alt: comment3ImageAlt
    }) : /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__image_placeholder"
    }, /*#__PURE__*/React.createElement("span", null, "\u753B\u50CF"))))));
  },
  save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var comment3ImageWidthPc = attributes.comment3ImageWidthPc,
      comment3ImageWidthSp = attributes.comment3ImageWidthSp,
      comment3TextBdColorPc = attributes.comment3TextBdColorPc,
      comment3TextInnerBg = attributes.comment3TextInnerBg,
      comment3ImageUrl = attributes.comment3ImageUrl,
      comment3ImageAlt = attributes.comment3ImageAlt,
      comment3TextDfPc = attributes.comment3TextDfPc,
      comment3TextDfSp = attributes.comment3TextDfSp,
      comment3SpClm = attributes.comment3SpClm,
      comment3BdOutside = attributes.comment3BdOutside,
      comment3BdColor = attributes.comment3BdColor,
      comment3Bg = attributes.comment3Bg,
      comment3AlignItems = attributes.comment3AlignItems,
      comment3MaxWidth = attributes.comment3MaxWidth,
      comment3TextInnerGapPc = attributes.comment3TextInnerGapPc,
      comment3TextInnerGapSp = attributes.comment3TextInnerGapSp;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "lw-pr-comment-3".concat(comment3BdOutside ? " bd_outside" : ""),
      style: {
        "--comment-3-bd-color": comment3BdColor,
        "--comment-3-bg": comment3Bg,
        "--comment-3-max-width": "".concat(comment3MaxWidth, "px")
      }
    });
    var wrapStyle = _objectSpread({
      "--comment-3-image-width-pc": "".concat(comment3ImageWidthPc, "px"),
      "--comment-3-image-width-sp": "".concat(comment3ImageWidthSp, "px"),
      "--comment-3-text-bd-color-pc": comment3TextBdColorPc,
      "--comment-3-text-inner-bg": comment3TextInnerBg,
      "--comment-3-text-df-pc": "".concat(comment3TextDfPc, "px"),
      "--comment-3-text-df-sp": "".concat(comment3TextDfSp, "px"),
      "--comment-3-text-inner-gap-pc": "".concat(comment3TextInnerGapPc, "px"),
      "--comment-3-text-inner-gap-sp": "".concat(comment3TextInnerGapSp, "px")
    }, comment3BdOutside && {
      "--comment-3-align-items": comment3AlignItems
    });
    var wrapClassName = "lw-pr-comment-3__wrap".concat(comment3SpClm ? " sp_clm_1" : "");
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: wrapClassName,
      style: wrapStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__text"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__text_inner"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__text_arrow"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-comment-3__image"
    }, comment3ImageUrl && /*#__PURE__*/React.createElement("img", {
      src: comment3ImageUrl,
      alt: comment3ImageAlt
    }))));
  }
});
/******/ })()
;