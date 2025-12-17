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

/***/ "./src/cta-1/block.json":
/*!******************************!*\
  !*** ./src/cta-1/block.json ***!
  \******************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/cta-1","version":"1.0.0","title":"CTA 01","category":"lw-cta","icon":"megaphone","description":"背景画像付きのCTAブロック","aiDescription":"お問い合わせや資料請求などのアクションを促すセクション。背景画像とオーバーレイで視覚的にインパクトを与え、ボタンでユーザーを誘導する。ページの最後や重要なポイントに配置する。","aiNotes":"h2見出しは内部に含まれるため、直前にcustom-title系ブロックを配置しない。buttonUrlは必須。","supports":{"anchor":true},"attributes":{"title":{"type":"string","source":"html","selector":".cta-1__title","default":"無料相談受付中"},"text":{"type":"string","source":"html","selector":"p","default":"テキストテキストテキストテキストテキストテキス<br>トテキストテキストテキストテキストテキストテキスト"},"buttonText":{"type":"string","source":"html","selector":"a","default":"お問い合わせ"},"buttonUrl":{"type":"string","default":"#"},"openInNewTab":{"type":"boolean","default":false},"imageUrl":{"type":"string","source":"attribute","selector":"img","attribute":"src","default":""},"imageAlt":{"type":"string","source":"attribute","selector":"img","attribute":"alt","default":"背景画像"},"filterColor":{"type":"string","default":"#054161"},"buttonBackgroundColor":{"type":"string","default":"var(--color-main)"},"buttonBorderColor":{"type":"string","default":"#fff"},"buttonBorderSize":{"type":"number","default":1},"buttonMaxWidth":{"type":"number","default":240},"pcTextAlign":{"type":"string","default":"center"},"mobileTextAlign":{"type":"string","default":"center"},"maxWidth":{"type":"number","default":0},"headingLevel":{"type":"number","default":2}},"editorScript":"file:./cta-1.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":1}');

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
/*!****************************!*\
  !*** ./src/cta-1/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/cta-1/block.json");
/**
 * CTA 01
 * ★ apiVersion 3 対応（2025-12-07）
 */




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var title = attributes.title,
      text = attributes.text,
      buttonText = attributes.buttonText,
      buttonUrl = attributes.buttonUrl,
      openInNewTab = attributes.openInNewTab,
      imageUrl = attributes.imageUrl,
      imageAlt = attributes.imageAlt,
      filterColor = attributes.filterColor,
      buttonBackgroundColor = attributes.buttonBackgroundColor,
      buttonBorderColor = attributes.buttonBorderColor,
      buttonBorderSize = attributes.buttonBorderSize,
      buttonMaxWidth = attributes.buttonMaxWidth,
      pcTextAlign = attributes.pcTextAlign,
      mobileTextAlign = attributes.mobileTextAlign,
      maxWidth = attributes.maxWidth,
      headingLevel = attributes.headingLevel;

    // 各種変更関数
    var onChangeTitle = function onChangeTitle(value) {
      return setAttributes({
        title: value
      });
    };
    var onChangeText = function onChangeText(value) {
      return setAttributes({
        text: value
      });
    };
    var onChangeButtonText = function onChangeButtonText(value) {
      return setAttributes({
        buttonText: value
      });
    };
    var onChangeButtonUrl = function onChangeButtonUrl(value) {
      return setAttributes({
        buttonUrl: value
      });
    };
    var onToggleOpenInNewTab = function onToggleOpenInNewTab() {
      return setAttributes({
        openInNewTab: !openInNewTab
      });
    };
    var onSelectImage = function onSelectImage(newImage) {
      return setAttributes({
        imageUrl: newImage.sizes.full.url,
        imageAlt: newImage.alt
      });
    };
    var onChangeImageAlt = function onChangeImageAlt(value) {
      return setAttributes({
        imageAlt: value
      });
    };
    var onChangeFilterColor = function onChangeFilterColor(value) {
      return setAttributes({
        filterColor: value
      });
    };
    var onChangeButtonBackgroundColor = function onChangeButtonBackgroundColor(value) {
      return setAttributes({
        buttonBackgroundColor: value
      });
    };
    var onChangeButtonBorderColor = function onChangeButtonBorderColor(value) {
      return setAttributes({
        buttonBorderColor: value
      });
    };
    var onChangeButtonBorderSize = function onChangeButtonBorderSize(value) {
      return setAttributes({
        buttonBorderSize: value
      });
    };
    var onChangeButtonMaxWidth = function onChangeButtonMaxWidth(value) {
      return setAttributes({
        buttonMaxWidth: value
      });
    };
    var onChangePcTextAlign = function onChangePcTextAlign(value) {
      return setAttributes({
        pcTextAlign: value
      });
    };
    var onChangeMobileTextAlign = function onChangeMobileTextAlign(value) {
      return setAttributes({
        mobileTextAlign: value
      });
    };
    var onChangeMaxWidth = function onChangeMaxWidth(value) {
      return setAttributes({
        maxWidth: value
      });
    };
    var onResetMaxWidth = function onResetMaxWidth() {
      return setAttributes({
        maxWidth: 0
      });
    };
    var onChangeHeadingLevel = function onChangeHeadingLevel(newLevel) {
      return setAttributes({
        headingLevel: newLevel
      });
    };

    // 見出しタグ名を動的に決定
    var TagName = "h".concat(headingLevel);

    // useBlockProps で apiVersion 3 対応
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "wp-block-wdl-cta-1 ".concat(maxWidth > 0 ? 'max_w' : ''),
      style: maxWidth > 0 ? {
        maxWidth: maxWidth + 'px'
      } : {}
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, null, [1, 2, 3].map(function (level) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: level,
        isPressed: headingLevel === level,
        onClick: function onClick() {
          return onChangeHeadingLevel(level);
        }
      }, "H".concat(level));
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u6A2A\u5E45\u306E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDCD0 \u6700\u5927\u6A2A\u5E45\u306E\u8A2D\u5B9A"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45 ".concat(maxWidth > 0 ? "(".concat(maxWidth, "px)") : '(未設定)'),
      value: maxWidth,
      onChange: onChangeMaxWidth,
      min: 800,
      max: 1600,
      help: "\u30D6\u30ED\u30C3\u30AF\u5168\u4F53\u306E\u6700\u5927\u6A2A\u5E45\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u30020\u3067\u672A\u8A2D\u5B9A\u72B6\u614B\u306B\u306A\u308A\u307E\u3059\u3002"
    }), maxWidth > 0 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: onResetMaxWidth,
      style: {
        marginTop: '10px'
      }
    }, "\uD83D\uDD04 \u30EA\u30BB\u30C3\u30C8"))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EA\u30F3\u30AF\u306E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AF\u5148URL",
      value: buttonUrl,
      onChange: onChangeButtonUrl
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30EA\u30F3\u30AF\u3092\u65B0\u898F\u30BF\u30D6\u3067\u958B\u304F",
      checked: openInNewTab,
      onChange: onToggleOpenInNewTab
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u306E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onSelectImage,
      allowedTypes: "image",
      value: imageUrl,
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, imageUrl && /*#__PURE__*/React.createElement("img", {
          src: imageUrl,
          alt: imageAlt,
          style: {
            width: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          className: "button",
          style: {
            marginTop: '10px'
          }
        }, "\u753B\u50CF\u3092\u5909\u66F4"));
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u753B\u50CF\u306Ealt\u30C6\u30AD\u30B9\u30C8",
      value: imageAlt,
      onChange: onChangeImageAlt
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: filterColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeFilterColor(value.hex);
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EA\u30F3\u30AF\u30DC\u30BF\u30F3\u306E\u8272\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: buttonBackgroundColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeButtonBackgroundColor(value.hex);
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: buttonBorderColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeButtonBorderColor(value.hex);
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u306E\u30B5\u30A4\u30BA (px)",
      value: buttonBorderSize,
      onChange: onChangeButtonBorderSize,
      min: 0,
      max: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30EA\u30F3\u30AF\u30DC\u30BF\u30F3\u306E\u6700\u5927\u6A2A\u5E45 (px)",
      value: buttonMaxWidth,
      onChange: onChangeButtonMaxWidth,
      min: 50,
      max: 500
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30C6\u30AD\u30B9\u30C8\u306E\u914D\u7F6E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "PC\u3067\u306E\u30C6\u30AD\u30B9\u30C8\u914D\u7F6E",
      value: pcTextAlign,
      options: [{
        label: '中央寄せ',
        value: 'center'
      }, {
        label: '左寄せ',
        value: 'left'
      }],
      onChange: onChangePcTextAlign
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30B9\u30DE\u30DB\u3067\u306E\u30C6\u30AD\u30B9\u30C8\u914D\u7F6E",
      value: mobileTextAlign,
      options: [{
        label: '中央寄せ',
        value: 'center'
      }, {
        label: '左寄せ',
        value: 'left'
      }],
      onChange: onChangeMobileTextAlign
    }))), /*#__PURE__*/React.createElement("div", {
      className: "cta-1__inner"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: TagName,
      className: "cta-1__title heading_style_reset",
      value: title,
      onChange: onChangeTitle,
      placeholder: "\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "cta-1__text ".concat(pcTextAlign === 'left' ? 'text_align_pc_left' : '', " ").concat(mobileTextAlign === 'left' ? 'text_align_sp_left' : ''),
      value: text,
      onChange: onChangeText,
      placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "a",
      className: "cta-1__button",
      value: buttonText,
      onChange: onChangeButtonText,
      placeholder: "\u30DC\u30BF\u30F3\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B",
      href: buttonUrl,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      style: {
        backgroundColor: buttonBackgroundColor,
        borderColor: buttonBorderColor,
        borderWidth: buttonBorderSize + 'px',
        borderStyle: 'solid',
        maxWidth: buttonMaxWidth + 'px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "cta-1__image"
    }, imageUrl && /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
      alt: imageAlt,
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: filterColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }
    })));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var title = attributes.title,
      text = attributes.text,
      buttonText = attributes.buttonText,
      buttonUrl = attributes.buttonUrl,
      openInNewTab = attributes.openInNewTab,
      imageUrl = attributes.imageUrl,
      imageAlt = attributes.imageAlt,
      filterColor = attributes.filterColor,
      buttonBackgroundColor = attributes.buttonBackgroundColor,
      buttonBorderColor = attributes.buttonBorderColor,
      buttonBorderSize = attributes.buttonBorderSize,
      buttonMaxWidth = attributes.buttonMaxWidth,
      pcTextAlign = attributes.pcTextAlign,
      mobileTextAlign = attributes.mobileTextAlign,
      maxWidth = attributes.maxWidth,
      headingLevel = attributes.headingLevel;

    // 見出しタグ名を動的に決定
    var TagName = "h".concat(headingLevel);

    // useBlockProps.save() で apiVersion 3 対応
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "wp-block-wdl-cta-1 ".concat(maxWidth > 0 ? 'max_w' : ''),
      style: maxWidth > 0 ? {
        maxWidth: maxWidth + 'px'
      } : {}
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "cta-1__inner"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: TagName,
      className: "cta-1__title heading_style_reset",
      value: title
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "cta-1__text ".concat(pcTextAlign === 'left' ? 'text_align_pc_left' : '', " ").concat(mobileTextAlign === 'left' ? 'text_align_sp_left' : ''),
      value: text
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "a",
      className: "cta-1__button",
      href: buttonUrl,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      value: buttonText,
      style: {
        backgroundColor: buttonBackgroundColor,
        borderColor: buttonBorderColor,
        borderWidth: buttonBorderSize + 'px',
        borderStyle: 'solid',
        maxWidth: buttonMaxWidth + 'px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "cta-1__image"
    }, imageUrl && /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
      alt: imageAlt,
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: filterColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }
    })));
  }
});
/******/ })()
;