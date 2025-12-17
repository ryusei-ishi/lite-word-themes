/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-content-4/index.js":
/*!*******************************************!*\
  !*** ./src/paid-block-content-4/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-content-4/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-content-4/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-content-4/style.scss");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /* ────────────────────────────────────────────────
   * 編集画面
   * ──────────────────────────────────────────────── */
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      bottomText = attributes.bottomText,
      ctaText = attributes.ctaText,
      ctaUrl = attributes.ctaUrl,
      mainTitleColor = attributes.mainTitleColor,
      highlightColor = attributes.highlightColor,
      ctaBorderColor = attributes.ctaBorderColor,
      ctaTextColor = attributes.ctaTextColor,
      ctaBorderWidth = attributes.ctaBorderWidth,
      ctaBorderRadius = attributes.ctaBorderRadius,
      imageRadius = attributes.imageRadius,
      pcButtonState = attributes.pcButtonState,
      mobileButtonState = attributes.mobileButtonState,
      images = attributes.images;
    var onChange = function onChange(key) {
      return function (val) {
        return setAttributes(_defineProperty({}, key, val));
      };
    };

    /* 画像を一括選択（最大 8 枚）してオブジェクト配列を生成 */
    var onSelectImages = function onSelectImages(mediaArray) {
      var newArr = mediaArray.slice(0, 8).map(function (m) {
        return {
          url: m.url,
          alt: m.alt
        };
      });
      setAttributes({
        images: newArr
      });
    };

    /* ボタンの状態に応じたクラス名を生成 */
    var getButtonClasses = function getButtonClasses() {
      var classes = ['cont_btn'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };

    /* .btn_bg用のクラス名を生成 */
    var getBtnBgClasses = function getBtnBgClasses() {
      var classes = ['btn_bg'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'paid-block-content-4'
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\uD83D\uDCD6 \u30DE\u30CB\u30E5\u30A2\u30EB",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=V5vRfbzV8_8",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\uD83C\uDFA8 \u30C6\u30AD\u30B9\u30C8\u30FB\u8272\u8A2D\u5B9A",
      initialOpen: true
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
    }, "\uD83D\uDCDD \u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: mainTitleColor,
      onChange: onChange('mainTitleColor')
    })), /*#__PURE__*/React.createElement("div", {
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
    }, "\u2728 \u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\uFF08\u30CF\u30A4\u30E9\u30A4\u30C8\uFF09\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: highlightColor,
      onChange: onChange('highlightColor')
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\uD83D\uDD18 CTA\u30DC\u30BF\u30F3 - \u57FA\u672C\u8A2D\u5B9A",
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
    }, "\uD83D\uDD17 \u30EA\u30F3\u30AF URL"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      value: ctaUrl,
      onChange: onChange('ctaUrl'),
      placeholder: "https://example.com"
    })), /*#__PURE__*/React.createElement("div", {
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
    }, "\uD83C\uDFA8 \u30DC\u30BF\u30F3\u306E\u8272\u8A2D\u5B9A"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '8px',
        fontSize: '14px'
      }
    }, "\u67A0\u7DDA\u30FB\u80CC\u666F\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: ctaBorderColor,
      onChange: onChange('ctaBorderColor')
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '8px',
        marginTop: '15px',
        fontSize: '14px'
      }
    }, "\u6587\u5B57\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: ctaTextColor,
      onChange: onChange('ctaTextColor')
    })), /*#__PURE__*/React.createElement("div", {
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
        marginBottom: '15px',
        color: '#333'
      }
    }, "\uD83D\uDCD0 \u30DC\u30BF\u30F3\u306E\u5F62\u72B6"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u67A0\u7DDA\u306E\u592A\u3055\uFF08px\uFF09",
      value: ctaBorderWidth,
      onChange: onChange('ctaBorderWidth'),
      min: 0,
      max: 20,
      help: "\u30DC\u30BF\u30F3\u306E\u67A0\u7DDA\u306E\u592A\u3055\u3092\u8A2D\u5B9A\u3057\u307E\u3059"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30BF\u30F3\u89D2\u4E38\uFF08px\uFF09",
      value: ctaBorderRadius,
      onChange: onChange('ctaBorderRadius'),
      min: 0,
      max: 100,
      help: "\u30DC\u30BF\u30F3\u306E\u89D2\u306E\u4E38\u307F\u3092\u8A2D\u5B9A\u3057\u307E\u3059"
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\uD83D\uDCF1 CTA\u30DC\u30BF\u30F3 - \u30EC\u30B9\u30DD\u30F3\u30B7\u30D6\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f0f8ff'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDDA5\uFE0F PC\u753B\u9762\u3067\u306E\u8868\u793A"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      value: pcButtonState,
      options: [{
        label: '未選択',
        value: ''
      }, {
        label: '全幅',
        value: 'w_full'
      }, {
        label: '非表示',
        value: 'none'
      }],
      onChange: onChange('pcButtonState'),
      help: "PC\u753B\u9762\u3067\u306E\u30DC\u30BF\u30F3\u306E\u8868\u793A\u65B9\u6CD5\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fff5f5'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333'
      }
    }, "\uD83D\uDCF1 \u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u753B\u9762\u3067\u306E\u8868\u793A"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      value: mobileButtonState,
      options: [{
        label: '未選択',
        value: ''
      }, {
        label: '全幅',
        value: 'sp_w_full'
      }, {
        label: '非表示',
        value: 'sp_none'
      }],
      onChange: onChange('mobileButtonState'),
      help: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u753B\u9762\u3067\u306E\u30DC\u30BF\u30F3\u306E\u8868\u793A\u65B9\u6CD5\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\uD83D\uDDBC\uFE0F \u30AE\u30E3\u30E9\u30EA\u30FC\u753B\u50CF",
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
    }, "\uD83D\uDCF7 \u753B\u50CF\u9078\u629E\uFF08\u6700\u59278\u679A\uFF09"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: onSelectImages,
      allowedTypes: ['image'],
      multiple: true,
      gallery: true,
      value: images.map(function (img) {
        return img.url;
      }),
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: open
        }, images.length ? '画像を再選択' : '画像を選択'), images.length > 0 && /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 15,
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 6,
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px'
          }
        }, images.map(function (img, i) {
          return /*#__PURE__*/React.createElement("img", {
            key: i,
            src: img.url,
            alt: "",
            style: {
              width: '100%',
              borderRadius: "".concat(imageRadius, "px"),
              aspectRatio: '1',
              objectFit: 'cover'
            }
          });
        })));
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '15px',
        backgroundColor: '#fafafa'
      }
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\uD83D\uDCD0 \u753B\u50CF\u89D2\u4E38\uFF08px\uFF09",
      value: imageRadius,
      onChange: onChange('imageRadius'),
      min: 0,
      max: 200,
      help: "\u30AE\u30E3\u30E9\u30EA\u30FC\u753B\u50CF\u306E\u89D2\u306E\u4E38\u307F\u3092\u8A2D\u5B9A\u3057\u307E\u3059"
    })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("section", {
      className: "conts"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cont"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: mainTitleColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: mainTitle,
      onChange: onChange('mainTitle'),
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sub",
      style: {
        color: highlightColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: subTitle,
      onChange: onChange('subTitle'),
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB"
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "ttl_btm_p",
      value: bottomText,
      onChange: onChange('bottomText'),
      placeholder: "\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement("div", {
      className: getButtonClasses(),
      style: {
        borderColor: ctaBorderColor,
        borderWidth: "".concat(ctaBorderWidth, "px"),
        borderRadius: "".concat(ctaBorderRadius, "px"),
        color: ctaTextColor
      }
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      value: ctaText,
      onChange: onChange('ctaText'),
      placeholder: "\u30DC\u30BF\u30F3\u6587\u8A00"
    }), /*#__PURE__*/React.createElement("div", {
      className: getBtnBgClasses(),
      style: {
        background: ctaBorderColor,
        borderRadius: "".concat(ctaBorderRadius, "px")
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "gallery_in"
    }, images.map(function (img, i) {
      return /*#__PURE__*/React.createElement("div", {
        className: "image",
        key: i,
        style: {
          borderRadius: "".concat(imageRadius, "px"),
          overflow: 'hidden'
        }
      }, img.url && /*#__PURE__*/React.createElement("img", {
        src: img.url,
        alt: img.alt,
        style: {
          borderRadius: "".concat(imageRadius, "px")
        }
      }));
    })))));
  },
  /* ────────────────────────────────────────────────
   * 保存
   * ──────────────────────────────────────────────── */
  save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      bottomText = attributes.bottomText,
      ctaText = attributes.ctaText,
      ctaUrl = attributes.ctaUrl,
      mainTitleColor = attributes.mainTitleColor,
      highlightColor = attributes.highlightColor,
      ctaBorderColor = attributes.ctaBorderColor,
      ctaTextColor = attributes.ctaTextColor,
      ctaBorderWidth = attributes.ctaBorderWidth,
      ctaBorderRadius = attributes.ctaBorderRadius,
      imageRadius = attributes.imageRadius,
      pcButtonState = attributes.pcButtonState,
      mobileButtonState = attributes.mobileButtonState,
      images = attributes.images;

    /* ボタンの状態に応じたクラス名を生成（保存版） */
    var getButtonClasses = function getButtonClasses() {
      var classes = ['cont_btn'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };

    /* .btn_bg用のクラス名を生成（保存版） */
    var getBtnBgClasses = function getBtnBgClasses() {
      var classes = ['btn_bg'];
      if (pcButtonState === 'w_full') {
        classes.push('w_full');
      } else if (pcButtonState === 'none') {
        classes.push('none');
      }
      if (mobileButtonState === 'sp_w_full') {
        classes.push('sp_w_full');
      } else if (mobileButtonState === 'sp_none') {
        classes.push('sp_none');
      }
      return classes.join(' ');
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "paid-block-content-4"
    }, /*#__PURE__*/React.createElement("section", {
      className: "conts"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cont"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: mainTitleColor
      },
      dangerouslySetInnerHTML: {
        __html: mainTitle
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "sub",
      style: {
        color: highlightColor
      },
      dangerouslySetInnerHTML: {
        __html: subTitle
      }
    })), bottomText && bottomText.trim() && /*#__PURE__*/React.createElement("p", {
      className: "ttl_btm_p"
    }, /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: bottomText
      }
    })), /*#__PURE__*/React.createElement("a", {
      className: getButtonClasses(),
      href: ctaUrl,
      style: {
        borderColor: ctaBorderColor,
        borderWidth: "".concat(ctaBorderWidth, "px"),
        borderRadius: "".concat(ctaBorderRadius, "px"),
        color: ctaTextColor
      }
    }, /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: ctaText
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: getBtnBgClasses(),
      style: {
        background: ctaBorderColor,
        borderRadius: "".concat(ctaBorderRadius, "px")
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "gallery_in"
    }, images.map(function (img, i) {
      return img.url ? /*#__PURE__*/React.createElement("div", {
        className: "image",
        key: i,
        style: {
          borderRadius: "".concat(imageRadius, "px"),
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: img.url,
        alt: img.alt,
        style: {
          borderRadius: "".concat(imageRadius, "px")
        }
      })) : null;
    }))));
  }
});

/***/ }),

/***/ "./src/paid-block-content-4/editor.scss":
/*!**********************************************!*\
  !*** ./src/paid-block-content-4/editor.scss ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-content-4/style.scss":
/*!*********************************************!*\
  !*** ./src/paid-block-content-4/style.scss ***!
  \*********************************************/
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

/***/ "./src/paid-block-content-4/block.json":
/*!*********************************************!*\
  !*** ./src/paid-block-content-4/block.json ***!
  \*********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-content-4","version":"1.0.0","title":"Content 04","category":"lw-content","icon":"format-gallery","editorScript":"file:./paid-block-content-4.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","supports":{"anchor":true},"attributes":{"mainTitle":{"type":"string","default":"CONTENT"},"subTitle":{"type":"string","default":"サブテキスト"},"bottomText":{"type":"string","default":"テキストテキストテキストテキストテキストテキスト\\nテキストテキストテキストテキストテキストテキスト"},"ctaText":{"type":"string","default":"詳細はこちら"},"ctaUrl":{"type":"string","default":"#"},"mainTitleColor":{"type":"string","default":"#333"},"highlightColor":{"type":"string","default":"#0AA8C9"},"ctaBorderColor":{"type":"string","default":"#333"},"ctaTextColor":{"type":"string","default":"#333"},"ctaBorderWidth":{"type":"number","default":2},"ctaBorderRadius":{"type":"number","default":0},"imageRadius":{"type":"number","default":0},"pcButtonState":{"type":"string","default":""},"mobileButtonState":{"type":"string","default":""},"images":{"type":"array","default":[{"url":"https://lite-word.com/sample_img/shop/1.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/2.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/3.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/4.webp","alt":""},{"url":"https://lite-word.com/sample_img/shop/5.webp","alt":""},{"url":"https://lite-word.com/sample_img/women/1.webp","alt":""},{"url":"https://lite-word.com/sample_img/women/2.webp","alt":""},{"url":"https://lite-word.com/sample_img/women/4.webp","alt":""}]}},"no":4}');

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
/******/ 			"paid-block-content-4": 0,
/******/ 			"./style-paid-block-content-4": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-content-4"], () => (__webpack_require__("./src/paid-block-content-4/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;