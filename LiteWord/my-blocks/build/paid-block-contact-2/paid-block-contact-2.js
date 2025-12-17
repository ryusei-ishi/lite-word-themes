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

/***/ "./src/paid-block-contact-2/block.json":
/*!*********************************************!*\
  !*** ./src/paid-block-contact-2/block.json ***!
  \*********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-contact-2","version":"1.0.0","title":"お問合わせフォーム 02","category":"lw-contact","icon":"email","supports":{"anchor":true},"editorScript":"file:./paid-block-contact-2.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":2,"attributes":{"formId":{"type":"number","default":1},"mainTitle":{"type":"string","default":"CONTACT"},"subTitle":{"type":"string","default":"お問合わせフォーム"},"description":{"type":"string","default":"ご不明な点やご相談がございましたら、下記のお問い合わせフォームよりお気軽にご連絡ください。"},"bgImageUrl":{"type":"string","default":"https://lite-word.com/sample_img/background/6.webp"},"bgImageUrlSp":{"type":"string","default":""},"bgColor":{"type":"string","default":"#03294C"},"bgOpacity":{"type":"number","default":0.5},"requiredBgColor":{"type":"string","default":"#da3838"},"submitBgColor":{"type":"string","default":"#EE3131"},"mainTitleLevel":{"type":"string","default":"h1"},"maxWidth":{"type":"string","default":"800px"},"descriptionAlignPC":{"type":"string","default":"pc_center"},"descriptionAlignSP":{"type":"string","default":"sp_center"}}}');

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
/*!*******************************************!*\
  !*** ./src/paid-block-contact-2/index.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-contact-2/block.json");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * LiteWord – お問い合わせフォーム 02（最大横幅バグ修正版）
 * ------------------------------------------------------------
 *  • ブロック名   : wdl/paid-block-contact-2
 *  • 修正ポイント : maxWidth を常に "◯◯px" の文字列で保存し、
 *                   RangeControl との型不整合を解消
 * ----------------------------------------------------------- */




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  /* ==================================================
   * 編集画面
   * ================================================= */
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var formId = attributes.formId,
      mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      description = attributes.description,
      bgImageUrl = attributes.bgImageUrl,
      bgImageUrlSp = attributes.bgImageUrlSp,
      bgColor = attributes.bgColor,
      bgOpacity = attributes.bgOpacity,
      requiredBgColor = attributes.requiredBgColor,
      submitBgColor = attributes.submitBgColor,
      mainTitleLevel = attributes.mainTitleLevel,
      maxWidth = attributes.maxWidth,
      descriptionAlignPC = attributes.descriptionAlignPC,
      descriptionAlignSP = attributes.descriptionAlignSP;

    /* ─ 見出しレベル切替 ─ */
    var TagName = mainTitleLevel;
    var onChangeHeadingLevel = function onChangeHeadingLevel(level) {
      return setAttributes({
        mainTitleLevel: level
      });
    };

    /* ─ RangeControl 用の数値化（未設定なら 0） ─ */
    var widthNumber = parseInt(maxWidth, 10) || 0;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'paid-block-contact-2'
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
      label: "\u898B\u51FA\u3057\u30EC\u30D9\u30EB"
    }, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(function (tag) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: tag,
        isPressed: mainTitleLevel === tag,
        onClick: function onClick() {
          return onChangeHeadingLevel(tag);
        }
      }, tag.toUpperCase());
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=LPns_dcZADo",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=gtxSdMsPBAU",
      target: "_blank"
    }, "\u30D5\u30A9\u30FC\u30E0\u8A2D\u5B9A\u65B9\u6CD5\u306F\u3053\u3061\u3089"))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
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
      title: "\u80CC\u666F\u3084\u8272\u306E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u80CC\u666F\u753B\u50CF\uFF08PC\u306E\u6642\uFF09")), bgImageUrl && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: bgImageUrl,
      alt: "\u80CC\u666F\u753B\u50CF\u30D7\u30EC\u30D3\u30E5\u30FC",
      style: {
        width: '100%',
        maxHeight: '150px',
        objectFit: 'cover',
        border: '1px solid #ccc'
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          bgImageUrl: media.url
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, "\u80CC\u666F\u753B\u50CF\u3092\u9078\u629E"), bgImageUrl && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              bgImageUrl: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '10px'
          }
        }, "\u524A\u9664"));
      }
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u80CC\u666F\u753B\u50CF\uFF08SP\u306E\u6642\uFF09")), bgImageUrlSp && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: bgImageUrlSp,
      alt: "\u80CC\u666F\u753B\u50CF\u30D7\u30EC\u30D3\u30E5\u30FC",
      style: {
        width: '100%',
        maxHeight: '150px',
        objectFit: 'cover',
        border: '1px solid #ccc'
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          bgImageUrlSp: media.url
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref3) {
        var open = _ref3.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, "SP\u7528\u80CC\u666F\u753B\u50CF\u3092\u9078\u629E"), bgImageUrlSp && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              bgImageUrlSp: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '10px'
          }
        }, "\u524A\u9664"));
      }
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u80CC\u666F\u8272")), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: bgColor,
      onChange: function onChange(color) {
        return setAttributes({
          bgColor: color
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u80CC\u666F\u8272\u306E\u900F\u660E\u5EA6",
      value: bgOpacity,
      onChange: function onChange(value) {
        return setAttributes({
          bgOpacity: value
        });
      },
      min: 0,
      max: 1,
      step: 0.05
    }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u5FC5\u9808\u30A2\u30A4\u30B3\u30F3\u306E\u80CC\u666F\u8272")), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: requiredBgColor,
      onChange: function onChange(color) {
        return setAttributes({
          requiredBgColor: color
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u9001\u4FE1\u30DC\u30BF\u30F3\u306E\u80CC\u666F\u8272")), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: submitBgColor,
      onChange: function onChange(color) {
        return setAttributes({
          submitBgColor: color
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u30D5\u30A9\u30FC\u30E0\u90E8\u5206\u306E\u6700\u5927\u6A2A\u5E45")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45\uFF08px\uFF09",
      value: widthNumber,
      onChange: function onChange(value) {
        if (value === undefined || value === null) {
          /* リセット時：空文字で「指定なし」 */
          setAttributes({
            maxWidth: ''
          });
        } else {
          /* 常に px を付与して保存 */
          setAttributes({
            maxWidth: "".concat(value, "px")
          });
        }
      },
      min: 0,
      max: 1200,
      step: 10,
      allowReset: true,
      resetFallbackValue: 800
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8AAC\u660E\u30C6\u30AD\u30B9\u30C8\u306E\u914D\u7F6E",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "PC\u3067\u306E\u8AAC\u660E\u30C6\u30AD\u30B9\u30C8\u306E\u914D\u7F6E",
      value: descriptionAlignPC,
      options: [{
        label: '左寄せ（pc_left）',
        value: 'pc_left'
      }, {
        label: '中央寄せ（pc_center）',
        value: 'pc_center'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          descriptionAlignPC: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30B9\u30DE\u30DB\u3067\u306E\u8AAC\u660E\u30C6\u30AD\u30B9\u30C8\u306E\u914D\u7F6E",
      value: descriptionAlignSP,
      options: [{
        label: '左寄せ（sp_left）',
        value: 'sp_left'
      }, {
        label: '中央寄せ（sp_center）',
        value: 'sp_center'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          descriptionAlignSP: value
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "this_wrap",
      style: {
        maxWidth: maxWidth
      }
    }, /*#__PURE__*/React.createElement(TagName, {
      className: "title"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: mainTitle,
      onChange: function onChange(value) {
        return setAttributes({
          mainTitle: value
        });
      },
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      onChange: function onChange(value) {
        return setAttributes({
          subTitle: value
        });
      },
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB"
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "description ".concat(descriptionAlignPC, " ").concat(descriptionAlignSP),
      value: description,
      onChange: function onChange(value) {
        return setAttributes({
          description: value
        });
      },
      placeholder: "\u8AAC\u660E\u6587"
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_filter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg_filter_inner",
      style: {
        backgroundColor: bgColor,
        opacity: bgOpacity
      }
    }), bgImageUrl && /*#__PURE__*/React.createElement("picture", null, /*#__PURE__*/React.createElement("source", {
      srcSet: bgImageUrlSp,
      media: "(max-width: 800px)"
    }), /*#__PURE__*/React.createElement("source", {
      srcSet: bgImageUrl,
      media: "(min-width: 801px)"
    }), /*#__PURE__*/React.createElement("img", {
      src: bgImageUrl,
      alt: "\u80CC\u666F\u753B\u50CF",
      style: {
        display: 'block'
      }
    }))))));
  },
  /* ==================================================
   * 保存（フロント出力）
   * ================================================= */
  save: function save(_ref4) {
    var attributes = _ref4.attributes;
    var formId = attributes.formId,
      mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      description = attributes.description,
      bgImageUrl = attributes.bgImageUrl,
      bgImageUrlSp = attributes.bgImageUrlSp,
      bgColor = attributes.bgColor,
      bgOpacity = attributes.bgOpacity,
      requiredBgColor = attributes.requiredBgColor,
      submitBgColor = attributes.submitBgColor,
      mainTitleLevel = attributes.mainTitleLevel,
      maxWidth = attributes.maxWidth,
      descriptionAlignPC = attributes.descriptionAlignPC,
      descriptionAlignSP = attributes.descriptionAlignSP;
    var TagName = mainTitleLevel;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'paid-block-contact-2'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "this_wrap",
      style: {
        maxWidth: maxWidth
      }
    }, /*#__PURE__*/React.createElement(TagName, {
      className: "title"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: mainTitle
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: subTitle
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "description ".concat(descriptionAlignPC, " ").concat(descriptionAlignSP),
      value: description
    }), "[lw_mail_form_select id='".concat(formId, "']"), /*#__PURE__*/React.createElement("div", {
      className: "bg_filter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg_filter_inner",
      style: {
        backgroundColor: bgColor,
        opacity: bgOpacity
      }
    }), (bgImageUrl || bgImageUrlSp) && /*#__PURE__*/React.createElement("picture", null, /*#__PURE__*/React.createElement("source", {
      srcSet: bgImageUrlSp,
      media: "(max-width: 800px)"
    }), /*#__PURE__*/React.createElement("source", {
      srcSet: bgImageUrl,
      media: "(min-width: 801px)"
    }), /*#__PURE__*/React.createElement("img", {
      src: bgImageUrl,
      alt: "\u80CC\u666F\u753B\u50CF",
      style: {
        display: 'block'
      }
    })))), /*#__PURE__*/React.createElement("style", null, "\n\t\t\t\t\t.submit_wrap button   { background-color: ".concat(submitBgColor, " !important; }\n\t\t\t\t\t.required.is-required { background-color: ").concat(requiredBgColor, " !important; }\n\t\t\t\t")));
  }
});
/******/ })()
;