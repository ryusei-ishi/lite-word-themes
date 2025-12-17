/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-image-1/index.js":
/*!*****************************************!*\
  !*** ./src/paid-block-image-1/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-image-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-image-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-image-1/block.json");
/* ----------------------------------------------------------
 * LiteWord – paid-block-image-1
 * 画像 + 肩書き + 氏名
 * 変更点：
 *   - 最大幅 (maxWidth) を数値型(px)の RangeControl に変更
 *   - 画像選択時、サイドバーにサムネイルを表示 ⭐
 * -------------------------------------------------------- */








/* -------------------------------------------------- */
var headingOptions = ['h2', 'h3', 'h4', 'p'];
var fontSizeOptions = [{
  label: '大 (L)',
  value: 'font_size_l'
}, {
  label: '中 (M)',
  value: 'font_size_m'
}, {
  label: '小 (S)',
  value: 'font_size_s'
}, {
  label: '極小 (SS)',
  value: 'font_size_ss'
}];

/* ============================================================== */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  /* ============================ EDIT ============================ */edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var image = attributes.image,
      alt = attributes.alt,
      subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      aspectRatioW = attributes.aspectRatioW,
      aspectRatioH = attributes.aspectRatioH,
      maxWidth = attributes.maxWidth,
      centerBlock = attributes.centerBlock,
      innerRadiusEm = attributes.innerRadiusEm,
      showNamePlate = attributes.showNamePlate,
      namePlateColor = attributes.namePlateColor,
      namePlateRadiusEm = attributes.namePlateRadiusEm,
      namePlateBorderWidth = attributes.namePlateBorderWidth,
      showLinkNext = attributes.showLinkNext,
      linkNextBgColor = attributes.linkNextBgColor,
      linkNextIconColor = attributes.linkNextIconColor,
      linkUrl = attributes.linkUrl,
      linkOpenNewTab = attributes.linkOpenNewTab,
      headingLevel = attributes.headingLevel,
      fontSizeClass = attributes.fontSizeClass;

    /* スタイル生成 */
    var outerStyle = {
      maxWidth: "".concat(maxWidth, "px"),
      marginLeft: centerBlock ? 'auto' : undefined,
      marginRight: centerBlock ? 'auto' : undefined
    };
    var innerStyle = {
      aspectRatio: "".concat(aspectRatioW, " / ").concat(aspectRatioH),
      borderRadius: "".concat(innerRadiusEm, "em")
    };

    /* 矢印有効判定 */
    var showLinkNextEffective = !!linkUrl && showLinkNext;

    /* 画像削除  */
    var removeImage = function removeImage() {
      return setAttributes({
        image: '',
        alt: ''
      });
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "paid-block-image-1 ".concat(fontSizeClass),
      style: outerStyle
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, {
      group: "block"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, null, headingOptions.map(function (tag) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
        key: tag,
        isPressed: headingLevel === tag,
        onClick: function onClick() {
          return setAttributes({
            headingLevel: tag
          });
        }
      }, tag.toUpperCase() === 'P' ? 'P' : tag.toUpperCase());
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          image: media.url,
          alt: media.alt || ''
        });
      },
      allowedTypes: ['image'],
      value: image,
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, image && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
          src: image,
          alt: alt || '選択した画像',
          style: {
            width: '100%',
            height: 'auto',
            marginBottom: '10px'
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              image: '',
              alt: ''
            });
          },
          variant: "secondary",
          style: {
            margin: '4px 4px 0 0'
          }
        }, "\u753B\u50CF\u3092\u524A\u9664")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, "\u753B\u50CF\u3092\u9078\u629E"));
      }
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u4EE3\u66FF\u30C6\u30AD\u30B9\u30C8 (alt)",
      value: alt,
      onChange: function onChange(v) {
        return setAttributes({
          alt: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30A2\u30B9\u30DA\u30AF\u30C8\u6BD4\uFF08\u6A2A\uFF09 : ".concat(aspectRatioW),
      value: aspectRatioW,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioW: v
        });
      },
      min: 100,
      max: 800
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30A2\u30B9\u30DA\u30AF\u30C8\u6BD4\uFF08\u7E26\uFF09 : ".concat(aspectRatioH),
      value: aspectRatioH,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioH: v
        });
      },
      min: 100,
      max: 800
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 (px) : ".concat(maxWidth),
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 100,
      max: 2000,
      step: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u4E2D\u592E\u5BC4\u305B\u306B\u3059\u308B",
      checked: centerBlock,
      onChange: function onChange(v) {
        return setAttributes({
          centerBlock: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u5168\u4F53\u306E\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA",
      value: fontSizeClass,
      options: fontSizeOptions,
      onChange: function onChange(v) {
        return setAttributes({
          fontSizeClass: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u753B\u50CF\u67A0\u89D2\u4E38 (em) : ".concat(innerRadiusEm),
      value: innerRadiusEm,
      onChange: function onChange(v) {
        return setAttributes({
          innerRadiusEm: v
        });
      },
      min: 0,
      max: 5,
      step: 0.1
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u540D\u524D\u30D7\u30EC\u30FC\u30C8",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30D7\u30EC\u30FC\u30C8\u3092\u8868\u793A",
      checked: showNamePlate,
      onChange: function onChange(v) {
        return setAttributes({
          showNamePlate: v
        });
      }
    }), showNamePlate && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "\u80CC\u666F / \u67A0\u7DDA\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: namePlateColor,
      onChange: function onChange(v) {
        return setAttributes({
          namePlateColor: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30D7\u30EC\u30FC\u30C8\u89D2\u4E38 (em) : ".concat(namePlateRadiusEm),
      value: namePlateRadiusEm,
      onChange: function onChange(v) {
        return setAttributes({
          namePlateRadiusEm: v
        });
      },
      min: 0,
      max: 5,
      step: 0.1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30D7\u30EC\u30FC\u30C8\u67A0\u7DDA\u592A\u3055 (px) : ".concat(namePlateBorderWidth),
      value: namePlateBorderWidth,
      onChange: function onChange(v) {
        return setAttributes({
          namePlateBorderWidth: v
        });
      },
      min: 0,
      max: 10
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EA\u30F3\u30AF\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AF URL",
      value: linkUrl,
      onChange: function onChange(v) {
        return setAttributes({
          linkUrl: v
        });
      },
      placeholder: "https://example.com/"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u65B0\u898F\u30BF\u30D6\u3067\u958B\u304F",
      checked: linkOpenNewTab,
      onChange: function onChange(v) {
        return setAttributes({
          linkOpenNewTab: v
        });
      },
      disabled: !linkUrl
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u77E2\u5370\u3092\u8868\u793A",
      checked: showLinkNext,
      onChange: function onChange(v) {
        return setAttributes({
          showLinkNext: v
        });
      },
      disabled: !linkUrl
    }), linkUrl && showLinkNext && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: linkNextBgColor,
      onChange: function onChange(v) {
        return setAttributes({
          linkNextBgColor: v
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30A2\u30A4\u30B3\u30F3\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: linkNextIconColor,
      onChange: function onChange(v) {
        return setAttributes({
          linkNextIconColor: v
        });
      }
    })), !linkUrl && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '12px',
        opacity: .7
      }
    }, "\u203BURL\u3092\u5165\u529B\u3059\u308B\u3068\u8A2D\u5B9A\u3067\u304D\u307E\u3059"))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "paid-block-image-1__inner",
      style: innerStyle
    }, image && /*#__PURE__*/React.createElement("img", {
      src: image,
      alt: alt
    }), showNamePlate && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.createElement)(headingLevel, {
      className: 'name_plate',
      style: {
        backgroundColor: namePlateColor,
        borderColor: namePlateColor,
        borderRadius: "".concat(namePlateRadiusEm, "em"),
        borderWidth: "".concat(namePlateBorderWidth, "px")
      }
    }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      onChange: function onChange(v) {
        return setAttributes({
          subTitle: v
        });
      },
      placeholder: "\u80A9\u66F8\u304D"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      value: mainTitle,
      onChange: function onChange(v) {
        return setAttributes({
          mainTitle: v
        });
      },
      placeholder: "\u6C0F\u540D"
    }))), showLinkNextEffective && /*#__PURE__*/React.createElement("div", {
      className: "link_next",
      style: {
        backgroundColor: linkNextBgColor
      }
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512",
      style: {
        fill: linkNextIconColor
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
    }))))));
  },
  /* ============================ SAVE ============================ */save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var image = attributes.image,
      alt = attributes.alt,
      subTitle = attributes.subTitle,
      mainTitle = attributes.mainTitle,
      aspectRatioW = attributes.aspectRatioW,
      aspectRatioH = attributes.aspectRatioH,
      maxWidth = attributes.maxWidth,
      centerBlock = attributes.centerBlock,
      innerRadiusEm = attributes.innerRadiusEm,
      showNamePlate = attributes.showNamePlate,
      namePlateColor = attributes.namePlateColor,
      namePlateRadiusEm = attributes.namePlateRadiusEm,
      namePlateBorderWidth = attributes.namePlateBorderWidth,
      showLinkNext = attributes.showLinkNext,
      linkNextBgColor = attributes.linkNextBgColor,
      linkNextIconColor = attributes.linkNextIconColor,
      linkUrl = attributes.linkUrl,
      linkOpenNewTab = attributes.linkOpenNewTab,
      headingLevel = attributes.headingLevel,
      fontSizeClass = attributes.fontSizeClass;
    var showLinkNextEffective = !!linkUrl && showLinkNext;

    /* テキストの有無をチェック */
    var hasSubTitle = subTitle && subTitle.trim() !== '';
    var hasMainTitle = mainTitle && mainTitle.trim() !== '';
    var showNamePlateEffective = showNamePlate && (hasSubTitle || hasMainTitle);

    /* a/div 切替 (保存時のみ) */
    var WrapperTag = linkUrl ? 'a' : 'div';
    var wrapperProps = linkUrl ? {
      href: linkUrl,
      target: linkOpenNewTab ? '_blank' : undefined,
      rel: linkOpenNewTab ? 'noopener noreferrer' : undefined,
      className: 'paid-block-image-1__inner',
      style: {
        aspectRatio: "".concat(aspectRatioW, " / ").concat(aspectRatioH),
        borderRadius: "".concat(innerRadiusEm, "em")
      }
    } : {
      className: 'paid-block-image-1__inner',
      style: {
        aspectRatio: "".concat(aspectRatioW, " / ").concat(aspectRatioH),
        borderRadius: "".concat(innerRadiusEm, "em")
      }
    };
    var HeadingTag = headingLevel;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "paid-block-image-1 ".concat(fontSizeClass),
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        marginLeft: centerBlock ? 'auto' : undefined,
        marginRight: centerBlock ? 'auto' : undefined
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.createElement)(WrapperTag, wrapperProps, /*#__PURE__*/React.createElement(React.Fragment, null, image && /*#__PURE__*/React.createElement("img", {
      src: image,
      alt: alt
    }), showNamePlateEffective && /*#__PURE__*/React.createElement(HeadingTag, {
      className: "name_plate",
      style: {
        backgroundColor: namePlateColor,
        borderColor: namePlateColor,
        borderRadius: "".concat(namePlateRadiusEm, "em"),
        borderWidth: "".concat(namePlateBorderWidth, "px")
      }
    }, hasSubTitle && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: subTitle
    }), hasMainTitle && /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      value: mainTitle
    })), showLinkNextEffective && /*#__PURE__*/React.createElement("div", {
      className: "link_next",
      style: {
        backgroundColor: linkNextBgColor
      }
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512",
      style: {
        fill: linkNextIconColor
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
    }))))));
  }
});

/***/ }),

/***/ "./src/paid-block-image-1/editor.scss":
/*!********************************************!*\
  !*** ./src/paid-block-image-1/editor.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-image-1/style.scss":
/*!*******************************************!*\
  !*** ./src/paid-block-image-1/style.scss ***!
  \*******************************************/
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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./src/paid-block-image-1/block.json":
/*!*******************************************!*\
  !*** ./src/paid-block-image-1/block.json ***!
  \*******************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-image-1","version":"1.0.0","title":"画像 01","category":"lw-media","icon":"format-image","supports":{"anchor":true},"editorScript":"file:./paid-block-image-1.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":1,"attributes":{"image":{"type":"string","default":"https://placehold.jp/600x440.png"},"alt":{"type":"string","default":""},"subTitle":{"type":"string","default":"主任"},"mainTitle":{"type":"string","default":"大阪 京子"},"aspectRatioW":{"type":"number","default":400},"aspectRatioH":{"type":"number","default":340},"maxWidth":{"type":"number","default":480},"centerBlock":{"type":"boolean","default":false},"innerRadiusEm":{"type":"number","default":0.9},"showNamePlate":{"type":"boolean","default":true},"namePlateColor":{"type":"string","default":"var(--color-main)"},"namePlateRadiusEm":{"type":"number","default":0.2},"namePlateBorderWidth":{"type":"number","default":2},"showLinkNext":{"type":"boolean","default":true},"linkNextBgColor":{"type":"string","default":"var(--color-main)"},"linkNextIconColor":{"type":"string","default":"#ffffff"},"linkUrl":{"type":"string","default":""},"linkOpenNewTab":{"type":"boolean","default":false},"headingLevel":{"type":"string","default":"h3"},"fontSizeClass":{"type":"string","default":"font_size_m"}}}');

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
/******/ 			"paid-block-image-1": 0,
/******/ 			"./style-paid-block-image-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-image-1"], () => (__webpack_require__("./src/paid-block-image-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;