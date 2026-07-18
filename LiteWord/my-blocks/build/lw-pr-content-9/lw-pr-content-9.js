/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-pr-content-9/index.js":
/*!**************************************!*\
  !*** ./src/lw-pr-content-9/index.js ***!
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-content-9/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-pr-content-9/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-content-9/block.json");
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
 * LiteWord – lw-pr-content-9 : カードスライダー（Swiper）              *
 ************************************************************************/







(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  // ------------------------------------------------------------------
  // ▶ Edit
  // ------------------------------------------------------------------
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var blockId = attributes.blockId,
      slides = attributes.slides,
      autoplay = attributes.autoplay;

    /* ID を確定させる -----------------------------------------------*/
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      if (!blockId) {
        var uniqueId = "lw-pr-content-9-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        setAttributes({
          blockId: uniqueId
        });
      }
    }, []);

    /* スライド編集ヘルパー -----------------------------------------*/
    var updateSlide = function updateSlide(index, key, value) {
      var newSlides = slides.map(function (slide, i) {
        return i === index ? _objectSpread(_objectSpread({}, slide), {}, _defineProperty({}, key, value)) : slide;
      });
      setAttributes({
        slides: newSlides
      });
    };
    var addSlide = function addSlide() {
      if (slides.length < 20) {
        setAttributes({
          slides: [].concat(_toConsumableArray(slides), [{
            imgUrl: '',
            altText: '',
            title: 'タイトルテキスト',
            description: '説明テキストが入ります。',
            linkUrl: '',
            openNewTab: false
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
    var moveSlideUp = function moveSlideUp(index) {
      if (index === 0) return;
      var newSlides = _toConsumableArray(slides);
      var _ref2 = [newSlides[index], newSlides[index - 1]];
      newSlides[index - 1] = _ref2[0];
      newSlides[index] = _ref2[1];
      setAttributes({
        slides: newSlides
      });
    };
    var moveSlideDown = function moveSlideDown(index) {
      if (index === slides.length - 1) return;
      var newSlides = _toConsumableArray(slides);
      var _ref3 = [newSlides[index + 1], newSlides[index]];
      newSlides[index] = _ref3[0];
      newSlides[index + 1] = _ref3[1];
      setAttributes({
        slides: newSlides
      });
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      id: blockId,
      className: 'lw-pr-content-9'
    });

    /* ----------------------------------------------------------*/
    /* Gutenberg サイドバー                                       */
    /* ----------------------------------------------------------*/
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C0\u30FC\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u81EA\u52D5\u518D\u751F",
      checked: autoplay,
      onChange: function onChange(v) {
        return setAttributes({
          autoplay: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30B9\u30E9\u30A4\u30C9\u7BA1\u7406",
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
      }, /*#__PURE__*/React.createElement("strong", null, "\u30B9\u30E9\u30A4\u30C9 ", index + 1), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: '4px'
        }
      }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: function onClick() {
          return moveSlideUp(index);
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
          return moveSlideDown(index);
        },
        disabled: index === slides.length - 1,
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
          return updateSlide(index, 'imgUrl', media.url);
        },
        allowedTypes: ['image'],
        render: function render(_ref4) {
          var open = _ref4.open;
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "\u753B\u50CF"), slide.imgUrl ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
            src: slide.imgUrl,
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
              return updateSlide(index, 'imgUrl', '');
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
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "alt\u30C6\u30AD\u30B9\u30C8",
        value: slide.altText,
        onChange: function onChange(v) {
          return updateSlide(index, 'altText', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
        label: "\u30BF\u30A4\u30C8\u30EB (h3)",
        value: slide.title,
        onChange: function onChange(v) {
          return updateSlide(index, 'title', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
        label: "\u8AAC\u660E\u6587",
        value: slide.description,
        onChange: function onChange(v) {
          return updateSlide(index, 'description', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AF\u5148URL (\u4EFB\u610F)",
        value: slide.linkUrl,
        onChange: function onChange(v) {
          return updateSlide(index, 'linkUrl', v);
        }
      }), slide.linkUrl && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
        label: "\u65B0\u898F\u30BF\u30D6\u3067\u958B\u304F",
        checked: slide.openNewTab,
        onChange: function onChange(v) {
          return updateSlide(index, 'openNewTab', v);
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
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-content-9__wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-content-9-swiper",
      style: {
        display: 'flex',
        gap: '24px',
        overflow: 'hidden'
      }
    }, slides.map(function (slide, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: '0 0 calc(25% - 18px)',
          minWidth: '0'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "image"
      }, slide.imgUrl ? /*#__PURE__*/React.createElement("img", {
        src: slide.imgUrl,
        alt: slide.altText
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          background: '#eee',
          width: '100%',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '14px'
        }
      }, "\u753B\u50CF\u672A\u8A2D\u5B9A")), /*#__PURE__*/React.createElement("h3", null, slide.title), /*#__PURE__*/React.createElement("p", null, slide.description)));
    })))));
  },
  // ------------------------------------------------------------------
  // ▶ Save
  // ------------------------------------------------------------------
  save: function save(_ref5) {
    var attributes = _ref5.attributes;
    var blockId = attributes.blockId,
      slides = attributes.slides,
      autoplay = attributes.autoplay;

    /* 改行を <br> に変換するヘルパー */
    var nl2br = function nl2br(text) {
      if (!text) return null;
      return text.split('\n').reduce(function (acc, line, i) {
        if (i > 0) acc.push( /*#__PURE__*/React.createElement("br", {
          key: "br-".concat(i)
        }));
        acc.push(line);
        return acc;
      }, []);
    };
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      id: blockId,
      className: 'lw-pr-content-9 init-hide'
    });

    /* ---------- Swiper 設定文字列 --------------------------------*/
    var swiperConfig = "\n(function(){\n    var selector = \"#".concat(blockId, " .lw-pr-content-9-swiper\";\n    var MAX_RETRY = 30;\n    var retry = 0;\n\n    function initSwiper(){\n        if ( typeof Swiper === \"undefined\" ) return false;\n        var el = document.querySelector(selector);\n        if ( !el ) return false;\n        if ( el.swiper ) return true;\n\n        new Swiper( selector, {\n            slidesPerView: 4,\n            spaceBetween: 24,\n            loop: true,\n            ").concat(autoplay ? 'autoplay: { delay: 3000, disableOnInteraction: true },' : '', "\n            pagination: {\n                el: selector + \" .swiper-pagination\",\n                clickable: true\n            },\n            observer: true,\n            observeParents: true,\n            breakpoints: {\n                0:    { slidesPerView: 1, spaceBetween: 24 },\n                576:  { slidesPerView: 2, spaceBetween: 20 },\n                992:  { slidesPerView: 3, spaceBetween: 24 },\n                1200: { slidesPerView: 4, spaceBetween: 24 }\n            }\n        });\n        document.querySelector(\"#").concat(blockId, "\").classList.remove(\"init-hide\");\n        return true;\n    }\n\n    document.addEventListener(\"DOMContentLoaded\", initSwiper, { once:true });\n    window.addEventListener(\"lw:swiperReady\", initSwiper, { once:true });\n\n    var timer = setInterval(function(){\n        if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);\n    }, 150);\n\n    setTimeout(function(){\n        var el = document.querySelector(\"#").concat(blockId, "\");\n        if ( el ) el.classList.remove(\"init-hide\");\n    }, 5000);\n})();\n        ");

    /* ---------- JSX 出力 ----------------------------------------*/
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-content-9__wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "swiper lw-pr-content-9-swiper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "swiper-wrapper"
    }, slides.map(function (slide, i) {
      var innerContent = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "image"
      }, slide.imgUrl && /*#__PURE__*/React.createElement("img", {
        src: slide.imgUrl,
        alt: slide.altText
      })), /*#__PURE__*/React.createElement("h3", null, nl2br(slide.title)), /*#__PURE__*/React.createElement("p", null, nl2br(slide.description)));
      return /*#__PURE__*/React.createElement("div", {
        className: "swiper-slide",
        key: i
      }, slide.linkUrl ? /*#__PURE__*/React.createElement("a", {
        className: "item",
        href: slide.linkUrl,
        target: slide.openNewTab ? '_blank' : undefined,
        rel: slide.openNewTab ? 'noopener noreferrer' : undefined
      }, innerContent) : /*#__PURE__*/React.createElement("div", {
        className: "item"
      }, innerContent));
    })), /*#__PURE__*/React.createElement("div", {
      className: "swiper-pagination"
    }))), /*#__PURE__*/React.createElement("script", {
      type: "text/javascript",
      dangerouslySetInnerHTML: {
        __html: swiperConfig
      }
    }), /*#__PURE__*/React.createElement("noscript", null, /*#__PURE__*/React.createElement("style", null, "#".concat(blockId, "{opacity:1!important}"))));
  }
});

/***/ }),

/***/ "./src/lw-pr-content-9/editor.scss":
/*!*****************************************!*\
  !*** ./src/lw-pr-content-9/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-pr-content-9/style.scss":
/*!****************************************!*\
  !*** ./src/lw-pr-content-9/style.scss ***!
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

/***/ "./src/lw-pr-content-9/block.json":
/*!****************************************!*\
  !*** ./src/lw-pr-content-9/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-content-9","version":"1.0.0","title":"PR Content 9 カードスライダー","category":"lw-content","icon":"slides","editorScript":"file:./lw-pr-content-9.js","aiHint":{"description":"カードスライダー。画像+タイトル+説明のカードが横スクロール。実績・ポートフォリオ紹介に","excludeFromAutoSelect":false,"contentAttributes":["slides"],"imageAttributes":[]},"supports":{"anchor":true},"attributes":{"blockId":{"type":"string"},"autoplay":{"type":"boolean","default":false},"slides":{"type":"array","default":[{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false},{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false},{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false},{"imgUrl":"","altText":"","title":"タイトルテキスト","description":"説明テキストが入ります。ここに任意のテキストを入れてください。","linkUrl":"","openNewTab":false}]}},"no":9}');

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
/******/ 			"lw-pr-content-9": 0,
/******/ 			"./style-lw-pr-content-9": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-content-9"], () => (__webpack_require__("./src/lw-pr-content-9/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;