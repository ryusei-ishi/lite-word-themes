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

/***/ "@wordpress/rich-text":
/*!**********************************!*\
  !*** external ["wp","richText"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["richText"];

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
/*!****************************************!*\
  !*** ./src/font-anime-select/index.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * LiteWord – インラインアニメーション設定（RichText Format）
 * 完全版 2025-06-01
 * ------------------------------------------------------------
 *  • ツールバー第1階層（priority: 9）に固定
 *  • 発動条件／種類／時間／距離／遅延をポップオーバーで設定
 *  • useState + useEffect で UI 値を保持（選択直後に戻らない）
 *  • 「リセット」ボタンでアニメ関連クラスをすべて削除
 *    └ wp.components.Button を直接参照し WP バージョン差を解消
 * ----------------------------------------------------------- */






/* ※ Button は ESM で import せずに wp.components から取得 */
var Button = wp.components.Button;

/* ───────────────────────── 1. 選択肢 ───────────────────────── */
var triggerOptions = [{
  label: 'アニメーション無効',
  value: ''
}, {
  label: 'スクロール時',
  value: 'lw_anime lw_inline_block lw_scroll'
}, {
  label: '初回表示時',
  value: 'lw_anime lw_inline_block lw_loading'
}];
var animationOptions = [{
  label: 'なし',
  value: ''
}, {
  label: '下から現れる',
  value: 'lw-fade-up'
}, {
  label: '右から現れる',
  value: 'lw-fade-right'
}, {
  label: '左から現れる',
  value: 'lw-fade-left'
}, {
  label: '上から現れる',
  value: 'lw-fade-down'
}];

/* 0.1 – 5.0 s（0.1 刻み） */
var buildDurationOptions = function buildDurationOptions() {
  var list = [{
    label: 'なし',
    value: ''
  }];
  for (var i = 0.1; i <= 5.0001; i += 0.1) {
    var s = i.toFixed(1); // "0.1"–"5.0"
    list.push({
      label: "".concat(s, "\u79D2"),
      value: "dur-".concat(s.replace('.', '-'), "s")
    });
  }
  return list;
};

/* threshold / distance 用 10 – 200 px（10 px 刻み） */
var buildStepOptions = function buildStepOptions(prefix, step, max, defLabel) {
  var list = [{
    label: defLabel,
    value: ''
  }];
  for (var v = step; v <= max; v += step) {
    list.push({
      label: "".concat(v, "px"),
      value: "".concat(prefix, "-").concat(v)
    });
  }
  return list;
};
var animationDurationOptions = buildDurationOptions();
var thresholdOptions = buildStepOptions('threshold', 10, 200, 'デフォルト (80px)');
var delayOptions = buildDurationOptions().map(function (o) {
  return _objectSpread(_objectSpread({}, o), {}, {
    value: o.value.replace('dur-', 'delay-')
  });
});
var distanceOptions = buildStepOptions('dist', 10, 200, 'デフォルト (40px)');

/* ─────────────────────── 2. フォーマット登録 ─────────────────────── */
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.registerFormatType)('liteword/animation-combo', {
  /* 基本情報 */
  title: 'アニメーション設定',
  icon: 'format-image',
  tagName: 'span',
  className: 'lw_inline_animation',
  // 内部管理用
  priority: 9,
  // 第1階層
  __experimentalInsertAfter: 'core/link',
  attributes: {
    "class": 'class'
  },
  /* 編集 UI */edit: function edit(_ref) {
    var isActive = _ref.isActive,
      value = _ref.value,
      onChange = _ref.onChange;
    /* ポップオーバー開閉 */
    var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

    /* 現クラス解析 */
    var active = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.getActiveFormat)(value, 'liteword/animation-combo');
    var cls = active ? active.attributes["class"] || '' : '';
    var parsedTrigger = cls.includes('lw_scroll') ? 'lw_anime lw_inline_block lw_scroll' : cls.includes('lw_loading') ? 'lw_anime lw_inline_block lw_loading' : '';
    var currentAnim = (cls.match(/lw-fade-(up|right|left|down)/) || [''])[0];
    var currentDur = (cls.match(/dur-\d-\d?s/) || [''])[0];
    var currentThresh = (cls.match(/threshold-\d+/) || [''])[0];
    var currentDelay = (cls.match(/delay-\d-\d?s/) || [''])[0];
    var currentDistance = (cls.match(/dist-\d+/) || [''])[0];

    /* 発動条件だけ UI state を持つ（戻り抑制） */
    var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(parsedTrigger),
      _useState4 = _slicedToArray(_useState3, 2),
      uiTrigger = _useState4[0],
      setUiTrigger = _useState4[1];
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
      setUiTrigger(parsedTrigger);
    }, [cls]);

    /* ─── クラス適用 ─── */
    var apply = function apply() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$trigger = _ref2.trigger,
        trigger = _ref2$trigger === void 0 ? parsedTrigger : _ref2$trigger,
        _ref2$anim = _ref2.anim,
        anim = _ref2$anim === void 0 ? currentAnim : _ref2$anim,
        _ref2$dur = _ref2.dur,
        dur = _ref2$dur === void 0 ? currentDur : _ref2$dur,
        _ref2$thresh = _ref2.thresh,
        thresh = _ref2$thresh === void 0 ? currentThresh : _ref2$thresh,
        _ref2$delay = _ref2.delay,
        delay = _ref2$delay === void 0 ? currentDelay : _ref2$delay,
        _ref2$distance = _ref2.distance,
        distance = _ref2$distance === void 0 ? currentDistance : _ref2$distance;
      /* 既存フォーマット削除 */
      var newVal = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.removeFormat)(value, 'liteword/animation-combo');

      /* アニメ関連クラス排除 → ベースクラス生成 */
      var base = cls.split(' ').filter(Boolean).filter(function (c) {
        return !c.startsWith('lw_anime') && c !== 'lw_inline_block' && !c.startsWith('lw-fade-') && !c.startsWith('dur-') && !c.startsWith('threshold-') && !c.startsWith('delay-') && !c.startsWith('dist-');
      });
      var set = new Set(base);

      /* 無効でないときは新クラスを追加 */
      if (trigger) trigger.split(' ').forEach(function (t) {
        return set.add(t);
      });
      if (anim) set.add(anim);
      if (dur) set.add(dur);
      if (thresh) set.add(thresh);
      if (delay) set.add(delay);
      if (distance) set.add(distance);

      /* 管理用クラス（不要ならコメントアウト） */
      set.add('lw_inline_animation');

      /* フォーマット再適用 */
      newVal = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.applyFormat)(newVal, {
        type: 'liteword/animation-combo',
        attributes: {
          "class": Array.from(set).join(' ')
        }
      });
      onChange(newVal);
    };

    /* ─── リセット ─── */
    var reset = function reset() {
      /* フォーマット自体を削除 → 全クラス除去 */
      var cleared = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.removeFormat)(value, 'liteword/animation-combo');
      onChange(cleared);
      setUiTrigger('');
      setOpen(false);
    };

    /* ───────── JSX ───────── */
    return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichTextToolbarButton, {
      icon: "format-image",
      title: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u8A2D\u5B9A",
      isActive: isActive,
      onClick: function onClick() {
        return setOpen(!open);
      }
    }), open && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Popover, {
      onClose: function onClose() {
        return setOpen(false);
      },
      placement: "bottom",
      className: "lw-animation-settings-popover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-animation-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-select-group"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u767A\u52D5\u6761\u4EF6",
      value: uiTrigger,
      options: triggerOptions,
      onChange: function onChange(v) {
        setUiTrigger(v);
        apply({
          trigger: v
        });
      },
      className: "lw-select-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-select-group"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u7A2E\u985E",
      value: currentAnim,
      options: animationOptions,
      onChange: function onChange(v) {
        return apply({
          anim: v
        });
      },
      className: "lw-select-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-select-group"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u6642\u9593",
      value: currentDur,
      options: animationDurationOptions,
      onChange: function onChange(v) {
        return apply({
          dur: v
        });
      },
      className: "lw-select-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-select-group"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u8868\u793A\u958B\u59CB\u8DDD\u96E2 (\u30B9\u30AF\u30ED\u30FC\u30EB\u6642)",
      value: currentThresh,
      options: thresholdOptions,
      onChange: function onChange(v) {
        return apply({
          thresh: v
        });
      },
      className: "lw-select-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-select-group"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u79FB\u52D5\u8DDD\u96E2",
      value: currentDistance,
      options: distanceOptions,
      onChange: function onChange(v) {
        return apply({
          distance: v
        });
      },
      className: "lw-select-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "lw-select-group"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u9045\u5EF6\u6642\u9593",
      value: currentDelay,
      options: delayOptions,
      onChange: function onChange(v) {
        return apply({
          delay: v
        });
      },
      className: "lw-select-control"
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, {
      justify: "flex-end",
      className: "lw-reset-wrapper"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: reset,
      className: "lw-reset-button"
    }, "\u30EA\u30BB\u30C3\u30C8")))));
  }
});
/******/ })()
;