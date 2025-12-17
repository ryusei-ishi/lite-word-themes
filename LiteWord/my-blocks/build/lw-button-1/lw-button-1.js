/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-button-1/index.js":
/*!**********************************!*\
  !*** ./src/lw-button-1/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/lw-button-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-button-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/lw-button-1/block.json");






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var buttonText = attributes.buttonText,
      url = attributes.url,
      openInNewTab = attributes.openInNewTab,
      fontSize = attributes.fontSize,
      maxWidth = attributes.maxWidth,
      maxWidthSp = attributes.maxWidthSp,
      backgroundColor = attributes.backgroundColor,
      textColor = attributes.textColor,
      paddingSize = attributes.paddingSize,
      innerPaddingSize = attributes.innerPaddingSize,
      marginTop = attributes.marginTop,
      marginBottom = attributes.marginBottom,
      alignment = attributes.alignment,
      alignmentSp = attributes.alignmentSp,
      borderRadius = attributes.borderRadius,
      borderWidth = attributes.borderWidth,
      borderColor = attributes.borderColor;
    var effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "wp-block-wdl-button-01 padding-".concat(paddingSize, " align-").concat(alignment, " align-sp-").concat(alignmentSp),
      style: {
        marginTop: "".concat(marginTop, "px"),
        marginBottom: "".concat(marginBottom, "px"),
        '--button-01-max-width-sp': "".concat(effectiveMaxWidthSp, "px")
      }
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u57FA\u672C\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '15px'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '8px',
        fontSize: '13px'
      }
    }, "\u30EA\u30F3\u30AF\u5148URL"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.URLInput, {
      value: url,
      onChange: function onChange(v) {
        return setAttributes({
          url: v
        });
      },
      style: {
        width: '100%'
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u65B0\u3057\u3044\u30BF\u30D6\u3067\u958B\u304F",
      checked: openInNewTab,
      onChange: function onChange() {
        return setAttributes({
          openInNewTab: !openInNewTab
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DC\u30BF\u30F3\u306E\u30B5\u30A4\u30BA\u3068\u5F62",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u6A2A\u5E45 (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 100,
      max: 1000,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30B9\u30DE\u30DB\u3067\u306E\u30DC\u30BF\u30F3\u306E\u6A2A\u5E45 (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: maxWidthSp !== null ? maxWidthSp : maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthSp: v
        });
      },
      min: 100,
      max: 1000,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u89D2\u306E\u4E38\u307F (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: borderRadius,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadius: v
        });
      },
      min: 0,
      max: 100,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u6587\u5B57\u306E\u30B5\u30A4\u30BA (%)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: fontSize,
      onChange: function onChange(v) {
        return setAttributes({
          fontSize: v
        });
      },
      min: 85,
      max: 160,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '12px'
      }
    }, "\u30DC\u30BF\u30F3\u5185\u306E\u4F59\u767D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, ['S', 'M', 'L'].map(function (size) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        key: size,
        isPrimary: innerPaddingSize === size,
        onClick: function onClick() {
          return setAttributes({
            innerPaddingSize: size
          });
        }
      }, size === 'S' ? '小さめ' : size === 'M' ? '標準' : '大きめ');
    })))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272\u306E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: backgroundColor,
      onChange: function onChange(e) {
        return setAttributes({
          backgroundColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '15px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u6587\u5B57\u306E\u8272"), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: textColor,
      onChange: function onChange(e) {
        return setAttributes({
          textColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DC\u30BF\u30F3\u306E\u914D\u7F6E",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '12px'
      }
    }, "\u30D1\u30BD\u30B3\u30F3\u30FB\u30BF\u30D6\u30EC\u30C3\u30C8\u3067\u306E\u4F4D\u7F6E"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, [{
      label: '左寄せ',
      value: 'flex-start'
    }, {
      label: '中央',
      value: 'center'
    }, {
      label: '右寄せ',
      value: 'flex-end'
    }].map(function (opt) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        key: opt.value,
        isPrimary: alignment === opt.value,
        onClick: function onClick() {
          return setAttributes({
            alignment: opt.value
          });
        }
      }, opt.label);
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '12px'
      }
    }, "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u3067\u306E\u4F4D\u7F6E"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, [{
      label: '左寄せ',
      value: 'flex-start'
    }, {
      label: '中央',
      value: 'center'
    }, {
      label: '右寄せ',
      value: 'flex-end'
    }].map(function (opt) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        key: opt.value,
        isPrimary: alignmentSp === opt.value,
        onClick: function onClick() {
          return setAttributes({
            alignmentSp: opt.value
          });
        }
      }, opt.label);
    })))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4F59\u767D\u306E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '15px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u4E0A\u306E\u4F59\u767D (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: marginTop,
      onChange: function onChange(v) {
        return setAttributes({
          marginTop: v
        });
      },
      min: 0,
      max: 100,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u30DC\u30BF\u30F3\u306E\u4E0B\u306E\u4F59\u767D (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: marginBottom,
      onChange: function onChange(v) {
        return setAttributes({
          marginBottom: v
        });
      },
      min: 0,
      max: 100,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u67A0\u7DDA\u306E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: borderWidth > 0 ? '15px' : '0px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u67A0\u7DDA\u306E\u592A\u3055 (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      value: borderWidth,
      onChange: function onChange(v) {
        return setAttributes({
          borderWidth: v
        });
      },
      min: 0,
      max: 20,
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    })), borderWidth > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px'
      }
    }, "\u67A0\u7DDA\u306E\u8272"), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: borderColor,
      onChange: function onChange(e) {
        return setAttributes({
          borderColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }
    })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "a",
      href: url,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      value: buttonText,
      onChange: function onChange(v) {
        return setAttributes({
          buttonText: v
        });
      },
      placeholder: "\u30DC\u30BF\u30F3\u306E\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B",
      multiline: false,
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        fontSize: "".concat(fontSize, "%"),
        backgroundColor: backgroundColor,
        color: textColor,
        padding: innerPaddingSize === 'S' ? '0.7em 1em' : innerPaddingSize === 'M' ? '0.9em 1.4em' : '1.3em 1.6em',
        textAlign: 'center',
        textDecoration: 'none',
        borderRadius: "".concat(borderRadius, "px"),
        borderWidth: "".concat(borderWidth, "px"),
        borderStyle: borderWidth > 0 ? 'solid' : 'none',
        borderColor: borderColor
      }
    })));
  },
  save: function save(_ref2) {
    var attributes = _ref2.attributes;
    var buttonText = attributes.buttonText,
      url = attributes.url,
      openInNewTab = attributes.openInNewTab,
      fontSize = attributes.fontSize,
      maxWidth = attributes.maxWidth,
      maxWidthSp = attributes.maxWidthSp,
      backgroundColor = attributes.backgroundColor,
      textColor = attributes.textColor,
      paddingSize = attributes.paddingSize,
      innerPaddingSize = attributes.innerPaddingSize,
      marginTop = attributes.marginTop,
      marginBottom = attributes.marginBottom,
      alignment = attributes.alignment,
      alignmentSp = attributes.alignmentSp,
      borderRadius = attributes.borderRadius,
      borderWidth = attributes.borderWidth,
      borderColor = attributes.borderColor;
    var effectiveMaxWidthSp = maxWidthSp !== null ? maxWidthSp : maxWidth;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "wp-block-wdl-button-01 padding-".concat(paddingSize, " align-").concat(alignment, " align-sp-").concat(alignmentSp),
      style: {
        marginTop: "".concat(marginTop, "px"),
        marginBottom: "".concat(marginBottom, "px"),
        '--button-01-max-width-sp': "".concat(effectiveMaxWidthSp, "px")
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("a", {
      href: url,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        fontSize: "".concat(fontSize, "%"),
        backgroundColor: backgroundColor,
        color: textColor,
        padding: innerPaddingSize === 'S' ? '0.7em 1em' : innerPaddingSize === 'M' ? '0.9em 1.4em' : '1.3em 1.6em',
        textAlign: 'center',
        textDecoration: 'none',
        borderRadius: "".concat(borderRadius, "px"),
        borderWidth: "".concat(borderWidth, "px"),
        borderStyle: borderWidth > 0 ? 'solid' : 'none',
        borderColor: borderColor
      },
      dangerouslySetInnerHTML: {
        __html: buttonText
      }
    }));
  }
});

/***/ }),

/***/ "./src/lw-button-1/editor.scss":
/*!*************************************!*\
  !*** ./src/lw-button-1/editor.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-button-1/style.scss":
/*!************************************!*\
  !*** ./src/lw-button-1/style.scss ***!
  \************************************/
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

/***/ "./src/lw-button-1/block.json":
/*!************************************!*\
  !*** ./src/lw-button-1/block.json ***!
  \************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-button-01","version":"1.0.0","title":"リンクボタン 01","category":"lw-button","icon":"button","description":"カスタマイズ可能なリンクボタン","supports":{"anchor":true},"attributes":{"buttonText":{"type":"string","source":"html","selector":"a","default":"詳細はこちら"},"url":{"type":"string","source":"attribute","selector":"a","attribute":"href","default":""},"openInNewTab":{"type":"boolean","default":false},"fontSize":{"type":"number","default":100},"maxWidth":{"type":"number","default":240},"maxWidthSp":{"type":"number","default":null},"backgroundColor":{"type":"string","default":"var(--color-main)"},"textColor":{"type":"string","default":"#ffffff"},"paddingSize":{"type":"string","default":"M"},"innerPaddingSize":{"type":"string","default":"M"},"marginTop":{"type":"number","default":10},"marginBottom":{"type":"number","default":10},"alignment":{"type":"string","default":"center"},"alignmentSp":{"type":"string","default":"center"},"borderRadius":{"type":"number","default":0},"borderWidth":{"type":"number","default":0},"borderColor":{"type":"string","default":"#000000"}},"editorScript":"file:./lw-button-1.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":1}');

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
/******/ 			"lw-button-1": 0,
/******/ 			"./style-lw-button-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-button-1"], () => (__webpack_require__("./src/lw-button-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;