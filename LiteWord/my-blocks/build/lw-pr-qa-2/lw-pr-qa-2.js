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

/***/ "./src/lw-pr-qa-2/block.json":
/*!***********************************!*\
  !*** ./src/lw-pr-qa-2/block.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-qa-2","version":"1.0.0","title":"Q&A 02","category":"lw-faq","icon":"format-chat","description":"Q&Aブロック。質問と回答を画像付きで表示。","aiHint":{"description":"Q&A（画像付き）。質問者・回答者の画像+吹き出し形式。子ブロックを並べて作るのでAI直接生成は非推奨","excludeFromAutoSelect":true,"excludeReason":"子ブロック（lw-pr-qa-2-item）を並べないと中身が入らないため。テンプレート経由で使う","contentAttributes":[],"imageAttributes":[],"notes":"このブロックは親子構造。親（lw-pr-qa-2）は入れ物で、テキストも画像も持たない。中身は子ブロック wdl/lw-pr-qa-2-item を並べて作る。子は qImage（質問者の絵）/ qText（質問文）/ aImage（回答者の絵）/ useOneColumn を属性で持ち、回答の本文だけ子の InnerBlocks（core/paragraph）に入れる。Q&A 1件につき子1つ。⚠️ 子には独立したディレクトリが無く、親の js が親子とも registerBlockType している。build/lw-pr-qa-2-item を探しても無いので、存在しないブロックだと誤判定しないこと。⚠️ 質問文の色（青）とアイコンの寸法は CSS 固定で、属性では変えられない。⚠️ 既定の画像は placehold.jp（他社CDN）なので、テンプレートやサンプルでは必ず自前の画像URLを渡すこと。🚨 **質問文の色は CSS に #3c7fc3 が直書き**されていて、長らく変えられなかった。この色は白地でも 4.03:1 しか出ず、**ふつうの文字サイズでは 4.5:1 に届かない**。→ 2026-09-07 に `qTextColor` を足した（空のときは従来どおり #3c7fc3）。淡い地の上に置くときは、ページの濃い色を渡してコントラストを確保すること。"},"supports":{"anchor":true,"className":true},"attributes":{"maxWidth":{"type":"number","default":0},"qImageBorderColor":{"type":"string","default":"#3c7fc3"},"qTextBg":{"type":"string","default":"#eaf4ff"},"qTextFontSizePc":{"type":"number","default":24},"qTextFontSizeSp":{"type":"number","default":16},"aImageBorderColor":{"type":"string","default":"#3c7fc3"},"qTextColor":{"type":"string","default":""}},"editorScript":"file:./lw-pr-qa-2.js","no":2}');

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
/*!*********************************!*\
  !*** ./src/lw-pr-qa-2/index.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-qa-2/block.json");
/**
 * LiteWord - Q&A 02
 * ------------------------------------------------------------
 *  - 親ブロック: wdl/lw-pr-qa-2
 *  - 子ブロック: wdl/lw-pr-qa-2-item
 * ----------------------------------------------------------- */





// 子ブロックのみ許可
var ALLOWED_BLOCKS = ["wdl/lw-pr-qa-2-item"];

// 初期テンプレート（1つのQ&Aアイテム）
var TEMPLATE = [["wdl/lw-pr-qa-2-item", {}]];

// 回答エリアのテンプレート（段落ブロック）
var ANSWER_TEMPLATE = [["core/paragraph", {}]];

// デフォルト画像
var DEFAULT_Q_IMAGE = "https://placehold.jp/3c7fc3/ffffff/200x200.png?text=No Image";
var DEFAULT_A_IMAGE = "https://placehold.jp/f59e0b/ffffff/200x200.png?text=No Image";

/* =========================================
   子ブロック: Q&A Item
========================================= */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("wdl/lw-pr-qa-2-item", {
  title: "Q&A 02 Item",
  category: "lw-qa",
  icon: "format-chat",
  description: "Q&A 02のアイテムブロック",
  parent: ["wdl/lw-pr-qa-2"],
  supports: {
    anchor: true,
    className: true
  },
  attributes: {
    qImage: {
      type: "string",
      "default": DEFAULT_Q_IMAGE
    },
    qText: {
      type: "string",
      "default": "ここに質問を入力してください"
    },
    aImage: {
      type: "string",
      "default": DEFAULT_A_IMAGE
    },
    useOneColumn: {
      type: "boolean",
      "default": false
    }
  },
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var qImage = attributes.qImage,
      qText = attributes.qText,
      aImage = attributes.aImage,
      useOneColumn = attributes.useOneColumn;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "lw-pr-qa-2__wrap__inner"
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "Q&A \u30A2\u30A4\u30C6\u30E0\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u8CEA\u554F\u5074\u306E\u753B\u50CF"), qImage && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "10px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: qImage,
      alt: "\u8CEA\u554F\u753B\u50CF",
      style: {
        width: "100px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "50%",
        border: "1px solid #ccc"
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          qImage: media.url
        });
      },
      allowedTypes: ["image"],
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            gap: "8px",
            marginBottom: "16px"
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: open
        }, "\u753B\u50CF\u3092\u9078\u629E"), qImage && qImage !== DEFAULT_Q_IMAGE && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: function onClick() {
            return setAttributes({
              qImage: DEFAULT_Q_IMAGE
            });
          }
        }, "\u30EA\u30BB\u30C3\u30C8"));
      }
    })), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u56DE\u7B54\u5074\u306E\u753B\u50CF"), aImage && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "10px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: aImage,
      alt: "\u56DE\u7B54\u753B\u50CF",
      style: {
        width: "100px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "50%",
        border: "1px solid #ccc"
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          aImage: media.url
        });
      },
      allowedTypes: ["image"],
      render: function render(_ref3) {
        var open = _ref3.open;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            gap: "8px",
            marginBottom: "16px"
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: open
        }, "\u753B\u50CF\u3092\u9078\u629E"), aImage && aImage !== DEFAULT_A_IMAGE && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: function onClick() {
            return setAttributes({
              aImage: DEFAULT_A_IMAGE
            });
          }
        }, "\u30EA\u30BB\u30C3\u30C8"));
      }
    })), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u56DE\u7B54\u30921\u30AB\u30E9\u30E0\u306B\u3059\u308B",
      checked: useOneColumn,
      onChange: function onChange(value) {
        return setAttributes({
          useOneColumn: value
        });
      },
      help: "ON\u306B\u3059\u308B\u3068\u56DE\u7B54\u30A8\u30EA\u30A2\u304C1\u30AB\u30E9\u30E0\u306B\u306A\u308A\u307E\u3059"
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__q_wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__q_image"
    }, /*#__PURE__*/React.createElement("img", {
      src: qImage,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__q_text"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "text",
      value: qText,
      onChange: function onChange(value) {
        return setAttributes({
          qText: value
        });
      },
      placeholder: "\u8CEA\u554F\u3092\u5165\u529B..."
    }))), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__a_wrap".concat(useOneColumn ? " clm_1" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__a_text"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
      template: ANSWER_TEMPLATE,
      renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__a_image"
    }, /*#__PURE__*/React.createElement("img", {
      src: aImage,
      alt: ""
    })))));
  },
  save: function save(_ref4) {
    var attributes = _ref4.attributes;
    var qImage = attributes.qImage,
      qText = attributes.qText,
      aImage = attributes.aImage,
      useOneColumn = attributes.useOneColumn;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "lw-pr-qa-2__wrap__inner"
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("dt", {
      className: "lw-pr-qa-2__q_wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__q_image"
    }, /*#__PURE__*/React.createElement("img", {
      src: qImage,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__q_text"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "text",
      value: qText
    }))), /*#__PURE__*/React.createElement("dd", {
      className: "lw-pr-qa-2__a_wrap".concat(useOneColumn ? " clm_1" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__a_text"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)), /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__a_image"
    }, /*#__PURE__*/React.createElement("img", {
      src: aImage,
      alt: ""
    }))));
  }
});

/* =========================================
   親ブロック: Q&A 02
========================================= */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: function edit(_ref5) {
    var attributes = _ref5.attributes,
      setAttributes = _ref5.setAttributes;
    var maxWidth = attributes.maxWidth,
      qImageBorderColor = attributes.qImageBorderColor,
      qTextBg = attributes.qTextBg,
      qTextColor = attributes.qTextColor,
      qTextFontSizePc = attributes.qTextFontSizePc,
      qTextFontSizeSp = attributes.qTextFontSizeSp,
      aImageBorderColor = attributes.aImageBorderColor;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "lw-pr-qa-2",
      style: {
        "--qa-2-max-w": maxWidth === 0 ? "100%" : "".concat(maxWidth, "px"),
        "--qa-2-dt-image-bd-color": qImageBorderColor,
        "--qa-2-dt-text-bg": qTextBg,
        /* 🚨 空のときはキーごと出さない（undefined は書き出されない）。
           既定のページの保存HTMLを1文字も変えないため。 */
        "--qa-2-dt-text-color": qTextColor || undefined,
        "--qa-2-dt-text-fontsize-pc": "".concat(qTextFontSizePc, "px"),
        "--qa-2-dt-text-fontsize-sp": "".concat(qTextFontSizeSp, "px"),
        "--qa-2-dd-image-bd-color": aImageBorderColor
      }
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 (px)",
      value: maxWidth,
      onChange: function onChange(value) {
        return setAttributes({
          maxWidth: value
        });
      },
      min: 0,
      max: 1300,
      step: 10,
      help: "0\u3067100%\uFF08\u672A\u8A2D\u5B9A\uFF09\u3001800\u301C1300px\u3067\u6307\u5B9A",
      marks: [{
        value: 0,
        label: "未設定"
      }, {
        value: 800,
        label: "800"
      }, {
        value: 1300,
        label: "1300"
      }]
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8CEA\u554F\u5074\u306E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u753B\u50CF\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: qImageBorderColor,
      onChange: function onChange(color) {
        return setAttributes({
          qImageBorderColor: color || "#3c7fc3"
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
    }, "\u30C6\u30AD\u30B9\u30C8\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: qTextBg,
      onChange: function onChange(color) {
        return setAttributes({
          qTextBg: color || "#eaf4ff"
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
    }, "\u8CEA\u554F\u306E\u6587\u5B57\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: qTextColor,
      onChange: function onChange(color) {
        return setAttributes({
          qTextColor: color || ""
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
    }, "\u30C6\u30AD\u30B9\u30C8\u30B5\u30A4\u30BA"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC (px)",
      value: qTextFontSizePc,
      onChange: function onChange(value) {
        return setAttributes({
          qTextFontSizePc: value
        });
      },
      min: 14,
      max: 40,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (px)",
      value: qTextFontSizeSp,
      onChange: function onChange(value) {
        return setAttributes({
          qTextFontSizeSp: value
        });
      },
      min: 12,
      max: 24,
      step: 1
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u56DE\u7B54\u5074\u306E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u753B\u50CF\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: aImageBorderColor,
      onChange: function onChange(color) {
        return setAttributes({
          aImageBorderColor: color || "#3c7fc3"
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-qa-2__wrap"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender
    }))));
  },
  save: function save(_ref6) {
    var attributes = _ref6.attributes;
    var maxWidth = attributes.maxWidth,
      qImageBorderColor = attributes.qImageBorderColor,
      qTextBg = attributes.qTextBg,
      qTextColor = attributes.qTextColor,
      qTextFontSizePc = attributes.qTextFontSizePc,
      qTextFontSizeSp = attributes.qTextFontSizeSp,
      aImageBorderColor = attributes.aImageBorderColor;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "lw-pr-qa-2",
      style: {
        "--qa-2-max-w": maxWidth === 0 ? "100%" : "".concat(maxWidth, "px"),
        "--qa-2-dt-image-bd-color": qImageBorderColor,
        "--qa-2-dt-text-bg": qTextBg,
        /* 🚨 空のときはキーごと出さない（undefined は書き出されない）。
           既定のページの保存HTMLを1文字も変えないため。 */
        "--qa-2-dt-text-color": qTextColor || undefined,
        "--qa-2-dt-text-fontsize-pc": "".concat(qTextFontSizePc, "px"),
        "--qa-2-dt-text-fontsize-sp": "".concat(qTextFontSizeSp, "px"),
        "--qa-2-dd-image-bd-color": aImageBorderColor
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("dl", {
      className: "lw-pr-qa-2__wrap"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)));
  }
});
/******/ })()
;