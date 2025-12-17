/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-lw-gallery-3/index.js":
/*!**********************************************!*\
  !*** ./src/paid-block-lw-gallery-3/index.js ***!
  \**********************************************/
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-lw-gallery-3/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-lw-gallery-3/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-lw-gallery-3/block.json");
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
/*********************************************************************
 * LiteWord – Paid Block  Gallery 03（シンプル版・角丸 & 矢印色対応）
 * ★ apiVersion 3 対応（2025-12-07）
 * - メイン ＋ サムネイル連動 Swiper
 * - Swiper の CDN 読み込みはテーマ側 JS で実施（lw:swiperReady）
 * 2025-05-24  改修：画像角丸・ボタン背景色・矢印色をサイドバー設定可能に
 * 2025-05-24  追加：max-width（% → px 切替）・キャプション背景色設定
 * 2025-05-24  追加：アスペクト比（高さ px）を RangeControl で変更
 * 2025-05-24  修正：ID依存をやめてdata属性ベースに変更
 *********************************************************************/








/* SVG アイコン（前後共通・左右反転で使用） */
var ArrowSVG = function ArrowSVG() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#fff';
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512",
    width: "24",
    height: "24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z",
    fill: color
  }));
};

/* ================================================================ */
/*  ▶ ブロック登録                                                   */
/* ================================================================ */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var images = attributes.images,
      borderRadiusEm = attributes.borderRadiusEm,
      btnBgColor = attributes.btnBgColor,
      arrowColor = attributes.arrowColor,
      maxWidthPx = attributes.maxWidthPx,
      captionBgColor = attributes.captionBgColor,
      aspectHeightPx = attributes.aspectHeightPx;

    /* 画像操作 */
    var updateImage = function updateImage(idx, key, value) {
      setAttributes({
        images: images.map(function (img, i) {
          return i === idx ? _objectSpread(_objectSpread({}, img), {}, _defineProperty({}, key, value)) : img;
        })
      });
    };
    var addImage = function addImage() {
      return images.length < 20 && setAttributes({
        images: [].concat(_toConsumableArray(images), [{
          url: '',
          alt: '',
          caption: ''
        }])
      });
    };
    var removeImage = function removeImage(idx) {
      return images.length > 1 && setAttributes({
        images: images.filter(function (_, i) {
          return i !== idx;
        })
      });
    };
    var moveImageUp = function moveImageUp(idx) {
      if (idx === 0) return;
      var newImages = _toConsumableArray(images);
      var _ref2 = [newImages[idx], newImages[idx - 1]];
      newImages[idx - 1] = _ref2[0];
      newImages[idx] = _ref2[1];
      setAttributes({
        images: newImages
      });
    };
    var moveImageDown = function moveImageDown(idx) {
      if (idx === images.length - 1) return;
      var newImages = _toConsumableArray(images);
      var _ref3 = [newImages[idx + 1], newImages[idx]];
      newImages[idx] = _ref3[0];
      newImages[idx + 1] = _ref3[1];
      setAttributes({
        images: newImages
      });
    };

    // useBlockProps で apiVersion 3 対応
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'paid-block-lw-gallery-3 editor-preview',
      style: {
        maxWidth: maxWidthPx ? "".concat(maxWidthPx, "px") : '100%'
      }
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u753B\u50CF\u89D2\u4E38 (em)",
      min: 0,
      max: 3,
      step: 0.1,
      value: borderRadiusEm,
      onChange: function onChange(v) {
        return setAttributes({
          borderRadiusEm: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u6A2A\u5E45 max-width (px)",
      help: "0 = 100%\uFF08\u521D\u671F\u5024\uFF09",
      min: 0,
      max: 1600,
      step: 10,
      value: maxWidthPx,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthPx: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30A2\u30B9\u30DA\u30AF\u30C8\u6BD4\uFF08\u9AD8\u3055 px\uFF09",
      help: "\u5E45 1080px \u306B\u5BFE\u3059\u308B\u9AD8\u3055",
      min: 300,
      max: 1200,
      step: 10,
      value: aspectHeightPx,
      onChange: function onChange(v) {
        return setAttributes({
          aspectHeightPx: v
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em',
        marginBottom: '0.5em'
      }
    }, "\u30DC\u30BF\u30F3\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: btnBgColor,
      onChange: function onChange(c) {
        return setAttributes({
          btnBgColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em',
        marginBottom: '0.5em'
      }
    }, "\u77E2\u5370\u30AB\u30E9\u30FC"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: arrowColor,
      onChange: function onChange(c) {
        return setAttributes({
          arrowColor: c
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: '1em',
        marginBottom: '0.5em'
      }
    }, "\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: captionBgColor,
      onChange: function onChange(c) {
        return setAttributes({
          captionBgColor: c
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u7BA1\u7406",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: addImage,
      disabled: images.length >= 20
    }, "\u753B\u50CF\u3092\u8FFD\u52A0 (\u6700\u592720\u679A)"), images.map(function (img, idx) {
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
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
      }, /*#__PURE__*/React.createElement("strong", null, "\u753B\u50CF ", idx + 1), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: '4px'
        }
      }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: function onClick() {
          return moveImageUp(idx);
        },
        disabled: idx === 0,
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
          return moveImageDown(idx);
        },
        disabled: idx === images.length - 1,
        style: {
          width: '32px',
          height: '32px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, "\u2193"))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(m) {
          return updateImage(idx, 'url', m.url);
        },
        allowedTypes: ['image'],
        render: function render(_ref4) {
          var open = _ref4.open;
          return img.url ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: img.url,
            alt: "",
            style: {
              maxWidth: '100%',
              borderRadius: "".concat(borderRadiusEm, "em")
            }
          }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: open,
            style: {
              marginTop: '10px'
            }
          }, "\u5909\u66F4"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: function onClick() {
              return updateImage(idx, 'url', '');
            },
            style: {
              marginLeft: '10px',
              marginTop: '10px'
            }
          }, "\u524A\u9664")) : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: open
          }, "\u753B\u50CF\u3092\u9078\u629E");
        }
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "alt\u30C6\u30AD\u30B9\u30C8",
        value: img.alt,
        onChange: function onChange(v) {
          return updateImage(idx, 'alt', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3 (\u4EFB\u610F)",
        value: img.caption,
        onChange: function onChange(v) {
          return updateImage(idx, 'caption', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeImage(idx);
        },
        disabled: images.length <= 1,
        style: {
          marginTop: '10px'
        }
      }, "\u3053\u306E\u753B\u50CF\u3092\u524A\u9664"));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "paid-block-lw-gallery-3__inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "swiper lw-gallery_images_Swiper_main editor-preview",
      style: {
        aspectRatio: "1080 / ".concat(aspectHeightPx)
      }
    }, images[0] && /*#__PURE__*/React.createElement("img", {
      src: images[0].url,
      alt: images[0].alt,
      style: {
        maxWidth: '100%',
        borderRadius: "".concat(borderRadiusEm, "em")
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "swiper lw-gallery_images_Swiper_sub editor-preview"
    }, images.slice(0, 5).map(function (img, i) {
      return /*#__PURE__*/React.createElement("img", {
        key: i,
        src: img.url,
        alt: img.alt,
        style: {
          maxWidth: '100%',
          marginRight: '4px',
          borderRadius: "".concat(borderRadiusEm, "em")
        }
      });
    }))));
  },
  /* -------------------------------------------------------------- */
  /*  ▶ Save                                                        */
  /* -------------------------------------------------------------- */
  save: function save(_ref5) {
    var attributes = _ref5.attributes;
    var images = attributes.images,
      borderRadiusEm = attributes.borderRadiusEm,
      btnBgColor = attributes.btnBgColor,
      arrowColor = attributes.arrowColor,
      maxWidthPx = attributes.maxWidthPx,
      captionBgColor = attributes.captionBgColor,
      aspectHeightPx = attributes.aspectHeightPx;
    var slideCount = images.length;

    // useBlockProps.save() で apiVersion 3 対応
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'paid-block-lw-gallery-3 init-hide',
      style: {
        maxWidth: maxWidthPx ? "".concat(maxWidthPx, "px") : '100%'
      }
    });
    var swiperInit = "\n(function(){\n\t// \u5168\u3066\u306E\u30AE\u30E3\u30E9\u30EA\u30FC\u3092\u521D\u671F\u5316\n\tconst initAllGalleries = () => {\n\t\t// \u307E\u3060\u521D\u671F\u5316\u3055\u308C\u3066\u3044\u306A\u3044\u30AE\u30E3\u30E9\u30EA\u30FC\u3092\u5168\u3066\u53D6\u5F97\n\t\tconst galleries = document.querySelectorAll('.paid-block-lw-gallery-3:not([data-swiper-initialized])');\n\t\t\n\t\tgalleries.forEach((wrapper) => {\n\t\t\tconst mainEl = wrapper.querySelector('.lw-gallery_images_Swiper_main');\n\t\t\tif (!mainEl || typeof Swiper === 'undefined') return;\n\t\t\t\n\t\t\t// \u521D\u671F\u5316\u6E08\u307F\u30DE\u30FC\u30AF\u3092\u4ED8\u3051\u308B\n\t\t\twrapper.setAttribute('data-swiper-initialized', 'true');\n\t\t\t\n\t\t\tconst slideCount = parseInt(mainEl.dataset.slideCount || '0', 10);\n\t\t\tconst mainLoopFlg = slideCount > 1;\n\t\t\t\n\t\t\tlet thumbsSwiper = null;\n\t\t\tif (mainLoopFlg) {\n\t\t\t\tconst thumbEl = wrapper.querySelector('.lw-gallery_images_Swiper_sub');\n\t\t\t\tif (thumbEl) {\n\t\t\t\t\t// \u30B5\u30E0\u30CD\u30A4\u30EB\u306E\u30EB\u30FC\u30D7\u306F\u3001\u30B9\u30E9\u30A4\u30C9\u6570\u304C\u8868\u793A\u6570\u306E2\u500D\u4EE5\u4E0A\u306E\u5834\u5408\u306E\u307F\u6709\u52B9\n\t\t\t\t\tconst thumbSlidesPerView = Math.min(slideCount, 5);\n\t\t\t\t\tconst thumbLoopFlg = slideCount >= (thumbSlidesPerView * 2);\n\t\t\t\t\t\n\t\t\t\t\tthumbsSwiper = new Swiper(thumbEl, {\n\t\t\t\t\t\tloop: thumbLoopFlg,\n\t\t\t\t\t\tspaceBetween: 4,\n\t\t\t\t\t\tslidesPerView: thumbSlidesPerView,\n\t\t\t\t\t\tfreeMode: true,\n\t\t\t\t\t\twatchSlidesProgress: true\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t\tnew Swiper(mainEl, {\n\t\t\t\tloop: mainLoopFlg,\n\t\t\t\tspaceBetween: 0,\n\t\t\t\tnavigation: mainLoopFlg ? {\n\t\t\t\t\tnextEl: wrapper.querySelector('.swiper-button-next'),\n\t\t\t\t\tprevEl: wrapper.querySelector('.swiper-button-prev')\n\t\t\t\t} : {},\n\t\t\t\tthumbs: mainLoopFlg && thumbsSwiper ? { swiper: thumbsSwiper } : {}\n\t\t\t});\n\t\t\t\n\t\t\twrapper.classList.remove('init-hide');\n\t\t});\n\t};\n\t\n\t// \u521D\u671F\u5316\u3092\u78BA\u5B9F\u306B\u5B9F\u884C\n\tconst tryInit = () => {\n\t\tif (typeof Swiper !== 'undefined') {\n\t\t\tinitAllGalleries();\n\t\t} else {\n\t\t\twindow.addEventListener('lw:swiperReady', initAllGalleries, { once: true });\n\t\t}\n\t};\n\t\n\t// DOMContentLoaded\u307E\u305F\u306F\u5373\u5EA7\u306B\u5B9F\u884C\n\tif (document.readyState === 'loading') {\n\t\tdocument.addEventListener('DOMContentLoaded', tryInit);\n\t} else {\n\t\ttryInit();\n\t}\n})();";
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "swiper lw-gallery_images_Swiper_main",
      "data-slide-count": slideCount
      /* アスペクト比を inline で反映 */,
      style: {
        aspectRatio: "1080 / ".concat(aspectHeightPx)
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "swiper-wrapper"
    }, images.map(function (img, idx) {
      return /*#__PURE__*/React.createElement("div", {
        className: "swiper-slide",
        key: idx,
        style: {
          borderRadius: "".concat(borderRadiusEm, "em")
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: img.url,
        alt: img.alt
      }), img.caption && /*#__PURE__*/React.createElement("figcaption", {
        style: {
          backgroundColor: captionBgColor
        }
      }, img.caption));
    })), slideCount > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "swiper-button-next",
      style: {
        backgroundColor: btnBgColor
      }
    }, ArrowSVG(arrowColor)), /*#__PURE__*/React.createElement("div", {
      className: "swiper-button-prev",
      style: {
        backgroundColor: btnBgColor,
        transform: 'scaleX(-1)'
      }
    }, ArrowSVG(arrowColor)))), slideCount > 1 && /*#__PURE__*/React.createElement("div", {
      className: "swiper lw-gallery_images_Swiper_sub image_count_".concat(slideCount),
      "data-slide-count": slideCount
    }, /*#__PURE__*/React.createElement("div", {
      className: "swiper-wrapper"
    }, images.map(function (img, idx) {
      return /*#__PURE__*/React.createElement("div", {
        className: "swiper-slide",
        key: idx,
        style: {
          borderRadius: "".concat(borderRadiusEm, "em")
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: img.url,
        alt: img.alt
      }));
    }))), /*#__PURE__*/React.createElement("script", {
      type: "text/javascript",
      dangerouslySetInnerHTML: {
        __html: swiperInit
      }
    }), /*#__PURE__*/React.createElement("noscript", null, /*#__PURE__*/React.createElement("style", null, ".paid-block-lw-gallery-3{opacity:1!important}")));
  }
});

/***/ }),

/***/ "./src/paid-block-lw-gallery-3/editor.scss":
/*!*************************************************!*\
  !*** ./src/paid-block-lw-gallery-3/editor.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-lw-gallery-3/style.scss":
/*!************************************************!*\
  !*** ./src/paid-block-lw-gallery-3/style.scss ***!
  \************************************************/
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

/***/ "./src/paid-block-lw-gallery-3/block.json":
/*!************************************************!*\
  !*** ./src/paid-block-lw-gallery-3/block.json ***!
  \************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-lw-gallery-3","version":"1.0.0","title":"Gallery 03 画像ギャラリー","category":"lw-banner","icon":"format-gallery","supports":{"anchor":true},"attributes":{"images":{"type":"array","default":[{"url":"https://lite-word.com/sample_img/shop/1.webp","alt":"ギャラリー画像1","caption":""},{"url":"https://lite-word.com/sample_img/shop/2.webp","alt":"ギャラリー画像2","caption":""},{"url":"https://lite-word.com/sample_img/shop/3.webp","alt":"ギャラリー画像3","caption":""},{"url":"https://lite-word.com/sample_img/shop/4.webp","alt":"ギャラリー画像4","caption":""},{"url":"https://lite-word.com/sample_img/shop/5.webp","alt":"ギャラリー画像5","caption":""}]},"borderRadiusEm":{"type":"number","default":0},"btnBgColor":{"type":"string","default":"var(--color-main)"},"arrowColor":{"type":"string","default":"#ffffff"},"maxWidthPx":{"type":"number","default":0},"captionBgColor":{"type":"string","default":"rgba(0,0,0,0.6)"},"aspectHeightPx":{"type":"number","default":700}},"editorScript":"file:./paid-block-lw-gallery-3.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":3}');

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
/******/ 			"paid-block-lw-gallery-3": 0,
/******/ 			"./style-paid-block-lw-gallery-3": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-lw-gallery-3"], () => (__webpack_require__("./src/paid-block-lw-gallery-3/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;