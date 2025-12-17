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

/***/ "./src/shin-gas-station-01-cta/block.json":
/*!************************************************!*\
  !*** ./src/shin-gas-station-01-cta/block.json ***!
  \************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/shin-gas-station-01-cta","version":"1.0.0","title":"CTA 1 shin shop pattern 01","category":"lw-cta","icon":"megaphone","description":"テンプレート専用CTAブロック","supports":{"anchor":true},"attributes":{"title":{"type":"string","source":"html","selector":".shin-gas-station-01-cta__title .main","default":"採用情報"},"titleSub":{"type":"string","source":"html","selector":".shin-gas-station-01-cta__title .sub","default":"Recruit"},"text":{"type":"string","source":"html","selector":"p","default":"地域社会を支え、移動の快適さと安心を提供するDriveEaseでは、未来を共に創る仲間を募集しています。<br>私たちは、ガソリンスタンド事業や車両リース事業を通じて、人々の暮らしをより豊かにすることを目指しています。<br>新しい挑戦を続ける当社で、あなたの力を活かしてみませんか？"},"buttonText":{"type":"string","source":"html","selector":"a","default":"詳しく見る"},"buttonUrl":{"type":"string","default":"#"},"openInNewTab":{"type":"boolean","default":false},"imageUrl":{"type":"string","source":"attribute","selector":"img","attribute":"src","default":""},"filterColor":{"type":"string","default":"#054161"},"buttonBackgroundColor":{"type":"string","default":"#fff"},"buttonBorderColor":{"type":"string","default":"var(--color-main)"},"buttonBorderSize":{"type":"number","default":1},"buttonMaxWidth":{"type":"number","default":240},"pcTextAlign":{"type":"string","default":"center"},"mobileTextAlign":{"type":"string","default":"left"}},"editorScript":"file:./shin-gas-station-01-cta.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":15}');

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
/*!**********************************************!*\
  !*** ./src/shin-gas-station-01-cta/index.js ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/shin-gas-station-01-cta/block.json");
/**
 * CTA 1 shin shop pattern 01
 * ★ apiVersion 3 対応（2025-12-07）
 */




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var title = attributes.title,
      titleSub = attributes.titleSub,
      text = attributes.text,
      buttonText = attributes.buttonText,
      buttonUrl = attributes.buttonUrl,
      openInNewTab = attributes.openInNewTab,
      imageUrl = attributes.imageUrl,
      filterColor = attributes.filterColor,
      buttonBackgroundColor = attributes.buttonBackgroundColor,
      buttonBorderColor = attributes.buttonBorderColor,
      buttonBorderSize = attributes.buttonBorderSize,
      buttonMaxWidth = attributes.buttonMaxWidth,
      pcTextAlign = attributes.pcTextAlign,
      mobileTextAlign = attributes.mobileTextAlign;
    // 各種変更関数
    var onChangeTitle = function onChangeTitle(value) {
      return setAttributes({
        title: value
      });
    };
    var onChangeTitleSub = function onChangeTitleSub(value) {
      return setAttributes({
        titleSub: value
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
        imageUrl: newImage.sizes.full.url
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

    // useBlockProps で apiVersion 3 対応
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'shin-gas-station-01-cta'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
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
      title: "\u80CC\u666F\u753B\u50CF\u306E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onSelectImage,
      allowedTypes: "image",
      value: imageUrl,
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, imageUrl && /*#__PURE__*/React.createElement("img", {
          src: imageUrl,
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
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u753B\u50CF\u306E\u4E0A\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: filterColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeFilterColor(value.hex);
      }
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
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EA\u30F3\u30AF\u30DC\u30BF\u30F3\u306E\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u306E\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: buttonBackgroundColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeButtonBackgroundColor(value.hex);
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u306E\u30DC\u30FC\u30C0\u30FC\u306E\u8272\uFF08\u5916\u67A0\uFF09"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: buttonBorderColor,
      onChangeComplete: function onChangeComplete(value) {
        return onChangeButtonBorderColor(value.hex);
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u306E\u592A\u3055 (px)",
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
    }))), /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-cta__inner"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "shin-gas-station-01-cta__title heading_style_reset"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: title,
      onChange: onChangeTitle,
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: titleSub,
      onChange: onChangeTitleSub,
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "shin-gas-station-01-cta__text ".concat(pcTextAlign === 'left' ? 'text_align_pc_left' : '', " ").concat(mobileTextAlign === 'left' ? 'text_align_sp_left' : ''),
      value: text,
      onChange: onChangeText,
      placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "a",
      className: "shin-gas-station-01-cta__button",
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
      className: "shin-gas-station-01-cta__image"
    }, imageUrl && /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
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
      titleSub = attributes.titleSub,
      text = attributes.text,
      buttonText = attributes.buttonText,
      buttonUrl = attributes.buttonUrl,
      openInNewTab = attributes.openInNewTab,
      imageUrl = attributes.imageUrl,
      filterColor = attributes.filterColor,
      buttonBackgroundColor = attributes.buttonBackgroundColor,
      buttonBorderColor = attributes.buttonBorderColor,
      buttonBorderSize = attributes.buttonBorderSize,
      buttonMaxWidth = attributes.buttonMaxWidth,
      pcTextAlign = attributes.pcTextAlign,
      mobileTextAlign = attributes.mobileTextAlign;

    // useBlockProps.save() で apiVersion 3 対応
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'shin-gas-station-01-cta'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-cta__inner"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "shin-gas-station-01-cta__title heading_style_reset"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: title
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: titleSub
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "shin-gas-station-01-cta__text ".concat(pcTextAlign === 'left' ? 'text_align_pc_left' : '', " ").concat(mobileTextAlign === 'left' ? 'text_align_sp_left' : ''),
      value: text
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "a",
      className: "shin-gas-station-01-cta__button",
      href: buttonUrl,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      value: buttonText,
      style: {
        borderWidth: buttonBorderSize + 'px',
        borderStyle: 'solid',
        maxWidth: buttonMaxWidth + 'px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "shin-gas-station-01-cta__image"
    }, imageUrl && /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
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
    })), /*#__PURE__*/React.createElement("style", null, "\n\t\t\t\t\t.shin-gas-station-01-cta__button{\n                        background-color: ".concat(buttonBackgroundColor, ";\n\n\t\t\t\t\t\tcolor: ").concat(buttonBorderColor, ";\n                        border-color: ").concat(buttonBorderColor, ";\n\t\t\t\t\t}\n\t\t\t\t\t.shin-gas-station-01-cta__button:hover{\n\t\t\t\t\t\tcolor: #fff;\n                        background-color: ").concat(buttonBorderColor, ";\n\t\t\t\t\t}\n\n\t\t\t\t")));
  }
});
/******/ })()
;