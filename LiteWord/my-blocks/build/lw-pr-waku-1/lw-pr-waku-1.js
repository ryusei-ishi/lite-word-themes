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

/***/ "./src/lw-pr-waku-1/block.json":
/*!*************************************!*\
  !*** ./src/lw-pr-waku-1/block.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-waku-1","version":"1.0.0","title":"枠 01","category":"lw-utility","icon":"feedback","description":"枠ブロック。背景色・背景画像・ボーダーを設定可能。","aiHint":{"description":"枠コンテナ。背景画像/色+InnerBlocksの枠囲み","excludeFromAutoSelect":true,"contentAttributes":[],"imageAttributes":["waku1BgImagePc","waku1BgImageSp"],"excludeReason":"InnerBlocksコンテナ。AI直接生成非推奨"},"supports":{"anchor":true,"className":true},"attributes":{"waku1JustifyContentPc":{"type":"string","default":"center"},"waku1JustifyContentSp":{"type":"string","default":""},"waku1MaxWidthPc":{"type":"number","default":1300},"waku1MaxWidthSp":{"type":"number","default":-1},"waku1PaddingTopPc":{"type":"number","default":24},"waku1PaddingRightPc":{"type":"number","default":24},"waku1PaddingBottomPc":{"type":"number","default":24},"waku1PaddingLeftPc":{"type":"number","default":24},"waku1PaddingTopSp":{"type":"number","default":-1},"waku1PaddingRightSp":{"type":"number","default":-1},"waku1PaddingBottomSp":{"type":"number","default":-1},"waku1PaddingLeftSp":{"type":"number","default":-1},"waku1BorderWidthPc":{"type":"number","default":2},"waku1BorderWidthSp":{"type":"number","default":-1},"waku1BorderStylePc":{"type":"string","default":"solid"},"waku1BorderStyleSp":{"type":"string","default":""},"waku1BorderColorPc":{"type":"string","default":"var(--color-main)"},"waku1BorderColorSp":{"type":"string","default":""},"waku1BorderRadiusPc":{"type":"array","default":[8,8,8,8]},"waku1BorderRadiusSp":{"type":"array","default":[]},"waku1BgTypePc":{"type":"string","default":"color"},"waku1BgTypeSp":{"type":"string","default":""},"waku1BgColorPc":{"type":"string","default":"#ffffff"},"waku1BgColorSp":{"type":"string","default":""},"waku1BgGradientPc":{"type":"string","default":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"},"waku1BgGradientSp":{"type":"string","default":""},"waku1BgOpacityPc":{"type":"number","default":100},"waku1BgOpacitySp":{"type":"number","default":-1},"waku1BgBlendModePc":{"type":"string","default":"normal"},"waku1BgBlendModeSp":{"type":"string","default":""},"waku1BgImagePc":{"type":"string","default":""},"waku1BgImageSp":{"type":"string","default":""},"waku1ImageEffect":{"type":"string","default":"none"},"waku1EffectGrayscale":{"type":"number","default":100},"waku1EffectSepia":{"type":"number","default":100},"waku1EffectBlur":{"type":"number","default":3},"waku1EffectBrightness":{"type":"number","default":130},"waku1EffectContrast":{"type":"number","default":150},"waku1EffectSaturate":{"type":"number","default":200},"waku1EffectInvert":{"type":"number","default":100},"waku1EffectHueRotate":{"type":"number","default":180},"waku1EffectOpacity":{"type":"number","default":50},"waku1MinHeightPc":{"type":"number","default":-1},"waku1MinHeightSp":{"type":"number","default":-1},"waku1AspectRatioPc":{"type":"number","default":0},"waku1AspectRatioSp":{"type":"number","default":-1},"waku1LinkUrl":{"type":"string","default":""},"waku1LinkNewTab":{"type":"boolean","default":false}},"editorScript":"file:./lw-pr-waku-1.js","no":1}');

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
/*!***********************************!*\
  !*** ./src/lw-pr-waku-1/index.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-waku-1/block.json");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * LiteWord – 枠 01
 * ------------------------------------------------------------
 *  • ブロック名 : wdl/lw-pr-waku-1
 *  • 枠ブロック（背景色・背景画像・ボーダー設定可能）
 * ----------------------------------------------------------- */





/* エフェクトオプション */
var effectOptions = [{
  label: "なし",
  value: "none"
}, {
  label: "グレースケール",
  value: "grayscale"
}, {
  label: "セピア",
  value: "sepia"
}, {
  label: "ぼかし",
  value: "blur"
}, {
  label: "明るさ",
  value: "brightness"
}, {
  label: "コントラスト",
  value: "contrast"
}, {
  label: "彩度",
  value: "saturate"
}, {
  label: "色相回転",
  value: "hue-rotate"
}, {
  label: "反転",
  value: "invert"
}, {
  label: "透明度",
  value: "opacity"
}];

/* ブレンドモードオプション */
var blendModeOptions = [{
  label: "通常",
  value: "normal"
}, {
  label: "乗算",
  value: "multiply"
}, {
  label: "スクリーン",
  value: "screen"
}, {
  label: "オーバーレイ",
  value: "overlay"
}, {
  label: "暗く",
  value: "darken"
}, {
  label: "明るく",
  value: "lighten"
}, {
  label: "覆い焼きカラー",
  value: "color-dodge"
}, {
  label: "焼き込みカラー",
  value: "color-burn"
}, {
  label: "ハードライト",
  value: "hard-light"
}, {
  label: "ソフトライト",
  value: "soft-light"
}, {
  label: "差の絶対値",
  value: "difference"
}, {
  label: "除外",
  value: "exclusion"
}, {
  label: "色相",
  value: "hue"
}, {
  label: "彩度",
  value: "saturation"
}, {
  label: "カラー",
  value: "color"
}, {
  label: "輝度",
  value: "luminosity"
}];

/* 背景タイプオプション */
var bgTypeOptions = [{
  label: "単色",
  value: "color"
}, {
  label: "グラデーション",
  value: "gradient"
}];

/* 旧バージョン（custom_wrap クラス）の保存関数を deprecated 用に抽出 */
var deprecatedSaveV1 = function deprecatedSaveV1(_ref) {
  var attributes = _ref.attributes;
  var waku1JustifyContentPc = attributes.waku1JustifyContentPc,
    waku1JustifyContentSp = attributes.waku1JustifyContentSp,
    waku1MaxWidthPc = attributes.waku1MaxWidthPc,
    waku1MaxWidthSp = attributes.waku1MaxWidthSp,
    waku1PaddingTopPc = attributes.waku1PaddingTopPc,
    waku1PaddingRightPc = attributes.waku1PaddingRightPc,
    waku1PaddingBottomPc = attributes.waku1PaddingBottomPc,
    waku1PaddingLeftPc = attributes.waku1PaddingLeftPc,
    waku1PaddingTopSp = attributes.waku1PaddingTopSp,
    waku1PaddingRightSp = attributes.waku1PaddingRightSp,
    waku1PaddingBottomSp = attributes.waku1PaddingBottomSp,
    waku1PaddingLeftSp = attributes.waku1PaddingLeftSp,
    waku1BorderWidthPc = attributes.waku1BorderWidthPc,
    waku1BorderWidthSp = attributes.waku1BorderWidthSp,
    waku1BorderStylePc = attributes.waku1BorderStylePc,
    waku1BorderStyleSp = attributes.waku1BorderStyleSp,
    waku1BorderColorPc = attributes.waku1BorderColorPc,
    waku1BorderColorSp = attributes.waku1BorderColorSp,
    waku1BorderRadiusPc = attributes.waku1BorderRadiusPc,
    waku1BorderRadiusSp = attributes.waku1BorderRadiusSp,
    waku1BgTypePc = attributes.waku1BgTypePc,
    waku1BgTypeSp = attributes.waku1BgTypeSp,
    waku1BgColorPc = attributes.waku1BgColorPc,
    waku1BgColorSp = attributes.waku1BgColorSp,
    waku1BgGradientPc = attributes.waku1BgGradientPc,
    waku1BgGradientSp = attributes.waku1BgGradientSp,
    waku1BgOpacityPc = attributes.waku1BgOpacityPc,
    waku1BgOpacitySp = attributes.waku1BgOpacitySp,
    waku1BgBlendModePc = attributes.waku1BgBlendModePc,
    waku1BgBlendModeSp = attributes.waku1BgBlendModeSp,
    waku1BgImagePc = attributes.waku1BgImagePc,
    waku1BgImageSp = attributes.waku1BgImageSp,
    waku1ImageEffect = attributes.waku1ImageEffect,
    waku1EffectGrayscale = attributes.waku1EffectGrayscale,
    waku1EffectSepia = attributes.waku1EffectSepia,
    waku1EffectBlur = attributes.waku1EffectBlur,
    waku1EffectBrightness = attributes.waku1EffectBrightness,
    waku1EffectContrast = attributes.waku1EffectContrast,
    waku1EffectSaturate = attributes.waku1EffectSaturate,
    waku1EffectInvert = attributes.waku1EffectInvert,
    waku1EffectHueRotate = attributes.waku1EffectHueRotate,
    waku1EffectOpacity = attributes.waku1EffectOpacity,
    waku1MinHeightPc = attributes.waku1MinHeightPc,
    waku1MinHeightSp = attributes.waku1MinHeightSp,
    waku1AspectRatioPc = attributes.waku1AspectRatioPc,
    waku1AspectRatioSp = attributes.waku1AspectRatioSp;
  var hasAspectRatioPc = waku1AspectRatioPc > 0;
  var aspectRatioPcVal = hasAspectRatioPc ? "100 / ".concat(waku1AspectRatioPc) : "auto";
  var hasAspectRatioSp = waku1AspectRatioSp > 0;
  var aspectRatioSpVal = hasAspectRatioSp ? "100 / ".concat(waku1AspectRatioSp) : hasAspectRatioPc ? aspectRatioPcVal : "auto";
  var getFilterStyle = function getFilterStyle(effect) {
    switch (effect) {
      case "grayscale":
        return "grayscale(".concat(waku1EffectGrayscale, "%)");
      case "sepia":
        return "sepia(".concat(waku1EffectSepia, "%)");
      case "blur":
        return "blur(".concat(waku1EffectBlur, "px)");
      case "brightness":
        return "brightness(".concat(waku1EffectBrightness, "%)");
      case "contrast":
        return "contrast(".concat(waku1EffectContrast, "%)");
      case "saturate":
        return "saturate(".concat(waku1EffectSaturate, "%)");
      case "hue-rotate":
        return "hue-rotate(".concat(waku1EffectHueRotate, "deg)");
      case "invert":
        return "invert(".concat(waku1EffectInvert, "%)");
      case "opacity":
        return "opacity(".concat(waku1EffectOpacity, "%)");
      default:
        return "none";
    }
  };
  var paddingPcVal = "".concat(waku1PaddingTopPc, "px ").concat(waku1PaddingRightPc, "px ").concat(waku1PaddingBottomPc, "px ").concat(waku1PaddingLeftPc, "px");
  var paddingSpVal = "".concat(waku1PaddingTopSp >= 0 ? waku1PaddingTopSp : waku1PaddingTopPc, "px ").concat(waku1PaddingRightSp >= 0 ? waku1PaddingRightSp : waku1PaddingRightPc, "px ").concat(waku1PaddingBottomSp >= 0 ? waku1PaddingBottomSp : waku1PaddingBottomPc, "px ").concat(waku1PaddingLeftSp >= 0 ? waku1PaddingLeftSp : waku1PaddingLeftPc, "px");
  var radiusPcArr = Array.isArray(waku1BorderRadiusPc) ? waku1BorderRadiusPc : [8, 8, 8, 8];
  var radiusSpArr = Array.isArray(waku1BorderRadiusSp) ? waku1BorderRadiusSp : [];
  var generateBorderRadiusValue = function generateBorderRadiusValue(arr) {
    if (arr.length <= 4) {
      return arr.map(function (v) {
        return "".concat(v, "px");
      }).join(" ");
    } else {
      var horizontal = arr.slice(0, 4).map(function (v) {
        return "".concat(v, "px");
      }).join(" ");
      var vertical = arr.slice(4, 8).map(function (v) {
        return "".concat(v, "px");
      }).join(" ");
      return "".concat(horizontal, " / ").concat(vertical);
    }
  };
  var borderRadiusPcVal = generateBorderRadiusValue(radiusPcArr);
  var borderRadiusSpVal = radiusSpArr.length > 0 ? generateBorderRadiusValue(radiusSpArr) : borderRadiusPcVal;
  var bgPcVal = waku1BgTypePc === "gradient" ? waku1BgGradientPc : waku1BgColorPc;
  var effectiveBgTypeSp = waku1BgTypeSp || waku1BgTypePc;
  var bgSpVal = effectiveBgTypeSp === "gradient" ? waku1BgGradientSp || waku1BgGradientPc : waku1BgColorSp || waku1BgColorPc;
  var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: "lw-pr-waku-1",
    style: {
      "--waku-1-justify-content-pc": waku1JustifyContentPc,
      "--waku-1-justify-content-sp": waku1JustifyContentSp || waku1JustifyContentPc
    }
  });
  var wrapStyle = {
    "--waku-1-max-width-pc": "".concat(waku1MaxWidthPc, "px"),
    "--waku-1-max-width-sp": waku1MaxWidthSp >= 0 ? "".concat(waku1MaxWidthSp, "px") : "".concat(waku1MaxWidthPc, "px"),
    "--waku-1-padding-pc": paddingPcVal,
    "--waku-1-padding-sp": paddingSpVal,
    "--waku-1-bd-width-pc": "".concat(waku1BorderWidthPc, "px"),
    "--waku-1-bd-width-sp": waku1BorderWidthSp >= 0 ? "".concat(waku1BorderWidthSp, "px") : "".concat(waku1BorderWidthPc, "px"),
    "--waku-1-bd-style-pc": waku1BorderStylePc,
    "--waku-1-bd-style-sp": waku1BorderStyleSp || waku1BorderStylePc,
    "--waku-1-bd-color-pc": waku1BorderColorPc,
    "--waku-1-bd-color-sp": waku1BorderColorSp || waku1BorderColorPc,
    "--waku-1-bdr-pc": borderRadiusPcVal,
    "--waku-1-bdr-sp": borderRadiusSpVal,
    "--waku-1-bg-pc": bgPcVal,
    "--waku-1-bg-sp": bgSpVal,
    "--waku-1-bg-opacity-pc": waku1BgOpacityPc / 100,
    "--waku-1-bg-opacity-sp": waku1BgOpacitySp >= 0 ? waku1BgOpacitySp / 100 : waku1BgOpacityPc / 100,
    "--waku-1-blend-mode-pc": waku1BgBlendModePc,
    "--waku-1-blend-mode-sp": waku1BgBlendModeSp || waku1BgBlendModePc,
    "--waku-1-bg-img-pc": waku1BgImagePc ? "url(".concat(waku1BgImagePc, ")") : "none",
    "--waku-1-bg-img-sp": waku1BgImageSp ? "url(".concat(waku1BgImageSp, ")") : waku1BgImagePc ? "url(".concat(waku1BgImagePc, ")") : "none",
    "--waku-1-img-filter-pc": getFilterStyle(waku1ImageEffect),
    "--waku-1-img-filter-sp": getFilterStyle(waku1ImageEffect),
    "--waku-1-min-height-pc": hasAspectRatioPc ? "auto" : waku1MinHeightPc >= 0 ? "".concat(waku1MinHeightPc, "px") : "auto",
    "--waku-1-min-height-sp": hasAspectRatioSp ? "auto" : hasAspectRatioPc ? "auto" : waku1MinHeightSp >= 0 ? "".concat(waku1MinHeightSp, "px") : waku1MinHeightPc >= 0 ? "".concat(waku1MinHeightPc, "px") : "auto",
    "--waku-1-aspect-ratio-pc": aspectRatioPcVal,
    "--waku-1-aspect-ratio-sp": aspectRatioSpVal
  };
  return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
    className: "custom_wrap",
    style: wrapStyle
  }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)));
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  deprecated: [{
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_3__.attributes,
    save: deprecatedSaveV1
  }],
  edit: function edit(_ref2) {
    var attributes = _ref2.attributes,
      setAttributes = _ref2.setAttributes;
    var waku1JustifyContentPc = attributes.waku1JustifyContentPc,
      waku1JustifyContentSp = attributes.waku1JustifyContentSp,
      waku1MaxWidthPc = attributes.waku1MaxWidthPc,
      waku1MaxWidthSp = attributes.waku1MaxWidthSp,
      waku1PaddingTopPc = attributes.waku1PaddingTopPc,
      waku1PaddingRightPc = attributes.waku1PaddingRightPc,
      waku1PaddingBottomPc = attributes.waku1PaddingBottomPc,
      waku1PaddingLeftPc = attributes.waku1PaddingLeftPc,
      waku1PaddingTopSp = attributes.waku1PaddingTopSp,
      waku1PaddingRightSp = attributes.waku1PaddingRightSp,
      waku1PaddingBottomSp = attributes.waku1PaddingBottomSp,
      waku1PaddingLeftSp = attributes.waku1PaddingLeftSp,
      waku1BorderWidthPc = attributes.waku1BorderWidthPc,
      waku1BorderWidthSp = attributes.waku1BorderWidthSp,
      waku1BorderStylePc = attributes.waku1BorderStylePc,
      waku1BorderStyleSp = attributes.waku1BorderStyleSp,
      waku1BorderColorPc = attributes.waku1BorderColorPc,
      waku1BorderColorSp = attributes.waku1BorderColorSp,
      waku1BorderRadiusPc = attributes.waku1BorderRadiusPc,
      waku1BorderRadiusSp = attributes.waku1BorderRadiusSp,
      waku1BgTypePc = attributes.waku1BgTypePc,
      waku1BgTypeSp = attributes.waku1BgTypeSp,
      waku1BgColorPc = attributes.waku1BgColorPc,
      waku1BgColorSp = attributes.waku1BgColorSp,
      waku1BgGradientPc = attributes.waku1BgGradientPc,
      waku1BgGradientSp = attributes.waku1BgGradientSp,
      waku1BgOpacityPc = attributes.waku1BgOpacityPc,
      waku1BgOpacitySp = attributes.waku1BgOpacitySp,
      waku1BgBlendModePc = attributes.waku1BgBlendModePc,
      waku1BgBlendModeSp = attributes.waku1BgBlendModeSp,
      waku1BgImagePc = attributes.waku1BgImagePc,
      waku1BgImageSp = attributes.waku1BgImageSp,
      waku1ImageEffect = attributes.waku1ImageEffect,
      waku1EffectGrayscale = attributes.waku1EffectGrayscale,
      waku1EffectSepia = attributes.waku1EffectSepia,
      waku1EffectBlur = attributes.waku1EffectBlur,
      waku1EffectBrightness = attributes.waku1EffectBrightness,
      waku1EffectContrast = attributes.waku1EffectContrast,
      waku1EffectSaturate = attributes.waku1EffectSaturate,
      waku1EffectInvert = attributes.waku1EffectInvert,
      waku1EffectHueRotate = attributes.waku1EffectHueRotate,
      waku1EffectOpacity = attributes.waku1EffectOpacity,
      waku1MinHeightPc = attributes.waku1MinHeightPc,
      waku1MinHeightSp = attributes.waku1MinHeightSp,
      waku1AspectRatioPc = attributes.waku1AspectRatioPc,
      waku1AspectRatioSp = attributes.waku1AspectRatioSp,
      waku1LinkUrl = attributes.waku1LinkUrl,
      waku1LinkNewTab = attributes.waku1LinkNewTab;

    // aspect-ratio値を生成（100 / X の形式、比率設定時はmin-heightをautoに）
    var hasAspectRatioPc = waku1AspectRatioPc > 0;
    var aspectRatioPcVal = hasAspectRatioPc ? "100 / ".concat(waku1AspectRatioPc) : "auto";
    var hasAspectRatioSp = waku1AspectRatioSp > 0;
    var aspectRatioSpVal = hasAspectRatioSp ? "100 / ".concat(waku1AspectRatioSp) : hasAspectRatioPc ? aspectRatioPcVal : "auto";

    /* エフェクトをCSSフィルターに変換 */
    var getFilterStyle = function getFilterStyle(effect) {
      switch (effect) {
        case "grayscale":
          return "grayscale(".concat(waku1EffectGrayscale, "%)");
        case "sepia":
          return "sepia(".concat(waku1EffectSepia, "%)");
        case "blur":
          return "blur(".concat(waku1EffectBlur, "px)");
        case "brightness":
          return "brightness(".concat(waku1EffectBrightness, "%)");
        case "contrast":
          return "contrast(".concat(waku1EffectContrast, "%)");
        case "saturate":
          return "saturate(".concat(waku1EffectSaturate, "%)");
        case "hue-rotate":
          return "hue-rotate(".concat(waku1EffectHueRotate, "deg)");
        case "invert":
          return "invert(".concat(waku1EffectInvert, "%)");
        case "opacity":
          return "opacity(".concat(waku1EffectOpacity, "%)");
        default:
          return "none";
      }
    };

    // padding値を生成
    var paddingPcVal = "".concat(waku1PaddingTopPc, "px ").concat(waku1PaddingRightPc, "px ").concat(waku1PaddingBottomPc, "px ").concat(waku1PaddingLeftPc, "px");
    var paddingSpVal = "".concat(waku1PaddingTopSp >= 0 ? waku1PaddingTopSp : waku1PaddingTopPc, "px ").concat(waku1PaddingRightSp >= 0 ? waku1PaddingRightSp : waku1PaddingRightPc, "px ").concat(waku1PaddingBottomSp >= 0 ? waku1PaddingBottomSp : waku1PaddingBottomPc, "px ").concat(waku1PaddingLeftSp >= 0 ? waku1PaddingLeftSp : waku1PaddingLeftPc, "px");

    // border-radius値を生成（配列の安全性チェック）
    var radiusPcArr = Array.isArray(waku1BorderRadiusPc) ? waku1BorderRadiusPc : [8, 8, 8, 8];
    var radiusSpArr = Array.isArray(waku1BorderRadiusSp) ? waku1BorderRadiusSp : [];
    var generateBorderRadiusValue = function generateBorderRadiusValue(arr) {
      if (arr.length <= 4) {
        return arr.map(function (v) {
          return "".concat(v, "px");
        }).join(" ");
      } else {
        var horizontal = arr.slice(0, 4).map(function (v) {
          return "".concat(v, "px");
        }).join(" ");
        var vertical = arr.slice(4, 8).map(function (v) {
          return "".concat(v, "px");
        }).join(" ");
        return "".concat(horizontal, " / ").concat(vertical);
      }
    };
    var borderRadiusPcVal = generateBorderRadiusValue(radiusPcArr);
    var borderRadiusSpVal = radiusSpArr.length > 0 ? generateBorderRadiusValue(radiusSpArr) : borderRadiusPcVal;

    // border-radius更新ヘルパー
    var updateBorderRadiusPc = function updateBorderRadiusPc(index, value) {
      var newRadii = _toConsumableArray(radiusPcArr);
      newRadii[index] = value;
      setAttributes({
        waku1BorderRadiusPc: newRadii
      });
    };
    var addVerticalRadiusPc = function addVerticalRadiusPc() {
      if (radiusPcArr.length === 4) {
        setAttributes({
          waku1BorderRadiusPc: [].concat(_toConsumableArray(radiusPcArr), [8, 8, 8, 8])
        });
      }
    };
    var removeVerticalRadiusPc = function removeVerticalRadiusPc() {
      if (radiusPcArr.length === 8) {
        setAttributes({
          waku1BorderRadiusPc: radiusPcArr.slice(0, 4)
        });
      }
    };
    var updateBorderRadiusSp = function updateBorderRadiusSp(index, value) {
      var newRadii = _toConsumableArray(radiusSpArr);
      newRadii[index] = value;
      setAttributes({
        waku1BorderRadiusSp: newRadii
      });
    };
    var addVerticalRadiusSp = function addVerticalRadiusSp() {
      if (radiusSpArr.length === 4) {
        setAttributes({
          waku1BorderRadiusSp: [].concat(_toConsumableArray(radiusSpArr), [8, 8, 8, 8])
        });
      } else if (radiusSpArr.length === 0) {
        setAttributes({
          waku1BorderRadiusSp: [8, 8, 8, 8, 8, 8, 8, 8]
        });
      }
    };
    var removeVerticalRadiusSp = function removeVerticalRadiusSp() {
      if (radiusSpArr.length === 8) {
        setAttributes({
          waku1BorderRadiusSp: radiusSpArr.slice(0, 4)
        });
      }
    };
    var initSpRadius = function initSpRadius() {
      setAttributes({
        waku1BorderRadiusSp: _toConsumableArray(radiusPcArr)
      });
    };

    // 背景値を生成（単色 or グラデーション）
    var bgPcVal = waku1BgTypePc === "gradient" ? waku1BgGradientPc : waku1BgColorPc;
    var effectiveBgTypeSp = waku1BgTypeSp || waku1BgTypePc;
    var bgSpVal = effectiveBgTypeSp === "gradient" ? waku1BgGradientSp || waku1BgGradientPc : waku1BgColorSp || waku1BgColorPc;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: "lw-pr-waku-1",
      style: {
        "--waku-1-justify-content-pc": waku1JustifyContentPc,
        "--waku-1-justify-content-sp": waku1JustifyContentSp || waku1JustifyContentPc
      }
    });
    var wrapStyle = {
      "--waku-1-max-width-pc": "".concat(waku1MaxWidthPc, "px"),
      "--waku-1-max-width-sp": waku1MaxWidthSp >= 0 ? "".concat(waku1MaxWidthSp, "px") : "".concat(waku1MaxWidthPc, "px"),
      "--waku-1-padding-pc": paddingPcVal,
      "--waku-1-padding-sp": paddingSpVal,
      "--waku-1-bd-width-pc": "".concat(waku1BorderWidthPc, "px"),
      "--waku-1-bd-width-sp": waku1BorderWidthSp >= 0 ? "".concat(waku1BorderWidthSp, "px") : "".concat(waku1BorderWidthPc, "px"),
      "--waku-1-bd-style-pc": waku1BorderStylePc,
      "--waku-1-bd-style-sp": waku1BorderStyleSp || waku1BorderStylePc,
      "--waku-1-bd-color-pc": waku1BorderColorPc,
      "--waku-1-bd-color-sp": waku1BorderColorSp || waku1BorderColorPc,
      "--waku-1-bdr-pc": borderRadiusPcVal,
      "--waku-1-bdr-sp": borderRadiusSpVal,
      "--waku-1-bg-pc": bgPcVal,
      "--waku-1-bg-sp": bgSpVal,
      "--waku-1-bg-opacity-pc": waku1BgOpacityPc / 100,
      "--waku-1-bg-opacity-sp": waku1BgOpacitySp >= 0 ? waku1BgOpacitySp / 100 : waku1BgOpacityPc / 100,
      "--waku-1-blend-mode-pc": waku1BgBlendModePc,
      "--waku-1-blend-mode-sp": waku1BgBlendModeSp || waku1BgBlendModePc,
      "--waku-1-bg-img-pc": waku1BgImagePc ? "url(".concat(waku1BgImagePc, ")") : "none",
      "--waku-1-bg-img-sp": waku1BgImageSp ? "url(".concat(waku1BgImageSp, ")") : waku1BgImagePc ? "url(".concat(waku1BgImagePc, ")") : "none",
      "--waku-1-img-filter-pc": getFilterStyle(waku1ImageEffect),
      "--waku-1-img-filter-sp": getFilterStyle(waku1ImageEffect),
      "--waku-1-min-height-pc": hasAspectRatioPc ? "auto" : waku1MinHeightPc >= 0 ? "".concat(waku1MinHeightPc, "px") : "auto",
      "--waku-1-min-height-sp": hasAspectRatioSp ? "auto" : hasAspectRatioPc ? "auto" : waku1MinHeightSp >= 0 ? "".concat(waku1MinHeightSp, "px") : waku1MinHeightPc >= 0 ? "".concat(waku1MinHeightPc, "px") : "auto",
      "--waku-1-aspect-ratio-pc": aspectRatioPcVal,
      "--waku-1-aspect-ratio-sp": aspectRatioSpVal
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u914D\u7F6E"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "PC",
      value: waku1JustifyContentPc,
      options: [{
        label: "左寄せ",
        value: "flex-start"
      }, {
        label: "中央",
        value: "center"
      }, {
        label: "右寄せ",
        value: "flex-end"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          waku1JustifyContentPc: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "SP\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09",
      value: waku1JustifyContentSp,
      options: [{
        label: "PC継承",
        value: ""
      }, {
        label: "左寄せ",
        value: "flex-start"
      }, {
        label: "中央",
        value: "center"
      }, {
        label: "右寄せ",
        value: "flex-end"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          waku1JustifyContentSp: v
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
    }, "\u6700\u5927\u5E45 (px)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC",
      value: waku1MaxWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1MaxWidthPc: v
        });
      },
      min: 400,
      max: 1300,
      step: 10
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (-1\u3067PC\u7D99\u627F)",
      value: waku1MaxWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1MaxWidthSp: v
        });
      },
      min: -1,
      max: 1300,
      step: 10
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u4F59\u767D\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A (px)",
      value: waku1PaddingTopPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingTopPc: v
        });
      },
      min: 0,
      max: 100,
      step: 2
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3 (px)",
      value: waku1PaddingRightPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingRightPc: v
        });
      },
      min: 0,
      max: 100,
      step: 2
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B (px)",
      value: waku1PaddingBottomPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingBottomPc: v
        });
      },
      min: 0,
      max: 100,
      step: 2
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6 (px)",
      value: waku1PaddingLeftPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingLeftPc: v
        });
      },
      min: 0,
      max: 100,
      step: 2
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP (-1\u3067PC\u7D99\u627F)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A (px)",
      value: waku1PaddingTopSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingTopSp: v
        });
      },
      min: -1,
      max: 100,
      step: 2
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53F3 (px)",
      value: waku1PaddingRightSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingRightSp: v
        });
      },
      min: -1,
      max: 100,
      step: 2
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B (px)",
      value: waku1PaddingBottomSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingBottomSp: v
        });
      },
      min: -1,
      max: 100,
      step: 2
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5DE6 (px)",
      value: waku1PaddingLeftSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1PaddingLeftSp: v
        });
      },
      min: -1,
      max: 100,
      step: 2
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DC\u30FC\u30C0\u30FC\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px)",
      value: waku1BorderWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BorderWidthPc: v
        });
      },
      min: 0,
      max: 20,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB",
      value: waku1BorderStylePc,
      options: [{
        label: "solid",
        value: "solid"
      }, {
        label: "dashed",
        value: "dashed"
      }, {
        label: "dotted",
        value: "dotted"
      }, {
        label: "double",
        value: "double"
      }, {
        label: "none",
        value: "none"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          waku1BorderStylePc: v
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: waku1BorderColorPc,
      onChange: function onChange(color) {
        return setAttributes({
          waku1BorderColorPc: color || "var(--color-main)"
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
    }, "SP\uFF08\u7A7A/-1\u3067PC\u7D99\u627F\uFF09"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u5E45 (px)",
      value: waku1BorderWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BorderWidthSp: v
        });
      },
      min: -1,
      max: 20,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30DC\u30FC\u30C0\u30FC\u30B9\u30BF\u30A4\u30EB",
      value: waku1BorderStyleSp,
      options: [{
        label: "PC継承",
        value: ""
      }, {
        label: "solid",
        value: "solid"
      }, {
        label: "dashed",
        value: "dashed"
      }, {
        label: "dotted",
        value: "dotted"
      }, {
        label: "double",
        value: "double"
      }, {
        label: "none",
        value: "none"
      }],
      onChange: function onChange(v) {
        return setAttributes({
          waku1BorderStyleSp: v
        });
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u30DC\u30FC\u30C0\u30FC\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: waku1BorderColorSp,
      onChange: function onChange(color) {
        return setAttributes({
          waku1BorderColorSp: color || ""
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u89D2\u4E38\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC - \u6C34\u5E73\u65B9\u5411"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "11px",
        color: "#757575",
        marginBottom: "8px"
      }
    }, "\u5DE6\u4E0A / \u53F3\u4E0A / \u53F3\u4E0B / \u5DE6\u4E0B"), radiusPcArr.slice(0, 4).map(function (radius, index) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
        key: "h-".concat(index),
        label: ["左上", "右上", "右下", "左下"][index],
        value: radius,
        onChange: function onChange(v) {
          return updateBorderRadiusPc(index, v);
        },
        min: 0,
        max: 200,
        step: 1
      });
    }), radiusPcArr.length === 8 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC - \u5782\u76F4\u65B9\u5411"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "11px",
        color: "#757575",
        marginBottom: "8px"
      }
    }, "\u6955\u5186\u5F62\u306E\u89D2\u4E38\u3092\u4F5C\u6210"), radiusPcArr.slice(4, 8).map(function (radius, index) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
        key: "v-".concat(index),
        label: ["左上", "右上", "右下", "左下"][index],
        value: radius,
        onChange: function onChange(v) {
          return updateBorderRadiusPc(index + 4, v);
        },
        min: 0,
        max: 200,
        step: 1
      });
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "12px"
      }
    }, radiusPcArr.length === 4 ? /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: addVerticalRadiusPc,
      style: {
        width: "100%"
      }
    }, "+ \u5782\u76F4\u65B9\u5411\u3092\u8FFD\u52A0\uFF08\u6955\u5186\u5F62\uFF09") : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "tertiary",
      isDestructive: true,
      onClick: removeVerticalRadiusPc,
      style: {
        width: "100%"
      }
    }, "\u5782\u76F4\u65B9\u5411\u3092\u524A\u9664")), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09"), radiusSpArr.length === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "12px",
        color: "#757575",
        marginBottom: "8px"
      }
    }, "PC\u8A2D\u5B9A\u3092\u7D99\u627F\u4E2D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: initSpRadius,
      style: {
        width: "100%"
      }
    }, "SP\u72EC\u81EA\u8A2D\u5B9A\u3092\u958B\u59CB")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "11px",
        color: "#757575",
        marginBottom: "8px"
      }
    }, "\u6C34\u5E73: \u5DE6\u4E0A / \u53F3\u4E0A / \u53F3\u4E0B / \u5DE6\u4E0B"), radiusSpArr.slice(0, 4).map(function (radius, index) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
        key: "sp-h-".concat(index),
        label: ["左上", "右上", "右下", "左下"][index],
        value: radius,
        onChange: function onChange(v) {
          return updateBorderRadiusSp(index, v);
        },
        min: 0,
        max: 200,
        step: 1
      });
    }), radiusSpArr.length === 8 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "12px 0"
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "11px",
        color: "#757575",
        marginBottom: "8px"
      }
    }, "\u5782\u76F4\u65B9\u5411"), radiusSpArr.slice(4, 8).map(function (radius, index) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
        key: "sp-v-".concat(index),
        label: ["左上", "右上", "右下", "左下"][index],
        value: radius,
        onChange: function onChange(v) {
          return updateBorderRadiusSp(index + 4, v);
        },
        min: 0,
        max: 200,
        step: 1
      });
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "12px",
        display: "flex",
        gap: "8px"
      }
    }, radiusSpArr.length === 4 ? /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: addVerticalRadiusSp,
      style: {
        flex: 1
      }
    }, "+ \u5782\u76F4\u8FFD\u52A0") : /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "tertiary",
      isDestructive: true,
      onClick: removeVerticalRadiusSp,
      style: {
        flex: 1
      }
    }, "\u5782\u76F4\u524A\u9664"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "tertiary",
      onClick: function onClick() {
        return setAttributes({
          waku1BorderRadiusSp: []
        });
      },
      style: {
        flex: 1
      }
    }, "PC\u7D99\u627F")))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u80CC\u666F\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u80CC\u666F\u30BF\u30A4\u30D7",
      value: waku1BgTypePc,
      options: bgTypeOptions,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgTypePc: v
        });
      }
    }), waku1BgTypePc === "color" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: waku1BgColorPc,
      onChange: function onChange(color) {
        return setAttributes({
          waku1BgColorPc: color || "#ffffff"
        });
      }
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30B0\u30E9\u30C7\u30FC\u30B7\u30E7\u30F3",
      value: waku1BgGradientPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgGradientPc: v
        });
      },
      help: "\u4F8B: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: "40px",
        background: waku1BgGradientPc,
        borderRadius: "4px",
        border: "1px solid #ccc",
        marginBottom: "8px"
      }
    })), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30D6\u30EC\u30F3\u30C9\u30E2\u30FC\u30C9",
      value: waku1BgBlendModePc,
      options: blendModeOptions,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgBlendModePc: v
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
    }, "\u900F\u660E\u5EA6 (%)"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC",
      value: waku1BgOpacityPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgOpacityPc: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (-1\u3067PC\u7D99\u627F)",
      value: waku1BgOpacitySp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgOpacitySp: v
        });
      },
      min: -1,
      max: 100,
      step: 1
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "SP\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u80CC\u666F\u30BF\u30A4\u30D7",
      value: waku1BgTypeSp,
      options: [{
        label: "PC継承",
        value: ""
      }].concat(bgTypeOptions),
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgTypeSp: v
        });
      }
    }), waku1BgTypeSp === "color" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: "8px"
      }
    }, "\u80CC\u666F\u8272"), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      value: waku1BgColorSp,
      onChange: function onChange(color) {
        return setAttributes({
          waku1BgColorSp: color || ""
        });
      }
    })), waku1BgTypeSp === "gradient" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30B0\u30E9\u30C7\u30FC\u30B7\u30E7\u30F3",
      value: waku1BgGradientSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgGradientSp: v
        });
      },
      help: "\u7A7A\u3067PC\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30D6\u30EC\u30F3\u30C9\u30E2\u30FC\u30C9",
      value: waku1BgBlendModeSp,
      options: [{
        label: "PC継承",
        value: ""
      }].concat(blendModeOptions),
      onChange: function onChange(v) {
        return setAttributes({
          waku1BgBlendModeSp: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u80CC\u666F\u753B\u50CF\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "PC"), waku1BgImagePc && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "10px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: waku1BgImagePc,
      alt: "\u80CC\u666F\u753B\u50CFPC",
      style: {
        width: "100%",
        maxHeight: "150px",
        objectFit: "cover",
        border: "1px solid #ccc"
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          waku1BgImagePc: media.url
        });
      },
      allowedTypes: ["image"],
      render: function render(_ref3) {
        var open = _ref3.open;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            gap: "8px"
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: open
        }, "\u753B\u50CF\u3092\u9078\u629E"), waku1BgImagePc && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: function onClick() {
            return setAttributes({
              waku1BgImagePc: ""
            });
          }
        }, "\u524A\u9664"));
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
    }, "SP\uFF08\u7A7A\u3067PC\u7D99\u627F\uFF09"), waku1BgImageSp && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "10px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: waku1BgImageSp,
      alt: "\u80CC\u666F\u753B\u50CFSP",
      style: {
        width: "100%",
        maxHeight: "150px",
        objectFit: "cover",
        border: "1px solid #ccc"
      }
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          waku1BgImageSp: media.url
        });
      },
      allowedTypes: ["image"],
      render: function render(_ref4) {
        var open = _ref4.open;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            gap: "8px"
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: open
        }, "\u753B\u50CF\u3092\u9078\u629E"), waku1BgImageSp && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: function onClick() {
            return setAttributes({
              waku1BgImageSp: ""
            });
          }
        }, "\u524A\u9664"));
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u30A8\u30D5\u30A7\u30AF\u30C8",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30A8\u30D5\u30A7\u30AF\u30C8",
      value: waku1ImageEffect,
      options: effectOptions,
      onChange: function onChange(v) {
        return setAttributes({
          waku1ImageEffect: v
        });
      }
    }), waku1ImageEffect === "grayscale" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30B0\u30EC\u30FC\u30B9\u30B1\u30FC\u30EB : ".concat(waku1EffectGrayscale, "%"),
      value: waku1EffectGrayscale,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectGrayscale: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), waku1ImageEffect === "sepia" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30BB\u30D4\u30A2 : ".concat(waku1EffectSepia, "%"),
      value: waku1EffectSepia,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectSepia: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), waku1ImageEffect === "blur" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u307C\u304B\u3057 : ".concat(waku1EffectBlur, "px"),
      value: waku1EffectBlur,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectBlur: v
        });
      },
      min: 0,
      max: 20,
      step: 0.5
    }), waku1ImageEffect === "brightness" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u660E\u308B\u3055 : ".concat(waku1EffectBrightness, "%"),
      value: waku1EffectBrightness,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectBrightness: v
        });
      },
      min: 0,
      max: 300,
      step: 5,
      help: "100% = \u901A\u5E38\u3001100%\u672A\u6E80 = \u6697\u304F\u3001100%\u8D85 = \u660E\u308B\u304F"
    }), waku1ImageEffect === "contrast" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30B3\u30F3\u30C8\u30E9\u30B9\u30C8 : ".concat(waku1EffectContrast, "%"),
      value: waku1EffectContrast,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectContrast: v
        });
      },
      min: 0,
      max: 300,
      step: 5,
      help: "100% = \u901A\u5E38"
    }), waku1ImageEffect === "saturate" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5F69\u5EA6 : ".concat(waku1EffectSaturate, "%"),
      value: waku1EffectSaturate,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectSaturate: v
        });
      },
      min: 0,
      max: 300,
      step: 5,
      help: "100% = \u901A\u5E38\u30010% = \u30B0\u30EC\u30FC\u30B9\u30B1\u30FC\u30EB"
    }), waku1ImageEffect === "hue-rotate" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u8272\u76F8\u56DE\u8EE2 : ".concat(waku1EffectHueRotate, "deg"),
      value: waku1EffectHueRotate,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectHueRotate: v
        });
      },
      min: 0,
      max: 360,
      step: 5
    }), waku1ImageEffect === "invert" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53CD\u8EE2 : ".concat(waku1EffectInvert, "%"),
      value: waku1EffectInvert,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectInvert: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), waku1ImageEffect === "opacity" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u900F\u660E\u5EA6 : ".concat(waku1EffectOpacity, "%"),
      value: waku1EffectOpacity,
      onChange: function onChange(v) {
        return setAttributes({
          waku1EffectOpacity: v
        });
      },
      min: 0,
      max: 100,
      step: 1,
      help: "100% = \u4E0D\u900F\u660E\u30010% = \u5B8C\u5168\u306B\u900F\u660E"
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u9AD8\u3055\u30FB\u7E26\u4F4D\u7F6E\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "min-height (px)"), hasAspectRatioPc && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "11px",
        color: "#d63638",
        marginBottom: "8px"
      }
    }, "\u203B \u6BD4\u7387\u8A2D\u5B9A\u4E2D\u306E\u305F\u3081auto\u306B\u306A\u308A\u307E\u3059"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC (-1\u3067auto)",
      value: waku1MinHeightPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1MinHeightPc: v
        });
      },
      min: -1,
      max: 800,
      step: 10,
      disabled: hasAspectRatioPc
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (-1\u3067PC\u7D99\u627F)",
      value: waku1MinHeightSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1MinHeightSp: v
        });
      },
      min: -1,
      max: 800,
      step: 10,
      disabled: hasAspectRatioSp || hasAspectRatioPc
    }), /*#__PURE__*/React.createElement("hr", {
      style: {
        margin: "16px 0"
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 4,
      style: {
        marginBottom: "8px"
      }
    }, "\u6BD4\u7387 (aspect-ratio: 100 / X)"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "11px",
        color: "#757575",
        marginBottom: "8px"
      }
    }, "0\u3088\u308A\u5927\u304D\u3044\u5024\u3067\u9069\u7528\u3002\u8A2D\u5B9A\u6642\u306Fmin-height\u304Cauto\u306B\u306A\u308A\u307E\u3059"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "PC (0\u3067\u7121\u52B9)",
      value: waku1AspectRatioPc,
      onChange: function onChange(v) {
        return setAttributes({
          waku1AspectRatioPc: v
        });
      },
      min: 0,
      max: 200,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "SP (-1\u3067PC\u7D99\u627F)",
      value: waku1AspectRatioSp,
      onChange: function onChange(v) {
        return setAttributes({
          waku1AspectRatioSp: v
        });
      },
      min: -1,
      max: 200,
      step: 1
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30EA\u30F3\u30AF\u8A2D\u5B9A",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u30EA\u30F3\u30AFURL",
      value: waku1LinkUrl,
      onChange: function onChange(v) {
        return setAttributes({
          waku1LinkUrl: v
        });
      },
      placeholder: "https://example.com",
      help: "\u8A2D\u5B9A\u3059\u308B\u3068\u67A0\u5168\u4F53\u304C\u30EA\u30F3\u30AF\u306B\u306A\u308A\u307E\u3059"
    }), waku1LinkUrl && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u65B0\u3057\u3044\u30BF\u30D6\u3067\u958B\u304F",
      checked: waku1LinkNewTab,
      onChange: function onChange(v) {
        return setAttributes({
          waku1LinkNewTab: v
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "lw-pr-waku-1__custom_wrap",
      style: wrapStyle
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
      template: [["core/paragraph", {}]],
      renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender
    }))));
  },
  save: function save(_ref5) {
    var attributes = _ref5.attributes;
    var waku1JustifyContentPc = attributes.waku1JustifyContentPc,
      waku1JustifyContentSp = attributes.waku1JustifyContentSp,
      waku1MaxWidthPc = attributes.waku1MaxWidthPc,
      waku1MaxWidthSp = attributes.waku1MaxWidthSp,
      waku1PaddingTopPc = attributes.waku1PaddingTopPc,
      waku1PaddingRightPc = attributes.waku1PaddingRightPc,
      waku1PaddingBottomPc = attributes.waku1PaddingBottomPc,
      waku1PaddingLeftPc = attributes.waku1PaddingLeftPc,
      waku1PaddingTopSp = attributes.waku1PaddingTopSp,
      waku1PaddingRightSp = attributes.waku1PaddingRightSp,
      waku1PaddingBottomSp = attributes.waku1PaddingBottomSp,
      waku1PaddingLeftSp = attributes.waku1PaddingLeftSp,
      waku1BorderWidthPc = attributes.waku1BorderWidthPc,
      waku1BorderWidthSp = attributes.waku1BorderWidthSp,
      waku1BorderStylePc = attributes.waku1BorderStylePc,
      waku1BorderStyleSp = attributes.waku1BorderStyleSp,
      waku1BorderColorPc = attributes.waku1BorderColorPc,
      waku1BorderColorSp = attributes.waku1BorderColorSp,
      waku1BorderRadiusPc = attributes.waku1BorderRadiusPc,
      waku1BorderRadiusSp = attributes.waku1BorderRadiusSp,
      waku1BgTypePc = attributes.waku1BgTypePc,
      waku1BgTypeSp = attributes.waku1BgTypeSp,
      waku1BgColorPc = attributes.waku1BgColorPc,
      waku1BgColorSp = attributes.waku1BgColorSp,
      waku1BgGradientPc = attributes.waku1BgGradientPc,
      waku1BgGradientSp = attributes.waku1BgGradientSp,
      waku1BgOpacityPc = attributes.waku1BgOpacityPc,
      waku1BgOpacitySp = attributes.waku1BgOpacitySp,
      waku1BgBlendModePc = attributes.waku1BgBlendModePc,
      waku1BgBlendModeSp = attributes.waku1BgBlendModeSp,
      waku1BgImagePc = attributes.waku1BgImagePc,
      waku1BgImageSp = attributes.waku1BgImageSp,
      waku1ImageEffect = attributes.waku1ImageEffect,
      waku1EffectGrayscale = attributes.waku1EffectGrayscale,
      waku1EffectSepia = attributes.waku1EffectSepia,
      waku1EffectBlur = attributes.waku1EffectBlur,
      waku1EffectBrightness = attributes.waku1EffectBrightness,
      waku1EffectContrast = attributes.waku1EffectContrast,
      waku1EffectSaturate = attributes.waku1EffectSaturate,
      waku1EffectInvert = attributes.waku1EffectInvert,
      waku1EffectHueRotate = attributes.waku1EffectHueRotate,
      waku1EffectOpacity = attributes.waku1EffectOpacity,
      waku1MinHeightPc = attributes.waku1MinHeightPc,
      waku1MinHeightSp = attributes.waku1MinHeightSp,
      waku1AspectRatioPc = attributes.waku1AspectRatioPc,
      waku1AspectRatioSp = attributes.waku1AspectRatioSp,
      waku1LinkUrl = attributes.waku1LinkUrl,
      waku1LinkNewTab = attributes.waku1LinkNewTab;

    // aspect-ratio値を生成（100 / X の形式、比率設定時はmin-heightをautoに）
    var hasAspectRatioPc = waku1AspectRatioPc > 0;
    var aspectRatioPcVal = hasAspectRatioPc ? "100 / ".concat(waku1AspectRatioPc) : "auto";
    var hasAspectRatioSp = waku1AspectRatioSp > 0;
    var aspectRatioSpVal = hasAspectRatioSp ? "100 / ".concat(waku1AspectRatioSp) : hasAspectRatioPc ? aspectRatioPcVal : "auto";

    /* エフェクトをCSSフィルターに変換 */
    var getFilterStyle = function getFilterStyle(effect) {
      switch (effect) {
        case "grayscale":
          return "grayscale(".concat(waku1EffectGrayscale, "%)");
        case "sepia":
          return "sepia(".concat(waku1EffectSepia, "%)");
        case "blur":
          return "blur(".concat(waku1EffectBlur, "px)");
        case "brightness":
          return "brightness(".concat(waku1EffectBrightness, "%)");
        case "contrast":
          return "contrast(".concat(waku1EffectContrast, "%)");
        case "saturate":
          return "saturate(".concat(waku1EffectSaturate, "%)");
        case "hue-rotate":
          return "hue-rotate(".concat(waku1EffectHueRotate, "deg)");
        case "invert":
          return "invert(".concat(waku1EffectInvert, "%)");
        case "opacity":
          return "opacity(".concat(waku1EffectOpacity, "%)");
        default:
          return "none";
      }
    };

    // padding値を生成
    var paddingPcVal = "".concat(waku1PaddingTopPc, "px ").concat(waku1PaddingRightPc, "px ").concat(waku1PaddingBottomPc, "px ").concat(waku1PaddingLeftPc, "px");
    var paddingSpVal = "".concat(waku1PaddingTopSp >= 0 ? waku1PaddingTopSp : waku1PaddingTopPc, "px ").concat(waku1PaddingRightSp >= 0 ? waku1PaddingRightSp : waku1PaddingRightPc, "px ").concat(waku1PaddingBottomSp >= 0 ? waku1PaddingBottomSp : waku1PaddingBottomPc, "px ").concat(waku1PaddingLeftSp >= 0 ? waku1PaddingLeftSp : waku1PaddingLeftPc, "px");

    // border-radius値を生成
    var radiusPcArr = Array.isArray(waku1BorderRadiusPc) ? waku1BorderRadiusPc : [8, 8, 8, 8];
    var radiusSpArr = Array.isArray(waku1BorderRadiusSp) ? waku1BorderRadiusSp : [];
    var generateBorderRadiusValue = function generateBorderRadiusValue(arr) {
      if (arr.length <= 4) {
        return arr.map(function (v) {
          return "".concat(v, "px");
        }).join(" ");
      } else {
        var horizontal = arr.slice(0, 4).map(function (v) {
          return "".concat(v, "px");
        }).join(" ");
        var vertical = arr.slice(4, 8).map(function (v) {
          return "".concat(v, "px");
        }).join(" ");
        return "".concat(horizontal, " / ").concat(vertical);
      }
    };
    var borderRadiusPcVal = generateBorderRadiusValue(radiusPcArr);
    var borderRadiusSpVal = radiusSpArr.length > 0 ? generateBorderRadiusValue(radiusSpArr) : borderRadiusPcVal;

    // 背景値を生成（単色 or グラデーション）
    var bgPcVal = waku1BgTypePc === "gradient" ? waku1BgGradientPc : waku1BgColorPc;
    var effectiveBgTypeSp = waku1BgTypeSp || waku1BgTypePc;
    var bgSpVal = effectiveBgTypeSp === "gradient" ? waku1BgGradientSp || waku1BgGradientPc : waku1BgColorSp || waku1BgColorPc;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: "lw-pr-waku-1",
      style: {
        "--waku-1-justify-content-pc": waku1JustifyContentPc,
        "--waku-1-justify-content-sp": waku1JustifyContentSp || waku1JustifyContentPc
      }
    });
    var wrapStyle = {
      "--waku-1-max-width-pc": "".concat(waku1MaxWidthPc, "px"),
      "--waku-1-max-width-sp": waku1MaxWidthSp >= 0 ? "".concat(waku1MaxWidthSp, "px") : "".concat(waku1MaxWidthPc, "px"),
      "--waku-1-padding-pc": paddingPcVal,
      "--waku-1-padding-sp": paddingSpVal,
      "--waku-1-bd-width-pc": "".concat(waku1BorderWidthPc, "px"),
      "--waku-1-bd-width-sp": waku1BorderWidthSp >= 0 ? "".concat(waku1BorderWidthSp, "px") : "".concat(waku1BorderWidthPc, "px"),
      "--waku-1-bd-style-pc": waku1BorderStylePc,
      "--waku-1-bd-style-sp": waku1BorderStyleSp || waku1BorderStylePc,
      "--waku-1-bd-color-pc": waku1BorderColorPc,
      "--waku-1-bd-color-sp": waku1BorderColorSp || waku1BorderColorPc,
      "--waku-1-bdr-pc": borderRadiusPcVal,
      "--waku-1-bdr-sp": borderRadiusSpVal,
      "--waku-1-bg-pc": bgPcVal,
      "--waku-1-bg-sp": bgSpVal,
      "--waku-1-bg-opacity-pc": waku1BgOpacityPc / 100,
      "--waku-1-bg-opacity-sp": waku1BgOpacitySp >= 0 ? waku1BgOpacitySp / 100 : waku1BgOpacityPc / 100,
      "--waku-1-blend-mode-pc": waku1BgBlendModePc,
      "--waku-1-blend-mode-sp": waku1BgBlendModeSp || waku1BgBlendModePc,
      "--waku-1-bg-img-pc": waku1BgImagePc ? "url(".concat(waku1BgImagePc, ")") : "none",
      "--waku-1-bg-img-sp": waku1BgImageSp ? "url(".concat(waku1BgImageSp, ")") : waku1BgImagePc ? "url(".concat(waku1BgImagePc, ")") : "none",
      "--waku-1-img-filter-pc": getFilterStyle(waku1ImageEffect),
      "--waku-1-img-filter-sp": getFilterStyle(waku1ImageEffect),
      "--waku-1-min-height-pc": hasAspectRatioPc ? "auto" : waku1MinHeightPc >= 0 ? "".concat(waku1MinHeightPc, "px") : "auto",
      "--waku-1-min-height-sp": hasAspectRatioSp ? "auto" : hasAspectRatioPc ? "auto" : waku1MinHeightSp >= 0 ? "".concat(waku1MinHeightSp, "px") : waku1MinHeightPc >= 0 ? "".concat(waku1MinHeightPc, "px") : "auto",
      "--waku-1-aspect-ratio-pc": aspectRatioPcVal,
      "--waku-1-aspect-ratio-sp": aspectRatioSpVal
    };
    var WrapTag = waku1LinkUrl ? "a" : "div";
    var wrapProps = _objectSpread({
      className: "lw-pr-waku-1__custom_wrap",
      style: wrapStyle
    }, waku1LinkUrl ? _objectSpread({
      href: waku1LinkUrl
    }, waku1LinkNewTab ? {
      target: "_blank",
      rel: "noopener noreferrer"
    } : {}) : {});
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(WrapTag, wrapProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)));
  }
});
/******/ })()
;