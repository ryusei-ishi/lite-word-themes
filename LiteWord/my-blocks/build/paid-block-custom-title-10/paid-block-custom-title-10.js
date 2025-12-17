/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-custom-title-10/index.js":
/*!*************************************************!*\
  !*** ./src/paid-block-custom-title-10/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-custom-title-10/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-custom-title-10/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-custom-title-10/block.json");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /* ========================== edit ========================== */edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      headingLevel = attributes.headingLevel,
      mainTitleColor = attributes.mainTitleColor,
      sizeClass = attributes.sizeClass,
      leftImage = attributes.leftImage,
      rightImage = attributes.rightImage,
      leftHeightEm = attributes.leftHeightEm,
      rightHeightEm = attributes.rightHeightEm,
      leftMarginEm = attributes.leftMarginEm,
      rightMarginEm = attributes.rightMarginEm,
      positionClass = attributes.positionClass,
      hideSubTitle = attributes.hideSubTitle,
      hideMainTitle = attributes.hideMainTitle,
      bdThickness = attributes.bdThickness,
      bdMarginTopEm = attributes.bdMarginTopEm,
      bdDisplay = attributes.bdDisplay,
      ttlFullWidth = attributes.ttlFullWidth;
    var Tag = "h".concat(headingLevel);
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "paid-block-custom-title-10 ".concat(positionClass, " ").concat(sizeClass)
    });
    var onSelectImage = function onSelectImage(side) {
      return function (media) {
        return setAttributes(_defineProperty({}, side, media.url));
      };
    };
    var removeImage = function removeImage(side) {
      return setAttributes(_defineProperty({}, side, ''));
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, null, [2, 3, 4].map(function (lvl) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: lvl,
        isPressed: headingLevel === lvl,
        onClick: function onClick() {
          return setAttributes({
            headingLevel: lvl
          });
        }
      }, "H".concat(lvl));
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B5\u30A4\u30BA\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
      label: "\u30B5\u30A4\u30BA",
      selected: sizeClass,
      options: [{
        label: '大 (L)',
        value: 'size_l'
      }, {
        label: '中 (M)',
        value: 'size_m'
      }, {
        label: '小 (S)',
        value: 'size_s'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          sizeClass: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u914D\u7F6E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
      label: "\u5DE6\u53F3\u4E2D\u592E\u306E\u914D\u7F6E",
      selected: positionClass,
      options: [{
        label: '左寄せ',
        value: 'position_left'
      }, {
        label: '中央寄せ',
        value: 'position_center'
      }, {
        label: '右寄せ',
        value: 'position_right'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          positionClass: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30BF\u30A4\u30C8\u30EB\u3092\u5168\u5E45\u306B\u3059\u308B",
      checked: ttlFullWidth === 'on',
      onChange: function onChange(v) {
        return setAttributes({
          ttlFullWidth: v ? 'on' : 'off'
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30E1\u30A4\u30F3\u30AB\u30E9\u30FC",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("p", null, "\u30E1\u30A4\u30F3\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: mainTitleColor,
      onChange: function onChange(c) {
        return setAttributes({
          mainTitleColor: c
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement("p", {
      className: "components-base-control__label"
    }, "\u5DE6\u753B\u50CF"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onSelectImage('leftImage'),
      allowedTypes: ['image'],
      value: leftImage,
      render: function render(_ref2) {
        var open = _ref2.open;
        return leftImage ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
          src: leftImage,
          style: {
            maxWidth: '100%',
            marginBottom: 20
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isSecondary: true,
          onClick: function onClick() {
            return removeImage('leftImage');
          }
        }, "\u524A\u9664")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isPrimary: true,
          onClick: open
        }, "\u753B\u50CF\u3092\u9078\u629E");
      }
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u753B\u50CF \u5927\u304D\u3055 (em)",
      min: 0.1,
      max: 2,
      step: 0.05,
      value: leftHeightEm,
      onChange: function onChange(v) {
        return setAttributes({
          leftHeightEm: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6\u753B\u50CF \u4F59\u767D (em)",
      min: 0,
      max: 2,
      step: 0.05,
      value: leftMarginEm,
      onChange: function onChange(v) {
        return setAttributes({
          leftMarginEm: v
        });
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", {
      className: "components-base-control__label"
    }, "\u53F3\u753B\u50CF"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onSelectImage('rightImage'),
      allowedTypes: ['image'],
      value: rightImage,
      render: function render(_ref3) {
        var open = _ref3.open;
        return rightImage ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
          src: rightImage,
          style: {
            maxWidth: '100%',
            marginBottom: 20
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isSecondary: true,
          onClick: function onClick() {
            return removeImage('rightImage');
          }
        }, "\u524A\u9664")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isPrimary: true,
          onClick: open
        }, "\u753B\u50CF\u3092\u9078\u629E");
      }
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u753B\u50CF \u5927\u304D\u3055 (em)",
      min: 0.1,
      max: 2,
      step: 0.05,
      value: rightHeightEm,
      onChange: function onChange(v) {
        return setAttributes({
          rightHeightEm: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3\u753B\u50CF \u4F59\u767D (em)",
      min: 0,
      max: 2,
      step: 0.05,
      value: rightMarginEm,
      onChange: function onChange(v) {
        return setAttributes({
          rightMarginEm: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30BF\u30A4\u30C8\u30EB\u8868\u793A\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "sub\u30BF\u30A4\u30C8\u30EB\u3092\u975E\u8868\u793A\u306B\u3059\u308B",
      checked: hideSubTitle === 'on',
      onChange: function onChange(v) {
        return setAttributes({
          hideSubTitle: v ? 'on' : 'off'
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "main\u30BF\u30A4\u30C8\u30EB\u3092\u975E\u8868\u793A\u306B\u3059\u308B",
      checked: hideMainTitle === 'on',
      onChange: function onChange(v) {
        return setAttributes({
          hideMainTitle: v ? 'on' : 'off'
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4E0B\u7DDA\u306E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "ON / OFF",
      checked: bdDisplay === 'on',
      onChange: function onChange(v) {
        return setAttributes({
          bdDisplay: v ? 'on' : 'off'
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u592A\u3055 (px)",
      min: 0,
      max: 10,
      step: 1,
      value: bdThickness,
      onChange: function onChange(v) {
        return setAttributes({
          bdThickness: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A\u30DE\u30FC\u30B8\u30F3 (em)",
      min: 0,
      max: 2,
      step: 0.05,
      value: bdMarginTopEm,
      onChange: function onChange(v) {
        return setAttributes({
          bdMarginTopEm: v
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(Tag, {
      className: "ttl".concat(ttlFullWidth === 'on' ? ' w_100' : '')
    }, leftImage && /*#__PURE__*/React.createElement("span", {
      className: "image_left",
      style: {
        height: "".concat(leftHeightEm, "em"),
        marginRight: "".concat(leftMarginEm, "em")
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: leftImage,
      alt: ""
    })), /*#__PURE__*/React.createElement("span", {
      className: "text_wrap"
    }, hideSubTitle === 'off' && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      onChange: function onChange(v) {
        return setAttributes({
          subTitle: v
        });
      },
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B",
      style: {
        color: mainTitleColor
      }
    }), hideMainTitle === 'off' && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: mainTitle,
      onChange: function onChange(v) {
        return setAttributes({
          mainTitle: v
        });
      },
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    })), rightImage && /*#__PURE__*/React.createElement("span", {
      className: "image_right",
      style: {
        height: "".concat(rightHeightEm, "em"),
        marginLeft: "".concat(rightMarginEm, "em")
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: rightImage,
      alt: ""
    })), bdDisplay === 'on' && /*#__PURE__*/React.createElement("span", {
      className: "bd",
      style: {
        backgroundColor: mainTitleColor,
        height: "".concat(bdThickness, "px"),
        marginTop: "".concat(bdMarginTopEm, "em")
      }
    }))));
  },
  /* ========================== save ========================== */save: function save(_ref4) {
    var attributes = _ref4.attributes;
    var subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      headingLevel = attributes.headingLevel,
      mainTitleColor = attributes.mainTitleColor,
      sizeClass = attributes.sizeClass,
      leftImage = attributes.leftImage,
      rightImage = attributes.rightImage,
      leftHeightEm = attributes.leftHeightEm,
      rightHeightEm = attributes.rightHeightEm,
      leftMarginEm = attributes.leftMarginEm,
      rightMarginEm = attributes.rightMarginEm,
      positionClass = attributes.positionClass,
      hideSubTitle = attributes.hideSubTitle,
      hideMainTitle = attributes.hideMainTitle,
      bdThickness = attributes.bdThickness,
      bdMarginTopEm = attributes.bdMarginTopEm,
      bdDisplay = attributes.bdDisplay,
      ttlFullWidth = attributes.ttlFullWidth;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "paid-block-custom-title-10 ".concat(positionClass, " ").concat(sizeClass)
    });
    var Tag = "h".concat(headingLevel);
    var maybeImage = function maybeImage(url, cls, styleObj) {
      return url && /*#__PURE__*/React.createElement("span", {
        className: cls,
        style: styleObj
      }, /*#__PURE__*/React.createElement("img", {
        src: url,
        alt: ""
      }));
    };
    var maybeText = function maybeText(val, cls, styleObj) {
      return val && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "span",
        className: cls,
        value: val,
        style: styleObj
      });
    };
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(Tag, {
      className: "ttl".concat(ttlFullWidth === 'on' ? ' w_100' : '')
    }, maybeImage(leftImage, 'image_left', {
      height: "".concat(leftHeightEm, "em"),
      marginRight: "".concat(leftMarginEm, "em")
    }), /*#__PURE__*/React.createElement("span", {
      className: "text_wrap"
    }, hideSubTitle === 'off' && maybeText(subTitle, 'sub', {
      color: mainTitleColor
    }), hideMainTitle === 'off' && maybeText(mainTitle, 'main')), maybeImage(rightImage, 'image_right', {
      height: "".concat(rightHeightEm, "em"),
      marginLeft: "".concat(rightMarginEm, "em")
    }), bdDisplay === 'on' && /*#__PURE__*/React.createElement("span", {
      className: "bd",
      style: {
        backgroundColor: mainTitleColor,
        height: "".concat(bdThickness, "px"),
        marginTop: "".concat(bdMarginTopEm, "em")
      }
    })));
  }
});

/***/ }),

/***/ "./src/paid-block-custom-title-10/editor.scss":
/*!****************************************************!*\
  !*** ./src/paid-block-custom-title-10/editor.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-custom-title-10/style.scss":
/*!***************************************************!*\
  !*** ./src/paid-block-custom-title-10/style.scss ***!
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

/***/ "./src/paid-block-custom-title-10/block.json":
/*!***************************************************!*\
  !*** ./src/paid-block-custom-title-10/block.json ***!
  \***************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-custom-title-10","version":"1.0.0","title":"見出しタイトル 10","category":"lw-heading","icon":"editor-textcolor","description":"画像付き見出しブロック","supports":{"anchor":true},"attributes":{"subTitle":{"type":"string","default":"製品紹介"},"mainTitle":{"type":"string","default":"PRODUCTS"},"headingLevel":{"type":"number","default":2},"mainTitleColor":{"type":"string","default":"var(--color-main)"},"sizeClass":{"type":"string","default":"size_m"},"leftImage":{"type":"string","default":"https://lite-word.com/sample_img/icon/pc_1.png"},"rightImage":{"type":"string","default":""},"leftHeightEm":{"type":"number","default":1.5},"rightHeightEm":{"type":"number","default":1.5},"leftMarginEm":{"type":"number","default":0.4},"rightMarginEm":{"type":"number","default":0.4},"positionClass":{"type":"string","default":"position_center"},"hideSubTitle":{"type":"string","default":"off"},"hideMainTitle":{"type":"string","default":"off"},"bdThickness":{"type":"number","default":2},"bdMarginTopEm":{"type":"number","default":0.1},"bdDisplay":{"type":"string","default":"on"},"ttlFullWidth":{"type":"string","default":"off"}},"editorScript":"file:./paid-block-custom-title-10.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":10}');

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
/******/ 			"paid-block-custom-title-10": 0,
/******/ 			"./style-paid-block-custom-title-10": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-custom-title-10"], () => (__webpack_require__("./src/paid-block-custom-title-10/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;