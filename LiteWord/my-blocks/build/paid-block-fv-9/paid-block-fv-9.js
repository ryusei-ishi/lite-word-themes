/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-fv-9/index.js":
/*!**************************************!*\
  !*** ./src/paid-block-fv-9/index.js ***!
  \**************************************/
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-fv-9/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-fv-9/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-fv-9/block.json");
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
/*************************************************************************
 * LiteWord – Paid Block  FV 09 : full‑width / fixed‑width Swiper slider *
 * 2025‑04‑17 改訂版                                                     *
 ************************************************************************/








// ★ HTTPをHTTPSに変換するヘルパー関数を追加
var ensureHttps = function ensureHttps(url) {
  if (!url) return url;

  // 現在のページがHTTPSで、URLがHTTPの場合のみ変換
  if (window.location.protocol === 'https:' && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  // プロトコル相対URLに変換する方法も可能
  // return url.replace(/^https?:/, '');

  return url;
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  // ------------------------------------------------------------------
  // ▶ Edit
  // ------------------------------------------------------------------
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var blockId = attributes.blockId,
      slides = attributes.slides,
      layoutType = attributes.layoutType,
      maxWidth = attributes.maxWidth,
      autoplayDelay = attributes.autoplayDelay,
      sliderEffect = attributes.sliderEffect,
      crossFade = attributes.crossFade,
      loop = attributes.loop,
      disableOnInteraction = attributes.disableOnInteraction,
      showPagination = attributes.showPagination,
      paginationClickable = attributes.paginationClickable,
      showNavigation = attributes.showNavigation,
      sliderSpeed = attributes.sliderSpeed,
      paginationColor = attributes.paginationColor,
      nextButtonColor = attributes.nextButtonColor;

    /* ID を確定させる ------------------------------------------------*/
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!blockId) {
        var uniqueId = "paid-block-fv-9-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        setAttributes({
          blockId: uniqueId
        });
      }
    }, []);

    /* スライド編集ヘルパー ----------------------------------------*/
    var updateSlide = function updateSlide(index, key, value) {
      // ★ URL更新時はHTTPS変換を適用
      var processedValue = key === 'pcImgUrl' || key === 'spImgUrl' ? ensureHttps(value) : value;
      var newSlides = slides.map(function (slide, i) {
        return i === index ? _objectSpread(_objectSpread({}, slide), {}, _defineProperty({}, key, processedValue)) : slide;
      });
      setAttributes({
        slides: newSlides
      });
    };
    var addSlide = function addSlide() {
      if (slides.length < 20) {
        setAttributes({
          slides: [].concat(_toConsumableArray(slides), [{
            pcImgUrl: '',
            spImgUrl: '',
            altText: '',
            linkUrl: ''
          }])
        });
      }
    };
    var removeSlide = function removeSlide(index) {
      if (slides.length > 1) {
        setAttributes({
          slides: slides.filter(function (_, i) {
            return i !== index;
          })
        });
      }
    };

    /* スライドの順番を入れ替える */
    var moveSlide = function moveSlide(index, direction) {
      var newIndex = index + direction;
      if (newIndex < 0 || newIndex >= slides.length) return;
      var newSlides = _toConsumableArray(slides);
      var temp = newSlides[index];
      newSlides[index] = newSlides[newIndex];
      newSlides[newIndex] = temp;
      setAttributes({
        slides: newSlides
      });
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      id: blockId,
      className: layoutType === 'full' ? 'swiper paid-block-fv-9 max-w' : 'swiper paid-block-fv-9',
      style: layoutType === 'fixed' ? {
        maxWidth: maxWidth
      } : {}
    });

    /* --------------------------------------------------------------*/
    /* Gutenberg サイドバー                                           */
    /* --------------------------------------------------------------*/
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://www.youtube.com/watch?v=tCEO9QA-hCI",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u5E45\u306E\u8A2D\u5B9A",
      value: layoutType,
      options: [{
        label: '固定幅',
        value: 'fixed'
      }, {
        label: '画面いっぱい（固定ページの時のみ）',
        value: 'full'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          layoutType: v
        });
      }
    }), layoutType === 'fixed' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45 (px)",
      value: maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      },
      min: 600,
      max: 2000,
      step: 10
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C9\u753B\u50CF",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: addSlide,
      disabled: slides.length >= 20
    }, "\u30B9\u30E9\u30A4\u30C9\u3092\u8FFD\u52A0 (\u6700\u592720\u679A)"), slides.map(function (slide, index) {
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
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          margin: 0
        }
      }, /*#__PURE__*/React.createElement("strong", null, "\u30B9\u30E9\u30A4\u30C9 ", index + 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: "arrow-up-alt",
        onClick: function onClick() {
          return moveSlide(index, -1);
        },
        disabled: index === 0,
        label: "\u4E0A\u3078\u79FB\u52D5",
        size: "small"
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: "arrow-down-alt",
        onClick: function onClick() {
          return moveSlide(index, 1);
        },
        disabled: index === slides.length - 1,
        label: "\u4E0B\u3078\u79FB\u52D5",
        size: "small"
      }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(media) {
          // ★ HTTPS変換を適用
          var secureUrl = ensureHttps(media.url);
          updateSlide(index, 'pcImgUrl', secureUrl);
        },
        allowedTypes: ['image'],
        render: function render(_ref2) {
          var open = _ref2.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "PC\u7528\u753B\u50CF"), slide.pcImgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: ensureHttps(slide.pcImgUrl),
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
              return updateSlide(index, 'pcImgUrl', '');
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
      }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(m) {
          // ★ HTTPS変換を適用
          var secureUrl = ensureHttps(m.url);
          updateSlide(index, 'spImgUrl', secureUrl);
        },
        allowedTypes: ['image'],
        render: function render(_ref3) {
          var open = _ref3.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "\u30B9\u30DE\u30DB\u7528\u753B\u50CF(\u4EFB\u610F)"), slide.spImgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: ensureHttps(slide.spImgUrl),
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
              return updateSlide(index, 'spImgUrl', '');
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
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "alt\u30C6\u30AD\u30B9\u30C8",
        value: slide.altText,
        onChange: function onChange(v) {
          return updateSlide(index, 'altText', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AF\u5148URL (\u4EFB\u610F)",
        value: slide.linkUrl,
        onChange: function onChange(v) {
          return updateSlide(index, 'linkUrl', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeSlide(index);
        },
        disabled: slides.length <= 1,
        style: {
          marginTop: '10px'
        }
      }, "\u3053\u306E\u30B9\u30E9\u30A4\u30C9\u3092\u524A\u9664"));
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u8A73\u7D30\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30AA\u30FC\u30C8\u30D7\u30EC\u30A4\u306E\u9045\u5EF6 (\u30DF\u30EA\u79D2)",
      value: autoplayDelay,
      onChange: function onChange(v) {
        return setAttributes({
          autoplayDelay: v
        });
      },
      min: 100,
      max: 10000,
      step: 100
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5207\u308A\u66FF\u3048\u901F\u5EA6 (\u30DF\u30EA\u79D2)",
      value: sliderSpeed,
      onChange: function onChange(v) {
        return setAttributes({
          sliderSpeed: v
        });
      },
      min: 100,
      max: 5000,
      step: 100
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u30A8\u30D5\u30A7\u30AF\u30C8",
      value: sliderEffect,
      options: [{
        label: 'フェード',
        value: 'fade'
      }, {
        label: 'スライド',
        value: 'slide'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          sliderEffect: v
        });
      }
    }), sliderEffect === 'fade' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "CrossFade\u3092\u6709\u52B9\u306B\u3059\u308B",
      checked: crossFade,
      onChange: function onChange(v) {
        return setAttributes({
          crossFade: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30EB\u30FC\u30D7\u518D\u751F",
      checked: loop,
      onChange: function onChange(v) {
        return setAttributes({
          loop: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30E6\u30FC\u30B6\u30FC\u64CD\u4F5C\u3067\u30AA\u30FC\u30C8\u30D7\u30EC\u30A4\u505C\u6B62",
      help: "true \u306B\u3059\u308B\u3068\u30E6\u30FC\u30B6\u30FC\u64CD\u4F5C\u5F8C\u306B\u81EA\u52D5\u518D\u751F\u304C\u6B62\u307E\u308A\u307E\u3059",
      checked: disableOnInteraction,
      onChange: function onChange(v) {
        return setAttributes({
          disableOnInteraction: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3/\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\u3092\u8868\u793A",
      checked: showPagination,
      onChange: function onChange(v) {
        return setAttributes({
          showPagination: v
        });
      }
    }), showPagination && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u53EF\u80FD\u306B\u3059\u308B",
      checked: paginationClickable,
      onChange: function onChange(v) {
        return setAttributes({
          paginationClickable: v
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: paginationColor,
      onChangeComplete: function onChangeComplete(c) {
        return setAttributes({
          paginationColor: c.hex
        });
      },
      disableAlpha: true
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u524D\u3078/\u6B21\u3078\u30DC\u30BF\u30F3\u3092\u8868\u793A",
      checked: showNavigation,
      onChange: function onChange(v) {
        return setAttributes({
          showNavigation: v
        });
      }
    }), showNavigation && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "\u524D\u3078/\u6B21\u3078\u30DC\u30BF\u30F3\u306E\u8272"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: nextButtonColor,
      onChangeComplete: function onChangeComplete(c) {
        return setAttributes({
          nextButtonColor: c.hex
        });
      },
      disableAlpha: true
    })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "swiper-wrapper"
    }, slides.length > 0 && function () {
      var slide = slides[0];
      var pcImg = ensureHttps(slide.pcImgUrl);
      var spImg = ensureHttps(slide.spImgUrl || slide.pcImgUrl);
      return /*#__PURE__*/React.createElement("div", {
        className: "swiper-slide",
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement("picture", {
        className: "bg_img"
      }, /*#__PURE__*/React.createElement("source", {
        srcSet: spImg,
        media: "(max-width:800px)"
      }), /*#__PURE__*/React.createElement("source", {
        srcSet: pcImg,
        media: "(min-width:801px)"
      }), /*#__PURE__*/React.createElement("img", {
        src: pcImg,
        alt: slide.altText
      })));
    }()), showPagination && /*#__PURE__*/React.createElement("div", {
      className: "swiper-pagination"
    }), showNavigation && /*#__PURE__*/React.createElement("div", {
      className: "swiper-button-next"
    })), showPagination && paginationColor && /*#__PURE__*/React.createElement("style", null, "\n                        #".concat(blockId, " .swiper-pagination-bullet { background-color:").concat(paginationColor, "; }\n                        #").concat(blockId, " .swiper-button-next,\n                        #").concat(blockId, " .swiper-button-prev { color:").concat(nextButtonColor, "; }\n                    ")));
  },
  // ------------------------------------------------------------------
  // ▶ Save
  // ------------------------------------------------------------------
  save: function save(_ref4) {
    var attributes = _ref4.attributes;
    var blockId = attributes.blockId,
      slides = attributes.slides,
      layoutType = attributes.layoutType,
      maxWidth = attributes.maxWidth,
      autoplayDelay = attributes.autoplayDelay,
      sliderEffect = attributes.sliderEffect,
      crossFade = attributes.crossFade,
      loop = attributes.loop,
      disableOnInteraction = attributes.disableOnInteraction,
      showPagination = attributes.showPagination,
      paginationClickable = attributes.paginationClickable,
      showNavigation = attributes.showNavigation,
      sliderSpeed = attributes.sliderSpeed,
      paginationColor = attributes.paginationColor,
      nextButtonColor = attributes.nextButtonColor;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      id: blockId,
      className: layoutType === 'full' ? 'swiper paid-block-fv-9 max-w init-hide' : 'swiper paid-block-fv-9 init-hide',
      style: layoutType === 'fixed' ? {
        maxWidth: maxWidth
      } : {
        maxWidth: '100vw'
      }
    });

    /* ---------- Swiper 設定文字列（observer 追加） ---------------*/
    var swiperConfig = "\n(function(){\n    const selector = \"#".concat(blockId, "\";\n    const MAX_RETRY = 30; // 30 \xD7 150ms = 4.5s\n    let retry = 0;\n\n    const initSwiper = () => {\n        if ( typeof Swiper === \"undefined\" ) return false;\n        const already = document.querySelector(selector).swiper;\n        if ( already ) return true; // \u4E8C\u91CD\u521D\u671F\u5316\u3057\u306A\u3044\n\n        const config = {\n            loop: ").concat(loop, ",\n            effect: \"").concat(sliderEffect, "\",\n            speed: ").concat(sliderSpeed, ",\n            autoplay: {\n                delay: ").concat(autoplayDelay, ",\n                disableOnInteraction: ").concat(disableOnInteraction, "\n            },\n            observer: true,\n            observeParents: true,\n            ").concat(sliderEffect === 'fade' ? "fadeEffect: { crossFade: ".concat(crossFade, " },") : '', "\n            ").concat(showPagination ? "\n                pagination: {\n                    el: selector + \" .swiper-pagination\",\n                    clickable: ".concat(paginationClickable, "\n                },") : '', "\n            ").concat(showNavigation ? "\n                navigation: {\n                    nextEl: selector + \" .swiper-button-next\",\n                    prevEl: selector + \" .swiper-button-prev\"\n                }," : '', "\n        };\n        new Swiper( selector, config );\n        document.querySelector(selector).classList.remove(\"init-hide\");\n        return true;\n    };\n\n    /* \u2460 DOMContentLoaded \u76F4\u5F8C */\n    document.addEventListener(\"DOMContentLoaded\", initSwiper, { once:true });\n\n    /* \u2461 lw:swiperReady (\u65E2\u5B58\u4ED5\u7D44\u307F\u7DAD\u6301) */\n    window.addEventListener(\"lw:swiperReady\", initSwiper, { once:true });\n\n    /* \u2462 \u30DD\u30FC\u30EA\u30F3\u30B0\uFF08Swiper\u8AAD\u307F\u8FBC\u307F\u9045\u5EF6\u5BFE\u7B56\uFF09 */\n    const timer = setInterval(() => {\n        if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);\n    }, 150);\n\n    /* \u2463 \u305D\u308C\u3067\u3082\u5931\u6557\u3057\u305F\u3089 5s \u3067 init-hide \u3092\u89E3\u9664\u3057 static \u753B\u50CF\u8868\u793A */\n    setTimeout(() => {\n        const el = document.querySelector(selector);\n        if ( el ) el.classList.remove(\"init-hide\");\n    }, 5000);\n})();\n        ");

    /* ---------- JSX 出力 -----------------------------------------*/
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "swiper-wrapper"
    }, slides.map(function (slide, i) {
      // ★ フロントエンドでもHTTPS変換を適用（念のため）
      var pcImgUrl = ensureHttps(slide.pcImgUrl);
      var spImgUrl = ensureHttps(slide.spImgUrl || slide.pcImgUrl);
      var picture = /*#__PURE__*/React.createElement("picture", {
        className: "bg_img"
      }, /*#__PURE__*/React.createElement("source", {
        srcSet: spImgUrl,
        media: "(max-width:800px)"
      }), /*#__PURE__*/React.createElement("source", {
        srcSet: pcImgUrl,
        media: "(min-width:801px)"
      }), /*#__PURE__*/React.createElement("img", {
        src: pcImgUrl,
        alt: slide.altText
      }));
      return /*#__PURE__*/React.createElement("div", {
        className: "swiper-slide",
        key: i
      }, slide.linkUrl ? /*#__PURE__*/React.createElement("a", {
        href: slide.linkUrl,
        target: "_blank",
        rel: "noopener noreferrer"
      }, picture) : picture);
    })), showPagination && /*#__PURE__*/React.createElement("div", {
      className: "swiper-pagination"
    }), showNavigation && /*#__PURE__*/React.createElement("div", {
      className: "swiper-button-prev"
    }), showNavigation && /*#__PURE__*/React.createElement("div", {
      className: "swiper-button-next"
    }), /*#__PURE__*/React.createElement("script", {
      type: "text/javascript",
      dangerouslySetInnerHTML: {
        __html: swiperConfig
      }
    }), showPagination && paginationColor && /*#__PURE__*/React.createElement("style", null, "\n                        #".concat(blockId, " .swiper-pagination-bullet { background-color:").concat(paginationColor, "; }\n                        #").concat(blockId, " .swiper-button-next,\n                        #").concat(blockId, " .swiper-button-prev { color:").concat(nextButtonColor, "; }\n                    ")), /*#__PURE__*/React.createElement("noscript", null, /*#__PURE__*/React.createElement("style", null, "#".concat(blockId, "{opacity:1!important}"))));
  }
});

/***/ }),

/***/ "./src/paid-block-fv-9/editor.scss":
/*!*****************************************!*\
  !*** ./src/paid-block-fv-9/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-fv-9/style.scss":
/*!****************************************!*\
  !*** ./src/paid-block-fv-9/style.scss ***!
  \****************************************/
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

/***/ "./src/paid-block-fv-9/block.json":
/*!****************************************!*\
  !*** ./src/paid-block-fv-9/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-fv-9","version":"1.0.0","title":"FV 09 画像スライダー用ブロック","category":"lw-firstview","icon":"images-alt2","editorScript":"file:./paid-block-fv-9.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","supports":{"anchor":true},"attributes":{"blockId":{"type":"string"},"slides":{"type":"array","default":[{"pcImgUrl":"https://lite-word.com/sample_img/slide/1.webp","spImgUrl":"","altText":"スライド1のalt","linkUrl":""},{"pcImgUrl":"https://lite-word.com/sample_img/slide/2.webp","spImgUrl":"","altText":"スライド2のalt","linkUrl":""}]},"layoutType":{"type":"string","default":"full"},"maxWidth":{"type":"number","default":1200},"autoplayDelay":{"type":"number","default":3000},"sliderEffect":{"type":"string","default":"fade"},"crossFade":{"type":"boolean","default":true},"loop":{"type":"boolean","default":true},"disableOnInteraction":{"type":"boolean","default":false},"showPagination":{"type":"boolean","default":true},"paginationClickable":{"type":"boolean","default":true},"showNavigation":{"type":"boolean","default":true},"sliderSpeed":{"type":"number","default":1000},"paginationColor":{"type":"string","default":"#ffffff"},"nextButtonColor":{"type":"string","default":"#ffffff"}},"no":9}');

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
/******/ 			"paid-block-fv-9": 0,
/******/ 			"./style-paid-block-fv-9": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-fv-9"], () => (__webpack_require__("./src/paid-block-fv-9/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;