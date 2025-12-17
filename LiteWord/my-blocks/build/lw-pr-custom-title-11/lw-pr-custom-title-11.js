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

/***/ "./src/lw-pr-custom-title-11/block.json":
/*!**********************************************!*\
  !*** ./src/lw-pr-custom-title-11/block.json ***!
  \**********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-custom-title-11","version":"1.0.0","title":"見出しタイトル 11","category":"lw-heading","icon":"editor-textcolor","description":"カスタムカラー対応見出しブロック","supports":{"anchor":true},"attributes":{"mainTitle":{"type":"string","default":"カスタムタイトル"},"subTitle":{"type":"string","default":"サブタイトル"},"headingLevel":{"type":"number","default":2},"colorMain":{"type":"string","default":"#0a71c0"},"colorMainText":{"type":"string","default":""},"colorSubText":{"type":"string","default":""},"orderReversed":{"type":"boolean","default":false},"maxWidth":{"type":"number","default":0},"borderRadius":{"type":"number","default":0},"minHeightPc":{"type":"number","default":0},"minHeightTb":{"type":"number","default":0},"minHeightSp":{"type":"number","default":0}},"editorScript":"file:./lw-pr-custom-title-11.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":11}');

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
/*!********************************************!*\
  !*** ./src/lw-pr-custom-title-11/index.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-custom-title-11/block.json");
/**
 * LiteWord – 見出しタイトル 11
 * カスタムブロック
 * ★ apiVersion 3 対応（2025-12-07）
 */





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /* ----------------------------------------------------------
   * 編集画面
   * -------------------------------------------------------- */
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      headingLevel = attributes.headingLevel,
      colorMain = attributes.colorMain,
      colorMainText = attributes.colorMainText,
      colorSubText = attributes.colorSubText,
      orderReversed = attributes.orderReversed,
      maxWidth = attributes.maxWidth,
      borderRadius = attributes.borderRadius,
      minHeightPc = attributes.minHeightPc,
      minHeightTb = attributes.minHeightTb,
      minHeightSp = attributes.minHeightSp;

    /* 変更ハンドラ */
    var onChangeMainTitle = function onChangeMainTitle(value) {
      return setAttributes({
        mainTitle: value
      });
    };
    var onChangeSubTitle = function onChangeSubTitle(value) {
      return setAttributes({
        subTitle: value
      });
    };
    var onChangeHeadingLevel = function onChangeHeadingLevel(level) {
      return setAttributes({
        headingLevel: level
      });
    };
    var onChangeColorMain = function onChangeColorMain(value) {
      return setAttributes({
        colorMain: value
      });
    };
    var onChangeColorMainText = function onChangeColorMainText(value) {
      return setAttributes({
        colorMainText: value
      });
    };
    var onChangeColorSubText = function onChangeColorSubText(value) {
      return setAttributes({
        colorSubText: value
      });
    };
    var onToggleOrder = function onToggleOrder() {
      return setAttributes({
        orderReversed: !orderReversed
      });
    };
    var onChangeMaxWidth = function onChangeMaxWidth(value) {
      return setAttributes({
        maxWidth: value === undefined ? 0 : value
      });
    };
    var onChangeBorderRadius = function onChangeBorderRadius(value) {
      return setAttributes({
        borderRadius: value === undefined ? 0 : value
      });
    };
    var onChangeMinHeightPc = function onChangeMinHeightPc(value) {
      return setAttributes({
        minHeightPc: value === undefined ? 0 : value
      });
    };
    var onChangeMinHeightTb = function onChangeMinHeightTb(value) {
      return setAttributes({
        minHeightTb: value === undefined ? 0 : value
      });
    };
    var onChangeMinHeightSp = function onChangeMinHeightSp(value) {
      return setAttributes({
        minHeightSp: value === undefined ? 0 : value
      });
    };
    var TagName = "h".concat(headingLevel);
    var inlineStyle = {
      '--color-main': colorMain
    };
    if (colorMainText) {
      inlineStyle['--color-main-text'] = colorMainText;
    }
    if (colorSubText) {
      inlineStyle['--color-sub-text'] = colorSubText;
    }
    if (maxWidth > 0) {
      inlineStyle['maxWidth'] = "".concat(maxWidth, "px");
      inlineStyle['width'] = '100%';
      inlineStyle['margin'] = '1em auto';
    }
    if (borderRadius > 0) {
      inlineStyle['width'] = '100%';
      inlineStyle['margin'] = '1em auto';
    }
    if (minHeightPc > 0) {
      inlineStyle['--min-height-pc'] = "".concat(minHeightPc, "px");
    }
    if (minHeightTb > 0) {
      inlineStyle['--min-height-tb'] = "".concat(minHeightTb, "px");
    }
    if (minHeightSp > 0) {
      inlineStyle['--min-height-sp'] = "".concat(minHeightSp, "px");
    }
    var ttlStyle = {};
    if (borderRadius > 0) {
      ttlStyle['borderRadius'] = "".concat(borderRadius, "px");
    }
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'lw-pr-custom-title-11',
      style: inlineStyle
    });
    return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, null, [1, 2, 3, 4, 5].map(function (level) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: level,
        isPressed: headingLevel === level,
        onClick: function onClick() {
          return onChangeHeadingLevel(level);
        }
      }, "H".concat(level));
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8868\u793A\u9806\u5E8F\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30E1\u30A4\u30F3\u3068\u30B5\u30D6\u3092\u5165\u308C\u66FF\u3048\u308B",
      checked: orderReversed,
      onChange: onToggleOrder,
      help: orderReversed ? 'メインが上、サブが下' : 'サブが上、メインが下'
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u5E45\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 (px)",
      value: maxWidth || undefined,
      onChange: onChangeMaxWidth,
      min: 400,
      max: 1600,
      step: 10,
      allowReset: true,
      help: maxWidth > 0 ? "".concat(maxWidth, "px") : '未設定(デフォルト幅)'
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u6700\u5C0F\u9AD8\u3055\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5C0F\u9AD8\u3055 PC (px)",
      value: minHeightPc || undefined,
      onChange: onChangeMinHeightPc,
      min: 0,
      max: 500,
      step: 10,
      allowReset: true,
      help: minHeightPc > 0 ? "".concat(minHeightPc, "px") : '未設定(auto)'
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5C0F\u9AD8\u3055 \u30BF\u30D6\u30EC\u30C3\u30C8 (px)",
      value: minHeightTb || undefined,
      onChange: onChangeMinHeightTb,
      min: 0,
      max: 500,
      step: 10,
      allowReset: true,
      help: minHeightTb > 0 ? "".concat(minHeightTb, "px") : '未設定(PCの設定を継承)'
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5C0F\u9AD8\u3055 SP (px)",
      value: minHeightSp || undefined,
      onChange: onChangeMinHeightSp,
      min: 0,
      max: 500,
      step: 10,
      allowReset: true,
      help: minHeightSp > 0 ? "".concat(minHeightSp, "px") : '未設定(タブレットの設定を継承)'
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30AB\u30E9\u30FC\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u30E1\u30A4\u30F3\u30AB\u30E9\u30FC")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: colorMain,
      onChange: onChangeColorMain
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u306E\u30C6\u30AD\u30B9\u30C8\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: colorMainText,
      onChange: onChangeColorMainText
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u306E\u30C6\u30AD\u30B9\u30C8\u8272")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: colorSubText,
      onChange: onChangeColorSubText
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u89D2\u4E38\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 (px)",
      value: borderRadius || undefined,
      onChange: onChangeBorderRadius,
      min: 0,
      max: 50,
      step: 1,
      allowReset: true,
      help: borderRadius > 0 ? "".concat(borderRadius, "px") : '角丸なし'
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(TagName, {
      className: "ttl",
      style: ttlStyle
    }, !orderReversed ? /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      onChange: onChangeSubTitle,
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: mainTitle,
      onChange: onChangeMainTitle,
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    })) : /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: mainTitle,
      onChange: onChangeMainTitle,
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      onChange: onChangeSubTitle,
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    })))));
  },
  /* ----------------------------------------------------------
   * フロント出力
   * -------------------------------------------------------- */
  save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      headingLevel = attributes.headingLevel,
      colorMain = attributes.colorMain,
      colorMainText = attributes.colorMainText,
      colorSubText = attributes.colorSubText,
      orderReversed = attributes.orderReversed,
      maxWidth = attributes.maxWidth,
      borderRadius = attributes.borderRadius,
      minHeightPc = attributes.minHeightPc,
      minHeightTb = attributes.minHeightTb,
      minHeightSp = attributes.minHeightSp;

    // テキストが両方とも入力されていない場合は何も出力しない
    if (!mainTitle && !subTitle) {
      return null;
    }
    var TagName = "h".concat(headingLevel);
    var inlineStyle = {
      '--color-main': colorMain
    };
    if (colorMainText) {
      inlineStyle['--color-main-text'] = colorMainText;
    }
    if (colorSubText) {
      inlineStyle['--color-sub-text'] = colorSubText;
    }
    if (maxWidth > 0) {
      inlineStyle['maxWidth'] = "".concat(maxWidth, "px");
      inlineStyle['width'] = '100%';
      inlineStyle['margin'] = '1em auto';
    }
    if (borderRadius > 0) {
      inlineStyle['width'] = '100%';
      inlineStyle['margin'] = '1em auto';
    }
    if (minHeightPc > 0) {
      inlineStyle['--min-height-pc'] = "".concat(minHeightPc, "px");
    }
    if (minHeightTb > 0) {
      inlineStyle['--min-height-tb'] = "".concat(minHeightTb, "px");
    }
    if (minHeightSp > 0) {
      inlineStyle['--min-height-sp'] = "".concat(minHeightSp, "px");
    }
    var ttlStyle = {};
    if (borderRadius > 0) {
      ttlStyle['borderRadius'] = "".concat(borderRadius, "px");
    }
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'lw-pr-custom-title-11',
      style: inlineStyle
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(TagName, {
      className: "ttl",
      style: ttlStyle
    }, !orderReversed ? /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, subTitle && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: subTitle
    }), mainTitle && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: mainTitle
    })) : /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, mainTitle && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: mainTitle
    }), subTitle && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: subTitle
    }))));
  }
});
/******/ })()
;