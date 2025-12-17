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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./src/paid-block-cta-4/block.json":
/*!*****************************************!*\
  !*** ./src/paid-block-cta-4/block.json ***!
  \*****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-cta-4","version":"1.0.0","title":"CTA 04","category":"lw-cta","icon":"megaphone","description":"2カラムCTAブロック（有料）","supports":{"anchor":true},"attributes":{"linkUrl1":{"type":"string","default":""},"mainTitle1":{"type":"string","default":"Franchise"},"subTitle1":{"type":"string","default":"加盟店募集"},"desc1":{"type":"string","default":"独立を応援！フランチャイズ加盟しませんか？"},"backgroundImage1":{"type":"string","default":"https://lite-word.com/sample_img/shop/1.webp"},"filterColor1":{"type":"string","default":"rgba(38,129,147,1)"},"filterOpacity1":{"type":"number","default":60},"btnText1":{"type":"string","default":"詳細はこちら"},"bgColor1":{"type":"string","default":"#d88d00"},"textColor1":{"type":"string","default":"#ffffff"},"linkUrl2":{"type":"string","default":""},"mainTitle2":{"type":"string","default":"Recruit"},"subTitle2":{"type":"string","default":"求人情報"},"desc2":{"type":"string","default":"◯では、一緒に働くスタッフを全店で募集しております！"},"backgroundImage2":{"type":"string","default":"https://lite-word.com/sample_img/shop/5.webp"},"filterColor2":{"type":"string","default":"#690707"},"filterOpacity2":{"type":"number","default":60},"btnText2":{"type":"string","default":"詳細はこちら"},"bgColor2":{"type":"string","default":"#F02D2D"},"textColor2":{"type":"string","default":"#ffffff"},"maxWidth":{"type":"number","default":0}},"editorScript":"file:./paid-block-cta-4.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":4}');

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
/*!***************************************!*\
  !*** ./src/paid-block-cta-4/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-cta-4/block.json");
/**
 * CTA 04
 * ★ apiVersion 3 対応（2025-12-07）
 */





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * =========================================
   * エディター(編集)用の表示
   * =========================================
   */
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var linkUrl1 = attributes.linkUrl1,
      mainTitle1 = attributes.mainTitle1,
      subTitle1 = attributes.subTitle1,
      desc1 = attributes.desc1,
      backgroundImage1 = attributes.backgroundImage1,
      filterColor1 = attributes.filterColor1,
      filterOpacity1 = attributes.filterOpacity1,
      btnText1 = attributes.btnText1,
      bgColor1 = attributes.bgColor1,
      textColor1 = attributes.textColor1,
      linkUrl2 = attributes.linkUrl2,
      mainTitle2 = attributes.mainTitle2,
      subTitle2 = attributes.subTitle2,
      desc2 = attributes.desc2,
      backgroundImage2 = attributes.backgroundImage2,
      filterColor2 = attributes.filterColor2,
      filterOpacity2 = attributes.filterOpacity2,
      btnText2 = attributes.btnText2,
      bgColor2 = attributes.bgColor2,
      textColor2 = attributes.textColor2,
      maxWidth = attributes.maxWidth;

    // === 画像変更ハンドラ ===
    var onChangeBgImage1 = function onChangeBgImage1(media) {
      setAttributes({
        backgroundImage1: media.url
      });
    };
    var onChangeBgImage2 = function onChangeBgImage2(media) {
      setAttributes({
        backgroundImage2: media.url
      });
    };

    // === 最大横幅設定ハンドラ ===
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

    // useBlockProps で apiVersion 3 対応
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "paid-block-cta-4 ".concat(maxWidth > 0 ? 'max_w' : ''),
      style: maxWidth > 0 ? {
        maxWidth: maxWidth + 'px'
      } : {}
    });

    // === カラー設定用サンプル ===
    var colors = [{
      name: '青',
      color: '#268193'
    }, {
      name: '赤',
      color: '#d00000'
    }, {
      name: '緑',
      color: '#008000'
    }, {
      name: '白',
      color: '#ffffff'
    }, {
      name: '黒',
      color: '#000000'
    }];
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
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
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=NAqO2JgjzBo",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089"))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "CTA1\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AF\u5148URL",
      value: linkUrl1,
      onChange: function onChange(value) {
        return setAttributes({
          linkUrl1: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onChangeBgImage1,
      allowedTypes: ['image'],
      value: backgroundImage1,
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, backgroundImage1 && /*#__PURE__*/React.createElement("img", {
          src: backgroundImage1,
          alt: "",
          style: {
            width: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary",
          style: {
            marginTop: '8px'
          }
        }, "\u80CC\u666F\u753B\u50CF\u3092\u9078\u629E"), backgroundImage1 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              backgroundImage1: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '8px'
          }
        }, "\u524A\u9664"));
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u30D5\u30A3\u30EB\u30BF\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: filterColor1,
      onChange: function onChange(color) {
        return setAttributes({
          filterColor1: color
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30D5\u30A3\u30EB\u30BF\u30FC\u4E0D\u900F\u660E\u5EA6 (".concat(filterOpacity1, "%)"),
      value: filterOpacity1,
      onChange: function onChange(value) {
        return setAttributes({
          filterOpacity1: value
        });
      },
      min: 0,
      max: 100
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: bgColor1,
      onChange: function onChange(color) {
        return setAttributes({
          bgColor1: color
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u6587\u5B57\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: textColor1,
      onChange: function onChange(color) {
        return setAttributes({
          textColor1: color
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "CTA2\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AF\u5148URL",
      value: linkUrl2,
      onChange: function onChange(value) {
        return setAttributes({
          linkUrl2: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onChangeBgImage2,
      allowedTypes: ['image'],
      value: backgroundImage2,
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, backgroundImage2 && /*#__PURE__*/React.createElement("img", {
          src: backgroundImage2,
          alt: "",
          style: {
            width: '100%',
            height: 'auto'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary",
          style: {
            marginTop: '8px'
          }
        }, "\u80CC\u666F\u753B\u50CF\u3092\u9078\u629E"), backgroundImage2 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              backgroundImage2: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '8px'
          }
        }, "\u524A\u9664"));
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u30D5\u30A3\u30EB\u30BF\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: filterColor2,
      onChange: function onChange(color) {
        return setAttributes({
          filterColor2: color
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30D5\u30A3\u30EB\u30BF\u30FC\u4E0D\u900F\u660E\u5EA6 (".concat(filterOpacity2, "%)"),
      value: filterOpacity2,
      onChange: function onChange(value) {
        return setAttributes({
          filterOpacity2: value
        });
      },
      min: 0,
      max: 100
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: bgColor2,
      onChange: function onChange(color) {
        return setAttributes({
          bgColor2: color
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DC\u30BF\u30F3\u6587\u5B57\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      colors: colors,
      value: textColor2,
      onChange: function onChange(color) {
        return setAttributes({
          textColor2: color
        });
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "paid-block-cta-4__inner"
    }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
      className: "a"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: mainTitle1,
      onChange: function onChange(value) {
        return setAttributes({
          mainTitle1: value
        });
      },
      placeholder: "Recruit"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: subTitle1,
      onChange: function onChange(value) {
        return setAttributes({
          subTitle1: value
        });
      },
      placeholder: "\u30B5\u30D6\u30C6\u30AD\u30B9\u30C8"
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: desc1,
      onChange: function onChange(value) {
        return setAttributes({
          desc1: value
        });
      },
      placeholder: "\u25EF\u3067\u306F\u3001\u4E00\u7DD2\u306B\u50CD\u304F\u30B9\u30BF\u30C3\u30D5\u3092..."
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "div",
      value: btnText1,
      onChange: function onChange(value) {
        return setAttributes({
          btnText1: value
        });
      },
      placeholder: "\u8A73\u7D30\u306F\u3053\u3061\u3089",
      style: {
        color: textColor1
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor1
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5 \r 12.5 32.8 0 45.3l-192 192c-12.5 \r 12.5-32.8 12.5-45.3 0s-12.5-32.8 \r 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 \r 0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor1,
        opacity: filterOpacity1 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage1 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage1,
      alt: "CTA1\u80CC\u666F"
    }))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
      className: "a"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: mainTitle2,
      onChange: function onChange(value) {
        return setAttributes({
          mainTitle2: value
        });
      },
      placeholder: "Contact"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: subTitle2,
      onChange: function onChange(value) {
        return setAttributes({
          subTitle2: value
        });
      },
      placeholder: "\u30B5\u30D6\u30C6\u30AD\u30B9\u30C8"
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: desc2,
      onChange: function onChange(value) {
        return setAttributes({
          desc2: value
        });
      },
      placeholder: "\u25EF\u3067\u306F\u3001\u4E00\u7DD2\u306B\u50CD\u304F\u30B9\u30BF\u30C3\u30D5\u3092..."
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "div",
      value: btnText2,
      onChange: function onChange(value) {
        return setAttributes({
          btnText2: value
        });
      },
      placeholder: "\u8A73\u7D30\u306F\u3053\u3061\u3089",
      style: {
        color: textColor2
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor2
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5 \r 12.5 32.8 0 45.3l-192 192c-12.5 \r 12.5-32.8 12.5-45.3 0s-12.5-32.8 \r 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 \r 0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor2
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor2,
        opacity: filterOpacity2 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage2 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage2,
      alt: "CTA2\u80CC\u666F"
    }))))));
  },
  /**
   * =========================================
   * 保存時(フロントエンド)用の表示
   * =========================================
   */
  save: function save(props) {
    var attributes = props.attributes;
    var linkUrl1 = attributes.linkUrl1,
      mainTitle1 = attributes.mainTitle1,
      subTitle1 = attributes.subTitle1,
      desc1 = attributes.desc1,
      backgroundImage1 = attributes.backgroundImage1,
      filterColor1 = attributes.filterColor1,
      filterOpacity1 = attributes.filterOpacity1,
      btnText1 = attributes.btnText1,
      bgColor1 = attributes.bgColor1,
      textColor1 = attributes.textColor1,
      linkUrl2 = attributes.linkUrl2,
      mainTitle2 = attributes.mainTitle2,
      subTitle2 = attributes.subTitle2,
      desc2 = attributes.desc2,
      backgroundImage2 = attributes.backgroundImage2,
      filterColor2 = attributes.filterColor2,
      filterOpacity2 = attributes.filterOpacity2,
      btnText2 = attributes.btnText2,
      bgColor2 = attributes.bgColor2,
      textColor2 = attributes.textColor2,
      maxWidth = attributes.maxWidth;

    // useBlockProps.save() で apiVersion 3 対応
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "paid-block-cta-4 ".concat(maxWidth > 0 ? 'max_w' : ''),
      style: maxWidth > 0 ? {
        maxWidth: maxWidth + 'px'
      } : {}
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: linkUrl1 || '#'
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: mainTitle1
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: subTitle1
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: desc1
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "div",
      value: btnText1,
      style: {
        color: textColor1
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor1
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5 \r 12.5 32.8 0 45.3l-192 192c-12.5 \r 12.5-32.8 12.5-45.3 0s-12.5-32.8 \r 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 \r 0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor1,
        color: textColor1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor1,
        opacity: filterOpacity1 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage1 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage1,
      alt: "CTA1\u80CC\u666F"
    }))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: linkUrl2 || '#'
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl parts_page_ttl_main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "main",
      "data-lw_font_set": "Lato"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: mainTitle2
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: subTitle2
    }))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      value: desc2
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "div",
      value: btnText2,
      style: {
        color: textColor2
      }
    }), /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      style: {
        fill: textColor2
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M342.6 233.4c12.5 12.5 \r 12.5 32.8 0 45.3l-192 192c-12.5 \r 12.5-32.8 12.5-45.3 0s-12.5-32.8 \r 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 \r 0-45.3s32.8-12.5 45.3 0l192 192z"
    })), /*#__PURE__*/React.createElement("div", {
      className: "btn_bg",
      style: {
        backgroundColor: bgColor2,
        color: textColor2
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "this_filter",
      style: {
        background: filterColor2,
        opacity: filterOpacity2 + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bg_img"
    }, backgroundImage2 && /*#__PURE__*/React.createElement("img", {
      src: backgroundImage2,
      alt: "CTA2\u80CC\u666F"
    })))));
  }
});
/******/ })()
;