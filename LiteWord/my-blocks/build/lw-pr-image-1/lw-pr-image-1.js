/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-pr-image-1/index.js":
/*!************************************!*\
  !*** ./src/lw-pr-image-1/index.js ***!
  \************************************/
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-image-1/style.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-image-1/block.json");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /* =============================================================
   *  Edit
   * ============================================================= */
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var blockId = attributes.blockId,
      images = attributes.images,
      gapPc = attributes.gapPc,
      gapSp = attributes.gapSp,
      columnsPc = attributes.columnsPc,
      columnsSp = attributes.columnsSp,
      aspectRatioW = attributes.aspectRatioW,
      aspectRatioH = attributes.aspectRatioH,
      imgBorderRadius = attributes.imgBorderRadius,
      mtPc = attributes.mtPc,
      mbPc = attributes.mbPc,
      mtSp = attributes.mtSp,
      mbSp = attributes.mbSp,
      maxWidth = attributes.maxWidth;

    /* --- blockId 確定 ---------------------------------------- */
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!blockId) {
        var uid = "lw-pr-image-1-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        setAttributes({
          blockId: uid
        });
      }
    }, []);

    /* --- 画像ヘルパー ---------------------------------------- */
    var updateImage = function updateImage(index, key, value) {
      var next = images.map(function (img, i) {
        return i === index ? _objectSpread(_objectSpread({}, img), {}, _defineProperty({}, key, value)) : img;
      });
      setAttributes({
        images: next
      });
    };
    var addImage = function addImage() {
      if (images.length < 20) {
        setAttributes({
          images: [].concat(_toConsumableArray(images), [{
            imgUrl: '',
            altText: '',
            linkUrl: ''
          }])
        });
      }
    };
    var removeImage = function removeImage(index) {
      if (images.length > 1) {
        setAttributes({
          images: images.filter(function (_, i) {
            return i !== index;
          })
        });
      }
    };
    var moveImageUp = function moveImageUp(index) {
      if (index === 0) return;
      var next = _toConsumableArray(images);
      var _ref2 = [next[index], next[index - 1]];
      next[index - 1] = _ref2[0];
      next[index] = _ref2[1];
      setAttributes({
        images: next
      });
    };
    var moveImageDown = function moveImageDown(index) {
      if (index === images.length - 1) return;
      var next = _toConsumableArray(images);
      var _ref3 = [next[index + 1], next[index]];
      next[index] = _ref3[0];
      next[index + 1] = _ref3[1];
      setAttributes({
        images: next
      });
    };

    /* --- CSS変数 --------------------------------------------- */
    var cssVars = {
      '--pr-image-1-gap-pc': "".concat(gapPc, "px"),
      '--pr-image-1-gap-sp': "".concat(gapSp, "px"),
      '--pr-image-1-clm-pc': columnsPc,
      '--pr-image-1-clm-sp': columnsSp,
      '--pr-image-1-aspect-w': aspectRatioW,
      '--pr-image-1-aspect-h': aspectRatioH,
      '--pr-image-1-radius': "".concat(imgBorderRadius, "px"),
      '--pr-image-1-mt-pc': "".concat(mtPc, "px"),
      '--pr-image-1-mb-pc': "".concat(mbPc, "px"),
      '--pr-image-1-mt-sp': "".concat(mtSp, "px"),
      '--pr-image-1-mb-sp': "".concat(mbSp, "px"),
      '--pr-image-1-max-w': maxWidth ? "".concat(maxWidth, "px") : '100%'
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      id: blockId,
      className: 'lw-pr-image-1',
      style: cssVars
    });

    /* --- JSX ------------------------------------------------- */
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B0\u30EA\u30C3\u30C9\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC\u30AB\u30E9\u30E0\u6570",
      value: columnsPc,
      onChange: function onChange(v) {
        return setAttributes({
          columnsPc: v
        });
      },
      min: 1,
      max: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP\u30AB\u30E9\u30E0\u6570",
      value: columnsSp,
      onChange: function onChange(v) {
        return setAttributes({
          columnsSp: v
        });
      },
      min: 1,
      max: 6
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC\u9593\u9694 (px)",
      value: gapPc,
      onChange: function onChange(v) {
        return setAttributes({
          gapPc: v
        });
      },
      min: 0,
      max: 60
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP\u9593\u9694 (px)",
      value: gapSp,
      onChange: function onChange(v) {
        return setAttributes({
          gapSp: v
        });
      },
      min: 0,
      max: 40
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4F59\u767D\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC \u4E0A\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mtPc,
      onChange: function onChange(v) {
        return setAttributes({
          mtPc: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC \u4E0B\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mbPc,
      onChange: function onChange(v) {
        return setAttributes({
          mbPc: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP \u4E0A\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mtSp,
      onChange: function onChange(v) {
        return setAttributes({
          mtSp: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP \u4E0B\u30DE\u30FC\u30B8\u30F3 (px)",
      value: mbSp,
      onChange: function onChange(v) {
        return setAttributes({
          mbSp: v
        });
      },
      min: 0,
      max: 200
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 (px)\u3000\u203B0\u3067100%",
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 0,
      max: 1600
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30A2\u30B9\u30DA\u30AF\u30C8\u6BD4",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6A2A (W)",
      value: aspectRatioW,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioW: v
        });
      },
      min: 1,
      max: 500
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u7E26 (H)",
      value: aspectRatioH,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioH: v
        });
      },
      min: 1,
      max: 500
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u89D2\u4E38",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 (px)",
      value: imgBorderRadius,
      onChange: function onChange(v) {
        return setAttributes({
          imgBorderRadius: v
        });
      },
      min: 0,
      max: 100
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u7BA1\u7406",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: addImage,
      disabled: images.length >= 20
    }, "\u753B\u50CF\u3092\u8FFD\u52A0\uFF08\u6700\u592720\u679A\uFF09"), images.map(function (img, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: {
          border: '1px solid #ddd',
          padding: '10px',
          marginTop: '10px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }
      }, /*#__PURE__*/React.createElement("strong", null, "\u753B\u50CF ", index + 1), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: '4px'
        }
      }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: function onClick() {
          return moveImageUp(index);
        },
        disabled: index === 0,
        style: {
          width: '32px',
          height: '32px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, "\u2191"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: function onClick() {
          return moveImageDown(index);
        },
        disabled: index === images.length - 1,
        style: {
          width: '32px',
          height: '32px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, "\u2193"))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(media) {
          return updateImage(index, 'imgUrl', media.url);
        },
        allowedTypes: ['image'],
        render: function render(_ref4) {
          var open = _ref4.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, img.imgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: img.imgUrl,
            alt: "",
            style: {
              maxWidth: '100%'
            }
          }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            variant: "secondary",
            style: {
              marginTop: '10px'
            }
          }, "\u753B\u50CF\u3092\u5909\u66F4"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: function onClick() {
              return updateImage(index, 'imgUrl', '');
            },
            variant: "secondary",
            style: {
              marginLeft: '10px',
              marginTop: '10px'
            }
          }, "\u524A\u9664")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            variant: "secondary"
          }, "\u753B\u50CF\u3092\u9078\u629E"));
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "alt\u30C6\u30AD\u30B9\u30C8",
        value: img.altText,
        onChange: function onChange(v) {
          return updateImage(index, 'altText', v);
        },
        style: {
          marginTop: '8px'
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AF\u5148URL\uFF08\u4EFB\u610F\uFF09",
        value: img.linkUrl,
        onChange: function onChange(v) {
          return updateImage(index, 'linkUrl', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeImage(index);
        },
        disabled: images.length <= 1,
        style: {
          marginTop: '10px'
        }
      }, "\u3053\u306E\u753B\u50CF\u3092\u524A\u9664"));
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-image-1__wrap"
    }, images.map(function (img, i) {
      return /*#__PURE__*/React.createElement("div", {
        className: "lw-pr-image-1__item",
        key: i
      }, img.imgUrl ? /*#__PURE__*/React.createElement("img", {
        src: img.imgUrl,
        alt: img.altText
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#999'
        }
      }, "No Image"));
    }))));
  },
  /* =============================================================
   *  Save
   * ============================================================= */
  save: function save(_ref5) {
    var attributes = _ref5.attributes;
    var blockId = attributes.blockId,
      images = attributes.images,
      gapPc = attributes.gapPc,
      gapSp = attributes.gapSp,
      columnsPc = attributes.columnsPc,
      columnsSp = attributes.columnsSp,
      aspectRatioW = attributes.aspectRatioW,
      aspectRatioH = attributes.aspectRatioH,
      imgBorderRadius = attributes.imgBorderRadius,
      mtPc = attributes.mtPc,
      mbPc = attributes.mbPc,
      mtSp = attributes.mtSp,
      mbSp = attributes.mbSp,
      maxWidth = attributes.maxWidth;
    var cssVars = {
      '--pr-image-1-gap-pc': "".concat(gapPc, "px"),
      '--pr-image-1-gap-sp': "".concat(gapSp, "px"),
      '--pr-image-1-clm-pc': columnsPc,
      '--pr-image-1-clm-sp': columnsSp,
      '--pr-image-1-aspect-w': aspectRatioW,
      '--pr-image-1-aspect-h': aspectRatioH,
      '--pr-image-1-radius': "".concat(imgBorderRadius, "px"),
      '--pr-image-1-mt-pc': "".concat(mtPc, "px"),
      '--pr-image-1-mb-pc': "".concat(mbPc, "px"),
      '--pr-image-1-mt-sp': "".concat(mtSp, "px"),
      '--pr-image-1-mb-sp': "".concat(mbSp, "px"),
      '--pr-image-1-max-w': maxWidth ? "".concat(maxWidth, "px") : '100%'
    };
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      id: blockId,
      className: 'lw-pr-image-1',
      style: cssVars
    });

    /* imgUrl が無いアイテムはスキップ */
    var validImages = images.filter(function (img) {
      return img.imgUrl;
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-image-1__wrap"
    }, validImages.map(function (img, i) {
      var imgTag = /*#__PURE__*/React.createElement("img", {
        src: img.imgUrl,
        alt: img.altText
      });
      return /*#__PURE__*/React.createElement("div", {
        className: "lw-pr-image-1__item",
        key: i
      }, img.linkUrl ? /*#__PURE__*/React.createElement("a", {
        href: img.linkUrl,
        target: "_blank",
        rel: "noopener noreferrer"
      }, imgTag) : imgTag);
    })));
  }
});

/***/ }),

/***/ "./src/lw-pr-image-1/style.scss":
/*!**************************************!*\
  !*** ./src/lw-pr-image-1/style.scss ***!
  \**************************************/
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

/***/ "./src/lw-pr-image-1/block.json":
/*!**************************************!*\
  !*** ./src/lw-pr-image-1/block.json ***!
  \**************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-image-1","version":"1.0.0","title":"PR画像グリッド 01","category":"lw-media","icon":"grid-view","description":"CSS変数で制御する画像グリッドブロック","aiHint":{"description":"画像グリッド。複数画像をグリッド配置。ギャラリー・施設写真に","excludeFromAutoSelect":false,"contentAttributes":[],"imageAttributes":["images"]},"supports":{"anchor":true},"editorScript":"file:./lw-pr-image-1.js","viewScript":"file:./view.js","attributes":{"blockId":{"type":"string"},"images":{"type":"array","default":[{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""},{"imgUrl":"","altText":"","linkUrl":""}]},"gapPc":{"type":"number","default":16},"gapSp":{"type":"number","default":8},"columnsPc":{"type":"number","default":5},"columnsSp":{"type":"number","default":2},"aspectRatioW":{"type":"number","default":160},"aspectRatioH":{"type":"number","default":108},"imgBorderRadius":{"type":"number","default":0},"mtPc":{"type":"number","default":16},"mbPc":{"type":"number","default":16},"mtSp":{"type":"number","default":16},"mbSp":{"type":"number","default":16},"maxWidth":{"type":"number","default":0}}}');

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
/******/ 			"lw-pr-image-1": 0,
/******/ 			"./style-lw-pr-image-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-image-1"], () => (__webpack_require__("./src/lw-pr-image-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;